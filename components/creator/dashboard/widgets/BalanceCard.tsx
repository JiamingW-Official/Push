"use client";

/* Repo target: components/creator/dashboard/widgets/BalanceCard.tsx
   Lumin-style dark hero card: total balance numeral + 4-action quad +
   spending progress + currency rows. Anchors the dashboard's top-left.
   Replaces the v2 EarningsAmbient as the financial hero. */

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

  /* Spending-style progress: this cycle vs target ($300/cycle is the
     average Operator-tier earner — matches push-creator skill). */
  const cycleTarget = 300;
  const cyclePct = Math.max(
    8,
    Math.min(100, Math.round((total / cycleTarget) * 100)),
  );

  /* Last week's payout total + WoW from sparkline */
  const data = buildSparkData(payouts, 8);
  const lastTwo = data.slice(-2);
  const wow =
    lastTwo[0] > 0
      ? Math.round(((lastTwo[1] - lastTwo[0]) / lastTwo[0]) * 100)
      : null;

  /* Format with cents-as-superscript for the Lumin look */
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

      <div className="dh-balance__num">
        <span className="dh-balance__dollar">$</span>
        <span className="dh-balance__main">
          {dollars.toLocaleString("en-US")}
        </span>
        <span className="dh-balance__cents">.{cents}</span>
      </div>

      <div className="dh-balance__quad" role="group" aria-label="Quick actions">
        <Link
          href="/creator/earnings"
          className="dh-balance__action"
          aria-label="Withdraw"
        >
          <IconUpload />
        </Link>
        <Link
          href="/creator/work"
          className="dh-balance__action"
          aria-label="View pipeline"
        >
          <IconDownload />
        </Link>
        <Link
          href="/creator/discover"
          className="dh-balance__action"
          aria-label="Discover"
        >
          <IconExchange />
        </Link>
        <Link
          href="/creator/inbox"
          className="dh-balance__action"
          aria-label="Activity"
        >
          <IconArchive />
        </Link>
      </div>

      <div className="dh-balance__cycle">
        <div className="dh-balance__cycle-label">
          <span>This cycle</span>
          {wow !== null && wow !== 0 && (
            <span
              className={"dh-balance__delta " + (wow > 0 ? "is-up" : "is-down")}
            >
              {wow > 0 ? "▲" : "▼"} {Math.abs(wow)}%
            </span>
          )}
        </div>
        <div className="dh-balance__bar">
          <div
            className="dh-balance__bar-fill"
            style={{ width: `${cyclePct}%` }}
          />
        </div>
        <div className="dh-balance__cycle-foot">
          <span className="dh-balance__cycle-amt">
            {formatCurrencyExact(total)}
          </span>
          <span className="dh-balance__cycle-target">
            of {formatCurrencyExact(cycleTarget)} target
          </span>
        </div>
      </div>

      <div className="dh-balance__rows">
        <div className="dh-balance__row">
          <span className="dh-balance__row-icon">$</span>
          <span className="dh-balance__row-amt">
            {formatCurrencyExact(total)}
          </span>
          <span className="dh-balance__row-label">VERIFIED</span>
        </div>
        <div className="dh-balance__row">
          <span className="dh-balance__row-icon">◔</span>
          <span className="dh-balance__row-amt">
            {formatCurrencyExact(pending)}
          </span>
          <span className="dh-balance__row-label">PENDING</span>
        </div>
      </div>
    </div>
  );
}

/* ── Circle-arrow ─────────────────────────────────────────────────── */

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

/* ── Action-quad icons (16px, stroke 1.6) ─────────────────────────── */

function actionProps() {
  return {
    width: 18,
    height: 18,
    viewBox: "0 0 24 24",
    fill: "none" as const,
    stroke: "currentColor",
    strokeWidth: 1.6,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
}
function IconUpload() {
  return (
    <svg {...actionProps()} aria-hidden="true">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" y1="3" x2="12" y2="15" />
    </svg>
  );
}
function IconDownload() {
  return (
    <svg {...actionProps()} aria-hidden="true">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
}
function IconExchange() {
  return (
    <svg {...actionProps()} aria-hidden="true">
      <polyline points="17 1 21 5 17 9" />
      <path d="M3 11V9a4 4 0 0 1 4-4h14" />
      <polyline points="7 23 3 19 7 15" />
      <path d="M21 13v2a4 4 0 0 1-4 4H3" />
    </svg>
  );
}
function IconArchive() {
  return (
    <svg {...actionProps()} aria-hidden="true">
      <polyline points="21 8 21 21 3 21 3 8" />
      <rect x="1" y="3" width="22" height="5" />
      <line x1="10" y1="12" x2="14" y2="12" />
    </svg>
  );
}
