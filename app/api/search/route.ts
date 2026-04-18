// Push — Global Search API
// GET /api/search?q=... — returns grouped results from the mock index.

import { NextRequest, NextResponse } from "next/server";
import { searchIndex } from "@/lib/search/mock-index";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q") ?? "";

  if (!q.trim()) {
    return NextResponse.json({ query: q, results: null });
  }

  const results = searchIndex(q);

  return NextResponse.json({ query: q, results });
}
