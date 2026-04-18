"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import "./campaign-new.css";

// ── Types ─────────────────────────────────────────────────────
type Step = 1 | 2 | 3 | 4;

type GoalId = "fill-seats" | "get-discovered" | "sell-out-launch";

type Timeline = "1w" | "2w" | "1m" | "custom";

type FormData = {
  // Step 1 — Goal
  goal: GoalId | "";
  // Step 2 — Brief
  prompt: string;
  name: string;
  pitch: string;
  creatorBrief: string;
  cta: string;
  heroOffer: string;
  sustainedOffer: string;
  // Step 3 — Budget + target
  target: number;
  timeline: Timeline;
  customDays: string;
};

type FormErrors = Partial<Record<keyof FormData, string>>;

const EMPTY: FormData = {
  goal: "",
  prompt: "",
  name: "",
  pitch: "",
  creatorBrief: "",
  cta: "",
  heroOffer: "",
  sustainedOffer: "",
  target: 20,
  timeline: "2w",
  customDays: "",
};

const STEP_LABELS: Record<Step, string> = {
  1: "Goal",
  2: "Brief",
  3: "Budget",
  4: "Review",
};

const STEP_DESCRIPTIONS: Record<Step, string> = {
  1: "Pick what success looks like. ConversionOracle\u2122 drafts the rest.",
  2: "One line about your shop. We draft a creator brief and Two-Tier Offer in seconds.",
  3: "Target customer count, timeline, auto-budget from Coffee+ rate.",
  4: "Launch your Customer Acquisition Engine \u2014 triple-checked by verification stack.",
};

