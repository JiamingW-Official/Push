/**
 * mock-profiles.ts
 * 20 mock creator profiles for Push portfolio pages.
 * Used by: portfolio edit view (mock data) + public SSG routes.
 */

export type CreatorTier =
  | "Seed"
  | "Explorer"
  | "Operator"
  | "Proven"
  | "Closer"
  | "Partner";

export interface GalleryItem {
  id: string;
  type: "image" | "video";
  url: string;
  caption: string;
  visible: boolean;
}

export interface PastCampaign {
  id: string;
  brand: string;
  neighborhood: string;
  date: string;
  earnings: number;
  deliveryTime: string;
  verifiedVisits: number;
  visible: boolean;
}

export interface Testimonial {
  id: string;
  merchant: string;
  role: string;
  quote: string;
  rating: number;
}

export interface CreatorProfile {
  id: string;
  handle: string;
  displayName: string;
  neighborhood: string;
  bio: string;
  avatarUrl?: string;
  tier: CreatorTier;
  pushScore: number;
  totalCampaigns: number;
  verifiedVisits: number;
  avgDeliveryTime: string;
  tierScore: number;
  gallery: GalleryItem[];
  pastCampaigns: PastCampaign[];
  testimonials: Testimonial[];
  instagramHandle?: string;
  tiktokHandle?: string;
}

