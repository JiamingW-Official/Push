// Mock billing data — TODO: wire to Stripe Billing + Supabase

export type PlanId = "starter" | "growth" | "pro";

export type Invoice = {
  id: string;
  number: string; // e.g. "INV-2026-04"
  date: string; // ISO date string
  period_start: string;
  period_end: string;
  description: string;
  amount_cents: number; // amount in cents
  status: "paid" | "open" | "void" | "draft";
  pdf_url: string | null;
  hosted_url: string | null;
};

export type PaymentMethod = {
  id: string;
  brand: "visa" | "mastercard" | "amex" | "discover";
  last4: string;
  exp_month: number;
  exp_year: number;
  is_default: boolean;
};

export type BillingAddress = {
  name: string;
  line1: string;
  line2: string | null;
  city: string;
  state: string;
  postal_code: string;
  country: string;
};

export type TaxInfo = {
  business_name: string;
  tax_id: string | null;
};

export type Subscription = {
  id: string;
  plan: PlanId;
  status: "active" | "past_due" | "canceled" | "trialing";
  current_period_start: string;
  current_period_end: string;
  cancel_at_period_end: boolean;
  trial_end: string | null;
};

// ── Plan definitions ──────────────────────────────────────────────
export const PLANS: Record<
  PlanId,
  { name: string; price_cents: number; features: string[] }
> = {
  starter: {
    name: "Starter",
    price_cents: 1999,
    features: [
      "Up to 2 active campaigns",
      "10 creator slots / month",
      "Basic QR attribution",
      "Email support",
    ],
  },
  growth: {
    name: "Growth",
    price_cents: 6900,
    features: [
      "Up to 10 active campaigns",
      "50 creator slots / month",
      "Advanced QR attribution",
      "Priority email support",
      "Campaign analytics",
      "Creator tier filtering",
    ],
  },
  pro: {
    name: "Pro",
    price_cents: 19900,
    features: [
      "Unlimited campaigns",
      "Unlimited creator slots",
      "Full QR attribution + fraud protection",
      "Dedicated account manager",
      "API access",
      "White-label reports",
      "Multi-location support",
    ],
  },
};

// ── Mock subscription ─────────────────────────────────────────────
export const MOCK_SUBSCRIPTION: Subscription = {
  id: "sub_demo_001",
  plan: "growth",
  status: "active",
  current_period_start: "2026-04-01T00:00:00Z",
  current_period_end: "2026-05-01T00:00:00Z",
  cancel_at_period_end: false,
  trial_end: null,
};

// ── Mock payment method ───────────────────────────────────────────
export const MOCK_PAYMENT_METHOD: PaymentMethod = {
  id: "pm_demo_001",
  brand: "visa",
  last4: "1234",
  exp_month: 9,
  exp_year: 2027,
  is_default: true,
};

// ── Mock billing address ──────────────────────────────────────────
export const MOCK_BILLING_ADDRESS: BillingAddress = {
  name: "Blank Street Coffee SoHo LLC",
  line1: "284 W Broadway",
  line2: null,
  city: "New York",
  state: "NY",
  postal_code: "10013",
  country: "US",
};

// ── Mock tax info ─────────────────────────────────────────────────
export const MOCK_TAX_INFO: TaxInfo = {
  business_name: "Blank Street Coffee SoHo LLC",
  tax_id: "47-1234567",
};

// ── Helper: generate 12 months of monthly invoices ────────────────
function makeInvoice(monthsAgo: number, plan: PlanId = "growth"): Invoice {
  const now = new Date("2026-04-01T00:00:00Z");
  const periodStart = new Date(now);
  periodStart.setMonth(periodStart.getMonth() - monthsAgo);
  const periodEnd = new Date(periodStart);
  periodEnd.setMonth(periodEnd.getMonth() + 1);

  const year = periodStart.getFullYear();
  const month = String(periodStart.getMonth() + 1).padStart(2, "0");
  const invoiceNum = `INV-${year}-${month}`;

  return {
    id: `inv_demo_${year}${month}`,
    number: invoiceNum,
    date: periodStart.toISOString().slice(0, 10),
    period_start: periodStart.toISOString().slice(0, 10),
    period_end: periodEnd.toISOString().slice(0, 10),
    description: `Push ${PLANS[plan].name} Plan — ${periodStart.toLocaleDateString("en-US", { month: "long", year: "numeric" })}`,
    amount_cents: PLANS[plan].price_cents,
    status: monthsAgo === 0 ? "open" : "paid",
    pdf_url: null, // stub — print-based PDF
    hosted_url: null, // stub
  };
}

// 12 invoices: current month (open) + 11 paid months
export const MOCK_INVOICES: Invoice[] = Array.from({ length: 12 }, (_, i) =>
  makeInvoice(i),
);
