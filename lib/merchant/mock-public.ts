// Push Platform — Merchant Public Page Mock Data
// 20 real NYC merchants across Food / Lifestyle / Fitness / Coffee / Beauty / Retail

export type PublicCampaign = {
  id: string;
  title: string;
  description: string;
  payout: number;
  spots_remaining: number;
  spots_total: number;
  deadline: string;
  category: string;
  tier_required: string;
  image?: string;
};

export type PublicCreator = {
  id: string;
  handle: string;
  avatar_url: string;
  tier: string;
};

export type PublicReview = {
  id: string;
  creator_handle: string;
  avatar_url: string;
  quote: string;
  campaign_title: string;
  date: string;
};

export type BusinessHours = {
  day: string;
  hours: string;
};

export type MerchantPublic = {
  slug: string;
  name: string;
  tagline: string;
  category: string;
  neighborhood: string;
  borough: string;
  story: string;
  hero_image: string;
  logo_url?: string;
  address: string;
  lat: number;
  lng: number;
  phone: string;
  website: string;
  instagram: string;
  hours: BusinessHours[];
  campaigns: PublicCampaign[];
  creators: PublicCreator[];
  stats: {
    total_visits: number;
    avg_visit_value: number;
    creators_onboarded: number;
  };
  reviews: PublicReview[];
  related_slugs: string[];
};

// ---------------------------------------------------------------------------
// Shared avatar seeds (DiceBear)
// ---------------------------------------------------------------------------
const av = (seed: string) =>
  `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}`;

