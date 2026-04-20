import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

// Mutates DB (creators.push_score + tier) + reads auth session. Opt out
// of Next's route-level cache so every request sees current state.
export const dynamic = "force-dynamic";

// Tier thresholds based on Push Score and campaigns completed
function getTier(score: number, completed: number): string {
  if (completed < 3) return "seed";
  if (score >= 88) return "partner";
  if (score >= 78) return "closer";
  if (score >= 65) return "proven";
  if (score >= 55) return "operator";
  if (score >= 40) return "explorer";
  return "seed";
}

export async function POST(_request: NextRequest) {
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

  // Get creator record
  const { data: creator, error: creatorErr } = await supabase
    .from("creators")
    .select("id, campaigns_completed, campaigns_accepted")
    .eq("user_id", user.id)
    .single();

  if (creatorErr || !creator)
    return NextResponse.json({ error: "Creator not found" }, { status: 404 });

  // Get settled submissions for score calculation
  const { data: submissions } = await supabase
    .from("creator_submissions")
    .select("content_rating, merchant_rebook_score, engagement_rate, milestone")
    .eq("creator_id", creator.id)
    .eq("milestone", "settled");

  // --- Score dimensions ---

  // Completion Rate (30%): completed / accepted × 100
  const completionRate =
    creator.campaigns_accepted > 0
      ? (creator.campaigns_completed / creator.campaigns_accepted) * 100
      : 0;

  // Reliability (20%): simplified as completion_rate × 0.9
  const reliability = Math.min(completionRate * 0.9, 100);

  const settledCount = submissions?.length ?? 0;

  // Quality (25%): avg content_rating / 5 × 100
  const avgQuality =
    settledCount > 0
      ? (submissions!.reduce((s, r) => s + (r.content_rating ?? 0), 0) /
          settledCount /
          5) *
        100
      : 0;

  // Merchant Satisfaction (15%): avg rebook_score / 5 × 100
  const avgSatisfaction =
    settledCount > 0
      ? (submissions!.reduce((s, r) => s + (r.merchant_rebook_score ?? 0), 0) /
          settledCount /
          5) *
        100
      : 0;

  // Engagement (10%): min(avg_engagement_rate / 0.03, 1) × 100
  const avgEngagement =
    settledCount > 0
      ? Math.min(
          submissions!.reduce((s, r) => s + (r.engagement_rate ?? 0), 0) /
            settledCount /
            0.03,
          1,
        ) * 100
      : 0;

  // Weighted Push Score
  const score =
    completionRate * 0.3 +
    reliability * 0.2 +
    avgQuality * 0.25 +
    avgSatisfaction * 0.15 +
    avgEngagement * 0.1;

  const clampedScore = Math.max(0, Math.min(100, score));
  const tier = getTier(clampedScore, creator.campaigns_completed);

  // Persist updated score and tier
  const { error: updateErr } = await supabase
    .from("creators")
    .update({
      push_score: parseFloat(clampedScore.toFixed(1)),
      tier,
      score_updated_at: new Date().toISOString(),
    })
    .eq("id", creator.id);

  if (updateErr)
    return NextResponse.json({ error: updateErr.message }, { status: 500 });

  return NextResponse.json({
    score: clampedScore,
    tier,
    dimensions: {
      completionRate,
      reliability,
      avgQuality,
      avgSatisfaction,
      avgEngagement,
    },
  });
}
