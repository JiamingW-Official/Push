"use client";

/* Repo target: components/creator/dashboard/widgets/BalanceCard.tsx
   Dense Lumin-style dark hero. Compact 4-col × 3-row footprint so the
   right-column neighbors don't tower over empty space. Adds a real
   sparkline of weekly earnings and labels the action buttons (no more
   icon-only black tiles). */

import Link from "next/link";
import {
  buildSparkData,
  formatCurrencyExact,
} from "@/lib/creator/widget-helpers";
import type { Creator, Payout } from "../types";

export interface BalanceCardProps {
  creator: Creator;
  payouts: Payout[];
  className?: string;
}

export function BalanceCard({
  creator,
  payouts,
  className = "",
}: BalanceCardProps) {
  const total = creator.earnings_total ?? 0;
  const pending = creator.earnings_pending ?? 0;

  const cycleTarget = 300;
  const cyclePct = Math.max(
    8,
    Math.min(100, Math.round((total / cycleTarget) * 100)),
  );

  const data = buildSparkData(payouts, 8);
  const lastTwo = data.slice(-2);
  const wow =
    lastTwo[0] > 0
      ? Math.round(((lastTwo[1] - lastTwo[0]) / lastTwo[0]) * 100)
      : null;

  const dollars = Math.floor(total);
  const cents = Math.round((total - dollars) * 100)
    .toString()
    .padStart(2, "0");

  return (
    <div className={`dh-balance ${className}`.trim()}>
      <header className="dh-balance__head">
        <span className="dh-balance__eyebrow">TOTAL BALANCE</span>
        <Link
          href="/creator/earnings"
          className="dh-circle-arrow"
          aria-label="View earnings"
        >
          <ArrowUpRight />
        </Link>
      </header>

      <div className="dh-balance__hero">
        <div className="dh-balance__num">
          <span className="dh-balance__dollar">$</span>
          <span className="dh-balance__main">
            {dollars.toLocaleString("en-US")}
          </span>
          <span className="dh-balance__cents">.{cents}</span>
        </div>

        <BalanceSpark data={data} />

        {wow !== null && wow !== 0 && (
          <div
            className={"dh-balance__delta " + (wow > 0 ? "is-up" : "is-down")}
          >
            <span>{wow > 0 ? "▲" : "▼"}</span> {Math.abs(wow)}% WoW · 8w
          </div>
        )}
      </div>

      <div className="dh-balance__quad" role="group" aria-label="Quick actions">
        <Link
          href="/creator/earnings"
          className="dh-balance__action"
          aria-label="Withdraw"
        >
          <IconUp />
          <span>Withdraw</span>
        </Link>
        <Link
          href="/creator/work"
          className="dh-balance__action"
          aria-label="Pipeline"
        >
          <IconStack />
          <span>Pipeline</span>
        </Link>
        <Link
          href="/creator/discover"
          className="dh-balance__action"
          aria-label="Discover"
        >
          <IconCompass />
          <span>Discover</span>
        </Link>
        <Link
          href="/creator/inbox"
          className="dh-balance__action"
          aria-label="Inbox"
        >
          <IconBell />
          <span>Inbox</span>
        </Link>
      </div>

      <div className="dh-balance__split">
        <div className="dh-balance__split-cell">
          <span className="dh-balance__split-label">VERIFIED</span>
          <span className="dh-balance__split-value">
            {formatCurrencyExact(total)}
          </span>
        </div>
        <div className="dh-balance__split-cell">
          <span className="dh-balance__split-label">PENDING</span>
          <span className="dh-balance__split-value">
            {formatCurrencyExact(pending)}
          </span>
        </div>
        <div className="dh-balance__split-cell">
          <span className="dh-balance__split-label">CYCLE</span>
          <span className="dh-balance__split-value">{cyclePct}%</span>
        </div>
      </div>

      <div
        className="dh-balance__bar"
        aria-label={`${cyclePct}% of cycle target`}
      >
        <div
          className="dh-balance__bar-fill"
          style={{ width: `${cyclePct}%` }}
        />
      </div>
    </div>
  );
}

/* ── Sparkline (mini weekly earnings line + area fill) ──────────── */

function BalanceSpark({ data }: { data: number[] }) {
  if (data.length < 2) return null;
  const W = 240;
  const H = 32;
  const pad = 2;
  const max = Math.max(...data, 1);
  const stepX = (W - pad * 2) / Math.max(1, data.length - 1);
  const points = data.map((v, i) => {
    const x = pad + i * stepX;
    const y = H - pad - (v / max) * (H - pad * 2);
    return [x, y] as const;
  });
  const polyline = points.map(([x, y]) => `${x},${y}`).join(" ");
  const last = points[points.length - 1];
  const first = points[0];
  const area =
    `M ${first[0]} ${H} ` +
    points.map(([x, y]) => `L ${x} ${y}`).join(" ") +
    ` L ${last[0]} ${H} Z`;

  return (
    <svg
      className="dh-balance__spark"
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="dh-bal-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(74, 222, 128, 0.42)" />
          <stop offset="100%" stopColor="rgba(74, 222, 128, 0)" />
        </linearGradient>
      </defs>
      <path d={area} fill="url(#dh-bal-grad)" />
      <polyline
        points={polyline}
        fill="none"
        stroke="#4ade80"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle
        cx={last[0]}
        cy={last[1]}
        r="2.5"
        fill="#4ade80"
        stroke="rgba(15, 14, 14, 1)"
        strokeWidth="1.5"
      />
    </svg>
  );
}

/* ── Icons ───────────────────────────────────────────────────────── */

function ArrowUpRight() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <line x1="7" y1="17" x2="17" y2="7" />
      <polyline points="7 7 17 7 17 17" />
    </svg>
  );
}

function actionProps() {
  return {
    width: 16,
    height: 16,
    viewBox: "0 0 24 24",
    fill: "none" as const,
    stroke: "currentColor",
    strokeWidth: 1.6,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
}
function IconUp() {
  return (
    <svg {...actionProps()} aria-hidden="true">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" y1="3" x2="12" y2="15" />
    </svg>
  );
}
function IconStack() {
  return (
    <svg {...actionProps()} aria-hidden="true">
      <rect x="3" y="6" width="18" height="14" rx="2" />
      <path d="M3 10h18" />
      <path d="M9 6V4h6v2" />
    </svg>
  );
}
function IconCompass() {
  return (
    <svg {...actionProps()} aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <polygon
        points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"
        fill="currentColor"
        fillOpacity="0.18"
      />
    </svg>
  );
}
function IconBell() {
  return (
    <svg {...actionProps()} aria-hidden="true">
      <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  );
}
