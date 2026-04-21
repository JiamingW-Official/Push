import type { MetadataRoute } from "next";

const BASE_URL = "https://pushnyc.co";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: [
          "/",
          "/for-merchants",
          "/for-creators",
          "/explore",
          "/blog",
          "/blog/",
          "/case-studies",
          "/case-studies/",
          "/help",
          "/help/",
          "/neighborhoods",
          "/neighborhoods/",
          "/changelog",
          "/pricing",
          "/about",
          "/press",
          "/careers",
          "/contact",
          "/privacy",
          "/terms",
          "/c/",
          "/m/",
          "/creator/signup",
          "/creator/login",
          "/merchant/signup",
          "/merchant/login",
        ],
        disallow: [
          "/admin/",
          "/creator/dashboard",
          "/creator/earnings",
          "/creator/settings",
          "/creator/profile",
          "/creator/campaigns/",
          "/creator/post-campaign",
          "/creator/onboarding",
          "/creator/reset-password",
          "/merchant/dashboard",
          "/merchant/settings",
          "/merchant/campaigns/",
          "/dashboard",
          "/scan/",
          "/api/",
          "/demo/",
        ],
      },
      // Block AI training crawlers from creator/merchant content
      {
        userAgent: ["GPTBot", "CCBot", "anthropic-ai", "Claude-Web"],
        disallow: ["/"],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
