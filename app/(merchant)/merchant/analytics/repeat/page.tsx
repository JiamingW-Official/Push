/* Repeat customers detail — cohort retention, decay distribution, week-by-week */

"use client";

import Link from "next/link";
import { useMemo } from "react";
import "../analytics.css";
import {
  BASELINE_SUMMARY,
  extendMerchantSummary,
  DECAY_LABEL,
  DECAY_COLOR,
  fmtNum,
  fmtUsd,
} from "../_data/extend";

const COHORT_RETENTION = [
  { week: "Week 1", n: 152, retentionByWeek: [100, 38, 22, 14] },
  { week: "Week 2", n: 144, retentionByWeek: [100, 35, 20] },
  { week: "Week 3", n: 138, retentionByWeek: [100, 32] },
  { week: "Week 4", n: 132, retentionByWeek: [100] },
];

export default function MerchantRepeatDetail() {
  const ext = useMemo(() => extendMerchantSummary(BASELINE_SUMMARY), []);

  return (
    <div className="an2 an2-detail">
      <div style={{ paddingTop: 32 }}>
        <Link href="/merchant/analytics" className="an2-back">Analytics</Link>

        <header className="an2-detail__head">
          <div>
            <p className="an2-eyebrow">Repeat customers · v5.4 attribution decay</p>
            <h1 className="an2-detail__title">{fmtNum(ext.repeat_customers)} repeat</h1>
            <p className="an2-detail__sub">
              {(ext.repeat_share * 100).toFixed(0)}% of your verified visits came back · they drive {(ext.repeat_revenue_share * 100).toFixed(0)}% of attributed revenue.
              Push&apos;s attribution decay curve (push-attribution §10) means the longer since their last visit,
              the less you pay per credit. <strong>Re-engaging fans before they age out is your renewal moat.</strong>
            </p>
          </div>
        </header>

        <div className="an2-stub-banner">
          <span className="an2-stub-banner__icon">P1</span>
          <p className="an2-stub-banner__msg">
            <strong>Sprint goal:</strong> wire real cohort retention from push_transactions table — today this page shows decay distribution from real summary +
            illustrative weekly cohorts. Once the schema ships, this page becomes the merchant-side flagship for "is the rail compounding?"
          </p>
        </div>

        {/* Decay buckets */}
        <section style={{ marginBottom: 32 }}>
          <p className="an2-card__eyebrow">Decay buckets · where your repeat fans are in the window</p>
          <div className="an2-grid-3" style={{ gridTemplateColumns: "repeat(5, 1fr)" }}>
            {ext.decay_dist.map(seg => {
              const labelParts = DECAY_LABEL[seg.tier].split(" ");
              return (
                <div key={seg.tier} className="an2-bucket">
                  <span className="an2-bucket__title">
                    <span className="an2-bucket__swatch" style={{ background: DECAY_COLOR[seg.tier] }} />
                    {labelParts[0]}
                  </span>
                  <p className="an2-bucket__sub">{labelParts.slice(1).join(" ") || ""}</p>
                  <p className="an2-bucket__num" style={{ color: seg.tier === "expired" ? "var(--ink-5)" : "var(--ink)" }}>
                    {seg.count}
                  </p>
                  <p style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "var(--ink-4)", margin: "8px 0 0", letterSpacing: "0.04em" }}>
                    {Math.round(seg.share * 100)}% of repeat
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        <div className="an2-grid-2">
          {/* Cohort retention */}
          <section className="an2-card">
            <p className="an2-card__eyebrow">Cohort retention · weekly</p>
            <h2 className="an2-card__title">% of cohort still active</h2>
            <div>
              {COHORT_RETENTION.map(row => (
                <div key={row.week} style={{ padding: "12px 0", borderBottom: "1px dotted var(--mist)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 8 }}>
                    <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 14, color: "var(--ink)" }}>{row.week}</span>
                    <span style={{ fontFamily: "var(--font-body)", fontSize: 11, color: "var(--ink-4)", letterSpacing: "0.04em" }}>{row.n} customers</span>
                  </div>
                  <div style={{ display: "flex", gap: 4, height: 28 }}>
                    {row.retentionByWeek.map((pct, i) => (
                      <div key={i} style={{
                        flex: 1,
                        background: i === 0 ? "var(--ink)" : `rgba(20,19,15,${0.85 - i * 0.18})`,
                        borderRadius: 4,
                        display: "grid", placeItems: "center",
                        fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 11,
                        color: "var(--snow)",
                        fontVariantNumeric: "tabular-nums",
                      }}>{pct}%</div>
                    ))}
                    {Array.from({ length: 4 - row.retentionByWeek.length }).map((_, i) => (
                      <div key={`empty-${i}`} style={{ flex: 1, background: "var(--surface-3)", borderRadius: 4 }} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <p style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "var(--ink-4)", margin: "12px 0 0", letterSpacing: "0.02em" }}>
              W1 → W4 retention curve. 14% at week 4 is solid for F&B local.
            </p>
          </section>

          {/* Repeat economics */}
          <section className="an2-card">
            <p className="an2-card__eyebrow">Repeat economics</p>
            <h2 className="an2-card__title">What repeat fans are worth</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {[
                { lbl: "Repeat customer count", v: fmtNum(ext.repeat_customers) },
                { lbl: "Avg visits per repeat fan", v: "2.4" },
                { lbl: "Revenue per repeat fan",    v: fmtUsd(Math.round(ext.revenue_per_verified_cents * 2.4), { decimals: 2 }) },
                { lbl: "Repeat → total revenue",    v: `${(ext.repeat_revenue_share * 100).toFixed(0)}%` },
                { lbl: "First-visit → repeat rate", v: `${(ext.repeat_share * 100).toFixed(0)}%` },
                { lbl: "Avg days between visits",   v: "11.2" },
              ].map(row => (
                <div key={row.lbl} style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", padding: "10px 0", borderBottom: "1px dotted var(--mist)" }}>
                  <span style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "var(--ink-3)" }}>{row.lbl}</span>
                  <span style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 18, color: "var(--ink)", fontVariantNumeric: "tabular-nums", letterSpacing: "-0.015em" }}>{row.v}</span>
                </div>
              ))}
            </div>
          </section>
        </div>

        <p className="an2-div"><span>came · stayed · came back.</span></p>
      </div>
    </div>
  );
}
