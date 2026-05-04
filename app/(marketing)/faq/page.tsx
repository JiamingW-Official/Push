import type { Metadata } from "next";
import Link from "next/link";
import "./faq.css";

export const metadata: Metadata = {
  title: "FAQ — Push",
  description:
    "Straight answers about how Push works — pricing, creator payouts, QR verification, attribution, and account questions.",
};

/* ── FAQ data ─────────────────────────────────────────────── */
const FAQ_SECTIONS = [
  {
    id: "general",
    label: "General",
    num: "01",
    items: [
      {
        q: "What is Push?",
        a: "Push is a performance-based local marketing platform. Merchants run campaigns, creators promote them, and every conversion is tracked through a unique QR code tied to the creator's profile. You only pay when a real person walks in.",
      },
      {
        q: "Where does Push operate?",
        a: "We are currently live in Brooklyn and Lower Manhattan. Expansion to Chicago, Los Angeles, and Miami is planned for Q3 2026. Join the waitlist on the homepage to get early access in your city.",
      },
      {
        q: "Is Push free to use?",
        a: "Creators pay nothing to join or participate. Merchants have a free Lite plan (one campaign, one creator) and paid plans starting at $99/month. There are no setup fees and no retainers — you only pay for verified visits.",
      },
      {
        q: "How is Push different from traditional influencer marketing?",
        a: "Traditional deals pay a flat rate for posting. Push pays only for verified footfall — a real person who walked into the location and scanned at the door. No impressions, no follower counts, no guesswork.",
      },
    ],
  },
  {
    id: "merchants",
    label: "For Merchants",
    num: "02",
    items: [
      {
        q: "How does pricing work?",
        a: "You set a per-visit rate when you create a campaign. There is no monthly retainer or upfront spend. You only pay after a customer walks in and the visit is verified by our three-signal oracle.",
      },
      {
        q: "When do I actually pay?",
        a: "Payments are swept weekly on Fridays via Stripe. Each line item shows the creator, scan ID, visit timestamp, and per-visit rate. You can audit every charge.",
      },
      {
        q: "Can I set a daily or total budget cap?",
        a: "Yes. When you create or edit a campaign you can set a daily visit cap and a total campaign cap. Once the cap is hit, the campaign pauses automatically and any unused budget is fully refunded.",
      },
      {
        q: "What if I dispute a visit?",
        a: "Open a dispute in the dashboard within 72 hours. The oracle replays all three signals. If the visit does not hold up, the charge is reversed and the creator is notified with a reason code.",
      },
      {
        q: "How fast can I go live?",
        a: "Most merchants are live within 3 days of signup. Campaign review takes under 24 hours. QR poster assets are generated automatically — no design work required.",
      },
    ],
  },
  {
    id: "creators",
    label: "For Creators",
    num: "03",
    items: [
      {
        q: "How do I get paid?",
        a: "Stripe Connect deposits your verified visits every Friday morning. You connect your bank account during onboarding — no invoicing, no chasing.",
      },
      {
        q: "What counts as a verified visit?",
        a: "A customer who saw your post, walked to the venue, and scanned your unique QR. The oracle checks GPS coordinates, timestamp, and venue signal before clearing the payout.",
      },
      {
        q: "Is there a follower minimum?",
        a: "No. Your tier rate is set by your verified-visit history, not your follower count. A creator with 500 hyper-local followers who drives real visits earns more than one with 50K idle ones.",
      },
      {
        q: "Can I work with multiple campaigns at once?",
        a: "Yes. Your dashboard shows all campaigns you are approved for. Each one has a separate QR. You post, track, and get paid per campaign independently.",
      },
      {
        q: "What if my visit did not verify?",
        a: "You will receive a reason code — most common are GPS mismatch or scan outside open hours. You can appeal within 48 hours and a human reviews it.",
      },
    ],
  },
  {
    id: "attribution",
    label: "Attribution",
    num: "04",
    items: [
      {
        q: "How does the QR code work?",
        a: "Each creator gets a unique QR per campaign. Scanning it logs the creator ID, campaign ID, device signal, and exact timestamp. One scan = one attribution attempt. No ambiguity.",
      },
      {
        q: "Can visits be faked?",
        a: "Three signals must align independently: QR scan, GPS presence at the venue, and timestamp within open hours. Spoofing all three simultaneously is effectively not possible at the campaign scale we run.",
      },
      {
        q: "What if two creators drove the same customer?",
        a: "The QR that was scanned at the door wins the attribution. There is no split. The other creator's post is recorded in their history but does not generate a payout for that visit.",
      },
      {
        q: "What happens if a creator scans their own QR?",
        a: "Self-scans are filtered by the oracle. Repeat self-scans flag the account for review. Every flagged case is read by a human within one business day.",
      },
    ],
  },
];

