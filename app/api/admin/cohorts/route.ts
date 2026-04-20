import { NextRequest, NextResponse } from "next/server";
import { mockCohorts, getCohortStats } from "@/lib/admin/mock-cohorts";
import { requireAdminSession } from "@/lib/api/admin-auth";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const gate = await requireAdminSession();
  if (!gate.ok) return gate.response;

  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type"); // 'merchant' | 'creator'
  const neighborhood = searchParams.get("neighborhood");
  const status = searchParams.get("status");
  const borough = searchParams.get("borough");

  let cohorts = [...mockCohorts];

  if (type) cohorts = cohorts.filter((c) => c.type === type);
  if (neighborhood)
    cohorts = cohorts.filter((c) =>
      c.neighborhood.toLowerCase().includes(neighborhood.toLowerCase()),
    );
  if (status) cohorts = cohorts.filter((c) => c.status === status);
  if (borough)
    cohorts = cohorts.filter(
      (c) => c.borough.toLowerCase() === borough.toLowerCase(),
    );

  // Strip members from list view for performance
  const list = cohorts.map(({ members: _members, ...rest }) => rest);

  const stats = getCohortStats();

  return NextResponse.json({ cohorts: list, stats });
}
