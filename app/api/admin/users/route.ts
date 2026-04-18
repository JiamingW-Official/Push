import { NextRequest, NextResponse } from "next/server";
import { getUsers, userStats } from "@/lib/admin/mock-users";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const tab = searchParams.get("tab") || "all";
  const kyc = searchParams.get("kyc") || "all";
  const search = searchParams.get("search") || "";
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "20", 10);

  const filtered = getUsers({ tab, kyc: kyc as never, search });
  const total = filtered.length;
  const start = (page - 1) * limit;
  const users = filtered.slice(start, start + limit);

  return NextResponse.json({
    users,
    total,
    page,
    limit,
    pages: Math.ceil(total / limit),
    stats: userStats,
  });
}
