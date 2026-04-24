import type { Metadata } from "next";
import Link from "next/link";
import ScrollRevealInit from "@/components/layout/ScrollRevealInit";
import HowItWorksClient from "./HowItWorksClient";
import "./how-it-works.css";

export const metadata: Metadata = {
  title: "How Push Works — Pay Per Verified Visit",
  description:
    "Creator posts, customer scans the QR, oracle confirms, Stripe pays out on Friday. Push is a per-verified-visit creator system piloting in SoHo, Tribeca, and Chinatown.",
};

/* ── QR Diagram SVG ──────────────────────────────────────── */
function QRMiniSVG() {
  // 7x7 grid pattern — simplified QR representation
  const filled = [
    [0, 0],
    [1, 0],
    [2, 0],
    [3, 0],
    [4, 0],
    [5, 0],
    [6, 0],
    [0, 1],
    [6, 1],
    [0, 2],
    [2, 2],
    [3, 2],
    [4, 2],
    [6, 2],
    [0, 3],
    [2, 3],
    [4, 3],
    [6, 3],
    [0, 4],
    [2, 4],
    [3, 4],
    [4, 4],
    [6, 4],
    [0, 5],
    [6, 5],
    [0, 6],
    [1, 6],
    [2, 6],
    [3, 6],
    [4, 6],
    [5, 6],
    [6, 6],
  ];
  const accents = [
    [2, 2],
    [3, 3],
    [4, 4],
  ];

  return (
    <div className="demo-qr">
      <div className="demo-qr-box">
        <div className="demo-qr-scan-line" />
        <div className="demo-qr-inner">
          {Array.from({ length: 7 }, (_, row) =>
            Array.from({ length: 7 }, (_, col) => {
              const isFilled = filled.some(([c, r]) => c === col && r === row);
              const isAccent = accents.some(([c, r]) => c === col && r === row);
              return (
                <div
                  key={`${col}-${row}`}
                  className={`demo-qr-cell${isFilled ? " filled" : ""}${isAccent ? " accent" : ""}`}
                />
              );
            }),
          )}
        </div>
      </div>
      <div className="demo-qr-verified">
        <span className="demo-qr-verified-dot" />
        Visit verified
      </div>
    </div>
  );
}

/* ── Demo: Campaign Post ─────────────────────────────────── */
function DemoPostCampaign() {
  return (
    <div className="demo-post">
      <div className="demo-post-header">
        <span className="demo-post-dot" />
        Campaign live · SoHo
      </div>
      <div className="demo-post-card">
        <div className="demo-post-card-title">Ramen &amp; Co.</div>
        <div className="demo-post-card-meta">
          Mott St, Chinatown · open until 11
        </div>
        <div className="demo-post-payout">$32</div>
        <div className="demo-post-payout-label">
          per verified visit · Operator tier
        </div>
        <div className="demo-post-progress">
          <div className="demo-post-progress-fill" />
        </div>
      </div>
    </div>
  );
}

/* ── Demo: Creator Content ───────────────────────────────── */
function DemoCreatorContent() {
  return (
    <div className="demo-creator">
      <div className="demo-creator-profile">
        <div className="demo-creator-avatar" />
        <div className="demo-creator-info">
          <span className="demo-creator-handle">@maya.eats.nyc</span>
          <span className="demo-creator-tier">Operator · 38 verified</span>
        </div>
      </div>
      <div className="demo-creator-content-block">
        <span className="demo-creator-content-label">Post published</span>
      </div>
      <div className="demo-earn-badge">
        <span>Friday payout</span>
        <span className="demo-earn-amount">+$32</span>
      </div>
    </div>
  );
}

