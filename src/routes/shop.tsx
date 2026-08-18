import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";

import { ProductCard } from "@/components/site/ProductCard";
import { Reveal } from "@/components/site/Reveal";
import { useShell } from "@/lib/cms/context";
import { fetchShopPage } from "@/lib/cms/queries";

type ShopSearch = { category?: string | undefined; occasion?: string | undefined };

export const Route = createFileRoute("/shop")({
  validateSearch: (search: Record<string, unknown>): ShopSearch => {
    const category = typeof search["category"] === "string" ? search["category"] : undefined;
    const occasion = typeof search["occasion"] === "string" ? search["occasion"] : undefined;
    return {
      ...(category ? { category } : {}),
      ...(occasion ? { occasion } : {}),
    };
  },
  loader: () => fetchShopPage(),
  head: ({ loaderData }) => {
    const seo = loaderData?.shop.seo;
    const title = seo?.title ?? "Shop Handmade Gift & Favor Boxes — THEBIDHCRAFT";
    const description =
      seo?.description ??
      "Browse every handmade box: bid boxes, favor boxes, tin boxes, sweet boxes and baby announcement boxes. Filter by category, occasion and price.";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "website" },
        { property: "og:url", content: "/shop" },
      ],
      links: [{ rel: "canonical", href: "/shop" }],
    };
  },
  component: Shop,
});

function Shop() {
  const { shop, products } = Route.useLoaderData();
  const { categories, occasions } = useShell();
  const search = Route.useSearch();
  const navigate = Route.useNavigate();
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<"featured" | "low" | "high">("featured");

  const list = useMemo(() => {
    let out = products.filter((p) => {
      if (search.category && p.category !== search.category) return false;
      if (search.occasion && !p.occasions.includes(search.occasion)) return false;
      if (query && !p.name.toLowerCase().includes(query.toLowerCase())) return false;
      return true;
    });
    if (sort === "low")
      out = [...out].sort((a, b) => (a.price ?? Infinity) - (b.price ?? Infinity));
    if (sort === "high")
      out = [...out].sort((a, b) => (b.price ?? -Infinity) - (a.price ?? -Infinity));
    if (sort === "featured") out = [...out].sort((a, b) => Number(b.featured) - Number(a.featured));
    return out;
  }, [products, search.category, search.occasion, query, sort]);

  const set = (patch: ShopSearch) =>
    navigate({ search: (prev: ShopSearch) => ({ ...prev, ...patch }) });

  return (
    <div className="container-x py-14">
      <Reveal className="text-center">
        <p className="eyebrow">{shop.eyebrow}</p>
        <h1 className="mt-3 text-4xl sm:text-5xl">{shop.title}</h1>
        <p className="mx-auto mt-4 max-w-xl text-sm text-muted-foreground">{shop.intro}</p>
      </Reveal>

      <div className="surface-card mt-10 flex flex-wrap items-center gap-3 p-4">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search boxes…"
          aria-label="Search boxes"
          className="min-w-[180px] flex-1 rounded-full border border-border bg-background px-4 py-2 text-sm outline-none focus:border-primary"
        />
        <select
          aria-label="Filter by category"
          value={search.category ?? ""}
          onChange={(e) => set({ category: e.target.value || undefined })}
          className="rounded-full border border-border bg-background px-4 py-2 text-sm"
        >
          <option value="">All categories</option>
          {categories.map((c) => (
            <option key={c.slug} value={c.slug}>
              {c.name}
            </option>
          ))}
        </select>
        <select
          aria-label="Filter by occasion"
          value={search.occasion ?? ""}
          onChange={(e) => set({ occasion: e.target.value || undefined })}
          className="rounded-full border border-border bg-background px-4 py-2 text-sm"
        >
          <option value="">All occasions</option>
          {occasions.map((o) => (
            <option key={o.slug} value={o.slug}>
              {o.name}
            </option>
          ))}
        </select>
        <select
          aria-label="Sort products"
          value={sort}
          onChange={(e) => setSort(e.target.value as typeof sort)}
          className="rounded-full border border-border bg-background px-4 py-2 text-sm"
        >
          <option value="featured">Best sellers first</option>
          <option value="low">Price: low to high</option>
          <option value="high">Price: high to low</option>
        </select>
      </div>

      <p className="mt-5 text-xs text-muted-foreground">{list.length} boxes</p>

      <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {list.map((p, i) => (
          <ProductCard key={p.id} product={p} delay={Math.min(i, 8) * 60} />
        ))}
      </div>

      {list.length === 0 && (
        <p className="py-16 text-center text-sm text-muted-foreground">{shop.emptyMessage}</p>
      )}
    </div>
  );
}
