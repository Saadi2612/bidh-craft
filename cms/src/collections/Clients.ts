import type { CollectionConfig } from "payload";

import { contentAccess } from "../access";
import { orderField } from "../fields/slug";
import { revalidateSite } from "../hooks/revalidateSite";

export const Clients: CollectionConfig = {
  slug: "clients",
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "order"],
    group: "Content",
    description: "Names in the scrolling \"Trusted by\" strip and the About page.",
  },
  access: contentAccess,
  defaultSort: "order",
  hooks: {
    afterChange: [revalidateSite],
    afterDelete: [revalidateSite],
  },
  fields: [
    { name: "name", type: "text", required: true },
    {
      name: "logo",
      type: "upload",
      relationTo: "media",
      admin: { description: "Optional. The strip currently shows names as text." },
    },
    orderField,
  ],
};
