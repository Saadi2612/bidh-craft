import path from "path";
import { fileURLToPath } from "url";

import { mongooseAdapter } from "@payloadcms/db-mongodb";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { buildConfig } from "payload";
import sharp from "sharp";

import { Categories } from "./collections/Categories";
import { Clients } from "./collections/Clients";
import { Media } from "./collections/Media";
import { Occasions } from "./collections/Occasions";
import { Products } from "./collections/Products";
import { Testimonials } from "./collections/Testimonials";
import { Users } from "./collections/Users";
import { siteContentEndpoint } from "./endpoints/siteContent";
import { AboutPage, ContactPage, PreOrderPage, ShopPage } from "./globals/Pages";
import { HomePage } from "./globals/HomePage";
import { SiteSettings } from "./globals/SiteSettings";
import { cloudinaryStorage } from "./lib/cloudinaryStorage";

const dirname = path.dirname(fileURLToPath(import.meta.url));

const corsOrigins = (process.env.CORS_ORIGINS ?? "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

// Vercel exposes the host without a scheme. `VERCEL_PROJECT_PRODUCTION_URL` is
// the stable production domain; `VERCEL_URL` is unique per deployment, which is
// the only way a preview build can know the origin it is actually served from.
const vercelOrigin = (host: string | undefined) => (host ? `https://${host}` : null);
const vercelOrigins = [
  vercelOrigin(process.env.VERCEL_PROJECT_PRODUCTION_URL),
  vercelOrigin(process.env.VERCEL_URL),
].filter((origin): origin is string => Boolean(origin));

const serverURL =
  process.env.NEXT_PUBLIC_SERVER_URL || vercelOrigins[0] || "http://localhost:3000";

// The admin panel calls its own API from its own origin, so that origin must
// always be allowed — otherwise every save in the admin gets rejected as a
// forged cross-site request the moment `csrf` is set to anything at all.
//
// Browsers send `Origin` on POST but not on same-origin GET, so a missing entry
// here fails in the least obvious way possible: pages load fine while every
// write — including the admin's own drawer render calls — comes back 401.
// Hence every origin this CMS can answer on, not just `serverURL`.
const csrfOrigins = Array.from(new Set([serverURL, ...vercelOrigins, ...corsOrigins]));

export default buildConfig({
  serverURL,

  admin: {
    user: Users.slug,
    importMap: { baseDir: path.resolve(dirname) },
    meta: {
      titleSuffix: " · THEBIDHCRAFT",
    },
  },

  collections: [Products, Categories, Occasions, Media, Testimonials, Clients, Users],
  globals: [SiteSettings, HomePage, ShopPage, AboutPage, ContactPage, PreOrderPage],

  endpoints: [siteContentEndpoint],

  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || "",
  db: mongooseAdapter({
    url: process.env.DATABASE_URI || "",
  }),
  sharp,

  // The storefront reads the API from another origin, so it must be allow-listed.
  cors: corsOrigins,
  // Must include the CMS's own origin — the admin panel is itself a caller.
  csrf: csrfOrigins,

  typescript: {
    outputFile: path.resolve(dirname, "payload-types.ts"),
  },

  plugins: [cloudinaryStorage()],
});
