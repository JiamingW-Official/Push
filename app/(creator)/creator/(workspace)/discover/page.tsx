"use client";

import { useMemo, useState, useRef, useEffect } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
  images: string[];
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
    deadlineIso: "2026-05-10",
    lat: 40.7141,
    lng: -73.9614,
    images: [
      "https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=1200&h=900&fit=crop&q=80",
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=1200&h=900&fit=crop&q=80",
      "https://images.unsplash.com/photo-1521017432531-fbd92d768814?w=1200&h=900&fit=crop&q=80",
    ],
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
    images: [
      "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=1200&h=900&fit=crop&q=80",
      "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=1200&h=900&fit=crop&q=80",
      "https://images.unsplash.com/photo-1544025162-d76694265947?w=1200&h=900&fit=crop&q=80",
      "https://images.unsplash.com/photo-1432139509613-5c4255815697?w=1200&h=900&fit=crop&q=80",
    ],
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
    images: [
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&h=900&fit=crop&q=80",
      "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=1200&h=900&fit=crop&q=80",
      "https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=1200&h=900&fit=crop&q=80",
    ],
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
    deadlineIso: "2026-05-20",
    lat: 40.747,
    lng: -73.9983,
    images: [
      "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=1200&h=900&fit=crop&q=80",
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1200&h=900&fit=crop&q=80",
      "https://images.unsplash.com/photo-1554284126-aa88f22d8b74?w=1200&h=900&fit=crop&q=80",
      "https://images.unsplash.com/photo-1599447421416-3414500d18a5?w=1200&h=900&fit=crop&q=80",
      "https://images.unsplash.com/photo-1591291621164-2c6367723315?w=1200&h=900&fit=crop&q=80",
    ],
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
    images: [
      "https://images.unsplash.com/photo-1531058020387-3be344556be6?w=1200&h=900&fit=crop&q=80",
      "https://images.unsplash.com/photo-1545987796-200677ee1011?w=1200&h=900&fit=crop&q=80",
      "https://images.unsplash.com/photo-1577720580479-7d839d829c73?w=1200&h=900&fit=crop&q=80",
    ],
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
    images: [
      "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=1200&h=900&fit=crop&q=80",
      "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=1200&h=900&fit=crop&q=80",
      "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=1200&h=900&fit=crop&q=80",
    ],
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
    images: [
      "https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=1200&h=900&fit=crop&q=80",
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&h=900&fit=crop&q=80",
      "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=1200&h=900&fit=crop&q=80",
    ],
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
    deadlineIso: "2026-05-18",
    lat: 40.734,
    lng: -74.0054,
    images: [
      "https://images.unsplash.com/photo-1497935586351-b67a49e012bf?w=1200&h=900&fit=crop&q=80",
      "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=1200&h=900&fit=crop&q=80",
      "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=1200&h=900&fit=crop&q=80",
    ],
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
    deadlineIso: "2026-05-06",
    lat: 40.7561,
    lng: -73.9864,
    images: [
      "https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=1200&h=900&fit=crop&q=80",
      "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=1200&h=900&fit=crop&q=80",
      "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=1200&h=900&fit=crop&q=80",
      "https://images.unsplash.com/photo-1591343395082-e120087004b4?w=1200&h=900&fit=crop&q=80",
    ],
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
    images: [
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200&h=900&fit=crop&q=80",
      "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1200&h=900&fit=crop&q=80",
      "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=1200&h=900&fit=crop&q=80",
      "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=1200&h=900&fit=crop&q=80",
      "https://images.unsplash.com/photo-1551218372-a8789b81b253?w=1200&h=900&fit=crop&q=80",
    ],
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
  const [activeType, setActiveType] = useState<TypeFilter>("ALL");
  const [budgetMin, setBudgetMin] = useState(0);
  const [budgetMax, setBudgetMax] = useState(100);
  const [radiusMi, setRadiusMi] = useState(5);
  const [deadlineDays, setDeadlineDays] = useState<number | null>(null);
  const [sortKey, setSortKey] = useState<SortKey>("match");
  const [filterOpen, setFilterOpen] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>("split");
  const [activeId, setActiveId] = useState<string | null>(null);
  const [mapFullscreen, setMapFullscreen] = useState(false);
  const [applications, setApplications] = useState<
    Record<string, ApplicationStatus>
  >({});
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());

  const listRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Force wheel scroll on the list panel — body:overflow:hidden + Leaflet can swallow wheel events
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      el.scrollTop += e.deltaY;
      e.stopPropagation();
    };
    el.addEventListener("wheel", onWheel, { passive: true });
    return () => el.removeEventListener("wheel", onWheel);
  }, []);

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
    if (activeType !== "ALL") n++;
    if (budgetMin > 0 || budgetMax < 100) n++;
    if (radiusMi < 5) n++;
    if (deadlineDays !== null) n++;
    return n;
  }, [
    activeCategory,
    activeType,
    budgetMin,
    budgetMax,
    radiusMi,
    deadlineDays,
  ]);

  function clearFilters() {
    setActiveCategory("ALL");
    setActiveType("ALL");
    setBudgetMin(0);
    setBudgetMax(100);
    setRadiusMi(5);
    setDeadlineDays(null);
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

  function toggleSave(id: string) {
    setSavedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
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

    if (budgetMin > 0 || budgetMax < 100) {
      list = list.filter((c) => c.payout >= budgetMin && c.payout <= budgetMax);
    }

    if (radiusMi < 5) {
      list = list.filter((c) => c.distanceMi <= radiusMi);
    }

    if (deadlineDays !== null) {
      list = list.filter(
        (c) => (daysLeft(c.deadlineIso) ?? 9999) <= deadlineDays,
      );
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
    budgetMin,
    budgetMax,
    radiusMi,
    deadlineDays,
    activeType,
    sortKey,
  ]);

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

  /* ── Toolbar — sticky liquid-glass rail (§ 8.9.5) ───────── */
  const toolbar = (
    <div className="disc-toolbar">
      <div className="disc-search-wrap">
        <span className="disc-search-icon" aria-hidden="true">
          ⌕
        </span>
        <input
          type="search"
          className="disc-search-input"
          placeholder="Search campaigns, merchants, neighborhoods"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          autoComplete="off"
          aria-label="Search campaigns"
        />
      </div>

      <div className="disc-toolbar-right">
        <button
          type="button"
          className="btn-pill disc-filter-btn"
          aria-expanded={filterOpen}
          aria-pressed={activeFilterCount > 0}
          aria-haspopup="dialog"
          onClick={() => setFilterOpen((v) => !v)}
        >
          Filter
          {activeFilterCount > 0 && (
            <span className="disc-filter-btn-count" aria-hidden="true">
              {activeFilterCount}
            </span>
          )}
        </button>
      </div>

      <div className="disc-view-toggle" role="group" aria-label="View mode">
        <button
          type="button"
          className={`disc-view-btn${viewMode === "grid" ? " disc-view-btn--active" : ""}`}
          aria-pressed={viewMode === "grid"}
          onClick={() => setViewMode("grid")}
        >
          Grid
        </button>
        <button
          type="button"
          className={`disc-view-btn${viewMode === "split" ? " disc-view-btn--active" : ""}`}
          aria-pressed={viewMode === "split"}
          onClick={() => setViewMode("split")}
        >
          Map
        </button>
      </div>
    </div>
  );

  /* ── Sort row — segmented pill group ────────────────────── */
  const sortRow = (
    <div className="disc-sort-row">
      <span className="disc-sort-label">
        <strong>{filteredCampaigns.length}</strong>{" "}
        {activeFilterCount > 0 || query.trim() ? "matching" : "open"}
      </span>
      <div className="disc-sort-pills" role="group" aria-label="Sort campaigns">
        {(
          [
            { key: "match" as SortKey, label: "Best match" },
            { key: "payout" as SortKey, label: "Highest pay" },
            { key: "ending-soon" as SortKey, label: "Ending soon" },
            { key: "spots" as SortKey, label: "Most spots" },
          ] satisfies { key: SortKey; label: string }[]
        ).map(({ key, label }) => (
          <button
            key={key}
            type="button"
            className={`disc-sort-btn${sortKey === key ? " disc-sort-btn--active" : ""}`}
            aria-pressed={sortKey === key}
            onClick={() => setSortKey(key)}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );

  /* ── Category strip — pill row inheriting .btn-pill ─────── */
  const CATEGORIES = [
    { key: "ALL", label: "All" },
    { key: "FOOD & DRINK", label: "Food & Drink" },
    { key: "RETAIL", label: "Retail" },
    { key: "WELLNESS", label: "Wellness" },
    { key: "BEAUTY", label: "Beauty" },
    { key: "FITNESS", label: "Fitness" },
    { key: "LIFESTYLE", label: "Lifestyle" },
  ];

  const catStrip = (
    <div className="disc-cat-strip" role="tablist" aria-label="Category filter">
      {CATEGORIES.map(({ key, label }) => (
        <button
          key={key}
          type="button"
          role="tab"
          className="btn-pill disc-cat-btn"
          aria-pressed={activeCategory === key}
          aria-selected={activeCategory === key}
          onClick={() => setActiveCategory(key)}
        >
          {label}
        </button>
      ))}
    </div>
  );

  /* ── Grid view ────────────────────────────────────────────── */
  if (viewMode === "grid") {
    return (
      <div className="cw-page disc">
        {filterOpen && (
          <FilterModal
            activeCategory={activeCategory}
            setActiveCategory={setActiveCategory}
            activeType={activeType}
            setActiveType={setActiveType}
            budgetMin={budgetMin}
            setBudgetMin={setBudgetMin}
            budgetMax={budgetMax}
            setBudgetMax={setBudgetMax}
            radiusMi={radiusMi}
            setRadiusMi={setRadiusMi}
            deadlineDays={deadlineDays}
            setDeadlineDays={setDeadlineDays}
            filteredCount={filteredCampaigns.length}
            onClose={() => setFilterOpen(false)}
            onClear={clearFilters}
          />
        )}
        <header className="cw-header">
          <div className="cw-header__left">
            <p className="cw-eyebrow cw-eyebrow--live">
              DISCOVER · {filteredCampaigns.length} OPEN · NYC
            </p>
            <h1 className="cw-title">Find your next campaign</h1>
          </div>
        </header>

        {toolbar}
        {catStrip}

        <div className="disc-grid-meta">{sortRow}</div>

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
                saved={savedIds.has(c.id)}
                onApply={handleApply}
                onSave={toggleSave}
              />
            ))
          )}
        </div>
      </div>
    );
  }

  /* ── Split / Map view ─────────────────────────────────────── */
  return (
    <div
      className={`disc disc--split-mode${mapFullscreen ? " disc--map-fullscreen" : ""}`}
    >
      {filterOpen && (
        <FilterModal
          activeCategory={activeCategory}
          setActiveCategory={setActiveCategory}
          activeType={activeType}
          setActiveType={setActiveType}
          budgetMin={budgetMin}
          setBudgetMin={setBudgetMin}
          budgetMax={budgetMax}
          setBudgetMax={setBudgetMax}
          radiusMi={radiusMi}
          setRadiusMi={setRadiusMi}
          deadlineDays={deadlineDays}
          setDeadlineDays={setDeadlineDays}
          filteredCount={filteredCampaigns.length}
          onClose={() => setFilterOpen(false)}
          onClear={clearFilters}
        />
      )}
      {toolbar}
      {catStrip}
      <div className="disc-split">
        {/* Left: scrollable 2-col card grid — same CampaignCard as GRID view */}
        <div className="disc-split-list" ref={listRef}>
          <div className="disc-split-meta">{sortRow}</div>
          <div className="disc-split-scroll" ref={scrollRef}>
            {filteredCampaigns.length === 0 ? (
              <div className="disc-split-empty">
                <EmptyState onClear={clearFilters} />
              </div>
            ) : (
              <div className="disc-split-grid">
                {filteredCampaigns.map((c, i) => (
                  <CampaignCard
                    key={c.id}
                    c={c}
                    idx={i}
                    appStatus={applications[c.id] || "none"}
                    saved={savedIds.has(c.id)}
                    onApply={handleApply}
                    onSave={toggleSave}
                    onHover={setActiveId}
                    onLeave={() => setActiveId(null)}
                    isActive={activeId === c.id}
                  />
                ))}
              </div>
            )}
          </div>
          {/* disc-split-scroll */}
        </div>

        {/* Right: sticky map panel with expand/collapse toggle */}
        <div className="disc-split-map">
          <div className="disc-map-panel">
            <button
              type="button"
              className="disc-map-expand-btn"
              onClick={() => setMapFullscreen((v) => !v)}
              aria-label={mapFullscreen ? "Exit fullscreen" : "Fullscreen map"}
            >
              {mapFullscreen ? (
                /* Collapse icon */
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <polyline points="4 14 10 14 10 20" />
                  <polyline points="20 10 14 10 14 4" />
                  <line x1="10" y1="14" x2="3" y2="21" />
                  <line x1="21" y1="3" x2="14" y2="10" />
                </svg>
              ) : (
                /* Expand icon */
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <polyline points="15 3 21 3 21 9" />
                  <polyline points="9 21 3 21 3 15" />
                  <line x1="21" y1="3" x2="14" y2="10" />
                  <line x1="3" y1="21" x2="10" y2="14" />
                </svg>
              )}
            </button>
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
      </div>
    </div>
  );
}

