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

export type Category = "all" | "action" | "money" | "updates" | "compliance";

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
    body: "Triggered by Brow Theory verified scans. See breakdown.",
    href: "/creator/profile/score",
    createdAt: new Date(Date.now() - 20 * 60 * 60 * 1000).toISOString(),
    read: false,
    category: "updates",
    nextAction: { label: "See breakdown", href: "/creator/profile/score" },
    fyiArchive: true,
  },
  {
    id: "sys-c-007",
    role: "creator",
    type: "system",
    title: "Tier · 2 campaigns from Operator",
    body: "Operator unlocks +15% base payouts and priority invite slots.",
    href: "/creator/profile/tier",
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    read: true,
    category: "updates",
    nextAction: { label: "See tier perks", href: "/creator/profile/tier" },
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
      href: "/creator/inbox/invites",
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
