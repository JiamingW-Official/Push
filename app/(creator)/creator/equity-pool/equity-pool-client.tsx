"use client";

// Creator Equity Pool — interactive client
// Push v5.1 · Two-Segment Creator Economics · Vertical AI for Local Commerce

import { useState, useMemo, type FormEvent } from "react";
import Link from "next/link";

/* ── Types ────────────────────────────────────────────────── */

type CreatorTier =
  | "seed"
  | "explorer"
  | "operator"
  | "proven"
  | "closer"
  | "partner";

type AllocationTier = "closer" | "partner";
type EquityStructure = "rsa" | "profit_share";

interface FormState {
  legalName: string;
  instagram: string;
  tiktok: string;
  youtube: string;
  taxId: string;
  requestedAllocation: AllocationTier;
  structure: EquityStructure;
  acknowledged: boolean;
}

interface FaqItem {
  q: string;
  a: string;
}

/* ── Mock account context (derived from auth in production) ── */

const MOCK_CURRENT_TIER: CreatorTier = "closer";
const MOCK_VERIFIED_CONVERSIONS_90D = 34;
const MOCK_DISCLOSURE_COMPLIANCE_RATE = 0.991;

const TIER_LABEL: Record<CreatorTier, string> = {
  seed: "T1 Seed",
  explorer: "T2 Explorer",
  operator: "T3 Operator",
  proven: "T4 Proven (Gold)",
  closer: "T5 Closer (Ruby)",
  partner: "T6 Partner (Obsidian)",
};

const ELIGIBLE_TIERS: CreatorTier[] = ["closer", "partner"];

/* ── Static content ───────────────────────────────────────── */

const TERMS_ROWS: Array<{
  tier: string;
  label: string;
  allocation: string;
  vest: string;
  cliff: string;
  perfGate: string;
}> = [
  {
    tier: "T5 Closer",
    label: "Ruby · 80K–250K followers",
    allocation: "0.02% per creator · cap top-100",
    vest: "4-year monthly",
    cliff: "1-year",
    perfGate: "Active after year 2 · tier retention required",
  },
  {
    tier: "T6 Partner",
    label: "Obsidian · 250K+ followers",
    allocation: "0.05%–0.20% per creator (negotiated)",
    vest: "4-year monthly",
    cliff: "1-year",
    perfGate: "Lock-up + ROFR · negotiated separately",
  },
];

const FAQ: FaqItem[] = [
  {
    q: "Why only T5 Closer and T6 Partner?",
    a: "The math: at $15–25 per verified customer and 10–30 customers per month, a Closer earns $150–750 monthly in per-customer economics — meaningful side income, but not enough to keep top creators committed. Retainer plus equity is how we hold onto the operators who drive the most verified conversions. Below T5, per-customer payouts plus tier bonuses are sufficient and equity dilution is not justified.",
  },
  {
    q: "What happens if I drop below T5 Closer after signup?",
    a: "The performance gate triggers after year 2 of vesting. If your rolling 90-day tier falls below T5 Closer for two consecutive quarters, unvested shares return to the equity pool. Already-vested shares remain yours, subject to the lock-up and right-of-first-refusal provisions in your grant agreement.",
  },
  {
    q: "Can I sell my vested shares?",
    a: "Not freely. Vested shares are subject to a standard lock-up through IPO or change-of-control, and Push holds a right-of-first-refusal (ROFR) on any proposed secondary transfer. During tender offers or secondary rounds (if offered), you may be able to sell a portion subject to company approval. This is private company equity — illiquid by design until a liquidity event.",
  },
  {
    q: "What are the tax implications?",
    a: "RSAs typically trigger ordinary income tax on the fair market value at vesting unless you file an 83(b) election within 30 days of grant. An 83(b) election shifts taxation to the grant date (usually when FMV is low) and converts future gains to long-term capital gains if held more than one year from grant. Tax treatment varies with your state and situation — consult your own tax advisor. Push does not provide tax advice.",
  },
  {
    q: "What is the profit-share alternative?",
    a: "If Delaware RSA structure is unavailable to you (international creator, entity structure issues, or timing), we offer a profit-share agreement as a non-equity alternative: a percentage of revenue from merchants you personally referred, for a 12-month window from first customer attribution, capped at $500 per month per merchant. This is not equity, does not vest, and terminates if you leave the program. It is a contractual payment stream, not ownership.",
  },
];

