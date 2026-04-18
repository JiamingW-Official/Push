import type { Metadata } from "next";
import Link from "next/link";
import DisclosureReveal from "./DisclosureReveal";
import "./disclosure.css";

export const metadata: Metadata = {
  title: "DisclosureBot — FTC 16 CFR Part 255, pre-screened | Push",
  description:
    "Platform-level AI pre-screen for every creator post. FTC 16 CFR Part 255 compliance enforced at publish time, not self-reported. $1M E&O insurance, quarterly external audit.",
  robots: { index: true, follow: true },
};

/* ─── Inline SVG icons ──────────────────────────────────────── */
type IconProps = { className?: string };

function IconShield({ className }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

function IconBlock({ className }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="m4.93 4.93 14.14 14.14" />
    </svg>
  );
}

function IconCheck({ className }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function IconArrowRight({ className }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  );
}

/* ─── Architecture SVG diagram ──────────────────────────────── */
function DisclosureArchitectureDiagram() {
  return (
    <div
      className="dis-diagram"
      aria-label="DisclosureBot architecture: creator draft enters AI pre-screen, branches into five verdict states"
    >
      <svg
        viewBox="0 0 980 420"
        width="100%"
        height="auto"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
      >
        <defs>
          <pattern
            id="dis-grid"
            width="40"
            height="40"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 40 0 L 0 0 0 40"
              fill="none"
              stroke="rgba(255,255,255,0.04)"
              strokeWidth="1"
            />
          </pattern>
        </defs>
        <rect width="980" height="420" fill="#003049" />
        <rect width="980" height="420" fill="url(#dis-grid)" />

        {/* Creator draft */}
        <rect
          x="20"
          y="175"
          width="150"
          height="70"
          fill="rgba(255,255,255,0.04)"
          stroke="rgba(102,155,188,0.6)"
          strokeWidth="1.25"
        />
        <text
          x="95"
          y="200"
          textAnchor="middle"
          fill="rgba(102,155,188,0.9)"
          fontSize="10"
          fontFamily="monospace"
          fontWeight="700"
          letterSpacing="0.1em"
        >
          CREATOR DRAFT
        </text>
        <text
          x="95"
          y="218"
          textAnchor="middle"
          fill="rgba(255,255,255,0.55)"
          fontSize="10"
          fontFamily="monospace"
        >
          CreatorGPT workspace
        </text>
        <text
          x="95"
          y="232"
          textAnchor="middle"
          fill="rgba(255,255,255,0.4)"
          fontSize="9"
          fontFamily="monospace"
        >
          Pre-publish only
        </text>

        {/* Arrow draft → bot */}
        <line
          x1="172"
          y1="210"
          x2="240"
          y2="210"
          stroke="rgba(193,18,31,0.65)"
          strokeWidth="1.5"
        />
        <polygon points="239,206 247,210 239,214" fill="rgba(193,18,31,0.65)" />

        {/* DisclosureBot gate */}
        <rect
          x="248"
          y="135"
          width="220"
          height="150"
          fill="rgba(255,255,255,0.06)"
          stroke="rgba(201,169,110,0.55)"
          strokeWidth="1.5"
        />
        <text
          x="358"
          y="162"
          textAnchor="middle"
          fill="rgba(201,169,110,0.95)"
          fontSize="11"
          fontFamily="monospace"
          fontWeight="700"
          letterSpacing="0.12em"
        >
          DISCLOSUREBOT
        </text>
        <text
          x="358"
          y="180"
          textAnchor="middle"
          fill="rgba(255,255,255,0.55)"
          fontSize="10"
          fontFamily="monospace"
        >
          Claude Sonnet 4.6
        </text>
        <text
          x="358"
          y="198"
          textAnchor="middle"
          fill="rgba(255,255,255,0.55)"
          fontSize="10"
          fontFamily="monospace"
        >
          FTC 16 CFR Part 255
        </text>
        <line
          x1="268"
          y1="214"
          x2="448"
          y2="214"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth="1"
        />
        <text
          x="358"
          y="234"
          textAnchor="middle"
          fill="rgba(255,255,255,0.5)"
          fontSize="9"
          fontFamily="monospace"
        >
          Material connection
        </text>
        <text
          x="358"
          y="248"
          textAnchor="middle"
          fill="rgba(255,255,255,0.5)"
          fontSize="9"
          fontFamily="monospace"
        >
          Required hashtags
        </text>
        <text
          x="358"
          y="262"
          textAnchor="middle"
          fill="rgba(255,255,255,0.5)"
          fontSize="9"
          fontFamily="monospace"
        >
          Platform rules · IG / TT / YT
        </text>

        {/* Arrow bot → fork */}
        <line
          x1="470"
          y1="210"
          x2="540"
          y2="210"
          stroke="rgba(255,255,255,0.25)"
          strokeWidth="1.5"
        />
        <polygon
          points="539,206 547,210 539,214"
          fill="rgba(255,255,255,0.25)"
        />

        {/* Five verdict branches */}
        {/* 1. auto_pass — emerald */}
        <line
          x1="548"
          y1="210"
          x2="770"
          y2="60"
          stroke="rgba(16,185,129,0.5)"
          strokeWidth="1.25"
          strokeDasharray="3,3"
        />
        <rect
          x="770"
          y="42"
          width="190"
          height="42"
          fill="rgba(16,185,129,0.12)"
          stroke="rgba(16,185,129,0.6)"
          strokeWidth="1"
        />
        <text
          x="865"
          y="60"
          textAnchor="middle"
          fill="rgba(16,185,129,0.95)"
          fontSize="10"
          fontFamily="monospace"
          fontWeight="700"
          letterSpacing="0.1em"
        >
          AUTO_PASS
        </text>
        <text
          x="865"
          y="75"
          textAnchor="middle"
          fill="rgba(255,255,255,0.55)"
          fontSize="9"
          fontFamily="monospace"
        >
          82% of drafts · publish immediately
        </text>

        {/* 2. auto_block — flag red */}
        <line
          x1="548"
          y1="210"
          x2="770"
          y2="125"
          stroke="rgba(193,18,31,0.55)"
          strokeWidth="1.25"
          strokeDasharray="3,3"
        />
        <rect
          x="770"
          y="107"
          width="190"
          height="42"
          fill="rgba(193,18,31,0.12)"
          stroke="rgba(193,18,31,0.6)"
          strokeWidth="1"
        />
        <text
          x="865"
          y="125"
          textAnchor="middle"
          fill="rgba(193,18,31,0.95)"
          fontSize="10"
          fontFamily="monospace"
          fontWeight="700"
          letterSpacing="0.1em"
        >
          AUTO_BLOCK
        </text>
        <text
          x="865"
          y="140"
          textAnchor="middle"
          fill="rgba(255,255,255,0.55)"
          fontSize="9"
          fontFamily="monospace"
        >
          4% · hard-fail · revision required
        </text>

        {/* 3. manual_review — champagne */}
        <line
          x1="548"
          y1="210"
          x2="770"
          y2="199"
          stroke="rgba(201,169,110,0.6)"
          strokeWidth="1.25"
        />
        <rect
          x="770"
          y="180"
          width="190"
          height="42"
          fill="rgba(201,169,110,0.14)"
          stroke="rgba(201,169,110,0.7)"
          strokeWidth="1"
        />
        <text
          x="865"
          y="198"
          textAnchor="middle"
          fill="rgba(201,169,110,0.95)"
          fontSize="10"
          fontFamily="monospace"
          fontWeight="700"
          letterSpacing="0.1em"
        >
          MANUAL_REVIEW
        </text>
        <text
          x="865"
          y="213"
          textAnchor="middle"
          fill="rgba(255,255,255,0.55)"
          fontSize="9"
          fontFamily="monospace"
        >
          14% · queue to human reviewer
        </text>

        {/* 4. human_approved — emerald darker */}
        <line
          x1="548"
          y1="210"
          x2="770"
          y2="275"
          stroke="rgba(16,185,129,0.55)"
          strokeWidth="1.25"
          strokeDasharray="3,3"
        />
        <rect
          x="770"
          y="253"
          width="190"
          height="42"
          fill="rgba(16,185,129,0.18)"
          stroke="rgba(16,185,129,0.7)"
          strokeWidth="1"
        />
        <text
          x="865"
          y="271"
          textAnchor="middle"
          fill="rgba(16,185,129,1)"
          fontSize="10"
          fontFamily="monospace"
          fontWeight="700"
          letterSpacing="0.1em"
        >
          HUMAN_APPROVED
        </text>
        <text
          x="865"
          y="286"
          textAnchor="middle"
          fill="rgba(255,255,255,0.55)"
          fontSize="9"
          fontFamily="monospace"
        >
          Ops reviewer override · audit logged
        </text>

        {/* 5. human_rejected — flag red darker */}
        <line
          x1="548"
          y1="210"
          x2="770"
          y2="345"
          stroke="rgba(193,18,31,0.6)"
          strokeWidth="1.25"
          strokeDasharray="3,3"
        />
        <rect
          x="770"
          y="325"
          width="190"
          height="42"
          fill="rgba(193,18,31,0.2)"
          stroke="rgba(193,18,31,0.75)"
          strokeWidth="1"
        />
        <text
          x="865"
          y="343"
          textAnchor="middle"
          fill="rgba(193,18,31,1)"
          fontSize="10"
          fontFamily="monospace"
          fontWeight="700"
          letterSpacing="0.1em"
        >
          HUMAN_REJECTED
        </text>
        <text
          x="865"
          y="358"
          textAnchor="middle"
          fill="rgba(255,255,255,0.55)"
          fontSize="9"
          fontFamily="monospace"
        >
          Counsel escalation · creator ToS hit
        </text>

        {/* Audit log rail */}
        <rect
          x="20"
          y="350"
          width="750"
          height="50"
          fill="rgba(255,255,255,0.03)"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth="1"
          strokeDasharray="4,3"
        />
        <text
          x="395"
          y="370"
          textAnchor="middle"
          fill="rgba(201,169,110,0.8)"
          fontSize="10"
          fontFamily="monospace"
          fontWeight="700"
          letterSpacing="0.1em"
        >
          IMMUTABLE AUDIT LOG — Supabase disclosure_audits table
        </text>
        <text
          x="395"
          y="386"
          textAnchor="middle"
          fill="rgba(255,255,255,0.4)"
          fontSize="9"
          fontFamily="monospace"
        >
          Every verdict · cryptographic timestamp · exportable for FTC inquiry
        </text>

        {/* Legend */}
        <line
          x1="20"
          y1="410"
          x2="40"
          y2="410"
          stroke="rgba(255,255,255,0.3)"
          strokeWidth="1.5"
          strokeDasharray="3,3"
        />
        <text
          x="48"
          y="414"
          fill="rgba(255,255,255,0.45)"
          fontSize="8"
          fontFamily="monospace"
        >
          Automated route
        </text>
        <line
          x1="180"
          y1="410"
          x2="200"
          y2="410"
          stroke="rgba(201,169,110,0.7)"
          strokeWidth="1.5"
        />
        <text
          x="208"
          y="414"
          fill="rgba(255,255,255,0.45)"
          fontSize="8"
          fontFamily="monospace"
        >
          Human review required
        </text>
      </svg>
    </div>
  );
}

