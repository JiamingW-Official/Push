"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import type { KycState, KycStatus } from "@/lib/verify/mock-kyc";
import { loadKyc, saveKyc, submitKyc, resetKyc } from "@/lib/verify/mock-kyc";
import StepIdentity from "@/components/creator/verify/StepIdentity";
import StepSocial from "@/components/creator/verify/StepSocial";
import StepAddress from "@/components/creator/verify/StepAddress";
import ReviewSummary from "@/components/creator/verify/ReviewSummary";
import "./verify.css";

// ── Types ────────────────────────────────────────────────────
type WizardStep = 1 | 2 | 3 | 4;

const STEP_LABELS: Record<WizardStep, string> = {
  1: "Identity",
  2: "Social",
  3: "Address",
  4: "Review",
};

// ── Validation helpers ───────────────────────────────────────
function isIdentityValid(state: KycState): boolean {
  const { identity } = state;
  return !!(
    identity.docType &&
    identity.firstName.trim() &&
    identity.lastName.trim() &&
    identity.dob &&
    identity.ssnLast4.length === 4 &&
    identity.frontDoc &&
    identity.selfieDoc
  );
}

function isSocialValid(state: KycState): boolean {
  return state.socials.some((s) => s.connected);
}

function isAddressValid(state: KycState): boolean {
  const { address } = state;
  return !!(
    address.street.trim() &&
    address.city.trim() &&
    address.state &&
    address.zip.length === 5
  );
}

function canProceed(step: WizardStep, state: KycState): boolean {
  if (step === 1) return isIdentityValid(state);
  if (step === 2) return isSocialValid(state);
  if (step === 3) return isAddressValid(state);
  return true;
}

// ── Status badge ─────────────────────────────────────────────
const STATUS_LABEL: Record<KycStatus, string> = {
  unverified: "Not Verified",
  in_review: "In Review",
  verified: "Verified",
  rejected: "Rejected",
};

