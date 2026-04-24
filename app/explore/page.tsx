"use client";

import { useEffect, useState, useMemo } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { createClient } from "@/lib/db/browser";
import "./explore.css";

const MapView = dynamic(() => import("@/components/layout/MapView"), {
  ssr: false,
  loading: () => (
    <div
      style={{ width: "100%", height: "100%", background: "var(--surface)" }}
    />
  ),
});

type Campaign = {
  id: string;
  title: string;
  business_name: string;
  payout: number;
  spots_remaining: number;
  spots_total?: number;
  lat: number;
  lng: number;
  description?: string | null;
  deadline?: string | null;
  category?: string;
  image?: string;
  tier_required?: string;
  created_at?: string;
};

/* ── Tier config ──────────────────────────────────────────── */
const TIERS = [
  "All",
  "Seed",
  "Explorer",
  "Operator",
  "Proven",
  "Closer",
  "Partner",
] as const;
type Tier = (typeof TIERS)[number];

const TIER_COLORS: Record<string, { bg: string; text: string }> = {
  Seed: { bg: "var(--surface)", text: "var(--graphite)" },
  Explorer: { bg: "rgba(201, 169, 110, 0.18)", text: "var(--champagne)" },
  Operator: { bg: "rgba(102, 155, 188, 0.16)", text: "var(--graphite)" },
  Proven: { bg: "rgba(201, 169, 110, 0.22)", text: "var(--champagne)" },
  Closer: { bg: "rgba(193, 18, 31, 0.12)", text: "var(--primary)" },
  Partner: { bg: "rgba(0, 48, 73, 0.12)", text: "var(--dark)" },
};

/* ── Sort options ─────────────────────────────────────────── */
const SORT_OPTIONS = [
  { key: "newest", label: "newest" },
  { key: "highest-pay", label: "highest pay" },
  { key: "ending-soon", label: "ending soon" },
  { key: "most-spots", label: "most spots" },
] as const;
type SortKey = (typeof SORT_OPTIONS)[number]["key"];

/* ── Category colors ──────────────────────────────────────── */
const CATEGORY_DOT_COLOR: Record<string, string> = {
  Food: "var(--primary)",
  Coffee: "var(--accent)",
  Beauty: "var(--tertiary)",
  Retail: "var(--dark)",
  Lifestyle: "var(--tertiary)",
  Fitness: "var(--dark)",
};

