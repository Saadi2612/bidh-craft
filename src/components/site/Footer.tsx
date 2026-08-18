import { Link } from "@tanstack/react-router";
import { Instagram, Mail, Phone } from "lucide-react";

import { useShell } from "@/lib/cms/context";

export function Footer() {
  const { settings, categories } = useShell();
  const telHref = `tel:+${settings.whatsappNumber}`;

  return (
    <footer className="mt-24 border-t border-border bg-card">
      <div className="container-x grid gap-10 py-14 md:grid-cols-4">
        <div>
          <p className="font-display text-xl tracking-[0.22em]">{settings.brandName}</p>
          <p className="mt-3 text-sm text-muted-foreground max-w-xs">{settings.tagline}</p>
        </div>

        <div>
          <p className="eyebrow">Quick Links</p>
          <ul className="mt-4 space-y-2 text-sm">
            <li>
              <Link to="/" className="hover:text-primary">
                Home
              </Link>
            </li>
            <li>
              <Link to="/shop" className="hover:text-primary">
                Shop
              </Link>
            </li>
            <li>
              <Link to="/about" className="hover:text-primary">
                About
              </Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-primary">
                Contact
              </Link>
            </li>
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
              <Phone size={15} />{" "}
              <a href={telHref} className="hover:text-primary">
                {settings.phoneDisplay}
              </a>
            </li>
            <li className="flex items-center gap-2">
              <Mail size={15} />{" "}
              <a href={`mailto:${settings.email}`} className="hover:text-primary">
                {settings.email}
              </a>
            </li>
            <li className="flex items-center gap-2">
              <Instagram size={15} />
              <a
                href={settings.instagramUrl}
                target="_blank"
                rel="noreferrer"
                className="hover:text-primary"
              >
                {settings.instagramHandle}
              </a>
            </li>
          </ul>
          {settings.footerNote && (
            <p className="mt-4 text-xs text-muted-foreground">{settings.footerNote}</p>
          )}
        </div>
      </div>

      <div className="border-t border-border py-5 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} {settings.brandName}. All rights reserved.
      </div>
    </footer>
  );
}
