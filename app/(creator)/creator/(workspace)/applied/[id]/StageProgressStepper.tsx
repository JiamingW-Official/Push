"use client";

import { Check } from "lucide-react";
import type { ApplicationStatus } from "@/lib/data/hooks/useCreatorApplications";

const STEPS: { status: ApplicationStatus; label: string }[] = [
  { status: "reviewing", label: "Review" },
  { status: "accepted", label: "Accepted" },
  { status: "pre_shoot", label: "Pre-shoot" },
  { status: "shoot_live", label: "Live" },
  { status: "pending_upload", label: "Upload" },
  { status: "submitted", label: "Submitted" },
  { status: "revision_requested", label: "Revision" },
  { status: "verified", label: "Verified" },
  { status: "paid", label: "Paid" },
];

const STEP_COLOR: Partial<Record<ApplicationStatus, string>> = {
  reviewing: "#14130f",
  accepted: "#16a34a",
  pre_shoot: "#d97706",
  shoot_live: "#dc2626",
  pending_upload: "#0085ff",
  submitted: "#2563eb",
  revision_requested: "#b45309",
  verified: "#16a34a",
  paid: "#92400e",
};

const TERMINAL = new Set<ApplicationStatus>(["declined", "withdrawn"]);

export function StageProgressStepper({
  currentStatus,
}: {
  currentStatus: ApplicationStatus | undefined;
}) {
  if (!currentStatus || TERMINAL.has(currentStatus)) return null;

  const currentIdx = STEPS.findIndex((s) => s.status === currentStatus);
  if (currentIdx < 0) return null;

  const color = STEP_COLOR[currentStatus] ?? "#14130f";

  return (
    <nav className="ad-stepper-wrap" aria-label="Application progress">
      {/* Mobile summary */}
      <p className="ad-stepper__mobile-summary">
        Step {currentIdx + 1} of {STEPS.length} · {STEPS[currentIdx]?.label}
      </p>

      {/* Desktop horizontal stepper */}
      <ol className="ad-stepper__inner">
        {STEPS.map((step, i) => {
          const isDone = i < currentIdx;
          const isCurrent = i === currentIdx;

          return (
            <li
              key={step.status}
              className={`ad-stepper__step${isDone ? " is-done" : ""}${isCurrent ? " is-current" : ""}`}
            >
              <div
                className="ad-stepper__dot"
                style={
                  isCurrent
                    ? {
                        background: color,
                        borderColor: color,
                        boxShadow: `0 0 0 4px ${color}28`,
                      }
                    : undefined
                }
                aria-current={isCurrent ? "step" : undefined}
              >
                {isDone ? (
                  <Check size={11} strokeWidth={3} />
                ) : (
                  <span>{i + 1}</span>
                )}
              </div>
              <span className="ad-stepper__label">{step.label}</span>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
