"use client";

/* ============================================================
   /creator/work/confirmed/[gigId] — Stage 04 · Confirmed
   v20 · 2026-05-08 — refactored onto Stage primitives. Shell,
   banner, header, two-col, cards, rail cards, buttons, thread
   messages, merchant avatar all from @/components/shared/stage.
   Stage-specific (merchant stats grid, briefing pack table,
   refs grid, QR mock, schedule chip) stays in confirmed.css.
   ============================================================ */

import { use } from "react";
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
  StageMerchAvatar,
  StageThreadMsg,
} from "@/components/shared/stage";
import "./confirmed.css";

/* Mock thread — production hook: useThreadByGig(gigId). */
const MOCK_THREAD = [
  {
    side: "merchant" as const,
    name: "Maya · Roberta's",
    initial: "M",
    text: "Hey! Stoked to have you. We've blocked Wed 2 PM — slow part of lunch so the kitchen counter shot will be clean. Park is 2 blocks N.",
    time: "2 hr ago",
  },
  {
    side: "mine" as const,
    name: "You",
    initial: "Y",
    text: "Perfect. I'll come at 1:45 to scope the angle. Bring my own ring light — fine if I shoot near the window?",
    time: "1 hr ago",
  },
  {
    side: "merchant" as const,
    name: "Maya · Roberta's",
    initial: "M",
    text: "Window seat is yours. QR holder will be on table 4. See you Wed.",
    time: "42 min ago",
  },
];

export default function ConfirmedPage({
  params,
}: {
  params: Promise<{ gigId: string }>;
}) {
  const { gigId } = use(params);
  const c = MOCK_CAMPAIGNS.find((x) => x.id === gigId);
  if (!c) notFound();

  const acceptedDay = "Wed · May 13";
  const acceptedTime = "2:00 PM · 90 min";

  return (
    <StageShell
      backHref="/creator/work"
      backLabel="← Back to work"
      ariaLabel="Confirmed gig"
    >
      <StageBanner
        tone="champagne"
        text="Application accepted"
        meta={`42 min ago · by ${c.merchantName}`}
      />

      <StageHeader
        eyebrow={`Stage 04 · Confirmed · ${c.merchantName}`}
        title={c.title}
        sub={`${c.merchantName} locked in ${acceptedDay} at ${acceptedTime}. Below is everything you need before the shoot — brief, references, your QR, and the live thread. Open the thread to confirm details.`}
      />

      <StageTwoCol>
        <StageMain>
          {/* Merchant intro — champagne accent for the ceremonial
              "merchant said yes" register */}
          <StageCard eyebrow="Merchant" accent="champagne">
            <div className="cnf__merch">
              <StageMerchAvatar initial={c.merchantName.charAt(0)} size={64} />
              <div className="cnf__merch-body">
                <span className="cnf__merch-name">{c.merchantName}</span>
                <span className="cnf__merch-meta">
                  {c.neighborhood} · {c.distanceMi}mi · {c.category.toLowerCase()}
                </span>
              </div>
            </div>
            <div className="cnf__merch-stats">
              <div className="cnf__merch-stat">
                <span className="cnf__merch-stat-num">4.8</span>
                <span className="cnf__merch-stat-label">Merchant rating</span>
              </div>
              <div className="cnf__merch-stat">
                <span className="cnf__merch-stat-num">12</span>
                <span className="cnf__merch-stat-label">Past creators</span>
              </div>
              <div className="cnf__merch-stat">
                <span className="cnf__merch-stat-num">94%</span>
                <span className="cnf__merch-stat-label">Reply rate</span>
              </div>
            </div>
          </StageCard>

          {/* Briefing pack — full row (5-row label/value table needs width) */}
          <StageCard eyebrow="Briefing pack" title="What to capture" full>
            <ul className="cnf__brief-list">
              <li className="cnf__brief-row">
                <span className="cnf__brief-label">Must include</span>
                <span className="cnf__brief-val">
                  On-location shot · <strong>QR code at table 4</strong> · merchant tag (@{c.merchantName.toLowerCase().replace(/[^a-z]/g, "")}) · branded hashtag
                </span>
              </li>
              <li className="cnf__brief-row">
                <span className="cnf__brief-label">Must avoid</span>
                <span className="cnf__brief-val">
                  Competitor brands in frame · price misquotes · #sponsored without partner tag
                </span>
              </li>
              <li className="cnf__brief-row">
                <span className="cnf__brief-label">Dress code</span>
                <span className="cnf__brief-val">
                  Smart casual. No logo-heavy outerwear from competitor brands.
                </span>
              </li>
              <li className="cnf__brief-row">
                <span className="cnf__brief-label">Time block</span>
                <span className="cnf__brief-val">
                  <strong>{acceptedDay}</strong> · {acceptedTime} · arrive 15 min early to scope angles
                </span>
              </li>
              <li className="cnf__brief-row">
                <span className="cnf__brief-label">Disclosure</span>
                <span className="cnf__brief-val">
                  Standard <strong>#ad</strong> + partner tag at all post-time. DisclosureBot auto-checks at Submit.
                </span>
              </li>
            </ul>
          </StageCard>

          {/* References */}
          {c.images.length > 1 && (
            <StageCard eyebrow="References" title="Visual direction">
              <div className="cnf__refs">
                {c.images.slice(0, 3).map((src, i) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img key={i} className="cnf__ref" src={src} alt="" />
                ))}
              </div>
            </StageCard>
          )}

          {/* Thread preview — full row (long messages, gives breathing room) */}
          <StageCard eyebrow="Thread · last 3 messages" title={`${c.merchantName} · live`} full>
            <ul className="stg__thread">
              {MOCK_THREAD.map((m, i) => (
                <StageThreadMsg key={i} {...m} />
              ))}
            </ul>
            <StageButton variant="ghost" full={false} href="/creator/comms">
              Open full thread →
            </StageButton>
          </StageCard>
        </StageMain>

        <StageRail ariaLabel="Schedule and QR">
          {/* QR code reveal — primary ink card */}
          <StageRailCard
            variant="primary"
            label="Your attribution QR"
            heading="Show or print before the shoot"
            help="Scan the QR in at least one frame. Verified scans drive your milestone bonus and decay-curve attribution."
          >
            <div className="cnf__qr" aria-hidden role="img" aria-label="QR code mock" />
            <p className="cnf__qr-id">QR · {c.id.toUpperCase()} · POSTER 1</p>
            <StageButtonStack>
              <StageButton variant="secondary">Download print PDF</StageButton>
              <StageButton variant="ghost">Save to phone</StageButton>
            </StageButtonStack>
          </StageRailCard>

          {/* Confirmed schedule */}
          <StageRailCard
            label="Confirmed schedule"
            help="Reschedule requests go through the merchant thread — replies usually within an hour."
          >
            <div className="cnf__sched">
              <span className="cnf__sched-day">{acceptedDay}</span>
              <span className="cnf__sched-when">{acceptedTime} · arrive 15 min early</span>
            </div>
            <StageButton variant="ink" href="/creator/comms">
              Open thread
            </StageButton>
          </StageRailCard>

          {/* Next stage */}
          <StageRailCard
            label="When you arrive"
            heading="Move into Shoot"
            help="Tap below at the location to open the live capture checklist + draft slots."
          >
            <StageButton variant="primary" href={`/creator/work/active/${c.id}`}>
              Start shoot
            </StageButton>
          </StageRailCard>
        </StageRail>
      </StageTwoCol>
    </StageShell>
  );
}
