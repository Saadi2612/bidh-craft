import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, X, Search, Instagram, ChevronDown } from "lucide-react";

import { useShell } from "@/lib/cms/context";
import { orderWaLink } from "@/lib/cms/derive";
import { imageAlt, imageUrl } from "@/lib/cms/image";

export function Header() {
  const [open, setOpen] = useState(false);
  const { settings, categories, occasions } = useShell();
  const orderWa = orderWaLink(settings);

  return (
    <header className="sticky top-0 z-40">
      {settings.announcementBar && (
        <div className="bg-cocoa text-cream text-center text-[0.72rem] tracking-[0.14em] py-2 px-4">
          {settings.announcementBar}
        </div>
      )}

      <div className="backdrop-blur-md bg-card/90 border-b border-border">
        <div className="container-x flex items-center justify-between gap-4 h-[72px]">
          <Link to="/" className="flex items-center gap-3">
            {settings.logo ? (
              <img
                src={imageUrl(settings.logo, { width: 80, height: 80 })}
                alt={imageAlt(settings.logo, `${settings.brandName} logo`)}
                width={40}
                height={40}
                className="h-10 w-10 rounded-full object-cover"
              />
            ) : (
              <span
                data-image-placeholder="logo"
                className="grid place-items-center h-10 w-10 rounded-full bg-secondary font-display text-lg"
                aria-hidden="true"
              >
                {settings.brandName.charAt(0)}
              </span>
            )}
            <span className="font-display text-xl sm:text-2xl tracking-[0.22em]">
              {settings.brandName}
            </span>
          </Link>

          <nav className="hidden lg:flex items-center gap-7 text-sm">
            <Link to="/" className="hover:text-primary transition-colors">
              Home
            </Link>
            <Link to="/shop" className="hover:text-primary transition-colors">
              Shop
            </Link>

            <Dropdown label="Categories">
              {categories.map((c) => (
                <Link
                  key={c.slug}
                  to="/category/$slug"
                  params={{ slug: c.slug }}
                  className="block rounded-xl px-3 py-2 hover:bg-secondary/60 transition-colors"
                >
                  {c.name}
                </Link>
              ))}
            </Dropdown>

            <Dropdown label="Occasions">
              {occasions.map((o) => (
                <Link
                  key={o.slug}
                  to="/shop"
                  search={{ occasion: o.slug }}
                  className="block rounded-xl px-3 py-2 hover:bg-secondary/60 transition-colors"
                >
                  {o.name}
                  <span className="block text-[0.68rem] text-muted-foreground">{o.note}</span>
                </Link>
              ))}
            </Dropdown>

            <Link to="/pre-order" className="hover:text-primary transition-colors">
              Pre-Order
            </Link>
            <Link to="/about" className="hover:text-primary transition-colors">
              About
            </Link>
            <Link to="/contact" className="hover:text-primary transition-colors">
              Contact
            </Link>
          </nav>

          <div className="flex items-center gap-2">
            <Link
              to="/shop"
              aria-label="Search products"
              className="hidden sm:grid place-items-center h-10 w-10 rounded-full hover:bg-secondary/60 transition-colors"
            >
              <Search size={18} />
            </Link>
            <a
              href={settings.instagramUrl}
              target="_blank"
              rel="noreferrer"
              aria-label={`${settings.brandName} on Instagram`}
              className="hidden sm:grid place-items-center h-10 w-10 rounded-full hover:bg-secondary/60 transition-colors"
            >
              <Instagram size={18} />
            </a>
            <a
              href={orderWa}
              target="_blank"
              rel="noreferrer"
              className="btn-salmon text-sm hidden sm:inline-flex"
            >
              Order on WhatsApp
            </a>
            <button
              onClick={() => setOpen((v) => !v)}
              aria-label="Toggle menu"
              className="lg:hidden grid place-items-center h-10 w-10 rounded-full hover:bg-secondary/60"
            >
              {open ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {open && (
          <div className="lg:hidden border-t border-border bg-card px-5 py-4 space-y-1 text-sm">
            {[
              { to: "/", label: "Home" },
              { to: "/shop", label: "Shop" },
              { to: "/pre-order", label: "Pre-Order" },
              { to: "/about", label: "About" },
              { to: "/contact", label: "Contact" },
            ].map((l) => (
              <Link key={l.to} to={l.to} onClick={() => setOpen(false)} className="block py-2">
                {l.label}
              </Link>
            ))}
            <p className="eyebrow pt-3">Categories</p>
            {categories.map((c) => (
              <Link
                key={c.slug}
                to="/category/$slug"
                params={{ slug: c.slug }}
                onClick={() => setOpen(false)}
                className="block py-2"
              >
                {c.name}
              </Link>
            ))}
            <p className="eyebrow pt-3">Occasions</p>
            <div className="flex flex-wrap gap-2 pt-1">
              {occasions.map((o) => (
                <Link
                  key={o.slug}
                  to="/shop"
                  search={{ occasion: o.slug }}
                  onClick={() => setOpen(false)}
                  className="rounded-full bg-secondary/60 px-3 py-1"
                >
                  {o.name}
                </Link>
              ))}
            </div>
            <a href={orderWa} target="_blank" rel="noreferrer" className="btn-salmon mt-4 w-full">
              Order on WhatsApp
            </a>
          </div>
        )}
      </div>
    </header>
  );
}

function Dropdown({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="relative group">
      <button className="inline-flex items-center gap-1 hover:text-primary transition-colors">
        {label}
        <ChevronDown size={14} />
      </button>
      <div className="invisible opacity-0 translate-y-1 group-hover:visible group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200 absolute left-1/2 -translate-x-1/2 top-full pt-3 w-64">
        <div className="surface-card p-2">{children}</div>
      </div>
    </div>
  );
}
