import Link from "next/link";
import ScrollRevealInit from "@/components/layout/ScrollRevealInit";
import "./about.css";

/* ── Team data (v5.1 — 5-person founding crew) ──────────────── */
const TEAM = [
  {
    initial: "J",
    name: "Jiaming",
    role: "Founder · Strategy",
    bio: "Sets the Vertical AI for Local Commerce thesis and drives the Williamsburg Coffee+ beachhead. Closes merchants in person.",
  },
  {
    initial: "Z",
    name: "Z",
    role: "Engineering · ConversionOracle™",
    bio: "Owns the three-layer verification pipeline and the ConversionOracle training loop. Ships the Customer Acquisition Engine end to end.",
  },
  {
    initial: "L",
    name: "Lucy",
    role: "Marketing · Creator Relations",
    bio: "Runs Two-Segment Creator Economics signup, T1–T6 tier progression, and the NYC creator community. First call for every new creator.",
  },
  {
    initial: "P",
    name: "Prum",
    role: "Operations · Neighborhood Playbook",
    bio: "Translates every Williamsburg Coffee+ Pilot into a repeatable Neighborhood Playbook unit. Owns campaign SLAs and SLR compounding.",
  },
  {
    initial: "M",
    name: "Milly",
    role: "Design · Content",
    bio: "Protects the Push editorial language — Darky, CS Genio Mono, zero corners. Every brief, every deck, every landing page runs through her.",
  },
];

/* ── Timeline data (v5.1 — 2025 founded → roadmap) ─────────── */
const TIMELINE = [
  {
    period: "2025",
    title: "Founded in NYC",
    body: "Jiaming incorporates Push in New York City. Thesis: one vertical, one neighborhood, one compounding data asset. Vertical AI for Local Commerce becomes the product.",
  },
  {
    period: "2026 Q1",
    title: "ConversionOracle™ MVP",
    body: "Three-layer verification ships — QR scan + Claude Vision receipt OCR + geo-match. First QR-to-verified-customer round trip lands under 8 seconds. DisclosureBot pre-flight wires into the creator caption ship path.",
  },
  {
    period: "2026 Q2",
    title: "v5.1 Williamsburg Coffee+ Pilot",
    body: "Ten Williamsburg Coffee+ merchants signed at $0 Pilot cost (cap $4,200 / neighborhood). 60-day SLR ladder runs publicly. First merchant auto-flips to Operator tier at 10 verified customers.",
  },
  {
    period: "2026 Q3",
    title: "Neighborhood Playbook replication",
    body: "Greenpoint + Bushwick + LES go live as repeatable Neighborhood Playbook units. T1–T6 Two-Segment Creator Economics scaled to 200 creators. DisclosureBot clears its first vertical expansion outside Coffee+.",
  },
  {
    period: "2026 Q4+",
    title: "Roadmap — SLR 25 by Month 12",
    body: "SLR ladder targets 25 active campaigns per ops FTE by Month 12 of the beachhead. Series A raise on proof of the Customer Acquisition Engine replacing local acquisition services revenue with software revenue.",
  },
];

/* ── Values data (v5.1 — 5 operating principles) ───────────── */
const VALUES = [
  {
    word: "Verified beats claimed",
    desc: "Impressions and reach are claims. A QR scan matched to a Claude Vision receipt matched to a geo ping is a verified customer. We only count the latter.",
  },
  {
    word: "Narrow beats broad",
    desc: "One vertical (Coffee+), one neighborhood (Williamsburg), one AOV band ($8–20). Depth is the moat horizontal platforms will never get.",
  },
  {
    word: "Leverage beats labor",
    desc: "Software Leverage Ratio (SLR) is the north-star — active campaigns per ops FTE. Twenty-five by Month 12. Every human-touch hour we remove is a unit of moat.",
  },
  {
    word: "Trust is a moat",
    desc: "DisclosureBot makes non-disclosure architecturally impossible. ConversionOracle™ ground truth accumulates per neighborhood. Trust compounds where reach can only repeat.",
  },
  {
    word: "Operators before platforms",
    desc: "The independent coffee owner pulling espresso at 6am is the customer. The platform is the means. We build what an operator can actually use on a Tuesday.",
  },
];

/* ── Mission statement (v5.1) ───────────────────────────────── */
// NOTE: Rephrased from the task brief's literal copy (which used a forbidden
// project keyword) to stay inside the v5.1 grep-0 policy. Intent preserved.
const MISSION =
  "Replace the local acquisition services model with a Customer Acquisition Engine that ops teams can run 25\u00d7 leaner.";

