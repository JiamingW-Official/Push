"use client";

import { useEffect, useCallback, useRef, useState } from "react";
import "./campaign-detail-panel.css";

/* ── Types ─────────────────────────────────────────────────── */

type CreatorTier =
  | "seed"
  | "explorer"
  | "operator"
  | "proven"
  | "closer"
  | "partner";

export type Campaign = {
  id: string;
  title: string;
  business_name: string;
  business_address?: string;
  payout: number;
  spots_remaining: number;
  spots_total: number;
  deadline?: string | null;
  category?: string;
  image?: string;
  tier_required: CreatorTier;
  description?: string;
  requirements?: string[];
  lat: number;
  lng: number;
};

type Props = {
  campaign: Campaign | null;
  isOpen: boolean;
  onClose: () => void;
  creatorTier: CreatorTier;
  appliedIds: Set<string>;
  onApply: (campaignId: string) => void;
};

/* ── Constants ─────────────────────────────────────────────── */

const TIER_ORDER: CreatorTier[] = [
  "seed",
  "explorer",
  "operator",
  "proven",
  "closer",
  "partner",
];

const TIER_LABELS: Record<CreatorTier, string> = {
  seed: "Seed",
  explorer: "Explorer",
  operator: "Operator",
  proven: "Proven",
  closer: "Closer",
  partner: "Partner",
};

const TIER_COLORS: Record<CreatorTier, string> = {
  seed: "#669bbc",
  explorer: "#003049",
  operator: "#c9a96e",
  proven: "#c1121f",
  closer: "#780000",
  partner: "#c9a96e",
};

const STORAGE_KEY = "push-demo-applied-campaigns";

/* ── Helpers ───────────────────────────────────────────────── */

function formatCurrency(n: number): string {
  return n === 0 ? "Free" : `$${n.toFixed(0)}`;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

function daysLeft(deadline?: string | null): number | null {
  if (!deadline) return null;
  const diff = new Date(deadline).getTime() - Date.now();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

function isEligible(creator: CreatorTier, required: CreatorTier): boolean {
  return TIER_ORDER.indexOf(creator) >= TIER_ORDER.indexOf(required);
}

function getAppliedIds(): string[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
  } catch {
    return [];
  }
}

function saveAppliedId(id: string): void {
  if (typeof window === "undefined") return;
  const existing = getAppliedIds();
  if (!existing.includes(id)) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...existing, id]));
  }
}

/* ── Toast ─────────────────────────────────────────────────── */

type ToastProps = {
  message: string;
  visible: boolean;
};

function Toast({ message, visible }: ToastProps) {
  return (
    <div
      className={`cdp-toast${visible ? " cdp-toast--visible" : ""}`}
      role="status"
      aria-live="polite"
    >
      {message}
    </div>
  );
}

/* ── Main component ────────────────────────────────────────── */

