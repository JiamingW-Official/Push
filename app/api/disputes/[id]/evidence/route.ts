// Push — Dispute Evidence API Route
// POST: attach evidence to a dispute
// TODO: wire to Supabase storage + admin notification

import { NextRequest, NextResponse } from "next/server";
import { getDisputeById } from "@/lib/disputes/mock-disputes";
import type { DisputeEvidence } from "@/lib/disputes/types";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  // TODO: wire to Supabase storage + admin notification
  const { id } = await params;
  const dispute = getDisputeById(id);

  if (!dispute) {
    return NextResponse.json({ error: "Dispute not found" }, { status: 404 });
  }

  const body = await req.json();

  const newEvidence: DisputeEvidence = {
    id: `ev-${id}-${Date.now()}`,
    disputeId: id,
    uploadedBy: body.uploadedBy,
    type: body.type ?? "image",
    url: body.url,
    label: body.label ?? "Evidence",
    uploadedAt: new Date().toISOString(),
  };

  return NextResponse.json({ evidence: newEvidence }, { status: 201 });
}
