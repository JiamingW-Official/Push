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

// ── Sub-components ────────────────────────────────────────────────────────────

function TypeBadge({ type }: { type: TransactionType }) {
  const labels: Record<TransactionType, string> = {
    subscription: "Sub",
    payout: "Payout",
    refund: "Refund",
    platform_fee: "Fee",
    adjustment: "Adj",
  };
  return <span className={`fin-badge fin-badge--${type}`}>{labels[type]}</span>;
}

function StatusBadge({ status }: { status: TransactionStatus }) {
  return <span className={`fin-status fin-status--${status}`}>{status}</span>;
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
    <div className="fin-chart">
      <div className="fin-chart__svg-wrap">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          preserveAspectRatio="none"
          className="fin-chart__svg"
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
                  className="fin-chart__bar--revenue"
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
                  className="fin-chart__bar--payout"
                >
                  <title>
                    {d.label} Payouts: {fmt(d.payouts)}
                  </title>
                </rect>
                {/* Label */}
                <text x={x} y={H - 4} className="fin-chart__label">
                  {d.label.split(" ")[0]}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
      <div className="fin-chart__legend">
        <span className="fin-chart__legend-item">
          <span className="fin-chart__legend-dot fin-chart__legend-dot--revenue" />
          Revenue
        </span>
        <span className="fin-chart__legend-item">
          <span className="fin-chart__legend-dot fin-chart__legend-dot--payout" />
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

  return (
    <div
      className="fin-modal-backdrop"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="fin-modal">
        <div className="fin-modal__title">{cfg.title}</div>

        {cfg.note && <div className="fin-modal__note">{cfg.note}</div>}

        {cfg.fields.map((f) => (
          <div key={f.key} className="fin-modal__field">
            <label>
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
              />
            ) : (
              <input
                type={f.type ?? "text"}
                value={fields[f.key] ?? ""}
                onChange={(e) =>
                  setFields((prev) => ({ ...prev, [f.key]: e.target.value }))
                }
                placeholder={`Enter ${f.label.toLowerCase()}...`}
              />
            )}
          </div>
        ))}

        <div className="fin-modal__actions">
          <button className="fin-btn fin-btn--ghost" onClick={onClose}>
            Cancel
          </button>
          <button
            className="fin-btn fin-btn--primary"
            onClick={() => onConfirm(fields)}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}

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

  const reconTag =
    recon?.status === "ok"
      ? "Balanced"
      : recon?.status === "minor_discrepancy"
        ? "Minor discrepancy"
        : "Major discrepancy";

  const reconTagClass =
    recon?.status === "ok"
      ? "fin-panel__tag--ok"
      : recon?.status === "minor_discrepancy"
        ? "fin-panel__tag--warn"
        : "fin-panel__tag--error";

  return (
    <div className="fin-shell">
      {/* ── Top Nav ── */}
      <nav className="fin-nav">
        <a href="/admin" className="fin-nav__logo">
          Push<span>.</span>
        </a>
        <div className="fin-nav__sep" />
        <span className="fin-nav__section">Admin</span>
        <div className="fin-nav__spacer" />
        <span className="fin-nav__badge">Finance</span>
      </nav>

      <div className="fin-page">
        {/* ── 1. Hero ── */}
        <section className="fin-hero">
          <div className="fin-hero__eyebrow">Push Admin / Finance</div>
          <h1 className="fin-hero__title">Finance.</h1>

          <div className="fin-hero__stats">
            <div className="fin-stat">
              <div className="fin-stat__label">MTD GMV</div>
              <div className="fin-stat__value">{mtd ? fmt(mtd.gmv) : "—"}</div>
              <div className="fin-stat__delta fin-stat__delta--pos">
                Subscription revenue, Apr 2026
              </div>
            </div>

            <div className="fin-stat">
              <div className="fin-stat__label">MTD Payouts</div>
              <div className="fin-stat__value fin-stat__value--red">
                {mtd ? fmt(mtd.payouts) : "—"}
              </div>
              <div className="fin-stat__delta">Disbursed to creators</div>
            </div>

            <div className="fin-stat">
              <div className="fin-stat__label">Platform Fee Revenue</div>
              <div className="fin-stat__value fin-stat__value--gold">
                {mtd ? fmt(mtd.platformFees, 2) : "—"}
              </div>
              <div className="fin-stat__delta fin-stat__delta--pos">
                Net platform take, MTD
              </div>
            </div>
          </div>
        </section>

        {/* ── 2. Live Ledger Stream ── */}
        <section>
          <div className="fin-section-head">
            <div className="fin-section-head__title">Live Stream</div>
            <div className="fin-section-head__sub">
              Latest {streamEntries.length} transactions
            </div>
          </div>

          <div className="fin-stream">
            <div className="fin-stream__head">
              <div className="fin-stream__live-dot" />
              <div className="fin-stream__label">Live ledger</div>
            </div>

            <div className="fin-stream__list">
              {streamEntries.length === 0 && (
                <div className="fin-loading">Loading stream...</div>
              )}
              {streamEntries.map((e) => (
                <div
                  key={e.id}
                  className={`fin-stream__item fin-stream__item--${e.type}`}
                >
                  <span className="fin-stream__time">{fmtTs(e.timestamp)}</span>
                  <span className="fin-stream__party">{e.counterparty}</span>
                  <span
                    className={`fin-stream__type fin-stream__type--${e.type}`}
                  >
                    {e.type === "platform_fee" ? "Fee" : e.type}
                  </span>
                  <span
                    className={`fin-stream__amount ${
                      e.amount > 0
                        ? "fin-stream__amount--pos"
                        : "fin-stream__amount--neg"
                    }`}
                  >
                    {e.amount > 0 ? "+" : "−"}
                    {fmt(e.amount, 2)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── 3. Filters ── */}
        <section>
          <div className="fin-section-head">
            <div className="fin-section-head__title">Ledger</div>
            <div className="fin-section-head__sub">
              {pagination.total} entries
            </div>
          </div>

          <div className="fin-filters">
            <div className="fin-filter-group">
              <label>Type</label>
              <select
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

            <div className="fin-filter-group">
              <label>Status</label>
              <select
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

            <div className="fin-filter-group">
              <label>From date</label>
              <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
              />
            </div>

            <div className="fin-filter-group">
              <label>To date</label>
              <input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
              />
            </div>

            <div className="fin-filter-group">
              <label>Min amount</label>
              <input
                type="number"
                placeholder="0"
                value={amountMin}
                onChange={(e) => setAmountMin(e.target.value)}
              />
            </div>

            <div className="fin-filter-group">
              <label>Max amount</label>
              <input
                type="number"
                placeholder="∞"
                value={amountMax}
                onChange={(e) => setAmountMax(e.target.value)}
              />
            </div>

            <div className="fin-filter-group">
              <label>Search</label>
              <input
                type="text"
                placeholder="Counterparty / Stripe ref..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ minWidth: 200 }}
              />
            </div>

            <div className="fin-filters__actions">
              <button
                className="fin-btn fin-btn--primary"
                onClick={applyFilters}
              >
                Apply
              </button>
              <button className="fin-btn fin-btn--ghost" onClick={resetFilters}>
                Reset
              </button>
            </div>
          </div>

          {/* ── 4. Ledger Table ── */}
          <div className="fin-table-wrap">
            {loading ? (
              <div className="fin-loading">Loading entries...</div>
            ) : entries.length === 0 ? (
              <div className="fin-empty">No entries match your filters.</div>
            ) : (
              <table className="fin-table">
                <thead>
                  <tr>
                    <th>Timestamp</th>
                    <th>Type</th>
                    <th>Counterparty</th>
                    <th style={{ textAlign: "right" }}>Amount</th>
                    <th>Status</th>
                    <th>Stripe Ref</th>
                    <th>Note</th>
                  </tr>
                </thead>
                <tbody>
                  {entries.map((e) => (
                    <tr key={e.id}>
                      <td className="fin-table__ts">{fmtTs(e.timestamp)}</td>
                      <td>
                        <TypeBadge type={e.type} />
                      </td>
                      <td className="fin-table__party">{e.counterparty}</td>
                      <td
                        className={`fin-table__amount ${
                          e.amount >= 0
                            ? "fin-table__amount--pos"
                            : "fin-table__amount--neg"
                        }`}
                      >
                        {e.amount >= 0 ? "+" : "−"}
                        {fmt(e.amount, 2)}
                      </td>
                      <td>
                        <StatusBadge status={e.status} />
                      </td>
                      <td className="fin-table__ref">{e.stripe_ref}</td>
                      <td
                        className="fin-table__ref"
                        style={{ maxWidth: 200, whiteSpace: "normal" }}
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
          <div className="fin-pagination">
            <span className="fin-pagination__info">
              Page {pagination.page} of {pagination.totalPages} —{" "}
              {pagination.total} entries
            </span>
            <button
              className="fin-pagination__btn"
              disabled={pagination.page <= 1}
              onClick={() => fetchLedger(pagination.page - 1, true)}
            >
              ← Prev
            </button>
            <button
              className="fin-pagination__btn"
              disabled={pagination.page >= pagination.totalPages}
              onClick={() => fetchLedger(pagination.page + 1, true)}
            >
              Next →
            </button>
          </div>
        </section>

        {/* ── 5 + 6. Reconciliation + Stripe Balance ── */}
        <div className="fin-bottom-grid">
          {/* Reconciliation */}
          <div className="fin-panel">
            <div className="fin-panel__title">Reconciliation</div>

            <div className="fin-panel__row">
              <span className="fin-panel__key">Status</span>
              <span className={`fin-panel__tag ${reconTagClass}`}>
                {reconTag}
              </span>
            </div>

            <div className="fin-panel__row">
              <span className="fin-panel__key">Expected balance</span>
              <span className="fin-panel__val">
                {recon ? fmt(recon.expectedBalance, 2) : "—"}
              </span>
            </div>

            <div className="fin-panel__row">
              <span className="fin-panel__key">Actual bank balance</span>
              <span className="fin-panel__val">
                {recon ? fmt(recon.actualBankBalance, 2) : "—"}
              </span>
            </div>

            <hr className="fin-panel__divider" />

            <div className="fin-panel__row">
              <span className="fin-panel__key">Discrepancy</span>
              <span
                className={`fin-panel__val ${
                  recon && recon.discrepancy < 0
                    ? "fin-panel__val--neg"
                    : "fin-panel__val--pos"
                }`}
              >
                {recon
                  ? `${recon.discrepancy < 0 ? "−" : "+"}${fmt(Math.abs(recon.discrepancy), 2)}`
                  : "—"}
              </span>
            </div>

            <div className="fin-panel__note">
              Last reconciled: {recon ? fmtDate(recon.lastReconciled) : "—"} —
              stub data
            </div>
          </div>

          {/* Stripe Balance */}
          <div className="fin-panel">
            <div className="fin-panel__title">Stripe Balance</div>

            <div className="fin-panel__row">
              <span className="fin-panel__key">Available</span>
              <span className="fin-panel__val fin-panel__val--pos">
                {stripe ? fmt(stripe.available, 2) : "—"}
              </span>
            </div>

            <div className="fin-panel__row">
              <span className="fin-panel__key">Pending</span>
              <span className="fin-panel__val fin-panel__val--gold">
                {stripe ? fmt(stripe.pending, 2) : "—"}
              </span>
            </div>

            <div className="fin-panel__row">
              <span className="fin-panel__key">Reserved</span>
              <span className="fin-panel__val">
                {stripe ? fmt(stripe.reserved, 2) : "—"}
              </span>
            </div>

            <hr className="fin-panel__divider" />

            <div className="fin-panel__row">
              <span className="fin-panel__key">Currency</span>
              <span className="fin-panel__tag fin-panel__tag--ok">
                {stripe?.currency.toUpperCase() ?? "USD"}
              </span>
            </div>

            <div className="fin-panel__note">
              Stub — connect Stripe API key for live balance
            </div>
          </div>
        </div>

        {/* ── 7 + 8. P&L Chart + Payout Scheduler ── */}
        <div className="fin-bottom-grid fin-bottom-grid--wide">
          {/* P&L Chart */}
          <div className="fin-panel">
            <div className="fin-panel__title">Monthly P&L — Last 12 Months</div>
            <PnLChart data={pnl} />
          </div>

          {/* Payout Scheduler */}
          <div className="fin-panel">
            <div className="fin-panel__title">Payouts Scheduler</div>

            <div className="fin-scheduler">
              <div>
                <div className="fin-scheduler__countdown">
                  {nextPayout ? countdown(nextPayout.scheduledAt) : "—"}
                </div>
                <div className="fin-scheduler__sub">until next batch</div>
              </div>

              <div className="fin-scheduler__meta">
                <div className="fin-panel__row">
                  <span className="fin-panel__key">Scheduled at</span>
                  <span className="fin-panel__val" style={{ fontSize: 16 }}>
                    {nextPayout ? fmtTs(nextPayout.scheduledAt) : "—"}
                  </span>
                </div>

                <div className="fin-panel__row">
                  <span className="fin-panel__key">Creators in batch</span>
                  <span className="fin-panel__val" style={{ fontSize: 20 }}>
                    {nextPayout?.creatorCount ?? "—"}
                  </span>
                </div>

                <div className="fin-panel__row">
                  <span className="fin-panel__key">Estimated total</span>
                  <span className="fin-panel__val fin-panel__val--red">
                    {nextPayout ? fmt(nextPayout.estimatedTotal, 2) : "—"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── 9. Manual Actions ── */}
        <section className="fin-actions">
          <div
            className="fin-section-head"
            style={{ borderBottom: "none", marginBottom: 0 }}
          >
            <div className="fin-section-head__title">Manual Actions</div>
            <div className="fin-section-head__sub">Admin-only operations</div>
          </div>

          <div className="fin-actions__grid">
            <button
              className="fin-action-card fin-action-card--danger"
              onClick={() => setModalAction("refund")}
            >
              <div className="fin-action-card__icon">↩</div>
              <div className="fin-action-card__label">Issue Refund</div>
              <div className="fin-action-card__desc">
                Reverse a merchant subscription charge via Stripe
              </div>
            </button>

            <button
              className="fin-action-card"
              onClick={() => setModalAction("payout")}
            >
              <div className="fin-action-card__icon">⚡</div>
              <div className="fin-action-card__label">Force Payout</div>
              <div className="fin-action-card__desc">
                Send creator payment outside of scheduled batch
              </div>
            </button>

            <button
              className="fin-action-card"
              onClick={() => setModalAction("adjust")}
            >
              <div className="fin-action-card__icon">⚖</div>
              <div className="fin-action-card__label">Adjust Balance</div>
              <div className="fin-action-card__desc">
                Credit or debit the platform balance (admin note required)
              </div>
            </button>

            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <button className="fin-action-card" onClick={exportCSV}>
                <div className="fin-action-card__icon">↓</div>
                <div className="fin-action-card__label">Export CSV</div>
                <div className="fin-action-card__desc">
                  Download current filtered view as CSV
                </div>
              </button>

              <button className="fin-action-card" onClick={exportOFX}>
                <div className="fin-action-card__icon">↓</div>
                <div className="fin-action-card__label">QuickBooks OFX</div>
                <div className="fin-action-card__desc">
                  Export OFX stub for accounting import
                </div>
              </button>
            </div>
          </div>
        </section>
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
        <div className={`fin-toast ${toast.ok ? "fin-toast--success" : ""}`}>
          {toast.msg}
        </div>
      )}
    </div>
  );
}
