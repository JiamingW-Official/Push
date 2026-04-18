"use client";

import { useState, useMemo, useCallback } from "react";
import Link from "next/link";
import "./leaderboard.css";

/* ============================================================
   Williamsburg Coffee+ Leaderboard — Week 17
   Vertical AI for Local Commerce · Customer Acquisition Engine
   ============================================================ */

type Period = "week" | "month" | "all";
type Category = "all" | "verified" | "earnings" | "streak" | "velocity";
type Tier =
  | "clay-seed"
  | "bronze-explorer"
  | "steel-operator"
  | "gold-proven"
  | "ruby-closer"
  | "obsidian-partner";

interface CreatorRow {
  id: string;
  rank: number;
  deltaRank: number; // positive = moved up
  name: string;
  handle: string;
  initials: string;
  tier: Tier;
  verifiedCustomers: number;
  earnings: number; // USD
  streak: number; // weeks
  velocity: number; // Push Score points gained this period
  isCurrentUser?: boolean;
}

interface HistoricalWinner {
  week: number;
  name: string;
  initials: string;
  tier: Tier;
  earnings: number;
  verified: number;
  headline: string;
}

/* ── Tier metadata (Design.md Tier Identity System v4.1) ─── */

const TIER_META: Record<
  Tier,
  { material: string; role: string; accent: string; text: string }
> = {
  "clay-seed": {
    material: "Clay",
    role: "Seed",
    accent: "#b8a99a",
    text: "#003049",
  },
  "bronze-explorer": {
    material: "Bronze",
    role: "Explorer",
    accent: "#8c6239",
    text: "#ffffff",
  },
  "steel-operator": {
    material: "Steel",
    role: "Operator",
    accent: "#4a5568",
    text: "#ffffff",
  },
  "gold-proven": {
    material: "Gold",
    role: "Proven",
    accent: "#c9a96e",
    text: "#003049",
  },
  "ruby-closer": {
    material: "Ruby",
    role: "Closer",
    accent: "#9b111e",
    text: "#ffffff",
  },
  "obsidian-partner": {
    material: "Obsidian",
    role: "Partner",
    accent: "#1a1a2e",
    text: "#ffffff",
  },
};

/* ── Tabs ─────────────────────────────────────────────────── */

const PERIODS: { key: Period; label: string }[] = [
  { key: "week", label: "This week" },
  { key: "month", label: "This month" },
  { key: "all", label: "All time" },
];

const CATEGORIES: { key: Category; label: string; sortBy: keyof CreatorRow }[] =
  [
    { key: "all", label: "All", sortBy: "rank" },
    {
      key: "verified",
      label: "Verified customers",
      sortBy: "verifiedCustomers",
    },
    { key: "earnings", label: "Earnings", sortBy: "earnings" },
    { key: "streak", label: "Streak", sortBy: "streak" },
    { key: "velocity", label: "Score velocity", sortBy: "velocity" },
  ];

/* ── Seed dataset — 30 creators, Williamsburg Coffee+ beachhead ─ */

