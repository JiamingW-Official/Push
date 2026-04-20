// TODO: wire to Supabase + notify creator via Realtime
import { NextRequest, NextResponse } from "next/server";
import { MOCK_APPLICATIONS } from "@/lib/data/mock-applications";
import { notFound, badRequest } from "@/lib/api/responses";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const app = MOCK_APPLICATIONS.find((a) => a.id === id);
  if (!app) return notFound("Not found");
  return NextResponse.json(app);
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const body = await req.json();
  const { status } = body as { status: string };
  const validStatuses = ["pending", "accepted", "declined", "shortlisted"];
  if (!status || !validStatuses.includes(status)) {
    return badRequest("Invalid status");
  }

  // TODO: update Supabase + trigger realtime push to creator
  return NextResponse.json({ id, status });
}
