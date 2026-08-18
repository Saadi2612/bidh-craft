import type { Field } from "payload";

export function slugify(input: string): string {
  return input
    .normalize("NFKD")
    .toLowerCase()
    .replace(/[^\w\s-]+/g, "")
    .trim()
    .replace(/[\s_]+/g, "-")
    .replace(/-{2,}/g, "-")
    .replace(/^-|-$/g, "");
}

/**
 * URL segment for a document. Auto-filled from `sourceField` when left blank,
 * then frozen — editing a slug after publish would break existing links and
 * any WhatsApp message a customer already has.
 */
export function slugField(sourceField = "name", overrides: Partial<Field> = {}): Field {
  return {
    name: "slug",
    type: "text",
    required: true,
    unique: true,
    index: true,
    admin: {
      position: "sidebar",
      description:
        "Used in the page URL. Filled in automatically from the name — only change it before the page is shared anywhere.",
    },
    hooks: {
      beforeValidate: [
        ({ value, data }) => {
          if (typeof value === "string" && value.trim()) return slugify(value);
          const source = (data as Record<string, unknown> | undefined)?.[sourceField];
          return typeof source === "string" ? slugify(source) : value;
        },
      ],
    },
    ...overrides,
  } as Field;
}

/** Manual ordering knob used by every list the site renders in a fixed order. */
export const orderField: Field = {
  name: "order",
  type: "number",
  defaultValue: 0,
  admin: {
    position: "sidebar",
    description: "Lower numbers appear first on the site.",
  },
};

/** Per-document SEO overrides; the site falls back to sensible defaults. */
export const seoField: Field = {
  name: "seo",
  type: "group",
  label: "SEO",
  admin: { description: "Leave blank to use the automatic title and description." },
  fields: [
    { name: "metaTitle", type: "text" },
    { name: "metaDescription", type: "textarea", maxLength: 200 },
  ],
};
