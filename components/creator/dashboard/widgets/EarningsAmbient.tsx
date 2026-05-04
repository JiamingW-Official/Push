"use client";

/* Repo target: components/creator/dashboard/widgets/EarningsAmbient.tsx
   3×2 — small numeral + 8-week sparkline + pending/done split.
   Empty state at $0 shows muted placeholder + "first payout will appear here". */

import Link from "next/link";
import {
  buildSparkData,
  formatCurrencyExact,
} from "@/lib/creator/widget-helpers";
import type { Creator, Payout } from "../types";
import { ArrowUpRight } from "../CircleArrow";

export interface EarningsAmbientProps {
  creator: Creator;
  payouts: Payout[];
  className?: string;
}

export function EarningsAmbient({
  creator,
  payouts,
  className = "",
}: EarningsAmbientProps) {
  const total = creator.earnings_total ?? 0;
  const pending = creator.earnings_pending ?? 0;
  const done = creator.campaigns_completed ?? 0;

  const isEmpty = total === 0 && pending === 0;
  const data = buildSparkData(payouts, 8);
  const max = Math.max(...data, 1);

  /* week-over-week delta from the spark data */
  const lastTwo = data.slice(-2);
  const wow =
    lastTwo[0] > 0
      ? Math.round(((lastTwo[1] - lastTwo[0]) / lastTwo[0]) * 100)
      : null;

  if (isEmpty) {
    return (
      <div className={`dh-card ${className}`.trim()}>
        <div className="dh-card__header">
          <span className="dh-card__eyebrow">EARNINGS</span>
        </div>
        <div className="dh-earn">
          <div className="dh-earn__top">
            <span className="dh-earn__num dh-earn__num--muted">$0</span>
          </div>
          <p className="dh-earn__lead">Your first payout will appear here.</p>
          <div className="dh-earn__sparkline dh-earn__sparkline--placeholder" />
          <p className="dh-earn__hint">
            Average new creator earns <strong>$45–$75</strong> in their first 2
            weeks.
          </p>
        </div>
      </div>
    );
  }

  return (
    <Link
      href="/creator/earnings"
      className={`dh-card is-clickable ${className}`.trim()}
    >
      <div className="dh-card__header">
        <span className="dh-card__eyebrow">EARNINGS · THIS CYCLE</span>
        <span className="dh-circle-arrow" aria-hidden="true">
          <ArrowUpRight />
        </span>
      </div>

      <div className="dh-earn">
        <div className="dh-earn__top">
          <span className="dh-earn__num">{formatCurrencyExact(total)}</span>
          {wow !== null && wow !== 0 && (
            <span
              className="dh-earn__delta"
              style={
                wow < 0
                  ? {
                      color: "#b91c1c",
                      background: "rgba(193,18,31,0.08)",
                      borderColor: "rgba(193,18,31,0.22)",
                    }
                  : undefined
              }
            >
              {wow > 0 ? "▲" : "▼"} {Math.abs(wow)}% WoW
            </span>
          )}
        </div>

        <Sparkline data={data} max={max} />

        <div className="dh-earn__split">
          <div className="dh-earn__sub">
            <span className="dh-earn__sub-label">PENDING</span>
            <span className="dh-earn__sub-value">
              {formatCurrencyExact(pending)}
            </span>
          </div>
          <div className="dh-earn__sub">
            <span className="dh-earn__sub-label">DONE</span>
            <span className="dh-earn__sub-value">{done}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

function Sparkline({ data, max }: { data: number[]; max: number }) {
  if (data.length < 2) return null;
  const W = 240,
    H = 56,
    pad = 8;
  const stepX = (W - pad * 2) / Math.max(1, data.length - 1);
  const points = data.map((v, i) => {
    const x = pad + i * stepX;
    const y = H - pad - (v / max) * (H - pad * 2);
    return [x, y] as const;
  });
  const polyline = points.map(([x, y]) => `${x},${y}`).join(" ");
  /* Closed area: drop down → line through points → drop down → close */
  const first = points[0];
  const last = points[points.length - 1];
  const area =
    `M ${first[0]} ${H} ` +
    points.map(([x, y]) => `L ${x} ${y}`).join(" ") +
    ` L ${last[0]} ${H} Z`;

  return (
    <svg
      className="dh-earn__sparkline"
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="dh-earn-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(193,18,31,0.18)" />
          <stop offset="100%" stopColor="rgba(193,18,31,0)" />
        </linearGradient>
      </defs>
      <path d={area} fill="url(#dh-earn-grad)" />
      <polyline
        points={polyline}
        fill="none"
        stroke="var(--brand-red)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle
        cx={points[points.length - 1][0]}
        cy={points[points.length - 1][1]}
        r="3.5"
        fill="var(--brand-red)"
        stroke="var(--snow)"
        strokeWidth="1.5"
      />
    </svg>
  );
}
