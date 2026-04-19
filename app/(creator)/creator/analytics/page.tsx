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

const NEIGHBORHOOD_DATA = [
  { name: "Williamsburg", value: 3240 },
  { name: "Lower East Side", value: 2810 },
  { name: "Fort Greene", value: 2190 },
  { name: "Park Slope", value: 1870 },
  { name: "Bed-Stuy", value: 1540 },
  { name: "Greenpoint", value: 1197 },
];

const RECENT_CAMPAIGNS = [
  {
    id: 1,
    campaign: "Best Burger Feature",
    merchant: "Superiority Burger",
    scans: 142,
    earned: 44,
    status: "done",
  },
  {
    id: 2,
    campaign: "Lifestyle Shoot",
    merchant: "Flamingo Estate",
    scans: 64,
    earned: 35,
    status: "done",
  },
  {
    id: 3,
    campaign: "Matcha Bar Content",
    merchant: "Cha Cha Matcha",
    scans: 76,
    earned: 34,
    status: "live",
  },
  {
    id: 4,
    campaign: "Brow Transformation",
    merchant: "Brow Theory",
    scans: 98,
    earned: 50,
    status: "live",
  },
  {
    id: 5,
    campaign: "Cold Brew Launch",
    merchant: "Blank Street",
    scans: 87,
    earned: 42,
    status: "done",
  },
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
    stat: "2.4×",
    context: "conversion rate vs. lifestyle",
    headline: "Food campaigns",
    body: "Your food content consistently outperforms every other category. The audience trusts your taste.",
    cta: "Find food campaigns",
    ctaHref: "/creator/dashboard",
    accent: "var(--primary, #c1121f)",
  },
  {
    id: 2,
    stat: "+31%",
    context: "reach vs. last month",
    headline: "Williamsburg",
    body: "Your Williamsburg content is hitting. Three of your top-5 posts this month were from that neighborhood.",
    cta: "Browse nearby",
    ctaHref: "/creator/dashboard",
    accent: "var(--steel-blue, #669bbc)",
  },
  {
    id: 3,
    stat: "4 pts",
    context: "to reach Proven tier",
    headline: "Almost there",
    body: "One strong campaign away from unlocking higher-paying spots and exclusive merchant partnerships.",
    cta: "See what unlocks",
    ctaHref: "/creator/dashboard",
    accent: "var(--champagne, #c9a96e)",
  },
];

/* ── SVG line chart ─────────────────────────────────────────── */

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

  const yTicks = [minVal, Math.round((minVal + maxVal) / 2), maxVal];

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      width="100%"
      height={height}
      aria-label="Reach over time"
    >
      <path d={areaD} fill="var(--primary, #c1121f)" fillOpacity="0.05" />

      {yTicks.map((tick) => {
        const y = pad.top + (1 - (tick - minVal) / range) * innerH;
        return (
          <g key={tick}>
            <line
              x1={pad.left}
              y1={y}
              x2={pad.left + innerW}
              y2={y}
              stroke="rgba(0,48,73,0.08)"
              strokeWidth="1"
            />
            <text
              x={pad.left - 8}
              y={y + 4}
              textAnchor="end"
              fontSize="10"
              fontFamily="var(--font-body, 'CS Genio Mono', monospace)"
              fill="rgba(0,48,73,0.4)"
            >
              {tick >= 1000 ? `${(tick / 1000).toFixed(1)}k` : tick}
            </text>
          </g>
        );
      })}

      <path
        d={pathD}
        fill="none"
        stroke="var(--primary, #c1121f)"
        strokeWidth="1.5"
        strokeLinejoin="round"
        strokeLinecap="square"
      />

      {points.map((p) => (
        <g key={p.month}>
          <rect
            x={p.x - 3}
            y={p.y - 3}
            width="6"
            height="6"
            fill="var(--primary, #c1121f)"
          />
          <text
            x={p.x}
            y={pad.top + innerH + 20}
            textAnchor="middle"
            fontSize="10"
            fontFamily="var(--font-body, 'CS Genio Mono', monospace)"
            fill="rgba(0,48,73,0.4)"
          >
            {p.month}
          </text>
        </g>
      ))}
    </svg>
  );
}

/* ── Page ───────────────────────────────────────────────────── */

