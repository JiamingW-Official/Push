"use client";

import { useState, useMemo } from "react";
import { StatusBadge } from "@/components/merchant/shared";
import { useToast } from "@/components/toast/Toaster";
import "./finance.css";

// ── Types ──────────────────────────────────────────────────────────────────

type TransactionType = "topup" | "campaign-charge" | "refund" | "adjustment";
type TransactionFilter = TransactionType | "all";

interface PaymentMethod {
  id: string;
  brand: string;
  last4: string;
  expiry: string;
  isDefault: boolean;
}

interface Transaction {
  id: string;
  date: string;
  type: TransactionType;
  description: string;
  amount: number; // cents, negative = debit
  status: "pending" | "resolved" | "closed" | "active";
}

interface Invoice {
  id: string;
  period: string;
  amount: number; // cents
  status: "paid" | "pending" | "failed";
  due_date: string | null;
  pdf_url?: string | null;
}

interface FinancePageClientProps {
  balance: number; // cents
  mtdSpend: number; // cents
  lifetimeSpend: number; // cents
  transactions: Transaction[];
  invoices: Invoice[];
  paymentMethods: PaymentMethod[];
}

// ── Helpers ────────────────────────────────────────────────────────────────

function usd(cents: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(Math.abs(cents) / 100);
}

