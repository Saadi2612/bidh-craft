import { createFileRoute, Link, notFound } from "@tanstack/react-router";

import { ProductCard } from "@/components/site/ProductCard";
import { Reveal } from "@/components/site/Reveal";
import { useShell } from "@/lib/cms/context";
import { boxPriceRange, customWaLink } from "@/lib/cms/derive";
import { imageAlt, imageSrcSet, imageUrl } from "@/lib/cms/image";
import { fetchCategoryPage } from "@/lib/cms/queries";

export const Route = createFileRoute("/category/$slug")({
  loader: async ({ params }) => {
    const result = await fetchCategoryPage({ data: { slug: params.slug } });
    if (!result.category) throw notFound();
    return { category: result.category, products: result.products };
  },
  head: ({ loaderData, params }) => {
    if (!loaderData) {
      return {
        meta: [
          { title: "Collection not found — THEBIDHCRAFT" },
          { name: "robots", content: "noindex" },
        ],
      };
    }
    const { name, short, seo } = loaderData.category;
    const title = seo.title ?? `${name} — Handmade & Hand-Printed | THEBIDHCRAFT`;
    const description =
      seo.description ??
      `${short} Handmade ${name.toLowerCase()} for Nikkah, Walima, Mehndi, Aqeeqa and birthdays. Order on WhatsApp.`;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "website" },
        { property: "og:url", content: `/category/${params.slug}` },
      ],
      links: [{ rel: "canonical", href: `/category/${params.slug}` }],
    };
  },
  component: CategoryPage,
});

function CategoryPage() {
  const { category, products } = Route.useLoaderData();
  const { settings, categories } = useShell();
  const others = categories.filter((c) => c.slug !== category.slug);

  const priceLine =
    category.pricing === "boxRange" ? `${boxPriceRange(settings)} per box` : settings.quoteNote;

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
          / {category.name}
        </nav>
        <div className="mt-6 grid items-center gap-10 lg:grid-cols-[1.2fr_1fr]">
          <div>
            <h1 className="text-4xl sm:text-5xl">{category.name}</h1>
            <p className="mt-5 max-w-xl text-sm leading-relaxed text-muted-foreground">
              {category.intro}
            </p>
            <p className="mt-5 text-sm">
              {priceLine} · {products.length} designs · custom prints on demand
            </p>
          </div>
          <div className="surface-card overflow-hidden">
            <img
              data-image-placeholder={category.slug}
              src={imageUrl(category.image, { width: 900, height: 675 })}
              srcSet={imageSrcSet(category.image, [600, 900, 1200])}
              sizes="(min-width: 1024px) 40vw, 100vw"
              alt={imageAlt(category.image, category.name)}
              loading="lazy"
              width={900}
              height={675}
              className="aspect-[4/3] w-full object-cover"
            />
          </div>
        </div>
      </Reveal>

      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {products.map((p, i) => (
          <ProductCard key={p.id} product={p} delay={Math.min(i, 8) * 60} />
        ))}
      </div>

      <Reveal className="mt-16">
        <div className="surface-card p-8 text-center">
          <h2 className="text-2xl">Don't see exactly what you pictured?</h2>
          <p className="mx-auto mt-3 max-w-lg text-sm text-muted-foreground">
            Show us any design and we can make it. Just order at least {settings.leadTimeDays} days
            before your event.
          </p>
          <a
            href={customWaLink(settings)}
            target="_blank"
            rel="noreferrer"
            className="btn-salmon mt-6"
          >
            Request a custom box
          </a>
        </div>
      </Reveal>

      <section className="mt-16">
        <p className="eyebrow">Keep exploring</p>
        <h2 className="mt-2 text-2xl">Other collections</h2>
        <div className="mt-6 grid gap-6 sm:grid-cols-3">
          {others.map((c) => (
            <Link
              key={c.slug}
              to="/category/$slug"
              params={{ slug: c.slug }}
              className="surface-card group flex items-center gap-4 overflow-hidden p-3 transition-all hover:-translate-y-1 hover:shadow-[var(--shadow-lift)]"
            >
              <img
                src={imageUrl(c.image, { width: 160, height: 160 })}
                alt={imageAlt(c.image, c.name)}
                loading="lazy"
                width={160}
                height={160}
                className="h-16 w-16 shrink-0 rounded-2xl object-cover"
              />
              <span>
                <span className="block font-display text-base">{c.name}</span>
                <span className="block text-xs text-muted-foreground">{c.short}</span>
              </span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