const BASE_ROSTER: Omit<CreatorRow, "rank" | "deltaRank">[] = [
  {
    id: "c01",
    name: "Maya Okafor",
    handle: "mayabklyn",
    initials: "MO",
    tier: "obsidian-partner",
    verifiedCustomers: 184,
    earnings: 9120,
    streak: 14,
    velocity: 82,
  },
  {
    id: "c02",
    name: "Jordan Liang",
    handle: "jordaneats",
    initials: "JL",
    tier: "ruby-closer",
    verifiedCustomers: 162,
    earnings: 7840,
    streak: 11,
    velocity: 76,
  },
  {
    id: "c03",
    name: "Priya Venkatesan",
    handle: "priyapours",
    initials: "PV",
    tier: "ruby-closer",
    verifiedCustomers: 149,
    earnings: 6720,
    streak: 9,
    velocity: 71,
  },
  {
    id: "c04",
    name: "Theo Marchetti",
    handle: "theobklyn",
    initials: "TM",
    tier: "gold-proven",
    verifiedCustomers: 128,
    earnings: 5480,
    streak: 8,
    velocity: 64,
  },
  {
    id: "c05",
    name: "Zara Halpern",
    handle: "zaradrips",
    initials: "ZH",
    tier: "gold-proven",
    verifiedCustomers: 117,
    earnings: 5040,
    streak: 12,
    velocity: 58,
  },
  {
    id: "c06",
    name: "Dara Okonkwo",
    handle: "daragrinds",
    initials: "DO",
    tier: "gold-proven",
    verifiedCustomers: 108,
    earnings: 4620,
    streak: 6,
    velocity: 55,
  },
  {
    id: "c07",
    name: "Finn Abramowitz",
    handle: "finnbklyn",
    initials: "FA",
    tier: "gold-proven",
    verifiedCustomers: 102,
    earnings: 4280,
    streak: 7,
    velocity: 53,
  },
  {
    id: "c08",
    name: "Iris Nakamura",
    handle: "irisespresso",
    initials: "IN",
    tier: "gold-proven",
    verifiedCustomers: 94,
    earnings: 3960,
    streak: 10,
    velocity: 48,
  },
  {
    id: "c09",
    name: "Samir Bhatt",
    handle: "samirpours",
    initials: "SB",
    tier: "steel-operator",
    verifiedCustomers: 86,
    earnings: 3520,
    streak: 5,
    velocity: 44,
  },
  {
    id: "c10",
    name: "Noa Guttman",
    handle: "noabklyn",
    initials: "NG",
    tier: "steel-operator",
    verifiedCustomers: 81,
    earnings: 3320,
    streak: 8,
    velocity: 42,
  },
  {
    id: "c11",
    name: "Elias Vance",
    handle: "eliasgrinds",
    initials: "EV",
    tier: "steel-operator",
    verifiedCustomers: 76,
    earnings: 3080,
    streak: 4,
    velocity: 40,
  },
  {
    id: "c12",
    name: "Harper Zhao",
    handle: "harperpours",
    initials: "HZ",
    tier: "steel-operator",
    verifiedCustomers: 72,
    earnings: 2920,
    streak: 6,
    velocity: 38,
  },
  {
    id: "c13",
    name: "Ayaan Khurana",
    handle: "ayaanbklyn",
    initials: "AK",
    tier: "steel-operator",
    verifiedCustomers: 68,
    earnings: 2760,
    streak: 3,
    velocity: 36,
  },
  {
    id: "c14",
    name: "Cleo Fontaine",
    handle: "cleodrips",
    initials: "CF",
    tier: "steel-operator",
    verifiedCustomers: 64,
    earnings: 2580,
    streak: 9,
    velocity: 34,
  },
  {
    id: "c15",
    name: "Rafael Ortega",
    handle: "rafapours",
    initials: "RO",
    tier: "steel-operator",
    verifiedCustomers: 60,
    earnings: 2420,
    streak: 2,
    velocity: 32,
  },
  {
    id: "c16",
    name: "Tamsin Reyes",
    handle: "tamsinbklyn",
    initials: "TR",
    tier: "bronze-explorer",
    verifiedCustomers: 54,
    earnings: 2180,
    streak: 5,
    velocity: 30,
  },
  {
    id: "c17",
    name: "Quinn Hasegawa",
    handle: "quinnespresso",
    initials: "QH",
    tier: "bronze-explorer",
    verifiedCustomers: 49,
    earnings: 1960,
    streak: 4,
    velocity: 28,
  },
  {
    id: "c18",
    name: "Linus Park",
    handle: "linuspours",
    initials: "LP",
    tier: "bronze-explorer",
    verifiedCustomers: 45,
    earnings: 1800,
    streak: 3,
    velocity: 26,
  },
  {
    id: "c19",
    name: "Mira Solberg",
    handle: "mirabklyn",
    initials: "MS",
    tier: "bronze-explorer",
    verifiedCustomers: 42,
    earnings: 1680,
    streak: 7,
    velocity: 25,
  },
  {
    id: "c20",
    name: "Devon Asante",
    handle: "devondrips",
    initials: "DA",
    tier: "bronze-explorer",
    verifiedCustomers: 39,
    earnings: 1560,
    streak: 2,
    velocity: 23,
  },
  {
    id: "c21",
    name: "Hazel Romano",
    handle: "hazelgrinds",
    initials: "HR",
    tier: "bronze-explorer",
    verifiedCustomers: 36,
    earnings: 1440,
    streak: 4,
    velocity: 22,
  },
  {
    id: "c22",
    name: "Kai Brennan",
    handle: "kaibklyn",
    initials: "KB",
    tier: "bronze-explorer",
    verifiedCustomers: 33,
    earnings: 1320,
    streak: 3,
    velocity: 20,
  },
  {
    id: "c23",
    name: "Alex Chen",
    handle: "alexchenpours",
    initials: "AC",
    tier: "bronze-explorer",
    verifiedCustomers: 29,
    earnings: 1160,
    streak: 5,
    velocity: 19,
    isCurrentUser: true,
  },
  {
    id: "c24",
    name: "Sasha Molina",
    handle: "sashabklyn",
    initials: "SM",
    tier: "bronze-explorer",
    verifiedCustomers: 27,
    earnings: 1080,
    streak: 2,
    velocity: 18,
  },
  {
    id: "c25",
    name: "Reza Farahani",
    handle: "rezadrips",
    initials: "RF",
    tier: "clay-seed",
    verifiedCustomers: 22,
    earnings: 880,
    streak: 3,
    velocity: 15,
  },
  {
    id: "c26",
    name: "Juno Salazar",
    handle: "junopours",
    initials: "JS",
    tier: "clay-seed",
    verifiedCustomers: 19,
    earnings: 760,
    streak: 2,
    velocity: 14,
  },
  {
    id: "c27",
    name: "Bea Whitlock",
    handle: "beabklyn",
    initials: "BW",
    tier: "clay-seed",
    verifiedCustomers: 16,
    earnings: 640,
    streak: 1,
    velocity: 12,
  },
  {
    id: "c28",
    name: "Theo Nguyen",
    handle: "theonguyen",
    initials: "TN",
    tier: "clay-seed",
    verifiedCustomers: 14,
    earnings: 560,
    streak: 2,
    velocity: 11,
  },
  {
    id: "c29",
    name: "Marisol Ayala",
    handle: "marisolpours",
    initials: "MA",
    tier: "clay-seed",
    verifiedCustomers: 11,
    earnings: 440,
    streak: 1,
    velocity: 9,
  },
  {
    id: "c30",
    name: "Omar Dagher",
    handle: "omarbklyn",
    initials: "OD",
    tier: "clay-seed",
    verifiedCustomers: 8,
    earnings: 320,
    streak: 1,
    velocity: 7,
  },
];

