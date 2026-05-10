"use client";

/* ============================================================
   live-campaigns.ts — merchant ↔ creator shared store (demo)
   v11 · 2026-05-09

   Purpose: in-memory mutable Campaign[] that bridges the merchant
   create flow (/merchant/campaigns/new) and the creator discover
   feed (/creator/discover, /campaign/[id]). When a merchant
   submits a new campaign in demo-mode, it's pushed to this store
   and the creator side sees it on next render — no backend
   round-trip required for the click-through demo.

   Production: replace `LIVE` with a Supabase real-time subscription
   on the campaigns table; the API of this module stays the same.

   Architecture:
     - LIVE: Campaign[] (initialized from MOCK_CAMPAIGNS)
     - subscribers: Set<() => void> — cheap pub/sub
     - useLiveCampaigns(): subscribes via useSyncExternalStore
       so React re-renders when a new campaign lands
     - addLiveCampaign(): merchant write path
     - findCampaign(id): id → enriched Campaign | undefined
     - enrichCampaign(): fills address + shootWindows defaults
       for any campaign missing those v11 fields
   ============================================================ */

import { useSyncExternalStore } from "react";
import type {
  Campaign,
  CampaignAddress,
  ShootWindow,
  ShootSlot,
  MerchantInfo,
} from "@/lib/mocks/campaigns";
import { MOCK_CAMPAIGNS } from "@/lib/mocks/campaigns";
import { hydrate, persist } from "@/lib/data/local-persist";

/* ── Storage ─────────────────────────────────────────────── */

/* v24 — only the *user-added* campaigns are persisted. The 100+
 *  MOCK_CAMPAIGNS seed list is always the base layer (so we don't
 *  bloat localStorage with a static dump). On hydrate, we merge
 *  user-added rows on top of MOCK so user-created entries land at
 *  the top of the discover feed. */
const STORAGE_KEY = "campaigns_user_created";

let userCreated: Campaign[] = hydrate<Campaign[]>(STORAGE_KEY, []);
let LIVE: Campaign[] = [...userCreated, ...MOCK_CAMPAIGNS];
let hydrated = typeof window !== "undefined";

function ensureHydrated(): void {
  if (!hydrated && typeof window !== "undefined") {
    userCreated = hydrate<Campaign[]>(STORAGE_KEY, []);
    LIVE = [...userCreated, ...MOCK_CAMPAIGNS];
    hydrated = true;
  }
}

const subscribers = new Set<() => void>();

function notify() {
  // Persist only the user-added delta — avoid serializing the huge
  // MOCK_CAMPAIGNS list to localStorage on every change.
  const mockIds = new Set(MOCK_CAMPAIGNS.map((c) => c.id));
  userCreated = LIVE.filter((c) => !mockIds.has(c.id));
  persist(STORAGE_KEY, userCreated);
  for (const fn of subscribers) fn();
}

/* ── Public API ──────────────────────────────────────────── */

export function getLiveCampaigns(): Campaign[] {
  ensureHydrated();
  return LIVE;
}

/** Read a single enriched campaign by id. Used by /campaign/[id]. */
export function findLiveCampaign(id: string): Campaign | undefined {
  ensureHydrated();
  const raw = LIVE.find((c) => c.id === id);
  return raw ? enrichCampaign(raw) : undefined;
}

/** Merchant-side write path. Push a new campaign to the live store. */
export function addLiveCampaign(c: Campaign): void {
  // De-dup: if id already exists, replace (re-publish behavior).
  const idx = LIVE.findIndex((x) => x.id === c.id);
  if (idx >= 0) {
    LIVE = [c, ...LIVE.slice(0, idx), ...LIVE.slice(idx + 1)];
  } else {
    LIVE = [c, ...LIVE];
  }
  notify();
}

/** Subscribe to changes (used by useLiveCampaigns). */
function subscribe(fn: () => void): () => void {
  subscribers.add(fn);
  return () => subscribers.delete(fn);
}

/* ── Hook ────────────────────────────────────────────────── */

/** React hook returning the current live campaign list, re-rendering
 *  the consumer whenever a new campaign is added. */
