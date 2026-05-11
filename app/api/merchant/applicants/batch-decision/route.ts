// TODO: wire to Supabase + notify creator via Realtime
import { NextRequest, NextResponse } from "next/server";
import { playtestApplications } from "@/lib/playtest/store";

type Decision = "accept" | "decline" | "shortlist";

const STATUS_MAP: Record<Decision, "accepted" | "declined" | "shortlisted"> = {
  accept: "accepted",
  decline: "declined",
  shortlist: "shortlisted",
};

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { applicationIds, decision } = body as {
    applicationIds: string[];
    decision: Decision;
  };

  if (!applicationIds || !Array.isArray(applicationIds) || !decision) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }
  const valid: Decision[] = ["accept", "decline", "shortlist"];
  if (!valid.includes(decision)) {
    return NextResponse.json({ error: "Invalid decision" }, { status: 400 });
  }

  const newStatus = STATUS_MAP[decision];
  let updated = 0;
  for (const appId of applicationIds) {
    const app = playtestApplications.get(appId);
    if (app) {
      playtestApplications.set(appId, { ...app, status: newStatus });
      updated++;
    }
  }

  return NextResponse.json({
    updated,
    decision,
    ids: applicationIds,
  });
}
