import type { CollectionConfig } from "payload";

import { contentAccess } from "../access";
import { buildDeliveryUrl } from "../lib/cloudinary";

export const Media: CollectionConfig = {
  slug: "media",
  admin: {
    useAsTitle: "alt",
    group: "Library",
    description:
      "Every photo used on the site. Upload once here, then pick it on a product or category.",
  },
  access: contentAccess,
  upload: {
    // No resized copies are stored. Cloudinary derives every size on request via
    // the f_auto,q_auto transform in the delivery URL, so one upload serves all
    // breakpoints and formats.
    imageSizes: [],
    mimeTypes: ["image/*"],
    focalPoint: false,
    crop: false,
    adminThumbnail: ({ doc }) => {
      const publicId = doc["cloudinaryPublicId"];
      const version = doc["cloudinaryVersion"];
      if (typeof publicId === "string" && publicId) {
        return buildDeliveryUrl(publicId, {
          width: 320,
          height: 320,
          version: typeof version === "number" ? version : null,
        });
      }
      return typeof doc["url"] === "string" ? doc["url"] : false;
    },
  },
  fields: [
    {
      name: "alt",
      type: "text",
      required: true,
      admin: {
        description:
          "Describe the photo for screen readers and Google, e.g. \"Green embroidered Mehndi handheld sign with gold Urdu calligraphy\".",
      },
    },
    {
      name: "credit",
      type: "text",
      admin: { description: "Optional photographer or source credit." },
    },
  ],
};
