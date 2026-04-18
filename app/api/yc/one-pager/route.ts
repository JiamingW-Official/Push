import { NextRequest, NextResponse } from "next/server";

// TODO: generate PDF with @react-pdf/renderer or serve a pre-built asset from /public/push-one-pager.pdf

// GET /api/yc/one-pager — serve one-pager PDF for YC investors
export async function GET(_req: NextRequest) {
  return NextResponse.json(
    {
      status: "coming_soon",
      message:
        "One-pager PDF will be available once the deck is finalized. Email wangjiamingaas@gmail.com for early access.",
      email: "wangjiamingaas@gmail.com",
    },
    { status: 200 },
  );
}
