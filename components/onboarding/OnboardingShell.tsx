"use client";

import { ReactNode } from "react";
import { ProgressDots } from "./ProgressDots";
import "./onboarding.css";

interface OnboardingShellProps {
  /** "Creator" or "Merchant" — shown in the eyebrow */
  role: "Creator" | "Merchant";
  /** Total number of checklist steps */
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
          <p className="ob2-celebrate-eyebrow">
            {role} profile · {totalSteps}/{totalSteps} complete
          </p>

          {/* Hero text */}
          <h1 className="ob2-celebrate-hero">You're live.</h1>

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
            Your {role.toLowerCase()} profile is set up and ready. Everything
            from here is upside.
          </p>

          {/* CTA */}
          <button
            type="button"
            className="ob2-celebrate-cta"
            onClick={onDashboard}
          >
            Go to dashboard →
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="ob2-page">
      <div className="ob2-layout">
        {/* ── Sidebar ─────────────────────────────────────── */}
        <aside className="ob2-sidebar">
          {/* Brand mark */}
          <div className="ob2-sidebar-brand">
            <span className="ob2-sidebar-brand-dot" aria-hidden="true" />
            <span className="ob2-sidebar-brand-name">Push</span>
          </div>

          {/* Role label */}
          <p className="ob2-sidebar-role">{role} Setup</p>

          {/* Progress summary */}
          <div className="ob2-sidebar-progress">
            <div className="ob2-sidebar-progress-track">
              <div
                className="ob2-sidebar-progress-fill"
                style={{
                  width: `${Math.round((completedSteps / totalSteps) * 100)}%`,
                }}
              />
            </div>
            <p className="ob2-sidebar-progress-label">
              {completedSteps} of {totalSteps} complete
            </p>
          </div>

          {/* Editorial large number */}
          <div className="ob2-sidebar-display" aria-hidden="true">
            <span className="ob2-sidebar-num">{completedSteps}</span>
            <span className="ob2-sidebar-denom">/{totalSteps}</span>
          </div>
        </aside>

        {/* ── Main content ────────────────────────────────── */}
        <main className="ob2-main">
          {/* Top bar */}
          <div className="ob2-topbar">
            <span className="ob2-topbar-label">
              <span className="ob2-topbar-dot" aria-hidden="true" />
              Onboarding
            </span>
            <ProgressDots total={totalSteps} current={currentStep} />
          </div>

          {/* Step content */}
          <div className="ob2-steps">{children}</div>
        </main>
      </div>
    </div>
  );
}
