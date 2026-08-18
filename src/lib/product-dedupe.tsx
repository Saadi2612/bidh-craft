import { createContext, useContext, useMemo, useRef, type ReactNode } from "react";
import type { ProductCardData } from "@/lib/cms/types";

/**
 * Page-level "no-duplicate" product placement.
 *
 * Sections claim products in render order (top of the page wins). A product
 * that has already been claimed by an earlier section is skipped by later
 * sections, so the same design never appears twice on one page — while each
 * section still fills up with the next-best variety from its own candidates.
 */
type Registry = {
  claimed: Set<string>;
  /** sectionKey -> already resolved ids, so re-renders stay stable */
  bySection: Map<string, string[]>;
};

const DedupeContext = createContext<Registry | null>(null);

export function ProductDedupeProvider({ children }: { children: ReactNode }) {
  const registry = useRef<Registry>({ claimed: new Set(), bySection: new Map() });
  return <DedupeContext.Provider value={registry.current}>{children}</DedupeContext.Provider>;
}

function resolve(
  registry: Registry | null,
  sectionKey: string,
  candidates: ProductCardData[],
  limit?: number,
  allowFallback = false,
): ProductCardData[] {
  const max = limit ?? candidates.length;
  if (!registry) return candidates.slice(0, max);

  const cached = registry.bySection.get(sectionKey);
  if (cached) {
    const byId = new Map(candidates.map((p) => [p.id, p]));
    const hit = cached.map((id) => byId.get(id)).filter(Boolean) as ProductCardData[];
    if (hit.length === cached.length) return hit;
  }

  const picked: ProductCardData[] = [];
  for (const p of candidates) {
    if (picked.length >= max) break;
    if (registry.claimed.has(p.id)) continue;
    picked.push(p);
  }

  // Never let a section render empty just because everything was claimed above.
  if (picked.length === 0 && allowFallback) picked.push(...candidates.slice(0, max));

  for (const p of picked) registry.claimed.add(p.id);
  registry.bySection.set(
    sectionKey,
    picked.map((p) => p.id),
  );
  return picked;
}

/**
 * Returns products from `candidates` that no earlier section on this page has
 * already shown. Sections without a provider simply get the raw list.
 */
export function useUniqueProducts(
  sectionKey: string,
  candidates: ProductCardData[],
  options: { limit?: number; allowFallback?: boolean } = {},
): ProductCardData[] {
  const registry = useContext(DedupeContext);
  const { limit, allowFallback } = options;
  const ids = candidates.map((p) => p.id).join(",");
  return useMemo(
    () => resolve(registry, sectionKey, candidates, limit, allowFallback),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [registry, sectionKey, ids, limit, allowFallback],
  );
}
