import "server-only";

import { randomBytes } from "node:crypto";

import type { PosterType, QRCodeRecord } from "@/lib/attribution/mock-qr-codes-extended";

type SupabaseError = {
  code?: string;
  message: string;
};

type QueryResult<T> = Promise<{
  data: T | null;
  error: SupabaseError | null;
}>;

type SupabaseLike = {
  auth?: {
    getUser: () => Promise<{
      data: { user: { id: string } | null };
      error: SupabaseError | null;
    }>;
  };
  from: (table: string) => any;
};

const DEMO_TENANT_ID = "demo-tenant-001";

export type AttributionLocation = {
  id: string;
  name: string;
  business_name: string | null;
  address: string;
  city: string | null;
  state: string | null;
  zip: string | null;
  lat: number | null;
  lng: number | null;
  distance_meters: number | null;
};

export type HeroOfferRow = {
  id: string;
  campaign_id: string;
  type: "percent_off" | "fixed_amount" | "free_item" | "bogo";
  value_numeric: number | string | null;
  value_text: string | null;
  max_redemptions_per_customer: number;
  max_redemptions_total: number | null;
  valid_from: string | null;
  valid_until: string | null;
  redeemed_count: number;
};

type CampaignRow = {
  id: string;
  tenant_id: string;
  merchant_id: string;
  title: string;
  description: string | null;
  category: string | null;
  budget_total: number | null;
  commission_split: number | null;
  tier_target: string | null;
  content_type: string | null;
  platform: string | null;
  due_date: string | null;
  status: string | null;
  image_url: string | null;
  tags: string[] | null;
  location: string | null;
  lat: number | null;
  lng: number | null;
  budget_remaining: number | null;
  reward_per_visit: number | null;
  max_creators: number | null;
  accepted_creators: number | null;
  start_date: string | null;
  end_date: string | null;
  created_at: string | null;
  updated_at: string | null;
};

type CampaignWithHeroOffer = CampaignRow & {
  hero_offer: HeroOfferRow | null;
};

type CreatorRow = {
  id: string;
  user_id: string;
  handle: string | null;
  tier: string | null;
  instagram_handle: string | null;
  tiktok_handle: string | null;
  // TODO: creators.name does not exist in the live schema; return an empty string
  // until display-name data is modeled explicitly.
  name: string;
  // TODO: creators.avatar_url does not exist in the live schema; return null
  // until avatar assets are stored separately.
  avatar_url: string | null;
};

type MerchantRow = {
  id: string;
  tenant_id: string;
  owner_user_id: string;
  business_name: string;
};

type QRCodeRow = {
  id: string;
  creator_id: string | null;
  campaign_id: string;
  merchant_id: string;
  short_code: string;
  poster_type: PosterType;
  hero_message: string;
  sub_message: string;
  disabled: boolean;
  scan_count: number;
  conversion_count: number;
  verified_customers: number;
  attributed_revenue: number | null;
  scan_url: string;
  last_active_at: string | null;
  created_at: string | null;
};

type CampaignLocationRow = {
  campaign_id: string;
  location_id: string;
};

type LocationRow = Omit<AttributionLocation, "distance_meters"> & {
  tenant_id: string;
  neighborhood: string | null;
  phone: string | null;
};

function isMissingRowError(error: SupabaseError | null) {
  return error?.code === "PGRST116";
}

export function buildShortCode() {
  return randomBytes(4).toString("base64url").slice(0, 8).toLowerCase();
}

export function buildRedemptionCode() {
  return randomBytes(4).toString("hex").toUpperCase();
}

