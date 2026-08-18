import { cloudStoragePlugin } from "@payloadcms/plugin-cloud-storage";
import type { Adapter, GeneratedAdapter } from "@payloadcms/plugin-cloud-storage/types";
import type { Plugin } from "payload";

import {
  CLOUDINARY_FOLDER,
  buildDeliveryUrl,
  cloudinary,
  cloudinaryEnabled,
  toPublicId,
} from "./cloudinary";

type UploadResult = {
  public_id: string;
  version: number;
  format: string;
  resource_type: string;
  width?: number;
  height?: number;
  bytes?: number;
  secure_url: string;
};

function uploadBuffer(buffer: Buffer, publicId: string): Promise<UploadResult> {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        public_id: publicId,
        resource_type: "image",
        overwrite: true,
        // Purge the CDN edge copy so replacing an image shows up immediately.
        invalidate: true,
        use_filename: false,
        unique_filename: false,
      },
      (error, result) => {
        if (error || !result) {
          reject(error ?? new Error("Cloudinary upload returned no result"));
          return;
        }
        resolve(result as unknown as UploadResult);
      },
    );
    stream.end(buffer);
  });
}

const cloudinaryAdapter: Adapter = (): GeneratedAdapter => ({
  name: "cloudinary",

  fields: [
    {
      name: "cloudinaryPublicId",
      type: "text",
      admin: { readOnly: true, hidden: true },
    },
    {
      name: "cloudinaryVersion",
      type: "number",
      admin: { readOnly: true, hidden: true },
    },
    {
      name: "cloudinaryFormat",
      type: "text",
      admin: { readOnly: true, hidden: true },
    },
  ],

  async handleUpload({ data, file }) {
    const publicId = toPublicId(file.filename, CLOUDINARY_FOLDER);
    const result = await uploadBuffer(file.buffer, publicId);

    // Returned keys are merged back onto the document by the plugin.
    return {
      cloudinaryPublicId: result.public_id,
      cloudinaryVersion: result.version,
      cloudinaryFormat: result.format,
      width: result.width ?? data?.width,
      height: result.height ?? data?.height,
      filesize: result.bytes ?? file.filesize,
    };
  },

  async handleDelete({ doc, filename }) {
    const publicId =
      (doc as { cloudinaryPublicId?: string }).cloudinaryPublicId ??
      toPublicId(filename, CLOUDINARY_FOLDER);
    try {
      await cloudinary.uploader.destroy(publicId, {
        resource_type: "image",
        invalidate: true,
      });
    } catch {
      // A missing remote file must not block deleting the Payload document.
    }
  },

  generateURL({ data, filename }) {
    const doc = (data ?? {}) as { cloudinaryPublicId?: string; cloudinaryVersion?: number };
    const publicId = doc.cloudinaryPublicId ?? toPublicId(filename, CLOUDINARY_FOLDER);
    return buildDeliveryUrl(publicId, { version: doc.cloudinaryVersion ?? null });
  },

  // Only reached if Payload access control is left enabled; we redirect rather
  // than proxy so bytes never travel through the CMS server.
  staticHandler(_req, { params }) {
    const url = buildDeliveryUrl(toPublicId(params.filename, CLOUDINARY_FOLDER));
    if (!url) return new Response("Not found", { status: 404 });
    return Response.redirect(url, 302);
  },
});

/**
 * Serves media straight from the Cloudinary CDN.
 *
 * `disablePayloadAccessControl` is what makes the stored `url` a Cloudinary URL
 * instead of a `/api/media/file/...` path — the site then loads images without
 * ever touching the CMS server.
 *
 * Falls back to Payload's local disk storage when credentials are absent, so a
 * fresh clone still boots before Cloudinary is configured.
 */
export const cloudinaryStorage = (): Plugin =>
  cloudStoragePlugin({
    enabled: cloudinaryEnabled,
    // Deliberately not `alwaysInsertFields`: with the plugin disabled that would
    // still install the Cloudinary URL generator, which returns an empty string
    // when there is no cloud name — blanking every image URL.
    collections: {
      media: {
        adapter: cloudinaryAdapter,
        disablePayloadAccessControl: true,
      },
    },
  });
