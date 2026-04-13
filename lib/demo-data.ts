// Push Platform — Demo / Preview Mode Mock Data
// Provides realistic NYC-based data for investors, stakeholders, and unauthenticated users.

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type CreatorTier =
  | "seed"
  | "explorer"
  | "operator"
  | "proven"
  | "closer"
  | "partner";

export type DemoCreator = {
  id: string;
  user_id: string;
  name: string;
  instagram_handle: string;
  tiktok_handle?: string;
  location: string;
  lat: number;
  lng: number;
  bio: string;
  avatar_url: string;
  tier: CreatorTier;
  push_score: number;
  campaigns_completed: number;
  campaigns_accepted: number;
  earnings_total: number;
  earnings_pending: number;
  instagram_followers: number;
  tiktok_followers?: number;
};

export type DemoCampaign = {
  id: string;
  merchant_id: string;
  title: string;
  description: string;
  payout: number;
  spots_total: number;
  spots_remaining: number;
  deadline: string;
  created_at: string;
  status: "active";
  lat: number;
  lng: number;
  category: string;
  business_name: string;
  business_address: string;
  requirements: string[];
  tier_required: CreatorTier;
  /** Commission payout enabled — true for Operator+ tier campaigns */
  commission_enabled: boolean;
  /** Execution complexity of the campaign */
  difficulty: "standard" | "premium" | "complex";
  /** Payout multiplier corresponding to difficulty */
  difficulty_multiplier: 1.0 | 1.3 | 1.6;
  image?: string;
};

export type DemoApplication = {
  id: string;
  campaign_id: string;
  creator_id: string;
  status: "pending" | "accepted" | "rejected" | "withdrawn";
  milestone:
    | "accepted"
    | "scheduled"
    | "visited"
    | "proof_submitted"
    | "content_published"
    | "verified"
    | "settled";
  payout: number;
  created_at: string;
  campaign_title: string;
  merchant_name: string;
  business_address: string;
  deadline: string;
  category: string;
};

export type DemoPayout = {
  id: string;
  campaign_title: string;
  merchant_name: string;
  amount: number;
  commission_amount: number;
  payout_type: "base" | "commission" | "bonus";
  status: "completed" | "pending" | "processing";
  paid_at: string | null;
  created_at: string;
};

// ---------------------------------------------------------------------------
// Tier metadata
// ---------------------------------------------------------------------------

export const TIER_LABELS: Record<CreatorTier, string> = {
  seed: "Seed",
  explorer: "Explorer",
  operator: "Operator",
  proven: "Proven",
  closer: "Closer",
  partner: "Partner",
};

/** Inclusive [min, max] Push Score range for each tier */
export const TIER_SCORE_RANGE: Record<CreatorTier, [number, number]> = {
  seed: [0, 39],
  explorer: [40, 59],
  operator: [60, 74],
  proven: [75, 84],
  closer: [85, 92],
  partner: [93, 100],
};

/** Platform commission rate (%) charged on payouts */
export const TIER_COMMISSION: Record<CreatorTier, number> = {
  seed: 0,
  explorer: 0,
  operator: 3,
  proven: 5,
  closer: 7,
  partner: 10,
};

/** Payout speed / settlement window */
export const TIER_PAYOUT_SPEED: Record<CreatorTier, string> = {
  seed: "Instant redemption",
  explorer: "T+3",
  operator: "T+2",
  proven: "T+1",
  closer: "Same-day",
  partner: "Instant",
};

// ---------------------------------------------------------------------------
// Demo Creator — Alex Chen, Operator tier, Lower Manhattan
// ---------------------------------------------------------------------------

export const DEMO_CREATOR: DemoCreator = {
  id: "demo-creator-001",
  user_id: "demo-user-001",
  name: "Alex Chen",
  instagram_handle: "@alexchen.nyc",
  tiktok_handle: "@alexchen_creates",
  location: "Lower Manhattan, New York",
  lat: 40.7128,
  lng: -74.006,
  bio: "NYC food & lifestyle micro-creator based in Lower Manhattan. I spotlight hidden gems, new openings, and everyday eats across the five boroughs — honest takes, real vibes.",
  avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=AlexChen",
  tier: "operator",
  push_score: 71,
  campaigns_completed: 12,
  campaigns_accepted: 14,
  earnings_total: 340,
  earnings_pending: 75,
  instagram_followers: 4200,
  tiktok_followers: 2800,
};

