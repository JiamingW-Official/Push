// Push Admin — Mock Campaign Data
// Extends DEMO_CAMPAIGNS with admin-specific fields.
// Used by admin API routes and admin UI pages.

import {
  DEMO_CAMPAIGNS,
  type DemoCampaign,
  type CreatorTier,
} from "@/lib/demo-data";

// ---------------------------------------------------------------------------
// Admin-specific types
// ---------------------------------------------------------------------------

export type AdminCampaignStatus =
  | "draft"
  | "pending"
  | "active"
  | "paused"
  | "completed"
  | "flagged";

export type AdminFlag = {
  id: string;
  type: "fraud" | "compliance" | "content" | "budget" | "geo";
  severity: "low" | "medium" | "high";
  description: string;
  raised_at: string;
  raised_by: string;
};

export type ApprovalCheckItem = {
  id: string;
  label: string;
  passed: boolean;
  note?: string;
};

export type AdminApplicant = {
  id: string;
  creator_id: string;
  creator_name: string;
  creator_handle: string;
  creator_tier: CreatorTier;
  creator_score: number;
  creator_followers: number;
  status: "pending" | "accepted" | "rejected";
  milestone:
    | "accepted"
    | "scheduled"
    | "visited"
    | "proof_submitted"
    | "content_published"
    | "verified"
    | "settled";
  applied_at: string;
  proof_url?: string;
  content_url?: string;
};

export type VerifiedVisit = {
  id: string;
  creator_id: string;
  creator_name: string;
  qr_code: string;
  scanned_at: string;
  verified: boolean;
  lat: number;
  lng: number;
};

export type AdminNote = {
  id: string;
  author: string;
  body: string;
  created_at: string;
};

export type AdminCampaign = Omit<DemoCampaign, "status"> & {
  // Widened status to include all admin statuses (overrides DemoCampaign "active")
  status: AdminCampaignStatus;
  // Admin metadata
  admin_status: AdminCampaignStatus;
  review_submitted_at?: string;
  reviewed_at?: string;
  reviewed_by?: string;
  review_notes?: string;
  flags: AdminFlag[];
  approval_checklist: ApprovalCheckItem[];
  applicants: AdminApplicant[];
  verified_visits: VerifiedVisit[];
  spend_total: number;
  budget_cap: number;
  dispute_ids: string[];
  internal_notes: AdminNote[];
};

// ---------------------------------------------------------------------------
// Approval checklist factory
// ---------------------------------------------------------------------------

function makeChecklist(
  compliance: boolean,
  content: boolean,
  geo: boolean,
  budget: boolean,
  notes: Partial<
    Record<"compliance" | "content" | "geo" | "budget", string>
  > = {},
): ApprovalCheckItem[] {
  return [
    {
      id: "compliance",
      label: "Compliance — No prohibited content or restricted claims",
      passed: compliance,
      note: notes.compliance,
    },
    {
      id: "content",
      label: "Content — Brief is clear, achievable, and platform-safe",
      passed: content,
      note: notes.content,
    },
    {
      id: "geo",
      label: "Geo — Location verified within Push service area",
      passed: geo,
      note: notes.geo,
    },
    {
      id: "budget",
      label: "Budget — Payout within tier limits, merchant balance sufficient",
      passed: budget,
      note: notes.budget,
    },
  ];
}

// ---------------------------------------------------------------------------
// Admin campaigns — 8 original (from DEMO_CAMPAIGNS) + 20 new pending/flagged
// ---------------------------------------------------------------------------

const BASE_APPLICANTS: AdminApplicant[] = [
  {
    id: "app-a001",
    creator_id: "c-001",
    creator_name: "Sofia Martinez",
    creator_handle: "@sofiainyc",
    creator_tier: "explorer",
    creator_score: 47,
    creator_followers: 3100,
    status: "accepted",
    milestone: "proof_submitted",
    applied_at: "2026-04-08T10:20:00Z",
    proof_url: "https://www.instagram.com/reel/demo-proof-1",
  },
  {
    id: "app-a002",
    creator_id: "c-002",
    creator_name: "James Liu",
    creator_handle: "@jamesliu.eats",
    creator_tier: "operator",
    creator_score: 68,
    creator_followers: 5800,
    status: "accepted",
    milestone: "settled",
    applied_at: "2026-04-06T14:10:00Z",
    content_url: "https://www.instagram.com/reel/demo-content-2",
  },
  {
    id: "app-a003",
    creator_id: "c-003",
    creator_name: "Alex Chen",
    creator_handle: "@alexchen.nyc",
    creator_tier: "operator",
    creator_score: 71,
    creator_followers: 4200,
    status: "accepted",
    milestone: "accepted",
    applied_at: "2026-04-10T09:15:00Z",
  },
];

const EMPTY_VISITS: VerifiedVisit[] = [];

const makeVisit = (
  id: string,
  creator_id: string,
  creator_name: string,
  days_ago: number,
  lat: number,
  lng: number,
): VerifiedVisit => ({
  id,
  creator_id,
  creator_name,
  qr_code: `QR-${id.toUpperCase()}`,
  scanned_at: new Date(Date.now() - days_ago * 86400000).toISOString(),
  verified: true,
  lat,
  lng,
});

