"use client";

/* ============================================================
   /creator/money — MONEY domain hub. Audit § 5.3 bento spec.

   Bento layout:
     [─── EARNINGS HERO (7×2) ───] [─ MILESTONES (5) ─]
                                    [─ PENDING (5) ─]
     [─ METHODS (5) ─] [─── HISTORY (7) ───────────]
     [──── TAX (12) ───────────────────────────────]

   All 6 modules use <BentoModule> primitive — zero per-module CSS.
   Each module drills into a focused sub-page that owns the depth.
   ============================================================ */

import Link from "next/link";
import { useEarnings } from "@/lib/data/hooks";
import {
  BentoModule,
  KpiBlock,
  ProgressBar,
  StatusPill,
} from "@/components/shared/primitives";
import "@/components/shared/hub-shell.css";
import "./money.css";

function fmtMoney(n: number): string {
  return n.toLocaleString("en-US", { minimumFractionDigits: 0 });
}

export default function MoneyHub() {
  const { data: earnings, error, isLoading } = useEarnings();
  if (error) throw error;

  const summary = earnings?.summary ?? {
    thisMonthEarned: 0,
    lastMonthEarned: 0,
    delta: 0,
    pendingNext: 0,
  };
  const balances = earnings?.balances ?? {
    pending: 0,
    cleared: 0,
    processing: 0,
    paidOut: 0,
    total: 0,
  };
  const milestones = earnings?.activeMilestones ?? [];
  const transactions = earnings?.transactions ?? [];

  const lifetime = balances.paidOut + balances.cleared + balances.processing;
  const deltaPositive = summary.delta >= 0;
  const moduleState = isLoading ? "loading" : "ready";

  return (
    <main className="money-hub" aria-label="Money">
      <header className="money-hero">
        <p className="money-hero__eyebrow">
          MONEY · YOUR EARNINGS, PAYOUTS, TAX
        </p>
        <h1 className="money-hero__title">Money</h1>
        <p className="money-hero__sub">
          Six focused surfaces for what you've made, what's owed, and what's
          ready to cash out. Tap any tile to drill in.
        </p>
      </header>

      <header className="hub-section">
        <h2 className="hub-section__title">Live earnings</h2>
        <span className="hub-section__count">01 · cash + flow</span>
      </header>

      <section className="money-bento" aria-label="Money modules">
        {/* ── EARNINGS HERO (span 7) — anchor ── */}
        <BentoModule
          href="/creator/money/earnings"
          eyebrow="EARNINGS · THIS MONTH"
          span={7}
          state={moduleState}
          live="live"
          priority="hero"
          sub={`vs $${fmtMoney(summary.lastMonthEarned)} last month`}
        >
          <KpiBlock
            eyebrow=""
            currency="$"
            value={fmtMoney(summary.thisMonthEarned)}
            delta={
              summary.delta !== 0
                ? {
                    direction: deltaPositive ? "up" : "down",
                    label: `$${fmtMoney(Math.abs(summary.delta))}`,
                  }
                : undefined
            }
          />
        </BentoModule>

        {/* ── MILESTONES (span 5) ── */}
        <BentoModule
          href="/creator/money/milestones"
          eyebrow="MILESTONES · IN FLIGHT"
          span={5}
          state={moduleState}
          sub={`${milestones.length} campaign${milestones.length === 1 ? "" : "s"} progressing`}
        >
          {milestones.length === 0 ? (
            <span className="money-empty">No active milestones.</span>
          ) : (
            <div className="money-milestone-list">
              {milestones.slice(0, 2).map((m) => {
                const doneSteps = m.milestones.filter((s) => s.done).length;
                return (
                  <div key={m.campaignId} className="money-milestone-row">
                    <span className="money-milestone-row__brand">
                      {m.merchant}
                    </span>
                    <ProgressBar
                      mode="segmented"
                      step={doneSteps - 1}
                      total={m.milestones.length}
                      tone="ink"
                    />
                  </div>
                );
              })}
            </div>
          )}
        </BentoModule>

        {/* ── PENDING (span 5) ── */}
        <BentoModule
          href="/creator/money/pending"
          eyebrow="PENDING · NEXT PAYOUT"
          span={5}
          state={moduleState}
          sub={`Estimated ${summary.pendingNext > 0 ? "May 1" : "—"}`}
        >
          <KpiBlock
            eyebrow=""
            currency="$"
            value={fmtMoney(summary.pendingNext)}
            tone="blue"
            compact
          />
          <span className="money-row-status">
            <StatusPill
              variant={balances.pending > 0 ? "blue" : "neutral"}
              label={balances.pending > 0 ? "in flight" : "no holds"}
              dot
            />
          </span>
        </BentoModule>

        {/* ── METHODS (span 5) ── */}
        <BentoModule
          href="/creator/money/methods"
          eyebrow="METHODS · PAYOUT DESTINATIONS"
          span={5}
          state={moduleState}
          sub="Stripe Connect · Venmo backup"
        >
          <div className="money-methods-stack">
            <span className="money-methods-row">
              <StatusPill variant="green" label="Stripe Connect" dot />
              <span className="money-methods-row__hint">primary · 1099-K</span>
            </span>
            <span className="money-methods-row">
              <StatusPill variant="neutral" label="Venmo" dot />
              <span className="money-methods-row__hint">backup</span>
            </span>
          </div>
        </BentoModule>
      </section>

      <header className="hub-section">
        <h2 className="hub-section__title">Reference</h2>
        <span className="hub-section__count">02 · history + tax</span>
      </header>

      <section className="money-bento" aria-label="Money reference modules">
        {/* ── HISTORY (span 7) ── */}
        <BentoModule
          href="/creator/money/history"
          eyebrow="HISTORY · LAST 30 DAYS"
          span={7}
          state={moduleState}
          priority="quiet"
          sub={`${transactions.length} transactions tracked · $${fmtMoney(lifetime)} lifetime`}
        >
          <KpiBlock
            eyebrow=""
            currency="$"
            value={fmtMoney(lifetime)}
            tone="ink"
            compact
          />
          <ProgressBar
            mode="linear"
            value={balances.cleared}
            max={Math.max(balances.cleared + balances.pending, 1)}
            tone="champagne"
            sub={`$${fmtMoney(balances.cleared)} cleared / $${fmtMoney(balances.pending)} pending`}
          />
        </BentoModule>

        {/* ── TAX (span 12) ── */}
        <BentoModule
          href="/creator/money/tax"
          eyebrow="TAX · 2026 1099-K ESTIMATE"
          span={12}
          state={moduleState}
          priority="quiet"
          sub="Push reports payouts ≥ $600/year. Download W-9 + 1099 anytime."
        >
          <div className="money-tax-row">
            <KpiBlock
              eyebrow="ESTIMATED 1099-K"
              currency="$"
              value={fmtMoney(lifetime)}
              compact
            />
            <KpiBlock eyebrow="W-9 STATUS" value="Filed" tone="ink" compact />
            <KpiBlock eyebrow="MONTHS REPORTED" value="5" tone="ink" compact />
            <span className="money-tax-cta">
              <span className="money-tax-cta__link" aria-hidden>
                Open tax center →
              </span>
            </span>
          </div>
        </BentoModule>
      </section>
    </main>
  );
}
