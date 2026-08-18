import type { CollectionConfig } from "payload";

import { contentAccess } from "../access";
import { orderField, slugField } from "../fields/slug";
import { revalidateSite } from "../hooks/revalidateSite";

export const Occasions: CollectionConfig = {
  slug: "occasions",
  labels: { singular: "Occasion", plural: "Occasions" },
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "note", "order"],
    group: "Catalog",
    description: "Nikkah, Walima, Mehndi and friends — used for the shop filter and menus.",
  },
  access: contentAccess,
  defaultSort: "order",
  hooks: {
    afterChange: [revalidateSite],
    afterDelete: [revalidateSite],
  },
  fields: [
    { name: "name", type: "text", required: true },
    slugField("name"),
    {
      name: "note",
      type: "text",
      required: true,
      maxLength: 80,
      admin: { description: 'Short explainer, e.g. "The marriage ceremony".' },
    },
    {
      name: "emoji",
      type: "text",
      required: true,
      maxLength: 8,
      admin: { description: "Single emoji shown in the occasion circle." },
    },
    orderField,
  ],
};
