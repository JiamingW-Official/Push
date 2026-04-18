/**
 * Push Admin — YC Summer 2027 Application Hub
 * /admin/yc-application
 *
 * Private admin hub consolidating YC application artifacts.
 * Noindex, admin-guarded (middleware protects /admin/*).
 *
 * Authority:
 *  - .claude/UPDATE_INSTRUCTIONS_v5_1.md §4 (Q&A)
 *  - .claude/UPDATE_INSTRUCTIONS_v5_1.md §6 (Funding Roadmap)
 *  - .claude/CLAUDE_CODE_V5_1_INSTRUCTIONS.md §7 (Week 0 blockers)
 *  - Design.md (6-color palette, Darky + CSGenioMono, 0 radius)
 */

import type { Metadata } from "next";
import "./yc-application.css";

export const metadata: Metadata = {
  title: "YC Summer 2027 · Application Hub · Admin Only",
  description: "Push — YC Summer 2027 application artifacts (admin only).",
  robots: {
    index: false,
    follow: false,
    googleBot: { index: false, follow: false },
  },
};

const LAST_UPDATED = "2026-04-18";

// ---------------------------------------------------------------------------
// §2 — 90-day milestone tracker data (60d / 90d / M5 columns)
// ---------------------------------------------------------------------------

interface MilestoneRow {
  label: string;
  d60: string;
  d90: string;
  m5: string;
}

const MILESTONES: MilestoneRow[] = [
  {
    label: "Paying merchants",
    d60: "5",
    d90: "12",
    m5: "15",
  },
  {
    label: "Verified customers",
    d60: "50",
    d90: "150",
    m5: "300",
  },
  {
    label: "MRR",
    d60: "$2,500",
    d90: "$8,000",
    m5: "$15,000",
  },
  {
    label: "AI verification accuracy",
    d60: "≥80%",
    d90: "≥88%",
    m5: "≥90%",
  },
  {
    label: "Manual review rate",
    d60: "≤30%",
    d90: "≤20%",
    m5: "≤15%",
  },
  {
    label: "Active creators",
    d60: "40",
    d90: "80",
    m5: "120",
  },
  {
    label: "Campaign cycle time",
    d60: "≤7 days",
    d90: "≤4 days",
    m5: "≤3 days",
  },
  {
    label: "Software Leverage Ratio",
    d60: "8",
    d90: "12",
    m5: "18",
  },
  {
    label: "Merchant NPS",
    d60: "≥40",
    d90: "≥50",
    m5: "≥55",
  },
  {
    label: "Creator retention M2 → M3",
    d60: "—",
    d90: "≥65%",
    m5: "≥75%",
  },
];

// ---------------------------------------------------------------------------
// §3 — Application assets
// ---------------------------------------------------------------------------

interface AssetRow {
  name: string;
  status: "draft" | "ready" | "pending" | "external";
  statusLabel: string;
  ref?: string;
  note: string;
}

const ASSETS: AssetRow[] = [
  {
    name: "Founder letter",
    status: "draft",
    statusLabel: "Draft",
    note: "Narrative: Vertical AI for Local Commerce + 5-founder execution story.",
  },
  {
    name: "Pitch deck v5.1",
    status: "ready",
    statusLabel: "Ready",
    ref: "/yc-2027",
    note: "Public YC page serves as deck canon.",
  },
  {
    name: "Demo video",
    status: "pending",
    statusLabel: "Pending",
    note: "Z building the AI pipeline — screen record of scan → ConversionOracle verdict.",
  },
  {
    name: "Financial model",
    status: "ready",
    statusLabel: "Ready",
    ref: "/merchant/pilot/economics",
    note: "Two-Segment Creator Economics + unit-level Pilot-to-Paid cohort P&L.",
  },
  {
    name: "Traction snapshot",
    status: "ready",
    statusLabel: "Ready",
    ref: "/neighborhoods/williamsburg-coffee",
    note: "Neighborhood Playbook — 60-day beachhead live data.",
  },
  {
    name: "Competitive analysis",
    status: "draft",
    statusLabel: "Draft",
    note: "Aspire / Captiv8 / TapInfluence graveyard; Google/Meta acquisition-path framing.",
  },
  {
    name: "Risk register",
    status: "pending",
    statusLabel: "Pending",
    ref: "/trust/risk-register",
    note: "14-row register — to be built at /trust/risk-register.",
  },
];

// ---------------------------------------------------------------------------
// §4 — Diligence Q&A prep (canonical answers from v5.1 §4)
// ---------------------------------------------------------------------------

interface QA {
  q: string;
  a: string;
  rehearsed: string;
}

