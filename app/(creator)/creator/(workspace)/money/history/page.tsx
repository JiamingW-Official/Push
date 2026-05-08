"use client";

/* ============================================================
   /creator/money/history — full transaction ledger. v2 (2026-05-08)

   Bank-statement-grade ledger. Cumulative TimeChart up top, filter
   chips (All / Payouts / Bonuses / Fees / Refunds), full ledger
   table with running balance, monthly summary cards bottom.
   ============================================================ */

import Link from "next/link";
import { useState, useMemo } from "react";
import {
  ArrowLeft,
  Receipt,
  Download,
  TrendingUp,
  ArrowUpCircle,
  ArrowDownCircle,
  Sparkles,
  Calendar,
  Search,
} from "lucide-react";
import TimeChart from "@/components/shared/charts/TimeChart";
import "./history.css";

type TxnKind = "payout" | "bonus" | "fee" | "refund";
type TxnStatus = "cleared" | "processing" | "scheduled";

type Txn = {
  id: string;
  date: string;
  iso: string;
  merchant: string;
  description: string;
  kind: TxnKind;
  amount: number;
  status: TxnStatus;
  balance: number;
};

// 24 entries spanning past 8 weeks, oldest first → reverse render
const RAW: Omit<Txn, "balance">[] = [
  {
    id: "t01",
    date: "Mar 18",
    iso: "2026-03-18",
    merchant: "Profile complete",
    description: "First-7-days bonus",
    kind: "bonus",
    amount: 10,
    status: "cleared",
  },
  {
    id: "t02",
    date: "Mar 22",
    iso: "2026-03-22",
    merchant: "Joe's Pizza",
    description: "Shoot · base pay",
    kind: "payout",
    amount: 25,
    status: "cleared",
  },
  {
    id: "t03",
    date: "Mar 22",
    iso: "2026-03-22",
    merchant: "Stripe",
    description: "Payout fee · 2.9%",
    kind: "fee",
    amount: -1,
    status: "cleared",
  },
  {
    id: "t04",
    date: "Mar 26",
    iso: "2026-03-26",
    merchant: "Devoción",
    description: "Shoot · base pay",
    kind: "payout",
    amount: 25,
    status: "cleared",
  },
  {
    id: "t05",
    date: "Mar 29",
    iso: "2026-03-29",
    merchant: "Devoción",
    description: "Commission · 5%",
    kind: "payout",
    amount: 6,
    status: "cleared",
  },
  {
    id: "t06",
    date: "Apr 02",
    iso: "2026-04-02",
    merchant: "Cafe Reggio",
    description: "Shoot · base pay",
    kind: "payout",
    amount: 30,
    status: "cleared",
  },
  {
    id: "t07",
    date: "Apr 05",
    iso: "2026-04-05",
    merchant: "Cafe Reggio",
    description: "Commission · 5%",
    kind: "payout",
    amount: 18,
    status: "cleared",
  },
  {
    id: "t08",
    date: "Apr 08",
    iso: "2026-04-08",
    merchant: "Roberta's Pizza",
    description: "Shoot · base pay",
    kind: "payout",
    amount: 30,
    status: "cleared",
  },
  {
    id: "t09",
    date: "Apr 11",
    iso: "2026-04-11",
    merchant: "Profile-complete",
    description: "Onboarding bonus",
    kind: "bonus",
    amount: 10,
    status: "cleared",
  },
  {
    id: "t10",
    date: "Apr 14",
    iso: "2026-04-14",
    merchant: "Roberta's Pizza",
    description: "Commission · 5%",
    kind: "payout",
    amount: 12,
    status: "cleared",
  },
  {
    id: "t11",
    date: "Apr 18",
    iso: "2026-04-18",
    merchant: "Weekly bonus",
    description: "50-scan threshold",
    kind: "bonus",
    amount: 25,
    status: "cleared",
  },
  {
    id: "t12",
    date: "Apr 20",
    iso: "2026-04-20",
    merchant: "Brow Theory",
    description: "Shoot · base pay",
    kind: "payout",
    amount: 30,
    status: "cleared",
  },
  {
    id: "t13",
    date: "Apr 22",
    iso: "2026-04-22",
    merchant: "Cafe Reggio",
    description: "Repeat bonus",
    kind: "bonus",
    amount: 15,
    status: "cleared",
  },
  {
    id: "t14",
    date: "Apr 24",
    iso: "2026-04-24",
    merchant: "First-shoot",
    description: "Tier-up Operator",
    kind: "bonus",
    amount: 50,
    status: "cleared",
  },
  {
    id: "t15",
    date: "Apr 28",
    iso: "2026-04-28",
    merchant: "Roberta's Pizza",
    description: "Shoot · base pay",
    kind: "payout",
    amount: 30,
    status: "scheduled",
  },
  {
    id: "t16",
    date: "Apr 29",
    iso: "2026-04-29",
    merchant: "Weekly bonus",
    description: "50-scan threshold",
    kind: "bonus",
    amount: 15,
    status: "scheduled",
  },
  {
    id: "t17",
    date: "Apr 30",
    iso: "2026-04-30",
    merchant: "Devoción",
    description: "Post · commission 5%",
    kind: "payout",
    amount: 12,
    status: "scheduled",
  },
  {
    id: "t18",
    date: "May 01",
    iso: "2026-05-01",
    merchant: "Weekly bonus",
    description: "50-scan threshold",
    kind: "bonus",
    amount: 25,
    status: "cleared",
  },
  {
    id: "t19",
    date: "May 02",
    iso: "2026-05-02",
    merchant: "Stripe",
    description: "Payout fee · 2.9%",
    kind: "fee",
    amount: -1,
    status: "cleared",
  },
  {
    id: "t20",
    date: "May 04",
    iso: "2026-05-04",
    merchant: "Brow Theory",
    description: "Shoot · base pay",
    kind: "payout",
    amount: 30,
    status: "processing",
  },
  {
    id: "t21",
    date: "May 06",
    iso: "2026-05-06",
    merchant: "Roberta's Pizza",
    description: "Commission · 5%",
    kind: "payout",
    amount: 12,
    status: "processing",
  },
  {
    id: "t22",
    date: "May 06",
    iso: "2026-05-06",
    merchant: "Joe's Pizza",
    description: "Refund · cancelled gig",
    kind: "refund",
    amount: -25,
    status: "cleared",
  },
  {
    id: "t23",
    date: "May 07",
    iso: "2026-05-07",
    merchant: "Cafe Reggio",
    description: "Shoot · launch",
    kind: "payout",
    amount: 48,
    status: "scheduled",
  },
  {
    id: "t24",
    date: "May 07",
    iso: "2026-05-07",
    merchant: "Stripe",
    description: "Payout fee · 2.9%",
    kind: "fee",
    amount: -2,
    status: "scheduled",
  },
];

