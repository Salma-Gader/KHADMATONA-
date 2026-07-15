import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  experimental: {
    // Off: this cache serves stale fetch() responses across dev-server
    // reloads (even for cache: "no-store" requests) until a full page
    // navigation - confusing when chasing down a backend fix that isn't
    // showing up. See node_modules/next/dist/docs/.../serverComponentsHmrCache.md.
    serverComponentsHmrCache: false,
  },
};

export default withNextIntl(nextConfig);
