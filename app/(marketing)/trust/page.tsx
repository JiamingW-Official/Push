"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import "./trust.css";

/* ─── Inline SVG icons (no extra deps) ─────────────────────── */
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

/* ─── Data ─────────────────────────────────────────────────── */
// what we actually log on a scan — written as a plain ledger,
// not a marketing list
const WHAT_WE_LOG = [
  {
    title: "Device fingerprint hash",
    body: "A SHA-256 of browser + screen + locale signals. We can tell two scans came from the same device. We cannot reverse it back to a person.",
  },
  {
    title: "GPS coordinates at scan",
    body: "Lat/lng at the moment the QR is decoded. Compared against the merchant's registered storefront. Discarded after 30 days.",
  },
  {
    title: "Timestamp + campaign id",
    body: "Unix ms and the campaign UUID. That's how we know visit #3 happened 18 minutes after visit #2 — and reject it if it's physically impossible.",
  },
  {
    title: "What we don't log",
    body: "No contacts, no microphone, no camera roll, no off-platform browsing. The QR scanner sees the QR — nothing else on the screen.",
  },
];

// the four-stage verification stack — re-cast as scenes, not promises
const VERIFY_STEPS = [
  {
    num: "01",
    label: "Step 01",
    title: "Fingerprint check",
    body: "Two scans, same device, same campaign — we keep the first and reject the rest. The fingerprint is a one-way hash of browser + screen + locale; nothing reverses to identity.",
  },
  {
    num: "02",
    label: "Step 02",
    title: "Geo cross-check",
    body: "GPS at scan time is compared against the merchant's registered address. Outside a sane radius, the scan goes to review — no exceptions, no overrides.",
  },
  {
    num: "03",
    label: "Step 03",
    title: "Velocity check",
    body: "If your QR shows up in two places that you can't physically travel between in the elapsed minutes, the second one is held. Buses don't teleport. Neither do people.",
  },
  {
    num: "04",
    label: "Step 04",
    title: "Human review on flags",
    body: "Anything our automated layers flag — and any payout above the per-creator threshold — gets read by a human on the trust desk before funds clear. Founder reviews the edge cases himself.",
  },
];

// money handling — anchored on Stripe Connect custody, R11 / D9 facts
const MONEY_ITEMS = [
  {
    title: "Stripe Connect holds the money",
    desc: "Push never touches creator earnings or merchant deposits. Funds sit in a Stripe Connect account scoped to the campaign. We're a routing layer, not a bank.",
  },
  {
    title: "Pay-on-verified-visit",
    desc: "A merchant's card is captured when the campaign goes live, but no charge clears until a QR scan passes the four-stage check. No verified visit, no charge.",
  },
  {
    title: "7-day refund window",
    desc: "If a verified visit is later overturned by the trust desk, the merchant is refunded inside 7 business days through Stripe — same rail as the original capture.",
  },
];

// data-rights checklist — frameworks named explicitly
const DATA_RIGHTS = [
  {
    title: "CCPA right-to-know, right-to-delete",
    desc: "California residents: we'll send you everything we have on you, or wipe it, inside the 45-day statutory window. File at /privacy or email privacy@push.nyc.",
    framework: "CCPA · Cal. Civ. Code § 1798.100",
  },
  {
    title: "GDPR Article 15 + Article 17",
    desc: "EU residents (we're not actively serving the EU yet, but we honor it on request): subject access requests fulfilled inside 30 days, erasure includes warm and cold backups.",
    framework: "GDPR · Reg. (EU) 2016/679",
  },
  {
    title: "FTC endorsement disclosure",
    desc: "Every creator post Push pays for must carry a clear material connection disclosure. We audit our roster monthly and pull anyone who doesn't comply.",
    framework: "FTC 16 CFR § 255",
  },
  {
    title: "Stripe Identity for KYC",
    desc: "Identity documents are submitted directly to Stripe Identity. Push receives a verification token, not the document. Engineers cannot read your ID.",
    framework: "Stripe Identity · KYC tier 1",
  },
];

