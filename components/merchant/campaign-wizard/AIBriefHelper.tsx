"use client";

/* ============================================================
   <AIBriefHelper /> — Suggest / Polish + 4-dim strength meter
   v1 · 2026-05-10

   Sits under the BASICS step's description textarea. Mirrors the
   ApplyModal v15 angle helper so the merchant feels the same
   agentic experience the creators do.

   Drives:
     - suggestBrief()  — replaces empty / weak description
     - polishBrief()   — Grammarly-style cleanup of existing draft
     - analyzeBrief()  — 4-dim strength meter (Length / Specific /
       Sensory / Local fit), live as the merchant types

   The component is value-controlled — parent owns the description
   string and exposes onChange.
   ============================================================ */

import { useMemo, useState } from "react";
import { Sparkles, Wand2, Loader2, Lightbulb } from "lucide-react";
import {
  suggestBrief,
  polishBrief,
  analyzeBrief,
  type BriefContext,
  type MerchantCategory,
  type DimState,
} from "@/lib/services/merchant-ai";

export function AIBriefHelper({
  description,
  category,
  neighborhood,
  merchantName,
  onChange,
}: {
  description: string;
  /** Form's current category value (string from the merchant
   *  picker — passed through `as MerchantCategory` here). */
  category: string;
  neighborhood?: string;
  merchantName?: string;
  onChange: (next: string) => void;
}) {
  const [working, setWorking] = useState<null | "suggest" | "polish">(null);

  const ctx: BriefContext = useMemo(
    () => ({
      category: (category as MerchantCategory) || "FOOD & DRINK",
      neighborhood: neighborhood ?? "your neighborhood",
      merchantName,
    }),
    [category, neighborhood, merchantName],
  );

  const strength = useMemo(
    () => analyzeBrief(description, ctx),
    [description, ctx],
  );

  const chips = useMemo(() => {
    if (description.trim().length === 0) return [];
    const out: string[] = [];
    for (const d of strength.dims) {
      if (d.state === "pass") continue;
      if (d.key === "length") out.push("Add another sentence");
      else if (d.key === "specific") out.push("Add a specific detail");
      else if (d.key === "sensory") out.push("Name a sound, light, or shot");
      else if (d.key === "fit") out.push(`Mention ${merchantName ?? neighborhood ?? "your spot"}`);
    }
    return out.slice(0, 3);
  }, [description, strength, merchantName, neighborhood]);

  function handleSuggest() {
    if (working) return;
    setWorking("suggest");
    window.setTimeout(() => {
      onChange(suggestBrief(ctx));
      setWorking(null);
    }, 750);
  }

  function handlePolish() {
    if (working || description.trim().length < 10) return;
    setWorking("polish");
    window.setTimeout(() => {
      onChange(polishBrief(description, ctx));
      setWorking(null);
    }, 850);
  }

  return (
    <div className="ma-helper">
      <div className="ma-helper__row">
        <button
          type="button"
          className="ma-helper__btn ma-helper__btn--primary"
          onClick={handleSuggest}
          disabled={!!working}
        >
          {working === "suggest" ? (
            <>
              <Loader2 size={13} strokeWidth={2.25} className="ma-helper__spin" />
              Drafting…
            </>
          ) : (
            <>
              <Sparkles size={13} strokeWidth={2.25} />
              {description.trim().length === 0 ? "Suggest a draft" : "Re-draft"}
            </>
          )}
        </button>
        <button
          type="button"
          className="ma-helper__btn ma-helper__btn--ghost"
          onClick={handlePolish}
          disabled={!!working || description.trim().length < 10}
          title={
            description.trim().length < 10
              ? "Write at least 10 characters first"
              : "Tighten and clarify with AI"
          }
        >
          {working === "polish" ? (
            <>
              <Loader2 size={13} strokeWidth={2.25} className="ma-helper__spin" />
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

      {/* 4-dimension strength meter — Grammarly-inspired */}
      <div className="ma-helper__meter" aria-label="Brief strength">
        {strength.dims.map((d) => (
          <div
            key={d.key}
            className={`ma-helper__meter-dim ma-helper__meter-dim--${d.state}`}
            title={d.hint}
          >
            <span className="ma-helper__meter-dot" aria-hidden />
            <span className="ma-helper__meter-lbl">{d.label}</span>
          </div>
        ))}
      </div>

      {/* Inline suggestion chips */}
      {chips.length > 0 && (
        <div className="ma-helper__chips" aria-label="Suggestions">
          <span className="ma-helper__chips-eyebrow">
            <Lightbulb size={11} strokeWidth={2.25} />
            Try
          </span>
          {chips.map((c) => (
            <span key={c} className="ma-helper__chip">{c}</span>
          ))}
        </div>
      )}

      <p className="ma-helper__summary">{strength.summary}</p>
    </div>
  );
}

/* Re-export for callers that want the dim type */
export type { DimState };
