import { NextRequest, NextResponse } from "next/server";
import {
  INTEGRATIONS,
  CATEGORY_LABELS,
  IntegrationCategory,
} from "@/lib/integrations/mock-integrations";

// GET /api/merchant/integrations
// Returns all integrations, optionally filtered by category.
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category") as IntegrationCategory | null;

  const integrations = category
    ? INTEGRATIONS.filter((i) => i.category === category)
    : INTEGRATIONS;

  return NextResponse.json({
    integrations: integrations.map((i) => ({
      slug: i.slug,
      name: i.name,
      category: i.category,
      categoryLabel: CATEGORY_LABELS[i.category],
      tagline: i.tagline,
      description: i.description,
      logoColor: i.logoColor,
      logoTextColor: i.logoTextColor,
      status: i.status,
      featured: i.featured,
      benefits: i.benefits,
      authType: i.authType,
    })),
    categories: Object.entries(CATEGORY_LABELS).map(([key, label]) => ({
      key,
      label,
      count: INTEGRATIONS.filter((i) => i.category === key).length,
    })),
  });
}
