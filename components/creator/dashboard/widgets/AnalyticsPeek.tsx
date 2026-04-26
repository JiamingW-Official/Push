"use client";

/* Repo target: components/creator/dashboard/widgets/AnalyticsPeek.tsx
   3×1 — 4 KPI mini-cells: Reach · Scans · Conv · CTR.
   Empty state at Day 0–7 shown as muted placeholders. */

import Link from "next/link";

export interface AnalyticsPeekProps {
  reach?: number;
  scans?: number;
  convPct?: number;
  ctrPct?: number;
  className?: string;
}

export function AnalyticsPeek({
  reach,
  scans,
  convPct,
  ctrPct,
  className = "",
}: AnalyticsPeekProps) {
  const hasData =
    typeof reach === "number" ||
    typeof scans === "number" ||
    typeof convPct === "number" ||
    typeof ctrPct === "number";

  return (
    <Link
      href="/creator/analytics"
      className={`dh-card is-clickable ${className}`.trim()}
    >
      <div className="dh-card__header">
        <span className="dh-card__eyebrow">LAST 7 DAYS</span>
        <span className="dh-card__view-all">REPORT →</span>
      </div>

      <div className="dh-peek">
        <Cell label="REACH"  value={reach}    fmt={(n) => fmtK(n)} dim={!hasData} />
        <Cell label="SCANS"  value={scans}    fmt={(n) => `${n}`} dim={!hasData} />
        <Cell label="CONV"   value={convPct}  fmt={(n) => `${n}%`} dim={!hasData} />
        <Cell label="CTR"    value={ctrPct}   fmt={(n) => `${n.toFixed(1)}%`} dim={!hasData} />
      </div>
    </Link>
  );
}

function Cell({
  label,
  value,
  fmt,
  dim,
}: {
  label: string;
  value?: number;
  fmt: (n: number) => string;
  dim: boolean;
}) {
  return (
    <div className="dh-peek__cell">
      <span className="dh-peek__label">{label}</span>
      <span
        className="dh-peek__value"
        style={dim || value === undefined ? { color: "var(--ink-5)" } : undefined}
      >
        {value === undefined ? "—" : fmt(value)}
      </span>
    </div>
  );
}

function fmtK(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return `${n}`;
}
