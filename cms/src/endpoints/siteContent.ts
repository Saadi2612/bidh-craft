import type { Endpoint, PayloadRequest } from "payload";

type AnyDoc = Record<string, unknown>;

const str = (v: unknown): string => (typeof v === "string" ? v : "");
const num = (v: unknown): number | undefined => (typeof v === "number" ? v : undefined);
const bool = (v: unknown): boolean => v === true;
const obj = (v: unknown): AnyDoc => (v && typeof v === "object" ? (v as AnyDoc) : {});
const arr = (v: unknown): AnyDoc[] => (Array.isArray(v) ? (v as AnyDoc[]) : []);

/** Media docs are trimmed to what the storefront actually renders. */
function media(v: unknown) {
  const m = obj(v);
  const raw = str(m["url"]);
  if (!raw) return null;
  // Local-disk uploads produce a CMS-relative path; the storefront is on
  // another origin, so it needs the absolute URL.
  const base = (process.env.NEXT_PUBLIC_SERVER_URL ?? "").replace(/\/$/, "");
  const url = raw.startsWith("/") ? `${base}${raw}` : raw;
  return {
    url,
    alt: str(m["alt"]),
    width: num(m["width"]) ?? null,
    height: num(m["height"]) ?? null,
    publicId: str(m["cloudinaryPublicId"]) || null,
    version: num(m["cloudinaryVersion"]) ?? null,
  };
}

/** Relationship values arrive either populated (depth ≥ 1) or as a bare id. */
function relSlug(v: unknown): string {
  if (typeof v === "string") return v;
  return str(obj(v)["slug"]);
}

function headingOf(v: unknown) {
  const h = obj(v);
  return { eyebrow: str(h["eyebrow"]), title: str(h["title"]), sub: str(h["sub"]) || null };
}

function textList(v: unknown, key = "text"): string[] {
  return arr(v)
    .map((row) => str(row[key]))
    .filter(Boolean);
}

function category(doc: AnyDoc) {
  const specs = obj(doc["specs"]);
  const seo = obj(doc["seo"]);
  return {
    id: str(doc["id"]),
    slug: str(doc["slug"]),
    name: str(doc["name"]),
    short: str(doc["short"]),
    intro: str(doc["intro"]),
    image: media(doc["image"]),
    pricing: str(doc["pricing"]) === "quote" ? ("quote" as const) : ("boxRange" as const),
    specs: {
      material: str(specs["material"]),
      size: str(specs["size"]),
      finish: str(specs["finish"]),
      moq: str(specs["moq"]),
    },
    seo: { title: str(seo["metaTitle"]) || null, description: str(seo["metaDescription"]) || null },
  };
}

function product(doc: AnyDoc) {
  const specs = obj(doc["specs"]);
  const seo = obj(doc["seo"]);
  const categoryDoc = obj(doc["category"]);
  return {
    id: str(doc["id"]),
    slug: str(doc["slug"]),
    legacyId: str(doc["legacyId"]) || null,
    name: str(doc["name"]),
    blurb: str(doc["blurb"]),
    description: str(doc["description"]) || null,
    category: relSlug(doc["category"]),
    categoryName: str(categoryDoc["name"]) || null,
    occasions: (Array.isArray(doc["occasions"]) ? doc["occasions"] : []).map(relSlug).filter(Boolean),
    price: num(doc["price"]) ?? null,
    unit: str(doc["unit"]) || "box",
    featured: bool(doc["featured"]),
    image: media(doc["image"]),
    gallery: arr(doc["gallery"])
      .map((row) => media(row["image"]))
      .filter(Boolean),
    // Only overrides are sent; the site merges category defaults underneath.
    specs: {
      material: str(specs["material"]) || null,
      size: str(specs["size"]) || null,
      finish: str(specs["finish"]) || null,
      moq: str(specs["moq"]) || null,
    },
    seo: { title: str(seo["metaTitle"]) || null, description: str(seo["metaDescription"]) || null },
  };
}

function seoOf(v: unknown) {
  const seo = obj(v);
  return { title: str(seo["metaTitle"]) || null, description: str(seo["metaDescription"]) || null };
}

