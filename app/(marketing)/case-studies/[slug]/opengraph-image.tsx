import { ImageResponse } from "next/og";
import { ogTemplate, loadFonts, buildFonts } from "@/lib/og/template";
import { getCaseBySlug } from "@/lib/cases/mock-cases";

export const alt = "Push Case Study — Vertical AI for Local Commerce";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const dynamic = "force-static";

interface CaseMeta {
  title: string;
  metric?: string;
  category?: string;
}

// Slug-specific metric overrides (for cases that live outside mock-cases
// or where the card-level metric is more compelling than the first outcome).
const METRIC_OVERRIDES: Record<string, CaseMeta> = {
  "williamsburg-coffee-5": {
    title: "Williamsburg Coffee+ · First 5 Cohort",
    metric: "72 verified customers · SLR 9.8",
    category: "Coffee+ · Williamsburg",
  },
};

function resolveCaseMeta(slug: string): CaseMeta {
  // 1. explicit overrides first
  if (METRIC_OVERRIDES[slug]) return METRIC_OVERRIDES[slug];

  // 2. mock-cases fallback
  const c = getCaseBySlug(slug);
  if (c) {
    return {
      title: c.name,
      metric: `${c.primaryOutcome.value} · ${c.primaryOutcome.label}`,
      category: `${c.category} · ${c.neighborhood}`,
    };
  }

  // 3. last-resort humanised slug
  return {
    title: slug
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" "),
    metric: undefined,
    category: "Case Study · Vertical AI for Local Commerce",
  };
}

export default async function OGImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const meta = resolveCaseMeta(slug);
  const { darkyBlack, genioMono } = await loadFonts();

  // Compose title — keep merchant name punchy, then metric below
  const title = meta.metric ? `${meta.title} — ${meta.metric}` : meta.title;

  const eyebrow =
    meta.category ?? "Case Study · Vertical AI for Local Commerce";

  return new ImageResponse(
    ogTemplate({
      title,
      eyebrow,
      accent: true,
      bg: "light",
    }),
    {
      ...size,
      fonts: buildFonts(darkyBlack, genioMono),
    },
  );
}
