import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Cookie Policy — Push",
  description:
    "How Push uses cookies and similar tracking technologies on our creator attribution platform.",
};

const TOC = [
  { id: "s1", label: "01 / What Are Cookies" },
  { id: "s2", label: "02 / Cookie Categories" },
  { id: "s3", label: "03 / What We Don't Use" },
  { id: "s4", label: "04 / Your Choices" },
  { id: "s5", label: "05 / EEA & UK Basis" },
  { id: "s6", label: "06 / Changes" },
  { id: "s7", label: "07 / Contact" },
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

function SectionH3({ children }: { children: React.ReactNode }) {
  return <h3 className="legal-section-h3">{children}</h3>;
}

function Divider() {
  return <hr className="legal-divider" />;
}

function CookieTable({ rows }: { rows: [string, string, string, string][] }) {
  return (
    <div
      className="legal-table-wrap"
      style={{ marginTop: "16px", marginBottom: "24px" }}
    >
      <table className="legal-table">
        <thead>
          <tr>
            {["Cookie Name", "Purpose", "Duration", "Party"].map((h) => (
              <th key={h}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map(([name, purpose, duration, party], i) => (
            <tr key={i}>
              <td>
                <span className="legal-table-code">{name}</span>
              </td>
              <td style={{ fontWeight: "normal", color: "var(--ink-3)" }}>
                {purpose}
              </td>
              <td
                style={{
                  fontWeight: "normal",
                  color: "var(--ink-3)",
                  whiteSpace: "nowrap",
                }}
              >
                {duration}
              </td>
              <td
                style={{
                  fontWeight: "normal",
                  color: "var(--ink-3)",
                  whiteSpace: "nowrap",
                }}
              >
                {party}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function CookiesPage() {
  return (
    <>
      {/* ── HERO ─────────────────────────────────────────────────── */}
      <section className="legal-hero">
        <div className="legal-hero__inner">
          <Link href="/legal" className="legal-hero__back">
            &larr; Legal Hub
          </Link>
          <p className="legal-hero__eyebrow">(COOKIE POLICY)</p>
          <h1 className="legal-hero__h1">Cookie Policy</h1>
          <div className="legal-hero__meta">
            <span className="legal-hero__badge legal-hero__badge--strong">
              Last updated: April 15, 2026
            </span>
            <span className="legal-hero__sep">/</span>
            <span className="legal-hero__badge">Version 2.2</span>
            <span className="legal-hero__sep">/</span>
            <span className="legal-hero__badge">5 min read</span>
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
          {/* Overview notice — positive/warm */}
          <div className="legal-notice legal-notice--positive">
            <span className="legal-notice__eyebrow">Overview</span>
            <p>
              This Cookie Policy explains what cookies are, what types we use,
              why we use them, and how you can control them. This policy applies
              to pushnyc.co and all subdomains operated by Push NYC, Inc.
            </p>
          </div>

          {/* ── 1. What Are Cookies ── */}
          <SectionH2 id="s1" num="01 /">
            What Are Cookies
          </SectionH2>
          <p>
            Cookies are small text files placed on your device (computer,
            tablet, or mobile phone) by websites you visit. They allow the
            website to remember your actions and preferences over time, so you
            don&apos;t have to re-enter information each visit.
          </p>
          <p>
            Similar technologies include <strong>local storage</strong>{" "}
            (persistent key-value data in your browser),{" "}
            <strong>session storage</strong> (temporary data cleared when the
            tab closes), <strong>pixel tags</strong> (tiny transparent images
            that log requests), and <strong>device fingerprinting</strong> (a
            combination of browser and device attributes used for fraud
            detection). This policy covers all such technologies collectively.
          </p>

          <Divider />

          {/* ── 2. Cookie Categories ── */}
          <SectionH2 id="s2" num="02 /">
            Cookie Categories We Use
          </SectionH2>

          <SectionH3>2.1 Strictly Necessary</SectionH3>
          <p>
            These cookies are essential for the Platform to function. They
            cannot be disabled without breaking core features. No consent is
            required for these cookies under GDPR Recital 47 (legitimate
            interests) and ePrivacy Directive Article 5(3).
          </p>
          <CookieTable
            rows={[
              [
                "push_session",
                "Authenticated session token",
                "Session",
                "First-party",
              ],
              [
                "push_csrf",
                "Cross-site request forgery protection",
                "Session",
                "First-party",
              ],
              [
                "push_consent",
                "Stores your cookie consent choice",
                "12 months",
                "First-party",
              ],
              [
                "__stripe_mid",
                "Stripe fraud detection (payment processing)",
                "12 months",
                "Third-party (Stripe)",
              ],
              [
                "__stripe_sid",
                "Stripe session identifier",
                "30 minutes",
                "Third-party (Stripe)",
              ],
            ]}
          />

          <SectionH3>2.2 Functional</SectionH3>
          <p>
            Functional cookies remember your preferences and settings to provide
            a more personalized experience. Disabling these may affect Platform
            comfort but not core functionality.
          </p>
          <CookieTable
            rows={[
              [
                "push_ui_prefs",
                "Stores dashboard layout and display preferences",
                "6 months",
                "First-party",
              ],
              [
                "push_timezone",
                "Your detected timezone for campaign scheduling",
                "6 months",
                "First-party",
              ],
              [
                "push_onboard",
                "Onboarding step completion state",
                "90 days",
                "First-party",
              ],
            ]}
          />

          <SectionH3>2.3 Analytics</SectionH3>
          <p>
            Analytics cookies help us understand how users interact with the
            Platform so we can improve features and fix issues. We use PostHog
            with EU data residency; no data is sold or shared with advertising
            networks.
          </p>
          <CookieTable
            rows={[
              [
                "ph_*",
                "PostHog analytics — session and event tracking",
                "12 months",
                "First-party (PostHog EU)",
              ],
              [
                "push_exp",
                "A/B test experiment assignment",
                "30 days",
                "First-party",
              ],
            ]}
          />

          <SectionH3>2.4 Security &amp; Anti-Fraud</SectionH3>
          <p>
            These technologies are used specifically to protect the integrity of
            QR attribution data and detect artificial scan inflation. They are
            classified separately because they involve device fingerprinting
            beyond standard cookies.
          </p>
          <div
            className="legal-table-wrap"
            style={{ marginTop: "16px", marginBottom: "24px" }}
          >
            <table className="legal-table">
              <thead>
                <tr>
                  {["Technology", "Purpose", "Duration", "Party"].map((h) => (
                    <th key={h}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  [
                    "Device fingerprint hash",
                    "Detect duplicate or artificial QR scans; stored as hashed identifier, not raw fingerprint",
                    "90 days",
                    "First-party",
                  ],
                  [
                    "Scan velocity token",
                    "Rate-limit QR scan events per device",
                    "Session",
                    "First-party",
                  ],
                ].map(([name, purpose, duration, party], i) => (
                  <tr key={i}>
                    <td>{name}</td>
                    <td style={{ fontWeight: "normal", color: "var(--ink-3)" }}>
                      {purpose}
                    </td>
                    <td
                      style={{
                        fontWeight: "normal",
                        color: "var(--ink-3)",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {duration}
                    </td>
                    <td
                      style={{
                        fontWeight: "normal",
                        color: "var(--ink-3)",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {party}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <Divider />

          {/* ── 3. What We Do NOT Use ── */}
          <SectionH2 id="s3" num="03 /">
            What We Do Not Use
          </SectionH2>
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
              <strong>Third-party social login tracking</strong> — OAuth flows
              are handled server-side; no social SDK JavaScript runs on our
              pages
            </li>
          </ul>

          <Divider />

          {/* ── 4. Your Choices ── */}
          <SectionH2 id="s4" num="04 /">
            Your Cookie Choices
          </SectionH2>

          <SectionH3>4.1 Consent Banner</SectionH3>
          <p>
            On your first visit to pushnyc.co, you will see a cookie consent
            banner. You may accept all cookies, accept only strictly necessary
            cookies, or customise your preferences by category. Your choice is
            saved in the <code>push_consent</code> cookie for 12 months. You can
            change your preference at any time via the &ldquo;Cookie
            Preferences&rdquo; link in the site footer.
          </p>

          <SectionH3>4.2 Browser Settings</SectionH3>
          <p>
            Most browsers allow you to control cookies via settings. You can
            block all cookies, delete existing cookies, or be notified before
            cookies are set. Common browser controls:
          </p>
          <ul>
            <li>
              Chrome: Settings &rarr; Privacy and security &rarr; Cookies and
              other site data
            </li>
            <li>
              Firefox: Settings &rarr; Privacy &amp; Security &rarr; Cookies and
              Site Data
            </li>
            <li>
              Safari: Preferences &rarr; Privacy &rarr; Manage Website Data
            </li>
            <li>Edge: Settings &rarr; Cookies and site permissions</li>
          </ul>
          <p>
            Note that blocking strictly necessary cookies will prevent the
            Platform from functioning correctly.
          </p>

          <SectionH3>4.3 Do Not Track</SectionH3>
          <p>
            We respect the <code>DNT</code> (Do Not Track) browser signal by
            disabling PostHog analytics for sessions where DNT is enabled.
            Strictly necessary and security cookies are unaffected by DNT.
          </p>

          <SectionH3>4.4 Opt-Out of PostHog Analytics</SectionH3>
          <p>
            You can opt out of PostHog analytics at any time by visiting{" "}
            <a href="https://eu.posthog.com/privacy">eu.posthog.com/privacy</a>{" "}
            or by disabling analytics cookies through our cookie preferences
            centre.
          </p>

          <Divider />

          {/* ── 5. EEA & UK ── */}
          <SectionH2 id="s5" num="05 /">
            EEA &amp; UK Users — Legal Basis
          </SectionH2>
          <p>
            For users in the European Economic Area and United Kingdom, our use
            of non-essential cookies is based on your <strong>consent</strong>{" "}
            (GDPR Article 6(1)(a) and ePrivacy Directive Article 5(3)). Strictly
            necessary and security cookies are placed on the basis of{" "}
            <strong>legitimate interests</strong> (fraud prevention and platform
            security) without requiring consent.
          </p>
          <p>
            You have the right to withdraw consent at any time without affecting
            the lawfulness of processing before withdrawal. Use the cookie
            preferences centre or browser settings to do so.
          </p>

          <Divider />

          {/* ── 6. Changes ── */}
          <SectionH2 id="s6" num="06 /">
            Changes to This Policy
          </SectionH2>
          <p>
            We may update this Cookie Policy to reflect changes in the
            technologies we use or applicable legal requirements. When we add
            new cookie categories or third-party partners, we will update this
            page and, where required by law, re-solicit consent. The &ldquo;Last
            updated&rdquo; date at the top of this page always reflects the most
            recent revision.
          </p>

          <Divider />

          {/* ── 7. Contact ── */}
          <SectionH2 id="s7" num="07 /">
            Contact
          </SectionH2>
          <p>
            For questions about our use of cookies, contact our Data Protection
            Officer:
          </p>
          <ul>
            <li>
              <strong>Email:</strong>{" "}
              <a href="mailto:privacy@pushnyc.co">privacy@pushnyc.co</a>
            </li>
            <li>
              <strong>Post:</strong> Push NYC, Inc., Attn: DPO, 28 West 23rd St,
              New York, NY 10010
            </li>
          </ul>

          {/* Cookie preferences callout */}
          <div
            className="legal-notice legal-notice--positive"
            style={{ marginTop: "32px" }}
          >
            <p>
              <strong>Cookie preferences:</strong> You can update your consent
              choices at any time using the &ldquo;Cookie Preferences&rdquo;
              link in the site footer.
            </p>
          </div>
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
