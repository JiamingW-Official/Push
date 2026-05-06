/* Campaigns detail — full list with filters + per-campaign deep stats */

"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import "../analytics.css";
import { CAMPAIGNS, fmtUsd, fmtNum, type CampaignStatus } from "../_data/mock";

type StatusFilter = "all" | CampaignStatus;
type CategoryFilter = "all" | "Food" | "Beauty" | "Lifestyle";
type Sort = "earnings" | "verified" | "repeat" | "perScan";

export default function CampaignsDetailPage() {
  const [status, setStatus] = useState<StatusFilter>("all");
  const [category, setCategory] = useState<CategoryFilter>("all");
  const [sort, setSort] = useState<Sort>("earnings");

  const filtered = useMemo(() => {
    let rows = CAMPAIGNS.filter(c =>
      (status === "all" || c.status === status) &&
      (category === "all" || c.category === category)
    );
    rows.sort((a, b) => {
      switch (sort) {
        case "earnings":  return b.earnings - a.earnings;
        case "verified":  return b.verified - a.verified;
        case "repeat":    return b.repeatPct - a.repeatPct;
        case "perScan":   return b.perScan - a.perScan;
      }
    });
    return rows;
  }, [status, category, sort]);

  const totalEarnings = filtered.reduce((s, c) => s + c.earnings, 0);
  const totalVerified = filtered.reduce((s, c) => s + c.verified, 0);
  const avgPerScan = filtered.length === 0 ? 0 : filtered.reduce((s, c) => s + c.perScan, 0) / filtered.length;

  return (
    <div className="an2 an2-detail">
      <div style={{ paddingTop: 32 }}>
        <Link href="/creator/analytics" className="an2-back">Analytics</Link>

        <header className="an2-detail__head">
          <div>
            <p className="an2-eyebrow">By campaign · {filtered.length} of {CAMPAIGNS.length}</p>
            <h1 className="an2-detail__title">Campaigns</h1>
            <p className="an2-detail__sub">
              Sort by what matters: <strong>Earnings</strong> tells you what paid this month.{" "}
              <strong>Repeat %</strong> tells you which merchants build long-term value.
              <strong> $/scan</strong> tells you which neighborhood / category to lean into.
            </p>
          </div>
          <div style={{ textAlign: "right", display: "flex", flexDirection: "column", gap: 4 }}>
            <p style={{ fontFamily: "var(--font-display)", fontSize: 36, fontWeight: 800, letterSpacing: "-0.025em", margin: 0, color: "var(--ink)", fontVariantNumeric: "tabular-nums" }}>
              {fmtUsd(totalEarnings)}
            </p>
            <p style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "var(--ink-4)", letterSpacing: "0.04em" }}>
              {fmtNum(totalVerified)} verified · avg {fmtUsd(avgPerScan, { cents: true })}/scan
            </p>
          </div>
        </header>

        {/* Filters */}
        <div style={{ display: "flex", gap: 16, marginBottom: 24, flexWrap: "wrap", alignItems: "center" }}>
          <div className="an2-chips">
            {(["all", "active", "ended", "pending"] as const).map(s => (
              <button key={s} onClick={() => setStatus(s)} className={"an2-chip" + (status === s ? " is-active" : "")}>
                {s === "all" ? "All status" : s}
              </button>
            ))}
          </div>
          <div className="an2-chips">
            {(["all", "Food", "Beauty", "Lifestyle"] as const).map(c => (
              <button key={c} onClick={() => setCategory(c)} className={"an2-chip" + (category === c ? " is-active" : "")}>
                {c === "all" ? "All cat" : c}
              </button>
            ))}
          </div>
          <div className="an2-chips" style={{ marginLeft: "auto" }}>
            {(["earnings", "verified", "repeat", "perScan"] as const).map(s => (
              <button key={s} onClick={() => setSort(s)} className={"an2-chip" + (sort === s ? " is-active" : "")}>
                Sort: {s === "perScan" ? "$/scan" : s}
              </button>
            ))}
          </div>
        </div>

        {/* Cards instead of table — one card per campaign, asymmetric content */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {filtered.map(c => (
            <article key={c.id} className="an2-card" style={{ display: "grid", gridTemplateColumns: "minmax(0, 1.6fr) repeat(4, 1fr) auto", gap: 24, alignItems: "center" }}>
              <div style={{ minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                  <span className={`an2-status ${c.status}`}>{c.status}</span>
                  <span style={{ fontFamily: "var(--font-body)", fontSize: 11, color: "var(--ink-4)", letterSpacing: "0.06em", textTransform: "uppercase", fontWeight: 700 }}>
                    {c.category} · {c.neighborhood}
                  </span>
                </div>
                <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 22, color: "var(--ink)", margin: 0, letterSpacing: "-0.018em", lineHeight: 1.15 }}>
                  {c.name}
                </h3>
                <p style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "var(--ink-4)", margin: "6px 0 0", letterSpacing: "0.02em" }}>
                  {c.startedAt} → {c.endsAt}
                </p>
              </div>
              <div>
                <p style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 22, color: "var(--ink)", margin: 0, letterSpacing: "-0.018em", fontVariantNumeric: "tabular-nums" }}>{c.verified}</p>
                <p style={{ fontFamily: "var(--font-body)", fontSize: 11, color: "var(--ink-4)", letterSpacing: "0.06em", textTransform: "uppercase", fontWeight: 700, marginTop: 4 }}>verified</p>
              </div>
              <div>
                <p style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 22, color: "var(--ink)", margin: 0, letterSpacing: "-0.018em", fontVariantNumeric: "tabular-nums" }}>{c.raw}</p>
                <p style={{ fontFamily: "var(--font-body)", fontSize: 11, color: "var(--ink-4)", letterSpacing: "0.06em", textTransform: "uppercase", fontWeight: 700, marginTop: 4 }}>raw scans</p>
              </div>
              <div>
                <p style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 22, color: "var(--accent-blue)", margin: 0, letterSpacing: "-0.018em", fontVariantNumeric: "tabular-nums" }}>{Math.round(c.repeatPct * 100)}%</p>
                <p style={{ fontFamily: "var(--font-body)", fontSize: 11, color: "var(--ink-4)", letterSpacing: "0.06em", textTransform: "uppercase", fontWeight: 700, marginTop: 4 }}>repeat</p>
              </div>
              <div>
                <p style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 22, color: "var(--ink)", margin: 0, letterSpacing: "-0.018em", fontVariantNumeric: "tabular-nums" }}>{fmtUsd(c.perScan, { cents: true })}</p>
                <p style={{ fontFamily: "var(--font-body)", fontSize: 11, color: "var(--ink-4)", letterSpacing: "0.06em", textTransform: "uppercase", fontWeight: 700, marginTop: 4 }}>$/scan</p>
              </div>
              <div style={{ textAlign: "right" }}>
                <p style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 28, color: "var(--ink)", margin: 0, letterSpacing: "-0.025em", fontVariantNumeric: "tabular-nums" }}>${c.earnings}</p>
                <p style={{ fontFamily: "var(--font-body)", fontSize: 11, color: "var(--ink-4)", letterSpacing: "0.06em", textTransform: "uppercase", fontWeight: 700, marginTop: 4 }}>earned</p>
              </div>
            </article>
          ))}

          {filtered.length === 0 && (
            <div className="an2-card" style={{ textAlign: "center", padding: "64px 32px" }}>
              <p style={{ fontFamily: "Times New Roman, Georgia, serif", fontStyle: "italic", fontSize: 28, color: "var(--ink)" }}>
                No campaigns match these filters.
              </p>
              <button onClick={() => { setStatus("all"); setCategory("all"); }} className="an2-export" style={{ marginTop: 16 }}>Clear filters</button>
            </div>
          )}
        </div>

        <p className="an2-div"><span>{filtered.length} campaigns shown · fin.</span></p>
      </div>
    </div>
  );
}
