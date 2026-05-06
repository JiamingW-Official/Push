"use client";

import Link from "next/link";
import { useState, useMemo, useCallback } from "react";
import { useWorkspaceState } from "@/lib/workspace/state";
import { useNow } from "@/lib/workspace/hooks";
import { EmptyState } from "@/lib/inbox/components";
import {
  getCategoryGradient,
  type AcceptStep,
  type Invite,
} from "@/lib/inbox/seed";

/* ============================================================
   /creator/gigs/active — v12.2 SaaS canonical
   Port of /Project Push/creator-gigs-active.html prototype:
   Hero + Pipeline · Pulse Strip · Toolbar · Two-column
   workspace (grouped list + sticky RichActiveDetailPanel) ·
   Floating glass reminder pop · Kbd footer
   Authority: Design.md § 20 Product UI Tier System
   ============================================================ */

/* ── Merchant Identity Palette · § 20.3 ──────────────────────── */
const MERCHANT_IDENTITY: Record<string, string> = {
  "Devoción": "aubergine",
  "Sunday in Brooklyn": "terracotta",
  "Cha Cha Matcha": "sage",
  "Superiority Burger": "clay",
  "Roberta's Pizza": "cobalt",
  "Roberta's": "cobalt",
  "Flamingo Estate": "rose",
  "Saint Bagel": "mustard",
  "Blank Street Coffee": "mustard",
  "Brow Theory": "charcoal",
  "Fort Greene Coffee": "aubergine",
  "Bed-Stuy Eats": "terracotta",
};
function merchantIdentity(name: string): string {
  return MERCHANT_IDENTITY[name] ?? "charcoal";
}
const MC_HEX: Record<string, string> = {
  aubergine: "#5b3a4f",
  terracotta: "#b8775a",
  sage: "#7a8a6e",
  clay: "#b8a99a",
  cobalt: "#2d4a6b",
  rose: "#c98a8a",
  mustard: "#c19a3a",
  charcoal: "#3a3835",
};

/* ── Phase derivation ───────────────────────────────────────── */

type Phase = "prep" | "shoot" | "ready" | "review" | "revise";

const PHASE_LABEL: Record<Phase, string> = {
  prep: "In prep",
  shoot: "Shoot today",
  ready: "Ready to shoot",
  review: "In review",
  revise: "Needs revise",
};

function derivePhase(gig: Invite, now: number | null): Phase {
  const steps = gig.acceptSteps ?? [];
  const allDone = steps.length > 0 && steps.every((s) => s.done);
  if (now != null) {
    const m = gig.shootWindow.match(/(\d{1,2})\/(\d{1,2})/g);
    if (m && m.length >= 1) {
      const [startM, startD] = m[0].split("/").map(Number);
      const yr = new Date().getFullYear();
      const startTs = new Date(yr, startM - 1, startD, 9).getTime();
      const ms = startTs - now;
      if (ms > 0 && ms < 24 * 60 * 60 * 1000 && allDone) return "shoot";
    }
  }
  if (allDone) return "ready";
  return "prep";
}

/* Days remaining in a "Mon 5/5 — Sat 5/10" shoot window string */
function shootDaysLeft(shootWindow: string, now: number): string {
  const m = shootWindow.match(/(\d{1,2})\/(\d{1,2})/g);
  if (!m || m.length < 2) return "";
  const [endM, endD] = m[1].split("/").map(Number);
  const yr = new Date().getFullYear();
  const endTs = new Date(yr, endM - 1, endD, 23, 59).getTime();
  const ms = endTs - now;
  if (ms <= 0) return "Window closed";
  const days = Math.ceil(ms / (24 * 60 * 60 * 1000));
  if (days === 1) return "Last day";
  return `${days}d left`;
}

/* Hours until shoot window starts (for the floating reminder pop) */
function hoursUntilStart(shootWindow: string, now: number): number {
  const m = shootWindow.match(/(\d{1,2})\/(\d{1,2})/g);
  if (!m || m.length < 1) return Infinity;
  const [startM, startD] = m[0].split("/").map(Number);
  const yr = new Date().getFullYear();
  const startTs = new Date(yr, startM - 1, startD, 9).getTime();
  return (startTs - now) / (60 * 60 * 1000);
}

/* ── Icons ───────────────────────────────────────────────────── */

