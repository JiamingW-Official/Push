import type { Metadata } from "next";
import Link from "next/link";
import ScrollRevealInit from "@/components/layout/ScrollRevealInit";
import HowItWorksClient from "./HowItWorksClient";
import "./how-it-works.css";

export const metadata: Metadata = {
  title: "How Push Works — AI-Powered Customer Acquisition Agency",
  description:
    "How Push's AI agency works: tell the agent your customer goal, Claude matches creators in 60s, every customer is AI-verified (QR + Vision OCR + geo). Pay only for delivered customers.",
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
        Campaign active
      </div>
      <div className="demo-post-card">
        <div className="demo-post-card-title">Ramen &amp; Co.</div>
        <div className="demo-post-card-meta">
          Williamsburg, Brooklyn · Tonight
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
          <span className="demo-creator-tier">Operator · Score 94</span>
        </div>
      </div>
      <div className="demo-creator-content-block">
        <span className="demo-creator-content-label">Content published</span>
      </div>
      <div className="demo-earn-badge">
        <span>Verified earn</span>
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
        <span className="hiw-attr-node-sub">Posts content</span>
      </div>

      <span className="hiw-attr-arrow">→</span>

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
        <span className="hiw-attr-node-label">Audience</span>
        <span className="hiw-attr-node-sub">Sees campaign</span>
      </div>

      <span className="hiw-attr-arrow">→</span>

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
        <span className="hiw-attr-node-label">QR Scan</span>
        <span className="hiw-attr-node-sub">At your door</span>
      </div>

      <span className="hiw-attr-arrow">→</span>

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
        <span className="hiw-attr-node-label">Verified</span>
        <span className="hiw-attr-node-sub">Payout released</span>
      </div>
    </div>
  );
}

/* ── Timeline comparison data ────────────────────────────── */
const COMPARE_ROWS = [
  {
    feature: "Time to launch",
    traditional: "2–6 weeks",
    push: "Under 24 hours",
  },
  {
    feature: "Attribution",
    traditional: "Estimated, opaque",
    push: "QR-verified, per visit",
  },
  {
    feature: "Payment model",
    traditional: "Pay upfront, hope for results",
    push: "Pay only on verified visits",
  },
  {
    feature: "Creator requirements",
    traditional: "10K+ followers minimum",
    push: "Zero followers needed",
  },
  {
    feature: "Monthly cost",
    traditional: "$500–$3,000+ retainer",
    push: "$0 Pilot → $500/mo min + $40/customer",
  },
  {
    feature: "Payout speed",
    traditional: "30–90 day delays",
    push: "Weekly, automated",
  },
  {
    feature: "Local targeting",
    traditional: "ZIP-level estimates",
    push: "2-mile radius, GPS-matched",
  },
];

/* ── Success metrics ─────────────────────────────────────── */
const METRICS = [
  {
    num: "87%",
    label: "Creator match rate",
    sub: "Within 2 miles of your business",
    primary: true,
  },
  {
    num: "24h",
    label: "Campaign launch time",
    sub: "From signup to first creator matched",
    primary: false,
  },
  {
    num: "3.2×",
    label: "Average ROI",
    sub: "vs. traditional local advertising spend",
    primary: false,
  },
  {
    num: "$4",
    label: "Average cost per verified visit",
    sub: "Traditional ads: $15–$50 per click, no visit guarantee",
    primary: false,
  },
  {
    num: "0",
    label: "Follower minimum",
    sub: "Performance score is the only metric that matters",
    primary: false,
  },
  {
    num: "6",
    label: "Creator tiers",
    sub: "Seed → Explorer → Operator → Proven → Closer → Partner",
    primary: false,
  },
];

