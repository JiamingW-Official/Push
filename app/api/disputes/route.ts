// Push — Disputes API Route
// GET: list disputes filtered by role
// POST: create new dispute
// TODO: wire to Supabase + admin notification

import { NextRequest, NextResponse } from "next/server";
import {
  MOCK_DISPUTES,
  getDisputesForRole,
} from "@/lib/disputes/mock-disputes";

// Role-scoped reads + state-mutating POST. Opt out of Next's route-level
// cache so every request reflects current disputes state.
export const dynamic = "force-dynamic";
import type { Dispute } from "@/lib/disputes/types";

export async function GET(req: NextRequest) {
  const role = req.nextUrl.searchParams.get("role") as
    | "creator"
    | "merchant"
    | null;
  const status = req.nextUrl.searchParams.get("status");

  let disputes = role ? getDisputesForRole(role) : MOCK_DISPUTES;

  if (status && status !== "all") {
    disputes = disputes.filter((d) => d.status === status);
  }

  return NextResponse.json({ disputes });
}

export async function POST(req: NextRequest) {
  // TODO: wire to Supabase + admin notification
  const body = await req.json();

  const newDispute: Dispute = {
    id: `D-2026-${String(MOCK_DISPUTES.length + 1).padStart(3, "0")}`,
    campaignId: body.campaignId,
    campaignTitle: body.campaignTitle ?? "Unknown Campaign",
    merchantName: body.merchantName ?? "",
    creatorName: body.creatorName ?? "",
    filedBy: body.filedBy,
    filedByRole: body.filedByRole,
    otherPartyName: body.otherPartyName ?? "",
    otherPartyRole: body.otherPartyRole,
    reason: body.reason,
    description: body.description,
    amount: body.amount ?? 0,
    expectedOutcome: body.expectedOutcome ?? "",
    status: "open",
    events: [
      {
        id: `evt-new-1`,
        disputeId: `D-2026-${String(MOCK_DISPUTES.length + 1).padStart(3, "0")}`,
        type: "filed",
        authorRole: body.filedByRole,
        authorName: body.filedBy,
        message: body.description,
        createdAt: new Date().toISOString(),
      },
    ],
    evidence: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  return NextResponse.json({ dispute: newDispute }, { status: 201 });
}
