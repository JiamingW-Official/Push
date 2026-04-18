import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getProfileByHandle,
  getAllHandles,
} from "@/lib/portfolio/mock-profiles";
import { PublicPortfolioView } from "./PublicPortfolioView";

// ── SSG ───────────────────────────────────────────────────────────────────────

export function generateStaticParams() {
  return getAllHandles().map((handle) => ({ handle }));
}

// ── OG Metadata ───────────────────────────────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: Promise<{ handle: string }>;
}): Promise<Metadata> {
  const { handle } = await params;
  const profile = getProfileByHandle(handle);

  if (!profile) {
    return { title: "Creator Not Found | Push" };
  }

  const title = `${profile.displayName} — ${profile.tier} Creator | Push`;
  const description =
    profile.bio.slice(0, 155) + (profile.bio.length > 155 ? "…" : "");
  const url = `https://push.nyc/c/${handle}`;
  const image = profile.avatarUrl ?? "https://push.nyc/og-default.png";

  return {
    title,
    description,
    openGraph: {
      type: "profile",
      title,
      description,
      url,
      images: [
        { url: image, width: 1200, height: 630, alt: profile.displayName },
      ],
      siteName: "Push",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
      creator: profile.instagramHandle
        ? `@${profile.instagramHandle}`
        : undefined,
    },
    alternates: { canonical: url },
  };
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default async function PublicCreatorPage({
  params,
}: {
  params: Promise<{ handle: string }>;
}) {
  const { handle } = await params;
  const profile = getProfileByHandle(handle);

  if (!profile) notFound();

  return <PublicPortfolioView profile={profile} />;
}
