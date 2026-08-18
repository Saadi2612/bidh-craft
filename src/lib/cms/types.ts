/**
 * Shapes returned by the CMS `/api/site-content` endpoint.
 *
 * These mirror `cms/src/endpoints/siteContent.ts` exactly. Change one, change
 * the other — the endpoint is the only contract between the two apps.
 */

export type CmsImage = {
  url: string;
  alt: string;
  width: number | null;
  height: number | null;
  /** Present only for Cloudinary-backed media; enables on-the-fly resizing. */
  publicId: string | null;
  version: number | null;
};

export type Seo = {
  title: string | null;
  description: string | null;
};

export type Heading = {
  eyebrow: string;
  title: string;
  sub: string | null;
};

export type WaTemplates = {
  general: string;
  order: string;
  custom: string;
  product: string;
};

export type SiteSettings = {
  brandName: string;
  tagline: string;
  announcementBar: string | null;
  logo: CmsImage | null;
  footerNote: string | null;
  whatsappNumber: string;
  phoneDisplay: string;
  email: string;
  instagramUrl: string;
  instagramHandle: string;
  leadTimeDays: number;
  boxPriceMin: number;
  boxPriceMax: number;
  quoteNote: string;
  waTemplates: WaTemplates;
};

export type CategorySpecs = {
  material: string;
  size: string;
  finish: string;
  moq: string;
};

export type Category = {
  id: string;
  slug: string;
  name: string;
  short: string;
  intro: string;
  image: CmsImage | null;
  /** `boxRange` shows the Rs. min–max line; `quote` shows the WhatsApp note. */
  pricing: "boxRange" | "quote";
  specs: CategorySpecs;
  seo: Seo;
};

export type Occasion = {
  slug: string;
  name: string;
  note: string;
  emoji: string;
};

export type ProductSpecOverrides = {
  material: string | null;
  size: string | null;
  finish: string | null;
  moq: string | null;
};

export type Product = {
  id: string;
  slug: string;
  legacyId: string | null;
  name: string;
  blurb: string;
  description: string | null;
  /** Category slug. */
  category: string;
  categoryName: string | null;
  /** Occasion slugs. */
  occasions: string[];
  price: number | null;
  unit: string;
  featured: boolean;
  image: CmsImage | null;
  gallery: CmsImage[];
  specs: ProductSpecOverrides;
  seo: Seo;
};

/** The trimmed product shape sent to pages that only render cards. */
export type ProductCardData = Pick<
  Product,
  | "id"
  | "slug"
  | "name"
  | "blurb"
  | "category"
  | "categoryName"
  | "occasions"
  | "price"
  | "unit"
  | "featured"
  | "image"
>;

export type Testimonial = {
  quote: string;
  authorName: string;
  context: string;
  rating: number;
};

export type Client = {
  name: string;
  logo: CmsImage | null;
};

export type IconName = "sparkles" | "message" | "truck" | "palette" | "clock";

export type HomeContent = {
  hero: {
    eyebrow: string;
    title: string;
    body: string;
    primaryCta: string;
    secondaryCta: string;
    badges: string[];
    image: CmsImage | null;
    priceBadge: { title: string; sub: string };
  };
  clientsHeading: string;
  categoriesSection: Heading;
  collectionsSection: Heading;
  occasionsSection: Heading;
  featuredSection: Heading;
  featuredLimit: number;
  customSection: {
    eyebrow: string;
    title: string;
    body: string;
    note: string | null;
    cta: string;
    features: { title: string; body: string; icon: string }[];
  };
  story: {
    eyebrow: string;
    title: string;
    paragraphs: string[];
    image: CmsImage | null;
    cta: string;
  };
  howToOrderSection: Heading;
  howToOrderSteps: { title: string; body: string; icon: string }[];
  instagramSection: Heading;
  instagramImages: CmsImage[];
  instagramCta: string;
  testimonialsSection: Heading;
  seo: Seo;
};

export type ShopContent = {
  eyebrow: string;
  title: string;
  intro: string;
  emptyMessage: string;
  seo: Seo;
};

export type AboutContent = {
  eyebrow: string;
  title: string;
  intro: string;
  image: CmsImage | null;
  howWeWork: { title: string; paragraphs: string[] };
  occasionsColumn: {
    title: string;
    useOccasionsList: boolean;
    items: { term: string; definition: string }[];
  };
  clientsHeading: string;
  primaryCta: string;
  secondaryCta: string;
  seo: Seo;
};

export type ContactContent = {
  eyebrow: string;
  title: string;
  intro: string;
  leadTimeCardLabel: string;
  bulk: { title: string; body: string; primaryCta: string; secondaryCta: string };
  seo: Seo;
};

export type PreOrderContent = {
  eyebrow: string;
  title: string;
  intro: string;
  submitLabel: string;
  footnote: string;
  extraOccasionOptions: string[];
  seo: Seo;
};

export type SiteContent = {
  generatedAt: string;
  settings: SiteSettings;
  categories: Category[];
  occasions: Occasion[];
  products: Product[];
  testimonials: Testimonial[];
  clients: Client[];
  home: HomeContent;
  shop: ShopContent;
  about: AboutContent;
  contact: ContactContent;
  preOrder: PreOrderContent;
};

/** What the root route loads once and every page can read. */
export type SiteShell = {
  settings: SiteSettings;
  categories: Category[];
  occasions: Occasion[];
  /** True when the CMS could not be reached and bundled content is showing. */
  isFallback: boolean;
};
