import { NextResponse } from "next/server";

const BASE_URL = "https://pushnyc.co";
const FEED_URL = `${BASE_URL}/changelog/feed.xml`;

// Mock changelog entries — replace with DB/CMS query when changelog is live
const CHANGELOG_ENTRIES = [
  {
    id: "v8-2-premium-editorial",
    version: "v8.2",
    title: "Premium Editorial UI",
    summary:
      "Complete visual overhaul with editorial-grade typography, GSAP scroll animations, and refined component hierarchy across all marketing pages.",
    date: new Date("2026-04-17"),
    tags: ["design", "frontend"],
  },
  {
    id: "v8-1-demo-expansion",
    version: "v8.1",
    title: "Demo Campaign Expansion",
    summary:
      "Expanded demo campaigns to 100 entries across real NYC neighborhoods. Added placeholder images and improved demo data realism for investor previews.",
    date: new Date("2026-04-10"),
    tags: ["demo", "content"],
  },
  {
    id: "v8-0-qr-attribution",
    version: "v8.0",
    title: "QR Attribution Engine v2",
    summary:
      "Rebuilt scan-to-verify pipeline with improved anti-fraud detection, geofence validation, and sub-second verification latency.",
    date: new Date("2026-04-01"),
    tags: ["product", "engineering"],
  },
  {
    id: "v7-9-creator-tiers",
    version: "v7.9",
    title: "6-Tier Creator System v4.0",
    summary:
      "Introduced the Seed tier for new creators. Revised Push Score algorithm to weight visit verification rate more heavily. Added commission structure for Operator+.",
    date: new Date("2026-03-20"),
    tags: ["product", "creators"],
  },
  {
    id: "v7-8-merchant-dashboard",
    version: "v7.8",
    title: "Merchant Dashboard Redesign",
    summary:
      "Rebuilt campaign management interface with real-time scan tracking, creator application review queue, and exportable attribution reports.",
    date: new Date("2026-03-10"),
    tags: ["product", "merchants"],
  },
  {
    id: "v7-7-explore-map",
    version: "v7.7",
    title: "Explore Map & Neighborhood Targeting",
    summary:
      "Launched interactive campaign map powered by Mapbox. Creators can now browse open campaigns by neighborhood with distance filtering.",
    date: new Date("2026-03-01"),
    tags: ["product", "creators"],
  },
  {
    id: "v7-6-instant-payout",
    version: "v7.6",
    title: "Instant Payout for Partner Tier",
    summary:
      "Partner-tier creators now receive instant payouts upon visit verification. Reduced settlement window for Closer tier from T+2 to same-day.",
    date: new Date("2026-02-20"),
    tags: ["product", "payments"],
  },
  {
    id: "v7-5-multi-location",
    version: "v7.5",
    title: "Multi-Location Campaign Support",
    summary:
      "Merchants with multiple NYC locations can now run unified campaigns with location-specific QR codes and per-location attribution breakdowns.",
    date: new Date("2026-02-10"),
    tags: ["product", "merchants"],
  },
  {
    id: "v7-4-content-moderation",
    version: "v7.4",
    title: "Automated Content Moderation",
    summary:
      "Added AI-assisted content review for submitted proof. Brand safety filters applied automatically before merchant review queue.",
    date: new Date("2026-02-01"),
    tags: ["product", "safety"],
  },
  {
    id: "v7-3-referral",
    version: "v7.3",
    title: "Creator Referral Program",
    summary:
      "Launched referral program: creators earn $15 for each new creator they refer who completes their first campaign.",
    date: new Date("2026-01-22"),
    tags: ["product", "growth"],
  },
  {
    id: "v7-2-api-public",
    version: "v7.2",
    title: "Public API Beta",
    summary:
      "Released public REST API for merchant integrations. Supports campaign creation, scan event webhooks, and payout reporting.",
    date: new Date("2026-01-12"),
    tags: ["engineering", "api"],
  },
  {
    id: "v7-1-categories",
    version: "v7.1",
    title: "Campaign Category Expansion",
    summary:
      "Added 8 new campaign categories: Fitness, Retail, Entertainment, Services, Events, Health, Education, and Co-working.",
    date: new Date("2026-01-05"),
    tags: ["product"],
  },
  {
    id: "v7-0-launch",
    version: "v7.0",
    title: "Push Platform Launch",
    summary:
      "Public beta launch of Push — pay-per-verified-visit creator marketing for NYC businesses. 50 founding merchants onboarded.",
    date: new Date("2025-12-15"),
    tags: ["launch"],
  },
  {
    id: "v6-9-supabase",
    version: "v6.9",
    title: "Supabase Migration Complete",
    summary:
      "Completed migration from custom Postgres to Supabase. Row-level security policies enforced across all creator and merchant data.",
    date: new Date("2025-12-01"),
    tags: ["engineering", "infrastructure"],
  },
  {
    id: "v6-8-onboarding",
    version: "v6.8",
    title: "Creator Onboarding Flow v2",
    summary:
      "Streamlined creator signup to 4 steps. Added Instagram handle verification and portfolio import from public posts.",
    date: new Date("2025-11-20"),
    tags: ["product", "creators"],
  },
  {
    id: "v6-7-scan-ux",
    version: "v6.7",
    title: "Scan Page UX Improvements",
    summary:
      "Redesigned QR scan landing page with faster load time, clearer verification status, and improved mobile layout.",
    date: new Date("2025-11-10"),
    tags: ["design", "engineering"],
  },
  {
    id: "v6-6-notifications",
    version: "v6.6",
    title: "Real-Time Push Notifications",
    summary:
      "Creators receive instant notifications for campaign acceptance, scan verification, and payout confirmation via web push and email.",
    date: new Date("2025-11-01"),
    tags: ["product"],
  },
  {
    id: "v6-5-analytics",
    version: "v6.5",
    title: "Merchant Analytics Dashboard",
    summary:
      "Added week-over-week visit trends, creator performance rankings, and campaign ROI calculator to merchant dashboard.",
    date: new Date("2025-10-20"),
    tags: ["product", "merchants"],
  },
  {
    id: "v6-4-difficulty",
    version: "v6.4",
    title: "Campaign Difficulty Multipliers",
    summary:
      "Introduced Standard / Premium / Complex campaign tiers with 1.0x, 1.3x, and 1.6x payout multipliers to match content complexity.",
    date: new Date("2025-10-10"),
    tags: ["product"],
  },
  {
    id: "v6-3-mobile",
    version: "v6.3",
    title: "Mobile-First Creator Dashboard",
    summary:
      "Rebuilt creator dashboard as a mobile-first experience. Campaign browsing, application management, and earnings tracking optimized for iOS and Android.",
    date: new Date("2025-10-01"),
    tags: ["design", "frontend"],
  },
  {
    id: "v6-2-search",
    version: "v6.2",
    title: "Campaign Search & Filters",
    summary:
      "Added full-text campaign search with filters for category, payout range, neighborhood, and creator tier requirement.",
    date: new Date("2025-09-20"),
    tags: ["product"],
  },
  {
    id: "v6-1-verification",
    version: "v6.1",
    title: "Two-Factor Scan Verification",
    summary:
      "Added optional two-factor verification for high-value campaigns: QR scan + merchant staff confirmation via mobile app.",
    date: new Date("2025-09-10"),
    tags: ["product", "security"],
  },
  {
    id: "v6-0-waitlist",
    version: "v6.0",
    title: "Creator Waitlist Opens",
    summary:
      "Opened creator waitlist with early access for NYC-based food, lifestyle, and beauty micro-creators. First 500 creators auto-approved.",
    date: new Date("2025-09-01"),
    tags: ["launch", "creators"],
  },
  {
    id: "v5-9-brand-safety",
    version: "v5.9",
    title: "Brand Safety Policy v1",
    summary:
      "Published comprehensive brand safety guidelines. Merchants can now set content restrictions and auto-reject non-compliant submissions.",
    date: new Date("2025-08-20"),
    tags: ["product", "safety"],
  },
  {
    id: "v5-8-founding",
    version: "v5.8",
    title: "Founding Merchant Program",
    summary:
      "Launched founding merchant program: first 100 businesses get $199/mo plan free for 6 months plus dedicated onboarding support.",
    date: new Date("2025-08-10"),
    tags: ["growth", "merchants"],
  },
];

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function toAtomDate(date: Date): string {
  return date.toISOString();
}

