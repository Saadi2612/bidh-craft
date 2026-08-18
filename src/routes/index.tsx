import { createFileRoute, Link } from "@tanstack/react-router";

import { ProductCard } from "@/components/site/ProductCard";
import { Reveal } from "@/components/site/Reveal";
import { Icon } from "@/components/site/Icon";
import { CategoryLandingSections, CategoryThumbRail } from "@/components/site/CategoryLanding";
import { ProductDedupeProvider, useUniqueProducts } from "@/lib/product-dedupe";
import { useShell } from "@/lib/cms/context";
import { customWaLink, orderWaLink } from "@/lib/cms/derive";
import { imageAlt, imageSrcSet, imageUrl } from "@/lib/cms/image";
import { fetchHomePage } from "@/lib/cms/queries";
import type { CmsImage, Heading } from "@/lib/cms/types";

export const Route = createFileRoute("/")({
  loader: () => fetchHomePage(),
  head: ({ loaderData }) => {
    const seo = loaderData?.home.seo;
    const title = seo?.title ?? "THEBIDHCRAFT — Handcrafted Boxes for Every Happy Moment";
    const description =
      seo?.description ??
      "Handmade, hand-printed bid boxes, favor boxes, tin boxes and sweet boxes for Nikkah, Walima, Mehndi, Aqeeqa and birthdays. Boxes from Rs. 150 to Rs. 210 — other pieces quoted on WhatsApp.";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "website" },
        { property: "og:url", content: "/" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
      links: [{ rel: "canonical", href: "/" }],
    };
  },
  component: Home,
});

function Home() {
  return (
    <ProductDedupeProvider>
      <HomeContent />
    </ProductDedupeProvider>
  );
}

