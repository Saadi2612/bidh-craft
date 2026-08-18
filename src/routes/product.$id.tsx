import { useState } from "react";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";

import { Reveal } from "@/components/site/Reveal";
import { useShell } from "@/lib/cms/context";
import { customWaLink, productGallery, productWaLink, resolveSpecs } from "@/lib/cms/derive";
import { imageAlt, imageSrcSet, imageUrl } from "@/lib/cms/image";
import { fetchProductPage } from "@/lib/cms/queries";

export const Route = createFileRoute("/product/$id")({
  loader: async ({ params }) => {
    const result = await fetchProductPage({ data: { id: params.id } });
    if (!result.product) throw notFound();
    return { product: result.product, category: result.category };
  },
  head: ({ loaderData, params }) => {
    if (!loaderData) {
      return {
        meta: [
          { title: "Product not found — THEBIDHCRAFT" },
          { name: "robots", content: "noindex" },
        ],
      };
    }
    const { name, blurb, price, seo } = loaderData.product;
    const title = seo.title ?? `${name} — Handmade | THEBIDHCRAFT`;
    const priceLine = typeof price === "number" ? ` Rs. ${price}.` : "";
    const description =
      seo.description ??
      `${blurb} Handmade and hand-printed in Pakistan.${priceLine} Order on WhatsApp.`;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "product" },
        { property: "og:url", content: `/product/${params.id}` },
        { name: "twitter:card", content: "summary_large_image" },
      ],
      links: [{ rel: "canonical", href: `/product/${params.id}` }],
    };
  },
  errorComponent: ({ error }) => (
    <div className="container-x py-24 text-center" role="alert">
      <h1 className="text-3xl">Something went wrong</h1>
      <p className="mt-3 text-sm text-muted-foreground">{error.message}</p>
    </div>
  ),
  notFoundComponent: () => (
    <div className="container-x py-24 text-center">
      <h1 className="text-3xl">We couldn't find that piece</h1>
      <Link to="/shop" className="btn-salmon mt-6 inline-flex">
        Browse the shop
      </Link>
    </div>
  ),
  component: ProductPage,
});

function plural(unit: string, n: number) {
  if (n === 1) return unit;
  return unit.endsWith("x") || unit.endsWith("s") ? `${unit}es` : `${unit}s`;
}

