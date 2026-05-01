"use client";

/* ============================================================
   Push — Merchant Integrations — v11 Product Register
   - canonical UPPERCASE eyebrow (no parenthetical)
   - liquid-glass stat tile (≤1 per page) shows connected count
   - integration card: surface-2 default, snow + brand-red top
     accent line on connected
   - 40×40 r-lg tile for third-party logo (brand colors preserved
     per § 2.5 — photos/SVG exempt from closed list)
   - status chip: 3 states from closed list
   - Filled Primary "Connect" / Ghost "Manage" on card link
   - Disconnect via secondary confirm dialog (Ghost trigger,
     Filled Primary confirm)
   - hover shift via transform; focus-visible outlines
   - empty state friendly copy
   ============================================================ */

import { useState, useMemo, useCallback } from "react";
import Link from "next/link";
import {
  INTEGRATIONS,
  CATEGORY_LABELS,
  getFeaturedIntegrations,
  IntegrationCategory,
  Integration,
} from "@/lib/integrations/mock-integrations";
import "./integrations.css";

/* -- Logo tile — 40×40 r-lg, third-party brand color preserved ------------------- */
function IntegrationLogo({ integration }: { integration: Integration }) {
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
        background: integration.logoColor,
        color: integration.logoTextColor,
      }}
      aria-label={`${integration.name} logo`}
    >
      {initials}
    </div>
  );
}

/* -- Status chip ------------------------------------------------------------------ */
function StatusChip({ status }: { status: Integration["status"] }) {
  const label =
    status === "coming_soon"
      ? "COMING SOON"
      : status === "connected"
        ? "CONNECTED"
        : "AVAILABLE";

  return (
    <span
      className={`int-status-chip int-status-chip--${status.replace("_", "-")}`}
    >
      <span className="int-status-chip__dot" aria-hidden="true" />
      {label}
    </span>
  );
}

/* -- Disconnect confirmation dialog (in-page modal) ------------------------------- */
function DisconnectConfirm({
  integration,
  onConfirm,
  onCancel,
}: {
  integration: Integration;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <div
      className="int-confirm-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="int-confirm-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onCancel();
      }}
    >
      <div className="int-confirm">
        <div className="int-confirm__eyebrow">CONFIRM</div>
        <h2 id="int-confirm-title" className="int-confirm__title">
          Disconnect {integration.name}?
        </h2>
        <p className="int-confirm__body">
          Push will stop syncing data from {integration.name}. Existing campaign
          attribution stays intact. You can reconnect any time.
        </p>
        <div className="int-confirm__actions">
          <button
            type="button"
            className="btn-ghost"
            onClick={onCancel}
            autoFocus
          >
            Cancel
          </button>
          <button type="button" className="btn-primary" onClick={onConfirm}>
            Disconnect
          </button>
        </div>
      </div>
    </div>
  );
}