// ---------------------------------------------------------------------------
// Original 8 campaigns — active status, all checks passed
// ---------------------------------------------------------------------------

const ORIGINAL_CAMPAIGNS: AdminCampaign[] = DEMO_CAMPAIGNS.map((c, i) => ({
  ...c,
  status: "active" as AdminCampaignStatus,
  admin_status: "active" as AdminCampaignStatus,
  reviewed_at: "2026-04-02T10:00:00Z",
  reviewed_by: "admin@push.nyc",
  flags: [],
  approval_checklist: makeChecklist(true, true, true, true),
  applicants: i === 0 ? BASE_APPLICANTS : BASE_APPLICANTS.slice(0, 2),
  verified_visits:
    i < 3
      ? [
          makeVisit(`v-${i}-001`, "c-001", "Sofia Martinez", 3, c.lat, c.lng),
          makeVisit(`v-${i}-002`, "c-002", "James Liu", 5, c.lat, c.lng),
        ]
      : EMPTY_VISITS,
  spend_total: c.payout * (c.spots_total - c.spots_remaining),
  budget_cap: c.payout * c.spots_total + 50,
  dispute_ids: [],
  internal_notes: [
    {
      id: `note-${i}-001`,
      author: "admin@push.nyc",
      body: "Auto-approved — merchant in good standing, brief reviewed.",
      created_at: "2026-04-02T10:00:00Z",
    },
  ],
}));

// ---------------------------------------------------------------------------
// 20 new pending / flagged campaigns
// ---------------------------------------------------------------------------

