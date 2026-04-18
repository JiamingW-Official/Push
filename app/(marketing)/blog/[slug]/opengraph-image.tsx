import { ImageResponse } from "next/og";
import { ogTemplate, loadFonts, buildFonts } from "@/lib/og/template";
import { getPostBySlug, type PostCategory } from "@/lib/blog/mock-posts";

export const alt = "Push — Dispatches from the beachhead";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const dynamic = "force-dynamic";

// Mirror the same display-category mapping used in the article page,
// so the OG image eyebrow matches the visible UI.
type DisplayCategory = "Product" | "Engineering" | "Neighborhood" | "Research";

function toDisplayCategory(c: PostCategory): DisplayCategory {
  switch (c) {
    case "Product":
      return "Product";
    case "Engineering":
      return "Engineering";
    case "Community":
    case "Case Studies":
      return "Neighborhood";
    case "Insights":
    default:
      return "Research";
  }
}

// Demo v5.1 slugs that aren't in mock-posts.ts — kept in sync with the
// article route so OG generation still works for them.
const DEMO_OG: Record<string, { title: string; eyebrow: DisplayCategory }> = {
  "why-vertical-ai-for-local-commerce": {
    title: "Why Vertical AI for Local Commerce, not a services shop.",
    eyebrow: "Product",
  },
  "slr-metric-explained": {
    title:
      "Software Leverage Ratio — the one number that tells you if we scale.",
    eyebrow: "Product",
  },
  "conversionoracle-v3-accuracy-update": {
    title: "ConversionOracle™ v3 — accuracy hits 87% on Coffee+ campaigns.",
    eyebrow: "Engineering",
  },
};

function slugToTitle(slug: string): string {
  return slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export default async function OGImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  const demo = DEMO_OG[slug];

  const title = post?.title ?? demo?.title ?? slugToTitle(slug);
  const eyebrow = post
    ? toDisplayCategory(post.category)
    : (demo?.eyebrow ?? "Dispatch");

  const { darkyBlack, genioMono } = await loadFonts();

  return new ImageResponse(
    ogTemplate({
      title,
      eyebrow,
      accent: true,
      bg: "dark",
    }),
    {
      ...size,
      fonts: buildFonts(darkyBlack, genioMono),
    },
  );
}
