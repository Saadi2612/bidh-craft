import { createFileRoute, Link } from "@tanstack/react-router";

import { useShell } from "@/lib/cms/context";
import { orderWaLink } from "@/lib/cms/derive";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "Checkout — Coming Soon | THEBIDHCRAFT" },
      {
        name: "description",
        content:
          "Online checkout is coming soon to THEBIDHCRAFT. Order your handmade boxes on WhatsApp in the meantime.",
      },
      { property: "og:title", content: "Checkout — Coming Soon | THEBIDHCRAFT" },
      {
        property: "og:description",
        content: "Online checkout coming soon — order via WhatsApp for now.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/checkout" },
      { name: "robots", content: "noindex" },
    ],
    links: [{ rel: "canonical", href: "/checkout" }],
  }),
  component: ComingSoon,
});

function ComingSoon() {
  const { settings } = useShell();

  return (
    <div className="container-x flex min-h-[60vh] items-center justify-center py-20 text-center">
      <div className="surface-card max-w-md p-10">
        <p className="eyebrow">Checkout</p>
        <h1 className="mt-3 text-3xl">Online payments are on the way</h1>
        <p className="mt-4 text-sm text-muted-foreground">
          Until then, send us your order on WhatsApp — we'll confirm the total, customization and
          delivery date right away.
        </p>
        <a
          href={orderWaLink(settings)}
          target="_blank"
          rel="noreferrer"
          className="btn-salmon mt-6"
        >
          Order on WhatsApp
        </a>
        <Link to="/shop" className="btn-outline-rose mt-3 w-full">
          Back to shop
        </Link>
      </div>
    </div>
  );
}
