"use client";

/* ============================================================
   <InviteCard> — full-feature invite card.

   Composes the modular primitives:
     - <StatusPill>     urgency chip (overdue / invite / soon)
     - <StageTracker>   shows stage 1 of 7 (Invited)
     - <NextActionBar>  "your move · accept or decline"

   Plus invite-specific surfaces:
     - Match-score Watch badge (with hoverable "why?" reasons)
     - 3-tier Payout Ladder (Guaranteed / Target / Stretch)
     - Live countdown to expiry
     - Brand initial avatar + campaign

   States:
     idle        — show full card with Accept / Decline buttons
     confirming  — show "Are you sure?" overlay (decline only)
     accepted    — collapse into success state (parent removes from list)
     declined    — collapse into "undone? click to restore" (parent handles)
   ============================================================ */

import { useState, useEffect } from "react";
import Link from "next/link";
import type { Invite } from "@/lib/inbox/seed";
import { StatusPill } from "./StatusPill";
import { StageTracker } from "./StageTracker";
import { NextActionBar } from "./NextActionBar";
import { Sparkles, MapPin, Check, X, FileText, Eye } from "lucide-react";

/* ── Live countdown ──────────────────────────────────────── */

function useCountdown(expiresAt: number) {
  const [remaining, setRemaining] = useState<number | null>(null);
  useEffect(() => {
    setRemaining(expiresAt - Date.now());
    const id = setInterval(() => setRemaining(expiresAt - Date.now()), 1000);
    return () => clearInterval(id);
  }, [expiresAt]);
  return remaining;
}

function formatCountdown(ms: number | null): string {
  if (ms == null) return "—";
  if (ms <= 0) return "Expired";
  const totalSec = Math.floor(ms / 1000);
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  if (h >= 24) return `${Math.floor(h / 24)}d ${h % 24}h`;
  if (h >= 1) return `${h}h ${m}m`;
  if (m >= 1) return `${m}m ${s}s`;
  return `${s}s`;
}

/* ── Component ───────────────────────────────────────────── */

interface Props {
  invite: Invite;
  isRecommended?: boolean;
  isActive?: boolean;
  onAccept: (id: string) => void;
  onDecline: (id: string) => void;
  onSelect?: (id: string) => void;
}