export function useLiveCampaigns(): Campaign[] {
  return useSyncExternalStore(subscribe, getLiveCampaigns, getLiveCampaigns);
}

/** Single-campaign hook for /campaign/[id]. */
export function useLiveCampaign(id: string): Campaign | undefined {
  const list = useLiveCampaigns();
  const raw = list.find((c) => c.id === id);
  return raw ? enrichCampaign(raw) : undefined;
}

/** v23 post-apply — find up to N other campaigns similar to the
 *  given one, ranked by overlap signal. Powers the "More like this"
 *  rail on the post-apply state. Filter priority:
 *    1. exclude self
 *    2. score = (sameNeighborhood ? 3 : 0)
 *           + (sameCategory ? 2 : 0)
 *           + (samePayBand ? 1 : 0)
 *           + (sameMinTier ? 0.5 : 0)
 *    3. take top N by score, then deadline-soonest tiebreaker
 *  Excluded ids are dropped post-rank (e.g. campaigns the creator
 *  already applied to). */
export function findSimilarCampaigns(
  campaign: Campaign,
  opts: { limit?: number; excludeIds?: Set<string> } = {},
): Campaign[] {
  const { limit = 6, excludeIds = new Set() } = opts;
  const myBand = payBand(campaign.cashPay);
  const myHood = (campaign.neighborhood.split(",")[0] ?? "").trim();
  const myCat = campaign.category;
  const myTier = campaign.minimumTier;

  const scored = LIVE
    .filter((c) => c.id !== campaign.id && !excludeIds.has(c.id))
    .map((c) => {
      const hood = (c.neighborhood.split(",")[0] ?? "").trim();
      const score =
        (hood === myHood ? 3 : 0) +
        (c.category === myCat ? 2 : 0) +
        (payBand(c.cashPay) === myBand ? 1 : 0) +
        (c.minimumTier === myTier ? 0.5 : 0);
      return { c, score };
    })
    .filter((row) => row.score > 0)
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      // Tiebreaker — deadline soonest first (urgency = signal).
      const ad = a.c.deadlineIso ? Date.parse(a.c.deadlineIso) : Infinity;
      const bd = b.c.deadlineIso ? Date.parse(b.c.deadlineIso) : Infinity;
      return ad - bd;
    });

  return scored.slice(0, limit).map((row) => enrichCampaign(row.c));
}

function payBand(pay: number): "low" | "mid" | "high" | "premium" {
  if (pay < 30) return "low";
  if (pay < 75) return "mid";
  if (pay < 150) return "high";
  return "premium";
}

/** React hook wrapper over findSimilarCampaigns — subscribes to
 *  the LIVE store so cards update if a new campaign is published
 *  while the page is open. */
export function useSimilarCampaigns(
  campaign: Campaign | undefined,
  opts?: { limit?: number; excludeIds?: Set<string> },
): Campaign[] {
  // Re-subscribe to store changes via useLiveCampaigns. Recompute
  // happens on each render — list size in demo is ~100 so no perf
  // issue; production swaps in a query API anyway.
  useLiveCampaigns();
  if (!campaign) return [];
  return findSimilarCampaigns(campaign, opts);
}

/* ── enrichCampaign — defaults for v11 fields ───────────── */

/** Returns the campaign with v11/v17/v23 fields always populated,
 *  falling back to deterministic defaults derived from existing
 *  fields. Hash on campaign id keeps every render stable. */
export function enrichCampaign(c: Campaign): Campaign {
  return {
    ...c,
    address: c.address ?? defaultAddress(c),
    shootWindows: c.shootWindows ?? defaultShootWindows(c),
    merchant: c.merchant ?? defaultMerchantInfo(c),
    briefBody: c.briefBody ?? defaultBriefBody(c),
    briefMustInclude: c.briefMustInclude ?? defaultMustInclude(c),
    briefMustAvoid: c.briefMustAvoid ?? defaultMustAvoid(c),
    deliverables: c.deliverables.map((d) => enrichDeliverable(d, c)),
  };
}

