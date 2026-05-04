"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import "./merchants.css";

/* ── Editorial compare table — Cinema Selects style (§ 8.6) ── */
const COMPARE_ROWS: ReadonlyArray<{
  feature: string;
  push: string;
  traditional: string;
  outcome: string;
}> = [
  {
    feature: "Pay model",
    push: "Per verified walk-in",
    traditional: "Flat retainer or CPM",
    outcome: "Spend tracks real lift",
  },
  {
    feature: "Setup fee",
    push: "None",
    traditional: "$2K–$8K agency onboarding",
    outcome: "Zero risk to test",
  },
  {
    feature: "Attribution",
    push: "QR + GPS oracle, signed",
    traditional: "Modeled, self-reported",
    outcome: "Receipts, not vibes",
  },
  {
    feature: "Creator selection",
    push: "Verified local — 6 tiers",
    traditional: "Influencer farm or agency",
    outcome: "Neighborhood fit > reach",
  },
  {
    feature: "Fraud prevention",
    push: "Per-poster QR + replay check",
    traditional: "Best-effort screening",
    outcome: "Bots cannot scan a door",
  },
  {
    feature: "Cancel policy",
    push: "Anytime, no penalty",
    traditional: "30–90 day notice",
    outcome: "Budget stays liquid",
  },
];

/* ── ROI tile data ──────────────────────────────────────── */
const ROI_TILES: ReadonlyArray<{
  num: string;
  label: string;
  caption: string;
}> = [
  {
    num: "$3.50",
    label: "Avg cost per verified visit",
    caption: "All-in. No platform fee.",
  },
  {
    num: "340%",
    label: "Reported ROI lift vs paid social",
    caption: "Williamsburg pilot · 12 weeks.",
  },
  {
    num: "24h",
    label: "From signup to live campaign",
    caption: "Self-serve, oracle-verified.",
  },
];

/* ── Reveal-on-scroll hook (vanilla IO; respects reduced-motion) ─── */
function useRevealOnScroll() {
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const targets = root.querySelectorAll<HTMLElement>("[data-reveal]");

    if (prefersReduced) {
      targets.forEach((el) => el.classList.add("is-revealed"));
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-revealed");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.18, rootMargin: "0px 0px -64px 0px" },
    );

    targets.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return rootRef;
}

