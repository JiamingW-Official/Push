/* ============================================================
   Shared Inbox Seed Data
   Single source of truth for the Now / Invites / Messages /
   System pages. Lifted from the per-page mock arrays so the
   four pages can never drift apart in demo mode. When real
   APIs land, this file is what gets replaced — pages just
   keep importing the same names.

   Authority: Audit §五 (per-source duplication root cause) +
              Push v6-streamlined attribution model.
   ============================================================ */

/* ──────────────────────────────────────────────────────────────
   INVITES
   ────────────────────────────────────────────────────────────── */

export type InviteStatus = "pending" | "accepted" | "declined";

export type PayoutTier = {
  amount: number;
  /** "Guaranteed" / "Target" / "Stretch" */
  label: string;
  /** Concrete trigger condition shown next to amount */
  trigger: string;
};

export type AcceptStep = {
  id: "brief" | "disclosure" | "qr" | "calendar";
  label: string;
  done: boolean;
  href: string;
};

export type Invite = {
  id: string;
  brand: string;
  brandInitial: string;
  campaign: string;
  matchScore: number;
  /** 3 grounding facts behind the X% Watch score */
  matchReasons: string[];
  /** 3 discrete tiers (Guaranteed / Target / Stretch) — NOT a continuum */
  payoutTiers: PayoutTier[];
  /** ms timestamp when this invite expires */
  expiresAt: number;
  status: InviteStatus;
  category: string;
  brief: string;
  briefHref: string;
  qrPickupAddr: string;
  shootWindow: string;
  /** Hydrated by buildAcceptSteps() once accepted */
  acceptSteps?: AcceptStep[];
  /** ISO string when this invite was received (used by /today briefing) */
  receivedAt?: string;
};

export const SEED_INVITES: Invite[] = [
  {
    id: "inv-001",
    brand: "Roberta's Pizza",
    brandInitial: "R",
    campaign: "Summer Menu Launch",
    matchScore: 98,
    matchReasons: [
      "0.7mi within your home base in Williamsburg",
      "30d: 3 food reels — your highest-engagement category",
      "Past dining campaigns: 88% acceptance, 4 completed",
    ],
    payoutTiers: [
      { amount: 40, label: "Guaranteed", trigger: "On accept" },
      { amount: 65, label: "Target", trigger: "8 verified scans" },
      { amount: 85, label: "Stretch", trigger: "8 scans + 2 repeats / 7d" },
    ],
    expiresAt: Date.now() + 4 * 60 * 60 * 1000 + 13 * 60 * 1000,
    status: "pending",
    category: "Food & Beverage",
    brief:
      "Two reels at the Bushwick location featuring the new summer menu — pies, bar bites, and the patio. Tag @robertaspizza, drop the campaign QR at the register before posting.",
    briefHref: "/creator/campaigns/roberta-summer/brief",
    qrPickupAddr: "Roberta's · 261 Moore St · ask Marco at the bar",
    shootWindow: "Fri 5/8 — Sun 5/10",
  },
  {
    id: "inv-002",
    brand: "Flamingo Estate",
    brandInitial: "F",
    campaign: "Wellness Weekend",
    matchScore: 94,
    matchReasons: [
      "1.4mi within your service radius",
      "Lifestyle posts: 12% above your baseline engagement",
      "Past beauty/lifestyle: 92% completion rate",
    ],
    payoutTiers: [
      { amount: 55, label: "Guaranteed", trigger: "On accept" },
      { amount: 70, label: "Target", trigger: "12 verified scans" },
      { amount: 85, label: "Stretch", trigger: "12 + Story sequence" },
    ],
    expiresAt: Date.now() + 11 * 60 * 60 * 1000,
    status: "pending",
    category: "Lifestyle",
    brief:
      "One in-store visit + one Story sequence highlighting the spring fragrance line. Voiceover encouraged.",
    briefHref: "/creator/campaigns/flamingo-wellness/brief",
    qrPickupAddr: "Flamingo Estate · 92 Bedford Ave · front desk",
    shootWindow: "Sat 5/9 — Mon 5/11",
  },
  {
    id: "inv-003",
    brand: "Fort Greene Coffee",
    brandInitial: "G",
    campaign: "Morning Ritual Series",
    matchScore: 91,
    matchReasons: [
      "0.4mi within your morning route (8–10am window)",
      "Coffee category: 3 prior posts, 2 verified",
      "Audience overlap: 71% with Fort Greene customer profile",
    ],
    payoutTiers: [
      { amount: 35, label: "Guaranteed", trigger: "On accept" },
      { amount: 55, label: "Target", trigger: "10 verified scans" },
      { amount: 70, label: "Stretch", trigger: "10 + 3 visits in 7d" },
    ],
    expiresAt: Date.now() + 26 * 60 * 60 * 1000,
    status: "pending",
    category: "Coffee & Cafe",
    brief:
      "Three visits across one week, capturing the order, the regulars, and a midweek pour-over close-up.",
    briefHref: "/creator/campaigns/fortgreene-ritual/brief",
    qrPickupAddr: "Fort Greene Coffee · 110 S Portland Ave · counter",
    shootWindow: "Mon 5/4 — Sun 5/10",
  },
  {
    id: "inv-004",
    brand: "Bed-Stuy Eats",
    brandInitial: "B",
    campaign: "Local Favorites Reel",
    matchScore: 82,
    matchReasons: [
      "Bed-Stuy: 6 prior visits logged in 90d",
      "Multi-spot reels: 2 prior, both completed",
      "Audience: 64% Brooklyn-based, 25–34 dominant",
    ],
    payoutTiers: [
      { amount: 30, label: "Guaranteed", trigger: "On accept" },
      { amount: 50, label: "Target", trigger: "Reel published + 6 scans" },
      { amount: 65, label: "Stretch", trigger: "12 scans across 3 spots" },
    ],
    expiresAt: Date.now() + 48 * 60 * 60 * 1000,
    status: "pending",
    category: "Food & Beverage",
    brief:
      "Pick three Bed-Stuy spots, weave them into one reel. Bonus paid on visits matched to your QR within 7 days.",
    briefHref: "/creator/campaigns/bedstuy-favorites/brief",
    qrPickupAddr: "Pickup at first spot · QR mailed if requested",
    shootWindow: "Sun 5/10 — Sat 5/16",
  },
  {
    id: "inv-005",
    brand: "Brow Theory",
    brandInitial: "B",
    campaign: "Spring Beauty Campaign",
    matchScore: 79,
    matchReasons: [
      "1.1mi within service radius",
      "Beauty category: 1 prior post (Brow Theory, completed)",
      "Service-day BTS posts perform 1.4× your baseline",
    ],
    payoutTiers: [
      { amount: 45, label: "Guaranteed", trigger: "On accept" },
      { amount: 60, label: "Target", trigger: "Post within 24h of service" },
      { amount: 75, label: "Stretch", trigger: "Target + 6 verified scans" },
    ],
    expiresAt: Date.now() + 72 * 60 * 60 * 1000,
    status: "pending",
    category: "Beauty & Wellness",
    brief:
      "Service-day BTS + 24-hour follow-up post. Shoot in natural light if possible.",
    briefHref: "/creator/campaigns/browtheory-spring/brief",
    qrPickupAddr: "Brow Theory · 145 N 6th St · reception",
    shootWindow: "Within 7d of accept",
  },
  /* ── Pre-accepted invites (demo Active tab) ── */
  {
    id: "inv-accepted-001",
    brand: "Devoción Coffee",
    brandInitial: "D",
    campaign: "Cold Brew Summer",
    matchScore: 95,
    matchReasons: [
      "0.6mi within your morning route (8–10am window)",
      "Coffee category: your top engagement vertical",
      "Audience: 68% Brooklyn-based 25–34",
    ],
    payoutTiers: [
      { amount: 45, label: "Guaranteed", trigger: "On accept" },
      { amount: 65, label: "Target", trigger: "10 verified scans" },
      { amount: 80, label: "Stretch", trigger: "10 scans + Story sequence" },
    ],
    expiresAt: Date.now() + 5 * 24 * 60 * 60 * 1000,
    status: "accepted" as InviteStatus,
    category: "Coffee & Cafe",
    brief:
      "Two visits highlighting the cold brew process — bar perspective preferred. Tag @devocion, drop the QR at the bar before posting.",
    briefHref: "/creator/campaigns/devocion-coldbrew/brief",
    qrPickupAddr: "Devoción · 69 Grand St · bar counter",
    shootWindow: "Mon 5/5 — Sat 5/10",
    acceptSteps: [
      {
        id: "brief" as const,
        label: "Open full brief",
        done: true,
        href: "/creator/campaigns/devocion-coldbrew/brief",
      },
      {
        id: "disclosure" as const,
        label: "Sign FTC disclosure",
        done: true,
        href: "/creator/compliance/disclosure/inv-accepted-001",
      },
      {
        id: "qr" as const,
        label: "Pick up QR poster",
        done: false,
        href: "/creator/campaigns/inv-accepted-001/qr",
      },
      {
        id: "calendar" as const,
        label: "Add shoot window to calendar",
        done: false,
        href: "/creator/campaigns/inv-accepted-001/calendar",
      },
    ],
  },
  {
    id: "inv-accepted-002",
    brand: "Sunday in Brooklyn",
    brandInitial: "S",
    campaign: "Weekend Brunch Push",
    matchScore: 90,
    matchReasons: [
      "1.0mi Williamsburg — fits weekend availability pattern",
      "Brunch category: top 2 posts by engagement in last 30d",
      "Audience: 72% Brooklyn-based with weekend peak",
    ],
    payoutTiers: [
      { amount: 50, label: "Guaranteed", trigger: "On accept" },
      { amount: 75, label: "Target", trigger: "8 verified scans" },
      { amount: 95, label: "Stretch", trigger: "8 scans + collab Story" },
    ],
    expiresAt: Date.now() + 8 * 24 * 60 * 60 * 1000,
    status: "accepted" as InviteStatus,
    category: "Food & Beverage",
    brief:
      "Brunch service from 10am–2pm, Sunday preferred. One reel with ambient sound, no voiceover required. Tag @sundayinbrooklyn.",
    briefHref: "/creator/campaigns/sunday-brunch/brief",
    qrPickupAddr: "Sunday in Brooklyn · 348 Wythe Ave · host stand",
    shootWindow: "Sun 5/11 — Sun 5/18",
    acceptSteps: [
      {
        id: "brief" as const,
        label: "Open full brief",
        done: true,
        href: "/creator/campaigns/sunday-brunch/brief",
      },
      {
        id: "disclosure" as const,
        label: "Sign FTC disclosure",
        done: true,
        href: "/creator/compliance/disclosure/inv-accepted-002",
      },
      {
        id: "qr" as const,
        label: "Pick up QR poster",
        done: true,
        href: "/creator/campaigns/inv-accepted-002/qr",
      },
      {
        id: "calendar" as const,
        label: "Add shoot window to calendar",
        done: true,
        href: "/creator/campaigns/inv-accepted-002/calendar",
      },
    ],
  },
  /* ── Pre-declined invite (demo History tab) ── */
  {
    id: "inv-declined-001",
    brand: "Cha Cha Matcha",
    brandInitial: "C",
    campaign: "Matcha Morning Ritual",
    matchScore: 84,
    matchReasons: [
      "0.8mi North Williamsburg",
      "Beverage category: moderate engagement fit",
      "Audience overlap: 58% with Cha Cha Matcha customer profile",
    ],
    payoutTiers: [
      { amount: 40, label: "Guaranteed", trigger: "On accept" },
      { amount: 55, label: "Target", trigger: "8 verified scans" },
      { amount: 65, label: "Stretch", trigger: "8 scans + repeat within 14d" },
    ],
    expiresAt: Date.now() - 2 * 24 * 60 * 60 * 1000,
    status: "declined" as InviteStatus,
    category: "Coffee & Cafe",
    brief:
      "Two morning visits capturing the matcha prep ritual — golden hour light preferred. Tag @chachamatcha.",
    briefHref: "/creator/campaigns/chachamatcha-ritual/brief",
    qrPickupAddr: "Cha Cha Matcha · 119 N 6th St · barista",
    shootWindow: "Mon 4/28 — Sun 5/4",
  },
  {
    id: "inv-expired-001",
    brand: "Williamsburg Pasta Co.",
    brandInitial: "W",
    campaign: "Summer Lunch Push",
    matchScore: 88,
    matchReasons: [
      "0.4mi within your home base in Williamsburg",
      "Food & Beverage: 4 reels in last 30d",
      "Similar campaign completed with 90% scan rate",
    ],
    payoutTiers: [
      { amount: 35, label: "Guaranteed", trigger: "On accept" },
      { amount: 55, label: "Target", trigger: "6 verified scans" },
      { amount: 70, label: "Stretch", trigger: "6 scans + repeat visit / 7d" },
    ],
    expiresAt: Date.now() - 12 * 60 * 60 * 1000,
    status: "pending",
    category: "Food & Beverage",
    brief:
      "One reel featuring the new lunch menu. Tag @williamsburgpastaco, drop the QR at the counter before posting.",
    briefHref: "/creator/campaigns/wpastaco-lunch/brief",
    qrPickupAddr: "Williamsburg Pasta Co. · 127 Hope St · ask at counter",
    shootWindow: "Thu 5/1 — Sun 5/4",
  },
];

