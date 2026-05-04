"use client";

/**
 * Push Admin — Finance Ledger Panel
 * /admin/finance
 *
 * Sections:
 *   1. Hero — title + 3 big MTD stats
 *   2. Live ledger stream (latest 50 entries, auto-refreshes)
 *   3. Filters bar
 *   4. Ledger table (paginated)
 *   5. Reconciliation panel
 *   6. Stripe balance panel
 *   7. Monthly P&L SVG chart
 *   8. Payouts scheduler
 *   9. Manual actions (refund / force payout / adjust / export)
 */

import { useState, useEffect, useCallback, useRef } from "react";
import type {
  LedgerEntry,
  TransactionType,
  TransactionStatus,
} from "@/lib/admin/mock-ledger";
import "./finance.css";

// ── Types returned from the API ───────────────────────────────────────────────

type MTD = { gmv: number; payouts: number; platformFees: number };

type MonthlyBar = {
  label: string;
  revenue: number;
  payouts: number;
  net: number;
};

type StripeBalance = {
  available: number;
  pending: number;
  reserved: number;
  currency: string;
};

type Reconciliation = {
  expectedBalance: number;
  actualBankBalance: number;
  discrepancy: number;
  lastReconciled: string;
  status: "ok" | "minor_discrepancy" | "major_discrepancy";
};

type NextPayout = {
  scheduledAt: string;
  creatorCount: number;
  estimatedTotal: number;
};

type ApiMeta = {
  mtd: MTD;
  monthlyPnL: MonthlyBar[];
  stripeBalance: StripeBalance;
  reconciliation: Reconciliation;
  nextPayout: NextPayout;
};

type Pagination = {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
};

// ── Helpers ───────────────────────────────────────────────────────────────────

function fmt(n: number, decimals = 0): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(Math.abs(n));
}

