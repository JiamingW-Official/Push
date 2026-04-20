"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/db/browser";
import "./campaign-new.css";

// ── Types ────────────────────────────────────────────────────
type Step = 1 | 2 | 3;

type FormData = {
  title: string;
  description: string;
  category: string;
  payout: string;
  spots: string;
  deadline: string;
};

type FormErrors = Partial<Record<keyof FormData, string>>;

const CATEGORIES = [
  "Food",
  "Coffee",
  "Beauty",
  "Retail",
  "Fitness",
  "Other",
] as const;

const EMPTY: FormData = {
  title: "",
  description: "",
  category: "",
  payout: "",
  spots: "",
  deadline: "",
};

// ── Helpers ──────────────────────────────────────────────────
function todayISO(): string {
  return new Date().toISOString().split("T")[0];
}

function formatPayout(val: string): string {
  const n = parseFloat(val);
  if (isNaN(n)) return "—";
  return n === 0 ? "Free / Trade" : `$${n.toFixed(2)}`;
}

function formatDeadline(val: string): string {
  if (!val) return "—";
  const [y, m, d] = val.split("-");
  return `${m}/${d}/${y}`;
}

// ── Step indicator ───────────────────────────────────────────
const STEP_LABELS: Record<Step, string> = {
  1: "Basics",
  2: "Offer",
  3: "Publish",
};

