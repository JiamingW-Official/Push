import Link from "next/link";
import ScrollRevealInit from "@/components/layout/ScrollRevealInit";
import LandingInteractivity from "@/components/layout/LandingInteractivity";
import StatCounter from "@/components/layout/StatCounter";
import AgentOutputDemo from "@/components/landing/AgentOutputDemo";
import VerificationBadge from "@/components/landing/VerificationBadge";
import "./landing.css";

/* ── Merchant verification dashboard ──────────────────────── */
const ATTR_ROWS = [
  {
    handle: "@maya.eats.nyc",
    qr: "QR-4821",
    amount: "+$40",
    verified: true,
    delay: "0s",
  },
  {
    handle: "@brooklyn_bites",
    qr: "QR-4822",
    amount: "+$40",
    verified: true,
    delay: "0.15s",
  },
  {
    handle: "@nycfoodie_",
    qr: "QR-4823",
    amount: "+$40",
    verified: false,
    delay: "0.3s",
  },
  {
    handle: "@williamsburg.e",
    qr: "QR-4824",
    amount: "+$40",
    verified: true,
    delay: "0.45s",
  },
];

function MerchantDashboard() {
  return (
    <div className="dash">
      <div className="dash-bar">
        <div className="dash-bar-left">
          <span className="dash-dot" />
          <span className="dash-title">ConversionOracle Pipeline</span>
        </div>
        <span className="dash-meta">Sey Coffee &middot; Williamsburg</span>
      </div>
      <div className="dash-rows">
        {ATTR_ROWS.map((r) => (
          <div
            key={r.handle}
            className="dash-row"
            style={{ animationDelay: r.delay }}
          >
            <span className="dash-handle">{r.handle}</span>
            <span className="dash-qr">{r.qr}</span>
            <span
              className={`dash-check ${r.verified ? "dash-check--ok" : ""}`}
            >
              {r.verified ? "\u2713" : "\u00b7\u00b7\u00b7"}
            </span>
            <span className={`dash-amt ${r.verified ? "dash-amt--ok" : ""}`}>
              {r.verified ? r.amount : "\u2014"}
            </span>
          </div>
        ))}
      </div>
      <div className="dash-live-row">
        <span className="dash-live-dot" aria-hidden="true" />
        <span className="dash-live-text">
          $560 owed &middot; 14 AI-verified &middot; &lt;8s verify time
        </span>
      </div>
      <div className="dash-footer">
        <div className="dash-stat">
          <span className="dash-stat-n">14</span>
          <span className="dash-stat-l">AI-verified</span>
        </div>
        <div className="dash-stat">
          <span className="dash-stat-n">$560</span>
          <span className="dash-stat-l">Owed</span>
        </div>
        <div className="dash-stat">
          <span className="dash-stat-n">&lt;8s</span>
          <span className="dash-stat-l">Verify time</span>
        </div>
      </div>
    </div>
  );
}

/* ── 3 key tiers (creator operator network) ──────────────── */
const TIERS = [
  {
    color: "#b8a99a",
    mat: "Clay",
    name: "Seed",
    earn: "Free product",
    desc: "First campaign. Training data.",
    badge: "Entry",
  },
  {
    color: "#4a5568",
    mat: "Steel",
    name: "Operator",
    earn: "$20 + 3%",
    desc: "AI-scheduled. Commission active.",
    featured: true,
  },
  {
    color: "#1a1a2e",
    mat: "Obsidian",
    name: "Partner",
    earn: "$100 + 10%",
    desc: "Elite. Agent priority routing.",
  },
];

/* ── FAQ (v5.1) ──────────────────────────────────────────── */
const FAQS = [
  {
    q: "What is Vertical AI for Local Commerce?",
    a: "A Customer Acquisition Engine built for one vertical at a time. ConversionOracle\u2122 is the moat: Claude Vision + OCR + geo-fence verify every foot-traffic event in <8s. We start narrow (Williamsburg Coffee+, AOV $8\u201320) so the model learns one domain deeply before we expand.",
  },
  {
    q: "How does Williamsburg Coffee+ pricing work?",
    a: "Pilot: $0 for the first 10 Coffee+ merchants \u2014 10 free AI-verified customers, no catch. Operator: $500/mo minimum + $15\u201385 per verified customer (priced by vertical, not a flat rate) + Retention Add-on $8\u201324. Neighborhood: $8\u201312K launch + $20\u201335K MRR target for multi-location operators.",
  },
  {
    q: "Why does the Software Leverage Ratio (SLR) matter?",
    a: "SLR = revenue per human hour. Our north-star target is 25 \u2014 every dollar of MRR should take 1/25th the human labor a legacy acquisition shop would burn. ConversionOracle\u2122 handles verification, matching, and settlement so the human team only touches exceptions.",
  },
  {
    q: "Can I cancel?",
    a: "Anytime. No contracts. Pilot merchants keep any verified customers already delivered. Operators pay only for the verified events already settled in the current cycle.",
  },
];