/* ── Campaign Card (full grid view) — Airbnb-style ────────── */

function CampaignCard({
  c,
  idx,
  appStatus,
  saved,
  onApply,
  onSave,
  onHover,
  onLeave,
  isActive,
}: {
  c: Campaign;
  idx: number;
  appStatus: ApplicationStatus;
  saved: boolean;
  onApply: (id: string) => void;
  onSave: (id: string) => void;
  onHover?: (id: string) => void;
  onLeave?: () => void;
  isActive?: boolean;
}) {
  const router = useRouter();
  const earnAmount = formatEarn(c.payout);
  const slotsUrgent = c.slotsRemaining < 3;
  const dl = daysLeft(c.deadlineIso);
  const [imgIdx, setImgIdx] = useState(0);
  const total = c.images.length;

  const applyLabel =
    appStatus === "applied"
      ? "Applied"
      : appStatus === "pending"
        ? "Pending review"
        : "Apply";

  return (
    <article
      className={`disc-card${isActive ? " disc-card--active" : ""}`}
      style={{ animationDelay: `${Math.min(idx, 8) * 40}ms` }}
      data-campaign-id={c.id}
      onClick={() => router.push(`/creator/campaigns/${c.id}`)}
      onMouseEnter={() => onHover?.(c.id)}
      onMouseLeave={() => onLeave?.()}
    >
      {/* Photo Card with Bottom Gradient Overlay (§ 8.7) */}
      <div className="disc-card-img-wrap">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className="disc-card-img"
          src={c.images[imgIdx]}
          alt=""
          loading="lazy"
        />

        {/* Carousel arrows — appear on hover, do not navigate the card */}
        {total > 1 && (
          <>
            <button
              type="button"
              className="disc-card-arrow disc-card-arrow--prev lg-surface lg-surface--badge"
              onClick={(e) => {
                e.stopPropagation();
                setImgIdx((i) => (i - 1 + total) % total);
              }}
              aria-label="Previous photo"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M9 2L4 7L9 12"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <button
              type="button"
              className="disc-card-arrow disc-card-arrow--next lg-surface lg-surface--badge"
              onClick={(e) => {
                e.stopPropagation();
                setImgIdx((i) => (i + 1) % total);
              }}
              aria-label="Next photo"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M5 2L10 7L5 12"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </>
        )}

        {/* Scarcity badge — liquid-glass pill (§ 8.9.6) */}
        {slotsUrgent && (
          <span className="disc-card-badge lg-surface lg-surface--badge">
            {c.slotsRemaining} spot{c.slotsRemaining !== 1 ? "s" : ""} left
          </span>
        )}

        {/* Save — liquid-glass circle */}
        <button
          type="button"
          className={`disc-card-save lg-surface lg-surface--badge${saved ? " disc-card-save--saved" : ""}`}
          onClick={(e) => {
            e.stopPropagation();
            onSave(c.id);
          }}
          aria-label={saved ? "Remove from saved" : "Save campaign"}
          aria-pressed={saved}
        >
          {saved ? "♥" : "♡"}
        </button>

        {/* Carousel dots — reflect actual image count, click to jump */}
        {total > 1 && (
          <div className="disc-card-dots">
            {c.images.map((_, i) => (
              <button
                key={i}
                type="button"
                className={`disc-card-dot${i === imgIdx ? " disc-card-dot--active" : ""}`}
                onClick={(e) => {
                  e.stopPropagation();
                  setImgIdx(i);
                }}
                aria-label={`Go to photo ${i + 1}`}
              />
            ))}
          </div>
        )}

        {/* Title overlay (Photo Card title + metadata) */}
        <div className="disc-card-overlay">
          <h3 className="disc-card-overlay-title">{c.title}</h3>
          <span className="disc-card-overlay-meta">
            {c.neighborhood} · {c.distanceMi}mi
          </span>
        </div>
      </div>

      {/* Below-image content — Product register: merchant + payout + CTA */}
      <div className="disc-card-content">
        <div className="disc-card-merchant">{c.merchantName}</div>

        <div className="disc-card-earn-row">
          <span className="disc-card-earn">{earnAmount}</span>
          <span className="disc-card-pay-label">/ {c.payoutLabel}</span>
          {dl !== null && dl > 0 && dl <= 7 && (
            <span className="disc-card-deadline">{dl}d left</span>
          )}
        </div>

        <div className="disc-card-specs">
          {c.slotsRemaining} slots · {c.isRemoteOk ? "Remote OK" : "In-person"}
        </div>

        <button
          type="button"
          className={`disc-card-apply${
            appStatus === "applied"
              ? " disc-card-apply--applied"
              : appStatus === "pending"
                ? " disc-card-apply--pending"
                : ""
          }`}
          onClick={(e) => {
            e.stopPropagation();
            if (appStatus === "none") onApply(c.id);
          }}
          disabled={appStatus !== "none"}
          aria-label={`${applyLabel} — ${c.title}`}
        >
          {applyLabel}
        </button>
      </div>
    </article>
  );
}

