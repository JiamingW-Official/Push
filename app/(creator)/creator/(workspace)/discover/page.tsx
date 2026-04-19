"use client";

import { useCallback, useMemo, useState } from "react";
import Link from "next/link";
import "./discover.css";

/* ── View mode ───────────────────────────────────────────── */
type ViewMode = "grid" | "map";

/* ── Types ────────────────────────────────────────────────── */

type Category =
  | "ALL"
  | "FOOD & DRINK"
  | "RETAIL"
  | "WELLNESS"
  | "BEAUTY"
  | "FITNESS"
  | "LIFESTYLE";

type EarningFilter = "ALL" | "$15+" | "$25+" | "$40+";
type DistanceFilter = "ALL" | "< 0.5mi" | "< 1mi" | "< 2mi";
type TypeFilter = "ALL" | "IN-PERSON" | "REMOTE OK";

type SortKey = "match" | "payout" | "ending-soon" | "spots";

type ApplicationStatus = "none" | "applied" | "pending";

interface Campaign {
  id: string;
  title: string;
  merchantName: string;
  neighborhood: string;
  category: Category | string;
  payout: number; // 0 = free
  payoutLabel: string;
  slotsTotal: number;
  slotsRemaining: number;
  slotsFilledToday: number;
  createdIso?: string; // for "NEW" badge (< 48h)
  deadlineIso?: string;
  distanceMi: number;
  isRemoteOk: boolean;
  matchScore: number; // 0-100
  isFeatured?: boolean;
  socialProof?: string;
  isRecommended?: boolean;
  tags: string[];
  image?: string;
}

/* ── Constants ────────────────────────────────────────────── */

const CATEGORY_COLORS: Record<string, string> = {
  "FOOD & DRINK": "var(--disc-cat-food)",
  Food: "var(--disc-cat-food)",
  Coffee: "var(--disc-cat-coffee)",
  BEAUTY: "var(--disc-cat-beauty)",
  Beauty: "var(--disc-cat-beauty)",
  RETAIL: "var(--disc-cat-retail)",
  Retail: "var(--disc-cat-retail)",
  WELLNESS: "var(--disc-cat-wellness)",
  Wellness: "var(--disc-cat-wellness)",
  FITNESS: "var(--disc-cat-fitness)",
  Fitness: "var(--disc-cat-fitness)",
  LIFESTYLE: "var(--disc-cat-lifestyle)",
  Lifestyle: "var(--disc-cat-lifestyle)",
};

/* ── Mock data ────────────────────────────────────────────── */

