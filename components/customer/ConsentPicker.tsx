"use client";

import { useState } from "react";
import Link from "next/link";
import styles from "./ConsentPicker.module.css";

// Stable per-browser ID used as the consent_events device key. Generated
// on first use, stored in localStorage so the same device = same hash.
function getDeviceId(): string {
  if (typeof window === "undefined") return "ssr-placeholder";
  const KEY = "push-device-id";
  const existing = window.localStorage.getItem(KEY);
  if (existing) return existing;
  const fresh =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2, 12)}`;
  window.localStorage.setItem(KEY, fresh);
  return fresh;
}

async function postConsentEvent(args: {
  prior: ConsentTier;
  next: ConsentTier;
}): Promise<void> {
  try {
    await fetch("/api/consent-event", {
      method: "POST",
      headers: { "content-type": "application/json" },
      // Fire-and-forget; the beacon API would be even cleaner but requires
      // a FormData payload, and our API route takes JSON.
      body: JSON.stringify({
        device_id: getDeviceId(),
        event_type: "tier_change",
        prior_tier: args.prior,
        new_tier: args.next,
        consent_version: "v1.0",
        source: "web",
      }),
      keepalive: true,
    });
  } catch {
    // Never surface audit failures to the consumer UI.
  }
}

export type ConsentTier = 1 | 2 | 3;

interface ConsentPickerProps {
  initialTier?: ConsentTier;
  onChange?: (tier: ConsentTier) => void;
  onDeclineAll?: () => void;
  onContinue?: (tier: ConsentTier) => void;
  /**
   * v5.3 minor-downgrade guard. When `true`, Tier 2 / Tier 3 become
   * unselectable and the effective tier is clamped to 1. COPPA/CCPA both
   * require that creators/operators not collect extra data from users
   * known to be under 18 without verifiable parental consent — we simply
   * refuse the extra tiers here rather than gating behind a parental
   * consent flow we don't yet operate.
   */
  minor?: boolean;
}

const TIER_OPTIONS: Array<{
  tier: ConsentTier;
  label: string;
  tagline: string;
  collects: string[];
  tradeoff: string;
}> = [
  {
    tier: 1,
    label: "Basic",
    tagline: "Attribution only",
    collects: [
      "Device anonymous ID (not IDFA)",
      "Claim + redeem time",
      "Order total (bucketed)",
    ],
    tradeoff:
      "We can't personalize future offers or show you which creators near you are best.",
  },
  {
    tier: 2,
    label: "Full Context",
    tagline: "Recommended",
    collects: [
      "+ GPS at claim and redeem",
      "+ Age bucket, gender, ZIP (3-digit)",
      "+ Product category, time-of-day, weather",
    ],
    tradeoff:
      "Better recommendations. Your data appears only in aggregated neighborhood reports (minimum 5 users per segment).",
  },
  {
    tier: 3,
    label: "Commercial",
    tagline: "+ $2 bonus, one time",
    collects: [
      "+ Cross-merchant visit history",
      "+ Product SKU (hashed)",
      "+ Ethnicity bucket (bias audit only, never shared)",
    ],
    tradeoff:
      "Unlocks enterprise + media licensing aggregates. Still always k >= 5 aggregation. One-time $2 extra discount.",
  },
];

export default function ConsentPicker({
  initialTier = 2,
  onChange,
  onDeclineAll,
  onContinue,
  minor = false,
}: ConsentPickerProps) {
  // When minor, force the effective tier to 1 regardless of the incoming
  // initialTier prop (which may be a restored localStorage value from when
  // the same device was used by an adult).
  const [tier, setTier] = useState<ConsentTier>(minor ? 1 : initialTier);

  const handleSelect = (newTier: ConsentTier) => {
    // Minor guard: silently clamp — the disabled attribute on the button
    // is the primary UX signal, this is the defensive server-safe floor.
    const clamped: ConsentTier = minor && newTier > 1 ? 1 : newTier;
    const prior = tier;
    setTier(clamped);
    onChange?.(clamped);
    // P0-SEC-4: fire-and-forget consent event so legal audit has the full
    // trail. Failures are logged but never block the UX — the picker is
    // the compliance primary source, email_log / consent_events is audit.
    void postConsentEvent({ prior, next: clamped });
  };

  const handleDeclineAll = () => {
    setTier(1);
    onChange?.(1);
    onDeclineAll?.();
  };

  return (
    <section className={styles.root} aria-labelledby="consent-picker-title">
      <header className={styles.header}>
        <p className={styles.eyebrow}>Your data choice</p>
        <h2 id="consent-picker-title" className={styles.title}>
          How much do we collect?
        </h2>
        <p className={styles.lede}>
          Push always logs the minimum needed for attribution. The rest is your
          call. You can change this anytime from your privacy settings.
        </p>
      </header>

      {minor && (
        <div
          style={{
            padding: "12px 16px",
            marginBottom: "24px",
            border: "2px solid var(--brand-red)",
            background: "rgba(193,18,31,0.06)",
            color: "var(--brand-red)",
            fontFamily: "var(--font-body)",
            fontSize: "13px",
            lineHeight: 1.5,
          }}
          role="note"
        >
          <strong>Under 18:</strong> your consent is locked to Tier 1 (basic
          attribution only). Tier 2 and Tier 3 will become available on your
          18th birthday. This is required by COPPA and CCPA for minors.
        </div>
      )}

      <div
        className={styles.options}
        role="radiogroup"
        aria-label="Consent tier selection"
      >
        {TIER_OPTIONS.map((opt) => {
          const selected = tier === opt.tier;
          const disabled = minor && opt.tier > 1;
          return (
            <button
              key={opt.tier}
              type="button"
              role="radio"
              aria-checked={selected}
              aria-disabled={disabled}
              disabled={disabled}
              onClick={() => handleSelect(opt.tier)}
              className={`${styles.option} ${
                selected ? styles.optionSelected : ""
              }`}
              style={
                disabled ? { opacity: 0.4, cursor: "not-allowed" } : undefined
              }
            >
              <div className={styles.optionHead}>
                <span className={styles.optionTier}>Tier {opt.tier}</span>
                <span className={styles.optionLabel}>{opt.label}</span>
                <span className={styles.optionTagline}>{opt.tagline}</span>
              </div>
              <ul className={styles.optionList}>
                {opt.collects.map((item) => (
                  <li key={item} className={styles.optionItem}>
                    {item}
                  </li>
                ))}
              </ul>
              <p className={styles.optionTradeoff}>{opt.tradeoff}</p>
            </button>
          );
        })}
      </div>

      <div className={styles.footer}>
        <Link href="/legal/privacy" className={styles.moreLink}>
          More info &rarr; full privacy policy
        </Link>
        <div className={styles.actions}>
          <button
            type="button"
            className={styles.declineBtn}
            onClick={handleDeclineAll}
          >
            Decline all extras
          </button>
          <button
            type="button"
            className={styles.continueBtn}
            onClick={() => onContinue?.(tier)}
          >
            Continue with Tier {tier}
          </button>
        </div>
      </div>
    </section>
  );
}