/* ── Split Card (map left-panel, compact) ─────────────────── */

function SplitCard({
  c,
  isActive,
  appStatus,
  saved,
  onHover,
  onLeave,
  onApply,
  onSave,
}: {
  c: Campaign;
  isActive: boolean;
  appStatus: ApplicationStatus;
  saved: boolean;
  onHover: (id: string) => void;
  onLeave: () => void;
  onApply: (id: string) => void;
  onSave: (id: string) => void;
}) {
  const earnAmount = formatEarn(c.payout);
  const dl = daysLeft(c.deadlineIso);
  const slotsUrgent = c.slotsRemaining < 3;
  const [imgIdx, setImgIdx] = useState(0);
  const total = c.images.length;

  const applyLabel =
    appStatus === "applied"
      ? "Applied"
      : appStatus === "pending"
        ? "Pending"
        : "Apply";

  return (
    <article
      className={`disc-split-card${isActive ? " disc-split-card--active" : ""}`}
      data-campaign-id={c.id}
      onMouseEnter={() => onHover(c.id)}
      onMouseLeave={onLeave}
      onFocus={() => onHover(c.id)}
      onBlur={onLeave}
      tabIndex={0}
    >
      <div className="disc-split-card-img-wrap">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className="disc-split-card-img"
          src={c.images[imgIdx]}
          alt=""
          loading="lazy"
        />
        {total > 1 && (
          <>
            <button
              type="button"
              className="disc-card-arrow disc-card-arrow--prev disc-card-arrow--sm lg-surface lg-surface--badge"
              onClick={(e) => {
                e.stopPropagation();
                setImgIdx((i) => (i - 1 + total) % total);
              }}
              aria-label="Previous photo"
            >
              <svg
                width="12"
                height="12"
                viewBox="0 0 14 14"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M9 2L4 7L9 12"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <button
              type="button"
              className="disc-card-arrow disc-card-arrow--next disc-card-arrow--sm lg-surface lg-surface--badge"
              onClick={(e) => {
                e.stopPropagation();
                setImgIdx((i) => (i + 1) % total);
              }}
              aria-label="Next photo"
            >
              <svg
                width="12"
                height="12"
                viewBox="0 0 14 14"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M5 2L10 7L5 12"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <div className="disc-card-dots disc-card-dots--sm">
              {c.images.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  className={`disc-card-dot${i === imgIdx ? " disc-card-dot--active" : ""}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setImgIdx(i);
                  }}
                  aria-label={`Go to photo ${i + 1}`}
                />
              ))}
            </div>
          </>
        )}
        <button
          type="button"
          className={`disc-split-card-save lg-surface lg-surface--badge${saved ? " disc-split-card-save--saved" : ""}`}
          onClick={(e) => {
            e.stopPropagation();
            onSave(c.id);
          }}
          aria-label={saved ? "Remove from saved" : "Save campaign"}
          aria-pressed={saved}
        >
          {saved ? "♥" : "♡"}
        </button>
        {slotsUrgent && (
          <span className="disc-split-card-badge lg-surface lg-surface--badge">
            {c.slotsRemaining} left
          </span>
        )}
      </div>

      <div className="disc-split-card-body">
        <div className="disc-split-card-merchant">{c.merchantName}</div>
        <div className="disc-split-card-location">
          {c.neighborhood} · {c.distanceMi}mi
        </div>

        <div className="disc-split-card-earn-row">
          <span className="disc-split-card-earn">{earnAmount}</span>
          <span className="disc-split-card-pay">/ {c.payoutLabel}</span>
          {dl !== null && dl > 0 && dl <= 7 && (
            <span className="disc-split-card-dl">{dl}d left</span>
          )}
        </div>

        <div className="disc-split-card-title">{c.title}</div>

        <div className="disc-split-card-foot">
          <div className="disc-split-card-meta">
            {c.slotsRemaining} slots ·{" "}
            {c.isRemoteOk ? "Remote OK" : "In-person"}
          </div>
          <button
            type="button"
            className={`disc-split-card-apply${appStatus !== "none" ? " disc-split-card-apply--done" : ""}`}
            onClick={(e) => {
              e.stopPropagation();
              if (appStatus === "none") onApply(c.id);
            }}
            disabled={appStatus !== "none"}
            aria-label={`${applyLabel} — ${c.title}`}
          >
            {applyLabel}
          </button>
        </div>
      </div>
    </article>
  );
}

/* ── Empty State ──────────────────────────────────────────── */

function EmptyState({ onClear }: { onClear: () => void }) {
  return (
    <div className="disc-empty" role="status">
      <h2 className="disc-empty-title">Nothing matches yet</h2>
      <p className="disc-empty-sub">
        Try widening your filters or clearing the search. New campaigns post
        every day.
      </p>
      <div className="disc-empty-actions">
        <button type="button" className="btn-primary" onClick={onClear}>
          Clear filters
        </button>
        <Link href="/creator/dashboard" className="btn-ghost">
          Back to dashboard
        </Link>
      </div>
    </div>
  );
}

/* ── Filter Modal — Airbnb-style full-screen overlay ────── */

function FilterModal({
  activeCategory,
  setActiveCategory,
  activeType,
  setActiveType,
  budgetMin,
  setBudgetMin,
  budgetMax,
  setBudgetMax,
  radiusMi,
  setRadiusMi,
  deadlineDays,
  setDeadlineDays,
  filteredCount,
  onClose,
  onClear,
}: {
  activeCategory: string;
  setActiveCategory: (v: string) => void;
  activeType: TypeFilter;
  setActiveType: (v: TypeFilter) => void;
  budgetMin: number;
  setBudgetMin: (v: number) => void;
  budgetMax: number;
  setBudgetMax: (v: number) => void;
  radiusMi: number;
  setRadiusMi: (v: number) => void;
  deadlineDays: number | null;
  setDeadlineDays: (v: number | null) => void;
  filteredCount: number;
  onClose: () => void;
  onClear: () => void;
}) {
  // Decorative histogram heights (simulate payout distribution)
  const HISTOGRAM = [
    12, 20, 36, 52, 64, 58, 44, 38, 30, 24, 18, 14, 10, 8, 6, 5, 4, 4, 3, 3,
  ];

  return (
    <>
      {/* Backdrop */}
      <div
        className="disc-filter-backdrop"
        aria-hidden="true"
        onClick={onClose}
      />

      {/* Modal panel */}
      <div
        className="disc-filter-modal"
        role="dialog"
        aria-modal="true"
        aria-label="Filter campaigns"
      >
        {/* Header */}
        <div className="disc-filter-modal-header">
          <button
            type="button"
            className="disc-filter-modal-close"
            onClick={onClose}
            aria-label="Close filters"
          >
            ✕
          </button>
          <h2 className="disc-filter-modal-title">Filters</h2>
        </div>

        {/* Scrollable body */}
        <div className="disc-filter-modal-body">
          {/* Category */}
          <div className="disc-filter-group">
            <span className="disc-filter-group-label">Category</span>
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
                  type="button"
                  className="btn-pill"
                  aria-pressed={activeCategory === cat}
                  onClick={() => setActiveCategory(cat)}
                >
                  {cat === "ALL" ? "Any" : cat}
                </button>
              ))}
            </div>
          </div>

          {/* Budget range */}
          <div className="disc-filter-group">
            <div className="disc-filter-group-header">
              <span className="disc-filter-group-label">Budget Range</span>
              <span className="disc-filter-group-value">
                {budgetMin === 0 && budgetMax === 100
                  ? "Any"
                  : `$${budgetMin} – ${budgetMax === 100 ? "$100+" : `$${budgetMax}`}`}
              </span>
            </div>

            {/* Histogram bars */}
            <div className="disc-histogram" aria-hidden="true">
              {HISTOGRAM.map((h, i) => {
                const pct = (i / HISTOGRAM.length) * 100;
                const inRange = pct >= budgetMin && pct <= budgetMax;
                return (
                  <div
                    key={i}
                    className={`disc-histogram-bar${inRange ? " disc-histogram-bar--in-range" : ""}`}
                    style={{ height: `${h}px` }}
                  />
                );
              })}
            </div>

            {/* Dual slider */}
            <div className="disc-slider-wrap disc-slider-wrap--dual">
              <input
                type="range"
                className="disc-slider disc-slider--min"
                min={0}
                max={100}
                step={5}
                value={budgetMin}
                onChange={(e) => {
                  const v = Number(e.target.value);
                  if (v <= budgetMax) setBudgetMin(v);
                }}
                aria-label="Minimum budget"
              />
              <input
                type="range"
                className="disc-slider disc-slider--max"
                min={0}
                max={100}
                step={5}
                value={budgetMax}
                onChange={(e) => {
                  const v = Number(e.target.value);
                  if (v >= budgetMin) setBudgetMax(v);
                }}
                aria-label="Maximum budget"
              />
              <div
                className="disc-slider-track-fill"
                style={{
                  left: `${budgetMin}%`,
                  width: `${budgetMax - budgetMin}%`,
                }}
              />
            </div>

            {/* Min/Max price inputs */}
            <div className="disc-price-inputs">
              <div className="disc-price-input-wrap">
                <span className="disc-price-input-label">Minimum</span>
                <div className="disc-price-input-field">
                  <span className="disc-price-input-sym">$</span>
                  <input
                    type="number"
                    className="disc-price-input"
                    value={budgetMin}
                    min={0}
                    max={budgetMax}
                    step={5}
                    onChange={(e) => {
                      const v = Math.min(Number(e.target.value), budgetMax);
                      setBudgetMin(v);
                    }}
                    aria-label="Minimum budget"
                  />
                </div>
              </div>
              <div className="disc-price-input-divider" aria-hidden="true">
                –
              </div>
              <div className="disc-price-input-wrap">
                <span className="disc-price-input-label">Maximum</span>
                <div className="disc-price-input-field">
                  <span className="disc-price-input-sym">$</span>
                  <input
                    type="number"
                    className="disc-price-input"
                    value={budgetMax}
                    min={budgetMin}
                    max={100}
                    step={5}
                    onChange={(e) => {
                      const v = Math.max(Number(e.target.value), budgetMin);
                      setBudgetMax(v);
                    }}
                    aria-label="Maximum budget"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Distance */}
          <div className="disc-filter-group">
            <div className="disc-filter-group-header">
              <span className="disc-filter-group-label">Distance</span>
              <span className="disc-filter-group-value">
                {radiusMi >= 5 ? "Any" : `≤ ${radiusMi} mi`}
              </span>
            </div>
            <div className="disc-slider-wrap">
              <input
                type="range"
                className="disc-slider"
                min={0.5}
                max={5}
                step={0.5}
                value={radiusMi}
                onChange={(e) => setRadiusMi(Number(e.target.value))}
                aria-label="Maximum distance in miles"
              />
              <div
                className="disc-slider-track-fill"
                style={{
                  left: "0%",
                  width: `${((radiusMi - 0.5) / 4.5) * 100}%`,
                }}
              />
            </div>
            <div className="disc-slider-labels">
              <span>0.5 mi</span>
              <span>5 mi+</span>
            </div>
          </div>

          {/* Closing within */}
          <div className="disc-filter-group">
            <span className="disc-filter-group-label">Closing Within</span>
            <div className="disc-filter-options">
              {([null, 3, 7, 14, 30] as (number | null)[]).map((d) => (
                <button
                  key={d ?? "any"}
                  type="button"
                  className="btn-pill"
                  aria-pressed={deadlineDays === d}
                  onClick={() => setDeadlineDays(d)}
                >
                  {d === null
                    ? "Any"
                    : d === 3
                      ? "3 days"
                      : d === 7
                        ? "1 week"
                        : d === 14
                          ? "2 weeks"
                          : "1 month"}
                </button>
              ))}
            </div>
          </div>

          {/* Type */}
          <div className="disc-filter-group">
            <span className="disc-filter-group-label">Type</span>
            <div className="disc-filter-options">
              {(["ALL", "IN-PERSON", "REMOTE OK"] as TypeFilter[]).map(
                (type) => (
                  <button
                    key={type}
                    type="button"
                    className="btn-pill"
                    aria-pressed={activeType === type}
                    onClick={() => setActiveType(type)}
                  >
                    {type === "ALL" ? "Any" : type}
                  </button>
                ),
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="disc-filter-modal-footer">
          <button type="button" className="btn-ghost" onClick={onClear}>
            Clear all
          </button>
          <button type="button" className="btn-primary" onClick={onClose}>
            Show {filteredCount} campaign{filteredCount !== 1 ? "s" : ""}
          </button>
        </div>
      </div>
    </>
  );
}
