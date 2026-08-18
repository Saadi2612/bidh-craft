import { Clock, MessageCircle, Palette, Sparkles, Truck, type LucideProps } from "lucide-react";

/** Maps the icon names editors pick in the CMS to real components. */
const ICONS = {
  sparkles: Sparkles,
  message: MessageCircle,
  truck: Truck,
  palette: Palette,
  clock: Clock,
} as const;

export function Icon({ name, ...props }: { name: string } & LucideProps) {
  const Component = ICONS[name as keyof typeof ICONS] ?? Sparkles;
  return <Component {...props} />;
}
