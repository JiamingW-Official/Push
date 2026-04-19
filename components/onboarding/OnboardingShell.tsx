"use client";

import { ReactNode } from "react";
import "./onboarding.css";

interface OnboardingShellProps {
  /** "Creator" or "Merchant" — shown in the eyebrow */
  role: "Creator" | "Merchant";
  /** Total number of steps */
  totalSteps: number;
  /** Currently active step (1-based) */
  currentStep: number;
  /** Number of completed steps */
  completedSteps: number;
  children: ReactNode;
  /** Shown in the celebration screen */
  isComplete?: boolean;
  /** Called when user clicks "Go to dashboard" from the celebration screen */
  onDashboard?: () => void;
}

export function OnboardingShell({
  role,
  totalSteps,
  currentStep,
  completedSteps,
  children,
  isComplete = false,
  onDashboard,
}: OnboardingShellProps) {
  if (isComplete) {
    return (
      <div className="ob2-page">
        <div className="ob2-celebrate">
          {/* Decorative rule */}
          <div className="ob2-celebrate-rule" aria-hidden="true" />

          {/* Eyebrow */}
          <p className="ob2-celebrate-eyebrow">{role} profile · all set</p>

          {/* Hero text */}
          <h1 className="ob2-celebrate-hero">You're in.</h1>

          {/* Decorative arrow — hand-drawn feel using CSS */}
          <div className="ob2-celebrate-arrow" aria-hidden="true">
            <svg
              width="80"
              height="48"
              viewBox="0 0 80 48"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M4 12 C20 8, 36 4, 52 20 C62 30, 68 36, 76 38"
                stroke="#c1121f"
                strokeWidth="2.5"
                strokeLinecap="round"
                fill="none"
              />
              <path
                d="M68 30 L76 38 L66 42"
                stroke="#c1121f"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
            </svg>
          </div>

          {/* Sub copy */}
          <p className="ob2-celebrate-sub">
            Your profile is ready. Campaigns in your neighborhood are waiting —
            let&apos;s see what matches.
          </p>

          {/* CTA */}
          <button
            type="button"
            className="ob2-celebrate-cta"
            onClick={onDashboard}
          >
            Take me in →
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="ob2-page">
      {/* ── Single-step centered layout ────────────────────── */}
      <div className="ob2-wizard">
        {/* ── Top bar: brand + progress ─────────────────────── */}
        <header className="ob2-wizard-header">
          {/* Brand */}
          <div className="ob2-wizard-brand">
            <span className="ob2-wizard-brand-dot" aria-hidden="true" />
            <span className="ob2-wizard-brand-name">Push</span>
          </div>

          {/* Step counter */}
          <p className="ob2-wizard-step-count" aria-live="polite">
            {completedSteps} of {totalSteps}
          </p>
        </header>

        {/* ── Progress bar ──────────────────────────────────── */}
        <div
          className="ob2-wizard-progress-track"
          role="progressbar"
          aria-valuenow={completedSteps}
          aria-valuemin={0}
          aria-valuemax={totalSteps}
        >
          <div
            className="ob2-wizard-progress-fill"
            style={{ width: `${(completedSteps / totalSteps) * 100}%` }}
          />
        </div>

        {/* ── Step dots ─────────────────────────────────────── */}
        <div className="ob2-wizard-dots" aria-hidden="true">
          {Array.from({ length: totalSteps }, (_, i) => {
            const n = i + 1;
            const isDone = n <= completedSteps;
            const isActive = n === currentStep;
            return (
              <span
                key={n}
                className={[
                  "ob2-wizard-dot",
                  isActive ? "ob2-wizard-dot--active" : "",
                  isDone ? "ob2-wizard-dot--done" : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
              />
            );
          })}
        </div>

        {/* ── Content area ──────────────────────────────────── */}
        <main className="ob2-wizard-main">{children}</main>
      </div>
    </div>
  );
}
