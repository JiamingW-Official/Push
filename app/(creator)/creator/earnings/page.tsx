"use client";

/**
 * Creator Earnings — v5.1 Customer Acquisition Engine
 *
 * Verified-customer ledger (ConversionOracle™ verdicts) + period selector,
 * breakdown chart, milestone progress, tax info, CSV export.
 *
 * Facts: Tier payouts T1-T3 per-customer ($12/$15/$20),
 * T4-T6 retainer+perf. Milestones: $15 @30txn, $30 @40, $50 @60, $80 @80.
 */

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  MOCK_CREATOR_TRANSACTIONS,
  type Transaction,
} from "@/lib/payments/mock-transactions";

/* ── Types ───────────────────────────────────────────────── */

type Period = "week" | "month" | "ytd" | "all";

type Verdict = "auto_verified" | "manual_review" | "auto_rejected";

type Platform = "Instagram" | "TikTok" | "YouTube" | "Walk-in QR";

type LedgerRow = Transaction & {
  qrId: string;
  verdict: Verdict;
  platform: Platform;
  tier: "T1" | "T2" | "T3" | "T4" | "T5" | "T6";
  ocrConfidence: number; // 0-1
  geoMatch: boolean;
  geoMeters: number;
  ocrText: string;
};

/* ── Derive ledger rows from mock transactions ───────────── */

const VERDICT_BY_STATUS: Record<Transaction["status"], Verdict> = {
  paid: "auto_verified",
  cleared: "auto_verified",
  processing: "manual_review",
  pending: "manual_review",
};

const PLATFORMS: Platform[] = ["Walk-in QR", "Instagram", "TikTok", "YouTube"];
const TIERS: LedgerRow["tier"][] = ["T2", "T3", "T2", "T4", "T3", "T2", "T1"];

const LEDGER: LedgerRow[] = MOCK_CREATOR_TRANSACTIONS.map((tx, i) => ({
  ...tx,
  qrId: `QR-${tx.id.slice(-3).toUpperCase()}-${String(1000 + i).slice(-4)}`,
  verdict:
    i === 7
      ? "auto_rejected"
      : (VERDICT_BY_STATUS[tx.status] ?? "manual_review"),
  platform: PLATFORMS[i % PLATFORMS.length],
  tier: TIERS[i % TIERS.length],
  ocrConfidence: i === 7 ? 0.41 : 0.88 + ((i * 13) % 11) / 100,
  geoMatch: i !== 7,
  geoMeters: i === 7 ? 142 : 8 + (i % 9),
  ocrText:
    i === 7
      ? "Receipt total illegible — partial crop on thermal paper."
      : `Receipt total $${tx.amount.toFixed(2)} · store #${(3201 + i).toString()} · ${tx.merchant.slice(0, 18)}`,
}));

/* ── v5.1 milestone ladder (actual facts) ────────────────── */

const MILESTONES = [
  { threshold: 30, bonus: 15 },
  { threshold: 40, bonus: 30 },
  { threshold: 60, bonus: 50 },
  { threshold: 80, bonus: 80 },
];

/* ── Helpers ─────────────────────────────────────────────── */

