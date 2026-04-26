"use client";

import { useState, useEffect, useCallback, type ReactElement } from "react";
import Link from "next/link";
import "./wallet.css";
import {
  MOCK_PAYOUT_METHODS,
  MOCK_WITHDRAWALS,
  MOCK_TAX_SUMMARY,
  MOCK_WALLET_BALANCE,
  type PayoutMethod,
  type PayoutMethodType,
  type Withdrawal,
} from "@/lib/wallet/mock-wallet";

/* ── Types ────────────────────────────────────────────────── */

type Tab = "methods" | "history" | "tax";

interface WithdrawForm {
  amount: string;
  methodId: string;
}

interface AddMethodForm {
  type: PayoutMethodType;
  handle: string; // venmo
  email: string; // paypal
  routing: string; // bank
  account: string; // bank
}

/* ── Helpers ──────────────────────────────────────────────── */

function fmt(n: number) {
  return n.toLocaleString("en-US", { style: "currency", currency: "USD" });
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function calcFee(amount: number, method: PayoutMethod): number {
  if (method.type === "stripe")
    return parseFloat((amount * method.feeRate).toFixed(2));
  if (method.type === "bank") return 1.5;
  if (method.type === "paypal")
    return parseFloat((amount * method.feeRate + 0.25).toFixed(2));
  return 0;
}

/* ── SVG Icons ────────────────────────────────────────────── */

function IconStripe() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="2" y="5" width="20" height="14" rx="0" strokeLinecap="square" />
      <path d="M2 9h20" />
      <path d="M6 15h4" />
      <path d="M14 15h4" strokeDasharray="2 2" />
    </svg>
  );
}

function IconVenmo() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M20 4L12 20 4 4" strokeLinejoin="round" />
      <path d="M8 4h8" />
    </svg>
  );
}

function IconBank() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M3 21h18M3 10h18M12 3L3 10h18L12 3z" strokeLinejoin="round" />
      <path d="M6 10v11M10 10v11M14 10v11M18 10v11" />
    </svg>
  );
}

function IconPayPal() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M7 20l1-14h6c3 0 5 1.5 4.5 4.5C18 14 15.5 15.5 12.5 15.5H10L9 20H7z"
        strokeLinejoin="round"
      />
      <path d="M4 17l1-11h6c3 0 4.5 1.5 4 4" strokeLinejoin="round" />
    </svg>
  );
}

function IconDocument() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden="true"
    >
      <path d="M14 2H6a1 1 0 00-1 1v18a1 1 0 001 1h12a1 1 0 001-1V8l-5-6z" />
      <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" />
    </svg>
  );
}

function IconPlus() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <path d="M7 1v12M1 7h12" strokeLinecap="square" />
    </svg>
  );
}

function IconDownload() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden="true"
    >
      <path d="M7 1v8M4 6l3 3 3-3M1 11h12" strokeLinecap="square" />
    </svg>
  );
}

function MethodIcon({ type }: { type: PayoutMethodType }) {
  const icons: Record<PayoutMethodType, ReactElement> = {
    stripe: <IconStripe />,
    venmo: <IconVenmo />,
    bank: <IconBank />,
    paypal: <IconPayPal />,
  };
  return <div className="wallet-method-icon">{icons[type]}</div>;
}

/* ── Status Badge ─────────────────────────────────────────── */

function StatusBadge({ status }: { status: PayoutMethod["status"] }) {
  const cls = `wallet-badge wallet-badge-${status}`;
  const labels: Record<PayoutMethod["status"], string> = {
    verified: "Verified",
    pending: "Pending",
    disabled: "Disabled",
  };
  return <span className={cls}>{labels[status]}</span>;
}

/* ── Withdrawal Status ────────────────────────────────────── */

function WithdrawStatus({ status }: { status: Withdrawal["status"] }) {
  const labels: Record<Withdrawal["status"], string> = {
    processing: "Processing",
    sent: "Sent",
    failed: "Failed",
  };
  return (
    <span className={`wallet-status ${status}`}>
      <span className={`wallet-status-dot ${status}`} />
      {labels[status]}
    </span>
  );
}

