"use client";

import Link from "next/link";
import "./analytics.css";

/* ── Mock data ─────────────────────────────────────────────── */

const SPEND_VS_CONV = [
  { week: "W1", spend: 420, conversions: 38 },
  { week: "W2", spend: 680, conversions: 71 },
  { week: "W3", spend: 540, conversions: 58 },
  { week: "W4", spend: 820, conversions: 94 },
  { week: "W5", spend: 760, conversions: 88 },
  { week: "W6", spend: 900, conversions: 107 },
];

const CAMPAIGN_MATRIX = [
  {
    name: "Roberta's Spring",
    tier: "Partner",
    spend: 600,
    conversions: 142,
    roi: 4.2,
    status: "Active",
  },
  {
    name: "Fort Greene Coffee",
    tier: "Proven",
    spend: 420,
    conversions: 87,
    roi: 2.9,
    status: "Active",
  },
  {
    name: "Bed-Stuy Retail Push",
    tier: "Operator",
    spend: 280,
    conversions: 41,
    roi: 1.8,
    status: "Ended",
  },
  {
    name: "Spring Launch",
    tier: "Explorer",
    spend: 350,
    conversions: 52,
    roi: 2.1,
    status: "Paused",
  },
  {
    name: "Park Slope Beauty",
    tier: "Partner",
    spend: 700,
    conversions: 178,
    roi: 4.8,
    status: "Active",
  },
];

const TIER_ROI = [
  { tier: "Seed", roi: 1.1, fill: "var(--line-strong)" },
  { tier: "Explorer", roi: 1.8, fill: "var(--tertiary)" },
  { tier: "Operator", roi: 2.4, fill: "var(--dark)", opacity: 0.6 },
  { tier: "Proven", roi: 3.1, fill: "var(--dark)" },
  { tier: "Partner", roi: 4.5, fill: "var(--champagne)" },
];

const TIME_TO_CONV_HIST = [
  { bin: "0-1h", count: 28 },
  { bin: "1-3h", count: 87 },
  { bin: "3-6h", count: 124 },
  { bin: "6-12h", count: 61 },
  { bin: "12-24h", count: 32 },
  { bin: "1-3d", count: 18 },
];

const INSIGHTS = [
  {
    id: 1,
    headline: "Partner tier",
    stat: "3×",
    context: "conversions vs. Seed",
    body: "Partner-tier creators deliver 3× more verified walk-ins than Seed at similar spend. The premium pays for itself within two campaigns.",
    cta: "Upgrade campaign tier",
    ctaHref: "/merchant/campaigns",
    accent: "var(--champagne)",
  },
  {
    id: 2,
    headline: "3-6h window",
    stat: "37%",
    context: "of all conversions arrive here",
    body: "The peak conversion window is 3–6 hours post-content. Consider running campaigns before lunch to maximize same-day foot traffic.",
    cta: "View campaign timing",
    ctaHref: "/merchant/campaigns",
    accent: "var(--tertiary)",
  },
  {
    id: 3,
    headline: "'Spring Launch'",
    stat: "50%",
    context: "budget consumed",
    body: "Your Spring Launch campaign has hit the halfway mark. At current velocity you'll reach full capacity 6 days before deadline.",
    cta: "Manage campaign",
    ctaHref: "/merchant/campaigns",
    accent: "var(--primary)",
  },
];

/* ── SVG helpers ────────────────────────────────────────────── */

