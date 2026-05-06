import type { Deliverable } from "@/lib/services/pricing";

export type TierLevel = 1 | 2 | 3 | 4 | 5 | 6;
export type Format = "in-person" | "remote" | "hybrid";
export type PayUnit = "campaign" | "visit" | "post" | "reel" | "story";

export interface Campaign {
  id: string;
  title: string;
  /** One-line description shown on card hover, between title and location. ≤80 chars. */
  tagline?: string;
  merchantName: string;
  neighborhood: string;
  category:
    | "FOOD & DRINK"
    | "RETAIL"
    | "WELLNESS"
    | "BEAUTY"
    | "FITNESS"
    | "LIFESTYLE";
  /** Base cash pay per unit (or total if payUnit === "campaign"). Always > 0 on this page.
   *  $0-cash campaigns are routed to a future /creator/try surface — never shown here. */
  cashPay: number;
  payUnit: PayUnit;
  deliverables: Deliverable[];
  slotsTotal: number;
  slotsRemaining: number;
  distanceMi: number;
  format: Format;
  matchScore: number;
  deadlineIso?: string;
  lat: number;
  lng: number;
  images: string[];
  minimumTier: TierLevel;
}

/** Hand-crafted campaign fixtures — first 10 (static, anchored to known
 *  NYC merchants). Used as the leading entries in MOCK_CAMPAIGNS export. */
const STATIC_CAMPAIGNS: Campaign[] = [
  {
    id: "disc-001",
    title: "Rooftop Coffee Series",
    merchantName: "Blank Street Coffee",
    neighborhood: "Williamsburg, BK",
    category: "FOOD & DRINK",
    cashPay: 32,
    payUnit: "visit",
    deliverables: [
      { type: "visit", count: 3, unitPay: 32, estHoursEach: 0.75 },
    ],
    slotsTotal: 20,
    slotsRemaining: 6,
    distanceMi: 0.4,
    format: "in-person",
    matchScore: 94,
    deadlineIso: "2026-05-10",
    lat: 40.7141,
    lng: -73.9614,
    images: [
      "https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=480&h=600&fit=crop&q=72",
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=480&h=600&fit=crop&q=72",
      "https://images.unsplash.com/photo-1521017432531-fbd92d768814?w=480&h=600&fit=crop&q=72",
    ],
    minimumTier: 1,
  },
  {
    id: "disc-002",
    title: "Chelsea Market Food Walk",
    merchantName: "Chelsea Market",
    neighborhood: "Chelsea, NYC",
    category: "FOOD & DRINK",
    cashPay: 45,
    payUnit: "post",
    deliverables: [
      { type: "post", count: 2, unitPay: 45, estHoursEach: 1.5 },
      { type: "story", count: 4, unitPay: 15, estHoursEach: 0.25 },
    ],
    slotsTotal: 10,
    slotsRemaining: 2,
    distanceMi: 1.2,
    format: "in-person",
    matchScore: 88,
    deadlineIso: "2026-05-08",
    lat: 40.7422,
    lng: -74.0051,
    images: [
      "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=480&h=600&fit=crop&q=72",
      "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=480&h=600&fit=crop&q=72",
      "https://images.unsplash.com/photo-1544025162-d76694265947?w=480&h=600&fit=crop&q=72",
    ],
    minimumTier: 1,
  },
  {
    id: "disc-003",
    title: "Flatiron Brunch Story",
    merchantName: "Eataly NYC Flatiron",
    neighborhood: "Flatiron, NYC",
    category: "FOOD & DRINK",
    cashPay: 60,
    payUnit: "reel",
    deliverables: [{ type: "reel", count: 2, unitPay: 60, estHoursEach: 2 }],
    slotsTotal: 8,
    slotsRemaining: 4,
    distanceMi: 0.8,
    format: "in-person",
    matchScore: 81,
    deadlineIso: "2026-05-12",
    lat: 40.7412,
    lng: -73.9897,
    images: [
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=480&h=600&fit=crop&q=72",
      "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=480&h=600&fit=crop&q=72",
      "https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=480&h=600&fit=crop&q=72",
    ],
    minimumTier: 2,
  },
  {
    id: "disc-004",
    title: "Pilates Studio Grand Opening",
    merchantName: "Forma Pilates Chelsea",
    neighborhood: "Chelsea, NYC",
    category: "FITNESS",
    cashPay: 40,
    payUnit: "visit",
    deliverables: [
      { type: "visit", count: 4, unitPay: 40, estHoursEach: 1 },
      { type: "story", count: 6, unitPay: 12, estHoursEach: 0.2 },
    ],
    slotsTotal: 12,
    slotsRemaining: 7,
    distanceMi: 1.5,
    format: "in-person",
    matchScore: 72,
    deadlineIso: "2026-05-20",
    lat: 40.747,
    lng: -73.9983,
    images: [
      "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=480&h=600&fit=crop&q=72",
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=480&h=600&fit=crop&q=72",
      "https://images.unsplash.com/photo-1554284126-aa88f22d8b74?w=480&h=600&fit=crop&q=72",
    ],
    minimumTier: 1,
  },
  {
    id: "disc-005",
    title: "Gallery Opening Night",
    merchantName: "Tara Downs Gallery",
    neighborhood: "Chelsea, NYC",
    category: "LIFESTYLE",
    cashPay: 75,
    payUnit: "campaign",
    deliverables: [{ type: "post", count: 3, unitPay: 25, estHoursEach: 1.5 }],
    slotsTotal: 6,
    slotsRemaining: 3,
    distanceMi: 0.9,
    format: "in-person",
    matchScore: 65,
    deadlineIso: "2026-05-15",
    lat: 40.745,
    lng: -74.004,
    images: [
      "https://images.unsplash.com/photo-1531058020387-3be344556be6?w=480&h=600&fit=crop&q=72",
      "https://images.unsplash.com/photo-1545987796-200677ee1011?w=480&h=600&fit=crop&q=72",
      "https://images.unsplash.com/photo-1577720580479-7d839d829c73?w=480&h=600&fit=crop&q=72",
    ],
    minimumTier: 1,
  },
  {
    id: "disc-006",
    title: "Beauty Lab Skincare Series",
    merchantName: "Bluemercury SoHo",
    neighborhood: "SoHo, NYC",
    category: "BEAUTY",
    cashPay: 55,
    payUnit: "story",
    deliverables: [{ type: "story", count: 6, unitPay: 55, estHoursEach: 0.5 }],
    slotsTotal: 8,
    slotsRemaining: 5,
    distanceMi: 0.7,
    format: "in-person",
    matchScore: 78,
    deadlineIso: "2026-05-15",
    lat: 40.7239,
    lng: -74.0019,
    images: [
      "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=480&h=600&fit=crop&q=72",
      "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=480&h=600&fit=crop&q=72",
      "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=480&h=600&fit=crop&q=72",
    ],
    minimumTier: 2,
  },
  {
    id: "disc-007",
    title: "Boutique Opening Campaign",
    merchantName: "Madewell SoHo",
    neighborhood: "SoHo, NYC",
    category: "RETAIL",
    cashPay: 28,
    payUnit: "post",
    deliverables: [
      { type: "post", count: 3, unitPay: 28, estHoursEach: 1 },
      { type: "story", count: 5, unitPay: 8, estHoursEach: 0.2 },
    ],
    slotsTotal: 15,
    slotsRemaining: 10,
    distanceMi: 0.5,
    format: "hybrid",
    matchScore: 58,
    deadlineIso: "2026-05-20",
    lat: 40.7225,
    lng: -73.9974,
    images: [
      "https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=480&h=600&fit=crop&q=72",
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=480&h=600&fit=crop&q=72",
      "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=480&h=600&fit=crop&q=72",
    ],
    minimumTier: 1,
  },
  {
    id: "disc-009",
    title: "Wellness Studio Launch",
    merchantName: "The Well NYC",
    neighborhood: "Midtown, NYC",
    category: "WELLNESS",
    cashPay: 85,
    payUnit: "campaign",
    deliverables: [
      { type: "reel", count: 1, unitPay: 60, estHoursEach: 2.5 },
      { type: "post", count: 2, unitPay: 25, estHoursEach: 1.5 },
    ],
    slotsTotal: 5,
    slotsRemaining: 1,
    distanceMi: 1.1,
    format: "in-person",
    matchScore: 84,
    deadlineIso: "2026-05-06",
    lat: 40.7561,
    lng: -73.9864,
    images: [
      "https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=480&h=600&fit=crop&q=72",
      "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=480&h=600&fit=crop&q=72",
      "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=480&h=600&fit=crop&q=72",
    ],
    minimumTier: 3,
  },
  {
    id: "disc-010",
    title: "Farm-to-Table Dinner Series",
    merchantName: "Blue Hill Restaurant",
    neighborhood: "West Village, NYC",
    category: "FOOD & DRINK",
    cashPay: 250,
    payUnit: "campaign",
    deliverables: [
      { type: "reel", count: 2, unitPay: 100, estHoursEach: 3 },
      { type: "post", count: 3, unitPay: 50, estHoursEach: 1.5 },
    ],
    slotsTotal: 2,
    slotsRemaining: 1,
    distanceMi: 1.4,
    format: "in-person",
    matchScore: 76,
    deadlineIso: "2026-05-20",
    lat: 40.7317,
    lng: -74.0002,
    images: [
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=480&h=600&fit=crop&q=72",
      "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=480&h=600&fit=crop&q=72",
      "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=480&h=600&fit=crop&q=72",
    ],
    minimumTier: 3,
  },
  {
    id: "disc-011",
    title: "Spring Retail Lookbook",
    merchantName: "COS Soho",
    neighborhood: "SoHo, NYC",
    category: "RETAIL",
    cashPay: 180,
    payUnit: "campaign",
    deliverables: [
      { type: "reel", count: 1, unitPay: 100, estHoursEach: 3 },
      { type: "post", count: 4, unitPay: 20, estHoursEach: 1 },
    ],
    slotsTotal: 4,
    slotsRemaining: 2,
    distanceMi: 0.6,
    format: "hybrid",
    matchScore: 70,
    deadlineIso: "2026-05-25",
    lat: 40.7268,
    lng: -73.9987,
    images: [
      "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=480&h=600&fit=crop&q=72",
      "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=480&h=600&fit=crop&q=72",
    ],
    minimumTier: 2,
  },
];

