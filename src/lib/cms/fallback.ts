import heroImg from "@/assets/hero-boxes.jpg";
import storyImg from "@/assets/our-story.jpg";
import {
  BOX_PRICE_MAX,
  BOX_PRICE_MIN,
  categories as staticCategories,
  clients as staticClients,
  EMAIL,
  INSTAGRAM_URL,
  isBoxCategory,
  LEAD_TIME_DAYS,
  occasions as staticOccasions,
  PHONE_DISPLAY,
  products as staticProducts,
  productSpecs,
  QUOTE_NOTE,
  WHATSAPP_NUMBER,
} from "@/lib/shop-data";

import type { CmsImage, SiteContent } from "./types";

/**
 * The site's original hardcoded content, reshaped into the CMS contract.
 *
 * This is what renders when the CMS has not been reached — a fresh clone with
 * no `VITE_CMS_URL`, a CMS that is down, or an empty database. The site is
 * never blank because of an infrastructure problem.
 */

function img(url: string, alt: string): CmsImage {
  return { url, alt, width: null, height: null, publicId: null, version: null };
}

const noSeo = { title: null, description: null };

export const fallbackContent: SiteContent = {
  generatedAt: new Date(0).toISOString(),

  settings: {
    brandName: "THEBIDHCRAFT",
    tagline: "Handcrafted boxes for every happy moment — 100% handmade & hand-printed in Pakistan.",
    announcementBar:
      "Custom orders for Nikkah, Walima, Mehndi & Aqeeqa — please order at least 5 days before your event 📦",
    logo: null,
    footerNote: "Orders currently processed via WhatsApp — online checkout coming soon.",
    whatsappNumber: WHATSAPP_NUMBER,
    phoneDisplay: PHONE_DISPLAY,
    email: EMAIL,
    instagramUrl: INSTAGRAM_URL,
    instagramHandle: "@thebidhcraft",
    leadTimeDays: LEAD_TIME_DAYS,
    boxPriceMin: BOX_PRICE_MIN,
    boxPriceMax: BOX_PRICE_MAX,
    quoteNote: QUOTE_NOTE,
    waTemplates: {
      general: "Hi THEBIDHCRAFT! I'd like to know more about your boxes.",
      order: "Hi THEBIDHCRAFT! I'd like to order a box.",
      custom: "Hi THEBIDHCRAFT! I have a custom design in mind — can you make it?",
      product:
        'Hi THEBIDHCRAFT! I\'d like to order "{product}". Quantity: {qty}. Please share details.',
    },
  },

  categories: staticCategories.map((c, i) => {
    const specs = productSpecs({
      id: "",
      name: "",
      category: c.slug,
      occasions: [],
      blurb: "",
    });
    return {
      id: String(i + 1),
      slug: c.slug,
      name: c.name,
      short: c.short,
      intro: c.intro,
      image: img(c.image, c.imageAlt),
      pricing: isBoxCategory(c.slug) ? ("boxRange" as const) : ("quote" as const),
      specs: {
        material: specs.material,
        size: specs.size,
        finish: specs.finish,
        moq: specs.moq,
      },
      seo: noSeo,
    };
  }),

  occasions: staticOccasions.map((o) => ({
    slug: o.slug,
    name: o.name,
    note: o.note,
    emoji: o.emoji,
  })),

  products: staticProducts.map((p) => ({
    id: p.id,
    slug: p.id,
    legacyId: p.id,
    name: p.name,
    blurb: p.blurb,
    description: null,
    category: p.category,
    categoryName: staticCategories.find((c) => c.slug === p.category)?.name ?? null,
    occasions: [...p.occasions],
    price: p.price ?? null,
    unit: p.unit ?? "box",
    featured: p.featured ?? false,
    image: p.image ? img(p.image, `Handmade ${p.name.toLowerCase()} by THEBIDHCRAFT`) : null,
    gallery: [],
    specs: { material: null, size: null, finish: null, moq: null },
    seo: noSeo,
  })),

  testimonials: [
    {
      quote:
        "The boxes were even prettier in person. Every guest at my Mehndi asked where I got them.",
      authorName: "Sana",
      context: "Mehndi order",
      rating: 5,
    },
    {
      quote:
        "We ordered 250 favor boxes for our Walima and they arrived perfectly packed, three days early.",
      authorName: "Hamza & Ayesha",
      context: "Walima order",
      rating: 5,
    },
    {
      quote: "They matched our Aqeeqa theme exactly from one photo I sent. So personal.",
      authorName: "Mariam",
      context: "Aqeeqa order",
      rating: 5,
    },
  ],

  clients: staticClients.map((name) => ({ name, logo: null })),

  home: {
    hero: {
      eyebrow: "100% handmade & hand-printed",
      title: "Handcrafted Boxes for Every Happy Moment",
      body: "Every box is cut, folded, printed and tied by hand in our little studio — made for Nikkah, Walima, Mehndi, Aqeeqa and birthdays. Boxes start at Rs. 150 and go up to Rs. 210 depending on size and finish. Signs, pens, bazubands and velvet plaques are priced on WhatsApp as per your quantity.",
      primaryCta: "Shop Now",
      secondaryCta: "Order on WhatsApp",
      badges: [
        "Boxes Rs. 150 – 210 per piece",
        "Custom designs on demand",
        "Order 5 days before your event",
      ],
      image: img(
        heroImg,
        "Flat-lay of handmade hand-printed pink favor boxes with ribbons and rose petals",
      ),
      priceBadge: { title: "Rs. 150 – 210", sub: "per handmade box" },
    },
    clientsHeading: "Trusted by brands & creators we've packed for",
    categoriesSection: {
      eyebrow: "Shop by category",
      title: "Find your box type",
      sub: "Four core collections — and we add new ones every season.",
    },
    collectionsSection: {
      eyebrow: "Browse collections",
      title: "Explore every collection",
      sub: "Swipe through each collection — tap any design to order on WhatsApp.",
    },
    occasionsSection: {
      eyebrow: "Shop by occasion",
      title: "Made for your celebration",
      sub: "Tell us the event and we'll match the box, the colours and the print.",
    },
    featuredSection: {
      eyebrow: "Best sellers",
      title: "Loved by our customers",
      sub: "Boxes are Rs. 150 to Rs. 210 depending on size and finish. Everything else is quoted on WhatsApp as per quantity.",
    },
    featuredLimit: 8,
    customSection: {
      eyebrow: "Custom & on demand",
      title: "You show it, we make it.",
      body: "Send us a photo, a Pinterest screenshot or just an idea — colours, monograms, names, dates, logos, anything. We hand-make it to match. Bulk event orders and corporate gifting welcome.",
      note: "⏳ Please place custom orders at least 5 days before your event so every box is printed and dried properly.",
      cta: "Share your design on WhatsApp",
      features: [
        { title: "Any colour or print", body: "Matched to your event theme.", icon: "palette" },
        { title: "Names & monograms", body: "Hand-lettered tags and foiling.", icon: "sparkles" },
        { title: "Bulk event orders", body: "50, 100, 500 boxes — no problem.", icon: "truck" },
      ],
    },
    story: {
      eyebrow: "Our story",
      title: "Made by hand, for life's happiest moments",
      paragraphs: [
        "THEBIDHCRAFT began at a kitchen table with a stack of card, one wooden block and a wedding to prepare for. Everything you see here is still made the same way — cut, scored, folded, printed and tied by hand. No factory lines, no mass production.",
        "That means small imperfections, and we love them: they're proof a person made your box. From a hundred Nikkah favors to a single Aqeeqa announcement, each one leaves our studio wrapped with the same care.",
      ],
      image: img(
        storyImg,
        "Maker hand-printing a floral pattern onto a pink gift box in the THEBIDHCRAFT studio",
      ),
      cta: "Read our story",
    },
    howToOrderSection: {
      eyebrow: "How to order",
      title: "Three simple steps",
      sub: "No cart needed — we handle everything personally over WhatsApp.",
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
    instagramSection: {
      eyebrow: "@thebidhcraft",
      title: "From our Instagram",
      sub: "Fresh boxes, behind-the-scenes and real event orders.",
    },
    instagramImages: [],
    instagramCta: "Follow us @thebidhcraft",
    testimonialsSection: {
      eyebrow: "Kind words",
      title: "What our customers say",
      sub: null,
    },
    seo: noSeo,
  },

  shop: {
    eyebrow: "The collection",
    title: "Shop all boxes",
    intro:
      "Every box is handmade and hand-printed to order. Boxes are Rs. 150 to Rs. 210 per piece — signs, pens, bazubands and velvet plaques are quoted on WhatsApp as per quantity.",
    emptyMessage:
      "No boxes match those filters — but we make custom pieces on demand. Message us on WhatsApp.",
    seo: noSeo,
  },

  about: {
    eyebrow: "Our story",
    title: "Everything here is made by hand",
    intro:
      'THEBIDHCRAFT is a small Pakistani studio making decorative gift and favor boxes — the little "bid boxes" that guests carry home from your happiest days.',
    image: img(
      storyImg,
      "Hands hand-printing a floral block pattern onto a pink handmade gift box",
    ),
    howWeWork: {
      title: "How we work",
      paragraphs: [
        "Card is cut and scored by hand, folded, then block-printed or hand-painted. Ribbons are tied one by one, tags are lettered individually, and each box is checked before it's packed. Nothing is outsourced to a factory.",
        "Because of that, we ask for at least 5 days' notice before your event — more for large bulk orders — so the ink dries properly and nothing is rushed.",
      ],
    },
    occasionsColumn: {
      title: "Occasions we make for",
      useOccasionsList: true,
      items: [],
    },
    clientsHeading: "Some of the names we've packed for",
    primaryCta: "Start a custom order",
    secondaryCta: "Browse the shop",
    seo: noSeo,
  },

  contact: {
    eyebrow: "Say hello",
    title: "Let's plan your boxes",
    intro:
      "WhatsApp is the fastest way to reach us — send the product name, quantity and your event date and we'll confirm price, customization and delivery.",
    leadTimeCardLabel: "Lead time",
    bulk: {
      title: "Bulk or corporate gifting?",
      body: "We've produced boxes for brands and creators across Pakistan. Share your quantity, branding and deadline and we'll quote it.",
      primaryCta: "Message us on WhatsApp",
      secondaryCta: "Start a pre-order",
    },
    seo: noSeo,
  },

  preOrder: {
    eyebrow: "Pre-order",
    title: "Reserve your boxes",
    intro:
      "Fill this in and we'll open WhatsApp with your details already written out. Everything is handmade to order, so please allow {leadTime} days before your event.",
    submitLabel: "Send pre-order on WhatsApp",
    footnote:
      "Nothing is charged here — WhatsApp opens with your details so we can confirm price and customization.",
    extraOccasionOptions: ["Corporate / Brand gifting", "Other"],
    seo: noSeo,
  },
};