const QA_ITEMS: QA[] = [
  {
    q: "Services-business comparable. This looks labor-bound, not software-leveraged.",
    a: "Push is Vertical AI for Local Commerce, not a services business. The Software Leverage Ratio target at Month 12 is ≥ 25 (Ops person : merchant) versus a services-shop baseline of 3–5. AI (ConversionOracle, DisclosureBot, CreatorGPT) carries the work that human account managers would otherwise own.",
    rehearsed: "—",
  },
  {
    q: "Coffee AOV $6 can't support a $500/month minimum.",
    a: "$500/month is the Month-2 conversion target for Coffee+. Month 1 is a $0 Pilot. Pure coffee has a $199/month soft floor plus $15/customer. Williamsburg coffee+ (café + bakery, café + wine, café + coworking) averages $18 AOV — well inside the $500 tier.",
    rehearsed: "—",
  },
  {
    q: "SMB F&B has 50%+ annual churn. LTV assumptions collapse.",
    a: "Base case assumes 50% retention (already conservative). Stressed at 30% retention, LTV/CAC is still 10.4x. Worst realistic case 20% retention → LTV/CAC 6.9x, above the 3x SaaS benchmark.",
    rehearsed: "—",
  },
  {
    q: "Take rate 25–30%. Why not 5% or 50%?",
    a: "Take rate is determined by two-sided ROI. Merchant $25 cost for $50+ LTV customer = 2x ROI. Creator earns $12/customer × 20/month = $240 side income plus CreatorGPT plus 48h payout. Benchmarks: Uber 25–30%, DoorDash 15–25%. As ConversionOracle matures we can move to 35–40%.",
    rehearsed: "—",
  },
  {
    q: "Is the AI a real moat or a wrapper?",
    a: "Vision / OCR / geo are features, not moats. The moat is ConversionOracle — proprietary walk-in ground-truth data accumulated per-verified-customer — plus Creator Productivity Lock (SCOR: Push creator 5.2 active campaigns / month vs Aspire 1.8 vs TikTok Creator Platform 0.9).",
    rehearsed: "—",
  },
  {
    q: "Creators will leave for other platforms. You can't retain them.",
    a: "SCOR framework quantifies it: Push creator monthly active campaigns 5.2 vs Aspire 1.8 vs TikTok 0.9 = 2–3x income-per-time-spent. That is economic switching cost, not profile stickiness. The Two-Segment Creator Economics model (T1–T3 per-customer, T4–T6 retainer + equity) compounds it.",
    rehearsed: "—",
  },
  {
    q: "Google or Meta ships a competitor in 12 months. Then what?",
    a: "They lack three things: offline ground-truth data, creator-supply identity, and SMB direct sales. Most probable path is acquisition (Aspire $240M, Captiv8 $180M). Our window: 2,000+ merchants and 50,000+ verified events = $30M+ ARR = 5x+ ARR acquisition floor.",
    rehearsed: "—",
  },
  {
    q: "The Williamsburg Neighborhood Playbook doesn't copy to other neighborhoods.",
    a: "The Neighborhood Playbook is an operational SOP, not cultural magic. Four transferable modules: merchant acquisition script, creator recruitment checklist, AI verification pipeline, campaign template. First 2 neighborhoods / city are slow; Template 3+ runs standardized. Same cold-start pattern as Airbnb and Uber.",
    rehearsed: "—",
  },
  {
    q: "Five founders cannot hit a 60-day commitment.",
    a: "Work breakdown: Lucy 40 creators in 10 days (existing network); Prum 10 merchants (F&B network); Z AI pipeline v1 in 3 weeks; Jiaming ops + pitch + contracts; Milly assets + support. 5 people × 60 days = 1,200 person-hours — enough for Template 0. If 60-day milestones miss by > 30%, we extend timeline, not scope.",
    rehearsed: "—",
  },
  {
    q: "FTC disclosure fines can kill the company.",
    a: "DisclosureBot enforces compliance at the platform layer, not at the individual-creator level. Contrast with Fashion Nova ($4M fine) where the failure was individual posts without disclosure — an architecturally impossible case under v5.1. $1M E&O insurance plus $25K legal reserve in Year 1.",
    rehearsed: "—",
  },
];

// ---------------------------------------------------------------------------
// §5 — Capital stack path (v5.1 §6)
// ---------------------------------------------------------------------------

interface CapitalRow {
  round: string;
  raise: string;
  valuation: string;
  instrument: string;
  trigger: string;
}

