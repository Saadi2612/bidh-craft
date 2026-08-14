import { useState } from "react";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Reveal } from "@/components/site/Reveal";
import {
  categoryName,
  CUSTOM_WA,
  productById,
  productGallery,
  productImage,
  productSpecs,
  productWaLink,
} from "@/lib/shop-data";

export const Route = createFileRoute("/product/$id")({
  loader: ({ params }) => {
    const product = productById(params.id);
    if (!product) throw notFound();
    return { product };
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
    const { name, blurb, price } = loaderData.product;
    const title = `${name} — Handmade | THEBIDHCRAFT`;
    const description = `${blurb} Handmade and hand-printed in Pakistan, Rs. ${price}. Order on WhatsApp — please allow 5 days before your event.`;
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
  const { product } = Route.useLoaderData();
  const gallery = productGallery(product);
  const specs = productSpecs(product);
  const [qty, setQty] = useState(1);
  const [active, setActive] = useState(0);

  return (
    <div className="container-x py-14">
      <Reveal>
        <nav className="text-xs text-muted-foreground">
          <Link to="/" className="hover:text-primary">Home</Link> /{" "}
          <Link to="/shop" className="hover:text-primary">Shop</Link> /{" "}
          <Link
            to="/category/$slug"
            params={{ slug: product.category }}
            className="hover:text-primary"
          >
            {categoryName(product.category)}
          </Link>{" "}
          / {product.name}
        </nav>

        <div className="mt-6 grid gap-10 lg:grid-cols-2">
          <div>
            <div className="surface-card overflow-hidden">
              <img
                src={gallery[active] ?? productImage(product)}
                alt={`Handmade ${product.name.toLowerCase()} by THEBIDHCRAFT — view ${active + 1}`}
                width={1200}
                height={1200}
                className="aspect-square w-full object-cover"
              />
            </div>
            {gallery.length > 1 && (
              <div className="mt-4 grid grid-cols-4 gap-3">
                {gallery.map((src, i) => (
                  <button
                    key={src}
                    onClick={() => setActive(i)}
                    aria-label={`Show image ${i + 1}`}
                    aria-current={i === active}
                    className={`overflow-hidden rounded-2xl border-2 transition-colors ${
                      i === active ? "border-primary" : "border-transparent hover:border-border"
                    }`}
                  >
                    <img
                      src={src}
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
            <p className="eyebrow">{categoryName(product.category)}</p>
            <h1 className="mt-3 text-4xl sm:text-5xl">{product.name}</h1>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              {product.blurb} Every piece is handmade and hand-printed to order in our studio,
              so small variations are part of the charm.
            </p>

            {typeof product.price === "number" ? (
              <p className="mt-6 font-display text-3xl">
                Rs. {product.price}
                <span className="font-sans text-sm text-muted-foreground">
                  {" "}/ {specs.unit}
                </span>
              </p>
            ) : (
              <p className="mt-6 font-display text-2xl">
                Price on WhatsApp
                <span className="mt-1 block font-sans text-sm text-muted-foreground">
                  Quoted as per quantity and customisation.
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
                <span className="w-10 text-center text-sm" aria-live="polite">{qty}</span>
                <button
                  onClick={() => setQty((q) => q + 1)}
                  aria-label="Increase quantity"
                  className="h-10 w-10 rounded-full hover:bg-secondary/60"
                >
                  +
                </button>
              </div>
              <a
                href={productWaLink(product.name, qty)}
                target="_blank"
                rel="noreferrer"
                className="btn-salmon"
              >
                Order {qty} {plural(specs.unit, qty)} on WhatsApp
              </a>
              <a href={CUSTOM_WA} target="_blank" rel="noreferrer" className="text-sm underline">
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
                { label: "Lead time", value: "5 days before your event" },
              ].map((row) => (
                <div key={row.label}>
                  <dt className="eyebrow">{row.label}</dt>
                  <dd className="mt-1 text-muted-foreground">{row.value}</dd>
                </div>
              ))}
            </dl>

            <ul className="mt-6 space-y-2 text-xs text-muted-foreground">
              <li>· 100% handmade & hand-printed</li>
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
          See all {categoryName(product.category).toLowerCase()}
        </Link>
      </div>
    </div>
  );

}
