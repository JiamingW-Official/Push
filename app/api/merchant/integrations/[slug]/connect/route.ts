import { NextRequest, NextResponse } from "next/server";
import { getIntegrationBySlug } from "@/lib/integrations/mock-integrations";

// POST /api/merchant/integrations/[slug]/connect
// OAuth stub — initiates a mock connection flow.
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const integration = getIntegrationBySlug(slug);

  if (!integration) {
    return NextResponse.json(
      { error: "Integration not found" },
      { status: 404 },
    );
  }

  if (integration.status === "coming_soon") {
    return NextResponse.json(
      { error: "This integration is not yet available" },
      { status: 400 },
    );
  }

  // In production: initiate OAuth flow or validate API key.
  // Stub returns a mock success with a connect URL for OAuth integrations.
  const response =
    integration.authType === "oauth"
      ? {
          success: true,
          action: "redirect",
          // Real OAuth URL would be generated server-side with state token
          connectUrl: `https://oauth.push.app/connect/${slug}?state=mock_state_token`,
          message: `Redirecting to ${integration.name} authorization...`,
        }
      : {
          success: true,
          action: "connected",
          message: `${integration.name} connected successfully`,
          connectedAt: new Date().toISOString(),
        };

  return NextResponse.json(response);
}
