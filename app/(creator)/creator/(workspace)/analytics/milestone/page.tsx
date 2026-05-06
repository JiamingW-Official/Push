/* Milestone detail — current progress + history + projection to next bonus */

"use client";

import Link from "next/link";
import "../analytics.css";
import { MILESTONE, SUMMARY, tierMeta, nextTier, fmtUsd } from "../_data/mock";

const HISTORY = [
  { month: "Dec", referrals: 18, threshold: 30, hit: false, bonus: 0 },
  { month: "Jan", referrals: 22, threshold: 30, hit: false, bonus: 0 },
  { month: "Feb", referrals: 27, threshold: 30, hit: false, bonus: 0 },
  { month: "Mar", referrals: 31, threshold: 30, hit: true,  bonus: 15 },
  { month: "Apr", referrals: 29, threshold: 30, hit: false, bonus: 0 },
  { month: "May", referrals: 31, threshold: 30, hit: true,  bonus: 15 },
];

export default function MilestoneDetailPage() {
  const next = nextTier(SUMMARY.currentTier)!;
  const totalEarned = HISTORY.reduce((s, h) => s + h.bonus, 0);
  const hitRate = HISTORY.filter(h => h.hit).length / HISTORY.length;

  return (
    <div className="an2 an2-detail">
      <div style={{ paddingTop: 32 }}>
        <Link href="/creator/analytics" className="an2-back">Analytics</Link>

        <header className="an2-detail__head">
          <div>
            <p className="an2-eyebrow">Milestone bonus · 6-month log</p>
            <h1 className="an2-detail__title">Milestone</h1>
            <p className="an2-detail__sub">
              Per push-creator §commission, the milestone bonus is the actual lever — at Operator,
              hitting <strong>30 referrals/month</strong> unlocks <strong>+$15</strong>. Pure 3% commission on
              $7 coffee transactions yields rounding error; this is where real income lives.
            </p>
          </div>
          <div style={{ textAlign: "right" }}>
            <p style={{ fontFamily: "var(--font-display)", fontSize: 64, fontWeight: 800, letterSpacing: "-0.04em", lineHeight: 0.9, margin: 0, color: "var(--champagne)" }}>
              +{fmtUsd(totalEarned)}
            </p>
            <p style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "var(--ink-4)", letterSpacing: "0.06em", textTransform: "uppercase", fontWeight: 700, marginTop: 6 }}>
              earned in 6 months
            </p>
          </div>
        </header>

        {/* Current state */}
        <section className="an2-card" style={{ marginBottom: 32 }}>
          <p className="an2-card__eyebrow">{MILESTONE.hit ? "Hit · this window" : "In progress · this window"}</p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 32, alignItems: "end" }}>
            <div>
              <h2 style={{ fontFamily: "var(--font-display)", fontSize: 56, fontWeight: 800, letterSpacing: "-0.035em", lineHeight: 0.95, color: "var(--ink)", margin: 0, fontVariantNumeric: "tabular-nums" }}>
                {MILESTONE.current} <span style={{ color: "var(--ink-4)" }}>/</span> {MILESTONE.threshold}
              </h2>
              <p style={{ fontFamily: "var(--font-body)", fontSize: 14, color: "var(--ink-3)", marginTop: 12, lineHeight: 1.55 }}>
                {MILESTONE.hit
                  ? <>Hit on <strong style={{ fontFamily: "var(--font-display)", color: "var(--ink)", fontWeight: 700 }}>{MILESTONE.hitDate}</strong>. Bonus paid this cycle. Window resets <strong style={{ fontFamily: "var(--font-display)", color: "var(--ink)" }}>{MILESTONE.windowResetsAt}</strong>.</>
                  : <>{MILESTONE.threshold - MILESTONE.current} referrals to go · window resets <strong style={{ fontFamily: "var(--font-display)", color: "var(--ink)" }}>{MILESTONE.windowResetsAt}</strong>.</>}
              </p>
            </div>
            <p style={{ fontFamily: "var(--font-display)", fontSize: 56, fontWeight: 800, letterSpacing: "-0.035em", color: "var(--champagne)", margin: 0, fontVariantNumeric: "tabular-nums" }}>
              +${MILESTONE.bonus}
            </p>
          </div>
          <div style={{ marginTop: 20, height: 14, background: "var(--surface-3)", borderRadius: 7, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${Math.min(100, (MILESTONE.current / MILESTONE.threshold) * 100)}%`, background: "linear-gradient(90deg, var(--champagne), #d4b988)", borderRadius: 7, transition: "width 1200ms cubic-bezier(0.22, 1, 0.36, 1)" }} />
          </div>
        </section>

        <div className="an2-grid-2">
          {/* History */}
          <section className="an2-card">
            <p className="an2-card__eyebrow">6-month log</p>
            <h2 className="an2-card__title">Hit rate · {Math.round(hitRate * 100)}%</h2>
            <div style={{ display: "flex", alignItems: "flex-end", gap: 14, height: 180, padding: "12px 0" }}>
              {HISTORY.map((h, i) => {
                const ref = h.referrals;
                const pct = (ref / 40) * 100; // scale to 40 max
                const isCurrent = i === HISTORY.length - 1;
                return (
                  <div key={h.month} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 8, height: "100%" }}>
                    <div style={{ flex: 1, width: "100%", display: "flex", alignItems: "flex-end", position: "relative" }}>
                      {/* threshold line */}
                      <div style={{ position: "absolute", left: 0, right: 0, bottom: `${(30/40)*100}%`, borderTop: "1px dashed var(--ink-5)" }} />
                      <div style={{
                        width: "100%", height: `${pct}%`,
                        background: h.hit ? "var(--champagne)" : "var(--mist)",
                        borderRadius: "4px 4px 0 0",
                        outline: isCurrent ? "1px solid var(--ink)" : "none",
                        outlineOffset: -1,
                      }} title={`${h.month}: ${ref} referrals`} />
                    </div>
                    <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 12, color: h.hit ? "var(--champagne)" : "var(--ink-5)", fontVariantNumeric: "tabular-nums" }}>
                      {ref}
                    </span>
                    <span style={{ fontFamily: "var(--font-body)", fontSize: 11, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--ink-4)" }}>{h.month}</span>
                  </div>
                );
              })}
            </div>
            <p style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "var(--ink-4)", marginTop: 8 }}>
              Dashed line · 30-referral threshold
            </p>
          </section>

          {/* Next tier projection */}
          <section className="an2-card">
            <p className="an2-card__eyebrow">{next.tier} milestone</p>
            <h2 className="an2-card__title">What changes at next tier</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={{ padding: 16, borderRadius: 10, background: "var(--surface-2)" }}>
                <p style={{ fontFamily: "var(--font-body)", fontSize: 11, color: "var(--ink-4)", letterSpacing: "0.06em", textTransform: "uppercase", fontWeight: 700, margin: "0 0 6px" }}>Threshold</p>
                <p style={{ fontFamily: "var(--font-display)", fontSize: 24, fontWeight: 800, color: "var(--ink)", margin: 0, letterSpacing: "-0.02em" }}>
                  <span style={{ color: "var(--ink-5)", textDecoration: "line-through", fontSize: 18, marginRight: 8 }}>30</span>
                  {next.milestone!.threshold} referrals/month
                </p>
              </div>
              <div style={{ padding: 16, borderRadius: 10, background: "var(--surface-2)" }}>
                <p style={{ fontFamily: "var(--font-body)", fontSize: 11, color: "var(--ink-4)", letterSpacing: "0.06em", textTransform: "uppercase", fontWeight: 700, margin: "0 0 6px" }}>Bonus</p>
                <p style={{ fontFamily: "var(--font-display)", fontSize: 24, fontWeight: 800, color: "var(--champagne)", margin: 0, letterSpacing: "-0.02em" }}>
                  <span style={{ color: "var(--ink-5)", textDecoration: "line-through", fontSize: 18, marginRight: 8 }}>+$15</span>
                  +${next.milestone!.bonus}
                </p>
              </div>
              <div style={{ padding: 16, borderRadius: 10, background: "var(--surface-2)" }}>
                <p style={{ fontFamily: "var(--font-body)", fontSize: 11, color: "var(--ink-4)", letterSpacing: "0.06em", textTransform: "uppercase", fontWeight: 700, margin: "0 0 6px" }}>Annual upside (if hit every month)</p>
                <p style={{ fontFamily: "var(--font-display)", fontSize: 32, fontWeight: 800, color: "var(--ink)", margin: 0, letterSpacing: "-0.025em" }}>
                  +${(next.milestone!.bonus - MILESTONE.bonus) * 12}/yr
                </p>
              </div>
            </div>
            <Link href="/creator/analytics/tier" className="an2-export" style={{ marginTop: 20, display: "inline-flex" }}>
              See path to {next.tier} →
            </Link>
          </section>
        </div>

        <p className="an2-div"><span>thirty by month-end · then thirty more.</span></p>
      </div>
    </div>
  );
}