function DualAxisLine({
  data,
  width = 680,
  height = 180,
}: {
  data: { week: string; spend: number; conversions: number }[];
  width?: number;
  height?: number;
}) {
  const pad = { top: 16, right: 56, bottom: 32, left: 56 };
  const innerW = width - pad.left - pad.right;
  const innerH = height - pad.top - pad.bottom;

  const maxSpend = Math.max(...data.map((d) => d.spend));
  const maxConv = Math.max(...data.map((d) => d.conversions));

  const spendPts = data.map((d, i) => ({
    x: pad.left + (i / (data.length - 1)) * innerW,
    y: pad.top + (1 - d.spend / maxSpend) * innerH,
    ...d,
  }));
  const convPts = data.map((d, i) => ({
    x: pad.left + (i / (data.length - 1)) * innerW,
    y: pad.top + (1 - d.conversions / maxConv) * innerH,
    ...d,
  }));

  const spendPath = spendPts
    .map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(1)},${p.y.toFixed(1)}`)
    .join(" ");
  const convPath = convPts
    .map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(1)},${p.y.toFixed(1)}`)
    .join(" ");

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      width="100%"
      height={height}
      aria-label="Spend vs conversions"
    >
      {/* Grid */}
      {[0, 0.5, 1].map((t) => {
        const y = pad.top + t * innerH;
        return (
          <line
            key={t}
            x1={pad.left}
            y1={y}
            x2={pad.left + innerW}
            y2={y}
            stroke="var(--line)"
            strokeWidth="1"
          />
        );
      })}

      {/* Left axis labels — spend */}
      {[maxSpend, maxSpend / 2, 0].map((v, i) => (
        <text
          key={i}
          x={pad.left - 8}
          y={pad.top + i * (innerH / 2) + 4}
          textAnchor="end"
          fontSize="9"
          fontFamily="var(--font-body)"
          fill="var(--dark)"
        >
          ${v >= 1000 ? `${(v / 1000).toFixed(1)}k` : v}
        </text>
      ))}

      {/* Right axis labels — conversions */}
      {[maxConv, maxConv / 2, 0].map((v, i) => (
        <text
          key={i}
          x={pad.left + innerW + 8}
          y={pad.top + i * (innerH / 2) + 4}
          textAnchor="start"
          fontSize="9"
          fontFamily="var(--font-body)"
          fill="var(--tertiary)"
        >
          {Math.round(v)}
        </text>
      ))}

      {/* Spend line — dark */}
      <path
        d={spendPath}
        fill="none"
        stroke="var(--dark)"
        strokeWidth="1.5"
        strokeLinecap="square"
      />
      {spendPts.map((p) => (
        <rect
          key={p.week + "s"}
          x={p.x - 3}
          y={p.y - 3}
          width="6"
          height="6"
          fill="var(--dark)"
        />
      ))}

      {/* Conversions line — tertiary */}
      <path
        d={convPath}
        fill="none"
        stroke="var(--tertiary)"
        strokeWidth="1.5"
        strokeLinecap="square"
        strokeDasharray="4 2"
      />
      {convPts.map((p) => (
        <rect
          key={p.week + "c"}
          x={p.x - 3}
          y={p.y - 3}
          width="6"
          height="6"
          fill="var(--tertiary)"
        />
      ))}

      {/* X labels */}
      {data.map((d, i) => (
        <text
          key={d.week}
          x={pad.left + (i / (data.length - 1)) * innerW}
          y={pad.top + innerH + 20}
          textAnchor="middle"
          fontSize="10"
          fontFamily="var(--font-body)"
          fill="var(--graphite)"
        >
          {d.week}
        </text>
      ))}

      {/* Legend */}
      <rect
        x={pad.left}
        y={pad.top - 12}
        width="10"
        height="3"
        fill="var(--dark)"
      />
      <text
        x={pad.left + 14}
        y={pad.top - 7}
        fontSize="9"
        fontFamily="var(--font-body)"
        fill="var(--dark)"
      >
        Spend
      </text>
      <rect
        x={pad.left + 60}
        y={pad.top - 12}
        width="10"
        height="3"
        fill="var(--tertiary)"
      />
      <text
        x={pad.left + 74}
        y={pad.top - 7}
        fontSize="9"
        fontFamily="var(--font-body)"
        fill="var(--tertiary)"
      >
        Conversions
      </text>
    </svg>
  );
}