export async function GET() {
  const recent = CHANGELOG_ENTRIES.slice(0, 25);
  const lastUpdated = recent[0]?.date ?? new Date();

  const entries = recent
    .map(
      (entry) => `
  <entry>
    <id>${BASE_URL}/changelog#${entry.id}</id>
    <title>${escapeXml(`${entry.version} — ${entry.title}`)}</title>
    <summary type="text">${escapeXml(entry.summary)}</summary>
    <link href="${BASE_URL}/changelog#${entry.id}" rel="alternate"/>
    <updated>${toAtomDate(entry.date)}</updated>
    <author>
      <name>Push Team</name>
      <email>hello@pushnyc.co</email>
    </author>
    ${entry.tags.map((tag) => `<category term="${escapeXml(tag)}"/>`).join("\n    ")}
  </entry>`,
    )
    .join("");

  const feed = `<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <id>${FEED_URL}</id>
  <title>Push Changelog</title>
  <subtitle>Product updates, new features, and improvements to the Push platform.</subtitle>
  <link href="${BASE_URL}/changelog" rel="alternate"/>
  <link href="${FEED_URL}" rel="self"/>
  <updated>${toAtomDate(lastUpdated)}</updated>
  <author>
    <name>Push Team</name>
    <email>hello@pushnyc.co</email>
    <uri>${BASE_URL}</uri>
  </author>
  <rights>Copyright ${new Date().getFullYear()} Push Technologies, Inc.</rights>
  <icon>${BASE_URL}/favicon.svg</icon>
  ${entries}
</feed>`;

  return new NextResponse(feed, {
    headers: {
      "Content-Type": "application/atom+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
    },
  });
}
