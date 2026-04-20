import { NextRequest, NextResponse } from "next/server";
import {
  MOCK_DISPUTES,
  DisputeOutcome,
} from "@/lib/disputes/mock-admin-disputes";
import { requireAdminSession } from "@/lib/api/admin-auth";
import { notFound, badRequest } from "@/lib/api/responses";

export const dynamic = "force-dynamic";

type DecideBody = {
  outcome: DisputeOutcome;
  reasoning: string;
  split_pct?: number; // creator's share 0-100 (only for "split")
};

// POST /api/admin/disputes/[id]/decide
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const gate = await requireAdminSession();
  if (!gate.ok) return gate.response;

  const { id } = await params;

  const dispute = MOCK_DISPUTES.find((d) => d.id === id);
  if (!dispute) {
    return notFound("Dispute not found");
  }

  if (["resolved", "dismissed"].includes(dispute.status)) {
    return NextResponse.json(
      { error: "Dispute is already resolved" },
      { status: 409 },
    );
  }

  let body: DecideBody;
  try {
    body = await request.json();
  } catch {
    return badRequest("Invalid JSON body");
  }

  const { outcome, reasoning, split_pct } = body;

  if (!outcome || !reasoning) {
    return badRequest("outcome and reasoning are required");
  }

  const validOutcomes: DisputeOutcome[] = [
    "refund_creator",
    "refund_merchant",
    "split",
    "dismiss",
  ];
  if (!validOutcomes.includes(outcome)) {
    return badRequest("Invalid outcome");
  }

  if (outcome === "split") {
    if (split_pct === undefined || split_pct < 0 || split_pct > 100) {
      return badRequest("split_pct must be between 0 and 100");
    }
  }

  // Compute payout preview
  const creatorAmount =
    outcome === "refund_creator"
      ? dispute.amount
      : outcome === "split"
        ? Math.round(((split_pct ?? 50) / 100) * dispute.amount * 100) / 100
        : 0;

  const merchantCredit = dispute.amount - creatorAmount;

  const resolvedAt = new Date().toISOString();

  // In production this would persist to DB; here we return computed result
  return NextResponse.json({
    success: true,
    dispute_id: id,
    outcome,
    outcome_reasoning: reasoning,
    outcome_split_pct: outcome === "split" ? split_pct : undefined,
    resolved_at: resolvedAt,
    payout_preview: {
      creator_receives: creatorAmount,
      merchant_credited: merchantCredit,
    },
  });
}