/* ── Bulk fixture generator ───────────────────────────────────────
   Produces 100 deterministic campaigns scattered across NYC with realistic
   neighborhoods, merchant names, pay rates, and category-appropriate
   Unsplash imagery. ~17 per category, weighted tier distribution. */

type ExtraCat = Campaign["category"];

const NEIGHBORHOODS: Array<{ name: string; lat: number; lng: number }> = [
  { name: "SoHo, NYC", lat: 40.7237, lng: -74.0014 },
  { name: "NoLita, NYC", lat: 40.7228, lng: -73.9954 },
  { name: "TriBeCa, NYC", lat: 40.7195, lng: -74.0089 },
  { name: "West Village, NYC", lat: 40.734, lng: -74.003 },
  { name: "East Village, NYC", lat: 40.7265, lng: -73.9815 },
  { name: "LES, NYC", lat: 40.715, lng: -73.9843 },
  { name: "Chelsea, NYC", lat: 40.7465, lng: -74.0014 },
  { name: "Flatiron, NYC", lat: 40.741, lng: -73.9896 },
  { name: "Gramercy, NYC", lat: 40.737, lng: -73.9853 },
  { name: "Murray Hill, NYC", lat: 40.748, lng: -73.9772 },
  { name: "Midtown, NYC", lat: 40.7549, lng: -73.984 },
  { name: "Hudson Yards, NYC", lat: 40.7536, lng: -74.0014 },
  { name: "Hell's Kitchen, NYC", lat: 40.7638, lng: -73.9918 },
  { name: "UWS, NYC", lat: 40.787, lng: -73.9754 },
  { name: "UES, NYC", lat: 40.7736, lng: -73.9566 },
  { name: "Harlem, NYC", lat: 40.8116, lng: -73.9465 },
  { name: "Williamsburg, BK", lat: 40.7081, lng: -73.9571 },
  { name: "DUMBO, BK", lat: 40.7033, lng: -73.9881 },
  { name: "Greenpoint, BK", lat: 40.7308, lng: -73.9509 },
  { name: "Park Slope, BK", lat: 40.672, lng: -73.9776 },
  { name: "Bushwick, BK", lat: 40.6944, lng: -73.9213 },
  { name: "Boerum Hill, BK", lat: 40.684, lng: -73.9846 },
  { name: "Cobble Hill, BK", lat: 40.6863, lng: -73.9952 },
  { name: "Long Island City", lat: 40.7447, lng: -73.9485 },
  { name: "Astoria, QNS", lat: 40.772, lng: -73.9301 },
  { name: "FiDi, NYC", lat: 40.7075, lng: -74.0113 },
  { name: "Battery Park, NYC", lat: 40.7033, lng: -74.017 },
  { name: "Prospect Heights, BK", lat: 40.6774, lng: -73.9692 },
  { name: "Red Hook, BK", lat: 40.6744, lng: -74.0004 },
  { name: "Bed-Stuy, BK", lat: 40.6872, lng: -73.9418 },
  { name: "Chinatown, NYC", lat: 40.7158, lng: -73.997 },
  { name: "Flushing, QNS", lat: 40.7628, lng: -73.8307 },
  { name: "K-Town, NYC", lat: 40.748, lng: -73.9872 },
  { name: "Sunset Park, BK", lat: 40.6454, lng: -74.0104 },
  { name: "Elmhurst, QNS", lat: 40.7368, lng: -73.878 },
  { name: "Jackson Heights, QNS", lat: 40.7476, lng: -73.8838 },
  { name: "Bensonhurst, BK", lat: 40.6019, lng: -73.9936 },
];

