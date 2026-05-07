import crypto from "crypto";

// Strip non-digits so "+1 (415) 555-0190" and "4155550190" hash identically.
export function normalizePhone(raw: string): string {
  return raw.replace(/[^0-9]/g, "");
}

// SHA-256 of normalized phone — never store raw numbers, only the hash.
export function hashPhone(normalized: string): string {
  return crypto.createHash("sha256").update(normalized).digest("hex");
}

export function phoneLastFour(normalized: string): string {
  return normalized.slice(-4);
}
