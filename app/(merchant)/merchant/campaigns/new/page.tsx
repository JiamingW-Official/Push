"use client";

import { useState, type ChangeEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CategoryPicker } from "@/components/merchant/campaign-wizard/CategoryPicker";
import { TierSelector } from "@/components/merchant/campaign-wizard/TierSelector";
import type { CreatorTier } from "@/components/merchant/campaign-wizard/TierSelector";
import { api, type CampaignCreatePayload } from "@/lib/data/api-client";
import { MOCK_LOCATIONS } from "@/lib/merchant/mock-locations";
import type { HeroOffer, HeroOfferType } from "@/lib/offers/types";
import "./campaign-new.css";

type Step = 1 | 2 | 3 | 4 | 5 | 6;

type HeroOfferDraft = Partial<HeroOffer>;

type FormData = {
  name: string;
  category: string;
  description: string;
  budget: string;
  tier: string;
  commissionSplit: string;
  contentType: string;
  platform: string;
  dueDate: string;
  applicable_location_ids: string[];
  hero_offer: HeroOfferDraft;
  // Mystery Drop (v3): raw user text for bonus positions. Parsed on change +
  // on submit into hero_offer.bonus_positions: number[].
  bonusPositionsInput: string;
};

type FormErrorKey =
  | "name"
  | "category"
  | "description"
  | "budget"
  | "tier"
  | "commissionSplit"
  | "contentType"
  | "platform"
  | "dueDate"
  | "applicable_location_ids"
  | "hero_offer_type"
  | "hero_offer_value"
  | "hero_offer_description"
  | "hero_offer_valid_from"
  | "hero_offer_valid_until"
  | "hero_offer_max_redemptions_per_customer"
  | "hero_offer_max_redemptions_total"
  | "hero_offer_bonus_positions"
  | "hero_offer_bonus_reward_text";

const MAX_BONUS_POSITIONS = 20;

// Mirror of server-side parseBonusPositions in lib/api/campaigns.ts.
// Returns sorted unique positive int[]  OR  undefined if input is blank  OR
// the string "INVALID" sentinel if input has non-numeric tokens.
function parseBonusPositionsInput(
  raw: string,
): number[] | "INVALID" | undefined {
  const trimmed = raw.trim();
  if (!trimmed) return undefined;
  const tokens = trimmed.split(/[,\s;]+/u).filter(Boolean);
  if (tokens.length === 0) return undefined;
  const nums: number[] = [];
  for (const token of tokens) {
    const n = Number(token);
    if (!Number.isInteger(n) || n < 1) return "INVALID";
    nums.push(n);
  }
  return [...new Set(nums)].sort((a, b) => a - b);
}

type FormErrors = Partial<Record<FormErrorKey, string>>;

const STEPS: Step[] = [1, 2, 3, 4, 5, 6];

const STEP_META: Record<
  Step,
  { indicator: string; rail: string; description: string }
> = {
  1: {
    indicator: "BASICS",
    rail: "BASICS",
    description:
      "Name the campaign, choose a category, and define the creator brief.",
  },
  2: {
    indicator: "BUDGET",
    rail: "BUDGET",
    description:
      "Set the budget, creator tier, and how campaign value is allocated.",
  },
  3: {
    indicator: "DELIVERABLES",
    rail: "DELIVERABLES",
    description:
      "Define the content format, target platform, and delivery deadline.",
  },
  4: {
    indicator: "APPLICABLE LOCATIONS",
    rail: "APPLICABLE LOCATIONS",
    description:
      "Choose exactly where customers can redeem the offer in-store.",
  },
  5: {
    indicator: "HERO OFFER",
    rail: "HERO OFFER",
    description:
      "Configure the offer customers receive when they show this campaign.",
  },
  6: {
    indicator: "REVIEW",
    rail: "REVIEW",
    description: "Verify all campaign details before publishing.",
  },
};

const CONTENT_TYPES = ["post", "video", "story"] as const;
const PLATFORMS = ["Instagram", "TikTok", "Red"] as const;
const HERO_OFFER_TYPES: Array<{
  type: HeroOfferType;
  label: string;
  detail: string;
}> = [
  {
    type: "percent_off",
    label: "Percent Off",
    detail: "Show a percentage discount at checkout.",
  },
  {
    type: "fixed_amount",
    label: "Fixed Amount",
    detail: "Give a fixed dollar amount off the purchase.",
  },
  {
    type: "free_item",
    label: "Free Item",
    detail: "Offer one specific item at no charge.",
  },
  {
    type: "bogo",
    label: "BOGO",
    detail: "Buy one, get one on an eligible product.",
  },
];

function todayISO(): string {
  return new Date().toISOString().split("T")[0];
}

function toDateTimeLocalValue(date: Date): string {
  const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return localDate.toISOString().slice(0, 16);
}

function addDaysToDateTimeLocal(value: string, days: number): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }
  date.setDate(date.getDate() + days);
  return toDateTimeLocalValue(date);
}

function toIsoFromDateTimeLocal(value?: string): string | undefined {
  if (!value) {
    return undefined;
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return undefined;
  }
  return date.toISOString();
}

function createEmptyForm(): FormData {
  const campaignStart = toDateTimeLocalValue(new Date());
  return {
    name: "",
    category: "",
    description: "",
    budget: "",
    tier: "",
    commissionSplit: "70",
    contentType: "",
    platform: "",
    dueDate: "",
    applicable_location_ids: [],
    hero_offer: {
      type: undefined,
      value: "",
      max_redemptions_per_customer: 1,
      max_redemptions_total: null,
      description: "",
      valid_from: campaignStart,
      valid_until: addDaysToDateTimeLocal(campaignStart, 2),
      bonus_positions: undefined,
      bonus_reward_text: "",
      bonus_reward_description: "",
    },
    bonusPositionsInput: "",
  };
}

