import { ImageResponse } from "next/og";
import { ogTemplate, loadFonts, buildFonts } from "@/lib/og/template";

export const alt = "Push — Neighborhood Playbook";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const dynamic = "force-dynamic";

// Status per slug — keeps OG copy in lock-step with the page content.
const SLUG_META: Record<string, { name: string; status: "active" | "queue" }> =
  {
    "williamsburg-coffee": {
      name: "Williamsburg Coffee+",
      status: "active",
    },
    greenpoint: { name: "Greenpoint", status: "queue" },
    bushwick: { name: "Bushwick", status: "queue" },
  };

function formatFallback(slug: string): string {
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
  const meta = SLUG_META[slug] ?? {
    name: formatFallback(slug),
    status: "queue" as const,
  };
  const { darkyBlack, genioMono } = await loadFonts();

  const eyebrow =
    meta.status === "active"
      ? "Active Beachhead · ConversionOracle™ inside"
      : "Pilot queue · Neighborhood Playbook";

  return new ImageResponse(
    ogTemplate({
      title: meta.name,
      eyebrow,
      accent: true,
      bg: meta.status === "active" ? "dark" : "light",
    }),
    {
      ...size,
      fonts: buildFonts(darkyBlack, genioMono),
    },
  );
}