/* ── Withdraw Modal ───────────────────────────────────────── */

interface WithdrawModalProps {
  balance: number;
  methods: PayoutMethod[];
  onClose: () => void;
  onConfirm: (amount: number, method: PayoutMethod) => void;
}

function WithdrawModal({
  balance,
  methods,
  onClose,
  onConfirm,
}: WithdrawModalProps) {
  const defaultMethod =
    methods.find((m) => m.isDefault && m.status === "verified") ??
    methods.find((m) => m.status === "verified");
  const [form, setForm] = useState<WithdrawForm>({
    amount: "",
    methodId: defaultMethod?.id ?? "",
  });
  const [loading, setLoading] = useState(false);
  const [amountError, setAmountError] = useState("");

  const eligibleMethods = methods.filter((m) => m.status !== "disabled");
  const selectedMethod = eligibleMethods.find((m) => m.id === form.methodId);
  const parsedAmount = parseFloat(form.amount) || 0;
  const fee = selectedMethod ? calcFee(parsedAmount, selectedMethod) : 0;
  const net = Math.max(0, parsedAmount - fee);

  function handleAmountChange(val: string) {
    setAmountError("");
    setForm((f) => ({ ...f, amount: val }));
  }

  function validate() {
    if (!parsedAmount || parsedAmount <= 0) {
      setAmountError("Enter a valid amount");
      return false;
    }
    if (parsedAmount > balance) {
      setAmountError(`Max available: ${fmt(balance)}`);
      return false;
    }
    if (!selectedMethod) {
      return false;
    }
    return true;
  }

  async function handleConfirm() {
    if (!validate() || !selectedMethod) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 900)); // mock network
    onConfirm(parsedAmount, selectedMethod);
    setLoading(false);
  }

  return (
    <div
      className="wallet-modal-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="wallet-modal"
        role="dialog"
        aria-modal="true"
        aria-label="Withdraw funds"
      >
        <div className="wallet-modal-header">
          <span className="wallet-modal-title">Withdraw Funds</span>
          <button
            className="wallet-modal-close"
            onClick={onClose}
            aria-label="Close"
          >
            &#x2715;
          </button>
        </div>

        <div className="wallet-modal-body">
          <div className="wallet-form-group">
            <label className="wallet-form-label" htmlFor="withdraw-amount">
              Amount (USD)
            </label>
            <input
              id="withdraw-amount"
              className={`wallet-form-input ${amountError ? "error" : ""}`}
              type="number"
              min="1"
              max={balance}
              step="0.01"
              placeholder="0.00"
              value={form.amount}
              onChange={(e) => handleAmountChange(e.target.value)}
            />
            {amountError && <p className="wallet-form-error">{amountError}</p>}
            <p
              style={{
                fontSize: 11,
                color: "var(--ink-4)",
                marginTop: 5,
                fontFamily: "var(--font-body)",
              }}
            >
              Available: {fmt(balance)}
            </p>
          </div>

          <div className="wallet-form-group">
            <label className="wallet-form-label" htmlFor="withdraw-method">
              Payout Method
            </label>
            <select
              id="withdraw-method"
              className="wallet-form-select"
              value={form.methodId}
              onChange={(e) =>
                setForm((f) => ({ ...f, methodId: e.target.value }))
              }
            >
              {eligibleMethods.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name} — {m.detail} ({m.fee})
                </option>
              ))}
            </select>
          </div>

          {parsedAmount > 0 && selectedMethod && (
            <div className="wallet-withdraw-net">
              <div className="wallet-withdraw-net-label">Net to receive</div>
              <div className="wallet-withdraw-net-amount">{fmt(net)}</div>
              <div className="wallet-withdraw-fee-note">
                Fee: {fmt(fee)} ({selectedMethod.fee}) — arrives 1–3 business
                days
              </div>
            </div>
          )}
        </div>

        <div className="wallet-modal-footer">
          <button className="wallet-modal-btn cancel" onClick={onClose}>
            Cancel
          </button>
          <button
            className="wallet-modal-btn confirm"
            onClick={handleConfirm}
            disabled={loading || !parsedAmount || !selectedMethod}
          >
            {loading ? (
              <span className="wallet-spinner" />
            ) : (
              "Confirm Withdrawal"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Add Method Modal ─────────────────────────────────────── */

interface AddMethodModalProps {
  onClose: () => void;
  onAdd: (method: Omit<PayoutMethod, "id" | "addedAt">) => void;
}

const METHOD_TYPES: { type: PayoutMethodType; name: string; fee: string }[] = [
  { type: "stripe", name: "Stripe Connect", fee: "0.25%" },
  { type: "venmo", name: "Venmo", fee: "Free" },
  { type: "bank", name: "Bank Transfer", fee: "$1.50 flat" },
  { type: "paypal", name: "PayPal", fee: "1.5% + $0.25" },
];

function AddMethodModal({ onClose, onAdd }: AddMethodModalProps) {
  const [selectedType, setSelectedType] = useState<PayoutMethodType>("stripe");
  const [form, setForm] = useState<AddMethodForm>({
    type: "stripe",
    handle: "",
    email: "",
    routing: "",
    account: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<
    Partial<Record<keyof AddMethodForm, string>>
  >({});
  const [stripeConnected, setStripeConnected] = useState(false);

  function validate() {
    const errs: typeof errors = {};
    if (selectedType === "venmo" && !form.handle.startsWith("@"))
      errs.handle = "Handle must start with @";
    if (selectedType === "paypal" && !form.email.includes("@"))
      errs.email = "Enter a valid email";
    if (selectedType === "bank") {
      if (!/^\d{9}$/.test(form.routing))
        errs.routing = "Routing number must be 9 digits";
      if (form.account.length < 6) errs.account = "Account number too short";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleStripeConnect() {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1200)); // mock OAuth
    setStripeConnected(true);
    setLoading(false);
  }

  async function handleSubmit() {
    if (selectedType === "stripe" && !stripeConnected) {
      handleStripeConnect();
      return;
    }
    if (!validate()) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 700));

    const details: Record<PayoutMethodType, string> = {
      stripe: "••••" + Math.floor(1000 + Math.random() * 9000),
      venmo: form.handle,
      bank: "••••" + form.account.slice(-4),
      paypal: form.email,
    };

    const feeRates: Record<PayoutMethodType, number> = {
      stripe: 0.0025,
      venmo: 0,
      bank: 0,
      paypal: 0.015,
    };
    const fees: Record<PayoutMethodType, string> = {
      stripe: "0.25%",
      venmo: "Free",
      bank: "$1.50",
      paypal: "1.5% + $0.25",
    };

    onAdd({
      type: selectedType,
      name: METHOD_TYPES.find((m) => m.type === selectedType)!.name,
      detail: details[selectedType],
      status: selectedType === "bank" ? "pending" : "verified",
      isDefault: false,
      fee: fees[selectedType],
      feeRate: feeRates[selectedType],
    });
    setLoading(false);
  }

  return (
    <div
      className="wallet-modal-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="wallet-modal"
        role="dialog"
        aria-modal="true"
        aria-label="Add payout method"
      >
        <div className="wallet-modal-header">
          <span className="wallet-modal-title">Add Payout Method</span>
          <button
            className="wallet-modal-close"
            onClick={onClose}
            aria-label="Close"
          >
            &#x2715;
          </button>
        </div>

        <div className="wallet-modal-body">
          <div
            style={{
              marginBottom: 8,
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              color: "var(--ink-4)",
              fontFamily: "var(--font-body)",
            }}
          >
            Select type
          </div>
          <div className="wallet-method-type-grid">
            {METHOD_TYPES.map((m) => (
              <button
                key={m.type}
                className={`wallet-method-type-btn ${selectedType === m.type ? "selected" : ""}`}
                onClick={() => {
                  setSelectedType(m.type);
                  setErrors({});
                  setStripeConnected(false);
                }}
              >
                <span className="wallet-method-type-name">
                  {m.name}
                  {m.type === "stripe" && (
                    <span
                      className="wallet-badge wallet-badge-recommended"
                      style={{ marginLeft: 6, fontSize: 9 }}
                    >
                      Recommended
                    </span>
                  )}
                </span>
                <span className="wallet-method-type-fee">{m.fee}</span>
              </button>
            ))}
          </div>

          {selectedType === "stripe" && (
            <>
              <div className="wallet-stripe-info">
                Stripe Connect offers the lowest fees and fastest payouts.
                Connect your Stripe account to get paid directly.
              </div>
              {stripeConnected ? (
                <p
                  style={{
                    fontSize: 13,
                    color: "var(--accent-blue)",
                    fontWeight: 600,
                    fontFamily: "var(--font-body)",
                  }}
                >
                  ✓ Stripe account connected successfully
                </p>
              ) : (
                <button
                  className="btn-secondary click-shift"
                  style={{ width: "100%", padding: "14px", fontSize: 13 }}
                  onClick={handleStripeConnect}
                  disabled={loading}
                >
                  {loading ? (
                    <span className="wallet-spinner" />
                  ) : (
                    "Connect with Stripe"
                  )}
                </button>
              )}
            </>
          )}

          {selectedType === "venmo" && (
            <div className="wallet-form-group">
              <label className="wallet-form-label" htmlFor="venmo-handle">
                Venmo Handle
              </label>
              <input
                id="venmo-handle"
                className={`wallet-form-input ${errors.handle ? "error" : ""}`}
                placeholder="@yourhandle"
                value={form.handle}
                onChange={(e) =>
                  setForm((f) => ({ ...f, handle: e.target.value }))
                }
              />
              {errors.handle && (
                <p className="wallet-form-error">{errors.handle}</p>
              )}
            </div>
          )}

          {selectedType === "bank" && (
            <>
              <div className="wallet-form-group">
                <label className="wallet-form-label" htmlFor="routing">
                  Routing Number
                </label>
                <input
                  id="routing"
                  className={`wallet-form-input ${errors.routing ? "error" : ""}`}
                  placeholder="9-digit routing number"
                  maxLength={9}
                  value={form.routing}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      routing: e.target.value.replace(/\D/g, ""),
                    }))
                  }
                />
                {errors.routing && (
                  <p className="wallet-form-error">{errors.routing}</p>
                )}
              </div>
              <div className="wallet-form-group">
                <label className="wallet-form-label" htmlFor="account">
                  Account Number
                </label>
                <input
                  id="account"
                  className={`wallet-form-input ${errors.account ? "error" : ""}`}
                  placeholder="Account number"
                  value={form.account}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      account: e.target.value.replace(/\D/g, ""),
                    }))
                  }
                />
                {errors.account && (
                  <p className="wallet-form-error">{errors.account}</p>
                )}
                <p
                  style={{
                    fontSize: 11,
                    color: "var(--ink-4)",
                    marginTop: 4,
                    fontFamily: "var(--font-body)",
                  }}
                >
                  Bank accounts require 1–2 days verification
                </p>
              </div>
            </>
          )}

          {selectedType === "paypal" && (
            <div className="wallet-form-group">
              <label className="wallet-form-label" htmlFor="paypal-email">
                PayPal Email
              </label>
              <input
                id="paypal-email"
                className={`wallet-form-input ${errors.email ? "error" : ""}`}
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={(e) =>
                  setForm((f) => ({ ...f, email: e.target.value }))
                }
              />
              {errors.email && (
                <p className="wallet-form-error">{errors.email}</p>
              )}
            </div>
          )}
        </div>

        <div className="wallet-modal-footer">
          <button className="wallet-modal-btn cancel" onClick={onClose}>
            Cancel
          </button>
          {selectedType !== "stripe" && (
            <button
              className="wallet-modal-btn confirm"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? <span className="wallet-spinner" /> : "Add Method"}
            </button>
          )}
          {selectedType === "stripe" && stripeConnected && (
            <button
              className="wallet-modal-btn confirm"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? <span className="wallet-spinner" /> : "Save"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Bar Chart (SVG hand-drawn style) ────────────────────── */

function MonthlyBarChart({
  data,
}: {
  data: { month: string; amount: number }[];
}) {
  const max = Math.max(...data.map((d) => d.amount), 1);
  const currentMonth = new Date().getMonth(); // 0-indexed

  return (
    <div className="wallet-bar-chart">
      {data.map((d, i) => {
        const pct = d.amount / max;
        const heightPx = Math.round(pct * 100);
        return (
          <div key={d.month} className="wallet-bar-col">
            <div
              className={`wallet-bar ${i <= currentMonth ? "current-year" : ""}`}
              style={{ height: heightPx || 2 }}
              title={`${d.month}: ${fmt(d.amount)}`}
            />
            <div className="wallet-bar-month">{d.month}</div>
          </div>
        );
      })}
    </div>
  );
}

/* ── Payout Methods Tab ───────────────────────────────────── */

interface PayoutMethodsTabProps {
  methods: PayoutMethod[];
  onSetDefault: (id: string) => void;
  onRemove: (id: string) => void;
  onAddClick: () => void;
}

function PayoutMethodsTab({
  methods,
  onSetDefault,
  onRemove,
  onAddClick,
}: PayoutMethodsTabProps) {
  return (
    <div>
      <div className="wallet-methods-list">
        {methods.map((m) => (
          <div
            key={m.id}
            className={`wallet-method-card ${m.status === "disabled" ? "disabled" : ""}`}
          >
            <MethodIcon type={m.type} />

            <div className="wallet-method-info">
              <div className="wallet-method-name-row">
                <span className="wallet-method-name">{m.name}</span>
                <StatusBadge status={m.status} />
                {m.isDefault && (
                  <span className="wallet-badge wallet-badge-default">
                    Default
                  </span>
                )}
                {m.type === "stripe" && (
                  <span className="wallet-badge wallet-badge-recommended">
                    Recommended
                  </span>
                )}
              </div>
              <div className="wallet-method-detail">{m.detail}</div>
              <div className="wallet-method-fee">Fee: {m.fee}</div>
            </div>

            <div className="wallet-method-actions">
              {!m.isDefault && m.status === "verified" && (
                <button
                  className="wallet-action-btn"
                  onClick={() => onSetDefault(m.id)}
                >
                  Set Default
                </button>
              )}
              <button className="wallet-action-btn">Edit</button>
              {!m.isDefault && (
                <button
                  className="wallet-action-btn danger"
                  onClick={() => onRemove(m.id)}
                >
                  Remove
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      <button className="wallet-add-method-btn" onClick={onAddClick}>
        <IconPlus /> Add Payout Method
      </button>
    </div>
  );
}

/* ── History Tab ──────────────────────────────────────────── */

interface HistoryTabProps {
  withdrawals: Withdrawal[];
  methods: PayoutMethod[];
}

function HistoryTab({ withdrawals, methods }: HistoryTabProps) {
  const [filterMethod, setFilterMethod] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterYear, setFilterYear] = useState("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const years = [...new Set(withdrawals.map((w) => w.date.slice(0, 4)))].sort(
    (a, b) => +b - +a,
  );

  const filtered = withdrawals.filter((w) => {
    if (filterMethod !== "all" && w.methodType !== filterMethod) return false;
    if (filterStatus !== "all" && w.status !== filterStatus) return false;
    if (filterYear !== "all" && !w.date.startsWith(filterYear)) return false;
    return true;
  });

  function exportCsv() {
    const header = ["Date", "Method", "Amount", "Fee", "Net", "Status"];
    const rows = filtered.map((w) => [
      w.date,
      w.methodType,
      w.amount.toFixed(2),
      w.fee.toFixed(2),
      w.net.toFixed(2),
      w.status,
    ]);
    const csv = [header, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `push-withdrawals-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div>
      <div className="wallet-history-filters">
        <select
          className="wallet-filter-select"
          value={filterMethod}
          onChange={(e) => setFilterMethod(e.target.value)}
        >
          <option value="all">All Methods</option>
          {[...new Set(withdrawals.map((w) => w.methodType))].map((t) => (
            <option key={t} value={t}>
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </option>
          ))}
        </select>

        <select
          className="wallet-filter-select"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="all">All Statuses</option>
          <option value="processing">Processing</option>
          <option value="sent">Sent</option>
          <option value="failed">Failed</option>
        </select>

        <select
          className="wallet-filter-select"
          value={filterYear}
          onChange={(e) => setFilterYear(e.target.value)}
        >
          <option value="all">All Years</option>
          {years.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>

        <button className="wallet-export-btn" onClick={exportCsv}>
          <IconDownload /> Export CSV
        </button>
      </div>

      <div className="wallet-table-wrap">
        <table className="wallet-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Method</th>
              <th>Amount</th>
              <th>Fee</th>
              <th>Net</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((w) => (
              <>
                <tr
                  key={w.id}
                  className={w.status === "failed" ? "failed-row" : ""}
                  onClick={() =>
                    w.status === "failed" &&
                    setExpandedId(expandedId === w.id ? null : w.id)
                  }
                >
                  <td>{fmtDate(w.date)}</td>
                  <td>
                    <span style={{ textTransform: "capitalize" }}>
                      {w.methodType}
                    </span>
                    <span
                      style={{
                        color: "var(--ink-4)",
                        marginLeft: 6,
                        fontSize: 12,
                      }}
                    >
                      {w.methodDetail}
                    </span>
                  </td>
                  <td className="amount-col">{fmt(w.amount)}</td>
                  <td className="fee-col">{w.fee > 0 ? fmt(w.fee) : "—"}</td>
                  <td className="net-col">{fmt(w.net)}</td>
                  <td>
                    <WithdrawStatus status={w.status} />
                  </td>
                </tr>
                {w.status === "failed" && expandedId === w.id && (
                  <tr key={`${w.id}-expand`} className="wallet-failed-expand">
                    <td colSpan={6}>
                      <div className="wallet-failed-reason">
                        {w.failureReason}
                      </div>
                      <button
                        className="wallet-action-btn"
                        style={{ fontSize: 11 }}
                      >
                        Retry Withdrawal
                      </button>
                    </td>
                  </tr>
                )}
              </>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  style={{
                    textAlign: "center",
                    color: "var(--ink-4)",
                    padding: "32px",
                    fontFamily: "var(--font-body)",
                  }}
                >
                  No withdrawals match the selected filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ── Tax Tab ──────────────────────────────────────────────── */

function TaxTab() {
  const tax = MOCK_TAX_SUMMARY;

  // Rough self-employment tax estimate — not financial advice
  const selfEmploymentTax = tax.netEarned * 0.1413;
  const federalEstimate = tax.netEarned * 0.12;
  const totalEstimate = selfEmploymentTax + federalEstimate;

  function handleDownload1099() {
    alert("Your 2025 1099-NEC will be available for download in January 2027.");
  }

  function handleEdit() {
    alert("W-9 editing coming soon. Please contact support@pushapp.co.");
  }

  return (
    <div>
      <div className="wallet-tax-hero">
        <div className="wallet-tax-year-label">Total Earned in {tax.year}</div>
        <div className="wallet-tax-big">{fmt(tax.totalEarned)}</div>
        <div className="wallet-tax-sub">
          Platform fees: {fmt(tax.platformFees)} &nbsp;·&nbsp; Net:{" "}
          {fmt(tax.netEarned)}
        </div>
      </div>

      <div className="wallet-tax-grid">
        {/* 1099-NEC Card */}
        <div className="wallet-tax-card">
          <div className="wallet-tax-card-label">Tax Forms</div>
          <div className="wallet-1099-icon" style={{ color: "var(--ink)" }}>
            <IconDocument />
          </div>
          <div className="wallet-1099-title">1099-NEC {tax.form1099Year}</div>
          <div className="wallet-1099-note">
            Forms are issued by January 31. Available for tax year{" "}
            {tax.form1099Year}.
          </div>
          <button
            className="btn-primary click-shift"
            style={{ width: "100%", padding: "12px", fontSize: 12 }}
            onClick={handleDownload1099}
          >
            Download {tax.form1099Year} 1099 (PDF)
          </button>
        </div>

        {/* W-9 Card */}
        <div className="wallet-tax-card">
          <div className="wallet-tax-card-label">W-9 Information</div>

          <div className="wallet-w9-row">
            <span className="wallet-w9-key">Legal Name</span>
            <span className="wallet-w9-val">{tax.w9Name}</span>
          </div>
          <div className="wallet-w9-row">
            <span className="wallet-w9-key">SSN / TIN</span>
            <span className="wallet-w9-val">{tax.w9Ssn}</span>
          </div>
          <div className="wallet-w9-row">
            <span className="wallet-w9-key">Address</span>
            <span
              className="wallet-w9-val"
              style={{ maxWidth: 180, textAlign: "right", fontSize: 12 }}
            >
              {tax.w9Address}
            </span>
          </div>

          <button
            className="btn-ghost click-shift"
            style={{ marginTop: 20 }}
            onClick={handleEdit}
          >
            Edit W-9
          </button>
        </div>

        {/* Monthly Chart — full width */}
        <div className="wallet-tax-card wallet-tax-chart-card">
          <div className="wallet-tax-card-label">
            Monthly Earnings — {tax.year}
          </div>
          <MonthlyBarChart data={tax.monthlyBreakdown} />
        </div>

        {/* Tax Estimate Card */}
        <div className="wallet-tax-card" style={{ gridColumn: "1 / -1" }}>
          <div className="wallet-tax-card-label">
            Estimated Tax Liability — {tax.year}
          </div>

          <div className="wallet-estimate-row">
            <span className="wallet-estimate-label">
              Self-employment tax (14.13%)
            </span>
            <span className="wallet-estimate-value">
              {fmt(selfEmploymentTax)}
            </span>
          </div>
          <div className="wallet-estimate-row">
            <span className="wallet-estimate-label">
              Federal income estimate (12%)
            </span>
            <span className="wallet-estimate-value">
              {fmt(federalEstimate)}
            </span>
          </div>
          <div
            className="wallet-estimate-row"
            style={{
              borderTop: "2px solid var(--hairline)",
              marginTop: 4,
              paddingTop: 16,
            }}
          >
            <span className="wallet-estimate-label" style={{ fontWeight: 700 }}>
              Total estimate
            </span>
            <span
              className="wallet-estimate-value"
              style={{ color: "var(--brand-red)" }}
            >
              {fmt(totalEstimate)}
            </span>
          </div>

          {/* Rough estimate, not financial advice */}
          <p className="wallet-tax-disclaimer">
            Rough estimate only — not financial or tax advice. Consult a
            qualified tax professional. Rates assume single filer with no other
            income.
          </p>
        </div>
      </div>
    </div>
  );
}

/* ── Page Root ────────────────────────────────────────────── */

export default function WalletPage() {
  const [tab, setTab] = useState<Tab>("methods");
  const [methods, setMethods] = useState<PayoutMethod[]>(MOCK_PAYOUT_METHODS);
  const [withdrawals, setWithdrawals] =
    useState<Withdrawal[]>(MOCK_WITHDRAWALS);
  const [balance, setBalance] = useState(MOCK_WALLET_BALANCE);
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [showAddMethod, setShowAddMethod] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  // Persist withdrawals to localStorage for optimistic UI
  useEffect(() => {
    try {
      const stored = localStorage.getItem("push-wallet-withdrawals");
      if (stored) {
        const parsed: Withdrawal[] = JSON.parse(stored);
        if (parsed.length > 0) setWithdrawals(parsed);
      }
    } catch {}
  }, []);

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  }, []);

  function handleWithdrawConfirm(amount: number, method: PayoutMethod) {
    const fee = calcFee(amount, method);
    const net = parseFloat((amount - fee).toFixed(2));

    const newWithdrawal: Withdrawal = {
      id: `wd-${Date.now()}`,
      date: new Date().toISOString().split("T")[0],
      methodId: method.id,
      methodType: method.type,
      methodDetail: method.detail,
      amount,
      fee,
      net,
      status: "processing",
    };

    // Optimistic update
    const updated = [newWithdrawal, ...withdrawals];
    setWithdrawals(updated);
    setBalance((b) => ({
      ...b,
      available: parseFloat((b.available - amount).toFixed(2)),
      processing: parseFloat((b.processing + net).toFixed(2)),
    }));

    try {
      localStorage.setItem("push-wallet-withdrawals", JSON.stringify(updated));
    } catch {}

    setShowWithdraw(false);
    showToast(`Withdrawal of ${fmt(amount)} initiated`);
    setTab("history"); // switch to history so user sees processing row
  }

  function handleSetDefault(id: string) {
    setMethods((prev) => prev.map((m) => ({ ...m, isDefault: m.id === id })));
    showToast("Default payout method updated");
  }

  function handleRemove(id: string) {
    setMethods((prev) => prev.filter((m) => m.id !== id));
    showToast("Payout method removed");
  }

  function handleAddMethod(partial: Omit<PayoutMethod, "id" | "addedAt">) {
    const newMethod: PayoutMethod = {
      ...partial,
      id: `pm-${Date.now()}`,
      addedAt: new Date().toISOString().split("T")[0],
    };
    setMethods((prev) => [...prev, newMethod]);
    setShowAddMethod(false);
    showToast("Payout method added");
  }

  const TAB_LABELS: { key: Tab; label: string }[] = [
    { key: "methods", label: "Payout Methods" },
    { key: "history", label: "History" },
    { key: "tax", label: "Tax" },
  ];

  return (
    <div className="cw-page">
      <header className="cw-header">
        <div className="cw-header__left">
          <p className="cw-eyebrow cw-eyebrow--live">
            WALLET · {fmt(balance.available)} AVAILABLE
          </p>
          <h1 className="cw-title">Wallet</h1>
        </div>
        <div className="cw-header__right">
          <span className="cw-date">
            PROCESSING {fmt(balance.processing)} · YTD {fmt(balance.thisYear)}
          </span>
          <button
            type="button"
            className={
              "cw-pill" + (balance.available > 0 ? " cw-pill--urgent" : "")
            }
            onClick={() => setShowWithdraw(true)}
            disabled={balance.available <= 0}
            style={balance.available <= 0 ? { opacity: 0.5 } : undefined}
          >
            Withdraw {fmt(balance.available)}
          </button>
        </div>
      </header>

      {/* Tabs */}
      <nav
        style={{
          padding: "0 40px",
          borderBottom: "2px solid var(--ink)",
          display: "flex",
          gap: 0,
          background: "var(--snow)",
        }}
        aria-label="Wallet sections"
      >
        {TAB_LABELS.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            aria-selected={tab === key}
            style={{
              padding: "14px 20px",
              fontFamily: "var(--font-body)",
              fontSize: 13,
              fontWeight: 600,
              color: tab === key ? "var(--ink)" : "var(--ink-4)",
              background: "none",
              border: "none",
              borderBottom:
                tab === key ? "2px solid var(--ink)" : "2px solid transparent",
              cursor: "pointer",
              letterSpacing: "0.02em",
              transition: "color 0.15s",
            }}
          >
            {label}
          </button>
        ))}
      </nav>

      {/* Tab Content */}
      <div
        className="wallet-tab-content"
        key={tab}
        style={{ padding: "24px 32px" }}
      >
        {tab === "methods" && (
          <PayoutMethodsTab
            methods={methods}
            onSetDefault={handleSetDefault}
            onRemove={handleRemove}
            onAddClick={() => setShowAddMethod(true)}
          />
        )}
        {tab === "history" && (
          <HistoryTab withdrawals={withdrawals} methods={methods} />
        )}
        {tab === "tax" && <TaxTab />}
      </div>

      {/* Modals */}
      {showWithdraw && (
        <WithdrawModal
          balance={balance.available}
          methods={methods}
          onClose={() => setShowWithdraw(false)}
          onConfirm={handleWithdrawConfirm}
        />
      )}

      {showAddMethod && (
        <AddMethodModal
          onClose={() => setShowAddMethod(false)}
          onAdd={handleAddMethod}
        />
      )}

      {/* Toast */}
      {toast && (
        <div className="wallet-toast" role="status">
          {toast}
        </div>
      )}
    </div>
  );
}
