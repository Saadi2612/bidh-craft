import { fallbackContent } from "./fallback";
import type { SiteContent } from "./types";

const CMS_URL = (import.meta.env["VITE_CMS_URL"] as string | undefined)?.replace(/\/$/, "");

/** How long a snapshot is served without checking the CMS again. */
const FRESH_MS = 60_000;
/** How long a stale snapshot may still be served while it refreshes behind the scenes. */
const STALE_MS = 24 * 60 * 60 * 1000;
/**
 * A slow CMS must not hold up a page render — but it must not be given up on
 * before it can answer either. A warm CMS replies in well under a second; a
 * cold serverless start plus the Mongo connection has been measured at 7.3s,
 * so anything under that silently turns every cold start into fallback content.
 */
const TIMEOUT_MS = 15_000;
/** How long to leave a failing CMS alone before trying it again. */
const RETRY_MS = 30_000;

type Snapshot = {
  content: SiteContent;
  fetchedAt: number;
  /** False when this is the bundled fallback rather than live CMS data. */
  live: boolean;
};

let snapshot: Snapshot | null = null;
let inflight: Promise<Snapshot> | null = null;
/** Set after a failure so a down CMS is not hammered once per render. */
let nextAttemptAt = 0;

async function fetchContent(): Promise<Snapshot> {
  if (!CMS_URL) {
    return { content: fallbackContent, fetchedAt: Date.now(), live: false };
  }

  const res = await fetch(`${CMS_URL}/api/site-content`, {
    headers: { accept: "application/json" },
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });
  if (!res.ok) throw new Error(`CMS responded ${res.status}`);

  const content = (await res.json()) as SiteContent;
  if (!content?.settings || !Array.isArray(content.products)) {
    throw new Error("CMS returned an unexpected shape");
  }
  return { content, fetchedAt: Date.now(), live: true };
}

function refresh(): Promise<Snapshot> {
  inflight ??= fetchContent()
    .then((next) => {
      snapshot = next;
      nextAttemptAt = 0;
      return next;
    })
    .catch((err: unknown) => {
      console.error("[cms] content refresh failed", err);
      nextAttemptAt = Date.now() + RETRY_MS;
      // Keep serving whatever we already had; only fall back if we have nothing.
      // Deliberately *not* re-stamping `fetchedAt`: a failure must never count
      // as a fresh read, or one timeout pins this process to stale content for
      // a full freshness window and hides the outage.
      snapshot ??= { content: fallbackContent, fetchedAt: Date.now(), live: false };
      return snapshot;
    })
    .finally(() => {
      inflight = null;
    });
  return inflight;
}

/**
 * Returns the whole site's content, cached in the server process.
 *
 * One CMS request serves every page and every visitor for the freshness window.
 * Past that window a stale copy is returned immediately while a refresh runs in
 * the background, so no visitor ever waits on the CMS.
 */
export async function getSiteContent(): Promise<{ content: SiteContent; live: boolean }> {
  if (!CMS_URL) {
    return { content: fallbackContent, live: false };
  }

  const current = snapshot;
  const now = Date.now();
  const age = current ? now - current.fetchedAt : Infinity;
  const mayAttempt = now >= nextAttemptAt;

  if (current?.live && age < FRESH_MS) {
    return { content: current.content, live: current.live };
  }

  // Fallback content is a stopgap, never something to settle into: retry as
  // soon as the backoff is up, and wait for the answer, since a background
  // refresh can be frozen with the serverless instance before it resolves.
  if (current && !current.live) {
    if (!mayAttempt) return { content: current.content, live: false };
    const next = await refresh();
    return { content: next.content, live: next.live };
  }

  if (current && age < STALE_MS) {
    if (mayAttempt) void refresh();
    return { content: current.content, live: current.live };
  }

  const next = await refresh();
  return { content: next.content, live: next.live };
}

/** Drops the cached snapshot so the next render pulls fresh content. */
export function purgeSiteContent(): void {
  snapshot = null;
  // An explicit purge is a signal that the CMS has just changed, so drop any
  // backoff left over from an earlier failure and let the next render retry.
  nextAttemptAt = 0;
}

export const cmsConfigured = Boolean(CMS_URL);
