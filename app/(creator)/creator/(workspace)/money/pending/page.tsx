"use client";

/* ============================================================
   /creator/money/pending — pending payouts. v2 (2026-05-08)
   Real transaction-style list with countdown to next clearing,
   Donut split by source, status pills, and timeline visualization.
   ============================================================ */

import Link from "next/link";
import { useState } from "react";
import {
  Hourglass,
  ArrowLeft,
  Clock,
  CheckCircle2,
  Circle,
  Calendar,
  TrendingUp,
} from "lucide-react";
import Donut from "@/components/shared/charts/Donut";
import "./pending.css";

type Status = "processing" | "scheduled" | "clearing";

type Pending = {
  id: string;
  merchant: string;
  description: string;
  amount: number;
  type: "base" | "commission" | "bonus";
  scheduled: string;
  daysOut: number;
  status: Status;
};

const PENDING: Pending[] = [
  {
    id: "p1",
    merchant: "Roberta's Pizza",
    description: "Apr 28 shoot · base pay",
    amount: 30,
    type: "base",
    scheduled: "May 13",
    daysOut: 5,
    status: "scheduled",
  },
  {
    id: "p2",
    merchant: "Devoción",
    description: "Apr 30 post · commission 5%",
    amount: 12,
    type: "commission",
    scheduled: "May 13",
    daysOut: 5,
    status: "scheduled",
  },
  {
    id: "p3",
    merchant: "Brow Theory",
    description: "May 4 shoot · base pay",
    amount: 30,
    type: "base",
    scheduled: "May 16",
    daysOut: 8,
    status: "processing",
  },
  {
    id: "p4",
    merchant: "Weekly bonus",
    description: "50-scan threshold · 04/29 - 05/05",
    amount: 15,
    type: "bonus",
    scheduled: "May 13",
    daysOut: 5,
    status: "clearing",
  },
];

const TYPE_META: Record<Pending["type"], { label: string; color: string }> = {
  base: { label: "Base", color: "#14130f" },
  commission: { label: "Comm.", color: "#0085ff" },
  bonus: { label: "Bonus", color: "#bfa170" },
};

export default function MoneyPending() {
  const [selected, setSelected] = useState<string>(PENDING[0].id);

  const total = PENDING.reduce((a, p) => a + p.amount, 0);
  const splitByType = (Object.keys(TYPE_META) as Pending["type"][])
    .map((t) => ({
      label: TYPE_META[t].label,
      value: PENDING.filter((p) => p.type === t).reduce(
        (a, p) => a + p.amount,
        0,
      ),
      color: TYPE_META[t].color,
    }))
    .filter((s) => s.value > 0);

  const nextClearingDays = Math.min(...PENDING.map((p) => p.daysOut));

  return (
    <main className="mp-page" aria-label="Pending payouts">
      <header className="mp-hero">
        <div className="mp-hero__left">
          <Link href="/creator/money" className="hub-back">
            <ArrowLeft size={14} strokeWidth={2.25} />
            Money
          </Link>
          <h1 className="mp-hero__title">Pending</h1>
          <p className="mp-hero__sub">
            ${total} pending across {PENDING.length} payouts · next clears in{" "}
            <strong>{nextClearingDays} days</strong>
          </p>
        </div>
      </header>

      {/* ── 3-up summary: total / next clearing / split donut ── */}
      <section className="mp-summary">
        <article className="mp-stat mp-stat--hero">
          <p className="mp-stat__lbl">
            <Hourglass size={14} strokeWidth={2.25} />
            Total pending
          </p>
          <p className="mp-stat__num">${total}</p>
          <p className="mp-stat__meta">{PENDING.length} payouts in queue</p>
        </article>

        <article className="mp-stat mp-stat--countdown">
          <p className="mp-stat__lbl">
            <Clock size={14} strokeWidth={2.25} />
            Next clearing
          </p>
          <p className="mp-stat__num">{nextClearingDays}d</p>
          <p className="mp-stat__meta">Mon May 13 · Stripe · 4242</p>
          <div className="mp-progress">
            <div className="mp-progress__fill" style={{ width: "60%" }} />
          </div>
        </article>

        <article className="mp-stat mp-stat--split">
          <p className="mp-stat__lbl">
            <TrendingUp size={14} strokeWidth={2.25} />
            Split by source
          </p>
          <Donut
            ariaLabel="Pending split"
            valuePrefix="$"
            total={total}
            segments={splitByType}
          />
        </article>
      </section>

      {/* ── Pending transactions list ── */}
      <section className="mp-list-wrap">
        <header className="mp-section__head">
          <p className="mp-section__eyebrow">
            Pending payouts · {PENDING.length}
          </p>
          <h2 className="mp-section__title">In flight</h2>
        </header>
        <ul className="mp-list" aria-label="Pending payouts">
          {PENDING.map((p) => {
            const meta = TYPE_META[p.type];
            const isSel = selected === p.id;
            return (
              <li
                key={p.id}
                className={"mp-row" + (isSel ? " mp-row--active" : "")}
                onClick={() => setSelected(p.id)}
              >
                <span className="mp-row__type">
                  <span
                    className="mp-row__dot"
                    style={{ background: meta.color }}
                  />
                  {meta.label}
                </span>
                <div className="mp-row__copy">
                  <span className="mp-row__merchant">{p.merchant}</span>
                  <span className="mp-row__desc">{p.description}</span>
                </div>
                <span className="mp-row__amount">+${p.amount}</span>
                <span className={"mp-row__status mp-row__status--" + p.status}>
                  {p.status === "processing" ? (
                    <>
                      <Circle size={10} strokeWidth={2.5} /> Processing
                    </>
                  ) : p.status === "clearing" ? (
                    <>
                      <Hourglass size={10} strokeWidth={2.5} /> Clearing
                    </>
                  ) : (
                    <>
                      <CheckCircle2 size={10} strokeWidth={2.5} /> Scheduled
                    </>
                  )}
                </span>
                <span className="mp-row__date">
                  <Calendar size={11} strokeWidth={2.25} />
                  {p.scheduled}
                </span>
              </li>
            );
          })}
        </ul>
      </section>

      {/* ── Schedule timeline ── */}
      <section className="mp-section">
        <header className="mp-section__head">
          <p className="mp-section__eyebrow">Next 14 days</p>
          <h2 className="mp-section__title">Payout schedule</h2>
        </header>
        <div className="mp-timeline">
          {Array.from({ length: 14 }, (_, i) => {
            const date = new Date();
            date.setDate(date.getDate() + i);
            const dayLabel = date.toLocaleDateString("en-US", {
              weekday: "short",
            });
            const dateNum = date.getDate();
            const matches = PENDING.filter((p) => p.daysOut === i);
            const matchTotal = matches.reduce((a, p) => a + p.amount, 0);
            return (
              <div
                key={i}
                className={"mp-day" + (matchTotal > 0 ? " mp-day--has" : "")}
              >
                <span className="mp-day__weekday">{dayLabel}</span>
                <span className="mp-day__date">{dateNum}</span>
                {matchTotal > 0 && (
                  <span className="mp-day__amount">${matchTotal}</span>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </main>
  );
}
