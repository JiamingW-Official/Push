import type { Metadata } from "next";
import Link from "next/link";
import DisclosureReveal from "./DisclosureReveal";
import "./disclosure.css";

export const metadata: Metadata = {
  title: "DisclosureBot — Architectural FTC Compliance | Push",
  description:
    "Platform-level AI pre-screen for every creator post. FTC 16 CFR Part 255 compliance enforced at publish time, not self-reported. $1M E&O insurance.",
  robots: { index: true, follow: true },
};

/* ─── Inline SVG icons ──────────────────────────────────────── */
type IconProps = { className?: string };

function IconShield({ className }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

function IconBlock({ className }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="m4.93 4.93 14.14 14.14" />
    </svg>
  );
}

function IconCheck({ className }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

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

const FLOW_STEPS = [
  {
    num: "01",
    label: "Draft",
    title: "Creator drafts in CreatorGPT",
    body: "Every sponsored post begins inside CreatorGPT — Push's in-platform drafting environment. Nothing leaves the workspace without entering the DisclosureBot pipeline.",
  },
  {
    num: "02",
    label: "Pre-screen",
    title: "DisclosureBot screens before publish",
    body: "Missing #ad, #sponsored, or #paidpartnership? Blocked with revision prompt. Disclosure too low in caption? Warned with reposition suggestion. Multi-platform adaptation (IG / TikTok / YouTube conventions differ)? Auto-rewritten per channel. Pass → approve and timestamp the audit log.",
  },
  {
    num: "03",
    label: "Publish",
    title: "Post publishes — or doesn't",
    body: 'If the post fails pre-screen, it does not publish. Full stop. There is no bypass flag, no "override" button, no escalation to a human who can wave it through. The gate is architectural.',
  },
  {
    num: "04",
    label: "Audit trail",
    title: "Immutable Supabase audit log",
    body: "Every decision — pass, block, warn, revision — is written to the disclosure_audits table with cryptographic timestamp. Exportable at any time for FTC inquiry, legal review, or merchant procurement diligence.",
  },
];

const AUDIT_CADENCE = [
  {
    cadence: "Weekly",
    activity: "AI compliance re-check on 10% random sample",
    owner: "Pipeline",
  },
  {
    cadence: "Monthly",
    activity: "Ops + founder review all flagged / borderline cases",
    owner: "Ops",
  },
  {
    cadence: "Quarterly",
    activity: "External legal 1% full human audit + file trail export",
    owner: "External counsel",
  },
  {
    cadence: "Annually",
    activity: "3rd-party compliance audit",
    owner: "External counsel",
  },
];

const INSURANCE_ITEMS = [
  {
    title: "$1M E&O insurance",
    body: "Errors & omissions policy (Hiscox / Chubb) effective Month 6. Covers platform-level compliance failure and creator-originated disclosure violations.",
  },
  {
    title: "$25K legal reserve",
    body: "Dedicated reserve on the Year-1 balance sheet, ring-fenced for regulatory response. Not commingled with operating capital.",
  },
  {
    title: "Merchant indemnification — $10K per incident",
    body: "If an FTC action targets a merchant for a Push-originated post, we indemnify up to $10K per incident: $5K insurance + $5K Push cap. Contractual, not discretionary.",
  },
  {
    title: "FTC response SLA",
    body: "48-hour full audit trail delivery. 72 hours to external counsel engagement. 90-day public transparency report if the matter is material. Written in the merchant MSA.",
  },
];

/* ─── Page component ───────────────────────────────────────── */
export default function DisclosurePage() {
  return (
    <div className="dis-page">
      <DisclosureReveal />

      {/* ── 1. Hero ────────────────────────────────────────── */}
      <section className="dis-hero" aria-labelledby="dis-hero-heading">
        <div className="dis-container">
          <div className="dis-hero-inner">
            <span className="dis-hero-eyebrow dis-reveal">
              Trust &middot; FTC Compliance &middot; Architectural
            </span>
            <h1
              id="dis-hero-heading"
              className="dis-hero-headline dis-reveal"
              data-delay="1"
            >
              DisclosureBot.
              <br />
              <em>Compliance is the architecture, not a policy.</em>
            </h1>
            <p className="dis-hero-sub dis-reveal" data-delay="2">
              Every creator post on Push is AI pre-screened for FTC 16 CFR Part
              255 <span className="dis-mono">#ad</span> disclosure before it
              publishes. Non-compliant posts are blocked, not flagged. The only
              creator platform where disclosure isn&rsquo;t self-reported.
            </p>
            <div className="dis-hero-meta dis-reveal" data-delay="3">
              <span>Vertical AI for Local Commerce</span>
              <span className="dis-hero-dot" aria-hidden="true">
                &bull;
              </span>
              <span>ConversionOracle + DisclosureBot</span>
              <span className="dis-hero-dot" aria-hidden="true">
                &bull;
              </span>
              <span>FTC 16 CFR Part 255</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. §1 The problem ─────────────────────────────── */}
      <section className="dis-problem" aria-labelledby="dis-problem-heading">
        <div className="dis-container">
          <div className="dis-section-head dis-reveal">
            <span className="dis-section-num">&sect; 01</span>
            <span className="dis-eyebrow">The problem</span>
            <h2 id="dis-problem-heading" className="dis-section-title">
              Self-reported disclosure is a lawsuit waiting to happen.
            </h2>
          </div>

          <div className="dis-problem-grid">
            <div className="dis-problem-cases dis-reveal" data-delay="1">
              <article className="dis-case">
                <div className="dis-case-fine">$500K</div>
                <div className="dis-case-meta">
                  <span className="dis-case-name">Glossier</span>
                  <span className="dis-case-year">
                    FTC action &middot; 2021
                  </span>
                </div>
                <p className="dis-case-body">
                  Individual creator disclosures were inconsistent or absent.
                  The platform carried no architectural enforcement.
                </p>
              </article>
              <article className="dis-case">
                <div className="dis-case-fine">$4.2M</div>
                <div className="dis-case-meta">
                  <span className="dis-case-name">Fashion Nova</span>
                  <span className="dis-case-year">
                    FTC action &middot; 2022
                  </span>
                </div>
                <p className="dis-case-body">
                  Self-reported compliance failed at scale. The FTC found a
                  pattern of missing disclosures across hundreds of posts.
                </p>
              </article>
            </div>

            <div className="dis-problem-thesis dis-reveal" data-delay="2">
              <p className="dis-problem-body">
                Every other creator platform &mdash; Aspire, Grin, Captiv8, Fohr
                &mdash; relies on{" "}
                <strong>creator self-reporting plus monthly spot audits</strong>
                . That posture worked in 2018. In 2026, it is systemic risk at
                the platform level for every SMB using them.
              </p>
              <p className="dis-problem-body">
                Self-reporting assumes good-faith creator behavior across
                thousands of posts. The FTC has made clear that the
                <em> brand</em> and the <em>platform</em> are liable when that
                assumption fails. Post-hoc audits find violations after the
                lawsuit is already in motion.
              </p>
              <div className="dis-problem-callout">
                <span className="dis-problem-callout-label">
                  Architectural gap
                </span>
                <p>
                  The entire creator-marketing stack is built on a compliance
                  model the FTC has explicitly warned is insufficient.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 3. §2 DisclosureBot architecture ──────────────── */}
      <section
        className="dis-architecture"
        aria-labelledby="dis-architecture-heading"
      >
        <div className="dis-container">
          <div className="dis-section-head dis-reveal">
            <span className="dis-section-num">&sect; 02</span>
            <span className="dis-eyebrow dis-eyebrow--light">
              DisclosureBot architecture
            </span>
            <h2
              id="dis-architecture-heading"
              className="dis-section-title dis-section-title--light"
            >
              Four steps. One gate. Zero bypass.
            </h2>
            <p className="dis-section-sub dis-section-sub--light">
              DisclosureBot sits between CreatorGPT and every publish endpoint.
              A post either satisfies FTC 16 CFR Part 255 at the API layer, or
              it never goes out.
            </p>
          </div>

          <div className="dis-flow">
            {FLOW_STEPS.map((step, i) => (
              <article
                key={step.num}
                className="dis-flow-step dis-reveal"
                data-delay={String((i % 4) + 1)}
              >
                <div className="dis-flow-step-head">
                  <span className="dis-flow-num">{step.num}</span>
                  <span className="dis-flow-label">{step.label}</span>
                </div>
                <h3 className="dis-flow-title">{step.title}</h3>
                <p className="dis-flow-body">{step.body}</p>
              </article>
            ))}
          </div>

          <div className="dis-tos dis-reveal" data-delay="4">
            <div className="dis-tos-icon" aria-hidden="true">
              <IconBlock />
            </div>
            <div className="dis-tos-text">
              <span className="dis-tos-label">
                Creator ToS &middot; Hard clause
              </span>
              <p>
                Bypass DisclosureBot = forfeit payout <strong>+</strong> tier
                demotion (first offense) <strong>+</strong> platform ban (second
                offense). This is a contractual term, not a guideline.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 4. §3 Audit cadence ───────────────────────────── */}
      <section className="dis-audit" aria-labelledby="dis-audit-heading">
        <div className="dis-container">
          <div className="dis-section-head dis-reveal">
            <span className="dis-section-num">&sect; 03</span>
            <span className="dis-eyebrow">Audit cadence</span>
            <h2 id="dis-audit-heading" className="dis-section-title">
              Four tempos. Four owners. One chain of evidence.
            </h2>
            <p className="dis-section-sub">
              Real-time enforcement is the floor. On top of it, a layered audit
              cadence ensures the pipeline itself is being checked &mdash; by
              ops, by counsel, by an independent 3rd party.
            </p>
          </div>

          <div className="dis-audit-table dis-reveal" data-delay="1">
            <div className="dis-audit-row dis-audit-row--head">
              <span>Cadence</span>
              <span>Activity</span>
              <span>Owner</span>
            </div>
            {AUDIT_CADENCE.map((row) => (
              <div key={row.cadence} className="dis-audit-row">
                <span className="dis-audit-cadence">{row.cadence}</span>
                <span className="dis-audit-activity">{row.activity}</span>
                <span className="dis-audit-owner">{row.owner}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 5. §4 Insurance + reserve + response ──────────── */}
      <section
        className="dis-insurance"
        aria-labelledby="dis-insurance-heading"
      >
        <div className="dis-container">
          <div className="dis-section-head dis-reveal">
            <span className="dis-section-num">&sect; 04</span>
            <span className="dis-eyebrow">Insurance, reserve, response</span>
            <h2 id="dis-insurance-heading" className="dis-section-title">
              Architecture is the gate. Insurance is the backstop.
            </h2>
            <p className="dis-section-sub">
              Even architectural compliance needs a financial backstop. The
              merchant&rsquo;s downside is bounded in writing &mdash; not in a
              reassuring blog post.
            </p>
          </div>

          <div className="dis-insurance-grid">
            {INSURANCE_ITEMS.map((item, i) => (
              <article
                key={item.title}
                className="dis-insurance-item dis-reveal"
                data-delay={String((i % 4) + 1)}
              >
                <div className="dis-insurance-icon" aria-hidden="true">
                  <IconShield />
                </div>
                <h3 className="dis-insurance-title">{item.title}</h3>
                <p className="dis-insurance-body">{item.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── 6. §5 Why this matters for enterprise procurement */}
      <section
        className="dis-procurement"
        aria-labelledby="dis-procurement-heading"
      >
        <div className="dis-container">
          <div className="dis-section-head dis-reveal">
            <span className="dis-section-num">&sect; 05</span>
            <span className="dis-eyebrow dis-eyebrow--light">
              Why it matters for enterprise procurement
            </span>
            <h2
              id="dis-procurement-heading"
              className="dis-section-title dis-section-title--light"
            >
              Legal procurement buys risk reduction, not feature parity.
            </h2>
          </div>

          <div className="dis-procurement-grid">
            <div className="dis-procurement-points dis-reveal" data-delay="1">
              <div className="dis-procurement-point">
                <div className="dis-procurement-check" aria-hidden="true">
                  <IconCheck />
                </div>
                <p>
                  Platform-level architectural compliance is a differentiator in
                  multi-location merchant sales. Every legal procurement team
                  asks one question first:{" "}
                  <em>where is the liability allocated?</em>
                </p>
              </div>
              <div className="dis-procurement-point">
                <div className="dis-procurement-check" aria-hidden="true">
                  <IconCheck />
                </div>
                <p>
                  Push is the only creator platform where FTC compliance lives
                  in the architecture, not in individual creator behavior. That
                  position is not a marketing claim &mdash; it is a code-level
                  fact, auditable on demand.
                </p>
              </div>
              <div className="dis-procurement-point">
                <div className="dis-procurement-check" aria-hidden="true">
                  <IconCheck />
                </div>
                <p>
                  Vertical AI for Local Commerce means every layer is owned:
                  ConversionOracle for verification, DisclosureBot for
                  compliance, audit trail for evidence. No third-party
                  dependency in the critical path.
                </p>
              </div>
            </div>

            <figure className="dis-pullquote dis-reveal" data-delay="2">
              <blockquote>
                <p>
                  &ldquo;Fohr and Aspire hope creators disclose. DisclosureBot
                  doesn&rsquo;t publish posts that don&rsquo;t.&rdquo;
                </p>
              </blockquote>
              <figcaption>Push &middot; platform thesis</figcaption>
            </figure>
          </div>
        </div>
      </section>

      {/* ── 7. §6 CTA ─────────────────────────────────────── */}
      <section className="dis-cta" aria-labelledby="dis-cta-heading">
        <div className="dis-container">
          <div className="dis-cta-inner dis-reveal">
            <span className="dis-eyebrow">Next step</span>
            <h2 id="dis-cta-heading" className="dis-cta-headline">
              Ready to see architectural compliance in production?
            </h2>
            <p className="dis-cta-sub">
              The $0 Pilot lets a merchant test the full stack &mdash;
              ConversionOracle, DisclosureBot, audit trail &mdash; on live
              campaigns before any commitment.
            </p>
            <div className="dis-cta-actions">
              <Link href="/merchant/pilot" className="dis-btn dis-btn--primary">
                <span>Apply for $0 Pilot</span>
                <IconArrowRight className="dis-btn-arrow" />
              </Link>
              <Link
                href="/conversion-oracle"
                className="dis-btn dis-btn--ghost"
              >
                <span>See ConversionOracle (our AI moat)</span>
                <IconArrowRight className="dis-btn-arrow" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
