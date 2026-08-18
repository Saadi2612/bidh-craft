import { fallbackContent } from "./fallback";
import type { SiteContent } from "./types";

const CMS_URL = (import.meta.env["VITE_CMS_URL"] as string | undefined)?.replace(/\/$/, "");

/** How long a snapshot is served without checking the CMS again. */
const FRESH_MS = 60_000;
/** How long a stale snapshot may still be served while it refreshes behind the scenes. */
const STALE_MS = 24 * 60 * 60 * 1000;
/** A slow CMS must not hold up a page render. */
const TIMEOUT_MS = 6_000;

type Snapshot = {
  content: SiteContent;
  fetchedAt: number;
  /** False when this is the bundled fallback rather than live CMS data. */
  live: boolean;
};

let snapshot: Snapshot | null = null;
let inflight: Promise<Snapshot> | null = null;

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
      return next;
    })
    .catch((err: unknown) => {
      console.error("[cms] content refresh failed", err);
      // Keep serving whatever we already had; only fall back if we have nothing.
      const fallback: Snapshot = snapshot ?? {
        content: fallbackContent,
        fetchedAt: Date.now(),
        live: false,
      };
      snapshot = { ...fallback, fetchedAt: Date.now() };
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
  const current = snapshot;
  const age = current ? Date.now() - current.fetchedAt : Infinity;

  if (current && age < FRESH_MS) {
    return { content: current.content, live: current.live };
  }

  if (current && age < STALE_MS) {
    void refresh();
    return { content: current.content, live: current.live };
  }

  const next = await refresh();
  return { content: next.content, live: next.live };
}

/** Drops the cached snapshot so the next render pulls fresh content. */
export function purgeSiteContent(): void {
  snapshot = null;
}

export const cmsConfigured = Boolean(CMS_URL);
