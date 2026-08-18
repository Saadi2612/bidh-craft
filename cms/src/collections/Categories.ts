import type { CollectionConfig } from "payload";

import { contentAccess } from "../access";
import { orderField, seoField, slugField } from "../fields/slug";
import { revalidateSite } from "../hooks/revalidateSite";

export const Categories: CollectionConfig = {
  slug: "categories",
  labels: { singular: "Category", plural: "Categories" },
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "pricing", "order", "updatedAt"],
    group: "Catalog",
    description: "The collections shown in the header, footer and Shop by category grid.",
  },
  access: contentAccess,
  defaultSort: "order",
  hooks: {
    afterChange: [revalidateSite],
    afterDelete: [revalidateSite],
  },
  fields: [
    {
      name: "name",
      type: "text",
      required: true,
      admin: { description: 'Shown everywhere, e.g. "Tin Boxes".' },
    },
    slugField("name"),
    {
      name: "short",
      type: "text",
      required: true,
      maxLength: 120,
      admin: { description: "One-line subtitle under the name on category cards." },
    },
    {
      name: "intro",
      type: "textarea",
      required: true,
      admin: { description: "The opening paragraph on the category page." },
    },
    {
      name: "image",
      type: "upload",
      relationTo: "media",
      admin: {
        description:
          "Category cover photo, used on cards, rails and the category page. The site shows a plain cream panel until one is set.",
      },
    },
    {
      name: "pricing",
      type: "select",
      required: true,
      defaultValue: "boxRange",
      options: [
        { label: "Boxes — show the standard box price range", value: "boxRange" },
        { label: "Quoted — show \"Priced on WhatsApp as per quantity\"", value: "quote" },
      ],
      admin: {
        position: "sidebar",
        description: "Controls the price line on the category page header.",
      },
    },
    orderField,
    {
      name: "specs",
      type: "group",
      label: "Default product specs",
      admin: {
        description:
          "Shown on every product in this category unless the product overrides them.",
      },
      fields: [
        { name: "material", type: "text", required: true },
        { name: "size", type: "text", required: true },
        { name: "finish", type: "text", required: true },
        { name: "moq", type: "text", required: true, label: "Order quantity" },
      ],
    },
    seoField,
  ],
};
