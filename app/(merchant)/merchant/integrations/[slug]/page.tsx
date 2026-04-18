"use client";

import { useState, use } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  INTEGRATIONS,
  CATEGORY_LABELS,
  getIntegrationBySlug,
  Integration,
} from "@/lib/integrations/mock-integrations";
import "../integrations.css";

/* ── Logo ───────────────────────────────────────────────────── */
function DetailLogo({ integration }: { integration: Integration }) {
  const initials = integration.name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div
      className="int-detail-hero__logo"
      style={{
        background: integration.logoColor,
        color: integration.logoTextColor,
      }}
      aria-label={`${integration.name} logo`}
    >
      {initials}
    </div>
  );
}

/* ── Stars ──────────────────────────────────────────────────── */
function Stars({ rating }: { rating: number }) {
  return (
    <div className="int-review__stars" aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <div
          key={n}
          className={`int-review__star ${n > rating ? "int-review__star--empty" : ""}`}
        />
      ))}
    </div>
  );
}

/* ── Connect button (OAuth stub) ────────────────────────────── */
function ConnectButton({ integration }: { integration: Integration }) {
  const [state, setState] = useState<
    "idle" | "loading" | "connected" | "error"
  >("idle");
  const [connected, setConnected] = useState(
    integration.status === "connected",
  );

  const isComingSoon = integration.status === "coming_soon";

  async function handleConnect() {
    setState("loading");
    try {
      const res = await fetch(
        `/api/merchant/integrations/${integration.slug}/connect`,
        { method: "POST" },
      );
      const data = await res.json();
      if (data.success) {
        if (data.action === "redirect") {
          // In production: window.location.href = data.connectUrl;
          // For stub, simulate connection after brief delay
          await new Promise((r) => setTimeout(r, 800));
        }
        setConnected(true);
        setState("connected");
      } else {
        setState("error");
      }
    } catch {
      setState("error");
    }
  }

  async function handleDisconnect() {
    setState("loading");
    try {
      const res = await fetch(
        `/api/merchant/integrations/${integration.slug}/disconnect`,
        { method: "POST" },
      );
      const data = await res.json();
      if (data.success) {
        setConnected(false);
        setState("idle");
      } else {
        setState("error");
      }
    } catch {
      setState("error");
    }
  }

  if (isComingSoon) {
    return (
      <button className="int-connect-btn int-connect-btn--coming-soon" disabled>
        Coming soon
      </button>
    );
  }

  if (connected || state === "connected") {
    return (
      <button
        className="int-connect-btn int-connect-btn--disconnect"
        onClick={handleDisconnect}
        disabled={state === "loading"}
      >
        {state === "loading" ? "Disconnecting..." : "Disconnect"}
      </button>
    );
  }

  return (
    <button
      className="int-connect-btn int-connect-btn--connect"
      onClick={handleConnect}
      disabled={state === "loading"}
    >
      {state === "loading"
        ? "Connecting..."
        : state === "error"
          ? "Try again"
          : `Connect ${integration.name}`}
    </button>
  );
}

/* ── Sidebar widgets ────────────────────────────────────────── */
function SidebarInfo({ integration }: { integration: Integration }) {
  const authLabels: Record<Integration["authType"], string> = {
    oauth: "OAuth 2.0",
    api_key: "API Key",
    webhook: "Webhook",
    none: "None",
  };

  return (
    <>
      <ConnectButton integration={integration} />

      <div className="int-widget">
        <p className="int-widget__label">Details</p>
        <div className="int-widget__row">
          <span className="int-widget__row-label">Category</span>
          <span className="int-widget__row-value">
            {CATEGORY_LABELS[integration.category]}
          </span>
        </div>
        <div className="int-widget__row">
          <span className="int-widget__row-label">Auth type</span>
          <span className="int-widget__row-value">
            {authLabels[integration.authType]}
          </span>
        </div>
        <div className="int-widget__row">
          <span className="int-widget__row-label">Status</span>
          <span
            className="int-widget__row-value"
            style={{ textTransform: "capitalize" }}
          >
            {integration.status.replace("_", " ")}
          </span>
        </div>
      </div>

      {integration.pricing && (
        <div className="int-widget">
          <p className="int-widget__label">Pricing</p>
          <p className="int-widget__pricing">{integration.pricing}</p>
        </div>
      )}

      <div className="int-widget">
        <p className="int-widget__label">External</p>
        <div className="int-widget__row">
          <span className="int-widget__row-label">Website</span>
          <a
            href={integration.website}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontSize: "var(--text-caption)",
              color: "var(--tertiary)",
              textDecoration: "none",
            }}
          >
            Visit →
          </a>
        </div>
      </div>
    </>
  );
}