const TIMELINE: Array<{ when: string; what: string; detail: string }> = [
  {
    when: "Day 0",
    what: "Application submitted",
    detail:
      "You complete this form. External counsel receives your intake packet within 24 hours.",
  },
  {
    when: "10 business days",
    what: "Counsel outreach",
    detail:
      "Push external counsel reaches out to verify eligibility, review your tier history, and confirm your equity structure election.",
  },
  {
    when: "30 days",
    what: "Final documents to DocuSign",
    detail:
      "Grant agreement, RSA (or profit-share) terms, 83(b) election template, and tax advisor disclosure — routed via DocuSign.",
  },
  {
    when: "30 days from grant",
    what: "83(b) election filing deadline",
    detail:
      "If you elect 83(b), filing must be postmarked to the IRS within 30 days of the grant date. Push counsel provides the template; filing is your responsibility.",
  },
  {
    when: "Grant date",
    what: "Vesting clock starts",
    detail:
      "4-year monthly vesting with 1-year cliff. Performance gate activates at month 24.",
  },
];

/* ── Helpers ──────────────────────────────────────────────── */

const CURRENT_TIER_ELIGIBLE = ELIGIBLE_TIERS.includes(MOCK_CURRENT_TIER);
const DISCLOSURE_COMPLIANT = MOCK_DISCLOSURE_COMPLIANCE_RATE >= 0.98;
const HAS_VERIFIED_CONVERSIONS = MOCK_VERIFIED_CONVERSIONS_90D > 0;
const FULLY_ELIGIBLE =
  CURRENT_TIER_ELIGIBLE && DISCLOSURE_COMPLIANT && HAS_VERIFIED_CONVERSIONS;

function pct(n: number): string {
  return (n * 100).toFixed(1) + "%";
}

/* ── Component ────────────────────────────────────────────── */

