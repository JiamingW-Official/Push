import { NextRequest, NextResponse } from "next/server";
import {
  MOCK_QR_CODES,
  type QRCodeRecord,
} from "@/lib/attribution/mock-qr-codes-extended";
import { badRequest } from "@/lib/api/responses";

// TODO: wire to Supabase; generate signed QR payload

// GET /api/merchant/qr-codes — list all QR codes for current merchant
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const campaign_id = searchParams.get("campaign_id");
  const poster_type = searchParams.get("poster_type");
  const status = searchParams.get("status"); // "active" | "disabled"

  let codes = [...MOCK_QR_CODES];

  if (campaign_id) {
    codes = codes.filter((q) => q.campaign_id === campaign_id);
  }
  if (poster_type) {
    codes = codes.filter((q) => q.poster_type === poster_type);
  }
  if (status === "active") {
    codes = codes.filter((q) => !q.disabled);
  } else if (status === "disabled") {
    codes = codes.filter((q) => q.disabled);
  }

  return NextResponse.json({ data: codes, total: codes.length });
}

// POST /api/merchant/qr-codes — create a new QR code
export async function POST(request: NextRequest) {
  let body: Partial<QRCodeRecord>;
  try {
    body = await request.json();
  } catch {
    return badRequest("Invalid JSON body");
  }

  const { campaign_id, poster_type, hero_message, sub_message } = body;

  if (!campaign_id || !poster_type || !hero_message || !sub_message) {
    return badRequest(
      "campaign_id, poster_type, hero_message, sub_message required",
    );
  }

  // TODO: generate real QR record in Supabase
  // TODO: generate signed QR payload + store scan URL
  const newCode: QRCodeRecord = {
    id: `qr-${Date.now()}`,
    campaign_id,
    campaign_name: body.campaign_name ?? "Campaign",
    poster_type,
    hero_message,
    sub_message,
    scan_url: `/scan/qr-${Date.now()}`,
    scan_count: 0,
    conversion_count: 0,
    created_at: new Date().toISOString(),
    last_active_at: new Date().toISOString(),
    disabled: false,
  };

  return NextResponse.json({ data: newCode }, { status: 201 });
}
