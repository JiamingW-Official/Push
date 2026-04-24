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
} as const;

export type BrandTokens = typeof BRAND;
