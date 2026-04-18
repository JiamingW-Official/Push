// 30 NYC neighborhoods for local SEO landing pages

export type Borough =
  | "Manhattan"
  | "Brooklyn"
  | "Queens"
  | "Bronx"
  | "Staten Island";

export type CreatorTier =
  | "seed"
  | "explorer"
  | "operator"
  | "proven"
  | "closer"
  | "partner";

export interface FeaturedMerchant {
  id: string;
  name: string;
  category: string;
  address: string;
  activeCampaigns: number;
  avgPayout: number;
  image?: string;
}

export interface FeaturedCreator {
  id: string;
  name: string;
  handle: string;
  tier: CreatorTier;
  pushScore: number;
  campaignsCompleted: number;
  topCategory: string;
  avatar?: string;
}

export interface RecentVisit {
  id: string;
  creatorHandle: string;
  merchantName: string;
  campaignTitle: string;
  verifiedAt: string; // ISO date
  payout: number;
}

export interface NeighborhoodStats {
  totalVerifiedVisits: number;
  activeCampaigns: number;
  activeCreators: number;
  activeMerchants: number;
  topCategory: string;
  avgPayout: number;
}

export interface Neighborhood {
  slug: string;
  name: string;
  borough: Borough;
  description: string; // ~300 words editorial
  lat: number;
  lng: number;
  stats: NeighborhoodStats;
  featuredMerchants: FeaturedMerchant[];
  featuredCreators: FeaturedCreator[];
  recentVisits: RecentVisit[];
  nearbyNeighborhoods: string[]; // slugs
}

// ---------------------------------------------------------------------------
// Shared creator pool
// ---------------------------------------------------------------------------

const CREATORS: Record<string, FeaturedCreator> = {
  maya: {
    id: "cr-maya",
    name: "Maya Chen",
    handle: "maya.eats.nyc",
    tier: "proven",
    pushScore: 847,
    campaignsCompleted: 34,
    topCategory: "Food & Drink",
  },
  alex: {
    id: "cr-alex",
    name: "Alex Rivera",
    handle: "alex_nyc_lens",
    tier: "operator",
    pushScore: 703,
    campaignsCompleted: 21,
    topCategory: "Lifestyle",
  },
  jasmine: {
    id: "cr-jasmine",
    name: "Jasmine Park",
    handle: "jasmine.style",
    tier: "closer",
    pushScore: 912,
    campaignsCompleted: 58,
    topCategory: "Fashion",
  },
  dev: {
    id: "cr-dev",
    name: "Dev Patel",
    handle: "devinyc",
    tier: "explorer",
    pushScore: 541,
    campaignsCompleted: 9,
    topCategory: "Coffee",
  },
  sara: {
    id: "cr-sara",
    name: "Sara Kim",
    handle: "sara.creates",
    tier: "partner",
    pushScore: 981,
    campaignsCompleted: 102,
    topCategory: "Beauty",
  },
  marco: {
    id: "cr-marco",
    name: "Marco Torres",
    handle: "marco_bklyn",
    tier: "operator",
    pushScore: 715,
    campaignsCompleted: 27,
    topCategory: "Food & Drink",
  },
  priya: {
    id: "cr-priya",
    name: "Priya Singh",
    handle: "priyafit",
    tier: "proven",
    pushScore: 823,
    campaignsCompleted: 41,
    topCategory: "Fitness",
  },
  james: {
    id: "cr-james",
    name: "James Liu",
    handle: "jamesliu.photo",
    tier: "closer",
    pushScore: 934,
    campaignsCompleted: 67,
    topCategory: "Lifestyle",
  },
};

// ---------------------------------------------------------------------------
// Helper to generate consistent recent visits for a neighborhood
// ---------------------------------------------------------------------------

function makeVisits(
  slug: string,
  merchants: string[],
  campaigns: string[],
): RecentVisit[] {
  const handles = [
    "maya.eats.nyc",
    "brooklyn_bites",
    "nycfoodie_",
    "jasmine.style",
    "devinyc",
    "marco_bklyn",
    "priyafit",
    "alex_nyc_lens",
    "sara.creates",
    "jamesliu.photo",
  ];
  return Array.from({ length: 10 }, (_, i) => ({
    id: `visit-${slug}-${i}`,
    creatorHandle: handles[i % handles.length],
    merchantName: merchants[i % merchants.length],
    campaignTitle: campaigns[i % campaigns.length],
    verifiedAt: new Date(Date.now() - i * 6 * 60 * 60 * 1000).toISOString(),
    payout: [0, 25, 35, 50, 75, 100][i % 6],
  }));
}

// ---------------------------------------------------------------------------
// 30 NYC Neighborhoods
// ---------------------------------------------------------------------------

