import { ImageResponse } from "next/og";
import { ogTemplate, loadFonts, buildFonts } from "@/lib/og/template";

export const alt = "Push Creator Profile";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

interface CreatorProfile {
  handle: string;
  displayName: string;
  tier?: string;
}

async function getCreatorProfile(id: string): Promise<CreatorProfile> {
  // TODO: replace with real Supabase fetch
  // e.g. supabase.from('creators').select('handle,display_name,tier').eq('id', id).single()
  return {
    handle: id,
    displayName: id
      .replace(/[-_]/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase()),
    tier: undefined,
  };
}

export default async function OGImage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const creator = await getCreatorProfile(id);
  const { darkyBlack, genioMono } = await loadFonts();

  const eyebrow = creator.tier
    ? `${creator.tier} Creator · push.nyc`
    : "Creator · push.nyc";

  return new ImageResponse(
    ogTemplate({
      title: creator.displayName,
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
