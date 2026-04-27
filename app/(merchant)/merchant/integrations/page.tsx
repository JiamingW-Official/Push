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

/* -- Integration logo placeholder ------------------------------------------------- */
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

/* -- Status chip ------------------------------------------------------------------ */
function StatusChip({ status }: { status: Integration["status"] }) {
  return (
    <span
      className={`int-status-chip int-status-chip--${status.replace("_", "-")}`}
    >
      {status === "coming_soon"
        ? "COMING SOON"
        : status === "connected"
          ? "CONNECTED"
          : "AVAILABLE"}
    </span>
  );
}

/* -- Integration card ------------------------------------------------------------- */
function IntegrationCard({ integration }: { integration: Integration }) {
  const isComingSoon = integration.status === "coming_soon";
  const isConnected = integration.status === "connected";

  const cardContent = (
    <div className={`int-card${isComingSoon ? " int-card--coming-soon" : ""}`}>
      <div className="int-card__top">
        <IntegrationLogo integration={integration} />
        <StatusChip status={integration.status} />
      </div>

      <div>
        <h3 className="int-card__name">{integration.name}</h3>
        <p className="int-card__description">{integration.description}</p>
      </div>

      <ul className="int-card__benefits">
        {integration.benefits.map((b, i) => (
          <li key={i} className="int-card__benefit">
            <span className="int-card__benefit-arrow">→</span>
            {b}
          </li>
        ))}
      </ul>

      <div className="int-card__footer">
        <span className="int-card__category">
          {CATEGORY_LABELS[integration.category]}
        </span>
        {!isComingSoon && (
          <span
            className={`int-card__cta ${isConnected ? "int-card__cta--manage" : "int-card__cta--connect"}`}
          >
            {isConnected ? "Manage →" : "Connect →"}
          </span>
        )}
      </div>
    </div>
  );

  if (isComingSoon) return cardContent;

  return (
    <Link
      href={`/merchant/integrations/${integration.slug}`}
      style={{ textDecoration: "none", display: "flex" }}
    >
      {cardContent}
    </Link>
  );
}

/* -- Category tabs ---------------------------------------------------------------- */
const ALL_CATEGORY = "__all__";

function CategoryTabs({
  active,
  onChange,
}: {
  active: string;
  onChange: (cat: string) => void;
}) {
  const categories = [
    { key: ALL_CATEGORY, label: "All", count: INTEGRATIONS.length },
    ...Object.entries(CATEGORY_LABELS).map(([key, label]) => ({
      key,
      label,
      count: INTEGRATIONS.filter((i) => i.category === key).length,
    })),
  ];

  return (
    <div className="int-tabs" role="tablist">
      {categories.map((cat) => (
        <button
          key={cat.key}
          role="tab"
          aria-pressed={active === cat.key}
          onClick={() => onChange(cat.key)}
          className="int-tab"
        >
          {cat.label}
          <span className="int-tab__count">{cat.count}</span>
        </button>
      ))}
    </div>
  );
}

/* -- Featured strip --------------------------------------------------------------- */
function FeaturedStrip() {
  const featured = getFeaturedIntegrations();

  return (
    <div className="int-featured">
      <div className="int-featured__eyebrow">Featured</div>
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
              className="int-featured-item click-shift"
            >
              <div
                className="int-featured-item__logo"
                style={{
                  background: integration.logoColor,
                  color: integration.logoTextColor,
                }}
              >
                {initials}
              </div>
              <span className="int-featured-item__name">
                {integration.name}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

/* -- Page ------------------------------------------------------------------------- */
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
      {/* Back nav */}
      <nav
        style={{
          padding: "12px 64px",
          borderBottom: "1px solid var(--hairline)",
          background: "var(--surface)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Link
          href="/merchant/dashboard"
          style={{
            fontFamily: "var(--font-body)",
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            color: "var(--ink-4)",
            textDecoration: "none",
          }}
        >
          ← Dashboard
        </Link>
        <span
          style={{
            fontFamily: "var(--font-display)",
            fontSize: 14,
            fontWeight: 700,
            color: "var(--ink-4)",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
          }}
        >
          Integrations
        </span>
        <div style={{ width: 80 }} />
      </nav>

      <main
        style={{ maxWidth: 1140, margin: "0 auto", padding: "40px 64px 96px" }}
      >
        {/* Page header */}
        <div className="int-header__inner" style={{ marginBottom: 40 }}>
          <div className="int-header__row">
            <div>
              <h1 className="int-header__title">Integrations</h1>
              <p className="int-header__subtitle">
                Connect Push to the tools you already use. Sync data, automate
                workflows, and close the loop on creator campaign ROI.
              </p>
            </div>
            <div className="int-header__stat-card">
              <div className="int-header__stat-value">
                {INTEGRATIONS.length}
              </div>
              <div className="int-header__stat-label">Integrations</div>
            </div>
          </div>
        </div>

        {/* Featured strip */}
        <FeaturedStrip />

        {/* Category filter */}
        <CategoryTabs active={activeCategory} onChange={setActiveCategory} />

        {/* Grid header */}
        <div className="int-section-header">
          <h2 className="int-section-heading">{sectionLabel}</h2>
          <span className="int-section-count">
            {filtered.length} integration{filtered.length !== 1 ? "s" : ""}
          </span>
        </div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <p
            style={{
              color: "var(--ink-4)",
              fontSize: 13,
              fontFamily: "var(--font-body)",
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

        {/* Bottom CTA panel */}
        <div className="int-cta-panel">
          <div className="int-cta-panel__eyebrow">Missing something?</div>
          <h2 className="int-cta-panel__title">Can&apos;t find your tool?</h2>
          <p className="int-cta-panel__body">
            Push connects to thousands of apps via Zapier — no code required. Or
            tell us what you need and we&apos;ll prioritize the next native
            integration.
          </p>
          <div className="int-cta-panel__actions">
            <Link
              href="/merchant/integrations/zapier"
              className="click-shift"
              style={{
                padding: "12px 24px",
                fontSize: 13,
                fontFamily: "var(--font-body)",
                fontWeight: 700,
                letterSpacing: "0.04em",
                textTransform: "uppercase",
                cursor: "pointer",
                borderRadius: 8,
                border: "none",
                background: "var(--brand-red)",
                color: "var(--snow)",
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                transition: "transform 180ms",
              }}
            >
              Use Zapier instead
            </Link>
            <Link
              href="/contact"
              className="click-shift"
              style={{
                padding: "12px 24px",
                fontSize: 13,
                fontFamily: "var(--font-body)",
                fontWeight: 700,
                letterSpacing: "0.04em",
                textTransform: "uppercase",
                cursor: "pointer",
                borderRadius: 8,
                border: "1px solid var(--hairline)",
                background: "transparent",
                color: "var(--ink)",
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                transition: "transform 180ms",
              }}
            >
              Request an integration
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
