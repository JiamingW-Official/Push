import type { Metadata } from "next";
import Link from "next/link";
import ScrollRevealInit from "@/components/layout/ScrollRevealInit";
import LayerStack from "./LayerStack";
import VerifyDemo from "./VerifyDemo";
import FaqAccordion from "./FaqAccordion";
import "./conversion-oracle.css";

export const metadata: Metadata = {
  title:
    "ConversionOracle\u2122 \u2014 the AI that verifies every foot-traffic event | Push",
  description:
    "ConversionOracle\u2122 is the 3-layer verification stack inside Push's Vertical AI for Local Commerce: QR scan + Claude Vision OCR + 200m geo-fence. Median verify time under 8 seconds, 88% auto-verify target by Month 3.",
};

/* ─── Data ────────────────────────────────────────────────── */

const SPECS = [
  {
    k: "Median verify time",
    v: "< 8s",
    note: "p50 across the 3-layer stack, cold Claude API path.",
  },
  {
    k: "Auto-verify rate",
    v: "88%",
    note: "Month-3 target on Williamsburg Coffee+ cohort.",
  },
  {
    k: "Manual review SLA",
    v: "24h",
    note: "Human ops turnaround when auto stack abstains.",
  },
  {
    k: "Prediction accuracy",
    v: "94%",
    note: "Walk-in verdict accuracy on pilot cohort audit.",
  },
];

const FLOW = [
  {
    id: "auto_verified",
    title: "auto_verified",
    tone: "tertiary" as const,
    body: "3/3 layers agree. QR matches, receipt OCR matches, scanner was inside the 200m fence. Pays the creator.",
  },
  {
    id: "auto_rejected",
    title: "auto_rejected",
    tone: "primary" as const,
    body: "Hard reject. Layer failure combo is disqualifying \u2014 e.g., geo outside fence AND OCR mismatch. No human loop.",
  },
  {
    id: "manual_review",
    title: "manual_review",
    tone: "champagne" as const,
    body: "2/3 agree, 1 layer low-confidence. Enters 24h human ops queue. No payout until a human signs off.",
  },
  {
    id: "human_approved",
    title: "human_approved",
    tone: "tertiary" as const,
    body: "Ops reviewer overrides the stack \u2014 real customer, bad OCR pass. Pays out, label re-enters training corpus.",
  },
  {
    id: "human_rejected",
    title: "human_rejected",
    tone: "primary" as const,
    body: "Ops reviewer confirms fraud or mismatch. No payout, fingerprint flagged forever, creator scored down.",
  },
];

const FAQS = [
  {
    q: "What if Vision mis-reads a receipt?",
    a: "Any OCR confidence under our threshold downgrades the event to manual_review automatically. A human ops reviewer opens the original receipt image in a signed URL, confirms or rejects, and the labeled pair feeds back into ConversionOracle\u2122 for sharpening. Mis-reads do not silently pay out and do not silently kill payouts.",
  },
  {
    q: "Can I appeal a rejected scan?",
    a: "Yes. Both creators and merchants can open an appeal for 14 days after verdict. Appeals route to a senior ops reviewer who sees the full event context \u2014 QR trail, Vision output, geo trace, device fingerprint. Overturn rate on legitimate appeals is ~6% in pilot; every overturn is fed back as a training signal.",
  },
  {
    q: "What is the false-positive rate?",
    a: "False positives (events we auto_verified that were actually fraud) run around 1.8% in pilot, trending down with every batch of verified events. Our target is <1% by Month 6. Fingerprint blacklist is global forever even after a single confirmed fraud case \u2014 the dataset is the moat.",
  },
  {
    q: "What happens during an API outage?",
    a: "If the Claude API is down, ConversionOracle\u2122 env-gates to a rule-based mock fallback (matching on QR + geo alone) and stamps every event with a `degraded_mode` flag. Those events route 100% to manual review until the API is healthy, and we post degraded-mode windows publicly on the status page.",
  },
];

/* ─── Page ────────────────────────────────────────────────── */

