"use client";

/* ============================================================
   /creator/work/dispute/[gigId] — Stage 08 · Disputed (satellite)
   v1 · 2026-05-08

   Recovery flow when a merchant disputes verified scans / payouts.
   The creator has 14 days to respond before the dispute auto-
   resolves in the merchant's favor. Built on Stage primitives;
   stage-specific UI (claim quote, evidence list, dispute timeline,
   response textarea) inlined.

     LEFT  — Merchant claim · Your evidence · Dispute timeline · Response form
     RIGHT — Dispute summary (primary ink) · Status · Submit · Help
   ============================================================ */

import { use, useState } from "react";
import { notFound } from "next/navigation";
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
  StagePayRow,
} from "@/components/shared/stage";
import "./dispute.css";

const TIMELINE = [
  { time: "2 hr ago", text: "Merchant filed dispute · 6 of 14 scans flagged", state: "done" },
  { time: "1 hr ago", text: "Push acknowledged · evidence locked", state: "done" },
  { time: "Now",      text: "Awaiting your response · 14 days remaining", state: "current" },
] as const;

export default function DisputePage({
  params,
}: {
  params: Promise<{ gigId: string }>;
}) {
  const { gigId } = use(params);
  const c = MOCK_CAMPAIGNS.find((x) => x.id === gigId);
  if (!c) notFound();

  const [response, setResponse] = useState("");
  const [submitting, setSubmitting] = useState(false);

  /* Mocked dispute facts — production reads from `payment_disputes` row. */
  const amountInDispute = 168;
  const heldSafe = 144;
  const disputedScans = 6;
  const totalScans = 14;
  const daysToRespond = 14;
  const merchantClaim =
    "I appreciate the work but the scans on May 4 evening don't look like real customers — same IP cluster, scans 12 seconds apart, no register transactions match. Pulling these from the payout.";

  const canSubmit = response.trim().length >= 30 && !submitting;

  async function handleSubmit() {
    if (!canSubmit) return;
    setSubmitting(true);
    /* Production: POST to /api/creator/disputes/[id]/respond. */
    await new Promise((r) => setTimeout(r, 600));
    setSubmitting(false);
  }

  return (
    <StageShell
      backHref="/creator/work"
      backLabel="← Back to work"
      ariaLabel="Disputed payout"
    >
      <StageBanner
        tone="amber"
        text="Disputed by merchant · 14 days to respond"
        meta={`Filed 2h ago · $${amountInDispute} in dispute`}
      />

      <StageHeader
        eyebrow={`In dispute · ${c.merchantName}`}
        title={c.title}
        sub={`${c.merchantName} flagged ${disputedScans} of ${totalScans} verified scans. Below is their claim, your evidence, and a textarea to respond. Push mediates if both sides disagree — 78% resolve in the creator's favor when evidence is strong.`}
      />

      <StageTwoCol>
        <StageMain>
          {/* Merchant claim — red accent signals the dispute origin */}
          <StageCard eyebrow="Merchant claim" title={`${c.merchantName}'s position`} accent="red">
            <blockquote className="dis__claim">
              {merchantClaim}
            </blockquote>
            <ul className="dis__claim-meta">
              <li><strong>Filed</strong> · 2 hr ago by Maya (account owner)</li>
              <li><strong>Amount in dispute</strong> · ${amountInDispute}</li>
              <li><strong>Disputed scans</strong> · {disputedScans} of {totalScans}</li>
              <li><strong>Specific window</strong> · May 4 · 7:42 PM – 8:18 PM</li>
            </ul>
          </StageCard>

          {/* Your evidence */}
          <StageCard eyebrow="Your evidence" title="What's on record">
            <ul className="dis__evidence">
              <li><strong>Posts published</strong> · 3 (IG reel + post + story) · all carried #ad + @{c.merchantName.toLowerCase().replace(/[^a-z]/g, "")}</li>
              <li><strong>DisclosureBot verdict</strong> · Pass · checked May 3 21:14</li>
              <li><strong>QR scans</strong> · 14 verified · timestamps + device fingerprints logged</li>
              <li><strong>Thread history</strong> · 47 messages · merchant approved final cut on May 6 at 11:03 AM</li>
              <li><strong>ConversionOracle log</strong> · oracle_audit row {`${c.id.toUpperCase()}-O-3941`} · all 14 scans passed signal checks</li>
            </ul>
            <p className="dis__help">All evidence is locked at dispute filing — neither side can edit. Push mediator + automated review use this exact snapshot.</p>
          </StageCard>

          {/* Dispute timeline — full row (vertical timeline reads better wide) */}
          <StageCard eyebrow="Dispute timeline" title="Events" full>
            <ul className="dis__timeline">
              {TIMELINE.map((e, i) => (
                <li key={i} className={`dis__event dis__event--${e.state}`}>
                  <span className="dis__event-dot" aria-hidden />
                  <span className="dis__event-body">
                    <span className="dis__event-time">{e.time}</span>
                    <span className="dis__event-text">{e.text}</span>
                  </span>
                </li>
              ))}
            </ul>
          </StageCard>

          {/* Response form — full row (textarea needs width to type comfortably) */}
          <StageCard eyebrow="Your response" title="Reply to the merchant's claim" full>
            <textarea
              className="dis__response"
              placeholder="Walk through your side. Reference timestamps, signal data, anything that supports your case. The mediator reads this when both sides have responded."
              value={response}
              onChange={(e) => setResponse(e.target.value)}
            />
            <p className="dis__help">
              <strong>Min 30 characters.</strong> If you have new evidence (additional screenshots, witness messages), upload via the thread — uploads attach automatically to this response.
            </p>
          </StageCard>
        </StageMain>

        <StageRail ariaLabel="Dispute summary">
          {/* Big amount — primary ink card */}
          <StageRailCard variant="primary" label="Amount in dispute">
            <span className="dis__sum-num">${amountInDispute}</span>
            <p className="stg__rail-help">
              Held in Stripe Connect escrow · neither side can withdraw until resolution.
            </p>
            <ul className="stg__pay-list">
              <StagePayRow label="Days to respond" value={`${daysToRespond}d`} />
              <StagePayRow label="In dispute" value={`$${amountInDispute}`} />
              <StagePayRow label="Held safe" value={`$${heldSafe}`} />
            </ul>
          </StageRailCard>

          {/* Status */}
          <StageRailCard label="Status" heading="Awaiting your response">
            <ul className="stg__elig-list">
              <StageEligRow status="ok" label="Claim received" meta="2h ago" />
              <StageEligRow status="ok" label="Evidence locked" meta="auto" />
              <StageEligRow status="warn" label="Your response" meta="pending" />
              <StageEligRow status="block" label="Resolution" meta="—" />
            </ul>
          </StageRailCard>

          {/* CTAs */}
          <StageRailCard label="Submit">
            <StageButtonStack>
              <StageButton
                variant="primary"
                disabled={!canSubmit}
                onClick={handleSubmit}
              >
                {submitting ? "Sending…" : "Submit response"}
              </StageButton>
              <StageButton variant="ghost">Request mediation</StageButton>
            </StageButtonStack>
          </StageRailCard>

          {/* Help */}
          <StageRailCard
            label="If you don't respond"
            help="After 14 days the dispute auto-resolves in the merchant's favor — funds release back to them. 92% of creators respond within 24 hours."
          />
        </StageRail>
      </StageTwoCol>
    </StageShell>
  );
}