const IMG_POOLS: Record<ExtraCat, string[]> = {
  "FOOD & DRINK": [
    "photo-1414235077428-338989a2e8c0",
    "photo-1559925393-8be0ec4767c8",
    "photo-1552566626-52f8b828add9",
    "photo-1540189549336-e6e99c3679fe",
    "photo-1547592166-23ac45744acd",
    "photo-1543339494-b4cd4f7ba686",
    "photo-1517248135467-4c7edcad34c4",
    "photo-1424847651672-bf20a4b0982b",
    "photo-1466978913421-dad2ebd01d17",
    "photo-1428515613728-6b4607e44363",
    "photo-1470337458703-46ad1756a187",
    "photo-1476224203421-9ac39bcb3327",
    "photo-1600891964092-4316c288032e",
    "photo-1507003211169-0a1dd7228f2d",
    "photo-1590846406792-0adc7f938f1d",
    "photo-1504754524776-8f4f37790ca0",
    "photo-1485704686097-ed47f7263ca4",
    "photo-1529006557810-274b9b2fc783",
    "photo-1559847844-5315695dadae",
    "photo-1551218808-94e220e084d2",
  ],
  RETAIL: [
    "photo-1441986300917-64674bd600d8",
    "photo-1567401893414-76b7b1e5a7a5",
    "photo-1490481651871-ab68de25d43d",
    "photo-1551232864-3f0890e580d9",
    "photo-1556742049-0cfed4f6a45d",
    "photo-1469334031218-e382a71b716b",
    "photo-1445205170230-053b83016050",
    "photo-1441984904996-e0b6ba687e04",
    "photo-1558769132-cb1aea458c5e",
    "photo-1555529669-e69e7aa0ba9a",
    "photo-1472851294608-062f824d29cc",
    "photo-1525507119028-ed4c629a60a3",
    "photo-1556905055-8f358a7a47b2",
    "photo-1560243563-062bfc001d68",
    "photo-1543087903-1ac2ec7aa8c5",
    "photo-1573855619003-97b4799dcd8b",
    "photo-1559563458-527698bf5295",
    "photo-1567958451986-2de427a4a0be",
    "photo-1543163521-1bf539c55dd2",
    "photo-1516762689617-e1cffcef479d",
  ],
  WELLNESS: [
    "photo-1544161515-4ab6ce6db874",
    "photo-1540555700478-4be289fbecef",
    "photo-1545389336-cf090694435e",
    "photo-1600334089648-b0d9d3028eb2",
    "photo-1515377905703-c4788e51af15",
    "photo-1506126613408-eca07ce68773",
    "photo-1545205597-3d9d02c29597",
    "photo-1552693673-1bf958298935",
    "photo-1600618528240-fb9fc964b853",
    "photo-1507652313519-d4e9174996dd",
    "photo-1519823551278-64ac92734fb1",
    "photo-1570655652364-2e0a67455ac6",
    "photo-1583416750470-965b2707b355",
    "photo-1591343395082-e120087004b4",
    "photo-1604881991720-f91add269bed",
    "photo-1540206395-68808572332f",
    "photo-1571019614242-c5c5dee9f50b",
    "photo-1559757148-5c350d0d3c56",
    "photo-1602192509154-0b900ee1f851",
    "photo-1519824145371-296894a0daa9",
  ],
  BEAUTY: [
    "photo-1522335789203-aabd1fc54bc9",
    "photo-1596462502278-27bfdc403348",
    "photo-1571781926291-c477ebfd024b",
    "photo-1556228720-195a672e8a03",
    "photo-1570172619644-dfd03ed5d881",
    "photo-1560750588-73207b1ef5b8",
    "photo-1620916566398-39f1143ab7be",
    "photo-1598440947619-2c35fc9aa908",
    "photo-1616394584738-fc6e612e71b9",
    "photo-1512496015851-a90fb38ba796",
    "photo-1608248543803-ba4f8c70ae0b",
    "photo-1586495777744-4413f21062fa",
    "photo-1487412947147-5cebf100ffc2",
    "photo-1522337360788-8b13dee7a37e",
    "photo-1596178065887-1198b6148b2b",
    "photo-1519699047748-de8e457a634e",
    "photo-1583241800698-e8ab01830a07",
    "photo-1596704017254-9b121068fb31",
    "photo-1576091160399-112ba8d25d1d",
    "photo-1600612253971-422e7f7faeb6",
  ],
  FITNESS: [
    "photo-1571019613454-1cb2f99b2d8b",
    "photo-1534438327276-14e5300c3a48",
    "photo-1517836357463-d25dfeac3438",
    "photo-1574680096145-d05b474e2155",
    "photo-1517838277536-f5f99be501cd",
    "photo-1549060279-7e168fcee0c2",
    "photo-1581009146145-b5ef050c2e1e",
    "photo-1576678927484-cc907957088c",
    "photo-1599058917212-d750089bc07e",
    "photo-1554284126-aa88f22d8b74",
    "photo-1526506118085-60ce8714f8c5",
    "photo-1548690312-e3b507d8c110",
    "photo-1540497077202-7c8a3999166f",
    "photo-1517963879433-6ad2b056d712",
    "photo-1594737625785-a6cbdabd333c",
    "photo-1583454110551-21f2fa2afe61",
    "photo-1605296867304-46d5465a13f1",
    "photo-1584735935682-2f2b69dff9d2",
    "photo-1601422407692-ec4eeec1d9b3",
    "photo-1550345332-09e3ac987658",
  ],
  LIFESTYLE: [
    "photo-1538688525198-9b88f6f53126",
    "photo-1511671782779-c97d3d27a1d4",
    "photo-1533174072545-7a4b6ad7a6c3",
    "photo-1492684223066-81342ee5ff30",
    "photo-1517457373958-b7bdd4587205",
    "photo-1531058020387-3be344556be6",
    "photo-1545987796-200677ee1011",
    "photo-1577720580479-7d839d829c73",
    "photo-1470229722913-7c0e2dbbafd3",
    "photo-1501594907352-04cda38ebc29",
    "photo-1514933651103-005eec06c04b",
    "photo-1496442226666-8d4d0e62e6e9",
    "photo-1540959733332-eab4deabeeaf",
    "photo-1506197603052-3cc9c3a201bd",
    "photo-1528164344705-47542687000d",
    "photo-1459749411175-04bf5292ceea",
    "photo-1506929562872-bb421503ef21",
    "photo-1469854523086-cc02fe5d8800",
    "photo-1527631746610-bca00a040d60",
    "photo-1504384308090-c894fdcc538d",
  ],
};

const MERCHANT_POOL: Record<
  ExtraCat,
  Array<{ merchant: string; title: string }>