/* ── Attribution SVG diagram ─────────────────────────────── */
function AttributionDiagram() {
  return (
    <div className="hiw-attr-diagram">
      {/* Node 1 — Creator */}
      <div className="hiw-attr-node">
        <div className="hiw-attr-node-icon hiw-attr-node--primary">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <path
              strokeLinecap="square"
              d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0z"
            />
          </svg>
        </div>
        <span className="hiw-attr-node-label">Creator</span>
        <span className="hiw-attr-node-sub">Posts a real spot</span>
      </div>

      <span className="hiw-attr-arrow" aria-hidden="true">
        →
      </span>

      {/* Node 2 — Audience */}
      <div className="hiw-attr-node">
        <div className="hiw-attr-node-icon">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <path
              strokeLinecap="square"
              d="M2.25 15a4.5 4.5 0 004.5 4.5H18a3.75 3.75 0 001.332-7.257 3 3 0 00-3.758-3.848 5.25 5.25 0 00-10.233 2.33A4.502 4.502 0 002.25 15z"
            />
          </svg>
        </div>
        <span className="hiw-attr-node-label">Customer</span>
        <span className="hiw-attr-node-sub">Walks in</span>
      </div>

      <span className="hiw-attr-arrow" aria-hidden="true">
        →
      </span>

      {/* Node 3 — QR Scan */}
      <div className="hiw-attr-node">
        <div className="hiw-attr-node-icon hiw-attr-node--primary">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <path
              strokeLinecap="square"
              d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 013.75 9.375v-4.5zM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 01-1.125-1.125v-4.5zM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0113.5 9.375v-4.5z"
            />
            <path
              strokeLinecap="square"
              d="M6.75 6.75h.75v.75h-.75v-.75zM6.75 16.5h.75v.75h-.75v-.75zM16.5 6.75h.75v.75h-.75v-.75zM13.5 13.5h.75v.75h-.75v-.75zM13.5 19.5h.75v.75h-.75v-.75zM19.5 13.5h.75v.75h-.75v-.75zM19.5 19.5h.75v.75h-.75v-.75zM16.5 16.5h.75v.75h-.75v-.75z"
            />
          </svg>
        </div>
        <span className="hiw-attr-node-label">QR scan</span>
        <span className="hiw-attr-node-sub">At the door</span>
      </div>

      <span className="hiw-attr-arrow" aria-hidden="true">
        →
      </span>

      {/* Node 4 — Verified */}
      <div className="hiw-attr-node">
        <div className="hiw-attr-node-icon hiw-attr-node--verified">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <path
              strokeLinecap="square"
              strokeLinejoin="miter"
              d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z"
            />
          </svg>
        </div>
        <span className="hiw-attr-node-label">Friday payout</span>
        <span className="hiw-attr-node-sub">Stripe Connect</span>
      </div>
    </div>
  );
}

/* ── Comparison rows — Push vs. impressions-based marketing ── */
const COMPARE_ROWS = [
  {
    feature: "What you pay for",
    traditional: "Impressions, reach, clicks",
    push: "One verified physical visit",
  },
  {
    feature: "How attribution lands",
    traditional: "Estimated, cookie-driven",
    push: "QR scan timestamped at the door",
  },
  {
    feature: "When the merchant pays",
    traditional: "Upfront, then hope",
    push: "After the customer walks in",
  },
  {
    feature: "Creator entry bar",
    traditional: "10K+ followers",
    push: "Real local taste, no minimum",
  },
  {
    feature: "Cohort cost to start",
    traditional: "$500–$3,000 / month retainer",
    push: "Free to apply · per-visit pricing",
  },
  {
    feature: "Payout cadence",
    traditional: "30–90 days, manual",
    push: "Friday, Stripe Connect",
  },
  {
    feature: "Where it works",
    traditional: "ZIP-level estimates",
    push: "SoHo, Tribeca, Chinatown — by foot",
  },
];

/* ── Pilot numbers ──────────────────────────────────────── */
const METRICS = [
  {
    num: "5",
    label: "Anchor venues",
    sub: "lower manhattan, signed for cohort 01",
    primary: true,
  },
  {
    num: "10",
    label: "Creators on the roster",
    sub: "every application read by Jiaming, 48-hour reply",
    primary: false,
  },
  {
    num: "72h",
    label: "Oracle window",
    sub: "scan → consensus → payout cleared for release",
    primary: false,
  },
  {
    num: "Fri",
    label: "Payout day",
    sub: "Stripe Connect, end-of-week sweep",
    primary: false,
  },
  {
    num: "0",
    label: "Follower minimum",
    sub: "tier rate is set by verified visits, not reach",
    primary: false,
  },
  {
    num: "06",
    label: "Tiers, Seed → Partner",
    sub: "you move up when the visits move up",
    primary: false,
  },
];

/* ── Edge cases (FAQ-style prose) ─────────────────────────── */
const EDGE_CASES = [
  {
    q: "What if the customer scans but doesn't actually visit?",
    a: "The oracle holds the payout. A scan alone doesn't clear — it pairs with venue signal (POS receipt, dwell time, photo if the merchant opts in). No match in 72 hours, the payout drops and the creator is told why.",
  },
  {
    q: "What if two creators drove the same person?",
    a: "Whichever QR was scanned at the door wins the visit. No split, no negotiation. The other creator's post still counts toward their Score history, just not this payout.",
  },
  {
    q: "What about scan-fraud — a creator scans their own QR?",
    a: "Self-scans are filtered at the oracle. Repeat self-scans flag the account for review. The pilot is small enough that Jiaming reads every flag within a day.",
  },
  {
    q: "What if the merchant disputes a visit?",
    a: "Disputes go through the oracle audit — same signals, replayed. If the merchant signal disagrees with the QR scan, the case escalates and Push covers the creator's payout in good faith. Three of those in a campaign and the merchant's settings get reviewed.",
  },
];

