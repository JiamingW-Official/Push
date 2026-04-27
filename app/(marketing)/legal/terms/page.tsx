import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Service — Push",
  description:
    "The legal agreement governing use of the Push creator attribution platform for Merchants and Creators.",
};

const TOC = [
  { id: "s1", label: "01 / Acceptance" },
  { id: "s2", label: "02 / Definitions" },
  { id: "s3", label: "03 / Eligibility" },
  { id: "s4", label: "04 / Creator Terms" },
  { id: "s5", label: "05 / Merchant Terms" },
  { id: "s6", label: "06 / Prohibited Conduct" },
  { id: "s7", label: "07 / Intellectual Property" },
  { id: "s8", label: "08 / Disclaimers" },
  { id: "s9", label: "09 / Liability" },
  { id: "s10", label: "10 / Indemnification" },
  { id: "s11", label: "11 / Termination" },
  { id: "s12", label: "12 / Dispute Resolution" },
  { id: "s13", label: "13 / Governing Law" },
  { id: "s14", label: "14 / Force Majeure" },
  { id: "s15", label: "15 / General" },
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

export default function TermsPage() {
  return (
    <>
      {/* ── HERO ─────────────────────────────────────────────────── */}
      <section className="legal-hero">
        <div className="legal-hero__inner">
          <Link href="/legal" className="legal-hero__back">
            &larr; Legal Hub
          </Link>
          <p className="legal-hero__eyebrow">(TERMS OF SERVICE)</p>
          <h1 className="legal-hero__h1">Terms of Service</h1>
          <div className="legal-hero__meta">
            <span className="legal-hero__badge legal-hero__badge--strong">
              Last updated: April 15, 2026
            </span>
            <span className="legal-hero__sep">/</span>
            <span className="legal-hero__badge">Version 5.0</span>
            <span className="legal-hero__sep">/</span>
            <span className="legal-hero__badge">15 min read</span>
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
          {/* Important notice */}
          <div className="legal-notice legal-notice--warning">
            <span className="legal-notice__eyebrow">Important</span>
            <p>
              These Terms of Service (&ldquo;Terms&rdquo;) constitute a binding
              legal agreement between you and Push NYC, Inc. By accessing or
              using the Platform, you agree to these Terms. If you do not agree,
              do not use the Platform. Capitalized terms not defined inline are
              defined in Section 2.
            </p>
          </div>

          {/* ── 1. Acceptance ── */}
          <SectionH2 id="s1" num="01 /">
            Acceptance of Terms
          </SectionH2>
          <p>
            By creating an account, clicking &ldquo;I agree,&rdquo; or otherwise
            accessing or using the Push platform (the &ldquo;Platform&rdquo;),
            you (&ldquo;User,&rdquo; &ldquo;you&rdquo;) agree to be bound by
            these Terms, our <a href="/legal/privacy">Privacy Policy</a>,{" "}
            <a href="/legal/cookies">Cookie Policy</a>, and{" "}
            <a href="/legal/acceptable-use">Acceptable Use Policy</a>, all of
            which are incorporated herein by reference.
          </p>
          <p>
            If you are accepting these Terms on behalf of a legal entity (a
            business, LLC, corporation, or partnership), you represent and
            warrant that you have authority to bind that entity. In that case,
            &ldquo;you&rdquo; refers to both you individually and the entity.
          </p>
          <p>
            We may update these Terms at any time. Material updates will be
            communicated via email with at least 14 days&apos; notice. Continued
            use after the effective date constitutes acceptance of the updated
            Terms.
          </p>

          <Divider />

          {/* ── 2. Definitions ── */}
          <SectionH2 id="s2" num="02 /">
            Definitions
          </SectionH2>
          <dl className="legal-dl">
            {[
              [
                "Platform",
                "The Push web application, mobile application, APIs, dashboard, and all associated software services operated by Push NYC, Inc.",
              ],
              [
                "Creator",
                "A user registered under the Creator role, assigned to a tier (Nano, Micro, Rising, Pro, Elite, or Legend) based on the Creator Scoring Model.",
              ],
              [
                "Merchant",
                "A business entity subscribed to a Push plan (Lite $0/mo, Essentials $99/mo, Pro outcome-based, or Advanced $349/mo) to run attribution campaigns.",
              ],
              [
                "Campaign",
                "A defined marketing engagement created by a Merchant, specifying campaign objectives, budget, payout structure, attribution window, and eligible Creator tiers.",
              ],
              [
                "QR Code",
                "A unique, cryptographically signed two-dimensional barcode generated by the Platform and assigned to a specific Creator-Campaign pairing.",
              ],
              [
                "Attribution Event",
                "A verified customer interaction (scan, visit, or purchase) linked to a Creator and Campaign within the defined attribution window, as determined by the Push attribution engine.",
              ],
              [
                "GMV",
                "Gross Merchandise Value: the total customer spend attributed to a Campaign, used as a basis for performance-based payout calculations.",
              ],
              [
                "Payout",
                "Monetary compensation released to a Creator following verification of Attribution Events, calculated per the applicable Campaign payout schedule and Creator tier multiplier.",
              ],
              [
                "Content",
                "Any photographs, videos, text, captions, stories, reels, or other media produced by a Creator in connection with a Campaign.",
              ],
              [
                "Push IP",
                "All intellectual property owned or licensed by Push NYC, Inc., including software, algorithms, QR attribution technology, brand assets, and Platform design.",
              ],
            ].map(([term, def]) => (
              <>
                <dt key={term}>{term}</dt>
                <dd key={`${term}-def`}>{def}</dd>
              </>
            ))}
          </dl>

          <Divider />

          {/* ── 3. Eligibility ── */}
          <SectionH2 id="s3" num="03 /">
            Eligibility &amp; Account Registration
          </SectionH2>
          <p>You must meet the following requirements to use the Platform:</p>
          <ul>
            <li>
              You must be at least <strong>18 years of age</strong>. The
              Platform is not available to minors.
            </li>
            <li>
              You must have legal capacity to enter into a binding contract
              under the laws of your jurisdiction.
            </li>
            <li>
              Your use must not be prohibited by applicable law (including US
              export controls and sanctions lists).
            </li>
            <li>
              Creators must have an active, publicly visible social media
              presence on at least one supported platform (Instagram, TikTok, or
              YouTube) at the time of registration.
            </li>
            <li>
              Merchants must have a valid US business registration and a
              physical business location in the New York City metropolitan area
              (the five boroughs, or Nassau, Suffolk, or Westchester counties).
            </li>
          </ul>
          <SectionH3>Account Security</SectionH3>
          <p>
            You are responsible for maintaining the confidentiality of your
            account credentials. You must notify us immediately at{" "}
            <a href="mailto:security@pushnyc.co">security@pushnyc.co</a> if you
            suspect unauthorized access. Push is not liable for losses resulting
            from unauthorized account access where you failed to maintain
            adequate credential security.
          </p>
          <p>
            You may not create more than one account per person or entity
            without our prior written consent. Duplicate accounts are grounds
            for immediate suspension.
          </p>

          <Divider />

          {/* ── 4. Creator Terms ── */}
          <SectionH2 id="s4" num="04 /">
            Creator-Specific Terms
          </SectionH2>
          <SectionH3>4.1 Creator Tiers</SectionH3>
          <p>
            Creators are assigned to one of six tiers (Nano, Micro, Rising, Pro,
            Elite, Legend) based on the Push Creator Scoring Model, which
            evaluates follower count, engagement rate, content quality score,
            verification status, and prior campaign performance. Tier assignment
            is reviewed monthly and may be upgraded or downgraded based on
            current metrics.
          </p>
          <p>
            Tier assignment affects: campaign eligibility, payout multipliers,
            priority matching to high-value Merchant campaigns, and the Creator
            dashboard feature set. Push reserves the right to modify the scoring
            criteria and tier thresholds with 30 days&apos; notice.
          </p>

          <SectionH3>4.2 Campaign Participation</SectionH3>
          <p>When you accept a Campaign, you agree to:</p>
          <ul>
            <li>
              Create and publish original Content that accurately represents the
              Merchant and complies with FTC Disclosure Requirements (16 CFR
              Part 255), including clear disclosure of the paid partnership
              (e.g., &ldquo;#ad&rdquo; or &ldquo;Paid partnership with
              [Merchant]&rdquo;).
            </li>
            <li>
              Use only the Push-issued QR code assigned to your Creator-Campaign
              pairing. Sharing, duplicating, or redistributing QR codes is
              strictly prohibited.
            </li>
            <li>
              Not artificially inflate Attribution Events through bots, click
              farms, purchased scans, coordinated inauthentic behavior, or any
              other fraudulent means.
            </li>
            <li>
              Comply with the content guidelines specified in each Campaign
              brief, including any brand safety requirements set by the
              Merchant.
            </li>
            <li>
              Submit required content deliverables within the Campaign timeline.
              Late submissions may result in payout adjustment or Campaign
              disqualification at Merchant discretion.
            </li>
          </ul>

          <SectionH3>4.3 Payout Terms</SectionH3>
          <p>
            Payouts are calculated based on verified Attribution Events within
            the Campaign attribution window (typically 7–30 days, specified per
            Campaign). Push uses a multi-signal verification model that includes
            device fingerprinting, IP analysis, scan velocity monitoring, and
            GPS cell validation.
          </p>
          <p>
            Payouts are released to your linked Stripe account within 5–10
            business days following Campaign close and verification. A{" "}
            <strong>10% platform fee</strong> is deducted from gross Creator
            earnings. Push reserves the right to withhold or claw back payouts
            where fraud is detected, subject to a right of appeal within 14 days
            of notification.
          </p>
          <p>
            Creators earning over $600 USD in a calendar year will receive a
            Form 1099-NEC. You are solely responsible for your tax obligations
            as an independent contractor.
          </p>

          <SectionH3>4.4 Content License</SectionH3>
          <p>
            By submitting Content through the Platform, you grant Push and the
            applicable Merchant a non-exclusive, royalty-free, worldwide,
            sublicensable license to use, reproduce, distribute, adapt, and
            display the Content for purposes of: campaign reporting, case
            studies, marketing materials (with prior notice), and Platform
            demonstration. This license survives termination for content already
            published.
          </p>

          <Divider />

          {/* ── 5. Merchant Terms ── */}
          <SectionH2 id="s5" num="05 /">
            Merchant-Specific Terms
          </SectionH2>
          <SectionH3>5.1 Subscription Plans</SectionH3>
          <p>
            Push offers four subscription tiers: Lite ($0/month), Essentials
            ($99/month), Pro (outcome-based — 5% of attributed revenue, capped
            $179/month, floor $49/month), and Advanced ($349/month). Plan
            features, campaign limits, and Creator tier access are as specified
            on the pricing page at the time of subscription. Push reserves the
            right to modify plan pricing with 30 days&apos; advance notice to
            existing subscribers. Legacy v4 cohorts (Starter, Growth, Scale) are
            honored per their original subscription contract.
          </p>
          <p>
            Subscriptions are billed monthly on the anniversary of the
            subscription date via Stripe. All fees are in USD. Failure to
            maintain a valid payment method may result in service suspension.
          </p>

          <SectionH3>5.2 Campaign Creation &amp; Management</SectionH3>
          <p>Merchants are responsible for:</p>
          <ul>
            <li>
              Defining accurate campaign briefs, including product/service
              descriptions, eligible Creators, payout structure, attribution
              window, and brand guidelines.
            </li>
            <li>
              Ensuring that campaign terms comply with applicable advertising
              law, including FTC guidelines, New York State truth-in-advertising
              requirements, and industry-specific regulations (e.g., alcohol,
              food service).
            </li>
            <li>
              Maintaining sufficient funds in the campaign budget. Push will
              pause a Campaign automatically if projected payout obligations
              exceed the committed budget.
            </li>
            <li>
              Providing timely feedback on Creator content submissions within
              the review window (48 hours unless otherwise specified).
            </li>
          </ul>

          <SectionH3>5.3 Attribution Acceptance</SectionH3>
          <p>
            Merchants accept that Push attribution data is the authoritative
            source for payout calculations. Merchants may dispute individual
            Attribution Events within 7 days of a Campaign closing report,
            providing documentary evidence of the alleged inaccuracy. Push will
            review disputes within 10 business days and issue a final
            determination. Payout adjustments resulting from upheld disputes
            will be applied to the next billing cycle.
          </p>

          <SectionH3>5.4 Merchant Conduct</SectionH3>
          <p>
            Merchants may not: contact Creators outside the Platform to
            circumvent fees; require Creators to make personal purchases as a
            condition of participation; discriminate against Creators on
            protected grounds; or request Content that violates our Acceptable
            Use Policy.
          </p>

          <Divider />

          {/* ── 6. Prohibited Conduct ── */}
          <SectionH2 id="s6" num="06 /">
            Prohibited Conduct
          </SectionH2>
          <p>
            In addition to obligations in the Acceptable Use Policy, you must
            not:
          </p>
          <ol>
            {[
              "Reverse-engineer, decompile, or disassemble any part of the Platform or its QR attribution algorithms.",
              "Scrape, crawl, or extract data from the Platform using automated means without written authorization.",
              "Interfere with the integrity, security, or availability of the Platform, including DDoS attacks, SQL injection, or cross-site scripting.",
              "Circumvent any rate limits, access controls, or technical protection measures.",
              "Use the Platform to violate any applicable law or regulation, including securities law, privacy law, or consumer protection law.",
              "Impersonate Push, a Merchant, a Creator, or any other person or entity.",
              "Use Campaign materials or QR codes for any purpose other than the specified Campaign.",
              "Engage in or facilitate any form of artificial scan inflation, including via bots, VPNs, proxy networks, or coordinated human effort.",
            ].map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ol>
          <p>
            Violation of any of the above is grounds for immediate account
            suspension and may result in legal action, including claims for
            damages under the Computer Fraud and Abuse Act (18 U.S.C. § 1030)
            and applicable state law.
          </p>

          <Divider />

          {/* ── 7. Intellectual Property ── */}
          <SectionH2 id="s7" num="07 /">
            Intellectual Property
          </SectionH2>
          <p>
            All Push IP — including the Platform software, QR attribution
            system, scoring algorithms, brand marks, design, and documentation —
            is owned exclusively by Push NYC, Inc. or its licensors. Nothing in
            these Terms grants you any rights to Push IP beyond a limited,
            non-exclusive, non-transferable license to use the Platform for its
            intended purpose during your active subscription or registration.
          </p>
          <p>
            You retain ownership of Content you create. By participating in a
            Campaign, you grant the limited license described in Section 4.4.
          </p>
          <p>
            The &ldquo;Push&rdquo; name, logo, and &ldquo;Powered by Push&rdquo;
            badge are registered trademarks of Push NYC, Inc. You may use the
            badge solely to indicate participation in a verified Push campaign,
            subject to our Brand Guidelines.
          </p>

          <Divider />

          {/* ── 8. Disclaimers ── */}
          <SectionH2 id="s8" num="08 /">
            Disclaimers &amp; Warranties
          </SectionH2>
          <div className="legal-notice legal-notice--warning">
            <span className="legal-notice__eyebrow">As-Is Warranty</span>
            <p>
              THE PLATFORM IS PROVIDED &ldquo;AS IS&rdquo; AND &ldquo;AS
              AVAILABLE&rdquo; WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
              INCLUDING WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR
              PURPOSE, OR NON-INFRINGEMENT. PUSH DOES NOT WARRANT THAT THE
              PLATFORM WILL BE UNINTERRUPTED, ERROR-FREE, OR FREE FROM HARMFUL
              COMPONENTS.
            </p>
          </div>
          <p>
            Attribution data is provided in good faith based on our verification
            systems. Push does not guarantee any specific level of campaign
            performance, foot traffic, GMV, or return on investment for
            Merchants. Historical performance data is illustrative only.
          </p>
          <p>
            Push is not a party to any agreement between Merchants and Creators
            beyond facilitating connections through the Platform. Push does not
            guarantee Creator availability, content quality beyond defined tier
            standards, or campaign outcomes.
          </p>

          <Divider />

          {/* ── 9. Limitation of Liability ── */}
          <SectionH2 id="s9" num="09 /">
            Limitation of Liability
          </SectionH2>
          <div className="legal-notice legal-notice--warning">
            <span className="legal-notice__eyebrow">Liability Cap</span>
            <p>
              TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, IN NO EVENT
              SHALL PUSH NYC, INC., ITS OFFICERS, DIRECTORS, EMPLOYEES, OR
              AGENTS BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL,
              CONSEQUENTIAL, PUNITIVE, OR EXEMPLARY DAMAGES, INCLUDING LOST
              PROFITS, LOSS OF DATA, LOSS OF GOODWILL, OR BUSINESS INTERRUPTION,
              ARISING OUT OF OR RELATING TO YOUR USE OF THE PLATFORM, EVEN IF
              PUSH HAS BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.
            </p>
          </div>
          <p>
            PUSH&apos;S TOTAL AGGREGATE LIABILITY TO YOU FOR ANY CLAIMS ARISING
            OUT OF OR RELATING TO THESE TERMS OR YOUR USE OF THE PLATFORM SHALL
            NOT EXCEED THE GREATER OF: (A) THE TOTAL FEES PAID BY YOU TO PUSH IN
            THE 12 MONTHS PRECEDING THE CLAIM, OR (B) ONE HUNDRED US DOLLARS
            ($100).
          </p>
          <p>
            Some jurisdictions do not allow certain liability exclusions; in
            such cases, Push&apos;s liability is limited to the fullest extent
            permitted by law.
          </p>

          <Divider />

          {/* ── 10. Indemnification ── */}
          <SectionH2 id="s10" num="10 /">
            Indemnification
          </SectionH2>
          <p>
            You agree to indemnify, defend, and hold harmless Push NYC, Inc.,
            its officers, directors, employees, contractors, and agents from and
            against any claims, damages, losses, liabilities, costs, and
            expenses (including reasonable attorneys&apos; fees) arising from or
            related to:
          </p>
          <ul>
            <li>Your use of or access to the Platform;</li>
            <li>Your violation of these Terms or any applicable law;</li>
            <li>
              Content you post, publish, or submit through the Platform,
              including any infringement of third-party intellectual property or
              privacy rights;
            </li>
            <li>
              Any dispute between you and another user (Merchant or Creator)
              arising from a Campaign.
            </li>
          </ul>

          <Divider />

          {/* ── 11. Termination ── */}
          <SectionH2 id="s11" num="11 /">
            Suspension &amp; Termination
          </SectionH2>
          <p>
            Push may suspend or terminate your account at any time, with or
            without notice, for any of the following reasons:
          </p>
          <ul>
            <li>
              Material breach of these Terms or the Acceptable Use Policy;
            </li>
            <li>Detection of fraud or artificial attribution inflation;</li>
            <li>Failure to maintain eligibility requirements (Section 3);</li>
            <li>Non-payment of amounts owed (Merchants);</li>
            <li>Legal or regulatory requirement; or</li>
            <li>
              Conduct that Push, in its sole discretion, determines to be
              harmful to other users or the Platform.
            </li>
          </ul>
          <p>
            Upon termination: your license to use the Platform terminates
            immediately; any pending payouts owed to Creators for verified
            Attribution Events prior to termination will be released on the
            standard schedule; Merchant subscription fees for the current
            billing period are non-refundable except where required by law.
          </p>
          <p>
            You may terminate your account at any time by contacting{" "}
            <a href="mailto:support@pushnyc.co">support@pushnyc.co</a>.
            Termination does not relieve you of obligations incurred prior to
            termination.
          </p>

          <Divider />

          {/* ── 12. Dispute Resolution ── */}
          <SectionH2 id="s12" num="12 /">
            Dispute Resolution &amp; Arbitration
          </SectionH2>
          <p>
            <strong>Informal Resolution:</strong> Before initiating formal
            proceedings, you agree to contact Push at{" "}
            <a href="mailto:legal@pushnyc.co">legal@pushnyc.co</a> and attempt
            to resolve the dispute informally for at least 30 days.
          </p>
          <p>
            <strong>Binding Arbitration:</strong> If informal resolution fails,
            disputes shall be resolved by binding individual arbitration
            administered by the American Arbitration Association (AAA) under its
            Consumer Arbitration Rules, except as noted below. The arbitration
            will be conducted in New York, NY. The Federal Arbitration Act
            governs this provision.
          </p>
          <p>
            <strong>Class Action Waiver:</strong> You waive any right to
            participate in class action litigation or class-wide arbitration.
            Each dispute must be brought individually.
          </p>
          <p>
            <strong>Exceptions:</strong> The following may be brought in court:
            (i) claims within small claims court jurisdiction; (ii) IP
            infringement or enforcement; (iii) injunctive or other equitable
            relief where delay would cause irreparable harm.
          </p>

          <Divider />

          {/* ── 13. Governing Law ── */}
          <SectionH2 id="s13" num="13 /">
            Governing Law &amp; Jurisdiction
          </SectionH2>
          <p>
            These Terms are governed by the laws of the State of New York, USA,
            without regard to its conflict-of-law provisions. For any dispute
            not subject to arbitration, you consent to the exclusive
            jurisdiction of the state and federal courts located in New York
            County, New York.
          </p>

          <Divider />

          {/* ── 14. Force Majeure ── */}
          <SectionH2 id="s14" num="14 /">
            Force Majeure
          </SectionH2>
          <p>
            Push shall not be liable for any failure or delay in performance
            resulting from causes beyond our reasonable control, including acts
            of God, government actions, pandemic, civil unrest, cyberattacks by
            third parties, or critical infrastructure failure. We will notify
            affected users as soon as reasonably practicable and resume services
            as quickly as circumstances permit.
          </p>

          <Divider />

          {/* ── 15. General Provisions ── */}
          <SectionH2 id="s15" num="15 /">
            General Provisions
          </SectionH2>
          <ul>
            {[
              [
                "Entire Agreement:",
                "These Terms, together with the Privacy Policy, Cookie Policy, and Acceptable Use Policy, constitute the entire agreement between you and Push regarding the Platform.",
              ],
              [
                "Severability:",
                "If any provision is found unenforceable, the remaining provisions remain in full force.",
              ],
              [
                "Waiver:",
                "Push's failure to enforce any right or provision does not constitute a waiver of that right.",
              ],
              [
                "Assignment:",
                "You may not assign your rights or obligations under these Terms without Push's prior written consent. Push may assign these Terms in connection with a merger, acquisition, or asset sale.",
              ],
              [
                "Notices:",
                "Legal notices to Push must be sent by email to legal@pushnyc.co and by post to Push NYC, Inc., 28 West 23rd St, New York, NY 10010, Attn: Legal. Notices to you will be sent to your registered email address.",
              ],
              [
                "Language:",
                "These Terms are written in English. Any translations are provided for convenience only; the English version controls in the event of conflict.",
              ],
            ].map(([label, desc], i) => (
              <li key={i}>
                <strong>{label}</strong> {desc}
              </li>
            ))}
          </ul>
        </article>
      </div>

      {/* ── DOCUMENT FOOTER BAR ──────────────────────────────────── */}
      <div className="legal-footer-bar">
        <div className="legal-footer-bar__inner">
          <p className="legal-footer-bar__text">
            Questions? <a href="mailto:legal@pushnyc.co">legal@pushnyc.co</a>
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
