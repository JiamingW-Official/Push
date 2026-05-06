/* Attribution Rail detail — 5 verification layers + decay curve + last-click
 * Authority: push-attribution §1-§10 · v5.4 §4 Attribution Decay Curve
 */

"use client";

import Link from "next/link";
import "../analytics.css";
import {
  SUMMARY,
  TIME_SERIES,
  DECAY_DIST,
  DECAY_LABEL,
  DECAY_COLOR,
  fmtNum,
  type DecayTier,
} from "../_data/mock";

const LAYERS = [
  { num: "1", name: "Fulfillment", weight: "35%",
    desc: "QR scan timestamp + location confirms the visit happened. Layer-1 is binary: scanned or not." },
  { num: "2", name: "Content",     weight: "25%",
    desc: "Post is live, persists, matches campaign brief. Verified via URL + screenshot + persistence check." },
  { num: "3", name: "Engagement",  weight: "10%",
    desc: "Views, clicks, saves. Directional only — most gameable, weighted lightly per push-attribution §3." },
  { num: "4", name: "Merchant action", weight: "20%",
    desc: "Hero/Tier-2 redemption, booking, check-in. Merchant-side ground truth that links visit to value." },
  { num: "5", name: "Repeat signal", weight: "10%",
    desc: "Same fan returns within 30 days. Push's signature compounds via the decay curve." },
];

