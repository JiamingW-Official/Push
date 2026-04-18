"use client";

/**
 * Creator Explore — Editorial campaign discovery feed (v5.1)
 *
 * Vertical AI for Local Commerce · Customer Acquisition Engine
 *
 * Pattern: Design.md → Feed Grid + Filter Bar + Campaign Card.
 * Hero (slim) → Filter toolbar → Featured + grid → Empty state.
 * Stagger entrance via `feedCardIn` 500ms.
 */

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import "./explore.css";

/* ── Types ────────────────────────────────────────────────── */

type Tier = "seed" | "explorer" | "operator" | "proven" | "closer" | "partner";
type Category = "Coffee+" | "Dessert" | "Fitness" | "Beauty";
type AOVBand = "$8-12" | "$12-20" | "$20-40" | "$40+";
type SortKey = "newest" | "payout" | "closest" | "deadline";

type Campaign = {
  id: string;
  title: string;
  merchant: string;
  neighborhood: string;
  zip: string;
  category: Category;
  payout: number;
  aovBand: AOVBand;
  tier: Tier;
  postedDaysAgo: number;
  deadlineDays: number;
  distanceMi: number;
  image: string;
  featured?: boolean;
  spots: number;
  format: string;
};

/* ── Demo data ────────────────────────────────────────────── */
/**
 * 12 campaigns spanning Coffee+, Dessert, Fitness, Beauty.
 * Payouts range $12-$85. Tiers seed→partner. AOV bands $8-$40+.
 */