// retention table — the actual numbers, not a vague paragraph
const RETENTION = [
  {
    signal: "GPS coordinates",
    window: "30 days rolling",
    reason:
      "Long enough to investigate disputes, short enough to avoid a tracking dataset.",
  },
  {
    signal: "Device fingerprint hash",
    window: "180 days",
    reason: "Anti-fraud cross-campaign signal. Hash, not raw device IDs.",
  },
  {
    signal: "Scan event metadata (campaign id, timestamp)",
    window: "Lifetime of campaign + 24 mo",
    reason: "Required for tax records and dispute reconciliation.",
  },
  {
    signal: "KYC documents",
    window: "Held by Stripe, not Push",
    reason: "We never store the document. Stripe retains per their schedule.",
  },
  {
    signal: "Account profile data",
    window: "Until deletion + 30 days",
    reason:
      "Hard delete inside 30 days of a confirmed CCPA / GDPR request, including backups.",
  },
];

// dispute timeline — what actually happens
const DISPUTE_TIMELINE = [
  {
    time: "T + 0",
    title: "You open a dispute",
    body: "In-app button on any campaign or payout. Drop a screenshot. We acknowledge inside 24 hours — auto-reply with a ticket number, then a human follow-up.",
  },
  {
    time: "1–3 business days",
    title: "Trust desk pulls the logs",
    body: "Scan record, fingerprint match, GPS delta, velocity flag, and your account history. Both sides see the same evidence file in the dispute thread.",
  },
  {
    time: "3–5 business days",
    title: "Decision in writing",
    body: "Outcome with a written explanation that cites the specific signal that drove the call. No 'our system determined' boilerplate.",
  },
  {
    time: "Settlement",
    title: "Funds move within 2 business days",
    body: "If resolved in your favor, Stripe Connect releases the held funds — creators get the missed payout, merchants get the refund. Same rail as the original capture.",
  },
];

// compliance / cert cards — honest about what's done vs. on the roadmap
const CERTS = [
  {
    title: "SOC 2 Type II",
    body: "Target: Year 2 Q4 (Q4 2027) post-pilot. We're using the AICPA Trust Services Criteria as our internal control framework today, but we don't claim certification we haven't earned.",
    status: "Target · Year 2 Q4",
    link: "/security",
    linkText: "Read the controls doc",
    icon: <IconShield />,
  },
  {
    title: "Stripe Connect custody",
    body: "All payment custody is delegated to Stripe Connect (PCI DSS Level 1, SOC 1 / 2 audited). Push never custodies user funds — we don't have a money-transmitter license, and we never need one.",
    status: "Live · since v0.1",
    link: "https://stripe.com/connect",
    linkText: "Stripe Connect overview",
    icon: <IconLock />,
  },
  {
    title: "Public status page",
    body: "Real uptime numbers from real probes — API, scan ingestion, payout webhook. No 'industry-standard' marketing math. Subscribe to incident posts at the address below.",
    status: "Live · status.push.nyc",
    link: "https://status.push.nyc",
    linkText: "Open status page",
    icon: <IconGlobe />,
  },
];

