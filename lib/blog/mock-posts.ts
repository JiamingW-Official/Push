// Push Notes — mock blog posts (15 articles)
// Topics: NYC commerce, attribution tech, creator economy, local business

export type PostCategory =
  | "Product"
  | "Insights"
  | "Community"
  | "Case Studies"
  | "Engineering";

export interface PostAuthor {
  name: string;
  role: string;
  avatar: string; // initials for placeholder
}

export interface BlogPost {
  slug: string;
  category: PostCategory;
  title: string;
  excerpt: string;
  heroImage: string;
  author: PostAuthor;
  publishedAt: string; // ISO date string
  readMins: number;
  body: string; // markdown-like content
  tags: string[];
}

// Unsplash images — commercial NYC / food / tech themes
const IMAGES = {
  nyc_street:
    "https://images.unsplash.com/photo-1499092346589-b9b6be3e94b2?w=1200&q=80",
  ramen:
    "https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?w=1200&q=80",
  coffee:
    "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=1200&q=80",
  creator_phone:
    "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=1200&q=80",
  brooklyn_bridge:
    "https://images.unsplash.com/photo-1548199569-3e1c6aa8f469?w=1200&q=80",
  data_charts:
    "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&q=80",
  qr_code:
    "https://images.unsplash.com/photo-1619741497423-4e5a87f9d4f5?w=1200&q=80",
  williamsburg:
    "https://images.unsplash.com/photo-1555685812-4b943f1cb0eb?w=1200&q=80",
  restaurant_interior:
    "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200&q=80",
  nyc_food_market:
    "https://images.unsplash.com/photo-1567521464027-f127ff144326?w=1200&q=80",
  mobile_payment:
    "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&q=80",
  small_business:
    "https://images.unsplash.com/photo-1542744094-24638eff58bb?w=1200&q=80",
  harlem:
    "https://images.unsplash.com/photo-1533929736458-ca588d08c8be?w=1200&q=80",
  influencer:
    "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1200&q=80",
  tech_startup:
    "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&q=80",
};

