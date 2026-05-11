// Push — Command Palette Registry
//
// Audience-aware static registry powering the global Cmd+K palette
// (components/feedback/CommandPalette.tsx). Items are typed once here and
// filtered at runtime by the current role (merchant / creator / admin /
// any) detected from `usePathname()`.
//
// Keep this file dependency-free (no React imports) so it can be consumed
// from server contexts later if needed. Icons stay as ReactNode for now —
// the consumer side only renders them on the client.

import type { ReactNode } from "react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type CommandGroup = "Pages" | "Actions" | "Recent" | "Settings";
export type CommandAudience = "merchant" | "creator" | "admin" | "any";

export interface CommandItem {
  id: string;
  label: string;
  keywords?: string[];
  group: CommandGroup;
  icon?: ReactNode;
  href?: string;
  onAction?: () => void;
  shortcut?: string[];
  audience?: CommandAudience;
}

// ---------------------------------------------------------------------------
// Registry — ~30 entries spanning merchant / creator / admin surfaces
// ---------------------------------------------------------------------------

export const COMMAND_REGISTRY: CommandItem[] = [
  // ── Merchant Pages ────────────────────────────────────────────────
  {
    id: "m-dash",
    label: "Dashboard",
    keywords: ["home", "today", "overview"],
    group: "Pages",
    href: "/merchant/dashboard",
    audience: "merchant",
  },
  {
    id: "m-camps",
    label: "Campaigns",
    keywords: ["briefs", "gigs"],
    group: "Pages",
    href: "/merchant/campaigns",
    audience: "merchant",
  },
  {
    id: "m-applicants",
    label: "Applicants",
    keywords: ["pool", "creators", "pipeline"],
    group: "Pages",
    href: "/merchant/applicants",
    audience: "merchant",
  },
  {
    id: "m-qr",
    label: "QR Codes",
    keywords: ["posters", "attribution"],
    group: "Pages",
    href: "/merchant/qr-codes",
    audience: "merchant",
  },
  {
    id: "m-redeem",
    label: "Redeem",
    keywords: ["scan", "checkin"],
    group: "Pages",
    href: "/merchant/redeem",
    audience: "merchant",
  },
  {
    id: "m-locations",
    label: "Locations",
    keywords: ["spots", "stores", "venues"],
    group: "Pages",
    href: "/merchant/locations",
    audience: "merchant",
  },
  {
    id: "m-messages",
    label: "Messages",
    keywords: ["inbox", "chat"],
    group: "Pages",
    href: "/merchant/messages",
    audience: "merchant",
  },
  {
    id: "m-billing",
    label: "Billing",
    keywords: ["wallet", "invoices"],
    group: "Pages",
    href: "/merchant/billing",
    audience: "merchant",
  },
  {
    id: "m-payments",
    label: "Payments",
    keywords: ["payouts", "transactions"],
    group: "Pages",
    href: "/merchant/payments",
    audience: "merchant",
  },
  {
    id: "m-settings",
    label: "Settings",
    group: "Settings",
    href: "/merchant/settings",
    audience: "merchant",
  },

  // ── Creator Pages ─────────────────────────────────────────────────
  /* v10.1 — 6-item creator nav (Today / Find / Money / Inbox / Me / Stats).
     Inbox + Stats restored per user feedback. */
  {
    id: "c-work",
    label: "Today",
    keywords: ["home", "in flight", "now", "needs you", "pipeline", "briefing"],
    group: "Pages",
    href: "/creator/work",
    audience: "creator",
  },
  {
    id: "c-discover",
    label: "Find",
    keywords: ["discover", "browse", "explore", "new gigs", "merchants"],
    group: "Pages",
    href: "/creator/discover",
    audience: "creator",
  },
  {
    id: "c-money",
    label: "Money",
    keywords: ["earnings", "payouts", "wallet", "cash out", "tax", "methods"],
    group: "Pages",
    href: "/creator/money",
    audience: "creator",
  },
  {
    id: "c-inbox",
    label: "Inbox",
    keywords: ["messages", "comms", "merchant thread", "notifications"],
    group: "Pages",
    href: "/creator/inbox",
    audience: "creator",
  },
  {
    id: "c-me",
    label: "Me",
    keywords: ["profile", "tier", "portfolio", "settings"],
    group: "Pages",
    href: "/creator/me",
    audience: "creator",
  },
  {
    id: "c-stats",
    label: "Stats",
    keywords: ["analytics", "performance", "scans", "engagement"],
    group: "Pages",
    href: "/creator/analytics",
    audience: "creator",
  },

  // ── Admin Pages ───────────────────────────────────────────────────
  {
    id: "a-cohorts",
    label: "Cohorts",
    keywords: ["users", "segments"],
    group: "Pages",
    href: "/admin/cohorts",
    audience: "admin",
  },
  {
    id: "a-users",
    label: "Users",
    keywords: ["accounts"],
    group: "Pages",
    href: "/admin/users",
    audience: "admin",
  },
  {
    id: "a-verify",
    label: "Verifications",
    keywords: ["kyc", "identity"],
    group: "Pages",
    href: "/admin/verifications",
    audience: "admin",
  },
  {
    id: "a-fraud",
    label: "Fraud",
    keywords: ["abuse", "anti-fraud"],
    group: "Pages",
    href: "/admin/fraud",
    audience: "admin",
  },
  {
    id: "a-disputes",
    label: "Disputes",
    keywords: ["claims"],
    group: "Pages",
    href: "/admin/disputes",
    audience: "admin",
  },
  {
    id: "a-privacy",
    label: "Privacy",
    keywords: ["dsar", "ccpa", "gdpr"],
    group: "Pages",
    href: "/admin/privacy-requests",
    audience: "admin",
  },
  {
    id: "a-oracle",
    label: "Oracle",
    keywords: ["verification ai"],
    group: "Pages",
    href: "/admin/oracle-trigger",
    audience: "admin",
  },
  {
    id: "a-audit",
    label: "Audit Log",
    keywords: ["events", "history"],
    group: "Pages",
    href: "/admin/audit-log",
    audience: "admin",
  },

  // ── Actions — Merchant ────────────────────────────────────────────
  {
    id: "act-m-new-camp",
    label: "Create new campaign",
    keywords: ["new", "brief"],
    group: "Actions",
    href: "/merchant/campaigns/new",
    audience: "merchant",
  },
  {
    id: "act-m-new-loc",
    label: "Add new location",
    keywords: ["new", "spot"],
    group: "Actions",
    href: "/merchant/locations/new",
    audience: "merchant",
  },
  {
    id: "act-m-dispute",
    label: "File a dispute",
    keywords: ["new", "claim"],
    group: "Actions",
    href: "/merchant/disputes?new=1",
    audience: "merchant",
  },
  {
    id: "act-m-topup",
    label: "Top up wallet",
    keywords: ["billing", "credit", "funds"],
    group: "Actions",
    href: "/merchant/billing?topup=1",
    audience: "merchant",
  },

  // ── Actions — Creator ─────────────────────────────────────────────
  {
    id: "act-c-submit",
    label: "Submit content",
    keywords: ["post", "deliver"],
    group: "Actions",
    href: "/creator/work?submit=1",
    audience: "creator",
  },
  {
    id: "act-c-withdraw",
    label: "Withdraw earnings",
    keywords: ["cashout", "payout"],
    group: "Actions",
    href: "/creator/money/methods",
    audience: "creator",
  },

  // ── Settings (cross-audience) ─────────────────────────────────────
  {
    id: "set-account-m",
    label: "Account",
    group: "Settings",
    href: "/merchant/settings",
    audience: "merchant",
  },
  {
    id: "set-account-c",
    label: "Account",
    group: "Settings",
    href: "/creator/settings/account",
    audience: "creator",
  },
  {
    id: "set-notifs-m",
    label: "Notifications preferences",
    keywords: ["alerts", "email"],
    group: "Settings",
    href: "/merchant/settings/notifications",
    audience: "merchant",
  },
  {
    id: "set-notifs-c",
    label: "Notifications preferences",
    keywords: ["alerts", "email"],
    group: "Settings",
    href: "/creator/settings/notifications",
    audience: "creator",
  },
  {
    id: "set-signout",
    label: "Sign out",
    keywords: ["logout", "exit"],
    group: "Settings",
    href: "/api/auth/signout",
    audience: "any",
  },
];

