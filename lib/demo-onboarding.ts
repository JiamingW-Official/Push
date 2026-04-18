export const CONTENT_CATEGORIES = [
  { id: "food", label: "Food & Drink", icon: "", popular: true },
  { id: "cafe", label: "Café & Coffee", icon: "", popular: true },
  { id: "dessert", label: "Desserts & Bakery", icon: "", popular: true },
  { id: "beauty", label: "Beauty & Wellness", icon: "", popular: false },
  { id: "retail", label: "Local Retail", icon: "", popular: false },
  { id: "nightlife", label: "Nightlife & Bars", icon: "", popular: false },
  { id: "fitness", label: "Fitness & Yoga", icon: "", popular: false },
  { id: "experience", label: "Experiences", icon: "", popular: false },
];

export const AVAILABILITY_SLOTS = [
  {
    id: "weekday_morning",
    label: "Weekday Mornings",
    time: "9am–12pm",
    icon: "",
  },
  {
    id: "weekday_afternoon",
    label: "Weekday Afternoons",
    time: "12pm–5pm",
    icon: "",
  },
  {
    id: "weekday_evening",
    label: "Weekday Evenings",
    time: "5pm–9pm",
    icon: "",
  },
  {
    id: "weekend_morning",
    label: "Weekend Mornings",
    time: "9am–12pm",
    icon: "",
  },
  {
    id: "weekend_afternoon",
    label: "Weekend Afternoons",
    time: "12pm–5pm",
    icon: "",
  },
  {
    id: "weekend_evening",
    label: "Weekend Evenings",
    time: "5pm–9pm",
    icon: "",
  },
];

export const DEMO_ONBOARDING_STATE = {
  selectedCategories: ["food", "cafe", "dessert"],
  selectedAvailability: [
    "weekday_afternoon",
    "weekend_morning",
    "weekend_afternoon",
  ],
  instagramHandle: "alexcreates",
  followerCount: 4200,
  bio: "NYC food & lifestyle creator. I find the hidden gems your neighborhood forgot about.",
  step: 4, // completed
  completedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
  matchStartedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
};

export type OnboardingStep = {
  id: number;
  title: string;
  subtitle: string;
  key: string;
};

export const ONBOARDING_STEPS: OnboardingStep[] = [
  {
    id: 1,
    title: "What do you create?",
    subtitle:
      "Pick the types of local businesses you love visiting and posting about.",
    key: "categories",
  },
  {
    id: 2,
    title: "When are you free?",
    subtitle:
      "Campaigns are matched to your schedule. Pick your typical free windows.",
    key: "availability",
  },
  {
    id: 3,
    title: "Connect Instagram",
    subtitle:
      "We use your follower count for tier placement. We never post on your behalf.",
    key: "instagram",
  },
  {
    id: 4,
    title: "Your match is being prepared",
    subtitle: "Push AI matches you to campaigns in your area within 48 hours.",
    key: "match_promise",
  },
];

export const TIER_THRESHOLDS = {
  seed: {
    minScore: 0,
    maxScore: 30,
    label: "Seed",
    description: "Just getting started",
  },
  explorer: {
    minScore: 31,
    maxScore: 50,
    label: "Explorer",
    description: "Building your track record",
  },
  operator: {
    minScore: 51,
    maxScore: 65,
    label: "Operator",
    description: "Consistent creator",
  },
  proven: {
    minScore: 66,
    maxScore: 78,
    label: "Proven",
    description: "Trusted by merchants",
  },
  closer: {
    minScore: 79,
    maxScore: 89,
    label: "Closer",
    description: "High-value creator",
  },
  partner: {
    minScore: 90,
    maxScore: 100,
    label: "Partner",
    description: "Elite tier",
  },
};

export function getMatchQualityMessage(
  followers: number,
  categories: string[],
): string {
  if (followers >= 10000)
    return "High follower count unlocks premium campaign access.";
  if (followers >= 5000)
    return "Your audience size qualifies you for most campaigns.";
  if (followers >= 1000)
    return "Great start. Complete 3 campaigns to boost your score.";
  return "Every creator starts here. Your first campaign builds your reputation.";
}
