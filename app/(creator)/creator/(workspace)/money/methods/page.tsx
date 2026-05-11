"use client";

/* ============================================================
   /creator/money/methods — payout methods. v2 (2026-05-08)
   Fintech-grade virtual card stack + realistic data + interactive
   actions (set default / remove / add).
   ============================================================ */

import Link from "next/link";
import { useState } from "react";
import {
  CreditCard,
  Building2,
  Plus,
  CheckCircle2,
  ArrowLeft,
  Trash2,
  Settings,
  Zap,
} from "lucide-react";
import "./methods.css";

type Method = {
  id: string;
  type: "stripe" | "bank" | "venmo";
  brand: string;
  last4: string;
  holder: string;
  exp?: string;
  isDefault: boolean;
  status: "verified" | "pending" | "expired";
  routing?: string;
};

const INITIAL: Method[] = [
  {
    id: "m1",
    type: "stripe",
    brand: "Stripe Connect · Visa",
    last4: "4242",
    holder: "Alex Chen",
    exp: "11 / 28",
    isDefault: true,
    status: "verified",
  },
  {
    id: "m2",
    type: "bank",
    brand: "Chase · Total Checking",
    last4: "8821",
    holder: "Alex Chen",
    routing: "021000021",
    isDefault: false,
    status: "verified",
  },
  {
    id: "m3",
    type: "venmo",
    brand: "Venmo · backup",
    last4: "@alexc",
    holder: "Alex Chen",
    isDefault: false,
    status: "pending",
  },
];

