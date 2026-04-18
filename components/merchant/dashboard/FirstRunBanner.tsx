"use client";

/* ── First Campaign Guide Banner ───────────────────────────
   Dismissible 3-step banner for merchants with <2 campaigns.
   Champagne-accent border-left per Design.md spec.
   ──────────────────────────────────────────────────────────── */

import { useState } from "react";
import styles from "./FirstRunBanner.module.css";

export default function FirstRunBanner() {
  const [open, setOpen] = useState(true);
  if (!open) return null;

  const steps = [
    {
      n: "01",
      title: "Brief the campaign",
      body: "Template + AI auto-draft gets your first brief live in under 90 seconds.",
    },
    {
      n: "02",
      title: "Print the QR",
      body: "Hang at counter and register. Starts 3-layer verification flow.",
    },
    {
      n: "03",
      title: "Watch verified customers land",
      body: "ConversionOracle reports each walk-in under 8 seconds.",
    },
  ];

  return (
    <aside className={styles.banner} aria-label="Getting started guide">
      <div className={styles.inner}>
        <div className={styles.textCol}>
          <p className={styles.eyebrow}>First-campaign guide</p>
          <h3 className={styles.title}>
            Three moves between you and your first verified customer.
          </h3>
        </div>
        <ol className={styles.steps}>
          {steps.map((s) => (
            <li key={s.n} className={styles.step}>
              <span className={styles.stepNum}>{s.n}</span>
              <span className={styles.stepTitle}>{s.title}</span>
              <span className={styles.stepBody}>{s.body}</span>
            </li>
          ))}
        </ol>
      </div>
      <button
        type="button"
        className={styles.dismiss}
        onClick={() => setOpen(false)}
        aria-label="Dismiss first-run banner"
      >
        Dismiss
      </button>
    </aside>
  );
}
