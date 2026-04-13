"use client";

import { createClient } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback, useMemo } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import "./dashboard.css";
import { FirstPaycheck } from "@/components/creator/FirstPaycheck";

const MapView = dynamic(() => import("@/components/layout/MapView"), {
  ssr: false,
  loading: () => (
    <div style={{ width: "100%", height: "100%", background: "#eae6e1" }} />
  ),
});

/* ── Demo mode detection ────────────────────────────────── */

function checkDemoMode(): boolean {
  if (typeof document === "undefined") return false;
  return document.cookie.includes("push-demo-role=creator");
}

/* ── Types ───────────────────────────────────────────────── */

type CreatorTier =
  | "seed"
  | "explorer"
  | "operator"
  | "proven"
  | "closer"
  | "partner";

type Creator = {
  id: string;
  name: string;
  instagram_handle?: string;
  location?: string;
  bio?: string;
  avatar_url?: string;
  tier: CreatorTier;
  push_score: number;
  campaigns_completed: number;
  campaigns_accepted: number;
  earnings_total: number;
  earnings_pending: number;
  instagram_followers?: number;
};

type Campaign = {
  id: string;
  title: string;
  business_name: string;
  business_address?: string;
  payout: number;
  spots_remaining: number;
  spots_total: number;
  deadline?: string | null;
  category?: string;
  image?: string;
  tier_required: CreatorTier;
  description?: string;
  requirements?: string[];
  lat: number;
  lng: number;
};

type Application = {
  id: string;
  campaign_id: string;
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
  deadline?: string;
  category?: string;
};

type Payout = {
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

type DashView = "discover" | "campaigns" | "earnings";

type SortKey = "newest" | "highest-pay" | "ending-soon" | "most-spots";

/* ── Constants ──────────────────────────────────────────── */

const TIER_LABELS: Record<CreatorTier, string> = {
  seed: "Seed",
  explorer: "Explorer",
  operator: "Operator",
  proven: "Proven",
  closer: "Closer",
  partner: "Partner",
};

const TIER_ORDER: CreatorTier[] = [
  "seed",
  "explorer",
  "operator",
  "proven",
  "closer",
  "partner",
];

const TIER_SCORE_THRESHOLDS: Record<CreatorTier, number> = {
  seed: 0,
  explorer: 40,
  operator: 60,
  proven: 75,
  closer: 88,
  partner: 95,
};

const MILESTONES: Application["milestone"][] = [
  "accepted",
  "scheduled",
  "visited",
  "proof_submitted",
  "content_published",
  "verified",
  "settled",
];

const MILESTONE_LABELS: Record<Application["milestone"], string> = {
  accepted: "Accepted",
  scheduled: "Scheduled",
  visited: "Visited",
  proof_submitted: "Proof",
  content_published: "Published",
  verified: "Verified",
  settled: "Settled",
};

const CATEGORIES = [
  "All",
  "Food",
  "Coffee",
  "Beauty",
  "Retail",
  "Fitness",
  "Lifestyle",
];

const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: "newest", label: "Newest" },
  { key: "highest-pay", label: "Pay" },
  { key: "ending-soon", label: "Ending" },
  { key: "most-spots", label: "Spots" },
];

const NYC: [number, number] = [40.7218, -74.001];

/* ── Demo data ──────────────────────────────────────────── */

const DEMO_CREATOR: Creator = {
  id: "demo-creator-001",
  name: "Alex Chen",
  instagram_handle: "alexcheneats",
  location: "Lower East Side, NYC",
  bio: "NYC food & lifestyle creator. Always hunting for the next hidden gem.",
  tier: "operator",
  push_score: 71,
  campaigns_completed: 12,
  campaigns_accepted: 14,
  earnings_total: 130,
  earnings_pending: 75,
  instagram_followers: 4200,
};

