"use client";

/* ============================================================
   <PostApplyState> — right-rail card after the creator applies
   v1 · 2026-05-10

   Replaces Pay Anatomy + Eligibility on the campaign detail
   right rail once an application has been submitted for this
   campaign. Surfaces:
     - Status pulse + ETA (Reviewing → expected reply window)
     - Slot held / Reminder set / Push AI watching pills
     - Add to calendar (primary action while waiting)
     - Withdraw (safety net — confirms before firing)

   Push DNA: ink hero card, champagne accents on the status pulse,
   N2W blue for the AI-watching pill, system green checkmarks for
   confirmed states, brand red reserved for the Withdraw confirm.
   ============================================================ */

import { useState } from "react";
import Link from "next/link";
import {
  Clock,
  CalendarPlus,
  ShieldAlert,
  Sparkles,
  CheckCircle2,
  Bell,
  CalendarCheck,
  ListChecks,
  ArrowRight,
} from "lucide-react";
import type { Campaign } from "@/lib/mocks/campaigns";
import type { CreatorApplication } from "@/lib/data/hooks/useCreatorApplications";
import { withdrawApplication } from "@/lib/data/live-applications";

export function PostApplyState({
  campaign,
  application,
}: {
  campaign: Campaign;
  application: CreatorApplication;
}) {
  const [confirmingWithdraw, setConfirmingWithdraw] = useState(false);
  const merchantHours = campaign.merchant?.avgResponseHours ?? 24;

  const slot = application.slotIso ? parseSlotIso(application.slotIso) : null;
  const eta = computeReplyEta(merchantHours, application.id);

  return (
    <div className="cd-post" aria-label="Application status">
      {/* Hero status card — ink anchor, replaces black Pay card. */}
      <div className="cd-post__hero">
        <div className="cd-post__hero-eyebrow">
          <span className="cd-post__pulse" aria-hidden />
          Reviewing now
        </div>
        <p className="cd-post__hero-title">
          {campaign.merchantName} typically replies in <strong>~{merchantHours}h</strong>
        </p>
        <p className="cd-post__hero-eta">
          Latest expected reply <strong>{eta}</strong>
        </p>
        <div className="cd-post__hero-bar" aria-hidden>
          <span className="cd-post__hero-bar-fill" />
        </div>
      </div>

      {/* v25 — primary stage-aware CTA. The single "do this next"
          action right under the status hero. Right now we're in the
          Reviewing stage, so the next high-leverage thing is to
          start prepping for the shoot (book it on calendar, plan
          shot list, scout the spot). When the application transitions
          to Accepted / Day-of / etc., this CTA swaps per stage. */}
      <Link
        href={`/creator/work/calendar?focus=${encodeURIComponent(campaign.id)}`}
        className="cd-post__primary"
      >
        <span className="cd-post__primary-icon" aria-hidden>
          <ListChecks size={18} strokeWidth={2} />
        </span>
        <span className="cd-post__primary-text">
          <span className="cd-post__primary-title">Prep for the shoot</span>
          <span className="cd-post__primary-sub">
            Day-before checklist + reminder
          </span>
        </span>
        <span className="cd-post__primary-arrow" aria-hidden>
          <ArrowRight size={16} strokeWidth={2.25} />
        </span>
      </Link>

      {/* 3 status pills — passive signals, less prominent now that
          there's a primary CTA above. */}
      <ul className="cd-post__pills">
        <li className="cd-post__pill">
          <span className="cd-post__pill-icon cd-post__pill-icon--green" aria-hidden>
            <CheckCircle2 size={16} strokeWidth={2.5} />
          </span>
          <div className="cd-post__pill-text">
            <p className="cd-post__pill-title">Slot held</p>
            <p className="cd-post__pill-sub">
              {slot ? `${slot.date} · ${slot.time}` : "Confirmed"}
            </p>
          </div>
        </li>
        <li className="cd-post__pill">
          <span className="cd-post__pill-icon cd-post__pill-icon--amber" aria-hidden>
            <Bell size={14} strokeWidth={2.25} />
          </span>
          <div className="cd-post__pill-text">
            <p className="cd-post__pill-title">Reminder set</p>
            <p className="cd-post__pill-sub">24 h before your shoot</p>
          </div>
        </li>
        <li className="cd-post__pill">
          <span className="cd-post__pill-icon cd-post__pill-icon--blue" aria-hidden>
            <Sparkles size={14} strokeWidth={2.25} />
          </span>
          <div className="cd-post__pill-text">
            <p className="cd-post__pill-title">Push AI watching</p>
            <p className="cd-post__pill-sub">
              Auto-prep when {campaign.merchantName.split(" ")[0]} accepts
            </p>
          </div>
        </li>
      </ul>

      {/* Slot reference card — small recap so the user can verify */}
      {slot && (
        <div className="cd-post__slot">
          <span className="cd-post__slot-icon" aria-hidden>
            <CalendarCheck size={14} strokeWidth={2.25} />
          </span>
          <div className="cd-post__slot-text">
            <p className="cd-post__slot-eyebrow">Your shoot slot</p>
            <p className="cd-post__slot-when">
              <Clock size={12} strokeWidth={2.25} />
              {slot.date} · {slot.time}
            </p>
            {campaign.address && (
              <p className="cd-post__slot-addr">
                {campaign.address.line1}, {campaign.address.city}
              </p>
            )}
          </div>
        </div>
      )}

      {/* v25 — secondary actions row. Demoted from full-width buttons
          to small text links so the visual hierarchy points to the
          primary "Prep for the shoot" CTA above. */}
      <div className="cd-post__sec">
        <button
          type="button"
          className="cd-post__sec-link"
          onClick={() => {
            window.alert(
              `Calendar event created:\n${campaign.merchantName} shoot\n${slot?.date ?? ""} · ${slot?.time ?? ""}`,
            );
          }}
        >
          <CalendarPlus size={12} strokeWidth={2.25} />
          Add to calendar
        </button>
        <span className="cd-post__sec-sep" aria-hidden>·</span>
        {!confirmingWithdraw ? (
          <button
            type="button"
            className="cd-post__sec-link cd-post__sec-link--danger"
            onClick={() => setConfirmingWithdraw(true)}
          >
            Withdraw
          </button>
        ) : (
          <span className="cd-post__sec-link cd-post__sec-link--danger">
            <button
              type="button"
              className="cd-post__sec-confirm"
              onClick={() => withdrawApplication(application.id)}
              title="Confirm: this will release your slot"
            >
              <ShieldAlert size={11} strokeWidth={2.25} />
              Confirm withdraw
            </button>
            <button
              type="button"
              className="cd-post__sec-cancel"
              onClick={() => setConfirmingWithdraw(false)}
            >
              Keep
            </button>
          </span>
        )}
      </div>
    </div>
  );
}

