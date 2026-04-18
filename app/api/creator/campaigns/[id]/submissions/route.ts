// TODO: wire to Supabase + moderation queue
import { NextRequest, NextResponse } from "next/server";
import {
  MOCK_SUBMISSIONS,
  type MockSubmission,
} from "@/lib/data/mock-submissions";

// In-memory store for new submissions (resets on server restart)
const runtimeSubmissions: MockSubmission[] = [];

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const all = [...MOCK_SUBMISSIONS, ...runtimeSubmissions];
  const campaignSubs = all.filter((s) => s.campaignId === id);
  return NextResponse.json({ submissions: campaignSubs });
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const body = await req.json();

  const submission: MockSubmission = {
    id: `sub-rt-${Date.now()}`,
    campaignId: id,
    creatorId: body.creatorId ?? "demo-creator-001",
    contentType: body.contentType,
    platform: body.platform,
    attachments: body.attachments ?? [],
    caption: body.caption ?? "",
    publicUrl: body.publicUrl ?? "",
    status: "pending_review",
    submittedAt: new Date().toISOString(),
  };

  runtimeSubmissions.push(submission);

  return NextResponse.json({ submission }, { status: 201 });
}