const DEMO_CAMPAIGNS: Campaign[] = [
  // ── Manhattan: Chelsea ──────────────────────────────────
  {
    id: "camp-001",
    title: "Morning Ritual Campaign",
    business_name: "Blank Street Coffee",
    business_address: "5 W 19th St, New York, NY 10011",
    payout: 0,
    spots_remaining: 12,
    spots_total: 20,
    deadline: "2026-04-30",
    category: "Coffee",
    image:
      "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&h=300&fit=crop",
    tier_required: "seed",
    description:
      "Visit any Blank Street location, enjoy a drink, and share your experience. Perfect for building your portfolio.",
    requirements: [
      "1 Instagram story tagging @blankstreetcoffee",
      "Visit during peak hours (7-10am)",
    ],
    lat: 40.7395,
    lng: -73.994,
  },
  {
    id: "camp-002",
    title: "Pilates Studio Grand Opening",
    business_name: "Forma Pilates Chelsea",
    business_address: "67 Greenwich Ave, New York, NY 10014",
    payout: 40,
    spots_remaining: 7,
    spots_total: 12,
    deadline: "2026-05-01",
    category: "Fitness",
    image:
      "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400&h=300&fit=crop",
    tier_required: "explorer",
    description:
      "Attend a complimentary reformer class and share your experience. Wellness-focused content.",
    requirements: [
      "Attend 1 class",
      "1 feed post or Reel",
      "Before/after energy or outfit shot",
    ],
    lat: 40.7346,
    lng: -74.0015,
  },
  {
    id: "camp-003",
    title: "Gallery Opening Night",
    business_name: "Tara Downs Gallery",
    business_address: "541 W 25th St, New York, NY 10001",
    payout: 75,
    spots_remaining: 3,
    spots_total: 6,
    deadline: "2026-05-05",
    category: "Lifestyle",
    image:
      "https://images.unsplash.com/photo-1487530811176-3780de880c2d?w=400&h=300&fit=crop",
    tier_required: "operator",
    description:
      "Cover our contemporary art opening. Editorial, moody, culture-forward content.",
    requirements: [
      "2 feed posts + 3 stories",
      "Aesthetic must match brand guidelines",
      "Submit content for approval 48h before posting",
    ],
    lat: 40.7491,
    lng: -74.0035,
  },
  {
    id: "camp-004",
    title: "SoulCycle Community Ride",
    business_name: "SoulCycle",
    business_address: "12 E 18th St, New York, NY 10003",
    payout: 35,
    spots_remaining: 8,
    spots_total: 15,
    deadline: "2026-05-02",
    category: "Fitness",
    image:
      "https://images.unsplash.com/photo-1534258936925-c58bed479fcb?w=400&h=300&fit=crop",
    tier_required: "seed",
    description:
      "Join a themed community ride and share the energy. High-energy, motivational content.",
    requirements: [
      "1 post or Reel post-ride",
      "Tag @soulcycle",
      "Use #SoulCycleNYC",
    ],
    lat: 40.7381,
    lng: -73.9907,
  },
  // ── Manhattan: West Village ──────────────────────────────
  {
    id: "camp-005",
    title: "Farm-to-Table Dinner Series",
    business_name: "Blue Hill",
    business_address: "75 Washington Pl, New York, NY 10011",
    payout: 250,
    spots_remaining: 1,
    spots_total: 2,
    deadline: "2026-05-20",
    category: "Food",
    image:
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=280&fit=crop&crop=center",
    tier_required: "closer",
    description:
      "Full tasting menu experience at Blue Hill. Ultra-premium food storytelling. Only for top-tier creators.",
    requirements: [
      "10+ course photos",
      "1 long-form video (5+ min)",
      "Written review for cross-posting",
      "25k+ followers required",
    ],
    lat: 40.7317,
    lng: -74.0002,
  },
  {
    id: "camp-006",
    title: "Speakeasy Cocktail Series",
    business_name: "Employees Only",
    business_address: "510 Hudson St, New York, NY 10014",
    payout: 60,
    spots_remaining: 3,
    spots_total: 5,
    deadline: "2026-05-07",
    category: "Food",
    image:
      "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=400&h=300&fit=crop",
    tier_required: "operator",
    description:
      "Document the legendary bar experience. Moody lighting, craft cocktails, intimate atmosphere.",
    requirements: [
      "1 Reel capturing the vibe",
      "3+ stories",
      "No direct flash — ambient light only",
    ],
    lat: 40.7334,
    lng: -74.0061,
  },
  {
    id: "camp-007",
    title: "Natural Wine Discovery",
    business_name: "Buvette",
    business_address: "42 Grove St, New York, NY 10014",
    payout: 20,
    spots_remaining: 9,
    spots_total: 15,
    deadline: "2026-04-28",
    category: "Food",
    image:
      "https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?w=400&h=300&fit=crop",
    tier_required: "seed",
    description:
      "Share your natural wine journey at our cozy West Village gastrotheque.",
    requirements: ["1 Instagram story or post", "Tag @buvetterestaurant"],
    lat: 40.7322,
    lng: -74.0029,
  },
  // ── Manhattan: East Village ──────────────────────────────
  {
    id: "camp-008",
    title: "Best Burger in NYC Feature",
    business_name: "Superiority Burger",
    business_address: "119 Avenue A, New York, NY 10009",
    payout: 35,
    spots_remaining: 4,
    spots_total: 8,
    deadline: "2026-04-25",
    category: "Food",
    image:
      "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop",
    tier_required: "explorer",
    description:
      "Feature our award-winning veggie burgers in an authentic review.",
    requirements: [
      "1 Instagram Reel (min 30s)",
      "Tag @superiorityburger",
      "Must include the Classic Burger",
    ],
    lat: 40.726,
    lng: -73.9831,
  },
  {
    id: "camp-009",
    title: "Omakase Experience Feature",
    business_name: "Shuko",
    business_address: "47 E 12th St, New York, NY 10003",
    payout: 150,
    spots_remaining: 2,
    spots_total: 4,
    deadline: "2026-05-12",
    category: "Food",
    image:
      "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=400&h=300&fit=crop",
    tier_required: "proven",
    description:
      "Full omakase dinner documented course-by-course. Premium food photography expected.",
    requirements: [
      "5+ course-by-course feed posts",
      "1 long-form Reel (2+ min)",
      "Must tag @shukonyc",
      "No flash photography during service",
    ],
    lat: 40.7322,
    lng: -73.9923,
  },
  {
    id: "camp-010",
    title: "Bookstore Hidden Gems",
    business_name: "McNally Jackson",
    business_address: "52 Prince St, New York, NY 10012",
    payout: 15,
    spots_remaining: 10,
    spots_total: 20,
    deadline: "2026-04-30",
    category: "Lifestyle",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop",
    tier_required: "seed",
    description:
      "Pick 3 books, create a cozy reading flat-lay or shelf tour. Literary aesthetic content.",
    requirements: [
      "1 feed post or carousel",
      "Tag @mcnallyjackson",
      "Include at least 3 book titles",
    ],
    lat: 40.7236,
    lng: -73.9961,
  },
  // ── Manhattan: Lower East Side ───────────────────────────
  {
    id: "camp-011",
    title: "Vintage Denim Try-On",
    business_name: "Procell",
    business_address: "95 Stanton St, New York, NY 10002",
    payout: 30,
    spots_remaining: 5,
    spots_total: 8,
    deadline: "2026-04-27",
    category: "Retail",
    image:
      "https://images.unsplash.com/photo-1582552938357-32b906df40cb?w=400&h=300&fit=crop",
    tier_required: "seed",
    description:
      "Style 3 vintage denim looks in-store. Lo-fi, authentic streetwear content preferred.",
    requirements: [
      "3 outfit photos or 1 Reel",
      "Tag @procellvintage",
      "Mention LES location",
    ],
    lat: 40.7205,
    lng: -73.9884,
  },
  {
    id: "camp-012",
    title: "Sneaker Drop Coverage",
    business_name: "Extra Butter",
    business_address: "125 Orchard St, New York, NY 10002",
    payout: 90,
    spots_remaining: 2,
    spots_total: 4,
    deadline: "2026-05-09",
    category: "Retail",
    image:
      "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=400&h=300&fit=crop",
    tier_required: "operator",
    description:
      "Cover the exclusive sneaker release event. Streetwear culture, lineup energy, unboxing content.",
    requirements: [
      "2 Reels (event + unboxing)",
      "5+ stories on release day",
      "Tag @extrabutterny",
    ],
    lat: 40.7202,
    lng: -73.9892,
  },
  {
    id: "camp-013",
    title: "Nail Art Studio Feature",
    business_name: "Paintbucket",
    business_address: "79 Rivington St, New York, NY 10002",
    payout: 30,
    spots_remaining: 6,
    spots_total: 10,
    deadline: "2026-04-29",
    category: "Beauty",
    image:
      "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=400&h=300&fit=crop",
    tier_required: "seed",
    description:
      "Get a complimentary nail art set and share the process. Close-up detail shots are key.",
    requirements: [
      "1 carousel or Reel of the process",
      "Close-up hand shots",
      "Tag @paintbucketnyc",
    ],
    lat: 40.7196,
    lng: -73.9886,
  },
  // ── Manhattan: SoHo ──────────────────────────────────────
  {
    id: "camp-014",
    title: "LA Botanica Aesthetic Shoot",
    business_name: "Flamingo Estate",
    business_address: "La Guardia Pl, New York, NY 10012",
    payout: 75,
    spots_remaining: 3,
    spots_total: 6,
    deadline: "2026-05-05",
    category: "Lifestyle",
    image:
      "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=400&h=300&fit=crop",
    tier_required: "operator",
    description:
      "Capture the Flamingo Estate aesthetic at our NYC pop-up. Moody, editorial, nature-forward content.",
    requirements: [
      "2 feed posts + 3 stories",
      "Aesthetic must match brand guidelines (provided)",
      "Submit content for approval 48h before posting",
    ],
    lat: 40.7291,
    lng: -74.0018,
  },
  {
    id: "camp-015",
    title: "KITH x Creator Collab Series",
    business_name: "KITH",
    business_address: "337 Lafayette St, New York, NY 10012",
    payout: 199,
    spots_remaining: 1,
    spots_total: 3,
    deadline: "2026-05-15",
    category: "Retail",
    image:
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop",
    tier_required: "proven",
    description:
      "Exclusive creator collab at KITH SoHo. Style editorial campaign for Spring 2026 collection.",
    requirements: [
      "5+ high-quality feed posts",
      "2 Reels",
      "10k+ Instagram followers required",
      "Portfolio review required",
    ],
    lat: 40.7248,
    lng: -74.0012,
  },
  {
    id: "camp-016",
    title: "Matcha Morning Ritual",
    business_name: "Cha Cha Matcha",
    business_address: "373 Broadway, New York, NY 10013",
    payout: 25,
    spots_remaining: 6,
    spots_total: 12,
    deadline: "2026-04-29",
    category: "Coffee",
    image:
      "https://images.unsplash.com/photo-1536256263959-770b48d82b0a?w=400&h=300&fit=crop",
    tier_required: "seed",
    description:
      "Share your morning matcha ritual at Cha Cha Matcha. Aesthetic, cozy content welcome.",
    requirements: ["2 Instagram stories", "Tag @chachamatcha"],
    lat: 40.7178,
    lng: -74.003,
  },
  {
    id: "camp-017",
    title: "Glossier NYC Store Experience",
    business_name: "Glossier",
    business_address: "1a York Ave, New York, NY 10065",
    payout: 120,
    spots_remaining: 2,
    spots_total: 5,
    deadline: "2026-05-10",
    category: "Beauty",
    image:
      "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=300&fit=crop",
    tier_required: "proven",
    description:
      "Create editorial beauty content at the Glossier flagship. High production value expected.",
    requirements: [
      "3+ feed posts",
      "Dedicated YouTube or TikTok video (min 3 min)",
      "Engagement rate > 3%",
    ],
    lat: 40.7625,
    lng: -73.9577,
  },
  // ── Manhattan: Tribeca ───────────────────────────────────
  {
    id: "camp-018",
    title: "Brow Transformation Story",
    business_name: "Brow Theory",
    business_address: "247 Centre St, New York, NY 10013",
    payout: 50,
    spots_remaining: 5,
    spots_total: 10,
    deadline: "2026-04-28",
    category: "Beauty",
    image:
      "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400&h=300&fit=crop",
    tier_required: "explorer",
    description:
      "Document your brow transformation at Brow Theory. Before/after content preferred.",
    requirements: [
      "Before & after Instagram stories",
      "1 feed post or Reel",
      "Tag @browtheorynyc",
    ],
    lat: 40.7195,
    lng: -74.0018,
  },
  {
    id: "camp-019",
    title: "Cold Brew Tasting Session",
    business_name: "Kaigo Coffee Room",
    business_address: "84 Chambers St, New York, NY 10007",
    payout: 0,
    spots_remaining: 14,
    spots_total: 20,
    deadline: "2026-04-30",
    category: "Coffee",
    image:
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=300&fit=crop",
    tier_required: "seed",
    description:
      "Try our rotating cold brew menu and document your favorites. Beginner-friendly.",
    requirements: ["2 stories minimum", "Tag @kaigocoffee"],
    lat: 40.7147,
    lng: -74.0077,
  },
  {
    id: "camp-020",
    title: "Architectural Photography Walk",
    business_name: "Tribeca Citizen Tour Co.",
    business_address: "176 Hudson St, New York, NY 10013",
    payout: 0,
    spots_remaining: 15,
    spots_total: 25,
    deadline: "2026-05-03",
    category: "Lifestyle",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop&crop=entropy",
    tier_required: "seed",
    description:
      "Join our guided photo walk through Tribeca's cast-iron architecture. Great for portfolio building.",
    requirements: [
      "3 feed photos from the walk",
      "Tag location",
      "Use #TribecaWalk",
    ],
    lat: 40.7163,
    lng: -74.0099,
  },
  // ── Manhattan: Chinatown / FiDi ──────────────────────────
  {
    id: "camp-021",
    title: "Dim Sum Storytelling",
    business_name: "Nom Wah Tea Parlor",
    business_address: "13 Doyers St, New York, NY 10013",
    payout: 20,
    spots_remaining: 8,
    spots_total: 15,
    deadline: "2026-04-26",
    category: "Food",
    image:
      "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop&crop=entropy",
    tier_required: "seed",
    description:
      "Experience America's oldest dim sum parlor. Capture the century-old ambiance and dishes.",
    requirements: ["2 stories + 1 feed post", "Tag @nomwahteaparlor"],
    lat: 40.7144,
    lng: -73.9983,
  },
  {
    id: "camp-022",
    title: "FiDi Lunch Crowd Feature",
    business_name: "Adrienne's Pizzabar",
    business_address: "54 Stone St, New York, NY 10004",
    payout: 25,
    spots_remaining: 10,
    spots_total: 18,
    deadline: "2026-05-06",
    category: "Food",
    image:
      "https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?w=400&h=300&fit=crop&crop=entropy",
    tier_required: "seed",
    description:
      "Cover the legendary Stone Street lunch scene. Outdoor tables, Roman pizza, Wall Street energy.",
    requirements: ["1 story or post", "Tag @adriennespizzabar"],
    lat: 40.7047,
    lng: -74.0111,
  },
  // ── Manhattan: NoHo ──────────────────────────────────────
  {
    id: "camp-023",
    title: "Le Bec-Fin Pop-Up Review",
    business_name: "Le Bec Fin",
    business_address: "1 Rockefeller Plaza, New York, NY 10020",
    payout: 20,
    spots_remaining: 8,
    spots_total: 15,
    deadline: "2026-04-22",
    category: "Food",
    image:
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=300&fit=crop",
    tier_required: "seed",
    description:
      "Try the NYC pop-up of the legendary Philadelphia institution. Share an honest review.",
    requirements: ["1 Instagram story or post", "Tag location"],
    lat: 40.7597,
    lng: -73.9787,
  },
  {
    id: "camp-024",
    title: "Fragrance Discovery Bar",
    business_name: "Aedes de Venustas",
    business_address: "9 Christopher St, New York, NY 10014",
    payout: 55,
    spots_remaining: 4,
    spots_total: 8,
    deadline: "2026-05-08",
    category: "Lifestyle",
    image:
      "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=400&h=300&fit=crop&crop=entropy",
    tier_required: "explorer",
    description:
      "Curate your signature scent story at our boutique. Moody, artistic, sensory content.",
    requirements: [
      "1 Reel featuring fragrance exploration",
      "2 stories",
      "Tag @aedesdevenustas",
    ],
    lat: 40.7338,
    lng: -74.0026,
  },
  // ── Manhattan: Midtown ───────────────────────────────────
  {
    id: "camp-025",
    title: "Spring Facial Treatment",
    business_name: "Heyday",
    business_address: "1410 Broadway, New York, NY 10018",
    payout: 45,
    spots_remaining: 4,
    spots_total: 8,
    deadline: "2026-04-26",
    category: "Beauty",
    image:
      "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=400&h=300&fit=crop",
    tier_required: "explorer",
    description:
      "Complimentary facial + skincare consultation. Share your glow-up journey.",
    requirements: [
      "Before/after selfie",
      "1 story series (min 3 frames)",
      "Tag @heydayskincare",
    ],
    lat: 40.7527,
    lng: -73.9867,
  },
  {
    id: "camp-026",
    title: "Midtown Espresso Crawl",
    business_name: "Gregory's Coffee",
    business_address: "874 6th Ave, New York, NY 10001",
    payout: 0,
    spots_remaining: 16,
    spots_total: 25,
    deadline: "2026-05-04",
    category: "Coffee",
    image:
      "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=400&h=300&fit=crop",
    tier_required: "seed",
    description:
      "Document your morning coffee crawl through our Midtown locations. Commuter energy welcome.",
    requirements: ["2 stories minimum", "Tag @gregoryscoffee"],
    lat: 40.7472,
    lng: -73.9917,
  },
  {
    id: "camp-027",
    title: "Power Lunch Feature",
    business_name: "Le Bernardin",
    business_address: "155 W 51st St, New York, NY 10019",
    payout: 300,
    spots_remaining: 1,
    spots_total: 2,
    deadline: "2026-06-01",
    category: "Food",
    image:
      "https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=400&h=300&fit=crop&crop=faces",
    tier_required: "partner",
    description:
      "Document the ultimate NYC power lunch experience. Michelin-star seafood, executive dining culture. Flagship partnership only.",
    requirements: [
      "Full meal documentation",
      "1 longform video",
      "Blog or written feature",
      "50k+ audience required",
    ],
    lat: 40.7614,
    lng: -73.9822,
  },
  // ── Manhattan: Upper East Side ───────────────────────────
  {
    id: "camp-028",
    title: "Boutique Fitness Class",
    business_name: "Barry's Bootcamp UES",
    business_address: "1239 Lexington Ave, New York, NY 10028",
    payout: 40,
    spots_remaining: 6,
    spots_total: 10,
    deadline: "2026-05-03",
    category: "Fitness",
    image:
      "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&h=300&fit=crop",
    tier_required: "explorer",
    description:
      "Join our signature red room workout. High-energy, aspirational fitness content.",
    requirements: [
      "1 Reel from class",
      "Before/after selfie",
      "Tag @barrysbootcamp",
    ],
    lat: 40.7769,
    lng: -73.9566,
  },
  {
    id: "camp-029",
    title: "Uptown Salon Experience",
    business_name: "The Parlour",
    business_address: "1518 2nd Ave, New York, NY 10075",
    payout: 55,
    spots_remaining: 3,
    spots_total: 6,
    deadline: "2026-05-11",
    category: "Beauty",
    image:
      "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=300&fit=crop&crop=entropy",
    tier_required: "operator",
    description:
      "Full hair transformation at our UES flagship. Luxury salon content, sophisticated clientele.",
    requirements: [
      "Before/after Reel",
      "3 stories minimum",
      "Tag @theparlournyc",
    ],
    lat: 40.7757,
    lng: -73.9558,
  },
  {
    id: "camp-030",
    title: "Madison Avenue Style Walk",
    business_name: "Intermix",
    business_address: "1003 Madison Ave, New York, NY 10075",
    payout: 100,
    spots_remaining: 2,
    spots_total: 4,
    deadline: "2026-05-18",
    category: "Retail",
    image:
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop&crop=entropy",
    tier_required: "proven",
    description:
      "Style editorial walk along Madison Avenue for our spring campaign. Uptown chic aesthetic.",
    requirements: [
      "5+ outfit shots",
      "1 Reel walking Madison Ave",
      "10k+ followers required",
    ],
    lat: 40.7742,
    lng: -73.9629,
  },
  // ── Manhattan: Upper West Side ───────────────────────────
  {
    id: "camp-031",
    title: "Brunch Culture Feature",
    business_name: "Sarabeth's Kitchen",
    business_address: "423 Amsterdam Ave, New York, NY 10024",
    payout: 30,
    spots_remaining: 7,
    spots_total: 12,
    deadline: "2026-05-10",
    category: "Food",
    image:
      "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop&crop=faces",
    tier_required: "seed",
    description:
      "Document the quintessential NYC brunch experience. Weekend crowds, stunning dishes, UWS energy.",
    requirements: ["2 stories + 1 feed post", "Tag @sarabethsrestaurants"],
    lat: 40.7831,
    lng: -73.9797,
  },
  {
    id: "camp-032",
    title: "Independent Bookshop Tour",
    business_name: "Book Culture",
    business_address: "536 W 112th St, New York, NY 10025",
    payout: 0,
    spots_remaining: 20,
    spots_total: 30,
    deadline: "2026-05-15",
    category: "Lifestyle",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop&crop=center",
    tier_required: "seed",
    description:
      "Explore our curated shelves and share your reading picks. Academic, curious, community-driven content.",
    requirements: ["1 feed post or stories", "Tag @bookculture"],
    lat: 40.8051,
    lng: -73.9634,
  },
  {
    id: "camp-033",
    title: "Riverside Yoga Session",
    business_name: "YogaWorks UWS",
    business_address: "2167 Broadway, New York, NY 10024",
    payout: 45,
    spots_remaining: 5,
    spots_total: 10,
    deadline: "2026-05-14",
    category: "Fitness",
    image:
      "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400&h=300&fit=crop&crop=entropy",
    tier_required: "explorer",
    description:
      "Attend a sunrise yoga class and share your morning ritual. Peaceful, wellness-focused content.",
    requirements: [
      "1 Reel or feed post",
      "2 stories from class",
      "Tag @yogaworks",
    ],
    lat: 40.7847,
    lng: -73.9801,
  },
  // ── Manhattan: Harlem ────────────────────────────────────
  {
    id: "camp-034",
    title: "Soul Food Heritage Story",
    business_name: "Sylvia's Restaurant",
    business_address: "328 Malcolm X Blvd, New York, NY 10027",
    payout: 20,
    spots_remaining: 10,
    spots_total: 18,
    deadline: "2026-04-29",
    category: "Food",
    image:
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=300&fit=crop&crop=entropy",
    tier_required: "seed",
    description:
      "Celebrate Harlem's iconic soul food institution. Cultural storytelling and authentic community vibes.",
    requirements: [
      "2 stories + 1 feed post",
      "Tag @sylviasrestaurant",
      "Respect the space and staff",
    ],
    lat: 40.8077,
    lng: -73.9465,
  },
  {
    id: "camp-035",
    title: "Natural Hair Studio Feature",
    business_name: "Turning Heads Hair Salon",
    business_address: "2083 Adam Clayton Powell Jr Blvd, New York, NY 10027",
    payout: 55,
    spots_remaining: 4,
    spots_total: 8,
    deadline: "2026-05-16",
    category: "Beauty",
    image:
      "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=400&h=300&fit=crop&crop=entropy",
    tier_required: "operator",
    description:
      "Full natural hair transformation session. Celebrate natural beauty and Harlem's creative community.",
    requirements: ["Before/after Reel", "3 stories", "Tag the salon"],
    lat: 40.8095,
    lng: -73.9503,
  },
  {
    id: "camp-036",
    title: "Harlem Coffee Community",
    business_name: "Double Dutch Espresso",
    business_address: "2110 Frederick Douglass Blvd, New York, NY 10026",
    payout: 0,
    spots_remaining: 15,
    spots_total: 20,
    deadline: "2026-05-02",
    category: "Coffee",
    image:
      "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&h=300&fit=crop&crop=entropy",
    tier_required: "seed",
    description:
      "Share the vibrant Harlem coffee culture. Neighborhood warmth, local community, good beans.",
    requirements: ["1 story or post", "Tag @doubledutchespresso"],
    lat: 40.8012,
    lng: -73.9547,
  },
  // ── Brooklyn: Williamsburg ───────────────────────────────
  {
    id: "camp-037",
    title: "Rooftop Sunset Session",
    business_name: "Westlight",
    business_address: "111 N 12th St, Brooklyn, NY 11249",
    payout: 85,
    spots_remaining: 3,
    spots_total: 6,
    deadline: "2026-05-08",
    category: "Food",
    image:
      "https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=400&h=300&fit=crop",
    tier_required: "operator",
    description:
      "Capture the golden hour vibe at Westlight rooftop bar. Cocktails, skyline views, editorial mood.",
    requirements: [
      "1 Reel featuring the skyline view",
      "2 stories minimum",
      "Tag @westlightnyc",
    ],
    lat: 40.7223,
    lng: -73.9573,
  },
  {
    id: "camp-038",
    title: "Ramen Lab Collab",
    business_name: "Ivan Ramen",
    business_address: "25 Clinton St, New York, NY 10002",
    payout: 65,
    spots_remaining: 3,
    spots_total: 6,
    deadline: "2026-05-13",
    category: "Food",
    image:
      "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=400&h=300&fit=crop&crop=entropy",
    tier_required: "operator",
    description:
      "Behind-the-scenes ramen creation content. Steam, broth, craft — the full story.",
    requirements: [
      "1 long Reel (1+ min)",
      "3 process stories",
      "Tag @ivanramen",
    ],
    lat: 40.7208,
    lng: -73.9856,
  },
  {
    id: "camp-039",
    title: "Williamsburg Vintage Hunt",
    business_name: "Awoke Vintage",
    business_address: "132 N 5th St, Brooklyn, NY 11249",
    payout: 25,
    spots_remaining: 8,
    spots_total: 14,
    deadline: "2026-04-27",
    category: "Retail",
    image:
      "https://images.unsplash.com/photo-1582552938357-32b906df40cb?w=400&h=300&fit=crop&crop=entropy",
    tier_required: "seed",
    description:
      "Hunt for unique vintage pieces and style them in-store. Authentic thrift culture content.",
    requirements: [
      "3 outfit shots",
      "Tag @awakevintage",
      "Mention the find price",
    ],
    lat: 40.7173,
    lng: -73.9579,
  },
  {
    id: "camp-040",
    title: "Third Wave Coffee Feature",
    business_name: "Toby's Estate Coffee",
    business_address: "125 N 6th St, Brooklyn, NY 11249",
    payout: 20,
    spots_remaining: 9,
    spots_total: 16,
    deadline: "2026-05-01",
    category: "Coffee",
    image:
      "https://images.unsplash.com/photo-1536256263959-770b48d82b0a?w=400&h=300&fit=crop&crop=entropy",
    tier_required: "seed",
    description:
      "Document the specialty coffee craft at Toby's Estate. Pour-overs, latte art, Williamsburg warehouse aesthetic.",
    requirements: ["2 stories + 1 feed post", "Tag @tobysestateusa"],
    lat: 40.7196,
    lng: -73.9594,
  },
  {
    id: "camp-041",
    title: "Barre Studio Launch",
    business_name: "Pure Barre Williamsburg",
    business_address: "264 Bedford Ave, Brooklyn, NY 11249",
    payout: 40,
    spots_remaining: 6,
    spots_total: 10,
    deadline: "2026-05-09",
    category: "Fitness",
    image:
      "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&h=300&fit=crop&crop=entropy",
    tier_required: "explorer",
    description:
      "Join our studio launch and share your first barre experience. Graceful, feminine, aspirational content.",
    requirements: ["1 Reel from class", "2 stories", "Tag @purebarre"],
    lat: 40.7133,
    lng: -73.9619,
  },
  // ── Brooklyn: DUMBO ───────────────────────────────────────
  {
    id: "camp-042",
    title: "Brooklyn Bridge Views Campaign",
    business_name: "Atrium DUMBO",
    business_address: "15 Main St, Brooklyn, NY 11201",
    payout: 80,
    spots_remaining: 4,
    spots_total: 8,
    deadline: "2026-05-12",
    category: "Lifestyle",
    image:
      "https://images.unsplash.com/photo-1487530811176-3780de880c2d?w=400&h=300&fit=crop&crop=entropy",
    tier_required: "operator",
    description:
      "Create editorial content at the iconic DUMBO waterfront. Cobblestone streets, bridge views, golden hour.",
    requirements: ["2 feed posts", "3 stories", "Tag location"],
    lat: 40.7033,
    lng: -73.9892,
  },
  {
    id: "camp-043",
    title: "Artisan Bakery Story",
    business_name: "Almondine Bakery",
    business_address: "85 Water St, Brooklyn, NY 11201",
    payout: 0,
    spots_remaining: 18,
    spots_total: 25,
    deadline: "2026-04-24",
    category: "Food",
    image:
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=300&fit=crop&crop=faces",
    tier_required: "seed",
    description:
      "Share the magic of French pastry in Brooklyn. Croissants, morning light, DUMBO charm.",
    requirements: ["1 story or feed post", "Tag @almondinebakery"],
    lat: 40.7024,
    lng: -73.9898,
  },
  {
    id: "camp-044",
    title: "Luxury Streetwear Drop",
    business_name: "Cabin Brooklyn",
    business_address: "68 Jay St, Brooklyn, NY 11201",
    payout: 180,
    spots_remaining: 1,
    spots_total: 3,
    deadline: "2026-05-30",
    category: "Retail",
    image:
      "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=400&h=300&fit=crop&crop=entropy",
    tier_required: "closer",
    description:
      "Exclusive drop coverage at Cabin Brooklyn. Luxury streetwear, limited edition, culture-defining moment.",
    requirements: [
      "3 Reels",
      "Full event coverage stories",
      "20k+ followers required",
    ],
    lat: 40.7018,
    lng: -73.9866,
  },
  // ── Brooklyn: Bushwick ────────────────────────────────────
  {
    id: "camp-045",
    title: "Mural District Art Walk",
    business_name: "The Bushwick Collective",
    business_address: "Troutman St & St Nicholas Ave, Brooklyn, NY 11237",
    payout: 0,
    spots_remaining: 25,
    spots_total: 40,
    deadline: "2026-05-17",
    category: "Lifestyle",
    image:
      "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=400&h=300&fit=crop&crop=center",
    tier_required: "seed",
    description:
      "Photograph the world-famous Bushwick street art murals. Creative, bold, unapologetic content.",
    requirements: ["3 feed photos of murals", "Tag @bushwickcollective"],
    lat: 40.7056,
    lng: -73.9232,
  },
  {
    id: "camp-046",
    title: "Natural Wine Bar Feature",
    business_name: "June Wine Bar",
    business_address: "231 Court St, Brooklyn, NY 11201",
    payout: 60,
    spots_remaining: 4,
    spots_total: 8,
    deadline: "2026-05-19",
    category: "Food",
    image:
      "https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?w=400&h=300&fit=crop&crop=center",
    tier_required: "operator",
    description:
      "Document the natural wine experience at our intimate wine bar. Intimate, knowledgeable, discoverable content.",
    requirements: ["1 Reel", "3 stories", "Tag @junewinebarnyc"],
    lat: 40.6857,
    lng: -73.9951,
  },
  {
    id: "camp-047",
    title: "Studio Salon Transformation",
    business_name: "Parlor Salon Bushwick",
    business_address: "54 Wilson Ave, Brooklyn, NY 11237",
    payout: 40,
    spots_remaining: 5,
    spots_total: 8,
    deadline: "2026-05-05",
    category: "Beauty",
    image:
      "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400&h=300&fit=crop&crop=entropy",
    tier_required: "explorer",
    description:
      "Color transformation at our indie Bushwick salon. Bold colors, creative cuts, artist community.",
    requirements: [
      "Before/after content",
      "1 feed post or Reel",
      "Tag the salon",
    ],
    lat: 40.7046,
    lng: -73.926,
  },
  // ── Brooklyn: Park Slope ──────────────────────────────────
  {
    id: "camp-048",
    title: "Neighborhood Cafe Feature",
    business_name: "Gorilla Coffee",
    business_address: "97 5th Ave, Brooklyn, NY 11217",
    payout: 15,
    spots_remaining: 12,
    spots_total: 20,
    deadline: "2026-04-28",
    category: "Coffee",
    image:
      "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=400&h=300&fit=crop&crop=entropy",
    tier_required: "seed",
    description:
      "Capture the iconic Park Slope coffee shop life. Local community, great espresso, Brooklyn family vibes.",
    requirements: ["1 story or feed post", "Tag @gorillacoffee"],
    lat: 40.6757,
    lng: -73.9784,
  },
  {
    id: "camp-049",
    title: "Prospect Park Yoga Flow",
    business_name: "Brooklyn Yoga School",
    business_address: "200 7th Ave, Brooklyn, NY 11215",
    payout: 35,
    spots_remaining: 7,
    spots_total: 12,
    deadline: "2026-05-16",
    category: "Fitness",
    image:
      "https://images.unsplash.com/photo-1534258936925-c58bed479fcb?w=400&h=300&fit=crop&crop=entropy",
    tier_required: "explorer",
    description:
      "Morning yoga flow with park views. Community, nature, wellness in the heart of Brooklyn.",
    requirements: [
      "1 Reel from practice",
      "2 outdoor park shots",
      "Tag @brooklynyogaschool",
    ],
    lat: 40.6676,
    lng: -73.9793,
  },
  {
    id: "camp-050",
    title: "Italian Dining Experience",
    business_name: "Al di La Trattoria",
    business_address: "248 5th Ave, Brooklyn, NY 11215",
    payout: 70,
    spots_remaining: 3,
    spots_total: 6,
    deadline: "2026-05-22",
    category: "Food",
    image:
      "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop&crop=center",
    tier_required: "operator",
    description:
      "Cover our beloved neighborhood trattoria. Venetian cuisine, wine, Brooklyn romance.",
    requirements: ["2 feed posts", "2 stories", "Tag @aldilatrattoria"],
    lat: 40.6714,
    lng: -73.9781,
  },
  // ── Brooklyn: Greenpoint ──────────────────────────────────
  {
    id: "camp-051",
    title: "Polish Heritage Bakery",
    business_name: "Karczma",
    business_address: "136 Greenpoint Ave, Brooklyn, NY 11222",
    payout: 0,
    spots_remaining: 14,
    spots_total: 20,
    deadline: "2026-05-08",
    category: "Food",
    image:
      "https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?w=400&h=300&fit=crop&crop=faces",
    tier_required: "seed",
    description:
      "Discover authentic Polish cuisine in Brooklyn. Cultural, warm, hearty content welcome.",
    requirements: ["1 post or story", "Tag @karczmabrooklyn"],
    lat: 40.7295,
    lng: -73.9533,
  },
  {
    id: "camp-052",
    title: "Ceramics Studio Collab",
    business_name: "Clay By Numbers",
    business_address: "68 Greenpoint Ave, Brooklyn, NY 11222",
    payout: 0,
    spots_remaining: 12,
    spots_total: 18,
    deadline: "2026-05-14",
    category: "Lifestyle",
    image:
      "https://images.unsplash.com/photo-1487530811176-3780de880c2d?w=400&h=300&fit=crop&crop=center",
    tier_required: "seed",
    description:
      "Free intro pottery class in exchange for process content. Messy hands, creative vibes, Greenpoint charm.",
    requirements: [
      "2 stories during class",
      "1 photo of finished piece",
      "Tag the studio",
    ],
    lat: 40.7318,
    lng: -73.9519,
  },
  {
    id: "camp-053",
    title: "Waterfront Cocktail Hour",
    business_name: "The Manhattan Inn",
    business_address: "632 Manhattan Ave, Brooklyn, NY 11222",
    payout: 65,
    spots_remaining: 4,
    spots_total: 8,
    deadline: "2026-05-21",
    category: "Food",
    image:
      "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=400&h=300&fit=crop&crop=entropy",
    tier_required: "operator",
    description:
      "Document the golden hour cocktail experience with East River views. Sophisticated, photogenic, Greenpoint cool.",
    requirements: [
      "1 Reel with waterfront view",
      "3 stories",
      "Tag @manhattaninnbk",
    ],
    lat: 40.7262,
    lng: -73.9519,
  },
  // ── Brooklyn: Crown Heights / Prospect Heights ────────────
  {
    id: "camp-054",
    title: "Caribbean Brunch Culture",
    business_name: "Glady's",
    business_address: "788 Franklin Ave, Brooklyn, NY 11238",
    payout: 30,
    spots_remaining: 6,
    spots_total: 10,
    deadline: "2026-05-03",
    category: "Food",
    image:
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=300&fit=crop&crop=center",
    tier_required: "seed",
    description:
      "Celebrate Caribbean-inspired brunch culture in Crown Heights. Vibrant, colorful, community-centered content.",
    requirements: ["2 stories + 1 feed post", "Tag @gladysbrooklyn"],
    lat: 40.6706,
    lng: -73.9576,
  },
  {
    id: "camp-055",
    title: "Record Shop Discovery",
    business_name: "Halcyon Music Shop",
    business_address: "57 Pearl St, Brooklyn, NY 11201",
    payout: 20,
    spots_remaining: 8,
    spots_total: 14,
    deadline: "2026-05-10",
    category: "Lifestyle",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop&crop=entropy",
    tier_required: "seed",
    description:
      "Crate dig at Brooklyn's best record shop. Share your vinyl finds and music culture moments.",
    requirements: ["1 feed post showing your finds", "Tag @halcyonbrooklyn"],
    lat: 40.6974,
    lng: -73.9867,
  },
  {
    id: "camp-056",
    title: "Brooklyn Museum Art Walk",
    business_name: "Café at the Brooklyn Museum",
    business_address: "200 Eastern Pkwy, Brooklyn, NY 11238",
    payout: 80,
    spots_remaining: 3,
    spots_total: 6,
    deadline: "2026-05-25",
    category: "Lifestyle",
    image:
      "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=400&h=300&fit=crop&crop=faces",
    tier_required: "operator",
    description:
      "Create editorial content pairing art and dining at the Brooklyn Museum. Cultural, refined, arts-forward.",
    requirements: [
      "2 feed posts (art + food)",
      "3 stories from museum",
      "Tag @brooklynmuseum",
    ],
    lat: 40.6712,
    lng: -73.9637,
  },
  // ── Brooklyn: Cobble Hill / Fort Greene ───────────────────
  {
    id: "camp-057",
    title: "Cobble Hill Cafe Morning",
    business_name: "Iris Cafe",
    business_address: "20 Columbia Pl, Brooklyn, NY 11201",
    payout: 0,
    spots_remaining: 16,
    spots_total: 25,
    deadline: "2026-04-30",
    category: "Coffee",
    image:
      "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&h=300&fit=crop&crop=center",
    tier_required: "seed",
    description:
      "Start your morning right at this beloved Cobble Hill cafe. Quiet streets, great coffee, Brooklyn morning light.",
    requirements: ["1 story or feed post", "Tag @iriscafebrooklyn"],
    lat: 40.692,
    lng: -73.9952,
  },
  {
    id: "camp-058",
    title: "Fort Greene Restaurant Week",
    business_name: "No. 7",
    business_address: "7 Greene Ave, Brooklyn, NY 11238",
    payout: 55,
    spots_remaining: 5,
    spots_total: 10,
    deadline: "2026-05-18",
    category: "Food",
    image:
      "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=400&h=300&fit=crop&crop=center",
    tier_required: "operator",
    description:
      "Cover the creative American menu at No. 7. Inventive dishes, funky atmosphere, Fort Greene creativity.",
    requirements: ["2 stories + 1 Reel", "Tag @no7restaurant"],
    lat: 40.6887,
    lng: -73.976,
  },
  {
    id: "camp-059",
    title: "Brooklyn Skincare Ritual",
    business_name: "Shen Beauty",
    business_address: "532 Court St, Brooklyn, NY 11231",
    payout: 60,
    spots_remaining: 4,
    spots_total: 8,
    deadline: "2026-05-07",
    category: "Beauty",
    image:
      "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=400&h=300&fit=crop&crop=center",
    tier_required: "operator",
    description:
      "Full skincare consultation and product discovery at Brooklyn's best beauty boutique.",
    requirements: [
      "1 Reel of skincare routine",
      "3 stories",
      "Tag @shenbeauty",
    ],
    lat: 40.6768,
    lng: -73.9997,
  },
  // ── Brooklyn: Bedford-Stuyvesant ──────────────────────────
  {
    id: "camp-060",
    title: "Bed-Stuy Coffee Culture",
    business_name: "Cafe Erzulie",
    business_address: "877 Myrtle Ave, Brooklyn, NY 11206",
    payout: 0,
    spots_remaining: 18,
    spots_total: 25,
    deadline: "2026-05-08",
    category: "Coffee",
    image:
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=300&fit=crop&crop=entropy",
    tier_required: "seed",
    description:
      "Brooklyn's Black-owned cafe with island flair. Community warmth, Caribbean coffee, authentic neighborhood vibes.",
    requirements: ["1 story or post", "Tag @cafeerzulie"],
    lat: 40.6986,
    lng: -73.9388,
  },
  {
    id: "camp-061",
    title: "Afro-Centric Boutique Feature",
    business_name: "Moshood",
    business_address: "698 Fulton St, Brooklyn, NY 11217",
    payout: 70,
    spots_remaining: 3,
    spots_total: 6,
    deadline: "2026-05-20",
    category: "Retail",
    image:
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop&crop=center",
    tier_required: "operator",
    description:
      "Style editorial content showcasing Brooklyn's premier Afrocentric fashion boutique. Cultural pride, vibrant prints.",
    requirements: ["2 outfit Reels", "3 stories", "Tag @moshoodnyc"],
    lat: 40.6851,
    lng: -73.9754,
  },
  {
    id: "camp-062",
    title: "Bed-Stuy Boxing Gym Feature",
    business_name: "Steel Crew Boxing",
    business_address: "1064 Bedford Ave, Brooklyn, NY 11205",
    payout: 50,
    spots_remaining: 4,
    spots_total: 8,
    deadline: "2026-05-24",
    category: "Fitness",
    image:
      "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&h=300&fit=crop&crop=center",
    tier_required: "explorer",
    description:
      "Raw, authentic boxing gym content. Community strength, discipline, Brooklyn grit.",
    requirements: ["1 Reel from training", "2 stories", "Tag the gym"],
    lat: 40.6924,
    lng: -73.9579,
  },
  // ── Queens: Astoria ───────────────────────────────────────
  {
    id: "camp-063",
    title: "Greek Diner Feature",
    business_name: "Telly's Taverna",
    business_address: "28-13 23rd Ave, Astoria, NY 11105",
    payout: 25,
    spots_remaining: 8,
    spots_total: 14,
    deadline: "2026-05-11",
    category: "Food",
    image:
      "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop&crop=faces",
    tier_required: "seed",
    description:
      "Document authentic Greek dining in Astoria. Ouzo, mezze, outdoor dining, real NYC ethnic food culture.",
    requirements: ["2 stories + 1 feed post", "Tag @tellystaverna"],
    lat: 40.7742,
    lng: -73.9299,
  },
  {
    id: "camp-064",
    title: "Astoria Coffee Crawl",
    business_name: "Coffeed",
    business_address: "37-11 35th Ave, Astoria, NY 11101",
    payout: 0,
    spots_remaining: 20,
    spots_total: 30,
    deadline: "2026-04-29",
    category: "Coffee",
    image:
      "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=400&h=300&fit=crop&crop=center",
    tier_required: "seed",
    description:
      "Experience Astoria's thriving specialty coffee scene. Multi-cultural neighborhood, great beans.",
    requirements: ["1 story or feed post", "Tag @coffeednyc"],
    lat: 40.7519,
    lng: -73.9295,
  },
  {
    id: "camp-065",
    title: "Queens Wellness Studio",
    business_name: "Astoria Fitness",
    business_address: "31-21 31st St, Astoria, NY 11106",
    payout: 35,
    spots_remaining: 6,
    spots_total: 10,
    deadline: "2026-05-15",
    category: "Fitness",
    image:
      "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400&h=300&fit=crop&crop=center",
    tier_required: "explorer",
    description:
      "Join our community workout and share the Queens fitness energy. Inclusive, diverse, motivating.",
    requirements: ["1 Reel post-workout", "2 stories", "Tag @astoriafitness"],
    lat: 40.7625,
    lng: -73.9317,
  },
  // ── Queens: Long Island City ──────────────────────────────
  {
    id: "camp-066",
    title: "LIC Skyline Shoot",
    business_name: "DUTCH kills bar",
    business_address: "27-24 Jackson Ave, Long Island City, NY 11101",
    payout: 90,
    spots_remaining: 3,
    spots_total: 6,
    deadline: "2026-05-28",
    category: "Food",
    image:
      "https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=400&h=300&fit=crop&crop=center",
    tier_required: "operator",
    description:
      "Craft cocktails with Manhattan skyline views. LIC's artistic community, elevated bar culture.",
    requirements: ["1 Reel with skyline", "3 stories", "Tag @dutchkillsbar"],
    lat: 40.7449,
    lng: -73.9431,
  },
  {
    id: "camp-067",
    title: "MoMA PS1 Adjacent Cafe",
    business_name: "Casa Enrique",
    business_address: "5-48 49th Ave, Long Island City, NY 11101",
    payout: 55,
    spots_remaining: 4,
    spots_total: 8,
    deadline: "2026-05-26",
    category: "Food",
    image:
      "https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?w=400&h=300&fit=crop&crop=faces",
    tier_required: "operator",
    description:
      "Arts district dining near MoMA PS1. Authentic Mexican cuisine, artistic neighborhood, creative community.",
    requirements: ["2 feed posts", "2 stories", "Tag @casaenriquelic"],
    lat: 40.7449,
    lng: -73.9431,
  },
  {
    id: "camp-068",
    title: "Industrial Boutique Collab",
    business_name: "Meli Melo",
    business_address: "44-02 23rd St, Long Island City, NY 11101",
    payout: 75,
    spots_remaining: 3,
    spots_total: 6,
    deadline: "2026-05-23",
    category: "Retail",
    image:
      "https://images.unsplash.com/photo-1582552938357-32b906df40cb?w=400&h=300&fit=crop&crop=center",
    tier_required: "operator",
    description:
      "Style editorial content at our LIC boutique. Industrial chic backdrop, emerging designers.",
    requirements: ["2 outfit Reels", "3 stories", "Tag the boutique"],
    lat: 40.7487,
    lng: -73.9438,
  },
  // ── Queens: Flushing ──────────────────────────────────────
  {
    id: "camp-069",
    title: "Authentic Dim Sum Experience",
    business_name: "Gala Manor",
    business_address: "138-18 Northern Blvd, Flushing, NY 11354",
    payout: 30,
    spots_remaining: 8,
    spots_total: 15,
    deadline: "2026-05-04",
    category: "Food",
    image:
      "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop&crop=entropy",
    tier_required: "seed",
    description:
      "Authentic dim sum at Flushing's finest. Carts, dumplings, multigenerational families — real NYC food culture.",
    requirements: ["2 stories + 1 post", "Tag the restaurant"],
    lat: 40.7576,
    lng: -73.8298,
  },
  {
    id: "camp-070",
    title: "K-Beauty Haul Feature",
    business_name: "Skin1004 Flushing",
    business_address: "35-30 Union St, Flushing, NY 11354",
    payout: 45,
    spots_remaining: 5,
    spots_total: 10,
    deadline: "2026-05-20",
    category: "Beauty",
    image:
      "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=300&fit=crop&crop=center",
    tier_required: "explorer",
    description:
      "K-beauty product haul and skincare demo in Flushing's Korean beauty district. Dewy skin, enthusiastic content.",
    requirements: ["1 haul Reel", "3 product stories", "Tag @skin1004official"],
    lat: 40.7533,
    lng: -73.8307,
  },
  // ── Queens: Jackson Heights ───────────────────────────────
  {
    id: "camp-071",
    title: "South Asian Sweets Feature",
    business_name: "Maharaja Sweets",
    business_address: "73-10 37th Ave, Jackson Heights, NY 11372",
    payout: 0,
    spots_remaining: 20,
    spots_total: 30,
    deadline: "2026-05-09",
    category: "Food",
    image:
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=300&fit=crop&crop=entropy",
    tier_required: "seed",
    description:
      "Celebrate the most diverse neighborhood in the world through its incredible South Asian sweets and snacks.",
    requirements: [
      "2 stories + 1 feed post",
      "Tag location",
      "Showcase 3+ different sweets",
    ],
    lat: 40.7476,
    lng: -73.8907,
  },
  {
    id: "camp-072",
    title: "Multicultural Food Walk",
    business_name: "Jackson Heights Food Tours",
    business_address: "37th Ave & 74th St, Jackson Heights, NY 11372",
    payout: 20,
    spots_remaining: 10,
    spots_total: 18,
    deadline: "2026-05-16",
    category: "Food",
    image:
      "https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?w=400&h=300&fit=crop&crop=center",
    tier_required: "seed",
    description:
      "Document the incredible diversity of Jackson Heights street food. Indian, Colombian, Tibetan — all in one block.",
    requirements: ["3 food posts", "Tag #JacksonHeights"],
    lat: 40.7481,
    lng: -73.8917,
  },
  // ── Bronx: South Bronx / Mott Haven ──────────────────────
  {
    id: "camp-073",
    title: "Mott Haven Gallery Walk",
    business_name: "Bronx Art Space",
    business_address: "305 Exterior St, Bronx, NY 10454",
    payout: 0,
    spots_remaining: 22,
    spots_total: 35,
    deadline: "2026-05-21",
    category: "Lifestyle",
    image:
      "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=400&h=300&fit=crop&crop=entropy",
    tier_required: "seed",
    description:
      "Document the emerging art scene in Mott Haven. Studios, galleries, South Bronx creative renaissance.",
    requirements: ["3 posts from gallery walk", "Tag @bronxartspace"],
    lat: 40.8082,
    lng: -73.9224,
  },
  {
    id: "camp-074",
    title: "Bronx Bodega Culture",
    business_name: "La Morada Restaurant",
    business_address: "308 Willis Ave, Bronx, NY 10454",
    payout: 25,
    spots_remaining: 8,
    spots_total: 14,
    deadline: "2026-05-06",
    category: "Food",
    image:
      "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop&crop=center",
    tier_required: "seed",
    description:
      "Authentic Oaxacan cuisine in the South Bronx. Community gathering place, incredible mole, cultural pride.",
    requirements: ["2 stories + 1 post", "Tag @lamoradabrx"],
    lat: 40.8097,
    lng: -73.9211,
  },
  {
    id: "camp-075",
    title: "South Bronx Fitness Hub",
    business_name: "Bronx Boulders",
    business_address: "1 W Burnside Ave, Bronx, NY 10453",
    payout: 55,
    spots_remaining: 5,
    spots_total: 10,
    deadline: "2026-05-29",
    category: "Fitness",
    image:
      "https://images.unsplash.com/photo-1534258936925-c58bed479fcb?w=400&h=300&fit=crop&crop=center",
    tier_required: "explorer",
    description:
      "Rock climbing and fitness content from the Bronx's premier climbing gym. Urban athletics, community strength.",
    requirements: ["1 climbing Reel", "2 stories", "Tag @bronxboulders"],
    lat: 40.852,
    lng: -73.9124,
  },
  // ── Additional Manhattan: spread across remaining neighborhoods ──
  {
    id: "camp-076",
    title: "Brooklyn Pottery Workshop",
    business_name: "Choplet Studio",
    business_address: "309 Suydam St, Brooklyn, NY 11237",
    payout: 0,
    spots_remaining: 10,
    spots_total: 15,
    deadline: "2026-05-03",
    category: "Lifestyle",
    image:
      "https://images.unsplash.com/photo-1487530811176-3780de880c2d?w=400&h=300&fit=crop&crop=faces",
    tier_required: "seed",
    description:
      "Free pottery class in exchange for content. Hands-on, messy, authentic vibes.",
    requirements: [
      "2 Instagram stories during class",
      "1 photo of your finished piece",
    ],
    lat: 40.7036,
    lng: -73.9212,
  },
  {
    id: "camp-077",
    title: "Luxury Spa Day Feature",
    business_name: "Great Jones Spa",
    business_address: "29 Great Jones St, New York, NY 10012",
    payout: 200,
    spots_remaining: 1,
    spots_total: 2,
    deadline: "2026-06-10",
    category: "Beauty",
    image:
      "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=400&h=300&fit=crop&crop=entropy",
    tier_required: "closer",
    description:
      "Full spa day experience at NYC's best urban retreat. Thermal baths, treatments, editorial luxury content.",
    requirements: [
      "Full day documentation",
      "1 longform Reel",
      "Written review",
      "20k+ followers required",
    ],
    lat: 40.7266,
    lng: -73.9937,
  },
  {
    id: "camp-078",
    title: "NoHo Coffee Ritual",
    business_name: "Abraco",
    business_address: "86 E 7th St, New York, NY 10003",
    payout: 0,
    spots_remaining: 16,
    spots_total: 25,
    deadline: "2026-04-25",
    category: "Coffee",
    image:
      "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&h=300&fit=crop&crop=faces",
    tier_required: "seed",
    description:
      "Tiny cafe, massive vibes. Share your morning coffee story at NYC's most intimate espresso bar.",
    requirements: ["1 story or feed post", "Tag @abraconyc"],
    lat: 40.7261,
    lng: -73.9875,
  },
  {
    id: "camp-079",
    title: "High-Line Fashion Walk",
    business_name: "Madewell High Line",
    business_address: "107 W 15th St, New York, NY 10011",
    payout: 85,
    spots_remaining: 3,
    spots_total: 6,
    deadline: "2026-05-27",
    category: "Retail",
    image:
      "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=400&h=300&fit=crop&crop=center",
    tier_required: "operator",
    description:
      "Style walk along the High Line showcasing spring Madewell collection. Urban outdoor, casual chic editorial.",
    requirements: [
      "3 outfit shots on High Line",
      "1 Reel walking the trail",
      "Tag @madewell",
    ],
    lat: 40.7432,
    lng: -74.0045,
  },
  {
    id: "camp-080",
    title: "Michelin Star Tasting Menu",
    business_name: "Eleven Madison Park",
    business_address: "11 Madison Ave, New York, NY 10010",
    payout: 350,
    spots_remaining: 1,
    spots_total: 1,
    deadline: "2026-06-15",
    category: "Food",
    image:
      "https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=400&h=300&fit=crop&crop=entropy",
    tier_required: "partner",
    description:
      "Flagship partnership with NYC's most celebrated restaurant. Three Michelin stars, plant-based tasting menu. Elite creators only.",
    requirements: [
      "Full meal documentation",
      "Editorial quality photos",
      "1 longform video",
      "100k+ audience required",
    ],
    lat: 40.7416,
    lng: -73.9874,
  },
  {
    id: "camp-081",
    title: "Flatiron Yoga Studio",
    business_name: "Y7 Studio Flatiron",
    business_address: "28 W 25th St, New York, NY 10010",
    payout: 45,
    spots_remaining: 5,
    spots_total: 10,
    deadline: "2026-05-13",
    category: "Fitness",
    image:
      "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&h=300&fit=crop&crop=entropy",
    tier_required: "explorer",
    description:
      "Hip hop yoga in candlelit studio. Dark, moody, fierce fitness content.",
    requirements: [
      "1 Reel from class",
      "2 atmospheric stories",
      "Tag @y7studio",
    ],
    lat: 40.7437,
    lng: -73.9917,
  },
  {
    id: "camp-082",
    title: "Gramercy Park Cafe Scene",
    business_name: "Friend of a Farmer",
    business_address: "77 Irving Pl, New York, NY 10003",
    payout: 20,
    spots_remaining: 10,
    spots_total: 18,
    deadline: "2026-05-05",
    category: "Food",
    image:
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=300&fit=crop&crop=faces",
    tier_required: "seed",
    description:
      "Cozy farmhouse brunch near Gramercy Park. Warm interiors, seasonal dishes, neighborhood charm.",
    requirements: ["1 feed post or stories", "Tag @friendofafarmer"],
    lat: 40.7366,
    lng: -73.9847,
  },
  {
    id: "camp-083",
    title: "Inwood Coffee Roasters",
    business_name: "Uptown Roasters",
    business_address: "4869 Broadway, New York, NY 10034",
    payout: 0,
    spots_remaining: 18,
    spots_total: 25,
    deadline: "2026-05-19",
    category: "Coffee",
    image:
      "https://images.unsplash.com/photo-1536256263959-770b48d82b0a?w=400&h=300&fit=crop&crop=faces",
    tier_required: "seed",
    description:
      "Northern Manhattan's hidden gem roastery. Local community, craft coffee, off-the-beaten-path NYC.",
    requirements: ["1 story or feed post", "Tag the roastery"],
    lat: 40.8675,
    lng: -73.9213,
  },
  {
    id: "camp-084",
    title: "Washington Heights Salon",
    business_name: "Mia Bella Salon",
    business_address: "600 W 181st St, New York, NY 10033",
    payout: 35,
    spots_remaining: 5,
    spots_total: 10,
    deadline: "2026-05-12",
    category: "Beauty",
    image:
      "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400&h=300&fit=crop&crop=center",
    tier_required: "explorer",
    description:
      "Dominican blowout and styling at Washington Heights' favorite salon. Community warmth, beautiful results.",
    requirements: ["Before/after Reel", "2 stories", "Tag the salon"],
    lat: 40.8491,
    lng: -73.9381,
  },
  {
    id: "camp-085",
    title: "NoMad Cocktail Bar Feature",
    business_name: "The NoMad Bar",
    business_address: "10 W 28th St, New York, NY 10001",
    payout: 110,
    spots_remaining: 2,
    spots_total: 4,
    deadline: "2026-05-31",
    category: "Food",
    image:
      "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=400&h=300&fit=crop&crop=center",
    tier_required: "proven",
    description:
      "Iconic bar experience at the NoMad Hotel. Classic cocktails, architecture, elevated NYC nightlife.",
    requirements: ["2 feed posts", "3 moody stories", "Tag @thenomad"],
    lat: 40.7458,
    lng: -73.9884,
  },
  {
    id: "camp-086",
    title: "Nolita Boutique Launch",
    business_name: "Catbird",
    business_address: "22 Mott St, New York, NY 10013",
    payout: 130,
    spots_remaining: 2,
    spots_total: 4,
    deadline: "2026-06-05",
    category: "Retail",
    image:
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop&crop=faces",
    tier_required: "proven",
    description:
      "Jewelry and accessories editorial at beloved Nolita boutique. Delicate, feminine, editorial-quality content.",
    requirements: [
      "3 jewelry detail shots",
      "1 Reel try-on",
      "10k+ followers required",
    ],
    lat: 40.7153,
    lng: -73.9984,
  },
  {
    id: "camp-087",
    title: "Meatpacking Brunch Scene",
    business_name: "The Monarch Room",
    business_address: "27 Little W 12th St, New York, NY 10014",
    payout: 70,
    spots_remaining: 4,
    spots_total: 8,
    deadline: "2026-05-24",
    category: "Food",
    image:
      "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop&crop=entropy",
    tier_required: "operator",
    description:
      "Weekend brunch in the Meatpacking District. Rooftop views, signature cocktails, fashion crowd.",
    requirements: [
      "1 Reel featuring the brunch",
      "3 stories",
      "Tag the restaurant",
    ],
    lat: 40.7407,
    lng: -74.0062,
  },
  {
    id: "camp-088",
    title: "Bushwick Fitness Drop-In",
    business_name: "Overthrow Boxing Club",
    business_address: "9 Ave A, New York, NY 10009",
    payout: 60,
    spots_remaining: 4,
    spots_total: 8,
    deadline: "2026-05-26",
    category: "Fitness",
    image:
      "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400&h=300&fit=crop&crop=faces",
    tier_required: "operator",
    description:
      "NYC's most stylish boxing gym. Luxury finishes, raw energy, aspirational urban fitness content.",
    requirements: [
      "1 training Reel",
      "3 gym aesthetic stories",
      "Tag @overthrowboxing",
    ],
    lat: 40.7261,
    lng: -73.9836,
  },
  {
    id: "camp-089",
    title: "Bed-Stuy Natural Beauty",
    business_name: "Nubian Heritage",
    business_address: "436 Nostrand Ave, Brooklyn, NY 11216",
    payout: 40,
    spots_remaining: 6,
    spots_total: 10,
    deadline: "2026-05-17",
    category: "Beauty",
    image:
      "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=300&fit=crop&crop=faces",
    tier_required: "explorer",
    description:
      "Natural skincare and body care product discovery in Bed-Stuy. Celebrating Black beauty and wellness culture.",
    requirements: ["Product showcase Reel", "2 stories", "Tag @nubianheritage"],
    lat: 40.6866,
    lng: -73.9509,
  },
  {
    id: "camp-090",
    title: "Astoria Vintage Market",
    business_name: "Astoria Market",
    business_address: "31-00 Steinway St, Astoria, NY 11103",
    payout: 20,
    spots_remaining: 10,
    spots_total: 18,
    deadline: "2026-05-23",
    category: "Retail",
    image:
      "https://images.unsplash.com/photo-1582552938357-32b906df40cb?w=400&h=300&fit=crop&crop=faces",
    tier_required: "seed",
    description:
      "Weekly vintage market with global sellers. Queens diversity, unique finds, treasure hunt energy.",
    requirements: ["3 shots of your finds", "Tag @astoriamarket"],
    lat: 40.7713,
    lng: -73.9268,
  },
  {
    id: "camp-091",
    title: "Greenpoint Yoga Retreat",
    business_name: "Greenhouse Holistic",
    business_address: "62 Calyer St, Brooklyn, NY 11222",
    payout: 50,
    spots_remaining: 5,
    spots_total: 10,
    deadline: "2026-06-02",
    category: "Fitness",
    image:
      "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&h=300&fit=crop&crop=faces",
    tier_required: "explorer",
    description:
      "Intimate yoga and meditation studio in Greenpoint. Serene, healing, mindful content welcome.",
    requirements: [
      "1 Reel from session",
      "2 ambient stories",
      "Tag @greenhouseholistic",
    ],
    lat: 40.7296,
    lng: -73.9518,
  },
  {
    id: "camp-092",
    title: "Crown Heights Ramen Shop",
    business_name: "Ariyoshi Ramen",
    business_address: "742 Franklin Ave, Brooklyn, NY 11238",
    payout: 40,
    spots_remaining: 5,
    spots_total: 8,
    deadline: "2026-05-22",
    category: "Food",
    image:
      "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=400&h=300&fit=crop&crop=entropy",
    tier_required: "explorer",
    description:
      "Authentic ramen experience in Crown Heights. Rich broth, neighborhood authenticity, Japanese craft.",
    requirements: ["1 food Reel", "2 stories", "Tag the restaurant"],
    lat: 40.6701,
    lng: -73.9581,
  },
  {
    id: "camp-093",
    title: "Flatiron Creative Agency Pop-Up",
    business_name: "Moxy NYC Chelsea",
    business_address: "105 W 28th St, New York, NY 10001",
    payout: 160,
    spots_remaining: 2,
    spots_total: 4,
    deadline: "2026-06-08",
    category: "Lifestyle",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop&crop=entropy",
    tier_required: "closer",
    description:
      "Creator pop-up event at the Moxy Chelsea. Networking, content creation, hotel lifestyle. Premium creator partnership.",
    requirements: [
      "Full event documentation",
      "1 branded Reel",
      "15k+ followers required",
    ],
    lat: 40.7462,
    lng: -73.9924,
  },
  {
    id: "camp-094",
    title: "LES Cocktail Bar Feature",
    business_name: "Attaboy",
    business_address: "134 Eldridge St, New York, NY 10002",
    payout: 80,
    spots_remaining: 3,
    spots_total: 5,
    deadline: "2026-05-30",
    category: "Food",
    image:
      "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=400&h=300&fit=crop&crop=entropy",
    tier_required: "operator",
    description:
      "No-menu cocktail bar experience in the LES. Bartender creativity, intimate speakeasy, craft culture.",
    requirements: ["1 atmospheric Reel", "3 stories", "Tag @attaboynyc"],
    lat: 40.7181,
    lng: -73.9906,
  },
  {
    id: "camp-095",
    title: "DUMBO Design District Walk",
    business_name: "Penelope and Cleo",
    business_address: "55 Washington St, Brooklyn, NY 11201",
    payout: 55,
    spots_remaining: 4,
    spots_total: 8,
    deadline: "2026-06-03",
    category: "Lifestyle",
    image:
      "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=400&h=300&fit=crop&crop=center",
    tier_required: "operator",
    description:
      "Design boutique and artisan shop walk in DUMBO. Brooklyn creativity, handcrafted goods, editorial content.",
    requirements: [
      "2 feed posts from the walk",
      "3 stories",
      "Tag the boutique",
    ],
    lat: 40.7035,
    lng: -73.9889,
  },
  {
    id: "camp-096",
    title: "Ridgewood Coffee Scene",
    business_name: "Remi Flower & Coffee",
    business_address: "899 Seneca Ave, Ridgewood, NY 11385",
    payout: 0,
    spots_remaining: 20,
    spots_total: 30,
    deadline: "2026-05-25",
    category: "Coffee",
    image:
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=300&fit=crop&crop=center",
    tier_required: "seed",
    description:
      "Cafe and flower shop combo in emerging Ridgewood. Whimsical, photogenic, neighborhood discovery content.",
    requirements: ["1 story or feed post", "Tag the cafe"],
    lat: 40.7053,
    lng: -73.9074,
  },
  {
    id: "camp-097",
    title: "Hell's Kitchen Food Tour",
    business_name: "Danji",
    business_address: "346 W 52nd St, New York, NY 10019",
    payout: 95,
    spots_remaining: 3,
    spots_total: 6,
    deadline: "2026-06-06",
    category: "Food",
    image:
      "https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=400&h=300&fit=crop&crop=center",
    tier_required: "proven",
    description:
      "Korean tapas at NYC's acclaimed Hell's Kitchen restaurant. Inventive, Michelin-starred small plates.",
    requirements: ["3 food posts", "1 dining Reel", "Tag @danjinyc"],
    lat: 40.7634,
    lng: -73.9883,
  },
  {
    id: "camp-098",
    title: "Soho Fashion Week Collab",
    business_name: "Staud Boutique",
    business_address: "79 Greene St, New York, NY 10012",
    payout: 280,
    spots_remaining: 1,
    spots_total: 2,
    deadline: "2026-06-20",
    category: "Retail",
    image:
      "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=400&h=300&fit=crop&crop=faces",
    tier_required: "partner",
    description:
      "Flagship partnership with STAUD for their NYC showcase. High-fashion editorial, top-tier production. Partner-level only.",
    requirements: [
      "Full editorial shoot",
      "3 Reels",
      "Written feature",
      "75k+ audience required",
    ],
    lat: 40.7242,
    lng: -74.0018,
  },
  {
    id: "camp-099",
    title: "Astoria Park Outdoor Fitness",
    business_name: "Queens CrossFit",
    business_address: "21-70 34th Ave, Astoria, NY 11106",
    payout: 30,
    spots_remaining: 7,
    spots_total: 12,
    deadline: "2026-05-28",
    category: "Fitness",
    image:
      "https://images.unsplash.com/photo-1534258936925-c58bed479fcb?w=400&h=300&fit=crop&crop=faces",
    tier_required: "seed",
    description:
      "Outdoor WOD in Astoria with Triboro Bridge views. Community fitness, Queens pride, raw athletic energy.",
    requirements: ["1 workout Reel", "2 stories", "Tag @queenscrossfit"],
    lat: 40.7741,
    lng: -73.9338,
  },
  {
    id: "camp-100",
    title: "Tribeca Film Festival Cafe",
    business_name: "Locanda Verde",
    business_address: "377 Greenwich St, New York, NY 10013",
    payout: 170,
    spots_remaining: 2,
    spots_total: 4,
    deadline: "2026-06-12",
    category: "Food",
    image:
      "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop&crop=entropy",
    tier_required: "closer",
    description:
      "Film festival season dining feature at Robert De Niro's iconic Tribeca restaurant. Celebrity clientele, premium Italian, editorial-quality content.",
    requirements: [
      "Full meal documentation",
      "1 longform dining Reel",
      "Written review",
      "20k+ followers required",
    ],
    lat: 40.7203,
    lng: -74.0104,
  },
];

