// app/api/threads/[id]/messages/route.ts
// GET  /api/threads/:id/messages  — paginated message list
// POST /api/threads/:id/messages  — send a message
// TODO: wire to Supabase + Realtime channel per thread

import { NextRequest, NextResponse } from "next/server";
import { MOCK_MESSAGES } from "@/lib/messaging/mock-threads";
import type { Message } from "@/lib/messaging/types";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") ?? "1", 10);
  const pageSize = parseInt(searchParams.get("pageSize") ?? "50", 10);

  const all: Message[] = (MOCK_MESSAGES[id] ?? []).sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
  );

  const total = all.length;
  const start = Math.max(0, total - page * pageSize);
  const end = total - (page - 1) * pageSize;
  const messages = all.slice(start, end);

  return NextResponse.json({ messages, total, hasMore: start > 0 });
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  let body: {
    senderId?: string;
    senderRole?: "creator" | "merchant";
    content?: string;
    contentType?: string;
    attachments?: unknown[];
  };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (!body.senderId || !body.senderRole || !body.content) {
    return NextResponse.json(
      { error: "senderId, senderRole, and content are required" },
      { status: 400 },
    );
  }

  // TODO: persist to Supabase messages table + broadcast on Realtime channel
  const now = new Date().toISOString();
  const message: Message = {
    id: `msg-${Date.now()}`,
    threadId: id,
    senderId: body.senderId,
    senderRole: body.senderRole,
    content: body.content,
    contentType: (body.contentType as Message["contentType"]) ?? "text",
    attachments: [],
    createdAt: now,
  };

  return NextResponse.json({ message }, { status: 201 });
}
