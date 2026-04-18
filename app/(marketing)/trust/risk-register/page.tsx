import type { Metadata } from "next";
import Link from "next/link";
import RiskReveal from "./RiskReveal";
import "./risk-register.css";

export const metadata: Metadata = {
  title:
    "Risk Register — Public Transparency | Push Vertical AI for Local Commerce",
  description:
    "Public risk register: what could kill Push, what we are doing about it, and the trigger that will force a public update. Transparency-as-differentiator for merchants, creators, and investors.",
  robots: { index: true, follow: true },
};

/* ─── Inline SVG icons ──────────────────────────────────────── */
type IconProps = { className?: string };

function IconArrowRight({ className }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  );
}

/* ─── Data ──────────────────────────────────────────────────── */

type Level = "Low" | "Med" | "High" | "Critical";

type Risk = {
  num: string;
  title: string;
  probability: Level;
  impact: Level;
  mitigation: string;
  trigger: string;
};

const RISKS: Risk[] = [
  {
    num: "01",
    title: "No positive unit-economics cohort yet",
    probability: "High",
    impact: "Critical",
    mitigation:
      "90-day hard milestones gate every investor narrative claim: 5 / 12 / 15 merchants paying at $2.5K / $8K / $15K MRR respectively. Until one cohort shows LTV/CAC above 3x with verified customers, every deck slide is labeled forward-looking, not proven.",
    trigger:
      "First paid-cohort LTV/CAC publishable by Month 4. If the Month-4 cohort fails to clear, we publish the failure here within 7 days and re-scope.",
  },
  {
    num: "02",
    title: "Apple Business Connect integration",
    probability: "Low",
    impact: "High",
    mitigation:
      "Position Push as the Apple Business Connect creator layer, not a competitor. Push's moat is ConversionOracle-driven verification + DisclosureBot compliance — Apple's stack does neither. Monitor Apple Wallet SMB adoption monthly; pre-build a Wallet-pass attribution adapter so integration is a week, not a quarter.",
    trigger:
      "More than 20% of independent coffee shops in the Williamsburg beachhead using Apple Wallet passes within a trailing 90-day window.",
  },
  {
    num: "03",
    title: "AI verification false-positive / false-negative rate",
    probability: "Med",
    impact: "High",
    mitigation:
      "Dual-threshold verification pipeline: auto-approve above the high-confidence band, manual review in the middle band, auto-reject below the low band. Published accuracy targets: FP under 2%, FN under 5%. The full verdict audit trail is exportable per campaign. See /conversion-oracle/accuracy for live rates.",
    trigger:
      "Either FP or FN rate crosses its target band for 30 consecutive days on a trailing sample of 100+ verifications.",
  },
  {
    num: "04",
    title: "ConversionOracle accuracy does not beat Claude cold API",
    probability: "Med",
    impact: "High",
    mitigation:
      "Month-6 100-campaign A/B test comparing ConversionOracle (fine-tuned on Push verified-conversion corpus) against a vanilla Claude prompt on the same task. Pre-registered success criterion: at least 15% lift at p < 0.05. If the lift fails, we publicly pivot the moat narrative from 'proprietary model' to 'proprietary data + Software Leverage Ratio', and refund the corresponding portion of any sold ConversionOracle add-on.",
    trigger:
      "Month-6 A/B test outcome — result published here within 14 days regardless of direction.",
  },
  {
    num: "05",
    title: "Creator switching-cost weaker than assumed",
    probability: "Med",
    impact: "Med",
    mitigation:
      "SCOR framework tracked monthly: Supply density (creators per neighborhood), Conversion-aware matching (category_affinity + verified_conversions_90d gating), Ops leverage (campaigns per ops hour), Reputation portability (tier exports). If switching cost is real, Push creators run 3x the active campaigns/mo of their Aspire baseline.",
    trigger:
      "Month-2 Push creator active campaigns/mo drops below 3x Aspire baseline on a 30-creator sample.",
  },
  {
    num: "06",
    title: "FTC rulemaking bans per-customer pricing",
    probability: "Low",
    impact: "Critical",
    mitigation:
      "Monitor the FTC NPRM docket weekly. Pre-built contingency pricing: per-campaign flat fee plus outcome-correlated bonus, structured to satisfy current FTC guidance on creator compensation. Merchant MSAs include a 30-day unilateral pricing-migration clause so the switch is clean if forced.",
    trigger:
      "FTC NPRM published that materially restricts per-customer creator compensation.",
  },
  {
    num: "07",
    title: "Delaware corp law equity-to-contractor issue",
    probability: "Med",
    impact: "Med",
    mitigation:
      "Restricted stock awards with 83(b) election flow for the creator equity pool (see /creator/equity-pool). Profit-share fallback structured and opined on by external counsel before Month 6 in case the RSA flow is blocked. No equity is issued to non-employees without counsel sign-off.",
    trigger:
      "External counsel blocks the RSA structure, or a creator plaintiff raises a misclassification claim that touches equity treatment.",
  },
  {
    num: "08",
    title: "NYC winter seasonality kills Q1 ARR",
    probability: "High",
    impact: "Med",
    mitigation:
      "Q1 offer mix shifts to a retention add-on for existing merchants, de-risking net new acquisition. Pricing flex: lower base plus a flat $30 winter option to protect merchant cash-flow. Month-12 diversification into boutique fitness (counter-cyclical — Q1 peak) to hedge the coffee Q1 trough structurally.",
    trigger:
      "Q1 verified-customer count falls below 70% of the Q3 peak on a trailing 30-day basis.",
  },
  {
    num: "09",
    title: "Z bus factor = 1",
    probability: "Med",
    impact: "Critical",
    mitigation:
      "Every ML module is documented and version-pinned in the repo, with reproduction scripts gated to green in CI. ML Advisor engaged Month 2 on a retainer with defined escalation authority. Senior ML engineer hire targeted Month 9. Weekly async brain-dump to the shared knowledge base is a founder calendar block, not an aspiration.",
    trigger:
      "Z unavailable for more than 1 week with no active Advisor engagement in place.",
  },
];

