"use client";

/* ============================================================
   Invites — v11 Figma-Aligned List + Preview Panel
   Authority: Design.md § 0 STRICT/STRUCTURED · § 6 spacing ·
              § 9 (Filled Primary / Ghost / Pill buttons)
   Layout: 2-col split — list on left, sticky brand preview on
   right (messaging-app pattern). Each row: avatar circle +
   brand info + 98% WATCH black pill + countdown + earnings
   progress bar + Accept/Decline/View Details cluster.
   ============================================================ */

import { useState, useEffect, useCallback, useMemo } from "react";
import Link from "next/link";
import {
  getCategoryGradient,
  detectConflicts,
  type Invite,
  type AcceptStep,
  type PayoutTier,
} from "@/lib/inbox/seed";
import { useWorkspaceState } from "@/lib/workspace/state";
import { useNow } from "@/lib/workspace/hooks";
import { useInvites } from "@/lib/data/hooks";
import { EmptyState } from "@/lib/inbox/components";
import { Button } from "@/lib/workspace/buttons";
import "../gigs.css";

/* ── Page-local types ────────────────────────────────────────── */

type ConfirmAction = "accept" | "decline" | null;
type InviteFilter = "all" | "urgent" | "match";

/* Merchant Identity Palette (Design.md § 20.3)
   Each merchant is locked to one of 8 identity colors so creators
   recognize brands across Today / Gigs / Earnings. The mapping is
   deterministic — a brand never changes color between pages. */
