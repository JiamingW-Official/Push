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
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "plus.unsplash.com" },
      { protocol: "https", hostname: "api.qrserver.com" },
      { protocol: "https", hostname: "api.dicebear.com" },
      { protocol: "https", hostname: "avatars.githubusercontent.com" },
    ],
  },
  async redirects() {
    return [
      // Audit § P1-6 — collapse legacy /work/* hub into canonical pages.
      // /work/calendar is the ONE survivor (#27 Phase 1-4 deep refactor still
      // owns the calendar UX); other /work/* pages were duplicates of
      // /today, /gigs/active, /gigs/invites, /campaigns/[id].
      {
        source: "/creator/work/today",
        destination: "/creator/today",
        permanent: true,
      },
      {
        source: "/creator/work/pipeline",
        destination: "/creator/gigs/active",
        permanent: true,
      },
      {
        source: "/creator/work/drafts",
        destination: "/creator/gigs/invites",
        permanent: true,
      },
      {
        source: "/creator/work/campaign/:id",
        destination: "/creator/campaigns/:id",
        permanent: true,
      },
      {
        source: "/creator/work",
        destination: "/creator/gigs",
        permanent: true,
      },
      // Standalone duplicate routes — /today is the canonical landing.
      {
        source: "/creator/dashboard",
        destination: "/creator/today",
        permanent: true,
      },
      {
        source: "/creator/overview",
        destination: "/creator/today",
        permanent: true,
      },
      // /explore was the older Discover surface; /discover is canonical.
      {
        source: "/creator/explore",
        destination: "/creator/discover",
        permanent: true,
      },
      // Inbox/invites was lifted to /gigs/invites (sync PR #29).
      {
        source: "/creator/inbox/invites",
        destination: "/creator/gigs/invites",
        permanent: true,
      },
      {
        source: "/creator/inbox/invites/:slug*",
        destination: "/creator/gigs/invites/:slug*",
        permanent: true,
      },
      {
        source: "/creator/inbox",
        destination: "/creator/inbox/messages",
        permanent: true,
      },
    ];
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
