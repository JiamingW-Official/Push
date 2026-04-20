// Admin API — GET /api/admin/campaigns
// Returns all campaigns with optional status/merchant/category/search filters.
// No auth guard here (mock-only): in production, add admin session check.

import { NextRequest, NextResponse } from "next/server";
import {
  ADMIN_CAMPAIGNS,
  type AdminCampaignStatus,
} from "@/lib/admin/mock-campaigns";
import { requireAdminSession } from "@/lib/api/admin-auth";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const gate = await requireAdminSession();
  if (!gate.ok) return gate.response;

  const { searchParams } = new URL(request.url);

  const status = searchParams.get("status") as AdminCampaignStatus | null;
  const merchant = searchParams.get("merchant");
  const category = searchParams.get("category");
  const tier = searchParams.get("tier");
  const search = searchParams.get("search");
  const budgetMin = searchParams.get("budget_min");
  const budgetMax = searchParams.get("budget_max");

  let campaigns = [...ADMIN_CAMPAIGNS];

  // Filter by status
  if (status) {
    campaigns = campaigns.filter((c) => c.admin_status === status);
  }

  // Filter by merchant name (case-insensitive)
  if (merchant) {
    const q = merchant.toLowerCase();
    campaigns = campaigns.filter((c) =>
      c.business_name.toLowerCase().includes(q),
    );
  }

  // Filter by category
  if (category) {
    campaigns = campaigns.filter(
      (c) => c.category.toLowerCase() === category.toLowerCase(),
    );
  }

  // Filter by tier requirement
  if (tier) {
    campaigns = campaigns.filter((c) => c.tier_required === tier);
  }

  // Filter by budget range
  if (budgetMin) {
    const min = parseFloat(budgetMin);
    if (!isNaN(min)) campaigns = campaigns.filter((c) => c.payout >= min);
  }
  if (budgetMax) {
    const max = parseFloat(budgetMax);
    if (!isNaN(max)) campaigns = campaigns.filter((c) => c.payout <= max);
  }

  // Full-text search across title / business_name / description
  if (search) {
    const q = search.toLowerCase();
    campaigns = campaigns.filter(
      (c) =>
        c.title.toLowerCase().includes(q) ||
        c.business_name.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q),
    );
  }

  // Summary stats for header
  const stats = {
    total: ADMIN_CAMPAIGNS.length,
    active: ADMIN_CAMPAIGNS.filter((c) => c.admin_status === "active").length,
    pending: ADMIN_CAMPAIGNS.filter((c) => c.admin_status === "pending").length,
    flagged: ADMIN_CAMPAIGNS.filter((c) => c.admin_status === "flagged").length,
  };

  return NextResponse.json({ campaigns, stats });
}
