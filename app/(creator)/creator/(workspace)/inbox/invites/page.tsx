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
import { useInboxState } from "@/lib/inbox/state";
import {
  PaneHeader,
  PaneSubCount,
  EmptyState,
  FilterChips,
} from "@/lib/inbox/components";
import { Button } from "@/lib/workspace/buttons";
import "../inbox.css";

/* ── Page-local types ────────────────────────────────────────── */

type ConfirmAction = "accept" | "decline" | null;
type InviteFilter = "all" | "urgent" | "match";

/* Seed data, helpers, and parsers were lifted to lib/inbox/seed.ts
   so Invites / Messages / System / Now share one source of truth.
   Page-local logic (rendering, state machines) stays here.        */

/* ── SSR-safe "now" hook — returns null on first paint, then a
       live timestamp after mount. Used to gate any render-time
       comparison against Date.now() so SSR and client agree. */

function useNow(intervalMs = 60_000): number | null {
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);
  return now;
}

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

/* ── Right-hand preview panel ────────────────────────────────── */

function PreviewPanel({
  invite,
  onAccept,
  onDecline,
}: {
  invite: Invite | null;
  onAccept: (id: string) => void;
  onDecline: (id: string) => void;
}) {
  if (!invite) {
    return (
      <aside
        className="inv-preview-panel is-empty"
        aria-label="Invite preview"
        data-lenis-prevent
      >
        <span className="inv-preview-empty-icon" aria-hidden>
          <PaperIcon />
        </span>
        <h3 className="inv-preview-empty-title">Pick an invite to preview.</h3>
        <p className="inv-preview-empty-body">
          Tap any row to open the full brief, payout details, and one-tap
          actions.
        </p>
      </aside>
    );
  }

  const guaranteed = invite.payoutTiers[0]?.amount ?? 0;
  const stretch =
    invite.payoutTiers[invite.payoutTiers.length - 1]?.amount ?? 0;

  return (
    <aside
      className="inv-preview-panel"
      aria-label="Invite preview"
      data-lenis-prevent
    >
      <p className="inv-preview-eyebrow">(BRIEF) · {invite.category}</p>
      <h2 className="inv-preview-brand">{invite.brand}</h2>
      <p className="inv-preview-campaign">{invite.campaign}</p>

      <dl className="inv-preview-stats">
        <div>
          <p className="inv-preview-stat-label">Guaranteed</p>
          <p className="inv-preview-stat-value">${guaranteed}</p>
        </div>
        <div>
          <p className="inv-preview-stat-label">Up to</p>
          <p className="inv-preview-stat-value inv-preview-stat-value--bonus">
            ${stretch}
          </p>
        </div>
      </dl>

      <p className="inv-preview-section-title">(Brief)</p>
      <p className="inv-preview-body">{invite.brief}</p>

      <p className="inv-preview-section-title">(Shoot window)</p>
      <p className="inv-preview-body">{invite.shootWindow}</p>

      <p className="inv-preview-section-title">(QR pickup)</p>
      <p className="inv-preview-body">{invite.qrPickupAddr}</p>

      <div className="inv-preview-actions">
        <Button
          variant="primary"
          size="lg"
          shape="rounded"
          fullWidth
          disabled={invite.status !== "pending"}
          onClick={() => onAccept(invite.id)}
        >
          Accept invite
        </Button>
        <Button
          variant="ghost"
          size="lg"
          shape="rounded"
          disabled={invite.status !== "pending"}
          onClick={() => onDecline(invite.id)}
        >
          Decline
        </Button>
      </div>
    </aside>
  );
}

/* ── Page ────────────────────────────────────────────────────── */

export default function InvitesPage() {
  /* All mutations + state come from the shared context now. The
     side-effects (FTC compliance notification firing on Accept,
     unread badge updates) propagate to /messages, /system, and
     the Hub Now view automatically. Audit §五 fully closed. */
  const {
    invites,
    declineToast,
    acceptInvite,
    declineInvite,
    undoLastDecline,
    toggleAcceptStep,
    acceptTopMatches,
  } = useInboxState();

  const [batchAccepted, setBatchAccepted] = useState(false);
  const [batchConfirming, setBatchConfirming] = useState(false);
  const [filter, setFilter] = useState<InviteFilter>("all");
  const [activeId, setActiveId] = useState<string | null>(null);

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
    (id: string) => acceptInvite(id),
    [acceptInvite],
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

  return (
    <section className="ib-content ib-invites-layout">
      <div className="ib-invites-main" data-lenis-prevent>
        <PaneHeader
          title="Invites"
          sub={
            <>
              <PaneSubCount count={matchCount} label="match your top niches" />{" "}
              · {pending.length} open
            </>
          }
          actions={
            showBatchBar && (
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
            )
          }
        />

        <FilterChips
          ariaLabel="Filter invites"
          style={{ marginBottom: 20 }}
          active={filter}
          onChange={setFilter}
          options={[
            { value: "all", label: "All", hideCount: true },
            { value: "urgent", label: "Urgent", count: urgentCount },
            { value: "match", label: "Top Match", count: matchCount },
          ]}
        />

        {/* List */}
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
          <div className="inv-list">
            {filteredInvites.map((invite) => (
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
            ))}
          </div>
        )}
      </div>

      {/* Right preview panel */}
      <PreviewPanel
        invite={activeInvite}
        onAccept={handleAccept}
        onDecline={handleDecline}
      />

      {/* Decline-with-Undo toast — 5s window, replaces 2-step confirm */}
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
    </section>
  );
}
