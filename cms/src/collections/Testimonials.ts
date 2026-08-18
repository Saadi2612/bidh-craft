import type { CollectionConfig } from "payload";

import { contentAccess } from "../access";
import { orderField } from "../fields/slug";
import { revalidateSite } from "../hooks/revalidateSite";

export const Testimonials: CollectionConfig = {
  slug: "testimonials",
  admin: {
    useAsTitle: "authorName",
    defaultColumns: ["authorName", "context", "rating", "order"],
    group: "Content",
    description: "The \"Kind words\" cards at the bottom of the homepage.",
  },
  access: contentAccess,
  defaultSort: "order",
  hooks: {
    afterChange: [revalidateSite],
    afterDelete: [revalidateSite],
  },
  fields: [
    { name: "quote", type: "textarea", required: true, maxLength: 320 },
    { name: "authorName", type: "text", required: true, label: "Customer name" },
    {
      name: "context",
      type: "text",
      required: true,
      admin: { description: 'Shown after the name, e.g. "Walima order".' },
    },
    {
      name: "rating",
      type: "number",
      min: 1,
      max: 5,
      defaultValue: 5,
      admin: { position: "sidebar" },
    },
    orderField,
  ],
};