const AUDIT_CADENCE = [
  {
    cadence: "Monthly",
    activity: "Internal review of risk probability and impact shifts",
    owner: "Founders",
  },
  {
    cadence: "Quarterly",
    activity: "Public risk register update published on this page",
    owner: "Ops + Founders",
  },
  {
    cadence: "Annually",
    activity:
      "External advisor review as part of the annual audit retained in /trust/disclosure",
    owner: "External counsel",
  },
];

const NOT_WHAT = [
  {
    label: "Not a disclaimer",
    body: "Push takes responsibility for every risk on this page. Publishing a risk does not transfer it to merchants, creators, or investors — it commits us to the mitigation and the trigger below.",
  },
  {
    label: "Not exhaustive",
    body: "New risks will be added as we discover them. The absence of a risk here is not a claim it does not exist — it is a claim we have not identified it yet. Tell us what we are missing.",
  },
  {
    label: "Not marketing",
    body: "The triggers are contractual commitments to update this page. When a trigger fires, the register is revised within 14 days regardless of whether the news is good, bad, or ambiguous.",
  },
];

/* ─── Page component ───────────────────────────────────────── */
export default function RiskRegisterPage() {
  return (
    <div className="rr-page">
      <RiskReveal />

      {/* ── 1. Hero ────────────────────────────────────────── */}
      <section className="rr-hero" aria-labelledby="rr-hero-heading">
        <div className="rr-container">
          <div className="rr-hero-inner">
            <span className="rr-hero-eyebrow rr-reveal">
              Transparency &middot; Risk Register &middot; Public
            </span>
            <h1
              id="rr-hero-heading"
              className="rr-hero-headline rr-reveal"
              data-delay="1"
            >
              What could kill us.
              <br />
              <em>What we&rsquo;re doing about it.</em>
            </h1>
            <p className="rr-hero-sub rr-reveal" data-delay="2">
              We publish this so merchants, creators, and investors can see what
              we see. Every risk below has a documented mitigation and a trigger
              that will force a public update.
            </p>
            <div className="rr-hero-meta rr-reveal" data-delay="3">
              <span>Vertical AI for Local Commerce</span>
              <span className="rr-hero-dot" aria-hidden="true">
                &bull;
              </span>
              <span>ConversionOracle + DisclosureBot</span>
              <span className="rr-hero-dot" aria-hidden="true">
                &bull;
              </span>
              <span>Software Leverage Ratio</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. §1 Risk cards ──────────────────────────────── */}
      <section className="rr-risks" aria-labelledby="rr-risks-heading">
        <div className="rr-container">
          <div className="rr-section-head rr-reveal">
            <span className="rr-section-num">&sect; 01</span>
            <span className="rr-eyebrow">Nine risks we track</span>
            <h2 id="rr-risks-heading" className="rr-section-title">
              Every risk has a mitigation and a trigger.
            </h2>
            <p className="rr-section-sub">
              Impact bands: Critical (company-ending within 90 days), High
              (material ARR or trust damage), Med (contained to a single cohort
              or quarter), Low (operationally absorbable). Color-coded on the
              left edge: Flag Red for Critical, Champagne Gold for High, Steel
              Blue for Med, Graphite for Low.
            </p>
          </div>

          <div className="rr-risks-grid">
            {RISKS.map((risk, i) => (
              <article
                key={risk.num}
                className="rr-risk rr-reveal"
                data-delay={String((i % 4) + 1)}
                data-impact={risk.impact}
              >
                <div className="rr-risk-head">
                  <span className="rr-risk-num">{risk.num}</span>
                  <h3 className="rr-risk-title">{risk.title}</h3>
                </div>

                <div className="rr-risk-meta">
                  <div className="rr-risk-pill">
                    <span className="rr-risk-pill-label">Probability</span>
                    <span
                      className="rr-risk-pill-value"
                      data-level={risk.probability}
                    >
                      {risk.probability}
                    </span>
                  </div>
                  <div className="rr-risk-pill">
                    <span className="rr-risk-pill-label">Impact</span>
                    <span
                      className="rr-risk-pill-value"
                      data-level={risk.impact}
                    >
                      {risk.impact}
                    </span>
                  </div>
                </div>

                <div className="rr-risk-block">
                  <span className="rr-risk-block-label">Mitigation</span>
                  <p className="rr-risk-block-body">{risk.mitigation}</p>
                </div>

                <div className="rr-risk-trigger">
                  <span className="rr-risk-trigger-label">
                    Trigger for public update
                  </span>
                  <p className="rr-risk-trigger-body">{risk.trigger}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── 3. §2 Audit cadence ───────────────────────────── */}
      <section className="rr-audit" aria-labelledby="rr-audit-heading">
        <div className="rr-container">
          <div className="rr-section-head rr-reveal">
            <span className="rr-section-num">&sect; 02</span>
            <span className="rr-eyebrow">Audit cadence</span>
            <h2 id="rr-audit-heading" className="rr-section-title">
              Three tempos. One chain of evidence.
            </h2>
            <p className="rr-section-sub">
              The register is living. Every cadence below has a named owner and
              a documented artifact &mdash; nothing is reviewed on vibes.
            </p>
          </div>

          <div className="rr-audit-table rr-reveal" data-delay="1">
            <div className="rr-audit-row rr-audit-row--head">
              <span>Cadence</span>
              <span>Activity</span>
              <span>Owner</span>
            </div>
            {AUDIT_CADENCE.map((row) => (
              <div key={row.cadence} className="rr-audit-row">
                <span className="rr-audit-cadence">{row.cadence}</span>
                <span className="rr-audit-activity">{row.activity}</span>
                <span className="rr-audit-owner">{row.owner}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 4. §3 What this page is NOT ───────────────────── */}
      <section className="rr-notwhat" aria-labelledby="rr-notwhat-heading">
        <div className="rr-container">
          <div className="rr-section-head rr-reveal">
            <span className="rr-section-num">&sect; 03</span>
            <span className="rr-eyebrow rr-eyebrow--light">
              What this page is NOT
            </span>
            <h2
              id="rr-notwhat-heading"
              className="rr-section-title rr-section-title--light"
            >
              Three things this register is not.
            </h2>
            <p className="rr-section-sub rr-section-sub--light">
              Transparency-as-differentiator only works if the reader knows
              exactly what they are reading. Here is what this page is not.
            </p>
          </div>

          <div className="rr-notwhat-list">
            {NOT_WHAT.map((item, i) => (
              <article
                key={item.label}
                className="rr-notwhat-item rr-reveal"
                data-delay={String((i % 4) + 1)}
              >
                <span className="rr-notwhat-label">{item.label}</span>
                <p className="rr-notwhat-body">{item.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── 5. §4 CTA ─────────────────────────────────────── */}
      <section className="rr-cta" aria-labelledby="rr-cta-heading">
        <div className="rr-container">
          <div className="rr-cta-inner rr-reveal">
            <span className="rr-eyebrow">Next step</span>
            <h2 id="rr-cta-heading" className="rr-cta-headline">
              Read the mitigations end-to-end.
            </h2>
            <p className="rr-cta-sub">
              The two pages below are the live evidence for the two largest
              risks on this register &mdash; ConversionOracle accuracy and
              DisclosureBot compliance. Both are updated on the cadence above.
            </p>
            <div className="rr-cta-actions">
              <Link
                href="/conversion-oracle/accuracy"
                className="rr-btn rr-btn--primary"
              >
                <span>See ConversionOracle accuracy</span>
                <IconArrowRight className="rr-btn-arrow" />
              </Link>
              <Link href="/trust/disclosure" className="rr-btn rr-btn--ghost">
                <span>See DisclosureBot compliance</span>
                <IconArrowRight className="rr-btn-arrow" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
