import type { GlobalConfig } from "payload";

import { publicRead, staffOnly } from "../access";
import { seoField } from "../fields/slug";
import { sectionHeading } from "../fields/sectionHeading";
import { revalidateSite } from "../hooks/revalidateSite";

export const HomePage: GlobalConfig = {
  slug: "home-page",
  label: "Home Page",
  admin: { group: "Pages", description: "Every block on the homepage, top to bottom." },
  access: { read: publicRead, update: staffOnly },
  hooks: { afterChange: [revalidateSite] },
  fields: [
    {
      type: "tabs",
      tabs: [
        {
          label: "Hero",
          fields: [
            {
              name: "hero",
              type: "group",
              label: false,
              fields: [
                {
                  name: "eyebrow",
                  type: "text",
                  required: true,
                  defaultValue: "100% handmade & hand-printed",
                },
                {
                  name: "title",
                  type: "text",
                  required: true,
                  defaultValue: "Handcrafted Boxes for Every Happy Moment",
                },
                {
                  name: "body",
                  type: "textarea",
                  required: true,
                  defaultValue:
                    "Every box is cut, folded, printed and tied by hand in our little studio — made for Nikkah, Walima, Mehndi, Aqeeqa and birthdays. Boxes start at Rs. 150 and go up to Rs. 210 depending on size and finish. Signs, pens, bazubands and velvet plaques are priced on WhatsApp as per your quantity.",
                },
                {
                  name: "primaryCta",
                  type: "text",
                  required: true,
                  defaultValue: "Shop Now",
                  admin: { description: "Links to the Shop page." },
                },
                {
                  name: "secondaryCta",
                  type: "text",
                  required: true,
                  defaultValue: "Order on WhatsApp",
                },
                {
                  name: "badges",
                  type: "array",
                  labels: { singular: "Badge", plural: "Badges" },
                  maxRows: 4,
                  admin: { description: "The small grey lines under the hero buttons." },
                  fields: [{ name: "text", type: "text", required: true }],
                },
                { name: "image", type: "upload", relationTo: "media", required: true },
                {
                  name: "priceBadge",
                  type: "group",
                  admin: { description: "The little floating card over the hero photo." },
                  fields: [
                    { name: "title", type: "text", defaultValue: "Rs. 150 – 210" },
                    { name: "sub", type: "text", defaultValue: "per handmade box" },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: "Sections",
          fields: [
            {
              name: "clientsHeading",
              type: "text",
              required: true,
              defaultValue: "Trusted by brands & creators we've packed for",
            },
            sectionHeading("categoriesSection", "Shop by category", {
              eyebrow: "Shop by category",
              title: "Find your box type",
              sub: "Four core collections — and we add new ones every season.",
            }),
            sectionHeading("collectionsSection", "Browse collections", {
              eyebrow: "Browse collections",
              title: "Explore every collection",
              sub: "Swipe through each collection — tap any design to order on WhatsApp.",
            }),
            sectionHeading("occasionsSection", "Shop by occasion", {
              eyebrow: "Shop by occasion",
              title: "Made for your celebration",
              sub: "Tell us the event and we'll match the box, the colours and the print.",
            }),
            sectionHeading("featuredSection", "Best sellers", {
              eyebrow: "Best sellers",
              title: "Loved by our customers",
              sub: "Boxes are Rs. 150 to Rs. 210 depending on size and finish. Everything else is quoted on WhatsApp as per quantity.",
            }),
            {
              name: "featuredLimit",
              type: "number",
              defaultValue: 8,
              min: 4,
              max: 12,
              admin: { description: "How many products to show in the Best sellers row." },
            },
            sectionHeading("howToOrderSection", "How to order", {
              eyebrow: "How to order",
              title: "Three simple steps",
              sub: "No cart needed — we handle everything personally over WhatsApp.",
            }),
            {
              name: "howToOrderSteps",
              type: "array",
              maxRows: 4,
              labels: { singular: "Step", plural: "Steps" },
              fields: [
                { name: "title", type: "text", required: true },
                { name: "body", type: "textarea", required: true },
                {
                  name: "icon",
                  type: "select",
                  defaultValue: "sparkles",
                  options: [
                    { label: "Sparkles", value: "sparkles" },
                    { label: "Message", value: "message" },
                    { label: "Truck", value: "truck" },
                    { label: "Palette", value: "palette" },
                    { label: "Clock", value: "clock" },
                  ],
                },
              ],
            },
            sectionHeading("instagramSection", "Instagram", {
              eyebrow: "@thebidhcraft",
              title: "From our Instagram",
              sub: "Fresh boxes, behind-the-scenes and real event orders.",
            }),
            {
              name: "instagramImages",
              type: "array",
              maxRows: 6,
              labels: { singular: "Post", plural: "Posts" },
              admin: {
                description:
                  "Six photos linking to your profile. Leave empty to fall back to category covers.",
              },
              fields: [{ name: "image", type: "upload", relationTo: "media", required: true }],
            },
            {
              name: "instagramCta",
              type: "text",
              defaultValue: "Follow us @thebidhcraft",
            },
            sectionHeading(
              "testimonialsSection",
              "Testimonials",
              { eyebrow: "Kind words", title: "What our customers say" },
              { withSub: false },
            ),
          ],
        },
        {
          label: "Custom orders",
          fields: [
            {
              name: "customSection",
              type: "group",
              label: false,
              fields: [
                { name: "eyebrow", type: "text", required: true, defaultValue: "Custom & on demand" },
                { name: "title", type: "text", required: true, defaultValue: "You show it, we make it." },
                {
                  name: "body",
                  type: "textarea",
                  required: true,
                  defaultValue:
                    "Send us a photo, a Pinterest screenshot or just an idea — colours, monograms, names, dates, logos, anything. We hand-make it to match. Bulk event orders and corporate gifting welcome.",
                },
                {
                  name: "note",
                  type: "text",
                  admin: { description: "Highlighted lead-time reminder box." },
                  defaultValue:
                    "⏳ Please place custom orders at least 5 days before your event so every box is printed and dried properly.",
                },
                {
                  name: "cta",
                  type: "text",
                  required: true,
                  defaultValue: "Share your design on WhatsApp",
                },
                {
                  name: "features",
                  type: "array",
                  maxRows: 4,
                  labels: { singular: "Feature", plural: "Features" },
                  fields: [
                    { name: "title", type: "text", required: true },
                    { name: "body", type: "text", required: true },
                    {
                      name: "icon",
                      type: "select",
                      defaultValue: "palette",
                      options: [
                        { label: "Palette", value: "palette" },
                        { label: "Sparkles", value: "sparkles" },
                        { label: "Truck", value: "truck" },
                        { label: "Message", value: "message" },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: "Our story",
          fields: [
            {
              name: "story",
              type: "group",
              label: false,
              fields: [
                { name: "eyebrow", type: "text", required: true, defaultValue: "Our story" },
                {
                  name: "title",
                  type: "text",
                  required: true,
                  defaultValue: "Made by hand, for life's happiest moments",
                },
                {
                  name: "paragraphs",
                  type: "array",
                  labels: { singular: "Paragraph", plural: "Paragraphs" },
                  maxRows: 4,
                  fields: [{ name: "text", type: "textarea", required: true }],
                },
                { name: "image", type: "upload", relationTo: "media", required: true },
                { name: "cta", type: "text", defaultValue: "Read our story" },
              ],
            },
          ],
        },
        {
          label: "SEO",
          fields: [seoField],
        },
      ],
    },
  ],
};