function HomeContent() {
  const { home, products, testimonials, clients } = Route.useLoaderData();
  const { settings, categories, occasions } = useShell();

  // Claimed first, so best sellers always keep the strongest designs and the
  // collection rails below fill in with different ones.
  const featured = useUniqueProducts(
    "home-featured",
    products.filter((p) => p.featured),
    { limit: home.featuredLimit },
  );

  const clientNames = clients.map((c) => c.name);
  const instagramImages: CmsImage[] =
    home.instagramImages.length > 0
      ? home.instagramImages
      : categories
          .map((c) => c.image)
          .filter((i): i is CmsImage => Boolean(i))
          .slice(0, 6);

  return (
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(150deg,var(--rose)_0%,var(--cream)_55%,var(--card)_100%)]" />
        <div className="container-x grid items-center gap-12 py-16 md:py-24 lg:grid-cols-2">
          <Reveal>
            <p className="eyebrow">{home.hero.eyebrow}</p>
            <h1 className="mt-4 text-4xl leading-[1.08] sm:text-5xl lg:text-6xl">
              {home.hero.title}
            </h1>
            <p className="mt-5 max-w-lg text-[0.95rem] leading-relaxed text-muted-foreground">
              {home.hero.body}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/shop" className="btn-salmon">
                {home.hero.primaryCta}
              </Link>
              <a
                href={orderWaLink(settings)}
                target="_blank"
                rel="noreferrer"
                className="btn-outline-rose"
              >
                {home.hero.secondaryCta}
              </a>
            </div>
            <div className="mt-8 flex flex-wrap gap-x-7 gap-y-2 text-xs text-muted-foreground">
              {home.hero.badges.map((badge) => (
                <span key={badge}>{badge}</span>
              ))}
            </div>
          </Reveal>

          <Reveal delay={120}>
            <div className="relative">
              <div className="surface-card overflow-hidden float-soft">
                <img
                  data-image-placeholder="hero"
                  src={imageUrl(home.hero.image, { width: 1200 })}
                  srcSet={imageSrcSet(home.hero.image, [800, 1200, 1600])}
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  alt={imageAlt(
                    home.hero.image,
                    `Flat-lay of handmade boxes by ${settings.brandName}`,
                  )}
                  width={1408}
                  height={1104}
                  className="h-full w-full object-cover"
                />
              </div>
              {(home.hero.priceBadge.title || home.hero.priceBadge.sub) && (
                <div className="surface-card absolute -bottom-6 -left-4 hidden px-5 py-3 sm:block">
                  <p className="font-display text-lg">{home.hero.priceBadge.title}</p>
                  <p className="text-[0.68rem] text-muted-foreground">{home.hero.priceBadge.sub}</p>
                </div>
              )}
            </div>
          </Reveal>
        </div>
      </section>

      {/* CLIENTS MARQUEE */}
      {clientNames.length > 0 && (
        <section
          className="border-y border-border bg-card py-6"
          aria-label="Brands and creators we have worked with"
        >
          <p className="container-x eyebrow text-center">{home.clientsHeading}</p>
          <div className="mt-4 overflow-hidden">
            <div className="marquee-track flex w-max gap-10 pr-10">
              {[...clientNames, ...clientNames].map((c, i) => (
                <span
                  key={`${c}-${i}`}
                  className="font-display text-lg whitespace-nowrap text-muted-foreground"
                >
                  {c}
                </span>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* SHOP BY CATEGORY */}
      <section className="container-x py-20">
        <SectionHead heading={home.categoriesSection} />
        <div className="mt-8">
          <CategoryThumbRail />
        </div>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((c, i) => (
            <Reveal key={c.slug} delay={i * 90}>
              <Link
                to="/category/$slug"
                params={{ slug: c.slug }}
                className="surface-card group block h-full overflow-hidden transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[var(--shadow-lift)]"
              >
                <img
                  data-image-placeholder={c.slug}
                  src={imageUrl(c.image, { width: 600, height: 450 })}
                  srcSet={imageSrcSet(c.image, [400, 600, 900])}
                  sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                  alt={imageAlt(c.image, c.name)}
                  loading="lazy"
                  width={900}
                  height={675}
                  className="aspect-[4/3] w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="p-5">
                  <h3 className="font-display text-lg">{c.name}</h3>
                  <p className="mt-1 text-xs text-muted-foreground">{c.short}</p>
                  <p className="mt-4 flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">
                      {products.filter((p) => p.category === c.slug).length} designs
                    </span>
                    <span className="text-primary group-hover:underline">Shop now →</span>
                  </p>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* CATEGORY LANDING SECTIONS */}
      <section className="bg-card/60 py-20">
        <div className="container-x">
          <SectionHead heading={home.collectionsSection} />
          <div className="mt-10">
            <CategoryLandingSections products={products} />
          </div>
        </div>
      </section>

      {/* SHOP BY OCCASION */}
      <section className="relative overflow-hidden bg-[linear-gradient(180deg,var(--card)_0%,color-mix(in_oklab,var(--rose)_55%,var(--cream))_100%)] py-20">
        <div className="container-x">
          <SectionHead heading={home.occasionsSection} />
          <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {occasions.map((o, i) => (
              <Reveal key={o.slug} delay={i * 80}>
                <Link
                  to="/shop"
                  search={{ occasion: o.slug }}
                  className="surface-card group flex h-full flex-col items-center gap-2 px-4 py-8 text-center transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[var(--shadow-lift)]"
                >
                  <span className="grid h-16 w-16 place-items-center rounded-full bg-secondary/70 text-2xl transition-transform duration-300 group-hover:scale-110">
                    {o.emoji}
                  </span>
                  <span className="font-display text-lg">{o.name}</span>
                  <span className="text-[0.68rem] text-muted-foreground">{o.note}</span>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section className="container-x py-20">
        <SectionHead heading={home.featuredSection} />
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((p, i) => (
            <ProductCard key={p.id} product={p} delay={i * 70} />
          ))}
        </div>
        <div className="mt-10 text-center">
          <Link to="/shop" className="btn-outline-rose">
            View the full collection
          </Link>
        </div>
      </section>

      {/* CUSTOM / ON DEMAND */}
      <section className="container-x pb-20">
        <Reveal>
          <div className="surface-card grid items-center gap-8 overflow-hidden p-8 md:grid-cols-[1.2fr_1fr] md:p-12">
            <div>
              <p className="eyebrow">{home.customSection.eyebrow}</p>
              <h2 className="mt-3 text-3xl sm:text-4xl">{home.customSection.title}</h2>
              <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground">
                {home.customSection.body}
              </p>
              {home.customSection.note && (
                <p className="mt-4 rounded-2xl bg-secondary/60 px-4 py-3 text-sm">
                  {home.customSection.note}
                </p>
              )}
              <a
                href={customWaLink(settings)}
                target="_blank"
                rel="noreferrer"
                className="btn-salmon mt-6"
              >
                {home.customSection.cta}
              </a>
            </div>
            <ul className="grid gap-4">
              {home.customSection.features.map((f) => (
                <li key={f.title} className="flex gap-3 rounded-2xl bg-background/70 p-4">
                  <Icon name={f.icon} size={20} className="mt-0.5 shrink-0 text-primary" />
                  <div>
                    <p className="text-sm font-medium">{f.title}</p>
                    <p className="text-xs text-muted-foreground">{f.body}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </section>

      {/* OUR STORY */}
      <section className="container-x pb-20">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <Reveal>
            <div className="surface-card overflow-hidden">
              <img
                data-image-placeholder="story"
                src={imageUrl(home.story.image, { width: 1200 })}
                srcSet={imageSrcSet(home.story.image, [600, 900, 1200])}
                sizes="(min-width: 1024px) 50vw, 100vw"
                alt={imageAlt(home.story.image, `Inside the ${settings.brandName} studio`)}
                loading="lazy"
                width={1200}
                height={912}
                className="w-full object-cover"
              />
            </div>
          </Reveal>
          <Reveal delay={120}>
            <p className="eyebrow">{home.story.eyebrow}</p>
            <h2 className="mt-3 text-3xl sm:text-4xl">{home.story.title}</h2>
            {home.story.paragraphs.map((text, i) => (
              <p
                key={i}
                className={`text-sm leading-relaxed text-muted-foreground ${i === 0 ? "mt-5" : "mt-4"}`}
              >
                {text}
              </p>
            ))}
            {home.story.cta && (
              <Link to="/about" className="btn-outline-rose mt-7">
                {home.story.cta}
              </Link>
            )}
          </Reveal>
        </div>
      </section>

      {/* HOW TO ORDER */}
      <section className="bg-card py-20">
        <div className="container-x">
          <SectionHead heading={home.howToOrderSection} />
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {home.howToOrderSteps.map((step, i) => (
              <Reveal key={step.title} delay={i * 100}>
                <div className="surface-card h-full p-7">
                  <span className="grid h-12 w-12 place-items-center rounded-full bg-secondary/70">
                    <Icon name={step.icon} size={20} />
                  </span>
                  <h3 className="mt-5 font-display text-xl">{step.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{step.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* INSTAGRAM */}
      <section className="container-x py-20">
        <SectionHead heading={home.instagramSection} />
        <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {instagramImages.map((image, i) => (
            <a
              key={`${image.url}-${i}`}
              href={settings.instagramUrl}
              target="_blank"
              rel="noreferrer"
              className="group relative overflow-hidden rounded-3xl"
            >
              <img
                data-image-placeholder={`ig-${i}`}
                src={imageUrl(image, { width: 400, height: 400 })}
                alt={imageAlt(image, `${settings.brandName} on Instagram`)}
                loading="lazy"
                width={400}
                height={400}
                className="aspect-square w-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
            </a>
          ))}
        </div>
        <div className="mt-8 text-center">
          <a href={settings.instagramUrl} target="_blank" rel="noreferrer" className="btn-salmon">
            {home.instagramCta}
          </a>
        </div>
      </section>

      {/* TESTIMONIALS */}
      {testimonials.length > 0 && (
        <section className="container-x pb-20">
          <SectionHead heading={home.testimonialsSection} />
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {testimonials.map((t, i) => (
              <Reveal key={`${t.authorName}-${i}`} delay={i * 100}>
                <figure className="surface-card h-full p-7">
                  <p className="text-gold" aria-hidden="true">
                    {"★".repeat(t.rating)}
                  </p>
                  <blockquote className="mt-3 font-display text-lg leading-snug">
                    "{t.quote}"
                  </blockquote>
                  <figcaption className="mt-4 text-xs text-muted-foreground">
                    {t.authorName} — {t.context}
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function SectionHead({ heading }: { heading: Heading }) {
  return (
    <Reveal className="text-center">
      <p className="eyebrow">{heading.eyebrow}</p>
      <h2 className="mt-3 text-3xl sm:text-4xl">{heading.title}</h2>
      {heading.sub && (
        <p className="mx-auto mt-3 max-w-xl text-sm text-muted-foreground">{heading.sub}</p>
      )}
    </Reveal>
  );
}
