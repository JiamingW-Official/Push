import Link from "next/link";
import ScrollRevealInit from "@/components/layout/ScrollRevealInit";
import LandingInteractivity from "@/components/layout/LandingInteractivity";
import StatCounter from "@/components/layout/StatCounter";
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
          <span className="dash-title">AI Verification Layer</span>
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

/* ── FAQ ─────────────────────────────────────────────────── */
const FAQS = [
  {
    q: "How does the AI verify a customer?",
    a: "Three-layer check: QR scan + Claude Vision receipt OCR + geo-match within 200m. All three must pass within 8 seconds or the scan goes to manual review. No verification, no charge.",
  },
  {
    q: "What's the $0 Pilot?",
    a: "First 10 customers free. No catch. If the AI can't deliver, you don't pay. After 10 verified customers, you move to $500/mo min + $40/customer.",
  },
  {
    q: "Why only coffee × Williamsburg right now?",
    a: "Network density beats breadth. One category, one ZIP, 60 days of saturation. We expand after the beachhead proves the unit economics.",
  },
  {
    q: "Can I cancel?",
    a: "Anytime. No contracts. Pilot merchants keep any verified customers already delivered.",
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Push",
  description:
    "AI-powered customer acquisition agency. We deliver verified new customers to local businesses through an AI-managed creator network.",
  url: "https://push-six-flax.vercel.app",
  serviceType: "Customer Acquisition Agency",
  areaServed: { "@type": "City", name: "New York" },
  makesOffer: {
    "@type": "Offer",
    name: "Customer Acquisition Pilot",
    description:
      "Free pilot for first 10 merchants — pay only for AI-verified customers",
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
        <div className="container hero-inner">
          <div className="hero-label">
            <span className="rule" />
            <span className="eyebrow">
              AI-Powered Customer Acquisition Agency
            </span>
          </div>

          <h1 id="hero-h" className="hero-h">
            <span className="hero-l1">
              <span className="hw-conn">Tell us how many</span>{" "}
              <span className="hw-key">customers</span>
            </span>
            <span className="hero-l2">
              <span className="hw-conn">you need.</span>{" "}
              <em className="hw-accent">We deliver.</em>
            </span>
          </h1>

          <div className="hero-bottom">
            <div className="hero-ctas">
              <Link href="/merchant/pilot" className="btn-fill">
                Start $0 Pilot
              </Link>
              <Link href="#how-it-works" className="btn-outline-light">
                See the AI in action
              </Link>
            </div>
            <p className="hero-sub">
              Our AI verifies every customer through QR scan, receipt OCR, and
              geo-match. Our creator network delivers them. Pay only for who
              walks through your door.
            </p>
          </div>
        </div>

        <div className="hero-stats-wrap">
          <div className="container hero-stats">
            <div className="h-stat reveal">
              <span className="h-stat-n">
                <StatCounter value={0} prefix="$" duration={900} />
              </span>
              <span className="h-stat-l">pilot for first 10</span>
            </div>
            <div className="h-stat reveal" style={{ transitionDelay: "100ms" }}>
              <span className="h-stat-n">
                <StatCounter value={60} suffix="s" duration={1000} />
              </span>
              <span className="h-stat-l">AI match time</span>
            </div>
            <div className="h-stat reveal" style={{ transitionDelay: "200ms" }}>
              <span className="h-stat-n">
                <StatCounter value={100} suffix="%" duration={1200} />
              </span>
              <span className="h-stat-l">customer verified</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── PROOF ────────────────────────────────────────── */}
      <div className="proof">
        <div className="container proof-inner">
          <span className="proof-label">Williamsburg coffee pilot cohort</span>
          <div className="proof-names">
            {[
              "Sey Coffee",
              "Devoción",
              "Partners Coffee",
              "Variety Coffee",
            ].map((n) => (
              <span key={n} className="proof-name">
                {n}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ── MERCHANTS ──────────────────────────────────── */}
      <section id="merchants" className="s s--light" aria-labelledby="merch-h">
        <div className="container">
          <div className="s-label reveal">
            <span className="rule" />
            <span>For Merchants</span>
          </div>

          <h2 id="merch-h" className="d-head d-head--hero reveal">
            Tell the agent
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
                Input your goal — "20 new customers this month." The agent
                matches creators, drafts briefs, predicts ROI in 60 seconds. Pay
                only for AI-verified visits.
              </p>
              <ul className="feat-list">
                <li>
                  <span className="feat-dot" />
                  Claude Vision + OCR + geo triple-check
                </li>
                <li>
                  <span className="feat-dot" />
                  60s agent match — no manual outreach
                </li>
                <li>
                  <span className="feat-dot" />
                  $0 Pilot &mdash; $500/mo min + $40/customer
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
        </div>
      </section>

      {/* ── CREATORS ───────────────────────────────────── */}
      <section id="creators" className="s s--dark" aria-labelledby="create-h">
        <div className="container">
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
            Push agent schedules you. Verified customers pay you. Tier score is
            your currency &mdash; not followers.
          </p>

          <div className="tier-row reveal" style={{ transitionDelay: "100ms" }}>
            {TIERS.map((t) => (
              <div
                key={t.name}
                className={`tier ${t.featured ? "tier--feat" : ""}`}
                style={{ "--tc": t.color } as React.CSSProperties}
              >
                {t.badge && <span className="tier-badge">{t.badge}</span>}
                <span className="tier-mat">{t.mat}</span>
                <span className="tier-name">{t.name}</span>
                <span className="tier-earn">{t.earn}</span>
                <span className="tier-desc">{t.desc}</span>
              </div>
            ))}
          </div>

          <div className="tier-prog reveal">
            <span>Start free</span>
            <span className="tier-prog-a">&rarr;</span>
            <span>Agent assigns campaigns</span>
            <span className="tier-prog-a">&rarr;</span>
            <span className="tier-prog-hi">Partner tier: $200/customer</span>
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
          <div className="s-label reveal">
            <span className="rule" />
            <span>How It Works</span>
          </div>

          <h2 id="how-h" className="d-head d-head--hero reveal">
            Three steps.
            <br />
            <span className="d-ghost">AI handles the middle.</span>
          </h2>

          <div className="steps">
            {[
              {
                n: "01",
                t: "Tell the agent your goal",
                b: 'Input: "20 new customers this month, $400 budget, coffee, Williamsburg." Takes 60 seconds.',
              },
              {
                n: "02",
                t: "AI matches + runs",
                b: "Claude matches top 5 creators, drafts briefs, predicts ROI. Creators visit, post, drive customers.",
              },
              {
                n: "03",
                t: "Delivered customers — or free",
                b: "Claude Vision + OCR + geo verify every scan in <8s. Pay only for customers the AI delivers.",
              },
            ].map((s, i) => (
              <div
                key={s.n}
                className="step reveal"
                style={{ transitionDelay: `${i * 120}ms` }}
              >
                <span className="step-n">{s.n}</span>
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
          <div className="price-top reveal">
            <div>
              <div className="s-label" style={{ marginBottom: 12 }}>
                <span className="rule" />
                <span>Pricing</span>
              </div>
              <h2 id="price-h" className="d-head">
                Outcome-based pricing.
                <br />
                <span className="d-ghost">Not SaaS.</span>
              </h2>
            </div>
            <p className="price-note">
              We are the agency, powered by AI.
              <br />
              No legacy agency markup.
            </p>
          </div>

          <div className="price-grid">
            {[
              {
                name: "Pilot",
                int: "$0",
                per: "for first 10 merchants",
                desc: "First 10 customers free. No catch. If the AI can't deliver, you don't pay.",
                feats: [
                  "Up to 10 verified customers free",
                  "AI creator matching in 60s",
                  "Claude Vision receipt verification",
                  "QR + geo attribution",
                  "Weekly performance review",
                ],
                cta: "Apply for pilot",
                href: "/merchant/pilot",
              },
              {
                name: "Performance",
                int: "$500",
                per: "/mo min + $40/customer",
                desc: "You set the target. The agent delivers. Pay only for AI-verified visits.",
                feats: [
                  "Unlimited AI-matched campaigns",
                  "Dedicated agent tuning",
                  "Two-Tier Hero + Sustained offers",
                  "Creator tier 2–6 access",
                  "Day-1 multi-modal verification",
                  "Dispute SLA: 24h",
                ],
                featured: true,
                badge: "Outcome-Based",
                cta: "Talk to agent",
                href: "/merchant/signup",
              },
            ].map((p, i) => (
              <div
                key={p.name}
                className={`pc reveal ${p.featured ? "pc--feat" : ""}`}
                style={{ transitionDelay: `${i * 100}ms` }}
              >
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
              &ldquo;Push agent ran 60 seconds, matched 14 Williamsburg coffee
              creators, drafted briefs. First week: 11 verified new
              customers.&rdquo;
            </p>
            <footer>
              <span className="pull-quote-n">Marco A.</span>
              <span className="pull-quote-r">Sey Coffee, Williamsburg</span>
            </footer>
          </blockquote>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────── */}
      <section id="faq" className="s s--light">
        <div className="container">
          <h2 className="d-head reveal">
            Common
            <br />
            <span className="d-ghost">questions.</span>
          </h2>
          <div className="faq-grid reveal">
            {FAQS.map((f, i) => (
              <div key={i} className="faq">
                <h3 className="faq-q">{f.q}</h3>
                <p className="faq-a">{f.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────── */}
      <section id="cta" className="cta">
        <div className="container cta-inner">
          <div className="cta-label">
            <span className="rule" />
            <span>Williamsburg Coffee Pilot &mdash; First 10 Merchants</span>
            <span className="rule" />
          </div>
          <h2 className="cta-h">
            Ready to hand customer
            <br />
            <span className="cta-h-thin">acquisition to an AI agency?</span>
          </h2>
          <p className="cta-body">
            First 10 merchants get $0 Pilot. First 10 customers free. If the AI
            can&apos;t deliver, you don&apos;t pay.
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
