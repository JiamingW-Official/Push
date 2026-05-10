"use client";

/* ============================================================
   merchant-ai.ts — agentic helpers for the merchant create flow
   v1 · 2026-05-10

   Mirrors the creator-side Apply modal AI pattern (Suggest /
   Polish / Auto-fill) on the merchant side. Synthesizes:

     - suggestCampaignName(category, neighborhood, vibe)
     - suggestBrief(category, neighborhood, vibe)
     - suggestDeliverables(category, budgetUsd)
     - suggestPay(category, deliverables)
     - suggestContentType / Platform / DueDate
     - polishBrief(text, ctx)
     - analyzeBrief(text, ctx) — strength meter (Length / Specific
       / Sensory / Fit) — same shape as creator-side analyzeAngle

   All deterministic (campaign hash + lookup tables). Production
   swaps to real LLM API; the function signatures don't change so
   the wizard never sees the difference.
   ============================================================ */

/* ── Inputs the merchant wizard exposes ────────────────────── */

export type MerchantCategory =
  | "FOOD & DRINK"
  | "RETAIL"
  | "WELLNESS"
  | "BEAUTY"
  | "FITNESS"
  | "LIFESTYLE";

export interface BriefContext {
  category: MerchantCategory;
  neighborhood: string;
  /** Optional 1-2 word vibe hint the merchant typed (e.g. "cozy",
   *  "loud", "underground"). Improves draft specificity. */
  vibe?: string;
  /** Merchant business name. Mentioned in the draft. */
  merchantName?: string;
}

/* ── Campaign name suggestion ─────────────────────────────── */

const NAME_PATTERNS: Record<MerchantCategory, string[]> = {
  "FOOD & DRINK": [
    "{m} morning ritual",
    "{m} after-work wind-down",
    "{m} {hood} regulars",
    "What we're really making",
    "First-bite reaction reel",
  ],
  RETAIL: [
    "{m} curator picks",
    "Walk the floor with {m}",
    "{m} new arrivals · spring",
    "One thing from {m}",
    "{hood} storefront series",
  ],
  WELLNESS: [
    "Twenty minutes at {m}",
    "{m} recovery routine",
    "{m} {hood} session",
    "Outcome over aesthetic",
    "Quiet time at {m}",
  ],
  BEAUTY: [
    "Chair to mirror at {m}",
    "{m} consult + cut",
    "Color story · {m}",
    "Behind the chair · {m}",
    "{m} {hood} flagship",
  ],
  FITNESS: [
    "6am at {m}",
    "{m} class deep dive",
    "Third-set face · {m}",
    "{m} programming series",
    "Recovery walk from {m}",
  ],
  LIFESTYLE: [
    "{m} curator series",
    "{m} {hood} pop-up",
    "One wall at {m}",
    "{m} concept tour",
    "Three things from {m}",
  ],
};

export function suggestCampaignName(ctx: BriefContext): string {
  const pool = NAME_PATTERNS[ctx.category];
  const hash = simpleHash(`${ctx.category}|${ctx.neighborhood}|${ctx.vibe ?? ""}`);
  const tpl = pool[hash % pool.length] ?? pool[0]!;
  const m = ctx.merchantName ?? "Your spot";
  const hood = ctx.neighborhood.split(",")[0]?.trim() ?? ctx.neighborhood;
  return tpl.replace(/\{m\}/g, m).replace(/\{hood\}/g, hood);
}

/* ── Brief draft synthesis ────────────────────────────────── */

