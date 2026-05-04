import type { SupabaseClient } from "@supabase/supabase-js";
import { CampaignStatus, type Campaign } from "@/lib/data/types";
import type { HeroOffer, HeroOfferType } from "@/lib/offers/types";

export const DEMO_TENANT_ID = "demo-tenant-001";
export const DEMO_MERCHANT_ID = "11111111-1111-1111-1111-111111111111";

export type MerchantCampaign = Omit<Campaign, "hero_offer"> & {
  tenant_id: string;
  applicable_location_ids: string[];
  hero_offer: HeroOffer | null;
};

export type CampaignWriteInput = {
  title: string;
  description: string;
  location: string;
  lat: number;
  lng: number;
  budget_total: number;
  reward_per_visit: number;
  max_creators: number;
  status?: CampaignStatus;
  start_date: string;
  end_date: string;
  image_url?: string;
  tags?: string[];
  applicable_location_ids: string[];
  hero_offer: HeroOffer;
};

export type CampaignPatchInput = Partial<
  Omit<CampaignWriteInput, "applicable_location_ids" | "hero_offer">
> & {
  applicable_location_ids?: string[];
  hero_offer?: HeroOffer;
};

const DEFAULT_CREATE_WINDOW_MS = 30 * 24 * 60 * 60 * 1000;

function defaultCampaignStartDate(): string {
  return new Date().toISOString();
}

function defaultCampaignEndDate(startDate: string): string {
  const start = new Date(startDate);
  const fallback = Number.isNaN(start.getTime()) ? Date.now() : start.getTime();
  return new Date(fallback + DEFAULT_CREATE_WINDOW_MS).toISOString();
}

export function getHeroOfferColumns(heroOffer: HeroOffer) {
  const isNumeric =
    heroOffer.type === "percent_off" || heroOffer.type === "fixed_amount";

  return {
    type: heroOffer.type,
    value_numeric: isNumeric ? Number(heroOffer.value) : null,
    value_text: isNumeric ? null : String(heroOffer.value),
    max_redemptions_per_customer: heroOffer.max_redemptions_per_customer,
    max_redemptions_total: heroOffer.max_redemptions_total,
    valid_from: heroOffer.valid_from ?? null,
    valid_until: heroOffer.valid_until ?? null,
    bonus_positions:
      heroOffer.bonus_positions && heroOffer.bonus_positions.length > 0
        ? heroOffer.bonus_positions
        : null,
    bonus_reward_text: heroOffer.bonus_reward_text ?? null,
    bonus_reward_description: heroOffer.bonus_reward_description ?? null,
  };
}

type CampaignRow = {
  id: string;
  merchant_id: string;
  tenant_id: string;
  title: string;
  description: string | null;
  location: string | null;
  lat: number | string | null;
  lng: number | string | null;
  budget_total: number | string | null;
  budget_remaining: number | string | null;
  reward_per_visit: number | string | null;
  max_creators: number | null;
  accepted_creators: number | null;
  status: string | null;
  start_date: string | null;
  end_date: string | null;
  image_url: string | null;
  tags: string[] | null;
  created_at: string;
};

type CampaignLocationRow = {
  campaign_id: string;
  location_id: string;
};

type HeroOfferRow = {
  campaign_id: string;
  type: HeroOfferType;
  value_numeric: number | string | null;
  value_text: string | null;
  max_redemptions_per_customer: number | null;
  max_redemptions_total: number | null;
  valid_from: string | null;
  valid_until: string | null;
  bonus_positions: number[] | null;
  bonus_reward_text: string | null;
  bonus_reward_description: string | null;
};

export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

const VALID_CAMPAIGN_STATUSES = new Set<CampaignStatus>([
  CampaignStatus.Draft,
  CampaignStatus.Active,
  CampaignStatus.Paused,
  CampaignStatus.Completed,
  CampaignStatus.Cancelled,
]);

const VALID_HERO_OFFER_TYPES = new Set<HeroOfferType>([
  "percent_off",
  "fixed_amount",
  "free_item",
  "bogo",
]);

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function asNumber(value: unknown, field: string): number {
  const parsed =
    typeof value === "number"
      ? value
      : typeof value === "string"
        ? Number(value)
        : Number.NaN;

  if (!Number.isFinite(parsed)) {
    throw new ApiError(422, `${field} must be a valid number`);
  }

  return parsed;
}

