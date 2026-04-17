import { NextRequest, NextResponse } from "next/server";

// TODO: wire to Supabase — replace mock with real DB insert
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      name,
      category,
      description,
      budget,
      tier,
      commissionSplit,
      contentType,
      platform,
      dueDate,
    } = body;

    // Validate required fields
    if (
      !name ||
      !category ||
      !description ||
      !budget ||
      !tier ||
      !contentType ||
      !platform ||
      !dueDate
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    if (budget < 50 || budget > 50000) {
      return NextResponse.json(
        { error: "Budget must be between $50 and $50,000" },
        { status: 400 },
      );
    }

    // TODO: const supabase = createClient()
    // TODO: const { data, error } = await supabase.from("campaigns").insert({ ... }).select().single()
    // TODO: if (error) throw error

    // Mock response
    const id = `demo-${Date.now()}`;
    return NextResponse.json(
      {
        id,
        title: name,
        category,
        description,
        budget,
        tier,
        commissionSplit,
        contentType,
        platform,
        dueDate,
        status: "active",
        createdAt: new Date().toISOString(),
      },
      { status: 201 },
    );
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function GET() {
  // TODO: wire to Supabase — return campaigns for authenticated merchant
  return NextResponse.json({ campaigns: [] });
}