const MERCHANT_IDENTITY: Record<string, string> = {
  Devoción: "aubergine",
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

/* Seed data, helpers, and parsers were lifted to lib/inbox/seed.ts
   so Invites / Messages / System / Now share one source of truth.
   Page-local logic (rendering, state machines) stays here.        */

/* ── Countdown hook ──────────────────────────────────────────── */

function useCountdown(expiresAt: number) {
  /* SSR-safe: start as null so server and client first paint match,
     then compute on mount via useEffect. */
  const [remaining, setRemaining] = useState<number | null>(null);

  useEffect(() => {
    const tick = () => setRemaining(expiresAt - Date.now());
    tick();
    const id = setInterval(tick, 30000);
    return () => clearInterval(id);
  }, [expiresAt]);

  if (remaining == null) return "";
  if (remaining <= 0) return "Expired";

  const totalMins = Math.floor(remaining / 60000);
  const hours = Math.floor(totalMins / 60);
  const mins = totalMins % 60;

  if (hours > 24) return `${Math.floor(hours / 24)}d left`;
  if (hours > 0) return `${hours}h ${mins}m left`;
  return `${mins}m left`;
}

/* ── Icons ───────────────────────────────────────────────────── */

function ClockIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 12 12" fill="none" aria-hidden>
      <circle cx="6" cy="6" r="5" stroke="currentColor" strokeWidth="1.4" />
      <path
        d="M6 3.5V6L7.6 7.2"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

function InboxEmptyIcon() {
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" aria-hidden>
      <rect
        x="6"
        y="10"
        width="28"
        height="22"
        rx="3"
        stroke="currentColor"
        strokeWidth="1.4"
      />
      <path
        d="M6 18l14 8 14-8"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function PaperIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M7 4h7l4 4v12a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M14 4v4h4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* ── Payout tiers — 3 discrete tokens, NOT a continuum ─────────
   Per audit P0: the old gradient progress bar lied — it implied a
   slide between $base → $max → $bonus when in reality these are
   conditional thresholds tied to attribution decay (v5.4 §4 M5).
   The creator gets a discrete amount based on what verified.
   This component states each tier and its trigger explicitly. */
function PayoutTiers({ tiers }: { tiers: PayoutTier[] }) {
  return (
    <ul
      className="inv-row-payout"
      aria-label="Payout tiers — each tier triggers on a specific outcome"
    >
      {tiers.map((t, idx) => (
        <li
          key={t.label}
          className={`inv-row-payout-tier inv-row-payout-tier--${idx === 0 ? "guaranteed" : idx === 1 ? "target" : "stretch"}`}
        >
          <span className="inv-row-payout-amount">${t.amount}</span>
          <div className="inv-row-payout-meta">
            <span className="inv-row-payout-label">{t.label}</span>
            <span className="inv-row-payout-trigger">{t.trigger}</span>
          </div>
        </li>
      ))}
    </ul>
  );
}

/* ── Invite row ──────────────────────────────────────────────── */

function InviteRow({
  invite,
  isActive,
  isRecommended,
  conflicts,
  onSelect,
  onAccept,
  onDecline,
  onCheckStep,
}: {
  invite: Invite;
  isActive: boolean;
  isRecommended: boolean;
  /* Other accepted invites whose shoot window overlaps with this one.
     Empty array = no conflict. Audit P1 — agentic for real. */
  conflicts: Invite[];
  onSelect: (id: string) => void;
  onAccept: (id: string) => void;
  onDecline: (id: string) => void;
  onCheckStep: (inviteId: string, stepId: AcceptStep["id"]) => void;
}) {
  const countdown = useCountdown(invite.expiresAt);
  const accepted = invite.status === "accepted";
  const now = useNow();
  /* Defer urgent / expired classes until after hydration so SSR and
     client first paint match — UI flips to live state on mount. */
  const remainingMs = now == null ? Infinity : invite.expiresAt - now;
  const isUrgent =
    now != null && remainingMs < 6 * 60 * 60 * 1000 && remainingMs > 0;
  const isExpired = now != null && remainingMs <= 0;

  /* Per audit P1: only Accept needs a two-step confirm (FTC commit).
     Decline is one-tap + Undo toast. */
  const [confirming, setConfirming] = useState<ConfirmAction>(null);
  /* Per audit: hover/click reveals the 3 grounding facts behind the
     Watch% score so the creator can complete it. */
  const [whyOpen, setWhyOpen] = useState(false);

  useEffect(() => {
    if (accepted) setConfirming(null);
  }, [accepted]);

  const stop = (handler: () => void) => (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    handler();
  };

  const armAccept = () => {
    if (confirming === "accept") {
      onAccept(invite.id);
      setConfirming(null);
    } else setConfirming("accept");
  };
  const cancelArm = () => setConfirming(null);

  const stepsDone = invite.acceptSteps?.filter((s) => s.done).length ?? 0;
  const stepsTotal = invite.acceptSteps?.length ?? 0;
  const allDone = stepsTotal > 0 && stepsDone === stepsTotal;

  return (
    <article
      className={[
        "inv-row",
        "inv-row--mc-accent",
        `inv-row--mc-${merchantIdentity(invite.brand)}`,
        accepted ? "is-accepted" : "",
        isActive ? "is-active" : "",
        isRecommended && !accepted ? "is-recommended" : "",
      ]
        .filter(Boolean)
        .join(" ")}
      onClick={() => onSelect(invite.id)}
      aria-label={`${invite.brand} — ${invite.campaign}`}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect(invite.id);
        }
      }}
    >
      {isRecommended && !accepted && (
        <span className="inv-row-recommend" aria-hidden>
          Recommended
        </span>
      )}

      <span
        className="inv-row-avatar"
        aria-hidden
        style={{ background: getCategoryGradient(invite.category) }}
      >
        {invite.brandInitial}
      </span>

      <div className="inv-row-content">
        <div className="inv-row-head">
          <div className="inv-row-info">
            <h3 className="inv-row-brand">{invite.brand}</h3>
            <p className="inv-row-campaign">{invite.campaign}</p>
            <p className="inv-row-cat">{invite.category}</p>
          </div>
          <div className="inv-row-meta">
            {/* Watch score — hover or focus reveals the 3 grounding
                facts. Score is no longer a black box. */}
            <button
              type="button"
              className={`inv-row-watch${invite.matchScore >= 90 ? " inv-row-watch--high" : ""}`}
              onClick={stop(() => setWhyOpen((v) => !v))}
              onMouseEnter={() => setWhyOpen(true)}
              onMouseLeave={() => setWhyOpen(false)}
              aria-expanded={whyOpen}
              aria-label={`${invite.matchScore}% match — show why`}
            >
              {invite.matchScore}% Watch
              <span className="inv-row-watch-i" aria-hidden>
                ⓘ
              </span>
              {whyOpen && (
                <span className="inv-row-watch-pop" role="tooltip">
                  <span className="inv-row-watch-pop-eyebrow">Matched on</span>
                  {invite.matchReasons.map((r, i) => (
                    <span key={i} className="inv-row-watch-pop-line">
                      <span className="inv-row-watch-pop-num">{i + 1}.</span>
                      {r}
                    </span>
                  ))}
                </span>
              )}
            </button>

            <span
              className={`inv-row-timer${isUrgent ? " inv-row-timer--urgent" : ""}${isExpired ? " inv-row-timer--expired" : ""}`}
              aria-live={isUrgent ? "polite" : "off"}
              suppressHydrationWarning
            >
              <ClockIcon />
              {countdown}
            </span>
          </div>
        </div>

        {/* Discrete payout tiers — replaces the dishonest gradient bar */}
        <PayoutTiers tiers={invite.payoutTiers} />

        {/* — Action area branches on status — */}
        {accepted && invite.acceptSteps ? (
          /* Post-accept: 4-step checklist. Accept is no longer a vanish. */
          <div className="inv-row-checklist" aria-label="Next steps">
            <div className="inv-row-checklist-head">
              <span className="inv-row-checklist-eyebrow">
                {allDone ? "Ready to shoot" : "Next steps"}
              </span>
              <span className="inv-row-checklist-progress">
                {stepsDone}/{stepsTotal}
              </span>
            </div>
            <ul className="inv-row-checklist-list">
              {invite.acceptSteps.map((s) => (
                <li
                  key={s.id}
                  className={`inv-row-checklist-item${s.done ? " is-done" : ""}`}
                >
                  <button
                    type="button"
                    className="inv-row-checklist-toggle"
                    onClick={stop(() => onCheckStep(invite.id, s.id))}
                    aria-pressed={s.done}
                    aria-label={`${s.done ? "Undo" : "Mark done"}: ${s.label}`}
                  >
                    {s.done ? "✓" : ""}
                  </button>
                  <Link
                    href={s.href}
                    className="inv-row-checklist-label"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {s.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ) : confirming === "accept" ? (
          <div className="inv-row-confirm-wrap">
            {conflicts.length > 0 && (
              <div className="inv-row-conflict" role="alert">
                <span className="inv-row-conflict-icon" aria-hidden>
                  ⚠
                </span>
                <div className="inv-row-conflict-body">
                  <p className="inv-row-conflict-title">
                    Shoot window overlaps with{" "}
                    {conflicts.length === 1
                      ? `${conflicts[0].brand}`
                      : `${conflicts.length} accepted campaigns`}
                  </p>
                  <p className="inv-row-conflict-detail">
                    Your "{invite.shootWindow}" collides with{" "}
                    {conflicts
                      .map((c) => `${c.brand} (${c.shootWindow})`)
                      .join(" · ")}
                    . Make sure capacity is real before committing.
                  </p>
                </div>
              </div>
            )}
            <div className="inv-row-actions">
              <Button
                variant="primary"
                size="md"
                shape="pill"
                confirming
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  armAccept();
                }}
              >
                {conflicts.length > 0
                  ? "Confirm anyway · sign FTC"
                  : "Confirm accept · sign FTC"}
              </Button>
              <Button
                variant="text"
                size="md"
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  cancelArm();
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <div className="inv-row-actions">
            <Button
              variant="primary"
              size="md"
              shape="pill"
              disabled={isExpired}
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                armAccept();
              }}
            >
              Accept
            </Button>
            {/* Decline = one-tap; the page-level toast lets creator Undo */}
            <Button
              variant="ghost"
              size="md"
              shape="pill"
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                onDecline(invite.id);
              }}
            >
              Decline
            </Button>
            {/* Real link, not a placeholder */}
            <Link
              href={invite.briefHref}
              className="inv-row-view"
              onClick={(e) => e.stopPropagation()}
            >
              View brief →
            </Link>
          </div>
        )}
      </div>
    </article>
  );
}

