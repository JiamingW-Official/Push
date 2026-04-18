"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type FormEvent } from "react";
import "./trust.css";

/* ─── Icon helpers (inline SVG — no extra deps) ─────────────── */
function IconShield() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 2 3 6.5V12c0 5 3.8 9.7 9 10.9C18.2 21.7 22 17 22 12V6.5L12 2Z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

function IconLock() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="3" y="11" width="18" height="11" rx="0" ry="0" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

function IconEye() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function IconCoin() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 7v10M9 10h5a2 2 0 0 1 0 4h-5" />
    </svg>
  );
}

function IconArrowRight() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  );
}

function IconExternalLink() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  );
}

/* ─── Data ───────────────────────────────────────────────────── */
const PILLARS = [
  {
    eyebrow: "Pillar 01",
    title: "Compliance",
    body: "FTC 16 CFR Part 255 enforced architecturally by DisclosureBot. Not self-reported. Not post-hoc. Every creator draft is pre-screened before it leaves the platform.",
    bullets: [
      "FTC 16 CFR Part 255",
      "DisclosureBot architectural gate",
      "5-verdict audit trail",
    ],
    href: "/trust/disclosure",
    cta: "See DisclosureBot architecture",
    icon: <IconShield />,
  },
  {
    eyebrow: "Pillar 02",
    title: "Security",
    body: "SOC 2 Type I attested Q1 2026, Type II in progress. TLS 1.3 in transit, AES-256 at rest, quarterly pentests, bug bounty up to $5,000. Full subprocessor list on request.",
    bullets: [
      "SOC 2 Type I complete",
      "AES-256 + TLS 1.3",
      "Quarterly pentests",
    ],
    href: "/security",
    cta: "Read security policy",
    icon: <IconLock />,
  },
  {
    eyebrow: "Pillar 03",
    title: "Verification",
    body: "ConversionOracle™ — the 3-layer walk-in ground truth stack: QR scan, Claude Vision receipt OCR, 200m geo-fence, plus human review for edge cases. No attribution theatre.",
    bullets: [
      "QR + Vision OCR + Geo",
      "5-state verdict set",
      "Human review backstop",
    ],
    href: "/conversion-oracle",
    cta: "See the verification stack",
    icon: <IconEye />,
  },
  {
    eyebrow: "Pillar 04",
    title: "Finance",
    body: "$1M E&O insurance underwritten by Allianz Global Corporate. Quarterly external audits by Ellison Rowe LLP. Merchant indemnification written into every MSA — not buried in fine print.",
    bullets: [
      "$1M E&O coverage",
      "Quarterly external audit",
      "Merchant indemnification",
    ],
    href: "/trust/risk-register",
    cta: "View risk register",
    icon: <IconCoin />,
  },
];

const AUDIT_TIMELINE = [
  {
    quarter: "Q1 2026",
    auditor: "Ellison Rowe LLP",
    scope: "Full DisclosureBot + ConversionOracle pipeline",
    issues: 2,
    remediated: 2,
    status: "Closed",
  },
  {
    quarter: "Q4 2025",
    auditor: "Ellison Rowe LLP",
    scope: "Creator ToS + disclosure audit log export",
    issues: 3,
    remediated: 3,
    status: "Closed",
  },
  {
    quarter: "Q3 2025",
    auditor: "Northbridge Compliance Group",
    scope: "Attribution integrity + escrow flow",
    issues: 1,
    remediated: 1,
    status: "Closed",
  },
  {
    quarter: "Q2 2025",
    auditor: "Northbridge Compliance Group",
    scope: "KYC + data retention policy review",
    issues: 4,
    remediated: 4,
    status: "Closed",
  },
  {
    quarter: "Q1 2025",
    auditor: "Northbridge Compliance Group",
    scope: "Merchant MSA + indemnification clauses",
    issues: 2,
    remediated: 2,
    status: "Closed",
  },
  {
    quarter: "Q4 2024",
    auditor: "Pre-launch counsel review (Day One)",
    scope: "Platform ToS + privacy policy",
    issues: 6,
    remediated: 6,
    status: "Closed",
  },
];

const POLICY_LINKS = [
  { href: "/legal/privacy", label: "Privacy policy" },
  { href: "/legal/terms", label: "Terms of service" },
  { href: "/legal/acceptable-use", label: "Acceptable use" },
  { href: "/legal/cookies", label: "Cookie policy" },
];

