import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase";

// POST /api/creator/campaigns/[id]/apply
// Body: {}
// Returns: { success, applicationId, queuePosition }
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const campaignId = (await params).id;

  // Check campaign exists and is active
  const { data: campaign, error: campaignError } = await supabase
    .from("campaigns")
    .select("id, spots_remaining, tier_required, status")
    .eq("id", campaignId)
    .eq("status", "active")
    .single();

  if (campaignError || !campaign) {
    return NextResponse.json(
      { error: "Campaign not found or inactive" },
      { status: 404 },
    );
  }

  if (campaign.spots_remaining <= 0) {
    return NextResponse.json({ error: "No spots remaining" }, { status: 409 });
  }

  // Check creator eligibility
  const { data: creator } = await supabase
    .from("creators")
    .select("id, tier")
    .eq("user_id", user.id)
    .single();

  if (!creator) {
    return NextResponse.json(
      { error: "Creator profile not found" },
      { status: 404 },
    );
  }

  // Check for existing application
  const { data: existing } = await supabase
    .from("applications")
    .select("id")
    .eq("campaign_id", campaignId)
    .eq("creator_id", creator.id)
    .not("status", "eq", "withdrawn")
    .single();

  if (existing) {
    return NextResponse.json({ error: "Already applied" }, { status: 409 });
  }

  // Create application
  const { data: application, error: applyError } = await supabase
    .from("applications")
    .insert({
      campaign_id: campaignId,
      creator_id: creator.id,
      status: "pending",
      milestone: "accepted",
      payout: 0, // set on acceptance
    })
    .select("id")
    .single();

  if (applyError || !application) {
    return NextResponse.json({ error: "Failed to apply" }, { status: 500 });
  }

  // Get queue position (count of pending/accepted apps for this campaign)
  const { count } = await supabase
    .from("applications")
    .select("*", { count: "exact", head: true })
    .eq("campaign_id", campaignId)
    .in("status", ["pending", "accepted"]);

  return NextResponse.json({
    success: true,
    applicationId: application.id,
    queuePosition: count ?? 1,
  });
}