export const MOCK_POSTS: BlogPost[] = [
  {
    slug: "push-v5-marketplace-to-ai-agency",
    category: "Product",
    title: "Push v5.0 — Why we stopped being a marketplace",
    excerpt:
      "We killed the three-tier SaaS pricing. We killed the matching UI. We killed the multi-category launch plan. Here is what we replaced them with, and why.",
    heroImage: IMAGES.coffee,
    author: {
      name: "Jiaming Wang",
      role: "Founder, Push",
      avatar: "JW",
    },
    publishedAt: "2026-04-18",
    readMins: 7,
    tags: ["v5.0", "AI", "agency", "outcome pricing", "Williamsburg", "coffee"],
    body: `## The three changes that ship together

Push v5.0 is the largest reset since we launched. Three things change at once, and they only work as a set:

1. **Pricing shifts from SaaS tiers to outcome-based.** The old $19.99 / $69 / $199 monthly plans are gone for new merchants. The new model: **$0 Pilot** for the first ten merchants in our Williamsburg coffee beachhead (first ten AI-verified customers on us), then **$500 / month minimum + $40 per verified customer**.

2. **AI moves from "matching assist" to the core product.** Claude Sonnet 4.6 now drives creator matching in sixty seconds and verifies every customer through a three-layer check: QR scan + Claude Vision receipt OCR + geo-match within 200 meters. No verification, no charge.

3. **Beachhead collapses to coffee × Williamsburg × sixty days.** Not F&B across five boroughs. Not dessert-and-beauty-and-fitness. One category, one ZIP, one quarter of saturation before we expand.

## Why now

A marketplace for local creators is a defensible business, but it is not the business that YC, investors, or the 2026 creator economy actually rewards. YC's Spring 2026 Request for Startups calls out **AI-Powered Agencies** as its fifth priority. More than 70% of the Winter 2026 batch shipped day-zero AI products. The era of "we'll add AI later" is over.

Push had a choice: defend the marketplace narrative and get judged against Fiverr / Pearpop / Roster, or lean all the way into what our attribution stack already does — operate a creator network, verify every visit, and charge per customer. We chose the second.

## What does not change

We are keeping what the original design got right:

- **The six-tier creator system.** Clay → Obsidian, with material colors, commission scaling, and milestone bonuses. The tier is now how the agent schedules operators; it is not going anywhere.
- **The QR + Two-Tier Offer stack.** Hero and Sustained offers, last-click attribution, creator-specific QR fingerprints.
- **The commission + milestone payout structure.** Creators keep getting paid per verified customer, with tier-based rates and bonuses.
- **Every founding-cohort merchant's contract.** If you joined on Starter, Growth, or Scale before April 18, you stay on that plan. New pricing applies to new signups only.

## What that looks like on Day One

The merchant flow is now goal-first. You do not post a campaign. You tell the agent: *"I need twenty customers. Coffee. Williamsburg. Six hundred dollars."* Sixty seconds later, Claude returns five matched creators, a drafted campaign brief, and an ROI prediction. You approve, the agent schedules the operators, and every scan they drive is triple-checked before you see the bill.

On the creator side, you no longer browse campaigns. The agent reviews your tier, category affinity, and geo coverage, then surfaces campaigns that match. You visit, you post, you get paid when the AI verifies your customer.

## The unit economics

A pilot customer costs Push about $20 – $32 (the creator's base rate plus infrastructure). We absorb that on the first ten to prove the system. Customer eleven flips billing to $40, which gives us a modest but predictable margin. Scale comes from volume, not from markup.

This is the same logic that works for every outcome-based agency, from performance SEO to growth marketing. What is new is that our delivery layer is an AI that verifies in under eight seconds what a human reviewer used to take hours.

## What we learned from the migration

Writing this out was a forcing function. The landing copy, the pricing page, the terms of service, the onboarding flow — all of it was rebuilt around a single sentence: *Tell us how many customers you need. We deliver.* When the copy did not fit, the product usually did not fit either. Outcome pricing exposes everything a SaaS tier can hide.

## What is next

Phase 2 is about depth in Williamsburg coffee. We will publish weekly saturation data, double down on verification accuracy, and keep the agent honest about what it can and cannot predict. If coffee works, Greenpoint and Bushwick are next — still coffee-first, still agent-operated.

If you are a Williamsburg coffee shop, [apply for the pilot](/merchant/pilot). If you are a local creator in the neighborhood, [join the operator network](/creator/signup).

We will see you at the counter.`,
  },
  {
    slug: "qr-attribution-death-of-vanity-metrics",
    category: "Insights",
    title: "QR Attribution and the Death of Vanity Metrics in Local Marketing",
    excerpt:
      "For too long, NYC businesses have paid for impressions that never walked through their door. Here's how transaction-level attribution changes everything.",
    heroImage: IMAGES.qr_code,
    author: {
      name: "Marcus Chen",
      role: "Co-founder & CEO, Push",
      avatar: "MC",
    },
    publishedAt: "2026-04-10",
    readMins: 8,
    tags: ["attribution", "QR codes", "local marketing", "NYC"],
    body: `## The $47 Billion Problem Nobody Talks About

Every year, New York City's 230,000 local businesses collectively spend billions on advertising with one fundamental problem: they have no idea if any of it worked.

A restaurant in the East Village runs an Instagram ad. A boutique gym in Williamsburg pays a micro-influencer $500 to post. A coffee shop in Park Slope prints 2,000 flyers. In each case, the business owner is left staring at a metric — impressions, reach, estimated engagement — that tells them absolutely nothing about whether a single new customer walked through the door.

This is the vanity metric trap, and it's costing local business owners billions of dollars a year.

## What Verified Attribution Actually Means

When we built Push, we started with one constraint: **every dollar spent must trace to a verified physical visit**. Not a click. Not an impression. Not a "potential reach." A real human body, at your location, confirmed by a QR scan.

The mechanism is straightforward. Each creator campaign generates a unique QR code — think of it as a fingerprint for that specific creator-business pairing. When a customer arrives at the location and scans the code, Push logs:

- Timestamp and location (GPS-verified within 15 meters)
- Campaign and creator ID
- Visit count for deduplication

No scan, no payment. The creator only earns when their audience actually shows up.

> "We spent $200 and got 47 verified visits in one week. That's better ROI than any Instagram ad we've ever run." — Maria C., Café Dos Alas, Brooklyn

## The Comparison That Matters

Traditional local advertising costs:

- Instagram/Facebook ads: $15–50 per click, zero visit guarantee
- Influencer posts (unattributed): $200–2,000, no measurable outcome
- Print/flyers: ~$0.08 per unit, conversion rate unmeasurable

With Push, merchants pay a per-visit rate set by themselves — typically $10–40 per verified visit. The math is elementary: if a first-time customer is worth $85 in lifetime value, paying $25 for their verified first visit is a 3.4× return before they've even ordered a second time.

## Why Foot Traffic Is the Signal That Matters

Digital marketing optimizes for proxies — likes, comments, shares, saves. These correlate weakly, at best, with the metric local businesses actually care about: people in the room.

Push collapses the measurement gap. Instead of inferring that a post "probably" drove some traffic, you know — with certainty — that @maya.eats.nyc drove 12 verified visits last Tuesday, and those 12 visits generated $780 in documented revenue.

That's not a metric. That's a fact. And facts are what serious businesses make decisions on.

## What This Means for Your Budget

If you currently spend $500/month on Instagram ads and can't tell whether they're working, consider running a $200 Push pilot alongside them. By the end of the month, you'll have:

1. A verified count of QR-attributed visits
2. Average revenue per attributed visit
3. Creator-level breakdown (who actually drives your best customers)

The comparison will speak for itself.

## The Future of Local Commerce Attribution

We believe QR-based foot traffic attribution will become table stakes for any serious local marketing spend within the next 24 months. The technology exists. The willingness to pay for results over reach is growing. The only question is whether local businesses act early enough to build the creator networks that will define their neighborhood presence.

Push is building that infrastructure, one verified visit at a time.`,
  },

  {
    slug: "williamsburg-restaurant-case-study",
    category: "Case Studies",
    title: "How Ramen & Co. Drove 47 Verified Visits in 7 Days with 3 Creators",
    excerpt:
      "A Williamsburg ramen shop went from zero creator relationships to 47 QR-verified visits in one week. The full breakdown — costs, creators, and conversion data.",
    heroImage: IMAGES.ramen,
    author: {
      name: "Priya Nair",
      role: "Head of Merchant Success, Push",
      avatar: "PN",
    },
    publishedAt: "2026-04-05",
    readMins: 6,
    tags: ["case study", "restaurants", "Williamsburg", "creator matching"],
    body: `## The Setup

Ramen & Co. opened their second Williamsburg location in February 2026. The owners, Jin and Sarah Park, had a problem familiar to any expanding restaurant group: a new location with zero local brand awareness and a limited budget for paid advertising.

Their first location in the East Village had grown primarily through word-of-mouth. But Williamsburg is a different market — younger, more saturated with food options, and heavily influenced by social content.

Jin's target was simple: **50 new customers in the first month, at a cost they could justify against average ticket value of $32**.

## The Push Campaign

On March 28, they launched a Push campaign:

- **Per-visit rate:** $32 (Operator tier eligible)
- **Creator slots:** 3 open positions
- **Campaign duration:** 14 days
- **Target radius:** 2 miles from Bedford Ave location

Within 6 hours, Push's matching algorithm had suggested 7 creators from the local creator pool. Jin reviewed their performance scores and recent content, then approved 3:

| Creator | Score | Recent visits driven | Neighborhood |
|---------|-------|---------------------|-------------|
| @maya.eats.nyc | 94 | 28 | Williamsburg |
| @brooklyn_bites | 87 | 19 | Bushwick |
| @noodlenycofficial | 91 | 22 | Greenpoint |

## What Happened

Each creator received a unique QR code embedded in their campaign brief. They were instructed to visit authentically, create content in their own voice, and include the QR code in their posts.

Results after 7 days:

- @maya.eats.nyc: 23 QR-verified visits, $736 in attributed revenue
- @brooklyn_bites: 14 QR-verified visits, $448 in attributed revenue
- @noodlenycofficial: 10 QR-verified visits, $320 in attributed revenue

**Total: 47 visits, $1,504 attributed revenue, $1,504 in creator payouts ($32 × 47).**

Net ROI: the restaurant paid $1,504 to generate $1,504 in documented first-visit revenue from customers who otherwise would not have discovered the location. The math gets better when you factor in repeat visits — Jin estimates their average customer returns 3.2 times in the first 90 days.

## The Surprise

The unexpected finding wasn't the volume — it was the quality. QR-verified customers spend 23% more than walk-in customers, possibly because the recommendation from a trusted creator primes them to "experience" the meal rather than just eat it.

Jin: *"We had one table of four that came specifically because of maya's video. They spent $185. That's not a click. That's a table."*

## What We Learned

Three insights from this campaign that apply to any restaurant running Push:

**1. Creator-neighborhood match outperforms follower count.** @maya.eats.nyc has 8,200 followers. @noodlenycofficial has 22,000. Maya drove 2.3× more verified visits. Neighborhood familiarity matters more than reach.

**2. Optimal visit window is Tuesday–Thursday.** QR scan rates peak during weekday lunch and early dinner. Creators who post Tuesday morning see the best same-day conversion.

**3. Brief matters.** Campaigns with specific story direction ("show us your favorite off-menu order") outperformed open-ended briefs by 40% in click-through.

## The Numbers

| Metric | Value |
|--------|-------|
| Campaign spend | $1,504 |
| Verified visits | 47 |
| Cost per visit | $32.00 |
| Attributed revenue | $1,504 |
| Average ticket | $32.00 |
| 90-day projected LTV | ~$4,812 |`,
  },

  {
    slug: "creator-economy-nyc-micro-influencers",
    category: "Community",
    title:
      "The NYC Creator Economy Is Not What You Think: Micro-Influence at Street Level",
    excerpt:
      "The most valuable creators in New York City don't have millions of followers. They have 800 highly engaged locals who actually do what they recommend.",
    heroImage: IMAGES.creator_phone,
    author: {
      name: "Dara Okonkwo",
      role: "Community Lead, Push",
      avatar: "DO",
    },
    publishedAt: "2026-03-28",
    readMins: 7,
    tags: ["creator economy", "micro-influencer", "community", "NYC"],
    body: `## The Myth of the Macro Influencer

If you run a restaurant in Crown Heights, you don't need a creator with 500,000 followers. You need one who 3,000 people in Crown Heights trust — and whose recommendations actually result in visits.

This is the distinction Push is built on, and it's one that took the influencer marketing industry a decade too long to understand.

## What Local Trust Actually Looks Like

We analyzed 18 months of creator campaign data across 340 Push campaigns. The signal was unambiguous: **geographic proximity and local identity outperform follower count as a predictor of verified visit conversion by a factor of 4.1×.**

A creator with 2,000 followers who is known as "the Astoria food person" drives 4× more verified foot traffic per post than a creator with 40,000 followers who posts nationally about food.

The reason is intuitive once you see it: local trust is a fundamentally different asset than broadcast reach. When your neighbor who knows every restaurant in Ridgewood tells you a place is worth the walk, you go. When a creator with 200K followers says the same thing from LA, you tap heart and keep scrolling.

## The Neighborhood Tier Model

Push structures its creator network around what we call the **Neighborhood Tier**:

- **Seed creators (0-500 followers):** Hyper-local. Often discovered their passion recently. Conversion rate: low but growing.
- **Explorer creators (500-2,000 followers):** Establishing neighborhood authority. The sweet spot for new business introductions.
- **Operator creators (2,000-8,000 followers):** Trusted neighborhood voice. Strongest verified visit conversion in our data.
- **Proven creators (8,000-25,000 followers):** Local-to-regional reach. Valuable for launches and events.
- **Closer/Partner creators (25,000+):** Regional influence. Best for broader brand moments.

The surprise: Operator tier (2,000–8,000 followers) consistently drives the highest cost-efficiency per verified visit.

## Who These Creators Are

Push has onboarded 847 creators across NYC's five boroughs. A sampling:

- A park ranger who posts about Queens nature spots and neighborhood food
- A teacher in the Bronx who documents local Dominican bakeries
- A barber in Bed-Stuy who has become the go-to voice for neighborhood food and culture
- A nurse in Astoria whose after-shift food content has a 34% verified visit conversion rate

None of these people are "influencers" in the traditional sense. They're trusted locals with documented records of driving real behavior.

## What This Means for Creators

If you're considering joining Push, the message is direct: **your follower count is irrelevant to your ability to earn**. What matters is:

1. The quality of your relationship with your audience
2. Your consistency in showing up and creating
3. Your geographic presence in neighborhoods with active campaigns

A creator with 600 followers who drove 30 verified visits last month earns more than a creator with 60,000 followers who drove two.

This is the performance-based future of the creator economy. Push is where it starts.`,
  },

  {
    slug: "building-push-attribution-stack",
    category: "Engineering",
    title:
      "Building a Real-Time Attribution Stack for NYC's 230,000 Local Businesses",
    excerpt:
      "How Push handles QR scan deduplication, location verification, and real-time payout calculation at scale — the technical architecture behind foot traffic attribution.",
    heroImage: IMAGES.data_charts,
    author: {
      name: "Alex Rivera",
      role: "CTO, Push",
      avatar: "AR",
    },
    publishedAt: "2026-03-20",
    readMins: 10,
    tags: ["engineering", "attribution", "architecture", "QR"],
    body: `## The Problem Is Harder Than It Looks

Attribution sounds simple: creator posts, customer scans QR, push logs visit, creator earns. In practice, building a fraud-resistant, real-time, city-scale attribution system requires solving five distinct hard problems simultaneously.

Here's how we approached them.

## Problem 1: QR Uniqueness Without Predictability

Every creator-campaign pair generates a unique QR code. The naive approach — sequential numeric IDs — creates a fraud vector where bad actors could guess neighboring codes and generate fake visits.

Our solution: each QR token is a HMAC-SHA256 hash of (creator_id, campaign_id, timestamp_bucket, server_secret). The timestamp bucket (4-hour windows) means codes expire naturally. The HMAC signature means they can't be forged without the server secret.

\`\`\`typescript
function generateQRToken(creatorId: string, campaignId: string): string {
  const bucket = Math.floor(Date.now() / (4 * 60 * 60 * 1000));
  const payload = creatorId + ':' + campaignId + ':' + bucket;
  return hmac('sha256', SERVER_SECRET, payload).slice(0, 16).toUpperCase();
}
\`\`\`

## Problem 2: Location Verification

A QR scan from the wrong location doesn't count. We require the scanning device to be within 50 meters of the registered business GPS coordinates.

The implementation uses the Haversine formula for great-circle distance. We accept ±15 meters of GPS error, giving us a 65-meter effective radius — tight enough to confirm presence, generous enough for indoor GPS drift.

Edge cases we handle:
- Multi-story buildings (we verify horizontal distance only, not floor)
- GPS drift in dense urban canyons (we take the median of 3 readings over 10 seconds)
- Spoofed GPS signals (we cross-reference with Wi-Fi network signatures for high-value visits)

## Problem 3: Deduplication

The same customer should not generate multiple payouts by scanning multiple times. Our deduplication window: **one verified visit per (scanner_device_id, campaign_id) per 24-hour period.**

We hash device fingerprints client-side and send only the hash — we never store raw device IDs. The dedup check runs in under 2ms via a Redis TTL key.

## Problem 4: Real-Time Payout Calculation

Creators need to see their earnings update in real-time. Our payout pipeline:

1. QR scan event arrives → SQS queue
2. Verification worker (location + dedup + fraud score) → ~200ms
3. If verified: write to Postgres, publish to payout ledger topic
4. Creator dashboard WebSocket subscription receives event → UI updates

End-to-end latency from scan to creator seeing earnings update: typically under 800ms.

## Problem 5: Fraud Detection

The most interesting problem. We run a lightweight fraud score on every scan:

- **Velocity check:** more than 3 scans from the same business in 2 hours → flagged
- **Device clustering:** multiple different creator QRs scanned from the same device → flagged
- **Geo consistency:** scan location doesn't match creator's stated home area → scored
- **Content correlation:** creator hasn't posted relevant content in past 48 hours → scored

Scores above 0.7 go to manual review. Scores above 0.9 are auto-rejected.

Our current fraud rate: 0.8% of scans. Industry benchmark for QR-based systems: 3–7%. We're proud of this number and it's getting better.

## What's Next

In Q2 2026, we're adding:

- **Receipt correlation:** merchants can optionally upload POS transaction data, letting us match QR-verified visits to actual purchase amounts (not just presence)
- **Creator content verification:** automated CV scan of creator's recent posts to confirm business mention before campaign approval
- **Dynamic QR expiry:** campaign-specific scan windows (e.g., happy hour only)

The attribution layer is Push's core moat. We're building it to be the most defensible piece of infrastructure in local commerce marketing.`,
  },

  {
    slug: "harlem-gym-campaign-breakdown",
    category: "Case Studies",
    title: "Uptown Fitness, Harlem: 31 Verified Gym Visits, $2.1K Revenue",
    excerpt:
      "A Harlem fitness studio used Push to drive trial memberships through creator campaigns. Here's what worked, what didn't, and the one data point that changed their entire marketing strategy.",
    heroImage: IMAGES.harlem,
    author: {
      name: "Priya Nair",
      role: "Head of Merchant Success, Push",
      avatar: "PN",
    },
    publishedAt: "2026-03-15",
    readMins: 5,
    tags: ["case study", "fitness", "Harlem", "trial memberships"],
    body: `## Background

Uptown Fitness opened in Harlem in January 2025. Co-founder David K. had a specific acquisition challenge: gym trial conversion is expensive to test through paid ads, and most fitness influencer content skews toward aspirational aesthetics rather than neighborhood community.

David wanted creators who lived within walking distance of the gym and who would represent it as a neighborhood institution, not a brand partnership.

## Campaign Design

- **Offer:** Free 3-day trial pass for creator's followers, redeemable by QR scan
- **Creator slots:** 4
- **Per-verified-trial rate:** $35
- **Campaign duration:** 21 days

The trial model was deliberate: by making the visit a trial pass rather than a purchase, David lowered the conversion barrier. The QR code redeemed the trial, creating the verification event Push needs.

## Creator Selection

David approved 4 creators from Push's suggested matches, all within 1.5 miles of the gym:

- A personal trainer (7,400 followers) who trains clients in Morningside Park
- A nurse who posts about Harlem fitness culture (3,200 followers)
- A local high school basketball coach (1,800 followers)
- A freelance photographer who documents Black-owned Harlem businesses (5,600 followers)

## Results

Over 21 days:

- **Total QR-verified trial redemptions:** 31
- **Trial-to-membership conversion:** 14 of 31 (45%)
- **Membership revenue (first month):** $2,100 ($150 avg × 14)
- **Creator payouts:** $1,085 ($35 × 31)

Net: $1,015 gross margin from verified trial conversions. Trial-to-member LTV is $150 × projected 11-month retention = $1,650 per conversion.

**Projected 12-month LTV from this campaign: $23,100.**

## The Unexpected Finding

The photographer (5,600 followers) drove zero verified trials.

Not because their content was bad — it was excellent. The reason: their audience was primarily gallery owners, creatives, and visitors from outside Harlem who weren't likely to use a local gym. **High local brand alignment does not equal high local audience.**

This is why follower count and even content quality aren't enough signals. Push's creator matching factors in a creator's historical visit geography — where their verified visits have actually come from — not just their stated neighborhood.

After this campaign, we updated our matching algorithm to weight documented visit geography at 35% of the matching score, up from 20%.`,
  },

  {
    slug: "performance-score-system-explained",
    category: "Product",
    title:
      "How the Push Performance Score Works — And Why It Replaces Follower Count",
    excerpt:
      "A creator with 600 followers can outrank one with 60,000 on Push. Here's the complete breakdown of how performance scores are calculated and why they predict conversion better than any other metric.",
    heroImage: IMAGES.mobile_payment,
    author: {
      name: "Marcus Chen",
      role: "Co-founder & CEO, Push",
      avatar: "MC",
    },
    publishedAt: "2026-03-08",
    readMins: 7,
    tags: ["product", "creator score", "algorithm", "attribution"],
    body: `## The Problem with Follower Count

Every creator platform in existence uses follower count as the primary signal for creator value. This made sense in 2015, when influencer marketing was essentially a broadcast medium. It makes no sense today, when the question is not "how many people might see this?" but "how many people will actually show up?"

Push built an entirely different scoring model, and it's working.

## The Performance Score: Components

A creator's Push Performance Score (0–100) is calculated weekly from three dimensions:

### 1. Verified Visit Rate (50% weight)

The core signal. Of all the times this creator has run a campaign, what percentage resulted in QR-verified visits above the campaign target?

A creator who consistently drives 20+ verified visits per campaign scores highly here regardless of their follower count.

### 2. Content Quality Score (30% weight)

Assessed by Push's content review system, which evaluates:

- **Brand alignment:** Does the content accurately represent the business?
- **Authenticity markers:** Are engagement signals (saves, DMs, shares) consistent with genuine interest vs. passive scroll?
- **Visual and narrative quality:** Does the content tell a story that drives intent to visit?

Quality review is a combination of structured creator self-assessment and periodic Push team spot-checks.

### 3. Consistency Score (20% weight)

Has this creator completed their last N campaigns on schedule? Do they post within the agreed window? Do they respond to campaign briefs promptly?

Consistency is a proxy for professionalism, and professional creators drive better results.

## Score → Tier → Earning Rate

| Score Range | Tier | Per-Campaign Rate |
|-------------|------|-------------------|
| 0–30 | Seed | Free product |
| 31–50 | Explorer | $12 |
| 51–65 | Operator | $20 + 3% |
| 66–80 | Proven | $32 + 5% |
| 81–90 | Closer | $55 + 7% |
| 91–100 | Partner | $100 + 10% |

The tier system creates a compounding incentive: every verified visit improves your score, which improves your tier, which unlocks better campaigns, which makes it easier to drive more verified visits.

## Why This Works Better

In our data, creators with Push scores above 80 drive an average of 2.8 verified visits per campaign day. Creators with 100K+ followers but no Push score drive 0.3 verified visits per campaign day.

The 9.3× performance gap between a high-score Operator tier creator and a raw-follower macro influencer is the core business case for everything Push does.

## Gaming the System

We get this question often. The honest answer: the system is hard to game because it's grounded in physical visits, not digital engagement.

You cannot buy QR scans. You cannot inflate verified visits with bots. The deduplication layer catches repeated scans. The location verification catches remote scans. The content correlation flags creators who claim campaigns they haven't documented.

A high Push score means one thing: your audience actually does what you tell them to.`,
  },

  {
    slug: "brooklyn-food-creator-guide",
    category: "Community",
    title:
      "Field Guide: Becoming a Verified Push Creator in Brooklyn (2026 Edition)",
    excerpt:
      "Everything a Brooklyn-based creator needs to know about joining Push, earning their first campaign payout, and building toward Operator tier in 90 days.",
    heroImage: IMAGES.brooklyn_bridge,
    author: {
      name: "Dara Okonkwo",
      role: "Community Lead, Push",
      avatar: "DO",
    },
    publishedAt: "2026-02-28",
    readMins: 6,
    tags: ["creator guide", "Brooklyn", "getting started", "earnings"],
    body: `## Who This Guide Is For

You live in Brooklyn. You have a social media presence — Instagram, TikTok, or both — and you post about food, fitness, local spots, or neighborhood culture. You've wondered about monetizing your local influence without selling out to national brands that don't represent your neighborhood.

This guide is your roadmap.

## Step 1: Apply and Complete Your Profile

Push creator applications take under 5 minutes. What we ask:

- Your social handles (Instagram required, TikTok optional)
- Your primary neighborhood(s)
- Your content categories (food, fitness, lifestyle, arts, etc.)
- A short bio in your own words

We don't ask about follower count. We don't require a media kit. We don't have a minimum follower threshold.

Your initial tier is Seed. You'll move to Explorer after your first successful campaign.

## Step 2: Your First Campaign

Within 48 hours of approval, you'll receive campaign match notifications for businesses near you. In Brooklyn, we currently have active campaigns from:

- Restaurants in Williamsburg, Bushwick, Park Slope, Carroll Gardens
- Fitness studios in Fort Greene, Cobble Hill, Crown Heights
- Coffee shops in DUMBO, Boerum Hill, Prospect Heights
- Retail in Flatbush, Bay Ridge, Greenpoint

For your first campaign, we recommend: **accept a restaurant campaign within 1 mile of your home**.

Why: proximity means authenticity. Your followers know where you live. A local recommendation lands differently than a "sponsored content" post for a restaurant in another borough.

## Step 3: Execute the Campaign

Your campaign brief will include:
- Business name and address
- Your unique QR code
- Suggested content angles (optional — you can always create in your own voice)
- Visit window (typically 7 days)

Visit the business. Experience it genuinely. Create your content. Include your QR code in a way that feels natural (in the caption, in a story link, or via a bio link for the campaign period).

You earn when someone scans the QR at the location — not when they tap a link.

## Step 4: Building Your Score

After your first campaign, your performance score becomes visible on your creator dashboard. Here's how to improve it:

| Action | Score Impact |
|--------|-------------|
| Campaign completed on time | +3 |
| 10+ verified visits driven | +5 |
| 20+ verified visits driven | +8 |
| Content rated "high quality" | +4 |
| Campaign missed without notice | -8 |

Operators consistently earn between $20–35 per campaign plus 3% commission. At 3–4 campaigns per month, that's $60–140 in monthly baseline earnings before commissions and bonuses.

The Partner tier milestone bonus ($80/month) kicks in at 30 verified transactions per month — achievable for a dedicated Operator-tier creator in a dense Brooklyn neighborhood.

## Neighborhoods With Highest Campaign Density

Based on March 2026 data:

1. Williamsburg / Bushwick (highest campaign volume)
2. Park Slope / Prospect Heights
3. DUMBO / Brooklyn Heights
4. Crown Heights / Flatbush
5. Greenpoint

If you're in one of these areas, expect multiple campaign matches per week once you're established.`,
  },

  {
    slug: "local-commerce-attribution-market-2026",
    category: "Insights",
    title:
      "The $47 Billion Local Advertising Market and the Attribution Gap That No One Has Solved",
    excerpt:
      "Local businesses in the US spend $47 billion annually on advertising. Less than 3% of that spend is attributable to verified physical visits. Push is building the infrastructure to change that.",
    heroImage: IMAGES.small_business,
    author: {
      name: "Marcus Chen",
      role: "Co-founder & CEO, Push",
      avatar: "MC",
    },
    publishedAt: "2026-02-20",
    readMins: 9,
    tags: ["market analysis", "local commerce", "attribution", "industry"],
    body: `## The Scale of the Problem

The United States has 33.2 million small businesses. The subset that are local, brick-and-mortar, consumer-facing establishments — restaurants, gyms, retail stores, salons, cafés — numbers somewhere between 4 and 6 million, depending on classification.

These businesses collectively spend an estimated $47 billion per year on advertising and marketing. And they collectively have no idea if most of it is working.

## How We Got Here

Local advertising attribution has always been hard. The pre-digital era had soft proxies — coupon redemption codes, call tracking numbers, in-store surveys. Digital advertising brought better data for online purchases, but local businesses don't have online purchases. They have foot traffic.

The gap between "a person saw your ad online" and "that person walked into your store" is called the online-to-offline attribution problem. It's been a hot topic in adtech for a decade. The solutions offered — location-based ad targeting, beacon technology, credit card network data — are expensive, privacy-invasive, and require enterprise-level integrations that local businesses cannot afford.

## Why QR Codes Are the Elegant Answer

The QR code resurgence — driven initially by COVID-era contactless menus and payment — created an unexpected infrastructure opportunity. Every major smartphone can now read a QR code natively. The friction to scan has collapsed to near zero.

This changes the attribution equation. Instead of inferring that someone who saw your ad might have visited, you create a direct, frictionless mechanism: **show up and scan, earn your reward or access your experience.** The consumer incentive (a trail, a discount, a freebie) aligns perfectly with the merchant's need for verified presence data.

Push's innovation is applying this mechanism specifically to creator-driven foot traffic, creating a three-party verification that's more fraud-resistant than any binary creator-business arrangement.

## The Market Segments We're Targeting

| Segment | US Count | Avg Monthly Ad Spend | Attribution Rate |
|---------|----------|---------------------|-----------------|
| Independent restaurants | 500,000 | $1,200 | ~2% |
| Fitness studios | 40,000 | $1,800 | ~3% |
| Independent retail | 1,100,000 | $800 | ~1% |
| Cafés and coffee | 35,000 | $600 | ~2% |
| Salons and beauty | 280,000 | $500 | ~1% |

"Attribution rate" here means: the percentage of their ad spend that they can trace to a verified physical visit or purchase.

The numbers are damning. Local businesses are spending money with almost no ability to verify results.

## The NYC Beachhead

We chose to launch in New York City for reasons that go beyond market size. NYC has:

- The highest density of local businesses in any US metro
- A creator ecosystem of 50,000+ local lifestyle content creators
- A consumer population uniquely willing to discover local businesses through social content
- A culture where "I saw it on TikTok" regularly translates to physical queue lines

New York is the ideal proof-of-concept market. If QR-based creator attribution works here, it works everywhere.

## What Success Looks Like

At 1,000 active merchant accounts spending an average of $500/month on Push campaigns, we generate $500K in monthly campaign volume. Creator payouts run at 70% of that; platform margin at 30%.

At 10,000 accounts — still less than 5% of NYC's eligible business base — that's $5M monthly campaign volume. The addressable market within NYC alone supports 100× that scale.

The constraint isn't market size. It's creator network density. A merchant will only launch a Push campaign if we can guarantee matching them with qualified local creators within 48 hours. Network density — creators per square mile — is the operational moat we're building.`,
  },

  {
    slug: "creator-tier-system-v4",
    category: "Product",
    title: "Introducing the 6-Tier Creator System: From Seed to Obsidian",
    excerpt:
      "Push v4.0 launches a completely redesigned creator progression system. Six tiers, unique material identities, and a compounding reward structure that rewards performance over popularity.",
    heroImage: IMAGES.tech_startup,
    author: {
      name: "Alex Rivera",
      role: "CTO, Push",
      avatar: "AR",
    },
    publishedAt: "2026-02-10",
    readMins: 8,
    tags: ["product", "creator tiers", "earnings", "platform update"],
    body: `## Why We Rebuilt the Tier System

Push 3.0 had a 4-tier system: Standard, Advanced, Premium, Elite. It was functional but arbitrary. The names didn't mean anything. The progression felt like a corporate loyalty program, not a professional development ladder.

For v4.0, we started over with a simple question: **what metaphor captures the journey from first campaign to top-of-network creator in a way that feels meaningful?**

The answer was materials.

## Six Materials, Six Tiers

The tier system now uses a material metaphor that maps intuitively to progression:

**Clay (Seed)** — unfired, provisional, full of potential. Where everyone starts.

**Bronze (Explorer)** — first real metallic. You've done real work. You're committed.

**Steel (Operator)** — industrial, reliable, serious. Commission kicks in here. This is where Push starts treating you like a professional.

**Gold (Proven)** — warm, earned. You have a documented track record. Merchants actively request you.

**Ruby (Closer)** — jewel-tier. Rare, vivid, precious. Elite campaigns only.

**Obsidian (Partner)** — volcanic glass, near-black. The pinnacle. Maximum earning rate, exclusive partnership opportunities, monthly milestone bonus.

Each material has a unique color that is **spectrally distinct** from all others — no two tiers share the same hue family. From a UX standpoint, this means any creator at a glance can understand exactly where they stand without reading a label.

## The Earning Structure

| Tier | Base Rate | Commission | Milestone Bonus |
|------|-----------|------------|-----------------|
| Seed (Clay) | Free product | — | — |
| Explorer (Bronze) | $12 | — | — |
| Operator (Steel) | $20 | 3% | $15 at 30 tx/mo |
| Proven (Gold) | $32 | 5% | $30 at 30 tx/mo |
| Closer (Ruby) | $55 | 7% | $55 at 30 tx/mo |
| Partner (Obsidian) | $100 | 10% | $80 at 30 tx/mo |

Commission is calculated on verified transaction value attributed to the creator's QR code in the merchant's POS system (where available).

## The Compounding Mechanic

The system is designed to compound. A Partner-tier creator who drives 30 verified transactions in a month earns:

- Base: $100 × 30 = $3,000
- Commission (10% on avg $35 ticket × 30 tx): $105
- Milestone bonus: $80

**Monthly total: $3,185 from 30 verified visits.**

That's not side-income. That's a profession.

## What's New in v4.0

Beyond the rebrand, v4.0 includes three substantive changes:

**1. Cross-borough campaign eligibility.** Operator-tier and above creators can now accept campaigns outside their home borough, expanding campaign availability.

**2. Milestone bonus reset.** Previously, the milestone bonus reset on the 1st of each calendar month regardless of when it was achieved. Now it runs on a rolling 30-day window, giving creators more flexibility.

**3. Performance score carry.** If a creator takes a break for 30 days or less, their score doesn't decay. Decay only begins after 60 days of inactivity, and recovery is faster (1.5× the normal accumulation rate for the first 30 days back).

## The Obsidian Guarantee

Partner-tier creators (score 91+) receive what we call the Obsidian Guarantee: **if Push can't match you with a qualifying campaign within 72 hours of requesting one, we pay you $50 regardless.**

We've paid this out 7 times since launch. We expect to pay it approximately zero times per month by Q3 2026 as campaign density increases.`,
  },

  {
    slug: "east-village-coffee-shop-pilot",
    category: "Case Studies",
    title:
      "The Roast Room: $4,200 in Attributed Revenue, 128 Verified First Visits",
    excerpt:
      "A third-generation East Village coffee shop ran a 45-day Push pilot. The results changed how they think about every marketing dollar they spend.",
    heroImage: IMAGES.coffee,
    author: {
      name: "Priya Nair",
      role: "Head of Merchant Success, Push",
      avatar: "PN",
    },
    publishedAt: "2026-01-30",
    readMins: 5,
    tags: ["case study", "coffee", "East Village", "pilot program"],
    body: `## The Business

The Roast Room has been serving espresso at its East Village location since 1987. Third-generation owner Emma Vasquez took over in 2020 and has been experimenting with digital marketing ever since.

Emma's frustration was specific: "Every platform tells me I'm reaching people. Nobody can tell me that those people actually came in."

## The Pilot

We worked with Emma to design a 45-day pilot campaign targeting breakfast and lunch traffic. The structure:

- 6 creator slots, rotating monthly
- Per-visit rate: $8 (set lower than typical to test volume)
- Campaign focus: morning ritual content, specialty drinks, neighborhood atmosphere
- Target: neighborhood residents within 0.7 miles

The lower per-visit rate was intentional. Coffee is a repeat-purchase category — a single verified first visit that converts to a loyal morning customer is worth $800+ in annual LTV. Emma was willing to acquire aggressively.

## Results (45 Days)

| Metric | Value |
|--------|-------|
| Total creator payouts | $1,024 |
| QR-verified first visits | 128 |
| Cost per first visit | $8.00 |
| Avg first-visit spend | $12.50 |
| Attributed revenue | $1,600 |
| Est. 12-month LTV per visitor | ~$750 |

The verified first-visit revenue didn't cover creator costs on its own. But the math changes dramatically at the lifetime level: 128 new loyal morning customers × $750 annual spend = **$96,000 in projected annual revenue** from a $1,024 marketing investment.

This is the model Emma had been trying to find for three years.

## What Worked Specifically

Content that drove the highest QR conversion had three consistent elements:

1. **A specific drink or food item** (not general coffee shop content)
2. **A specific time of day** ("my Tuesday morning ritual" outperformed "I love this place")
3. **Creator's personal connection** ("I live two blocks from here and this is my third place")

Generic cafe content — pretty latte art, ambient shots — drove high engagement but low QR conversion. Specific, personal, local content drove visits.

## Emma's Take

*"I've been spending $300/month on Instagram ads for four years. I never knew if anyone came in. Now I know exactly: 128 people came in specifically because of Push. That number was worth more to me than any impression metric I've ever seen."*`,
  },

  {
    slug: "nyc-winter-campaign-playbook",
    category: "Insights",
    title:
      "The NYC Winter Campaign Playbook: How Local Businesses Drive Foot Traffic When It's Cold",
    excerpt:
      "Winter foot traffic drops 22% for the average NYC local business. These are the creator campaign strategies that beat seasonal decline and built loyal customer bases in Q1 2026.",
    heroImage: IMAGES.nyc_street,
    author: {
      name: "Dara Okonkwo",
      role: "Community Lead, Push",
      avatar: "DO",
    },
    publishedAt: "2026-01-22",
    readMins: 7,
    tags: ["seasonal", "winter", "campaign strategy", "foot traffic"],
    body: `## The Winter Problem

NYC January averages 10°F below comfortable outdoor temperatures. The data is consistent: local restaurant foot traffic drops 22–28% between December and February compared to September–October baselines. For neighborhood businesses without delivery operations, this seasonal dip is existential.

The businesses that survive it with healthy margins are the ones that have built loyal customer bases who will travel regardless of weather. Creator campaigns, done right, are one of the most efficient ways to build that loyalty during winter.

## Strategy 1: The Comfort Content Frame

Winter campaigns that performed best framed the business as a refuge, not a destination. The content frame: "I walked 10 blocks in the cold specifically for this."

This frame:
1. Acknowledges the friction of winter travel
2. Positions the business as worth the effort
3. Gives the viewer a story to tell about their own visit

In our data, campaigns using this frame drove 31% higher verified visit rates in January than campaigns using standard food/experience content.

## Strategy 2: Happy Hour Traffic Shifting

Winter foot traffic concentrates in warmer hours: 12–2pm and 5:30–7pm. Campaigns that offered creators a "happy hour exclusive" experience — early access, a special menu item, a behind-the-scenes tour — drove 40% higher conversion for those specific time windows.

Merchants benefit twice: they fill their dead hours, and the creator content that shows a packed happy-hour table signals social proof to future visitors.

## Strategy 3: The Neighborhood Loyalty Campaign

Several merchants ran "neighborhood regulars" campaigns in January — targeting creators who were already customers and could authentically say "I come here twice a week in any weather."

This campaign type performed exceptionally well for:
- Coffee shops (existing loyal morning customers)
- Gyms (winter fitness resolution crowd)
- Wine bars (cozy evening positioning)

Not well for:
- Lunch-only restaurants (evening content drives evening visits)
- Ice cream shops (obvious)

## Campaign Mechanics That Worked in Winter

| Mechanic | Avg Visit Rate | Notes |
|----------|---------------|-------|
| "First-time visitor" QR | 34% | Strongest for acquisition |
| "Regulars get extra" QR | 52% | Best for retention campaigns |
| "Bring a friend" QR | 41% | Friend's QR scan doesn't count — referral tracking only |
| "Happy hour exclusive" QR | 47% | Time-gated, highest urgency |

## Looking at Q1 2026 Data

The merchants who ran active Push campaigns through January and February 2026 saw, on average:

- **14% less seasonal decline** than the NYC baseline
- **$3,200 more in January attributed revenue** than the previous January (non-Push)
- **Higher repeat visit rate** from creator-referred customers (2.8× vs. 1.4× for walk-ins)

The winter playbook isn't magic. It's targeting: the right creator, the right content frame, the right time window. Push's matching system gets merchants most of the way there automatically.`,
  },

  {
    slug: "creator-payment-infrastructure",
    category: "Engineering",
    title:
      "How Push Pays 800+ Creators Weekly Without a Single Invoice or Bank Error",
    excerpt:
      "Building a creator payout system that handles weekly disbursements across 800 accounts, multiple tax situations, and zero late payments required solving problems nobody warned us about.",
    heroImage: IMAGES.mobile_payment,
    author: {
      name: "Alex Rivera",
      role: "CTO, Push",
      avatar: "AR",
    },
    publishedAt: "2026-01-15",
    readMins: 8,
    tags: ["engineering", "payments", "creator economy", "infrastructure"],
    body: `## The Promise We Made

When we launched Push, we made a specific promise to creators: **weekly payouts, no invoicing, no waiting**. This was a differentiator from every other creator platform, where 30-90 day payment cycles are standard.

Making this promise was easy. Keeping it turned out to require solving a dozen infrastructure problems we hadn't anticipated.

## The Payout Stack

We use Stripe Connect for disbursements. Every creator creates a Stripe Connect account during onboarding; Push's platform account holds earned funds until the weekly disbursement run.

The weekly run happens every Wednesday at 2:00am ET:

1. Pull all verified visits from the past 7 days (Monday 00:00 → Sunday 23:59 ET)
2. Calculate earnings: base rate + commission + milestone bonus (if applicable)
3. Apply tax withholding flags (creators who've earned >$600 YTD get a 1099 flag)
4. Queue disbursements via Stripe Transfer API
5. Log all transfers with creator ID, campaign ID, amount, and tax period
6. Notify creators via push notification and email

Median time from disbursement queue to bank account: 2.1 days (Stripe ACH speed).

## The Tax Problem

1099 compliance turned out to be our most complex legal-technical intersection. US tax law requires payout platforms to issue 1099-K or 1099-NEC forms to any independent contractor earning >$600 in a calendar year.

Our approach:
- We collect W-9 information during onboarding for US creators (SSN or EIN)
- We track YTD earnings in a separate ledger
- At $550 YTD, we prompt creators to verify their tax info and acknowledge 1099 expectations
- We generate 1099s via Stripe Tax, delivered digitally and by mail

For non-US creators (we have 23 international creators in beta), we issue W-8BEN acknowledgements and withhold 30% per IRS treaty defaults. This will become more complex as we expand internationally.

## Edge Cases We Solve

**Disputed visits:** Occasionally a creator disputes a verification outcome (scan didn't register, location verification failed). Our dispute window is 72 hours post-campaign close. Disputed amounts are held in escrow pending manual review. Average resolution time: 4 hours.

**Failed bank transfers:** About 0.8% of weekly disbursements fail due to closed accounts, incorrect routing numbers, or bank-side holds. Failed amounts are held for 30 days, with creator notification at days 1, 7, and 30.

**Minimum payout threshold:** We enforce a $15 minimum before disbursement. Creators below threshold accumulate to the next week. This reduces our Stripe fixed-fee overhead (Stripe charges a flat $0.25 per transfer) significantly.

## What We'd Do Differently

The biggest lesson: **build the tax layer before you need it, not after**. We launched without robust 1099 tracking and had to retrofit it in Q3 2025. That retrofit cost two engineering sprints and a nerve-wracking tax season reconciliation.

The second lesson: **over-communicate payment status**. Creators are self-employed. Money anxiety is real. We now send three status notifications per payment cycle: "Your payment is queued," "Your payment is processing," and "Your payment is complete." Churn dropped 12% after we added the third notification.

## The Number That Matters

As of Q1 2026: 847 creators, 100% paid on schedule, 0 unresolved payment disputes. That's the number we're most proud of.`,
  },

  {
    slug: "astoria-food-scene-creator-community",
    category: "Community",
    title: "Inside the Astoria Food Creator Community: How Queens Is Winning",
    excerpt:
      "Astoria has produced some of Push's highest-converting creators. We went deep with the community to understand why Queens' food culture translates so powerfully to verified foot traffic.",
    heroImage: IMAGES.nyc_food_market,
    author: {
      name: "Dara Okonkwo",
      role: "Community Lead, Push",
      avatar: "DO",
    },
    publishedAt: "2026-01-08",
    readMins: 6,
    tags: ["community", "Queens", "Astoria", "food culture", "creators"],
    body: `## Why Astoria?

When we look at Push verified visit data by creator cohort, Astoria consistently outperforms Manhattan and Brooklyn neighborhoods in one metric: **visit conversion rate per post view**.

The average Astoria Push creator drives a QR-verified visit for every 31 unique post views. The NYC average is 1 per 78 views. Astoria creators are 2.5× more efficient at converting content into physical visits.

We wanted to know why.

## The Cultural Factor

Astoria is one of NYC's most culturally dense neighborhoods. A 1-mile radius from Steinway Street contains Greek, Egyptian, Moroccan, Chinese, Brazilian, Mexican, and Dominican restaurants that are legitimate destinations — not local fill. People come from Brooklyn and Manhattan specifically to eat there.

This creates a creator community whose content has built-in destination appeal. When @theastoriate posts about a Greek restaurant, the question for their followers isn't "is this worth a trip?" — it's already assumed yes. The QR scan to claim a deal or free item converts the decision to act.

## The Creators We Talked To

**@theastoriate (6,200 followers):** A nurse who has been posting about Astoria food for 4 years. Push score: 92. Her reasoning for joining Push: "I was already recommending these places. This just means they know when I actually drove someone there."

**@queenseats (3,800 followers):** A food photographer and Queens native. Score: 87. "The thing about QR verification is it made me more honest. I don't take campaigns for places I haven't eaten at. My followers trust me specifically because I'm local."

**@astriagreeklife (1,900 followers):** A first-generation Greek-American who posts about Greek food culture. Score: 79, growing rapidly. Has driven 47 verified visits to Greek-owned restaurants in 90 days — more than any other creator in the neighborhood for that category.

## What Their Content Has in Common

Three patterns appear consistently across high-converting Astoria creators:

**1. Hyperlocal specificity.** Not "great Greek food in Queens." Specifically "the lamb chops at Elias Corner on a Tuesday night when the kitchen is at full tilt."

**2. Personal history.** "I've been coming here for 12 years" outperforms "I tried this recently." Depth of relationship with a place translates to trust.

**3. Community inclusion.** The best content invites the viewer into an existing community: "This is where the Astoria food people go." Viewers want to be part of that community, and the QR scan is the entry ticket.

## What This Means for the Push Network

Astoria's performance suggests the optimal Push market isn't just density of businesses — it's **cultural density of dining identity**. Neighborhoods where food is a meaningful part of community identity produce creators whose recommendations carry more weight.

We're seeing similar patterns emerging in Flushing (Taiwanese and Chinese food culture), Jackson Heights (South Asian and Latin food), and Washington Heights (Dominican food culture).

The creator community that builds around these food cultures is, increasingly, Push's most valuable asset.`,
  },

  {
    slug: "restaurant-owner-attribution-data",
    category: "Insights",
    title:
      "What 340 NYC Restaurant Owners Told Us About Attribution (The Findings Are Bleak)",
    excerpt:
      "We surveyed 340 NYC restaurant owners about their marketing attribution practices. 89% couldn't tell us how many new customers came through social media. Here's what that means for the industry.",
    heroImage: IMAGES.restaurant_interior,
    author: {
      name: "Marcus Chen",
      role: "Co-founder & CEO, Push",
      avatar: "MC",
    },
    publishedAt: "2025-12-20",
    readMins: 8,
    tags: ["research", "restaurant industry", "attribution", "NYC"],
    body: `## The Survey

In October 2025, Push conducted a survey of 340 independently owned NYC restaurants across all five boroughs. Respondents ranged from single-location neighborhood spots to 4-location groups. The survey focused on one specific question: **how do you know which of your marketing activities is driving new customers?**

The findings were striking.

## The Data

**89% of respondents said they could not attribute new customers to specific marketing channels** with any confidence.

The breakdown of self-reported attribution methods:

| Method | % Using | Accuracy Self-Assessment |
|--------|---------|------------------------|
| "Just asking customers" | 73% | "Not reliable" |
| Instagram analytics | 61% | "Tells me reach, not visits" |
| Google Analytics | 48% | "Only useful for website" |
| Yelp metrics | 44% | "Delayed, not real-time" |
| Nothing formal | 31% | N/A |
| QR codes or similar | 11% | "Very useful when used" |

Only 11% were using any form of scan-based attribution — and this includes basic QR codes for menus, which don't actually track attribution.

## The Spending Paradox

The same restaurants spending an average of $820/month on marketing couldn't tell us what was working. The data reveals a paradox: the businesses with the least attribution capability are spending the most on unattributable channels.

Specifically:
- **Instagram/Meta ads:** Average spend $340/month. Attribution rate: 3% (self-reported as "confident" attribution)
- **Influencer posts:** Average spend $280/month. Attribution rate: 1%
- **Google Ads:** Average spend $200/month. Attribution rate: 12% (Google's own conversion tracking, website visits only)

The conclusion is uncomfortable: NYC restaurants are spending $820/month on average and are confident in the attribution of approximately **$50** of it.

## What Owners Said They Wanted

We asked: what would a perfect attribution system look like for you?

The top three responses:

1. **"Know exactly which post or creator drove a customer in"** — 78%
2. **"Real-time, not two weeks later"** — 64%
3. **"No complicated setup or technology"** — 71%

This maps precisely to Push's design: creator-specific QR attribution, real-time dashboards, 24-hour campaign setup.

## The Competitive Implication

If 89% of your target market can't attribute their current marketing spend, you're not competing with existing solutions — you're competing with the status quo of not measuring at all.

This is simultaneously the challenge and the opportunity. The challenge: changing behavior in a category where "we don't really know" is the accepted normal. The opportunity: being the first platform to make "we know exactly" the new normal.

We believe the inflection point is attribution becoming table stakes — a moment driven by merchant conversations like this survey, and by the growing evidence from campaigns like the ones documented in these Push Notes.

## The Path Forward

We're sharing this data not to embarrass the industry, but to make the case for a different approach. Local businesses deserve the same attribution clarity that direct-to-consumer e-commerce has had for a decade.

QR-based verified attribution is not the complete solution. It's the essential first layer. And it's available today.`,
  },

  {
    slug: "push-2026-product-roadmap",
    category: "Product",
    title:
      "Push 2026 Product Roadmap: What's Coming to the Attribution Platform",
    excerpt:
      "Receipt correlation, multi-business campaigns, international creator expansion, and a creator app redesign. Here's everything coming to Push in 2026 and why we're building it.",
    heroImage: IMAGES.williamsburg,
    author: {
      name: "Alex Rivera",
      role: "CTO, Push",
      avatar: "AR",
    },
    publishedAt: "2025-12-10",
    readMins: 7,
    tags: ["product roadmap", "2026", "platform", "creator tools"],
    body: `## Q1 2026: Attribution Layer Deepening

The highest-priority work for Q1 is making our attribution more granular and fraud-resistant.

**Receipt Correlation (Q1)**

The current model verifies presence via QR scan. Receipt correlation will allow merchants who use supported POS systems (Square, Toast, Lightspeed) to upload transaction data, letting Push match QR-verified visits to actual purchase amounts.

This unlocks two things:
1. Commission calculation based on actual transaction value, not estimated ticket
2. A data layer that makes the Push attribution significantly more valuable for merchant decision-making

**Dynamic Campaign Timing (Q1)**

Campaigns will support time-gated QR activation — "valid Tuesday–Thursday, 5–8pm only." This allows merchants to run happy-hour-specific campaigns without worrying about off-peak scan fraud.

## Q2 2026: Creator Experience Redesign

The current creator app is functional but designed for our MVP. Q2 brings a full redesign:

**Creator Dashboard 2.0**
- Real-time performance score visualization
- Campaign match pipeline (see upcoming matches before they open)
- Earnings projection tool (based on your score trajectory)
- Content performance correlation (which posts drove the most scans?)

**In-App Brief Acceptance**
- Campaign briefs readable in-app with swipe accept/decline
- One-tap QR code generation for accepted campaigns
- Integrated content calendar

## Q3 2026: Multi-Business Campaigns and Cross-Promotion

A frequently requested feature: **campaign bundles**, where multiple businesses in the same neighborhood can share a creator campaign.

Example: a creator does a "Williamsburg weekend guide" campaign covering 4 businesses. Each business gets their own QR code. The creator earns per verified scan at each location. Merchants benefit from the halo effect of the editorial coverage.

This requires coordination infrastructure we don't currently have — shared campaign terms, multi-merchant brief approval, split payout logic. It's complex but the creator and merchant demand is clear.

## Q4 2026: International Creator Beta

We have 23 creators outside the US who applied during our open beta. They're paused. Q4 2026 is when we address this.

The initial international expansion will be selected US-adjacent markets: Toronto, London, and potentially Sydney. These markets have similar local commerce density, existing creator communities, and regulatory environments we can navigate without excessive legal overhead.

International payout requires Stripe Connect in those markets (available in Canada and UK), local tax compliance frameworks, and currency conversion with appropriate hedging.

## What We're Not Building

As important as what we are building: **what we're deliberately not building**.

We're not building a social platform. We're not building a content tool. We're not building a discovery layer for consumers. Every one of these is tempting and adjacent, and every one would dilute our focus on the one thing that matters: **making attribution of local creator marketing provably accurate**.

The attribution layer is the moat. Everything else is distraction.`,
  },
];

// Helper function to get a post by slug
export function getPostBySlug(slug: string): BlogPost | undefined {
  return MOCK_POSTS.find((post) => post.slug === slug);
}

// Helper function to get posts by category
export function getPostsByCategory(category: PostCategory): BlogPost[] {
  return MOCK_POSTS.filter((post) => post.category === category);
}

// Helper function to get related posts (same category, different slug)
export function getRelatedPosts(slug: string, count = 3): BlogPost[] {
  const current = getPostBySlug(slug);
  if (!current) return MOCK_POSTS.slice(0, count);

  const sameCategory = MOCK_POSTS.filter(
    (p) => p.category === current.category && p.slug !== slug,
  );
  const others = MOCK_POSTS.filter(
    (p) => p.category !== current.category && p.slug !== slug,
  );

  return [...sameCategory, ...others].slice(0, count);
}

// All categories
export const BLOG_CATEGORIES: PostCategory[] = [
  "Product",
  "Insights",
  "Community",
  "Case Studies",
  "Engineering",
];