const PENDING_CAMPAIGNS: AdminCampaign[] = [
  {
    id: "admin-camp-001",
    merchant_id: "m-admin-001",
    title: "Brunch Story Series — Williamsburg",
    description:
      "Capture 6 Stories covering our weekend brunch spread, mimosas, and rooftop views at Lola's Bistro.",
    payout: 55,
    spots_total: 6,
    spots_remaining: 6,
    deadline: "2026-05-01T23:59:00Z",
    created_at: "2026-04-15T09:00:00Z",
    status: "pending",
    admin_status: "pending",
    review_submitted_at: "2026-04-15T09:00:00Z",
    commission_enabled: false,
    difficulty: "standard",
    difficulty_multiplier: 1.0,
    lat: 40.7176,
    lng: -73.9562,
    category: "Food & Drink",
    business_name: "Lola's Bistro",
    business_address: "232 Bedford Ave, Brooklyn, NY 11211",
    requirements: ["Min 6 Story frames", "Tag @lolasbistrobk", "Post same day"],
    tier_required: "explorer",
    flags: [],
    approval_checklist: makeChecklist(true, true, true, false, {
      budget: "Merchant balance not yet confirmed.",
    }),
    applicants: [],
    verified_visits: [],
    spend_total: 0,
    budget_cap: 330,
    dispute_ids: [],
    internal_notes: [],
  },
  {
    id: "admin-camp-002",
    merchant_id: "m-admin-002",
    title: "Cold Brew Launch — UES",
    description:
      "Filmable launch event for our new nitrogen cold brew line. Walk-through Reel, 60 seconds minimum.",
    payout: 80,
    spots_total: 4,
    spots_remaining: 4,
    deadline: "2026-04-28T23:59:00Z",
    created_at: "2026-04-14T14:30:00Z",
    status: "pending",
    admin_status: "pending",
    review_submitted_at: "2026-04-14T14:30:00Z",
    commission_enabled: false,
    difficulty: "premium",
    difficulty_multiplier: 1.3,
    lat: 40.7749,
    lng: -73.9549,
    category: "Food & Drink",
    business_name: "Drip & Roast UES",
    business_address: "1472 Lexington Ave, New York, NY 10128",
    requirements: ["Min 60 seconds", "Tag @dripandroastnyc", "Post within 48h"],
    tier_required: "operator",
    flags: [],
    approval_checklist: makeChecklist(true, false, true, true, {
      content:
        "Brief references 'best cold brew in NYC' — requires substantiation or amendment.",
    }),
    applicants: [],
    verified_visits: [],
    spend_total: 0,
    budget_cap: 320,
    dispute_ids: [],
    internal_notes: [],
  },
  {
    id: "admin-camp-003",
    merchant_id: "m-admin-003",
    title: "Yoga Studio Open House — Park Slope",
    description:
      "Cover our open-house weekend with a peaceful Reel: studio tour, community vibe, class highlights.",
    payout: 40,
    spots_total: 5,
    spots_remaining: 5,
    deadline: "2026-05-03T23:59:00Z",
    created_at: "2026-04-15T11:00:00Z",
    status: "pending",
    admin_status: "pending",
    review_submitted_at: "2026-04-15T11:00:00Z",
    commission_enabled: false,
    difficulty: "standard",
    difficulty_multiplier: 1.0,
    lat: 40.6728,
    lng: -73.9772,
    category: "Fitness",
    business_name: "Roots & Rise Yoga",
    business_address: "514 5th Ave, Brooklyn, NY 11215",
    requirements: [
      "Include class footage",
      "Tag @rootsandriseyoga",
      "48h post window",
    ],
    tier_required: "seed",
    flags: [],
    approval_checklist: makeChecklist(true, true, true, true),
    applicants: [],
    verified_visits: [],
    spend_total: 0,
    budget_cap: 200,
    dispute_ids: [],
    internal_notes: [],
  },
  {
    id: "admin-camp-004",
    merchant_id: "m-admin-004",
    title: "Skincare Routine Reel — Nolita",
    description:
      "Feature our hero serum in a 60-second morning routine Reel. Products provided free.",
    payout: 90,
    spots_total: 3,
    spots_remaining: 3,
    deadline: "2026-04-30T23:59:00Z",
    created_at: "2026-04-16T08:00:00Z",
    status: "pending",
    admin_status: "pending",
    review_submitted_at: "2026-04-16T08:00:00Z",
    commission_enabled: true,
    difficulty: "premium",
    difficulty_multiplier: 1.3,
    lat: 40.7239,
    lng: -73.9961,
    category: "Beauty",
    business_name: "Lumin Skin Lab",
    business_address: "55 Spring St, New York, NY 10012",
    requirements: [
      "Feature hero serum",
      "Tag @luminskinnlita",
      "Post within 72h",
    ],
    tier_required: "proven",
    flags: [],
    approval_checklist: makeChecklist(false, true, true, true, {
      compliance:
        "Medical efficacy claim detected — 'clinically proven to reduce wrinkles'. Needs disclaimer or removal.",
    }),
    applicants: [],
    verified_visits: [],
    spend_total: 0,
    budget_cap: 270,
    dispute_ids: [],
    internal_notes: [],
  },
  {
    id: "admin-camp-005",
    merchant_id: "m-admin-005",
    title: "Pop-up Dinner — Greenpoint",
    description:
      "Cover our monthly pop-up tasting dinner. Atmosphere, dishes, reactions — full 90-second Reel.",
    payout: 150,
    spots_total: 4,
    spots_remaining: 4,
    deadline: "2026-05-05T23:59:00Z",
    created_at: "2026-04-16T13:00:00Z",
    status: "pending",
    admin_status: "pending",
    review_submitted_at: "2026-04-16T13:00:00Z",
    commission_enabled: true,
    difficulty: "complex",
    difficulty_multiplier: 1.6,
    lat: 40.7315,
    lng: -73.9543,
    category: "Food & Drink",
    business_name: "Atelier Table",
    business_address: "108 Green St, Brooklyn, NY 11222",
    requirements: [
      "Min 90 seconds",
      "Tag @ateliertable",
      "Post within 24h of event",
    ],
    tier_required: "closer",
    flags: [],
    approval_checklist: makeChecklist(true, true, false, true, {
      geo: "Address partially outside verified Push coverage zone — requires manual override.",
    }),
    applicants: [],
    verified_visits: [],
    spend_total: 0,
    budget_cap: 600,
    dispute_ids: [],
    internal_notes: [],
  },
  {
    id: "admin-camp-006",
    merchant_id: "m-admin-006",
    title: "Vintage Finds Haul — LES",
    description:
      "Tour our curated vintage section and film a haul Reel — 3+ items, price tags visible.",
    payout: 35,
    spots_total: 8,
    spots_remaining: 8,
    deadline: "2026-04-29T23:59:00Z",
    created_at: "2026-04-13T10:00:00Z",
    status: "pending",
    admin_status: "pending",
    review_submitted_at: "2026-04-13T10:00:00Z",
    commission_enabled: false,
    difficulty: "standard",
    difficulty_multiplier: 1.0,
    lat: 40.7196,
    lng: -73.9897,
    category: "Fashion",
    business_name: "Thread & Soul Vintage",
    business_address: "166 Orchard St, New York, NY 10002",
    requirements: [
      "Show 3+ items",
      "Include price tags",
      "Tag @threadandsoulnyc",
    ],
    tier_required: "explorer",
    flags: [],
    approval_checklist: makeChecklist(true, true, true, true),
    applicants: [],
    verified_visits: [],
    spend_total: 0,
    budget_cap: 280,
    dispute_ids: [],
    internal_notes: [],
  },
  {
    id: "admin-camp-007",
    merchant_id: "m-admin-007",
    title: "Cocktail Menu Reveal — West Village",
    description:
      "Be first to reveal our summer cocktail menu. Film the pour, the garnish, the vibe.",
    payout: 65,
    spots_total: 5,
    spots_remaining: 5,
    deadline: "2026-05-10T23:59:00Z",
    created_at: "2026-04-14T17:00:00Z",
    status: "pending",
    admin_status: "pending",
    review_submitted_at: "2026-04-14T17:00:00Z",
    commission_enabled: false,
    difficulty: "standard",
    difficulty_multiplier: 1.0,
    lat: 40.7342,
    lng: -74.0045,
    category: "Food & Drink",
    business_name: "Clover & Rye",
    business_address: "49 Grove St, New York, NY 10014",
    requirements: [
      "Feature 2+ cocktails",
      "Tag @cloverandrye",
      "Post within 48h",
    ],
    tier_required: "explorer",
    flags: [],
    approval_checklist: makeChecklist(true, true, true, true),
    applicants: [],
    verified_visits: [],
    spend_total: 0,
    budget_cap: 325,
    dispute_ids: [],
    internal_notes: [],
  },
  {
    id: "admin-camp-008",
    merchant_id: "m-admin-008",
    title: "Mural Reveal — Bushwick",
    description:
      "Document the unveiling of our new exterior mural. Street-style Reel — no scripted narration.",
    payout: 25,
    spots_total: 10,
    spots_remaining: 10,
    deadline: "2026-04-25T23:59:00Z",
    created_at: "2026-04-15T08:30:00Z",
    status: "pending",
    admin_status: "pending",
    review_submitted_at: "2026-04-15T08:30:00Z",
    commission_enabled: false,
    difficulty: "standard",
    difficulty_multiplier: 1.0,
    lat: 40.7049,
    lng: -73.9232,
    category: "Lifestyle",
    business_name: "Wallplay Bushwick",
    business_address: "56 Wyckoff Ave, Brooklyn, NY 11237",
    requirements: [
      "No scripted voiceover",
      "Tag @wallplaynyc",
      "Post day of reveal",
    ],
    tier_required: "seed",
    flags: [],
    approval_checklist: makeChecklist(true, true, true, true),
    applicants: [],
    verified_visits: [],
    spend_total: 0,
    budget_cap: 250,
    dispute_ids: [],
    internal_notes: [],
  },
  {
    id: "admin-camp-009",
    merchant_id: "m-admin-009",
    title: "Fitness Challenge Reel — DUMBO",
    description:
      "30-day fitness challenge kickoff. Film a 45-second Reel of your first class and results.",
    payout: 45,
    spots_total: 6,
    spots_remaining: 6,
    deadline: "2026-05-15T23:59:00Z",
    created_at: "2026-04-16T09:00:00Z",
    status: "pending",
    admin_status: "pending",
    review_submitted_at: "2026-04-16T09:00:00Z",
    commission_enabled: false,
    difficulty: "standard",
    difficulty_multiplier: 1.0,
    lat: 40.7033,
    lng: -73.9882,
    category: "Fitness",
    business_name: "Iron Quarter DUMBO",
    business_address: "28 Jay St, Brooklyn, NY 11201",
    requirements: [
      "Min 45 seconds",
      "Tag @ironquarterdumbo",
      "Post within 72h",
    ],
    tier_required: "seed",
    flags: [],
    approval_checklist: makeChecklist(true, true, true, true),
    applicants: [],
    verified_visits: [],
    spend_total: 0,
    budget_cap: 270,
    dispute_ids: [],
    internal_notes: [],
  },
  {
    id: "admin-camp-010",
    merchant_id: "m-admin-010",
    title: "New Menu Drop — Astoria",
    description:
      "We just updated our entire menu. Get in before anyone else and film an honest walk-through.",
    payout: 30,
    spots_total: 8,
    spots_remaining: 8,
    deadline: "2026-05-02T23:59:00Z",
    created_at: "2026-04-15T12:00:00Z",
    status: "pending",
    admin_status: "pending",
    review_submitted_at: "2026-04-15T12:00:00Z",
    commission_enabled: false,
    difficulty: "standard",
    difficulty_multiplier: 1.0,
    lat: 40.7721,
    lng: -73.9302,
    category: "Food & Drink",
    business_name: "Mikra Greek Kitchen",
    business_address: "31-18 Broadway, Astoria, NY 11106",
    requirements: ["Feature 4+ dishes", "Tag @mikagreek", "Post within 48h"],
    tier_required: "seed",
    flags: [],
    approval_checklist: makeChecklist(true, true, true, true),
    applicants: [],
    verified_visits: [],
    spend_total: 0,
    budget_cap: 240,
    dispute_ids: [],
    internal_notes: [],
  },
  // ---------------------------------------------------------------------------
  // 10 FLAGGED campaigns — various flag types
  // ---------------------------------------------------------------------------
  {
    id: "admin-flag-001",
    merchant_id: "m-flag-001",
    title: "Supplement Stack Review — Midtown",
    description:
      "Review our pre-workout and protein stack in a gym selfie-style Reel. Products shipped to you.",
    payout: 120,
    spots_total: 5,
    spots_remaining: 5,
    deadline: "2026-04-30T23:59:00Z",
    created_at: "2026-04-10T10:00:00Z",
    status: "flagged",
    admin_status: "flagged",
    review_submitted_at: "2026-04-10T10:00:00Z",
    reviewed_at: "2026-04-11T09:00:00Z",
    reviewed_by: "admin@push.nyc",
    commission_enabled: true,
    difficulty: "premium",
    difficulty_multiplier: 1.3,
    lat: 40.7549,
    lng: -73.984,
    category: "Fitness",
    business_name: "PeakForm Nutrition",
    business_address: "510 W 42nd St, New York, NY 10036",
    requirements: [
      "Feature 3 products",
      "Tag @peakformnyc",
      "Must include ingredient highlight",
    ],
    tier_required: "operator",
    flags: [
      {
        id: "flag-f001-a",
        type: "compliance",
        severity: "high",
        description:
          "Campaign brief includes unsubstantiated health claims ('burns fat 3x faster'). FTC violation risk.",
        raised_at: "2026-04-11T09:00:00Z",
        raised_by: "admin@push.nyc",
      },
    ],
    approval_checklist: makeChecklist(false, true, true, true, {
      compliance:
        "Unsubstantiated health claims detected. Awaiting merchant revision.",
    }),
    applicants: [],
    verified_visits: [],
    spend_total: 0,
    budget_cap: 600,
    dispute_ids: [],
    internal_notes: [
      {
        id: "note-flag001",
        author: "admin@push.nyc",
        body: "Flagged for FTC compliance. Notified merchant — awaiting revised brief. Do not activate.",
        created_at: "2026-04-11T09:05:00Z",
      },
    ],
  },
  {
    id: "admin-flag-002",
    merchant_id: "m-flag-002",
    title: "Crypto Wallet Promo — Financial District",
    description:
      "Promote our new crypto wallet app with a 60-second explainer Reel. $50 referral bonus per install.",
    payout: 200,
    spots_total: 10,
    spots_remaining: 10,
    deadline: "2026-05-01T23:59:00Z",
    created_at: "2026-04-09T14:00:00Z",
    status: "flagged",
    admin_status: "flagged",
    review_submitted_at: "2026-04-09T14:00:00Z",
    reviewed_at: "2026-04-10T11:00:00Z",
    reviewed_by: "admin@push.nyc",
    commission_enabled: true,
    difficulty: "complex",
    difficulty_multiplier: 1.6,
    lat: 40.7074,
    lng: -74.0113,
    category: "Lifestyle",
    business_name: "ChainPay NYC",
    business_address: "48 Wall St, New York, NY 10005",
    requirements: [
      "Mention 'referral bonus'",
      "Include app store link",
      "Tag @chainpaynyc",
    ],
    tier_required: "proven",
    flags: [
      {
        id: "flag-f002-a",
        type: "compliance",
        severity: "high",
        description:
          "Financial product promotion — requires SEC/CFTC disclaimers. Referral bonus structure may violate SEC rules.",
        raised_at: "2026-04-10T11:00:00Z",
        raised_by: "admin@push.nyc",
      },
      {
        id: "flag-f002-b",
        type: "content",
        severity: "medium",
        description:
          "Referral payout structure not disclosed transparently in brief per FTC influencer guidelines.",
        raised_at: "2026-04-10T11:05:00Z",
        raised_by: "compliance@push.nyc",
      },
    ],
    approval_checklist: makeChecklist(false, false, true, true, {
      compliance: "Financial product — SEC/CFTC review required.",
      content: "Referral structure non-compliant with FTC.",
    }),
    applicants: [],
    verified_visits: [],
    spend_total: 0,
    budget_cap: 2000,
    dispute_ids: ["dispute-002"],
    internal_notes: [
      {
        id: "note-flag002",
        author: "compliance@push.nyc",
        body: "Escalated to legal. High-risk financial product. Recommend suspension pending legal review.",
        created_at: "2026-04-10T11:10:00Z",
      },
    ],
  },
  {
    id: "admin-flag-003",
    merchant_id: "m-flag-003",
    title: "Suspicious QR Volume — Multiple Locations",
    description:
      "Creator-side fraud detected: QR scans originated from a single IP in rapid succession across 5 locations.",
    payout: 75,
    spots_total: 8,
    spots_remaining: 3,
    deadline: "2026-04-20T23:59:00Z",
    created_at: "2026-04-05T08:00:00Z",
    status: "flagged",
    admin_status: "flagged",
    review_submitted_at: "2026-04-05T08:00:00Z",
    reviewed_at: "2026-04-12T16:00:00Z",
    reviewed_by: "fraud@push.nyc",
    commission_enabled: false,
    difficulty: "standard",
    difficulty_multiplier: 1.0,
    lat: 40.7291,
    lng: -73.9965,
    category: "Food & Drink",
    business_name: "Nomad Noodle Bar",
    business_address: "1 E 28th St, New York, NY 10016",
    requirements: [
      "Post within 24h",
      "Tag @nomadnoodlenyc",
      "QR scan required",
    ],
    tier_required: "operator",
    flags: [
      {
        id: "flag-f003-a",
        type: "fraud",
        severity: "high",
        description:
          "47 QR scans in 8 minutes from single IP. Geo-verification failed for 38 scans. Suspected bot or proxy.",
        raised_at: "2026-04-12T16:00:00Z",
        raised_by: "fraud@push.nyc",
      },
    ],
    approval_checklist: makeChecklist(true, true, false, true, {
      geo: "Geo-verification failed for 38 of 47 QR scans. Location tampering suspected.",
    }),
    applicants: BASE_APPLICANTS,
    verified_visits: [
      makeVisit(
        "v-flag003-001",
        "c-001",
        "Sofia Martinez",
        6,
        40.7291,
        -73.9965,
      ),
      makeVisit("v-flag003-002", "c-002", "James Liu", 6, 40.7291, -73.9965),
    ],
    spend_total: 375,
    budget_cap: 600,
    dispute_ids: ["dispute-003"],
    internal_notes: [
      {
        id: "note-flag003",
        author: "fraud@push.nyc",
        body: "Fraud pattern confirmed. Suspending payouts for flagged scans. Escalating to merchant for review.",
        created_at: "2026-04-12T16:15:00Z",
      },
    ],
  },
  {
    id: "admin-flag-004",
    merchant_id: "m-flag-004",
    title: "Alcohol Brand Promo — Murray Hill",
    description:
      "Promote our new whiskey line. No age gate language required per merchant.",
    payout: 85,
    spots_total: 6,
    spots_remaining: 6,
    deadline: "2026-05-05T23:59:00Z",
    created_at: "2026-04-13T09:00:00Z",
    status: "flagged",
    admin_status: "flagged",
    review_submitted_at: "2026-04-13T09:00:00Z",
    reviewed_at: "2026-04-14T10:00:00Z",
    reviewed_by: "compliance@push.nyc",
    commission_enabled: false,
    difficulty: "standard",
    difficulty_multiplier: 1.0,
    lat: 40.748,
    lng: -73.9787,
    category: "Food & Drink",
    business_name: "Barrel & Grain NYC",
    business_address: "339 3rd Ave, New York, NY 10010",
    requirements: [
      "Feature product prominently",
      "Tag @barrelandgrainnyc",
      "Must look aspirational",
    ],
    tier_required: "explorer",
    flags: [
      {
        id: "flag-f004-a",
        type: "compliance",
        severity: "medium",
        description:
          "Alcohol promotion without mandatory age-gate language or 21+ disclaimer. Platform policy violation.",
        raised_at: "2026-04-14T10:00:00Z",
        raised_by: "compliance@push.nyc",
      },
    ],
    approval_checklist: makeChecklist(false, true, true, true, {
      compliance: "Missing 21+ age disclaimer required for alcohol promotions.",
    }),
    applicants: [],
    verified_visits: [],
    spend_total: 0,
    budget_cap: 510,
    dispute_ids: [],
    internal_notes: [
      {
        id: "note-flag004",
        author: "compliance@push.nyc",
        body: "Merchant notified. Must add '21+ only' and 'drink responsibly' language before activation.",
        created_at: "2026-04-14T10:05:00Z",
      },
    ],
  },
  {
    id: "admin-flag-005",
    merchant_id: "m-flag-005",
    title: "Budget Overdraft Risk — Brooklyn Heights",
    description:
      "Premium campaign with payout exceeding merchant's verified balance.",
    payout: 500,
    spots_total: 10,
    spots_remaining: 10,
    deadline: "2026-05-20T23:59:00Z",
    created_at: "2026-04-14T15:00:00Z",
    status: "flagged",
    admin_status: "flagged",
    review_submitted_at: "2026-04-14T15:00:00Z",
    reviewed_at: "2026-04-15T09:00:00Z",
    reviewed_by: "finance@push.nyc",
    commission_enabled: true,
    difficulty: "complex",
    difficulty_multiplier: 1.6,
    lat: 40.6952,
    lng: -73.9945,
    category: "Lifestyle",
    business_name: "The Promenade Club",
    business_address: "1 Pierrepont Plaza, Brooklyn, NY 11201",
    requirements: ["Complex brief", "Tag @promenadeclub", "Post within 24h"],
    tier_required: "partner",
    flags: [
      {
        id: "flag-f005-a",
        type: "budget",
        severity: "high",
        description:
          "Campaign total payout ($5,000) exceeds merchant's verified account balance ($1,200). Risk of non-payment.",
        raised_at: "2026-04-15T09:00:00Z",
        raised_by: "finance@push.nyc",
      },
    ],
    approval_checklist: makeChecklist(true, true, true, false, {
      budget:
        "Total payout $5,000 exceeds merchant balance $1,200. Requires escrow top-up.",
    }),
    applicants: [],
    verified_visits: [],
    spend_total: 0,
    budget_cap: 5000,
    dispute_ids: [],
    internal_notes: [
      {
        id: "note-flag005",
        author: "finance@push.nyc",
        body: "Merchant informed of balance shortfall. Campaign blocked until escrow funded.",
        created_at: "2026-04-15T09:10:00Z",
      },
    ],
  },
  {
    id: "admin-flag-006",
    merchant_id: "m-flag-006",
    title: "MLM Downline Recruitment — Jackson Heights",
    description:
      "Creators asked to recruit other creators to join the 'team' and earn commission on recruits.",
    payout: 30,
    spots_total: 20,
    spots_remaining: 20,
    deadline: "2026-05-01T23:59:00Z",
    created_at: "2026-04-12T11:00:00Z",
    status: "flagged",
    admin_status: "flagged",
    review_submitted_at: "2026-04-12T11:00:00Z",
    reviewed_at: "2026-04-12T14:00:00Z",
    reviewed_by: "compliance@push.nyc",
    commission_enabled: true,
    difficulty: "standard",
    difficulty_multiplier: 1.0,
    lat: 40.7482,
    lng: -73.8948,
    category: "Lifestyle",
    business_name: "Vitality Circle NYC",
    business_address: "80-00 Roosevelt Ave, Jackson Heights, NY 11372",
    requirements: [
      "Recruit 3 other creators",
      "Tag @vitalitycirclenyc",
      "Use referral link",
    ],
    tier_required: "seed",
    flags: [
      {
        id: "flag-f006-a",
        type: "compliance",
        severity: "high",
        description:
          "Campaign structure resembles MLM pyramid scheme — creators compensated for recruiting others. FTC/NY AG violation risk.",
        raised_at: "2026-04-12T14:00:00Z",
        raised_by: "compliance@push.nyc",
      },
    ],
    approval_checklist: makeChecklist(false, false, true, true, {
      compliance: "MLM structure violates platform TOS and FTC guidelines.",
      content:
        "Recruiting requirement is not campaign content — not a valid Push brief.",
    }),
    applicants: [],
    verified_visits: [],
    spend_total: 0,
    budget_cap: 600,
    dispute_ids: ["dispute-006"],
    internal_notes: [
      {
        id: "note-flag006",
        author: "compliance@push.nyc",
        body: "Immediate suspension. Merchant account under review. Escalated to legal.",
        created_at: "2026-04-12T14:05:00Z",
      },
    ],
  },
  {
    id: "admin-flag-007",
    merchant_id: "m-flag-007",
    title: "Duplicate Submission — Midwood",
    description:
      "Identical campaign submitted 3 times by same merchant to bypass per-merchant campaign limits.",
    payout: 25,
    spots_total: 12,
    spots_remaining: 12,
    deadline: "2026-04-28T23:59:00Z",
    created_at: "2026-04-13T16:00:00Z",
    status: "flagged",
    admin_status: "flagged",
    review_submitted_at: "2026-04-13T16:00:00Z",
    reviewed_at: "2026-04-14T09:00:00Z",
    reviewed_by: "admin@push.nyc",
    commission_enabled: false,
    difficulty: "standard",
    difficulty_multiplier: 1.0,
    lat: 40.6263,
    lng: -73.9616,
    category: "Food & Drink",
    business_name: "Spice Route Midwood",
    business_address: "1612 Coney Island Ave, Brooklyn, NY 11230",
    requirements: ["Post Reel", "Tag @spiceroutemidwood", "Include menu items"],
    tier_required: "seed",
    flags: [
      {
        id: "flag-f007-a",
        type: "fraud",
        severity: "medium",
        description:
          "Duplicate campaign detected — same title/description submitted 3 times from same merchant ID within 2 hours.",
        raised_at: "2026-04-14T09:00:00Z",
        raised_by: "admin@push.nyc",
      },
    ],
    approval_checklist: makeChecklist(true, true, true, true),
    applicants: [],
    verified_visits: [],
    spend_total: 0,
    budget_cap: 300,
    dispute_ids: [],
    internal_notes: [
      {
        id: "note-flag007",
        author: "admin@push.nyc",
        body: "Duplicate submissions removed. Merchant warned — second offense will result in account suspension.",
        created_at: "2026-04-14T09:05:00Z",
      },
    ],
  },
  {
    id: "admin-flag-008",
    merchant_id: "m-flag-008",
    title: "Unverified Geo — Flushing",
    description:
      "Campaign location listed as Flushing, Queens — address geocoding failed.",
    payout: 40,
    spots_total: 5,
    spots_remaining: 5,
    deadline: "2026-05-08T23:59:00Z",
    created_at: "2026-04-15T10:30:00Z",
    status: "flagged",
    admin_status: "flagged",
    review_submitted_at: "2026-04-15T10:30:00Z",
    reviewed_at: "2026-04-16T08:00:00Z",
    reviewed_by: "admin@push.nyc",
    commission_enabled: false,
    difficulty: "standard",
    difficulty_multiplier: 1.0,
    lat: 40.7675,
    lng: -73.833,
    category: "Food & Drink",
    business_name: "Golden Palace Flushing",
    business_address: "133-47 39th Ave, Flushing, NY 11354",
    requirements: [
      "Visit in person",
      "Tag @goldenpalaceflushing",
      "Post within 48h",
    ],
    tier_required: "seed",
    flags: [
      {
        id: "flag-f008-a",
        type: "geo",
        severity: "medium",
        description:
          "Geocoding API returned 0 results for submitted address. Cannot verify location within Push service area.",
        raised_at: "2026-04-16T08:00:00Z",
        raised_by: "admin@push.nyc",
      },
    ],
    approval_checklist: makeChecklist(true, true, false, true, {
      geo: "Address geocoding failed. Merchant must confirm physical location.",
    }),
    applicants: [],
    verified_visits: [],
    spend_total: 0,
    budget_cap: 200,
    dispute_ids: [],
    internal_notes: [
      {
        id: "note-flag008",
        author: "admin@push.nyc",
        body: "Requested merchant to re-submit verified address with Google Maps pin.",
        created_at: "2026-04-16T08:05:00Z",
      },
    ],
  },
  {
    id: "admin-flag-009",
    merchant_id: "m-flag-009",
    title: "Political Content — Astoria",
    description:
      "Campaign asks creators to promote a candidate's local campaign event as a 'lifestyle experience'.",
    payout: 60,
    spots_total: 8,
    spots_remaining: 8,
    deadline: "2026-05-01T23:59:00Z",
    created_at: "2026-04-11T13:00:00Z",
    status: "flagged",
    admin_status: "flagged",
    review_submitted_at: "2026-04-11T13:00:00Z",
    reviewed_at: "2026-04-11T15:00:00Z",
    reviewed_by: "compliance@push.nyc",
    commission_enabled: false,
    difficulty: "standard",
    difficulty_multiplier: 1.0,
    lat: 40.7712,
    lng: -73.93,
    category: "Lifestyle",
    business_name: "Community First Events",
    business_address: "30-31 Steinway St, Astoria, NY 11103",
    requirements: [
      "Attend event",
      "Tag @communityfirstevents",
      "Post within 24h",
    ],
    tier_required: "explorer",
    flags: [
      {
        id: "flag-f009-a",
        type: "compliance",
        severity: "high",
        description:
          "Content is political advertising disguised as lifestyle content. Platform TOS §4.2 violation.",
        raised_at: "2026-04-11T15:00:00Z",
        raised_by: "compliance@push.nyc",
      },
    ],
    approval_checklist: makeChecklist(false, false, true, true, {
      compliance: "Political advertising prohibited. Platform TOS §4.2.",
      content:
        "Misleading framing — political event presented as lifestyle campaign.",
    }),
    applicants: [],
    verified_visits: [],
    spend_total: 0,
    budget_cap: 480,
    dispute_ids: ["dispute-009"],
    internal_notes: [
      {
        id: "note-flag009",
        author: "compliance@push.nyc",
        body: "Rejected and merchant notified. Political campaigns strictly prohibited. Merchant account flagged for review.",
        created_at: "2026-04-11T15:05:00Z",
      },
    ],
  },
  {
    id: "admin-flag-010",
    merchant_id: "m-flag-010",
    title: "Off-Platform Payment Request — Harlem",
    description:
      "Merchant brief instructs creators to DM for 'extra bonus payment via Venmo' after posting.",
    payout: 20,
    spots_total: 15,
    spots_remaining: 15,
    deadline: "2026-04-30T23:59:00Z",
    created_at: "2026-04-14T12:00:00Z",
    status: "flagged",
    admin_status: "flagged",
    review_submitted_at: "2026-04-14T12:00:00Z",
    reviewed_at: "2026-04-14T14:00:00Z",
    reviewed_by: "admin@push.nyc",
    commission_enabled: false,
    difficulty: "standard",
    difficulty_multiplier: 1.0,
    lat: 40.8116,
    lng: -73.9465,
    category: "Food & Drink",
    business_name: "Harlem Roots Cafe",
    business_address: "2268 Adam Clayton Powell Jr Blvd, New York, NY 10027",
    requirements: ["Post Reel", "Tag @harlemrootscafe", "DM for bonus"],
    tier_required: "seed",
    flags: [
      {
        id: "flag-f010-a",
        type: "fraud",
        severity: "medium",
        description:
          "Brief solicits off-platform payment ('DM for Venmo bonus'). Violates platform exclusivity TOS §7.1.",
        raised_at: "2026-04-14T14:00:00Z",
        raised_by: "admin@push.nyc",
      },
    ],
    approval_checklist: makeChecklist(true, false, true, true, {
      content:
        "Off-platform payment solicitation embedded in brief — TOS §7.1 violation.",
    }),
    applicants: [],
    verified_visits: [],
    spend_total: 0,
    budget_cap: 300,
    dispute_ids: [],
    internal_notes: [
      {
        id: "note-flag010",
        author: "admin@push.nyc",
        body: "Merchant warned about off-platform payment solicitation. Campaign suspended. Second offense = ban.",
        created_at: "2026-04-14T14:05:00Z",
      },
    ],
  },
];

// ---------------------------------------------------------------------------
// Combined export
// ---------------------------------------------------------------------------

export const ADMIN_CAMPAIGNS: AdminCampaign[] = [
  ...ORIGINAL_CAMPAIGNS,
  ...PENDING_CAMPAIGNS,
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

export function getAdminCampaignById(id: string): AdminCampaign | undefined {
  return ADMIN_CAMPAIGNS.find((c) => c.id === id);
}

export function getAdminCampaignsByStatus(
  status: AdminCampaignStatus,
): AdminCampaign[] {
  return ADMIN_CAMPAIGNS.filter((c) => c.admin_status === status);
}

export const ADMIN_CAMPAIGN_STATUS_LABELS: Record<AdminCampaignStatus, string> =
  {
    draft: "Draft",
    pending: "Pending Review",
    active: "Active",
    paused: "Paused",
    completed: "Completed",
    flagged: "Flagged",
  };
