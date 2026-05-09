"use client";

/* ============================================================
   /creator/work/submit/[gigId] — Stage 06 · Submit
   v1 · 2026-05-08

   Final handoff page. Reached after Stage 05 (Shoot) when all
   required frames are captured. Two-column shell:

     LEFT  — Asset roster · DisclosureBot check · Posting schedule
     RIGHT — Pre-flight checklist · Final preview · Submit CTA

   On submit → ConversionOracle verification (mocked redirect to
   /creator/work/wrap/[gigId] for the funnel demo).
   ============================================================ */

import { use, useState } from "react";
import { useRouter, notFound } from "next/navigation";
import { MOCK_CAMPAIGNS } from "@/lib/mocks/campaigns";
import {
  StageShell,
  StageBanner,
  StageHeader,
  StageTwoCol,
  StageMain,
  StageRail,
  StageCard,
  StageRailCard,
  StageButton,
  StageButtonStack,
  StageEligRow,
} from "@/components/shared/stage";
import "./submit.css";

type Asset = {
  id: string;
  type: string;
  caption: string;
  hashtags: string;
  hasDisclosure: boolean;
  platform: "instagram" | "tiktok" | "rednote";
  scheduledAt: string;
};

const INITIAL_ASSETS: Asset[] = [
  {
    id: "a1",
    type: "reel",
    caption: "Tucked-away corner of williamsburg, espresso done right.",
    hashtags: "#bk #robertaspizza #ad",
    hasDisclosure: true,
    platform: "instagram",
    scheduledAt: "Tomorrow · 8:00 AM",
  },
  {
    id: "a2",
    type: "post",
    caption: "Behind the bar at @robertaspizza · QR's at every table.",
    hashtags: "#williamsburg #pizza",
    hasDisclosure: false,
    platform: "tiktok",
    scheduledAt: "Tomorrow · 12:00 PM",
  },
  {
    id: "a3",
    type: "story",
    caption: "QR scan moment · table 4.",
    hashtags: "#partner",
    hasDisclosure: true,
    platform: "instagram",
    scheduledAt: "Tomorrow · 6:00 PM",
  },
];

