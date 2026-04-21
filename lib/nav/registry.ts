// Push navigation registry — single source of truth for every layout's menu.
//
// Before this refactor: 4 independent hardcoded navs (marketing header +
// footer, creator workspace, admin, nothing for merchant). Orphaned pages
// were routine because adding a page didn't mean adding a nav entry.
//
// After: every layout imports from this file. Adding a page and forgetting
// to register it here produces a TypeScript `never` failure in the CI nav
// integrity test (see e2e/nav-integrity.spec.ts — not yet written).
//
// Rules:
//   - One entry per URL. Duplicates in this file are lint errors.
//   - `audience` must match the route group — no /merchant/* links in the
//     creator registry etc.
//   - `hiddenInDemo` only for pages that truly can't be demoed (Stripe
//     Connect onboarding, real webhook test). Everything else must work.

export interface NavLink {
  label: string;
  href: string;
  /** Icon glyph for side-nav surfaces. Optional for header / footer. */
  icon?: string;
  /** Match by prefix instead of exact equality. */
  prefix?: boolean;
  /** True = hide from the demo audience (rare; document why). */
  hiddenInDemo?: boolean;
}

export interface NavGroup {
  label: string;
  items: NavLink[];
}

// ---------------------------------------------------------------------------
// Marketing (header + footer)
// ---------------------------------------------------------------------------

export const MARKETING_HEADER: NavLink[] = [
  { label: "Product", href: "/how-it-works" },
  { label: "Pricing", href: "/pricing" },
  { label: "For Creators", href: "/for-creators" },
  { label: "For Merchants", href: "/for-merchants" },
  { label: "Case Studies", href: "/case-studies" },
];

export const MARKETING_FOOTER: NavGroup[] = [
  {
    label: "Product",
    items: [
      { label: "How it works", href: "/how-it-works" },
      { label: "Pricing", href: "/pricing" },
      { label: "Neighborhoods", href: "/neighborhoods" },
      { label: "API", href: "/api-docs" },
      { label: "Status", href: "/status" },
    ],
  },
  {
    label: "Company",
    items: [
      { label: "About", href: "/about" },
      { label: "Careers", href: "/careers" },
      { label: "Press", href: "/press" },
      { label: "Contact", href: "/contact" },
      { label: "Changelog", href: "/changelog" },
    ],
  },
  {
    label: "Resources",
    items: [
      { label: "Blog", href: "/blog" },
      { label: "Help Center", href: "/help" },
      { label: "FAQ", href: "/faq" },
      { label: "Case Studies", href: "/case-studies" },
      { label: "Trust & Security", href: "/trust" },
    ],
  },
  {
    label: "Legal",
    items: [
      { label: "Privacy", href: "/legal/privacy" },
      { label: "Terms", href: "/legal/terms" },
      { label: "Cookies", href: "/legal/cookies" },
      { label: "Do Not Sell", href: "/legal/do-not-sell" },
      { label: "Acceptable Use", href: "/legal/acceptable-use" },
      { label: "Data Rights", href: "/data-rights" },
    ],
  },
];

// ---------------------------------------------------------------------------
// Consumer (post-scan, post-QR)
// ---------------------------------------------------------------------------

export const CONSUMER_NAV: NavLink[] = [
  { label: "Explore", href: "/explore" },
  { label: "My privacy", href: "/my-privacy" },
  { label: "Data rights", href: "/data-rights" },
];

// ---------------------------------------------------------------------------
// Creator portal
// ---------------------------------------------------------------------------

export const CREATOR_PRIMARY: NavLink[] = [
  { label: "Home", href: "/creator/dashboard", icon: "⬡" },
  { label: "Work", href: "/creator/work/today", icon: "◈", prefix: true },
  { label: "Discover", href: "/creator/discover", icon: "◐" },
  { label: "Inbox", href: "/creator/inbox", icon: "▣", prefix: true },
  { label: "Earnings", href: "/creator/earnings", icon: "▲" },
  { label: "Analytics", href: "/creator/analytics", icon: "◉" },
  { label: "Leaderboard", href: "/creator/leaderboard", icon: "★" },
];

