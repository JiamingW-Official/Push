"use client";

/* ============================================================
   /creator/work — WORK domain hub. v18 (2026-05-08 morning)

   Analytics-parity hero (big Darky title + filter chips + export
   on the right) followed by a 2-row asymmetric bento that leaves
   ~80px bottom bleed (the "page-finished" margin Analytics has).

     Hero:  ⌜eyebrow + Darky 72 + meta⌝   ⌜chips · export⌝
     Row 1 (320px): NEXT MOVE 5 (ink) | TIMELINE 4 | PIPELINE 3
     Row 2 (280px): ACTIVE 4         | DRAFTS 4 (champagne) | CAL 4
   ============================================================ */

import {
  BentoModule,
  KpiBlock,
  StatusPill,
} from "@/components/shared/primitives";
import TimeChart from "@/components/shared/charts/TimeChart";
import {
  Zap,
  CalendarClock,
  Layers,
  CheckSquare,
  FileEdit,
  Calendar,
  MapPin,
  Camera,
  Tag,
  Upload,
  Eye,
  CheckCircle2,
  Hourglass,
  AlertTriangle,
} from "lucide-react";
import { useActiveGigs, useToday } from "@/lib/data/hooks";
import "@/components/shared/hub-shell.css";
import "./work.css";

/* Apple-style icon set: 18px stroke 1.75 across the page. */
const ICON_PROPS = { size: 18, strokeWidth: 1.75 } as const;

