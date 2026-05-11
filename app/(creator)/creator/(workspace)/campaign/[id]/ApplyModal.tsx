"use client";

/* ============================================================
   <ApplyModal> — agentic apply wizard
   v15 · 2026-05-09 — AI assistance + system green check

   v14 was a 5-step structured quiz. v15 adds an agentic layer:
   AI suggests answers, drafts the open-ended angle paragraph,
   polishes the user's draft, and offers a one-click "auto-fill"
   for users who want to skim through. All AI work is local
   (deterministic synthesis from creator profile + campaign
   context) so the demo flow has no network dependency, but the
   UI sells the production agent experience.

   Steps (unchanged from v14):
     1. Slot confirmation
     2. Familiarity
     3. Angle (now AI-assisted)
     4. Setup
     5. Confirm + Submit

   Visual shifts:
     - "Auto-fill with AI" button at the top of the rail
     - AI Assist panel under the angle textarea: Suggest / Polish
       buttons + 4-dimension strength meter (Length / Specific /
       Sensory / Fit) + suggestion chips
     - System green CheckCircle2 replaces hand-drawn ✓ in
       SuccessState + native checkboxes (Step 5)
     - Agent narrative line at the top of each step ("I locked
       your slot…")

   Push DNA: brand red primary, ink dark for selections, system
   green #34c759 for confirmed states, N2W blue for AI moments.
   ============================================================ */

import { useEffect, useState, useMemo, useCallback } from "react";
import {
  Clock,
  X,
  MapPin,
  ArrowLeft,
  ArrowRight,
  Sparkles,
  Wand2,
  Loader2,
  CheckCircle2,
  Lightbulb,
} from "lucide-react";
import type { Campaign } from "@/lib/mocks/campaigns";
import {
  applyToCampaign,
  patchApplication,
} from "@/lib/data/live-applications";
import type {
  QuizFamiliarity,
  QuizSetup,
} from "@/lib/data/hooks/useCreatorApplications";

type SelectedSlot = {
  date: string;
  startTime: string;
  endTime: string;
};

type Step = 1 | 2 | 3 | 4 | 5;
const TOTAL_STEPS: Step = 5;

const FAMILIARITY_LABEL: Record<QuizFamiliarity, string> = {
  first: "First time",
  few: "Once or twice",
  regular: "Regular",
};
const SETUP_LABEL: Record<QuizSetup, string> = {
  phone: "Phone only",
  "phone-plus": "Phone + accessories",
  pro: "Pro camera",
};

