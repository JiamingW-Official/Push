import { NextRequest, NextResponse } from "next/server";
import { getIntegrationBySlug } from "@/lib/integrations/mock-integrations";

// POST /api/merchant/integrations/[slug]/disconnect
// Revokes the connection for a given integration.
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

  // In production: revoke OAuth tokens or delete stored API keys.
  return NextResponse.json({
    success: true,
    message: `${integration.name} disconnected successfully`,
    disconnectedAt: new Date().toISOString(),
  });
}
