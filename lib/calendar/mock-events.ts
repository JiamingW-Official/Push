// Mock calendar events for creator calendar demo
// Based on DEMO_CAMPAIGNS deadlines from dashboard/page.tsx

export type EventType =
  | "deadline" // Campaign submission deadline — red
  | "review" // Content review meeting — blue
  | "milestone"; // Other milestone — grey

export type EventAction = "submit" | "done" | "note";

export interface CalendarEvent {
  id: string;
  campaignId: string;
  campaignTitle: string;
  merchantName: string;
  type: EventType;
  title: string;
  date: string; // ISO date string YYYY-MM-DD
  time?: string; // HH:MM 24h
  dueAt?: string; // ISO datetime
  description?: string;
  done: boolean;
  note?: string;
  payout?: number;
  postUrl?: string; // /creator/campaigns/[id]/post
  // P1-1: attribution decay milestone marker (D+30/60/90)
  isDecayMilestone?: boolean;
  decayDayNumber?: number;
}

// ── April 2026 events ─────────────────────────────────────

const APRIL: CalendarEvent[] = [
  // Blank Street Coffee — camp-001 deadline Apr 30
  {
    id: "ev-001",
    campaignId: "camp-001",
    campaignTitle: "Morning Ritual Campaign",
    merchantName: "Blank Street Coffee",
    type: "milestone",
    title: "Visit scheduled — Blank Street Coffee",
    date: "2026-04-17",
    time: "08:00",
    description:
      "Peak hours visit window: 7–10am. Remember to tag @blankstreetcoffee.",
    done: false,
    payout: 0,
  },
  {
    id: "ev-002",
    campaignId: "camp-001",
    campaignTitle: "Morning Ritual Campaign",
    merchantName: "Blank Street Coffee",
    type: "review",
    title: "Content review — Morning Ritual",
    date: "2026-04-20",
    time: "10:00",
    description: "Submit draft story for brand review before posting.",
    done: false,
    payout: 0,
  },
  {
    id: "ev-003",
    campaignId: "camp-001",
    campaignTitle: "Morning Ritual Campaign",
    merchantName: "Blank Street Coffee",
    type: "deadline",
    title: "Submit story — Morning Ritual Campaign",
    date: "2026-04-30",
    time: "23:59",
    description:
      "Final deadline to submit Instagram story. Tag @blankstreetcoffee.",
    done: false,
    payout: 0,
    postUrl: "/creator/campaigns/camp-001/post",
  },

  // Superiority Burger — camp-002 deadline Apr 25
  {
    id: "ev-004",
    campaignId: "camp-002",
    campaignTitle: "Best Burger in NYC Feature",
    merchantName: "Superiority Burger",
    type: "milestone",
    title: "Visit & film — Superiority Burger",
    date: "2026-04-18",
    time: "12:00",
    description: "Film your Reel featuring the Classic Burger. Min 30 seconds.",
    done: false,
    payout: 35,
  },
  {
    id: "ev-005",
    campaignId: "camp-002",
    campaignTitle: "Best Burger in NYC Feature",
    merchantName: "Superiority Burger",
    type: "review",
    title: "Reel approval — Superiority Burger",
    date: "2026-04-22",
    time: "14:00",
    description: "Content review call. Submit draft Reel link beforehand.",
    done: false,
    payout: 35,
  },
  {
    id: "ev-006",
    campaignId: "camp-002",
    campaignTitle: "Best Burger in NYC Feature",
    merchantName: "Superiority Burger",
    type: "deadline",
    title: "Post Reel deadline — Best Burger Feature",
    date: "2026-04-25",
    time: "23:59",
    description:
      "Final deadline. Reel must be live and tagged @superiorityburger.",
    done: false,
    payout: 35,
    postUrl: "/creator/campaigns/camp-002/post",
  },
  // Brow Theory — camp-004 deadline Apr 28
  {
    id: "ev-008",
    campaignId: "camp-004",
    campaignTitle: "Brow Transformation Story",
    merchantName: "Brow Theory",
    type: "milestone",
    title: "Appointment — Brow Theory",
    date: "2026-04-19",
    time: "11:00",
    description: "Brow appointment at 247 Centre St. Capture before & after.",
    done: false,
    payout: 50,
  },
  {
    id: "ev-009",
    campaignId: "camp-004",
    campaignTitle: "Brow Transformation Story",
    merchantName: "Brow Theory",
    type: "review",
    title: "Content check — Brow Transformation",
    date: "2026-04-24",
    time: "15:00",
    description: "Submit before/after stories for quick review by brand team.",
    done: false,
    payout: 50,
  },
  {
    id: "ev-010",
    campaignId: "camp-004",
    campaignTitle: "Brow Transformation Story",
    merchantName: "Brow Theory",
    type: "deadline",
    title: "Post deadline — Brow Transformation Story",
    date: "2026-04-28",
    time: "23:59",
    description: "Post before/after stories + feed post. Tag @browtheorynyc.",
    done: false,
    payout: 50,
    postUrl: "/creator/campaigns/camp-004/post",
  },

  // Le Bec Fin — camp-006 deadline Apr 22
  {
    id: "ev-011",
    campaignId: "camp-006",
    campaignTitle: "Le Bec-Fin Pop-Up Review",
    merchantName: "Le Bec Fin",
    type: "milestone",
    title: "Visit — Le Bec-Fin Pop-Up",
    date: "2026-04-17",
    time: "19:00",
    description:
      "Visit the pop-up at Rockefeller Plaza. Capture the experience.",
    done: true,
    payout: 20,
  },
  {
    id: "ev-012",
    campaignId: "camp-006",
    campaignTitle: "Le Bec-Fin Pop-Up Review",
    merchantName: "Le Bec Fin",
    type: "deadline",
    title: "Post review deadline — Le Bec-Fin",
    date: "2026-04-22",
    time: "23:59",
    description: "Post review story or post. Tag location.",
    done: false,
    payout: 20,
    postUrl: "/creator/campaigns/camp-006/post",
  },
  // Cha Cha Matcha — camp-008 deadline Apr 29
  {
    id: "ev-014",
    campaignId: "camp-008",
    campaignTitle: "Matcha Morning Ritual",
    merchantName: "Cha Cha Matcha",
    type: "milestone",
    title: "Matcha shoot — Cha Cha Matcha",
    date: "2026-04-21",
    time: "08:30",
    description: "Morning shoot at 373 Broadway. Aesthetic, cozy content.",
    done: false,
    payout: 25,
  },
  {
    id: "ev-015",
    campaignId: "camp-008",
    campaignTitle: "Matcha Morning Ritual",
    merchantName: "Cha Cha Matcha",
    type: "deadline",
    title: "Post stories deadline — Matcha Ritual",
    date: "2026-04-29",
    time: "23:59",
    description: "Post 2 Instagram stories. Tag @chachamatcha.",
    done: false,
    payout: 25,
    postUrl: "/creator/campaigns/camp-008/post",
  },
];