function asString(value: unknown, field: string): string {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new ApiError(422, `${field} is required`);
  }

  return value.trim();
}

function asOptionalString(value: unknown): string | undefined {
  if (value === undefined || value === null || value === "") {
    return undefined;
  }

  if (typeof value !== "string") {
    throw new ApiError(422, "Expected string value");
  }

  return value.trim();
}

function asOptionalPositiveInteger(
  value: unknown,
  field: string,
): number | null | undefined {
  if (value === undefined) {
    return undefined;
  }

  if (value === null || value === "") {
    return null;
  }

  const parsed = asNumber(value, field);
  if (!Number.isInteger(parsed) || parsed < 1) {
    throw new ApiError(422, `${field} must be a positive integer`);
  }

  return parsed;
}

function asOptionalIsoTimestamp(
  value: unknown,
  field: string,
): string | undefined {
  const parsed = asOptionalString(value);
  if (parsed === undefined) {
    return undefined;
  }

  const date = new Date(parsed);
  if (Number.isNaN(date.getTime())) {
    throw new ApiError(422, `${field} must be a valid ISO timestamp`);
  }

  return date.toISOString();
}

function asStringArray(value: unknown, field: string): string[] {
  if (!Array.isArray(value)) {
    throw new ApiError(422, `${field} must be an array`);
  }

  const items = value.map((item) => asString(item, field));
  return [...new Set(items)];
}

function normalizeStatus(value: unknown): CampaignStatus | undefined {
  if (value === undefined) {
    return undefined;
  }

  if (
    typeof value !== "string" ||
    !VALID_CAMPAIGN_STATUSES.has(value as CampaignStatus)
  ) {
    throw new ApiError(422, "status is invalid");
  }

  return value as CampaignStatus;
}

const MAX_BONUS_POSITIONS = 20;

// Accepts: number[]  OR  string like "3,7,15" / "3 7 15" / "3; 7; 15"
// Returns: sorted-ascending unique positive int[]  (or undefined if blank)
function parseBonusPositions(
  value: unknown,
  maxRedemptionsTotal: number | null,
): number[] | undefined {
  if (value === undefined || value === null || value === "") {
    return undefined;
  }

  let raw: unknown[];
  if (Array.isArray(value)) {
    raw = value;
  } else if (typeof value === "string") {
    raw = value
      .split(/[,\s;]+/u)
      .map((part) => part.trim())
      .filter((part) => part.length > 0);
  } else {
    throw new ApiError(
      422,
      "hero_offer.bonus_positions must be an array or comma-separated string",
    );
  }

  if (raw.length === 0) {
    return undefined;
  }

  if (raw.length > MAX_BONUS_POSITIONS) {
    throw new ApiError(
      422,
      `hero_offer.bonus_positions accepts at most ${MAX_BONUS_POSITIONS} entries`,
    );
  }

  const parsed: number[] = [];
  for (const item of raw) {
    const n = asNumber(item, "hero_offer.bonus_positions[]");
    if (!Number.isInteger(n) || n < 1) {
      throw new ApiError(
        422,
        "hero_offer.bonus_positions must contain positive integers (≥ 1)",
      );
    }
    if (maxRedemptionsTotal !== null && n > maxRedemptionsTotal) {
      throw new ApiError(
        422,
        `hero_offer.bonus_positions: position ${n} exceeds max_redemptions_total (${maxRedemptionsTotal})`,
      );
    }
    parsed.push(n);
  }

  return [...new Set(parsed)].sort((a, b) => a - b);
}