/* ── Press data ────────────────────────────────────────────── */
const PRESS = [
  {
    outlet: "Hypepotamus NYC",
    quote:
      "Push is building vertical AI for local commerce — the first platform where every verified customer makes the system smarter.",
    date: "March 2026",
  },
  {
    outlet: "The Grocer Tech Report",
    quote:
      "ConversionOracle turns QR-verified foot traffic into a compounding data asset. That is the moat local services shops never had.",
    date: "February 2026",
  },
  {
    outlet: "NYC Startup Digest",
    quote:
      "In a market saturated with impression-based metrics, Push bets everything on the verified visit.",
    date: "January 2026",
  },
  {
    outlet: "Block & Vine",
    quote:
      "Finally, a platform built for the corner restaurant, not just national chains with media budgets.",
    date: "March 2026",
  },
];

/* ── Investor logos (text-only, editorial font) ────────────── */
const INVESTORS = [
  "Anchor Ventures",
  "Borough Capital",
  "Flatbush Fund",
  "Midtown Seed",
  "Canal Street Capital",
];

export default function AboutPage() {
  return (
    <>
      <ScrollRevealInit />

      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="about-hero" aria-labelledby="about-hero-heading">
        <div className="container">
          <p className="eyebrow about-eyebrow">ABOUT PUSH</p>
          <h1 id="about-hero-heading" className="about-hero-headline">
            <span className="about-hero-line about-hero-line--black">
              Why we bet on
            </span>
            <span className="about-hero-line about-hero-line--light">
              Vertical AI
            </span>
            <span className="about-hero-line about-hero-line--red">
              for Local Commerce.
            </span>
          </h1>
          <div className="about-hero-rule" aria-hidden="true" />
        </div>
      </section>

      {/* ── Founder's Letter ──────────────────────────────────── */}
      <section
        className="about-letter section-bright"
        aria-labelledby="letter-heading"
      >
        <div className="container">
          <div className="about-letter-inner reveal">
            <div className="about-letter-label">
              <span className="section-tag-label">Founder&apos;s Letter</span>
              <span className="about-letter-num" aria-hidden="true">
                01
              </span>
            </div>

            <h2 id="letter-heading" className="about-letter-headline">
              <span className="wt-900">Why one vertical,</span>{" "}
              <span className="wt-300">one neighborhood.</span>
            </h2>

            <div className="about-letter-body">
              <p>
                Horizontal creator platforms lose every argument at the block
                level. A generalist tool pricing coffee shops the same as
                dentists the same as gyms cannot price accurately, cannot verify
                attribution accurately, and cannot pre-screen disclosure
                accurately — because the ground truth lives in a receipt, a QR
                scan, and a geo ping that are specific to each vertical at each
                AOV band. We bet on narrow on purpose: one vertical (Coffee+),
                one neighborhood (Williamsburg), one 60-day Pilot window.
                Specialization is the moat a generalist platform cannot
                replicate.
              </p>
              <p>
                The math on one-vertical-one-neighborhood is the Software
                Leverage Ratio (SLR). SLR = active campaigns divided by ops FTE.
                Local acquisition services shops run three to five campaigns per
                human. Horizontal platforms plateau around the same number
                because every new vertical costs a new playbook. Push is built
                to run 25 by Month 12 — because the Neighborhood Playbook,
                ConversionOracle™, and DisclosureBot mean one ops FTE
                orchestrates twenty-five simultaneous campaigns without manual
                triage. That 25× ratio is not a growth metric. It is the reason
                Vertical AI for Local Commerce replaces services revenue with
                software revenue.
              </p>
              <p>
                Williamsburg Coffee+ is Template 0, not our TAM. Every verified
                walk-in trains ConversionOracle on the AOV $8–20 band. Every
                creator brief hardens the Neighborhood Playbook. Every
                disclosure we auto-clear is a row in the DisclosureBot training
                set. Sixty days in one neighborhood produces the compounding
                data asset the next 50 neighborhoods ship on top of. That is the
                bet: depth first, then replicate the unit — never the other way
                around.
              </p>
              <p className="about-letter-sign">— Jiaming, Founder</p>
            </div>

            {/* Mission statement block */}
            <div className="about-letter-mission reveal" aria-label="Mission">
              <span className="about-letter-mission-label">Mission</span>
              <p className="about-letter-mission-body">{MISSION}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Timeline ──────────────────────────────────────────── */}
      <section
        className="about-timeline section"
        aria-labelledby="timeline-heading"
      >
        <div className="container">
          <div className="section-tag reveal">
            <span className="section-tag-num">02</span>
            <span className="section-tag-line" aria-hidden="true" />
            <span className="section-tag-label">Timeline</span>
          </div>
          <h2 id="timeline-heading" className="split-headline reveal">
            <span className="wt-900">How we got</span>{" "}
            <span className="wt-300">here.</span>
          </h2>

          <div className="about-timeline-rail" role="list">
            {TIMELINE.map((item, i) => (
              <div
                key={item.period}
                className="about-timeline-item reveal"
                style={{ transitionDelay: `${i * 100}ms` }}
                role="listitem"
              >
                <div className="about-timeline-left">
                  <span className="about-timeline-period">{item.period}</span>
                  <div className="about-timeline-dot" aria-hidden="true" />
                </div>
                <div className="about-timeline-right">
                  <h3 className="about-timeline-title">{item.title}</h3>
                  <p className="about-timeline-body">{item.body}</p>
                </div>
              </div>
            ))}
            {/* Vertical connector line */}
            <div className="about-timeline-line" aria-hidden="true" />
          </div>
        </div>
      </section>

      {/* ── Team ──────────────────────────────────────────────── */}
      <section
        className="about-team section-bright"
        aria-labelledby="team-heading"
      >
        <div className="container">
          <div className="section-tag reveal">
            <span className="section-tag-num">03</span>
            <span className="section-tag-line" aria-hidden="true" />
            <span className="section-tag-label">Team</span>
          </div>
          <h2 id="team-heading" className="split-headline reveal">
            <span className="wt-900">The people</span>{" "}
            <span className="wt-300">building it.</span>
          </h2>

          <div className="about-team-grid">
            {TEAM.map((member, i) => (
              <div
                key={member.name}
                className="about-team-card reveal"
                style={{ transitionDelay: `${i * 80}ms` }}
              >
                <div className="about-team-avatar" aria-hidden="true">
                  <span className="about-team-initials">{member.initial}</span>
                </div>
                <div className="about-team-info">
                  <h3 className="about-team-name">{member.name}</h3>
                  <p className="about-team-role">{member.role}</p>
                  <p className="about-team-bio">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Investors strip ───────────────────────────────────── */}
      <section className="about-investors" aria-label="Backed by">
        <div className="container">
          <p className="about-investors-label eyebrow">Backed by</p>
          <div className="about-investors-strip">
            {INVESTORS.map((name) => (
              <span key={name} className="about-investor-name">
                {name}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── Values ────────────────────────────────────────────── */}
      <section
        className="about-values section"
        aria-labelledby="values-heading"
      >
        <div className="container">
          <div className="section-tag reveal">
            <span className="section-tag-num">04</span>
            <span className="section-tag-line" aria-hidden="true" />
            <span className="section-tag-label">Values</span>
          </div>
          <h2 id="values-heading" className="split-headline reveal">
            <span className="wt-900">What we</span>{" "}
            <span className="wt-300">stand for.</span>
          </h2>

          <div className="about-values-grid">
            {VALUES.map((v, i) => (
              <div
                key={v.word}
                className="about-value-item reveal"
                style={{ transitionDelay: `${i * 100}ms` }}
              >
                <span className="about-value-word">{v.word}</span>
                <p className="about-value-desc">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Press ─────────────────────────────────────────────── */}
      <section
        className="about-press section-bright"
        aria-labelledby="press-heading"
      >
        <div className="container">
          <div className="section-tag reveal">
            <span className="section-tag-num">05</span>
            <span className="section-tag-line" aria-hidden="true" />
            <span className="section-tag-label">Press</span>
          </div>
          <h2 id="press-heading" className="split-headline reveal">
            <span className="wt-900">What they&apos;re</span>{" "}
            <span className="wt-300">saying.</span>
          </h2>

          <div className="about-press-grid">
            {PRESS.map((item, i) => (
              <blockquote
                key={item.outlet}
                className="about-press-card reveal"
                style={{ transitionDelay: `${i * 100}ms` }}
              >
                <p className="about-press-quote">&ldquo;{item.quote}&rdquo;</p>
                <footer className="about-press-footer">
                  <span className="about-press-outlet">{item.outlet}</span>
                  <span className="about-press-date">{item.date}</span>
                </footer>
              </blockquote>
            ))}
          </div>
        </div>
      </section>

      {/* ── Bottom CTA ────────────────────────────────────────── */}
      <section className="about-cta" aria-labelledby="about-cta-heading">
        <div className="container">
          <div className="about-cta-inner reveal">
            <p className="eyebrow about-cta-eyebrow">06 / Join us</p>
            <h2 id="about-cta-heading" className="about-cta-headline">
              <span className="wt-900">Build the Customer</span>
              <br />
              <span className="wt-200">Acquisition Engine with us.</span>
            </h2>
            <p className="about-cta-body">
              We&apos;re five people running Williamsburg Coffee+ toward SLR 25.
              Operator, engineer, or investor — if the Vertical AI for Local
              Commerce bet lands for you, talk to us.
            </p>
            <div className="about-cta-actions">
              <Link href="/careers" className="btn btn-primary">
                Join us
              </Link>
              <Link href="/yc-2027" className="btn btn-ghost about-cta-ghost">
                Invest
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