export const NEIGHBORHOODS: Neighborhood[] = [
  // ── MANHATTAN ────────────────────────────────────────────────────────────

  {
    slug: "williamsburg",
    name: "Williamsburg",
    borough: "Brooklyn",
    description:
      "Williamsburg is Brooklyn's most talked-about neighborhood — a relentless creative engine that has evolved from manufacturing backwater to global style destination without losing its edge. The waterfront along the East River anchors a skyline of converted factories, boutique hotels, and rooftop bars that glow against the Manhattan silhouette at dusk. Bedford Avenue is the artery: record shops, independent bookstores, vintage clothing dealers, and concept coffee bars line every block. Push operates here at full density. The neighborhood's creators are among the platform's most prolific, documenting everything from artisan ramen launches to limited-edition sneaker drops. Merchants in Williamsburg are sophisticated about creator marketing — they know the QR attribution model, they set campaign briefs with intention, and they value authentic foot-traffic verification over inflated reach numbers. The nightlife corridor on Metropolitan Avenue brings a different energy after 8 PM: cocktail bars with mezcal-forward menus, subterranean clubs, and late-night taco spots that generate their own creator campaign demand. Weekend brunch culture is an industry in itself here — campaign slots fill within hours of going live. Top categories on Push in Williamsburg: Food & Drink, Fashion, Coffee, and Nightlife. If you're a creator looking to build a dense portfolio fast, this is your starting neighborhood.",
    lat: 40.7145,
    lng: -73.9578,
    stats: {
      totalVerifiedVisits: 4821,
      activeCampaigns: 34,
      activeCreators: 156,
      activeMerchants: 42,
      topCategory: "Food & Drink",
      avgPayout: 48,
    },
    featuredMerchants: [
      {
        id: "m-wburg-1",
        name: "Lucali Brooklyn",
        category: "Food & Drink",
        address: "575 Henry St, Brooklyn, NY 11231",
        activeCampaigns: 2,
        avgPayout: 75,
      },
      {
        id: "m-wburg-2",
        name: "Blank Street Coffee Williamsburg",
        category: "Coffee",
        address: "280 Bedford Ave, Brooklyn, NY 11211",
        activeCampaigns: 3,
        avgPayout: 0,
      },
      {
        id: "m-wburg-3",
        name: "Extra Fancy",
        category: "Nightlife",
        address: "302 Metropolitan Ave, Brooklyn, NY 11211",
        activeCampaigns: 1,
        avgPayout: 50,
      },
    ],
    featuredCreators: [
      CREATORS.maya,
      CREATORS.marco,
      CREATORS.jasmine,
      CREATORS.dev,
    ],
    recentVisits: makeVisits(
      "williamsburg",
      ["Lucali Brooklyn", "Blank Street Coffee", "Extra Fancy"],
      ["Best Pizza in BK", "Morning Ritual", "Rooftop Bar Feature"],
    ),
    nearbyNeighborhoods: ["greenpoint", "bushwick", "bedford-stuyvesant"],
  },

  {
    slug: "lower-east-side",
    name: "Lower East Side",
    borough: "Manhattan",
    description:
      "The Lower East Side is New York City at its most unfiltered — a palimpsest of immigrant history and avant-garde culture compressed into a dense grid south of Houston Street. Once the entry point for waves of Jewish, Puerto Rican, and Chinese immigrants, the LES today holds all of that layered identity alongside a thriving creative economy. Orchard Street still has fabric shops and delis next to concept bars and art galleries. Katz's Delicatessen has served pastrami since 1888 and still draws lines. Push campaigns here lean into the neighborhood's gritty authenticity — merchants don't want polished content, they want real, documentary-style coverage that reflects the neighborhood's character. The dining scene is exceptional and eclectic: Vietnamese bánh mì, traditional Jewish deli, izakaya, Mexican mezcal bars, and some of the city's most serious cocktail programs. After midnight, the LES becomes one of the city's most concentrated nightlife zones — a campaign opportunity no other neighborhood replicates at that volume. Creator activity peaks Thursday through Saturday. Verified visit data shows 60% of Push campaigns in this neighborhood are fulfilled during evening hours, making the LES uniquely suited for nightlife and dining-focused creators.",
    lat: 40.7157,
    lng: -73.9863,
    stats: {
      totalVerifiedVisits: 3614,
      activeCampaigns: 28,
      activeCreators: 127,
      activeMerchants: 38,
      topCategory: "Food & Drink",
      avgPayout: 42,
    },
    featuredMerchants: [
      {
        id: "m-les-1",
        name: "Katz's Delicatessen",
        category: "Food & Drink",
        address: "205 E Houston St, New York, NY 10002",
        activeCampaigns: 1,
        avgPayout: 35,
      },
      {
        id: "m-les-2",
        name: "Attaboy",
        category: "Nightlife",
        address: "134 Eldridge St, New York, NY 10002",
        activeCampaigns: 2,
        avgPayout: 60,
      },
      {
        id: "m-les-3",
        name: "Scarr's Pizza",
        category: "Food & Drink",
        address: "22 Orchard St, New York, NY 10002",
        activeCampaigns: 2,
        avgPayout: 30,
      },
    ],
    featuredCreators: [
      CREATORS.alex,
      CREATORS.maya,
      CREATORS.james,
      CREATORS.sara,
    ],
    recentVisits: makeVisits(
      "lower-east-side",
      ["Katz's Delicatessen", "Attaboy", "Scarr's Pizza"],
      ["Deli Icon Feature", "Cocktail Bar Night", "NY Slice Story"],
    ),
    nearbyNeighborhoods: ["soho", "east-village", "chinatown"],
  },

  {
    slug: "soho",
    name: "SoHo",
    borough: "Manhattan",
    description:
      "SoHo occupies a singular position in New York's commercial landscape — a neighborhood where cast-iron architecture provides the backdrop for the densest concentration of luxury retail and independent boutiques in the Western Hemisphere. The grid formed by Broadway, Canal, Houston, and West Broadway is a global fashion destination that attracts both local tastemakers and international travelers. For Push merchants, SoHo means access to an audience with high purchasing intent and a willingness to document their experiences with production quality that rivals editorial shoots. Creator campaigns here skew toward fashion, beauty, and lifestyle — the category composition reflects the commercial reality of the neighborhood. Average campaign payouts on Push in SoHo run 40% higher than the city average, driven by the premium nature of the brands operating here. Pop-up activations are frequent: brands launch limited runs in temporary retail spaces, run one-week creator campaigns, then disappear. The permanence of Prince Street's cobblestones contrasts with the constant churn of brand activations — and Push's QR verification model is particularly valuable here, providing brands with real foot-traffic data to justify their media spend.",
    lat: 40.7232,
    lng: -74.0026,
    stats: {
      totalVerifiedVisits: 5102,
      activeCampaigns: 41,
      activeCreators: 189,
      activeMerchants: 53,
      topCategory: "Fashion",
      avgPayout: 67,
    },
    featuredMerchants: [
      {
        id: "m-soho-1",
        name: "Frame Denim SoHo",
        category: "Fashion",
        address: "383 West Broadway, New York, NY 10013",
        activeCampaigns: 3,
        avgPayout: 100,
      },
      {
        id: "m-soho-2",
        name: "Jack's Wife Freda",
        category: "Food & Drink",
        address: "224 Lafayette St, New York, NY 10012",
        activeCampaigns: 2,
        avgPayout: 45,
      },
      {
        id: "m-soho-3",
        name: "Saturdays NYC",
        category: "Lifestyle",
        address: "31 Crosby St, New York, NY 10013",
        activeCampaigns: 2,
        avgPayout: 75,
      },
    ],
    featuredCreators: [
      CREATORS.jasmine,
      CREATORS.sara,
      CREATORS.james,
      CREATORS.priya,
    ],
    recentVisits: makeVisits(
      "soho",
      ["Frame Denim SoHo", "Jack's Wife Freda", "Saturdays NYC"],
      ["Spring Collection Drop", "Brunch Editorial", "Sunday Surf Culture"],
    ),
    nearbyNeighborhoods: ["tribeca", "nolita", "lower-east-side"],
  },

  {
    slug: "east-village",
    name: "East Village",
    borough: "Manhattan",
    description:
      "The East Village carries its punk-rock DNA into the present with remarkable grace — the neighborhood that birthed CBGB and the New York hardcore scene now hosts Michelin-starred restaurants, but it hasn't sanitized itself into a caricature. Avenue A through C still has enough rough edges to feel honest. St. Marks Place is a permanent street fair of tattoo parlors, vintage shops, Japanese curry restaurants, and bars that have survived decades of rent pressure. Push campaigns in the East Village tend toward the experiential: ramen restaurants launching after-midnight menus, record shops running special listening events, underground bars hosting tasting nights. The creator community here is one of the most engaged on the platform — creators who live in or near the East Village understand the neighborhood's ethos and produce content that resonates authentically with its regulars. Top performing campaign categories: Food & Drink (Japanese/Korean/Mexican dominant), Nightlife, Record/Music, Tattoo & Body Art. Verified visit volumes peak Thursday through Saturday, with Sunday brunch as a consistent secondary surge.",
    lat: 40.7265,
    lng: -73.9815,
    stats: {
      totalVerifiedVisits: 3287,
      activeCampaigns: 24,
      activeCreators: 112,
      activeMerchants: 31,
      topCategory: "Food & Drink",
      avgPayout: 38,
    },
    featuredMerchants: [
      {
        id: "m-ev-1",
        name: "Momofuku Noodle Bar",
        category: "Food & Drink",
        address: "171 1st Ave, New York, NY 10003",
        activeCampaigns: 2,
        avgPayout: 50,
      },
      {
        id: "m-ev-2",
        name: "Death & Co",
        category: "Nightlife",
        address: "433 E 6th St, New York, NY 10009",
        activeCampaigns: 1,
        avgPayout: 75,
      },
      {
        id: "m-ev-3",
        name: "Ippudo NY",
        category: "Food & Drink",
        address: "65 4th Ave, New York, NY 10003",
        activeCampaigns: 3,
        avgPayout: 35,
      },
    ],
    featuredCreators: [
      CREATORS.maya,
      CREATORS.alex,
      CREATORS.dev,
      CREATORS.marco,
    ],
    recentVisits: makeVisits(
      "east-village",
      ["Momofuku Noodle Bar", "Death & Co", "Ippudo NY"],
      ["Ramen Origins", "Cocktail Craft", "Late Night Ramen"],
    ),
    nearbyNeighborhoods: [
      "lower-east-side",
      "greenwich-village",
      "stuyvesant-town",
    ],
  },

  {
    slug: "west-village",
    name: "West Village",
    borough: "Manhattan",
    description:
      "The West Village is perhaps Manhattan's most coveted residential neighborhood — a maze of pre-grid streets lined with Federal townhouses, flowering window boxes, and restaurants that have maintained their reputation for decades without resorting to hype. Hudson Street and Bleecker Street anchor a dining scene that prioritizes hospitality over spectacle: old-school Italian red sauce joints, intimate wine bars, cheese shops that have been here longer than most of their customers. Push operates here at moderate density — the neighborhood's merchant community is selective about creator partnerships, preferring smaller, highly engaged creators over mass-reach accounts. Campaign briefs here emphasize authenticity and neighborhood fit. The average campaign payout in the West Village is among Push's highest: merchants budget for quality because their customers expect it. Creators who perform best in this neighborhood have a genuine connection to the area — they've eaten at these restaurants, they know the bartenders, their content reads as local rather than promotional.",
    lat: 40.7348,
    lng: -74.006,
    stats: {
      totalVerifiedVisits: 2891,
      activeCampaigns: 19,
      activeCreators: 87,
      activeMerchants: 24,
      topCategory: "Food & Drink",
      avgPayout: 72,
    },
    featuredMerchants: [
      {
        id: "m-wv-1",
        name: "Via Carota",
        category: "Food & Drink",
        address: "51 Grove St, New York, NY 10014",
        activeCampaigns: 1,
        avgPayout: 100,
      },
      {
        id: "m-wv-2",
        name: "Murray's Cheese",
        category: "Specialty Food",
        address: "254 Bleecker St, New York, NY 10014",
        activeCampaigns: 2,
        avgPayout: 60,
      },
      {
        id: "m-wv-3",
        name: "Buvette",
        category: "Food & Drink",
        address: "42 Grove St, New York, NY 10014",
        activeCampaigns: 1,
        avgPayout: 80,
      },
    ],
    featuredCreators: [
      CREATORS.sara,
      CREATORS.jasmine,
      CREATORS.james,
      CREATORS.priya,
    ],
    recentVisits: makeVisits(
      "west-village",
      ["Via Carota", "Murray's Cheese", "Buvette"],
      ["Sunday Pasta", "Cheese Board Editorial", "French Breakfast"],
    ),
    nearbyNeighborhoods: ["greenwich-village", "chelsea", "tribeca"],
  },

  {
    slug: "chelsea",
    name: "Chelsea",
    borough: "Manhattan",
    description:
      "Chelsea holds a paradox at its core: it is simultaneously the world's most important contemporary art gallery district and one of New York's most commercially vibrant neighborhoods. The High Line threads through its western edge, drawing millions of visitors past gallery openings and food market stalls. The Chelsea Market on 9th Avenue is a food hall institution in a converted biscuit factory — one of the city's best places to film campaign content given its photogenic interiors and diverse vendor mix. Push campaigns in Chelsea split across two distinct consumer profiles: the art-world adjacent (gallery openings, design boutiques, architectural offices) and the fitness-wellness cluster that has colonized the eastern blocks near the Flatiron. The neighborhood's demographic breadth makes it one of Push's most versatile markets — campaigns for everything from artisan chocolate shops to high-end fitness studios perform well here. Creator content that contextualizes Chelsea's visual richness — the gallery white cubes, the High Line's industrial gardens, the sunset views west over the Hudson — tends to outperform generic product placements.",
    lat: 40.7465,
    lng: -74.0014,
    stats: {
      totalVerifiedVisits: 3441,
      activeCampaigns: 27,
      activeCreators: 134,
      activeMerchants: 36,
      topCategory: "Lifestyle",
      avgPayout: 55,
    },
    featuredMerchants: [
      {
        id: "m-chelsea-1",
        name: "Chelsea Market",
        category: "Food & Drink",
        address: "75 9th Ave, New York, NY 10011",
        activeCampaigns: 4,
        avgPayout: 40,
      },
      {
        id: "m-chelsea-2",
        name: "The High Line Hotel",
        category: "Lifestyle",
        address: "180 10th Ave, New York, NY 10011",
        activeCampaigns: 2,
        avgPayout: 100,
      },
      {
        id: "m-chelsea-3",
        name: "Cookshop",
        category: "Food & Drink",
        address: "156 10th Ave, New York, NY 10011",
        activeCampaigns: 1,
        avgPayout: 65,
      },
    ],
    featuredCreators: [
      CREATORS.priya,
      CREATORS.james,
      CREATORS.jasmine,
      CREATORS.alex,
    ],
    recentVisits: makeVisits(
      "chelsea",
      ["Chelsea Market", "The High Line Hotel", "Cookshop"],
      ["Market Day", "Hotel Bar Night", "Farm-to-Table Brunch"],
    ),
    nearbyNeighborhoods: ["west-village", "hell's-kitchen", "flatiron"],
  },

  {
    slug: "flatiron",
    name: "Flatiron",
    borough: "Manhattan",
    description:
      "The Flatiron District takes its name from the iconic triangular building at 23rd Street and Fifth Avenue — one of New York's most photographed structures, visible from nearly every block in the neighborhood. The surrounding streets have become a hub for tech companies, media agencies, and the restaurants and coffee bars that serve them. Madison Square Park is the neighborhood's living room: farmers markets, public art installations, and Shake Shack's original location anchor a civic square that draws both tourists and workers. Push campaigns in Flatiron skew corporate-adjacent — merchants know their customer is often a professional lunch crowd with a 45-minute window. Quick-service, counter-service, and delivery-first restaurants dominate, but the neighborhood also supports a strong coffee shop creator economy. The NoMad sub-district to the north adds luxury hotel bars and destination restaurants to the mix. Creator campaigns run consistently Monday through Friday in Flatiron, with a pronounced midday surge unlike most other Push neighborhoods.",
    lat: 40.7412,
    lng: -73.9899,
    stats: {
      totalVerifiedVisits: 2743,
      activeCampaigns: 22,
      activeCreators: 98,
      activeMerchants: 29,
      topCategory: "Coffee",
      avgPayout: 43,
    },
    featuredMerchants: [
      {
        id: "m-flat-1",
        name: "Shake Shack Madison Square Park",
        category: "Food & Drink",
        address: "Madison Square Park, New York, NY 10010",
        activeCampaigns: 2,
        avgPayout: 25,
      },
      {
        id: "m-flat-2",
        name: "Eataly NYC Flatiron",
        category: "Food & Drink",
        address: "200 5th Ave, New York, NY 10010",
        activeCampaigns: 3,
        avgPayout: 55,
      },
      {
        id: "m-flat-3",
        name: "La Pecora Bianca",
        category: "Food & Drink",
        address: "1133 Broadway, New York, NY 10010",
        activeCampaigns: 1,
        avgPayout: 65,
      },
    ],
    featuredCreators: [
      CREATORS.dev,
      CREATORS.alex,
      CREATORS.priya,
      CREATORS.maya,
    ],
    recentVisits: makeVisits(
      "flatiron",
      ["Shake Shack", "Eataly NYC", "La Pecora Bianca"],
      ["Classic Shack", "Italian Market Tour", "Lunch Hour Feature"],
    ),
    nearbyNeighborhoods: ["chelsea", "gramercy", "union-square"],
  },

  {
    slug: "upper-west-side",
    name: "Upper West Side",
    borough: "Manhattan",
    description:
      "The Upper West Side is Manhattan's most livable neighborhood — broad boulevards flanked by prewar apartment buildings, the natural expanse of Central Park on one side and Riverside Park on the other. Broadway between 70th and 110th Streets is a continuous strip of independent restaurants, bookshops, and specialty food stores that have resisted chain conversion more successfully than most Manhattan neighborhoods. Zabar's, H&H Bagels, and Barney Greengrass are institutions with decades of reputation — campaign placements here carry genuine cultural weight. The American Museum of Natural History and Lincoln Center anchor major cultural institutions that drive visitor traffic throughout the year. Push campaigns on the Upper West Side tend toward family-friendly dining, neighborhood restaurants with loyal regulars, and fitness studios that serve the running culture along the park paths. Creator content that leans into the neighborhood's residential warmth — the Sunday morning bagel run, the pre-concert dinner — outperforms content that tries to manufacture edge where none exists.",
    lat: 40.7842,
    lng: -73.9805,
    stats: {
      totalVerifiedVisits: 2156,
      activeCampaigns: 18,
      activeCreators: 76,
      activeMerchants: 22,
      topCategory: "Food & Drink",
      avgPayout: 41,
    },
    featuredMerchants: [
      {
        id: "m-uws-1",
        name: "Zabar's",
        category: "Specialty Food",
        address: "2245 Broadway, New York, NY 10024",
        activeCampaigns: 1,
        avgPayout: 40,
      },
      {
        id: "m-uws-2",
        name: "Barney Greengrass",
        category: "Food & Drink",
        address: "541 Amsterdam Ave, New York, NY 10024",
        activeCampaigns: 1,
        avgPayout: 50,
      },
      {
        id: "m-uws-3",
        name: "Levain Bakery UWS",
        category: "Coffee",
        address: "167 W 74th St, New York, NY 10023",
        activeCampaigns: 2,
        avgPayout: 0,
      },
    ],
    featuredCreators: [
      CREATORS.priya,
      CREATORS.maya,
      CREATORS.dev,
      CREATORS.alex,
    ],
    recentVisits: makeVisits(
      "upper-west-side",
      ["Zabar's", "Barney Greengrass", "Levain Bakery"],
      ["Deli Sunday", "Smoked Fish Story", "Cookie Ritual"],
    ),
    nearbyNeighborhoods: ["upper-east-side", "harlem", "morningside-heights"],
  },

  {
    slug: "harlem",
    name: "Harlem",
    borough: "Manhattan",
    description:
      "Harlem is one of the world's most culturally significant neighborhoods — the historical center of African American intellectual, artistic, and political life in the 20th century, and a neighborhood undergoing careful self-determined renewal in the 21st. 125th Street is the commercial main street: national chains now coexist with legacy barbershops, soul food institutions, and the new wave of Black-owned restaurants and cocktail bars that have made Harlem one of New York's most compelling dining destinations. Push arrived in Harlem at the invitation of its merchant community — local business owners who saw creator marketing as a tool for driving neighborhood-first foot traffic rather than gentrification-accelerating hype. Campaigns here are often explicitly community-focused: supporting businesses run by and for Harlem residents. The creator community in Harlem reflects the neighborhood's demographics more accurately than any other Push market — a genuine representation of the people who live here and care about it. Top categories: Soul Food & Southern, Caribbean, West African, Coffee, Beauty & Barbershop.",
    lat: 40.8116,
    lng: -73.9465,
    stats: {
      totalVerifiedVisits: 2834,
      activeCampaigns: 23,
      activeCreators: 104,
      activeMerchants: 28,
      topCategory: "Food & Drink",
      avgPayout: 36,
    },
    featuredMerchants: [
      {
        id: "m-harlem-1",
        name: "Sylvia's Restaurant",
        category: "Food & Drink",
        address: "328 Malcolm X Blvd, New York, NY 10027",
        activeCampaigns: 1,
        avgPayout: 40,
      },
      {
        id: "m-harlem-2",
        name: "Red Rooster Harlem",
        category: "Food & Drink",
        address: "310 Lenox Ave, New York, NY 10027",
        activeCampaigns: 2,
        avgPayout: 65,
      },
      {
        id: "m-harlem-3",
        name: "Hyena Coffee",
        category: "Coffee",
        address: "234 W 125th St, New York, NY 10027",
        activeCampaigns: 2,
        avgPayout: 0,
      },
    ],
    featuredCreators: [
      CREATORS.marco,
      CREATORS.maya,
      CREATORS.james,
      CREATORS.priya,
    ],
    recentVisits: makeVisits(
      "harlem",
      ["Sylvia's Restaurant", "Red Rooster Harlem", "Hyena Coffee"],
      ["Soul Food Sunday", "Community Brunch", "Morning Ritual"],
    ),
    nearbyNeighborhoods: [
      "upper-west-side",
      "upper-east-side",
      "washington-heights",
    ],
  },

  // ── BROOKLYN ─────────────────────────────────────────────────────────────

  {
    slug: "greenpoint",
    name: "Greenpoint",
    borough: "Brooklyn",
    description:
      "Greenpoint is Brooklyn's northernmost neighborhood — a tight-knit, historically Polish community that has absorbed a creative class without losing its character. Manhattan Avenue is still lined with pierogi shops, Polish delis, and Catholic churches alongside independent coffee bars, natural wine shops, and the occasional gallery. The neighborhood sits along Newtown Creek and the East River, and its industrial waterfront has been transformed into parks and cultural spaces. Push operates in Greenpoint with particular success in food, coffee, and artisan categories — the neighborhood's residents are sophisticated consumers who value provenance and craft. Creator campaigns here perform best when they lean into the neighborhood's dual identity: old-world Polish charm and new-world Brooklyn creative. The cross-pollination is authentic and visually rich, making Greenpoint one of Push's highest-performing neighborhoods for content quality metrics.",
    lat: 40.7299,
    lng: -73.9522,
    stats: {
      totalVerifiedVisits: 2341,
      activeCampaigns: 19,
      activeCreators: 88,
      activeMerchants: 24,
      topCategory: "Coffee",
      avgPayout: 40,
    },
    featuredMerchants: [
      {
        id: "m-gp-1",
        name: "Transmitter Brewing",
        category: "Nightlife",
        address: "53 Scott Ave, Brooklyn, NY 11237",
        activeCampaigns: 2,
        avgPayout: 45,
      },
      {
        id: "m-gp-2",
        name: "Esme",
        category: "Food & Drink",
        address: "999 Manhattan Ave, Brooklyn, NY 11222",
        activeCampaigns: 1,
        avgPayout: 60,
      },
      {
        id: "m-gp-3",
        name: "Champion Coffee",
        category: "Coffee",
        address: "142 Nassau Ave, Brooklyn, NY 11222",
        activeCampaigns: 2,
        avgPayout: 0,
      },
    ],
    featuredCreators: [
      CREATORS.alex,
      CREATORS.dev,
      CREATORS.marco,
      CREATORS.maya,
    ],
    recentVisits: makeVisits(
      "greenpoint",
      ["Transmitter Brewing", "Esme", "Champion Coffee"],
      ["Craft Beer Launch", "Neighborhood Dinner", "Morning Ritual"],
    ),
    nearbyNeighborhoods: ["williamsburg", "bushwick", "long-island-city"],
  },

  {
    slug: "bushwick",
    name: "Bushwick",
    borough: "Brooklyn",
    description:
      "Bushwick is where New York's underground culture surfaces in daylight. The neighborhood's industrial fabric — wide streets, warehouse buildings, manufacturing lofts — provides a blank canvas for the murals, galleries, music venues, and food concepts that have defined its creative identity. The Bushwick Collective, a curated outdoor street art museum spanning dozens of blocks, draws visitors from around the world and provides Push creators with an unmatched visual backdrop for campaign content. Merchants in Bushwick are young, entrepreneurial, and deeply integrated with the creator economy — many owners are creators themselves, and they understand the Push model intuitively. Campaign briefs are often more creative and permissive than in more established neighborhoods. The dining scene spans from casual tacos to ambitious tasting menus, with a particularly strong showing in craft bars and natural wine. Verified visit data shows the highest Friday and Saturday night density of any Brooklyn neighborhood on Push.",
    lat: 40.6944,
    lng: -73.9213,
    stats: {
      totalVerifiedVisits: 3102,
      activeCampaigns: 25,
      activeCreators: 118,
      activeMerchants: 33,
      topCategory: "Nightlife",
      avgPayout: 37,
    },
    featuredMerchants: [
      {
        id: "m-bush-1",
        name: "Heavy Woods",
        category: "Nightlife",
        address: "44 Wilson Ave, Brooklyn, NY 11237",
        activeCampaigns: 2,
        avgPayout: 35,
      },
      {
        id: "m-bush-2",
        name: "Roberta's",
        category: "Food & Drink",
        address: "261 Moore St, Brooklyn, NY 11206",
        activeCampaigns: 2,
        avgPayout: 50,
      },
      {
        id: "m-bush-3",
        name: "Nowadays",
        category: "Nightlife",
        address: "56 Wyckoff Ave, Brooklyn, NY 11385",
        activeCampaigns: 1,
        avgPayout: 60,
      },
    ],
    featuredCreators: [
      CREATORS.marco,
      CREATORS.alex,
      CREATORS.james,
      CREATORS.dev,
    ],
    recentVisits: makeVisits(
      "bushwick",
      ["Heavy Woods", "Roberta's", "Nowadays"],
      ["Warehouse Bar Night", "Pizza Night", "Dance Floor Editorial"],
    ),
    nearbyNeighborhoods: ["williamsburg", "ridgewood", "bedford-stuyvesant"],
  },

  {
    slug: "park-slope",
    name: "Park Slope",
    borough: "Brooklyn",
    description:
      "Park Slope is Brooklyn's most beloved family neighborhood — a succession of brownstone-lined streets climbing the western slope of Prospect Park that functions as a small city within the larger borough. Fifth Avenue is the commercial spine: a continuous strip of neighborhood restaurants, bars, yoga studios, and specialty shops that sustain a remarkably loyal local customer base. The park itself is Park Slope's primary amenity — weekends bring thousands of residents to its meadows, ball fields, and the Long Meadow. Push campaigns in Park Slope have a distinct character: they're oriented around neighborhood rituals and regulars rather than destination visitors. The brunch campaign genre dominates — Park Slope has one of the highest brunch-table-to-resident ratios in any urban neighborhood in America. Fitness studios, family-friendly dining, and specialty coffee also perform well. The neighborhood's demographics skew toward dual-income households with disposable income and high content-consumption habits, making it an attractive market for premium Push merchants.",
    lat: 40.6726,
    lng: -73.9777,
    stats: {
      totalVerifiedVisits: 2614,
      activeCampaigns: 21,
      activeCreators: 95,
      activeMerchants: 27,
      topCategory: "Food & Drink",
      avgPayout: 46,
    },
    featuredMerchants: [
      {
        id: "m-ps-1",
        name: "Olmsted",
        category: "Food & Drink",
        address: "659 Vanderbilt Ave, Brooklyn, NY 11238",
        activeCampaigns: 1,
        avgPayout: 90,
      },
      {
        id: "m-ps-2",
        name: "Sycamore Bar",
        category: "Nightlife",
        address: "1118 Cortelyou Rd, Brooklyn, NY 11218",
        activeCampaigns: 2,
        avgPayout: 40,
      },
      {
        id: "m-ps-3",
        name: "Hungry Ghost Coffee",
        category: "Coffee",
        address: "781 Fulton St, Brooklyn, NY 11217",
        activeCampaigns: 2,
        avgPayout: 0,
      },
    ],
    featuredCreators: [
      CREATORS.priya,
      CREATORS.maya,
      CREATORS.sara,
      CREATORS.marco,
    ],
    recentVisits: makeVisits(
      "park-slope",
      ["Olmsted", "Sycamore Bar", "Hungry Ghost Coffee"],
      ["Garden Dinner", "Neighborhood Bar", "Morning Ritual"],
    ),
    nearbyNeighborhoods: ["prospect-heights", "carroll-gardens", "gowanus"],
  },

  {
    slug: "crown-heights",
    name: "Crown Heights",
    borough: "Brooklyn",
    description:
      "Crown Heights is one of Brooklyn's most culturally diverse neighborhoods — a Caribbean-inflected community with strong West Indian, Haitian, and Jamaican roots, alongside a significant Hasidic Jewish population in its western sections, and a growing creative class drawn by relative affordability. The Eastern Parkway, a Frederick Law Olmsted-designed boulevard connecting Prospect Park to Brownsville, is the neighborhood's grand civic axis. The West Indian American Day Parade, held annually on Labor Day, is one of the largest street festivals in North America. Push campaigns in Crown Heights lean into Caribbean dining culture — jerk chicken, oxtail stew, roti, beef patties — as well as the neighborhood's growing coffee and natural wine scenes. Creator campaigns that center community identity and cultural pride perform exceptionally here. The neighborhood's merchants have embraced Push because it drives genuine community foot traffic rather than tourist drive-bys.",
    lat: 40.6681,
    lng: -73.9462,
    stats: {
      totalVerifiedVisits: 1987,
      activeCampaigns: 16,
      activeCreators: 72,
      activeMerchants: 20,
      topCategory: "Food & Drink",
      avgPayout: 32,
    },
    featuredMerchants: [
      {
        id: "m-ch-1",
        name: "Gloria's Caribbean Cuisine",
        category: "Food & Drink",
        address: "764 Nostrand Ave, Brooklyn, NY 11216",
        activeCampaigns: 1,
        avgPayout: 30,
      },
      {
        id: "m-ch-2",
        name: "Ginger & Lemon",
        category: "Coffee",
        address: "1006 Nostrand Ave, Brooklyn, NY 11225",
        activeCampaigns: 2,
        avgPayout: 0,
      },
      {
        id: "m-ch-3",
        name: "Café Erzulie",
        category: "Food & Drink",
        address: "983 Nostrand Ave, Brooklyn, NY 11225",
        activeCampaigns: 1,
        avgPayout: 35,
      },
    ],
    featuredCreators: [
      CREATORS.marco,
      CREATORS.james,
      CREATORS.alex,
      CREATORS.dev,
    ],
    recentVisits: makeVisits(
      "crown-heights",
      ["Gloria's Caribbean Cuisine", "Ginger & Lemon", "Café Erzulie"],
      ["Jerk Chicken Story", "Morning Ritual", "Caribbean Brunch"],
    ),
    nearbyNeighborhoods: ["prospect-heights", "bedford-stuyvesant", "flatbush"],
  },

  {
    slug: "bedford-stuyvesant",
    name: "Bedford-Stuyvesant",
    borough: "Brooklyn",
    description:
      "Bed-Stuy do or die — the neighborhood's motto captures something real about its character: a fierce, uncompromising pride in its identity and history. The largest historic district in New York City, Bed-Stuy's brownstone blocks are among the most beautiful in Brooklyn, and the neighborhood has successfully maintained its cultural identity through multiple waves of change. Fulton Street and Nostrand Avenue are the commercial hearts: a mix of longtime local businesses and newer establishments that have been welcomed when they demonstrate genuine community commitment. Push launched in Bed-Stuy through partnerships with Black-owned businesses who wanted creator marketing that drove neighborhood-first foot traffic. The community responded — Bed-Stuy now has some of Push's strongest engagement metrics in Brooklyn. Campaigns here work because they're built on trust: creators who live in the neighborhood, documenting businesses they actually support.",
    lat: 40.6872,
    lng: -73.9418,
    stats: {
      totalVerifiedVisits: 2203,
      activeCampaigns: 18,
      activeCreators: 83,
      activeMerchants: 23,
      topCategory: "Food & Drink",
      avgPayout: 34,
    },
    featuredMerchants: [
      {
        id: "m-bsuy-1",
        name: "Peaches HotHouse",
        category: "Food & Drink",
        address: "415 Tompkins Ave, Brooklyn, NY 11216",
        activeCampaigns: 2,
        avgPayout: 35,
      },
      {
        id: "m-bsuy-2",
        name: "Do or Dine",
        category: "Food & Drink",
        address: "1108 Bedford Ave, Brooklyn, NY 11216",
        activeCampaigns: 1,
        avgPayout: 50,
      },
      {
        id: "m-bsuy-3",
        name: "Ode to Babel",
        category: "Coffee",
        address: "397 Lewis Ave, Brooklyn, NY 11233",
        activeCampaigns: 2,
        avgPayout: 0,
      },
    ],
    featuredCreators: [
      CREATORS.marco,
      CREATORS.james,
      CREATORS.priya,
      CREATORS.maya,
    ],
    recentVisits: makeVisits(
      "bedford-stuyvesant",
      ["Peaches HotHouse", "Do or Dine", "Ode to Babel"],
      ["Southern Comfort", "Neighborhood Dinner", "Community Coffee"],
    ),
    nearbyNeighborhoods: ["williamsburg", "crown-heights", "bushwick"],
  },

  {
    slug: "prospect-heights",
    name: "Prospect Heights",
    borough: "Brooklyn",
    description:
      "Prospect Heights sits between Park Slope and Crown Heights, borrowing the best qualities of both — the leafy residential streets and dining quality of the former, the cultural diversity and energy of the latter. Vanderbilt Avenue is the neighborhood's restaurant row, dense with destination dining that draws from across Brooklyn and Manhattan. The Brooklyn Museum and Brooklyn Botanic Garden anchor the neighborhood's cultural life, making it a consistent weekend destination for visitors. Barclays Center on its western edge adds an events-driven economy: pre- and post-concert dining and bar campaigns are a Push specialty here. The neighborhood has a concentrated creative community — designers, writers, filmmakers — who are active Push creators. Campaign content from Prospect Heights consistently outperforms city averages for save rates and shares, reflecting the high quality of the creator community and the photogenic nature of the neighborhood's dining establishments.",
    lat: 40.6771,
    lng: -73.9638,
    stats: {
      totalVerifiedVisits: 2489,
      activeCampaigns: 20,
      activeCreators: 91,
      activeMerchants: 26,
      topCategory: "Food & Drink",
      avgPayout: 52,
    },
    featuredMerchants: [
      {
        id: "m-ph-1",
        name: "Oxalis",
        category: "Food & Drink",
        address: "791 Washington Ave, Brooklyn, NY 11238",
        activeCampaigns: 1,
        avgPayout: 100,
      },
      {
        id: "m-ph-2",
        name: "Olmsted",
        category: "Food & Drink",
        address: "659 Vanderbilt Ave, Brooklyn, NY 11238",
        activeCampaigns: 2,
        avgPayout: 85,
      },
      {
        id: "m-ph-3",
        name: "Bar Chord",
        category: "Nightlife",
        address: "1008 Cortelyou Rd, Brooklyn, NY 11218",
        activeCampaigns: 1,
        avgPayout: 45,
      },
    ],
    featuredCreators: [
      CREATORS.james,
      CREATORS.sara,
      CREATORS.jasmine,
      CREATORS.priya,
    ],
    recentVisits: makeVisits(
      "prospect-heights",
      ["Oxalis", "Olmsted", "Bar Chord"],
      ["Tasting Menu Night", "Garden Brunch", "Bar Night"],
    ),
    nearbyNeighborhoods: ["park-slope", "crown-heights", "flatbush"],
  },

  // ── QUEENS ────────────────────────────────────────────────────────────────

  {
    slug: "astoria",
    name: "Astoria",
    borough: "Queens",
    description:
      "Astoria is Queens at its most accessible — a densely residential neighborhood with an extraordinary culinary diversity born of successive immigrant communities. The Greek presence is still felt along 31st Street, where tavernas and pastry shops have operated for generations. But Astoria's dining scene now spans Bangladeshi, Egyptian, Brazilian, Mexican, Tibetan, and a dozen other culinary traditions within a few blocks of each other. Steinway Street is the commercial main street; Broadway runs parallel with a more residential character. Push operates in Astoria with strong performance in food and coffee categories — the neighborhood's residents are loyal local supporters of neighborhood businesses, and creator campaigns that feel genuine rather than promotional resonate deeply. The neighborhood's proximity to Manhattan (20 minutes by N or W train) makes it attractive for content creators based in the city who want authentic, less-crowded settings for campaign content.",
    lat: 40.7721,
    lng: -73.9302,
    stats: {
      totalVerifiedVisits: 2876,
      activeCampaigns: 23,
      activeCreators: 106,
      activeMerchants: 30,
      topCategory: "Food & Drink",
      avgPayout: 35,
    },
    featuredMerchants: [
      {
        id: "m-ast-1",
        name: "Taverna Kyclades",
        category: "Food & Drink",
        address: "33-07 Ditmars Blvd, Astoria, NY 11105",
        activeCampaigns: 1,
        avgPayout: 50,
      },
      {
        id: "m-ast-2",
        name: "Astoria Coffee",
        category: "Coffee",
        address: "30-04 30th St, Astoria, NY 11102",
        activeCampaigns: 2,
        avgPayout: 0,
      },
      {
        id: "m-ast-3",
        name: "Butcher Bar",
        category: "Food & Drink",
        address: "37-08 30th Ave, Astoria, NY 11103",
        activeCampaigns: 2,
        avgPayout: 45,
      },
    ],
    featuredCreators: [
      CREATORS.alex,
      CREATORS.maya,
      CREATORS.marco,
      CREATORS.dev,
    ],
    recentVisits: makeVisits(
      "astoria",
      ["Taverna Kyclades", "Astoria Coffee", "Butcher Bar"],
      ["Greek Seafood Night", "Morning Ritual", "Smoked Meat Feature"],
    ),
    nearbyNeighborhoods: ["long-island-city", "jackson-heights", "sunnyside"],
  },

  {
    slug: "jackson-heights",
    name: "Jackson Heights",
    borough: "Queens",
    description:
      "Jackson Heights is the most ethnically diverse urban neighborhood on Earth — a designation backed by census data and confirmed by every block of Roosevelt Avenue and 74th Street. The neighborhood's South Asian, South American, Mexican, and Tibetan communities have created a culinary landscape of staggering richness within a compact geographic footprint. Momos from Tibet, birria from Jalisco, biryani from Hyderabad, empanadas from Ecuador, and Chinese bubble tea coexist within a ten-minute walk. Push launched in Jackson Heights because its merchants represent exactly the kind of authentic, community-rooted businesses that creator marketing can serve without distorting. Campaign content here captures something genuine: the lived experience of one of New York's most vital neighborhoods. Average campaign payouts are lower than wealthier neighborhoods, but engagement rates are consistently among Push's highest — an audience that cares.",
    lat: 40.7498,
    lng: -73.8918,
    stats: {
      totalVerifiedVisits: 1876,
      activeCampaigns: 15,
      activeCreators: 68,
      activeMerchants: 19,
      topCategory: "Food & Drink",
      avgPayout: 28,
    },
    featuredMerchants: [
      {
        id: "m-jh-1",
        name: "Patel Brothers",
        category: "Specialty Food",
        address: "37-27 74th St, Jackson Heights, NY 11372",
        activeCampaigns: 1,
        avgPayout: 25,
      },
      {
        id: "m-jh-2",
        name: "Himalayan Yak",
        category: "Food & Drink",
        address: "72-20 Roosevelt Ave, Jackson Heights, NY 11372",
        activeCampaigns: 2,
        avgPayout: 30,
      },
      {
        id: "m-jh-3",
        name: "Arepa Lady",
        category: "Food & Drink",
        address: "77-17 37th Ave, Jackson Heights, NY 11372",
        activeCampaigns: 1,
        avgPayout: 25,
      },
    ],
    featuredCreators: [
      CREATORS.marco,
      CREATORS.alex,
      CREATORS.priya,
      CREATORS.dev,
    ],
    recentVisits: makeVisits(
      "jackson-heights",
      ["Patel Brothers", "Himalayan Yak", "Arepa Lady"],
      ["Grocery Story", "Momo Feature", "Street Food Night"],
    ),
    nearbyNeighborhoods: ["astoria", "flushing", "sunnyside"],
  },

  {
    slug: "flushing",
    name: "Flushing",
    borough: "Queens",
    description:
      "Flushing is the beating heart of Chinese American culture in New York — a neighborhood that rivals the size and density of Chinatowns in any global city. Main Street is the artery of a commercial district that extends for dozens of blocks, with Cantonese, Mandarin, Taiwanese, Korean, and Japanese businesses packed into a dense urban grid. The food scene is world-class: soup dumplings, Peking duck, hand-pulled noodles, and a food court in the basement of the New World Mall that is one of the best eating experiences in New York City. Push campaigns in Flushing primarily serve the neighborhood's own residents — the platform here is a local tool, not a tourist driver. Merchants appreciate Push's QR verification model because it provides concrete ROI data that supports their business decision-making. Creator content in Flushing showcases authentic food culture with a level of specificity and accuracy that visitors from outside the community often cannot replicate.",
    lat: 40.7675,
    lng: -73.833,
    stats: {
      totalVerifiedVisits: 2547,
      activeCampaigns: 20,
      activeCreators: 93,
      activeMerchants: 27,
      topCategory: "Food & Drink",
      avgPayout: 31,
    },
    featuredMerchants: [
      {
        id: "m-fl-1",
        name: "Joe's Shanghai",
        category: "Food & Drink",
        address: "136-21 37th Ave, Flushing, NY 11354",
        activeCampaigns: 2,
        avgPayout: 35,
      },
      {
        id: "m-fl-2",
        name: "New World Mall Food Court",
        category: "Food & Drink",
        address: "136-20 Roosevelt Ave, Flushing, NY 11354",
        activeCampaigns: 3,
        avgPayout: 25,
      },
      {
        id: "m-fl-3",
        name: "Happy Garden",
        category: "Food & Drink",
        address: "135-25 40th Rd, Flushing, NY 11354",
        activeCampaigns: 1,
        avgPayout: 30,
      },
    ],
    featuredCreators: [
      CREATORS.maya,
      CREATORS.alex,
      CREATORS.priya,
      CREATORS.james,
    ],
    recentVisits: makeVisits(
      "flushing",
      ["Joe's Shanghai", "New World Mall Food Court", "Happy Garden"],
      ["Soup Dumpling Story", "Food Court Tour", "Dim Sum Sunday"],
    ),
    nearbyNeighborhoods: ["jackson-heights", "astoria", "jamaica"],
  },

  {
    slug: "long-island-city",
    name: "Long Island City",
    borough: "Queens",
    description:
      "Long Island City has transformed faster than perhaps any neighborhood in New York over the past two decades — from industrial wasteland to a waterfront district of luxury towers, corporate offices, and a surprisingly vibrant arts and dining scene. The view of the Manhattan skyline from Hunter's Point South Park is one of the best in the city, and the neighborhood's MoMA PS1 branch is a world-class contemporary art institution. Push operates in LIC with a mix of residential dining campaigns and the growing brunch and café scene that serves the neighborhood's younger professional population. The neighborhood's waterfront parks make it an unusual setting for campaign content — outdoor dining, weekend picnics, and waterfront bars provide a visual language distinct from any other Queens neighborhood. Creator campaigns in LIC tend toward lifestyle and food categories, with fitness studios serving the building-heavy residential blocks also running consistent Push campaigns.",
    lat: 40.7447,
    lng: -73.9485,
    stats: {
      totalVerifiedVisits: 2134,
      activeCampaigns: 17,
      activeCreators: 79,
      activeMerchants: 22,
      topCategory: "Lifestyle",
      avgPayout: 48,
    },
    featuredMerchants: [
      {
        id: "m-lic-1",
        name: "Sweetleaf Coffee LIC",
        category: "Coffee",
        address: "10-93 Jackson Ave, Long Island City, NY 11101",
        activeCampaigns: 2,
        avgPayout: 0,
      },
      {
        id: "m-lic-2",
        name: "Dutch Kills Bar",
        category: "Nightlife",
        address: "27-24 Jackson Ave, Long Island City, NY 11101",
        activeCampaigns: 1,
        avgPayout: 60,
      },
      {
        id: "m-lic-3",
        name: "Casa Enrique",
        category: "Food & Drink",
        address: "5-48 49th Ave, Long Island City, NY 11101",
        activeCampaigns: 2,
        avgPayout: 55,
      },
    ],
    featuredCreators: [
      CREATORS.priya,
      CREATORS.dev,
      CREATORS.alex,
      CREATORS.marco,
    ],
    recentVisits: makeVisits(
      "long-island-city",
      ["Sweetleaf Coffee", "Dutch Kills Bar", "Casa Enrique"],
      ["Morning Ritual", "Craft Cocktail Night", "Mexican Sunday"],
    ),
    nearbyNeighborhoods: ["astoria", "greenpoint", "sunnyside"],
  },

  // ── BRONX ────────────────────────────────────────────────────────────────

  {
    slug: "fordham",
    name: "Fordham",
    borough: "Bronx",
    description:
      "Fordham is the Bronx's most active commercial neighborhood — anchored by Fordham University and the massive Fordham Road shopping corridor that stretches across the borough's midsection. The neighborhood's energy is entirely its own: dense, kinetic, focused on practical commerce and community life rather than culinary tourism. Push arrived in Fordham through relationships with Bronx-based creators who wanted a platform that would drive foot traffic to neighborhood businesses rather than sending Bronx residents to spend in Manhattan or Brooklyn. The results have been meaningful: verified visit data shows that Push campaigns in Fordham genuinely circulate within the neighborhood, supporting the local economy in ways that more aspirational campaigns elsewhere do not. Category focus: Dominican, Puerto Rican, and Caribbean food; barbershops; and the growing number of specialty coffee and dessert shops that have opened on Arthur Avenue and its surrounding streets.",
    lat: 40.8617,
    lng: -73.9017,
    stats: {
      totalVerifiedVisits: 1654,
      activeCampaigns: 13,
      activeCreators: 59,
      activeMerchants: 17,
      topCategory: "Food & Drink",
      avgPayout: 28,
    },
    featuredMerchants: [
      {
        id: "m-ford-1",
        name: "Mario's Restaurant",
        category: "Food & Drink",
        address: "2342 Arthur Ave, Bronx, NY 10458",
        activeCampaigns: 1,
        avgPayout: 40,
      },
      {
        id: "m-ford-2",
        name: "Artie's Deli",
        category: "Food & Drink",
        address: "394 City Island Ave, Bronx, NY 10464",
        activeCampaigns: 1,
        avgPayout: 25,
      },
      {
        id: "m-ford-3",
        name: "Zero Otto Nove",
        category: "Food & Drink",
        address: "2357 Arthur Ave, Bronx, NY 10458",
        activeCampaigns: 2,
        avgPayout: 50,
      },
    ],
    featuredCreators: [
      CREATORS.marco,
      CREATORS.alex,
      CREATORS.dev,
      CREATORS.priya,
    ],
    recentVisits: makeVisits(
      "fordham",
      ["Mario's Restaurant", "Artie's Deli", "Zero Otto Nove"],
      ["Italian Sunday", "Deli Feature", "Arthur Ave Story"],
    ),
    nearbyNeighborhoods: ["mott-haven", "south-bronx", "kingsbridge"],
  },

  {
    slug: "mott-haven",
    name: "Mott Haven",
    borough: "Bronx",
    description:
      "Mott Haven sits at the southernmost tip of the Bronx, across the Harlem River from East Harlem, and has become one of New York's most discussed emerging neighborhoods. The neighborhood's Port Morris industrial section, along the East River waterfront, has attracted artists, makers, and a growing number of destination restaurants and bars that have established Mott Haven as a legitimate dining destination for the first time. Push operates here at early-stage density — merchant adoption is growing, and the creator community is enthusiastic about documenting a neighborhood in transition. The South Bronx heritage is present in the neighborhood's character: resilient, community-focused, fiercely proud. Campaigns that honor that identity rather than instrumentalizing the neighborhood's 'emergence narrative' perform best on Push here. Top categories: Latin American food, craft bars, art studios, and fitness.",
    lat: 40.8074,
    lng: -73.9262,
    stats: {
      totalVerifiedVisits: 1234,
      activeCampaigns: 10,
      activeCreators: 46,
      activeMerchants: 13,
      topCategory: "Food & Drink",
      avgPayout: 32,
    },
    featuredMerchants: [
      {
        id: "m-mh-1",
        name: "St. Anns Warehouse",
        category: "Lifestyle",
        address: "29 Jay St, Brooklyn, NY 11201",
        activeCampaigns: 1,
        avgPayout: 45,
      },
      {
        id: "m-mh-2",
        name: "The Bruckner Bar",
        category: "Nightlife",
        address: "1 Bruckner Blvd, Bronx, NY 10454",
        activeCampaigns: 2,
        avgPayout: 35,
      },
      {
        id: "m-mh-3",
        name: "Beatstro",
        category: "Food & Drink",
        address: "428 E 141st St, Bronx, NY 10454",
        activeCampaigns: 1,
        avgPayout: 40,
      },
    ],
    featuredCreators: [
      CREATORS.marco,
      CREATORS.james,
      CREATORS.dev,
      CREATORS.alex,
    ],
    recentVisits: makeVisits(
      "mott-haven",
      ["The Bruckner Bar", "Beatstro", "St. Anns Warehouse"],
      ["Bar Night", "Bronx Dining", "Cultural Space Feature"],
    ),
    nearbyNeighborhoods: ["fordham", "south-bronx", "harlem"],
  },

  // ── MORE MANHATTAN ────────────────────────────────────────────────────────

  {
    slug: "tribeca",
    name: "Tribeca",
    borough: "Manhattan",
    description:
      "Tribeca — the Triangle Below Canal — is Manhattan's most expensive residential neighborhood and home to a restaurant scene that consistently produces James Beard Award winners and the city's most sought-after reservations. The neighborhood's cast-iron loft buildings have been converted into some of the most valuable real estate in the world, and the residents who live here expect (and fund) hospitality of a corresponding quality. The Tribeca Film Festival has given the neighborhood a cultural identity to match its commercial one. Push campaigns in Tribeca operate at the premium end of the platform's market — merchants here are selective about creator partnerships, preferring quality and fit over reach metrics. Average campaign payouts are among Push's highest. Creators who work in Tribeca typically have established portfolios and a visual aesthetic that matches the neighborhood's refined character.",
    lat: 40.7195,
    lng: -74.0089,
    stats: {
      totalVerifiedVisits: 2788,
      activeCampaigns: 22,
      activeCreators: 101,
      activeMerchants: 29,
      topCategory: "Food & Drink",
      avgPayout: 82,
    },
    featuredMerchants: [
      {
        id: "m-trib-1",
        name: "Nobu New York",
        category: "Food & Drink",
        address: "105 Hudson St, New York, NY 10013",
        activeCampaigns: 1,
        avgPayout: 150,
      },
      {
        id: "m-trib-2",
        name: "Locanda Verde",
        category: "Food & Drink",
        address: "377 Greenwich St, New York, NY 10013",
        activeCampaigns: 2,
        avgPayout: 90,
      },
      {
        id: "m-trib-3",
        name: "Frenchette",
        category: "Food & Drink",
        address: "241 W Broadway, New York, NY 10013",
        activeCampaigns: 1,
        avgPayout: 100,
      },
    ],
    featuredCreators: [
      CREATORS.sara,
      CREATORS.jasmine,
      CREATORS.james,
      CREATORS.priya,
    ],
    recentVisits: makeVisits(
      "tribeca",
      ["Nobu New York", "Locanda Verde", "Frenchette"],
      ["Japanese Omakase", "Italian Brunch", "French Bistro Night"],
    ),
    nearbyNeighborhoods: ["soho", "financial-district", "west-village"],
  },

  {
    slug: "nolita",
    name: "Nolita",
    borough: "Manhattan",
    description:
      "Nolita — North of Little Italy — is one of Manhattan's smallest and most charming neighborhoods: a compact grid of cobblestone streets between SoHo and the Lower East Side where independent boutiques, café terraces, and neighborhood restaurants thrive in a pedestrian-scaled environment. Mulberry Street is the spine: a succession of outdoor dining spaces that fill from late morning through midnight in warmer months. The neighborhood has a strong Italian-American heritage that still shows in some of its restaurants, but Nolita today is more accurately described as New York's boutique shopping village — a place where emerging designers, vintage dealers, and concept stores cluster in storefronts that were once social clubs and pharmacies. Push campaigns in Nolita lean heavily toward fashion and lifestyle, with brunch and café campaigns providing a consistent secondary category. The neighborhood's scale makes it exceptional for creator content — everything is walkable, photogenic, and within a few blocks.",
    lat: 40.7212,
    lng: -73.9959,
    stats: {
      totalVerifiedVisits: 2341,
      activeCampaigns: 19,
      activeCreators: 88,
      activeMerchants: 24,
      topCategory: "Fashion",
      avgPayout: 58,
    },
    featuredMerchants: [
      {
        id: "m-nol-1",
        name: "Prince Street Pizza",
        category: "Food & Drink",
        address: "27 Prince St, New York, NY 10012",
        activeCampaigns: 1,
        avgPayout: 25,
      },
      {
        id: "m-nol-2",
        name: "Café Select",
        category: "Food & Drink",
        address: "212 Lafayette St, New York, NY 10012",
        activeCampaigns: 2,
        avgPayout: 50,
      },
      {
        id: "m-nol-3",
        name: "A.P.C. Nolita",
        category: "Fashion",
        address: "262 Mott St, New York, NY 10012",
        activeCampaigns: 2,
        avgPayout: 80,
      },
    ],
    featuredCreators: [
      CREATORS.jasmine,
      CREATORS.sara,
      CREATORS.james,
      CREATORS.alex,
    ],
    recentVisits: makeVisits(
      "nolita",
      ["Prince Street Pizza", "Café Select", "A.P.C. Nolita"],
      ["Pizza Square Story", "Café Morning", "Spring Collection"],
    ),
    nearbyNeighborhoods: ["soho", "lower-east-side", "chinatown"],
  },

  {
    slug: "chinatown",
    name: "Chinatown",
    borough: "Manhattan",
    description:
      "Manhattan's Chinatown is one of the oldest and most densely populated Chinese communities in the Western Hemisphere — a neighborhood that has maintained its character through waves of change that have transformed every surrounding area. Canal Street and Mott Street are the commercial arteries: fish markets, produce vendors, bakeries, dim sum halls, and herbal medicine shops operating at a pace and density that feels more like Hong Kong than Manhattan. The dining options are extraordinary in value and variety — some of the best food in New York City at prices that feel like a different city. Push campaigns in Chinatown serve a predominantly local audience and are calibrated accordingly: campaign payouts are lower, but the foot traffic verification model is highly valued by merchants who have historically had limited access to measurable marketing tools. Creator campaigns that document Chinatown authentically — the market culture, the food, the social fabric — perform best on the platform.",
    lat: 40.7158,
    lng: -73.997,
    stats: {
      totalVerifiedVisits: 2109,
      activeCampaigns: 17,
      activeCreators: 76,
      activeMerchants: 21,
      topCategory: "Food & Drink",
      avgPayout: 27,
    },
    featuredMerchants: [
      {
        id: "m-ct-1",
        name: "Nom Wah Tea Parlor",
        category: "Food & Drink",
        address: "13 Doyers St, New York, NY 10013",
        activeCampaigns: 1,
        avgPayout: 30,
      },
      {
        id: "m-ct-2",
        name: "Xi'an Famous Foods",
        category: "Food & Drink",
        address: "81 St Marks Pl, New York, NY 10003",
        activeCampaigns: 2,
        avgPayout: 25,
      },
      {
        id: "m-ct-3",
        name: "Fong On",
        category: "Specialty Food",
        address: "81 Division St, New York, NY 10002",
        activeCampaigns: 1,
        avgPayout: 20,
      },
    ],
    featuredCreators: [
      CREATORS.maya,
      CREATORS.alex,
      CREATORS.priya,
      CREATORS.marco,
    ],
    recentVisits: makeVisits(
      "chinatown",
      ["Nom Wah Tea Parlor", "Xi'an Famous Foods", "Fong On"],
      ["Dim Sum Morning", "Hand-Pulled Noodles", "Tofu Shop Story"],
    ),
    nearbyNeighborhoods: ["lower-east-side", "nolita", "financial-district"],
  },

  {
    slug: "upper-east-side",
    name: "Upper East Side",
    borough: "Manhattan",
    description:
      "The Upper East Side is Manhattan's most traditional luxury residential neighborhood — a long corridor between Central Park and the East River from 59th to 96th Street, defined by its prewar apartment buildings, private schools, and the Museum Mile that runs along Fifth Avenue. The neighborhood's commercial character on Madison Avenue leans toward high-end fashion, art galleries, and refined restaurants that serve a clientele with sophisticated tastes and limited patience for hype. Lexington and Third Avenues provide a more accessible commercial strip for the neighborhood's residents. Push campaigns on the Upper East Side are calibrated for the neighborhood's demographics: family-friendly dining, fitness studios, beauty services, and the occasional luxury retail activation. The neighborhood's creator community is smaller than Downtown or Brooklyn markets, but highly engaged and well-connected to the spending power that makes campaigns here commercially meaningful.",
    lat: 40.7736,
    lng: -73.9566,
    stats: {
      totalVerifiedVisits: 2234,
      activeCampaigns: 18,
      activeCreators: 82,
      activeMerchants: 23,
      topCategory: "Fitness",
      avgPayout: 61,
    },
    featuredMerchants: [
      {
        id: "m-ues-1",
        name: "Sant Ambroeus UES",
        category: "Food & Drink",
        address: "1000 Madison Ave, New York, NY 10075",
        activeCampaigns: 2,
        avgPayout: 80,
      },
      {
        id: "m-ues-2",
        name: "Bemelmans Bar",
        category: "Nightlife",
        address: "35 E 76th St, New York, NY 10021",
        activeCampaigns: 1,
        avgPayout: 120,
      },
      {
        id: "m-ues-3",
        name: "Candle 79",
        category: "Food & Drink",
        address: "154 E 79th St, New York, NY 10075",
        activeCampaigns: 1,
        avgPayout: 65,
      },
    ],
    featuredCreators: [
      CREATORS.sara,
      CREATORS.jasmine,
      CREATORS.priya,
      CREATORS.james,
    ],
    recentVisits: makeVisits(
      "upper-east-side",
      ["Sant Ambroeus UES", "Bemelmans Bar", "Candle 79"],
      ["Italian Espresso", "Classic Bar Night", "Vegan Dinner"],
    ),
    nearbyNeighborhoods: ["upper-west-side", "harlem", "midtown"],
  },

  {
    slug: "midtown",
    name: "Midtown",
    borough: "Manhattan",
    description:
      "Midtown Manhattan is the commercial engine of the world — the concentration of corporate headquarters, hotels, theaters, and tourist attractions that makes New York the global city it is. For Push, Midtown presents a unique challenge: it's vast, transient, and dominated by chains and tourist-trap restaurants that don't fit the platform's model. But within Midtown, pockets of genuine local commerce thrive — the Korean restaurant corridor in Koreatown around 32nd Street, the Hell's Kitchen dining strip on 9th Avenue, the lunch-focused independent restaurants that serve the office workers who actually live nearby. Push campaigns in Midtown work best in these sub-corridors, not in the generic tourist zones. The platform's QR verification model is particularly valuable here because Midtown's merchant community has historically struggled to differentiate locals from tourists and to measure the actual value of social media content.",
    lat: 40.7549,
    lng: -73.984,
    stats: {
      totalVerifiedVisits: 3876,
      activeCampaigns: 31,
      activeCreators: 143,
      activeMerchants: 41,
      topCategory: "Food & Drink",
      avgPayout: 44,
    },
    featuredMerchants: [
      {
        id: "m-mid-1",
        name: "Koreatown BBQ Row",
        category: "Food & Drink",
        address: "32 W 32nd St, New York, NY 10001",
        activeCampaigns: 3,
        avgPayout: 40,
      },
      {
        id: "m-mid-2",
        name: "Le Bernardin",
        category: "Food & Drink",
        address: "155 W 51st St, New York, NY 10019",
        activeCampaigns: 1,
        avgPayout: 150,
      },
      {
        id: "m-mid-3",
        name: "Nom Wah Knish",
        category: "Food & Drink",
        address: "8 Mott St, New York, NY 10013",
        activeCampaigns: 1,
        avgPayout: 20,
      },
    ],
    featuredCreators: [
      CREATORS.james,
      CREATORS.maya,
      CREATORS.jasmine,
      CREATORS.sara,
    ],
    recentVisits: makeVisits(
      "midtown",
      ["Koreatown BBQ Row", "Le Bernardin", "Nom Wah Knish"],
      ["KBBQ Night", "Fine Dining Feature", "Lunch Spot"],
    ),
    nearbyNeighborhoods: ["chelsea", "flatiron", "upper-west-side"],
  },

  // ── MORE BROOKLYN ────────────────────────────────────────────────────────

  {
    slug: "carroll-gardens",
    name: "Carroll Gardens",
    borough: "Brooklyn",
    description:
      "Carroll Gardens is South Brooklyn's quiet overachiever — a neighborhood of deep front yards, Italian-American delis, and some of Brooklyn's most respected restaurants tucked into brownstone blocks a few steps from the BQE. Court Street and Smith Street are the commercial main streets, lined with restaurants that have maintained decades-long reputations through quality rather than marketing. The neighborhood's old-school character — the bocce courts, the pork stores, the social clubs — coexists with a new generation of coffee shops and wine bars that have arrived without displacing the originals. Push campaigns in Carroll Gardens perform best in food and beverage categories, driven by a loyal residential customer base that shops and dines locally by habit and preference. The neighborhood's proximity to Cobble Hill, Red Hook, and Gowanus gives Push creators access to a cluster of compelling neighborhoods from a single base.",
    lat: 40.6771,
    lng: -73.9994,
    stats: {
      totalVerifiedVisits: 1876,
      activeCampaigns: 15,
      activeCreators: 68,
      activeMerchants: 19,
      topCategory: "Food & Drink",
      avgPayout: 44,
    },
    featuredMerchants: [
      {
        id: "m-cg-1",
        name: "Frankie's 457 Spuntino",
        category: "Food & Drink",
        address: "457 Court St, Brooklyn, NY 11231",
        activeCampaigns: 1,
        avgPayout: 60,
      },
      {
        id: "m-cg-2",
        name: "Lucali",
        category: "Food & Drink",
        address: "575 Henry St, Brooklyn, NY 11231",
        activeCampaigns: 1,
        avgPayout: 50,
      },
      {
        id: "m-cg-3",
        name: "Palo Santo",
        category: "Food & Drink",
        address: "652 Union St, Brooklyn, NY 11215",
        activeCampaigns: 2,
        avgPayout: 55,
      },
    ],
    featuredCreators: [
      CREATORS.marco,
      CREATORS.maya,
      CREATORS.priya,
      CREATORS.alex,
    ],
    recentVisits: makeVisits(
      "carroll-gardens",
      ["Frankie's 457", "Lucali", "Palo Santo"],
      ["Italian Sunday", "Best Pizza BK", "Latin Dinner"],
    ),
    nearbyNeighborhoods: ["park-slope", "cobble-hill", "red-hook"],
  },

  {
    slug: "red-hook",
    name: "Red Hook",
    borough: "Brooklyn",
    description:
      "Red Hook sits alone at the western edge of Brooklyn, separated from the rest of the borough by the BQE and accessible only by bus, ferry, or the determination to walk. Its isolation has been its defining quality — a neighborhood that resisted the standard gentrification playbook and instead developed its own distinct identity around waterfront industry, art studios, and a food culture that has made destinations of its best establishments. The Fairway Market, Hometown BBQ, and Fort Defiance are among the restaurants and shops that have drawn visitors willing to make the journey. Push operates in Red Hook as a genuinely community-first platform — the neighborhood's merchants appreciate that the QR model verifies that campaign-driven visits actually happen rather than relying on assumed reach. Creative campaigns here tend to be slightly more experimental than in more central neighborhoods, reflecting the character of both the merchants and the creators who operate here.",
    lat: 40.676,
    lng: -74.0089,
    stats: {
      totalVerifiedVisits: 1543,
      activeCampaigns: 12,
      activeCreators: 55,
      activeMerchants: 16,
      topCategory: "Food & Drink",
      avgPayout: 42,
    },
    featuredMerchants: [
      {
        id: "m-rh-1",
        name: "Hometown Bar-B-Que",
        category: "Food & Drink",
        address: "454 Van Brunt St, Brooklyn, NY 11231",
        activeCampaigns: 2,
        avgPayout: 45,
      },
      {
        id: "m-rh-2",
        name: "Fort Defiance",
        category: "Food & Drink",
        address: "365 Van Brunt St, Brooklyn, NY 11231",
        activeCampaigns: 1,
        avgPayout: 55,
      },
      {
        id: "m-rh-3",
        name: "Added Value Farm",
        category: "Specialty Food",
        address: "543 Columbia St, Brooklyn, NY 11231",
        activeCampaigns: 1,
        avgPayout: 0,
      },
    ],
    featuredCreators: [
      CREATORS.alex,
      CREATORS.marco,
      CREATORS.dev,
      CREATORS.james,
    ],
    recentVisits: makeVisits(
      "red-hook",
      ["Hometown Bar-B-Que", "Fort Defiance", "Added Value Farm"],
      ["BBQ Feature", "Sunday Brunch", "Farm Story"],
    ),
    nearbyNeighborhoods: ["carroll-gardens", "park-slope", "gowanus"],
  },

  // ── STATEN ISLAND ────────────────────────────────────────────────────────

  {
    slug: "st-george",
    name: "St. George",
    borough: "Staten Island",
    description:
      "St. George is Staten Island's most dynamic neighborhood — the ferry terminal district that connects the borough to Manhattan and has become the hub of Staten Island's creative and culinary renaissance. The area around the ferry terminal has attracted independent restaurants, coffee shops, and arts organizations that have given St. George a distinct neighborhood identity for the first time. The Staten Island Museum, the Snug Harbor Cultural Center nearby, and the waterfront parks provide a cultural infrastructure that supports a growing creative economy. Push arrived in St. George through the advocacy of local merchants who wanted access to the creator marketing infrastructure that Manhattan and Brooklyn businesses had been using for years. The platform's penetration on Staten Island is growing rapidly — QR verification data shows that St. George campaigns consistently drive genuine foot traffic from both Staten Island residents and ferry commuters from Manhattan.",
    lat: 40.6437,
    lng: -74.0739,
    stats: {
      totalVerifiedVisits: 987,
      activeCampaigns: 8,
      activeCreators: 36,
      activeMerchants: 11,
      topCategory: "Food & Drink",
      avgPayout: 33,
    },
    featuredMerchants: [
      {
        id: "m-sg-1",
        name: "Flagship Brewery",
        category: "Nightlife",
        address: "40 Minthorne St, Staten Island, NY 10301",
        activeCampaigns: 2,
        avgPayout: 40,
      },
      {
        id: "m-sg-2",
        name: "Vida",
        category: "Food & Drink",
        address: "381 Van Duzer St, Staten Island, NY 10304",
        activeCampaigns: 1,
        avgPayout: 50,
      },
      {
        id: "m-sg-3",
        name: "Killmeyer's Old Bavaria Inn",
        category: "Food & Drink",
        address: "4254 Arthur Kill Rd, Staten Island, NY 10309",
        activeCampaigns: 1,
        avgPayout: 40,
      },
    ],
    featuredCreators: [
      CREATORS.dev,
      CREATORS.marco,
      CREATORS.alex,
      CREATORS.priya,
    ],
    recentVisits: makeVisits(
      "st-george",
      ["Flagship Brewery", "Vida", "Killmeyer's"],
      ["Craft Beer Launch", "Weekend Dinner", "German Bar Feature"],
    ),
    nearbyNeighborhoods: ["fordham", "astoria", "flushing"],
  },

  // ── MORE MANHATTAN/QUEENS ────────────────────────────────────────────────

  {
    slug: "washington-heights",
    name: "Washington Heights",
    borough: "Manhattan",
    description:
      "Washington Heights is upper Manhattan's Dominican Republic — a neighborhood where Spanish is the first language of commerce and the cultural identity is intensely and proudly Caribbean. Broadway through Washington Heights is a continuous Dominican parade of restaurants, bodegas, salons, and social clubs. The neighborhood's food culture centers on mofongo, sancocho, pernil, and the cafecito culture of small Dominican coffee counters. Push arrived in Washington Heights through relationships with Dominican-owned businesses who understood creator marketing as a tool for community commerce rather than external tourism. The platform here is genuinely local: creators who live in the neighborhood documenting businesses that serve the people who live there. The results are authentic content that resonates powerfully within the community and, increasingly, with broader New York audiences discovering one of the city's most vibrant and under-documented food cultures.",
    lat: 40.8448,
    lng: -73.9392,
    stats: {
      totalVerifiedVisits: 1876,
      activeCampaigns: 15,
      activeCreators: 68,
      activeMerchants: 19,
      topCategory: "Food & Drink",
      avgPayout: 29,
    },
    featuredMerchants: [
      {
        id: "m-wh-1",
        name: "La Casa Del Mofongo",
        category: "Food & Drink",
        address: "1447 St Nicholas Ave, New York, NY 10033",
        activeCampaigns: 2,
        avgPayout: 30,
      },
      {
        id: "m-wh-2",
        name: "Malecon Restaurant",
        category: "Food & Drink",
        address: "764 Amsterdam Ave, New York, NY 10025",
        activeCampaigns: 1,
        avgPayout: 35,
      },
      {
        id: "m-wh-3",
        name: "Cachapas y Mas",
        category: "Food & Drink",
        address: "8314 Broadway, Elmhurst, NY 11373",
        activeCampaigns: 2,
        avgPayout: 25,
      },
    ],
    featuredCreators: [
      CREATORS.marco,
      CREATORS.alex,
      CREATORS.dev,
      CREATORS.james,
    ],
    recentVisits: makeVisits(
      "washington-heights",
      ["La Casa Del Mofongo", "Malecon Restaurant", "Cachapas y Mas"],
      ["Mofongo Story", "Dominican Sunday", "Cachapa Feature"],
    ),
    nearbyNeighborhoods: ["harlem", "upper-west-side", "inwood"],
  },

  {
    slug: "inwood",
    name: "Inwood",
    borough: "Manhattan",
    description:
      "Inwood occupies the northernmost tip of Manhattan — a neighborhood that feels genuinely separated from the rest of the island by geography and character. Inwood Hill Park, one of Manhattan's last remaining primeval forests with ancient cave formations, defines the western boundary. The neighborhood's commercial strip on Dyckman Street is the social heart of a largely Dominican and Mexican community, with late-night food culture that peaks after midnight. Push operates in Inwood at early-stage density — the neighborhood has been less exposed to creator marketing than areas further south, and the merchant community is in the early stages of understanding the platform's value proposition. Campaign content from Inwood has a distinctive quality: less polished, more documentary, capturing the neighborhood's authentic rhythms rather than performing them for an outside audience.",
    lat: 40.8676,
    lng: -73.9219,
    stats: {
      totalVerifiedVisits: 1102,
      activeCampaigns: 9,
      activeCreators: 41,
      activeMerchants: 12,
      topCategory: "Food & Drink",
      avgPayout: 26,
    },
    featuredMerchants: [
      {
        id: "m-inw-1",
        name: "Dyckman Farmhouse Museum Café",
        category: "Coffee",
        address: "4881 Broadway, New York, NY 10034",
        activeCampaigns: 1,
        avgPayout: 0,
      },
      {
        id: "m-inw-2",
        name: "Coogan's",
        category: "Food & Drink",
        address: "4015 Broadway, New York, NY 10032",
        activeCampaigns: 2,
        avgPayout: 30,
      },
      {
        id: "m-inw-3",
        name: "Carrot Top Pastries",
        category: "Coffee",
        address: "5025 Broadway, New York, NY 10034",
        activeCampaigns: 1,
        avgPayout: 0,
      },
    ],
    featuredCreators: [
      CREATORS.dev,
      CREATORS.marco,
      CREATORS.alex,
      CREATORS.priya,
    ],
    recentVisits: makeVisits(
      "inwood",
      ["Dyckman Farmhouse Café", "Coogan's", "Carrot Top Pastries"],
      ["Historic Café", "Neighborhood Bar", "Bakery Morning"],
    ),
    nearbyNeighborhoods: ["washington-heights", "harlem", "fordham"],
  },

  {
    slug: "gowanus",
    name: "Gowanus",
    borough: "Brooklyn",
    description:
      "Gowanus is Brooklyn's most creative neighborhood per square foot — a former industrial canal district that has become the address for artists, makers, and independent businesses who need space, light, and a community that values original work. The Gowanus Canal, once one of the most polluted bodies of water in the United States and now undergoing a decades-long cleanup, defines the neighborhood's geography and its mythology. The canal's banks have attracted galleries, studios, brewery taprooms, and restaurants that give Gowanus a character unlike any other neighborhood in New York. Push campaigns here skew creative and experiential: brewery launches, gallery openings, studio events, and the handful of exceptional restaurants that have chosen Gowanus for its energy and affordability. The creator community here is disproportionately composed of artists and photographers who bring production values to campaign content that are exceptional even by Push's standards.",
    lat: 40.6726,
    lng: -73.9895,
    stats: {
      totalVerifiedVisits: 1765,
      activeCampaigns: 14,
      activeCreators: 64,
      activeMerchants: 18,
      topCategory: "Nightlife",
      avgPayout: 45,
    },
    featuredMerchants: [
      {
        id: "m-gow-1",
        name: "Threes Brewing",
        category: "Nightlife",
        address: "333 Douglass St, Brooklyn, NY 11217",
        activeCampaigns: 2,
        avgPayout: 45,
      },
      {
        id: "m-gow-2",
        name: "Four & Twenty Blackbirds",
        category: "Coffee",
        address: "439 3rd Ave, Brooklyn, NY 11215",
        activeCampaigns: 1,
        avgPayout: 30,
      },
      {
        id: "m-gow-3",
        name: "Littleneck",
        category: "Food & Drink",
        address: "288 3rd Ave, Brooklyn, NY 11215",
        activeCampaigns: 2,
        avgPayout: 55,
      },
    ],
    featuredCreators: [
      CREATORS.alex,
      CREATORS.james,
      CREATORS.marco,
      CREATORS.dev,
    ],
    recentVisits: makeVisits(
      "gowanus",
      ["Threes Brewing", "Four & Twenty Blackbirds", "Littleneck"],
      ["Craft Beer Tap", "Pie Story", "New England Dinner"],
    ),
    nearbyNeighborhoods: ["park-slope", "carroll-gardens", "red-hook"],
  },

  {
    slug: "flatbush",
    name: "Flatbush",
    borough: "Brooklyn",
    description:
      "Flatbush is one of Brooklyn's most populous and diverse neighborhoods — a sprawling residential district centered on Flatbush Avenue that encompasses Haitian, Caribbean, and West African communities alongside longtime Jewish and Italian-American residents and a growing young professional population. Cortelyou Road has become one of Brooklyn's most vibrant neighborhood commercial strips, with a density of excellent restaurants, coffee shops, and bars that has surprised even longtime Brooklynites. The neighborhood's Prospect Park proximity gives it access to green space that many denser neighborhoods lack. Push campaigns in Flatbush reflect the neighborhood's demographic diversity: Haitian cuisine, Caribbean bakeries, Caribbean rum bars, specialty coffee, and the occasional fine dining establishment that has found its audience among the neighborhood's growing creative class. Campaign content from Flatbush has some of the highest authenticity scores on the platform.",
    lat: 40.6501,
    lng: -73.9496,
    stats: {
      totalVerifiedVisits: 2087,
      activeCampaigns: 17,
      activeCreators: 78,
      activeMerchants: 21,
      topCategory: "Food & Drink",
      avgPayout: 33,
    },
    featuredMerchants: [
      {
        id: "m-flat-1",
        name: "Scoops",
        category: "Coffee",
        address: "1030 Cortelyou Rd, Brooklyn, NY 11218",
        activeCampaigns: 2,
        avgPayout: 0,
      },
      {
        id: "m-flat-2",
        name: "Mimi's Hummus",
        category: "Food & Drink",
        address: "1209 Cortelyou Rd, Brooklyn, NY 11218",
        activeCampaigns: 1,
        avgPayout: 35,
      },
      {
        id: "m-flat-3",
        name: "Rose Water",
        category: "Food & Drink",
        address: "787 Union St, Brooklyn, NY 11215",
        activeCampaigns: 2,
        avgPayout: 55,
      },
    ],
    featuredCreators: [
      CREATORS.marco,
      CREATORS.priya,
      CREATORS.maya,
      CREATORS.alex,
    ],
    recentVisits: makeVisits(
      "flatbush",
      ["Scoops", "Mimi's Hummus", "Rose Water"],
      ["Morning Ritual", "Mediterranean Lunch", "Garden Dinner"],
    ),
    nearbyNeighborhoods: ["crown-heights", "prospect-heights", "park-slope"],
  },
];

// ---------------------------------------------------------------------------
// Lookup helpers
// ---------------------------------------------------------------------------

export function getNeighborhoodBySlug(slug: string): Neighborhood | undefined {
  return NEIGHBORHOODS.find((n) => n.slug === slug);
}

export function getNeighborhoodsByBorough(borough: Borough): Neighborhood[] {
  return NEIGHBORHOODS.filter((n) => n.borough === borough);
}

export const ALL_BOROUGHS: Borough[] = [
  "Manhattan",
  "Brooklyn",
  "Queens",
  "Bronx",
  "Staten Island",
];

export function getNearbyNeighborhoods(slug: string): Neighborhood[] {
  const hood = getNeighborhoodBySlug(slug);
  if (!hood) return [];
  return hood.nearbyNeighborhoods
    .map((s) => getNeighborhoodBySlug(s))
    .filter(Boolean) as Neighborhood[];
}

// Leaderboard: top 5 creators by pushScore in a neighborhood
export function getLocalLeaderboard(hood: Neighborhood): FeaturedCreator[] {
  return [...hood.featuredCreators]
    .sort((a, b) => b.pushScore - a.pushScore)
    .slice(0, 5);
}