const DEMO_CAMPAIGNS: Campaign[] = [
  {
    id: "demo-1",
    title: "Free Latte for a 30-Second Reel",
    business_name: "Blank Street Coffee",
    payout: 0,
    spots_remaining: 8,
    spots_total: 20,
    lat: 40.7218,
    lng: -74.0052,
    description: "Post a 30-second reel at our Bleecker St location.",
    deadline: "2026-05-15",
    category: "Coffee",
    tier_required: "Seed",
    created_at: "2026-04-01",
    image:
      "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=300&h=300&fit=crop",
  },
  {
    id: "demo-2",
    title: "TikTok Walk-through — Spring Menu",
    business_name: "Superiority Burger",
    payout: 35,
    spots_remaining: 3,
    spots_total: 15,
    lat: 40.7265,
    lng: -73.9888,
    description: "Film a reaction video for our new spring menu.",
    deadline: "2026-04-30",
    category: "Food",
    tier_required: "Explorer",
    created_at: "2026-04-05",
    image:
      "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=300&h=300&fit=crop",
  },
  {
    id: "demo-3",
    title: "Instagram Stories — Grand Opening",
    business_name: "Flamingo Estate NYC",
    payout: 75,
    spots_remaining: 5,
    spots_total: 10,
    lat: 40.7158,
    lng: -73.997,
    description: "Cover our pop-up launch with 3 stories + 1 reel.",
    deadline: "2026-05-01",
    category: "Retail",
    tier_required: "Operator",
    created_at: "2026-04-08",
    image:
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=300&h=300&fit=crop",
  },
  {
    id: "demo-4",
    title: "Before & After — Brow Lamination",
    business_name: "Brow Theory",
    payout: 50,
    spots_remaining: 2,
    spots_total: 8,
    lat: 40.7195,
    lng: -73.994,
    description: "Feature your brow transformation with tagged location.",
    deadline: "2026-04-28",
    category: "Beauty",
    tier_required: "Explorer",
    created_at: "2026-04-03",
    image:
      "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=300&h=300&fit=crop",
  },
  {
    id: "demo-5",
    title: "GRWM Reel — Morning Routine",
    business_name: "Glossier Flagship",
    payout: 120,
    spots_remaining: 4,
    spots_total: 12,
    lat: 40.7303,
    lng: -74.0023,
    description: "Create a GRWM featuring 3 products at the flagship.",
    deadline: "2026-05-10",
    category: "Beauty",
    tier_required: "Proven",
    created_at: "2026-04-10",
    image:
      "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=300&h=300&fit=crop",
  },
  {
    id: "demo-6",
    title: "Croissant Review — Weekend Special",
    business_name: "Le Bec Fin Bakery",
    payout: 20,
    spots_remaining: 6,
    spots_total: 12,
    lat: 40.724,
    lng: -74.0012,
    description: "15-second croissant review. Tag location + QR scan.",
    deadline: "2026-05-20",
    category: "Food",
    tier_required: "Seed",
    created_at: "2026-04-06",
    image:
      "https://images.unsplash.com/photo-1555507036-ab1f4038024a?w=300&h=300&fit=crop",
  },
  {
    id: "demo-7",
    title: "Unboxing Reel — New Streetwear Drop",
    business_name: "KITH NYC",
    payout: 199,
    spots_remaining: 2,
    spots_total: 6,
    lat: 40.7183,
    lng: -74.0008,
    description: "Unboxing reel for our new drop. Must hit 1k views.",
    deadline: "2026-04-25",
    category: "Retail",
    tier_required: "Closer",
    created_at: "2026-04-09",
    image:
      "https://images.unsplash.com/photo-1556906781-9a412961c28c?w=300&h=300&fit=crop",
  },
  {
    id: "demo-8",
    title: "Matcha Review + Ambiance Video",
    business_name: "Cha Cha Matcha",
    payout: 25,
    spots_remaining: 10,
    spots_total: 20,
    lat: 40.7231,
    lng: -73.9997,
    description: "Chill walk-through + matcha review with QR scan.",
    deadline: "2026-05-30",
    category: "Coffee",
    tier_required: "Seed",
    created_at: "2026-04-02",
    image:
      "https://images.unsplash.com/photo-1536256263959-770b48d82b0a?w=300&h=300&fit=crop",
  },
];

const CATEGORIES = ["All", "Food", "Coffee", "Beauty", "Retail"];
const NYC: [number, number] = [40.7218, -74.001];

const CATEGORY_CLASS: Record<string, string> = {
  Food: "card-thumb--food",
  Coffee: "card-thumb--coffee",
  Beauty: "card-thumb--beauty",
  Retail: "card-thumb--retail",
};