> = {
  "FOOD & DRINK": [
    { merchant: "Joe's Pizza", title: "Slice culture series" },
    { merchant: "Levain Bakery", title: "Cookie launch story" },
    { merchant: "Veselka", title: "Pierogi night feature" },
    { merchant: "Russ & Daughters", title: "Bagel + lox campaign" },
    { merchant: "Smorgasburg", title: "Weekend market vlog" },
    { merchant: "Time Out Market", title: "Vendor crawl reel" },
    { merchant: "Brooklyn Bowl", title: "Live show + dinner combo" },
    { merchant: "Tartine Bakery", title: "Sourdough morning post" },
    { merchant: "Roberta's Pizza", title: "Wood-fired pizza vlog" },
    { merchant: "Frenchette", title: "Bistro tasting menu" },
    { merchant: "Carbone", title: "Sunday red sauce dinner" },
    { merchant: "Estela", title: "Tasting menu chef intro" },
    { merchant: "Don Angie", title: "Pinwheel lasagna feature" },
    { merchant: "Lilia", title: "Brooklyn pasta date night" },
    { merchant: "Dhamaka", title: "Indo-Chinese feast table" },
    { merchant: "Win Son", title: "Taiwanese-American brunch" },
    { merchant: "Di An Di", title: "Vietnamese coffee + pho reel" },
  ],
  RETAIL: [
    { merchant: "Aritzia", title: "Spring drop styling" },
    { merchant: "Aimé Leon Dore", title: "ALD weekend lookbook" },
    { merchant: "Kith", title: "Sneaker drop campaign" },
    { merchant: "Reformation", title: "Sustainable wedding edit" },
    { merchant: "Patagonia", title: "Outdoor essentials reel" },
    { merchant: "Warby Parker", title: "Frame fitting story" },
    { merchant: "Off-White", title: "Streetwear capsule" },
    { merchant: "Apple 5th Ave", title: "Product unboxing reel" },
    { merchant: "Glossier (retail)", title: "Showroom pop-up" },
    { merchant: "MoMA Design Store", title: "Curated gift guide" },
    { merchant: "Goyard NYC", title: "Heritage trunk story" },
    { merchant: "Hermès Madison", title: "Silk scarf editorial" },
    { merchant: "Brunello Cucinelli", title: "Cashmere capsule" },
    { merchant: "Tom Ford", title: "Tailoring atelier visit" },
    { merchant: "Byredo", title: "Fragrance + leather pop-up" },
    { merchant: "Dover Street Market", title: "Multi-brand concept walk" },
    { merchant: "Issey Miyake Tribeca", title: "Pleats Please editorial" },
  ],
  WELLNESS: [
    { merchant: "Aire Ancient Baths", title: "Thermal bath tour" },
    { merchant: "The Well NYC", title: "Holistic membership reel" },
    { merchant: "Heyday Skincare", title: "Facial walkthrough story" },
    { merchant: "The Standard Spa", title: "Hotel spa journey" },
    { merchant: "Modrn Sanctuary", title: "Sound bath experience" },
    { merchant: "Salt Cave", title: "Halotherapy first-timer" },
    { merchant: "The Lanby", title: "Concierge medicine intro" },
    { merchant: "Yoga to the People", title: "Donation-based class vlog" },
    { merchant: "Equinox Spa", title: "Massage + recovery feature" },
    { merchant: "Aman New York", title: "Five-hour spa journey" },
    { merchant: "Mandara at Plaza", title: "Couples retreat story" },
    { merchant: "Inscape Meditation", title: "Guided session reel" },
    { merchant: "Bathhouse Wburg", title: "Russian-Turkish plunge" },
    { merchant: "QC NY Spa", title: "Governors Island thermal" },
    { merchant: "The Class NYC", title: "Cathartic movement session" },
    { merchant: "Woom Center", title: "Gong bath immersion" },
    { merchant: "WTHN", title: "Acupuncture intro story" },
  ],
  BEAUTY: [
    { merchant: "Sephora Times Sq", title: "Beauty haul reel" },
    { merchant: "Charlotte Tilbury", title: "Pillow Talk launch" },
    { merchant: "Drunk Elephant", title: "Skincare routine demo" },
    { merchant: "Le Labo", title: "Fragrance discovery" },
    { merchant: "Aesop", title: "Hand cream ritual story" },
    { merchant: "Diptyque", title: "Candle aesthetic post" },
    { merchant: "Mecca Cosmetica", title: "Product expert chat" },
    { merchant: "Rare Beauty", title: "Liquid blush tutorial" },
    { merchant: "La Mer", title: "Treatment lotion ritual" },
    { merchant: "Augustinus Bader", title: "TFC8 deep-dive" },
    { merchant: "Sisley Paris", title: "Phyto-firming masterclass" },
    { merchant: "Tatcha", title: "Rice-water ritual demo" },
    { merchant: "111Skin", title: "Gold-mask facial reel" },
    { merchant: "Boy Smells", title: "Candle + cologne layering" },
    { merchant: "Violette_FR", title: "French-girl beauty class" },
    { merchant: "Kjaer Weis", title: "Refillable luxury unboxing" },
    { merchant: "Westman Atelier", title: "Clean-luxury masterclass" },
  ],
  FITNESS: [
    { merchant: "Barry's Tribeca", title: "Red room HIIT debut" },
    { merchant: "SoulCycle", title: "45-min ride + recovery" },
    { merchant: "Y7 Studio", title: "Hot yoga flow story" },
    { merchant: "Tone House", title: "Athletic cross-train" },
    { merchant: "F45 Williamsburg", title: "Functional 45-min reel" },
    { merchant: "Rumble Boxing", title: "10-round boxing class" },
    { merchant: "Throne Boxing", title: "1:1 trainer session" },
    { merchant: "Equinox HY", title: "Member day vlog" },
    { merchant: "Dogpound", title: "Celebrity-trainer session" },
    { merchant: "Solid Core", title: "50-min core class" },
    { merchant: "Crunch Signature", title: "Premium open-gym day" },
    { merchant: "Peloton Studio", title: "Live ride behind the scenes" },
    { merchant: "Switch Playground", title: "Multi-modality circuit" },
    { merchant: "CrossFit NYC", title: "Open workout reel" },
    { merchant: "Mile High Run Club", title: "Treadmill sprint class" },
    { merchant: "CITYROW", title: "Indoor rowing intro" },
  ],
  LIFESTYLE: [
    { merchant: "Brooklyn Botanic", title: "Cherry blossom walk" },
    { merchant: "The Met", title: "Costume Institute reel" },
    { merchant: "MoMA", title: "Special exhibit feature" },
    { merchant: "The High Line", title: "Sunset stroll story" },
    { merchant: "Fotografiska", title: "Photo exhibit + dinner" },
    { merchant: "Brooklyn Bridge Pk", title: "DUMBO sunrise vlog" },
    { merchant: "House of Yes", title: "Cabaret night reel" },
    { merchant: "The Whitney", title: "American art tour" },
    { merchant: "9/11 Memorial", title: "Reflective visit story" },
    { merchant: "Top of the Rock", title: "Skyline panorama post" },
    { merchant: "The Frick", title: "Reopened collection tour" },
    { merchant: "Lincoln Center", title: "Opening night gala" },
    { merchant: "Edge Observation", title: "Glass-floor experience" },
    { merchant: "Meow Wolf", title: "Immersive art walkthrough" },
    { merchant: "Sleep No More", title: "Punchdrunk mask night" },
    { merchant: "Color Factory", title: "Interactive installation reel" },
  ],
};

