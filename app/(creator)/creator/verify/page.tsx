"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import type { KycState, KycStatus } from "@/lib/verify/mock-kyc";
import { loadKyc, saveKyc, submitKyc, resetKyc } from "@/lib/verify/mock-kyc";
import StepIdentity from "@/components/creator/verify/StepIdentity";
import StepSocial from "@/components/creator/verify/StepSocial";
import StepAddress from "@/components/creator/verify/StepAddress";
import ReviewSummary from "@/components/creator/verify/ReviewSummary";

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

const STATUS_COLORS: Record<
  KycStatus,
  { bg: string; color: string; border: string }
> = {
  unverified: {
    bg: "var(--surface-2)",
    color: "var(--ink-4)",
    border: "var(--hairline)",
  },
  in_review: { bg: "#fef3c7", color: "#92400e", border: "#fcd34d" },
  verified: { bg: "#f0fdf4", color: "#166534", border: "#86efac" },
  rejected: { bg: "#fff0f0", color: "#991b1b", border: "#fca5a5" },
};

function StatusBadge({ status }: { status: KycStatus }) {
  const colors = STATUS_COLORS[status];
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        padding: "4px 12px",
        borderRadius: 20,
        background: colors.bg,
        border: `1px solid ${colors.border}`,
        fontFamily: "var(--font-body)",
        fontSize: 12,
        fontWeight: 600,
        letterSpacing: "0.06em",
        textTransform: "uppercase",
        color: colors.color,
      }}
    >
      {status === "verified" && (
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
      )}
      {STATUS_LABEL[status]}
    </span>
  );
}

