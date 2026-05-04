import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Referrals — Push",
  description:
    "Earn $50 per referral. Share your Push referral link and earn when your friends run their first campaign.",
};

const LEADERBOARD = [
  { rank: 1, handle: "@maya.eats.nyc", tier: "Elite", earned: 1_320 },
  { rank: 2, handle: "@brooklyn_bites", tier: "Pro", earned: 1_090 },
  { rank: 3, handle: "@nycfoodie_", tier: "Elite", earned: 950 },
  { rank: 4, handle: "@williamsburg.eats", tier: "Pro", earned: 780 },
  { rank: 5, handle: "@lowereastside_food", tier: "Rising", earned: 700 },
];

const HOW_IT_WORKS = [
  {
    num: "01",
    title: "Share your link",
    body: "Copy your unique referral link from your Push dashboard and share it anywhere — DMs, stories, email, or a QR code you print.",
  },
  {
    num: "02",
    title: "Friend signs up",
    body: "Your friend creates a Push account through your link and sets up their profile. You are already on the board.",
  },
  {
    num: "03",
    title: "Both earn $50",
    body: "When your referred friend runs their first Push campaign, you receive $50 to your Push Wallet. They get $50 too.",
  },
];

const PAYOUT_ROWS = [
  {
    label: "Referral reward",
    value: "$50",
    note: "Per referred merchant, paid on first campaign",
  },
  {
    label: "Your friend also earns",
    value: "$50",
    note: "Credited on their first campaign launch",
  },
  {
    label: "Monthly earning cap",
    value: "$2,000",
    note: "Cash-equivalent payouts per calendar month",
  },
  {
    label: "Minimum withdrawal",
    value: "$25",
    note: "Via Stripe Connect direct deposit",
  },
];

