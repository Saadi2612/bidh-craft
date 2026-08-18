import { createContext, useContext, type ReactNode } from "react";

import { fallbackContent } from "./fallback";
import type { SiteShell } from "./types";

/**
 * Site-wide content (contact details, categories, occasions) loaded once by the
 * root route. Everything below reads it from here instead of re-fetching.
 */
const ShellContext = createContext<SiteShell | null>(null);

export function SiteShellProvider({ value, children }: { value: SiteShell; children: ReactNode }) {
  return <ShellContext.Provider value={value}>{children}</ShellContext.Provider>;
}

export function useShell(): SiteShell {
  const shell = useContext(ShellContext);
  // Only reachable if a component renders outside the root route (e.g. an error
  // boundary above it) — bundled content keeps the header and footer usable.
  return (
    shell ?? {
      settings: fallbackContent.settings,
      categories: fallbackContent.categories,
      occasions: fallbackContent.occasions,
      isFallback: true,
    }
  );
}

export function useSettings() {
  return useShell().settings;
}
