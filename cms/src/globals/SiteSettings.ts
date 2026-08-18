import type { GlobalConfig } from "payload";

import { publicRead, staffOnly } from "../access";
import { revalidateSite } from "../hooks/revalidateSite";

export const SiteSettings: GlobalConfig = {
  slug: "site-settings",
  label: "Site Settings",
  admin: {
    group: "Settings",
    description: "Contact details, prices and the WhatsApp message wording used across the site.",
  },
  access: { read: publicRead, update: staffOnly },
  hooks: { afterChange: [revalidateSite] },
  fields: [
    {
      type: "tabs",
      tabs: [
        {
          label: "Brand",
          fields: [
            { name: "brandName", type: "text", required: true, defaultValue: "THEBIDHCRAFT" },
            {
              name: "tagline",
              type: "textarea",
              required: true,
              defaultValue:
                "Handcrafted boxes for every happy moment — 100% handmade & hand-printed in Pakistan.",
              admin: { description: "The short paragraph in the footer." },
            },
            {
              name: "announcementBar",
              type: "text",
              admin: {
                description:
                  "The dark strip above the header. Leave blank to hide it entirely.",
              },
              defaultValue:
                "Custom orders for Nikkah, Walima, Mehndi & Aqeeqa — please order at least 5 days before your event 📦",
            },
            {
              name: "logo",
              type: "upload",
              relationTo: "media",
              admin: {
                description:
                  "Optional. Replaces the letter B circle in the header once uploaded.",
              },
            },
            {
              name: "footerNote",
              type: "text",
              defaultValue: "Orders currently processed via WhatsApp — online checkout coming soon.",
            },
          ],
        },
        {
          label: "Contact",
          fields: [
            {
              name: "whatsappNumber",
              type: "text",
              required: true,
              defaultValue: "923079701492",
              admin: {
                description:
                  "International format, digits only, no + or spaces. e.g. 923079701492",
              },
              validate: (value: unknown) =>
                typeof value === "string" && /^\d{8,15}$/.test(value)
                  ? true
                  : "Digits only, 8–15 of them, including the country code.",
            },
            {
              name: "phoneDisplay",
              type: "text",
              required: true,
              defaultValue: "0307 9701492",
              admin: { description: "How the number is written on the page." },
            },
            { name: "email", type: "email", required: true, defaultValue: "thebidhcraft@gmail.com" },
            {
              name: "instagramUrl",
              type: "text",
              required: true,
              defaultValue: "https://www.instagram.com/thebidhcraft/",
            },
            {
              name: "instagramHandle",
              type: "text",
              required: true,
              defaultValue: "@thebidhcraft",
            },
          ],
        },
        {
          label: "Ordering",
          fields: [
            {
              name: "leadTimeDays",
              type: "number",
              required: true,
              min: 0,
              defaultValue: 5,
              admin: {
                description:
                  "Days of notice needed before an event. Sets the earliest pre-order date.",
              },
            },
            {
              name: "boxPriceMin",
              type: "number",
              required: true,
              min: 0,
              defaultValue: 150,
              admin: { description: "Low end of the standard box price range, in Rs." },
            },
            {
              name: "boxPriceMax",
              type: "number",
              required: true,
              min: 0,
              defaultValue: 210,
              admin: { description: "High end of the standard box price range, in Rs." },
            },
            {
              name: "quoteNote",
              type: "text",
              required: true,
              defaultValue: "Priced on WhatsApp as per quantity",
              admin: { description: "Shown instead of a price when a product has none." },
            },
          ],
        },
        {
          label: "WhatsApp messages",
          description:
            "The text pre-filled when someone taps an order button. {product}, {qty}, {name}, {occasion}, {quantity}, {date}, {city}, {notes} and {leadTime} are replaced automatically.",
          fields: [
            {
              name: "waTemplates",
              type: "group",
              label: false,
              fields: [
                {
                  name: "general",
                  type: "textarea",
                  required: true,
                  defaultValue: "Hi THEBIDHCRAFT! I'd like to know more about your boxes.",
                },
                {
                  name: "order",
                  type: "textarea",
                  required: true,
                  defaultValue: "Hi THEBIDHCRAFT! I'd like to order a box.",
                },
                {
                  name: "custom",
                  type: "textarea",
                  required: true,
                  defaultValue:
                    "Hi THEBIDHCRAFT! I have a custom design in mind — can you make it?",
                },
                {
                  name: "product",
                  type: "textarea",
                  required: true,
                  defaultValue:
                    'Hi THEBIDHCRAFT! I\'d like to order "{product}". Quantity: {qty}. Please share details.',
                  admin: { description: "Uses {product} and {qty}." },
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};
