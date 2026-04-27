"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CategoryPicker } from "@/components/merchant/campaign-wizard/CategoryPicker";
import { TierSelector } from "@/components/merchant/campaign-wizard/TierSelector";
import type { CreatorTier } from "@/components/merchant/campaign-wizard/TierSelector";
import "./campaign-new.css";

// ── Types ─────────────────────────────────────────────────────
type Step = 1 | 2 | 3 | 4;

type FormData = {
  // Step 1 — Basics
  name: string;
  category: string;
  description: string;
  // Step 2 — Budget & Tier
  budget: string;
  tier: string;
  commissionSplit: string;
  // Step 3 — Deliverables
  contentType: string;
  platform: string;
  dueDate: string;
};

type FormErrors = Partial<Record<keyof FormData, string>>;

const EMPTY: FormData = {
  name: "",
  category: "",
  description: "",
  budget: "",
  tier: "",
  commissionSplit: "70",
  contentType: "",
  platform: "",
  dueDate: "",
};

const STEP_LABELS: Record<Step, string> = {
  1: "Basics",
  2: "Budget",
  3: "Deliverables",
  4: "Review",
};

const CONTENT_TYPES = ["post", "video", "story"] as const;
const PLATFORMS = ["Instagram", "TikTok", "Red"] as const;

// ── Helpers ───────────────────────────────────────────────────
function todayISO(): string {
  return new Date().toISOString().split("T")[0];
}

