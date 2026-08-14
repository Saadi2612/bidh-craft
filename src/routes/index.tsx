import { createFileRoute, Link } from "@tanstack/react-router";
import { Sparkles, MessageCircle, Truck, Palette } from "lucide-react";
import heroImg from "@/assets/hero-boxes.jpg";
import storyImg from "@/assets/our-story.jpg";
import { ProductCard } from "@/components/site/ProductCard";
import { Reveal } from "@/components/site/Reveal";
import { CategoryLandingSections, CategoryThumbRail } from "@/components/site/CategoryLanding";
import { ProductDedupeProvider, useUniqueProducts } from "@/lib/product-dedupe";

import {
  categories,
  clients,
  CUSTOM_WA,
  INSTAGRAM_URL,
  occasions,
  ORDER_WA,
  products,
  productsByCategory,
} from "@/lib/shop-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "THEBIDHCRAFT — Handcrafted Boxes for Every Happy Moment" },
      {
        name: "description",
        content:
          "Handmade, hand-printed bid boxes, favor boxes, tin boxes and sweet boxes for Nikkah, Walima, Mehndi, Aqeeqa and birthdays. Boxes from Rs. 150 to Rs. 210 — other pieces quoted on WhatsApp.",
      },
      { property: "og:title", content: "THEBIDHCRAFT — Handcrafted Boxes for Every Happy Moment" },
      {
        property: "og:description",
        content:
          "100% handmade & hand-printed gift and favor boxes from Pakistan. Custom designs on demand — order on WhatsApp.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
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
  // Claimed first, so best sellers always keep the strongest designs and the
  // collection rails below fill in with different ones.
  const featured = useUniqueProducts(
    "home-featured",
    products.filter((p) => p.featured),
    { limit: 8 },
  );

  return (
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(150deg,var(--rose)_0%,var(--cream)_55%,var(--card)_100%)]" />
        <div className="container-x grid items-center gap-12 py-16 md:py-24 lg:grid-cols-2">
          <Reveal>
            <p className="eyebrow">100% handmade &amp; hand-printed</p>
            <h1 className="mt-4 text-4xl leading-[1.08] sm:text-5xl lg:text-6xl">
              Handcrafted Boxes for Every Happy Moment
            </h1>
            <p className="mt-5 max-w-lg text-[0.95rem] leading-relaxed text-muted-foreground">
              Every box is cut, folded, printed and tied by hand in our little studio — made for
              Nikkah, Walima, Mehndi, Aqeeqa and birthdays. Boxes start at Rs. 150 and go up to
              Rs. 210 depending on size and finish. Signs, pens, bazubands and velvet plaques are
              priced on WhatsApp as per your quantity.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/shop" className="btn-salmon">Shop Now</Link>
              <a href={ORDER_WA} target="_blank" rel="noreferrer" className="btn-outline-rose">
                Order on WhatsApp
              </a>
            </div>
            <div className="mt-8 flex flex-wrap gap-x-7 gap-y-2 text-xs text-muted-foreground">
              <span>Boxes Rs. 150 – 210 per piece</span>
              <span>Custom designs on demand</span>
              <span>Order 5 days before your event</span>
            </div>
          </Reveal>

          <Reveal delay={120}>
            <div className="relative">
              <div className="surface-card overflow-hidden float-soft">
                {/* IMAGE PLACEHOLDER — swap for your own flat-lay photo */}
                <img
                  data-image-placeholder="hero"
                  src={heroImg}
                  alt="Flat-lay of handmade hand-printed pink favor boxes with ribbons and rose petals"
                  width={1408}
                  height={1104}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="surface-card absolute -bottom-6 -left-4 hidden px-5 py-3 sm:block">
                <p className="font-display text-lg">Rs. 150 – 210</p>
                <p className="text-[0.68rem] text-muted-foreground">per handmade box</p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* CLIENTS MARQUEE */}
      <section className="border-y border-border bg-card py-6" aria-label="Brands and creators we have worked with">
        <p className="container-x eyebrow text-center">Trusted by brands &amp; creators we've packed for</p>
        <div className="mt-4 overflow-hidden">
          <div className="marquee-track flex w-max gap-10 pr-10">
            {[...clients, ...clients].map((c, i) => (
              <span key={i} className="font-display text-lg whitespace-nowrap text-muted-foreground">
                {c}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* SHOP BY CATEGORY */}
      <section className="container-x py-20">
        <SectionHead
          eyebrow="Shop by category"
          title="Find your box type"
          sub="Four core collections — and we add new ones every season."
        />
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
                  src={c.image}
                  alt={c.imageAlt}
                  loading="lazy"
                  width={900}
                  height={900}
                  className="aspect-[4/3] w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="p-5">
                  <h3 className="font-display text-lg">{c.name}</h3>
                  <p className="mt-1 text-xs text-muted-foreground">{c.short}</p>
                  <p className="mt-4 flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">{productsByCategory(c.slug).length} designs</span>
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
          <SectionHead
            eyebrow="Browse collections"
            title="Explore every collection"
            sub="Swipe through each collection — tap any design to order on WhatsApp."
          />
          <div className="mt-10">
            <CategoryLandingSections />
          </div>
        </div>
      </section>


      {/* SHOP BY OCCASION */}
      <section className="relative overflow-hidden bg-[linear-gradient(180deg,var(--card)_0%,color-mix(in_oklab,var(--rose)_55%,var(--cream))_100%)] py-20">
        <div className="container-x">
          <SectionHead
            eyebrow="Shop by occasion"
            title="Made for your celebration"
            sub="Tell us the event and we'll match the box, the colours and the print."
          />
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
        <SectionHead
          eyebrow="Best sellers"
          title="Loved by our customers"
          sub="Boxes are Rs. 150 to Rs. 210 depending on size and finish. Everything else is quoted on WhatsApp as per quantity."
        />
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((p, i) => (
            <ProductCard key={p.id} product={p} delay={i * 70} />
          ))}
        </div>
        <div className="mt-10 text-center">
          <Link to="/shop" className="btn-outline-rose">View the full collection</Link>
        </div>
      </section>

      {/* CUSTOM / ON DEMAND */}
      <section className="container-x pb-20">
        <Reveal>
          <div className="surface-card grid items-center gap-8 overflow-hidden p-8 md:grid-cols-[1.2fr_1fr] md:p-12">
            <div>
              <p className="eyebrow">Custom &amp; on demand</p>
              <h2 className="mt-3 text-3xl sm:text-4xl">You show it, we make it.</h2>
              <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground">
                Send us a photo, a Pinterest screenshot or just an idea — colours, monograms, names,
                dates, logos, anything. We hand-make it to match. Bulk event orders and corporate
                gifting welcome.
              </p>
              <p className="mt-4 rounded-2xl bg-secondary/60 px-4 py-3 text-sm">
                ⏳ Please place custom orders <strong>at least 5 days before</strong> your event so
                every box is printed and dried properly.
              </p>
              <a href={CUSTOM_WA} target="_blank" rel="noreferrer" className="btn-salmon mt-6">
                Share your design on WhatsApp
              </a>
            </div>
            <ul className="grid gap-4">
              {[
                { icon: Palette, t: "Any colour or print", d: "Matched to your event theme." },
                { icon: Sparkles, t: "Names & monograms", d: "Hand-lettered tags and foiling." },
                { icon: Truck, t: "Bulk event orders", d: "50, 100, 500 boxes — no problem." },
              ].map(({ icon: Icon, t, d }) => (
                <li key={t} className="flex gap-3 rounded-2xl bg-background/70 p-4">
                  <Icon size={20} className="mt-0.5 shrink-0 text-primary" />
                  <div>
                    <p className="text-sm font-medium">{t}</p>
                    <p className="text-xs text-muted-foreground">{d}</p>
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
              {/* IMAGE PLACEHOLDER — replace with a photo of your workspace */}
              <img
                data-image-placeholder="story"
                src={storyImg}
                alt="Maker hand-printing a floral pattern onto a pink gift box in the THEBIDHCRAFT studio"
                loading="lazy"
                width={1200}
                height={912}
                className="w-full object-cover"
              />
            </div>
          </Reveal>
          <Reveal delay={120}>
            <p className="eyebrow">Our story</p>
            <h2 className="mt-3 text-3xl sm:text-4xl">Made by hand, for life's happiest moments</h2>
            <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
              THEBIDHCRAFT began at a kitchen table with a stack of card, one wooden block and a
              wedding to prepare for. Everything you see here is still made the same way — cut,
              scored, folded, printed and tied by hand. No factory lines, no mass production.
            </p>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              That means small imperfections, and we love them: they're proof a person made your
              box. From a hundred Nikkah favors to a single Aqeeqa announcement, each one leaves
              our studio wrapped with the same care.
            </p>
            <Link to="/about" className="btn-outline-rose mt-7">Read our story</Link>
          </Reveal>
        </div>
      </section>

      {/* HOW TO ORDER */}
      <section className="bg-card py-20">
        <div className="container-x">
          <SectionHead
            eyebrow="How to order"
            title="Three simple steps"
            sub="No cart needed — we handle everything personally over WhatsApp."
          />
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {[
              { icon: Sparkles, t: "1. Browse & pick", d: "Choose your box type, colour and occasion from the shop." },
              { icon: MessageCircle, t: "2. Message us", d: "Send the product name and quantity on WhatsApp." },
              { icon: Truck, t: "3. We confirm", d: "Customization, price and delivery confirmed — then we make it." },
            ].map(({ icon: Icon, t, d }, i) => (
              <Reveal key={t} delay={i * 100}>
                <div className="surface-card h-full p-7">
                  <span className="grid h-12 w-12 place-items-center rounded-full bg-secondary/70">
                    <Icon size={20} />
                  </span>
                  <h3 className="mt-5 font-display text-xl">{t}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* INSTAGRAM */}
      <section className="container-x py-20">
        <SectionHead eyebrow="@thebidhcraft" title="From our Instagram" sub="Fresh boxes, behind-the-scenes and real event orders." />
        <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {[...categories, ...categories].slice(0, 6).map((c, i) => (
            <a
              key={i}
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noreferrer"
              className="group relative overflow-hidden rounded-3xl"
            >
              {/* IMAGE PLACEHOLDER — swap for real Instagram photos */}
              <img
                data-image-placeholder={`ig-${i}`}
                src={c.image}
                alt={`THEBIDHCRAFT Instagram post — ${c.imageAlt}`}
                loading="lazy"
                width={900}
                height={900}
                className="aspect-square w-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
            </a>
          ))}
        </div>
        <div className="mt-8 text-center">
          <a href={INSTAGRAM_URL} target="_blank" rel="noreferrer" className="btn-salmon">
            Follow us @thebidhcraft
          </a>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="container-x pb-20">
        <SectionHead eyebrow="Kind words" title="What our customers say" />
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {[
            { q: "The boxes were even prettier in person. Every guest at my Mehndi asked where I got them.", n: "Sana", o: "Mehndi order" },
            { q: "We ordered 250 favor boxes for our Walima and they arrived perfectly packed, three days early.", n: "Hamza & Ayesha", o: "Walima order" },
            { q: "They matched our Aqeeqa theme exactly from one photo I sent. So personal.", n: "Mariam", o: "Aqeeqa order" },
          ].map((t, i) => (
            <Reveal key={t.n} delay={i * 100}>
              <figure className="surface-card h-full p-7">
                <p className="text-gold" aria-hidden="true">★★★★★</p>
                <blockquote className="mt-3 font-display text-lg leading-snug">"{t.q}"</blockquote>
                <figcaption className="mt-4 text-xs text-muted-foreground">
                  {t.n} — {t.o}
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </section>
    </div>
  );
}

function SectionHead({ eyebrow, title, sub }: { eyebrow: string; title: string; sub?: string }) {
  return (
    <Reveal className="text-center">
      <p className="eyebrow">{eyebrow}</p>
      <h2 className="mt-3 text-3xl sm:text-4xl">{title}</h2>
      {sub && <p className="mx-auto mt-3 max-w-xl text-sm text-muted-foreground">{sub}</p>}
    </Reveal>
  );
}
