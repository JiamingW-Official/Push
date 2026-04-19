"use client";

import { useState, useEffect, useRef } from "react";
import "./archive.css";

// ── Types ──────────────────────────────────────────────────────────────────────

type CampaignStatus = "Completed" | "Processing";

type ArchivedCampaign = {
  id: string;
  merchant: string;
  campaignType: string;
  category: string;
  dateStart: string;
  dateEnd: string;
  dateLabel: string;
  year: number;
  walkIns: number;
  earned: number;
  status: CampaignStatus;
  thumbnailUrl?: string;
};

// ── Category color map ─────────────────────────────────────────────────────────

const CATEGORY_COLOR: Record<string, string> = {
  Coffee: "#c9a96e",
  Food: "#c1121f",
  Beauty: "#669bbc",
  Lifestyle: "#003049",
  Fitness: "#780000",
  Retail: "#4a5568",
};

function categoryColor(cat: string): string {
  return CATEGORY_COLOR[cat] ?? "#c9a96e";
}

// ── Mock data ──────────────────────────────────────────────────────────────────

const MOCK_CAMPAIGNS: ArchivedCampaign[] = [
  {
    id: "c1",
    merchant: "Blank Street Coffee",
    campaignType: "Walk-in Drive",
    category: "Coffee",
    dateStart: "2026-01-10",
    dateEnd: "2026-01-24",
    dateLabel: "Jan 10 – 24, 2026",
    year: 2026,
    walkIns: 14,
    earned: 42,
    status: "Completed",
  },
  {
    id: "c2",
    merchant: "Cha Cha Matcha",
    campaignType: "Content + Visit",
    category: "Coffee",
    dateStart: "2026-02-01",
    dateEnd: "2026-02-15",
    dateLabel: "Feb 1 – 15, 2026",
    year: 2026,
    walkIns: 9,
    earned: 27,
    status: "Completed",
  },
  {
    id: "c3",
    merchant: "Superiority Burger",
    campaignType: "Walk-in Drive",
    category: "Food",
    dateStart: "2026-02-20",
    dateEnd: "2026-03-06",
    dateLabel: "Feb 20 – Mar 6, 2026",
    year: 2026,
    walkIns: 22,
    earned: 66,
    status: "Completed",
  },
  {
    id: "c4",
    merchant: "Brow Theory",
    campaignType: "Awareness Visit",
    category: "Beauty",
    dateStart: "2026-03-10",
    dateEnd: "2026-03-24",
    dateLabel: "Mar 10 – 24, 2026",
    year: 2026,
    walkIns: 11,
    earned: 55,
    status: "Completed",
  },
  {
    id: "c5",
    merchant: "Flamingo Estate",
    campaignType: "Content + Visit",
    category: "Lifestyle",
    dateStart: "2026-04-01",
    dateEnd: "2026-04-15",
    dateLabel: "Apr 1 – 15, 2026",
    year: 2026,
    walkIns: 7,
    earned: 35,
    status: "Processing",
  },
  {
    id: "c6",
    merchant: "The Well NYC",
    campaignType: "Walk-in Drive",
    category: "Fitness",
    dateStart: "2025-11-01",
    dateEnd: "2025-11-15",
    dateLabel: "Nov 1 – 15, 2025",
    year: 2025,
    walkIns: 18,
    earned: 54,
    status: "Completed",
  },
  {
    id: "c7",
    merchant: "Le Bec Fin",
    campaignType: "Content + Visit",
    category: "Food",
    dateStart: "2025-10-05",
    dateEnd: "2025-10-19",
    dateLabel: "Oct 5 – 19, 2025",
    year: 2025,
    walkIns: 12,
    earned: 48,
    status: "Completed",
  },
  {
    id: "c8",
    merchant: "Aesop SoHo",
    campaignType: "Awareness Visit",
    category: "Retail",
    dateStart: "2025-09-12",
    dateEnd: "2025-09-26",
    dateLabel: "Sep 12 – 26, 2025",
    year: 2025,
    walkIns: 8,
    earned: 24,
    status: "Completed",
  },
];

// ── Animated counter ────────────────────────────────────────────────────────────

