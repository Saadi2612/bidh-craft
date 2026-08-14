import { Link } from "@tanstack/react-router";
import { Instagram, Mail, Phone } from "lucide-react";
import { categories, EMAIL, INSTAGRAM_URL, PHONE_DISPLAY } from "@/lib/shop-data";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-border bg-card">
      <div className="container-x grid gap-10 py-14 md:grid-cols-4">
        <div>
          <p className="font-display text-xl tracking-[0.22em]">THEBIDHCRAFT</p>
          <p className="mt-3 text-sm text-muted-foreground max-w-xs">
            Handcrafted boxes for every happy moment — 100% handmade &amp; hand-printed in Pakistan.
          </p>
        </div>

        <div>
          <p className="eyebrow">Quick Links</p>
          <ul className="mt-4 space-y-2 text-sm">
            <li><Link to="/" className="hover:text-primary">Home</Link></li>
            <li><Link to="/shop" className="hover:text-primary">Shop</Link></li>
            <li><Link to="/about" className="hover:text-primary">About</Link></li>
            <li><Link to="/contact" className="hover:text-primary">Contact</Link></li>
          </ul>
        </div>

        <div>
          <p className="eyebrow">Categories</p>
          <ul className="mt-4 space-y-2 text-sm">
            {categories.map((c) => (
              <li key={c.slug}>
                <Link to="/category/$slug" params={{ slug: c.slug }} className="hover:text-primary">
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="eyebrow">Contact</p>
          <ul className="mt-4 space-y-3 text-sm">
            <li className="flex items-center gap-2">
              <Phone size={15} /> <a href="tel:+923079701492" className="hover:text-primary">{PHONE_DISPLAY}</a>
            </li>
            <li className="flex items-center gap-2">
              <Mail size={15} /> <a href={`mailto:${EMAIL}`} className="hover:text-primary">{EMAIL}</a>
            </li>
            <li className="flex items-center gap-2">
              <Instagram size={15} />
              <a href={INSTAGRAM_URL} target="_blank" rel="noreferrer" className="hover:text-primary">
                @thebidhcraft
              </a>
            </li>
          </ul>
          <p className="mt-4 text-xs text-muted-foreground">
            Orders currently processed via WhatsApp — online checkout coming soon.
          </p>
        </div>
      </div>

      <div className="border-t border-border py-5 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} THEBIDHCRAFT. All rights reserved.
      </div>
    </footer>
  );
}
