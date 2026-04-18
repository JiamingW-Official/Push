"use client";

/* ── Recent Verified Customers Feed ────────────────────────
   v5.1 — ConversionOracle™ walk-in verification output.
   3-layer verification (QR + Claude Vision OCR + geo-match)
   produces one of: auto_verified / manual_review / auto_rejected.
   New rows animate sliding in from top (slideDown 300ms).
   ─────────────────────────────────────────────────────────── */

import { useEffect, useState } from "react";
import styles from "./VerifiedFeed.module.css";

export type VerifiedVerdict =
  | "auto_verified"
  | "manual_review"
  | "auto_rejected";

export type VerifiedCustomer = {
  id: string;
  handle: string;
  qrId: string;
  timestamp: string; // ISO
  amount: number;
  verdict: VerifiedVerdict;
  latencyMs?: number;
};

const VERDICT_LABEL: Record<VerifiedVerdict, string> = {
  auto_verified: "Auto-verified",
  manual_review: "Manual review",
  auto_rejected: "Auto-rejected",
};

function timeAgo(iso: string): string {
  const t = new Date(iso).getTime();
  const diff = Date.now() - t;
  const m = Math.round(diff / 60_000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.round(h / 24);
  return `${d}d ago`;
}

export default function VerifiedFeed({ rows }: { rows: VerifiedCustomer[] }) {
  // Simulate a new row sliding in after mount — first row gets the animation.
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 80);
    return () => clearTimeout(t);
  }, []);

  return (
    <section className={styles.feed} aria-label="Recent verified customers">
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <p className={styles.eyebrow}>ConversionOracle feed</p>
          <h3 className={styles.title}>Recent verified customers</h3>
        </div>
        <span className={styles.liveDot} aria-label="Live">
          <span className={styles.liveDotPulse} />
          Live · under 8s latency
        </span>
      </header>

      <div className={styles.table}>
        <div className={styles.tableHead}>
          <div>Customer</div>
          <div>QR</div>
          <div>Time</div>
          <div className={styles.right}>Amount</div>
          <div>Verdict</div>
        </div>
        {rows.map((r, i) => (
          <div
            key={r.id}
            className={`${styles.row} ${mounted && i === 0 ? styles.rowFresh : ""}`}
          >
            <div className={styles.handle}>{r.handle}</div>
            <div className={styles.qr}>{r.qrId}</div>
            <div className={styles.time}>{timeAgo(r.timestamp)}</div>
            <div className={`${styles.amount} ${styles.right}`}>
              ${r.amount.toFixed(2)}
            </div>
            <div>
              <span
                className={`${styles.pill} ${
                  r.verdict === "auto_verified"
                    ? styles.pillVerified
                    : r.verdict === "manual_review"
                      ? styles.pillReview
                      : styles.pillRejected
                }`}
              >
                {VERDICT_LABEL[r.verdict]}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
