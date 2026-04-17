import { NextResponse } from "next/server";
import {
  MOCK_MERCHANT_PAYMENTS,
  MOCK_MONTHLY_INVOICES,
} from "@/lib/payments/mock-transactions";

// TODO: wire to Stripe + Supabase
// GET /api/merchant/payments — returns payment history and invoice list

export async function GET() {
  // TODO: authenticate via Supabase session
  // const supabase = createServerClient(...)
  // const { data: { user } } = await supabase.auth.getUser()
  // if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const scheduled = MOCK_MERCHANT_PAYMENTS.filter(
    (p) => p.status === "scheduled",
  );
  const processing = MOCK_MERCHANT_PAYMENTS.filter(
    (p) => p.status === "processing",
  );
  const completed = MOCK_MERCHANT_PAYMENTS.filter(
    (p) => p.status === "completed",
  );

  const thisMonthSpend = MOCK_MERCHANT_PAYMENTS.filter((p) =>
    p.date.startsWith("2026-04"),
  ).reduce((s, p) => s + p.amount, 0);

  // Per-campaign spend breakdown
  const campaignSpend = [
    {
      id: "camp-003",
      campaign: "LA Botanica Aesthetic Shoot",
      used: 86.25,
      budget: 450,
    },
    {
      id: "camp-004",
      campaign: "Brow Transformation Story",
      used: 115,
      budget: 500,
    },
    {
      id: "camp-002",
      campaign: "Best Burger in NYC Feature",
      used: 322,
      budget: 400,
    },
    {
      id: "camp-007",
      campaign: "KITH x Creator Collab",
      used: 228.85,
      budget: 700,
    },
  ];

  // Next batch payout date (first of next month)
  const now = new Date();
  const nextPayout = new Date(now.getFullYear(), now.getMonth() + 1, 1);

  return NextResponse.json({
    summary: {
      thisMonthSpend: parseFloat(thisMonthSpend.toFixed(2)),
      budgetTotal: 2050,
      budgetUsed: parseFloat(thisMonthSpend.toFixed(2)),
      nextPayoutDate: nextPayout.toISOString().split("T")[0],
    },
    payments: {
      scheduled,
      processing,
      completed,
    },
    campaignSpend,
    invoices: MOCK_MONTHLY_INVOICES,
  });
}