// ---------------------------------------------------------------------------
// Demo Campaigns — 8 active NYC campaigns
// ---------------------------------------------------------------------------

export const DEMO_CAMPAIGNS: DemoCampaign[] = [
  {
    id: "demo-campaign-001",
    merchant_id: "demo-merchant-001",
    title: "Free Latte for a 30-Second Reel",
    description:
      "Come in, order any latte, and capture a 30-second Reel showing your experience — from ordering to that first sip. Free product provided; no cash payout.",
    payout: 0,
    spots_total: 12,
    spots_remaining: 8,
    deadline: "2026-04-20T23:59:00Z",
    created_at: "2026-04-01T10:00:00Z",
    status: "active",
    commission_enabled: false,
    difficulty: "standard",
    difficulty_multiplier: 1.0,
    lat: 40.7265,
    lng: -74.0044,
    category: "Food & Drink",
    business_name: "Blank Street Coffee",
    business_address: "284 W Broadway, New York, NY 10013",
    requirements: [
      "Post within 48h of visit",
      "Tag @blankstreetcoffee",
      "Min 30 seconds, no cuts",
    ],
    tier_required: "seed",
  },
  {
    id: "demo-campaign-002",
    merchant_id: "demo-merchant-002",
    title: "TikTok Walk-through — Spring Menu",
    description:
      "Walk us through Superiority Burger's newly launched spring menu. Show 3+ items, share your honest thoughts, and make it feel like a friend recommendation.",
    payout: 35,
    spots_total: 5,
    spots_remaining: 3,
    deadline: "2026-04-22T23:59:00Z",
    created_at: "2026-04-02T09:00:00Z",
    status: "active",
    commission_enabled: false,
    difficulty: "standard",
    difficulty_multiplier: 1.0,
    lat: 40.7306,
    lng: -73.9879,
    category: "Food & Drink",
    business_name: "Superiority Burger",
    business_address: "119 Avenue A, New York, NY 10009",
    requirements: [
      "Feature at least 3 menu items",
      "Tag @superiorityburger",
      "Post within 72h of visit",
    ],
    tier_required: "explorer",
  },
  {
    id: "demo-campaign-003",
    merchant_id: "demo-merchant-003",
    title: "Instagram Stories — Grand Opening",
    description:
      "Flamingo Estate NYC just opened its first Manhattan outpost. Cover the grand opening with a 5-frame Instagram Stories series — decor, product displays, and the vibe.",
    payout: 75,
    spots_total: 8,
    spots_remaining: 5,
    deadline: "2026-04-17T23:59:00Z",
    created_at: "2026-04-03T11:00:00Z",
    status: "active",
    commission_enabled: false,
    difficulty: "standard",
    difficulty_multiplier: 1.0,
    lat: 40.7193,
    lng: -73.9987,
    category: "Lifestyle",
    business_name: "Flamingo Estate NYC",
    business_address: "67 Gansevoort St, New York, NY 10014",
    requirements: [
      "Minimum 5 Story frames",
      "Tag @flamingoestate",
      "Include location sticker",
    ],
    tier_required: "explorer",
  },
  {
    id: "demo-campaign-004",
    merchant_id: "demo-merchant-004",
    title: "Before & After — Brow Lamination",
    description:
      "Show the full brow lamination journey at Brow Theory. We want a clear before shot, in-treatment clips, and the finished result — ideally a Reel or TikTok.",
    payout: 50,
    spots_total: 4,
    spots_remaining: 2,
    deadline: "2026-04-25T23:59:00Z",
    created_at: "2026-04-04T08:30:00Z",
    status: "active",
    commission_enabled: true,
    difficulty: "premium",
    difficulty_multiplier: 1.3,
    lat: 40.7219,
    lng: -73.9956,
    category: "Beauty",
    business_name: "Brow Theory",
    business_address: "38 Prince St, New York, NY 10012",
    requirements: [
      "Include clear before & after",
      "Tag @browtheorynyc",
      "Post within 48h of treatment",
    ],
    tier_required: "operator",
  },
  {
    id: "demo-campaign-005",
    merchant_id: "demo-merchant-005",
    title: "GRWM Reel — Morning Routine",
    description:
      "Partner with Glossier Flagship to create a Get Ready With Me Reel featuring products from their Spring 2026 lineup. Show the full routine, from skincare to finish.",
    payout: 120,
    spots_total: 6,
    spots_remaining: 4,
    deadline: "2026-04-17T23:59:00Z",
    created_at: "2026-04-05T09:45:00Z",
    status: "active",
    commission_enabled: true,
    difficulty: "premium",
    difficulty_multiplier: 1.3,
    lat: 40.7248,
    lng: -74.0018,
    category: "Beauty",
    business_name: "Glossier Flagship",
    business_address: "123 Lafayette St, New York, NY 10013",
    requirements: [
      "Feature min 3 Glossier products",
      "Tag @glossier",
      "Min 45 seconds, posted within 48h",
    ],
    tier_required: "operator",
  },
  {
    id: "demo-campaign-006",
    merchant_id: "demo-merchant-006",
    title: "Croissant Review — Weekend Special",
    description:
      "Le Bec Fin Bakery wants authentic weekend croissant reviews. Grab the weekend special, film your honest first bite, and share the vibe of the bakery on a Saturday morning.",
    payout: 20,
    spots_total: 10,
    spots_remaining: 6,
    deadline: "2026-04-19T23:59:00Z",
    created_at: "2026-04-01T07:00:00Z",
    status: "active",
    commission_enabled: false,
    difficulty: "standard",
    difficulty_multiplier: 1.0,
    lat: 40.7175,
    lng: -74.0012,
    category: "Food & Drink",
    business_name: "Le Bec Fin Bakery",
    business_address: "214 Hudson St, New York, NY 10013",
    requirements: [
      "Must be filmed on a weekend",
      "Tag @lebecfinnyc",
      "Post within 24h",
    ],
    tier_required: "seed",
  },
  {
    id: "demo-campaign-007",
    merchant_id: "demo-merchant-007",
    title: "Unboxing Reel — New Streetwear Drop",
    description:
      "KITH NYC is dropping a limited streetwear collection. We need creators to film an in-store unboxing Reel showcasing the packaging, pieces, and the in-store experience.",
    payout: 199,
    spots_total: 3,
    spots_remaining: 2,
    deadline: "2026-04-30T23:59:00Z",
    created_at: "2026-04-06T13:00:00Z",
    status: "active",
    commission_enabled: true,
    difficulty: "complex",
    difficulty_multiplier: 1.6,
    lat: 40.7236,
    lng: -73.9965,
    category: "Fashion",
    business_name: "KITH NYC",
    business_address: "233 Lafayette St, New York, NY 10012",
    requirements: [
      "Feature at least 3 pieces from the drop",
      "Tag @kith",
      "Post within 24h of filming",
    ],
    tier_required: "proven",
  },
  {
    id: "demo-campaign-008",
    merchant_id: "demo-merchant-008",
    title: "Matcha Review + Ambiance Video",
    description:
      "Capture the full Cha Cha Matcha experience — the neon-lit interior, the ceremony of the pour, and your honest matcha review. Perfect for a chill weekday afternoon post.",
    payout: 25,
    spots_total: 12,
    spots_remaining: 10,
    deadline: "2026-04-28T23:59:00Z",
    created_at: "2026-04-03T14:00:00Z",
    status: "active",
    commission_enabled: false,
    difficulty: "standard",
    difficulty_multiplier: 1.0,
    lat: 40.7242,
    lng: -74.0051,
    category: "Food & Drink",
    business_name: "Cha Cha Matcha",
    business_address: "373 Broadway, New York, NY 10013",
    requirements: [
      "Include interior ambiance footage",
      "Tag @chachamatcha",
      "Min 15 seconds",
    ],
    tier_required: "seed",
  },
];

