/* Moves detail — full action queue + dismissed history + how it's generated */

"use client";

import { useState } from "react";
import Link from "next/link";
import "../analytics.css";
import { MOVES } from "../_data/mock";

const DISMISSED = [
  { id: "mv_archive_1", date: "2026-04-28", headline: "Williamsburg saturation warning",  outcome: "Acted · LES test campaign launched 04-30" },
  { id: "mv_archive_2", date: "2026-04-21", headline: "Refresh content on Cha Cha Matcha", outcome: "Acted · follow-up reel posted 04-22" },
  { id: "mv_archive_3", date: "2026-04-14", headline: "Hit milestone via Friday push",     outcome: "Acted · 31/30 hit on 04-15" },
  { id: "mv_archive_4", date: "2026-04-07", headline: "Apply to Brow Theory before close",  outcome: "Acted · application accepted" },
];

export default function MovesDetailPage() {
  const [active, setActive] = useState<typeof MOVES[number]>(MOVES[0]);

  return (
    <div className="an2 an2-detail">
      <div style={{ paddingTop: 32 }}>
        <Link href="/creator/analytics" className="an2-back">Analytics</Link>

        <header className="an2-detail__head">
          <div>
            <p className="an2-eyebrow">Suggested moves · refreshed daily</p>
            <h1 className="an2-detail__title">Moves</h1>
            <p className="an2-detail__sub">
              Rule-based suggestions surfaced from your data — never raw AI hallucination.
              Each move has a numeric trigger, a clear action, and an explicit reasoning trail.
              When agentic generation lands in P1, this page becomes the surface where the
              MerchAgent posts its weekly recommendations.
            </p>
          </div>
          <div style={{ textAlign: "right" }}>
            <p style={{ fontFamily: "var(--font-display)", fontSize: 64, fontWeight: 800, letterSpacing: "-0.04em", lineHeight: 0.9, margin: 0, color: "var(--ink)" }}>
              {MOVES.length}
            </p>
            <p style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "var(--ink-4)", letterSpacing: "0.06em", textTransform: "uppercase", fontWeight: 700, marginTop: 6 }}>
              live moves
            </p>
          </div>
        </header>

        <div className="an2-grid-2" style={{ gridTemplateColumns: "1fr 1.4fr" }}>
          {/* Move queue */}
          <section>
            <p className="an2-card__eyebrow">Queue · pick one</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {MOVES.map(m => (
                <button
                  key={m.id}
                  onClick={() => setActive(m)}
                  className="an2-card"
                  style={{
                    cursor: "pointer", textAlign: "left",
                    border: "none",
                    outline: active.id === m.id ? "2px solid var(--ink)" : "none",
                    outlineOffset: 0,
                    transition: "transform 220ms cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 220ms ease",
                  }}
                  onMouseEnter={e => e.currentTarget.style.transform = "translate(2px, 2px)"}
                  onMouseLeave={e => e.currentTarget.style.transform = "translate(0,0)"}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                    <span className={`an2-moves__sev ${m.severity}`} style={{ marginBottom: 0 }}>{m.severity}</span>
                  </div>
                  <p style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 18, color: "var(--ink)", margin: 0, letterSpacing: "-0.015em", lineHeight: 1.25 }}>
                    <span style={{ fontSize: 28, marginRight: 10 }}>{m.numeral}</span>
                    {m.headline}
                  </p>
                  <p style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "var(--ink-4)", margin: "8px 0 0", letterSpacing: "0.02em" }}>
                    {m.context}
                  </p>
                </button>
              ))}
            </div>

            <div style={{ marginTop: 32 }}>
              <p className="an2-card__eyebrow">Acted · last 4 weeks</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {DISMISSED.map(d => (
                  <div key={d.id} style={{ padding: 14, borderRadius: 10, background: "var(--surface-2)" }}>
                    <p style={{ fontFamily: "var(--font-body)", fontSize: 11, color: "var(--ink-4)", letterSpacing: "0.04em", textTransform: "uppercase", fontWeight: 700, margin: "0 0 4px" }}>{d.date}</p>
                    <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 14, color: "var(--ink)", margin: 0, letterSpacing: "-0.005em" }}>{d.headline}</p>
                    <p style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "var(--ink-3)", margin: "4px 0 0" }}>{d.outcome}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Active move detail */}
          <section className="an2-card" style={{ minHeight: 480 }}>
            <span className={`an2-moves__sev ${active.severity}`}>{active.severity}</span>
            <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 36, color: "var(--ink)", margin: "16px 0 12px", letterSpacing: "-0.025em", lineHeight: 1.1 }}>
              <span style={{ fontSize: 56, marginRight: 12 }}>{active.numeral}</span>
              {active.headline}
            </h2>
            <p style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "var(--ink-4)", margin: "0 0 24px", letterSpacing: "0.04em", textTransform: "uppercase", fontWeight: 700 }}>
              {active.context}
            </p>
            <p style={{ fontFamily: "var(--font-body)", fontSize: 16, color: "var(--ink)", lineHeight: 1.65, margin: 0, maxWidth: "60ch" }}>
              {active.body}
            </p>

            <div style={{ marginTop: 32, padding: 20, borderRadius: 10, background: "var(--surface-2)" }}>
              <p style={{ fontFamily: "var(--font-body)", fontSize: 11, color: "var(--ink-4)", letterSpacing: "0.06em", textTransform: "uppercase", fontWeight: 700, margin: "0 0 10px" }}>How this was surfaced</p>
              <p style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "var(--ink-3)", lineHeight: 1.6, margin: 0 }}>
                Rule: <span style={{ fontFamily: "'SF Mono', ui-monospace, monospace", color: "var(--ink)" }}>
                  {active.severity === "risk" && "fans.expiringIn ≤ 7 && fans.decay !== 'expired'"}
                  {active.severity === "milestone" && "tier.next.scoreFloor − tier.score ≤ 7"}
                  {active.severity === "opportunity" && "neighborhood.peerMedian / neighborhood.you ≥ 1.8"}
                </span>
                {" "}— deterministic, refreshed at 06:00 ET daily.
              </p>
            </div>

            <div style={{ display: "flex", gap: 12, marginTop: 24, flexWrap: "wrap" }}>
              <Link
                href={active.ctaHref}
                style={{
                  display: "inline-flex", padding: "14px 24px",
                  background: "var(--brand-red)", color: "var(--snow)",
                  borderRadius: 10, textDecoration: "none",
                  fontFamily: "var(--font-body)", fontSize: 13, fontWeight: 700,
                  letterSpacing: "0.06em", textTransform: "uppercase",
                  transition: "transform 220ms cubic-bezier(0.34, 1.56, 0.64, 1)",
                }}
              >
                {active.cta} →
              </Link>
              <button className="an2-export">Dismiss · not relevant</button>
              <button className="an2-export">Dismiss · already done</button>
            </div>
          </section>
        </div>

        <p className="an2-div"><span>recommended · acted · archived.</span></p>
      </div>
    </div>
  );
}