function fmt(n: number): string {
  return n.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function fmtDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

function isInPeriod(iso: string, period: Period): boolean {
  const d = new Date(iso);
  const now = new Date("2026-04-18");
  if (period === "week") {
    const diff = (now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24);
    return diff <= 7 && diff >= 0;
  }
  if (period === "month") {
    return (
      d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
    );
  }
  if (period === "ytd") return d.getFullYear() === now.getFullYear();
  return true;
}

const VERDICT_META: Record<Verdict, { label: string; bg: string; fg: string }> =
  {
    auto_verified: {
      label: "Auto-verified",
      bg: "rgba(45,122,45,0.10)",
      fg: "#2d7a2d",
    },
    manual_review: {
      label: "Manual review",
      bg: "rgba(201,169,110,0.18)",
      fg: "#8a6d30",
    },
    auto_rejected: {
      label: "Auto-rejected",
      bg: "rgba(193,18,31,0.08)",
      fg: "#c1121f",
    },
  };

/* ── Page ────────────────────────────────────────────────── */

export default function CreatorEarningsPage() {
  const [period, setPeriod] = useState<Period>("month");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = useMemo(
    () => LEDGER.filter((r) => isInPeriod(r.date, period)),
    [period],
  );

  const total = filtered.reduce((s, r) => s + r.netAmount, 0);
  const verifiedCount = filtered.filter(
    (r) => r.verdict === "auto_verified",
  ).length;

  // YoY mock: prior year same-period = 62% of current
  const priorYear = total * 0.62;
  const yoyDelta = total - priorYear;
  const yoyPct = priorYear > 0 ? (yoyDelta / priorYear) * 100 : 0;

  // Next milestone
  const nextMilestone = MILESTONES.find((m) => verifiedCount < m.threshold);
  const prevThreshold = nextMilestone
    ? [0, ...MILESTONES.map((m) => m.threshold)][
        MILESTONES.findIndex((m) => m.threshold === nextMilestone.threshold)
      ]
    : 0;
  const milestonePct = nextMilestone
    ? Math.min(
        100,
        ((verifiedCount - prevThreshold) /
          (nextMilestone.threshold - prevThreshold)) *
          100,
      )
    : 100;

  // Breakdown: group by tier / campaign / platform
  const byTier = groupSum(
    filtered,
    (r) => r.tier,
    (r) => r.netAmount,
  );
  const byCampaign = groupSum(
    filtered,
    (r) => r.campaign,
    (r) => r.netAmount,
  );
  const byPlatform = groupSum(
    filtered,
    (r) => r.platform,
    (r) => r.netAmount,
  );

  // YTD for 1099 threshold
  const ytdTotal = LEDGER.filter((r) => isInPeriod(r.date, "ytd")).reduce(
    (s, r) => s + r.netAmount,
    0,
  );
  const ytdPct = Math.min(100, (ytdTotal / 600) * 100);

  function exportCsv() {
    const header = [
      "Date",
      "Campaign",
      "Merchant",
      "QR ID",
      "Tier",
      "Platform",
      "Amount",
      "Verdict",
      "Status",
    ];
    const rows = filtered.map((r) => [
      r.date,
      r.campaign.replace(/,/g, ";"),
      r.merchant.replace(/,/g, ";"),
      r.qrId,
      r.tier,
      r.platform,
      r.netAmount.toFixed(2),
      r.verdict,
      r.status,
    ]);
    const csv = [header, ...rows].map((row) => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `push-earnings-${period}-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div style={s.page}>
      <header style={s.nav}>
        <Link href="/creator/dashboard" style={s.navBack}>
          ← Dashboard
        </Link>
        <span style={s.navTitle}>Earnings</span>
        <button style={s.navExport} onClick={exportCsv}>
          Export CSV
        </button>
      </header>

      <main style={s.main}>
        {/* ── Hero ─────────────────────────────────────── */}
        <section style={s.hero}>
          <div style={s.heroEyebrow}>
            Customer Acquisition Engine · ConversionOracle™ ledger
          </div>
          <h1 style={s.heroTitle}>Your earnings.</h1>
          <div style={s.periodRow} role="tablist" aria-label="Period">
            {(
              [
                { k: "week", l: "This week" },
                { k: "month", l: "This month" },
                { k: "ytd", l: "YTD" },
                { k: "all", l: "All time" },
              ] as const
            ).map((p) => (
              <button
                key={p.k}
                role="tab"
                aria-selected={period === p.k}
                onClick={() => setPeriod(p.k)}
                style={{
                  ...s.periodBtn,
                  ...(period === p.k ? s.periodBtnActive : {}),
                }}
              >
                {p.l}
              </button>
            ))}
          </div>
        </section>

        {/* ── Big Total ────────────────────────────────── */}
        <section style={s.totalCard}>
          <div>
            <div style={s.totalLabel}>Total earned</div>
            <div style={s.totalAmount}>${fmt(total)}</div>
            <div style={s.totalMeta}>
              <span style={s.totalBadge}>
                {verifiedCount} verified customers
              </span>
              <span
                style={{
                  ...s.totalBadge,
                  color: yoyDelta >= 0 ? "#2d7a2d" : "#c1121f",
                  background:
                    yoyDelta >= 0
                      ? "rgba(45,122,45,0.10)"
                      : "rgba(193,18,31,0.10)",
                }}
              >
                {yoyDelta >= 0 ? "▲" : "▼"} {yoyPct.toFixed(1)}% YoY
              </span>
            </div>
          </div>
          <div style={s.totalRight}>
            <div style={s.totalSubLabel}>Prior year · same period</div>
            <div style={s.totalSub}>${fmt(priorYear)}</div>
          </div>
        </section>

        {/* ── Breakdown Chart ─────────────────────────── */}
        <section style={s.section}>
          <h2 style={s.h2}>Breakdown</h2>
          <div style={s.breakdownGrid}>
            <BreakdownBar title="Per tier" data={byTier} total={total} />
            <BreakdownBar
              title="Per campaign"
              data={byCampaign}
              total={total}
              truncate
            />
            <BreakdownBar
              title="Per platform"
              data={byPlatform}
              total={total}
            />
          </div>
        </section>

        {/* ── Milestone progress ──────────────────────── */}
        <section style={s.section}>
          <h2 style={s.h2}>Milestone bonus</h2>
          <div style={s.milestoneCard}>
            {nextMilestone ? (
              <>
                <div style={s.mileRow}>
                  <span style={s.mileLabel}>Next bonus</span>
                  <span style={s.mileBonus}>${nextMilestone.bonus}</span>
                </div>
                <div style={s.mileBarWrap}>
                  <div
                    style={{
                      ...s.mileBarFill,
                      width: `${milestonePct}%`,
                    }}
                  />
                </div>
                <div style={s.mileFoot}>
                  <span>
                    {verifiedCount} / {nextMilestone.threshold} verified this
                    month
                  </span>
                  <span>
                    {nextMilestone.threshold - verifiedCount} more to unlock $
                    {nextMilestone.bonus} bonus
                  </span>
                </div>
                <div style={s.mileLadder}>
                  {MILESTONES.map((m) => (
                    <div
                      key={m.threshold}
                      style={{
                        ...s.mileStep,
                        opacity: verifiedCount >= m.threshold ? 1 : 0.5,
                      }}
                    >
                      <div
                        style={{
                          ...s.mileDot,
                          background:
                            verifiedCount >= m.threshold
                              ? "#c1121f"
                              : "rgba(0,48,73,0.15)",
                        }}
                      />
                      <span style={s.mileStepLabel}>
                        {m.threshold} txn → ${m.bonus}
                      </span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div style={s.mileDone}>
                All monthly milestones unlocked. Nice work.
              </div>
            )}
          </div>
        </section>

        {/* ── Verified customers ledger ───────────────── */}
        <section style={s.section}>
          <div style={s.ledgerHead}>
            <h2 style={s.h2}>Verified customers</h2>
            <span style={s.ledgerCount}>
              {filtered.length} row{filtered.length === 1 ? "" : "s"}
            </span>
          </div>
          <div style={s.tableWrap}>
            <div style={s.tableHead}>
              <span style={{ ...s.th, flex: 0.9 }}>Date</span>
              <span style={{ ...s.th, flex: 2.2 }}>Campaign</span>
              <span style={{ ...s.th, flex: 1.4 }}>Merchant</span>
              <span style={{ ...s.th, flex: 1.3 }}>QR ID</span>
              <span style={{ ...s.th, flex: 0.7, textAlign: "right" }}>
                Amount
              </span>
              <span style={{ ...s.th, flex: 1.3 }}>Verdict</span>
              <span style={{ ...s.th, flex: 0.9 }}>Status</span>
            </div>
            {filtered.slice(0, 30).map((row) => (
              <div key={row.id}>
                <div
                  style={s.tableRow}
                  onClick={() =>
                    setExpandedId(expandedId === row.id ? null : row.id)
                  }
                >
                  <span style={{ ...s.td, flex: 0.9 }}>
                    {fmtDate(row.date)}
                  </span>
                  <span style={{ ...s.td, flex: 2.2, color: "#003049" }}>
                    {row.campaign}
                  </span>
                  <span style={{ ...s.td, flex: 1.4 }}>{row.merchant}</span>
                  <span
                    style={{
                      ...s.td,
                      flex: 1.3,
                      fontVariantNumeric: "tabular-nums",
                    }}
                  >
                    {row.qrId}
                  </span>
                  <span
                    style={{
                      ...s.td,
                      flex: 0.7,
                      textAlign: "right",
                      fontFamily: "Darky, sans-serif",
                      fontWeight: 800,
                      color: "#003049",
                    }}
                  >
                    ${fmt(row.netAmount)}
                  </span>
                  <span style={{ ...s.td, flex: 1.3 }}>
                    <span
                      style={{
                        ...s.verdictPill,
                        background: VERDICT_META[row.verdict].bg,
                        color: VERDICT_META[row.verdict].fg,
                      }}
                    >
                      {VERDICT_META[row.verdict].label}
                    </span>
                  </span>
                  <span
                    style={{
                      ...s.td,
                      flex: 0.9,
                      color:
                        row.status === "paid"
                          ? "#003049"
                          : "rgba(0,48,73,0.55)",
                    }}
                  >
                    {row.status}
                  </span>
                </div>
                {expandedId === row.id && (
                  <div style={s.expandPanel}>
                    <div style={s.expandGrid}>
                      <div style={s.expandCol}>
                        <div style={s.expandEyebrow}>
                          Claude Vision OCR trace
                        </div>
                        <div style={s.expandLine}>
                          <span style={s.kvKey}>Confidence</span>
                          <span style={s.kvVal}>
                            {(row.ocrConfidence * 100).toFixed(1)}%
                          </span>
                        </div>
                        <div style={s.expandLine}>
                          <span style={s.kvKey}>Tier</span>
                          <span style={s.kvVal}>{row.tier}</span>
                        </div>
                        <div style={s.expandLine}>
                          <span style={s.kvKey}>Platform</span>
                          <span style={s.kvVal}>{row.platform}</span>
                        </div>
                        <div style={s.ocrText}>{row.ocrText}</div>
                      </div>
                      <div style={s.expandCol}>
                        <div style={s.expandEyebrow}>Geo check</div>
                        <div style={s.expandLine}>
                          <span style={s.kvKey}>Match</span>
                          <span
                            style={{
                              ...s.kvVal,
                              color: row.geoMatch ? "#2d7a2d" : "#c1121f",
                            }}
                          >
                            {row.geoMatch ? "within tolerance" : "outside"}
                          </span>
                        </div>
                        <div style={s.expandLine}>
                          <span style={s.kvKey}>Distance</span>
                          <span style={s.kvVal}>
                            {row.geoMeters}m from store
                          </span>
                        </div>
                        <div style={s.expandLine}>
                          <span style={s.kvKey}>Verdict</span>
                          <span
                            style={{
                              ...s.kvVal,
                              color: VERDICT_META[row.verdict].fg,
                            }}
                          >
                            {VERDICT_META[row.verdict].label}
                          </span>
                        </div>
                        {row.verdict === "manual_review" && (
                          <div style={s.reviewNote}>
                            Queued for human reviewer — SLA 4h business hours.
                          </div>
                        )}
                        {row.verdict === "auto_rejected" && (
                          <div style={s.reviewNoteRed}>
                            You can appeal within 7 days in Disputes.
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* ── Tax widget ──────────────────────────────── */}
        <section style={s.section}>
          <h2 style={s.h2}>Tax</h2>
          <div style={s.taxCard}>
            <div style={s.taxLeft}>
              <div style={s.taxEyebrow}>YTD earnings vs 1099-NEC threshold</div>
              <div style={s.taxRow}>
                <span style={s.taxAmount}>${fmt(ytdTotal)}</span>
                <span style={s.taxThreshold}>of $600.00 threshold</span>
              </div>
              <div style={s.taxBarWrap}>
                <div
                  style={{
                    ...s.taxBarFill,
                    width: `${Math.min(100, ytdPct)}%`,
                    background: ytdPct >= 100 ? "#c1121f" : "#c9a96e",
                  }}
                />
              </div>
              <div style={s.taxNote}>
                {ytdTotal >= 600
                  ? "You will receive a 1099-NEC for this year. Keep your W-9 current."
                  : `$${fmt(600 - ytdTotal)} until a 1099-NEC is issued.`}
              </div>
            </div>
            <div style={s.taxRight}>
              <Link href="/creator/settings" style={s.taxBtn}>
                Upload / edit W-9 →
              </Link>
              <button style={s.taxBtnGhost} onClick={exportCsv}>
                Export earnings CSV
              </button>
            </div>
          </div>
        </section>

        <footer style={s.footer}>
          Powered by Push Customer Acquisition Engine · Vertical AI for Local
          Commerce
        </footer>
      </main>
    </div>
  );
}

/* ── Breakdown bar (inline SVG stacked) ──────────────────── */

function BreakdownBar({
  title,
  data,
  total,
  truncate,
}: {
  title: string;
  data: Array<{ key: string; value: number }>;
  total: number;
  truncate?: boolean;
}) {
  const palette = [
    "#c1121f",
    "#003049",
    "#669bbc",
    "#c9a96e",
    "#780000",
    "#4a5d80",
  ];
  const W = 320;
  const H = 18;
  const sorted = [...data].sort((a, b) => b.value - a.value);
  let cursor = 0;

  return (
    <div style={s.bdCard}>
      <div style={s.bdTitle}>{title}</div>
      <svg
        width="100%"
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="none"
        style={{ display: "block", height: 18, marginBottom: 14 }}
      >
        {sorted.map((d, i) => {
          const w = total > 0 ? (d.value / total) * W : 0;
          const x = cursor;
          cursor += w;
          return (
            <rect
              key={d.key}
              x={x}
              y={0}
              width={Math.max(0, w)}
              height={H}
              fill={palette[i % palette.length]}
            />
          );
        })}
      </svg>
      <div style={s.bdLegend}>
        {sorted.slice(0, 5).map((d, i) => {
          const pct = total > 0 ? (d.value / total) * 100 : 0;
          const label =
            truncate && d.key.length > 22 ? d.key.slice(0, 22) + "…" : d.key;
          return (
            <div key={d.key} style={s.bdRow}>
              <span
                style={{
                  ...s.bdDot,
                  background: palette[i % palette.length],
                }}
              />
              <span style={s.bdKey}>{label}</span>
              <span style={s.bdVal}>${fmt(d.value)}</span>
              <span style={s.bdPct}>{pct.toFixed(0)}%</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ── utils ───────────────────────────────────────────────── */

function groupSum<T>(
  rows: T[],
  keyFn: (r: T) => string,
  valFn: (r: T) => number,
): Array<{ key: string; value: number }> {
  const map = new Map<string, number>();
  rows.forEach((r) => {
    const k = keyFn(r);
    map.set(k, (map.get(k) ?? 0) + valFn(r));
  });
  return Array.from(map.entries()).map(([key, value]) => ({ key, value }));
}

/* ── styles ──────────────────────────────────────────────── */

const s: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    background: "#f5f2ec",
    fontFamily: "'CS Genio Mono', 'SF Mono', monospace",
    color: "#003049",
  },
  nav: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "16px 32px",
    borderBottom: "1px solid rgba(0,48,73,0.12)",
    background: "#ffffff",
    position: "sticky",
    top: 0,
    zIndex: 50,
  },
  navBack: {
    fontFamily: "'CS Genio Mono', monospace",
    fontSize: 13,
    color: "#003049",
    textDecoration: "none",
    letterSpacing: "0.01em",
    minWidth: 100,
  },
  navTitle: {
    fontFamily: "Darky, sans-serif",
    fontSize: 20,
    fontWeight: 700,
    color: "#003049",
    letterSpacing: "-0.02em",
  },
  navExport: {
    fontFamily: "'CS Genio Mono', monospace",
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: "0.06em",
    textTransform: "uppercase",
    background: "transparent",
    color: "#003049",
    border: "1px solid rgba(0,48,73,0.20)",
    padding: "8px 14px",
    cursor: "pointer",
    borderRadius: 0,
    minWidth: 100,
  },
  main: {
    maxWidth: 1080,
    margin: "0 auto",
    padding: "0 24px 80px",
  },
  hero: {
    padding: "56px 0 24px",
  },
  heroEyebrow: {
    fontFamily: "'CS Genio Mono', monospace",
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    color: "rgba(0,48,73,0.55)",
    marginBottom: 16,
  },
  heroTitle: {
    fontFamily: "Darky, sans-serif",
    fontSize: "clamp(56px, 9vw, 104px)",
    fontWeight: 900,
    color: "#003049",
    letterSpacing: "-0.05em",
    lineHeight: 0.95,
    margin: "0 0 24px",
  },
  periodRow: {
    display: "flex",
    gap: 0,
    borderBottom: "1px solid rgba(0,48,73,0.12)",
  },
  periodBtn: {
    fontFamily: "'CS Genio Mono', monospace",
    fontSize: 12,
    fontWeight: 600,
    letterSpacing: "0.04em",
    textTransform: "uppercase",
    background: "transparent",
    color: "rgba(0,48,73,0.55)",
    border: "none",
    borderBottom: "2px solid transparent",
    padding: "14px 18px",
    cursor: "pointer",
    borderRadius: 0,
    marginBottom: -1,
  },
  periodBtnActive: {
    color: "#003049",
    borderBottom: "2px solid #c1121f",
  },
  totalCard: {
    marginTop: 32,
    padding: "40px 36px",
    background: "#003049",
    display: "flex",
    alignItems: "flex-end",
    justifyContent: "space-between",
    gap: 32,
    flexWrap: "wrap",
  },
  totalLabel: {
    fontFamily: "'CS Genio Mono', monospace",
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    color: "rgba(201,169,110,0.80)",
    marginBottom: 10,
  },
  totalAmount: {
    fontFamily: "Darky, sans-serif",
    fontSize: "clamp(56px, 8vw, 96px)",
    fontWeight: 900,
    color: "#c9a96e",
    letterSpacing: "-0.05em",
    lineHeight: 1,
    marginBottom: 14,
  },
  totalMeta: {
    display: "flex",
    gap: 10,
    flexWrap: "wrap",
  },
  totalBadge: {
    fontFamily: "'CS Genio Mono', monospace",
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: "0.04em",
    textTransform: "uppercase",
    padding: "5px 10px",
    background: "rgba(245,242,236,0.12)",
    color: "#f5f2ec",
  },
  totalRight: {
    textAlign: "right",
  },
  totalSubLabel: {
    fontFamily: "'CS Genio Mono', monospace",
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    color: "rgba(245,242,236,0.55)",
    marginBottom: 6,
  },
  totalSub: {
    fontFamily: "Darky, sans-serif",
    fontSize: 32,
    fontWeight: 800,
    color: "#f5f2ec",
    letterSpacing: "-0.03em",
  },
  section: {
    paddingTop: 56,
  },
  h2: {
    fontFamily: "Darky, sans-serif",
    fontSize: 28,
    fontWeight: 800,
    color: "#003049",
    letterSpacing: "-0.03em",
    margin: "0 0 20px",
  },
  breakdownGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
    gap: 0,
    border: "1px solid rgba(0,48,73,0.12)",
  },
  bdCard: {
    padding: "24px",
    background: "#ffffff",
    borderRight: "1px solid rgba(0,48,73,0.12)",
  },
  bdTitle: {
    fontFamily: "'CS Genio Mono', monospace",
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    color: "rgba(0,48,73,0.55)",
    marginBottom: 14,
  },
  bdLegend: {
    display: "flex",
    flexDirection: "column",
    gap: 7,
  },
  bdRow: {
    display: "grid",
    gridTemplateColumns: "10px 1fr auto 44px",
    gap: 10,
    alignItems: "center",
    fontFamily: "'CS Genio Mono', monospace",
    fontSize: 12,
  },
  bdDot: {
    width: 10,
    height: 10,
  },
  bdKey: {
    color: "#003049",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  bdVal: {
    color: "#003049",
    fontWeight: 700,
    fontVariantNumeric: "tabular-nums",
  },
  bdPct: {
    color: "rgba(0,48,73,0.55)",
    textAlign: "right",
    fontVariantNumeric: "tabular-nums",
  },
  milestoneCard: {
    padding: "28px 32px",
    background: "#ffffff",
    border: "1px solid rgba(0,48,73,0.12)",
  },
  mileRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "baseline",
    marginBottom: 12,
  },
  mileLabel: {
    fontFamily: "'CS Genio Mono', monospace",
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    color: "rgba(0,48,73,0.55)",
  },
  mileBonus: {
    fontFamily: "Darky, sans-serif",
    fontSize: 36,
    fontWeight: 900,
    color: "#c1121f",
    letterSpacing: "-0.03em",
  },
  mileBarWrap: {
    width: "100%",
    height: 10,
    background: "rgba(0,48,73,0.08)",
    marginBottom: 10,
    position: "relative",
    overflow: "hidden",
  },
  mileBarFill: {
    height: "100%",
    background: "#c1121f",
    transition: "width 400ms ease",
  },
  mileFoot: {
    display: "flex",
    justifyContent: "space-between",
    fontFamily: "'CS Genio Mono', monospace",
    fontSize: 12,
    color: "rgba(0,48,73,0.65)",
    marginBottom: 20,
  },
  mileLadder: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: 12,
    paddingTop: 16,
    borderTop: "1px solid rgba(0,48,73,0.08)",
  },
  mileStep: {
    display: "flex",
    alignItems: "center",
    gap: 8,
  },
  mileDot: {
    width: 10,
    height: 10,
    flexShrink: 0,
  },
  mileStepLabel: {
    fontFamily: "'CS Genio Mono', monospace",
    fontSize: 11,
    fontWeight: 600,
    color: "#003049",
    letterSpacing: "0.02em",
  },
  mileDone: {
    fontFamily: "Darky, sans-serif",
    fontSize: 18,
    fontWeight: 700,
    color: "#2d7a2d",
    textAlign: "center",
    padding: "12px 0",
  },
  ledgerHead: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "baseline",
    marginBottom: 20,
  },
  ledgerCount: {
    fontFamily: "'CS Genio Mono', monospace",
    fontSize: 12,
    color: "rgba(0,48,73,0.55)",
  },
  tableWrap: {
    border: "1px solid rgba(0,48,73,0.12)",
    background: "#ffffff",
    overflow: "hidden",
  },
  tableHead: {
    display: "flex",
    alignItems: "center",
    padding: "12px 20px",
    borderBottom: "1px solid rgba(0,48,73,0.12)",
    background: "rgba(0,48,73,0.03)",
    gap: 12,
  },
  th: {
    fontFamily: "'CS Genio Mono', monospace",
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: "0.06em",
    textTransform: "uppercase",
    color: "rgba(0,48,73,0.55)",
  },
  tableRow: {
    display: "flex",
    alignItems: "center",
    padding: "14px 20px",
    borderBottom: "1px solid rgba(0,48,73,0.06)",
    cursor: "pointer",
    gap: 12,
    transition: "background 120ms ease",
  },
  td: {
    fontFamily: "'CS Genio Mono', monospace",
    fontSize: 12,
    color: "rgba(0,48,73,0.70)",
    textTransform: "none",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  verdictPill: {
    display: "inline-block",
    fontFamily: "'CS Genio Mono', monospace",
    fontSize: 10,
    fontWeight: 700,
    letterSpacing: "0.05em",
    textTransform: "uppercase",
    padding: "4px 9px",
  },
  expandPanel: {
    background: "rgba(0,48,73,0.03)",
    padding: "20px 24px 24px",
    borderBottom: "1px solid rgba(0,48,73,0.06)",
  },
  expandGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 24,
  },
  expandCol: {
    display: "flex",
    flexDirection: "column",
    gap: 8,
  },
  expandEyebrow: {
    fontFamily: "'CS Genio Mono', monospace",
    fontSize: 10,
    fontWeight: 700,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    color: "rgba(0,48,73,0.55)",
    marginBottom: 4,
  },
  expandLine: {
    display: "flex",
    justifyContent: "space-between",
    fontFamily: "'CS Genio Mono', monospace",
    fontSize: 12,
  },
  kvKey: {
    color: "rgba(0,48,73,0.55)",
  },
  kvVal: {
    color: "#003049",
    fontWeight: 600,
  },
  ocrText: {
    marginTop: 6,
    padding: "10px 12px",
    background: "#ffffff",
    border: "1px solid rgba(0,48,73,0.10)",
    fontFamily: "'CS Genio Mono', monospace",
    fontSize: 11,
    color: "#003049",
    lineHeight: 1.5,
  },
  reviewNote: {
    marginTop: 8,
    padding: "8px 10px",
    background: "rgba(201,169,110,0.12)",
    fontFamily: "'CS Genio Mono', monospace",
    fontSize: 11,
    color: "#8a6d30",
  },
  reviewNoteRed: {
    marginTop: 8,
    padding: "8px 10px",
    background: "rgba(193,18,31,0.06)",
    fontFamily: "'CS Genio Mono', monospace",
    fontSize: 11,
    color: "#c1121f",
  },
  taxCard: {
    padding: "28px 32px",
    background: "#ffffff",
    border: "1px solid rgba(0,48,73,0.12)",
    display: "grid",
    gridTemplateColumns: "2fr 1fr",
    gap: 32,
    alignItems: "center",
  },
  taxLeft: {},
  taxEyebrow: {
    fontFamily: "'CS Genio Mono', monospace",
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    color: "rgba(0,48,73,0.55)",
    marginBottom: 10,
  },
  taxRow: {
    display: "flex",
    alignItems: "baseline",
    gap: 12,
    marginBottom: 14,
  },
  taxAmount: {
    fontFamily: "Darky, sans-serif",
    fontSize: 40,
    fontWeight: 900,
    color: "#003049",
    letterSpacing: "-0.04em",
  },
  taxThreshold: {
    fontFamily: "'CS Genio Mono', monospace",
    fontSize: 13,
    color: "rgba(0,48,73,0.55)",
  },
  taxBarWrap: {
    width: "100%",
    height: 8,
    background: "rgba(0,48,73,0.08)",
    marginBottom: 10,
  },
  taxBarFill: {
    height: "100%",
    transition: "width 400ms ease",
  },
  taxNote: {
    fontFamily: "'CS Genio Mono', monospace",
    fontSize: 12,
    color: "rgba(0,48,73,0.65)",
  },
  taxRight: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },
  taxBtn: {
    fontFamily: "'CS Genio Mono', monospace",
    fontSize: 12,
    fontWeight: 700,
    letterSpacing: "0.04em",
    textTransform: "uppercase",
    background: "#c1121f",
    color: "#ffffff",
    border: "none",
    padding: "14px 18px",
    cursor: "pointer",
    textDecoration: "none",
    textAlign: "center",
    borderRadius: 0,
  },
  taxBtnGhost: {
    fontFamily: "'CS Genio Mono', monospace",
    fontSize: 12,
    fontWeight: 700,
    letterSpacing: "0.04em",
    textTransform: "uppercase",
    background: "transparent",
    color: "#003049",
    border: "1px solid rgba(0,48,73,0.20)",
    padding: "14px 18px",
    cursor: "pointer",
    borderRadius: 0,
  },
  footer: {
    marginTop: 64,
    paddingTop: 24,
    borderTop: "1px solid rgba(0,48,73,0.08)",
    fontFamily: "'CS Genio Mono', monospace",
    fontSize: 11,
    color: "rgba(0,48,73,0.40)",
    letterSpacing: "0.04em",
    textAlign: "center",
  },
};