function useCountUp(target: number, duration = 900, delay = 0) {
  const [value, setValue] = useState(0);
  const raf = useRef<number>(0);

  useEffect(() => {
    const timeout = setTimeout(() => {
      const start = performance.now();
      function tick(now: number) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        // ease out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        setValue(Math.round(eased * target));
        if (progress < 1) raf.current = requestAnimationFrame(tick);
      }
      raf.current = requestAnimationFrame(tick);
    }, delay);

    return () => {
      clearTimeout(timeout);
      cancelAnimationFrame(raf.current);
    };
  }, [target, duration, delay]);

  return value;
}

// ── Stats bar ─────────────────────────────────────────────────────────────────

function StatsBar({ campaigns }: { campaigns: ArchivedCampaign[] }) {
  const totalEarned = campaigns.reduce((s, c) => s + c.earned, 0);
  const totalWalkIns = campaigns.reduce((s, c) => s + c.walkIns, 0);
  const totalCampaigns = campaigns.length;

  const earnedVal = useCountUp(totalEarned, 900, 150);
  const campaignsVal = useCountUp(totalCampaigns, 700, 300);
  const walkInsVal = useCountUp(totalWalkIns, 1000, 450);

  return (
    <div className="arc-stats-bar">
      <div className="arc-stat-block">
        <div className="arc-stat-number">${earnedVal.toLocaleString()}</div>
        <div className="arc-stat-sublabel">Total Earned</div>
      </div>
      <div className="arc-stat-block">
        <div className="arc-stat-number">{campaignsVal}</div>
        <div className="arc-stat-sublabel">Campaigns</div>
      </div>
      <div className="arc-stat-block">
        <div className="arc-stat-number">{walkInsVal}</div>
        <div className="arc-stat-sublabel">Walk-ins Driven</div>
      </div>
    </div>
  );
}

// ── List view ──────────────────────────────────────────────────────────────────