/* ── Page ───────────────────────────────────────────────────── */
export default function IntegrationDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const integration = getIntegrationBySlug(slug);

  if (!integration) {
    notFound();
  }

  const isComingSoon = integration.status === "coming_soon";

  return (
    <div className="int-shell">
      {/* Top nav */}
      <header className="int-nav">
        <Link href="/merchant/dashboard" className="int-nav__logo">
          Push<span>.</span>
        </Link>
        <div className="int-nav__center">
          <span className="int-nav__title">{integration.name}</span>
        </div>
        <div className="int-nav__right">
          <Link href="/merchant/integrations" className="int-nav__back">
            ← Integrations
          </Link>
        </div>
      </header>

      <main className="int-main">
        {/* 1. Hero + logo + connect button */}
        <section className="int-detail-hero">
          <div className="int-detail-hero__inner">
            <DetailLogo integration={integration} />

            <div className="int-detail-hero__meta">
              <p className="int-detail-hero__category">
                {CATEGORY_LABELS[integration.category]}
              </p>
              <h1 className="int-detail-hero__name">{integration.name}</h1>
              <p className="int-detail-hero__tagline">{integration.tagline}</p>
            </div>

            <div className="int-detail-hero__action">
              <ConnectButton integration={integration} />
            </div>
          </div>
        </section>

        {/* Content + Sidebar */}
        <div className="int-detail-content">
          <div className="int-detail-main">
            {/* 2. What it does */}
            <section className="int-section">
              <p className="int-section__label">What it does</p>
              <h2 className="int-section__heading">
                How Push works with {integration.name}
              </h2>
              <p className="int-section__body">{integration.longDescription}</p>
            </section>

            {/* 3. Feature bullets */}
            <section className="int-section">
              <p className="int-section__label">Features</p>
              <h2 className="int-section__heading">What's included</h2>
              <ul className="int-features">
                {integration.features.map((feature, i) => (
                  <li key={i} className="int-feature-item">
                    <div className="int-feature-item__dot" />
                    {feature}
                  </li>
                ))}
              </ul>
            </section>

            {/* 4. Setup guide (only for non-coming-soon) */}
            {!isComingSoon && integration.setupSteps.length > 0 && (
              <section className="int-section">
                <p className="int-section__label">Setup guide</p>
                <h2 className="int-section__heading">
                  Up and running in {integration.setupSteps.length} steps
                </h2>
                <div className="int-steps">
                  {integration.setupSteps.map((step) => (
                    <div key={step.number} className="int-step">
                      <span className="int-step__number">
                        {String(step.number).padStart(2, "0")}
                      </span>
                      <div className="int-step__content">
                        <h3 className="int-step__title">{step.title}</h3>
                        <p className="int-step__desc">{step.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* 5. Data flow diagram */}
            {!isComingSoon && integration.dataFlowAscii && (
              <section className="int-section">
                <p className="int-section__label">Data flow</p>
                <h2 className="int-section__heading">How data moves</h2>
                <div className="int-dataflow">
                  <pre>{integration.dataFlowAscii}</pre>
                </div>
              </section>
            )}

            {/* 6. Security / privacy notes */}
            {!isComingSoon && integration.securityNotes.length > 0 && (
              <section className="int-section">
                <p className="int-section__label">Security &amp; privacy</p>
                <h2 className="int-section__heading">
                  How we protect your data
                </h2>
                <ul className="int-security">
                  {integration.securityNotes.map((note, i) => (
                    <li key={i} className="int-security__item">
                      {note}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* 7. Pricing */}
            {integration.pricing && (
              <section className="int-section">
                <p className="int-section__label">Pricing</p>
                <h2 className="int-section__heading">What it costs</h2>
                <p className="int-section__body">{integration.pricing}</p>
              </section>
            )}

            {/* 8. Reviews */}
            {integration.reviews.length > 0 && (
              <section className="int-section">
                <p className="int-section__label">Reviews</p>
                <h2 className="int-section__heading">What merchants say</h2>
                <div className="int-reviews">
                  {integration.reviews.map((review, i) => (
                    <div key={i} className="int-review">
                      <div className="int-review__header">
                        <div>
                          <p className="int-review__author">{review.author}</p>
                          <p className="int-review__role">{review.role}</p>
                        </div>
                        <Stars rating={review.rating} />
                      </div>
                      <p className="int-review__body">
                        &ldquo;{review.body}&rdquo;
                      </p>
                      <p className="int-review__date">
                        {new Date(review.date).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* 9. Bottom connect / disconnect */}
            <section className="int-section">
              <p className="int-section__label">Get started</p>
              <h2 className="int-section__heading">
                {isComingSoon
                  ? `${integration.name} is coming soon`
                  : `Connect ${integration.name} to Push`}
              </h2>
              {isComingSoon ? (
                <p className="int-section__body">
                  This integration is in development. Request early access and
                  we'll notify you when it's ready.
                </p>
              ) : (
                <p className="int-section__body">
                  Connect in minutes. Push handles the setup — you get clean
                  data flowing into your dashboard automatically.
                </p>
              )}
              <div
                style={{
                  display: "flex",
                  gap: "var(--space-2)",
                  flexWrap: "wrap",
                }}
              >
                <ConnectButton integration={integration} />
                {isComingSoon && (
                  <Link href="/contact" className="int-btn int-btn--outline">
                    Request early access
                  </Link>
                )}
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <aside className="int-detail-sidebar">
            <SidebarInfo integration={integration} />
          </aside>
        </div>

        {/* Related integrations */}
        <RelatedIntegrations current={integration} />
      </main>
    </div>
  );
}

/* ── Related integrations strip ─────────────────────────────── */
function RelatedIntegrations({ current }: { current: Integration }) {
  const related = INTEGRATIONS.filter(
    (i) => i.category === current.category && i.slug !== current.slug,
  ).slice(0, 3);

  if (related.length === 0) return null;

  return (
    <section
      style={{
        borderTop: "1px solid var(--line)",
        background: "var(--surface-bright)",
        padding: "var(--space-10) var(--space-3)",
      }}
    >
      <div style={{ maxWidth: "var(--content-width)", margin: "0 auto" }}>
        <p
          style={{
            fontSize: "11px",
            fontWeight: 700,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "var(--primary)",
            marginBottom: "var(--space-2)",
          }}
        >
          Related
        </p>
        <h2
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "var(--text-h3)",
            fontWeight: 700,
            letterSpacing: "-0.02em",
            color: "var(--dark)",
            margin: "0 0 var(--space-5)",
          }}
        >
          More {CATEGORY_LABELS[current.category]} integrations
        </h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: "var(--space-3)",
          }}
        >
          {related.map((integration) => {
            const initials = integration.name
              .split(" ")
              .map((w) => w[0])
              .join("")
              .slice(0, 2)
              .toUpperCase();
            const isComingSoon = integration.status === "coming_soon";
            const card = (
              <article
                style={{
                  background: "var(--surface-elevated)",
                  border: "1px solid var(--line)",
                  padding: "var(--space-3)",
                  display: "flex",
                  gap: "var(--space-2)",
                  alignItems: "flex-start",
                  transition:
                    "border-color var(--t-fast), box-shadow var(--t-fast), transform var(--t-fast)",
                }}
                className="int-card"
              >
                <div
                  style={{
                    width: 40,
                    height: 40,
                    flexShrink: 0,
                    background: integration.logoColor,
                    color: integration.logoTextColor,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: "var(--font-display)",
                    fontWeight: 900,
                    fontSize: 15,
                    letterSpacing: "-0.04em",
                    border: "1px solid var(--line)",
                  }}
                >
                  {initials}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "var(--text-h4)",
                      fontWeight: 700,
                      letterSpacing: "-0.02em",
                      color: "var(--dark)",
                      margin: "0 0 4px",
                    }}
                  >
                    {integration.name}
                  </p>
                  <p
                    style={{
                      fontSize: "var(--text-caption)",
                      color: "var(--graphite)",
                      margin: 0,
                      lineHeight: 1.5,
                    }}
                  >
                    {integration.tagline}
                  </p>
                </div>
                {!isComingSoon && (
                  <span
                    style={{
                      fontSize: "var(--text-small)",
                      color: "var(--graphite)",
                      flexShrink: 0,
                    }}
                  >
                    →
                  </span>
                )}
              </article>
            );

            return isComingSoon ? (
              <div key={integration.slug} style={{ opacity: 0.6 }}>
                {card}
              </div>
            ) : (
              <Link
                key={integration.slug}
                href={`/merchant/integrations/${integration.slug}`}
                style={{ textDecoration: "none" }}
              >
                {card}
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
