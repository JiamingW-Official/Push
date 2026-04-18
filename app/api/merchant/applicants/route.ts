// TODO: wire to Supabase + notify creator via Realtime
import { NextRequest, NextResponse } from "next/server";
import {
  MOCK_APPLICATIONS,
  filterApplications,
  type ApplicantFilters,
  type ApplicationStatus,
  type CreatorTier,
} from "@/lib/data/mock-applications";

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

  return NextResponse.json({
    data,
    total,
    page: filters.page,
    limit: filters.limit,
  });
}
