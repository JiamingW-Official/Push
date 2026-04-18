"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import "./billing.css";

/* ─────────────────────────────────────────────────────────────────
   Push v5.1 — Merchant Billing
   Vertical AI for Local Commerce · Customer Acquisition Engine
   Subscription, usage, Retention Add-on, invoices, payment method.
   ───────────────────────────────────────────────────────────────── */

type PlanId =
  | "pilot"
  | "operator_starter"
  | "operator_growth"
  | "operator_scale";

type Plan = {
  id: PlanId;
  name: string;
  tagline: string;
  monthlyCents: number;
  perCustomerRange: string;
  verifiedCap: number;
  perks: string[];
};

const PLANS: Record<PlanId, Plan> = {
  pilot: {
    id: "pilot",
    name: "Pilot",
    tagline: "60-day Williamsburg Coffee+ beachhead",
    monthlyCents: 0,
    perCustomerRange: "$0 — pilot on Push",
    verifiedCap: 50,
    perks: [
      "50 verified walk-ins / month",
      "ConversionOracle™ 3-layer verify",
      "1 Neighborhood Playbook",
      "DisclosureBot compliance gate",
    ],
  },
  operator_starter: {
    id: "operator_starter",
    name: "Operator · Starter",
    tagline: "Solo merchant · single location",
    monthlyCents: 50000,
    perCustomerRange: "$15–$35 per verified customer",
    verifiedCap: 200,
    perks: [
      "200 verified walk-ins / month",
      "Tier 1–3 creator matching",
      "ConversionOracle™ + DisclosureBot",
      "Weekly settlement + CSV export",
    ],
  },
  operator_growth: {
    id: "operator_growth",
    name: "Operator · Growth",
    tagline: "2–5 locations · active creator roster",
    monthlyCents: 125000,
    perCustomerRange: "$25–$55 per verified customer",
    verifiedCap: 600,
    perks: [
      "600 verified walk-ins / month",
      "Tier 1–5 creator matching",
      "Priority ops review queue",
      "Dedicated SLR dashboard",
      "API + webhook access",
    ],
  },
  operator_scale: {
    id: "operator_scale",
    name: "Operator · Scale",
    tagline: "Multi-market · T4–T6 retainer economics",
    monthlyCents: 250000,
    perCustomerRange: "$45–$85 per verified customer",
    verifiedCap: 1500,
    perks: [
      "1,500 verified walk-ins / month",
      "Two-Segment Creator Economics — T1–T6",
      "Named pod · Solutions Architect",
      "Custom Neighborhood Playbooks",
      "White-label ConversionOracle™ reports",
    ],
  },
};

/* ── Mock subscription state ─────────────────────────────────────── */
const CURRENT_PLAN: PlanId = "operator_growth";
const RENEWAL_DATE = "2026-05-14";
const BILLING_START = "2026-04-14";
const USAGE_VERIFIED = 412;

const PAYMENT_METHOD = {
  brand: "visa" as const,
  last4: "4242",
  expMonth: 9,
  expYear: 2027,
};

type InvoiceStatus = "paid" | "open" | "void";
type InvoiceRow = {
  id: string;
  date: string;
  description: string;
  amountCents: number;
  status: InvoiceStatus;
};

const INVOICES: InvoiceRow[] = [
  {
    id: "INV-2026-04",
    date: "2026-04-14",
    description: "Operator · Growth + Retention Add-on · April",
    amountCents: 142500,
    status: "open",
  },
  {
    id: "INV-2026-03",
    date: "2026-03-14",
    description: "Operator · Growth + Retention Add-on · March",
    amountCents: 138200,
    status: "paid",
  },
  {
    id: "INV-2026-02",
    date: "2026-02-14",
    description: "Operator · Growth · February",
    amountCents: 125000,
    status: "paid",
  },
  {
    id: "INV-2026-01",
    date: "2026-01-14",
    description: "Operator · Growth · January",
    amountCents: 125000,
    status: "paid",
  },
  {
    id: "INV-2025-12",
    date: "2025-12-14",
    description: "Operator · Starter · December",
    amountCents: 50000,
    status: "paid",
  },
  {
    id: "INV-2025-11",
    date: "2025-11-14",
    description: "Pilot · Williamsburg Coffee+",
    amountCents: 0,
    status: "void",
  },
];