function enrichDeliverable(
  d: Campaign["deliverables"][number],
  c: Campaign,
): Campaign["deliverables"][number] {
  const k = normalizeDeliverableKey(d.type);
  return {
    ...d,
    description: d.description ?? defaultDeliverableDescription(k, c),
    format: d.format ?? defaultDeliverableFormat(k),
    shotList: d.shotList ?? defaultDeliverableShotList(k, c),
  };
}

/* ── Default address generator ───────────────────────────── */

function defaultAddress(c: Campaign): CampaignAddress {
  // Parse neighborhood "Williamsburg, BK" → city "Williamsburg" / state "NY".
  // Brooklyn / Queens / Bronx / Manhattan all roll up to NY state.
  const parts = c.neighborhood.split(",").map((s) => s.trim());
  const hood = parts[0] ?? c.neighborhood;
  // Plausible street number from the campaign id hash so it's stable
  // across renders for the same campaign.
  const hash = simpleHash(c.id);
  const streetNum = (hash % 400) + 50; // 50-450
  const streets = STREET_POOL_BY_HOOD[hood] ?? GENERIC_STREETS;
  const street = streets[hash % streets.length] ?? "Main St";
  const zip = ZIP_BY_HOOD[hood] ?? "10001";
  return {
    line1: `${streetNum} ${street}`,
    city: cityForHood(hood),
    state: "NY",
    zip,
    lat: c.lat,
    lng: c.lng,
  };
}

function cityForHood(hood: string): string {
  // Borough maps for "Brooklyn" vs "New York" vs "Queens".
  const lower = hood.toLowerCase();
  if (
    lower.includes("brooklyn") ||
    /\b(bk|williamsburg|bushwick|park slope|dumbo|greenpoint|cobble|boerum|bed-stuy|red hook|prospect|sunset park|bensonhurst)\b/.test(
      lower,
    )
  ) {
    return "Brooklyn";
  }
  if (
    /\b(qns|astoria|long island city|flushing|elmhurst|jackson heights)\b/.test(
      lower,
    )
  ) {
    return "Queens";
  }
  return "New York";
}

const STREET_POOL_BY_HOOD: Record<string, string[]> = {
  "Williamsburg": ["Bedford Ave", "Berry St", "Wythe Ave", "N 6th St", "Roebling St"],
  "DUMBO": ["Front St", "Water St", "Jay St", "York St", "Adams St"],
  "Greenpoint": ["Manhattan Ave", "Franklin St", "Greenpoint Ave", "Nassau Ave"],
  "Park Slope": ["5th Ave", "7th Ave", "Union St", "Garfield Pl"],
  "Bushwick": ["Knickerbocker Ave", "Wyckoff Ave", "Myrtle Ave", "Troutman St"],
  "SoHo": ["Broome St", "Spring St", "Prince St", "Mercer St", "Greene St"],
  "NoLita": ["Mott St", "Mulberry St", "Elizabeth St", "Spring St"],
  "TriBeCa": ["Franklin St", "White St", "Walker St", "Hudson St"],
  "West Village": ["Bleecker St", "Christopher St", "W 10th St", "Hudson St"],
  "East Village": ["E 7th St", "St Marks Pl", "Avenue A", "1st Ave"],
  "LES": ["Orchard St", "Ludlow St", "Rivington St", "Stanton St"],
  "Chelsea": ["W 22nd St", "8th Ave", "9th Ave", "10th Ave"],
  "Flatiron": ["W 21st St", "5th Ave", "Broadway", "W 22nd St"],
  "K-Town": ["W 32nd St", "5th Ave", "Broadway", "W 33rd St"],
  "Chinatown": ["Mott St", "Bayard St", "Pell St", "Elizabeth St"],
  "Astoria": ["30th Ave", "Steinway St", "Broadway", "31st Ave"],
};

const GENERIC_STREETS = [
  "Main St",
  "Park Ave",
  "Broadway",
  "1st Ave",
  "5th Ave",
];