const MOCK_CAMPAIGNS: Campaign[] = [
  {
    id: "disc-001",
    title: "Rooftop Coffee Series",
    merchantName: "Blank Street Coffee",
    neighborhood: "Williamsburg, BK",
    category: "Coffee",
    payout: 32,
    payoutLabel: "per visit",
    slotsTotal: 20,
    slotsRemaining: 6,
    slotsFilledToday: 4,
    createdIso: "2026-04-17",
    deadlineIso: "2026-04-28",
    distanceMi: 0.4,
    isRemoteOk: false,
    matchScore: 94,
    isFeatured: true,
    socialProof: "8 applying now",
    isRecommended: true,
    tags: ["Coffee", "Williamsburg"],
    image: undefined,
  },
  {
    id: "disc-002",
    title: "Chelsea Market Food Walk",
    merchantName: "Chelsea Market",
    neighborhood: "Chelsea, NYC",
    category: "FOOD & DRINK",
    payout: 45,
    payoutLabel: "per post",
    slotsTotal: 10,
    slotsRemaining: 2,
    slotsFilledToday: 6,
    createdIso: "2026-04-18",
    deadlineIso: "2026-05-08",
    distanceMi: 1.2,
    isRemoteOk: false,
    matchScore: 88,
    isFeatured: false,
    socialProof: "12 creators applied today",
    isRecommended: true,
    tags: ["Food & Drink", "Chelsea"],
    image:
      "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=120&q=80",
  },
  {
    id: "disc-003",
    title: "Flatiron Brunch Story",
    merchantName: "Eataly NYC Flatiron",
    neighborhood: "Flatiron, NYC",
    category: "FOOD & DRINK",
    payout: 60,
    payoutLabel: "per reel",
    slotsTotal: 8,
    slotsRemaining: 4,
    slotsFilledToday: 3,
    createdIso: "2026-04-17",
    deadlineIso: "2026-05-12",
    distanceMi: 0.8,
    isRemoteOk: false,
    matchScore: 81,
    tags: ["Food & Drink", "Flatiron"],
    image:
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=120&q=80",
  },
  {
    id: "disc-004",
    title: "Pilates Studio Grand Opening",
    merchantName: "Forma Pilates Chelsea",
    neighborhood: "Chelsea, NYC",
    category: "FITNESS",
    payout: 40,
    payoutLabel: "per visit",
    slotsTotal: 12,
    slotsRemaining: 7,
    slotsFilledToday: 2,
    createdIso: "2026-04-16",
    deadlineIso: "2026-05-01",
    distanceMi: 1.5,
    isRemoteOk: false,
    matchScore: 72,
    isRecommended: false,
    tags: ["Fitness", "Wellness"],
    image:
      "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=120&q=80",
  },
  {
    id: "disc-005",
    title: "Gallery Opening Night",
    merchantName: "Tara Downs Gallery",
    neighborhood: "Chelsea, NYC",
    category: "LIFESTYLE",
    payout: 75,
    payoutLabel: "per campaign",
    slotsTotal: 6,
    slotsRemaining: 3,
    slotsFilledToday: 1,
    createdIso: "2026-04-18",
    deadlineIso: "2026-05-05",
    distanceMi: 0.9,
    isRemoteOk: false,
    matchScore: 65,
    tags: ["Lifestyle", "Art"],
    image:
      "https://images.unsplash.com/photo-1487530811176-3780de880c2d?w=120&q=80",
  },
  {
    id: "disc-006",
    title: "Beauty Lab Skincare Series",
    merchantName: "Bluemercury SoHo",
    neighborhood: "SoHo, NYC",
    category: "BEAUTY",
    payout: 55,
    payoutLabel: "per story set",
    slotsTotal: 8,
    slotsRemaining: 5,
    slotsFilledToday: 2,
    createdIso: "2026-04-15",
    deadlineIso: "2026-05-15",
    distanceMi: 0.7,
    isRemoteOk: false,
    matchScore: 78,
    isRecommended: true,
    tags: ["Beauty", "Skincare"],
    image:
      "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=120&q=80",
  },
  {
    id: "disc-007",
    title: "Boutique Opening Campaign",
    merchantName: "Madewell Soho",
    neighborhood: "SoHo, NYC",
    category: "RETAIL",
    payout: 28,
    payoutLabel: "per post",
    slotsTotal: 15,
    slotsRemaining: 10,
    slotsFilledToday: 3,
    createdIso: "2026-04-18",
    deadlineIso: "2026-05-20",
    distanceMi: 0.5,
    isRemoteOk: true,
    matchScore: 58,
    tags: ["Retail", "Fashion"],
    image:
      "https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=120&q=80",
  },
  {
    id: "disc-008",
    title: "Morning Ritual Brew",
    merchantName: "Intelligentsia Coffee",
    neighborhood: "West Village, NYC",
    category: "Coffee",
    payout: 0,
    payoutLabel: "free entry",
    slotsTotal: 20,
    slotsRemaining: 14,
    slotsFilledToday: 1,
    createdIso: "2026-04-17",
    deadlineIso: "2026-04-30",
    distanceMi: 1.8,
    isRemoteOk: false,
    matchScore: 91,
    isRecommended: true,
    tags: ["Coffee", "West Village"],
    image:
      "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=120&q=80",
  },
  {
    id: "disc-009",
    title: "Wellness Studio Launch",
    merchantName: "The Well NYC",
    neighborhood: "Midtown, NYC",
    category: "WELLNESS",
    payout: 85,
    payoutLabel: "per campaign",
    slotsTotal: 5,
    slotsRemaining: 1,
    slotsFilledToday: 2,
    createdIso: "2026-04-14",
    deadlineIso: "2026-04-26",
    distanceMi: 1.1,
    isRemoteOk: false,
    matchScore: 84,
    socialProof: "5 applied this week",
    tags: ["Wellness", "Holistic"],
    image:
      "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=120&q=80",
  },
  {
    id: "disc-010",
    title: "Farm-to-Table Dinner Series",
    merchantName: "Blue Hill Restaurant",
    neighborhood: "West Village, NYC",
    category: "FOOD & DRINK",
    payout: 250,
    payoutLabel: "per campaign",
    slotsTotal: 2,
    slotsRemaining: 1,
    slotsFilledToday: 1,
    createdIso: "2026-04-13",
    deadlineIso: "2026-05-20",
    distanceMi: 1.4,
    isRemoteOk: false,
    matchScore: 76,
    socialProof: "Partner-only access",
    tags: ["Fine Dining", "West Village"],
    image:
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=120&q=80",
  },
];