// FAQ — re-written sober, no marketing clichés
const FAQS = [
  {
    q: "Does Push hold creator earnings or merchant deposits?",
    a: "No. Stripe Connect holds funds in a campaign-scoped account. Push initiates transfers; Stripe moves the money. We are not a money transmitter, we don't custody user funds, and our terms are explicit about this.",
  },
  {
    q: "What stops a creator from scanning their own QR repeatedly?",
    a: "Each QR is bound to a campaign session. The first scan from a given device fingerprint registers; subsequent scans from the same fingerprint on the same campaign are rejected. Velocity checks reject impossible-speed travel between scans.",
  },
  {
    q: "What data does Push log when someone scans a QR?",
    a: "Four fields: a SHA-256 device fingerprint, GPS coordinates, a unix timestamp, and the campaign UUID. We do not log identity, contacts, microphone, camera roll, or off-platform browsing. The scanner reads the QR and nothing else on the screen.",
  },
  {
    q: "Are merchants ever shown a customer's identity?",
    a: "No. The merchant dashboard shows aggregate scan counts and a creator handle on the originating post. Individual scanners are never identified to merchants.",
  },
  {
    q: "How long is GPS retained?",
    a: "30 days rolling. After that the coordinate is deleted; only the boolean 'scan was inside the venue radius' is kept for the campaign reconciliation window.",
  },
  {
    q: "What is your CCPA / GDPR posture?",
    a: "We honor CCPA right-to-know and right-to-delete on request, fulfilled inside 45 days as required by Cal. Civ. Code § 1798.130. GDPR Articles 15 and 17 are honored on request inside 30 days, including warm and cold backups. File at privacy@push.nyc.",
  },
  {
    q: "Are you SOC 2 certified?",
    a: "Not yet. SOC 2 Type II certification is a Year 2 Q4 target (Q4 2027). We're operating to the AICPA Trust Services Criteria today — controls in place, evidence collected — but we don't claim certification we haven't earned.",
  },
  {
    q: "How are creator endorsements disclosed?",
    a: "Every paid post must carry a clear material-connection disclosure per FTC 16 CFR § 255. We audit the roster monthly and remove anyone who doesn't comply. Push pays for the visit, not for the post — but the relationship is disclosed.",
  },
  {
    q: "What happens if Push shuts down?",
    a: "Funds in Stripe Connect are held in segregated, FDIC-insured accounts under Stripe's banking-as-a-service partners. They are not commingled with Push operating capital and are returned to the originating party in an insolvency.",
  },
  {
    q: "How do I report a security issue?",
    a: "Email security@push.nyc. We run responsible disclosure with a 90-day SLA. Confirmed high-severity reports get a thank-you credit on a future campaign. We do not pursue legal action against good-faith researchers.",
  },
];

/* ─── Reveal hook ──────────────────────────────────────────── */
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

