"use client";

import type { YesterdayStats } from "@/lib/today/briefing";

interface YesterdayRecapProps {
  stats: YesterdayStats | null;
}

export default function YesterdayRecap({ stats }: YesterdayRecapProps) {
  const statLine = stats
    ? `${stats.scansVerified} scans · $${(stats.earningsCents / 100).toFixed(0)} earned`
    : "";

  return (
    <details className="recap-details">
      <summary className="recap-summary">
        <span className="recap-eyebrow">(YESTERDAY)</span>
        <span className="recap-stats" suppressHydrationWarning>
          {statLine}
        </span>
        <svg
          className="recap-chevron"
          viewBox="0 0 16 16"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M6 4l4 4-4 4"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </summary>
      <div className="recap-body">
        {stats ? (
          <>
            <p className="recap-stat-row">
              <strong>Posts</strong> {stats.posts}
            </p>
            <p className="recap-stat-row">
              <strong>Verified scans</strong> {stats.scansVerified}
            </p>
            <p className="recap-stat-row">
              <strong>Earnings</strong> $
              {(stats.earningsCents / 100).toFixed(2)}
            </p>
            <p className="recap-stat-row">
              <strong>New invites</strong> {stats.newInvites}
            </p>
          </>
        ) : (
          <>
            <p className="recap-stat-row" style={{ color: "var(--ink-5)" }}>
              Posts —
            </p>
            <p className="recap-stat-row" style={{ color: "var(--ink-5)" }}>
              Verified scans —
            </p>
            <p className="recap-stat-row" style={{ color: "var(--ink-5)" }}>
              Earnings —
            </p>
            <p className="recap-stat-row" style={{ color: "var(--ink-5)" }}>
              New invites —
            </p>
          </>
        )}
      </div>
    </details>
  );
}