function genId(): string {
  return `demo-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

// ── Step Indicator ────────────────────────────────────────────
function StepIndicator({ current }: { current: Step }) {
  return (
    <nav className="cn-steps" aria-label="Form steps">
      {([1, 2, 3, 4] as Step[]).map((n) => {
        const done = n < current;
        const active = n === current;
        return (
          <div
            key={n}
            className={[
              "cn-step",
              active ? "cn-step--active" : "",
              done ? "cn-step--done" : "",
            ]
              .filter(Boolean)
              .join(" ")}
            aria-current={active ? "step" : undefined}
          >
            <span className="cn-step__num" aria-hidden="true">
              {done ? (
                <svg
                  width="11"
                  height="9"
                  viewBox="0 0 11 9"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M1 4L4 7.5L10 1"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              ) : (
                n
              )}
            </span>
            <span className="cn-step__label">{STEP_LABELS[n]}</span>
          </div>
        );
      })}
    </nav>
  );
}

// ── Main Page ─────────────────────────────────────────────────
export default function CampaignNewPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>(1);
  const [form, setForm] = useState<FormData>(EMPTY);
  const [errors, setErrors] = useState<FormErrors>({});
  const [formError, setFormError] = useState("");
  const [loading, setLoading] = useState(false);

  function setField<K extends keyof FormData>(k: K, val: string) {
    setForm((f) => ({ ...f, [k]: val }));
    if (errors[k]) setErrors((e) => ({ ...e, [k]: undefined }));
  }

  function fieldProps<K extends keyof FormData>(k: K) {
    return {
      value: form[k],
      onChange: (
        e: React.ChangeEvent<
          HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >,
      ) => setField(k, e.target.value),
      className: errors[k] ? "cn-input--error" : undefined,
    };
  }

  // ── Validation ───────────────────────────────────────────────
  function validateStep(s: Step): FormErrors {
    const errs: FormErrors = {};

    if (s === 1) {
      if (!form.name.trim()) errs.name = "Campaign name is required.";
      else if (form.name.length > 80)
        errs.name = "Name must be 80 characters or fewer.";
      if (!form.category) errs.category = "Please select a category.";
      if (!form.description.trim())
        errs.description = "Description is required.";
      else if (form.description.length > 400)
        errs.description = "Description must be 400 characters or fewer.";
    }

    if (s === 2) {
      const budget = parseFloat(form.budget);
      if (!form.budget || isNaN(budget)) errs.budget = "Enter a budget amount.";
      else if (budget < 50) errs.budget = "Minimum budget is $50.";
      else if (budget > 50000) errs.budget = "Maximum budget is $50,000.";
      if (!form.tier) errs.tier = "Please select a creator tier.";
      const split = parseInt(form.commissionSplit, 10);
      if (isNaN(split) || split < 0 || split > 100)
        errs.commissionSplit = "Commission split must be 0–100%.";
    }

    if (s === 3) {
      if (!form.contentType) errs.contentType = "Select a content type.";
      if (!form.platform) errs.platform = "Select a platform.";
      if (!form.dueDate) errs.dueDate = "Set a due date.";
      else if (form.dueDate < todayISO())
        errs.dueDate = "Due date must be today or later.";
    }

    return errs;
  }

  function handleNext() {
    const errs = validateStep(step);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setErrors({});
    setStep((s) => (s < 4 ? ((s + 1) as Step) : s));
  }

  function handleBack() {
    setErrors({});
    setStep((s) => (s > 1 ? ((s - 1) as Step) : s));
  }

  // ── Submit ────────────────────────────────────────────────────
  async function handlePublish() {
    const allErrs = {
      ...validateStep(1),
      ...validateStep(2),
      ...validateStep(3),
    };
    if (Object.keys(allErrs).length > 0) {
      setErrors(allErrs);
      setFormError("Some fields need attention. Please review previous steps.");
      return;
    }

    setLoading(true);
    setFormError("");

    try {
      // Mock submit — write to localStorage
      const id = genId();
      const campaign = {
        id,
        title: form.name.trim(),
        category: form.category,
        description: form.description.trim(),
        budget: parseFloat(form.budget),
        tier: form.tier as CreatorTier,
        commissionSplit: parseInt(form.commissionSplit, 10),
        contentType: form.contentType,
        platform: form.platform,
        dueDate: form.dueDate,
        status: "active",
        createdAt: new Date().toISOString(),
        applications: 0,
        qrScans: 0,
      };

      const stored = localStorage.getItem("push-demo-campaigns");
      const list = stored ? JSON.parse(stored) : [];
      list.unshift(campaign);
      localStorage.setItem("push-demo-campaigns", JSON.stringify(list));

      // TODO: wire to Supabase via POST /api/merchant/campaigns

      router.push(`/merchant/campaigns/${id}`);
    } catch {
      setFormError("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  }

  // ── Render ────────────────────────────────────────────────────
  return (
    <div className="cn-page">
      <div className="cn-inner">
        {/* ── Page Header ──────────────────────────────────────── */}
        <div className="cn-page-header">
          <Link href="/merchant/dashboard" className="cn-back click-shift">
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M10 3L5 8L10 13"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Dashboard
          </Link>

          <div className="cn-header-title-row">
            <div>
              <p className="eyebrow">CAMPAIGN WIZARD</p>
              <h1 className="cn-title">New Campaign</h1>
            </div>
            <div className="cn-step-counter">
              <span className="cn-step-counter__current">{step}</span>
              <span className="cn-step-counter__sep">/</span>
              <span className="cn-step-counter__total">4</span>
            </div>
          </div>
        </div>

        <StepIndicator current={step} />

        {formError && (
          <div className="cn-form-error" role="alert">
            <span>{formError}</span>
            <button type="button" onClick={() => setFormError("")}>
              Dismiss
            </button>
          </div>
        )}

        {/* ── Layout: left rail + right form ───────────────────── */}
        <div className="cn-wizard-layout">
          {/* Left rail — step context */}
          <aside className="cn-wizard-rail candy-panel">
            <p
              className="eyebrow"
              style={{ color: "var(--ink-3)", marginBottom: 8 }}
            >
              STEP {step} OF 4
            </p>
            <h2 className="cn-rail-heading">{STEP_LABELS[step]}</h2>

            <div className="cn-rail-lines">
              {([1, 2, 3, 4] as Step[]).map((n) => (
                <div
                  key={n}
                  className={[
                    "cn-rail-line",
                    n === step ? "cn-rail-line--active" : "",
                    n < step ? "cn-rail-line--done" : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                />
              ))}
            </div>

            <p className="cn-rail-desc">
              {step === 1 &&
                "Name your campaign, pick a category, and describe what creators should do."}
              {step === 2 &&
                "Set your budget, target creator tier, and commission structure."}
              {step === 3 &&
                "Define content type, platform, and when it's due."}
              {step === 4 && "Review everything before going live."}
            </p>

            {/* Mini step list */}
            <ul className="cn-rail-step-list">
              {([1, 2, 3, 4] as Step[]).map((n) => (
                <li
                  key={n}
                  className={[
                    "cn-rail-step-item",
                    n === step ? "cn-rail-step-item--active" : "",
                    n < step ? "cn-rail-step-item--done" : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                >
                  <span className="cn-rail-step-dot" aria-hidden="true" />
                  {STEP_LABELS[n]}
                </li>
              ))}
            </ul>
          </aside>

          {/* Right — form panel */}
          <div className="cn-panel candy-panel">
            {/* ── Step 1: Basics ─────────────────────────────── */}
            <section
              className={`cn-step-section${step === 1 ? " cn-step-section--visible" : ""}`}
              aria-label="Step 1: Basics"
            >
              <div className="cn-section-header">
                <p className="eyebrow">STEP 1</p>
                <h2 className="cn-section-heading">Campaign Basics</h2>
              </div>

              {/* Campaign Name */}
              <div className="cn-field">
                <label className="cn-label" htmlFor="cw-name">
                  CAMPAIGN NAME
                </label>
                <input
                  id="cw-name"
                  type="text"
                  maxLength={80}
                  placeholder="e.g. Free Latte for Your First Post"
                  autoComplete="off"
                  {...fieldProps("name")}
                />
                <div className="cn-field-footer">
                  {errors.name ? (
                    <span className="cn-error-msg" role="alert">
                      {errors.name}
                    </span>
                  ) : (
                    <span />
                  )}
                  <span
                    className={`cn-char-counter${form.name.length > 72 ? " cn-char-counter--warn" : ""}`}
                  >
                    {form.name.length}/80
                  </span>
                </div>
              </div>

              {/* Category */}
              <div className="cn-field">
                <label className="cn-label">CATEGORY</label>
                <CategoryPicker
                  value={form.category}
                  onChange={(v) => setField("category", v)}
                  error={errors.category}
                />
              </div>

              {/* Description */}
              <div className="cn-field">
                <label className="cn-label" htmlFor="cw-desc">
                  DESCRIPTION
                </label>
                <textarea
                  id="cw-desc"
                  maxLength={400}
                  rows={4}
                  placeholder="What are you offering? What should creators post about?"
                  {...fieldProps("description")}
                />
                <div className="cn-field-footer">
                  {errors.description ? (
                    <span className="cn-error-msg" role="alert">
                      {errors.description}
                    </span>
                  ) : (
                    <span />
                  )}
                  <span
                    className={`cn-char-counter${form.description.length > 360 ? " cn-char-counter--warn" : ""}`}
                  >
                    {form.description.length}/400
                  </span>
                </div>
              </div>

              <div className="cn-nav cn-nav--end">
                <button
                  type="button"
                  className="btn-primary click-shift"
                  onClick={handleNext}
                >
                  Next: Budget &amp; Tier
                </button>
              </div>
            </section>

            {/* ── Step 2: Budget & Tier ───────────────────────── */}
            <section
              className={`cn-step-section${step === 2 ? " cn-step-section--visible" : ""}`}
              aria-label="Step 2: Budget and Tier"
            >
              <div className="cn-section-header">
                <p className="eyebrow">STEP 2</p>
                <h2 className="cn-section-heading">Budget &amp; Tier</h2>
              </div>

              {/* Budget */}
              <div className="cn-field">
                <label className="cn-label" htmlFor="cw-budget">
                  CAMPAIGN BUDGET
                </label>
                <div className="cn-input-prefix-wrap">
                  <span className="cn-input-prefix">$</span>
                  <input
                    id="cw-budget"
                    type="number"
                    min="50"
                    max="50000"
                    step="1"
                    placeholder="500"
                    style={{ paddingLeft: "32px" }}
                    {...fieldProps("budget")}
                  />
                </div>
                {errors.budget ? (
                  <span className="cn-error-msg" role="alert">
                    {errors.budget}
                  </span>
                ) : (
                  <span className="cn-field-hint">
                    Min $50 · Max $50,000 per campaign
                  </span>
                )}
              </div>

              {/* Commission Split */}
              <div className="cn-field">
                <label className="cn-label" htmlFor="cw-split">
                  CREATOR COMMISSION SPLIT
                </label>
                <div className="cn-split-row">
                  <input
                    id="cw-split"
                    type="range"
                    min="0"
                    max="100"
                    step="5"
                    value={form.commissionSplit}
                    onChange={(e) =>
                      setField("commissionSplit", e.target.value)
                    }
                    className="cn-range"
                  />
                  <span className="cn-split-value">
                    {form.commissionSplit}%
                  </span>
                </div>
                {errors.commissionSplit ? (
                  <span className="cn-error-msg" role="alert">
                    {errors.commissionSplit}
                  </span>
                ) : (
                  <div className="cn-split-summary">
                    <div className="cn-split-summary-item">
                      <span className="cn-split-summary-label">
                        CREATORS RECEIVE
                      </span>
                      <span className="cn-split-summary-value">
                        $
                        {form.budget
                          ? (
                              (parseFloat(form.budget) *
                                parseInt(form.commissionSplit, 10)) /
                              100
                            ).toFixed(0)
                          : "—"}
                      </span>
                    </div>
                    <div
                      className="cn-split-summary-divider"
                      aria-hidden="true"
                    />
                    <div className="cn-split-summary-item">
                      <span className="cn-split-summary-label">
                        PLATFORM RETAINS
                      </span>
                      <span className="cn-split-summary-value">
                        $
                        {form.budget
                          ? (
                              (parseFloat(form.budget) *
                                (100 - parseInt(form.commissionSplit, 10))) /
                              100
                            ).toFixed(0)
                          : "—"}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Creator Tier */}
              <div className="cn-field">
                <label className="cn-label">TARGET CREATOR TIER</label>
                <TierSelector
                  value={form.tier}
                  onChange={(v) => setField("tier", v)}
                  error={errors.tier}
                />
              </div>

              <div className="cn-nav">
                <button
                  type="button"
                  className="btn-ghost click-shift"
                  onClick={handleBack}
                >
                  Back
                </button>
                <button
                  type="button"
                  className="btn-primary click-shift"
                  onClick={handleNext}
                >
                  Next: Deliverables
                </button>
              </div>
            </section>

            {/* ── Step 3: Deliverables ──────────────────────────── */}
            <section
              className={`cn-step-section${step === 3 ? " cn-step-section--visible" : ""}`}
              aria-label="Step 3: Deliverables"
            >
              <div className="cn-section-header">
                <p className="eyebrow">STEP 3</p>
                <h2 className="cn-section-heading">Deliverables</h2>
              </div>

              {/* Content Type */}
              <div className="cn-field">
                <label className="cn-label">CONTENT TYPE</label>
                <div
                  className="cn-toggle-group"
                  role="group"
                  aria-label="Content type"
                >
                  {CONTENT_TYPES.map((ct) => (
                    <button
                      key={ct}
                      type="button"
                      className={[
                        "cn-toggle",
                        form.contentType === ct ? "cn-toggle--active" : "",
                      ]
                        .filter(Boolean)
                        .join(" ")}
                      onClick={() => setField("contentType", ct)}
                      aria-pressed={form.contentType === ct}
                    >
                      {capitalize(ct)}
                    </button>
                  ))}
                </div>
                {errors.contentType && (
                  <span className="cn-error-msg" role="alert">
                    {errors.contentType}
                  </span>
                )}
              </div>

              {/* Platform */}
              <div className="cn-field">
                <label className="cn-label">PLATFORM</label>
                <div
                  className="cn-toggle-group"
                  role="group"
                  aria-label="Platform"
                >
                  {PLATFORMS.map((p) => (
                    <button
                      key={p}
                      type="button"
                      className={[
                        "cn-toggle",
                        form.platform === p ? "cn-toggle--active" : "",
                      ]
                        .filter(Boolean)
                        .join(" ")}
                      onClick={() => setField("platform", p)}
                      aria-pressed={form.platform === p}
                    >
                      {p}
                    </button>
                  ))}
                </div>
                {errors.platform && (
                  <span className="cn-error-msg" role="alert">
                    {errors.platform}
                  </span>
                )}
              </div>

              {/* Due Date */}
              <div className="cn-field">
                <label className="cn-label" htmlFor="cw-due">
                  CONTENT DUE DATE
                </label>
                <input
                  id="cw-due"
                  type="date"
                  min={todayISO()}
                  {...fieldProps("dueDate")}
                />
                {errors.dueDate && (
                  <span className="cn-error-msg" role="alert">
                    {errors.dueDate}
                  </span>
                )}
              </div>

              <div className="cn-nav">
                <button
                  type="button"
                  className="btn-ghost click-shift"
                  onClick={handleBack}
                >
                  Back
                </button>
                <button
                  type="button"
                  className="btn-primary click-shift"
                  onClick={handleNext}
                >
                  Review Campaign
                </button>
              </div>
            </section>

            {/* ── Step 4: Review & Launch ───────────────────────── */}
            <section
              className={`cn-step-section${step === 4 ? " cn-step-section--visible" : ""}`}
              aria-label="Step 4: Review and Launch"
            >
              <div className="cn-section-header">
                <p className="eyebrow">STEP 4</p>
                <h2 className="cn-section-heading">Review &amp; Launch</h2>
              </div>

              {/* Summary card */}
              <div className="cn-summary">
                <p
                  className="eyebrow"
                  style={{ marginBottom: 16, color: "var(--ink-3)" }}
                >
                  CAMPAIGN SUMMARY
                </p>

                <div className="cn-summary-grid">
                  <div className="cn-summary-item cn-summary-item--full">
                    <span className="cn-summary-label">CAMPAIGN NAME</span>
                    <span className="cn-summary-value cn-summary-value--large">
                      {form.name || "—"}
                    </span>
                  </div>

                  <div className="cn-summary-item cn-summary-item--full">
                    <span className="cn-summary-label">DESCRIPTION</span>
                    <span className="cn-summary-value">
                      {form.description || "—"}
                    </span>
                  </div>

                  <div className="cn-summary-divider" />

                  <div className="cn-summary-item">
                    <span className="cn-summary-label">CATEGORY</span>
                    <span className="cn-summary-value">
                      {form.category ? capitalize(form.category) : "—"}
                    </span>
                  </div>

                  <div className="cn-summary-item">
                    <span className="cn-summary-label">BUDGET</span>
                    <span className="cn-summary-value cn-summary-value--accent">
                      {form.budget
                        ? `$${parseFloat(form.budget).toLocaleString()}`
                        : "—"}
                    </span>
                  </div>

                  <div className="cn-summary-item">
                    <span className="cn-summary-label">CREATOR TIER</span>
                    <span className="cn-summary-value">
                      {form.tier ? capitalize(form.tier) : "—"}
                    </span>
                  </div>

                  <div className="cn-summary-item">
                    <span className="cn-summary-label">COMMISSION SPLIT</span>
                    <span className="cn-summary-value">
                      {form.commissionSplit}% to creators
                    </span>
                  </div>

                  <div className="cn-summary-item">
                    <span className="cn-summary-label">CONTENT TYPE</span>
                    <span className="cn-summary-value">
                      {form.contentType ? capitalize(form.contentType) : "—"}
                    </span>
                  </div>

                  <div className="cn-summary-item">
                    <span className="cn-summary-label">PLATFORM</span>
                    <span className="cn-summary-value">
                      {form.platform || "—"}
                    </span>
                  </div>

                  <div className="cn-summary-item cn-summary-item--full">
                    <span className="cn-summary-label">CONTENT DUE</span>
                    <span className="cn-summary-value">
                      {form.dueDate || "—"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="cn-nav">
                <button
                  type="button"
                  className="btn-ghost click-shift"
                  onClick={handleBack}
                  disabled={loading}
                >
                  Edit
                </button>
                <button
                  type="button"
                  className="btn-primary click-shift"
                  onClick={handlePublish}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="cn-dots" aria-hidden="true">
                        <span className="cn-dot" />
                        <span className="cn-dot" />
                        <span className="cn-dot" />
                      </span>
                      <span className="sr-only">Launching…</span>
                    </>
                  ) : (
                    "Launch Campaign"
                  )}
                </button>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