const TAGLINE_POOL: Record<ExtraCat, string[]> = {
  "FOOD & DRINK": [
    "Stop in during golden hour, order three signatures off the new menu, and capture the plates plus the room. We want texture and steam, not influencer poses — slow shutter, real bites.",
    "You'll be there 90 minutes. Two carousel posts plus one reel — the kitchen will plate something off-menu just for you. Voice-over optional, especially if you've got a pet ingredient.",
    "Brunch crowd is the brief. Capture the second pour, the bread basket landing on the table, the slow-Sunday energy. Bring your camera, bring a friend, eat first then shoot.",
    "The chef wants this to feel like discovery, not a press shot. Walk in, sit at the bar, watch the line work. One reel and two stills — let the kitchen be the protagonist.",
    "We're not after a tasting menu reel. Show how a real Tuesday-night meal feels here — pacing, lighting, conversation. End on the dessert that no one asked for but always arrives.",
    "Three courses, no flash. The chef is tired of overhead flatlays — capture the table from the side, show the hands, the steam, the bread tearing. Sound on if you've got something to say about the wine.",
    "Post-shift meal at the bar. The sous-chef makes something that's never on the menu. Catch the conversation, the plate, the empty glass. One reel, your real voice, their real food.",
    "Market walk — seven vendors, pick the three that stop you. Film what you buy, cook one thing at home, tag the producer. Behind-the-counter moments are gold; ask before you shoot.",
  ],
  RETAIL: [
    "Try on three looks from the spring drop and post the one you'd actually wear. We'll style with the buyer if you want, or browse solo — we trust your eye more than a shot list.",
    "Walk through the showroom, find the piece that catches you, and tell us why. One reel, voice-over preferred. Outfit credit and a full-body fit shot required so the silhouette reads.",
    "Spend an hour in the fitting room with the new collection. Show the unboxing energy — tags coming off, fabric meeting body, the moment you decide which ones come home.",
    "We want how a piece moves, not how it sits on the rack. Walk the block in it, sit in a café in it, photograph it doing nothing. Real fabric on a real day.",
    "Treat this like a personal lookbook shoot. Two outfits across two locations — one urban, one quiet. We provide the looks, you provide the framing and the second-best smile.",
    "New season, new palette. Pull four looks that tell a story arc — morning meeting, lunch with a friend, gallery opening, late cab home. The brand wants narrative, not poses.",
    "Come to the archive sale. Nothing is precious — try on vintage pieces alongside the current line, show how they pair. The buyer will walk you through construction details if you're curious.",
    "Street-to-store: wear their jacket on a full-day loop and end back at the shop to return it. Document the jacket's day, not yours — let the garment be the protagonist.",
  ],
  WELLNESS: [
    "You'll get the full 60-minute treatment plus 30 minutes in the relaxation suite. Capture the rituals, not just the results — share what self-care actually feels like, not what it looks like.",
    "Document a full session from arrival to glow. The therapist will narrate the steps if you want context — happy to mic up. We want honest texture, no stock-spa cliché.",
    "Three hours, no phone for the first hour. Then capture what you remember — the temperature of the water, the smell of the room, the part of your body that finally let go.",
    "This is a quiet brief. One reel after the session, voice-over only if it serves. We want the ten-minute calm afterwards, not the before-and-after thirst trap.",
    "Bring a friend, do the couples experience, and let one of you hold the camera. Show what restoration actually looks like when it's lived, not performed for the grid.",
    "Arrive early, observe the empty space before it fills. The founder will tell you the origin story while you sit in the salt room. No product placement — this is about the architecture of rest.",
    "Your assignment is a full circuit: sauna, plunge, steam, rest. Film nothing during the circuit — all content comes after, from memory and what your body remembers. Trust the afterglow.",
    "Solo session, no music. The practitioner will explain each point as they place the needle. Capture the stillness, the breath, the ceiling you stare at. This is slow content.",
  ],
  BEAUTY: [
    "Test the new launch on real skin in real light. Apply on camera, give it 15 minutes to set, then share your honest take. Texture, finish, longevity — that's the brief.",
    "Three-product walkthrough — primer, base, finishing spray. We want application energy and an end-of-day check-in. Show the formula working, not just sitting on the vanity.",
    "Get the brand-side facial first, then go home and rebuild the routine yourself. Two posts: one in the chair, one at your sink. Show the carryover, not just the salon.",
    "We want unfiltered first-impression skin. Bare face, single product, natural light, voice-over your reaction in real time. The brand will repost if your honesty hits.",
    "Spend an hour with the SA picking three products for your routine. Document the consultation, the swatches, the thinking. Editorial close-ups encouraged on hands and lips.",
    "Counter-to-counter: visit three stations in the store, get a different product at each. Film the application, the texture, the lighting. End with a full-face shot using only what you picked.",
    "Bring your current routine in a clear bag. The SA will audit it live — what stays, what goes, what upgrades. Film the edit as it happens. Real advice, real reactions, no script.",
    "Night-routine only. No morning-light perfection — bathroom mirror, end-of-day skin, products landing on tired skin. The brand wants real, after-everything honesty.",
  ],
  FITNESS: [
    "Take a full class, document the burn, share the recovery. Pre-class outfit shot plus a post-class story arc — sweat included. We're not selling perfection, we're selling intensity.",
    "45-minute heated flow followed by a smoothie in the studio café. Capture the focus, the breath, the stretch you needed. End with one quiet frame in the recovery room.",
    "Show what one full class actually demands. Mic'd up if you want — the trainer will work with you on form. We want the third round, not the first, when it starts to count.",
    "Document a beat-the-record session. Two stills (warm-up, finisher) plus one reel of your strongest set. Caption it like you'd caption it for yourself, no marketing voice.",
    "Bring a workout buddy and split the cardio-strength block. Capture the partner energy — spotting, high-fives, the look across the room mid-set. Real gym, real chemistry.",
    "Start cold — no warm-up footage, no locker-room content. First frame is mid-rep, and we stay there until you're done. Post-class, sit on the bench and say one thing. That's the reel.",
    "Bring your PR numbers. The coach will program around them — film the lifts, the chalk, the timer. We want the 60 seconds before your heaviest set, not the celebration after.",
    "Partner workout: one films while one works, then switch. The footage should make it impossible to tell who was behind the camera. We want chemistry, not choreography.",
  ],
  LIFESTYLE: [
    "Spend a slow morning at the venue. We're not after the obvious money shots — we want what catches your eye when you're not trying. One reel, two stills, your aesthetic.",
    "Cover the experience the way you'd cover a Saturday for yourself. No script, no shot list — just bring your taste and capture three frames worth keeping past the post.",
    "Walk the gallery at off-hours, sit with one piece for ten minutes, share what stuck. Slow content over fast — frame the room, not just the artwork on the wall.",
    "Document a full sunset arc from the rooftop. Wide, mid, close — the city changing color, the people changing posture, the conversation getting quieter. One carousel, no narration.",
    "Pretend you're hosting a friend who's never been. Where do you start, what do you point out, where do you end? Three stops, three stories, your real route.",
    "Come after hours — the building is empty and the light changes every ten minutes. You have 90 minutes alone with the work and your camera. No other visitors, no crowd noise.",
    "Night event: arrive at doors-open, leave at peak. Film the energy curve — empty room becoming alive, the coat check filling up, the moment the DJ reads the crowd right.",
    "We don't need another tourist reel. Find the corner nobody photographs, the detail the architect cared about, the angle that makes the building feel like it's breathing.",
  ],
};

function pseudoRandom(seed: number): number {
  // Mulberry32 deterministic — keeps fixtures stable across renders
  let t = seed + 0x6d2b79f5;
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}

