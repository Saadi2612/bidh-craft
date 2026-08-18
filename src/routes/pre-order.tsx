import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { Clock, MessageCircle } from "lucide-react";

import { Reveal } from "@/components/site/Reveal";
import { useShell } from "@/lib/cms/context";
import {
  earliestDeliveryDate,
  fillTemplate,
  preOrderWaLink,
  toDateInputValue,
} from "@/lib/cms/derive";
import { fetchPreOrderPage } from "@/lib/cms/queries";

export const Route = createFileRoute("/pre-order")({
  loader: () => fetchPreOrderPage(),
  head: ({ loaderData }) => {
    const seo = loaderData?.preOrder.seo;
    const title = seo?.title ?? "Pre-Order on WhatsApp — THEBIDHCRAFT";
    const description =
      seo?.description ??
      "Pre-order handmade bid boxes, favor boxes and wedding signs. Tell us your occasion, quantity and delivery date.";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "website" },
        { property: "og:url", content: "/pre-order" },
      ],
      links: [{ rel: "canonical", href: "/pre-order" }],
    };
  },
  component: PreOrderPage,
});

const schema = z.object({
  name: z.string().trim().min(2, "Please enter your name").max(80, "Name is too long"),
  occasion: z.string().trim().min(1, "Choose an occasion"),
  product: z.string().trim().max(120).optional(),
  quantity: z
    .number({ invalid_type_error: "Enter a quantity" })
    .int("Whole numbers only")
    .min(1, "Minimum 1 piece")
    .max(5000, "For 5000+ pieces, message us directly"),
  deliveryDate: z.string().min(1, "Pick a delivery date"),
  city: z.string().trim().max(60).optional(),
  notes: z.string().trim().max(500, "Keep notes under 500 characters").optional(),
});

type Errors = Partial<Record<keyof z.infer<typeof schema>, string>>;

