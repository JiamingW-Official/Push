"use client";

/* ============================================================
   /creator/work — WORK domain hub. Audit § 5.2 bento spec.

   The execution-layer surface. Everything you're DOING right now —
   pipeline kanban, today's tasks, drafts in review, calendar, in-flight
   gigs, open disputes.

   Bento (audit § 5.2):
     [─── PIPELINE (kanban, span 12) ───────────────────────]
     [─ TIMELINE (7) ──────] [─ ACTIVE GIGS list (5) ─────]
     [─ DRAFTS (5) ──] [─ CALENDAR (4) ──] [─ DISPUTES (3) ─]
   ============================================================ */

import {
  BentoModule,
  KpiBlock,
  ProgressBar,
  StatusPill,
} from "@/components/shared/primitives";
import { useActiveGigs, useToday } from "@/lib/data/hooks";
import "@/components/shared/hub-shell.css";
import "./work.css";

export default function WorkHub() {
  const { data: active } = useActiveGigs();
  const { data: today } = useToday();

  const phaseCounts = (active ?? []).reduce<Record<string, number>>((acc) => {
    return acc;
  }, {});
  void phaseCounts;

  const acceptedCount = active?.length ?? 0;
  const draftCount =
    today?.invites?.filter((i) => i.status === "pending").length ?? 0;

  return (
    <main className="work-hub" aria-label="Work">
      <header className="work-hero">
        <p className="work-hero__eyebrow">WORK · EXECUTION LAYER</p>
        <h1 className="work-hero__title">Work</h1>
        <p className="work-hero__sub">
          Everything you're doing right now. Pipeline at the top is the
          canonical kanban — accept → shoot → submit → close. Below: today's
          tasks, active gigs detail, drafts in review, calendar conflicts, and
          any disputes that need attention.
        </p>
      </header>

      <section className="work-bento" aria-label="Work modules">
        {/* ── PIPELINE (span 12 — the hero kanban) ── */}
        <BentoModule
          href="/creator/gigs/active"
          eyebrow="PIPELINE · KANBAN · OUTREACH → CLOSED"
          span={12}
          live="live"
          sub={`${acceptedCount} active · phase distribution snapshot`}
        >
          <div className="work-pipeline-row">
            <span className="work-pipeline-cell">
              <span className="work-pipeline-cell__count">2</span>
              <span className="work-pipeline-cell__label">Outreach</span>
            </span>
            <span className="work-pipeline-divider" aria-hidden>
              →
            </span>
            <span className="work-pipeline-cell">
              <span className="work-pipeline-cell__count">3</span>
              <span className="work-pipeline-cell__label">Shooting</span>
            </span>
            <span className="work-pipeline-divider" aria-hidden>
              →
            </span>
            <span className="work-pipeline-cell">
              <span className="work-pipeline-cell__count">1</span>
              <span className="work-pipeline-cell__label">Submitted</span>
            </span>
            <span className="work-pipeline-divider" aria-hidden>
              →
            </span>
            <span className="work-pipeline-cell">
              <span className="work-pipeline-cell__count">7</span>
              <span className="work-pipeline-cell__label">Closed</span>
            </span>
          </div>
        </BentoModule>

        {/* ── TIMELINE (span 7) ── */}
        <BentoModule
          href="/creator/today"
          eyebrow="TIMELINE · TODAY'S TASKS"
          span={7}
          live="live"
          sub="What's happening right now across all campaigns"
        >
          <div className="work-timeline-list">
            <span className="work-timeline-row">
              <StatusPill variant="ink" label="9:00 AM" />
              <span className="work-timeline-row__text">
                Roberta's Pizza · shoot start
              </span>
            </span>
            <span className="work-timeline-row">
              <StatusPill variant="blue" label="2:30 PM" />
              <span className="work-timeline-row__text">
                Devoción · post deadline
              </span>
            </span>
            <span className="work-timeline-row">
              <StatusPill variant="amber" label="6:00 PM" />
              <span className="work-timeline-row__text">
                Brow Theory · disclosure due
              </span>
            </span>
          </div>
        </BentoModule>

        {/* ── ACTIVE GIGS list (span 5) ── */}
        <BentoModule
          href="/creator/gigs/active"
          eyebrow="ACTIVE GIGS · PHASE MACHINE"
          span={5}
          live="off"
          sub={`${acceptedCount} in flight · scan → verify → post → paid`}
        >
          <KpiBlock
            eyebrow="ACCEPTED"
            value={String(acceptedCount)}
            tone="ink"
            compact
          />
          <ProgressBar
            mode="segmented"
            step={1}
            total={4}
            stepLabels={["Accept", "Shoot", "Submit", "Paid"]}
            tone="ink"
          />
        </BentoModule>

        {/* ── DRAFTS (span 5) ── */}
        <BentoModule
          href="/creator/gigs/invites"
          eyebrow="DRAFTS · CONTENT IN REVIEW"
          span={5}
          live="off"
          sub={`${draftCount} drafts pending · last edit 2h ago`}
        >
          <KpiBlock
            eyebrow="IN PROGRESS"
            value={String(draftCount)}
            tone="ink"
            compact
          />
          <span className="work-row-status">
            <StatusPill
              variant={draftCount > 0 ? "amber" : "neutral"}
              label={draftCount > 0 ? "needs review" : "clear"}
              dot
            />
          </span>
        </BentoModule>

        {/* ── CALENDAR (span 4) ── */}
        <BentoModule
          href="/creator/work/calendar"
          eyebrow="CALENDAR · NEXT 7 DAYS"
          span={4}
          live="off"
          sub="3 shoots · 2 deadlines · 0 conflicts"
        >
          <div className="work-list">
            <span className="work-list-row">
              <span className="work-list-row__date">MON</span>
              <span className="work-list-row__text">Roberta's shoot</span>
            </span>
            <span className="work-list-row">
              <span className="work-list-row__date">WED</span>
              <span className="work-list-row__text">Devoción post</span>
            </span>
            <span className="work-list-row">
              <span className="work-list-row__date">FRI</span>
              <span className="work-list-row__text">Brow Theory</span>
            </span>
          </div>
        </BentoModule>

        {/* ── DISPUTES (span 3) ── */}
        <BentoModule
          href="/creator/disputes"
          eyebrow="DISPUTES · OPEN CASES"
          span={3}
          live="off"
          sub="0 open · all clear"
        >
          <KpiBlock eyebrow="OPEN" value="0" tone="ink" compact />
          <StatusPill variant="green" label="No issues" dot />
        </BentoModule>
      </section>
    </main>
  );
}
