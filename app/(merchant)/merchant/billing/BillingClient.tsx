"use client";

import { useMemo, useState, type FormEvent } from "react";
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
import { api, type Invoice, type PaymentMethod } from "@/lib/data/api-client";
import "./billing.css";

// Mock 30-day series for the wallet balance hero + the two stat tiles.
// Real ledger curves wire up later; values here are illustrative only.
const BILLING_WALLET_SPEND_30D = [
  120, 180, 240, 320, 380, 460, 510, 590, 660, 720, 800, 880, 960, 1040, 1130,
  1210, 1300, 1390, 1480, 1570, 1660, 1750, 1840, 1930, 2020, 2110, 2200, 2300,
  2400, 2510,
];
const BILLING_BALANCE_30D = [
  4800, 4720, 4630, 4520, 4380, 4250, 4180, 4090, 4010, 4250, 4180, 4060, 3950,
  3820, 3700, 3950, 3820, 3690, 3540, 3410, 3280, 3160, 3040, 2920, 2810, 2700,
  2580, 2460, 2350, 2240,
];
const BILLING_LIFETIME_30D = [
  18000, 18420, 18840, 19260, 19720, 20150, 20620, 21080, 21560, 22040, 22510,
  22990, 23480, 23960, 24450, 24940, 25430, 25940, 26450, 26960, 27470, 27990,
  28510, 29040, 29560, 30100, 30640, 31170, 31720, 32280,
];

type InvoiceFilter = "all" | "paid" | "pending" | "failed";

type WalletStats = {
  current_balance_cents: number;
  month_to_date_spend_cents: number;
  lifetime_spend_cents: number;
  lifetime_campaigns: number;
};

type BillingClientProps = {
  initialInvoices: Invoice[];
  initialPaymentMethods: PaymentMethod[];
  // Optional aggregate stats used when the page is in demo / fixture mode.
  // When null the live ledger (initialInvoices) is the only source for KPIs.
  walletStats?: WalletStats | null;
};

const INVOICE_TABS = [
  { value: "all", label: "ALL" },
  { value: "paid", label: "PAID" },
  { value: "pending", label: "PENDING" },
  { value: "failed", label: "FAILED" },
] as const;

const CARD_BRANDS = ["VISA", "MASTERCARD", "AMEX", "DISCOVER"] as const;

function formatCurrency(cents: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(cents / 100);
}

function formatDate(value: string | null): string {
  if (!value) {
    return "—";
  }

  return new Date(value)
    .toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    })
    .toUpperCase();
}

function normalizeInvoiceStatus(status: string): InvoiceFilter {
  const value = status.toLowerCase();

  if (value === "paid") {
    return "paid";
  }

  if (value === "pending") {
    return "pending";
  }

  if (value === "failed") {
    return "failed";
  }

  return "pending";
}

// Map raw invoice status → StatusBadge variant.
// Discipline: never use red for "failed" on a money page — closed/neutral
// reads as "needs attention" without inducing panic. Brand red is reserved
// for the primary CTA ("Pay now") only.
function toBadgeStatus(
  status: string,
): "active" | "pending" | "closed" | "paused" {
  const value = status.toLowerCase();

  if (value === "paid") {
    return "active";
  }

  if (value === "pending") {
    return "pending";
  }

  if (value === "failed") {
    return "closed";
  }

  return "paused";
}