// ---------------------------------------------------------------------------
// 20 NYC Merchant Records
// ---------------------------------------------------------------------------
export const MERCHANTS: MerchantPublic[] = [
  // ── 01 ────────────────────────────────────────────────────────────────────
  {
    slug: "blank-street-coffee-soho",
    name: "Blank Street Coffee",
    tagline: "Specialty coffee. Zero pretension.",
    category: "Coffee",
    neighborhood: "SoHo",
    borough: "Manhattan",
    story:
      "Blank Street started with a single cart in Williamsburg and a simple conviction: great coffee shouldn't require a 15-minute wait or a $9 price tag. The SoHo location opened in 2023 as the brand's flagship sit-down café — a study in warm concrete, forest-green espresso machines, and a menu that rotates with the seasons. Every drink is sourced from a rotating roster of indie roasters, and the team pulls the shots in under 90 seconds by design. In a neighborhood flooded with tourist traps and overpriced pastry cases, Blank Street operates as a neighborhood anchor for the fashion-and-media crowd who need their cortado before 9 AM and don't want small talk with it. Push creators have helped document three seasonal menu launches here, generating an average 4.1× ROI per campaign.",
    hero_image:
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=1400&q=80",
    address: "284 W Broadway, New York, NY 10013",
    lat: 40.7265,
    lng: -74.0044,
    phone: "+1 (212) 555-0101",
    website: "https://blankstreetcoffee.com",
    instagram: "@blankstreetcoffee",
    hours: [
      { day: "Mon – Fri", hours: "7:00 AM – 6:00 PM" },
      { day: "Saturday", hours: "8:00 AM – 6:00 PM" },
      { day: "Sunday", hours: "9:00 AM – 5:00 PM" },
    ],
    campaigns: [
      {
        id: "bsc-c1",
        title: "Free Latte for a 30-Second Reel",
        description:
          "Come in, order any latte, capture the experience from order to first sip. Free product; no cash payout.",
        payout: 0,
        spots_remaining: 8,
        spots_total: 12,
        deadline: "2026-05-15T23:59:00Z",
        category: "Coffee",
        tier_required: "Seed",
        image:
          "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=600&q=75",
      },
      {
        id: "bsc-c2",
        title: "Spring Matcha Launch — Stories + Feed",
        description:
          "Document our new ceremonial matcha line in 3 Instagram Stories + 1 feed post. Honest review encouraged.",
        payout: 32,
        spots_remaining: 3,
        spots_total: 5,
        deadline: "2026-05-10T23:59:00Z",
        category: "Coffee",
        tier_required: "Explorer",
        image:
          "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&q=75",
      },
    ],
    creators: [
      {
        id: "c1",
        handle: "@maya.eats.nyc",
        avatar_url: av("maya"),
        tier: "Operator",
      },
      {
        id: "c2",
        handle: "@coffeewithlena",
        avatar_url: av("lena"),
        tier: "Explorer",
      },
      {
        id: "c3",
        handle: "@morningsoho",
        avatar_url: av("soho"),
        tier: "Seed",
      },
      {
        id: "c4",
        handle: "@danidrinks",
        avatar_url: av("dani"),
        tier: "Proven",
      },
      {
        id: "c5",
        handle: "@thejadecup",
        avatar_url: av("jade"),
        tier: "Explorer",
      },
      {
        id: "c6",
        handle: "@nycpour",
        avatar_url: av("pour"),
        tier: "Operator",
      },
      {
        id: "c7",
        handle: "@brooklynbeans",
        avatar_url: av("beans"),
        tier: "Seed",
      },
      {
        id: "c8",
        handle: "@espressonyc",
        avatar_url: av("espr"),
        tier: "Closer",
      },
      {
        id: "c9",
        handle: "@latteart_lex",
        avatar_url: av("lex"),
        tier: "Explorer",
      },
      { id: "c10", handle: "@sipcity", avatar_url: av("sipc"), tier: "Seed" },
    ],
    stats: { total_visits: 1840, avg_visit_value: 38, creators_onboarded: 47 },
    reviews: [
      {
        id: "r1",
        creator_handle: "@maya.eats.nyc",
        avatar_url: av("maya"),
        quote:
          "The brief was tight, the product was great, and the payout landed in my wallet the same afternoon. This is how brand collabs should feel.",
        campaign_title: "Spring Matcha Launch",
        date: "2026-03-12",
      },
      {
        id: "r2",
        creator_handle: "@danidrinks",
        avatar_url: av("dani"),
        quote:
          "No endless back-and-forth, no approval anxiety. Just show up, make honest content, get paid. Blank Street is my go-to Push merchant.",
        campaign_title: "Free Latte Reel",
        date: "2026-02-28",
      },
      {
        id: "r3",
        creator_handle: "@nycpour",
        avatar_url: av("pour"),
        quote:
          "Three campaigns in and they still feel fresh. The team actually reads the content and gives real feedback.",
        campaign_title: "Winter Menu Reveal",
        date: "2026-01-15",
      },
    ],
    related_slugs: [
      "ramble-coffee-williamsburg",
      "partners-coffee-dumbo",
      "la-colombe-tribeca",
    ],
  },

  // ── 02 ────────────────────────────────────────────────────────────────────
  {
    slug: "superiority-burger-east-village",
    name: "Superiority Burger",
    tagline: "The vegetable burger that converted carnivores.",
    category: "Food",
    neighborhood: "East Village",
    borough: "Manhattan",
    story:
      "Superiority Burger defies every fast-food convention. Brooks Headley — a James Beard Award–winning pastry chef — opened this 12-seat counter in 2015 with a single mission: make the best burger, full stop, and happen to leave the meat out. A decade later the original location has a cult following that spans the globe, and the Avenue A storefront remains defiantly small, defiantly seasonal, and defiantly cash-first for dine-in. The menu rotates by week. Some days there are four items; others there are ten. Every produce component is sourced from farms Headley visits in person. Push creators who come in for campaigns are encouraged to lean into the chaos — the point is authenticity, not polish.",
    hero_image:
      "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=1400&q=80",
    address: "119 Avenue A, New York, NY 10009",
    lat: 40.7255,
    lng: -73.9797,
    phone: "+1 (212) 555-0202",
    website: "https://superiorityburger.com",
    instagram: "@superiorityburger",
    hours: [{ day: "Mon – Sun", hours: "11:30 AM – 10:00 PM" }],
    campaigns: [
      {
        id: "sb-c1",
        title: "Spring Menu Walk-Through — TikTok",
        description:
          "Walk through 3+ new spring items with honest commentary. Friend-recommendation tone. No scripted lines.",
        payout: 35,
        spots_remaining: 3,
        spots_total: 5,
        deadline: "2026-05-22T23:59:00Z",
        category: "Food",
        tier_required: "Explorer",
        image:
          "https://images.unsplash.com/photo-1550317138-10000687a72b?w=600&q=75",
      },
    ],
    creators: [
      {
        id: "c1",
        handle: "@eastvillageeat",
        avatar_url: av("eveat"),
        tier: "Operator",
      },
      {
        id: "c2",
        handle: "@plantbasednyc",
        avatar_url: av("plant"),
        tier: "Proven",
      },
      {
        id: "c3",
        handle: "@nycfoodie_",
        avatar_url: av("nycf"),
        tier: "Explorer",
      },
      {
        id: "c4",
        handle: "@brooklynbites_",
        avatar_url: av("bkbites"),
        tier: "Seed",
      },
      {
        id: "c5",
        handle: "@munchnyc",
        avatar_url: av("munch"),
        tier: "Operator",
      },
      {
        id: "c6",
        handle: "@vegfreak",
        avatar_url: av("vegfr"),
        tier: "Closer",
      },
      {
        id: "c7",
        handle: "@avenueat",
        avatar_url: av("aveat"),
        tier: "Explorer",
      },
      {
        id: "c8",
        handle: "@lowereastbites",
        avatar_url: av("leb"),
        tier: "Seed",
      },
      {
        id: "c9",
        handle: "@greenpatty",
        avatar_url: av("gp"),
        tier: "Explorer",
      },
      {
        id: "c10",
        handle: "@topbun_nyc",
        avatar_url: av("topbun"),
        tier: "Proven",
      },
    ],
    stats: { total_visits: 920, avg_visit_value: 45, creators_onboarded: 28 },
    reviews: [
      {
        id: "r1",
        creator_handle: "@vegfreak",
        avatar_url: av("vegfr"),
        quote:
          "Genuinely the best campaign I've run in two years. No brand guidelines nonsense — they just said 'be real' and it performed.",
        campaign_title: "Spring Menu Walk-Through",
        date: "2026-03-28",
      },
      {
        id: "r2",
        creator_handle: "@plantbasednyc",
        avatar_url: av("plant"),
        quote:
          "Rare to find a merchant that actually trusts creators. My reel hit 40K views and they sent me a thank-you card. An actual card.",
        campaign_title: "Winter Rotation Feature",
        date: "2026-02-10",
      },
      {
        id: "r3",
        creator_handle: "@topbun_nyc",
        avatar_url: av("topbun"),
        quote:
          "The QR flow was seamless and my payout cleared T+1. This is the Push benchmark every merchant should meet.",
        campaign_title: "Grand Opening Relaunch",
        date: "2025-12-05",
      },
    ],
    related_slugs: [
      "the-fat-radish-lower-east-side",
      "miss-favela-williamsburg",
      "oxomoco-greenpoint",
    ],
  },

  // ── 03 ────────────────────────────────────────────────────────────────────
  {
    slug: "modelfit-flatiron",
    name: "Modelfit",
    tagline: "The workout fashion editors actually do.",
    category: "Fitness",
    neighborhood: "Flatiron",
    borough: "Manhattan",
    story:
      "Modelfit isn't marketed as an exclusive studio, but its reputation precedes it. The 45-minute precision barre-meets-resistance-training class drew fashion-week regulars long before Vogue covered it in 2019. The Flatiron flagship, opened in 2022, is the brand's most spacious location — vaulted ceilings, warm oak floors, and a post-class cold-plunge that regulars treat as mandatory. The program is designed to build lean strength without bulk, and the instructors hold genuine anatomy credentials. Push campaign content here skews aspirational but never unattainable: creators document the full experience from locker room to last stretch, giving prospective members an honest preview of class intensity and studio culture.",
    hero_image:
      "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1400&q=80",
    address: "28 W 25th St, New York, NY 10010",
    lat: 40.7449,
    lng: -73.9913,
    phone: "+1 (212) 555-0303",
    website: "https://modelfit.com",
    instagram: "@modelfitstudios",
    hours: [
      { day: "Mon – Fri", hours: "6:00 AM – 8:00 PM" },
      { day: "Sat – Sun", hours: "8:00 AM – 5:00 PM" },
    ],
    campaigns: [
      {
        id: "mf-c1",
        title: "Class Experience Reel — Instagram + TikTok",
        description:
          "Attend a class, document pre/during/post. We want real sweat, real reactions. Complimentary class + $55 payout.",
        payout: 55,
        spots_remaining: 4,
        spots_total: 6,
        deadline: "2026-05-18T23:59:00Z",
        category: "Fitness",
        tier_required: "Operator",
        image:
          "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&q=75",
      },
    ],
    creators: [
      {
        id: "c1",
        handle: "@fitnyc_dana",
        avatar_url: av("dana"),
        tier: "Proven",
      },
      {
        id: "c2",
        handle: "@sweatdiaries",
        avatar_url: av("sweat"),
        tier: "Closer",
      },
      {
        id: "c3",
        handle: "@pilatesnyc",
        avatar_url: av("pilates"),
        tier: "Operator",
      },
      {
        id: "c4",
        handle: "@barrequeen_",
        avatar_url: av("barre"),
        tier: "Explorer",
      },
      {
        id: "c5",
        handle: "@classpasslife",
        avatar_url: av("classp"),
        tier: "Operator",
      },
      { id: "c6", handle: "@runnyc_", avatar_url: av("run"), tier: "Seed" },
      {
        id: "c7",
        handle: "@coldplunge.nyc",
        avatar_url: av("cold"),
        tier: "Proven",
      },
      {
        id: "c8",
        handle: "@liftandlatte",
        avatar_url: av("lift"),
        tier: "Explorer",
      },
      {
        id: "c9",
        handle: "@flatironfit",
        avatar_url: av("flat"),
        tier: "Operator",
      },
      {
        id: "c10",
        handle: "@movement.nyc",
        avatar_url: av("move"),
        tier: "Closer",
      },
    ],
    stats: { total_visits: 1240, avg_visit_value: 72, creators_onboarded: 34 },
    reviews: [
      {
        id: "r1",
        creator_handle: "@sweatdiaries",
        avatar_url: av("sweat"),
        quote:
          "This campaign brief was the clearest I've ever received. They knew exactly what they wanted and gave me total creative freedom within that frame.",
        campaign_title: "Class Experience Reel",
        date: "2026-03-15",
      },
      {
        id: "r2",
        creator_handle: "@movement.nyc",
        avatar_url: av("move"),
        quote:
          "The payout was top of market and the studio is genuinely incredible. My audience trusted the rec because they could tell I actually loved it.",
        campaign_title: "New Year Class Launch",
        date: "2026-01-08",
      },
      {
        id: "r3",
        creator_handle: "@coldplunge.nyc",
        avatar_url: av("cold"),
        quote:
          "Three campaigns, three smooth payouts. The QR verification took 8 seconds. Push is finally making these partnerships feel like actual businesses.",
        campaign_title: "Cold Plunge Feature",
        date: "2025-11-22",
      },
    ],
    related_slugs: ["barry-s-tribeca", "soulcycle-nomad", "y7-studio-chelsea"],
  },

  // ── 04 ────────────────────────────────────────────────────────────────────
  {
    slug: "ramble-coffee-williamsburg",
    name: "Ramble Coffee",
    tagline: "Slow coffee for fast-moving people.",
    category: "Coffee",
    neighborhood: "Williamsburg",
    borough: "Brooklyn",
    story:
      "Ramble opened in 2021 as a single-origin pour-over bar in a converted metalworking studio on Wythe Avenue. The founders — two former roasters from Oslo — wanted to build a café that treated coffee with the same intellectual rigor as natural wine: terroir-forward, process-transparent, and served without distraction. The menu is intentionally short. There is no wi-fi password on the wall, no laptop policy enforcement, but the room's design — 18-foot ceilings, raw steel shelving, and light that moves across the space like a sundial — draws a crowd that arrives to be present. Push campaigns here are among the platform's highest-rated for content quality: creators are given a single page of context, access to the roastery in the back, and six hours to make whatever they feel.",
    hero_image:
      "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=1400&q=80",
    address: "176 Wythe Ave, Brooklyn, NY 11249",
    lat: 40.7189,
    lng: -73.9572,
    phone: "+1 (718) 555-0404",
    website: "https://ramblecoffee.co",
    instagram: "@ramblecoffeenyc",
    hours: [
      { day: "Mon – Fri", hours: "7:30 AM – 5:00 PM" },
      { day: "Sat – Sun", hours: "8:00 AM – 5:30 PM" },
    ],
    campaigns: [
      {
        id: "rc-c1",
        title: "Single Origin Origin Story — Short Doc",
        description:
          "Make a 90-second micro-documentary about one bean, one roaster, one cup. Full roastery access granted.",
        payout: 70,
        spots_remaining: 2,
        spots_total: 3,
        deadline: "2026-05-25T23:59:00Z",
        category: "Coffee",
        tier_required: "Proven",
        image:
          "https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=600&q=75",
      },
    ],
    creators: [
      {
        id: "c1",
        handle: "@slowdrip.nyc",
        avatar_url: av("slowdrip"),
        tier: "Partner",
      },
      {
        id: "c2",
        handle: "@pouroverpeople",
        avatar_url: av("pourover"),
        tier: "Proven",
      },
      {
        id: "c3",
        handle: "@wythewanderer",
        avatar_url: av("wythe"),
        tier: "Operator",
      },
      {
        id: "c4",
        handle: "@bkroast",
        avatar_url: av("bkroast"),
        tier: "Closer",
      },
      {
        id: "c5",
        handle: "@coffeeterroirist",
        avatar_url: av("terr"),
        tier: "Partner",
      },
      {
        id: "c6",
        handle: "@filterbk",
        avatar_url: av("filter"),
        tier: "Proven",
      },
      {
        id: "c7",
        handle: "@morningwilliamsburg",
        avatar_url: av("mornwill"),
        tier: "Explorer",
      },
      {
        id: "c8",
        handle: "@groundsnyc",
        avatar_url: av("grounds"),
        tier: "Operator",
      },
      {
        id: "c9",
        handle: "@cremacrema",
        avatar_url: av("crema"),
        tier: "Explorer",
      },
      {
        id: "c10",
        handle: "@caffeineandfilm",
        avatar_url: av("cafffilm"),
        tier: "Proven",
      },
    ],
    stats: { total_visits: 670, avg_visit_value: 58, creators_onboarded: 22 },
    reviews: [
      {
        id: "r1",
        creator_handle: "@slowdrip.nyc",
        avatar_url: av("slowdrip"),
        quote:
          "Ramble is the brand I tell every creator friend to apply for. They get it. The brief is a mood board, not a checklist.",
        campaign_title: "Single Origin Origin Story",
        date: "2026-03-30",
      },
      {
        id: "r2",
        creator_handle: "@coffeeterroirist",
        avatar_url: av("terr"),
        quote:
          "I spent six hours in their roastery and left with the best footage of my year. The payout is fair but the access is the real value.",
        campaign_title: "Roastery Access Series",
        date: "2026-02-14",
      },
      {
        id: "r3",
        creator_handle: "@bkroast",
        avatar_url: av("bkroast"),
        quote:
          "Push handled the logistics so I didn't have to think about contracts or payment timelines. I just made the video.",
        campaign_title: "Winter Cupping Session",
        date: "2025-12-20",
      },
    ],
    related_slugs: [
      "blank-street-coffee-soho",
      "partners-coffee-dumbo",
      "la-colombe-tribeca",
    ],
  },

  // ── 05 ────────────────────────────────────────────────────────────────────
  {
    slug: "miss-favela-williamsburg",
    name: "Miss Favela",
    tagline: "Brazilian street food meets Brooklyn warehouse.",
    category: "Food",
    neighborhood: "Williamsburg",
    borough: "Brooklyn",
    story:
      "Miss Favela is the kind of place that converts skeptics. The Williamsburg corner space — raw exposed brick, a Rio-mural ceiling, and Brazilian funk playing at a volume that blurs conversation — has been filling its 60 seats every Friday and Saturday since 2018. The kitchen runs on street-food logic: bold, unfussy, abundant. The pão de queijo basket arrives without asking. The caipirinhas are stiff. The feijoada is served in a clay pot that takes 20 minutes to eat properly. Push campaigns here attract lifestyle creators who can handle a chaotic kitchen environment and know that the best content doesn't come from a staged flatlay.",
    hero_image:
      "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1400&q=80",
    address: "57 Broadway, Brooklyn, NY 11249",
    lat: 40.7081,
    lng: -73.964,
    phone: "+1 (718) 555-0505",
    website: "https://missfavela.com",
    instagram: "@missfavelanyc",
    hours: [
      { day: "Tue – Thu", hours: "5:00 PM – 11:00 PM" },
      { day: "Fri – Sat", hours: "5:00 PM – 1:00 AM" },
      { day: "Sunday", hours: "11:00 AM – 9:00 PM" },
    ],
    campaigns: [
      {
        id: "mf-c1",
        title: "Saturday Night Energy Reel",
        description:
          "Capture the Friday/Saturday dinner service energy — music, food, people. 60-second reel, no scripting.",
        payout: 42,
        spots_remaining: 5,
        spots_total: 8,
        deadline: "2026-05-31T23:59:00Z",
        category: "Food",
        tier_required: "Explorer",
        image:
          "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&q=75",
      },
    ],
    creators: [
      {
        id: "c1",
        handle: "@brazilnyc",
        avatar_url: av("brazil"),
        tier: "Operator",
      },
      {
        id: "c2",
        handle: "@brooklynata",
        avatar_url: av("ata"),
        tier: "Explorer",
      },
      {
        id: "c3",
        handle: "@nightlifenyc",
        avatar_url: av("night"),
        tier: "Proven",
      },
      {
        id: "c4",
        handle: "@caipirinhagirl",
        avatar_url: av("caip"),
        tier: "Operator",
      },
      {
        id: "c5",
        handle: "@latinonyc_",
        avatar_url: av("latin"),
        tier: "Explorer",
      },
      {
        id: "c6",
        handle: "@streetfoodnyc",
        avatar_url: av("streetf"),
        tier: "Closer",
      },
      {
        id: "c7",
        handle: "@dinnernyc",
        avatar_url: av("dinnernyc"),
        tier: "Seed",
      },
      {
        id: "c8",
        handle: "@wmburgbites",
        avatar_url: av("wmburb"),
        tier: "Operator",
      },
      {
        id: "c9",
        handle: "@feijoadafan",
        avatar_url: av("feijoada"),
        tier: "Explorer",
      },
      {
        id: "c10",
        handle: "@rioflavors",
        avatar_url: av("rio"),
        tier: "Proven",
      },
    ],
    stats: { total_visits: 1120, avg_visit_value: 52, creators_onboarded: 31 },
    reviews: [
      {
        id: "r1",
        creator_handle: "@nightlifenyc",
        avatar_url: av("night"),
        quote:
          "This was the most fun I've had on a Push campaign. The kitchen let me in at 10 PM and the footage was cinematic by accident.",
        campaign_title: "Saturday Night Energy Reel",
        date: "2026-03-08",
      },
      {
        id: "r2",
        creator_handle: "@streetfoodnyc",
        avatar_url: av("streetf"),
        quote:
          "Four campaigns deep. The payout is fair, the product is exceptional, and the owner actually watches every video submitted.",
        campaign_title: "Brunch Launch Series",
        date: "2026-01-25",
      },
      {
        id: "r3",
        creator_handle: "@rioflavors",
        avatar_url: av("rio"),
        quote:
          "I hesitated because I'm not a 'food creator' — but the brief said 'document energy, not dishes' and that reframing made all the difference.",
        campaign_title: "Street Food Fridays",
        date: "2025-11-15",
      },
    ],
    related_slugs: [
      "superiority-burger-east-village",
      "oxomoco-greenpoint",
      "the-fat-radish-lower-east-side",
    ],
  },

  // ── 06 ────────────────────────────────────────────────────────────────────
  {
    slug: "glossier-flagship-soho",
    name: "Glossier SoHo",
    tagline: "The original millennial-pink destination.",
    category: "Beauty",
    neighborhood: "SoHo",
    borough: "Manhattan",
    story:
      "Glossier SoHo remains one of the most photographed retail interiors in New York. Since the brand reinvented its flagship concept in 2022 — replacing the original bubble-gum palette with a warmer, more editorial aesthetic — the space reads less like a pop-up and more like a permanent institution. The product range is designed for real-skin use: formulations that work with texture, not against it. Push beauty creators who run campaigns here are given a full two-hour session with a brand associate and a generous product allowance. The brief is simple: show how you actually use three products in your real routine. No filters, no reshoot requirements, no approval gatekeeping.",
    hero_image:
      "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=1400&q=80",
    address: "123 Lafayette St, New York, NY 10013",
    lat: 40.7195,
    lng: -73.9996,
    phone: "+1 (212) 555-0606",
    website: "https://glossier.com",
    instagram: "@glossier",
    hours: [
      { day: "Mon – Sat", hours: "10:00 AM – 8:00 PM" },
      { day: "Sunday", hours: "11:00 AM – 7:00 PM" },
    ],
    campaigns: [
      {
        id: "gl-c1",
        title: "Real Routine — 3 Products, No Filter",
        description:
          "Show your real morning routine using 3 Glossier products. $65 product credit + $48 cash payout.",
        payout: 48,
        spots_remaining: 6,
        spots_total: 10,
        deadline: "2026-05-20T23:59:00Z",
        category: "Beauty",
        tier_required: "Operator",
        image:
          "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600&q=75",
      },
    ],
    creators: [
      {
        id: "c1",
        handle: "@getreadywithme.nyc",
        avatar_url: av("grwm"),
        tier: "Proven",
      },
      {
        id: "c2",
        handle: "@beautyeditornyc",
        avatar_url: av("beau"),
        tier: "Closer",
      },
      {
        id: "c3",
        handle: "@skinfirstnyc",
        avatar_url: av("skin"),
        tier: "Operator",
      },
      {
        id: "c4",
        handle: "@glossymornings",
        avatar_url: av("glossy"),
        tier: "Partner",
      },
      {
        id: "c5",
        handle: "@newyorkblush",
        avatar_url: av("blush"),
        tier: "Proven",
      },
      {
        id: "c6",
        handle: "@cleanbeautynyc",
        avatar_url: av("clean"),
        tier: "Operator",
      },
      {
        id: "c7",
        handle: "@dewyskin_",
        avatar_url: av("dewy"),
        tier: "Explorer",
      },
      {
        id: "c8",
        handle: "@facesofsoho",
        avatar_url: av("faces"),
        tier: "Closer",
      },
      {
        id: "c9",
        handle: "@pinkerthanpink",
        avatar_url: av("pink"),
        tier: "Proven",
      },
      {
        id: "c10",
        handle: "@naturaltints",
        avatar_url: av("tints"),
        tier: "Operator",
      },
    ],
    stats: { total_visits: 2100, avg_visit_value: 61, creators_onboarded: 58 },
    reviews: [
      {
        id: "r1",
        creator_handle: "@glossymornings",
        avatar_url: av("glossy"),
        quote:
          "They gave me a two-hour slot, a brand associate who actually knew the formulations, and no list of forbidden words. First campaign in years that felt like collaboration.",
        campaign_title: "Real Routine — No Filter",
        date: "2026-03-22",
      },
      {
        id: "r2",
        creator_handle: "@beautyeditornyc",
        avatar_url: av("beau"),
        quote:
          "The product credit was real and generous. I left with $65 of things I actually use. The content almost wrote itself.",
        campaign_title: "Spring Skincare Drop",
        date: "2026-02-28",
      },
      {
        id: "r3",
        creator_handle: "@facesofsoho",
        avatar_url: av("faces"),
        quote:
          "Push's QR verification system saved me three emails I would have had to write to confirm my visit. It's frictionless in a way I didn't know I needed.",
        campaign_title: "Flagship Shoot Day",
        date: "2026-01-19",
      },
    ],
    related_slugs: [
      "aesop-west-village",
      "bluemercury-upper-east-side",
      "kiehl-s-since-1851-greenwich-village",
    ],
  },

  // ── 07 ────────────────────────────────────────────────────────────────────
  {
    slug: "partners-coffee-dumbo",
    name: "Partners Coffee",
    tagline: "Brooklyn's most exported cup.",
    category: "Coffee",
    neighborhood: "DUMBO",
    borough: "Brooklyn",
    story:
      "Partners was founded in 2012 in a converted loading dock under the Manhattan Bridge overpass with the idea that Brooklynites deserved coffee with the same sourcing transparency as the produce in their CSA boxes. The DUMBO flagship still operates from that original space — the bridge rumbles audibly when trains pass and the locals treat that as ambiance. The roasting program has since expanded to wholesale partnerships with 80+ restaurants across New York, but the café remains the heart of the brand: a 24-seat room with a single espresso machine, a chalkboard rotating origin menu, and zero wi-fi (by design). Push campaigns here often outperform projections because the physical space is as distinctive as the product.",
    hero_image:
      "https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=1400&q=80",
    address: "125 Water St, Brooklyn, NY 11201",
    lat: 40.7031,
    lng: -73.9898,
    phone: "+1 (718) 555-0707",
    website: "https://partnerscoffee.com",
    instagram: "@partnerscoffeeco",
    hours: [
      { day: "Mon – Fri", hours: "7:00 AM – 5:00 PM" },
      { day: "Sat – Sun", hours: "8:00 AM – 5:00 PM" },
    ],
    campaigns: [
      {
        id: "pc-c1",
        title: "Bridge View Morning — Atmospheric Reel",
        description:
          "Capture the early morning DUMBO atmosphere with a Partners cup. Architectural + coffee content. $28 payout.",
        payout: 28,
        spots_remaining: 7,
        spots_total: 10,
        deadline: "2026-05-28T23:59:00Z",
        category: "Coffee",
        tier_required: "Seed",
        image:
          "https://images.unsplash.com/photo-1506619216599-9d16d0903dfd?w=600&q=75",
      },
    ],
    creators: [
      {
        id: "c1",
        handle: "@dumbodiaries",
        avatar_url: av("dumbo"),
        tier: "Operator",
      },
      {
        id: "c2",
        handle: "@bridgeandcup",
        avatar_url: av("bridge"),
        tier: "Explorer",
      },
      {
        id: "c3",
        handle: "@bklynmornings",
        avatar_url: av("bklynm"),
        tier: "Seed",
      },
      {
        id: "c4",
        handle: "@waterstreetnyc",
        avatar_url: av("water"),
        tier: "Proven",
      },
      {
        id: "c5",
        handle: "@manhattanbridgeview",
        avatar_url: av("manbr"),
        tier: "Closer",
      },
      {
        id: "c6",
        handle: "@coffeearchitect",
        avatar_url: av("coffarch"),
        tier: "Operator",
      },
      {
        id: "c7",
        handle: "@dumplingbk",
        avatar_url: av("dumpling"),
        tier: "Seed",
      },
      {
        id: "c8",
        handle: "@goldenhourlatte",
        avatar_url: av("golden"),
        tier: "Explorer",
      },
      {
        id: "c9",
        handle: "@roastmaster_bk",
        avatar_url: av("roast"),
        tier: "Proven",
      },
      {
        id: "c10",
        handle: "@blueprintcoffee",
        avatar_url: av("blueprint"),
        tier: "Operator",
      },
    ],
    stats: { total_visits: 1430, avg_visit_value: 34, creators_onboarded: 41 },
    reviews: [
      {
        id: "r1",
        creator_handle: "@manhattanbridgeview",
        avatar_url: av("manbr"),
        quote:
          "The location does half the creative work for you. I showed up at 7 AM and the light through the bridge was cinematic. The cup was just the prop.",
        campaign_title: "Bridge View Morning",
        date: "2026-03-05",
      },
      {
        id: "r2",
        creator_handle: "@waterstreetnyc",
        avatar_url: av("water"),
        quote:
          "Straightforward campaign, fair payout, and the coffee is legitimately exceptional. No notes.",
        campaign_title: "DUMBO Morning Series",
        date: "2026-02-20",
      },
      {
        id: "r3",
        creator_handle: "@roastmaster_bk",
        avatar_url: av("roast"),
        quote:
          "Three campaigns in three months. Each one slightly more ambitious than the last. This is what a long-term creator relationship looks like.",
        campaign_title: "Wholesale Story Feature",
        date: "2026-01-12",
      },
    ],
    related_slugs: [
      "blank-street-coffee-soho",
      "ramble-coffee-williamsburg",
      "la-colombe-tribeca",
    ],
  },

  // ── 08 ────────────────────────────────────────────────────────────────────
  {
    slug: "oxomoco-greenpoint",
    name: "Oxomoco",
    tagline: "Mexican-inspired, wood-fired, Greenpoint.",
    category: "Food",
    neighborhood: "Greenpoint",
    borough: "Brooklyn",
    story:
      "Oxomoco earned its Michelin star in 2019 and has worn it lightly ever since. The Greenpoint restaurant — named for the Aztec goddess of fire — centers its entire menu around a single wood-fired hearth that dominates the open kitchen. Executive chef Justin Bazdarich draws from Mexican culinary tradition without claiming authenticity: the cooking is an interpretation, an homage, a conversation with technique. The ingredient sourcing is rigorous and seasonal. The tortillas are made fresh every service. The tasting menu rotates quarterly. Push campaigns here are for Proven-tier and above creators only — the brand demands a content quality that matches the culinary one, and the payout reflects that bar.",
    hero_image:
      "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=1400&q=80",
    address: "128 Greenpoint Ave, Brooklyn, NY 11222",
    lat: 40.7299,
    lng: -73.9511,
    phone: "+1 (718) 555-0808",
    website: "https://oxomoco.com",
    instagram: "@oxomoco",
    hours: [{ day: "Wed – Sun", hours: "5:30 PM – 10:30 PM" }],
    campaigns: [
      {
        id: "ox-c1",
        title: "Hearth Dinner — Cinematic Long-Form",
        description:
          "Document a full tasting menu experience. 3-minute mini-doc format preferred. Cinematic color grade encouraged. $110 payout + complimentary dinner for two.",
        payout: 110,
        spots_remaining: 2,
        spots_total: 3,
        deadline: "2026-06-10T23:59:00Z",
        category: "Food",
        tier_required: "Proven",
        image:
          "https://images.unsplash.com/photo-1448043552756-e747b7a2b2b8?w=600&q=75",
      },
    ],
    creators: [
      {
        id: "c1",
        handle: "@michelinchaser",
        avatar_url: av("mich"),
        tier: "Partner",
      },
      {
        id: "c2",
        handle: "@finediningnyc",
        avatar_url: av("fine"),
        tier: "Closer",
      },
      {
        id: "c3",
        handle: "@woodfiredfeed",
        avatar_url: av("woodf"),
        tier: "Proven",
      },
      {
        id: "c4",
        handle: "@greenpointgourmet",
        avatar_url: av("gpg"),
        tier: "Partner",
      },
      {
        id: "c5",
        handle: "@tasteofbk",
        avatar_url: av("taste"),
        tier: "Closer",
      },
      {
        id: "c6",
        handle: "@chefsnight",
        avatar_url: av("chef"),
        tier: "Proven",
      },
      {
        id: "c7",
        handle: "@tasternyc",
        avatar_url: av("taster"),
        tier: "Proven",
      },
      {
        id: "c8",
        handle: "@platingpro",
        avatar_url: av("plating"),
        tier: "Operator",
      },
      {
        id: "c9",
        handle: "@kitchensecrets_",
        avatar_url: av("kitchen"),
        tier: "Partner",
      },
      {
        id: "c10",
        handle: "@starplated",
        avatar_url: av("starp"),
        tier: "Closer",
      },
    ],
    stats: { total_visits: 420, avg_visit_value: 118, creators_onboarded: 14 },
    reviews: [
      {
        id: "r1",
        creator_handle: "@michelinchaser",
        avatar_url: av("mich"),
        quote:
          "Oxomoco is the rare restaurant that understands that good content and good hospitality are the same discipline. I've been to Michelin restaurants that don't get that.",
        campaign_title: "Hearth Dinner",
        date: "2026-03-18",
      },
      {
        id: "r2",
        creator_handle: "@finediningnyc",
        avatar_url: av("fine"),
        quote:
          "The complimentary dinner for two is not a gimmick — it's the actual product they want you to experience and document. Generous and smart.",
        campaign_title: "Tasting Menu Feature",
        date: "2026-02-05",
      },
      {
        id: "r3",
        creator_handle: "@chefsnight",
        avatar_url: av("chef"),
        quote:
          "Most restaurant campaigns give you a burger and expect a short film. Oxomoco gives you a short film and expects exactly that back.",
        campaign_title: "Open Kitchen Series",
        date: "2025-12-12",
      },
    ],
    related_slugs: [
      "superiority-burger-east-village",
      "miss-favela-williamsburg",
      "the-fat-radish-lower-east-side",
    ],
  },

  // ── 09 ────────────────────────────────────────────────────────────────────
  {
    slug: "la-colombe-tribeca",
    name: "La Colombe Tribeca",
    tagline: "Draft latte. Pioneered here.",
    category: "Coffee",
    neighborhood: "Tribeca",
    borough: "Manhattan",
    story:
      "La Colombe invented the draft latte — a nitrogen-charged, cold espresso-and-milk blend served on tap — in this very location in 2016 and it has since become one of the most imitated products in specialty coffee. The Tribeca flagship sits inside a former foundry, its 30-foot ceilings and original brick walls unchanged since the building's industrial past. The café operates a full food program alongside its coffee, making it one of the few spots in lower Manhattan that can do a credible working lunch and a credible 7 AM espresso. Push campaigns here work well for lifestyle and coffee creators who want to position themselves at the intersection of design, craft, and New York culture.",
    hero_image:
      "https://images.unsplash.com/photo-1498804103079-a6351b050096?w=1400&q=80",
    address: "319 Church St, New York, NY 10013",
    lat: 40.7189,
    lng: -74.0044,
    phone: "+1 (212) 555-0909",
    website: "https://lacolombe.com",
    instagram: "@lacolombe",
    hours: [
      { day: "Mon – Fri", hours: "7:00 AM – 6:00 PM" },
      { day: "Sat – Sun", hours: "8:00 AM – 6:00 PM" },
    ],
    campaigns: [
      {
        id: "lc-c1",
        title: "Draft Latte Experience — Instagram Feed",
        description:
          "Show the theatre of the draft latte — the pour, the nitrogen bloom, the first sip. Feed post + 3 Stories. $30 payout.",
        payout: 30,
        spots_remaining: 9,
        spots_total: 12,
        deadline: "2026-05-30T23:59:00Z",
        category: "Coffee",
        tier_required: "Seed",
        image:
          "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=600&q=75",
      },
    ],
    creators: [
      {
        id: "c1",
        handle: "@draftlover",
        avatar_url: av("draft"),
        tier: "Operator",
      },
      {
        id: "c2",
        handle: "@tribecataste",
        avatar_url: av("tribt"),
        tier: "Proven",
      },
      {
        id: "c3",
        handle: "@coldbrewnyc",
        avatar_url: av("coldbr"),
        tier: "Closer",
      },
      {
        id: "c4",
        handle: "@foundrycoffee",
        avatar_url: av("foundry"),
        tier: "Explorer",
      },
      {
        id: "c5",
        handle: "@nitrocup",
        avatar_url: av("nitro"),
        tier: "Operator",
      },
      {
        id: "c6",
        handle: "@lowermanhattancoffee",
        avatar_url: av("lmcoffee"),
        tier: "Seed",
      },
      {
        id: "c7",
        handle: "@brickandlatte",
        avatar_url: av("brick"),
        tier: "Proven",
      },
      {
        id: "c8",
        handle: "@industrycoffee",
        avatar_url: av("ind"),
        tier: "Explorer",
      },
      {
        id: "c9",
        handle: "@lacolombefan",
        avatar_url: av("fan"),
        tier: "Seed",
      },
      {
        id: "c10",
        handle: "@coffeetinker",
        avatar_url: av("tink"),
        tier: "Operator",
      },
    ],
    stats: { total_visits: 2340, avg_visit_value: 41, creators_onboarded: 63 },
    reviews: [
      {
        id: "r1",
        creator_handle: "@coldbrewnyc",
        avatar_url: av("coldbr"),
        quote:
          "The space is practically a content studio. 30-foot ceilings, industrial brick, natural light all morning. The campaign paid $30 and my reel hit 80K.",
        campaign_title: "Draft Latte Experience",
        date: "2026-03-10",
      },
      {
        id: "r2",
        creator_handle: "@brickandlatte",
        avatar_url: av("brick"),
        quote:
          "I've been recommending Push to every creator I know specifically because of campaigns like this. Low barrier, real product, great space.",
        campaign_title: "Morning Foundry Series",
        date: "2026-01-30",
      },
      {
        id: "r3",
        creator_handle: "@nitrocup",
        avatar_url: av("nitro"),
        quote:
          "La Colombe's team left a handwritten note at the table with my name on it. That kind of detail is what makes creators actually feel like partners.",
        campaign_title: "Draft Latte Launch",
        date: "2025-11-08",
      },
    ],
    related_slugs: [
      "blank-street-coffee-soho",
      "ramble-coffee-williamsburg",
      "partners-coffee-dumbo",
    ],
  },

  // ── 10 ────────────────────────────────────────────────────────────────────
  {
    slug: "aesop-west-village",
    name: "Aesop West Village",
    tagline: "Where skincare meets philosophy.",
    category: "Beauty",
    neighborhood: "West Village",
    borough: "Manhattan",
    story:
      "Every Aesop store is designed by a different architect to reflect the neighborhood it inhabits. The West Village location — designed by Snøhetta in 2015 — uses reclaimed wood and locally sourced stone to echo the historic brownstone district outside. The space is deliberately unhurried: no loud branding, no promotional signage, no push to purchase. Staff are trained to ask about your routine before recommending a single product. Push campaigns here attract beauty creators who want to position themselves in the premium-naturalist tier — the brand's minimalist aesthetic and philosophy-forward messaging make it one of the most distinctive collaboration partners on the platform.",
    hero_image:
      "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=1400&q=80",
    address: "232 W 4th St, New York, NY 10014",
    lat: 40.7339,
    lng: -74.0047,
    phone: "+1 (212) 555-1010",
    website: "https://aesop.com",
    instagram: "@aesopskincare",
    hours: [
      { day: "Mon – Sat", hours: "10:00 AM – 7:00 PM" },
      { day: "Sunday", hours: "11:00 AM – 6:00 PM" },
    ],
    campaigns: [
      {
        id: "ae-c1",
        title: "The Ritual — 60-Second Skincare Story",
        description:
          "Document a full Aesop skincare ritual in-store with a brand associate. 60-sec Reel + 3 Stories. $62 payout + $80 product credit.",
        payout: 62,
        spots_remaining: 3,
        spots_total: 5,
        deadline: "2026-05-25T23:59:00Z",
        category: "Beauty",
        tier_required: "Proven",
        image:
          "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&q=75",
      },
    ],
    creators: [
      {
        id: "c1",
        handle: "@aesoplover",
        avatar_url: av("aesop"),
        tier: "Partner",
      },
      {
        id: "c2",
        handle: "@westvillageglow",
        avatar_url: av("wvglow"),
        tier: "Proven",
      },
      {
        id: "c3",
        handle: "@botanicalbeauty",
        avatar_url: av("botan"),
        tier: "Closer",
      },
      {
        id: "c4",
        handle: "@philosophyofskin",
        avatar_url: av("phils"),
        tier: "Partner",
      },
      {
        id: "c5",
        handle: "@luxuryritual",
        avatar_url: av("lux"),
        tier: "Proven",
      },
      {
        id: "c6",
        handle: "@slowbeautynyc",
        avatar_url: av("slowb"),
        tier: "Operator",
      },
      {
        id: "c7",
        handle: "@greenbeautynyc",
        avatar_url: av("greenb"),
        tier: "Proven",
      },
      {
        id: "c8",
        handle: "@ritualistnyc",
        avatar_url: av("ritual"),
        tier: "Closer",
      },
      {
        id: "c9",
        handle: "@westsidebeauty",
        avatar_url: av("westb"),
        tier: "Operator",
      },
      {
        id: "c10",
        handle: "@aestheticskin",
        avatar_url: av("aesth"),
        tier: "Partner",
      },
    ],
    stats: { total_visits: 880, avg_visit_value: 95, creators_onboarded: 26 },
    reviews: [
      {
        id: "r1",
        creator_handle: "@philosophyofskin",
        avatar_url: av("phils"),
        quote:
          "The brief matched the brand perfectly — slow, thoughtful, generous. I came in expecting a 90-minute appointment and stayed for three hours.",
        campaign_title: "The Ritual",
        date: "2026-03-25",
      },
      {
        id: "r2",
        creator_handle: "@aesoplover",
        avatar_url: av("aesop"),
        quote:
          "The $80 product credit is the real perk — but the space itself is the most photogenic interior I've shot in New York. Worth doing for the content alone.",
        campaign_title: "Snøhetta Interior Feature",
        date: "2026-02-12",
      },
      {
        id: "r3",
        creator_handle: "@ritualistnyc",
        avatar_url: av("ritual"),
        quote:
          "Every single Aesop campaign I've done through Push has been verified same-day. Frictionless is the only word.",
        campaign_title: "Winter Ritual Series",
        date: "2025-12-28",
      },
    ],
    related_slugs: [
      "glossier-flagship-soho",
      "bluemercury-upper-east-side",
      "kiehl-s-since-1851-greenwich-village",
    ],
  },

  // ── 11 ────────────────────────────────────────────────────────────────────
  {
    slug: "barry-s-tribeca",
    name: "Barry's Tribeca",
    tagline: "The hardest workout in the world.",
    category: "Fitness",
    neighborhood: "Tribeca",
    borough: "Manhattan",
    story:
      "Barry's Bootcamp built its legend on one simple claim: the hardest 60-minute workout available to civilians. The Tribeca location — red lighting, thunderous bass, and treadmills arranged like a military formation — delivers on that promise with relentless consistency. The instructors are hired for their ability to push clients to the edge without crossing it: motivating without condescending, demanding without alienating. The class format alternates between treadmill intervals and floor resistance work on a cycle designed to maximize caloric expenditure and muscle engagement simultaneously. Push campaigns here attract performance-focused creators who can handle the intensity, document it honestly, and speak to audiences who are curious about whether they could survive it.",
    hero_image:
      "https://images.unsplash.com/photo-1549060279-7e168fcee0c2?w=1400&q=80",
    address: "140 W Broadway, New York, NY 10013",
    lat: 40.7166,
    lng: -74.009,
    phone: "+1 (212) 555-1111",
    website: "https://barrys.com",
    instagram: "@barrys",
    hours: [
      { day: "Mon – Fri", hours: "5:30 AM – 9:00 PM" },
      { day: "Sat – Sun", hours: "7:00 AM – 5:00 PM" },
    ],
    campaigns: [
      {
        id: "ba-c1",
        title: "Survive the Class — Full Experience Reel",
        description:
          "Document your first or return Barry's experience. Pre-class nerves to post-class endorphins. $60 payout + complimentary class.",
        payout: 60,
        spots_remaining: 4,
        spots_total: 6,
        deadline: "2026-05-20T23:59:00Z",
        category: "Fitness",
        tier_required: "Operator",
        image:
          "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&q=75",
      },
    ],
    creators: [
      {
        id: "c1",
        handle: "@fitnesstribeca",
        avatar_url: av("fitnt"),
        tier: "Proven",
      },
      {
        id: "c2",
        handle: "@survivethegym",
        avatar_url: av("surv"),
        tier: "Closer",
      },
      {
        id: "c3",
        handle: "@redlightworkout",
        avatar_url: av("redl"),
        tier: "Operator",
      },
      {
        id: "c4",
        handle: "@barrysaddict",
        avatar_url: av("baddict"),
        tier: "Partner",
      },
      {
        id: "c5",
        handle: "@treadmillnyc",
        avatar_url: av("tread"),
        tier: "Proven",
      },
      {
        id: "c6",
        handle: "@bootcampbk",
        avatar_url: av("boot"),
        tier: "Operator",
      },
      {
        id: "c7",
        handle: "@hiitnyc_",
        avatar_url: av("hiit"),
        tier: "Explorer",
      },
      {
        id: "c8",
        handle: "@sweatsetgo",
        avatar_url: av("sweatg"),
        tier: "Closer",
      },
      {
        id: "c9",
        handle: "@intensitynyc",
        avatar_url: av("inten"),
        tier: "Proven",
      },
      {
        id: "c10",
        handle: "@endurancenyc",
        avatar_url: av("endur"),
        tier: "Operator",
      },
    ],
    stats: { total_visits: 1560, avg_visit_value: 78, creators_onboarded: 43 },
    reviews: [
      {
        id: "r1",
        creator_handle: "@barrysaddict",
        avatar_url: av("baddict"),
        quote:
          "I've done six Barry's campaigns on Push and every single one has performed. The red lighting photographs itself. The energy is unbeatable content.",
        campaign_title: "Survive the Class",
        date: "2026-03-20",
      },
      {
        id: "r2",
        creator_handle: "@survivethegym",
        avatar_url: av("surv"),
        quote:
          "The 'first timer' angle always works. I told the truth — it was brutal and I loved it — and my comment section went wild.",
        campaign_title: "First Timer Experience",
        date: "2026-02-15",
      },
      {
        id: "r3",
        creator_handle: "@sweatsetgo",
        avatar_url: av("sweatg"),
        quote:
          "Fast payout. Real product. Genuine experience worth documenting. This is the template for how fitness campaigns should work.",
        campaign_title: "Morning Bootcamp Series",
        date: "2025-12-08",
      },
    ],
    related_slugs: [
      "modelfit-flatiron",
      "soulcycle-nomad",
      "y7-studio-chelsea",
    ],
  },

  // ── 12 ────────────────────────────────────────────────────────────────────
  {
    slug: "the-fat-radish-lower-east-side",
    name: "The Fat Radish",
    tagline: "British-American cooking. Lower East Side soul.",
    category: "Food",
    neighborhood: "Lower East Side",
    borough: "Manhattan",
    story:
      "The Fat Radish has occupied its narrow LES corner since 2010, resisting the neighborhood's turbulent commercial evolution with the stubborn confidence of a place that knows exactly what it is. The cooking is British in its comfort-forward instincts but American in its ingredient sourcing: heritage proteins, seasonal vegetables from Hudson Valley farms, a wine list that favors natural and biodynamic producers. The room is long and dimly lit, lined with exposed brick and mismatched candlesticks — the kind of interior that photographs beautifully without trying. Push campaigns here attract food and lifestyle creators who want to document a proper sit-down dinner, not a buzzy pop-up.",
    hero_image:
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1400&q=80",
    address: "17 Orchard St, New York, NY 10002",
    lat: 40.7187,
    lng: -73.9897,
    phone: "+1 (212) 555-1212",
    website: "https://thefatradishnyc.com",
    instagram: "@thefatradishnyc",
    hours: [{ day: "Tue – Sun", hours: "6:00 PM – 11:00 PM" }],
    campaigns: [
      {
        id: "fr-c1",
        title: "Proper Dinner — The Full Evening",
        description:
          "Document a dinner from cocktail hour to dessert. Ambient photography + 60-sec Reel. $50 payout + dinner for two.",
        payout: 50,
        spots_remaining: 4,
        spots_total: 6,
        deadline: "2026-06-05T23:59:00Z",
        category: "Food",
        tier_required: "Explorer",
        image:
          "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&q=75",
      },
    ],
    creators: [
      {
        id: "c1",
        handle: "@leslifestyle",
        avatar_url: av("leslife"),
        tier: "Proven",
      },
      {
        id: "c2",
        handle: "@dinnerwithdave",
        avatar_url: av("dave"),
        tier: "Operator",
      },
      {
        id: "c3",
        handle: "@britfoodnyc",
        avatar_url: av("britf"),
        tier: "Explorer",
      },
      {
        id: "c4",
        handle: "@candlelitdinner",
        avatar_url: av("candle"),
        tier: "Proven",
      },
      {
        id: "c5",
        handle: "@lowereasteats",
        avatar_url: av("lee"),
        tier: "Closer",
      },
      {
        id: "c6",
        handle: "@orchardstreet_",
        avatar_url: av("orch"),
        tier: "Operator",
      },
      {
        id: "c7",
        handle: "@farmbowl",
        avatar_url: av("farm"),
        tier: "Explorer",
      },
      {
        id: "c8",
        handle: "@slowdining",
        avatar_url: av("slowd"),
        tier: "Proven",
      },
      {
        id: "c9",
        handle: "@winenightsnyc",
        avatar_url: av("winen"),
        tier: "Operator",
      },
      {
        id: "c10",
        handle: "@naturalwinenyc",
        avatar_url: av("natw"),
        tier: "Closer",
      },
    ],
    stats: { total_visits: 740, avg_visit_value: 68, creators_onboarded: 19 },
    reviews: [
      {
        id: "r1",
        creator_handle: "@lowereasteats",
        avatar_url: av("lee"),
        quote:
          "The candles, the brick, the natural wine — this restaurant was built to be photographed and they finally found the right platform to amplify it.",
        campaign_title: "Proper Dinner Feature",
        date: "2026-03-14",
      },
      {
        id: "r2",
        creator_handle: "@slowdining",
        avatar_url: av("slowd"),
        quote:
          "I stayed for four hours. They never rushed me out. The content was better because of that patience.",
        campaign_title: "LES Dinner Series",
        date: "2026-02-08",
      },
      {
        id: "r3",
        creator_handle: "@naturalwinenyc",
        avatar_url: av("natw"),
        quote:
          "The wine program alone would justify the campaign. That I also got paid $50 and a free dinner is almost absurd generosity.",
        campaign_title: "Natural Wine Night",
        date: "2025-12-18",
      },
    ],
    related_slugs: [
      "superiority-burger-east-village",
      "miss-favela-williamsburg",
      "oxomoco-greenpoint",
    ],
  },

  // ── 13 ────────────────────────────────────────────────────────────────────
  {
    slug: "soulcycle-nomad",
    name: "SoulCycle NoMad",
    tagline: "45 minutes. Every time.",
    category: "Fitness",
    neighborhood: "NoMad",
    borough: "Manhattan",
    story:
      "SoulCycle invented the premium indoor cycling category and continues to define it. The NoMad studio opened in 2021 as the brand's most design-forward location: slate walls, copper accents, and a lighting rig that rivals a concert production. The 45-minute ride combines high-intensity cycling intervals with choreographed upper-body movements, all set to a soundtrack curated exclusively for each instructor. Instructors build loyal followings of their own — regulars often schedule their weeks around specific teachers. Push campaigns here work best for fitness and lifestyle creators who can speak authentically about community, energy, and the specific joy of spending 45 minutes in a room with strangers working at maximum effort.",
    hero_image:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1400&q=80",
    address: "1031 6th Ave, New York, NY 10018",
    lat: 40.7455,
    lng: -73.9877,
    phone: "+1 (212) 555-1313",
    website: "https://soul-cycle.com",
    instagram: "@soulcycle",
    hours: [
      { day: "Mon – Fri", hours: "6:00 AM – 8:30 PM" },
      { day: "Sat – Sun", hours: "7:30 AM – 5:00 PM" },
    ],
    campaigns: [
      {
        id: "sc-c1",
        title: "Ride Recap — Your 45 Minutes",
        description:
          "Document the full SoulCycle experience. Pre-ride, in-studio (approved angles), post-ride glow. $52 payout + complimentary class.",
        payout: 52,
        spots_remaining: 5,
        spots_total: 8,
        deadline: "2026-05-22T23:59:00Z",
        category: "Fitness",
        tier_required: "Explorer",
        image:
          "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=600&q=75",
      },
    ],
    creators: [
      {
        id: "c1",
        handle: "@soulcyclesera",
        avatar_url: av("sera"),
        tier: "Proven",
      },
      {
        id: "c2",
        handle: "@spincitynyc",
        avatar_url: av("spin"),
        tier: "Closer",
      },
      {
        id: "c3",
        handle: "@nomadworkout",
        avatar_url: av("nomadw"),
        tier: "Operator",
      },
      {
        id: "c4",
        handle: "@cyclelove_nyc",
        avatar_url: av("cycle"),
        tier: "Partner",
      },
      {
        id: "c5",
        handle: "@pedalpushnyc",
        avatar_url: av("pedal"),
        tier: "Proven",
      },
      {
        id: "c6",
        handle: "@indoorcycling_",
        avatar_url: av("indoor"),
        tier: "Explorer",
      },
      {
        id: "c7",
        handle: "@riderecap",
        avatar_url: av("ride"),
        tier: "Operator",
      },
      {
        id: "c8",
        handle: "@glowafter",
        avatar_url: av("glow"),
        tier: "Proven",
      },
      {
        id: "c9",
        handle: "@6avenuefitness",
        avatar_url: av("6ave"),
        tier: "Closer",
      },
      {
        id: "c10",
        handle: "@beatdrivenfit",
        avatar_url: av("beat"),
        tier: "Operator",
      },
    ],
    stats: { total_visits: 1890, avg_visit_value: 65, creators_onboarded: 52 },
    reviews: [
      {
        id: "r1",
        creator_handle: "@cyclelove_nyc",
        avatar_url: av("cycle"),
        quote:
          "SoulCycle campaigns always perform. The community is huge, the aesthetic is sharp, and the energy translates on camera in a way most gyms can't fake.",
        campaign_title: "Ride Recap",
        date: "2026-03-22",
      },
      {
        id: "r2",
        creator_handle: "@soulcyclesera",
        avatar_url: av("sera"),
        quote:
          "They approved my angles in advance and the lighting production team gave me a window at the start of class. First campaign where I felt genuinely supported.",
        campaign_title: "NoMad Opening Week",
        date: "2026-02-05",
      },
      {
        id: "r3",
        creator_handle: "@spincitynyc",
        avatar_url: av("spin"),
        quote:
          "I walked in skeptical. I walked out with 60K views and a new 6 AM habit. That's what the best campaigns do.",
        campaign_title: "6 AM Ride Series",
        date: "2025-11-30",
      },
    ],
    related_slugs: [
      "modelfit-flatiron",
      "barry-s-tribeca",
      "y7-studio-chelsea",
    ],
  },

  // ── 14 ────────────────────────────────────────────────────────────────────
  {
    slug: "bluemercury-upper-east-side",
    name: "Bluemercury Upper East Side",
    tagline: "Apothecary skincare since 1999.",
    category: "Beauty",
    neighborhood: "Upper East Side",
    borough: "Manhattan",
    story:
      "Bluemercury occupies a particular niche in the beauty landscape: the intelligent alternative to department store intimidation. Founded by Marla and Barry Beck in 1999, the brand built its reputation on genuine skincare expertise — staff are trained estheticians, not sales associates — and a curated edit of independent and luxury beauty brands that department stores won't carry. The Upper East Side location has served the neighborhood since 2015 and has developed a devoted clientele of professionals and parents who want personalized skincare advice without the pressure of a retail floor. Push campaigns here are ideal for beauty creators who want to position themselves as knowledgeable and thoughtful, not just aspirational.",
    hero_image:
      "https://images.unsplash.com/photo-1576426863848-c21f53c60b19?w=1400&q=80",
    address: "1049 Lexington Ave, New York, NY 10021",
    lat: 40.7717,
    lng: -73.9636,
    phone: "+1 (212) 555-1414",
    website: "https://bluemercury.com",
    instagram: "@bluemercury",
    hours: [
      { day: "Mon – Sat", hours: "10:00 AM – 7:00 PM" },
      { day: "Sunday", hours: "11:00 AM – 6:00 PM" },
    ],
    campaigns: [
      {
        id: "bm-c1",
        title: "The Skin Consult — Expert Skincare Content",
        description:
          "Book a complimentary skin consult and document the process. 60-sec Reel + 2 Stories. $45 payout + $60 product credit.",
        payout: 45,
        spots_remaining: 5,
        spots_total: 8,
        deadline: "2026-05-28T23:59:00Z",
        category: "Beauty",
        tier_required: "Explorer",
        image:
          "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=600&q=75",
      },
    ],
    creators: [
      {
        id: "c1",
        handle: "@lexingtonbeauty",
        avatar_url: av("lexb"),
        tier: "Proven",
      },
      {
        id: "c2",
        handle: "@ueskincare",
        avatar_url: av("uesk"),
        tier: "Operator",
      },
      {
        id: "c3",
        handle: "@expertbeauty",
        avatar_url: av("expb"),
        tier: "Closer",
      },
      {
        id: "c4",
        handle: "@apothecarynyc",
        avatar_url: av("apoth"),
        tier: "Partner",
      },
      {
        id: "c5",
        handle: "@facialritual",
        avatar_url: av("facr"),
        tier: "Proven",
      },
      {
        id: "c6",
        handle: "@luxskinnyc",
        avatar_url: av("luxsk"),
        tier: "Operator",
      },
      {
        id: "c7",
        handle: "@esthethicsnyc",
        avatar_url: av("esthe"),
        tier: "Proven",
      },
      {
        id: "c8",
        handle: "@skineditornyc",
        avatar_url: av("skined"),
        tier: "Closer",
      },
      {
        id: "c9",
        handle: "@nycglow_",
        avatar_url: av("nycgl"),
        tier: "Explorer",
      },
      {
        id: "c10",
        handle: "@beautyiq_nyc",
        avatar_url: av("beautiq"),
        tier: "Operator",
      },
    ],
    stats: { total_visits: 960, avg_visit_value: 82, creators_onboarded: 29 },
    reviews: [
      {
        id: "r1",
        creator_handle: "@apothecarynyc",
        avatar_url: av("apoth"),
        quote:
          "The staff consultation alone was worth the trip. I came for a campaign and left with a completely revised skincare routine. That kind of depth is rare.",
        campaign_title: "Skin Consult Feature",
        date: "2026-03-28",
      },
      {
        id: "r2",
        creator_handle: "@expertbeauty",
        avatar_url: av("expb"),
        quote:
          "My audience is educated about skincare. Bluemercury's depth of expertise matched that. The campaign practically wrote itself.",
        campaign_title: "Expert Edit Series",
        date: "2026-02-18",
      },
      {
        id: "r3",
        creator_handle: "@skineditornyc",
        avatar_url: av("skined"),
        quote:
          "Push's QR system logged my visit before I'd finished my consult. That's the kind of friction-free experience that makes me keep coming back.",
        campaign_title: "Winter Skin Rescue",
        date: "2026-01-05",
      },
    ],
    related_slugs: [
      "aesop-west-village",
      "glossier-flagship-soho",
      "kiehl-s-since-1851-greenwich-village",
    ],
  },

  // ── 15 ────────────────────────────────────────────────────────────────────
  {
    slug: "story-chelsea",
    name: "Story Chelsea",
    tagline: "Retail as editorial. The concept store reinvented.",
    category: "Lifestyle",
    neighborhood: "Chelsea",
    borough: "Manhattan",
    story:
      "Story operates on a magazine's logic: it has a point of view, a theme, and a rotation. Every four to eight weeks the entire store — inventory, fixtures, visual merchandising — resets around a new concept. One month it's all about sleep. Next month it's tools for creativity. The Chelsea location, covering 2,000 square feet on 10th Avenue, is the flagship for this constantly evolving approach to retail. Curators work with emerging designers, heritage brands, and direct-to-consumer labels to build an inventory that's always surprising and always specific. Push campaigns here are calendar-dependent — creators apply to document the current theme — making the content inherently timely and inherently exclusive.",
    hero_image:
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1400&q=80",
    address: "144 10th Ave, New York, NY 10011",
    lat: 40.7448,
    lng: -74.0051,
    phone: "+1 (212) 555-1515",
    website: "https://thisisstory.com",
    instagram: "@thisisstory",
    hours: [
      { day: "Mon – Sat", hours: "10:00 AM – 8:00 PM" },
      { day: "Sunday", hours: "11:00 AM – 7:00 PM" },
    ],
    campaigns: [
      {
        id: "st-c1",
        title: "The Creativity Issue — Current Theme Tour",
        description:
          "Document the current 'Creativity' store theme. Show how the space, objects, and curation tell a unified story. $40 payout + $50 store credit.",
        payout: 40,
        spots_remaining: 6,
        spots_total: 8,
        deadline: "2026-05-15T23:59:00Z",
        category: "Lifestyle",
        tier_required: "Explorer",
        image:
          "https://images.unsplash.com/photo-1581067721837-6a7dfb734fa2?w=600&q=75",
      },
    ],
    creators: [
      {
        id: "c1",
        handle: "@chelseaedits",
        avatar_url: av("chels"),
        tier: "Proven",
      },
      {
        id: "c2",
        handle: "@conceptstorenyc",
        avatar_url: av("concept"),
        tier: "Closer",
      },
      {
        id: "c3",
        handle: "@retailtherapy_nyc",
        avatar_url: av("retail"),
        tier: "Operator",
      },
      {
        id: "c4",
        handle: "@lifestylecurator",
        avatar_url: av("lifec"),
        tier: "Partner",
      },
      {
        id: "c5",
        handle: "@objectslover",
        avatar_url: av("object"),
        tier: "Proven",
      },
      {
        id: "c6",
        handle: "@storyofmy_nyc",
        avatar_url: av("story"),
        tier: "Operator",
      },
      {
        id: "c7",
        handle: "@10thavenuelife",
        avatar_url: av("10th"),
        tier: "Explorer",
      },
      {
        id: "c8",
        handle: "@designobsessed",
        avatar_url: av("design"),
        tier: "Closer",
      },
      {
        id: "c9",
        handle: "@galleryshopper",
        avatar_url: av("galls"),
        tier: "Proven",
      },
      {
        id: "c10",
        handle: "@theconceptedit",
        avatar_url: av("concedit"),
        tier: "Partner",
      },
    ],
    stats: { total_visits: 1150, avg_visit_value: 55, creators_onboarded: 36 },
    reviews: [
      {
        id: "r1",
        creator_handle: "@lifestylecurator",
        avatar_url: av("lifec"),
        quote:
          "I've done campaigns in clothing stores, food markets, galleries. Story is the first retail space that made me think about what retail can actually mean.",
        campaign_title: "Creativity Issue Tour",
        date: "2026-03-18",
      },
      {
        id: "r2",
        creator_handle: "@conceptstorenyc",
        avatar_url: av("concept"),
        quote:
          "The rotating theme model means the content never gets stale. I've been back four times and each campaign was genuinely different.",
        campaign_title: "Sleep Issue Feature",
        date: "2026-02-10",
      },
      {
        id: "r3",
        creator_handle: "@theconceptedit",
        avatar_url: av("concedit"),
        quote:
          "This is the campaign I use to explain Push to people. Timely, specific, well-paid, and genuinely interesting to make.",
        campaign_title: "Design Issue Walk-Through",
        date: "2025-12-15",
      },
    ],
    related_slugs: [
      "reformation-nolita",
      "aimé-leon-dore-nolita",
      "madewell-soho",
    ],
  },

  // ── 16 ────────────────────────────────────────────────────────────────────
  {
    slug: "y7-studio-chelsea",
    name: "Y7 Studio Chelsea",
    tagline: "Hip-hop yoga. No mirrors. No judgment.",
    category: "Fitness",
    neighborhood: "Chelsea",
    borough: "Manhattan",
    story:
      "Y7 built a yoga studio brand by rejecting every assumption about what yoga studios look like. No mirrors. No windows. No instructors who whisper. The Chelsea location — industrial ceiling, candlelit perimeter, hip-hop curated by a DJ not an algorithm — is the brand's most immersive space. Classes run at a vigorous vinyasa pace set entirely to the music, with instructors who are more choreographers than teachers. The clientele skews 25–38, fashion-adjacent, and chronically skeptical of wellness brands — which is exactly why Y7's anti-brand positioning works. Push campaigns here attract lifestyle, fitness, and culture creators who want to document something genuinely different and can handle a physical practice.",
    hero_image:
      "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=1400&q=80",
    address: "254 W 25th St, New York, NY 10001",
    lat: 40.7462,
    lng: -74.0003,
    phone: "+1 (212) 555-1616",
    website: "https://y7-studio.com",
    instagram: "@y7studio",
    hours: [
      { day: "Mon – Fri", hours: "6:30 AM – 8:00 PM" },
      { day: "Sat – Sun", hours: "9:00 AM – 5:00 PM" },
    ],
    campaigns: [
      {
        id: "y7-c1",
        title: "Candlelit Class — The Y7 Experience",
        description:
          "Document the full Y7 experience. Emphasis on the atmosphere, music, and energy — not just the yoga. $50 payout + complimentary class.",
        payout: 50,
        spots_remaining: 4,
        spots_total: 6,
        deadline: "2026-05-18T23:59:00Z",
        category: "Fitness",
        tier_required: "Explorer",
        image:
          "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=600&q=75",
      },
    ],
    creators: [
      {
        id: "c1",
        handle: "@hipyoga",
        avatar_url: av("hipyoga"),
        tier: "Proven",
      },
      {
        id: "c2",
        handle: "@yogabutmake_it_nyc",
        avatar_url: av("yogabutnyc"),
        tier: "Closer",
      },
      {
        id: "c3",
        handle: "@candlelitnyc",
        avatar_url: av("candlen"),
        tier: "Operator",
      },
      {
        id: "c4",
        handle: "@chelseastudio",
        avatar_url: av("chstudio"),
        tier: "Partner",
      },
      {
        id: "c5",
        handle: "@vibeandvinyasa",
        avatar_url: av("vibe"),
        tier: "Proven",
      },
      {
        id: "c6",
        handle: "@hiphopyogalife",
        avatar_url: av("hhyoga"),
        tier: "Operator",
      },
      {
        id: "c7",
        handle: "@noflowerjust_sweat",
        avatar_url: av("noflo"),
        tier: "Explorer",
      },
      {
        id: "c8",
        handle: "@streetstyle_stretch",
        avatar_url: av("stretch"),
        tier: "Proven",
      },
      {
        id: "c9",
        handle: "@flow.nyc",
        avatar_url: av("flownyc"),
        tier: "Closer",
      },
      {
        id: "c10",
        handle: "@darkroomyoga",
        avatar_url: av("darkr"),
        tier: "Operator",
      },
    ],
    stats: { total_visits: 1050, avg_visit_value: 58, creators_onboarded: 32 },
    reviews: [
      {
        id: "r1",
        creator_handle: "@chelseastudio",
        avatar_url: av("chstudio"),
        quote:
          "The brief said 'document the atmosphere, not just the yoga' and that instruction unlocked my best fitness content to date. Candles + hip-hop + Vinyasa is a genuinely great visual story.",
        campaign_title: "Candlelit Class Feature",
        date: "2026-03-15",
      },
      {
        id: "r2",
        creator_handle: "@hipyoga",
        avatar_url: av("hipyoga"),
        quote:
          "Y7 is the anti-wellness-brand wellness brand. My audience loved it precisely because it looked nothing like other yoga content.",
        campaign_title: "No-Mirror Yoga Series",
        date: "2026-02-22",
      },
      {
        id: "r3",
        creator_handle: "@vibeandvinyasa",
        avatar_url: av("vibe"),
        quote:
          "Three Y7 campaigns. Each one different music, different atmosphere, different instructor energy. The payout is fair and the content is always good.",
        campaign_title: "Sound Series: R&B Edition",
        date: "2025-12-10",
      },
    ],
    related_slugs: ["modelfit-flatiron", "barry-s-tribeca", "soulcycle-nomad"],
  },

  // ── 17 ────────────────────────────────────────────────────────────────────
  {
    slug: "reformation-nolita",
    name: "Réformation NoLIta",
    tagline: "Sustainable. Sexy. Sold out.",
    category: "Retail",
    neighborhood: "NoLIta",
    borough: "Manhattan",
    story:
      "Réformation built its brand on an almost paradoxical premise: that the most ethical choice and the most stylish choice can be the same thing. The NoLIta flagship — marble floors, eucalyptus fragrance, and a wardrobe edited down to 40 pieces per season — operates as a proof-of-concept for that idea. Every garment in the store comes with a sustainability rating. The supply chain is disclosed. The carbon footprint of each item is published. And the clothes are, objectively, beautiful. Push campaigns here attract fashion and lifestyle creators who have built a following around conscious consumption and don't need to pretend they've discovered something — they can recommend Réformation from genuine conviction.",
    hero_image:
      "https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=1400&q=80",
    address: "323 Lafayette St, New York, NY 10012",
    lat: 40.7245,
    lng: -73.9966,
    phone: "+1 (212) 555-1717",
    website: "https://thereformation.com",
    instagram: "@reformation",
    hours: [
      { day: "Mon – Sat", hours: "10:00 AM – 8:00 PM" },
      { day: "Sunday", hours: "11:00 AM – 7:00 PM" },
    ],
    campaigns: [
      {
        id: "ref-c1",
        title: "Spring Edit Try-On — 3 Looks",
        description:
          "Try 3 pieces from the spring collection and show how you'd actually style them. Honest fit notes encouraged. $55 payout + $100 store credit.",
        payout: 55,
        spots_remaining: 4,
        spots_total: 6,
        deadline: "2026-05-20T23:59:00Z",
        category: "Retail",
        tier_required: "Operator",
        image:
          "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&q=75",
      },
    ],
    creators: [
      {
        id: "c1",
        handle: "@nolitafit",
        avatar_url: av("nolita"),
        tier: "Proven",
      },
      {
        id: "c2",
        handle: "@sustainablestyle_nyc",
        avatar_url: av("sustyle"),
        tier: "Closer",
      },
      {
        id: "c3",
        handle: "@refaddict",
        avatar_url: av("refadd"),
        tier: "Partner",
      },
      {
        id: "c4",
        handle: "@consciousfashion",
        avatar_url: av("consf"),
        tier: "Partner",
      },
      {
        id: "c5",
        handle: "@slowfashionnyc",
        avatar_url: av("slowf"),
        tier: "Proven",
      },
      {
        id: "c6",
        handle: "@lafayettelooks",
        avatar_url: av("lafay"),
        tier: "Operator",
      },
      {
        id: "c7",
        handle: "@ethicaleditor_",
        avatar_url: av("ethedit"),
        tier: "Closer",
      },
      {
        id: "c8",
        handle: "@greenwrdrobe",
        avatar_url: av("greenw"),
        tier: "Proven",
      },
      {
        id: "c9",
        handle: "@marblefloorfits",
        avatar_url: av("marble"),
        tier: "Operator",
      },
      {
        id: "c10",
        handle: "@sustainlooks",
        avatar_url: av("sustlook"),
        tier: "Operator",
      },
    ],
    stats: { total_visits: 1380, avg_visit_value: 72, creators_onboarded: 40 },
    reviews: [
      {
        id: "r1",
        creator_handle: "@refaddict",
        avatar_url: av("refadd"),
        quote:
          "I've bought from Réformation for five years. Getting paid to talk about them on camera feels almost like cheating. The audience trusted the content immediately.",
        campaign_title: "Spring Edit Try-On",
        date: "2026-03-25",
      },
      {
        id: "r2",
        creator_handle: "@sustainablestyle_nyc",
        avatar_url: av("sustyle"),
        quote:
          "The $100 store credit is generous enough to actually change what you'd buy. I left with a dress I wouldn't have tried otherwise and it became my most-asked-about piece.",
        campaign_title: "Conscious Closet Series",
        date: "2026-02-18",
      },
      {
        id: "r3",
        creator_handle: "@consciousfashion",
        avatar_url: av("consf"),
        quote:
          "Finally a fashion campaign that doesn't ask me to pretend something is perfect. The 'honest fit notes' line in the brief made me trust the whole process.",
        campaign_title: "Holiday Edit Try-On",
        date: "2025-12-01",
      },
    ],
    related_slugs: ["aimé-leon-dore-nolita", "story-chelsea", "madewell-soho"],
  },

  // ── 18 ────────────────────────────────────────────────────────────────────
  {
    slug: "aimé-leon-dore-nolita",
    name: "Aimé Leon Dore",
    tagline: "Queens-born. Global obsession.",
    category: "Retail",
    neighborhood: "NoLIta",
    borough: "Manhattan",
    story:
      "Aimé Leon Dore is one of the few New York fashion brands with a genuine story rooted in place — specifically in Flushing, Queens, where founder Teddy Santis grew up navigating the specific cultural intersections of Greek-American family life and hip-hop street culture. The NoLIta flagship, opened in 2019, is designed to feel like a neighborhood clubhouse for people who care deeply about clothes without caring what that says about them. The café inside the store — serving espresso and a rotating small menu — functions as a third space that draws regulars who don't always buy anything. Push campaigns here are among the platform's most competitive: the waitlist for approved creators is long, and the brand exercises approval rights on all content.",
    hero_image:
      "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1400&q=80",
    address: "245 Mulberry St, New York, NY 10012",
    lat: 40.7218,
    lng: -73.9951,
    phone: "+1 (212) 555-1818",
    website: "https://aimeeleondore.com",
    instagram: "@aimeeleondore",
    hours: [
      { day: "Mon – Sat", hours: "11:00 AM – 7:00 PM" },
      { day: "Sunday", hours: "12:00 PM – 6:00 PM" },
    ],
    campaigns: [
      {
        id: "ald-c1",
        title: "The Clubhouse Tour — Full ALD Experience",
        description:
          "Document the store, the café, and the culture. Cinematic style encouraged. No staged product shots — capture how you actually spend time here. $80 payout.",
        payout: 80,
        spots_remaining: 2,
        spots_total: 3,
        deadline: "2026-06-01T23:59:00Z",
        category: "Retail",
        tier_required: "Proven",
        image:
          "https://images.unsplash.com/photo-1581067721837-6a7dfb734fa2?w=600&q=75",
      },
    ],
    creators: [
      {
        id: "c1",
        handle: "@nycmenswear",
        avatar_url: av("nycmen"),
        tier: "Partner",
      },
      {
        id: "c2",
        handle: "@aldwatcher",
        avatar_url: av("aldw"),
        tier: "Partner",
      },
      {
        id: "c3",
        handle: "@mulberryst_nyc",
        avatar_url: av("mulb"),
        tier: "Closer",
      },
      {
        id: "c4",
        handle: "@streetwearnyc",
        avatar_url: av("streetw"),
        tier: "Proven",
      },
      {
        id: "c5",
        handle: "@queensbornstyle",
        avatar_url: av("queens"),
        tier: "Partner",
      },
      {
        id: "c6",
        handle: "@cafeandfits",
        avatar_url: av("cafef"),
        tier: "Proven",
      },
      {
        id: "c7",
        handle: "@nycfashionist",
        avatar_url: av("nycfash"),
        tier: "Closer",
      },
      {
        id: "c8",
        handle: "@teddbk",
        avatar_url: av("teddbk"),
        tier: "Operator",
      },
      {
        id: "c9",
        handle: "@noliita_looks",
        avatar_url: av("noliita"),
        tier: "Proven",
      },
      {
        id: "c10",
        handle: "@cultfitsnyc",
        avatar_url: av("cultf"),
        tier: "Partner",
      },
    ],
    stats: { total_visits: 640, avg_visit_value: 95, creators_onboarded: 18 },
    reviews: [
      {
        id: "r1",
        creator_handle: "@nycmenswear",
        avatar_url: av("nycmen"),
        quote:
          "Getting into an ALD campaign felt like getting a table at the restaurant you've been trying to book for a year. Worth every moment of the waitlist.",
        campaign_title: "Clubhouse Tour",
        date: "2026-03-28",
      },
      {
        id: "r2",
        creator_handle: "@queensbornstyle",
        avatar_url: av("queens"),
        quote:
          "As someone who grew up in Queens, documenting ALD's story felt personal. The content resonated in a way that generic brand deals never do.",
        campaign_title: "Queens Origin Feature",
        date: "2026-01-20",
      },
      {
        id: "r3",
        creator_handle: "@aldwatcher",
        avatar_url: av("aldw"),
        quote:
          "They review content with genuine care, not brand anxiety. They suggested one edit and it made the video better. That kind of collaboration is rare.",
        campaign_title: "Fall Collection Preview",
        date: "2025-10-15",
      },
    ],
    related_slugs: ["reformation-nolita", "story-chelsea", "madewell-soho"],
  },

  // ── 19 ────────────────────────────────────────────────────────────────────
  {
    slug: "kiehl-s-since-1851-greenwich-village",
    name: "Kiehl's Greenwich Village",
    tagline: "171 years of neighborhood skincare.",
    category: "Beauty",
    neighborhood: "Greenwich Village",
    borough: "Manhattan",
    story:
      "Kiehl's original pharmacy at Third Avenue and 13th Street opened in 1851 and is the longest-running beauty retailer in New York City. The brand's Greenwich Village location, designed to reference the apothecary aesthetic of the original, feels like a museum of skincare history: vintage packaging displayed alongside current product, the famous skull-and-crossbones logo rendered in a dozen forms, and staff who are trained to recommend products based on skin analysis rather than sales targets. The brand still offers free samples without purchase — a policy from the original pharmacy that has never changed. Push campaigns here attract beauty creators who want heritage credibility in their content without sacrificing relatability.",
    hero_image:
      "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=1400&q=80",
    address: "109 3rd Ave, New York, NY 10003",
    lat: 40.7323,
    lng: -73.9877,
    phone: "+1 (212) 555-1919",
    website: "https://kiehls.com",
    instagram: "@kiehls",
    hours: [
      { day: "Mon – Sat", hours: "10:00 AM – 8:00 PM" },
      { day: "Sunday", hours: "11:00 AM – 7:00 PM" },
    ],
    campaigns: [
      {
        id: "kl-c1",
        title: "The Apothecary Experience — Heritage Skincare",
        description:
          "Document the Kiehl's experience from skin consultation to product recommendation. Explore the heritage aesthetic. $40 payout + $60 product bundle.",
        payout: 40,
        spots_remaining: 8,
        spots_total: 12,
        deadline: "2026-05-28T23:59:00Z",
        category: "Beauty",
        tier_required: "Seed",
        image:
          "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=600&q=75",
      },
    ],
    creators: [
      {
        id: "c1",
        handle: "@apothecaryera",
        avatar_url: av("apothera"),
        tier: "Operator",
      },
      {
        id: "c2",
        handle: "@heritageglow",
        avatar_url: av("herit"),
        tier: "Proven",
      },
      {
        id: "c3",
        handle: "@kiehls_irl",
        avatar_url: av("kiehls"),
        tier: "Explorer",
      },
      {
        id: "c4",
        handle: "@skinheritage",
        avatar_url: av("skinh"),
        tier: "Closer",
      },
      {
        id: "c5",
        handle: "@1851beauty",
        avatar_url: av("1851"),
        tier: "Partner",
      },
      {
        id: "c6",
        handle: "@grwm_gvill",
        avatar_url: av("gvill"),
        tier: "Operator",
      },
      {
        id: "c7",
        handle: "@classicbeauty_",
        avatar_url: av("classb"),
        tier: "Proven",
      },
      {
        id: "c8",
        handle: "@nycpharma",
        avatar_url: av("nycph"),
        tier: "Explorer",
      },
      {
        id: "c9",
        handle: "@vintageskin",
        avatar_url: av("vinsk"),
        tier: "Seed",
      },
      {
        id: "c10",
        handle: "@3rdavebeauty",
        avatar_url: av("3rdave"),
        tier: "Operator",
      },
    ],
    stats: { total_visits: 1820, avg_visit_value: 49, creators_onboarded: 55 },
    reviews: [
      {
        id: "r1",
        creator_handle: "@1851beauty",
        avatar_url: av("1851"),
        quote:
          "You can't fake 171 years of skincare heritage on camera. Kiehl's is one of those rare brands where the story tells itself and the creator just has to show up.",
        campaign_title: "Heritage Skincare Feature",
        date: "2026-03-22",
      },
      {
        id: "r2",
        creator_handle: "@skinheritage",
        avatar_url: av("skinh"),
        quote:
          "The free sample policy is real and it's generous. I left with 12 samples I hadn't asked for. That kind of hospitality photographs better than any campaign set-up.",
        campaign_title: "Apothecary Experience",
        date: "2026-02-08",
      },
      {
        id: "r3",
        creator_handle: "@classicbeauty_",
        avatar_url: av("classb"),
        quote:
          "Three campaigns, no approval friction, payout on time. Kiehl's understands that creator trust is worth more than any single post's metrics.",
        campaign_title: "Classic Skincare Series",
        date: "2025-12-18",
      },
    ],
    related_slugs: [
      "aesop-west-village",
      "glossier-flagship-soho",
      "bluemercury-upper-east-side",
    ],
  },

  // ── 20 ────────────────────────────────────────────────────────────────────
  {
    slug: "madewell-soho",
    name: "Madewell SoHo",
    tagline: "Denim. Done honestly.",
    category: "Retail",
    neighborhood: "SoHo",
    borough: "Manhattan",
    story:
      "Madewell has occupied its SoHo corner since 2012, but the store has reinvented itself at least three times since then. The current format — a thoughtful edit of denim, basics, and a rotating selection of independently made accessories — positions Madewell as the anti-fashion fashion brand: clothes you wear constantly, not clothes you wear once. The SoHo flagship includes a denim customization bar where staff will hem, distress, or monogram any pair on the spot. The ever-present Try-On program — where staff bring the same jean in five washes and three cuts to your fitting room without being asked — is the brand's most loved service and the most frequently mentioned feature in Push campaign content.",
    hero_image:
      "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=1400&q=80",
    address: "115 Mercer St, New York, NY 10012",
    lat: 40.7228,
    lng: -74.0,
    phone: "+1 (212) 555-2020",
    website: "https://madewell.com",
    instagram: "@madewell",
    hours: [
      { day: "Mon – Sat", hours: "10:00 AM – 8:00 PM" },
      { day: "Sunday", hours: "11:00 AM – 7:00 PM" },
    ],
    campaigns: [
      {
        id: "mw-c1",
        title: "The Perfect Jean — Honest Try-On",
        description:
          "Find your perfect denim at Madewell. Document the process — the fits, the fabrics, the final choice. $38 payout + $75 store credit.",
        payout: 38,
        spots_remaining: 7,
        spots_total: 10,
        deadline: "2026-05-30T23:59:00Z",
        category: "Retail",
        tier_required: "Seed",
        image:
          "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600&q=75",
      },
    ],
    creators: [
      {
        id: "c1",
        handle: "@denimdiaries_nyc",
        avatar_url: av("denim"),
        tier: "Proven",
      },
      {
        id: "c2",
        handle: "@madewelladdict",
        avatar_url: av("mwaddict"),
        tier: "Operator",
      },
      {
        id: "c3",
        handle: "@sohodenim",
        avatar_url: av("sohodenim"),
        tier: "Explorer",
      },
      {
        id: "c4",
        handle: "@jeansfordays",
        avatar_url: av("jeans"),
        tier: "Closer",
      },
      {
        id: "c5",
        handle: "@casualchicnyc",
        avatar_url: av("casual"),
        tier: "Proven",
      },
      {
        id: "c6",
        handle: "@mercerstyle",
        avatar_url: av("mercer"),
        tier: "Operator",
      },
      {
        id: "c7",
        handle: "@fitguidenyc",
        avatar_url: av("fitg"),
        tier: "Seed",
      },
      {
        id: "c8",
        handle: "@basicbutnotbasic",
        avatar_url: av("basic"),
        tier: "Proven",
      },
      {
        id: "c9",
        handle: "@sustaindenim",
        avatar_url: av("sustd"),
        tier: "Explorer",
      },
      {
        id: "c10",
        handle: "@nycjeanfreak",
        avatar_url: av("jeanf"),
        tier: "Operator",
      },
    ],
    stats: { total_visits: 2080, avg_visit_value: 46, creators_onboarded: 61 },
    reviews: [
      {
        id: "r1",
        creator_handle: "@denimdiaries_nyc",
        avatar_url: av("denim"),
        quote:
          "The Try-On program is genuinely the best thing about this campaign. Staff brought me seven pairs I wouldn't have pulled myself and three of them were perfect.",
        campaign_title: "The Perfect Jean",
        date: "2026-03-30",
      },
      {
        id: "r2",
        creator_handle: "@jeansfordays",
        avatar_url: av("jeans"),
        quote:
          "Honest try-on content is my whole thing. When a campaign brief aligns perfectly with your authentic format, the content quality goes through the roof.",
        campaign_title: "Honest Denim Review",
        date: "2026-02-22",
      },
      {
        id: "r3",
        creator_handle: "@basicbutnotbasic",
        avatar_url: av("basic"),
        quote:
          "Six campaigns in six months. The category rotates, the staff turnover is low, and the payout always arrives same week. This is my anchor merchant on Push.",
        campaign_title: "Accessories Season Feature",
        date: "2025-12-05",
      },
    ],
    related_slugs: [
      "reformation-nolita",
      "aimé-leon-dore-nolita",
      "story-chelsea",
    ],
  },
];

// ---------------------------------------------------------------------------
// Lookup helpers
// ---------------------------------------------------------------------------

export function getMerchantBySlug(slug: string): MerchantPublic | undefined {
  return MERCHANTS.find((m) => m.slug === slug);
}

export function getRelatedMerchants(slugs: string[]): MerchantPublic[] {
  return slugs
    .map((s) => MERCHANTS.find((m) => m.slug === s))
    .filter(Boolean) as MerchantPublic[];
}

export function getAllSlugs(): string[] {
  return MERCHANTS.map((m) => m.slug);
}