function ProductPage() {
  const { product, category } = Route.useLoaderData();
  const { settings } = useShell();
  const gallery = productGallery(product, category ?? undefined);
  const specs = resolveSpecs(product, category ?? undefined);
  const [qty, setQty] = useState(1);
  const [active, setActive] = useState(0);

  const categoryLabel = product.categoryName ?? category?.name ?? "Boxes";
  const mainImage = gallery[active] ?? gallery[0] ?? null;

  return (
    <div className="container-x py-14">
      <Reveal>
        <nav className="text-xs text-muted-foreground">
          <Link to="/" className="hover:text-primary">
            Home
          </Link>{" "}
          /{" "}
          <Link to="/shop" className="hover:text-primary">
            Shop
          </Link>{" "}
          /{" "}
          <Link
            to="/category/$slug"
            params={{ slug: product.category }}
            className="hover:text-primary"
          >
            {categoryLabel}
          </Link>{" "}
          / {product.name}
        </nav>

        <div className="mt-6 grid gap-10 lg:grid-cols-2">
          <div>
            <div className="surface-card overflow-hidden">
              <img
                src={imageUrl(mainImage, { width: 1200, height: 1200 })}
                srcSet={imageSrcSet(mainImage, [600, 900, 1200])}
                sizes="(min-width: 1024px) 50vw, 100vw"
                alt={imageAlt(
                  mainImage,
                  `Handmade ${product.name.toLowerCase()} by ${settings.brandName} — view ${active + 1}`,
                )}
                width={1200}
                height={1200}
                className="aspect-square w-full object-cover"
              />
            </div>
            {gallery.length > 1 && (
              <div className="mt-4 grid grid-cols-4 gap-3">
                {gallery.map((image, i) => (
                  <button
                    key={image.url}
                    onClick={() => setActive(i)}
                    aria-label={`Show image ${i + 1}`}
                    aria-current={i === active}
                    className={`overflow-hidden rounded-2xl border-2 transition-colors ${
                      i === active ? "border-primary" : "border-transparent hover:border-border"
                    }`}
                  >
                    <img
                      src={imageUrl(image, { width: 220, height: 220 })}
                      alt=""
                      width={220}
                      height={220}
                      loading="lazy"
                      className="aspect-square w-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-col justify-center">
            <p className="eyebrow">{categoryLabel}</p>
            <h1 className="mt-3 text-4xl sm:text-5xl">{product.name}</h1>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              {product.description ??
                `${product.blurb} Every piece is handmade and hand-printed to order in our studio, so small variations are part of the charm.`}
            </p>

            {typeof product.price === "number" ? (
              <p className="mt-6 font-display text-3xl">
                Rs. {product.price}
                <span className="font-sans text-sm text-muted-foreground"> / {specs.unit}</span>
              </p>
            ) : (
              <p className="mt-6 font-display text-2xl">
                Price on WhatsApp
                <span className="mt-1 block font-sans text-sm text-muted-foreground">
                  {settings.quoteNote}
                </span>
              </p>
            )}

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <div className="flex items-center rounded-full border border-border">
                <button
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  aria-label="Decrease quantity"
                  className="h-10 w-10 rounded-full hover:bg-secondary/60"
                >
                  −
                </button>
                <span className="w-10 text-center text-sm" aria-live="polite">
                  {qty}
                </span>
                <button
                  onClick={() => setQty((q) => q + 1)}
                  aria-label="Increase quantity"
                  className="h-10 w-10 rounded-full hover:bg-secondary/60"
                >
                  +
                </button>
              </div>
              <a
                href={productWaLink(settings, product.name, qty)}
                target="_blank"
                rel="noreferrer"
                className="btn-salmon"
              >
                Order {qty} {plural(specs.unit, qty)} on WhatsApp
              </a>
              <a
                href={customWaLink(settings)}
                target="_blank"
                rel="noreferrer"
                className="text-sm underline"
              >
                Ask for a custom version
              </a>
            </div>
            <p className="mt-3 text-xs text-muted-foreground">
              {typeof product.price === "number"
                ? `Estimated total Rs. ${product.price * qty} — we confirm final pricing on WhatsApp.`
                : "Send us your quantity on WhatsApp and we'll share the exact price."}
            </p>

            <dl className="surface-card mt-8 grid gap-x-6 gap-y-4 p-6 text-sm sm:grid-cols-2">
              {[
                { label: "Material", value: specs.material },
                { label: "Size", value: specs.size },
                { label: "Sold as", value: `Per ${specs.unit}` },
                { label: "Finish", value: specs.finish },
                { label: "Order quantity", value: specs.moq },
                { label: "Lead time", value: `${settings.leadTimeDays} days before your event` },
              ]
                .filter((row) => row.value)
                .map((row) => (
                  <div key={row.label}>
                    <dt className="eyebrow">{row.label}</dt>
                    <dd className="mt-1 text-muted-foreground">{row.value}</dd>
                  </div>
                ))}
            </dl>

            <ul className="mt-6 space-y-2 text-xs text-muted-foreground">
              <li>· 100% handmade &amp; hand-printed</li>
              <li>· Bulk event orders welcome — 50, 100, 500 pieces</li>
              <li>· Customisation on names, colours and ribbon available</li>
            </ul>
          </div>
        </div>
      </Reveal>

      <div className="mt-14 text-center">
        <Link
          to="/category/$slug"
          params={{ slug: product.category }}
          className="text-sm underline hover:text-primary"
        >
          See all {categoryLabel.toLowerCase()}
        </Link>
      </div>
    </div>
  );
}
