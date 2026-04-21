// Consumer consent-tier storage for scan flow.
// Mirrors /spec/consent-privacy-v1.md § 1 (three tiers) and § 9 (frontend
// contract: ConsentPicker writes here; scan + verify flow reads).
//
// Current implementation: localStorage, scoped per QR code so the
// consumer can hold different tier preferences per campaign without
// a global state conflict. When the real redemption handler ships,
// the captured tier is POSTed to the server together with the verify
// payload and written into push_transactions.consent_tier (see
// /spec/data-schema-v1.md § Compliance).

export type ConsentTier = 1 | 2 | 3;

const KEY_PREFIX = "push_consent_tier";

export function consentKey(qrId: string): string {
  return `${KEY_PREFIX}_${qrId}`;
}

export function getConsentTier(qrId: string): ConsentTier {
  if (typeof window === "undefined") return 2;
  const stored = window.localStorage.getItem(consentKey(qrId));
  if (stored === "1" || stored === "2" || stored === "3") {
    return Number(stored) as ConsentTier;
  }
  return 2; // spec § 2 default: Full Context recommended
}

export function setConsentTier(qrId: string, tier: ConsentTier): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(consentKey(qrId), String(tier));
}

export function hasChosenConsent(qrId: string): boolean {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem(consentKey(qrId)) !== null;
}