/* ── Page ─────────────────────────────────────────────────── */
export default function ForMerchantsPage() {
  const rootRef = useRevealOnScroll();

  return (
    <div ref={rootRef}>
      {/* ════════════════════════════════════════════════════
          01 — HERO  ·  Full-Bleed Pattern A (§ 4.2 border-radius:0)
          Dark ink + radial accents · Magvix corner-anchored
          ════════════════════════════════════════════════════ */}
      <section className="mn-hero" aria-label="For Merchants Hero">
        {/* Ghost watermark — architectural numeral */}
        <div className="mn-hero-ghost" aria-hidden="true">
          1.4M
        </div>

        {/* Floating glass peek tile — top-right (§ 8.9) */}
        <div className="lg-surface--dark mn-hero-peek" aria-hidden="true">
          <div className="mn-peek-live">
            <span className="mn-peek-dot" />
            <span className="mn-peek-live-label">Live</span>
          </div>
          <div className="mn-peek-num">1.4M+</div>
          <div className="mn-peek-label">Verified walk-ins</div>
        </div>

        {/* Bottom-left corner-anchored copy block (§ 7.1) */}
        <div className="mn-hero-copy" data-reveal>
          <span className="eyebrow mn-hero-eyebrow">(FOR MERCHANTS)</span>

          <h1 className="mn-hero-h1 mixed-headline">
            Pay when they
            <br />
            walk <em>in</em>.
          </h1>

          <p className="mn-hero-sub">
            Push ties your storefront to verified local creators. Every dollar
            moves only after a real customer scans at your door — GPS, QR
            oracle, and signed receipts.
          </p>

          <div className="mn-hero-actions">
            <Link href="/merchant/signup" className="btn-primary">
              Apply for trial
            </Link>
            <Link href="#how-it-works" className="btn-ghost mn-hero-ghost-btn">
              See how it works
            </Link>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════
          02 — VALUE PROP · Numbered editorial rows
          Surface-2 warm-neutral · breaks dark adjacency after hero
          ════════════════════════════════════════════════════ */}
      <section
        className="mn-value-section"
        aria-label="Why merchants choose Push"
      >
        <div className="mn-section-inner" data-reveal>
          <span className="eyebrow mn-eyebrow-block">(THE PUSH MODEL)</span>
          <h2 className="mn-h2">
            The only ad spend
            <br />
            tied to <em>real</em> visits.
          </h2>

          <div className="mn-value-rows">
            {[
              {
                num: "01",
                title: "Zero upfront risk.",
                body: "No setup fee. No retainer. No monthly minimum. Your first dollar moves only when a real customer scans at your door.",
              },
              {
                num: "02",
                title: "Local creators, verified.",
                body: "Push surfaces your campaign to creators who actually live, eat, and shop in your neighborhood. Six tiers, ranked by record — never by follower count.",
              },
              {
                num: "03",
                title: "Receipts, not models.",
                body: "GPS timestamp + QR oracle + signed scan on every walk-in. Your dashboard shows each customer in real time. No modeled lift, no impressions that might have driven traffic.",
              },
            ].map((row) => (
              <div key={row.num} className="mn-value-row click-shift">
                <span className="mn-value-num">{row.num}</span>
                <div className="mn-value-row-body">
                  <h3 className="mn-h3">{row.title}</h3>
                  <p className="mn-value-row-text">{row.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════
          SIGNATURE DIVIDER 1 (§ 8.5 — max 2 per page)
          ════════════════════════════════════════════════════ */}
      <div className="mn-sig-wrap">
        <span className="sig-divider">Posted · Scanned · Settled ·</span>
      </div>

      {/* ════════════════════════════════════════════════════
          03 — ROI · Dark Ink + ROI tile trio
          Asymmetric 8+4 composition · KPIs in Darky
          ════════════════════════════════════════════════════ */}
      <section className="mn-roi-section" aria-label="ROI for merchants">
        {/* Ghost architectural dollar */}
        <div className="mn-roi-ghost" aria-hidden="true">
          $
        </div>

        <div className="mn-roi-inner" data-reveal>
          {/* Left 8-col: headline + ROI trio */}
          <div className="mn-roi-left">
            <span className="eyebrow mn-eyebrow-light mn-eyebrow-block">
              (ROI)
            </span>
            <h2 className="mn-h2 mn-h2-light">
              Numbers a CFO
              <br />
              can <em>verify</em>.
            </h2>

            <div className="mn-roi-row">
              {ROI_TILES.map((tile, i) => (
                <div key={tile.num} className="mn-roi-block">
                  <p className="mn-roi-num">{tile.num}</p>
                  <p className="mn-roi-label">{tile.label}</p>
                  <p className="mn-roi-caption">{tile.caption}</p>
                  {i < ROI_TILES.length - 1 && (
                    <span className="mn-roi-divider" aria-hidden="true" />
                  )}
                </div>
              ))}
            </div>

            <p className="mn-roi-fine">
              Every figure here is reconcilable with your POS. No modeled lift,
              no opaque attribution.
            </p>
          </div>

          {/* Right 4-col: trial CTA tile */}
          <div className="mn-roi-right">
            <div className="mn-roi-tile">
              <p className="mn-roi-tile-eyebrow">(TRIAL)</p>
              <p className="mn-roi-tile-head">First 50 visits free</p>
              <p className="mn-roi-tile-body">
                NYC merchants only. Onboarding within 24 hours. Apply once, run
                as many campaigns as you want.
              </p>
              <Link href="/merchant/signup" className="btn-ink">
                Apply for trial
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════
          04 — HOW IT WORKS · Warm butter candy panel
          3 numbered editorial rows
          ════════════════════════════════════════════════════ */}
      <section
        id="how-it-works"
        className="candy-panel mn-how-section"
        aria-label="How it works for merchants"
      >
        {/* Floating glass tile (§ 8.9 — single per panel) */}
        <div className="lg-surface mn-how-tile" aria-hidden="true">
          <div className="mn-how-tile-num">3</div>
          <div className="mn-how-tile-cap">steps to first walk-in</div>
        </div>

        <div className="mn-section-inner" data-reveal>
          <span className="eyebrow mn-eyebrow-block">(HOW IT WORKS)</span>
          <h2 className="mn-h2">
            Post. Match.
            <br />
            <em>Settle</em>.
          </h2>

          <div className="mn-how-grid">
            {[
              {
                num: "01",
                title: "Post your campaign.",
                body: "Set the offer, daily budget cap, and block radius. Push surfaces your brief to nearby tiered creators — live inside 24 hours.",
              },
              {
                num: "02",
                title: "Creators promote.",
                body: "A local creator runs the post on their own audience. Each gets a unique QR poster — no two scans ever look alike, every code is signed.",
              },
              {
                num: "03",
                title: "Pay per walk-in.",
                body: "Customer scans at the door. GPS + timestamp + oracle verification. Settlement runs every Friday. Every visit is on the dashboard the moment it happens.",
              },
            ].map((step) => (
              <div key={step.num} className="mn-how-row click-shift">
                <span className="mn-how-num">{step.num}</span>
                <div className="mn-how-body">
                  <h3 className="mn-h3">{step.title}</h3>
                  <p className="mn-how-text">{step.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════
          05 — COMPARISON · Editorial Table (Cinema Selects · § 8.6)
          Surface warm-neutral · Push vs traditional ad spend
          ════════════════════════════════════════════════════ */}
      <section
        className="mn-table-section"
        aria-label="Push vs traditional ad spend"
      >
        <div className="mn-section-inner mn-table-inner" data-reveal>
          <span className="eyebrow mn-table-eyebrow">(THE COMPARISON)</span>
          <h2 className="mn-table-h2">
            Push <em>vs.</em> traditional ad spend.
          </h2>
          <p className="mn-table-lede">
            Same dollar. Different math. Receipts decide who you paid for — not
            a brand-lift study, not an agency dashboard, not a 90-day report.
          </p>

          <div className="mn-table-scroll">
            <table className="mn-compare-table">
              <thead>
                <tr>
                  <th scope="col">(WHAT MATTERS)</th>
                  <th scope="col" className="mn-th-push">
                    (PUSH)
                  </th>
                  <th scope="col">(TRADITIONAL)</th>
                  <th scope="col" className="mn-th-outcome">
                    (OUTCOME)
                  </th>
                </tr>
              </thead>
              <tbody>
                {COMPARE_ROWS.map((row) => (
                  <tr key={row.feature}>
                    <td className="mn-td-feature">{row.feature}</td>
                    <td className="mn-td-push">{row.push}</td>
                    <td className="mn-td-other">{row.traditional}</td>
                    <td className="mn-td-outcome">{row.outcome}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════
          SIGNATURE DIVIDER 2 (§ 8.5 — max 2 per page)
          ════════════════════════════════════════════════════ */}
      <div className="mn-sig-wrap">
        <span className="sig-divider">Pay for visits · Not impressions ·</span>
      </div>

      {/* ════════════════════════════════════════════════════
          06 — TESTIMONIAL · Brand-Red saturated moment (§ 9.6 ≤1)
          Photo card with merchant case study
          ════════════════════════════════════════════════════ */}
      <section className="mn-quote-strip" aria-label="Merchant case study">
        <span aria-hidden="true" className="mn-quote-ghost">
          &ldquo;
        </span>
        <div className="mn-quote-inner" data-reveal>
          <span className="eyebrow mn-quote-eyebrow">
            (FREEHOLD BROOKLYN · WILLIAMSBURG)
          </span>
          <blockquote className="mn-quote-text">
            Push gave us 340% better ROI than our paid social — and every visit
            was verified at the door. We know exactly which creator drove which
            customer.
          </blockquote>
          <div className="mn-quote-attr">
            <div className="mn-quote-dash" aria-hidden="true" />
            <p className="mn-quote-name">
              Marcus Lee · General Manager, Freehold Brooklyn
            </p>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════
          07 — TICKET CTA · GA Orange saturated moment
          Single Ticket Panel (§ 8.2 — max 1 per page)
          ════════════════════════════════════════════════════ */}
      <section className="mn-ticket-wrap" aria-label="Apply for a Push trial">
        <div className="mn-ticket-inner" data-reveal>
          <div className="ticket-panel">
            <span
              className="ticket-grommet ticket-grommet--tl"
              aria-hidden="true"
            />
            <span
              className="ticket-grommet ticket-grommet--tr"
              aria-hidden="true"
            />
            <span
              className="ticket-grommet ticket-grommet--bl"
              aria-hidden="true"
            />
            <span
              className="ticket-grommet ticket-grommet--br"
              aria-hidden="true"
            />

            <span className="eyebrow mn-ticket-eyebrow">
              (YOUR FIRST CAMPAIGN)
            </span>
            <h2 className="mn-ticket-headline">Launch your storefront.</h2>
            <Link href="/merchant/signup" className="btn-ink">
              Apply for trial
            </Link>
            <p className="mn-ticket-fine">
              First 50 verified visits free · NYC only · Reviewed weekly.
            </p>
          </div>
        </div>
      </section>

      <div className="mn-bottom-spacer" />
    </div>
  );
}