function StatusBadge({ status }: { status: KycStatus }) {
  return (
    <span className={`kv-status-badge kv-status-badge--${status}`}>
      {status === "verified" && (
        <svg
          width="11"
          height="9"
          viewBox="0 0 11 9"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M1 4L4 7.5L10 1"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
      {STATUS_LABEL[status]}
    </span>
  );
}

// ── Progress rail ─────────────────────────────────────────────
function ProgressRail({ current }: { current: WizardStep }) {
  return (
    <nav className="kv-progress" aria-label="Verification steps">
      {([1, 2, 3, 4] as WizardStep[]).map((n) => {
        const done = n < current;
        const active = n === current;
        return (
          <div
            key={n}
            className={[
              "kv-progress__step",
              active && "kv-progress__step--active",
              done && "kv-progress__step--done",
            ]
              .filter(Boolean)
              .join(" ")}
            aria-current={active ? "step" : undefined}
          >
            <div className="kv-progress__indicator">
              <span className="kv-progress__num" aria-hidden="true">
                {done ? (
                  <svg
                    width="10"
                    height="8"
                    viewBox="0 0 11 9"
                    fill="none"
                    aria-hidden="true"
                  >
                    <path
                      d="M1 4L4 7.5L10 1"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                ) : (
                  n
                )}
              </span>
            </div>
            <span className="kv-progress__label">{STEP_LABELS[n]}</span>
            {n < 4 && (
              <div className="kv-progress__connector" aria-hidden="true" />
            )}
          </div>
        );
      })}
    </nav>
  );
}

// ── Verified celebration ─────────────────────────────────────
function VerifiedState({ onReset }: { onReset: () => void }) {
  return (
    <div className="kv-verified">
      <div className="kv-verified__mark" aria-hidden="true">
        <svg width="32" height="26" viewBox="0 0 11 9" fill="none">
          <path
            d="M1 4L4 7.5L10 1"
            stroke="#c9a96e"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <h2 className="kv-verified__headline">Verified.</h2>
      <p className="kv-verified__sub">
        You're now eligible for Operator-tier campaigns — the highest payout
        bracket on Push.
      </p>
      <div className="kv-verified__badge">Operator Tier Unlocked</div>
      <Link href="/creator/campaigns" className="kv-verified__cta">
        Browse Operator Campaigns →
      </Link>
      <button type="button" className="kv-verified__reset" onClick={onReset}>
        Reset demo
      </button>
    </div>
  );
}

// ── Rejected state ────────────────────────────────────────────
function RejectedState({
  reason,
  onResubmit,
}: {
  reason?: string;
  onResubmit: () => void;
}) {
  return (
    <div className="kv-rejected">
      <div className="kv-rejected__icon" aria-hidden="true">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path
            d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
            stroke="#c1121f"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <h2 className="kv-rejected__headline">Verification Rejected</h2>
      {reason && <p className="kv-rejected__reason">{reason}</p>}
      <button type="button" className="kv-submit-btn" onClick={onResubmit}>
        Resubmit Application
      </button>
    </div>
  );
}

// ── In-Review state ───────────────────────────────────────────
function InReviewState() {
  return (
    <div className="kv-in-review">
      <div className="kv-in-review__pulse" aria-hidden="true" />
      <h2 className="kv-in-review__headline">Under Review</h2>
      <p className="kv-in-review__sub">
        Your application is being reviewed. This usually takes 24–48 hours.
        <br />
        <span className="kv-in-review__demo-note">
          Demo: auto-verifying in 3 seconds…
        </span>
      </p>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────
export default function VerifyPage() {
  const [kycState, setKycState] = useState<KycState | null>(null);
  const [step, setStep] = useState<WizardStep>(1);
  const [submitting, setSubmitting] = useState(false);
  const [slideDir, setSlideDir] = useState<"left" | "right">("right");
  const [animating, setAnimating] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Load from localStorage on mount
  useEffect(() => {
    const loaded = loadKyc();
    setKycState(loaded);
    // If previously submitted, show appropriate state without wizard
    if (
      loaded.status === "in_review" ||
      loaded.status === "verified" ||
      loaded.status === "rejected"
    ) {
      // status states bypass wizard
    }
  }, []);

  // Auto-poll localStorage for verified transition (mock 3s)
  useEffect(() => {
    if (!kycState || kycState.status !== "in_review") return;
    const interval = setInterval(() => {
      const fresh = loadKyc();
      if (fresh.status !== "in_review") {
        setKycState(fresh);
        clearInterval(interval);
      }
    }, 500);
    return () => clearInterval(interval);
  }, [kycState?.status]);

  if (!kycState) return null;

  // ── State-based renders ──────────────────────────────────
  if (kycState.status === "verified") {
    return (
      <div className="kv-page">
        <div className="kv-inner">
          <VerifiedState
            onReset={() => {
              resetKyc();
              setKycState(loadKyc());
              setStep(1);
            }}
          />
        </div>
      </div>
    );
  }

  if (kycState.status === "rejected") {
    return (
      <div className="kv-page">
        <div className="kv-inner">
          <RejectedState
            reason={kycState.rejectionReason}
            onResubmit={() => {
              saveKyc({ status: "unverified", rejectionReason: undefined });
              setKycState(loadKyc());
              setStep(1);
            }}
          />
        </div>
      </div>
    );
  }

  if (kycState.status === "in_review") {
    return (
      <div className="kv-page">
        <div className="kv-inner">
          <InReviewState />
        </div>
      </div>
    );
  }

  // ── Wizard navigation ────────────────────────────────────
  function navigate(target: WizardStep) {
    if (animating) return;
    const dir = target > step ? "right" : "left";
    setSlideDir(dir);
    setAnimating(true);
    setTimeout(() => {
      setStep(target);
      setAnimating(false);
    }, 400);
  }

  function handleNext() {
    if (step < 4) navigate((step + 1) as WizardStep);
  }

  function handleBack() {
    if (step > 1) navigate((step - 1) as WizardStep);
  }

  async function handleSubmit() {
    setSubmitting(true);
    try {
      const next = await submitKyc(kycState!);
      setKycState(next);
    } finally {
      setSubmitting(false);
    }
  }

  function updateState(partial: Partial<KycState>) {
    const next = saveKyc(partial);
    setKycState(next);
  }

  const nextEnabled = canProceed(step, kycState);

  return (
    <div className="kv-page">
      <div className="kv-inner">
        {/* Back link */}
        <Link href="/creator/dashboard" className="kv-back">
          ← Dashboard
        </Link>

        {/* Editorial hero */}
        <div className="kv-hero">
          <div className="kv-hero__text">
            <h1 className="kv-hero__headline">Get verified.</h1>
            <p className="kv-hero__sub">
              Three steps to unlock Operator-tier campaigns and higher payouts.
            </p>
          </div>
          <StatusBadge status={kycState.status} />
        </div>

        {/* Progress rail */}
        <ProgressRail current={step} />

        {/* Step container */}
        <div
          className={["kv-panel", animating && `kv-panel--exit-${slideDir}`]
            .filter(Boolean)
            .join(" ")}
          ref={containerRef}
          aria-live="polite"
          aria-atomic="true"
        >
          {step === 1 && (
            <StepIdentity
              identity={kycState.identity}
              onChange={(identity) => updateState({ identity })}
            />
          )}
          {step === 2 && (
            <StepSocial
              socials={kycState.socials}
              onChange={(socials) => updateState({ socials })}
            />
          )}
          {step === 3 && (
            <StepAddress
              address={kycState.address}
              onChange={(address) => updateState({ address })}
            />
          )}
          {step === 4 && (
            <ReviewSummary
              state={kycState}
              onEdit={(s) => navigate(s)}
              onSubmit={handleSubmit}
              submitting={submitting}
            />
          )}
        </div>

        {/* Navigation footer */}
        {step < 4 && (
          <div className="kv-nav">
            {step > 1 ? (
              <button
                type="button"
                className="kv-btn kv-btn--ghost"
                onClick={handleBack}
                disabled={animating}
              >
                ← Back
              </button>
            ) : (
              <span />
            )}
            <button
              type="button"
              className={[
                "kv-btn",
                "kv-btn--primary",
                !nextEnabled && "kv-btn--disabled",
              ]
                .filter(Boolean)
                .join(" ")}
              onClick={handleNext}
              disabled={!nextEnabled || animating}
              aria-disabled={!nextEnabled}
            >
              {step === 3 ? "Review →" : "Next →"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