function BriefcaseIcon() {
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" aria-hidden>
      <rect
        x="8"
        y="16"
        width="24"
        height="18"
        rx="3"
        stroke="currentColor"
        strokeWidth="1.4"
      />
      <path
        d="M14 16v-4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v4"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <path
        d="M8 24h24"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

/* ── Active Card — v12.2 SaaS rebuild ────────────────────────── */

function ActiveCard({
  gig,
  phase,
  isSelected,
  now,
  onSelect,
}: {
  gig: Invite;
  phase: Phase;
  isSelected: boolean;
  now: number | null;
  onSelect: (id: string) => void;
}) {
  const guaranteed = gig.payoutTiers.find((t) => t.label === "Guaranteed");
  const target = gig.payoutTiers.find((t) => t.label === "Target");
  const stretch = gig.payoutTiers.find((t) => t.label === "Stretch");
  const steps = gig.acceptSteps ?? [];
  const doneCount = steps.filter((s) => s.done).length;
  const totalSteps = steps.length;
  const allDone = totalSteps > 0 && doneCount === totalSteps;
  const daysLeft = now ? shootDaysLeft(gig.shootWindow, now) : null;
  const isClosed = daysLeft === "Window closed";
  const mc = merchantIdentity(gig.brand);
  const gradient = getCategoryGradient(gig.category);

  const lockedFloor = guaranteed?.amount ?? 0;
  const stretchAmount = stretch?.amount ?? lockedFloor;

  const phaseClass = `gav-phase gav-phase--${phase}`;

  return (
    <article
      className={[
        "gav-card",
        isClosed ? "is-closed" : "",
        isSelected ? "is-selected" : "",
      ]
        .filter(Boolean)
        .join(" ")}
      onClick={() => onSelect(gig.id)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect(gig.id);
        }
      }}
      aria-label={`${gig.brand} — ${gig.campaign}`}
    >
      <span
        className="gav-card__accent"
        style={{ background: MC_HEX[mc] }}
        aria-hidden
      />

      <div className="gav-card__head">
        <div className="gav-card__main">
          <span
            className="gav-card__avatar"
            style={{ background: gradient }}
            aria-hidden
          >
            {gig.brandInitial}
          </span>
          <div className="gav-card__id">
            <span className="gav-card__brand">{gig.brand}</span>
            <span className="gav-card__meta">
              <strong>{gig.campaign}</strong>
              <span className="gav-card__meta__sep">·</span>
              <span>{gig.category}</span>
            </span>
          </div>
        </div>
        <span className={phaseClass}>
          <span className="gav-phase__dot" aria-hidden />
          {PHASE_LABEL[phase]}
        </span>
      </div>

      <div className="gav-card__row">
        <div className="gav-card__row__cell">
          <span className="gav-card__row__label">Shoot window</span>
          <span className="gav-card__row__val">{gig.shootWindow}</span>
          <span className="gav-card__row__sub">{daysLeft ?? "—"}</span>
        </div>
        <div className="gav-card__row__cell">
          <span className="gav-card__row__label">Locked</span>
          <span className="gav-card__row__val">${lockedFloor} paid</span>
          <span className="gav-card__row__sub">up to ${stretchAmount} stretch</span>
        </div>
        <div className="gav-card__row__cell">
          <span className="gav-card__row__label">Match</span>
          <span className="gav-card__row__val">{gig.matchScore}%</span>
          <span className="gav-card__row__sub">
            {phase === "shoot"
              ? "leave soon"
              : phase === "ready"
                ? "all set"
                : `${totalSteps - doneCount} todo`}
          </span>
        </div>
      </div>

      {totalSteps > 0 && (
        <div className="gav-check">
          <span className="gav-check__title">Pre-shoot</span>
          <div className="gav-check__bar">
            <div
              className="gav-check__bar__fill"
              style={{
                width: `${(doneCount / totalSteps) * 100}%`,
              }}
            />
          </div>
          <span className="gav-check__count">
            {doneCount} / {totalSteps}
          </span>
        </div>
      )}

      <div className="gav-card__ladder">
        <div className="giv-ladder">
          <div className="giv-ladder__rung giv-ladder__rung--gtd giv-ladder__rung--unlocked">
            <div className="giv-ladder__tier">Gtd</div>
            <div className="giv-ladder__amount">${guaranteed?.amount ?? 0}</div>
          </div>
          <div className="giv-ladder__rung giv-ladder__rung--tgt">
            <div className="giv-ladder__tier">Tgt</div>
            <div className="giv-ladder__amount">${target?.amount ?? 0}</div>
          </div>
          <div className="giv-ladder__rung giv-ladder__rung--str">
            <div className="giv-ladder__tier">Str</div>
            <div className="giv-ladder__amount">${stretch?.amount ?? 0}</div>
          </div>
        </div>
      </div>

      <div className="gav-card__cta" onClick={(e) => e.stopPropagation()}>
        {phase === "ready" || phase === "shoot" ? (
          <>
            <Link
              href={`/creator/campaigns/${gig.id}/shoot`}
              className="giv-cta-btn giv-cta-btn--primary"
            >
              Go shoot →
            </Link>
            <Link href={gig.briefHref} className="giv-cta-btn giv-cta-btn--ghost">
              Brief
            </Link>
          </>
        ) : (
          <>
            <Link
              href={`/creator/campaigns/${gig.id}/calendar`}
              className="giv-cta-btn giv-cta-btn--ghost"
            >
              Calendar
            </Link>
            <Link href={gig.briefHref} className="giv-cta-btn giv-cta-btn--ghost">
              Brief
            </Link>
          </>
        )}
        <Link
          href="/creator/inbox/messages"
          className="giv-cta-btn giv-cta-btn--ghost"
        >
          Message
        </Link>
        <span className="gav-card__cta__spacer" />
        <span className="gav-card__cta__hint">
          {allDone ? "All set" : `${totalSteps - doneCount} todo`}
        </span>
      </div>
    </article>
  );
}

