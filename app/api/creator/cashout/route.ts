import { NextRequest, NextResponse } from "next/server";

// TODO: wire to Stripe Connect + Supabase
// POST /api/creator/cashout — initiates a cashout request

type CashoutMethod = "stripe_connect" | "venmo";

type CashoutBody = {
  amount: number;
  method: CashoutMethod;
  accountId?: string; // Stripe Connect account ID or Venmo handle
};

export async function POST(request: NextRequest) {
  // TODO: authenticate via Supabase session
  // const supabase = createServerClient(...)
  // const { data: { user } } = await supabase.auth.getUser()
  // if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  let body: CashoutBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 },
    );
  }

  const { amount, method } = body;

  if (!amount || amount <= 0) {
    return NextResponse.json(
      { error: "Invalid cashout amount" },
      { status: 400 },
    );
  }

  if (!method || !["stripe_connect", "venmo"].includes(method)) {
    return NextResponse.json(
      { error: "Invalid cashout method" },
      { status: 400 },
    );
  }

  // Minimum cashout is $10
  if (amount < 10) {
    return NextResponse.json(
      { error: "Minimum cashout amount is $10.00" },
      { status: 400 },
    );
  }

  // TODO: verify cleared balance >= amount from Supabase
  // TODO: create Stripe Transfer to connected account
  // TODO: record cashout request in payouts table
  // TODO: send confirmation email via Resend

  const mockTransferId = `tr_mock_${Date.now()}`;
  const estimatedArrival =
    method === "stripe_connect" ? "1-2 business days" : "Instant";

  return NextResponse.json({
    success: true,
    transferId: mockTransferId,
    amount,
    method,
    estimatedArrival,
    message: `Cashout of $${amount.toFixed(2)} initiated via ${method === "stripe_connect" ? "Stripe" : "Venmo"}.`,
  });
}