/* ─── Data ──────────────────────────────────────────────────── */
const PASS_RATE_STATS = [
  {
    pct: "82%",
    label: "Auto-pass",
    body: "Draft satisfies FTC 16 CFR Part 255 + platform-specific rules in one shot. Publishes immediately.",
    verdict: "auto_pass" as const,
  },
  {
    pct: "4%",
    label: "Auto-block",
    body: "Hard-fail — missing disclosure, prohibited claim, or banned surface. Revision required before re-submit.",
    verdict: "auto_block" as const,
  },
  {
    pct: "14%",
    label: "Manual review",
    body: "Ambiguous material connection or borderline claim. Queued to an Ops reviewer with 4-hour SLA.",
    verdict: "manual_review" as const,
  },
];

const CHECKLIST = [
  {
    title: "Material connection disclosed",
    body: "Every sponsored post must disclose the creator's relationship with the merchant in plain language — paid, gifted, affiliate, or equity. Anything else is an FTC violation per §255.5.",
  },
  {
    title: "Required hashtags",
    body: "#ad, #sponsored, or #paidpartnership — placed in the first three lines of the caption. Buried disclosure in hashtag walls (position >6) auto-fails.",
  },
  {
    title: "Platform-specific rules",
    body: "Instagram requires the Paid Partnership label in addition to caption disclosure. TikTok requires the Branded Content toggle. YouTube requires the Paid Promotion checkbox. DisclosureBot enforces all three.",
  },
  {
    title: "Prohibited claims",
    body: "Health, medical, or financial-outcome claims are blocked by default. Weight-loss claims, crypto yield promises, and unsubstantiated efficacy statements are auto-flagged for counsel review.",
  },
  {
    title: "Endorsement guidelines",
    body: "Creator must have actually used the product or service. DisclosureBot cross-references campaign type (seeding / explorer / operator / retainer) against disclosure language.",
  },
  {
    title: "Platform age gating",
    body: "Age-restricted products (alcohol, sports-betting, CBD) require platform age-gating. Campaigns against non-gated audiences auto-fail.",
  },
];