const ZIP_BY_HOOD: Record<string, string> = {
  Williamsburg: "11211",
  DUMBO: "11201",
  Greenpoint: "11222",
  "Park Slope": "11215",
  Bushwick: "11237",
  SoHo: "10012",
  NoLita: "10012",
  TriBeCa: "10013",
  "West Village": "10014",
  "East Village": "10003",
  LES: "10002",
  Chelsea: "10011",
  Flatiron: "10010",
  Gramercy: "10010",
  "Murray Hill": "10016",
  Midtown: "10019",
  "Hudson Yards": "10001",
  "Hell's Kitchen": "10019",
  UWS: "10024",
  UES: "10075",
  Harlem: "10027",
  "K-Town": "10001",
  Chinatown: "10013",
  Astoria: "11106",
  "Long Island City": "11101",
  Flushing: "11354",
  FiDi: "10005",
  "Battery Park": "10004",
};

/* ── Default shoot-window generator ──────────────────────── */

/** Build 4-6 bookable shoot windows in the next 14 days, deterministic
 *  per campaign id so the same campaign always shows the same slots
 *  across renders. */
function defaultShootWindows(c: Campaign): ShootWindow[] {
  const hash = simpleHash(c.id);
  const totalDays = 5 + (hash % 3); // 5, 6, or 7 days w/ slots
  const skipPattern = (hash % 2) + 1; // every 1-2 days

  const windows: ShootWindow[] = [];
  // Start from "today" (use a stable date so SSR/CSR match — pin to
  // the campaign's deadlineIso minus 14 days when present, else
  // 2026-05-09 anchor).
  const anchor = new Date(c.deadlineIso ?? "2026-05-23");
  anchor.setDate(anchor.getDate() - 14);

  for (let i = 0; i < 14 && windows.length < totalDays; i += skipPattern) {
    const d = new Date(anchor);
    d.setDate(d.getDate() + i);
    // Skip Sundays for retail / fitness; allow for food/wellness.
    const dow = d.getDay();
    if (dow === 0 && (c.category === "RETAIL" || c.category === "FITNESS"))
      continue;

    windows.push({
      date: d.toISOString().slice(0, 10),
      slots: slotsForDay(c, hash, i),
    });
  }
  return windows;
}

function slotsForDay(
  c: Campaign,
  hash: number,
  dayIdx: number,
): ShootSlot[] {
  // 2-4 slots per day, varying by category (food = morning rush + dinner;
  // fitness = early am + evening; retail = midday).
  const baseTimes: Record<Campaign["category"], string[][]> = {
    "FOOD & DRINK": [
      ["08:30", "10:00"],
      ["11:30", "13:00"],
      ["17:30", "19:00"],
    ],
    RETAIL: [
      ["11:00", "12:30"],
      ["14:00", "15:30"],
      ["16:00", "17:30"],
    ],
    WELLNESS: [
      ["09:00", "10:30"],
      ["11:00", "12:30"],
      ["15:00", "16:30"],
    ],
    BEAUTY: [
      ["10:00", "11:30"],
      ["13:00", "14:30"],
      ["16:00", "17:30"],
    ],
    FITNESS: [
      ["07:00", "08:30"],
      ["12:00", "13:30"],
      ["18:00", "19:30"],
    ],
    LIFESTYLE: [
      ["10:00", "11:30"],
      ["14:00", "15:30"],
      ["17:00", "18:30"],
    ],
  };
  const times = baseTimes[c.category] ?? baseTimes.LIFESTYLE;
  // Drop 1 slot deterministically based on day idx so days don't all
  // look identical.
  const dropIdx = (hash + dayIdx) % times.length;
  return times
    .filter((_, i) => i !== dropIdx || times.length === 1)
    .map(([startTime, endTime]) => ({
      startTime: startTime ?? "10:00",
      endTime: endTime ?? "11:30",
      capacity: 1,
    }));
}

/* ── Default merchant info (v17 — Meet-your-merchant card) ─ */