function haversineMeters(
  startLat: number,
  startLng: number,
  endLat: number,
  endLng: number,
) {
  const earthRadiusMeters = 6371000;
  const toRadians = (value: number) => (value * Math.PI) / 180;
  const deltaLat = toRadians(endLat - startLat);
  const deltaLng = toRadians(endLng - startLng);
  const a =
    Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
    Math.cos(toRadians(startLat)) *
      Math.cos(toRadians(endLat)) *
      Math.sin(deltaLng / 2) *
      Math.sin(deltaLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return earthRadiusMeters * c;
}

function toCreatorRow(row: Omit<CreatorRow, "name" | "avatar_url">): CreatorRow {
  return {
    ...row,
    name: "",
    avatar_url: null,
  };
}

function toQrCodeRecord(
  row: QRCodeRow,
  campaignName: string,
  creator?: CreatorRow | null,
): QRCodeRecord {
  return {
    id: row.id,
    campaign_id: row.campaign_id,
    campaign_name: campaignName,
    creator_id: row.creator_id ?? "",
    creator_name: creator?.name ?? "",
    creator_handle: creator?.instagram_handle ?? creator?.handle ?? "",
    poster_type: row.poster_type,
    hero_message: row.hero_message,
    sub_message: row.sub_message,
    scan_url: row.scan_url,
    scan_count: row.scan_count,
    conversion_count: row.conversion_count,
    verified_customers: row.verified_customers,
    attributed_revenue: row.attributed_revenue ?? 0,
    created_at: row.created_at ?? "",
    last_active_at: row.last_active_at ?? "",
    disabled: row.disabled,
  };
}

function withDistance(
  locations: LocationRow[],
  coords?: { lat?: number | null; lng?: number | null } | null,
) {
  const canMeasure =
    typeof coords?.lat === "number" && typeof coords?.lng === "number";

  return locations
    .map<AttributionLocation>((location) => ({
      id: location.id,
      name: location.name,
      business_name: location.business_name,
      address: location.address,
      city: location.city,
      state: location.state,
      zip: location.zip,
      lat: location.lat,
      lng: location.lng,
      distance_meters:
        canMeasure &&
        typeof location.lat === "number" &&
        typeof location.lng === "number"
          ? Math.round(
              haversineMeters(
                coords.lat as number,
                coords.lng as number,
                location.lat,
                location.lng,
              ),
            )
          : null,
    }))
    .sort((left, right) => {
      if (left.distance_meters === null) return 1;
      if (right.distance_meters === null) return -1;
      return left.distance_meters - right.distance_meters;
    });
}

// Resolve the merchant for the currently authenticated request.
//
// All production callers pass a service-role Supabase client, so the older
// implementation that called `supabase.auth.getUser()` ALWAYS hit the
// demo-merchant fallback (service-role clients have no session). Every QR
// list/create/detail/poster/analytics path then returned demo data or 404s
// for real merchants' QRs.
//
// New contract: require the caller to resolve the tenant via
// `requireTenantId()` (which uses the cookie-aware Supabase client) and pass
// it in. The helper becomes a simple `merchants.tenant_id = $1` lookup.
// In dev (no auth yet) callers will receive DEMO_TENANT_ID from
// requireTenantId's fallback — same shape, just honest about the source.
export async function getCurrentMerchantId(
  supabase: SupabaseLike,
  tenantId?: string,
) {
  const resolvedTenantId = tenantId ?? DEMO_TENANT_ID;

  const { data, error: merchantError } = (await supabase
    .from("merchants")
    .select("id")
    .eq("tenant_id", resolvedTenantId)
    .maybeSingle()) as Awaited<QueryResult<{ id: string }>>;

  if (merchantError) {
    throw new Error(`Failed to load merchant: ${merchantError.message}`);
  }
  if (!data) {
    throw new Error("Merchant not found.");
  }

  return data.id;
}

async function getCampaignMap(supabase: SupabaseLike, campaignIds: string[]) {
  if (campaignIds.length === 0) {
    return new Map<string, CampaignWithHeroOffer>();
  }

  const { data, error } = (await supabase
    .from("campaigns")
    .select(
      "id, tenant_id, merchant_id, title, description, category, budget_total, commission_split, tier_target, content_type, platform, due_date, status, image_url, tags, location, lat, lng, budget_remaining, reward_per_visit, max_creators, accepted_creators, start_date, end_date, created_at, updated_at",
    )
    .in("id", campaignIds)) as Awaited<QueryResult<CampaignRow[]>>;

  if (error) {
    throw new Error(`Failed to load campaigns: ${error.message}`);
  }

  const campaigns = (data ?? []) as CampaignRow[];
  const heroOfferMap = await getHeroOfferMap(supabase, campaigns.map((campaign) => campaign.id));

  return new Map<string, CampaignWithHeroOffer>(
    campaigns.map((campaign) => [
      campaign.id,
      {
        ...campaign,
        hero_offer: heroOfferMap.get(campaign.id) ?? null,
      },
    ]),
  );
}

async function getHeroOfferMap(supabase: SupabaseLike, campaignIds: string[]) {
  if (campaignIds.length === 0) {
    return new Map<string, HeroOfferRow>();
  }

  const { data, error } = (await supabase
    .from("hero_offers")
    .select(
      "id, campaign_id, type, value_numeric, value_text, max_redemptions_per_customer, max_redemptions_total, valid_from, valid_until, redeemed_count",
    )
    .in("campaign_id", campaignIds)) as Awaited<QueryResult<HeroOfferRow[]>>;

  if (error) {
    throw new Error(`Failed to load hero offers: ${error.message}`);
  }

  return new Map<string, HeroOfferRow>(
    ((data ?? []) as HeroOfferRow[]).map((heroOffer) => [heroOffer.campaign_id, heroOffer]),
  );
}

async function getCreatorMap(supabase: SupabaseLike, creatorIds: string[]) {
  if (creatorIds.length === 0) {
    return new Map<string, CreatorRow>();
  }

  const { data, error } = (await supabase
    .from("creators")
    .select("id, user_id, handle, tier, instagram_handle, tiktok_handle")
    .in("id", creatorIds)) as Awaited<
    QueryResult<
      Array<Omit<CreatorRow, "name" | "avatar_url">>
    >
  >;

  if (error) {
    throw new Error(`Failed to load creators: ${error.message}`);
  }

  return new Map<string, CreatorRow>(
    ((data ?? []) as Array<Omit<CreatorRow, "name" | "avatar_url">>).map((creator) => [
      creator.id,
      toCreatorRow(creator),
    ]),
  );
}

async function getApplicableLocationsByCampaignIds(
  supabase: SupabaseLike,
  campaigns: CampaignRow[],
) {
  if (campaigns.length === 0) {
    return new Map<string, LocationRow[]>();
  }

  const { data: junctionRows, error: junctionError } = (await supabase
    .from("campaign_locations")
    .select("campaign_id, location_id")
    .in(
      "campaign_id",
      campaigns.map((campaign) => campaign.id),
    )) as Awaited<QueryResult<CampaignLocationRow[]>>;

  if (junctionError) {
    throw new Error(`Failed to load campaign locations: ${junctionError.message}`);
  }

  const rows = (junctionRows ?? []) as CampaignLocationRow[];
  const locationIds = [...new Set(rows.map((row) => row.location_id))];

  if (locationIds.length === 0) {
    return new Map<string, LocationRow[]>();
  }

  const tenantIds = [...new Set(campaigns.map((campaign) => campaign.tenant_id))];
  const { data: locationRows, error: locationError } = (await supabase
    .from("locations")
    .select(
      "id, tenant_id, name, business_name, neighborhood, address, city, state, zip, lat, lng, phone",
    )
    .in("id", locationIds)
    .in("tenant_id", tenantIds)) as Awaited<QueryResult<LocationRow[]>>;

  if (locationError) {
    throw new Error(`Failed to load locations: ${locationError.message}`);
  }

  const campaignTenantMap = new Map<string, string>(
    campaigns.map((campaign) => [campaign.id, campaign.tenant_id]),
  );
  const locationMap = new Map<string, LocationRow>(
    ((locationRows ?? []) as LocationRow[]).map((location) => [location.id, location]),
  );
  const grouped = new Map<string, LocationRow[]>();

  for (const row of rows) {
    const location = locationMap.get(row.location_id);
    const tenantId = campaignTenantMap.get(row.campaign_id);
    if (!location || !tenantId || location.tenant_id !== tenantId) {
      continue;
    }

    const list = grouped.get(row.campaign_id) ?? [];
    list.push(location);
    grouped.set(row.campaign_id, list);
  }

  return grouped;
}

export async function listMerchantQrCodes(
  supabase: SupabaseLike,
  filters: { campaignId?: string | null; posterType?: string | null; status?: string | null },
  tenantId?: string,
) {
  const merchantId = await getCurrentMerchantId(supabase, tenantId);

  let query = supabase
    .from("qr_codes")
    .select(
      "id, creator_id, campaign_id, merchant_id, short_code, poster_type, hero_message, sub_message, disabled, scan_count, conversion_count, verified_customers, attributed_revenue, scan_url, last_active_at, created_at",
    )
    .eq("merchant_id", merchantId);

  if (filters.campaignId) {
    query = query.eq("campaign_id", filters.campaignId);
  }
  if (filters.posterType) {
    query = query.eq("poster_type", filters.posterType);
  }
  if (filters.status === "active") {
    query = query.eq("disabled", false);
  }
  if (filters.status === "disabled") {
    query = query.eq("disabled", true);
  }

  const { data, error } = (await query.order("created_at", {
    ascending: false,
  })) as Awaited<QueryResult<QRCodeRow[]>>;

  if (error) {
    throw new Error(`Failed to load QR codes: ${error.message}`);
  }

  const qrRows = (data ?? []) as QRCodeRow[];
  const campaignMap = await getCampaignMap(
    supabase,
    [...new Set(qrRows.map((row) => row.campaign_id))],
  );
  const creatorMap = await getCreatorMap(
    supabase,
    [
      ...new Set(
        qrRows
          .map((row) => row.creator_id)
          .filter((value): value is string => typeof value === "string" && value.length > 0),
      ),
    ],
  );

  return qrRows.map<QRCodeRecord>((row) =>
    toQrCodeRecord(
      row,
      campaignMap.get(row.campaign_id)?.title ?? "Campaign",
      row.creator_id ? creatorMap.get(row.creator_id) ?? null : null,
    ),
  );
}

export async function getMerchantQrCodeDetail(
  supabase: SupabaseLike,
  id: string,
  tenantId?: string,
) {
  const merchantId = await getCurrentMerchantId(supabase, tenantId);

  const { data: qr, error } = (await supabase
    .from("qr_codes")
    .select(
      "id, creator_id, campaign_id, merchant_id, short_code, poster_type, hero_message, sub_message, disabled, scan_count, conversion_count, verified_customers, attributed_revenue, scan_url, last_active_at, created_at",
    )
    .eq("id", id)
    .eq("merchant_id", merchantId)
    .single()) as Awaited<QueryResult<QRCodeRow>>;

  if (error) {
    if (isMissingRowError(error)) return null;
    throw new Error(`Failed to load QR code: ${error.message}`);
  }
  if (!qr) {
    return null;
  }

  const campaignMap = await getCampaignMap(supabase, [qr.campaign_id]);
  const campaign = campaignMap.get(qr.campaign_id);
  if (!campaign || campaign.merchant_id !== merchantId) {
    return null;
  }

  const locationMap = await getApplicableLocationsByCampaignIds(supabase, [campaign]);
  const creatorMap = await getCreatorMap(
    supabase,
    qr.creator_id ? [qr.creator_id] : [],
  );
  const creator = qr.creator_id ? creatorMap.get(qr.creator_id) ?? null : null;

  return {
    qr: toQrCodeRecord(qr, campaign.title, creator),
    campaign,
    applicable_locations: withDistance(locationMap.get(campaign.id) ?? []),
  };
}

export async function getPublicQrContext(
  supabase: SupabaseLike,
  shortCode: string,
  coords?: { lat?: number | null; lng?: number | null } | null,
) {
  const { data: qr, error } = (await supabase
    .from("qr_codes")
    .select(
      "id, creator_id, campaign_id, merchant_id, short_code, poster_type, hero_message, sub_message, disabled, scan_count, conversion_count, verified_customers, attributed_revenue, scan_url, last_active_at, created_at",
    )
    .eq("short_code", shortCode)
    .single()) as Awaited<QueryResult<QRCodeRow>>;

  if (error) {
    if (isMissingRowError(error)) return null;
    throw new Error(`Failed to load QR code by short code: ${error.message}`);
  }
  if (!qr) {
    return null;
  }

  const campaignMap = await getCampaignMap(supabase, [qr.campaign_id]);
  const campaign = campaignMap.get(qr.campaign_id);
  if (!campaign) {
    throw new Error(`Campaign ${qr.campaign_id} not found for QR code ${qr.id}.`);
  }

  const { data: merchant, error: merchantError } = (await supabase
    .from("merchants")
    .select("id, tenant_id, owner_user_id, business_name")
    .eq("id", campaign.merchant_id)
    .single()) as Awaited<QueryResult<MerchantRow>>;

  if (merchantError) {
    throw new Error(`Failed to load merchant: ${merchantError.message}`);
  }
  if (!merchant) {
    throw new Error(`Merchant ${campaign.merchant_id} not found.`);
  }

  const creatorMap = await getCreatorMap(
    supabase,
    qr.creator_id ? [qr.creator_id] : [],
  );
  const locationMap = await getApplicableLocationsByCampaignIds(supabase, [campaign]);

  return {
    qr,
    campaign,
    merchant,
    creator: qr.creator_id ? creatorMap.get(qr.creator_id) ?? null : null,
    hero_offer: campaign.hero_offer,
    applicable_locations: withDistance(locationMap.get(campaign.id) ?? [], coords),
  };
}