export default function AttributionDetailPage() {
  const max = Math.max(...TIME_SERIES.map(d => d.raw));

  return (
    <div className="an2 an2-detail">
      <div style={{ paddingTop: 32 }}>
        <Link href="/creator/analytics" className="an2-back">Analytics</Link>

        <header className="an2-detail__head">
          <div>
            <p className="an2-eyebrow">The rail · Push&apos;s mechanic</p>
            <h1 className="an2-detail__title">Attribution rail</h1>
            <p className="an2-detail__sub">
              Push isn&apos;t a follower count — it&apos;s a <strong>physical-world conversion measurement</strong>.
              Five verification layers turn a scan into a paid event. The decay curve turns a visit
              into recurring revenue. Last-click attribution sets the rules between competing creators.
            </p>
          </div>
          <div style={{ textAlign: "right" }}>
            <p style={{ fontFamily: "var(--font-display)", fontSize: 64, fontWeight: 800, letterSpacing: "-0.04em", lineHeight: 0.9, margin: 0, color: "var(--ink)" }}>
              {Math.round(SUMMARY.verificationRate * 100)}%
            </p>
            <p style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "var(--ink-4)", letterSpacing: "0.06em", textTransform: "uppercase", fontWeight: 700, marginTop: 6 }}>
              raw → verified
            </p>
          </div>
        </header>

        {/* Time series + verification ratio */}
        <section className="an2-card" style={{ marginBottom: 32 }}>
          <p className="an2-card__eyebrow">6-month rail · raw vs verified vs repeat</p>
          <h2 className="an2-card__title">The rail in motion</h2>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 16, height: 240, padding: "16px 0", position: "relative" }}>
            {TIME_SERIES.map((d, i) => {
              const isCurrent = i === TIME_SERIES.length - 1;
              const verifiedH = (d.verified / max) * 100;
              const rawExtraH = ((d.raw - d.verified) / max) * 100;
              const repeatH = (d.repeat / max) * 100;
              return (
                <div key={d.m} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 8, height: "100%" }}>
                  <div style={{ flex: 1, width: "100%", display: "flex", flexDirection: "column-reverse", position: "relative" }}>
                    <div style={{
                      width: "100%", height: `${verifiedH}%`,
                      background: isCurrent ? "var(--brand-red)" : "var(--ink)",
                      borderRadius: "4px 4px 0 0",
                      position: "relative",
                    }}>
                      <div style={{
                        position: "absolute", left: "50%", bottom: 4, transform: "translateX(-50%)",
                        width: 4, height: `${(repeatH / verifiedH) * 100}%`,
                        background: "var(--accent-blue)", borderRadius: 2,
                      }} />
                    </div>
                    <div style={{ width: "100%", height: `${rawExtraH}%`, background: "var(--mist)" }} />
                  </div>
                  <span style={{ fontFamily: "var(--font-body)", fontSize: 11, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--ink-4)" }}>{d.m}</span>
                  <span style={{ fontFamily: "var(--font-body)", fontSize: 10, color: "var(--ink-5)", marginTop: -4, fontVariantNumeric: "tabular-nums" }}>
                    {d.verified}/{d.raw}
                  </span>
                </div>
              );
            })}
          </div>
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap", fontFamily: "var(--font-body)", fontSize: 12, color: "var(--ink-3)", marginTop: 12 }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
              <span style={{ width: 10, height: 10, background: "var(--ink)", borderRadius: 2 }} /> Verified
            </span>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
              <span style={{ width: 10, height: 10, background: "var(--mist)", borderRadius: 2 }} /> Raw
            </span>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
              <span style={{ width: 4, height: 12, background: "var(--accent-blue)" }} /> Repeat
            </span>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
              <span style={{ width: 10, height: 10, background: "var(--brand-red)", borderRadius: 2 }} /> Current
            </span>
          </div>
        </section>

        <div className="an2-grid-2">
          {/* Five verification layers */}
          <section>
            <p className="an2-card__eyebrow">Verification stack</p>
            <h2 className="an2-card__title">5 layers, weighted</h2>
            {LAYERS.map(L => (
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

          {/* Decay curve explainer */}
          <section className="an2-card">
            <p className="an2-card__eyebrow">v5.4 attribution decay</p>
            <h2 className="an2-card__title">The decay curve</h2>
            <p style={{ fontFamily: "var(--font-body)", fontSize: 14, color: "var(--ink-3)", lineHeight: 1.6, marginBottom: 24 }}>
              When a fan returns, attribution doesn&apos;t lock to you forever — it decays.
              This is FTC compliance + Push&apos;s differentiation. Re-engaging fans before they
              age out resets their tier and protects your recurring revenue.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {([
                { tier: "fresh",   label: "0–7 days",   weight: "100%", note: "First visit · full attribution" },
                { tier: "d50",     label: "8–14 days",  weight: "50%",  note: "Half credit · still recoverable" },
                { tier: "d30",     label: "15–21 days", weight: "30%",  note: "Window closing · re-engage now" },
                { tier: "d10",     label: "22–28 days", weight: "10%",  note: "Last call · post a follow-up" },
                { tier: "expired", label: "29+ days",   weight: "0%",   note: "Window closed · attribution lost" },
              ] as { tier: DecayTier; label: string; weight: string; note: string }[]).map(s => {
                const segData = DECAY_DIST.find(d => d.tier === s.tier)!;
                return (
                  <div key={s.tier} style={{ display: "grid", gridTemplateColumns: "16px 1fr auto", gap: 14, alignItems: "center", padding: "10px 0", borderBottom: "1px dotted var(--mist)" }}>
                    <span style={{ width: 10, height: 10, borderRadius: 2, background: DECAY_COLOR[s.tier] }} />
                    <div>
                      <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 14, color: "var(--ink)", margin: 0, letterSpacing: "-0.005em" }}>
                        {s.weight} · {s.label}
                      </p>
                      <p style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "var(--ink-4)", margin: "2px 0 0" }}>{s.note}</p>
                    </div>
                    <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 14, color: "var(--ink)", fontVariantNumeric: "tabular-nums" }}>
                      {segData.count} fans
                    </span>
                  </div>
                );
              })}
            </div>
          </section>
        </div>

        {/* Last-click rule */}
        <section className="an2-card" style={{ marginTop: 32 }}>
          <p className="an2-card__eyebrow">Multi-creator attribution</p>
          <h2 className="an2-card__title">Last-click — and how to keep yours</h2>
          <p style={{ fontFamily: "var(--font-body)", fontSize: 14, color: "var(--ink-3)", lineHeight: 1.65, maxWidth: "72ch", marginBottom: 16 }}>
            When two creators promote the same merchant, <strong>the most recently used referral link gets full attribution</strong>.
            If your fan clicks Creator B&apos;s link after yours, attribution flips to B —
            even if your post drove the original visit.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
            <div style={{ padding: 18, background: "var(--surface-2)", borderRadius: 10 }}>
              <p style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 16, color: "var(--ink)", margin: 0, letterSpacing: "-0.01em" }}>You first</p>
              <p style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "var(--ink-3)", margin: "6px 0 0", lineHeight: 1.5 }}>
                Mon — fan clicks your Blank Street link. Tue — fan visits store. <strong style={{ fontFamily: "var(--font-display)", color: "var(--ink)" }}>You earn.</strong>
              </p>
            </div>
            <div style={{ padding: 18, background: "var(--surface-2)", borderRadius: 10 }}>
              <p style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 16, color: "var(--ink)", margin: 0, letterSpacing: "-0.01em" }}>B steals window</p>
              <p style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "var(--ink-3)", margin: "6px 0 0", lineHeight: 1.5 }}>
                Wed — fan clicks Creator B&apos;s link. Thu — fan returns. <strong style={{ fontFamily: "var(--font-display)", color: "var(--ink)" }}>B earns the next 30 days.</strong>
              </p>
            </div>
            <div style={{ padding: 18, background: "var(--surface-2)", borderRadius: 10 }}>
              <p style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 16, color: "var(--ink)", margin: 0, letterSpacing: "-0.01em" }}>You re-engage</p>
              <p style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "var(--ink-3)", margin: "6px 0 0", lineHeight: 1.5 }}>
                Fri — you post a follow-up. Fan clicks again. <strong style={{ fontFamily: "var(--font-display)", color: "var(--ink)" }}>Window resets to you.</strong>
              </p>
            </div>
          </div>
        </section>

        <p className="an2-div"><span>scan · verify · attribute · renew.</span></p>
      </div>
    </div>
  );
}