export default function ReferralsPage() {
  return (
    <>
      {/* ══ 01 — HERO (dark ink, Darky display bottom-left) ══ */}
      <section
        style={{
          background: "var(--ink)",
          color: "var(--snow)",
          padding: "96px clamp(24px,6vw,64px)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div style={{ maxWidth: 1140, margin: "0 auto", position: "relative" }}>
          <p
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: "0.12em",
              textTransform: "uppercase" as const,
              color: "rgba(255,255,255,0.45)",
              margin: "0 0 24px",
            }}
          >
            (REFER &amp; EARN)
          </p>

          {/* Darky Display hero — bottom-left anchored */}
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(56px,8vw,128px)",
              fontWeight: 900,
              lineHeight: 0.9,
              color: "var(--snow)",
              margin: "0 0 48px",
              letterSpacing: "-0.035em",
            }}
          >
            Earn more,
            <br />
            together.
          </h1>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "clamp(32px,5vw,72px)",
              alignItems: "end",
            }}
          >
            <p
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 18,
                color: "rgba(255,255,255,0.55)",
                lineHeight: 1.55,
                margin: 0,
              }}
            >
              Share your link. Your friend signs up and runs their first
              campaign. You both earn $50. No limits on referrals, no expiry on
              your link.
            </p>
            <div
              style={{ display: "flex", gap: 16, flexWrap: "wrap" as const }}
            >
              <Link href="/creator/login" className="btn-primary click-shift">
                Get my referral link
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ══ SIG DIVIDER ══ */}
      <div className="sig-divider">
        Share&nbsp;·&nbsp;Sign up&nbsp;·&nbsp;Earn&nbsp;·
      </div>

      {/* ══ 02 — REFERRAL CODE CANDY PANEL ══ */}
      <section
        style={{
          background: "var(--surface)",
          padding: "96px clamp(24px,6vw,64px)",
        }}
      >
        <div style={{ maxWidth: 1140, margin: "0 auto" }}>
          <p
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: "0.12em",
              textTransform: "uppercase" as const,
              color: "var(--ink-4)",
              margin: "0 0 32px",
            }}
          >
            (YOUR REFERRAL CODE)
          </p>

          {/* Candy Panel — 28px radius, 96px padding, butter bg */}
          <div
            style={{
              background: "var(--panel-butter)",
              borderRadius: 28,
              padding: 96,
            }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "clamp(40px,6vw,80px)",
                alignItems: "center",
              }}
            >
              {/* Left — code display */}
              <div>
                <h2
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: 40,
                    fontWeight: 800,
                    color: "var(--ink)",
                    lineHeight: 1.05,
                    margin: "0 0 24px",
                    letterSpacing: "-0.02em",
                  }}
                >
                  Your code.
                  <br />
                  Their first step.
                </h2>
                <p
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 18,
                    color: "var(--ink-3)",
                    lineHeight: 1.55,
                    margin: "0 0 32px",
                  }}
                >
                  Payout triggers when your referred merchant runs their first
                  Push campaign. Credit lands in your Push Wallet within 48
                  hours. No cap on referrals. No expiry.
                </p>

                {/* Code block — ink bg, Darky 40px 900 brand-red code */}
                <div
                  style={{
                    background: "var(--ink)",
                    borderRadius: 10,
                    padding: "32px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 16,
                    flexWrap: "wrap" as const,
                  }}
                >
                  <div>
                    <p
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: 12,
                        fontWeight: 700,
                        letterSpacing: "0.12em",
                        textTransform: "uppercase" as const,
                        color: "rgba(255,255,255,0.4)",
                        margin: "0 0 8px",
                      }}
                    >
                      (REFERRAL CODE)
                    </p>
                    <code
                      style={{
                        fontFamily: "var(--font-display)",
                        fontSize: 40,
                        fontWeight: 900,
                        color: "var(--brand-red)",
                        letterSpacing: "0.04em",
                        lineHeight: 1.0,
                      }}
                    >
                      PUSH-JIAMING
                    </code>
                  </div>
                  <Link
                    href="/creator/login"
                    className="btn-ink click-shift"
                    style={{ flexShrink: 0 }}
                  >
                    Copy link
                  </Link>
                </div>
              </div>

              {/* Right — payout stat cards */}
              <div
                style={{ display: "flex", flexDirection: "column", gap: 16 }}
              >
                {PAYOUT_ROWS.map((row) => (
                  <div
                    key={row.label}
                    style={{
                      background: "var(--surface)",
                      borderRadius: 10,
                      padding: "24px",
                      border: "1px solid var(--hairline)",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: 16,
                    }}
                  >
                    <div>
                      <div
                        style={{
                          fontFamily: "var(--font-mono)",
                          fontSize: 12,
                          fontWeight: 700,
                          color: "var(--ink-4)",
                          letterSpacing: "0.08em",
                          textTransform: "uppercase" as const,
                          marginBottom: 4,
                        }}
                      >
                        {row.label}
                      </div>
                      <div
                        style={{
                          fontFamily: "var(--font-mono)",
                          fontSize: 12,
                          color: "var(--ink-4)",
                        }}
                      >
                        {row.note}
                      </div>
                    </div>
                    <div
                      style={{
                        fontFamily: "var(--font-display)",
                        fontSize: "clamp(24px,3vw,40px)",
                        fontWeight: 900,
                        color: "var(--ink)",
                        lineHeight: 1.0,
                        letterSpacing: "-0.02em",
                        flexShrink: 0,
                      }}
                    >
                      {row.value}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ 03 — HOW IT WORKS (surface-2, 3-step editorial rows) ══ */}
      <section
        style={{
          background: "var(--surface-2)",
          padding: "96px clamp(24px,6vw,64px)",
        }}
      >
        <div style={{ maxWidth: 1140, margin: "0 auto" }}>
          <p
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: "0.12em",
              textTransform: "uppercase" as const,
              color: "var(--ink-4)",
              margin: "0 0 16px",
            }}
          >
            (HOW IT WORKS)
          </p>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 40,
              fontWeight: 800,
              color: "var(--ink)",
              lineHeight: 1.05,
              margin: "0 0 64px",
              letterSpacing: "-0.02em",
            }}
          >
            Three steps. Two earners.
          </h2>

          {/* 3-step numbered editorial rows */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              borderTop: "1px solid var(--hairline)",
            }}
          >
            {HOW_IT_WORKS.map((step) => (
              <div
                key={step.num}
                style={{
                  display: "grid",
                  gridTemplateColumns: "80px 1fr 2fr",
                  gap: "0 32px",
                  padding: "40px 0",
                  borderBottom: "1px solid var(--hairline)",
                  alignItems: "start",
                }}
              >
                {/* number */}
                <span
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: 64,
                    fontWeight: 900,
                    color: "var(--hairline)",
                    lineHeight: 1.0,
                  }}
                >
                  {step.num}
                </span>
                {/* H3 title */}
                <h3
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: 28,
                    fontWeight: 700,
                    color: "var(--ink)",
                    margin: "8px 0 0",
                    lineHeight: 1.15,
                    letterSpacing: "-0.015em",
                  }}
                >
                  {step.title}
                </h3>
                {/* body */}
                <p
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 18,
                    color: "var(--ink-3)",
                    lineHeight: 1.55,
                    margin: "8px 0 0",
                  }}
                >
                  {step.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ SIG DIVIDER ══ */}
      <div className="sig-divider">
        Invited&nbsp;·&nbsp;Verified&nbsp;·&nbsp;Paid&nbsp;·
      </div>

      {/* ══ 04 — LEADERBOARD (panel-sky) ══ */}
      <section
        style={{
          background: "var(--panel-sky)",
          padding: "96px clamp(24px,6vw,64px)",
        }}
      >
        <div style={{ maxWidth: 1140, margin: "0 auto" }}>
          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "space-between",
              flexWrap: "wrap" as const,
              gap: 16,
              marginBottom: 64,
            }}
          >
            <div>
              <p
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 12,
                  fontWeight: 700,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase" as const,
                  color: "var(--ink-4)",
                  margin: "0 0 16px",
                }}
              >
                (TOP REFERRERS)
              </p>
              <h2
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: 40,
                  fontWeight: 800,
                  color: "var(--ink)",
                  lineHeight: 1.05,
                  margin: 0,
                  letterSpacing: "-0.02em",
                }}
              >
                This month&apos;s top earners.
              </h2>
            </div>
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 12,
                color: "var(--ink-4)",
                letterSpacing: "0.06em",
                textTransform: "uppercase" as const,
              }}
            >
              April 2026 &middot; Resets May 1
            </span>
          </div>

          {/* Editorial table */}
          <div
            style={{
              background: "var(--surface)",
              borderRadius: 10,
              border: "1px solid var(--hairline)",
              overflow: "hidden",
            }}
          >
            {/* Header — mono 12px 700 uppercase parenthetical */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "48px 1fr 120px 120px",
                padding: "16px 32px",
                background: "var(--surface-3)",
                borderBottom: "1px solid var(--hairline)",
              }}
            >
              {["(#)", "(CREATOR)", "(TIER)", "(EARNED)"].map((h) => (
                <span
                  key={h}
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 12,
                    fontWeight: 700,
                    letterSpacing: "0.12em",
                    textTransform: "uppercase" as const,
                    color: "var(--ink-4)",
                  }}
                >
                  {h}
                </span>
              ))}
            </div>

            {LEADERBOARD.map((entry, i) => (
              <div
                key={entry.rank}
                style={{
                  display: "grid",
                  gridTemplateColumns: "48px 1fr 120px 120px",
                  padding: "20px 32px",
                  alignItems: "center",
                  borderBottom:
                    i < LEADERBOARD.length - 1
                      ? "1px dotted var(--hairline)"
                      : "none",
                }}
              >
                {/* rank — Darky first cell */}
                <span
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: 20,
                    fontWeight: 700,
                    color:
                      entry.rank === 1 ? "var(--brand-red)" : "var(--ink-4)",
                    letterSpacing: "-0.01em",
                  }}
                >
                  {entry.rank}
                </span>
                <span
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: 18,
                    fontWeight: 700,
                    color: "var(--ink)",
                    letterSpacing: "-0.01em",
                  }}
                >
                  {entry.handle}
                </span>
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 16,
                    color: "var(--ink-4)",
                    letterSpacing: "0.02em",
                  }}
                >
                  {entry.tier}
                </span>
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 16,
                    fontWeight: 700,
                    color: "var(--ink)",
                    textAlign: "right" as const,
                  }}
                >
                  ${entry.earned.toLocaleString()}
                </span>
              </div>
            ))}
          </div>

          <p
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 12,
              color: "var(--ink-4)",
              marginTop: 16,
              lineHeight: 1.55,
            }}
          >
            Earnings shown are confirmed milestones. Updated daily. Opt in to
            public leaderboard in Account Settings to appear.
          </p>
        </div>
      </section>

      {/* ══ 05 — TICKET CTA ══ */}
      <section
        style={{
          background: "var(--surface)",
          padding: "96px clamp(24px,6vw,64px)",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            background: "var(--ga-orange)",
            borderRadius: 10,
            padding: "64px 96px",
            maxWidth: 640,
            width: "100%",
            textAlign: "center" as const,
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* grommets */}
          {[
            { top: "50%", left: 24, transform: "translateY(-50%)" },
            { top: "50%", right: 24, transform: "translateY(-50%)" },
          ].map((pos, i) => (
            <div
              key={i}
              aria-hidden="true"
              style={{
                position: "absolute",
                width: 16,
                height: 16,
                borderRadius: "50%",
                background: "var(--ink)",
                ...pos,
              }}
            />
          ))}
          {/* perforation top */}
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              top: 0,
              left: 48,
              right: 48,
              height: 0,
              borderTop: "2px dashed rgba(0,0,0,0.15)",
            }}
          />
          {/* perforation bottom */}
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              bottom: 0,
              left: 48,
              right: 48,
              height: 0,
              borderBottom: "2px dashed rgba(0,0,0,0.15)",
            }}
          />

          <p
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: "0.12em",
              textTransform: "uppercase" as const,
              color: "rgba(255,255,255,0.55)",
              margin: "0 0 24px",
            }}
          >
            (START EARNING)
          </p>
          <h2
            style={{
              fontFamily: "var(--font-hero)",
              fontStyle: "italic",
              fontSize: "clamp(40px,5vw,56px)",
              fontWeight: 400,
              color: "var(--snow)",
              lineHeight: 1.0,
              margin: "0 0 32px",
              letterSpacing: "-0.02em",
            }}
          >
            Get your referral link.
          </h2>
          <Link href="/creator/login" className="btn-ink click-shift">
            Sign in to get my link
          </Link>
        </div>
      </section>
    </>
  );
}
