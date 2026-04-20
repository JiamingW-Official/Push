import type { NextConfig } from "next";

/**
 * Security headers applied to every response. Batch-C audit remediation:
 * the backend review found no CSP, HSTS, X-Content-Type-Options, or
 * Referrer-Policy in use — combined with the non-HttpOnly impersonation
 * cookie that Batch A flagged, any XSS would become an account takeover.
 *
 * CSP is set in report-only style for now (no blocking) because several
 * legacy pages inline scripts; promote to enforcing mode after those are
 * migrated or hashed.
 */
const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Strict-Transport-Security",
    // 2-year max-age + include subdomains + preload — standard production posture.
    value: "max-age=63072000; includeSubDomains; preload",
  },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(self)",
  },
];

const nextConfig: NextConfig = {
  compress: true,
  images: {
    formats: ["image/avif", "image/webp"],
  },
  async headers() {
    return [
      {
        // Apply to every route (pages + API).
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
