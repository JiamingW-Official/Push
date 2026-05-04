import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Do Not Sell or Share My Personal Information — Push",
  description:
    "California residents can opt out of the sale or sharing of their personal information under CCPA § 1798.120 and § 1798.135.",
};

const TOC = [
  { id: "s1", label: "01 / What Push Sells" },
  { id: "s2", label: "02 / How to Opt Out" },
  { id: "s3", label: "03 / Authorized Agents" },
  { id: "s4", label: "04 / Response Time" },
  { id: "s5", label: "05 / No Retaliation" },
  { id: "s6", label: "06 / Contact" },
  { id: "s7", label: "07 / Submit Request" },
];

function SectionH2({
  id,
  num,
  children,
}: {
  id: string;
  num: string;
  children: React.ReactNode;
}) {
  return (
    <h2 id={id} className="legal-section-h2">
      <span className="legal-section-num">{num}</span>
      {children}
    </h2>
  );
}

function Divider() {
  return <hr className="legal-divider" />;
}

export default function DoNotSellPage() {
  return (
    <>
      {/* ── HERO ─────────────────────────────────────────────────── */}
      <section className="legal-hero">
        <div className="legal-hero__inner">
          <Link href="/legal" className="legal-hero__back">
            &larr; Legal Hub
          </Link>
          <p className="legal-hero__eyebrow">(CALIFORNIA PRIVACY RIGHTS)</p>
          <h1 className="legal-hero__h1" style={{ maxWidth: "16ch" }}>
            Do Not Sell or Share My Personal Information
          </h1>
          <div className="legal-hero__meta">
            <span className="legal-hero__badge legal-hero__badge--strong">
              Last updated: April 20, 2026
            </span>
            <span className="legal-hero__sep">/</span>
            <span className="legal-hero__badge">
              CCPA § 1798.120 / § 1798.135
            </span>
          </div>
        </div>
      </section>

      {/* ── DOCUMENT LAYOUT ──────────────────────────────────────── */}
      <div className="legal-doc-wrap">
        {/* LEFT — sticky TOC */}
        <aside className="legal-toc">
          <span className="legal-toc__label">(ON THIS PAGE)</span>
          <ul className="legal-toc__list">
            {TOC.map((item) => (
              <li key={item.id} className="legal-toc__item">
                <a href={`#${item.id}`} className="legal-toc__link">
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </aside>

        {/* RIGHT — article */}
        <article className="legal-article">
          {/* Summary notice — positive */}
          <div className="legal-notice legal-notice--positive">
            <span className="legal-notice__eyebrow">Summary</span>
            <p>
              Under the California Consumer Privacy Act (CCPA) as amended by the
              California Privacy Rights Act (CPRA), California residents have
              the right to opt out of the <strong>sale</strong> or{" "}
              <strong>sharing</strong> of their personal information. Push sells
              aggregated, de-identified attribution data to enterprise partners
              only when a consumer has explicitly opted into Tier 3 Commercial
              consent. You can revoke that consent at any time using the form
              below or by emailing{" "}
              <a href="mailto:privacy@pushnyc.co">privacy@pushnyc.co</a>.
            </p>
          </div>

          {/* ── 1. What Push "Sells" ── */}
          <SectionH2 id="s1" num="01 /">
            What Push &ldquo;sells&rdquo; under CCPA
          </SectionH2>
          <p>
            CCPA defines &ldquo;sale&rdquo; broadly to include sharing personal
            information for monetary or other valuable consideration. Push only
            shares the following when a consumer has selected Tier 3 Commercial
            consent on a scan landing page:
          </p>
          <ul>
            <li>
              Aggregated visit-to-redemption patterns,{" "}
              <strong>k&nbsp;≥&nbsp;5</strong> neighborhood aggregation (we
              never release individual rows).
            </li>
            <li>
              Hashed product-category + time-of-day co-occurrences, used by
              enterprise partners for market research.
            </li>
            <li>
              Anonymized derived features (weather-by-category lift
              coefficients, hour-of-week demand curves) computed from the{" "}
              <code>push_transactions</code> table.
            </li>
          </ul>
          <p>
            We <strong>never</strong> sell raw GPS coordinates, device IDs,
            email addresses, demographic ethnicity buckets, or any row that
            could re-identify an individual consumer.
          </p>

          <Divider />

          {/* ── 2. How to Opt Out ── */}
          <SectionH2 id="s2" num="02 /">
            How to opt out
          </SectionH2>
          <p>You have three options:</p>
          <ol>
            <li>
              <strong>Change your consent tier in-app.</strong> Visit{" "}
              <Link href="/my-privacy">/my-privacy</Link> and move your consent
              from Tier 3 down to Tier 1 or 2. Downgrades take effect
              immediately; existing Tier-3 rows are excluded from any future
              data-licensing run.
            </li>
            <li>
              <strong>File a CCPA Do-Not-Sell request.</strong> Use the{" "}
              <Link href="/my-privacy#dsar">privacy portal</Link> and select
              &ldquo;Opt Out of Sale.&rdquo; We confirm within 15 business days
              and resolve within the statutory 45-day window.
            </li>
            <li>
              <strong>Email us.</strong> Send a request from the email address
              on your Push account to{" "}
              <a href="mailto:privacy@pushnyc.co?subject=Do%20Not%20Sell%20-%20CCPA%20Opt-Out">
                privacy@pushnyc.co
              </a>
              . Include the phrase &ldquo;Do Not Sell&rdquo; in the subject line
              for auto-routing.
            </li>
          </ol>

          <Divider />

          {/* ── 3. Authorized Agents ── */}
          <SectionH2 id="s3" num="03 /">
            Authorized agents
          </SectionH2>
          <p>
            California consumers may designate an authorized agent to act on
            their behalf. We verify agent requests by requiring (a) written
            permission signed by the consumer, and (b) identity verification of
            the consumer before releasing or acting on the request.
          </p>

          <Divider />

          {/* ── 4. Response Time ── */}
          <SectionH2 id="s4" num="04 /">
            Our response time
          </SectionH2>
          <p>
            We confirm receipt of every Do-Not-Sell request within{" "}
            <strong>15 business days</strong>. We act on valid requests within{" "}
            <strong>45 calendar days</strong>, with one optional 45-day
            extension for complex requests (we will notify you if the extension
            is used). No fee is charged for the first two requests in a 12-month
            period.
          </p>

          <Divider />

          {/* ── 5. No Retaliation ── */}
          <SectionH2 id="s5" num="05 /">
            No retaliation
          </SectionH2>
          <p>
            We do not charge different prices, deny service, or offer a lower
            quality of service because you exercised your CCPA rights. If you
            opt out of Tier 3 Commercial data-licensing, you forfeit any
            one-time $2 bonus associated with that tier, but all other Push
            features continue unchanged.
          </p>

          <Divider />

          {/* ── 6. Contact ── */}
          <SectionH2 id="s6" num="06 /">
            Contact
          </SectionH2>
          <p>
            Questions? Email{" "}
            <a href="mailto:privacy@pushnyc.co">privacy@pushnyc.co</a> or write
            to Push NYC, Inc., Attn: Privacy, 28 West 23rd St, New York, NY
            10010.
          </p>

          <Divider />

          {/* ── 7. Submit Request Form ── */}
          <SectionH2 id="s7" num="07 /">
            Submit a Do-Not-Sell Request
          </SectionH2>
          <p>
            Complete this form to submit your CCPA opt-out request directly. All
            fields are required. We will confirm receipt within 15 business
            days.
          </p>

          <form action="/api/privacy/dsar" method="POST" className="legal-form">
            {/* Name */}
            <div className="legal-form__field">
              <label htmlFor="dns-name" className="legal-form__label">
                Full Name
              </label>
              <input
                id="dns-name"
                name="full_name"
                type="text"
                required
                placeholder="Jane Smith"
                className="legal-form__input"
              />
            </div>

            {/* Email */}
            <div className="legal-form__field">
              <label htmlFor="dns-email" className="legal-form__label">
                Email Address on your Push account
              </label>
              <input
                id="dns-email"
                name="email"
                type="email"
                required
                placeholder="jane@example.com"
                className="legal-form__input"
              />
            </div>

            {/* Request type */}
            <div className="legal-form__field">
              <label htmlFor="dns-type" className="legal-form__label">
                Request Type
              </label>
              <select
                id="dns-type"
                name="request_type"
                required
                className="legal-form__select"
              >
                <option value="">Select a request type&hellip;</option>
                <option value="do_not_sell">
                  Opt Out of Sale / Sharing (CCPA)
                </option>
                <option value="delete">Delete My Personal Information</option>
                <option value="access">Access / Know What Data You Have</option>
                <option value="correct">Correct Inaccurate Data</option>
                <option value="portability">Data Portability</option>
              </select>
            </div>

            {/* Additional info */}
            <div className="legal-form__field">
              <label htmlFor="dns-notes" className="legal-form__label">
                Additional Information{" "}
                <span
                  style={{
                    fontWeight: 400,
                    textTransform: "none",
                    letterSpacing: 0,
                  }}
                >
                  (optional)
                </span>
              </label>
              <textarea
                id="dns-notes"
                name="notes"
                rows={4}
                placeholder="Any additional context that helps us process your request&hellip;"
                className="legal-form__textarea"
              />
            </div>

            {/* Identity verification notice */}
            <p className="legal-form__hint">
              We are required by CCPA to verify your identity before processing
              this request. We will email the address above with a verification
              link. Requests from unverified submitters cannot be actioned.
            </p>

            {/* Submit */}
            <div>
              <button type="submit" className="legal-btn-primary">
                Submit Request
              </button>
            </div>
          </form>

          {/* Back to Privacy Policy */}
          <p style={{ marginTop: "40px" }}>
            <Link href="/legal/privacy">
              &larr; Back to full Privacy Policy
            </Link>
          </p>
        </article>
      </div>

      {/* ── DOCUMENT FOOTER BAR ──────────────────────────────────── */}
      <div className="legal-footer-bar">
        <div className="legal-footer-bar__inner">
          <p className="legal-footer-bar__text">
            Questions?{" "}
            <a href="mailto:privacy@pushnyc.co">privacy@pushnyc.co</a>
          </p>
          <div className="legal-footer-bar__actions">
            <Link href="/legal" className="legal-footer-bar__back-link">
              &larr; Legal Hub
            </Link>
            <button className="legal-btn-ghost">Download PDF</button>
          </div>
        </div>
      </div>
    </>
  );
}
