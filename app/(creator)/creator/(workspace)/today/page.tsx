"use client";

/* ============================================================
   /creator/today — TODAY domain hub. v2 (2026-05-08, Work-template parity)

   Daily briefing surface — what creator should focus on TODAY. Uses
   the Work-page template (hub-shell hero + 6-panel bento + small
   icon drill) with GA-orange as the page accent for the "live
   execution" register and ONE champagne accent panel for the
   weekly bonus milestone.

   Layout (12-col, 2 rows minmax):
     Row 1: ON NOW 5 (orange solid) | NEEDS YOU 4 | PULSE 3
     Row 2: SCHEDULE 4 | THIS WEEK 4 (champagne) | OPPS 4
   ============================================================ */

import { useMemo } from "react";
import {
  BentoModule,
  KpiBlock,
  StatusPill,
} from "@/components/shared/primitives";
import TimeChart from "@/components/shared/charts/TimeChart";
import {
  Sun,
  CheckSquare,
  TrendingUp,
  CloudSun,
  Navigation,
  CalendarClock,
  Sparkles,
  Compass,
  Upload,
  Eye,
  CheckCircle2,
  Camera,
  Tag,
  MapPin,
} from "lucide-react";
import { useToday } from "@/lib/data/hooks";
import { useNow } from "@/lib/workspace/hooks";
import "@/components/shared/hub-shell.css";
import "./today.css";

const ICON_PROPS = { size: 18, strokeWidth: 1.75 } as const;

function greetingFor(now: number | null, name = "Alex") {
  if (now == null) return `Hi ${name}`;
  const h = new Date(now).getHours();
  if (h < 5) return `Up late, ${name}`;
  if (h < 12) return `Hi ${name}`;
  if (h < 17) return `Hey ${name}`;
  return `Evening, ${name}`;
}

