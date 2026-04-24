// TODO: wire to Supabase + notify creator via Realtime
import { NextRequest, NextResponse } from "next/server";
import {
  MOCK_APPLICATIONS,
  filterApplications,
  type ApplicantFilters,
  type ApplicationStatus,
  type CreatorTier,
} from "@/lib/data/mock-applications";
import { tierToSegment } from "@/lib/services/creator-segment";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;

  const filters: ApplicantFilters = {
    campaignId: searchParams.get("campaignId") ?? undefined,
    tiers: (searchParams.getAll("tier") as CreatorTier[]) || undefined,
    status: (searchParams.getAll("status") as ApplicationStatus[]) || undefined,
    sort: (searchParams.get("sort") as ApplicantFilters["sort"]) ?? "recent",
    search: searchParams.get("search") ?? undefined,
    page: Number(searchParams.get("page") ?? 1),
    limit: Number(searchParams.get("limit") ?? 25),
  };

  const { data, total } = filterApplications(MOCK_APPLICATIONS, filters);

  // v6: enrich each creator with a `segment` field so merchant-facing UI can
  // display Community/Studio without doing the mapping client-side. `tier` is
  // preserved for back-compat with any caller still keying off the 6-tier name.
  const enriched = data.map((app) => ({
    ...app,
    creator: {
      ...app.creator,
      segment: tierToSegment(app.creator.tier),
    },
  }));

  return NextResponse.json({
    data: enriched,
    total,
    page: filters.page,
    limit: filters.limit,
  });
}
