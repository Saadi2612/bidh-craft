import type { Access } from "payload";

/** Storefront content is public to read, staff-only to change. */
export const publicRead: Access = () => true;
export const staffOnly: Access = ({ req }) => Boolean(req.user);

export const contentAccess = {
  read: publicRead,
  create: staffOnly,
  update: staffOnly,
  delete: staffOnly,
} as const;
