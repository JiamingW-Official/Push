import type { NextConfig } from "next";

const isProd = process.env.GITHUB_ACTIONS === "true";

const nextConfig: NextConfig = {
  // Both GitHub Pages and Cloudflare Workers use static export
  output: "export",
  basePath: isProd ? "/Push" : "",
  assetPrefix: isProd ? "/Push/" : "",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