// ── Goals (v5.1 — Fill Seats / Get Discovered / Sell Out Launch) ─
const GOALS: {
  id: GoalId;
  num: string;
  title: string;
  desc: string;
  icon: ReactNode;
}[] = [
  {
    id: "fill-seats",
    num: "01",
    title: "Fill Seats",
    desc: "Get locals through the door this week. ConversionOracle predicts walk-in conversion.",
    icon: (
      <svg
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          d="M4 28h24M8 28V14l8-6 8 6v14"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M13 28v-8h6v8"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    id: "get-discovered",
    num: "02",
    title: "Get Discovered",
    desc: "Show up in feeds of people who live within 2mi. Neighborhood Playbook targeting.",
    icon: (
      <svg
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <circle
          cx="16"
          cy="16"
          r="12"
          stroke="currentColor"
          strokeWidth="1.8"
        />
        <circle cx="16" cy="16" r="6" stroke="currentColor" strokeWidth="1.8" />
        <circle cx="16" cy="16" r="1.5" fill="currentColor" />
        <path
          d="M16 2v4M16 26v4M2 16h4M26 16h4"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    id: "sell-out-launch",
    num: "03",
    title: "Sell Out Launch",
    desc: "Event, new menu, or drop. Creators amplify your moment \u2014 DisclosureBot handles FTC.",
    icon: (
      <svg
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          d="M22 4L28 10 18 20l-6-6L22 4z"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M12 14l-8 8 6 6 8-8"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M4 22l6 6"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
];

// ── Timeline options ──────────────────────────────────────────
const TIMELINES: { id: Timeline; label: string; days: number }[] = [
  { id: "1w", label: "1 Week", days: 7 },
  { id: "2w", label: "2 Weeks", days: 14 },
  { id: "1m", label: "1 Month", days: 30 },
  { id: "custom", label: "Custom", days: 0 },
];

// ── Helpers ───────────────────────────────────────────────────
function genId(): string {
  return `cmp-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

/**
 * Mock ConversionOracle AI Auto-Draft generator.
 * Parses user prompt for keywords, returns draft brief fields.
 */
function generateDraft(
  prompt: string,
  goalId: GoalId | "",
): {
  name: string;
  pitch: string;
  creatorBrief: string;
  cta: string;
  heroOffer: string;
  sustainedOffer: string;
} {
  const lower = prompt.toLowerCase();
  const location =
    lower.match(/williamsburg|greenpoint|bushwick|brooklyn|nyc/i)?.[0] ||
    "Williamsburg";
  const category =
    lower.match(/coffee|bakery|brunch|cafe/i)?.[0]?.toLowerCase() || "Coffee+";
  const targetMatch = lower.match(/(\d+)\s*(?:new\s+)?customers?/i);
  const target = targetMatch ? parseInt(targetMatch[1], 10) : 20;

  const goalCopy: Record<GoalId, { verb: string; focus: string }> = {
    "fill-seats": {
      verb: "Drive walk-ins",
      focus: "this week's seat-fill",
    },
    "get-discovered": {
      verb: "Amplify reach",
      focus: "first-impression discovery",
    },
    "sell-out-launch": {
      verb: "Sell out",
      focus: "launch-day momentum",
    },
  };
  const g = goalId ? goalCopy[goalId] : goalCopy["fill-seats"];

  return {
    name: `${capitalize(category)} \u2014 ${target} in ${location} (${g.verb})`,
    pitch: `${g.verb} for a ${category.toLowerCase()} shop in ${location}. Target: ${target} verified customers via 3-layer verification (QR + Claude Vision OCR + geo-match). ConversionOracle\u2122 predicts walk-in conversion before creators post.`,
    creatorBrief: `You're posting for a ${location} ${category.toLowerCase()} shop that's building ${g.focus}.\n\nThe vibe: neighborhood-first, slow-craft, no hustle energy. Shoot the actual product \u2014 steam curling off a pour, latte art close-up, pastry cross-section. Caption should feel like a friend sharing a find, not an ad. DisclosureBot auto-applies #ad for FTC compliance.\n\nTag @thebrand and drop the unique QR-linked promo. Hero Offer is for first 20 customers; sustained offer runs the rest of the window.`,
    cta: `Scan QR at the counter for your ${category.toLowerCase()} \u2014 redeem before ${new Date(
      Date.now() + 14 * 24 * 60 * 60 * 1000,
    ).toLocaleDateString("en-US", { month: "short", day: "numeric" })}.`,
    heroOffer: `Free 12oz ${category.toLowerCase()} for first 20 creators' audiences (redeem once per person)`,
    sustainedOffer: `$3 off any drink + pastry combo for everyone scanning the QR during campaign window`,
  };
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function calcBudget(target: number, days: number): number {
  // Coffee+ Operator rate: $25/verified customer
  // Plus Retention Add-on ~$8/customer during warm 30-day window
  const baseRate = 25;
  const retentionAddOn = 8;
  return Math.round(target * (baseRate + retentionAddOn));
}

// ── Step Indicator ────────────────────────────────────────────
function StepIndicator({ current }: { current: Step }) {
  return (
    <nav className="cn-steps" aria-label="Wizard progress">
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
  const [launching, setLaunching] = useState(false);
  const [aiState, setAiState] = useState<"idle" | "drafting" | "done">("idle");

  function setField<K extends keyof FormData>(k: K, val: FormData[K]) {
    setForm((f) => ({ ...f, [k]: val }));
    if (errors[k]) setErrors((e) => ({ ...e, [k]: undefined }));
  }

  // ── AI Auto-Draft (mock ConversionOracle\u2122) ──────────────
  function handleAutoDraft() {
    if (!form.prompt.trim()) {
      setErrors((e) => ({ ...e, prompt: "Type a one-line prompt first." }));
      return;
    }
    setAiState("drafting");
    setTimeout(() => {
      const draft = generateDraft(form.prompt, form.goal);
      setForm((f) => ({ ...f, ...draft }));
      setAiState("done");
    }, 800);
  }

  // ── Validation ───────────────────────────────────────────────
  function validateStep(s: Step): FormErrors {
    const errs: FormErrors = {};
    if (s === 1) {
      if (!form.goal) errs.goal = "Pick a campaign goal.";
    }
    if (s === 2) {
      if (!form.name.trim()) errs.name = "Campaign name is required.";
      if (!form.creatorBrief.trim())
        errs.creatorBrief = "Creator brief is required.";
      if (!form.heroOffer.trim())
        errs.heroOffer = "Hero Offer is required (limited tier).";
      if (!form.sustainedOffer.trim())
        errs.sustainedOffer = "Sustained Offer is required (ongoing tier).";
    }
    if (s === 3) {
      if (form.target < 5 || form.target > 100)
        errs.target = "Target must be between 5 and 100 customers.";
      if (form.timeline === "custom" && !form.customDays.trim())
        errs.customDays = "Enter custom days.";
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
  async function handleLaunch(asDraft = false) {
    const allErrs = {
      ...validateStep(1),
      ...validateStep(2),
      ...validateStep(3),
    };
    if (!asDraft && Object.keys(allErrs).length > 0) {
      setErrors(allErrs);
      setFormError("Some fields need attention. Review previous steps.");
      return;
    }

    setLaunching(true);
    setFormError("");

    try {
      const id = genId();
      const tl = TIMELINES.find((t) => t.id === form.timeline)!;
      const days =
        form.timeline === "custom"
          ? parseInt(form.customDays, 10) || 14
          : tl.days;
      const budget = calcBudget(form.target, days);

      const campaign = {
        id,
        goal: form.goal,
        name: form.name.trim(),
        pitch: form.pitch.trim(),
        creatorBrief: form.creatorBrief.trim(),
        cta: form.cta.trim(),
        heroOffer: form.heroOffer.trim(),
        sustainedOffer: form.sustainedOffer.trim(),
        target: form.target,
        timeline: form.timeline,
        days,
        budget,
        status: asDraft ? "draft" : "active",
        createdAt: new Date().toISOString(),
      };

      const stored = localStorage.getItem("push-demo-campaigns-v51");
      const list = stored ? JSON.parse(stored) : [];
      list.unshift(campaign);
      localStorage.setItem("push-demo-campaigns-v51", JSON.stringify(list));

      router.push(`/merchant/campaigns/${id}`);
    } catch {
      setFormError("Something went wrong. Try again.");
    } finally {
      setLaunching(false);
    }
  }

  // ── Derived values for review step ───────────────────────────
  const selectedGoal = GOALS.find((g) => g.id === form.goal);
  const selectedTL = TIMELINES.find((t) => t.id === form.timeline);
  const days =
    form.timeline === "custom"
      ? parseInt(form.customDays, 10) || 14
      : selectedTL?.days || 14;
  const estBudget = calcBudget(form.target, days);

  return (
    <div className="cn-page">
      <div className="cn-inner cn-inner--wide">
        <Link href="/merchant/dashboard" className="cn-back">
          \u2190 Back to dashboard
        </Link>

        <h1 className="cn-title">New Campaign</h1>
        <p className="cn-subtitle">
          Four steps. ConversionOracle\u2122 drafts the brief. You approve and
          launch.
        </p>

        <StepIndicator current={step} />

        {formError && (
          <div className="cn-form-error" role="alert">
            <span>{formError}</span>
            <button type="button" onClick={() => setFormError("")}>
              Dismiss
            </button>
          </div>
        )}

        <div className="cn-wizard-layout">
          {/* Left rail */}
          <aside className="cn-wizard-rail">
            <div className="cn-rail-inner">
              <p className="cn-rail-step-label">Step {step} of 4</p>
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
              <div className="cn-rail-desc">{STEP_DESCRIPTIONS[step]}</div>
            </div>
          </aside>

          {/* Right panel */}
          <div className="cn-panel">
            {/* ── Step 1: Goal ─────────────────────────── */}
            <section
              className={`cn-step-section${step === 1 ? " cn-step-section--visible" : ""}`}
              aria-label="Step 1: Goal"
            >
              <h2 className="cn-section-heading">
                What does success look like?
              </h2>

              <div
                className="cn-goal-grid"
                role="radiogroup"
                aria-label="Campaign goal"
              >
                {GOALS.map((g) => {
                  const active = form.goal === g.id;
                  return (
                    <button
                      key={g.id}
                      type="button"
                      role="radio"
                      aria-checked={active}
                      className={[
                        "cn-goal-card",
                        active ? "cn-goal-card--active" : "",
                      ]
                        .filter(Boolean)
                        .join(" ")}
                      onClick={() => setField("goal", g.id)}
                    >
                      <span className="cn-goal-num">{g.num}</span>
                      <span className="cn-goal-icon">{g.icon}</span>
                      <span className="cn-goal-title">{g.title}</span>
                      <span className="cn-goal-desc">{g.desc}</span>
                    </button>
                  );
                })}
              </div>

              {errors.goal && (
                <span
                  className="cn-error-msg"
                  role="alert"
                  style={{ marginTop: "12px", display: "block" }}
                >
                  {errors.goal}
                </span>
              )}

              <div className="cn-nav cn-nav--end">
                <button
                  type="button"
                  className="cn-btn cn-btn--primary"
                  onClick={handleNext}
                >
                  Next: Brief \u2192
                </button>
              </div>
            </section>

            {/* ── Step 2: Brief ────────────────────────── */}
            <section
              className={`cn-step-section${step === 2 ? " cn-step-section--visible" : ""}`}
              aria-label="Step 2: Brief"
            >
              <h2 className="cn-section-heading">
                Draft the brief with ConversionOracle\u2122
              </h2>

              {/* Prompt + AI Auto-Draft */}
              <div className="cn-field">
                <label htmlFor="cw-prompt">One-line prompt</label>
                <div className="cn-prompt-row">
                  <input
                    id="cw-prompt"
                    type="text"
                    placeholder="e.g. 20 new customers this month, Coffee+, Williamsburg"
                    value={form.prompt}
                    onChange={(e) => setField("prompt", e.target.value)}
                    className={errors.prompt ? "cn-input--error" : undefined}
                    disabled={aiState === "drafting"}
                  />
                  <button
                    type="button"
                    className="cn-ai-btn"
                    onClick={handleAutoDraft}
                    disabled={aiState === "drafting"}
                    aria-label="Generate draft with ConversionOracle AI"
                  >
                    <svg
                      className="cn-ai-btn-spark"
                      viewBox="0 0 16 16"
                      fill="none"
                      aria-hidden="true"
                    >
                      <path
                        d="M8 1v4M8 11v4M1 8h4M11 8h4M3 3l2.5 2.5M10.5 10.5L13 13M3 13l2.5-2.5M10.5 5.5L13 3"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      />
                    </svg>
                    {aiState === "drafting"
                      ? "Drafting\u2026"
                      : aiState === "done"
                        ? "Redraft"
                        : "AI Auto-Draft"}
                  </button>
                </div>
                {errors.prompt && (
                  <span className="cn-error-msg" role="alert">
                    {errors.prompt}
                  </span>
                )}
                {aiState !== "idle" && (
                  <div
                    className={`cn-ai-status${aiState === "done" ? " cn-ai-status--done" : ""}`}
                    role="status"
                  >
                    <span className="cn-ai-pulse" aria-hidden="true" />
                    {aiState === "drafting"
                      ? "ConversionOracle\u2122 is matching Neighborhood Playbook patterns\u2026"
                      : "Draft ready. Edit any field below before launch."}
                  </div>
                )}
              </div>

              {/* Campaign name */}
              <div className="cn-field">
                <label htmlFor="cw-name">Campaign name</label>
                <input
                  id="cw-name"
                  type="text"
                  maxLength={100}
                  placeholder="Auto-drafted by AI, or type your own"
                  value={form.name}
                  onChange={(e) => setField("name", e.target.value)}
                  className={errors.name ? "cn-input--error" : undefined}
                />
                {errors.name && (
                  <span className="cn-error-msg" role="alert">
                    {errors.name}
                  </span>
                )}
              </div>

              {/* Elevator pitch */}
              <div className="cn-field">
                <label htmlFor="cw-pitch">Elevator pitch (internal)</label>
                <textarea
                  id="cw-pitch"
                  rows={2}
                  placeholder="One paragraph summary of the campaign\u2026"
                  value={form.pitch}
                  onChange={(e) => setField("pitch", e.target.value)}
                />
              </div>

              {/* Creator brief */}
              <div className="cn-field">
                <label htmlFor="cw-brief">Creator brief (what they post)</label>
                <textarea
                  id="cw-brief"
                  rows={5}
                  placeholder="Tone, visuals, caption guidance\u2026"
                  value={form.creatorBrief}
                  onChange={(e) => setField("creatorBrief", e.target.value)}
                  className={
                    errors.creatorBrief ? "cn-input--error" : undefined
                  }
                />
                {errors.creatorBrief && (
                  <span className="cn-error-msg" role="alert">
                    {errors.creatorBrief}
                  </span>
                )}
              </div>

              {/* CTA script */}
              <div className="cn-field">
                <label htmlFor="cw-cta">CTA script</label>
                <input
                  id="cw-cta"
                  type="text"
                  placeholder="Scan QR at the counter\u2026"
                  value={form.cta}
                  onChange={(e) => setField("cta", e.target.value)}
                />
              </div>

              {/* Two-Tier Offer (v5.1) */}
              <div className="cn-field">
                <label>Two-Tier Offer</label>
                <div className="cn-offer-grid">
                  <div className="cn-offer-cell">
                    <span className="cn-offer-tag">
                      <span className="cn-offer-tag-dot" />
                      Hero Offer \u00b7 Limited
                    </span>
                    <textarea
                      rows={2}
                      placeholder="Free 12oz for first 20 scans\u2026"
                      value={form.heroOffer}
                      onChange={(e) => setField("heroOffer", e.target.value)}
                      className={
                        errors.heroOffer ? "cn-input--error" : undefined
                      }
                    />
                    {errors.heroOffer && (
                      <span className="cn-error-msg" role="alert">
                        {errors.heroOffer}
                      </span>
                    )}
                  </div>
                  <div className="cn-offer-cell">
                    <span className="cn-offer-tag cn-offer-tag--sustained">
                      <span className="cn-offer-tag-dot" />
                      Sustained Offer \u00b7 Ongoing
                    </span>
                    <textarea
                      rows={2}
                      placeholder="$3 off combo for campaign window\u2026"
                      value={form.sustainedOffer}
                      onChange={(e) =>
                        setField("sustainedOffer", e.target.value)
                      }
                      className={
                        errors.sustainedOffer ? "cn-input--error" : undefined
                      }
                    />
                    {errors.sustainedOffer && (
                      <span className="cn-error-msg" role="alert">
                        {errors.sustainedOffer}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="cn-nav">
                <button
                  type="button"
                  className="cn-btn cn-btn--ghost"
                  onClick={handleBack}
                >
                  \u2190 Back
                </button>
                <button
                  type="button"
                  className="cn-btn cn-btn--primary"
                  onClick={handleNext}
                >
                  Next: Budget \u2192
                </button>
              </div>
            </section>

            {/* ── Step 3: Budget + target ──────────────── */}
            <section
              className={`cn-step-section${step === 3 ? " cn-step-section--visible" : ""}`}
              aria-label="Step 3: Budget and target"
            >
              <h2 className="cn-section-heading">
                Target customers & timeline
              </h2>

              {/* Target slider */}
              <div className="cn-field">
                <label htmlFor="cw-target">Verified customers</label>
                <div className="cn-count-display">
                  <span className="cn-count-n">{form.target}</span>
                  <span className="cn-count-unit">
                    verified walk-ins \u00b7 3-layer checked
                  </span>
                </div>
                <input
                  id="cw-target"
                  type="range"
                  min={5}
                  max={100}
                  step={5}
                  value={form.target}
                  onChange={(e) => setField("target", parseInt(e.target.value))}
                  className="cn-range"
                />
                {errors.target && (
                  <span className="cn-error-msg" role="alert">
                    {errors.target}
                  </span>
                )}
                <span className="cn-field-hint">
                  Min 5 \u00b7 Max 100 per campaign. Coffee+ Operator rate
                  $25/verified customer + Retention Add-on.
                </span>
              </div>

              {/* Timeline */}
              <div className="cn-field">
                <label>Timeline</label>
                <div
                  className="cn-timeline-group"
                  role="radiogroup"
                  aria-label="Campaign timeline"
                >
                  {TIMELINES.map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      role="radio"
                      aria-checked={form.timeline === t.id}
                      className={[
                        "cn-timeline-btn",
                        form.timeline === t.id ? "cn-timeline-btn--active" : "",
                      ]
                        .filter(Boolean)
                        .join(" ")}
                      onClick={() => setField("timeline", t.id)}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              {form.timeline === "custom" && (
                <div className="cn-field">
                  <label htmlFor="cw-custom-days">Custom days</label>
                  <input
                    id="cw-custom-days"
                    type="number"
                    min={3}
                    max={90}
                    placeholder="e.g. 21"
                    value={form.customDays}
                    onChange={(e) => setField("customDays", e.target.value)}
                    className={
                      errors.customDays ? "cn-input--error" : undefined
                    }
                  />
                  {errors.customDays && (
                    <span className="cn-error-msg" role="alert">
                      {errors.customDays}
                    </span>
                  )}
                </div>
              )}

              {/* Budget preview */}
              <div className="cn-budget-preview" aria-label="Estimated budget">
                <div className="cn-budget-cell">
                  <span className="cn-budget-label">Base creator rate</span>
                  <span className="cn-budget-value">${form.target * 25}</span>
                </div>
                <div className="cn-budget-cell">
                  <span className="cn-budget-label">Retention Add-on</span>
                  <span className="cn-budget-value">${form.target * 8}</span>
                </div>
                <div className="cn-budget-cell">
                  <span className="cn-budget-label">Total estimate</span>
                  <span
                    className="cn-budget-value"
                    style={{ color: "#c1121f" }}
                  >
                    ${estBudget.toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="cn-nav">
                <button
                  type="button"
                  className="cn-btn cn-btn--ghost"
                  onClick={handleBack}
                >
                  \u2190 Back
                </button>
                <button
                  type="button"
                  className="cn-btn cn-btn--primary"
                  onClick={handleNext}
                >
                  Next: Review \u2192
                </button>
              </div>
            </section>

            {/* ── Step 4: Review + launch ──────────────── */}
            <section
              className={`cn-step-section${step === 4 ? " cn-step-section--visible" : ""}`}
              aria-label="Step 4: Review and launch"
            >
              <h2 className="cn-section-heading">Review & Launch</h2>

              <div className="cn-summary">
                <p className="cn-summary-heading">Campaign Summary</p>

                <div className="cn-summary-grid">
                  <div className="cn-summary-item cn-summary-item--full">
                    <span className="cn-summary-label">Campaign Name</span>
                    <span className="cn-summary-value">
                      {form.name || "\u2014"}
                    </span>
                  </div>

                  <div className="cn-summary-item">
                    <span className="cn-summary-label">Goal</span>
                    <span className="cn-summary-value">
                      {selectedGoal?.title || "\u2014"}
                    </span>
                  </div>

                  <div className="cn-summary-item">
                    <span className="cn-summary-label">Target</span>
                    <span className="cn-summary-value">
                      {form.target} verified customers
                    </span>
                  </div>

                  <div className="cn-summary-item">
                    <span className="cn-summary-label">Timeline</span>
                    <span className="cn-summary-value">
                      {selectedTL?.label}
                      {form.timeline === "custom" && form.customDays
                        ? ` \u00b7 ${form.customDays}d`
                        : ""}
                    </span>
                  </div>

                  <div className="cn-summary-item">
                    <span className="cn-summary-label">Est. Budget</span>
                    <span className="cn-summary-value">
                      ${estBudget.toLocaleString()}
                    </span>
                  </div>

                  <div className="cn-summary-item cn-summary-item--full">
                    <span className="cn-summary-label">Creator Brief</span>
                    <span className="cn-summary-value">
                      {form.creatorBrief || "\u2014"}
                    </span>
                  </div>

                  <div className="cn-summary-item cn-summary-item--full">
                    <span className="cn-summary-label">Hero Offer</span>
                    <span className="cn-summary-value">
                      {form.heroOffer || "\u2014"}
                    </span>
                  </div>

                  <div className="cn-summary-item cn-summary-item--full">
                    <span className="cn-summary-label">Sustained Offer</span>
                    <span className="cn-summary-value">
                      {form.sustainedOffer || "\u2014"}
                    </span>
                  </div>
                </div>

                {/* Verification stack diagram */}
                <div className="cn-stack">
                  <p className="cn-stack-label">
                    ConversionOracle\u2122 Verification Stack
                  </p>
                  <div className="cn-stack-layers">
                    <div className="cn-stack-layer">
                      <span className="cn-stack-layer-n">L1</span>
                      <span className="cn-stack-layer-name">QR Scan</span>
                      <span className="cn-stack-layer-desc">
                        Unique per-creator code at point of entry
                      </span>
                    </div>
                    <div className="cn-stack-layer">
                      <span className="cn-stack-layer-n">L2</span>
                      <span className="cn-stack-layer-name">
                        Claude Vision OCR
                      </span>
                      <span className="cn-stack-layer-desc">
                        Receipt matched to campaign + timestamp
                      </span>
                    </div>
                    <div className="cn-stack-layer">
                      <span className="cn-stack-layer-n">L3</span>
                      <span className="cn-stack-layer-name">Geo-match</span>
                      <span className="cn-stack-layer-desc">
                        Location + device fingerprint triangulation
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="cn-nav">
                <button
                  type="button"
                  className="cn-btn cn-btn--ghost"
                  onClick={handleBack}
                  disabled={launching}
                >
                  \u2190 Edit
                </button>
                <div style={{ display: "flex", gap: "10px" }}>
                  <button
                    type="button"
                    className="cn-btn cn-btn--draft"
                    onClick={() => handleLaunch(true)}
                    disabled={launching}
                  >
                    Save as draft
                  </button>
                  <button
                    type="button"
                    className="cn-btn cn-btn--publish"
                    onClick={() => handleLaunch(false)}
                    disabled={launching}
                  >
                    {launching ? (
                      <>
                        <span className="cn-dots" aria-hidden="true">
                          <span className="cn-dot" />
                          <span className="cn-dot" />
                          <span className="cn-dot" />
                        </span>
                        <span className="sr-only">Launching\u2026</span>
                      </>
                    ) : (
                      "Launch campaign \u2192"
                    )}
                  </button>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