/* ── Rotating social-proof fragments (ticker) ────────────── */
const PROOF_TICKER = [
  {
    who: "Marco A. \u00b7 Sey Coffee",
    quote: "11 verified customers in week one.",
  },
  {
    who: "Alex \u00b7 Devoci\u00f3n",
    quote: "ConversionOracle\u2122 caught 3 fakes same day.",
  },
  {
    who: "Jordan \u00b7 Partners Coffee",
    quote: "SLR math finally makes sense.",
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Push",
  description:
    "Vertical AI for Local Commerce. A Customer Acquisition Engine that delivers AI-verified customers to local Coffee+ operators via three-layer verification (QR + Claude Vision + geo).",
  url: "https://push-six-flax.vercel.app",
  serviceType: "Customer Acquisition Engine",
  areaServed: { "@type": "City", name: "New York" },
  makesOffer: {
    "@type": "Offer",
    name: "Williamsburg Coffee+ Pilot",
    description:
      "Free pilot for first 10 Coffee+ merchants \u2014 10 AI-verified customers, no charge",
    priceSpecification: {
      "@type": "PriceSpecification",
      priceCurrency: "USD",
      price: "0",
    },
  },
  provider: {
    "@type": "Organization",
    name: "Push",
    url: "https://push-six-flax.vercel.app",
  },
};

export default function LandingPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ScrollRevealInit />
      <LandingInteractivity />

      {/* ── HERO ─────────────────────────────────────────── */}
      <section id="main-content" className="hero" aria-labelledby="hero-h">
        <AgentOutputDemo />
        <div className="container hero-inner">
          <div className="hero-label">
            <span className="rule" />
            <span className="eyebrow">Vertical AI for Local Commerce</span>
          </div>

          <h1 id="hero-h" className="hero-h">
            <span className="hero-l1">
              <span className="hw-conn">Vertical AI for</span>{" "}
              <span className="hw-key">Local Commerce</span>
            </span>
            <span className="hero-l2">
              <span className="hw-conn">Tell us how many customers.</span>{" "}
              <em className="hw-accent">We deliver.</em>
            </span>
          </h1>

          <div className="hero-bottom">
            <div className="hero-cta-stack">
              <div className="hero-ctas">
                <Link href="/merchant/pilot" className="btn-fill">
                  Start $0 Pilot
                </Link>
                <Link
                  href="/merchant/pilot/economics"
                  className="btn-outline-light"
                >
                  See pilot economics
                </Link>
              </div>
              <div className="hero-creator-switch">
                <span className="hero-creator-switch-label">
                  Are you a creator?
                </span>
                <Link
                  href="/creator/signup"
                  className="hero-creator-switch-link"
                >
                  Join the operator network &mdash; Free
                  <span aria-hidden="true">&nbsp;&rarr;</span>
                </Link>
              </div>
            </div>
            <p className="hero-sub">
              Customer Acquisition Engine for local Coffee+.
              ConversionOracle&trade; verifies every visit in &lt;8s (QR +
              Claude Vision + geo). Pay only for verified customers. SLR
              north-star: 25.
            </p>
          </div>
        </div>

        <div className="hero-stats-wrap">
          <div className="container hero-stats">
            <div className="h-stat reveal">
              <span className="h-stat-n">
                <StatCounter value={0} prefix="$" duration={900} />
              </span>
              <span className="h-stat-l">Pilot first 10</span>
            </div>
            <div className="h-stat reveal" style={{ transitionDelay: "100ms" }}>
              <span className="h-stat-n">
                <StatCounter value={25} duration={1000} />
              </span>
              <span className="h-stat-l">SLR target</span>
            </div>
            <div className="h-stat reveal" style={{ transitionDelay: "200ms" }}>
              <span className="h-stat-n">
                <StatCounter value={100} suffix="%" duration={1200} />
              </span>
              <span className="h-stat-l">AI verified</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── PROOF (marquee ticker) ───────────────────────── */}
      <div className="proof">
        <div className="container proof-inner">
          <span className="proof-label">Williamsburg Coffee+ pilot cohort</span>
          <div
            className="proof-marquee"
            aria-label="Williamsburg Coffee+ pilot merchants"
          >
            <div className="proof-marquee-track">
              {[
                "Sey Coffee",
                "Devoci\u00f3n",
                "Partners Coffee",
                "Variety Coffee",
                "Hungry Ghost",
                "Kos Kaffe",
                "Toby's Estate",
                "Bluestone Lane",
              ]
                .concat([
                  "Sey Coffee",
                  "Devoci\u00f3n",
                  "Partners Coffee",
                  "Variety Coffee",
                  "Hungry Ghost",
                  "Kos Kaffe",
                  "Toby's Estate",
                  "Bluestone Lane",
                ])
                .map((n, i) => (
                  <span key={`${n}-${i}`} className="proof-name-wrap">
                    <span className="proof-name">{n}</span>
                    <span className="proof-sep" aria-hidden="true">
                      &middot;
                    </span>
                  </span>
                ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── MERCHANTS ──────────────────────────────────── */}
      <section id="merchants" className="s s--light" aria-labelledby="merch-h">
        <div className="container">
          <div className="s-num reveal">02 /</div>
          <div className="s-label reveal">
            <span className="rule" />
            <span>For Merchants</span>
          </div>

          <h2 id="merch-h" className="d-head d-head--hero reveal">
            Tell the engine
            <br />
            <span className="d-ghost">
              how many customers
              <br />
              you need.
            </span>
          </h2>

          <div className="merch-grid">
            <div className="merch-copy reveal">
              <p className="s-body">
                Input your goal &mdash; &ldquo;20 new customers this
                month.&rdquo; The Customer Acquisition Engine matches operators,
                drafts briefs, predicts ROI in 60 seconds.
                ConversionOracle&trade; verifies every visit. Pay only for
                verified customers.
              </p>
              <ul className="feat-list">
                <li>
                  <span className="feat-dot" />
                  ConversionOracle&trade;: Claude Vision + OCR + geo
                  triple-check
                </li>
                <li>
                  <span className="feat-dot" />
                  60s engine match &mdash; no manual outreach
                </li>
                <li>
                  <span className="feat-dot" />
                  $0 Pilot &mdash; then $500/mo min + $15&ndash;85 per verified
                  customer
                </li>
              </ul>
              <Link href="/merchant/pilot" className="btn-fill">
                Apply for $0 Pilot
              </Link>
            </div>
            <div
              className="merch-visual reveal"
              style={{ transitionDelay: "150ms" }}
            >
              <MerchantDashboard />
            </div>
          </div>

          <div className="reveal" style={{ transitionDelay: "200ms" }}>
            <VerificationBadge />
          </div>
        </div>
      </section>

      {/* ── CREATORS ───────────────────────────────────── */}
      <section id="creators" className="s s--dark" aria-labelledby="create-h">
        <div className="container">
          <div className="s-num s-num--w reveal">03 /</div>
          <div className="s-label s-label--w reveal">
            <span className="rule rule--w" />
            <span>For Creators</span>
          </div>

          <h2 id="create-h" className="d-head d-head--w d-head--hero reveal">
            An AI-managed
            <br />
            <span className="d-ghost d-ghost--w">operator network.</span>
          </h2>

          <p className="s-body s-body--w reveal">
            The engine schedules you. Verified customers pay you. Tier score is
            your currency &mdash; not followers.
          </p>

          <div className="tier-row reveal" style={{ transitionDelay: "100ms" }}>
            {TIERS.map((t) => (
              <div
                key={t.name}
                className={`tier ${t.featured ? "tier--feat" : ""}`}
                style={{ "--tc": t.color } as React.CSSProperties}
              >
                <span className="tier-top-accent" aria-hidden="true" />
                {t.badge && <span className="tier-badge">{t.badge}</span>}
                <span className="tier-mat">{t.mat}</span>
                <span className="tier-name">{t.name}</span>
                <span className="tier-earn">{t.earn}</span>
                <span className="tier-desc">{t.desc}</span>
              </div>
            ))}
          </div>

          <div className="tier-prog reveal">
            <span className="tier-prog-step">Start free</span>
            <span className="tier-prog-fill" aria-hidden="true">
              <span className="tier-prog-line" />
            </span>
            <span className="tier-prog-step">Engine assigns campaigns</span>
            <span className="tier-prog-fill" aria-hidden="true">
              <span className="tier-prog-line" />
            </span>
            <span className="tier-prog-step tier-prog-hi">
              Partner tier: $200/customer
            </span>
          </div>

          <blockquote className="quote reveal">
            <p>
              &ldquo;I earned $320 last month from coffee shops I was already
              walking to.&rdquo;
            </p>
            <cite>&mdash; @maya.eats.nyc &middot; Operator</cite>
          </blockquote>

          <Link href="/creator/signup" className="btn-outline-light reveal">
            Join the operator network &mdash; Free
          </Link>
        </div>
      </section>

      {/* ── HOW IT WORKS ───────────────────────────────── */}
      <section id="how-it-works" className="s s--light" aria-labelledby="how-h">
        <div className="container">
          <div className="s-num reveal">04 /</div>
          <div className="s-label reveal">
            <span className="rule" />
            <span>How It Works</span>
          </div>

          <h2 id="how-h" className="d-head d-head--hero reveal">
            Three steps.
            <br />
            <span className="d-ghost">The engine handles the middle.</span>
          </h2>

          <div className="steps">
            {[
              {
                n: "01",
                t: "Tell the engine your goal",
                b: 'Input: "20 new customers this month, $400 budget, Coffee+, Williamsburg." Takes 60 seconds.',
              },
              {
                n: "02",
                t: "Engine matches + runs",
                b: "Claude matches top 5 operators, drafts briefs, predicts ROI. Operators visit, post, drive customers.",
              },
              {
                n: "03",
                t: "ConversionOracle verifies or you don't pay",
                b: "Claude Vision + OCR + geo clear every scan in <8s. Pay only for verified customers.",
              },
            ].map((s, i) => (
              <div
                key={s.n}
                className="step reveal"
                style={{ transitionDelay: `${i * 120}ms` }}
              >
                <span className="step-n step-n--oversize" aria-hidden="true">
                  {s.n}
                </span>
                <span className="step-n-label">{s.n}</span>
                <div className="step-content">
                  <h3 className="step-t">{s.t}</h3>
                  <p className="step-b">{s.b}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING ────────────────────────────────────── */}
      <section id="pricing" className="s s--snow" aria-labelledby="price-h">
        <div className="container">
          <div className="s-num reveal">05 /</div>
          <div className="price-top reveal">
            <div>
              <div className="s-label" style={{ marginBottom: 12 }}>
                <span className="rule" />
                <span>Pricing</span>
              </div>
              <h2 id="price-h" className="d-head">
                Tiered by vertical.
                <br />
                <span className="d-ghost">Not SaaS.</span>
              </h2>
            </div>
            <p className="price-note">
              Vertical AI for Local Commerce.
              <br />
              Pay only for verified customers.
            </p>
          </div>

          <div className="price-grid">
            {[
              {
                name: "Pilot",
                int: "$0",
                per: "first 10 Coffee+ merchants",
                desc: "First 10 AI-verified customers free. No catch. If ConversionOracle\u2122 can't deliver, you don't pay.",
                feats: [
                  "Up to 10 verified customers free",
                  "60s engine operator matching",
                  "ConversionOracle\u2122 verification",
                  "QR + Vision OCR + geo attribution",
                  "Weekly performance review",
                ],
                cta: "Apply for pilot",
                href: "/merchant/pilot",
              },
              {
                name: "Operator",
                int: "$500",
                per: "/mo min + $15\u201385 per verified customer",
                desc: "You set the target. The engine delivers. Priced by vertical \u2014 not one-size-fits-all. Retention Add-on $8\u201324.",
                feats: [
                  "Unlimited engine-matched campaigns",
                  "Dedicated tuning",
                  "Two-Tier Hero + Sustained offers",
                  "Creator tier 2\u20136 access",
                  "Day-1 multi-modal verification",
                  "Dispute SLA: 24h",
                ],
                featured: true,
                badge: "Outcome-Based",
                cta: "Talk to the engine",
                href: "/merchant/signup",
              },
              {
                name: "Neighborhood",
                int: "$8\u201312K",
                per: "launch + $20\u201335K MRR target",
                desc: "For multi-location operators rolling out a whole neighborhood. Density unlock, shared ConversionOracle\u2122 pipeline, priority routing.",
                feats: [
                  "Multi-location rollout package",
                  "Shared verification pipeline",
                  "Priority operator routing",
                  "Custom SLR reporting",
                  "Dedicated strategist",
                ],
                cta: "Request a plan",
                href: "/merchant/signup",
              },
            ].map((p, i) => (
              <div
                key={p.name}
                className={`pc reveal ${p.featured ? "pc--feat" : ""}`}
                style={{ transitionDelay: `${i * 100}ms` }}
              >
                {p.featured && (
                  <span className="pc-shimmer" aria-hidden="true" />
                )}
                {p.badge && <span className="pc-badge">{p.badge}</span>}
                <h3 className="pc-name">{p.name}</h3>
                <div className="pc-price">
                  <span className="pc-int">{p.int}</span>
                  <span className="pc-per">{p.per}</span>
                </div>
                <p className="pc-desc">{p.desc}</p>
                <ul className="pc-feats">
                  {p.feats.map((f) => (
                    <li key={f}>{f}</li>
                  ))}
                </ul>
                <Link
                  href={p.href}
                  className={
                    p.featured ? "btn-fill pc-btn" : "btn-outline pc-btn"
                  }
                >
                  {p.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SOCIAL PROOF ───────────────────────────────── */}
      <section className="s s--dark s--compact">
        <div className="container">
          <blockquote className="pull-quote reveal">
            <p>
              &ldquo;Push engine ran 60 seconds, matched 14 Williamsburg Coffee+
              operators, drafted briefs. First week: 11 verified new
              customers.&rdquo;
            </p>
            <footer>
              <span className="pull-quote-n">Marco A.</span>
              <span className="pull-quote-r">Sey Coffee, Williamsburg</span>
            </footer>
          </blockquote>

          <div
            className="proof-ticker reveal"
            style={{ transitionDelay: "150ms" }}
            aria-label="Pilot cohort testimonials"
          >
            {PROOF_TICKER.map((p, i) => (
              <span
                key={p.who}
                className="proof-ticker-item"
                style={{ animationDelay: `${i * 6}s` }}
              >
                <span className="proof-ticker-quote">
                  &ldquo;{p.quote}&rdquo;
                </span>
                <span className="proof-ticker-who">{p.who}</span>
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────── */}
      <section id="faq" className="s s--light">
        <div className="container">
          <div className="s-num reveal">06 /</div>
          <h2 className="d-head reveal">
            Common
            <br />
            <span className="d-ghost">questions.</span>
          </h2>
          <div className="faq-list reveal">
            {FAQS.map((f, i) => (
              <details key={i} className="faq-item" open={i === 0}>
                <summary className="faq-summary">
                  <span className="faq-q">{f.q}</span>
                  <span className="faq-chevron" aria-hidden="true">
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 14 14"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="square"
                    >
                      <path d="M3 5l4 4 4-4" />
                    </svg>
                  </span>
                </summary>
                <div className="faq-body">
                  <p className="faq-a">{f.a}</p>
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────── */}
      <section id="cta" className="cta">
        <div className="container cta-inner">
          <div className="cta-label">
            <span className="rule" />
            <span>Williamsburg Coffee+ Pilot &mdash; First 10 Merchants</span>
            <span className="rule" />
          </div>
          <div className="cta-slots reveal">
            <div className="cta-slots-text">
              <span className="cta-slots-total">10 pilot slots</span>
              <span className="cta-slots-dot" aria-hidden="true">
                &middot;
              </span>
              <span className="cta-slots-taken">5 taken</span>
              <span className="cta-slots-dot" aria-hidden="true">
                &middot;
              </span>
              <span className="cta-slots-remain">5 remaining</span>
            </div>
            <div className="cta-slots-bar" aria-hidden="true">
              <span className="cta-slots-fill" />
            </div>
          </div>
          <h2 className="cta-h">
            Ready to hand customer
            <br />
            <span className="cta-h-thin">acquisition to Vertical AI?</span>
          </h2>
          <p className="cta-body">
            First 10 Coffee+ merchants get $0 Pilot &mdash; 10 AI-verified
            customers free. If ConversionOracle&trade; can&apos;t deliver, you
            don&apos;t pay.
          </p>
          <div className="cta-btns">
            <Link href="/merchant/pilot" className="btn-fill">
              Apply for $0 Pilot
            </Link>
            <Link href="/creator/signup" className="btn-outline-light">
              Join operator network
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