const DEMO_APPLICATIONS: Application[] = [
  {
    id: "app-001",
    campaign_id: "camp-003",
    status: "accepted",
    milestone: "scheduled",
    payout: 75,
    created_at: "2026-04-05T10:00:00Z",
    campaign_title: "LA Botanica Aesthetic Shoot",
    merchant_name: "Flamingo Estate",
    deadline: "2026-05-05",
    category: "Lifestyle",
  },
  {
    id: "app-002",
    campaign_id: "camp-002",
    status: "accepted",
    milestone: "verified",
    payout: 35,
    created_at: "2026-03-20T09:00:00Z",
    campaign_title: "Best Burger in NYC Feature",
    merchant_name: "Superiority Burger",
    deadline: "2026-04-25",
    category: "Food",
  },
  {
    id: "app-003",
    campaign_id: "camp-004",
    status: "pending",
    milestone: "accepted",
    payout: 50,
    created_at: "2026-04-08T14:00:00Z",
    campaign_title: "Brow Transformation Story",
    merchant_name: "Brow Theory",
    deadline: "2026-04-28",
    category: "Beauty",
  },
  {
    id: "app-004",
    campaign_id: "camp-006",
    status: "accepted",
    milestone: "settled",
    payout: 20,
    created_at: "2026-03-10T11:00:00Z",
    campaign_title: "Le Bec-Fin Pop-Up Review",
    merchant_name: "Le Bec Fin",
    deadline: "2026-04-22",
    category: "Food",
  },
];

