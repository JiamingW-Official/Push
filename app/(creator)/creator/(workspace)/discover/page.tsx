"use client";

import { useMemo, useState, useRef, useEffect } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import "./discover.css";
import type { CampaignPin } from "@/components/layout/MapView";

/* ── Dynamic MapView (Leaflet requires no-SSR) ────────────── */

const MapView = dynamic(() => import("@/components/layout/MapView"), {
  ssr: false,
  loading: () => <div className="disc-map-loading" />,
});

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
type ViewMode = "grid" | "split";

interface Campaign {
  id: string;
  title: string;
  merchantName: string;
  neighborhood: string;
  category: string;
  payout: number;
  payoutLabel: string;
  slotsTotal: number;
  slotsRemaining: number;
  distanceMi: number;
  isRemoteOk: boolean;
  matchScore: number;
  deadlineIso?: string;
  lat: number;
  lng: number;
}

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
    distanceMi: 0.4,
    isRemoteOk: false,
    matchScore: 94,
    deadlineIso: "2026-04-28",
    lat: 40.7141,
    lng: -73.9614,
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
    distanceMi: 1.2,
    isRemoteOk: false,
    matchScore: 88,
    deadlineIso: "2026-05-08",
    lat: 40.7422,
    lng: -74.0051,
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
    distanceMi: 0.8,
    isRemoteOk: false,
    matchScore: 81,
    deadlineIso: "2026-05-12",
    lat: 40.7412,
    lng: -73.9897,
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
    distanceMi: 1.5,
    isRemoteOk: false,
    matchScore: 72,
    deadlineIso: "2026-05-01",
    lat: 40.747,
    lng: -73.9983,
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
    distanceMi: 0.9,
    isRemoteOk: false,
    matchScore: 65,
    deadlineIso: "2026-05-05",
    lat: 40.745,
    lng: -74.004,
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
    distanceMi: 0.7,
    isRemoteOk: false,
    matchScore: 78,
    deadlineIso: "2026-05-15",
    lat: 40.7239,
    lng: -74.0019,
  },
  {
    id: "disc-007",
    title: "Boutique Opening Campaign",
    merchantName: "Madewell SoHo",
    neighborhood: "SoHo, NYC",
    category: "RETAIL",
    payout: 28,
    payoutLabel: "per post",
    slotsTotal: 15,
    slotsRemaining: 10,
    distanceMi: 0.5,
    isRemoteOk: true,
    matchScore: 58,
    deadlineIso: "2026-05-20",
    lat: 40.7225,
    lng: -73.9974,
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
    distanceMi: 1.8,
    isRemoteOk: false,
    matchScore: 91,
    deadlineIso: "2026-04-30",
    lat: 40.734,
    lng: -74.0054,
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
    distanceMi: 1.1,
    isRemoteOk: false,
    matchScore: 84,
    deadlineIso: "2026-04-26",
    lat: 40.7561,
    lng: -73.9864,
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
    distanceMi: 1.4,
    isRemoteOk: false,
    matchScore: 76,
    deadlineIso: "2026-05-20",
    lat: 40.7317,
    lng: -74.0002,
  },
];

/* ── Helpers ──────────────────────────────────────────────── */

function daysLeft(iso?: string): number | null {
  if (!iso) return null;
  return Math.ceil((new Date(iso).getTime() - Date.now()) / 86400000);
}

function formatEarn(payout: number): string {
  if (payout === 0) return "FREE";
  return `$${payout}`;
}

/** Adapter: Campaign → CampaignPin for MapView */
function toCampaignPin(c: Campaign): CampaignPin {
  return {
    id: c.id,
    title: c.title,
    business_name: c.merchantName,
    payout: c.payout,
    lat: c.lat,
    lng: c.lng,
    spots_remaining: c.slotsRemaining,
    description: null,
    category: c.category,
  };
}

/* ── Discover Page ────────────────────────────────────────── */

