"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/db/browser";
import { TierBadge } from "@/components/creator/TierBadge";
import "./campaign.css";

/* ── Types ───────────────────────────────────────────────── */

type CreatorTier =
  | "seed"
  | "explorer"
  | "operator"
  | "proven"
  | "closer"
  | "partner";

type MilestoneStatus =
  | "accepted"
  | "scheduled"
  | "visited"
  | "proof_submitted"
  | "content_published"
  | "verified"
  | "settled";

type Campaign = {
  id: string;
  title: string;
  description: string;
  business_name: string;
  business_address: string;
  payout: number;
  spots_total: number;
  spots_remaining: number;
  deadline: string;
  status: string;
  category: string;
  image?: string;
  images?: string[];
  tier_required: CreatorTier;
  requirements: string[];
  lat: number;
  lng: number;
  merchant_id: string;
};

type Creator = {
  id: string;
  tier: CreatorTier;
  push_score: number;
  campaigns_completed: number;
  name: string;
};

/* ── Demo mode ───────────────────────────────────────────── */

function checkDemoMode(): boolean {
  if (typeof document === "undefined") return false;
  return document.cookie.includes("push-demo-role=creator");
}

/* ── Tier order ──────────────────────────────────────────── */

const TIER_ORDER: CreatorTier[] = [
  "seed",
  "explorer",
  "operator",
  "proven",
  "closer",
  "partner",
];

const TIER_LABELS: Record<CreatorTier, string> = {
  seed: "Seed",
  explorer: "Explorer",
  operator: "Operator",
  proven: "Proven",
  closer: "Closer",
  partner: "Partner",
};

const TIER_COMMISSION: Record<CreatorTier, number> = {
  seed: 0,
  explorer: 0,
  operator: 3,
  proven: 5,
  closer: 7,
  partner: 10,
};

const MILESTONES: { key: MilestoneStatus; label: string }[] = [
  { key: "accepted", label: "Accepted" },
  { key: "scheduled", label: "Scheduled" },
  { key: "visited", label: "Visited" },
  { key: "proof_submitted", label: "Proof" },
  { key: "content_published", label: "Published" },
  { key: "verified", label: "Verified" },
  { key: "settled", label: "Settled" },
];

const MILESTONE_ORDER: MilestoneStatus[] = MILESTONES.map((m) => m.key);

