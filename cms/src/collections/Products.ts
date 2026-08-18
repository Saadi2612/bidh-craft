import type { CollectionConfig } from "payload";

import { contentAccess } from "../access";
import { orderField, seoField, slugField } from "../fields/slug";
import { revalidateSite } from "../hooks/revalidateSite";

export const Products: CollectionConfig = {
  slug: "products",
  labels: { singular: "Product", plural: "Products" },
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "category", "price", "featured", "_status", "updatedAt"],
    group: "Catalog",
    description: "Everything that appears as a product card on the site.",
    preview: (doc) => {
      const base = process.env.SITE_URL;
      return base && doc["slug"] ? `${base}/product/${String(doc["slug"])}` : null;
    },
  },
  access: {
    ...contentAccess,
    // Drafts stay invisible to the public API; only staff can read them.
    read: ({ req }) => {
      if (req.user) return true;
      return { _status: { equals: "published" } };
    },
  },
  versions: {
    drafts: {
      autosave: { interval: 800 },
    },
    maxPerDoc: 20,
  },
  defaultSort: "order",
  hooks: {
    afterChange: [revalidateSite],
    afterDelete: [revalidateSite],
  },
  fields: [
    {
      type: "tabs",
      tabs: [
        {
          label: "Product",
          fields: [
            { name: "name", type: "text", required: true },
            {
              name: "blurb",
              type: "textarea",
              required: true,
              maxLength: 240,
              admin: {
                description:
                  "The one-line description under the name on the product card. Keep it short.",
              },
            },
            {
              name: "category",
              type: "relationship",
              relationTo: "categories",
              required: true,
              admin: { description: "Which collection this belongs to." },
            },
            {
              name: "occasions",
              type: "relationship",
              relationTo: "occasions",
              hasMany: true,
              required: true,
              admin: { description: "Drives the Shop page occasion filter." },
            },
            {
              name: "description",
              type: "textarea",
              admin: {
                description:
                  "Optional longer paragraph on the product page. Leave blank to use the blurb.",
              },
            },
          ],
        },
        {
          label: "Photos",
          fields: [
            {
              name: "image",
              type: "upload",
              relationTo: "media",
              admin: {
                description:
                  "Main photo. If left empty the category cover photo is used instead.",
              },
            },
            {
              name: "gallery",
              type: "array",
              labels: { singular: "Photo", plural: "Photos" },
              maxRows: 8,
              admin: { description: "Extra photos shown as thumbnails on the product page." },
              fields: [
                {
                  name: "image",
                  type: "upload",
                  relationTo: "media",
                  required: true,
                },
              ],
            },
          ],
        },
        {
          label: "Pricing",
          fields: [
            {
              name: "price",
              type: "number",
              min: 0,
              admin: {
                description:
                  "Price in Rs. per unit. Leave empty to show \"Price on WhatsApp\" instead.",
              },
            },
            {
              name: "unit",
              type: "text",
              defaultValue: "box",
              admin: {
                description: 'What one item is: box, piece, pair, set, cone, jar…',
              },
            },
          ],
        },
        {
          label: "Specs",
          description: "Anything left blank falls back to the category defaults.",
          fields: [
            {
              name: "specs",
              type: "group",
              label: false,
              fields: [
                { name: "material", type: "text" },
                { name: "size", type: "text" },
                { name: "finish", type: "text" },
                { name: "moq", type: "text", label: "Order quantity" },
              ],
            },
          ],
        },
      ],
    },
    slugField("name"),
    {
      name: "featured",
      type: "checkbox",
      defaultValue: false,
      admin: {
        position: "sidebar",
        description: "Featured products appear in the Best sellers row on the homepage.",
      },
    },
    orderField,
    {
      name: "legacyId",
      type: "text",
      index: true,
      admin: {
        position: "sidebar",
        readOnly: true,
        description: "Old product URL id. Keeps links shared before the CMS working.",
      },
    },
    seoField,
  ],
};