/**
 * One request returns the whole site: catalog plus every page's copy.
 *
 * The storefront renders from a single cached snapshot, so splitting this into
 * per-collection REST calls would mean eight round trips per cold render for
 * data that always changes together.
 */
export const siteContentEndpoint: Endpoint = {
  path: "/site-content",
  method: "get",
  handler: async (req: PayloadRequest) => {
    const { payload } = req;
    const common = { overrideAccess: false, user: req.user, depth: 1 } as const;

    const [
      categories,
      occasions,
      products,
      testimonials,
      clients,
      settings,
      home,
      shop,
      about,
      contact,
      preOrder,
    ] = await Promise.all([
      payload.find({ collection: "categories", limit: 100, sort: "order", ...common }),
      payload.find({ collection: "occasions", limit: 50, sort: "order", depth: 0, overrideAccess: false, user: req.user }),
      payload.find({ collection: "products", limit: 1000, sort: "order", ...common }),
      payload.find({ collection: "testimonials", limit: 50, sort: "order", depth: 0, overrideAccess: false, user: req.user }),
      payload.find({ collection: "clients", limit: 100, sort: "order", ...common }),
      payload.findGlobal({ slug: "site-settings", depth: 1, overrideAccess: false, user: req.user }),
      payload.findGlobal({ slug: "home-page", depth: 1, overrideAccess: false, user: req.user }),
      payload.findGlobal({ slug: "shop-page", depth: 0, overrideAccess: false, user: req.user }),
      payload.findGlobal({ slug: "about-page", depth: 1, overrideAccess: false, user: req.user }),
      payload.findGlobal({ slug: "contact-page", depth: 0, overrideAccess: false, user: req.user }),
      payload.findGlobal({ slug: "pre-order-page", depth: 0, overrideAccess: false, user: req.user }),
    ]);

    const s = obj(settings);
    const h = obj(home);
    const a = obj(about);
    const c = obj(contact);
    const p = obj(preOrder);
    const sh = obj(shop);

    const waTemplates = obj(s["waTemplates"]);
    const hero = obj(h["hero"]);
    const custom = obj(h["customSection"]);
    const story = obj(h["story"]);
    const aboutHowWeWork = obj(a["howWeWork"]);
    const aboutOccasions = obj(a["occasionsColumn"]);
    const contactBulk = obj(c["bulk"]);

    const body = {
      generatedAt: new Date().toISOString(),
      settings: {
        brandName: str(s["brandName"]),
        tagline: str(s["tagline"]),
        announcementBar: str(s["announcementBar"]) || null,
        logo: media(s["logo"]),
        footerNote: str(s["footerNote"]) || null,
        whatsappNumber: str(s["whatsappNumber"]),
        phoneDisplay: str(s["phoneDisplay"]),
        email: str(s["email"]),
        instagramUrl: str(s["instagramUrl"]),
        instagramHandle: str(s["instagramHandle"]),
        leadTimeDays: num(s["leadTimeDays"]) ?? 5,
        boxPriceMin: num(s["boxPriceMin"]) ?? 150,
        boxPriceMax: num(s["boxPriceMax"]) ?? 210,
        quoteNote: str(s["quoteNote"]),
        waTemplates: {
          general: str(waTemplates["general"]),
          order: str(waTemplates["order"]),
          custom: str(waTemplates["custom"]),
          product: str(waTemplates["product"]),
        },
      },
      categories: categories.docs.map((d) => category(obj(d))),
      occasions: occasions.docs.map((d) => {
        const o = obj(d);
        return {
          slug: str(o["slug"]),
          name: str(o["name"]),
          note: str(o["note"]),
          emoji: str(o["emoji"]),
        };
      }),
      products: products.docs.map((d) => product(obj(d))),
      testimonials: testimonials.docs.map((d) => {
        const t = obj(d);
        return {
          quote: str(t["quote"]),
          authorName: str(t["authorName"]),
          context: str(t["context"]),
          rating: num(t["rating"]) ?? 5,
        };
      }),
      clients: clients.docs.map((d) => {
        const cl = obj(d);
        return { name: str(cl["name"]), logo: media(cl["logo"]) };
      }),
      home: {
        hero: {
          eyebrow: str(hero["eyebrow"]),
          title: str(hero["title"]),
          body: str(hero["body"]),
          primaryCta: str(hero["primaryCta"]),
          secondaryCta: str(hero["secondaryCta"]),
          badges: textList(hero["badges"]),
          image: media(hero["image"]),
          priceBadge: {
            title: str(obj(hero["priceBadge"])["title"]),
            sub: str(obj(hero["priceBadge"])["sub"]),
          },
        },
        clientsHeading: str(h["clientsHeading"]),
        categoriesSection: headingOf(h["categoriesSection"]),
        collectionsSection: headingOf(h["collectionsSection"]),
        occasionsSection: headingOf(h["occasionsSection"]),
        featuredSection: headingOf(h["featuredSection"]),
        featuredLimit: num(h["featuredLimit"]) ?? 8,
        customSection: {
          eyebrow: str(custom["eyebrow"]),
          title: str(custom["title"]),
          body: str(custom["body"]),
          note: str(custom["note"]) || null,
          cta: str(custom["cta"]),
          features: arr(custom["features"]).map((f) => ({
            title: str(f["title"]),
            body: str(f["body"]),
            icon: str(f["icon"]) || "sparkles",
          })),
        },
        story: {
          eyebrow: str(story["eyebrow"]),
          title: str(story["title"]),
          paragraphs: textList(story["paragraphs"]),
          image: media(story["image"]),
          cta: str(story["cta"]),
        },
        howToOrderSection: headingOf(h["howToOrderSection"]),
        howToOrderSteps: arr(h["howToOrderSteps"]).map((step) => ({
          title: str(step["title"]),
          body: str(step["body"]),
          icon: str(step["icon"]) || "sparkles",
        })),
        instagramSection: headingOf(h["instagramSection"]),
        instagramImages: arr(h["instagramImages"])
          .map((row) => media(row["image"]))
          .filter(Boolean),
        instagramCta: str(h["instagramCta"]),
        testimonialsSection: headingOf(h["testimonialsSection"]),
        seo: seoOf(h["seo"]),
      },
      shop: {
        eyebrow: str(sh["eyebrow"]),
        title: str(sh["title"]),
        intro: str(sh["intro"]),
        emptyMessage: str(sh["emptyMessage"]),
        seo: seoOf(sh["seo"]),
      },
      about: {
        eyebrow: str(a["eyebrow"]),
        title: str(a["title"]),
        intro: str(a["intro"]),
        image: media(a["image"]),
        howWeWork: {
          title: str(aboutHowWeWork["title"]),
          paragraphs: textList(aboutHowWeWork["paragraphs"]),
        },
        occasionsColumn: {
          title: str(aboutOccasions["title"]),
          useOccasionsList: aboutOccasions["useOccasionsList"] !== false,
          items: arr(aboutOccasions["items"]).map((i) => ({
            term: str(i["term"]),
            definition: str(i["definition"]),
          })),
        },
        clientsHeading: str(a["clientsHeading"]),
        primaryCta: str(a["primaryCta"]),
        secondaryCta: str(a["secondaryCta"]),
        seo: seoOf(a["seo"]),
      },
      contact: {
        eyebrow: str(c["eyebrow"]),
        title: str(c["title"]),
        intro: str(c["intro"]),
        leadTimeCardLabel: str(c["leadTimeCardLabel"]),
        bulk: {
          title: str(contactBulk["title"]),
          body: str(contactBulk["body"]),
          primaryCta: str(contactBulk["primaryCta"]),
          secondaryCta: str(contactBulk["secondaryCta"]),
        },
        seo: seoOf(c["seo"]),
      },
      preOrder: {
        eyebrow: str(p["eyebrow"]),
        title: str(p["title"]),
        intro: str(p["intro"]),
        submitLabel: str(p["submitLabel"]),
        footnote: str(p["footnote"]),
        extraOccasionOptions: arr(p["extraOccasionOptions"])
          .map((o) => str(o["label"]))
          .filter(Boolean),
        seo: seoOf(p["seo"]),
      },
    };

    return Response.json(body, {
      headers: {
        // Short shared-cache window with a long stale window: any CDN in front
        // keeps serving instantly while it refetches in the background.
        "Cache-Control": "public, max-age=0, s-maxage=60, stale-while-revalidate=86400",
      },
    });
  },
};
