// Admin API — GET /api/admin/campaigns/[id]
//            PATCH /api/admin/campaigns/[id]   (update review_notes, internal_notes)

import { NextRequest, NextResponse } from "next/server";
import {
  ADMIN_CAMPAIGNS,
  getAdminCampaignById,
} from "@/lib/admin/mock-campaigns";
import { requireAdminSession } from "@/lib/api/admin-auth";

export const dynamic = "force-dynamic";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: RouteContext) {
  const gate = await requireAdminSession();
  if (!gate.ok) return gate.response;

  const { id } = await params;
  const campaign = getAdminCampaignById(id);

  if (!campaign) {
    return NextResponse.json({ error: "Campaign not found" }, { status: 404 });
  }

  return NextResponse.json({ campaign });
}

export async function PATCH(request: NextRequest, { params }: RouteContext) {
  const gate = await requireAdminSession();
  if (!gate.ok) return gate.response;

  const { id } = await params;
  const campaign = getAdminCampaignById(id);

  if (!campaign) {
    return NextResponse.json({ error: "Campaign not found" }, { status: 404 });
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  // Allowed PATCH fields
  const allowed = ["review_notes", "internal_notes"] as const;
  const updates: Partial<typeof campaign> = {};

  for (const key of allowed) {
    if (key in body) {
      // @ts-expect-error dynamic key assignment on mock
      updates[key] = body[key];
    }
  }

  // Apply to in-memory mock (resets on server restart — production uses DB)
  const idx = ADMIN_CAMPAIGNS.findIndex((c) => c.id === id);
  if (idx !== -1) {
    Object.assign(ADMIN_CAMPAIGNS[idx], updates);
  }

  return NextResponse.json({
    success: true,
    campaign: { ...campaign, ...updates },
  });
}
