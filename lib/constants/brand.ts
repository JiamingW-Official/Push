// CENTRALIZED BRAND TOKENS. Future rebrand = change this file only.
// Do NOT inline-string brand name in pages/components — import from here.

export const BRAND = {
  name: "Push",
  legalName: "Push, Inc.",
  domain: "pushnyc.co",
  tagline: "The attribution rail for local commerce.",
  subTagline:
    "Creators post, customers scan at the register, merchants pay per verified store visit.",
  twitter: "@pushnyc",
  billingEmail: "billing@pushapp.co",
  billingAddress: {
    line1: "284 W Broadway",
    line2: null as string | null,
    city: "New York",
    state: "NY",
    postal: "10013",
  },
  // Printed on physical QR posters, table tents, stickers.
  posterTagline: "Verified attribution",
} as const;

export type BrandTokens = typeof BRAND;

// Convenience: one-line billing address for invoice footers.
export function formatBillingFooter(): string {
  const a = BRAND.billingAddress;
  const addr = [a.line1, a.line2, `${a.city}, ${a.state} ${a.postal}`]
    .filter(Boolean)
    .join(", ");
  return `${BRAND.legalName} · ${addr} · ${BRAND.billingEmail}`;
}
