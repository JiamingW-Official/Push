/* Earnings detail — decomposition + per-campaign + 6-month trajectory */

"use client";

import Link from "next/link";
import "../analytics.css";
import {
  SUMMARY,
  TIME_SERIES,
  CAMPAIGNS,
  PER_CAMPAIGN_EARNINGS,
  fmtUsd,
  pctDelta,
  formatDelta,
} from "../_data/mock";

export default function EarningsDetailPage() {
  const { earnings } = SUMMARY;
  const earningsDelta = pctDelta(earnings.total, SUMMARY.earningsPrior);
  const total = earnings.total;

  // Approximate trajectory by scaling raw scans to current ratio
  const earningsPerScan = earnings.total / SUMMARY.scansVerified;
  const trajectory = TIME_SERIES.map(d => ({
    m: d.m,
    earnings: Math.round(d.verified * earningsPerScan),
  }));
  const maxTraj = Math.max(...trajectory.map(t => t.earnings));

  return (
    <div className="an2 an2-detail">
      <div style={{ paddingTop: 32 }}>
        <Link href="/creator/analytics" className="an2-back">Analytics</Link>

        <header className="an2-detail__head">
          <div>
            <p className="an2-eyebrow">Earnings · last 30 days</p>
            <h1 className="an2-detail__title">{fmtUsd(earnings.total)}</h1>
            <p className="an2-detail__sub">
              Push pays you three ways: <strong>base pay</strong> per accepted campaign,{" "}
              <strong>commission</strong> on attributed transactions in the 30-day window,
              and <strong>milestone bonus</strong> when you cross monthly referral thresholds.
              The mix tells you what's actually working.
            </p>
          </div>
          <div style={{ textAlign: "right" }}>
            <p style={{ fontFamily: "var(--font-body)", fontSize: 14, color: "var(--accent-blue)", fontWeight: 700, letterSpacing: 0.04, margin: 0 }}>
              ↑ {formatDelta(earningsDelta)}
            </p>
            <p style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "var(--ink-4)", marginTop: 4 }}>
              prior 30d: {fmtUsd(SUMMARY.earningsPrior)}
            </p>
          </div>
        </header>

        <div className="an2-grid-2">
          {/* Decomposition */}
          <section className="an2-card">
            <p className="an2-card__eyebrow">Decomposition · this window</p>
            <h2 className="an2-card__title">Where the money came from</h2>
            <div className="an2-eb">
              {(["base", "commission", "milestone"] as const).map(k => {
                const v = earnings[k];
                const pct = (v / total) * 100;
                const labels: Record<typeof k, string> = {
                  base: "Base pay",
                  commission: "Commission",
                  milestone: "Milestone",
                };
                return (
                  <div key={k} className="an2-eb__row">
                    <span className="an2-eb__lbl">{labels[k]}</span>
                    <div className="an2-eb__bar-wrap">
                      <div className={`an2-eb__bar ${k}`} style={{ width: `${pct}%` }} />
                    </div>
                    <span className="an2-eb__val">{fmtUsd(v)}</span>
                  </div>
                );
              })}
              <div className="an2-eb__row" style={{ marginTop: 12, paddingTop: 12, borderTop: "1px solid var(--hairline, var(--mist))" }}>
                <span className="an2-eb__lbl" style={{ color: "var(--ink)" }}>Total</span>
                <div />
                <span className="an2-eb__val" style={{ fontSize: 24 }}>{fmtUsd(total)}</span>
              </div>
            </div>
            <div style={{ marginTop: 20, padding: 14, background: "var(--surface-2)", borderRadius: 10, fontFamily: "var(--font-body)", fontSize: 13, color: "var(--ink-3)", lineHeight: 1.55 }}>
              <strong style={{ fontFamily: "var(--font-display)", color: "var(--ink)", fontWeight: 700 }}>Milestone</strong> drove{" "}
              <strong style={{ fontFamily: "var(--font-display)", color: "var(--ink)" }}>{Math.round((earnings.milestone / total) * 100)}%</strong>{" "}
              of this month's earnings. It's the highest-leverage line — at Operator, $0.18 commission on a $7 coffee is rounding error;
              the milestone +$15 is the actual lever.
            </div>
          </section>

          {/* Per-campaign */}
          <section className="an2-card">
            <p className="an2-card__eyebrow">By campaign</p>
            <h2 className="an2-card__title">Where it came from</h2>
            <div>
              {PER_CAMPAIGN_EARNINGS.map(c => {
                const c2 = CAMPAIGNS.find(x => x.id === c.id)!;
                return (
                  <div key={c.id} style={{ padding: "12px 0", borderBottom: "1px dotted var(--mist)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 6 }}>
                      <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 14, color: "var(--ink)", letterSpacing: "-0.005em" }}>
                        {c.name}
                      </span>
                      <span style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 16, color: "var(--ink)", fontVariantNumeric: "tabular-nums", letterSpacing: "-0.01em" }}>
                        ${c.total}
                      </span>
                    </div>
                    <div style={{ display: "flex", height: 6, borderRadius: 3, overflow: "hidden", background: "var(--surface-3)" }}>
                      <div style={{ flex: c.base, background: "var(--ink)" }} title={`Base $${c.base}`} />
                      <div style={{ flex: c.commission, background: "var(--accent-blue)" }} title={`Commission $${c.commission}`} />
                      <div style={{ flex: c.milestone, background: "var(--champagne)" }} title={`Milestone $${c.milestone}`} />
                    </div>
                    <div style={{ display: "flex", gap: 12, marginTop: 6, fontFamily: "var(--font-body)", fontSize: 11, color: "var(--ink-4)", letterSpacing: "0.04em" }}>
                      <span>base ${c.base}</span>
                      <span>comm ${c.commission}</span>
                      {c.milestone > 0 && <span>milestone ${c.milestone}</span>}
                      <span style={{ marginLeft: "auto" }}>{c2.verified} verified · {Math.round(c2.repeatPct * 100)}% repeat</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </div>

        {/* Trajectory */}
        <section className="an2-card" style={{ marginTop: 32 }}>
          <p className="an2-card__eyebrow">Trajectory · last 6 months</p>
          <h2 className="an2-card__title">Earnings curve</h2>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 16, height: 200, padding: "16px 0" }}>
            {trajectory.map((t, i) => {
              const isCurrent = i === trajectory.length - 1;
              const h = (t.earnings / maxTraj) * 100;
              return (
                <div key={t.m} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 8, height: "100%" }}>
                  <div style={{ flex: 1, width: "100%", display: "flex", alignItems: "flex-end", position: "relative" }}>
                    <div style={{
                      width: "100%",
                      height: `${h}%`,
                      background: isCurrent ? "var(--brand-red)" : "var(--mist)",
                      borderRadius: "6px 6px 0 0",
                      transition: "background 200ms ease",
                      position: "relative",
                    }} title={`${t.m}: ${fmtUsd(t.earnings)}`}>
                      <span style={{
                        position: "absolute",
                        top: -22,
                        left: "50%",
                        transform: "translateX(-50%)",
                        fontFamily: "var(--font-display)",
                        fontWeight: 700,
                        fontSize: 12,
                        color: isCurrent ? "var(--brand-red)" : "var(--ink-4)",
                        whiteSpace: "nowrap",
                        fontVariantNumeric: "tabular-nums",
                      }}>${t.earnings}</span>
                    </div>
                  </div>
                  <span style={{ fontFamily: "var(--font-body)", fontSize: 11, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--ink-4)" }}>{t.m}</span>
                </div>
              );
            })}
          </div>
          <p style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "var(--ink-3)", marginTop: 16, lineHeight: 1.55 }}>
            Steady growth from ~${trajectory[0].earnings} to ${trajectory[trajectory.length - 1].earnings} over 6 months.
            Crossing into <strong style={{ fontFamily: "var(--font-display)", color: "var(--ink)", fontWeight: 700 }}>Proven</strong>{" "}
            (5% commission, $25–40/campaign) projects ${Math.round(trajectory[trajectory.length - 1].earnings * 1.85)} at the same campaign volume.
          </p>
        </section>

        <p className="an2-div"><span>posted · scanned · paid.</span></p>
      </div>
    </div>
  );
}