const CATEGORY_BIO_TEMPLATES: Record<Campaign["category"], string[]> = {
  "FOOD & DRINK": [
    "Locally-owned spot built around regulars and recipes that don't change.",
    "Family-run kitchen — third generation behind the counter.",
    "Neighborhood café where the espresso machine has its own name.",
  ],
  RETAIL: [
    "Independent shop curated by humans who've worked the floor for decades.",
    "Specialty retailer — every product has a story and a person who picked it.",
    "Boutique storefront focused on craft and provenance.",
  ],
  WELLNESS: [
    "Practice-led studio focused on outcomes over aesthetics.",
    "Wellness space where the team holds certifications, not just titles.",
    "Recovery + bodywork clinic with a regulars-first scheduling philosophy.",
  ],
  BEAUTY: [
    "Stylist-owned salon — clients book the chair, not the chain.",
    "Independent beauty studio with a focus on technique over trend.",
    "Color + cut specialists who know their lighting.",
  ],
  FITNESS: [
    "Coach-led studio where every class is a person's plan, not an algorithm.",
    "Strength + conditioning gym focused on progress over pageantry.",
    "Movement studio — coaches before brand, programming before vibes.",
  ],
  LIFESTYLE: [
    "Independent space mixing retail, content, and community.",
    "Lifestyle brand built around a neighborhood, not a category.",
    "Concept space — half store, half studio, all curated.",
  ],
};

function defaultMerchantInfo(c: Campaign): MerchantInfo {
  const hash = simpleHash(c.id);
  const bios = CATEGORY_BIO_TEMPLATES[c.category];
  const bio = bios[hash % bios.length] ?? bios[0] ?? "";
  return {
    bio,
    /* Joined year: 2022-2025 deterministic. */
    joinedYear: 2022 + (hash % 4),
    /* Campaigns hosted: 5-32. */
    campaignsHosted: 5 + (hash % 28),
    /* Avg response: 6-36 hours. */
    avgResponseHours: 6 + (hash % 31),
    /* Repeat creator %: 28-72. */
    repeatCreatorPct: 28 + (hash % 45),
    /* Star rating: 4.4-4.9 (high baseline since merchants on the
       platform clear vetting). */
    starRating: +(4.4 + (hash % 6) / 10).toFixed(1),
    /* Review count: 8-86 deterministic. */
    reviewCount: 8 + (hash % 79),
  };
}

/* ── v23 — merchant-voice brief copy ─────────────────────── */

/** Character-driven 3-sentence brief in the merchant's voice.
 *  Built per category × neighborhood with sensory specifics so
 *  every campaign reads like a person wrote it, not a template.
 *  Voice rule: opening = a fact about the place, middle = an
 *  instruction about what to shoot, closer = what makes it work. */
const BRIEF_BODY_TEMPLATES: Record<Campaign["category"], string[]> = {
  "FOOD & DRINK": [
    /* arcade-style: place character → directive → emotional payoff */
    "We've been on this block since regulars knew us by drink, not name. Order what you actually want, film the moment it lands. The first sip is the only shot we care about.",
    "The line out the door at 8am is the brand. Stand in it, get the order, walk it back outside. We don't need a logo — the cup tells you everything.",
    "Three booths, six stools, one cook. Sit at the counter, ask what's good, film what shows up. Conversation is fine; over-narration is not.",
    "The kitchen plays Motown until 11pm. Order the dish that has the longest description on the menu — that's the one we're proud of. Eat first, post later.",
  ],
  RETAIL: [
    "Every piece on the floor was picked by someone who works here. Ask one question, film the answer, walk out with the thing you came in for. We don't do staged hauls.",
    "We've been in this storefront for nine years and we've moved the register four times. Walk it like you'd walk a friend through it. The lighting is honest at 4pm.",
    "Half the inventory has a story. Pick one item, get the story on camera, then show what it actually looks like in your hand. No try-on montages — we're not that kind of shop.",
  ],
  WELLNESS: [
    "Twenty-minute appointments, ninety-minute conversations. Book the service, do the service, film the part where you exhale. We don't film practitioners; we film outcomes.",
    "We don't say 'sanctuary' on the website and we don't want it in the caption. Show the room as it is — fluorescent in the back, natural light up front. That's the whole vibe.",
    "Recovery is undramatic. Get the treatment, show the before-look, show the after-walk to the train. The unimpressed face is the testimonial.",
  ],
  BEAUTY: [
    "Two chairs, three colorists, one front desk. Book a consultation, film the first conversation, show the chair before you sit. The 'before' frame is the most important one.",
    "Most of our work is on people you've never heard of. That's the point. Shoot one detail — a bowl, a brush, a strand — and trust the close-up to do the work.",
    "We do appointments, not walk-ins. Show up at the time on the calendar, film the wait, show the chair turning toward the mirror. The reveal isn't the goal — the routine is.",
  ],
  FITNESS: [
    "Two coaches, no mirrors, one whiteboard. Take the class you'd take if no one was watching. Film the warm-up — that's where everything that matters happens.",
    "We open at 6am and the regulars are already there. Show up early, get the rack assignment, film the third set, not the first. Effort is the only flex.",
    "The class is harder than it looks. Don't film yourself crushing it — film the rest period after the hardest round. The recovery face is the brand.",
  ],
  LIFESTYLE: [
    "Half retail, half studio, all picked by people who know each other. Walk the room, ask what's new, film what they point at. Curation is a person, not an algorithm.",
    "We don't do haul videos and we don't do hauls. Pick three things, learn the story behind each one, film the conversation. The product is secondary to the person who chose it.",
    "Every wall in here is a curator's argument. Stand in front of one, ask why it's there, film the answer. Context is the content.",
  ],
};

