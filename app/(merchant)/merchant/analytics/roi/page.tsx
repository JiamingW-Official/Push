/* ROI detail — spend decomposition, revenue sources, ROI sensitivity, vs other channels */

"use client";

import Link from "next/link";
import { useMemo } from "react";
import "../analytics.css";
import {
  BASELINE_SUMMARY,
  BASELINE_PRIOR,
  extendMerchantSummary,
  fmtUsd,
  fmtNum,
  pctDelta,
  formatDelta,
} from "../_data/extend";

const CHANNEL_BENCHMARKS = [
  { channel: "Push (you)",        roi: 6.0, cost_per_visit: 1.23, source: "this dashboard" },
  { channel: "Instagram boost",   roi: 1.8, cost_per_visit: 4.10, source: "industry median, F&B" },
  { channel: "Google Local Ads",  roi: 2.4, cost_per_visit: 3.20, source: "industry median, NYC" },
  { channel: "Email blast",       roi: 3.2, cost_per_visit: 0.85, source: "internal Push baseline" },
  { channel: "Sandwich-board",    roi: 0.9, cost_per_visit: 6.50, source: "industry estimate" },
];

export default function MerchantRoiDetail() {
  const ext = useMemo(() => extendMerchantSummary(BASELINE_SUMMARY), []);
  const extPrev = useMemo(() => extendMerchantSummary(BASELINE_PRIOR), []);
  const roiDelta = pctDelta(ext.roi, extPrev.roi);

  // Sensitivity model: project ROI at +/- spend levels
  const scenarios = [
    { lbl: "Half spend",   spend: ext.spend_cents * 0.5, factor: 1.18 },
    { lbl: "Current",      spend: ext.spend_cents,       factor: 1.0 },
    { lbl: "1.5× spend",   spend: ext.spend_cents * 1.5, factor: 0.88 },
    { lbl: "2× spend",     spend: ext.spend_cents * 2.0, factor: 0.74 },
  ].map(s => ({
    ...s,
    revenue: s.spend * ext.roi * s.factor,
    roi: ext.roi * s.factor,
  }));

  const maxRoi = Math.max(...CHANNEL_BENCHMARKS.map(c => c.roi));

  return (
    <div className="an2 an2-detail">
      <div style={{ paddingTop: 32 }}>
        <Link href="/merchant/analytics" className="an2-back">Analytics</Link>

        <header className="an2-detail__head">
          <div>
            <p className="an2-eyebrow">Return on investment · 30-day window</p>
            <h1 className="an2-detail__title">{ext.roi.toFixed(1)}× ROI</h1>
            <p className="an2-detail__sub">
              For every dollar you spent on Push, <strong>{fmtUsd(ext.revenue_per_verified_cents, { decimals: 2 })} of attributed revenue
              came back per verified visit</strong>. ROI is computed against your spend (subscription + promo + platform fee) divided
              by attributed revenue from QR-verified visits in this window.
            </p>
          </div>
          <div style={{ textAlign: "right" }}>
            <p style={{ fontFamily: "var(--font-display)", fontSize: 14, color: "var(--accent-blue)", fontWeight: 700, letterSpacing: "0.04em" }}>
              ↑ {formatDelta(roiDelta, "vs prior")}
            </p>
            <p style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "var(--ink-4)", marginTop: 4 }}>
              prior 30d: {extPrev.roi.toFixed(1)}× ROI · {fmtUsd(extPrev.revenue_attributed)}
            </p>
          </div>
        </header>

        {/* Spend → revenue flow */}
        <section className="an2-card" style={{ marginBottom: 32 }}>
          <p className="an2-card__eyebrow">Spend → Revenue · this period</p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", gap: 32, alignItems: "center" }}>
            <div>
              <p style={{ fontFamily: "var(--font-display)", fontSize: 56, fontWeight: 800, color: "var(--ink-3)", margin: 0, letterSpacing: "-0.035em", lineHeight: 1, fontVariantNumeric: "tabular-nums" }}>
                {fmtUsd(ext.spend_cents)}
              </p>
              <p style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "var(--ink-4)", letterSpacing: "0.06em", textTransform: "uppercase", fontWeight: 700, marginTop: 8 }}>You spent</p>
              <div style={{ marginTop: 16 }}>
                <div style={{ display: "flex", height: 8, borderRadius: 4, overflow: "hidden", background: "var(--surface-3)" }}>
                  <div style={{ flex: ext.spend_breakdown.subscription_cents, background: "var(--ink)" }} />
                  <div style={{ flex: ext.spend_breakdown.promo_cents, background: "var(--accent-blue)" }} />
                  <div style={{ flex: ext.spend_breakdown.platform_fee_cents, background: "var(--mist)" }} />
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 10, fontFamily: "var(--font-body)", fontSize: 11, color: "var(--ink-3)", letterSpacing: "0.04em" }}>
                  <span>Sub {fmtUsd(ext.spend_breakdown.subscription_cents, { decimals: 2 })}</span>
                  <span>Promo {fmtUsd(ext.spend_breakdown.promo_cents)}</span>
                  <span>Fee {fmtUsd(ext.spend_breakdown.platform_fee_cents, { decimals: 2 })}</span>
                </div>
              </div>
            </div>
            <span style={{ fontFamily: "var(--font-display)", fontSize: 48, fontWeight: 600, color: "var(--ink-4)" }} aria-hidden>→</span>
            <div style={{ textAlign: "right" }}>
              <p style={{ fontFamily: "var(--font-display)", fontSize: 56, fontWeight: 800, color: "var(--ink)", margin: 0, letterSpacing: "-0.035em", lineHeight: 1, fontVariantNumeric: "tabular-nums" }}>
                {fmtUsd(ext.revenue_attributed)}
              </p>
              <p style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "var(--ink-4)", letterSpacing: "0.06em", textTransform: "uppercase", fontWeight: 700, marginTop: 8 }}>You earned (attributed)</p>
              <p style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "var(--ink-3)", marginTop: 16, letterSpacing: "0.02em" }}>
                {fmtNum(ext.verified_customers)} verified visits · {fmtUsd(ext.revenue_per_verified_cents, { decimals: 2 })} per visit avg
              </p>
            </div>
          </div>
        </section>

        <div className="an2-grid-2">
          {/* Channel benchmark */}
          <section className="an2-card">
            <p className="an2-card__eyebrow">Channel benchmark</p>
            <h2 className="an2-card__title">Push vs other acquisition channels</h2>
            <div>
              {CHANNEL_BENCHMARKS.map((c, i) => {
                const pct = (c.roi / maxRoi) * 100;
                const isYou = i === 0;
                return (
                  <div key={c.channel} style={{ padding: "14px 0", borderBottom: "1px dotted var(--mist)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 8 }}>
                      <span style={{ fontFamily: "var(--font-display)", fontWeight: isYou ? 800 : 600, fontSize: 14, color: "var(--ink)", letterSpacing: "-0.005em" }}>
                        {c.channel}{isYou && <span style={{ marginLeft: 8, fontFamily: "var(--font-body)", fontSize: 10, color: "var(--snow)", background: "var(--ink)", padding: "2px 6px", borderRadius: "999px", letterSpacing: "0.06em", textTransform: "uppercase", fontWeight: 700 }}>you</span>}
                      </span>
                      <span style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 16, color: isYou ? "var(--ink)" : "var(--ink-4)", fontVariantNumeric: "tabular-nums", letterSpacing: "-0.01em" }}>
                        {c.roi.toFixed(1)}×
                      </span>
                    </div>
                    <div style={{ height: 6, background: "var(--surface-3)", borderRadius: 3, overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${pct}%`, background: isYou ? "var(--ink)" : "var(--ink-4)", borderRadius: 3, transition: "width 800ms cubic-bezier(0.22,1,0.36,1)" }} />
                    </div>
                    <p style={{ fontFamily: "var(--font-body)", fontSize: 11, color: "var(--ink-4)", margin: "6px 0 0", letterSpacing: "0.02em" }}>
                      {fmtUsd(Math.round(c.cost_per_visit * 100), { decimals: 2 })}/visit · {c.source}
                    </p>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Sensitivity model */}
          <section className="an2-card">
            <p className="an2-card__eyebrow">Sensitivity model</p>
            <h2 className="an2-card__title">If you spend more (or less)</h2>
            <p style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "var(--ink-3)", lineHeight: 1.55, marginBottom: 16 }}>
              ROI typically degrades as spend grows past pilot scale — top creators saturate, then you reach lower-tier creators.
              Diminishing returns kick in at ~1.5× current spend for Tier-0 pilots.
            </p>
            <div>
              {scenarios.map((s, i) => {
                const isCurrent = i === 1;
                return (
                  <div key={s.lbl} style={{ padding: "14px 0", borderBottom: "1px dotted var(--mist)", display: "grid", gridTemplateColumns: "1fr auto auto", gap: 16, alignItems: "baseline" }}>
                    <span style={{ fontFamily: "var(--font-display)", fontWeight: isCurrent ? 800 : 600, fontSize: 14, color: isCurrent ? "var(--ink)" : "var(--ink-3)", letterSpacing: "-0.005em" }}>
                      {s.lbl}
                      {isCurrent && <span style={{ marginLeft: 8, fontFamily: "var(--font-body)", fontSize: 10, color: "var(--accent-blue)", background: "rgba(0,133,255,0.14)", padding: "2px 6px", borderRadius: "999px", letterSpacing: "0.06em", textTransform: "uppercase", fontWeight: 700 }}>now</span>}
                    </span>
                    <span style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "var(--ink-4)", letterSpacing: "0.02em", fontVariantNumeric: "tabular-nums" }}>
                      {fmtUsd(s.spend)} → {fmtUsd(s.revenue)}
                    </span>
                    <span style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 18, color: isCurrent ? "var(--ink)" : "var(--ink-3)", letterSpacing: "-0.015em", fontVariantNumeric: "tabular-nums" }}>
                      {s.roi.toFixed(1)}×
                    </span>
                  </div>
                );
              })}
            </div>
            <p style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "var(--ink-4)", marginTop: 16, lineHeight: 1.5, letterSpacing: "0.02em" }}>
              Estimate uses Push's internal saturation model — actual ROI depends on creator availability and offer mix. Validate with a test campaign before doubling.
            </p>
          </section>
        </div>

        <p className="an2-div"><span>spent · returned · in your favor.</span></p>
      </div>
    </div>
  );
}
