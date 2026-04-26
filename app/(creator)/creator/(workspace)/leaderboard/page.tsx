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
  <rect width="300" height="300" fill="var(--ink)"/>
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
  const isFirst = position === "first";
  return (
    <article
      style={{
        background: isFirst ? "var(--surface-2)" : "var(--surface)",
        border: isFirst
          ? "2px solid var(--brand-red)"
          : "1px solid var(--hairline)",
        borderRadius: 10,
        padding: "24px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 8,
        flex: 1,
        minWidth: 0,
      }}
    >
      <span
        className="eyebrow"
        style={{ color: isFirst ? "var(--brand-red)" : "var(--ink-4)" }}
      >
        {position === "first" ? "#1" : position === "second" ? "#2" : "#3"}
      </span>
      <div
        style={{
          width: 48,
          height: 48,
          borderRadius: "50%",
          background: isFirst
            ? "var(--brand-red)"
            : "var(--surface-3, #ece9e0)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "var(--font-display)",
          fontWeight: 900,
          fontSize: 20,
          color: isFirst ? "var(--snow)" : "var(--ink)",
        }}
      >
        {entry.avatarInitials}
      </div>
      <p
        style={{
          fontFamily: "var(--font-display)",
          fontWeight: 700,
          fontSize: 16,
          color: "var(--ink)",
          margin: 0,
          textAlign: "center",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          width: "100%",
        }}
        title={entry.name}
      >
        {entry.name}
      </p>
      <p
        style={{
          fontFamily: "var(--font-body)",
          fontSize: 12,
          color: "var(--ink-4)",
          margin: 0,
        }}
      >
        @{entry.handle}
      </p>
      <TierBadge tier={entry.tier} />
      <div style={{ textAlign: "center", marginTop: 4 }}>
        <p
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 900,
            fontSize: "clamp(24px,3vw,36px)",
            color: "var(--ink)",
            margin: 0,
            letterSpacing: "-0.04em",
          }}
        >
          {entry.pushScore}
        </p>
        <p className="eyebrow" style={{ color: "var(--ink-4)", margin: 0 }}>
          PUSH SCORE
        </p>
      </div>
      <div
        style={{
          display: "flex",
          gap: 16,
          marginTop: 8,
          borderTop: "1px solid var(--hairline)",
          paddingTop: 12,
          width: "100%",
          justifyContent: "center",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <p
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: 18,
              color: "var(--ink)",
              margin: 0,
            }}
          >
            {entry.verifiedVisits}
          </p>
          <p className="eyebrow" style={{ color: "var(--ink-4)", margin: 0 }}>
            VISITS
          </p>
        </div>
        <div style={{ textAlign: "center" }}>
          <p
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: 18,
              color: "var(--ink)",
              margin: 0,
            }}
          >
            {formatEarnings(entry.earningsWindow)}
          </p>
          <p className="eyebrow" style={{ color: "var(--ink-4)", margin: 0 }}>
            EARNED
          </p>
        </div>
      </div>
      <div
        style={{
          fontSize: 12,
          fontFamily: "var(--font-body)",
          color: "var(--ink-4)",
        }}
      >
        <span className={`lb-delta ${deltaCls}`} style={{ fontSize: 12 }}>
          {entry.deltaRank > 0 && "▲"}
          {entry.deltaRank < 0 && "▼"} {deltaText}
        </span>
        <span style={{ marginLeft: 6 }}>vs last period</span>
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
      style={{
        display: "grid",
        gridTemplateColumns: "48px 1fr 80px 64px 80px 64px",
        alignItems: "center",
        gap: 0,
        padding: "12px 16px",
        borderBottom: "1px solid var(--hairline)",
        background: entry.isCurrentUser ? "var(--surface-2)" : "transparent",
        borderRadius: entry.isCurrentUser ? 8 : 0,
      }}
      aria-label={
        entry.isCurrentUser
          ? `Your rank: #${entry.rank}`
          : `Rank ${entry.rank}: ${entry.name}`
      }
    >
      {/* Rank */}
      <div>
        <span
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: isTop10 ? 900 : 700,
            fontSize: isTop10 ? 18 : 14,
            color: isTop10 ? "var(--ink)" : "var(--ink-4)",
          }}
        >
          {entry.rank}
        </span>
      </div>

      {/* Creator */}
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: "50%",
            background: entry.isCurrentUser
              ? "var(--brand-red)"
              : "var(--surface-3, #ece9e0)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "var(--font-display)",
            fontWeight: 700,
            fontSize: 13,
            color: entry.isCurrentUser ? "var(--snow)" : "var(--ink)",
            flexShrink: 0,
          }}
        >
          {entry.avatarInitials}
        </div>
        <div style={{ minWidth: 0 }}>
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: 14,
              fontWeight: 600,
              color: "var(--ink)",
              margin: 0,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {entry.name}
            {entry.isCurrentUser && (
              <span
                style={{
                  marginLeft: 6,
                  fontSize: 10,
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  color: "var(--brand-red)",
                }}
              >
                You
              </span>
            )}
          </p>
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: 11,
              color: "var(--ink-4)",
              margin: 0,
            }}
          >
            @{entry.handle}
          </p>
        </div>
        <TierBadge tier={entry.tier} />
      </div>

      {/* Push Score */}
      <div style={{ textAlign: "right" }}>
        <span
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 700,
            fontSize: 14,
            color: "var(--ink)",
          }}
        >
          {entry.pushScore}
        </span>
      </div>

      {/* Verified Visits */}
      <div
        style={{
          textAlign: "right",
          fontFamily: "var(--font-body)",
          fontSize: 13,
          color: "var(--ink-3)",
        }}
      >
        {entry.verifiedVisits}
      </div>

      {/* Earnings */}
      <div
        style={{
          textAlign: "right",
          fontFamily: "var(--font-body)",
          fontSize: 13,
          color: "var(--ink)",
        }}
      >
        {formatEarnings(entry.earningsWindow)}
      </div>

      {/* Delta */}
      <div style={{ textAlign: "right" }}>
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
    <div className="cw-page">
      <header className="cw-header">
        <div className="cw-header__left">
          <p className="cw-eyebrow cw-eyebrow--live">CREATOR RANKINGS · NYC</p>
          <h1 className="cw-title">Leaderboard</h1>
        </div>
        {currentUser && (
          <div className="cw-header__right">
            <span className="cw-date">
              YOUR RANK · #{currentUser.rank} of{" "}
              {MOCK_BY_WINDOW[window].totalCreators.toLocaleString()}
            </span>
            <span className="cw-pill cw-pill--urgent">
              ▲ #{currentUser.rank}
            </span>
          </div>
        )}
      </header>

      <div ref={contentRef}>
        {/* Time window + neighborhood filters */}
        <div
          style={{
            display: "flex",
            gap: 8,
            marginBottom: 24,
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          {TIME_WINDOWS.map(({ key, label }) => (
            <button
              key={key}
              className={`btn-ghost click-shift${window === key ? " btn-primary" : ""}`}
              style={{
                padding: "6px 16px",
                fontSize: 13,
                borderRadius: 8,
              }}
              onClick={() => handleTabChange(key)}
              aria-pressed={window === key}
            >
              {label}
            </button>
          ))}

          <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
            {NEIGHBORHOOD_FILTERS.slice(0, 5).map(({ key, label }) => (
              <button
                key={key}
                className={`btn-ghost click-shift${neighborhoodFilter === key ? " btn-secondary" : ""}`}
                style={{ padding: "6px 14px", fontSize: 12, borderRadius: 8 }}
                onClick={() =>
                  setNeighborhoodFilter(key as NeighborhoodKey | "all")
                }
                aria-pressed={neighborhoodFilter === key}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Top 3 podium */}
        {top3.length >= 3 && (
          <section aria-label="Top 3 creators" style={{ marginBottom: 32 }}>
            <p
              className="eyebrow"
              style={{ color: "var(--ink-4)", marginBottom: 16 }}
            >
              TOP 3
            </p>
            <div
              style={{
                display: "flex",
                gap: 16,
                alignItems: "flex-end",
              }}
            >
              {/* Render order: 2nd, 1st, 3rd — for visual podium height */}
              <PodiumCard entry={top3[1]} position="second" />
              <PodiumCard entry={top3[0]} position="first" />
              <PodiumCard entry={top3[2]} position="third" />
            </div>
          </section>
        )}

        {/* Tier filter chips */}
        <div
          style={{
            display: "flex",
            gap: 8,
            alignItems: "center",
            marginBottom: 16,
            flexWrap: "wrap",
          }}
          role="group"
          aria-label="Filter by tier"
        >
          <span
            className="eyebrow"
            style={{ color: "var(--ink-4)", marginRight: 4 }}
          >
            TIER
          </span>
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
        <section
          aria-label="Full leaderboard"
          style={{
            background: "var(--surface-2)",
            border: "1px solid var(--hairline)",
            borderRadius: 10,
            overflow: "hidden",
            marginBottom: 32,
          }}
        >
          {/* Column headers */}
          <div
            aria-hidden="true"
            style={{
              display: "grid",
              gridTemplateColumns: "48px 1fr 80px 64px 80px 64px",
              gap: 0,
              padding: "10px 16px",
              borderBottom: "1px solid var(--hairline)",
              background: "var(--surface)",
            }}
          >
            {["Rank", "Creator", "Score", "Visits", "Earned", "Delta"].map(
              (h, i) => (
                <span
                  key={h}
                  className="eyebrow"
                  style={{
                    color: "var(--ink-4)",
                    textAlign: i >= 2 ? "right" : "left",
                  }}
                >
                  {h}
                </span>
              ),
            )}
          </div>

          {/* Ranks 4+ */}
          {tableEntries.length === 0 ? (
            <div
              style={{
                padding: "48px 24px",
                textAlign: "center",
              }}
            >
              <p
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 700,
                  fontSize: 18,
                  color: "var(--ink)",
                  margin: "0 0 8px",
                }}
              >
                No creators found
              </p>
              <p
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: 13,
                  color: "var(--ink-4)",
                  margin: 0,
                }}
              >
                Try adjusting the tier or neighborhood filter.
              </p>
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
        </section>

        {/* Share badge section */}
        {currentUser && (
          <section
            aria-label="Share your rank"
            style={{
              background: "var(--surface-2)",
              border: "1px solid var(--hairline)",
              borderRadius: 10,
              padding: "24px",
              display: "flex",
              gap: 32,
              alignItems: "center",
              marginBottom: 32,
            }}
          >
            {/* Badge preview */}
            <div
              aria-hidden="true"
              style={{
                width: 96,
                height: 96,
                background: "var(--ink)",
                borderRadius: 10,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 4,
                flexShrink: 0,
              }}
            >
              <p
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 900,
                  fontSize: 28,
                  color: "var(--brand-red)",
                  margin: 0,
                  letterSpacing: "-0.04em",
                }}
              >
                #{currentUser.rank}
              </p>
              <p
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: 9,
                  color: "rgba(245,242,236,0.5)",
                  margin: 0,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                }}
              >
                Push Score
              </p>
              <p
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 900,
                  fontSize: 16,
                  color: "var(--snow)",
                  margin: 0,
                }}
              >
                {currentUser.pushScore}
              </p>
            </div>

            <div style={{ flex: 1 }}>
              <p
                className="eyebrow"
                style={{ color: "var(--ink-4)", marginBottom: 8 }}
              >
                SHARE YOUR RANK
              </p>
              <h3
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 700,
                  fontSize: 20,
                  color: "var(--ink)",
                  margin: "0 0 8px",
                }}
              >
                Share your rank.
              </h3>
              <p
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: 13,
                  color: "var(--ink-3)",
                  margin: "0 0 16px",
                }}
              >
                You&apos;re #{currentUser.rank} of{" "}
                {MOCK_BY_WINDOW[window].totalCreators.toLocaleString()} creators
                in NYC. Download your rank badge and share it on Instagram.
              </p>
              <button
                className="btn-primary click-shift"
                onClick={handleDownloadBadge}
              >
                Download Badge (SVG)
              </button>
            </div>
          </section>
        )}
      </div>

      {/* Sticky "Your Rank" bar */}
      {currentUser && (
        <div
          role="status"
          aria-live="polite"
          style={{
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
            background: "var(--ink)",
            borderTop: "1px solid rgba(245,242,236,0.1)",
            padding: "12px 32px",
            display: "flex",
            alignItems: "center",
            gap: 16,
            zIndex: 40,
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 900,
              fontSize: 20,
              color: "var(--brand-red)",
              letterSpacing: "-0.04em",
            }}
          >
            #{currentUser.rank}
          </span>
          <div
            style={{
              width: 1,
              height: 24,
              background: "rgba(245,242,236,0.15)",
            }}
          />
          <div style={{ flex: 1 }}>
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: 13,
                color: "var(--snow)",
                margin: 0,
              }}
            >
              You&apos;re #{currentUser.rank} &middot; {currentUser.name}
            </p>
            {catchupInfo && catchupInfo.visitDiff > 0 ? (
              <p
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: 11,
                  color: "rgba(245,242,236,0.5)",
                  margin: 0,
                }}
              >
                {catchupInfo.visitDiff} visit
                {catchupInfo.visitDiff !== 1 ? "s" : ""} from catching up to #
                {catchupInfo.aboveRank} ({catchupInfo.aboveName.split(" ")[0]})
              </p>
            ) : catchupInfo && catchupInfo.visitDiff <= 0 ? (
              <p
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: 11,
                  color: "rgba(245,242,236,0.5)",
                  margin: 0,
                }}
              >
                Ahead of #{catchupInfo.aboveRank} — keep going
              </p>
            ) : (
              <p
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: 11,
                  color: "rgba(245,242,236,0.5)",
                  margin: 0,
                }}
              >
                Top of the leaderboard
              </p>
            )}
          </div>
          <div style={{ textAlign: "right" }}>
            <p
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 900,
                fontSize: 18,
                color: "var(--snow)",
                margin: 0,
              }}
            >
              {currentUser.pushScore}
            </p>
            <p
              className="eyebrow"
              style={{ color: "rgba(245,242,236,0.4)", margin: 0 }}
            >
              SCORE
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