/* ── Helpers ──────────────────────────────────────────────── */
function daysLeft(deadline?: string | null): number | null {
  if (!deadline) return null;
  const diff = new Date(deadline).getTime() - Date.now();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

function formatDeadline(deadline?: string | null): string | null {
  if (!deadline) return null;
  const days = daysLeft(deadline);
  if (days === null) return null;
  if (days <= 0) return "Ended";
  if (days === 1) return "1 day left";
  if (days <= 7) return `${days} days left`;
  return new Date(deadline).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

/* ── Main page ────────────────────────────────────────────── */
export default function ExplorePage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>(DEMO_CAMPAIGNS);
  const [loading, setLoading] = useState(true);
  const [activeId, setActiveId] = useState<string | undefined>();
  const [hoveredId, setHoveredId] = useState<string | undefined>();
  const [filter, setFilter] = useState("All");
  const [tierFilter, setTierFilter] = useState<Tier>("All");
  const [sortKey, setSortKey] = useState<SortKey>("newest");
  const [mobileView, setMobileView] = useState<"list" | "map">("list");
  const [isDemo, setIsDemo] = useState(true);

  useEffect(() => {
    async function fetchCampaigns() {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from("campaigns")
          .select(
            `id, title, description, payout, spots_remaining, deadline, lat, lng, created_at, merchants(business_name)`,
          )
          .eq("status", "active")
          .not("lat", "is", null)
          .not("lng", "is", null)
          .order("created_at", { ascending: false })
          .limit(50);

        if (!error && data && data.length > 0) {
          setCampaigns(
            data.map((c) => ({
              id: c.id,
              title: c.title,
              description: c.description,
              payout: Number(c.payout),
              spots_remaining: c.spots_remaining,
              deadline: c.deadline,
              lat: c.lat as number,
              lng: c.lng as number,
              created_at: c.created_at,
              business_name:
                (c.merchants as unknown as { business_name: string } | null)
                  ?.business_name ?? "Local Business",
            })),
          );
          setIsDemo(false);
        }
      } catch {
        // Fall through to demo data
      } finally {
        setLoading(false);
      }
    }
    fetchCampaigns();
  }, []);

  /* ── Filtered + sorted campaigns ─────────────────────────── */
  const filtered = useMemo(() => {
    let result = campaigns;

    if (filter !== "All") {
      result = result.filter((c) => c.category === filter);
    }

    if (tierFilter !== "All") {
      result = result.filter((c) => c.tier_required === tierFilter);
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
      case "newest":
      default:
        result = [...result].sort((a, b) => {
          const da = a.created_at ? new Date(a.created_at).getTime() : 0;
          const db = b.created_at ? new Date(b.created_at).getTime() : 0;
          return db - da;
        });
    }

    return result;
  }, [campaigns, filter, tierFilter, sortKey]);

  /* ── Stats ────────────────────────────────────────────────── */
  const stats = useMemo(() => {
    const totalSpots = campaigns.reduce((s, c) => s + c.spots_remaining, 0);
    const catCounts: Record<string, number> = {};
    campaigns.forEach((c) => {
      if (c.category) catCounts[c.category] = (catCounts[c.category] ?? 0) + 1;
    });
    return { totalSpots, catCounts };
  }, [campaigns]);

  function handlePinClick(id: string) {
    setActiveId((prev) => (prev === id ? undefined : id));
    const card = document.querySelector(`[data-campaign-id="${id}"]`);
    card?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  function handleCardClick(id: string) {
    setActiveId((prev) => (prev === id ? undefined : id));
  }

  function handlePopupClose() {
    setActiveId(undefined);
  }

  function resetFilters() {
    setFilter("All");
    setTierFilter("All");
    setSortKey("newest");
  }

  const mapCenter: [number, number] =
    filtered.length > 0 ? [filtered[0].lat, filtered[0].lng] : NYC;
  const displayId = activeId ?? hoveredId;

  return (
    <div className="explore">
      {/* ── Nav ──────────────────────────────────────────── */}
      <nav className="explore-nav">
        <Link href="/" className="explore-logo">
          Push<span className="explore-logo-dot">.</span>
        </Link>

        <div className="explore-search-pill">
          <span className="search-pill-location">Lower Manhattan</span>
          <span className="search-pill-sep" />
          <span className="search-pill-count">
            {filtered.length} open · pilot opens June 22
          </span>
          {isDemo && <span className="search-pill-demo">demo data</span>}
        </div>

        <div className="explore-nav-right">
          <Link href="/demo/creator" className="nav-link nav-link--demo">
            try demo
          </Link>
          <span className="nav-divider" />
          <Link href="/creator/login" className="nav-link">
            log in
          </Link>
          <span className="nav-divider" />
          <Link href="/creator/signup" className="nav-link">
            apply
          </Link>
        </div>
      </nav>

      {/* ── Body ─────────────────────────────────────────── */}
      <div
        className={`explore-body ${mobileView === "map" ? "explore-body--map" : ""}`}
      >
        <aside className="explore-panel">
          {/* ── Panel header — section-marker + ghost ──── */}
          <div className="exp-panel-head">
            <div className="exp-panel-head-row">
              <span className="section-marker" data-num="01">
                Walkable
              </span>
              <span className="exp-panel-head-meta">
                7 blocks · SoHo / Tribeca / Chinatown
              </span>
            </div>
            <h1 className="exp-panel-head-title">
              Nearby<span className="exp-panel-head-dot">.</span>
            </h1>
            <p className="exp-panel-head-sub">
              A creator posts. Someone walks in. The spot pays only when that
              visit is real.
            </p>
          </div>

          {/* ── Stats bar ─────────────────────────────────── */}
          {!loading && (
            <div className="exp-stats-bar">
              <div className="exp-stats-item">
                <span className="exp-stats-num">{campaigns.length}</span>
                <span className="exp-stats-label">open</span>
              </div>
              <div className="exp-stats-divider" />
              <div className="exp-stats-item">
                <span className="exp-stats-num">{stats.totalSpots}</span>
                <span className="exp-stats-label">spots</span>
              </div>
              <div className="exp-stats-divider" />
              <div className="exp-stats-cats">
                {Object.entries(stats.catCounts)
                  .slice(0, 4)
                  .map(([cat, count]) => (
                    <span key={cat} className="exp-stats-cat-dot-wrap">
                      <span
                        className="exp-cat-dot"
                        style={{
                          background: CATEGORY_DOT_COLOR[cat] ?? "var(--dark)",
                        }}
                      />
                      <span className="exp-stats-cat-name">{cat}</span>
                      <span className="exp-stats-cat-count">{count}</span>
                    </span>
                  ))}
              </div>
            </div>
          )}

          {/* ── Category filter bar ───────────────────────── */}
          <div className="panel-filter-bar">
            <span className="panel-count">{filtered.length} open</span>
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                className={`filter-tab ${filter === cat ? "filter-tab--active" : ""}`}
                onClick={() => setFilter(cat)}
              >
                {cat !== "All" && (
                  <span
                    className="filter-tab-dot"
                    style={{
                      background: CATEGORY_DOT_COLOR[cat] ?? "var(--dark)",
                    }}
                  />
                )}
                {cat === "All" ? "all" : cat.toLowerCase()}
              </button>
            ))}
          </div>

          {/* ── Tier filter + sort ────────────────────────── */}
          <div className="exp-controls-row">
            <div className="exp-tier-filters">
              {TIERS.map((tier) => {
                const isActive = tierFilter === tier;
                const colors = tier !== "All" ? TIER_COLORS[tier] : null;
                return (
                  <button
                    key={tier}
                    className={`exp-tier-chip ${isActive ? "exp-tier-chip--active" : ""}`}
                    style={
                      isActive && colors
                        ? {
                            background: colors.bg,
                            color: colors.text,
                            borderColor: colors.bg,
                          }
                        : {}
                    }
                    onClick={() => setTierFilter(tier)}
                  >
                    {tier}
                  </button>
                );
              })}
            </div>

            <div className="exp-sort-group">
              {SORT_OPTIONS.map((opt) => (
                <button
                  key={opt.key}
                  className={`exp-sort-btn ${sortKey === opt.key ? "exp-sort-btn--active" : ""}`}
                  onClick={() => setSortKey(opt.key)}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* ── Sign-up nudge ─────────────────────────────── */}
          <div className="exp-signup-nudge">
            <span className="exp-nudge-text">
              No follower bar. Pay on Friday via Stripe.
            </span>
            <Link href="/creator/signup" className="exp-nudge-btn">
              apply →
            </Link>
          </div>

          {/* ── Card list ─────────────────────────────────── */}
          <div className="panel-list-wrap">
            <div className="panel-list">
              {loading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="skeleton-card">
                    <div className="skeleton skeleton-thumb" />
                    <div className="skeleton-lines">
                      <div className="skeleton skeleton-line skeleton-line--short" />
                      <div className="skeleton skeleton-line skeleton-line--med" />
                    </div>
                  </div>
                ))
              ) : filtered.length === 0 ? (
                <div className="exp-empty">
                  <div className="exp-empty-icon">
                    <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                      <circle
                        cx="24"
                        cy="24"
                        r="20"
                        stroke="var(--dark)"
                        strokeOpacity="0.12"
                        strokeWidth="2"
                      />
                      <path
                        d="M16 24h16M24 16v16"
                        stroke="var(--dark)"
                        strokeOpacity="0.2"
                        strokeWidth="2"
                        strokeLinecap="square"
                      />
                    </svg>
                  </div>
                  <p className="exp-empty-title">Nothing in 4 blocks.</p>
                  <p className="exp-empty-msg">
                    Tight filters. Widen the net and try again.
                  </p>
                  <button className="exp-empty-reset" onClick={resetFilters}>
                    reset →
                  </button>
                </div>
              ) : (
                filtered.map((c) => (
                  <ExploreCard
                    key={c.id}
                    campaign={c}
                    active={activeId === c.id}
                    hovered={hoveredId === c.id}
                    onClick={() => handleCardClick(c.id)}
                    onMouseEnter={() => setHoveredId(c.id)}
                    onMouseLeave={() => setHoveredId(undefined)}
                  />
                ))
              )}
            </div>
          </div>
        </aside>

        <div className="explore-map-pane">
          <MapView
            campaigns={filtered}
            center={mapCenter}
            activeId={displayId}
            onPinClick={handlePinClick}
            onPopupClose={handlePopupClose}
            showPricePills
            showPopups
            mono
          />
        </div>
      </div>

      <div className="mobile-toggle">
        <button
          className="btn btn-primary mobile-toggle-btn"
          onClick={() => setMobileView((v) => (v === "list" ? "map" : "list"))}
        >
          {mobileView === "list" ? "Show map" : "Show list"}
        </button>
      </div>
    </div>
  );
}

