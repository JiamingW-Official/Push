/**
 * Push email templates — v5.3-EXEC P0-4.
 *
 * Plain-string HTML templates with `${var}` interpolation. Matches the
 * Design.md palette (Flag Red + Pearl Stone + Darky / CS Genio Mono
 * fallbacks — emails render without our webfonts so we use
 * Helvetica / Courier substitutes).
 *
 * Each template exports:
 *   - subject(vars): string            — email subject line
 *   - html(vars): string               — HTML body
 *   - text(vars): string               — plain-text fallback
 * This matches the signature that Resend's `resend.emails.send` accepts.
 */

import { createHash } from "node:crypto";

export type TemplateKey =
  | "merchant_welcome"
  | "creator_welcome"
  | "privacy_request_received"
  | "dispute_notify"
  | "dsar_response";

interface TemplateSpec<V> {
  subject(vars: V): string;
  html(vars: V): string;
  text(vars: V): string;
  varsShapeHash(): string;
}

function makeTemplate<V extends object>(
  spec: Omit<TemplateSpec<V>, "varsShapeHash"> & { sampleVars: V },
): TemplateSpec<V> {
  return {
    subject: spec.subject,
    html: spec.html,
    text: spec.text,
    varsShapeHash: () =>
      createHash("sha256")
        .update(Object.keys(spec.sampleVars).sort().join(","))
        .digest("hex")
        .slice(0, 12),
  };
}

const baseStyles = `
  body { font-family: Helvetica, Arial, sans-serif; color: #003049; background: #f5f2ec; margin: 0; padding: 24px; }
  .wrap { max-width: 560px; margin: 0 auto; background: #ffffff; border: 1px solid #003049; }
  .hdr { background: #c1121f; color: #ffffff; padding: 20px 28px; font-weight: 800; letter-spacing: 0.02em; }
  .body { padding: 28px; font-size: 15px; line-height: 1.6; }
  .body h1 { font-size: 22px; letter-spacing: -0.02em; margin: 0 0 16px; color: #003049; }
  .cta { display: inline-block; margin-top: 18px; padding: 14px 24px; background: #c1121f; color: #ffffff; text-decoration: none; font-weight: 700; letter-spacing: 0.04em; }
  .foot { padding: 20px 28px; font-size: 12px; color: #669bbc; border-top: 1px solid #f5f2ec; font-family: 'Courier New', Courier, monospace; }
`;

function shell(
  title: string,
  inner: string,
  ctaHref?: string,
  ctaText?: string,
) {
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><style>${baseStyles}</style></head><body><div class="wrap"><div class="hdr">PUSH</div><div class="body"><h1>${title}</h1>${inner}${
    ctaHref
      ? `<a class="cta" href="${ctaHref}">${ctaText ?? "Continue"}</a>`
      : ""
  }</div><div class="foot">Push NYC, Inc. · 28 West 23rd St, New York, NY 10010 · Unsubscribe in your account settings.</div></div></body></html>`;
}

// ─────────────────────────────────────────────────────────────────────────────

export const merchant_welcome = makeTemplate<{
  merchant_name: string;
  onboarding_url: string;
}>({
  sampleVars: { merchant_name: "", onboarding_url: "" },
  subject: (v) => `Welcome to Push, ${v.merchant_name}`,
  html: (v) =>
    shell(
      `Welcome, ${v.merchant_name}.`,
      `<p>Your Push merchant account is active. You can now create campaigns, print QR posters, and track verified foot-traffic in real time.</p><p>Your first campaign is the most important — pick a single best-selling item and we'll match creators who already shop your category.</p>`,
      v.onboarding_url,
      "Open onboarding",
    ),
  text: (v) =>
    `Welcome, ${v.merchant_name}.\n\nYour Push merchant account is active. Continue: ${v.onboarding_url}`,
});

export const creator_welcome = makeTemplate<{
  creator_handle: string;
  dashboard_url: string;
  tier: string;
}>({
  sampleVars: { creator_handle: "", dashboard_url: "", tier: "" },
  subject: (v) => `@${v.creator_handle} — you're approved on Push`,
  html: (v) =>
    shell(
      `Welcome, @${v.creator_handle}.`,
      `<p>Your Push creator application cleared review. You've been placed at <strong>${v.tier}</strong> based on your first 30-day window.</p><p>Three things to do this week: (1) skim the campaign map, (2) apply to one merchant in your category, (3) add your W-9 so we can pay you when you earn.</p>`,
      v.dashboard_url,
      "Open dashboard",
    ),
  text: (v) =>
    `Welcome, @${v.creator_handle}. Starting tier: ${v.tier}. Dashboard: ${v.dashboard_url}`,
});

export const privacy_request_received = makeTemplate<{
  ticket_id: string;
  due_at_iso: string;
  request_type: string;
}>({
  sampleVars: { ticket_id: "", due_at_iso: "", request_type: "" },
  subject: () => `Your Push privacy request — confirmation`,
  html: (v) =>
    shell(
      `We received your ${v.request_type} request.`,
      `<p>Ticket: <code>${v.ticket_id}</code>. We confirm receipt within 10 business days and resolve within the statutory window. Expected by: <strong>${v.due_at_iso.slice(0, 10)}</strong>.</p><p>If the account associated with this email was created in California, your request is protected by CCPA § 1798.100 et seq. Elsewhere in the US we honor the same process.</p>`,
    ),
  text: (v) =>
    `Ticket ${v.ticket_id} received. Due by ${v.due_at_iso}. Type: ${v.request_type}.`,
});

export const dispute_notify = makeTemplate<{
  party: "creator" | "merchant";
  dispute_id: string;
  campaign_title: string;
  respond_url: string;
}>({
  sampleVars: {
    party: "creator",
    dispute_id: "",
    campaign_title: "",
    respond_url: "",
  },
  subject: (v) => `Dispute opened — ${v.campaign_title}`,
  html: (v) =>
    shell(
      `A dispute has been opened.`,
      `<p>A dispute was filed concerning the campaign <strong>${v.campaign_title}</strong>. You're receiving this because you were the ${v.party} of record on the affected transaction.</p><p>We honor a 72-hour response window. If no response is received we resolve on the available evidence.</p>`,
      v.respond_url,
      "Respond to dispute",
    ),
  text: (v) =>
    `Dispute ${v.dispute_id} opened on "${v.campaign_title}". Respond within 72h: ${v.respond_url}`,
});

export const dsar_response = makeTemplate<{
  ticket_id: string;
  resolution:
    | "access"
    | "deletion"
    | "correction"
    | "opt_out_of_sale"
    | "other";
  download_url?: string;
}>({
  sampleVars: { ticket_id: "", resolution: "access" },
  subject: () => `Your Push data-rights request — completed`,
  html: (v) =>
    shell(
      `Request ${v.ticket_id} is complete.`,
      `<p>We have completed your <strong>${v.resolution}</strong> request. ${
        v.download_url
          ? `A one-time download link is below — valid for 7 days.`
          : `No file attachment accompanies this resolution.`
      }</p>`,
      v.download_url,
      v.download_url ? "Download your data" : undefined,
    ),
  text: (v) =>
    `Ticket ${v.ticket_id} complete — ${v.resolution}. ${v.download_url ?? ""}`,
});

export const TEMPLATES = {
  merchant_welcome,
  creator_welcome,
  privacy_request_received,
  dispute_notify,
  dsar_response,
} as const;
