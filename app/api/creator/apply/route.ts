import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import {
  unauthorized,
  badRequest,
  notFound,
  serverError,
} from "@/lib/api/responses";

// Mutates DB (campaign_applications) + reads auth session. Opt out of
// Next's route-level cache so every request sees current state.
export const dynamic = "force-dynamic";

// Tier rank order for eligibility comparison
const TIER_RANK: Record<string, number> = {
  seed: 0,
  explorer: 1,
  operator: 2,
  proven: 3,
  closer: 4,
  partner: 5,
};

export async function POST(request: NextRequest) {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    { cookies: { getAll: () => cookieStore.getAll(), setAll: () => {} } },
  );

  // Auth check
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return unauthorized();

  // Parse and validate request body
  let body: { campaign_id?: string };
  try {
    body = await request.json();
  } catch {
    return badRequest("Invalid JSON body");
  }

  const { campaign_id } = body;
  if (!campaign_id || typeof campaign_id !== "string") {
    return badRequest("campaign_id is required");
  }

  // Fetch creator record
  const { data: creator, error: creatorErr } = await supabase
    .from("creators")
    .select("id, tier")
    .eq("user_id", user.id)
    .single();

  if (creatorErr || !creator) return notFound("Creator not found");

  // Fetch campaign — verify it exists, is active, and has open spots
  const { data: campaign, error: campaignErr } = await supabase
    .from("campaigns")
    .select("id, status, spots_remaining, tier_required")
    .eq("id", campaign_id)
    .single();

  if (campaignErr || !campaign) return notFound("Campaign not found");

  if (campaign.status !== "active")
    return NextResponse.json(
      { error: "Campaign is not accepting applications" },
      { status: 422 },
    );

  if ((campaign.spots_remaining ?? 0) <= 0)
    return NextResponse.json(
      { error: "No spots remaining on this campaign" },
      { status: 422 },
    );

  // Tier eligibility check
  const creatorRank = TIER_RANK[creator.tier] ?? 0;
  const requiredRank = TIER_RANK[campaign.tier_required] ?? 0;
  if (creatorRank < requiredRank) {
    return NextResponse.json(
      {
        error: `Creator tier '${creator.tier}' does not meet the required tier '${campaign.tier_required}'`,
      },
      { status: 422 },
    );
  }

  // Duplicate application check
  const { data: existing } = await supabase
    .from("campaign_applications")
    .select("id")
    .eq("creator_id", creator.id)
    .eq("campaign_id", campaign_id)
    .maybeSingle();

  if (existing)
    return NextResponse.json(
      { error: "Already applied to this campaign" },
      { status: 409 },
    );

  // Insert application record (status: pending)
  const { data: application, error: appErr } = await supabase
    .from("campaign_applications")
    .insert({
      creator_id: creator.id,
      campaign_id,
      status: "pending",
    })
    .select("id")
    .single();

  if (appErr || !application)
    return serverError(
      "creator-apply",
      appErr ?? new Error("Failed to create application"),
    );

  // Insert submission record (milestone: accepted)
  const { error: submissionErr } = await supabase
    .from("creator_submissions")
    .insert({
      creator_id: creator.id,
      campaign_id,
      application_id: application.id,
      milestone: "accepted",
    });

  if (submissionErr) return serverError("creator-apply", submissionErr);

  // Decrement spots_remaining on campaign
  const { error: decrementErr } = await supabase
    .from("campaigns")
    .update({ spots_remaining: campaign.spots_remaining - 1 })
    .eq("id", campaign_id);

  if (decrementErr) return serverError("creator-apply", decrementErr);

  return NextResponse.json({ application_id: application.id, success: true });
}
