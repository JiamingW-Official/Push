"use client";

import { useState, useMemo, useCallback, useRef } from "react";
import Link from "next/link";
import "./leaderboard.css";
import {
  MOCK_BY_WINDOW,
  NEIGHBORHOOD_LABELS,
  type TimeWindow,
  type CreatorTier,
  type NeighborhoodKey,
  type RankEntry,
} from "@/lib/leaderboard/mock-rankings";

/* ── Constants ──────────────────────────────────────────── */

const TIME_WINDOWS: { key: TimeWindow; label: string }[] = [
  { key: "7d", label: "This week" },
  { key: "30d", label: "This month" },
  { key: "all", label: "All time" },
];

const TIER_FILTERS: { key: CreatorTier | "all"; label: string }[] = [
  { key: "all", label: "All tiers" },
  { key: "seed", label: "Seed" },
  { key: "explorer", label: "Explorer" },
  { key: "operator", label: "Operator" },
  { key: "proven", label: "Proven" },
  { key: "closer", label: "Closer" },
  { key: "partner", label: "Partner" },
];

const NEIGHBORHOOD_FILTERS: { key: NeighborhoodKey | "all"; label: string }[] =
  [
    { key: "all", label: "All NYC" },
    ...Object.entries(NEIGHBORHOOD_LABELS).map(([k, v]) => ({
      key: k as NeighborhoodKey,
      label: v,
    })),
  ];

/* ── Helpers ─────────────────────────────────────────────── */

function formatEarnings(n: number): string {
  if (n === 0) return "$0";
  if (n >= 1000) return `$${(n / 1000).toFixed(1)}k`;
  return `$${n}`;
}

function formatDelta(delta: number): { text: string; cls: string } {
  if (delta === 0) return { text: "—", cls: "lb-delta--flat" };
  if (delta > 0) return { text: `+${delta}`, cls: "lb-delta--up" };
  return { text: `${delta}`, cls: "lb-delta--down" };
}

function generateBadgeSVG(rank: number, name: string, score: number): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300" viewBox="0 0 300 300">
  <rect width="300" height="300" fill="#003049"/>
  <rect x="0" y="0" width="6" height="300" fill="#c1121f"/>
  <text x="24" y="120" font-family="sans-serif" font-size="96" font-weight="900" fill="#c9a96e" letter-spacing="-4">#${rank}</text>
  <text x="24" y="160" font-family="monospace" font-size="14" fill="rgba(245,242,236,0.55)" letter-spacing="2">PUSH SCORE</text>
  <text x="24" y="190" font-family="sans-serif" font-size="32" font-weight="900" fill="#f5f2ec" letter-spacing="-1">${score}</text>
  <text x="24" y="240" font-family="monospace" font-size="12" fill="rgba(245,242,236,0.4)">${name}</text>
  <text x="24" y="275" font-family="sans-serif" font-size="18" font-weight="900" font-style="italic" fill="#c1121f" letter-spacing="-1">Push</text>
