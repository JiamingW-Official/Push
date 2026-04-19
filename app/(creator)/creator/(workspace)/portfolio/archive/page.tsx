"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  MOCK_PROFILES,
  type PastCampaign,
} from "@/lib/portfolio/mock-profiles";
import "./archive.css";

// Demo: use maya-eats-nyc as the logged-in creator
const DEMO_PROFILE = MOCK_PROFILES[0];

type ViewMode = "grid" | "timeline";
type TimeFilter = "all" | "this-year" | "last-year";

// ── Category color mapping ────────────────────────────────────────────────────
const CATEGORY_COLORS: Record<string, string> = {
  "Food & Drink": "#003049",
  Lifestyle: "#780000",
  Beauty: "#c1121f",
  Fashion: "#002035",
  Fitness: "#003049",
  Tech: "#002035",
};

// Derive category from brand neighborhood heuristics (mock data doesn't have
// category on PastCampaign, so we assign a tint based on the brand name index)
const TINT_PALETTE = [
  "rgba(0,48,73,0.12)",
  "rgba(193,18,31,0.12)",
  "rgba(102,155,188,0.15)",
  "rgba(120,0,0,0.10)",
  "rgba(201,169,110,0.15)",
  "rgba(0,48,73,0.08)",
];

const TINT_SOLID_PALETTE = [
  "#003049",
  "#c1121f",
  "#669bbc",
  "#780000",
  "#c9a96e",
  "#002035",
];

function getTintForCampaign(c: PastCampaign, idx: number) {
  return TINT_SOLID_PALETTE[idx % TINT_SOLID_PALETTE.length];
}

function formatCurrency(amount: number): string {
  if (amount === 0) return "Free";
  return `$${amount.toLocaleString()}`;
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function getYear(iso: string): string {
  return new Date(iso).getFullYear().toString();
}

// ── Achievement Badges data ───────────────────────────────────────────────────
function computeAchievements(campaigns: PastCampaign[], totalEarned: number) {
  const sorted = [...campaigns].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
  );

  const badges = [];

  if (sorted.length >= 1) {
    badges.push({
      key: "first",
      name: "First Campaign",
      date: formatDate(sorted[0].date),
      type: "first" as const,
    });
  }

  if (totalEarned >= 1000) {
    const milestone = sorted.find((_, i) => {
      let sum = 0;
      for (let j = 0; j <= i; j++) sum += sorted[j].earnings;
      return sum >= 1000;
    });
    badges.push({
      key: "milestone",
      name: "$1,000 Milestone",
      date: milestone ? formatDate(milestone.date) : "",
      type: "milestone" as const,
    });
  }

  if (sorted.length >= 10) {
    badges.push({
      key: "ten",
      name: "10 Campaigns",
      date: formatDate(sorted[9].date),
      type: "ten" as const,
    });
  }

  return badges;
}

// ── Unique merchant names for filter chips ────────────────────────────────────
function getUniqueNeighborhoods(campaigns: PastCampaign[]): string[] {
  const seen = new Set<string>();
  campaigns.forEach((c) => seen.add(c.neighborhood));
  return Array.from(seen).sort();
}

// ── Card component ────────────────────────────────────────────────────────────
function ArchiveCard({
  campaign,
  colorIdx,
}: {
  campaign: PastCampaign;
  colorIdx: number;
}) {
  const bgColor = getTintForCampaign(campaign, colorIdx);
  const isZero = campaign.earnings === 0;

  return (
    <Link
      href={`/creator/campaigns/demo-campaign-00${(colorIdx % 8) + 1}`}
      className="ar-card"
    >
      {/* Color tint zone */}
      <div className="ar-card-tint" style={{ background: bgColor }}>
        <span className="ar-card-category-pill">{campaign.neighborhood}</span>
      </div>

      {/* Body */}
      <div className="ar-card-body">
        <h3 className="ar-card-campaign-name">{campaign.brand}</h3>
        <div className="ar-card-merchant">
          Campaign · {campaign.neighborhood}
        </div>
        <div className="ar-card-date">{formatDate(campaign.date)}</div>
      </div>

      {/* Footer */}
      <div className="ar-card-footer">
        <div
          className={`ar-card-earning${isZero ? " ar-card-earning--zero" : ""}`}
        >
          {formatCurrency(campaign.earnings)}
        </div>
        <div className="ar-card-scans">
          <span className="ar-card-scans-number">
            {campaign.verifiedVisits}
          </span>
          <span className="ar-card-scans-label">Scans</span>
        </div>
      </div>
    </Link>
  );
}

