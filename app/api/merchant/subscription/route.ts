// GET  /api/merchant/subscription  — fetch current subscription
// PATCH /api/merchant/subscription  — change plan (upgrade/downgrade/cancel)
// TODO: wire to Stripe Billing + Supabase

import { NextRequest, NextResponse } from "next/server";
import {
  MOCK_SUBSCRIPTION,
  MOCK_PAYMENT_METHOD,
  MOCK_BILLING_ADDRESS,
  MOCK_TAX_INFO,
  type PlanId,
} from "@/lib/billing/mock-invoices";

export async function GET() {
  // TODO: authenticate via Supabase session
  // TODO: fetch stripe subscription from DB / Stripe API

  return NextResponse.json({
    subscription: MOCK_SUBSCRIPTION,
    payment_method: MOCK_PAYMENT_METHOD,
    billing_address: MOCK_BILLING_ADDRESS,
    tax_info: MOCK_TAX_INFO,
  });
}

export async function PATCH(req: NextRequest) {
  const body = await req.json();
  const { action, plan, reason } = body as {
    action: "change_plan" | "cancel";
    plan?: PlanId;
    reason?: string;
  };

  // TODO: authenticate via Supabase session
  // TODO: call stripe.subscriptions.update() or stripe.subscriptions.cancel()

  if (action === "change_plan" && plan) {
    // TODO: stripe.subscriptions.update({ proration_behavior: "create_prorations" })
    return NextResponse.json({
      success: true,
      message: `Plan change to ${plan} queued.`,
      // TODO: return updated subscription from Stripe
    });
  }

  if (action === "cancel") {
    // TODO: stripe.subscriptions.update({ cancel_at_period_end: true })
    return NextResponse.json({
      success: true,
      message: `Subscription will cancel at period end. Reason: ${reason ?? "not provided"}`,
    });
  }

  return NextResponse.json({ error: "Invalid action" }, { status: 400 });
}