/* ── Card ────────────────────────────────────────────────── */
function ExploreCard({
  campaign: c,
  active,
  hovered,
  onClick,
  onMouseEnter,
  onMouseLeave,
}: {
  campaign: Campaign;
  active: boolean;
  hovered: boolean;
  onClick: () => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}) {
  const spotsTotal = c.spots_total ?? 20;
  const spotsRatio = c.spots_remaining / spotsTotal;
  const spotsLow = spotsRatio < 0.2;
  const spotsUrgent = c.spots_remaining <= 2;

  const isFree = c.payout === 0;
  const payoutLabel = isFree ? "Free" : `$${c.payout}`;
  const thumbClass = CATEGORY_CLASS[c.category ?? ""] ?? "card-thumb--default";
  const deadlineLabel = formatDeadline(c.deadline);

  const tierColors = c.tier_required ? TIER_COLORS[c.tier_required] : null;
  const catDotColor = CATEGORY_DOT_COLOR[c.category ?? ""] ?? "var(--dark)";

  return (
    <div
      data-campaign-id={c.id}
      className={[
        "explore-card",
        active ? "explore-card--active" : "",
        hovered ? "explore-card--hovered" : "",
      ]
        .filter(Boolean)
        .join(" ")}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && onClick()}
    >
      <div className={`card-thumb ${thumbClass}`}>
        {c.image ? (
          <img
            src={c.image}
            alt={c.title}
            className="card-thumb-img"
            loading="lazy"
          />
        ) : (
          <span className="card-thumb-letter">{c.business_name[0]}</span>
        )}
        <span
          className={`card-payout-badge ${isFree ? "card-payout-badge--free" : ""}`}
        >
          {payoutLabel}
        </span>

        {/* Category dot on image */}
        <span
          className="card-cat-dot"
          style={{ background: catDotColor }}
          title={c.category}
        />
      </div>

      <div className="card-info">
        <div className="card-row-top">
          <span className="card-business">{c.business_name}</span>

          {/* Tier badge — inline styled, no TierBadge import */}
          {c.tier_required && tierColors && (
            <span
              className="card-tier-badge"
              style={{ background: tierColors.bg, color: tierColors.text }}
            >
              {c.tier_required}
            </span>
          )}
        </div>

        <h3 className="card-title">{c.title}</h3>

        {/* Description snippet */}
        {c.description && <p className="card-desc">{c.description}</p>}

        <div className="card-row-meta">
          {/* Spots with urgency */}
          <span
            className={[
              "card-spots",
              spotsUrgent ? "card-spots--urgent" : "",
              spotsLow && !spotsUrgent ? "exp-card-urgency" : "",
            ]
              .filter(Boolean)
              .join(" ")}
          >
            {c.spots_remaining} spot{c.spots_remaining !== 1 ? "s" : ""} left
          </span>

          {/* Deadline */}
          {deadlineLabel && (
            <span
              className={`card-deadline ${deadlineLabel === "Ended" || (daysLeft(c.deadline) ?? 99) <= 3 ? "card-deadline--soon" : ""}`}
            >
              {deadlineLabel}
            </span>
          )}
        </div>

        {/* Apply CTA — shown on active/hover */}
        <div className="card-apply-row">
          <Link
            href="/creator/signup"
            className="card-apply-btn"
            onClick={(e) => e.stopPropagation()}
          >
            Apply →
          </Link>
        </div>
      </div>
    </div>
  );
}