const DEMO_PAYOUTS: Payout[] = [
  {
    id: "pay-001",
    campaign_title: "Le Bec-Fin Pop-Up Review",
    merchant_name: "Le Bec Fin",
    amount: 20,
    commission_amount: 0,
    payout_type: "base",
    status: "completed",
    paid_at: "2026-03-25T00:00:00Z",
    created_at: "2026-03-25T00:00:00Z",
  },
  {
    id: "pay-002",
    campaign_title: "Best Burger in NYC Feature",
    merchant_name: "Superiority Burger",
    amount: 35,
    commission_amount: 5.25,
    payout_type: "base",
    status: "completed",
    paid_at: "2026-04-02T00:00:00Z",
    created_at: "2026-04-02T00:00:00Z",
  },
  {
    id: "pay-003",
    campaign_title: "Blank Street Morning",
    merchant_name: "Blank Street Coffee",
    amount: 0,
    commission_amount: 0,
    payout_type: "base",
    status: "completed",
    paid_at: "2026-03-15T00:00:00Z",
    created_at: "2026-03-15T00:00:00Z",
  },
  {
    id: "pay-004",
    campaign_title: "LA Botanica Aesthetic Shoot",
    merchant_name: "Flamingo Estate",
    amount: 75,
    commission_amount: 11.25,
    payout_type: "base",
    status: "pending",
    paid_at: null,
    created_at: "2026-04-10T00:00:00Z",
  },
  {
    id: "pay-005",
    campaign_title: "Brow Transformation Story",
    merchant_name: "Brow Theory",
    amount: 0,
    commission_amount: 0,
    payout_type: "base",
    status: "processing",
    paid_at: null,
    created_at: "2026-04-09T00:00:00Z",
  },
];

