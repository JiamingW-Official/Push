// Push — Dispute Detail API Route
// GET: single dispute by id
// PATCH: update status / add outcome
// TODO: wire to Supabase + admin notification

import { NextRequest, NextResponse } from "next/server";
import { getDisputeById } from "@/lib/disputes/mock-disputes";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const dispute = getDisputeById(id);

  if (!dispute) {
    return NextResponse.json({ error: "Dispute not found" }, { status: 404 });
  }

  return NextResponse.json({ dispute });
}

export async function PATCH(
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

  const updated = {
    ...dispute,
    ...body,
    id,
    updatedAt: new Date().toISOString(),
  };

  return NextResponse.json({ dispute: updated });
}