// ---------------------------------------------------------------------------
// Demo Applications — 4 applications at different stages
// ---------------------------------------------------------------------------

export const DEMO_APPLICATIONS: DemoApplication[] = [
  {
    // Active — accepted, waiting for creator to visit
    id: "demo-application-001",
    campaign_id: "demo-campaign-005",
    creator_id: "demo-creator-001",
    status: "accepted",
    milestone: "accepted",
    payout: 120,
    created_at: "2026-04-10T09:15:00Z",
    campaign_title: "GRWM Reel — Morning Routine",
    merchant_name: "Glossier Flagship",
    business_address: "123 Lafayette St, New York, NY 10013",
    deadline: "2026-04-17T23:59:00Z",
    category: "Beauty",
  },
  {
    // In progress — proof submitted, awaiting verification
    id: "demo-application-002",
    campaign_id: "demo-campaign-002",
    creator_id: "demo-creator-001",
    status: "accepted",
    milestone: "proof_submitted",
    payout: 35,
    created_at: "2026-04-07T14:30:00Z",
    campaign_title: "TikTok Walk-through — Spring Menu",
    merchant_name: "Superiority Burger",
    business_address: "119 Avenue A, New York, NY 10009",
    deadline: "2026-04-22T23:59:00Z",
    category: "Food & Drink",
  },
  {
    // Completed — settled and paid out
    id: "demo-application-003",
    campaign_id: "demo-campaign-006",
    creator_id: "demo-creator-001",
    status: "accepted",
    milestone: "settled",
    payout: 20,
    created_at: "2026-03-29T10:00:00Z",
    campaign_title: "Croissant Review — Weekend Special",
    merchant_name: "Le Bec Fin Bakery",
    business_address: "214 Hudson St, New York, NY 10013",
    deadline: "2026-04-05T23:59:00Z",
    category: "Food & Drink",
  },
  {
    // Pending — awaiting merchant review
    id: "demo-application-004",
    campaign_id: "demo-campaign-003",
    creator_id: "demo-creator-001",
    status: "pending",
    milestone: "accepted",
    payout: 75,
    created_at: "2026-04-11T16:45:00Z",
    campaign_title: "Instagram Stories — Grand Opening",
    merchant_name: "Flamingo Estate NYC",
    business_address: "67 Gansevoort St, New York, NY 10014",
    deadline: "2026-04-17T23:59:00Z",
    category: "Lifestyle",
  },
];