/* ── Rich Active Detail Panel ────────────────────────────────── */

function RichActiveDetailPanel({
  gig,
  phase,
  now,
  onCheckStep,
}: {
  gig: (Invite & { _phase: Phase }) | null;
  phase: Phase | null;
  now: number | null;
  onCheckStep: (gigId: string, stepId: AcceptStep["id"]) => void;
}) {
  if (!gig || !phase) {
    return (
      <div className="giv-detail giv-detail--empty">
        <span className="giv-detail--empty__icon" aria-hidden>
          <BriefcaseIcon />
        </span>
        <h3 className="giv-detail--empty__title">Pick a campaign.</h3>
        <p className="giv-detail--empty__body">
          Tap any active card to see status timeline, scan progress, and
          one-tap actions.
        </p>
      </div>
    );
  }

  const mc = merchantIdentity(gig.brand);
  const guaranteed = gig.payoutTiers[0]?.amount ?? 0;
  const target = gig.payoutTiers[1]?.amount ?? guaranteed;
  const stretch =
    gig.payoutTiers[gig.payoutTiers.length - 1]?.amount ?? guaranteed;
  const upside = stretch - guaranteed;
  const steps = gig.acceptSteps ?? [];
  const doneCount = steps.filter((s) => s.done).length;
  const totalSteps = steps.length;
  const daysLeft = now ? shootDaysLeft(gig.shootWindow, now) : null;

  /* Synthetic scan-progress visualization for the demo. Replace with
     real attribution data when the backend exposes per-gig scan counts. */
  const synthScans = Math.min(
    target ? Math.floor((doneCount / Math.max(totalSteps, 1)) * 8) : 0,
    target ?? 0,
  );
  const targetScans = 10;
  const scansPct = Math.min(100, (synthScans / targetScans) * 100);

  return (
    <div
      className={`giv-detail giv-detail--mc-${mc}`}
      data-lenis-prevent
      aria-label="Active campaign detail"
    >
      <div className="giv-detail__accent" />

      <div className="giv-detail__head">
        <div className="giv-detail__eyebrow">
          <span className="giv-detail__eyebrow__dot" aria-hidden />
          <span>Active</span>
          <span className="giv-detail__eyebrow__sep">·</span>
          <span>{gig.category}</span>
          {phase === "revise" && (
            <>
              <span className="giv-detail__eyebrow__sep">·</span>
              <span style={{ color: "var(--editorial-pink, #e8447d)", fontWeight: 800 }}>
                Needs revise
              </span>
            </>
          )}
        </div>
        <h2 className="giv-detail__title">{gig.brand}</h2>
        <p className="giv-detail__sub">{gig.campaign}</p>
      </div>

      <div className="giv-detail__quick">
        <span className="giv-detail__quick__item" suppressHydrationWarning>
          ⏱ <strong>{daysLeft ?? "—"}</strong>
        </span>
        <span className="giv-detail__quick__sep" />
        <span className="giv-detail__quick__item">
          $ <strong>${guaranteed} locked</strong>
        </span>
        <span className="giv-detail__quick__sep" />
        <span className="giv-detail__quick__item">
          ↑ <strong>${upside} upside</strong>
        </span>
        <span className="giv-detail__quick__sep" />
        <span className="giv-detail__quick__item">
          ⚡ <strong>{gig.matchScore}%</strong> match
        </span>
      </div>

      <div className="giv-detail__body">
        {/* Status timeline */}
        <section className="giv-bsec">
          <header className="giv-bsec__head">
            <span className="giv-bsec__title">Status</span>
            <span className="giv-bsec__hint">
              {phase === "ready"
                ? "step 1 of 4 · ready"
                : phase === "shoot"
                  ? "step 1 of 4 · shooting today"
                  : phase === "review"
                    ? "step 3 of 4 · reviewing"
                    : phase === "revise"
                      ? "step 3 of 4 · revise loop"
                      : "step 1 of 4 · prep"}
            </span>
          </header>
          <div className="gav-timeline">
            <div
              className={
                "gav-timeline__step" +
                (phase === "ready" || phase === "shoot"
                  ? " gav-timeline__step--current"
                  : phase === "review" || phase === "revise"
                    ? " gav-timeline__step--done"
                    : " gav-timeline__step--current")
              }
            >
              <span className="gav-timeline__dot" />
              <span className="gav-timeline__line" />
              <span className="gav-timeline__name">Visit</span>
              <span className="gav-timeline__sub">{gig.shootWindow}</span>
            </div>
            <div
              className={
                "gav-timeline__step" +
                (phase === "review" || phase === "revise"
                  ? " gav-timeline__step--done"
                  : "")
              }
            >
              <span className="gav-timeline__dot" />
              <span className="gav-timeline__line" />
              <span className="gav-timeline__name">Submit</span>
              <span className="gav-timeline__sub">deadline</span>
            </div>
            <div
              className={
                "gav-timeline__step" +
                (phase === "review" || phase === "revise"
                  ? " gav-timeline__step--current"
                  : "")
              }
            >
              <span className="gav-timeline__dot" />
              <span className="gav-timeline__line" />
              <span className="gav-timeline__name">Review</span>
              <span className="gav-timeline__sub">~24h SLA</span>
            </div>
            <div className="gav-timeline__step">
              <span className="gav-timeline__dot" />
              <span className="gav-timeline__line" />
              <span className="gav-timeline__name">Paid</span>
              <span className="gav-timeline__sub">est ~5d</span>
            </div>
          </div>
        </section>

        {/* Brand note (only when revise) */}
        {phase === "revise" && (
          <section className="giv-bsec">
            <header className="giv-bsec__head">
              <span className="giv-bsec__title">Brand note</span>
              <span className="giv-bsec__hint">action required</span>
            </header>
            <p className="gav-brand-note">
              The brand flagged something on your last submission. Review the
              note and resubmit before the scan window closes to keep your
              stretch payout eligibility.
            </p>
          </section>
        )}

        {/* Live scan progress */}
        {(phase === "review" || phase === "revise" || phase === "shoot") && (
          <section className="giv-bsec">
            <header className="giv-bsec__head">
              <span className="giv-bsec__title">Scan progress</span>
              <span className="giv-bsec__hint">QR scans · live</span>
            </header>
            <div className="gav-scan-chart">
              <div className="gav-scan-chart__head">
                <div className="gav-scan-chart__total">
                  <strong>{synthScans}</strong>
                  <span className="gav-scan-chart__total__suffix">
                    {" "}
                    / {targetScans}
                  </span>
                </div>
                <span className="gav-scan-chart__live">
                  live · {Math.max(0, synthScans - 6)} in last 30m
                </span>
              </div>
              <div className="gav-scan-chart__bar">
                <div
                  className="gav-scan-chart__bar__fill"
                  style={{ width: `${scansPct}%` }}
                />
              </div>
              <div className="gav-scan-chart__milestones">
                <span>
                  <strong>0</strong> Gtd ${guaranteed}
                </span>
                <span className="gav-scan-chart__milestones__current">
                  {synthScans} now
                </span>
                <span>
                  <strong>{targetScans}</strong> Tgt ${target}
                </span>
                <span>
                  <strong>{targetScans}+2</strong> Str ${stretch}
                </span>
              </div>
            </div>
          </section>
        )}

        {/* Outcome ladder large */}
        <section className="giv-bsec">
          <header className="giv-bsec__head">
            <span className="giv-bsec__title">Outcome ladder</span>
            <span className="giv-bsec__hint">
              ${guaranteed} locked · ${upside} upside
            </span>
          </header>
          <div className="giv-ladder">
            {gig.payoutTiers.map((tier, idx) => {
              const variant = idx === 0 ? "gtd" : idx === 1 ? "tgt" : "str";
              return (
                <div
                  key={tier.label}
                  className={
                    `giv-ladder__rung giv-ladder__rung--${variant}` +
                    (idx === 0 ? " giv-ladder__rung--unlocked" : "")
                  }
                >
                  <div className="giv-ladder__tier">{tier.label}</div>
                  <div className="giv-ladder__amount">${tier.amount}</div>
                  <div className="giv-ladder__hint">{tier.trigger}</div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Reupload UI (only when revise) */}
        {phase === "revise" && (
          <section className="giv-bsec">
            <header className="giv-bsec__head">
              <span className="giv-bsec__title">Reupload reel</span>
              <span className="giv-bsec__hint">keeps tags from v1</span>
            </header>
            <div className="gav-reupload">
              <span className="gav-reupload__title">Currently submitted</span>
              <div className="gav-reupload__current">
                <div className="gav-reupload__thumb" aria-hidden>
                  ▶
                </div>
                <div className="gav-reupload__info">
                  <span className="gav-reupload__filename">
                    {gig.id.toLowerCase()}-v1.mp4
                  </span>
                  <span className="gav-reupload__meta">
                    18.4 MB
                    <span className="gav-reupload__meta__sep">·</span>
                    0:48
                    <span className="gav-reupload__meta__sep">·</span>
                    submitted
                  </span>
                </div>
                <Link
                  href={`/creator/campaigns/${gig.id}/post`}
                  className="giv-cta-btn giv-cta-btn--ghost"
                  style={{ padding: "6px 12px", fontSize: 11 }}
                >
                  Preview
                </Link>
              </div>
              <p className="gav-reupload__drop">
                Drag <strong>{gig.id.toLowerCase()}-v2.mp4</strong> here, or{" "}
                <Link
                  href={`/creator/campaigns/${gig.id}/post`}
                  style={{
                    color: "var(--ink)",
                    fontWeight: 700,
                    borderBottom: "1px solid var(--ink-5)",
                  }}
                >
                  browse
                </Link>{" "}
                · keeps caption + tags from v1
              </p>
            </div>
          </section>
        )}

        {/* Pre-shoot checklist (acceptSteps) */}
        {steps.length > 0 && (
          <section className="giv-bsec">
            <header className="giv-bsec__head">
              <span className="giv-bsec__title">
                {phase === "revise" ? "Pre-resubmit" : "Pre-shoot"}
              </span>
              <span className="giv-bsec__hint">
                {doneCount} of {totalSteps} done
              </span>
            </header>
            <div className="reqs">
              {steps.map((s) => (
                <div
                  key={s.id}
                  className={"req" + (s.done ? " req--done" : "")}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "16px 1fr auto",
                    gap: 10,
                    alignItems: "center",
                    padding: "8px 12px",
                    background: "rgba(10,10,10,0.02)",
                    borderRadius: 6,
                    marginBottom: 5,
                  }}
                >
                  <button
                    type="button"
                    aria-pressed={s.done}
                    aria-label={`${s.done ? "Undo" : "Mark done"}: ${s.label}`}
                    onClick={() => onCheckStep(gig.id, s.id)}
                    style={{
                      width: 16,
                      height: 16,
                      borderRadius: 4,
                      border: "1.5px solid var(--ink-5)",
                      background: s.done ? "var(--ink)" : "var(--snow)",
                      cursor: "pointer",
                      position: "relative",
                      padding: 0,
                    }}
                  >
                    {s.done && (
                      <span
                        aria-hidden
                        style={{
                          position: "absolute",
                          inset: 2,
                          background: "var(--snow)",
                          clipPath:
                            "polygon(15% 50%, 40% 75%, 85% 25%, 80% 20%, 40% 65%, 20% 45%)",
                        }}
                      />
                    )}
                  </button>
                  <Link
                    href={s.href}
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: 13,
                      color: s.done ? "var(--ink-5)" : "var(--ink)",
                      textDecoration: s.done ? "line-through" : "none",
                    }}
                  >
                    {s.label}
                  </Link>
                  <span
                    style={{
                      fontFamily: "ui-monospace, 'SF Mono', monospace",
                      fontSize: 10,
                      fontWeight: 600,
                      color: "var(--ink-5)",
                    }}
                  >
                    {s.done ? "done" : "todo"}
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* ✦ Sticky glass CTA */}
      <div className="giv-detail__cta">
        <Link
          href="/creator/inbox/messages"
          className="giv-cta-btn giv-cta-btn--ghost"
          style={{ padding: "12px 20px" }}
        >
          Message brand
        </Link>
        <Link
          href={
            phase === "revise"
              ? `/creator/campaigns/${gig.id}/post`
              : phase === "ready" || phase === "shoot"
                ? `/creator/campaigns/${gig.id}/shoot`
                : gig.briefHref
          }
          className="giv-cta-btn giv-cta-btn--primary"
        >
          {phase === "revise"
            ? "Reupload reel →"
            : phase === "ready" || phase === "shoot"
              ? "Go shoot →"
              : "Open brief →"}
        </Link>
      </div>
    </div>
  );
}

/* ── Floating glass reminder pop ─────────────────────────────── */

function ReminderPop({
  gig,
  hours,
}: {
  gig: Invite;
  hours: number;
}) {
  const display =
    hours < 1
      ? `${Math.max(0, Math.round(hours * 60))} min`
      : `${hours.toFixed(1)} h`;
  return (
    <Link
      href={`/creator/campaigns/${gig.id}`}
      className="gav-reminder-pop"
      aria-label={`Imminent shoot · ${gig.brand}`}
    >
      <span className="gav-reminder-pop__icon" aria-hidden>
        ⚡
      </span>
      <span className="gav-reminder-pop__text">
        <span className="gav-reminder-pop__label">
          Imminent · {display}
        </span>
        <span className="gav-reminder-pop__msg">
          {gig.brand} · {gig.campaign}
        </span>
      </span>
      <span className="gav-reminder-pop__cta">Open</span>
    </Link>
  );
}

/* ── Page ────────────────────────────────────────────────────── */

export default function ActiveGigsPage() {
  const { invites, toggleAcceptStep } = useWorkspaceState();
  const now = useNow();
  const [activeId, setActiveId] = useState<string | null>(null);
  const [phaseFilter, setPhaseFilter] = useState<"all" | Phase>("all");

  const accepted = useMemo(
    () => invites.filter((i) => i.status === "accepted"),
    [invites],
  );

  const gigsWithPhase = useMemo(
    () =>
      accepted.map((g) => ({
        ...g,
        _phase: derivePhase(g, now),
      })),
    [accepted, now],
  );

  const counts = useMemo(() => {
    const c: Record<Phase, number> = {
      prep: 0,
      shoot: 0,
      ready: 0,
      review: 0,
      revise: 0,
    };
    for (const g of gigsWithPhase) c[g._phase] += 1;
    return c;
  }, [gigsWithPhase]);

  const totalUpside = accepted.reduce(
    (sum, g) => sum + (g.payoutTiers[g.payoutTiers.length - 1]?.amount ?? 0),
    0,
  );
  const lockedFloor = accepted.reduce(
    (sum, g) => sum + (g.payoutTiers[0]?.amount ?? 0),
    0,
  );

  const filtered = useMemo(
    () =>
      phaseFilter === "all"
        ? gigsWithPhase
        : gigsWithPhase.filter((g) => g._phase === phaseFilter),
    [gigsWithPhase, phaseFilter],
  );

  const groups = useMemo(() => {
    const order: Phase[] = ["shoot", "ready", "revise", "review", "prep"];
    return order
      .map((p) => ({
        phase: p,
        gigs: filtered.filter((g) => g._phase === p),
      }))
      .filter((grp) => grp.gigs.length > 0);
  }, [filtered]);

  const selected = useMemo(() => {
    if (activeId)
      return gigsWithPhase.find((g) => g.id === activeId) ?? null;
    return null;
  }, [activeId, gigsWithPhase]);

  /* Find the most-imminent shoot — render floating reminder pop if
     a shoot is starting within 2 hours and the checklist is complete. */
  const imminent = useMemo(() => {
    if (now == null) return null;
    const candidates = gigsWithPhase
      .filter((g) => g._phase === "shoot" || g._phase === "ready")
      .map((g) => ({ g, h: hoursUntilStart(g.shootWindow, now) }))
      .filter((x) => x.h > 0 && x.h < 2);
    if (candidates.length === 0) return null;
    candidates.sort((a, b) => a.h - b.h);
    return candidates[0];
  }, [gigsWithPhase, now]);

  const handleCheckStep = useCallback(
    (gigId: string, stepId: AcceptStep["id"]) =>
      toggleAcceptStep(gigId, stepId),
    [toggleAcceptStep],
  );

  return (
    <section className="ib-content gigs-pane">
      {/* ★★ Hero — Magvix Italic title + Pipeline distribution panel */}
      <header className="giv-hero">
        <div>
          <h1 className="giv-hero__title">Active</h1>
          <p className="giv-hero__sub">
            <strong>{accepted.length}</strong>{" "}
            {accepted.length === 1 ? "campaign" : "campaigns"} in flight
            {counts.ready > 0 && (
              <>
                {" "}
                · <strong>{counts.ready}</strong> ready to shoot
              </>
            )}
            {counts.revise > 0 && (
              <>
                {" "}
                ·{" "}
                <span className="giv-hero__sub__alert">
                  {counts.revise} need revise
                </span>
              </>
            )}
          </p>
        </div>

        <div className="gav-pipeline">
          <div className="gav-pipeline__head">
            <span className="gav-pipeline__label">Pipeline</span>
            <span className="gav-pipeline__total">
              ${lockedFloor} locked · ${totalUpside} upside
            </span>
          </div>
          <div className="gav-pipeline__stages">
            {counts.prep > 0 && (
              <div
                className="gav-pipeline__stage gav-pipeline__stage--prep"
                style={{ flex: counts.prep }}
              >
                {counts.prep} prep
              </div>
            )}
            {counts.shoot > 0 && (
              <div
                className="gav-pipeline__stage gav-pipeline__stage--shoot"
                style={{ flex: counts.shoot }}
              >
                {counts.shoot} shoot
              </div>
            )}
            {counts.review > 0 && (
              <div
                className="gav-pipeline__stage gav-pipeline__stage--review"
                style={{ flex: counts.review }}
              >
                {counts.review} review
              </div>
            )}
            {counts.revise > 0 && (
              <div
                className="gav-pipeline__stage gav-pipeline__stage--revise"
                style={{ flex: counts.revise }}
              >
                {counts.revise} revise
              </div>
            )}
            {counts.ready > 0 && (
              <div
                className="gav-pipeline__stage gav-pipeline__stage--ready"
                style={{ flex: counts.ready }}
              >
                {counts.ready} ready
              </div>
            )}
          </div>
          <div className="gav-pipeline__legend">
            <span>
              <span className="gav-pipeline__legend__dot" style={{ background: "var(--ink-3)" }} />
              Prep
            </span>
            <span>
              <span className="gav-pipeline__legend__dot" style={{ background: "var(--ga-orange, #ff5e2b)" }} />
              Shoot
            </span>
            <span>
              <span className="gav-pipeline__legend__dot" style={{ background: "var(--accent-blue, #0085ff)" }} />
              Review
            </span>
            <span>
              <span className="gav-pipeline__legend__dot" style={{ background: "var(--editorial-pink, #e8447d)" }} />
              Revise
            </span>
            <span>
              <span className="gav-pipeline__legend__dot" style={{ background: "var(--champagne, #bfa170)" }} />
              Ready
            </span>
          </div>
        </div>
      </header>

      {/* ☆ Pulse Strip · ambient active metrics */}
      <div
        className="gigs-pulse-strip"
        role="group"
        aria-label="Active pulse"
      >
        <div className="gigs-pulse-strip__title">
          <span className="gigs-pulse-strip__title__dot" aria-hidden />
          Active
        </div>
        <div className="gigs-pulse-stat gigs-pulse-stat--active">
          <span className="gigs-pulse-stat__dot" aria-hidden />
          <span className="gigs-pulse-stat__label">In flight</span>
          <span className="gigs-pulse-stat__value">{accepted.length}</span>
          <span className="gigs-pulse-stat__delta">campaigns</span>
        </div>
        <div className="gigs-pulse-stat gigs-pulse-stat--ready">
          <span className="gigs-pulse-stat__dot" aria-hidden />
          <span className="gigs-pulse-stat__label">Ready</span>
          <span className="gigs-pulse-stat__value">{counts.ready}</span>
          <span className="gigs-pulse-stat__delta">to shoot</span>
        </div>
        <div className="gigs-pulse-stat gigs-pulse-stat--urgent">
          <span className="gigs-pulse-stat__dot" aria-hidden />
          <span className="gigs-pulse-stat__label">In prep</span>
          <span className="gigs-pulse-stat__value">{counts.prep}</span>
          <span className="gigs-pulse-stat__delta">checklist open</span>
        </div>
        <div className="gigs-pulse-stat gigs-pulse-stat--upside">
          <span className="gigs-pulse-stat__dot" aria-hidden />
          <span className="gigs-pulse-stat__label">Total upside</span>
          <span className="gigs-pulse-stat__value">${totalUpside}</span>
          <span className="gigs-pulse-stat__delta">${lockedFloor} locked</span>
        </div>
      </div>

      {/* ☆ Toolbar · search + phase filter + view toggle */}
      <div className="giv-toolbar">
        <div className="giv-search">
          <span className="giv-search__icon" aria-hidden>
            ⌕
          </span>
          <input
            type="text"
            placeholder="Find an active campaign..."
            aria-label="Search active campaigns"
          />
          <span className="giv-kbd" aria-hidden>
            /
          </span>
        </div>

        <div className="giv-tools-group">
          <span className="giv-tools-group__label">Phase</span>
          <button
            type="button"
            className={
              "giv-chip" + (phaseFilter === "all" ? " giv-chip--active" : "")
            }
            onClick={() => setPhaseFilter("all")}
          >
            All <span className="giv-chip__num">{accepted.length}</span>
          </button>
          {(["prep", "shoot", "review", "revise", "ready"] as Phase[])
            .filter((p) => counts[p] > 0)
            .map((p) => (
              <button
                key={p}
                type="button"
                className={
                  "giv-chip" + (phaseFilter === p ? " giv-chip--active" : "")
                }
                onClick={() => setPhaseFilter(p)}
              >
                {PHASE_LABEL[p]}{" "}
                <span className="giv-chip__num">{counts[p]}</span>
              </button>
            ))}
        </div>

        <div className="giv-view-toggle">
          <button
            type="button"
            className="giv-view-toggle__btn giv-view-toggle__btn--active"
          >
            List
          </button>
          <button type="button" className="giv-view-toggle__btn">
            Board
          </button>
          <button type="button" className="giv-view-toggle__btn">
            Calendar
          </button>
        </div>

        <div />
      </div>

      {/* ★★★ Two-column workspace · grouped list + sticky rich detail */}
      <div className="giv-workspace">
        <div className="giv-list-col">
          {filtered.length === 0 ? (
            <EmptyState
              icon={<BriefcaseIcon />}
              title={
                phaseFilter === "all"
                  ? "Nothing active yet."
                  : "No campaigns in this phase."
              }
              body={
                phaseFilter === "all"
                  ? "Accepted invites will appear here once you start a campaign."
                  : "Try clearing the filter — or accept new invites to fill the pipeline."
              }
              cta={{ label: "Browse invites", href: "/creator/gigs/invites" }}
            />
          ) : (
            groups.map((group) => (
              <section
                key={group.phase}
                className={
                  "giv-group" +
                  (group.phase === "shoot" || group.phase === "revise"
                    ? " giv-group--urgent"
                    : group.phase === "ready"
                      ? " giv-group--top"
                      : "")
                }
              >
                <header className="giv-group__head">
                  <span className="giv-group__title">
                    <span
                      className="giv-group__icon"
                      aria-hidden
                      style={
                        group.phase === "ready"
                          ? { background: "var(--champagne, #bfa170)", color: "var(--ink)" }
                          : group.phase === "shoot"
                            ? { background: "var(--ga-orange, #ff5e2b)" }
                            : group.phase === "review"
                              ? { background: "var(--accent-blue, #0085ff)" }
                              : group.phase === "revise"
                                ? { background: "var(--editorial-pink, #e8447d)" }
                                : { background: "var(--ink-3)" }
                      }
                    >
                      {group.phase === "ready"
                        ? "★"
                        : group.phase === "shoot"
                          ? "⚡"
                          : group.phase === "review"
                            ? "◐"
                            : group.phase === "revise"
                              ? "!"
                              : "○"}
                    </span>
                    {PHASE_LABEL[group.phase]}
                  </span>
                  <span className="giv-group__count">
                    {group.gigs.length}{" "}
                    {group.gigs.length === 1 ? "campaign" : "campaigns"}
                  </span>
                </header>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 12,
                  }}
                >
                  {group.gigs.map((g) => (
                    <ActiveCard
                      key={g.id}
                      gig={g}
                      phase={g._phase}
                      isSelected={g.id === activeId}
                      now={now}
                      onSelect={setActiveId}
                    />
                  ))}
                </div>
              </section>
            ))
          )}
        </div>

        <aside
          className="giv-detail-col"
          aria-label="Active campaign detail"
          data-lenis-prevent
        >
          <RichActiveDetailPanel
            gig={selected}
            phase={selected?._phase ?? null}
            now={now}
            onCheckStep={handleCheckStep}
          />
        </aside>
      </div>

      {/* ☆ Keyboard shortcuts footer */}
      <footer className="giv-kbd-footer">
        <ul className="giv-kbd-footer__list">
          <li className="giv-kbd-footer__sc">
            <span className="giv-kbd">↑</span>
            <span className="giv-kbd">↓</span> navigate
          </li>
          <li className="giv-kbd-footer__sc">
            <span className="giv-kbd">U</span> upload
          </li>
          <li className="giv-kbd-footer__sc">
            <span className="giv-kbd">M</span> message
          </li>
          <li className="giv-kbd-footer__sc">
            <span className="giv-kbd">B</span> brief
          </li>
          <li className="giv-kbd-footer__sc">
            <span className="giv-kbd">/</span> search
          </li>
        </ul>
      </footer>

      {/* ✦ Floating glass reminder pop · imminent shoot in <2h */}
      {imminent && <ReminderPop gig={imminent.g} hours={imminent.h} />}
    </section>
  );
}
