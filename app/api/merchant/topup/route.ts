import { NextRequest, NextResponse } from "next/server";

// TODO: wire to Stripe + Supabase
// POST /api/merchant/topup — initiates a balance top-up via Stripe

type TopupBody = {
  amount: number; // USD cents or dollars depending on integration
  currency?: string;
};

export async function POST(request: NextRequest) {
  // TODO: authenticate via Supabase session
  // const supabase = createServerClient(...)
  // const { data: { user } } = await supabase.auth.getUser()
  // if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  let body: TopupBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 },
    );
  }

  const { amount, currency = "usd" } = body;

  if (!amount || amount <= 0) {
    return NextResponse.json(
      { error: "Invalid top-up amount" },
      { status: 400 },
    );
  }

  const PRESET_AMOUNTS = [500, 1000, 2500, 5000];
  if (!PRESET_AMOUNTS.includes(amount) && amount < 100) {
    return NextResponse.json(
      { error: "Minimum top-up is $100" },
      { status: 400 },
    );
  }

  // TODO: create Stripe PaymentIntent
  // TODO: on success, credit merchant balance in Supabase
  // TODO: send receipt email via Resend

  const mockPaymentIntentId = `pi_mock_${Date.now()}`;
  const mockClientSecret = `pi_mock_${Date.now()}_secret_mock`;

  return NextResponse.json({
    success: true,
    paymentIntentId: mockPaymentIntentId,
    clientSecret: mockClientSecret, // Frontend uses this to confirm with Stripe.js
    amount,
    currency,
    message: `Top-up of $${amount.toFixed(2)} initiated. Funds will be available after payment confirmation.`,
  });
}
