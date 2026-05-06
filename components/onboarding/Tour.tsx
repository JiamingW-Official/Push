"use client";

/**
 * 3-step welcome tour (audit § P2-14). Triggers automatically on first
 * visit to /creator/today (when localStorage flag is absent). Skippable;
 * persisted on Skip or Finish.
 *
 * Each step anchors a glass tooltip to a target element. Spotlight =
 * a translucent overlay with a circular cutout via mask-image. Uses
 * cubic-bezier(0.34, 1.56, 0.64, 1) for entrance per Design.md tokens.
 */

import { useEffect, useRef, useState, useCallback } from "react";
import { TOUR_STEPS, TOUR_FLAG } from "@/lib/onboarding/steps";
import "./Tour.css";

type Props = {
  /** Force-show even if flag is set. Used by /settings/help → Replay tour. */
  force?: boolean;
  /** Callback when the tour ends (any reason). Resets force prop. */
  onEnd?: () => void;
};

export function Tour({ force = false, onEnd }: Props) {
  const [active, setActive] = useState(false);
  const [step, setStep] = useState(0);
  const [rect, setRect] = useState<DOMRect | null>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  /* Trigger logic. */
  useEffect(() => {
    if (force) {
      setStep(0);
      setActive(true);
      return;
    }
    try {
      const completed = localStorage.getItem(TOUR_FLAG);
      if (!completed) {
        // Defer 600ms so the page paints first.
        const t = setTimeout(() => setActive(true), 600);
        return () => clearTimeout(t);
      }
    } catch {
      // localStorage unavailable; skip the tour.
    }
  }, [force]);

  /* Compute target rect for current step. */
  useEffect(() => {
    if (!active) return;
    const target = document.querySelector(
      TOUR_STEPS[step]!.target,
    ) as HTMLElement | null;
    if (!target) {
      // Target missing → skip this step.
      if (step < TOUR_STEPS.length - 1) {
        setStep((s) => s + 1);
      } else {
        end(true);
      }
      return;
    }
    setRect(target.getBoundingClientRect());

    const onResize = () => setRect(target.getBoundingClientRect());
    window.addEventListener("resize", onResize);
    window.addEventListener("scroll", onResize, true);
    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", onResize, true);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, step]);

  const end = useCallback(
    (completed: boolean) => {
      setActive(false);
      try {
        if (completed)
          localStorage.setItem(TOUR_FLAG, new Date().toISOString());
      } catch {
        // ignore
      }
      onEnd?.();
    },
    [onEnd],
  );

  /* Esc skips. */
  useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") end(true);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [active, end]);

  if (!active || !rect) return null;

  const current = TOUR_STEPS[step]!;
  const isLast = step === TOUR_STEPS.length - 1;

  /* Tooltip placement: prefer below the target; if cramped, above. */
  const tooltipBelow = rect.bottom + 16 < window.innerHeight - 200;
  const tooltipTop = tooltipBelow
    ? rect.bottom + 16
    : Math.max(16, rect.top - 16 - 220);
  const tooltipLeft = Math.min(
    Math.max(16, rect.left + rect.width / 2 - 160),
    window.innerWidth - 336,
  );

  /* Spotlight: 4 box-shadows make a "cutout" effect by darkening every
     side except the rect. Inset shadow overlays the cutout to soften it. */
  const spotlight = {
    top: rect.top - 8,
    left: rect.left - 8,
    width: rect.width + 16,
    height: rect.height + 16,
  };

  return (
    <div
      className="tour"
      role="dialog"
      aria-modal="true"
      aria-label={current.title}
    >
      <div
        className="tour__spotlight"
        style={{
          top: spotlight.top,
          left: spotlight.left,
          width: spotlight.width,
          height: spotlight.height,
        }}
      />
      <div
        ref={tooltipRef}
        className="tour__tooltip"
        style={{ top: tooltipTop, left: tooltipLeft }}
      >
        <p className="tour__step">
          Step {step + 1} of {TOUR_STEPS.length}
        </p>
        <h2 className="tour__title">{current.title}</h2>
        <p className="tour__body">{current.body}</p>
        <div className="tour__actions">
          <button
            type="button"
            className="tour__btn tour__btn--skip"
            onClick={() => end(true)}
          >
            Skip
          </button>
          {isLast ? (
            <button
              type="button"
              className="tour__btn tour__btn--next"
              onClick={() => end(true)}
            >
              Finish
            </button>
          ) : (
            <button
              type="button"
              className="tour__btn tour__btn--next"
              onClick={() => setStep((s) => s + 1)}
            >
              Next
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
