"use client";

/* ============================================================
   <MoreLikeThisRail> — horizontal rail of similar campaigns
   v1 · 2026-05-10

   Shown on /campaign/[id] in the post-apply state. Surfaces 4-6
   campaigns scored by neighborhood + category + pay band overlap
   so the creator can keep applying without leaving the page.

   Interaction: click any card → /creator/campaign/[other-id]
   (opens in same tab; the post-apply state lives in the live store
   so back navigation preserves status).
   ============================================================ */

import Link from "next/link";
import { ArrowUpRight, MapPin } from "lucide-react";
import type { Campaign } from "@/lib/mocks/campaigns";
import { useSimilarCampaigns } from "@/lib/data/live-campaigns";

export function MoreLikeThisRail({
  campaign,
  excludeIds,
}: {
  campaign: Campaign;
  /** Campaign ids the creator has already applied to — passed
   *  from the parent so we don't recommend a campaign already
   *  in their pipeline. */
  excludeIds?: Set<string>;
}) {
  const similar = useSimilarCampaigns(campaign, { limit: 6, excludeIds });
  if (similar.length === 0) return null;

  return (
    <section className="cd-mlt" aria-label="More campaigns like this">
      <header className="cd-mlt__head">
        <p className="cd-mlt__eyebrow">While you wait</p>
        <h3 className="cd-mlt__title">Don&apos;t sit. Apply to more.</h3>
        <p className="cd-mlt__sub">
          Creators who get accepted apply to 4-6 campaigns in their first
          week. Here&apos;s what&apos;s hot in {neighborhoodLabel(campaign)}.
        </p>
      </header>

      <div className="cd-mlt__rail">
        {similar.map((c) => (
          <SimilarCard key={c.id} campaign={c} />
        ))}
      </div>
    </section>
  );
}

function SimilarCard({ campaign }: { campaign: Campaign }) {
  const img = campaign.images[0] ?? "/placeholder.png";
  const totalPay = campaign.deliverables.reduce(
    (s, d) => s + d.unitPay * d.count,
    0,
  );
  return (
    <Link
      href={`/creator/campaign/${campaign.id}`}
      className="cd-mlt__card"
      target="_blank"
      rel="noopener"
    >
      <div className="cd-mlt__card-img-wrap">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={img} alt={campaign.title} className="cd-mlt__card-img" />
        <span className="cd-mlt__card-pay">${totalPay}</span>
      </div>
      <div className="cd-mlt__card-body">
        <p className="cd-mlt__card-cat">
          {campaign.category} · {campaign.matchScore}/100 match
        </p>
        <h4 className="cd-mlt__card-title">{campaign.title}</h4>
        <p className="cd-mlt__card-meta">
          <MapPin size={11} strokeWidth={2.25} />
          {neighborhoodLabel(campaign)} · {campaign.distanceMi.toFixed(1)}mi
        </p>
      </div>
      <span className="cd-mlt__card-arrow" aria-hidden>
        <ArrowUpRight size={14} strokeWidth={2.25} />
      </span>
    </Link>
  );
}

function neighborhoodLabel(c: Campaign): string {
  return c.neighborhood.split(",")[0]?.trim() ?? c.neighborhood;
}
