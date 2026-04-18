import { ImageResponse } from "next/og";
import { ogTemplate, loadFonts, buildFonts } from "@/lib/og/template";

export const alt = "Push Case Study";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const dynamic = "force-dynamic";

interface CaseStudy {
  title: string;
  merchant?: string;
}

async function getCaseStudy(slug: string): Promise<CaseStudy> {
  // TODO: replace with real Supabase / CMS fetch
  return {
    title: slug
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" "),
    merchant: undefined,
  };
}

export default async function OGImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const study = await getCaseStudy(slug);
  const { darkyBlack, genioMono } = await loadFonts();

  return new ImageResponse(
    ogTemplate({
      title: study.title,
      eyebrow: study.merchant ? `Case Study · ${study.merchant}` : "Case Study",
      accent: true,
      bg: "light",
    }),
    {
      ...size,
      fonts: buildFonts(darkyBlack, genioMono),
    },
  );
}