function fmtDate(s: string | null) {
  if (!s) return "—";
  return new Date(s).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

const TX_TYPE_LABEL: Record<TransactionType, string> = {
  topup: "Top-up",
  "campaign-charge": "Campaign",
  refund: "Refund",
  adjustment: "Adjustment",
};

// ── Mock seed data ─────────────────────────────────────────────────────────

const MOCK_METHODS: PaymentMethod[] = [
  {
    id: "pm-1",
    brand: "Visa",
    last4: "4242",
    expiry: "04/28",
    isDefault: true,
  },
  {
    id: "pm-2",
    brand: "Mastercard",
    last4: "5454",
    expiry: "11/27",
    isDefault: false,
  },
];

const MOCK_TXS: Transaction[] = [
  {
    id: "tx-1",
    date: "2026-05-08",
    type: "campaign-charge",
    description: "Forma Pilates Chelsea",
    amount: -8000,
    status: "resolved",
  },
  {
    id: "tx-2",
    date: "2026-05-07",
    type: "campaign-charge",
    description: "Roberta's Pizza",
    amount: -12400,
    status: "resolved",
  },
  {
    id: "tx-3",
    date: "2026-05-06",
    type: "topup",
    description: "Wallet top-up",
    amount: 100000,
    status: "resolved",
  },
  {
    id: "tx-4",
    date: "2026-05-05",
    type: "campaign-charge",
    description: "Devocíon Coffee",
    amount: -6200,
    status: "resolved",
  },
  {
    id: "tx-5",
    date: "2026-05-04",
    type: "refund",
    description: "Partial refund – Sasha K",
    amount: 3200,
    status: "resolved",
  },
  {
    id: "tx-6",
    date: "2026-05-03",
    type: "campaign-charge",
    description: "Smith Canteen",
    amount: -4800,
    status: "pending",
  },
  {
    id: "tx-7",
    date: "2026-05-01",
    type: "adjustment",
    description: "Dispute credit",
    amount: 1500,
    status: "resolved",
  },
];

const MOCK_INVOICES: Invoice[] = [
  {
    id: "inv-001",
    period: "May 2026",
    amount: 32600,
    status: "pending",
    due_date: "2026-05-20",
  },
  {
    id: "inv-002",
    period: "April 2026",
    amount: 28400,
    status: "paid",
    due_date: "2026-04-20",
  },
  {
    id: "inv-003",
    period: "March 2026",
    amount: 31200,
    status: "paid",
    due_date: "2026-03-20",
  },
  {
    id: "inv-004",
    period: "Feb 2026",
    amount: 19800,
    status: "paid",
    due_date: "2026-02-20",
  },
];

// ── Subviews ───────────────────────────────────────────────────────────────

function Overview({
  txs,
  methods,
}: {
  txs: Transaction[];
  methods: PaymentMethod[];
}) {
  const recent = txs.slice(0, 5);
  return (
    <>
      <div className="fin-section-head">
        <h2 className="fin-section-title">Recent activity</h2>
      </div>
      <table className="fin-table">
        <thead className="fin-table-head">
          <tr>
            <th>Date</th>
            <th>Description</th>
            <th>Type</th>
            <th>Amount</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {recent.map((tx) => (
            <tr key={tx.id} className="fin-table__row">
              <td className="fin-table__date">{fmtDate(tx.date)}</td>
              <td className="fin-table__desc">{tx.description}</td>
              <td className="fin-table__type">{TX_TYPE_LABEL[tx.type]}</td>
              <td
                className={`fin-table__amount ${tx.amount >= 0 ? "fin-table__amount--credit" : "fin-table__amount--debit"}`}
              >
                {tx.amount >= 0 ? "+" : "−"}
                {usd(tx.amount)}
              </td>
              <td className="fin-table__status">
                <StatusBadge status={tx.status}>
                  {tx.status.toUpperCase()}
                </StatusBadge>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="fin-section-head" style={{ marginTop: 40 }}>
        <h2 className="fin-section-title">Payment methods</h2>
      </div>
      <div className="fin-methods">
        {methods.map((m) => (
          <div
            key={m.id}
            className={`fin-method-card${m.isDefault ? " fin-method-card--default" : ""}`}
          >
            {m.isDefault && (
              <span className="fin-method__default-badge">Default</span>
            )}
            <span className="fin-method__brand">{m.brand}</span>
            <span className="fin-method__num">•••• {m.last4}</span>
            <span className="fin-method__meta">Expires {m.expiry}</span>
          </div>
        ))}
        <button className="fin-add-method" onClick={() => {}}>
          + Add method
        </button>
      </div>
    </>
  );
}

function Transactions({ txs }: { txs: Transaction[] }) {
  const [filter, setFilter] = useState<TransactionFilter>("all");
  const visible = useMemo(
    () => (filter === "all" ? txs : txs.filter((t) => t.type === filter)),
    [txs, filter],
  );
  const FILTERS: { value: TransactionFilter; label: string }[] = [
    { value: "all", label: "All" },
    { value: "campaign-charge", label: "Charges" },
    { value: "topup", label: "Top-ups" },
    { value: "refund", label: "Refunds" },
    { value: "adjustment", label: "Adjustments" },
  ];
  return (
    <>
      <div className="fin-filter-strip">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            className={`fin-filter-pill${filter === f.value ? " fin-filter-pill--active" : ""}`}
            onClick={() => setFilter(f.value)}
          >
            {f.label}
          </button>
        ))}
      </div>
      {visible.length === 0 ? (
        <div className="fin-empty">
          <p className="fin-empty__title">No transactions</p>
          <p className="fin-empty__sub">Nothing matching this filter yet.</p>
        </div>
      ) : (
        <table className="fin-table">
          <thead className="fin-table-head">
            <tr>
              <th>Date</th>
              <th>Description</th>
              <th>Type</th>
              <th>Amount</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {visible.map((tx) => (
              <tr key={tx.id} className="fin-table__row">
                <td className="fin-table__date">{fmtDate(tx.date)}</td>
                <td className="fin-table__desc">{tx.description}</td>
                <td className="fin-table__type">{TX_TYPE_LABEL[tx.type]}</td>
                <td
                  className={`fin-table__amount ${tx.amount >= 0 ? "fin-table__amount--credit" : "fin-table__amount--debit"}`}
                >
                  {tx.amount >= 0 ? "+" : "−"}
                  {usd(tx.amount)}
                </td>
                <td className="fin-table__status">
                  <StatusBadge status={tx.status}>
                    {tx.status.toUpperCase()}
                  </StatusBadge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
}

function Invoices({ invoices }: { invoices: Invoice[] }) {
  const [filter, setFilter] = useState<"all" | "paid" | "pending" | "failed">(
    "all",
  );
  const visible = useMemo(
    () =>
      filter === "all" ? invoices : invoices.filter((i) => i.status === filter),
    [invoices, filter],
  );
  const STATUS_FILTERS = [
    { value: "all" as const, label: "All" },
    { value: "pending" as const, label: "Pending" },
    { value: "paid" as const, label: "Paid" },
    { value: "failed" as const, label: "Failed" },
  ];
  return (
    <>
      <div className="fin-filter-strip">
        {STATUS_FILTERS.map((f) => (
          <button
            key={f.value}
            className={`fin-filter-pill${filter === f.value ? " fin-filter-pill--active" : ""}`}
            onClick={() => setFilter(f.value)}
          >
            {f.label}
          </button>
        ))}
      </div>
      {visible.length === 0 ? (
        <div className="fin-empty">
          <p className="fin-empty__title">No invoices</p>
          <p className="fin-empty__sub">
            Invoices will appear here after your first billing cycle.
          </p>
        </div>
      ) : (
        <table className="fin-table">
          <thead className="fin-table-head">
            <tr>
              <th>Period</th>
              <th>Invoice</th>
              <th>Due</th>
              <th>Amount</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {visible.map((inv) => (
              <tr key={inv.id} className="fin-table__row">
                <td className="fin-table__desc">{inv.period}</td>
                <td className="fin-invoice-ref">{inv.id.toUpperCase()}</td>
                <td className="fin-table__date">{fmtDate(inv.due_date)}</td>
                <td className="fin-table__amount fin-table__amount--debit">
                  {usd(inv.amount)}
                </td>
                <td className="fin-table__status">
                  <StatusBadge
                    status={
                      inv.status === "paid"
                        ? "resolved"
                        : inv.status === "failed"
                          ? "closed"
                          : "pending"
                    }
                  >
                    {inv.status.toUpperCase()}
                  </StatusBadge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
}

function Methods({ methods }: { methods: PaymentMethod[] }) {
  return (
    <>
      <div className="fin-topup-banner">
        <p className="fin-topup-banner__copy">
          Add a card to fund your Push wallet. Campaigns draw from your balance
          automatically. <strong>Stripe-secured.</strong>
        </p>
        <button className="btn btn-secondary" style={{ whiteSpace: "nowrap" }}>
          Top up wallet
        </button>
      </div>
      <div className="fin-methods">
        {methods.map((m) => (
          <div
            key={m.id}
            className={`fin-method-card${m.isDefault ? " fin-method-card--default" : ""}`}
          >
            {m.isDefault && (
              <span className="fin-method__default-badge">Default</span>
            )}
            <span className="fin-method__brand">{m.brand}</span>
            <span className="fin-method__num">•••• {m.last4}</span>
            <span className="fin-method__meta">Expires {m.expiry}</span>
          </div>
        ))}
        <button className="fin-add-method" onClick={() => {}}>
          + Add payment method
        </button>
      </div>
    </>
  );
}

// ── Main component ─────────────────────────────────────────────────────────

type FinTab = "overview" | "transactions" | "invoices" | "methods";

const TABS: { value: FinTab; label: string }[] = [
  { value: "overview", label: "Overview" },
  { value: "transactions", label: "Transactions" },
  { value: "invoices", label: "Invoices" },
  { value: "methods", label: "Methods" },
];

export default function FinancePageClient({
  balance = 224000,
  mtdSpend = 64000,
  lifetimeSpend = 3228000,
  transactions = MOCK_TXS,
  invoices = MOCK_INVOICES,
  paymentMethods = MOCK_METHODS,
}: Partial<FinancePageClientProps>) {
  const [activeTab, setActiveTab] = useState<FinTab>("overview");

  return (
    <div className="fin-hub">
      {/* Hero */}
      <header className="fin-hero">
        <div className="fin-hero__left">
          <p className="fin-hero__eyebrow">Finance · wallet &amp; billing</p>
          <h1 className="fin-hero__title">Finance</h1>
          <p className="fin-hero__sub">
            {usd(balance)} available · {usd(mtdSpend)} spent this month
          </p>
        </div>
        <button className="btn btn-secondary">Top up wallet</button>
      </header>

      {/* Wallet KPI strip */}
      <div className="fin-wallet">
        <div className="fin-wallet__card fin-wallet__card--hero">
          <span className="fin-wallet__label">Wallet balance</span>
          <span className="fin-wallet__amount">{usd(balance)}</span>
          <span className="fin-wallet__delta">Available to spend</span>
        </div>
        <div className="fin-wallet__card">
          <span className="fin-wallet__label">MTD spend</span>
          <span className="fin-wallet__amount">{usd(mtdSpend)}</span>
          <span className="fin-wallet__meta">This billing cycle</span>
        </div>
        <div className="fin-wallet__card">
          <span className="fin-wallet__label">Lifetime spend</span>
          <span className="fin-wallet__amount">{usd(lifetimeSpend)}</span>
          <span className="fin-wallet__meta">All campaigns</span>
        </div>
      </div>

      {/* Tab nav */}
      <div className="fin-tabs" role="tablist">
        {TABS.map((t) => (
          <button
            key={t.value}
            role="tab"
            aria-selected={activeTab === t.value}
            className={`fin-tab${activeTab === t.value ? " fin-tab--active" : ""}`}
            onClick={() => setActiveTab(t.value)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === "overview" && (
        <Overview txs={transactions} methods={paymentMethods} />
      )}
      {activeTab === "transactions" && <Transactions txs={transactions} />}
      {activeTab === "invoices" && <Invoices invoices={invoices} />}
      {activeTab === "methods" && <Methods methods={paymentMethods} />}
    </div>
  );
}
