import { withPayload } from "@payloadcms/next/withPayload";

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Payload's admin bundle is large; keep source maps off in prod builds.
  productionBrowserSourceMaps: false,
};

export default withPayload(nextConfig, { devBundleServerPackages: false });
