import { NextRequest, NextResponse } from "next/server";
import { MOCK_WITHDRAWALS } from "@/lib/wallet/mock-wallet";

// TODO: wire to Stripe Connect + Supabase

export async function GET(request: NextRequest) {
  // TODO: auth check + fetch from supabase where creator_id = session.user.creator_id
  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");
  const method = searchParams.get("method");
  const year = searchParams.get("year");

  let results = [...MOCK_WITHDRAWALS];

  if (status) results = results.filter((w) => w.status === status);
  if (method) results = results.filter((w) => w.methodType === method);
  if (year) results = results.filter((w) => w.date.startsWith(year));

  return NextResponse.json({ withdrawals: results });
}

export async function POST(request: NextRequest) {
  // TODO: auth check
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { amount, methodId } = body as { amount?: number; methodId?: string };
  if (!amount || !methodId) {
    return NextResponse.json(
      { error: "amount and methodId are required" },
      { status: 400 },
    );
  }

  if (amount <= 0) {
    return NextResponse.json(
      { error: "Amount must be greater than 0" },
      { status: 422 },
    );
  }

  // TODO: initiate Stripe payout or Venmo/Bank transfer
  // TODO: deduct from creator.earnings_available in supabase
  const withdrawal = {
    id: `wd-${Date.now()}`,
    date: new Date().toISOString().split("T")[0],
    methodId,
    amount,
    fee: 0, // TODO: calculate based on method
    net: amount,
    status: "processing",
  };

  return NextResponse.json({ withdrawal }, { status: 201 });
}
