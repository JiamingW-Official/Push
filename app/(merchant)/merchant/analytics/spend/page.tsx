/* Spend detail — line items, monthly trend, per-campaign cost */

"use client";

import Link from "next/link";
import { useMemo } from "react";
import "../analytics.css";
import {
  BASELINE_SUMMARY,
  extendMerchantSummary,
  fmtUsd,
} from "../_data/extend";

const SPEND_HISTORY = [
  { month: "Dec", sub: 1999, promo:  9800, fee:  590, label: "1 creator" },
  { month: "Jan", sub: 1999, promo: 10800, fee:  640, label: "2 creators" },
  { month: "Feb", sub: 1999, promo: 11200, fee:  660, label: "2 creators" },
  { month: "Mar", sub: 1999, promo: 13800, fee:  790, label: "3 creators" },
  { month: "Apr", sub: 1999, promo: 15200, fee:  860, label: "3 creators" },
  { month: "May", sub: 1999, promo: 15800, fee:  890, label: "3 creators" },
];

export default function MerchantSpendDetail() {
  const ext = useMemo(() => extendMerchantSummary(BASELINE_SUMMARY), []);
  const max = Math.max(...SPEND_HISTORY.map(h => h.sub + h.promo + h.fee));

  return (
    <div className="an2 an2-detail">
      <div style={{ paddingTop: 32 }}>
        <Link href="/merchant/analytics" className="an2-back">Analytics</Link>

        <header className="an2-detail__head">
          <div>
            <p className="an2-eyebrow">Spend · 6-month log</p>
            <h1 className="an2-detail__title">{fmtUsd(ext.spend_cents)}</h1>
            <p className="an2-detail__sub">
              Three line items · subscription is fixed at <strong>$19.99 Starter</strong>, promo is what you pay
              creators + Hero offer redemptions, platform fee is 5% of total. Promo scales with creator count.
            </p>
          </div>
        </header>

        <div className="an2-stub-banner">
          <span className="an2-stub-banner__icon">P1</span>
          <p className="an2-stub-banner__msg">
            <strong>Sprint goal:</strong> wire per-line-item drilldown (which Hero offers redeemed when, which creator's commission was paid for what).
            Today this page shows monthly aggregates only.
          </p>
        </div>

        <div className="an2-grid-2">
          <section className="an2-card">
            <p className="an2-card__eyebrow">This period · breakdown</p>
            <h2 className="an2-card__title">Where it goes</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {[
                { k: "subscription", lbl: "Subscription · Starter $19.99", v: ext.spend_breakdown.subscription_cents, color: "var(--ink)", note: "fixed monthly" },
                { k: "promo",        lbl: "Promo · Hero offers + creator base pay", v: ext.spend_breakdown.promo_cents, color: "var(--accent-blue)", note: "scales with campaign volume" },
                { k: "fee",          lbl: "Platform fee · 5% of spend",       v: ext.spend_breakdown.platform_fee_cents, color: "var(--mist)", note: "Push platform service charge" },
              ].map(row => {
                const pct = (row.v / ext.spend_breakdown.total_cents) * 100;
                return (
                  <div key={row.k}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 6 }}>
                      <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 14, color: "var(--ink)" }}>{row.lbl}</span>
                      <span style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 16, color: "var(--ink)", fontVariantNumeric: "tabular-nums" }}>{fmtUsd(row.v, { decimals: 2 })}</span>
                    </div>
                    <div style={{ height: 10, background: "var(--surface-3)", borderRadius: 5, overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${pct}%`, background: row.color, borderRadius: 5, transition: "width 1000ms cubic-bezier(0.22,1,0.36,1)" }} />
                    </div>
                    <p style={{ fontFamily: "var(--font-body)", fontSize: 11, color: "var(--ink-4)", margin: "6px 0 0", letterSpacing: "0.04em" }}>
                      {pct.toFixed(0)}% · {row.note}
                    </p>
                  </div>
                );
              })}
            </div>
          </section>

          <section className="an2-card">
            <p className="an2-card__eyebrow">6-month trend</p>
            <h2 className="an2-card__title">Spending growth</h2>
            <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 180, padding: "12px 0" }}>
              {SPEND_HISTORY.map((h, i) => {
                const total = h.sub + h.promo + h.fee;
                const pct = (total / max) * 100;
                const isCurrent = i === SPEND_HISTORY.length - 1;
                return (
                  <div key={h.month} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6, height: "100%" }}>
                    <div style={{ flex: 1, width: "100%", display: "flex", flexDirection: "column-reverse" }}>
                      <div style={{ width: "100%", height: `${(h.sub / max) * 100}%`, background: "var(--ink)" }} />
                      <div style={{ width: "100%", height: `${(h.promo / max) * 100}%`, background: isCurrent ? "var(--brand-red)" : "var(--accent-blue)" }} />
                      <div style={{ width: "100%", height: `${(h.fee / max) * 100}%`, background: "var(--mist)", borderRadius: "4px 4px 0 0" }} />
                    </div>
                    <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 11, color: "var(--ink-4)", fontVariantNumeric: "tabular-nums" }}>{fmtUsd(total)}</span>
                    <span style={{ fontFamily: "var(--font-body)", fontSize: 11, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--ink-4)" }}>{h.month}</span>
                  </div>
                );
              })}
            </div>
            <div style={{ display: "flex", gap: 16, fontFamily: "var(--font-body)", fontSize: 11, color: "var(--ink-3)", marginTop: 8, letterSpacing: "0.04em" }}>
              <span><span style={{ display: "inline-block", width: 10, height: 10, background: "var(--ink)", borderRadius: 2, marginRight: 6 }} />Sub</span>
              <span><span style={{ display: "inline-block", width: 10, height: 10, background: "var(--accent-blue)", borderRadius: 2, marginRight: 6 }} />Promo</span>
              <span><span style={{ display: "inline-block", width: 10, height: 10, background: "var(--mist)", borderRadius: 2, marginRight: 6 }} />Fee</span>
              <span style={{ marginLeft: "auto", color: "var(--ink-4)" }}>Brand-red bar = current period</span>
            </div>
          </section>
        </div>

        <p className="an2-div"><span>budget · in · out · accountable.</span></p>
      </div>
    </div>
  );
}
