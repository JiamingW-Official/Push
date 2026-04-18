"use client";

import { useState } from "react";
import "./billing.css";
import {
  MOCK_INVOICES,
  MOCK_SUBSCRIPTION,
  MOCK_PAYMENT_METHOD,
  MOCK_BILLING_ADDRESS,
  MOCK_TAX_INFO,
  PLANS,
  type PlanId,
  type Invoice,
} from "@/lib/billing/mock-invoices";

/* ── Helpers ─────────────────────────────────────────────────────── */
function formatCents(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function daysUntil(iso: string): number {
  const target = new Date(iso).getTime();
  const now = Date.now();
  return Math.max(0, Math.ceil((target - now) / 86400000));
}

/* ── Icons ───────────────────────────────────────────────────────── */
const IconReceipt = () => (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M3 1h10v13l-2-1.5L9 14l-1-1.5L7 14l-1.5-1.5L4 14l-1-1.5V1Z" />
    <line x1="5" y1="5" x2="11" y2="5" />
    <line x1="5" y1="8" x2="11" y2="8" />
    <line x1="5" y1="11" x2="8" y2="11" />
  </svg>
);

const IconCard = () => (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
    <rect x="1" y="3" width="14" height="10" />
    <line x1="1" y1="7" x2="15" y2="7" />
    <line x1="3" y1="10" x2="6" y2="10" />
  </svg>
);

const IconDownload = () => (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M8 2v8M5 7l3 3 3-3" />
    <path d="M2 12h12" />
  </svg>
);

const IconEdit = () => (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M11 2l3 3-8 8H3v-3l8-8Z" />
  </svg>
);

const IconChevronLeft = () => (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
    <polyline points="10,3 5,8 10,13" />
  </svg>
);

const IconCheck = () => (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="2,8 6,12 14,4" />
  </svg>
);

const IconWarning = () => (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M8 1L1 14h14L8 1Z" />
    <line x1="8" y1="6" x2="8" y2="9" />
    <circle cx="8" cy="12" r="0.5" fill="currentColor" />
  </svg>
);

/* ── Print-trigger: stub PDF download ────────────────────────────── */
function triggerPrintForInvoice(inv: Invoice) {
  // Inject invoice data into a hidden print container then call window.print()
  const el = document.getElementById("billing-print-frame");
  if (!el) return;

  el.innerHTML = `
    <div class="print-invoice">
      <div class="print-invoice__header">
        <div class="print-invoice__brand">Push.</div>
        <div class="print-invoice__meta">
          <div>${inv.number}</div>
          <div>${formatDate(inv.date)}</div>
        </div>
      </div>
      <div class="print-invoice__divider"></div>
      <div class="print-invoice__row">
        <span>Description</span>
        <span>Amount</span>
      </div>
      <div class="print-invoice__row print-invoice__row--body">
        <span>${inv.description}</span>
        <span>${formatCents(inv.amount_cents)}</span>
      </div>
      <div class="print-invoice__divider"></div>
      <div class="print-invoice__row print-invoice__row--total">
        <span>Total</span>
        <span>${formatCents(inv.amount_cents)}</span>
      </div>
      <div class="print-invoice__footer">
        Push Inc. · 284 W Broadway, New York, NY 10013 · billing@pushapp.co
      </div>
    </div>
  `;

  window.print();
}

/* ── StatusBadge ─────────────────────────────────────────────────── */
function InvoiceStatusBadge({ status }: { status: Invoice["status"] }) {
  const labels: Record<Invoice["status"], string> = {
    paid: "Paid",
    open: "Due",
    void: "Void",
    draft: "Draft",
  };
  return (
    <span className={`bill-badge bill-badge--${status}`}>{labels[status]}</span>
  );
}

/* ── Plan card labels ────────────────────────────────────────────── */
const PLAN_LABELS: Record<PlanId, string> = {
  starter: "Starter",
  growth: "Growth",
  pro: "Pro",
};

/* ── UpgradeModal ────────────────────────────────────────────────── */
const PLAN_ORDER: PlanId[] = ["starter", "growth", "pro"];

function UpgradeModal({
  currentPlan,
  onClose,
  onConfirm,
}: {
  currentPlan: PlanId;
  onClose: () => void;
  onConfirm: (plan: PlanId) => void;
}) {
  const [selected, setSelected] = useState<PlanId>(currentPlan);
  const [step, setStep] = useState<"select" | "confirm">("select");

  const currentCents = PLANS[currentPlan].price_cents;
  const newCents = PLANS[selected].price_cents;

  // Prorated charge for upgrading mid-cycle (approx 15 days remaining)
  const daysLeft = daysUntil(MOCK_SUBSCRIPTION.current_period_end);
  const daysInPeriod = 30;
  const proratedCents =
    selected !== currentPlan && newCents > currentCents
      ? Math.round(((newCents - currentCents) / daysInPeriod) * daysLeft)
      : 0;

  return (
    <div className="bill-modal-overlay" onClick={onClose}>
      <div
        className="bill-modal"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Change plan"
      >
        {step === "select" && (
          <>
            <div className="bill-modal__header">
              <div className="bill-modal__eyebrow">Subscription</div>
              <h2 className="bill-modal__title">Change Plan</h2>
            </div>

            <div className="bill-modal__plans">
              {PLAN_ORDER.map((planId) => {
                const plan = PLANS[planId];
                const isCurrent = planId === currentPlan;
                const isSelected = planId === selected;
                return (
                  <button
                    key={planId}
                    className={`bill-plan-option${isSelected ? " bill-plan-option--selected" : ""}${isCurrent ? " bill-plan-option--current" : ""}`}
                    onClick={() => setSelected(planId)}
                    disabled={isCurrent}
                  >
                    <div className="bill-plan-option__top">
                      <div className="bill-plan-option__name">{plan.name}</div>
                      {isCurrent && (
                        <span className="bill-plan-option__tag">Current</span>
                      )}
                      {isSelected && !isCurrent && (
                        <span className="bill-plan-option__check">
                          <IconCheck />
                        </span>
                      )}
                    </div>
                    <div className="bill-plan-option__price">
                      {formatCents(plan.price_cents)}
                      <span className="bill-plan-option__period">/mo</span>
                    </div>
                    <ul className="bill-plan-option__features">
                      {plan.features.map((f) => (
                        <li key={f}>{f}</li>
                      ))}
                    </ul>
                  </button>
                );
              })}
            </div>

            {selected !== currentPlan && (
              <div className="bill-modal__prorate">
                {newCents > currentCents ? (
                  <span>
                    Upgrading today — prorated charge of{" "}
                    <strong>{formatCents(proratedCents)}</strong> for the
                    remaining {daysLeft} days of this billing period.
                  </span>
                ) : (
                  <span>
                    Downgrade takes effect at the end of your current billing
                    period on{" "}
                    <strong>
                      {formatDate(MOCK_SUBSCRIPTION.current_period_end)}
                    </strong>
                    .
                  </span>
                )}
              </div>
            )}

            <div className="bill-modal__actions">
              <button className="bill-btn-ghost" onClick={onClose}>
                Cancel
              </button>
              <button
                className="bill-btn-primary"
                disabled={selected === currentPlan}
                onClick={() => setStep("confirm")}
              >
                Continue →
              </button>
            </div>
          </>
        )}

        {step === "confirm" && (
          <>
            <div className="bill-modal__header">
              <div className="bill-modal__eyebrow">Confirm Change</div>
              <h2 className="bill-modal__title">
                Switch to {PLANS[selected].name}
              </h2>
            </div>

            <div className="bill-modal__confirm-summary">
              <div className="bill-modal__confirm-row">
                <span>New plan</span>
                <span>
                  {PLANS[selected].name} —{" "}
                  {formatCents(PLANS[selected].price_cents)}/mo
                </span>
              </div>
              {proratedCents > 0 && (
                <div className="bill-modal__confirm-row">
                  <span>Prorated charge today</span>
                  <span>{formatCents(proratedCents)}</span>
                </div>
              )}
              <div className="bill-modal__confirm-row">
                <span>Next billing date</span>
                <span>{formatDate(MOCK_SUBSCRIPTION.current_period_end)}</span>
              </div>
            </div>

            <div className="bill-modal__actions">
              <button
                className="bill-btn-ghost"
                onClick={() => setStep("select")}
              >
                ← Back
              </button>
              <button
                className="bill-btn-primary"
                onClick={() => onConfirm(selected)}
              >
                Confirm Change
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/* ── CancelModal ─────────────────────────────────────────────────── */
const CANCEL_REASONS = [
  "Too expensive",
  "Not using it enough",
  "Missing features I need",
  "Switching to a competitor",
  "Business is pausing",
  "Other",
];

function CancelModal({
  plan,
  periodEnd,
  onClose,
  onConfirm,
}: {
  plan: PlanId;
  periodEnd: string;
  onClose: () => void;
  onConfirm: (reason: string) => void;
}) {
  const [step, setStep] = useState<"reason" | "retention" | "confirm">(
    "reason",
  );
  const [reason, setReason] = useState("");
  const [customReason, setCustomReason] = useState("");

  const finalReason = reason === "Other" ? customReason : reason;

  return (
    <div className="bill-modal-overlay" onClick={onClose}>
      <div
        className="bill-modal bill-modal--danger"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Cancel subscription"
      >
        {step === "reason" && (
          <>
            <div className="bill-modal__header">
              <div className="bill-modal__eyebrow bill-modal__eyebrow--danger">
                Cancel Subscription
              </div>
              <h2 className="bill-modal__title">
                Before you go — what&apos;s changed?
              </h2>
            </div>

            <div className="bill-cancel__reasons">
              {CANCEL_REASONS.map((r) => (
                <button
                  key={r}
                  className={`bill-cancel__reason${reason === r ? " bill-cancel__reason--selected" : ""}`}
                  onClick={() => setReason(r)}
                >
                  {reason === r && (
                    <span className="bill-cancel__reason-check">
                      <IconCheck />
                    </span>
                  )}
                  {r}
                </button>
              ))}
            </div>

            {reason === "Other" && (
              <textarea
                className="bill-cancel__textarea"
                placeholder="Tell us more…"
                value={customReason}
                onChange={(e) => setCustomReason(e.target.value)}
                rows={3}
              />
            )}

            <div className="bill-modal__actions">
              <button className="bill-btn-ghost" onClick={onClose}>
                Keep my plan
              </button>
              <button
                className="bill-btn-danger-outline"
                disabled={!reason || (reason === "Other" && !customReason)}
                onClick={() => setStep("retention")}
              >
                Continue
              </button>
            </div>
          </>
        )}

        {step === "retention" && (
          <>
            <div className="bill-modal__header">
              <div className="bill-modal__eyebrow bill-modal__eyebrow--danger">
                One moment
              </div>
              <h2 className="bill-modal__title">Your data stays safe.</h2>
            </div>

            <div className="bill-cancel__retention">
              <div className="bill-cancel__retention-item">
                <span className="bill-cancel__retention-icon">
                  <IconCheck />
                </span>
                <span>
                  All your campaigns, creator relationships, and QR attribution
                  data are retained for <strong>90 days</strong> after
                  cancellation.
                </span>
              </div>
              <div className="bill-cancel__retention-item">
                <span className="bill-cancel__retention-icon">
                  <IconCheck />
                </span>
                <span>
                  You can reactivate at any time and pick up where you left off.
                </span>
              </div>
              <div className="bill-cancel__retention-item">
                <span
                  className="bill-cancel__retention-icon"
                  style={{ color: "var(--champagne)" }}
                >
                  <IconWarning />
                </span>
                <span>
                  Active campaigns will be paused on{" "}
                  <strong>{formatDate(periodEnd)}</strong> — your current
                  billing period end.
                </span>
              </div>
            </div>

            <div className="bill-modal__actions">
              <button
                className="bill-btn-ghost"
                onClick={() => setStep("reason")}
              >
                ← Back
              </button>
              <button
                className="bill-btn-danger-outline"
                onClick={() => setStep("confirm")}
              >
                I understand
              </button>
            </div>
          </>
        )}

        {step === "confirm" && (
          <>
            <div className="bill-modal__header">
              <div className="bill-modal__eyebrow bill-modal__eyebrow--danger">
                Final Step
              </div>
              <h2 className="bill-modal__title">Cancel {PLANS[plan].name}?</h2>
            </div>

            <div className="bill-modal__confirm-summary">
              <div className="bill-modal__confirm-row">
                <span>Current plan</span>
                <span>
                  {PLANS[plan].name} — {formatCents(PLANS[plan].price_cents)}/mo
                </span>
              </div>
              <div className="bill-modal__confirm-row">
                <span>Access ends</span>
                <span>{formatDate(periodEnd)}</span>
              </div>
              <div className="bill-modal__confirm-row">
                <span>Data retained until</span>
                <span>
                  {formatDate(
                    new Date(
                      new Date(periodEnd).getTime() + 90 * 86400000,
                    ).toISOString(),
                  )}
                </span>
              </div>
            </div>

            <div className="bill-modal__actions">
              <button className="bill-btn-ghost" onClick={onClose}>
                Keep my plan
              </button>
              <button
                className="bill-btn-danger"
                onClick={() => onConfirm(finalReason)}
              >
                Cancel subscription
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/* ── Main page ───────────────────────────────────────────────────── */
export default function MerchantBillingPage() {
  const sub = MOCK_SUBSCRIPTION;
  const pm = MOCK_PAYMENT_METHOD;
  const addr = MOCK_BILLING_ADDRESS;
  const tax = MOCK_TAX_INFO;

  const [showUpgrade, setShowUpgrade] = useState(false);
  const [showCancel, setShowCancel] = useState(false);
  const [planChanged, setPlanChanged] = useState(false);
  const [canceled, setCanceled] = useState(false);
  const [currentPlan, setCurrentPlan] = useState<PlanId>(sub.plan);

  // Billing address editing
  const [editingAddr, setEditingAddr] = useState(false);
  const [addrDraft, setAddrDraft] = useState(addr);

  // Tax info editing
  const [editingTax, setEditingTax] = useState(false);
  const [taxDraft, setTaxDraft] = useState(tax);

  // Payment method editing (stub)
  const [pmMsg, setPmMsg] = useState("");

  const handlePlanConfirm = async (newPlan: PlanId) => {
    // TODO: call PATCH /api/merchant/subscription
    setCurrentPlan(newPlan);
    setShowUpgrade(false);
    setPlanChanged(true);
    setTimeout(() => setPlanChanged(false), 4000);
  };

  const handleCancelConfirm = async (reason: string) => {
    // TODO: call PATCH /api/merchant/subscription { action: "cancel", reason }
    console.log("Cancel reason:", reason);
    setShowCancel(false);
    setCanceled(true);
  };

  const handleEditPayment = () => {
    // TODO: open Stripe hosted portal or Stripe Elements payment update
    setPmMsg(
      "Payment update coming soon — Stripe Billing integration pending.",
    );
    setTimeout(() => setPmMsg(""), 4000);
  };

  const plan = PLANS[currentPlan];

  return (
    <>
      {/* Hidden print frame for PDF stub */}
      <div id="billing-print-frame" aria-hidden="true" />

      <div className="bill-shell">
        {/* Top Nav */}
        <nav className="bill-nav">
          <a href="/merchant/dashboard" className="bill-nav__back">
            <IconChevronLeft />
            Dashboard
          </a>
          <a href="/" className="bill-nav__logo">
            Push<span>.</span>
          </a>
          <div className="bill-nav__right">
            <span className="bill-nav__label">Billing & Invoices</span>
          </div>
        </nav>

        <div className="bill-body">
          {/* ── Section: Hero ──────────────────────────────────────── */}
          <section className="bill-hero">
            <div className="bill-hero__left">
              <div className="bill-hero__eyebrow">Billing Center</div>
              <h1 className="bill-hero__title">
                {plan.name}
                <span className="bill-hero__price">
                  {" "}
                  {formatCents(plan.price_cents)}
                </span>
                <span className="bill-hero__period">/mo</span>
              </h1>
              {canceled ? (
                <div className="bill-hero__cancel-notice">
                  <IconWarning />
                  Subscription canceled — access until{" "}
                  {formatDate(sub.current_period_end)}
                </div>
              ) : (
                <div className="bill-hero__next">
                  Next billing{" "}
                  <strong>{formatDate(sub.current_period_end)}</strong> —{" "}
                  {formatCents(plan.price_cents)}
                </div>
              )}
            </div>
            <div className="bill-hero__right">
              <div className="bill-hero__stat">
                <div className="bill-hero__stat-label">Status</div>
                <div className="bill-hero__stat-value">
                  {canceled ? "Cancels soon" : "Active"}
                </div>
              </div>
              <div className="bill-hero__stat">
                <div className="bill-hero__stat-label">Days until renewal</div>
                <div className="bill-hero__stat-value">
                  {daysUntil(sub.current_period_end)}
                </div>
              </div>
              <div className="bill-hero__stat">
                <div className="bill-hero__stat-label">Since</div>
                <div className="bill-hero__stat-value">
                  {formatDate(sub.current_period_start)}
                </div>
              </div>
            </div>
          </section>

          {planChanged && (
            <div className="bill-toast">Plan updated successfully.</div>
          )}

          <div className="bill-grid">
            {/* ── Left column ───────────────────────────────────────── */}
            <div className="bill-col bill-col--main">
              {/* Plan card */}
              <div className="bill-card">
                <div className="bill-card__header">
                  <div className="bill-card__icon">
                    <IconCard />
                  </div>
                  <h2 className="bill-card__title">Current Plan</h2>
                </div>

                <div className="bill-plan-details">
                  <div className="bill-plan-details__name">{plan.name}</div>
                  <div className="bill-plan-details__price">
                    {formatCents(plan.price_cents)}/mo
                  </div>
                  <ul className="bill-plan-details__features">
                    {plan.features.map((f) => (
                      <li key={f}>
                        <span className="bill-plan-details__check">
                          <IconCheck />
                        </span>
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>

                {!canceled && (
                  <div className="bill-card__actions">
                    <button
                      className="bill-btn-primary"
                      onClick={() => setShowUpgrade(true)}
                    >
                      {currentPlan === "pro" ? "Downgrade" : "Upgrade"}
                    </button>
                    <button
                      className="bill-btn-ghost"
                      onClick={() => setShowCancel(true)}
                    >
                      Cancel plan
                    </button>
                  </div>
                )}
              </div>

              {/* Invoice history */}
              <div className="bill-card">
                <div className="bill-card__header">
                  <div className="bill-card__icon">
                    <IconReceipt />
                  </div>
                  <h2 className="bill-card__title">Invoice History</h2>
                  <span className="bill-card__meta">
                    {MOCK_INVOICES.length} invoices
                  </span>
                </div>

                <div className="bill-table-wrap">
                  <table className="bill-table">
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Invoice #</th>
                        <th>Description</th>
                        <th>Amount</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {MOCK_INVOICES.map((inv) => (
                        <tr key={inv.id}>
                          <td className="bill-table__date">
                            {formatDate(inv.date)}
                          </td>
                          <td className="bill-table__num">{inv.number}</td>
                          <td className="bill-table__desc">
                            {inv.description}
                          </td>
                          <td className="bill-table__amount">
                            {formatCents(inv.amount_cents)}
                          </td>
                          <td>
                            <InvoiceStatusBadge status={inv.status} />
                          </td>
                          <td>
                            <div className="bill-table__actions">
                              <button
                                className="bill-table__action-btn"
                                title="Download PDF"
                                onClick={() => triggerPrintForInvoice(inv)}
                              >
                                <IconDownload />
                                <span>PDF</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* ── Right column ──────────────────────────────────────── */}
            <div className="bill-col bill-col--side">
              {/* Payment method */}
              <div className="bill-card">
                <div className="bill-card__header">
                  <div className="bill-card__icon">
                    <IconCard />
                  </div>
                  <h2 className="bill-card__title">Payment Method</h2>
                </div>

                <div className="bill-payment-method">
                  <div className="bill-payment-method__brand">
                    {pm.brand.toUpperCase()}
                  </div>
                  <div className="bill-payment-method__num">
                    •••• •••• •••• {pm.last4}
                  </div>
                  <div className="bill-payment-method__exp">
                    Expires {pm.exp_month.toString().padStart(2, "0")}/
                    {pm.exp_year}
                  </div>
                </div>

                {pmMsg && <div className="bill-inline-msg">{pmMsg}</div>}

                <div className="bill-card__actions">
                  <button
                    className="bill-btn-outline"
                    onClick={handleEditPayment}
                  >
                    <IconEdit />
                    Update card
                  </button>
                </div>
              </div>

              {/* Billing address */}
              <div className="bill-card">
                <div className="bill-card__header">
                  <h2 className="bill-card__title">Billing Address</h2>
                  {!editingAddr && (
                    <button
                      className="bill-card__edit-btn"
                      onClick={() => setEditingAddr(true)}
                    >
                      <IconEdit />
                      Edit
                    </button>
                  )}
                </div>

                {editingAddr ? (
                  <div className="bill-form">
                    {(
                      [
                        ["name", "Name"],
                        ["line1", "Address line 1"],
                        ["line2", "Address line 2 (optional)"],
                        ["city", "City"],
                        ["state", "State"],
                        ["postal_code", "ZIP / Postal code"],
                        ["country", "Country"],
                      ] as [keyof typeof addrDraft, string][]
                    ).map(([field, label]) => (
                      <div key={field} className="bill-form__row">
                        <label className="bill-form__label">{label}</label>
                        <input
                          className="bill-form__input"
                          value={addrDraft[field] ?? ""}
                          onChange={(e) =>
                            setAddrDraft((prev) => ({
                              ...prev,
                              [field]: e.target.value,
                            }))
                          }
                        />
                      </div>
                    ))}
                    <div className="bill-form__actions">
                      <button
                        className="bill-btn-ghost"
                        onClick={() => {
                          setAddrDraft(addr);
                          setEditingAddr(false);
                        }}
                      >
                        Cancel
                      </button>
                      <button
                        className="bill-btn-primary"
                        onClick={() => setEditingAddr(false)}
                      >
                        Save
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="bill-addr-display">
                    <div>{addrDraft.name}</div>
                    <div>{addrDraft.line1}</div>
                    {addrDraft.line2 && <div>{addrDraft.line2}</div>}
                    <div>
                      {addrDraft.city}, {addrDraft.state}{" "}
                      {addrDraft.postal_code}
                    </div>
                    <div>{addrDraft.country}</div>
                  </div>
                )}
              </div>

              {/* Tax info */}
              <div className="bill-card">
                <div className="bill-card__header">
                  <h2 className="bill-card__title">Tax Information</h2>
                  {!editingTax && (
                    <button
                      className="bill-card__edit-btn"
                      onClick={() => setEditingTax(true)}
                    >
                      <IconEdit />
                      Edit
                    </button>
                  )}
                </div>

                {editingTax ? (
                  <div className="bill-form">
                    <div className="bill-form__row">
                      <label className="bill-form__label">Business name</label>
                      <input
                        className="bill-form__input"
                        value={taxDraft.business_name}
                        onChange={(e) =>
                          setTaxDraft((prev) => ({
                            ...prev,
                            business_name: e.target.value,
                          }))
                        }
                      />
                    </div>
                    <div className="bill-form__row">
                      <label className="bill-form__label">
                        Tax ID / EIN (optional)
                      </label>
                      <input
                        className="bill-form__input"
                        value={taxDraft.tax_id ?? ""}
                        placeholder="e.g. 47-1234567"
                        onChange={(e) =>
                          setTaxDraft((prev) => ({
                            ...prev,
                            tax_id: e.target.value || null,
                          }))
                        }
                      />
                    </div>
                    <div className="bill-form__actions">
                      <button
                        className="bill-btn-ghost"
                        onClick={() => {
                          setTaxDraft(tax);
                          setEditingTax(false);
                        }}
                      >
                        Cancel
                      </button>
                      <button
                        className="bill-btn-primary"
                        onClick={() => setEditingTax(false)}
                      >
                        Save
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="bill-addr-display">
                    <div>{taxDraft.business_name}</div>
                    {taxDraft.tax_id && (
                      <div className="bill-addr-display__taxid">
                        EIN / Tax ID: {taxDraft.tax_id}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {showUpgrade && (
        <UpgradeModal
          currentPlan={currentPlan}
          onClose={() => setShowUpgrade(false)}
          onConfirm={handlePlanConfirm}
        />
      )}

      {showCancel && (
        <CancelModal
          plan={currentPlan}
          periodEnd={sub.current_period_end}
          onClose={() => setShowCancel(false)}
          onConfirm={handleCancelConfirm}
        />
      )}
    </>
  );
}
