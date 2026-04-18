"use client";

/* ── First-Run Empty State Hero ─────────────────────────────
   3 steps to first verified customer via the Customer
   Acquisition Engine — Vertical AI for Local Commerce.
   ──────────────────────────────────────────────────────────── */

import styles from "./EmptyStateHero.module.css";

export default function EmptyStateHero() {
  return (
    <section className={styles.hero} aria-label="First-run onboarding">
      <div className={styles.heroHeader}>
        <p className={styles.eyebrow}>Welcome · Setup · 0 / 3 complete</p>
        <h1 className={styles.title}>
          Welcome to your Customer Acquisition Engine.
        </h1>
        <p className={styles.sub}>
          You&rsquo;re 3 steps from your first verified customer. Push runs
          Vertical AI for Local Commerce — ConversionOracle&trade; handles
          walk-in ground truth, you own the storefront.
        </p>
      </div>

      <div className={styles.grid}>
        {/* Step 1 — Launch first campaign */}
        <article className={`${styles.card} ${styles.cardPrimary}`}>
          <div className={styles.stepNum}>01</div>
          <h2 className={styles.cardTitle}>Launch first campaign</h2>
          <p className={styles.cardBody}>
            Your Neighborhood Playbook lives here. Pick how you want to start —
            we&rsquo;ll pre-fill budget, creator tier, and QR flow.
          </p>
          <div className={styles.options}>
            <a
              href="/merchant/campaigns/new?mode=template"
              className={`${styles.option} ${styles.optionSolid}`}
            >
              Use template
            </a>
            <a
              href="/merchant/campaigns/new?mode=auto"
              className={`${styles.option} ${styles.optionOutline}`}
            >
              AI auto-draft brief
            </a>
            <a
              href="/merchant/campaigns/new?mode=blank"
              className={`${styles.option} ${styles.optionGhost}`}
            >
              Blank
            </a>
          </div>
        </article>

        {/* Step 2 — Print QR */}
        <article className={styles.card}>
          <div className={styles.stepNum}>02</div>
          <h2 className={styles.cardTitle}>Print your QR code</h2>
          <p className={styles.cardBody}>
            QR is the first layer of 3-layer verification. Hang one at the
            counter, one at the register — under 8 seconds per scan to verdict.
          </p>
          <a href="/merchant/qr-codes" className={styles.cardCta}>
            Get QR codes &rarr;
          </a>
        </article>

        {/* Step 3 — Playbook */}
        <article className={styles.card}>
          <div className={styles.stepNum}>03</div>
          <h2 className={styles.cardTitle}>See the playbook</h2>
          <p className={styles.cardBody}>
            Williamsburg Coffee+ 60-day playbook — the exact SLR ladder, creator
            mix, and DisclosureBot compliance rhythm we&rsquo;re running on the
            beachhead.
          </p>
          <a href="/neighborhood-playbook" className={styles.cardCta}>
            Open playbook &rarr;
          </a>
        </article>
      </div>

      <p className={styles.footnote}>
        Targets: Month 3 SLR 8 &middot; Month 6 SLR 12 &middot; Month 12 SLR 25.
        Industry baseline is 3&ndash;5.
      </p>
    </section>
  );
}
