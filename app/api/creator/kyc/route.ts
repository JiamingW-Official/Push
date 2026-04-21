// TODO: wire to Supabase + Stripe Identity or Persona SDK
import { NextResponse } from "next/server";

export async function GET() {
  // Stub: return current KYC status
  return NextResponse.json({
    status: "unverified",
    message: "KYC status retrieved",
  });
}

export async function POST(request: Request) {
  // Stub: receive KYC submission payload
  const body = await request.json().catch(() => ({}));
  return NextResponse.json({
    success: true,
    status: "in_review",
    submittedAt: new Date().toISOString(),
    data: body,
  });
}
