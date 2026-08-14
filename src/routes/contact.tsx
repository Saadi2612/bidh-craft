import { createFileRoute, Link } from "@tanstack/react-router";
import { Instagram, Mail, Phone, Clock } from "lucide-react";
import { Reveal } from "@/components/site/Reveal";
import { EMAIL, GENERAL_WA, INSTAGRAM_URL, PHONE_DISPLAY } from "@/lib/shop-data";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact & Custom Orders — THEBIDHCRAFT" },
      {
        name: "description",
        content:
          "Message THEBIDHCRAFT on WhatsApp at 0307 9701492 or email thebidhcraft@gmail.com for handmade favor, tin, sweet and baby announcement boxes.",
      },
      { property: "og:title", content: "Contact & Custom Orders — THEBIDHCRAFT" },
      { property: "og:description", content: "Order handmade boxes on WhatsApp — custom designs welcome." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/contact" },
    ],
    links: [{ rel: "canonical", href: "/contact" }],
  }),
  component: Contact,
});

function Contact() {
  return (
    <div className="container-x py-14">
      <Reveal className="mx-auto max-w-2xl text-center">
        <p className="eyebrow">Say hello</p>
        <h1 className="mt-3 text-4xl sm:text-5xl">Let's plan your boxes</h1>
        <p className="mt-5 text-sm text-muted-foreground">
          WhatsApp is the fastest way to reach us — send the product name, quantity and your event
          date and we'll confirm price, customization and delivery.
        </p>
      </Reveal>

      <div className="mx-auto mt-12 grid max-w-4xl gap-6 md:grid-cols-2">
        {[
          { icon: Phone, label: "WhatsApp & Call", value: PHONE_DISPLAY, href: GENERAL_WA },
          { icon: Mail, label: "Email", value: EMAIL, href: `mailto:${EMAIL}` },
          { icon: Instagram, label: "Instagram", value: "@thebidhcraft", href: INSTAGRAM_URL },
          { icon: Clock, label: "Lead time", value: "Order 5+ days before your event", href: null },
        ].map(({ icon: Icon, label, value, href }, i) => (
          <Reveal key={label} delay={i * 80}>
            <div className="surface-card flex h-full items-start gap-4 p-6">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-secondary/70">
                <Icon size={18} />
              </span>
              <div>
                <p className="eyebrow">{label}</p>
                {href ? (
                  <a href={href} target="_blank" rel="noreferrer" className="mt-1 block font-display text-lg hover:text-primary">
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
          <h2 className="text-2xl">Bulk or corporate gifting?</h2>
          <p className="mt-3 text-sm text-muted-foreground">
            We've produced boxes for brands and creators across Pakistan. Share your quantity,
            branding and deadline and we'll quote it.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <a href={GENERAL_WA} target="_blank" rel="noreferrer" className="btn-salmon">
              Message us on WhatsApp
            </a>
            <Link to="/pre-order" className="btn-salmon">Start a pre-order</Link>
          </div>
        </div>
      </Reveal>
    </div>
  );
}