export default function ConversionOraclePage() {
  return (
    <main className="co">
      <ScrollRevealInit />

      {/* ───────── HERO ───────── */}
      <section className="co-hero">
        <div className="container">
          <div className="co-hero-inner">
            <div className="co-eyebrow co-eyebrow--dark reveal">
              <span className="co-rule" />
              <span>The Moat</span>
            </div>

            <h1 className="co-hero-h reveal">
              <span className="co-hero-l1">ConversionOracle&trade;</span>
              <span className="co-hero-l2">
                The AI that verifies every foot-traffic event.
              </span>
            </h1>

            <p className="co-hero-sub reveal">
              ConversionOracle&trade; is the 3-layer verification stack inside
              Push&apos;s Vertical AI for Local Commerce engine. Every walk-in
              is cross-checked against a QR scan at the counter, a Claude Vision
              OCR read of the receipt, and a 200m geo-fence against the
              creator&apos;s content attribution. Verdict in under 8 seconds.
              Human ops queue when the stack abstains.
            </p>

            <div className="co-hero-cta reveal">
              <Link
                href="/conversion-oracle/accuracy"
                className="co-btn co-btn--ghost"
              >
                See accuracy
                <span aria-hidden="true" className="co-btn-arrow">
                  →
                </span>
              </Link>
              <Link href="/merchant/pilot" className="co-btn co-btn--primary">
                Start $0 Pilot
                <span aria-hidden="true" className="co-btn-arrow">
                  →
                </span>
              </Link>
            </div>

            <div className="co-hero-meta reveal">
              <span className="co-chip">3-layer stack</span>
              <span className="co-chip">&lt; 8s median verify</span>
              <span className="co-chip">88% auto-verify target</span>
              <span className="co-chip">Claude Sonnet 4.6</span>
            </div>
          </div>
        </div>
        <div className="co-hero-grid" aria-hidden="true" />
      </section>

      {/* ───────── §1 3-layer stack (interactive) ───────── */}
      <section className="co-sec co-sec--stack">
        <div className="container">
          <div className="co-sec-head reveal">
            <span className="co-s-label">
              <span className="co-rule" />
              §1 · The stack
            </span>
            <h2 className="co-sec-h">
              Three independent layers. Any disagreement routes a human.
            </h2>
            <p className="co-sec-sub-dark">
              Click a layer to inspect what it checks, its latency budget, and
              its fail modes. No layer alone is load-bearing &mdash; the whole
              stack is the verdict.
            </p>
          </div>

          <LayerStack />
        </div>
      </section>

      {/* ───────── §2 Verdict flowchart ───────── */}
      <section className="co-sec co-sec--flow">
        <div className="container">
          <div className="co-sec-head reveal">
            <span className="co-s-label">
              <span className="co-rule" />
              §2 · Verdict tree
            </span>
            <h2 className="co-sec-h">
              Five terminal states. No hidden intermediate limbo.
            </h2>
          </div>

          <div className="co-flow reveal">
            <svg
              className="co-flow-svg"
              viewBox="0 0 1120 460"
              role="img"
              aria-label="Verdict flowchart: scan event branches to auto_verified, auto_rejected, or manual_review; manual_review routes to human_approved or human_rejected"
            >
              <defs>
                <marker
                  id="co-arrow-dark"
                  viewBox="0 0 10 10"
                  refX="9"
                  refY="5"
                  markerWidth="7"
                  markerHeight="7"
                  orient="auto"
                >
                  <path d="M0,0 L10,5 L0,10 Z" fill="#003049" />
                </marker>
                <marker
                  id="co-arrow-red"
                  viewBox="0 0 10 10"
                  refX="9"
                  refY="5"
                  markerWidth="7"
                  markerHeight="7"
                  orient="auto"
                >
                  <path d="M0,0 L10,5 L0,10 Z" fill="#c1121f" />
                </marker>
                <marker
                  id="co-arrow-gold"
                  viewBox="0 0 10 10"
                  refX="9"
                  refY="5"
                  markerWidth="7"
                  markerHeight="7"
                  orient="auto"
                >
                  <path d="M0,0 L10,5 L0,10 Z" fill="#c9a96e" />
                </marker>
                <marker
                  id="co-arrow-teal"
                  viewBox="0 0 10 10"
                  refX="9"
                  refY="5"
                  markerWidth="7"
                  markerHeight="7"
                  orient="auto"
                >
                  <path d="M0,0 L10,5 L0,10 Z" fill="#669bbc" />
                </marker>
              </defs>

              {/* Root: scan event */}
              <rect
                x="480"
                y="20"
                width="160"
                height="56"
                fill="#003049"
                stroke="#003049"
              />
              <text
                x="560"
                y="43"
                fill="#f5f2ec"
                fontFamily="CSGenioMono, monospace"
                fontSize="11"
                fontWeight="700"
                textAnchor="middle"
                letterSpacing="1.4"
              >
                SCAN EVENT
              </text>
              <text
                x="560"
                y="60"
                fill="rgba(245,242,236,0.65)"
                fontFamily="CSGenioMono, monospace"
                fontSize="10"
                textAnchor="middle"
              >
                QR + OCR + geo
              </text>

              {/* Arrows to tier 1 */}
              <path
                d="M560 76 L200 160"
                stroke="#669bbc"
                strokeWidth="1.5"
                fill="none"
                markerEnd="url(#co-arrow-teal)"
              />
              <path
                d="M560 76 L920 160"
                stroke="#c1121f"
                strokeWidth="1.5"
                fill="none"
                markerEnd="url(#co-arrow-red)"
              />
              <path
                d="M560 76 L560 160"
                stroke="#c9a96e"
                strokeWidth="1.5"
                fill="none"
                markerEnd="url(#co-arrow-gold)"
              />

              {/* Arrow labels tier 1 */}
              <text
                x="365"
                y="115"
                fill="#669bbc"
                fontFamily="CSGenioMono, monospace"
                fontSize="10"
                fontWeight="700"
                letterSpacing="1"
                textAnchor="middle"
              >
                3/3 AGREE
              </text>
              <text
                x="560"
                y="122"
                fill="#c9a96e"
                fontFamily="CSGenioMono, monospace"
                fontSize="10"
                fontWeight="700"
                letterSpacing="1"
                textAnchor="middle"
              >
                2/3 + low conf
              </text>
              <text
                x="755"
                y="115"
                fill="#c1121f"
                fontFamily="CSGenioMono, monospace"
                fontSize="10"
                fontWeight="700"
                letterSpacing="1"
                textAnchor="middle"
              >
                HARD FAIL
              </text>

              {/* Tier 1: auto_verified */}
              <rect
                x="80"
                y="160"
                width="240"
                height="56"
                fill="#f5f2ec"
                stroke="#669bbc"
                strokeWidth="2"
              />
              <text
                x="200"
                y="183"
                fill="#003049"
                fontFamily="CSGenioMono, monospace"
                fontSize="12"
                fontWeight="700"
                textAnchor="middle"
                letterSpacing="0.8"
              >
                auto_verified
              </text>
              <text
                x="200"
                y="200"
                fill="rgba(0,48,73,0.6)"
                fontFamily="CSGenioMono, monospace"
                fontSize="10"
                textAnchor="middle"
              >
                pays creator · writes label
              </text>

              {/* Tier 1: manual_review */}
              <rect
                x="440"
                y="160"
                width="240"
                height="56"
                fill="#f5f2ec"
                stroke="#c9a96e"
                strokeWidth="2"
              />
              <text
                x="560"
                y="183"
                fill="#003049"
                fontFamily="CSGenioMono, monospace"
                fontSize="12"
                fontWeight="700"
                textAnchor="middle"
                letterSpacing="0.8"
              >
                manual_review
              </text>
              <text
                x="560"
                y="200"
                fill="rgba(0,48,73,0.6)"
                fontFamily="CSGenioMono, monospace"
                fontSize="10"
                textAnchor="middle"
              >
                24h human SLA · no payout
              </text>

              {/* Tier 1: auto_rejected */}
              <rect
                x="800"
                y="160"
                width="240"
                height="56"
                fill="#f5f2ec"
                stroke="#c1121f"
                strokeWidth="2"
              />
              <text
                x="920"
                y="183"
                fill="#c1121f"
                fontFamily="CSGenioMono, monospace"
                fontSize="12"
                fontWeight="700"
                textAnchor="middle"
                letterSpacing="0.8"
              >
                auto_rejected
              </text>
              <text
                x="920"
                y="200"
                fill="rgba(193,18,31,0.8)"
                fontFamily="CSGenioMono, monospace"
                fontSize="10"
                textAnchor="middle"
              >
                no payout · fingerprint logged
              </text>

              {/* Arrows from manual_review */}
              <path
                d="M480 216 L280 320"
                stroke="#669bbc"
                strokeWidth="1.5"
                fill="none"
                markerEnd="url(#co-arrow-teal)"
              />
              <path
                d="M640 216 L840 320"
                stroke="#c1121f"
                strokeWidth="1.5"
                fill="none"
                markerEnd="url(#co-arrow-red)"
              />

              <text
                x="335"
                y="278"
                fill="#669bbc"
                fontFamily="CSGenioMono, monospace"
                fontSize="10"
                fontWeight="700"
                letterSpacing="1"
                textAnchor="middle"
              >
                REVIEWER OK
              </text>
              <text
                x="785"
                y="278"
                fill="#c1121f"
                fontFamily="CSGenioMono, monospace"
                fontSize="10"
                fontWeight="700"
                letterSpacing="1"
                textAnchor="middle"
              >
                REVIEWER FAIL
              </text>

              {/* Tier 2: human_approved */}
              <rect
                x="160"
                y="320"
                width="240"
                height="56"
                fill="#003049"
                stroke="#669bbc"
                strokeWidth="2"
              />
              <text
                x="280"
                y="343"
                fill="#f5f2ec"
                fontFamily="CSGenioMono, monospace"
                fontSize="12"
                fontWeight="700"
                textAnchor="middle"
                letterSpacing="0.8"
              >
                human_approved
              </text>
              <text
                x="280"
                y="360"
                fill="rgba(245,242,236,0.65)"
                fontFamily="CSGenioMono, monospace"
                fontSize="10"
                textAnchor="middle"
              >
                pays · trains model
              </text>

              {/* Tier 2: human_rejected */}
              <rect
                x="720"
                y="320"
                width="240"
                height="56"
                fill="#003049"
                stroke="#c1121f"
                strokeWidth="2"
              />
              <text
                x="840"
                y="343"
                fill="#f5f2ec"
                fontFamily="CSGenioMono, monospace"
                fontSize="12"
                fontWeight="700"
                textAnchor="middle"
                letterSpacing="0.8"
              >
                human_rejected
              </text>
              <text
                x="840"
                y="360"
                fill="rgba(245,242,236,0.65)"
                fontFamily="CSGenioMono, monospace"
                fontSize="10"
                textAnchor="middle"
              >
                no payout · creator scored down
              </text>

              {/* Footer label */}
              <text
                x="560"
                y="430"
                fill="rgba(0,48,73,0.55)"
                fontFamily="CSGenioMono, monospace"
                fontSize="11"
                fontWeight="700"
                textAnchor="middle"
                letterSpacing="1.5"
              >
                EVERY VERDICT FEEDS CONVERSIONORACLE&trade; TRAINING CORPUS
              </text>
            </svg>
          </div>

          <div className="co-flow-legend reveal">
            {FLOW.map((f) => (
              <article
                key={f.id}
                className={`co-flow-card co-flow-card--${f.tone}`}
              >
                <div className="co-flow-card-k">{f.title}</div>
                <p className="co-flow-card-v">{f.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ───────── §3 Live demo ───────── */}
      <section className="co-sec co-sec--demo">
        <div className="container">
          <div className="co-sec-head reveal">
            <span className="co-s-label">
              <span className="co-rule" />
              §3 · Live demo
            </span>
            <h2 className="co-sec-h">A scan, end-to-end, in seven seconds.</h2>
            <p className="co-sec-sub-dark">
              Simulated sequence of a real pilot event. QR hits at t=0, Vision
              OCR returns at t=1.2s, geo-check finalizes at t=3.8s, verdict is
              written at t=7.1s. Auto-loops every 10 seconds.
            </p>
          </div>

          <VerifyDemo />
        </div>
      </section>

      {/* ───────── §4 Specs ───────── */}
      <section className="co-sec co-sec--specs">
        <div className="container">
          <div className="co-sec-head reveal">
            <span className="co-s-label">
              <span className="co-rule" />
              §4 · Specs
            </span>
            <h2 className="co-sec-h">
              The numbers we publish &mdash; and the numbers we audit to.
            </h2>
          </div>

          <div className="co-specs">
            {SPECS.map((s) => (
              <article key={s.k} className="co-spec-card reveal">
                <div className="co-spec-v">{s.v}</div>
                <div className="co-spec-k">{s.k}</div>
                <p className="co-spec-note">{s.note}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ───────── §5 Technical stack ───────── */}
      <section className="co-sec co-sec--tech">
        <div className="container">
          <div className="co-sec-head reveal">
            <span className="co-s-label">
              <span className="co-rule" />
              §5 · Under the hood
            </span>
            <h2 className="co-sec-h">
              Claude Sonnet 4.6 &mdash; the model, the fallback, the retention.
            </h2>
          </div>

          <div className="co-tech-grid">
            <article className="co-tech-card reveal">
              <div className="co-tech-k">Reasoning + OCR</div>
              <h3 className="co-tech-title">Claude Sonnet 4.6</h3>
              <p className="co-tech-body">
                We use Claude Sonnet 4.6 for both the creator-to-receipt
                matching prompt and the Vision OCR pass on receipt images. One
                model, two calls, shared prompt cache. Chosen because it
                outperforms larger generic LLMs on structured-output
                local-commerce tasks while staying under our per-event latency
                budget. Anthropic&apos;s cache hit rate on our prompts sits
                around 84%, which is the reason a full 3-layer verdict fits
                inside the &lt; 8s envelope.
              </p>
            </article>

            <article className="co-tech-card reveal">
              <div className="co-tech-k">Degraded mode</div>
              <h3 className="co-tech-title">Env-gated mock fallback</h3>
              <p className="co-tech-body">
                If <code>ANTHROPIC_API_KEY</code> is missing, rate-limited, or
                the Claude API is throwing for longer than 30s,
                ConversionOracle&trade; env-gates to a deterministic rule-based
                matcher. Every event produced in degraded mode is stamped{" "}
                <code>degraded_mode=true</code> and routed 100% to
                manual_review. Degraded windows are published on the public
                status page &mdash; we don&apos;t silently swap matching
                engines.
              </p>
            </article>

            <article className="co-tech-card reveal">
              <div className="co-tech-k">Data retention</div>
              <h3 className="co-tech-title">90 days raw · forever hashed</h3>
              <p className="co-tech-body">
                Raw receipt images, QR payloads, and scanner GPS traces are
                purged after 90 days. Hashed fingerprints &mdash; receipt item
                SKU sequence, device ID hash, geo bucket &mdash; are retained
                indefinitely so that ConversionOracle&trade; keeps the long-tail
                fraud memory that makes the moat compound. This is disclosed in
                the merchant &amp; creator agreements and is part of the Push
                DisclosureBot audit schema.
              </p>
            </article>
          </div>
        </div>
      </section>

      {/* ───────── §6 FAQ ───────── */}
      <section className="co-sec co-sec--faq">
        <div className="container">
          <div className="co-sec-head reveal">
            <span className="co-s-label">
              <span className="co-rule" />
              §6 · FAQ
            </span>
            <h2 className="co-sec-h">
              The questions every merchant and creator asks on day 1.
            </h2>
          </div>

          <FaqAccordion items={FAQS} />
        </div>
      </section>

      {/* ───────── §7 CTA ───────── */}
      <section className="co-cta">
        <div className="container">
          <div className="co-cta-inner reveal">
            <span className="co-s-label co-s-label--w">
              <span className="co-rule co-rule--w" />
              Start the loop
            </span>
            <h2 className="co-cta-h">
              Every verified walk-in sharpens the next prediction.
            </h2>
            <p className="co-cta-sub">
              ConversionOracle&trade; is how Push&apos;s Customer Acquisition
              Engine earns the right to bill per verified customer. No verdict,
              no charge.
            </p>

            <div className="co-cta-row">
              <Link
                href="/merchant/pilot"
                className="co-btn co-btn--primary co-btn--lg"
              >
                Start $0 Pilot
                <span aria-hidden="true" className="co-btn-arrow">
                  →
                </span>
              </Link>
              <Link
                href="/conversion-oracle/accuracy"
                className="co-btn co-btn--ghost co-btn--lg"
              >
                See the accuracy dashboard
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
