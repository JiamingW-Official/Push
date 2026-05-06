/* Trajectory detail — extended time-series with daily/weekly/monthly toggles */

"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import "../analytics.css";
import {
  BASELINE_SUMMARY,
  extendMerchantSummary,
  fmtNum,
  fmtUsd,
} from "../_data/extend";

type Resolution = "daily" | "weekly" | "monthly";

const MONTHLY_HISTORY = [
  { period: "Dec",  verified: 88,  revenue:  68000 },
  { period: "Jan",  verified: 102, revenue:  78400 },
  { period: "Feb",  verified: 116, revenue:  88600 },
  { period: "Mar",  verified: 128, revenue:  95000 },
  { period: "Apr",  verified: 138, revenue: 102400 },
  { period: "May",  verified: 152, revenue: 112400 },
];

export default function MerchantTrajectoryDetail() {
  const ext = useMemo(() => extendMerchantSummary(BASELINE_SUMMARY), []);
  const [res, setRes] = useState<Resolution>("daily");

  // Build week-aggregated data from by_day
  const weekly = useMemo(() => {
    const weeks: { period: string; verified: number; revenue: number }[] = [];
    const days = [...ext.by_day];
    while (days.length > 0) {
      const chunk = days.splice(0, 7);
      const verifiedSum = chunk.reduce((s, d) => s + d.verified, 0);
      weeks.push({
        period: chunk[0]?.date.slice(5) ?? "",
        verified: verifiedSum,
        revenue: verifiedSum * (ext.revenue_per_verified_cents),
      });
    }
    return weeks;
  }, [ext.by_day, ext.revenue_per_verified_cents]);

  const data =
    res === "daily" ? ext.by_day.map(d => ({ period: d.date.slice(5), verified: d.verified, revenue: d.verified * ext.revenue_per_verified_cents }))
    : res === "weekly" ? weekly
    : MONTHLY_HISTORY;

  const max = Math.max(...data.map(d => d.verified), 1);
  const totalVerified = data.reduce((s, d) => s + d.verified, 0);
  const totalRevenue = data.reduce((s, d) => s + d.revenue, 0);

  return (
    <div className="an2 an2-detail">
      <div style={{ paddingTop: 32 }}>
        <Link href="/merchant/analytics" className="an2-back">Analytics</Link>

        <header className="an2-detail__head">
          <div>
            <p className="an2-eyebrow">Trajectory · time-series · {res}</p>
            <h1 className="an2-detail__title">{fmtUsd(totalRevenue)}</h1>
            <p className="an2-detail__sub">
              Verified visits + attributed revenue over time. Daily resolution is good for spotting
              campaign launch effects and weekend-bump patterns. Weekly smooths noise.
              Monthly shows the long arc — does the rail compound?
            </p>
          </div>
          <div className="an2-chips">
            {(["daily", "weekly", "monthly"] as const).map(r => (
              <button key={r} onClick={() => setRes(r)} className={"an2-chip" + (res === r ? " is-active" : "")}>
                {r}
              </button>
            ))}
          </div>
        </header>

        <div className="an2-stub-banner">
          <span className="an2-stub-banner__icon">P1</span>
          <p className="an2-stub-banner__msg">
            <strong>Sprint goal:</strong> add overlay layers (campaign launch markers, holidays, weather correlation), custom date range picker, and CSV export.
            Today this page wires real <code>by_day</code> at three resolution levels.
          </p>
        </div>

        <section className="an2-card" style={{ marginBottom: 24 }}>
          <p className="an2-card__eyebrow">{res === "daily" ? "Last 30 days" : res === "weekly" ? "By week" : "Last 6 months"} · verified visits</p>
          <h2 className="an2-card__title" style={{ marginBottom: 24 }}>
            {fmtNum(totalVerified)} verified · {fmtUsd(totalRevenue)} attributed
          </h2>
          <div style={{ display: "flex", alignItems: "flex-end", gap: res === "daily" ? 4 : 12, height: 240, padding: "16px 0", position: "relative" }}>
            {data.map((d, i) => {
              const isCurrent = i === data.length - 1;
              const h = (d.verified / max) * 100;
              return (
                <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 8, height: "100%" }}>
                  <div style={{ flex: 1, width: "100%", display: "flex", alignItems: "flex-end", position: "relative" }}>
                    <div style={{
                      width: "100%",
                      height: `${Math.max(2, h)}%`,
                      background: isCurrent ? "var(--brand-red)" : "var(--ink)",
                      borderRadius: "4px 4px 0 0",
                      position: "relative",
                      transition: "height 600ms cubic-bezier(0.22,1,0.36,1)",
                      boxShadow: "inset 0 1px 0 rgba(255,255,255,0.15)",
                    }} title={`${d.period}: ${d.verified} verified · ${fmtUsd(d.revenue)}`}>
                      {(res !== "daily" || isCurrent) && (
                        <span style={{
                          position: "absolute",
                          top: -22,
                          left: "50%",
                          transform: "translateX(-50%)",
                          fontFamily: "var(--font-display)",
                          fontWeight: 700,
                          fontSize: 11,
                          color: isCurrent ? "var(--brand-red)" : "var(--ink-4)",
                          whiteSpace: "nowrap",
                          fontVariantNumeric: "tabular-nums",
                        }}>{d.verified}</span>
                      )}
                    </div>
                  </div>
                  {(res !== "daily" || i % 5 === 0 || isCurrent) && (
                    <span style={{ fontFamily: "var(--font-body)", fontSize: 10, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--ink-4)" }}>{d.period}</span>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        <div className="an2-grid-3">
          {[
            { lbl: "Best day so far",  v: `${Math.max(...data.map(d => d.verified))} verified`, sub: data.find(d => d.verified === Math.max(...data.map(x => x.verified)))?.period ?? "" },
            { lbl: "Lowest day",       v: `${Math.min(...data.map(d => d.verified))} verified`, sub: data.find(d => d.verified === Math.min(...data.map(x => x.verified)))?.period ?? "" },
            { lbl: "Daily average",    v: `${(totalVerified / data.length).toFixed(1)} verified`, sub: `${fmtUsd(totalRevenue / data.length)} avg revenue` },
          ].map(row => (
            <div key={row.lbl} className="an2-card">
              <p className="an2-card__eyebrow">{row.lbl}</p>
              <p style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 32, color: "var(--ink)", margin: 0, letterSpacing: "-0.025em", lineHeight: 1, fontVariantNumeric: "tabular-nums" }}>
                {row.v}
              </p>
              <p style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "var(--ink-4)", margin: "8px 0 0", letterSpacing: "0.02em" }}>
                {row.sub}
              </p>
            </div>
          ))}
        </div>

        <p className="an2-div"><span>day · week · month · arc.</span></p>
      </div>
    </div>
  );
}