// ── May 2026 events ───────────────────────────────────────

const MAY: CalendarEvent[] = [
  // Flamingo Estate — camp-003 deadline May 5
  {
    id: "ev-017",
    campaignId: "camp-003",
    campaignTitle: "LA Botanica Aesthetic Shoot",
    merchantName: "Flamingo Estate",
    type: "milestone",
    title: "Brand guidelines received — Flamingo Estate",
    date: "2026-05-01",
    time: "09:00",
    description: "Receive brand guidelines for the aesthetic shoot.",
    done: false,
    payout: 75,
  },
  {
    id: "ev-018",
    campaignId: "camp-003",
    campaignTitle: "LA Botanica Aesthetic Shoot",
    merchantName: "Flamingo Estate",
    type: "review",
    title: "Content submission for approval — Flamingo Estate",
    date: "2026-05-03",
    time: "17:00",
    description:
      "Submit content 48h before posting. Moody, editorial, nature-forward.",
    done: false,
    payout: 75,
  },
  {
    id: "ev-019",
    campaignId: "camp-003",
    campaignTitle: "LA Botanica Aesthetic Shoot",
    merchantName: "Flamingo Estate",
    type: "deadline",
    title: "Post deadline — LA Botanica Shoot",
    date: "2026-05-05",
    time: "23:59",
    description: "Post 2 feed posts + 3 stories. Tag Flamingo Estate.",
    done: false,
    payout: 75,
    postUrl: "/creator/campaigns/camp-003/post",
  },
  // Glossier — camp-005 deadline May 10
  {
    id: "ev-021",
    campaignId: "camp-005",
    campaignTitle: "Glossier NYC Store Experience",
    merchantName: "Glossier",
    type: "milestone",
    title: "Store visit & first shoot — Glossier",
    date: "2026-05-04",
    time: "13:00",
    description:
      "First editorial shoot at Glossier flagship. High production value.",
    done: false,
    payout: 120,
  },
  {
    id: "ev-022",
    campaignId: "camp-005",
    campaignTitle: "Glossier NYC Store Experience",
    merchantName: "Glossier",
    type: "review",
    title: "Content review — Glossier editorial",
    date: "2026-05-07",
    time: "14:00",
    description: "Review call for 3+ feed posts and video draft.",
    done: false,
    payout: 120,
  },
  {
    id: "ev-023",
    campaignId: "camp-005",
    campaignTitle: "Glossier NYC Store Experience",
    merchantName: "Glossier",
    type: "deadline",
    title: "Post deadline — Glossier Experience",
    date: "2026-05-10",
    time: "23:59",
    description: "Post 3+ feed posts + YouTube/TikTok video (min 3 min).",
    done: false,
    payout: 120,
    postUrl: "/creator/campaigns/camp-005/post",
  },
  // KITH — camp-007 deadline May 15
  {
    id: "ev-025",
    campaignId: "camp-007",
    campaignTitle: "KITH x Creator Collab Series",
    merchantName: "KITH",
    type: "milestone",
    title: "Portfolio review — KITH Collab",
    date: "2026-05-02",
    time: "10:00",
    description: "Portfolio review required. Prepare best editorial work.",
    done: false,
    payout: 199,
  },
  {
    id: "ev-026",
    campaignId: "camp-007",
    campaignTitle: "KITH x Creator Collab Series",
    merchantName: "KITH",
    type: "review",
    title: "Style editorial review — KITH Spring 2026",
    date: "2026-05-09",
    time: "11:00",
    description:
      "Review first batch of 5 feed posts for Spring 2026 collection.",
    done: false,
    payout: 199,
  },
  {
    id: "ev-027",
    campaignId: "camp-007",
    campaignTitle: "KITH x Creator Collab Series",
    merchantName: "KITH",
    type: "review",
    title: "Reels review — KITH Collab",
    date: "2026-05-12",
    time: "14:00",
    description: "Review 2 Reels for KITH collab campaign.",
    done: false,
    payout: 199,
  },
  {
    id: "ev-028",
    campaignId: "camp-007",
    campaignTitle: "KITH x Creator Collab Series",
    merchantName: "KITH",
    type: "deadline",
    title: "Final post deadline — KITH Collab",
    date: "2026-05-15",
    time: "23:59",
    description: "All 5+ posts and 2 Reels must be live.",
    done: false,
    payout: 199,
    postUrl: "/creator/campaigns/camp-007/post",
  },
  // General push milestones
  {
    id: "ev-030",
    campaignId: "camp-005",
    campaignTitle: "Glossier NYC Store Experience",
    merchantName: "Glossier",
    type: "milestone",
    title: "Second shoot session — Glossier",
    date: "2026-05-06",
    time: "11:00",
    description: "Second editorial session at flagship for remaining posts.",
    done: false,
    payout: 120,
  },
  {
    id: "ev-031",
    campaignId: "camp-007",
    campaignTitle: "KITH x Creator Collab Series",
    merchantName: "KITH",
    type: "milestone",
    title: "Store access — KITH SoHo exclusive",
    date: "2026-05-05",
    time: "09:00",
    description: "Exclusive creator access to KITH SoHo for editorial shoot.",
    done: false,
    payout: 199,
  },
  {
    id: "ev-032",
    campaignId: "camp-003",
    campaignTitle: "LA Botanica Aesthetic Shoot",
    merchantName: "Flamingo Estate",
    type: "milestone",
    title: "Second shoot session — Flamingo Estate pop-up",
    date: "2026-05-04",
    time: "16:00",
    description: "Capture remaining 2 stories in afternoon light.",
    done: false,
    payout: 75,
  },

  // ── Attribution Decay Milestones (D+30 from April deadlines) ──
  // April 22 (Le Bec Fin) + 30 = May 22
  {
    id: "ev-decay-001",
    campaignId: "camp-006",
    campaignTitle: "Le Bec-Fin Pop-Up Review",
    merchantName: "Le Bec Fin",
    type: "milestone",
    title: "D+30 attribution decay — Le Bec-Fin",
    date: "2026-05-22",
    description:
      "Attribution weight drops to 50% after D+30. QR scans still count at half value through D+60.",
    done: false,
    payout: 0,
    isDecayMilestone: true,
    decayDayNumber: 30,
  },
  // April 25 (Superiority Burger) + 30 = May 25
  {
    id: "ev-decay-002",
    campaignId: "camp-002",
    campaignTitle: "Best Burger in NYC Feature",
    merchantName: "Superiority Burger",
    type: "milestone",
    title: "D+30 attribution decay — Superiority Burger",
    date: "2026-05-25",
    description:
      "Attribution weight drops to 50% after D+30. QR scans still count at half value through D+60.",
    done: false,
    payout: 0,
    isDecayMilestone: true,
    decayDayNumber: 30,
  },
  // April 28 (Brow Theory) + 30 = May 28
  {
    id: "ev-decay-003",
    campaignId: "camp-004",
    campaignTitle: "Brow Transformation Story",
    merchantName: "Brow Theory",
    type: "milestone",
    title: "D+30 attribution decay — Brow Theory",
    date: "2026-05-28",
    description:
      "Attribution weight drops to 50% after D+30. QR scans still count at half value through D+60.",
    done: false,
    payout: 0,
    isDecayMilestone: true,
    decayDayNumber: 30,
  },
  // April 29 (Cha Cha Matcha) + 30 = May 29
  {
    id: "ev-decay-004",
    campaignId: "camp-008",
    campaignTitle: "Matcha Morning Ritual",
    merchantName: "Cha Cha Matcha",
    type: "milestone",
    title: "D+30 attribution decay — Cha Cha Matcha",
    date: "2026-05-29",
    description:
      "Attribution weight drops to 50% after D+30. QR scans still count at half value through D+60.",
    done: false,
    payout: 0,
    isDecayMilestone: true,
    decayDayNumber: 30,
  },
  // April 30 (Blank Street Coffee) + 30 = May 30
  {
    id: "ev-decay-005",
    campaignId: "camp-001",
    campaignTitle: "Morning Ritual Campaign",
    merchantName: "Blank Street Coffee",
    type: "milestone",
    title: "D+30 attribution decay — Blank Street Coffee",
    date: "2026-05-30",
    description:
      "Attribution weight drops to 50% after D+30. QR scans still count at half value through D+60.",
    done: false,
    payout: 0,
    isDecayMilestone: true,
    decayDayNumber: 30,
  },
];