/** When an invite is accepted, hydrate it with the 4-step checklist
 *  (FTC disclosure / brief / QR pickup / calendar). The creator
 *  doesn't vanish into "✓ Accepted" — they get a clear runway. */
export function buildAcceptSteps(invite: Invite): AcceptStep[] {
  return [
    {
      id: "brief",
      label: "Open full brief",
      done: false,
      href: invite.briefHref,
    },
    {
      id: "disclosure",
      label: "Sign FTC disclosure",
      done: false,
      href: `/creator/compliance/disclosure/${invite.id}`,
    },
    {
      id: "qr",
      label: "Pick up QR poster",
      done: false,
      href: `/creator/campaigns/${invite.id}/qr`,
    },
    {
      id: "calendar",
      label: "Add shoot window to calendar",
      done: false,
      href: `/creator/campaigns/${invite.id}/calendar`,
    },
  ];
}

/* — Category gradients — used for circular avatar tint — */
const CATEGORY_GRADIENT: Record<string, string> = {
  "Food & Beverage":
    "linear-gradient(140deg, var(--cat-dining-deep, #7a3a26) 0%, var(--cat-dining, #b8624a) 100%)",
  Lifestyle:
    "linear-gradient(140deg, var(--cat-travel-deep, #1d3d52) 0%, var(--cat-travel, #4a7d9c) 100%)",
  "Coffee & Cafe":
    "linear-gradient(140deg, var(--cat-fashion-deep, #2c2a26) 0%, var(--cat-fashion, #6e6661) 100%)",
  "Beauty & Wellness":
    "linear-gradient(140deg, var(--cat-beauty-deep, #6b3354) 0%, var(--cat-beauty, #b56e94) 100%)",
};

export function getCategoryGradient(category: string): string {
  return (
    CATEGORY_GRADIENT[category] ??
    "linear-gradient(140deg, var(--graphite) 0%, var(--char) 100%)"
  );
}

/* — Shoot-window parser + conflict detection (audit P1) —
   Naive parser handles the seed format ("Fri 5/8 — Sun 5/10").
   Production version reads structured ISO ranges from campaign svc. */
export function parseShootWindow(
  s: string,
): { start: number; end: number } | null {
  const range = s.match(/(\d{1,2})\/(\d{1,2}).*?(\d{1,2})\/(\d{1,2})/);
  if (!range) return null;
  const yr = new Date().getFullYear();
  const start = new Date(yr, Number(range[1]) - 1, Number(range[2])).getTime();
  const end = new Date(
    yr,
    Number(range[3]) - 1,
    Number(range[4]),
    23,
    59,
  ).getTime();
  return { start, end };
}

