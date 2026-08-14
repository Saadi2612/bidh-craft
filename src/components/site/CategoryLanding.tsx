import { Link } from "@tanstack/react-router";
import { ProductCard } from "@/components/site/ProductCard";
import { Reveal } from "@/components/site/Reveal";
import { categories, productsByCategory, type Category } from "@/lib/shop-data";
import { useUniqueProducts } from "@/lib/product-dedupe";

export function CategoryThumbRail() {
  return (
    <div className="-mx-5 overflow-x-auto px-5 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:mx-0 sm:px-0">
      <div className="flex w-max gap-3">
        {categories.map((c, i) => (
          <Link
            key={c.slug}
            to="/category/$slug"
            params={{ slug: c.slug }}
            className="surface-card group flex w-[9.5rem] shrink-0 flex-col overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-lift)]"
            style={{ animation: `reveal-up 0.6s cubic-bezier(0.22,1,0.36,1) ${i * 60}ms both` }}
          >
            <img
              src={c.image}
              alt={c.imageAlt}
              loading="lazy"
              width={400}
              height={300}
              className="aspect-[4/3] w-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <span className="px-3 py-2 text-[0.7rem] leading-snug">{c.name}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}

function CategorySection({ category, index }: { category: Category; index: number }) {
  const items = useUniqueProducts(`category-${category.slug}`, productsByCategory(category.slug), {
    limit: 4,
    allowFallback: true,
  });


  return (
    <Reveal delay={index * 60} className="pt-12 first:pt-0">
      <div className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-4 sm:flex sm:justify-between">
        <div className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-4 sm:flex">
          <Link
            to="/category/$slug"
            params={{ slug: category.slug }}
            className="shrink-0 overflow-hidden rounded-2xl"
            aria-label={category.name}
          >
            <img
              src={category.image}
              alt={category.imageAlt}
              loading="lazy"
              width={200}
              height={200}
              className="h-16 w-16 object-cover sm:h-20 sm:w-20"
            />
          </Link>
          <div className="min-w-0">
            <h3 className="truncate font-display text-xl sm:text-2xl">{category.name}</h3>
            <p className="mt-1 text-xs text-muted-foreground">{category.short}</p>
            <p className="mt-1 text-[0.68rem] text-muted-foreground">
              {productsByCategory(category.slug).length} designs · handmade to order
            </p>
          </div>
        </div>
        <Link
          to="/category/$slug"
          params={{ slug: category.slug }}
          className="col-span-2 text-sm underline hover:text-primary sm:col-auto sm:shrink-0"
        >
          See all →
        </Link>
      </div>

      <div className="-mx-5 mt-5 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-6 sm:overflow-visible sm:px-0 lg:grid-cols-4">
        {items.slice(0, 4).map((p, i) => (
          <div key={p.id} className="w-[78vw] shrink-0 snap-start sm:w-auto">
            <ProductCard product={p} delay={i * 90} />
          </div>
        ))}
      </div>
    </Reveal>
  );
}

export function CategoryLandingSections({ limit }: { limit?: number }) {
  const list = limit ? categories.slice(0, limit) : categories;
  return (
    <div className="divide-y divide-border">
      {list.map((c, i) => (
        <CategorySection key={c.slug} category={c} index={i} />
      ))}
    </div>
  );
}