function generateExtraCampaigns(): Campaign[] {
  const cats: ExtraCat[] = [
    "FOOD & DRINK",
    "RETAIL",
    "WELLNESS",
    "BEAUTY",
    "FITNESS",
    "LIFESTYLE",
  ];
  const out: Campaign[] = [];

  let id = 100;
  for (const cat of cats) {
    const merchants = MERCHANT_POOL[cat];
    const imgs = IMG_POOLS[cat];
    merchants.forEach((m, i) => {
      const seed = id;
      const r = pseudoRandom(seed);
      const r2 = pseudoRandom(seed + 1);
      const r3 = pseudoRandom(seed + 2);
      const r4 = pseudoRandom(seed + 3);
      const hood = NEIGHBORHOODS[Math.floor(r * NEIGHBORHOODS.length)];
      // jitter ±0.005° (~500m) so multiple pins don't stack
      const lat = hood.lat + (r2 - 0.5) * 0.01;
      const lng = hood.lng + (r3 - 0.5) * 0.01;

      const payUnits: PayUnit[] = [
        "visit",
        "post",
        "reel",
        "story",
        "campaign",
      ];
      const payUnit = payUnits[Math.floor(r4 * payUnits.length)];
      const cashPay =
        payUnit === "campaign"
          ? 80 + Math.floor(r * 220) // $80–300 total
          : payUnit === "reel"
            ? 60 + Math.floor(r * 120) // $60–180
            : payUnit === "post"
              ? 30 + Math.floor(r * 90) // $30–120
              : payUnit === "visit"
                ? 25 + Math.floor(r * 75) // $25–100
                : 12 + Math.floor(r * 28); // $12–40 story

      const slotsTotal = 4 + Math.floor(r2 * 18);
      const slotsRemaining = Math.max(
        1,
        Math.floor(slotsTotal * (0.15 + r3 * 0.85)),
      );
      const distanceMi = +(0.3 + r4 * 4.7).toFixed(1);
      const formats: Format[] = ["in-person", "remote", "hybrid"];
      const format =
        cat === "RETAIL" || cat === "FOOD & DRINK" || cat === "FITNESS"
          ? "in-person"
          : formats[Math.floor(r2 * 3)];

      const matchScore = 50 + Math.floor(r3 * 49);
      const tier: TierLevel =
        r4 < 0.35
          ? 1
          : r4 < 0.6
            ? 2
            : r4 < 0.78
              ? 3
              : r4 < 0.9
                ? 4
                : r4 < 0.97
                  ? 5
                  : 6;
      const dayOffset = 4 + Math.floor(r * 28);
      const deadline = new Date(2026, 4, 5 + dayOffset)
        .toISOString()
        .slice(0, 10);

      const imgIdx = Math.floor(r2 * imgs.length);
      const altIdx =
        (imgIdx + 1 + Math.floor(r3 * (imgs.length - 1))) % imgs.length;
      const thirdIdx =
        (altIdx + 1 + Math.floor(r4 * (imgs.length - 2))) % imgs.length;
      const images = [
        `https://images.unsplash.com/${imgs[imgIdx]}?w=480&h=600&fit=crop&q=72`,
        `https://images.unsplash.com/${imgs[altIdx]}?w=480&h=600&fit=crop&q=72`,
        `https://images.unsplash.com/${imgs[thirdIdx]}?w=480&h=600&fit=crop&q=72`,
      ];

      const taglines = TAGLINE_POOL[cat];
      const tagline = taglines[Math.floor(r * taglines.length)];

      out.push({
        id: `disc-${String(id).padStart(3, "0")}`,
        title: m.title,
        tagline,
        merchantName: m.merchant,
        neighborhood: hood.name,
        category: cat,
        cashPay,
        payUnit,
        deliverables: [
          payUnit === "campaign"
            ? {
                type: "post",
                count: 3,
                unitPay: Math.floor(cashPay / 3),
                estHoursEach: 1.5,
              }
            : {
                type:
                  payUnit === "story"
                    ? "story"
                    : payUnit === "reel"
                      ? "reel"
                      : payUnit === "visit"
                        ? "visit"
                        : "post",
                count: 1 + Math.floor(r * 3),
                unitPay: cashPay,
                estHoursEach:
                  payUnit === "story" ? 0.25 : payUnit === "visit" ? 0.75 : 1.5,
              },
        ],
        slotsTotal,
        slotsRemaining,
        distanceMi,
        format,
        matchScore,
        deadlineIso: deadline,
        lat,
        lng,
        images,
        minimumTier: tier,
      });
      id++;
      void i;
    });
  }
  return out;
}

/* ── Asian-focus expansion — 50 campaigns in Chinatown / Flushing / K-Town / Sunset Park ── */

const ASIAN_IMG_POOL = [
  "photo-1526318896980-cf78c088247c",
  "photo-1569718212165-3a8278d5f624",
  "photo-1563245372-f21724e3856d",
  "photo-1555126634-323283e090fa",
  "photo-1534422298391-e4f8c172dddb",
  "photo-1617196034796-73dfa7b1fd56",
  "photo-1585032226651-759b368d7246",
  "photo-1553163147-622ab57be1c7",
  "photo-1583032015879-e5022cb87c3b",
  "photo-1558857563-b371033873b8",
  "photo-1627308595229-7830a5c91f9f",
  "photo-1550745165-9bc0b252726f",
  "photo-1533106418989-88406c7cc8ca",
  "photo-1563805042-7684c019e1cb",
  "photo-1544787219-7f47ccb76574",
  "photo-1540914124281-342587941389",
  "photo-1580651214613-f4692d6d138f",
  "photo-1571167366136-b57e07761625",
  "photo-1551504734-5ee1c4a1479b",
  "photo-1574484284002-952d92456975",
  "photo-1513104890138-7c749659a591",
  "photo-1594212699903-ec8a3eca50f5",
  "photo-1596560548464-f010549b84d7",
  "photo-1545093149-618ce3bcf49d",
  "photo-1582878826629-29b7ad1cdc43",
  "photo-1498654896293-37aacf113fd9",
  "photo-1529692236671-f1f6cf9683ba",
  "photo-1540648639573-8c848de23f0a",
  "photo-1567337710282-00832b415979",
  "photo-1504544750208-dc0358e63f7f",
  "photo-1516450360452-9312f5e86fc7",
];

const ASIAN_HOODS: Array<{ name: string; lat: number; lng: number }> = [
  { name: "Chinatown, NYC", lat: 40.7158, lng: -73.997 },
  { name: "Flushing, QNS", lat: 40.7628, lng: -73.8307 },
  { name: "K-Town, NYC", lat: 40.748, lng: -73.9872 },
  { name: "Sunset Park, BK", lat: 40.6454, lng: -74.0104 },
  { name: "Elmhurst, QNS", lat: 40.7368, lng: -73.878 },
  { name: "SoHo, NYC", lat: 40.7237, lng: -74.0014 },
  { name: "LES, NYC", lat: 40.715, lng: -73.9843 },
  { name: "East Village, NYC", lat: 40.7265, lng: -73.9815 },
  { name: "Jackson Heights, QNS", lat: 40.7476, lng: -73.8838 },
  { name: "Bensonhurst, BK", lat: 40.6019, lng: -73.9936 },
];

