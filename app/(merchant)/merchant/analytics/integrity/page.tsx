/* Integrity detail — fraud log, confidence distribution, layer-by-layer audit */

"use client";

import Link from "next/link";
import { useMemo } from "react";
import "../analytics.css";
import {
  BASELINE_SUMMARY,
  extendMerchantSummary,
  fmtNum,
} from "../_data/extend";

const VERIFICATION_LAYERS = [
  { num: "1", name: "Fulfillment",    weight: "35%",
    desc: "QR scan timestamp + GPS location confirms the visit happened. Layer-1 is binary: scanned at your location during open hours, or rejected." },
  { num: "2", name: "Content",        weight: "25%",
    desc: "Creator's post is live, persists, matches campaign brief. Verified via URL + screenshot + persistence check after 14 days." },
  { num: "3", name: "Engagement",     weight: "10%",
    desc: "Views, clicks, saves. Directional only — this is the most gameable layer, so Push weights it lightest." },
  { num: "4", name: "Merchant action", weight: "20%",
    desc: "Hero offer redemption, booking, check-in. Merchant-side ground truth. Your QR code generates this evidence automatically." },
  { num: "5", name: "Repeat signal",  weight: "10%",
    desc: "Same fan returns within 30 days. Compounds via the decay curve — visible on /repeat detail." },
];

const FRAUD_LOG: { date: string; flag: string; outcome: "false-positive" | "confirmed" | "investigating"; layer: string }[] = [
  // Empty for current period — Williamsburg pilot has 0 fraud flags
];

