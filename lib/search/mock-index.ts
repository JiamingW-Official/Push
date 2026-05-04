// Push — Global Search Mock Index
// Builds a flat searchable list from DEMO_CAMPAIGNS + mock articles + page routes.

import { DEMO_CAMPAIGNS } from "@/lib/demo-data";

export type SearchResultType =
  | "campaign"
  | "creator"
  | "merchant"
  | "article"
  | "page";

export interface SearchItem {
  type: SearchResultType;
  id: string;
  title: string;
  subtitle: string;
  url: string;
  score: number; // relevance weight for ranking
  keywords?: string[]; // extra terms for fuzzy match
}

// ---------------------------------------------------------------------------
// Static page routes
// ---------------------------------------------------------------------------

const PAGE_ITEMS: SearchItem[] = [
  {
    type: "page",
    id: "page-home",
    title: "Home",
    subtitle: "Push — Pay Per Verified Visit",
    url: "/",
    score: 90,
    keywords: ["home", "landing", "main"],
  },
  {
    type: "page",
    id: "page-explore",
    title: "Explore Campaigns",
    subtitle: "Browse active campaigns near you",
    url: "/explore",
    score: 88,
    keywords: ["explore", "campaigns", "browse", "discover"],
  },
  {
    type: "page",
    id: "page-creator-dashboard",
    title: "Creator Dashboard",
    subtitle: "Your earnings, applications, and analytics",
    url: "/creator/dashboard",
    score: 85,
    keywords: ["dashboard", "creator", "earnings", "analytics"],
  },
  {
    type: "page",
    id: "page-creator-profile",
    title: "Creator Profile",
    subtitle: "Manage your profile and tier status",
    url: "/creator/profile",
    score: 80,
    keywords: ["profile", "creator", "tier", "settings"],
  },
  {
    type: "page",
    id: "page-merchant-dashboard",
    title: "Merchant Dashboard",
    subtitle: "Manage campaigns and track foot traffic",
    url: "/merchant/dashboard",
    score: 85,
    keywords: ["merchant", "dashboard", "business", "campaigns"],
  },
  {
    type: "page",
    id: "page-merchant-campaigns",
    title: "My Campaigns",
    subtitle: "Create and manage your active campaigns",
    url: "/merchant/campaigns",
    score: 82,
    keywords: ["merchant", "campaigns", "create", "manage"],
  },
  {
    type: "page",
    id: "page-merchant-analytics",
    title: "Merchant Analytics",
    subtitle: "QR attribution, visit tracking, and ROI",
    url: "/merchant/analytics",
    score: 78,
    keywords: ["analytics", "merchant", "qr", "attribution", "roi"],
  },
  {
    type: "page",
    id: "page-admin",
    title: "Admin Panel",
    subtitle: "Platform-wide management and moderation",
    url: "/admin",
    score: 70,
    keywords: ["admin", "panel", "management", "moderation"],
  },
  {
    type: "page",
    id: "page-pricing",
    title: "Pricing",
    subtitle: "$0 / $99 / Pro outcome-based / $349 — transparent plans",
    url: "/#pricing",
    score: 75,
    keywords: ["pricing", "plans", "cost", "subscription"],
  },
  {
    type: "page",
    id: "page-demo",
    title: "Live Demo",
    subtitle: "Try the Push platform without signing up",
    url: "/demo",
    score: 72,
    keywords: ["demo", "preview", "try", "sample"],
  },
];

// ---------------------------------------------------------------------------
// Help articles
// ---------------------------------------------------------------------------

