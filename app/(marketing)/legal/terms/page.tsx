import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service — Push",
  description:
    "The legal agreement governing use of the Push creator attribution platform for Merchants and Creators.",
};

export default function TermsPage() {
  return (
    <>
      {/* Page Header */}
      <header className="legal-header">
        <p className="legal-header__eyebrow">Legal / Terms</p>
        <h1 className="legal-header__title">Terms of Service</h1>
        <div className="legal-header__meta">
          <span className="legal-header__meta-item">
            <strong>Last updated:</strong>&nbsp;April 15, 2026
          </span>
          <span className="legal-header__meta-divider" aria-hidden="true" />
          <span className="legal-header__meta-item">Version 5.0</span>
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
            &nbsp;Estimated reading time:&nbsp;<strong>15 min</strong>
          </span>
        </div>
      </header>

      {/* Introduction */}
      <div className="legal-infobox">
        <p className="legal-infobox__title">Important</p>
        <p>
          These Terms of Service (&ldquo;Terms&rdquo;) constitute a binding
          legal agreement between you and Push NYC, Inc. By accessing or using
          the Platform, you agree to these Terms. If you do not agree, do not
          use the Platform. Capitalized terms not defined inline are defined in
          Section 2.
        </p>
      </div>

      {/* ── 1. Acceptance ──────────────────────────────────── */}
      <h2 id="s1" className="legal-section-heading">
        <span className="legal-section-heading__number">01 /</span>
        Acceptance of Terms
      </h2>
      <p>
        By creating an account, clicking &ldquo;I agree,&rdquo; or otherwise
        accessing or using the Push platform (the &ldquo;Platform&rdquo;), you
        (&ldquo;User,&rdquo; &ldquo;you&rdquo;) agree to be bound by these
        Terms, our{" "}
        <a href="/legal/privacy" style={{ color: "var(--tertiary)" }}>
          Privacy Policy
        </a>
        ,{" "}
        <a href="/legal/cookies" style={{ color: "var(--tertiary)" }}>
          Cookie Policy
        </a>
        , and{" "}
        <a href="/legal/acceptable-use" style={{ color: "var(--tertiary)" }}>
          Acceptable Use Policy
        </a>
        , all of which are incorporated herein by reference.
      </p>
      <p>
        If you are accepting these Terms on behalf of a legal entity (a
        business, LLC, corporation, or partnership), you represent and warrant
        that you have authority to bind that entity. In that case,
        &ldquo;you&rdquo; refers to both you individually and the entity.
      </p>
      <p>
        We may update these Terms at any time. Material updates will be
        communicated via email with at least 14 days&apos; notice. Continued use
        after the effective date constitutes acceptance of the updated Terms.
      </p>

      <hr className="legal-divider" />

      {/* ── 2. Definitions ─────────────────────────────────── */}
      <h2 id="s2" className="legal-section-heading">
        <span className="legal-section-heading__number">02 /</span>
        Definitions
      </h2>
      <dl>
        <dt>Platform</dt>
        <dd>
          The Push web application, mobile application, APIs, dashboard, and all
          associated software services operated by Push NYC, Inc.
        </dd>
        <dt>Creator</dt>
        <dd>
          A user registered under the Creator role, assigned to a tier (Nano,
          Micro, Rising, Pro, Elite, or Legend) based on the Creator Scoring
          Model.
        </dd>
        <dt>Merchant</dt>
        <dd>
          A business entity subscribed to a Push plan (Lite $0/mo, Essentials
          $99/mo, Pro outcome-based, or Advanced $349/mo) to run attribution
          campaigns.
        </dd>
        <dt>Campaign</dt>
        <dd>
          A defined marketing engagement created by a Merchant, specifying
          campaign objectives, budget, payout structure, attribution window, and
          eligible Creator tiers.
        </dd>
        <dt>QR Code</dt>
        <dd>
          A unique, cryptographically signed two-dimensional barcode generated
          by the Platform and assigned to a specific Creator-Campaign pairing.
        </dd>
        <dt>Attribution Event</dt>
        <dd>
          A verified customer interaction (scan, visit, or purchase) linked to a
          Creator and Campaign within the defined attribution window, as
          determined by the Push attribution engine.
        </dd>
        <dt>GMV</dt>
        <dd>
          Gross Merchandise Value: the total customer spend attributed to a
          Campaign, used as a basis for performance-based payout calculations.
        </dd>
        <dt>Payout</dt>
        <dd>
          Monetary compensation released to a Creator following verification of
          Attribution Events, calculated per the applicable Campaign payout
          schedule and Creator tier multiplier.
        </dd>
        <dt>Content</dt>
        <dd>
          Any photographs, videos, text, captions, stories, reels, or other
          media produced by a Creator in connection with a Campaign.
        </dd>
        <dt>Push IP</dt>
        <dd>
          All intellectual property owned or licensed by Push NYC, Inc.,
          including software, algorithms, QR attribution technology, brand
          assets, and Platform design.
        </dd>
      </dl>

      <hr className="legal-divider" />

      {/* ── 3. Eligibility ─────────────────────────────────── */}
      <h2 id="s3" className="legal-section-heading">
        <span className="legal-section-heading__number">03 /</span>
        Eligibility &amp; Account Registration
      </h2>
      <p>You must meet the following requirements to use the Platform:</p>
      <ul>
        <li>
          You must be at least <strong>18 years of age</strong>. The Platform is
          not available to minors.
        </li>
        <li>
          You must have legal capacity to enter into a binding contract under
          the laws of your jurisdiction.
        </li>
        <li>
          Your use must not be prohibited by applicable law (including US export
          controls and sanctions lists).
        </li>
        <li>
          Creators must have an active, publicly visible social media presence
          on at least one supported platform (Instagram, TikTok, or YouTube) at
          the time of registration.
        </li>
        <li>
          Merchants must have a valid US business registration and a physical
          business location in the New York City metropolitan area (the five
          boroughs, or Nassau, Suffolk, or Westchester counties).
        </li>
      </ul>

      <h3>Account Security</h3>
      <p>
        You are responsible for maintaining the confidentiality of your account
        credentials. You must notify us immediately at{" "}
        <a
          href="mailto:security@pushnyc.co"
          style={{ color: "var(--tertiary)" }}
        >
          security@pushnyc.co
        </a>{" "}
        if you suspect unauthorized access. Push is not liable for losses
        resulting from unauthorized account access where you failed to maintain
        adequate credential security.
      </p>
      <p>
        You may not create more than one account per person or entity without
        our prior written consent. Duplicate accounts are grounds for immediate
        suspension.
      </p>

      <hr className="legal-divider" />

      {/* ── 4. Creator Terms ───────────────────────────────── */}
      <h2 id="s4" className="legal-section-heading">
        <span className="legal-section-heading__number">04 /</span>
        Creator-Specific Terms
      </h2>

      <h3>4.1 Creator Tiers</h3>
      <p>
        Creators are assigned to one of six tiers (Nano, Micro, Rising, Pro,
        Elite, Legend) based on the Push Creator Scoring Model, which evaluates
        follower count, engagement rate, content quality score, verification
        status, and prior campaign performance. Tier assignment is reviewed
        monthly and may be upgraded or downgraded based on current metrics.
      </p>
      <p>
        Tier assignment affects: campaign eligibility, payout multipliers,
        priority matching to high-value Merchant campaigns, and the Creator
        dashboard feature set. Push reserves the right to modify the scoring
        criteria and tier thresholds with 30 days&apos; notice.
      </p>

      <h3>4.2 Campaign Participation</h3>
      <p>When you accept a Campaign, you agree to:</p>
      <ul>
        <li>
          Create and publish original Content that accurately represents the
          Merchant and complies with FTC Disclosure Requirements (16 CFR Part
          255), including clear disclosure of the paid partnership (e.g.,
          &ldquo;#ad&rdquo; or &ldquo;Paid partnership with [Merchant]&rdquo;).
        </li>
        <li>
          Use only the Push-issued QR code assigned to your Creator-Campaign
          pairing. Sharing, duplicating, or redistributing QR codes is strictly
          prohibited.
        </li>
        <li>
          Not artificially inflate Attribution Events through bots, click farms,
          purchased scans, coordinated inauthentic behavior, or any other
          fraudulent means.
        </li>
        <li>
          Comply with the content guidelines specified in each Campaign brief,
          including any brand safety requirements set by the Merchant.
        </li>
        <li>
          Submit required content deliverables within the Campaign timeline.
          Late submissions may result in payout adjustment or Campaign
          disqualification at Merchant discretion.
        </li>
      </ul>

      <h3>4.3 Payout Terms</h3>
      <p>
        Payouts are calculated based on verified Attribution Events within the
        Campaign attribution window (typically 7–30 days, specified per
        Campaign). Push uses a multi-signal verification model that includes
        device fingerprinting, IP analysis, scan velocity monitoring, and GPS
        cell validation.
      </p>
      <p>
        Payouts are released to your linked Stripe account within 5–10 business
        days following Campaign close and verification. A{" "}
        <strong>10% platform fee</strong> is deducted from gross Creator
        earnings. Push reserves the right to withhold or claw back payouts where
        fraud is detected, subject to a right of appeal within 14 days of
        notification.
      </p>
      <p>
        Creators earning over $600 USD in a calendar year will receive a Form
        1099-NEC. You are solely responsible for your tax obligations as an
        independent contractor.
      </p>

      <h3>4.4 Content License</h3>
      <p>
        By submitting Content through the Platform, you grant Push and the
        applicable Merchant a non-exclusive, royalty-free, worldwide,
        sublicensable license to use, reproduce, distribute, adapt, and display
        the Content for purposes of: campaign reporting, case studies, marketing
        materials (with prior notice), and Platform demonstration. This license
        survives termination for content already published.
      </p>

      <hr className="legal-divider" />

      {/* ── 5. Merchant Terms ──────────────────────────────── */}
      <h2 id="s5" className="legal-section-heading">
        <span className="legal-section-heading__number">05 /</span>
        Merchant-Specific Terms
      </h2>

      <h3>5.1 Subscription Plans</h3>
      <p>
        Push offers four subscription tiers: Lite ($0/month), Essentials
        ($99/month), Pro (outcome-based — 5% of attributed revenue, capped
        $179/month, floor $49/month), and Advanced ($349/month). Plan features,
        campaign limits, and Creator tier access are as specified on the pricing
        page at the time of subscription. Push reserves the right to modify plan
        pricing with 30 days&apos; advance notice to existing subscribers.
        Legacy v4 cohorts (Starter, Growth, Scale) are honored per their
        original subscription contract.
      </p>
      <p>
        Subscriptions are billed monthly on the anniversary of the subscription
        date via Stripe. All fees are in USD. Failure to maintain a valid
        payment method may result in service suspension.
      </p>

      <h3>5.2 Campaign Creation &amp; Management</h3>
      <p>Merchants are responsible for:</p>
      <ul>
        <li>
          Defining accurate campaign briefs, including product/service
          descriptions, eligible Creators, payout structure, attribution window,
          and brand guidelines.
        </li>
        <li>
          Ensuring that campaign terms comply with applicable advertising law,
          including FTC guidelines, New York State truth-in-advertising
          requirements, and industry-specific regulations (e.g., alcohol, food
          service).
        </li>
        <li>
          Maintaining sufficient funds in the campaign budget. Push will pause a
          Campaign automatically if projected payout obligations exceed the
          committed budget.
        </li>
        <li>
          Providing timely feedback on Creator content submissions within the
          review window (48 hours unless otherwise specified).
        </li>
      </ul>

      <h3>5.3 Attribution Acceptance</h3>
      <p>
        Merchants accept that Push attribution data is the authoritative source
        for payout calculations. Merchants may dispute individual Attribution
        Events within 7 days of a Campaign closing report, providing documentary
        evidence of the alleged inaccuracy. Push will review disputes within 10
        business days and issue a final determination. Payout adjustments
        resulting from upheld disputes will be applied to the next billing
        cycle.
      </p>

      <h3>5.4 Merchant Conduct</h3>
      <p>
        Merchants may not: contact Creators outside the Platform to circumvent
        fees; require Creators to make personal purchases as a condition of
        participation; discriminate against Creators on protected grounds; or
        request Content that violates our Acceptable Use Policy.
      </p>

      <hr className="legal-divider" />

      {/* ── 6. Prohibited Conduct ──────────────────────────── */}
      <h2 id="s6" className="legal-section-heading">
        <span className="legal-section-heading__number">06 /</span>
        Prohibited Conduct
      </h2>
      <p>
        In addition to obligations in the Acceptable Use Policy, you must not:
      </p>
      <ol>
        <li>
          Reverse-engineer, decompile, or disassemble any part of the Platform
          or its QR attribution algorithms.
        </li>
        <li>
          Scrape, crawl, or extract data from the Platform using automated means
          without written authorization.
        </li>
        <li>
          Interfere with the integrity, security, or availability of the
          Platform, including DDoS attacks, SQL injection, or cross-site
          scripting.
        </li>
        <li>
          Circumvent any rate limits, access controls, or technical protection
          measures.
        </li>
        <li>
          Use the Platform to violate any applicable law or regulation,
          including securities law, privacy law, or consumer protection law.
        </li>
        <li>
          Impersonate Push, a Merchant, a Creator, or any other person or
          entity.
        </li>
        <li>
          Use Campaign materials or QR codes for any purpose other than the
          specified Campaign.
        </li>
        <li>
          Engage in or facilitate any form of artificial scan inflation,
          including via bots, VPNs, proxy networks, or coordinated human effort.
        </li>
      </ol>
      <p>
        Violation of any of the above is grounds for immediate account
        suspension and may result in legal action, including claims for damages
        under the Computer Fraud and Abuse Act (18 U.S.C. § 1030) and applicable
        state law.
      </p>

      <hr className="legal-divider" />

      {/* ── 7. Intellectual Property ───────────────────────── */}
      <h2 id="s7" className="legal-section-heading">
        <span className="legal-section-heading__number">07 /</span>
        Intellectual Property
      </h2>
      <p>
        All Push IP — including the Platform software, QR attribution system,
        scoring algorithms, brand marks, design, and documentation — is owned
        exclusively by Push NYC, Inc. or its licensors. Nothing in these Terms
        grants you any rights to Push IP beyond a limited, non-exclusive,
        non-transferable license to use the Platform for its intended purpose
        during your active subscription or registration.
      </p>
      <p>
        You retain ownership of Content you create. By participating in a
        Campaign, you grant the limited license described in Section 4.4.
      </p>
      <p>
        The &ldquo;Push&rdquo; name, logo, and &ldquo;Powered by Push&rdquo;
        badge are registered trademarks of Push NYC, Inc. You may use the badge
        solely to indicate participation in a verified Push campaign, subject to
        our Brand Guidelines.
      </p>

      <hr className="legal-divider" />

      {/* ── 8. Disclaimers ─────────────────────────────────── */}
      <h2 id="s8" className="legal-section-heading">
        <span className="legal-section-heading__number">08 /</span>
        Disclaimers &amp; Warranties
      </h2>
      <p>
        THE PLATFORM IS PROVIDED &ldquo;AS IS&rdquo; AND &ldquo;AS
        AVAILABLE&rdquo; WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
        INCLUDING WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR
        PURPOSE, OR NON-INFRINGEMENT. PUSH DOES NOT WARRANT THAT THE PLATFORM
        WILL BE UNINTERRUPTED, ERROR-FREE, OR FREE FROM HARMFUL COMPONENTS.
      </p>
      <p>
        Attribution data is provided in good faith based on our verification
        systems. Push does not guarantee any specific level of campaign
        performance, foot traffic, GMV, or return on investment for Merchants.
        Historical performance data is illustrative only.
      </p>
      <p>
        Push is not a party to any agreement between Merchants and Creators
        beyond facilitating connections through the Platform. Push does not
        guarantee Creator availability, content quality beyond defined tier
        standards, or campaign outcomes.
      </p>

      <hr className="legal-divider" />

      {/* ── 9. Limitation of Liability ─────────────────────── */}
      <h2 id="s9" className="legal-section-heading">
        <span className="legal-section-heading__number">09 /</span>
        Limitation of Liability
      </h2>
      <p>
        TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, IN NO EVENT SHALL
        PUSH NYC, INC., ITS OFFICERS, DIRECTORS, EMPLOYEES, OR AGENTS BE LIABLE
        FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, PUNITIVE, OR
        EXEMPLARY DAMAGES, INCLUDING LOST PROFITS, LOSS OF DATA, LOSS OF
        GOODWILL, OR BUSINESS INTERRUPTION, ARISING OUT OF OR RELATING TO YOUR
        USE OF THE PLATFORM, EVEN IF PUSH HAS BEEN ADVISED OF THE POSSIBILITY OF
        SUCH DAMAGES.
      </p>
      <p>
        PUSH&apos;S TOTAL AGGREGATE LIABILITY TO YOU FOR ANY CLAIMS ARISING OUT
        OF OR RELATING TO THESE TERMS OR YOUR USE OF THE PLATFORM SHALL NOT
        EXCEED THE GREATER OF: (A) THE TOTAL FEES PAID BY YOU TO PUSH IN THE 12
        MONTHS PRECEDING THE CLAIM, OR (B) ONE HUNDRED US DOLLARS ($100).
      </p>
      <p>
        Some jurisdictions do not allow certain liability exclusions; in such
        cases, Push&apos;s liability is limited to the fullest extent permitted
        by law.
      </p>

      <hr className="legal-divider" />

      {/* ── 10. Indemnification ────────────────────────────── */}
      <h2 id="s10" className="legal-section-heading">
        <span className="legal-section-heading__number">10 /</span>
        Indemnification
      </h2>
      <p>
        You agree to indemnify, defend, and hold harmless Push NYC, Inc., its
        officers, directors, employees, contractors, and agents from and against
        any claims, damages, losses, liabilities, costs, and expenses (including
        reasonable attorneys&apos; fees) arising from or related to:
      </p>
      <ul>
        <li>Your use of or access to the Platform;</li>
        <li>Your violation of these Terms or any applicable law;</li>
        <li>
          Content you post, publish, or submit through the Platform, including
          any infringement of third-party intellectual property or privacy
          rights;
        </li>
        <li>
          Any dispute between you and another user (Merchant or Creator) arising
          from a Campaign.
        </li>
      </ul>

      <hr className="legal-divider" />

      {/* ── 11. Termination ────────────────────────────────── */}
      <h2 id="s11" className="legal-section-heading">
        <span className="legal-section-heading__number">11 /</span>
        Suspension &amp; Termination
      </h2>
      <p>
        Push may suspend or terminate your account at any time, with or without
        notice, for any of the following reasons:
      </p>
      <ul>
        <li>Material breach of these Terms or the Acceptable Use Policy;</li>
        <li>Detection of fraud or artificial attribution inflation;</li>
        <li>Failure to maintain eligibility requirements (Section 3);</li>
        <li>Non-payment of amounts owed (Merchants);</li>
        <li>Legal or regulatory requirement; or</li>
        <li>
          Conduct that Push, in its sole discretion, determines to be harmful to
          other users or the Platform.
        </li>
      </ul>
      <p>
        Upon termination: your license to use the Platform terminates
        immediately; any pending payouts owed to Creators for verified
        Attribution Events prior to termination will be released on the standard
        schedule; Merchant subscription fees for the current billing period are
        non-refundable except where required by law.
      </p>
      <p>
        You may terminate your account at any time by contacting{" "}
        <a
          href="mailto:support@pushnyc.co"
          style={{ color: "var(--tertiary)" }}
        >
          support@pushnyc.co
        </a>
        . Termination does not relieve you of obligations incurred prior to
        termination.
      </p>

      <hr className="legal-divider" />

      {/* ── 12. Dispute Resolution ─────────────────────────── */}
      <h2 id="s12" className="legal-section-heading">
        <span className="legal-section-heading__number">12 /</span>
        Dispute Resolution &amp; Arbitration
      </h2>
      <p>
        <strong>Informal Resolution:</strong> Before initiating formal
        proceedings, you agree to contact Push at{" "}
        <a href="mailto:legal@pushnyc.co" style={{ color: "var(--tertiary)" }}>
          legal@pushnyc.co
        </a>{" "}
        and attempt to resolve the dispute informally for at least 30 days.
      </p>
      <p>
        <strong>Binding Arbitration:</strong> If informal resolution fails,
        disputes shall be resolved by binding individual arbitration
        administered by the American Arbitration Association (AAA) under its
        Consumer Arbitration Rules, except as noted below. The arbitration will
        be conducted in New York, NY. The Federal Arbitration Act governs this
        provision.
      </p>
      <p>
        <strong>Class Action Waiver:</strong> You waive any right to participate
        in class action litigation or class-wide arbitration. Each dispute must
        be brought individually.
      </p>
      <p>
        <strong>Exceptions:</strong> The following may be brought in court: (i)
        claims within small claims court jurisdiction; (ii) IP infringement or
        enforcement; (iii) injunctive or other equitable relief where delay
        would cause irreparable harm.
      </p>

      <hr className="legal-divider" />

      {/* ── 13. Governing Law ──────────────────────────────── */}
      <h2 id="s13" className="legal-section-heading">
        <span className="legal-section-heading__number">13 /</span>
        Governing Law &amp; Jurisdiction
      </h2>
      <p>
        These Terms are governed by the laws of the State of New York, USA,
        without regard to its conflict-of-law provisions. For any dispute not
        subject to arbitration, you consent to the exclusive jurisdiction of the
        state and federal courts located in New York County, New York.
      </p>

      <hr className="legal-divider" />

      {/* ── 14. Force Majeure ──────────────────────────────── */}
      <h2 id="s14" className="legal-section-heading">
        <span className="legal-section-heading__number">14 /</span>
        Force Majeure
      </h2>
      <p>
        Push shall not be liable for any failure or delay in performance
        resulting from causes beyond our reasonable control, including acts of
        God, government actions, pandemic, civil unrest, cyberattacks by third
        parties, or critical infrastructure failure. We will notify affected
        users as soon as reasonably practicable and resume services as quickly
        as circumstances permit.
      </p>

      <hr className="legal-divider" />

      {/* ── 15. General Provisions ─────────────────────────── */}
      <h2 id="s15" className="legal-section-heading">
        <span className="legal-section-heading__number">15 /</span>
        General Provisions
      </h2>
      <ul>
        <li>
          <strong>Entire Agreement:</strong> These Terms, together with the
          Privacy Policy, Cookie Policy, and Acceptable Use Policy, constitute
          the entire agreement between you and Push regarding the Platform.
        </li>
        <li>
          <strong>Severability:</strong> If any provision is found
          unenforceable, the remaining provisions remain in full force.
        </li>
        <li>
          <strong>Waiver:</strong> Push&apos;s failure to enforce any right or
          provision does not constitute a waiver of that right.
        </li>
        <li>
          <strong>Assignment:</strong> You may not assign your rights or
          obligations under these Terms without Push&apos;s prior written
          consent. Push may assign these Terms in connection with a merger,
          acquisition, or asset sale.
        </li>
        <li>
          <strong>Notices:</strong> Legal notices to Push must be sent by email
          to{" "}
          <a
            href="mailto:legal@pushnyc.co"
            style={{ color: "var(--tertiary)" }}
          >
            legal@pushnyc.co
          </a>{" "}
          and by post to Push NYC, Inc., 28 West 23rd St, New York, NY 10010,
          Attn: Legal. Notices to you will be sent to your registered email
          address.
        </li>
        <li>
          <strong>Language:</strong> These Terms are written in English. Any
          translations are provided for convenience only; the English version
          controls in the event of conflict.
        </li>
      </ul>

      <div className="legal-callout">
        <p>
          <strong>Questions about these Terms?</strong> Contact our legal team
          at{" "}
          <a href="mailto:legal@pushnyc.co" style={{ color: "var(--primary)" }}>
            legal@pushnyc.co
          </a>
          . We aim to respond within 5 business days.
        </p>
      </div>
    </>
  );
}