function dateLineFor(now: number | null) {
  if (now == null) return "";
  return new Date(now).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

export default function TodayPage() {
  const { data: today } = useToday();
  const now = useNow(30_000);

  const counts = useMemo(() => {
    const invites = today?.invites ?? [];
    const open = invites.filter((i) => i.status === "pending").length;
    const active = invites.filter((i) => i.status === "accepted").length;
    return { open, active };
  }, [today]);

  return (
    <main className="today-hub" aria-label="Today">
      <header className="today-hero">
        <div className="today-hero__left">
          <h1 className="today-hero__title">{greetingFor(now)}</h1>
          <p className="today-hero__sub">
            {dateLineFor(now)} · {counts.active} active · {counts.open} open
            invites
          </p>
        </div>
      </header>

      <section className="today-bento" aria-label="Today modules">
        {/* ── Row 1 ── */}

        {/* ON NOW — orange solid hero, the "live execution" anchor */}
        <BentoModule
          href="/creator/work"
          eyebrow="On now · live"
          icon={<Sun {...ICON_PROPS} />}
          span={5}
          tone="orange"
          live="urgent"
        >
          <div className="today-now">
            <p className="today-now__time">9:00</p>
            <p className="today-now__time-meta">AM · in 47 min</p>
            <h2 className="today-now__title">Roberta's Pizza shoot</h2>
            <div className="today-now__chips">
              <span className="today-now__chip">
                <MapPin size={14} strokeWidth={2} />
                Williamsburg
              </span>
              <span className="today-now__chip">
                <Camera size={14} strokeWidth={2} />3 frames
              </span>
              <span className="today-now__chip">
                <Tag size={14} strokeWidth={2} />
                Tag merchant
              </span>
            </div>
            {/* Live context strip — countdown progress + weather + ETA */}
            <div className="today-now__context">
              <div className="today-now__countdown" aria-label="Countdown">
                <span className="today-now__countdown-bar">
                  <span
                    className="today-now__countdown-fill"
                    style={{ width: "21%" }}
                  />
                </span>
                <span className="today-now__countdown-meta">
                  47:00 to go · arrive by 8:45
                </span>
              </div>
              <div className="today-now__meta-row">
                <span className="today-now__meta">
                  <CloudSun size={14} strokeWidth={2} />
                  62°F · clear
                </span>
                <span className="today-now__meta">
                  <Navigation size={14} strokeWidth={2} />9 min · L train
                </span>
              </div>
            </div>
          </div>
        </BentoModule>

        {/* NEEDS YOU — action queue */}
        <BentoModule
          href="/creator/gigs/active"
          eyebrow="Needs you · 3 actions"
          icon={<CheckSquare {...ICON_PROPS} />}
          span={4}
          live="urgent"
        >
          <ul className="today-queue" aria-label="Action queue">
            <li className="today-queue__row today-queue__row--submit">
              <span className="today-queue__tile" aria-hidden>
                <Upload size={14} strokeWidth={2.25} />
              </span>
              <span className="today-queue__copy">
                <span className="today-queue__verb">Submit</span>
                <span className="today-queue__target">Devoción content</span>
              </span>
              <span className="today-queue__when">6 PM</span>
            </li>
            <li className="today-queue__row today-queue__row--review">
              <span className="today-queue__tile" aria-hidden>
                <Eye size={14} strokeWidth={2.25} />
              </span>
              <span className="today-queue__copy">
                <span className="today-queue__verb">Review</span>
                <span className="today-queue__target">Brow Theory</span>
              </span>
              <span className="today-queue__when">Today</span>
            </li>
            <li className="today-queue__row today-queue__row--verify">
              <span className="today-queue__tile" aria-hidden>
                <CheckCircle2 size={14} strokeWidth={2.25} />
              </span>
              <span className="today-queue__copy">
                <span className="today-queue__verb">Verify</span>
                <span className="today-queue__target">Roberta's scan</span>
              </span>
              <span className="today-queue__when">Wait</span>
            </li>
          </ul>
        </BentoModule>

        {/* PULSE — week metric */}
        <BentoModule
          href="/creator/analytics"
          eyebrow="Pulse · 7 days"
          icon={<TrendingUp {...ICON_PROPS} />}
          span={3}
          live="live"
        >
          <KpiBlock eyebrow="VERIFIED SCANS" value="42" tone="ink" />
          <span className="today-row-status">
            <StatusPill variant="green" label="+18% vs prior" dot />
          </span>
        </BentoModule>

        {/* ── Row 2 ── */}

        {/* SCHEDULE — today's tasks */}
        <BentoModule
          href="/creator/work/calendar"
          eyebrow="Schedule · 3 tasks"
          icon={<CalendarClock {...ICON_PROPS} />}
          span={4}
          live="live"
        >
          <div className="today-timeline">
            <span className="today-timeline__row">
              <StatusPill variant="ink" label="9:00 AM" />
              <span className="today-timeline__text">Roberta's · shoot</span>
            </span>
            <span className="today-timeline__row">
              <StatusPill variant="blue" label="2:30 PM" />
              <span className="today-timeline__text">Devoción · post</span>
            </span>
            <span className="today-timeline__row">
              <StatusPill variant="amber" label="6:00 PM" />
              <span className="today-timeline__text">
                Brow Theory · disclose
              </span>
            </span>
          </div>
        </BentoModule>

        {/* THIS WEEK — champagne accent for weekly bonus milestone */}
        <BentoModule
          href="/creator/money/earnings"
          eyebrow="This week · earnings"
          icon={<Sparkles {...ICON_PROPS} />}
          span={4}
          tone="champagne"
        >
          <KpiBlock eyebrow="EARNED" value="$87" tone="ink" />
          <div className="today-bonus">
            <div className="today-bonus__track">
              <div className="today-bonus__fill" style={{ width: "84%" }} />
            </div>
            <span className="today-bonus__meta">
              42 of 50 scans · 8 to bonus
            </span>
          </div>
        </BentoModule>

        {/* OPPORTUNITIES — new invites */}
        <BentoModule
          href="/creator/discover"
          eyebrow="Opportunities · 3 new"
          icon={<Compass {...ICON_PROPS} />}
          span={4}
        >
          <ul className="today-opps" aria-label="Open invites">
            <li className="today-opps__row">
              <span className="today-opps__name">Cafe Reggio</span>
              <span className="today-opps__match">98% match</span>
            </li>
            <li className="today-opps__row">
              <span className="today-opps__name">Russ &amp; Daughters</span>
              <span className="today-opps__match">94% match</span>
            </li>
            <li className="today-opps__row">
              <span className="today-opps__name">Veselka</span>
              <span className="today-opps__match">89% match</span>
            </li>
          </ul>
        </BentoModule>

        {/* ── Row 3 · wide insight chart ── */}
        <BentoModule
          href="/creator/analytics/attribution"
          eyebrow="Verified scans · trend"
          icon={<TrendingUp {...ICON_PROPS} />}
          span={12}
        >
          <TimeChart
            accent="orange"
            valueSuffix=" scans"
            defaultPeriod="30d"
            data={{
              "7d": [4, 6, 5, 8, 7, 11, 12],
              "30d": Array.from({ length: 30 }, (_, i) =>
                Math.max(2, Math.round(8 + Math.sin(i * 0.5) * 5 + i * 0.3)),
              ),
              "90d": Array.from({ length: 90 }, (_, i) =>
                Math.max(2, Math.round(10 + Math.sin(i * 0.3) * 8 + i * 0.4)),
              ),
              all: Array.from({ length: 52 }, (_, i) =>
                Math.max(2, Math.round(14 + Math.cos(i * 0.25) * 10 + i * 1.2)),
              ),
            }}
            labels={{
              "7d": ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
              "30d": Array.from({ length: 30 }, (_, i) =>
                i % 5 === 0 ? `D${i + 1}` : "",
              ),
              "90d": Array.from({ length: 90 }, (_, i) =>
                i % 30 === 0 ? `M${i / 30 + 1}` : "",
              ),
              all: Array.from({ length: 52 }, (_, i) =>
                i % 13 === 0 ? `Q${Math.floor(i / 13) + 1}` : "",
              ),
            }}
            ariaLabel="Verified scans over time"
          />
        </BentoModule>
      </section>
    </main>
  );
}
