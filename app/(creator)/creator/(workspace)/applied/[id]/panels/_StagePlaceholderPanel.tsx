"use client";

/* ============================================================
   <_StagePlaceholderPanel> — interim panel for unbuilt stages
   v1 · 2026-05-10

   Shared shell for Stages 3, 4, 5, 6, 7, 8 until each is built
   to spec. Renders the stage's eyebrow, a Push AI voice line that
   names the next move, and a "we're building this next" hint —
   so playtest can still navigate via DevStageSwitcher and see
   what each stage will own.

   Final panels replace this import-by-import; the call site in
   StageRouter doesn't change.
   ============================================================ */

import { Sparkles } from "lucide-react";
import type { StagePanelProps } from "../StageRouter";

export interface PlaceholderConfig {
  eyebrow: string;
  title: string;
  /** Push AI voice — 6-12 words, names the next move. */
  aiLine: string;
  /** What this panel will own once built. */
  upcomingNote: string;
}

export function StagePlaceholderPanel({
  config,
  application,
}: { config: PlaceholderConfig } & StagePanelProps) {
  return (
    <section className="ad-panel" aria-label={config.title}>
      <header className="ad-panel__hero">
        <p className="ad-panel__eyebrow">{config.eyebrow}</p>
        <h1 className="ad-panel__title">{config.title}</h1>
      </header>

      <p className="ad-panel__ai">
        <span className="ad-panel__ai-icon" aria-hidden>
          <Sparkles size={12} strokeWidth={2.25} />
        </span>
        <span>{config.aiLine}</span>
      </p>

      <div className="ad-panel__placeholder">
        <p className="ad-panel__placeholder-eyebrow">In production</p>
        <p className="ad-panel__placeholder-body">{config.upcomingNote}</p>
        <p className="ad-panel__placeholder-hint">
          Tap the stage switcher (bottom right) to jump to a polished panel.
        </p>
      </div>

      {application.slotIso && (
        <div className="ad-panel__refchip">
          <span className="ad-panel__refchip-label">Slot</span>
          <span className="ad-panel__refchip-value">{application.slotIso}</span>
        </div>
      )}
    </section>
  );
}
