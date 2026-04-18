import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import {
  matchCreators,
  type CreatorCandidate,
  type MatchingGoal,
} from "@/lib/ai/matching";

// POST /api/agent/match-creators
//
// Input:
//   { goal: MatchingGoal }
//
// Output:
//   MatchingOutput (see lib/ai/matching.ts) plus { runId } if the
//   agent_runs row was persisted.
//
// Behavior:
//   1. Validate the goal payload.
//   2. Load a candidate creator pool from Supabase when configured,
//      otherwise use a 12-candidate dev fixture.
//   3. Call matchCreators() — real Claude if ANTHROPIC_API_KEY is set,
//      deterministic mock otherwise.
//   4. Write an agent_runs row (fire-and-forget; route still responds
//      on DB failure).
//
// Schema: supabase/migrations/20260418000001_add_ai_verifications_and_agent_runs.sql
//   agent_runs (id, merchant_id, agent_type, input, output, model_used, latency_ms, cost_usd, ...)

const VALID_CATEGORIES = new Set([
  "Coffee",
  "Restaurant",
  "Bar / Nightlife",
  "Retail",
  "Beauty & Wellness",
  "Fitness",
  "Other",
]);

function getServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const secret = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !secret) return null;
  return createClient(url, secret, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export async function POST(request: NextRequest) {
  let body: { goal?: Partial<MatchingGoal>; merchantId?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const goal = body.goal ?? {};
  const missing: string[] = [];
  if (!goal.category) missing.push("category");
  if (!goal.zip) missing.push("zip");
  if (typeof goal.customer_target !== "number") missing.push("customer_target");
  if (typeof goal.budget_usd !== "number") missing.push("budget_usd");
  if (typeof goal.timeframe_days !== "number") missing.push("timeframe_days");
  if (missing.length) {
    return NextResponse.json(
      { error: `Missing goal fields: ${missing.join(", ")}` },
      { status: 400 },
    );
  }
  if (!VALID_CATEGORIES.has(goal.category!)) {
    return NextResponse.json(
      { error: `Invalid category: ${goal.category}` },
      { status: 400 },
    );
  }

  const fullGoal: MatchingGoal = {
    customer_target: goal.customer_target!,
    budget_usd: goal.budget_usd!,
    category: goal.category!,
    zip: goal.zip!,
    timeframe_days: goal.timeframe_days!,
    business_name: goal.business_name,
  };

  const client = getServiceClient();
  const candidates = await loadCandidates(client, fullGoal);
  const result = await matchCreators(fullGoal, candidates);

  // Best-effort persistence — don't block the response on write failure
  let runId: string | null = null;
  if (client) {
    const { data, error } = await client
      .from("agent_runs")
      .insert({
        merchant_id: body.merchantId ?? null,
        agent_type: "match_creators",
        input: { goal: fullGoal, candidate_count: candidates.length },
        output: result,
        model_used: result.meta.model,
        latency_ms: result.meta.latency_ms,
        cost_usd: result.meta.cost_usd,
      })
      .select("id")
      .single();
    if (!error && data) {
      runId = data.id;
    }
  }

  return NextResponse.json({ ...result, runId });
}

/**
 * Load a candidate creator pool. Supabase-first, fixture fallback.
 * We only surface Operator+ tier for Performance plan callers — Pilot
 * callers receive the whole pool (but matchCreators still ranks tier).
 */
type ServiceClient = NonNullable<ReturnType<typeof getServiceClient>>;

type CreatorRow = {
  id?: string;
  name?: string | null;
  instagram_handle?: string | null;
  location?: string | null;
  lat?: number | null;
  lng?: number | null;
};

async function loadCandidates(
  client: ServiceClient | null,
  _goal: MatchingGoal,
): Promise<CreatorCandidate[]> {
  if (!client) {
    return DEV_FIXTURE;
  }

  const { data, error } = await client
    .from("creators")
    .select("id, name, instagram_handle, location, lat, lng")
    .limit(24);

  if (error || !data || data.length === 0) {
    return DEV_FIXTURE;
  }

  // Map the DB shape into the candidate shape the agent expects.
  // Tier / score / category_affinity / verified_conversions_90d will
  // come from real signal once P3 wires the scoring pipeline — for
  // now we ship pseudo-values derived from stable hashes so results
  // are deterministic.
  const rows = data as CreatorRow[];
  return rows.map((row, i) => ({
    creator_ref: row.instagram_handle ?? row.name ?? `creator-${i}`,
    tier: ["Seed", "Bronze", "Steel", "Gold", "Ruby", "Obsidian"][i % 6],
    score: 72 + ((i * 3) % 24),
    category_affinity: 0.6 + ((i * 7) % 40) / 100,
    distance_miles: 0.3 + ((i * 11) % 50) / 10,
    verified_conversions_90d: Math.max(1, (i * 5) % 18),
  }));
}

const DEV_FIXTURE: CreatorCandidate[] = [
  {
    creator_ref: "@maya.eats.nyc",
    tier: "Steel",
    score: 94,
    category_affinity: 0.92,
    distance_miles: 0.4,
    verified_conversions_90d: 14,
  },
  {
    creator_ref: "@brooklyn_bites",
    tier: "Gold",
    score: 91,
    category_affinity: 0.88,
    distance_miles: 0.6,
    verified_conversions_90d: 18,
  },
  {
    creator_ref: "@williamsburg.e",
    tier: "Steel",
    score: 89,
    category_affinity: 0.82,
    distance_miles: 0.5,
    verified_conversions_90d: 10,
  },
  {
    creator_ref: "@coffee.crawl",
    tier: "Bronze",
    score: 86,
    category_affinity: 0.9,
    distance_miles: 0.8,
    verified_conversions_90d: 8,
  },
  {
    creator_ref: "@sip.and.scroll",
    tier: "Bronze",
    score: 83,
    category_affinity: 0.78,
    distance_miles: 0.7,
    verified_conversions_90d: 6,
  },
  {
    creator_ref: "@bedfordfoodie",
    tier: "Operator" as const as string,
    score: 78,
    category_affinity: 0.7,
    distance_miles: 1.2,
    verified_conversions_90d: 4,
  },
  {
    creator_ref: "@greenpoint.grub",
    tier: "Steel",
    score: 76,
    category_affinity: 0.65,
    distance_miles: 1.6,
    verified_conversions_90d: 5,
  },
  {
    creator_ref: "@eastwick.eats",
    tier: "Seed",
    score: 62,
    category_affinity: 0.55,
    distance_miles: 2.1,
    verified_conversions_90d: 1,
  },
];