const BRIEF_TEMPLATES: Record<MerchantCategory, string[]> = {
  "FOOD & DRINK": [
    "{m} has been on this block since regulars knew us by drink, not name. We want creators who'll order what they actually want, film the moment it lands, and let the first sip do the work. No menu sweeps, no voice-over.",
    "The line out the door at 8am is the brand. Stand in it, get the order, walk it back outside. We don't need a logo in frame — the cup does the talking.",
    "Three booths, six stools, one cook. Sit at the counter, ask what's good, film what shows up. Conversation is fine; over-narration is not.",
  ],
  RETAIL: [
    "Every piece on the floor was picked by someone who works here. We want creators who'll ask one question, film the answer, and walk out with the thing they came in for. No staged hauls.",
    "Nine years in this storefront. The lighting is honest at 4pm. Walk the room like you'd walk a friend through it.",
    "Half the inventory has a story. Pick one item, get the story on camera, then show what it actually looks like in your hand.",
  ],
  WELLNESS: [
    "Twenty-minute appointments, ninety-minute conversations. Book the service, do the service, film the part where you exhale. Outcomes over aesthetics.",
    "We don't say 'sanctuary' on the website and we don't want it in the caption. Show the room as it is — fluorescent in the back, natural light up front. That's the whole vibe.",
  ],
  BEAUTY: [
    "Two chairs, three colorists, one front desk. Book a consultation, film the first conversation, show the chair before you sit. The 'before' frame matters most.",
    "Most of our work is on people you've never heard of — that's the point. Shoot one detail, trust the close-up to do the work.",
  ],
  FITNESS: [
    "Two coaches, no mirrors, one whiteboard. Take the class you'd take if no one was watching. Film the warm-up — that's where everything that matters happens.",
    "We open at 6am and the regulars are already there. Show up early, get the rack assignment, film the third set, not the first. Effort is the only flex.",
  ],
  LIFESTYLE: [
    "Half retail, half studio, all picked by people who know each other. Walk the room, ask what's new, film what they point at.",
    "We don't do haul videos. Pick three things, learn the story behind each one, film the conversation. The product is secondary to the person who chose it.",
  ],
};

export function suggestBrief(ctx: BriefContext): string {
  const pool = BRIEF_TEMPLATES[ctx.category];
  const hash = simpleHash(`${ctx.category}|${ctx.neighborhood}|${ctx.vibe ?? ""}|${ctx.merchantName ?? ""}`);
  let draft = pool[hash % pool.length] ?? pool[0]!;
  if (ctx.merchantName) {
    draft = draft.replace(/\{m\}/g, ctx.merchantName);
  } else {
    draft = draft.replace(/\{m\} /g, "We've ");
    draft = draft.replace(/\{m\}/g, "we");
  }
  return draft;
}

/* ── Polish (Grammarly-style cleanup) ─────────────────────── */

export function polishBrief(text: string, ctx: BriefContext): string {
  let t = text.trim();
  const fluff: Array<[RegExp, string]> = [
    [/\bvery\s+/gi, ""],
    [/\breally\s+/gi, ""],
    [/\bjust\s+/gi, ""],
    [/\bI think\s+/gi, ""],
    [/\bkind of\s+/gi, ""],
    [/\bsort of\s+/gi, ""],
    [/\ba lot of\b/gi, "many"],
    [/\bthat is\b/gi, "that's"],
    [/\bcannot\b/gi, "can't"],
    [/\bit is\b/gi, "it's"],
  ];
  for (const [re, repl] of fluff) t = t.replace(re, repl);
  t = t.replace(/\s{2,}/g, " ").trim();
  if (t.length > 0) t = t[0]!.toUpperCase() + t.slice(1);
  if (!/[.!?]$/.test(t)) t += ".";
  // Soft-ensure neighborhood mention if missing — anchors local relevance.
  const hood = ctx.neighborhood.split(",")[0]?.trim() ?? "";
  if (
    hood &&
    !t.toLowerCase().includes(hood.toLowerCase()) &&
    t.length + hood.length + 24 < 480
  ) {
    t += ` ${hood} creators preferred.`;
  }
  return t;
}

/* ── Strength meter (mirrors creator-side analyzeAngle) ──── */

export type DimState = "pass" | "warn" | "miss";
export interface BriefDim {
  key: "length" | "specific" | "sensory" | "fit";
  label: string;
  state: DimState;
  hint: string;
}
export interface BriefStrength {
  dims: BriefDim[];
  summary: string;
}

