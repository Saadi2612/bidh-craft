import { useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  categoryName,
  productImage,
  productWaLink,
  type Product,
} from "@/lib/shop-data";

export function ProductCard({ product, delay = 0 }: { product: Product; delay?: number }) {
  const [qty, setQty] = useState(1);

  return (
    <article
      className="surface-card group overflow-hidden flex flex-col transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[var(--shadow-lift)]"
      style={{ animation: `reveal-up 0.6s cubic-bezier(0.22,1,0.36,1) ${delay}ms both` }}
    >
      <div className="relative overflow-hidden">
        <Link to="/product/$id" params={{ id: product.id }} aria-label={`View ${product.name}`}>
        <img
          data-image-placeholder={product.id}
          src={productImage(product)}
          alt={`Handmade ${product.name.toLowerCase()} by THEBIDHCRAFT`}
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
          {categoryName(product.category)}
        </Link>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <div>
          <h3 className="font-display text-lg leading-tight">
            <Link to="/product/$id" params={{ id: product.id }} className="hover:text-primary">
              {product.name}
            </Link>
          </h3>
          <p className="mt-1 text-xs text-muted-foreground">{product.blurb}</p>
        </div>

        {typeof product.price === "number" ? (
          <p className="font-display text-xl">Rs. {product.price}<span className="text-xs font-sans text-muted-foreground"> / {product.unit ?? "box"}</span></p>
        ) : (
          <p className="font-display text-base leading-tight">Price on WhatsApp<span className="block text-xs font-sans text-muted-foreground">Quoted as per quantity</span></p>
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
            <span className="w-8 text-center text-sm" aria-live="polite">{qty}</span>
            <button
              onClick={() => setQty((q) => q + 1)}
              aria-label={`Increase quantity for ${product.name}`}
              className="h-9 w-9 rounded-full hover:bg-secondary/60"
            >
              +
            </button>
          </div>
          <a
            href={productWaLink(product.name, qty)}
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