const DEMO_CAMPAIGNS: Campaign[] = [
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
    status: "active",
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
    status: "active",
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
    status: "active",
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
    status: "active",
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
    status: "active",
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
    status: "active",
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
    status: "active",
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
    status: "active",
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
  /* ── Discover-feed campaigns (kept in sync with workspace/discover/page.tsx) ── */
  {
    id: "disc-001",
    merchant_id: "disc-merchant-001",
    title: "Rooftop Coffee Series",
    description:
      "Capture the rooftop atmosphere at Blank Street's Williamsburg location across a 4-week series. Each week, post a new angle — golden hour, the espresso pour, the regulars, the skyline. We're after a slow-build narrative, not a one-off post.",
    payout: 32,
    spots_total: 20,
    spots_remaining: 6,
    deadline: "2026-05-10T23:59:00Z",
    status: "active",
    lat: 40.7141,
    lng: -73.9614,
    category: "Coffee",
    business_name: "Blank Street Coffee",
    business_address: "Williamsburg Rooftop, Brooklyn, NY 11211",
    requirements: [
      "Post once per week for 4 weeks",
      "Tag @blankstreetcoffee",
      "Include rooftop ambiance footage",
    ],
    tier_required: "seed",
    images: [
      "https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=1600&h=1200&fit=crop&q=85",
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=1600&h=1200&fit=crop&q=85",
      "https://images.unsplash.com/photo-1521017432531-fbd92d768814?w=1600&h=1200&fit=crop&q=85",
    ],
  },
  {
    id: "disc-002",
    merchant_id: "disc-merchant-002",
    title: "Chelsea Market Food Walk",
    description:
      "Walk Chelsea Market end-to-end across 4 vendors and one rooftop bite. Reel format: a single take if possible, or 5 cuts max. Show the textures, the pours, the lines — make it feel like the right Saturday afternoon.",
    payout: 45,
    spots_total: 10,
    spots_remaining: 2,
    deadline: "2026-05-08T23:59:00Z",
    status: "active",
    lat: 40.7422,
    lng: -74.0051,
    category: "FOOD & DRINK",
    business_name: "Chelsea Market",
    business_address: "75 9th Ave, New York, NY 10011",
    requirements: [
      "Feature at least 4 vendors",
      "Tag @chelseamarket and each vendor",
      "Reel format, posted within 48h",
    ],
    tier_required: "explorer",
    images: [
      "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=1600&h=1200&fit=crop&q=85",
      "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=1600&h=1200&fit=crop&q=85",
      "https://images.unsplash.com/photo-1544025162-d76694265947?w=1600&h=1200&fit=crop&q=85",
      "https://images.unsplash.com/photo-1432139509613-5c4255815697?w=1600&h=1200&fit=crop&q=85",
    ],
  },
  {
    id: "disc-003",
    merchant_id: "disc-merchant-003",
    title: "Flatiron Brunch Story",
    description:
      "Eataly's Flatiron flagship is launching a weekend brunch program. Tell the story across 6 Instagram Story frames + a reel. We want the dough being stretched, the espresso being pulled, and the crowd settling in — a Sunday morning postcard.",
    payout: 60,
    spots_total: 8,
    spots_remaining: 4,
    deadline: "2026-05-12T23:59:00Z",
    status: "active",
    lat: 40.7412,
    lng: -73.9897,
    category: "FOOD & DRINK",
    business_name: "Eataly NYC Flatiron",
    business_address: "200 5th Ave, New York, NY 10010",
    requirements: [
      "6+ Story frames + 1 Reel",
      "Tag @eatalyflatiron",
      "Filmed on a weekend before 12pm",
    ],
    tier_required: "explorer",
    images: [
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1600&h=1200&fit=crop&q=85",
      "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=1600&h=1200&fit=crop&q=85",
      "https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=1600&h=1200&fit=crop&q=85",
    ],
  },
  {
    id: "disc-004",
    merchant_id: "disc-merchant-004",
    title: "Pilates Studio Grand Opening",
    description:
      "Forma Pilates is opening its third Manhattan studio in Chelsea. We need creators to capture a class — pre-class arrival, the equipment setup, mid-class form, and post-class glow. The studio will host a free creator session you can build the content around.",
    payout: 40,
    spots_total: 12,
    spots_remaining: 7,
    deadline: "2026-05-20T23:59:00Z",
    status: "active",
    lat: 40.747,
    lng: -73.9983,
    category: "FITNESS",
    business_name: "Forma Pilates Chelsea",
    business_address: "245 W 17th St, New York, NY 10011",
    requirements: [
      "Attend the opening-week creator class",
      "Tag @formapilates and #FormaChelsea",
      "Post a 30s+ Reel within 72h of class",
    ],
    tier_required: "operator",
    images: [
      "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=1600&h=1200&fit=crop&q=85",
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1600&h=1200&fit=crop&q=85",
      "https://images.unsplash.com/photo-1554284126-aa88f22d8b74?w=1600&h=1200&fit=crop&q=85",
      "https://images.unsplash.com/photo-1599447421416-3414500d18a5?w=1600&h=1200&fit=crop&q=85",
      "https://images.unsplash.com/photo-1591291621164-2c6367723315?w=1600&h=1200&fit=crop&q=85",
    ],
  },
  {
    id: "disc-005",
    merchant_id: "disc-merchant-005",
    title: "Gallery Opening Night",
    description:
      "Tara Downs is debuting a new exhibition with an opening night reception. Cover the room — the work, the crowd, the small overheard quotes. Three Stories + one Reel; preserve the gallery's tone (quiet, considered, not loud).",
    payout: 75,
    spots_total: 6,
    spots_remaining: 3,
    deadline: "2026-05-05T23:59:00Z",
    status: "active",
    lat: 40.745,
    lng: -74.004,
    category: "LIFESTYLE",
    business_name: "Tara Downs Gallery",
    business_address: "519 W 27th St, New York, NY 10001",
    requirements: [
      "3 Stories + 1 Reel from opening night",
      "Tag @taradownsgallery",
      "No flash photography",
    ],
    tier_required: "operator",
    images: [
      "https://images.unsplash.com/photo-1531058020387-3be344556be6?w=1600&h=1200&fit=crop&q=85",
      "https://images.unsplash.com/photo-1545987796-200677ee1011?w=1600&h=1200&fit=crop&q=85",
      "https://images.unsplash.com/photo-1577720580479-7d839d829c73?w=1600&h=1200&fit=crop&q=85",
    ],
  },
  {
    id: "disc-006",
    merchant_id: "disc-merchant-006",
    title: "Beauty Lab Skincare Series",
    description:
      "Bluemercury SoHo is launching the Beauty Lab — a hands-on skincare consultation experience. Document a 45-min consultation: intake, product trials, the recommendation reveal. 4-frame Story set + a 60s Reel.",
    payout: 55,
    spots_total: 8,
    spots_remaining: 5,
    deadline: "2026-05-15T23:59:00Z",
    status: "active",
    lat: 40.7239,
    lng: -74.0019,
    category: "BEAUTY",
    business_name: "Bluemercury SoHo",
    business_address: "120 Spring St, New York, NY 10012",
    requirements: [
      "Book a free Beauty Lab consult",
      "Tag @bluemercury",
      "4-frame Story + 60s Reel",
    ],
    tier_required: "explorer",
    images: [
      "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=1600&h=1200&fit=crop&q=85",
      "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=1600&h=1200&fit=crop&q=85",
      "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=1600&h=1200&fit=crop&q=85",
    ],
  },
  {
    id: "disc-007",
    merchant_id: "disc-merchant-007",
    title: "Boutique Opening Campaign",
    description:
      "Madewell SoHo is reopening after a full renovation. Capture the new space — the wood, the natural light, the upgraded denim bar — with one polished Reel. Remote OK if you've shot Madewell campaigns before.",
    payout: 28,
    spots_total: 15,
    spots_remaining: 10,
    deadline: "2026-05-20T23:59:00Z",
    status: "active",
    lat: 40.7225,
    lng: -73.9974,
    category: "RETAIL",
    business_name: "Madewell SoHo",
    business_address: "486 Broadway, New York, NY 10013",
    requirements: [
      "1 polished Reel of the renovated space",
      "Tag @madewell",
      "Post within 5 days of filming",
    ],
    tier_required: "seed",
    images: [
      "https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=1600&h=1200&fit=crop&q=85",
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1600&h=1200&fit=crop&q=85",
      "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=1600&h=1200&fit=crop&q=85",
    ],
  },
  {
    id: "disc-008",
    merchant_id: "disc-merchant-008",
    title: "Morning Ritual Brew",
    description:
      "Free entry experience: arrive before 9am at Intelligentsia West Village, capture your morning ritual (the line, the order, your first sip), and tag us. Aimed at morning-routine creators with a slow, considered cinematography style.",
    payout: 0,
    spots_total: 20,
    spots_remaining: 14,
    deadline: "2026-05-18T23:59:00Z",
    status: "active",
    lat: 40.734,
    lng: -74.0054,
    category: "Coffee",
    business_name: "Intelligentsia Coffee",
    business_address: "180 W 10th St, New York, NY 10014",
    requirements: [
      "Filmed before 9am on a weekday",
      "Tag @intelligentsia",
      "Slow, ambient editing style",
    ],
    tier_required: "seed",
    images: [
      "https://images.unsplash.com/photo-1497935586351-b67a49e012bf?w=1600&h=1200&fit=crop&q=85",
      "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=1600&h=1200&fit=crop&q=85",
      "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=1600&h=1200&fit=crop&q=85",
    ],
  },
  {
    id: "disc-009",
    merchant_id: "disc-merchant-009",
    title: "Wellness Studio Launch",
    description:
      "The Well NYC is opening a new flagship in Midtown. Cover the launch as a half-day editorial: the lobby, the breathwork class, the tea room, the rooftop. Long-form Reel + 5 Stories. Selective tier; we want a polished, magazine-quality result.",
    payout: 85,
    spots_total: 5,
    spots_remaining: 1,
    deadline: "2026-05-06T23:59:00Z",
    status: "active",
    lat: 40.7561,
    lng: -73.9864,
    category: "WELLNESS",
    business_name: "The Well NYC",
    business_address: "30 W 25th St, New York, NY 10010",
    requirements: [
      "Half-day on-site coverage",
      "Long-form Reel + 5 Stories",
      "Tag @the.well",
    ],
    tier_required: "proven",
    images: [
      "https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=1600&h=1200&fit=crop&q=85",
      "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=1600&h=1200&fit=crop&q=85",
      "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=1600&h=1200&fit=crop&q=85",
      "https://images.unsplash.com/photo-1591343395082-e120087004b4?w=1600&h=1200&fit=crop&q=85",
    ],
  },
  {
    id: "disc-010",
    merchant_id: "disc-merchant-010",
    title: "Farm-to-Table Dinner Series",
    description:
      "Blue Hill is running an invitation-only weekend dinner series. Document one full evening — the kitchen, the courses, the room. We'll seat you at a table for two. Closer/Partner tier campaign; high editorial bar.",
    payout: 250,
    spots_total: 2,
    spots_remaining: 1,
    deadline: "2026-05-20T23:59:00Z",
    status: "active",
    lat: 40.7317,
    lng: -74.0002,
    category: "FOOD & DRINK",
    business_name: "Blue Hill Restaurant",
    business_address: "75 Washington Pl, New York, NY 10011",
    requirements: [
      "Attend invited Saturday dinner",
      "Course-by-course editorial coverage",
      "Tag @bluehillfarm",
    ],
    tier_required: "closer",
    images: [
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1600&h=1200&fit=crop&q=85",
      "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1600&h=1200&fit=crop&q=85",
      "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=1600&h=1200&fit=crop&q=85",
      "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=1600&h=1200&fit=crop&q=85",
      "https://images.unsplash.com/photo-1551218372-a8789b81b253?w=1600&h=1200&fit=crop&q=85",
    ],
  },
];

