import type { GlobalConfig } from "payload";

import { publicRead, staffOnly } from "../access";
import { seoField } from "../fields/slug";
import { revalidateSite } from "../hooks/revalidateSite";

const base = { access: { read: publicRead, update: staffOnly }, hooks: { afterChange: [revalidateSite] } };

export const ShopPage: GlobalConfig = {
  ...base,
  slug: "shop-page",
  label: "Shop Page",
  admin: { group: "Pages", description: "Heading and intro above the product grid." },
  fields: [
    { name: "eyebrow", type: "text", required: true, defaultValue: "The collection" },
    { name: "title", type: "text", required: true, defaultValue: "Shop all boxes" },
    {
      name: "intro",
      type: "textarea",
      required: true,
      defaultValue:
        "Every box is handmade and hand-printed to order. Boxes are Rs. 150 to Rs. 210 per piece — signs, pens, bazubands and velvet plaques are quoted on WhatsApp as per quantity.",
    },
    {
      name: "emptyMessage",
      type: "textarea",
      required: true,
      defaultValue:
        "No boxes match those filters — but we make custom pieces on demand. Message us on WhatsApp.",
      admin: { description: "Shown when the filters return nothing." },
    },
    seoField,
  ],
};

export const AboutPage: GlobalConfig = {
  ...base,
  slug: "about-page",
  label: "About Page",
  admin: { group: "Pages" },
  fields: [
    {
      type: "tabs",
      tabs: [
        {
          label: "Intro",
          fields: [
            { name: "eyebrow", type: "text", required: true, defaultValue: "Our story" },
            {
              name: "title",
              type: "text",
              required: true,
              defaultValue: "Everything here is made by hand",
            },
            {
              name: "intro",
              type: "textarea",
              required: true,
              defaultValue:
                'THEBIDHCRAFT is a small Pakistani studio making decorative gift and favor boxes — the little "bid boxes" that guests carry home from your happiest days.',
            },
            { name: "image", type: "upload", relationTo: "media", required: true },
          ],
        },
        {
          label: "Columns",
          description: "The two side-by-side blocks under the photo.",
          fields: [
            {
              name: "howWeWork",
              type: "group",
              fields: [
                { name: "title", type: "text", required: true, defaultValue: "How we work" },
                {
                  name: "paragraphs",
                  type: "array",
                  maxRows: 4,
                  labels: { singular: "Paragraph", plural: "Paragraphs" },
                  fields: [{ name: "text", type: "textarea", required: true }],
                },
              ],
            },
            {
              name: "occasionsColumn",
              type: "group",
              label: "Occasions column",
              fields: [
                {
                  name: "title",
                  type: "text",
                  required: true,
                  defaultValue: "Occasions we make for",
                },
                {
                  name: "useOccasionsList",
                  type: "checkbox",
                  defaultValue: true,
                  admin: {
                    description:
                      "On: builds the list from the Occasions collection. Off: uses the custom items below.",
                  },
                },
                {
                  name: "items",
                  type: "array",
                  labels: { singular: "Item", plural: "Items" },
                  admin: { condition: (_, siblingData) => !siblingData?.["useOccasionsList"] },
                  fields: [
                    { name: "term", type: "text", required: true },
                    { name: "definition", type: "text", required: true },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: "Closing",
          fields: [
            {
              name: "clientsHeading",
              type: "text",
              required: true,
              defaultValue: "Some of the names we've packed for",
            },
            { name: "primaryCta", type: "text", required: true, defaultValue: "Start a custom order" },
            { name: "secondaryCta", type: "text", required: true, defaultValue: "Browse the shop" },
            seoField,
          ],
        },
      ],
    },
  ],
};

export const ContactPage: GlobalConfig = {
  ...base,
  slug: "contact-page",
  label: "Contact Page",
  admin: { group: "Pages" },
  fields: [
    { name: "eyebrow", type: "text", required: true, defaultValue: "Say hello" },
    { name: "title", type: "text", required: true, defaultValue: "Let's plan your boxes" },
    {
      name: "intro",
      type: "textarea",
      required: true,
      defaultValue:
        "WhatsApp is the fastest way to reach us — send the product name, quantity and your event date and we'll confirm price, customization and delivery.",
    },
    {
      name: "leadTimeCardLabel",
      type: "text",
      required: true,
      defaultValue: "Lead time",
      admin: { description: "The fourth contact card; its value uses the lead time in Settings." },
    },
    {
      name: "bulk",
      type: "group",
      label: "Bulk / corporate block",
      fields: [
        { name: "title", type: "text", required: true, defaultValue: "Bulk or corporate gifting?" },
        {
          name: "body",
          type: "textarea",
          required: true,
          defaultValue:
            "We've produced boxes for brands and creators across Pakistan. Share your quantity, branding and deadline and we'll quote it.",
        },
        { name: "primaryCta", type: "text", required: true, defaultValue: "Message us on WhatsApp" },
        { name: "secondaryCta", type: "text", required: true, defaultValue: "Start a pre-order" },
      ],
    },
    seoField,
  ],
};

export const PreOrderPage: GlobalConfig = {
  ...base,
  slug: "pre-order-page",
  label: "Pre-Order Page",
  admin: { group: "Pages" },
  fields: [
    { name: "eyebrow", type: "text", required: true, defaultValue: "Pre-order" },
    { name: "title", type: "text", required: true, defaultValue: "Reserve your boxes" },
    {
      name: "intro",
      type: "textarea",
      required: true,
      defaultValue:
        "Fill this in and we'll open WhatsApp with your details already written out. Everything is handmade to order, so please allow {leadTime} days before your event.",
      admin: { description: "{leadTime} is replaced with the lead time from Site Settings." },
    },
    {
      name: "submitLabel",
      type: "text",
      required: true,
      defaultValue: "Send pre-order on WhatsApp",
    },
    {
      name: "footnote",
      type: "textarea",
      required: true,
      defaultValue:
        "Nothing is charged here — WhatsApp opens with your details so we can confirm price and customization.",
    },
    {
      name: "extraOccasionOptions",
      type: "array",
      labels: { singular: "Option", plural: "Options" },
      admin: {
        description:
          "Added to the occasion dropdown after the ones from the Occasions collection.",
      },
      fields: [{ name: "label", type: "text", required: true }],
    },
    seoField,
  ],
};