export function ApplyModal({
  campaign,
  selectedSlot,
  onClose,
  onEditSlot,
}: {
  campaign: Campaign;
  selectedSlot: SelectedSlot;
  /** Closes the modal. v15 parent listens to the live-applications
   *  store via useApplicationForCampaign and transforms /campaign/[id]
   *  into post-apply state on next render — no redirect needed. */
  onClose: () => void;
  onEditSlot: () => void;
}) {
  const [step, setStep] = useState<Step>(1);
  const [familiarity, setFamiliarity] = useState<QuizFamiliarity | null>(null);
  const [angle, setAngle] = useState("");
  const [setup, setSetup] = useState<QuizSetup | null>(null);
  const [confirmDeliver, setConfirmDeliver] = useState(false);
  const [confirmDisclose, setConfirmDisclose] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  /* AI state */
  const [aiThinking, setAiThinking] = useState<
    null | "suggest" | "polish" | "autofill"
  >(null);
  const [autofilled, setAutofilled] = useState(false);

  /* Lock body scroll + Esc to close. */
  useEffect(() => {
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape" && !submitting) onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = original;
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose, submitting]);

  /* ── AI handlers ───────────────────────────────────────── */

  /* Synthesize a merchant-aware angle draft for the textarea. */
  const draftAngle = useCallback((): string => {
    return generateAngleDraft(campaign, familiarity);
  }, [campaign, familiarity]);

  const handleSuggestAngle = useCallback(() => {
    if (aiThinking) return;
    setAiThinking("suggest");
    // Simulated latency — feels like a real agent thinking.
    window.setTimeout(() => {
      setAngle(draftAngle());
      setAiThinking(null);
    }, 700);
  }, [aiThinking, draftAngle]);

  const handlePolishAngle = useCallback(() => {
    if (aiThinking || angle.trim().length < 10) return;
    setAiThinking("polish");
    window.setTimeout(() => {
      setAngle(polishAngle(angle, campaign));
      setAiThinking(null);
    }, 800);
  }, [aiThinking, angle, campaign]);

  const handleAutofillAll = useCallback(() => {
    if (aiThinking || autofilled) return;
    setAiThinking("autofill");
    window.setTimeout(() => {
      // Pick the most plausible defaults for a creator on Push.
      setFamiliarity((prev) => prev ?? "few");
      setSetup((prev) => prev ?? "phone-plus");
      setAngle((prev) => (prev.trim().length >= 10 ? prev : draftAngle()));
      setAutofilled(true);
      setAiThinking(null);
    }, 900);
  }, [aiThinking, autofilled, draftAngle]);

  /* Per-step gate. */
  const canAdvance = (() => {
    switch (step) {
      case 1:
        return true;
      case 2:
        return familiarity !== null;
      case 3:
        return angle.trim().length >= 10;
      case 4:
        return setup !== null;
      case 5:
        return confirmDeliver && confirmDisclose;
    }
  })();

  function handleNext() {
    if (!canAdvance || submitting) return;
    if (step < TOTAL_STEPS) {
      setStep((step + 1) as Step);
    } else {
      handleSubmit();
    }
  }

  function handleBack() {
    if (step > 1 && !submitting) setStep((step - 1) as Step);
  }

  function handleSubmit() {
    if (!confirmDeliver || !confirmDisclose) return;
    setSubmitting(true);
    const slotIso = `${selectedSlot.date}T${selectedSlot.startTime}`;
    const clientApp = applyToCampaign({
      campaign,
      slotIso,
      familiarity: familiarity ?? undefined,
      angle: angle.trim() || undefined,
      setup: setup ?? undefined,
      confirmedDeliver: true,
      confirmedDisclose: true,
    });
    // Register with server so merchant can see applicant + approve
    fetch("/api/creator/apply", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ campaign_id: campaign.id }),
    })
      .then((r) => (r.ok ? r.json() : null))
      .then((data: { application_id?: string } | null) => {
        if (data?.application_id) {
          patchApplication(clientApp.id, { serverAppId: data.application_id });
        }
      })
      .catch(() => {});
    setSubmitted(true);
    /* v15 — no redirect. Hold the success animation on screen for
       1.4s so the creator registers the green check + ETA, then
       close. The campaign page is already subscribed to the live-
       applications store via useApplicationForCampaign — it will
       have transformed into post-apply state by the time the modal
       fades out. */
    window.setTimeout(() => {
      onClose();
    }, 1400);
  }

  return (
    <div
      className="apply-mdl-backdrop"
      onClick={() => !submitting && onClose()}
      role="dialog"
      aria-modal="true"
      aria-labelledby="apply-mdl-title"
    >
      <div
        className={`apply-mdl${submitted ? " is-submitted" : ""}`}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          className="apply-mdl__close"
          onClick={onClose}
          disabled={submitting}
          aria-label="Close"
        >
          <X size={16} strokeWidth={2} />
        </button>

        {submitted ? (
          <SuccessState campaign={campaign} />
        ) : (
          <>
            {/* Progress rail */}
            <div
              className="apply-mdl__rail"
              role="progressbar"
              aria-valuenow={step}
              aria-valuemin={1}
              aria-valuemax={TOTAL_STEPS}
              aria-label={`Step ${step} of ${TOTAL_STEPS}`}
            >
              <span
                className="apply-mdl__rail-fill"
                style={{ width: `${(step / TOTAL_STEPS) * 100}%` }}
              />
            </div>

            {/* v15 — Agent strip directly under the rail. Sets a
                "Push AI is helping you" tone for the whole flow,
                and surfaces the one-click autofill. */}
            <div className="apply-mdl__agent" aria-live="polite">
              <span className="apply-mdl__agent-icon" aria-hidden>
                <Sparkles size={13} strokeWidth={2} />
              </span>
              <p className="apply-mdl__agent-text">
                <strong>Push AI</strong>{" "}
                <span className="apply-mdl__agent-narrative">
                  {agentNarrative(step, {
                    familiarity,
                    angle,
                    setup,
                    autofilled,
                    aiThinking,
                  })}
                </span>
              </p>
              <button
                type="button"
                className="apply-mdl__agent-cta"
                onClick={handleAutofillAll}
                disabled={!!aiThinking || autofilled || submitting}
                aria-label="Auto-fill all answers with AI"
              >
                {aiThinking === "autofill" ? (
                  <>
                    <Loader2
                      size={12}
                      strokeWidth={2.25}
                      className="apply-mdl__spin"
                    />
                    Filling…
                  </>
                ) : autofilled ? (
                  <>
                    <CheckCircle2 size={12} strokeWidth={2.25} />
                    Filled
                  </>
                ) : (
                  <>
                    <Wand2 size={12} strokeWidth={2.25} />
                    Auto-fill
                  </>
                )}
              </button>
            </div>

            {/* Step body */}
            <div className="apply-mdl__step" key={step}>
              <span className="apply-mdl__stepnum" aria-hidden>
                {String(step).padStart(2, "0")}
              </span>
              {step === 1 && (
                <Step1Slot
                  slot={selectedSlot}
                  campaign={campaign}
                  onEdit={onEditSlot}
                />
              )}
              {step === 2 && (
                <Step2Familiarity
                  merchantName={campaign.merchantName}
                  value={familiarity}
                  onChange={setFamiliarity}
                />
              )}
              {step === 3 && (
                <Step3Angle
                  campaign={campaign}
                  value={angle}
                  onChange={setAngle}
                  onSuggest={handleSuggestAngle}
                  onPolish={handlePolishAngle}
                  aiThinking={aiThinking}
                />
              )}
              {step === 4 && <Step4Setup value={setup} onChange={setSetup} />}
              {step === 5 && (
                <Step5Confirm
                  campaign={campaign}
                  slot={selectedSlot}
                  familiarity={familiarity}
                  angle={angle}
                  setup={setup}
                  confirmDeliver={confirmDeliver}
                  setConfirmDeliver={setConfirmDeliver}
                  confirmDisclose={confirmDisclose}
                  setConfirmDisclose={setConfirmDisclose}
                />
              )}
            </div>

            {/* Footer */}
            <div className="apply-mdl__foot">
              <p id="apply-mdl-title" className="apply-mdl__anchor" aria-hidden>
                <span className="apply-mdl__anchor-num">
                  {String(step).padStart(2, "0")} /{" "}
                  {String(TOTAL_STEPS).padStart(2, "0")}
                </span>
                <span className="apply-mdl__anchor-sep">·</span>
                <span className="apply-mdl__anchor-brand">
                  {campaign.merchantName}
                </span>
              </p>
              <div className="apply-mdl__nav">
                {step > 1 ? (
                  <button
                    type="button"
                    className="apply-mdl__btn apply-mdl__btn--ghost"
                    onClick={handleBack}
                    disabled={submitting}
                  >
                    <ArrowLeft size={14} strokeWidth={2} />
                    Back
                  </button>
                ) : (
                  <button
                    type="button"
                    className="apply-mdl__btn apply-mdl__btn--ghost"
                    onClick={onClose}
                    disabled={submitting}
                  >
                    Cancel
                  </button>
                )}
                <button
                  type="button"
                  className="apply-mdl__btn apply-mdl__btn--primary"
                  onClick={handleNext}
                  disabled={!canAdvance || submitting}
                  aria-disabled={!canAdvance || submitting}
                >
                  {step === TOTAL_STEPS ? (
                    submitting ? (
                      "Submitting…"
                    ) : (
                      "Submit application"
                    )
                  ) : (
                    <>
                      Next
                      <ArrowRight size={14} strokeWidth={2} />
                    </>
                  )}
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/* ── Agent narrative — context-aware "Push AI" line ──────── */

function agentNarrative(
  step: Step,
  ctx: {
    familiarity: QuizFamiliarity | null;
    angle: string;
    setup: QuizSetup | null;
    autofilled: boolean;
    aiThinking: null | "suggest" | "polish" | "autofill";
  },
): string {
  if (ctx.aiThinking === "autofill")
    return "Drafting your answers from your profile…";
  if (ctx.aiThinking === "suggest")
    return "Drafting an angle in the merchant's voice…";
  if (ctx.aiThinking === "polish")
    return "Tightening your draft for clarity and fit…";
  if (ctx.autofilled && step < 5)
    return "Filled with smart defaults — review and edit each step before submitting.";
  switch (step) {
    case 1:
      return "I'll lock this slot the moment you submit. Tap Next to confirm.";
    case 2:
      return ctx.familiarity
        ? `Logged: ${FAMILIARITY_LABEL[ctx.familiarity].toLowerCase()}. The merchant will see this on your card.`
        : "Tell the merchant your relationship with the place — it shapes their decision.";
    case 3:
      if (ctx.angle.trim().length === 0)
        return "Tap Suggest below for a draft, or write your own. I'll polish it after.";
      if (ctx.angle.trim().length < 10)
        return "Keep going — at least 10 characters before you can advance.";
      return "Looking good. Tap Polish if you want me to tighten it.";
    case 4:
      return ctx.setup
        ? `Setup logged: ${SETUP_LABEL[ctx.setup].toLowerCase()}. One step left.`
        : "What you bring sets the merchant's expectation for the cut.";
    case 5:
      return "Final review. Both checks are required by FTC and Push policy.";
  }
}

/* ── Step 1 — Slot confirmation ──────────────────────────── */

function Step1Slot({
  slot,
  campaign,
  onEdit,
}: {
  slot: SelectedSlot;
  campaign: Campaign;
  onEdit: () => void;
}) {
  return (
    <div className="apply-mdl__pane">
      <h2 className="apply-mdl__h">Confirm your shoot slot</h2>
      <p className="apply-mdl__sub">
        This is a commitment. The merchant accepts based on this slot — no
        rescheduling once approved.
      </p>

      <div className="apply-mdl__slot-card">
        <div className="apply-mdl__slot-row">
          <Clock size={14} strokeWidth={2.25} />
          <span className="apply-mdl__slot-when">
            {formatLongDate(slot.date)} · {slot.startTime} – {slot.endTime}
          </span>
        </div>
        {campaign.address && (
          <div className="apply-mdl__slot-row apply-mdl__slot-row--meta">
            <MapPin size={12} strokeWidth={2.25} />
            <span>
              {campaign.address.line1}, {campaign.address.city}
            </span>
          </div>
        )}
      </div>

      <button type="button" className="apply-mdl__edit-link" onClick={onEdit}>
        Change slot →
      </button>
    </div>
  );
}

/* ── Step 2 — Familiarity ────────────────────────────────── */

function Step2Familiarity({
  merchantName,
  value,
  onChange,
}: {
  merchantName: string;
  value: QuizFamiliarity | null;
  onChange: (v: QuizFamiliarity) => void;
}) {
  return (
    <div className="apply-mdl__pane">
      <h2 className="apply-mdl__h">How well do you know {merchantName}?</h2>
      <p className="apply-mdl__sub">
        Helps the merchant judge how authentic your content can feel.
      </p>

      <div className="apply-mdl__opts apply-mdl__opts--vert">
        {(["first", "few", "regular"] as QuizFamiliarity[]).map((k) => (
          <button
            key={k}
            type="button"
            className={`apply-mdl__opt apply-mdl__opt--vert${value === k ? " is-selected" : ""}`}
            onClick={() => onChange(k)}
            aria-pressed={value === k}
          >
            <span className="apply-mdl__opt-row">
              <span className="apply-mdl__opt-label">
                {FAMILIARITY_LABEL[k]}
              </span>
              {value === k && (
                <span className="apply-mdl__opt-tick" aria-hidden>
                  <CheckCircle2 size={18} strokeWidth={2.5} />
                </span>
              )}
            </span>
            <span className="apply-mdl__opt-desc">
              {k === "first" && "I haven't been before"}
              {k === "few" && "I've visited a couple of times"}
              {k === "regular" && "I'm a regular — I shop here ≥ monthly"}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

/* ── Step 3 — Angle (AI-assisted) ────────────────────────── */

function Step3Angle({
  campaign,
  value,
  onChange,
  onSuggest,
  onPolish,
  aiThinking,
}: {
  campaign: Campaign;
  value: string;
  onChange: (v: string) => void;
  onSuggest: () => void;
  onPolish: () => void;
  aiThinking: null | "suggest" | "polish" | "autofill";
}) {
  const strength = useMemo(
    () => analyzeAngle(value, campaign),
    [value, campaign],
  );
  const suggestionChips = useMemo(
    () => suggestionChipsFor(value, campaign),
    [value, campaign],
  );

  return (
    <div className="apply-mdl__pane">
      <h2 className="apply-mdl__h">What&apos;s your angle?</h2>
      <p className="apply-mdl__sub">
        One or two sentences. The merchant&apos;s decision often hinges on this
        — what makes your content fit?
      </p>

      <div className="apply-mdl__textarea-wrap">
        <textarea
          className="apply-mdl__textarea"
          placeholder="e.g. The manga shelf hasn't changed since '98 — my mom shopped here, now I do too. I'd film the dive in handheld, no fast cuts."
          maxLength={280}
          value={
            aiThinking === "suggest" || aiThinking === "polish" ? "" : value
          }
          onChange={(e) => onChange(e.target.value)}
          rows={5}
          autoFocus
          disabled={aiThinking === "suggest" || aiThinking === "polish"}
        />
        {(aiThinking === "suggest" || aiThinking === "polish") && (
          <div className="apply-mdl__textarea-skeleton" aria-hidden>
            <span className="apply-mdl__skeleton-line" />
            <span className="apply-mdl__skeleton-line apply-mdl__skeleton-line--80" />
            <span className="apply-mdl__skeleton-line apply-mdl__skeleton-line--60" />
          </div>
        )}
      </div>

      {/* AI Assist panel — Suggest / Polish + strength meter + chips */}
      <div className="apply-mdl__ai">
        <div className="apply-mdl__ai-row">
          <button
            type="button"
            className="apply-mdl__ai-btn apply-mdl__ai-btn--primary"
            onClick={onSuggest}
            disabled={!!aiThinking}
          >
            {aiThinking === "suggest" ? (
              <>
                <Loader2
                  size={13}
                  strokeWidth={2.25}
                  className="apply-mdl__spin"
                />
                Drafting…
              </>
            ) : (
              <>
                <Sparkles size={13} strokeWidth={2.25} />
                {value.trim().length === 0 ? "Suggest a draft" : "Re-draft"}
              </>
            )}
          </button>
          <button
            type="button"
            className="apply-mdl__ai-btn apply-mdl__ai-btn--ghost"
            onClick={onPolish}
            disabled={!!aiThinking || value.trim().length < 10}
            title={
              value.trim().length < 10
                ? "Write at least 10 characters first"
                : "Tighten and clarify with AI"
            }
          >
            {aiThinking === "polish" ? (
              <>
                <Loader2
                  size={13}
                  strokeWidth={2.25}
                  className="apply-mdl__spin"
                />
                Polishing…
              </>
            ) : (
              <>
                <Wand2 size={13} strokeWidth={2.25} />
                Polish
              </>
            )}
          </button>
        </div>

        {/* 4-dimension strength meter — Grammarly-style */}
        <div className="apply-mdl__meter" aria-label="Answer strength">
          {strength.dims.map((d) => (
            <div
              key={d.key}
              className={`apply-mdl__meter-dim apply-mdl__meter-dim--${d.state}`}
              title={d.hint}
            >
              <span className="apply-mdl__meter-dot" aria-hidden />
              <span className="apply-mdl__meter-lbl">{d.label}</span>
            </div>
          ))}
        </div>

        {/* Inline suggestions when text exists */}
        {value.trim().length > 0 && suggestionChips.length > 0 && (
          <div className="apply-mdl__chips" aria-label="Suggestions">
            <span className="apply-mdl__chips-eyebrow">
              <Lightbulb size={11} strokeWidth={2.25} />
              Try
            </span>
            {suggestionChips.map((c) => (
              <span key={c} className="apply-mdl__chip">
                {c}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="apply-mdl__count-row">
        <span
          className={`apply-mdl__count-hint${value.trim().length < 10 ? " is-warn" : ""}`}
        >
          {value.trim().length < 10
            ? "At least 10 characters"
            : strength.summary}
        </span>
        <span className="apply-mdl__count">{value.length} / 280</span>
      </div>
    </div>
  );
}

/* ── Step 4 — Setup ──────────────────────────────────────── */

function Step4Setup({
  value,
  onChange,
}: {
  value: QuizSetup | null;
  onChange: (v: QuizSetup) => void;
}) {
  return (
    <div className="apply-mdl__pane">
      <h2 className="apply-mdl__h">What&apos;s your production setup?</h2>
      <p className="apply-mdl__sub">
        Sets expectations — the merchant gets to see what gear you&apos;ll
        bring.
      </p>

      <div className="apply-mdl__opts apply-mdl__opts--vert">
        {(["phone", "phone-plus", "pro"] as QuizSetup[]).map((k) => (
          <button
            key={k}
            type="button"
            className={`apply-mdl__opt apply-mdl__opt--vert${value === k ? " is-selected" : ""}`}
            onClick={() => onChange(k)}
            aria-pressed={value === k}
          >
            <span className="apply-mdl__opt-row">
              <span className="apply-mdl__opt-label">{SETUP_LABEL[k]}</span>
              {value === k && (
                <span className="apply-mdl__opt-tick" aria-hidden>
                  <CheckCircle2 size={18} strokeWidth={2.5} />
                </span>
              )}
            </span>
            <span className="apply-mdl__opt-desc">
              {k === "phone" && "iPhone or Android — handheld, native camera"}
              {k === "phone-plus" &&
                "Phone + ring light, gimbal, or external mic"}
              {k === "pro" && "Mirrorless / DSLR — dedicated video setup"}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

/* ── Step 5 — Confirm + Submit ───────────────────────────── */

function Step5Confirm({
  campaign,
  slot,
  familiarity,
  angle,
  setup,
  confirmDeliver,
  setConfirmDeliver,
  confirmDisclose,
  setConfirmDisclose,
}: {
  campaign: Campaign;
  slot: SelectedSlot;
  familiarity: QuizFamiliarity | null;
  angle: string;
  setup: QuizSetup | null;
  confirmDeliver: boolean;
  setConfirmDeliver: (v: boolean) => void;
  confirmDisclose: boolean;
  setConfirmDisclose: (v: boolean) => void;
}) {
  const totalPay = campaign.deliverables.reduce(
    (s, d) => s + d.unitPay * d.count,
    0,
  );
  return (
    <div className="apply-mdl__pane">
      <h2 className="apply-mdl__h">Review and submit</h2>
      <p className="apply-mdl__sub">
        The merchant sees everything below. Both checks required to send.
      </p>

      <ul className="apply-mdl__review">
        <li className="apply-mdl__review-row">
          <span className="apply-mdl__review-lbl">Slot</span>
          <span className="apply-mdl__review-val">
            {formatLongDate(slot.date)} · {slot.startTime} – {slot.endTime}
          </span>
        </li>
        {familiarity && (
          <li className="apply-mdl__review-row">
            <span className="apply-mdl__review-lbl">Familiarity</span>
            <span className="apply-mdl__review-val">
              {FAMILIARITY_LABEL[familiarity]}
            </span>
          </li>
        )}
        {angle.trim() && (
          <li className="apply-mdl__review-row apply-mdl__review-row--block">
            <span className="apply-mdl__review-lbl">Angle</span>
            <span className="apply-mdl__review-val apply-mdl__review-val--quote">
              “{angle.trim()}”
            </span>
          </li>
        )}
        {setup && (
          <li className="apply-mdl__review-row">
            <span className="apply-mdl__review-lbl">Setup</span>
            <span className="apply-mdl__review-val">{SETUP_LABEL[setup]}</span>
          </li>
        )}
        <li className="apply-mdl__review-row">
          <span className="apply-mdl__review-lbl">Pay</span>
          <span className="apply-mdl__review-val">
            <strong>${totalPay}</strong> · paid 72h after verification
          </span>
        </li>
      </ul>

      {/* v15 — system-green CheckCircle2 confirms (was native input). */}
      <div className="apply-mdl__confirm">
        <PremiumCheckbox
          checked={confirmDeliver}
          onChange={setConfirmDeliver}
          label="I can shoot at this slot and deliver by the deadline."
        />
        <PremiumCheckbox
          checked={confirmDisclose}
          onChange={setConfirmDisclose}
          label={
            <>
              I&apos;ll disclose with <code>#ad</code> + partner tag (FTC).
            </>
          }
        />
      </div>
    </div>
  );
}

/* ── PremiumCheckbox — system green CheckCircle2 ─────────── */

function PremiumCheckbox({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: React.ReactNode;
}) {
  return (
    <label className={`apply-mdl__chk2${checked ? " is-checked" : ""}`}>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="apply-mdl__chk2-input"
      />
      <span className="apply-mdl__chk2-box" aria-hidden>
        {checked && <CheckCircle2 size={20} strokeWidth={2.5} fill="#34c759" />}
      </span>
      <span className="apply-mdl__chk2-text">{label}</span>
    </label>
  );
}

/* ── Success ─────────────────────────────────────────────── */

function SuccessState({ campaign }: { campaign: Campaign }) {
  return (
    <div className="apply-mdl__success">
      <div className="apply-mdl__success-tick" aria-hidden>
        <CheckCircle2
          size={56}
          strokeWidth={2}
          fill="#34c759"
          color="#ffffff"
        />
      </div>
      <p className="apply-mdl__success-title">Application sent</p>
      <p className="apply-mdl__success-sub">
        {campaign.merchantName} typically replies in ~24 h. Heading to your
        applied list…
      </p>
    </div>
  );
}

/* ── AI helpers (deterministic mock; production swaps to API) ── */

/** Generate a merchant-aware angle draft. Uses category + neighborhood
 *  + tagline to produce a 1-2 sentence pitch in the creator's voice
 *  that fits Push's tone (specific, sensory, no fluff). */
function generateAngleDraft(c: Campaign, fam: QuizFamiliarity | null): string {
  const m = c.merchantName;
  const place = c.neighborhood.split(",")[0]?.trim() ?? c.neighborhood;
  const familiarity =
    fam === "regular"
      ? "I shop here every other week"
      : fam === "few"
        ? "I've been a couple times"
        : "I haven't been yet, but I know the block";

  const byCategory: Record<Campaign["category"], string[]> = {
    "FOOD & DRINK": [
      `${familiarity} — ${m} is the kind of spot you tell a friend about, not a feed. I'd shoot the line outside, the order at the counter, and the first bite. No voice-over, no fast cuts.`,
      `My take on ${m}: stop trying to sell the menu, sell the morning. I'd film the 8am rush in handheld, with one closing shot of the cup walking out the door.`,
      `${familiarity}, and the regulars know me by drink. I want to film what they see when they walk in — the steam, the names being called, the booth in the back. ${place} content that doesn't try too hard.`,
    ],
    RETAIL: [
      `${familiarity}. I'd treat ${m} like a friend's apartment — slow walk, ask one question per object, film the answer. Storefront → register → the thing I came in for. No haul energy.`,
      `My angle on ${m}: the inventory is the story, not the shopper. One product, one curator quote, one walk-out shot. I'd cut it tight at 22 seconds.`,
      `${familiarity}. I'd shoot ${m} in 4pm light when ${place} actually looks like itself. Three frames: the door, the wall I love, the thing I'm holding. Caption is one line.`,
    ],
    WELLNESS: [
      `${familiarity}. I want to film the after, not the during — the walk back to the train, the unimpressed face, the receipt in hand. Wellness content that doesn't say 'sanctuary'.`,
      `${m} works because the team knows what they're doing, not because of the lighting. I'd film the consultation, the room as it is, and the part where you exhale.`,
    ],
    BEAUTY: [
      `${familiarity}. ${m} doesn't need a reveal — they need the routine. I'd film the bowl, the brush, the chair turning, and a single close-up of the texture. No before/after montage.`,
      `My angle on ${m}: the chair is the brand. I'd shoot the booking, the wait, the first conversation with the colorist. Process > product.`,
    ],
    FITNESS: [
      `${familiarity}. The hardest round is the brand. I'd film the third set, not the first, and end on the rest period — the recovery face is the whole pitch.`,
      `${m} runs on regulars who show up at 6am. I'd shoot the warmup in a wide, pull a tight on the rack assignment, and let the class do the rest.`,
    ],
    LIFESTYLE: [
      `${familiarity}. ${m} is half retail, half studio, and the wall arguments are the whole point. One curator, one wall, one why — that's the cut.`,
      `My take on ${m}: don't film the shopper, film the person who picked the thing. I'd interview one staff member about one item and let the room breathe.`,
    ],
  };
  const pool = byCategory[c.category];
  // Deterministic pick from campaign id hash so the same campaign
  // always suggests the same draft (so user can recognize re-drafts).
  const hash = simpleHash(c.id);
  return pool[hash % pool.length] ?? pool[0] ?? "";
}

/** "Polish" the user's draft — tightens language, removes filler,
 *  ensures merchant tag if missing. Mock implementation that does
 *  light, realistic edits. */
function polishAngle(text: string, c: Campaign): string {
  let t = text.trim();
  // Replace fluff words.
  const fluff: Array<[RegExp, string]> = [
    [/\bvery\s+/gi, ""],
    [/\breally\s+/gi, ""],
    [/\bjust\s+/gi, ""],
    [/\bI think\s+/gi, ""],
    [/\bI feel like\s+/gi, ""],
    [/\bkind of\s+/gi, ""],
    [/\bsort of\s+/gi, ""],
    [/\bthat is\b/gi, "that's"],
    [/\bcannot\b/gi, "can't"],
    [/\bit is\b/gi, "it's"],
  ];
  for (const [re, repl] of fluff) t = t.replace(re, repl);
  // Trim double spaces and capitalize first letter.
  t = t.replace(/\s{2,}/g, " ").trim();
  if (t.length > 0) t = t[0]!.toUpperCase() + t.slice(1);
  // Ensure trailing punctuation.
  if (!/[.!?]$/.test(t)) t += ".";
  // If merchant name not present and we have room, append it as a soft mention.
  if (
    !t.toLowerCase().includes(c.merchantName.toLowerCase()) &&
    t.length + c.merchantName.length + 16 < 280
  ) {
    t += ` That's the ${c.merchantName} cut.`;
  }
  return t;
}

interface AngleDim {
  key: "length" | "specific" | "sensory" | "fit";
  label: string;
  state: "pass" | "warn" | "miss";
  hint: string;
}

interface AngleStrength {
  dims: AngleDim[];
  summary: string;
}

/** Real-time strength check for the angle textarea. Each of 4
 *  dimensions returns pass/warn/miss based on simple heuristics:
 *  - length: ≥ 60 chars passes, 30-59 warns, < 30 misses
 *  - specific: pass if any number/year/specific noun is present
 *  - sensory: pass if any of light/loud/walk/film/shot/etc. shows up
 *  - fit: pass if merchant name OR neighborhood mentioned */
function analyzeAngle(text: string, c: Campaign): AngleStrength {
  const t = text.trim();
  const lower = t.toLowerCase();
  const len = t.length;

  const lengthState: AngleDim["state"] =
    len >= 60 ? "pass" : len >= 30 ? "warn" : "miss";

  const hasSpecific =
    /\b(19|20)\d{2}\b/.test(t) ||
    /\b\d+(\.\d+)?\b/.test(t) ||
    /\b(every|each|one|two|three|first|last)\b/i.test(t);
  const specificState: AngleDim["state"] = hasSpecific
    ? "pass"
    : len > 30
      ? "warn"
      : "miss";

  const sensoryWords = [
    "shoot",
    "film",
    "walk",
    "light",
    "loud",
    "quiet",
    "sound",
    "shot",
    "cut",
    "frame",
    "morning",
    "evening",
    "smell",
    "taste",
    "handheld",
    "wide",
    "close",
    "wide-angle",
    "vertical",
  ];
  const hasSensory = sensoryWords.some((w) => lower.includes(w));
  const sensoryState: AngleDim["state"] = hasSensory
    ? "pass"
    : len > 40
      ? "warn"
      : "miss";

  const place = c.neighborhood.split(",")[0]?.trim().toLowerCase() ?? "";
  const fitMentioned =
    lower.includes(c.merchantName.toLowerCase()) ||
    (place.length > 0 && lower.includes(place));
  const fitState: AngleDim["state"] = fitMentioned
    ? "pass"
    : len > 40
      ? "warn"
      : "miss";

  const dims: AngleDim[] = [
    {
      key: "length",
      label: "Length",
      state: lengthState,
      hint:
        lengthState === "pass"
          ? "Reads as a full thought."
          : lengthState === "warn"
            ? "Short — 1 more sentence helps."
            : "Too short. Aim for 1-2 sentences.",
    },
    {
      key: "specific",
      label: "Specific",
      state: specificState,
      hint:
        specificState === "pass"
          ? "Specific enough — numbers or concrete words."
          : "Add a specific detail (year, count, object).",
    },
    {
      key: "sensory",
      label: "Sensory",
      state: sensoryState,
      hint:
        sensoryState === "pass"
          ? "You named what you'd film."
          : "Mention a sound, light, or shot — show your eye.",
    },
    {
      key: "fit",
      label: "Fit",
      state: fitState,
      hint:
        fitState === "pass"
          ? "You tied it to the merchant or place."
          : `Mention ${c.merchantName} or ${place} once.`,
    },
  ];

  const passCount = dims.filter((d) => d.state === "pass").length;
  const summary =
    passCount === 4
      ? "Strong answer — merchant-ready."
      : passCount === 3
        ? "Good. One more tweak away from strong."
        : passCount >= 1
          ? "Some signal. Try the suggestions below."
          : "Looks good";
  return { dims, summary };
}

function suggestionChipsFor(text: string, c: Campaign): string[] {
  const t = text.trim();
  if (t.length === 0) return [];
  const s = analyzeAngle(t, c);
  const chips: string[] = [];
  for (const d of s.dims) {
    if (d.state !== "pass") {
      if (d.key === "length") chips.push("Add one more sentence");
      if (d.key === "specific") chips.push("Add a specific detail");
      if (d.key === "sensory") chips.push("Name a shot or sound");
      if (d.key === "fit") chips.push(`Mention ${c.merchantName}`);
    }
  }
  return chips.slice(0, 3);
}

/* ── Helpers ─────────────────────────────────────────────── */

function formatLongDate(iso: string): string {
  const d = new Date(iso + "T00:00");
  return d.toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
  });
}

function simpleHash(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}
