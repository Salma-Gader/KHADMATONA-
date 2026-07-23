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
    // Off: on by default since Next 16.1 (turbopackFileSystemCache.md), but
    // its lockfile uses a filesystem lock that fails with EACCES over the
    // Windows bind mount used by compose.yaml's dev container ("Permission
    // denied (os error 13)"), crashing the container right after boot.
    turbopackFileSystemCacheForDev: false,
  },
  // Mirrors vercel.json's rewrites for `next dev`/self-hosted `next start`,
  // neither of which read vercel.json - without this, lib/api.ts's browser
  // requests (deliberately relative, see resolveApiUrl()'s docblock) would
  // 404 locally since there's no proxy without it. Keeps local dev and the
  // deployed-on-Vercel case behave identically: the browser always talks to
  // its own origin, same-site cookies work the same way in both.
  async rewrites() {
    const backend = process.env.NEXT_PUBLIC_API_URL || "http://localhost";
    return [
      { source: "/sanctum/:path*", destination: `${backend}/sanctum/:path*` },
      { source: "/api/:path*", destination: `${backend}/api/:path*` },
    ];
  },
};

export default withNextIntl(nextConfig);
