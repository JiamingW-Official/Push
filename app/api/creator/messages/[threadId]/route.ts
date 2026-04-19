import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase-server";

interface Message {
  id: string;
  threadId: string;
  senderId: string;
  senderName: string;
  senderType: "creator" | "merchant" | "agent";
  body: string;
  createdAt: string;
}

const MOCK_MESSAGES: Record<string, Message[]> = {
  "thread-001": [
    {
      id: "msg-1",
      threadId: "thread-001",
      senderId: "merchant-001",
      senderName: "Onyx Coffee Bar",
      senderType: "merchant",
      body: "Hey! Looking forward to having you visit. Morning light is best around 8–9am.",
      createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
    },
  ],
};

// GET /api/creator/messages/[threadId]
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ threadId: string }> },
) {
  try {
    const supabase = await createServerSupabaseClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { threadId } = await params;
    const messages = MOCK_MESSAGES[threadId] ?? [];
    return NextResponse.json({ messages });
  } catch {
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

// POST /api/creator/messages/[threadId]
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ threadId: string }> },
) {
  try {
    const supabase = await createServerSupabaseClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { threadId } = await params;
    const { body } = (await req.json()) as { body: string };

    if (!body?.trim()) {
      return NextResponse.json(
        { error: "Message body required" },
        { status: 400 },
      );
    }

    const message: Message = {
      id: `msg-${Date.now()}`,
      threadId,
      senderId: user.id,
      senderName: "You",
      senderType: "creator",
      body: body.trim(),
      createdAt: new Date().toISOString(),
    };

    return NextResponse.json({ message });
  } catch {
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
