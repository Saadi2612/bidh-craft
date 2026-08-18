import type { PayloadRequest } from "payload";

/**
 * Tells the storefront to drop its cached content snapshot.
 *
 * The site caches the whole catalog in memory, so without this ping an edit
 * here would take up to the cache TTL to show up. Fired and forgotten — a slow
 * or unreachable site must never make saving in the admin hang.
 */
export const revalidateSite = ({ req }: { req: PayloadRequest }): void => {
  const siteUrl = process.env.SITE_URL;
  const secret = process.env.REVALIDATE_SECRET;
  if (!siteUrl || !secret) return;

  void fetch(`${siteUrl.replace(/\/$/, "")}/api/revalidate`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-revalidate-secret": secret,
    },
    body: JSON.stringify({ at: Date.now() }),
    signal: AbortSignal.timeout(4000),
  }).catch((err: unknown) => {
    req.payload.logger.warn({ err }, "Could not reach the site to refresh its content cache");
  });
};