function parseHeroOffer(
  value: unknown,
  required: boolean,
): HeroOffer | undefined {
  if (value === undefined) {
    if (required) {
      throw new ApiError(422, "hero_offer is required");
    }

    return undefined;
  }

  if (!isObject(value)) {
    throw new ApiError(422, "hero_offer must be an object");
  }

  const type = value.type;
  const offerValue = value.value ?? value.value_numeric ?? value.value_text;
  const maxRedemptionsPerCustomer =
    asOptionalPositiveInteger(
      value.max_redemptions_per_customer,
      "hero_offer.max_redemptions_per_customer",
    ) ?? 1;
  const maxRedemptionsTotal = asOptionalPositiveInteger(
    value.max_redemptions_total,
    "hero_offer.max_redemptions_total",
  );
  const validFrom = asOptionalIsoTimestamp(
    value.valid_from,
    "hero_offer.valid_from",
  );
  const validUntil = asOptionalIsoTimestamp(
    value.valid_until,
    "hero_offer.valid_until",
  );

  if (validFrom && validUntil && validFrom > validUntil) {
    throw new ApiError(
      422,
      "hero_offer.valid_until must be after hero_offer.valid_from",
    );
  }

  if (
    typeof type !== "string" ||
    !VALID_HERO_OFFER_TYPES.has(type as HeroOfferType)
  ) {
    throw new ApiError(422, "hero_offer.type is invalid");
  }

  // ── Mystery Drop (v3): bonus positions + reward text ──
  const bonusPositions = parseBonusPositions(
    value.bonus_positions,
    maxRedemptionsTotal ?? null,
  );
  const bonusRewardText = asOptionalString(value.bonus_reward_text);
  const bonusRewardDescription = asOptionalString(
    value.bonus_reward_description,
  );

  if (bonusPositions && bonusPositions.length > 0 && !bonusRewardText) {
    throw new ApiError(
      422,
      "hero_offer.bonus_reward_text is required when bonus_positions is set",
    );
  }

  const bonusFields: Pick<
    HeroOffer,
    "bonus_positions" | "bonus_reward_text" | "bonus_reward_description"
  > = {
    bonus_positions: bonusPositions,
    bonus_reward_text: bonusRewardText,
    bonus_reward_description: bonusRewardDescription,
  };

  if (type === "percent_off") {
    const parsed = asNumber(offerValue, "hero_offer.value");
    if (!Number.isInteger(parsed) || parsed < 0 || parsed > 100) {
      throw new ApiError(
        422,
        "hero_offer.value must be an integer from 0 to 100",
      );
    }
    return {
      type: type as HeroOfferType,
      value: parsed,
      max_redemptions_per_customer: maxRedemptionsPerCustomer,
      max_redemptions_total: maxRedemptionsTotal ?? null,
      valid_from: validFrom,
      valid_until: validUntil,
      ...bonusFields,
    };
  }

  if (type === "fixed_amount") {
    const parsed = asNumber(offerValue, "hero_offer.value");
    if (!Number.isInteger(parsed) || parsed <= 0) {
      throw new ApiError(
        422,
        "hero_offer.value must be a positive integer number of cents",
      );
    }
    return {
      type: type as HeroOfferType,
      value: parsed,
      max_redemptions_per_customer: maxRedemptionsPerCustomer,
      max_redemptions_total: maxRedemptionsTotal ?? null,
      valid_from: validFrom,
      valid_until: validUntil,
      ...bonusFields,
    };
  }

  const parsed = asString(offerValue, "hero_offer.value");
  return {
    type: type as HeroOfferType,
    value: parsed,
    max_redemptions_per_customer: maxRedemptionsPerCustomer,
    max_redemptions_total: maxRedemptionsTotal ?? null,
    valid_from: validFrom,
    valid_until: validUntil,
    ...bonusFields,
  };
}