// ---------------------------------------------------------------------------
// Demo Payouts — 5 payout records (4 completed, 1 pending)
// ---------------------------------------------------------------------------

export const DEMO_PAYOUTS: DemoPayout[] = [
  {
    id: "demo-payout-001",
    campaign_title: "Croissant Review — Weekend Special",
    merchant_name: "Le Bec Fin Bakery",
    amount: 20,
    commission_amount: 0.6, // 3% operator commission
    payout_type: "base",
    status: "completed",
    paid_at: "2026-04-06T11:00:00Z",
    created_at: "2026-04-05T23:59:00Z",
  },
  {
    id: "demo-payout-002",
    campaign_title: "Matcha Review + Ambiance Video",
    merchant_name: "Cha Cha Matcha",
    amount: 25,
    commission_amount: 0.75,
    payout_type: "base",
    status: "completed",
    paid_at: "2026-04-03T09:30:00Z",
    created_at: "2026-04-02T23:59:00Z",
  },
  {
    id: "demo-payout-003",
    campaign_title: "Before & After — Brow Lamination",
    merchant_name: "Brow Theory",
    amount: 85,
    commission_amount: 2.55, // 3% on base, plus bonus
    payout_type: "base",
    status: "completed",
    paid_at: "2026-03-28T14:15:00Z",
    created_at: "2026-03-27T23:59:00Z",
  },
  {
    id: "demo-payout-004",
    campaign_title: "Before & After — Brow Lamination",
    merchant_name: "Brow Theory",
    amount: 4.25,
    commission_amount: 0,
    payout_type: "commission",
    status: "completed",
    paid_at: "2026-03-28T14:15:00Z",
    created_at: "2026-03-27T23:59:00Z",
  },
  {
    id: "demo-payout-005",
    campaign_title: "Instagram Stories — Grand Opening",
    merchant_name: "Flamingo Estate NYC",
    amount: 75,
    commission_amount: 2.25,
    payout_type: "base",
    status: "pending",
    paid_at: null,
    created_at: "2026-04-11T16:45:00Z",
  },
  {
    id: "pay-bonus-001",
    campaign_title: "Milestone Bonus",
    merchant_name: "Push Platform",
    amount: 15,
    commission_amount: 0,
    payout_type: "bonus",
    status: "completed",
    paid_at: "2026-04-01T12:00:00Z",
    created_at: "2026-04-01T11:00:00Z",
  },
];
