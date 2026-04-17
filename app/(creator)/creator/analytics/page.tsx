"use client";

import Link from "next/link";
import "./analytics.css";

/* ── Mock data ─────────────────────────────────────────────── */

const REACH_DATA = [
  { month: "Nov", value: 6200 },
  { month: "Dec", value: 7800 },
  { month: "Jan", value: 9100 },
  { month: "Feb", value: 8400 },
  { month: "Mar", value: 11200 },
  { month: "Apr", value: 12847 },
];

const CAMPAIGN_CONVERSIONS = [
  { name: "Blank Street", value: 87, category: "Coffee" },
  { name: "Superiority Burger", value: 142, category: "Food" },
  { name: "Flamingo Estate", value: 64, category: "Lifestyle" },
  { name: "Brow Theory", value: 98, category: "Beauty" },
  { name: "Cha Cha Matcha", value: 76, category: "Coffee" },
];

const NEIGHBORHOOD_DATA = [
  { name: "Williamsburg", value: 3240 },
  { name: "Lower East Side", value: 2810 },
  { name: "Fort Greene", value: 2190 },
  { name: "Park Slope", value: 1870 },
  { name: "Bed-Stuy", value: 1540 },
  { name: "Greenpoint", value: 1197 },
];

const TIER_CONFIG = {
  current: "Operator",
  score: 71,
  nextTier: "Proven",
  nextScore: 75,
  prevScore: 60,
};

const INSIGHTS = [
  {
    id: 1,
    headline: "Food campaigns",
    stat: "2.4×",
    context: "conversion rate vs. lifestyle",
    body: "Your food content consistently outperforms every other category. The audience trusts your taste.",
    cta: "Find food campaigns",
    ctaHref: "/creator/dashboard",
    accent: "var(--primary)",
  },
  {
    id: 2,
    headline: "Williamsburg",
    stat: "+31%",
    context: "reach vs. last month",
    body: "Your Williamsburg content is hitting. Three of your top-5 posts this month were from that neighborhood.",
    cta: "Browse nearby",
    ctaHref: "/creator/dashboard",
    accent: "var(--tertiary)",
  },
  {
    id: 3,
    headline: "4 points",
    stat: "75",
    context: "to reach Proven tier",
    body: "One strong campaign away from unlocking higher-paying spots and exclusive merchant partnerships.",
    cta: "See what unlocks",
    ctaHref: "/creator/profile",
    accent: "var(--champagne)",
  },
];

/* ── SVG helpers ────────────────────────────────────────────── */