export function parseCampaignPayload(
  input: unknown,
  options: { partial?: boolean } = {},
): CampaignWriteInput | CampaignPatchInput {
  const { partial = false } = options;

  if (!isObject(input)) {
    throw new ApiError(400, "Request body must be a JSON object");
  }

  const applicableLocationIds =
    input.applicable_location_ids === undefined
      ? undefined
      : asStringArray(input.applicable_location_ids, "applicable_location_ids");

  if (
    !partial &&
    (!applicableLocationIds || applicableLocationIds.length < 1)
  ) {
    throw new ApiError(
      422,
      "applicable_location_ids must contain at least one location",
    );
  }

  if (partial && applicableLocationIds && applicableLocationIds.length < 1) {
    throw new ApiError(
      422,
      "applicable_location_ids must contain at least one location",
    );
  }

  const heroOffer = parseHeroOffer(input.hero_offer, !partial);
  const tags =
    input.tags === undefined ? undefined : asStringArray(input.tags, "tags");

  const parsed: CampaignPatchInput = {
    applicable_location_ids: applicableLocationIds,
    hero_offer: heroOffer,
  };

  if (!partial || input.title !== undefined) {
    parsed.title = asString(input.title, "title");
  }
  if (!partial || input.description !== undefined) {
    parsed.description = asString(input.description, "description");
  }
  if (!partial || input.location !== undefined) {
    parsed.location = asString(input.location, "location");
  }
  if (!partial || input.lat !== undefined) {
    parsed.lat = asNumber(input.lat, "lat");
  }
  if (!partial || input.lng !== undefined) {
    parsed.lng = asNumber(input.lng, "lng");
  }
  if (!partial || input.budget_total !== undefined) {
    const budgetTotal = asNumber(input.budget_total, "budget_total");
    if (!Number.isInteger(budgetTotal) || budgetTotal < 0) {
      throw new ApiError(
        422,
        "budget_total must be an integer number of cents",
      );
    }
    parsed.budget_total = budgetTotal;
  }
  if (!partial || input.reward_per_visit !== undefined) {
    const rewardPerVisit = asNumber(input.reward_per_visit, "reward_per_visit");
    if (!Number.isInteger(rewardPerVisit) || rewardPerVisit < 0) {
      throw new ApiError(
        422,
        "reward_per_visit must be an integer number of cents",
      );
    }
    parsed.reward_per_visit = rewardPerVisit;
  }
  if (!partial || input.max_creators !== undefined) {
    const maxCreators = asNumber(input.max_creators, "max_creators");
    if (!Number.isInteger(maxCreators) || maxCreators < 1) {
      throw new ApiError(422, "max_creators must be a positive integer");
    }
    parsed.max_creators = maxCreators;
  }
  if (!partial || input.start_date !== undefined) {
    parsed.start_date = asString(input.start_date, "start_date");
  }
  if (!partial || input.end_date !== undefined) {
    parsed.end_date = asString(input.end_date, "end_date");
  }

  const status = normalizeStatus(input.status);
  if (status) {
    parsed.status = status;
  }

  const imageUrl = asOptionalString(input.image_url);
  if (imageUrl !== undefined) {
    parsed.image_url = imageUrl;
  }

  if (tags) {
    parsed.tags = tags;
  }

  return partial ? parsed : (parsed as CampaignWriteInput);
}

export function parseCampaignCreatePayload(input: unknown): CampaignWriteInput {
  if (!isObject(input)) {
    throw new ApiError(400, "Request body must be a JSON object");
  }

  const startDate =
    typeof input.start_date === "string" && input.start_date.trim().length > 0
      ? input.start_date
      : defaultCampaignStartDate();
  const endDate =
    typeof input.end_date === "string" && input.end_date.trim().length > 0
      ? input.end_date
      : defaultCampaignEndDate(startDate);

  return parseCampaignPayload(
    {
      title: input.title ?? "New Campaign",
      description: input.description ?? "Campaign description pending",
      location: input.location ?? "New York, NY",
      lat: input.lat ?? 40.7128,
      lng: input.lng ?? -74.006,
      budget_total: input.budget_total ?? 0,
      reward_per_visit: input.reward_per_visit ?? 0,
      max_creators: input.max_creators ?? 10,
      start_date: startDate,
      end_date: endDate,
      tags: input.tags ?? [],
      image_url: input.image_url,
      applicable_location_ids: input.applicable_location_ids,
      hero_offer: input.hero_offer,
      status: input.status ?? CampaignStatus.Draft,
    },
    { partial: false },
  ) as CampaignWriteInput;
}

export async function assertTenantLocationIds(
  supabase: SupabaseClient,
  tenantId: string,
  locationIds: string[],
): Promise<void> {
  const uniqueIds = [...new Set(locationIds)];

  const { count, error } = await supabase
    .from("locations")
    .select("id", { count: "exact", head: true })
    .in("id", uniqueIds)
    .eq("tenant_id", tenantId);

  if (error) {
    throw new ApiError(500, error.message);
  }

  if ((count ?? 0) !== uniqueIds.length) {
    throw new ApiError(
      403,
      "One or more locations do not belong to this tenant",
    );
  }
}

function mapOfferValue(row: HeroOfferRow): number | string {
  if (row.type === "percent_off" || row.type === "fixed_amount") {
    return toNumber(row.value_numeric);
  }

  return row.value_text ?? "";
}

function normalizeCampaignStatus(status: string | null): CampaignStatus {
  if (status === CampaignStatus.Active) {
    return CampaignStatus.Active;
  }
  if (status === CampaignStatus.Paused) {
    return CampaignStatus.Paused;
  }
  if (status === CampaignStatus.Draft) {
    return CampaignStatus.Draft;
  }
  if (status === CampaignStatus.Cancelled) {
    return CampaignStatus.Cancelled;
  }
  return CampaignStatus.Completed;
}

