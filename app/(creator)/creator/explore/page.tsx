"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import "./explore.css";
import { creatorMock, type ExploreFilters } from "@/lib/data/api-client";
import type { CampaignGeo, CreatorTier } from "@/lib/data/demo-campaigns-geo";

// Lazy-load Leaflet map (no SSR)
const MapView = dynamic(() => import("@/components/layout/MapView"), {
  ssr: false,
  loading: () => (
    <div style={{ width: "100%", height: "100%", background: "#eae6e1" }} />
  ),
});

/* ── Constants ────────────────────────────────────────────── */

type ExploreView = "map" | "grid" | "list";

const CATEGORIES = [
  "Food",
  "Coffee",
  "Beauty",
  "Retail",
  "Fitness",
  "Lifestyle",
];

const TIERS: CreatorTier[] = [
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

const NYC_CENTER: [number, number] = [40.7218, -74.001];
const PAGE_SIZE = 12;
const LS_VIEW_KEY = "push-explore-view";

/* ── Helpers ──────────────────────────────────────────────── */

function formatPayout(n: number): string {
  return n === 0 ? "Free" : `$${n}`;
}

function formatDate(iso?: string | null): string | null {
  if (!iso) return null;
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

function daysLeft(iso?: string | null): number | null {
  if (!iso) return null;
  return Math.ceil((new Date(iso).getTime() - Date.now()) / 86400000);
}

function isUrgent(iso?: string | null): boolean {
  const d = daysLeft(iso);
  return d !== null && d <= 3;
}

function tierClass(tier: CreatorTier): string {
  if (tier === "partner") return "partner";
  if (tier === "closer") return "closer";
  return "";
}

/* ── Map popup component (rendered inside MapView popup slot) ─ */

function ExplorePopup({ c }: { c: CampaignGeo }) {
  const urgent = isUrgent(c.deadline);
  const free = c.payout === 0;
  return (
    <div className="map-popup">
      <div className="map-popup-img-wrap">
        {c.image ? (
          <img src={c.image} alt={c.title} className="map-popup-img" />
        ) : (
          <div className="map-popup-img" />
        )}
        <span
          className={`map-popup-badge${free ? " map-popup-badge--free" : ""}`}
        >
          {formatPayout(c.payout)}
        </span>
      </div>
      <div className="map-popup-body">
        <div className="map-popup-meta">
          <span className="map-popup-biz">{c.business_name}</span>
          <span
            className={`map-popup-spots${c.spots_remaining <= 2 ? " map-popup-spots--urgent" : ""}`}
          >
            {c.spots_remaining} left
          </span>
        </div>
        <h3 className="map-popup-title">{c.title}</h3>
        <p className="map-popup-neighborhood">{c.neighborhood}</p>
        <Link href="/creator/signup" className="map-popup-cta">
          Apply Now
        </Link>
      </div>
    </div>
  );
}

/* ── Main page ────────────────────────────────────────────── */

export default function ExplorePage() {
  /* -- View persistence -- */
  const [view, setView] = useState<ExploreView>("map");

  useEffect(() => {
    const saved = localStorage.getItem(LS_VIEW_KEY);
    if (saved === "map" || saved === "grid" || saved === "list") setView(saved);
  }, []);

  function switchView(v: ExploreView) {
    setView(v);
    localStorage.setItem(LS_VIEW_KEY, v);
  }

  /* -- Filter state -- */
  const [categories, setCategories] = useState<string[]>([]);
  const [tierMax, setTierMax] = useState<CreatorTier | "">("");
  const [budgetMin, setBudgetMin] = useState(0);
  const [budgetMax, setBudgetMax] = useState(5000);
  const [distanceKm, setDistanceKm] = useState(0);
  const [deadline, setDeadline] = useState<ExploreFilters["deadline"]>("");

  /* -- Campaigns state -- */
  const [allCampaigns, setAllCampaigns] = useState<CampaignGeo[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(false);

  /* -- Map interaction -- */
  const [activeId, setActiveId] = useState<string | undefined>();

  /* -- Build filter object -- */
  const filters = useMemo<ExploreFilters>(
    () => ({
      categories,
      tierMax: tierMax || undefined,
      budgetMin,
      budgetMax,
      distanceKm,
      deadline,
      sort: "newest",
      page: 1,
      limit: PAGE_SIZE,
    }),
    [categories, tierMax, budgetMin, budgetMax, distanceKm, deadline],
  );

  /* -- Active filter count (for display) -- */
  const activeFilterCount = useMemo(() => {
    let n = 0;
    if (categories.length > 0) n++;
    if (tierMax) n++;
    if (budgetMin > 0 || budgetMax < 5000) n++;
    if (distanceKm > 0) n++;
    if (deadline) n++;
    return n;
  }, [categories, tierMax, budgetMin, budgetMax, distanceKm, deadline]);

  /* -- Initial load + filter change -- */
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setPage(1);

    creatorMock.explore({ ...filters, page: 1 }).then((res) => {
      if (cancelled) return;
      setAllCampaigns(res.campaigns);
      setTotal(res.total);
      setHasMore(res.hasMore);
      setLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, [filters]);

  /* -- Infinite scroll load more -- */
  const loadMore = useCallback(async () => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);
    const nextPage = page + 1;
    const res = await creatorMock.explore({ ...filters, page: nextPage });
    setAllCampaigns((prev) => [...prev, ...res.campaigns]);
    setPage(nextPage);
    setHasMore(res.hasMore);
    setLoadingMore(false);
  }, [filters, hasMore, loadingMore, page]);

  /* -- IntersectionObserver sentinel for infinite scroll -- */
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) loadMore();
      },
      { rootMargin: "120px" },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [loadMore]);

  /* -- Helpers -- */
  function toggleCategory(cat: string) {
    setCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat],
    );
  }

  function clearFilters() {
    setCategories([]);
    setTierMax("");
    setBudgetMin(0);
    setBudgetMax(5000);
    setDistanceKm(0);
    setDeadline("");
  }

  /* ── Filter Rail ────────────────────────────────────────── */

  const filterRail = (
    <aside className="exp-rail">
      <div className="exp-rail-header">
        <span className="exp-rail-title">Explore</span>
        <span className="exp-rail-count">
          Showing{" "}
          <span className="exp-rail-count-num">
            {loading ? "—" : allCampaigns.length}
          </span>{" "}
          of {loading ? "—" : total} campaigns
        </span>
        {activeFilterCount > 0 && (
          <button className="exp-rail-clear" onClick={clearFilters}>
            Clear all ({activeFilterCount})
          </button>
        )}
      </div>

      {/* Category */}
      <div className="exp-filter-section">
        <span className="exp-filter-label">Category</span>
        <div className="exp-chips">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              className={`exp-chip${categories.includes(cat) ? " exp-chip--active" : ""}`}
              onClick={() => toggleCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Tier */}
      <div className="exp-filter-section">
        <span className="exp-filter-label">Max Tier Required</span>
        <div className="exp-tier-row">
          {TIERS.map((t) => (
            <button
              key={t}
              className={`exp-tier-btn exp-tier-btn--${t}${tierMax === t ? " exp-tier-btn--active" : ""}`}
              onClick={() => setTierMax((prev) => (prev === t ? "" : t))}
            >
              {TIER_LABELS[t]}
            </button>
          ))}
        </div>
      </div>

      {/* Budget */}
      <div className="exp-filter-section">
        <span className="exp-filter-label">Payout Range</span>
        <div className="exp-range-wrap">
          <div className="exp-range-vals">
            <span>
              Min:{" "}
              <span className="exp-range-val-bold">
                {budgetMin === 0 ? "Free" : `$${budgetMin}`}
              </span>
            </span>
            <span>
              Max:{" "}
              <span className="exp-range-val-bold">
                {budgetMax >= 5000 ? "Any" : `$${budgetMax}`}
              </span>
            </span>
          </div>
          <input
            type="range"
            className="exp-range"
            min={0}
            max={500}
            step={10}
            value={budgetMin}
            onChange={(e) => {
              const v = Number(e.target.value);
              setBudgetMin(Math.min(v, budgetMax - 10));
            }}
          />
          <input
            type="range"
            className="exp-range"
            min={10}
            max={5000}
            step={10}
            value={budgetMax}
            onChange={(e) => {
              const v = Number(e.target.value);
              setBudgetMax(Math.max(v, budgetMin + 10));
            }}
          />
        </div>
      </div>

      {/* Distance */}
      <div className="exp-filter-section">
        <span className="exp-filter-label">Distance from NYC center</span>
        <div className="exp-range-wrap">
          <div className="exp-range-vals">
            <span>
              Radius:{" "}
              <span className="exp-range-val-bold">
                {distanceKm === 0 ? "All" : `${distanceKm} km`}
              </span>
            </span>
          </div>
          <input
            type="range"
            className="exp-range"
            min={0}
            max={30}
            step={1}
            value={distanceKm}
            onChange={(e) => setDistanceKm(Number(e.target.value))}
          />
        </div>
      </div>

      {/* Deadline */}
      <div className="exp-filter-section">
        <span className="exp-filter-label">Deadline Within</span>
        <div className="exp-deadline-row">
          {(
            [
              ["", "Any"],
              ["today", "Today"],
              ["week", "This Week"],
              ["month", "This Month"],
            ] as [ExploreFilters["deadline"], string][]
          ).map(([val, label]) => (
            <button
              key={String(val)}
              className={`exp-deadline-btn${deadline === val ? " exp-deadline-btn--active" : ""}`}
              onClick={() => setDeadline(val)}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </aside>
  );

  /* ── Map view content ───────────────────────────────────── */

  const mapContent = (
    <div className="exp-map-wrap">
      <MapView
        campaigns={allCampaigns.map((c) => ({
          id: c.id,
          title: c.title,
          business_name: c.business_name,
          payout: c.payout,
          lat: c.lat,
          lng: c.lng,
          spots_remaining: c.spots_remaining,
          description: c.description,
          image: c.image,
          category: c.category,
        }))}
        center={NYC_CENTER}
        activeId={activeId}
        onPinClick={(id) =>
          setActiveId((prev) => (prev === id ? undefined : id))
        }
        onPopupClose={() => setActiveId(undefined)}
        showPricePills
        showPopups
        mono
      />
    </div>
  );

  /* ── Grid card ──────────────────────────────────────────── */

  function GridCard({ c }: { c: CampaignGeo }) {
    const free = c.payout === 0;
    const tc = tierClass(c.tier_required);
    const dl = formatDate(c.deadline);
    const urgent = isUrgent(c.deadline);

    return (
      <article className="exp-gcard">
        {c.image ? (
          <img
            src={c.image}
            alt={c.title}
            className="exp-gcard-img"
            loading="lazy"
          />
        ) : (
          <div className="exp-gcard-img exp-gcard-img--placeholder">
            {c.business_name[0]}
          </div>
        )}
        <div className="exp-gcard-body">
          <div className="exp-gcard-meta">
            <span
              className={`exp-gcard-tier${tc ? ` exp-gcard-tier--${tc}` : ""}`}
            >
              {TIER_LABELS[c.tier_required]}
            </span>
            <span
              className={`exp-gcard-payout${free ? " exp-gcard-payout--free" : ""}`}
            >
              {formatPayout(c.payout)}
            </span>
          </div>
          <h3 className="exp-gcard-title">{c.title}</h3>
          <p className="exp-gcard-merchant">{c.business_name}</p>
          <div className="exp-gcard-footer">
            <span className="exp-gcard-neighborhood">{c.neighborhood}</span>
            {dl && (
              <span
                className={`exp-gcard-deadline${urgent ? " exp-gcard-deadline--urgent" : ""}`}
              >
                {urgent ? `${daysLeft(c.deadline)}d left` : dl}
              </span>
            )}
          </div>
          <button className="exp-gcard-apply">Apply</button>
        </div>
      </article>
    );
  }

  /* ── Grid view content ──────────────────────────────────── */

  const gridContent = (
    <div className="exp-grid-scroll">
      {loading ? (
        <div className="exp-empty">
          <div className="exp-empty-icon">—</div>
          <p className="exp-empty-title">Loading campaigns</p>
        </div>
      ) : allCampaigns.length === 0 ? (
        <div className="exp-empty">
          <div className="exp-empty-icon">0</div>
          <p className="exp-empty-title">No campaigns found</p>
          <p className="exp-empty-sub">Try adjusting your filters.</p>
        </div>
      ) : (
        <div className="exp-grid">
          {allCampaigns.map((c, i) => (
            <div
              key={c.id}
              style={{ animationDelay: `${Math.min(i % PAGE_SIZE, 8) * 40}ms` }}
            >
              <GridCard c={c} />
            </div>
          ))}
          {/* Infinite scroll sentinel */}
          <div ref={sentinelRef} className="exp-grid-sentinel">
            {loadingMore
              ? "Loading more…"
              : hasMore
                ? ""
                : "All campaigns loaded"}
          </div>
        </div>
      )}
    </div>
  );

  /* ── List row ───────────────────────────────────────────── */

  function ListRow({ c, idx }: { c: CampaignGeo; idx: number }) {
    const free = c.payout === 0;
    const tc = tierClass(c.tier_required);
    const dl = formatDate(c.deadline);
    const urgent = isUrgent(c.deadline);

    return (
      <tr
        className="exp-list-row"
        style={{ animationDelay: `${Math.min(idx % PAGE_SIZE, 12) * 25}ms` }}
      >
        <td className="exp-list-td">
          <div className="exp-list-thumb-wrap">
            {c.image ? (
              <img
                src={c.image}
                alt={c.title}
                className="exp-list-thumb"
                loading="lazy"
              />
            ) : (
              <div
                className="exp-list-thumb"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: "var(--font-display)",
                  fontSize: 18,
                  fontWeight: 900,
                  color: "rgba(0,48,73,0.2)",
                }}
              >
                {c.business_name[0]}
              </div>
            )}
          </div>
        </td>
        <td className="exp-list-td" style={{ maxWidth: 240 }}>
          <span className="exp-list-title">{c.title}</span>
          <span className="exp-list-merchant">{c.business_name}</span>
        </td>
        <td
          className="exp-list-td"
          style={{ color: "rgba(0,48,73,0.5)", fontSize: 12 }}
        >
          {c.neighborhood}
        </td>
        <td className="exp-list-td">
          <span className={`exp-list-tier${tc ? ` exp-list-tier--${tc}` : ""}`}>
            {TIER_LABELS[c.tier_required]}
          </span>
        </td>
        <td className="exp-list-td">
          <span
            className={`exp-list-payout${free ? " exp-list-payout--free" : ""}`}
          >
            {formatPayout(c.payout)}
          </span>
        </td>
        <td className="exp-list-td">
          <span
            className={`exp-list-spots${c.spots_remaining <= 2 ? " exp-list-spots--urgent" : ""}`}
          >
            {c.spots_remaining}
          </span>
        </td>
        <td className="exp-list-td">
          {dl ? (
            <span
              className={`exp-list-deadline${urgent ? " exp-list-deadline--urgent" : ""}`}
            >
              {urgent ? `${daysLeft(c.deadline)}d` : dl}
            </span>
          ) : (
            <span style={{ color: "rgba(0,48,73,0.3)" }}>—</span>
          )}
        </td>
        <td className="exp-list-td">
          <button className="exp-list-apply">Apply</button>
        </td>
      </tr>
    );
  }

  /* ── List view content ──────────────────────────────────── */

  const listContent = (
    <div className="exp-list-scroll">
      {loading ? (
        <div className="exp-empty">
          <div className="exp-empty-icon">—</div>
          <p className="exp-empty-title">Loading campaigns</p>
        </div>
      ) : allCampaigns.length === 0 ? (
        <div className="exp-empty">
          <div className="exp-empty-icon">0</div>
          <p className="exp-empty-title">No campaigns found</p>
          <p className="exp-empty-sub">Try adjusting your filters.</p>
        </div>
      ) : (
        <table className="exp-list-table">
          <thead className="exp-list-thead">
            <tr>
              <th className="exp-list-th" style={{ width: 64 }} />
              <th className="exp-list-th">Campaign</th>
              <th className="exp-list-th">Neighborhood</th>
              <th className="exp-list-th">Tier</th>
              <th className="exp-list-th">Payout</th>
              <th className="exp-list-th">Spots</th>
              <th className="exp-list-th">Deadline</th>
              <th className="exp-list-th" />
            </tr>
          </thead>
          <tbody>
            {allCampaigns.map((c, idx) => (
              <ListRow key={c.id} c={c} idx={idx} />
            ))}
          </tbody>
        </table>
      )}
    </div>
  );

  /* ── Render ─────────────────────────────────────────────── */

  return (
    <div className="exp">
      {/* Top Bar */}
      <header className="exp-topbar">
        <Link href="/" className="exp-logo">
          Push
        </Link>

        <div className="exp-topbar-center">
          <div className="exp-view-tabs">
            {(
              [
                ["map", "Map"],
                ["grid", "Grid"],
                ["list", "List"],
              ] as [ExploreView, string][]
            ).map(([v, label]) => (
              <button
                key={v}
                className={`exp-view-tab${view === v ? " exp-view-tab--active" : ""}`}
                onClick={() => switchView(v)}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="exp-topbar-right">
          <Link href="/creator/dashboard" className="exp-topbar-back">
            Dashboard &rarr;
          </Link>
        </div>
      </header>

      {/* Body */}
      <div className="exp-body">
        {/* Filter rail — always visible across all views */}
        {filterRail}

        {/* Main content area */}
        <main className="exp-main">
          {view === "map" && mapContent}
          {view === "grid" && gridContent}
          {view === "list" && listContent}
        </main>
      </div>
    </div>
  );
}