// ---------------------------------------------------------------------------
// Recent — sessionStorage-backed list of last-navigated command ids
// ---------------------------------------------------------------------------

export const RECENT_KEY = "push_cmd_palette_recent";
export const RECENT_MAX = 5;
export const MAX_RESULTS = 12;

// ---------------------------------------------------------------------------
// Filter + rank
// ---------------------------------------------------------------------------

const GROUP_ORDER: CommandGroup[] = ["Recent", "Pages", "Actions", "Settings"];

export function detectAudience(pathname: string): CommandAudience {
  if (pathname.startsWith("/merchant")) return "merchant";
  if (pathname.startsWith("/creator")) return "creator";
  if (pathname.startsWith("/admin")) return "admin";
  return "any";
}

interface RankedItem {
  item: CommandItem;
  score: number;
}

/**
 * Score = base relevance (0-10) + recent bonus (+5) + audience bonus (+3).
 * Filters: every space-split term must hit label OR a keyword (substring).
 */
export function filterAndRank(
  query: string,
  audience: CommandAudience,
  recentIds: string[],
): CommandItem[] {
  const q = query.trim().toLowerCase();
  const recentSet = new Set(recentIds);
  const ranked: RankedItem[] = [];

  for (const item of COMMAND_REGISTRY) {
    // Audience filter: hide items targeted at OTHER roles. "any" + matching
    // role both pass through.
    if (
      item.audience &&
      item.audience !== "any" &&
      audience !== "any" &&
      item.audience !== audience
    ) {
      continue;
    }

    let score = 0;
    const label = item.label.toLowerCase();
    const haystack = `${label} ${(item.keywords ?? []).join(" ").toLowerCase()} ${item.group.toLowerCase()}`;

    if (q) {
      const terms = q.split(/\s+/).filter(Boolean);
      const allHit = terms.every((t) => haystack.includes(t));
      if (!allHit) continue;

      if (label === q) score = 10;
      else if (label.startsWith(q)) score = 8;
      else if (label.includes(q)) score = 6;
      else score = 4;
    } else {
      // Empty query: surface everything with a small base score.
      score = 1;
    }

    if (recentSet.has(item.id)) score += 5;
    if (item.audience && item.audience === audience) score += 3;

    ranked.push({ item, score });
  }

  ranked.sort((a, b) => b.score - a.score);
  return ranked.slice(0, MAX_RESULTS).map((r) => r.item);
}

/** Group an already-ranked list by section for render. Recent items
 *  (matched by id presence in `recentIds`) get hoisted into a synthetic
 *  Recent group so users see them first. */
export function groupForRender(
  items: CommandItem[],
  recentIds: string[],
): { group: CommandGroup; items: CommandItem[] }[] {
  const recentSet = new Set(recentIds);
  const buckets: Record<CommandGroup, CommandItem[]> = {
    Recent: [],
    Pages: [],
    Actions: [],
    Settings: [],
  };

  for (const item of items) {
    if (recentSet.has(item.id)) {
      buckets.Recent.push(item);
    } else {
      buckets[item.group].push(item);
    }
  }

  return GROUP_ORDER.filter((g) => buckets[g].length > 0).map((g) => ({
    group: g,
    items: buckets[g],
  }));
}
