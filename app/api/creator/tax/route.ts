import { NextResponse } from "next/server";
import { MOCK_TAX_SUMMARY } from "@/lib/wallet/mock-wallet";

// TODO: wire to Supabase + IRS 1099 generation service

export async function GET() {
  // TODO: auth check + fetch aggregated earnings from supabase
  // TODO: integrate with 1099 provider (e.g. Track1099, TaxJar) for form generation
  return NextResponse.json({ tax: MOCK_TAX_SUMMARY });
}
