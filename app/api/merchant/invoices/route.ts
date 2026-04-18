// GET /api/merchant/invoices
// TODO: wire to Stripe Billing + Supabase (replace mock with real Stripe customer invoices)

import { NextResponse } from "next/server";
import { MOCK_INVOICES } from "@/lib/billing/mock-invoices";

export async function GET() {
  // TODO: authenticate user via Supabase session
  // TODO: fetch Stripe customer ID from merchants table
  // TODO: call stripe.invoices.list({ customer: stripeCustomerId, limit: 24 })

  return NextResponse.json({
    invoices: MOCK_INVOICES,
  });
}
