// app/api/threads/[id]/route.ts
// GET   /api/threads/:id  — get single thread
// PATCH /api/threads/:id  — mark as read
// TODO: wire to Supabase + Realtime channel per thread

import { NextRequest, NextResponse } from "next/server";
import { MOCK_THREADS } from "@/lib/messaging/mock-threads";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const thread = MOCK_THREADS.find((t) => t.id === id);
  if (!thread) {
    return NextResponse.json({ error: "Thread not found" }, { status: 404 });
  }
  return NextResponse.json({ thread });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const thread = MOCK_THREADS.find((t) => t.id === id);
  if (!thread) {
    return NextResponse.json({ error: "Thread not found" }, { status: 404 });
  }

  let body: { action?: string; userId?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (body.action === "mark_read") {
    // TODO: update Supabase messages.read_at for this thread + userId
    return NextResponse.json({ success: true, threadId: id });
  }

  return NextResponse.json({ error: "Unknown action" }, { status: 400 });
}
