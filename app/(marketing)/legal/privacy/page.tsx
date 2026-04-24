import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy — Push",
  description:
    "How Push collects, uses, and protects your personal data across our creator attribution platform.",
};

export default function PrivacyPage() {
  return (
    <>
      {/* Page Header */}
      <header className="legal-header">
        <p className="legal-header__eyebrow">Legal / Privacy</p>
        <h1 className="legal-header__title">Privacy Policy</h1>
        <div className="legal-header__meta">
          <span className="legal-header__meta-item">
            <strong>Last updated:</strong>&nbsp;April 15, 2026
          </span>
          <span className="legal-header__meta-divider" aria-hidden="true" />
          <span className="legal-header__meta-item">Version 3.1</span>
          <span className="legal-header__meta-divider" aria-hidden="true" />
          <span className="legal-header__meta-item">
            <svg
              width="13"
              height="13"
              viewBox="0 0 13 13"
              fill="none"
              aria-hidden="true"
              style={{ flexShrink: 0 }}
            >
              <circle
                cx="6.5"
                cy="6.5"
                r="5.5"
                stroke="currentColor"
                strokeWidth="1.2"
              />
              <path
                d="M6.5 4v3l2 1.5"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeLinecap="square"
              />
            </svg>
            &nbsp;Estimated reading time:&nbsp;<strong>12 min</strong>
          </span>
        </div>
      </header>

      {/* Introduction */}
      <div className="legal-infobox">
        <p className="legal-infobox__title">Summary</p>
        <p>
          Push NYC, Inc. operates a performance-based creator attribution
          platform. This policy explains what data we collect, why we collect
          it, how we share it, and your rights under applicable privacy law
          including GDPR, CCPA, and New York SHIELD Act. If you have questions,
          email{" "}
          <a
            href="mailto:privacy@pushnyc.co"
            style={{ color: "var(--tertiary)" }}
          >
            privacy@pushnyc.co
          </a>
          .
        </p>
      </div>

      {/* ── 1. Who We Are ─────────────────────────────────────── */}
      <h2 id="s1" className="legal-section-heading">
        <span className="legal-section-heading__number">01 /</span>
        Who We Are
      </h2>
      <p>
        Push NYC, Inc. ("<strong>Push</strong>," "<strong>we</strong>," "
        <strong>us</strong>") is a Delaware corporation headquartered in New
        York City, NY 10001. We operate a software-as-a-service platform that
        connects local businesses ( "<strong>Merchants</strong>") with content
        creators ( "<strong>Creators</strong>") to drive foot-traffic through
        QR-code attribution technology.
      </p>
      <p>
        For users in the European Economic Area and United Kingdom, Push NYC,
        Inc. acts as the <strong>data controller</strong> under the General Data
        Protection Regulation (GDPR) and UK GDPR. For California residents, we
        comply with the California Consumer Privacy Act (CCPA) as amended by the
        California Privacy Rights Act (CPRA).
      </p>
      <p>
        Our designated <strong>Data Protection Officer (DPO)</strong> can be
        reached at{" "}
        <a
          href="mailto:privacy@pushnyc.co"
          style={{ color: "var(--tertiary)" }}
        >
          privacy@pushnyc.co
        </a>{" "}
        or by post at Push NYC, Inc., Attn: Privacy, 28 West 23rd St, New York,
        NY 10010.
      </p>

      <hr className="legal-divider" />

      {/* ── 2. Definitions ───────────────────────────────────── */}
      <h2 id="s2" className="legal-section-heading">
        <span className="legal-section-heading__number">02 /</span>
        Key Definitions
      </h2>
      <dl>
        <dt>Platform</dt>
        <dd>
          The Push web application, mobile application, APIs, and associated
          services available at pushnyc.co and affiliated subdomains.
        </dd>
        <dt>Creator</dt>
        <dd>
          An individual who signs up to the Platform under any of the six
          Creator tiers (Nano through Legend) and generates content promoting
          Merchant campaigns.
        </dd>
        <dt>Merchant</dt>
        <dd>
          A business entity that subscribes to Push under any plan (Lite,
          Essentials, Pro, or Advanced) to run performance-based marketing
          campaigns. Legacy v4 cohorts (Starter, Growth, Scale) are honored per
          their original subscription contract.
        </dd>
        <dt>QR Attribution Event</dt>
        <dd>
          A recorded scan of a Push-generated QR code that links a customer
          visit or purchase to a specific Creator and Campaign.
        </dd>
        <dt>Campaign GMV</dt>
        <dd>
          Gross Merchandise Value attributed to a Campaign, calculated as the
          aggregated transactional value of verified customer visits within the
          attribution window.
        </dd>
        <dt>Personal Data</dt>
        <dd>
          Any information relating to an identified or identifiable natural
          person, as defined under applicable law.
        </dd>
      </dl>

      <hr className="legal-divider" />

      {/* ── 3. Data We Collect ───────────────────────────────── */}
      <h2 id="s3" className="legal-section-heading">
        <span className="legal-section-heading__number">03 /</span>
        Data We Collect
      </h2>
      <p>
        We collect data in three ways: data you give us directly, data generated
        automatically through your use of the Platform, and data from
        third-party sources.
      </p>

      <h3>3.1 Data You Provide</h3>
      <ul>
        <li>
          <strong>Account registration:</strong> name, email address, phone
          number, username, profile photo, borough/neighborhood (NYC), and tier
          preference.
        </li>
        <li>
          <strong>Creator profile:</strong> social media handles (Instagram,
          TikTok, YouTube), follower count, content categories, and payment
          details (processed via Stripe; we do not store raw card numbers).
        </li>
        <li>
          <strong>Merchant profile:</strong> business name, EIN/tax ID, physical
          address, operating hours, and Stripe merchant account information.
        </li>
        <li>
          <strong>Communications:</strong> messages exchanged with our support
          team, in-app messaging between Merchants and Creators, and survey
          responses.
        </li>
        <li>
          <strong>Compliance documents:</strong> government-issued ID and
          W-9/W-8BEN forms collected to satisfy IRS 1099 reporting obligations
          for Creators earning above $600 USD annually.
        </li>
      </ul>

      <h3>3.2 Data Generated Automatically</h3>
      <ul>
        <li>
          <strong>QR Attribution Events:</strong> timestamp, device type
          (desktop/mobile), referring URL, geographic cell (NYC
          neighborhood-level, not precise GPS), campaign ID, and Creator ID.
        </li>
        <li>
          <strong>Platform usage:</strong> page views, feature interactions,
          session duration, click paths, A/B test assignment, and error logs.
        </li>
        <li>
          <strong>Device and network:</strong> IP address (truncated to /24
          after 30 days), user-agent string, browser type, operating system, and
          screen resolution.
        </li>
        <li>
          <strong>Performance metrics:</strong> campaign impressions, scan
          rates, verified visit counts, GMV calculations, and payout records.
        </li>
      </ul>

      <h3>3.3 Data from Third Parties</h3>
      <ul>
        <li>
          <strong>Social platforms:</strong> when you connect Instagram, TikTok,
          or YouTube, we receive public profile data and post engagement metrics
          via official OAuth flows. We do not receive private messages or
          follower lists.
        </li>
        <li>
          <strong>Stripe:</strong> payment processor confirmation tokens,
          subscription status, and fraud risk signals.
        </li>
        <li>
          <strong>Anti-fraud partners:</strong> device fingerprint risk scores
          to detect artificial scan inflation (see our Anti-Fraud Policy,
          Section 9).
        </li>
      </ul>

      <hr className="legal-divider" />

      {/* ── 3A. Your Consent Tier (v5.3) ─────────────────────── */}
      <h2 id="s3a" className="legal-section-heading">
        <span className="legal-section-heading__number">03A /</span>
        Your Consent Tier
      </h2>
      <p>
        Push offers three opt-in tiers that control how much data is collected
        when you scan a QR code. Tier 2 is selected by default; you can change
        your tier at any time. Aggregation that leaves Push for licensing
        requires a minimum of 5 users per segment (k ≥ 5).
      </p>

      <div className="legal-table-wrap">
        <table>
          <thead>
            <tr>
              <th>Tier</th>
              <th>What we collect</th>
              <th>Used for</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <strong>Tier 1 — Basic</strong>
              </td>
              <td>
                Device anonymous ID (SHA256, not IDFA), creator / merchant /
                campaign IDs, claim + redeem timestamps, bucketed order total.
              </td>
              <td>
                Attribution only. <strong>Never</strong> included in data
                licensing aggregation.
              </td>
            </tr>
            <tr>
              <td>
                <strong>Tier 2 — Full Context</strong>{" "}
                <em>(default, recommended)</em>
              </td>
              <td>
                Tier 1 + opt-in GPS at claim and redeem, demo bucket (age /
                gender / ZIP-3), product category, time-of-day, weather code.
              </td>
              <td>
                Recommendations + aggregated neighborhood licensing (k ≥ 5).
              </td>
            </tr>
            <tr>
              <td>
                <strong>Tier 3 — Commercial</strong>
              </td>
              <td>
                Tier 2 + cross-merchant visit history, product SKU (hashed),
                ethnicity bucket (bias audit only, never shared).
              </td>
              <td>
                Enterprise + media licensing aggregates (still k ≥ 5). Includes
                a one-time $2 bonus discount.
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <p>
        Change your tier anytime at{" "}
        <Link href="/my-privacy" style={{ color: "var(--tertiary)" }}>
          Your Privacy
        </Link>
        . Opting out of one tier propagates to any future scans on the same
        device within 30 days.
      </p>

      <hr className="legal-divider" />

      {/* ── 4. Legal Bases ───────────────────────────────────── */}
      <h2 id="s4" className="legal-section-heading">
        <span className="legal-section-heading__number">04 /</span>
        Legal Bases for Processing
      </h2>
      <p>
        We rely on the following legal bases under GDPR Article 6 (and
        equivalent provisions under other applicable laws):
      </p>

      <div className="legal-table-wrap">
        <table>
          <thead>
            <tr>
              <th>Purpose</th>
              <th>Legal Basis</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Providing the Platform and processing transactions</td>
              <td>Contract performance (Art. 6(1)(b))</td>
            </tr>
            <tr>
              <td>QR attribution tracking and payout calculations</td>
              <td>Contract performance (Art. 6(1)(b))</td>
            </tr>
            <tr>
              <td>Tax reporting and legal compliance (1099, GDPR records)</td>
              <td>Legal obligation (Art. 6(1)(c))</td>
            </tr>
            <tr>
              <td>Anti-fraud and security monitoring</td>
              <td>Legitimate interests (Art. 6(1)(f))</td>
            </tr>
            <tr>
              <td>Product analytics and improvement</td>
              <td>Legitimate interests (Art. 6(1)(f))</td>
            </tr>
            <tr>
              <td>Marketing emails and push notifications</td>
              <td>Consent (Art. 6(1)(a)) — opt-in required</td>
            </tr>
          </tbody>
        </table>
      </div>

      <hr className="legal-divider" />

      {/* ── 5. How We Use Data ───────────────────────────────── */}
      <h2 id="s5" className="legal-section-heading">
        <span className="legal-section-heading__number">05 /</span>
        How We Use Your Data
      </h2>
      <ol>
        <li>
          <strong>Service delivery:</strong> matching Creators to Merchant
          campaigns, generating and tracking QR codes, processing payouts, and
          generating performance dashboards.
        </li>
        <li>
          <strong>Attribution verification:</strong> validating QR Attribution
          Events to confirm legitimate customer visits and prevent fraudulent
          scan inflation.
        </li>
        <li>
          <strong>Payout processing:</strong> calculating Creator earnings based
          on verified campaign metrics, releasing funds via Stripe, and
          generating tax documentation.
        </li>
        <li>
          <strong>Product improvement:</strong> analyzing aggregate,
          de-identified usage patterns to improve Platform features, ranking
          algorithms, and Creator-Merchant matching models.
        </li>
        <li>
          <strong>Safety and integrity:</strong> detecting and preventing fraud,
          abuse, and violations of our Acceptable Use Policy.
        </li>
        <li>
          <strong>Communications:</strong> sending transactional emails
          (campaign live, payout released, account alerts), service updates, and
          — with your consent — promotional content.
        </li>
        <li>
          <strong>Legal and regulatory compliance:</strong> responding to valid
          legal process, maintaining records required by IRS, NY State, and
          applicable data protection authorities.
        </li>
      </ol>

      <hr className="legal-divider" />

      {/* ── 6. Sharing Your Data ─────────────────────────────── */}
      <h2 id="s6" className="legal-section-heading">
        <span className="legal-section-heading__number">06 /</span>
        How We Share Your Data
      </h2>
      <p>
        We do <strong>not</strong> sell your personal data. We share data only
        in the following circumstances:
      </p>
      <ul>
        <li>
          <strong>Between Merchants and Creators:</strong> Merchants can see the
          Creator username, tier badge, aggregate campaign performance (scans,
          verified visits, GMV), and public profile. Creators can see Merchant
          name, campaign details, and payout status. Full contact details
          (email, phone) are never shared without explicit consent.
        </li>
        <li>
          <strong>Service providers:</strong> Stripe (payments), Amazon Web
          Services (infrastructure), Vercel (hosting), PostHog (analytics, EU
          data residency), Resend (transactional email), and Sentry (error
          monitoring). All providers are bound by Data Processing Agreements.
        </li>
        <li>
          <strong>Anti-fraud partners:</strong> device risk signals are shared
          with vetted fraud-detection vendors under strict contractual controls;
          no personal identifiers are transmitted.
        </li>
        <li>
          <strong>Legal process:</strong> we disclose data when required by a
          valid subpoena, court order, or government request, and will notify
          affected users where legally permitted.
        </li>
        <li>
          <strong>Business transfers:</strong> in the event of a merger,
          acquisition, or asset sale, personal data may be transferred to the
          successor entity, subject to equivalent privacy protections.
        </li>
      </ul>

      <hr className="legal-divider" />

      {/* ── 7. International Transfers ───────────────────────── */}
      <h2 id="s7" className="legal-section-heading">
        <span className="legal-section-heading__number">07 /</span>
        International Data Transfers
      </h2>
      <p>
        Push stores primary data in the United States (AWS us-east-1, N.
        Virginia). For users in the EEA, UK, or Switzerland, data transfers to
        the US are governed by the EU-US Data Privacy Framework where
        applicable, or by Standard Contractual Clauses (SCCs, Commission
        Decision 2021/914) incorporated into our DPAs with sub-processors.
      </p>
      <p>
        Analytics data processed by PostHog is stored in EU data centers
        (eu.posthog.com). Transactional emails processed by Resend use US
        infrastructure; only email address and template payload are transferred.
      </p>

      <hr className="legal-divider" />

      {/* ── 8. Retention ─────────────────────────────────────── */}
      <h2 id="s8" className="legal-section-heading">
        <span className="legal-section-heading__number">08 /</span>
        Data Retention
      </h2>
      <ul>
        <li>
          <strong>Active account data:</strong> retained for the life of the
          account plus 7 years for tax record compliance (IRS Rev. Proc. 98-25).
        </li>
        <li>
          <strong>QR Attribution Events:</strong> raw event logs retained for 3
          years; aggregated campaign statistics retained indefinitely for
          Merchant reporting.
        </li>
        <li>
          <strong>Payout records:</strong> 7 years post-issuance for IRS
          1099/MISC compliance.
        </li>
        <li>
          <strong>Closed account data:</strong> personal identifiers deleted
          within 90 days of account closure, except where retention is required
          by law.
        </li>
        <li>
          <strong>IP addresses:</strong> truncated to /24 after 30 days; full IP
          purged after 90 days unless associated with an active fraud
          investigation.
        </li>
        <li>
          <strong>Marketing opt-in records:</strong> retained for 6 years as
          evidence of consent under GDPR Article 7(1).
        </li>
      </ul>

      <hr className="legal-divider" />

      {/* ── 9. Security ──────────────────────────────────────── */}
      <h2 id="s9" className="legal-section-heading">
        <span className="legal-section-heading__number">09 /</span>
        Security
      </h2>
      <p>
        Push implements technical and organizational measures appropriate to the
        risk, including:
      </p>
      <ul>
        <li>
          TLS 1.3 encryption in transit; AES-256 encryption at rest for all
          database volumes.
        </li>
        <li>
          Role-based access control (RBAC) with principle of least privilege;
          MFA required for all engineering and operations staff.
        </li>
        <li>
          Regular penetration testing (minimum annual, performed by a qualified
          third party) and vulnerability scanning (weekly automated).
        </li>
        <li>
          SOC 2 Type II audit in progress; expected completion Q3 2026. Until
          then, we share our security posture summary on request.
        </li>
        <li>
          Anti-fraud engine monitoring QR scan velocity, device fingerprint
          anomalies, and GPS/IP inconsistencies in real time.
        </li>
      </ul>
      <p>
        No system is 100% secure. In the event of a data breach affecting your
        personal data, we will notify affected users and relevant supervisory
        authorities within 72 hours of discovery, as required by GDPR Article
        33.
      </p>

      <hr className="legal-divider" />

      {/* ── 10. Your Rights ──────────────────────────────────── */}
      <span
        id="your-rights"
        style={{ display: "block", scrollMarginTop: "80px" }}
        aria-hidden="true"
      />
      <h2 id="s10" className="legal-section-heading">
        <span className="legal-section-heading__number">10 /</span>
        Your Privacy Rights
      </h2>
      <p>Depending on your jurisdiction, you may have the following rights:</p>
      <ul>
        <li>
          <strong>Access (GDPR Art. 15 / CCPA §1798.110):</strong> request a
          copy of the personal data we hold about you.
        </li>
        <li>
          <strong>Rectification (GDPR Art. 16):</strong> correct inaccurate
          data.
        </li>
        <li>
          <strong>Erasure (GDPR Art. 17 / CCPA §1798.105):</strong> request
          deletion of your personal data, subject to retention obligations.
        </li>
        <li>
          <strong>Restriction (GDPR Art. 18):</strong> limit processing in
          certain circumstances.
        </li>
        <li>
          <strong>Portability (GDPR Art. 20):</strong> receive your data in a
          structured, machine-readable format.
        </li>
        <li>
          <strong>Objection (GDPR Art. 21):</strong> object to processing based
          on legitimate interests.
        </li>
        <li>
          <strong>Opt-out of sale/sharing (CCPA):</strong> California residents
          may opt out via the "Do Not Sell or Share My Personal Information"
          link in the footer. We do not sell data; this right is included for
          completeness.
        </li>
        <li>
          <strong>Withdraw consent:</strong> at any time, without affecting
          lawfulness of prior processing.
        </li>
      </ul>
      <p>
        To exercise any right, email{" "}
        <a
          href="mailto:privacy@pushnyc.co"
          style={{ color: "var(--tertiary)" }}
        >
          privacy@pushnyc.co
        </a>{" "}
        from your registered account email. We respond within 30 days (GDPR) or
        45 days (CCPA). Identity verification is required before we can action a
        request.
      </p>

      <hr className="legal-divider" />

      {/* ── 11. Children ─────────────────────────────────────── */}
      <h2 id="s11" className="legal-section-heading">
        <span className="legal-section-heading__number">11 /</span>
        Children&apos;s Privacy
      </h2>
      <p>
        The Platform is not directed at individuals under the age of 18. We do
        not knowingly collect personal data from minors. If we become aware that
        a minor has created an account, we will terminate the account and delete
        associated data within 72 hours. Parents or guardians may notify us at{" "}
        <a
          href="mailto:privacy@pushnyc.co"
          style={{ color: "var(--tertiary)" }}
        >
          privacy@pushnyc.co
        </a>
        .
      </p>

      <hr className="legal-divider" />

      {/* ── 12. Cookies ──────────────────────────────────────── */}
      <h2 id="s12" className="legal-section-heading">
        <span className="legal-section-heading__number">12 /</span>
        Cookies &amp; Tracking
      </h2>
      <p>
        We use cookies and similar technologies to operate the Platform and
        understand usage patterns. For full details, including your choices, see
        our{" "}
        <a href="/legal/cookies" style={{ color: "var(--tertiary)" }}>
          Cookie Policy
        </a>
        .
      </p>

      <hr className="legal-divider" />

      {/* ── 13. California ───────────────────────────────────── */}
      <span
        id="do-not-sell"
        style={{ display: "block", scrollMarginTop: "80px" }}
        aria-hidden="true"
      />
      <h2 id="s13" className="legal-section-heading">
        <span className="legal-section-heading__number">13 /</span>
        California Residents &amp; Do Not Sell / Share
      </h2>
      <p>
        California residents have rights under the CCPA/CPRA including the right
        to know, right to delete, right to correct, right to opt out of the
        sale/sharing of personal information, and right to non-discrimination.
        We do not discriminate against users who exercise privacy rights.
      </p>
      <p>
        <strong>
          Categories of personal information collected in the past 12 months:
        </strong>{" "}
        identifiers; commercial information (transactions, GMV);
        internet/network activity; geolocation data (neighborhood-level only);
        professional data (Creator tier, content category); inferences drawn
        from usage data.
      </p>
      <p>
        <strong>Business purpose for collection:</strong> Platform services,
        fraud prevention, tax compliance, and product improvement.
      </p>
      <p>
        To submit a CCPA request, email{" "}
        <a
          href="mailto:privacy@pushnyc.co"
          style={{ color: "var(--tertiary)" }}
        >
          privacy@pushnyc.co
        </a>{" "}
        with subject line &ldquo;CCPA Request&rdquo;.
      </p>

      <hr className="legal-divider" />

      {/* ── 14. New York SHIELD Act ──────────────────────────── */}
      <h2 id="s14" className="legal-section-heading">
        <span className="legal-section-heading__number">14 /</span>
        New York SHIELD Act
      </h2>
      <p>
        As a New York-headquartered company, Push complies with the Stop Hacks
        and Improve Electronic Data Security Act (SHIELD Act, N.Y. Gen. Bus. Law
        § 899-bb). Our reasonable security program includes administrative
        safeguards (staff training, vendor risk assessment), technical
        safeguards (encryption, access controls, network monitoring), and
        physical safeguards (data center access controls, device management
        policies).
      </p>
      <p>
        In the event of a data breach involving private information of New York
        residents, we will provide notification as required by law, including to
        the New York Attorney General where applicable.
      </p>

      <hr className="legal-divider" />

      {/* ── 15. Changes ──────────────────────────────────────── */}
      <h2 id="s15" className="legal-section-heading">
        <span className="legal-section-heading__number">15 /</span>
        Changes to This Policy
      </h2>
      <p>
        We may update this Privacy Policy from time to time. When we make
        material changes, we will notify you by email (to your registered
        address) and post a prominent notice on the Platform at least 14 days
        before the changes take effect. Your continued use of the Platform after
        the effective date constitutes acceptance of the revised policy.
      </p>
      <p>
        Non-material changes (typo corrections, clarifications that do not alter
        rights or obligations) may be made without advance notice; the
        &ldquo;Last updated&rdquo; date will always reflect the most recent
        revision.
      </p>
      <p>
        Previous versions of this policy are available on request from our DPO.
      </p>

      <hr className="legal-divider" />

      {/* ── 16. Contact ──────────────────────────────────────── */}
      <h2 id="s16" className="legal-section-heading">
        <span className="legal-section-heading__number">16 /</span>
        Contact &amp; Complaints
      </h2>
      <p>For privacy inquiries, data subject requests, or complaints:</p>
      <ul>
        <li>
          <strong>Email:</strong>{" "}
          <a
            href="mailto:privacy@pushnyc.co"
            style={{ color: "var(--tertiary)" }}
          >
            privacy@pushnyc.co
          </a>
        </li>
        <li>
          <strong>Post:</strong> Push NYC, Inc., Attn: Data Protection Officer,
          28 West 23rd St, New York, NY 10010
        </li>
        <li>
          <strong>EEA supervisory authority:</strong> you have the right to
          lodge a complaint with your local data protection authority. Our lead
          EU supervisory authority is the Irish Data Protection Commission
          (DPC).
        </li>
      </ul>

      <div className="legal-callout">
        <p>
          <strong>Note for EU/UK users:</strong> If you are not satisfied with
          our response to a complaint, you retain the right to escalate to your
          national supervisory authority at any time.
        </p>
      </div>
    </>
  );
}