function toNumber(value: number | string | null): number {
  if (typeof value === "number") {
    return value;
  }

  if (typeof value === "string" && value.length > 0) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
  }

  return 0;
}

function sanitizeCampaign(
  row: CampaignRow,
  locationIds: string[],
  heroOffer: HeroOffer | null,
): MerchantCampaign {
  return {
    id: row.id,
    merchant_id: row.merchant_id,
    tenant_id: row.tenant_id,
    title: row.title,
    description: row.description ?? "",
    location: row.location ?? "",
    lat: toNumber(row.lat),
    lng: toNumber(row.lng),
    budget_total: toNumber(row.budget_total),
    budget_remaining: toNumber(row.budget_remaining),
    reward_per_visit: toNumber(row.reward_per_visit),
    max_creators: row.max_creators ?? 0,
    accepted_creators: row.accepted_creators ?? 0,
    status: normalizeCampaignStatus(row.status),
    start_date: row.start_date ?? "",
    end_date: row.end_date ?? "",
    image_url: row.image_url ?? undefined,
    tags: row.tags ?? [],
    created_at: row.created_at,
    applicable_location_ids: locationIds,
    hero_offer: heroOffer,
  };
}

export async function getTenantCampaigns(
  supabase: SupabaseClient,
  tenantId: string,
  campaignId?: string,
): Promise<MerchantCampaign[]> {
  let query = supabase
    .from("campaigns")
    .select(
      "id, merchant_id, tenant_id, title, description, location, lat, lng, budget_total, budget_remaining, reward_per_visit, max_creators, accepted_creators, status, start_date, end_date, image_url, tags, created_at",
    )
    .eq("tenant_id", tenantId)
    .order("created_at", { ascending: false });

  if (campaignId) {
    query = query.eq("id", campaignId);
  }

  const { data: campaigns, error } = await query;
  if (error) {
    throw new ApiError(500, error.message);
  }

  const rows = (campaigns ?? []) as CampaignRow[];
  if (rows.length === 0) {
    return [];
  }

  const campaignIds = rows.map((row) => row.id);

  const [
    { data: locationRows, error: locationError },
    { data: offerRows, error: offerError },
  ] = await Promise.all([
    supabase
      .from("campaign_locations")
      .select("campaign_id, location_id")
      .in("campaign_id", campaignIds),
    supabase
      .from("hero_offers")
      .select(
        "campaign_id, type, value_numeric, value_text, max_redemptions_per_customer, max_redemptions_total, valid_from, valid_until, bonus_positions, bonus_reward_text, bonus_reward_description",
      )
      .in("campaign_id", campaignIds),
  ]);

  if (locationError) {
    throw new ApiError(500, locationError.message);
  }

  if (offerError) {
    throw new ApiError(500, offerError.message);
  }

  const locationMap = new Map<string, string[]>();
  for (const row of (locationRows ?? []) as CampaignLocationRow[]) {
    const current = locationMap.get(row.campaign_id) ?? [];
    current.push(row.location_id);
    locationMap.set(row.campaign_id, current);
  }

  const offerMap = new Map<string, HeroOffer>();
  for (const row of (offerRows ?? []) as HeroOfferRow[]) {
    const offer = {
      type: row.type,
      value: mapOfferValue(row),
      max_redemptions_per_customer: row.max_redemptions_per_customer ?? 1,
      max_redemptions_total: row.max_redemptions_total,
      valid_from: row.valid_from ?? undefined,
      valid_until: row.valid_until ?? undefined,
      bonus_positions:
        row.bonus_positions && row.bonus_positions.length > 0
          ? row.bonus_positions
          : undefined,
      bonus_reward_text: row.bonus_reward_text ?? undefined,
      bonus_reward_description: row.bonus_reward_description ?? undefined,
    } satisfies HeroOffer;
    offerMap.set(row.campaign_id, offer);
  }

  return rows.map((row) => {
    const offer = offerMap.get(row.id);
    return sanitizeCampaign(row, locationMap.get(row.id) ?? [], offer ?? null);
  });
}

export async function getTenantCampaignOrThrow(
  supabase: SupabaseClient,
  tenantId: string,
  campaignId: string,
): Promise<MerchantCampaign> {
  const campaigns = await getTenantCampaigns(supabase, tenantId, campaignId);
  const campaign = campaigns[0];

  if (!campaign) {
    throw new ApiError(404, "Campaign not found");
  }

  return campaign;
}