const CAPITAL_STACK: CapitalRow[] = [
  {
    round: "Pre-Seed F&F",
    raise: "$100–200K",
    valuation: "$5–8M cap",
    instrument: "SAFE (Clerky)",
    trigger: "Williamsburg Pilot live + AI MVP demo recorded",
  },
  {
    round: "YC Standard",
    raise: "$500K",
    valuation: "$1.7M + MFN",
    instrument: "YC SAFE",
    trigger: "YC Summer 2027 acceptance",
  },
  {
    round: "Demo Day",
    raise: "$2–4M",
    valuation: "$15–25M cap",
    instrument: "post-money SAFE",
    trigger: "60 + 90-day milestones, $15K+ MRR, AI ≥ 90%, DisclosureBot live",
  },
  {
    round: "Seed Extension",
    raise: "$5–8M",
    valuation: "$30–50M post",
    instrument: "priced",
    trigger:
      "$2–4M ARR, 5 neighborhoods, LTV/CAC > 5, ConversionOracle v2, 2nd vertical",
  },
  {
    round: "Series A",
    raise: "$15–25M",
    valuation: "$80–140M post",
    instrument: "priced",
    trigger:
      "$10–18M ARR, 4 verticals, SLR ≥ 25, 15+ metros, top-quartile retention",
  },
];

// ---------------------------------------------------------------------------
// §6 — Week 0 blockers (from CLAUDE_CODE_V5_1_INSTRUCTIONS §7)
// ---------------------------------------------------------------------------

interface Blocker {
  item: string;
  owner: string;
}

const WEEK_0_BLOCKERS: Blocker[] = [
  {
    item: "v5.1 alignment full-team meeting (Jiaming / Z / Lucy / Prum / Milly)",
    owner: "Jiaming",
  },
  {
    item: "Founder equity agreement signed (4yr vest + 1yr cliff + reverse vesting)",
    owner: "Jiaming + legal",
  },
  {
    item: "Prum — 10 Williamsburg Coffee+ owner conversations (target 5 LOI)",
    owner: "Prum",
  },
];

// ---------------------------------------------------------------------------
// §7 — Quick links
// ---------------------------------------------------------------------------

interface LinkRow {
  href: string;
  label: string;
  note: string;
}

