// TODO: wire to Supabase + notify creator via Realtime
import { NextRequest, NextResponse } from "next/server";
import { badRequest } from "@/lib/api/responses";

type Decision = "accept" | "decline" | "shortlist";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { applicationIds, decision } = body as {
    applicationIds: string[];
    decision: Decision;
  };

  if (!applicationIds || !Array.isArray(applicationIds) || !decision) {
    return badRequest("Invalid payload");
  }
  const valid: Decision[] = ["accept", "decline", "shortlist"];
  if (!valid.includes(decision)) {
    return badRequest("Invalid decision");
  }

  // TODO: batch update Supabase applications table + trigger realtime notification
  return NextResponse.json({
    updated: applicationIds.length,
    decision,
    ids: applicationIds,
  });
}
