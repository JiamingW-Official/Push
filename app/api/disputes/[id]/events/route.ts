// Push — Dispute Events API Route
// POST: add a response/event to a dispute thread
// TODO: wire to Supabase + admin notification

import { NextRequest, NextResponse } from "next/server";
import { getDisputeById } from "@/lib/disputes/mock-disputes";
import type { DisputeEvent } from "@/lib/disputes/types";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  // TODO: wire to Supabase + admin notification
  const { id } = await params;
  const dispute = getDisputeById(id);

  if (!dispute) {
    return NextResponse.json({ error: "Dispute not found" }, { status: 404 });
  }

  const body = await req.json();

  const newEvent: DisputeEvent = {
    id: `evt-${id}-${Date.now()}`,
    disputeId: id,
    type: body.type ?? "creator_response",
    authorRole: body.authorRole,
    authorName: body.authorName,
    message: body.message,
    evidence: body.evidence ?? [],
    createdAt: new Date().toISOString(),
  };

  return NextResponse.json({ event: newEvent }, { status: 201 });
}