const CAMPAIGNS: Campaign[] = [
  {
    id: "c-001",
    title: "Sunday Morning Pour-Over Ritual",
    merchant: "Sey Coffee",
    neighborhood: "Bushwick",
    zip: "11206",
    category: "Coffee+",
    payout: 42,
    aovBand: "$12-20",
    tier: "explorer",
    postedDaysAgo: 2,
    deadlineDays: 9,
    distanceMi: 1.8,
    image:
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1200&q=80",
    featured: true,
    spots: 6,
    format: "1 Reel + 2 stories",
  },
  {
    id: "c-002",
    title: "Williamsburg Weekday Cortado Run",
    merchant: "Devoción",
    neighborhood: "Williamsburg",
    zip: "11211",
    category: "Coffee+",
    payout: 28,
    aovBand: "$8-12",
    tier: "seed",
    postedDaysAgo: 1,
    deadlineDays: 3,
    distanceMi: 0.6,
    image:
      "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=1200&q=80",
    spots: 4,
    format: "2 stories, tag required",
  },
  {
    id: "c-003",
    title: "Partners Coffee Corner Brief",
    merchant: "Partners Coffee",
    neighborhood: "Williamsburg",
    zip: "11211",
    category: "Coffee+",
    payout: 35,
    aovBand: "$12-20",
    tier: "explorer",
    postedDaysAgo: 4,
    deadlineDays: 11,
    distanceMi: 0.9,
    image:
      "https://images.unsplash.com/photo-1498804103079-a6351b050096?auto=format&fit=crop&w=1200&q=80",
    spots: 8,
    format: "1 Reel + 1 feed post",
  },
  {
    id: "c-004",
    title: "Variety Coffee Hour of Focus",
    merchant: "Variety Coffee Roasters",
    neighborhood: "Greenpoint",
    zip: "11222",
    category: "Coffee+",
    payout: 22,
    aovBand: "$8-12",
    tier: "seed",
    postedDaysAgo: 6,
    deadlineDays: 1,
    distanceMi: 1.2,
    image:
      "https://images.unsplash.com/photo-1442975631115-c4f7b05b8a2c?auto=format&fit=crop&w=1200&q=80",
    spots: 2,
    format: "2 stories",
  },
  {
    id: "c-005",
    title: "Hudson Square Specialty Roast",
    merchant: "Stumptown Coffee",
    neighborhood: "Hudson Square",
    zip: "10013",
    category: "Coffee+",
    payout: 55,
    aovBand: "$12-20",
    tier: "operator",
    postedDaysAgo: 3,
    deadlineDays: 14,
    distanceMi: 3.4,
    image:
      "https://images.unsplash.com/photo-1453614512568-c4024d13c247?auto=format&fit=crop&w=1200&q=80",
    spots: 5,
    format: "1 Reel with merchant walkthrough",
  },
  {
    id: "c-006",
    title: "Bakeri Scandinavian Bakery Feature",
    merchant: "Bakeri",
    neighborhood: "Greenpoint",
    zip: "11222",
    category: "Dessert",
    payout: 38,
    aovBand: "$12-20",
    tier: "explorer",
    postedDaysAgo: 2,
    deadlineDays: 7,
    distanceMi: 1.0,
    image:
      "https://images.unsplash.com/photo-1517433670267-08bbd4be890f?auto=format&fit=crop&w=1200&q=80",
    spots: 3,
    format: "1 feed carousel",
  },
  {
    id: "c-007",
    title: "Oslo Coffee Nordic Minimal",
    merchant: "Oslo Coffee Roasters",
    neighborhood: "Williamsburg",
    zip: "11249",
    category: "Coffee+",
    payout: 18,
    aovBand: "$8-12",
    tier: "seed",
    postedDaysAgo: 8,
    deadlineDays: 5,
    distanceMi: 0.4,
    image:
      "https://images.unsplash.com/photo-1559496417-e7f25cb247f3?auto=format&fit=crop&w=1200&q=80",
    spots: 7,
    format: "2 stories",
  },
  {
    id: "c-008",
    title: "Bushwick Pastry & Matcha Drop",
    merchant: "Mitsuwa Pastry Bar",
    neighborhood: "Bushwick",
    zip: "11221",
    category: "Dessert",
    payout: 48,
    aovBand: "$12-20",
    tier: "explorer",
    postedDaysAgo: 5,
    deadlineDays: 10,
    distanceMi: 2.2,
    image:
      "https://images.unsplash.com/photo-1486427944299-d1955d23e34d?auto=format&fit=crop&w=1200&q=80",
    spots: 4,
    format: "1 Reel + 1 story",
  },
  {
    id: "c-009",
    title: "Soft-Serve Sunset Studio Visit",
    merchant: "Choc-o-Pain Gelato",
    neighborhood: "Cobble Hill",
    zip: "11201",
    category: "Dessert",
    payout: 12,
    aovBand: "$8-12",
    tier: "seed",
    postedDaysAgo: 1,
    deadlineDays: 2,
    distanceMi: 4.1,
    image:
      "https://images.unsplash.com/photo-1542826438-bd32f43d626f?auto=format&fit=crop&w=1200&q=80",
    spots: 10,
    format: "1 story",
  },
  {
    id: "c-010",
    title: "Brooklyn Barre Morning Class",
    merchant: "Bar Method Brooklyn",
    neighborhood: "Cobble Hill",
    zip: "11201",
    category: "Fitness",
    payout: 65,
    aovBand: "$20-40",
    tier: "operator",
    postedDaysAgo: 3,
    deadlineDays: 12,
    distanceMi: 3.8,
    image:
      "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=1200&q=80",
    spots: 5,
    format: "1 Reel + 3 stories",
  },
  {
    id: "c-011",
    title: "Strength Studio Six-Week Follow",
    merchant: "Steel & Form",
    neighborhood: "Bushwick",
    zip: "11206",
    category: "Fitness",
    payout: 85,
    aovBand: "$40+",
    tier: "proven",
    postedDaysAgo: 7,
    deadlineDays: 18,
    distanceMi: 1.9,
    image:
      "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1200&q=80",
    spots: 2,
    format: "Weekly Reel series, 6 weeks",
  },
  {
    id: "c-012",
    title: "Clean Beauty Ritual Editorial",
    merchant: "Maude Skin Studio",
    neighborhood: "Park Slope",
    zip: "11215",
    category: "Beauty",
    payout: 72,
    aovBand: "$40+",
    tier: "proven",
    postedDaysAgo: 4,
    deadlineDays: 16,
    distanceMi: 5.2,
    image:
      "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1200&q=80",
    spots: 3,
    format: "1 Reel + 2 feed posts",
  },
];

