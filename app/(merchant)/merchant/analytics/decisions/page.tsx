/* Decisions detail — recommendation engine, scenarios, modeling, transparent rules */

"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import "../analytics.css";
import {
  BASELINE_SUMMARY,
  extendMerchantSummary,
  fmtUsd,
  fmtNum,
} from "../_data/extend";

const SCENARIOS = [
  {
    id: "renew",
    label: "Renew current plan",
    body: "Hold cadence steady · Starter $19.99 + same promo budget · 2 creators · 30-day evaluation cycle",
    spend_factor: 1.0,
    revenue_factor: 1.0,
    confidence: "Predictable · low risk",
    fit: "Working but not surprising",
  },
  {
    id: "expand",
    label: "Renew + expand",
    body: "Upgrade to Growth $69 · 4 concurrent campaigns · onboard 2 more creators including 1 Steel-tier",
    spend_factor: 2.2,
    revenue_factor: 1.85,
    confidence: "Strong · ROI projection drops to 5.0× at this scale",
    fit: "Best for current ROI signal",
  },
  {
    id: "vertical",
    label: "Vertical expansion",
    body: "Stay Starter · same promo budget but pivot to Tier-2 sustained offer instead of Hero · longer fan tail",
    spend_factor: 1.0,
    revenue_factor: 1.4,
    confidence: "Medium · sustained-offer model less proven at Phase-0 scale",
    fit: "If you suspect repeat is the lever",
  },
  {
    id: "pause",
    label: "Pause + reassess",
    body: "Stop new campaigns · let existing windows close · 30-day cooling period · diagnose before committing more",
    spend_factor: 0.0,
    revenue_factor: 0.45,    // tail revenue from existing decay window
    confidence: "Conservative · forfeits attribution-window tail",
    fit: "If something feels off",
  },
];