export default function CreatorAnalyticsPage() {
  const { current, score, nextTier, nextScore, prevScore } = TIER_CONFIG;
  const pct = Math.round(((score - prevScore) / (nextScore - prevScore)) * 100);

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

      {/* Page header */}
      <div className="an-page-header">
        <h1 className="an-page-title">Analytics</h1>
        <p className="an-page-subtitle">Last 30 days · Apr 2026</p>
      </div>

      {/* Hero stats — 3 big numbers */}
      <section className="an-hero-stats">
        <div className="an-stat-cell">
          <span className="an-stat-label">Total Scans</span>
          <span className="an-stat-number">12,847</span>
          <span className="an-stat-delta an-stat-delta--pos">
            +1,647 vs last month
          </span>
        </div>
        <div className="an-stat-cell">
          <span className="an-stat-label">Earned</span>
          <span className="an-stat-number an-stat-number--gold">$1,840</span>
          <span className="an-stat-delta an-stat-delta--pos">
            +$230 vs last month
          </span>
        </div>
        <div className="an-stat-cell">
          <span className="an-stat-label">Avg Rating</span>
          <span className="an-stat-number an-stat-number--blue">4.8★</span>
          <span className="an-stat-delta an-stat-delta--neu">
            Top 15% of creators
          </span>
        </div>
      </section>

      {/* Push Score */}
      <section className="an-score-section">
        <div className="an-score-number-wrap">
          <span className="an-score-number">{score}</span>
          <span className="an-score-denom">/100</span>
        </div>
        <div className="an-score-details">
          <div className="an-score-tier-label">Push Score · Current tier</div>
          <div className="an-score-tier-name">{current}</div>
          <div className="an-score-progress-label">
            <strong>{nextScore - score} pts</strong> to {nextTier}
          </div>
          <div className="an-score-track">
            <div className="an-score-fill" style={{ width: `${pct}%` }} />
          </div>
          <div className="an-score-next">
            {prevScore} · {current} ────── {score} ──── {nextScore} · {nextTier}
          </div>
        </div>
      </section>

      {/* Reach chart */}
      <section className="an-chart-section">
        <div className="an-section-label">Reach over time</div>
        <h2 className="an-section-title">Last 6 months</h2>
        <LineChart data={REACH_DATA} />
      </section>

      {/* Recent campaigns table */}
      <section className="an-campaigns-section">
        <div className="an-section-label">Recent campaigns</div>
        <h2 className="an-section-title">Performance</h2>
        <table className="an-table">
          <thead>
            <tr>
              <th>Campaign</th>
              <th>Merchant</th>
              <th>Scans</th>
              <th>Earned</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {RECENT_CAMPAIGNS.map((c) => (
              <tr key={c.id}>
                <td>
                  <div className="an-table-campaign">{c.campaign}</div>
                </td>
                <td>
                  <div className="an-table-merchant">{c.merchant}</div>
                </td>
                <td>
                  <span className="an-table-scans">{c.scans}</span>
                </td>
                <td>
                  <span className="an-table-amount">${c.earned}</span>
                </td>
                <td>
                  <span className={`an-status an-status--${c.status}`}>
                    {c.status === "live"
                      ? "Live"
                      : c.status === "done"
                        ? "Complete"
                        : "Pending"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* Top neighborhoods */}
      <section className="an-neighborhoods-section">
        <div className="an-section-label">Top neighborhoods</div>
        <h2 className="an-section-title">NYC reach by area</h2>
        <div className="an-nbhd-list">
          {NEIGHBORHOOD_DATA.map((n, i) => {
            const max = NEIGHBORHOOD_DATA[0].value;
            return (
              <div key={n.name} className="an-nbhd-row">
                <span className="an-nbhd-rank">{i + 1}</span>
                <span className="an-nbhd-name">{n.name}</span>
                <div className="an-nbhd-bar-wrap">
                  <div
                    className="an-nbhd-bar"
                    style={{ width: `${(n.value / max) * 100}%` }}
                  />
                </div>
                <span className="an-nbhd-value">
                  {n.value >= 1000
                    ? `${(n.value / 1000).toFixed(1)}k`
                    : n.value}
                </span>
              </div>
            );
          })}
        </div>
      </section>

      {/* Insights */}
      <section className="an-insights-section">
        <div className="an-insights-header">
          <p className="an-insights-eyebrow">Auto-generated</p>
          <h2 className="an-insights-title">Insights</h2>
        </div>
        <div className="an-insights-grid">
          {INSIGHTS.map((ins) => (
            <div key={ins.id} className="an-insight-card">
              <span className="an-insight-stat" style={{ color: ins.accent }}>
                {ins.stat}
              </span>
              <span className="an-insight-context">{ins.context}</span>
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
