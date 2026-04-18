/* ============================================================
   Mock data for /admin/disclosure-audits (v5.1)
   Every creator post is logged by DisclosureBot for FTC
   compliance (Vertical AI for Local Commerce). This is the
   audit trail + manual-review queue for flagged posts.
   Distinct from /admin/ai-verifications (customer-scan queue).
   ============================================================ */

export type DisclosureVerdict =
  | "auto_pass"
  | "auto_block"
  | "manual_review"
  | "human_approved"
  | "human_rejected";

export interface DisclosureAudit {
  id: string;
  postedAt: string;
  creatorHandle: string;
  campaignTitle: string;
  merchantName: string;
  platform: "instagram" | "tiktok" | "youtube";
  postPreview: string; // first ~200 chars
  missingTags: string[]; // e.g. ['#ad', '#sponsored']
  disclosurePosition: "top" | "middle" | "bottom" | "missing";
  verdict: DisclosureVerdict;
  verdictReason: string;
  modelUsed: string;
  latencyMs: number;
  reviewerNotes: string | null;
  publishedAfterFix: boolean;
}

// Weekly audit sample — fraction of auto_pass rows we re-check
export const WEEKLY_SAMPLE_RATE = 0.1;

export const MOCK_DISCLOSURE_AUDITS: DisclosureAudit[] = [
  {
    id: "da-001",
    postedAt: "2026-04-17T14:22:00Z",
    creatorHandle: "@coffee.crawl",
    campaignTitle: "Williamsburg morning rush — week 2",
    merchantName: "Sey Coffee",
    platform: "instagram",
    postPreview:
      "#ad Okay hear me out — this oat cortado at @seycoffee is the one. Foam holds its shape ten minutes in. Bean is a Colombia Finca La Palma, roasted last Tuesday. Wild how clean it tastes.",
    missingTags: [],
    disclosurePosition: "top",
    verdict: "auto_pass",
    verdictReason:
      "Disclosure tag (#ad) present in first 10 characters. Merchant @-mention confirmed. No ambiguity.",
    modelUsed: "claude-haiku-4-6",
    latencyMs: 820,
    reviewerNotes: null,
    publishedAfterFix: false,
  },
  {
    id: "da-002",
    postedAt: "2026-04-17T12:05:00Z",
    creatorHandle: "@bk.matcha",
    campaignTitle: "Partners Coffee — Spring matcha drop",
    merchantName: "Partners Coffee",
    platform: "tiktok",
    postPreview:
      "Spent the morning at Partners testing their new ceremonial grade. The vibrance is unreal — I've been drinking Ippodo for years and this is comparable. Location: N 3rd St, Brooklyn.",
    missingTags: ["#ad", "#sponsored", "#paidpartnership"],
    disclosurePosition: "missing",
    verdict: "auto_block",
    verdictReason:
      "No #ad, #sponsored, or paid-partnership tag detected in caption or first comment. Post is explicitly promotional (campaign-linked, merchant named). FTC §255.5 requires clear disclosure. Auto-blocked before publish.",
    modelUsed: "claude-sonnet-4-6",
    latencyMs: 3240,
    reviewerNotes: null,
    publishedAfterFix: false,
  },
  {
    id: "da-003",
    postedAt: "2026-04-17T10:47:00Z",
    creatorHandle: "@nolita.lauren",
    campaignTitle: "Devocion — Greenpoint trial week",
    merchantName: "Devocion",
    platform: "instagram",
    postPreview:
      "collab w/ @devocion — this is paid but also I drink here like 4x a week anyway lol. Their Colombia direct-trade line is the only single-origin I'll do without milk.",
    missingTags: ["#ad"],
    disclosurePosition: "top",
    verdict: "manual_review",
    verdictReason:
      'Caption uses "collab w/" and "this is paid" — clear disclosure intent, but does not use the literal #ad, #sponsored, or Instagram paid-partnership label. Ambiguous under current FTC guidance. Human review required.',
    modelUsed: "claude-sonnet-4-6",
    latencyMs: 2980,
    reviewerNotes: null,
    publishedAfterFix: false,
  },
  {
    id: "da-004",
    postedAt: "2026-04-16T19:12:00Z",
    creatorHandle: "@eastwilly.eats",
    campaignTitle: "Variety Coffee — afternoon trial",
    merchantName: "Variety Coffee Roasters",
    platform: "instagram",
    postPreview:
      "#sponsored Honest take on @varietycoffee — the flat white is solid, the cortado is the move, and the pastries from Radio Bakery next door pair perfectly. Open till 7pm.",
    missingTags: [],
    disclosurePosition: "top",
    verdict: "human_approved",
    verdictReason:
      "Disclosure tag present but human flagged for secondary-merchant mention (Radio Bakery, uncontracted). Reviewed — co-mention is organic, not paid. Approved.",
    modelUsed: "claude-sonnet-4-6",
    latencyMs: 3120,
    reviewerNotes:
      "Radio Bakery co-mention organic — creator lives on that block. Not a paid placement. Safe to release.",
    publishedAfterFix: false,
  },
  {
    id: "da-005",
    postedAt: "2026-04-16T16:34:00Z",
    creatorHandle: "@brew.notes.brooklyn",
    campaignTitle: "Hungry Ghost — Bedford trial",
    merchantName: "Hungry Ghost Coffee",
    platform: "youtube",
    postPreview:
      "Today's cafe tour hits Hungry Ghost on Bedford Ave. I'm reviewing the signature espresso blend — thanks to @hungryghost for having me on location. Link in description for their seasonal menu.",
    missingTags: ["#ad", "#sponsored"],
    disclosurePosition: "middle",
    verdict: "human_rejected",
    verdictReason:
      'Phrase "thanks to @hungryghost for having me" is too weak under FTC §255.5 — implies a material connection but does not use a plain, unambiguous disclosure. Creator refused to add #ad to caption.',
    modelUsed: "claude-sonnet-4-6",
    latencyMs: 3660,
    reviewerNotes:
      "Rejected — sent creator revision request with exact compliant wording template. Campaign held until refiled.",
    publishedAfterFix: false,
  },
  {
    id: "da-006",
    postedAt: "2026-04-16T11:08:00Z",
    creatorHandle: "@flatwhite.fiona",
    campaignTitle: "Toby's Estate — S Williamsburg week 1",
    merchantName: "Toby's Estate Coffee",
    platform: "instagram",
    postPreview:
      "#ad the cold brew at @tobysestate is the cleanest one I've had this week. Less oxidized, notes of chocolate and date. Owner said they pull it every 12h so batches are always fresh.",
    missingTags: [],
    disclosurePosition: "top",
    verdict: "auto_pass",
    verdictReason:
      "#ad tag at position 0. Merchant @-mention present. No competitor references. Clean pass.",
    modelUsed: "claude-haiku-4-6",
    latencyMs: 780,
    reviewerNotes: null,
    publishedAfterFix: false,
  },
  {
    id: "da-007",
    postedAt: "2026-04-15T15:50:00Z",
    creatorHandle: "@mornings.with.mia",
    campaignTitle: "Parlor Coffee — weekend rush",
    merchantName: "Parlor Coffee",
    platform: "tiktok",
    postPreview:
      "POV: you find a new favorite roaster. @parlorcoffee sponsored this visit but I'm coming back on my own dime. The Ethiopian Yirgacheffe is genuinely some of the best I've had.",
    missingTags: [],
    disclosurePosition: "middle",
    verdict: "human_approved",
    verdictReason:
      'Disclosure "sponsored this visit" is mid-caption — bot flagged for positioning but the language itself is compliant under FTC §255.5. Human confirmed visibility above-fold on TikTok caption render.',
    modelUsed: "claude-sonnet-4-6",
    latencyMs: 3050,
    reviewerNotes:
      "Mid-caption disclosure okay here — renders above the fold on TikTok mobile. Would not approve on IG carousel where caption truncates.",
    publishedAfterFix: true,
  },
  {
    id: "da-008",
    postedAt: "2026-04-15T09:15:00Z",
    creatorHandle: "@third.wave.tv",
    campaignTitle: "Blue Bottle — Bushwick pop-up",
    merchantName: "Blue Bottle Coffee",
    platform: "youtube",
    postPreview:
      "Walking into Blue Bottle's Bushwick pop-up for the first time. The space is stunning — concrete, brass, that sparse Japanese aesthetic they nail. Pulling a Giant Steps for me today.",
    missingTags: ["#ad", "#sponsored", "paid partnership"],
    disclosurePosition: "missing",
    verdict: "auto_block",
    verdictReason:
      "No disclosure in title, description, pinned comment, or first 15 seconds of spoken content. Video is a paid placement (campaign-tagged). YouTube Partner Program + FTC both require in-video disclosure. Blocked.",
    modelUsed: "claude-sonnet-4-6",
    latencyMs: 3840,
    reviewerNotes: null,
    publishedAfterFix: false,
  },
];