export default function WorkHub() {
  const { data: active } = useActiveGigs();
  const { data: today } = useToday();

  const acceptedCount = active?.length ?? 0;
  const draftCount =
    today?.invites?.filter((i) => i.status === "pending").length ?? 0;

  return (
    <main className="work-hub" aria-label="Work">
      <header className="work-hero">
        <div className="work-hero__left">
          <h1 className="work-hero__title">Work</h1>
          <p className="work-hero__sub">
            {acceptedCount} active · {draftCount} drafts · refreshed just now
          </p>
        </div>
      </header>

      <section className="work-bento" aria-label="Work modules">
        {/* ── Row 1 ── */}

        <BentoModule
          href="/creator/today"
          eyebrow="Next move · today"
          icon={<Zap {...ICON_PROPS} />}
          span={5}
          tone="ink"
          live="urgent"
        >
          <div className="work-next">
            <p className="work-next__time">9:00</p>
            <p className="work-next__time-meta">AM · in 47 min</p>
            <h2 className="work-next__title">Roberta's Pizza</h2>
            {/* Icon-tagged context row — replaces the old bullet
                paragraph with 3 visual chips. Each chip = one fact
                (place / craft / spec). Reads in 1 glance, no text wall. */}
            <div className="work-next__chips">
              <span className="work-next__chip">
                <MapPin size={14} strokeWidth={2} />
                Williamsburg
              </span>
              <span className="work-next__chip">
                <Camera size={14} strokeWidth={2} />3 frames
              </span>
              <span className="work-next__chip">
                <Tag size={14} strokeWidth={2} />
                Tag merchant
              </span>
            </div>
          </div>
        </BentoModule>

        <BentoModule
          href="/creator/today"
          eyebrow="Today · 3 tasks"
          icon={<CalendarClock {...ICON_PROPS} />}
          span={4}
          live="live"
        >
          <div className="work-timeline-list">
            <span className="work-timeline-row">
              <StatusPill variant="ink" label="9:00 AM" />
              <span className="work-timeline-row__text">Roberta's · shoot</span>
            </span>
            <span className="work-timeline-row">
              <StatusPill variant="blue" label="2:30 PM" />
              <span className="work-timeline-row__text">Devoción · post</span>
            </span>
            <span className="work-timeline-row">
              <StatusPill variant="amber" label="6:00 PM" />
              <span className="work-timeline-row__text">
                Brow Theory · disclose
              </span>
            </span>
          </div>
        </BentoModule>

        <BentoModule
          href="/creator/gigs/history"
          eyebrow="Pipeline · 13"
          icon={<Layers {...ICON_PROPS} />}
          span={3}
          live="live"
        >
          <div className="work-pipeline-vlist">
            <span className="work-pipeline-vrow">
              <span className="work-pipeline-vrow__dot" aria-hidden />
              <span className="work-pipeline-vrow__label">Outreach</span>
              <span className="work-pipeline-vrow__count">2</span>
            </span>
            <span className="work-pipeline-vrow work-pipeline-vrow--active">
              <span className="work-pipeline-vrow__dot" aria-hidden />
              <span className="work-pipeline-vrow__label">Shooting</span>
              <span className="work-pipeline-vrow__count">3</span>
            </span>
            <span className="work-pipeline-vrow">
              <span className="work-pipeline-vrow__dot" aria-hidden />
              <span className="work-pipeline-vrow__label">Submitted</span>
              <span className="work-pipeline-vrow__count">1</span>
            </span>
            <span className="work-pipeline-vrow">
              <span className="work-pipeline-vrow__dot" aria-hidden />
              <span className="work-pipeline-vrow__label">Closed</span>
              <span className="work-pipeline-vrow__count">7</span>
            </span>
          </div>
        </BentoModule>

        {/* ── Row 2 ── */}

        {/* Action queue — replaces the ACTIVE GIGS KPI panel with a
            3-row "what creator must do next" surface. Each row pairs
            a color-coded verb pill (urgency) + target name + time
            label. Tapping the panel opens the filtered queue view.
            This is the page's SECOND most prominent panel after the
            ink NEXT MOVE — sits visually adjacent on row 2. */}
        <BentoModule
          href="/creator/gigs/active"
          eyebrow="Needs you · 3 actions"
          icon={<CheckSquare {...ICON_PROPS} />}
          span={4}
          live="urgent"
        >
          <ul className="work-queue" aria-label="Action queue">
            <li className="work-queue__row work-queue__row--submit">
              <span className="work-queue__tile" aria-hidden>
                <Upload size={14} strokeWidth={2.25} />
              </span>
              <span className="work-queue__copy">
                <span className="work-queue__verb">Submit</span>
                <span className="work-queue__target">Devoción content</span>
              </span>
              <span className="work-queue__when">6 PM</span>
            </li>
            <li className="work-queue__row work-queue__row--review">
              <span className="work-queue__tile" aria-hidden>
                <Eye size={14} strokeWidth={2.25} />
              </span>
              <span className="work-queue__copy">
                <span className="work-queue__verb">Review</span>
                <span className="work-queue__target">Brow Theory</span>
              </span>
              <span className="work-queue__when">Today</span>
            </li>
            <li className="work-queue__row work-queue__row--verify">
              <span className="work-queue__tile" aria-hidden>
                <CheckCircle2 size={14} strokeWidth={2.25} />
              </span>
              <span className="work-queue__copy">
                <span className="work-queue__verb">Verify</span>
                <span className="work-queue__target">Roberta's scan</span>
              </span>
              <span className="work-queue__when">Wait</span>
            </li>
          </ul>
        </BentoModule>

        {/* DRAFTS — champagne accent (the page's only ceremonial panel,
            mirrors Analytics' milestone-hit treatment). */}
        <BentoModule
          href="/creator/gigs/invites"
          eyebrow={`Drafts · ${draftCount} pending`}
          icon={<FileEdit {...ICON_PROPS} />}
          span={4}
          tone="champagne"
          sub="1 due today · 5 within the week"
        >
          <KpiBlock
            eyebrow="IN PROGRESS"
            value={String(draftCount)}
            tone="ink"
          />
          {/* Champagne progress bar — analytics milestone parity */}
          <div className="work-progress" aria-label="Drafts progress">
            <div className="work-progress__track">
              <div
                className="work-progress__fill"
                style={{ width: `${(1 / Math.max(draftCount, 1)) * 100}%` }}
              />
            </div>
            <span className="work-progress__meta">
              1 of {draftCount} due today
            </span>
          </div>
        </BentoModule>

        <BentoModule
          href="/creator/work/calendar"
          eyebrow="Next 7 days"
          icon={<Calendar {...ICON_PROPS} />}
          span={4}
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
          {/* 3 icon stat chips — replaces the plain "3 shoots · 2 deadlines
              · 0 conflicts" sub line with a row of mini icon-tile + numeral
              cards. Each chip has its own color (camera red / clock champagne
              / alert grey) so the eye picks counts instantly. */}
          <div className="work-stats" aria-label="Week stats">
            <span className="work-stats__chip work-stats__chip--shoots">
              <span className="work-stats__icon" aria-hidden>
                <Camera size={13} strokeWidth={2.25} />
              </span>
              <span className="work-stats__num">3</span>
              <span className="work-stats__label">shoots</span>
            </span>
            <span className="work-stats__chip work-stats__chip--deadlines">
              <span className="work-stats__icon" aria-hidden>
                <Hourglass size={13} strokeWidth={2.25} />
              </span>
              <span className="work-stats__num">2</span>
              <span className="work-stats__label">deadlines</span>
            </span>
            <span className="work-stats__chip work-stats__chip--conflicts">
              <span className="work-stats__icon" aria-hidden>
                <AlertTriangle size={13} strokeWidth={2.25} />
              </span>
              <span className="work-stats__num">0</span>
              <span className="work-stats__label">conflicts</span>
            </span>
          </div>
        </BentoModule>

        {/* ── VELOCITY · full-width chart with prior-period overlay ── */}
        <BentoModule
          href="/creator/analytics/campaigns"
          eyebrow="Velocity · gigs / week"
          icon={<Layers {...ICON_PROPS} />}
          span={12}
        >
          <TimeChart
            mode="bar"
            accent="ink"
            valueSuffix=" gigs"
            defaultPeriod="30d"
            data={{
              "7d": [1, 2, 1, 3, 2, 2, 1],
              "30d": Array.from({ length: 30 }, (_, i) =>
                Math.max(0, Math.round(2 + Math.sin(i * 0.7) * 1.5 + i * 0.05)),
              ),
              "90d": Array.from({ length: 12 }, (_, i) =>
                Math.max(2, Math.round(6 + Math.sin(i * 0.5) * 3 + i * 0.4)),
              ),
              all: Array.from({ length: 12 }, (_, i) =>
                Math.max(4, Math.round(8 + Math.cos(i * 0.4) * 4 + i * 0.7)),
              ),
            }}
            priorData={{
              "7d": [1, 1, 1, 2, 1, 2, 1],
              "30d": Array.from({ length: 30 }, (_, i) =>
                Math.max(0, Math.round(1.5 + Math.sin(i * 0.7) * 1.2)),
              ),
              "90d": Array.from({ length: 12 }, (_, i) =>
                Math.max(1, Math.round(4 + Math.sin(i * 0.5) * 2)),
              ),
              all: Array.from({ length: 12 }, (_, i) =>
                Math.max(3, Math.round(6 + Math.cos(i * 0.4) * 3)),
              ),
            }}
            labels={{
              "7d": ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
              "30d": Array.from({ length: 30 }, (_, i) =>
                i % 5 === 0 ? `D${i + 1}` : "",
              ),
              "90d": [
                "Wk1",
                "Wk2",
                "Wk3",
                "Wk4",
                "Wk5",
                "Wk6",
                "Wk7",
                "Wk8",
                "Wk9",
                "Wk10",
                "Wk11",
                "Wk12",
              ],
              all: [
                "Jan",
                "Feb",
                "Mar",
                "Apr",
                "May",
                "Jun",
                "Jul",
                "Aug",
                "Sep",
                "Oct",
                "Nov",
                "Dec",
              ],
            }}
            ariaLabel="Gigs completed velocity"
          />
        </BentoModule>
      </section>
    </main>
  );
}