export default function DiscoverPage() {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("ALL");
  const [activeEarning, setActiveEarning] = useState<EarningFilter>("ALL");
  const [activeDistance, setActiveDistance] = useState<DistanceFilter>("ALL");
  const [activeType, setActiveType] = useState<TypeFilter>("ALL");
  const [sortKey, setSortKey] = useState<SortKey>("match");
  const [filterOpen, setFilterOpen] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [activeId, setActiveId] = useState<string | null>(null);
  const [applications, setApplications] = useState<
    Record<string, ApplicationStatus>
  >({});

  const filterRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Close filter panel on outside click
  useEffect(() => {
    if (!filterOpen) return;
    function handleClick(e: MouseEvent) {
      if (filterRef.current && !filterRef.current.contains(e.target as Node)) {
        setFilterOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [filterOpen]);

  // Scroll active list card into view when a map pin is clicked
  useEffect(() => {
    if (!activeId || !listRef.current) return;
    const el = listRef.current.querySelector(
      `[data-campaign-id="${activeId}"]`,
    );
    if (el) el.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [activeId]);

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

  function handleApply(id: string) {
    setApplications((prev) => {
      if (prev[id] && prev[id] !== "none") return prev;
      return { ...prev, [id]: "applied" };
    });
    setTimeout(() => {
      setApplications((prev) => ({ ...prev, [id]: "pending" }));
    }, 1800);
  }

  const filteredCampaigns = useMemo(() => {
    let list = [...MOCK_CAMPAIGNS];

    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          c.merchantName.toLowerCase().includes(q) ||
          c.neighborhood.toLowerCase().includes(q),
      );
    }

    if (activeCategory !== "ALL") {
      list = list.filter(
        (c) => c.category.toUpperCase() === activeCategory.toUpperCase(),
      );
    }

    if (activeEarning !== "ALL") {
      const min = parseInt(activeEarning.replace("$", "").replace("+", ""));
      list = list.filter((c) => c.payout >= min);
    }

    if (activeDistance !== "ALL") {
      const maxMi = parseFloat(
        activeDistance.replace("< ", "").replace("mi", ""),
      );
      list = list.filter((c) => c.distanceMi <= maxMi);
    }

    if (activeType === "REMOTE OK") {
      list = list.filter((c) => c.isRemoteOk);
    } else if (activeType === "IN-PERSON") {
      list = list.filter((c) => !c.isRemoteOk);
    }

    switch (sortKey) {
      case "payout":
        list = list.sort((a, b) => b.payout - a.payout);
        break;
      case "ending-soon":
        list = list.sort((a, b) => {
          const da = daysLeft(a.deadlineIso) ?? 9999;
          const db = daysLeft(b.deadlineIso) ?? 9999;
          return da - db;
        });
        break;
      case "spots":
        list = list.sort((a, b) => b.slotsRemaining - a.slotsRemaining);
        break;
      default:
        list = list.sort((a, b) => b.matchScore - a.matchScore);
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

  /** Center map on the average of filtered campaign coords */
  const mapCenter = useMemo((): [number, number] => {
    if (filteredCampaigns.length === 0) return [40.7141, -73.9614];
    const avgLat =
      filteredCampaigns.reduce((s, c) => s + c.lat, 0) /
      filteredCampaigns.length;
    const avgLng =
      filteredCampaigns.reduce((s, c) => s + c.lng, 0) /
      filteredCampaigns.length;
    return [avgLat, avgLng];
  }, [filteredCampaigns]);

  const sortControls = (
    <div className="disc-sort-row">
      <span className="disc-sort-label eyebrow">Sort</span>
      {(
        [
          { key: "match" as SortKey, label: "Best Match" },
          { key: "payout" as SortKey, label: "Highest Pay" },
          { key: "ending-soon" as SortKey, label: "Ending Soon" },
          { key: "spots" as SortKey, label: "Most Spots" },
        ] satisfies { key: SortKey; label: string }[]
      ).map(({ key, label }) => (
        <button
          key={key}
          className={`disc-sort-btn btn-pill${sortKey === key ? " disc-sort-btn--active" : ""}`}
          onClick={() => setSortKey(key)}
        >
          {label}
        </button>
      ))}
    </div>
  );

  return (
    <div
      className={`cw-page disc${viewMode === "split" ? " disc--split-mode" : ""}`}
    >
      {viewMode === "grid" && (
        <header className="cw-header">
          <div className="cw-header__left">
            <p className="cw-eyebrow cw-eyebrow--live">
              DISCOVER · {filteredCampaigns.length} matching · Williamsburg
            </p>
            <h1 className="cw-title">Campaigns</h1>
          </div>
          <div className="cw-header__right">
            <div className="cw-chip-row">
              <button
                type="button"
                className="cw-chip is-active"
                onClick={() => setActiveId(null)}
                aria-label="Grid view"
              >
                Grid
              </button>
              <button
                type="button"
                className="cw-chip"
                onClick={() => setViewMode("split")}
                aria-label="Map view"
              >
                Map
              </button>
            </div>
          </div>
        </header>
      )}

      {/* ── Toolbar ────────────────────────────────────────── */}
      <div className="disc-toolbar">
        <div className="disc-search-wrap">
          <span className="disc-search-icon">⌕</span>
          <input
            type="text"
            className="disc-search-input"
            placeholder="Search campaigns, merchants, neighborhoods..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoComplete="off"
          />
        </div>

        {/* View toggle */}
        <div className="disc-view-toggle">
          <button
            className={`disc-view-btn${viewMode === "grid" ? " disc-view-btn--active" : ""}`}
            onClick={() => {
              setViewMode("grid");
              setActiveId(null);
            }}
            aria-label="Grid view"
          >
            Grid
          </button>
          <button
            className={`disc-view-btn${viewMode === "split" ? " disc-view-btn--active" : ""}`}
            onClick={() => setViewMode("split")}
            aria-label="Map view"
          >
            Map
          </button>
        </div>

        <div className="disc-toolbar-right" ref={filterRef}>
          <button
            className={`disc-filter-btn btn-pill${filterOpen || activeFilterCount > 0 ? " disc-filter-btn--active" : ""}`}
            onClick={() => setFilterOpen((v) => !v)}
          >
            Filter ▾
            {activeFilterCount > 0 && (
              <span className="disc-filter-btn-count">{activeFilterCount}</span>
            )}
          </button>

          {/* Filter panel */}
          {filterOpen && (
            <div className="disc-filter-panel">
              <p className="disc-filter-panel-title eyebrow">Filters</p>

              <div className="disc-filter-group">
                <span className="disc-filter-group-label eyebrow">
                  Category
                </span>
                <div className="disc-filter-options">
                  {(
                    [
                      "ALL",
                      "FOOD & DRINK",
                      "RETAIL",
                      "WELLNESS",
                      "BEAUTY",
                      "FITNESS",
                      "LIFESTYLE",
                    ] as const
                  ).map((cat) => (
                    <button
                      key={cat}
                      className={`disc-filter-option btn-pill${activeCategory === cat ? " disc-filter-option--active" : ""}`}
                      onClick={() => setActiveCategory(cat)}
                    >
                      {cat === "ALL" ? "All" : cat}
                    </button>
                  ))}
                </div>
              </div>

              <div className="disc-filter-group">
                <span className="disc-filter-group-label eyebrow">
                  Minimum Earn
                </span>
                <div className="disc-filter-options">
                  {(["ALL", "$15+", "$25+", "$40+"] as EarningFilter[]).map(
                    (earn) => (
                      <button
                        key={earn}
                        className={`disc-filter-option btn-pill${activeEarning === earn ? " disc-filter-option--active" : ""}`}
                        onClick={() => setActiveEarning(earn)}
                      >
                        {earn === "ALL" ? "Any" : earn}
                      </button>
                    ),
                  )}
                </div>
              </div>

              <div className="disc-filter-group">
                <span className="disc-filter-group-label eyebrow">
                  Distance
                </span>
                <div className="disc-filter-options">
                  {(
                    ["ALL", "< 0.5mi", "< 1mi", "< 2mi"] as DistanceFilter[]
                  ).map((dist) => (
                    <button
                      key={dist}
                      className={`disc-filter-option btn-pill${activeDistance === dist ? " disc-filter-option--active" : ""}`}
                      onClick={() => setActiveDistance(dist)}
                    >
                      {dist === "ALL" ? "Any" : dist}
                    </button>
                  ))}
                </div>
              </div>

              <div className="disc-filter-group">
                <span className="disc-filter-group-label eyebrow">Type</span>
                <div className="disc-filter-options">
                  {(["ALL", "IN-PERSON", "REMOTE OK"] as TypeFilter[]).map(
                    (type) => (
                      <button
                        key={type}
                        className={`disc-filter-option btn-pill${activeType === type ? " disc-filter-option--active" : ""}`}
                        onClick={() => setActiveType(type)}
                      >
                        {type === "ALL" ? "All" : type}
                      </button>
                    ),
                  )}
                </div>
              </div>

              <div className="disc-filter-panel-footer">
                <button
                  className="disc-filter-clear btn-ghost"
                  onClick={clearFilters}
                >
                  Clear all
                </button>
                <button
                  className="disc-filter-apply btn-primary"
                  onClick={() => setFilterOpen(false)}
                >
                  Apply
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Grid view ──────────────────────────────────────── */}
      {viewMode === "grid" && (
        <main className="disc-content">
          <div className="disc-results-meta">
            <span className="disc-results-count">
              <strong>{filteredCampaigns.length}</strong>{" "}
              {activeFilterCount > 0 || query.trim()
                ? "matching campaigns"
                : "campaigns available"}
            </span>
            {sortControls}
          </div>

          <div className="disc-grid">
            {filteredCampaigns.length === 0 ? (
              <EmptyState onClear={clearFilters} />
            ) : (
              filteredCampaigns.map((c, i) => (
                <CampaignCard
                  key={c.id}
                  c={c}
                  idx={i}
                  appStatus={applications[c.id] || "none"}
                  onApply={handleApply}
                />
              ))
            )}
          </div>
        </main>
      )}

      {/* ── Split view ─────────────────────────────────────── */}
      {viewMode === "split" && (
        <div className="disc-split">
          {/* Left: scrollable compact list */}
          <div className="disc-split-list" ref={listRef}>
            <div className="disc-split-list-meta">
              <span className="disc-results-count">
                <strong>{filteredCampaigns.length}</strong> campaigns
              </span>
              {sortControls}
            </div>

            {filteredCampaigns.length === 0 ? (
              <EmptyState onClear={clearFilters} />
            ) : (
              filteredCampaigns.map((c) => (
                <ListCard
                  key={c.id}
                  c={c}
                  isActive={activeId === c.id}
                  appStatus={applications[c.id] || "none"}
                  onHover={setActiveId}
                  onLeave={() => setActiveId(null)}
                  onApply={handleApply}
                />
              ))
            )}
          </div>

          {/* Right: sticky map */}
          <div className="disc-split-map">
            <MapView
              campaigns={filteredCampaigns.map(toCampaignPin)}
              center={mapCenter}
              activeId={activeId ?? undefined}
              showPricePills
              showPopups
              mono
              onPinClick={setActiveId}
              onPopupClose={() => setActiveId(null)}
            />
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Campaign Card (grid view) ────────────────────────────── */

function CampaignCard({
  c,
  idx,
  appStatus,
  onApply,
}: {
  c: Campaign;
  idx: number;
  appStatus: ApplicationStatus;
  onApply: (id: string) => void;
}) {
  const earnAmount = formatEarn(c.payout);
  const slotsUrgent = c.slotsRemaining < 3;
  const dl = daysLeft(c.deadlineIso);

  return (
    <article className="disc-card" style={{ animationDelay: `${idx * 50}ms` }}>
      {slotsUrgent && (
        <span className="disc-card-scarcity">
          {c.slotsRemaining} spot{c.slotsRemaining !== 1 ? "s" : ""} left
        </span>
      )}

      <div className="disc-card-inner">
        <div className="disc-card-merchant eyebrow">{c.merchantName}</div>
        <div className="disc-card-title">{c.title}</div>

        <div className="disc-card-tags">
          <span className="btn-pill disc-card-category">{c.category}</span>
          {c.isRemoteOk && (
            <span className="btn-pill disc-card-remote">Remote OK</span>
          )}
          {dl !== null && dl <= 3 && (
            <span className="btn-pill disc-card-deadline">{dl}d left</span>
          )}
        </div>

        <div className="disc-card-bottom">
          <div>
            <div className="disc-card-neighborhood">{c.neighborhood}</div>
            <div className="disc-card-distance">{c.distanceMi}mi away</div>
          </div>
          <div className="disc-card-earn">
            {earnAmount}
            <span className="disc-card-earn-label">{c.payoutLabel}</span>
          </div>
        </div>

        <button
          className={`disc-card-apply btn-primary click-shift${
            appStatus === "applied"
              ? " disc-card-apply--applied"
              : appStatus === "pending"
                ? " disc-card-apply--pending"
                : ""
          }`}
          onClick={() => {
            if (appStatus === "none") onApply(c.id);
          }}
          disabled={appStatus !== "none"}
        >
          {appStatus === "applied"
            ? "✓ Applied"
            : appStatus === "pending"
              ? "Pending Review"
              : "Apply Now"}
        </button>
      </div>
    </article>
  );
}

/* ── List Card (split / map view) ─────────────────────────── */

function ListCard({
  c,
  isActive,
  appStatus,
  onHover,
  onLeave,
  onApply,
}: {
  c: Campaign;
  isActive: boolean;
  appStatus: ApplicationStatus;
  onHover: (id: string) => void;
  onLeave: () => void;
  onApply: (id: string) => void;
}) {
  const earnAmount = formatEarn(c.payout);
  const dl = daysLeft(c.deadlineIso);
  const slotsUrgent = c.slotsRemaining < 3;

  return (
    <article
      className={`disc-list-card${isActive ? " disc-list-card--active" : ""}`}
      data-campaign-id={c.id}
      onMouseEnter={() => onHover(c.id)}
      onMouseLeave={onLeave}
    >
      <div className="disc-list-card-earn">{earnAmount}</div>

      <div className="disc-list-card-body">
        <div className="disc-list-card-merchant">{c.merchantName}</div>
        <div className="disc-list-card-title">{c.title}</div>
        <div className="disc-list-card-meta">
          <span className="disc-list-card-hood">{c.neighborhood}</span>
          <span className="disc-list-card-dot" />
          <span className="disc-list-card-dist">{c.distanceMi}mi</span>
          {dl !== null && dl <= 3 && (
            <span
              className={`disc-list-card-dl${dl <= 1 ? " disc-list-card-dl--urgent" : ""}`}
            >
              {dl}d left
            </span>
          )}
          {slotsUrgent && (
            <span className="disc-list-card-scarcity">
              {c.slotsRemaining} spots
            </span>
          )}
        </div>
      </div>

      <button
        className={`disc-list-card-apply${appStatus !== "none" ? " disc-list-card-apply--done" : ""}`}
        onClick={(e) => {
          e.stopPropagation();
          if (appStatus === "none") onApply(c.id);
        }}
        disabled={appStatus !== "none"}
      >
        {appStatus === "applied"
          ? "✓"
          : appStatus === "pending"
            ? "···"
            : "Apply"}
      </button>
    </article>
  );
}

/* ── Empty State ──────────────────────────────────────────── */

function EmptyState({ onClear }: { onClear: () => void }) {
  return (
    <div className="disc-empty">
      <h2 className="disc-empty-title">No campaigns found</h2>
      <p className="disc-empty-sub">
        No campaigns match your current filters. Try widening your search or
        exploring nearby areas.
      </p>
      <div className="disc-empty-actions">
        <button
          className="disc-empty-btn disc-empty-btn--primary btn-primary click-shift"
          onClick={onClear}
        >
          Clear filters
        </button>
        <Link
          href="/creator/explore"
          className="disc-empty-btn disc-empty-btn--outline btn-ghost click-shift"
        >
          Explore nearby →
        </Link>
      </div>
    </div>
  );
}