export default function MerchantDecisionsDetail() {
  const ext = useMemo(() => extendMerchantSummary(BASELINE_SUMMARY), []);
  const [selectedId, setSelectedId] = useState(ext.recommendation.action === "expand" ? "expand" : ext.recommendation.action === "renew" ? "renew" : ext.recommendation.action === "pause" ? "pause" : "renew");

  const selected = SCENARIOS.find(s => s.id === selectedId)!;

  const projectedSpend = ext.spend_cents * selected.spend_factor;
  const projectedRevenue = ext.revenue_attributed * selected.revenue_factor;
  const projectedRoi = projectedSpend > 0 ? projectedRevenue / projectedSpend : 0;
  const monthlyDelta = projectedRevenue - projectedSpend - (ext.revenue_attributed - ext.spend_cents);

  return (
    <div className="an2 an2-detail">
      <div style={{ paddingTop: 32 }}>
        <Link href="/merchant/analytics" className="an2-back">Analytics</Link>

        <header className="an2-detail__head">
          <div>
            <p className="an2-eyebrow">Decision · this period&apos;s recommendation</p>
            <h1 className="an2-detail__title">Decision</h1>
            <p className="an2-detail__sub">
              The recommendation is rule-based · transparent · auditable. No black-box AI scoring.
              You can see exactly which threshold fired and which scenario your numbers matched.
              When the recommendation engine evolves to ML in P2, this page becomes the model-output review surface.
            </p>
          </div>
          <div style={{ textAlign: "right" }}>
            <p style={{ fontFamily: "var(--font-display)", fontSize: 64, fontWeight: 800, letterSpacing: "-0.04em", lineHeight: 0.9, margin: 0, color: "var(--ink)" }}>
              {ext.roi.toFixed(1)}×
            </p>
            <p style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "var(--ink-4)", letterSpacing: "0.06em", textTransform: "uppercase", fontWeight: 700, marginTop: 6 }}>
              current ROI
            </p>
          </div>
        </header>

        {/* Engine recommendation banner */}
        <section className="an2-card" style={{ marginBottom: 32 }}>
          <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: 24, alignItems: "center", marginBottom: 16 }}>
            <div className={`an2-decisions__icon ${ext.recommendation.action}`}>
              {ext.recommendation.action === "expand" ? "✦" : ext.recommendation.action === "renew" ? "↻" : ext.recommendation.action === "pause" ? "‖" : "!"}
            </div>
            <div>
              <span className={`an2-decisions__sev ${ext.recommendation.action}`}>
                Engine recommendation · {ext.recommendation.confidence} confidence
              </span>
              <h2 className="an2-decisions__headline" style={{ marginTop: 8, fontSize: 28 }}>
                {ext.recommendation.headline}
              </h2>
            </div>
          </div>
          <p className="an2-decisions__body" style={{ fontSize: 15, maxWidth: "72ch" }}>
            {ext.recommendation.body}
          </p>
          <div style={{ marginTop: 20, padding: 14, background: "var(--surface-2)", borderRadius: 10, fontFamily: "var(--font-body)", fontSize: 12, color: "var(--ink-3)", lineHeight: 1.55 }}>
            <strong style={{ fontFamily: "var(--font-display)", color: "var(--ink)", fontWeight: 700 }}>Rule fired:</strong>{" "}
            <span style={{ fontFamily: "'SF Mono', ui-monospace, monospace", color: "var(--ink)" }}>{ext.recommendation.rule}</span>
            {" "}— current values: ROI <strong>{ext.roi.toFixed(1)}×</strong> ·
            fraud rate <strong>{((ext.fraud_flags / Math.max(1, ext.verified_customers)) * 100).toFixed(1)}%</strong> ·
            verified <strong>{fmtNum(ext.verified_customers)}</strong>.
          </div>

          <div style={{ marginTop: 20, display: "flex", gap: 12, flexWrap: "wrap" }}>
            {ext.recommendation.next_steps.map(step => (
              step.href ? (
                <Link key={step.label} href={step.href} className="an2-export">
                  {step.label} →
                </Link>
              ) : (
                <button key={step.label} className="an2-export" style={{ opacity: 0.7 }}>{step.label}</button>
              )
            ))}
          </div>
        </section>

        {/* Scenario modeler */}
        <section style={{ marginBottom: 32 }}>
          <p className="an2-card__eyebrow">Scenario model · what each path looks like</p>
          <h2 className="an2-card__title">If you choose…</h2>
          <div className="an2-grid-2" style={{ gridTemplateColumns: "1fr 1.4fr" }}>
            {/* Scenario chooser */}
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {SCENARIOS.map(s => {
                const isActive = s.id === selectedId;
                return (
                  <button
                    key={s.id}
                    onClick={() => setSelectedId(s.id)}
                    className="an2-card"
                    style={{
                      cursor: "pointer", textAlign: "left", border: "none",
                      outline: isActive ? "2px solid var(--ink)" : "none",
                      outlineOffset: 0,
                      transition: "transform 220ms cubic-bezier(0.34, 1.56, 0.64, 1)",
                    }}
                    onMouseEnter={e => e.currentTarget.style.transform = "translate(2px, 2px)"}
                    onMouseLeave={e => e.currentTarget.style.transform = "translate(0,0)"}
                  >
                    <p style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 18, color: "var(--ink)", margin: 0, letterSpacing: "-0.012em" }}>
                      {s.label}
                    </p>
                    <p style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "var(--ink-3)", marginTop: 6, lineHeight: 1.5 }}>
                      {s.body}
                    </p>
                    <p style={{ fontFamily: "var(--font-body)", fontSize: 11, color: "var(--ink-4)", marginTop: 8, letterSpacing: "0.04em", textTransform: "uppercase", fontWeight: 700 }}>
                      {s.fit}
                    </p>
                  </button>
                );
              })}
            </div>

            {/* Selected scenario projection */}
            <div className="an2-card">
              <p className="an2-card__eyebrow">Projection · {selected.label}</p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 24 }}>
                <div style={{ padding: 16, borderRadius: 10, background: "var(--surface-2)" }}>
                  <p style={{ fontFamily: "var(--font-body)", fontSize: 11, color: "var(--ink-4)", letterSpacing: "0.06em", textTransform: "uppercase", fontWeight: 700, margin: "0 0 6px" }}>Spend</p>
                  <p style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 28, color: "var(--ink)", margin: 0, letterSpacing: "-0.025em", fontVariantNumeric: "tabular-nums" }}>
                    {fmtUsd(projectedSpend)}
                  </p>
                  <p style={{ fontFamily: "var(--font-body)", fontSize: 11, color: "var(--ink-4)", marginTop: 4 }}>
                    {selected.spend_factor === 1 ? "same as current" : selected.spend_factor === 0 ? "no new spend" : `${selected.spend_factor}× current`}
                  </p>
                </div>
                <div style={{ padding: 16, borderRadius: 10, background: "var(--surface-2)" }}>
                  <p style={{ fontFamily: "var(--font-body)", fontSize: 11, color: "var(--ink-4)", letterSpacing: "0.06em", textTransform: "uppercase", fontWeight: 700, margin: "0 0 6px" }}>Projected revenue</p>
                  <p style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 28, color: "var(--ink)", margin: 0, letterSpacing: "-0.025em", fontVariantNumeric: "tabular-nums" }}>
                    {fmtUsd(projectedRevenue)}
                  </p>
                  <p style={{ fontFamily: "var(--font-body)", fontSize: 11, color: "var(--ink-4)", marginTop: 4 }}>
                    {selected.revenue_factor.toFixed(1)}× scaling
                  </p>
                </div>
                <div style={{ padding: 16, borderRadius: 10, background: "var(--surface-2)" }}>
                  <p style={{ fontFamily: "var(--font-body)", fontSize: 11, color: "var(--ink-4)", letterSpacing: "0.06em", textTransform: "uppercase", fontWeight: 700, margin: "0 0 6px" }}>Projected ROI</p>
                  <p style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 28, color: projectedRoi >= 4 ? "var(--accent-blue)" : "var(--ink)", margin: 0, letterSpacing: "-0.025em", fontVariantNumeric: "tabular-nums" }}>
                    {projectedRoi.toFixed(1)}×
                  </p>
                  <p style={{ fontFamily: "var(--font-body)", fontSize: 11, color: "var(--ink-4)", marginTop: 4 }}>
                    {projectedRoi >= ext.roi ? `+${(projectedRoi - ext.roi).toFixed(1)}× vs current` : `${(projectedRoi - ext.roi).toFixed(1)}× vs current`}
                  </p>
                </div>
                <div style={{ padding: 16, borderRadius: 10, background: "var(--surface-2)" }}>
                  <p style={{ fontFamily: "var(--font-body)", fontSize: 11, color: "var(--ink-4)", letterSpacing: "0.06em", textTransform: "uppercase", fontWeight: 700, margin: "0 0 6px" }}>Net profit Δ</p>
                  <p style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 28, color: monthlyDelta >= 0 ? "var(--ink)" : "var(--ink-4)", margin: 0, letterSpacing: "-0.025em", fontVariantNumeric: "tabular-nums" }}>
                    {monthlyDelta >= 0 ? "+" : ""}{fmtUsd(monthlyDelta)}
                  </p>
                  <p style={{ fontFamily: "var(--font-body)", fontSize: 11, color: "var(--ink-4)", marginTop: 4 }}>
                    vs current monthly
                  </p>
                </div>
              </div>

              <div style={{ padding: 16, background: "var(--surface-2)", borderRadius: 10 }}>
                <p style={{ fontFamily: "var(--font-body)", fontSize: 11, color: "var(--ink-4)", letterSpacing: "0.06em", textTransform: "uppercase", fontWeight: 700, margin: "0 0 6px" }}>Confidence</p>
                <p style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "var(--ink-3)", margin: 0, lineHeight: 1.55 }}>
                  {selected.confidence}
                </p>
              </div>
            </div>
          </div>
        </section>

        <p className="an2-div"><span>renew · expand · pause · reassess.</span></p>
      </div>
    </div>
  );
}
