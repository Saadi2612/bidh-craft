import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { getSiteContent } from "./cache";
import type {
  AboutContent,
  Category,
  Client,
  ContactContent,
  HomeContent,
  Occasion,
  PreOrderContent,
  Product,
  ProductCardData,
  ShopContent,
  SiteShell,
  Testimonial,
} from "./types";

/**
 * Every page loads from the same cached snapshot, but each server function
 * returns only the slice that page renders. Cards drop specs, galleries, SEO
 * and long copy, which is most of a product document.
 */
function toCard(p: Product): ProductCardData {
  return {
    id: p.id,
    slug: p.slug,
    name: p.name,
    blurb: p.blurb,
    category: p.category,
    categoryName: p.categoryName,
    occasions: p.occasions,
    price: p.price,
    unit: p.unit,
    featured: p.featured,
    image: p.image,
  };
}

/** Header, footer and the WhatsApp buttons — needed on every single page. */
export const fetchShell = createServerFn({ method: "GET" }).handler(
  async (): Promise<SiteShell> => {
    const { content, live } = await getSiteContent();
    return {
      settings: content.settings,
      categories: content.categories,
      occasions: content.occasions,
      isFallback: !live,
    };
  },
);

export const fetchHomePage = createServerFn({ method: "GET" }).handler(
  async (): Promise<{
    home: HomeContent;
    products: ProductCardData[];
    testimonials: Testimonial[];
    clients: Client[];
  }> => {
    const { content } = await getSiteContent();
    return {
      home: content.home,
      products: content.products.map(toCard),
      testimonials: content.testimonials,
      clients: content.clients,
    };
  },
);

export const fetchShopPage = createServerFn({ method: "GET" }).handler(
  async (): Promise<{ shop: ShopContent; products: ProductCardData[] }> => {
    const { content } = await getSiteContent();
    return { shop: content.shop, products: content.products.map(toCard) };
  },
);

export const fetchCategoryPage = createServerFn({ method: "GET" })
  .validator(z.object({ slug: z.string().min(1).max(120) }))
  .handler(
    async ({ data }): Promise<{ category: Category | null; products: ProductCardData[] }> => {
      const { content } = await getSiteContent();
      const category = content.categories.find((c) => c.slug === data.slug) ?? null;
      if (!category) return { category: null, products: [] };
      return {
        category,
        products: content.products.filter((p) => p.category === category.slug).map(toCard),
      };
    },
  );

export const fetchProductPage = createServerFn({ method: "GET" })
  .validator(z.object({ id: z.string().min(1).max(120) }))
  .handler(async ({ data }): Promise<{ product: Product | null; category: Category | null }> => {
    const { content } = await getSiteContent();
    // Links shared before the CMS existed used the old ids, so honour those too.
    const product =
      content.products.find((p) => p.slug === data.id) ??
      content.products.find((p) => p.legacyId === data.id) ??
      content.products.find((p) => p.id === data.id) ??
      null;
    if (!product) return { product: null, category: null };

    const category = content.categories.find((c) => c.slug === product.category) ?? null;
    return { product, category };
  });

export const fetchAboutPage = createServerFn({ method: "GET" }).handler(
  async (): Promise<{ about: AboutContent; clients: Client[]; occasions: Occasion[] }> => {
    const { content } = await getSiteContent();
    return { about: content.about, clients: content.clients, occasions: content.occasions };
  },
);

export const fetchContactPage = createServerFn({ method: "GET" }).handler(
  async (): Promise<{ contact: ContactContent }> => {
    const { content } = await getSiteContent();
    return { contact: content.contact };
  },
);

export const fetchPreOrderPage = createServerFn({ method: "GET" }).handler(
  async (): Promise<{ preOrder: PreOrderContent; productNames: string[] }> => {
    const { content } = await getSiteContent();
    return {
      preOrder: content.preOrder,
      productNames: content.products.map((p) => p.name),
    };
  },
);
