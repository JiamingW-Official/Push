"use client";

/* ============================================================
   /creator/money/earnings — earnings deep-dive. v2 (2026-05-08)

   Fintech analytics page: hero + 4-up KPI ribbon + interactive
   TimeChart (line w/ prior overlay) + Donut split + per-campaign
   table + tier-impact callout. All numbers align with hub Money
   page ($87/week · $412/month · $1,240/quarter · $2,080 lifetime).
   ============================================================ */

import Link from "next/link";
import { useState } from "react";
import {
  ArrowLeft,
  TrendingUp,
  DollarSign,
  Sparkles,
  Camera,
  Briefcase,
  ArrowUpRight,
  Trophy,
} from "lucide-react";
import TimeChart from "@/components/shared/charts/TimeChart";
import Donut from "@/components/shared/charts/Donut";
import "./earnings.css";

type Period = "7d" | "30d" | "90d" | "all";

const PERIOD_TOTALS: Record<
  Period,
  { total: number; prior: number; label: string }
> = {
  "7d": { total: 87, prior: 72, label: "This week" },
  "30d": { total: 412, prior: 348, label: "This month" },
  "90d": { total: 1_240, prior: 980, label: "This quarter" },
  all: { total: 2_080, prior: 0, label: "Lifetime" },
};

type Campaign = {
  name: string;
  merchant: string;
  base: number;
  commission: number;
  bonus: number;
  scans: number;
  closed: string;
};

const CAMPAIGNS: Campaign[] = [
  {
    name: "Shoot · 3-frame",
    merchant: "Roberta's Pizza",
    base: 30,
    commission: 12,
    bonus: 0,
    scans: 142,
    closed: "May 6",
  },
  {
    name: "Post · disclose",
    merchant: "Devoción Coffee",
    base: 25,
    commission: 8,
    bonus: 0,
    scans: 96,
    closed: "May 4",
  },
  {
    name: "Shoot · brand",
    merchant: "Brow Theory",
    base: 30,
    commission: 0,
    bonus: 0,
    scans: 0,
    closed: "May 1",
  },
  {
    name: "Weekly bonus",
    merchant: "50-scan threshold",
    base: 0,
    commission: 0,
    bonus: 15,
    scans: 0,
    closed: "Apr 29",
  },
  {
    name: "Shoot · launch",
    merchant: "Cafe Reggio",
    base: 30,
    commission: 18,
    bonus: 0,
    scans: 178,
    closed: "Apr 22",
  },
];

