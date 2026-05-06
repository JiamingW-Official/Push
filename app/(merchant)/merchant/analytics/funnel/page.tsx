/* Funnel detail — 5 stages, drop-off rates, where to focus */

"use client";

import Link from "next/link";
import { useMemo } from "react";
import "../analytics.css";
import {
  BASELINE_SUMMARY,
  extendMerchantSummary,
  fmtNum,
} from "../_data/extend";

const STAGE_NOTES = [
  { stage: "Impression",
    desc: "Someone saw a creator's post or referral link surface in their feed. Estimated from creator audience × distribution rate.",
    fix: "Drives by content reach. Push creators with stronger natural distribution (Steel+) lift this." },
  { stage: "Click",
    desc: "They tapped through to your referral page. The creator's recommendation registered.",
    fix: "Creative quality, CTA clarity, offer attractiveness. Tier-1 Hero offers ~2× CTR vs Tier-2." },
  { stage: "Scan (raw)",
    desc: "They walked into the store and scanned your QR code at checkout. The visit happened.",
    fix: "Geographic proximity, hours, redemption-friction. Greenpoint creator → Manhattan store loses 60%." },
  { stage: "Verified",
    desc: "Layer-1 fulfillment passed: scan timestamp + location + content posted match. This is what you pay for.",
    fix: "Verification gap is mostly noise (multi-scans, accidental opens). 25-35% rate is healthy for QR-based attribution." },
  { stage: "Repeat",
    desc: "Same fan returned within 30 days. The mechanic compounds — push-attribution §10 attribution decay curve.",
    fix: "Tier-2 sustained offer + creator follow-up post resets attribution window. This is your renewal moat." },
];

