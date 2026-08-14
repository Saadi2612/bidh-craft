import { createFileRoute, Link } from "@tanstack/react-router";
import storyImg from "@/assets/our-story.jpg";
import { Reveal } from "@/components/site/Reveal";
import { clients, CUSTOM_WA } from "@/lib/shop-data";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "Our Handmade Story — THEBIDHCRAFT" },
      {
        name: "description",
        content:
          "THEBIDHCRAFT hand-makes and hand-prints every gift and favor box in Pakistan — for Nikkah, Walima, Mehndi, Aqeeqa and birthdays. Meet the maker behind the boxes.",
      },
      { property: "og:title", content: "Our Handmade Story — THEBIDHCRAFT" },
      { property: "og:description", content: "100% handmade and hand-printed boxes, made with care for life's happiest moments." },
      { property: "og:type", content: "article" },
      { property: "og:url", content: "/about" },
    ],
    links: [{ rel: "canonical", href: "/about" }],
  }),
  component: About,
});

function About() {
  return (
    <div className="container-x py-14">
      <Reveal className="mx-auto max-w-2xl text-center">
        <p className="eyebrow">Our story</p>
        <h1 className="mt-3 text-4xl sm:text-5xl">Everything here is made by hand</h1>
        <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
          THEBIDHCRAFT is a small Pakistani studio making decorative gift and favor boxes — the
          little "bid boxes" that guests carry home from your happiest days.
        </p>
      </Reveal>

      <Reveal delay={100} className="mt-12">
        <div className="surface-card overflow-hidden">
          <img
            data-image-placeholder="about-story"
            src={storyImg}
            alt="Hands hand-printing a floral block pattern onto a pink handmade gift box"
            loading="lazy"
            width={1200}
            height={912}
            className="max-h-[520px] w-full object-cover"
          />
        </div>
      </Reveal>

      <div className="mx-auto mt-14 grid max-w-4xl gap-10 md:grid-cols-2">
        <Reveal>
          <h2 className="text-2xl">How we work</h2>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            Card is cut and scored by hand, folded, then block-printed or hand-painted. Ribbons are
            tied one by one, tags are lettered individually, and each box is checked before it's
            packed. Nothing is outsourced to a factory.
          </p>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            Because of that, we ask for at least 5 days' notice before your event — more for large
            bulk orders — so the ink dries properly and nothing is rushed.
          </p>
        </Reveal>
        <Reveal delay={100}>
          <h2 className="text-2xl">Occasions we make for</h2>
          <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
            <li><strong className="text-foreground">Nikkah</strong> — the marriage ceremony itself.</li>
            <li><strong className="text-foreground">Walima</strong> — the reception hosted after the wedding.</li>
            <li><strong className="text-foreground">Mehndi</strong> — the henna night before the wedding.</li>
            <li><strong className="text-foreground">Aqeeqa</strong> — the celebration held for a newborn.</li>
            <li><strong className="text-foreground">Birthdays</strong> — and every other happy moment.</li>
          </ul>
        </Reveal>
      </div>

      <Reveal className="mt-16">
        <div className="surface-card p-8 text-center">
          <p className="eyebrow">Some of the names we've packed for</p>
          <div className="mt-5 flex flex-wrap justify-center gap-2">
            {clients.map((c) => (
              <span key={c} className="rounded-full bg-secondary/60 px-4 py-1.5 text-sm">{c}</span>
            ))}
          </div>
        </div>
      </Reveal>

      <Reveal className="mt-12 text-center">
        <a href={CUSTOM_WA} target="_blank" rel="noreferrer" className="btn-salmon">
          Start a custom order
        </a>
        <Link to="/shop" className="btn-outline-rose ml-3">Browse the shop</Link>
      </Reveal>
    </div>
  );
}
