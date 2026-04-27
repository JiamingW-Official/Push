// v11 How It Works — editorial register, numbered rows, dark verification panel
// Audit pass 2026-04-25: Darky Display Hero, 8px grid, token-only colors, 96px section padding

import type { Metadata } from "next";
import Link from "next/link";
import "./how-it-works.css";

export const metadata: Metadata = {
  title: "How Push Works — Pay Per Verified Visit",
  description:
    "Four steps from creator story to verified scan. QR attribution, GPS dwell, and timestamp verification — every payout tied to a real physical visit.",
};

/* ── Page ─────────────────────────────────────────────────── */
export default function HowItWorksPage() {
  return (
    <main>
      {/* ═══ 01 — HERO (dark ink panel, bottom-left anchored) ═══
          Title anchor: bottom 96px, left 64px (§ 7.1 + § 7.2)
          Darky Display Hero clamp(56,8vw,128) weight 900 (§ 3.1)
          ═══════════════════════════════════════════════════════ */}
      <section
        aria-labelledby="hiw-hero-heading"
        style={{
          // Decorative gradient — SVG visual effect, exempt from closed-color list per § 2.7 rule 1
          background: `
            radial-gradient(ellipse 70% 60% at 80% 20%, var(--brand-red-tint) 0%, transparent 55%),
            linear-gradient(155deg, var(--ink) 0%, var(--graphite) 60%, var(--char) 100%)
          `,
          minHeight: "clamp(560px, 78vh, 800px)",
          position: "relative",
          display: "flex",
          alignItems: "flex-end",
          overflow: "hidden",
        }}
      >
        {/* Ghost step numeral watermark */}
        <span
          aria-hidden="true"
          style={{
            position: "absolute",
            right: "-0.03em",
            bottom: "-0.1em",
            fontFamily: "var(--font-display)",
            fontWeight: 900,
            fontSize: "clamp(240px, 42vw, 640px)",
            letterSpacing: "-0.08em",
            lineHeight: 0.8,
            color: "rgba(255,255,255,0.03)",
            pointerEvents: "none",
            userSelect: "none",
          }}
        >
          4
        </span>

        {/* Bottom-left anchored content: padding 0 64px 96px (§ 7.2) */}
        <div
          style={{
            maxWidth: 1140,
            margin: "0 auto",
            width: "100%",
            padding: "0 64px 96px",
            position: "relative",
            zIndex: 1,
            display: "grid",
            gridTemplateColumns: "1fr auto",
            gap: 64,
            alignItems: "flex-end",
          }}
        >
          {/* Left — bottom-left anchored title block */}
          <div>
            <p
              className="eyebrow"
              style={{ color: "rgba(255,255,255,0.65)", marginBottom: 16 }}
            >
              (THE FLOW)
            </p>
            {/* Darky Display Hero — clamp(56px,8vw,128px) 900 (§ 3.1) */}
            <h1
              id="hiw-hero-heading"
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 900,
                fontSize: "clamp(56px, 8vw, 128px)",
                letterSpacing: "-0.035em",
                lineHeight: 0.9,
                color: "var(--snow)",
                margin: 0,
              }}
            >
              Four steps
              <br />
              from story
              <br />
              to scan.
            </h1>
            <p
              style={{
                marginTop: 32,
                maxWidth: 520,
                fontFamily: "var(--font-mono)",
                fontSize: 20,
                lineHeight: 1.4,
                letterSpacing: "-0.1em",
                color: "var(--snow)",
                opacity: 0.72,
              }}
            >
              A creator posts a real recommendation. A customer scans the QR at
              the door. We verify. The merchant pays. That is the entire loop.
            </p>
            <div
              style={{
                marginTop: 48,
                display: "flex",
                gap: 16,
                flexWrap: "wrap",
              }}
            >
              <Link href="/creator/signup" className="btn-primary click-shift">
                Apply as creator
              </Link>
              <Link href="/merchant/signup" className="btn-ghost click-shift">
                List your venue
              </Link>
            </div>
          </div>

          {/* Right — floating glass badge */}
          <div
            className="lg-surface--badge"
            style={{ flexShrink: 0, textAlign: "center" }}
            aria-label="100% verified"
          >
            <div
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 900,
                fontSize: "clamp(40px, 5vw, 72px)",
                letterSpacing: "-0.045em",
                lineHeight: 0.85,
                color: "var(--snow)",
              }}
            >
              100%
            </div>
            <p
              className="eyebrow"
              style={{ color: "rgba(255,255,255,0.65)", marginTop: 8 }}
            >
              VERIFIED
            </p>
          </div>
        </div>
      </section>

      {/* ═══ Sig divider — approved phrase (§ 3.1) ════════════ */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          padding: "64px",
          background: "var(--surface)",
        }}
      >
        <span className="sig-divider">Posted · Scanned · Verified ·</span>
      </div>

      {/* ═══ 02 — FOUR STEPS — large editorial numbered rows ════
          NOT card boxes — large number (Darky 80px brand-red),
          title (H3 28px), body (18px Genio Mono)
          Section padding: 96px top+bottom (§ 6.1)
          ═══════════════════════════════════════════════════════ */}
      <section
        aria-label="Four steps"
        style={{
          background: "var(--surface)",
          padding: "0 64px 96px",
        }}
      >
        <div style={{ maxWidth: 1140, margin: "0 auto" }}>
          <p
            className="eyebrow"
            style={{ color: "var(--ink-3)", marginBottom: 16 }}
          >
            (STEP BY STEP)
          </p>
          {/* H2 exactly 40px (§ 3.1) */}
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 800,
              fontSize: 40,
              letterSpacing: "-0.02em",
              lineHeight: 1.05,
              color: "var(--ink)",
              margin: "0 0 56px",
            }}
          >
            The complete loop.
          </h2>

          {/* Editorial numbered rows: large brand-red number, title, body */}
          {[
            {
              num: "01",
              bg: "var(--panel-butter)",
              title: "Creator applies.",
              body: "A local creator applies for a campaign. Push approves them based on verified visit history — no follower minimum required.",
              detail:
                "No follower minimum · Visit-history scored · 48h decision",
            },
            {
              num: "02",
              bg: "var(--panel-sky)",
              title: "Creator posts a story.",
              body: "The creator visits, posts in their own voice, and includes a campaign-specific QR poster. No brand brief, no script.",
              detail: "Own voice · No brief · QR embedded in content",
            },
            {
              num: "03",
              bg: "var(--panel-blush)",
              title: "Customer scans QR.",
              body: "A follower sees the post, walks in, and scans the QR. GPS + timestamp are captured and cross-checked against venue signal.",
              detail: "GPS dwell · Timestamp match · Venue signal cross-check",
            },
            {
              num: "04",
              bg: "var(--surface-2)",
              title: "Merchant pays.",
              body: "Verification clears inside 72 hours. Merchant pays only for confirmed walk-ins. Creator receives a Stripe payout every Friday.",
              detail:
                "72h oracle window · Friday Stripe payout · 0 false positives",
            },
          ].map((step, i, arr) => (
            <div
              key={step.num}
              style={{
                background: step.bg,
                borderRadius: "var(--r-md)",
                padding: "48px 48px 48px 56px",
                marginBottom: i < arr.length - 1 ? 24 : 0,
                display: "grid",
                gridTemplateColumns: "96px 1fr 2fr",
                gap: 40,
                alignItems: "flex-start",
              }}
            >
              {/* Large brand-red step number */}
              <div
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 900,
                  fontSize: 80,
                  letterSpacing: "-0.05em",
                  lineHeight: 0.9,
                  color: "var(--brand-red)",
                  userSelect: "none",
                }}
              >
                {step.num}
              </div>
              {/* H3 exactly 28px */}
              <h3
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 700,
                  fontSize: 28,
                  letterSpacing: "-0.015em",
                  lineHeight: 1.15,
                  color: "var(--ink)",
                  margin: "8px 0 0",
                }}
              >
                {step.title}
              </h3>
              <div style={{ paddingTop: 8 }}>
                <p
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 20,
                    lineHeight: 1.4,
                    letterSpacing: "-0.1em",
                    color: "var(--ink-3)",
                    margin: "0 0 16px",
                  }}
                >
                  {step.body}
                </p>
                <p
                  className="eyebrow"
                  style={{ color: "var(--ink-4)", margin: 0 }}
                >
                  {step.detail}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ 03 — ROLES COMPARISON — two-column editorial split ═
          Creator flow vs Merchant flow, separated by thick hairline
          Panel butter (warm) follows surface (warm) → ok, sig divider separates
          ═══════════════════════════════════════════════════════ */}
      <section
        aria-label="Creator and merchant flow"
        style={{
          background: "var(--panel-butter)",
          padding: "96px 64px",
        }}
      >
        <div style={{ maxWidth: 1140, margin: "0 auto" }}>
          <p
            className="eyebrow"
            style={{ color: "var(--ink-3)", marginBottom: 16 }}
          >
            (YOUR ROLE)
          </p>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 800,
              fontSize: 40,
              letterSpacing: "-0.02em",
              lineHeight: 1.05,
              color: "var(--ink)",
              margin: "0 0 56px",
            }}
          >
            Two sides of
            <br />
            the same scan.
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1px 1fr",
              gap: 64,
              alignItems: "flex-start",
            }}
          >
            {/* Creator column */}
            <div>
              <p
                className="eyebrow"
                style={{ color: "var(--brand-red)", marginBottom: 24 }}
              >
                (FOR CREATORS)
              </p>
              {[
                {
                  step: "01",
                  text: "Apply with your visit history, not follower count.",
                },
                {
                  step: "02",
                  text: "Get matched to campaigns in your neighborhoods.",
                },
                {
                  step: "03",
                  text: "Post in your own voice — no brand brief, no script.",
                },
                {
                  step: "04",
                  text: "Collect Stripe payout every Friday. See exact scan count.",
                },
              ].map((row) => (
                <div
                  key={row.step}
                  style={{
                    display: "flex",
                    gap: 24,
                    paddingBottom: 32,
                    marginBottom: 32,
                    borderBottom: "1px solid var(--hairline)",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: 14,
                      fontWeight: 600,
                      letterSpacing: "0.04em",
                      color: "var(--brand-red)",
                      flexShrink: 0,
                      paddingTop: 2,
                    }}
                  >
                    {row.step}
                  </span>
                  <p
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: 20,
                      lineHeight: 1.4,
                      letterSpacing: "-0.1em",
                      color: "var(--ink-3)",
                      margin: 0,
                    }}
                  >
                    {row.text}
                  </p>
                </div>
              ))}
              <Link href="/creator/signup" className="btn-primary click-shift">
                Apply as creator
              </Link>
            </div>

            {/* Hairline divider */}
            <div
              aria-hidden="true"
              style={{ background: "var(--hairline-2)", alignSelf: "stretch" }}
            />

            {/* Merchant column */}
            <div>
              <p
                className="eyebrow"
                style={{ color: "var(--ink-3)", marginBottom: 24 }}
              >
                (FOR MERCHANTS)
              </p>
              {[
                {
                  step: "01",
                  text: "List your venue — we match you to verified local creators.",
                },
                {
                  step: "02",
                  text: "Set your per-visit rate. No subscription, no minimum spend.",
                },
                {
                  step: "03",
                  text: "QR posters go up in your neighborhood. You track in real time.",
                },
                {
                  step: "04",
                  text: "Pay only after oracle confirms the visit. Invoice auto-generated.",
                },
              ].map((row) => (
                <div
                  key={row.step}
                  style={{
                    display: "flex",
                    gap: 24,
                    paddingBottom: 32,
                    marginBottom: 32,
                    borderBottom: "1px solid var(--hairline)",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: 14,
                      fontWeight: 600,
                      letterSpacing: "0.04em",
                      color: "var(--ink-4)",
                      flexShrink: 0,
                      paddingTop: 2,
                    }}
                  >
                    {row.step}
                  </span>
                  <p
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: 20,
                      lineHeight: 1.4,
                      letterSpacing: "-0.1em",
                      color: "var(--ink-3)",
                      margin: 0,
                    }}
                  >
                    {row.text}
                  </p>
                </div>
              ))}
              <Link href="/merchant/signup" className="btn-ghost click-shift">
                List your venue
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ 04 — TECHNICAL VERIFICATION (dark ink) ═══════════
          var(--ink) bg, snow text on dark (§ 2.7 rule 3)
          ═══════════════════════════════════════════════════════ */}
      <section
        aria-label="Three-signal verification"
        style={{
          background: "var(--ink)",
          padding: "96px 64px",
        }}
      >
        <div style={{ maxWidth: 1140, margin: "0 auto" }}>
          <p
            className="eyebrow"
            style={{ color: "rgba(255,255,255,0.65)", marginBottom: 16 }}
          >
            (HOW VERIFICATION WORKS)
          </p>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 800,
              fontSize: 40,
              letterSpacing: "-0.02em",
              lineHeight: 1.05,
              color: "var(--snow)",
              margin: "0 0 56px",
            }}
          >
            Three-signal
            <br />
            verification.
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 2,
            }}
          >
            {[
              {
                num: "01",
                title: "QR Scan",
                body: "Each creator holds a unique QR. Scanning it at the venue door logs the creator, campaign, and exact timestamp. No QR scan — no payout consideration.",
              },
              {
                num: "02",
                title: "GPS Dwell",
                body: "The customer's phone is checked against the venue coordinates. A scan from the sidewalk outside doesn't count. Dwell time must match a real visit pattern.",
              },
              {
                num: "03",
                title: "Timestamp Match",
                body: "Scan time is matched against venue hours and any POS signal available. Three signals must align before the oracle clears the visit for payment.",
              },
            ].map((col) => (
              <div
                key={col.num}
                style={{
                  borderTop: "2px solid rgba(255,255,255,0.12)",
                  padding: "40px 40px 0 0",
                }}
              >
                <p
                  className="eyebrow"
                  style={{
                    color: "rgba(255,255,255,0.65)",
                    marginBottom: 24,
                  }}
                >
                  {col.num}
                </p>
                {/* H3 exactly 28px */}
                <h3
                  style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 700,
                    fontSize: 28,
                    letterSpacing: "-0.015em",
                    lineHeight: 1.15,
                    color: "var(--snow)",
                    margin: "0 0 16px",
                  }}
                >
                  {col.title}
                </h3>
                <p
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 20,
                    lineHeight: 1.4,
                    letterSpacing: "-0.1em",
                    color: "var(--snow)",
                    opacity: 0.72,
                    margin: 0,
                  }}
                >
                  {col.body}
                </p>
              </div>
            ))}
          </div>

          {/* KPI proof strip — "3 steps · 10 min setup · 30 day free trial" */}
          <div
            style={{
              marginTop: 80,
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: 2,
              borderTop: "1px solid rgba(255,255,255,0.1)",
              paddingTop: 40,
            }}
          >
            {[
              { val: "72h", label: "Oracle window" },
              { val: "Fri", label: "Stripe payout day" },
              { val: "100%", label: "Visits QR-confirmed" },
              { val: "0", label: "Follower minimum" },
            ].map((kpi) => (
              <div
                key={kpi.val}
                style={{
                  padding: "0 0 0 24px",
                  borderLeft: "1px solid rgba(255,255,255,0.1)",
                }}
              >
                {/* KPI numeral — Darky clamp(40,5vw,72) 700 (§ 3.1 Stat numeral) */}
                <div
                  style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 900,
                    fontSize: "clamp(40px, 5vw, 72px)",
                    letterSpacing: "-0.04em",
                    lineHeight: 1.0,
                    color: "var(--snow)",
                  }}
                >
                  {kpi.val}
                </div>
                <p
                  className="eyebrow"
                  style={{
                    color: "rgba(255,255,255,0.65)",
                    marginTop: 16,
                  }}
                >
                  {kpi.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ 05 — TICKET CTA ══════════════════════════════════
          § 8.2: ga-orange bg, r-md 10px, 64px 96px padding,
          Magvix Italic centered headline, btn-ink CTA, flat no-shadow
          ═══════════════════════════════════════════════════════ */}
      <section
        aria-label="Start in minutes"
        style={{
          background: "var(--surface)",
          padding: "96px 64px",
        }}
      >
        <div style={{ maxWidth: 1140, margin: "0 auto" }}>
          <div className="ticket-panel" style={{ position: "relative" }}>
            {/* Grommet corners — 16px solid circles, 24px inset (§ 8.2) */}
            {[
              { top: 24, left: 24 },
              { top: 24, right: 24 },
              { bottom: 24, left: 24 },
              { bottom: 24, right: 24 },
            ].map((pos, i) => (
              <div
                key={i}
                aria-hidden="true"
                style={{
                  position: "absolute",
                  width: 16,
                  height: 16,
                  borderRadius: "var(--r-full)",
                  background: "var(--ink)",
                  ...pos,
                }}
              />
            ))}

            <p
              className="eyebrow"
              style={{ color: "rgba(10,10,10,0.55)", marginBottom: 24 }}
            >
              (READY TO START)
            </p>

            {/* Magvix Italic clamp(40,5vw,56) centered (§ 8.2) */}
            <h2
              style={{
                fontFamily: "var(--font-hero)",
                fontStyle: "italic",
                fontWeight: 400,
                fontSize: "clamp(40px, 5vw, 56px)",
                letterSpacing: "-0.03em",
                lineHeight: 0.95,
                color: "var(--ink)",
                margin: "0 0 16px",
                textAlign: "center",
              }}
            >
              Start in minutes.
            </h2>

            <p
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 16,
                color: "var(--ink)",
                opacity: 0.72,
                maxWidth: "44ch",
                lineHeight: 1.4,
                letterSpacing: "-0.1em",
                margin: "0 auto 32px",
                textAlign: "center",
              }}
            >
              List your venue or apply as a creator — the oracle handles the
              rest. No subscription, no setup fee, no follower gate.
            </p>

            <div
              style={{
                display: "flex",
                gap: 16,
                justifyContent: "center",
                flexWrap: "wrap",
              }}
            >
              <Link href="/merchant/signup" className="btn-ink click-shift">
                List your venue
              </Link>
              <Link href="/creator/signup" className="btn-ghost click-shift">
                Apply as creator
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
