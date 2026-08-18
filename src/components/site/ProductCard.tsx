import { useState } from "react";
import { Link } from "@tanstack/react-router";

import { useShell } from "@/lib/cms/context";
import { findCategory, productImage, productWaLink } from "@/lib/cms/derive";
import { imageAlt, imageSrcSet, imageUrl } from "@/lib/cms/image";
import type { ProductCardData } from "@/lib/cms/types";

const CARD_WIDTHS = [400, 600, 900];

export function ProductCard({ product, delay = 0 }: { product: ProductCardData; delay?: number }) {
  const [qty, setQty] = useState(1);
  const { settings, categories } = useShell();

  const category = findCategory(categories, product.category);
  const image = productImage(product, category);
  const categoryLabel = product.categoryName ?? category?.name ?? "Boxes";
  const alt = imageAlt(image, `Handmade ${product.name.toLowerCase()} by ${settings.brandName}`);

  return (
    <article
      className="surface-card group overflow-hidden flex flex-col transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[var(--shadow-lift)]"
      style={{ animation: `reveal-up 0.6s cubic-bezier(0.22,1,0.36,1) ${delay}ms both` }}
    >
      <div className="relative overflow-hidden">
        <Link to="/product/$id" params={{ id: product.slug }} aria-label={`View ${product.name}`}>
          <img
            data-image-placeholder={product.slug}
            src={imageUrl(image, { width: 600, height: 600 })}
            srcSet={imageSrcSet(image, CARD_WIDTHS)}
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 78vw"
            alt={alt}
            loading="lazy"
            width={900}
            height={900}
            className="aspect-square w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        </Link>

        <Link
          to="/category/$slug"
          params={{ slug: product.category }}
          className="absolute left-3 top-3 rounded-full bg-card/90 px-3 py-1 text-[0.65rem] tracking-wide"
        >
          {categoryLabel}
        </Link>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <div>
          <h3 className="font-display text-lg leading-tight">
            <Link to="/product/$id" params={{ id: product.slug }} className="hover:text-primary">
              {product.name}
            </Link>
          </h3>
          <p className="mt-1 text-xs text-muted-foreground">{product.blurb}</p>
        </div>

        {typeof product.price === "number" ? (
          <p className="font-display text-xl">
            Rs. {product.price}
            <span className="text-xs font-sans text-muted-foreground"> / {product.unit}</span>
          </p>
        ) : (
          <p className="font-display text-base leading-tight">
            Price on WhatsApp
            <span className="block text-xs font-sans text-muted-foreground">
              {settings.quoteNote}
            </span>
          </p>
        )}

        <div className="mt-auto flex items-center gap-3">
          <div className="flex items-center rounded-full border border-border">
            <button
              onClick={() => setQty((q) => Math.max(1, q - 1))}
              aria-label={`Decrease quantity for ${product.name}`}
              className="h-9 w-9 rounded-full hover:bg-secondary/60"
            >
              −
            </button>
            <span className="w-8 text-center text-sm" aria-live="polite">
              {qty}
            </span>
            <button
              onClick={() => setQty((q) => q + 1)}
              aria-label={`Increase quantity for ${product.name}`}
              className="h-9 w-9 rounded-full hover:bg-secondary/60"
            >
              +
            </button>
          </div>
          <a
            href={productWaLink(settings, product.name, qty)}
            target="_blank"
            rel="noreferrer"
            className="btn-salmon flex-1 text-sm px-3"
          >
            Order on WhatsApp
          </a>
        </div>
      </div>
    </article>
  );
}