export default function MerchantFunnelDetail() {
  const ext = useMemo(() => extendMerchantSummary(BASELINE_SUMMARY), []);
  const stages = [
    { n: ext.funnel.impressions,    lbl: "Impression" },
    { n: ext.funnel.clicks,         lbl: "Click" },
    { n: ext.funnel.scans_raw,      lbl: "Scan" },
    { n: ext.funnel.scans_verified, lbl: "Verified" },
    { n: ext.funnel.repeat,         lbl: "Repeat" },
  ];
  const max = stages[0].n;

  // Drop-off rates between stages
  const drops = stages.slice(1).map((s, i) => {
    const from = stages[i].n;
    const lostPct = ((from - s.n) / Math.max(1, from)) * 100;
    return { from: stages[i].lbl, to: s.lbl, lostPct, retained: 100 - lostPct };
  });
  const biggestDrop = drops.reduce((max, d) => d.lostPct > max.lostPct ? d : max, drops[0]);

  return (
    <div className="an2 an2-detail">
      <div style={{ paddingTop: 32 }}>
        <Link href="/merchant/analytics" className="an2-back">Analytics</Link>

        <header className="an2-detail__head">
          <div>
            <p className="an2-eyebrow">Conversion funnel · 5 stages</p>
            <h1 className="an2-detail__title">Funnel</h1>
            <p className="an2-detail__sub">
              Push&apos;s attribution rail, end to end. Each stage has a different remedy when it
              under-performs — diagnose the stage that&apos;s leaking, not the one that&apos;s already
              tight. Your biggest leak is{" "}
              <strong>{biggestDrop.from} → {biggestDrop.to}</strong> at {biggestDrop.lostPct.toFixed(0)}% loss.
            </p>
          </div>
          <div style={{ textAlign: "right" }}>
            <p style={{ fontFamily: "var(--font-display)", fontSize: 64, fontWeight: 800, letterSpacing: "-0.04em", lineHeight: 0.9, margin: 0, color: "var(--ink)" }}>
              {((ext.funnel.repeat / Math.max(1, ext.funnel.impressions)) * 100).toFixed(2)}%
            </p>
            <p style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "var(--ink-4)", letterSpacing: "0.06em", textTransform: "uppercase", fontWeight: 700, marginTop: 6 }}>
              impression → repeat
            </p>
          </div>
        </header>

        {/* Funnel visualization — vertical stacked bars with drop-off arrows between */}
        <section style={{ marginBottom: 32 }}>
          <p className="an2-card__eyebrow">Stage volume · log-ish scale</p>
          <div className="an2-card" style={{ padding: "32px 28px" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              {stages.map((s, i) => {
                const widthPct = (s.n / max) * 100;
                const drop = i > 0 ? drops[i - 1] : null;
                return (
                  <div key={s.lbl}>
                    {drop && (
                      <div style={{ padding: "6px 0 6px 28px", display: "flex", alignItems: "center", gap: 8, fontFamily: "var(--font-body)", fontSize: 11, color: "var(--ink-4)", letterSpacing: "0.04em", textTransform: "uppercase", fontWeight: 700 }}>
                        <span style={{ fontFamily: "var(--font-display)", color: drop.lostPct > 60 ? "var(--brand-red)" : "var(--ink-4)", fontWeight: 800 }}>
                          ↓ {drop.lostPct.toFixed(0)}% lost
                        </span>
                        <span style={{ color: "var(--ink-5)" }}>· {drop.retained.toFixed(0)}% retained</span>
                      </div>
                    )}
                    <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                      <span style={{ width: 100, fontFamily: "var(--font-body)", fontSize: 11, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--ink-3)" }}>
                        {s.lbl}
                      </span>
                      <div style={{ flex: 1, height: 44, background: "var(--surface-3)", borderRadius: 10, overflow: "hidden", position: "relative" }}>
                        <div style={{
                          height: "100%",
                          width: `${widthPct}%`,
                          background: i === 0 ? "var(--ink)" :
                                      i === 1 ? "rgba(20,19,15,0.85)" :
                                      i === 2 ? "rgba(20,19,15,0.65)" :
                                      i === 3 ? "var(--brand-red)" :
                                                "var(--accent-blue)",
                          borderRadius: 10,
                          transition: "width 1000ms cubic-bezier(0.22,1,0.36,1)",
                          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.15)",
                        }} />
                        <span style={{
                          position: "absolute",
                          left: widthPct > 20 ? 16 : `calc(${widthPct}% + 12px)`,
                          top: "50%",
                          transform: "translateY(-50%)",
                          fontFamily: "var(--font-display)",
                          fontWeight: 800,
                          fontSize: 16,
                          color: widthPct > 20 ? "var(--snow)" : "var(--ink)",
                          fontVariantNumeric: "tabular-nums",
                          letterSpacing: "-0.01em",
                        }}>
                          {fmtNum(s.n)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Stage-by-stage explanation */}
        <section style={{ marginBottom: 32 }}>
          <p className="an2-card__eyebrow">What each stage means · how to fix it</p>
          <h2 className="an2-card__title">Stage diagnostics</h2>
          {STAGE_NOTES.map((note, i) => {
            const drop = i > 0 ? drops[i - 1] : null;
            const isBiggest = drop && biggestDrop.from === drop.from;
            return (
              <div key={note.stage} className="an2-layer" style={isBiggest ? { boxShadow: "inset 0 1px 0 rgba(255,255,255,0.85), inset 0 0 0 1.5px var(--brand-red), 0 6px 18px rgba(60,45,30,0.05)" } : undefined}>
                <span className="an2-layer__num">{i + 1}</span>
                <div>
                  <h3 className="an2-layer__name">
                    {note.stage}
                    {isBiggest && <span style={{ marginLeft: 10, fontFamily: "var(--font-body)", fontSize: 10, color: "var(--brand-red)", background: "rgba(193,18,31,0.10)", padding: "3px 8px", borderRadius: "999px", letterSpacing: "0.06em", textTransform: "uppercase", fontWeight: 700, verticalAlign: "middle" }}>biggest leak</span>}
                  </h3>
                  <p className="an2-layer__desc">{note.desc}</p>
                  <p className="an2-layer__desc" style={{ marginTop: 8, color: "var(--ink-4)", fontStyle: "italic" }}>
                    Lever: {note.fix}
                  </p>
                </div>
                <span className="an2-layer__weight">
                  {fmtNum(stages[i].n)}
                </span>
              </div>
            );
          })}
        </section>

        <p className="an2-div"><span>impression · click · scan · verify · return.</span></p>
      </div>
    </div>
  );
}
