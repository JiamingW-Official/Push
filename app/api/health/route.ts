/**
 * GET /api/health
 *
 * Liveness + database connectivity probe used by uptime monitors and the
 * Admin status page. Returns 200 when the service-role client can reach
 * Postgres; 503 otherwise.
 */

import { NextResponse } from "next/server";
import { supabase } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  const timestamp = new Date().toISOString();

  try {
    // Cheap connectivity check — `head: true` skips the row payload and only
    // returns the count, so this stays under a few ms even on large tables.
    // `creators` exists from the initial schema migration and is a safe probe.
    const { error } = await supabase
      .from("creators")
      .select("id", { head: true, count: "exact" });

    if (error) {
      // Log the full error server-side so ops can diagnose; expose only a
      // generic reason code to the probe caller (never Postgres text).
      console.error("[health]", "db_check_failed", error);
      return NextResponse.json(
        {
          status: "unhealthy",
          timestamp,
          database: "disconnected",
          reason: "db_check_failed",
        },
        { status: 503 },
      );
    }

    return NextResponse.json({
      status: "healthy",
      timestamp,
      database: "connected",
    });
  } catch (err) {
    console.error("[health]", "db_unreachable", err);
    return NextResponse.json(
      {
        status: "unhealthy",
        timestamp,
        database: "disconnected",
        reason: "db_unreachable",
      },
      { status: 503 },
    );
  }
}
