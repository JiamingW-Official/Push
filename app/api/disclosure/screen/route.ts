import { NextRequest, NextResponse } from "next/server";

// FTC-required disclosure tags (case-insensitive, any counts as compliant)
const REQUIRED_TAGS = [
  "#ad",
  "#sponsored",
  "#paidpartnership",
  "#advertisement",
];

// Tags that are accepted but weaker — trigger a warning even if present
const WEAK_TAGS = ["#collab", "#gifted", "#partner"];

// Platforms with known character / placement constraints
const PLATFORM_NOTES: Record<string, string> = {
  instagram: "Place disclosure in the first line before 'more' fold.",
  tiktok: "Disclosure must appear in video text overlay AND caption.",
  youtube:
    "Must say 'paid promotion' in video AND description within first 3 lines.",
};

export interface DisclosureScreenRequest {
  caption: string;
  platform?: "instagram" | "tiktok" | "youtube";
}

export interface DisclosureScreenResponse {
  pass: boolean;
  verdict: "pass" | "warn" | "fail";
  found: string[];
  weak: string[];
  missing: string[];
  suggestion: string;
  platformNote?: string;
  llmChecked: boolean;
}

// POST /api/disclosure/screen — v1 static dictionary check
export async function POST(req: NextRequest) {
  let body: Partial<DisclosureScreenRequest>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!body.caption || typeof body.caption !== "string") {
    return NextResponse.json(
      { error: "Missing required field: caption" },
      { status: 422 },
    );
  }

  const lower = body.caption.toLowerCase();

  const found = REQUIRED_TAGS.filter((tag) => lower.includes(tag));
  const weak = WEAK_TAGS.filter((tag) => lower.includes(tag));
  const missing = REQUIRED_TAGS.filter((tag) => !lower.includes(tag));

  // TODO: LLM fallback — call Claude API to evaluate context-aware compliance
  // when found.length === 0 and weak.length > 0 (ambiguous case).
  // const llmResult = await screenWithClaude(body.caption, body.platform)
  const llmChecked = false;

  let verdict: DisclosureScreenResponse["verdict"];
  let pass: boolean;
  let suggestion: string;

  if (found.length > 0) {
    verdict = "pass";
    pass = true;
    suggestion = "Caption includes a required disclosure tag.";
  } else if (weak.length > 0) {
    verdict = "warn";
    pass = false;
    suggestion = `"${weak[0]}" alone may not satisfy FTC guidelines. Add #ad or #sponsored to be safe.`;
  } else {
    verdict = "fail";
    pass = false;
    suggestion =
      "Add #ad or #sponsored before the 'more' fold. DisclosureBot can prepend it automatically.";
  }

  const response: DisclosureScreenResponse = {
    pass,
    verdict,
    found,
    weak,
    missing: found.length > 0 ? [] : missing,
    suggestion,
    platformNote: body.platform ? PLATFORM_NOTES[body.platform] : undefined,
    llmChecked,
  };

  return NextResponse.json(response, { status: 200 });
}
