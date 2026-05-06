export type TourStep = {
  /** CSS selector for the spotlight target. Must be present on /today. */
  target: string;
  /** Magvix Italic title. */
  title: string;
  /** Body line under the title (≤2 sentences). */
  body: string;
};

/** 3-step welcome tour shown once on first visit to /creator/today. */
export const TOUR_STEPS: TourStep[] = [
  {
    target: ".today-pulse-strip",
    title: "Your day at a glance",
    body: "These stats refresh live — what you've earned, what's owed, what's urgent.",
  },
  {
    target: "[href='/creator/gigs/invites'], [href='/creator/gigs']",
    title: "Brands invite you",
    body: "Accept gigs that match your niches. Each pays Guaranteed → Target → Stretch based on verified scans.",
  },
  {
    target: "[href='/creator/earnings']",
    title: "Get paid for real",
    body: "Cash out anytime above $10. Stripe direct deposit lands in 1–2 business days.",
  },
];

export const TOUR_FLAG = "push_tour_completed";
