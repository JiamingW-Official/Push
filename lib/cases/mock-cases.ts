// Mock case study data — 5 fictional NYC merchants

export interface CaseOutcome {
  value: string;
  label: string;
}

export interface CaseStep {
  number: string;
  title: string;
  description: string;
}

export interface CaseChartPoint {
  label: string;
  value: number;
}

export interface Case {
  slug: string;
  name: string;
  neighborhood: string;
  category: string;
  tagline: string;
  heroImage: string;
  merchantLogo: string;
  // Card-level: primary outcome big number
  primaryOutcome: CaseOutcome;
  // Detail-level: 3 outcomes
  outcomes: [CaseOutcome, CaseOutcome, CaseOutcome];
  challenge: string;
  steps: CaseStep[];
  chartPoints: CaseChartPoint[];
  chartLabel: string;
  pullQuote: string;
  pullQuoteAuthor: string;
  pullQuoteRole: string;
}

export const CASES: Case[] = [
  {
    slug: "robertas-bed-stuy",
    name: "Roberta's Bed-Stuy",
    neighborhood: "Bed-Stuy, Brooklyn",
    category: "Pizza",
    tagline:
      "340 verified walk-ins in six weeks — without spending a dollar on ads.",
    heroImage:
      "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=1200&q=80",
    merchantLogo: "RB",
    primaryOutcome: { value: "340", label: "Verified Walk-ins" },
    outcomes: [
      { value: "340", label: "Verified Walk-ins" },
      { value: "6 wks", label: "Campaign Duration" },
      { value: "2.4×", label: "Friday Revenue Lift" },
    ],
    challenge:
      "We opened our second location in Bed-Stuy in January. The neighborhood knew pizza — " +
      "they just didn't know us. Traditional ads felt wrong for the block. We needed real people " +
      "talking to real neighbors, not a banner on a subway wall. Our Friday and Saturday nights " +
      "had dead spots between 5 and 7 PM that we couldn't crack. We had the dough — we needed the crowd.",
    steps: [
      {
        number: "01",
        title: "Seed creator selection",
        description:
          "Push matched us with 11 food and neighborhood creators in a 2-mile radius. " +
          "Each creator received a complimentary tasting session before the campaign launched.",
      },
      {
        number: "02",
        title: "QR-linked content drops",
        description:
          "Creators published organic content — no #ad, no scripted lines. Every post embedded " +
          "a unique Push QR link tied to the creator's attribution token.",
      },
      {
        number: "03",
        title: "Walk-in verification at POS",
        description:
          "Customers scanned the QR at the register. Push logged the visit, matched it to the " +
          "originating creator, and triggered a $32 payout — all in under two seconds.",
      },
      {
        number: "04",
        title: "Off-peak scheduling",
        description:
          "We tuned creator post timing to hit the 4–6 PM window. Walk-in volume in that slot " +
          "climbed 240% by week four, turning our dead hours into our busiest daypart.",
      },
    ],
    chartPoints: [
      { label: "Wk 1", value: 28 },
      { label: "Wk 2", value: 41 },
      { label: "Wk 3", value: 55 },
      { label: "Wk 4", value: 72 },
      { label: "Wk 5", value: 68 },
      { label: "Wk 6", value: 76 },
    ],
    chartLabel: "Weekly verified walk-ins",
    pullQuote:
      "Push turned our Friday slow hours into our busiest shift. I can see exactly which creator drove which customer — that's never been possible before.",
    pullQuoteAuthor: "Marcus Webb",
    pullQuoteRole: "Co-owner, Roberta's Bed-Stuy",
  },
  {
    slug: "bloom-florals-williamsburg",
    name: "Bloom Florals",
    neighborhood: "Williamsburg, Brooklyn",
    category: "Florals",
    tagline:
      "$4,200 in attributed orders from 128 tracked purchases — zero ad budget.",
    heroImage:
      "https://images.unsplash.com/photo-1487530811015-780e8734e6b0?w=1200&q=80",
    merchantLogo: "BF",
    primaryOutcome: { value: "$4.2K", label: "Revenue Attributed" },
    outcomes: [
      { value: "128", label: "Orders Tracked" },
      { value: "$4,200", label: "Attributed Revenue" },
      { value: "34%", label: "New Customer Rate" },
    ],
    challenge:
      "Florals is a visual product — people buy with their eyes before they ever smell a bloom. " +
      "We'd been doing Instagram ourselves but the reach plateau hit hard around 2,000 followers. " +
      "Williamsburg is saturated with aesthetically-driven brands. Standing out meant getting our " +
      "arrangements into the feeds of people who trust the creator over the brand. The problem was " +
      "proving ROI. We couldn't tell if any of it was working.",
    steps: [
      {
        number: "01",
        title: "Aesthetic creator matching",
        description:
          "Push identified 8 lifestyle and home-décor creators whose visual palettes aligned " +
          "with Bloom's editorial direction. No lifestyle mismatches.",
      },
      {
        number: "02",
        title: "Attribution link per arrangement",
        description:
          "Each creator received a unique Push link to embed in stories and bio. When a follower " +
          "tapped through and completed an order, the attribution fired instantly.",
      },
      {
        number: "03",
        title: "Seasonal content cadence",
        description:
          "We ran the campaign across Valentine's Day and Mother's Day peaks. Push's scheduling " +
          "tools let us activate and pause creators based on inventory thresholds.",
      },
    ],
    chartPoints: [
      { label: "Week 1", value: 8 },
      { label: "Week 2", value: 19 },
      { label: "Week 3", value: 31 },
      { label: "Week 4", value: 28 },
      { label: "Week 5", value: 24 },
      { label: "Week 6", value: 18 },
    ],
    chartLabel: "Weekly orders attributed via Push",
    pullQuote:
      "For the first time I could see a dollar figure next to a creator's name. Not estimates — real orders, real revenue. That changed how I think about marketing entirely.",
    pullQuoteAuthor: "Simone Tran",
    pullQuoteRole: "Owner, Bloom Florals Williamsburg",
  },
  {
    slug: "the-roast-room-chelsea",
    name: "The Roast Room",
    neighborhood: "Chelsea, Manhattan",
    category: "Coffee",
    tagline: "14 creators, 95 verified visits, 3× ROI on a $0 media budget.",
    heroImage:
      "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=1200&q=80",
    merchantLogo: "RR",
    primaryOutcome: { value: "3×", label: "ROI on Payout Spend" },
    outcomes: [
      { value: "95", label: "Verified Visits" },
      { value: "14", label: "Active Creators" },
      { value: "3×", label: "ROI on Payout Spend" },
    ],
    challenge:
      "Chelsea is where New York coffee is at its most opinionated. We knew our single-origin " +
      "program was exceptional — the problem was getting people in the door before they'd formed " +
      "an attachment to a competitor. Our loyalty numbers were strong for regulars but new trial " +
      "was flat. Every performance channel we'd tried delivered clicks, not cappuccinos.",
    steps: [
      {
        number: "01",
        title: "Micro-creator activation",
        description:
          "We activated 14 creators — deliberately chosen for smaller, highly engaged followings " +
          "under 15K. Niche beats reach in a category defined by taste and trust.",
      },
      {
        number: "02",
        title: "Trial visit campaign",
        description:
          "Creators shared their genuine first visit. Push's QR attribution meant every subsequent " +
          "walk-in from that content registered against the original creator.",
      },
      {
        number: "03",
        title: "Payout-per-visit model",
        description:
          "Creators earned $32 per verified customer they drove. Total payout was $3,040. " +
          "Verified revenue from those visits exceeded $9,100 — a 3× return.",
      },
    ],
    chartPoints: [
      { label: "Wk 1", value: 6 },
      { label: "Wk 2", value: 14 },
      { label: "Wk 3", value: 22 },
      { label: "Wk 4", value: 28 },
      { label: "Wk 5", value: 18 },
      { label: "Wk 6", value: 7 },
    ],
    chartLabel: "Verified visits per week",
    pullQuote:
      "We'd never been able to measure word-of-mouth before. Push turned it into a line item — a profitable one.",
    pullQuoteAuthor: "Dani Osei",
    pullQuoteRole: "Director, The Roast Room Chelsea",
  },
  {
    slug: "bodega-azul-bushwick",
    name: "Bodega Azul",
    neighborhood: "Bushwick, Brooklyn",
    category: "Bodega / Latin Grocery",
    tagline:
      "220 foot-traffic events verified — a neighborhood store became a destination.",
    heroImage:
      "https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=1200&q=80",
    merchantLogo: "BA",
    primaryOutcome: { value: "220", label: "Foot Traffic Events" },
    outcomes: [
      { value: "220", label: "Foot Traffic Events" },
      { value: "8 wks", label: "Campaign Window" },
      { value: "62%", label: "New vs Returning Split" },
    ],
    challenge:
      "We're a third-generation bodega that went through a soft redesign — specialty products, " +
      "a proper deli counter, café space in the back. But nobody knew the new Bodega Azul yet. " +
      "The Bushwick creative community walks past us every day. We wanted them inside. The challenge " +
      "was scale — we couldn't afford traditional marketing retainers, and free products for 'collaborations' " +
      "had delivered exactly zero verifiable customers.",
    steps: [
      {
        number: "01",
        title: "Community creator program",
        description:
          "Push recruited 6 Bushwick-based creators — artists, food bloggers, local journalists. " +
          "Community credibility over follower count.",
      },
      {
        number: "02",
        title: "Partnership payout model",
        description:
          "Rather than one-time fees, creators earned ongoing per-visit payouts. This incentivized " +
          "continued posting and authentic long-term promotion.",
      },
      {
        number: "03",
        title: "In-store QR placement",
        description:
          "Push QR codes went on the deli counter, café tables, and the window display. " +
          "Any scan — whether prompted by a creator post or organic discovery — counted.",
      },
      {
        number: "04",
        title: "Repeat visit tracking",
        description:
          "Push distinguished new vs. returning visitors. We used that data to refine " +
          "which content types drove loyal customers versus one-time traffic.",
      },
    ],
    chartPoints: [
      { label: "Wk 1", value: 18 },
      { label: "Wk 2", value: 24 },
      { label: "Wk 3", value: 31 },
      { label: "Wk 4", value: 36 },
      { label: "Wk 5", value: 38 },
      { label: "Wk 6", value: 29 },
      { label: "Wk 7", value: 25 },
      { label: "Wk 8", value: 19 },
    ],
    chartLabel: "Weekly foot traffic events",
    pullQuote:
      "These creators aren't influencers — they're our neighbors. Push gave us a way to compensate them fairly and prove the value. Everyone wins.",
    pullQuoteAuthor: "Elena Vasquez",
    pullQuoteRole: "Owner, Bodega Azul",
  },
  {
    slug: "push-pilates-dumbo",
    name: "Push Pilates",
    neighborhood: "DUMBO, Brooklyn",
    category: "Fitness / Pilates",
    tagline: "67 new members — 8 seed creators, zero paid reach.",
    heroImage:
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1200&q=80",
    merchantLogo: "PP",
    primaryOutcome: { value: "67", label: "New Members" },
    outcomes: [
      { value: "67", label: "New Members Acquired" },
      { value: "8", label: "Seed Creators" },
      { value: "$0", label: "Paid Ad Spend" },
    ],
    challenge:
      "DUMBO has every premium fitness concept imaginable. Launching a Pilates studio into that " +
      "market without a brand name or a celebrity instructor felt like a long shot. We had a " +
      "beautiful space, a rigorous method, and no marketing budget. Instagram ads in this " +
      "neighborhood cost $12–18 per click with sub-1% conversion. We needed a better path " +
      "to the exact customer — Brooklyn professional, body-conscious, community-driven.",
    steps: [
      {
        number: "01",
        title: "Seed class program",
        description:
          "8 wellness and lifestyle creators in DUMBO and surrounding neighborhoods " +
          "received complimentary seed class access. No brief, no talking points.",
      },
      {
        number: "02",
        title: "Authentic content capture",
        description:
          "Creators documented their real experience — first reformer session, the " +
          "DUMBO light, post-class coffee. Push tracked every attribution link in their content.",
      },
      {
        number: "03",
        title: "Trial-to-membership conversion",
        description:
          "Push's attribution tied walk-in trial visits back to the originating creator. " +
          "When a trial converted to a membership, the creator earned their payout.",
      },
    ],
    chartPoints: [
      { label: "Wk 1", value: 4 },
      { label: "Wk 2", value: 9 },
      { label: "Wk 3", value: 14 },
      { label: "Wk 4", value: 18 },
      { label: "Wk 5", value: 13 },
      { label: "Wk 6", value: 9 },
    ],
    chartLabel: "New member sign-ups per week",
    pullQuote:
      "We didn't need 100,000 followers. We needed 8 people who genuinely loved Pilates talking to the right 8,000. Push made that math work.",
    pullQuoteAuthor: "Yuki Andrade",
    pullQuoteRole: "Founder, Push Pilates DUMBO",
  },
];

export function getCaseBySlug(slug: string): Case | undefined {
  return CASES.find((c) => c.slug === slug);
}