export function detectConflicts(target: Invite, accepted: Invite[]): Invite[] {
  const t = parseShootWindow(target.shootWindow);
  if (!t) return [];
  return accepted.filter((other) => {
    if (other.id === target.id) return false;
    const o = parseShootWindow(other.shootWindow);
    if (!o) return false;
    return t.start <= o.end && o.start <= t.end;
  });
}

/* ──────────────────────────────────────────────────────────────
   MESSAGES
   Brand-merchant ↔ creator real conversations only. Push Team /
   Push Payments / Campaign Updates live in System (audit P0).
   ────────────────────────────────────────────────────────────── */

export type MessageRole = "merchant";

export type Message = {
  id: string;
  from: "self" | "other";
  text: string;
  /** ISO timestamp */
  at: string;
};

/** Pinned above the thread body when the conversation is tied
 *  to an active campaign — answers "how's the campaign going?"
 *  inline, without flipping to /campaigns. */
export type AttributionStatus = {
  scansVerified: number;
  scansTarget: number;
  /** dollars, current verified */
  estPayout: number;
  /** dollars, if hit target */
  maxPayout: number;
  deadlineISO: string;
};

export type Thread = {
  id: string;
  sender: string;
  initial: string;
  preview: string;
  campaign: string | null;
  createdAt: string;
  unread: boolean;
  online: boolean;
  role: MessageRole;
  group: "TODAY" | "THIS WEEK" | "EARLIER";
  messages: Message[];
  attribution: AttributionStatus | null;
  /** Audit P2: anchor a thread above its date group */
  starred?: boolean;
};

const _now = Date.now();
const minutesAgo = (m: number) => new Date(_now - m * 60_000).toISOString();
const hoursAgo = (h: number) => new Date(_now - h * 60 * 60_000).toISOString();
const daysAgo = (d: number) =>
  new Date(_now - d * 24 * 60 * 60_000).toISOString();

