// GET /api/merchant/campaigns/:id — single campaign detail
// Demo mode: looks up from playtestCampaigns store or hardcoded DEMO_CAMPAIGNS.
// Production: queries Supabase with merchant session guard.

import { type NextRequest, NextResponse } from "next/server";
import { notFound, serverError } from "@/lib/api/responses";
import { requireMerchantSession } from "@/lib/api/merchant-auth";
import { getDemoAudience } from "@/lib/api/demo-short-circuit";
import { supabase } from "@/lib/db";
import { playtestCampaigns } from "@/lib/playtest/store";

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
    end_date: "2026-05-15",
    status: "active",
    budget_total: 20000,
    budget_remaining: 11000,
    accepted_creators: 18,
    tags: ["coffee"],
    metadata: { category: "coffee" },
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
    end_date: "2026-05-22",
    status: "draft",
    budget_total: 12000,
    budget_remaining: 12000,
    accepted_creators: 0,
    tags: ["bakery"],
    metadata: { category: "bakery" },
    created_at: "2026-04-18T14:00:00Z",
  },
] as const;

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  // Hardcoded demo campaigns are always safe to serve without a session
  // (they're static mock data, not user-specific).
  const demoCampaign = DEMO_CAMPAIGNS.find((c) => c.id === id);
  if (demoCampaign) return NextResponse.json(demoCampaign);

  // Playtest campaigns (user-created in demo mode) — check store first
  const playtest = playtestCampaigns.get(id);
  if (playtest) {
    return NextResponse.json({
      id: playtest.id,
      title: playtest.title,
      description: playtest.description,
      payout: playtest.payout,
      spots_total: playtest.spotsTotal,
      spots_remaining: playtest.spotsRemaining,
      deadline: playtest.deadline,
      end_date: playtest.deadline,
      status: "active",
      budget_total: playtest.payout * playtest.spotsTotal * 100,
      budget_remaining: playtest.payout * playtest.spotsRemaining * 100,
      accepted_creators: playtest.spotsTotal - playtest.spotsRemaining,
      tags: [playtest.category],
      metadata: { category: playtest.category },
      created_at: playtest.createdAt,
    });
  }

  // In demo mode, nothing else exists
  const isDemo = (await getDemoAudience()) === "merchant";
  if (isDemo) return notFound("Campaign");

  // Production — Supabase with session guard
  const gate = await requireMerchantSession();
  if (!gate.ok) return gate.response;

  const { data, error } = await supabase
    .from("campaigns")
    .select(
      "id, title, description, payout, spots_total, spots_remaining, deadline, status, metadata, created_at",
    )
    .eq("id", id)
    .eq("merchant_id", gate.merchantId)
    .single();

  if (error || !data) return notFound("Campaign");
  return NextResponse.json(data);
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  const isDemo = (await getDemoAudience()) === "merchant";
  if (isDemo) {
    // Playtest: update spotsRemaining if provided
    const body = (await req.json().catch(() => ({}))) as Record<
      string,
      unknown
    >;
    const playtest = playtestCampaigns.get(id);
    if (playtest && typeof body.spots_remaining === "number") {
      playtestCampaigns.set(id, {
        ...playtest,
        spotsRemaining: body.spots_remaining as number,
      });
    }
    return NextResponse.json({ id, updated: true });
  }

  const gate = await requireMerchantSession();
  if (!gate.ok) return gate.response;

  let body: Record<string, unknown>;
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("campaigns")
    .update(body)
    .eq("id", id)
    .eq("merchant_id", gate.merchantId)
    .select("id, title, status")
    .single();

  if (error || !data) return serverError("campaign-patch", error);
  return NextResponse.json(data);
}