function defaultBriefBody(c: Campaign): string {
  const hash = simpleHash(c.id);
  const pool = BRIEF_BODY_TEMPLATES[c.category];
  return pool[hash % pool.length] ?? pool[0] ?? "";
}

const MUST_INCLUDE_BY_CATEGORY: Record<Campaign["category"], string[]> = {
  "FOOD & DRINK": [
    "On-location shot inside the space",
    "The dish or drink in-hand at the counter",
    "Merchant tag in caption",
    "Branded hashtag",
    "QR scan moment at checkout",
  ],
  RETAIL: [
    "Storefront exterior or signage",
    "One product close-up with context",
    "Merchant tag + branded hashtag",
    "QR scan at register",
  ],
  WELLNESS: [
    "Interior establishing shot",
    "Practitioner-led explanation (B-roll OK)",
    "Merchant tag + branded hashtag",
    "QR scan post-service",
  ],
  BEAUTY: [
    "Chair or station establishing shot",
    "Process detail (color bowl, scissors, brush)",
    "Merchant tag + branded hashtag",
    "QR scan at booking confirmation",
  ],
  FITNESS: [
    "Class or floor establishing shot",
    "One movement clip with form visible",
    "Merchant tag + branded hashtag",
    "QR scan at front desk",
  ],
  LIFESTYLE: [
    "Interior or storefront frame",
    "One curated item in context",
    "Merchant tag + branded hashtag",
    "QR scan during checkout or visit",
  ],
};

const MUST_AVOID_BASE = [
  "Competitor brands in frame",
  "Price misquotes (always check current menu / list)",
  "#sponsored without partner tag",
  "Off-topic creators or pets in frame",
];

function defaultMustInclude(c: Campaign): string[] {
  return MUST_INCLUDE_BY_CATEGORY[c.category] ?? [];
}

function defaultMustAvoid(_c: Campaign): string[] {
  return MUST_AVOID_BASE;
}

/* ── v23 — deliverable enrichment ────────────────────────── */

type DeliverableKey =
  | "visit"
  | "reel"
  | "story"
  | "post"
  | "carousel"
  | "tiktok"
  | "photo"
  | "review"
  | "ugc"
  | "other";

function normalizeDeliverableKey(type: string): DeliverableKey {
  const t = type.toLowerCase().trim();
  if (t.includes("reel")) return "reel";
  if (t.includes("story") || t.includes("ig story")) return "story";
  if (t.includes("carousel")) return "carousel";
  if (t.includes("tiktok") || t.includes("tt")) return "tiktok";
  if (t.includes("post")) return "post";
  if (t.includes("photo") || t.includes("photograph")) return "photo";
  if (t.includes("review") || t.includes("yelp") || t.includes("google")) return "review";
  if (t.includes("ugc")) return "ugc";
  if (t.includes("visit") || t.includes("scan") || t.includes("walk-in"))
    return "visit";
  return "other";
}