export function analyzeBrief(text: string, ctx: BriefContext): BriefStrength {
  const t = text.trim();
  const lower = t.toLowerCase();
  const len = t.length;

  const lengthState: DimState =
    len >= 140 ? "pass" : len >= 60 ? "warn" : "miss";

  const hasSpecific =
    /\b(19|20)\d{2}\b/.test(t) ||
    /\b\d+(\.\d+)?\b/.test(t) ||
    /\b(every|each|one|two|three|first|last|third)\b/i.test(t);
  const specificState: DimState = hasSpecific
    ? "pass"
    : len > 60 ? "warn" : "miss";

  const sensoryWords = [
    "shoot", "film", "walk", "light", "loud", "quiet", "sound", "shot",
    "cut", "frame", "morning", "evening", "smell", "taste", "handheld",
    "wide", "close", "bite", "sip", "chair", "counter",
  ];
  const hasSensory = sensoryWords.some((w) => lower.includes(w));
  const sensoryState: DimState = hasSensory
    ? "pass"
    : len > 80 ? "warn" : "miss";

  const hood = ctx.neighborhood.split(",")[0]?.trim().toLowerCase() ?? "";
  const fitMentioned =
    (ctx.merchantName && lower.includes(ctx.merchantName.toLowerCase())) ||
    (hood.length > 0 && lower.includes(hood));
  const fitState: DimState = fitMentioned
    ? "pass"
    : len > 80 ? "warn" : "miss";

  const dims: BriefDim[] = [
    {
      key: "length",
      label: "Length",
      state: lengthState,
      hint:
        lengthState === "pass" ? "Reads like a real merchant brief."
        : lengthState === "warn" ? "A little short — 1-2 more sentences helps creators visualize."
        : "Too short. Aim for 3-4 sentences.",
    },
    {
      key: "specific",
      label: "Specific",
      state: specificState,
      hint:
        specificState === "pass" ? "Concrete details — creators can plan around this."
        : "Add a number, a year, or a count to ground it.",
    },
    {
      key: "sensory",
      label: "Sensory",
      state: sensoryState,
      hint:
        sensoryState === "pass" ? "You named what to film."
        : "Tell creators what you'd shoot — sound, light, action.",
    },
    {
      key: "fit",
      label: "Local fit",
      state: fitState,
      hint:
        fitState === "pass" ? "Anchored to your spot or neighborhood."
        : `Mention ${ctx.merchantName ?? "your business"} or ${ctx.neighborhood.split(",")[0]?.trim()} once.`,
    },
  ];

  const passCount = dims.filter((d) => d.state === "pass").length;
  const summary =
    passCount === 4 ? "Strong brief — ready to publish."
    : passCount === 3 ? "Good brief. One more dimension and it's strong."
    : passCount >= 1 ? "Some signal. Try the suggestions below."
    : "Try the Suggest button — we'll draft from your category + neighborhood.";
  return { dims, summary };
}

/* ── Deliverable suggestions ──────────────────────────────── */

export interface DeliverableSuggestion {
  type: string;
  count: number;
  unitPay: number;
  estHoursEach: number;
  rationale: string;
}

/** Suggest a small deliverable bundle scaled to budget. Aims to
 *  produce a believable 2-3 line bundle for the merchant — they
 *  can edit each row before publishing. */