const ASIAN_MERCHANTS: Array<{
  merchant: string;
  title: string;
  category: ExtraCat;
  hood: number;
}> = [
  // Chinese restaurants — Chinatown
  {
    merchant: "Joe's Shanghai",
    title: "Soup dumpling masterclass",
    category: "FOOD & DRINK",
    hood: 0,
  },
  {
    merchant: "Xi'an Famous Foods",
    title: "Hand-pulled noodle reel",
    category: "FOOD & DRINK",
    hood: 0,
  },
  {
    merchant: "Nom Wah Tea Parlor",
    title: "Dim sum cart chase",
    category: "FOOD & DRINK",
    hood: 0,
  },
  {
    merchant: "Wo Hop",
    title: "Late-night Cantonese session",
    category: "FOOD & DRINK",
    hood: 0,
  },
  {
    merchant: "456 Shanghai Cuisine",
    title: "Lionhead meatball feature",
    category: "FOOD & DRINK",
    hood: 0,
  },
  {
    merchant: "Great NY Noodletown",
    title: "Salt-baked seafood vlog",
    category: "FOOD & DRINK",
    hood: 0,
  },
  {
    merchant: "Mei Lai Wah",
    title: "Pineapple bun morning run",
    category: "FOOD & DRINK",
    hood: 0,
  },
  {
    merchant: "Buddha Bodai",
    title: "Vegan dim sum tasting",
    category: "FOOD & DRINK",
    hood: 0,
  },

  // Flushing food scene
  {
    merchant: "Nan Xiang Xiao Long Bao",
    title: "XLB golden hour shoot",
    category: "FOOD & DRINK",
    hood: 1,
  },
  {
    merchant: "Szechuan Mountain House",
    title: "Mapo tofu fire reel",
    category: "FOOD & DRINK",
    hood: 1,
  },
  {
    merchant: "White Bear",
    title: "Wontons in chili oil story",
    category: "FOOD & DRINK",
    hood: 1,
  },
  {
    merchant: "Tianjin Dumpling House",
    title: "Lamb dumpling feast",
    category: "FOOD & DRINK",
    hood: 1,
  },
  {
    merchant: "Fu Run",
    title: "Muslim lamb chop grill",
    category: "FOOD & DRINK",
    hood: 1,
  },
  {
    merchant: "Corner 28",
    title: "Market stall dumpling vlog",
    category: "FOOD & DRINK",
    hood: 1,
  },
  {
    merchant: "Kung Fu Xiao Long Bao",
    title: "Pan-fried bun ASMR",
    category: "FOOD & DRINK",
    hood: 1,
  },
  {
    merchant: "New World Mall Food Court",
    title: "Vendor crawl challenge",
    category: "FOOD & DRINK",
    hood: 1,
  },

  // Boba & tea shops
  {
    merchant: "Tiger Sugar NYC",
    title: "Brown sugar boba reel",
    category: "FOOD & DRINK",
    hood: 0,
  },
  {
    merchant: "Gong Cha Chinatown",
    title: "Milk tea taste test",
    category: "FOOD & DRINK",
    hood: 0,
  },
  {
    merchant: "Xing Fu Tang",
    title: "Stir-fried boba live",
    category: "FOOD & DRINK",
    hood: 1,
  },
  {
    merchant: "TP Tea Flushing",
    title: "Oolong latte drop",
    category: "FOOD & DRINK",
    hood: 1,
  },
  {
    merchant: "CoCo Fresh Tea",
    title: "3 pm pick-me-up story",
    category: "FOOD & DRINK",
    hood: 3,
  },
  {
    merchant: "Boba Guys SoHo",
    title: "Matcha horchata launch",
    category: "FOOD & DRINK",
    hood: 5,
  },
  {
    merchant: "Teazzi LES",
    title: "Cheese foam pour reel",
    category: "FOOD & DRINK",
    hood: 6,
  },
  {
    merchant: "Möge Tee K-Town",
    title: "Dirty boba spotlight",
    category: "FOOD & DRINK",
    hood: 2,
  },

  // K-Town food + karaoke
  {
    merchant: "Jongro BBQ",
    title: "Galbi grill tabletop cam",
    category: "FOOD & DRINK",
    hood: 2,
  },
  {
    merchant: "BCD Tofu House",
    title: "Soondubu midnight feature",
    category: "FOOD & DRINK",
    hood: 2,
  },
  {
    merchant: "Her Name is Han",
    title: "Modern Korean tasting",
    category: "FOOD & DRINK",
    hood: 2,
  },
  {
    merchant: "Gagopa Karaoke",
    title: "K-room sing-off reel",
    category: "LIFESTYLE",
    hood: 2,
  },
  {
    merchant: "Sunrise Karaoke",
    title: "Midnight voice battle",
    category: "LIFESTYLE",
    hood: 2,
  },

  // Arcades & gaming
  {
    merchant: "Chinatown Fair",
    title: "Street Fighter tourney cam",
    category: "LIFESTYLE",
    hood: 0,
  },
  {
    merchant: "Round1 Flushing",
    title: "Claw machine challenge",
    category: "LIFESTYLE",
    hood: 1,
  },
  {
    merchant: "Barcade Williamsburg",
    title: "Retro cabinet crawl",
    category: "LIFESTYLE",
    hood: 5,
  },
  {
    merchant: "K-Star Arcade",
    title: "Rhythm game showdown",
    category: "LIFESTYLE",
    hood: 2,
  },
  {
    merchant: "VR World NYC",
    title: "Immersive arcade vlog",
    category: "LIFESTYLE",
    hood: 7,
  },

  // Hot pot / specialty
  {
    merchant: "Haidilao Times Sq",
    title: "Hot pot noodle dance reel",
    category: "FOOD & DRINK",
    hood: 2,
  },
  {
    merchant: "99 Favor Taste",
    title: "AYCE hot pot speed run",
    category: "FOOD & DRINK",
    hood: 0,
  },
  {
    merchant: "Lao Sze Chuan",
    title: "Dry chili chicken dare",
    category: "FOOD & DRINK",
    hood: 0,
  },

  // Chinese bakeries & desserts
  {
    merchant: "Fay Da Bakery",
    title: "Egg tart morning lineup",
    category: "FOOD & DRINK",
    hood: 0,
  },
  {
    merchant: "Taipan Bakery",
    title: "Mooncake season preview",
    category: "FOOD & DRINK",
    hood: 1,
  },
  {
    merchant: "Mango Mango Dessert",
    title: "Sago pudding ASMR",
    category: "FOOD & DRINK",
    hood: 0,
  },

  // Asian beauty & wellness
  {
    merchant: "Ohm Spa Chinatown",
    title: "Tui na massage intro",
    category: "WELLNESS",
    hood: 0,
  },
  {
    merchant: "Juvenex Spa K-Town",
    title: "Jjimjilbang overnight",
    category: "WELLNESS",
    hood: 2,
  },
  {
    merchant: "SB Beauty Flushing",
    title: "K-beauty haul + facial",
    category: "BEAUTY",
    hood: 1,
  },
  {
    merchant: "SkinGlow Chinatown",
    title: "Jade roller ritual reel",
    category: "BEAUTY",
    hood: 0,
  },

  // Asian retail
  {
    merchant: "Pearl River Mart",
    title: "Lunar New Year haul",
    category: "RETAIL",
    hood: 5,
  },
  {
    merchant: "Kinokuniya NYC",
    title: "Manga shelf dive story",
    category: "RETAIL",
    hood: 2,
  },
  {
    merchant: "Muji 5th Ave",
    title: "Minimalist essentials edit",
    category: "RETAIL",
    hood: 2,
  },
  {
    merchant: "Uniqlo SoHo",
    title: "Heattech layer lookbook",
    category: "RETAIL",
    hood: 5,
  },

  // Asian fitness
  {
    merchant: "Shaolin Temple NYC",
    title: "Kung fu basics class",
    category: "FITNESS",
    hood: 0,
  },
  {
    merchant: "Pure Yoga East",
    title: "Yin yoga candlelit flow",
    category: "FITNESS",
    hood: 7,
  },
];

