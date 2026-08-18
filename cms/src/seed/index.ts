import fs from "fs";
import path from "path";

import config from "@payload-config";
import { getPayload } from "payload";

import seedData from "./data.json" with { type: "json" };

/**
 * One-time import of the site's original catalog and copy.
 *
 * Safe to re-run: anything that already exists by slug (or by name, for
 * clients and testimonials) is left alone. Images are uploaded once and reused
 * across every product that shared them.
 *
 *   cd cms && bun run seed
 *
 * Product photos currently live on the old host, so set SEED_SITE_ORIGIN to the
 * live site before running, e.g. SEED_SITE_ORIGIN=https://thebidhcraft.com
 */

type ImageRef = string | null;

const repoRoot = path.resolve(process.cwd(), "..");
const siteOrigin = process.env.SEED_SITE_ORIGIN?.replace(/\/$/, "");
const allowMissingImages = Boolean(process.env.SEED_ALLOW_MISSING_IMAGES);

const MIME_BY_EXT: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".avif": "image/avif",
};

async function main() {
  // Decide up front, rather than half-seeding and stopping on the first photo
  // that is not reachable.
  const needsOrigin = [
    ...seedData.categories.map((c) => c.image),
    ...seedData.products.map((p) => p.image),
  ].some((ref) => typeof ref === "string" && ref.startsWith("remote:/"));
  if (needsOrigin && !siteOrigin && !allowMissingImages) {
    throw new Error(
      "Some photos are hosted outside this repo. Either point the seed at a site that still serves them:\n" +
        "  SEED_SITE_ORIGIN=https://example.com bun run seed\n" +
        "or seed the text now and attach those photos in the admin later:\n" +
        "  SEED_ALLOW_MISSING_IMAGES=1 bun run seed",
    );
  }

  const payload = await getPayload({ config });
  const log = (msg: string) => payload.logger.info(msg);

  /** Marker string ("local:…" / "remote:…") → media document id. */
  const mediaByRef = new Map<string, string>();
  /** Documents that ended up without a photo, for the checklist written at the end. */
  const missingPhotos: { kind: string; name: string; original: string }[] = [];

  async function uploadImage(
    ref: ImageRef,
    alt: string,
    owner?: { kind: string; name: string },
  ): Promise<string | null> {
    const note = () => {
      if (owner) missingPhotos.push({ ...owner, original: path.basename(ref ?? "") });
      return null;
    };

    if (!ref) return null;
    const cached = mediaByRef.get(ref);
    if (cached) return cached;

    const filename = path.basename(ref.split("?")[0] ?? ref);

    // Re-running the seed should not create a second copy of the same photo.
    const existing = await payload.find({
      collection: "media",
      where: { filename: { equals: filename } },
      limit: 1,
      depth: 0,
    });
    const found = existing.docs[0];
    if (found) {
      mediaByRef.set(ref, String(found.id));
      return String(found.id);
    }

    let data: Buffer;
    if (ref.startsWith("local:")) {
      const filePath = path.join(repoRoot, ref.slice("local:".length));
      if (!fs.existsSync(filePath)) {
        payload.logger.warn(`Missing local image, skipping: ${filePath}`);
        return note();
      }
      data = fs.readFileSync(filePath);
    } else {
      const remotePath = ref.slice("remote:".length);
      const url = remotePath.startsWith("http") ? remotePath : `${siteOrigin ?? ""}${remotePath}`;
      if (!siteOrigin && !remotePath.startsWith("http")) return note();

      let res: Response;
      try {
        res = await fetch(url);
      } catch (err) {
        payload.logger.warn(`Could not reach ${url} (${String(err)}) — skipping`);
        return note();
      }
      if (!res.ok) {
        payload.logger.warn(`Could not download ${url} (${res.status}) — skipping`);
        return note();
      }
      data = Buffer.from(await res.arrayBuffer());
    }

    const mimetype = MIME_BY_EXT[path.extname(filename).toLowerCase()] ?? "image/jpeg";
    const doc = await payload.create({
      collection: "media",
      data: { alt },
      file: { data, mimetype, name: filename, size: data.byteLength },
    });
    mediaByRef.set(ref, String(doc.id));
    log(`uploaded ${filename}`);
    return String(doc.id);
  }

  async function findBySlug(collection: "categories" | "occasions" | "products", slug: string) {
    const res = await payload.find({
      collection,
      where: { slug: { equals: slug } },
      limit: 1,
      depth: 0,
    });
    return res.docs[0] ?? null;
  }

  function slugify(input: string): string {
    return input
      .normalize("NFKD")
      .toLowerCase()
      .replace(/[^\w\s-]+/g, "")
      .trim()
      .replace(/[\s_]+/g, "-")
      .replace(/-{2,}/g, "-");
  }

  // ---- Occasions ---------------------------------------------------------
  const occasionIds = new Map<string, string>();
  for (const [i, o] of seedData.occasions.entries()) {
    const existing = await findBySlug("occasions", o.slug);
    if (existing) {
      occasionIds.set(o.slug, String(existing.id));
      continue;
    }
    const doc = await payload.create({
      collection: "occasions",
      data: { name: o.name, slug: o.slug, note: o.note, emoji: o.emoji, order: i },
    });
    occasionIds.set(o.slug, String(doc.id));
    log(`occasion: ${o.name}`);
  }

  // ---- Categories --------------------------------------------------------
  const categoryIds = new Map<string, string>();
  for (const [i, c] of seedData.categories.entries()) {
    const existing = await findBySlug("categories", c.slug);
    if (existing) {
      categoryIds.set(c.slug, String(existing.id));
      continue;
    }
    const imageId = await uploadImage(c.image, c.imageAlt, {
      kind: "Category",
      name: c.name,
    });
    const doc = await payload.create({
      collection: "categories",
      data: {
        name: c.name,
        slug: c.slug,
        short: c.short,
        intro: c.intro,
        pricing: c.pricing as "boxRange" | "quote",
        order: i,
        specs: c.specs,
        ...(imageId ? { image: imageId } : {}),
      },
    });
    categoryIds.set(c.slug, String(doc.id));
    log(`category: ${c.name}`);
  }

  // ---- Products ----------------------------------------------------------
  let created = 0;
  for (const [i, p] of seedData.products.entries()) {
    const slug = slugify(p.name);
    if (await findBySlug("products", slug)) continue;

    const categoryId = categoryIds.get(p.category);
    if (!categoryId) {
      payload.logger.warn(`No category "${p.category}" for product "${p.name}" — skipping`);
      continue;
    }
    const occasionRefs = p.occasions
      .map((slugName: string) => occasionIds.get(slugName))
      .filter((id): id is string => Boolean(id));

    const imageId = await uploadImage(
      p.image,
      `Handmade ${p.name.toLowerCase()} by THEBIDHCRAFT`,
      { kind: "Product", name: p.name },
    );

    await payload.create({
      collection: "products",
      data: {
        name: p.name,
        slug,
        legacyId: p.legacyId,
        blurb: p.blurb,
        category: categoryId,
        occasions: occasionRefs,
        unit: p.unit,
        featured: p.featured,
        order: i,
        _status: "published",
        ...(typeof p.price === "number" ? { price: p.price } : {}),
        ...(imageId ? { image: imageId } : {}),
      },
    });
    created += 1;
  }
  log(`products created: ${created}`);

  // ---- Clients -----------------------------------------------------------
  for (const [i, name] of seedData.clients.entries()) {
    const existing = await payload.find({
      collection: "clients",
      where: { name: { equals: name } },
      limit: 1,
      depth: 0,
    });
    if (existing.docs.length > 0) continue;
    await payload.create({ collection: "clients", data: { name, order: i } });
  }

  // ---- Testimonials ------------------------------------------------------
  const testimonials = [
    {
      quote:
        "The boxes were even prettier in person. Every guest at my Mehndi asked where I got them.",
      authorName: "Sana",
      context: "Mehndi order",
    },
    {
      quote:
        "We ordered 250 favor boxes for our Walima and they arrived perfectly packed, three days early.",
      authorName: "Hamza & Ayesha",
      context: "Walima order",
    },
    {
      quote: "They matched our Aqeeqa theme exactly from one photo I sent. So personal.",
      authorName: "Mariam",
      context: "Aqeeqa order",
    },
  ];
  for (const [i, t] of testimonials.entries()) {
    const existing = await payload.find({
      collection: "testimonials",
      where: { authorName: { equals: t.authorName } },
      limit: 1,
      depth: 0,
    });
    if (existing.docs.length > 0) continue;
    await payload.create({ collection: "testimonials", data: { ...t, rating: 5, order: i } });
  }

  // ---- Globals -----------------------------------------------------------
  // Field defaults cover most of the copy; only the parts with no default
  // (images and repeatable rows) are set here.
  const heroImage = await uploadImage(
    "local:src/assets/hero-boxes.jpg",
    "Flat-lay of handmade hand-printed pink favor boxes with ribbons and rose petals",
  );
  const storyImage = await uploadImage(
    "local:src/assets/our-story.jpg",
    "Maker hand-printing a floral pattern onto a pink gift box in the THEBIDHCRAFT studio",
  );

  const home = await payload.findGlobal({ slug: "home-page", depth: 0 });
  if (!home?.hero?.image) {
    await payload.updateGlobal({
      slug: "home-page",
      data: {
        hero: {
          badges: [
            { text: "Boxes Rs. 150 – 210 per piece" },
            { text: "Custom designs on demand" },
            { text: "Order 5 days before your event" },
          ],
          ...(heroImage ? { image: heroImage } : {}),
        },
        customSection: {
          features: [
            { title: "Any colour or print", body: "Matched to your event theme.", icon: "palette" },
            {
              title: "Names & monograms",
              body: "Hand-lettered tags and foiling.",
              icon: "sparkles",
            },
            { title: "Bulk event orders", body: "50, 100, 500 boxes — no problem.", icon: "truck" },
          ],
        },
        story: {
          paragraphs: [
            {
              text: "THEBIDHCRAFT began at a kitchen table with a stack of card, one wooden block and a wedding to prepare for. Everything you see here is still made the same way — cut, scored, folded, printed and tied by hand. No factory lines, no mass production.",
            },
            {
              text: "That means small imperfections, and we love them: they're proof a person made your box. From a hundred Nikkah favors to a single Aqeeqa announcement, each one leaves our studio wrapped with the same care.",
            },
          ],
          ...(storyImage ? { image: storyImage } : {}),
        },
        howToOrderSteps: [
          {
            title: "1. Browse & pick",
            body: "Choose your box type, colour and occasion from the shop.",
            icon: "sparkles",
          },
          {
            title: "2. Message us",
            body: "Send the product name and quantity on WhatsApp.",
            icon: "message",
          },
          {
            title: "3. We confirm",
            body: "Customization, price and delivery confirmed — then we make it.",
            icon: "truck",
          },
        ],
      },
    });
    log("home page seeded");
  }

  const about = await payload.findGlobal({ slug: "about-page", depth: 0 });
  if (!about?.image) {
    await payload.updateGlobal({
      slug: "about-page",
      data: {
        ...(storyImage ? { image: storyImage } : {}),
        howWeWork: {
          paragraphs: [
            {
              text: "Card is cut and scored by hand, folded, then block-printed or hand-painted. Ribbons are tied one by one, tags are lettered individually, and each box is checked before it's packed. Nothing is outsourced to a factory.",
            },
            {
              text: "Because of that, we ask for at least 5 days' notice before your event — more for large bulk orders — so the ink dries properly and nothing is rushed.",
            },
          ],
        },
      },
    });
    log("about page seeded");
  }

  const preOrder = await payload.findGlobal({ slug: "pre-order-page", depth: 0 });
  if (!preOrder?.extraOccasionOptions?.length) {
    await payload.updateGlobal({
      slug: "pre-order-page",
      data: {
        extraOccasionOptions: [{ label: "Corporate / Brand gifting" }, { label: "Other" }],
      },
    });
  }

  // Touching these once writes the field defaults into the database.
  await payload.updateGlobal({ slug: "site-settings", data: {} });
  await payload.updateGlobal({ slug: "shop-page", data: {} });
  await payload.updateGlobal({ slug: "contact-page", data: {} });

  if (missingPhotos.length > 0) {
    // A list this long is easier to work through as a file than as log output.
    const checklistPath = path.join(process.cwd(), "missing-photos.md");
    const byOriginal = new Map<string, typeof missingPhotos>();
    for (const row of missingPhotos) {
      const group = byOriginal.get(row.original) ?? [];
      group.push(row);
      byOriginal.set(row.original, group);
    }

    const lines = [
      "# Photos still to upload",
      "",
      `${missingPhotos.length} documents were seeded without a photo because the original`,
      "file could not be downloaded. Open each one in the admin and upload a picture.",
      "",
      `Grouped by the original filename — entries under one heading shared the same photo,`,
      "so uploading it once and picking it for each is enough.",
      "",
    ];
    for (const [original, rows] of [...byOriginal].sort()) {
      lines.push(`## ${original}`, "");
      for (const row of rows) lines.push(`- [ ] ${row.kind}: ${row.name}`);
      lines.push("");
    }
    fs.writeFileSync(checklistPath, lines.join("\n"));

    payload.logger.warn(
      `${missingPhotos.length} document(s) have no photo. Checklist written to ${checklistPath}`,
    );
  }
  log("Seed complete.");
  process.exit(0);
}

await main();