export function suggestDeliverables(
  ctx: BriefContext,
  budgetUsd: number,
): DeliverableSuggestion[] {
  // Budget bands → bundle shape. Lower budgets get visit-only;
  // higher budgets unlock reels + carousels.
  if (budgetUsd <= 0 || !Number.isFinite(budgetUsd)) {
    return [
      {
        type: "Visit",
        count: 1,
        unitPay: 25,
        estHoursEach: 0.75,
        rationale: "Default visit + QR scan when no budget set.",
      },
    ];
  }
  if (budgetUsd <= 40) {
    return [
      {
        type: "Visit",
        count: 1,
        unitPay: budgetUsd,
        estHoursEach: 0.75,
        rationale: "QR-attributed visit. Lowest-friction starter bundle.",
      },
    ];
  }
  if (budgetUsd <= 90) {
    return [
      {
        type: "Visit",
        count: 1,
        unitPay: Math.round(budgetUsd * 0.4),
        estHoursEach: 0.75,
        rationale: "Anchor visit + scan event.",
      },
      {
        type: "Story",
        count: 1,
        unitPay: Math.round(budgetUsd * 0.6),
        estHoursEach: 0.5,
        rationale: "1-3 frame Story posted within 24h.",
      },
    ];
  }
  if (budgetUsd <= 200) {
    return [
      {
        type: "Visit",
        count: 1,
        unitPay: Math.round(budgetUsd * 0.25),
        estHoursEach: 0.75,
        rationale: "Anchor visit + scan event.",
      },
      {
        type: "Reel",
        count: 1,
        unitPay: Math.round(budgetUsd * 0.55),
        estHoursEach: 1.5,
        rationale: "Vertical 15-30s Reel filmed on-location.",
      },
      {
        type: "Story",
        count: 1,
        unitPay: Math.round(budgetUsd * 0.20),
        estHoursEach: 0.5,
        rationale: "Story sequence posted day-of.",
      },
    ];
  }
  // Premium (200+)
  return [
    {
      type: "Visit",
      count: 1,
      unitPay: Math.round(budgetUsd * 0.18),
      estHoursEach: 0.75,
      rationale: "Anchor visit + scan event.",
    },
    {
      type: "Reel",
      count: 1,
      unitPay: Math.round(budgetUsd * 0.45),
      estHoursEach: 2,
      rationale: "Premium 15-45s Reel — hero deliverable.",
    },
    {
      type: "Carousel",
      count: 1,
      unitPay: Math.round(budgetUsd * 0.25),
      estHoursEach: 1,
      rationale: "5-10 frame carousel — supports the Reel.",
    },
    {
      type: "Story",
      count: 2,
      unitPay: Math.round((budgetUsd * 0.12) / 2),
      estHoursEach: 0.5,
      rationale: "Story sequence on shoot day + next day.",
    },
  ];
}

/* ── Pay recommendation ───────────────────────────────────── */

export interface PayRecommendation {
  recommendedTotalUsd: number;
  /** Plain-language reasoning shown under the slider. */
  rationale: string;
  /** Comparable historical median for similar campaigns. */
  benchmark: number;
}

const CATEGORY_BASE_RATE: Record<MerchantCategory, number> = {
  "FOOD & DRINK": 35,
  RETAIL: 55,
  WELLNESS: 65,
  BEAUTY: 75,
  FITNESS: 50,
  LIFESTYLE: 60,
};

export function suggestPay(
  ctx: BriefContext,
  deliverables: { type: string; count: number; estHoursEach: number }[],
): PayRecommendation {
  const baseRate = CATEGORY_BASE_RATE[ctx.category];
  // Sum of estimated hours across all deliverables.
  const hours = deliverables.reduce(
    (sum, d) => sum + d.count * d.estHoursEach,
    0,
  );
  // Hourly target (Push aims at $35-50/hr to be competitive vs gig
  // platforms while keeping merchant CAC sane). Multiply by hours,
  // then add a 15% Push platform premium (creators are vetted).
  const targetHourly = ctx.category === "BEAUTY" || ctx.category === "WELLNESS" ? 50 : 40;
  const total = Math.max(baseRate, Math.round(hours * targetHourly * 1.15));
  const benchmark = Math.round(baseRate * Math.max(1, hours));

  return {
    recommendedTotalUsd: total,
    rationale: `Based on ${hours.toFixed(1)}h of effort at ~$${targetHourly}/hr, plus a 15% Push platform premium. ${ctx.category} median is ~$${benchmark} for similar bundles.`,
    benchmark,
  };
}

/* ── Hash helper ─────────────────────────────────────────── */

function simpleHash(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}