// ── Progress rail ─────────────────────────────────────────────
function ProgressRail({ current }: { current: WizardStep }) {
  return (
    <nav
      aria-label="Verification steps"
      style={{
        display: "flex",
        alignItems: "center",
        marginBottom: 32,
      }}
    >
      {([1, 2, 3, 4] as WizardStep[]).map((n) => {
        const done = n < current;
        const active = n === current;
        return (
          <div
            key={n}
            style={{
              display: "flex",
              alignItems: "center",
              flex: n < 4 ? 1 : undefined,
            }}
            aria-current={active ? "step" : undefined}
          >
            {/* Step circle */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 6,
                flexShrink: 0,
              }}
            >
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: done
                    ? "var(--brand-red)"
                    : active
                      ? "var(--ink)"
                      : "var(--surface-2)",
                  border: `2px solid ${done ? "var(--brand-red)" : active ? "var(--ink)" : "var(--hairline)"}`,
                  transition: "all 0.2s ease",
                }}
              >
                {done ? (
                  <svg
                    width="12"
                    height="10"
                    viewBox="0 0 11 9"
                    fill="none"
                    aria-hidden="true"
                  >
                    <path
                      d="M1 4L4 7.5L10 1"
                      stroke="var(--snow)"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                ) : (
                  <span
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: 13,
                      fontWeight: 700,
                      color: active ? "var(--snow)" : "var(--ink-4)",
                    }}
                    aria-hidden="true"
                  >
                    {n}
                  </span>
                )}
              </div>
              <span
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: 11,
                  fontWeight: 600,
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  color: active
                    ? "var(--ink)"
                    : done
                      ? "var(--brand-red)"
                      : "var(--ink-4)",
                  whiteSpace: "nowrap",
                }}
              >
                {STEP_LABELS[n]}
              </span>
            </div>

            {/* Connector line */}
            {n < 4 && (
              <div
                aria-hidden="true"
                style={{
                  flex: 1,
                  height: 2,
                  background: done ? "var(--brand-red)" : "var(--hairline)",
                  margin: "0 8px",
                  marginBottom: 20,
                  transition: "background 0.2s ease",
                }}
              />
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
    <div style={{ textAlign: "center", padding: "16px 0" }}>
      <div
        style={{
          width: 64,
          height: 64,
          borderRadius: "50%",
          background: "var(--brand-red)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: "0 auto 24px",
        }}
        aria-hidden="true"
      >
        <svg width="28" height="22" viewBox="0 0 11 9" fill="none">
          <path
            d="M1 4L4 7.5L10 1"
            stroke="var(--snow)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <h2
        style={{
          fontFamily: "var(--font-display)",
          fontSize: 40,
          fontWeight: 900,
          color: "var(--ink)",
          letterSpacing: "-0.02em",
          marginBottom: 12,
        }}
      >
        Verified.
      </h2>
      <p
        style={{
          fontFamily: "var(--font-body)",
          fontSize: 16,
          color: "var(--ink-3)",
          lineHeight: 1.6,
          marginBottom: 24,
        }}
      >
        You&apos;re now eligible for Operator-tier campaigns — the highest
        payout bracket on Push.
      </p>
      <div
        style={{
          display: "inline-block",
          background: "var(--surface-2)",
          border: "1px solid var(--hairline)",
          borderRadius: 8,
          padding: "8px 16px",
          fontFamily: "var(--font-body)",
          fontSize: 12,
          fontWeight: 600,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          color: "var(--ink-3)",
          marginBottom: 32,
        }}
      >
        Operator Tier Unlocked
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 12,
          alignItems: "center",
        }}
      >
        <Link
          href="/creator/campaigns"
          className="btn-primary click-shift"
          style={{ textDecoration: "none" }}
        >
          Browse Operator Campaigns
        </Link>
        <button
          type="button"
          onClick={onReset}
          style={{
            fontFamily: "var(--font-body)",
            fontSize: 13,
            color: "var(--ink-4)",
            background: "none",
            border: "none",
            cursor: "pointer",
            textDecoration: "underline",
            padding: 0,
          }}
        >
          Reset demo
        </button>
      </div>
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
    <div style={{ textAlign: "center", padding: "16px 0" }}>
      <div
        style={{
          width: 64,
          height: 64,
          borderRadius: "50%",
          background: "#fff0f0",
          border: "2px solid #fca5a5",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: "0 auto 24px",
        }}
        aria-hidden="true"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path
            d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
            stroke="var(--brand-red)"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <h2
        style={{
          fontFamily: "var(--font-display)",
          fontSize: 32,
          fontWeight: 900,
          color: "var(--ink)",
          letterSpacing: "-0.02em",
          marginBottom: 12,
        }}
      >
        Verification Rejected
      </h2>
      {reason && (
        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: 16,
            color: "var(--ink-3)",
            marginBottom: 24,
            lineHeight: 1.6,
          }}
        >
          {reason}
        </p>
      )}
      <button
        type="button"
        className="btn-primary click-shift"
        onClick={onResubmit}
      >
        Resubmit Application
      </button>
    </div>
  );
}