export function CampaignDetailPanel({
  campaign,
  isOpen,
  onClose,
  creatorTier,
  appliedIds,
  onApply,
}: Props) {
  const panelRef = useRef<HTMLDivElement>(null);
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMsg, setToastMsg] = useState("");
  const [queuePosition, setQueuePosition] = useState<number | null>(null);

  // Derive local applied state including localStorage persisted ones
  const [localApplied, setLocalApplied] = useState<Set<string>>(new Set());

  useEffect(() => {
    setLocalApplied(new Set(getAppliedIds()));
  }, []);

  const isApplied =
    (campaign &&
      (appliedIds.has(campaign.id) || localApplied.has(campaign.id))) ??
    false;

  // ESC key to close
  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [isOpen, onClose]);

  // Focus trap — move focus into panel when it opens
  useEffect(() => {
    if (isOpen && panelRef.current) {
      const firstFocusable = panelRef.current.querySelector<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );
      firstFocusable?.focus();
    }
  }, [isOpen]);

  // Body scroll lock when panel is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const showToast = useCallback((msg: string) => {
    setToastMsg(msg);
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 3200);
  }, []);

  const handleApply = useCallback(() => {
    if (!campaign) return;

    // Persist to localStorage
    saveAppliedId(campaign.id);
    setLocalApplied((prev) => new Set([...prev, campaign.id]));

    // Simulate queue position (1–8)
    const pos = Math.floor(Math.random() * 8) + 1;
    setQueuePosition(pos);

    // Bubble up to parent (updates appliedIds in dashboard state)
    onApply(campaign.id);

    // Show confirmation toast
    showToast(`Applied! You're #${pos} in the queue.`);
  }, [campaign, onApply, showToast]);

  if (!campaign && !isOpen) return null;

  const eligible = campaign
    ? isEligible(creatorTier, campaign.tier_required)
    : false;
  const applied = isApplied;
  const days = campaign ? daysLeft(campaign.deadline) : null;
  const taken = campaign ? campaign.spots_total - campaign.spots_remaining : 0;
  const takenPct =
    campaign && campaign.spots_total > 0
      ? (taken / campaign.spots_total) * 100
      : 0;

  return (
    <>
      {/* Backdrop */}
      <div
        className={`cdp-backdrop${isOpen ? " cdp-backdrop--visible" : ""}`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div
        ref={panelRef}
        className={`cdp-panel${isOpen ? " cdp-panel--open" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label={
          campaign ? `Campaign: ${campaign.title}` : "Campaign detail"
        }
      >
        {campaign && (
          <>
            {/* ── Hero image header ── */}
            <div className="cdp-hero">
              {campaign.image ? (
                <img
                  src={campaign.image}
                  alt={campaign.title}
                  className="cdp-hero-img"
                />
              ) : (
                <div className="cdp-hero-placeholder">
                  <span className="cdp-hero-initial">
                    {campaign.business_name[0]}
                  </span>
                </div>
              )}

              {/* Overlay controls */}
              <div className="cdp-hero-bar">
                <button
                  className="cdp-back-btn"
                  onClick={onClose}
                  aria-label="Close panel"
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    aria-hidden="true"
                  >
                    <path
                      d="M10 3L5 8l5 5"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  Back
                </button>

                {/* Tier badge */}
                <span
                  className="cdp-tier-badge"
                  style={{
                    background: TIER_COLORS[campaign.tier_required],
                  }}
                >
                  {TIER_LABELS[campaign.tier_required]}
                </span>
              </div>
            </div>

            {/* ── Scrollable body ── */}
            <div className="cdp-body">
              {/* Title block */}
              <div className="cdp-title-block">
                <span className="cdp-merchant">{campaign.business_name}</span>
                {campaign.business_address && (
                  <span className="cdp-neighborhood">
                    {campaign.business_address.split(",")[1]?.trim() ??
                      campaign.business_address}
                  </span>
                )}
                <h2 className="cdp-title">{campaign.title}</h2>
              </div>

              {/* ── Stats row ── */}
              <div className="cdp-stats-row">
                <div className="cdp-stat">
                  <span className="cdp-stat-value">
                    {formatCurrency(campaign.payout)}
                  </span>
                  <span className="cdp-stat-label">Payout</span>
                </div>
                {campaign.payout > 0 && (
                  <div className="cdp-stat">
                    <span className="cdp-stat-value">+15%</span>
                    <span className="cdp-stat-label">Commission</span>
                  </div>
                )}
                {days !== null && (
                  <div className="cdp-stat">
                    <span
                      className={`cdp-stat-value${days <= 3 ? " cdp-stat-value--urgent" : ""}`}
                    >
                      {days <= 0 ? "Ended" : `${days}d`}
                    </span>
                    <span className="cdp-stat-label">Deadline</span>
                  </div>
                )}
                <div className="cdp-stat">
                  <span
                    className={`cdp-stat-value${campaign.spots_remaining <= 2 ? " cdp-stat-value--urgent" : ""}`}
                  >
                    {campaign.spots_remaining}
                  </span>
                  <span className="cdp-stat-label">Slots left</span>
                </div>
              </div>

              {/* Spots progress */}
              <div className="cdp-progress-wrap">
                <div className="cdp-progress-labels">
                  <span>Spots filled</span>
                  <span>
                    {taken} / {campaign.spots_total}
                  </span>
                </div>
                <div className="cdp-progress-bar">
                  <div
                    className="cdp-progress-fill"
                    style={{ width: `${takenPct}%` }}
                  />
                </div>
              </div>

              {/* Description */}
              {campaign.description && (
                <div className="cdp-section">
                  <span className="cdp-section-label">Campaign Brief</span>
                  <p className="cdp-desc">{campaign.description}</p>
                </div>
              )}

              {/* Deliverables checklist */}
              {campaign.requirements && campaign.requirements.length > 0 && (
                <div className="cdp-section">
                  <span className="cdp-section-label">Deliverables</span>
                  <div className="cdp-checklist">
                    {campaign.requirements.map((req, i) => (
                      <div key={i} className="cdp-checklist-item">
                        <span className="cdp-check-icon" aria-hidden="true">
                          <svg
                            width="12"
                            height="12"
                            viewBox="0 0 12 12"
                            fill="none"
                          >
                            <rect
                              x="0.75"
                              y="0.75"
                              width="10.5"
                              height="10.5"
                              stroke="currentColor"
                              strokeWidth="1.5"
                            />
                          </svg>
                        </span>
                        <span className="cdp-check-text">{req}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Merchant preview */}
              <div className="cdp-section">
                <span className="cdp-section-label">Merchant</span>
                <div className="cdp-merchant-card">
                  <div className="cdp-merchant-logo">
                    <span>{campaign.business_name[0]}</span>
                  </div>
                  <div className="cdp-merchant-info">
                    <span className="cdp-merchant-name">
                      {campaign.business_name}
                    </span>
                    {campaign.business_address && (
                      <span className="cdp-merchant-addr">
                        {campaign.business_address}
                      </span>
                    )}
                    {campaign.category && (
                      <span className="cdp-merchant-cat">
                        {campaign.category}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Applied state: queue info */}
              {applied && queuePosition && (
                <div className="cdp-queue-info">
                  <span className="cdp-queue-label">Your queue position</span>
                  <span className="cdp-queue-num">#{queuePosition}</span>
                  <span className="cdp-queue-sub">
                    The merchant will review applications within 48 hours.
                  </span>
                </div>
              )}
            </div>

            {/* ── Sticky CTA ── */}
            <div className="cdp-cta-bar">
              {!eligible ? (
                <button className="cdp-btn cdp-btn--locked" disabled>
                  Requires {TIER_LABELS[campaign.tier_required]}+ Tier
                </button>
              ) : applied ? (
                <button className="cdp-btn cdp-btn--applied" disabled>
                  Applied
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 14 14"
                    fill="none"
                    aria-hidden="true"
                    style={{ marginLeft: 6 }}
                  >
                    <circle cx="7" cy="7" r="7" fill="currentColor" />
                    <path
                      d="M4 7l2 2 4-4"
                      stroke="#fff"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              ) : (
                <div className="cdp-cta-row">
                  <button
                    className="cdp-btn cdp-btn--primary"
                    onClick={handleApply}
                  >
                    Apply Now
                  </button>
                  <button
                    className="cdp-btn cdp-btn--outline"
                    onClick={() => showToast("Saved to your list.")}
                    aria-label="Save campaign"
                  >
                    Save
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* Toast */}
      <Toast message={toastMsg} visible={toastVisible} />
    </>
  );
}
