import type { MetadataRoute } from "next";

const BASE_URL = "https://pushnyc.co";

// Static marketing pages with their SEO priorities
const MARKETING_PAGES: MetadataRoute.Sitemap = [
  {
    url: `${BASE_URL}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 1.0,
  },
  {
    url: `${BASE_URL}/for-merchants`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.9,
  },
  {
    url: `${BASE_URL}/explore`,
    lastModified: new Date(),
    changeFrequency: "daily",
    priority: 0.8,
  },
  {
    url: `${BASE_URL}/blog`,
    lastModified: new Date(),
    changeFrequency: "daily",
    priority: 0.7,
  },
  {
    url: `${BASE_URL}/case-studies`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.7,
  },
  {
    url: `${BASE_URL}/neighborhoods`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.7,
  },
  {
    url: `${BASE_URL}/changelog`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.5,
  },
  {
    url: `${BASE_URL}/help`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.6,
  },
  {
    url: `${BASE_URL}/pricing`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.8,
  },
  {
    url: `${BASE_URL}/about`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.6,
  },
  {
    url: `${BASE_URL}/press`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.5,
  },
  {
    url: `${BASE_URL}/careers`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.5,
  },
  {
    url: `${BASE_URL}/contact`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.5,
  },
  {
    url: `${BASE_URL}/privacy`,
    lastModified: new Date(),
    changeFrequency: "yearly",
    priority: 0.3,
  },
  {
    url: `${BASE_URL}/terms`,
    lastModified: new Date(),
    changeFrequency: "yearly",
    priority: 0.3,
  },
  {
    url: `${BASE_URL}/creator/signup`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.8,
  },
  {
    url: `${BASE_URL}/creator/login`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.4,
  },
  {
    url: `${BASE_URL}/merchant/signup`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.8,
  },
  {
    url: `${BASE_URL}/merchant/login`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.4,
  },
  {
    url: `${BASE_URL}/for-creators`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.8,
  },
];

// Mock blog posts — replace with DB query when blog is live
const BLOG_SLUGS = [
  "pay-per-visit-creator-marketing",
  "nyc-micro-creators-guide",
  "qr-attribution-explained",
  "how-merchants-use-push",
  "creator-tiers-ranking-system",
  "foot-traffic-vs-impressions",
  "lower-east-side-food-scene",
  "williamsburg-restaurant-marketing",
  "brooklyn-creators-2025",
  "push-vs-traditional-influencer",
  "local-seo-for-restaurants",
  "verified-visit-anti-fraud",
  "instagram-vs-tiktok-for-local",
  "case-study-blank-street",
  "creator-earnings-breakdown",
] as const;

// Mock case studies
const CASE_STUDY_SLUGS = [
  "blank-street-coffee",
  "superiority-burger",
  "brow-theory",
  "flamingo-estate",
  "estela-nyc",
] as const;

// Mock help articles
const HELP_SLUGS = [
  "getting-started-creators",
  "getting-started-merchants",
  "how-qr-scanning-works",
  "creator-tier-requirements",
  "campaign-application-process",
  "payout-schedule",
  "content-requirements",
  "fraud-prevention-policy",
  "merchant-dashboard-guide",
  "creator-profile-setup",
  "campaign-creation-guide",
  "invoice-and-billing",
  "supported-content-formats",
  "account-verification",
  "dispute-resolution",
  "commission-structure",
  "referral-program",
  "api-documentation",
  "integrations-overview",
  "data-privacy-creators",
  "data-privacy-merchants",
  "campaign-reporting",
  "push-score-explained",
  "milestone-tracking",
  "content-moderation-policy",
  "brand-safety-guidelines",
  "exclusivity-clauses",
  "cancellation-policy",
  "multi-location-merchants",
  "neighborhood-targeting",
] as const;

// NYC neighborhoods with public pages
const NEIGHBORHOOD_SLUGS = [
  "lower-east-side",
  "williamsburg",
  "astoria",
  "park-slope",
  "harlem",
  "soho",
  "chelsea",
  "greenpoint",
  "bushwick",
  "crown-heights",
  "flushing",
  "jackson-heights",
  "bed-stuy",
  "fort-greene",
  "long-island-city",
  "ridgewood",
  "sunset-park",
  "flatbush",
  "upper-west-side",
  "upper-east-side",
  "east-village",
  "west-village",
  "tribeca",
  "financial-district",
  "dumbo",
  "cobble-hill",
  "carroll-gardens",
  "prospect-heights",
  "morningside-heights",
  "washington-heights",
] as const;

// Mock merchant public pages
const MERCHANT_IDS = [
  "blank-street-coffee",
  "superiority-burger",
  "flamingo-estate",
  "brow-theory",
  "estela",
  "ivan-ramen",
  "davelles-coffee",
  "kings-co-imperial",
  "dhamaka",
  "ugly-baby",
  "claro",
  "aunts-et-uncles",
  "birch-coffee",
  "la-contenta",
  "ssam-bar",
  "village-yokocho",
  "chez-ma-tante",
  "oxomoco",
  "don-angie",
  "lilia",
] as const;

// Mock creator portfolio pages
const CREATOR_IDS = [
  "alex-chen-nyc",
  "maya-rodriguez",
  "jordan-kim",
  "priya-patel-eats",
  "marcus-bk",
  "sofia-queens",
  "leo-bronx",
  "nina-harlem",
  "sam-williamsburg",
  "tara-greenpoint",
  "carlos-astoria",
  "dana-park-slope",
  "erin-chelsea",
  "felix-soho",
  "gwen-tribeca",
  "hana-fidi",
  "ivan-lec",
  "jess-bushwick",
  "kai-ridgewood",
  "luna-bed-stuy",
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const blogPages: MetadataRoute.Sitemap = BLOG_SLUGS.map((slug) => ({
    url: `${BASE_URL}/blog/${slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  const caseStudyPages: MetadataRoute.Sitemap = CASE_STUDY_SLUGS.map(
    (slug) => ({
      url: `${BASE_URL}/case-studies/${slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }),
  );

  const helpPages: MetadataRoute.Sitemap = HELP_SLUGS.map((slug) => ({
    url: `${BASE_URL}/help/${slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.5,
  }));

  const neighborhoodPages: MetadataRoute.Sitemap = NEIGHBORHOOD_SLUGS.map(
    (slug) => ({
      url: `${BASE_URL}/neighborhoods/${slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.6,
    }),
  );

  const merchantPages: MetadataRoute.Sitemap = MERCHANT_IDS.map((id) => ({
    url: `${BASE_URL}/m/${id}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  const creatorPages: MetadataRoute.Sitemap = CREATOR_IDS.map((id) => ({
    url: `${BASE_URL}/c/${id}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.5,
  }));

  return [
    ...MARKETING_PAGES,
    ...blogPages,
    ...caseStudyPages,
    ...helpPages,
    ...neighborhoodPages,
    ...merchantPages,
    ...creatorPages,
  ];
}
