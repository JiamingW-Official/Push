"use client";

/* ── JustAppliedPanel ──────────────────────────────────────
   Shown when ?pilot=just_applied is present after LOI submit.
   Includes 7-day onboarding checklist + next-touchpoint timeline.
   Checklist state persists to localStorage: push-pilot-checklist
   ─────────────────────────────────────────────────────────── */

import { useState, useEffect } from "react";
import styles from "./JustAppliedPanel.module.css";

const CHECKLIST_KEY = "push-pilot-checklist";

type CheckItem = {
  id: string;
  day: string;
  title: string;
  body: string;
  href?: string;
  cta?: string;
};

const CHECKLIST: CheckItem[] = [
  {
    id: "qr",
    day: "Day 1",
    title: "Print your QR code",
    body: "Place one at the counter and one at the register. This starts the 3-layer ConversionOracle™ verification flow.",
    href: "/merchant/qr-codes",
    cta: "Get QR codes →",
  },
  {
    id: "photos",
    day: "Day 1–2",
    title: "Send 3 photos of your space",
    body: "Front exterior, counter area, and seating. Creators use these to authentically frame their content.",
    cta: "Reply to your brief email",
  },
  {
    id: "brief",
    day: "Day 2",
    title: "Confirm your campaign brief",
    body: "Review the creator brief Prum will send within 48h — approve or leave notes inline.",
    href: "/merchant/campaigns",
    cta: "View campaigns →",
  },
  {
    id: "integration",
    day: "Day 3",
    title: "Connect your POS (optional)",
    body: "Square or Toast integration lets ConversionOracle™ cross-reference transaction data for higher auto-verify rates.",
    href: "/merchant/integrations",
    cta: "Connect integrations →",
  },
  {
    id: "call",
    day: "Day 3–5",
    title: "Book your onboarding call with Prum",
    body: "30 minutes to walk through brief, creator selection, and launch checklist. Pilot doesn't launch until this is done.",
    cta: "Book call →",
  },
  {
    id: "launch",
    day: "Day 5–7",
    title: "Approve final creator lineup",
    body: "ConversionOracle™ matches top 5 creators by ZIP + vertical + Push Score. You approve — they go live within 24h.",
    href: "/merchant/applicants",
    cta: "View applicants →",
  },
  {
    id: "first-scan",
    day: "Day 7",
    title: "First verified customer",
    body: "Your dashboard shows the verified walk-in under 8 seconds. ConversionOracle™ confirms ground truth. Pilot is live.",
  },
];

const TIMELINE = [
  { label: "Now", note: "Application received · LOI on file" },
  { label: "48h", note: "Prum reviews brief + sends creator shortlist" },
  { label: "Day 3", note: "Creator matching complete · Schedule call" },
  { label: "Day 7", note: "First campaign live · First AI-verified customer" },
];

type Props = { pilotId?: string };

export default function JustAppliedPanel({ pilotId }: Props) {
  const [done, setDone] = useState<Set<string>>(new Set());

  // Restore from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(CHECKLIST_KEY);
      if (raw) setDone(new Set(JSON.parse(raw)));
    } catch {
      /* ignore */
    }
  }, []);

  function toggle(id: string) {
    setDone((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      try {
        localStorage.setItem(CHECKLIST_KEY, JSON.stringify([...next]));
      } catch {
        /* ignore */
      }
      return next;
    });
  }

  const completedCount = done.size;
  const totalCount = CHECKLIST.length;
  const pct = Math.round((completedCount / totalCount) * 100);
  const allDone = completedCount === totalCount;

  return (
    <section
      className={styles.panel}
      aria-label="Pilot application — next steps"
    >
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <p className={styles.eyebrow}>
            Pilot application received
            {pilotId && <span className={styles.pilotId}> · {pilotId}</span>}
          </p>
          <h1 className={styles.title}>
            You&rsquo;re in the queue.{" "}
            <span className={styles.titleLight}>
              Here&rsquo;s what happens next.
            </span>
          </h1>
          <p className={styles.sub}>
            Prum reviews every application within 48 hours. Complete the
            checklist below so you&rsquo;re ready to launch the moment
            you&rsquo;re approved. ConversionOracle™ needs 7 days of signal to
            start optimizing.
          </p>
        </div>
        <div className={styles.headerRight}>
          <a href="/merchant/messages" className={styles.prumCta}>
            Message Prum →
          </a>
        </div>
      </div>

      {/* Progress bar */}
      <div
        className={styles.progress}
        aria-label={`${completedCount} of ${totalCount} checklist items complete`}
      >
        <div className={styles.progressMeta}>
          <span className={styles.progressLabel}>
            {allDone
              ? "Ready to launch ✓"
              : `${completedCount} / ${totalCount} complete`}
          </span>
          <span className={styles.progressPct}>{pct}%</span>
        </div>
        <div className={styles.progressBar}>
          <div
            className={`${styles.progressFill} ${allDone ? styles.progressFillDone : ""}`}
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      {/* Two-col: checklist + timeline */}
      <div className={styles.body}>
        {/* Checklist */}
        <div className={styles.checklist}>
          <h2 className={styles.sectionTitle}>7-day checklist</h2>
          <ol className={styles.items}>
            {CHECKLIST.map((item) => {
              const checked = done.has(item.id);
              return (
                <li
                  key={item.id}
                  className={`${styles.item} ${checked ? styles.itemDone : ""}`}
                >
                  <button
                    type="button"
                    className={styles.checkbox}
                    onClick={() => toggle(item.id)}
                    aria-pressed={checked}
                    aria-label={`Mark "${item.title}" as ${checked ? "incomplete" : "complete"}`}
                  >
                    {checked && (
                      <svg viewBox="0 0 12 12" fill="none" aria-hidden="true">
                        <path
                          d="M2 6l3 3 5-5"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                        />
                      </svg>
                    )}
                  </button>
                  <div className={styles.itemContent}>
                    <div className={styles.itemHead}>
                      <span className={styles.itemDay}>{item.day}</span>
                      <span className={styles.itemTitle}>{item.title}</span>
                    </div>
                    <p className={styles.itemBody}>{item.body}</p>
                    {item.href && item.cta && (
                      <a href={item.href} className={styles.itemLink}>
                        {item.cta}
                      </a>
                    )}
                    {!item.href && item.cta && (
                      <span className={styles.itemLinkPlain}>{item.cta}</span>
                    )}
                  </div>
                </li>
              );
            })}
          </ol>
        </div>

        {/* Timeline */}
        <aside className={styles.timeline} aria-label="What happens and when">
          <h2 className={styles.sectionTitle}>Next touchpoints</h2>
          <ol className={styles.timelineItems}>
            {TIMELINE.map((t, i) => (
              <li key={t.label} className={styles.timelineItem}>
                <div className={styles.timelineDot} aria-hidden="true" />
                {i < TIMELINE.length - 1 && (
                  <div className={styles.timelineLine} aria-hidden="true" />
                )}
                <div className={styles.timelineContent}>
                  <span className={styles.timelineLabel}>{t.label}</span>
                  <span className={styles.timelineNote}>{t.note}</span>
                </div>
              </li>
            ))}
          </ol>

          <div className={styles.sideNote}>
            <p className={styles.sideNoteTitle}>Questions before your call?</p>
            <a href="/merchant/messages" className={styles.sideNoteCta}>
              Message Prum directly →
            </a>
            <p className={styles.sideNoteSub}>
              Average response time: under 4 hours on weekdays.
            </p>
          </div>
        </aside>
      </div>
    </section>
  );
}