/* ── Page ────────────────────────────────────────────────── */
export default function HowItWorksPage() {
  return (
    <>
      <ScrollRevealInit />
      <HowItWorksClient />

      {/* ── Hero ──────────────────────────────────────────── */}
      <section
        className="hiw-hero"
        id="main-content"
        aria-labelledby="hiw-hero-heading"
      >
        <div className="container hiw-hero-inner">
          <p className="hiw-eyebrow">HOW PUSH WORKS · DUAL-ROLE EXPLAINER</p>

          <h1 id="hiw-hero-heading" className="hiw-hero-headline reveal">
            <span className="line-black">How Push</span>
            <span className="line-light">works.</span>
          </h1>

          {/* Hero role tabs — interactivity in client component */}
          <div
            className="hiw-tabs"
            role="tablist"
            aria-label="Select your role"
            data-tab-group="hero"
          >
            <button
              className="hiw-tab active"
              role="tab"
              aria-selected="true"
              data-tab="merchant"
              data-tab-group="hero"
            >
              I&apos;m a Merchant
            </button>
            <button
              className="hiw-tab"
              role="tab"
              aria-selected="false"
              data-tab="creator"
              data-tab-group="hero"
            >
              I&apos;m a Creator
            </button>
          </div>

          <p className="hiw-hero-sub reveal" data-hero-content="merchant">
            Tell the agent how many customers you need. Claude matches creators
            in 60 seconds, drafts briefs, runs the campaign. Every customer is
            AI-verified through QR scan, receipt OCR, and geo-match. Pay only
            for who walks through your door.
          </p>
          <p
            className="hiw-hero-sub reveal"
            data-hero-content="creator"
            style={{ display: "none" }}
          >
            Join the operator network. The agent schedules you on campaigns that
            match your category and ZIP. Your performance score earns priority
            routing — followers don&apos;t. Weekly payouts per verified
            customer.
          </p>
        </div>
      </section>

      {/* ── 3-Step Process ────────────────────────────────── */}
      <section
        className="hiw-section hiw-section-bright"
        aria-labelledby="hiw-steps-heading"
      >
        <div className="container">
          <div className="reveal">
            <div className="hiw-section-tag">
              <span className="hiw-section-num">01</span>
              <span className="hiw-section-line" />
              <span className="hiw-section-label">The Process</span>
            </div>
            <h2 id="hiw-steps-heading" className="hiw-steps-headline">
              Three steps.
              <br />
              <span style={{ fontWeight: 200, opacity: 0.4 }}>
                Zero guesswork.
              </span>
            </h2>
            <p className="hiw-steps-sub">
              See how Push works from each side of the platform.
            </p>
          </div>

          {/* Role tabs (light section) */}
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
              className="hiw-steps-grid reveal"
              style={{ transitionDelay: "100ms" }}
            >
              <div className="hiw-step-card">
                <div className="hiw-step-num">01</div>
                <span className="hiw-step-label">Goal</span>
                <h3 className="hiw-step-title">Tell the agent your goal</h3>
                <p className="hiw-step-body">
                  Input: &ldquo;20 new customers this month, $400 budget,
                  coffee, Williamsburg.&rdquo; The agent parses objective,
                  budget, category, and ZIP in 60 seconds. No brief writing, no
                  RFP.
                </p>
                <div className="hiw-step-demo">
                  <DemoPostCampaign />
                </div>
              </div>

              <div className="hiw-step-card">
                <div className="hiw-step-num">02</div>
                <span className="hiw-step-label">Match</span>
                <h3 className="hiw-step-title">AI matches in 60 seconds</h3>
                <p className="hiw-step-body">
                  Claude ranks the top 5 creators by category fit, geo
                  proximity, and verified conversion history. Drafts briefs.
                  Predicts ROI. You approve — or let the agent auto-run.
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
                          Score 94 · Operator · 0.4mi away
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
                          Score 88 · Proven · 0.8mi away
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
                <span className="hiw-step-label">Deliver or free</span>
                <h3 className="hiw-step-title">Triple-checked by AI</h3>
                <p className="hiw-step-body">
                  Every scan runs through Claude Vision (receipt OCR), QR check,
                  and geo-match in under 8 seconds. If all three pass,
                  you&apos;re billed $40. If the AI can&apos;t deliver, you
                  don&apos;t pay.
                </p>
                <div className="hiw-step-demo">
                  <QRMiniSVG />
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
                <span className="hiw-step-label">Discover</span>
                <h3 className="hiw-step-title">Browse local campaigns</h3>
                <p className="hiw-step-body">
                  See campaigns within 2 miles of you — restaurants, gyms,
                  retail. Filtered by your tier eligibility and earning
                  potential.
                </p>
                <div className="hiw-step-demo">
                  <DemoPostCampaign />
                </div>
              </div>

              <div className="hiw-step-card">
                <div className="hiw-step-num">02</div>
                <span className="hiw-step-label">Apply</span>
                <h3 className="hiw-step-title">Get accepted by score</h3>
                <p className="hiw-step-body">
                  Your performance score — not your follower count — determines
                  which campaigns you access. Apply and get matched within
                  hours.
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
                      Your profile
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
                        Performance score
                      </span>
                      <span
                        style={{
                          fontWeight: 700,
                          color: "var(--dark)",
                          fontSize: "12px",
                        }}
                      >
                        94
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
                        Current tier
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
                        Eligible campaigns
                      </span>
                      <span
                        style={{
                          fontWeight: 700,
                          color: "var(--primary)",
                          fontSize: "12px",
                        }}
                      >
                        12 nearby
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="hiw-step-card">
                <div className="hiw-step-num">03</div>
                <span className="hiw-step-label">Post content</span>
                <h3 className="hiw-step-title">Visit. Create. Publish.</h3>
                <p className="hiw-step-body">
                  Experience the business authentically. Post content to your
                  audience with your unique campaign link. No brand guidelines
                  to follow — just your voice.
                </p>
                <div className="hiw-step-demo">
                  <DemoCreatorContent />
                </div>
              </div>

              <div className="hiw-step-card">
                <div className="hiw-step-num">04</div>
                <span className="hiw-step-label">Earn</span>
                <h3 className="hiw-step-title">Get paid per visit</h3>
                <p className="hiw-step-body">
                  When your audience scans the QR at the door, your earnings are
                  logged. Weekly payout, no invoicing, no 30-day waits.
                </p>
                <div className="hiw-step-demo">
                  <QRMiniSVG />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Detailed Explainer (numbered editorial) ───────── */}
      <section
        className="hiw-detail-section"
        aria-labelledby="hiw-detail-heading"
      >
        <div className="container">
          <div className="reveal" style={{ marginBottom: "var(--space-10)" }}>
            <div className="hiw-section-tag">
              <span className="hiw-section-num">02</span>
              <span className="hiw-section-line" />
              <span className="hiw-section-label">Step by Step</span>
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
              Inside
              <br />
              <span style={{ fontWeight: 200, opacity: 0.4 }}>every step.</span>
            </h2>
          </div>

          {/* Step 01 */}
          <div className="hiw-detail-item reveal">
            <div>
              <span className="hiw-detail-num" aria-hidden="true">
                01
              </span>
              <span className="hiw-detail-label">Campaign Launch</span>
              <h3 className="hiw-detail-title">A merchant posts a campaign.</h3>
              <p className="hiw-detail-body">
                A business sets a per-visit payout, target neighborhood, and
                campaign duration. Push surfaces the campaign to eligible
                creators scored on proximity to the location, tier level, and
                verified conversion history from previous campaigns. No manual
                outreach. No agency brief. Live in under 24 hours.
              </p>
            </div>
            <div className="hiw-detail-visual">
              <DemoPostCampaign />
            </div>
          </div>

          {/* Step 02 */}
          <div
            className="hiw-detail-item reveal"
            style={{ transitionDelay: "100ms" }}
          >
            <div>
              <span className="hiw-detail-num" aria-hidden="true">
                02
              </span>
              <span className="hiw-detail-label">Creator Matching</span>
              <h3 className="hiw-detail-title">
                Push matches the right creator.
              </h3>
              <p className="hiw-detail-body">
                87% of creators are matched within 2 miles of the business.
                Performance score — verified visits, content quality,
                consistency — determines ranking, not follower count. A
                micro-creator with 800 followers who drives 30 verified visits
                outranks one with 50K followers who drives zero. The platform
                assigns a unique QR code to each creator–campaign pair for
                precise attribution.
              </p>
            </div>
            <div className="hiw-detail-visual">
              <DemoCreatorContent />
            </div>
          </div>

          {/* Step 03 */}
          <div
            className="hiw-detail-item reveal"
            style={{ transitionDelay: "200ms" }}
          >
            <div>
              <span className="hiw-detail-num" aria-hidden="true">
                03
              </span>
              <span className="hiw-detail-label">QR Verification</span>
              <h3 className="hiw-detail-title">
                Every visit is verified at the door.
              </h3>
              <p className="hiw-detail-body">
                Customers who see the creator&apos;s post show up and scan the
                QR code at the point of entry. Push logs the timestamp,
                location, and creator attribution in real time. No scan, no
                charge — the merchant pays only for physically confirmed foot
                traffic. Payouts release automatically after each verified
                batch. Weekly for creators. Instantaneous attribution for
                merchants.
              </p>
            </div>
            <div className="hiw-detail-visual">
              <QRMiniSVG />
            </div>
          </div>
        </div>
      </section>

      {/* ── Attribution Explainer ─────────────────────────── */}
      <section className="hiw-attr-section" aria-labelledby="hiw-attr-heading">
        <div className="container">
          <div className="reveal">
            <div className="hiw-section-tag">
              <span
                className="hiw-section-num"
                style={{ color: "var(--primary)" }}
              >
                03
              </span>
              <span
                className="hiw-section-line"
                style={{ background: "rgba(255,255,255,0.15)" }}
              />
              <span
                className="hiw-section-label"
                style={{ color: "rgba(255,255,255,0.35)" }}
              >
                QR Attribution
              </span>
            </div>
            <h2 id="hiw-attr-heading" className="hiw-attr-headline">
              How attribution
              <span className="line-light">actually works.</span>
            </h2>
            <p className="hiw-attr-sub">
              Every QR code is unique to a creator–campaign pair. When a
              customer scans it, Push records who drove them, when they arrived,
              and how much is owed. No cookies. No pixels. Physical proof of
              visit.
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
              <span className="hiw-attr-dp-num">$4–12</span>
              <span className="hiw-attr-dp-label">
                Avg cost per verified visit via Push
              </span>
            </div>
            <div className="hiw-attr-dp">
              <span className="hiw-attr-dp-num">$15–50</span>
              <span className="hiw-attr-dp-label">
                Traditional ad cost per click — with no visit guarantee
              </span>
            </div>
            <div className="hiw-attr-dp">
              <span className="hiw-attr-dp-num">100%</span>
              <span className="hiw-attr-dp-label">
                Of payouts tied to QR-confirmed physical visits
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Timeline Comparison ───────────────────────────── */}
      <section
        className="hiw-timeline-section"
        aria-labelledby="hiw-timeline-heading"
      >
        <div className="container">
          <div className="reveal">
            <div className="hiw-section-tag">
              <span className="hiw-section-num">04</span>
              <span className="hiw-section-line" />
              <span className="hiw-section-label">Comparison</span>
            </div>
            <h2 id="hiw-timeline-heading" className="hiw-timeline-headline">
              Push vs. traditional
              <span className="line-light">marketing.</span>
            </h2>
          </div>

          <div
            className="reveal"
            style={{ transitionDelay: "100ms", overflowX: "auto" }}
          >
            <table className="hiw-compare-table" style={{ minWidth: "540px" }}>
              <thead>
                <tr>
                  <th scope="col">What you&apos;re comparing</th>
                  <th scope="col">Traditional Marketing</th>
                  <th scope="col">Push</th>
                </tr>
              </thead>
              <tbody>
                {COMPARE_ROWS.map((row) => (
                  <tr key={row.feature}>
                    <td>{row.feature}</td>
                    <td>
                      <span className="hiw-compare-icon--bad">✗ </span>
                      {row.traditional}
                    </td>
                    <td>
                      <span className="hiw-compare-icon--good">✓ </span>
                      {row.push}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── Success Metrics ───────────────────────────────── */}
      <section
        className="hiw-metrics-section"
        aria-labelledby="hiw-metrics-heading"
      >
        <div className="container">
          <div className="reveal">
            <div className="hiw-section-tag">
              <span className="hiw-section-num">05</span>
              <span className="hiw-section-line" />
              <span className="hiw-section-label">By the Numbers</span>
            </div>
            <h2 id="hiw-metrics-heading" className="hiw-metrics-headline">
              Results
              <span className="line-light">that speak.</span>
            </h2>
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

      {/* ── Dual CTA ──────────────────────────────────────── */}
      <section className="hiw-cta-section" aria-label="Get started">
        <div className="container">
          <div className="hiw-cta-grid">
            <div className="hiw-cta-panel hiw-cta-panel--merchant reveal">
              <span className="hiw-cta-tag hiw-cta-tag--merchant">
                For Merchants
              </span>
              <h2 className="hiw-cta-headline">
                Pay only for
                <br />
                <span
                  style={{ fontWeight: 200, color: "rgba(255,255,255,0.35)" }}
                >
                  results.
                </span>
              </h2>
              <p className="hiw-cta-body">
                Tell the agent your goal. Claude matches creators in 60s. Pay
                only for AI-verified customers who walk through your door. $0
                Pilot for first 10 merchants — cancel anytime.
              </p>
              <Link href="/merchant/pilot" className="btn-hiw-merchant">
                Apply for $0 Pilot
              </Link>
              <p
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "11px",
                  color: "rgba(255,255,255,0.3)",
                  marginTop: "var(--space-1)",
                }}
              >
                No credit card required · Campaign live in 24 hours
              </p>
            </div>

            <div
              className="hiw-cta-panel hiw-cta-panel--creator reveal"
              style={{ transitionDelay: "120ms" }}
            >
              <span className="hiw-cta-tag hiw-cta-tag--creator">
                For Creators
              </span>
              <h2 className="hiw-cta-headline">
                Earn on
                <br />
                <span
                  style={{ fontWeight: 200, color: "rgba(255,255,255,0.35)" }}
                >
                  your terms.
                </span>
              </h2>
              <p className="hiw-cta-body">
                Zero follower minimum. Browse campaigns in your neighborhood.
                Visit, post, and earn when your audience shows up. Weekly
                payouts, no invoicing.
              </p>
              <Link href="/creator/signup" className="btn-hiw-creator">
                Apply as Creator — Free
              </Link>
              <p
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "11px",
                  color: "rgba(255,255,255,0.3)",
                  marginTop: "var(--space-1)",
                }}
              >
                30-second signup · No credit card
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