const ASIAN_TAGLINES = [
  "The kitchen runs on instinct — no recipe books, no timers. Arrive hungry, film the process, show what fifty years of muscle memory looks like. One reel, sound on, let the wok do the talking.",
  "Third-generation family spot. They don't do PR — you're the first creator they've said yes to. Honor the craft: no trending audio, no fast cuts, just the food and the hands that made it.",
  "Walk through the food court like you're giving a friend the insider tour. Hit five stalls, order one thing at each, rank them honestly on camera. No diplomacy — we want your real take.",
  "Boba shop at peak hour. Film the pour, the shake, the first sip. The line behind you is the backdrop — don't hide the chaos, it's the energy. Vertical reel, natural sound.",
  "It's a karaoke box at midnight and the reverb is terrible. That's the point. Film the song, the laughter, the menu of snacks. One story set, no edits — raw and loud.",
  "Dim sum cart comes to you — don't chase it. Sit near the kitchen door, watch the parade, flag what looks good. Overhead shots of the table when it's full, not when it's styled.",
  "This arcade hasn't changed since '98. The carpet is loud, the cabinets are louder. Play three games, film the one where you almost win. The crowd reaction is the content.",
  "Hot pot table for four, but you're here alone with a split pot. Film the ritual — the broth rolling, the meat ribbons, the timer discipline. Solo hot pot is a whole mood; own it.",
  "Night market energy but indoors. The fluorescent light is honest — don't color-correct it. Grab the dish that steams the most, eat it at the counter, talk about texture.",
  "Bakery opens at 6 AM. Be there at 5:50, catch the first tray of egg tarts coming out. The owner doesn't speak much English — let the pastry speak. Close-ups, warm tones, no filter.",
];

function generateAsianCampaigns(): Campaign[] {
  const out: Campaign[] = [];
  let id = 200;

  for (const m of ASIAN_MERCHANTS) {
    const seed = id + 7777;
    const r = pseudoRandom(seed);
    const r2 = pseudoRandom(seed + 1);
    const r3 = pseudoRandom(seed + 2);
    const r4 = pseudoRandom(seed + 3);

    const hood = ASIAN_HOODS[m.hood];
    const lat = hood.lat + (r2 - 0.5) * 0.008;
    const lng = hood.lng + (r3 - 0.5) * 0.008;

    const payUnits: PayUnit[] = ["visit", "post", "reel", "story", "campaign"];
    const payUnit = payUnits[Math.floor(r4 * payUnits.length)];
    const cashPay =
      payUnit === "campaign"
        ? 80 + Math.floor(r * 200)
        : payUnit === "reel"
          ? 50 + Math.floor(r * 130)
          : payUnit === "post"
            ? 25 + Math.floor(r * 85)
            : payUnit === "visit"
              ? 20 + Math.floor(r * 60)
              : 10 + Math.floor(r * 25);

    const slotsTotal = 3 + Math.floor(r2 * 15);
    const slotsRemaining = Math.max(
      1,
      Math.floor(slotsTotal * (0.1 + r3 * 0.9)),
    );
    const distanceMi = +(0.2 + r4 * 5.5).toFixed(1);
    const formats: Format[] = ["in-person", "remote", "hybrid"];
    const format =
      m.category === "RETAIL" ||
      m.category === "FOOD & DRINK" ||
      m.category === "FITNESS"
        ? "in-person"
        : formats[Math.floor(r2 * 3)];

    const matchScore = 55 + Math.floor(r3 * 44);
    const tier: TierLevel =
      r4 < 0.3
        ? 1
        : r4 < 0.55
          ? 2
          : r4 < 0.75
            ? 3
            : r4 < 0.88
              ? 4
              : r4 < 0.96
                ? 5
                : 6;

    const dayOffset = 3 + Math.floor(r * 30);
    const deadline = new Date(2026, 4, 5 + dayOffset)
      .toISOString()
      .slice(0, 10);

    const imgIdx = Math.floor(r * ASIAN_IMG_POOL.length);
    const altIdx =
      (imgIdx + 1 + Math.floor(r3 * (ASIAN_IMG_POOL.length - 1))) %
      ASIAN_IMG_POOL.length;
    const thirdIdx =
      (altIdx + 1 + Math.floor(r4 * (ASIAN_IMG_POOL.length - 2))) %
      ASIAN_IMG_POOL.length;
    const images = [
      `https://images.unsplash.com/${ASIAN_IMG_POOL[imgIdx]}?w=480&h=600&fit=crop&q=72`,
      `https://images.unsplash.com/${ASIAN_IMG_POOL[altIdx]}?w=480&h=600&fit=crop&q=72`,
      `https://images.unsplash.com/${ASIAN_IMG_POOL[thirdIdx]}?w=480&h=600&fit=crop&q=72`,
    ];

    const tagline = ASIAN_TAGLINES[Math.floor(r2 * ASIAN_TAGLINES.length)];

    out.push({
      id: `disc-${String(id).padStart(3, "0")}`,
      title: m.title,
      tagline,
      merchantName: m.merchant,
      neighborhood: hood.name,
      category: m.category,
      cashPay,
      payUnit,
      deliverables: [
        payUnit === "campaign"
          ? {
              type: "post",
              count: 3,
              unitPay: Math.floor(cashPay / 3),
              estHoursEach: 1.5,
            }
          : {
              type:
                payUnit === "story"
                  ? "story"
                  : payUnit === "reel"
                    ? "reel"
                    : payUnit === "visit"
                      ? "visit"
                      : "post",
              count: 1 + Math.floor(r * 3),
              unitPay: cashPay,
              estHoursEach:
                payUnit === "story" ? 0.25 : payUnit === "visit" ? 0.75 : 1.5,
            },
      ],
      slotsTotal,
      slotsRemaining,
      distanceMi,
      format,
      matchScore,
      deadlineIso: deadline,
      lat,
      lng,
      images,
      minimumTier: tier,
    });
    id++;
  }
  return out;
}

/** Public mock fixtures — 10 hand-crafted + 100 generated + 50 Asian-focus = 160 total. */
export const MOCK_CAMPAIGNS: Campaign[] = [
  ...STATIC_CAMPAIGNS,
  ...generateExtraCampaigns(),
  ...generateAsianCampaigns(),
];
