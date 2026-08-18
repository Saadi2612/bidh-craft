import "./lib/error-capture";

import { consumeLastCapturedError } from "./lib/error-capture";
import { renderErrorPage } from "./lib/error-page";
import { purgeSiteContent } from "./lib/cms/cache";

type ServerEntry = {
  fetch: (request: Request, env: unknown, ctx: unknown) => Promise<Response> | Response;
};

let serverEntryPromise: Promise<ServerEntry> | undefined;

async function getServerEntry(): Promise<ServerEntry> {
  if (!serverEntryPromise) {
    serverEntryPromise = import("@tanstack/react-start/server-entry").then(
      (m) => (m.default ?? m) as ServerEntry,
    );
  }
  return serverEntryPromise;
}

// h3 swallows in-handler throws into a normal 500 Response with body
// {"unhandled":true,"message":"HTTPError"} — try/catch alone never fires for those.
async function normalizeCatastrophicSsrResponse(response: Response): Promise<Response> {
  if (response.status < 500) return response;
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) return response;

  const body = await response.clone().text();
  if (!isH3SwallowedErrorBody(body)) return response;

  console.error(consumeLastCapturedError() ?? new Error(`h3 swallowed SSR error: ${body}`));
  return new Response(renderErrorPage(), {
    status: 500,
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}

function isH3SwallowedErrorBody(body: string): boolean {
  try {
    const payload = JSON.parse(body) as { unhandled?: unknown; message?: unknown };
    return payload.unhandled === true && payload.message === "HTTPError";
  } catch {
    return false;
  }
}

/**
 * Lets the CMS tell us its content changed, instead of waiting out the cache
 * TTL. Only clears the cache in the process that receives the call, so the TTL
 * in `lib/cms/cache.ts` remains the guarantee — this just makes edits show up
 * sooner in the common single-instance case.
 */
function handleRevalidate(request: Request, env: unknown): Response | null {
  const url = new URL(request.url);
  if (url.pathname !== "/api/revalidate" || request.method !== "POST") return null;

  const bindings = (env ?? {}) as Record<string, unknown>;
  const expected =
    (typeof bindings["SITE_REVALIDATE_SECRET"] === "string"
      ? bindings["SITE_REVALIDATE_SECRET"]
      : undefined) ?? process.env["SITE_REVALIDATE_SECRET"];

  // Without a configured secret the endpoint stays closed rather than open.
  if (!expected) return new Response("Not found", { status: 404 });
  if (request.headers.get("x-revalidate-secret") !== expected) {
    return new Response("Forbidden", { status: 403 });
  }

  purgeSiteContent();
  return Response.json({ revalidated: true });
}

export default {
  async fetch(request: Request, env: unknown, ctx: unknown) {
    try {
      const revalidated = handleRevalidate(request, env);
      if (revalidated) return revalidated;

      const handler = await getServerEntry();
      const response = await handler.fetch(request, env, ctx);
      return await normalizeCatastrophicSsrResponse(response);
    } catch (error) {
      console.error(error);
      return new Response(renderErrorPage(), {
        status: 500,
        headers: { "content-type": "text/html; charset=utf-8" },
      });
    }
  },
};
