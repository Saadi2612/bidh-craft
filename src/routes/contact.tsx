import { createFileRoute, Link } from "@tanstack/react-router";
import { Instagram, Mail, Phone, Clock } from "lucide-react";

import { Reveal } from "@/components/site/Reveal";
import { useShell } from "@/lib/cms/context";
import { generalWaLink } from "@/lib/cms/derive";
import { fetchContactPage } from "@/lib/cms/queries";

export const Route = createFileRoute("/contact")({
  loader: () => fetchContactPage(),
  head: ({ loaderData }) => {
    const seo = loaderData?.contact.seo;
    const title = seo?.title ?? "Contact & Custom Orders — THEBIDHCRAFT";
    const description =
      seo?.description ??
      "Message THEBIDHCRAFT on WhatsApp or email us for handmade favor, tin, sweet and baby announcement boxes.";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "website" },
        { property: "og:url", content: "/contact" },
      ],
      links: [{ rel: "canonical", href: "/contact" }],
    };
  },
  component: Contact,
});

function Contact() {
  const { contact } = Route.useLoaderData();
  const { settings } = useShell();
  const generalWa = generalWaLink(settings);

  const cards = [
    { icon: Phone, label: "WhatsApp & Call", value: settings.phoneDisplay, href: generalWa },
    { icon: Mail, label: "Email", value: settings.email, href: `mailto:${settings.email}` },
    {
      icon: Instagram,
      label: "Instagram",
      value: settings.instagramHandle,
      href: settings.instagramUrl,
    },
    {
      icon: Clock,
      label: contact.leadTimeCardLabel,
      value: `Order ${settings.leadTimeDays}+ days before your event`,
      href: null,
    },
  ];

  return (
    <div className="container-x py-14">
      <Reveal className="mx-auto max-w-2xl text-center">
        <p className="eyebrow">{contact.eyebrow}</p>
        <h1 className="mt-3 text-4xl sm:text-5xl">{contact.title}</h1>
        <p className="mt-5 text-sm text-muted-foreground">{contact.intro}</p>
      </Reveal>

      <div className="mx-auto mt-12 grid max-w-4xl gap-6 md:grid-cols-2">
        {cards.map(({ icon: Icon, label, value, href }, i) => (
          <Reveal key={label} delay={i * 80}>
            <div className="surface-card flex h-full items-start gap-4 p-6">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-secondary/70">
                <Icon size={18} />
              </span>
              <div>
                <p className="eyebrow">{label}</p>
                {href ? (
                  <a
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-1 block font-display text-lg hover:text-primary"
                  >
                    {value}
                  </a>
                ) : (
                  <p className="mt-1 font-display text-lg">{value}</p>
                )}
              </div>
            </div>
          </Reveal>
        ))}
      </div>

      <Reveal className="mx-auto mt-12 max-w-2xl text-center">
        <div className="surface-card p-8">
          <h2 className="text-2xl">{contact.bulk.title}</h2>
          <p className="mt-3 text-sm text-muted-foreground">{contact.bulk.body}</p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <a href={generalWa} target="_blank" rel="noreferrer" className="btn-salmon">
              {contact.bulk.primaryCta}
            </a>
            <Link to="/pre-order" className="btn-salmon">
              {contact.bulk.secondaryCta}
            </Link>
          </div>
        </div>
      </Reveal>
    </div>
  );
}
