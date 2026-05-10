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
import { playtestApplications } from "@/lib/playtest/store";

function playtestToMock(p: import("@/lib/playtest/store").PlaytestApplication) {
  return {
    id: p.id,
    campaignId: p.campaignId,
    campaignName: p.campaignTitle,
    status: p.status as ApplicationStatus,
    matchScore: 88,
    coverLetter: "Applied via Push creator portal",
    sampleUrls: [],
    appliedAt: p.appliedAt,
    creator: {
      id: `playtest-creator-${p.id}`,
      name: "Demo Creator",
      handle: p.creatorHandle,
      avatar: "",
      bio: "Playtest creator",
      tier: "explorer" as CreatorTier,
      pushScore: 72,
      followers: 4200,
      campaignsCompleted: 3,
      conversionRate: 0.18,
      lastActive: p.appliedAt,
    },
  };
}

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

  // Prepend live playtest applications so merchant sees real creator submissions
  const liveApps = Array.from(playtestApplications.values()).map((p) => ({
    ...playtestToMock(p),
    creator: {
      ...playtestToMock(p).creator,
      segment: tierToSegment("explorer"),
    },
  }));

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

  const combined = [...liveApps, ...enriched];

  return NextResponse.json({
    data: combined,
    total: combined.length,
    page: filters.page,
    limit: filters.limit,
  });
}
