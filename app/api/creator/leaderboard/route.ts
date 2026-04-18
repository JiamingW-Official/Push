import { NextRequest, NextResponse } from "next/server";
import {
  MOCK_BY_WINDOW,
  NEIGHBORHOOD_LABELS,
  type TimeWindow,
  type NeighborhoodKey,
} from "@/lib/leaderboard/mock-rankings";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const window = (searchParams.get("window") ?? "7d") as TimeWindow;
  const tierFilter = searchParams.get("tier") ?? "all";
  const neighborhood = searchParams.get("neighborhood") ?? "all";

  const validWindows: TimeWindow[] = ["7d", "30d", "all"];
  const safeWindow = validWindows.includes(window) ? window : "7d";

  const data = MOCK_BY_WINDOW[safeWindow];
  let entries = data.entries;

  if (tierFilter !== "all") {
    entries = entries.filter((e) => e.tier === tierFilter);
    // Re-rank within filtered set
    entries = entries.map((e, i) => ({ ...e, rank: i + 1 }));
  }

  if (neighborhood !== "all") {
    const validNeighborhood =
      Object.keys(NEIGHBORHOOD_LABELS).includes(neighborhood);
    if (validNeighborhood) {
      entries = entries.filter(
        (e) => e.neighborhood === (neighborhood as NeighborhoodKey),
      );
      entries = entries.map((e, i) => ({ ...e, rank: i + 1 }));
    }
  }

  return NextResponse.json({
    window: safeWindow,
    generatedAt: data.generatedAt,
    totalCreators: data.totalCreators,
    filteredCount: entries.length,
    tierFilter,
    neighborhood,
    entries,
  });
}