/* ── Rich Detail Panel — v12.2 prototype port ───────────────────
   Replaces the old PreviewPanel with the comprehensive structure
   from /Project Push/creator-gigs.html: brand color accent, eyebrow
   with brand dot, quick stats row, brief, large Outcome Ladder,
   Match Score breakdown, Requirements, Calendar peek, Brand
   reputation, Past creators, sticky glass CTA at bottom.
   Authority: Design.md § 20.5 / § 20.7
   ─────────────────────────────────────────────────────────────── */

function RichDetailPanel({
  invite,
  onAccept,
  onDecline,
}: {
  invite: Invite | null;
  onAccept: (id: string) => void;
  onDecline: (id: string) => void;
}) {
  const countdown = useCountdown(invite?.expiresAt ?? 0);

  if (!invite) {
    return (
      <div className="giv-detail giv-detail--empty" aria-label="Invite preview">
        <span className="giv-detail--empty__icon" aria-hidden>
          <PaperIcon />
        </span>
        <h3 className="giv-detail--empty__title">Pick an invite to preview.</h3>
        <p className="giv-detail--empty__body">
          Tap any row to open the full brief, payout ladder, match score
          breakdown, and one-tap actions.
        </p>
      </div>
    );
  }

  const guaranteed = invite.payoutTiers[0]?.amount ?? 0;
  const stretch =
    invite.payoutTiers[invite.payoutTiers.length - 1]?.amount ?? guaranteed;
  const mc = merchantIdentity(invite.brand);

  /* Match factors — derived from invite.matchScore for visual fidelity.
     Real implementation should read from a backend ranking decomposition. */
  const niche = Math.min(100, invite.matchScore + 4);
  const geo = Math.max(70, invite.matchScore - 2);
  const audience = Math.max(72, invite.matchScore + 1);
  const past = Math.max(70, invite.matchScore - 4);

  /* Reputation, calendar, creators are mock until brands API exposes them. */
  const reputation = {
    rating: 4.7 + (invite.matchScore % 10) / 30,
    avg: 48 + (invite.matchScore % 13),
    onTime: 100,
    activeCampaigns: 8 + (invite.matchScore % 7),
  };

  return (
    <div
      className={"giv-detail giv-detail--mc-" + mc}
      aria-label="Invite preview"
      data-lenis-prevent
    >
      <div className="giv-detail__accent" />

      <div className="giv-detail__head">
        <div className="giv-detail__eyebrow">
          <span className="giv-detail__eyebrow__dot" aria-hidden />
          <span>Brief</span>
          <span className="giv-detail__eyebrow__sep">·</span>
          <span>{invite.category}</span>
        </div>
        <h2 className="giv-detail__title">{invite.brand}</h2>
        <p className="giv-detail__sub">{invite.campaign}</p>
      </div>

      <div className="giv-detail__quick">
        <span className="giv-detail__quick__item" suppressHydrationWarning>
          ⏱ <strong>{countdown || "—"}</strong>
        </span>
        <span className="giv-detail__quick__sep" />
        <span className="giv-detail__quick__item">
          ⚡ <strong>{invite.matchScore}%</strong> match
        </span>
        <span className="giv-detail__quick__sep" />
        <span className="giv-detail__quick__item">
          ${" "}
          <strong>
            ${guaranteed} — ${stretch}
          </strong>
        </span>
        <span className="giv-detail__quick__sep" />
        <span className="giv-detail__quick__item">
          ★ <strong>{reputation.rating.toFixed(1)}</strong>
        </span>
      </div>

      <div className="giv-detail__body">
        {/* The brief */}
        <section className="giv-bsec">
          <header className="giv-bsec__head">
            <span className="giv-bsec__title">The brief</span>
            <span className="giv-bsec__hint">read · 30s</span>
          </header>
          <p className="giv-bsec__body">{invite.brief}</p>
        </section>

        {/* Outcome Ladder large */}
        <section className="giv-bsec">
          <header className="giv-bsec__head">
            <span className="giv-bsec__title">Outcome ladder</span>
            <span className="giv-bsec__hint">3 tiers · pay-per-result</span>
          </header>
          <div className="giv-ladder">
            {invite.payoutTiers.map((tier, idx) => {
              const variant = idx === 0 ? "gtd" : idx === 1 ? "tgt" : "str";
              return (
                <div
                  key={tier.label}
                  className={`giv-ladder__rung giv-ladder__rung--${variant}`}
                >
                  <div className="giv-ladder__tier">{tier.label}</div>
                  <div className="giv-ladder__amount">${tier.amount}</div>
                  <div className="giv-ladder__hint">{tier.trigger}</div>
                </div>
              );
            })}
          </div>
          <div className="giv-ladder-progress">
            <div className="giv-ladder-progress__bar">
              <div className="giv-ladder-progress__seg giv-ladder-progress__seg--filled" />
              <div className="giv-ladder-progress__seg" />
              <div className="giv-ladder-progress__seg" />
            </div>
            <div className="giv-ladder-progress__legend">
              <span>${guaranteed} on accept</span>
              <span>up to ${stretch}</span>
            </div>
          </div>
        </section>

        {/* Match Score Breakdown */}
        <section className="giv-bsec">
          <header className="giv-bsec__head">
            <span className="giv-bsec__title">Why we matched you</span>
            <span className="giv-bsec__hint">{invite.matchScore}% fit</span>
          </header>
          <div className="giv-score">
            <div className="giv-score__total">
              <span className="giv-score__pct">{invite.matchScore}%</span>
              <span className="giv-score__label">
                {invite.matchScore >= 95
                  ? "Top 1% creators for this brief"
                  : invite.matchScore >= 90
                    ? "Top 5% creators for this brief"
                    : "Strong fit · niche + geo aligned"}
              </span>
            </div>
            <div className="giv-score__row giv-score__row--strong">
              <span className="giv-score__name">Niche fit</span>
              <div className="giv-score__bar">
                <div
                  className="giv-score__bar__fill"
                  style={{ width: `${niche}%` }}
                />
              </div>
              <span className="giv-score__num">{niche}</span>
            </div>
            <div className="giv-score__row giv-score__row--strong">
              <span className="giv-score__name">Geo proximity</span>
              <div className="giv-score__bar">
                <div
                  className="giv-score__bar__fill"
                  style={{ width: `${geo}%` }}
                />
              </div>
              <span className="giv-score__num">{geo}</span>
            </div>
            <div className="giv-score__row giv-score__row--good">
              <span className="giv-score__name">Audience fit</span>
              <div className="giv-score__bar">
                <div
                  className="giv-score__bar__fill"
                  style={{ width: `${audience}%` }}
                />
              </div>
              <span className="giv-score__num">{audience}</span>
            </div>
            <div className="giv-score__row giv-score__row--good">
              <span className="giv-score__name">Past scans</span>
              <div className="giv-score__bar">
                <div
                  className="giv-score__bar__fill"
                  style={{ width: `${past}%` }}
                />
              </div>
              <span className="giv-score__num">{past}</span>
            </div>
          </div>
        </section>

        {/* Shoot window calendar peek */}
        <section className="giv-bsec">
          <header className="giv-bsec__head">
            <span className="giv-bsec__title">Shoot window</span>
            <span className="giv-bsec__hint">{invite.shootWindow}</span>
          </header>
          <div className="giv-cal">
            <div className="giv-cal__head">
              <span className="giv-cal__month">May 2026</span>
              <span className="giv-cal__range">{invite.shootWindow}</span>
            </div>
            <div className="giv-cal__grid">
              <span className="giv-cal__dow">M</span>
              <span className="giv-cal__dow">T</span>
              <span className="giv-cal__dow">W</span>
              <span className="giv-cal__dow">T</span>
              <span className="giv-cal__dow">F</span>
              <span className="giv-cal__dow">S</span>
              <span className="giv-cal__dow">S</span>
              {/* Static demo grid; production would derive from shootWindow */}
              <span className="giv-cal__day giv-cal__day--past">28</span>
              <span className="giv-cal__day giv-cal__day--past">29</span>
              <span className="giv-cal__day giv-cal__day--past">30</span>
              <span className="giv-cal__day giv-cal__day--past">1</span>
              <span className="giv-cal__day giv-cal__day--past">2</span>
              <span className="giv-cal__day giv-cal__day--past">3</span>
              <span className="giv-cal__day giv-cal__day--past">4</span>
              <span className="giv-cal__day giv-cal__day--past">5</span>
              <span className="giv-cal__day giv-cal__day--today">6</span>
              <span className="giv-cal__day">7</span>
              <span className="giv-cal__day giv-cal__day--inwindow">8</span>
              <span className="giv-cal__day giv-cal__day--inwindow giv-cal__day--peak">
                9
              </span>
              <span className="giv-cal__day giv-cal__day--inwindow giv-cal__day--peak">
                10
              </span>
              <span className="giv-cal__day">11</span>
            </div>
          </div>
        </section>

        {/* Brand reputation */}
        <section className="giv-bsec">
          <header className="giv-bsec__head">
            <span className="giv-bsec__title">Brand reputation</span>
            <span className="giv-bsec__hint">
              from {reputation.activeCampaigns + 35} creators
            </span>
          </header>
          <div className="giv-rep">
            <div className="giv-rep__cell giv-rep__cell--featured">
              <div className="giv-rep__num">
                <span className="giv-rep__num__star">★</span>
                {reputation.rating.toFixed(1)}
              </div>
              <div className="giv-rep__label">Creator rating</div>
              <div className="giv-rep__delta">Top 5% of brands</div>
            </div>
            <div className="giv-rep__cell">
              <div className="giv-rep__num">
                ${reputation.avg}
                <span className="giv-rep__num__suffix">avg</span>
              </div>
              <div className="giv-rep__label">Per-gig payout</div>
              <div className="giv-rep__delta">+38% vs platform</div>
            </div>
            <div className="giv-rep__cell">
              <div className="giv-rep__num">
                {reputation.onTime}
                <span className="giv-rep__num__suffix">%</span>
              </div>
              <div className="giv-rep__label">On-time pay</div>
            </div>
            <div className="giv-rep__cell">
              <div className="giv-rep__num">{reputation.activeCampaigns}</div>
              <div className="giv-rep__label">Active campaigns</div>
            </div>
          </div>
        </section>

        {/* Past creators */}
        <section className="giv-bsec">
          <header className="giv-bsec__head">
            <span className="giv-bsec__title">Past creators worked here</span>
            <span className="giv-bsec__hint">
              {reputation.activeCampaigns + 35} total
            </span>
          </header>
          <div className="giv-creators">
            <div className="giv-creators__avatars">
              <span
                className="giv-creators__avatar"
                style={{ background: "#c98a8a" }}
              >
                MK
              </span>
              <span
                className="giv-creators__avatar"
                style={{ background: "#7a8a6e" }}
              >
                JL
              </span>
              <span
                className="giv-creators__avatar"
                style={{ background: "#c19a3a" }}
              >
                RS
              </span>
              <span
                className="giv-creators__avatar"
                style={{ background: "#5b3a4f" }}
              >
                AT
              </span>
              <span className="giv-creators__avatar giv-creators__avatar--more">
                +{reputation.activeCampaigns + 30}
              </span>
            </div>
            <span className="giv-creators__text">
              <strong>4 of {reputation.activeCampaigns + 35}</strong> creators
              in your tier — see what worked
            </span>
          </div>
        </section>

        {/* QR pickup */}
        <section className="giv-bsec">
          <header className="giv-bsec__head">
            <span className="giv-bsec__title">QR poster pickup</span>
            <span className="giv-bsec__hint">required pre-shoot</span>
          </header>
          <p className="giv-bsec__body">{invite.qrPickupAddr}</p>
        </section>
      </div>

      {/* ✦ Sticky glass CTA */}
      <div className="giv-detail__cta">
        <button
          type="button"
          className="giv-cta-btn giv-cta-btn--ghost"
          disabled={invite.status !== "pending"}
          onClick={() => onDecline(invite.id)}
        >
          Decline
        </button>
        <button
          type="button"
          className="giv-cta-btn giv-cta-btn--primary"
          disabled={invite.status !== "pending"}
          onClick={() => onAccept(invite.id)}
        >
          Accept gig →
        </button>
      </div>
    </div>
  );
}