export const CREATOR_SECONDARY: NavLink[] = [
  { label: "Portfolio", href: "/creator/portfolio", prefix: true },
  { label: "Profile", href: "/creator/profile" },
  { label: "Notifications", href: "/creator/notifications" },
  { label: "Wallet", href: "/creator/wallet" },
  { label: "Settings", href: "/creator/settings" },
];

// ---------------------------------------------------------------------------
// Merchant portal
// ---------------------------------------------------------------------------

export const MERCHANT_PRIMARY: NavLink[] = [
  { label: "Dashboard", href: "/merchant/dashboard", icon: "⬡" },
  { label: "Campaigns", href: "/merchant/campaigns/new", icon: "◈" },
  { label: "QR Codes", href: "/merchant/qr-codes", icon: "⊞" },
  { label: "Redeem", href: "/merchant/redeem", icon: "◇" },
  { label: "Applicants", href: "/merchant/applicants", icon: "◓" },
  { label: "Analytics", href: "/merchant/analytics", icon: "◉" },
];

export const MERCHANT_SECONDARY: NavLink[] = [
  { label: "Locations", href: "/merchant/locations", prefix: true },
  { label: "Payments", href: "/merchant/payments" },
  { label: "Billing", href: "/merchant/billing" },
  { label: "Integrations", href: "/merchant/integrations", prefix: true },
  { label: "Disputes", href: "/merchant/disputes", prefix: true },
  { label: "Messages", href: "/merchant/messages" },
  { label: "Notifications", href: "/merchant/notifications" },
  { label: "Settings", href: "/merchant/settings" },
];

// ---------------------------------------------------------------------------
// Admin portal (already shipped via layout grouping)
// ---------------------------------------------------------------------------

export const ADMIN_GROUPS: NavGroup[] = [
  {
    label: "Operations",
    items: [
      { label: "Cohorts", href: "/admin/cohorts" },
      { label: "Campaigns", href: "/admin/campaigns" },
      { label: "Users", href: "/admin/users" },
      { label: "Finance", href: "/admin/finance" },
    ],
  },
  {
    label: "Trust & Safety",
    items: [
      { label: "Verifications", href: "/admin/verifications" },
      { label: "Fraud", href: "/admin/fraud" },
      { label: "Disputes", href: "/admin/disputes" },
      { label: "Privacy Requests", href: "/admin/privacy-requests" },
    ],
  },
  {
    label: "Oracle",
    items: [{ label: "Manual Trigger", href: "/admin/oracle-trigger" }],
  },
  {
    label: "Audit",
    items: [{ label: "Audit Log", href: "/admin/audit-log" }],
  },
];

// ---------------------------------------------------------------------------
// Demo audiences (used by /demo picker)
// ---------------------------------------------------------------------------

export const DEMO_AUDIENCES: Array<{
  role: "creator" | "merchant" | "admin" | "consumer";
  label: string;
  blurb: string;
  dest: string;
  accent: string;
}> = [
  {
    role: "creator",
    label: "Creator",
    blurb:
      "Apply to campaigns, draft posts, track earnings, move through the 6-tier ladder.",
    dest: "/creator/dashboard",
    accent: "#c1121f",
  },
  {
    role: "merchant",
    label: "Merchant",
    blurb:
      "Launch a campaign, print QR stickers, see redemptions flow into the ground-truth layer.",
    dest: "/merchant/dashboard",
    accent: "#003049",
  },
  {
    role: "admin",
    label: "Admin (ops)",
    blurb:
      "Moderation queues, oracle decisions, privacy requests, every Trust & Safety surface.",
    dest: "/admin",
    accent: "#780000",
  },
  {
    role: "consumer",
    label: "Consumer",
    blurb:
      "Scan a sample QR, walk the consent picker, see the FTC disclosure and data-rights flow.",
    dest: "/scan/qr-bsc-001",
    accent: "#669bbc",
  },
];