const DEMO_CREATOR: Creator = {
  id: "demo-creator-001",
  tier: "operator",
  push_score: 68,
  campaigns_completed: 7,
  name: "Alex Rivera",
};

const DEMO_MILESTONE_BY_CAMPAIGN: Record<string, MilestoneStatus> = {
  "demo-campaign-001": "accepted",
  "demo-campaign-002": "visited",
  "demo-campaign-003": "proof_submitted",
  "demo-campaign-004": "content_published",
  "demo-campaign-005": "accepted",
  "demo-campaign-006": "scheduled",
  "demo-campaign-007": "verified",
  "demo-campaign-008": "settled",
};

function formatDeadline(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function daysRemaining(iso: string): number {
  const ms = new Date(iso).getTime() - Date.now();
  return Math.max(0, Math.ceil(ms / (1000 * 60 * 60 * 24)));
}

function isEligible(creatorTier: CreatorTier, required: CreatorTier): boolean {
  return TIER_ORDER.indexOf(creatorTier) >= TIER_ORDER.indexOf(required);
}

/* ── Hero gallery (multi-image, prev/next arrows) ────────── */
function CampaignGallery({ images, alt }: { images: string[]; alt: string }) {
  const [idx, setIdx] = useState(0);
  const total = images.length;
  const prev = () => setIdx((i) => (i - 1 + total) % total);
  const next = () => setIdx((i) => (i + 1) % total);

  return (
    <div className="cp-gallery">
      <div className="cp-gallery-frame">
        {images.map((src, i) => (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            key={src}
            className={`cp-gallery-img${i === idx ? " cp-gallery-img--active" : ""}`}
            src={src}
            alt={i === 0 ? alt : ""}
            loading={i === 0 ? "eager" : "lazy"}
          />
        ))}
        <div className="cp-gallery-grad" aria-hidden="true" />

        {total > 1 && (
          <>
            <button
              type="button"
              className="cp-gallery-arrow cp-gallery-arrow--prev"
              onClick={prev}
              aria-label="Previous photo"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 18 18"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M11 3L5 9L11 15"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <button
              type="button"
              className="cp-gallery-arrow cp-gallery-arrow--next"
              onClick={next}
              aria-label="Next photo"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 18 18"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M7 3L13 9L7 15"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <span className="cp-gallery-counter">
              {idx + 1} / {total}
            </span>
          </>
        )}
      </div>

      {total > 1 && (
        <div className="cp-gallery-thumbs">
          {images.map((src, i) => (
            <button
              key={src}
              type="button"
              className={`cp-gallery-thumb${i === idx ? " cp-gallery-thumb--active" : ""}`}
              onClick={() => setIdx(i)}
              aria-label={`View photo ${i + 1}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt="" loading="lazy" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ── Milestone progress tracker ──────────────────────────── */
function MilestoneTrack({ current }: { current: MilestoneStatus }) {
  const currentIdx = MILESTONE_ORDER.indexOf(current);
  return (
    <div className="cp-milestone-track candy-panel">
      <p
        className="eyebrow"
        style={{ marginBottom: 16, color: "var(--ink-3)" }}
      >
        CAMPAIGN PROGRESS
      </p>
      <div className="cp-milestone-steps">
        {MILESTONES.map((m, i) => {
          const isDone = i < currentIdx;
          const isActive = i === currentIdx;
          return (
            <div key={m.key} className="cp-milestone-step-wrap">
              {i < MILESTONES.length - 1 && (
                <div
                  className={[
                    "cp-milestone-line",
                    isDone
                      ? "cp-milestone-line--done"
                      : "cp-milestone-line--dashed",
                  ].join(" ")}
                />
              )}
              <div
                className={[
                  "cp-milestone-step",
                  isDone ? "cp-milestone-step--done" : "",
                  isActive ? "cp-milestone-step--active" : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
              />
              <span
                className={[
                  "cp-milestone-label",
                  isDone ? "cp-milestone-label--done" : "",
                  isActive ? "cp-milestone-label--active" : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
              >
                {m.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ── Current Step Section ────────────────────────────────────
   Replaces the legacy <CampaignChecklist> below the page.
   Renders ONE state at a time, mapped to the active milestone:
   review → preparation → confirmed → countdown → proof → verify → done.
   Sits as the first card in the main column when applied. */
type StepBeat = { num: string; title: string; meta: string };
type CurrentStep = {
  eyebrow: string; // mono uppercase, e.g. "STAGE 02 · PREPARATION"
  hero: string; // big H2 title for the panel
  body: string; // body description
  meta?: string; // optional supplemental line (timing, countdown)
  metaTone?: "info" | "success" | "warn";
  beats?: StepBeat[]; // optional 3-4 actionable beats
  cta: string; // primary action label
  secondary?: string; // optional secondary action
};

function buildCurrentStep(milestone: MilestoneStatus): CurrentStep | null {
  switch (milestone) {
    case "accepted":
      return {
        eyebrow: "STAGE 02 · PREPARATION",
        hero: "Get ready for your visit",
        body: "Forma Pilates approved your application. Lock a date in the next 48 hours so they can plan staffing for your shoot.",
        meta: "Most creators schedule within 24 hours",
        metaTone: "info",
        beats: [
          {
            num: "01",
            title: "Review the brief",
            meta: "Read what they need + tagging rules",
          },
          {
            num: "02",
            title: "Pick a visit slot",
            meta: "Pre-class window works best",
          },
          {
            num: "03",
            title: "Confirm with Forma",
            meta: "They'll send a calendar invite",
          },
        ],
        cta: "Schedule visit",
        secondary: "View brief",
      };
    case "scheduled":
      return {
        eyebrow: "STAGE 03 · CONFIRMED",
        hero: "Visit confirmed for May 5, 10:00 AM",
        body: "Your slot at Forma Pilates Chelsea is locked in. Arrive 10 minutes early, scan the Push QR at the front desk, then capture per the brief.",
        meta: "4 days, 3 hours to go",
        metaTone: "info",
        beats: [
          {
            num: "01",
            title: "Re-read brief the night before",
            meta: "Visualize your shot list",
          },
          {
            num: "02",
            title: "Charge your phone, clear storage",
            meta: "Min 2GB free for 4K reel",
          },
          {
            num: "03",
            title: "Note the @handle",
            meta: "@formapilates · #FormaChelsea",
          },
        ],
        cta: "Open day-of checklist",
        secondary: "Reschedule",
      };
    case "visited":
      return {
        eyebrow: "STAGE 04 · PROOF",
        hero: "Submit your visit proof",
        body: "Confirm you visited Forma Pilates so we can attribute the walk-in. Upload one frame from class — the merchant uses this to verify before payout.",
        meta: "Submit within 24h to keep your tier streak",
        metaTone: "warn",
        cta: "Upload proof",
      };
    case "proof_submitted":
      return {
        eyebrow: "STAGE 05 · PUBLISH",
        hero: "Proof received — publish your content",
        body: "Forma confirmed your visit. Now post your reel publicly with the required tags, then drop the link below.",
        meta: "Required: @formapilates · #FormaChelsea",
        metaTone: "info",
        cta: "Submit content link",
        secondary: "Re-read brief",
      };
    case "content_published":
      return {
        eyebrow: "STAGE 06 · VERIFICATION",
        hero: "Awaiting verification",
        body: "Push is checking your content meets the brief and tagging rules. Most verifications complete within 24 hours.",
        meta: "Verification window: 24h",
        metaTone: "info",
        cta: "View submission",
        secondary: "Contact support",
      };
    case "verified":
      return {
        eyebrow: "STAGE 07 · PAYOUT",
        hero: "Verified — payout processing",
        body: "Your campaign is verified. The base payout is on the way; commission accrues from any walk-in scans driven by your content.",
        meta: "Funds typically arrive within 24h",
        metaTone: "success",
        cta: "View payout status",
      };
    case "settled":
      return null;
  }
}

function CurrentStepSection({
  milestone,
  onAdvance,
  loading = false,
}: {
  milestone: MilestoneStatus;
  onAdvance: (to: MilestoneStatus) => void;
  loading?: boolean;
}) {
  const step = buildCurrentStep(milestone);
  const [mode, setMode] = useState<"proof" | "link" | null>(null);
  const [fileReady, setFileReady] = useState(false);
  const [linkVal, setLinkVal] = useState("");

  // Reset inline mode whenever milestone advances (parent changes prop)
  useEffect(() => {
    setMode(null);
    setFileReady(false);
    setLinkVal("");
  }, [milestone]);

  if (!step) return null;

  function handleCta() {
    switch (milestone) {
      case "accepted":
        onAdvance("scheduled");
        break;
      case "scheduled":
        onAdvance("visited");
        break;
      case "visited":
        setMode("proof");
        break;
      case "proof_submitted":
        setMode("link");
        break;
      case "content_published":
        document
          .querySelector(".campaign-gallery")
          ?.scrollIntoView({ behavior: "smooth", block: "start" });
        break;
      case "verified":
        window.location.href = "/creator/earnings";
        break;
    }
  }

  function handleSecondary() {
    switch (milestone) {
      case "accepted":
      case "proof_submitted":
        document
          .querySelector(".cp-requirements")
          ?.scrollIntoView({ behavior: "smooth" });
        break;
      case "scheduled":
        onAdvance("accepted");
        break;
      case "content_published":
        window.open("mailto:support@usepush.co", "_blank");
        break;
    }
  }

  /* ── Inline: proof upload ─────────────────────────────────── */
  if (mode === "proof") {
    return (
      <section className="cp-current-step">
        <p className="cp-current-step-eyebrow">STAGE 04 · PROOF</p>
        <h2 className="cp-current-step-hero">Upload your visit proof</h2>
        <p className="cp-current-step-body">
          One clear frame from inside the studio — the merchant uses this to
          verify your visit before processing payout.
        </p>
        <label
          className={`cp-proof-upload${fileReady ? " cp-proof-upload--ready" : ""}`}
        >
          <input
            type="file"
            accept="image/*"
            className="cp-proof-input-hidden"
            onChange={() => setFileReady(true)}
          />
          {fileReady ? (
            <>
              <span
                className="cp-proof-icon cp-proof-icon--ok"
                aria-hidden="true"
              >
                ✓
              </span>
              <span className="cp-proof-label">
                Photo selected — ready to submit
              </span>
            </>
          ) : (
            <>
              <span className="cp-proof-icon" aria-hidden="true">
                ↑
              </span>
              <span className="cp-proof-label">Tap to select a photo</span>
            </>
          )}
        </label>
        <div className="cp-current-step-actions">
          <button
            className="btn-primary click-shift cp-current-step-cta"
            onClick={() => {
              if (fileReady) onAdvance("proof_submitted");
            }}
            disabled={!fileReady || loading}
          >
            {loading ? "Submitting…" : "Submit proof"}
          </button>
          <button
            className="btn-ghost click-shift"
            onClick={() => {
              setMode(null);
              setFileReady(false);
            }}
          >
            Cancel
          </button>
        </div>
      </section>
    );
  }

  /* ── Inline: content link ─────────────────────────────────── */
  if (mode === "link") {
    const valid = linkVal.startsWith("http");
    return (
      <section className="cp-current-step">
        <p className="cp-current-step-eyebrow">STAGE 05 · PUBLISH</p>
        <h2 className="cp-current-step-hero">Submit your content link</h2>
        <p className="cp-current-step-body">
          Paste the public URL of your reel or post. Make sure it includes{" "}
          <strong>@formapilates</strong> and <strong>#FormaChelsea</strong>{" "}
          before submitting.
        </p>
        <input
          type="url"
          className="cp-link-input"
          placeholder="https://instagram.com/reel/…"
          value={linkVal}
          onChange={(e) => setLinkVal(e.target.value)}
          autoFocus
        />
        <div className="cp-current-step-actions">
          <button
            className="btn-primary click-shift cp-current-step-cta"
            onClick={() => {
              if (valid) onAdvance("content_published");
            }}
            disabled={!valid || loading}
          >
            {loading ? "Submitting…" : "Submit link"}
          </button>
          <button
            className="btn-ghost click-shift"
            onClick={() => {
              setMode(null);
              setLinkVal("");
            }}
          >
            Cancel
          </button>
        </div>
      </section>
    );
  }

  /* ── Default view ─────────────────────────────────────────── */
  return (
    <section className="cp-current-step">
      <p className="cp-current-step-eyebrow">{step.eyebrow}</p>
      <h2 className="cp-current-step-hero">{step.hero}</h2>
      <p className="cp-current-step-body">{step.body}</p>

      {step.meta && (
        <p
          className={`cp-current-step-meta cp-current-step-meta--${step.metaTone ?? "info"}`}
        >
          <span className="cp-current-step-meta-dot" aria-hidden="true" />
          {step.meta}
        </p>
      )}

      {step.beats && step.beats.length > 0 && (
        <ol className="cp-current-step-beats">
          {step.beats.map((b) => (
            <li key={b.num} className="cp-current-step-beat">
              <span className="cp-current-step-beat-num">{b.num}</span>
              <div className="cp-current-step-beat-text">
                <p className="cp-current-step-beat-title">{b.title}</p>
                <p className="cp-current-step-beat-meta">{b.meta}</p>
              </div>
            </li>
          ))}
        </ol>
      )}

      <div className="cp-current-step-actions">
        <button
          className="btn-primary click-shift cp-current-step-cta"
          onClick={handleCta}
          disabled={loading}
        >
          {loading ? "Please wait…" : step.cta}
        </button>
        {step.secondary && (
          <button
            className="btn-ghost click-shift cp-current-step-secondary"
            onClick={handleSecondary}
          >
            {step.secondary}
          </button>
        )}
      </div>
    </section>
  );
}

/* ── Main page ────────────────────────────────────────────── */
export default function CampaignDetailPage() {
  const params = useParams();
  const id = params?.id as string;

  const [isDemo] = useState<boolean>(() => checkDemoMode());
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [creator, setCreator] = useState<Creator | null>(null);
  const [applied, setApplied] = useState(false);
  const [applying, setApplying] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [milestone, setMilestone] = useState<MilestoneStatus | null>(null);
  const [milestoneLoading, setMilestoneLoading] = useState(false);

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);
      if (isDemo) {
        const found =
          DEMO_CAMPAIGNS.find((c) => c.id === id) ?? DEMO_CAMPAIGNS[0];
        setCampaign(found);
        setCreator(DEMO_CREATOR);
        const demoMilestone = DEMO_MILESTONE_BY_CAMPAIGN[found.id];
        if (demoMilestone) {
          setApplied(true);
          setMilestone(demoMilestone);
        }
        setLoading(false);
        return;
      }
      try {
        const supabase = createClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) {
          setError("Please sign in to view this campaign.");
          setLoading(false);
          return;
        }
        const { data: camp, error: campErr } = await supabase
          .from("campaigns")
          .select("*")
          .eq("id", id)
          .single();
        if (campErr || !camp) {
          setError("Campaign not found.");
          setLoading(false);
          return;
        }
        setCampaign(camp as Campaign);
        const { data: creatorData } = await supabase
          .from("creators")
          .select("id, tier, push_score, campaigns_completed, name")
          .eq("user_id", user.id)
          .single();
        if (creatorData) setCreator(creatorData as Creator);
        const { data: existingApp } = await supabase
          .from("campaign_applications")
          .select("id, status")
          .eq("campaign_id", id)
          .eq("creator_id", creatorData?.id ?? "")
          .maybeSingle();
        if (existingApp) {
          setApplied(true);
          if (existingApp.status)
            setMilestone(existingApp.status as MilestoneStatus);
        }
      } catch {
        setError("Something went wrong. Please try again.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id, isDemo]);

  async function handleApply() {
    if (!campaign || !creator || applying || applied) return;
    setApplying(true);
    if (isDemo) {
      await new Promise((r) => setTimeout(r, 600));
      setApplied(true);
      setMilestone("accepted");
      setApplying(false);
      return;
    }
    try {
      const supabase = createClient();
      await supabase.from("campaign_applications").insert({
        campaign_id: campaign.id,
        creator_id: creator.id,
        merchant_id: campaign.merchant_id,
        status: "pending",
        payout: campaign.payout,
      });
      await supabase.from("creator_submissions").insert({
        campaign_id: campaign.id,
        creator_id: creator.id,
        status: "pending",
      });
      setApplied(true);
    } catch {
      setError("Failed to apply. Please try again.");
    } finally {
      setApplying(false);
    }
  }

  async function advanceMilestone(to: MilestoneStatus) {
    setMilestoneLoading(true);
    if (isDemo) {
      await new Promise((r) => setTimeout(r, 600));
      setMilestone(to);
      setMilestoneLoading(false);
      return;
    }
    setMilestone(to);
    setMilestoneLoading(false);
  }

  /* ── Loading / Error states ─────────────────────────────── */
  if (loading)
    return (
      <div className="campaign-page">
        <div className="campaign-loading">Loading campaign…</div>
      </div>
    );
  if (error || !campaign)
    return (
      <div className="campaign-page">
        <Link href="/creator/dashboard" className="campaign-back">
          ← Back to Campaigns
        </Link>
        <div className="campaign-error">{error ?? "Campaign not found."}</div>
      </div>
    );

  /* ── Derived state ──────────────────────────────────────── */
  const eligible = creator
    ? isEligible(creator.tier, campaign.tier_required)
    : false;
  const creatorTier = creator?.tier ?? "seed";
  const commission = TIER_COMMISSION[creatorTier];
  const spotsFillPct = Math.round(
    ((campaign.spots_total - campaign.spots_remaining) / campaign.spots_total) *
      100,
  );
  const noCommission = creatorTier === "seed" || creatorTier === "explorer";
  const campaignsToOperator = Math.max(
    0,
    3 - (creator?.campaigns_completed ?? 0),
  );
  const days = daysRemaining(campaign.deadline);
  const isUrgent = days <= 3;

  let btnLabel = "Apply Now";
  let btnClass = "btn-primary click-shift cp-apply-btn";
  let btnDisabled = false;
  if (applied) {
    btnLabel = "Applied";
    btnClass = "cp-apply-btn cp-apply-btn--applied";
    btnDisabled = true;
  } else if (!eligible) {
    btnLabel = `Requires ${TIER_LABELS[campaign.tier_required]}`;
    btnClass = "cp-apply-btn cp-apply-btn--locked";
    btnDisabled = true;
  } else if (applying) {
    btnLabel = "Applying…";
    btnDisabled = true;
  }

  /* ── Render ─────────────────────────────────────────────── */
  return (
    <div className="campaign-page">
      {/* ── Back link ──────────────────────────────────────── */}
      <Link href="/creator/dashboard" className="campaign-back click-shift">
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M10 3L5 8L10 13"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        Back to Campaigns
      </Link>

      {/* ── Hero gallery (multi-image with arrow nav) ──────── */}
      {campaign.images && campaign.images.length > 0 && (
        <CampaignGallery images={campaign.images} alt={campaign.title} />
      )}

      {/* ── Page header card ───────────────────────────────── */}
      <div className="cp-header candy-panel">
        {/* Status badge row */}
        <div className="cp-header-badges">
          <span
            className={[
              "cp-status-badge",
              campaign.status === "active"
                ? "cp-status-badge--active"
                : "cp-status-badge--default",
            ].join(" ")}
          >
            {campaign.status.toUpperCase()}
          </span>
          <span className="cp-category-badge">{campaign.category}</span>
          <TierBadge
            tier={campaign.tier_required}
            size="sm"
            variant="outlined"
          />
        </div>

        {/* Title + business */}
        <h1 className="cp-title">{campaign.title}</h1>
        <p className="cp-business-name">{campaign.business_name}</p>
        <p className="cp-business-addr">{campaign.business_address}</p>

        {/* Stats row */}
        <div className="cp-stats-row">
          {/* Days remaining */}
          <div className="cp-stat-card candy-panel">
            <span className="eyebrow" style={{ color: "var(--ink-3)" }}>
              DAYS REMAINING
            </span>
            <span
              className={[
                "cp-stat-number",
                isUrgent ? "cp-stat-number--urgent" : "",
              ].join(" ")}
            >
              {days}
            </span>
            <span className="cp-stat-sub">
              {formatDeadline(campaign.deadline)}
            </span>
          </div>

          {/* Payout */}
          <div className="cp-stat-card candy-panel">
            <span className="eyebrow" style={{ color: "var(--ink-3)" }}>
              {campaign.payout === 0 ? "REWARD" : "BASE PAYOUT"}
            </span>
            <span className="cp-stat-number cp-stat-number--payout">
              {campaign.payout === 0 ? "Free" : `$${campaign.payout}`}
            </span>
            {commission > 0 && (
              <span className="cp-stat-sub">+{commission}% commission</span>
            )}
          </div>

          {/* Spots */}
          <div className="cp-stat-card candy-panel">
            <span className="eyebrow" style={{ color: "var(--ink-3)" }}>
              SPOTS
            </span>
            <span className="cp-stat-number">
              {campaign.spots_remaining}
              <span className="cp-stat-number-denom">
                /{campaign.spots_total}
              </span>
            </span>
            <div
              className="cp-spots-bar"
              role="progressbar"
              aria-valuenow={spotsFillPct}
              aria-valuemin={0}
              aria-valuemax={100}
            >
              <div
                className={[
                  "cp-spots-fill",
                  spotsFillPct >= 70
                    ? "cp-spots-fill--low"
                    : "cp-spots-fill--mid",
                ].join(" ")}
                style={{ width: `${spotsFillPct}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* ── Milestone tracker (if applied) ─────────────────── */}
      {applied && milestone && <MilestoneTrack current={milestone} />}

      {/* ── Body grid ──────────────────────────────────────── */}
      <div className="campaign-body">
        {/* ── Main column ──────────────────────────────────── */}
        <div className="campaign-main">
          {/* Current-step state panel — replaces the legacy checklist.
              Lives at the top of the main column when applied. */}
          {applied && milestone && (
            <CurrentStepSection
              milestone={milestone}
              onAdvance={advanceMilestone}
              loading={milestoneLoading}
            />
          )}

          {/* About section */}
          <div className="cp-section candy-panel">
            <p className="eyebrow cp-section-eyebrow">ABOUT THIS CAMPAIGN</p>
            <p className="campaign-desc">{campaign.description}</p>
          </div>

          {/* Requirements section */}
          <div className="cp-section candy-panel">
            <p className="eyebrow cp-section-eyebrow">REQUIREMENTS</p>
            <div className="cp-requirements">
              {campaign.requirements.map((req, i) => (
                <div key={i} className="cp-req-item">
                  <span className="cp-req-check" aria-hidden="true">
                    <svg width="12" height="10" viewBox="0 0 12 10" fill="none">
                      <path
                        d="M1 5L4.5 8.5L11 1"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                  <span className="cp-req-number">{i + 1}</span>
                  <span className="cp-req-text">{req}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Business info section */}
          <div className="cp-section candy-panel">
            <p className="eyebrow cp-section-eyebrow">BUSINESS INFO</p>
            <dl className="campaign-biz-dl">
              <div className="campaign-biz-row">
                <dt>Address</dt>
                <dd>{campaign.business_address}</dd>
              </div>
              <div className="campaign-biz-row">
                <dt>Category</dt>
                <dd>{campaign.category}</dd>
              </div>
            </dl>
            <div className="cp-map-placeholder" aria-hidden="true">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <circle
                  cx="8"
                  cy="7"
                  r="3"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
                <path
                  d="M8 2C5.24 2 3 4.24 3 7c0 3.75 5 9 5 9s5-5.25 5-9c0-2.76-2.24-5-5-5z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  fill="none"
                />
              </svg>
              {campaign.business_name}
            </div>
          </div>

          {/* QR attribution note */}
          <div className="cp-qr-note candy-panel">
            <div className="cp-qr-icon-wrap" aria-hidden="true">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <rect
                  x="2"
                  y="2"
                  width="7"
                  height="7"
                  rx="1"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
                <rect
                  x="11"
                  y="2"
                  width="7"
                  height="7"
                  rx="1"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
                <rect
                  x="2"
                  y="11"
                  width="7"
                  height="7"
                  rx="1"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
                <rect x="13" y="13" width="2" height="2" fill="currentColor" />
                <rect x="11" y="11" width="2" height="2" fill="currentColor" />
                <rect x="15" y="11" width="2" height="2" fill="currentColor" />
                <rect x="11" y="15" width="4" height="2" fill="currentColor" />
              </svg>
            </div>
            <div>
              <p
                className="eyebrow"
                style={{ marginBottom: 4, color: "var(--accent-blue)" }}
              >
                QR ATTRIBUTION
              </p>
              <p className="cp-qr-text">
                Push generates a unique QR code for your campaign. When
                customers scan it after seeing your content, it attributes the
                visit to you — that&apos;s how your commission is calculated.
              </p>
            </div>
          </div>
        </div>

        {/* ── Sidebar ──────────────────────────────────────── */}
        <aside className="campaign-sidebar-card candy-panel">
          {/* Payout display */}
          <div className="cp-sidebar-payout">
            {campaign.payout === 0 ? (
              <>
                <span className="cp-payout-amount cp-payout-amount--free">
                  Free
                </span>
                <span className="cp-payout-label">product (trade)</span>
              </>
            ) : (
              <>
                <span className="cp-payout-amount">${campaign.payout}</span>
                <span className="cp-payout-label">per campaign</span>
              </>
            )}
          </div>

          {commission > 0 && (
            <div className="cp-commission-row">
              <span className="cp-commission-plus">+</span>
              <span className="cp-commission-pct">{commission}%</span>
              <span className="cp-commission-label">walk-in commission</span>
            </div>
          )}

          <div className="cp-sidebar-divider" />

          {/* Spots */}
          <div className="cp-sidebar-row">
            <span className="cp-sidebar-row-label">SPOTS</span>
            <span className="cp-sidebar-row-value">
              {campaign.spots_remaining} / {campaign.spots_total} remaining
            </span>
          </div>

          {/* Deadline */}
          <div className="cp-sidebar-row">
            <span className="cp-sidebar-row-label">DEADLINE</span>
            <span className="cp-sidebar-row-value">
              {formatDeadline(campaign.deadline)}
            </span>
          </div>

          {/* Tier required */}
          <div className="cp-sidebar-row cp-sidebar-row--tier">
            <span className="cp-sidebar-row-label">TIER REQUIRED</span>
            <TierBadge
              tier={campaign.tier_required}
              size="sm"
              variant="subtle"
            />
          </div>

          <div className="cp-sidebar-divider" />

          {/* Eligibility indicator */}
          <div className="cp-eligibility">
            {eligible ? (
              <>
                <span
                  className="cp-elig-dot cp-elig-dot--ok"
                  aria-hidden="true"
                />
                <span className="cp-elig-text">
                  You qualify ({creator ? TIER_LABELS[creator.tier] : ""})
                </span>
              </>
            ) : (
              <>
                <span
                  className="cp-elig-dot cp-elig-dot--lock"
                  aria-hidden="true"
                />
                <span className="cp-elig-text cp-elig-text--muted">
                  Requires {TIER_LABELS[campaign.tier_required]} tier
                </span>
              </>
            )}
          </div>

          {/* Apply button */}
          <button
            className={btnClass}
            disabled={btnDisabled}
            onClick={handleApply}
            aria-label={btnLabel}
          >
            {btnLabel}
          </button>

          {/* Commission / eligibility note */}
          {eligible && !applied && (
            <p className="cp-commission-note">
              {noCommission ? (
                <>
                  No commission at your tier.{" "}
                  {campaignsToOperator > 0
                    ? `Complete ${campaignsToOperator} more campaign${campaignsToOperator !== 1 ? "s" : ""} to reach Operator and unlock 3%.`
                    : "Reach Operator tier to unlock 3% commission."}
                </>
              ) : (
                <>You earn {commission}% on each walk-in you drive.</>
              )}
            </p>
          )}
          {applied && (
            <p className="cp-commission-note">
              Application submitted. The merchant will review and confirm.
            </p>
          )}
        </aside>
      </div>
    </div>
  );
}