// ── June 2026 events ──────────────────────────────────────

const JUNE: CalendarEvent[] = [
  // ── Attribution Decay Milestones (D+60 from April deadlines) ──
  // April 22 (Le Bec Fin) + 60 = June 21
  {
    id: "ev-decay-006",
    campaignId: "camp-006",
    campaignTitle: "Le Bec-Fin Pop-Up Review",
    merchantName: "Le Bec Fin",
    type: "milestone",
    title: "D+60 attribution decay — Le Bec-Fin",
    date: "2026-06-21",
    description:
      "Attribution weight drops to 25% after D+60. Window fully expires at D+90 (Jul 21).",
    done: false,
    payout: 0,
    isDecayMilestone: true,
    decayDayNumber: 60,
  },
  // April 25 (Superiority Burger) + 60 = June 24
  {
    id: "ev-decay-007",
    campaignId: "camp-002",
    campaignTitle: "Best Burger in NYC Feature",
    merchantName: "Superiority Burger",
    type: "milestone",
    title: "D+60 attribution decay — Superiority Burger",
    date: "2026-06-24",
    description:
      "Attribution weight drops to 25% after D+60. Window fully expires at D+90 (Jul 24).",
    done: false,
    payout: 0,
    isDecayMilestone: true,
    decayDayNumber: 60,
  },
  // April 28 (Brow Theory) + 60 = June 27
  {
    id: "ev-decay-008",
    campaignId: "camp-004",
    campaignTitle: "Brow Transformation Story",
    merchantName: "Brow Theory",
    type: "milestone",
    title: "D+60 attribution decay — Brow Theory",
    date: "2026-06-27",
    description:
      "Attribution weight drops to 25% after D+60. Window fully expires at D+90 (Jul 27).",
    done: false,
    payout: 0,
    isDecayMilestone: true,
    decayDayNumber: 60,
  },
  // April 29 (Cha Cha Matcha) + 60 = June 28
  {
    id: "ev-decay-009",
    campaignId: "camp-008",
    campaignTitle: "Matcha Morning Ritual",
    merchantName: "Cha Cha Matcha",
    type: "milestone",
    title: "D+60 attribution decay — Cha Cha Matcha",
    date: "2026-06-28",
    description:
      "Attribution weight drops to 25% after D+60. Window fully expires at D+90 (Jul 28).",
    done: false,
    payout: 0,
    isDecayMilestone: true,
    decayDayNumber: 60,
  },
  // April 30 (Blank Street Coffee) + 60 = June 29
  {
    id: "ev-decay-010",
    campaignId: "camp-001",
    campaignTitle: "Morning Ritual Campaign",
    merchantName: "Blank Street Coffee",
    type: "milestone",
    title: "D+60 attribution decay — Blank Street Coffee",
    date: "2026-06-29",
    description:
      "Attribution weight drops to 25% after D+60. Window fully expires at D+90 (Jul 29).",
    done: false,
    payout: 0,
    isDecayMilestone: true,
    decayDayNumber: 60,
  },

  // Future campaigns (placeholder)
  {
    id: "ev-033",
    campaignId: "camp-future-01",
    campaignTitle: "Summer Rooftop Series",
    merchantName: "The William Vale",
    type: "milestone",
    title: "Invite received — Summer Rooftop Series",
    date: "2026-06-01",
    time: "09:00",
    description: "New campaign invite for premium rooftop shoot.",
    done: false,
    payout: 150,
  },
  {
    id: "ev-034",
    campaignId: "camp-future-01",
    campaignTitle: "Summer Rooftop Series",
    merchantName: "The William Vale",
    type: "review",
    title: "Concept call — Summer Rooftop Series",
    date: "2026-06-05",
    time: "10:00",
    description: "Creative direction call with brand team.",
    done: false,
    payout: 150,
  },
  {
    id: "ev-035",
    campaignId: "camp-future-01",
    campaignTitle: "Summer Rooftop Series",
    merchantName: "The William Vale",
    type: "milestone",
    title: "Shoot day — The William Vale rooftop",
    date: "2026-06-10",
    time: "17:00",
    description: "Golden hour shoot on the rooftop. Bring equipment.",
    done: false,
    payout: 150,
  },
  {
    id: "ev-036",
    campaignId: "camp-future-01",
    campaignTitle: "Summer Rooftop Series",
    merchantName: "The William Vale",
    type: "review",
    title: "Content review — Summer Rooftop",
    date: "2026-06-13",
    time: "14:00",
    description: "Submit edited photos and Reel draft.",
    done: false,
    payout: 150,
  },
  {
    id: "ev-037",
    campaignId: "camp-future-01",
    campaignTitle: "Summer Rooftop Series",
    merchantName: "The William Vale",
    type: "deadline",
    title: "Post deadline — Summer Rooftop Series",
    date: "2026-06-15",
    time: "23:59",
    description: "All content must be live by midnight.",
    done: false,
    payout: 150,
    postUrl: "/creator/campaigns/camp-future-01/post",
  },
  {
    id: "ev-039",
    campaignId: "camp-future-02",
    campaignTitle: "Williamsburg Food Walk",
    merchantName: "Various",
    type: "milestone",
    title: "Food walk scheduled — Williamsburg",
    date: "2026-06-20",
    time: "12:00",
    description:
      "Multi-venue food walk campaign covering 5 spots in Williamsburg.",
    done: false,
    payout: 80,
  },
  {
    id: "ev-040",
    campaignId: "camp-future-02",
    campaignTitle: "Williamsburg Food Walk",
    merchantName: "Various",
    type: "deadline",
    title: "Post deadline — Williamsburg Food Walk",
    date: "2026-06-25",
    time: "23:59",
    description: "Post series of stories and a Reel from the food walk.",
    done: false,
    payout: 80,
    postUrl: "/creator/campaigns/camp-future-02/post",
  },
  {
    id: "ev-042",
    campaignId: "camp-future-03",
    campaignTitle: "Brooklyn Art Week Feature",
    merchantName: "Industry City",
    type: "milestone",
    title: "Press access — Brooklyn Art Week",
    date: "2026-06-08",
    time: "10:00",
    description: "Creator press pass for Brooklyn Art Week at Industry City.",
    done: false,
    payout: 200,
  },
  {
    id: "ev-043",
    campaignId: "camp-future-03",
    campaignTitle: "Brooklyn Art Week Feature",
    merchantName: "Industry City",
    type: "review",
    title: "Draft review — Brooklyn Art Week coverage",
    date: "2026-06-22",
    time: "15:00",
    description: "Review week's content package before final post.",
    done: false,
    payout: 200,
  },
  {
    id: "ev-044",
    campaignId: "camp-future-03",
    campaignTitle: "Brooklyn Art Week Feature",
    merchantName: "Industry City",
    type: "deadline",
    title: "Content deadline — Brooklyn Art Week",
    date: "2026-06-30",
    time: "23:59",
    description: "Full coverage package must be live before month end.",
    done: false,
    payout: 200,
    postUrl: "/creator/campaigns/camp-future-03/post",
  },
];

