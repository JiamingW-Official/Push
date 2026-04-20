"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  INTEGRATIONS,
  CATEGORY_LABELS,
  getFeaturedIntegrations,
  IntegrationCategory,
  Integration,
} from "@/lib/integrations/mock-integrations";
import "./integrations.css";

/* ── Logo placeholder ───────────────────────────────────────── */
function IntegrationLogo({
  integration,
  size = 48,
}: {
  integration: Integration;
  size?: number;
}) {
  const initials = integration.name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div
      className="int-card__logo"
      style={{
        width: size,
        height: size,
        background: integration.logoColor,
        color: integration.logoTextColor,
        fontSize: size * 0.38,
      }}
      aria-label={`${integration.name} logo`}
    >
      {initials}
    </div>
  );
}

/* ── Status badge ───────────────────────────────────────────── */
function StatusBadge({ status }: { status: Integration["status"] }) {
  const map = {
    available: { cls: "int-card__status--available", label: "Available" },
    connected: { cls: "int-card__status--connected", label: "Connected" },
    coming_soon: { cls: "int-card__status--coming-soon", label: "Coming soon" },
  };
  const { cls, label } = map[status];
  return <span className={`int-card__status ${cls}`}>{label}</span>;
}

/* ── Integration card ───────────────────────────────────────── */
function IntegrationCard({ integration }: { integration: Integration }) {
  const isComingSoon = integration.status === "coming_soon";

  const card = (
    <article
      className={`int-card ${isComingSoon ? "int-card--coming-soon" : ""}`}
    >
      <div className="int-card__top">
        <IntegrationLogo integration={integration} />
        <StatusBadge status={integration.status} />
      </div>

      <h3 className="int-card__name">{integration.name}</h3>
      <p className="int-card__description">{integration.description}</p>

      <ul className="int-card__benefits">
        {integration.benefits.map((b, i) => (
          <li key={i} className="int-card__benefit">
            {b}
          </li>
        ))}
      </ul>

      <div className="int-card__footer">
        <span className="int-card__category">
          {CATEGORY_LABELS[integration.category]}
        </span>
        {!isComingSoon && <span className="int-card__arrow">→</span>}
      </div>
    </article>
  );

  if (isComingSoon) return card;

  return (
    <Link
      href={`/merchant/integrations/${integration.slug}`}
      style={{ textDecoration: "none" }}
    >
      {card}
    </Link>
  );
}

/* ── Category tabs ──────────────────────────────────────────── */
const ALL_CATEGORY = "__all__";

