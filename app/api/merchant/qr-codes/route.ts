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
import { supabase } from "@/lib/db";

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
