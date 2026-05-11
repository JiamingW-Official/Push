"use client";

/* ============================================================
   <MerchantAgent /> — Push AI strip for the create-campaign wizard
   v1 · 2026-05-10

   Mirror of the creator-side ApplyModal v15 agent strip. Sits at
   the top of the wizard (above the rail heading) and shows:
     - Sparkles icon + "Push AI" attribution
     - Per-step contextual narrative ("I'll polish this brief…")
     - One-click "Auto-fill" button → calls suggestX() helpers
       and writes the result into the form

   The component is read-only on the wizard's state — the parent
   passes `form` + `setField` so the agent can write back without
   owning state itself.
   ============================================================ */

import { useState } from "react";
import { Sparkles, Wand2, Loader2, CheckCircle2 } from "lucide-react";
import {
  suggestBrief,
  suggestCampaignName,
  type BriefContext,
  type MerchantCategory,
} from "@/lib/services/merchant-ai";

export type WizardStep = 1 | 2 | 3 | 4 | 5 | 6 | 7;

export interface MerchantAgentForm {
  name: string;
  category: string;
  description: string;
  budget: string;
}

export function MerchantAgent({
  step,
  form,
  setField,
  merchantName,
  neighborhood,
}: {
  step: WizardStep;
  form: MerchantAgentForm;
  setField: (key: "name" | "description", value: string) => void;
  /** Display-only — the merchant brand for AI prompts. Defaults to
   *  "Your spot" if not provided. */
  merchantName?: string;
  /** Neighborhood used to anchor AI suggestions. Falls back to
   *  "your neighborhood" if missing. */
  neighborhood?: string;
}) {
  const [working, setWorking] = useState<null | "autofill">(null);
  const [filled, setFilled] = useState(false);

  const canAutofill =
    step === 1 && (form.name.trim() === "" || form.description.trim() === "");

  function handleAutofill() {
    if (working || !canAutofill) return;
    const ctx: BriefContext = {
      category: (form.category as MerchantCategory) || "FOOD & DRINK",
      neighborhood: neighborhood ?? "your neighborhood",
      merchantName: merchantName,
    };
    setWorking("autofill");
    window.setTimeout(() => {
      if (form.name.trim() === "") {
        setField("name", suggestCampaignName(ctx));
      }
      if (form.description.trim() === "") {
        setField("description", suggestBrief(ctx));
      }
      setFilled(true);
      setWorking(null);
    }, 850);
  }

  return (
    <div className="ma-strip" role="status" aria-live="polite">
      <span className="ma-strip__icon" aria-hidden>
        <Sparkles size={13} strokeWidth={2} />
      </span>
      <p className="ma-strip__text">
        <strong>Push AI</strong>{" "}
        <span className="ma-strip__narrative">
          {agentNarrative(step, { form, working })}
        </span>
      </p>
      {step === 1 && (
        <button
          type="button"
          className="ma-strip__cta"
          onClick={handleAutofill}
          disabled={!!working || !canAutofill || filled}
          aria-label="Auto-fill name + description with AI"
        >
          {working === "autofill" ? (
            <>
              <Loader2
                size={12}
                strokeWidth={2.25}
                className="ma-strip__spin"
              />
              Drafting…
            </>
          ) : filled ? (
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
      )}
    </div>
  );
}

/** Per-step narrative text. Static voice — friendly, action-oriented. */
function agentNarrative(
  step: WizardStep,
  ctx: { form: MerchantAgentForm; working: null | "autofill" },
): string {
  if (ctx.working === "autofill") {
    return "Drafting your campaign name + brief in your voice…";
  }
  switch (step) {
    case 1:
      if (ctx.form.name.trim() === "" && ctx.form.description.trim() === "") {
        return "Tap Auto-fill for a draft I'll write from your category, or type your own. I'll polish it after.";
      }
      if (
        ctx.form.description.trim().length > 0 &&
        ctx.form.description.trim().length < 60
      ) {
        return "Description is a little short — 2-3 more sentences helps creators visualize.";
      }
      return "Looking good. Strength meter under the description shows what creators will see.";
    case 2:
      return "Set a budget and I'll suggest a fair total based on category + effort.";
    case 3:
      return "Pick what creators will deliver. I can suggest a balanced bundle for your budget.";
    case 4:
      return "Choose which of your locations qualify for this campaign.";
    case 5:
      return "Configure your hero offer — the headline incentive creators see first.";
    case 6:
      return "Review and publish. Once live, vetted creators can apply within minutes.";
    default:
      return "Almost there — review your settings before publishing.";
  }
}