export default function MerchantIntegrityDetail() {
  const ext = useMemo(() => extendMerchantSummary(BASELINE_SUMMARY), []);
  const total = ext.confidence_dist.high + ext.confidence_dist.medium + ext.confidence_dist.low;
  const fraudRate = (ext.fraud_flags / Math.max(1, ext.verified_customers)) * 100;

  return (
    <div className="an2 an2-detail">
      <div style={{ paddingTop: 32 }}>
        <Link href="/merchant/analytics" className="an2-back">Analytics</Link>

        <header className="an2-detail__head">
          <div>
            <p className="an2-eyebrow">Integrity · trust + fraud</p>
            <h1 className="an2-detail__title">{ext.fraud_flags === 0 ? "Clean" : `${ext.fraud_flags} flagged`}</h1>
            <p className="an2-detail__sub">
              Five-layer verification stack from push-attribution §2. Every visit you pay for cleared
              all five — that's why Push payouts feel slow vs Instagram boost (Layer 2 has a 14-day
              persistence check). Slowness is the feature: it eliminates the gaming surface.
            </p>
          </div>
          <div style={{ textAlign: "right" }}>
            <p style={{ fontFamily: "var(--font-display)", fontSize: 64, fontWeight: 800, letterSpacing: "-0.04em", lineHeight: 0.9, margin: 0, color: ext.fraud_flags > 0 ? "var(--brand-red)" : "var(--ink)" }}>
              {fraudRate.toFixed(2)}%
            </p>
            <p style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "var(--ink-4)", letterSpacing: "0.06em", textTransform: "uppercase", fontWeight: 700, marginTop: 6 }}>
              fraud rate
            </p>
          </div>
        </header>

        <div className="an2-stub-banner">
          <span className="an2-stub-banner__icon">P1</span>
          <p className="an2-stub-banner__msg">
            <strong>Sprint goal:</strong> wire real-time fraud log + per-flag drilldown (which Layer caught it, which creator/fan, what action was taken).
            Today this page shows confidence distribution from real summary + the 5-layer explainer.
          </p>
        </div>

        {/* Confidence distribution */}
        <section className="an2-card" style={{ marginBottom: 32 }}>
          <p className="an2-card__eyebrow">Confidence distribution · all verified visits this period</p>
          <h2 className="an2-card__title">{fmtNum(total)} verified · how confident</h2>
          <div className="an2-grid-3">
            {[
              { k: "high", lbl: "High", v: ext.confidence_dist.high, color: "var(--accent-blue)", note: "all 5 layers cleared, fast payout" },
              { k: "med",  lbl: "Medium", v: ext.confidence_dist.medium, color: "var(--ink-4)", note: "missing Layer 4 or 5 — held 24h then released" },
              { k: "low",  lbl: "Low", v: ext.confidence_dist.low, color: "var(--champagne)", note: "Layer 1+2 only, manual review" },
            ].map(row => {
              const pct = total > 0 ? (row.v / total) * 100 : 0;
              return (
                <div key={row.k} className="an2-bucket">
                  <span className="an2-bucket__title">
                    <span className="an2-bucket__swatch" style={{ background: row.color }} />
                    {row.lbl}
                  </span>
                  <p className="an2-bucket__sub">{row.note}</p>
                  <p className="an2-bucket__num">{row.v}</p>
                  <p style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "var(--ink-4)", margin: "8px 0 0", letterSpacing: "0.04em" }}>
                    {pct.toFixed(0)}% of verified
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        <div className="an2-grid-2">
          {/* 5-layer stack */}
          <section>
            <p className="an2-card__eyebrow">Verification stack · push-attribution §2</p>
            <h2 className="an2-card__title">5 layers, weighted</h2>
            {VERIFICATION_LAYERS.map(L => (
              <div key={L.num} className="an2-layer">
                <span className="an2-layer__num">{L.num}</span>
                <div>
                  <h3 className="an2-layer__name">{L.name}</h3>
                  <p className="an2-layer__desc">{L.desc}</p>
                </div>
                <span className="an2-layer__weight">{L.weight}</span>
              </div>
            ))}
          </section>

          {/* Fraud log */}
          <section className="an2-card">
            <p className="an2-card__eyebrow">Fraud log · this period</p>
            <h2 className="an2-card__title">{FRAUD_LOG.length === 0 ? "Nothing flagged" : `${FRAUD_LOG.length} events`}</h2>
            {FRAUD_LOG.length === 0 ? (
              <div style={{ padding: "48px 24px", textAlign: "center", background: "var(--surface-2)", borderRadius: 14 }}>
                <p style={{ fontFamily: "Times New Roman, Georgia, serif", fontStyle: "italic", fontSize: 28, color: "var(--ink)", margin: "0 0 12px", letterSpacing: "-0.005em" }}>
                  Clean.
                </p>
                <p style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "var(--ink-3)", margin: 0, lineHeight: 1.55, maxWidth: "44ch", marginLeft: "auto", marginRight: "auto" }}>
                  Zero fraud flags this period. Push&apos;s 5-layer stack rejected upstream noise before it reached your visit count — that&apos;s why your verification rate looks lower than raw scans.
                </p>
              </div>
            ) : (
              <div>
                {FRAUD_LOG.map(f => (
                  <div key={f.date} style={{ padding: "12px 0", borderBottom: "1px solid var(--hairline, var(--mist))" }}>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 14, color: "var(--ink)" }}>{f.flag}</span>
                      <span className={`an2-status ${f.outcome === "confirmed" ? "ended" : "pending"}`}>{f.outcome}</span>
                    </div>
                    <p style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "var(--ink-4)", margin: "4px 0 0" }}>{f.date} · caught at {f.layer}</p>
                  </div>
                ))}
              </div>
            )}

            <div style={{ marginTop: 24, padding: 14, background: "var(--surface-2)", borderRadius: 10 }}>
              <p style={{ fontFamily: "var(--font-body)", fontSize: 11, color: "var(--ink-4)", letterSpacing: "0.06em", textTransform: "uppercase", fontWeight: 700, margin: "0 0 6px" }}>What we watch for</p>
              <p style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "var(--ink-3)", margin: 0, lineHeight: 1.5 }}>
                Same-device repeat scans · same-IP redemption clustering · creator-merchant collusion patterns · fake fulfillment timing mismatches · milestone-bonus gaming near thresholds.
              </p>
            </div>
          </section>
        </div>

        <p className="an2-div"><span>scanned · verified · cleared.</span></p>
      </div>
    </div>
  );
}
