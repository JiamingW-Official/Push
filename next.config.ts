import type { NextConfig } from "next";

const isProd = process.env.GITHUB_ACTIONS === "true";

const nextConfig: NextConfig = {
  // GitHub Pages needs static export; Cloudflare Workers needs standalone
  output: isProd ? "export" : "standalone",
  basePath: isProd ? "/Push" : "",
  assetPrefix: isProd ? "/Push/" : "",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