export default function MoneyEarnings() {
  const [period, setPeriod] = useState<Period>("30d");
  const meta = PERIOD_TOTALS[period];
  const delta =
    meta.prior > 0 ? ((meta.total - meta.prior) / meta.prior) * 100 : 0;

  // Aggregate campaigns visible for the selected period
  const visibleCampaigns =
    period === "7d"
      ? CAMPAIGNS.slice(0, 3)
      : period === "30d"
        ? CAMPAIGNS
        : CAMPAIGNS.concat(CAMPAIGNS.slice(0, 3)); // synthetic extra for 90d/all

  const splitTotals = visibleCampaigns.reduce(
    (acc, c) => ({
      base: acc.base + c.base,
      commission: acc.commission + c.commission,
      bonus: acc.bonus + c.bonus,
    }),
    { base: 0, commission: 0, bonus: 0 },
  );

  const totalScans = visibleCampaigns.reduce((a, c) => a + c.scans, 0);
  const avgPerShoot = visibleCampaigns.length
    ? Math.round(meta.total / visibleCampaigns.length)
    : 0;
  const perScan =
    totalScans > 0 ? (meta.total / totalScans).toFixed(2) : "0.00";

  return (
    <main className="me-page" aria-label="Earnings deep-dive">
      <header className="me-hero">
        <div className="me-hero__left">
          <Link href="/creator/money" className="hub-back">
            <ArrowLeft size={14} strokeWidth={2.25} />
            Money
          </Link>
          <h1 className="me-hero__title">Earnings</h1>
          <p className="me-hero__sub">
            ${meta.total.toLocaleString()} {meta.label.toLowerCase()} ·{" "}
            {delta >= 0 ? "↑" : "↓"} {Math.abs(delta).toFixed(1)}% vs prior ·
            avg ${avgPerShoot}/shoot · ${perScan}/scan
          </p>
        </div>
        <div className="me-hero__right">
          <div className="me-period-chips" role="tablist" aria-label="Period">
            {(Object.keys(PERIOD_TOTALS) as Period[]).map((p) => (
              <button
                key={p}
                type="button"
                role="tab"
                aria-selected={period === p}
                className={
                  "me-period-chip" + (period === p ? " is-active" : "")
                }
                onClick={() => setPeriod(p)}
              >
                {p === "all" ? "ALL" : p.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* ── 4-up KPI ribbon ────────────────────────────────── */}
      <section className="me-ribbon">
        <article className="me-kpi me-kpi--hero">
          <p className="me-kpi__lbl">
            <DollarSign size={13} strokeWidth={2.25} />
            Total earned
          </p>
          <p className="me-kpi__num">${meta.total.toLocaleString()}</p>
          <p
            className={
              "me-kpi__delta " +
              (delta >= 0 ? "me-kpi__delta--up" : "me-kpi__delta--down")
            }
          >
            {delta >= 0 ? "↑" : "↓"} {Math.abs(delta).toFixed(1)}%
          </p>
        </article>

        <article className="me-kpi">
          <p className="me-kpi__lbl">
            <Briefcase size={13} strokeWidth={2.25} />
            Avg per shoot
          </p>
          <p className="me-kpi__num">${avgPerShoot}</p>
          <p className="me-kpi__sub">{visibleCampaigns.length} campaigns</p>
        </article>

        <article className="me-kpi">
          <p className="me-kpi__lbl">
            <Camera size={13} strokeWidth={2.25} />
            Per scan
          </p>
          <p className="me-kpi__num">${perScan}</p>
          <p className="me-kpi__sub">{totalScans.toLocaleString()} verified</p>
        </article>

        <article className="me-kpi me-kpi--bonus">
          <p className="me-kpi__lbl">
            <Sparkles size={13} strokeWidth={2.25} />
            Milestones hit
          </p>
          <p className="me-kpi__num">{splitTotals.bonus > 0 ? "1" : "0"}</p>
          <p className="me-kpi__sub">+${splitTotals.bonus} bonus unlocked</p>
        </article>
      </section>

      {/* ── Trend chart + Donut split ──────────────────────── */}
      <section className="me-grid">
        <article className="me-panel me-panel--chart">
          <header className="me-panel__head">
            <p className="me-panel__eyebrow">Trend · with prior overlay</p>
            <h2 className="me-panel__title">Earnings over time</h2>
          </header>
          <TimeChart
            accent="blue"
            valuePrefix="$"
            defaultPeriod={period}
            mode="line"
            data={{
              "7d": [12, 0, 18, 0, 25, 14, 18],
              "30d": [
                14, 0, 18, 22, 0, 12, 8, 24, 16, 0, 14, 28, 18, 12, 0, 22, 14,
                18, 0, 16, 24, 12, 0, 18, 22, 16, 8, 14, 18, 5,
              ],
              "90d": Array.from({ length: 90 }, (_, i) => {
                const dow = i % 7;
                if (dow === 1 || dow === 4) return 0;
                return Math.max(0, Math.round(14 + Math.sin(i * 0.4) * 8));
              }),
              all: Array.from({ length: 52 }, (_, i) =>
                Math.max(20, Math.round(40 + Math.sin(i * 0.3) * 12)),
              ),
            }}
            priorData={{
              "7d": [10, 0, 14, 0, 22, 12, 14],
              "30d": Array.from({ length: 30 }, (_, i) =>
                Math.max(0, Math.round(10 + Math.sin(i * 0.6) * 6)),
              ),
              "90d": Array.from({ length: 90 }, (_, i) => {
                const dow = i % 7;
                if (dow === 1 || dow === 4) return 0;
                return Math.max(0, Math.round(11 + Math.sin(i * 0.4) * 6));
              }),
              all: Array.from({ length: 52 }, (_, i) =>
                Math.max(15, Math.round(30 + Math.sin(i * 0.3) * 10)),
              ),
            }}
            labels={{
              "7d": ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
              "30d": Array.from({ length: 30 }, (_, i) =>
                i % 5 === 0 ? `D${i + 1}` : "",
              ),
              "90d": Array.from({ length: 90 }, (_, i) =>
                i % 30 === 0 ? `M${i / 30 + 1}` : "",
              ),
              all: Array.from({ length: 52 }, (_, i) =>
                i % 13 === 0 ? `Q${Math.floor(i / 13) + 1}` : "",
              ),
            }}
            ariaLabel="Earnings trend with prior period overlay"
          />
        </article>

        <article className="me-panel me-panel--split">
          <header className="me-panel__head">
            <p className="me-panel__eyebrow">Split by source</p>
            <h2 className="me-panel__title">Where ${meta.total} came from</h2>
          </header>
          <Donut
            ariaLabel="Earnings split"
            valuePrefix="$"
            total={
              splitTotals.base + splitTotals.commission + splitTotals.bonus
            }
            segments={[
              { label: "Base pay", value: splitTotals.base, color: "#14130f" },
              {
                label: "Commission",
                value: splitTotals.commission,
                color: "#0085ff",
              },
              { label: "Bonus", value: splitTotals.bonus, color: "#bfa170" },
            ].filter((s) => s.value > 0)}
          />
        </article>
      </section>

      {/* ── Campaign-level table ───────────────────────────── */}
      <section className="me-section">
        <header className="me-section__head">
          <p className="me-section__eyebrow">
            By campaign · {visibleCampaigns.length} closed
          </p>
          <h2 className="me-section__title">Per-campaign earnings</h2>
        </header>
        <div className="me-table" role="table" aria-label="Campaign earnings">
          <div className="me-table__head" role="row">
            <span role="columnheader">Campaign</span>
            <span role="columnheader" className="me-table__num">
              Base
            </span>
            <span role="columnheader" className="me-table__num">
              Comm.
            </span>
            <span role="columnheader" className="me-table__num">
              Bonus
            </span>
            <span role="columnheader" className="me-table__num">
              Scans
            </span>
            <span role="columnheader" className="me-table__num">
              Total
            </span>
            <span role="columnheader">Closed</span>
          </div>
          {visibleCampaigns.map((c, i) => {
            const total = c.base + c.commission + c.bonus;
            return (
              <div key={`${c.name}-${i}`} className="me-table__row" role="row">
                <span role="cell" className="me-table__name">
                  <span className="me-table__merchant">{c.merchant}</span>
                  <span className="me-table__type">{c.name}</span>
                </span>
                <span role="cell" className="me-table__num">
                  ${c.base}
                </span>
                <span role="cell" className="me-table__num me-table__num--blue">
                  ${c.commission}
                </span>
                <span role="cell" className="me-table__num me-table__num--gold">
                  ${c.bonus}
                </span>
                <span role="cell" className="me-table__num me-table__scans">
                  {c.scans}
                </span>
                <span role="cell" className="me-table__num me-table__total">
                  ${total}
                </span>
                <span role="cell" className="me-table__date">
                  {c.closed}
                </span>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── Tier impact callout ────────────────────────────── */}
      <section className="me-section">
        <article className="me-tier-card">
          <span className="me-tier-card__icon">
            <Trophy size={20} strokeWidth={1.75} />
          </span>
          <div className="me-tier-card__copy">
            <p className="me-tier-card__eyebrow">
              Tier impact · what changes at Proven
            </p>
            <h2 className="me-tier-card__title">
              ${(meta.total * 1.4).toFixed(0)} estimated at Proven tier
            </h2>
            <p className="me-tier-card__body">
              At Operator (current) commission is 5%. Proven tier unlocks{" "}
              <strong>8% commission</strong> +{" "}
              <strong>$40-80 base/campaign</strong> (vs $25-40 current). Same{" "}
              {visibleCampaigns.length} campaigns at Proven would pay ~$
              {(meta.total * 1.4).toFixed(0)} (+{Math.round(40)}%).
            </p>
            <Link href="/creator/analytics/tier" className="me-tier-card__link">
              Tier ladder <ArrowUpRight size={14} strokeWidth={2.25} />
            </Link>
          </div>
        </article>
      </section>
    </main>
  );
}
