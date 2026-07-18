import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  // Emits a self-contained .next/standalone/server.js with only the
  // production node_modules it actually needs - the production Dockerfile
  // copies just that output, not the whole node_modules tree.
  output: "standalone",
  images: {
    // Only the hero background (components/home/hero.tsx) goes through
    // next/image - it's hotlinked from Pinterest, and this remote pattern
    // is what makes that URL allowed. Property/blog cover images stay as
    // plain <img> on purpose: Cloudinary already serves them through
    // f_auto,q_auto at its own CDN edge (see CloudinaryUrlGenerator.php),
    // so routing them through Next's own image optimizer too would
    // re-process already-optimized bytes for no real benefit.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "i.pinimg.com",
      },
    ],
  },
  experimental: {
    // Off: this cache serves stale fetch() responses across dev-server
    // reloads (even for cache: "no-store" requests) until a full page
    // navigation - confusing when chasing down a backend fix that isn't
    // showing up. See node_modules/next/dist/docs/.../serverComponentsHmrCache.md.
    serverComponentsHmrCache: false,
  },
};

export default withNextIntl(nextConfig);
