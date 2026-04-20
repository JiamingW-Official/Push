// app/api/threads/route.ts
// GET  /api/threads  — list threads for the authenticated user
// POST /api/threads  — create a new thread
// TODO: wire to Supabase + Realtime channel per thread

import { NextRequest, NextResponse } from "next/server";
import { MOCK_THREADS } from "@/lib/messaging/mock-threads";
import type { CreateThreadPayload } from "@/lib/messaging/types";
import { badRequest } from "@/lib/api/responses";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const role = searchParams.get("role") as "creator" | "merchant" | null;
  const userId = searchParams.get("userId");

  if (!role || !userId) {
    return badRequest("role and userId are required");
  }

  const threads = MOCK_THREADS.filter((t) =>
    t.participants.some((p) => p.role === role && p.userId === userId),
  ).sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
  );

  return NextResponse.json({ threads });
}

export async function POST(request: NextRequest) {
  let body: CreateThreadPayload & {
    selfUserId: string;
    selfRole: "creator" | "merchant";
  };

  try {
    body = await request.json();
  } catch {
    return badRequest("Invalid JSON body");
  }

  if (!body.selfUserId || !body.selfRole || !body.participantUserId) {
    return badRequest(
      "selfUserId, selfRole, and participantUserId are required",
    );
  }

  // TODO: persist to Supabase threads table
  const now = new Date().toISOString();
  const thread = {
    id: `thread-${Date.now()}`,
    participants: [
      {
        userId: body.selfUserId,
        role: body.selfRole,
        name: "You",
        avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${body.selfUserId}`,
      },
      {
        userId: body.participantUserId,
        role: body.participantRole,
        name: "Contact",
        avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${body.participantUserId}`,
      },
    ],
    campaignId: body.campaignId,
    lastMessage: {
      content: body.initialMessage,
      senderId: body.selfUserId,
      createdAt: now,
    },
    unreadCount: 0,
    updatedAt: now,
  };

  return NextResponse.json({ thread }, { status: 201 });
}