// ── Combined export ───────────────────────────────────────

export const MOCK_EVENTS: CalendarEvent[] = [...APRIL, ...MAY, ...JUNE];

export function getEventsForMonth(yearMonth: string): CalendarEvent[] {
  return MOCK_EVENTS.filter((e) => e.date.startsWith(yearMonth));
}

export function getEventsForDate(date: string): CalendarEvent[] {
  return MOCK_EVENTS.filter((e) => e.date === date);
}

export function countDeadlinesInMonth(yearMonth: string): number {
  return MOCK_EVENTS.filter(
    (e) => e.date.startsWith(yearMonth) && e.type === "deadline",
  ).length;
}

/**
 * Event-type CSS class names. Colors are NOT defined here — they live in
 * `app/(creator)/creator/(workspace)/work/calendar/calendar.css` via the
 * Design.md § 2 closed-list tokens (--brand-red / --accent-blue / --champagne
 * / --mist). Consumers attach this class plus a base class (e.g.
 * `cal-pill-event` or `cal-side__event`) and the CSS resolves the color.
 *
 * Token mapping (single source of truth, see calendar.css comment header):
 *   deadline  -> --brand-red   (Brand Red, primary CTA role)
 *   review    -> --accent-blue (N2W Blue, secondary)
 *   payment   -> --champagne   (ceremonial)
 *   milestone -> --mist        (warm-gray neutral)
 */
export const EVENT_TYPE_CLASSNAMES: Record<EventType, string> = {
  deadline: "event-type--deadline",
  review: "event-type--review",
  milestone: "event-type--milestone",
};

/**
 * @deprecated since v11 closed-color-list migration. Use
 * `EVENT_TYPE_CLASSNAMES` instead — colors are now resolved via CSS classes
 * against tokens declared in calendar.css. This alias is kept as a class-name
 * map (not hex) so any pre-existing import compiles, but the value is no
 * longer a color string.
 */
export const EVENT_TYPE_COLORS: Record<EventType, string> =
  EVENT_TYPE_CLASSNAMES;

export const EVENT_TYPE_LABELS: Record<EventType, string> = {
  deadline: "Deadline",
  review: "Content Review",
  milestone: "Milestone",
};