/* ── Page ────────────────────────────────────────────────── */
export default function HowItWorksPage() {
  return (
    <>
      <ScrollRevealInit />
      <HowItWorksClient />

      {/* ═══════════════ 01 — HERO (v7 ink + grain + vignette) ═══════════════ */}
      <section
        className="bg-hero-ink grain-overlay bg-vignette"
        id="main-content"
        aria-labelledby="hiw-hero-heading"
        style={{
          position: "relative",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          padding: "clamp(24px, 4vw, 64px)",
          paddingTop: "clamp(80px, 8vw, 120px)",
          overflow: "hidden",
        }}
      >
        {/* Top row: pill (cohort) + eyebrow (date) */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 16,
            position: "relative",
            zIndex: 3,
          }}
        >
          <span className="pill-lux" style={{ color: "#fff" }}>
            Cohort 01 · SoHo / Tribeca / Chinatown
          </span>
          <span className="eyebrow-lux" style={{ color: "var(--champagne)" }}>
            Pilot opens June&nbsp;22
          </span>
        </div>

        {/* Hero center: ghost / display weight contrast */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            position: "relative",
            zIndex: 3,
            maxWidth: "1180px",
            margin: "0 auto",
            width: "100%",
            paddingTop: "clamp(48px, 8vh, 96px)",
            paddingBottom: "clamp(48px, 8vh, 96px)",
          }}
        >
          <div
            className="section-marker"
            data-num="01"
            style={{ color: "rgba(255,255,255,0.55)" }}
          >
            How the money flows
          </div>

          {/* Massive Darky 900 + Darky 200 ghost */}
          <h1
            id="hiw-hero-heading"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(72px, 14vw, 220px)",
              fontWeight: 900,
              letterSpacing: "-0.08em",
              lineHeight: 0.85,
              color: "#fff",
              margin: 0,
            }}
          >
            Post. Walk. Pay
            <span
              aria-hidden="true"
              style={{
                color: "var(--brand-red)",
                marginLeft: "-0.04em",
              }}
            >
              .
            </span>
          </h1>
          <div
            className="display-ghost"
            style={{
              fontSize: "clamp(44px, 8.5vw, 132px)",
              color: "rgba(255,255,255,0.22)",
              marginTop: "-0.04em",
            }}
          >
            four steps, one receipt.
          </div>

          <p
            style={{
              marginTop: "clamp(32px, 5vw, 56px)",
              maxWidth: 620,
              fontFamily: "var(--font-body)",
              fontSize: "clamp(15px, 1.15vw, 18px)",
              lineHeight: 1.65,
              color: "rgba(255,255,255,0.74)",
            }}
          >
            A creator posts a real recommendation. A customer who saw the post
            scans the QR at the door. The oracle confirms inside 72 hours.
            Stripe Connect sends the money on Friday. That is the whole loop.
          </p>
          <p
            style={{
              marginTop: "clamp(16px, 2vw, 24px)",
              maxWidth: 620,
              fontFamily: "var(--font-body)",
              fontSize: "clamp(13px, 1vw, 15px)",
              lineHeight: 1.65,
              color: "rgba(255,255,255,0.46)",
            }}
          >
            Below is each step laid out — what gets posted, what gets scanned,
            what the oracle checks, when the money clears. The same loop seen
            from a merchant&apos;s chair, then a creator&apos;s.
          </p>

          {/* Hero role tabs — drives panels in step section */}
          <div
            className="hiw-tabs"
            role="tablist"
            aria-label="Select your role"
            data-tab-group="hero"
            style={{ marginTop: "clamp(32px, 5vw, 48px)" }}
          >
            <button
              className="hiw-tab active"
              role="tab"
              aria-selected="true"
              data-tab="merchant"
              data-tab-group="hero"
            >
              I run a venue
            </button>
            <button
              className="hiw-tab"
              role="tab"
              aria-selected="false"
              data-tab="creator"
              data-tab-group="hero"
            >
              I post in my neighborhood
            </button>
          </div>

          <p
            className="reveal"
            data-hero-content="merchant"
            style={{
              marginTop: 24,
              maxWidth: 560,
              fontFamily: "var(--font-body)",
              fontSize: 14,
              lineHeight: 1.65,
              color: "rgba(255,255,255,0.62)",
            }}
          >
            Set a per-visit rate. Push surfaces the campaign to local creators
            scored on prior verified visits. You only pay after the door clears
            the scan.
          </p>
          <p
            className="reveal"
            data-hero-content="creator"
            style={{
              marginTop: 24,
              maxWidth: 560,
              fontFamily: "var(--font-body)",
              fontSize: 14,
              lineHeight: 1.65,
              color: "rgba(255,255,255,0.62)",
              display: "none",
            }}
          >
            Browse the campaigns within walking distance. Post in your voice.
            Your dashboard shows post → scan → visit → Friday payout, line by
            line.
          </p>
        </div>
      </section>

      {/* ═══════════════ 02 — THE FOUR STEPS ═══════════════ */}
      <section
        className="hiw-section bg-mesh-editorial"
        aria-labelledby="hiw-steps-heading"
      >
        <div className="container">
          <div className="reveal">
            <div className="section-marker" data-num="02">
              The four steps
            </div>
            <h2
              id="hiw-steps-heading"
              className="hiw-steps-headline"
              style={{ fontWeight: 900 }}
            >
              Four steps.
              <br />
              <span className="display-ghost">Nothing in between.</span>
            </h2>
            <p className="hiw-steps-sub">
              Same loop, two angles. Toggle to read it from a venue chair or a
              creator chair.
            </p>
          </div>

          {/* Role toggle (light section) */}
          <div
            className="hiw-role-tabs reveal"
            role="tablist"
            aria-label="Select role view"
            data-tab-group="steps"
          >
            <button
              className="hiw-role-tab active"
              role="tab"
              aria-selected="true"
              data-tab="merchant"
              data-tab-group="steps"
            >
              Merchant view
            </button>
            <button
              className="hiw-role-tab"
              role="tab"
              aria-selected="false"
              data-tab="creator"
              data-tab-group="steps"
            >
              Creator view
            </button>
          </div>

          {/* Merchant steps */}
          <div
            className="hiw-panel active"
            data-panel="merchant"
            data-panel-group="steps"
          >
            <div
              className="hiw-steps-grid four-col reveal"
              style={{ transitionDelay: "100ms" }}
            >
              <div className="hiw-step-card">
                <div className="hiw-step-num">01</div>
                <span className="hiw-step-label">Step one · post</span>
                <h3 className="hiw-step-title">Set a campaign</h3>
                <p className="hiw-step-body">
                  Pick a per-visit payout, a date window, a block radius. Push
                  surfaces it to creators scored on prior verified visits in
                  your category. Live inside a day.
                </p>
                <div className="hiw-step-demo">
                  <DemoPostCampaign />
                </div>
              </div>

              <div className="hiw-step-card">
                <div className="hiw-step-num">02</div>
                <span className="hiw-step-label">Step two · match</span>
                <h3 className="hiw-step-title">Pick the creator</h3>
                <p className="hiw-step-body">
                  See applicants ranked by Score and walking distance. Approve
                  by hand, or let the auto-match pick the top three. Each match
                  gets a creator-specific QR.
                </p>
                <div className="hiw-step-demo">
                  <div
                    style={{
                      padding: "var(--space-3)",
                      background: "var(--surface)",
                      border: "1px solid var(--line)",
                      fontFamily: "var(--font-body)",
                      fontSize: "13px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        marginBottom: "8px",
                      }}
                    >
                      <span
                        style={{
                          width: "28px",
                          height: "28px",
                          background: "var(--dark)",
                          flexShrink: 0,
                        }}
                      />
                      <div>
                        <div
                          style={{
                            fontWeight: 700,
                            color: "var(--dark)",
                            fontSize: "12px",
                          }}
                        >
                          @maya.eats.nyc
                        </div>
                        <div
                          style={{
                            color: "var(--text-muted)",
                            fontSize: "10px",
                          }}
                        >
                          Operator · 38 visits · 0.4mi
                        </div>
                      </div>
                      <span
                        style={{
                          marginLeft: "auto",
                          padding: "3px 8px",
                          background: "var(--primary)",
                          color: "#fff",
                          fontSize: "10px",
                          fontWeight: 700,
                          letterSpacing: "0.06em",
                        }}
                      >
                        MATCHED
                      </span>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                      }}
                    >
                      <span
                        style={{
                          width: "28px",
                          height: "28px",
                          background: "var(--dark)",
                          flexShrink: 0,
                          opacity: 0.4,
                        }}
                      />
                      <div>
                        <div
                          style={{
                            fontWeight: 700,
                            color: "var(--dark)",
                            fontSize: "12px",
                          }}
                        >
                          @brooklynbites_
                        </div>
                        <div
                          style={{
                            color: "var(--text-muted)",
                            fontSize: "10px",
                          }}
                        >
                          Proven · 61 visits · 0.8mi
                        </div>
                      </div>
                      <span
                        style={{
                          marginLeft: "auto",
                          padding: "3px 8px",
                          border: "1px solid var(--line)",
                          fontSize: "10px",
                          fontWeight: 700,
                          letterSpacing: "0.06em",
                          color: "var(--graphite)",
                        }}
                      >
                        PENDING
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="hiw-step-card">
                <div className="hiw-step-num">03</div>
                <span className="hiw-step-label">Step three · scan</span>
                <h3 className="hiw-step-title">Door reads the QR</h3>
                <p className="hiw-step-body">
                  Customer arrives, scans the poster, your POS pings back. The
                  oracle pairs scan + venue signal inside 72 hours. No match, no
                  charge.
                </p>
                <div className="hiw-step-demo">
                  <QRMiniSVG />
                </div>
              </div>

              <div className="hiw-step-card">
                <div className="hiw-step-num">04</div>
                <span className="hiw-step-label">Step four · pay</span>
                <h3 className="hiw-step-title">Friday, Stripe sends it</h3>
                <p className="hiw-step-body">
                  Verified visits clear into a weekly invoice. Stripe Connect
                  sweeps it Friday morning. The line items show creator, time,
                  scan ID — auditable end of story.
                </p>
                <div className="hiw-step-demo">
                  <DemoCreatorContent />
                </div>
              </div>
            </div>
          </div>

          {/* Creator steps */}
          <div
            className="hiw-panel"
            data-panel="creator"
            data-panel-group="steps"
          >
            <div
              className="hiw-steps-grid four-col reveal"
              style={{ transitionDelay: "100ms" }}
            >
              <div className="hiw-step-card">
                <div className="hiw-step-num">01</div>
                <span className="hiw-step-label">Step one · browse</span>
                <h3 className="hiw-step-title">
                  Find a campaign on your block
                </h3>
                <p className="hiw-step-body">
                  Pilot map covers SoHo, Tribeca, Chinatown. Filter by category
                  and your tier rate. Pick spots you would post about anyway.
                </p>
                <div className="hiw-step-demo">
                  <DemoPostCampaign />
                </div>
              </div>

              <div className="hiw-step-card">
                <div className="hiw-step-num">02</div>
                <span className="hiw-step-label">Step two · apply</span>
                <h3 className="hiw-step-title">Get matched on Score</h3>
                <p className="hiw-step-body">
                  Score is your verified-visit history. No follower minimum.
                  Apply, get a creator-specific QR within hours, post in your
                  voice — no brand brief.
                </p>
                <div className="hiw-step-demo">
                  <div
                    style={{
                      padding: "var(--space-3)",
                      background: "var(--surface)",
                      border: "1px solid var(--line)",
                      fontFamily: "var(--font-body)",
                      fontSize: "13px",
                    }}
                  >
                    <div
                      style={{
                        color: "var(--text-muted)",
                        fontSize: "10px",
                        marginBottom: "8px",
                        textTransform: "uppercase",
                        letterSpacing: "0.06em",
                        fontWeight: 700,
                      }}
                    >
                      Your roster card
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: "6px",
                      }}
                    >
                      <span
                        style={{ color: "var(--graphite)", fontSize: "12px" }}
                      >
                        Verified visits
                      </span>
                      <span
                        style={{
                          fontWeight: 700,
                          color: "var(--dark)",
                          fontSize: "12px",
                        }}
                      >
                        38
                      </span>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: "6px",
                      }}
                    >
                      <span
                        style={{ color: "var(--graphite)", fontSize: "12px" }}
                      >
                        Tier
                      </span>
                      <span
                        style={{
                          fontWeight: 700,
                          color: "var(--graphite)",
                          fontSize: "12px",
                        }}
                      >
                        Operator
                      </span>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <span
                        style={{ color: "var(--graphite)", fontSize: "12px" }}
                      >
                        Eligible nearby
                      </span>
                      <span
                        style={{
                          fontWeight: 700,
                          color: "var(--primary)",
                          fontSize: "12px",
                        }}
                      >
                        12 venues
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="hiw-step-card">
                <div className="hiw-step-num">03</div>
                <span className="hiw-step-label">Step three · post</span>
                <h3 className="hiw-step-title">Walk in, write it up</h3>
                <p className="hiw-step-body">
                  Visit. Take the photo, write the caption you would write
                  anyway. Drop your QR-tagged link. The post is on your feed —
                  your audience, your voice, no brand asks.
                </p>
                <div className="hiw-step-demo">
                  <DemoCreatorContent />
                </div>
              </div>

              <div className="hiw-step-card">
                <div className="hiw-step-num">04</div>
                <span className="hiw-step-label">Step four · paid</span>
                <h3 className="hiw-step-title">Friday, Stripe sends it</h3>
                <p className="hiw-step-body">
                  When someone scans your QR and the venue confirms, that visit
                  clears. Friday morning, Stripe Connect deposits the week. No
                  invoice, no chase.
                </p>
                <div className="hiw-step-demo">
                  <QRMiniSVG />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════ 03 — INSIDE EVERY STEP (editorial) ═══════════════ */}
      <section
        className="hiw-detail-section"
        aria-labelledby="hiw-detail-heading"
      >
        <div className="container">
          <div className="reveal" style={{ marginBottom: "var(--space-10)" }}>
            <div className="section-marker" data-num="03">
              Inside every step
            </div>
            <h2
              id="hiw-detail-heading"
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(36px, 4vw, 56px)",
                fontWeight: 900,
                letterSpacing: "-0.05em",
                lineHeight: 0.9,
                color: "var(--dark)",
              }}
            >
              The receipt,
              <br />
              <span className="display-ghost">unfolded.</span>
            </h2>
            <p
              style={{
                marginTop: 16,
                maxWidth: 560,
                fontFamily: "var(--font-body)",
                fontSize: 15,
                lineHeight: 1.7,
                color: "var(--graphite)",
              }}
            >
              Each step has a thing it does and a thing it does not. Here is
              what the data layer is actually doing while the loop runs.
            </p>
          </div>

          {/* Step 01 — Campaign Launch */}
          <div className="hiw-detail-item reveal">
            <div>
              <span className="hiw-detail-num" aria-hidden="true">
                01
              </span>
              <span className="hiw-detail-label">
                Step one · campaign goes up
              </span>
              <h3 className="hiw-detail-title">A merchant posts a brief.</h3>
              <p className="hiw-detail-body">
                A venue sets a per-visit rate, a date window, and a block
                radius. Push surfaces the brief to creators ranked on prior
                verified visits in that category. There is no agency, no media
                buyer, no SOW — the brief is one screen and goes live the same
                day.
              </p>
            </div>
            <div className="hiw-detail-visual">
              <DemoPostCampaign />
            </div>
          </div>

          {/* Step 02 — Creator Match */}
          <div
            className="hiw-detail-item reveal"
            style={{ transitionDelay: "100ms" }}
          >
            <div>
              <span className="hiw-detail-num" aria-hidden="true">
                02
              </span>
              <span className="hiw-detail-label">Step two · creator picks</span>
              <h3 className="hiw-detail-title">Score does the matching.</h3>
              <p className="hiw-detail-body">
                Score is one number, set by verified-visit history. A creator
                with 800 followers and 30 verified visits outranks a 50K-account
                with zero. Push assigns a creator-specific QR for the campaign —
                that QR is how every scan gets credited back to one post by one
                person.
              </p>
            </div>
            <div className="hiw-detail-visual">
              <DemoCreatorContent />
            </div>
          </div>

          {/* Step 03 — QR Scan + Oracle */}
          <div
            className="hiw-detail-item reveal"
            style={{ transitionDelay: "200ms" }}
          >
            <div>
              <span className="hiw-detail-num" aria-hidden="true">
                03
              </span>
              <span className="hiw-detail-label">
                Step three · oracle window
              </span>
              <h3 className="hiw-detail-title">
                The door confirms inside 72 hours.
              </h3>
              <p className="hiw-detail-body">
                The customer scans the QR at the venue. The oracle pairs the
                scan with at least one venue signal — POS receipt, dwell time,
                staff confirmation. Match clears the visit. No match in 72
                hours, the visit drops and nobody pays. That is the trust line.
              </p>
            </div>
            <div className="hiw-detail-visual">
              <QRMiniSVG />
            </div>
          </div>

          {/* Step 04 — Friday Payout */}
          <div
            className="hiw-detail-item reveal"
            style={{ transitionDelay: "300ms" }}
          >
            <div>
              <span className="hiw-detail-num" aria-hidden="true">
                04
              </span>
              <span className="hiw-detail-label">
                Step four · payout cleared
              </span>
              <h3 className="hiw-detail-title">
                Friday morning, Stripe sends the money.
              </h3>
              <p className="hiw-detail-body">
                Every cleared visit lands in the weekly invoice — line items
                show creator, time, scan ID, venue signal. Stripe Connect sweeps
                Friday morning. Creator gets paid. Merchant sees the receipt.
                Nothing manual, nothing approximated.
              </p>
            </div>
            <div className="hiw-detail-visual">
              <DemoCreatorContent />
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════ 04 — ATTRIBUTION DIAGRAM ═══════════════ */}
      <section className="hiw-attr-section" aria-labelledby="hiw-attr-heading">
        <div className="container">
          <div className="reveal">
            <div
              className="section-marker"
              data-num="04"
              style={{ color: "rgba(255,255,255,0.55)" }}
            >
              How attribution holds
            </div>
            <h2
              id="hiw-attr-heading"
              className="hiw-attr-headline"
              style={{ fontWeight: 900 }}
            >
              One scan,
              <span
                className="display-ghost"
                style={{ display: "block", color: "rgba(255,255,255,0.28)" }}
              >
                one receipt.
              </span>
            </h2>
            <p className="hiw-attr-sub">
              Every QR is bound to one creator and one campaign. When the door
              reads it, Push records who drove the visit, when it landed, and
              what it costs. No cookies, no pixels — physical proof on the door.
            </p>
          </div>

          <div className="reveal" style={{ transitionDelay: "100ms" }}>
            <AttributionDiagram />
          </div>

          <div
            className="hiw-attr-data-points reveal"
            style={{ transitionDelay: "200ms" }}
          >
            <div className="hiw-attr-dp">
              <span className="hiw-attr-dp-num">72h</span>
              <span className="hiw-attr-dp-label">
                Oracle window — scan to cleared visit
              </span>
            </div>
            <div className="hiw-attr-dp">
              <span className="hiw-attr-dp-num">Fri</span>
              <span className="hiw-attr-dp-label">
                Stripe Connect sweep, weekly cadence
              </span>
            </div>
            <div className="hiw-attr-dp">
              <span className="hiw-attr-dp-num">100%</span>
              <span className="hiw-attr-dp-label">
                Of payouts tied to a QR-confirmed physical visit
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════ 05 — COMPARISON ═══════════════ */}
      <section
        className="hiw-timeline-section"
        aria-labelledby="hiw-timeline-heading"
      >
        <div className="container">
          <div className="reveal">
            <div className="section-marker" data-num="05">
              The difference
            </div>
            <h2
              id="hiw-timeline-heading"
              className="hiw-timeline-headline"
              style={{ fontWeight: 900 }}
            >
              Push vs.
              <span className="display-ghost">paying for impressions.</span>
            </h2>
            <p
              style={{
                marginTop: 16,
                marginBottom: "var(--space-8)",
                maxWidth: 560,
                fontFamily: "var(--font-body)",
                fontSize: 15,
                lineHeight: 1.7,
                color: "var(--graphite)",
              }}
            >
              Most creator marketing pays for the post. Push pays after the
              door. Same screens, different unit of value.
            </p>
          </div>

          <div
            className="reveal"
            style={{ transitionDelay: "100ms", overflowX: "auto" }}
          >
            <table className="hiw-compare-table" style={{ minWidth: "540px" }}>
              <thead>
                <tr>
                  <th scope="col">What you&apos;re comparing</th>
                  <th scope="col">Impressions-based</th>
                  <th scope="col">Push</th>
                </tr>
              </thead>
              <tbody>
                {COMPARE_ROWS.map((row) => (
                  <tr key={row.feature}>
                    <td>{row.feature}</td>
                    <td>
                      <span
                        className="hiw-compare-icon--bad"
                        aria-hidden="true"
                      >
                        —{" "}
                      </span>
                      {row.traditional}
                    </td>
                    <td>
                      <span
                        className="hiw-compare-icon--good"
                        aria-hidden="true"
                      >
                        ·{" "}
                      </span>
                      {row.push}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ═══════════════ 06 — PILOT NUMBERS ═══════════════ */}
      <section
        className="hiw-metrics-section"
        aria-labelledby="hiw-metrics-heading"
      >
        <div className="container">
          <div className="reveal">
            <div className="section-marker" data-num="06">
              The pilot, in numbers
            </div>
            <h2
              id="hiw-metrics-heading"
              className="hiw-metrics-headline"
              style={{ fontWeight: 900 }}
            >
              Cohort 01,
              <span className="display-ghost">small on purpose.</span>
            </h2>
            <p
              style={{
                marginTop: 16,
                maxWidth: 560,
                fontFamily: "var(--font-body)",
                fontSize: 15,
                lineHeight: 1.7,
                color: "var(--graphite)",
              }}
            >
              Five anchor venues, ten creators, one operator (Jiaming) walking
              the doors. Numbers below are pilot-level — they get replaced with
              measured rates after June&nbsp;22.
            </p>
          </div>

          <div className="hiw-metrics-grid">
            {METRICS.map((m, i) => (
              <div
                key={m.label}
                className="hiw-metric-card reveal"
                style={{ transitionDelay: `${i * 80}ms` }}
              >
                <span
                  className={`hiw-metric-num${m.primary ? " primary" : ""}`}
                >
                  {m.num}
                </span>
                <span className="hiw-metric-label">{m.label}</span>
                <span className="hiw-metric-sub">{m.sub}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ 07 — EDGE CASES ═══════════════ */}
      <section
        className="hiw-section bg-mesh-editorial"
        aria-labelledby="hiw-edge-heading"
      >
        <div className="container">
          <div className="reveal" style={{ marginBottom: "var(--space-8)" }}>
            <div className="section-marker" data-num="07">
              Edge cases, asked plainly
            </div>
            <h2
              id="hiw-edge-heading"
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(36px, 4vw, 56px)",
                fontWeight: 900,
                letterSpacing: "-0.05em",
                lineHeight: 0.9,
                color: "var(--dark)",
              }}
            >
              When the loop
              <br />
              <span className="display-ghost">does not cooperate.</span>
            </h2>
            <p
              style={{
                marginTop: 16,
                maxWidth: 560,
                fontFamily: "var(--font-body)",
                fontSize: 15,
                lineHeight: 1.7,
                color: "var(--graphite)",
              }}
            >
              Not every visit is clean. Here is what Push does when something
              breaks — written down, not buried in T&amp;Cs.
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
              gap: "var(--space-3)",
            }}
          >
            {EDGE_CASES.map((item, i) => (
              <div
                key={item.q}
                className="card-premium reveal"
                style={{
                  padding: "var(--space-6) var(--space-5)",
                  position: "relative",
                  transitionDelay: `${i * 80}ms`,
                }}
              >
                <div
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: 11,
                    fontWeight: 700,
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    color: "var(--brand-red)",
                    marginBottom: 12,
                  }}
                >
                  {String(i + 1).padStart(2, "0")} ·{" "}
                  {
                    [
                      "the no-show",
                      "the double-claim",
                      "self-scan",
                      "the dispute",
                    ][i]
                  }
                </div>
                <h3
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "clamp(20px, 1.8vw, 24px)",
                    fontWeight: 800,
                    letterSpacing: "-0.02em",
                    lineHeight: 1.2,
                    color: "var(--dark)",
                    marginBottom: 12,
                  }}
                >
                  {item.q}
                </h3>
                <p
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: 14,
                    lineHeight: 1.7,
                    color: "var(--graphite)",
                  }}
                >
                  {item.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ 08 — DUAL CTA (ink) ═══════════════ */}
      <section className="hiw-cta-section" aria-label="Get started">
        <div className="container">
          <div className="reveal" style={{ marginBottom: "var(--space-8)" }}>
            <div
              className="section-marker"
              data-num="08"
              style={{ color: "rgba(255,255,255,0.55)" }}
            >
              Pick a chair
            </div>
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(40px, 5vw, 72px)",
                fontWeight: 900,
                letterSpacing: "-0.05em",
                lineHeight: 0.9,
                color: "#fff",
                marginBottom: "var(--space-3)",
              }}
            >
              Two ways
              <span
                className="display-ghost"
                style={{ display: "block", color: "rgba(255,255,255,0.28)" }}
              >
                onto the roster.
              </span>
            </h2>
          </div>

          <div className="hiw-cta-grid">
            <div className="hiw-cta-panel hiw-cta-panel--merchant reveal">
              <span className="hiw-cta-tag hiw-cta-tag--merchant">
                For venues
              </span>
              <h2 className="hiw-cta-headline">
                Pay
                <br />
                <span className="display-ghost" style={{ color: "#fff" }}>
                  after the door.
                </span>
              </h2>
              <p className="hiw-cta-body">
                Set a per-visit rate, pick the creators, watch the QR scans
                land. Stripe sweeps your invoice on Friday. Pilot venues: Lower
                Manhattan only.
              </p>
              <Link href="/merchant/signup" className="btn-hiw-merchant">
                Apply as a venue
              </Link>
              <p
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "11px",
                  color: "rgba(255,255,255,0.3)",
                  marginTop: "var(--space-1)",
                }}
              >
                free to apply · pilot opens June&nbsp;22
              </p>
            </div>

            <div
              className="hiw-cta-panel hiw-cta-panel--creator reveal"
              style={{ transitionDelay: "120ms" }}
            >
              <span className="hiw-cta-tag hiw-cta-tag--creator">
                For creators
              </span>
              <h2 className="hiw-cta-headline">
                Get paid
                <br />
                <span className="display-ghost" style={{ color: "#fff" }}>
                  on Friday.
                </span>
              </h2>
              <p className="hiw-cta-body">
                No follower minimum. Apply with your handle, recent posts, and
                the blocks you walk. Every application read inside 48 hours.
                Cohort 01 is ten seats.
              </p>
              <Link href="/creator/signup" className="btn-hiw-creator">
                Apply for the cohort
              </Link>
              <p
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "11px",
                  color: "rgba(255,255,255,0.3)",
                  marginTop: "var(--space-1)",
                }}
              >
                no exclusivity · keep your other deals
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
