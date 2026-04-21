import Link from "next/link";
import ScrollRevealInit from "@/components/layout/ScrollRevealInit";
import LandingInteractivity from "@/components/layout/LandingInteractivity";
import StatCounter from "@/components/layout/StatCounter";
import "./landing.css";

/* ── Merchant attribution dashboard ──────────────────────── */
const ATTR_ROWS = [
  {
    handle: "@maya.eats.nyc",
    qr: "QR-4821",
    amount: "+$32",
    verified: true,
    delay: "0s",
  },
  {
    handle: "@brooklyn_bites",
    qr: "QR-4822",
    amount: "+$32",
    verified: true,
    delay: "0.15s",
  },
  {
    handle: "@nycfoodie_",
    qr: "QR-4823",
    amount: "+$32",
    verified: false,
    delay: "0.3s",
  },
  {
    handle: "@williamsburg.e",
    qr: "QR-4824",
    amount: "+$32",
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
          <span className="dash-title">Attribution Dashboard</span>
        </div>
        <span className="dash-meta">Ramen &amp; Co. &middot; Tonight</span>
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
          <span className="dash-stat-n">47</span>
          <span className="dash-stat-l">QR scans</span>
        </div>
        <div className="dash-stat">
          <span className="dash-stat-n">$1,504</span>
          <span className="dash-stat-l">Revenue</span>
        </div>
        <div className="dash-stat">
          <span className="dash-stat-n">3.2&times;</span>
          <span className="dash-stat-l">ROI</span>
        </div>
      </div>
    </div>
  );
}

/* ── 3 key tiers ─────────────────────────────────────────── */
const TIERS = [
  {
    color: "#b8a99a",
    mat: "Clay",
    name: "Seed",
    earn: "Free product",
    desc: "Zero followers. First campaign.",
    badge: "Entry",
  },
  {
    color: "#4a5568",
    mat: "Steel",
    name: "Operator",
    earn: "$20 + 3%",
    desc: "Commission + bonuses.",
    featured: true,
  },
  {
    color: "#1a1a2e",
    mat: "Obsidian",
    name: "Partner",
    earn: "$100 + 10%",
    desc: "Elite. $80/mo milestone.",
  },
];

