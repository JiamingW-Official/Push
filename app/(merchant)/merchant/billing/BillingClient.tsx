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
import { api, type Invoice, type PaymentMethod } from "@/lib/data/api-client";
import "./billing.css";

type InvoiceFilter = "all" | "paid" | "pending" | "failed";

type BillingClientProps = {
  initialInvoices: Invoice[];
  initialPaymentMethods: PaymentMethod[];
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
}: BillingClientProps) {
  const [invoiceFilter, setInvoiceFilter] = useState<InvoiceFilter>("all");
  const [paymentMethods, setPaymentMethods] = useState(initialPaymentMethods);
  const [topUpOpen, setTopUpOpen] = useState(false);
  const [addMethodOpen, setAddMethodOpen] = useState(false);
  const [topUpAmount, setTopUpAmount] = useState("");
  const [topUpError, setTopUpError] = useState("");
  const [topUpSubmitting, setTopUpSubmitting] = useState(false);
  const [brand, setBrand] = useState<(typeof CARD_BRANDS)[number]>("VISA");
  const [lastFour, setLastFour] = useState("");
  const [methodError, setMethodError] = useState("");
  const [methodSubmitting, setMethodSubmitting] = useState(false);

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
  }, [initialInvoices]);

  const lifetimeSpend = useMemo(() => {
    return initialInvoices.reduce((sum, invoice) => {
      if (normalizeInvoiceStatus(invoice.status) === "paid") {
        return sum + invoice.total_cents;
      }
      return sum;
    }, 0);
  }, [initialInvoices]);

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
        </article>

        <KPICard label="WALLET BALANCE" value="—" />

        <div data-kpi="lifetime">
          <KPICard
            label="LIFETIME SPEND"
            value={formatCurrency(lifetimeSpend)}
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
            <EmptyState
              title="NO INVOICES YET"
              description="Your billing history will appear here once your first campaign settles."
            />
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
                  const normalized = normalizeInvoiceStatus(invoice.status);
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
                        <StatusBadge status={toBadgeStatus(invoice.status)}>
                          {invoice.status.toUpperCase()}
                        </StatusBadge>
                      </td>
                      <td className="bill-col-right">
                        <div className="bill-actions-cell">
                          {normalized === "pending" ? (
                            <button
                              type="button"
                              className="btn-primary bill-row-btn"
                              aria-label={`Pay invoice ${invoice.id}`}
                            >
                              PAY NOW
                            </button>
                          ) : null}
                          <button
                            type="button"
                            className="btn-ghost bill-row-btn"
                            aria-label={`Download invoice ${invoice.id}`}
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
              title="NO PAYMENT METHODS"
              description="Add a card to keep billing in sync with your campaigns."
              ctaLabel="ADD METHOD"
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
