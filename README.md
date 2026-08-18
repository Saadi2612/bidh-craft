# THEBIDHCRAFT

Two apps in one repo:

| Folder | What it is | Runs on |
| --- | --- | --- |
| `.` (root) | The storefront — TanStack Start + Vite | Cloudflare / Lovable |
| `cms/` | Payload 3 admin panel and content API | Vercel |

They are deployed separately and share exactly one contract: the storefront
calls `GET <VITE_CMS_URL>/api/site-content` and renders whatever comes back.

## Storefront

```bash
bun install
bun run dev          # http://localhost:8080
```

Copy `.env.example` to `.env` and point `VITE_CMS_URL` at your CMS. **With no
CMS configured the site still runs** — it renders the bundled content in
`src/lib/cms/fallback.ts`, which is the original hardcoded catalog. The same
fallback covers a CMS that is down or unreachable, so a CMS outage never takes
the shop offline.

### How content flows

```
CMS /api/site-content  →  lib/cms/cache.ts  →  lib/cms/queries.ts  →  route loaders
                          (60s cache,           (per-page slices)
                           stale-while-
                           revalidate)
```

- **One CMS request** serves every page and every visitor for the cache window.
- Each server function returns only what its page renders — product cards drop
  specs, galleries and long copy, which is most of a product document.
- The root route loads the shell (settings, categories, occasions) once and
  shares it through React context, so the header, footer and WhatsApp buttons
  cost nothing extra per page.
- Images are requested from Cloudinary at the size they render, with `f_auto`
  so browsers get AVIF or WebP.

### Where the code lives

| Path | Role |
| --- | --- |
| `src/lib/cms/types.ts` | The API contract. Mirrors `cms/src/endpoints/siteContent.ts`. |
| `src/lib/cms/queries.ts` | Server functions each route loader calls. |
| `src/lib/cms/cache.ts` | The cached snapshot and its refresh policy. |
| `src/lib/cms/derive.ts` | Pure helpers — WhatsApp links, price labels, spec merging. |
| `src/lib/cms/image.ts` | Cloudinary URL and `srcset` building. |
| `src/lib/cms/context.tsx` | `useShell()` — site-wide content for any component. |
| `src/lib/cms/fallback.ts` | Bundled content used when the CMS is unavailable. |
| `src/lib/shop-data.ts` | The original static catalog. Now only feeds the fallback. |

## CMS

See [cms/README.md](cms/README.md) for setup, seeding and deployment.
