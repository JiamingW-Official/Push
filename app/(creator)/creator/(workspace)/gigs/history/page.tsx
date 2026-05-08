"use client";

/* ============================================================
   /creator/gigs/history — Closed gig ledger.
   v2 (2026-05-08, modular rewrite, macOS 26 visuals)

   Layout:
     1. HERO              ← Gigs · "History" + sub
     2. KPI STRIP         lifetime · paid count · avg payout · hit rate
     3. FILTER + SEARCH   All / Paid / Declined  +  search box
     4. MONTH GROUPS      grouped list with HistoryRow cards
   ============================================================ */

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Search,
  Archive,
  CheckCircle2,
  XCircle,
  Sparkles,
  TrendingUp,
  Trophy,
  Wallet,
} from "lucide-react";
import { useHistory, type HistoryRow } from "@/lib/data/hooks";
import "@/components/creator/gigs/gig-modules.css";
import "./history-v2.css";

type StatusFilter = "all" | "paid" | "declined" | "completed";

function fmtDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

function monthKey(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

const TIER_COLORS: Record<HistoryRow["outcomeTier"], string> = {
  Guaranteed: "#2d6e4a",
  Target: "#0085ff",
  Stretch: "#8a704a",
};

export default function HistoryPage() {
  const { data, isLoading, error } = useHistory();
  if (error) throw error;

  const [filter, setFilter] = useState<StatusFilter>("all");
  const [query, setQuery] = useState("");

  const all = data ?? [];
  const paidRows = all.filter((r) => r.status === "paid");

  const lifetimeEarned = paidRows.reduce((sum, r) => sum + r.finalPayout, 0);
  const avgPayout = paidRows.length
    ? Math.round(lifetimeEarned / paidRows.length)
    : 0;
  const stretchHits = paidRows.filter(
    (r) => r.outcomeTier === "Stretch",
  ).length;
  const targetHits = paidRows.filter((r) => r.outcomeTier === "Target").length;
  const hitRate = paidRows.length
    ? Math.round(((stretchHits + targetHits) / paidRows.length) * 100)
    : 0;

  const visible = useMemo(() => {
    let list = all;
    if (filter !== "all") list = list.filter((r) => r.status === filter);
    const q = query.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (r) =>
          r.brand.toLowerCase().includes(q) ||
          r.campaign.toLowerCase().includes(q) ||
          r.category.toLowerCase().includes(q),
      );
    }
    return [...list].sort((a, b) => b.paidAt.localeCompare(a.paidAt));
  }, [all, filter, query]);

  const grouped = useMemo(() => {
    const map: Record<string, HistoryRow[]> = {};
    for (const r of visible) {
      const k = monthKey(r.paidAt);
      if (!map[k]) map[k] = [];
      map[k].push(r);
    }
    return Object.entries(map);
  }, [visible]);

  const counts = {
    all: all.length,
    paid: all.filter((r) => r.status === "paid").length,
    declined: all.filter((r) => r.status === "declined").length,
    completed: all.filter((r) => r.status === "completed").length,
  };

  return (
    <main className="hst" aria-label="Gig history">
      <header className="hst__hero">
        <Link href="/creator/gigs" className="hub-back">
          <ArrowLeft size={14} strokeWidth={2.25} />
          Gigs
        </Link>
        <div className="hst__hero-row">
          <div>
            <h1 className="hst__title">History</h1>
            <p className="hst__sub">
              <strong>{paidRows.length}</strong> paid · $
              {lifetimeEarned.toLocaleString()} lifetime · {hitRate}% hit
              Target+ tier
            </p>
          </div>
        </div>
      </header>

      {/* ── KPI Strip ───────────────────────────────── */}
      <section className="hst__kpis" aria-label="Lifetime KPIs">
        <article className="hst__kpi hst__kpi--ink">
          <span className="hst__kpi-icon">
            <Wallet size={16} strokeWidth={2.25} />
          </span>
          <span className="hst__kpi-num">
            ${lifetimeEarned.toLocaleString()}
          </span>
          <span className="hst__kpi-lbl">
            Lifetime earned
            <span className="hst__kpi-sub">{paidRows.length} paid gigs</span>
          </span>
        </article>
        <article className="hst__kpi hst__kpi--blue">
          <span className="hst__kpi-icon">
            <TrendingUp size={16} strokeWidth={2.25} />
          </span>
          <span className="hst__kpi-num">${avgPayout}</span>
          <span className="hst__kpi-lbl">
            Avg per gig
            <span className="hst__kpi-sub">across all paid</span>
          </span>
        </article>
        <article className="hst__kpi hst__kpi--gold">
          <span className="hst__kpi-icon">
            <Sparkles size={16} strokeWidth={2.25} />
          </span>
          <span className="hst__kpi-num">{stretchHits}</span>
          <span className="hst__kpi-lbl">
            Stretch hits
            <span className="hst__kpi-sub">top tier unlocked</span>
          </span>
        </article>
        <article className="hst__kpi hst__kpi--green">
          <span className="hst__kpi-icon">
            <Trophy size={16} strokeWidth={2.25} />
          </span>
          <span className="hst__kpi-num">{hitRate}%</span>
          <span className="hst__kpi-lbl">
            Target+ rate
            <span className="hst__kpi-sub">
              {targetHits + stretchHits} of {paidRows.length}
            </span>
          </span>
        </article>
      </section>

      {/* ── Filter + Search ─────────────────────────── */}
      <section className="hst__toolbar">
        <div className="hst__filters" role="tablist" aria-label="Status filter">
          {(["all", "paid", "completed", "declined"] as StatusFilter[]).map(
            (f) => (
              <button
                key={f}
                role="tab"
                type="button"
                aria-selected={filter === f}
                className={
                  "hst__filter-btn" + (filter === f ? " is-active" : "")
                }
                onClick={() => setFilter(f)}
              >
                {f === "all"
                  ? "All"
                  : f === "paid"
                    ? "Paid"
                    : f === "completed"
                      ? "Completed"
                      : "Declined"}
                <span className="hst__filter-count">{counts[f]}</span>
              </button>
            ),
          )}
        </div>
        <label className="hst__search">
          <Search size={14} strokeWidth={2.25} />
          <input
            type="search"
            placeholder="Search brand, campaign, or category"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search history"
          />
        </label>
      </section>

      {/* ── Loading / empty ─────────────────────────── */}
      {isLoading && (
        <div className="hst__empty">
          <p>Loading your history…</p>
        </div>
      )}

      {!isLoading && grouped.length === 0 && (
        <div className="hst__empty">
          <Archive size={20} strokeWidth={1.75} />
          <p>
            No gigs match this filter.{" "}
            {(filter !== "all" || query) && (
              <button
                type="button"
                className="hst__empty-clear"
                onClick={() => {
                  setFilter("all");
                  setQuery("");
                }}
              >
                Clear
              </button>
            )}
          </p>
        </div>
      )}

      {/* ── Month-grouped list ──────────────────────── */}
      {!isLoading && grouped.length > 0 && (
        <section className="hst__groups" aria-label="Closed gigs by month">
          {grouped.map(([month, rows]) => {
            const monthSum = rows
              .filter((r) => r.status === "paid")
              .reduce((s, r) => s + r.finalPayout, 0);
            return (
              <section key={month} className="hst__group">
                <header className="hst__group-head">
                  <h3 className="hst__group-title">{month}</h3>
                  <span className="hst__group-meta">
                    {rows.length} gig{rows.length === 1 ? "" : "s"}
                    {monthSum > 0 && (
                      <>
                        <span className="hst__group-sep">·</span>
                        <span className="hst__group-sum">
                          ${monthSum.toLocaleString()}
                        </span>
                      </>
                    )}
                  </span>
                </header>
                <ul className="hst__list">
                  {rows.map((r) => (
                    <li key={r.id}>
                      <article className={"hst__row hst__row--" + r.status}>
                        <span className="hst__row-avatar">
                          {r.brandInitial}
                        </span>
                        <div className="hst__row-body">
                          <div className="hst__row-line1">
                            <span className="hst__row-brand">{r.brand}</span>
                            {r.status === "paid" && (
                              <span
                                className="hst__row-tier"
                                style={{
                                  color: TIER_COLORS[r.outcomeTier],
                                }}
                              >
                                {r.outcomeTier}
                              </span>
                            )}
                          </div>
                          <p className="hst__row-line2">
                            {r.campaign}
                            <span className="hst__row-sep">·</span>
                            {r.category}
                          </p>
                          <p className="hst__row-line3">
                            {fmtDate(r.paidAt)}
                            {r.scansAchieved > 0 && (
                              <>
                                <span className="hst__row-sep">·</span>
                                {r.scansAchieved} verified scans
                              </>
                            )}
                          </p>
                        </div>
                        <div className="hst__row-amount">
                          {r.status === "paid" && (
                            <>
                              <span className="hst__row-money">
                                +${r.finalPayout}
                              </span>
                              <span className="hst__row-status hst__row-status--paid">
                                <CheckCircle2 size={11} strokeWidth={2.5} />
                                Paid
                              </span>
                            </>
                          )}
                          {r.status === "completed" && (
                            <>
                              <span className="hst__row-money hst__row-money--pending">
                                ${r.finalPayout}
                              </span>
                              <span className="hst__row-status hst__row-status--completed">
                                <CheckCircle2 size={11} strokeWidth={2.5} />
                                Completed
                              </span>
                            </>
                          )}
                          {r.status === "declined" && (
                            <span className="hst__row-status hst__row-status--declined">
                              <XCircle size={11} strokeWidth={2.5} />
                              Declined
                            </span>
                          )}
                        </div>
                      </article>
                    </li>
                  ))}
                </ul>
              </section>
            );
          })}
        </section>
      )}
    </main>
  );
}