const QUICK_LINKS: LinkRow[] = [
  {
    href: "/conversion-oracle",
    label: "/conversion-oracle",
    note: "Proprietary walk-in ground-truth data system",
  },
  {
    href: "/trust/disclosure",
    label: "/trust/disclosure",
    note: "DisclosureBot — platform-level FTC compliance",
  },
  {
    href: "/neighborhoods/williamsburg-coffee",
    label: "/neighborhoods/williamsburg-coffee",
    note: "Neighborhood Playbook — beachhead cohort data",
  },
  {
    href: "/merchant/pilot",
    label: "/merchant/pilot",
    note: "$0 Pilot → paid conversion landing",
  },
  {
    href: "/pricing",
    label: "/pricing",
    note: "Two-Segment Creator Economics + merchant tiers",
  },
  {
    href: "/yc-2027",
    label: "/yc-2027",
    note: "Public YC Summer 2027 page (investor-facing)",
  },
];

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function YcApplicationPage() {
  return (
    <>
      {/* Header */}
      <div className="adm-hero">
        <div className="adm-hero__eyebrow">
          YC Summer 2027 · Application Hub · Admin Only
        </div>
        <div className="adm-hero__title">YC Summer 2027.</div>
        <div className="yca-subhead">
          Private application war-room. Milestones, assets, diligence prep,
          capital stack. Noindex. Last updated <strong>{LAST_UPDATED}</strong>.
        </div>
      </div>

      {/* §1 — Milestone tracker */}
      <section className="yca-section">
        <div className="yca-section__head">
          <div className="yca-section__eyebrow">Section 1</div>
          <h2 className="yca-section__title">
            Milestone tracker — 90-day hard commits
          </h2>
          <p className="yca-section__body">
            The numbers below are the 60-day, 90-day, and Month-5 contract we
            bring into every diligence call. Each row is a falsifiable claim.
          </p>
        </div>

        <div className="yca-milestone-grid">
          <div className="yca-milestone-grid__head">
            <div>Metric</div>
            <div>60 days</div>
            <div>90 days</div>
            <div>Month 5</div>
          </div>
          {MILESTONES.map((row) => (
            <div key={row.label} className="yca-milestone-grid__row">
              <div className="yca-milestone-grid__label">{row.label}</div>
              <div className="yca-milestone-grid__val">{row.d60}</div>
              <div className="yca-milestone-grid__val">{row.d90}</div>
              <div className="yca-milestone-grid__val yca-milestone-grid__val--target">
                {row.m5}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* §2 — Application assets */}
      <section className="yca-section">
        <div className="yca-section__head">
          <div className="yca-section__eyebrow">Section 2</div>
          <h2 className="yca-section__title">Application assets</h2>
          <p className="yca-section__body">
            Canonical artifacts submitted with the application. Status is
            source-of-truth, not aspirational.
          </p>
        </div>

        <div className="yca-asset-list">
          {ASSETS.map((asset) => (
            <div key={asset.name} className="yca-asset">
              <div className="yca-asset__main">
                <div className="yca-asset__name">{asset.name}</div>
                <div className="yca-asset__note">{asset.note}</div>
                {asset.ref && (
                  <a href={asset.ref} className="yca-asset__ref">
                    {asset.ref} →
                  </a>
                )}
              </div>
              <span
                className={`yca-status yca-status--${asset.status}`}
                aria-label={`Status ${asset.statusLabel}`}
              >
                {asset.statusLabel}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* §3 — 10 diligence Q&A prep */}
      <section className="yca-section">
        <div className="yca-section__head">
          <div className="yca-section__eyebrow">Section 3</div>
          <h2 className="yca-section__title">10 diligence Q&amp;A prep</h2>
          <p className="yca-section__body">
            Canonical answers from <code>UPDATE_INSTRUCTIONS_v5_1.md §4</code>.
            Rehearse each until flow is under 45 seconds. &quot;Last
            rehearsed&quot; is the honesty check.
          </p>
        </div>

        <ol className="yca-qa-list">
          {QA_ITEMS.map((qa, idx) => (
            <li key={qa.q} className="yca-qa">
              <div className="yca-qa__head">
                <span className="yca-qa__num">Q{idx + 1}</span>
                <div className="yca-qa__q">{qa.q}</div>
              </div>
              <div className="yca-qa__a">{qa.a}</div>
              <div className="yca-qa__meta">
                Last rehearsed:{" "}
                <span className="yca-qa__date">{qa.rehearsed}</span>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* §4 — Capital stack path */}
      <section className="yca-section">
        <div className="yca-section__head">
          <div className="yca-section__eyebrow">Section 4</div>
          <h2 className="yca-section__title">Capital stack path</h2>
          <p className="yca-section__body">
            v5.1 funding roadmap. Hold SAFE caps until Seed Extension priced
            round. Pre-YC cap ceiling &lt; $200K raise to protect YC-round
            pricing.
          </p>
        </div>

        <div className="yca-capital">
          <div className="yca-capital__head">
            <div>Round</div>
            <div>Raise</div>
            <div>Valuation</div>
            <div>Instrument</div>
            <div>Trigger</div>
          </div>
          {CAPITAL_STACK.map((row) => (
            <div key={row.round} className="yca-capital__row">
              <div className="yca-capital__round">{row.round}</div>
              <div className="yca-capital__cell">{row.raise}</div>
              <div className="yca-capital__cell">{row.valuation}</div>
              <div className="yca-capital__cell yca-capital__cell--muted">
                {row.instrument}
              </div>
              <div className="yca-capital__cell yca-capital__cell--muted">
                {row.trigger}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* §5 — Week 0 blockers */}
      <section className="yca-section">
        <div className="yca-section__head">
          <div className="yca-section__eyebrow">Section 5</div>
          <h2 className="yca-section__title">Week 0 blockers</h2>
          <p className="yca-section__body">
            Zero-code prerequisites. Nothing downstream ships until every row
            clears. Source: <code>CLAUDE_CODE_V5_1_INSTRUCTIONS §7</code>.
          </p>
        </div>

        <ul className="yca-blocker-list">
          {WEEK_0_BLOCKERS.map((b) => (
            <li key={b.item} className="yca-blocker">
              <span className="yca-blocker__box" aria-hidden="true">
                ☐
              </span>
              <div className="yca-blocker__body">
                <div className="yca-blocker__item">{b.item}</div>
                <div className="yca-blocker__owner">Owner: {b.owner}</div>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* §6 — Quick links */}
      <section className="yca-section">
        <div className="yca-section__head">
          <div className="yca-section__eyebrow">Section 6</div>
          <h2 className="yca-section__title">Quick links</h2>
          <p className="yca-section__body">
            Fastest path from this hub into the live artifacts.
          </p>
        </div>

        <ul className="yca-links">
          {QUICK_LINKS.map((link) => (
            <li key={link.href} className="yca-link">
              <a href={link.href} className="yca-link__href">
                {link.label}
              </a>
              <span className="yca-link__note">{link.note}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Footer marker */}
      <div className="yca-footer">
        Admin only · Noindex · Last updated {LAST_UPDATED}
      </div>
    </>
  );
}