export default function BillingClient({
  initialInvoices,
  initialPaymentMethods,
  walletStats = null,
}: BillingClientProps) {
  const { toast } = useToast();
  const [invoiceFilter, setInvoiceFilter] = useState<InvoiceFilter>("all");
  const [paymentMethods, setPaymentMethods] = useState(initialPaymentMethods);
  const [paidInvoiceIds, setPaidInvoiceIds] = useState<Set<string>>(new Set());
  const [topUpOpen, setTopUpOpen] = useState(false);
  const [addMethodOpen, setAddMethodOpen] = useState(false);
  const [topUpAmount, setTopUpAmount] = useState("");
  const [topUpError, setTopUpError] = useState("");
  const [topUpSubmitting, setTopUpSubmitting] = useState(false);
  const [brand, setBrand] = useState<(typeof CARD_BRANDS)[number]>("VISA");
  const [lastFour, setLastFour] = useState("");
  const [methodError, setMethodError] = useState("");
  const [methodSubmitting, setMethodSubmitting] = useState(false);

  function handlePayInvoice(invoiceId: string, amountCents: number) {
    setPaidInvoiceIds((prev) => {
      const next = new Set(prev);
      next.add(invoiceId);
      return next;
    });
    toast.success(`Invoice ${invoiceId} paid`, {
      body: `${formatCurrency(amountCents)} settled (playtest)`,
    });
  }

  function handleDownloadInvoice(invoiceId: string) {
    toast.info(`Downloading ${invoiceId}.pdf`, {
      body: "Playtest mode — no real file generated.",
    });
  }

  const filteredInvoices = useMemo(() => {
    if (invoiceFilter === "all") {
      return initialInvoices;
    }

    return initialInvoices.filter(
      (invoice) => normalizeInvoiceStatus(invoice.status) === invoiceFilter,
    );
  }, [initialInvoices, invoiceFilter]);

  const invoiceCounts = useMemo(
    () => ({
      all: initialInvoices.length,
      paid: initialInvoices.filter(
        (invoice) => normalizeInvoiceStatus(invoice.status) === "paid",
      ).length,
      pending: initialInvoices.filter(
        (invoice) => normalizeInvoiceStatus(invoice.status) === "pending",
      ).length,
      failed: initialInvoices.filter(
        (invoice) => normalizeInvoiceStatus(invoice.status) === "failed",
      ).length,
    }),
    [initialInvoices],
  );

  const tabs = useMemo(
    () =>
      INVOICE_TABS.map((tab) => ({
        ...tab,
        count: invoiceCounts[tab.value],
      })),
    [invoiceCounts],
  );

  const thisMonthDue = useMemo(() => {
    if (walletStats) {
      return walletStats.month_to_date_spend_cents;
    }

    const now = new Date();

    return initialInvoices.reduce((sum, invoice) => {
      if (normalizeInvoiceStatus(invoice.status) !== "pending") {
        return sum;
      }
      const issuedAt = new Date(invoice.issued_at);
      if (
        issuedAt.getFullYear() !== now.getFullYear() ||
        issuedAt.getMonth() !== now.getMonth()
      ) {
        return sum;
      }
      return sum + invoice.total_cents;
    }, 0);
  }, [initialInvoices, walletStats]);

  const lifetimeSpend = useMemo(() => {
    if (walletStats) {
      return walletStats.lifetime_spend_cents;
    }

    return initialInvoices.reduce((sum, invoice) => {
      if (normalizeInvoiceStatus(invoice.status) === "paid") {
        return sum + invoice.total_cents;
      }
      return sum;
    }, 0);
  }, [initialInvoices, walletStats]);

  const pendingCount = invoiceCounts.pending;

  async function handleTopUpSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setTopUpError("");

    const parsedAmount = Number.parseFloat(topUpAmount);
    const amountCents = Math.round(parsedAmount * 100);

    if (!Number.isFinite(parsedAmount) || amountCents <= 0) {
      setTopUpError("Enter a positive amount.");
      return;
    }

    setTopUpSubmitting(true);

    try {
      const result = await api.merchant.billing.topup(amountCents);

      if (!result.ok) {
        throw new Error(result.error);
      }

      setTopUpAmount("");
      setTopUpOpen(false);
      toast.success(`Wallet topped up · ${formatCurrency(amountCents)}`);
    } catch (error) {
      setTopUpError(error instanceof Error ? error.message : "Top up failed.");
    } finally {
      setTopUpSubmitting(false);
    }
  }

  async function handleAddMethodSubmit(event: FormEvent<HTMLFormElement>) {
    // TODO: Stripe integration — currently only stores metadata
    event.preventDefault();
    setMethodError("");

    if (!/^\d{4}$/.test(lastFour)) {
      setMethodError("Enter exactly four digits.");
      return;
    }

    setMethodSubmitting(true);

    try {
      const result = await api.merchant.billing.addPaymentMethod({
        brand,
        last_four: lastFour,
      });

      if (!result.ok) {
        throw new Error(result.error);
      }

      setPaymentMethods((current) => [result.data, ...current]);
      setLastFour("");
      setBrand("VISA");
      setAddMethodOpen(false);
      toast.success(`${brand} •••• ${lastFour} added`);
    } catch (error) {
      setMethodError(
        error instanceof Error ? error.message : "Method save failed.",
      );
    } finally {
      setMethodSubmitting(false);
    }
  }

  return (
    <section className="bill-page">
      <PageHeader
        title="BILLING"
        subtitle="WALLET, INVOICES, PAYMENT METHODS"
        action={
          <button
            type="button"
            className="btn-primary"
            onClick={() => setTopUpOpen(true)}
          >
            TOP UP
          </button>
        }
      />

      <section className="bill-kpis" aria-label="Billing overview">
        {/* Single liquid-glass tile per page — anchors the most-actionable
            number ("this month due"). All other KPIs use the standard card. */}
        <article
          className="bill-hero-tile"
          aria-label={`This month due: ${formatCurrency(thisMonthDue)} across ${pendingCount} pending invoice${pendingCount === 1 ? "" : "s"}`}
        >
          <p className="bill-hero-tile__eyebrow">THIS MONTH DUE</p>
          <p className="bill-hero-tile__numeral">
            {formatCurrency(thisMonthDue)}
          </p>
          <p className="bill-hero-tile__caption">
            {pendingCount === 0
              ? "NOTHING PENDING"
              : `${pendingCount} PENDING INVOICE${pendingCount === 1 ? "" : "S"}`}
          </p>
          <Sparkline
            data={BILLING_WALLET_SPEND_30D}
            width={220}
            height={36}
            trend="auto"
            showArea
            showLastDot
            className="bill-hero-tile__spark"
          />
        </article>

        <KPICard
          label="WALLET BALANCE"
          value={
            walletStats
              ? formatCurrency(walletStats.current_balance_cents)
              : "—"
          }
          sparkline={BILLING_BALANCE_30D}
        />

        <div data-kpi="lifetime">
          <KPICard
            label="LIFETIME SPEND"
            value={formatCurrency(lifetimeSpend)}
            sparkline={BILLING_LIFETIME_30D}
          />
        </div>
      </section>

      <section
        className="bill-section"
        aria-labelledby="billing-invoices-title"
      >
        <div className="bill-section-head">
          <div>
            <p className="bill-eyebrow">LEDGER</p>
            <h2 id="billing-invoices-title" className="bill-section-title">
              INVOICES
            </h2>
          </div>
          <FilterTabs
            tabs={tabs}
            value={invoiceFilter}
            onChange={(value) => setInvoiceFilter(value as InvoiceFilter)}
          />
        </div>

        {filteredInvoices.length === 0 ? (
          <div className="bill-empty-wrap">
            {(() => {
              if (initialInvoices.length === 0) {
                return (
                  <EmptyState
                    title="No invoices yet"
                    description="Your billing history appears here as soon as your first campaign settles. You'll see issued date, amount, and status for every charge."
                    ctaLabel="Browse campaigns"
                    ctaHref="/merchant/campaigns"
                  />
                );
              }
              if (invoiceFilter === "paid") {
                return (
                  <EmptyState
                    title="No paid invoices yet"
                    description="Your first invoice settles after the first verified scan converts. Once paid, the receipt files here for your records."
                    ctaLabel="Browse campaigns"
                    ctaHref="/merchant/campaigns"
                  />
                );
              }
              if (invoiceFilter === "pending") {
                return (
                  <EmptyState
                    title="No pending invoices"
                    description="Nothing waiting on payment — your account is current. New invoices arrive on the first of each month."
                    ctaLabel="View paid invoices"
                    ctaOnClick={() => setInvoiceFilter("paid")}
                  />
                );
              }
              if (invoiceFilter === "failed") {
                return (
                  <EmptyState
                    title="No failed invoices"
                    description="Payments are running clean — no retries needed."
                  />
                );
              }
              return (
                <EmptyState
                  title="Nothing in this view"
                  description="No invoices match the current filter. Reset to see your full billing history."
                  ctaLabel="Show all invoices"
                  ctaOnClick={() => setInvoiceFilter("all")}
                />
              );
            })()}
          </div>
        ) : (
          <div className="bill-table-wrap">
            <table className="bill-table">
              <thead>
                <tr>
                  <th scope="col">INVOICE</th>
                  <th scope="col">ISSUED</th>
                  <th scope="col">DUE</th>
                  <th scope="col" className="bill-col-right">
                    TOTAL
                  </th>
                  <th scope="col">STATUS</th>
                  <th scope="col" className="bill-col-right">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredInvoices.map((invoice) => {
                  const isLocallyPaid = paidInvoiceIds.has(invoice.id);
                  const effectiveStatus = isLocallyPaid
                    ? "paid"
                    : invoice.status;
                  const normalized = normalizeInvoiceStatus(effectiveStatus);
                  return (
                    <tr key={invoice.id}>
                      <td className="bill-table-id">{invoice.id}</td>
                      <td>{formatDate(invoice.issued_at)}</td>
                      <td>{formatDate(invoice.due_at)}</td>
                      <td
                        className="bill-table-amount bill-col-right"
                        aria-label={`Total ${formatCurrency(invoice.total_cents)}`}
                      >
                        {formatCurrency(invoice.total_cents)}
                      </td>
                      <td>
                        <StatusBadge status={toBadgeStatus(effectiveStatus)}>
                          {effectiveStatus.toUpperCase()}
                        </StatusBadge>
                      </td>
                      <td className="bill-col-right">
                        <div className="bill-actions-cell">
                          {normalized === "pending" ? (
                            <button
                              type="button"
                              className="btn-primary bill-row-btn"
                              aria-label={`Pay invoice ${invoice.id}`}
                              onClick={() =>
                                handlePayInvoice(
                                  invoice.id,
                                  invoice.total_cents,
                                )
                              }
                            >
                              PAY NOW
                            </button>
                          ) : null}
                          <button
                            type="button"
                            className="btn-ghost bill-row-btn"
                            aria-label={`Download invoice ${invoice.id}`}
                            onClick={() => handleDownloadInvoice(invoice.id)}
                          >
                            DOWNLOAD
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="bill-section" aria-labelledby="billing-methods-title">
        <div className="bill-section-head">
          <div>
            <p className="bill-eyebrow">CHECKOUT</p>
            <h2 id="billing-methods-title" className="bill-section-title">
              PAYMENT METHODS
            </h2>
          </div>
          <button
            type="button"
            className="btn-secondary"
            onClick={() => setAddMethodOpen(true)}
          >
            ADD METHOD
          </button>
        </div>

        {paymentMethods.length === 0 ? (
          <div className="bill-empty-wrap">
            <EmptyState
              title="No payment methods on file"
              description="Add a card to settle invoices automatically the moment a campaign converts. You can add backups and rotate primary anytime."
              ctaLabel="Add payment method"
              ctaOnClick={() => setAddMethodOpen(true)}
            />
          </div>
        ) : (
          <div className="bill-method-list">
            {paymentMethods.map((method) => (
              <article key={method.id} className="bill-method-card">
                <div>
                  <p className="bill-method-brand">{method.brand}</p>
                  <p className="bill-method-meta">ENDING IN {method.last4}</p>
                </div>
                <div className="bill-method-side">
                  <p className="bill-method-meta">
                    {method.provider.toUpperCase()}
                  </p>
                  {method.is_default ? (
                    <StatusBadge status="active">DEFAULT</StatusBadge>
                  ) : null}
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <Modal
        open={topUpOpen}
        onClose={() => {
          setTopUpOpen(false);
          setTopUpError("");
        }}
        title="TOP UP WALLET"
        size="sm"
      >
        <form className="bill-form" onSubmit={handleTopUpSubmit}>
          <div className="form-field">
            <label htmlFor="topup-amount">AMOUNT (USD)</label>
            <input
              id="topup-amount"
              inputMode="decimal"
              min="0.01"
              step="0.01"
              type="number"
              value={topUpAmount}
              onChange={(event) => setTopUpAmount(event.target.value)}
              autoFocus
            />
            {topUpError ? (
              <p className="error-msg" role="alert">
                {topUpError}
              </p>
            ) : null}
          </div>
          <div className="bill-modal-actions">
            <button
              type="button"
              className="btn-ghost"
              onClick={() => setTopUpOpen(false)}
            >
              CANCEL
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={topUpSubmitting}
            >
              {topUpSubmitting ? "PROCESSING" : "TOP UP"}
            </button>
          </div>
        </form>
      </Modal>

      <Modal
        open={addMethodOpen}
        onClose={() => {
          setAddMethodOpen(false);
          setMethodError("");
        }}
        title="ADD PAYMENT METHOD"
        size="sm"
      >
        <form className="bill-form" onSubmit={handleAddMethodSubmit}>
          <div className="form-field">
            <label htmlFor="payment-brand">BRAND</label>
            <select
              id="payment-brand"
              value={brand}
              onChange={(event) =>
                setBrand(event.target.value as (typeof CARD_BRANDS)[number])
              }
            >
              {CARD_BRANDS.map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </div>
          <div className="form-field">
            <label htmlFor="payment-last-four">LAST FOUR</label>
            <input
              id="payment-last-four"
              inputMode="numeric"
              pattern="\d{4}"
              type="text"
              value={lastFour}
              onChange={(event) =>
                setLastFour(event.target.value.replace(/\D/g, "").slice(0, 4))
              }
              autoComplete="cc-number"
            />
            {methodError ? (
              <p className="error-msg" role="alert">
                {methodError}
              </p>
            ) : null}
          </div>
          <div className="bill-modal-actions">
            <button
              type="button"
              className="btn-ghost"
              onClick={() => setAddMethodOpen(false)}
            >
              CANCEL
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={methodSubmitting}
            >
              {methodSubmitting ? "SAVING" : "ADD METHOD"}
            </button>
          </div>
        </form>
      </Modal>
    </section>
  );
}