export const SEED_THREADS: Thread[] = [
  {
    id: "t-roberta",
    sender: "Roberta's Pizza",
    initial: "R",
    preview: "Drop the QR by the register — bartender knows you're coming.",
    campaign: "Summer Menu Launch",
    createdAt: minutesAgo(8),
    unread: true,
    online: true,
    role: "merchant",
    group: "TODAY",
    attribution: {
      scansVerified: 0,
      scansTarget: 8,
      estPayout: 40,
      maxPayout: 65,
      deadlineISO: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString(),
    },
    messages: [
      {
        id: "m-rob-1",
        from: "other",
        text: "Hey — welcome to the Summer Menu Launch. We loved your last food reel.",
        at: minutesAgo(45),
      },
      {
        id: "m-rob-2",
        from: "other",
        text: "Pickup the new summer pies, tag @robertaspizza, and drop the QR poster by the register. Bartender (Marco) will know you're coming.",
        at: minutesAgo(43),
      },
      {
        id: "m-rob-3",
        from: "self",
        text: "Got it — planning to shoot Saturday around 1pm. Should I let Marco know in advance?",
        at: minutesAgo(20),
      },
      {
        id: "m-rob-4",
        from: "other",
        text: "Saturday 1pm is perfect. I'll text Marco. The poster is at the bar already.",
        at: minutesAgo(8),
      },
    ],
  },
  {
    id: "t-flamingo",
    sender: "Flamingo Estate",
    initial: "F",
    preview: "Shoot deadline reminder — 2 days left to complete your content.",
    campaign: "Wellness Weekend",
    createdAt: hoursAgo(1),
    unread: true,
    online: true,
    role: "merchant",
    group: "TODAY",
    attribution: {
      scansVerified: 4,
      scansTarget: 12,
      estPayout: 55,
      maxPayout: 70,
      deadlineISO: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    },
    messages: [
      {
        id: "m-fla-1",
        from: "other",
        text: "Hi — friendly reminder, your Wellness Weekend shoot is due Friday 5pm.",
        at: hoursAgo(2),
      },
      {
        id: "m-fla-2",
        from: "other",
        text: "Let me know if you need anything from us in the meantime.",
        at: hoursAgo(1),
      },
    ],
  },
  {
    id: "t-fortgreene",
    sender: "Fort Greene Coffee",
    initial: "G",
    preview: "We loved your content — can you do a follow-up post?",
    campaign: "Morning Ritual",
    createdAt: daysAgo(1),
    unread: false,
    online: false,
    role: "merchant",
    group: "THIS WEEK",
    attribution: {
      scansVerified: 11,
      scansTarget: 10,
      estPayout: 55,
      maxPayout: 55,
      deadlineISO: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    },
    messages: [
      {
        id: "m-fg-1",
        from: "other",
        text: "Your Morning Ritual reel just hit 9k views. Wild!",
        at: daysAgo(1),
      },
      {
        id: "m-fg-2",
        from: "other",
        text: "Any chance you'd do a follow-up post next week? Same payout structure.",
        at: daysAgo(1),
      },
      {
        id: "m-fg-3",
        from: "self",
        text: "Thanks! Yeah I can do Tuesday or Thursday — what works?",
        at: daysAgo(1),
      },
    ],
  },
  {
    id: "t-bedstuy",
    sender: "Bed-Stuy Eats",
    initial: "B",
    preview: "Quick question on the brief — can we hop on a 5-min call?",
    campaign: "Local Favorites Reel",
    createdAt: daysAgo(2),
    unread: false,
    online: false,
    role: "merchant",
    group: "EARLIER",
    attribution: null,
    messages: [
      {
        id: "m-bs-1",
        from: "other",
        text: "Hey — small ask before you start shooting. Can we hop on a 5-min call this week to align on the 3 spots?",
        at: daysAgo(2),
      },
    ],
  },
  {
    id: "t-browtheory",
    sender: "Brow Theory",
    initial: "B",
    preview: "Service-day BTS reel went live — incredible first 24h.",
    campaign: "Spring Beauty Campaign",
    createdAt: daysAgo(3),
    unread: false,
    online: false,
    role: "merchant",
    group: "EARLIER",
    attribution: {
      scansVerified: 14,
      scansTarget: 12,
      estPayout: 75,
      maxPayout: 75,
      deadlineISO: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    },
    messages: [
      {
        id: "m-bt-1",
        from: "other",
        text: "Service-day BTS reel just went live. Numbers look great — 14 verified scans in 24 hours, beat the target!",
        at: daysAgo(3),
      },
      {
        id: "m-bt-2",
        from: "other",
        text: "Payout will hit your wallet within 48h. Thanks for the killer work.",
        at: daysAgo(3),
      },
    ],
  },
  {
    id: "t-claypot",
    sender: "Clay Pot",
    initial: "C",
    preview: "Loved the storefront shot. Mind tagging us in the next post?",
    campaign: "Williamsburg Lunch Push",
    createdAt: daysAgo(4),
    unread: false,
    online: false,
    role: "merchant",
    group: "EARLIER",
    attribution: {
      scansVerified: 6,
      scansTarget: 8,
      estPayout: 38,
      maxPayout: 55,
      deadlineISO: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    },
    messages: [
      {
        id: "m-cp-1",
        from: "other",
        text: "Loved the storefront shot you posted yesterday. Mind tagging us in the next one too?",
        at: daysAgo(4),
      },
      {
        id: "m-cp-2",
        from: "self",
        text: "Of course! Going to do a follow-up on Friday with the lunch special.",
        at: daysAgo(4),
      },
    ],
  },
  {
    id: "t-parkslope",
    sender: "Park Slope Pizza",
    initial: "P",
    preview: "Got the QR poster set up by the till. Marco approved.",
    campaign: "Sunday Slice Series",
    createdAt: daysAgo(5),
    unread: false,
    online: false,
    role: "merchant",
    group: "EARLIER",
    attribution: {
      scansVerified: 3,
      scansTarget: 10,
      estPayout: 28,
      maxPayout: 60,
      deadlineISO: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    },
    messages: [
      {
        id: "m-ps-1",
        from: "other",
        text: "Got the QR poster set up by the till — checked with Marco at our other location, he approves.",
        at: daysAgo(5),
      },
    ],
  },
  {
    id: "t-greenpoint",
    sender: "Greenpoint Wines",
    initial: "G",
    preview: "Shoot wrapped — sending you the brand assets in a sec.",
    campaign: "Summer Pours Tasting",
    createdAt: daysAgo(6),
    unread: false,
    online: false,
    role: "merchant",
    group: "EARLIER",
    attribution: {
      scansVerified: 7,
      scansTarget: 7,
      estPayout: 45,
      maxPayout: 45,
      deadlineISO: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    },
    messages: [
      {
        id: "m-gp-1",
        from: "other",
        text: "Shoot wrapped this morning — sending you the brand assets in a sec.",
        at: daysAgo(6),
      },
      {
        id: "m-gp-2",
        from: "other",
        text: "Hit target on the first day, thanks again. Payout cleared.",
        at: daysAgo(6),
      },
    ],
  },
  {
    id: "t-ltrain",
    sender: "L Train Vintage",
    initial: "L",
    preview: "Ok for a Saturday late-afternoon shoot?",
    campaign: "Spring Drop · Lookbook",
    createdAt: daysAgo(8),
    unread: false,
    online: false,
    role: "merchant",
    group: "EARLIER",
    attribution: null,
    messages: [
      {
        id: "m-lt-1",
        from: "other",
        text: "Hey — would Saturday late afternoon work for a quick shoot at the Bedford store?",
        at: daysAgo(8),
      },
    ],
  },
  /* ── Additional seed threads ── */
  {
    id: "t-magnolia",
    sender: "Magnolia Bakery",
    initial: "M",
    preview: "Ready for your Saturday shoot — entrance is on Bleecker.",
    campaign: "Cupcake Classic Series",
    createdAt: minutesAgo(25),
    unread: true,
    online: false,
    role: "merchant",
    group: "TODAY",
    attribution: {
      scansVerified: 2,
      scansTarget: 6,
      estPayout: 40,
      maxPayout: 60,
      deadlineISO: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    },
    messages: [
      {
        id: "m-mag-1",
        from: "other",
        text: "Hi! Just confirming your Saturday shoot at Bleecker. The team will be ready from 11am.",
        at: minutesAgo(50),
      },
      {
        id: "m-mag-2",
        from: "self",
        text: "Perfect — I'll be there at 11:15 to set up the shot.",
        at: minutesAgo(35),
      },
      {
        id: "m-mag-3",
        from: "other",
        text: "Ready for your Saturday shoot — entrance is on Bleecker, the barista will greet you.",
        at: minutesAgo(25),
      },
    ],
  },
  {
    id: "t-attaboy",
    sender: "Attaboy",
    initial: "A",
    preview: "We'd love a late-night bar shoot this weekend.",
    campaign: "Craft Cocktails Campaign",
    createdAt: minutesAgo(52),
    unread: true,
    online: true,
    role: "merchant",
    group: "TODAY",
    attribution: null,
    messages: [
      {
        id: "m-att-1",
        from: "other",
        text: "Hey — we'd love a late-night bar shoot this weekend. Fri or Sat, after 10pm preferred. Any chance?",
        at: minutesAgo(52),
      },
    ],
  },
  {
    id: "t-devocion",
    sender: "Devoción Coffee",
    initial: "D",
    preview: "Cold brew batch is in — come anytime before noon Thursday.",
    campaign: "Cold Brew Summer",
    createdAt: daysAgo(1),
    unread: false,
    online: false,
    role: "merchant",
    group: "THIS WEEK",
    attribution: {
      scansVerified: 6,
      scansTarget: 10,
      estPayout: 45,
      maxPayout: 65,
      deadlineISO: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString(),
    },
    messages: [
      {
        id: "m-dev-1",
        from: "other",
        text: "Fresh cold brew batch is in. Best time to come is before noon — gets crowded after.",
        at: daysAgo(1),
      },
      {
        id: "m-dev-2",
        from: "self",
        text: "Thursday morning works perfectly. What time does the bar open?",
        at: daysAgo(1),
      },
      {
        id: "m-dev-3",
        from: "other",
        text: "Cold brew batch is in — come anytime before noon Thursday.",
        at: daysAgo(1),
      },
    ],
  },
  {
    id: "t-acehotel",
    sender: "Ace Hotel Brooklyn",
    initial: "A",
    preview: "Rooftop access confirmed for your shoot window.",
    campaign: "Rooftop Summer Series",
    createdAt: daysAgo(2),
    unread: false,
    online: false,
    role: "merchant",
    group: "THIS WEEK",
    attribution: {
      scansVerified: 0,
      scansTarget: 14,
      estPayout: 70,
      maxPayout: 110,
      deadlineISO: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000).toISOString(),
    },
    messages: [
      {
        id: "m-ace-1",
        from: "other",
        text: "Hi — your rooftop access is confirmed for the full weekend window. Check in at the lobby, ask for Mia.",
        at: daysAgo(2),
      },
      {
        id: "m-ace-2",
        from: "self",
        text: "Awesome — golden hour Saturday it is. Will the bar be open for the shoot?",
        at: daysAgo(2),
      },
      {
        id: "m-ace-3",
        from: "other",
        text: "Rooftop access confirmed for your shoot window. Bar opens at 5pm — perfect timing.",
        at: daysAgo(2),
      },
    ],
  },
  {
    id: "t-junewinebar",
    sender: "June Wine Bar",
    initial: "J",
    preview: "Content went live — beautiful shots, thanks so much.",
    campaign: "Natural Wine Evening",
    createdAt: daysAgo(7),
    unread: false,
    online: false,
    role: "merchant",
    group: "EARLIER",
    attribution: {
      scansVerified: 9,
      scansTarget: 8,
      estPayout: 55,
      maxPayout: 55,
      deadlineISO: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    },
    messages: [
      {
        id: "m-jun-1",
        from: "other",
        text: "The reel just went live — those candlelight shots are stunning. Thank you.",
        at: daysAgo(7),
      },
      {
        id: "m-jun-2",
        from: "self",
        text: "Happy to do it again anytime. Best evening shoot I've done this month.",
        at: daysAgo(7),
      },
      {
        id: "m-jun-3",
        from: "other",
        text: "Content went live — beautiful shots, thanks so much. Payout cleared this morning.",
        at: daysAgo(7),
      },
    ],
  },
  {
    id: "t-blankstreet",
    sender: "Blank Street Coffee",
    initial: "B",
    preview: "The window shot performed really well — 4.2k views already.",
    campaign: "Morning Pour Series",
    createdAt: daysAgo(9),
    unread: false,
    online: false,
    role: "merchant",
    group: "EARLIER",
    attribution: {
      scansVerified: 12,
      scansTarget: 10,
      estPayout: 50,
      maxPayout: 50,
      deadlineISO: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    },
    messages: [
      {
        id: "m-bs2-1",
        from: "other",
        text: "The window shot performed really well — 4.2k views in 24h. Campaign hit target on day one.",
        at: daysAgo(9),
      },
      {
        id: "m-bs2-2",
        from: "other",
        text: "Want to do a follow-up this fall when we launch the new menu?",
        at: daysAgo(9),
      },
      {
        id: "m-bs2-3",
        from: "self",
        text: "Absolutely — count me in. The Williamsburg window is one of my favorite spots to shoot.",
        at: daysAgo(9),
      },
    ],
  },
];

export const AVATAR_COLORS: Record<string, string> = {
  R: "var(--brand-red)",
  F: "var(--champagne)",
  G: "var(--ink)",
  B: "var(--graphite)",
  C: "var(--cat-dining-deep, #7a3a26)",
  P: "var(--cat-fashion-deep, #2c2a26)",
  L: "var(--accent-blue)",
};
export const avatarBg = (initial?: string) =>
  initial ? (AVATAR_COLORS[initial] ?? "var(--ink-3)") : "var(--ink-3)";

