"use client";

/* ============================================================
   /creator/gigs/history — v12.2 SaaS canonical
   Audit § P1-8: Hero · Pulse Strip · Toolbar · Two-column workspace
   (grouped list left, sticky detail panel right) · Kbd footer.
   ============================================================ */

import { useMemo, useState } from "react";
import Link from "next/link";
import { useHistory } from "@/lib/data/hooks";
import { SkeletonRow, SkeletonPanel } from "@/components/loading/Skeleton";
import "../gigs.css";
import "./history.css";

const MERCHANT_IDENTITY: Record<string, string> = {
  Devoción: "aubergine",
  "Sunday in Brooklyn": "terracotta",
  "Cha Cha Matcha": "sage",
  "Superiority Burger": "clay",
  "Roberta's Pizza": "cobalt",
  "Roberta's": "cobalt",
  "Flamingo Estate": "rose",
  "Saint Bagel": "mustard",
  "Blank Street Coffee": "mustard",
  "Brow Theory": "charcoal",
  "Fort Greene Coffee": "aubergine",
  "Bed-Stuy Eats": "terracotta",
};

function merchantIdentity(name: string): string {
  return MERCHANT_IDENTITY[name] ?? "charcoal";
}

function fmtMoney(n: number): string {
  return n.toLocaleString("en-US", { minimumFractionDigits: 0 });
}

function fmtDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function monthKey(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

type StatusFilter = "all" | "paid" | "declined";

export default function HistoryPage() {
  const { data, error, isLoading } = useHistory();
  if (error) throw error;

  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [activeId, setActiveId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    if (!data) return [];
    return data.filter((r) =>
      statusFilter === "all" ? true : r.status === statusFilter,
    );
  }, [data, statusFilter]);

  const grouped = useMemo(() => {
    const groups = new Map<string, typeof filtered>();
    for (const row of filtered) {
      const key = monthKey(row.paidAt);
      const arr = groups.get(key) ?? [];
      arr.push(row);
      groups.set(key, arr);
    }
    return Array.from(groups.entries());
  }, [filtered]);

  const lifetime = useMemo(
    () =>
      (data ?? []).reduce(
        (s, r) => s + (r.status === "paid" ? r.finalPayout : 0),
        0,
      ),
    [data],
  );

  const completionRate = useMemo(() => {
    if (!data || data.length === 0) return 0;
    const paid = data.filter((r) => r.status === "paid").length;
    return Math.round((paid / data.length) * 100);
  }, [data]);

  const active = filtered.find((r) => r.id === activeId) ?? filtered[0] ?? null;

  if (isLoading && (!data || data.length === 0)) {
    return (
      <section className="ib-content gigs-pane" aria-label="History (loading)">
        <header className="giv-hero">
          <div>
            <h1 className="giv-hero__title">History</h1>
            <p className="giv-hero__sub">Loading your past gigs…</p>
          </div>
        </header>
        <div className="hist-shell">
          <SkeletonRow count={5} />
          <SkeletonPanel />
        </div>
      </section>
    );
  }

  if (!data || data.length === 0) {
    return (
      <section className="ib-content gigs-pane" aria-label="History (empty)">
        <header className="giv-hero">
          <div>
            <h1 className="giv-hero__title">History</h1>
            <p className="giv-hero__sub">No history yet.</p>
          </div>
        </header>
        <div className="hist-empty">
          <p>Accept your first gig to start building it.</p>
          <Link href="/creator/gigs/invites" className="hist-empty__cta">
            View invites →
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="ib-content gigs-pane">
      {/* ★★ Hero */}
      <header className="giv-hero">
        <div>
          <h1 className="giv-hero__title">History</h1>
          <p className="giv-hero__sub">
            <strong>{data.length}</strong> completed ·{" "}
            <strong>${fmtMoney(lifetime)}</strong> lifetime
          </p>
        </div>
      </header>

      {/* ☆ Pulse Strip */}
      <div className="hist-pulse" role="group" aria-label="History pulse">
        <div className="hist-pulse__cell">
          <span className="hist-pulse__label">Lifetime</span>
          <span className="hist-pulse__value">${fmtMoney(lifetime)}</span>
        </div>
        <div className="hist-pulse__cell">
          <span className="hist-pulse__label">Total gigs</span>
          <span className="hist-pulse__value">{data.length}</span>
        </div>
        <div className="hist-pulse__cell">
          <span className="hist-pulse__label">Avg per gig</span>
          <span className="hist-pulse__value">
            $
            {fmtMoney(data.length > 0 ? Math.round(lifetime / data.length) : 0)}
          </span>
        </div>
        <div className="hist-pulse__cell">
          <span className="hist-pulse__label">Completion</span>
          <span className="hist-pulse__value">{completionRate}%</span>
        </div>
      </div>

      {/* ☆ Toolbar */}
      <div className="hist-toolbar">
        <div
          className="hist-toolbar__filters"
          role="tablist"
          aria-label="Status filter"
        >
          {(["all", "paid", "declined"] as StatusFilter[]).map((f) => (
            <button
              key={f}
              type="button"
              role="tab"
              aria-selected={statusFilter === f}
              onClick={() => setStatusFilter(f)}
              className={`hist-toolbar__chip${statusFilter === f ? " is-active" : ""}`}
            >
              {f === "all" ? "All" : f === "paid" ? "Paid" : "Declined"}
            </button>
          ))}
        </div>
      </div>

      {/* ★★★ Two-column workspace */}
      <div className="hist-shell">
        {/* Left: grouped by month */}
        <div className="hist-list">
          {grouped.map(([monthLabel, rows]) => {
            const monthTotal = rows.reduce(
              (s, r) => s + (r.status === "paid" ? r.finalPayout : 0),
              0,
            );
            return (
              <section key={monthLabel} className="hist-group">
                <header className="hist-group__head">
                  <span className="hist-group__title">{monthLabel}</span>
                  <span className="hist-group__total">
                    ${fmtMoney(monthTotal)}
                  </span>
                </header>
                <ul className="hist-group__rows">
                  {rows.map((r) => {
                    const mc = merchantIdentity(r.brand);
                    const isActive = active?.id === r.id;
                    return (
                      <li key={r.id}>
                        <button
                          type="button"
                          className={`hist-row hist-row--mc-${mc}${isActive ? " is-active" : ""}`}
                          onClick={() => setActiveId(r.id)}
                          aria-current={isActive}
                        >
                          <span className="hist-row__strip" aria-hidden />
                          <span className="hist-row__monogram" aria-hidden>
                            {r.brandInitial}
                          </span>
                          <span className="hist-row__body">
                            <span className="hist-row__brand">{r.brand}</span>
                            <span className="hist-row__campaign">
                              {r.campaign}
                            </span>
                            <span className="hist-row__meta">
                              {fmtDate(r.paidAt)} · {r.scansAchieved} scans
                            </span>
                          </span>
                          <span className="hist-row__right">
                            <span className="hist-row__payout">
                              ${fmtMoney(r.finalPayout)}
                            </span>
                            <span
                              className={`hist-row__tier hist-row__tier--${r.outcomeTier.toLowerCase()}`}
                            >
                              {r.outcomeTier}
                            </span>
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </section>
            );
          })}
        </div>

        {/* Right: sticky detail panel */}
        <aside className="hist-detail" aria-label="Selected gig details">
          {active ? (
            <div
              className={`hist-detail__inner hist-detail__inner--mc-${merchantIdentity(active.brand)}`}
            >
              <div className="hist-detail__accent" aria-hidden />
              <p className="hist-detail__eyebrow">
                BRIEF · {active.category} · {fmtDate(active.paidAt)}
              </p>
              <h2 className="hist-detail__title">{active.brand}</h2>
              <p className="hist-detail__sub">{active.campaign}</p>

              <div className="hist-detail__quick">
                <div>
                  <span className="hist-detail__quick__label">
                    Final payout
                  </span>
                  <span className="hist-detail__quick__value">
                    ${fmtMoney(active.finalPayout)}
                  </span>
                </div>
                <div>
                  <span className="hist-detail__quick__label">Scans</span>
                  <span className="hist-detail__quick__value">
                    {active.scansAchieved}
                  </span>
                </div>
                <div>
                  <span className="hist-detail__quick__label">Outcome</span>
                  <span className="hist-detail__quick__value">
                    {active.outcomeTier}
                  </span>
                </div>
              </div>

              <div className="hist-detail__section">
                <h3 className="hist-detail__h">Status timeline</h3>
                <ol className="hist-detail__timeline">
                  <li>
                    <span className="hist-detail__dot is-done" /> Accepted
                  </li>
                  <li>
                    <span className="hist-detail__dot is-done" /> Posted
                  </li>
                  <li>
                    <span className="hist-detail__dot is-done" /> Verified
                  </li>
                  <li>
                    <span className="hist-detail__dot is-done" /> Paid ·{" "}
                    {fmtDate(active.paidAt)}
                  </li>
                </ol>
              </div>

              <div className="hist-detail__cta-row">
                <a
                  href={`/api/creator/receipts/${active.id}`}
                  className="hist-detail__cta"
                  download
                >
                  Download receipt PDF
                </a>
              </div>
            </div>
          ) : (
            <div className="hist-detail__empty">
              Pick a gig to see its details.
            </div>
          )}
        </aside>
      </div>
    </section>
  );
}
