import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Do Not Sell or Share My Personal Information — Push",
  description:
    "California residents can opt out of the sale or sharing of their personal information under CCPA § 1798.120 and § 1798.135.",
};

export default function DoNotSellPage() {
  return (
    <>
      <header className="legal-header">
        <p className="legal-header__eyebrow">Legal / Privacy Rights</p>
        <h1 className="legal-header__title">
          Do Not Sell or Share My Personal Information
        </h1>
        <div className="legal-header__meta">
          <span className="legal-header__meta-item">
            <strong>Last updated:</strong>&nbsp;April 20, 2026
          </span>
          <span className="legal-header__meta-divider" aria-hidden="true" />
          <span className="legal-header__meta-item">
            CCPA § 1798.120 / § 1798.135
          </span>
        </div>
      </header>

      <div className="legal-infobox">
        <p className="legal-infobox__title">Summary</p>
        <p>
          Under the California Consumer Privacy Act (CCPA) as amended by the
          California Privacy Rights Act (CPRA), California residents have the
          right to opt out of the <strong>sale</strong> or{" "}
          <strong>sharing</strong> of their personal information. Push sells
          aggregated, de-identified attribution data to enterprise partners only
          when a consumer has explicitly opted into Tier 3 Commercial consent.
          You can revoke that consent at any time using the form below or by
          emailing{" "}
          <a
            href="mailto:privacy@pushnyc.co"
            style={{ color: "var(--tertiary)" }}
          >
            privacy@pushnyc.co
          </a>
          .
        </p>
      </div>

      <h2 id="what-we-sell" className="legal-section-heading">
        <span className="legal-section-heading__number">01 /</span>
        What Push "sells" under CCPA
      </h2>
      <p>
        CCPA defines "sale" broadly to include sharing personal information for
        monetary or other valuable consideration. Push only shares the following
        when a consumer has selected Tier 3 Commercial consent on a scan landing
        page:
      </p>
      <ul>
        <li>
          Aggregated visit-to-redemption patterns, <strong>k ≥ 5</strong>{" "}
          neighborhood aggregation (we never release individual rows).
        </li>
        <li>
          Hashed product-category + time-of-day co-occurrences, used by
          enterprise partners for market research.
        </li>
        <li>
          Anonymized derived features (weather-by-category lift coefficients,
          hour-of-week demand curves) computed from the{" "}
          <code>push_transactions</code> table.
        </li>
      </ul>
      <p>
        We <strong>never</strong> sell raw GPS coordinates, device IDs, email
        addresses, demographic ethnicity buckets, or any row that could
        re-identify an individual consumer.
      </p>

      <h2 id="how-to-opt-out" className="legal-section-heading">
        <span className="legal-section-heading__number">02 /</span>
        How to opt out
      </h2>
      <p>You have three options:</p>
      <ol>
        <li>
          <strong>Change your consent tier in-app.</strong> Visit{" "}
          <Link href="/my-privacy" style={{ color: "var(--tertiary)" }}>
            /my-privacy
          </Link>{" "}
          and move your consent from Tier 3 down to Tier 1 or 2. Downgrades take
          effect immediately; existing Tier-3 rows are excluded from any future
          data-licensing run.
        </li>
        <li>
          <strong>File a CCPA Do-Not-Sell request.</strong> Use the{" "}
          <Link href="/my-privacy#dsar" style={{ color: "var(--tertiary)" }}>
            privacy portal
          </Link>{" "}
          and select "Opt Out of Sale." We confirm within 15 business days and
          resolve within the statutory 45-day window.
        </li>
        <li>
          <strong>Email us.</strong> Send a request from the email address on
          your Push account to{" "}
          <a
            href="mailto:privacy@pushnyc.co?subject=Do%20Not%20Sell%20-%20CCPA%20Opt-Out"
            style={{ color: "var(--tertiary)" }}
          >
            privacy@pushnyc.co
          </a>
          . Include the phrase "Do Not Sell" in the subject line for
          auto-routing.
        </li>
      </ol>

      <h2 id="authorized-agents" className="legal-section-heading">
        <span className="legal-section-heading__number">03 /</span>
        Authorized agents
      </h2>
      <p>
        California consumers may designate an authorized agent to act on their
        behalf. We verify agent requests by requiring (a) written permission
        signed by the consumer, and (b) identity verification of the consumer
        before releasing or acting on the request.
      </p>

      <h2 id="response-time" className="legal-section-heading">
        <span className="legal-section-heading__number">04 /</span>
        Our response time
      </h2>
      <p>
        We confirm receipt of every Do-Not-Sell request within{" "}
        <strong>15 business days</strong>. We act on valid requests within{" "}
        <strong>45 calendar days</strong>, with one optional 45-day extension
        for complex requests (we will notify you if the extension is used). No
        fee is charged for the first two requests in a 12-month period.
      </p>

      <h2 id="no-retaliation" className="legal-section-heading">
        <span className="legal-section-heading__number">05 /</span>
        No retaliation
      </h2>
      <p>
        We do not charge different prices, deny service, or offer a lower
        quality of service because you exercised your CCPA rights. If you opt
        out of Tier 3 Commercial data-licensing, you forfeit any one-time $2
        bonus associated with that tier, but all other Push features continue
        unchanged.
      </p>

      <h2 id="contact" className="legal-section-heading">
        <span className="legal-section-heading__number">06 /</span>
        Contact
      </h2>
      <p>
        Questions? Email{" "}
        <a
          href="mailto:privacy@pushnyc.co"
          style={{ color: "var(--tertiary)" }}
        >
          privacy@pushnyc.co
        </a>{" "}
        or write to Push NYC, Inc., Attn: Privacy, 28 West 23rd St, New York, NY
        10010.
      </p>

      <p style={{ marginTop: "48px" }}>
        <Link href="/legal/privacy" style={{ color: "var(--tertiary)" }}>
          ← Back to full Privacy Policy
        </Link>
      </p>
    </>
  );
}