/* ── Constants ────────────────────────────────────────────── */

const CATEGORIES: { key: Category | "all"; label: string }[] = [
  { key: "all", label: "All" },
  { key: "Coffee+", label: "Coffee+" },
  { key: "Dessert", label: "Dessert" },
  { key: "Fitness", label: "Fitness" },
  { key: "Beauty", label: "Beauty" },
];

const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: "newest", label: "Newest" },
  { key: "payout", label: "Highest payout" },
  { key: "closest", label: "Closest to me" },
  { key: "deadline", label: "Deadline" },
];

const TIER_LABELS: Record<Tier, string> = {
  seed: "Clay · Seed",
  explorer: "Bronze · Explorer",
  operator: "Steel · Operator",
  proven: "Gold · Proven",
  closer: "Ruby · Closer",
  partner: "Obsidian · Partner",
};

/** Demo creator tier — a mid-range Explorer so gate toggle does real work. */
const CURRENT_CREATOR_TIER: Tier = "explorer";
const TIER_RANK: Record<Tier, number> = {
  seed: 1,
  explorer: 2,
  operator: 3,
  proven: 4,
  closer: 5,
  partner: 6,
};

/* ── Helpers ──────────────────────────────────────────────── */

function urgencyKind(days: number): "urgent" | "warning" | "none" {
  if (days <= 2) return "urgent";
  if (days <= 6) return "warning";
  return "none";
}

function formatDeadline(days: number): string {
  if (days <= 0) return "Closes today";
  if (days === 1) return "1 day left";
  if (days <= 30) return `${days} days left`;
  return `${Math.round(days / 7)} weeks left`;
}

/* ── Page ─────────────────────────────────────────────────── */

