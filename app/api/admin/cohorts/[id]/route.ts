import { NextRequest, NextResponse } from "next/server";
import { getCohortById } from "@/lib/admin/mock-cohorts";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const cohort = getCohortById(id);

  if (!cohort) {
    return NextResponse.json({ error: "Cohort not found" }, { status: 404 });
  }

  return NextResponse.json({ cohort });
}