// ── Timeline row component ────────────────────────────────────────────────────
function TimelineRow({
  campaign,
  colorIdx,
  delay,
}: {
  campaign: PastCampaign;
  colorIdx: number;
  delay: number;
}) {
  return (
    <Link
      href={`/creator/campaigns/demo-campaign-00${(colorIdx % 8) + 1}`}
      className="ar-timeline-row"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="ar-timeline-dot" />

      <div className="ar-timeline-content">
        <span className="ar-timeline-date">{formatDate(campaign.date)}</span>
        <span className="ar-timeline-brand">{campaign.brand}</span>
        <span className="ar-timeline-location">{campaign.neighborhood}</span>
      </div>

      <div className="ar-timeline-earning">
        {formatCurrency(campaign.earnings)}
      </div>

      {/* Expanded on hover */}
      <div className="ar-timeline-expand">
        <span className="ar-timeline-expand-stat">
          <strong>{campaign.verifiedVisits}</strong>&nbsp;scans attributed
        </span>
        <span className="ar-timeline-expand-stat">
          <strong>{campaign.deliveryTime}</strong>&nbsp;delivery
        </span>
      </div>
    </Link>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function PortfolioArchivePage() {
  const profile = DEMO_PROFILE;
  const allCampaigns = profile.pastCampaigns;

  const [view, setView] = useState<ViewMode>("grid");
  const [timeFilter, setTimeFilter] = useState<TimeFilter>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeNeighborhood, setActiveNeighborhood] = useState<string | null>(
    null,
  );

  const currentYear = new Date().getFullYear();

  // Filter campaigns
  const filteredCampaigns = useMemo(() => {
    return allCampaigns.filter((c) => {
      const year = new Date(c.date).getFullYear();

      if (timeFilter === "this-year" && year !== currentYear) return false;
      if (timeFilter === "last-year" && year !== currentYear - 1) return false;

      if (activeNeighborhood && c.neighborhood !== activeNeighborhood)
        return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const match =
          c.brand.toLowerCase().includes(q) ||
          c.neighborhood.toLowerCase().includes(q);
        if (!match) return false;
      }

      return true;
    });
  }, [allCampaigns, timeFilter, activeNeighborhood, searchQuery, currentYear]);

  // Aggregate stats
  const totalEarned = allCampaigns.reduce((s, c) => s + c.earnings, 0);
  const filteredEarned = filteredCampaigns.reduce((s, c) => s + c.earnings, 0);
  const totalCount = allCampaigns.length;

  // Group by year
  const groupedByYear = useMemo(() => {
    const map: Record<string, PastCampaign[]> = {};
    filteredCampaigns.forEach((c) => {
      const yr = getYear(c.date);
      if (!map[yr]) map[yr] = [];
      map[yr].push(c);
    });
    // Sort years descending
    return Object.entries(map).sort(([a], [b]) => Number(b) - Number(a));
  }, [filteredCampaigns]);

  // Achievements
  const achievements = useMemo(
    () => computeAchievements(allCampaigns, totalEarned),
    [allCampaigns, totalEarned],
  );

  const neighborhoods = useMemo(
    () => getUniqueNeighborhoods(allCampaigns),
    [allCampaigns],
  );

  return (
    <div className="ar-page">
      {/* ── Page Header ───────────────────────────────────────── */}
      <header className="ar-page-header">
        <div className="ar-page-header-inner">
          <div className="ar-header-left">
            <div className="ar-eyebrow">Portfolio</div>
            <span className="ar-wordmark">ARCHIVE</span>
            <div className="ar-stats-eyebrow">
              {totalCount} COMPLETED CAMPAIGNS · ${totalEarned.toLocaleString()}{" "}
              TOTAL EARNED
            </div>
          </div>

          <div className="ar-header-right">
            {/* Time filter */}
            <div
              className="ar-time-filter"
              role="group"
              aria-label="Time period"
            >
              {(
                [
                  ["all", "ALL"],
                  ["this-year", "THIS YEAR"],
                  ["last-year", "LAST YEAR"],
                ] as [TimeFilter, string][]
              ).map(([val, label]) => (
                <button
                  key={val}
                  className={`ar-time-btn${timeFilter === val ? " ar-time-btn--active" : ""}`}
                  onClick={() => setTimeFilter(val)}
                  type="button"
                >
                  {label}
                </button>
              ))}
            </div>

            {/* View toggle */}
            <div className="ar-view-toggle" role="group" aria-label="View mode">
              <button
                className={`ar-view-btn${view === "grid" ? " ar-view-btn--active" : ""}`}
                onClick={() => setView("grid")}
                type="button"
                aria-label="Grid view"
              >
                {/* Grid icon — 2×2 squares */}
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  aria-hidden="true"
                >
                  <rect x="1" y="1" width="6" height="6" fill="currentColor" />
                  <rect x="9" y="1" width="6" height="6" fill="currentColor" />
                  <rect x="1" y="9" width="6" height="6" fill="currentColor" />
                  <rect x="9" y="9" width="6" height="6" fill="currentColor" />
                </svg>
              </button>
              <button
                className={`ar-view-btn${view === "timeline" ? " ar-view-btn--active" : ""}`}
                onClick={() => setView("timeline")}
                type="button"
                aria-label="Timeline view"
              >
                {/* List icon */}
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  aria-hidden="true"
                >
                  <rect x="1" y="2" width="14" height="2" fill="currentColor" />
                  <rect x="1" y="7" width="14" height="2" fill="currentColor" />
                  <rect
                    x="1"
                    y="12"
                    width="14"
                    height="2"
                    fill="currentColor"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ── Achievement Badges ────────────────────────────────── */}
      {achievements.length > 0 && (
        <section className="ar-achievements-section" aria-label="Achievements">
          <div className="ar-achievements-inner">
            {achievements.map((badge) => (
              <div
                key={badge.key}
                className={`ar-achievement-badge ar-achievement-badge--${badge.type}`}
              >
                <div
                  className={`ar-badge-icon ar-badge-icon--${badge.type}`}
                  aria-hidden="true"
                />
                <div className="ar-badge-text">
                  <span className="ar-badge-name">{badge.name}</span>
                  <span className="ar-badge-date">{badge.date}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── Filter Bar ────────────────────────────────────────── */}
      <div className="ar-filter-bar">
        <div className="ar-filter-inner">
          {/* Search */}
          <div className="ar-search-wrap">
            <div className="ar-search-icon" aria-hidden="true" />
            <input
              type="text"
              className="ar-search-input"
              placeholder="Search campaigns..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search campaigns"
            />
          </div>

          {/* Neighborhood filter chips */}
          <div
            className="ar-filter-chips"
            role="group"
            aria-label="Filter by neighborhood"
          >
            <span className="ar-filter-label">Neighborhood:</span>
            {neighborhoods.map((nbhd) => (
              <button
                key={nbhd}
                type="button"
                className={`ar-chip${activeNeighborhood === nbhd ? " ar-chip--active" : ""}`}
                onClick={() =>
                  setActiveNeighborhood(
                    activeNeighborhood === nbhd ? null : nbhd,
                  )
                }
              >
                {nbhd}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Main Content ──────────────────────────────────────── */}
      <main className="ar-content">
        {filteredCampaigns.length === 0 ? (
          <div className="ar-empty">
            <div className="ar-empty-icon" aria-hidden="true" />
            <h2 className="ar-empty-title">No campaigns found</h2>
            <p className="ar-empty-sub">
              Try adjusting your filters or search query to find archived
              campaigns.
            </p>
          </div>
        ) : (
          groupedByYear.map(([year, campaigns]) => {
            const yearEarned = campaigns.reduce((s, c) => s + c.earnings, 0);

            // Global index offset for color assignment
            const yearGroupOffset = filteredCampaigns.indexOf(campaigns[0]);

            return (
              <div key={year} className="ar-year-group">
                {/* Year header */}
                <div className="ar-year-header">
                  <div className="ar-year-number" aria-hidden="true">
                    {year}
                  </div>
                  <div className="ar-year-meta">
                    <span className="ar-year-count">
                      {campaigns.length} campaign
                      {campaigns.length !== 1 ? "s" : ""}
                    </span>
                    <span className="ar-year-earned">
                      ${yearEarned.toLocaleString()} earned
                    </span>
                  </div>
                </div>

                {/* Grid or Timeline */}
                {view === "grid" ? (
                  <div className="ar-grid">
                    {campaigns.map((campaign, i) => (
                      <ArchiveCard
                        key={campaign.id}
                        campaign={campaign}
                        colorIdx={yearGroupOffset + i}
                      />
                    ))}
                  </div>
                ) : (
                  <div
                    className="ar-timeline"
                    role="list"
                    aria-label={`${year} campaigns`}
                  >
                    {campaigns.map((campaign, i) => (
                      <TimelineRow
                        key={campaign.id}
                        campaign={campaign}
                        colorIdx={yearGroupOffset + i}
                        delay={i * 40}
                      />
                    ))}
                  </div>
                )}
              </div>
            );
          })
        )}
      </main>
    </div>
  );
}
