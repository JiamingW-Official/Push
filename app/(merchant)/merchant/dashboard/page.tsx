import { api, getAttributionSummary } from "@/lib/data/api-client";
import {
  CampaignStatus,
  type Campaign as MerchantCampaign,
} from "@/lib/data/types";
import type { MockApplication } from "@/lib/data/mock-applications";
import DashboardClient, { type DashboardState } from "./DashboardClient";
import type { Application, Campaign } from "./types";

function mapApplicationStatus(
  status: MockApplication["status"],
): Application["status"] {
  if (status === "accepted") return "accepted";
  if (status === "declined") return "rejected";
  return "pending";
}

function mapApplications(applications: MockApplication[]): Application[] {
  return applications.map((application) => ({
    id: application.id,
    campaign_id: application.campaignId,
    campaign_title: application.campaignName,
    creator_name: application.creator.name,
    creator_handle: application.creator.handle,
    creator_tier: application.creator.tier,
    creator_score: application.creator.pushScore,
    creator_avatar: application.creator.avatar,
    creator_followers: application.creator.followers,
    status: mapApplicationStatus(application.status),
    milestone: "accepted",
    applied_at: application.appliedAt,
  }));
}

// Accept both the formal MerchantCampaign shape (Supabase / future API) and
// the legacy DemoCampaign mock shape (spots_total / spots_remaining / deadline /
// category) that flows through `as unknown as Campaign[]` in api-client. Without
// this normalization, mock-driven dashboards render `NaN/NaN spots` and
// `Deadline: No deadline` because the upstream cast hides missing fields.
function mapCampaigns(campaigns: MerchantCampaign[]): Campaign[] {
  return campaigns.map((rawCampaign) => {
    const campaign = rawCampaign as MerchantCampaign &
      Partial<{
        spots_total: number;
        spots_remaining: number;
        deadline: string;
        category: string;
        applications_count: number;
        qr_scans: number;
        attributed_revenue: number;
      }>;

    const maxCreators =
      typeof campaign.max_creators === "number"
        ? campaign.max_creators
        : typeof campaign.spots_total === "number"
          ? campaign.spots_total
          : 0;

    const acceptedCreators =
      typeof campaign.accepted_creators === "number"
        ? campaign.accepted_creators
        : typeof campaign.spots_remaining === "number"
          ? Math.max(maxCreators - campaign.spots_remaining, 0)
          : 0;

    const spotsRemaining =
      typeof campaign.spots_remaining === "number"
        ? campaign.spots_remaining
        : Math.max(maxCreators - acceptedCreators, 0);

    const deadline = campaign.end_date ?? campaign.deadline ?? null;
    const category = campaign.category ?? campaign.tags?.[0];

    return {
      id: campaign.id,
      merchant_id: campaign.merchant_id,
      title: campaign.title,
      description: campaign.description ?? "",
      category,
      payout: campaign.reward_per_visit ?? 0,
      spots_total: maxCreators,
      spots_remaining: spotsRemaining,
      deadline,
      status:
        campaign.status === CampaignStatus.Completed ||
        campaign.status === CampaignStatus.Cancelled
          ? "closed"
          : campaign.status,
      created_at: campaign.created_at,
      applications_count: campaign.applications_count ?? acceptedCreators,
      qr_scans: campaign.qr_scans ?? 0,
      attributed_revenue: campaign.attributed_revenue ?? 0,
    };
  });
}

function safeNumber(value: unknown): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

// Wraps a sync-or-async producer so a single source's failure cannot blank
// the rest of the dashboard. Logs to runtime so Vercel surfaces the cause.
async function settle<T>(
  label: string,
  run: () => T | Promise<T>,
): Promise<T | null> {
  try {
    return await run();
  } catch (err) {
    console.error(`[merchant-dashboard] ${label} failed`, err);
    return null;
  }
}

// Pulls the three independent data sources on their own lanes so a failing
// attribution endpoint cannot blank the campaign + applicants surface.
async function getDashboardData(): Promise<DashboardState> {
  const now = new Date();
  const from = new Date(now);
  from.setDate(from.getDate() - 30);

  const [campaignsResult, applicantsResult, summary] = await Promise.all([
    settle("getCampaigns", () => api.merchant.getCampaigns()),
    settle("getApplicants", () =>
      api.merchant.getApplicants({
        status: ["pending", "shortlisted", "accepted"],
        page: 1,
        limit: 50,
      }),
    ),
    settle("getAttributionSummary", () =>
      getAttributionSummary({
        from: from.toISOString(),
        to: now.toISOString(),
      }),
    ),
  ]);

  return {
    campaigns: campaignsResult?.ok ? mapCampaigns(campaignsResult.data) : [],
    applications: applicantsResult
      ? mapApplications(applicantsResult.data)
      : [],
    mtdSpend: safeNumber(summary?.revenue_attributed),
    totalReach: safeNumber(summary?.scans),
  };
}

export default async function MerchantDashboardPage() {
  const initialData = await getDashboardData();

  return <DashboardClient initialData={initialData} />;
}