/* ── Helpers ─────────────────────────────────────────────── */

function parseSlotIso(iso: string): { date: string; time: string } | null {
  if (!iso) return null;
  // slotIso is `YYYY-MM-DDTHH:mm` or full ISO. We only need the
  // date string + the HH:mm window for display — the original
  // selectedSlot also has endTime but we don't store it.
  const [datePart, timePart] = iso.split("T");
  if (!datePart) return null;
  const d = new Date(datePart + "T00:00");
  const dateStr = d.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
  const time = (timePart ?? "").slice(0, 5) || "—";
  return { date: dateStr, time };
}

/** Compute a stable "latest expected" reply timestamp.
 *  avgResponseHours from merchant + 1.5x for the upper bound, then
 *  formatted as "Tomorrow 4pm" / "Sat 11am" / "Today 6pm". */
function computeReplyEta(avgHours: number, anchorId: string): string {
  // Anchor on application id so the ETA stays stable across renders
  // (we don't have the original applied-at timestamp on the
  // CreatorApplication shape — id is "app-{campaignId}-{Date.now}").
  const m = anchorId.match(/-(\d+)$/);
  const appliedAt = m && m[1] ? Number(m[1]) : Date.now();
  const upperBound = Math.round(avgHours * 1.5);
  const eta = new Date(appliedAt + upperBound * 60 * 60 * 1000);
  const now = new Date();
  const sameDay = eta.toDateString() === now.toDateString();
  const tomorrow = new Date(now);
  tomorrow.setDate(now.getDate() + 1);
  const isTomorrow = eta.toDateString() === tomorrow.toDateString();

  const time = eta.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: eta.getMinutes() === 0 ? undefined : "2-digit",
  }).toLowerCase();

  if (sameDay) return `Today ${time}`;
  if (isTomorrow) return `Tomorrow ${time}`;
  return `${eta.toLocaleDateString("en-US", { weekday: "short" })} ${time}`;
}