export default function CreatorExplorePage() {
  /* -- Filter state -- */
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<Category | "all">("all");
  const [tierGate, setTierGate] = useState(false);
  const [sort, setSort] = useState<SortKey>("newest");
  const [zip, setZip] = useState<string>("11211");

  /* -- Visible count (for load-more) -- */
  const [visible, setVisible] = useState(8);

  /* -- Back-to-top visibility -- */
  const [showBackToTop, setShowBackToTop] = useState(false);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  /* -- Search focus shortcut '/' -- */
  const searchRef = useRef<HTMLInputElement | null>(null);
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key !== "/") return;
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable)
      )
        return;
      e.preventDefault();
      searchRef.current?.focus();
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  /* -- Scroll listener for back-to-top -- */
  useEffect(() => {
    function onScroll() {
      setShowBackToTop(window.scrollY > 600);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* -- Derived campaigns: filter → sort -- */
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    let rows = CAMPAIGNS.filter((c) => {
      if (category !== "all" && c.category !== category) return false;
      if (tierGate && TIER_RANK[c.tier] > TIER_RANK[CURRENT_CREATOR_TIER])
        return false;
      if (!q) return true;
      return (
        c.title.toLowerCase().includes(q) ||
        c.merchant.toLowerCase().includes(q) ||
        c.neighborhood.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q)
      );
    });

    switch (sort) {
      case "payout":
        rows = [...rows].sort((a, b) => b.payout - a.payout);
        break;
      case "closest":
        rows = [...rows].sort((a, b) => a.distanceMi - b.distanceMi);
        break;
      case "deadline":
        rows = [...rows].sort((a, b) => a.deadlineDays - b.deadlineDays);
        break;
      case "newest":
      default:
        rows = [...rows].sort((a, b) => a.postedDaysAgo - b.postedDaysAgo);
        break;
    }
    return rows;
  }, [search, category, tierGate, sort]);

  /* -- Progress percent -- */
  const progressPct =
    filtered.length === 0
      ? 0
      : Math.min(
          100,
          Math.round(
            (Math.min(visible, filtered.length) / filtered.length) * 100,
          ),
        );

  /* -- Reset visible when filters change -- */
  useEffect(() => {
    setVisible(8);
  }, [search, category, tierGate, sort]);

  const shown = filtered.slice(0, visible);
  const hasMore = visible < filtered.length;

  function clearFilters() {
    setSearch("");
    setCategory("all");
    setTierGate(false);
    setSort("newest");
  }

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  /* ── Render ─────────────────────────────────────────────── */

  return (
    <div className="ce" ref={scrollRef}>
      {/* Progress bar (fixed top) */}
      <div
        className="ce-progress"
        role="progressbar"
        aria-valuenow={progressPct}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className="ce-progress-fill"
          style={{ width: `${progressPct}%` }}
        />
      </div>

      {/* Top bar */}
      <header className="ce-topbar">
        <Link href="/creator/dashboard" className="ce-topbar-back">
          ← Dashboard
        </Link>
        <span className="ce-topbar-brand">Customer Acquisition Engine</span>
        <Link href="/creator/dashboard" className="ce-topbar-link">
          My Campaigns →
        </Link>
      </header>

      {/* Hero (slim) */}
      <section className="ce-hero">
        <div className="ce-hero-inner">
          <span className="ce-eyebrow">Explore</span>
          <h1 className="ce-hero-title">Live campaigns near you.</h1>
          <p className="ce-hero-sub">
            Vertical AI for Local Commerce — Williamsburg Coffee+ merchants,
            verified by ConversionOracle™ walk-in ground truth.
          </p>
          <div className="ce-zip-row">
            <label className="ce-zip-label" htmlFor="ce-zip">
              Neighborhood
            </label>
            <select
              id="ce-zip"
              className="ce-zip-select"
              value={zip}
              onChange={(e) => setZip(e.target.value)}
            >
              <option value="11211">11211 — Williamsburg</option>
              <option value="11222">11222 — Greenpoint</option>
              <option value="11206">11206 — Bushwick</option>
              <option value="11215">11215 — Park Slope</option>
              <option value="11201">11201 — Cobble Hill</option>
              <option value="10013">10013 — Hudson Square</option>
            </select>
          </div>
        </div>
      </section>

      {/* Filter toolbar */}
      <section className="ce-filter">
        <div className="ce-filter-inner">
          <div className="ce-search-wrap">
            <svg
              className="ce-search-icon"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="M21 21l-4.3-4.3" />
            </svg>
            <input
              ref={searchRef}
              className="ce-search"
              type="text"
              placeholder="Search merchant, title, neighborhood   /  "
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="ce-chip-row" role="tablist" aria-label="Category">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.key}
                type="button"
                className={`ce-chip${category === cat.key ? " ce-chip--on" : ""}`}
                onClick={() => setCategory(cat.key)}
                role="tab"
                aria-selected={category === cat.key}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="ce-controls">
            <label className="ce-toggle">
              <input
                type="checkbox"
                checked={tierGate}
                onChange={(e) => setTierGate(e.target.checked)}
              />
              <span className="ce-toggle-track">
                <span className="ce-toggle-thumb" />
              </span>
              <span className="ce-toggle-label">
                Show only campaigns I qualify for
              </span>
            </label>

            <div className="ce-sort-wrap">
              <span className="ce-sort-label">Sort</span>
              <select
                className="ce-sort"
                value={sort}
                onChange={(e) => setSort(e.target.value as SortKey)}
                aria-label="Sort campaigns"
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.key} value={opt.key}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="ce-count">
            <span className="ce-count-num">{filtered.length}</span>
            <span className="ce-count-sep">/</span>
            <span className="ce-count-total">{CAMPAIGNS.length}</span>
            <span className="ce-count-lbl">campaigns</span>
          </div>
        </div>
      </section>

      {/* Feed */}
      <main className="ce-feed">
        {shown.length === 0 ? (
          <div className="ce-empty">
            <span className="ce-empty-eyebrow">No matches</span>
            <h2 className="ce-empty-title">No campaigns match your filters.</h2>
            <p className="ce-empty-sub">
              Try widening your category or clearing the tier gate. Williamsburg
              Coffee+ is our beachhead — most creators start there.
            </p>
            <button
              type="button"
              className="ce-empty-cta"
              onClick={clearFilters}
            >
              Clear all filters
            </button>
          </div>
        ) : (
          <>
            <div className="ce-grid">
              {shown.map((c, idx) => (
                <CampaignCard
                  key={c.id}
                  c={c}
                  featured={idx === 0}
                  delay={Math.min(idx, 8) * 60}
                />
              ))}
            </div>

            {/* Gradient fade + load more */}
            <div className="ce-fade" aria-hidden="true" />
            <div className="ce-loadmore-row">
              <span className="ce-showing">
                Showing <span className="ce-showing-num">{shown.length}</span>{" "}
                of <span className="ce-showing-num">{filtered.length}</span>
              </span>
              {hasMore ? (
                <button
                  type="button"
                  className="ce-loadmore"
                  onClick={() => setVisible((v) => v + 4)}
                >
                  Load more campaigns
                </button>
              ) : (
                <span className="ce-exhausted">All campaigns loaded</span>
              )}
            </div>
          </>
        )}
      </main>

      {/* Back to top (exception: 50% radius) */}
      {showBackToTop && (
        <button
          type="button"
          className="ce-top"
          aria-label="Back to top"
          onClick={scrollToTop}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            aria-hidden="true"
          >
            <path d="M12 19V5M5 12l7-7 7 7" />
          </svg>
        </button>
      )}
    </div>
  );
}

