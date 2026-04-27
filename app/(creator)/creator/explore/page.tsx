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
    <div
      style={{ width: "100%", height: "100%", background: "var(--surface)" }}
    />
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
    <aside
      style={{
        width: 240,
        flexShrink: 0,
        background: "var(--surface-2)",
        borderRight: "1px solid var(--hairline)",
        overflowY: "auto",
        padding: "24px 16px",
        display: "flex",
        flexDirection: "column",
        gap: 24,
      }}
    >
      {/* Header */}
      <div>
        <p
          className="eyebrow"
          style={{ color: "var(--ink-4)", marginBottom: 4 }}
        >
          EXPLORE CAMPAIGNS
        </p>
        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: 12,
            color: "var(--ink-4)",
            margin: 0,
          }}
        >
          {loading ? "—" : allCampaigns.length} of {loading ? "—" : total} shown
        </p>
        {activeFilterCount > 0 && (
          <button
            onClick={clearFilters}
            style={{
              marginTop: 8,
              fontFamily: "var(--font-body)",
              fontSize: 11,
              fontWeight: 600,
              color: "var(--brand-red)",
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 0,
              textDecoration: "underline",
            }}
          >
            Clear all ({activeFilterCount})
          </button>
        )}
      </div>

      {/* Category */}
      <div>
        <p
          className="eyebrow"
          style={{ color: "var(--ink-4)", marginBottom: 8 }}
        >
          CATEGORY
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => toggleCategory(cat)}
              style={{
                padding: "4px 12px",
                borderRadius: 8,
                border: "1px solid var(--hairline)",
                background: categories.includes(cat)
                  ? "var(--ink)"
                  : "var(--surface)",
                color: categories.includes(cat)
                  ? "var(--snow)"
                  : "var(--ink-3)",
                fontFamily: "var(--font-body)",
                fontSize: 12,
                cursor: "pointer",
                transition: "all 0.15s",
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Tier */}
      <div>
        <p
          className="eyebrow"
          style={{ color: "var(--ink-4)", marginBottom: 8 }}
        >
          MAX TIER REQUIRED
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
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
      <div>
        <p
          className="eyebrow"
          style={{ color: "var(--ink-4)", marginBottom: 8 }}
        >
          PAYOUT RANGE
        </p>
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
      <div>
        <p
          className="eyebrow"
          style={{ color: "var(--ink-4)", marginBottom: 8 }}
        >
          DISTANCE FROM NYC
        </p>
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
      <div>
        <p
          className="eyebrow"
          style={{ color: "var(--ink-4)", marginBottom: 8 }}
        >
          DEADLINE WITHIN
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
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
              onClick={() => setDeadline(val)}
              style={{
                padding: "4px 10px",
                borderRadius: 8,
                border: "1px solid var(--hairline)",
                background: deadline === val ? "var(--ink)" : "var(--surface)",
                color: deadline === val ? "var(--snow)" : "var(--ink-3)",
                fontFamily: "var(--font-body)",
                fontSize: 11,
                cursor: "pointer",
                transition: "all 0.15s",
              }}
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
      <article
        style={{
          background: "var(--surface-2)",
          border: "1px solid var(--hairline)",
          borderRadius: 10,
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          cursor: "pointer",
          transition: "transform 0.15s, box-shadow 0.15s",
        }}
        className="click-shift"
      >
        {c.image ? (
          <img
            src={c.image}
            alt={c.title}
            style={{
              width: "100%",
              height: 140,
              objectFit: "cover",
              display: "block",
            }}
            loading="lazy"
          />
        ) : (
          <div
            style={{
              width: "100%",
              height: 140,
              background: "var(--surface-3, #ece9e0)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: "var(--font-display)",
              fontSize: 32,
              fontWeight: 900,
              color: "var(--ink-4)",
            }}
          >
            {c.business_name[0]}
          </div>
        )}
        <div
          style={{
            padding: "16px",
            flex: 1,
            display: "flex",
            flexDirection: "column",
            gap: 8,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <span
              className={`exp-gcard-tier${tc ? ` exp-gcard-tier--${tc}` : ""}`}
            >
              {TIER_LABELS[c.tier_required]}
            </span>
            <span
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 900,
                fontSize: 16,
                color: free ? "var(--ink-3)" : "var(--ink)",
                letterSpacing: "-0.02em",
              }}
            >
              {formatPayout(c.payout)}
            </span>
          </div>
          <h3
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: 15,
              color: "var(--ink)",
              margin: 0,
              lineHeight: 1.3,
            }}
          >
            {c.title}
          </h3>
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: 12,
              color: "var(--ink-4)",
              margin: 0,
            }}
          >
            {c.business_name}
          </p>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: "auto",
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-body)",
                fontSize: 11,
                color: "var(--ink-4)",
              }}
            >
              {c.neighborhood}
            </span>
            {dl && (
              <span
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: 11,
                  color: urgent ? "var(--brand-red)" : "var(--ink-4)",
                  fontWeight: urgent ? 600 : 400,
                }}
              >
                {urgent ? `${daysLeft(c.deadline)}d left` : dl}
              </span>
            )}
          </div>
          <button
            className="btn-primary click-shift"
            style={{ marginTop: 4, fontSize: 12, padding: "8px 16px" }}
          >
            Apply
          </button>
        </div>
      </article>
    );
  }

  /* ── Grid view content ──────────────────────────────────── */

  const gridContent = (
    <div className="exp-grid-scroll">
      {loading ? (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "64px 24px",
            gap: 12,
          }}
        >
          <p
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: 18,
              color: "var(--ink)",
              margin: 0,
            }}
          >
            Loading campaigns
          </p>
        </div>
      ) : allCampaigns.length === 0 ? (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "64px 24px",
            gap: 12,
          }}
        >
          <p
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: 18,
              color: "var(--ink)",
              margin: 0,
            }}
          >
            No campaigns found
          </p>
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: 13,
              color: "var(--ink-4)",
              margin: 0,
            }}
          >
            Try adjusting your filters.
          </p>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
            gap: 16,
            padding: "24px",
          }}
        >
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
                  color: "var(--ink-4)",
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
          style={{ color: "var(--ink-4)", fontSize: 12 }}
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
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: 14,
              color: free ? "var(--ink-4)" : "var(--ink)",
            }}
          >
            {formatPayout(c.payout)}
          </span>
        </td>
        <td className="exp-list-td">
          <span
            style={{
              fontFamily: "var(--font-body)",
              fontSize: 13,
              fontWeight: c.spots_remaining <= 2 ? 700 : 400,
              color:
                c.spots_remaining <= 2 ? "var(--brand-red)" : "var(--ink-3)",
            }}
          >
            {c.spots_remaining}
          </span>
        </td>
        <td className="exp-list-td">
          {dl ? (
            <span
              style={{
                fontFamily: "var(--font-body)",
                fontSize: 12,
                color: urgent ? "var(--brand-red)" : "var(--ink-4)",
                fontWeight: urgent ? 600 : 400,
              }}
            >
              {urgent ? `${daysLeft(c.deadline)}d` : dl}
            </span>
          ) : (
            <span style={{ color: "var(--ink-4)" }}>—</span>
          )}
        </td>
        <td className="exp-list-td">
          <button
            className="btn-primary click-shift"
            style={{ fontSize: 11, padding: "6px 14px" }}
          >
            Apply
          </button>
        </td>
      </tr>
    );
  }

  /* ── List view content ──────────────────────────────────── */

  const listContent = (
    <div className="exp-list-scroll">
      {loading ? (
        <div
          style={{
            padding: "64px 24px",
            textAlign: "center",
          }}
        >
          <p
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: 18,
              color: "var(--ink)",
              margin: 0,
            }}
          >
            Loading campaigns
          </p>
        </div>
      ) : allCampaigns.length === 0 ? (
        <div style={{ padding: "64px 24px", textAlign: "center" }}>
          <p
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: 18,
              color: "var(--ink)",
              margin: "0 0 8px",
            }}
          >
            No campaigns found
          </p>
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: 13,
              color: "var(--ink-4)",
              margin: 0,
            }}
          >
            Try adjusting your filters.
          </p>
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
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        background: "var(--surface)",
        fontFamily: "var(--font-body)",
      }}
    >
      {/* Top Bar */}
      <header
        style={{
          height: 56,
          borderBottom: "1px solid var(--hairline)",
          display: "flex",
          alignItems: "center",
          padding: "0 24px",
          gap: 16,
          background: "var(--surface-2)",
          flexShrink: 0,
        }}
      >
        <Link
          href="/"
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 900,
            fontSize: 18,
            color: "var(--ink)",
            textDecoration: "none",
            letterSpacing: "-0.04em",
          }}
        >
          Push
        </Link>

        {/* View switcher — center */}
        <div
          style={{
            flex: 1,
            display: "flex",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              gap: 4,
              background: "var(--surface)",
              border: "1px solid var(--hairline)",
              borderRadius: 10,
              padding: 4,
            }}
          >
            {(
              [
                ["map", "Map"],
                ["grid", "Grid"],
                ["list", "List"],
              ] as [ExploreView, string][]
            ).map(([v, label]) => (
              <button
                key={v}
                onClick={() => switchView(v)}
                style={{
                  padding: "5px 16px",
                  borderRadius: 7,
                  border: "none",
                  background: view === v ? "var(--ink)" : "transparent",
                  color: view === v ? "var(--snow)" : "var(--ink-3)",
                  fontFamily: "var(--font-body)",
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "all 0.15s",
                }}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <Link
          href="/creator/dashboard"
          style={{
            fontFamily: "var(--font-body)",
            fontSize: 12,
            fontWeight: 600,
            color: "var(--ink-3)",
            textDecoration: "none",
            display: "flex",
            alignItems: "center",
            gap: 4,
          }}
        >
          Dashboard &rarr;
        </Link>
      </header>

      {/* Body */}
      <div
        style={{
          flex: 1,
          display: "flex",
          overflow: "hidden",
        }}
      >
        {/* Filter rail — always visible */}
        {filterRail}

        {/* Main content */}
        <main
          style={{
            flex: 1,
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {view === "map" && mapContent}
          {view === "grid" && gridContent}
          {view === "list" && listContent}
        </main>
      </div>
    </div>
  );
}