function PreOrderPage() {
  const { preOrder, productNames } = Route.useLoaderData();
  const { settings, occasions } = useShell();
  const leadTime = settings.leadTimeDays;

  const minDate = useMemo(() => toDateInputValue(earliestDeliveryDate(leadTime)), [leadTime]);
  const [form, setForm] = useState({
    name: "",
    occasion: "",
    product: "",
    quantity: "50",
    deliveryDate: "",
    city: "",
    notes: "",
  });
  const [errors, setErrors] = useState<Errors>({});

  const set =
    (k: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [k]: e.target.value }));

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = schema.safeParse({
      ...form,
      quantity: Number(form.quantity),
      product: form.product || undefined,
      city: form.city || undefined,
      notes: form.notes || undefined,
    });
    if (!parsed.success) {
      const next: Errors = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as keyof Errors;
        if (!next[key]) next[key] = issue.message;
      }
      setErrors(next);
      return;
    }
    if (parsed.data.deliveryDate < minDate) {
      setErrors({ deliveryDate: `We need ${leadTime} days — earliest is ${minDate}` });
      return;
    }
    setErrors({});
    const d = parsed.data;
    window.open(
      preOrderWaLink(settings, {
        name: d.name,
        occasion: d.occasion,
        quantity: d.quantity,
        deliveryDate: d.deliveryDate,
        ...(d.product ? { product: d.product } : {}),
        ...(d.city ? { city: d.city } : {}),
        ...(d.notes ? { notes: d.notes } : {}),
      }),
      "_blank",
      "noopener,noreferrer",
    );
  }

  const field =
    "mt-2 w-full rounded-xl border border-border bg-card px-4 py-3 text-sm outline-none focus:border-primary transition-colors";

  return (
    <div className="container-x py-14">
      <Reveal className="mx-auto max-w-2xl text-center">
        <p className="eyebrow">{preOrder.eyebrow}</p>
        <h1 className="mt-3 text-4xl sm:text-5xl">{preOrder.title}</h1>
        <p className="mt-5 text-sm text-muted-foreground">
          {fillTemplate(preOrder.intro, { leadTime })}
        </p>
      </Reveal>

      <Reveal className="mx-auto mt-10 max-w-2xl">
        <div className="surface-card flex items-center gap-3 p-4 text-sm">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-secondary/70">
            <Clock size={17} />
          </span>
          <p className="text-muted-foreground">
            Earliest delivery date we can accept right now is{" "}
            <span className="font-medium text-foreground">{minDate}</span>.
          </p>
        </div>
      </Reveal>

      <Reveal className="mx-auto mt-6 max-w-2xl">
        <form onSubmit={onSubmit} noValidate className="surface-card space-y-5 p-6 sm:p-8">
          <div>
            <label htmlFor="name" className="eyebrow">
              Your name
            </label>
            <input
              id="name"
              value={form.name}
              onChange={set("name")}
              maxLength={80}
              placeholder="e.g. Ayesha Khan"
              className={field}
            />
            {errors.name && <p className="mt-1 text-xs text-destructive">{errors.name}</p>}
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="occasion" className="eyebrow">
                Occasion
              </label>
              <select
                id="occasion"
                value={form.occasion}
                onChange={set("occasion")}
                className={field}
              >
                <option value="">Select an occasion</option>
                {occasions.map((o) => (
                  <option key={o.slug} value={o.name}>
                    {o.name}
                  </option>
                ))}
                {preOrder.extraOccasionOptions.map((label) => (
                  <option key={label} value={label}>
                    {label}
                  </option>
                ))}
              </select>
              {errors.occasion && (
                <p className="mt-1 text-xs text-destructive">{errors.occasion}</p>
              )}
            </div>

            <div>
              <label htmlFor="quantity" className="eyebrow">
                Quantity
              </label>
              <input
                id="quantity"
                type="number"
                min={1}
                max={5000}
                value={form.quantity}
                onChange={set("quantity")}
                className={field}
              />
              {errors.quantity && (
                <p className="mt-1 text-xs text-destructive">{errors.quantity}</p>
              )}
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="deliveryDate" className="eyebrow">
                Delivery date
              </label>
              <input
                id="deliveryDate"
                type="date"
                min={minDate}
                value={form.deliveryDate}
                onChange={set("deliveryDate")}
                className={field}
              />
              {errors.deliveryDate && (
                <p className="mt-1 text-xs text-destructive">{errors.deliveryDate}</p>
              )}
            </div>
            <div>
              <label htmlFor="city" className="eyebrow">
                City (optional)
              </label>
              <input
                id="city"
                value={form.city}
                onChange={set("city")}
                maxLength={60}
                placeholder="e.g. Karachi"
                className={field}
              />
            </div>
          </div>

          <div>
            <label htmlFor="product" className="eyebrow">
              Product or style (optional)
            </label>
            <input
              id="product"
              list="preorder-products"
              value={form.product}
              onChange={set("product")}
              maxLength={120}
              placeholder="Start typing a product name"
              className={field}
            />
            <datalist id="preorder-products">
              {productNames.map((name) => (
                <option key={name} value={name} />
              ))}
            </datalist>
          </div>

          <div>
            <label htmlFor="notes" className="eyebrow">
              Notes (optional)
            </label>
            <textarea
              id="notes"
              value={form.notes}
              onChange={set("notes")}
              maxLength={500}
              rows={4}
              placeholder="Colours, names to print, ribbon shade, budget…"
              className={field}
            />
            {errors.notes && <p className="mt-1 text-xs text-destructive">{errors.notes}</p>}
          </div>

          <button type="submit" className="btn-salmon w-full">
            <MessageCircle size={17} className="mr-2" />
            {preOrder.submitLabel}
          </button>
          <p className="text-center text-xs text-muted-foreground">{preOrder.footnote}</p>
        </form>
      </Reveal>
    </div>
  );
}
