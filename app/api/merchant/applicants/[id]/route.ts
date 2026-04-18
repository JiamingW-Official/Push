// TODO: wire to Supabase + notify creator via Realtime
import { NextRequest, NextResponse } from "next/server";
import { MOCK_APPLICATIONS } from "@/lib/data/mock-applications";

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } },
) {
  const app = MOCK_APPLICATIONS.find((a) => a.id === params.id);
  if (!app) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(app);
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const body = await req.json();
  const { status } = body as { status: string };
  const validStatuses = ["pending", "accepted", "declined", "shortlisted"];
  if (!status || !validStatuses.includes(status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  // TODO: update Supabase + trigger realtime push to creator
  return NextResponse.json({ id: params.id, status });
}
