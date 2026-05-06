/* Creators leaderboard — full list, per-creator breakdown, retention recommendations */

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

type SortKey = "revenue" | "roi" | "verified" | "scans";

export default function MerchantCreatorsDetail() {
  const [sort, setSort] = useState<SortKey>("revenue");
  const [activeId, setActiveId] = useState<string | null>(BASELINE_SUMMARY.by_creator[0]?.creator_id ?? null);

  const ext = useMemo(() => extendMerchantSummary(BASELINE_SUMMARY), []);

  const sorted = useMemo(() => {
    const rows = [...ext.by_creator];
    rows.sort((a, b) => {
      switch (sort) {
        case "revenue":  return b.revenue - a.revenue;
        case "roi":      return b.roi - a.roi;
        case "verified": return b.verified - a.verified;
        case "scans":    return b.scans - a.scans;
      }
    });
    return rows;
  }, [ext.by_creator, sort]);

  const active = sorted.find(c => c.creator_id === activeId) ?? sorted[0];

  // Synthesize a per-creator detail using campaign mock + active creator
  const creatorCampaigns = ext.by_campaign.filter(c => c.creator_id === active?.creator_id || c.creator_name === active?.creator_id);

  return (
    <div className="an2 an2-detail">
      <div style={{ paddingTop: 32 }}>
        <Link href="/merchant/analytics" className="an2-back">Analytics</Link>

        <header className="an2-detail__head">
          <div>
            <p className="an2-eyebrow">By creator · {ext.by_creator.length} active</p>
            <h1 className="an2-detail__title">Creators</h1>
            <p className="an2-detail__sub">
              Who&apos;s actually bringing customers. Sort by revenue to find your renewal anchors,
              by ROI to find efficiency, by verified to find volume. Lock in the top quartile —
              those creators drive disproportionate share and are most expensive to lose to a competitor merchant.
            </p>
          </div>
          <div style={{ textAlign: "right" }}>
            <p style={{ fontFamily: "var(--font-display)", fontSize: 64, fontWeight: 800, letterSpacing: "-0.04em", lineHeight: 0.9, margin: 0, color: "var(--ink)" }}>
              {fmtUsd(ext.revenue_attributed)}
            </p>
            <p style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "var(--ink-4)", letterSpacing: "0.06em", textTransform: "uppercase", fontWeight: 700, marginTop: 6 }}>
              total attributed
            </p>
          </div>
        </header>

        {/* Sort chips */}
        <div style={{ marginBottom: 24, display: "flex", gap: 12 }}>
          <div className="an2-chips">
            {(["revenue", "roi", "verified", "scans"] as const).map(k => (
              <button key={k} onClick={() => setSort(k)} className={"an2-chip" + (sort === k ? " is-active" : "")}>
                {k === "roi" ? "ROI" : k}
              </button>
            ))}
          </div>
        </div>

        <div className="an2-grid-2" style={{ gridTemplateColumns: "1fr 1.4fr" }}>
          {/* Leaderboard */}
          <section>
            <p className="an2-card__eyebrow">Click for detail</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {sorted.map((c, i) => {
                const isActive = c.creator_id === activeId;
                return (
                  <button
                    key={c.creator_id}
                    onClick={() => setActiveId(c.creator_id)}
                    className="an2-card"
                    style={{
                      cursor: "pointer", textAlign: "left", border: "none",
                      outline: isActive ? "2px solid var(--ink)" : "none",
                      outlineOffset: 0,
                      transition: "transform 220ms cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 220ms ease",
                    }}
                    onMouseEnter={e => e.currentTarget.style.transform = "translate(2px, 2px)"}
                    onMouseLeave={e => e.currentTarget.style.transform = "translate(0,0)"}
                  >
                    <div style={{ display: "grid", gridTemplateColumns: "auto 1fr auto", gap: 12, alignItems: "baseline" }}>
                      <span style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 18, color: i === 0 ? "var(--ink)" : "var(--ink-4)", fontVariantNumeric: "tabular-nums", width: 24, textAlign: "right" }}>
                        {i + 1}
                      </span>
                      <span style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 18, color: "var(--ink)", letterSpacing: "-0.012em", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        {c.creator_id}
                      </span>
                      <span style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 18, color: "var(--ink)", fontVariantNumeric: "tabular-nums" }}>
                        {fmtUsd(c.revenue)}
                      </span>
                    </div>
                    <div style={{ display: "flex", gap: 14, marginTop: 10, fontFamily: "var(--font-body)", fontSize: 11, color: "var(--ink-4)", letterSpacing: "0.04em", textTransform: "uppercase", fontWeight: 700 }}>
                      <span>{c.scans} scans</span>
                      <span>{c.verified} verified</span>
                      <span>{((c.verified / Math.max(1, c.scans)) * 100).toFixed(0)}% rate</span>
                      <span style={{ marginLeft: "auto", color: c.roi >= 5 ? "var(--accent-blue)" : "var(--ink-3)", fontFamily: "var(--font-display)", fontWeight: 800 }}>
                        {c.roi.toFixed(1)}× ROI
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </section>

          {/* Active creator detail */}
          {active && (
            <section className="an2-card">
              <p className="an2-card__eyebrow">Creator detail</p>
              <h2 style={{ fontFamily: "var(--font-display)", fontSize: 36, fontWeight: 800, letterSpacing: "-0.025em", margin: 0, color: "var(--ink)", lineHeight: 1.1 }}>
                {active.creator_id}
              </h2>
              <p style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "var(--ink-4)", letterSpacing: "0.04em", textTransform: "uppercase", fontWeight: 700, margin: "8px 0 24px" }}>
                {active.roi >= 6 ? "Top performer · retain at all costs" : active.roi >= 4 ? "Strong performer · keep on roster" : active.roi >= 2 ? "Working · monitor monthly" : "Underperforming · diagnose or pause"}
              </p>

              {/* Per-stat grid */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 24 }}>
                {[
                  { lbl: "Revenue", val: fmtUsd(active.revenue), tone: "ink" },
                  { lbl: "ROI",     val: `${active.roi.toFixed(1)}×`, tone: active.roi >= 5 ? "blue" : "ink" },
                  { lbl: "Verified", val: fmtNum(active.verified), tone: "ink" },
                  { lbl: "Raw scans", val: fmtNum(active.scans), tone: "muted" },
                  { lbl: "Verify rate", val: `${((active.verified / Math.max(1, active.scans)) * 100).toFixed(0)}%`, tone: "ink" },
                  { lbl: "Cost / visit", val: fmtUsd(Math.round((active.revenue / Math.max(1, active.roi)) / Math.max(1, active.verified)), { decimals: 2 }), tone: "muted" },
                ].map(s => (
                  <div key={s.lbl} style={{ padding: 14, borderRadius: 10, background: "var(--surface-2)" }}>
                    <p style={{ fontFamily: "var(--font-body)", fontSize: 11, color: "var(--ink-4)", letterSpacing: "0.06em", textTransform: "uppercase", fontWeight: 700, margin: "0 0 4px" }}>{s.lbl}</p>
                    <p style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 22, color: s.tone === "blue" ? "var(--accent-blue)" : s.tone === "muted" ? "var(--ink-3)" : "var(--ink)", margin: 0, letterSpacing: "-0.018em", fontVariantNumeric: "tabular-nums" }}>
                      {s.val}
                    </p>
                  </div>
                ))}
              </div>

              {/* Their campaigns */}
              <p className="an2-card__eyebrow" style={{ marginTop: 16 }}>Their campaigns with you</p>
              <div>
                {creatorCampaigns.length === 0 && (
                  <p style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "var(--ink-4)" }}>
                    Campaign-level breakdown wires up when getAttributionSummary returns by_campaign. Today only the top-line creator stats above are real.
                  </p>
                )}
                {creatorCampaigns.map(cmp => (
                  <div key={cmp.campaign_id} style={{ padding: "14px 0", borderBottom: "1px dotted var(--mist)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                      <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 14, color: "var(--ink)" }}>
                        {cmp.name}
                      </span>
                      <span className={`an2-status ${cmp.status}`}>{cmp.status}</span>
                    </div>
                    <p style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "var(--ink-3)", margin: "4px 0 0" }}>
                      {fmtNum(cmp.verified)} verified · {fmtUsd(cmp.revenue_cents)} attributed · {cmp.roi.toFixed(1)}× ROI
                    </p>
                  </div>
                ))}
              </div>

              <div style={{ display: "flex", gap: 12, marginTop: 24, flexWrap: "wrap" }}>
                <Link href="/merchant/campaigns/new" style={{ display: "inline-flex", padding: "12px 20px", background: "var(--ink)", color: "var(--snow)", borderRadius: 10, textDecoration: "none", fontFamily: "var(--font-body)", fontSize: 12, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", transition: "transform 220ms cubic-bezier(0.34, 1.56, 0.64, 1)" }}>
                  Spawn campaign with {active.creator_id} →
                </Link>
                <button className="an2-export">Lock in retainer</button>
              </div>
            </section>
          )}
        </div>

        <p className="an2-div"><span>posted · scanned · verified · returned.</span></p>
      </div>
    </div>
  );
}