export default function MoneyMethods() {
  const [methods, setMethods] = useState<Method[]>(INITIAL);
  const [active, setActive] = useState<string>(INITIAL[0].id);

  const setDefault = (id: string) => {
    setMethods((ms) => ms.map((m) => ({ ...m, isDefault: m.id === id })));
    setActive(id);
  };
  const remove = (id: string) => {
    setMethods((ms) => ms.filter((m) => m.id !== id));
    if (active === id && methods[0]) setActive(methods[0].id);
  };

  const activeMethod = methods.find((m) => m.id === active) ?? methods[0];

  return (
    <main className="mm-page" aria-label="Payout methods">
      <header className="mm-hero">
        <div className="mm-hero__left">
          <Link href="/creator/money" className="hub-back">
            <ArrowLeft size={14} strokeWidth={2.25} />
            Money
          </Link>
          <h1 className="mm-hero__title">Methods</h1>
          <p className="mm-hero__sub">
            {methods.length} method{methods.length === 1 ? "" : "s"} on file ·
            default = {methods.find((m) => m.isDefault)?.brand ?? "none"}
          </p>
        </div>
        <button type="button" className="mm-add">
          <Plus size={14} strokeWidth={2.5} />
          Add method
        </button>
      </header>

      <section className="mm-grid">
        {/* Card stack — 3 virtual cards */}
        <div className="mm-stack-wrap">
          <p className="mm-stack__eyebrow">Card stack</p>
          <div
            className="mm-stack"
            role="tablist"
            aria-label="Payout methods stack"
          >
            {methods.map((m, i) => {
              const isActive = m.id === active;
              const Icon =
                m.type === "stripe"
                  ? CreditCard
                  : m.type === "bank"
                    ? Building2
                    : Zap;
              return (
                <button
                  type="button"
                  key={m.id}
                  role="tab"
                  aria-selected={isActive}
                  className={
                    "mm-card mm-card--" +
                    m.type +
                    (isActive ? " mm-card--active" : "") +
                    (m.isDefault ? " mm-card--default" : "")
                  }
                  style={{ ["--idx" as string]: i }}
                  onClick={() => setActive(m.id)}
                >
                  <div className="mm-card__top">
                    <span className="mm-card__brand">
                      <Icon size={16} strokeWidth={2} />
                      {m.brand}
                    </span>
                    {m.isDefault && (
                      <span className="mm-card__default">Default</span>
                    )}
                  </div>
                  <p className="mm-card__num">
                    {m.type === "venmo" ? m.last4 : `•••• •••• •••• ${m.last4}`}
                  </p>
                  <div className="mm-card__bottom">
                    <span className="mm-card__holder">{m.holder}</span>
                    {m.exp && <span className="mm-card__exp">EXP {m.exp}</span>}
                    {m.routing && (
                      <span className="mm-card__exp">
                        RT {m.routing.slice(-4)}
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Active method detail panel */}
        {activeMethod && (
          <aside className="mm-detail" aria-label="Method details">
            <div className="mm-detail__head">
              <p className="mm-detail__eyebrow">Selected method</p>
              <h2 className="mm-detail__title">{activeMethod.brand}</h2>
              <span
                className={
                  "mm-detail__status mm-detail__status--" + activeMethod.status
                }
              >
                <CheckCircle2 size={12} strokeWidth={2.25} />
                {activeMethod.status === "verified"
                  ? "Verified · ready for payouts"
                  : activeMethod.status === "pending"
                    ? "Pending verification"
                    : "Expired"}
              </span>
            </div>

            <dl className="mm-detail__grid">
              <div className="mm-detail__row">
                <dt>Holder</dt>
                <dd>{activeMethod.holder}</dd>
              </div>
              <div className="mm-detail__row">
                <dt>{activeMethod.type === "venmo" ? "Handle" : "Last 4"}</dt>
                <dd>{activeMethod.last4}</dd>
              </div>
              {activeMethod.exp && (
                <div className="mm-detail__row">
                  <dt>Expires</dt>
                  <dd>{activeMethod.exp}</dd>
                </div>
              )}
              {activeMethod.routing && (
                <div className="mm-detail__row">
                  <dt>Routing</dt>
                  <dd>•••• {activeMethod.routing.slice(-4)}</dd>
                </div>
              )}
              <div className="mm-detail__row">
                <dt>Status</dt>
                <dd>
                  {activeMethod.status === "verified" ? "Active" : "Pending"}
                </dd>
              </div>
            </dl>

            <div className="mm-detail__actions">
              {!activeMethod.isDefault && (
                <button
                  type="button"
                  className="mm-btn mm-btn--primary"
                  onClick={() => setDefault(activeMethod.id)}
                >
                  <CheckCircle2 size={14} strokeWidth={2.25} />
                  Make default
                </button>
              )}
              <button type="button" className="mm-btn mm-btn--ghost">
                <Settings size={14} strokeWidth={2.25} />
                Edit
              </button>
              {!activeMethod.isDefault && (
                <button
                  type="button"
                  className="mm-btn mm-btn--danger"
                  onClick={() => remove(activeMethod.id)}
                >
                  <Trash2 size={14} strokeWidth={2.25} />
                  Remove
                </button>
              )}
            </div>
          </aside>
        )}
      </section>

      {/* Recent payouts list */}
      <section className="mm-section">
        <header className="mm-section__head">
          <p className="mm-section__eyebrow">Recent payouts</p>
          <h2 className="mm-section__title">Last 30 days</h2>
        </header>
        <ul className="mm-payouts">
          {[
            {
              date: "May 6",
              amount: 124,
              method: "Stripe · 4242",
              status: "Paid",
            },
            {
              date: "Apr 29",
              amount: 96,
              method: "Stripe · 4242",
              status: "Paid",
            },
            {
              date: "Apr 22",
              amount: 78,
              method: "Stripe · 4242",
              status: "Paid",
            },
            {
              date: "Apr 15",
              amount: 102,
              method: "Stripe · 4242",
              status: "Paid",
            },
          ].map((p, i) => (
            <li key={i} className="mm-payouts__row">
              <span className="mm-payouts__date">{p.date}</span>
              <span className="mm-payouts__method">{p.method}</span>
              <span className="mm-payouts__amount">${p.amount}</span>
              <span className="mm-payouts__status">{p.status}</span>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