const ARTICLE_ITEMS: SearchItem[] = [
  {
    type: "article",
    id: "article-qr-how",
    title: "How QR Code Attribution Works",
    subtitle: "Learn how Push tracks verified visits",
    url: "/#how-it-works",
    score: 82,
    keywords: ["qr", "attribution", "tracking", "verified", "visit"],
  },
  {
    type: "article",
    id: "article-tiers",
    title: "Creator Tier System Explained",
    subtitle: "Seed → Explorer → Operator → Proven → Closer → Partner",
    url: "/creator/dashboard",
    score: 80,
    keywords: [
      "tier",
      "seed",
      "explorer",
      "operator",
      "proven",
      "closer",
      "partner",
      "score",
    ],
  },
  {
    type: "article",
    id: "article-getting-started-creator",
    title: "Getting Started as a Creator",
    subtitle: "Apply, visit, post, and get paid",
    url: "/creator/dashboard",
    score: 78,
    keywords: ["getting started", "creator", "onboarding", "apply", "payout"],
  },
  {
    type: "article",
    id: "article-getting-started-merchant",
    title: "Getting Started as a Merchant",
    subtitle: "Launch your first campaign in minutes",
    url: "/merchant/dashboard",
    score: 78,
    keywords: ["getting started", "merchant", "campaign", "launch", "business"],
  },
  {
    type: "article",
    id: "article-payout",
    title: "How Payouts Work",
    subtitle: "Instant to T+3 depending on your tier",
    url: "/creator/dashboard",
    score: 75,
    keywords: ["payout", "payment", "settlement", "earnings", "withdraw"],
  },
  {
    type: "article",
    id: "article-push-score",
    title: "Understanding Your Push Score",
    subtitle: "0–100 trust score based on performance history",
    url: "/creator/dashboard",
    score: 74,
    keywords: ["push score", "trust", "score", "rating", "reputation"],
  },
  {
    type: "article",
    id: "article-proof-submission",
    title: "Submitting Content Proof",
    subtitle: "How to submit your post for verification",
    url: "/creator/dashboard",
    score: 72,
    keywords: ["proof", "submission", "content", "verification", "post"],
  },
  {
    type: "article",
    id: "article-anti-fraud",
    title: "Anti-Fraud & Platform Integrity",
    subtitle: "How Push prevents fake visits and abuse",
    url: "/#how-it-works",
    score: 68,
    keywords: ["fraud", "abuse", "integrity", "fake", "security"],
  },
];

// ---------------------------------------------------------------------------
// Mock creators
// ---------------------------------------------------------------------------

const CREATOR_ITEMS: SearchItem[] = [
  {
    type: "creator",
    id: "creator-alex-chen",
    title: "Alex Chen",
    subtitle: "Operator · @alexchen.nyc · Lower Manhattan",
    url: "/explore",
    score: 85,
    keywords: ["alex chen", "alexchen", "lower manhattan", "food", "lifestyle"],
  },
  {
    type: "creator",
    id: "creator-maya-rodriguez",
    title: "Maya Rodriguez",
    subtitle: "Closer · @mayaeatsnYC · Brooklyn",
    url: "/explore",
    score: 84,
    keywords: ["maya rodriguez", "mayaeatsnYC", "brooklyn", "food"],
  },
  {
    type: "creator",
    id: "creator-james-kim",
    title: "James Kim",
    subtitle: "Proven · @jamesk.nyc · Astoria",
    url: "/explore",
    score: 78,
    keywords: ["james kim", "jamesk.nyc", "astoria", "queens"],
  },
  {
    type: "creator",
    id: "creator-priya-patel",
    title: "Priya Patel",
    subtitle: "Partner · @priyaexploresNYC · Upper East Side",
    url: "/explore",
    score: 95,
    keywords: [
      "priya patel",
      "priyaexploresNYC",
      "upper east side",
      "lifestyle",
    ],
  },
  {
    type: "creator",
    id: "creator-marcus-johnson",
    title: "Marcus Johnson",
    subtitle: "Explorer · @marcusj.nyc · Harlem",
    url: "/explore",
    score: 55,
    keywords: ["marcus johnson", "marcusj.nyc", "harlem"],
  },
];

// ---------------------------------------------------------------------------
// Mock merchants
// ---------------------------------------------------------------------------

const MERCHANT_ITEMS: SearchItem[] = [
  {
    type: "merchant",
    id: "merchant-blank-street",
    title: "Blank Street Coffee",
    subtitle: "284 W Broadway, SoHo · Food & Drink",
    url: "/merchant/dashboard",
    score: 88,
    keywords: ["blank street", "coffee", "soho", "cafe"],
  },
  {
    type: "merchant",
    id: "merchant-superiority-burger",
    title: "Superiority Burger",
    subtitle: "119 Avenue A, East Village · Food & Drink",
    url: "/merchant/dashboard",
    score: 85,
    keywords: ["superiority burger", "burger", "east village", "plant based"],
  },
  {
    type: "merchant",
    id: "merchant-the-well",
    title: "The Well",
    subtitle: "512 W 22nd St, Chelsea · Wellness",
    url: "/merchant/dashboard",
    score: 82,
    keywords: ["the well", "wellness", "chelsea", "gym", "spa"],
  },
  {
    type: "merchant",
    id: "merchant-procell",
    title: "Procell NYC",
    subtitle: "167 Orchard St, Lower East Side · Fashion",
    url: "/merchant/dashboard",
    score: 80,
    keywords: ["procell", "nyc", "lower east side", "vintage", "fashion"],
  },
  {
    type: "merchant",
    id: "merchant-daily-provisions",
    title: "Daily Provisions",
    subtitle: "103 Greenwich Ave, West Village · Bakery",
    url: "/merchant/dashboard",
    score: 79,
    keywords: ["daily provisions", "bakery", "west village", "brunch"],
  },
];

