/**
 * Search index for the command palette. Static page list + dynamic
 * brands + recent gigs + actions. Each entry produces a navigable result.
 */

export type CommandItem = {
  id: string;
  group: "Pages" | "Brands" | "Recent gigs" | "Actions";
  label: string;
  hint?: string;
  /** Either an href to navigate to OR an action to invoke. */
  href?: string;
  onSelect?: () => void;
  keywords?: string[];
};

/* The 14 canonical creator routes (audit § P1-6 IA cleanup) plus the
   9 settings sub-cells. cmdk's fuzzy search ranks by character overlap. */
export const STATIC_PAGES: CommandItem[] = [
  {
    id: "today",
    group: "Pages",
    label: "Today",
    hint: "Daily briefing",
    href: "/creator/today",
  },
  {
    id: "gigs-invites",
    group: "Pages",
    label: "Invites",
    hint: "Pending offers",
    href: "/creator/gigs/invites",
    keywords: ["pending", "match"],
  },
  {
    id: "gigs-active",
    group: "Pages",
    label: "Active gigs",
    hint: "In flight",
    href: "/creator/gigs/active",
  },
  {
    id: "gigs-history",
    group: "Pages",
    label: "History",
    hint: "Past gigs + receipts",
    href: "/creator/gigs/history",
  },
  {
    id: "discover",
    group: "Pages",
    label: "Discover",
    hint: "Browse open campaigns",
    href: "/creator/discover",
    keywords: ["explore", "find"],
  },
  {
    id: "money",
    group: "Pages",
    label: "Money",
    hint: "Earnings, milestones, payouts, tax",
    href: "/creator/money",
    keywords: ["pay", "earnings", "cashout", "wallet", "tax"],
  },
  {
    id: "earnings",
    group: "Pages",
    label: "Earnings (legacy)",
    hint: "Balance + cashout deep view",
    href: "/creator/earnings",
    keywords: ["pay", "money", "cashout"],
  },
  {
    id: "analytics",
    group: "Pages",
    label: "Analytics",
    hint: "Stats + attribution",
    href: "/creator/analytics",
  },
  {
    id: "inbox",
    group: "Pages",
    label: "Inbox",
    hint: "Brand messages",
    href: "/creator/inbox",
  },
  {
    id: "leaderboard",
    group: "Pages",
    label: "Leaderboard",
    hint: "Tier rankings",
    href: "/creator/leaderboard",
  },
  {
    id: "settings",
    group: "Pages",
    label: "Settings",
    hint: "9 focused sections",
    href: "/creator/settings",
  },

  {
    id: "set-account",
    group: "Pages",
    label: "Settings · Account",
    href: "/creator/settings/account",
  },
  {
    id: "set-payments",
    group: "Pages",
    label: "Settings · Payments & tax",
    href: "/creator/settings/payments",
  },
  {
    id: "set-verify",
    group: "Pages",
    label: "Settings · Verification",
    href: "/creator/settings/verification",
  },
  {
    id: "set-prefs",
    group: "Pages",
    label: "Settings · Niches & geography",
    href: "/creator/settings/preferences",
  },
  {
    id: "set-notifs",
    group: "Pages",
    label: "Settings · Notifications",
    href: "/creator/settings/notifications",
  },
  {
    id: "set-privacy",
    group: "Pages",
    label: "Settings · Privacy & data",
    href: "/creator/settings/privacy",
  },
  {
    id: "set-disputes",
    group: "Pages",
    label: "Settings · Disputes",
    href: "/creator/settings/disputes",
  },
  {
    id: "set-conn",
    group: "Pages",
    label: "Settings · Connected accounts",
    href: "/creator/settings/connections",
  },
  {
    id: "set-help",
    group: "Pages",
    label: "Settings · Help & support",
    href: "/creator/settings/help",
  },
];

export const STATIC_ACTIONS: CommandItem[] = [
  {
    id: "act-cashout",
    group: "Actions",
    label: "Cash out",
    hint: "Open earnings → request payout",
    href: "/creator/earnings?cashout=open",
  },
  {
    id: "act-disclosure",
    group: "Actions",
    label: "Sign FTC disclosure",
    href: "/creator/settings/verification",
  },
  {
    id: "act-payment",
    group: "Actions",
    label: "Update payment method",
    href: "/creator/settings/payments",
  },
  {
    id: "act-support",
    group: "Actions",
    label: "Contact support",
    href: "/creator/settings/help",
  },
  {
    id: "act-privacy",
    group: "Actions",
    label: "Export my data (DSAR)",
    href: "/my-privacy",
  },
];

/** Recent-selection cache key in localStorage. */
export const RECENT_KEY = "push_cmdk_recent";
export const RECENT_MAX = 5;