function CategoryTabs({
  active,
  onChange,
}: {
  active: string;
  onChange: (cat: string) => void;
}) {
  const categories = [
    {
      key: ALL_CATEGORY,
      label: "All",
      count: INTEGRATIONS.length,
    },
    ...Object.entries(CATEGORY_LABELS).map(([key, label]) => ({
      key,
      label,
      count: INTEGRATIONS.filter((i) => i.category === key).length,
    })),
  ];

  return (
    <nav className="int-tabs" aria-label="Filter by category">
      <div className="int-tabs__inner">
        {categories.map((cat) => (
          <button
            key={cat.key}
            className={`int-tab ${active === cat.key ? "int-tab--active" : ""}`}
            onClick={() => onChange(cat.key)}
            aria-pressed={active === cat.key}
          >
            {cat.label}
            <span className="int-tab__count">{cat.count}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}

/* ── Featured carousel ──────────────────────────────────────── */
function FeaturedCarousel() {
  const featured = getFeaturedIntegrations();

  return (
    <section className="int-featured">
      <div className="int-featured__inner">
        <p className="int-featured__eyebrow">Featured</p>
        <h2 className="int-featured__heading">Popular integrations</h2>

        <div className="int-featured__track-wrapper">
          <div className="int-featured__track">
            {featured.map((integration) => {
              const initials = integration.name
                .split(" ")
                .map((w) => w[0])
                .join("")
                .slice(0, 2)
                .toUpperCase();

              return (
                <Link
                  key={integration.slug}
                  href={`/merchant/integrations/${integration.slug}`}
                  className="int-featured-card"
                >
                  <div
                    className="int-featured-card__logo"
                    style={{
                      background: integration.logoColor,
                      color: integration.logoTextColor,
                    }}
                  >
                    {initials}
                  </div>
                  <h3 className="int-featured-card__name">
                    {integration.name}
                  </h3>
                  <p className="int-featured-card__tagline">
                    {integration.tagline}
                  </p>
                  <span className="int-featured-card__link">
                    View integration →
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Can't find it CTA ──────────────────────────────────────── */
function CannotFindCta() {
  return (
    <section className="int-cta">
      <div className="int-cta__inner">
        <p className="int-cta__eyebrow">Missing something?</p>
        <h2 className="int-cta__heading">Can't find your tool?</h2>
        <p className="int-cta__body">
          Push connects to thousands of apps via Zapier — no code required. Or
          tell us what you need and we'll prioritize the next native
          integration.
        </p>
        <div className="int-cta__actions">
          <Link
            href="/merchant/integrations/zapier"
            className="int-btn int-btn--primary"
          >
            Use Zapier instead
          </Link>
          <Link href="/contact" className="int-btn int-btn--outline">
            Request an integration
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ── Page ───────────────────────────────────────────────────── */
export default function IntegrationsPage() {
  const [activeCategory, setActiveCategory] = useState(ALL_CATEGORY);

  const filtered = useMemo(() => {
    if (activeCategory === ALL_CATEGORY) return INTEGRATIONS;
    return INTEGRATIONS.filter((i) => i.category === activeCategory);
  }, [activeCategory]);

  const sectionLabel =
    activeCategory === ALL_CATEGORY
      ? "All integrations"
      : CATEGORY_LABELS[activeCategory as IntegrationCategory];

  return (
    <div className="int-shell">
      {/* Top nav */}
      <header className="int-nav">
        <Link href="/merchant/dashboard" className="int-nav__logo">
          Push<span>.</span>
        </Link>
        <div className="int-nav__center">
          <span className="int-nav__title">Integrations</span>
        </div>
        <div className="int-nav__right">
          <Link href="/merchant/dashboard" className="int-nav__back">
            ← Dashboard
          </Link>
        </div>
      </header>

      <main className="int-main">
        {/* Hero */}
        <section className="int-hero">
          <div className="int-hero__inner">
            <div>
              <p className="int-hero__eyebrow">Marketplace</p>
              <h1 className="int-hero__title">Integrations.</h1>
              <p className="int-hero__subtitle">
                Connect Push to the tools you already use. Sync data, automate
                workflows, and close the loop on creator campaign ROI.
              </p>
            </div>
            <div className="int-hero__stat">
              <span className="int-hero__stat-number">
                {INTEGRATIONS.length}
              </span>
              <span className="int-hero__stat-label">Integrations</span>
            </div>
          </div>
        </section>

        {/* Category tabs */}
        <CategoryTabs active={activeCategory} onChange={setActiveCategory} />

        {/* Grid */}
        <div className="int-grid-section">
          <div className="int-grid-section__header">
            <h2 className="int-grid-section__heading">{sectionLabel}</h2>
            <span className="int-grid-section__count">
              {filtered.length} integration{filtered.length !== 1 ? "s" : ""}
            </span>
          </div>

          {filtered.length === 0 ? (
            <p
              style={{
                color: "var(--text-muted)",
                fontSize: "var(--text-small)",
              }}
            >
              No integrations in this category yet.
            </p>
          ) : (
            <div className="int-grid">
              {filtered.map((integration) => (
                <IntegrationCard
                  key={integration.slug}
                  integration={integration}
                />
              ))}
            </div>
          )}
        </div>

        {/* Featured carousel */}
        <FeaturedCarousel />

        {/* CTA */}
        <CannotFindCta />
      </main>
    </div>
  );
}
