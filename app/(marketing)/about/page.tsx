import Link from "next/link";
import ScrollRevealInit from "@/components/layout/ScrollRevealInit";
import "./about.css";

/* ── Team data ─────────────────────────────────────────────── */
const TEAM = [
  {
    name: "Marcus Reyes",
    role: "Co-founder & CEO",
    bio: "Former operations lead at a Williamsburg hospitality group. Watched $80K in ad spend yield zero trackable results in 2024.",
  },
  {
    name: "Yuna Park",
    role: "Co-founder & CTO",
    bio: "Built attribution systems at a Series B e-commerce company. Moved to NYC in 2023, fell in love with local food culture.",
  },
  {
    name: "Darius Okafor",
    role: "Head of Creator Network",
    bio: "Content creator turned operator. Ran local campaigns across Brooklyn and Queens before joining Push full-time.",
  },
  {
    name: "Sofia Mendez",
    role: "Head of Growth",
    bio: "Previously scaled creator programs at two NYC-based consumer startups. Obsessed with neighborhood-level data.",
  },
  {
    name: "Alex Chen",
    role: "Lead Engineer",
    bio: "Shipped real-time data pipelines at a fintech. Joined Push to solve a harder problem: proving local foot traffic.",
  },
];

/* ── Timeline data (v5.1 — Vertical AI for Local Commerce) ── */
const TIMELINE = [
  {
    period: "2025 Q4",
    title: "The idea",
    body: "Marcus pitches a vertical AI platform for local commerce after losing $30K on influencer campaigns with no measurable outcome. Creator networks are everywhere — accountable, data-compounding ones aren't.",
  },
  {
    period: "2026 Q1",
    title: "AI verification MVP",
    body: "Claude Vision + OCR + geo verification ships. ConversionOracle begins training on day one — every verified scan feeds the model flywheel. First QR-scan-to-verified-customer round trip under 8 seconds.",
  },
  {
    period: "2026 Q2 · Week 1–4",
    title: "Beachhead signup",
    body: "Agent signs 10 Williamsburg Coffee+ (AOV $8–20) merchants for $0 Pilot. Ten Pilot merchants cap. $4,200/neighborhood Pilot cost cap. First AI-matched campaign goes live Week 2.",
  },
  {
    period: "2026 Q2 · Week 5–8",
    title: "60-day saturation",
    body: "20 AI-run campaigns, SLR crosses 8, first merchant reaches 10 verified customers and auto-flips to Operator tier. Every settled customer trains ConversionOracle further.",
  },
  {
    period: "2026 Q3",
    title: "Adjacent expansion",
    body: "Neighborhood Playbook productizes the Williamsburg proof. Agent expands to Greenpoint + Bushwick + Brooklyn Heights + LES + Nolita + Astoria. Network density over breadth — every new neighborhood deepens the playbook.",
  },
];

/* ── Values data ───────────────────────────────────────────── */
const VALUES = [
  {
    word: "Honest",
    desc: "Every payout is traceable. Every claim is backed by a QR scan. We don't count reach — only results.",
  },
  {
    word: "Local",
    desc: "We exist for the block-by-block economy of New York City. Hyper-proximity is not a feature, it is our reason for being.",
  },
  {
    word: "Verified",
    desc: "A visit without proof is an assumption. We built the entire stack around a single obsession: prove the foot traffic happened.",
  },
  {
    word: "Fair",
    desc: "Creators earn on performance, not follower count. Merchants pay only for what they get. No middlemen, no markup.",
  },
  {
    word: "Compound",
    desc: "Every verified customer trains ConversionOracle. Every neighborhood launch feeds the Neighborhood Playbook. The moat compounds.",
  },
];

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
      "ConversionOracle turns QR-verified foot traffic into a compounding data asset. That is the moat agencies never had.",
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
          <p className="eyebrow about-eyebrow">ABOUT PUSH · NYC</p>
          <h1 id="about-hero-heading" className="about-hero-headline">
            <span className="about-hero-line about-hero-line--black">
              Vertical AI
            </span>
            <span className="about-hero-line about-hero-line--light">
              for Local Commerce.
            </span>
            <span className="about-hero-line about-hero-line--red">
              Built in Williamsburg Coffee+.
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
              <span className="wt-900">A letter</span>{" "}
              <span className="wt-300">from the founder.</span>
            </h2>

            <div className="about-letter-body">
              <p>
                I ran marketing for a hospitality group in Williamsburg for
                three years. We worked with creators constantly — restaurant
                takeovers, Instagram stories, TikTok walk-throughs. The content
                always looked great. Our follower counts went up. But when I
                asked which creator drove which customer through the door on a
                Tuesday night, nobody could tell me. Not the creators. Not the
                agencies. Not the platforms. Nobody.
              </p>
              <p>
                In 2024, we spent $80,000 across creator campaigns. We could
                attribute maybe $12,000 of it to anything measurable. The rest
                was faith-based marketing dressed up in performance language.
                "Brand awareness." "Reach." "Impressions." All of it is noise if
                you cannot tie it to a body walking through your door.
              </p>
              <p>
                NYC is the best laboratory for this problem. Two hundred and
                thirty thousand local businesses, fifty thousand food and
                lifestyle creators, and almost none of them have a reliable way
                to find each other — let alone measure what happens when they
                do. Every neighborhood is its own micro-economy. Williamsburg is
                not Crown Heights. The East Village is not Astoria. Local
                marketing should be local.
              </p>
              <p>
                The insight that started Push was simple: the QR code is already
                at every restaurant table, every retail counter, every event
                entrance. It is not infrastructure we need to build — it is
                infrastructure we need to close the loop on. When a creator
                posts about your ramen shop and a customer walks in and scans
                the code, that is a verified visit. That is something you can
                pay for. That is attribution.
              </p>
              <p>
                Then we realized the deeper opportunity. Every verified scan,
                every settled customer, every creator-to-merchant match is
                training data. So we rebuilt Push as Vertical AI for Local
                Commerce — a system where ConversionOracle, our in-house model,
                learns from every verified customer and routes the next campaign
                smarter than the last. The moat is not software. The moat is the
                compounding data asset underneath it.
              </p>
              <p>
                Our north-star metric is the Software Leverage Ratio — how many
                customers one operator can deliver per hour as ConversionOracle
                improves. Agencies cap at one. We are targeting eight by month
                three, and we do not stop. Williamsburg Coffee+ is our proving
                ground: one beachhead, sixty days, measurable SLR compounding in
                public.
              </p>
              <p>
                We are NYC-first and intentionally so. Network density matters
                in local commerce. We would rather be deeply useful in one
                neighborhood, then one city, than thinly spread across twenty.
                If Push works in Williamsburg Coffee+, it works everywhere.
              </p>
              <p className="about-letter-sign">
                — Marcus Reyes, Co-founder &amp; CEO
              </p>
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
                  <span className="about-team-initials">
                    {member.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </span>
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
              <span className="wt-900">Join us in rewriting</span>
              <br />
              <span className="wt-200">local marketing.</span>
            </h2>
            <p className="about-cta-body">
              Whether you run a restaurant in Crown Heights or create content in
              Astoria — Push is built for you.
            </p>
            <div className="about-cta-actions">
              <Link href="/merchant/signup" className="btn btn-primary">
                Start as a Merchant
              </Link>
              <Link
                href="/creator/signup"
                className="btn btn-ghost about-cta-ghost"
              >
                Apply as Creator
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