function TierROIBar({
  data,
  width = 400,
  height = 180,
}: {
  data: { tier: string; roi: number; fill: string; opacity?: number }[];
  width?: number;
  height?: number;
}) {
  const pad = { top: 24, right: 16, bottom: 40, left: 8 };
  const innerW = width - pad.left - pad.right;
  const innerH = height - pad.top - pad.bottom;
  const maxROI = Math.max(...data.map((d) => d.roi));
  const barW = innerW / data.length - 10;

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      width="100%"
      height={height}
      aria-label="ROI by creator tier"
    >
      {data.map((d, i) => {
        const barH = (d.roi / maxROI) * innerH;
        const x = pad.left + i * (innerW / data.length) + 5;
        const y = pad.top + innerH - barH;
        return (
          <g key={d.tier}>
            <rect
              x={x}
              y={y}
              width={barW}
              height={barH}
              fill={d.fill}
              opacity={d.opacity ?? 1}
            />
            <text
              x={x + barW / 2}
              y={pad.top + innerH + 14}
              textAnchor="middle"
              fontSize="9"
              fontFamily="var(--font-body)"
              fill="var(--graphite)"
            >
              {d.tier}
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
              {d.roi}×
            </text>
          </g>
        );
      })}
    </svg>
  );
}

function Histogram({
  data,
  width = 400,
  height = 160,
}: {
  data: { bin: string; count: number }[];
  width?: number;
  height?: number;
}) {
  const pad = { top: 16, right: 16, bottom: 32, left: 32 };
  const innerW = width - pad.left - pad.right;
  const innerH = height - pad.top - pad.bottom;
  const maxCount = Math.max(...data.map((d) => d.count));
  const barW = innerW / data.length - 4;

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      width="100%"
      height={height}
      aria-label="Time to conversion distribution"
    >
      {[0, 0.5, 1].map((t) => {
        const y = pad.top + t * innerH;
        return (
          <g key={t}>
            <line
              x1={pad.left}
              y1={y}
              x2={pad.left + innerW}
              y2={y}
              stroke="var(--line)"
              strokeWidth="1"
            />
            <text
              x={pad.left - 5}
              y={y + 4}
              textAnchor="end"
              fontSize="9"
              fontFamily="var(--font-body)"
              fill="var(--graphite)"
            >
              {Math.round((1 - t) * maxCount)}
            </text>
          </g>
        );
      })}
      {data.map((d, i) => {
        const barH = (d.count / maxCount) * innerH;
        const x = pad.left + i * (innerW / data.length) + 2;
        const y = pad.top + innerH - barH;
        // Peak bar gets primary color
        const isPeak = d.count === maxCount;
        return (
          <g key={d.bin}>
            <rect
              x={x}
              y={y}
              width={barW}
              height={barH}
              fill={isPeak ? "var(--primary)" : "var(--dark)"}
              fillOpacity={isPeak ? 1 : 0.35}
            />
            <text
              x={x + barW / 2}
              y={pad.top + innerH + 16}
              textAnchor="middle"
              fontSize="9"
              fontFamily="var(--font-body)"
              fill="var(--graphite)"
            >
              {d.bin}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

/* ── Page ───────────────────────────────────────────────────── */

export default function MerchantAnalyticsPage() {
  return (
    <div className="man-page">
      {/* Nav */}
      <header className="man-nav">
        <Link href="/merchant/dashboard" className="man-nav-back">
          ← Dashboard
        </Link>
        <span className="man-nav-title">Analytics</span>
        <span className="man-nav-date">Apr 2026</span>
      </header>

      {/* Hero */}
      <section className="man-hero">
        <p className="man-hero-eyebrow">Campaign performance</p>
        <h1 className="man-hero-headline">
          <span className="man-hero-number">340</span> verified walk-ins.{" "}
          <span className="man-hero-roi">$4,120</span>{" "}
          <span className="man-hero-light">ROI.</span>
        </h1>
        <div className="man-hero-stats">
          <div className="man-hero-stat">
            <span className="man-hero-stat-value">$2,350</span>
            <span className="man-hero-stat-label">Total Spend</span>
          </div>
          <div className="man-hero-stat-div" />
          <div className="man-hero-stat">
            <span className="man-hero-stat-value">1.75×</span>
            <span className="man-hero-stat-label">Avg ROI</span>
          </div>
          <div className="man-hero-stat-div" />
          <div className="man-hero-stat">
            <span className="man-hero-stat-value">5</span>
            <span className="man-hero-stat-label">Campaigns</span>
          </div>
          <div className="man-hero-stat-div" />
          <div className="man-hero-stat">
            <span className="man-hero-stat-value">24</span>
            <span className="man-hero-stat-label">Creators</span>
          </div>
        </div>
      </section>

      {/* Charts grid */}
      <section className="man-charts">
        {/* Spend vs conversions */}
        <div className="man-chart-card man-chart-card--wide">
          <div className="man-chart-header">
            <span className="man-chart-label">
              Spend vs. verified conversions
            </span>
            <div className="man-chart-legend">
              <span className="man-chart-legend-item man-chart-legend-item--dark">
                Spend ($)
              </span>
              <span className="man-chart-legend-item man-chart-legend-item--blue">
                Conversions (dashed)
              </span>
            </div>
          </div>
          <DualAxisLine data={SPEND_VS_CONV} />
        </div>

        {/* Creator tier ROI */}
        <div className="man-chart-card">
          <div className="man-chart-header">
            <span className="man-chart-label">Creator tier ROI</span>
            <span className="man-chart-sublabel">Return multiplier</span>
          </div>
          <TierROIBar data={TIER_ROI} />
        </div>

        {/* Time to conversion */}
        <div className="man-chart-card">
          <div className="man-chart-header">
            <span className="man-chart-label">Time-to-conversion</span>
            <span className="man-chart-sublabel">Hours after content</span>
          </div>
          <Histogram data={TIME_TO_CONV_HIST} />
        </div>
      </section>

      {/* Campaign performance matrix */}
      <section className="man-matrix-section">
        <div className="man-matrix-header">
          <span className="man-chart-label">Campaign performance matrix</span>
        </div>
        <div className="man-matrix-wrap">
          <table className="man-matrix">
            <thead>
              <tr>
                <th>Campaign</th>
                <th>Tier</th>
                <th>Spend</th>
                <th>Conversions</th>
                <th>ROI</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {CAMPAIGN_MATRIX.map((row) => (
                <tr key={row.name}>
                  <td className="man-matrix-name">{row.name}</td>
                  <td>
                    <span
                      className={`man-tier-badge man-tier-badge--${row.tier.toLowerCase()}`}
                    >
                      {row.tier}
                    </span>
                  </td>
                  <td>${row.spend}</td>
                  <td>{row.conversions}</td>
                  <td className="man-matrix-roi">{row.roi}×</td>
                  <td>
                    <span
                      className={`man-status-badge man-status-badge--${row.status.toLowerCase()}`}
                    >
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Insights */}
      <section className="man-insights">
        <div className="man-insights-header">
          <p className="man-insights-eyebrow">Auto-generated</p>
          <h2 className="man-insights-title">Insights</h2>
        </div>
        <div className="man-insights-grid">
          {INSIGHTS.map((ins) => (
            <div key={ins.id} className="man-insight-card">
              <div
                className="man-insight-accent"
                style={{ background: ins.accent }}
              />
              <div className="man-insight-stat-row">
                <span
                  className="man-insight-stat"
                  style={{ color: ins.accent }}
                >
                  {ins.stat}
                </span>
                <span className="man-insight-context">{ins.context}</span>
              </div>
              <h3 className="man-insight-headline">{ins.headline}</h3>
              <p className="man-insight-body">{ins.body}</p>
              <Link href={ins.ctaHref} className="man-insight-cta">
                {ins.cta} →
              </Link>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