</svg>`;
  return svg;
}

function downloadBadge(rank: number, name: string, score: number): void {
  const svg = generateBadgeSVG(rank, name, score);
  const blob = new Blob([svg], { type: "image/svg+xml" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `push-rank-${rank}-badge.svg`;
  a.click();
  URL.revokeObjectURL(url);
}

/* ── Sub-components ──────────────────────────────────────── */

function TierBadge({ tier }: { tier: CreatorTier }) {
  return (
    <span className={`lb-tier-badge lb-tier-badge--${tier}`}>
      {tier.charAt(0).toUpperCase() + tier.slice(1)}
    </span>
  );
}

function DeltaCell({ delta }: { delta: number }) {
  const { text, cls } = formatDelta(delta);
  return (
    <span className={`lb-delta ${cls}`}>
      {delta > 0 && <span aria-hidden="true">▲</span>}
      {delta < 0 && <span aria-hidden="true">▼</span>}
      {text}
    </span>
  );
}

interface PodiumCardProps {
  entry: RankEntry;
  position: "first" | "second" | "third";
}

function PodiumCard({ entry, position }: PodiumCardProps) {
  const { text: deltaText, cls: deltaCls } = formatDelta(entry.deltaRank);
  return (
    <article className={`lb-podium-card lb-podium-card--${position}`}>
      <div className={`lb-podium-rank`}>
        {position === "first" ? "#1" : position === "second" ? "#2" : "#3"}
      </div>
      <div className="lb-podium-avatar">{entry.avatarInitials}</div>
      <div className="lb-podium-name" title={entry.name}>
        {entry.name}
      </div>
      <div className="lb-podium-handle">@{entry.handle}</div>
      <TierBadge tier={entry.tier} />
      <div style={{ marginTop: 12 }}>
        <div className="lb-podium-score">{entry.pushScore}</div>
        <div className="lb-podium-score-label">Push Score</div>
      </div>
      <div className="lb-podium-stats">
        <div className="lb-podium-stat">
          <span className="lb-podium-stat-val">{entry.verifiedVisits}</span>
          <span className="lb-podium-stat-lbl">Visits</span>
        </div>
        <div className="lb-podium-stat">
          <span className="lb-podium-stat-val">
            {formatEarnings(entry.earningsWindow)}
          </span>
          <span className="lb-podium-stat-lbl">Earned</span>
        </div>
      </div>
      <div style={{ marginTop: 8, fontSize: 12, color: "var(--text-muted)" }}>
        <span className={`lb-delta ${deltaCls}`} style={{ fontSize: 12 }}>
          {entry.deltaRank > 0 && "▲"}
          {entry.deltaRank < 0 && "▼"} {deltaText}
        </span>
        <span style={{ marginLeft: 6, color: "var(--text-muted)" }}>
          vs last period
        </span>
      </div>
    </article>
  );
}

interface LeaderboardRowProps {
  entry: RankEntry;
  isTop10: boolean;
}

function LeaderboardRow({ entry, isTop10 }: LeaderboardRowProps) {
  return (
    <div
      className={`lb-row${entry.isCurrentUser ? " lb-row--me" : ""}`}
      aria-label={
        entry.isCurrentUser
          ? `Your rank: #${entry.rank}`
          : `Rank ${entry.rank}: ${entry.name}`
      }
    >
      {/* Rank */}
      <div className="lb-row-rank">
        <span
          className={`lb-rank-num ${isTop10 ? "lb-rank-num--top10" : "lb-rank-num--normal"}`}
        >
          {entry.rank}
        </span>
      </div>

      {/* Creator */}
      <div className="lb-row-creator">
        <div
          className="lb-creator-avatar"
          style={
            entry.isCurrentUser ? { background: "var(--primary)" } : undefined
          }
        >
          {entry.avatarInitials}
        </div>
        <div className="lb-creator-info">
          <span className="lb-creator-name">
            {entry.name}
            {entry.isCurrentUser && (
              <span
                style={{
                  marginLeft: 6,
                  fontSize: 10,
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  color: "var(--primary)",
                }}
              >
                You
              </span>
            )}
          </span>
          <span className="lb-creator-handle">@{entry.handle}</span>
          <TierBadge tier={entry.tier} />
        </div>
      </div>

      {/* Push Score */}
      <div className="lb-row-score">
        <span className="lb-score-val">{entry.pushScore}</span>
        <span className="lb-score-label">score</span>
      </div>

      {/* Verified Visits */}
      <div className="lb-row-visits">{entry.verifiedVisits}</div>

      {/* Earnings */}
      <div className="lb-row-earnings">
        {formatEarnings(entry.earningsWindow)}
      </div>

      {/* Delta */}
      <div className="lb-row-delta">
        <DeltaCell delta={entry.deltaRank} />
      </div>
    </div>
  );
}

/* ── Main Page ───────────────────────────────────────────── */

