import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cookie Policy — Push",
  description:
    "How Push uses cookies and similar tracking technologies on our creator attribution platform.",
};

export default function CookiesPage() {
  return (
    <>
      {/* Page Header */}
      <header className="legal-header">
        <p className="legal-header__eyebrow">Legal / Cookies</p>
        <h1 className="legal-header__title">Cookie Policy</h1>
        <div className="legal-header__meta">
          <span className="legal-header__meta-item">
            <strong>Last updated:</strong>&nbsp;April 15, 2026
          </span>
          <span className="legal-header__meta-divider" aria-hidden="true" />
          <span className="legal-header__meta-item">Version 2.2</span>
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
            &nbsp;Estimated reading time:&nbsp;<strong>5 min</strong>
          </span>
        </div>
      </header>

      {/* Introduction */}
      <div className="legal-infobox">
        <p className="legal-infobox__title">Overview</p>
        <p>
          This Cookie Policy explains what cookies are, what types we use, why
          we use them, and how you can control them. This policy applies to
          pushnyc.co and all subdomains operated by Push NYC, Inc.
        </p>
      </div>

      {/* ── 1. What Are Cookies ──────────────────────────────── */}
      <h2 id="s1" className="legal-section-heading">
        <span className="legal-section-heading__number">01 /</span>
        What Are Cookies
      </h2>
      <p>
        Cookies are small text files placed on your device (computer, tablet, or
        mobile phone) by websites you visit. They allow the website to remember
        your actions and preferences over time, so you don&apos;t have to
        re-enter information each visit.
      </p>
      <p>
        Similar technologies include <strong>local storage</strong> (persistent
        key-value data in your browser), <strong>session storage</strong>{" "}
        (temporary data cleared when the tab closes),{" "}
        <strong>pixel tags</strong> (tiny transparent images that log requests),
        and <strong>device fingerprinting</strong> (a combination of browser and
        device attributes used for fraud detection). This policy covers all such
        technologies collectively.
      </p>

      <hr className="legal-divider" />

      {/* ── 2. Cookie Categories ─────────────────────────────── */}
      <h2 id="s2" className="legal-section-heading">
        <span className="legal-section-heading__number">02 /</span>
        Cookie Categories We Use
      </h2>

      <h3>2.1 Strictly Necessary</h3>
      <p>
        These cookies are essential for the Platform to function. They cannot be
        disabled without breaking core features. No consent is required for
        these cookies under GDPR Recital 47 (legitimate interests) and ePrivacy
        Directive Article 5(3).
      </p>
      <div className="legal-table-wrap">
        <table>
          <thead>
            <tr>
              <th>Cookie Name</th>
              <th>Purpose</th>
              <th>Duration</th>
              <th>Party</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <code>push_session</code>
              </td>
              <td>Authenticated session token</td>
              <td>Session</td>
              <td>First-party</td>
            </tr>
            <tr>
              <td>
                <code>push_csrf</code>
              </td>
              <td>Cross-site request forgery protection</td>
              <td>Session</td>
              <td>First-party</td>
            </tr>
            <tr>
              <td>
                <code>push_consent</code>
              </td>
              <td>Stores your cookie consent choice</td>
              <td>12 months</td>
              <td>First-party</td>
            </tr>
            <tr>
              <td>
                <code>__stripe_mid</code>
              </td>
              <td>Stripe fraud detection (payment processing)</td>
              <td>12 months</td>
              <td>Third-party (Stripe)</td>
            </tr>
            <tr>
              <td>
                <code>__stripe_sid</code>
              </td>
              <td>Stripe session identifier</td>
              <td>30 minutes</td>
              <td>Third-party (Stripe)</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h3>2.2 Functional</h3>
      <p>
        Functional cookies remember your preferences and settings to provide a
        more personalized experience. Disabling these may affect Platform
        comfort but not core functionality.
      </p>
      <div className="legal-table-wrap">
        <table>
          <thead>
            <tr>
              <th>Cookie Name</th>
              <th>Purpose</th>
              <th>Duration</th>
              <th>Party</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <code>push_ui_prefs</code>
              </td>
              <td>Stores dashboard layout and display preferences</td>
              <td>6 months</td>
              <td>First-party</td>
            </tr>
            <tr>
              <td>
                <code>push_timezone</code>
              </td>
              <td>Your detected timezone for campaign scheduling</td>
              <td>6 months</td>
              <td>First-party</td>
            </tr>
            <tr>
              <td>
                <code>push_onboard</code>
              </td>
              <td>Onboarding step completion state</td>
              <td>90 days</td>
              <td>First-party</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h3>2.3 Analytics</h3>
      <p>
        Analytics cookies help us understand how users interact with the
        Platform so we can improve features and fix issues. We use PostHog with
        EU data residency; no data is sold or shared with advertising networks.
      </p>
      <div className="legal-table-wrap">
        <table>
          <thead>
            <tr>
              <th>Cookie Name</th>
              <th>Purpose</th>
              <th>Duration</th>
              <th>Party</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <code>ph_*</code>
              </td>
              <td>PostHog analytics — session and event tracking</td>
              <td>12 months</td>
              <td>First-party (PostHog EU)</td>
            </tr>
            <tr>
              <td>
                <code>push_exp</code>
              </td>
              <td>A/B test experiment assignment</td>
              <td>30 days</td>
              <td>First-party</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h3>2.4 Security &amp; Anti-Fraud</h3>
      <p>
        These technologies are used specifically to protect the integrity of QR
        attribution data and detect artificial scan inflation. They are
        classified separately because they involve device fingerprinting beyond
        standard cookies.
      </p>
      <div className="legal-table-wrap">
        <table>
          <thead>
            <tr>
              <th>Technology</th>
              <th>Purpose</th>
              <th>Duration</th>
              <th>Party</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Device fingerprint hash</td>
              <td>
                Detect duplicate or artificial QR scans; stored as hashed
                identifier, not raw fingerprint
              </td>
              <td>90 days</td>
              <td>First-party</td>
            </tr>
            <tr>
              <td>Scan velocity token</td>
              <td>Rate-limit QR scan events per device</td>
              <td>Session</td>
              <td>First-party</td>
            </tr>
          </tbody>
        </table>
      </div>

      <hr className="legal-divider" />

      {/* ── 3. What We Do NOT Use ────────────────────────────── */}
      <h2 id="s3" className="legal-section-heading">
        <span className="legal-section-heading__number">03 /</span>
        What We Do Not Use
      </h2>
      <p>Push does not use:</p>
      <ul>
        <li>
          <strong>Advertising or tracking cookies</strong> from ad networks
          (Google Ads, Meta Pixel, TikTok Pixel, etc.)
        </li>
        <li>
          <strong>Cross-site tracking</strong> that follows you to other
          websites after leaving pushnyc.co
        </li>
        <li>
          <strong>Behavioral profiling</strong> for the purpose of targeted
          advertising
        </li>
        <li>
          <strong>Third-party social login tracking</strong> — OAuth flows are
          handled server-side; no social SDK JavaScript runs on our pages
        </li>
      </ul>

      <hr className="legal-divider" />

      {/* ── 4. Your Choices ──────────────────────────────────── */}
      <h2 id="s4" className="legal-section-heading">
        <span className="legal-section-heading__number">04 /</span>
        Your Cookie Choices
      </h2>

      <h3>4.1 Consent Banner</h3>
      <p>
        On your first visit to pushnyc.co, you will see a cookie consent banner.
        You may accept all cookies, accept only strictly necessary cookies, or
        customise your preferences by category. Your choice is saved in the{" "}
        <code>push_consent</code> cookie for 12 months. You can change your
        preference at any time via the &ldquo;Cookie Preferences&rdquo; link in
        the site footer.
      </p>

      <h3>4.2 Browser Settings</h3>
      <p>
        Most browsers allow you to control cookies via settings. You can block
        all cookies, delete existing cookies, or be notified before cookies are
        set. Common browser controls:
      </p>
      <ul>
        <li>
          Chrome: Settings → Privacy and security → Cookies and other site data
        </li>
        <li>
          Firefox: Settings → Privacy &amp; Security → Cookies and Site Data
        </li>
        <li>Safari: Preferences → Privacy → Manage Website Data</li>
        <li>Edge: Settings → Cookies and site permissions</li>
      </ul>
      <p>
        Note that blocking strictly necessary cookies will prevent the Platform
        from functioning correctly.
      </p>

      <h3>4.3 Do Not Track</h3>
      <p>
        We respect the <code>DNT</code> (Do Not Track) browser signal by
        disabling PostHog analytics for sessions where DNT is enabled. Strictly
        necessary and security cookies are unaffected by DNT.
      </p>

      <h3>4.4 Opt-Out of PostHog Analytics</h3>
      <p>
        You can opt out of PostHog analytics at any time by visiting{" "}
        <a
          href="https://eu.posthog.com/privacy"
          style={{ color: "var(--tertiary)" }}
        >
          eu.posthog.com/privacy
        </a>{" "}
        or by disabling analytics cookies through our cookie preferences centre.
      </p>

      <hr className="legal-divider" />

      {/* ── 5. Consent for EEA/UK Users ──────────────────────── */}
      <h2 id="s5" className="legal-section-heading">
        <span className="legal-section-heading__number">05 /</span>
        EEA &amp; UK Users — Legal Basis
      </h2>
      <p>
        For users in the European Economic Area and United Kingdom, our use of
        non-essential cookies is based on your <strong>consent</strong> (GDPR
        Article 6(1)(a) and ePrivacy Directive Article 5(3)). Strictly necessary
        and security cookies are placed on the basis of{" "}
        <strong>legitimate interests</strong> (fraud prevention and platform
        security) without requiring consent.
      </p>
      <p>
        You have the right to withdraw consent at any time without affecting the
        lawfulness of processing before withdrawal. Use the cookie preferences
        centre or browser settings to do so.
      </p>

      <hr className="legal-divider" />

      {/* ── 6. Changes ───────────────────────────────────────── */}
      <h2 id="s6" className="legal-section-heading">
        <span className="legal-section-heading__number">06 /</span>
        Changes to This Policy
      </h2>
      <p>
        We may update this Cookie Policy to reflect changes in the technologies
        we use or applicable legal requirements. When we add new cookie
        categories or third-party partners, we will update this page and, where
        required by law, re-solicit consent. The &ldquo;Last updated&rdquo; date
        at the top of this page always reflects the most recent revision.
      </p>

      <hr className="legal-divider" />

      {/* ── 7. Contact ───────────────────────────────────────── */}
      <h2 id="s7" className="legal-section-heading">
        <span className="legal-section-heading__number">07 /</span>
        Contact
      </h2>
      <p>
        For questions about our use of cookies, contact our Data Protection
        Officer:
      </p>
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
          <strong>Post:</strong> Push NYC, Inc., Attn: DPO, 28 West 23rd St, New
          York, NY 10010
        </li>
      </ul>

      <div className="legal-callout">
        <p>
          <strong>Cookie preferences:</strong> You can update your consent
          choices at any time using the &ldquo;Cookie Preferences&rdquo; link in
          the site footer.
        </p>
      </div>
    </>
  );
}
