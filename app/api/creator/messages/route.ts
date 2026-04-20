import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/db/server";

// GET /api/creator/messages — list all message threads
export async function GET() {
  try {
    const supabase = await createServerSupabaseClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

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
  } catch {
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