// Deterministic deltaRank for this week — small variations
const DELTAS = [
  0, 1, -1, 2, 1, 0, 3, -2, 1, 4, -1, 0, 2, -3, 1, 0, 2, -1, 3, 0, -2, 1, 2, -1,
  1, 0, 2, -1, 0, 1,
];

function applyDeltas(
  rows: Omit<CreatorRow, "rank" | "deltaRank">[],
): CreatorRow[] {
  return rows.map((r, i) => ({
    ...r,
    rank: i + 1,
    deltaRank: DELTAS[i] ?? 0,
  }));
}

const HISTORICAL_WINNERS: HistoricalWinner[] = [
  {
    week: 16,
    name: "Jordan Liang",
    initials: "JL",
    tier: "ruby-closer",
    earnings: 8920,
    verified: 178,
    headline: "Rainy Monday sprint — 42 walk-ins before noon",
  },
  {
    week: 15,
    name: "Dara Okonkwo",
    initials: "DO",
    tier: "gold-proven",
    earnings: 7440,
    verified: 151,
    headline: "First Saturday over 60 verified customers",
  },
  {
    week: 14,
    name: "Maya Okafor",
    initials: "MO",
    tier: "obsidian-partner",
    earnings: 11280,
    verified: 214,
    headline: "Partner-tier record — 3 cafés in one block",
  },
  {
    week: 13,
    name: "Theo Marchetti",
    initials: "TM",
    tier: "gold-proven",
    earnings: 6780,
    verified: 139,
    headline: "Cold snap rescue for two merchants",
  },
  {
    week: 12,
    name: "Priya Venkatesan",
    initials: "PV",
    tier: "ruby-closer",
    earnings: 7120,
    verified: 144,
    headline: "Longest streak — 9 weeks top 10",
  },
  {
    week: 11,
    name: "Iris Nakamura",
    initials: "IN",
    tier: "gold-proven",
    earnings: 5340,
    verified: 112,
    headline: "Rookie week — 112 verified first pass",
  },
];

