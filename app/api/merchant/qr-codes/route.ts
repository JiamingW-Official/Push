// POST /api/merchant/qr-codes — create a QR record for a campaign
// GET  /api/merchant/qr-codes — list this merchant's QR codes
//
// v5.3-EXEC P1-1 wiring: real Supabase insert into public.qr_codes.
// Owner scope enforced via requireMerchantSession → merchantId filter.

import { NextRequest } from "next/server";
import {
  badRequest,
  forbidden,
  serverError,
  success,
} from "@/lib/api/responses";
import { requireMerchantSession } from "@/lib/api/merchant-auth";
import { demoShortCircuit } from "@/lib/api/demo-short-circuit";
import { supabase } from "@/lib/db";

const DEMO_QR_ROWS = [
  {
    id: "demo-qr-bsc-001",
    campaign_id: "demo-campaign-001",
    poster_type: "table-tent",
    hero_message: "Free matcha latte",
    sub_message: "Scan, film a 30s reel, redeem.",
    scan_count: 48,
    conversion_count: 31,
    disabled: false,
    created_at: "2026-04-01T10:00:00Z",
    last_active_at: "2026-04-19T18:42:00Z",
  },
  {
    id: "demo-qr-bsc-002",
    campaign_id: "demo-campaign-001",
    poster_type: "window-sticker",
    hero_message: "15% off any drink",
    sub_message: "Creators scan here to claim.",
    scan_count: 22,
    conversion_count: 17,
    disabled: false,
    created_at: "2026-04-02T09:00:00Z",
    last_active_at: "2026-04-20T08:11:00Z",
  },
];

const POSTER_TYPES = new Set([
  "a4",
  "table-tent",
  "window-sticker",
  "cash-register",
]);

interface CreateBody {
  campaign_id?: string;
  poster_type?: string;
  hero_message?: string;
  sub_message?: string;
}

export async function GET(request: NextRequest) {
  const demo = await demoShortCircuit("merchant", () => ({
    qr_codes: DEMO_QR_ROWS,
    total: DEMO_QR_ROWS.length,
  }));
  if (demo) return demo;

  const gate = await requireMerchantSession();
  if (!gate.ok) return gate.response;

  const { searchParams } = new URL(request.url);
  const campaignId = searchParams.get("campaign_id");
  const posterType = searchParams.get("poster_type");
  const status = searchParams.get("status");

  let q = supabase
    .from("qr_codes")
    .select(
      "id, campaign_id, poster_type, hero_message, sub_message, scan_count, conversion_count, disabled, created_at, last_active_at",
    )
    .eq("merchant_id", gate.merchantId);

  if (campaignId) q = q.eq("campaign_id", campaignId);
  if (posterType) q = q.eq("poster_type", posterType);
  if (status === "active") q = q.eq("disabled", false);
  else if (status === "disabled") q = q.eq("disabled", true);

  const { data, error } = await q.order("created_at", { ascending: false });
  if (error) return serverError("merchant-qr-codes-list", error);

  return success({ qr_codes: data ?? [], total: (data ?? []).length });
}

export async function POST(request: NextRequest) {
  const demo = await demoShortCircuit("merchant", async () => {
    const body = (await request.json().catch(() => ({}))) as Record<
      string,
      unknown
    >;
    return {
      qr_code: {
        id: `demo-qr-${Date.now().toString(36)}`,
        campaign_id: body.campaign_id ?? "demo-campaign-001",
        poster_type: body.poster_type ?? "table-tent",
        hero_message: body.hero_message ?? "Demo QR",
        sub_message: body.sub_message ?? "Created in demo mode",
        scan_count: 0,
        conversion_count: 0,
        disabled: false,
        created_at: new Date().toISOString(),
      },
    };
  });
  if (demo) return demo;

  const gate = await requireMerchantSession();
  if (!gate.ok) return gate.response;

  let body: CreateBody;
  try {
    body = (await request.json()) as CreateBody;
  } catch {
    return badRequest("Body must be valid JSON");
  }

  const { campaign_id, poster_type, hero_message, sub_message } = body;

  if (!campaign_id || typeof campaign_id !== "string") {
    return badRequest("`campaign_id` is required");
  }
  if (!poster_type || !POSTER_TYPES.has(poster_type)) {
    return badRequest("`poster_type` invalid", {
      allowed: Array.from(POSTER_TYPES),
    });
  }
  if (!hero_message || typeof hero_message !== "string") {
    return badRequest("`hero_message` is required");
  }
  if (!sub_message || typeof sub_message !== "string") {
    return badRequest("`sub_message` is required");
  }

  // Ownership check: campaign must belong to this merchant.
  const { data: campaign, error: campErr } = await supabase
    .from("campaigns")
    .select("id, merchant_id")
    .eq("id", campaign_id)
    .eq("merchant_id", gate.merchantId)
    .maybeSingle();

  if (campErr) return serverError("merchant-qr-codes-owner-check", campErr);
  if (!campaign) return forbidden("Campaign not owned by this merchant");

  const { data, error } = await supabase
    .from("qr_codes")
    .insert([
      {
        campaign_id,
        merchant_id: gate.merchantId,
        poster_type,
        hero_message,
        sub_message,
      },
    ])
    .select(
      "id, campaign_id, poster_type, hero_message, sub_message, scan_count, conversion_count, disabled, created_at",
    )
    .single();

  if (error) return serverError("merchant-qr-codes-insert", error);

  return success({ qr_code: data });
}
