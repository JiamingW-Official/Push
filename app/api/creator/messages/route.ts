import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/db/server";
import { unauthorized, serverError } from "@/lib/api/responses";

// GET /api/creator/messages — list all message threads
export async function GET() {
  try {
    const supabase = await createServerSupabaseClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return unauthorized();

    // Return mock threads for now (real join with campaigns/merchants in v2)
    const threads = [
      {
        id: "thread-001",
        merchantName: "Onyx Coffee Bar",
        campaignTitle: "Morning Ritual",
        lastMessage: "Hey! Looking forward to having you visit.",
        lastMessageAt: new Date(Date.now() - 3 * 3600000).toISOString(),
        unreadCount: 0,
      },
    ];

    return NextResponse.json({ threads });
  } catch (err) {
    return serverError("creator-messages", err);
  }
}
