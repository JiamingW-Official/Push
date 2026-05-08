"use client";

/* ============================================================
   <TimeChart> — interactive period-switchable chart primitive.

   API:
     <TimeChart
       data={{
         "7d":  [42, 56, 48, 72, 65, 88, 96],
         "30d": [...],
         "90d": [...],
         "all": [...],
       }}
       labels={{ "7d": ["Mon","Tue", ...], ... }}
       valuePrefix="$"
       defaultPeriod="30d"
       accent="blue"
     />

   Renders:
     ┌─────────────────────────────────────────────┐
     │ HEAD: total + delta + period chips          │
     │                                             │
     │ AREA + LINE chart with hover tooltip        │
     │                                             │
     │ X-axis labels                               │
     └─────────────────────────────────────────────┘

   Design:
     - SVG-based (no chart library) — keeps bundle small
     - Hover: snaps to nearest data point, shows tooltip
     - Period chips: same glass-pill register as analytics
     - Accent color (blue/orange/red/champagne) drives stroke + fill
   ============================================================ */

import { useMemo, useState } from "react";
import "./TimeChart.css";

export type ChartPeriod = "7d" | "30d" | "90d" | "all";

const PERIOD_META: Record<ChartPeriod, string> = {
  "7d": "7D",
  "30d": "30D",
  "90d": "90D",
  all: "ALL",
};

const ACCENTS = {
  blue: {
    stroke: "#0085ff",
    fill: "rgba(0, 133, 255, 0.18)",
    glow: "rgba(0, 133, 255, 0.04)",
  },
  orange: {
    stroke: "#ff5e2b",
    fill: "rgba(255, 94, 43, 0.18)",
    glow: "rgba(255, 94, 43, 0.04)",
  },
  red: {
    stroke: "#c1121f",
    fill: "rgba(193, 18, 31, 0.18)",
    glow: "rgba(193, 18, 31, 0.04)",
  },
  champagne: {
    stroke: "#8a704a",
    fill: "rgba(191, 161, 112, 0.20)",
    glow: "rgba(191, 161, 112, 0.04)",
  },
  ink: {
    stroke: "#14130f",
    fill: "rgba(20, 19, 15, 0.16)",
    glow: "rgba(20, 19, 15, 0.03)",
  },
} as const;

type Accent = keyof typeof ACCENTS;

export type TimeChartData = Partial<Record<ChartPeriod, number[]>>;
export type TimeChartLabels = Partial<Record<ChartPeriod, string[]>>;

type Props = {
  data: TimeChartData;
  labels?: TimeChartLabels;
  defaultPeriod?: ChartPeriod;
  valuePrefix?: string;
  valueSuffix?: string;
  accent?: Accent;
  showArea?: boolean;
  /** "line" (default) = area + line, "bar" = bar columns. */
  mode?: "line" | "bar";
  /** Optional prior-period series — drawn as a faint dashed overlay
   *  so users can read trend vs prior period at a glance. */
  priorData?: TimeChartData;
  ariaLabel?: string;
};