export default function SubmitPage({
  params,
}: {
  params: Promise<{ gigId: string }>;
}) {
  const { gigId } = use(params);
  const c = MOCK_CAMPAIGNS.find((x) => x.id === gigId);
  if (!c) notFound();
  const campaignId = c.id;

  const router = useRouter();
  const [assets] = useState<Asset[]>(INITIAL_ASSETS);
  const [submitting, setSubmitting] = useState(false);

  /* Pre-flight checks */
  const allHaveCaption = assets.every((a) => a.caption.trim().length >= 10);
  const allHaveDisclosure = assets.every((a) => a.hasDisclosure);
  const allScheduled = assets.every((a) => a.scheduledAt);
  const canSubmit = allHaveCaption && allHaveDisclosure && allScheduled && !submitting;

  async function handleSubmit() {
    if (!canSubmit) return;
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 700));
    router.push(`/creator/work/wrap/${campaignId}`);
  }

  return (
    <StageShell backHref="/creator/work" ariaLabel="Submit for verification">
      <StageBanner
        tone="blue"
        text="Pre-flight · review before push"
        meta={`${assets.length} assets ready · ${assets.filter((a) => a.hasDisclosure).length} disclosed`}
      />

      <StageHeader
        eyebrow={`Stage 06 · Submit · ${c.merchantName}`}
        title="Pre-flight check."
        sub="Once you push, ConversionOracle takes over — assets post on schedule, scans land, attribution counts. Fix any flag below before submit."
      />

      <StageTwoCol>
        <StageMain>
          {/* Asset roster — full row (each asset row is wide:
              num + body + edit; needs full grid width) */}
          <StageCard eyebrow="Asset roster" title={`${assets.length} pieces · ${c.merchantName}`} full>
            <ul className="sub__assets">
              {assets.map((a, i) => (
                <li key={a.id} className="sub__asset">
                  <div className="sub__asset-num">{i + 1}</div>
                  <div className="sub__asset-body">
                    <div className="sub__asset-head">
                      <span className="sub__asset-type">{a.type}</span>
                      <span className={`sub__asset-platform sub__asset-platform--${a.platform}`}>
                        {a.platform}
                      </span>
                      <span className="sub__asset-time">{a.scheduledAt}</span>
                    </div>
                    <p className="sub__asset-caption">{a.caption}</p>
                    <p className="sub__asset-tags">{a.hashtags}</p>
                    <div className="sub__asset-flags">
                      <span className={`sub__flag sub__flag--${a.hasDisclosure ? "ok" : "warn"}`}>
                        {a.hasDisclosure ? "✓ FTC disclosed" : "⚠ Missing #ad"}
                      </span>
                      <span className="sub__flag sub__flag--ok">
                        ✓ Caption {a.caption.trim().length}c
                      </span>
                      <span className="sub__flag sub__flag--ok">✓ Scheduled</span>
                    </div>
                  </div>
                  <button type="button" className="sub__asset-edit" aria-label="Edit asset">
                    Edit
                  </button>
                </li>
              ))}
            </ul>
          </StageCard>

          {/* DisclosureBot check */}
          <StageCard eyebrow="DisclosureBot" title="Auto-compliance check">
            <ul className="stg__elig-list">
              <StageEligRow
                status={allHaveDisclosure ? "ok" : "warn"}
                label="FTC #ad on every asset"
                meta={allHaveDisclosure ? `${assets.length}/${assets.length}` : `${assets.filter((a) => a.hasDisclosure).length}/${assets.length}`}
              />
              <StageEligRow status="ok" label="Partner tag (@merchant)" meta="3/3" />
              <StageEligRow status="ok" label="Platform-specific compliance" meta="IG · TT · RN" />
              <StageEligRow status="ok" label="QR code visible in ≥1 frame" meta="2/3" />
            </ul>
            {!allHaveDisclosure && (
              <p className="sub__warn">
                <strong>1 asset missing FTC #ad.</strong> DisclosureBot will block payout until corrected. Edit the asset above to add the disclosure tag.
              </p>
            )}
          </StageCard>

          {/* Posting schedule */}
          <StageCard eyebrow="Posting schedule" title="Push timeline">
            <ul className="sub__schedule">
              {assets.map((a) => (
                <li key={a.id} className="sub__sched-row">
                  <span className="sub__sched-time">{a.scheduledAt}</span>
                  <span className="sub__sched-body">
                    <span className="sub__asset-platform sub__asset-platform--${a.platform}">{a.platform}</span>
                    <span className="sub__sched-type">{a.type}</span>
                  </span>
                </li>
              ))}
            </ul>
          </StageCard>
        </StageMain>

        <StageRail ariaLabel="Pre-flight + submit">
          {/* Pre-flight (primary) */}
          <StageRailCard
            variant="primary"
            label="Pre-flight"
            heading={canSubmit ? "All clear · ready to push" : "1 issue blocking"}
          >
            <ul className="stg__elig-list">
              <StageEligRow status={allHaveCaption ? "ok" : "warn"} label="Captions complete" />
              <StageEligRow status={allHaveDisclosure ? "ok" : "block"} label="FTC disclosure" />
              <StageEligRow status={allScheduled ? "ok" : "warn"} label="Posting scheduled" />
              <StageEligRow status="ok" label="QR visible in frame" />
            </ul>
          </StageRailCard>

          {/* Final preview note */}
          <StageRailCard label="Final preview" heading="What scanners will see">
            <p className="stg__rail-help">
              On push, your assets go live at the scheduled times across IG · TikTok · RedNote. Verified scans drive your milestone bonus per v5.4 attribution decay curve.
            </p>
          </StageRailCard>

          {/* CTAs */}
          <StageRailCard label="Submit">
            <StageButtonStack>
              <StageButton variant="primary" disabled={!canSubmit} onClick={handleSubmit}>
                {submitting ? "Submitting…" : "Submit for verification"}
              </StageButton>
              <StageButton variant="ghost">Save and review later</StageButton>
            </StageButtonStack>
          </StageRailCard>
        </StageRail>
      </StageTwoCol>
    </StageShell>
  );
}