const AUDIT_ROWS = [
  {
    timestamp: "2026-04-17 14:22",
    creator: "@mayaeats",
    campaign: "Blue Bottle · Williamsburg",
    platform: "IG",
    verdict: "auto_pass" as const,
    confidence: "0.97",
    reviewer: "DisclosureBot",
  },
  {
    timestamp: "2026-04-17 13:48",
    creator: "@danielbk",
    campaign: "Stumptown · East Village",
    platform: "TikTok",
    verdict: "manual_review" as const,
    confidence: "0.64",
    reviewer: "Kai (Ops)",
  },
  {
    timestamp: "2026-04-17 13:15",
    creator: "@priyanyc",
    campaign: "Partners Coffee · Greenpoint",
    platform: "IG",
    verdict: "auto_pass" as const,
    confidence: "0.94",
    reviewer: "DisclosureBot",
  },
  {
    timestamp: "2026-04-17 12:51",
    creator: "@marcoT",
    campaign: "Devoción · Williamsburg",
    platform: "YT",
    verdict: "auto_block" as const,
    confidence: "0.88",
    reviewer: "DisclosureBot",
  },
  {
    timestamp: "2026-04-17 12:08",
    creator: "@sarahwnyc",
    campaign: "Joe Coffee · Harlem",
    platform: "IG",
    verdict: "human_approved" as const,
    confidence: "0.71",
    reviewer: "Jordan (Ops)",
  },
  {
    timestamp: "2026-04-17 11:22",
    creator: "@jamesO_nyc",
    campaign: "Ghost Donkey · East Village (age-gated)",
    platform: "IG",
    verdict: "human_rejected" as const,
    confidence: "0.58",
    reviewer: "Jordan (Ops)",
  },
];

