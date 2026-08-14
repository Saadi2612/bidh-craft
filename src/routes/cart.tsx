import { createFileRoute, Link } from "@tanstack/react-router";
import { ORDER_WA } from "@/lib/shop-data";

export const Route = createFileRoute("/cart")({
  head: () => ({
    meta: [
      { title: "Cart — Coming Soon | THEBIDHCRAFT" },
      { name: "description", content: "Online cart is coming soon to THEBIDHCRAFT. For now, order your handmade boxes on WhatsApp." },
      { property: "og:title", content: "Cart — Coming Soon | THEBIDHCRAFT" },
      { property: "og:description", content: "Online cart coming soon — order via WhatsApp for now." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/cart" },
      { name: "robots", content: "noindex" },
    ],
    links: [{ rel: "canonical", href: "/cart" }],
  }),
  component: () => (
    <div className="container-x flex min-h-[60vh] items-center justify-center py-20 text-center">
      <div className="surface-card max-w-md p-10">
        <p className="eyebrow">Cart</p>
        <h1 className="mt-3 text-3xl">Online checkout coming soon</h1>
        <p className="mt-4 text-sm text-muted-foreground">
          We're still taking every order personally on WhatsApp so we can confirm customization,
          quantity and delivery with you.
        </p>
        <a href={ORDER_WA} target="_blank" rel="noreferrer" className="btn-salmon mt-6">
          Order on WhatsApp
        </a>
        <Link to="/shop" className="btn-outline-rose mt-3 w-full">Back to shop</Link>
      </div>
    </div>
  ),
});