/* ── Page ────────────────────────────────────────────────────── */

export default function InvitesPage() {
  /* Data: invites list comes from /api/creator/invites via SWR. Mutations +
     side-effects (FTC compliance notification firing on Accept, unread badge
     updates, decline-toast undo window) still go through WorkspaceState —
     prompt 5 will replace those with optimistic SWR-mutate flows.

     Until prompt 5: a mutation updates the local WorkspaceState invites copy,
     but the page renders from `invites` below (the SWR cache + local merge).
     We mirror local mutations into the rendered list via a memo so the UI
     stays responsive without round-tripping the API. */
  const ws = useWorkspaceState();
  const { data: serverInvites } = useInvites({ status: "all" });
  const {
    declineToast,
    acceptInvite,
    declineInvite,
    undoLastDecline,
    toggleAcceptStep,
    acceptTopMatches,
  } = ws;
  const invites = useMemo(() => {
    /* Local WorkspaceState is the source of truth for transient mutations
       (accept just clicked, decline pending undo). Server data hydrates
       any rows local state hasn't seen yet — typically empty until the
       state provider seeds from server (prompt 5). */
    if (!serverInvites) return ws.invites;
    const localById = new Map(ws.invites.map((i) => [i.id, i]));
    return serverInvites.map((s) => localById.get(s.id) ?? s);
  }, [serverInvites, ws.invites]);

  const [batchAccepted, setBatchAccepted] = useState(false);
  const [batchConfirming, setBatchConfirming] = useState(false);
  const [filter, setFilter] = useState<InviteFilter>("all");
  const [activeId, setActiveId] = useState<string | null>(null);
  const [acceptToast, setAcceptToast] = useState<{ brand: string } | null>(
    null,
  );

  const pending = invites.filter((i) => i.status === "pending");
  const topMatches = pending.filter((i) => i.matchScore >= 90);
  const showBatchBar = topMatches.length >= 2 && !batchAccepted;

  const topRecommendedId = useMemo(() => {
    const candidates = pending.filter((i) => i.matchScore >= 95);
    if (candidates.length === 0) return null;
    return candidates.reduce((best, cur) =>
      cur.matchScore > best.matchScore ? cur : best,
    ).id;
  }, [pending]);

  /* Page-level live clock — null on first paint so SSR markup and
     client hydration agree, then refreshes every 60s. */
  const now = useNow();
  const urgentCount =
    now == null
      ? 0
      : invites.filter(
          (i) =>
            i.status === "pending" && i.expiresAt - now < 6 * 60 * 60 * 1000,
        ).length;
  const matchCount = invites.filter(
    (i) => i.status === "pending" && i.matchScore >= 90,
  ).length;

  const filteredInvites = useMemo(() => {
    if (filter === "urgent")
      return now == null
        ? []
        : invites.filter(
            (i) =>
              i.status === "pending" && i.expiresAt - now < 6 * 60 * 60 * 1000,
          );
    if (filter === "match")
      return invites.filter(
        (i) => i.status === "pending" && i.matchScore >= 90,
      );
    return invites.filter((i) => i.status !== "declined");
  }, [invites, filter, now]);

  const acceptedInvites = useMemo(
    () => invites.filter((i) => i.status === "accepted"),
    [invites],
  );
  const conflictsByInviteId = useMemo(() => {
    const map: Record<string, Invite[]> = {};
    for (const inv of invites) {
      map[inv.id] =
        inv.status === "pending" ? detectConflicts(inv, acceptedInvites) : [];
    }
    return map;
  }, [invites, acceptedInvites]);

  const activeInvite = useMemo(
    () => invites.find((i) => i.id === activeId) ?? null,
    [invites, activeId],
  );

  const handleAccept = useCallback(
    (id: string) => {
      const invite = invites.find((i) => i.id === id);
      acceptInvite(id);
      if (invite) {
        setAcceptToast({ brand: invite.brand });
        setTimeout(() => setAcceptToast(null), 3500);
      }
    },
    [acceptInvite, invites],
  );
  const handleDecline = useCallback(
    (id: string) => {
      declineInvite(id);
      setActiveId((cur) => (cur === id ? null : cur));
    },
    [declineInvite],
  );
  const handleCheckStep = useCallback(
    (inviteId: string, stepId: AcceptStep["id"]) =>
      toggleAcceptStep(inviteId, stepId),
    [toggleAcceptStep],
  );

  const handleBatchClick = useCallback(() => {
    if (batchConfirming) {
      acceptTopMatches();
      setBatchAccepted(true);
      setBatchConfirming(false);
    } else {
      setBatchConfirming(true);
    }
  }, [batchConfirming, acceptTopMatches]);

  const acceptedCount = invites.filter((i) => i.status === "accepted").length;
  const totalUpside = invites
    .filter((i) => i.status === "pending")
    .reduce(
      (sum, i) => sum + (i.payoutTiers[i.payoutTiers.length - 1]?.amount ?? 0),
      0,
    );

  /* Bucket invites for grouped rendering — Top match (≥90%) ·
     Closing soon (urgent + <90%) · Open (everything else) ·
     Accepted (in flight). Filter chips at the top further narrow
     these buckets via filteredInvites. */
  const groupTop = filteredInvites.filter(
    (i) => i.status === "pending" && i.matchScore >= 90,
  );
  const groupUrgent = filteredInvites.filter(
    (i) =>
      i.status === "pending" &&
      i.matchScore < 90 &&
      now != null &&
      i.expiresAt - now < 6 * 60 * 60 * 1000 &&
      i.expiresAt - now > 0,
  );
  const groupOpen = filteredInvites.filter(
    (i) =>
      i.status === "pending" &&
      i.matchScore < 90 &&
      (now == null || i.expiresAt - now >= 6 * 60 * 60 * 1000),
  );
  const groupAccepted = filteredInvites.filter((i) => i.status === "accepted");

  const renderRow = (invite: Invite) => (
    <InviteRow
      key={invite.id}
      invite={invite}
      isActive={invite.id === activeId}
      isRecommended={invite.id === topRecommendedId}
      conflicts={conflictsByInviteId[invite.id] ?? []}
      onSelect={setActiveId}
      onAccept={handleAccept}
      onDecline={handleDecline}
      onCheckStep={handleCheckStep}
    />
  );

  return (
    <section className="ib-content gigs-pane">
      {/* ★★ Hero — Magvix Italic title + weekly goal panel */}
      <header className="giv-hero">
        <div>
          <h1 className="giv-hero__title">Invites</h1>
          <p className="giv-hero__sub" suppressHydrationWarning>
            <strong>{matchCount}</strong> match your top niches ·{" "}
            <strong>{pending.length}</strong> open
            {urgentCount > 0 && (
              <>
                {" "}
                ·{" "}
                <span className="giv-hero__sub__alert">
                  {urgentCount} urgent
                </span>
              </>
            )}
          </p>
        </div>
        <div className="giv-goal">
          <div className="giv-goal__head">
            <span className="giv-goal__label">Weekly goal</span>
            <span className="giv-goal__pct">64%</span>
          </div>
          <div className="giv-goal__bar">
            <div className="giv-goal__bar__fill" style={{ width: "64%" }} />
          </div>
          <div className="giv-goal__money">
            <span>
              <strong>$224</strong> earned
            </span>
            <span>$350 goal</span>
          </div>
        </div>
      </header>

      {/* ☆ Pulse strip · ambient gig metrics (Design.md § 20.6) */}
      <div className="gigs-pulse-strip" role="group" aria-label="Invites pulse">
        <div className="gigs-pulse-strip__title">
          <span className="gigs-pulse-strip__title__dot" aria-hidden />
          Invites
        </div>
        <div className="gigs-pulse-stat gigs-pulse-stat--open">
          <span className="gigs-pulse-stat__dot" aria-hidden />
          <span className="gigs-pulse-stat__label">Open</span>
          <span className="gigs-pulse-stat__value">{pending.length}</span>
          <span className="gigs-pulse-stat__delta">to triage</span>
        </div>
        <div className="gigs-pulse-stat gigs-pulse-stat--match">
          <span className="gigs-pulse-stat__dot" aria-hidden />
          <span className="gigs-pulse-stat__label">Top match</span>
          <span className="gigs-pulse-stat__value" suppressHydrationWarning>
            {matchCount}
          </span>
          <span className="gigs-pulse-stat__delta">≥ 90%</span>
        </div>
        <div className="gigs-pulse-stat gigs-pulse-stat--urgent">
          <span className="gigs-pulse-stat__dot" aria-hidden />
          <span className="gigs-pulse-stat__label">Urgent</span>
          <span className="gigs-pulse-stat__value" suppressHydrationWarning>
            {urgentCount}
          </span>
          <span
            className={
              "gigs-pulse-stat__delta" +
              (urgentCount > 0 ? " gigs-pulse-stat__delta--alert" : "")
            }
            suppressHydrationWarning
          >
            {urgentCount > 0 ? "< 6h left" : "none urgent"}
          </span>
        </div>
        <div className="gigs-pulse-stat gigs-pulse-stat--active">
          <span className="gigs-pulse-stat__dot" aria-hidden />
          <span className="gigs-pulse-stat__label">Active</span>
          <span className="gigs-pulse-stat__value">{acceptedCount}</span>
          <span className="gigs-pulse-stat__delta">in flight</span>
        </div>
        <div className="gigs-pulse-stat gigs-pulse-stat--upside">
          <span className="gigs-pulse-stat__dot" aria-hidden />
          <span className="gigs-pulse-stat__label">Upside</span>
          <span className="gigs-pulse-stat__value">${totalUpside}</span>
          <span className="gigs-pulse-stat__delta">all open · stretch</span>
        </div>
      </div>

      {/* ☆ Toolbar · search + filter + view toggle + bulk action */}
      <div className="giv-toolbar">
        <div className="giv-search">
          <span className="giv-search__icon" aria-hidden>
            ⌕
          </span>
          <input
            type="text"
            placeholder="Find a brand or campaign..."
            aria-label="Search invites"
          />
          <span className="giv-kbd" aria-hidden>
            /
          </span>
        </div>

        <div className="giv-tools-group">
          <span className="giv-tools-group__label">Filter</span>
          <button
            type="button"
            className={
              "giv-chip" + (filter === "all" ? " giv-chip--active" : "")
            }
            onClick={() => setFilter("all")}
          >
            All <span className="giv-chip__num">{pending.length}</span>
          </button>
          <button
            type="button"
            className={
              "giv-chip" + (filter === "urgent" ? " giv-chip--active" : "")
            }
            onClick={() => setFilter("urgent")}
          >
            Urgent{" "}
            <span className="giv-chip__num" suppressHydrationWarning>
              {urgentCount}
            </span>
          </button>
          <button
            type="button"
            className={
              "giv-chip" + (filter === "match" ? " giv-chip--active" : "")
            }
            onClick={() => setFilter("match")}
          >
            Top match <span className="giv-chip__num">{matchCount}</span>
          </button>
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
        </div>

        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          {showBatchBar ? (
            <>
              {batchConfirming && (
                <Button
                  variant="text"
                  size="sm"
                  onClick={() => setBatchConfirming(false)}
                >
                  Cancel
                </Button>
              )}
              <Button
                variant={batchConfirming ? "ink" : "primary"}
                size="md"
                confirming={batchConfirming}
                onClick={handleBatchClick}
              >
                {batchConfirming
                  ? `Confirm · accept ${topMatches.length}`
                  : `Accept top ${topMatches.length}`}
              </Button>
            </>
          ) : null}
        </div>
      </div>

      {/* ★★★ Two-column workspace · grouped list + sticky rich detail */}
      <div className="giv-workspace">
        <div className="giv-list-col">
          {filteredInvites.length === 0 ? (
            <EmptyState
              icon={<InboxEmptyIcon />}
              title={
                filter === "urgent"
                  ? "Nothing urgent."
                  : filter === "match"
                    ? "No top matches right now."
                    : "All caught up."
              }
              body={
                filter === "all"
                  ? "New campaign matches land here when brands invite you."
                  : "Try clearing the filter — or browse open campaigns."
              }
              cta={{
                label: "Browse open campaigns",
                href: "/creator/discover",
              }}
            />
          ) : (
            <>
              {groupTop.length > 0 && (
                <section className="giv-group giv-group--top">
                  <header className="giv-group__head">
                    <span className="giv-group__title">
                      <span className="giv-group__icon" aria-hidden>
                        ★
                      </span>
                      Top match for you
                    </span>
                    <span className="giv-group__count">
                      {groupTop.length} invite
                      {groupTop.length === 1 ? "" : "s"} · ≥ 90% fit
                    </span>
                  </header>
                  <div className="inv-list">{groupTop.map(renderRow)}</div>
                </section>
              )}

              {groupUrgent.length > 0 && (
                <section className="giv-group giv-group--urgent">
                  <header className="giv-group__head">
                    <span className="giv-group__title">
                      <span className="giv-group__icon" aria-hidden>
                        ⏱
                      </span>
                      Closing soon
                    </span>
                    <span className="giv-group__count">
                      {groupUrgent.length} invite
                      {groupUrgent.length === 1 ? "" : "s"} · &lt; 6h left
                    </span>
                  </header>
                  <div className="inv-list">{groupUrgent.map(renderRow)}</div>
                </section>
              )}

              {groupOpen.length > 0 && (
                <section className="giv-group">
                  <header className="giv-group__head">
                    <span className="giv-group__title">
                      <span className="giv-group__icon" aria-hidden>
                        ○
                      </span>
                      Open
                    </span>
                    <span className="giv-group__count">
                      {groupOpen.length} invite
                      {groupOpen.length === 1 ? "" : "s"} · 6 h+ left
                    </span>
                  </header>
                  <div className="inv-list">{groupOpen.map(renderRow)}</div>
                </section>
              )}

              {groupAccepted.length > 0 && (
                <section className="giv-group">
                  <header className="giv-group__head">
                    <span className="giv-group__title">
                      <span
                        className="giv-group__icon"
                        aria-hidden
                        style={{
                          background: "var(--accent-blue, #0085ff)",
                        }}
                      >
                        ✓
                      </span>
                      Already accepted
                    </span>
                    <span className="giv-group__count">
                      {groupAccepted.length} active · in flight
                    </span>
                  </header>
                  <div className="inv-list">{groupAccepted.map(renderRow)}</div>
                </section>
              )}
            </>
          )}
        </div>

        <aside
          className="giv-detail-col"
          aria-label="Invite detail"
          data-lenis-prevent
        >
          <RichDetailPanel
            invite={activeInvite}
            onAccept={handleAccept}
            onDecline={handleDecline}
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
            <span className="giv-kbd">A</span> accept
          </li>
          <li className="giv-kbd-footer__sc">
            <span className="giv-kbd">D</span> decline
          </li>
          <li className="giv-kbd-footer__sc">
            <span className="giv-kbd">B</span> brief
          </li>
          <li className="giv-kbd-footer__sc">
            <span className="giv-kbd">/</span> search
          </li>
        </ul>
      </footer>

      {/* Decline-with-Undo toast */}
      {declineToast && (
        <div className="inv-toast" role="status" aria-live="polite">
          <span className="inv-toast-text">
            Declined <strong>{declineToast.brand}</strong>
          </span>
          <button
            type="button"
            className="inv-toast-undo"
            onClick={undoLastDecline}
          >
            Undo
          </button>
        </div>
      )}

      {/* Accept confirmation toast — 3.5s, no undo needed */}
      {acceptToast && !declineToast && (
        <div
          className="inv-toast inv-toast--accept"
          role="status"
          aria-live="polite"
        >
          <span className="inv-toast-text">
            <strong>{acceptToast.brand}</strong> moved to Active
          </span>
          <Link href="/creator/gigs/active" className="inv-toast-link">
            View →
          </Link>
        </div>
      )}
    </section>
  );
}