/* ── Page ─────────────────────────────────────────────────── */
export default function FaqPage() {
  const totalQ = FAQ_SECTIONS.reduce((sum, s) => sum + s.items.length, 0);

  return (
    <main>
      {/* ═══ 01 — HERO (dark, bottom-left anchored) ══════════ */}
      <section aria-labelledby="faq-hero-heading" className="faq-hero">
        {/* Decorative ghost "?" */}
        <span aria-hidden="true" className="faq-hero-ghost-deco">
          ?
        </span>

        <div className="faq-hero-inner">
          <div className="faq-hero-content">
            <p
              className="eyebrow"
              style={{ color: "rgba(255,255,255,0.45)", marginBottom: 16 }}
            >
              (FREQUENTLY ASKED)
            </p>
            <h1 id="faq-hero-heading" className="faq-hero-title">
              Answers.
            </h1>
            <p className="faq-hero-sub">
              Real questions from merchants and creators during the pilot. No
              sales-deck answers — just what actually happens.
            </p>

            {/* Category filter pills */}
            <div className="faq-hero-pills">
              {FAQ_SECTIONS.map((s) => (
                <a key={s.id} href={`#${s.id}`} className="btn-pill">
                  {s.label}
                </a>
              ))}
            </div>
          </div>

          {/* Stats badge */}
          <div
            className="lg-surface--badge faq-hero-badge"
            aria-label={`${totalQ} questions answered`}
          >
            <div
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 900,
                fontSize: "clamp(40px, 5vw, 72px)",
                letterSpacing: "-0.05em",
                lineHeight: 0.85,
                color: "var(--snow)",
              }}
            >
              {totalQ}
            </div>
            <p
              className="eyebrow"
              style={{ color: "rgba(255,255,255,0.5)", marginTop: 8 }}
            >
              (ANSWERS)
            </p>
          </div>
        </div>
      </section>

      {/* ═══ 02 — FAQ SECTIONS ════════════════════════════════ */}
      <section
        aria-label="FAQ"
        style={{
          background: "var(--surface)",
          padding: "96px 0",
        }}
      >
        <div className="faq-content-inner">
          {FAQ_SECTIONS.map((section, si) => (
            <div
              key={section.id}
              id={section.id}
              className="faq-section"
              style={{
                background: si % 2 === 1 ? "var(--surface-2)" : "transparent",
                borderRadius: si % 2 === 1 ? 10 : 0,
                padding: si % 2 === 1 ? "48px 56px" : "0",
              }}
            >
              {/* Section header */}
              <div className="faq-section-header">
                <span
                  aria-hidden
                  style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 900,
                    fontSize: "clamp(48px, 6vw, 80px)",
                    letterSpacing: "-0.05em",
                    lineHeight: 0.9,
                    color: "var(--brand-red)",
                    opacity: 0.15,
                    userSelect: "none",
                  }}
                >
                  {section.num}
                </span>
                <h2 className="faq-section-title">{section.label}</h2>
                <span
                  className="eyebrow"
                  style={{ color: "var(--ink-3)", marginLeft: "auto" }}
                >
                  {section.items.length} questions
                </span>
              </div>

              {/* Q&A items — two-column editorial layout */}
              <div className="faq-items">
                {section.items.map((item, idx) => (
                  <div key={idx} className="faq-item">
                    {/* Question */}
                    <div className="faq-item-q-col">
                      <span aria-hidden className="faq-item-dot" />
                      <h3 className="faq-item-question">{item.q}</h3>
                    </div>
                    {/* Answer */}
                    <p className="faq-item-answer">{item.a}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ SIG DIVIDER ══════════════════════════════════════ */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          padding: "80px 64px",
          background: "var(--surface)",
        }}
      >
        <span className="sig-divider">Real · Local · Verified ·</span>
      </div>

      {/* ═══ 03 — TICKET CTA ══════════════════════════════════ */}
      <section
        aria-label="Still have questions"
        style={{
          background: "var(--surface)",
          padding: "0 64px 96px",
        }}
      >
        <div style={{ maxWidth: 1140, margin: "0 auto" }}>
          <div className="ticket-panel">
            <p
              className="eyebrow"
              style={{
                color: "rgba(255,255,255,0.65)",
                marginBottom: 24,
                textAlign: "center",
              }}
            >
              (STILL HAVE QUESTIONS)
            </p>
            <h2
              style={{
                fontFamily: "var(--font-hero)",
                fontStyle: "italic",
                fontWeight: 400,
                fontSize: "clamp(40px, 5vw, 72px)",
                lineHeight: 0.92,
                color: "var(--snow)",
                margin: "0 0 40px",
                textAlign: "center",
                letterSpacing: "-0.02em",
              }}
            >
              Still have questions?
              <br />
              Talk to us.
            </h2>
            <div
              style={{
                display: "flex",
                gap: 16,
                justifyContent: "center",
                flexWrap: "wrap",
              }}
            >
              <Link href="/contact" className="btn-ink click-shift">
                Contact us
              </Link>
              <a
                href="mailto:hello@pushnyc.com"
                className="btn-ghost click-shift"
                style={{
                  borderColor: "rgba(255,255,255,0.4)",
                  color: "var(--snow)",
                }}
              >
                hello@pushnyc.com
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
