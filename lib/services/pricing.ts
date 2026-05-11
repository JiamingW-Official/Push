export interface Deliverable {
  type: string;
  count: number;
  unitPay: number;
  estHoursEach: number;
  /** v23 — what the creator actually needs to capture. One sentence,
   *  merchant-voice. Synthesized from `type` in enrichCampaign() if
   *  the merchant didn't write one explicitly. */
  description?: string;
  /** v23 — format constraints (aspect, duration, frame count).
   *  Rendered as a chip on the deliverable card. */
  format?: string;
  /** v23 — short shot-list / what the merchant wants to see.
   *  3-5 bullets max. */
  shotList?: string[];
}

export interface NormalizedPay {
  /** "$250" for per-campaign or "$32 / visit" for per-unit */
  headline: string;
  /** "~$96 total · ~$43/hr est." — empty string if cannot compute */
  estimate: string;
}

/** Normalize a campaign's payout into a human-comparable headline + hourly estimate.
 *  Never fabricates an estimate — returns "" if deliverables data is insufficient. */
export function normalizePay(
  cashPay: number,
  payUnit: string,
  deliverables: Deliverable[],
): NormalizedPay {
  if (cashPay <= 0) return { headline: "—", estimate: "" };

  const headline =
    payUnit === "campaign" ? `$${cashPay}` : `$${cashPay} / ${payUnit}`;

  if (!deliverables.length) return { headline, estimate: "" };

  const totalPay = deliverables.reduce(
    (sum, d) => sum + d.count * d.unitPay,
    0,
  );
  const totalHours = deliverables.reduce(
    (sum, d) => sum + d.count * d.estHoursEach,
    0,
  );

  if (totalHours <= 0) return { headline, estimate: `~$${totalPay} total` };

  const hourlyEst = Math.round(totalPay / totalHours);
  return {
    headline,
    estimate: `~$${totalPay} total · ~$${hourlyEst}/hr est.`,
  };
}

/** Compute total normalized pay for sorting (uses deliverables when available). */
export function totalNormalizedPay(
  cashPay: number,
  deliverables: Deliverable[],
): number {
  if (!deliverables.length) return cashPay;
  return deliverables.reduce((sum, d) => sum + d.count * d.unitPay, 0);
}

/** Estimated total hours of work across all deliverables. 0 when unknown. */
export function estimatedHours(deliverables: Deliverable[]): number {
  if (!deliverables.length) return 0;
  return deliverables.reduce((sum, d) => sum + d.count * d.estHoursEach, 0);
}

/** Effective $/hour for ranking and the "$/hr" display.
 *  Returns 0 if either pay or time data is missing — callers should treat 0
 *  as "unknown" not "free" and exclude it from rate-based filters. */
export function effectiveHourlyRate(
  cashPay: number,
  deliverables: Deliverable[],
): number {
  const hours = estimatedHours(deliverables);
  if (hours <= 0) return 0;
  const total = totalNormalizedPay(cashPay, deliverables);
  return Math.round(total / hours);
}
