"use client";

/* ============================================================
   /creator/portfolio/[gigId] — Stage 09 · Promoted (satellite)
   v1 · 2026-05-08

   Public case study of a wrapped gig — promoted to the creator's
   public portfolio. Reached from Wrap (Stage 07) via "Save to
   portfolio" CTA. Built on Stage primitives; stage-specific UI
   (hero photo, stat grid, case study textareas, visibility
   toggle, share link) inlined.

     LEFT  — Hero photo · Stats · Case study (problem/approach/result) · Tags
     RIGHT — Visibility (public/unlisted/private) primary · Performance · CTAs
   ============================================================ */

import { use, useState } from "react";
import { notFound } from "next/navigation";
import { MOCK_CAMPAIGNS } from "@/lib/mocks/campaigns";
import {
  StageShell,
  StageBanner,
  StageHeader,
  StageChip,
  StageTwoCol,
  StageMain,
  StageRail,
  StageCard,
  StageRailCard,
  StageButton,
  StageButtonStack,
  StageStat,
  StageEligRow,
} from "@/components/shared/stage";
import "./entry.css";

type Visibility = "public" | "unlisted" | "private";

export default function PortfolioEntryPage({
  params,
}: {
  params: Promise<{ gigId: string }>;
}) {
  const { gigId } = use(params);
  const c = MOCK_CAMPAIGNS.find((x) => x.id === gigId);
  if (!c) notFound();

  const [visibility, setVisibility] = useState<Visibility>("public");
  const [problem, setProblem] = useState(
    `${c.merchantName} wanted weekday foot traffic from neighborhood creators — not influencer megastar coverage. They needed authentic recommendations that could survive a customer's "is this real?" sniff test.`,
  );
  const [approach, setApproach] = useState(
    "Pre-scouted Tuesday 10 AM (slow lunch crowd, even light). Shot 3 frames in 25 minutes — bar pull / table 4 with QR / customer hand reaching. Tag in caption was casual, not branded.",
  );
  const [result, setResult] = useState(
    "94 verified scans across 7 days. 82% from neighborhood (within 1mi). Peak day Wed +14 scans · ROI for merchant ~3.2× their cash spend. They re-booked the next month.",
  );

  /* Mocked stats — production reads from gig wrap row. */
  const earnings = 312;
  const scans = 94;
  const peakDay = "Wed +14";
  const rating = 4.8;
  const daysToShoot = 2;
  const views = 24;
  const saves = 3;
  const inboundDms = 0;

  return (
    <StageShell
      backHref="/creator/portfolio"
      backLabel="← Back to portfolio"
      ariaLabel="Portfolio entry"
    >
      <StageBanner
        tone="champagne"
        text={`Live on portfolio · ${views} views`}
        meta="Promoted 3 days ago · public link active"
      />

      <StageHeader
        eyebrow={`Stage 09 · Promoted · ${c.merchantName}`}
        title={c.title}
        sub="Polished case study of a wrapped gig. Show off to future merchants and brand deals. Public link auto-updates as you edit — share it in pitches and DMs."
      />

      <StageTwoCol>
        <StageMain>
          {/* Hero photo — full row (16:9 aspect ratio needs width) */}
          <StageCard eyebrow="Featured" title="Hero image" full>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="pro__hero" src={c.images[0]} alt="" />
            <p className="pro__caption">
              {c.tagline ?? `${c.category} content for ${c.merchantName} · ${c.neighborhood}.`}
            </p>
          </StageCard>

          {/* Stats */}
          <StageCard eyebrow="Stats" title="What this gig achieved">
            <div className="pro__stats">
              <StageStat size="lg" num={`$${earnings}`} label="Earned" helper="incl. milestone bonus" />
              <StageStat size="lg" num={String(scans)} label="Verified scans" helper={`peak day ${peakDay}`} />
              <StageStat size="lg" num={rating.toFixed(1)} label="Merchant rating" helper="cohort avg 4.6" />
              <StageStat size="lg" num={`${daysToShoot}d`} label="Days to shoot" helper="cohort avg 4d" />
            </div>
          </StageCard>

          {/* Case study — full row (3 stacked textareas need width) */}
          <StageCard eyebrow="Case study" title="Tell the story" full>
            <div className="pro__case-section">
              <span className="pro__case-label">Problem</span>
              <textarea
                className="pro__case-input"
                placeholder="What was the merchant trying to solve? Why did they choose Push over alternatives?"
                value={problem}
                onChange={(e) => setProblem(e.target.value)}
              />
            </div>
            <div className="pro__case-section">
              <span className="pro__case-label">Approach</span>
              <textarea
                className="pro__case-input"
                placeholder="How did you frame the campaign? What creative choices did you make?"
                value={approach}
                onChange={(e) => setApproach(e.target.value)}
              />
            </div>
            <div className="pro__case-section">
              <span className="pro__case-label">Result</span>
              <textarea
                className="pro__case-input"
                placeholder="What happened? Numbers, learnings, what you'd do differently."
                value={result}
                onChange={(e) => setResult(e.target.value)}
              />
            </div>
          </StageCard>

          {/* Tags */}
          <StageCard eyebrow="Tags" title="Categorization">
            <div className="pro__tags">
              <StageChip>{c.category.replace(/&/g, "+")}</StageChip>
              <StageChip>{c.neighborhood.split(",")[0]}</StageChip>
              <StageChip>{c.format === "in-person" ? "In-person" : c.format === "remote" ? "Remote" : "Hybrid"}</StageChip>
              <StageChip tone="champagne">Wrapped · paid</StageChip>
            </div>
          </StageCard>
        </StageMain>

        <StageRail ariaLabel="Visibility and performance">
          {/* Visibility — primary ink card */}
          <StageRailCard
            variant="primary"
            label="Visibility"
            heading={
              visibility === "public"
                ? "Public · on your portfolio"
                : visibility === "unlisted"
                  ? "Unlisted · link only"
                  : "Private · just for you"
            }
            help={
              visibility === "public"
                ? "Anyone with the link sees this · shows in your portfolio grid."
                : visibility === "unlisted"
                  ? "Link works but won't appear in your public grid. Good for brand pitches."
                  : "Private mode hides this entry entirely. Toggle public any time."
            }
          >
            <div className="pro__vis-options">
              {(["public", "unlisted", "private"] as const).map((v) => (
                <button
                  key={v}
                  type="button"
                  className={`pro__vis${visibility === v ? " is-on" : ""}`}
                  onClick={() => setVisibility(v)}
                >
                  {v === "public" ? "Public" : v === "unlisted" ? "Unlisted" : "Private"}
                </button>
              ))}
            </div>
            <div className="pro__share">
              <span className="pro__share-link">push.co/p/{c.id}</span>
              <button type="button" className="pro__share-copy" aria-label="Copy public link">Copy</button>
            </div>
          </StageRailCard>

          {/* Performance */}
          <StageRailCard label="Performance" heading="Last 7 days">
            <ul className="stg__elig-list">
              <StageEligRow status="ok" label="Views" meta={String(views)} />
              <StageEligRow status="ok" label="Saves" meta={String(saves)} />
              <StageEligRow status={inboundDms > 0 ? "ok" : "info"} label="Inbound DMs" meta={String(inboundDms)} />
            </ul>
          </StageRailCard>

          {/* CTAs */}
          <StageRailCard label="Update">
            <StageButtonStack>
              <StageButton variant="primary">Save changes</StageButton>
              <StageButton variant="secondary">Open public link</StageButton>
              <StageButton variant="ghost">Hide from portfolio</StageButton>
            </StageButtonStack>
          </StageRailCard>
        </StageRail>
      </StageTwoCol>
    </StageShell>
  );
}