export default function EquityPoolClient() {
  const [form, setForm] = useState<FormState>({
    legalName: "",
    instagram: "",
    tiktok: "",
    youtube: "",
    taxId: "",
    requestedAllocation: "closer",
    structure: "rsa",
    acknowledged: false,
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const canSubmit = useMemo(() => {
    return (
      FULLY_ELIGIBLE &&
      form.legalName.trim().length > 0 &&
      (form.instagram.trim().length > 0 ||
        form.tiktok.trim().length > 0 ||
        form.youtube.trim().length > 0) &&
      form.taxId.trim().length > 0 &&
      form.acknowledged &&
      !submitting
    );
  }, [form, submitting]);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    if (!FULLY_ELIGIBLE) {
      setError(
        "You are not currently eligible. Resolve eligibility issues above before applying.",
      );
      return;
    }

    if (!form.legalName.trim()) {
      setError("Legal name is required for 1099 + 83(b) filing.");
      return;
    }
    if (!form.instagram.trim() && !form.tiktok.trim() && !form.youtube.trim()) {
      setError("At least one creator handle is required.");
      return;
    }
    if (!form.taxId.trim()) {
      setError("SSN or EIN is required for 1099 + 83(b) filing.");
      return;
    }
    if (!form.acknowledged) {
      setError(
        "You must acknowledge vesting, cliff, performance gating, and tax implications.",
      );
      return;
    }

    setSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1200));
    setSubmitting(false);
    setSubmitted(true);
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  return (
    <div className="eq-root">
      {/* ── Header ─────────────────────────────────────────── */}
      <header className="eq-header">
        <div className="eq-header-inner">
          <div className="eq-eyebrow">Push Creator Equity Pool</div>
          <h1 className="eq-title">
            T5 Closer + T6 Partner equity pool.
            <br />
            <em>Two-Segment Creator Economics.</em>
          </h1>
          <p className="eq-sub">
            Retainer and per-customer payouts keep the day-to-day running. For
            the operators delivering the most verified conversions across Push
            merchants, equity is how we stay aligned for the long run. This page
            is the intake.
          </p>

          <div className="eq-status-row" role="status">
            <div className="eq-status-cell">
              <div className="eq-status-label">Your tier</div>
              <div className="eq-status-value">
                {TIER_LABEL[MOCK_CURRENT_TIER]}
              </div>
            </div>
            <div className="eq-status-cell">
              <div className="eq-status-label">Eligibility</div>
              <div
                className={`eq-status-value ${
                  FULLY_ELIGIBLE
                    ? "eq-status-value--pos"
                    : "eq-status-value--neg"
                }`}
              >
                {FULLY_ELIGIBLE ? "Eligible" : "Not eligible"}
              </div>
            </div>
            <div className="eq-status-cell">
              <div className="eq-status-label">Verified (90d)</div>
              <div className="eq-status-value">
                {MOCK_VERIFIED_CONVERSIONS_90D}
              </div>
            </div>
            <div className="eq-status-cell">
              <div className="eq-status-label">DisclosureBot</div>
              <div
                className={`eq-status-value ${
                  DISCLOSURE_COMPLIANT
                    ? "eq-status-value--pos"
                    : "eq-status-value--neg"
                }`}
              >
                {pct(MOCK_DISCLOSURE_COMPLIANCE_RATE)}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* ── §1 What you're signing up for ─────────────────── */}
      <section className="eq-section">
        <div className="eq-section-number">
          §1 — What you are signing up for
        </div>
        <h2 className="eq-section-title">RSA terms, in plain English.</h2>
        <p className="eq-section-lead">
          Restricted Stock Award under Delaware corporate law. Standard
          four-year vesting with a one-year cliff. Performance gate activates at
          month 24. Below are the per-tier allocations authorized under the
          current equity pool charter.
        </p>

        <table className="eq-table">
          <thead>
            <tr>
              <th>Tier</th>
              <th>Allocation</th>
              <th>Vesting</th>
              <th>Cliff</th>
              <th>Performance gate</th>
            </tr>
          </thead>
          <tbody>
            {TERMS_ROWS.map((row) => (
              <tr key={row.tier}>
                <td className="eq-tier-cell">
                  {row.tier}
                  <span>{row.label}</span>
                </td>
                <td>{row.allocation}</td>
                <td>{row.vest}</td>
                <td>{row.cliff}</td>
                <td>{row.perfGate}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="eq-table-alt">
          <strong>Alternative: profit-share agreement</strong>
          If Delaware RSA structure is unavailable to you (international
          residency, entity issues, timing), we offer a non-equity profit-share
          instead: a percentage of revenue from merchants you personally
          referred, over a 12-month window per merchant, capped at $500 per
          month per merchant. Contractual payment stream, not ownership.
        </div>
      </section>

      {/* ── §2 Eligibility check ──────────────────────────── */}
      <section className="eq-section">
        <div className="eq-section-number">§2 — Eligibility check</div>
        <h2 className="eq-section-title">Three gates, all automatic.</h2>
        <p className="eq-section-lead">
          Your account state is evaluated in real time. If any gate fails, the
          signup form below is blocked until it is resolved.
        </p>

        <div className="eq-elig-list">
          <div className="eq-elig-item">
            <div
              className={`eq-elig-dot ${
                CURRENT_TIER_ELIGIBLE
                  ? "eq-elig-dot--pass"
                  : "eq-elig-dot--fail"
              }`}
            >
              {CURRENT_TIER_ELIGIBLE ? "\u2713" : "\u00D7"}
            </div>
            <div className="eq-elig-text">
              Current tier is T5 Closer or T6 Partner
              <span>
                Your tier: {TIER_LABEL[MOCK_CURRENT_TIER]}. T4 Proven and below
                are not eligible for the equity pool — retainer plus performance
                payouts only.
              </span>
            </div>
            <div
              className={`eq-elig-badge ${
                CURRENT_TIER_ELIGIBLE
                  ? "eq-elig-badge--pass"
                  : "eq-elig-badge--fail"
              }`}
            >
              {CURRENT_TIER_ELIGIBLE ? "Pass" : "Blocked"}
            </div>
          </div>

          <div className="eq-elig-item">
            <div
              className={`eq-elig-dot ${
                HAS_VERIFIED_CONVERSIONS
                  ? "eq-elig-dot--pass"
                  : "eq-elig-dot--fail"
              }`}
            >
              {HAS_VERIFIED_CONVERSIONS ? "\u2713" : "\u00D7"}
            </div>
            <div className="eq-elig-text">
              Verified conversion history in last 90 days
              <span>
                {MOCK_VERIFIED_CONVERSIONS_90D} verified conversions recorded.
                AI verification (Claude Vision + OCR + geo) must clear each one
                before it counts.
              </span>
            </div>
            <div
              className={`eq-elig-badge ${
                HAS_VERIFIED_CONVERSIONS
                  ? "eq-elig-badge--pass"
                  : "eq-elig-badge--fail"
              }`}
            >
              {HAS_VERIFIED_CONVERSIONS ? "Pass" : "Blocked"}
            </div>
          </div>

          <div className="eq-elig-item">
            <div
              className={`eq-elig-dot ${
                DISCLOSURE_COMPLIANT ? "eq-elig-dot--pass" : "eq-elig-dot--fail"
              }`}
            >
              {DISCLOSURE_COMPLIANT ? "\u2713" : "\u00D7"}
            </div>
            <div className="eq-elig-text">
              DisclosureBot compliance rate at or above 98%
              <span>
                Your rate: {pct(MOCK_DISCLOSURE_COMPLIANCE_RATE)}. Hard block at
                signup if under 98% — FTC disclosure integrity is a
                non-negotiable for equity holders.
              </span>
            </div>
            <div
              className={`eq-elig-badge ${
                DISCLOSURE_COMPLIANT
                  ? "eq-elig-badge--pass"
                  : "eq-elig-badge--fail"
              }`}
            >
              {DISCLOSURE_COMPLIANT ? "Pass" : "Blocked"}
            </div>
          </div>
        </div>
      </section>

      {/* ── §3 Application form (or success) ──────────────── */}
      <section className="eq-section">
        <div className="eq-section-number">§3 — Application</div>
        <h2 className="eq-section-title">
          {submitted ? "Submitted. Legal review begins." : "Signup intake."}
        </h2>

        {submitted ? (
          <div className="eq-success" role="status" aria-live="polite">
            <div className="eq-success-mark" aria-hidden="true">
              {"\u2713"}
            </div>
            <h3 className="eq-success-title">
              Your application is in the queue.
            </h3>
            <p className="eq-success-body">
              Legal review begins. External counsel will reach you within 10
              business days. All further steps — final documents, 83(b) filing
              template, and grant date confirmation — arrive via the email on
              file.
            </p>
            <div className="eq-success-cta">
              <Link
                href="/creator/dashboard"
                className="eq-btn eq-btn--primary"
              >
                Back to dashboard
              </Link>
              <Link href="/trust/disclosure" className="eq-btn">
                FTC disclosure policy
              </Link>
            </div>
          </div>
        ) : (
          <form className="eq-form" onSubmit={handleSubmit} noValidate>
            <div className="eq-form-grid">
              <div className="eq-field eq-field--full">
                <label className="eq-label" htmlFor="eq-legal-name">
                  Legal name
                  <span className="eq-label-note">
                    Must match SSN/EIN for tax filing
                  </span>
                </label>
                <input
                  id="eq-legal-name"
                  className="eq-input"
                  type="text"
                  autoComplete="name"
                  placeholder="Full legal name"
                  value={form.legalName}
                  onChange={(e) => update("legalName", e.target.value)}
                  disabled={!FULLY_ELIGIBLE}
                  required
                />
              </div>

              <div className="eq-field eq-field--full">
                <label className="eq-label">
                  Creator handles
                  <span className="eq-label-note">At least one required</span>
                </label>
                <div className="eq-handles">
                  <div className="eq-handle-field">
                    <span className="eq-handle-field-label">Instagram</span>
                    <input
                      className="eq-input"
                      type="text"
                      placeholder="@handle"
                      value={form.instagram}
                      onChange={(e) => update("instagram", e.target.value)}
                      disabled={!FULLY_ELIGIBLE}
                    />
                  </div>
                  <div className="eq-handle-field">
                    <span className="eq-handle-field-label">TikTok</span>
                    <input
                      className="eq-input"
                      type="text"
                      placeholder="@handle"
                      value={form.tiktok}
                      onChange={(e) => update("tiktok", e.target.value)}
                      disabled={!FULLY_ELIGIBLE}
                    />
                  </div>
                  <div className="eq-handle-field">
                    <span className="eq-handle-field-label">YouTube</span>
                    <input
                      className="eq-input"
                      type="text"
                      placeholder="@channel"
                      value={form.youtube}
                      onChange={(e) => update("youtube", e.target.value)}
                      disabled={!FULLY_ELIGIBLE}
                    />
                  </div>
                </div>
              </div>

              <div className="eq-field">
                <label className="eq-label" htmlFor="eq-tax-id">
                  SSN or EIN
                  <span className="eq-label-note">For 1099 + 83(b)</span>
                </label>
                <input
                  id="eq-tax-id"
                  className="eq-input"
                  type="text"
                  inputMode="numeric"
                  placeholder="XXX-XX-XXXX or XX-XXXXXXX"
                  value={form.taxId}
                  onChange={(e) => update("taxId", e.target.value)}
                  disabled={!FULLY_ELIGIBLE}
                  required
                />
              </div>

              <div className="eq-field">
                <label className="eq-label" htmlFor="eq-current-tier">
                  Current tier
                  <span className="eq-label-note">Derived from account</span>
                </label>
                <input
                  id="eq-current-tier"
                  className="eq-input eq-input--readonly"
                  type="text"
                  value={TIER_LABEL[MOCK_CURRENT_TIER]}
                  readOnly
                  tabIndex={-1}
                />
              </div>

              <div className="eq-field eq-field--full">
                <label className="eq-label">Requested allocation tier</label>
                <div className="eq-radio-group">
                  {(["closer", "partner"] as const).map((option) => {
                    const checked = form.requestedAllocation === option;
                    return (
                      <label
                        key={option}
                        className={`eq-radio ${
                          checked ? "eq-radio--checked" : ""
                        }`}
                      >
                        <input
                          type="radio"
                          name="allocation"
                          value={option}
                          checked={checked}
                          onChange={() => update("requestedAllocation", option)}
                          disabled={!FULLY_ELIGIBLE}
                        />
                        <div className="eq-radio-title">
                          {option === "closer"
                            ? "T5 Closer allocation"
                            : "T6 Partner allocation"}
                        </div>
                        <div className="eq-radio-sub">
                          {option === "closer"
                            ? "0.02% per creator · cap top-100 · 4-yr vest · 1-yr cliff · perf gate after year 2"
                            : "0.05%–0.20% per creator · negotiated · lock-up + ROFR · 4-yr vest · 1-yr cliff"}
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="eq-field eq-field--full">
                <label className="eq-label">Equity preference</label>
                <div className="eq-radio-group">
                  {(["rsa", "profit_share"] as const).map((option) => {
                    const checked = form.structure === option;
                    return (
                      <label
                        key={option}
                        className={`eq-radio ${
                          checked ? "eq-radio--checked" : ""
                        }`}
                      >
                        <input
                          type="radio"
                          name="structure"
                          value={option}
                          checked={checked}
                          onChange={() => update("structure", option)}
                          disabled={!FULLY_ELIGIBLE}
                        />
                        <div className="eq-radio-title">
                          {option === "rsa"
                            ? "RSA (Restricted Stock Award)"
                            : "Profit-share (non-equity)"}
                        </div>
                        <div className="eq-radio-sub">
                          {option === "rsa"
                            ? "Delaware corp law · 83(b) election window · ordinary shares subject to vesting"
                            : "12-month window per referred merchant · $500/mo cap · contractual payment, not ownership"}
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="eq-field eq-field--full">
                <label
                  className={`eq-ack ${
                    form.acknowledged ? "eq-ack--checked" : ""
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={form.acknowledged}
                    onChange={(e) => update("acknowledged", e.target.checked)}
                    disabled={!FULLY_ELIGIBLE}
                  />
                  <span className="eq-ack-text">
                    I understand vesting, cliff, performance gating, and tax
                    implications of this grant. I will consult my own tax
                    advisor — Push does not provide tax advice. I accept that
                    this is private-company equity, illiquid until a liquidity
                    event, and subject to lock-up and ROFR.
                  </span>
                </label>
              </div>
            </div>

            {error && (
              <div className="eq-form-error" role="alert">
                {error}
              </div>
            )}

            <div className="eq-submit-row">
              <span className="eq-submit-note">
                Final terms are set by counsel after review.
              </span>
              <button className="eq-submit" type="submit" disabled={!canSubmit}>
                {submitting && (
                  <span className="eq-spinner" aria-hidden="true" />
                )}
                {submitting ? "Submitting" : "Submit application"}
              </button>
            </div>
          </form>
        )}
      </section>

      {/* ── §4 Timeline ───────────────────────────────────── */}
      <section className="eq-section">
        <div className="eq-section-number">§4 — Timeline</div>
        <h2 className="eq-section-title">What happens after you submit.</h2>

        <div className="eq-timeline">
          {TIMELINE.map((step) => (
            <div className="eq-timeline-step" key={step.when}>
              <div className="eq-timeline-when">{step.when}</div>
              <div className="eq-timeline-what">{step.what}</div>
              <div className="eq-timeline-detail">{step.detail}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── §5 FAQ ────────────────────────────────────────── */}
      <section className="eq-section">
        <div className="eq-section-number">§5 — Questions</div>
        <h2 className="eq-section-title">The five asks we get most.</h2>

        <div className="eq-faq-list">
          {FAQ.map((item, idx) => {
            const open = openFaq === idx;
            return (
              <div className="eq-faq-item" key={item.q}>
                <button
                  type="button"
                  className={`eq-faq-toggle ${
                    open ? "eq-faq-toggle--open" : ""
                  }`}
                  onClick={() => setOpenFaq(open ? null : idx)}
                  aria-expanded={open}
                >
                  <span>{item.q}</span>
                  <span className="eq-faq-plus" aria-hidden="true">
                    +
                  </span>
                </button>
                {open && <div className="eq-faq-body">{item.a}</div>}
              </div>
            );
          })}
        </div>
      </section>

      {/* ── Footer CTA ────────────────────────────────────── */}
      <div className="eq-footer-cta">
        <div className="eq-footer-cta-inner">
          <div>
            <h3 className="eq-footer-cta-title">
              Equity is the tail. Disclosure is the spine.
            </h3>
            <p className="eq-footer-cta-sub">
              Every Push creator operates under FTC #ad disclosure rules.
              DisclosureBot audits every post. Drop below 98% compliance and the
              equity pool is off the table.
            </p>
          </div>
          <Link href="/trust/disclosure" className="eq-footer-cta-btn">
            Read disclosure policy
          </Link>
        </div>
      </div>
    </div>
  );
}
