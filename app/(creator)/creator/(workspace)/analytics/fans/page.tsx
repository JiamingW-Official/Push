/* Fans detail — full repeat-customer roster + decay buckets + expiring soon
 * Push signature surface — v5.4 §4 Attribution Decay Curve made visible.
 */

"use client";

import Link from "next/link";
import "../analytics.css";
import {
  SUMMARY,
  FANS,
  DECAY_DIST,
  DECAY_LABEL,
  DECAY_COLOR,
  fmtNum,
  fmtUsd,
} from "../_data/mock";

export default function FansDetailPage() {
  const expiring = [...FANS]
    .filter(f => f.expiresIn !== null && f.expiresIn <= 7)
    .sort((a, b) => (a.expiresIn ?? 0) - (b.expiresIn ?? 0));

  const sortedFans = [...FANS].sort((a, b) => b.revenue - a.revenue);

  return (
    <div className="an2 an2-detail">
      <div style={{ paddingTop: 32 }}>
        <Link href="/creator/analytics" className="an2-back">Analytics</Link>

        <header className="an2-detail__head">
          <div>
            <p className="an2-eyebrow">Push signature · attribution rail</p>
            <h1 className="an2-detail__title">Fans</h1>
            <p className="an2-detail__sub">
              Anonymous fans who came back through your referral. This is what Push measures
              that Instagram cannot. Each fan moves through the <strong>v5.4 Attribution Decay Curve</strong>{" "}
              — 100% → 50% → 30% → 10% → 0% as their last visit ages out the 30-day window.
              Re-engage before they decay.
            </p>
          </div>
          <div style={{ textAlign: "right" }}>
            <p style={{ fontFamily: "var(--font-display)", fontSize: 64, fontWeight: 800, letterSpacing: "-0.04em", lineHeight: 0.9, margin: 0, color: "var(--ink)" }}>
              {fmtNum(SUMMARY.repeatCustomers)}
            </p>
            <p style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "var(--ink-4)", letterSpacing: "0.06em", textTransform: "uppercase", fontWeight: 700, marginTop: 6 }}>
              fans returned this window
            </p>
          </div>
        </header>

        {/* Decay buckets */}
        <section style={{ marginBottom: 32 }}>
          <p className="an2-card__eyebrow">Decay buckets</p>
          <h2 className="an2-card__title" style={{ marginBottom: 20 }}>How fresh your attribution is</h2>
          <div className="an2-grid-3" style={{ gridTemplateColumns: "repeat(5, 1fr)" }}>
            {DECAY_DIST.map(seg => {
              const labelParts = DECAY_LABEL[seg.tier].split(" ");
              const colorVal = DECAY_COLOR[seg.tier];
              return (
                <div key={seg.tier} className="an2-bucket">
                  <span className="an2-bucket__title">
                    <span className="an2-bucket__swatch" style={{ background: colorVal }} />
                    {labelParts[0]}
                  </span>
                  <p className="an2-bucket__sub">{labelParts.slice(1).join(" ") || ""}</p>
                  <p className="an2-bucket__num" style={{ color: seg.tier === "expired" ? "var(--ink-5)" : "var(--ink)" }}>
                    {seg.count}
                  </p>
                  <p style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "var(--ink-4)", margin: "8px 0 0", letterSpacing: "0.04em" }}>
                    {Math.round(seg.share * 100)}% of fans
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        <div className="an2-grid-2">
          {/* Top fans full list */}
          <section className="an2-card">
            <p className="an2-card__eyebrow">Top fans · all repeat customers</p>
            <h2 className="an2-card__title">By attributed revenue</h2>
            <div>
              {sortedFans.map((f, i) => (
                <div key={f.id} style={{ display: "grid", gridTemplateColumns: "auto 1fr 80px 80px auto", gap: 14, alignItems: "center", padding: "14px 0", borderBottom: "1px dotted var(--mist)" }}>
                  <span style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 14, color: "var(--ink-4)", width: 22, textAlign: "right", fontVariantNumeric: "tabular-nums" }}>
                    {i + 1}
                  </span>
                  <div>
                    <p style={{ fontFamily: "'SF Mono', ui-monospace, monospace", fontSize: 13, color: "var(--ink)", margin: 0, letterSpacing: "0.02em" }}>
                      <span style={{ color: "var(--ink-5)" }}>fan_</span>{f.id}
                    </p>
                    <p style={{ fontFamily: "var(--font-body)", fontSize: 11, color: "var(--ink-4)", margin: "4px 0 0", letterSpacing: "0.02em" }}>
                      {f.campaigns.join(" · ")}
                    </p>
                  </div>
                  <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 14, color: "var(--ink)", textAlign: "right", fontVariantNumeric: "tabular-nums" }}>
                    {f.visits}<span style={{ fontFamily: "var(--font-body)", fontWeight: 500, fontSize: 11, color: "var(--ink-4)", marginLeft: 4 }}>visits</span>
                  </span>
                  <span style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 14, color: "var(--ink)", textAlign: "right", fontVariantNumeric: "tabular-nums", letterSpacing: "-0.01em" }}>
                    {fmtUsd(f.revenue)}
                  </span>
                  <span className={`an2-decay-pill ${f.decay}`}>{DECAY_LABEL[f.decay].split(" ")[0]}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Expiring soon */}
          <section className="an2-card">
            <p className="an2-card__eyebrow">Expiring this week · action queue</p>
            <h2 className="an2-card__title">Lock these in</h2>
            <div>
              {expiring.length === 0 && (
                <p style={{ fontFamily: "var(--font-body)", fontSize: 14, color: "var(--ink-4)", lineHeight: 1.55 }}>
                  No fans expiring in the next 7 days. Solid.
                </p>
              )}
              {expiring.map(f => (
                <div key={f.id} style={{ padding: "14px 0", borderBottom: "1px solid var(--hairline, var(--mist))" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                    <span style={{ fontFamily: "'SF Mono', ui-monospace, monospace", fontSize: 13, color: "var(--ink)" }}>
                      <span style={{ color: "var(--ink-5)" }}>fan_</span>{f.id}
                    </span>
                    <span className={`an2-decay-pill ${f.decay}`}>{DECAY_LABEL[f.decay].split(" ")[0]}</span>
                  </div>
                  <p style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "var(--ink-3)", margin: "6px 0 0", lineHeight: 1.5 }}>
                    Last visit <strong style={{ fontFamily: "var(--font-display)", color: "var(--ink)" }}>{f.daysSinceLast} days ago</strong>{" "}
                    · expires in <strong style={{ fontFamily: "var(--font-display)", color: "var(--ink)" }}>{f.expiresIn} days</strong>{" "}
                    · {fmtUsd(f.revenue)} attributed across {f.visits} visits
                  </p>
                </div>
              ))}
            </div>
            <Link
              href="/creator/work/drafts"
              style={{
                display: "inline-flex", marginTop: 20, padding: "12px 20px",
                background: "var(--ink)", color: "var(--snow)",
                borderRadius: 10, textDecoration: "none",
                fontFamily: "var(--font-body)", fontSize: 13, fontWeight: 700,
                letterSpacing: "0.06em", textTransform: "uppercase",
                transition: "transform 220ms cubic-bezier(0.34, 1.56, 0.64, 1)",
              }}
            >
              Draft a follow-up post →
            </Link>
          </section>
        </div>

        <p className="an2-div"><span>returned · attributed · renewed.</span></p>
      </div>
    </div>
  );
}
