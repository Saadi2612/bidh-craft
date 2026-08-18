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

const serverURL = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3000";

// The admin panel calls its own API from its own origin, so that origin must
// always be allowed — otherwise every save in the admin gets rejected as a
// forged cross-site request the moment `csrf` is set to anything at all.
const csrfOrigins = Array.from(new Set([serverURL, ...corsOrigins]));

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