/* ──────────────────────────────────────────────────────────────
   SYSTEM NOTIFICATIONS
   Re-cut by what the creator does with each item, not by which
   system fired it (audit P1).
   ────────────────────────────────────────────────────────────── */

export type Category =
  | "all"
  | "action"
  | "money"
  | "updates"
  | "compliance"
  | "platform"
  | "network";

export type SystemNotif = {
  id: string;
  role?: string;
  type?: string;
  title: string;
  body: string;
  href?: string;
  createdAt: string;
  read: boolean;
  category: Category;
  priority?: boolean;
  /** Concrete inline action — every notification states the next step */
  nextAction?: { label: string; href: string };
  /** FYI items (Money/Updates) auto-archive 7d after read */
  fyiArchive?: boolean;
  /** ms timestamp — item is hidden until passed (audit P2) */
  snoozedUntil?: number;
};

export const SEED_NOTIFICATIONS: SystemNotif[] = [
  /* — SCAN VERIFIED (dedupe demo: 3 consecutive from same brand) — */
  {
    id: "sys-scan-001",
    type: "scan_verified",
    title: "Scan verified · Roberta's Pizza",
    body: "1 of 8 target scans verified. Campaign: Summer Menu Launch.",
    href: "/creator/campaigns/roberta-summer",
    createdAt: new Date(Date.now() - 18 * 60 * 1000).toISOString(),
    read: false,
    category: "updates",
    fyiArchive: true,
  },
  {
    id: "sys-scan-002",
    type: "scan_verified",
    title: "Scan verified · Roberta's Pizza",
    body: "2 of 8 target scans verified. Campaign: Summer Menu Launch.",
    href: "/creator/campaigns/roberta-summer",
    createdAt: new Date(Date.now() - 14 * 60 * 1000).toISOString(),
    read: false,
    category: "updates",
    fyiArchive: true,
  },
  {
    id: "sys-scan-003",
    type: "scan_verified",
    title: "Scan verified · Roberta's Pizza",
    body: "3 of 8 target scans verified. Campaign: Summer Menu Launch.",
    href: "/creator/campaigns/roberta-summer",
    createdAt: new Date(Date.now() - 8 * 60 * 1000).toISOString(),
    read: false,
    category: "updates",
    fyiArchive: true,
  },

  /* — ACTION REQUIRED — */
  {
    id: "sys-c-001",
    role: "creator",
    type: "system",
    title: "Application accepted · Roberta's Pizza",
    body: "Now: open the brief, sign the FTC disclosure, pick up the QR poster.",
    href: "/creator/campaigns/roberta-summer",
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    read: false,
    category: "action",
    priority: true,
    nextAction: {
      label: "Open brief",
      href: "/creator/campaigns/roberta-summer",
    },
  },
  {
    id: "sys-c-002",
    role: "creator",
    type: "system",
    title: "Deadline in 3 days · Flamingo Estate",
    body: "Wellness Weekend shoot due Friday 5pm. 4/12 verified scans so far.",
    href: "/creator/campaigns/flamingo-wellness",
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    read: false,
    category: "action",
    priority: true,
    nextAction: {
      label: "Plan shoot",
      href: "/creator/campaigns/flamingo-wellness",
    },
  },
  {
    id: "sys-c-003",
    role: "creator",
    type: "system",
    title: "Brand replied · Bed-Stuy Eats",
    body: "Wants a 5-min call before you start. Reply in Messages.",
    href: "/creator/inbox/messages",
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    read: false,
    category: "action",
    nextAction: { label: "Reply", href: "/creator/inbox/messages" },
  },

  /* — COMPLIANCE — */
  {
    id: "sys-c-comp-1",
    role: "creator",
    type: "system",
    title: "FTC disclosure pending · Roberta's Pizza",
    body: "v5.4 requires #ad disclosure on every accepted campaign. Sign before posting.",
    href: "/creator/compliance/disclosure/roberta-summer",
    createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    read: false,
    category: "compliance",
    priority: true,
    nextAction: {
      label: "Sign disclosure",
      href: "/creator/compliance/disclosure/roberta-summer",
    },
  },

  /* — MONEY — */
  {
    id: "sys-c-004",
    role: "creator",
    type: "system",
    title: "Payout received · $120",
    body: "Brow Theory Spring · 8 verified scans + 2 repeats. Now in wallet.",
    href: "/creator/wallet",
    createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    read: false,
    category: "money",
    nextAction: { label: "View wallet", href: "/creator/wallet" },
    fyiArchive: true,
  },
  {
    id: "sys-c-005",
    role: "creator",
    type: "system",
    title: "Withdrawal processed · $240",
    body: "Transferred to bank ending 4521. Available in 1–2 business days.",
    href: "/creator/wallet/transactions",
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    read: true,
    category: "money",
    nextAction: {
      label: "Track transfer",
      href: "/creator/wallet/transactions",
    },
    fyiArchive: true,
  },

  /* — UPDATES (FYI, auto-archive after 7d once read) — */
  {
    id: "sys-c-006",
    role: "creator",
    type: "system",
    title: "Push Score · +3 (now 87)",
    body: "Brow Theory Spring: 14 verified scans (117% of 12-scan target) moved your score from 84 → 87. Conversion rate 3.1% — your best single-campaign rate this year. You're now ranked #18 of 248 NYC Food & Beverage creators. Each scan above target adds +0.2 pts; next threshold (Operator tier) is score 95.",
    href: "/creator/profile/score",
    createdAt: new Date(Date.now() - 20 * 60 * 60 * 1000).toISOString(),
    read: false,
    category: "updates",
    nextAction: { label: "See full breakdown", href: "/creator/profile/score" },
    fyiArchive: true,
  },
  {
    id: "sys-c-007",
    role: "creator",
    type: "system",
    title: "Tier · 2 campaigns from Operator",
    body: "You're 2 completed campaigns away from the Operator tier. Operator unlocks +15% base payouts on all new campaigns, priority invite queue placement (2× weekly invite volume), and direct brand messaging. Your active campaigns — Devoción (6/10 scans) and Flamingo Estate (4/12 scans) — both count toward tier progression when closed. Projected unlock: 2–3 weeks at your current pace.",
    href: "/creator/profile/tier",
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    read: true,
    category: "updates",
    nextAction: { label: "See tier perks", href: "/creator/profile/tier" },
    fyiArchive: true,
  },
  /* ── Additional seed notifications ── */
  /* — MONEY — */
  {
    id: "sys-c-008",
    role: "creator",
    type: "system",
    title: "Payout received · $85",
    body: "Flamingo Estate Wellness Weekend · 4 verified scans. Credited to wallet.",
    href: "/creator/wallet",
    createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    read: false,
    category: "money",
    nextAction: { label: "View wallet", href: "/creator/wallet" },
    fyiArchive: true,
  },
  {
    id: "sys-c-009",
    role: "creator",
    type: "system",
    title: "Payout pending · Devoción Coffee",
    body: "Campaign settling — payout of $45 will land in 24–48h after verification.",
    href: "/creator/wallet/pending",
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    read: false,
    category: "money",
    nextAction: { label: "Track payout", href: "/creator/wallet/pending" },
    fyiArchive: true,
  },
  {
    id: "sys-c-010",
    role: "creator",
    type: "system",
    title: "Withdrawal processed · $350",
    body: "Transferred to bank ending 4521. Funds available in 1–2 business days.",
    href: "/creator/wallet/transactions",
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    read: true,
    category: "money",
    nextAction: {
      label: "View transaction",
      href: "/creator/wallet/transactions",
    },
    fyiArchive: true,
  },
  /* — ACTION REQUIRED — */
  {
    id: "sys-c-011",
    role: "creator",
    type: "system",
    title: "New invite · Ace Hotel Brooklyn",
    body: "98% match. Rooftop Summer Series · expires in 6h. Review before it closes.",
    href: "/creator/gigs/invites",
    createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    read: false,
    category: "action",
    priority: true,
    nextAction: { label: "Review invite", href: "/creator/gigs/invites" },
  },
  {
    id: "sys-c-012",
    role: "creator",
    type: "system",
    title: "Brief overdue · Fort Greene Coffee",
    body: "Morning Ritual brief signed 4d ago but QR still not picked up. Campaign closes Friday.",
    href: "/creator/campaigns/fortgreene-ritual",
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    read: false,
    category: "action",
    nextAction: {
      label: "Pick up QR",
      href: "/creator/campaigns/fortgreene-ritual",
    },
  },
  /* — COMPLIANCE — */
  {
    id: "sys-c-comp-2",
    role: "creator",
    type: "system",
    title: "FTC disclosure pending · Flamingo Estate",
    body: "Wellness Weekend requires #ad disclosure before first post. Sign to unblock payout.",
    href: "/creator/compliance/disclosure/flamingo-wellness",
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    read: false,
    category: "compliance",
    priority: true,
    nextAction: {
      label: "Sign disclosure",
      href: "/creator/compliance/disclosure/flamingo-wellness",
    },
  },
  {
    id: "sys-c-comp-3",
    role: "creator",
    type: "system",
    title: "Content review flag · Brow Theory",
    body: "One post flagged: #ad placement not visible above fold. Update caption within 24h.",
    href: "/creator/compliance/flags",
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    read: true,
    category: "compliance",
    nextAction: { label: "View flag", href: "/creator/compliance/flags" },
  },
  /* — UPDATES — */
  {
    id: "sys-c-013",
    role: "creator",
    type: "system",
    title: "Push Score · +5 (now 92)",
    body: "Score rose 87 → 92 this week. Devoción Cold Brew added +3 (6 verified scans, 1.8% conversion) and the Ace Hotel Rooftop shoot added +2 (new-venue-type bonus). You're now top 8% of 248 active NYC Food & Beverage creators. Operator tier threshold is score 95 — 3 points away. At your current 3-scan-per-week pace, that's one strong campaign to unlock.",
    href: "/creator/profile/score",
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    read: false,
    category: "updates",
    nextAction: { label: "See leaderboard", href: "/creator/profile/score" },
    fyiArchive: true,
  },
  {
    id: "sys-c-014",
    role: "creator",
    type: "system",
    title: "QR scan rate 18% above average",
    body: "Your Roberta's QR poster is converting at 3.4% — 18% above the campaign average of 2.9%. The checkout placement is driving peak traffic Tue–Sat during lunch (12–2pm) and dinner (6–8pm). Current: 3 of 8 target scans in 2 days — on pace to hit $65 Target by Friday. Tip: ask Marco to angle the poster toward the queue rather than the bar to catch more eyes.",
    href: "/creator/campaigns/roberta-summer",
    createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
    read: false,
    category: "updates",
    nextAction: {
      label: "View live stats",
      href: "/creator/campaigns/roberta-summer",
    },
    fyiArchive: true,
  },
  {
    id: "sys-c-015",
    role: "creator",
    type: "system",
    title: "Brow Theory campaign completed",
    body: "Brow Theory Spring is closed. Final: 14 verified scans (target: 12) — stretch threshold hit, max $75 payout earned. Breakdown: 8 in-session service-day scans, 6 organic return scans within 7 days. Conversion rate 3.1% — your top campaign on record. Brow Theory has flagged you as a preferred creator for their next campaign; you'll get early-access invite when the fall brief drops.",
    href: "/creator/campaigns/browtheory-spring",
    createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
    read: true,
    category: "updates",
    nextAction: {
      label: "View full summary",
      href: "/creator/campaigns/browtheory-spring",
    },
    fyiArchive: true,
  },

  /* ── ACTION — additional ───────────────────────────────────── */
  {
    id: "sys-c-016",
    role: "creator",
    type: "system",
    title: "QR poster ready · Ace Hotel Brooklyn",
    body: "Your Rooftop Summer Series poster is at the lobby desk. Pick up before Sat 5pm — shoot window opens Sunday.",
    href: "/creator/campaigns/acehotel-rooftop/qr",
    createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    read: false,
    category: "action",
    priority: true,
    nextAction: {
      label: "Confirm pickup",
      href: "/creator/campaigns/acehotel-rooftop/qr",
    },
  },
  {
    id: "sys-c-017",
    role: "creator",
    type: "system",
    title: "Shoot window opens tomorrow · Sunday in Brooklyn",
    body: "Weekend Brunch Push runs Sat 5/11 — Sun 5/18. Brief signed. QR confirmed. You're clear to shoot.",
    href: "/creator/campaigns/sunday-brunch",
    createdAt: new Date(Date.now() - 90 * 60 * 1000).toISOString(),
    read: false,
    category: "action",
    nextAction: {
      label: "View campaign",
      href: "/creator/campaigns/sunday-brunch",
    },
  },
  {
    id: "sys-c-018",
    role: "creator",
    type: "system",
    title: "Co-creator collab request · Magnolia Bakery",
    body: "Magnolia wants to pair you with a second creator for the Saturday shoot. Accept or decline by tomorrow 12pm.",
    href: "/creator/campaigns/magnolia-cupcake/collab",
    createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    read: false,
    category: "action",
    priority: true,
    nextAction: {
      label: "Review request",
      href: "/creator/campaigns/magnolia-cupcake/collab",
    },
  },
  {
    id: "sys-c-019",
    role: "creator",
    type: "system",
    title: "Shoot window conflict detected",
    body: "Roberta's (Fri 5/8) overlaps with Fort Greene Coffee (Fri 5/8 — Sun 5/10). Adjust one campaign to avoid a scan dispute.",
    href: "/creator/campaigns",
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    read: false,
    category: "action",
    nextAction: { label: "Resolve conflict", href: "/creator/campaigns" },
  },
  {
    id: "sys-c-020",
    role: "creator",
    type: "system",
    title: "Brief amendment · Devoción Coffee",
    body: "Brand updated the shoot brief — new requirement: include the filter brew station in at least one shot. Tap to review the change.",
    href: "/creator/campaigns/devocion-coldbrew/brief",
    createdAt: new Date(Date.now() - 7 * 60 * 60 * 1000).toISOString(),
    read: true,
    category: "action",
    nextAction: {
      label: "View changes",
      href: "/creator/campaigns/devocion-coldbrew/brief",
    },
  },
  {
    id: "sys-c-021",
    role: "creator",
    type: "system",
    title: "Invite expiring soon · Attaboy",
    body: "Craft Cocktails Campaign · 94% match. 2h left to accept. $40 guaranteed + up to $65 stretch.",
    href: "/creator/gigs/invites",
    createdAt: new Date(Date.now() - 22 * 60 * 60 * 1000).toISOString(),
    read: true,
    category: "action",
    priority: true,
    nextAction: { label: "Review invite", href: "/creator/gigs/invites" },
  },

  /* ── MONEY — additional ────────────────────────────────────── */
  {
    id: "sys-c-022",
    role: "creator",
    type: "system",
    title: "Stretch bonus unlocked · $20",
    body: "Roberta's Pizza: scan #9 pushed you past the stretch threshold. Bonus added to wallet.",
    href: "/creator/wallet",
    createdAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    read: false,
    category: "money",
    nextAction: { label: "View wallet", href: "/creator/wallet" },
    fyiArchive: true,
  },
  {
    id: "sys-c-023",
    role: "creator",
    type: "system",
    title: "Tax form ready · 1099-NEC",
    body: "Your 2025 earnings exceeded $600. 1099-NEC form available for download in account settings.",
    href: "/creator/settings/tax",
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    read: false,
    category: "money",
    priority: true,
    nextAction: { label: "Download form", href: "/creator/settings/tax" },
  },
  {
    id: "sys-c-024",
    role: "creator",
    type: "system",
    title: "Milestone · $500 earned on Push",
    body: "You've crossed $500 in total verified payouts. Your lifetime rate: $3.40 per verified scan.",
    href: "/creator/wallet/history",
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    read: true,
    category: "money",
    nextAction: { label: "View history", href: "/creator/wallet/history" },
    fyiArchive: true,
  },
  {
    id: "sys-c-025",
    role: "creator",
    type: "system",
    title: "Instant payout available",
    body: "$95 ready to withdraw. Standard ACH (1-2 days) or Instant to debit card ($1.50 fee).",
    href: "/creator/wallet",
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    read: false,
    category: "money",
    nextAction: { label: "Withdraw now", href: "/creator/wallet" },
  },
  {
    id: "sys-c-026",
    role: "creator",
    type: "system",
    title: "Referral bonus · $15",
    body: "A creator you referred completed their first campaign. Bonus credited to your wallet.",
    href: "/creator/wallet",
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    read: true,
    category: "money",
    nextAction: { label: "View wallet", href: "/creator/wallet" },
    fyiArchive: true,
  },

  /* ── COMPLIANCE — additional ───────────────────────────────── */
  {
    id: "sys-c-comp-4",
    role: "creator",
    type: "system",
    title: "Story #ad disclosure missing · Devoción",
    body: "Your Cold Brew Story (posted 9:14am) is missing the required #ad tag. Update within 24h to remain in good standing.",
    href: "/creator/compliance/flags",
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    read: false,
    category: "compliance",
    priority: true,
    nextAction: { label: "Fix now", href: "/creator/compliance/flags" },
  },
  {
    id: "sys-c-comp-5",
    role: "creator",
    type: "system",
    title: "Rate card acknowledgment required",
    body: "Push updated payout rates for Food & Beverage campaigns (+8% base). Acknowledge the new rates to keep accepting invites.",
    href: "/creator/compliance/rate-card",
    createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    read: false,
    category: "compliance",
    nextAction: { label: "Acknowledge", href: "/creator/compliance/rate-card" },
  },
  {
    id: "sys-c-comp-6",
    role: "creator",
    type: "system",
    title: "Annual Creator Agreement renewal",
    body: "Your 2025 Creator Agreement expires May 31. Renew early to avoid any invite hold.",
    href: "/creator/compliance/agreement",
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    read: false,
    category: "compliance",
    priority: true,
    nextAction: { label: "Renew now", href: "/creator/compliance/agreement" },
  },
  {
    id: "sys-c-comp-7",
    role: "creator",
    type: "system",
    title: "FTC audit complete · All clear",
    body: "Monthly content review passed. All 6 posts reviewed — disclosures correct, no flags. Next audit: Jun 1.",
    href: "/creator/compliance/audit",
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    read: true,
    category: "compliance",
    nextAction: { label: "View report", href: "/creator/compliance/audit" },
    fyiArchive: true,
  },
  {
    id: "sys-c-comp-8",
    role: "creator",
    type: "system",
    title: "QR placement policy updated",
    body: "v2.1: QR poster must be visible from the ordering/checkout area. Review the updated placement guide.",
    href: "/creator/compliance/qr-policy",
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    read: true,
    category: "compliance",
    nextAction: { label: "Read policy", href: "/creator/compliance/qr-policy" },
    fyiArchive: true,
  },

  /* ── UPDATES — additional ──────────────────────────────────── */
  {
    id: "sys-c-027",
    role: "creator",
    type: "system",
    title: "Reel reach +23% this week",
    body: "Your 3 food reels averaged 6,200 plays this week — up 23% from last week's 5,040. Roberta's Summer Menu led at 9,100 plays (2.1× your 30-day average). Brow Theory BTS placed 2nd at 5,800; Fort Greene Morning Ritual sits at 3,700 but is still climbing — your reels typically peak day 3–5. Watch metric: save rate is up +0.8% this week, which Push weighs heavily in scan-rate predictions. Strong saves now = more invite queue priority next week.",
    href: "/creator/analytics",
    createdAt: new Date(Date.now() - 10 * 60 * 60 * 1000).toISOString(),
    read: false,
    category: "updates",
    nextAction: { label: "Open analytics", href: "/creator/analytics" },
    fyiArchive: true,
  },
  {
    id: "sys-c-028",
    role: "creator",
    type: "system",
    title: "Top 5% in NYC · Food & Beverage",
    body: "You're ranked #12 of 248 active NYC creators in Food & Beverage — top 5% by verified scan conversion rate (3.1% vs. category average 1.8%). Rankings update weekly and influence which brands see your profile first in search. Brands that viewed your profile in the past 7 days: 4 (Devoción follow-on inquiry, 2 Coffee & Cafe brands, 1 new Williamsburg venue). Top-10 is reachable next month if your current pace holds.",
    href: "/creator/profile/score",
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    read: false,
    category: "updates",
    nextAction: { label: "View ranking", href: "/creator/profile/score" },
    fyiArchive: true,
  },
  {
    id: "sys-c-029",
    role: "creator",
    type: "system",
    title: "5-campaign streak · badge earned",
    body: "5 campaigns completed in a row, every one hitting scan target or better — the only active streak in your Brooklyn geography. Breakdown: Brow Theory (14/12), Fort Greene (11/10), Greenpoint Wines (7/7), Blank Street (12/10), June Wine Bar (9/8). Streak Badge is live on your public profile. Internal data: creators with active streaks receive 12% higher brand acceptance rate. Expect increased invite volume this week.",
    href: "/creator/profile",
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    read: true,
    category: "updates",
    nextAction: { label: "View profile", href: "/creator/profile" },
    fyiArchive: true,
  },
  {
    id: "sys-c-030",
    role: "creator",
    type: "system",
    title: "New tool: campaign scheduler",
    body: "Campaign Scheduler is live. Block or open shoot windows by day and time slot — brands see your real-time availability before sending an invite. Early data: creators with availability set receive 2.3× more invites per week. Recommended setup: block 8–10am weekdays, open weekend afternoons — matching your actual top-performing windows. Brands targeting your open slots will see an (Availability Match) tag on your profile, increasing invite click-through by ~40%.",
    href: "/creator/calendar",
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    read: true,
    category: "updates",
    nextAction: { label: "Set availability", href: "/creator/calendar" },
    fyiArchive: true,
  },
  {
    id: "sys-c-031",
    role: "creator",
    type: "system",
    title: "Devoción scan heatmap live",
    body: "6 of 10 target scans verified. Heatmap breakdown: lunch window 12–2pm drove 4 scans (67%), morning rush 8–10am drove 2 scans (33%), zero scans after 4pm (foot traffic drops sharply on Grand St). Scan density is highest near the espresso bar — not the cold brew station where the QR is currently placed. Recommendation: move the poster to the espresso bar facing the queue. This single change could yield 2–3 more scans and clear the $65 target by Thursday.",
    href: "/creator/campaigns/devocion-coldbrew/analytics",
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    read: false,
    category: "updates",
    nextAction: {
      label: "View heatmap",
      href: "/creator/campaigns/devocion-coldbrew/analytics",
    },
    fyiArchive: true,
  },
  {
    id: "sys-c-032",
    role: "creator",
    type: "system",
    title: "Audience insight · Weekend engagement spike",
    body: "Weekend analysis complete. Your Sat–Sun posts convert at 2.1× your weekday rate for Food & Beverage — top performers: Roberta's (Sat 1pm shoot, 9,100 plays), June Wine Bar (Sat 8pm, 7,200 plays). Weekday average is 3,400 plays vs. 7,100 on weekends. Push's matching engine now flags you as a weekend-priority creator — 3 brands with Williamsburg weekend campaigns are queued to send invites. Expected this week: 2–3 invites with +8% payout premium over weekday campaigns.",
    href: "/creator/analytics/audience",
    createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
    read: true,
    category: "updates",
    nextAction: {
      label: "See full insight",
      href: "/creator/analytics/audience",
    },
    fyiArchive: true,
  },

  /* ── PLATFORM — Push product announcements, policy, account ── */
  {
    id: "sys-c-plat-001",
    role: "creator",
    type: "platform",
    title: "Push Platform · v5.4 is live",
    body: "[Placeholder] Platform-level announcements will appear in this channel — version releases, payout policy updates, new feature rollouts, and account-level notices direct from the Push team. This entry is a placeholder; real v5.4 release notes will replace it at launch.",
    href: "/creator/settings/changelog",
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    read: true,
    category: "platform",
    nextAction: {
      label: "View changelog",
      href: "/creator/settings/changelog",
    },
    fyiArchive: true,
  },
  {
    id: "sys-c-plat-002",
    role: "creator",
    type: "platform",
    title: "Identity verified · Payouts unlocked",
    body: "[Placeholder] Account-status notifications will live here: KYC completion, payment method confirmations, payout-eligibility changes, and account-hold notices. This placeholder represents a verified-identity confirmation; real copy to be finalized with the compliance team.",
    href: "/creator/settings/account",
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    read: true,
    category: "platform",
    nextAction: { label: "View account", href: "/creator/settings/account" },
    fyiArchive: true,
  },

  /* ── NETWORK — Brand interest, discovery, profile signals ─── */
  {
    id: "sys-c-net-001",
    role: "creator",
    type: "network",
    title: "4 brands viewed your profile",
    body: "[Placeholder] Brand-interest signals will appear in this channel — which brands viewed your profile, added you to a shortlist, or matched you for an upcoming campaign. Signal strength, category breakdown, and estimated invite likelihood will be surfaced here. This placeholder represents 4 brand profile views in the past 7 days.",
    href: "/creator/profile/analytics",
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    read: false,
    category: "network",
    nextAction: {
      label: "View profile stats",
      href: "/creator/profile/analytics",
    },
    fyiArchive: true,
  },
  {
    id: "sys-c-net-002",
    role: "creator",
    type: "network",
    title: "New brand in your area · Greenpoint",
    body: "[Placeholder] Newly onboarded brands within your active geography will appear here with category, average payout range, and estimated invite likelihood based on your profile match. This lets you follow brands before they send invites. This placeholder represents a new Coffee & Cafe venue in Greenpoint — 0.9mi from your home base, Food & Beverage adjacent.",
    href: "/creator/discovery",
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    read: true,
    category: "network",
    nextAction: { label: "Explore brands", href: "/creator/discovery" },
    fyiArchive: true,
  },
];