/* ── Campaign Card ────────────────────────────────────────── */

function CampaignCard({
  c,
  featured,
  delay,
}: {
  c: Campaign;
  featured: boolean;
  delay: number;
}) {
  const urgency = urgencyKind(c.deadlineDays);
  const qualified = TIER_RANK[c.tier] <= TIER_RANK[CURRENT_CREATOR_TIER];

  return (
    <article
      className={`ce-card${featured ? " ce-card--featured" : ""}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* Hero image */}
      <div className="ce-card-media">
        <img
          src={c.image}
          alt={`${c.merchant} — ${c.title}`}
          className="ce-card-img"
          loading="lazy"
        />
        <div className="ce-card-overlay" aria-hidden="true" />

        {/* Payout badge */}
        <span className="ce-card-payout">
          <span className="ce-card-payout-amt">${c.payout}</span>
          <span className="ce-card-payout-lbl">per customer</span>
        </span>

        {/* Meta chips (top-right, glass) */}
        <div className="ce-card-chips">
          <span className="ce-card-chip">{c.category}</span>
          <span className="ce-card-chip">AOV {c.aovBand}</span>
        </div>

        {/* Featured ribbon */}
        {featured && <span className="ce-card-featured">Featured</span>}
      </div>

      {/* Body */}
      <div className="ce-card-body">
        <div className="ce-card-bizrow">
          <span className="ce-card-biz">{c.merchant}</span>
          <span className="ce-card-dot" aria-hidden="true">
            ·
          </span>
          <span className="ce-card-hood">{c.neighborhood}</span>
        </div>

        <h3 className="ce-card-title">{c.title}</h3>

        <div className="ce-card-meta">
          <span className="ce-card-metaitem">
            <span className="ce-card-metakey">Tier</span>
            <span
              className={`ce-card-tier ce-card-tier--${c.tier}${qualified ? "" : " ce-card-tier--locked"}`}
            >
              {TIER_LABELS[c.tier]}
            </span>
          </span>
          <span className="ce-card-metaitem">
            <span className="ce-card-metakey">Format</span>
            <span className="ce-card-metaval">{c.format}</span>
          </span>
        </div>

        <div className="ce-card-footer">
          <span className={`ce-card-deadline ce-card-deadline--${urgency}`}>
            <span className="ce-card-deadline-dot" aria-hidden="true" />
            {formatDeadline(c.deadlineDays)}
          </span>
          <span className="ce-card-spots">
            {c.spots} spot{c.spots === 1 ? "" : "s"} left
          </span>
          <button
            type="button"
            className="ce-card-apply"
            disabled={!qualified}
            aria-disabled={!qualified}
          >
            {qualified ? "Apply" : "Tier locked"}
          </button>
        </div>
      </div>
    </article>
  );
}