export const MOCK_PROFILES: CreatorProfile[] = [
  {
    id: "maya-eats-nyc",
    handle: "maya-eats-nyc",
    displayName: "Maya Chen",
    neighborhood: "Lower East Side",
    bio: "NYC food & lifestyle creator documenting the city's most compelling dining stories. From hole-in-the-wall dumplings in Chinatown to omakase counters in the West Village — I cover it all with an editorial eye and a genuine appetite.",
    avatarUrl:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=face",
    tier: "Partner",
    pushScore: 94,
    totalCampaigns: 47,
    verifiedVisits: 3840,
    avgDeliveryTime: "18h",
    tierScore: 94,
    gallery: [
      {
        id: "g1",
        type: "image",
        url: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&h=400&fit=crop",
        caption: "Late-night ramen at Chinatown gem",
        visible: true,
      },
      {
        id: "g2",
        type: "image",
        url: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&h=400&fit=crop",
        caption: "Omakase counter, West Village",
        visible: true,
      },
      {
        id: "g3",
        type: "image",
        url: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&h=400&fit=crop",
        caption: "Morning ritual, Williamsburg",
        visible: true,
      },
      {
        id: "g4",
        type: "image",
        url: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=600&h=400&fit=crop",
        caption: "Pizza slice, Greenpoint",
        visible: true,
      },
      {
        id: "g5",
        type: "image",
        url: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=600&h=400&fit=crop",
        caption: "Cocktail hour, East Village",
        visible: true,
      },
      {
        id: "g6",
        type: "image",
        url: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&h=400&fit=crop",
        caption: "Brunch board, Park Slope",
        visible: true,
      },
    ],
    pastCampaigns: [
      {
        id: "c1",
        brand: "Momo Palace",
        neighborhood: "Chinatown",
        date: "2026-03-15",
        earnings: 124,
        deliveryTime: "16h",
        verifiedVisits: 142,
        visible: true,
      },
      {
        id: "c2",
        brand: "Salt & Stone Bar",
        neighborhood: "East Village",
        date: "2026-02-28",
        earnings: 100,
        deliveryTime: "20h",
        verifiedVisits: 98,
        visible: true,
      },
      {
        id: "c3",
        brand: "Harvest Table",
        neighborhood: "Park Slope",
        date: "2026-02-10",
        earnings: 115,
        deliveryTime: "14h",
        verifiedVisits: 187,
        visible: true,
      },
      {
        id: "c4",
        brand: "Dusk Coffee",
        neighborhood: "Williamsburg",
        date: "2026-01-22",
        earnings: 100,
        deliveryTime: "22h",
        verifiedVisits: 110,
        visible: true,
      },
      {
        id: "c5",
        brand: "Lula's Arepa Bar",
        neighborhood: "Astoria",
        date: "2026-01-05",
        earnings: 110,
        deliveryTime: "19h",
        verifiedVisits: 134,
        visible: true,
      },
    ],
    testimonials: [
      {
        id: "t1",
        merchant: "James Park",
        role: "Owner, Momo Palace",
        quote:
          "Maya's content drove real foot traffic. We saw a 40% spike in weekend visitors within 48 hours of her post. Truly professional.",
        rating: 5,
      },
      {
        id: "t2",
        merchant: "Elena Vasquez",
        role: "Marketing, Salt & Stone Bar",
        quote:
          "Exceptional storytelling. She captured our cocktail program better than any creative partner we've worked with.",
        rating: 5,
      },
      {
        id: "t3",
        merchant: "David Ng",
        role: "GM, Harvest Table",
        quote:
          "Fast delivery, authentic voice, and verifiable results. Maya is our go-to creator.",
        rating: 5,
      },
    ],
    instagramHandle: "mayaeatsnyc",
    tiktokHandle: "mayaeatsnyc",
  },
  {
    id: "felix-brooklyn",
    handle: "felix-brooklyn",
    displayName: "Felix Torres",
    neighborhood: "Williamsburg",
    bio: "Williamsburg native. Coffee obsessive. I shoot NYC street food with a documentary approach — no filters, no staging. Just real food, real people, real neighborhoods.",
    avatarUrl:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face",
    tier: "Closer",
    pushScore: 83,
    totalCampaigns: 31,
    verifiedVisits: 2240,
    avgDeliveryTime: "22h",
    tierScore: 83,
    gallery: [
      {
        id: "g1",
        type: "image",
        url: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=600&h=400&fit=crop",
        caption: "Pour-over ritual, Williamsburg",
        visible: true,
      },
      {
        id: "g2",
        type: "image",
        url: "https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=600&h=400&fit=crop",
        caption: "Street taco, Bushwick",
        visible: true,
      },
      {
        id: "g3",
        type: "image",
        url: "https://images.unsplash.com/photo-1482049016688-2d3e1b311543?w=600&h=400&fit=crop",
        caption: "Weekend brunch crowd, Park Slope",
        visible: true,
      },
      {
        id: "g4",
        type: "image",
        url: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=600&h=400&fit=crop",
        caption: "Korean BBQ night, Flushing",
        visible: true,
      },
    ],
    pastCampaigns: [
      {
        id: "c1",
        brand: "Crema & Co.",
        neighborhood: "Williamsburg",
        date: "2026-03-20",
        earnings: 72,
        deliveryTime: "18h",
        verifiedVisits: 94,
        visible: true,
      },
      {
        id: "c2",
        brand: "Taqueria Boyle",
        neighborhood: "Bushwick",
        date: "2026-03-01",
        earnings: 66,
        deliveryTime: "24h",
        verifiedVisits: 78,
        visible: true,
      },
      {
        id: "c3",
        brand: "Han's BBQ",
        neighborhood: "Flushing",
        date: "2026-02-12",
        earnings: 78,
        deliveryTime: "20h",
        verifiedVisits: 115,
        visible: true,
      },
    ],
    testimonials: [
      {
        id: "t1",
        merchant: "Sophie Lam",
        role: "Owner, Crema & Co.",
        quote:
          "Felix understands community. His audience actually showed up — we had a line out the door on Saturday.",
        rating: 5,
      },
      {
        id: "t2",
        merchant: "Marco Reyes",
        role: "Chef, Taqueria Boyle",
        quote:
          "Documentary style, real results. Felix doesn't over-produce — and that authenticity is exactly what our brand needed.",
        rating: 4,
      },
    ],
    instagramHandle: "felixbrooklynshots",
  },
  {
    id: "jess-uptown-bites",
    handle: "jess-uptown-bites",
    displayName: "Jessica Owens",
    neighborhood: "Harlem",
    bio: "Harlem-raised, world-traveled. I create content about Black-owned restaurants, Caribbean cuisine, and soul food traditions in NYC. Every post is a love letter to the neighborhoods that raised me.",
    avatarUrl:
      "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=200&h=200&fit=crop&crop=face",
    tier: "Proven",
    pushScore: 72,
    totalCampaigns: 22,
    verifiedVisits: 1580,
    avgDeliveryTime: "26h",
    tierScore: 72,
    gallery: [
      {
        id: "g1",
        type: "image",
        url: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=600&h=400&fit=crop",
        caption: "Jerk chicken, Harlem",
        visible: true,
      },
      {
        id: "g2",
        type: "image",
        url: "https://images.unsplash.com/photo-1498654896293-37aacf113fd9?w=600&h=400&fit=crop",
        caption: "Soul food Sunday",
        visible: true,
      },
      {
        id: "g3",
        type: "image",
        url: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=600&h=400&fit=crop",
        caption: "Seasonal salad, Upper West Side",
        visible: true,
      },
    ],
    pastCampaigns: [
      {
        id: "c1",
        brand: "Ras's Caribbean Kitchen",
        neighborhood: "Crown Heights",
        date: "2026-03-10",
        earnings: 42,
        deliveryTime: "24h",
        verifiedVisits: 76,
        visible: true,
      },
      {
        id: "c2",
        brand: "Mama's Soul House",
        neighborhood: "Harlem",
        date: "2026-02-18",
        earnings: 37,
        deliveryTime: "28h",
        verifiedVisits: 63,
        visible: true,
      },
      {
        id: "c3",
        brand: "Zora Bistro",
        neighborhood: "Bedford-Stuyvesant",
        date: "2026-01-30",
        earnings: 39,
        deliveryTime: "22h",
        verifiedVisits: 88,
        visible: true,
      },
    ],
    testimonials: [
      {
        id: "t1",
        merchant: "Keisha Douglas",
        role: "Owner, Ras's Caribbean Kitchen",
        quote:
          "Jessica is the real deal. She brought in people we'd never reached before. Authentic community connection.",
        rating: 5,
      },
      {
        id: "t2",
        merchant: "Patricia Wells",
        role: "Founder, Mama's Soul House",
        quote:
          "She tells our story with dignity. The content will live on our walls.",
        rating: 5,
      },
      {
        id: "t3",
        merchant: "Marcus Bell",
        role: "Chef, Zora Bistro",
        quote:
          "Professional, timely, and genuinely passionate about Black food culture.",
        rating: 5,
      },
    ],
    instagramHandle: "jessuptownbites",
  },
  {
    id: "kai-flushing-food",
    handle: "kai-flushing-food",
    displayName: "Kai Zhang",
    neighborhood: "Flushing",
    bio: "Queens-born Chinese-American food journalist. I navigate Flushing's sprawling food courts so you don't have to. Fluent in Mandarin, Cantonese, and the universal language of a perfect soup dumpling.",
    avatarUrl:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=face",
    tier: "Proven",
    pushScore: 69,
    totalCampaigns: 19,
    verifiedVisits: 1290,
    avgDeliveryTime: "30h",
    tierScore: 69,
    gallery: [
      {
        id: "g1",
        type: "image",
        url: "https://images.unsplash.com/photo-1563245372-f21724e3856d?w=600&h=400&fit=crop",
        caption: "XLB at New World Mall",
        visible: true,
      },
      {
        id: "g2",
        type: "image",
        url: "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=600&h=400&fit=crop",
        caption: "Scallion pancakes, Main Street",
        visible: true,
      },
      {
        id: "g3",
        type: "image",
        url: "https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?w=600&h=400&fit=crop",
        caption: "Hot pot night, Flushing",
        visible: true,
      },
    ],
    pastCampaigns: [
      {
        id: "c1",
        brand: "Golden Dumplings",
        neighborhood: "Flushing",
        date: "2026-03-22",
        earnings: 39,
        deliveryTime: "28h",
        verifiedVisits: 92,
        visible: true,
      },
      {
        id: "c2",
        brand: "Yunnan Village",
        neighborhood: "Flushing",
        date: "2026-02-25",
        earnings: 36,
        deliveryTime: "32h",
        verifiedVisits: 67,
        visible: true,
      },
      {
        id: "c3",
        brand: "Peking House",
        neighborhood: "Murray Hill",
        date: "2026-01-15",
        earnings: 38,
        deliveryTime: "26h",
        verifiedVisits: 71,
        visible: true,
      },
    ],
    testimonials: [
      {
        id: "t1",
        merchant: "Tony Liu",
        role: "Manager, Golden Dumplings",
        quote:
          "Kai understands our food on a cultural level. The content brought us new customers from Manhattan.",
        rating: 5,
      },
      {
        id: "t2",
        merchant: "Amy Chen",
        role: "Owner, Yunnan Village",
        quote:
          "Bi-lingual captions reached both our Chinese and English-speaking audiences. Perfect.",
        rating: 4,
      },
    ],
    instagramHandle: "kaiflushingfood",
    tiktokHandle: "kaiflushingfood",
  },
  {
    id: "nadia-nomad-nyc",
    handle: "nadia-nomad-nyc",
    displayName: "Nadia Al-Hassan",
    neighborhood: "Astoria",
    bio: "Egyptian-American chef-turned-creator based in Astoria, Queens. I explore Middle Eastern, Mediterranean, and fusion cuisine in NYC's most underrated dining borough. Halal-focused, always honest.",
    avatarUrl:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop&crop=face",
    tier: "Operator",
    pushScore: 61,
    totalCampaigns: 14,
    verifiedVisits: 870,
    avgDeliveryTime: "28h",
    tierScore: 61,
    gallery: [
      {
        id: "g1",
        type: "image",
        url: "https://images.unsplash.com/photo-1571167530149-c1105da4c2c0?w=600&h=400&fit=crop",
        caption: "Mezze spread, Astoria",
        visible: true,
      },
      {
        id: "g2",
        type: "image",
        url: "https://images.unsplash.com/photo-1530469912745-a215c6b256ea?w=600&h=400&fit=crop",
        caption: "Shawarma wrap, Jackson Heights",
        visible: true,
      },
    ],
    pastCampaigns: [
      {
        id: "c1",
        brand: "Oasis Mediterranean Grill",
        neighborhood: "Astoria",
        date: "2026-03-05",
        earnings: 27,
        deliveryTime: "26h",
        verifiedVisits: 54,
        visible: true,
      },
      {
        id: "c2",
        brand: "Bosphorus Kebab House",
        neighborhood: "Jackson Heights",
        date: "2026-02-20",
        earnings: 24,
        deliveryTime: "30h",
        verifiedVisits: 42,
        visible: true,
      },
    ],
    testimonials: [
      {
        id: "t1",
        merchant: "Yusuf Karim",
        role: "Owner, Oasis Mediterranean Grill",
        quote:
          "Nadia's content resonated deeply with our community. She understands Halal dining culture inside out.",
        rating: 5,
      },
      {
        id: "t2",
        merchant: "Fatima Al-Nasser",
        role: "Chef, Bosphorus Kebab House",
        quote:
          "Professional and passionate. The video content was far beyond what we expected at this price point.",
        rating: 5,
      },
    ],
    instagramHandle: "nadianomadnyc",
  },
  {
    id: "sam-greenpoint",
    handle: "sam-greenpoint",
    displayName: "Sam Kowalski",
    neighborhood: "Greenpoint",
    bio: "Polish-American Greenpoint local covering Brooklyn's indie restaurant scene. I focus on family-run spots, natural wine bars, and neighborhood gems that don't advertise. My audience comes for the restaurants, stays for the stories.",
    avatarUrl:
      "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=200&h=200&fit=crop&crop=face",
    tier: "Operator",
    pushScore: 58,
    totalCampaigns: 11,
    verifiedVisits: 720,
    avgDeliveryTime: "32h",
    tierScore: 58,
    gallery: [
      {
        id: "g1",
        type: "image",
        url: "https://images.unsplash.com/photo-1602030638412-bb8dcc0bc8b0?w=600&h=400&fit=crop",
        caption: "Natural wine bar, Greenpoint",
        visible: true,
      },
      {
        id: "g2",
        type: "image",
        url: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&h=400&fit=crop",
        caption: "Detroit-style pizza, Williamsburg",
        visible: true,
      },
    ],
    pastCampaigns: [
      {
        id: "c1",
        brand: "Podlasie Wine Bar",
        neighborhood: "Greenpoint",
        date: "2026-03-18",
        earnings: 25,
        deliveryTime: "30h",
        verifiedVisits: 48,
        visible: true,
      },
      {
        id: "c2",
        brand: "Slice Theory",
        neighborhood: "Williamsburg",
        date: "2026-02-14",
        earnings: 22,
        deliveryTime: "34h",
        verifiedVisits: 39,
        visible: true,
      },
    ],
    testimonials: [
      {
        id: "t1",
        merchant: "Magda Wisniewska",
        role: "Owner, Podlasie Wine Bar",
        quote:
          "Sam captured the intimate atmosphere of our bar perfectly. We had reservations booked out for two weeks.",
        rating: 5,
      },
    ],
    instagramHandle: "samgreenpointbklyn",
  },
  {
    id: "devon-soho-style",
    handle: "devon-soho-style",
    displayName: "Devon Marchetti",
    neighborhood: "SoHo",
    bio: "Fashion-meets-food creator in SoHo. My content sits at the intersection of aesthetics and taste — gorgeous plates, beautiful spaces, brands that understand design. Available for upscale restaurant launches and pop-up collaborations.",
    avatarUrl:
      "https://images.unsplash.com/photo-1520813792240-56fc4a3765a7?w=200&h=200&fit=crop&crop=face",
    tier: "Proven",
    pushScore: 74,
    totalCampaigns: 26,
    verifiedVisits: 1940,
    avgDeliveryTime: "20h",
    tierScore: 74,
    gallery: [
      {
        id: "g1",
        type: "image",
        url: "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=600&h=400&fit=crop",
        caption: "Tasting menu, SoHo",
        visible: true,
      },
      {
        id: "g2",
        type: "image",
        url: "https://images.unsplash.com/photo-1551183053-bf91798d047f?w=600&h=400&fit=crop",
        caption: "Dessert architecture, NoHo",
        visible: true,
      },
      {
        id: "g3",
        type: "image",
        url: "https://images.unsplash.com/photo-1567620832903-9fc6debc209f?w=600&h=400&fit=crop",
        caption: "Brunch editorial, TriBeCa",
        visible: true,
      },
    ],
    pastCampaigns: [
      {
        id: "c1",
        brand: "Atelier Dining",
        neighborhood: "SoHo",
        date: "2026-03-12",
        earnings: 45,
        deliveryTime: "18h",
        verifiedVisits: 128,
        visible: true,
      },
      {
        id: "c2",
        brand: "Blanc Patisserie",
        neighborhood: "NoHo",
        date: "2026-02-22",
        earnings: 38,
        deliveryTime: "22h",
        verifiedVisits: 96,
        visible: true,
      },
      {
        id: "c3",
        brand: "Cuvee Wine Bar",
        neighborhood: "TriBeCa",
        date: "2026-01-28",
        earnings: 40,
        deliveryTime: "19h",
        verifiedVisits: 107,
        visible: true,
      },
    ],
    testimonials: [
      {
        id: "t1",
        merchant: "Isabelle Fontaine",
        role: "Director, Atelier Dining",
        quote:
          "Devon's aesthetic vision is unparalleled. Every image looked like it belonged in Bon Appétit.",
        rating: 5,
      },
      {
        id: "t2",
        merchant: "Claude Moreau",
        role: "Pastry Chef, Blanc Patisserie",
        quote:
          "She made our pastries look like art. Sales of the featured tarte tripled that week.",
        rating: 5,
      },
    ],
    instagramHandle: "devonsohostyle",
    tiktokHandle: "devonmarchettieat",
  },
  {
    id: "alex-midtown-lunch",
    handle: "alex-midtown-lunch",
    displayName: "Alex Reyes",
    neighborhood: "Midtown",
    bio: "The definitive Midtown lunch guide. I cover 1,000+ restaurants within walking distance of the office. Quick reviews, no fluff. My audience is busy professionals who have 45 minutes and want to eat well.",
    avatarUrl:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face",
    tier: "Proven",
    pushScore: 66,
    totalCampaigns: 18,
    verifiedVisits: 1320,
    avgDeliveryTime: "24h",
    tierScore: 66,
    gallery: [
      {
        id: "g1",
        type: "image",
        url: "https://images.unsplash.com/photo-1432139509613-5c4255815697?w=600&h=400&fit=crop",
        caption: "Lunch bowl, Bryant Park",
        visible: true,
      },
      {
        id: "g2",
        type: "image",
        url: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&h=400&fit=crop",
        caption: "Counter dining, Hell's Kitchen",
        visible: true,
      },
    ],
    pastCampaigns: [
      {
        id: "c1",
        brand: "The Pressed Lunch",
        neighborhood: "Midtown East",
        date: "2026-03-08",
        earnings: 38,
        deliveryTime: "22h",
        verifiedVisits: 88,
        visible: true,
      },
      {
        id: "c2",
        brand: "Kyoto Bowl",
        neighborhood: "Midtown West",
        date: "2026-02-16",
        earnings: 34,
        deliveryTime: "26h",
        verifiedVisits: 74,
        visible: true,
      },
    ],
    testimonials: [
      {
        id: "t1",
        merchant: "Ryan Kim",
        role: "Owner, The Pressed Lunch",
        quote:
          "Alex's audience is exactly who we want. Office workers, editors, media people. Huge impact at lunch rush.",
        rating: 5,
      },
      {
        id: "t2",
        merchant: "Yoko Tanaka",
        role: "GM, Kyoto Bowl",
        quote:
          "Efficient, professional, strong results. He's the kind of creator you re-book immediately.",
        rating: 4,
      },
    ],
    instagramHandle: "alexmidtownlunch",
  },
  {
    id: "priya-jackson-heights",
    handle: "priya-jackson-heights",
    displayName: "Priya Nair",
    neighborhood: "Jackson Heights",
    bio: "South Asian food journalist celebrating the incredible diversity of Jackson Heights and Indo-Pak cuisine across NYC. My food stories connect communities and create bridges through shared meals.",
    avatarUrl:
      "https://images.unsplash.com/photo-1546961342-ea5f62d5a27b?w=200&h=200&fit=crop&crop=face",
    tier: "Closer",
    pushScore: 80,
    totalCampaigns: 28,
    verifiedVisits: 2010,
    avgDeliveryTime: "24h",
    tierScore: 80,
    gallery: [
      {
        id: "g1",
        type: "image",
        url: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&h=400&fit=crop",
        caption: "Chaat spread, Jackson Heights",
        visible: true,
      },
      {
        id: "g2",
        type: "image",
        url: "https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=600&h=400&fit=crop",
        caption: "Biryani night, Curry Hill",
        visible: true,
      },
      {
        id: "g3",
        type: "image",
        url: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=600&h=400&fit=crop",
        caption: "Masala chai, Flushing",
        visible: true,
      },
    ],
    pastCampaigns: [
      {
        id: "c1",
        brand: "Patel's Chaat Corner",
        neighborhood: "Jackson Heights",
        date: "2026-03-14",
        earnings: 68,
        deliveryTime: "22h",
        verifiedVisits: 124,
        visible: true,
      },
      {
        id: "c2",
        brand: "Dum Biryani House",
        neighborhood: "Curry Hill",
        date: "2026-02-26",
        earnings: 62,
        deliveryTime: "26h",
        verifiedVisits: 104,
        visible: true,
      },
    ],
    testimonials: [
      {
        id: "t1",
        merchant: "Raj Patel",
        role: "Owner, Patel's Chaat Corner",
        quote:
          "Priya brought over 100 new customers in one week. Her community trust is real.",
        rating: 5,
      },
      {
        id: "t2",
        merchant: "Fatima Siddiqui",
        role: "Manager, Dum Biryani House",
        quote:
          "She covers South Asian food with depth and respect. Our diaspora community loved the content.",
        rating: 5,
      },
      {
        id: "t3",
        merchant: "Ananya Rao",
        role: "Chef, Spice Garden",
        quote:
          "Professional, culturally aware, and genuinely a great person. Will work with again.",
        rating: 5,
      },
    ],
    instagramHandle: "priyajacksonheights",
    tiktokHandle: "priyanairnyc",
  },
  {
    id: "logan-chelsea-eats",
    handle: "logan-chelsea-eats",
    displayName: "Logan Blake",
    neighborhood: "Chelsea",
    bio: "Gallery-hopper and restaurant explorer in Chelsea and the Meatpacking District. My content captures the energy of NYC's art and dining world. Each post is as carefully composed as the exhibitions I cover.",
    avatarUrl:
      "https://images.unsplash.com/photo-1463453091185-61582044d556?w=200&h=200&fit=crop&crop=face",
    tier: "Explorer",
    pushScore: 48,
    totalCampaigns: 7,
    verifiedVisits: 410,
    avgDeliveryTime: "36h",
    tierScore: 48,
    gallery: [
      {
        id: "g1",
        type: "image",
        url: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&h=400&fit=crop",
        caption: "Gallery dinner, Chelsea",
        visible: true,
      },
      {
        id: "g2",
        type: "image",
        url: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&h=400&fit=crop",
        caption: "Meatpacking District terrace",
        visible: true,
      },
    ],
    pastCampaigns: [
      {
        id: "c1",
        brand: "The Art Café",
        neighborhood: "Chelsea",
        date: "2026-03-18",
        earnings: 18,
        deliveryTime: "34h",
        verifiedVisits: 38,
        visible: true,
      },
      {
        id: "c2",
        brand: "Salon des Arts",
        neighborhood: "Meatpacking District",
        date: "2026-02-28",
        earnings: 16,
        deliveryTime: "38h",
        verifiedVisits: 32,
        visible: true,
      },
    ],
    testimonials: [
      {
        id: "t1",
        merchant: "Chloe Martin",
        role: "Owner, The Art Café",
        quote:
          "Logan's aesthetic sensibility is perfect for our brand. We're in good hands.",
        rating: 4,
      },
    ],
    instagramHandle: "loganchelseaeats",
  },
  {
    id: "tanya-bronx-food",
    handle: "tanya-bronx-food",
    displayName: "Tanya Rivera",
    neighborhood: "Fordham",
    bio: "Puerto Rican-American food creator from the Bronx. I cover the borough's hidden gems, bodegas-turned-bistros, and Dominican spots that deserve national attention. The Bronx has always been ahead.",
    avatarUrl:
      "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=200&h=200&fit=crop&crop=face",
    tier: "Proven",
    pushScore: 71,
    totalCampaigns: 21,
    verifiedVisits: 1480,
    avgDeliveryTime: "28h",
    tierScore: 71,
    gallery: [
      {
        id: "g1",
        type: "image",
        url: "https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=600&h=400&fit=crop",
        caption: "Pernil platter, Fordham",
        visible: true,
      },
      {
        id: "g2",
        type: "image",
        url: "https://images.unsplash.com/photo-1529686342540-1b43aec0df75?w=600&h=400&fit=crop",
        caption: "Bodega breakfast, South Bronx",
        visible: true,
      },
      {
        id: "g3",
        type: "image",
        url: "https://images.unsplash.com/photo-1530469912745-a215c6b256ea?w=600&h=400&fit=crop",
        caption: "Mofongo at Cuchifrito",
        visible: true,
      },
    ],
    pastCampaigns: [
      {
        id: "c1",
        brand: "La Marqueta Bodega",
        neighborhood: "East Harlem",
        date: "2026-03-16",
        earnings: 40,
        deliveryTime: "26h",
        verifiedVisits: 78,
        visible: true,
      },
      {
        id: "c2",
        brand: "Lechon & More",
        neighborhood: "Fordham",
        date: "2026-02-24",
        earnings: 36,
        deliveryTime: "30h",
        verifiedVisits: 64,
        visible: true,
      },
      {
        id: "c3",
        brand: "Cuchifrito Palace",
        neighborhood: "South Bronx",
        date: "2026-01-20",
        earnings: 38,
        deliveryTime: "28h",
        verifiedVisits: 82,
        visible: true,
      },
    ],
    testimonials: [
      {
        id: "t1",
        merchant: "Carmen Rivera",
        role: "Owner, La Marqueta Bodega",
        quote:
          "Tanya is family. She tells our story with heart, and the Bronx community responded.",
        rating: 5,
      },
      {
        id: "t2",
        merchant: "Luis Perez",
        role: "Chef, Lechon & More",
        quote:
          "Real talk — Tanya brought more business in one weekend than our last 6 months of marketing.",
        rating: 5,
      },
    ],
    instagramHandle: "tanyabronxfood",
    tiktokHandle: "tanyabronxfood",
  },
  {
    id: "marco-little-italy",
    handle: "marco-little-italy",
    displayName: "Marco Ferrara",
    neighborhood: "Little Italy",
    bio: "Third-generation Italian-American. My family has eaten in Little Italy for 40 years. I cover the authentic spots, the tourist traps to avoid, and the new wave of Italian cuisine redefining the neighborhood.",
    avatarUrl:
      "https://images.unsplash.com/photo-1500048993953-d23a436266cf?w=200&h=200&fit=crop&crop=face",
    tier: "Closer",
    pushScore: 79,
    totalCampaigns: 29,
    verifiedVisits: 2180,
    avgDeliveryTime: "22h",
    tierScore: 79,
    gallery: [
      {
        id: "g1",
        type: "image",
        url: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&h=400&fit=crop",
        caption: "Homemade pasta, Little Italy",
        visible: true,
      },
      {
        id: "g2",
        type: "image",
        url: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=600&h=400&fit=crop",
        caption: "Espresso corner, Mulberry Street",
        visible: true,
      },
      {
        id: "g3",
        type: "image",
        url: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=600&h=400&fit=crop",
        caption: "Sunday gravy, Nolita",
        visible: true,
      },
      {
        id: "g4",
        type: "image",
        url: "https://images.unsplash.com/photo-1551183053-bf91798d047f?w=600&h=400&fit=crop",
        caption: "Cannoli from Ferrara Bakery",
        visible: true,
      },
    ],
    pastCampaigns: [
      {
        id: "c1",
        brand: "Caffe Palermo",
        neighborhood: "Little Italy",
        date: "2026-03-10",
        earnings: 66,
        deliveryTime: "20h",
        verifiedVisits: 118,
        visible: true,
      },
      {
        id: "c2",
        brand: "Forno Romano",
        neighborhood: "Nolita",
        date: "2026-02-20",
        earnings: 60,
        deliveryTime: "24h",
        verifiedVisits: 102,
        visible: true,
      },
      {
        id: "c3",
        brand: "Il Cortile",
        neighborhood: "Little Italy",
        date: "2026-01-18",
        earnings: 64,
        deliveryTime: "21h",
        verifiedVisits: 96,
        visible: true,
      },
    ],
    testimonials: [
      {
        id: "t1",
        merchant: "Gianni Palermo",
        role: "Owner, Caffe Palermo",
        quote:
          "Marco understands Italian food at a DNA level. His content feels like a Sunday dinner invitation.",
        rating: 5,
      },
      {
        id: "t2",
        merchant: "Rosa Ferrari",
        role: "Chef, Forno Romano",
        quote:
          "The engagement was extraordinary. Our Instagram grew 800 followers in 48 hours.",
        rating: 5,
      },
    ],
    instagramHandle: "marcolittleitalynyc",
  },
  {
    id: "wei-chinatown-guide",
    handle: "wei-chinatown-guide",
    displayName: "Wei Liu",
    neighborhood: "Chinatown",
    bio: "Manhattan Chinatown native and community organizer. I document the stories behind the restaurants — the families, the history, the fight to preserve these spaces. My content is journalism as much as food media.",
    avatarUrl:
      "https://images.unsplash.com/photo-1552058544-f2b08422138a?w=200&h=200&fit=crop&crop=face",
    tier: "Partner",
    pushScore: 91,
    totalCampaigns: 43,
    verifiedVisits: 3520,
    avgDeliveryTime: "19h",
    tierScore: 91,
    gallery: [
      {
        id: "g1",
        type: "image",
        url: "https://images.unsplash.com/photo-1563245372-f21724e3856d?w=600&h=400&fit=crop",
        caption: "Dim sum at Nom Wah",
        visible: true,
      },
      {
        id: "g2",
        type: "image",
        url: "https://images.unsplash.com/photo-1557872943-16a5ac26437e?w=600&h=400&fit=crop",
        caption: "Tofu factory, Mott Street",
        visible: true,
      },
      {
        id: "g3",
        type: "image",
        url: "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=600&h=400&fit=crop",
        caption: "Bakery window, Canal Street",
        visible: true,
      },
      {
        id: "g4",
        type: "image",
        url: "https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?w=600&h=400&fit=crop",
        caption: "Hot pot spread, Bowery",
        visible: true,
      },
      {
        id: "g5",
        type: "image",
        url: "https://images.unsplash.com/photo-1524247108137-732e0f642303?w=600&h=400&fit=crop",
        caption: "Noodle pull at Joe's Shanghai",
        visible: true,
      },
    ],
    pastCampaigns: [
      {
        id: "c1",
        brand: "Golden Phoenix",
        neighborhood: "Chinatown",
        date: "2026-03-20",
        earnings: 120,
        deliveryTime: "17h",
        verifiedVisits: 210,
        visible: true,
      },
      {
        id: "c2",
        brand: "Nom Wah Tea Parlor",
        neighborhood: "Chinatown",
        date: "2026-02-28",
        earnings: 115,
        deliveryTime: "20h",
        verifiedVisits: 188,
        visible: true,
      },
      {
        id: "c3",
        brand: "Big Wong King",
        neighborhood: "Chinatown",
        date: "2026-01-30",
        earnings: 110,
        deliveryTime: "18h",
        verifiedVisits: 172,
        visible: true,
      },
    ],
    testimonials: [
      {
        id: "t1",
        merchant: "Helen Chan",
        role: "Owner, Golden Phoenix",
        quote:
          "Wei tells our family's story with honesty and depth. He's an essential voice for Chinatown.",
        rating: 5,
      },
      {
        id: "t2",
        merchant: "Wilson Tang",
        role: "Owner, Nom Wah Tea Parlor",
        quote:
          "The best creator we've worked with in a decade of social media. Period.",
        rating: 5,
      },
      {
        id: "t3",
        merchant: "Victor Wong",
        role: "Manager, Big Wong King",
        quote:
          "Wei's community roots mean the audience trust is built-in. Outstanding ROI every single time.",
        rating: 5,
      },
    ],
    instagramHandle: "weichinatownguide",
    tiktokHandle: "weichinatownguide",
  },
  {
    id: "sophie-upper-east",
    handle: "sophie-upper-east",
    displayName: "Sophie Bernstein",
    neighborhood: "Upper East Side",
    bio: "Upper East Side food and lifestyle creator with a focus on classic New York dining institutions. Pre-war buildings, white tablecloths, and the power lunch. I cover NYC as it was, is, and should always be.",
    avatarUrl:
      "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=200&h=200&fit=crop&crop=face",
    tier: "Proven",
    pushScore: 68,
    totalCampaigns: 20,
    verifiedVisits: 1140,
    avgDeliveryTime: "28h",
    tierScore: 68,
    gallery: [
      {
        id: "g1",
        type: "image",
        url: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&h=400&fit=crop",
        caption: "Power lunch, Upper East Side",
        visible: true,
      },
      {
        id: "g2",
        type: "image",
        url: "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=600&h=400&fit=crop",
        caption: "Dinner at Cafe Boulud",
        visible: true,
      },
      {
        id: "g3",
        type: "image",
        url: "https://images.unsplash.com/photo-1551183053-bf91798d047f?w=600&h=400&fit=crop",
        caption: "Afternoon tea, The Pierre",
        visible: true,
      },
    ],
    pastCampaigns: [
      {
        id: "c1",
        brand: "Rotisserie Georgette",
        neighborhood: "Upper East Side",
        date: "2026-03-12",
        earnings: 38,
        deliveryTime: "26h",
        verifiedVisits: 72,
        visible: true,
      },
      {
        id: "c2",
        brand: "Sant Ambroeus",
        neighborhood: "Upper East Side",
        date: "2026-02-18",
        earnings: 36,
        deliveryTime: "30h",
        verifiedVisits: 60,
        visible: true,
      },
    ],
    testimonials: [
      {
        id: "t1",
        merchant: "Georgette Farkas",
        role: "Chef-Owner, Rotisserie Georgette",
        quote:
          "Sophie's content elevated our dining room in every sense. Tasteful, intelligent, and beautifully shot.",
        rating: 5,
      },
    ],
    instagramHandle: "sophieuppereast",
  },
  {
    id: "dan-east-village",
    handle: "dan-east-village",
    displayName: "Dan Koike",
    neighborhood: "East Village",
    bio: "Japanese-American raised in the East Village. I cover NYC's ramen, izakaya, and Japanese comfort food scene with firsthand knowledge and high standards. If you get my stamp of approval, you earned it.",
    avatarUrl:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop&crop=face",
    tier: "Closer",
    pushScore: 85,
    totalCampaigns: 34,
    verifiedVisits: 2680,
    avgDeliveryTime: "20h",
    tierScore: 85,
    gallery: [
      {
        id: "g1",
        type: "image",
        url: "https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?w=600&h=400&fit=crop",
        caption: "Tonkotsu bowl, East Village",
        visible: true,
      },
      {
        id: "g2",
        type: "image",
        url: "https://images.unsplash.com/photo-1557872943-16a5ac26437e?w=600&h=400&fit=crop",
        caption: "Izakaya night, St. Marks Place",
        visible: true,
      },
      {
        id: "g3",
        type: "image",
        url: "https://images.unsplash.com/photo-1524247108137-732e0f642303?w=600&h=400&fit=crop",
        caption: "Sashimi omakase, NoHo",
        visible: true,
      },
      {
        id: "g4",
        type: "image",
        url: "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=600&h=400&fit=crop",
        caption: "Taiyaki dessert, St. Marks",
        visible: true,
      },
    ],
    pastCampaigns: [
      {
        id: "c1",
        brand: "Ippudo NY",
        neighborhood: "East Village",
        date: "2026-03-18",
        earnings: 74,
        deliveryTime: "18h",
        verifiedVisits: 156,
        visible: true,
      },
      {
        id: "c2",
        brand: "Yopparai Izakaya",
        neighborhood: "East Village",
        date: "2026-02-24",
        earnings: 68,
        deliveryTime: "22h",
        verifiedVisits: 134,
        visible: true,
      },
      {
        id: "c3",
        brand: "Torishin",
        neighborhood: "Upper West Side",
        date: "2026-01-30",
        earnings: 72,
        deliveryTime: "20h",
        verifiedVisits: 118,
        visible: true,
      },
    ],
    testimonials: [
      {
        id: "t1",
        merchant: "Shigemi Kawahara",
        role: "Founder, Ippudo NY",
        quote:
          "Dan's content honors the craft. His audience is educated, appreciative, and loyal.",
        rating: 5,
      },
      {
        id: "t2",
        merchant: "Kenji Shimizu",
        role: "Owner, Yopparai Izakaya",
        quote:
          "He brought serious food people through our door. The conversations and energy that night were different.",
        rating: 5,
      },
    ],
    instagramHandle: "daneastvillagenyc",
    tiktokHandle: "daneastvillage",
  },
  {
    id: "emma-staten-island",
    handle: "emma-staten-island",
    displayName: "Emma DeLuca",
    neighborhood: "St. George",
    bio: "Staten Island's most dedicated food documenter. I'm covering the forgotten borough's incredible Italian-American heritage, the new wave of Sri Lankan spots in Tompkinsville, and every hidden gem in between. SI deserves a spotlight.",
    avatarUrl:
      "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=200&h=200&fit=crop&crop=face",
    tier: "Explorer",
    pushScore: 52,
    totalCampaigns: 9,
    verifiedVisits: 520,
    avgDeliveryTime: "34h",
    tierScore: 52,
    gallery: [
      {
        id: "g1",
        type: "image",
        url: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=600&h=400&fit=crop",
        caption: "Sunday sauce, St. George",
        visible: true,
      },
      {
        id: "g2",
        type: "image",
        url: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&h=400&fit=crop",
        caption: "Sri Lankan kottu, Tompkinsville",
        visible: true,
      },
    ],
    pastCampaigns: [
      {
        id: "c1",
        brand: "Vida Restaurant",
        neighborhood: "St. George",
        date: "2026-03-08",
        earnings: 17,
        deliveryTime: "32h",
        verifiedVisits: 44,
        visible: true,
      },
      {
        id: "c2",
        brand: "New Asha",
        neighborhood: "Tompkinsville",
        date: "2026-02-15",
        earnings: 15,
        deliveryTime: "36h",
        verifiedVisits: 36,
        visible: true,
      },
    ],
    testimonials: [
      {
        id: "t1",
        merchant: "Patricia DeLuca",
        role: "Owner, Vida Restaurant",
        quote:
          "Emma put us on the map for people from other boroughs. We had visitors from Brooklyn and Manhattan come just to find us.",
        rating: 5,
      },
    ],
    instagramHandle: "emmastatenislandeats",
  },
  {
    id: "rachel-park-slope",
    handle: "rachel-park-slope",
    displayName: "Rachel Goldstein",
    neighborhood: "Park Slope",
    bio: "Park Slope parent, food writer, and neighborhood restaurant champion. I cover the family-friendly dining scene in Brooklyn with an eye for sustainability, local sourcing, and restaurants doing things right. Mom-tested, critic-approved.",
    avatarUrl:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=200&h=200&fit=crop&crop=face",
    tier: "Proven",
    pushScore: 70,
    totalCampaigns: 23,
    verifiedVisits: 1620,
    avgDeliveryTime: "30h",
    tierScore: 70,
    gallery: [
      {
        id: "g1",
        type: "image",
        url: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&h=400&fit=crop",
        caption: "Farm-to-table brunch, Park Slope",
        visible: true,
      },
      {
        id: "g2",
        type: "image",
        url: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&h=400&fit=crop",
        caption: "Family dinner, Carroll Gardens",
        visible: true,
      },
    ],
    pastCampaigns: [
      {
        id: "c1",
        brand: "Olmsted Restaurant",
        neighborhood: "Prospect Heights",
        date: "2026-03-14",
        earnings: 40,
        deliveryTime: "28h",
        verifiedVisits: 84,
        visible: true,
      },
      {
        id: "c2",
        brand: "Connecticut Muffin",
        neighborhood: "Park Slope",
        date: "2026-02-22",
        earnings: 36,
        deliveryTime: "32h",
        verifiedVisits: 68,
        visible: true,
      },
    ],
    testimonials: [
      {
        id: "t1",
        merchant: "Greg Baxtrom",
        role: "Chef, Olmsted",
        quote:
          "Rachel's audience trusts her implicitly. When she recommends us, people come knowing they're in for something special.",
        rating: 5,
      },
      {
        id: "t2",
        merchant: "Amy Harris",
        role: "Manager, Connecticut Muffin",
        quote:
          "Our weekend foot traffic doubled after Rachel's post. The Park Slope community listens to her.",
        rating: 4,
      },
    ],
    instagramHandle: "rachelparkslope",
  },
  {
    id: "tommy-forest-hills",
    handle: "tommy-forest-hills",
    displayName: "Tommy Vasquez",
    neighborhood: "Forest Hills",
    bio: "Queens kid. Forest Hills native. I'm building the definitive guide to the outer-borough dining scene that doesn't get enough attention. From Greek spots in Astoria to Indian bakeries in Richmond Hill — Queens has everything.",
    avatarUrl:
      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop&crop=face",
    tier: "Operator",
    pushScore: 57,
    totalCampaigns: 12,
    verifiedVisits: 740,
    avgDeliveryTime: "32h",
    tierScore: 57,
    gallery: [
      {
        id: "g1",
        type: "image",
        url: "https://images.unsplash.com/photo-1571167530149-c1105da4c2c0?w=600&h=400&fit=crop",
        caption: "Greek taverna, Astoria",
        visible: true,
      },
      {
        id: "g2",
        type: "image",
        url: "https://images.unsplash.com/photo-1530469912745-a215c6b256ea?w=600&h=400&fit=crop",
        caption: "Lamb shawarma, Richmond Hill",
        visible: true,
      },
    ],
    pastCampaigns: [
      {
        id: "c1",
        brand: "Taverna Kyclades",
        neighborhood: "Astoria",
        date: "2026-03-06",
        earnings: 26,
        deliveryTime: "30h",
        verifiedVisits: 56,
        visible: true,
      },
      {
        id: "c2",
        brand: "Anand Bhavan",
        neighborhood: "Richmond Hill",
        date: "2026-02-12",
        earnings: 23,
        deliveryTime: "34h",
        verifiedVisits: 44,
        visible: true,
      },
    ],
    testimonials: [
      {
        id: "t1",
        merchant: "Stavros Kyriakides",
        role: "Owner, Taverna Kyclades",
        quote:
          "Tommy gets Queens. He treats every neighborhood with equal respect and genuine curiosity.",
        rating: 4,
      },
    ],
    instagramHandle: "tommyforesthills",
  },
  {
    id: "grace-dumbo-creative",
    handle: "grace-dumbo-creative",
    displayName: "Grace Huang",
    neighborhood: "DUMBO",
    bio: "Designer and food creator in DUMBO, Brooklyn. I bring a visual design background to food content — architecture, plating, and the aesthetics of eating. My content lives at the intersection of creativity and cuisine.",
    avatarUrl:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&h=200&fit=crop&crop=face",
    tier: "Proven",
    pushScore: 73,
    totalCampaigns: 24,
    verifiedVisits: 1760,
    avgDeliveryTime: "22h",
    tierScore: 73,
    gallery: [
      {
        id: "g1",
        type: "image",
        url: "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=600&h=400&fit=crop",
        caption: "Design-forward plating, DUMBO",
        visible: true,
      },
      {
        id: "g2",
        type: "image",
        url: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&h=400&fit=crop",
        caption: "Industrial dining, Red Hook",
        visible: true,
      },
      {
        id: "g3",
        type: "image",
        url: "https://images.unsplash.com/photo-1567620832903-9fc6debc209f?w=600&h=400&fit=crop",
        caption: "Rooftop brunch, Brooklyn Heights",
        visible: true,
      },
    ],
    pastCampaigns: [
      {
        id: "c1",
        brand: "Cecconi's DUMBO",
        neighborhood: "DUMBO",
        date: "2026-03-16",
        earnings: 42,
        deliveryTime: "20h",
        verifiedVisits: 94,
        visible: true,
      },
      {
        id: "c2",
        brand: "Luke's Lobster",
        neighborhood: "DUMBO",
        date: "2026-02-20",
        earnings: 38,
        deliveryTime: "24h",
        verifiedVisits: 80,
        visible: true,
      },
      {
        id: "c3",
        brand: "Pilot DUMBO",
        neighborhood: "DUMBO",
        date: "2026-01-26",
        earnings: 40,
        deliveryTime: "22h",
        verifiedVisits: 88,
        visible: true,
      },
    ],
    testimonials: [
      {
        id: "t1",
        merchant: "Nick Valenti",
        role: "Director, Cecconi's DUMBO",
        quote:
          "Grace's design sensibility elevated the way we present our restaurant brand. Premium content.",
        rating: 5,
      },
      {
        id: "t2",
        merchant: "Ben Conniff",
        role: "Co-founder, Luke's Lobster",
        quote:
          "Absolutely nailed our brand voice. The photos looked like a magazine editorial spread.",
        rating: 5,
      },
    ],
    instagramHandle: "gracedumbocreative",
    tiktokHandle: "gracedumbo",
  },
  {
    id: "carlos-inwood",
    handle: "carlos-inwood",
    displayName: "Carlos Mendez",
    neighborhood: "Inwood",
    bio: "Dominican-American creator from Inwood, the northernmost tip of Manhattan. I document Washington Heights and Inwood's vibrant Latin food scene — pernil, mangu, sancocho, and the bodega culture that keeps this neighborhood running.",
    avatarUrl:
      "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&h=200&fit=crop&crop=face",
    tier: "Seed",
    pushScore: 34,
    totalCampaigns: 3,
    verifiedVisits: 180,
    avgDeliveryTime: "40h",
    tierScore: 34,
    gallery: [
      {
        id: "g1",
        type: "image",
        url: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=600&h=400&fit=crop",
        caption: "Mangu & eggs, Washington Heights",
        visible: true,
      },
    ],
    pastCampaigns: [
      {
        id: "c1",
        brand: "El Malecón Restaurant",
        neighborhood: "Washington Heights",
        date: "2026-03-20",
        earnings: 0,
        deliveryTime: "38h",
        verifiedVisits: 28,
        visible: true,
      },
      {
        id: "c2",
        brand: "Mamajuana Café",
        neighborhood: "Inwood",
        date: "2026-03-05",
        earnings: 0,
        deliveryTime: "42h",
        verifiedVisits: 22,
        visible: true,
      },
    ],
    testimonials: [
      {
        id: "t1",
        merchant: "Santos Jimenez",
        role: "Owner, El Malecón Restaurant",
        quote:
          "Carlos is just getting started, but his connection to the Dominican community is genuine. We believe in him.",
        rating: 4,
      },
    ],
    instagramHandle: "carlosinwoodnyc",
  },
];

export function getProfileByHandle(handle: string): CreatorProfile | undefined {
  return MOCK_PROFILES.find((p) => p.handle === handle);
}

export function getAllHandles(): string[] {
  return MOCK_PROFILES.map((p) => p.handle);
}
