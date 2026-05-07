'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import type {
  ApplicationStatus,
  CreatorTier,
  MockApplication,
} from '@/lib/data/mock-applications';
import { TierBadge } from '@/components/merchant/shared';
import './applicant-detail-dialog.css';

type Decision = 'accept' | 'decline' | 'shortlist';

interface ApplicantDetailDialogProps {
  applicant: MockApplication | null;
  appliedLabel: string;
  isPending: boolean;
  onClose: () => void;
  onDecide: (applicant: MockApplication, decision: Decision) => void;
}

const STATUS_LABEL: Record<ApplicationStatus, string> = {
  accepted: 'Accepted',
  pending: 'Pending review',
  declined: 'Rejected',
  shortlisted: 'Shortlisted',
};

const PREMIUM_TIERS: ReadonlySet<CreatorTier> = new Set(['partner', 'closer']);

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

function getFocusable(container: HTMLElement | null): HTMLElement[] {
  if (!container) return [];
  const nodes = container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR);
  return Array.from(nodes).filter((el) => el.getAttribute('aria-hidden') !== 'true');
}

function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  return `${parts[0]?.[0] ?? ''}${parts[1]?.[0] ?? ''}`.toUpperCase();
}

function formatCompact(value: number): string {
  return new Intl.NumberFormat('en-US', {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(value);
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M6 6 18 18M18 6 6 18" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
    </svg>
  );
}

function MessageIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M2.5 3.5h11v7h-6l-3 2v-2h-2v-7Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function StarStamp() {
  return (
    <span className="apd-tier-stamp" aria-label="Premium tier" title="Premium tier creator">
      <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
        <path d="M8 1.5l1.93 4 4.41.5-3.27 3 .87 4.34L8 11.4l-3.94 1.94.87-4.34-3.27-3 4.41-.5z" />
      </svg>
    </span>
  );
}

export function ApplicantDetailDialog({
  applicant,
  appliedLabel,
  isPending,
  onClose,
  onDecide,
}: ApplicantDetailDialogProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const previouslyFocusedRef = useRef<HTMLElement | null>(null);

  // Esc closes; trap initial focus on the close button so screen-readers
  // and keyboard users land in a known place. Tab cycles within the dialog
  // and focus is restored to the previously-focused element on close
  // (WCAG 2.4.3 / 2.4.11 focus management for modals).
  useEffect(() => {
    if (!applicant) return;

    previouslyFocusedRef.current = document.activeElement as HTMLElement | null;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key === 'Tab') {
        const focusables = getFocusable(dialogRef.current);
        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        const active = document.activeElement as HTMLElement | null;
        if (event.shiftKey) {
          if (active === first || !dialogRef.current?.contains(active)) {
            event.preventDefault();
            last.focus();
          }
        } else {
          if (active === last || !dialogRef.current?.contains(active)) {
            event.preventDefault();
            first.focus();
          }
        }
      }
    };

    window.addEventListener('keydown', onKeyDown);
    closeBtnRef.current?.focus();

    // Lock body scroll while modal is open (Apple sheet feel).
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previousOverflow;
      previouslyFocusedRef.current?.focus?.();
    };
  }, [applicant, onClose]);

  if (!applicant) return null;

  const matchScore = Math.round(applicant.matchScore);
  const followers = applicant.creator.followers;
  const pushScore = Math.round(applicant.creator.pushScore);
  const conversionPct = Math.round(applicant.creator.conversionRate * 100);
  const campaignsDone = applicant.creator.campaignsCompleted;
  const tierIsPremium = PREMIUM_TIERS.has(applicant.creator.tier);

  return (
    <div
      className="apd-backdrop"
      role="presentation"
      onClick={onClose}
    >
      <div
        ref={dialogRef}
        className={`apd-dialog apd-dialog--${applicant.status}`}
        role="dialog"
        aria-modal="true"
        aria-label={`Application from ${applicant.creator.name}`}
        onClick={(event) => event.stopPropagation()}
      >
        <button
          ref={closeBtnRef}
          type="button"
          className="apd-close"
          onClick={onClose}
          aria-label="Close applicant details"
        >
          <CloseIcon />
        </button>

        <div className="apd-scroll-area">
          {/* Hero — avatar + identity + status */}
          <header className="apd-hero">
            <div className="apd-avatar" aria-hidden="true">
              {applicant.creator.avatar ? (
                <img
                  src={applicant.creator.avatar}
                  alt=""
                  loading="eager"
                  decoding="async"
                />
              ) : (
                <span>{initials(applicant.creator.name)}</span>
              )}
            </div>

            <div className="apd-identity">
              <p className="apd-status-eyebrow">{STATUS_LABEL[applicant.status]}</p>
              <h2 className="apd-name">
                <span>{applicant.creator.name}</span>
                {tierIsPremium ? <StarStamp /> : null}
              </h2>
              <p className="apd-handle">{applicant.creator.handle}</p>
              <div className="apd-tier">
                <TierBadge tier={applicant.creator.tier} />
              </div>
            </div>
          </header>

          {/* Match Score block */}
          <section className="apd-section apd-match">
            <div className="apd-match-head">
              <p
                className="apd-eyebrow"
                title="Match Score combines tier, follower fit, location proximity, and past campaign signals."
              >
                Match Score
              </p>
              <span className="apd-match-value">{matchScore}%</span>
            </div>
            <div
              className="apd-match-bar"
              role="progressbar"
              aria-valuenow={matchScore}
              aria-valuemin={0}
              aria-valuemax={100}
            >
              <span className="apd-match-bar-fill" style={{ width: `${matchScore}%` }} />
            </div>
          </section>

          {/* Stats grid */}
          <section className="apd-section apd-stats">
            <div className="apd-stat">
              <p className="apd-eyebrow">Followers</p>
              <p className="apd-stat-num">{formatCompact(followers)}</p>
              <p className="apd-stat-sub">{followers.toLocaleString('en-US')} total</p>
            </div>
            <div className="apd-stat">
              <p className="apd-eyebrow">Push Score</p>
              <p className="apd-stat-num">{pushScore}</p>
              <p className="apd-stat-sub">out of 100</p>
            </div>
            <div className="apd-stat">
              <p className="apd-eyebrow">Conversion</p>
              <p className="apd-stat-num">{conversionPct}%</p>
              <p className="apd-stat-sub">avg. completion</p>
            </div>
            <div className="apd-stat">
              <p className="apd-eyebrow">Campaigns</p>
              <p className="apd-stat-num">{campaignsDone}</p>
              <p className="apd-stat-sub">past completed</p>
            </div>
          </section>

          {/* Cover letter */}
          {applicant.coverLetter ? (
            <section className="apd-section">
              <p className="apd-eyebrow">Cover letter</p>
              <p className="apd-cover-letter">{applicant.coverLetter}</p>
            </section>
          ) : null}

          {/* Bio */}
          {applicant.creator.bio ? (
            <section className="apd-section">
              <p className="apd-eyebrow">About</p>
              <p className="apd-bio">{applicant.creator.bio}</p>
            </section>
          ) : null}

          {/* Recent work */}
          {applicant.sampleUrls.length > 0 ? (
            <section className="apd-section">
              <p className="apd-eyebrow">Recent work</p>
              <div className="apd-sample-grid">
                {applicant.sampleUrls.slice(0, 3).map((url, i) => (
                  <a
                    className="apd-sample"
                    key={`${applicant.id}-sample-${i}`}
                    href={url}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`Open sample ${i + 1} in new tab`}
                  >
                    <img src={url} alt="" loading="lazy" decoding="async" />
                  </a>
                ))}
              </div>
            </section>
          ) : null}

          {/* Application context */}
          <section className="apd-section apd-context">
            <p className="apd-eyebrow">Applied to</p>
            <p className="apd-context-campaign">{applicant.campaignName}</p>
            <p className="apd-context-meta" suppressHydrationWarning>
              {appliedLabel}
            </p>
          </section>
        </div>

        {/* Sticky action bar — Message on the left (communication, not a
            decision), Reject / Shortlist / Accept on the right (decisions). */}
        <footer className="apd-actions">
          <Link
            href={`/merchant/messages?creator=${encodeURIComponent(applicant.creator.id)}`}
            className="apd-message-btn"
            aria-label={`Message ${applicant.creator.name}`}
            onClick={onClose}
          >
            <MessageIcon />
            <span>Message</span>
          </Link>

          <div className="apd-actions-decisions">
            <button
              type="button"
              className="btn-ghost apd-action apd-action--reject"
              disabled={isPending || applicant.status === 'declined'}
              onClick={() => onDecide(applicant, 'decline')}
            >
              Reject
            </button>
            <button
              type="button"
              className="btn-secondary apd-action"
              disabled={isPending || applicant.status === 'shortlisted'}
              onClick={() => onDecide(applicant, 'shortlist')}
            >
              Shortlist
            </button>
            <button
              type="button"
              className="btn-primary apd-action apd-action--accept"
              disabled={isPending || applicant.status === 'accepted'}
              onClick={() => onDecide(applicant, 'accept')}
            >
              Accept
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
}