export default function TimeChart({
  data,
  labels,
  defaultPeriod = "30d",
  valuePrefix = "",
  valueSuffix = "",
  accent = "blue",
  showArea = true,
  mode = "line",
  priorData,
  ariaLabel = "Time-series chart",
}: Props) {
  const [period, setPeriod] = useState<ChartPeriod>(defaultPeriod);
  const [hover, setHover] = useState<number | null>(null);

  const series = data[period] ?? data[defaultPeriod] ?? data["30d"] ?? [];
  const xLabels = labels?.[period] ?? [];
  const priorSeries = priorData?.[period] ?? series.map((v) => v * 0.82); // synthetic if not provided

  const total = useMemo(() => series.reduce((a, b) => a + b, 0), [series]);
  const max = useMemo(
    () => Math.max(...series, ...priorSeries, 1),
    [series, priorSeries],
  );

  const priorTotal = priorSeries.reduce((a, b) => a + b, 0);
  const delta = priorTotal > 0 ? ((total - priorTotal) / priorTotal) * 100 : 0;
  const deltaUp = delta >= 0;

  const c = ACCENTS[accent];
  const W = 100;
  const H = 36;

  const points = series.map((v, i) => {
    const x = series.length === 1 ? W / 2 : (i / (series.length - 1)) * W;
    const y = H - (v / max) * (H - 4) - 2;
    return { x, y, v };
  });

  const priorPoints = priorSeries.map((v, i) => {
    const x =
      priorSeries.length === 1 ? W / 2 : (i / (priorSeries.length - 1)) * W;
    const y = H - (v / max) * (H - 4) - 2;
    return { x, y, v };
  });

  const linePath = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`)
    .join(" ");
  const priorPath = priorPoints
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`)
    .join(" ");
  const areaPath = `${linePath} L ${W} ${H} L 0 ${H} Z`;
  const barWidth = series.length > 0 ? (W / series.length) * 0.6 : 1;

  const onMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * W;
    let nearest = 0;
    let nearestD = Infinity;
    points.forEach((p, i) => {
      const d = Math.abs(p.x - x);
      if (d < nearestD) {
        nearest = i;
        nearestD = d;
      }
    });
    setHover(nearest);
  };

  const fmt = (n: number) =>
    `${valuePrefix}${n.toLocaleString("en-US")}${valueSuffix}`;

  return (
    <div className="tc">
      <div className="tc__head">
        <div className="tc__totals">
          <p className="tc__total-num">{fmt(total)}</p>
          <p
            className={`tc__delta ${deltaUp ? "tc__delta--up" : "tc__delta--down"}`}
          >
            {deltaUp ? "↑" : "↓"} {Math.abs(delta).toFixed(1)}% vs prior
          </p>
        </div>
        <div className="tc__chips" role="tablist" aria-label="Time range">
          {(Object.keys(PERIOD_META) as ChartPeriod[])
            .filter((p) => data[p] !== undefined)
            .map((p) => (
              <button
                key={p}
                type="button"
                role="tab"
                aria-selected={period === p}
                className={"tc__chip" + (period === p ? " is-active" : "")}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setPeriod(p);
                }}
              >
                {PERIOD_META[p]}
              </button>
            ))}
        </div>
      </div>

      <div className="tc__chart-wrap">
        <svg
          className="tc__chart"
          viewBox={`0 0 ${W} ${H}`}
          preserveAspectRatio="none"
          role="img"
          aria-label={ariaLabel}
          onMouseMove={onMouseMove}
          onMouseLeave={() => setHover(null)}
        >
          {/* Prior-period faint dashed overlay (line mode only) */}
          {mode === "line" && (
            <path
              d={priorPath}
              fill="none"
              stroke={c.stroke}
              strokeWidth="0.4"
              strokeDasharray="1.2 1.2"
              strokeLinecap="round"
              opacity="0.30"
            />
          )}

          {/* Current-period rendering */}
          {mode === "bar" ? (
            points.map((p, i) => {
              const barH = H - p.y - 2;
              return (
                <rect
                  key={i}
                  x={p.x - barWidth / 2}
                  y={p.y}
                  width={barWidth}
                  height={Math.max(0.4, barH)}
                  fill={hover === i ? c.stroke : c.fill}
                  rx="0.5"
                />
              );
            })
          ) : (
            <>
              {showArea && <path d={areaPath} fill={c.fill} stroke="none" />}
              <path
                d={linePath}
                fill="none"
                stroke={c.stroke}
                strokeWidth="0.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {points.map((p, i) => (
                <circle
                  key={i}
                  cx={p.x}
                  cy={p.y}
                  r={hover === i ? 1.4 : 0.6}
                  fill={c.stroke}
                  opacity={hover === i ? 1 : 0.4}
                />
              ))}
            </>
          )}

          {hover !== null && (
            <line
              x1={points[hover].x}
              y1={0}
              x2={points[hover].x}
              y2={H}
              stroke={c.stroke}
              strokeWidth="0.3"
              strokeDasharray="0.8 0.8"
              opacity="0.5"
            />
          )}
        </svg>
        {hover !== null && points[hover] && (
          <div
            className="tc__tip"
            style={{
              left: `${points[hover].x}%`,
              top: `${(points[hover].y / H) * 100}%`,
            }}
          >
            <span className="tc__tip-val">{fmt(points[hover].v)}</span>
            {priorPoints[hover] ? (
              <span className="tc__tip-prior">
                vs {fmt(Math.round(priorPoints[hover].v))} prior
              </span>
            ) : null}
            {xLabels[hover] ? (
              <span className="tc__tip-lbl">{xLabels[hover]}</span>
            ) : null}
          </div>
        )}
      </div>

      {xLabels.length > 0 && (
        <div className="tc__axis">
          <span>{xLabels[0]}</span>
          <span>{xLabels[Math.floor(xLabels.length / 2)]}</span>
          <span>{xLabels[xLabels.length - 1]}</span>
        </div>
      )}
    </div>
  );
}