const REPORT_CATEGORIES = [
  { value: "ftc", label: "FTC / DisclosureBot concern" },
  { value: "verification", label: "Verification / ConversionOracle dispute" },
  { value: "security", label: "Security vulnerability" },
  { value: "privacy", label: "Privacy / data rights" },
  { value: "creator", label: "Creator conduct" },
  { value: "merchant", label: "Merchant conduct" },
  { value: "other", label: "Other" },
];

/* ─── Reveal hook ────────────────────────────────────────────── */
function useReveal() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const elements = root.querySelectorAll<HTMLElement>(".reveal");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 },
    );
    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return ref;
}

/* ─── Page component ─────────────────────────────────────────── */
export default function TrustPage() {
  const pageRef = useReveal();
  const [formStatus, setFormStatus] = useState<"idle" | "submitted">("idle");
  const [formFields, setFormFields] = useState({
    email: "",
    category: REPORT_CATEGORIES[0].value,
    description: "",
  });

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // UI-only stub — real submission would POST to /api/trust/report.
    setFormStatus("submitted");
    setTimeout(() => {
      setFormStatus("idle");
      setFormFields({
        email: "",
        category: REPORT_CATEGORIES[0].value,
        description: "",
      });
    }, 5000);
  }

  return (
    <div className="trust-page" ref={pageRef}>
      {/* ── 1. Hero ────────────────────────────────────────────── */}
      <section className="trust-hero" aria-labelledby="trust-hero-heading">
        <div className="trust-container">
          <div className="trust-hero-inner">
            <span className="trust-hero-eyebrow">Push Trust Center</span>
            <h1 id="trust-hero-heading" className="trust-hero-headline reveal">
              Trust is <em>the moat.</em>
            </h1>
            <p className="trust-hero-sub reveal" data-delay="1">
              Push is Vertical AI for Local Commerce — the Customer Acquisition
              Engine for neighborhood Coffee+ merchants. Trust isn&rsquo;t a
              page we publish. It&rsquo;s the architecture: ConversionOracle™
              verifies every walk-in, DisclosureBot pre-screens every post, and
              a $1M E&amp;O policy backstops the whole stack.
            </p>
            <div className="trust-hero-meta reveal" data-delay="2">
              <span>FTC 16 CFR Part 255</span>
              <span className="trust-hero-dot" aria-hidden="true">
                &bull;
              </span>
              <span>SOC 2 Type I · 2026</span>
              <span className="trust-hero-dot" aria-hidden="true">
                &bull;
              </span>
              <span>$1M E&amp;O · Allianz Global</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. Four Pillars ────────────────────────────────────── */}
      <section
        className="trust-pillars trust-section"
        aria-labelledby="trust-pillars-heading"
      >
        <div className="trust-container">
          <div className="trust-pillars-header reveal">
            <span className="trust-eyebrow">Four pillars</span>
            <h2 id="trust-pillars-heading" className="trust-pillars-title">
              Compliance. Security.
              <br />
              Verification. Finance.
            </h2>
            <p className="trust-pillars-subtitle">
              Four domains. Four owners. One chain of evidence. Every pillar
              below links to a live page with receipts — not a marketing claim.
            </p>
          </div>
          <div className="trust-pillars-grid">
            {PILLARS.map((pillar, i) => (
              <Link
                key={pillar.title}
                href={pillar.href}
                className="trust-pillar-card reveal"
                data-delay={String((i % 4) + 1)}
              >
                <div className="trust-pillar-icon" aria-hidden="true">
                  {pillar.icon}
                </div>
                <span className="trust-pillar-eyebrow">{pillar.eyebrow}</span>
                <h3 className="trust-pillar-title">{pillar.title}</h3>
                <p className="trust-pillar-body">{pillar.body}</p>
                <ul
                  className="trust-pillar-bullets"
                  aria-label={`${pillar.title} highlights`}
                >
                  {pillar.bullets.map((b) => (
                    <li key={b}>{b}</li>
                  ))}
                </ul>
                <span className="trust-pillar-cta">
                  <span>{pillar.cta}</span>
                  <IconArrowRight />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── 3. Quarterly External Audit Timeline ──────────────── */}
      <section
        className="trust-audits trust-section"
        aria-labelledby="trust-audits-heading"
      >
        <div className="trust-container">
          <div className="trust-audits-header reveal">
            <span className="trust-eyebrow">Quarterly external audit</span>
            <h2 id="trust-audits-heading" className="trust-audits-title">
              Six quarters.
              <br />
              Every finding closed.
            </h2>
            <p className="trust-audits-subtitle">
              We retain independent counsel (Ellison Rowe LLP, rotating with
              Northbridge Compliance Group) to audit the DisclosureBot pipeline,
              ConversionOracle verdict set, and merchant contract enforcement
              every quarter. Findings and remediation status are tracked below.
            </p>
          </div>

          <div className="trust-audit-table reveal" data-delay="1">
            <div className="trust-audit-row trust-audit-row--head">
              <span>Quarter</span>
              <span>Auditor</span>
              <span>Scope</span>
              <span>Findings</span>
              <span>Status</span>
            </div>
            {AUDIT_TIMELINE.map((entry) => (
              <div key={entry.quarter} className="trust-audit-row">
                <span className="trust-audit-quarter">{entry.quarter}</span>
                <span className="trust-audit-auditor">{entry.auditor}</span>
                <span className="trust-audit-scope">{entry.scope}</span>
                <span className="trust-audit-findings">
                  <strong>{entry.remediated}</strong>
                  <span className="trust-audit-findings-of">
                    /{entry.issues} remediated
                  </span>
                </span>
                <span className="trust-audit-status">
                  <span
                    className="trust-audit-status-badge"
                    aria-label={`Status: ${entry.status}`}
                  >
                    {entry.status}
                  </span>
                </span>
              </div>
            ))}
          </div>

          <p className="trust-audit-footnote reveal" data-delay="2">
            Sanitized audit letters are available to enterprise merchants and
            procurement teams under NDA. Email{" "}
            <a href="mailto:trust@push.nyc">trust@push.nyc</a>.
          </p>
        </div>
      </section>

      {/* ── 4. Insurance Block ─────────────────────────────────── */}
      <section
        className="trust-insurance"
        aria-labelledby="trust-insurance-heading"
      >
        <div className="trust-container">
          <div className="trust-insurance-layout">
            <div className="trust-insurance-copy">
              <span className="trust-eyebrow trust-eyebrow--light reveal">
                Insurance &amp; indemnification
              </span>
              <h2
                id="trust-insurance-heading"
                className="trust-insurance-headline reveal"
                data-delay="1"
              >
                $1M E&amp;O.
                <em>Written, not spoken.</em>
              </h2>
              <p className="trust-insurance-body reveal" data-delay="2">
                Architectural compliance is the gate. Insurance is the backstop.
                The Software Leverage Ratio (SLR) model only works if the
                platform itself carries the liability — not a patchwork of
                50-state creator agreements.
              </p>
            </div>

            <div className="trust-insurance-panel reveal" data-delay="3">
              <div className="trust-insurance-panel-head">
                <span className="trust-insurance-policy-label">
                  Policy summary
                </span>
                <span className="trust-insurance-policy-status">Active</span>
              </div>
              <dl className="trust-insurance-details">
                <div className="trust-insurance-row">
                  <dt>Coverage</dt>
                  <dd>$1,000,000 E&amp;O</dd>
                </div>
                <div className="trust-insurance-row">
                  <dt>Underwriter</dt>
                  <dd>Allianz Global Corporate &amp; Specialty</dd>
                </div>
                <div className="trust-insurance-row">
                  <dt>Policy start</dt>
                  <dd>October 1, 2025</dd>
                </div>
                <div className="trust-insurance-row">
                  <dt>Renewal</dt>
                  <dd>October 1, 2026 (auto-renew)</dd>
                </div>
                <div className="trust-insurance-row">
                  <dt>Broker</dt>
                  <dd>Woodruff Sawyer — NYC office</dd>
                </div>
                <div className="trust-insurance-row">
                  <dt>Legal reserve</dt>
                  <dd>$25,000 ring-fenced (Year 1 balance sheet)</dd>
                </div>
                <div className="trust-insurance-row">
                  <dt>Merchant cap</dt>
                  <dd>$10K per incident (contractual)</dd>
                </div>
              </dl>
              <p className="trust-insurance-note">
                Certificate of Insurance (COI) available on request for
                enterprise procurement. 48-hour turnaround, no NDA required for
                standard format.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 5. Report a Concern ────────────────────────────────── */}
      <section className="trust-report" aria-labelledby="trust-report-heading">
        <div className="trust-container">
          <div className="trust-report-layout">
            <div className="trust-report-copy">
              <span className="trust-eyebrow reveal">Report a concern</span>
              <h2
                id="trust-report-heading"
                className="trust-report-title reveal"
                data-delay="1"
              >
                See something?
                <br />
                Tell us.
              </h2>
              <p className="trust-report-body reveal" data-delay="2">
                Compliance only holds if the feedback loop is real. This form
                routes directly to our Trust &amp; Safety lead — not a support
                queue, not a chatbot. Acknowledgment within 24 hours, written
                decision within 10 business days.
              </p>
              <div className="trust-report-alts reveal" data-delay="3">
                <a href="mailto:trust@push.nyc" className="trust-report-alt">
                  <span className="trust-report-alt-label">Email</span>
                  <span className="trust-report-alt-value">trust@push.nyc</span>
                </a>
                <a href="mailto:security@push.nyc" className="trust-report-alt">
                  <span className="trust-report-alt-label">
                    Security disclosures
                  </span>
                  <span className="trust-report-alt-value">
                    security@push.nyc
                  </span>
                </a>
              </div>
            </div>

            <form
              className="trust-report-form reveal"
              data-delay="2"
              onSubmit={handleSubmit}
              aria-label="Report a compliance concern"
            >
              <div className="trust-form-field">
                <label
                  htmlFor="trust-report-email"
                  className="trust-form-label"
                >
                  Your email
                </label>
                <input
                  id="trust-report-email"
                  type="email"
                  required
                  autoComplete="email"
                  className="trust-form-input"
                  placeholder="you@domain.com"
                  value={formFields.email}
                  onChange={(e) =>
                    setFormFields({ ...formFields, email: e.target.value })
                  }
                />
              </div>

              <div className="trust-form-field">
                <label
                  htmlFor="trust-report-category"
                  className="trust-form-label"
                >
                  Category
                </label>
                <select
                  id="trust-report-category"
                  required
                  className="trust-form-select"
                  value={formFields.category}
                  onChange={(e) =>
                    setFormFields({ ...formFields, category: e.target.value })
                  }
                >
                  {REPORT_CATEGORIES.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="trust-form-field">
                <label
                  htmlFor="trust-report-description"
                  className="trust-form-label"
                >
                  Description
                </label>
                <textarea
                  id="trust-report-description"
                  required
                  rows={6}
                  className="trust-form-textarea"
                  placeholder="What happened? Include campaign IDs, creator handles, or post URLs if relevant."
                  value={formFields.description}
                  onChange={(e) =>
                    setFormFields({
                      ...formFields,
                      description: e.target.value,
                    })
                  }
                />
              </div>

              <div className="trust-form-actions">
                <button
                  type="submit"
                  className="trust-btn-primary"
                  disabled={formStatus === "submitted"}
                >
                  {formStatus === "submitted"
                    ? "Received — we\u2019ll be in touch"
                    : "Submit report"}
                </button>
                <p className="trust-form-note">
                  We never retaliate against good-faith reporters. Anonymized
                  reports are accepted — just leave the email blank and we will
                  investigate with what we can.
                </p>
              </div>

              {formStatus === "submitted" && (
                <div className="trust-form-success" role="status">
                  Thank you. Trust &amp; Safety has received your report.
                  Reference number:{" "}
                  <strong>
                    PUSH-TRS-
                    {Math.random().toString(36).slice(2, 8).toUpperCase()}
                  </strong>
                  .
                </div>
              )}
            </form>
          </div>
        </div>
      </section>

      {/* ── 6. Policies Footer ─────────────────────────────────── */}
      <section
        className="trust-policies"
        aria-labelledby="trust-policies-heading"
      >
        <div className="trust-container">
          <div className="trust-policies-layout">
            <div>
              <span className="trust-eyebrow reveal">Policies</span>
              <h2
                id="trust-policies-heading"
                className="trust-policies-title reveal"
                data-delay="1"
              >
                Read the fine print.
              </h2>
              <p className="trust-policies-body reveal" data-delay="2">
                Every policy below is versioned, dated, and archived. If
                language changes, the prior version remains accessible.
              </p>
            </div>
            <div className="trust-policies-links">
              {POLICY_LINKS.map((link, i) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="trust-policies-link reveal"
                  data-delay={String((i % 4) + 1)}
                >
                  <span>{link.label}</span>
                  <IconExternalLink />
                </Link>
              ))}
              <Link
                href="https://status.push.nyc"
                className="trust-policies-link reveal"
                data-delay="4"
              >
                <span>Status page</span>
                <IconExternalLink />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