export function InviteCard({
  invite,
  isRecommended = false,
  isActive = false,
  onAccept,
  onDecline,
  onSelect,
}: Props) {
  const remaining = useCountdown(invite.expiresAt);
  const [confirmingDecline, setConfirmingDecline] = useState(false);
  const [whyOpen, setWhyOpen] = useState(false);

  // Auto-cancel decline confirmation if user moves away
  useEffect(() => {
    if (!confirmingDecline) return;
    const t = setTimeout(() => setConfirmingDecline(false), 5000);
    return () => clearTimeout(t);
  }, [confirmingDecline]);

  // Pick urgency from countdown
  const urgency =
    remaining == null
      ? "invite"
      : remaining <= 0
        ? "overdue"
        : remaining < 60 * 60 * 1000
          ? "today"
          : remaining < 6 * 60 * 60 * 1000
            ? "soon"
            : "invite";

  const stop = (fn: () => void) => (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    fn();
  };

  const matchHigh = invite.matchScore >= 90;

  return (
    <article
      className={[
        "inv-card",
        isRecommended ? "inv-card--recommended" : "",
        isActive ? "inv-card--active" : "",
        confirmingDecline ? "inv-card--confirming" : "",
      ]
        .filter(Boolean)
        .join(" ")}
      onClick={() => onSelect?.(invite.id)}
      role={onSelect ? "button" : undefined}
      tabIndex={onSelect ? 0 : undefined}
    >
      {/* Top recommendation ribbon */}
      {isRecommended && (
        <div className="inv-card__ribbon" aria-hidden>
          <Sparkles size={11} strokeWidth={2.5} />
          Recommended for you
        </div>
      )}

      {/* ── Header row ──────────────────────────────── */}
      <header className="inv-card__head">
        <div className="inv-card__brand-block">
          <span className="inv-card__avatar">{invite.brandInitial}</span>
          <div className="inv-card__title-block">
            <h3 className="inv-card__brand">{invite.brand}</h3>
            <p className="inv-card__campaign">{invite.campaign}</p>
            <p className="inv-card__category">
              <MapPin size={11} strokeWidth={2.25} />
              {invite.category} · {invite.shootWindow}
            </p>
          </div>
        </div>
        <div className="inv-card__head-right">
          <StatusPill
            urgency={urgency}
            label={urgency === "overdue" ? "Expired" : "Invite"}
            countdown={
              urgency === "overdue" ? undefined : formatCountdown(remaining)
            }
            size="md"
          />
          <button
            type="button"
            className={`inv-watch ${matchHigh ? "inv-watch--high" : ""}`}
            onClick={stop(() => setWhyOpen((v) => !v))}
            onMouseEnter={() => setWhyOpen(true)}
            onMouseLeave={() => setWhyOpen(false)}
            aria-expanded={whyOpen}
            aria-label={`${invite.matchScore}% match — show reasons`}
          >
            <span className="inv-watch__num">{invite.matchScore}</span>
            <span className="inv-watch__pct">% match</span>
          </button>
        </div>
      </header>

      {/* ── Why-you tooltip ─────────────────────────── */}
      {whyOpen && (
        <ul className="inv-why" aria-label="Why this matches">
          {invite.matchReasons.map((r, i) => (
            <li key={i}>
              <Check size={11} strokeWidth={2.5} />
              {r}
            </li>
          ))}
        </ul>
      )}

      {/* ── Stage tracker ───────────────────────────── */}
      <div className="inv-card__stage">
        <StageTracker stage={1} size="lg" />
      </div>

      {/* ── 3-tier payout ladder ────────────────────── */}
      <div className="inv-tiers" aria-label="Payout ladder">
        {invite.payoutTiers.map((tier, i) => (
          <div
            key={tier.label}
            className={`inv-tier inv-tier--${tier.label.toLowerCase()}`}
          >
            <span className="inv-tier__amount">${tier.amount}</span>
            <span className="inv-tier__label">{tier.label}</span>
            <span className="inv-tier__trigger">{tier.trigger}</span>
            {i < invite.payoutTiers.length - 1 && (
              <span className="inv-tier__chevron" aria-hidden>
                →
              </span>
            )}
          </div>
        ))}
      </div>

      {/* ── Next action ─────────────────────────────── */}
      {!confirmingDecline ? (
        urgency === "overdue" ? (
          <NextActionBar
            owner="done"
            hint="Invite expired — no action available"
            actions={[
              {
                label: "View brief",
                variant: "ghost",
                icon: <FileText size={12} strokeWidth={2.25} />,
                href: invite.briefHref,
              },
            ]}
          />
        ) : (
          <NextActionBar
            owner="creator"
            hint={`Accept or decline — ${formatCountdown(remaining)} until invite closes`}
            actions={[
              {
                label: "Accept",
                variant: "primary",
                icon: <Check size={12} strokeWidth={2.5} />,
                onClick: () => onAccept(invite.id),
              },
              {
                label: "Decline",
                variant: "ghost",
                icon: <X size={12} strokeWidth={2.5} />,
                onClick: () => setConfirmingDecline(true),
              },
              {
                label: "View brief",
                variant: "ghost",
                icon: <FileText size={12} strokeWidth={2.25} />,
                href: invite.briefHref,
              },
            ]}
          />
        )
      ) : (
        <div className="inv-confirm" role="alertdialog">
          <p className="inv-confirm__msg">
            <X size={14} strokeWidth={2.5} />
            Decline this invite? You can&apos;t undo after 30 seconds.
          </p>
          <div className="inv-confirm__actions">
            <button
              type="button"
              className="gigs-next__btn gigs-next__btn--primary"
              onClick={stop(() => {
                setConfirmingDecline(false);
                onDecline(invite.id);
              })}
            >
              Yes, decline
            </button>
            <button
              type="button"
              className="gigs-next__btn gigs-next__btn--ghost"
              onClick={stop(() => setConfirmingDecline(false))}
            >
              Keep invite
            </button>
          </div>
        </div>
      )}

      {onSelect && (
        <Link
          href={invite.briefHref}
          className="inv-card__peek"
          onClick={(e) => e.stopPropagation()}
        >
          <Eye size={11} strokeWidth={2.25} />
          Open full brief
        </Link>
      )}
    </article>
  );
}
