"use client";

import { createClient } from "@/lib/supabase";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useCallback, useMemo, Suspense } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import "./dashboard.css";
import { FirstPaycheck } from "@/components/creator/FirstPaycheck";
import { CampaignDetailPanel } from "@/components/creator/CampaignDetailPanel";

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
    title: "Best Burger in NYC Feature",
    business_name: "Superiority Burger",
    business_address: "119 Avenue A, New York, NY 10009",
    payout: 35,
    spots_remaining: 4,
    spots_total: 8,
    deadline: "2026-04-25",
    category: "Food",
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
    id: "camp-003",
    title: "LA Botanica Aesthetic Shoot",
    business_name: "Flamingo Estate",
    business_address: "La Guardia Pl, New York, NY 10012",
    payout: 75,
    spots_remaining: 3,
    spots_total: 6,
    deadline: "2026-05-05",
    category: "Lifestyle",
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
    id: "camp-004",
    title: "Brow Transformation Story",
    business_name: "Brow Theory",
    business_address: "247 Centre St, New York, NY 10013",
    payout: 50,
    spots_remaining: 5,
    spots_total: 10,
    deadline: "2026-04-28",
    category: "Beauty",
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
    id: "camp-005",
    title: "Glossier NYC Store Experience",
    business_name: "Glossier",
    business_address: "1a York Ave, New York, NY 10065",
    payout: 120,
    spots_remaining: 2,
    spots_total: 5,
    deadline: "2026-05-10",
    category: "Beauty",
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
  {
    id: "camp-006",
    title: "Le Bec-Fin Pop-Up Review",
    business_name: "Le Bec Fin",
    business_address: "1 Rockefeller Plaza, New York, NY 10020",
    payout: 20,
    spots_remaining: 8,
    spots_total: 15,
    deadline: "2026-04-22",
    category: "Food",
    tier_required: "seed",
    description:
      "Try the NYC pop-up of the legendary Philadelphia institution. Share an honest review.",
    requirements: ["1 Instagram story or post", "Tag location"],
    lat: 40.7597,
    lng: -73.9787,
  },
  {
    id: "camp-007",
    title: "KITH x Creator Collab Series",
    business_name: "KITH",
    business_address: "337 Lafayette St, New York, NY 10012",
    payout: 199,
    spots_remaining: 1,
    spots_total: 3,
    deadline: "2026-05-15",
    category: "Retail",
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
    id: "camp-008",
    title: "Matcha Morning Ritual",
    business_name: "Cha Cha Matcha",
    business_address: "373 Broadway, New York, NY 10013",
    payout: 25,
    spots_remaining: 6,
    spots_total: 12,
    deadline: "2026-04-29",
    category: "Coffee",
    tier_required: "seed",
    description:
      "Share your morning matcha ritual at Cha Cha Matcha. Aesthetic, cozy content welcome.",
    requirements: ["2 Instagram stories", "Tag @chachamatcha"],
    lat: 40.7178,
    lng: -74.003,
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
  return (
    <Suspense
      fallback={
        <div className="dash-loading">
          <span>Loading...</span>
        </div>
      }
    >
      <DashboardContent />
    </Suspense>
  );
}

function DashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
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

  /* ── URL sync: restore panel from ?campaign= on mount ─── */

  useEffect(() => {
    if (!campaigns.length) return;
    const id = searchParams.get("campaign");
    if (!id) return;
    const found = campaigns.find((c) => c.id === id);
    if (found) {
      setSelectedCampaign(found);
      setActiveId(found.id);
      setSlideOpen(true);
    }
  }, [campaigns, searchParams]);

  /* ── Handlers ─────────────────────────────────────────── */

  function handlePinClick(id: string) {
    setActiveId((prev) => (prev === id ? undefined : id));
    const card = document.querySelector(`[data-campaign-id="${id}"]`);
    card?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  function handleCardClick(campaign: Campaign) {
    setActiveId(campaign.id);
    setSelectedCampaign(campaign);
    setSlideOpen(true);
    // Shallow URL update — preserves existing params
    const params = new URLSearchParams(searchParams.toString());
    params.set("campaign", campaign.id);
    router.push(`?${params.toString()}`, { scroll: false });
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
    // Remove campaign param from URL
    const params = new URLSearchParams(searchParams.toString());
    params.delete("campaign");
    const qs = params.toString();
    router.push(qs ? `?${qs}` : "?", { scroll: false });
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
                        <span style={{ fontSize: 20 }}>
                          {c.business_name[0]}
                        </span>
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
