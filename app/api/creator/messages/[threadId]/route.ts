import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/db/server";
import { unauthorized, badRequest, serverError } from "@/lib/api/responses";

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
    if (!user) return unauthorized();

    const { threadId } = await params;
    const messages = MOCK_MESSAGES[threadId] ?? [];
    return NextResponse.json({ messages });
  } catch (err) {
    return serverError("creator-messages-thread", err);
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
    if (!user) return unauthorized();

    const { threadId } = await params;
    const { body } = (await req.json()) as { body: string };

    if (!body?.trim()) {
      return badRequest("Message body required");
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
  } catch (err) {
    return serverError("creator-messages-thread", err);
  }
}
