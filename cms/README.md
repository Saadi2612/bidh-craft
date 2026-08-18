# THEBIDHCRAFT CMS

Payload 3 admin panel and content API for the storefront in the parent folder.

It is a separate Next.js app because Payload's admin panel only runs on Next —
the storefront is TanStack Start on Vite and cannot host it. The two apps share
nothing but one HTTP endpoint: `GET /api/site-content`.

```
cms/                     this app — admin at /admin, content API at /api
  src/collections/       Products, Categories, Occasions, Media, Testimonials, Clients, Users
  src/globals/           Site Settings + one global per page
  src/endpoints/         site-content: the single aggregated response the site reads
  src/lib/               Cloudinary storage adapter
  src/seed/              one-time import of the original catalog
```

## First run

1. **MongoDB Atlas** — create a free M0 cluster, add a database user, and allow
   access from anywhere (`0.0.0.0/0`) so Vercel can connect. Copy the connection
   string and add a database name to it:
   `mongodb+srv://user:pass@cluster.mongodb.net/bidhcraft?retryWrites=true&w=majority`

2. **Cloudinary** — sign up, then copy Cloud name, API key and API secret from
   the dashboard.

3. **Environment** — `cp .env.example .env` and fill it in. Generate the secret with:

   ```bash
   openssl rand -base64 32
   ```

4. **Install and run**:

   ```bash
   cd cms && bun install && bun run dev
   ```

5. Open <http://localhost:3000/admin> and create the first admin account. That
   form only appears while no users exist.

## Importing the existing catalog

`src/seed/data.json` holds the 10 categories, 5 occasions and 63 products the
site shipped with. Product photos still live on the current host, so the seed
needs to know where to download them from:

```bash
SEED_SITE_ORIGIN=https://your-live-site.com bun run seed
```

Re-running is safe: anything already present by slug is skipped. Every photo is
uploaded once and reused by each product that shared it.

## How the storefront reads content

One request — `GET /api/site-content` — returns the entire site: settings,
categories, occasions, products, testimonials, clients and the copy for every
page. The storefront caches that snapshot in memory for 60 seconds and then
serves it stale while refreshing in the background, so visitors never wait on
this app.

To make edits appear immediately instead of within the minute, set `SITE_URL`
and `REVALIDATE_SECRET` here and `SITE_REVALIDATE_SECRET` on the site. Saving
any document then pings the site to drop its cached snapshot.

Draft products are excluded from the API — only `published` documents are
public. Use the draft state to prepare a product before it goes live.

## Images

Uploads go straight to Cloudinary and are served from its CDN; the CMS never
proxies image bytes. No resized copies are stored — the site requests
`f_auto,q_auto,w_<size>` variants per breakpoint, so one upload covers every
screen and Cloudinary picks AVIF or WebP per browser.

Without Cloudinary credentials the CMS falls back to local disk storage so it
still boots, but do not run production that way: files land on the server's
filesystem, which Vercel wipes on every deploy.

## Deploying to Vercel

1. New project → import this repo → set **Root Directory** to `cms`.
2. Add every variable from `.env.example` as an environment variable.
3. Set `NEXT_PUBLIC_SERVER_URL` to the deployment URL once you know it.
4. Add the live site's origin to `CORS_ORIGINS`.
5. On the site, set `VITE_CMS_URL` to this deployment's URL and
   `VITE_CLOUDINARY_CLOUD_NAME` to your cloud name.

## Editing the schema

Adding or renaming fields means the API response changes, so update both sides:

- `src/endpoints/siteContent.ts` — what gets sent
- `../src/lib/cms/types.ts` — what the site expects

Then regenerate types:

```bash
bun run generate:types
```
