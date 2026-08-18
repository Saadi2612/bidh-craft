import { createFileRoute, Link } from "@tanstack/react-router";

import { Reveal } from "@/components/site/Reveal";
import { useShell } from "@/lib/cms/context";
import { customWaLink } from "@/lib/cms/derive";
import { imageAlt, imageSrcSet, imageUrl } from "@/lib/cms/image";
import { fetchAboutPage } from "@/lib/cms/queries";

export const Route = createFileRoute("/about")({
  loader: () => fetchAboutPage(),
  head: ({ loaderData }) => {
    const seo = loaderData?.about.seo;
    const title = seo?.title ?? "Our Handmade Story — THEBIDHCRAFT";
    const description =
      seo?.description ??
      "THEBIDHCRAFT hand-makes and hand-prints every gift and favor box in Pakistan — for Nikkah, Walima, Mehndi, Aqeeqa and birthdays. Meet the maker behind the boxes.";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "article" },
        { property: "og:url", content: "/about" },
      ],
      links: [{ rel: "canonical", href: "/about" }],
    };
  },
  component: About,
});

function About() {
  const { about, clients, occasions } = Route.useLoaderData();
  const { settings } = useShell();

  const occasionItems = about.occasionsColumn.useOccasionsList
    ? occasions.map((o) => ({ term: o.name, definition: o.note }))
    : about.occasionsColumn.items;

  return (
    <div className="container-x py-14">
      <Reveal className="mx-auto max-w-2xl text-center">
        <p className="eyebrow">{about.eyebrow}</p>
        <h1 className="mt-3 text-4xl sm:text-5xl">{about.title}</h1>
        <p className="mt-5 text-sm leading-relaxed text-muted-foreground">{about.intro}</p>
      </Reveal>

      <Reveal delay={100} className="mt-12">
        <div className="surface-card overflow-hidden">
          <img
            data-image-placeholder="about-story"
            src={imageUrl(about.image, { width: 1200 })}
            srcSet={imageSrcSet(about.image, [600, 900, 1200, 1600])}
            sizes="100vw"
            alt={imageAlt(about.image, `Inside the ${settings.brandName} studio`)}
            loading="lazy"
            width={1200}
            height={912}
            className="max-h-[520px] w-full object-cover"
          />
        </div>
      </Reveal>

      <div className="mx-auto mt-14 grid max-w-4xl gap-10 md:grid-cols-2">
        <Reveal>
          <h2 className="text-2xl">{about.howWeWork.title}</h2>
          {about.howWeWork.paragraphs.map((text, i) => (
            <p key={i} className="mt-4 text-sm leading-relaxed text-muted-foreground">
              {text}
            </p>
          ))}
        </Reveal>
        <Reveal delay={100}>
          <h2 className="text-2xl">{about.occasionsColumn.title}</h2>
          <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
            {occasionItems.map((item) => (
              <li key={item.term}>
                <strong className="text-foreground">{item.term}</strong> — {item.definition}
              </li>
            ))}
          </ul>
        </Reveal>
      </div>

      {clients.length > 0 && (
        <Reveal className="mt-16">
          <div className="surface-card p-8 text-center">
            <p className="eyebrow">{about.clientsHeading}</p>
            <div className="mt-5 flex flex-wrap justify-center gap-2">
              {clients.map((c) => (
                <span key={c.name} className="rounded-full bg-secondary/60 px-4 py-1.5 text-sm">
                  {c.name}
                </span>
              ))}
            </div>
          </div>
        </Reveal>
      )}

      <Reveal className="mt-12 text-center">
        <a href={customWaLink(settings)} target="_blank" rel="noreferrer" className="btn-salmon">
          {about.primaryCta}
        </a>
        <Link to="/shop" className="btn-outline-rose ml-3">
          {about.secondaryCta}
        </Link>
      </Reveal>
    </div>
  );
}
