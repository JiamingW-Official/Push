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
import { demoShortCircuit } from "@/lib/api/demo-short-circuit";
import { supabase } from "@/lib/db";

const DEMO_CAMPAIGNS = [
  {
    id: "demo-campaign-001",
    title: "Free matcha for a 30-second reel",
    description:
      "Drop in, order matcha, film a short vertical. Tag @blankstreet.",
    payout: 5,
    spots_total: 40,
    spots_remaining: 22,
    deadline: "2026-05-15",
    status: "active",
    metadata: {
      category: "coffee",
      tier: "t2",
      commissionSplit: 0,
      contentType: "reel",
      platform: "tiktok",
      budget: 200,
    },
    created_at: "2026-04-01T10:00:00Z",
  },
  {
    id: "demo-campaign-002",
    title: "Bagel before 10 — tip us on the best schmear",
    description:
      "Morning-rush pre-9am visit. Show us your top 3 in a carousel.",
    payout: 4,
    spots_total: 30,
    spots_remaining: 30,
    deadline: "2026-05-22",
    status: "draft",
    metadata: {
      category: "bakery",
      tier: "t1",
      commissionSplit: 0,
      contentType: "carousel",
      platform: "instagram",
      budget: 120,
    },
    created_at: "2026-04-18T14:00:00Z",
  },
];

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
  const demo = await demoShortCircuit("merchant", () => ({
    campaigns: DEMO_CAMPAIGNS,
  }));
  if (demo) return demo;

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
  const demo = await demoShortCircuit("merchant", async () => {
    const body = (await req.json().catch(() => ({}))) as Record<
      string,
      unknown
    >;
    return {
      campaign: {
        id: `demo-campaign-${Date.now().toString(36)}`,
        title: typeof body.name === "string" ? body.name : "Demo Campaign",
        description:
          typeof body.description === "string" ? body.description : "",
        payout: typeof body.payout === "number" ? body.payout : 5,
        spots_total:
          typeof body.spots_total === "number" ? body.spots_total : 40,
        deadline:
          typeof body.dueDate === "string" ? body.dueDate : "2026-06-01",
        status: "draft",
        metadata: body,
        created_at: new Date().toISOString(),
      },
    };
  });
  if (demo) return demo;

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