// ---------------------------------------------------------------------------
// Campaign items — built from DEMO_CAMPAIGNS
// ---------------------------------------------------------------------------

function buildCampaignItems(): SearchItem[] {
  return DEMO_CAMPAIGNS.map((c) => ({
    type: "campaign" as SearchResultType,
    id: c.id,
    title: c.title,
    subtitle: `${c.business_name} · ${c.category}${c.payout > 0 ? ` · $${c.payout}` : " · Free product"}`,
    url: "/explore",
    score: 70,
    keywords: [
      c.title.toLowerCase(),
      c.business_name.toLowerCase(),
      c.category.toLowerCase(),
      c.business_address.toLowerCase(),
      c.tier_required,
    ],
  }));
}

// ---------------------------------------------------------------------------
// Full flat index
// ---------------------------------------------------------------------------

let _cachedIndex: SearchItem[] | null = null;

export function getSearchIndex(): SearchItem[] {
  if (_cachedIndex) return _cachedIndex;
  _cachedIndex = [
    ...buildCampaignItems(),
    ...CREATOR_ITEMS,
    ...MERCHANT_ITEMS,
    ...ARTICLE_ITEMS,
    ...PAGE_ITEMS,
  ];
  return _cachedIndex;
}

// ---------------------------------------------------------------------------
// Fuzzy search — simple Levenshtein + includes matching
// ---------------------------------------------------------------------------

function levenshtein(a: string, b: string): number {
  const m = a.length;
  const n = b.length;
  const dp: number[][] = Array.from({ length: m + 1 }, (_, i) =>
    Array.from({ length: n + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0)),
  );
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] =
        a[i - 1] === b[j - 1]
          ? dp[i - 1][j - 1]
          : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
    }
  }
  return dp[m][n];
}

function matchScore(item: SearchItem, query: string): number {
  const q = query.toLowerCase().trim();
  if (!q) return 0;

  const fields = [
    item.title.toLowerCase(),
    item.subtitle.toLowerCase(),
    ...(item.keywords ?? []),
  ];

  let best = 0;

  for (const field of fields) {
    // Exact include — highest weight
    if (field.includes(q)) {
      best = Math.max(best, 100);
      continue;
    }
    // Word-level includes
    const words = q.split(/\s+/);
    const wordMatches = words.filter((w) => field.includes(w)).length;
    if (wordMatches > 0) {
      best = Math.max(best, (wordMatches / words.length) * 80);
    }
    // Levenshtein on first 20 chars for short queries
    if (q.length <= 12) {
      const dist = levenshtein(
        q,
        field.slice(0, Math.min(field.length, q.length + 4)),
      );
      if (dist <= 2) {
        best = Math.max(best, 60 - dist * 15);
      }
    }
  }

  return best;
}

export type GroupedResults = Record<SearchResultType, SearchItem[]>;

export function searchIndex(query: string): GroupedResults {
  const q = query.trim();
  const empty: GroupedResults = {
    campaign: [],
    creator: [],
    merchant: [],
    article: [],
    page: [],
  };

  if (!q) return empty;

  const index = getSearchIndex();
  const scored = index
    .map((item) => ({ item, relevance: matchScore(item, q) }))
    .filter(({ relevance }) => relevance > 0)
    .sort((a, b) => b.relevance - a.relevance || b.item.score - a.item.score);

  const grouped: GroupedResults = { ...empty };
  const typeCount: Record<SearchResultType, number> = {
    campaign: 0,
    creator: 0,
    merchant: 0,
    article: 0,
    page: 0,
  };
  const MAX_PER_TYPE = 5;

  for (const { item } of scored) {
    if (typeCount[item.type] < MAX_PER_TYPE) {
      grouped[item.type].push(item);
      typeCount[item.type]++;
    }
  }

  return grouped;
}
