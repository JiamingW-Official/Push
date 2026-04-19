import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { rateLimit, getIP } from "@/lib/rate-limit";

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
  if (!rateLimit(getIP(request), 10, 60_000)) {
    return NextResponse.json(
      { error: "Too many requests — try again in a minute" },
      { status: 429 },
    );
  }

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
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Parse and validate request body
  let body: { campaign_id?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { campaign_id } = body;
  if (!campaign_id || typeof campaign_id !== "string") {
    return NextResponse.json(
      { error: "campaign_id is required" },
      { status: 400 },
    );
  }

  // Fetch creator record
  const { data: creator, error: creatorErr } = await supabase
    .from("creators")
    .select("id, tier, onboarding_completed")
    .eq("user_id", user.id)
    .single();

  if (creatorErr || !creator)
    return NextResponse.json({ error: "Creator not found" }, { status: 404 });

  // A-03: Onboarding gate — creator must complete onboarding before applying
  // The onboarding_completed column is set when /creator/onboarding step 5 is submitted.
  if (creator.onboarding_completed === false) {
    return NextResponse.json(
      {
        error: "Complete onboarding before applying to campaigns",
        redirect: "/creator/onboarding",
      },
      { status: 403 },
    );
  }

  // Fetch campaign — verify it exists, is active, and has open spots
  const { data: campaign, error: campaignErr } = await supabase
    .from("campaigns")
    .select("id, status, spots_remaining, tier_required")
    .eq("id", campaign_id)
    .single();

  if (campaignErr || !campaign)
    return NextResponse.json({ error: "Campaign not found" }, { status: 404 });

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
    return NextResponse.json(
      { error: appErr?.message ?? "Failed to create application" },
      { status: 500 },
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

  if (submissionErr)
    return NextResponse.json({ error: submissionErr.message }, { status: 500 });

  // A-01 fix: Atomic decrement with optimistic lock — only decrements if
  // spots_remaining still matches our read value. Returns empty if someone
  // else claimed the last spot between our read and this write → 409.
  // Ideal: replace with a Postgres RPC `claim_campaign_spot(p_id)` that does
  // UPDATE ... WHERE spots_remaining > 0 RETURNING id in a single statement.
  const { data: decremented, error: decrementErr } = await supabase
    .from("campaigns")
    .update({ spots_remaining: campaign.spots_remaining - 1 })
    .eq("id", campaign_id)
    .eq("spots_remaining", campaign.spots_remaining)
    .select("id")
    .maybeSingle();

  if (decrementErr)
    return NextResponse.json({ error: decrementErr.message }, { status: 500 });

  if (!decremented) {
    // Another request claimed the last spot between our read and write
    return NextResponse.json(
      { error: "No spots remaining on this campaign" },
      { status: 409 },
    );
  }

  return NextResponse.json({ application_id: application.id, success: true });
}
