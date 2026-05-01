export type HeroOfferType =
  | "percent_off"
  | "fixed_amount"
  | "free_item"
  | "bogo";

export interface HeroOffer {
  type: HeroOfferType;
  value: number | string;
  max_redemptions_per_customer: number;
  max_redemptions_total: number | null;
  description?: string;
  valid_from?: string;
  valid_until?: string;
  // Mystery Drop (v3): bonus positions get a special reward at redemption moment.
  // e.g. bonus_positions = [3, 7, 15] → 3rd/7th/15th redeemer sees "BONUS DROP" flash.
  // null / empty array = no bonus drops configured.
  bonus_positions?: number[];
  bonus_reward_text?: string;
  bonus_reward_description?: string;
}