/* -- Integration card ------------------------------------------------------------- */
function IntegrationCard({
  integration,
  onDisconnect,
}: {
  integration: Integration;
  onDisconnect: (i: Integration) => void;
}) {
  const isComingSoon = integration.status === "coming_soon";
  const isConnected = integration.status === "connected";

  const cardClasses = [
    "int-card",
    isConnected ? "int-card--connected" : "",
    isComingSoon ? "int-card--coming-soon" : "",
  ]
    .filter(Boolean)
    .join(" ");

  const cardInner = (
    <>
      <div className="int-card__top">
        <IntegrationLogo integration={integration} />
        <StatusChip status={integration.status} />
      </div>

      <div className="int-card__body">
        <h3 className="int-card__name">{integration.name}</h3>
        <p className="int-card__description">{integration.description}</p>
      </div>

      <ul className="int-card__benefits">
        {integration.benefits.map((b, i) => (
          <li key={i} className="int-card__benefit">
            <span className="int-card__benefit-arrow" aria-hidden="true">
              →
            </span>
            {b}
          </li>
        ))}
      </ul>

      {isConnected && (
        <div className="int-card__sync">
          <span className="int-card__sync-dot" aria-hidden="true" />
          Last synced 2 min ago
        </div>
      )}

      <div className="int-card__footer">
        <span className="int-card__category">
          {CATEGORY_LABELS[integration.category]}
        </span>
        {!isComingSoon && (
          <span
            className={`int-card__cta ${
              isConnected ? "int-card__cta--manage" : "int-card__cta--connect"
            }`}
          >
            {isConnected ? "Manage" : "Connect"}
            <span className="int-card__cta-arrow" aria-hidden="true">
              →
            </span>
          </span>
        )}
      </div>
    </>
  );

  // Coming soon — non-interactive presentation
  if (isComingSoon) {
    return (
      <div className={cardClasses} aria-disabled="true">
        {cardInner}
      </div>
    );
  }

  // Connected — Link wraps card; disconnect button is rendered alongside (outside link)
  if (isConnected) {
    return (
      <div className="int-card-wrap">
        <Link
          href={`/merchant/integrations/${integration.slug}`}
          className={cardClasses}
          aria-label={`Manage ${integration.name} integration`}
        >
          {cardInner}
        </Link>
        <button
          type="button"
          className="int-card__disconnect"
          onClick={() => onDisconnect(integration)}
          aria-label={`Disconnect ${integration.name}`}
        >
          Disconnect
        </button>
      </div>
    );
  }

  // Available — Link wraps card
  return (
    <Link
      href={`/merchant/integrations/${integration.slug}`}
      className={cardClasses}
      aria-label={`Connect ${integration.name} integration`}
    >
      {cardInner}
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
    <div
      className="int-tabs"
      role="tablist"
      aria-label="Integration categories"
    >
      {categories.map((cat) => (
        <button
          key={cat.key}
          type="button"
          role="tab"
          aria-pressed={active === cat.key}
          aria-selected={active === cat.key}
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
  if (featured.length === 0) return null;

  return (
    <section className="int-featured" aria-label="Featured integrations">
      <div className="int-featured__eyebrow">FEATURED</div>
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
              className="int-featured-item"
              aria-label={`Open ${integration.name}`}
            >
              <div
                className="int-featured-item__logo"
                style={{
                  background: integration.logoColor,
                  color: integration.logoTextColor,
                }}
                aria-hidden="true"
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
    </section>
  );
}

/* -- Page ------------------------------------------------------------------------- */
export default function IntegrationsPage() {
  const [activeCategory, setActiveCategory] = useState(ALL_CATEGORY);
  const [pendingDisconnect, setPendingDisconnect] =
    useState<Integration | null>(null);

  const filtered = useMemo(() => {
    if (activeCategory === ALL_CATEGORY) return INTEGRATIONS;
    return INTEGRATIONS.filter((i) => i.category === activeCategory);
  }, [activeCategory]);

  const sectionLabel =
    activeCategory === ALL_CATEGORY
      ? "All integrations"
      : CATEGORY_LABELS[activeCategory as IntegrationCategory];

  const connectedCount = useMemo(
    () => INTEGRATIONS.filter((i) => i.status === "connected").length,
    [],
  );

  const handleDisconnect = useCallback((i: Integration) => {
    setPendingDisconnect(i);
  }, []);

  const confirmDisconnect = useCallback(() => {
    // Mock data — real impl would call DELETE /api/merchant/integrations/:slug
    setPendingDisconnect(null);
  }, []);

  return (
    <div className="int-shell">
      {/* Sub-nav (Product chrome) */}
      <nav className="int-subnav" aria-label="Page navigation">
        <Link href="/merchant/dashboard" className="int-subnav__back">
          ← Dashboard
        </Link>
        <span className="int-subnav__label">INTEGRATIONS</span>
        <span className="int-subnav__spacer" aria-hidden="true" />
      </nav>

      <main className="int-main">
        {/* Page header — canonical eyebrow + liquid-glass stat tile */}
        <header className="int-header__inner">
          <div className="int-header__row">
            <div>
              <p className="int-header__eyebrow">CONNECTED TOOLS</p>
              <h1 className="int-header__title">Integrations</h1>
              <p className="int-header__subtitle">
                Connect Push to the tools you already use. Sync data, automate
                workflows, and close the loop on creator campaign ROI.
              </p>
            </div>
            <div
              className="int-header__stat-tile lg-surface"
              role="status"
              aria-label={`${connectedCount} of ${INTEGRATIONS.length} integrations connected`}
            >
              <div className="int-header__stat-row">
                <div className="int-header__stat-value">{connectedCount}</div>
                <div className="int-header__stat-divider">/</div>
                <div className="int-header__stat-total">
                  {INTEGRATIONS.length}
                </div>
              </div>
              <div className="int-header__stat-label">CONNECTED</div>
            </div>
          </div>
        </header>

        <FeaturedStrip />

        <CategoryTabs active={activeCategory} onChange={setActiveCategory} />

        <div className="int-section-header">
          <h2 className="int-section-heading">{sectionLabel}</h2>
          <span className="int-section-count">
            {filtered.length} integration{filtered.length !== 1 ? "s" : ""}
          </span>
        </div>

        {filtered.length === 0 ? (
          <div className="int-empty" role="status">
            <h3 className="int-empty__title">Nothing here yet</h3>
            <p className="int-empty__body">
              No integrations in this category right now. Try another category
              or request the tool you need below.
            </p>
          </div>
        ) : (
          <div className="int-grid">
            {filtered.map((integration) => (
              <IntegrationCard
                key={integration.slug}
                integration={integration}
                onDisconnect={handleDisconnect}
              />
            ))}
          </div>
        )}

        {/* Bottom CTA panel — Filled Primary + Ghost */}
        <section className="int-cta-panel" aria-label="Request an integration">
          <div className="int-cta-panel__eyebrow">MISSING SOMETHING</div>
          <h2 className="int-cta-panel__title">Can&apos;t find your tool?</h2>
          <p className="int-cta-panel__body">
            Push connects to thousands of apps via Zapier — no code required. Or
            tell us what you need and we&apos;ll prioritize the next native
            integration.
          </p>
          <div className="int-cta-panel__actions">
            <Link href="/merchant/integrations/zapier" className="btn-primary">
              Use Zapier
            </Link>
            <Link href="/contact" className="btn-ghost">
              Request integration
            </Link>
          </div>
        </section>
      </main>

      {pendingDisconnect && (
        <DisconnectConfirm
          integration={pendingDisconnect}
          onConfirm={confirmDisconnect}
          onCancel={() => setPendingDisconnect(null)}
        />
      )}
    </div>
  );
}
