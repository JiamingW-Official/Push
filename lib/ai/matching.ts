/* ============================================================
   Push AI — Matching agent wrapper
   Calls Anthropic Messages API with the matching prompt + a
   de-identified creator list. Falls back to a deterministic
   mock when ANTHROPIC_API_KEY is missing — shape-identical to
   the onboarding runMockAgent() so the UI can switch freely.
   ============================================================ */

import Anthropic from "@anthropic-ai/sdk";
import { MATCHING_SYSTEM_PROMPT } from "./prompts";

export interface MatchingGoal {
  customer_target: number;
  budget_usd: number;
  category: string;
  zip: string;
  timeframe_days: number;
  business_name?: string;
}

export interface CreatorCandidate {
  creator_ref: string;
  tier: string;
  score: number;
  category_affinity: number; // 0.0-1.0
  distance_miles: number;
  verified_conversions_90d: number;
}

export interface MatchingOutput {
  matches: {
    creator_ref: string;
    est_customers: number;
    reason: string;
  }[];
  brief: {
    headline: string;
    cta: string;
    tone: string;
    offer_hook: string;
  };
  prediction: {
    est_verified_customers: number;
    confidence: number;
    est_spend_usd: number;
    est_revenue_multiplier: number;
  };
  meta: {
    model: string;
    latency_ms: number;
    cost_usd: number;
    mock: boolean;
  };
}

const DEFAULT_MODEL =
  process.env.ANTHROPIC_MODEL_MATCHING ?? "claude-sonnet-4-6";

/**
 * Rank candidates against a merchant goal and return top matches,
 * a draft brief, and an ROI prediction.
 */
export async function matchCreators(
  goal: MatchingGoal,
  candidates: CreatorCandidate[],
): Promise<MatchingOutput> {
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    return mockMatchingOutput(goal, candidates);
  }

  const client = new Anthropic({ apiKey });
  const start = Date.now();

  const response = await client.messages.create({
    model: DEFAULT_MODEL,
    max_tokens: 1200,
    system: MATCHING_SYSTEM_PROMPT,
    messages: [
      {
        role: "user",
        content: [
          {
            type: "text",
            text: JSON.stringify({ goal, candidates }, null, 2),
          },
        ],
      },
    ],
  });

  const textBlock = response.content.find((b) => b.type === "text");
  if (!textBlock || textBlock.type !== "text") {
    throw new Error("Matching response missing text block");
  }

  const parsed = safeParseJson<Omit<MatchingOutput, "meta">>(textBlock.text);
  if (!parsed) {
    throw new Error(
      `Matching returned non-JSON text: ${textBlock.text.slice(0, 120)}`,
    );
  }

  return {
    ...parsed,
    meta: {
      model: response.model,
      latency_ms: Date.now() - start,
      cost_usd: estimateSonnetCost(
        response.usage.input_tokens,
        response.usage.output_tokens,
      ),
      mock: false,
    },
  };
}

/**
 * Deterministic mock that matches the live output shape and the
 * onboarding runMockAgent() fixture. Takes top-5 candidates by
 * (category_affinity * verified_conversions_90d / distance_miles).
 */
function mockMatchingOutput(
  goal: MatchingGoal,
  candidates: CreatorCandidate[],
): MatchingOutput {
  const ranked = [...candidates]
    .map((c) => ({
      ...c,
      rank:
        (c.category_affinity * (c.verified_conversions_90d + 1)) /
        Math.max(0.25, c.distance_miles),
    }))
    .sort((a, b) => b.rank - a.rank)
    .slice(0, 5);

  const target = goal.customer_target || 20;
  const perCreator = Math.max(
    3,
    Math.round(target / Math.max(1, ranked.length)),
  );

  const matches = ranked.map((c, i) => ({
    creator_ref: c.creator_ref,
    est_customers: Math.max(2, perCreator + (2 - Math.floor(i * 0.8))),
    reason: `Tier ${c.tier}, ${c.distance_miles.toFixed(1)}mi from merchant, ${c.verified_conversions_90d} verified conversions in last 90d.`,
  }));

  const estCustomers = matches.reduce((sum, m) => sum + m.est_customers, 0);

  return {
    matches,
    brief: {
      headline: `New in ${goal.zip || "Brooklyn"}: ${goal.business_name ?? "your shop"} — try it on Push`,
      cta: "Scan the QR at the counter for $5 off your first order",
      tone: "Editorial · warm · under-sold",
      offer_hook: "Hero offer — 7-day window, runs with Sustained backup",
    },
    prediction: {
      est_verified_customers: estCustomers,
      confidence: ranked.length >= 5 ? 0.91 : 0.7,
      est_spend_usd: estCustomers * 40,
      est_revenue_multiplier: 3.2,
    },
    meta: {
      model: "mock-matching",
      latency_ms: 1500,
      cost_usd: 0,
      mock: true,
    },
  };
}

function safeParseJson<T>(raw: string): T | null {
  const cleaned = raw
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/```\s*$/, "")
    .trim();
  try {
    return JSON.parse(cleaned) as T;
  } catch {
    return null;
  }
}

function estimateSonnetCost(input_tokens: number, output_tokens: number) {
  const inputUsd = (input_tokens / 1_000_000) * 3;
  const outputUsd = (output_tokens / 1_000_000) * 15;
  return Number((inputUsd + outputUsd).toFixed(6));
}
