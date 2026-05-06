/* Tier detail — full ladder + score dimensions + path to next tier
 * Authority: push-creator §6-tier · scoring-model.md · Design.md v11.1
 */

"use client";

import Link from "next/link";
import "../analytics.css";
import {
  SUMMARY,
  TIER_LADDER,
  tierMeta,
  nextTier,
} from "../_data/mock";

export default function TierDetailPage() {
  const current = tierMeta(SUMMARY.currentTier);
  const next = nextTier(SUMMARY.currentTier)!;
  const tierPct = Math.round(
    ((SUMMARY.currentScore - current.scoreFloor) / (next.scoreFloor - current.scoreFloor)) * 100
  );
  const currentIdx = TIER_LADDER.findIndex(t => t.tier === SUMMARY.currentTier);

  return (
    <div className="an2 an2-detail">
      <div style={{ paddingTop: 32 }}>
        <Link href="/creator/analytics" className="an2-back">Analytics</Link>

        <header className="an2-detail__head">
          <div>
            <p className="an2-eyebrow">Progression · live</p>
            <h1 className="an2-detail__title">Tier</h1>
            <p className="an2-detail__sub">
              Your tier is the lever for everything else — base pay, commission, milestone size,
              concurrent slots, payout speed, merchant access. Scores update weekly from
              completion + reliability + quality + satisfaction + engagement.
            </p>
          </div>
          <div style={{ textAlign: "right" }}>
            <p style={{ fontFamily: "var(--font-display)", fontSize: 80, fontWeight: 800, letterSpacing: "-0.04em", lineHeight: 0.9, margin: 0, color: "var(--ink)" }}>
              {SUMMARY.currentScore}
            </p>
            <p style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "var(--ink-4)", letterSpacing: "0.06em", textTransform: "uppercase", fontWeight: 700, marginTop: 8 }}>
              push score
            </p>
          </div>
        </header>

        {/* Path to next tier */}
        <section className="an2-card" style={{ marginBottom: 32 }}>
          <p className="an2-card__eyebrow">Path to next</p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", gap: 32, alignItems: "center" }}>
            <div>
              <p style={{ fontFamily: "var(--font-display)", fontSize: 40, fontWeight: 800, letterSpacing: "-0.025em", margin: 0, color: "var(--ink)" }}>
                {current.tier}
              </p>
              <p style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "var(--ink-4)", margin: "6px 0 0", letterSpacing: "0.04em", textTransform: "uppercase", fontWeight: 700 }}>
                {current.material} · score {current.scoreFloor}+
              </p>
            </div>
            <div style={{ textAlign: "center" }}>
              <p style={{ fontFamily: "var(--font-display)", fontSize: 32, fontWeight: 800, color: "var(--ink)", margin: 0, letterSpacing: "-0.02em" }}>
                {next.scoreFloor - SUMMARY.currentScore}
              </p>
              <p style={{ fontFamily: "var(--font-body)", fontSize: 11, color: "var(--ink-4)", letterSpacing: "0.06em", textTransform: "uppercase", fontWeight: 700, marginTop: 6 }}>
                pts away
              </p>
            </div>
            <div style={{ textAlign: "right" }}>
              <p style={{ fontFamily: "var(--font-display)", fontSize: 40, fontWeight: 800, letterSpacing: "-0.025em", margin: 0, color: "var(--ink-5)" }}>
                {next.tier}
              </p>
              <p style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "var(--ink-4)", margin: "6px 0 0", letterSpacing: "0.04em", textTransform: "uppercase", fontWeight: 700 }}>
                {next.material} · score {next.scoreFloor}+
              </p>
            </div>
          </div>
          <div style={{ marginTop: 24, height: 12, background: "var(--surface-3)", borderRadius: 6, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${Math.max(2, tierPct)}%`, background: "var(--accent-blue)", borderRadius: 6, transition: "width 1000ms cubic-bezier(0.22, 1, 0.36, 1)" }} />
          </div>
        </section>

        <div className="an2-grid-2">
          {/* Score dimensions */}
          <section className="an2-card">
            <p className="an2-card__eyebrow">Score dimensions · weighted</p>
            <h2 className="an2-card__title">What's holding the score</h2>
            <div>
              {SUMMARY.scoreDimensions.map(d => {
                const below = d.value < d.target;
                const pct = (d.value / 100) * 100;
                return (
                  <div key={d.name} className="an2-dim">
                    <span className="an2-dim__lbl">{d.name}</span>
                    <div className="an2-dim__track">
                      <div className={"an2-dim__fill" + (below ? " below" : "")} style={{ width: `${pct}%` }} />
                    </div>
                    <span className="an2-dim__val">{d.value}</span>
                    <span className="an2-dim__weight">{d.weight}%</span>
                  </div>
                );
              })}
            </div>
            <div style={{ marginTop: 20, padding: 14, background: "var(--surface-2)", borderRadius: 10, fontFamily: "var(--font-body)", fontSize: 13, color: "var(--ink-3)", lineHeight: 1.55 }}>
              <strong style={{ fontFamily: "var(--font-display)", color: "var(--ink)", fontWeight: 700 }}>Quality</strong> is your weakest dimension at <strong style={{ fontFamily: "var(--font-display)", color: "var(--ink)" }}>64</strong> (target 75). One Premium-difficulty campaign with strong merchant rating moves Quality +6 → score +1.5 → 3 weeks faster to {next.tier}.
            </div>
          </section>

          {/* What unlocks */}
          <section className="an2-card">
            <p className="an2-card__eyebrow">{next.tier} unlocks</p>
            <h2 className="an2-card__title">Why push</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {[
                { lbl: "Commission", from: current.commission, to: next.commission, note: "per attributed transaction, 30-day window" },
                { lbl: "Base pay", from: current.basePay, to: next.basePay, note: "per campaign, before commission" },
                { lbl: "Milestone bonus", from: current.milestone ? `+$${current.milestone.bonus} @ ${current.milestone.threshold} txns` : "—", to: `+$${next.milestone!.bonus} @ ${next.milestone!.threshold} txns`, note: "monthly window" },
                { lbl: "Concurrent slots", from: `${current.concurrent}`, to: `${next.concurrent}`, note: "active campaigns" },
                { lbl: "Payout speed", from: current.payoutSpeed, to: next.payoutSpeed, note: "" },
              ].map(row => (
                <div key={row.lbl} style={{ borderBottom: "1px dotted var(--mist)", paddingBottom: 12 }}>
                  <p style={{ fontFamily: "var(--font-body)", fontSize: 11, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--ink-4)", margin: "0 0 4px" }}>{row.lbl}</p>
                  <p style={{ fontFamily: "var(--font-display)", fontSize: 16, fontWeight: 700, color: "var(--ink)", margin: 0, letterSpacing: "-0.005em" }}>
                    <span style={{ color: "var(--ink-5)", textDecoration: "line-through", marginRight: 8 }}>{row.from}</span>
                    {row.to}
                  </p>
                  {row.note && <p style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "var(--ink-4)", margin: "2px 0 0" }}>{row.note}</p>}
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Full ladder */}
        <section style={{ marginTop: 32 }}>
          <p className="an2-card__eyebrow">All tiers · 6-rung ladder</p>
          <h2 className="an2-card__title">The progression</h2>
          <div className="an2-ladder">
            {TIER_LADDER.map((t, i) => {
              const cls = i < currentIdx ? "passed" : i === currentIdx ? "current" : "locked";
              return (
                <div key={t.tier} className={`an2-rung ${cls}`}>
                  <span className="an2-rung__swatch" style={{ background: t.swatch }} />
                  <div>
                    <p className="an2-rung__name">{t.tier}</p>
                    <p className="an2-rung__material">{t.material} · score {t.scoreFloor}+</p>
                    <div className="an2-rung__meta">
                      <span><strong>{t.basePay}</strong> base</span>
                      <span><strong>{t.commission}</strong> commission</span>
                      {t.milestone && <span>milestone <strong>+${t.milestone.bonus}</strong> @ {t.milestone.threshold} txns</span>}
                      <span><strong>{t.concurrent}</strong> concurrent</span>
                      <span><strong>{t.payoutSpeed}</strong> payouts</span>
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <p className="an2-rung__score">{t.scoreFloor}</p>
                    <p className="an2-rung__score-lbl">score floor</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <p className="an2-div"><span>onward · upward.</span></p>
      </div>
    </div>
  );
}