/* ── Helpers ─────────────────────────────────────────────────────── */
function fmtCents(cents: number): string {
  return `$${(cents / 100).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function fmtDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function daysUntil(iso: string): number {
  return Math.max(
    0,
    Math.ceil((new Date(iso).getTime() - Date.now()) / 86400000),
  );
}

/* ── Invoice PDF stub ────────────────────────────────────────────── */
function downloadInvoicePdf(inv: InvoiceRow) {
  const lines = [
    "PUSH — Customer Acquisition Engine",
    "Vertical AI for Local Commerce",
    "",
    `Invoice: ${inv.id}`,
    `Date:    ${fmtDate(inv.date)}`,
    `Desc:    ${inv.description}`,
    `Amount:  ${fmtCents(inv.amountCents)}`,
    `Status:  ${inv.status.toUpperCase()}`,
    "",
    "Push Inc. · 284 W Broadway · New York, NY 10013",
    "billing@pushapp.co",
  ].join("\n");
  const blob = new Blob([lines], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${inv.id}.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/* ── Status pill ─────────────────────────────────────────────────── */
function InvoicePill({ status }: { status: InvoiceStatus }) {
  const map: Record<InvoiceStatus, { label: string; cls: string }> = {
    paid: { label: "Paid", cls: "paid" },
    open: { label: "Due", cls: "open" },
    void: { label: "Void", cls: "void" },
  };
  const { label, cls } = map[status];
  return (
    <span className={`bill-pill bill-pill--${cls}`}>
      <span className="bill-pill__dot" />
      {label}
    </span>
  );
}

/* ── Change-plan modal ───────────────────────────────────────────── */
function ChangePlanModal({
  current,
  onClose,
  onConfirm,
}: {
  current: PlanId;
  onClose: () => void;
  onConfirm: (p: PlanId) => void;
}) {
  const [selected, setSelected] = useState<PlanId>(current);
  const order: PlanId[] = [
    "pilot",
    "operator_starter",
    "operator_growth",
    "operator_scale",
  ];
  return (
    <div className="bill-overlay" onClick={onClose}>
      <div
        className="bill-modal"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Change plan"
      >
        <div className="bill-modal__eyebrow">Customer Acquisition Engine</div>
        <h2 className="bill-modal__title">Change plan</h2>
        <p className="bill-modal__sub">
          Every tier runs on the same ConversionOracle™ — you just scale the
          verified customer cap and Neighborhood Playbook surface area.
        </p>
        <div className="bill-plan-options">
          {order.map((id) => {
            const p = PLANS[id];
            const isCur = id === current;
            const isSel = id === selected;
            return (
              <button
                key={id}
                type="button"
                className={`bill-plan-opt${isSel ? " is-selected" : ""}${isCur ? " is-current" : ""}`}
                onClick={() => setSelected(id)}
                disabled={isCur}
              >
                <div className="bill-plan-opt__top">
                  <span className="bill-plan-opt__name">{p.name}</span>
                  {isCur && <span className="bill-plan-opt__tag">Current</span>}
                </div>
                <div className="bill-plan-opt__price">
                  {p.monthlyCents === 0
                    ? "Free"
                    : `${fmtCents(p.monthlyCents)}/mo`}
                </div>
                <div className="bill-plan-opt__range">{p.perCustomerRange}</div>
                <div className="bill-plan-opt__cap">
                  Up to {p.verifiedCap} verified walk-ins / mo
                </div>
              </button>
            );
          })}
        </div>
        <div className="bill-modal__actions">
          <button className="bill-btn-ghost" onClick={onClose}>
            Cancel
          </button>
          <button
            className="bill-btn-primary"
            disabled={selected === current}
            onClick={() => onConfirm(selected)}
          >
            Confirm change
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Cancel modal (retention-offer first) ────────────────────────── */
function CancelModal({
  plan,
  periodEnd,
  onClose,
  onConfirm,
}: {
  plan: PlanId;
  periodEnd: string;
  onClose: () => void;
  onConfirm: () => void;
}) {
  const [step, setStep] = useState<"retention" | "confirm">("retention");
  return (
    <div className="bill-overlay" onClick={onClose}>
      <div
        className="bill-modal bill-modal--danger"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Cancel subscription"
      >
        {step === "retention" && (
          <>
            <div className="bill-modal__eyebrow bill-modal__eyebrow--danger">
              Before you cancel
            </div>
            <h2 className="bill-modal__title">
              One Neighborhood Playbook, on the house.
            </h2>
            <p className="bill-modal__sub">
              Most Operator cancellations come from slow verification weeks. We
              can freeze your base fee for 30 days and assign a Solutions
              Architect to tune your ConversionOracle™ threshold — no cost, no
              contract change.
            </p>
            <div className="bill-retention">
              <div className="bill-retention__item">
                <span className="bill-retention__dot bill-retention__dot--good" />
                30-day base-fee freeze — you keep all verified customers
              </div>
              <div className="bill-retention__item">
                <span className="bill-retention__dot bill-retention__dot--good" />
                Direct pod access to tune your verification window
              </div>
              <div className="bill-retention__item">
                <span className="bill-retention__dot bill-retention__dot--warn" />
                Data retained 90 days after cancel — easy reactivation
              </div>
            </div>
            <div className="bill-modal__actions">
              <button
                className="bill-btn-primary"
                onClick={() => {
                  alert("Retention offer accepted — pod will reach out.");
                  onClose();
                }}
              >
                Accept 30-day freeze
              </button>
              <button
                className="bill-btn-danger-ghost"
                onClick={() => setStep("confirm")}
              >
                Continue cancel
              </button>
            </div>
          </>
        )}
        {step === "confirm" && (
          <>
            <div className="bill-modal__eyebrow bill-modal__eyebrow--danger">
              Final confirmation
            </div>
            <h2 className="bill-modal__title">Cancel {PLANS[plan].name}?</h2>
            <div className="bill-confirm-grid">
              <div className="bill-confirm-row">
                <span>Access ends</span>
                <span>{fmtDate(periodEnd)}</span>
              </div>
              <div className="bill-confirm-row">
                <span>Data retained until</span>
                <span>
                  {fmtDate(
                    new Date(
                      new Date(periodEnd).getTime() + 90 * 86400000,
                    ).toISOString(),
                  )}
                </span>
              </div>
              <div className="bill-confirm-row">
                <span>Reactivation</span>
                <span>Any time — same pod, same playbook</span>
              </div>
            </div>
            <div className="bill-modal__actions">
              <button
                className="bill-btn-ghost"
                onClick={() => setStep("retention")}
              >
                ← Back
              </button>
              <button className="bill-btn-danger" onClick={onConfirm}>
                Cancel subscription
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/* ── Page ────────────────────────────────────────────────────────── */
export default function MerchantBillingPage() {
  const [planId, setPlanId] = useState<PlanId>(CURRENT_PLAN);
  const [addonOn, setAddonOn] = useState(true);
  const [showPlan, setShowPlan] = useState(false);
  const [showCancel, setShowCancel] = useState(false);
  const [canceled, setCanceled] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const plan = PLANS[planId];

  const usagePct = useMemo(
    () => Math.round((USAGE_VERIFIED / plan.verifiedCap) * 100),
    [plan.verifiedCap],
  );
  const usageLevel: "ok" | "warn" | "danger" =
    usagePct >= 100 ? "danger" : usagePct >= 80 ? "warn" : "ok";

  const flash = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3200);
  };

  return (
    <div className="bill-shell">
      <nav className="bill-nav">
        <Link href="/merchant/dashboard" className="bill-nav__back">
          ← Dashboard
        </Link>
        <span className="bill-nav__crumbs">Finance / Billing</span>
      </nav>

      <div className="bill-body">
        {/* Hero */}
        <header className="bill-hero">
          <span className="bill-hero__eyebrow">
            Customer Acquisition Engine · subscription
          </span>
          <h1 className="bill-hero__title">Billing</h1>
          <p className="bill-hero__sub">
            Base fee + per-verified-customer rate — one clean line for the
            Vertical AI for Local Commerce stack. Retention Add-on billed
            separately at the end of each cycle.
          </p>
        </header>

        {toast && <div className="bill-toast">{toast}</div>}
        {canceled && (
          <div className="bill-toast bill-toast--warn">
            Subscription cancels on {fmtDate(RENEWAL_DATE)} · data retained 90
            days.
          </div>
        )}

        {/* Two-column */}
        <div className="bill-grid">
          <div className="bill-col bill-col--main">
            {/* Current plan card */}
            <article className="bill-card bill-card--plan">
              <header className="bill-card__head">
                <span className="bill-card__eyebrow">Current plan</span>
                <h2 className="bill-card__title">{plan.name}</h2>
                <span className="bill-card__tag">{plan.tagline}</span>
              </header>
              <div className="bill-plan-row">
                <div className="bill-plan-row__price">
                  <span className="bill-plan-row__amount">
                    {plan.monthlyCents === 0
                      ? "Free"
                      : fmtCents(plan.monthlyCents)}
                  </span>
                  {plan.monthlyCents !== 0 && (
                    <span className="bill-plan-row__cycle">/ month base</span>
                  )}
                </div>
                <div className="bill-plan-row__meta">
                  <span className="bill-plan-row__rate">
                    + {plan.perCustomerRange}
                  </span>
                  <span className="bill-plan-row__renew">
                    Renews {fmtDate(RENEWAL_DATE)} · {daysUntil(RENEWAL_DATE)}{" "}
                    days
                  </span>
                </div>
              </div>
              <ul className="bill-plan-perks">
                {plan.perks.map((p) => (
                  <li key={p}>
                    <span className="bill-plan-perks__check">✓</span>
                    {p}
                  </li>
                ))}
              </ul>
              <div className="bill-card__foot">
                <button
                  className="bill-link"
                  onClick={() => setShowPlan(true)}
                  disabled={canceled}
                >
                  Change plan →
                </button>
              </div>
            </article>

            {/* Usage */}
            <article className="bill-card">
              <header className="bill-card__head">
                <span className="bill-card__eyebrow">Usage — this cycle</span>
                <h2 className="bill-card__title">Verified customers</h2>
              </header>
              <div className="bill-usage">
                <div className="bill-usage__nums">
                  <span className="bill-usage__big">
                    {USAGE_VERIFIED.toLocaleString()}
                  </span>
                  <span className="bill-usage__cap">
                    / {plan.verifiedCap.toLocaleString()} cap
                  </span>
                  <span className="bill-usage__pct">{usagePct}%</span>
                </div>
                <div
                  className={`bill-usage__bar bill-usage__bar--${usageLevel}`}
                  role="progressbar"
                  aria-valuenow={usagePct}
                  aria-valuemin={0}
                  aria-valuemax={100}
                >
                  <div
                    className="bill-usage__fill"
                    style={{ width: `${Math.min(100, usagePct)}%` }}
                  />
                </div>
                <div className="bill-usage__window">
                  Window: {fmtDate(BILLING_START)} → {fmtDate(RENEWAL_DATE)}
                </div>
              </div>

              {usageLevel === "warn" && (
                <div className="bill-alert bill-alert--warn" role="alert">
                  <span className="bill-alert__icon">!</span>
                  <span>
                    You&apos;re at {usagePct}% of your verified-customer cap.
                    Add capacity before the cap bites.
                  </span>
                  <button
                    className="bill-alert__cta"
                    onClick={() => setShowPlan(true)}
                  >
                    Upgrade
                  </button>
                </div>
              )}
              {usageLevel === "danger" && (
                <div className="bill-alert bill-alert--danger" role="alert">
                  <span className="bill-alert__icon">!</span>
                  <span>
                    Cap reached. Additional verified customers will be queued
                    until the cycle resets or you upgrade.
                  </span>
                  <button
                    className="bill-alert__cta"
                    onClick={() => setShowPlan(true)}
                  >
                    Upgrade
                  </button>
                </div>
              )}
            </article>

            {/* Retention Add-on */}
            <article className="bill-card">
              <header className="bill-card__head">
                <span className="bill-card__eyebrow">Retention Add-on</span>
                <h2 className="bill-card__title">Bring them back</h2>
                <span className="bill-card__tag">
                  Billed at $8–$24 per retained visit
                </span>
              </header>
              <div className="bill-toggle-row">
                <div className="bill-toggle-row__copy">
                  <div className="bill-toggle-row__title">
                    {addonOn
                      ? "Add-on active · $8–$24 per retained visit"
                      : "Add-on off"}
                  </div>
                  <div className="bill-toggle-row__desc">
                    ConversionOracle™ tracks a second verified visit from the
                    same customer within 30 days — you only pay when the visit
                    lands.
                  </div>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={addonOn}
                  className={`bill-switch${addonOn ? " is-on" : ""}`}
                  onClick={() => {
                    setAddonOn((v) => !v);
                    flash(
                      addonOn
                        ? "Retention Add-on paused."
                        : "Retention Add-on active.",
                    );
                  }}
                >
                  <span className="bill-switch__knob" />
                </button>
              </div>
            </article>

            {/* Invoice history */}
            <article className="bill-card">
              <header className="bill-card__head">
                <span className="bill-card__eyebrow">Invoice history</span>
                <h2 className="bill-card__title">Past statements</h2>
                <span className="bill-card__meta">
                  {INVOICES.length} invoices
                </span>
              </header>
              <div className="bill-table-wrap">
                <table className="bill-table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Invoice</th>
                      <th className="bill-table__num">Amount</th>
                      <th>Status</th>
                      <th className="bill-table__num">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {INVOICES.map((inv) => (
                      <tr key={inv.id}>
                        <td>{fmtDate(inv.date)}</td>
                        <td className="bill-table__desc">
                          <div className="bill-table__inv-id">{inv.id}</div>
                          <div className="bill-table__inv-desc">
                            {inv.description}
                          </div>
                        </td>
                        <td className="bill-table__num bill-table__amount">
                          {fmtCents(inv.amountCents)}
                        </td>
                        <td>
                          <InvoicePill status={inv.status} />
                        </td>
                        <td className="bill-table__num">
                          <button
                            className="bill-btn-outline bill-btn-outline--sm"
                            onClick={() => downloadInvoicePdf(inv)}
                            disabled={inv.status === "void"}
                          >
                            PDF ↓
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </article>
          </div>

          {/* Sidebar */}
          <aside className="bill-col bill-col--side">
            {/* Payment method */}
            <article className="bill-card bill-card--side">
              <header className="bill-card__head">
                <span className="bill-card__eyebrow">Payment method</span>
              </header>
              <div className="bill-pm">
                <div className="bill-pm__brand">
                  {PAYMENT_METHOD.brand.toUpperCase()}
                </div>
                <div className="bill-pm__num">
                  •••• •••• •••• {PAYMENT_METHOD.last4}
                </div>
                <div className="bill-pm__exp">
                  Exp {PAYMENT_METHOD.expMonth.toString().padStart(2, "0")}/
                  {PAYMENT_METHOD.expYear}
                </div>
              </div>
              <button
                className="bill-link"
                onClick={() =>
                  flash("Card update — Stripe Billing portal coming soon.")
                }
              >
                Update card →
              </button>
            </article>

            {/* Cycle summary */}
            <article className="bill-card bill-card--side">
              <header className="bill-card__head">
                <span className="bill-card__eyebrow">Cycle summary</span>
              </header>
              <div className="bill-sum-row">
                <span>Base fee</span>
                <span>{fmtCents(plan.monthlyCents)}</span>
              </div>
              <div className="bill-sum-row">
                <span>Verified customers</span>
                <span>{USAGE_VERIFIED.toLocaleString()} × rate</span>
              </div>
              <div className="bill-sum-row">
                <span>Retention Add-on</span>
                <span>{addonOn ? "Active" : "Off"}</span>
              </div>
              <div className="bill-sum-row bill-sum-row--total">
                <span>Next invoice</span>
                <span>{fmtDate(RENEWAL_DATE)}</span>
              </div>
            </article>

            {/* Cancel */}
            <article className="bill-card bill-card--side bill-card--danger">
              <header className="bill-card__head">
                <span className="bill-card__eyebrow bill-card__eyebrow--danger">
                  Danger zone
                </span>
              </header>
              <p className="bill-card__sub">
                Cancel shuts down ConversionOracle™ verification at cycle end.
                Your Neighborhood Playbook and creator roster stay intact for 90
                days.
              </p>
              <button
                type="button"
                className="bill-link bill-link--danger"
                onClick={() => setShowCancel(true)}
                disabled={canceled}
              >
                Cancel subscription →
              </button>
            </article>
          </aside>
        </div>
      </div>

      {showPlan && (
        <ChangePlanModal
          current={planId}
          onClose={() => setShowPlan(false)}
          onConfirm={(p) => {
            setPlanId(p);
            setShowPlan(false);
            flash(`Plan switched to ${PLANS[p].name}.`);
          }}
        />
      )}

      {showCancel && (
        <CancelModal
          plan={planId}
          periodEnd={RENEWAL_DATE}
          onClose={() => setShowCancel(false)}
          onConfirm={() => {
            setCanceled(true);
            setShowCancel(false);
          }}
        />
      )}
    </div>
  );
}
