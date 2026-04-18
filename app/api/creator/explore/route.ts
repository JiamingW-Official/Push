import { NextRequest, NextResponse } from "next/server";
import { DEMO_CAMPAIGNS_WITH_GEO } from "@/lib/data/demo-campaigns-geo";

// TODO: wire to Supabase geo query (PostGIS) — ST_DWithin for distance filter,
//       spatial index on (lat, lng), parameterized by ?distance= in km.

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;

  const category = searchParams.get("category") ?? "";
  const tier = searchParams.get("tier") ?? "";
  const budgetMin = Number(searchParams.get("budgetMin") ?? 0);
  const budgetMax = Number(searchParams.get("budgetMax") ?? 5000);
  const distance = Number(searchParams.get("distance") ?? 0); // km, 0 = no filter
  const deadline = searchParams.get("deadline") ?? ""; // "today"|"week"|"month"|""
  const sort = searchParams.get("sort") ?? "newest";
  const page = Number(searchParams.get("page") ?? 1);
  const limit = Number(searchParams.get("limit") ?? 12);

  const TIER_ORDER = [
    "seed",
    "explorer",
    "operator",
    "proven",
    "closer",
    "partner",
  ];

  // NYC center — mock origin for distance filter
  const NYC_LAT = 40.7218;
  const NYC_LNG = -74.001;

  function haversineKm(
    lat1: number,
    lng1: number,
    lat2: number,
    lng2: number,
  ): number {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLng = ((lng2 - lng1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLng / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  }

  const now = new Date();

  let results = DEMO_CAMPAIGNS_WITH_GEO.filter((c) => {
    if (category && c.category !== category) return false;

    if (tier) {
      const tierIdx = TIER_ORDER.indexOf(tier);
      if (tierIdx < 0) return false;
      if (TIER_ORDER.indexOf(c.tier_required) > tierIdx) return false;
    }

    if (c.payout < budgetMin || c.payout > budgetMax) return false;

    if (distance > 0) {
      const km = haversineKm(NYC_LAT, NYC_LNG, c.lat, c.lng);
      if (km > distance) return false;
    }

    if (deadline === "today") {
      if (!c.deadline) return false;
      const d = new Date(c.deadline);
      return (
        d.getFullYear() === now.getFullYear() &&
        d.getMonth() === now.getMonth() &&
        d.getDate() === now.getDate()
      );
    }
    if (deadline === "week") {
      if (!c.deadline) return false;
      const weekOut = new Date(now);
      weekOut.setDate(weekOut.getDate() + 7);
      return new Date(c.deadline) <= weekOut;
    }
    if (deadline === "month") {
      if (!c.deadline) return false;
      const monthOut = new Date(now);
      monthOut.setMonth(monthOut.getMonth() + 1);
      return new Date(c.deadline) <= monthOut;
    }

    return true;
  });

  // Sort
  switch (sort) {
    case "highest-pay":
      results = results.sort((a, b) => b.payout - a.payout);
      break;
    case "ending-soon":
      results = results.sort((a, b) => {
        const da = a.deadline ? new Date(a.deadline).getTime() : Infinity;
        const db = b.deadline ? new Date(b.deadline).getTime() : Infinity;
        return da - db;
      });
      break;
    case "most-spots":
      results = results.sort((a, b) => b.spots_remaining - a.spots_remaining);
      break;
    default:
      // newest — keep insertion order (already chronological in mock data)
      break;
  }

  const total = results.length;
  const offset = (page - 1) * limit;
  const paged = results.slice(offset, offset + limit);

  return NextResponse.json({
    campaigns: paged,
    total,
    page,
    limit,
    hasMore: offset + limit < total,
  });
}