/* ── Helpers ───────────────────────────────────────────────── */

function formatUSD(n: number): string {
  if (n >= 1000) {
    const k = n / 1000;
    return `$${k.toFixed(k < 10 ? 2 : 1)}k`;
  }
  return `$${n}`;
}

function formatDelta(d: number): { text: string; symbol: string; cls: string } {
  if (d === 0) return { text: "0", symbol: "=", cls: "lb-delta--flat" };
  if (d > 0) return { text: `${d}`, symbol: "↑", cls: "lb-delta--up" };
  return { text: `${Math.abs(d)}`, symbol: "↓", cls: "lb-delta--down" };
}

/* ── Presentational bits ───────────────────────────────────── */

function TierPill({ tier, size = "sm" }: { tier: Tier; size?: "sm" | "md" }) {
  const meta = TIER_META[tier];
  return (
    <span
      className={`lb-tier-pill lb-tier-pill--${size}`}
      style={{ background: meta.accent, color: meta.text }}
    >
      <span className="lb-tier-pill-material">{meta.material}</span>
      <span className="lb-tier-pill-dot" aria-hidden="true">
        ·
      </span>
      <span className="lb-tier-pill-role">{meta.role}</span>
    </span>
  );
}

function DeltaArrow({ delta }: { delta: number }) {
  const { text, symbol, cls } = formatDelta(delta);
  return (
    <span className={`lb-delta ${cls}`} aria-label={`Change ${symbol} ${text}`}>
      <span className="lb-delta-symbol" aria-hidden="true">
        {symbol}
      </span>
      <span className="lb-delta-num">{text}</span>
    </span>
  );
}

/* ── Podium ───────────────────────────────────────────────── */

function PodiumCard({
  entry,
  position,
}: {
  entry: CreatorRow;
  position: 1 | 2 | 3;
}) {
  const posLabel =
    position === 1 ? "first" : position === 2 ? "second" : "third";
  return (
    <article
      className={`lb-podium-card lb-podium-card--${posLabel}`}
      aria-label={`Rank ${position}: ${entry.name}`}
    >
      {position === 1 && (
        <span className="lb-podium-crown" aria-hidden="true">
          ♕
        </span>
      )}
      <div className="lb-podium-rank-num">{position}</div>
      <div className="lb-podium-rank-ord">
        {position === 1 ? "st" : position === 2 ? "nd" : "rd"}
      </div>

      <div className="lb-podium-avatar">{entry.initials}</div>
      <h3 className="lb-podium-name" title={entry.name}>
        {entry.name}
      </h3>
      <div className="lb-podium-handle">@{entry.handle}</div>
      <div className="lb-podium-tier">
        <TierPill tier={entry.tier} size={position === 1 ? "md" : "sm"} />
      </div>

      <div className="lb-podium-bignum">
        <span className="lb-podium-bignum-val">{entry.verifiedCustomers}</span>
        <span className="lb-podium-bignum-lbl">verified customers</span>
      </div>

      <dl className="lb-podium-stats">
        <div className="lb-podium-stat">
          <dt>Earnings</dt>
          <dd>{formatUSD(entry.earnings)}</dd>
        </div>
        <div className="lb-podium-stat">
          <dt>Streak</dt>
          <dd>{entry.streak}w</dd>
        </div>
        <div className="lb-podium-stat">
          <dt>Velocity</dt>
          <dd>+{entry.velocity}</dd>
        </div>
      </dl>
    </article>
  );
}

