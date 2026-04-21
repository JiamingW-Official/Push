// POST /api/merchant/campaigns — create a new campaign
// GET  /api/merchant/campaigns — list this merchant's campaigns
//
// v5.3-EXEC P1-2 wiring: real Supabase insert into public.campaigns.
// Marketplace-style fields (category / tier / commissionSplit / contentType /
// platform) go into campaigns.metadata JSONB; core attribution fields
// (title / description / payout / spots_total / deadline) go into columns.

import { NextRequest } from "next/server";
import { badRequest, serverError, success } from "@/lib/api/responses";
import { requireMerchantSession } from "@/lib/api/merchant-auth";
import { supabase } from "@/lib/db";

interface CreateBody {
  name?: string;
  category?: string;
  description?: string;
  budget?: number;
  tier?: string | number;
  commissionSplit?: number;
  contentType?: string;
  platform?: string;
  dueDate?: string;
  spots_total?: number;
  payout?: number;
}

export async function GET() {
  const gate = await requireMerchantSession();
  if (!gate.ok) return gate.response;

  const { data, error } = await supabase
    .from("campaigns")
    .select(
      "id, title, description, payout, spots_total, spots_remaining, deadline, status, metadata, created_at",
    )
    .eq("merchant_id", gate.merchantId)
    .order("created_at", { ascending: false });

  if (error) return serverError("merchant-campaigns-list", error);
  return success({ campaigns: data ?? [] });
}

export async function POST(req: NextRequest) {
  const gate = await requireMerchantSession();
  if (!gate.ok) return gate.response;

  let body: CreateBody;
  try {
    body = (await req.json()) as CreateBody;
  } catch {
    return badRequest("Body must be valid JSON");
  }

  const {
    name,
    category,
    description,
    budget,
    tier,
    commissionSplit,
    contentType,
    platform,
    dueDate,
  } = body;

  if (!name || typeof name !== "string") {
    return badRequest("`name` is required");
  }
  if (!description || typeof description !== "string") {
    return badRequest("`description` is required");
  }
  if (typeof budget !== "number" || budget < 50 || budget > 50_000) {
    return badRequest("`budget` must be a number between 50 and 50,000");
  }
  if (!dueDate || typeof dueDate !== "string") {
    return badRequest("`dueDate` is required (ISO date)");
  }

  // Payout-per-claim defaults to $5 if caller didn't set it, and spots_total
  // is derived by floor(budget / payout) unless passed in explicitly. This
  // keeps the "budget→payout" mental model without forcing the merchant UI
  // to ship two numbers.
  const payout = typeof body.payout === "number" ? body.payout : 5;
  const spotsTotal =
    typeof body.spots_total === "number"
      ? body.spots_total
      : Math.max(1, Math.floor(budget / Math.max(1, payout)));

  const metadata = {
    category: category ?? null,
    tier: tier ?? null,
    commissionSplit: commissionSplit ?? null,
    contentType: contentType ?? null,
    platform: platform ?? null,
    budget,
  };

  const { data, error } = await supabase
    .from("campaigns")
    .insert([
      {
        merchant_id: gate.merchantId,
        title: name,
        description,
        payout,
        spots_total: spotsTotal,
        spots_remaining: spotsTotal,
        deadline: dueDate,
        status: "draft", // admin approval gate (P3-2) moves it to active
        metadata,
      },
    ])
    .select(
      "id, title, description, payout, spots_total, deadline, status, metadata, created_at",
    )
    .single();

  if (error) return serverError("merchant-campaigns-insert", error);

  return success({ campaign: data });
}
