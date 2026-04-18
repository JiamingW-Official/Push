// Push Changelog — Mock Entries
// Time range: 2025 Q3 → 2026 Q2
// 25 entries in reverse-chronological order

export type VersionTag = "major" | "minor" | "patch";
export type AreaTag =
  | "Attribution"
  | "Payments"
  | "Creator"
  | "Merchant"
  | "Platform";

export interface ChangelogEntry {
  id: string;
  date: string; // ISO date string
  version: string; // semver e.g. "2.4.0"
  versionTag: VersionTag; // major / minor / patch
  area: AreaTag;
  title: string;
  summary: string; // 1-2 sentence lead
  body: string; // markdown-ish longer description
  bullets: string[]; // 3-5 feature bullets
  imagePlaceholder: string; // label for image placeholder
  author: {
    name: string;
    handle: string;
    role: string;
  };
  codedBy: string;
}

export const changelogEntries: ChangelogEntry[] = [
  // ─── 2026 Q2 ──────────────────────────────────────────────────────────────
  {
    id: "cl-025",
    date: "2026-04-10",
    version: "3.0.0",
    versionTag: "major",
    area: "Platform",
    title: "Agentic Campaign Builder — AI writes your brief.",
    summary:
      "Merchants can now describe a campaign goal in plain language and Push AI will generate a full campaign brief, tier requirements, and payout structure in under 30 seconds.",
    body: 'After six months of internal testing, we\'re shipping our Agentic Campaign Builder as a first-class feature. You describe what you want in plain English — "drive 200 visits to our Friday tasting menu" — and Push AI handles everything: suggested tier range, optimal payout per QR scan, estimated creator count, and a draft campaign brief. You review, tweak, and publish.',
    bullets: [
      "Natural language campaign creation with AI-generated brief, tier targets, and payout model",
      "Auto-suggested geo radius and creator pool estimate based on business location",
      "One-click apply from AI draft → live campaign with full QR attribution stack",
      "Merchant can override any AI field; all edits are tracked for model improvement",
      "Integrated fraud-risk preview: AI flags payout structures with anomaly risk > 15%",
    ],
    imagePlaceholder:
      "Agentic Campaign Builder — AI chat interface generating a campaign brief",
    author: { name: "Jiaming Wang", handle: "@jiamingw", role: "Founder" },
    codedBy: "Push Engineering",
  },
  {
    id: "cl-024",
    date: "2026-03-28",
    version: "2.9.2",
    versionTag: "patch",
    area: "Attribution",
    title: "QR scan deduplication: 15-minute cooldown window.",
    summary:
      "We tightened QR re-scan rules to a 15-minute per-device cooldown, reducing duplicate payout events by 38% in our NYC pilot.",
    body: "Our fraud analytics team identified a pattern of rapid rescanning from a single device at high-volume venues. The fix applies a 15-minute cooldown keyed on device fingerprint + QR code ID. Legitimate same-visit rescans (e.g. split checks) are handled via the manager override panel.",
    bullets: [
      "15-min cooldown window per device × QR code pair, stored in Redis with TTL",
      "Manager override UI in the merchant dashboard for legitimate edge cases",
      "Anomaly score penalty reduced for creators who trigger cooldown (false-positive protection)",
      'New "Deduplication Events" column in the payout CSV export',
    ],
    imagePlaceholder:
      "QR scan deduplication — Redis cooldown timeline visualization",
    author: {
      name: "Priya Mehta",
      handle: "@priya.push",
      role: "Head of Trust & Safety",
    },
    codedBy: "Attribution Team",
  },
  {
    id: "cl-023",
    date: "2026-03-14",
    version: "2.9.0",
    versionTag: "minor",
    area: "Creator",
    title: "Tier Dashboard v2 — see your path to Partner.",
    summary:
      "The creator tier dashboard now shows a live progression rail, score breakdown, and a projected date to next tier based on your trailing 30-day velocity.",
    body: "We rebuilt the creator tier UI from the ground up. The new progression rail shows all six tiers (Seed → Partner) with your current position highlighted. Tap any tier to see what unlocks there. The score breakdown modal shows exactly how each campaign, QR scan, and content piece contributed to your current score.",
    bullets: [
      "Six-tier visual progression rail (Clay → Obsidian) with current position indicator",
      "Score breakdown: QR scans (40%), content quality (30%), consistency (20%), anti-fraud (10%)",
      '"Days to next tier" projection based on 30-day trailing velocity',
      "Milestone bonus history table — see every time you earned a tier-up reward",
      "Obsidian-tier badge now pulses on the creator profile card",
    ],
    imagePlaceholder:
      "Tier Dashboard v2 — six-tier progression rail with score breakdown",
    author: {
      name: "Anya Reeves",
      handle: "@anyabuilds",
      role: "Product Lead, Creator",
    },
    codedBy: "Push Engineering",
  },
  {
    id: "cl-022",
    date: "2026-02-27",
    version: "2.8.1",
    versionTag: "patch",
    area: "Payments",
    title: "Instant payout floor raised to $5 for Bronze+ creators.",
    summary:
      "Bronze-tier and above creators can now trigger an instant payout for any balance over $5, down from the previous $25 minimum.",
    body: "Based on creator feedback and payout analytics, we've lowered the instant payout floor for Bronze+ creators to $5. This matters most for new creators building momentum — it means your first few scans translate to real money faster. Seed/Clay-tier creators retain the $15 floor while we monitor fraud patterns at that tier.",
    bullets: [
      "Bronze+ instant payout floor: $5 (was $25)",
      "Seed/Clay tier unchanged at $15 — will revisit after fraud data review",
      "Payout processing time: <90 seconds via Stripe Connect (no change)",
      'New "Available to pay out" banner on creator home when balance ≥ floor',
    ],
    imagePlaceholder:
      "Instant payout UI — creator balance card with $5 floor highlighted",
    author: {
      name: "Dani Torres",
      handle: "@dani.push",
      role: "Payments Engineer",
    },
    codedBy: "Payments Team",
  },
  {
    id: "cl-021",
    date: "2026-02-12",
    version: "2.8.0",
    versionTag: "minor",
    area: "Merchant",
    title: "Campaign templates library — 8 ready-to-use briefs.",
    summary:
      "Merchants can now start campaigns from eight pre-built templates covering the most common use cases: soft launch, off-peak fill, tasting menu, event night, and more.",
    body: "Building a campaign from scratch requires understanding tier targets, payout structures, and QR flow. Templates remove that friction. Each template is pre-filled with proven defaults from our top-performing campaigns, with explanatory tooltips so merchants understand what each setting does.",
    bullets: [
      "8 templates: Soft Launch, Off-Peak Fill, Tasting Menu, Event Night, Happy Hour, New Item, Weekend Push, Grand Opening",
      "Each template pre-fills: campaign goal, suggested tier range, payout per scan, QR placement, and campaign duration",
      '"Start from scratch" always available for advanced users',
      "Template performance benchmarks shown (avg. creator count, avg. conversion rate)",
      "One-click duplicate: copy any past campaign as a new template",
    ],
    imagePlaceholder:
      "Campaign templates — 3-column card grid with template previews",
    author: {
      name: "Marcus Lee",
      handle: "@marcusbuild",
      role: "Product Lead, Merchant",
    },
    codedBy: "Push Engineering",
  },

  // ─── 2026 Q1 ──────────────────────────────────────────────────────────────
  {
    id: "cl-020",
    date: "2026-01-31",
    version: "2.7.3",
    versionTag: "patch",
    area: "Attribution",
    title: "Map heatmap: real-time scan density overlay.",
    summary:
      "The merchant attribution map now renders a live scan-density heatmap so you can see which QR placements are driving the most visits in real time.",
    body: "We replaced the static pin grid with a live heatmap layer powered by Leaflet.heat. Scan events stream in via Supabase Realtime and the heatmap refreshes every 5 seconds during active campaign hours. Hot zones (red) vs. cold zones (blue) make it immediately obvious which table, counter, or window placement is working.",
    bullets: [
      "Live heatmap layer — refreshes every 5 seconds via Supabase Realtime",
      "Toggle between heatmap and pin view from the map toolbar",
      "Time-range scrubber: replay any 6-hour window from the past 30 days",
      "Export scan-density CSV keyed by QR code ID and lat/lng",
    ],
    imagePlaceholder:
      "Attribution map — red/blue heatmap over NYC neighborhood with scan clusters",
    author: {
      name: "Priya Mehta",
      handle: "@priya.push",
      role: "Head of Trust & Safety",
    },
    codedBy: "Attribution Team",
  },
  {
    id: "cl-019",
    date: "2026-01-18",
    version: "2.7.0",
    versionTag: "minor",
    area: "Creator",
    title: "Content portfolio — showcase your best UGC.",
    summary:
      "Creators now have a public-facing portfolio page where they can pin their best posts, link Instagram/TikTok content, and display verified campaign results.",
    body: "Merchant outreach works better when creators have something to show. The new portfolio lets you pin up to 12 pieces of content — native uploads, Instagram shortcodes, TikTok links, or external URLs. Each pinned item can display a verified campaign badge if the content was created as part of a Push campaign. Your portfolio URL is shareable and indexable.",
    bullets: [
      "Pin up to 12 content items: images, Instagram shortcodes, TikTok links, external URLs",
      "Verified campaign badge on content created via Push — merchants can filter by this",
      "Public portfolio URL: push.app/creator/[handle]/portfolio",
      "Featured toggle — star your top 3 pieces to appear above the fold",
      "Merchant outreach: creators with ≥3 portfolio items get 2x invite priority in our matching algorithm",
    ],
    imagePlaceholder:
      "Creator portfolio — 3-column content grid with verified campaign badges",
    author: {
      name: "Anya Reeves",
      handle: "@anyabuilds",
      role: "Product Lead, Creator",
    },
    codedBy: "Push Engineering",
  },
  {
    id: "cl-018",
    date: "2026-01-07",
    version: "2.6.2",
    versionTag: "patch",
    area: "Platform",
    title: "Performance: 40% faster dashboard load via route prefetching.",
    summary:
      "We instrumented the merchant and creator dashboards with Next.js route prefetching and Supabase query caching, cutting median load time from 1.8s to 1.1s.",
    body: "January infrastructure sprint: profiled our three most-visited routes (merchant dashboard, creator feed, attribution map) and found three hot queries firing without caching. Added Supabase query memoization, Next.js `prefetch` on nav links, and split the attribution map bundle into a lazy chunk. P95 load improved by 40%.",
    bullets: [
      "Supabase query memoization for campaign list, creator feed, and attribution dashboard",
      "Next.js route prefetching on all primary nav links",
      "Attribution map JS bundle split into lazy chunk — saves 180KB on initial load",
      "New `/api/health` endpoint for uptime monitoring (Render + Vercel)",
    ],
    imagePlaceholder:
      "Performance metrics — before/after load time comparison chart",
    author: { name: "Push Engineering", handle: "@pusheng", role: "Platform" },
    codedBy: "Push Engineering",
  },

  // ─── 2025 Q4 ──────────────────────────────────────────────────────────────
  {
    id: "cl-017",
    date: "2025-12-19",
    version: "2.6.0",
    versionTag: "minor",
    area: "Payments",
    title: "Merchant invoicing — download monthly payout summaries.",
    summary:
      "Merchants can now download a PDF invoice for any completed campaign month, formatted for bookkeeping and tax filing.",
    body: "Accounting asked us for this. Merchant billing is now fully self-serve: go to Settings → Billing → Invoice History, pick any month, and download a PDF with campaign name, creator count, total scans, payout amount, and Push platform fee breakdown. Invoices are also emailed automatically at month-end.",
    bullets: [
      "PDF invoice download for any completed campaign month",
      "Auto-email at month-end to billing contact (configurable in Settings)",
      "Invoice includes: campaign name, creator count, QR scans, gross payout, platform fee, net",
      "CSV export for bulk bookkeeping (QuickBooks / Xero compatible headers)",
      "Invoice history retained for 7 years per our data policy",
    ],
    imagePlaceholder:
      "Merchant invoicing — PDF invoice preview with payout breakdown table",
    author: {
      name: "Dani Torres",
      handle: "@dani.push",
      role: "Payments Engineer",
    },
    codedBy: "Payments Team",
  },
  {
    id: "cl-016",
    date: "2025-12-05",
    version: "2.5.1",
    versionTag: "patch",
    area: "Attribution",
    title: "Anti-fraud: anomaly score now visible to creators.",
    summary:
      "Creators can now see their own anomaly score in the Trust & Safety panel, along with a plain-language explanation of what affects it.",
    body: 'Transparency builds trust. Creators were asking why payouts were sometimes delayed or flagged. We\'ve added a "Trust & Safety" tab to the creator dashboard showing your current anomaly score (0–100, lower is better), the three biggest factors, and concrete steps to improve it. Scores above 70 trigger a manual review before payout.',
    bullets: [
      "Anomaly score (0–100) visible to creators in the Trust & Safety tab",
      "Three-factor breakdown: scan velocity, device diversity, content-to-scan ratio",
      '"How to improve" modal with actionable tips',
      "Scores above 70 show a yellow warning banner; above 85 show a red hold banner",
      "Score recalculates daily at 3 AM UTC",
    ],
    imagePlaceholder:
      "Creator Trust & Safety — anomaly score gauge with factor breakdown",
    author: {
      name: "Priya Mehta",
      handle: "@priya.push",
      role: "Head of Trust & Safety",
    },
    codedBy: "Attribution Team",
  },
  {
    id: "cl-015",
    date: "2025-11-21",
    version: "2.5.0",
    versionTag: "minor",
    area: "Merchant",
    title: "Outreach dashboard — invite creators directly.",
    summary:
      "Merchants on Operator+ plans can now browse the creator directory and send personalized invite messages to up to 20 creators per campaign.",
    body: "Word-of-mouth beats algorithmic matching for premium campaigns. The Outreach dashboard shows a curated list of creators who match your campaign's location, tier requirements, and content category. You can send a personalized message (250 char), track response rates, and see who's posted about similar venues.",
    bullets: [
      "Creator directory filtered by: location radius, tier, content category, audience size",
      "Invite up to 20 creators per campaign on Operator+ plans (unlimited on Scale)",
      "Personalized message with 250-character limit; Darky-powered copy suggestions",
      "Invite tracking: sent / viewed / accepted / declined status in real time",
      "Response rate benchmark: see how your invite performs vs. category average",
    ],
    imagePlaceholder:
      "Outreach dashboard — creator cards with invite status badges",
    author: {
      name: "Marcus Lee",
      handle: "@marcusbuild",
      role: "Product Lead, Merchant",
    },
    codedBy: "Push Engineering",
  },
  {
    id: "cl-014",
    date: "2025-11-07",
    version: "2.4.3",
    versionTag: "patch",
    area: "Platform",
    title: "Mobile web: bottom nav, haptic confirmations.",
    summary:
      "The mobile web experience now has a persistent bottom navigation bar and haptic feedback on key actions for iOS users.",
    body: "Mobile web is how most creators interact with Push between campaigns. We rebuilt the mobile nav from a hamburger menu to a persistent bottom bar with five tabs: Feed, My Campaigns, Scan, Payouts, Profile. Haptic feedback (via `navigator.vibrate`) fires on QR scan confirmation and payout trigger.",
    bullets: [
      "Persistent 5-tab bottom nav bar on ≤768px viewports (Feed / Campaigns / Scan / Payouts / Profile)",
      "Haptic feedback on: QR scan confirm, payout trigger, campaign apply",
      "Safe area insets for iPhone notch and Dynamic Island",
      "Bottom nav active state: Flag Red top border + tinted background",
    ],
    imagePlaceholder:
      "Mobile bottom nav — five-tab bar on iPhone mockup with active state",
    author: { name: "Push Engineering", handle: "@pusheng", role: "Platform" },
    codedBy: "Push Engineering",
  },
  {
    id: "cl-013",
    date: "2025-10-24",
    version: "2.4.0",
    versionTag: "minor",
    area: "Creator",
    title: "Leaderboard — top earners by neighborhood.",
    summary:
      "The new neighborhood leaderboard ranks creators by verified earnings for the past 30 days, broken down by NYC neighborhood.",
    body: "Friendly competition drives engagement. The leaderboard ranks creators by verified payout earnings across six NYC neighborhoods: SoHo, Williamsburg, Astoria, Upper East, LES, and Bushwick. Each creator's rank is tied to their anonymized handle until they opt into public display. Gold/Champagne highlights for top-3.",
    bullets: [
      "Real-time leaderboard by neighborhood — updates every 6 hours",
      "Rank based on verified payout (QR scans × payout rate, post-fraud-filter)",
      "Opt-in to public display (default: anonymized handle)",
      "Top-3 highlighted with Champagne Gold accent — Obsidian-tier creators get a badge shimmer",
      "Your rank is always shown at the bottom of the list regardless of position",
    ],
    imagePlaceholder:
      "Neighborhood leaderboard — ranked creator list with earnings and tier badges",
    author: {
      name: "Anya Reeves",
      handle: "@anyabuilds",
      role: "Product Lead, Creator",
    },
    codedBy: "Push Engineering",
  },
  {
    id: "cl-012",
    date: "2025-10-10",
    version: "2.3.2",
    versionTag: "patch",
    area: "Attribution",
    title: "QR code batch print — A4/Letter PDFs from the dashboard.",
    summary:
      "Merchants can now generate a print-ready PDF of all their campaign QR codes — formatted for standard A4 or Letter, 4 per page with labels.",
    body: "Printing QR codes was a 5-step process involving downloading individual PNGs and formatting them in a third-party tool. We built a native PDF generator: select your QR codes, choose A4 or Letter, and download a print-ready PDF with code ID labels, business name, and campaign name on each tile.",
    bullets: [
      "Batch PDF generator: select any subset of QR codes from your campaign",
      "A4 and Letter format options — 4 QR codes per page with labels",
      "Label includes: QR code ID, business name, campaign name, scan target URL",
      "High-resolution 300 DPI SVG-based output for clean printing",
      "Integrated with the existing QR management panel — no separate tool needed",
    ],
    imagePlaceholder:
      "QR batch print — PDF preview with 4 QR codes per page and labels",
    author: {
      name: "Priya Mehta",
      handle: "@priya.push",
      role: "Head of Trust & Safety",
    },
    codedBy: "Attribution Team",
  },

  // ─── 2025 Q3 ──────────────────────────────────────────────────────────────
  {
    id: "cl-011",
    date: "2025-09-26",
    version: "2.3.0",
    versionTag: "minor",
    area: "Payments",
    title: "Payout speed tiers — Bronze gets next-day, Steel gets same-day.",
    summary:
      "Creator payout speed is now tied to tier. Seed/Clay: weekly batch. Bronze/Explorer: next-day ACH. Steel+: same-day via Stripe Instant.",
    body: "Payout speed is a meaningful incentive for tier progression. We restructured the payout schedule to directly reward higher-tier creators with faster access to their earnings. Bronze and Explorer creators move from the weekly batch to next-day ACH. Steel, Gold, Ruby, and Obsidian creators get same-day payouts via Stripe Connect Instant — funds arrive in the creator's linked bank within 30 minutes of triggering.",
    bullets: [
      "Seed/Clay: weekly batch payout (unchanged)",
      "Bronze/Explorer: next-day ACH payout (was weekly)",
      "Steel/Gold/Ruby/Obsidian: same-day instant payout via Stripe Connect (≤30 min)",
      "Payout speed displayed on the tier progression rail",
      "Instant payout fee (1.5% for sub-$100 payouts) shown transparently at time of trigger",
    ],
    imagePlaceholder:
      "Payout speed tiers — tier progression rail with payout speed callouts",
    author: {
      name: "Dani Torres",
      handle: "@dani.push",
      role: "Payments Engineer",
    },
    codedBy: "Payments Team",
  },
  {
    id: "cl-010",
    date: "2025-09-15",
    version: "2.2.1",
    versionTag: "patch",
    area: "Merchant",
    title: "Campaign pause and resume — no more cancel-and-recreate.",
    summary:
      "Merchants can now pause a live campaign and resume it later without losing scan history, creator assignments, or payout data.",
    body: "Restaurants close for private events, renovations, or staff changes. Before this update, pausing meant canceling — losing all attribution history and forcing a full recreate. Now, paused campaigns freeze QR scan acceptance and creator payouts but retain all historical data. Resume resumes within 60 seconds.",
    bullets: [
      "Pause/Resume button on the campaign management panel (Operator+ only)",
      'Paused state: QR scans still register but are marked "pending" — not paid until resume',
      "Creator assigned slots are retained — no re-matching needed on resume",
      "Pause history log in the campaign audit trail",
      "Auto-pause available on Operator+ via campaign schedule settings",
    ],
    imagePlaceholder:
      "Campaign pause/resume — campaign management panel with pause state UI",
    author: {
      name: "Marcus Lee",
      handle: "@marcusbuild",
      role: "Product Lead, Merchant",
    },
    codedBy: "Push Engineering",
  },
  {
    id: "cl-009",
    date: "2025-09-04",
    version: "2.2.0",
    versionTag: "minor",
    area: "Platform",
    title: "Supabase Realtime — live scan counts on the merchant dashboard.",
    summary:
      "Campaign scan counts, creator status, and payout totals on the merchant dashboard now update in real time without a page refresh.",
    body: "We migrated our polling-based dashboard updates to Supabase Realtime subscriptions. Scan events broadcast from the QR verification endpoint now push to the merchant dashboard via WebSocket. Merchants watching a Friday-night campaign can see scan counts tick up in real time as creators post and visit.",
    bullets: [
      "Live scan count on campaign dashboard — WebSocket push via Supabase Realtime",
      "Creator status indicator: active (posting/scanning) vs. idle",
      "Live payout total: gross amount owed updates with each verified scan",
      "Anomaly alerts: real-time banner if scan velocity exceeds threshold (>15 scans/min from single creator)",
      "Connection status indicator in the dashboard header (green dot = live)",
    ],
    imagePlaceholder:
      "Merchant dashboard — live scan counter ticking with Realtime connection indicator",
    author: { name: "Push Engineering", handle: "@pusheng", role: "Platform" },
    codedBy: "Push Engineering",
  },
  {
    id: "cl-008",
    date: "2025-08-22",
    version: "2.1.4",
    versionTag: "patch",
    area: "Creator",
    title: "Feed improvements — filter by area and payout rate.",
    summary:
      "The creator campaign feed now supports filtering by NYC neighborhood and minimum payout per QR scan, making it faster to find the right opportunity.",
    body: "We added two high-demand filters to the creator feed: neighborhood (multi-select, based on campaign venue location) and minimum payout per QR scan. The filter bar is persistent across sessions and syncs to your profile preferences. Results update instantly on filter change — no page reload.",
    bullets: [
      "Neighborhood filter: multi-select from 12 NYC neighborhoods",
      "Min payout filter: slider from $5 to $50 per QR scan",
      "Filters persist across sessions via localStorage (opt-out in settings)",
      'Active filter count badge on the "Filters" button',
      "Filter chip pills clear individually — pill shape per Design.md exception",
    ],
    imagePlaceholder:
      "Creator feed filter bar — neighborhood chips and payout slider active",
    author: {
      name: "Anya Reeves",
      handle: "@anyabuilds",
      role: "Product Lead, Creator",
    },
    codedBy: "Push Engineering",
  },
  {
    id: "cl-007",
    date: "2025-08-08",
    version: "2.1.0",
    versionTag: "minor",
    area: "Attribution",
    title: "Verified visit badge — earned after confirmed QR scan.",
    summary:
      'Creators now receive a "Verified Visit" badge on their campaign post history after a QR scan is confirmed at the venue — a trust signal for merchants browsing creator profiles.',
    body: "Authenticity is Push's core value proposition. The Verified Visit badge ties a creator's content post directly to a confirmed QR scan at the campaign venue. It appears on the creator's campaign history and is visible to merchants browsing creator profiles in the outreach directory. Badges are permanent and cannot be removed by the creator.",
    bullets: [
      '"Verified Visit" badge issued per campaign, tied to a confirmed QR scan event',
      "Badge visible on creator's campaign history and public portfolio",
      'Merchant outreach directory can filter by "has verified visit" creators',
      "Badge metadata includes: campaign name, venue, scan timestamp (no exact coordinates)",
      "Revocable by Trust & Safety if the scan is later flagged as fraudulent",
    ],
    imagePlaceholder:
      "Verified Visit badge — creator campaign card with blue verification stamp",
    author: {
      name: "Priya Mehta",
      handle: "@priya.push",
      role: "Head of Trust & Safety",
    },
    codedBy: "Attribution Team",
  },
  {
    id: "cl-006",
    date: "2025-07-25",
    version: "2.0.0",
    versionTag: "major",
    area: "Platform",
    title: "Push 2.0 — six-tier creator system, new payout engine.",
    summary:
      "Our biggest release yet: a six-tier creator hierarchy (Seed to Partner), a rebuilt payout engine with Stripe Connect, and a fully redesigned merchant campaign builder.",
    body: "Push 2.0 is a ground-up rethink of how creators progress, earn, and how merchants build campaigns. We've expanded from four tiers to six — adding Seed (Clay) at entry and splitting the old Partner tier into Ruby (Closer) and Obsidian (Partner). The payout engine is rebuilt on Stripe Connect Express with instant settlement for top tiers. The merchant campaign builder is completely new, with a template library, tier targeting, and QR code management in one flow.",
    bullets: [
      "Six-tier system: Seed (Clay) → Explorer (Bronze) → Operator (Steel) → Proven (Gold) → Closer (Ruby) → Partner (Obsidian)",
      "New scoring model: QR scans (40%), content quality (30%), consistency (20%), anti-fraud (10%)",
      "Rebuilt payout engine on Stripe Connect Express — instant settlement for Steel+",
      "Fully redesigned merchant campaign builder with template library",
      "QR code management integrated into campaign flow — generate, track, and print from one panel",
    ],
    imagePlaceholder:
      "Push 2.0 — six-tier progression rail with redesigned merchant campaign builder",
    author: { name: "Jiaming Wang", handle: "@jiamingw", role: "Founder" },
    codedBy: "Push Engineering",
  },
  {
    id: "cl-005",
    date: "2025-07-11",
    version: "1.9.3",
    versionTag: "patch",
    area: "Payments",
    title: "Stripe Connect Express onboarding — 3-minute setup.",
    summary:
      "Creator payment setup is now fully self-serve via Stripe Connect Express — median time to first payout dropped from 48 hours to 3 minutes.",
    body: "We integrated Stripe Connect Express for creator onboarding. Previously, new creators had to submit banking info manually and wait for a manual review cycle. Now, Stripe's Express onboarding handles KYC, bank verification, and instant account activation. Creators can receive their first payout the same day they sign up.",
    bullets: [
      "Stripe Connect Express onboarding — embedded in the creator signup flow",
      "KYC handled by Stripe: no Push-side document review required",
      "Bank verification: instant for most US banks (Plaid-backed)",
      "First payout: same-day for verified accounts",
      "Payout dashboard: Stripe-hosted portal for bank changes, tax docs, and payout history",
    ],
    imagePlaceholder:
      "Stripe Connect Express — embedded onboarding flow in creator signup",
    author: {
      name: "Dani Torres",
      handle: "@dani.push",
      role: "Payments Engineer",
    },
    codedBy: "Payments Team",
  },
  {
    id: "cl-004",
    date: "2025-06-27",
    version: "1.9.0",
    versionTag: "minor",
    area: "Creator",
    title: "Campaign feed v2 — editorial card layout, infinite scroll.",
    summary:
      "The creator campaign feed is rebuilt with an editorial card grid, featured campaign spotlight, and infinite scroll replacing pagination.",
    body: 'The old feed was a list. The new feed is a gallery — editorial magazine cards with hero images, payout prominently displayed, deadline urgency indicators, and a featured campaign at the top of each session. Infinite scroll replaces the "Load more" button, with smooth GSAP card-dealing animations as new cards enter.',
    bullets: [
      "Editorial card grid: 1 col mobile, 2 col 640px, 3 col 1024px, 4 col 1440px",
      "Featured campaign card spans 2 columns on 1024px+",
      "Infinite scroll with `feedCardIn` GSAP animation (500ms, staggered)",
      "Deadline urgency: amber warning ≥48h, red urgent ≤24h with pulse animation",
      "Payout badge: Darky 900 weight, top-left with red left-accent line",
    ],
    imagePlaceholder:
      "Campaign feed v2 — editorial card grid with featured campaign spotlight",
    author: {
      name: "Anya Reeves",
      handle: "@anyabuilds",
      role: "Product Lead, Creator",
    },
    codedBy: "Push Engineering",
  },
  {
    id: "cl-003",
    date: "2025-06-14",
    version: "1.8.2",
    versionTag: "patch",
    area: "Attribution",
    title: "QR scan map: live pin drops on merchant dashboard.",
    summary:
      "Merchants can now see a live map of QR scan events as they happen, with pins color-coded by creator tier.",
    body: "We shipped the attribution map MVP. It shows real-time scan events as pins on a Leaflet map centered on the campaign venue. Each pin is color-coded by the scanning creator's tier — Clay/Bronze/Steel/Gold/Ruby/Obsidian. Clicking a pin shows the creator handle, scan timestamp, and payout triggered. The map auto-centers on the venue on load.",
    bullets: [
      "Live scan event pins on Leaflet map — updates within 2 seconds of scan via Supabase Realtime",
      "Pins color-coded by creator tier using the six-tier color spectrum",
      "Click a pin: creator handle, scan timestamp, payout amount, verified status",
      "Filter pins by tier, time range, and scan status (verified / pending / flagged)",
      "Export visible pins as GeoJSON for offline analysis",
    ],
    imagePlaceholder:
      "Attribution map MVP — Leaflet map with tier-colored scan pins over NYC",
    author: {
      name: "Priya Mehta",
      handle: "@priya.push",
      role: "Head of Trust & Safety",
    },
    codedBy: "Attribution Team",
  },
  {
    id: "cl-002",
    date: "2025-05-30",
    version: "1.8.0",
    versionTag: "minor",
    area: "Merchant",
    title: "Campaign builder v1 — QR code generation in 4 steps.",
    summary:
      "Merchants can now build a campaign, generate QR codes, and set payout rules in a four-step guided wizard without needing to contact our team.",
    body: "Our first fully self-serve campaign creation flow. In four steps — venue details, campaign goal, QR code placement, payout rules — merchants can go from zero to a live campaign with printable QR codes in under 10 minutes. The wizard validates each step and shows a cost estimate before publishing.",
    bullets: [
      "Four-step wizard: Venue → Goal → QR Placement → Payout Rules",
      "QR code generation with unique IDs per placement (table, counter, window, etc.)",
      "Payout rule builder: set $ per QR scan, max per creator, max total payout",
      "Cost estimate preview before publishing — shows worst-case and expected-case spend",
      "Draft autosave: wizard progress saved to localStorage every 30 seconds",
    ],
    imagePlaceholder:
      "Campaign builder v1 — four-step wizard with QR code generation step",
    author: {
      name: "Marcus Lee",
      handle: "@marcusbuild",
      role: "Product Lead, Merchant",
    },
    codedBy: "Push Engineering",
  },
  {
    id: "cl-001",
    date: "2025-05-01",
    version: "1.0.0",
    versionTag: "major",
    area: "Platform",
    title:
      "Push launches in NYC — the first QR-attribution creator marketplace.",
    summary:
      "Push is live. Creators earn real money for real visits. Merchants pay only for proven foot traffic. The first 20 campaigns go live today in SoHo and Williamsburg.",
    body: "Two years of building, one year of pilots. Today Push is live for creators and merchants in New York City. The core loop is simple: a merchant creates a campaign and places QR codes at their venue. A creator posts about the merchant and brings followers to scan the QR code. The creator earns a payout for each verified scan. The merchant pays only for proven visits — no impressions, no clicks, no guessing. Every payout is tied to a unique QR scan event. Every scan is verified in under 2 seconds. This is what performance-based creator marketing looks like.",
    bullets: [
      "20 campaigns live at launch: 10 restaurants, 4 bars, 3 coffee shops, 2 retail, 1 nightlife",
      "Creator signup open to all NYC-based content creators — no follower minimum",
      "QR scan verification: sub-2-second confirmation with Supabase Realtime",
      "Payout: weekly batch for all creators at launch",
      "Attribution map live in the merchant dashboard — see every scan as it happens",
    ],
    imagePlaceholder:
      "Push launch — hero campaign map of NYC with 20 live campaign pins",
    author: { name: "Jiaming Wang", handle: "@jiamingw", role: "Founder" },
    codedBy: "Push Engineering",
  },
];

// Sorted descending by date (newest first) — already in order above
export const sortedEntries = changelogEntries;

// Unique areas for filter
export const allAreas: AreaTag[] = [
  "Attribution",
  "Payments",
  "Creator",
  "Merchant",
  "Platform",
];

// Unique version tags
export const allVersionTags: VersionTag[] = ["major", "minor", "patch"];