/* ─── Page component ───────────────────────────────────────── */
export default function TrustPage() {
  const pageRef = useReveal();

  return (
    <div className="trust-page" ref={pageRef}>
      {/* ═══════════ 01 — HERO ═══════════ */}
      <section
        className="bg-hero-ink grain-overlay bg-vignette trust-hero-v7"
        aria-labelledby="trust-hero-heading"
      >
        <div className="trust-container trust-hero-inner">
          <div className="trust-hero-top reveal">
            <span className="pill-lux" style={{ color: "#fff" }}>
              Pre-pilot · April 2026
            </span>
            <span className="eyebrow-lux" style={{ color: "var(--champagne)" }}>
              Trust ledger
            </span>
          </div>

          <div
            className="section-marker reveal"
            data-num="01"
            style={{ color: "rgba(255,255,255,0.55)" }}
          >
            What we log
          </div>

          <h1 id="trust-hero-heading" className="trust-hero-h1 reveal">
            Clean ledger
            <span aria-hidden="true" className="trust-hero-h1-period">
              .
            </span>
          </h1>
          <div className="display-ghost trust-hero-ghost reveal">
            no fine print.
          </div>

          <div className="trust-hero-body reveal">
            <p>
              A customer scans your QR. We log the scan. We don&apos;t log who
              they are unless they explicitly opt in. Stripe Connect holds the
              money — we never do. That&apos;s the whole arrangement.
            </p>
            <p className="trust-hero-body-muted">
              We&apos;re pre-pilot. SOC 2 Type II is a Year 2 Q4 target — not a
              certification we&apos;ve earned. CCPA, GDPR, and FTC 16 CFR § 255
              are operating posture today. Below is the page-by-page accounting.
            </p>
          </div>

          {/* what-we-log strip */}
          <div className="trust-hero-strip reveal">
            {WHAT_WE_LOG.map((item, i) => (
              <div
                key={item.title}
                className="trust-hero-strip-item"
                style={{ transitionDelay: `${i * 60}ms` }}
              >
                <div className="trust-hero-strip-num">{`0${i + 1}`}</div>
                <div className="trust-hero-strip-title">{item.title}</div>
                <p className="trust-hero-strip-body">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ 02 — VERIFICATION STACK ═══════════ */}
      <section
        className="trust-section trust-verify"
        aria-labelledby="trust-verify-heading"
      >
        <div className="trust-container">
          <div className="trust-verify-header reveal">
            <div className="section-marker" data-num="02">
              Verification stack
            </div>
            <h2 id="trust-verify-heading" className="trust-section-title">
              Four checks.
              <br />
              <span className="display-ghost">Then the money moves.</span>
            </h2>
            <p className="trust-section-sub">
              Every QR scan runs the same four-stage gate before a single dollar
              clears Stripe. The signals are recorded; the decisions are written
              down; both sides of a dispute see the same evidence file.
            </p>
          </div>

          <div className="bento-grid trust-verify-bento">
            {VERIFY_STEPS.map((step, i) => (
              <div
                key={step.num}
                className="card-premium trust-verify-card bento-6x1 reveal"
                style={{ transitionDelay: `${i * 80}ms` }}
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

      {/* ═══════════ 03 — MONEY CUSTODY ═══════════ */}
      <section
        className="bg-hero-ink grain-overlay bg-vignette trust-section trust-money-v7"
        aria-labelledby="trust-money-heading"
      >
        <div className="trust-container">
          <div className="trust-money-layout">
            <div className="trust-money-left reveal">
              <div
                className="section-marker"
                data-num="03"
                style={{ color: "rgba(255,255,255,0.55)" }}
              >
                Money custody
              </div>
              <h2 id="trust-money-heading" className="trust-money-h">
                Stripe holds it
                <span aria-hidden="true" className="trust-money-h-period">
                  .
                </span>
              </h2>
              <div className="display-ghost trust-money-ghost">
                We never do.
              </div>
              <p className="trust-money-body">
                Push is a routing layer. Funds sit in a Stripe Connect account
                scoped to the campaign — captured when the campaign goes live,
                cleared only after a QR scan passes the four-stage check, and
                paid out on Friday via the same Stripe rail.
              </p>
              <p className="trust-money-body trust-money-body-muted">
                We don&apos;t hold a money-transmitter license, and we
                don&apos;t need one. We don&apos;t commingle funds with
                operating capital. We never have access to a creator&apos;s bank
                account or a merchant&apos;s card number.
              </p>
            </div>
            <div className="trust-money-right">
              {MONEY_ITEMS.map((item, i) => (
                <div
                  key={item.title}
                  className="trust-money-card reveal"
                  style={{ transitionDelay: `${i * 90}ms` }}
                >
                  <div className="trust-money-card-title">{item.title}</div>
                  <div className="trust-money-card-desc">{item.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════ 04 — DATA RIGHTS / FRAMEWORKS ═══════════ */}
      <section
        className="trust-section trust-rights"
        aria-labelledby="trust-rights-heading"
      >
        <div className="trust-container">
          <div className="trust-rights-header reveal">
            <div className="section-marker" data-num="04">
              Data rights
            </div>
            <h2 id="trust-rights-heading" className="trust-section-title">
              The frameworks,
              <br />
              <span className="display-ghost">named on the page.</span>
            </h2>
            <p className="trust-section-sub">
              Compliance posture by statute. CCPA and GDPR honored on request;
              FTC § 255 enforced on every paid post; KYC delegated to Stripe
              Identity so we never see the document.
            </p>
          </div>

          <div className="bento-grid trust-rights-bento">
            {DATA_RIGHTS.map((right, i) => (
              <div
                key={right.title}
                className="card-premium trust-rights-card bento-6x1 reveal"
                style={{ transitionDelay: `${i * 80}ms` }}
              >
                <span className="trust-rights-num">{`0${i + 1}`}</span>
                <span className="trust-rights-framework">
                  {right.framework}
                </span>
                <h3 className="trust-rights-card-title">{right.title}</h3>
                <p className="trust-rights-card-desc">{right.desc}</p>
              </div>
            ))}
          </div>

          <div className="divider-lux">Retention table</div>

          <div className="trust-retention reveal">
            <div className="trust-retention-header">
              <span>Signal</span>
              <span>Window</span>
              <span>Why</span>
            </div>
            {RETENTION.map((row) => (
              <div key={row.signal} className="trust-retention-row">
                <span className="trust-retention-signal">{row.signal}</span>
                <span className="trust-retention-window">{row.window}</span>
                <span className="trust-retention-reason">{row.reason}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ 05 — DISPUTE FLOW ═══════════ */}
      <section
        className="trust-section trust-dispute"
        aria-labelledby="trust-dispute-heading"
      >
        <div className="trust-container">
          <div className="trust-dispute-header reveal">
            <div className="section-marker" data-num="05">
              When something is off
            </div>
            <h2 id="trust-dispute-heading" className="trust-section-title">
              Open the ticket.
              <br />
              <span className="display-ghost">We pull the logs.</span>
            </h2>
            <p className="trust-section-sub">
              Disputes are rare. When they happen, both sides read the same
              evidence file. Decisions are written, citing the signal that drove
              the call.
            </p>
          </div>

          <div className="trust-timeline">
            {DISPUTE_TIMELINE.map((item, i) => (
              <div
                key={item.title}
                className="trust-timeline-item reveal"
                style={{ transitionDelay: `${i * 100}ms` }}
              >
                <div className="trust-timeline-dot" aria-hidden="true" />
                <span className="trust-timeline-time">{item.time}</span>
                <div className="trust-timeline-title">{item.title}</div>
                <p className="trust-timeline-body">{item.body}</p>
              </div>
            ))}
          </div>

          <div className="trust-dispute-cta reveal">
            <Link href="/disputes" className="btn btn-primary">
              Open a dispute
            </Link>
            <Link href="/help" className="btn btn-secondary">
              Help center
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════ 06 — COMPLIANCE / CERTS ═══════════ */}
      <section
        className="trust-section trust-certs"
        aria-labelledby="trust-certs-heading"
      >
        <div className="trust-container">
          <div className="trust-certs-header reveal">
            <div className="section-marker" data-num="06">
              Compliance posture
            </div>
            <h2 id="trust-certs-heading" className="trust-section-title">
              The promises,
              <br />
              <span className="display-ghost">audited or aspirational.</span>
            </h2>
            <p className="trust-section-sub">
              Some of these are live and contractual; others are targets
              we&apos;re working toward. The status line on each card tells you
              which is which. We don&apos;t claim certification we haven&apos;t
              earned.
            </p>
          </div>

          <div className="bento-grid trust-certs-bento">
            {CERTS.map((cert, i) => (
              <div
                key={cert.title}
                className={`${i === 1 ? "card-champagne" : "card-premium"} trust-cert-card bento-4x1 reveal`}
                style={{ transitionDelay: `${i * 80}ms` }}
              >
                <div className="trust-cert-icon" aria-hidden="true">
                  {cert.icon}
                </div>
                <span className="trust-cert-status">{cert.status}</span>
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

      {/* ═══════════ 07 — FAQ ═══════════ */}
      <section
        className="trust-section trust-faq"
        aria-labelledby="trust-faq-heading"
      >
        <div className="trust-container">
          <div className="trust-faq-header reveal">
            <div className="section-marker" data-num="07">
              The questions we hear
            </div>
            <h2 id="trust-faq-heading" className="trust-section-title">
              Ten answers,
              <br />
              <span className="display-ghost">no fine print.</span>
            </h2>
            <p className="trust-section-sub">
              Custody, retention, frameworks, disputes. If we missed yours, the
              email at the bottom of this page goes to a human.
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

      {/* ═══════════ 08 — FOUNDER ACCOUNTABILITY ═══════════ */}
      <section
        className="bg-hero-ink grain-overlay bg-vignette trust-section trust-founder"
        aria-labelledby="trust-founder-heading"
      >
        <div className="trust-container">
          <div className="trust-founder-layout reveal">
            <div className="trust-founder-left">
              <div
                className="section-marker"
                data-num="08"
                style={{ color: "rgba(255,255,255,0.55)" }}
              >
                Founder accountability
              </div>
              <h2 id="trust-founder-heading" className="trust-founder-h">
                If something
                <br />
                breaks
                <span aria-hidden="true" className="trust-founder-h-period">
                  ,
                </span>
              </h2>
              <div className="display-ghost trust-founder-ghost">
                that&apos;s on me.
              </div>
              <p className="trust-founder-body">
                I&apos;m Jiaming. I run Push. The trust desk runs through me on
                edge cases, and the email below is mine. If a creator misses a
                payout or a merchant gets a charge they can&apos;t explain, I
                want to hear it directly — not via a support form.
              </p>
              <p className="trust-founder-body trust-founder-body-muted">
                We&apos;re a five-person NYC team. Phase 0 opens in
                Williamsburg, May 2026. You can read the build log on the
                homepage; the roadmap is public.
              </p>

              <div className="trust-founder-sig">
                <div className="trust-founder-sig-name">Jiaming Wang</div>
                <div className="trust-founder-sig-meta">
                  Founder · Push · NYC
                </div>
                <a
                  href="mailto:jiaming@push.nyc"
                  className="trust-founder-sig-email"
                >
                  jiaming@push.nyc
                </a>
              </div>
            </div>

            <div className="trust-founder-right">
              <Link
                href="/security"
                className="trust-founder-link reveal"
                style={{ transitionDelay: "120ms" }}
              >
                <div className="trust-founder-link-icon" aria-hidden="true">
                  <IconShield />
                </div>
                <div className="trust-founder-link-text">
                  <span className="trust-founder-link-label">
                    Security policy
                  </span>
                  <span className="trust-founder-link-value">
                    /security — controls inventory, disclosure program
                  </span>
                </div>
              </Link>
              <a
                href="https://status.push.nyc"
                target="_blank"
                rel="noopener noreferrer"
                className="trust-founder-link reveal"
                style={{ transitionDelay: "180ms" }}
              >
                <div className="trust-founder-link-icon" aria-hidden="true">
                  <IconGlobe />
                </div>
                <div className="trust-founder-link-text">
                  <span className="trust-founder-link-label">Status page</span>
                  <span className="trust-founder-link-value">
                    status.push.nyc — uptime, incidents, post-mortems
                  </span>
                </div>
              </a>
              <Link
                href="/disputes"
                className="trust-founder-link reveal"
                style={{ transitionDelay: "240ms" }}
              >
                <div className="trust-founder-link-icon" aria-hidden="true">
                  <IconMail />
                </div>
                <div className="trust-founder-link-text">
                  <span className="trust-founder-link-label">Disputes</span>
                  <span className="trust-founder-link-value">
                    /disputes — open or track a payout dispute
                  </span>
                </div>
              </Link>
              <a
                href="mailto:security@push.nyc"
                className="trust-founder-link reveal"
                style={{ transitionDelay: "300ms" }}
              >
                <div className="trust-founder-link-icon" aria-hidden="true">
                  <IconExternalLink />
                </div>
                <div className="trust-founder-link-text">
                  <span className="trust-founder-link-label">
                    Vulnerability report
                  </span>
                  <span className="trust-founder-link-value">
                    security@push.nyc — 90-day SLA, no legal action
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