const VERDICT_LABELS: Record<(typeof AUDIT_ROWS)[number]["verdict"], string> = {
  auto_pass: "AUTO_PASS",
  auto_block: "AUTO_BLOCK",
  manual_review: "MANUAL_REVIEW",
  human_approved: "HUMAN_APPROVED",
  human_rejected: "HUMAN_REJECTED",
};

const FLOW_STEPS = [
  {
    num: "01",
    label: "Draft",
    title: "Creator drafts in CreatorGPT",
    body: "Every sponsored post begins inside CreatorGPT — Push's in-platform drafting environment. Nothing leaves the workspace without entering the DisclosureBot pipeline.",
  },
  {
    num: "02",
    label: "Pre-screen",
    title: "DisclosureBot screens before publish",
    body: "Missing #ad, #sponsored, or #paidpartnership? Blocked with revision prompt. Disclosure too low in caption? Warned with reposition suggestion. Multi-platform adaptation (IG / TikTok / YouTube conventions differ)? Auto-rewritten per channel. Pass → approve and timestamp the audit log.",
  },
  {
    num: "03",
    label: "Publish",
    title: "Post publishes — or doesn't",
    body: 'If the post fails pre-screen, it does not publish. Full stop. There is no bypass flag, no "override" button, no escalation to a human who can wave it through. The gate is architectural.',
  },
  {
    num: "04",
    label: "Audit trail",
    title: "Immutable Supabase audit log",
    body: "Every decision — pass, block, warn, revision — is written to the disclosure_audits table with cryptographic timestamp. Exportable at any time for FTC inquiry, legal review, or merchant procurement diligence.",
  },
];

