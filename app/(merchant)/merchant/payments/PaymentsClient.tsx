"use client";

import { useMemo, useState } from "react";
import type { Payment } from "@/lib/data/types";
import {
  EmptyState,
  FilterTabs,
  KPICard,
  Modal,
  PageHeader,
  StatusBadge,
} from "@/components/merchant/shared";
import { useToast } from "@/components/toast/Toaster";
import { Sparkline } from "@/components/charts/Sparkline";
import "./payments.css";

// Mock 30-day curves: balance trends down as charges hit, MTD spend grows,
// pending-auths waver. Pure illustrative data for the hero band.
const PAY_BALANCE_30D = [
  5200, 5120, 5040, 4960, 4880, 4800, 4720, 4640, 4520, 4400, 4280, 4160, 4040,
  3920, 3800, 3680, 3560, 3440, 3320, 3200, 3080, 2960, 2840, 2720, 2600, 2480,
  2360, 2240, 2120, 2000,
];
const PAY_MTD_30D = [
  40, 90, 150, 210, 280, 360, 440, 520, 610, 700, 790, 880, 970, 1060, 1160,
  1260, 1360, 1460, 1560, 1660, 1760, 1860, 1960, 2070, 2180, 2290, 2400, 2510,
  2620, 2740,
];
const PAY_PENDING_30D = [
  120, 180, 140, 220, 260, 200, 280, 320, 240, 300, 360, 280, 220, 290, 350,
  410, 340, 280, 360, 420, 380, 320, 400, 460, 380, 300, 360, 420, 380, 340,
];

type PaymentBrand = "visa" | "mastercard" | "amex";
type TransactionType = "topup" | "campaign-charge" | "refund" | "adjustment";
type TransactionFilter = TransactionType | "all";

interface PaymentMethod {
  id: string;
  brand: PaymentBrand;
  brandLabel: string;
  last4: string;
  expiry: string;
  isDefault: boolean;
}

interface TransactionItem {
  id: string;
  date: string;
  type: TransactionType;
  description: string;
  amount: number;
  status: "pending" | "resolved" | "closed" | "active";
}

const TOP_UP_PRESETS = [500, 1000, 2500, 5000];

const PAYMENT_METHODS: PaymentMethod[] = [
  {
    id: "pm-001",
    brand: "visa",
    brandLabel: "Visa",
    last4: "4242",
    expiry: "04/28",
    isDefault: true,
  },
  {
    id: "pm-002",
    brand: "mastercard",
    brandLabel: "Mastercard",
    last4: "5454",
    expiry: "11/27",
    isDefault: false,
  },
  {
    id: "pm-003",
    brand: "amex",
    brandLabel: "Amex",
    last4: "3005",
    expiry: "09/29",
    isDefault: false,
  },
];

function formatMoney(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(value);
}