/* ── Helpers ──────────────────────────────────────────────── */

function daysLeft(iso?: string): number | null {
  if (!iso) return null;
  return Math.ceil((new Date(iso).getTime() - Date.now()) / 86400000);
}

function isUrgent(iso?: string): boolean {
  const d = daysLeft(iso);
  return d !== null && d <= 3;
}

function isNew(createdIso?: string): boolean {
  if (!createdIso) return false;
  const hoursAgo = (Date.now() - new Date(createdIso).getTime()) / 3600000;
  return hoursAgo <= 48;
}

function slotPercent(filled: number, total: number): number {
  return Math.round((filled / total) * 100);
}

function getCategoryColor(cat: string): string {
  return CATEGORY_COLORS[cat] || "var(--disc-cat-default)";
}

function formatPayout(
  payout: number,
  label: string,
): {
  amount: string;
  unit: string;
  isFree: boolean;
} {
  if (payout === 0)
    return { amount: "FREE", unit: "portfolio entry", isFree: true };
  return { amount: `$${payout}`, unit: label, isFree: false };
}

/* ── Discover Page ────────────────────────────────────────── */

export default function DiscoverPage() {
  /* -- Search & filter state -- */
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("ALL");
  const [activeEarning, setActiveEarning] = useState<EarningFilter>("ALL");
  const [activeDistance, setActiveDistance] = useState<DistanceFilter>("ALL");
  const [activeType, setActiveType] = useState<TypeFilter>("ALL");
  const [sortKey, setSortKey] = useState<SortKey>("match");

  /* -- View mode -- */
  const [viewMode, setViewMode] = useState<ViewMode>("grid");

  /* -- Application state -- */
  const [applications, setApplications] = useState<
    Record<string, ApplicationStatus>
  >({});

  /* -- Bookmarks -- */
  const [bookmarks, setBookmarks] = useState<Set<string>>(new Set());

  /* -- Toggle functions -- */
  function toggleBookmark(id: string) {
    setBookmarks((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function handleApply(id: string) {
    setApplications((prev) => {
      if (prev[id] && prev[id] !== "none") return prev;
      return { ...prev, [id]: "applied" };
    });
    // Simulate short transition to pending
    setTimeout(() => {
      setApplications((prev) => ({
        ...prev,
        [id]: "pending",
      }));
    }, 1800);
  }

  /* -- Active filter count -- */
  const activeFilterCount = useMemo(() => {
    let n = 0;
    if (activeCategory !== "ALL") n++;
    if (activeEarning !== "ALL") n++;
    if (activeDistance !== "ALL") n++;
    if (activeType !== "ALL") n++;
    return n;
  }, [activeCategory, activeEarning, activeDistance, activeType]);

  function clearFilters() {
    setActiveCategory("ALL");
    setActiveEarning("ALL");
    setActiveDistance("ALL");
    setActiveType("ALL");
    setQuery("");
  }

  /* -- Filtered campaigns -- */
  const filteredCampaigns = useMemo(() => {
    let list = MOCK_CAMPAIGNS.filter((c) => !c.isFeatured);

    // Text search
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          c.merchantName.toLowerCase().includes(q) ||
          c.neighborhood.toLowerCase().includes(q) ||
          c.tags.some((t) => t.toLowerCase().includes(q)),
      );
    }

    // Category
    if (activeCategory !== "ALL") {
      list = list.filter(
        (c) =>
          c.category.toUpperCase() === activeCategory.toUpperCase() ||
          c.tags.some((t) =>
            t
              .toUpperCase()
              .includes(
                activeCategory.replace("FOOD & DRINK", "FOOD").toUpperCase(),
              ),
          ),
      );
    }

    // Earning min
    if (activeEarning !== "ALL") {
      const min = parseInt(activeEarning.replace("$", "").replace("+", ""));
      list = list.filter((c) => c.payout >= min);
    }

    // Distance
    if (activeDistance !== "ALL") {
      const maxMi = parseFloat(
        activeDistance.replace("< ", "").replace("mi", ""),
      );
      list = list.filter((c) => c.distanceMi <= maxMi);
    }

    // Type
    if (activeType === "REMOTE OK") {
      list = list.filter((c) => c.isRemoteOk);
    } else if (activeType === "IN-PERSON") {
      list = list.filter((c) => !c.isRemoteOk);
    }

    // Sort
    switch (sortKey) {
      case "payout":
        list = [...list].sort((a, b) => b.payout - a.payout);
        break;
      case "ending-soon":
        list = [...list].sort((a, b) => {
          const da = daysLeft(a.deadlineIso) ?? 9999;
          const db = daysLeft(b.deadlineIso) ?? 9999;
          return da - db;
        });
        break;
      case "spots":
        list = [...list].sort((a, b) => b.slotsRemaining - a.slotsRemaining);
        break;
      case "match":
      default:
        list = [...list].sort((a, b) => b.matchScore - a.matchScore);
        break;
    }

    return list;
  }, [
    query,
    activeCategory,
    activeEarning,
    activeDistance,
    activeType,
    sortKey,
  ]);

  const featuredCampaign = MOCK_CAMPAIGNS.find((c) => c.isFeatured);

  /* -- Render helpers -- */

  function CampaignCard({ c, idx }: { c: Campaign; idx: number }) {
    const { amount, unit, isFree } = formatPayout(c.payout, c.payoutLabel);
    const appStatus = applications[c.id] || "none";
    const isBookmarked = bookmarks.has(c.id);
    const slotsUrgent = c.slotsRemaining < 3;
    const catColor = getCategoryColor(c.category);
    const urgent = isUrgent(c.deadlineIso);
    const brandNew = isNew(c.createdIso);

    return (
      <article
        className="disc-card"
        style={
          {
            "--disc-card-cat-color": catColor,
            animationDelay: `${idx * 60}ms`,
          } as React.CSSProperties
        }
      >
        {/* Scarcity banner — only when slots < 3 */}
        {slotsUrgent && (
          <div className="disc-scarcity-banner">
            <span className="disc-scarcity-dot" />
            Only {c.slotsRemaining} spot{c.slotsRemaining !== 1 ? "s" : ""}{" "}
            left!
          </div>
        )}

        {/* Card head */}
        <div className="disc-card-head">
          <div className="disc-card-logo-wrap">
            <div className="disc-card-logo">
              {c.image ? (
                <img src={c.image} alt={c.merchantName} />
              ) : (
                <span className="disc-card-logo-letter">
                  {c.merchantName[0]}
                </span>
              )}
            </div>
            {brandNew && <span className="disc-new-badge">NEW</span>}
          </div>

          <div style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
            {c.matchScore >= 80 && (
              <span className="disc-match-badge">✓ MATCH</span>
            )}
            <button
              className={`disc-bookmark-btn${isBookmarked ? " disc-bookmark-btn--saved" : ""}`}
              onClick={(e) => {
                e.stopPropagation();
                toggleBookmark(c.id);
              }}
              aria-label={
                isBookmarked ? "Remove bookmark" : "Bookmark campaign"
              }
            >
              {isBookmarked ? "♥" : "♡"}
            </button>
          </div>
        </div>

        {/* Card body */}
        <div className="disc-card-body">
          {/* Payout — most prominent */}
          <div
            className={`disc-card-payout${isFree ? " disc-card-payout--free" : ""}`}
          >
            {amount}
            {!isFree && <span className="disc-card-payout-unit"> /{unit}</span>}
          </div>

          {/* Campaign name */}
          <div className="disc-card-name">{c.title}</div>

          {/* Merchant + area */}
          <div className="disc-card-meta">
            {c.merchantName} · {c.neighborhood}
          </div>

          {/* Distance chip */}
          <span className="disc-card-dist">
            ◎ {c.distanceMi} mi{c.isRemoteOk ? " · Remote OK" : ""}
          </span>

          {/* Slots + social proof */}
          <div className="disc-card-proof">
            <span
              className={`disc-card-slots${slotsUrgent ? " disc-card-slots--urgent" : ""}`}
            >
              {c.slotsRemaining}/{c.slotsTotal} slots
            </span>
            {c.socialProof && (
              <span className="disc-card-social">⚡ {c.socialProof}</span>
            )}
          </div>

          {/* Tags */}
          <div
            style={{
              display: "flex",
              gap: 6,
              flexWrap: "wrap",
              marginBottom: 8,
            }}
          >
            {c.tags.slice(0, 2).map((tag) => (
              <span key={tag} className="disc-tag">
                {tag}
              </span>
            ))}
            {urgent && (
              <span
                className="disc-tag"
                style={{
                  borderColor: "var(--primary)",
                  color: "var(--primary)",
                }}
              >
                {daysLeft(c.deadlineIso)}d left
              </span>
            )}
          </div>

          {/* Action footer */}
          <div className="disc-card-footer">
            <button
              className={`disc-card-apply${
                appStatus === "applied"
                  ? " disc-card-apply--applied"
                  : appStatus === "pending"
                    ? " disc-card-apply--pending"
                    : ""
              }`}
              onClick={() => {
                if (appStatus === "none") handleApply(c.id);
              }}
              disabled={appStatus !== "none"}
            >
              {appStatus === "applied"
                ? "✓ APPLIED"
                : appStatus === "pending"
                  ? "⏳ PENDING"
                  : "APPLY NOW"}
            </button>
            <button
              className={`disc-card-save${isBookmarked ? " disc-card-save--saved" : ""}`}
              onClick={() => toggleBookmark(c.id)}
              aria-label="Save"
            >
              {isBookmarked ? "♥" : "♡"}
            </button>
          </div>
        </div>

        {/* Recommended label */}
        {c.isRecommended && (
          <div className="disc-card-recommended">★ Recommended for you</div>
        )}
      </article>
    );
  }

  /* -- Featured card -- */

  function FeaturedCard({ c }: { c: Campaign }) {
    const appStatus = applications[c.id] || "none";
    const slotsFilledPct = slotPercent(
      c.slotsTotal - c.slotsRemaining,
      c.slotsTotal,
    );
    const { amount, unit } = formatPayout(c.payout, c.payoutLabel);
    const catColor = getCategoryColor(c.category);

    return (
      <div
        className="disc-featured"
        style={{ "--disc-card-cat-color": catColor } as React.CSSProperties}
      >
        {/* Featured badge — overlaid top-left */}
        <div className="disc-featured-badge">FEATURED</div>

        {/* Logo column */}
        <div className="disc-featured-logo-col">
          <span className="disc-featured-logo-letter">{c.merchantName[0]}</span>
          <span className="disc-featured-match-pct">{c.matchScore}% match</span>
        </div>

        {/* Body */}
        <div className="disc-featured-body">
          <div>
            <div className="disc-featured-eyebrow">
              <span
                className="disc-featured-cat-dot"
                style={{ background: catColor }}
              />
              {c.category} · {c.neighborhood}
            </div>
            <div className="disc-featured-name">{c.title}</div>
            <div className="disc-featured-address">{c.merchantName}</div>
            <div className="disc-featured-earn-hook">
              Earn <span className="disc-featured-earn-amount">{amount}</span>{" "}
              <span className="disc-featured-earn-unit">{unit}</span>
            </div>
            <div className="disc-featured-tags">
              {c.tags.map((t) => (
                <span key={t} className="disc-tag">
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Metrics column */}
        <div className="disc-featured-metrics">
          <div className="disc-featured-payout-wrap">
            <div className="disc-featured-payout">{amount}</div>
            <div className="disc-featured-payout-label">/{unit}</div>
          </div>

          <div className="disc-featured-slots-wrap">
            <div className="disc-featured-slots-text">
              <span>
                {c.slotsTotal - c.slotsRemaining}/{c.slotsTotal} filled
              </span>
              <span className="disc-featured-slots-pct">{slotsFilledPct}%</span>
            </div>
            <div className="disc-featured-progress">
              <div
                className="disc-featured-progress-fill"
                style={{ width: `${slotsFilledPct}%` }}
              />
            </div>
          </div>

          {c.socialProof && (
            <div className="disc-featured-fomo">
              <span className="disc-featured-fomo-dot" />
              {c.socialProof}
            </div>
          )}

          <button
            className={`disc-featured-apply${
              appStatus === "applied"
                ? " disc-featured-apply--applied"
                : appStatus === "pending"
                  ? " disc-featured-apply--pending"
                  : ""
            }`}
            onClick={() => {
              if (appStatus === "none") handleApply(c.id);
            }}
            disabled={appStatus !== "none"}
          >
            {appStatus === "applied"
              ? "✓ APPLIED"
              : appStatus === "pending"
                ? "PENDING REVIEW"
                : "APPLY NOW →"}
            {appStatus === "applied" && (
              <span className="disc-featured-apply-success" />
            )}
          </button>
        </div>
      </div>
    );
  }

  /* ── Render ─────────────────────────────────────────────── */

  return (
    <div className="disc">
      {/* ── HERO ──────────────────────────────────────────────── */}
      <header className="disc-hero">
        <div className="disc-hero-inner">
          <div className="disc-hero-left">
            <div className="disc-hero-eyebrow">
              <span className="disc-hero-eyebrow-dot" />
              Creator Workspace
            </div>
            <h1 className="disc-hero-title">
              DIS<span>C</span>OV<span>E</span>R
            </h1>
            <p className="disc-hero-sub">
              47 CAMPAIGNS
              <span className="disc-hero-sub-sep" />
              WILLIAMSBURG · CHELSEA · SOHO
              <span className="disc-hero-sub-sep" />
              UPDATED 2H AGO
            </p>
          </div>

          <div className="disc-hero-right">
            <button className="disc-hero-cta disc-hero-cta--blue">
              <span>Top earner this week: $340</span>
              <span className="disc-hero-cta-arrow">→</span>
            </button>
            <button
              className="disc-hero-cta disc-hero-cta--red"
              onClick={() => {
                // Scroll to grid
                document
                  .querySelector(".disc-content")
                  ?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              <span>3 campaigns matching you</span>
              <span className="disc-hero-cta-arrow">→</span>
            </button>
          </div>
        </div>
      </header>

      {/* ── SEARCH + FILTERS ──────────────────────────────────── */}
      <div className="disc-filters-zone">
        {/* Search bar */}
        <div className="disc-search-row">
          <div className="disc-search-icon">⌕</div>
          <input
            type="text"
            className="disc-search-input"
            placeholder="Search campaigns, merchants, neighborhoods..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoComplete="off"
          />
          <div className="disc-search-meta">
            {activeFilterCount > 0 && (
              <button className="disc-filter-badge" onClick={clearFilters}>
                FILTERS
                <span className="disc-filter-badge-count">
                  {activeFilterCount}
                </span>
              </button>
            )}
          </div>
        </div>

        {/* Filter chips */}
        <div className="disc-chips-row">
          <div className="disc-chips-inner">
            {/* Category */}
            <div className="disc-chip-group">
              <span className="disc-chip-label">Category</span>
              {(
                [
                  "ALL",
                  "FOOD & DRINK",
                  "RETAIL",
                  "WELLNESS",
                  "BEAUTY",
                  "FITNESS",
                ] as const
              ).map((cat) => {
                const isActive = activeCategory === cat;
                return (
                  <button
                    key={cat}
                    className={`disc-chip${isActive ? " disc-chip--active" : ""}`}
                    onClick={() => setActiveCategory(isActive ? "ALL" : cat)}
                  >
                    {cat}
                    {isActive && <span className="disc-chip-x">×</span>}
                  </button>
                );
              })}
            </div>

            {/* Earning */}
            <div className="disc-chip-group">
              <span className="disc-chip-label">Earning</span>
              {(["ALL", "$15+", "$25+", "$40+"] as EarningFilter[]).map(
                (earn) => {
                  const isActive = activeEarning === earn;
                  return (
                    <button
                      key={earn}
                      className={`disc-chip${isActive ? " disc-chip--active" : ""}`}
                      onClick={() => setActiveEarning(isActive ? "ALL" : earn)}
                    >
                      {earn}
                      {isActive && <span className="disc-chip-x">×</span>}
                    </button>
                  );
                },
              )}
            </div>

            {/* Distance */}
            <div className="disc-chip-group">
              <span className="disc-chip-label">Distance</span>
              {(["ALL", "< 0.5mi", "< 1mi", "< 2mi"] as DistanceFilter[]).map(
                (dist) => {
                  const isActive = activeDistance === dist;
                  return (
                    <button
                      key={dist}
                      className={`disc-chip${isActive ? " disc-chip--active" : ""}`}
                      onClick={() => setActiveDistance(isActive ? "ALL" : dist)}
                    >
                      {dist}
                      {isActive && <span className="disc-chip-x">×</span>}
                    </button>
                  );
                },
              )}
            </div>

            {/* Type */}
            <div className="disc-chip-group">
              <span className="disc-chip-label">Type</span>
              {(["ALL", "IN-PERSON", "REMOTE OK"] as TypeFilter[]).map(
                (type) => {
                  const isActive = activeType === type;
                  return (
                    <button
                      key={type}
                      className={`disc-chip${isActive ? " disc-chip--active" : ""}`}
                      onClick={() => setActiveType(isActive ? "ALL" : type)}
                    >
                      {type}
                      {isActive && <span className="disc-chip-x">×</span>}
                    </button>
                  );
                },
              )}
            </div>
          </div>
        </div>

        {/* Active filter summary */}
        {(activeFilterCount > 0 || query.trim()) && (
          <div className="disc-active-filter-row">
            <span className="disc-active-filter-text">
              {filteredCampaigns.length} result
              {filteredCampaigns.length !== 1 ? "s" : ""}
              {activeFilterCount > 0 &&
                ` · ${activeFilterCount} filter${activeFilterCount > 1 ? "s" : ""} active`}
            </span>
            <button className="disc-clear-btn" onClick={clearFilters}>
              Clear all
            </button>
          </div>
        )}
      </div>

      {/* ── MAIN CONTENT ──────────────────────────────────────── */}
      <main className="disc-content">
        {/* Earner banner */}
        <div className="disc-earner-banner">
          <span className="disc-earner-icon">◈</span>
          <span className="disc-earner-text">
            <strong>@sarahnyc_eats</strong> earned{" "}
            <strong>$340 this week</strong> across 4 campaigns in Williamsburg
          </span>
          <a href="#" className="disc-earner-link">
            View Playbook →
          </a>
        </div>

        {/* Progress nudge */}
        <div className="disc-progress-nudge">
          <span className="disc-progress-nudge-text">
            Applied to <strong>3 campaigns</strong> this week · 2 pending review
          </span>
          <div className="disc-progress-bar-wrap">
            <div className="disc-progress-bar-fill" style={{ width: "60%" }} />
          </div>
        </div>

        {/* ── FEATURED (only if no active search/filter) ─────── */}
        {!query.trim() && activeFilterCount === 0 && featuredCampaign && (
          <section className="disc-grid-section">
            <div className="disc-section-header">
              <span className="disc-section-title">★ Featured Campaign</span>
              <span className="disc-section-count">High match</span>
            </div>
            <FeaturedCard c={featuredCampaign} />
          </section>
        )}

        {/* ── RESULTS BAR ───────────────────────────────────── */}
        <section className="disc-grid-section">
          <div className="disc-results-bar">
            <span className="disc-results-count">
              <strong>{filteredCampaigns.length}</strong>{" "}
              {query.trim() || activeFilterCount > 0
                ? "matching campaigns"
                : "campaigns available"}
            </span>
            <div className="disc-results-bar-right">
              <div className="disc-sort-row">
                <span className="disc-sort-label">Sort</span>
                {(
                  [
                    { key: "match" as SortKey, label: "Best Match" },
                    { key: "payout" as SortKey, label: "Highest Pay" },
                    {
                      key: "ending-soon" as SortKey,
                      label: "Ending Soon",
                    },
                    { key: "spots" as SortKey, label: "Most Spots" },
                  ] satisfies { key: SortKey; label: string }[]
                ).map(({ key, label }) => (
                  <button
                    key={key}
                    className={`disc-sort-btn${sortKey === key ? " disc-sort-btn--active" : ""}`}
                    onClick={() => setSortKey(key)}
                  >
                    {label}
                  </button>
                ))}
              </div>
              {/* Map/Grid toggle */}
              <div
                className="disc-view-toggle"
                role="group"
                aria-label="View mode"
              >
                <button
                  className={`disc-view-btn${viewMode === "grid" ? " disc-view-btn--active" : ""}`}
                  onClick={() => setViewMode("grid")}
                  aria-label="Grid view"
                  title="Grid view"
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 14 14"
                    fill="none"
                    aria-hidden="true"
                  >
                    <rect
                      x="0"
                      y="0"
                      width="6"
                      height="6"
                      fill="currentColor"
                    />
                    <rect
                      x="8"
                      y="0"
                      width="6"
                      height="6"
                      fill="currentColor"
                    />
                    <rect
                      x="0"
                      y="8"
                      width="6"
                      height="6"
                      fill="currentColor"
                    />
                    <rect
                      x="8"
                      y="8"
                      width="6"
                      height="6"
                      fill="currentColor"
                    />
                  </svg>
                  GRID
                </button>
                <button
                  className={`disc-view-btn${viewMode === "map" ? " disc-view-btn--active" : ""}`}
                  onClick={() => setViewMode("map")}
                  aria-label="Map view"
                  title="Map view"
                >
                  <svg
                    width="12"
                    height="14"
                    viewBox="0 0 12 16"
                    fill="none"
                    aria-hidden="true"
                  >
                    <path
                      d="M6 0C3.24 0 1 2.24 1 5c0 3.75 5 11 5 11s5-7.25 5-11c0-2.76-2.24-5-5-5zm0 6.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z"
                      fill="currentColor"
                    />
                  </svg>
                  MAP
                </button>
              </div>
            </div>
          </div>

          {/* Campaign grid / Map view */}
          {viewMode === "map" ? (
            <MapPlaceholder
              count={filteredCampaigns.length}
              onSwitch={() => setViewMode("grid")}
            />
          ) : filteredCampaigns.length === 0 ? (
            <EmptyState onClear={clearFilters} />
          ) : (
            <div className="disc-grid">
              {filteredCampaigns.map((c, i) => (
                <CampaignCard key={c.id} c={c} idx={i} />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

/* ── Map Placeholder ──────────────────────────────────────── */

function MapPlaceholder({
  count,
  onSwitch,
}: {
  count: number;
  onSwitch: () => void;
}) {
  return (
    <div className="disc-map-placeholder">
      <div className="disc-map-placeholder-bg">
        {/* Decorative grid lines */}
        <div className="disc-map-grid" aria-hidden="true" />
      </div>
      <div className="disc-map-content">
        <div className="disc-map-pin-cluster" aria-hidden="true">
          {[
            { left: "22%", top: "38%", payout: "$45", delay: "0ms" },
            { left: "38%", top: "55%", payout: "$32", delay: "80ms" },
            { left: "55%", top: "30%", payout: "$85", delay: "160ms" },
            { left: "68%", top: "50%", payout: "$60", delay: "240ms" },
            { left: "44%", top: "70%", payout: "$28", delay: "320ms" },
          ].map((pin, i) => (
            <div
              key={i}
              className="disc-map-pin"
              style={
                {
                  left: pin.left,
                  top: pin.top,
                  "--pin-delay": pin.delay,
                } as React.CSSProperties
              }
            >
              <span className="disc-map-pin-label">{pin.payout}</span>
            </div>
          ))}
        </div>
        <div className="disc-map-message">
          <div className="disc-map-icon">◎</div>
          <h3 className="disc-map-title">Map View</h3>
          <p className="disc-map-sub">
            {count} campaigns near you — interactive map coming soon
          </p>
          <button className="disc-map-switch-btn" onClick={onSwitch}>
            Back to Grid
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Empty State ──────────────────────────────────────────── */

function EmptyState({ onClear }: { onClear: () => void }) {
  return (
    <div className="disc-empty">
      <div className="disc-empty-bg">
        <span className="disc-empty-bg-text">NO CAMPAIGNS</span>
      </div>
      <div className="disc-empty-content">
        <h2 className="disc-empty-title">No campaigns found</h2>
        <p className="disc-empty-sub">
          No campaigns match your current filters. Try widening your search or
          exploring nearby areas.
        </p>
        <div className="disc-empty-actions">
          <button
            className="disc-empty-btn disc-empty-btn--primary"
            onClick={onClear}
          >
            Clear filters
          </button>
          <Link
            href="/creator/explore"
            className="disc-empty-btn disc-empty-btn--outline"
          >
            Explore nearby →
          </Link>
        </div>
      </div>
    </div>
  );
}
