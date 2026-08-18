import type {
  Category,
  CategorySpecs,
  CmsImage,
  Occasion,
  Product,
  ProductCardData,
  SiteSettings,
} from "./types";

/** Replaces {placeholders} in the WhatsApp templates set in the CMS. */
export function fillTemplate(template: string, vars: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) => {
    const value = vars[key];
    return value === undefined ? match : String(value);
  });
}

export function waLink(settings: SiteSettings, message: string): string {
  return `https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent(message)}`;
}

export const generalWaLink = (s: SiteSettings) => waLink(s, s.waTemplates.general);
export const orderWaLink = (s: SiteSettings) => waLink(s, s.waTemplates.order);
export const customWaLink = (s: SiteSettings) => waLink(s, s.waTemplates.custom);

export function productWaLink(settings: SiteSettings, productName: string, qty = 1): string {
  return waLink(
    settings,
    fillTemplate(settings.waTemplates.product, { product: productName, qty }),
  );
}

export function boxPriceRange(settings: SiteSettings): string {
  return `Rs. ${settings.boxPriceMin} – ${settings.boxPriceMax}`;
}

export function priceLabel(product: Pick<Product, "price">, settings: SiteSettings): string {
  return typeof product.price === "number" ? `Rs. ${product.price}` : settings.quoteNote;
}

/** Product-level spec overrides win; anything blank falls back to the category. */
export function resolveSpecs(
  product: Pick<Product, "specs" | "unit">,
  category: Category | undefined,
): CategorySpecs & { unit: string } {
  const base = category?.specs;
  return {
    material: product.specs.material ?? base?.material ?? "",
    size: product.specs.size ?? base?.size ?? "",
    finish: product.specs.finish ?? base?.finish ?? "",
    moq: product.specs.moq ?? base?.moq ?? "",
    unit: product.unit || "box",
  };
}

/** A product without its own photo borrows the category cover. */
export function productImage(
  product: Pick<ProductCardData, "image">,
  category: Category | undefined,
): CmsImage | null {
  return product.image ?? category?.image ?? null;
}

export function productGallery(product: Product, category: Category | undefined): CmsImage[] {
  const images = [productImage(product, category), ...product.gallery].filter(
    (img): img is CmsImage => Boolean(img?.url),
  );
  const seen = new Set<string>();
  return images.filter((img) => {
    if (seen.has(img.url)) return false;
    seen.add(img.url);
    return true;
  });
}

export function findCategory(categories: Category[], slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}

export function categoryName(categories: Category[], slug: string, fallback = "Boxes"): string {
  return findCategory(categories, slug)?.name ?? fallback;
}

export function findOccasion(occasions: Occasion[], slug: string): Occasion | undefined {
  return occasions.find((o) => o.slug === slug);
}

export function earliestDeliveryDate(leadTimeDays: number, from = new Date()): Date {
  const d = new Date(from);
  d.setDate(d.getDate() + leadTimeDays);
  return d;
}

export function toDateInputValue(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export type PreOrder = {
  name: string;
  occasion: string;
  product?: string;
  quantity: number;
  deliveryDate: string;
  city?: string;
  notes?: string;
};

export function preOrderWaLink(settings: SiteSettings, o: PreOrder): string {
  const lines = [
    `Assalam-o-Alaikum ${settings.brandName}! I'd like to place a pre-order.`,
    "",
    `• Name: ${o.name}`,
    `• Occasion: ${o.occasion}`,
    o.product ? `• Product / style: ${o.product}` : null,
    `• Quantity: ${o.quantity}`,
    `• Delivery date: ${o.deliveryDate}`,
    o.city ? `• City: ${o.city}` : null,
    o.notes ? `• Notes: ${o.notes}` : null,
    "",
    `I understand orders need ${settings.leadTimeDays} days lead time before the event. Please confirm availability and total price.`,
  ].filter(Boolean);
  return waLink(settings, lines.join("\n"));
}
