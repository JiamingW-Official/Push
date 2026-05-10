// TODO: wire to Supabase + notify creator via Realtime
import { NextRequest, NextResponse } from "next/server";
import { MOCK_APPLICATIONS } from "@/lib/data/mock-applications";
import {
  playtestApplications,
  type PlaytestApplication,
} from "@/lib/playtest/store";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const app = MOCK_APPLICATIONS.find((a) => a.id === id);
  if (!app) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(app);
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const body = await req.json();

  // The API client sends { decision } while older callers send { status }
  const decisionMap: Record<string, string> = {
    accept: "accepted",
    decline: "declined",
    shortlist: "shortlisted",
  };
  const rawDecision = (body as Record<string, string>).decision;
  const rawStatus = (body as Record<string, string>).status;
  const status = rawDecision
    ? (decisionMap[rawDecision] ?? rawDecision)
    : rawStatus;

  const validStatuses = ["pending", "accepted", "declined", "shortlisted"];
  if (!status || !validStatuses.includes(status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  // Update live playtest application if it exists in the store
  const live = playtestApplications.get(id);
  if (live) {
    playtestApplications.set(id, {
      ...live,
      status: status as PlaytestApplication["status"],
    });
    return NextResponse.json({ ...live, status });
  }

  // TODO: update Supabase + trigger realtime push to creator
  return NextResponse.json({ id, status });
}