function defaultDeliverableDescription(k: DeliverableKey, c: Campaign): string {
  const m = c.merchantName;
  const place = c.neighborhood;
  const map: Record<DeliverableKey, string> = {
    visit: `One in-person visit to ${m}. Scan the QR at the register so the visit registers as attributed traffic. Photo or short clip from inside is encouraged but not required.`,
    reel: `One vertical 15–30s Reel filmed on-location. Hook in the first 2 seconds, ${m} visible by second 5, QR scan moment by the close.`,
    story: `One Instagram Story posted within 24h of the shoot. Tag ${m} and add the campaign sticker. Multiple frames OK if the first one earns the swipe-through.`,
    post: `One Instagram feed post — single image or up to 10 frames. ${m} tagged, branded hashtag in the first line of the caption.`,
    carousel: `One 5–10 frame carousel. First frame is the hook, last frame is the QR or location card. Anchor frame must show ${m} in context.`,
    tiktok: `One TikTok 15–45s, vertical 9:16. Native pacing — no IG-style cuts. Mention ${m} verbally within the first 8 seconds.`,
    photo: `One high-res still delivered as both a square and a 4:5 crop. Shot inside ${m} with location context — no studio crops, no after-hours empty space.`,
    review: `One written review with rating + photo. Specific details only — what you ordered, what stood out, what you'd come back for. No copy-paste.`,
    ugc: `Raw UGC clip(s) for ${m}'s own use — no caption, no overlay. Film as if you're shooting B-roll for the brand. Files delivered via Drive after the shoot.`,
    other: `Custom deliverable scoped with ${m}. See merchant DM for the full brief.`,
  };
  return map[k];
}

function defaultDeliverableFormat(k: DeliverableKey): string {
  const map: Record<DeliverableKey, string> = {
    visit: "QR scan at register · proof of presence",
    reel: "9:16 vertical · 15–30s · hook by 0:02",
    story: "9:16 vertical · 1–4 frames · within 24h",
    post: "1:1 or 4:5 · single frame or up to 10",
    carousel: "4:5 · 5–10 frames · first = hook, last = CTA",
    tiktok: "9:16 vertical · 15–45s · native edit",
    photo: "Hi-res · 1:1 + 4:5 crops · color-graded OK",
    review: "Text + photo · 80–200 words · 4★ minimum",
    ugc: "Raw clips · 9:16 + 16:9 · delivered via Drive",
    other: "See merchant brief",
  };
  return map[k];
}

function defaultDeliverableShotList(
  k: DeliverableKey,
  c: Campaign,
): string[] {
  const m = c.merchantName;
  const map: Record<DeliverableKey, string[]> = {
    visit: [
      "Walk-in establishing shot",
      `${m} signage or storefront in frame`,
      "QR scan moment at register",
    ],
    reel: [
      "Hook frame (subject + tension)",
      `${m} establishing shot`,
      "Process or product close-up",
      "QR scan or branded close",
    ],
    story: [
      `${m} location tag on first frame`,
      "Action frame (mid-experience)",
      "QR scan or CTA frame",
    ],
    post: [
      "Anchor image (subject in context)",
      `${m} visible — sign, packaging, or detail`,
      "Caption: tag + branded hashtag in line 1",
    ],
    carousel: [
      "Frame 1 — hook (no caption needed)",
      "Frame 2-3 — context / process",
      "Frame 4-N — product or detail",
      "Final frame — QR or CTA card",
    ],
    tiktok: [
      "Hook in first 2 seconds",
      "Verbal mention of merchant by 0:08",
      "Demonstration of product or experience",
      "Soft close — no hard sell",
    ],
    photo: [
      "Wide establishing — show the room",
      "Mid — subject + merchant context",
      "Close — texture, detail, or product",
    ],
    review: [
      "Star rating",
      "What you ordered or experienced",
      "One specific detail nobody else would notice",
      "Photo from the visit",
    ],
    ugc: [
      "Wide-angle B-roll of the space",
      "Product or service close-ups",
      "Optional: hands or motion (no faces)",
    ],
    other: ["See merchant brief"],
  };
  return map[k];
}

/* ── Helpers ─────────────────────────────────────────────── */

function simpleHash(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}