function ListView({
  campaigns,
  filter,
}: {
  campaigns: ArchivedCampaign[];
  filter: string;
}) {
  const filtered =
    filter === "All"
      ? campaigns
      : campaigns.filter((c) => c.category === filter);

  // Group by year descending
  const byYear = filtered.reduce<Record<number, ArchivedCampaign[]>>(
    (acc, c) => {
      (acc[c.year] ??= []).push(c);
      return acc;
    },
    {},
  );
  const years = Object.keys(byYear)
    .map(Number)
    .sort((a, b) => b - a);

  if (filtered.length === 0) {
    return (
      <div className="arc-empty">
        <span className="arc-empty-icon">◻</span>
        No campaigns for this filter yet.
      </div>
    );
  }

  return (
    <div className="arc-list-view">
      {years.map((year) => {
        const group = byYear[year];
        const yearTotal = group.reduce((s, c) => s + c.earned, 0);
        return (
          <div key={year} className="arc-year-group">
            <div className="arc-year-header">
              <span className="arc-year-label">{year}</span>
              <span className="arc-year-total">
                ${yearTotal.toLocaleString()}
              </span>
              <span className="arc-year-count">
                {group.length} campaign{group.length !== 1 ? "s" : ""}
              </span>
            </div>
            {group.map((c, i) => (
              <div
                key={c.id}
                className="arc-campaign-row"
                style={{ animationDelay: `${i * 40}ms` }}
              >
                <div
                  className="arc-row-color-strip"
                  style={{ background: categoryColor(c.category) }}
                />
                <div className="arc-row-main">
                  <span className="arc-row-merchant">{c.merchant}</span>
                  <span className="arc-row-type">{c.campaignType}</span>
                </div>
                <div className="arc-row-date">{c.dateLabel}</div>
                <div className="arc-row-metrics">
                  <div className="arc-row-walkins">
                    <span className="arc-row-walkins-val">{c.walkIns}</span>
                    <span className="arc-row-walkins-lbl">Walk-ins</span>
                  </div>
                  <div className="arc-row-earn">
                    <span className="arc-row-earn-val">${c.earned}</span>
                    <span className="arc-row-earn-lbl">Earned</span>
                  </div>
                </div>
                <div className="arc-row-status">
                  <span
                    className={`arc-status-chip arc-status-chip--${c.status.toLowerCase()}`}
                  >
                    {c.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
}

// ── Grid view ──────────────────────────────────────────────────────────────────

function GridView({
  campaigns,
  filter,
}: {
  campaigns: ArchivedCampaign[];
  filter: string;
}) {
  const filtered =
    filter === "All"
      ? campaigns
      : campaigns.filter((c) => c.category === filter);

  if (filtered.length === 0) {
    return (
      <div className="arc-empty">
        <span className="arc-empty-icon">◻</span>
        No campaigns for this filter yet.
      </div>
    );
  }

  return (
    <div className="arc-grid-view">
      {filtered.map((c, i) => (
        <div
          key={c.id}
          className="arc-grid-card"
          style={{ animationDelay: `${i * 50}ms` }}
        >
          <div className="arc-grid-thumb-wrap">
            {c.thumbnailUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={c.thumbnailUrl}
                alt={c.merchant}
                className="arc-grid-thumb"
              />
            ) : (
              <div className="arc-grid-thumb-placeholder">
                <span className="arc-grid-placeholder-icon">📷</span>
              </div>
            )}
            <div
              className="arc-grid-color-bar"
              style={{ background: categoryColor(c.category) }}
            />
            <div className="arc-grid-overlay">
              <span className="arc-grid-overlay-name">{c.merchant}</span>
              <span className="arc-grid-overlay-earn">${c.earned}</span>
              <span
                className={`arc-status-chip arc-status-chip--${c.status.toLowerCase()}`}
              >
                {c.status}
              </span>
            </div>
          </div>
          <div className="arc-grid-footer">
            <span className="arc-grid-merchant">{c.merchant}</span>
            <span className="arc-grid-date">{c.year}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Export helper (CSV) ───────────────────────────────────────────────────────

function downloadCSV(campaigns: ArchivedCampaign[]) {
  const header = "Merchant,Type,Category,Date,Walk-ins,Earned,Status";
  const rows = campaigns.map(
    (c) =>
      `"${c.merchant}","${c.campaignType}","${c.category}","${c.dateLabel}",${c.walkIns},${c.earned},"${c.status}"`,
  );
  const csv = [header, ...rows].join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "push-campaign-archive.csv";
  a.click();
  URL.revokeObjectURL(url);
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function ArchivePage() {
  const [view, setView] = useState<"list" | "grid">("list");
  const [filter, setFilter] = useState("All");

  const categories = [
    "All",
    ...Array.from(new Set(MOCK_CAMPAIGNS.map((c) => c.category))),
  ];

  return (
    <div className="arc-page">
      {/* Page header */}
      <div className="arc-page-header">
        <div className="arc-page-header-left">
          <span className="arc-eyebrow">Portfolio</span>
          <h1 className="arc-page-title">Campaign Archive</h1>
        </div>
        <div className="arc-header-actions">
          <button
            type="button"
            className="arc-btn arc-btn--secondary"
            onClick={() => downloadCSV(MOCK_CAMPAIGNS)}
          >
            ↓ Export CSV
          </button>
        </div>
      </div>

      {/* Stats bar */}
      <StatsBar campaigns={MOCK_CAMPAIGNS} />

      {/* Controls */}
      <div className="arc-controls">
        <div className="arc-controls-left">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              className={`arc-filter-chip ${filter === cat ? "arc-filter-chip--active" : ""}`}
              onClick={() => setFilter(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
        <div className="arc-controls-right">
          <div className="arc-view-toggle">
            <button
              type="button"
              className={`arc-view-btn ${view === "list" ? "arc-view-btn--active" : ""}`}
              onClick={() => setView("list")}
              aria-label="List view"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <rect x="0" y="1" width="14" height="2" fill="currentColor" />
                <rect x="0" y="6" width="14" height="2" fill="currentColor" />
                <rect x="0" y="11" width="14" height="2" fill="currentColor" />
              </svg>
              List
            </button>
            <button
              type="button"
              className={`arc-view-btn ${view === "grid" ? "arc-view-btn--active" : ""}`}
              onClick={() => setView("grid")}
              aria-label="Grid view"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <rect x="0" y="0" width="6" height="6" fill="currentColor" />
                <rect x="8" y="0" width="6" height="6" fill="currentColor" />
                <rect x="0" y="8" width="6" height="6" fill="currentColor" />
                <rect x="8" y="8" width="6" height="6" fill="currentColor" />
              </svg>
              Grid
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      {view === "list" ? (
        <ListView campaigns={MOCK_CAMPAIGNS} filter={filter} />
      ) : (
        <GridView campaigns={MOCK_CAMPAIGNS} filter={filter} />
      )}
    </div>
  );
}
