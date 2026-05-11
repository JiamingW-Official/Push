"use client";

/* ============================================================
   /creator/applied/[id] — single-application command surface
   v1 · 2026-05-10

   Drilling-in destination from /creator/work/applied + the
   /campaign/[id] post-apply CTA. The whole page is stage-aware:
   <StageRouter /> picks the matching panel based on
   useApplicationStage(application). The dev switcher (bottom-
   right floating pill) lets playtest jump between any of the
   11 lifecycle states without backend.

   This page is Product UI register — Snow #fff surfaces, Darky
   headings, no Magvix, no cream Marketing tokens.
   ============================================================ */

import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { useApplicationById } from "@/lib/data/live-applications";
import { useLiveCampaign } from "@/lib/data/live-campaigns";
import { useApplicationStage } from "@/lib/services/application-stage";
import { StageRouter } from "./StageRouter";
import { DevStageSwitcher } from "./DevStageSwitcher";
import { StageProgressStepper } from "./StageProgressStepper";
import "./applied-detail.css";

export default function AppliedDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params?.id;
  const application = useApplicationById(id ?? "");
  const campaign = useLiveCampaign(application?.campaignId ?? "");
  const effectiveStage = useApplicationStage(application);

  if (!id) return notFound();

  // App not found: SSR will hit this on first paint until the
  // store hydrates from localStorage. Fall through to a soft empty
  // state instead of throwing — refresh-safe.
  if (!application) {
    return (
      <div className="ad-shell">
        <header className="ad-topbar">
          <Link href="/creator/work/applied" className="ad-back">
            <ArrowLeft size={14} strokeWidth={2.25} />
            Back to applied
          </Link>
        </header>
        <main className="ad-empty">
          <p className="ad-empty__title">Application not found</p>
          <p className="ad-empty__sub">
            This may have been withdrawn, or the demo store reset.
            <br />
            <Link href="/creator/discover" className="ad-empty__link">
              Browse open campaigns →
            </Link>
          </p>
        </main>
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="ad-shell">
        <header className="ad-topbar">
          <Link href="/creator/work/applied" className="ad-back">
            <ArrowLeft size={14} strokeWidth={2.25} />
            Back to applied
          </Link>
        </header>
        <main className="ad-empty">
          <p className="ad-empty__title">Campaign no longer available</p>
          <p className="ad-empty__sub">
            The merchant may have closed this campaign.
          </p>
        </main>
      </div>
    );
  }

  return (
    <div className="ad-shell">
      {/* Sticky topbar — back link + thin campaign reference. */}
      <header className="ad-topbar">
        <Link href="/creator/work/applied" className="ad-back">
          <ArrowLeft size={14} strokeWidth={2.25} />
          Back to applied
        </Link>
        <div className="ad-topbar__campaign">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="ad-topbar__thumb"
            src={campaign.images[0] ?? ""}
            alt=""
          />
          <div className="ad-topbar__meta">
            <p className="ad-topbar__title">{campaign.title}</p>
            <p className="ad-topbar__sub">
              {campaign.merchantName} · {campaign.neighborhood}
            </p>
          </div>
          <Link
            href={`/creator/campaign/${campaign.id}`}
            className="ad-topbar__view"
          >
            View brief
          </Link>
        </div>
      </header>

      <StageProgressStepper currentStatus={effectiveStage} />

      <main className="ad-main">
        <StageRouter application={application} campaign={campaign} />
      </main>

      <DevStageSwitcher application={application} />
    </div>
  );
}