function formatDate(value: string): string {
  return new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatTransactionType(value: TransactionType): string {
  if (value === "topup") return "Top up";
  if (value === "campaign-charge") return "Campaign charge";
  if (value === "refund") return "Refund";
  return "Adjustment";
}

function mapPaymentStatus(
  status: Payment["status"],
): TransactionItem["status"] {
  if (status === "pending") return "pending";
  if (status === "processing") return "active";
  if (status === "paid") return "resolved";
  return "closed";
}

const TRANSACTION_KINDS: readonly TransactionType[] = [
  "topup",
  "campaign-charge",
  "refund",
  "adjustment",
];

function isTransactionKind(value: unknown): value is TransactionType {
  return (
    typeof value === "string" &&
    (TRANSACTION_KINDS as readonly string[]).includes(value)
  );
}

function mapPayments(payments: Payment[]): TransactionItem[] {
  return payments.map((payment) => {
    // Demo data tags the kind via `milestone_id` (see lib/data/mock-payments.ts).
    // Real Stripe-backed rows fall back to "campaign-charge".
    const taggedKind = isTransactionKind(payment.milestone_id)
      ? payment.milestone_id
      : "campaign-charge";

    // Preserve sign for top-ups and adjustment credits; clamp legacy rows
    // (which only stored magnitude) to negative for charges/refunds.
    const dollars = payment.amount / 100;
    const signedAmount =
      taggedKind === "topup" || taggedKind === "adjustment"
        ? dollars
        : -Math.abs(dollars);

    return {
      id: payment.id,
      date: payment.paid_at ?? payment.created_at,
      type: taggedKind,
      description:
        (payment as Payment & { description?: string }).description ??
        `Creator payout${payment.campaign_id ? ` — ${payment.campaign_id}` : ""}`,
      amount: signedAmount,
      status: mapPaymentStatus(payment.status),
    };
  });
}

function CardBrandIcon({ brand }: { brand: PaymentBrand }) {
  if (brand === "visa") {
    return (
      <svg viewBox="0 0 64 24" aria-hidden="true" className="pay-method-logo">
        <path d="M4 5h10L9 19H0L4 5Z" className="pay-method-logo-fill" />
        <path d="M16 5h10L21 19H11l5-14Z" className="pay-method-logo-fill" />
        <path d="M29 5h8l-5 14h-8l5-14Z" className="pay-method-logo-fill" />
        <path
          d="M44 5h8c5 0 8 2 8 6 0 5-4 8-10 8h-7l1-4h7c2 0 3-1 3-2s-1-2-3-2h-6l-1 4h-6l2-10Z"
          className="pay-method-logo-fill"
        />
      </svg>
    );
  }

  if (brand === "mastercard") {
    return (
      <svg viewBox="0 0 64 24" aria-hidden="true" className="pay-method-logo">
        <circle cx="24" cy="12" r="8" className="pay-method-logo-fill" />
        <circle cx="36" cy="12" r="8" className="pay-method-logo-stroke" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 64 24" aria-hidden="true" className="pay-method-logo">
      <rect
        x="8"
        y="4"
        width="20"
        height="16"
        className="pay-method-logo-fill"
      />
      <rect
        x="30"
        y="4"
        width="26"
        height="16"
        className="pay-method-logo-stroke"
      />
    </svg>
  );
}

export default function PaymentsClient({
  initialPayments,
}: {
  initialPayments: Payment[];
}) {
  const { toast } = useToast();
  const [methods, setMethods] = useState(PAYMENT_METHODS);
  const [activeFilter, setActiveFilter] = useState<TransactionFilter>("all");
  const [isTopUpOpen, setIsTopUpOpen] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState<number>(
    TOP_UP_PRESETS[1],
  );
  const [customAmount, setCustomAmount] = useState("");
  const [selectedMethodId, setSelectedMethodId] = useState(
    PAYMENT_METHODS[0]?.id ?? "",
  );

  const transactions = useMemo(
    () => mapPayments(initialPayments),
    [initialPayments],
  );
  const currentBalance = transactions.reduce(
    (sum, transaction) => sum + transaction.amount,
    0,
  );
  const monthToDateSpend = transactions
    .filter((transaction) => transaction.amount < 0)
    .reduce((sum, transaction) => sum + Math.abs(transaction.amount), 0);
  const pendingAuthorizations = transactions
    .filter(
      (transaction) =>
        transaction.status === "pending" || transaction.status === "active",
    )
    .reduce((sum, transaction) => sum + Math.abs(transaction.amount), 0);

  const topUpAmount = customAmount ? Number(customAmount) || 0 : selectedPreset;
  const processingFee = topUpAmount > 0 ? topUpAmount * 0.029 + 0.3 : 0;
  const totalCharge = topUpAmount + processingFee;

  const filteredTransactions = useMemo(() => {
    if (activeFilter === "all") return transactions;
    return transactions.filter(
      (transaction) => transaction.type === activeFilter,
    );
  }, [activeFilter, transactions]);

  const tabs = useMemo(
    () => [
      { value: "all", label: "All", count: transactions.length },
      {
        value: "topup",
        label: "Top up",
        count: transactions.filter(
          (transaction) => transaction.type === "topup",
        ).length,
      },
      {
        value: "campaign-charge",
        label: "Campaign charge",
        count: transactions.filter(
          (transaction) => transaction.type === "campaign-charge",
        ).length,
      },
      {
        value: "refund",
        label: "Refund",
        count: transactions.filter(
          (transaction) => transaction.type === "refund",
        ).length,
      },
      {
        value: "adjustment",
        label: "Adjustment",
        count: transactions.filter(
          (transaction) => transaction.type === "adjustment",
        ).length,
      },
    ],
    [transactions],
  );

  function openTopUp() {
    setIsTopUpOpen(true);
  }

  function closeTopUp() {
    setIsTopUpOpen(false);
  }

  function setDefaultMethod(methodId: string) {
    const target = methods.find((m) => m.id === methodId);
    setMethods((prev) =>
      prev.map((method) => ({
        ...method,
        isDefault: method.id === methodId,
      })),
    );
    setSelectedMethodId(methodId);
    if (target) {
      toast.success(`${target.brandLabel} •••• ${target.last4} is now default`);
    }
  }

  function removeMethod(methodId: string) {
    const target = methods.find((m) => m.id === methodId);
    setMethods((prev) => {
      const remaining = prev.filter((method) => method.id !== methodId);
      if (!remaining.length) return prev;
      if (!remaining.some((method) => method.isDefault)) {
        remaining[0] = { ...remaining[0], isDefault: true };
      }
      if (!remaining.some((method) => method.id === selectedMethodId)) {
        setSelectedMethodId(remaining[0].id);
      }
      return remaining;
    });
    if (target) {
      toast.info(`${target.brandLabel} •••• ${target.last4} removed`);
    }
  }

  function handleConfirmCharge() {
    if (topUpAmount <= 0 || !selectedMethodId) return;
    const method = methods.find((m) => m.id === selectedMethodId);
    toast.success(`Charged ${formatMoney(totalCharge)}`, {
      body: `${method?.brandLabel ?? "Method"} •••• ${method?.last4 ?? "—"}`,
    });
    setCustomAmount("");
    setIsTopUpOpen(false);
  }

  function handleTransactionClick(transaction: TransactionItem) {
    toast.info(
      `${formatTransactionType(transaction.type)} · ${transaction.id}`,
      {
        body: `${transaction.amount >= 0 ? "+" : "-"}${formatMoney(Math.abs(transaction.amount))}`,
      },
    );
  }

  function handleAddMethod() {
    toast.info("New payment method form coming soon");
  }

  const topUpFooter = (
    <div className="pay-modal-footer-actions">
      <button
        type="button"
        className="btn btn-ghost pay-btn"
        onClick={closeTopUp}
      >
        Cancel
      </button>
      <button
        type="button"
        className="btn btn-primary pay-btn"
        disabled={topUpAmount <= 0 || !selectedMethodId}
        onClick={handleConfirmCharge}
      >
        Charge {formatMoney(totalCharge)}
      </button>
    </div>
  );

  return (
    <section className="pay-page">
      <PageHeader
        eyebrow="PAYMENTS"
        title="Payments & Wallet"
        subtitle="Fund your campaigns, manage payment methods, review transaction history."
        action={
          <button type="button" className="btn btn-primary" onClick={openTopUp}>
            Top Up Balance
          </button>
        }
      />

      <div className="pay-kpi-grid">
        <article
          className="pay-hero-tile"
          aria-label={`Current balance ${formatMoney(currentBalance)}`}
        >
          <p className="pay-hero-tile__eyebrow">CURRENT BALANCE</p>
          <p className="pay-hero-tile__numeral">
            {formatMoney(currentBalance)}
          </p>
          <p className="pay-hero-tile__caption">Available to fund campaigns</p>
          <Sparkline
            data={PAY_BALANCE_30D}
            width={220}
            height={36}
            trend="auto"
            showArea
            showLastDot
            className="pay-hero-tile__spark"
          />
        </article>
        <KPICard
          label="MTD Spend"
          value={formatMoney(monthToDateSpend)}
          delay={100}
          sparkline={PAY_MTD_30D}
        />
        <KPICard
          label="Pending Authorizations"
          value={formatMoney(pendingAuthorizations)}
          delay={160}
          sparkline={PAY_PENDING_30D}
        />
      </div>

      <div className="pay-section-gap-sm" />

      <section className="pay-section">
        <p className="pay-eyebrow">METHODS</p>
        <h2 className="pay-title">Payment methods</h2>
        <div className="pay-method-grid">
          {methods.map((method) => (
            <article key={method.id} className="pay-method-card">
              <div className="pay-method-header">
                <CardBrandIcon brand={method.brand} />
                {method.isDefault ? (
                  <span className="pay-method-default">Default</span>
                ) : null}
              </div>
              <p className="pay-method-brand">{method.brandLabel}</p>
              <p className="pay-method-meta">•••• {method.last4}</p>
              <p className="pay-method-meta">Expires {method.expiry}</p>
              <div className="pay-method-actions">
                <button
                  type="button"
                  className="pay-link-btn"
                  onClick={() => removeMethod(method.id)}
                  disabled={methods.length <= 1}
                >
                  Remove
                </button>
                {!method.isDefault ? (
                  <button
                    type="button"
                    className="pay-link-btn"
                    onClick={() => setDefaultMethod(method.id)}
                  >
                    Set default
                  </button>
                ) : null}
              </div>
            </article>
          ))}
          <button
            type="button"
            className="pay-method-add"
            onClick={handleAddMethod}
          >
            + Add payment method
          </button>
        </div>
      </section>

      <div className="pay-section-gap-lg" />

      <section className="pay-section">
        <p className="pay-eyebrow">HISTORY</p>
        <h2 className="pay-title">Recent transactions</h2>
        <div className="pay-history-controls">
          <FilterTabs
            tabs={tabs}
            value={activeFilter}
            onChange={(value) => setActiveFilter(value as TransactionFilter)}
          />
        </div>

        {filteredTransactions.length ? (
          <div
            className="pay-history-table"
            role="table"
            aria-label="Recent transactions"
          >
            <div className="pay-history-head" role="row">
              <span>Date</span>
              <span>Type</span>
              <span>Description</span>
              <span className="pay-amount-head">Amount</span>
              <span>Status</span>
            </div>
            {filteredTransactions.map((transaction) => (
              <div
                key={transaction.id}
                className="pay-history-row"
                role="row"
                tabIndex={0}
                onClick={() => handleTransactionClick(transaction)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    handleTransactionClick(transaction);
                  }
                }}
                style={{ cursor: "pointer" }}
                aria-label={`View transaction ${transaction.id}`}
              >
                <span>{formatDate(transaction.date)}</span>
                <span>{formatTransactionType(transaction.type)}</span>
                <span>{transaction.description}</span>
                <span
                  className={[
                    "pay-amount",
                    transaction.amount >= 0
                      ? "pay-amount-positive"
                      : "pay-amount-negative",
                  ].join(" ")}
                >
                  {transaction.amount >= 0 ? "+" : "-"}
                  {formatMoney(Math.abs(transaction.amount))}
                </span>
                <span>
                  <StatusBadge status={transaction.status} />
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="pay-empty-wrap">
            {(() => {
              if (transactions.length === 0) {
                return (
                  <EmptyState
                    artKind="transactions"
                    title="No transactions yet"
                    description="Top-ups, campaign charges, refunds, and adjustments all post here as they happen. Top up your wallet to start spending against live campaigns."
                    ctaLabel="Top up balance"
                    ctaOnClick={openTopUp}
                  />
                );
              }
              if (activeFilter === "topup") {
                return (
                  <EmptyState
                    artKind="filter"
                    artVariant="muted"
                    title="No top-ups in this view"
                    description="You haven't topped up your wallet yet. Add funds to keep campaigns running without interruption."
                    ctaLabel="Top up balance"
                    ctaOnClick={openTopUp}
                  />
                );
              }
              if (activeFilter === "campaign-charge") {
                return (
                  <EmptyState
                    artKind="filter"
                    artVariant="muted"
                    title="No campaign charges yet"
                    description="Charges post here each time a verified scan converts. Reset to see your full transaction history."
                    ctaLabel="Show all transactions"
                    ctaOnClick={() => setActiveFilter("all")}
                  />
                );
              }
              if (activeFilter === "refund") {
                return (
                  <EmptyState
                    artKind="filter"
                    artVariant="muted"
                    title="No refunds on file"
                    description="Refunds appear here when a charge is reversed. A clean record is a good sign."
                    ctaLabel="Show all transactions"
                    ctaOnClick={() => setActiveFilter("all")}
                  />
                );
              }
              if (activeFilter === "adjustment") {
                return (
                  <EmptyState
                    artKind="filter"
                    artVariant="muted"
                    title="No adjustments yet"
                    description="Manual credits and corrections from Push ops appear here. Empty means your ledger is in sync."
                    ctaLabel="Show all transactions"
                    ctaOnClick={() => setActiveFilter("all")}
                  />
                );
              }
              return (
                <EmptyState
                  artKind="filter"
                  artVariant="muted"
                  title="Nothing in this view"
                  description="No transactions match the current filter. Reset to see your full ledger."
                  ctaLabel="Show all transactions"
                  ctaOnClick={() => setActiveFilter("all")}
                />
              );
            })()}
          </div>
        )}
      </section>

      <div className="pay-modal-shell">
        <Modal
          open={isTopUpOpen}
          onClose={closeTopUp}
          title="Top Up Balance"
          size="md"
          footer={topUpFooter}
        >
          <div className="pay-topup-content">
            <div>
              <p className="pay-form-label">Preset amount</p>
              <div className="pay-preset-grid">
                {TOP_UP_PRESETS.map((preset) => {
                  const isActive = !customAmount && preset === selectedPreset;
                  return (
                    <button
                      key={preset}
                      type="button"
                      className={[
                        "pay-preset-btn",
                        isActive ? "pay-preset-btn-active" : "",
                      ]
                        .filter(Boolean)
                        .join(" ")}
                      onClick={() => {
                        setSelectedPreset(preset);
                        setCustomAmount("");
                      }}
                    >
                      {formatMoney(preset)}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label htmlFor="pay-custom-amount" className="pay-form-label">
                Custom amount
              </label>
              <input
                id="pay-custom-amount"
                type="number"
                min={0}
                step={1}
                className="pay-input"
                value={customAmount}
                onChange={(event) => setCustomAmount(event.target.value)}
                placeholder="Enter amount"
              />
            </div>

            <div>
              <label htmlFor="pay-method-select" className="pay-form-label">
                Charge method
              </label>
              <select
                id="pay-method-select"
                className="pay-input"
                value={selectedMethodId}
                onChange={(event) => setSelectedMethodId(event.target.value)}
              >
                {methods.map((method) => (
                  <option key={method.id} value={method.id}>
                    {method.brandLabel} •••• {method.last4}
                    {method.isDefault ? " (Default)" : ""}
                  </option>
                ))}
              </select>
            </div>

            <div className="pay-fee-box">
              <p className="pay-fee-row">
                <span>Top-up</span>
                <strong>{formatMoney(topUpAmount)}</strong>
              </p>
              <p className="pay-fee-row">
                <span>Processing fee</span>
                <strong>{formatMoney(processingFee)}</strong>
              </p>
              <p className="pay-fee-total">
                <span>Total charge</span>
                <strong>{formatMoney(totalCharge)}</strong>
              </p>
              <div className="pay-fee-bar-track">
                <span
                  className="pay-fee-bar-fill"
                  style={{
                    width: `${Math.min(100, (processingFee / Math.max(totalCharge, 1)) * 100)}%`,
                  }}
                />
              </div>
            </div>

            <button
              type="button"
              className="btn btn-primary pay-confirm-btn"
              disabled={topUpAmount <= 0 || !selectedMethodId}
              onClick={handleConfirmCharge}
            >
              Confirm amount
            </button>
          </div>
        </Modal>
      </div>
    </section>
  );
}