// ── In-Review state ───────────────────────────────────────────
function InReviewState() {
  return (
    <div style={{ textAlign: "center", padding: "16px 0" }}>
      {/* Pulse indicator */}
      <div
        aria-hidden="true"
        style={{
          width: 64,
          height: 64,
          borderRadius: "50%",
          background: "#fef3c7",
          border: "2px solid #fcd34d",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: "0 auto 24px",
          position: "relative",
        }}
      >
        <div
          style={{
            width: 16,
            height: 16,
            borderRadius: "50%",
            background: "#f59e0b",
          }}
        />
      </div>
      <h2
        style={{
          fontFamily: "var(--font-display)",
          fontSize: 32,
          fontWeight: 900,
          color: "var(--ink)",
          letterSpacing: "-0.02em",
          marginBottom: 12,
        }}
      >
        Under Review
      </h2>
      <p
        style={{
          fontFamily: "var(--font-body)",
          fontSize: 16,
          color: "var(--ink-3)",
          lineHeight: 1.6,
        }}
      >
        Your application is being reviewed. This usually takes 24–48 hours.
        <br />
        <span
          style={{
            fontSize: 13,
            color: "var(--ink-4)",
            display: "block",
            marginTop: 8,
          }}
        >
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
      <PageShell>
        <VerifiedState
          onReset={() => {
            resetKyc();
            setKycState(loadKyc());
            setStep(1);
          }}
        />
      </PageShell>
    );
  }

  if (kycState.status === "rejected") {
    return (
      <PageShell>
        <RejectedState
          reason={kycState.rejectionReason}
          onResubmit={() => {
            saveKyc({ status: "unverified", rejectionReason: undefined });
            setKycState(loadKyc());
            setStep(1);
          }}
        />
      </PageShell>
    );
  }

  if (kycState.status === "in_review") {
    return (
      <PageShell>
        <InReviewState />
      </PageShell>
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
    <PageShell>
      {/* Back link */}
      <Link
        href="/creator/dashboard"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          fontFamily: "var(--font-body)",
          fontSize: 14,
          color: "var(--ink-4)",
          textDecoration: "none",
          marginBottom: 32,
        }}
      >
        ← Dashboard
      </Link>

      {/* Page heading + status */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: 16,
          marginBottom: 8,
          flexWrap: "wrap",
        }}
      >
        <div>
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: 12,
              fontWeight: 600,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "var(--ink-4)",
              marginBottom: 8,
            }}
          >
            (VERIFICATION)
          </p>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 40,
              fontWeight: 900,
              color: "var(--ink)",
              letterSpacing: "-0.02em",
              marginBottom: 8,
              lineHeight: 1.1,
            }}
          >
            Get verified.
          </h1>
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: 16,
              color: "var(--ink-3)",
              marginBottom: 0,
            }}
          >
            Three steps to unlock Operator-tier campaigns and higher payouts.
          </p>
        </div>
        <StatusBadge status={kycState.status} />
      </div>

      {/* Divider */}
      <div
        style={{
          height: 1,
          background: "var(--hairline)",
          margin: "24px 0 32px",
        }}
      />

      {/* Progress rail */}
      <ProgressRail current={step} />

      {/* Step content panel */}
      <div
        style={{
          background: "var(--snow)",
          border: "1px solid var(--hairline)",
          borderRadius: 12,
          padding: "32px 40px",
          marginBottom: 24,
          opacity: animating ? 0 : 1,
          transform: animating
            ? `translateX(${slideDir === "right" ? "16px" : "-16px"})`
            : "translateX(0)",
          transition: "opacity 0.3s ease, transform 0.3s ease",
        }}
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
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 16,
          }}
        >
          {step > 1 ? (
            <button
              type="button"
              className="btn-ghost click-shift"
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
            className="btn-primary click-shift"
            onClick={handleNext}
            disabled={!nextEnabled || animating}
            aria-disabled={!nextEnabled}
            style={{ opacity: nextEnabled ? 1 : 0.5 }}
          >
            {step === 3 ? "Review →" : "Next →"}
          </button>
        </div>
      )}
    </PageShell>
  );
}

// ── Layout shell ─────────────────────────────────────────────
function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--surface)",
        padding: "48px 24px",
      }}
    >
      <div style={{ maxWidth: 680, margin: "0 auto" }}>
        {/* Brand header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            marginBottom: 48,
          }}
        >
          <Link
            href="/"
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 800,
              fontSize: 24,
              color: "var(--ink)",
              textDecoration: "none",
              letterSpacing: "-0.02em",
            }}
          >
            PUSH
          </Link>
          <span style={{ color: "var(--hairline)", fontSize: 20 }}>·</span>
          <span
            style={{
              fontFamily: "var(--font-body)",
              fontSize: 12,
              fontWeight: 600,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "var(--ink-4)",
            }}
          >
            Identity Verification
          </span>
        </div>

        {children}
      </div>
    </div>
  );
}