function capitalize(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function getHeroOfferTypeLabel(type?: HeroOfferType) {
  switch (type) {
    case "percent_off":
      return "Percent Off";
    case "fixed_amount":
      return "Fixed Amount";
    case "free_item":
      return "Free Item";
    case "bogo":
      return "BOGO";
    default:
      return "—";
  }
}

function parseNumericValue(value: HeroOffer["value"] | undefined) {
  if (typeof value === "number") return value;
  if (typeof value === "string" && value.trim()) {
    const parsed = Number(value);
    return Number.isNaN(parsed) ? null : parsed;
  }
  return null;
}

function formatHeroOfferValue(offer: HeroOfferDraft) {
  switch (offer.type) {
    case "percent_off": {
      const amount = parseNumericValue(offer.value);
      return amount === null ? "—" : `${amount}% off`;
    }
    case "fixed_amount": {
      const amount = parseNumericValue(offer.value);
      return amount === null ? "—" : `$${amount.toFixed(2)} off`;
    }
    case "free_item":
      return typeof offer.value === "string" && offer.value.trim()
        ? offer.value.trim()
        : "—";
    case "bogo":
      return typeof offer.value === "string" && offer.value.trim()
        ? `Buy one get one: ${offer.value.trim()}`
        : "—";
    default:
      return "—";
  }
}

function StepIndicator({ current }: { current: Step }) {
  return (
    <nav className="cn-steps" aria-label="Form steps">
      {STEPS.map((stepNumber) => {
        const done = stepNumber < current;
        const active = stepNumber === current;

        return (
          <button
            type="button"
            key={stepNumber}
            className={[
              "btn-pill",
              "cn-step",
              active ? "cn-step--active" : "",
              done ? "cn-step--done" : "",
            ]
              .filter(Boolean)
              .join(" ")}
            aria-current={active ? "step" : undefined}
            aria-pressed={active}
            tabIndex={-1}
          >
            <span className="cn-step__num" aria-hidden="true">
              {done ? (
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 12 12"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M2 6L5 9L10 3"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="square"
                    strokeLinejoin="miter"
                  />
                </svg>
              ) : (
                stepNumber
              )}
            </span>
            <span className="cn-step__label">
              {STEP_META[stepNumber].indicator}
            </span>
          </button>
        );
      })}
    </nav>
  );
}

export default function CampaignNewPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>(1);
  const [form, setForm] = useState<FormData>(() => createEmptyForm());
  const [errors, setErrors] = useState<FormErrors>({});
  const [formError, setFormError] = useState("");
  const [loading, setLoading] = useState(false);

  const selectedLocations = MOCK_LOCATIONS.filter((location) =>
    form.applicable_location_ids.includes(location.id),
  );

  function setField<K extends keyof FormData>(key: K, value: FormData[K]) {
    setForm((current) => ({ ...current, [key]: value }));
    setErrors((current) => {
      const next = { ...current };
      const fieldMap: Partial<Record<keyof FormData, FormErrorKey>> = {
        name: "name",
        category: "category",
        description: "description",
        budget: "budget",
        tier: "tier",
        commissionSplit: "commissionSplit",
        contentType: "contentType",
        platform: "platform",
        dueDate: "dueDate",
        applicable_location_ids: "applicable_location_ids",
      };
      const errorKey = fieldMap[key];
      if (errorKey) next[errorKey] = undefined;
      return next;
    });
  }

  function setHeroOffer(
    patch: Partial<HeroOfferDraft>,
    keysToClear: FormErrorKey[] = [],
  ) {
    setForm((current) => ({
      ...current,
      hero_offer: {
        ...current.hero_offer,
        ...patch,
      },
    }));
    if (keysToClear.length > 0) {
      setErrors((current) => {
        const next = { ...current };
        keysToClear.forEach((key) => {
          next[key] = undefined;
        });
        return next;
      });
    }
  }

  function fieldProps<K extends keyof FormData>(key: K) {
    return {
      value: form[key],
      onChange: (
        event: ChangeEvent<
          HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >,
      ) => setField(key, event.target.value as FormData[K]),
      className: errors[key as FormErrorKey] ? "cn-input--error" : undefined,
    };
  }

  function validateStep(currentStep: Step): FormErrors {
    const nextErrors: FormErrors = {};

    if (currentStep === 1) {
      if (!form.name.trim())
        nextErrors.name = "Add a name so creators recognize the campaign.";
      else if (form.name.trim().length > 80)
        nextErrors.name = "Keep the name to 80 characters or fewer.";

      if (!form.category)
        nextErrors.category =
          "Pick a category to help us match the right creators.";

      if (!form.description.trim())
        nextErrors.description =
          "Add a brief — what should creators post about?";
      else if (form.description.trim().length > 400)
        nextErrors.description =
          "Trim the description to 400 characters or fewer.";
    }

    if (currentStep === 2) {
      const budget = Number(form.budget);
      const split = Number(form.commissionSplit);

      if (!form.budget || Number.isNaN(budget))
        nextErrors.budget = "Enter a budget amount.";
      else if (budget < 50) nextErrors.budget = "Minimum budget is $50.";
      else if (budget > 50000) nextErrors.budget = "Maximum budget is $50,000.";

      if (!form.tier)
        nextErrors.tier = "Pick a creator tier to set the talent bracket.";

      if (Number.isNaN(split) || split < 0 || split > 100) {
        nextErrors.commissionSplit =
          "Commission split must sit between 0 and 100%.";
      }
    }

    if (currentStep === 3) {
      if (!form.contentType) nextErrors.contentType = "Pick a content type.";
      if (!form.platform) nextErrors.platform = "Pick a platform.";
      if (!form.dueDate)
        nextErrors.dueDate = "Set a due date for content delivery.";
      else if (form.dueDate < todayISO()) {
        nextErrors.dueDate = "Due date should be today or later.";
      }
    }

    if (currentStep === 4) {
      if (form.applicable_location_ids.length < 1) {
        nextErrors.applicable_location_ids =
          "Select at least one location where customers can redeem.";
      }
    }

    if (currentStep === 5) {
      const offerType = form.hero_offer.type;
      const offerDescription = form.hero_offer.description?.trim() ?? "";
      const perCustomer = form.hero_offer.max_redemptions_per_customer;
      const totalLimit = form.hero_offer.max_redemptions_total;

      if (!offerType) nextErrors.hero_offer_type = "Select an offer type.";

      if (offerType === "percent_off") {
        const percent = parseNumericValue(form.hero_offer.value);
        if (percent === null) {
          nextErrors.hero_offer_value = "Enter a percentage value.";
        } else if (percent < 1 || percent > 100) {
          nextErrors.hero_offer_value =
            "Percent off must be between 1 and 100.";
        }
      }

      if (offerType === "fixed_amount") {
        const dollars = parseNumericValue(form.hero_offer.value);
        if (dollars === null) {
          nextErrors.hero_offer_value = "Enter a dollar amount.";
        } else if (dollars <= 0) {
          nextErrors.hero_offer_value = "Dollar amount must be greater than 0.";
        }
      }

      if (offerType === "free_item" || offerType === "bogo") {
        const textValue =
          typeof form.hero_offer.value === "string"
            ? form.hero_offer.value.trim()
            : "";
        if (!textValue) {
          nextErrors.hero_offer_value = "Enter the offer item or product.";
        }
      }

      if (!offerDescription) {
        nextErrors.hero_offer_description = "Description is required.";
      }

      if (!form.hero_offer.valid_until) {
        nextErrors.hero_offer_valid_until = "Valid until is required.";
      } else {
        const validUntil = new Date(form.hero_offer.valid_until);
        const validFrom = form.hero_offer.valid_from
          ? new Date(form.hero_offer.valid_from)
          : null;

        if (Number.isNaN(validUntil.getTime())) {
          nextErrors.hero_offer_valid_until = "Enter a valid end time.";
        } else if (
          validFrom &&
          !Number.isNaN(validFrom.getTime()) &&
          validUntil < validFrom
        ) {
          nextErrors.hero_offer_valid_until =
            "Valid until must be after valid from.";
        }
      }

      if (
        typeof perCustomer !== "number" ||
        Number.isNaN(perCustomer) ||
        perCustomer < 1 ||
        perCustomer > 10
      ) {
        nextErrors.hero_offer_max_redemptions_per_customer =
          "Per customer limit must be between 1 and 10.";
      }

      if (
        totalLimit !== null &&
        (typeof totalLimit !== "number" ||
          Number.isNaN(totalLimit) ||
          totalLimit < 1)
      ) {
        nextErrors.hero_offer_max_redemptions_total =
          "Total campaign limit must be 1 or more.";
      }

      // Mystery Drop (v3) — bonus positions + reward text validation.
      const bonusRaw = form.bonusPositionsInput.trim();
      const bonusRewardText = form.hero_offer.bonus_reward_text?.trim() ?? "";

      if (bonusRaw) {
        const parsed = parseBonusPositionsInput(bonusRaw);
        if (parsed === "INVALID") {
          nextErrors.hero_offer_bonus_positions =
            "Positions must be positive integers separated by commas or spaces.";
        } else if (Array.isArray(parsed)) {
          if (parsed.length > MAX_BONUS_POSITIONS) {
            nextErrors.hero_offer_bonus_positions = `At most ${MAX_BONUS_POSITIONS} bonus positions.`;
          } else if (
            typeof totalLimit === "number" &&
            !Number.isNaN(totalLimit) &&
            totalLimit > 0 &&
            parsed.some((n) => n > totalLimit)
          ) {
            nextErrors.hero_offer_bonus_positions = `Each position must be ≤ total campaign limit (${totalLimit}).`;
          }

          if (!nextErrors.hero_offer_bonus_positions && !bonusRewardText) {
            nextErrors.hero_offer_bonus_reward_text =
              "Reward text is required when bonus positions are set.";
          }
        }
      }
    }

    return nextErrors;
  }

  function isStepValid(currentStep: Step) {
    return Object.keys(validateStep(currentStep)).length === 0;
  }

  function handleNext() {
    const nextErrors = validateStep(step);
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setErrors({});
    setFormError("");
    setStep((current) =>
      current < STEPS.length ? ((current + 1) as Step) : current,
    );
  }

  function handleBack() {
    setErrors({});
    setFormError("");
    setStep((current) => (current > 1 ? ((current - 1) as Step) : current));
  }

  function toggleLocation(locationId: string) {
    const selected = form.applicable_location_ids.includes(locationId);
    const nextLocationIds = selected
      ? form.applicable_location_ids.filter((id) => id !== locationId)
      : [...form.applicable_location_ids, locationId];

    setField("applicable_location_ids", nextLocationIds);
  }

  function setAllLocations() {
    setField(
      "applicable_location_ids",
      MOCK_LOCATIONS.map((location) => location.id),
    );
  }

  function clearLocations() {
    setField("applicable_location_ids", []);
  }

  function setHeroOfferType(type: HeroOfferType) {
    setHeroOffer(
      {
        type,
        value: "",
      },
      ["hero_offer_type", "hero_offer_value"],
    );
  }

  function buildHeroOfferPayload(): HeroOffer | null {
    const offerType = form.hero_offer.type;
    if (!offerType) return null;

    let value: HeroOffer["value"];
    if (offerType === "percent_off") {
      const percent = parseNumericValue(form.hero_offer.value);
      if (percent === null) return null;
      value = percent;
    } else if (offerType === "fixed_amount") {
      const dollars = parseNumericValue(form.hero_offer.value);
      if (dollars === null) return null;
      value = Math.round(dollars * 100);
    } else {
      const textValue =
        typeof form.hero_offer.value === "string"
          ? form.hero_offer.value.trim()
          : "";
      if (!textValue) return null;
      value = textValue;
    }

    const description = form.hero_offer.description?.trim();
    const perCustomer = form.hero_offer.max_redemptions_per_customer;
    if (
      !description ||
      typeof perCustomer !== "number" ||
      Number.isNaN(perCustomer)
    ) {
      return null;
    }

    // Mystery Drop (v3) — re-parse the raw input on submit; validation passed.
    const parsedBonus = parseBonusPositionsInput(form.bonusPositionsInput);
    const bonusPositions =
      Array.isArray(parsedBonus) && parsedBonus.length > 0
        ? parsedBonus
        : undefined;
    const bonusRewardText = form.hero_offer.bonus_reward_text?.trim();
    const bonusRewardDescription =
      form.hero_offer.bonus_reward_description?.trim();

    return {
      type: offerType,
      value,
      max_redemptions_per_customer: perCustomer,
      max_redemptions_total: form.hero_offer.max_redemptions_total ?? null,
      description,
      valid_from: toIsoFromDateTimeLocal(form.hero_offer.valid_from),
      valid_until: toIsoFromDateTimeLocal(form.hero_offer.valid_until),
      bonus_positions: bonusPositions,
      bonus_reward_text:
        bonusPositions && bonusRewardText ? bonusRewardText : undefined,
      bonus_reward_description:
        bonusPositions && bonusRewardDescription
          ? bonusRewardDescription
          : undefined,
    };
  }

  async function handlePublish() {
    const allErrors = {
      ...validateStep(1),
      ...validateStep(2),
      ...validateStep(3),
      ...validateStep(4),
      ...validateStep(5),
    };

    if (Object.keys(allErrors).length > 0) {
      setErrors(allErrors);
      setFormError("Some fields need attention. Please review previous steps.");
      return;
    }

    const heroOffer = buildHeroOfferPayload();
    if (!heroOffer) {
      setFormError("Hero offer could not be created. Review the offer step.");
      setStep(5);
      return;
    }

    const primaryLocation = selectedLocations[0];
    const payload: CampaignCreatePayload = {
      title: form.name.trim(),
      description: form.description.trim(),
      location: primaryLocation?.address ?? "New York, NY",
      lat: primaryLocation?.lat ?? 40.7128,
      lng: primaryLocation?.lng ?? -74.006,
      budget_total: Number(form.budget),
      reward_per_visit: Math.max(
        1,
        Math.round(
          Number(form.budget || 0) / Math.max(1, selectedLocations.length),
        ),
      ),
      max_creators: 10,
      start_date: new Date().toISOString(),
      end_date: new Date(form.dueDate).toISOString(),
      tags: [form.category, form.platform, form.contentType, form.tier].filter(
        Boolean,
      ),
      applicable_location_ids: form.applicable_location_ids,
      hero_offer: heroOffer,
    };

    setLoading(true);
    setFormError("");

    try {
      const result = await Promise.resolve(
        api.merchant.createCampaign(payload),
      );
      if (!result.ok) {
        throw new Error(result.error ?? "Campaign creation failed.");
      }

      router.push(`/merchant/campaigns/${result.data.id}`);
    } catch (error) {
      setFormError(
        error instanceof Error ? error.message : "Something went wrong.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="cn-page">
      <div className="cn-inner cn-inner--wide">
        <Link href="/merchant/dashboard" className="cn-back">
          ← Back to dashboard
        </Link>

        <div className="cn-header">
          <p className="cn-eyebrow">LINKS / NEW CAMPAIGN</p>
          <h1 className="cn-title">Launch a campaign</h1>
          <p className="cn-subtitle">
            Six guided steps. Define the brief, set the budget, choose the
            creator tier, pick redemption locations, configure the offer, then
            publish.
          </p>
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

        <div className="cn-wizard-layout">
          <aside className="cn-wizard-rail">
            <div className="cn-rail-inner">
              <p className="cn-rail-step-label">Step {step} of 6</p>
              <h2 className="cn-rail-heading">{STEP_META[step].rail}</h2>
              <div className="cn-rail-lines" aria-hidden="true">
                {STEPS.map((stepNumber) => (
                  <div
                    key={stepNumber}
                    className={[
                      "cn-rail-line",
                      stepNumber === step ? "cn-rail-line--active" : "",
                      stepNumber < step ? "cn-rail-line--done" : "",
                    ]
                      .filter(Boolean)
                      .join(" ")}
                  />
                ))}
              </div>
              <p className="cn-rail-desc">{STEP_META[step].description}</p>
            </div>
          </aside>

          <div className="cn-panel">
            <section
              className={`cn-step-section${step === 1 ? " cn-step-section--visible" : ""}`}
              aria-label="Step 1: Basics"
            >
              <h2 className="cn-section-heading">BASICS</h2>

              <div className="cn-field">
                <label htmlFor="cw-name">Campaign Name</label>
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

              <div className="cn-field">
                <label>Category</label>
                <CategoryPicker
                  value={form.category}
                  onChange={(value) => setField("category", value)}
                  error={errors.category}
                />
              </div>

              <div className="cn-field">
                <label htmlFor="cw-desc">Description</label>
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
                  className="btn-primary"
                  onClick={handleNext}
                >
                  Next: Budget →
                </button>
              </div>
            </section>

            <section
              className={`cn-step-section${step === 2 ? " cn-step-section--visible" : ""}`}
              aria-label="Step 2: Budget and Split"
            >
              <h2 className="cn-section-heading">BUDGET</h2>

              <div className="cn-field">
                <label htmlFor="cw-budget">Campaign Budget</label>
                <div className="cn-input-affix-wrap">
                  <span className="cn-input-affix cn-input-affix--prefix">
                    $
                  </span>
                  <input
                    id="cw-budget"
                    type="number"
                    min="50"
                    max="50000"
                    step="1"
                    placeholder="500"
                    className={errors.budget ? "cn-input--error" : undefined}
                    value={form.budget}
                    onChange={(event) => setField("budget", event.target.value)}
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

              <div className="cn-field">
                <label htmlFor="cw-split">
                  Creator Commission Split (% of budget to creators)
                </label>
                <div className="cn-split-row">
                  <input
                    id="cw-split"
                    type="range"
                    min="0"
                    max="100"
                    step="5"
                    value={form.commissionSplit}
                    onChange={(event) =>
                      setField("commissionSplit", event.target.value)
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
                  <span className="cn-field-hint">
                    Creators receive{" "}
                    <strong>
                      $
                      {form.budget
                        ? (
                            (Number(form.budget) *
                              Number(form.commissionSplit)) /
                            100
                          ).toFixed(0)
                        : "—"}
                    </strong>
                    {" · "}
                    Platform retains{" "}
                    <strong>
                      $
                      {form.budget
                        ? (
                            (Number(form.budget) *
                              (100 - Number(form.commissionSplit))) /
                            100
                          ).toFixed(0)
                        : "—"}
                    </strong>
                  </span>
                )}
              </div>

              <div className="cn-field">
                <label>Target Creator Tier</label>
                <TierSelector
                  value={form.tier}
                  onChange={(value) => setField("tier", value)}
                  error={errors.tier}
                />
              </div>

              <div className="cn-nav">
                <button
                  type="button"
                  className="btn-ghost"
                  onClick={handleBack}
                >
                  ← Back
                </button>
                <button
                  type="button"
                  className="btn-primary"
                  onClick={handleNext}
                >
                  Next: Deliverables →
                </button>
              </div>
            </section>

            <section
              className={`cn-step-section${step === 3 ? " cn-step-section--visible" : ""}`}
              aria-label="Step 3: Deliverables"
            >
              <h2 className="cn-section-heading">DELIVERABLES</h2>

              <div className="cn-field">
                <label>Content Type</label>
                <div className="cn-toggle-group">
                  {CONTENT_TYPES.map((contentType) => (
                    <button
                      key={contentType}
                      type="button"
                      className={[
                        "btn-pill",
                        "cn-toggle",
                        form.contentType === contentType
                          ? "cn-toggle--active"
                          : "",
                      ]
                        .filter(Boolean)
                        .join(" ")}
                      onClick={() => setField("contentType", contentType)}
                      aria-pressed={form.contentType === contentType}
                    >
                      {capitalize(contentType)}
                    </button>
                  ))}
                </div>
                {errors.contentType && (
                  <span className="cn-error-msg" role="alert">
                    {errors.contentType}
                  </span>
                )}
              </div>

              <div className="cn-field">
                <label>Platform</label>
                <div className="cn-toggle-group">
                  {PLATFORMS.map((platform) => (
                    <button
                      key={platform}
                      type="button"
                      className={[
                        "btn-pill",
                        "cn-toggle",
                        form.platform === platform ? "cn-toggle--active" : "",
                      ]
                        .filter(Boolean)
                        .join(" ")}
                      onClick={() => setField("platform", platform)}
                      aria-pressed={form.platform === platform}
                    >
                      {platform}
                    </button>
                  ))}
                </div>
                {errors.platform && (
                  <span className="cn-error-msg" role="alert">
                    {errors.platform}
                  </span>
                )}
              </div>

              <div className="cn-field">
                <label htmlFor="cw-due">Content Due Date</label>
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
                  className="btn-ghost"
                  onClick={handleBack}
                >
                  ← Back
                </button>
                <button
                  type="button"
                  className="btn-primary"
                  onClick={handleNext}
                >
                  Next: Applicable Locations →
                </button>
              </div>
            </section>

            <section
              className={`cn-step-section${step === 4 ? " cn-step-section--visible" : ""}`}
              aria-label="Step 4: Applicable Locations"
            >
              <h2 className="cn-section-heading">APPLICABLE LOCATIONS</h2>
              <p className="cn-section-copy">
                Select which locations accept this offer. At least one required.
              </p>

              <div className="cn-quick-actions">
                <button
                  type="button"
                  className="btn-pill"
                  onClick={setAllLocations}
                >
                  SELECT ALL
                </button>
                <button
                  type="button"
                  className="btn-pill"
                  onClick={clearLocations}
                >
                  CLEAR
                </button>
              </div>

              <p className="cn-counter">
                {form.applicable_location_ids.length} of {MOCK_LOCATIONS.length}{" "}
                locations selected
              </p>

              <div className="cn-location-list">
                {MOCK_LOCATIONS.map((location) => {
                  const selected = form.applicable_location_ids.includes(
                    location.id,
                  );

                  return (
                    <button
                      key={location.id}
                      type="button"
                      className={[
                        "cn-location-card",
                        selected ? "cn-location-card--selected" : "",
                      ]
                        .filter(Boolean)
                        .join(" ")}
                      onClick={() => toggleLocation(location.id)}
                      aria-pressed={selected}
                    >
                      <div className="cn-location-card__content">
                        <h3 className="cn-location-card__title">
                          {location.business_name}
                        </h3>
                        <p className="cn-location-card__address">
                          {location.address}
                        </p>
                      </div>
                      <span
                        className={[
                          "cn-location-card__check",
                          selected ? "cn-location-card__check--selected" : "",
                        ]
                          .filter(Boolean)
                          .join(" ")}
                        aria-hidden="true"
                      >
                        {selected ? "✓" : ""}
                      </span>
                    </button>
                  );
                })}
              </div>

              {errors.applicable_location_ids && (
                <span className="cn-error-msg" role="alert">
                  {errors.applicable_location_ids}
                </span>
              )}

              <div className="cn-nav">
                <button
                  type="button"
                  className="btn-ghost"
                  onClick={handleBack}
                >
                  ← Back
                </button>
                <button
                  type="button"
                  className="btn-primary"
                  onClick={handleNext}
                  disabled={!isStepValid(4)}
                >
                  Next: Hero Offer →
                </button>
              </div>
            </section>

            <section
              className={`cn-step-section${step === 5 ? " cn-step-section--visible" : ""}`}
              aria-label="Step 5: Hero Offer"
            >
              <h2 className="cn-section-heading">HERO OFFER</h2>
              <p className="cn-section-copy">
                What discount will customers get when they show this campaign?
              </p>

              <div className="cn-field">
                <label>Offer Type</label>
                <div className="cn-offer-grid">
                  {HERO_OFFER_TYPES.map((offerType) => (
                    <button
                      key={offerType.type}
                      type="button"
                      className={[
                        "cn-offer-card",
                        form.hero_offer.type === offerType.type
                          ? "cn-offer-card--active"
                          : "",
                      ]
                        .filter(Boolean)
                        .join(" ")}
                      onClick={() => setHeroOfferType(offerType.type)}
                      aria-pressed={form.hero_offer.type === offerType.type}
                    >
                      <span className="cn-offer-card__label">
                        {offerType.label}
                      </span>
                      <span className="cn-offer-card__detail">
                        {offerType.detail}
                      </span>
                    </button>
                  ))}
                </div>
                {errors.hero_offer_type && (
                  <span className="cn-error-msg" role="alert">
                    {errors.hero_offer_type}
                  </span>
                )}
              </div>

              {form.hero_offer.type === "percent_off" && (
                <div className="cn-field">
                  <label htmlFor="cw-hero-percent">Discount Value</label>
                  <div className="cn-input-affix-wrap">
                    <input
                      id="cw-hero-percent"
                      type="number"
                      min="1"
                      max="100"
                      step="1"
                      placeholder="20"
                      className={
                        errors.hero_offer_value ? "cn-input--error" : undefined
                      }
                      value={
                        typeof form.hero_offer.value === "number" ||
                        typeof form.hero_offer.value === "string"
                          ? form.hero_offer.value
                          : ""
                      }
                      onChange={(event) =>
                        setHeroOffer({ value: event.target.value }, [
                          "hero_offer_value",
                        ])
                      }
                    />
                    <span className="cn-input-affix cn-input-affix--suffix">
                      %
                    </span>
                  </div>
                  {errors.hero_offer_value && (
                    <span className="cn-error-msg" role="alert">
                      {errors.hero_offer_value}
                    </span>
                  )}
                </div>
              )}

              {form.hero_offer.type === "fixed_amount" && (
                <div className="cn-field">
                  <label htmlFor="cw-hero-fixed">Discount Value</label>
                  <div className="cn-input-affix-wrap">
                    <span className="cn-input-affix cn-input-affix--prefix">
                      $
                    </span>
                    <input
                      id="cw-hero-fixed"
                      type="number"
                      min="1"
                      step="1"
                      placeholder="5"
                      className={
                        errors.hero_offer_value ? "cn-input--error" : undefined
                      }
                      value={
                        typeof form.hero_offer.value === "number" ||
                        typeof form.hero_offer.value === "string"
                          ? form.hero_offer.value
                          : ""
                      }
                      onChange={(event) =>
                        setHeroOffer({ value: event.target.value }, [
                          "hero_offer_value",
                        ])
                      }
                    />
                  </div>
                  {errors.hero_offer_value && (
                    <span className="cn-error-msg" role="alert">
                      {errors.hero_offer_value}
                    </span>
                  )}
                </div>
              )}

              {form.hero_offer.type === "free_item" && (
                <div className="cn-field">
                  <label htmlFor="cw-hero-free">Item Name</label>
                  <input
                    id="cw-hero-free"
                    type="text"
                    placeholder="Free iced latte"
                    className={
                      errors.hero_offer_value ? "cn-input--error" : undefined
                    }
                    value={
                      typeof form.hero_offer.value === "string"
                        ? form.hero_offer.value
                        : ""
                    }
                    onChange={(event) =>
                      setHeroOffer({ value: event.target.value }, [
                        "hero_offer_value",
                      ])
                    }
                  />
                  {errors.hero_offer_value && (
                    <span className="cn-error-msg" role="alert">
                      {errors.hero_offer_value}
                    </span>
                  )}
                </div>
              )}

              {form.hero_offer.type === "bogo" && (
                <div className="cn-field">
                  <label htmlFor="cw-hero-bogo">Eligible Product</label>
                  <input
                    id="cw-hero-bogo"
                    type="text"
                    placeholder="Matcha latte"
                    className={
                      errors.hero_offer_value ? "cn-input--error" : undefined
                    }
                    value={
                      typeof form.hero_offer.value === "string"
                        ? form.hero_offer.value
                        : ""
                    }
                    onChange={(event) =>
                      setHeroOffer({ value: event.target.value }, [
                        "hero_offer_value",
                      ])
                    }
                  />
                  {errors.hero_offer_value && (
                    <span className="cn-error-msg" role="alert">
                      {errors.hero_offer_value}
                    </span>
                  )}
                </div>
              )}

              <div className="cn-field">
                <label htmlFor="cw-hero-description">Description</label>
                <input
                  id="cw-hero-description"
                  type="text"
                  placeholder="20% off your first visit"
                  className={
                    errors.hero_offer_description
                      ? "cn-input--error"
                      : undefined
                  }
                  value={form.hero_offer.description ?? ""}
                  onChange={(event) =>
                    setHeroOffer({ description: event.target.value }, [
                      "hero_offer_description",
                    ])
                  }
                />
                {errors.hero_offer_description && (
                  <span className="cn-error-msg" role="alert">
                    {errors.hero_offer_description}
                  </span>
                )}
              </div>

              <div className="cn-limit-grid">
                <div className="cn-field">
                  <label htmlFor="cw-hero-valid-from">Valid From</label>
                  <input
                    id="cw-hero-valid-from"
                    type="datetime-local"
                    className={
                      errors.hero_offer_valid_from
                        ? "cn-input--error"
                        : undefined
                    }
                    value={form.hero_offer.valid_from ?? ""}
                    onChange={(event) =>
                      setHeroOffer(
                        { valid_from: event.target.value || undefined },
                        ["hero_offer_valid_from", "hero_offer_valid_until"],
                      )
                    }
                  />
                  {errors.hero_offer_valid_from && (
                    <span className="cn-error-msg" role="alert">
                      {errors.hero_offer_valid_from}
                    </span>
                  )}
                </div>

                <div className="cn-field">
                  <label htmlFor="cw-hero-valid-until">Valid Until</label>
                  <input
                    id="cw-hero-valid-until"
                    type="datetime-local"
                    required
                    className={
                      errors.hero_offer_valid_until
                        ? "cn-input--error"
                        : undefined
                    }
                    value={form.hero_offer.valid_until ?? ""}
                    onChange={(event) =>
                      setHeroOffer({ valid_until: event.target.value }, [
                        "hero_offer_valid_until",
                      ])
                    }
                  />
                  {errors.hero_offer_valid_until ? (
                    <span className="cn-error-msg" role="alert">
                      {errors.hero_offer_valid_until}
                    </span>
                  ) : (
                    <span className="cn-field-hint">
                      HOW LONG THE OFFER IS VALID (CUSTOMER MUST REDEEM IN-STORE
                      WITHIN THIS WINDOW)
                    </span>
                  )}
                </div>
              </div>

              <div className="cn-limit-grid">
                <div className="cn-field">
                  <label htmlFor="cw-hero-per-customer">
                    Per Customer Limit
                  </label>
                  <input
                    id="cw-hero-per-customer"
                    type="number"
                    min="1"
                    max="10"
                    step="1"
                    className={
                      errors.hero_offer_max_redemptions_per_customer
                        ? "cn-input--error"
                        : undefined
                    }
                    value={form.hero_offer.max_redemptions_per_customer ?? 1}
                    onChange={(event) =>
                      setHeroOffer(
                        {
                          max_redemptions_per_customer: Number(
                            event.target.value,
                          ),
                        },
                        ["hero_offer_max_redemptions_per_customer"],
                      )
                    }
                  />
                  {errors.hero_offer_max_redemptions_per_customer && (
                    <span className="cn-error-msg" role="alert">
                      {errors.hero_offer_max_redemptions_per_customer}
                    </span>
                  )}
                </div>

                <div className="cn-field">
                  <label htmlFor="cw-hero-total">Total Campaign Limit</label>
                  <input
                    id="cw-hero-total"
                    type="number"
                    min="1"
                    step="1"
                    placeholder="Unlimited"
                    className={
                      errors.hero_offer_max_redemptions_total
                        ? "cn-input--error"
                        : undefined
                    }
                    value={form.hero_offer.max_redemptions_total ?? ""}
                    onChange={(event) =>
                      setHeroOffer(
                        {
                          max_redemptions_total: event.target.value
                            ? Number(event.target.value)
                            : null,
                        },
                        ["hero_offer_max_redemptions_total"],
                      )
                    }
                  />
                  {errors.hero_offer_max_redemptions_total ? (
                    <span className="cn-error-msg" role="alert">
                      {errors.hero_offer_max_redemptions_total}
                    </span>
                  ) : (
                    <span className="cn-field-hint">
                      Leave blank for unlimited redemptions.
                    </span>
                  )}
                </div>
              </div>

              {/* ── Mystery Drop (v3) — optional bonus positions ── */}
              <div className="cn-bonus-drop">
                <div className="cn-bonus-drop-header">
                  <span className="cn-bonus-drop-eyebrow">
                    BONUS DROPS (OPTIONAL)
                  </span>
                  <span className="cn-bonus-drop-icon" aria-hidden="true">
                    🎁
                  </span>
                </div>
                <p className="cn-bonus-drop-copy">
                  Pick customer positions that win a bigger prize. The N-th
                  redeemer will see a BONUS DROP flash at the register. Leave
                  blank to skip.
                </p>

                <div className="cn-field">
                  <label htmlFor="cw-hero-bonus-positions">
                    Bonus Positions
                  </label>
                  <input
                    id="cw-hero-bonus-positions"
                    type="text"
                    placeholder="e.g. 3, 7, 15"
                    autoComplete="off"
                    className={
                      errors.hero_offer_bonus_positions
                        ? "cn-input--error"
                        : undefined
                    }
                    value={form.bonusPositionsInput}
                    onChange={(event) => {
                      const raw = event.target.value;
                      setForm((current) => ({
                        ...current,
                        bonusPositionsInput: raw,
                        hero_offer: {
                          ...current.hero_offer,
                          bonus_positions: (() => {
                            const parsed = parseBonusPositionsInput(raw);
                            return Array.isArray(parsed) ? parsed : undefined;
                          })(),
                        },
                      }));
                      setErrors((current) => ({
                        ...current,
                        hero_offer_bonus_positions: undefined,
                      }));
                    }}
                  />
                  {errors.hero_offer_bonus_positions ? (
                    <span className="cn-error-msg" role="alert">
                      {errors.hero_offer_bonus_positions}
                    </span>
                  ) : (
                    <span className="cn-field-hint">
                      Comma or space separated positive integers. Max 20
                      entries.
                    </span>
                  )}
                </div>

                <div className="cn-field">
                  <label htmlFor="cw-hero-bonus-reward-text">
                    Bonus Reward (Short)
                  </label>
                  <input
                    id="cw-hero-bonus-reward-text"
                    type="text"
                    maxLength={60}
                    placeholder="Free espresso machine"
                    autoComplete="off"
                    className={
                      errors.hero_offer_bonus_reward_text
                        ? "cn-input--error"
                        : undefined
                    }
                    value={form.hero_offer.bonus_reward_text ?? ""}
                    onChange={(event) =>
                      setHeroOffer({ bonus_reward_text: event.target.value }, [
                        "hero_offer_bonus_reward_text",
                      ])
                    }
                  />
                  {errors.hero_offer_bonus_reward_text ? (
                    <span className="cn-error-msg" role="alert">
                      {errors.hero_offer_bonus_reward_text}
                    </span>
                  ) : (
                    <span className="cn-field-hint">
                      Headline shown on the staff screen when a bonus hits. Up
                      to 60 chars.
                    </span>
                  )}
                </div>

                <div className="cn-field">
                  <label htmlFor="cw-hero-bonus-reward-description">
                    Bonus Reward Detail
                  </label>
                  <textarea
                    id="cw-hero-bonus-reward-description"
                    rows={3}
                    placeholder="Shown to the cashier with the flash so they can hand it to the customer."
                    value={form.hero_offer.bonus_reward_description ?? ""}
                    onChange={(event) =>
                      setHeroOffer({
                        bonus_reward_description: event.target.value,
                      })
                    }
                  />
                  <span className="cn-field-hint">
                    Optional — extra context for the cashier.
                  </span>
                </div>
              </div>

              <div className="cn-nav">
                <button
                  type="button"
                  className="btn-ghost"
                  onClick={handleBack}
                >
                  ← Back
                </button>
                <button
                  type="button"
                  className="btn-primary"
                  onClick={handleNext}
                  disabled={!isStepValid(5)}
                >
                  Next: Review →
                </button>
              </div>
            </section>

            <section
              className={`cn-step-section${step === 6 ? " cn-step-section--visible" : ""}`}
              aria-label="Step 6: Review and Launch"
            >
              <h2 className="cn-section-heading">REVIEW</h2>

              <div className="cn-summary">
                <p className="cn-summary-heading">Campaign Summary</p>

                <div className="cn-summary-grid">
                  <div className="cn-summary-item cn-summary-item--full">
                    <span className="cn-summary-label">Campaign Name</span>
                    <span className="cn-summary-value">{form.name || "—"}</span>
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
                      {form.category ? capitalize(form.category) : "—"}
                    </span>
                  </div>

                  <div className="cn-summary-item">
                    <span className="cn-summary-label">Budget</span>
                    <span className="cn-summary-value">
                      {form.budget
                        ? `$${Number(form.budget).toLocaleString()}`
                        : "—"}
                    </span>
                  </div>

                  <div className="cn-summary-item">
                    <span className="cn-summary-label">Creator Tier</span>
                    <span className="cn-summary-value">
                      {form.tier ? capitalize(form.tier) : "—"}
                    </span>
                  </div>

                  <div className="cn-summary-item">
                    <span className="cn-summary-label">Commission Split</span>
                    <span className="cn-summary-value">
                      {form.commissionSplit}% to creators
                    </span>
                  </div>

                  <div className="cn-summary-item">
                    <span className="cn-summary-label">Content Type</span>
                    <span className="cn-summary-value">
                      {form.contentType ? capitalize(form.contentType) : "—"}
                    </span>
                  </div>

                  <div className="cn-summary-item">
                    <span className="cn-summary-label">Platform</span>
                    <span className="cn-summary-value">
                      {form.platform || "—"}
                    </span>
                  </div>

                  <div className="cn-summary-item cn-summary-item--full">
                    <span className="cn-summary-label">Content Due</span>
                    <span className="cn-summary-value">
                      {form.dueDate || "—"}
                    </span>
                  </div>

                  <div className="cn-summary-item cn-summary-item--full">
                    <span className="cn-summary-label">
                      Applicable Locations
                    </span>
                    {selectedLocations.length > 0 ? (
                      <ul className="cn-summary-list">
                        {selectedLocations.map((location) => (
                          <li key={location.id}>{location.business_name}</li>
                        ))}
                      </ul>
                    ) : (
                      <span className="cn-summary-value">—</span>
                    )}
                  </div>

                  <div className="cn-summary-item cn-summary-item--full">
                    <span className="cn-summary-label">Hero Offer</span>
                    <div className="cn-summary-offer">
                      <span className="cn-summary-value">
                        {getHeroOfferTypeLabel(form.hero_offer.type)}
                      </span>
                      <span className="cn-summary-value">
                        {formatHeroOfferValue(form.hero_offer)}
                      </span>
                      <span className="cn-summary-value">
                        {form.hero_offer.description?.trim() || "—"}
                      </span>
                      <span className="cn-summary-value">
                        Valid from: {form.hero_offer.valid_from || "—"}
                      </span>
                      <span className="cn-summary-value">
                        Valid until: {form.hero_offer.valid_until || "—"}
                      </span>
                      <span className="cn-summary-value">
                        Per customer:{" "}
                        {form.hero_offer.max_redemptions_per_customer ?? "—"}
                      </span>
                      <span className="cn-summary-value">
                        Total:{" "}
                        {form.hero_offer.max_redemptions_total ?? "Unlimited"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="cn-nav">
                <button
                  type="button"
                  className="btn-ghost"
                  onClick={handleBack}
                  disabled={loading}
                >
                  ← Edit
                </button>
                <button
                  type="button"
                  className="btn-primary"
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
                    "Launch Campaign →"
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