/* ── FAQ ─────────────────────────────────────────────────── */
const FAQS = [
  {
    q: "How is a visit verified?",
    a: "Customers scan a unique QR code at your location. No scan, no charge.",
  },
  {
    q: "Low follower count?",
    a: "Irrelevant. We score on verified conversions. 500 followers driving 30 visits beats 50K driving zero.",
  },
  {
    q: "How do creators get paid?",
    a: "Weekly direct deposit. No invoicing, no 30-day waits.",
  },
  { q: "Can I cancel?", a: "Anytime. No contracts, no lock-in." },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Push",
  description:
    "Creator marketplace for NYC businesses. Pay per verified visit.",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  url: "https://pushnyc.co",
  offers: { "@type": "Offer", price: "19.99", priceCurrency: "USD" },
  provider: {
    "@type": "Organization",
    name: "Push",
    url: "https://pushnyc.co",
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
            <span className="eyebrow">Performance-Based Creator Marketing</span>
          </div>

          <h1 id="hero-h" className="hero-h">
            <span className="hero-l1">
              <span className="hw-conn">Turn</span>{" "}
              <span className="hw-key">creators</span>
            </span>
            <span className="hero-l2">
              <span className="hw-conn">into</span>{" "}
              <em className="hw-accent">results.</em>
            </span>
          </h1>

          <div className="hero-bottom">
            <div className="hero-ctas">
              <Link href="/merchant/signup" className="btn-fill">
                Start Free
              </Link>
              <Link href="#how-it-works" className="btn-outline-light">
                How It Works
              </Link>
            </div>
            <p className="hero-sub">
              Pay only when a creator drives a verified visit &mdash; tracked by
              QR code. Zero guesswork.
            </p>
          </div>
        </div>

        <div className="hero-stats-wrap">
          <div className="container hero-stats">
            <div className="h-stat reveal">
              <span className="h-stat-n">
                <StatCounter
                  value={19.99}
                  prefix="$"
                  decimals={2}
                  duration={1200}
                />
              </span>
              <span className="h-stat-l">/ month</span>
            </div>
            <div className="h-stat reveal" style={{ transitionDelay: "100ms" }}>
              <span className="h-stat-n">
                <StatCounter value={6} duration={800} />
              </span>
              <span className="h-stat-l">creator tiers</span>
            </div>
            <div className="h-stat reveal" style={{ transitionDelay: "200ms" }}>
              <span className="h-stat-n">
                <StatCounter value={24} suffix="h" duration={1000} />
              </span>
              <span className="h-stat-l">to launch</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── PROOF ────────────────────────────────────────── */}
      <div className="proof">
        <div className="container proof-inner">
          <span className="proof-label">Trusted by NYC businesses</span>
          <div className="proof-names">
            {[
              "Ramen & Co.",
              "Bloom Florals",
              "The Roast Room",
              "Bodega Azul",
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
            Know exactly
            <br />
            <span className="d-ghost">
              which creators
              <br />
              drive customers.
            </span>
          </h2>

          <div className="merch-grid">
            <div className="merch-copy reveal">
              <p className="s-body">
                Transaction-level attribution via QR codes. Know which creator
                drove which customer &mdash; pay only for verified results.
              </p>
              <ul className="feat-list">
                <li>
                  <span className="feat-dot" />
                  87% match rate within 2 miles
                </li>
                <li>
                  <span className="feat-dot" />
                  Every scan logged, zero ops burden
                </li>
                <li>
                  <span className="feat-dot" />
                  From $19.99/mo &mdash; no agency markup
                </li>
              </ul>
              <Link href="/merchant/signup" className="btn-fill">
                Get Started
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
            No followers
            <br />
            <span className="d-ghost d-ghost--w">required.</span>
          </h2>

          <p className="s-body s-body--w reveal">
            Your performance score is your currency. Start from zero.
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
            <span>Build track record</span>
            <span className="tier-prog-a">&rarr;</span>
            <span className="tier-prog-hi">Top 1%: $200/visit</span>
          </div>

          <blockquote className="quote reveal">
            <p>
              &ldquo;I earned $320 last month just visiting restaurants I&apos;d
              go to anyway.&rdquo;
            </p>
            <cite>&mdash; @maya.eats.nyc &middot; Operator</cite>
          </blockquote>

          <Link href="/creator/signup" className="btn-outline-light reveal">
            Join as Creator &mdash; Free
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
            <span className="d-ghost">Zero guesswork.</span>
          </h2>

          <div className="steps">
            {[
              {
                n: "01",
                t: "Post a campaign",
                b: "Set goal, budget, payout. Push matches creators by score, tier, proximity.",
              },
              {
                n: "02",
                t: "Creator visits & creates",
                b: "Matched by location. Posts authentic content with unique QR code.",
              },
              {
                n: "03",
                t: "Verify & pay",
                b: "Every scan logged. Payouts release automatically. No disputes.",
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
                Pricing that scales
                <br />
                <span className="d-ghost">with results.</span>
              </h2>
            </div>
            <p className="price-note">
              Cancel anytime. No setup fees.
              <br />
              Creators always join free.
            </p>
          </div>

          <div className="price-grid">
            {[
              {
                name: "Starter",
                int: "$19",
                dec: ".99",
                per: "/mo",
                desc: "Pay per visit, keep full control.",
                feats: [
                  "2 campaigns",
                  "3 creator slots",
                  "AI matching",
                  "QR attribution",
                  "Basic analytics",
                ],
                cta: "Get Started",
              },
              {
                name: "Growth",
                int: "$69",
                per: "/mo",
                desc: "Best for growing restaurants, gyms, retail.",
                feats: [
                  "4 campaigns",
                  "5 creator slots",
                  "Priority matching",
                  "Full dashboard",
                  "Templates",
                ],
                featured: true,
                badge: "Most Popular",
                cta: "Get Growth",
              },
              {
                name: "Pro",
                int: "$199",
                per: "/mo",
                desc: "Unlimited campaigns, priority everything.",
                feats: [
                  "Unlimited campaigns",
                  "8 creator slots",
                  "Account manager",
                  "Custom rules",
                  "API access",
                ],
                cta: "Get Pro",
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
                  {p.dec && <span className="pc-dec">{p.dec}</span>}
                  <span className="pc-per">{p.per}</span>
                </div>
                <p className="pc-desc">{p.desc}</p>
                <ul className="pc-feats">
                  {p.feats.map((f) => (
                    <li key={f}>{f}</li>
                  ))}
                </ul>
                <Link
                  href="/merchant/signup"
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
              &ldquo;We spent $200 and got 47 verified visits in one week.
              Better ROI than any Instagram ad.&rdquo;
            </p>
            <footer>
              <span className="pull-quote-n">Maria C.</span>
              <span className="pull-quote-r">
                Caf&eacute; Dos Alas, Brooklyn
              </span>
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
            <span>NYC Founding Cohort</span>
            <span className="rule" />
          </div>
          <h2 className="cta-h">
            Ready to pay
            <br />
            <span className="cta-h-thin">only for results?</span>
          </h2>
          <p className="cta-body">
            First 50 merchants get priority creator matching. Creators always
            join free.
          </p>
          <div className="cta-btns">
            <Link href="/merchant/signup" className="btn-fill">
              Start Free &mdash; Merchants
            </Link>
            <Link href="/creator/signup" className="btn-outline-light">
              Apply as Creator
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