/* ──────────────────────────────────────────────────────────────
   NOW VIEW — derive a unified urgency-ranked feed from the
   above three seeds. The Hub no longer holds a parallel mock.
   ────────────────────────────────────────────────────────────── */

export type NowSource = "invite" | "message" | "system" | "compliance";

export type NowItem = {
  id: string;
  source: NowSource;
  /** Smaller = more urgent */
  urgencyMs: number;
  title: string;
  body: string;
  brand?: string;
  brandInitial?: string;
  href: string;
  cta: string;
  payoutHint?: string;
};

/** Compute a Now feed from invites + threads + notifications.
 *  - Pending invites that haven't expired → "INVITE" rows
 *  - Unread messages from brand merchants → "REPLY" rows
 *  - Action / compliance notifications (unsnoozed, unread) → "DEADLINE" / "FTC"
 *
 *  Money & FYI updates are intentionally excluded — Now answers
 *  "what do I need to DO?" not "what happened to my money?". */
export function deriveNowItems(input: {
  invites: Invite[];
  threads: Thread[];
  notifications: SystemNotif[];
}): NowItem[] {
  const now = Date.now();
  const items: NowItem[] = [];

  // Invites — pending, not expired
  for (const inv of input.invites) {
    if (inv.status !== "pending") continue;
    const ms = inv.expiresAt - now;
    if (ms <= 0) continue;
    const hint =
      inv.payoutTiers.length >= 2
        ? `$${inv.payoutTiers[0].amount} → $${inv.payoutTiers[inv.payoutTiers.length - 1].amount}`
        : undefined;
    items.push({
      id: `now-${inv.id}`,
      source: "invite",
      urgencyMs: ms,
      title: `${inv.brand} · ${inv.matchScore}% match`,
      body: `${inv.campaign} · expires in ${Math.max(1, Math.floor(ms / 3600_000))}h`,
      brand: inv.brand,
      brandInitial: inv.brandInitial,
      href: "/creator/gigs/invites",
      cta: "Review",
      payoutHint: hint,
    });
  }

  // Messages — unread from a brand
  for (const t of input.threads) {
    if (!t.unread) continue;
    const lastMsg = t.messages[t.messages.length - 1];
    const ageMs = now - new Date(lastMsg?.at ?? t.createdAt).getTime();
    // Approximate urgency: older unread = lower urgency (audit: don't pretend)
    items.push({
      id: `now-msg-${t.id}`,
      source: "message",
      urgencyMs: Math.max(60_000, 4 * 3600_000 + ageMs),
      title: `${t.sender}: "${(lastMsg?.text ?? t.preview).slice(0, 60)}${(lastMsg?.text ?? t.preview).length > 60 ? "…" : ""}"`,
      body: t.campaign
        ? `${t.campaign} · ${t.attribution ? `${t.attribution.scansVerified}/${t.attribution.scansTarget} scans` : "active"}`
        : "Unread brand reply",
      brand: t.sender,
      brandInitial: t.initial,
      href: "/creator/inbox/messages",
      cta: "Reply",
    });
  }

  // System — only Action and Compliance items still need work; skip
  // money/updates since those answer "what happened" not "what to do"
  for (const n of input.notifications) {
    if (n.read) continue;
    if (n.snoozedUntil && n.snoozedUntil > now) continue;
    if (n.category !== "action" && n.category !== "compliance") continue;
    const ageMs = now - new Date(n.createdAt).getTime();
    items.push({
      id: `now-sys-${n.id}`,
      source: n.category === "compliance" ? "compliance" : "system",
      urgencyMs: Math.max(60_000, 6 * 3600_000 + ageMs),
      title: n.title,
      body: n.body,
      href: n.nextAction?.href ?? n.href ?? "/creator/inbox/system",
      cta: n.nextAction?.label ?? "Open",
    });
  }

  return items.sort((a, b) => a.urgencyMs - b.urgencyMs);
}

