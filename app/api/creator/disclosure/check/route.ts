import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { unauthorized, badRequest } from "@/lib/api/responses";

// FTC Endorsement Guide keywords — comprehensive rule-based engine, zero cost
const FTC_STRONG = [
  "#ad",
  "#sponsored",
  "#gifted",
  "#paidpartnership",
  "#brandpartner",
  "#spon",
  "paid partnership",
  "sponsored by",
  "gifted by",
  "in partnership with",
  "ad:",
  "sponsored:",
  "#advertisement",
  "#promo",
  "#promotion",
];

// Ambiguous — valid only when paired with brand name or appear early in caption
const FTC_CONTEXTUAL = [
  "#partnership",
  "#collab",
  "#collaboration",
  "#ambassador",
  "#brandambassador",
  "partner with",
  "partnered with",
  "working with",
  "collaborated with",
];

// FTC requires disclosure to be prominent — check if it appears in first 280 chars
function isProminent(caption: string, keyword: string): boolean {
  const idx = caption.toLowerCase().indexOf(keyword.toLowerCase());
  return idx !== -1 && idx <= 280;
}

export interface DisclosureCheckResult {
  verified: boolean;
  disclosure_found: string | null;
  reason: string;
  suggestions: string[];
  method: "keyword";
}

const SUGGESTIONS = [
  'Add "#ad" or "#sponsored" at the start of your caption',
  'Use Instagram\'s built-in "Paid partnership with [Brand]" label',
  'Write "Gifted by [Brand]" or "In partnership with [Brand]" before any hashtags',
];

export async function POST(request: NextRequest) {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    { cookies: { getAll: () => cookieStore.getAll(), setAll: () => {} } },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return unauthorized();

  let body: { caption?: string; platform?: string; brand_name?: string };
  try {
    body = await request.json();
  } catch {
    return badRequest("Invalid JSON body");
  }

  const { caption, brand_name = "" } = body;
  if (!caption?.trim()) {
    return badRequest("caption is required");
  }

  const lower = caption.toLowerCase();
  const brandLower = brand_name.toLowerCase();

  // 1. Strong keywords — verified on presence alone
  const strongHit = FTC_STRONG.find((k) => lower.includes(k.toLowerCase()));
  if (strongHit) {
    const prominent = isProminent(caption, strongHit);
    return NextResponse.json({
      verified: true,
      disclosure_found: strongHit,
      reason: prominent
        ? `Clear FTC disclosure found: "${strongHit}"`
        : `Disclosure found ("${strongHit}") but it's buried — move it to the first line for full FTC compliance.`,
      suggestions: prominent
        ? []
        : [
            'Move your disclosure to the very start of the caption, before "More"',
          ],
      method: "keyword",
    } satisfies DisclosureCheckResult);
  }

  // 2. Contextual keywords — valid when brand name is also mentioned
  const contextHit = FTC_CONTEXTUAL.find((k) =>
    lower.includes(k.toLowerCase()),
  );
  if (contextHit && brandLower && lower.includes(brandLower)) {
    return NextResponse.json({
      verified: true,
      disclosure_found: contextHit,
      reason: `Partnership disclosure found with brand mention: "${contextHit}"`,
      suggestions: [],
      method: "keyword",
    } satisfies DisclosureCheckResult);
  }

  // 3. No disclosure found
  return NextResponse.json({
    verified: false,
    disclosure_found: null,
    reason:
      "No FTC-compliant disclosure language detected. The FTC requires creators to clearly disclose paid partnerships.",
    suggestions: SUGGESTIONS,
    method: "keyword",
  } satisfies DisclosureCheckResult);
}