const AUDIT_CADENCE = [
  {
    cadence: "Weekly",
    activity: "AI compliance re-check on 10% random sample",
    owner: "Pipeline",
  },
  {
    cadence: "Monthly",
    activity: "Ops + founder review all flagged / borderline cases",
    owner: "Ops",
  },
  {
    cadence: "Quarterly",
    activity: "External legal 1% full human audit + file trail export",
    owner: "Ellison Rowe LLP",
  },
  {
    cadence: "Annually",
    activity: "3rd-party compliance audit + public transparency report",
    owner: "Ellison Rowe LLP",
  },
];

const INSURANCE_ITEMS = [
  {
    title: "$1M E&O insurance",
    body: "Errors & omissions policy underwritten by Allianz Global Corporate & Specialty. Broker: Woodruff Sawyer NYC. Effective October 2025. Covers platform-level compliance failure and creator-originated disclosure violations.",
  },
  {
    title: "$25K legal reserve",
    body: "Dedicated reserve on the Year-1 balance sheet, ring-fenced for regulatory response. Not commingled with operating capital.",
  },
  {
    title: "Merchant indemnification — $10K per incident",
    body: "If an FTC action targets a merchant for a Push-originated post, we indemnify up to $10K per incident: $5K insurance + $5K Push cap. Contractual, not discretionary.",
  },
  {
    title: "FTC response SLA",
    body: "48-hour full audit trail delivery. 72 hours to external counsel engagement. 90-day public transparency report if the matter is material. Written in the merchant MSA.",
  },
];

