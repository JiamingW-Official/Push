"use client";

/* ============================================================
   /creator/work/active/[gigId] — Stage 05 · Shoot
   v1 · 2026-05-08

   In-progress working surface. Reached after Stage 04 (Confirmed)
   when the creator arrives at the location. Two-column shell:

     LEFT  — Capture checklist · Draft upload slots · Inline thread
     RIGHT — Progress strip · Time tracker · Stage CTAs

   Built on shared Stage primitives (single .stg__* CSS source).
   Stage-specific UI (frame checklist + upload slots) inlined.
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
  StageThreadMsg,
  StageProgressStrip,
} from "@/components/shared/stage";
import "./active.css";

const MOCK_THREAD = [
  { side: "merchant" as const, name: "Maya · Roberta's", initial: "M",
    text: "I'm here at table 4. Window seat is set up.", time: "12 min ago" },
  { side: "mine" as const, name: "You", initial: "Y",
    text: "On my way — 5 min out. Coffee bar shot first?", time: "9 min ago" },
  { side: "merchant" as const, name: "Maya · Roberta's", initial: "M",
    text: "Yes, ricks just pulled the espresso. Light's perfect.", time: "3 min ago" },
];

type Frame = { id: string; label: string; required: boolean; done: boolean };

const INITIAL_FRAMES: Frame[] = [
  { id: "f1", label: "Storefront — exterior, golden hour", required: true, done: true },
  { id: "f2", label: "Coffee bar — barista pulling shot", required: true, done: true },
  { id: "f3", label: "Table 4 — QR holder visible", required: true, done: false },
  { id: "f4", label: "Detail — pastry close-up, natural light", required: true, done: false },
  { id: "f5", label: "Story B-roll — patron lift mug, slow-mo", required: false, done: false },
];

export default function ShootPage({
  params,
}: {
  params: Promise<{ gigId: string }>;
}) {
  const { gigId } = use(params);
  const c = MOCK_CAMPAIGNS.find((x) => x.id === gigId);
  if (!c) notFound();

  const [frames, setFrames] = useState<Frame[]>(INITIAL_FRAMES);

  const requiredCount = frames.filter((f) => f.required).length;
  const requiredDone = frames.filter((f) => f.required && f.done).length;
  const allDone = requiredDone === requiredCount;

  function toggle(id: string) {
    setFrames((prev) => prev.map((f) => (f.id === id ? { ...f, done: !f.done } : f)));
  }

  return (
    <StageShell backHref="/creator/work" ariaLabel="Shoot in progress">
      <StageBanner
        tone="amber"
        text="Live shoot · timer running"
        meta="Started 18 min ago · est. 90 min total"
      />

      <StageHeader
        eyebrow={`Stage 05 · Shoot · ${c.merchantName}`}
        title={c.title}
        sub={`Tick frames as you capture. Drafts auto-save to your gear roll. When required frames clear, the Submit step unlocks on the right.`}
      />

      <StageTwoCol>
        <StageMain>
          {/* Capture checklist — orange accent signals "live shoot in progress" */}
          <StageCard
            eyebrow="Capture checklist"
            title={`${requiredDone} of ${requiredCount} required frames captured`}
            accent="orange"
            kpi={{
              value: `${requiredDone}/${requiredCount}`,
              label: "Required frames",
              helper: allDone ? "All required captured · Submit unlocked" : `${requiredCount - requiredDone} to go`,
            }}
          >
            <ul className="act__frames">
              {frames.map((f) => (
                <li key={f.id} className={`act__frame${f.done ? " is-done" : ""}`}>
                  <button
                    type="button"
                    className="act__frame-check"
                    onClick={() => toggle(f.id)}
                    aria-pressed={f.done}
                    aria-label={`Toggle ${f.label}`}
                  >
                    {f.done ? "✓" : ""}
                  </button>
                  <span className="act__frame-body">
                    <span className="act__frame-label">{f.label}</span>
                    <span className="act__frame-meta">
                      {f.required ? "Required" : "Optional · b-roll"}
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          </StageCard>

          {/* Draft upload slots */}
          <StageCard eyebrow="Draft uploads" title="Quick-park here as you shoot">
            <div className="act__slots">
              {c.deliverables.map((d, i) => (
                <div key={i} className="act__slot">
                  <span className="act__slot-eyebrow">Slot {i + 1}</span>
                  <span className="act__slot-h">{d.count}× {d.type}</span>
                  <span className="act__slot-meta">{d.estHoursEach}h est. · ${d.unitPay} ea</span>
                  <button type="button" className="act__slot-cta">
                    + Drop file
                  </button>
                </div>
              ))}
            </div>
          </StageCard>

          {/* Inline thread — full row (3rd card in 2-col grid;
              would land alone in col 1 with empty col 2 otherwise) */}
          <StageCard eyebrow="Live thread" title={`${c.merchantName} · 3 new`} full>
            <ul className="stg__thread">
              {MOCK_THREAD.map((m, i) => (
                <StageThreadMsg key={i} {...m} />
              ))}
            </ul>
          </StageCard>
        </StageMain>

        <StageRail ariaLabel="Shoot summary">
          {/* Progress (primary ink card) */}
          <StageRailCard variant="primary" label="Frame progress" heading={allDone ? "Required frames complete" : "Keep shooting"}>
            <StageProgressStrip
              label="Required"
              current={requiredDone}
              total={requiredCount}
              meta={`${frames.filter((f) => !f.required && f.done).length} optional captured`}
              tone="champagne"
            />
          </StageRailCard>

          {/* Time tracker */}
          <StageRailCard label="Time on site" heading="18 min elapsed">
            <p className="stg__rail-help">Estimated 90 min · 72 min remaining buffer</p>
          </StageRailCard>

          {/* Stage CTAs */}
          <StageRailCard label="Next">
            <StageButtonStack>
              <StageButton
                variant="primary"
                href={allDone ? `/creator/work/submit/${c.id}` : undefined}
                disabled={!allDone}
              >
                {allDone ? "Move to Submit →" : `Capture ${requiredCount - requiredDone} more`}
              </StageButton>
              <StageButton variant="secondary">Upload draft</StageButton>
              <StageButton variant="ink" href="/creator/comms">Open thread</StageButton>
            </StageButtonStack>
          </StageRailCard>
        </StageRail>
      </StageTwoCol>
    </StageShell>
  );
}
