// Push — GET /api/status
// Returns aggregate service health, active incidents, recent incidents, and performance metrics

import { NextResponse } from "next/server";
import {
  SERVICES,
  INCIDENTS,
  PERFORMANCE_METRICS,
  getOverallStatus,
  getActiveIncidents,
  getRecentIncidents,
} from "@/lib/status/mock-services";

export const revalidate = 60; // ISR: re-validate every 60s

export async function GET() {
  const payload = {
    generatedAt: new Date().toISOString(),
    overallStatus: getOverallStatus(),
    services: SERVICES,
    activeIncidents: getActiveIncidents(),
    recentIncidents: getRecentIncidents(7),
    allIncidents: INCIDENTS,
    performanceMetrics: PERFORMANCE_METRICS,
  };

  return NextResponse.json(payload, {
    headers: {
      "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120",
    },
  });
}