/* ─── Page component ───────────────────────────────────────── */
export default function DisclosurePage() {
  return (
    <div className="dis-page">
      <DisclosureReveal />

      {/* ── 1. Hero ────────────────────────────────────────── */}
      <section className="dis-hero" aria-labelledby="dis-hero-heading">
        <div className="dis-container">
          <div className="dis-hero-inner">
            <span className="dis-hero-eyebrow dis-reveal">
              Trust &middot; Compliance &middot; DisclosureBot
            </span>
            <h1
              id="dis-hero-heading"
              className="dis-hero-headline dis-reveal"
              data-delay="1"
            >
              DisclosureBot.
              <br />
              <em>FTC 16 CFR Part 255, pre-screened.</em>
            </h1>
            <p className="dis-hero-sub dis-reveal" data-delay="2">
              Every creator post on Push is AI pre-screened for FTC 16 CFR Part
              255 <span className="dis-mono">#ad</span> disclosure before it
              publishes. Non-compliant posts are blocked, not flagged. The only
              Customer Acquisition Engine for local Coffee+ merchants where
              disclosure is architectural, not self-reported.
            </p>
            <div className="dis-hero-meta dis-reveal" data-delay="3">
              <span>Vertical AI for Local Commerce</span>
              <span className="dis-hero-dot" aria-hidden="true">
                &bull;
              </span>
              <span>ConversionOracle + DisclosureBot</span>
              <span className="dis-hero-dot" aria-hidden="true">
                &bull;
              </span>
              <span>Claude Sonnet 4.6</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. Live pass-rate stats ────────────────────────── */}
      <section className="dis-stats" aria-labelledby="dis-stats-heading">
        <div className="dis-container">
          <div className="dis-section-head dis-reveal">
            <span className="dis-section-num">&sect; 01</span>
            <span className="dis-eyebrow">Live verdict mix · last 30 days</span>
            <h2 id="dis-stats-heading" className="dis-section-title">
              Three outcomes. One gate. No bypass.
            </h2>
            <p className="dis-section-sub">
              Every draft lands in one of five verdict states (
              <span className="dis-mono">auto_pass</span> /
              <span className="dis-mono"> auto_block</span> /
              <span className="dis-mono"> manual_review</span> /
              <span className="dis-mono"> human_approved</span> /
              <span className="dis-mono"> human_rejected</span>). 82% are
              machine-passed in under 8 seconds. The rest go to humans.
            </p>
          </div>

          <div className="dis-stats-grid">
            {PASS_RATE_STATS.map((stat, i) => (
              <article
                key={stat.label}
                className={`dis-stat dis-stat--${stat.verdict} dis-reveal`}
                data-delay={String(i + 1)}
              >
                <div className="dis-stat-pct">{stat.pct}</div>
                <div className="dis-stat-label">{stat.label}</div>
                <p className="dis-stat-body">{stat.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── 3. Architecture diagram ────────────────────────── */}
      <section
        className="dis-architecture"
        aria-labelledby="dis-architecture-heading"
      >
        <div className="dis-container">
          <div className="dis-section-head dis-reveal">
            <span className="dis-section-num">&sect; 02</span>
            <span className="dis-eyebrow dis-eyebrow--light">
              DisclosureBot architecture
            </span>
            <h2
              id="dis-architecture-heading"
              className="dis-section-title dis-section-title--light"
            >
              Creator draft → AI pre-screen → five verdict branches.
            </h2>
            <p className="dis-section-sub dis-section-sub--light">
              DisclosureBot sits between CreatorGPT and every publish endpoint.
              A draft satisfies FTC 16 CFR Part 255 at the API layer, or it
              never goes out. Every decision is written to an immutable audit
              log — exportable on demand for FTC inquiry.
            </p>
          </div>

          <div className="dis-reveal" data-delay="1">
            <DisclosureArchitectureDiagram />
          </div>

          <div className="dis-flow">
            {FLOW_STEPS.map((step, i) => (
              <article
                key={step.num}
                className="dis-flow-step dis-reveal"
                data-delay={String((i % 4) + 1)}
              >
                <div className="dis-flow-step-head">
                  <span className="dis-flow-num">{step.num}</span>
                  <span className="dis-flow-label">{step.label}</span>
                </div>
                <h3 className="dis-flow-title">{step.title}</h3>
                <p className="dis-flow-body">{step.body}</p>
              </article>
            ))}
          </div>

          <div className="dis-tos dis-reveal" data-delay="4">
            <div className="dis-tos-icon" aria-hidden="true">
              <IconBlock />
            </div>
            <div className="dis-tos-text">
              <span className="dis-tos-label">
                Creator ToS &middot; Hard clause
              </span>
              <p>
                Bypass DisclosureBot = forfeit payout <strong>+</strong> tier
                demotion (first offense) <strong>+</strong> platform ban (second
                offense). This is a contractual term, not a guideline.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 4. What gets checked ───────────────────────────── */}
      <section
        className="dis-checklist"
        aria-labelledby="dis-checklist-heading"
      >
        <div className="dis-container">
          <div className="dis-section-head dis-reveal">
            <span className="dis-section-num">&sect; 03</span>
            <span className="dis-eyebrow">What gets checked</span>
            <h2 id="dis-checklist-heading" className="dis-section-title">
              Six signals. Every draft. Every platform.
            </h2>
            <p className="dis-section-sub">
              DisclosureBot runs six parallel checks on every creator draft,
              scored by Claude Sonnet 4.6 and rule-engine fallbacks. Any single
              failure routes the draft to block or human review.
            </p>
          </div>

          <div className="dis-checklist-grid">
            {CHECKLIST.map((item, i) => (
              <article
                key={item.title}
                className="dis-checklist-item dis-reveal"
                data-delay={String((i % 4) + 1)}
              >
                <div className="dis-checklist-check" aria-hidden="true">
                  <IconCheck />
                </div>
                <div>
                  <h3 className="dis-checklist-title">{item.title}</h3>
                  <p className="dis-checklist-body">{item.body}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── 5. Recent audit entries ────────────────────────── */}
      <section
        className="dis-recent-audits"
        aria-labelledby="dis-recent-audits-heading"
      >
        <div className="dis-container">
          <div className="dis-section-head dis-reveal">
            <span className="dis-section-num">&sect; 04</span>
            <span className="dis-eyebrow">Recent audit entries</span>
            <h2 id="dis-recent-audits-heading" className="dis-section-title">
              A public-facing sample of the audit log.
            </h2>
            <p className="dis-section-sub">
              Below: six recent entries from the{" "}
              <span className="dis-mono">disclosure_audits</span> table. Full
              export available on request to enterprise procurement under
              standard NDA. Reference: DisclosureBot Audit Row component.
            </p>
          </div>

          <div className="dis-audit-log dis-reveal" data-delay="1">
            <div className="dis-audit-log-row dis-audit-log-row--head">
              <span>Timestamp</span>
              <span>Creator</span>
              <span>Campaign</span>
              <span>Platform</span>
              <span>Verdict</span>
              <span>Conf.</span>
              <span>Reviewer</span>
            </div>
            {AUDIT_ROWS.map((row, i) => (
              <div
                key={`${row.timestamp}-${row.creator}`}
                className="dis-audit-log-row"
              >
                <span className="dis-audit-log-ts">{row.timestamp}</span>
                <span className="dis-audit-log-creator">{row.creator}</span>
                <span className="dis-audit-log-campaign">{row.campaign}</span>
                <span className="dis-audit-log-platform">{row.platform}</span>
                <span className="dis-audit-log-verdict">
                  <span
                    className={`dis-verdict-badge dis-verdict-badge--${row.verdict}`}
                  >
                    {VERDICT_LABELS[row.verdict]}
                  </span>
                </span>
                <span className="dis-audit-log-conf">{row.confidence}</span>
                <span className="dis-audit-log-reviewer">{row.reviewer}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 6. Audit cadence table ─────────────────────────── */}
      <section className="dis-audit" aria-labelledby="dis-audit-heading">
        <div className="dis-container">
          <div className="dis-section-head dis-reveal">
            <span className="dis-section-num">&sect; 05</span>
            <span className="dis-eyebrow">Audit cadence</span>
            <h2 id="dis-audit-heading" className="dis-section-title">
              Four tempos. Four owners. One chain of evidence.
            </h2>
            <p className="dis-section-sub">
              Real-time enforcement is the floor. On top of it, a layered audit
              cadence ensures the pipeline itself is being checked &mdash; by
              ops, by counsel, by an independent 3rd party.
            </p>
          </div>

          <div className="dis-audit-table dis-reveal" data-delay="1">
            <div className="dis-audit-row dis-audit-row--head">
              <span>Cadence</span>
              <span>Activity</span>
              <span>Owner</span>
            </div>
            {AUDIT_CADENCE.map((row) => (
              <div key={row.cadence} className="dis-audit-row">
                <span className="dis-audit-cadence">{row.cadence}</span>
                <span className="dis-audit-activity">{row.activity}</span>
                <span className="dis-audit-owner">{row.owner}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 7. Quarterly external audit detail ─────────────── */}
      <section
        className="dis-external-audit"
        aria-labelledby="dis-external-audit-heading"
      >
        <div className="dis-container">
          <div className="dis-section-head dis-reveal">
            <span className="dis-section-num">&sect; 06</span>
            <span className="dis-eyebrow dis-eyebrow--light">
              Quarterly external audit
            </span>
            <h2
              id="dis-external-audit-heading"
              className="dis-section-title dis-section-title--light"
            >
              Independent counsel. Every quarter. On the record.
            </h2>
          </div>

          <div className="dis-external-audit-panel dis-reveal" data-delay="1">
            <div className="dis-external-audit-head">
              <div className="dis-external-audit-firm">
                <span className="dis-external-audit-logo" aria-hidden="true">
                  ER
                </span>
                <div>
                  <div className="dis-external-audit-firm-name">
                    Ellison Rowe LLP
                  </div>
                  <div className="dis-external-audit-firm-meta">
                    Independent counsel &middot; engaged Q4 2024 &middot; New
                    York, NY
                  </div>
                </div>
              </div>
              <div className="dis-external-audit-status">
                Closed &middot; Q1 2026
              </div>
            </div>

            <dl className="dis-external-audit-details">
              <div className="dis-external-audit-row">
                <dt>Last audit date</dt>
                <dd>March 28, 2026</dd>
              </div>
              <div className="dis-external-audit-row">
                <dt>Scope</dt>
                <dd>
                  Full DisclosureBot pipeline (model + rule engine), 1% random
                  sample of audit log entries (Jan&ndash;Mar 2026), creator ToS
                  enforcement review, merchant MSA indemnification clauses.
                </dd>
              </div>
              <div className="dis-external-audit-row">
                <dt>Findings summary</dt>
                <dd>
                  Two findings, both remediated: (1) YouTube branded-content
                  disclosure detection improved for creator-generated Shorts;
                  (2) audit log export format standardized to JSON-LD for
                  downstream counsel ingestion.
                </dd>
              </div>
              <div className="dis-external-audit-row">
                <dt>Remediation status</dt>
                <dd>
                  <span className="dis-remediation-pill">
                    2 of 2 remediated
                  </span>
                  &nbsp;Confirmed by counsel April 8, 2026.
                </dd>
              </div>
              <div className="dis-external-audit-row">
                <dt>Next audit</dt>
                <dd>Q3 2026 (on rolling 90-day cadence)</dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      {/* ── 8. Insurance + reserve + response ──────────────── */}
      <section
        className="dis-insurance"
        aria-labelledby="dis-insurance-heading"
      >
        <div className="dis-container">
          <div className="dis-section-head dis-reveal">
            <span className="dis-section-num">&sect; 07</span>
            <span className="dis-eyebrow">Insurance, reserve, response</span>
            <h2 id="dis-insurance-heading" className="dis-section-title">
              Architecture is the gate. Insurance is the backstop.
            </h2>
            <p className="dis-section-sub">
              Even architectural compliance needs a financial backstop. The
              merchant&rsquo;s downside is bounded in writing &mdash; not in a
              reassuring blog post.
            </p>
          </div>

          <div className="dis-insurance-grid">
            {INSURANCE_ITEMS.map((item, i) => (
              <article
                key={item.title}
                className="dis-insurance-item dis-reveal"
                data-delay={String((i % 4) + 1)}
              >
                <div className="dis-insurance-icon" aria-hidden="true">
                  <IconShield />
                </div>
                <h3 className="dis-insurance-title">{item.title}</h3>
                <p className="dis-insurance-body">{item.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── 9. CTA ─────────────────────────────────────────── */}
      <section className="dis-cta" aria-labelledby="dis-cta-heading">
        <div className="dis-container">
          <div className="dis-cta-inner dis-reveal">
            <span className="dis-eyebrow">Next step</span>
            <h2 id="dis-cta-heading" className="dis-cta-headline">
              Ready to see architectural compliance in production?
            </h2>
            <p className="dis-cta-sub">
              The $0 Pilot lets a Williamsburg Coffee+ merchant test the full
              stack &mdash; ConversionOracle, DisclosureBot, audit trail &mdash;
              on live campaigns before any commitment.
            </p>
            <div className="dis-cta-actions">
              <Link href="/merchant/pilot" className="dis-btn dis-btn--primary">
                <span>Apply for $0 Pilot</span>
                <IconArrowRight className="dis-btn-arrow" />
              </Link>
              <Link
                href="/conversion-oracle"
                className="dis-btn dis-btn--ghost"
              >
                <span>See ConversionOracle (our AI moat)</span>
                <IconArrowRight className="dis-btn-arrow" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
