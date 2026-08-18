import { v2 as cloudinary } from "cloudinary";

const cloudName = process.env.CLOUDINARY_CLOUD_NAME ?? "";
const apiKey = process.env.CLOUDINARY_API_KEY ?? "";
const apiSecret = process.env.CLOUDINARY_API_SECRET ?? "";

export const CLOUDINARY_FOLDER = process.env.CLOUDINARY_FOLDER || "bidhcraft";
export const CLOUDINARY_CLOUD_NAME = cloudName;

/** True only when all three credentials are present. */
export const cloudinaryEnabled = Boolean(cloudName && apiKey && apiSecret);

if (cloudinaryEnabled) {
  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
    secure: true,
  });
}

export { cloudinary };

/** Cloudinary treats these as path separators / reserved, so scrub them out. */
export function toPublicId(filename: string, folder = CLOUDINARY_FOLDER): string {
  const base = filename.replace(/\.[^./\\]+$/, "");
  const safe = base
    .normalize("NFKD")
    .replace(/[^\w.\- ]+/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-{2,}/g, "-")
    .toLowerCase();
  return folder ? `${folder}/${safe || "asset"}` : safe || "asset";
}

export type TransformOptions = {
  width?: number;
  height?: number;
  /** Cloudinary crop mode. `fill` matches the site's object-cover styling. */
  crop?: "fill" | "fit" | "limit" | "scale" | "thumb";
  quality?: string;
  format?: string;
};

/**
 * Builds a delivery URL with `f_auto,q_auto` so Cloudinary negotiates AVIF/WebP
 * per browser. Sizes are derived on the fly — we never store resized copies,
 * which is why `imageSizes` is empty on the Media collection.
 */
export function buildDeliveryUrl(
  publicId: string,
  opts: TransformOptions & { version?: number | null; format?: string } = {},
): string {
  if (!cloudName || !publicId) return "";

  const parts: string[] = [`f_${opts.format ?? "auto"}`, `q_${opts.quality ?? "auto"}`];
  if (opts.width) parts.push(`w_${Math.round(opts.width)}`);
  if (opts.height) parts.push(`h_${Math.round(opts.height)}`);
  if (opts.width || opts.height) parts.push(`c_${opts.crop ?? "fill"}`);

  const transform = parts.join(",");
  const version = opts.version ? `v${opts.version}/` : "";
  return `https://res.cloudinary.com/${cloudName}/image/upload/${transform}/${version}${publicId}`;
}