function StepIndicator({ current }: { current: Step }) {
  return (
    <nav className="cn-steps" aria-label="Form steps">
      {([1, 2, 3] as Step[]).map((n) => {
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

// ── Main page ────────────────────────────────────────────────
export default function CampaignNewPage() {
  const router = useRouter();

  const [step, setStep] = useState<Step>(1);
  const [form, setForm] = useState<FormData>(EMPTY);
  const [errors, setErrors] = useState<FormErrors>({});
  const [formError, setFormError] = useState("");
  const [loading, setLoading] = useState(false);
  const [authReady, setAuthReady] = useState(false);
  const [merchantId, setMerchantId] = useState<string | null>(null);

  // ── Auth check on mount ──────────────────────────────────
  useEffect(() => {
    async function checkAuth() {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.replace("/merchant/login");
        return;
      }

      const { data: merchant } = await supabase
        .from("merchants")
        .select("id")
        .eq("user_id", user.id)
        .single();

      if (!merchant) {
        router.replace("/merchant/signup");
        return;
      }

      setMerchantId(merchant.id);
      setAuthReady(true);
    }
    checkAuth();
  }, [router]);

  // ── Field helpers ────────────────────────────────────────
  function set(k: keyof FormData) {
    return (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >,
    ) => {
      setForm((f) => ({ ...f, [k]: e.target.value }));
      if (errors[k]) setErrors((prev) => ({ ...prev, [k]: undefined }));
    };
  }

  // ── Validation per step ──────────────────────────────────
  function validateStep(s: Step): FormErrors {
    const errs: FormErrors = {};

    if (s === 1) {
      if (!form.title.trim()) errs.title = "Campaign title is required.";
      else if (form.title.length > 80)
        errs.title = "Title must be 80 characters or fewer.";

      if (!form.description.trim())
        errs.description = "Description is required.";
      else if (form.description.length > 280)
        errs.description = "Description must be 280 characters or fewer.";

      if (!form.category) errs.category = "Please select a category.";
    }

    if (s === 2) {
      const payout = parseFloat(form.payout);
      if (form.payout === "" || isNaN(payout))
        errs.payout = "Enter a payout amount (use 0 for free/trade).";
      else if (payout < 0) errs.payout = "Payout cannot be negative.";

      const spots = parseInt(form.spots, 10);
      if (form.spots === "" || isNaN(spots))
        errs.spots = "Enter the number of available spots.";
      else if (spots < 1 || spots > 50)
        errs.spots = "Spots must be between 1 and 50.";

      if (!form.deadline) errs.deadline = "Please set a deadline.";
      else if (form.deadline < todayISO())
        errs.deadline = "Deadline must be today or later.";
    }

    return errs;
  }

  // ── Navigation ───────────────────────────────────────────
  function handleNext() {
    const errs = validateStep(step);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setErrors({});
    setStep((s) => (s < 3 ? ((s + 1) as Step) : s));
  }

  function handleBack() {
    setErrors({});
    setStep((s) => (s > 1 ? ((s - 1) as Step) : s));
  }

  // ── Submit ───────────────────────────────────────────────
  async function handleSubmit(status: "draft" | "active") {
    // Re-validate steps 1 & 2 before publish
    const e1 = validateStep(1);
    const e2 = validateStep(2);
    const allErrs = { ...e1, ...e2 };
    if (Object.keys(allErrs).length > 0) {
      setErrors(allErrs);
      setFormError("Some fields need attention. Please review previous steps.");
      return;
    }

    if (!merchantId) {
      setFormError("Session error. Please refresh and try again.");
      return;
    }

    setLoading(true);
    setFormError("");

    try {
      const supabase = createClient();
      const spotsTotal = parseInt(form.spots, 10);
      const payout = parseFloat(form.payout);

      const { error } = await supabase.from("campaigns").insert({
        merchant_id: merchantId,
        title: form.title.trim(),
        description: form.description.trim(),
        payout,
        spots_total: spotsTotal,
        spots_remaining: spotsTotal,
        deadline: form.deadline || null,
        status,
      });

      if (error) throw error;

      router.push("/merchant/dashboard");
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Something went wrong. Try again.";
      setFormError(msg);
    } finally {
      setLoading(false);
    }
  }

  // ── Loading skeleton ─────────────────────────────────────
  if (!authReady) {
    return (
      <div className="cn-page">
        <div className="cn-inner">
          <div style={{ color: "#669bbc", fontSize: "0.875rem" }}>Loading…</div>
        </div>
      </div>
    );
  }

  // ── Render ───────────────────────────────────────────────
  return (
    <div className="cn-page">
      <div className="cn-inner">
        {/* Back link */}
        <Link href="/merchant/dashboard" className="cn-back">
          ← Back to dashboard
        </Link>

        {/* Page title */}
        <h1 className="cn-title">Create Campaign</h1>
        <p className="cn-subtitle">
          Fill in the details below to attract creators near you.
        </p>

        {/* Step indicator */}
        <StepIndicator current={step} />

        {/* Global error */}
        {formError && (
          <div className="cn-form-error" role="alert">
            <span>{formError}</span>
            <button type="button" onClick={() => setFormError("")}>
              Dismiss
            </button>
          </div>
        )}

        {/* Form panel */}
        <div className="cn-panel">
          {/* ── Step 1: Campaign Basics ───────────────── */}
          <section
            className={`cn-step-section${step === 1 ? " cn-step-section--visible" : ""}`}
            aria-label="Step 1: Campaign Basics"
          >
            <h2 className="cn-section-heading">Campaign Basics</h2>

            {/* Title */}
            <div className="cn-field">
              <label htmlFor="cn-title">Campaign Title</label>
              <input
                id="cn-title"
                type="text"
                value={form.title}
                onChange={set("title")}
                maxLength={80}
                placeholder="e.g. Free Latte for Your First Post"
                className={errors.title ? "cn-input--error" : ""}
                aria-describedby={errors.title ? "err-title" : "counter-title"}
                autoComplete="off"
              />
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                {errors.title ? (
                  <span className="cn-error-msg" id="err-title" role="alert">
                    {errors.title}
                  </span>
                ) : (
                  <span />
                )}
                <span
                  id="counter-title"
                  className={`cn-char-counter${form.title.length > 72 ? " cn-char-counter--warn" : ""}`}
                  aria-live="polite"
                >
                  {form.title.length}/80
                </span>
              </div>
            </div>

            {/* Description */}
            <div className="cn-field">
              <label htmlFor="cn-description">Description</label>
              <textarea
                id="cn-description"
                value={form.description}
                onChange={set("description")}
                maxLength={280}
                rows={4}
                placeholder="What are you offering? What should creators post about?"
                className={errors.description ? "cn-input--error" : ""}
                aria-describedby={
                  errors.description ? "err-desc" : "counter-desc"
                }
              />
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                {errors.description ? (
                  <span className="cn-error-msg" id="err-desc" role="alert">
                    {errors.description}
                  </span>
                ) : (
                  <span />
                )}
                <span
                  id="counter-desc"
                  className={`cn-char-counter${form.description.length > 252 ? " cn-char-counter--warn" : ""}`}
                  aria-live="polite"
                >
                  {form.description.length}/280
                </span>
              </div>
            </div>

            {/* Category */}
            <div className="cn-field">
              <label htmlFor="cn-category">Category</label>
              <select
                id="cn-category"
                value={form.category}
                onChange={set("category")}
                className={errors.category ? "cn-input--error" : ""}
                aria-describedby={errors.category ? "err-category" : undefined}
              >
                <option value="">Select a category…</option>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              {errors.category && (
                <span className="cn-error-msg" id="err-category" role="alert">
                  {errors.category}
                </span>
              )}
            </div>

            <div className="cn-nav cn-nav--end">
              <button
                type="button"
                className="cn-btn cn-btn--primary"
                onClick={handleNext}
              >
                Next: Offer Details →
              </button>
            </div>
          </section>

          {/* ── Step 2: Offer Details ─────────────────── */}
          <section
            className={`cn-step-section${step === 2 ? " cn-step-section--visible" : ""}`}
            aria-label="Step 2: Offer Details"
          >
            <h2 className="cn-section-heading">Offer Details</h2>

            <div className="cn-row">
              {/* Payout */}
              <div className="cn-field">
                <label htmlFor="cn-payout">Payout ($)</label>
                <input
                  id="cn-payout"
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.payout}
                  onChange={set("payout")}
                  placeholder="0.00"
                  className={errors.payout ? "cn-input--error" : ""}
                  aria-describedby={
                    errors.payout ? "err-payout" : "hint-payout"
                  }
                />
                {errors.payout ? (
                  <span className="cn-error-msg" id="err-payout" role="alert">
                    {errors.payout}
                  </span>
                ) : (
                  <span className="cn-field-hint" id="hint-payout">
                    Set to $0 for product/experience trade (e.g. free coffee)
                  </span>
                )}
              </div>

              {/* Spots */}
              <div className="cn-field">
                <label htmlFor="cn-spots">Spots Available</label>
                <input
                  id="cn-spots"
                  type="number"
                  min="1"
                  max="50"
                  step="1"
                  value={form.spots}
                  onChange={set("spots")}
                  placeholder="e.g. 5"
                  className={errors.spots ? "cn-input--error" : ""}
                  aria-describedby={errors.spots ? "err-spots" : "hint-spots"}
                />
                {errors.spots ? (
                  <span className="cn-error-msg" id="err-spots" role="alert">
                    {errors.spots}
                  </span>
                ) : (
                  <span className="cn-field-hint" id="hint-spots">
                    Max 50 creators per campaign
                  </span>
                )}
              </div>
            </div>

            {/* Deadline */}
            <div className="cn-field">
              <label htmlFor="cn-deadline">Deadline</label>
              <input
                id="cn-deadline"
                type="date"
                min={todayISO()}
                value={form.deadline}
                onChange={set("deadline")}
                className={errors.deadline ? "cn-input--error" : ""}
                aria-describedby={errors.deadline ? "err-deadline" : undefined}
              />
              {errors.deadline && (
                <span className="cn-error-msg" id="err-deadline" role="alert">
                  {errors.deadline}
                </span>
              )}
            </div>

            <div className="cn-nav">
              <button
                type="button"
                className="cn-btn cn-btn--ghost"
                onClick={handleBack}
              >
                ← Back
              </button>
              <button
                type="button"
                className="cn-btn cn-btn--primary"
                onClick={handleNext}
              >
                Next: Review →
              </button>
            </div>
          </section>

          {/* ── Step 3: Review & Publish ──────────────── */}
          <section
            className={`cn-step-section${step === 3 ? " cn-step-section--visible" : ""}`}
            aria-label="Step 3: Review and Publish"
          >
            <h2 className="cn-section-heading">Review & Publish</h2>

            {/* Summary card */}
            <div className="cn-summary">
              <p className="cn-summary-heading">Campaign Summary</p>
              <div className="cn-summary-grid">
                <div className="cn-summary-item cn-summary-item--full">
                  <span className="cn-summary-label">Title</span>
                  <span className="cn-summary-value">{form.title || "—"}</span>
                </div>

                <div className="cn-summary-item cn-summary-item--full">
                  <span className="cn-summary-label">Description</span>
                  <span className="cn-summary-value">
                    {form.description || "—"}
                  </span>
                </div>

                <div className="cn-summary-item">
                  <span className="cn-summary-label">Category</span>
                  <span className="cn-summary-value">
                    {form.category || "—"}
                  </span>
                </div>

                <div className="cn-summary-item">
                  <span className="cn-summary-label">Payout</span>
                  <span className="cn-summary-value">
                    {form.payout !== "" ? formatPayout(form.payout) : "—"}
                  </span>
                </div>

                <div className="cn-summary-item">
                  <span className="cn-summary-label">Spots Available</span>
                  <span className="cn-summary-value">{form.spots || "—"}</span>
                </div>

                <div className="cn-summary-item">
                  <span className="cn-summary-label">Deadline</span>
                  <span className="cn-summary-value">
                    {formatDeadline(form.deadline)}
                  </span>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div
              style={{
                display: "flex",
                justifyContent: "flex-start",
                marginTop: "28px",
                marginBottom: "16px",
              }}
            >
              <button
                type="button"
                className="cn-btn cn-btn--ghost"
                onClick={handleBack}
                disabled={loading}
              >
                ← Back
              </button>
            </div>

            <div className="cn-publish-row">
              <button
                type="button"
                className="cn-btn cn-btn--draft"
                onClick={() => handleSubmit("draft")}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="cn-dots" aria-hidden="true">
                      <span className="cn-dot" />
                      <span className="cn-dot" />
                      <span className="cn-dot" />
                    </span>
                    <span className="sr-only">Saving…</span>
                  </>
                ) : (
                  "Save as Draft"
                )}
              </button>
              <button
                type="button"
                className="cn-btn cn-btn--publish"
                onClick={() => handleSubmit("active")}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="cn-dots" aria-hidden="true">
                      <span className="cn-dot" />
                      <span className="cn-dot" />
                      <span className="cn-dot" />
                    </span>
                    <span className="sr-only">Publishing…</span>
                  </>
                ) : (
                  "Publish Campaign"
                )}
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