function fmtTs(iso: string): string {
  return new Date(iso).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function fmtDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function countdown(target: string): string {
  const diff = new Date(target).getTime() - Date.now();
  if (diff <= 0) return "Now";
  const h = Math.floor(diff / 3_600_000);
  const m = Math.floor((diff % 3_600_000) / 60_000);
  if (h >= 48) return `${Math.floor(h / 24)}d`;
  return `${h}h ${m}m`;
}

// ── Shared badge base ─────────────────────────────────────────────────────────

const badgeBase: React.CSSProperties = {
  display: "inline-block",
  padding: "2px 8px",
  borderRadius: 6,
  fontSize: 12,
  fontWeight: 600,
  letterSpacing: "0.06em",
  fontFamily: "var(--font-mono, var(--font-body))",
  textTransform: "uppercase",
};

// ── Sub-components ────────────────────────────────────────────────────────────

function TypeBadge({ type }: { type: TransactionType }) {
  const labels: Record<TransactionType, string> = {
    subscription: "Sub",
    payout: "Payout",
    refund: "Refund",
    platform_fee: "Fee",
    adjustment: "Adj",
  };
  // §3 — color-coded type badges per v11 spec
  const colors: Record<TransactionType, { bg: string; color: string }> = {
    subscription: {
      bg: "rgba(34,197,94,0.1)",
      color: "#22c55e",
    },
    payout: {
      bg: "var(--accent-blue-tint, rgba(0,133,255,0.1))",
      color: "var(--accent-blue)",
    },
    refund: {
      bg: "rgba(193,18,31,0.08)",
      color: "var(--brand-red)",
    },
    platform_fee: {
      bg: "var(--champagne-tint, rgba(191,161,112,0.12))",
      color: "var(--champagne-deep, #8a6a2e)",
    },
    adjustment: {
      bg: "var(--champagne-tint, rgba(191,161,112,0.12))",
      color: "var(--champagne-deep, #8a6a2e)",
    },
  };
  const c = colors[type];
  return (
    <span style={{ ...badgeBase, background: c.bg, color: c.color }}>
      {labels[type]}
    </span>
  );
}

function StatusBadge({ status }: { status: TransactionStatus }) {
  const map: Record<TransactionStatus, { bg: string; color: string }> = {
    completed: { bg: "var(--accent-blue-tint)", color: "var(--accent-blue)" },
    pending: { bg: "var(--panel-butter)", color: "var(--ink-3)" },
    processing: { bg: "var(--panel-butter)", color: "var(--ink-3)" },
    failed: { bg: "var(--brand-red-tint)", color: "var(--brand-red)" },
    reversed: { bg: "var(--surface-3)", color: "var(--ink-4)" },
  };
  const c = map[status] ?? { bg: "var(--surface-3)", color: "var(--ink-4)" };
  return (
    <span
      style={{
        ...badgeBase,
        background: c.bg,
        color: c.color,
        textTransform: "capitalize",
      }}
    >
      {status}
    </span>
  );
}

// ── Monthly P&L SVG Chart ─────────────────────────────────────────────────────

function PnLChart({ data }: { data: MonthlyBar[] }) {
  if (!data.length) return null;

  const W = 600;
  const H = 120;
  const PAD = { top: 8, right: 4, bottom: 24, left: 4 };
  const innerW = W - PAD.left - PAD.right;
  const innerH = H - PAD.top - PAD.bottom;

  const maxRevenue = Math.max(...data.map((d) => d.revenue));
  const maxPayout = Math.max(...data.map((d) => d.payouts));
  const maxVal = Math.max(maxRevenue, maxPayout, 1);

  const barGroupW = innerW / data.length;
  const barW = Math.max(4, barGroupW * 0.35);
  const gap = barW * 0.3;

  return (
    <div style={{ marginTop: 16 }}>
      <div style={{ width: "100%", overflowX: "auto" }}>
        <svg
          viewBox={`0 0 ${W} ${H}`}
          preserveAspectRatio="none"
          style={{ width: "100%", height: H, display: "block" }}
        >
          {data.map((d, i) => {
            const x = PAD.left + i * barGroupW + barGroupW / 2;
            const revH = (d.revenue / maxVal) * innerH;
            const payH = (d.payouts / maxVal) * innerH;

            return (
              <g key={d.label}>
                {/* Revenue bar */}
                <rect
                  x={x - barW - gap / 2}
                  y={PAD.top + innerH - revH}
                  width={barW}
                  height={revH}
                  fill="var(--accent-blue)"
                  opacity={0.7}
                >
                  <title>
                    {d.label} Revenue: {fmt(d.revenue)}
                  </title>
                </rect>
                {/* Payout bar */}
                <rect
                  x={x + gap / 2}
                  y={PAD.top + innerH - payH}
                  width={barW}
                  height={payH}
                  fill="var(--brand-red)"
                  opacity={0.6}
                >
                  <title>
                    {d.label} Payouts: {fmt(d.payouts)}
                  </title>
                </rect>
                {/* Label */}
                <text
                  x={x}
                  y={H - 4}
                  textAnchor="middle"
                  fontSize={8}
                  fill="var(--ink-4)"
                  fontFamily="var(--font-body)"
                >
                  {d.label.split(" ")[0]}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
      <div style={{ display: "flex", gap: 16, marginTop: 8 }}>
        <span
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            fontSize: 11,
            fontFamily: "var(--font-body)",
            color: "var(--ink-3)",
          }}
        >
          <span
            style={{
              width: 10,
              height: 10,
              borderRadius: 2,
              background: "var(--accent-blue)",
              display: "inline-block",
            }}
          />
          Revenue
        </span>
        <span
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            fontSize: 11,
            fontFamily: "var(--font-body)",
            color: "var(--ink-3)",
          }}
        >
          <span
            style={{
              width: 10,
              height: 10,
              borderRadius: 2,
              background: "var(--brand-red)",
              display: "inline-block",
            }}
          />
          Payouts
        </span>
      </div>
    </div>
  );
}

// ── Modal for manual actions ──────────────────────────────────────────────────

type ModalAction = "refund" | "payout" | "adjust" | null;

function ActionModal({
  action,
  onClose,
  onConfirm,
}: {
  action: ModalAction;
  onClose: () => void;
  onConfirm: (data: Record<string, string>) => void;
}) {
  const [fields, setFields] = useState<Record<string, string>>({});

  if (!action) return null;

  const configs: Record<
    string,
    {
      title: string;
      note?: string;
      fields: {
        key: string;
        label: string;
        type?: string;
        required?: boolean;
      }[];
    }
  > = {
    refund: {
      title: "Issue Refund",
      note: "Refunds are processed immediately via Stripe. This action is irreversible.",
      fields: [
        { key: "merchant", label: "Merchant name", required: true },
        {
          key: "amount",
          label: "Amount (USD)",
          type: "number",
          required: true,
        },
        { key: "stripe_ref", label: "Stripe charge ref", required: true },
        { key: "reason", label: "Reason" },
      ],
    },
    payout: {
      title: "Force Payout",
      note: "Bypasses the scheduled batch and sends immediately to the creator's bank.",
      fields: [
        { key: "creator", label: "Creator handle", required: true },
        {
          key: "amount",
          label: "Amount (USD)",
          type: "number",
          required: true,
        },
        { key: "campaign", label: "Campaign ID" },
        { key: "reason", label: "Reason", required: true },
      ],
    },
    adjust: {
      title: "Adjust Balance",
      note: "Admin note required. All adjustments are logged and auditable.",
      fields: [
        {
          key: "amount",
          label: "Adjustment (+ credit / - debit, USD)",
          type: "number",
          required: true,
        },
        { key: "counterparty", label: "Counterparty", required: true },
        { key: "note", label: "Admin note (required)", required: true },
      ],
    },
  };

  const cfg = configs[action];

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "10px 12px",
    border: "1px solid var(--hairline)",
    borderRadius: 8,
    background: "var(--surface)",
    color: "var(--ink)",
    fontFamily: "var(--font-body)",
    fontSize: 14,
    outline: "none",
    boxSizing: "border-box",
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.4)",
        zIndex: 200,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        style={{
          background: "var(--surface-2)",
          border: "1px solid var(--hairline)",
          borderRadius: 10,
          padding: "32px",
          width: "min(480px, 90vw)",
          maxHeight: "90vh",
          overflowY: "auto",
        }}
      >
        <div
          style={{
            fontFamily: "var(--font-display)",
            fontSize: 20,
            fontWeight: 700,
            color: "var(--ink)",
            marginBottom: 8,
          }}
        >
          {cfg.title}
        </div>

        {cfg.note && (
          <div
            style={{
              padding: "10px 14px",
              background: "var(--brand-red-tint)",
              border: "1px solid rgba(193,18,31,0.2)",
              borderRadius: 6,
              fontSize: 13,
              fontFamily: "var(--font-body)",
              color: "var(--brand-red)",
              marginBottom: 20,
            }}
          >
            {cfg.note}
          </div>
        )}

        {cfg.fields.map((f) => (
          <div key={f.key} style={{ marginBottom: 16 }}>
            <label
              style={{
                display: "block",
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: "0.12em",
                fontFamily: "var(--font-body)",
                color: "var(--ink-4)",
                marginBottom: 6,
                textTransform: "uppercase",
              }}
            >
              {f.label}
              {f.required && " *"}
            </label>
            {f.key === "note" || f.key === "reason" ? (
              <textarea
                rows={3}
                value={fields[f.key] ?? ""}
                onChange={(e) =>
                  setFields((prev) => ({ ...prev, [f.key]: e.target.value }))
                }
                placeholder={`Enter ${f.label.toLowerCase()}...`}
                style={{ ...inputStyle, resize: "vertical" }}
              />
            ) : (
              <input
                type={f.type ?? "text"}
                value={fields[f.key] ?? ""}
                onChange={(e) =>
                  setFields((prev) => ({ ...prev, [f.key]: e.target.value }))
                }
                placeholder={`Enter ${f.label.toLowerCase()}...`}
                style={inputStyle}
              />
            )}
          </div>
        ))}

        <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
          <button
            className="adm-row-btn adm-row-btn--ghost click-shift"
            onClick={onClose}
            style={{ flex: 1 }}
          >
            Cancel
          </button>
          <button
            className="adm-row-btn adm-row-btn--view click-shift"
            onClick={() => onConfirm(fields)}
            style={{ flex: 1 }}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Filter label style (shared) ───────────────────────────────────────────────

const filterLabelStyle: React.CSSProperties = {
  fontSize: 11,
  fontWeight: 700,
  letterSpacing: "0.12em",
  fontFamily: "var(--font-body)",
  color: "var(--ink-5)",
  textTransform: "uppercase",
};

// ── Main page ─────────────────────────────────────────────────────────────────

export default function FinancePage() {
  // Data state
  const [entries, setEntries] = useState<LedgerEntry[]>([]);
  const [meta, setMeta] = useState<ApiMeta | null>(null);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    pageSize: 50,
    total: 0,
    totalPages: 1,
  });
  const [loading, setLoading] = useState(true);

  // Filter state
  const [typeFilter, setTypeFilter] = useState<TransactionType | "">("");
  const [statusFilter, setStatusFilter] = useState<TransactionStatus | "">("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [amountMin, setAmountMin] = useState("");
  const [amountMax, setAmountMax] = useState("");
  const [search, setSearch] = useState("");

  // Live stream state (latest 50)
  const [streamEntries, setStreamEntries] = useState<LedgerEntry[]>([]);

  // Modal / toast
  const [modalAction, setModalAction] = useState<ModalAction>(null);
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout>>(null);

  const showToast = useCallback((msg: string, ok = true) => {
    setToast({ msg, ok });
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 3500);
  }, []);

  // ── Fetch ledger ──────────────────────────────────────────────────────────
  const fetchLedger = useCallback(
    async (page = 1, applyFilters = false) => {
      setLoading(true);
      try {
        const params = new URLSearchParams({
          page: String(page),
          pageSize: "50",
        });
        if (applyFilters) {
          if (typeFilter) params.set("type", typeFilter);
          if (statusFilter) params.set("status", statusFilter);
          if (fromDate) params.set("from", fromDate);
          if (toDate) params.set("to", toDate);
          if (amountMin) params.set("amountMin", amountMin);
          if (amountMax) params.set("amountMax", amountMax);
          if (search) params.set("search", search);
        }

        const res = await fetch(`/api/admin/finance/ledger?${params}`);
        if (!res.ok) throw new Error("API error");

        const json = await res.json();
        setEntries(json.data);
        setPagination(json.pagination);
        if (json.meta) setMeta(json.meta);

        // Stream = first 50 of unfiltered fetch
        if (!applyFilters || page === 1) {
          setStreamEntries(json.data.slice(0, 50));
        }
      } catch {
        showToast("Failed to load ledger data", false);
      } finally {
        setLoading(false);
      }
    },
    [
      typeFilter,
      statusFilter,
      fromDate,
      toDate,
      amountMin,
      amountMax,
      search,
      showToast,
    ],
  );

  useEffect(() => {
    fetchLedger(1, false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Handlers ──────────────────────────────────────────────────────────────
  function applyFilters() {
    fetchLedger(1, true);
  }

  function resetFilters() {
    setTypeFilter("");
    setStatusFilter("");
    setFromDate("");
    setToDate("");
    setAmountMin("");
    setAmountMax("");
    setSearch("");
    fetchLedger(1, false);
  }

  function handleModalConfirm(data: Record<string, string>) {
    setModalAction(null);
    const labels: Record<string, string> = {
      refund: "Refund issued",
      payout: "Force payout initiated",
      adjust: "Balance adjusted",
    };
    showToast(
      `${labels[modalAction!] ?? "Action"} — stub (no real API in demo)`,
    );
  }

  function exportCSV() {
    const header = [
      "timestamp",
      "type",
      "counterparty",
      "amount",
      "status",
      "stripe_ref",
      "note",
    ].join(",");

    const rows = entries.map((e) =>
      [
        e.timestamp,
        e.type,
        `"${e.counterparty}"`,
        e.amount,
        e.status,
        e.stripe_ref,
        `"${e.note ?? ""}"`,
      ].join(","),
    );

    const csv = [header, ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `push-ledger-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    showToast("CSV exported");
  }

  function exportOFX() {
    // OFX stub — real implementation would build a proper OFX XML doc
    showToast("QuickBooks OFX export — stub (real API required)", true);
  }

  // ── Render ────────────────────────────────────────────────────────────────

  const mtd = meta?.mtd;
  const recon = meta?.reconciliation;
  const stripe = meta?.stripeBalance;
  const pnl = meta?.monthlyPnL ?? [];
  const nextPayout = meta?.nextPayout;

  // Shared card style
  const cardStyle: React.CSSProperties = {
    background: "var(--surface-2)",
    border: "1px solid var(--hairline)",
    borderRadius: 10,
    padding: "20px 24px",
  };

  const selectStyle: React.CSSProperties = {
    height: 40,
    padding: "0 12px",
    border: "1px solid var(--hairline)",
    borderRadius: 8,
    background: "var(--surface)",
    color: "var(--ink)",
    fontFamily: "var(--font-body)",
    fontSize: 13,
    outline: "none",
  };

  const inputStyle: React.CSSProperties = {
    height: 40,
    padding: "0 12px",
    border: "1px solid var(--hairline)",
    borderRadius: 8,
    background: "var(--surface)",
    color: "var(--ink)",
    fontFamily: "var(--font-body)",
    fontSize: 13,
    outline: "none",
  };

  return (
    <div className="adm-content" style={{ minHeight: "100vh" }}>
      {/* ── Page header ── */}
      {/* §10 — Page eyebrow: (FINANCE·LEDGER) mono 12px above H1 */}
      <div className="adm-page-header">
        <div className="adm-page-eyebrow fin-eyebrow-override">
          (FINANCE·LEDGER)
        </div>
        <h1 className="adm-page-title">Finance</h1>
      </div>

      {/* ── MTD KPI strip ── */}
      <div className="adm-kpi-grid" style={{ marginBottom: 40 }}>
        {[
          {
            label: "MTD GMV",
            value: mtd ? fmt(mtd.gmv) : "—",
            sub: "Subscription revenue, Apr 2026",
            alert: false,
          },
          {
            label: "MTD Payouts",
            value: mtd ? fmt(mtd.payouts) : "—",
            sub: "Disbursed to creators",
            alert: true,
          },
          {
            label: "Platform Fee Revenue",
            value: mtd ? fmt(mtd.platformFees, 2) : "—",
            sub: "Net platform take, MTD",
            alert: false,
          },
        ].map(({ label, value, sub, alert }) => (
          <div
            key={label}
            className={`adm-kpi-card${alert ? " adm-kpi-card--alert" : ""}`}
          >
            <div className="adm-kpi-card__eyebrow">{label}</div>
            <div className="adm-kpi-card__value">{value}</div>
            <div className="adm-kpi-card__sub">{sub}</div>
          </div>
        ))}
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 32,
        }}
      >
        {/* ── Live Ledger Stream ── */}
        <div style={cardStyle}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              marginBottom: 16,
            }}
          >
            {/* Live dot — accent-blue, no glow */}
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: "var(--accent-blue)",
                flexShrink: 0,
              }}
            />
            <div
              style={{
                fontFamily: "var(--font-display)",
                fontSize: 18,
                fontWeight: 700,
                color: "var(--ink)",
              }}
            >
              Live Stream
            </div>
            <div
              style={{
                fontSize: 12,
                fontFamily: "var(--font-body)",
                color: "var(--ink-5)",
              }}
            >
              Latest {streamEntries.length} transactions
            </div>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 0,
              maxHeight: 280,
              overflowY: "auto",
            }}
          >
            {streamEntries.length === 0 && (
              <div
                style={{
                  fontSize: 13,
                  fontFamily: "var(--font-body)",
                  color: "var(--ink-5)",
                  padding: "16px 0",
                }}
              >
                Loading stream...
              </div>
            )}
            {streamEntries.map((e) => (
              <div
                key={e.id}
                style={{
                  display: "grid",
                  gridTemplateColumns: "120px 1fr 80px auto",
                  gap: 12,
                  alignItems: "center",
                  padding: "8px 0",
                  borderBottom: "1px solid var(--hairline)",
                  fontSize: 13,
                  fontFamily: "var(--font-body)",
                }}
              >
                <span style={{ color: "var(--ink-5)", fontSize: 11 }}>
                  {fmtTs(e.timestamp)}
                </span>
                <span style={{ color: "var(--ink)", fontWeight: 500 }}>
                  {e.counterparty}
                </span>
                <TypeBadge type={e.type} />
                <span
                  style={{
                    fontWeight: 700,
                    fontFamily: "var(--font-body)",
                    color:
                      e.amount > 0 ? "var(--accent-blue)" : "var(--brand-red)",
                    textAlign: "right",
                  }}
                >
                  {e.amount > 0 ? "+" : "−"}
                  {fmt(e.amount, 2)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Filters + Ledger Table ── */}
        <div style={cardStyle}>
          <div style={{ marginBottom: 16 }}>
            <div
              style={{
                fontFamily: "var(--font-display)",
                fontSize: 18,
                fontWeight: 700,
                color: "var(--ink)",
                marginBottom: 4,
              }}
            >
              Ledger
            </div>
            <div
              style={{
                fontSize: 12,
                fontFamily: "var(--font-body)",
                color: "var(--ink-5)",
              }}
            >
              {pagination.total} entries
            </div>
          </div>

          {/* Filters */}
          <div className="adm-filter-bar" style={{ marginBottom: 20 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <label style={filterLabelStyle}>Type</label>
              <select
                style={selectStyle}
                value={typeFilter}
                onChange={(e) =>
                  setTypeFilter(e.target.value as TransactionType | "")
                }
              >
                <option value="">All types</option>
                <option value="subscription">Subscription</option>
                <option value="payout">Payout</option>
                <option value="refund">Refund</option>
                <option value="platform_fee">Platform fee</option>
                <option value="adjustment">Adjustment</option>
              </select>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <label style={filterLabelStyle}>Status</label>
              <select
                style={selectStyle}
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(e.target.value as TransactionStatus | "")
                }
              >
                <option value="">All statuses</option>
                <option value="completed">Completed</option>
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="failed">Failed</option>
                <option value="reversed">Reversed</option>
              </select>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <label style={filterLabelStyle}>From</label>
              <input
                type="date"
                style={inputStyle}
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
              />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <label style={filterLabelStyle}>To</label>
              <input
                type="date"
                style={inputStyle}
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
              />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <label style={filterLabelStyle}>Min $</label>
              <input
                type="number"
                placeholder="0"
                style={{ ...inputStyle, width: 88 }}
                value={amountMin}
                onChange={(e) => setAmountMin(e.target.value)}
              />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <label style={filterLabelStyle}>Max $</label>
              <input
                type="number"
                placeholder="∞"
                style={{ ...inputStyle, width: 88 }}
                value={amountMax}
                onChange={(e) => setAmountMax(e.target.value)}
              />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <label style={filterLabelStyle}>Search</label>
              <div className="adm-search-wrap">
                <svg
                  className="adm-search-icon"
                  viewBox="0 0 20 20"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <circle cx="9" cy="9" r="5.5" />
                  <path d="M13.5 13.5L17 17" strokeLinecap="round" />
                </svg>
                <input
                  type="text"
                  placeholder="Counterparty / Stripe ref..."
                  style={{ ...inputStyle, minWidth: 200, paddingLeft: 36 }}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "flex-end", gap: 8 }}>
              <button
                className="adm-row-btn adm-row-btn--view click-shift"
                onClick={applyFilters}
              >
                Apply
              </button>
              <button
                className="adm-row-btn adm-row-btn--ghost click-shift"
                onClick={resetFilters}
              >
                Reset
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="adm-table-wrap">
            {loading ? (
              <div
                style={{
                  fontSize: 13,
                  fontFamily: "var(--font-body)",
                  color: "var(--ink-5)",
                  padding: "24px 0",
                }}
              >
                Loading entries...
              </div>
            ) : entries.length === 0 ? (
              <div
                style={{
                  fontSize: 13,
                  fontFamily: "var(--font-body)",
                  color: "var(--ink-5)",
                  padding: "24px 0",
                }}
              >
                No entries match your filters.
              </div>
            ) : (
              <table className="adm-table">
                <thead>
                  <tr>
                    {[
                      { label: "Timestamp", align: "left" },
                      { label: "Type", align: "left" },
                      { label: "Counterparty", align: "left" },
                      { label: "Amount", align: "right" },
                      { label: "Status", align: "left" },
                      { label: "Stripe Ref", align: "left" },
                      { label: "Note", align: "left" },
                    ].map(({ label, align }) => (
                      <th
                        key={label}
                        style={{ textAlign: align as "left" | "right" }}
                      >
                        {label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {entries.map((e) => (
                    <tr key={e.id}>
                      <td
                        style={{
                          color: "var(--ink-5)",
                          fontSize: 12,
                          whiteSpace: "nowrap",
                        }}
                      >
                        {fmtTs(e.timestamp)}
                      </td>
                      <td>
                        <TypeBadge type={e.type} />
                      </td>
                      <td style={{ color: "var(--ink)", fontWeight: 500 }}>
                        {e.counterparty}
                      </td>
                      <td
                        style={{
                          textAlign: "right",
                          fontWeight: 700,
                          color:
                            e.amount >= 0
                              ? "var(--accent-blue)"
                              : "var(--brand-red)",
                        }}
                      >
                        {e.amount >= 0 ? "+" : "−"}
                        {fmt(e.amount, 2)}
                      </td>
                      <td>
                        <StatusBadge status={e.status} />
                      </td>
                      <td
                        style={{
                          color: "var(--ink-5)",
                          fontSize: 11,
                          fontFamily: "var(--font-body)",
                        }}
                      >
                        {e.stripe_ref}
                      </td>
                      <td
                        style={{
                          color: "var(--ink-5)",
                          fontSize: 12,
                          maxWidth: 200,
                          whiteSpace: "normal",
                        }}
                      >
                        {e.note ?? "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Pagination */}
          <div className="adm-pagination">
            <span className="adm-pagination__info">
              Page {pagination.page} of {pagination.totalPages} —{" "}
              {pagination.total} entries
            </span>
            <div className="adm-pagination__controls">
              <button
                className="adm-page-btn"
                disabled={pagination.page <= 1}
                onClick={() => fetchLedger(pagination.page - 1, true)}
              >
                ← Prev
              </button>
              <button
                className="adm-page-btn"
                disabled={pagination.page >= pagination.totalPages}
                onClick={() => fetchLedger(pagination.page + 1, true)}
              >
                Next →
              </button>
            </div>
          </div>
        </div>

        {/* ── Reconciliation + Stripe Balance ── */}
        <div
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}
        >
          {/* §5 — Reconciliation — status colors via CSS classes */}
          <div style={cardStyle}>
            <div
              style={{
                fontFamily: "var(--font-display)",
                fontSize: 16,
                fontWeight: 700,
                color: "var(--ink)",
                marginBottom: 16,
              }}
            >
              Reconciliation
            </div>
            {/* Status row */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "8px 0",
                borderBottom: "1px solid var(--hairline)",
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-mono, var(--font-body))",
                  fontSize: 12,
                  color: "var(--ink-3)",
                }}
              >
                Status
              </span>
              <span
                className={`fin-recon-status--${recon?.status ?? "ok"}`}
                style={{
                  ...badgeBase,
                  background:
                    recon?.status === "ok"
                      ? "rgba(34,197,94,0.1)"
                      : recon?.status === "minor_discrepancy"
                        ? "var(--champagne-tint, rgba(191,161,112,0.12))"
                        : "rgba(193,18,31,0.08)",
                }}
              >
                {recon?.status === "ok"
                  ? "Balanced"
                  : recon?.status === "minor_discrepancy"
                    ? "Minor discrepancy"
                    : "Major discrepancy"}
              </span>
            </div>
            {[
              {
                label: "Expected balance",
                value: recon ? fmt(recon.expectedBalance, 2) : "—",
                valueColor: "var(--ink)",
              },
              {
                label: "Actual bank balance",
                value: recon ? fmt(recon.actualBankBalance, 2) : "—",
                valueColor: "var(--ink)",
              },
              {
                label: "Discrepancy",
                value: recon
                  ? `${recon.discrepancy < 0 ? "−" : "+"}${fmt(Math.abs(recon.discrepancy), 2)}`
                  : "—",
                valueColor:
                  recon && recon.discrepancy < 0
                    ? "var(--brand-red)"
                    : "var(--accent-blue)",
              },
            ].map(({ label, value, valueColor }) => (
              <div
                key={label}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "8px 0",
                  borderBottom: "1px solid var(--hairline)",
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-mono, var(--font-body))",
                    fontSize: 12,
                    color: "var(--ink-3)",
                  }}
                >
                  {label}
                </span>
                <span
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: 16,
                    fontWeight: 700,
                    color: valueColor,
                  }}
                >
                  {value}
                </span>
              </div>
            ))}
            <div
              style={{
                fontFamily: "var(--font-mono, var(--font-body))",
                fontSize: 12,
                color: "var(--ink-3)",
                marginTop: 12,
              }}
            >
              Last reconciled: {recon ? fmtDate(recon.lastReconciled) : "—"} —
              stub data
            </div>
          </div>

          {/* §4 — Stripe Balance — liquid-glass card */}
          <div className="fin-stripe-panel">
            <div className="fin-stripe-panel__title">Stripe Balance</div>
            {[
              {
                label: "Available",
                value: stripe ? fmt(stripe.available, 2) : "—",
                valClass:
                  "fin-stripe-panel__val fin-stripe-panel__val--available",
              },
              {
                label: "Pending",
                value: stripe ? fmt(stripe.pending, 2) : "—",
                valClass:
                  "fin-stripe-panel__val fin-stripe-panel__val--pending",
              },
              {
                label: "Reserved",
                value: stripe ? fmt(stripe.reserved, 2) : "—",
                valClass:
                  "fin-stripe-panel__val fin-stripe-panel__val--reserved",
              },
            ].map(({ label, value, valClass }) => (
              <div
                key={label}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "8px 0",
                  borderBottom: "1px solid rgba(255,255,255,0.4)",
                }}
              >
                <span className="fin-stripe-panel__key">{label}</span>
                <span className={valClass}>{value}</span>
              </div>
            ))}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "8px 0",
              }}
            >
              <span className="fin-stripe-panel__key">Currency</span>
              <span
                style={{
                  ...badgeBase,
                  background: "var(--accent-blue-tint, rgba(0,133,255,0.1))",
                  color: "var(--accent-blue)",
                }}
              >
                {stripe?.currency.toUpperCase() ?? "USD"}
              </span>
            </div>
            <div className="fin-stripe-panel__note">
              Stub — connect Stripe API key for live balance
            </div>
          </div>
        </div>

        {/* ── P&L Chart + Payout Scheduler ── */}
        <div
          style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 16 }}
        >
          <div style={cardStyle}>
            <div
              style={{
                fontFamily: "var(--font-display)",
                fontSize: 16,
                fontWeight: 700,
                color: "var(--ink)",
                marginBottom: 4,
              }}
            >
              Monthly P&L — Last 12 Months
            </div>
            <PnLChart data={pnl} />
          </div>

          <div style={cardStyle}>
            <div
              style={{
                fontFamily: "var(--font-display)",
                fontSize: 16,
                fontWeight: 700,
                color: "var(--ink)",
                marginBottom: 16,
              }}
            >
              Payouts Scheduler
            </div>
            <div
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(28px,3vw,48px)",
                fontWeight: 800,
                color: "var(--ink)",
                lineHeight: 1,
                marginBottom: 4,
              }}
            >
              {nextPayout ? countdown(nextPayout.scheduledAt) : "—"}
            </div>
            <div
              style={{
                fontSize: 12,
                fontFamily: "var(--font-body)",
                color: "var(--ink-5)",
                marginBottom: 20,
              }}
            >
              until next batch
            </div>
            {[
              {
                label: "Scheduled at",
                value: nextPayout ? fmtTs(nextPayout.scheduledAt) : "—",
              },
              {
                label: "Creators in batch",
                value: String(nextPayout?.creatorCount ?? "—"),
              },
              {
                label: "Estimated total",
                value: nextPayout ? fmt(nextPayout.estimatedTotal, 2) : "—",
                red: true,
              },
            ].map(({ label, value, red }) => (
              <div
                key={label}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "8px 0",
                  borderBottom: "1px solid var(--hairline)",
                  fontSize: 13,
                  fontFamily: "var(--font-body)",
                }}
              >
                <span style={{ color: "var(--ink-5)" }}>{label}</span>
                <span
                  style={{
                    fontWeight: 700,
                    color: red ? "var(--brand-red)" : "var(--ink)",
                  }}
                >
                  {value}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Manual Actions ── */}
        <div style={cardStyle}>
          <div
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 18,
              fontWeight: 700,
              color: "var(--ink)",
              marginBottom: 4,
            }}
          >
            Manual Actions
          </div>
          <div
            style={{
              fontSize: 12,
              fontFamily: "var(--font-body)",
              color: "var(--ink-5)",
              marginBottom: 20,
            }}
          >
            Admin-only operations — all writes logged to oracle_audit
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: 16,
            }}
          >
            {[
              {
                icon: "↩",
                label: "Issue Refund",
                desc: "Reverse a merchant subscription charge via Stripe",
                action: "refund" as ModalAction,
                danger: true,
              },
              {
                icon: "⚡",
                label: "Force Payout",
                desc: "Send creator payment outside of scheduled batch",
                action: "payout" as ModalAction,
                danger: false,
              },
              {
                icon: "⚖",
                label: "Adjust Balance",
                desc: "Credit or debit the platform balance (admin note required)",
                action: "adjust" as ModalAction,
                danger: false,
              },
            ].map(({ icon, label, desc, action, danger }) => (
              <button
                key={label}
                onClick={() => setModalAction(action)}
                style={{
                  padding: "20px",
                  border: `1px solid ${danger ? "rgba(193,18,31,0.2)" : "var(--hairline)"}`,
                  borderRadius: 10,
                  background: danger
                    ? "var(--brand-red-tint)"
                    : "var(--surface-3)",
                  cursor: "pointer",
                  textAlign: "left",
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                  transition: "transform 0.15s ease",
                }}
                className="click-shift"
              >
                <div style={{ fontSize: 24 }}>{icon}</div>
                <div
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: 15,
                    fontWeight: 700,
                    color: danger ? "var(--brand-red)" : "var(--ink)",
                  }}
                >
                  {label}
                </div>
                <div
                  style={{
                    fontSize: 12,
                    fontFamily: "var(--font-body)",
                    color: "var(--ink-5)",
                    lineHeight: 1.5,
                  }}
                >
                  {desc}
                </div>
              </button>
            ))}

            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <button
                onClick={exportCSV}
                style={{
                  padding: "16px",
                  border: "1px solid var(--hairline)",
                  borderRadius: 10,
                  background: "var(--surface-3)",
                  cursor: "pointer",
                  textAlign: "left",
                  display: "flex",
                  flexDirection: "column",
                  gap: 6,
                }}
                className="click-shift"
              >
                <div style={{ fontSize: 20 }}>↓</div>
                <div
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: 14,
                    fontWeight: 700,
                    color: "var(--ink)",
                  }}
                >
                  Export CSV
                </div>
                <div
                  style={{
                    fontSize: 11,
                    fontFamily: "var(--font-body)",
                    color: "var(--ink-5)",
                  }}
                >
                  Download current filtered view
                </div>
              </button>
              <button
                onClick={exportOFX}
                style={{
                  padding: "16px",
                  border: "1px solid var(--hairline)",
                  borderRadius: 10,
                  background: "var(--surface-3)",
                  cursor: "pointer",
                  textAlign: "left",
                  display: "flex",
                  flexDirection: "column",
                  gap: 6,
                }}
                className="click-shift"
              >
                <div style={{ fontSize: 20 }}>↓</div>
                <div
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: 14,
                    fontWeight: 700,
                    color: "var(--ink)",
                  }}
                >
                  QuickBooks OFX
                </div>
                <div
                  style={{
                    fontSize: 11,
                    fontFamily: "var(--font-body)",
                    color: "var(--ink-5)",
                  }}
                >
                  Export OFX stub for accounting
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Modal ── */}
      {modalAction && (
        <ActionModal
          action={modalAction}
          onClose={() => setModalAction(null)}
          onConfirm={handleModalConfirm}
        />
      )}

      {/* ── Toast ── */}
      {toast && (
        <div
          className={`adm-toast${toast.ok ? " adm-toast--ok" : " adm-toast--err"}`}
        >
          {toast.msg}
        </div>
      )}
    </div>
  );
}
