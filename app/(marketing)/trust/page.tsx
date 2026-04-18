"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
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

function IconGlobe() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  );
}

function IconCheck() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function IconChevronDown() {
  return (
    <svg
      className="trust-faq-chevron"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

function IconMail() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="2" y="4" width="20" height="16" />
      <polyline points="2 4 12 13 22 4" />
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
const VERIFY_STEPS = [
  {
    num: "01",
    label: "Step 1",
    title: "Real-time device fingerprinting",
    body: "Every QR scan generates a unique device fingerprint. We cross-reference device ID, browser signature, and session token to ensure the same physical device isn't redeeming multiple payouts across different campaigns.",
  },
  {
    num: "02",
    label: "Step 2",
    title: "Geographic cross-check",
    body: "The scan location is matched against the merchant's registered address. If the GPS coordinates of the scan diverge from the merchant's location by more than a safe radius, the visit is flagged automatically — no exceptions.",
  },
  {
    num: "03",
    label: "Step 3",
    title: "Temporal velocity detection",
    body: "Physics can't lie. If a creator's QR code is scanned at two locations that are physically impossible to travel between in the elapsed time, our velocity engine flags it as \"impossible speed\" and holds the payout for review.",
  },
  {
    num: "04",
    label: "Step 4",
    title: "Human review for high-stakes",
    body: "Payouts above a certain threshold, or anything our automated systems flag as anomalous, are reviewed by a real Trust & Safety analyst before funds are released. You always have a human backstop.",
  },
];

const MONEY_ITEMS = [
  {
    title: "Escrow-held payouts",
    desc: "Creator earnings are held in an escrow account and only released after verification is complete. Your money never moves until we're certain a real visit happened.",
  },
  {
    title: "7-day merchant refund window",
    desc: "If a verified visit is later disputed and confirmed fraudulent by our review team, merchants receive a full refund within 7 business days. No questions, no forms.",
  },
  {
    title: "100% payment guarantee",
    desc: "On all verified visits, creators receive 100% of the agreed payout. Push never takes a hidden cut from creator earnings on confirmed campaigns.",
  },
];

const IDENTITY_RIGHTS = [
  {
    title: "KYC data encrypted at rest",
    desc: "Identity documents submitted for verification are encrypted using AES-256 and stored separately from your profile data. Even our engineers can't read them in plain text.",
  },
  {
    title: "Never sold, never shared",
    desc: "Your personal information is never sold to third parties or shared with merchants beyond your public creator handle. Merchants only see what you choose to publish.",
  },
  {
    title: "GDPR right-to-delete",
    desc: "Submit a deletion request at any time. We will permanently remove all personal data from our systems within 30 days, including backups, as required by GDPR Article 17.",
  },
  {
    title: "Minimal data collection",
    desc: "We collect only what is necessary to run the platform. No behavioral tracking beyond what's needed for fraud detection. No ad profiles. No data brokers.",
  },
];

const DISPUTE_TIMELINE = [
  {
    time: "Within 24 hours",
    title: "You submit a dispute",
    body: "Use the in-app dispute button on any campaign or payout. Include what happened and any supporting screenshots. We acknowledge receipt within 24 hours.",
  },
  {
    time: "1–3 business days",
    title: "Trust & Safety investigates",
    body: "Our team reviews all available signals: scan logs, device fingerprints, geo data, velocity checks, and your account history. You'll receive status updates by email.",
  },
  {
    time: "3–5 business days",
    title: "Decision delivered",
    body: "We notify you of the outcome with a full written explanation. If the dispute is resolved in your favor, funds or refunds are processed immediately.",
  },
  {
    time: "Resolution",
    title: "Funds or refund issued",
    body: "Resolved disputes are settled within 2 business days of the final decision. Creators receive missed payouts; merchants receive full refunds on fraudulent visits.",
  },
];

const CERTS = [
  {
    title: "SOC 2 Type II",
    body: "Our infrastructure and data handling practices are audited annually against the AICPA SOC 2 framework by an independent third-party auditor.",
    link: "#",
    linkText: "View attestation",
    icon: <IconShield />,
  },
  {
    title: "Annual pentest",
    body: "An external security firm runs a full penetration test against our API, mobile surface, and QR verification pipeline every year. Last test: Q1 2026.",
    link: "#",
    linkText: "View summary",
    icon: <IconLock />,
  },
  {
    title: "Status page",
    body: "Real-time uptime and incident history for all Push services. Subscribe to get notified the moment anything affects your payouts or campaign access.",
    link: "https://status.push.nyc",
    linkText: "View status page",
    icon: <IconGlobe />,
  },
];

const TESTIMONIALS = [
  {
    quote:
      "I was skeptical about the escrow model at first. Then my first payout hit exactly when they said it would, and I've never had a single issue with a disputed visit in 8 months.",
    name: "Maya R.",
    meta: "Food Creator · Operator Tier",
    initial: "M",
    type: "creator" as const,
  },
  {
    quote:
      "The geographic check saved me from a scam attempt in my first week. Someone tried to scan from New Jersey. Push flagged it before I even noticed. That's the system working.",
    name: "Daniel K.",
    meta: "Lifestyle Creator · Explorer Tier",
    initial: "D",
    type: "creator" as const,
  },
  {
    quote:
      "I deleted my account once and came back. Push actually deleted my data and when I signed up again I had to re-verify. That's real GDPR compliance, not just a checkbox.",
    name: "Priya L.",
    meta: "Fashion Creator · Proven Tier",
    initial: "P",
    type: "creator" as const,
  },
  {
    quote:
      "We had a disputed payout in month two. Push's team investigated within 48 hours, sent a written explanation, and refunded us the same day. That's the kind of speed I expect.",
    name: "Marco T.",
    meta: "Merchant · Ramen & Co., East Village",
    initial: "M",
    type: "merchant" as const,
  },
  {
    quote:
      "The attribution dashboard caught three fraudulent attempts in our first campaign. We didn't lose a dollar. The real-time flagging is genuinely impressive for a platform this size.",
    name: "Sarah W.",
    meta: "Merchant · The Daily Press, Williamsburg",
    initial: "S",
    type: "merchant" as const,
  },
  {
    quote:
      "I appreciate that Push tells me exactly what data they collect and why. No vague privacy policy — a clear list. As a small business owner, that transparency matters.",
    name: "James O.",
    meta: "Merchant · Uptown Barber Studio, Harlem",
    initial: "J",
    type: "merchant" as const,
  },
];

const FAQS = [
  {
    q: "How does Push prevent a creator from scanning their own QR code multiple times?",
    a: "Each QR code is linked to a unique campaign session. Once a device fingerprint registers a scan for a given campaign, subsequent scans from the same fingerprint are rejected. Additionally, temporal velocity checks make it impossible to claim visits at impossible speeds.",
  },
  {
    q: "What happens if a merchant disputes a payout that I know is legitimate?",
    a: "Our Trust & Safety team reviews all disputes independently. We look at device fingerprint data, GPS verification logs, and scan timestamps. If the evidence supports your visit, you will be paid. We have resolved 94% of creator-filed disputes in the creator's favor.",
  },
  {
    q: "Is my bank account or payment information ever visible to merchants?",
    a: "Never. Merchants see your creator handle and published profile only. Payment information is stored encrypted in our payment processor (Stripe) and is never accessible to merchants, Push staff, or any third party beyond payment processing.",
  },
  {
    q: "What data does Push collect when I scan a QR code?",
    a: "We collect: (1) device fingerprint — a hash of device/browser signals, not personal identifiers; (2) GPS coordinates at time of scan; (3) timestamp; and (4) campaign ID. We do not collect contact list data, microphone access, camera feed beyond the QR scan, or browsing history.",
  },
  {
    q: "How long does Push retain my personal data after I delete my account?",
    a: "We permanently delete all personal data within 30 days of a confirmed deletion request. Transactional records required for legal and tax compliance are retained for up to 7 years in anonymized form only, as required by law.",
  },
  {
    q: "What is the 99.97% uptime figure based on?",
    a: "It reflects actual measured uptime of the Push API and QR verification pipeline over the trailing 12 months (April 2025 – April 2026), as tracked on our public status page. Planned maintenance windows are excluded by industry convention.",
  },
  {
    q: "Can Push see the content of my posts or messages?",
    a: "No. Push does not have access to the contents of your social media posts, DMs, or any off-platform communication. Our attribution system only reads the scan event metadata, not your content.",
  },
  {
    q: "What does 'SOC 2 Type II' actually mean for me?",
    a: "SOC 2 Type II is an independent audit that verifies Push has rigorous security controls in place and that those controls worked as intended over a sustained period (at least 6 months). It is one of the most demanding security certifications for SaaS platforms in the US.",
  },
  {
    q: "What if Push itself goes out of business? What happens to my earnings?",
    a: "Creator earnings held in escrow are held in a separate custodial account that is not commingled with Push operating funds. In the event of insolvency, escrowed creator funds are protected as segregated assets and would be returned to creators first.",
  },
  {
    q: "How do I report a security vulnerability in Push?",
    a: "Email security@push.nyc with a clear description of the vulnerability. We operate a responsible disclosure policy with a 90-day remediation SLA. Confirmed high-severity reports are eligible for a thank-you credit. We never pursue legal action against good-faith security researchers.",
  },
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

  return (
    <div className="trust-page" ref={pageRef}>
      {/* ── 1. Hero ────────────────────────────────────────────── */}
      <section className="trust-hero" aria-labelledby="trust-hero-heading">
        <div className="trust-container">
          <div className="trust-hero-inner">
            <span className="trust-hero-section-num">Trust Center</span>
            <h1 id="trust-hero-heading" className="trust-hero-headline reveal">
              Trust, <em>verified.</em>
            </h1>
            <p className="trust-hero-sub reveal" data-delay="1">
              Why 340+ creators and 50+ NYC merchants put their money on Push.
              Every payout, every scan, every identity — protected by the same
              systems that process millions of dollars in verified visits.
            </p>
            <p className="trust-hero-footnote reveal" data-delay="2">
              Figures reflect platform data as of April 2026.
            </p>
          </div>
        </div>
      </section>

      {/* ── 2. Key Metrics Strip ─────────────────────────────── */}
      <section className="trust-metrics" aria-label="Platform trust metrics">
        <div className="trust-container">
          <div className="trust-metrics-inner">
            <div className="trust-metrics-grid">
              <div className="trust-metric-item reveal">
                <span className="trust-metric-number">
                  99.97
                  <span style={{ fontSize: "0.5em", fontWeight: 400 }}>%</span>
                </span>
                <span className="trust-metric-label">
                  Uptime, last 12 months
                </span>
                <span className="trust-metric-note">
                  API + QR verification pipeline
                </span>
              </div>
              <div className="trust-metric-item reveal" data-delay="1">
                <span className="trust-metric-number trust-metric-number--highlight">
                  $0
                </span>
                <span className="trust-metric-label">
                  Verified fraud payouts
                </span>
                <span className="trust-metric-note">
                  Zero-tolerance fraud policy
                </span>
              </div>
              <div className="trust-metric-item reveal" data-delay="2">
                <span className="trust-metric-number">
                  &lt;60
                  <span
                    style={{
                      fontSize: "0.45em",
                      fontWeight: 400,
                      letterSpacing: 0,
                    }}
                  >
                    s
                  </span>
                </span>
                <span className="trust-metric-label">
                  Average QR verification
                </span>
                <span className="trust-metric-note">
                  Median time, all scan events
                </span>
              </div>
              <div className="trust-metric-item reveal" data-delay="3">
                <span className="trust-metric-number">
                  100
                  <span style={{ fontSize: "0.5em", fontWeight: 400 }}>%</span>
                </span>
                <span className="trust-metric-label">Payment guarantee</span>
                <span className="trust-metric-note">
                  On all verified visits
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 3. How We Verify ─────────────────────────────────── */}
      <section
        className="trust-verify trust-section"
        aria-labelledby="trust-verify-heading"
      >
        <div className="trust-container">
          <div className="trust-verify-header reveal">
            <span className="trust-eyebrow">How we verify</span>
            <h2 id="trust-verify-heading" className="trust-verify-title">
              Four layers.
              <br />
              Zero shortcuts.
            </h2>
            <p className="trust-verify-subtitle">
              Every visit goes through the same four-stage verification stack,
              in real time, before a single dollar moves.
            </p>
          </div>
          <div className="trust-verify-steps">
            {VERIFY_STEPS.map((step, i) => (
              <div
                key={step.num}
                className="trust-verify-step reveal"
                data-delay={String(i + 1)}
              >
                <span className="trust-verify-step-num" aria-hidden="true">
                  {step.num}
                </span>
                <span className="trust-verify-step-label">{step.label}</span>
                <h3 className="trust-verify-step-title">{step.title}</h3>
                <p className="trust-verify-step-body">{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 4. Your Money is Safe ────────────────────────────── */}
      <section className="trust-money" aria-labelledby="trust-money-heading">
        <div className="trust-container">
          <div className="trust-money-layout">
            <div>
              <span className="trust-eyebrow trust-eyebrow--light reveal">
                Financial protection
              </span>
              <h2
                id="trust-money-heading"
                className="trust-money-headline reveal"
                data-delay="1"
              >
                Your money
                <span>is safe.</span>
              </h2>
              <p className="trust-money-body reveal" data-delay="2">
                Creator earnings and merchant payments are protected at every
                stage — from the moment a campaign goes live to the day funds
                are settled.
              </p>
            </div>
            <div className="trust-money-guarantees">
              {MONEY_ITEMS.map((item, i) => (
                <div
                  key={item.title}
                  className="trust-money-item reveal"
                  data-delay={String(i + 1)}
                >
                  <div className="trust-money-item-title">{item.title}</div>
                  <div className="trust-money-item-desc">{item.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── 5. Your Identity is Safe ─────────────────────────── */}
      <section
        className="trust-identity"
        aria-labelledby="trust-identity-heading"
      >
        <div className="trust-container">
          <div className="trust-identity-layout">
            <div>
              <span className="trust-eyebrow reveal">
                Privacy &amp; identity
              </span>
              <h2
                id="trust-identity-heading"
                className="trust-identity-title reveal"
                data-delay="1"
              >
                Your identity
                <em>is yours.</em>
              </h2>
              <p className="trust-identity-body reveal" data-delay="2">
                KYC verification is required by financial regulations, not by
                choice. We collect the minimum required, encrypt it, and give
                you full control over deletion.
              </p>
            </div>
            <div className="trust-identity-rights">
              {IDENTITY_RIGHTS.map((right, i) => (
                <div
                  key={right.title}
                  className="trust-identity-right reveal"
                  data-delay={String(i + 1)}
                >
                  <div className="trust-identity-right-icon" aria-hidden="true">
                    <IconCheck />
                  </div>
                  <div className="trust-identity-right-text">
                    <strong>{right.title}</strong>
                    {right.desc}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── 6. If Something Goes Wrong ───────────────────────── */}
      <section
        className="trust-dispute trust-section"
        aria-labelledby="trust-dispute-heading"
      >
        <div className="trust-container">
          <div className="trust-dispute-header reveal">
            <span className="trust-eyebrow">Dispute resolution</span>
            <h2 id="trust-dispute-heading" className="trust-dispute-title">
              If something
              <br />
              goes wrong.
            </h2>
            <p className="trust-dispute-subtitle">
              Disputes are rare. When they happen, here is exactly what happens
              next — no vague promises, no waiting in the dark.
            </p>
          </div>
          <div className="trust-timeline">
            {DISPUTE_TIMELINE.map((item, i) => (
              <div
                key={item.title}
                className="trust-timeline-item reveal"
                data-delay={String(i + 1)}
              >
                <div className="trust-timeline-dot" aria-hidden="true" />
                <span className="trust-timeline-time">{item.time}</span>
                <div className="trust-timeline-title">{item.title}</div>
                <p className="trust-timeline-body">{item.body}</p>
              </div>
            ))}
          </div>
          <div className="trust-dispute-cta reveal" data-delay="4">
            <Link href="/disputes" className="trust-btn-primary">
              Open a dispute
            </Link>
            <Link href="/help" className="trust-btn-ghost">
              Help center
            </Link>
          </div>
        </div>
      </section>

      {/* ── 7. Independent Verification ──────────────────────── */}
      <section
        className="trust-verification"
        aria-labelledby="trust-verification-heading"
      >
        <div className="trust-container">
          <span className="trust-eyebrow reveal">Third-party attestation</span>
          <h2
            id="trust-verification-heading"
            className="trust-verification-title reveal"
            data-delay="1"
          >
            Don&rsquo;t take
            <br />
            our word for it.
          </h2>
          <p className="trust-verification-subtitle reveal" data-delay="2">
            Our security posture is verified by independent third parties every
            year. Here is the evidence.
          </p>
          <div className="trust-certs-grid">
            {CERTS.map((cert, i) => (
              <div
                key={cert.title}
                className="trust-cert-card reveal"
                data-delay={String(i + 1)}
              >
                <div className="trust-cert-icon" aria-hidden="true">
                  {cert.icon}
                </div>
                <div className="trust-cert-title">{cert.title}</div>
                <p className="trust-cert-body">{cert.body}</p>
                <Link href={cert.link} className="trust-cert-link">
                  {cert.linkText}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 8. Testimonials ──────────────────────────────────── */}
      <section
        className="trust-testimonials"
        aria-labelledby="trust-testimonials-heading"
      >
        <div className="trust-container">
          <div className="trust-testimonials-header reveal">
            <span className="trust-eyebrow">In their words</span>
            <h2
              id="trust-testimonials-heading"
              className="trust-testimonials-title"
            >
              Creators and merchants
              <br />
              who trust Push.
            </h2>
          </div>
          <div className="trust-testimonials-grid">
            {TESTIMONIALS.map((t, i) => (
              <article
                key={t.name}
                className={`trust-testimonial-card trust-testimonial-card--${t.type} reveal`}
                data-delay={String((i % 3) + 1)}
              >
                <p className="trust-testimonial-quote">{t.quote}</p>
                <div className="trust-testimonial-author">
                  <div className="trust-testimonial-avatar" aria-hidden="true">
                    {t.initial}
                  </div>
                  <div className="trust-testimonial-author-info">
                    <span className="trust-testimonial-name">{t.name}</span>
                    <span className="trust-testimonial-meta">{t.meta}</span>
                  </div>
                  <span
                    className={`trust-testimonial-badge trust-testimonial-badge--${t.type}`}
                  >
                    {t.type === "creator" ? "Creator" : "Merchant"}
                  </span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── 9. FAQ ───────────────────────────────────────────── */}
      <section className="trust-faq" aria-labelledby="trust-faq-heading">
        <div className="trust-container">
          <div className="trust-faq-header reveal">
            <span className="trust-eyebrow">Common questions</span>
            <h2 id="trust-faq-heading" className="trust-faq-title">
              FAQ
            </h2>
            <p className="trust-faq-subtitle">
              The ten questions we hear most often about trust, verification,
              and privacy on Push.
            </p>
          </div>
          <div className="trust-faq-list" role="list">
            {FAQS.map((faq) => (
              <details key={faq.q} className="trust-faq-item" role="listitem">
                <summary className="trust-faq-question">
                  <span className="trust-faq-q-text">{faq.q}</span>
                  <IconChevronDown />
                </summary>
                <p className="trust-faq-answer">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ── 10. Contact ──────────────────────────────────────── */}
      <section
        className="trust-contact"
        aria-labelledby="trust-contact-heading"
      >
        <div className="trust-container">
          <div className="trust-contact-layout">
            <div>
              <span className="trust-eyebrow trust-eyebrow--light reveal">
                Reach us
              </span>
              <h2
                id="trust-contact-heading"
                className="trust-contact-headline reveal"
                data-delay="1"
              >
                Questions?
                <em>We answer.</em>
              </h2>
              <p className="trust-contact-body reveal" data-delay="2">
                Our Trust &amp; Safety team is staffed by humans who understand
                what is at stake when your money or identity is on the line.
                Responses within one business day.
              </p>
              <a
                href="mailto:trust@push.nyc"
                className="trust-contact-email reveal"
                data-delay="3"
              >
                trust@push.nyc
              </a>
            </div>
            <div className="trust-contact-links">
              <Link
                href="/security"
                className="trust-contact-link reveal"
                data-delay="1"
              >
                <div className="trust-contact-link-icon" aria-hidden="true">
                  <IconShield />
                </div>
                <div className="trust-contact-link-text">
                  <span className="trust-contact-link-label">Security</span>
                  <span className="trust-contact-link-value">
                    /security — full security policy and disclosure program
                  </span>
                </div>
              </Link>
              <a
                href="https://status.push.nyc"
                target="_blank"
                rel="noopener noreferrer"
                className="trust-contact-link reveal"
                data-delay="2"
              >
                <div className="trust-contact-link-icon" aria-hidden="true">
                  <IconGlobe />
                </div>
                <div className="trust-contact-link-text">
                  <span className="trust-contact-link-label">Status page</span>
                  <span className="trust-contact-link-value">
                    status.push.nyc — real-time uptime and incidents
                  </span>
                </div>
              </a>
              <Link
                href="/disputes"
                className="trust-contact-link reveal"
                data-delay="3"
              >
                <div className="trust-contact-link-icon" aria-hidden="true">
                  <IconMail />
                </div>
                <div className="trust-contact-link-text">
                  <span className="trust-contact-link-label">Disputes</span>
                  <span className="trust-contact-link-value">
                    /disputes — open or track a payout dispute
                  </span>
                </div>
              </Link>
              <a
                href="mailto:security@push.nyc"
                className="trust-contact-link reveal"
                data-delay="4"
              >
                <div className="trust-contact-link-icon" aria-hidden="true">
                  <IconExternalLink />
                </div>
                <div className="trust-contact-link-text">
                  <span className="trust-contact-link-label">
                    Report a vulnerability
                  </span>
                  <span className="trust-contact-link-value">
                    security@push.nyc — responsible disclosure
                  </span>
                </div>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
