import { NextResponse } from "next/server";

const BASE_URL = "https://pushnyc.co";
const FEED_URL = `${BASE_URL}/rss/merchants`;

// Mock active merchant data — replace with Supabase query when live
// Structured for consumption by local business directories (Yelp, Google, Foursquare, etc.)
const ACTIVE_MERCHANTS = [
  {
    id: "blank-street-coffee",
    name: "Blank Street Coffee",
    category: "Coffee & Café",
    neighborhood: "SoHo",
    address: "284 W Broadway, New York, NY 10013",
    activeCampaigns: 3,
    joinedAt: new Date("2026-01-15"),
  },
  {
    id: "superiority-burger",
    name: "Superiority Burger",
    category: "Food & Drink",
    neighborhood: "East Village",
    address: "119 Avenue A, New York, NY 10009",
    activeCampaigns: 2,
    joinedAt: new Date("2026-01-20"),
  },
  {
    id: "flamingo-estate",
    name: "Flamingo Estate NYC",
    category: "Lifestyle & Retail",
    neighborhood: "Meatpacking District",
    address: "67 Gansevoort St, New York, NY 10014",
    activeCampaigns: 1,
    joinedAt: new Date("2026-02-01"),
  },
  {
    id: "brow-theory",
    name: "Brow Theory",
    category: "Beauty",
    neighborhood: "SoHo",
    address: "38 Prince St, New York, NY 10012",
    activeCampaigns: 2,
    joinedAt: new Date("2026-02-05"),
  },
  {
    id: "estela",
    name: "Estela",
    category: "Fine Dining",
    neighborhood: "SoHo",
    address: "47 E Houston St, New York, NY 10012",
    activeCampaigns: 1,
    joinedAt: new Date("2026-02-10"),
  },
  {
    id: "ivan-ramen",
    name: "Ivan Ramen",
    category: "Food & Drink",
    neighborhood: "Lower East Side",
    address: "25 Clinton St, New York, NY 10002",
    activeCampaigns: 2,
    joinedAt: new Date("2026-02-12"),
  },
  {
    id: "davelles-coffee",
    name: "Davelle's Coffee",
    category: "Coffee & Café",
    neighborhood: "Lower East Side",
    address: "196 Allen St, New York, NY 10002",
    activeCampaigns: 1,
    joinedAt: new Date("2026-02-15"),
  },
  {
    id: "kings-co-imperial",
    name: "Kings Co. Imperial",
    category: "Food & Drink",
    neighborhood: "Williamsburg",
    address: "20 Skillman Ave, Brooklyn, NY 11211",
    activeCampaigns: 2,
    joinedAt: new Date("2026-02-18"),
  },
  {
    id: "dhamaka",
    name: "Dhamaka",
    category: "Food & Drink",
    neighborhood: "Lower East Side",
    address: "37 E Broadway, New York, NY 10002",
    activeCampaigns: 1,
    joinedAt: new Date("2026-02-20"),
  },
  {
    id: "ugly-baby",
    name: "Ugly Baby",
    category: "Food & Drink",
    neighborhood: "Carroll Gardens",
    address: "407 Smith St, Brooklyn, NY 11231",
    activeCampaigns: 2,
    joinedAt: new Date("2026-02-22"),
  },
  {
    id: "claro",
    name: "Claro",
    category: "Food & Drink",
    neighborhood: "Gowanus",
    address: "284 3rd Ave, Brooklyn, NY 11215",
    activeCampaigns: 1,
    joinedAt: new Date("2026-02-25"),
  },
  {
    id: "aunts-et-uncles",
    name: "Aunts et Uncles",
    category: "Coffee & Café",
    neighborhood: "Cobble Hill",
    address: "121 Atlantic Ave, Brooklyn, NY 11201",
    activeCampaigns: 2,
    joinedAt: new Date("2026-03-01"),
  },
  {
    id: "birch-coffee",
    name: "Birch Coffee",
    category: "Coffee & Café",
    neighborhood: "Chelsea",
    address: "56 W 27th St, New York, NY 10001",
    activeCampaigns: 3,
    joinedAt: new Date("2026-03-03"),
  },
  {
    id: "la-contenta",
    name: "La Contenta",
    category: "Food & Drink",
    neighborhood: "Lower East Side",
    address: "102 Norfolk St, New York, NY 10002",
    activeCampaigns: 1,
    joinedAt: new Date("2026-03-05"),
  },
  {
    id: "ssam-bar",
    name: "Ssäm Bar",
    category: "Food & Drink",
    neighborhood: "East Village",
    address: "207 2nd Ave, New York, NY 10003",
    activeCampaigns: 2,
    joinedAt: new Date("2026-03-08"),
  },
  {
    id: "village-yokocho",
    name: "Village Yokocho",
    category: "Food & Drink",
    neighborhood: "East Village",
    address: "8 Stuyvesant St, New York, NY 10003",
    activeCampaigns: 1,
    joinedAt: new Date("2026-03-10"),
  },
  {
    id: "chez-ma-tante",
    name: "Chez Ma Tante",
    category: "Food & Drink",
    neighborhood: "Greenpoint",
    address: "90 Calyer St, Brooklyn, NY 11222",
    activeCampaigns: 2,
    joinedAt: new Date("2026-03-12"),
  },
  {
    id: "oxomoco",
    name: "Oxomoco",
    category: "Food & Drink",
    neighborhood: "Greenpoint",
    address: "128 Greenpoint Ave, Brooklyn, NY 11222",
    activeCampaigns: 1,
    joinedAt: new Date("2026-03-15"),
  },
  {
    id: "don-angie",
    name: "Don Angie",
    category: "Fine Dining",
    neighborhood: "West Village",
    address: "103 Greenwich Ave, New York, NY 10014",
    activeCampaigns: 2,
    joinedAt: new Date("2026-03-18"),
  },
  {
    id: "lilia",
    name: "Lilia",
    category: "Fine Dining",
    neighborhood: "Williamsburg",
    address: "567 Union Ave, Brooklyn, NY 11211",
    activeCampaigns: 1,
    joinedAt: new Date("2026-03-20"),
  },
  {
    id: "por-siempre",
    name: "Por Siempre Mezcal",
    category: "Food & Drink",
    neighborhood: "Bushwick",
    address: "47 Johnson Ave, Brooklyn, NY 11206",
    activeCampaigns: 2,
    joinedAt: new Date("2026-03-22"),
  },
  {
    id: "misi",
    name: "Misi",
    category: "Fine Dining",
    neighborhood: "Williamsburg",
    address: "329 Kent Ave, Brooklyn, NY 11249",
    activeCampaigns: 1,
    joinedAt: new Date("2026-03-24"),
  },
  {
    id: "the-four-horsemen",
    name: "The Four Horsemen",
    category: "Food & Drink",
    neighborhood: "Williamsburg",
    address: "295 Grand St, Brooklyn, NY 11211",
    activeCampaigns: 2,
    joinedAt: new Date("2026-03-26"),
  },
  {
    id: "el-born",
    name: "El Born",
    category: "Food & Drink",
    neighborhood: "Park Slope",
    address: "651 5th Ave, Brooklyn, NY 11215",
    activeCampaigns: 1,
    joinedAt: new Date("2026-03-28"),
  },
  {
    id: "cafe-regular",
    name: "Café Regular",
    category: "Coffee & Café",
    neighborhood: "Park Slope",
    address: "318 11th St, Brooklyn, NY 11215",
    activeCampaigns: 2,
    joinedAt: new Date("2026-04-01"),
  },
  {
    id: "mable-s-smokehouse",
    name: "Mable's Smokehouse",
    category: "Food & Drink",
    neighborhood: "Williamsburg",
    address: "44 Berry St, Brooklyn, NY 11249",
    activeCampaigns: 1,
    joinedAt: new Date("2026-04-03"),
  },
  {
    id: "lucali",
    name: "Lucali",
    category: "Food & Drink",
    neighborhood: "Carroll Gardens",
    address: "575 Henry St, Brooklyn, NY 11231",
    activeCampaigns: 2,
    joinedAt: new Date("2026-04-05"),
  },
  {
    id: "glady-s",
    name: "Glady's",
    category: "Food & Drink",
    neighborhood: "Crown Heights",
    address: "788 Franklin Ave, Brooklyn, NY 11238",
    activeCampaigns: 1,
    joinedAt: new Date("2026-04-07"),
  },
  {
    id: "taqueria-tlaxcalli",
    name: "Taqueria Tlaxcalli",
    category: "Food & Drink",
    neighborhood: "Astoria",
    address: "3211 Broadway, Astoria, NY 11106",
    activeCampaigns: 2,
    joinedAt: new Date("2026-04-09"),
  },
  {
    id: "bx-an-vietnamese",
    name: "Bx An Vietnamese Sandwich",
    category: "Food & Drink",
    neighborhood: "Flushing",
    address: "41-49 Kissena Blvd, Flushing, NY 11355",
    activeCampaigns: 1,
    joinedAt: new Date("2026-04-10"),
  },
  {
    id: "hyun-korean-bbq",
    name: "Hyun Korean BBQ",
    category: "Food & Drink",
    neighborhood: "Midtown",
    address: "11 W 32nd St, New York, NY 10001",
    activeCampaigns: 3,
    joinedAt: new Date("2026-04-11"),
  },
  {
    id: "kopitiam",
    name: "Kopitiam",
    category: "Coffee & Café",
    neighborhood: "Lower East Side",
    address: "151 E Broadway, New York, NY 10002",
    activeCampaigns: 1,
    joinedAt: new Date("2026-04-12"),
  },
  {
    id: "mi-espiguita",
    name: "Mi Espiguita",
    category: "Food & Drink",
    neighborhood: "Jackson Heights",
    address: "75-02 Roosevelt Ave, Jackson Heights, NY 11372",
    activeCampaigns: 2,
    joinedAt: new Date("2026-04-13"),
  },
  {
    id: "the-pickle-guys",
    name: "The Pickle Guys",
    category: "Specialty Food",
    neighborhood: "Lower East Side",
    address: "357 Grand St, New York, NY 10002",
    activeCampaigns: 1,
    joinedAt: new Date("2026-04-14"),
  },
  {
    id: "katz-deli",
    name: "Katz's Delicatessen",
    category: "Food & Drink",
    neighborhood: "Lower East Side",
    address: "205 E Houston St, New York, NY 10002",
    activeCampaigns: 2,
    joinedAt: new Date("2026-04-15"),
  },
  {
    id: "russ-daughters",
    name: "Russ & Daughters Café",
    category: "Food & Drink",
    neighborhood: "Lower East Side",
    address: "127 Orchard St, New York, NY 10002",
    activeCampaigns: 1,
    joinedAt: new Date("2026-04-16"),
  },
  {
    id: "morgenstern-s",
    name: "Morgenstern's Finest Ice Cream",
    category: "Food & Drink",
    neighborhood: "Lower East Side",
    address: "2 Rivington St, New York, NY 10002",
    activeCampaigns: 2,
    joinedAt: new Date("2026-04-16"),
  },
  {
    id: "the-smile",
    name: "The Smile",
    category: "Coffee & Café",
    neighborhood: "NoHo",
    address: "26 Bond St, New York, NY 10012",
    activeCampaigns: 1,
    joinedAt: new Date("2026-04-17"),
  },
  {
    id: "cafe-mogador",
    name: "Café Mogador",
    category: "Food & Drink",
    neighborhood: "East Village",
    address: "133 Wythe Ave, Brooklyn, NY 11249",
    activeCampaigns: 2,
    joinedAt: new Date("2026-04-17"),
  },
  {
    id: "the-king",
    name: "The King",
    category: "Fine Dining",
    neighborhood: "SoHo",
    address: "18 King St, New York, NY 10014",
    activeCampaigns: 1,
    joinedAt: new Date("2026-04-17"),
  },
  {
    id: "wonder-foods",
    name: "Wonder Foods NYC",
    category: "Health & Wellness",
    neighborhood: "Harlem",
    address: "2234 Frederick Douglass Blvd, New York, NY 10027",
    activeCampaigns: 2,
    joinedAt: new Date("2026-04-17"),
  },
  {
    id: "aba-eatery",
    name: "Aba Eatery",
    category: "Food & Drink",
    neighborhood: "Crown Heights",
    address: "683 Washington Ave, Brooklyn, NY 11238",
    activeCampaigns: 1,
    joinedAt: new Date("2026-04-17"),
  },
  {
    id: "colonia-verde",
    name: "Colonia Verde",
    category: "Food & Drink",
    neighborhood: "Fort Greene",
    address: "219 DeKalb Ave, Brooklyn, NY 11205",
    activeCampaigns: 2,
    joinedAt: new Date("2026-04-17"),
  },
  {
    id: "okonomi",
    name: "Okonomi / Yuji Ramen",
    category: "Food & Drink",
    neighborhood: "Williamsburg",
    address: "150 Ainslie St, Brooklyn, NY 11211",
    activeCampaigns: 1,
    joinedAt: new Date("2026-04-17"),
  },
  {
    id: "lima-social",
    name: "Lima Social",
    category: "Food & Drink",
    neighborhood: "Astoria",
    address: "36-24 36th St, Astoria, NY 11106",
    activeCampaigns: 2,
    joinedAt: new Date("2026-04-17"),
  },
  {
    id: "banh-mi-saigon",
    name: "Bánh Mì Saigon Bakery",
    category: "Food & Drink",
    neighborhood: "Chinatown",
    address: "198 Grand St, New York, NY 10013",
    activeCampaigns: 1,
    joinedAt: new Date("2026-04-17"),
  },
  {
    id: "the-brooklyn-crab",
    name: "Brooklyn Crab",
    category: "Food & Drink",
    neighborhood: "Red Hook",
    address: "24 Reed St, Brooklyn, NY 11231",
    activeCampaigns: 2,
    joinedAt: new Date("2026-04-17"),
  },
  {
    id: "runner-stone",
    name: "Runner & Stone",
    category: "Food & Drink",
    neighborhood: "Gowanus",
    address: "285 3rd Ave, Brooklyn, NY 11215",
    activeCampaigns: 1,
    joinedAt: new Date("2026-04-17"),
  },
  {
    id: "mettā",
    name: "Mettā Restaurant & Bar",
    category: "Food & Drink",
    neighborhood: "Fort Greene",
    address: "197 Adelphi St, Brooklyn, NY 11205",
    activeCampaigns: 2,
    joinedAt: new Date("2026-04-17"),
  },
  {
    id: "hunky-dory",
    name: "Hunky Dory",
    category: "Food & Drink",
    neighborhood: "Crown Heights",
    address: "747 Washington Ave, Brooklyn, NY 11238",
    activeCampaigns: 1,
    joinedAt: new Date("2026-04-17"),
  },
];

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  // Most recently joined merchants first, limit 50
  const recent = ACTIVE_MERCHANTS.slice(0, 50);
  const buildDate = new Date().toUTCString();

  const items = recent
    .map(
      (merchant) => `
    <item>
      <title>${escapeXml(merchant.name)}</title>
      <description>${escapeXml(`${merchant.name} is an active Push merchant in ${merchant.neighborhood}, NYC. Category: ${merchant.category}. Address: ${merchant.address}. Active campaigns: ${merchant.activeCampaigns}.`)}</description>
      <link>${BASE_URL}/m/${merchant.id}</link>
      <guid isPermaLink="true">${BASE_URL}/m/${merchant.id}</guid>
      <pubDate>${merchant.joinedAt.toUTCString()}</pubDate>
      <category>${escapeXml(merchant.category)}</category>
      <push:neighborhood xmlns:push="https://pushnyc.co/rss/ns">${escapeXml(merchant.neighborhood)}</push:neighborhood>
      <push:activeCampaigns xmlns:push="https://pushnyc.co/rss/ns">${merchant.activeCampaigns}</push:activeCampaigns>
    </item>`,
    )
    .join("");

  const feed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"
  xmlns:atom="http://www.w3.org/2005/Atom"
  xmlns:push="https://pushnyc.co/rss/ns">
  <channel>
    <title>Push — Active NYC Merchants Directory</title>
    <description>Live directory of NYC businesses actively running creator campaigns on Push. Updated daily. Optimized for local business directories and aggregators.</description>
    <link>${BASE_URL}/explore</link>
    <atom:link href="${FEED_URL}" rel="self" type="application/rss+xml"/>
    <language>en-us</language>
    <lastBuildDate>${buildDate}</lastBuildDate>
    <managingEditor>hello@pushnyc.co (Push)</managingEditor>
    <webMaster>hello@pushnyc.co (Push)</webMaster>
    <copyright>Copyright ${new Date().getFullYear()} Push Technologies, Inc.</copyright>
    <push:city xmlns:push="https://pushnyc.co/rss/ns">New York City</push:city>
    <push:totalMerchants xmlns:push="https://pushnyc.co/rss/ns">${recent.length}</push:totalMerchants>
    ${items}
  </channel>
</rss>`;

  return new NextResponse(feed, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=86400, stale-while-revalidate=3600",
    },
  });
}
