// TODO: wire to real OAuth providers (Instagram Graph API, TikTok OAuth, etc.)
import { NextResponse } from "next/server";

const SUPPORTED = ["instagram", "tiktok", "xiaohongshu", "youtube", "twitter"];

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ provider: string }> },
) {
  const { provider } = await params;

  if (!SUPPORTED.includes(provider)) {
    return NextResponse.json(
      { error: "Unsupported provider" },
      { status: 400 },
    );
  }

  // Stub OAuth callback — in production redirect back with code exchange
  return NextResponse.json({
    success: true,
    provider,
    connected: true,
    handle: `@demo_${provider}`,
    message: `OAuth stub for ${provider}. Wire to real provider.`,
  });
}