const KIND_META: Record<TxnKind, { label: string; color: string }> = {
  payout: { label: "Payout", color: "#0085ff" },
  bonus: { label: "Bonus", color: "#bfa170" },
  fee: { label: "Fee", color: "#c1121f" },
  refund: { label: "Refund", color: "#61605c" },
};

type Filter = "all" | TxnKind;

const FILTERS: { key: Filter; label: string }[] = [
  { key: "all", label: "All" },
  { key: "payout", label: "Payouts" },
  { key: "bonus", label: "Bonuses" },
  { key: "fee", label: "Fees" },
  { key: "refund", label: "Refunds" },
];

export default function MoneyHistory() {
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");

  // Build txns w/ running balance (oldest → newest)
  const allTxns: Txn[] = useMemo(() => {
    let bal = 0;
    return RAW.map((r) => {
      bal += r.amount;
      return { ...r, balance: bal };
    });
  }, []);

  const totalIn = RAW.filter((r) => r.amount > 0).reduce(
    (a, r) => a + r.amount,
    0,
  );
  const totalOut = Math.abs(
    RAW.filter((r) => r.amount < 0).reduce((a, r) => a + r.amount, 0),
  );
  const netCleared = RAW.filter((r) => r.status === "cleared").reduce(
    (a, r) => a + r.amount,
    0,
  );
  const inFlight = RAW.filter((r) => r.status !== "cleared").reduce(
    (a, r) => a + r.amount,
    0,
  );

  const visible = allTxns
    .filter((t) => filter === "all" || t.kind === filter)
    .filter((t) => {
      if (!query) return true;
      const q = query.toLowerCase();
      return (
        t.merchant.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q)
      );
    })
    .reverse();

  // Cumulative for chart - 24 entries → cumulative balance per txn
  const cumulative = allTxns.map((t) => t.balance);
  const flat = allTxns.map((t) => t.amount);

  // Monthly buckets
  const monthly = useMemo(() => {
    const map: Record<string, { in: number; out: number; count: number }> = {};
    for (const t of allTxns) {
      const m = t.iso.slice(0, 7);
      if (!map[m]) map[m] = { in: 0, out: 0, count: 0 };
      if (t.amount > 0) map[m].in += t.amount;
      else map[m].out += Math.abs(t.amount);
      map[m].count++;
    }
    return Object.entries(map)
      .sort(([a], [b]) => b.localeCompare(a))
      .map(([month, v]) => ({ month, ...v, net: v.in - v.out }));
  }, [allTxns]);

  return (
    <main className="mh-page" aria-label="Transaction history">
      <header className="mh-hero">
        <div className="mh-hero__left">
          <Link href="/creator/money" className="hub-back">
            <ArrowLeft size={14} strokeWidth={2.25} />
            Money
          </Link>
          <h1 className="mh-hero__title">History</h1>
          <p className="mh-hero__sub">
            {allTxns.length} transactions · ${totalIn} in · ${totalOut} out ·
            net <strong>${totalIn - totalOut}</strong>
          </p>
        </div>
        <div className="mh-hero__right">
          <button type="button" className="mh-export">
            <Download size={14} strokeWidth={2.25} />
            Export CSV
          </button>
        </div>
      </header>

      {/* ── 4-up KPI ribbon ──────────────────────────────── */}
      <section className="mh-ribbon">
        <article className="mh-stat mh-stat--hero">
          <p className="mh-stat__lbl">
            <Receipt size={14} strokeWidth={2.25} />
            Net cleared
          </p>
          <p className="mh-stat__num">${netCleared}</p>
          <p className="mh-stat__meta">All settled & in account</p>
        </article>

        <article className="mh-stat">
          <p className="mh-stat__lbl">
            <ArrowDownCircle size={14} strokeWidth={2.25} />
            Money in
          </p>
          <p className="mh-stat__num mh-stat__num--up">+${totalIn}</p>
          <p className="mh-stat__meta">
            {RAW.filter((r) => r.amount > 0).length} credits
          </p>
        </article>

        <article className="mh-stat">
          <p className="mh-stat__lbl">
            <ArrowUpCircle size={14} strokeWidth={2.25} />
            Money out
          </p>
          <p className="mh-stat__num mh-stat__num--down">−${totalOut}</p>
          <p className="mh-stat__meta">
            {RAW.filter((r) => r.kind === "fee").length} fees ·{" "}
            {RAW.filter((r) => r.kind === "refund").length} refund
          </p>
        </article>

        <article className="mh-stat mh-stat--inflight">
          <p className="mh-stat__lbl">
            <Sparkles size={14} strokeWidth={2.25} />
            In flight
          </p>
          <p className="mh-stat__num">${inFlight}</p>
          <p className="mh-stat__meta">
            {RAW.filter((r) => r.status !== "cleared").length} pending settle
          </p>
        </article>
      </section>

      {/* ── Cumulative chart ───────────────────────────── */}
      <section className="mh-chart-wrap">
        <header className="mh-section__head">
          <p className="mh-section__eyebrow">Running balance · 8 weeks</p>
          <h2 className="mh-section__title">Account growth</h2>
        </header>
        <div className="mh-chart-card">
          <TimeChart
            accent="ink"
            valuePrefix="$"
            defaultPeriod="all"
            mode="line"
            data={{
              "7d": cumulative.slice(-7),
              "30d": cumulative.slice(-Math.min(30, cumulative.length)),
              "90d": cumulative,
              all: cumulative,
            }}
            labels={{
              "7d": allTxns.slice(-7).map((t) => t.date),
              "30d": allTxns
                .slice(-Math.min(30, cumulative.length))
                .map((t, i, arr) =>
                  i % 4 === 0 || i === arr.length - 1 ? t.date : "",
                ),
              "90d": allTxns.map((t, i, arr) =>
                i % 4 === 0 || i === arr.length - 1 ? t.date : "",
              ),
              all: allTxns.map((t, i, arr) =>
                i % 4 === 0 || i === arr.length - 1 ? t.date : "",
              ),
            }}
            ariaLabel="Running balance over time"
          />
        </div>
      </section>

      {/* ── Filter + search row ──────────────────────────── */}
      <section className="mh-toolbar">
        <div className="mh-filters" role="tablist" aria-label="Filter by kind">
          {FILTERS.map((f) => {
            const count =
              f.key === "all"
                ? allTxns.length
                : allTxns.filter((t) => t.kind === f.key).length;
            return (
              <button
                key={f.key}
                type="button"
                role="tab"
                aria-selected={filter === f.key}
                className={"mh-filter" + (filter === f.key ? " is-active" : "")}
                onClick={() => setFilter(f.key)}
              >
                {f.label}
                <span className="mh-filter__count">{count}</span>
              </button>
            );
          })}
        </div>
        <label className="mh-search">
          <Search size={14} strokeWidth={2.25} />
          <input
            type="search"
            placeholder="Search merchant or description"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search transactions"
          />
        </label>
      </section>

      {/* ── Ledger table ─────────────────────────────────── */}
      <section className="mh-section">
        <div className="mh-table" role="table" aria-label="Transactions">
          <div className="mh-table__head" role="row">
            <span role="columnheader">Date</span>
            <span role="columnheader">Description</span>
            <span role="columnheader">Kind</span>
            <span role="columnheader" className="mh-table__num">
              Amount
            </span>
            <span role="columnheader" className="mh-table__num">
              Balance
            </span>
            <span role="columnheader">Status</span>
          </div>
          {visible.length === 0 ? (
            <div className="mh-table__empty">
              No transactions match your filter.
            </div>
          ) : (
            visible.map((t) => {
              const meta = KIND_META[t.kind];
              const isCredit = t.amount > 0;
              return (
                <div key={t.id} className="mh-table__row" role="row">
                  <span role="cell" className="mh-table__date">
                    <Calendar size={11} strokeWidth={2.25} />
                    {t.date}
                  </span>
                  <span role="cell" className="mh-table__desc">
                    <span className="mh-table__merchant">{t.merchant}</span>
                    <span className="mh-table__sub">{t.description}</span>
                  </span>
                  <span role="cell" className="mh-table__kind">
                    <span
                      className="mh-table__dot"
                      style={{ background: meta.color }}
                    />
                    {meta.label}
                  </span>
                  <span
                    role="cell"
                    className={
                      "mh-table__num mh-table__amount " +
                      (isCredit
                        ? "mh-table__amount--up"
                        : "mh-table__amount--down")
                    }
                  >
                    {isCredit ? "+" : "−"}${Math.abs(t.amount)}
                  </span>
                  <span role="cell" className="mh-table__num mh-table__balance">
                    ${t.balance}
                  </span>
                  <span
                    role="cell"
                    className={"mh-table__status mh-table__status--" + t.status}
                  >
                    {t.status === "cleared"
                      ? "Cleared"
                      : t.status === "processing"
                        ? "Processing"
                        : "Scheduled"}
                  </span>
                </div>
              );
            })
          )}
        </div>
      </section>

      {/* ── Monthly summary ───────────────────────────────── */}
      <section className="mh-section">
        <header className="mh-section__head">
          <p className="mh-section__eyebrow">
            Monthly summary · {monthly.length} months
          </p>
          <h2 className="mh-section__title">By month</h2>
        </header>
        <div className="mh-monthly">
          {monthly.map((m) => {
            const date = new Date(m.month + "-01");
            const label = date.toLocaleDateString("en-US", {
              month: "short",
              year: "numeric",
            });
            return (
              <article key={m.month} className="mh-month">
                <p className="mh-month__lbl">{label}</p>
                <p className="mh-month__net">${m.net}</p>
                <div className="mh-month__split">
                  <span className="mh-month__in">+${m.in}</span>
                  <span className="mh-month__out">−${m.out}</span>
                </div>
                <p className="mh-month__count">{m.count} transactions</p>
              </article>
            );
          })}
        </div>
      </section>
    </main>
  );
}