export default function LeaderboardPage() {
  const [window, setWindow] = useState<TimeWindow>("7d");
  const [tierFilter, setTierFilter] = useState<CreatorTier | "all">("all");
  const [neighborhoodFilter, setNeighborhoodFilter] = useState<
    NeighborhoodKey | "all"
  >("all");

  const contentRef = useRef<HTMLDivElement>(null);

  // Derive entries from mock data + filters
  const allEntries = useMemo(() => MOCK_BY_WINDOW[window].entries, [window]);

  const filteredEntries = useMemo(() => {
    let result = allEntries;
    if (tierFilter !== "all") {
      result = result.filter((e) => e.tier === tierFilter);
    }
    if (neighborhoodFilter !== "all") {
      result = result.filter((e) => e.neighborhood === neighborhoodFilter);
    }
    // Re-rank within filtered set
    return result.map((e, i) => ({ ...e, rank: i + 1 }));
  }, [allEntries, tierFilter, neighborhoodFilter]);

  const top3 = useMemo(() => filteredEntries.slice(0, 3), [filteredEntries]);
  const tableEntries = useMemo(
    () => filteredEntries.slice(3),
    [filteredEntries],
  );

  // Current user — always Alex Chen at index 10 in raw data
  const currentUser = useMemo(
    () => filteredEntries.find((e) => e.isCurrentUser) ?? null,
    [filteredEntries],
  );

  // Catch-up info: how many visits to pass the person above
  const catchupInfo = useMemo(() => {
    if (!currentUser) return null;
    const above = filteredEntries.find((e) => e.rank === currentUser.rank - 1);
    if (!above) return null;
    const diff = above.verifiedVisits - currentUser.verifiedVisits;
    return { aboveRank: above.rank, aboveName: above.name, visitDiff: diff };
  }, [currentUser, filteredEntries]);

  const handleTabChange = useCallback((w: TimeWindow) => {
    setWindow(w);
  }, []);

  const handleDownloadBadge = useCallback(() => {
    if (!currentUser) return;
    downloadBadge(currentUser.rank, currentUser.name, currentUser.pushScore);
  }, [currentUser]);

  return (
    <div className="lb">
      {/* ── Nav ───────────────────────────────────────────── */}
      <nav className="lb-nav">
        <Link href="/" className="lb-nav-logo">
          Push
        </Link>
        <div className="lb-nav-sep" />
        <span className="lb-nav-label">Leaderboard</span>
        <div className="lb-nav-spacer" />
        <Link href="/creator/dashboard" className="lb-nav-back">
          Dashboard
        </Link>
      </nav>

      {/* ── Hero ──────────────────────────────────────────── */}
      <section className="lb-hero">
        <div className="lb-hero-inner">
          <div className="lb-hero-eyebrow">Creator Rankings · NYC</div>
          <h1 className="lb-hero-title">Top this week.</h1>
          <div className="lb-hero-meta">
            {currentUser ? (
              <>
                <div className="lb-hero-rank">#{currentUser.rank}</div>
                <div className="lb-hero-rank-label">your rank</div>
                <div className="lb-hero-divider" />
                <div className="lb-hero-total">
                  of {MOCK_BY_WINDOW[window].totalCreators.toLocaleString()}{" "}
                  creators
                </div>
              </>
            ) : (
              <div className="lb-hero-total">
                {MOCK_BY_WINDOW[window].totalCreators.toLocaleString()} creators
                ranked
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── Content ───────────────────────────────────────── */}
      <div className="lb-content" ref={contentRef}>
        {/* Time window tabs */}
        <nav className="lb-tabs" aria-label="Time window">
          {TIME_WINDOWS.map(({ key, label }) => (
            <button
              key={key}
              className={`lb-tab${window === key ? " lb-tab--active" : ""}`}
              onClick={() => handleTabChange(key)}
              aria-pressed={window === key}
            >
              {label}
            </button>
          ))}
          {/* Neighborhood tab group */}
          <div
            style={{
              marginLeft: "auto",
              display: "flex",
              gap: 0,
            }}
          >
            {NEIGHBORHOOD_FILTERS.slice(0, 5).map(({ key, label }) => (
              <button
                key={key}
                className={`lb-tab${neighborhoodFilter === key ? " lb-tab--active" : ""}`}
                onClick={() =>
                  setNeighborhoodFilter(key as NeighborhoodKey | "all")
                }
                aria-pressed={neighborhoodFilter === key}
              >
                {label}
              </button>
            ))}
          </div>
        </nav>

        {/* Top 3 podium */}
        {top3.length >= 3 && (
          <section aria-label="Top 3 creators">
            <div className="lb-podium">
              {/* Render order: 2nd, 1st, 3rd — for visual podium height */}
              <PodiumCard entry={top3[1]} position="second" />
              <PodiumCard entry={top3[0]} position="first" />
              <PodiumCard entry={top3[2]} position="third" />
            </div>
          </section>
        )}

        {/* Tier filter chips */}
        <div
          className="lb-tier-filters"
          role="group"
          aria-label="Filter by tier"
        >
          <span className="lb-tier-filter-label">Tier</span>
          {TIER_FILTERS.map(({ key, label }) => (
            <button
              key={key}
              className={`lb-tier-chip lb-tier-chip--${key}${tierFilter === key ? " lb-tier-chip--active" : ""}`}
              onClick={() => setTierFilter(key as CreatorTier | "all")}
              aria-pressed={tierFilter === key}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Leaderboard table */}
        <section aria-label="Full leaderboard">
          <div className="lb-table-wrap">
            {/* Column headers */}
            <div className="lb-table-head" aria-hidden="true">
              <div className="lb-table-head-cell">Rank</div>
              <div className="lb-table-head-cell">Creator</div>
              <div
                className="lb-table-head-cell"
                style={{ textAlign: "right" }}
              >
                Score
              </div>
              <div
                className="lb-table-head-cell"
                style={{ textAlign: "right" }}
              >
                Visits
              </div>
              <div
                className="lb-table-head-cell"
                style={{ textAlign: "right" }}
              >
                Earned
              </div>
              <div
                className="lb-table-head-cell"
                style={{ textAlign: "right" }}
              >
                Delta
              </div>
            </div>

            {/* Ranks 4+ */}
            {tableEntries.length === 0 ? (
              <div className="lb-empty">
                <div className="lb-empty-title">No creators found</div>
                <p>Try adjusting the tier or neighborhood filter.</p>
              </div>
            ) : (
              tableEntries.map((entry) => (
                <LeaderboardRow
                  key={entry.creatorId}
                  entry={entry}
                  isTop10={entry.rank <= 10}
                />
              ))
            )}
          </div>
        </section>

        {/* Share badge section */}
        {currentUser && (
          <section className="lb-share-section" aria-label="Share your rank">
            <div className="lb-share-badge-preview" aria-hidden="true">
              <div className="lb-share-badge-rank">#{currentUser.rank}</div>
              <div className="lb-share-badge-label">Push Score</div>
              <div
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: 20,
                  fontWeight: 900,
                  color: "var(--champagne)",
                  letterSpacing: "-0.04em",
                }}
              >
                {currentUser.pushScore}
              </div>
              <div className="lb-share-badge-logo">Push</div>
            </div>
            <div className="lb-share-info">
              <div className="lb-share-title">Share your rank.</div>
              <p className="lb-share-desc">
                You&apos;re #{currentUser.rank} of{" "}
                {MOCK_BY_WINDOW[window].totalCreators.toLocaleString()} creators
                in NYC. Download your rank badge and share it on Instagram.
              </p>
              <button className="lb-share-btn" onClick={handleDownloadBadge}>
                Download Badge (SVG)
              </button>
            </div>
          </section>
        )}
      </div>

      {/* ── Sticky "Your Rank" card ────────────────────────── */}
      {currentUser && (
        <div className="lb-sticky-you" role="status" aria-live="polite">
          <div className="lb-sticky-rank">#{currentUser.rank}</div>
          <div className="lb-sticky-sep" />
          <div className="lb-sticky-info">
            <div className="lb-sticky-name">
              You&apos;re #{currentUser.rank} · {currentUser.name}
            </div>
            {catchupInfo && catchupInfo.visitDiff > 0 ? (
              <div className="lb-sticky-catchup">
                {catchupInfo.visitDiff} visit
                {catchupInfo.visitDiff !== 1 ? "s" : ""} from catching up to #
                {catchupInfo.aboveRank} ({catchupInfo.aboveName.split(" ")[0]})
              </div>
            ) : catchupInfo && catchupInfo.visitDiff <= 0 ? (
              <div className="lb-sticky-catchup">
                Ahead of #{catchupInfo.aboveRank} — keep going
              </div>
            ) : (
              <div className="lb-sticky-catchup">Top of the leaderboard</div>
            )}
          </div>
          <div className="lb-sticky-score">
            <span className="lb-sticky-score-val">{currentUser.pushScore}</span>
            <span className="lb-sticky-score-lbl">Score</span>
          </div>
        </div>
      )}
    </div>
  );
}