/* ── Main Page ────────────────────────────────────────────── */

const WEEK_NUMBER = 17;

export default function LeaderboardPage() {
  const [period, setPeriod] = useState<Period>("week");
  const [category, setCategory] = useState<Category>("all");

  const baseRows = useMemo(() => applyDeltas(BASE_ROSTER), []);

  // Re-sort and re-rank based on category
  const rows = useMemo(() => {
    const cfg = CATEGORIES.find((c) => c.key === category);
    if (!cfg || cfg.key === "all") return baseRows;
    const sortKey = cfg.sortBy;
    const sorted = [...baseRows].sort(
      (a, b) => (b[sortKey] as number) - (a[sortKey] as number),
    );
    return sorted.map((r, i) => ({ ...r, rank: i + 1 }));
  }, [baseRows, category]);

  // Scale numbers per period for realism
  const displayRows: CreatorRow[] = useMemo(() => {
    const mul = period === "week" ? 1 : period === "month" ? 4.1 : 18.6;
    return rows.map((r) => ({
      ...r,
      verifiedCustomers: Math.round(r.verifiedCustomers * mul),
      earnings: Math.round(r.earnings * mul),
    }));
  }, [rows, period]);

  const top3 = displayRows.slice(0, 3);
  const remaining = displayRows.slice(3);
  const currentUser = displayRows.find((r) => r.isCurrentUser);
  const topTenCutoff = displayRows[9]?.verifiedCustomers ?? 0;
  const spotsToTopTen =
    currentUser && currentUser.rank > 10
      ? Math.max(
          0,
          displayRows[19].verifiedCustomers - currentUser.verifiedCustomers + 1,
        )
      : 0;

  const handleSelectPeriod = useCallback((p: Period) => setPeriod(p), []);
  const handleSelectCategory = useCallback((c: Category) => setCategory(c), []);

  return (
    <div className="lb">
      {/* ── Top Nav ────────────────────────────────────────── */}
      <nav className="lb-nav" aria-label="Creator navigation">
        <Link href="/" className="lb-nav-logo">
          Push
        </Link>
        <div className="lb-nav-sep" aria-hidden="true" />
        <span className="lb-nav-label">Leaderboard</span>
        <div className="lb-nav-spacer" />
        <Link href="/creator/dashboard" className="lb-nav-back">
          Dashboard
        </Link>
      </nav>

      {/* ── Hero ───────────────────────────────────────────── */}
      <section className="lb-hero">
        <div className="lb-hero-inner">
          <div className="lb-hero-eyebrow">LEADERBOARD</div>
          <h1 className="lb-hero-title">
            Williamsburg Coffee+
            <br />
            <span className="lb-hero-title-sub">
              Leaderboard · Week {WEEK_NUMBER}.
            </span>
          </h1>
          <p className="lb-hero-deck">
            Vertical AI for Local Commerce — 30 creators, one neighborhood,
            every walk-in verified by ConversionOracle&trade;.
          </p>
        </div>
      </section>

      {/* ── Prize Pool Banner ──────────────────────────────── */}
      <section className="lb-prize-banner" aria-label="Weekly prize pool">
        <div className="lb-prize-inner">
          <div className="lb-prize-left">
            <span className="lb-prize-eyebrow">Weekly prize pool</span>
            <h2 className="lb-prize-title">
              Top 10 split <span className="lb-prize-amount">$500</span> in
              Williamsburg Coffee+ merchant credits.
            </h2>
          </div>
          <div className="lb-prize-right" aria-live="polite">
            <span className="lb-prize-countdown-lbl">Week ends in</span>
            <span className="lb-prize-countdown">
              <span className="lb-prize-num">3</span>
              <span className="lb-prize-unit">d</span>
              <span className="lb-prize-num">14</span>
              <span className="lb-prize-unit">h</span>
            </span>
          </div>
        </div>
      </section>

      {/* ── Main content ──────────────────────────────────── */}
      <div className="lb-layout">
        <div className="lb-main">
          {/* Period tabs (pill) */}
          <nav className="lb-pills" aria-label="Period">
            <span className="lb-pills-label">Period</span>
            {PERIODS.map((p) => (
              <button
                key={p.key}
                type="button"
                className={`lb-pill${period === p.key ? " lb-pill--active" : ""}`}
                onClick={() => handleSelectPeriod(p.key)}
                aria-pressed={period === p.key}
              >
                {p.label}
              </button>
            ))}
          </nav>

          {/* Category tabs (pill) */}
          <nav className="lb-pills" aria-label="Category">
            <span className="lb-pills-label">Category</span>
            {CATEGORIES.map((c) => (
              <button
                key={c.key}
                type="button"
                className={`lb-pill${category === c.key ? " lb-pill--active" : ""}`}
                onClick={() => handleSelectCategory(c.key)}
                aria-pressed={category === c.key}
              >
                {c.label}
              </button>
            ))}
          </nav>

          {/* Top 3 Podium */}
          <section aria-label="Top 3 creators">
            <div className="lb-podium">
              <PodiumCard entry={top3[1]} position={2} />
              <PodiumCard entry={top3[0]} position={1} />
              <PodiumCard entry={top3[2]} position={3} />
            </div>
          </section>

          {/* Full ranking table */}
          <section className="lb-table-section" aria-label="Full ranking">
            <header className="lb-table-title-row">
              <h2 className="lb-table-title">Full ranking</h2>
              <span className="lb-table-count">
                {displayRows.length} creators · Week {WEEK_NUMBER}
              </span>
            </header>

            <div className="lb-table-wrap">
              <div className="lb-table-head" role="row" aria-hidden="true">
                <div className="lb-th lb-th--rank">Rank</div>
                <div className="lb-th lb-th--creator">Creator</div>
                <div className="lb-th lb-th--tier">Tier</div>
                <div className="lb-th lb-th--num">Verified</div>
                <div className="lb-th lb-th--num">Earnings</div>
                <div className="lb-th lb-th--num">Streak</div>
                <div className="lb-th lb-th--num">Velocity</div>
              </div>

              {remaining.map((entry) => (
                <div
                  key={entry.id}
                  className={`lb-row${entry.isCurrentUser ? " lb-row--me" : ""}`}
                  role="row"
                  aria-label={
                    entry.isCurrentUser
                      ? `You, rank ${entry.rank}`
                      : `Rank ${entry.rank} ${entry.name}`
                  }
                >
                  <div className="lb-td lb-td--rank">
                    <span className="lb-rank-num">{entry.rank}</span>
                    <DeltaArrow delta={entry.deltaRank} />
                  </div>
                  <div className="lb-td lb-td--creator">
                    <span
                      className={`lb-avatar${entry.isCurrentUser ? " lb-avatar--me" : ""}`}
                      aria-hidden="true"
                    >
                      {entry.initials}
                    </span>
                    <div className="lb-creator-info">
                      <span className="lb-creator-name">
                        {entry.name}
                        {entry.isCurrentUser && (
                          <span className="lb-you-badge">You</span>
                        )}
                      </span>
                      <span className="lb-creator-handle">@{entry.handle}</span>
                    </div>
                  </div>
                  <div className="lb-td lb-td--tier">
                    <TierPill tier={entry.tier} />
                  </div>
                  <div className="lb-td lb-td--num">
                    <span className="lb-num">{entry.verifiedCustomers}</span>
                  </div>
                  <div className="lb-td lb-td--num">
                    <span className="lb-num">{formatUSD(entry.earnings)}</span>
                  </div>
                  <div className="lb-td lb-td--num">
                    <span className="lb-num">{entry.streak}w</span>
                  </div>
                  <div className="lb-td lb-td--num">
                    <span className="lb-num lb-num--velocity">
                      +{entry.velocity}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Historical winners carousel */}
          <section className="lb-winners" aria-label="Past week champions">
            <header className="lb-winners-header">
              <h2 className="lb-winners-title">Past week champions.</h2>
              <p className="lb-winners-deck">
                The Williamsburg Coffee+ Neighborhood Playbook, written by the
                creators who keep topping it.
              </p>
            </header>
            <div className="lb-winners-scroll">
              <div className="lb-winners-track">
                {HISTORICAL_WINNERS.map((w) => (
                  <article
                    key={w.week}
                    className="lb-winner-card"
                    aria-label={`Week ${w.week} champion ${w.name}`}
                  >
                    <div className="lb-winner-week">Week {w.week}</div>
                    <div
                      className="lb-winner-photo"
                      style={{ background: TIER_META[w.tier].accent }}
                    >
                      <span className="lb-winner-photo-initials">
                        {w.initials}
                      </span>
                    </div>
                    <div className="lb-winner-body">
                      <h3 className="lb-winner-name">{w.name}</h3>
                      <TierPill tier={w.tier} />
                      <p className="lb-winner-headline">{w.headline}</p>
                      <dl className="lb-winner-stats">
                        <div>
                          <dt>Earned</dt>
                          <dd>{formatUSD(w.earnings)}</dd>
                        </div>
                        <div>
                          <dt>Verified</dt>
                          <dd>{w.verified}</dd>
                        </div>
                      </dl>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>
        </div>

        {/* ── Your position sidebar ─────────────────────── */}
        {currentUser && (
          <aside
            className="lb-sidebar"
            aria-label="Your position"
            role="complementary"
          >
            <div className="lb-sidebar-sticky">
              <div className="lb-sidebar-eyebrow">Your position</div>
              <div className="lb-sidebar-rank">
                <span className="lb-sidebar-rank-hash" aria-hidden="true">
                  #
                </span>
                <span className="lb-sidebar-rank-num">{currentUser.rank}</span>
              </div>
              <div className="lb-sidebar-name">
                {currentUser.name} <span className="lb-you-badge">You</span>
              </div>
              <div className="lb-sidebar-tier">
                <TierPill tier={currentUser.tier} />
              </div>

              {currentUser.rank > 10 ? (
                <p className="lb-sidebar-callout">
                  You&rsquo;re <strong>#{currentUser.rank}</strong> — need{" "}
                  <strong>{Math.max(3, spotsToTopTen)} more verified</strong> to
                  crack <strong>top 20</strong>.
                </p>
              ) : currentUser.rank > 3 ? (
                <p className="lb-sidebar-callout">
                  You&rsquo;re <strong>#{currentUser.rank}</strong> — podium is{" "}
                  <strong>
                    {top3[2].verifiedCustomers -
                      currentUser.verifiedCustomers +
                      1}{" "}
                    verified
                  </strong>{" "}
                  away.
                </p>
              ) : (
                <p className="lb-sidebar-callout">
                  You&rsquo;re on the podium — hold it.
                </p>
              )}

              <dl className="lb-sidebar-stats">
                <div>
                  <dt>Verified</dt>
                  <dd>{currentUser.verifiedCustomers}</dd>
                </div>
                <div>
                  <dt>Earned</dt>
                  <dd>{formatUSD(currentUser.earnings)}</dd>
                </div>
                <div>
                  <dt>Streak</dt>
                  <dd>{currentUser.streak}w</dd>
                </div>
                <div>
                  <dt>Velocity</dt>
                  <dd>+{currentUser.velocity}</dd>
                </div>
              </dl>

              <div className="lb-sidebar-cta">
                <Link href="/creator/campaigns" className="lb-sidebar-cta-btn">
                  View open campaigns
                </Link>
              </div>

              <div className="lb-sidebar-foot">
                Verified by ConversionOracle&trade; walk-in ground truth.
              </div>
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}
