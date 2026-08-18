import type { CmsImage } from "./types";

const CLOUD_NAME = import.meta.env["VITE_CLOUDINARY_CLOUD_NAME"] as string | undefined;

export type ImageOptions = {
  width?: number;
  height?: number;
  crop?: "fill" | "fit" | "limit";
};

/**
 * Shown wherever a document has no photo yet — a plain cream panel in the site
 * palette. A missing image should look like an empty frame, not a broken file.
 */
const PLACEHOLDER_SVG =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 4 3">' +
  '<rect width="4" height="3" fill="#F7EFE7"/>' +
  '<circle cx="2" cy="1.5" r="0.45" fill="#EADCCE"/>' +
  "</svg>";

export const PLACEHOLDER_IMAGE = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(
  PLACEHOLDER_SVG,
)}`;

/**
 * Builds a Cloudinary delivery URL at the size actually rendered.
 *
 * Every image is stored once at full resolution; asking for `w_900` here is
 * what keeps the site from shipping 3000px originals into 400px cards. Falls
 * back to the stored URL for media that isn't on Cloudinary.
 */
export function imageUrl(image: CmsImage | null | undefined, opts: ImageOptions = {}): string {
  if (!image?.url) return PLACEHOLDER_IMAGE;
  if (!image.publicId || !CLOUD_NAME) return image.url;

  const parts = ["f_auto", "q_auto"];
  if (opts.width) parts.push(`w_${Math.round(opts.width)}`);
  if (opts.height) parts.push(`h_${Math.round(opts.height)}`);
  if (opts.width || opts.height) parts.push(`c_${opts.crop ?? "fill"}`);

  const version = image.version ? `v${image.version}/` : "";
  return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/${parts.join(",")}/${version}${image.publicId}`;
}

/** `srcset` for responsive cards — the browser picks the cheapest that fits. */
export function imageSrcSet(
  image: CmsImage | null | undefined,
  widths: number[],
  opts: Omit<ImageOptions, "width"> = {},
): string | undefined {
  if (!image?.publicId || !CLOUD_NAME) return undefined;
  return widths.map((w) => `${imageUrl(image, { ...opts, width: w })} ${w}w`).join(", ");
}

export function imageAlt(image: CmsImage | null | undefined, fallback: string): string {
  return image?.alt?.trim() ? image.alt : fallback;
}
