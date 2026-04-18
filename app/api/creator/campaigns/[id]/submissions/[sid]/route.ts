// TODO: wire to Supabase + moderation queue
import { NextRequest, NextResponse } from "next/server";
import {
  MOCK_SUBMISSIONS,
  type MockSubmission,
} from "@/lib/data/mock-submissions";

type Params = { id: string; sid: string };

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<Params> },
) {
  const { sid } = await params;
  const submission = MOCK_SUBMISSIONS.find((s) => s.id === sid);
  if (!submission) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({ submission });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<Params> },
) {
  const { sid } = await params;
  const body = await req.json();

  // In a real implementation this would update the Supabase row and
  // re-enter the moderation queue.
  const updated: Partial<MockSubmission> = {
    status: "pending_review",
    reviewerNotes: undefined,
    submittedAt: new Date().toISOString(),
    reviewedAt: undefined,
    ...body,
  };

  return NextResponse.json({ submissionId: sid, updated });
}
