"use client";

/* ============================================================
   <ApplyModal> — step-by-step apply wizard
   v13 · 2026-05-09

   Was a single-screen form (v12). Now a 5-step quiz wizard so
   each question gets full attention + the merchant gets clean
   structured signal back. Slot is required upstream; if user
   tried to open without a slot the campaign page redirects them
   to the Calendar tab first (this component assumes selectedSlot
   is non-null).

   Steps:
     1. Slot confirmation (read-only summary + edit)
     2. Familiarity (3 ink-pill choices)
     3. Angle (textarea, ≥10 chars to advance)
     4. Setup (3 ink-pill choices)
     5. Confirm (2 checkboxes + Submit)

   Footer: Back / Next (Submit on step 5). Progress dots top-left.
   Esc closes when not submitting; backdrop click likewise.
   ============================================================ */

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Clock, X, MapPin, ArrowLeft, ArrowRight } from "lucide-react";
import type { Campaign } from "@/lib/mocks/campaigns";
import { applyToCampaign } from "@/lib/data/live-applications";
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
  onClose: () => void;
  /** Triggered when user wants to change their slot — closes modal +
   *  switches the campaign page back to the Calendar tab. */
  onEditSlot: () => void;
}) {
  const router = useRouter();
  const [step, setStep] = useState<Step>(1);
  const [familiarity, setFamiliarity] = useState<QuizFamiliarity | null>(null);
  const [angle, setAngle] = useState("");
  const [setup, setSetup] = useState<QuizSetup | null>(null);
  const [confirmDeliver, setConfirmDeliver] = useState(false);
  const [confirmDisclose, setConfirmDisclose] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

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

  /* Per-step gate — can the user advance? */
  const canAdvance = (() => {
    switch (step) {
      case 1: return true; // slot already picked, just confirm
      case 2: return familiarity !== null;
      case 3: return angle.trim().length >= 10;
      case 4: return setup !== null;
      case 5: return confirmDeliver && confirmDisclose;
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
    applyToCampaign({
      campaign,
      slotIso,
      familiarity: familiarity ?? undefined,
      angle: angle.trim() || undefined,
      setup: setup ?? undefined,
      confirmedDeliver: true,
      confirmedDisclose: true,
    });
    setSubmitted(true);
    window.setTimeout(() => {
      router.push("/creator/work/applied");
    }, 1100);
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
        {/* Close button */}
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
            {/* Progress rail — thin top bar, no chrome words */}
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

            {/* Step body — hero question per pane */}
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
                <Step3Angle value={angle} onChange={setAngle} />
              )}
              {step === 4 && (
                <Step4Setup value={setup} onChange={setSetup} />
              )}
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

            {/* Footer — campaign anchor on left, Back/Next on right */}
            <div className="apply-mdl__foot">
              <p
                id="apply-mdl-title"
                className="apply-mdl__anchor"
                aria-hidden
              >
                <span className="apply-mdl__anchor-num">
                  {String(step).padStart(2, "0")} / {String(TOTAL_STEPS).padStart(2, "0")}
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
                    submitting ? "Submitting…" : "Submit application"
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

      <button
        type="button"
        className="apply-mdl__edit-link"
        onClick={onEdit}
      >
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
      <h2 className="apply-mdl__h">
        How well do you know {merchantName}?
      </h2>
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
          >
            <span className="apply-mdl__opt-label">{FAMILIARITY_LABEL[k]}</span>
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

/* ── Step 3 — Angle ──────────────────────────────────────── */

function Step3Angle({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="apply-mdl__pane">
      <h2 className="apply-mdl__h">What&apos;s your angle?</h2>
      <p className="apply-mdl__sub">
        One or two sentences. The merchant&apos;s decision often hinges on
        this — what makes your content fit?
      </p>

      <textarea
        className="apply-mdl__textarea"
        placeholder="e.g. The manga shelf hasn't changed since '98 — my mom shopped here, now I do too. I'd film the dive in handheld, no fast cuts."
        maxLength={280}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={5}
        autoFocus
      />
      <div className="apply-mdl__count-row">
        <span
          className={`apply-mdl__count-hint${value.trim().length < 10 ? " is-warn" : ""}`}
        >
          {value.trim().length < 10
            ? "At least 10 characters"
            : "Looks good"}
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
          >
            <span className="apply-mdl__opt-label">{SETUP_LABEL[k]}</span>
            <span className="apply-mdl__opt-desc">
              {k === "phone" && "iPhone or Android — handheld, native camera"}
              {k === "phone-plus" && "Phone + ring light, gimbal, or external mic"}
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

      {/* Review summary */}
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

      {/* 2 confirms (gating) */}
      <div className="apply-mdl__confirm">
        <label className="apply-mdl__chk">
          <input
            type="checkbox"
            checked={confirmDeliver}
            onChange={(e) => setConfirmDeliver(e.target.checked)}
          />
          <span>
            I can shoot at this slot and deliver by the deadline.
          </span>
        </label>
        <label className="apply-mdl__chk">
          <input
            type="checkbox"
            checked={confirmDisclose}
            onChange={(e) => setConfirmDisclose(e.target.checked)}
          />
          <span>
            I&apos;ll disclose with <code>#ad</code> + partner tag (FTC).
          </span>
        </label>
      </div>
    </div>
  );
}

/* ── Success ─────────────────────────────────────────────── */

function SuccessState({ campaign }: { campaign: Campaign }) {
  return (
    <div className="apply-mdl__success">
      <div className="apply-mdl__success-tick" aria-hidden>✓</div>
      <p className="apply-mdl__success-title">Application sent</p>
      <p className="apply-mdl__success-sub">
        {campaign.merchantName} typically replies in ~24 h. Heading to your
        applied list…
      </p>
    </div>
  );
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