/* ── Attribution Events (for /creator/today pulse) ─────────── */

export type AttributionEvent = {
  id: string;
  campaignId: string;
  campaignLabel: string;
  status: "verified" | "pending" | "rejected";
  payoutCents: number;
  occurredAt: string; // ISO
};

export const seedAttributionEvents: AttributionEvent[] = [
  {
    id: "evt-1",
    campaignId: "bayou",
    campaignLabel: "Bayou Coffee · Brooklyn",
    status: "verified",
    payoutCents: 300,
    occurredAt: minutesAgo(2),
  },
  {
    id: "evt-2",
    campaignId: "sweet-chick",
    campaignLabel: "Sweet Chick · LES",
    status: "verified",
    payoutCents: 250,
    occurredAt: minutesAgo(18),
  },
  {
    id: "evt-3",
    campaignId: "sweet-chick",
    campaignLabel: "Sweet Chick · LES",
    status: "pending",
    payoutCents: 0,
    occurredAt: minutesAgo(43),
  },
  {
    id: "evt-4",
    campaignId: "bayou",
    campaignLabel: "Bayou Coffee · Brooklyn",
    status: "verified",
    payoutCents: 300,
    occurredAt: minutesAgo(67),
  },
  {
    id: "evt-5",
    campaignId: "fort-greene-pet",
    campaignLabel: "Fort Greene Pet Shop",
    status: "verified",
    payoutCents: 400,
    occurredAt: minutesAgo(94),
  },
  {
    id: "evt-6",
    campaignId: "bayou",
    campaignLabel: "Bayou Coffee · Brooklyn",
    status: "rejected",
    payoutCents: 0,
    occurredAt: minutesAgo(118),
  },
  {
    id: "evt-7",
    campaignId: "sweet-chick",
    campaignLabel: "Sweet Chick · LES",
    status: "verified",
    payoutCents: 250,
    occurredAt: minutesAgo(156),
  },
  {
    id: "evt-8",
    campaignId: "fort-greene-pet",
    campaignLabel: "Fort Greene Pet Shop",
    status: "pending",
    payoutCents: 0,
    occurredAt: minutesAgo(201),
  },
];