function LineChart({
  data,
  width = 600,
  height = 160,
}: {
  data: { month: string; value: number }[];
  width?: number;
  height?: number;
}) {
  const pad = { top: 16, right: 16, bottom: 32, left: 48 };
  const innerW = width - pad.left - pad.right;
  const innerH = height - pad.top - pad.bottom;
  const maxVal = Math.max(...data.map((d) => d.value));
  const minVal = Math.min(...data.map((d) => d.value));
  const range = maxVal - minVal || 1;

  const points = data.map((d, i) => ({
    x: pad.left + (i / (data.length - 1)) * innerW,
    y: pad.top + (1 - (d.value - minVal) / range) * innerH,
    ...d,
  }));

  const pathD = points
    .map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(1)},${p.y.toFixed(1)}`)
    .join(" ");

  const areaD =
    pathD +
    ` L${points[points.length - 1].x.toFixed(1)},${(pad.top + innerH).toFixed(1)}` +
    ` L${points[0].x.toFixed(1)},${(pad.top + innerH).toFixed(1)} Z`;

  // Y axis labels
  const yTicks = [minVal, Math.round((minVal + maxVal) / 2), maxVal];

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      width="100%"
      height={height}
      aria-label="Reach over time"
    >
      {/* Area fill */}
      <path d={areaD} fill="var(--primary)" fillOpacity="0.06" />

      {/* Grid lines */}
      {yTicks.map((tick) => {
        const y = pad.top + (1 - (tick - minVal) / range) * innerH;
        return (
          <g key={tick}>
            <line
              x1={pad.left}
              y1={y}
              x2={pad.left + innerW}
              y2={y}
              stroke="var(--line)"
              strokeWidth="1"
            />
            <text
              x={pad.left - 8}
              y={y + 4}
              textAnchor="end"
              fontSize="10"
              fontFamily="var(--font-body)"
              fill="var(--graphite)"
            >
              {tick >= 1000 ? `${(tick / 1000).toFixed(1)}k` : tick}
            </text>
          </g>
        );
      })}

      {/* Line */}
      <path
        d={pathD}
        fill="none"
        stroke="var(--primary)"
        strokeWidth="1.5"
        strokeLinejoin="round"
        strokeLinecap="square"
      />

      {/* Data points */}
      {points.map((p) => (
        <g key={p.month}>
          <rect
            x={p.x - 3}
            y={p.y - 3}
            width="6"
            height="6"
            fill="var(--primary)"
          />
          <text
            x={p.x}
            y={pad.top + innerH + 20}
            textAnchor="middle"
            fontSize="10"
            fontFamily="var(--font-body)"
            fill="var(--graphite)"
          >
            {p.month}
          </text>
        </g>
      ))}
    </svg>
  );
}

function BarChart({
  data,
  width = 600,
  height = 180,
}: {
  data: { name: string; value: number }[];
  width?: number;
  height?: number;
}) {
  const pad = { top: 16, right: 16, bottom: 40, left: 8 };
  const innerW = width - pad.left - pad.right;
  const innerH = height - pad.top - pad.bottom;
  const maxVal = Math.max(...data.map((d) => d.value));
  const barW = innerW / data.length - 8;

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      width="100%"
      height={height}
      aria-label="Conversions by campaign"
    >
      {data.map((d, i) => {
        const barH = (d.value / maxVal) * innerH;
        const x = pad.left + i * (innerW / data.length) + 4;
        const y = pad.top + innerH - barH;

        return (
          <g key={d.name}>
            <rect
              x={x}
              y={y}
              width={barW}
              height={barH}
              fill="var(--dark)"
              fillOpacity={0.5 + 0.5 * (d.value / maxVal)}
            />
            <text
              x={x + barW / 2}
              y={pad.top + innerH + 14}
              textAnchor="middle"
              fontSize="9"
              fontFamily="var(--font-body)"
              fill="var(--graphite)"
            >
              {d.name.split(" ")[0]}
            </text>
            <text
              x={x + barW / 2}
              y={y - 5}
              textAnchor="middle"
              fontSize="10"
              fontFamily="var(--font-body)"
              fill="var(--dark)"
              fontWeight="600"
            >
              {d.value}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

function HorizontalBar({ data }: { data: { name: string; value: number }[] }) {
  const max = Math.max(...data.map((d) => d.value));
  return (
    <div className="an-hbar-list">
      {data.map((d, i) => (
        <div key={d.name} className="an-hbar-row">
          <span className="an-hbar-label">{d.name}</span>
          <div className="an-hbar-track">
            <div
              className="an-hbar-fill"
              style={{
                width: `${(d.value / max) * 100}%`,
                opacity: 0.4 + 0.6 * (1 - i / data.length),
              }}
            />
          </div>
          <span className="an-hbar-value">
            {d.value >= 1000 ? `${(d.value / 1000).toFixed(1)}k` : d.value}
          </span>
        </div>
      ))}
    </div>
  );
}

function TierProgress() {
  const { score, prevScore, nextScore, current, nextTier } = TIER_CONFIG;
  const pct = Math.round(((score - prevScore) / (nextScore - prevScore)) * 100);
  return (
    <div className="an-tier-wrap">
      <div className="an-tier-labels">
        <span className="an-tier-current">{current}</span>
        <span className="an-tier-next">{nextTier} →</span>
      </div>
      <div className="an-tier-track">
        <div className="an-tier-fill" style={{ width: `${pct}%` }} />
      </div>
      <div className="an-tier-meta">
        <span className="an-tier-score">
          Score: <strong>{score}</strong>
        </span>
        <span className="an-tier-gap">
          {nextScore - score} pts to {nextTier}
        </span>
      </div>
    </div>
  );
}

/* ── Page ───────────────────────────────────────────────────── */

export default function CreatorAnalyticsPage() {
  return (
    <div className="an-page">
      {/* Nav */}
      <header className="an-nav">
        <Link href="/creator/dashboard" className="an-nav-back">
          ← Dashboard
        </Link>
        <span className="an-nav-title">Analytics</span>
        <span className="an-nav-date">Apr 2026</span>
      </header>

      {/* Hero */}
      <section className="an-hero">
        <p className="an-hero-eyebrow">This month</p>
        <h1 className="an-hero-headline">
          You reached <span className="an-hero-number">12,847</span>{" "}
          <span className="an-hero-light">people.</span>
        </h1>
        <div className="an-hero-stats">
          <div className="an-hero-stat">
            <span className="an-hero-stat-value">$205</span>
            <span className="an-hero-stat-label">Earned</span>
          </div>
          <div className="an-hero-stat-div" />
          <div className="an-hero-stat">
            <span className="an-hero-stat-value">5</span>
            <span className="an-hero-stat-label">Campaigns</span>
          </div>
          <div className="an-hero-stat-div" />
          <div className="an-hero-stat">
            <span className="an-hero-stat-value">467</span>
            <span className="an-hero-stat-label">Conversions</span>
          </div>
          <div className="an-hero-stat-div" />
          <div className="an-hero-stat">
            <span className="an-hero-stat-value">3.6%</span>
            <span className="an-hero-stat-label">Conv. rate</span>
          </div>
        </div>
      </section>

      {/* Chart grid */}
      <section className="an-charts">
        {/* Reach over time */}
        <div className="an-chart-card an-chart-card--wide">
          <div className="an-chart-header">
            <span className="an-chart-label">Reach over time</span>
            <span className="an-chart-sublabel">Last 6 months</span>
          </div>
          <LineChart data={REACH_DATA} />
        </div>

        {/* Conversions by campaign */}
        <div className="an-chart-card">
          <div className="an-chart-header">
            <span className="an-chart-label">Conversions by campaign</span>
            <span className="an-chart-sublabel">Verified walk-ins</span>
          </div>
          <BarChart data={CAMPAIGN_CONVERSIONS} />
        </div>

        {/* Top neighborhoods */}
        <div className="an-chart-card">
          <div className="an-chart-header">
            <span className="an-chart-label">Top neighborhoods</span>
            <span className="an-chart-sublabel">NYC reach by area</span>
          </div>
          <HorizontalBar data={NEIGHBORHOOD_DATA} />
        </div>

        {/* Tier progression */}
        <div className="an-chart-card an-chart-card--tier">
          <div className="an-chart-header">
            <span className="an-chart-label">Tier progression</span>
            <span className="an-chart-sublabel">Push Score</span>
          </div>
          <TierProgress />
        </div>
      </section>

      {/* Insights */}
      <section className="an-insights">
        <div className="an-insights-header">
          <p className="an-insights-eyebrow">Auto-generated</p>
          <h2 className="an-insights-title">Insights</h2>
        </div>
        <div className="an-insights-grid">
          {INSIGHTS.map((ins) => (
            <div key={ins.id} className="an-insight-card">
              <div
                className="an-insight-accent"
                style={{ background: ins.accent }}
              />
              <div className="an-insight-stat-row">
                <span className="an-insight-stat" style={{ color: ins.accent }}>
                  {ins.stat}
                </span>
                <span className="an-insight-context">{ins.context}</span>
              </div>
              <h3 className="an-insight-headline">{ins.headline}</h3>
              <p className="an-insight-body">{ins.body}</p>
              <Link href={ins.ctaHref} className="an-insight-cta">
                {ins.cta} →
              </Link>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
