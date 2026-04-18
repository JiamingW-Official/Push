import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  compress: true,
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "plus.unsplash.com" },
      { protocol: "https", hostname: "api.qrserver.com" },
      { protocol: "https", hostname: "api.dicebear.com" },
      { protocol: "https", hostname: "avatars.githubusercontent.com" },
    ],
  },
  async redirects() {
    // v5.0 301 redirects: legacy SaaS tier query params → outcome-based pricing.
    // Starter → $0 Pilot (smallest bucket). Growth/Scale → Performance.
    return [
      {
        source: "/pricing",
        has: [{ type: "query", key: "plan", value: "starter" }],
        destination: "/pilot",
        permanent: true,
      },
      {
        source: "/pricing",
        has: [{ type: "query", key: "plan", value: "growth" }],
        destination: "/pricing#performance",
        permanent: true,
      },
      {
        source: "/pricing",
        has: [{ type: "query", key: "plan", value: "scale" }],
        destination: "/pricing#performance",
        permanent: true,
      },
      {
        source: "/merchant/signup",
        has: [{ type: "query", key: "plan", value: "starter" }],
        destination: "/merchant/pilot",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
