import { NextRequest, NextResponse } from "next/server";
import { MOCK_PAYOUT_METHODS } from "@/lib/wallet/mock-wallet";

// TODO: wire to Stripe Connect + Supabase

export async function GET() {
  // TODO: auth check + fetch from supabase where creator_id = session.user.creator_id
  return NextResponse.json({ methods: MOCK_PAYOUT_METHODS });
}

export async function POST(request: NextRequest) {
  // TODO: auth check
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { type, detail } = body as { type?: string; detail?: string };
  if (!type || !detail) {
    return NextResponse.json(
      { error: "type and detail are required" },
      { status: 400 },
    );
  }

  // TODO: validate via Stripe Connect OAuth or Venmo/Bank/PayPal verification
  const newMethod = {
    id: `pm-${Date.now()}`,
    type,
    name:
      type === "stripe"
        ? "Stripe Connect"
        : type === "venmo"
          ? "Venmo"
          : type === "bank"
            ? "Bank Account"
            : "PayPal",
    detail,
    status: type === "bank" ? "pending" : "verified",
    isDefault: false,
    fee:
      type === "stripe"
        ? "0.25%"
        : type === "venmo"
          ? "Free"
          : type === "bank"
            ? "$1.50"
            : "1.5% + $0.25",
    feeRate:
      type === "stripe"
        ? 0.0025
        : type === "bank"
          ? 0
          : type === "paypal"
            ? 0.015
            : 0,
    addedAt: new Date().toISOString().split("T")[0],
  };

  return NextResponse.json({ method: newMethod }, { status: 201 });
}
