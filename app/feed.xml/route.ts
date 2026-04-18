import { NextResponse } from "next/server";

const BASE_URL = "https://pushnyc.co";
const FEED_URL = `${BASE_URL}/feed.xml`;

// Mock blog posts — replace with DB/CMS query when blog is live
const BLOG_POSTS = [
  {
    slug: "pay-per-visit-creator-marketing",
    title: "Why Pay-Per-Visit Is the Future of Creator Marketing",
    description:
      "Impressions don't fill tables. Learn how Push's verified-visit model shifts the accountability of influencer campaigns to actual foot traffic.",
    author: "Push Editorial",
    category: "Insights",
    pubDate: new Date("2026-04-10"),
  },
  {
    slug: "nyc-micro-creators-guide",
    title: "The Micro-Creator's Guide to NYC Brand Partnerships",
    description:
      "How creators with under 10k followers are landing paid campaigns with real NYC businesses — without DMing PR agencies.",
    author: "Push Editorial",
    category: "Creators",
    pubDate: new Date("2026-04-07"),
  },
  {
    slug: "qr-attribution-explained",
    title: "How QR Attribution Actually Works (No Black Box)",
    description:
      "A transparent breakdown of Push's scan-to-verify system: what gets tracked, how fraud is detected, and why merchants can trust the numbers.",
    author: "Push Engineering",
    category: "Product",
    pubDate: new Date("2026-04-04"),
  },
  {
    slug: "how-merchants-use-push",
    title: "How NYC Merchants Are Using Push to Replace Paid Ads",
    description:
      "Three restaurant owners share how shifting budget from Meta ads to Push campaigns changed their cost-per-acquisition.",
    author: "Push Editorial",
    category: "Merchants",
    pubDate: new Date("2026-04-01"),
  },
  {
    slug: "creator-tiers-ranking-system",
    title: "Inside the Push Score: How Creator Tiers Actually Work",
    description:
      "The Push Score isn't just follower count. A full breakdown of how reliability, content quality, and visit verification shape your tier.",
    author: "Push Editorial",
    category: "Creators",
    pubDate: new Date("2026-03-28"),
  },
  {
    slug: "foot-traffic-vs-impressions",
    title: "Foot Traffic vs. Impressions: Which Metric Actually Matters?",
    description:
      "An honest comparison of reach-based and visit-based attribution for local businesses — with real NYC data.",
    author: "Push Editorial",
    category: "Insights",
    pubDate: new Date("2026-03-24"),
  },
  {
    slug: "lower-east-side-food-scene",
    title: "LES Food Scene 2026: 12 Spots Worth a Creator Campaign",
    description:
      "The Lower East Side continues to evolve. We highlight 12 restaurants and cafes driving the most creator activity on Push.",
    author: "Push Editorial",
    category: "Neighborhoods",
    pubDate: new Date("2026-03-20"),
  },
  {
    slug: "williamsburg-restaurant-marketing",
    title: "Williamsburg Restaurant Marketing: What's Working in 2026",
    description:
      "Williamsburg has over 400 food and beverage venues. We break down which marketing channels drive the best ROI for local operators.",
    author: "Push Editorial",
    category: "Neighborhoods",
    pubDate: new Date("2026-03-17"),
  },
  {
    slug: "brooklyn-creators-2025",
    title: "Brooklyn's Rising Creator Class: 20 Accounts to Know",
    description:
      "From Bushwick to Bay Ridge, the micro-creators putting Brooklyn businesses on the map — without millions of followers.",
    author: "Push Editorial",
    category: "Creators",
    pubDate: new Date("2026-03-13"),
  },
  {
    slug: "push-vs-traditional-influencer",
    title: "Push vs. Traditional Influencer Marketing: An Honest Comparison",
    description:
      "No sponsored content, no fake reach guarantees. A side-by-side look at how Push campaigns stack up against traditional influencer deals.",
    author: "Push Editorial",
    category: "Insights",
    pubDate: new Date("2026-03-10"),
  },
  {
    slug: "local-seo-for-restaurants",
    title: "Creator Content as Local SEO: The Organic Backlink Strategy",
    description:
      "Every Push creator post is a piece of geo-tagged content. Here's how it compounds into local search authority over time.",
    author: "Push Editorial",
    category: "Insights",
    pubDate: new Date("2026-03-06"),
  },
  {
    slug: "verified-visit-anti-fraud",
    title: "Anti-Fraud by Design: How Push Prevents Fake Scans",
    description:
      "Building a pay-per-visit platform requires bulletproof verification. A technical overview of the anti-fraud measures inside Push.",
    author: "Push Engineering",
    category: "Product",
    pubDate: new Date("2026-03-03"),
  },
  {
    slug: "instagram-vs-tiktok-for-local",
    title: "Instagram vs. TikTok for Local Business: 2026 Data",
    description:
      "Which platform sends more foot traffic? We analyzed 500 Push campaigns to find out where creator content drives the most real-world visits.",
    author: "Push Editorial",
    category: "Insights",
    pubDate: new Date("2026-02-27"),
  },
  {
    slug: "case-study-blank-street",
    title: "Case Study: How Blank Street Coffee Used Push Across 12 Locations",
    description:
      "Blank Street ran simultaneous micro-creator campaigns across 12 NYC locations. Here's the campaign structure, the numbers, and what they'd do differently.",
    author: "Push Editorial",
    category: "Case Studies",
    pubDate: new Date("2026-02-24"),
  },
  {
    slug: "creator-earnings-breakdown",
    title: "How Much Can NYC Creators Actually Earn on Push?",
    description:
      "A realistic breakdown of creator earnings by tier — Seed through Partner — with average payouts, commission structures, and tips to level up.",
    author: "Push Editorial",
    category: "Creators",
    pubDate: new Date("2026-02-20"),
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
  const recent = BLOG_POSTS.slice(0, 20);
  const buildDate = new Date().toUTCString();

  const items = recent
    .map(
      (post) => `
    <item>
      <title>${escapeXml(post.title)}</title>
      <description>${escapeXml(post.description)}</description>
      <link>${BASE_URL}/blog/${post.slug}</link>
      <guid isPermaLink="true">${BASE_URL}/blog/${post.slug}</guid>
      <pubDate>${post.pubDate.toUTCString()}</pubDate>
      <author>hello@pushnyc.co (${escapeXml(post.author)})</author>
      <category>${escapeXml(post.category)}</category>
    </item>`,
    )
    .join("");

  const feed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>Push Blog — Customer Acquisition Engine for NYC Businesses</title>
    <description>Insights, case studies, and product updates from Push — Vertical AI for Local Commerce, powering the Customer Acquisition Engine for NYC.</description>
    <link>${BASE_URL}/blog</link>
    <atom:link href="${FEED_URL}" rel="self" type="application/rss+xml"/>
    <language>en-us</language>
    <lastBuildDate>${buildDate}</lastBuildDate>
    <managingEditor>hello@pushnyc.co (Push Editorial)</managingEditor>
    <webMaster>hello@pushnyc.co (Push)</webMaster>
    <copyright>Copyright ${new Date().getFullYear()} Push Technologies, Inc.</copyright>
    <image>
      <url>${BASE_URL}/opengraph-image</url>
      <title>Push</title>
      <link>${BASE_URL}</link>
    </image>
    ${items}
  </channel>
</rss>`;

  return new NextResponse(feed, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
    },
  });
}