/* ── Helpers ─────────────────────────────────────────────── */

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

function formatCurrency(n: number): string {
  return n === 0 ? "Free" : `$${n.toFixed(0)}`;
}

function daysLeft(deadline?: string | null): number | null {
  if (!deadline) return null;
  const diff = new Date(deadline).getTime() - Date.now();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

function isEligible(creatorTier: CreatorTier, required: CreatorTier): boolean {
  return TIER_ORDER.indexOf(creatorTier) >= TIER_ORDER.indexOf(required);
}

/** Smart recommendation: campaigns matching tier, good payout, ending soon */
function getRecommended(
  campaigns: Campaign[],
  creatorTier: CreatorTier,
  appliedIds: Set<string>,
): Campaign[] {
  return campaigns
    .filter((c) => isEligible(creatorTier, c.tier_required))
    .filter((c) => !appliedIds.has(c.id))
    .filter((c) => c.spots_remaining > 0)
    .sort((a, b) => {
      // Prioritize: ending soonest + highest payout
      const da = a.deadline ? new Date(a.deadline).getTime() : Infinity;
      const db = b.deadline ? new Date(b.deadline).getTime() : Infinity;
      const timeScore = da - db;
      const payScore = b.payout - a.payout;
      return timeScore * 0.4 + payScore * 0.6;
    })
    .slice(0, 3);
}

/** Build a short reason string for a recommended campaign */
function getRecReason(c: Campaign, creatorTier: CreatorTier): string {
  const reasons: string[] = [];
  const days = daysLeft(c.deadline);
  if (days !== null && days <= 5) reasons.push("Ending soon");
  if (c.payout > 50) reasons.push("High payout");
  if (c.tier_required === creatorTier) reasons.push("Perfect for your tier");
  return reasons.join(" · ");
}

/* ── Main component ──────────────────────────────────────── */

export default function CreatorDashboard() {
  const router = useRouter();
  const [demo, setDemo] = useState(false);
  const [creator, setCreator] = useState<Creator | null>(null);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [payouts, setPayouts] = useState<Payout[]>([]);
  const [loading, setLoading] = useState(true);
  const [appliedIds, setAppliedIds] = useState<Set<string>>(new Set());
  const [showPaycheck, setShowPaycheck] = useState(false);

  // View & panel state
  const [view, setView] = useState<DashView>("discover");
  const [panelCollapsed, setPanelCollapsed] = useState(false);
  const [slideOpen, setSlideOpen] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(
    null,
  );

  // Map interaction
  const [activeId, setActiveId] = useState<string | undefined>();
  const [hoveredId, setHoveredId] = useState<string | undefined>();

  // Filters (discover view)
  const [filter, setFilter] = useState("All");
  const [sortKey, setSortKey] = useState<SortKey>("newest");
  const [filtersOpen, setFiltersOpen] = useState(true);

  // Campaigns view filter
  const [appStatusFilter, setAppStatusFilter] = useState<
    "all" | "active" | "pending" | "completed"
  >("all");

  /* ── Data loading ─────────────────────────────────────── */

  const loadRealData = useCallback(async () => {
    const supabase = createClient();
    const {
      data: { user: authUser },
    } = await supabase.auth.getUser();

    if (!authUser) {
      router.replace("/creator/signup");
      return;
    }

    const { data: creatorData } = await supabase
      .from("creators")
      .select("*")
      .eq("user_id", authUser.id)
      .single();

    if (creatorData) setCreator(creatorData as Creator);

    const { data: campaignsData } = await supabase
      .from("campaigns")
      .select(
        `id, title, payout, spots_remaining, spots_total, deadline, lat, lng, category, image, tier_required, description, requirements, merchants(business_name, address)`,
      )
      .eq("status", "active")
      .order("created_at", { ascending: false })
      .limit(50);

    if (campaignsData) {
      setCampaigns(
        campaignsData.map((c) => ({
          ...c,
          payout: Number(c.payout),
          business_name:
            (c.merchants as unknown as { business_name: string } | null)
              ?.business_name ?? "Local Business",
          business_address: (
            c.merchants as unknown as { address: string } | null
          )?.address,
        })) as Campaign[],
      );
    }

    const { data: appsData } = await supabase
      .from("applications")
      .select(
        `id, campaign_id, status, milestone, payout, created_at, campaigns(title, deadline, category, merchants(business_name))`,
      )
      .eq("creator_id", authUser.id)
      .order("created_at", { ascending: false });

    if (appsData) {
      setApplications(
        appsData.map((a) => ({
          id: a.id,
          campaign_id: a.campaign_id,
          status: a.status,
          milestone: a.milestone,
          payout: Number(a.payout),
          created_at: a.created_at,
          campaign_title:
            (a.campaigns as unknown as { title: string } | null)?.title ?? "",
          merchant_name:
            (
              a.campaigns as unknown as {
                merchants: { business_name: string };
              } | null
            )?.merchants?.business_name ?? "",
          deadline: (a.campaigns as unknown as { deadline: string } | null)
            ?.deadline,
          category: (a.campaigns as unknown as { category: string } | null)
            ?.category,
        })) as Application[],
      );
      setAppliedIds(new Set(appsData.map((a) => a.campaign_id)));
    }

    const { data: payoutsData } = await supabase
      .from("payouts")
      .select("*")
      .eq("creator_id", authUser.id)
      .order("created_at", { ascending: false });

    if (payoutsData) setPayouts(payoutsData as Payout[]);

    setLoading(false);
  }, [router]);

  useEffect(() => {
    const isDemo = checkDemoMode();
    setDemo(isDemo);
    if (isDemo) {
      setCreator(DEMO_CREATOR);
      setCampaigns(DEMO_CAMPAIGNS);
      setApplications(DEMO_APPLICATIONS);
      setPayouts(DEMO_PAYOUTS);
      setAppliedIds(new Set(DEMO_APPLICATIONS.map((a) => a.campaign_id)));
      setLoading(false);
      return;
    }
    loadRealData();
  }, [loadRealData]);

  /* ── Derived data ─────────────────────────────────────── */

  const activeApps = applications.filter(
    (a) => a.status === "accepted" && a.milestone !== "settled",
  ).length;
  const pendingApps = applications.filter((a) => a.status === "pending").length;
  const completedApps = applications.filter(
    (a) => a.milestone === "settled",
  ).length;

  // Filtered & sorted campaigns for discover view
  const filteredCampaigns = useMemo(() => {
    let result = campaigns;
    if (filter !== "All") {
      result = result.filter((c) => c.category === filter);
    }
    switch (sortKey) {
      case "highest-pay":
        result = [...result].sort((a, b) => b.payout - a.payout);
        break;
      case "ending-soon":
        result = [...result].sort((a, b) => {
          const da = a.deadline ? new Date(a.deadline).getTime() : Infinity;
          const db = b.deadline ? new Date(b.deadline).getTime() : Infinity;
          return da - db;
        });
        break;
      case "most-spots":
        result = [...result].sort(
          (a, b) => b.spots_remaining - a.spots_remaining,
        );
        break;
      default:
        // newest — preserve original order
        break;
    }
    return result;
  }, [campaigns, filter, sortKey]);

  // Filtered applications for campaigns view
  const filteredApplications = useMemo(() => {
    return applications.filter((a) => {
      if (appStatusFilter === "all") return true;
      if (appStatusFilter === "active")
        return a.status === "accepted" && a.milestone !== "settled";
      if (appStatusFilter === "completed") return a.milestone === "settled";
      if (appStatusFilter === "pending") return a.status === "pending";
      return true;
    });
  }, [applications, appStatusFilter]);

  // Smart recommendations
  const recommended = useMemo(
    () => (creator ? getRecommended(campaigns, creator.tier, appliedIds) : []),
    [campaigns, creator, appliedIds],
  );

  // Panel header stats for discover view
  const eligibleCount = useMemo(
    () =>
      creator
        ? campaigns.filter((c) => isEligible(creator.tier, c.tier_required))
            .length
        : 0,
    [campaigns, creator],
  );

  // Tier progress
  const tierProgress = useMemo(() => {
    if (!creator)
      return { pct: 0, nextTier: null as CreatorTier | null, nextMin: 100 };
    const currentIdx = TIER_ORDER.indexOf(creator.tier);
    const nextTier =
      currentIdx < TIER_ORDER.length - 1 ? TIER_ORDER[currentIdx + 1] : null;
    const currentMin = TIER_SCORE_THRESHOLDS[creator.tier];
    const nextMin = nextTier ? TIER_SCORE_THRESHOLDS[nextTier] : 100;
    const pct = nextTier
      ? Math.min(
          100,
          Math.max(
            0,
            Math.round(
              ((creator.push_score - currentMin) / (nextMin - currentMin)) *
                100,
            ),
          ),
        )
      : 100;
    return { pct, nextTier, nextMin };
  }, [creator]);

  /* ── Handlers ─────────────────────────────────────────── */

  function handlePinClick(id: string) {
    setActiveId((prev) => (prev === id ? undefined : id));
    // Scroll card into view in panel
    const card = document.querySelector(`[data-campaign-id="${id}"]`);
    card?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  function handleCardClick(campaign: Campaign) {
    setActiveId(campaign.id);
    setSelectedCampaign(campaign);
    setSlideOpen(true);
  }

  function handlePopupClose() {
    setActiveId(undefined);
  }

  function handleApply(campaignId: string) {
    if (demo) {
      setAppliedIds((prev) => new Set([...prev, campaignId]));
      return;
    }
    router.push(`/creator/apply/${campaignId}`);
  }

  async function handleSignOut() {
    if (demo) {
      document.cookie =
        "push-demo-role=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      router.replace("/");
      return;
    }
    const supabase = createClient();
    await supabase.auth.signOut();
    router.replace("/creator/signup");
  }

  function closeSlide() {
    setSlideOpen(false);
    setSelectedCampaign(null);
  }

  /* ── Map data ─────────────────────────────────────────── */

  // Stable center — use first campaign from full list (not filtered), or NYC
  const mapCenter: [number, number] =
    campaigns.length > 0 ? [campaigns[0].lat, campaigns[0].lng] : NYC;

  const displayId = activeId ?? hoveredId;

  /* ── Loading state ────────────────────────────────────── */

  if (loading) {
    return (
      <div className="dash-loading">
        <span>Loading...</span>
      </div>
    );
  }

  if (!creator) return null;

  /* ── Render ────────────────────────────────────────────── */

  return (
    <div className="dash">
      {/* ── Top Bar ─────────────────────────────────────── */}
      <header className="dash-topbar">
        <Link href="/" className="dash-logo">
          Push
        </Link>

        {/* Center: view switcher */}
        <div className="dash-topbar-center">
          <div className="dash-view-switcher">
            {(
              [
                ["discover", "Discover"],
                ["campaigns", "My Campaigns"],
                ["earnings", "Earnings"],
              ] as [DashView, string][]
            ).map(([v, label]) => (
              <button
                key={v}
                className={`dash-view-btn${view === v ? " dash-view-btn--active" : ""}`}
                onClick={() => setView(v)}
              >
                {label}
                {v === "campaigns" && activeApps + pendingApps > 0 && (
                  <span style={{ marginLeft: 4, opacity: 0.7 }}>
                    {activeApps + pendingApps}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Right: tier + score + actions */}
        <div className="dash-topbar-right">
          {demo && (
            <span
              className="dash-filter-chip dash-filter-chip--active"
              style={{
                background: "var(--primary)",
                borderColor: "var(--primary)",
                color: "#fff",
                fontSize: 9,
                cursor: "default",
              }}
            >
              Demo
            </span>
          )}
          <div className="dash-tier-strip">
            <span className="dash-tier-label">{TIER_LABELS[creator.tier]}</span>
            <span className="dash-score-num">{creator.push_score}</span>
            <div className="dash-tier-progress">
              <div
                className="dash-tier-progress-fill"
                style={{ width: `${tierProgress.pct}%` }}
              />
            </div>
          </div>

          <button
            className="dash-topbar-btn"
            onClick={() => router.push("/creator/profile")}
            title="Profile"
          >
            {creator.name.charAt(0).toUpperCase()}
          </button>
          <button
            className="dash-topbar-btn"
            onClick={handleSignOut}
            title="Sign out"
          >
            &rarr;
          </button>
        </div>
      </header>

      {/* ── Body ────────────────────────────────────────── */}
      <div className="dash-body">
        {/* Full-screen map */}
        <div
          className={`dash-map${view !== "discover" ? " dash-map--dimmed" : ""}`}
        >
          <MapView
            campaigns={filteredCampaigns}
            center={mapCenter}
            activeId={displayId}
            onPinClick={handlePinClick}
            onPopupClose={handlePopupClose}
            showPricePills={view === "discover"}
            showPopups={view === "discover"}
            mono
          />
        </div>

        {/* ── Left Panel ───────────────────────────────── */}
        <aside
          className={`dash-panel${panelCollapsed ? " dash-panel--collapsed" : ""}`}
        >
          <button
            className="dash-panel-toggle"
            onClick={() => setPanelCollapsed(!panelCollapsed)}
            aria-label={panelCollapsed ? "Expand panel" : "Collapse panel"}
          >
            {panelCollapsed ? ">" : "<"}
          </button>

          {/* === DISCOVER VIEW === */}
          {view === "discover" && (
            <>
              <div className="dash-panel-header">
                <span className="dash-panel-title">Discover</span>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 11, color: "var(--text-muted)" }}>
                    {campaigns.length} near you &middot; {eligibleCount}{" "}
                    eligible
                  </span>
                  <button
                    className="dash-filters-toggle"
                    onClick={() => setFiltersOpen((v) => !v)}
                    aria-label={
                      filtersOpen ? "Collapse filters" : "Expand filters"
                    }
                    title={filtersOpen ? "Collapse filters" : "Expand filters"}
                  >
                    {filtersOpen ? "▲" : "▼"}
                  </button>
                </div>
              </div>

              {/* Category filters + Sort row — collapsible */}
              {filtersOpen && (
                <>
                  <div className="dash-panel-filters">
                    {CATEGORIES.map((cat) => (
                      <button
                        key={cat}
                        className={`dash-filter-chip${filter === cat ? " dash-filter-chip--active" : ""}`}
                        onClick={() => setFilter(cat)}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>

                  <div className="dash-panel-sort">
                    {SORT_OPTIONS.map((opt) => (
                      <button
                        key={opt.key}
                        className={`dash-sort-btn${sortKey === opt.key ? " dash-sort-btn--active" : ""}`}
                        onClick={() => setSortKey(opt.key)}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </>
              )}

              {/* Smart recommendations */}
              {recommended.length > 0 && (
                <div className="dash-recs">
                  <div className="dash-recs-title">
                    <span aria-hidden="true">*</span> Recommended for you
                  </div>
                  {recommended.map((c) => (
                    <div
                      key={c.id}
                      className="dash-card dash-card--recommended"
                      data-campaign-id={c.id}
                      onClick={() => handleCardClick(c)}
                      onMouseEnter={() => setHoveredId(c.id)}
                      onMouseLeave={() => setHoveredId(undefined)}
                    >
                      <div className="dash-card-thumb">
                        {c.image ? (
                          <img src={c.image} alt={c.title} loading="lazy" />
                        ) : (
                          <span style={{ fontSize: 20 }}>
                            {c.business_name[0]}
                          </span>
                        )}
                      </div>
                      <div className="dash-card-info">
                        <span className="dash-card-business">
                          {c.business_name}
                        </span>
                        <span className="dash-card-title">{c.title}</span>
                        {getRecReason(c, creator.tier) && (
                          <span className="dash-card-rec-reason">
                            {getRecReason(c, creator.tier)}
                          </span>
                        )}
                      </div>
                      <span className="dash-card-payout">
                        {formatCurrency(c.payout)}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* Campaign list */}
              <div className="dash-campaign-list">
                {filteredCampaigns.length === 0 ? (
                  <div className="dash-empty">
                    <div className="dash-empty-icon">*</div>
                    <p className="dash-empty-title">No campaigns found</p>
                    <p className="dash-empty-msg">
                      Try adjusting your filters.
                    </p>
                  </div>
                ) : (
                  filteredCampaigns.map((c) => {
                    const eligible = isEligible(creator.tier, c.tier_required);
                    const applied = appliedIds.has(c.id);
                    const days = daysLeft(c.deadline);
                    const isActive = activeId === c.id;

                    return (
                      <div
                        key={c.id}
                        data-campaign-id={c.id}
                        className={[
                          "dash-card",
                          isActive ? "dash-card--active" : "",
                          !eligible ? "dash-card--locked" : "",
                        ]
                          .filter(Boolean)
                          .join(" ")}
                        onClick={() => handleCardClick(c)}
                        onMouseEnter={() => setHoveredId(c.id)}
                        onMouseLeave={() => setHoveredId(undefined)}
                      >
                        <div className="dash-card-thumb">
                          {c.image ? (
                            <img src={c.image} alt={c.title} loading="lazy" />
                          ) : (
                            <span style={{ fontSize: 20 }}>
                              {c.business_name[0]}
                            </span>
                          )}
                        </div>
                        <div className="dash-card-info">
                          <span className="dash-card-business">
                            {c.business_name}
                          </span>
                          <span className="dash-card-title">{c.title}</span>
                          <div className="dash-card-meta">
                            <span>
                              {c.spots_remaining} spot
                              {c.spots_remaining !== 1 ? "s" : ""}
                            </span>
                            {days !== null && days > 0 && (
                              <span>
                                {days <= 3
                                  ? `${days}d left`
                                  : formatDate(c.deadline!)}
                              </span>
                            )}
                            {!eligible && (
                              <span style={{ color: "var(--primary)" }}>
                                {TIER_LABELS[c.tier_required]}+
                              </span>
                            )}
                            {applied && (
                              <span style={{ color: "var(--tertiary)" }}>
                                Applied
                              </span>
                            )}
                          </div>
                        </div>
                        <span className="dash-card-payout">
                          {formatCurrency(c.payout)}
                        </span>
                        {!eligible && (
                          <div className="dash-card-tier-lock">
                            <span>{TIER_LABELS[c.tier_required]}+</span>
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </>
          )}

          {/* === CAMPAIGNS VIEW === */}
          {view === "campaigns" && (
            <>
              <div className="dash-panel-header">
                <span className="dash-panel-title">My Campaigns</span>
                <span style={{ fontSize: 11, color: "var(--text-muted)" }}>
                  {activeApps} active
                </span>
              </div>

              <div className="dash-panel-filters">
                {(
                  [
                    ["all", "All"],
                    ["active", "Active"],
                    ["pending", "Pending"],
                    ["completed", "Done"],
                  ] as [typeof appStatusFilter, string][]
                ).map(([val, label]) => (
                  <button
                    key={val}
                    className={`dash-filter-chip${appStatusFilter === val ? " dash-filter-chip--active" : ""}`}
                    onClick={() => setAppStatusFilter(val)}
                  >
                    {label}
                  </button>
                ))}
              </div>

              <div className="dash-app-list">
                {filteredApplications.length === 0 ? (
                  <div className="dash-empty">
                    <div className="dash-empty-icon">*</div>
                    <p className="dash-empty-title">
                      {applications.length === 0
                        ? "No campaigns yet"
                        : "None in this filter"}
                    </p>
                    <p className="dash-empty-msg">
                      {applications.length === 0
                        ? "Switch to Discover to find your first campaign."
                        : "Try a different filter."}
                    </p>
                  </div>
                ) : (
                  filteredApplications.map((app) => {
                    const currentMilestoneIdx = MILESTONES.indexOf(
                      app.milestone,
                    );

                    return (
                      <div
                        key={app.id}
                        className={`dash-app-card${activeId === app.campaign_id ? " dash-app-card--active" : ""}`}
                        onClick={() => setActiveId(app.campaign_id)}
                      >
                        <div className="dash-app-card-header">
                          <div>
                            <span className="dash-app-card-biz">
                              {app.merchant_name}
                            </span>
                            <span className="dash-app-card-title">
                              {app.campaign_title}
                            </span>
                          </div>
                          <span className="dash-app-card-payout">
                            {formatCurrency(app.payout)}
                          </span>
                        </div>

                        {/* Milestone dots */}
                        <div className="dash-app-milestone">
                          {MILESTONES.map((m, i) => {
                            const done = i < currentMilestoneIdx;
                            const active = i === currentMilestoneIdx;
                            return (
                              <span key={m}>
                                <span
                                  className={[
                                    "dash-milestone-dot",
                                    done ? "dash-milestone-dot--done" : "",
                                    active ? "dash-milestone-dot--active" : "",
                                  ]
                                    .filter(Boolean)
                                    .join(" ")}
                                />
                                {i < MILESTONES.length - 1 && (
                                  <span
                                    className={`dash-milestone-connector${done ? " dash-milestone-connector--done" : ""}`}
                                  />
                                )}
                              </span>
                            );
                          })}
                          <span className="dash-milestone-label">
                            {MILESTONE_LABELS[app.milestone]}
                          </span>
                        </div>

                        <span
                          className={`dash-app-status-badge dash-app-status-badge--${app.status}`}
                        >
                          {app.status.charAt(0).toUpperCase() +
                            app.status.slice(1)}
                        </span>
                      </div>
                    );
                  })
                )}
              </div>
            </>
          )}

          {/* === EARNINGS VIEW === */}
          {view === "earnings" && (
            <>
              <div className="dash-panel-header">
                <span className="dash-panel-title">Earnings</span>
              </div>

              <div className="dash-earnings-summary">
                <div className="dash-earn-card">
                  <span className="dash-earn-value">
                    ${creator.earnings_total}
                  </span>
                  <span className="dash-earn-label">Total Earned</span>
                </div>
                <div className="dash-earn-card">
                  <span className="dash-earn-value">
                    ${creator.earnings_pending}
                  </span>
                  <span className="dash-earn-label">Pending</span>
                </div>
                <div className="dash-earn-card">
                  <span className="dash-earn-value">
                    {creator.campaigns_completed}
                  </span>
                  <span className="dash-earn-label">Completed</span>
                </div>
              </div>

              <div className="dash-payout-list">
                {payouts.length === 0 ? (
                  <div className="dash-empty">
                    <div className="dash-empty-icon">$</div>
                    <p className="dash-empty-title">No payouts yet</p>
                    <p className="dash-empty-msg">
                      Complete a campaign to earn your first payout.
                    </p>
                  </div>
                ) : (
                  payouts.map((p) => (
                    <div key={p.id} className="dash-payout-row">
                      <div className="dash-payout-info">
                        <span className="dash-payout-name">
                          {p.campaign_title}
                        </span>
                        <span className="dash-payout-date">
                          {p.paid_at
                            ? formatDate(p.paid_at)
                            : p.status === "pending"
                              ? "Pending"
                              : "Processing"}
                        </span>
                      </div>
                      <div className="dash-payout-right">
                        <span className="dash-payout-amount">
                          {formatCurrency(p.amount)}
                        </span>
                        <span
                          className={`dash-payout-status dash-payout-status--${p.status}`}
                        >
                          {p.status.charAt(0).toUpperCase() + p.status.slice(1)}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* First paycheck button (demo only) */}
              {demo && (
                <div
                  style={{ padding: 16, borderTop: "1px solid var(--line)" }}
                >
                  <button
                    className="dash-detail-apply-btn"
                    onClick={() => setShowPaycheck(true)}
                  >
                    Simulate First Paycheck
                  </button>
                </div>
              )}
            </>
          )}
        </aside>

        {/* ── Right Slide Panel ────────────────────────── */}
        <div className={`dash-slide${slideOpen ? " dash-slide--open" : ""}`}>
          {selectedCampaign && (
            <>
              <div className="dash-slide-header">
                <span className="dash-panel-title">Campaign Detail</span>
                <button className="dash-slide-close" onClick={closeSlide}>
                  &times;
                </button>
              </div>

              <div className="dash-slide-body">
                <span className="dash-detail-business">
                  {selectedCampaign.business_name}
                </span>
                <h2 className="dash-detail-title">{selectedCampaign.title}</h2>

                {/* Meta badges */}
                <div className="dash-detail-meta">
                  <span className="dash-detail-badge">
                    {formatCurrency(selectedCampaign.payout)}
                  </span>
                  <span className="dash-detail-badge">
                    {selectedCampaign.spots_remaining} spot
                    {selectedCampaign.spots_remaining !== 1 ? "s" : ""} left
                  </span>
                  {selectedCampaign.deadline && (
                    <span className="dash-detail-badge">
                      Due {formatDate(selectedCampaign.deadline)}
                    </span>
                  )}
                  <span className="dash-detail-badge">
                    {TIER_LABELS[selectedCampaign.tier_required]}+ only
                  </span>
                  {selectedCampaign.category && (
                    <span className="dash-detail-badge">
                      {selectedCampaign.category}
                    </span>
                  )}
                </div>

                {/* Spots progress bar */}
                {(() => {
                  const taken =
                    selectedCampaign.spots_total -
                    selectedCampaign.spots_remaining;
                  const takenPercent =
                    selectedCampaign.spots_total > 0
                      ? (taken / selectedCampaign.spots_total) * 100
                      : 0;
                  return (
                    <div style={{ marginBottom: 16 }}>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          fontSize: 11,
                          fontFamily: "var(--font-mono)",
                          color: "var(--ink-secondary, #666)",
                          marginBottom: 6,
                          textTransform: "uppercase",
                          letterSpacing: "0.05em",
                        }}
                      >
                        <span>Spots filled</span>
                        <span>
                          {taken} / {selectedCampaign.spots_total}
                        </span>
                      </div>
                      <div
                        style={{
                          height: 6,
                          background: "rgba(0,0,0,0.08)",
                          borderRadius: 0,
                          overflow: "hidden",
                        }}
                      >
                        <div
                          style={{
                            width: `${takenPercent}%`,
                            height: "100%",
                            background: "#c1121f",
                            transition: "width 0.4s ease",
                          }}
                        />
                      </div>
                    </div>
                  );
                })()}

                {/* Description */}
                {selectedCampaign.description && (
                  <>
                    <span className="dash-detail-section-label">About</span>
                    <p className="dash-detail-desc">
                      {selectedCampaign.description}
                    </p>
                  </>
                )}

                {/* Payout breakdown preview */}
                {selectedCampaign.payout > 0 && (
                  <>
                    <span className="dash-detail-section-label">
                      Earnings Preview
                    </span>
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr auto",
                        gap: "6px 12px",
                        fontSize: 13,
                        fontFamily: "var(--font-mono)",
                        marginBottom: 16,
                      }}
                    >
                      <span style={{ color: "var(--ink-secondary, #666)" }}>
                        Base payout
                      </span>
                      <span style={{ textAlign: "right" }}>
                        {formatCurrency(selectedCampaign.payout)}
                      </span>
                      <span style={{ color: "var(--ink-secondary, #666)" }}>
                        Est. commission (~15%)
                      </span>
                      <span style={{ textAlign: "right", color: "#003049" }}>
                        +{formatCurrency(selectedCampaign.payout * 0.15)}
                      </span>
                      <span
                        style={{
                          fontWeight: 600,
                          borderTop: "1px solid rgba(0,0,0,0.12)",
                          paddingTop: 6,
                        }}
                      >
                        Total potential
                      </span>
                      <span
                        style={{
                          textAlign: "right",
                          fontWeight: 600,
                          color: "#c1121f",
                          borderTop: "1px solid rgba(0,0,0,0.12)",
                          paddingTop: 6,
                        }}
                      >
                        {formatCurrency(selectedCampaign.payout * 1.15)}
                      </span>
                    </div>
                  </>
                )}

                {/* Requirements */}
                {selectedCampaign.requirements &&
                  selectedCampaign.requirements.length > 0 && (
                    <>
                      <span className="dash-detail-section-label">
                        Requirements
                      </span>
                      <div className="dash-detail-reqs">
                        {selectedCampaign.requirements.map((r, i) => (
                          <div key={i} className="dash-detail-req">
                            {r}
                          </div>
                        ))}
                      </div>
                    </>
                  )}

                {/* Location */}
                {selectedCampaign.business_address && (
                  <>
                    <span className="dash-detail-section-label">Location</span>
                    <p className="dash-detail-desc">
                      {selectedCampaign.business_address}
                    </p>
                  </>
                )}
              </div>

              {/* Sticky CTA */}
              <div className="dash-detail-action">
                {(() => {
                  const eligible = isEligible(
                    creator.tier,
                    selectedCampaign.tier_required,
                  );
                  const applied = appliedIds.has(selectedCampaign.id);

                  if (!eligible) {
                    return (
                      <button
                        className="dash-detail-apply-btn dash-detail-apply-btn--locked"
                        disabled
                      >
                        Requires {TIER_LABELS[selectedCampaign.tier_required]}+
                        Tier
                      </button>
                    );
                  }
                  if (applied) {
                    return (
                      <button
                        className="dash-detail-apply-btn dash-detail-apply-btn--applied"
                        disabled
                      >
                        Applied
                      </button>
                    );
                  }
                  return (
                    <>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 6,
                          fontSize: 12,
                          fontFamily: "var(--font-mono)",
                          color: "#2d7a2d",
                          marginBottom: 10,
                        }}
                      >
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 14 14"
                          fill="none"
                          aria-hidden="true"
                        >
                          <circle cx="7" cy="7" r="7" fill="#2d7a2d" />
                          <path
                            d="M4 7l2 2 4-4"
                            stroke="#fff"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        You&apos;re eligible for this campaign
                      </div>
                      <button
                        className="dash-detail-apply-btn"
                        onClick={() => handleApply(selectedCampaign.id)}
                      >
                        Apply Now
                      </button>
                    </>
                  );
                })()}
              </div>
            </>
          )}
        </div>
      </div>

      {/* ── Bottom Status Bar ──────────────────────────── */}
      <div className="dash-bottom">
        <div className="dash-status-item">
          <span className="dash-status-value">${creator.earnings_pending}</span>
          <span className="dash-status-label">Pending</span>
        </div>
        <div className="dash-status-divider" />
        <div className="dash-status-item">
          <span className="dash-status-value">{activeApps}</span>
          <span className="dash-status-label">Active</span>
        </div>
        <div className="dash-status-divider" />
        <div className="dash-status-item">
          <span className="dash-status-value">{creator.push_score}</span>
          <span className="dash-status-label">Score</span>
        </div>
        <div className="dash-status-divider" />
        <div className="dash-status-item">
          <span className="dash-status-value">{TIER_LABELS[creator.tier]}</span>
          <span className="dash-status-label">Tier</span>
        </div>
        <div className="dash-status-divider" />
        <div className="dash-status-item">
          <span className="dash-status-value">{filteredCampaigns.length}</span>
          <span className="dash-status-label">Campaigns</span>
        </div>
      </div>

      {/* ── First Paycheck Overlay ─────────────────────── */}
      {showPaycheck && (
        <FirstPaycheck
          amount={28.5}
          campaignTitle="Brew & Bloom Cafe"
          merchantName="Brew & Bloom"
          creatorName={creator.name}
          onDismiss={() => setShowPaycheck(false)}
        />
      )}
    </div>
  );
}
