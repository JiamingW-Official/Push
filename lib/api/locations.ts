import type { SupabaseClient } from "@supabase/supabase-js";
import type { BusinessHours, Location } from "@/lib/merchant/mock-locations";

export type LocationStats = {
  campaigns_participated: number;
  total_scans: number;
  verified: number;
  revenue: number;
};

export type MerchantLocation = Location & {
  tenant_id: string;
  business_name: string;
  stats?: LocationStats;
};

type LocationRow = {
  id: string;
  tenant_id: string;
  name: string;
  business_name: string | null;
  neighborhood: string | null;
  address: string;
  city: string | null;
  state: string | null;
  zip: string | null;
  lat: number | string | null;
  lng: number | string | null;
  status: "open" | "closed" | null;
  image_url: string | null;
  phone: string | null;
  email: string | null;
  hours: Record<string, string> | null;
  created_at: string;
};

type CampaignLocationRow = {
  campaign_id: string;
  location_id: string;
};

type CampaignRevenueRow = {
  id: string;
  reward_per_visit: number | string | null;
};

type QrCodeRow = {
  campaign_id: string;
  scan_count: number | null;
  verified_customers: number | null;
};

export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
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

function asOptionalNumber(value: unknown, field: string): number | undefined {
  if (value === undefined || value === null || value === "") {
    return undefined;
  }

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

export function parseLocationPayload(
  input: unknown,
  options: { partial?: boolean } = {},
): Partial<LocationRow> {
  const { partial = false } = options;

  if (!isObject(input)) {
    throw new ApiError(400, "Request body must be a JSON object");
  }

  const parsed: Partial<LocationRow> = {};

  if (!partial || input.name !== undefined) {
    parsed.name = asString(input.name, "name");
  }

  if (!partial || input.address !== undefined) {
    parsed.address = asString(input.address, "address");
  }

  const neighborhood = asOptionalString(input.neighborhood);
  if (neighborhood !== undefined) {
    parsed.neighborhood = neighborhood;
  }

  const city = asOptionalString(input.city);
  if (city !== undefined) {
    parsed.city = city;
  }

  const state = asOptionalString(input.state);
  if (state !== undefined) {
    parsed.state = state;
  }

  const zip = asOptionalString(input.zip);
  if (zip !== undefined) {
    parsed.zip = zip;
  }

  const imageUrl = asOptionalString(input.image_url);
  if (imageUrl !== undefined) {
    parsed.image_url = imageUrl;
  }

  const phone = asOptionalString(input.phone);
  if (phone !== undefined) {
    parsed.phone = phone;
  }

  const email = asOptionalString(input.email);
  if (email !== undefined) {
    parsed.email = email;
  }

  const lat = asOptionalNumber(input.lat, "lat");
  if (lat !== undefined) {
    parsed.lat = lat;
  }

  const lng = asOptionalNumber(input.lng, "lng");
  if (lng !== undefined) {
    parsed.lng = lng;
  }

  if (input.status !== undefined) {
    if (input.status !== "open" && input.status !== "closed") {
      throw new ApiError(422, "status must be open or closed");
    }
    parsed.status = input.status;
  }

  return parsed;
}

async function getTenantMerchantId(
  supabase: SupabaseClient,
  tenantId: string,
): Promise<string> {
  const { data, error } = await supabase
    .from("merchants")
    .select("id")
    .eq("tenant_id", tenantId)
    .maybeSingle();

  if (error) {
    throw new ApiError(500, error.message);
  }

  if (!data?.id) {
    throw new ApiError(404, "Merchant not found");
  }

  return data.id as string;
}

function formatHours(hours: Record<string, string> | null): BusinessHours[] {
  const dayNames: Array<[string, string]> = [
    ["mon", "Monday"],
    ["tue", "Tuesday"],
    ["wed", "Wednesday"],
    ["thu", "Thursday"],
    ["fri", "Friday"],
    ["sat", "Saturday"],
    ["sun", "Sunday"],
  ];

  return dayNames.map(([key, label]) => {
    const value = hours?.[key];

    if (!value || !value.includes("-")) {
      return { day: label, open: "", close: "", closed: true };
    }

    const [open, close] = value.split("-", 2);
    return { day: label, open, close, closed: false };
  });
}

function sanitizeLocation(
  row: LocationRow,
  merchantId: string,
): MerchantLocation {
  return {
    id: row.id,
    merchant_id: merchantId,
    tenant_id: row.tenant_id,
    name: row.name,
    business_name: row.business_name ?? row.name,
    neighborhood: row.neighborhood ?? "",
    address: row.address,
    city: row.city ?? "New York",
    state: row.state ?? "NY",
    zip: row.zip ?? "",
    lat: toNumber(row.lat),
    lng: toNumber(row.lng),
    status: row.status ?? "open",
    image_url: row.image_url ?? "",
    phone: row.phone ?? "",
    email: row.email ?? "",
    scans_7d: 0,
    conversions_30d: 0,
    staff_count: 0,
    primary_campaign_title: null,
    primary_campaign_status: null,
    qr_codes: [],
    staff: [],
    hours: formatHours(row.hours),
    campaign_history: [],
    pos_integrations: [],
    created_at: row.created_at,
  };
}

export async function listTenantLocations(
  supabase: SupabaseClient,
  tenantId: string,
): Promise<MerchantLocation[]> {
  const merchantId = await getTenantMerchantId(supabase, tenantId);
  const { data, error } = await supabase
    .from("locations")
    .select(
      "id, tenant_id, name, business_name, neighborhood, address, city, state, zip, lat, lng, status, image_url, phone, email, hours, created_at",
    )
    .eq("tenant_id", tenantId)
    .order("created_at", { ascending: false });

  if (error) {
    throw new ApiError(500, error.message);
  }

  return ((data ?? []) as LocationRow[]).map((row) =>
    sanitizeLocation(row, merchantId),
  );
}

export async function getTenantLocation(
  supabase: SupabaseClient,
  tenantId: string,
  locationId: string,
): Promise<MerchantLocation> {
  const merchantId = await getTenantMerchantId(supabase, tenantId);
  const { data, error } = await supabase
    .from("locations")
    .select(
      "id, tenant_id, name, business_name, neighborhood, address, city, state, zip, lat, lng, status, image_url, phone, email, hours, created_at",
    )
    .eq("tenant_id", tenantId)
    .eq("id", locationId)
    .maybeSingle();

  if (error) {
    throw new ApiError(500, error.message);
  }

  if (!data) {
    throw new ApiError(404, "Location not found");
  }

  return sanitizeLocation(data as LocationRow, merchantId);
}

export async function getLocationStats(
  supabase: SupabaseClient,
  tenantId: string,
  locationId: string,
): Promise<LocationStats> {
  await getTenantLocation(supabase, tenantId, locationId);
  const merchantId = await getTenantMerchantId(supabase, tenantId);

  const { data: campaignLinks, error: linksError } = await supabase
    .from("campaign_locations")
    .select("campaign_id, location_id")
    .eq("location_id", locationId);

  if (linksError) {
    throw new ApiError(500, linksError.message);
  }

  const linkRows = (campaignLinks ?? []) as CampaignLocationRow[];
  if (linkRows.length === 0) {
    return {
      campaigns_participated: 0,
      total_scans: 0,
      verified: 0,
      revenue: 0,
    };
  }

  const campaignIds = [...new Set(linkRows.map((row) => row.campaign_id))];

  const [
    { data: campaigns, error: campaignsError },
    { data: qrCodes, error: qrError },
  ] = await Promise.all([
    supabase
      .from("campaigns")
      .select("id, reward_per_visit")
      .in("id", campaignIds)
      .eq("merchant_id", merchantId),
    supabase
      .from("qr_codes")
      .select("campaign_id, scan_count, verified_customers")
      .in("campaign_id", campaignIds)
      .eq("merchant_id", merchantId),
  ]);

  if (campaignsError) {
    throw new ApiError(500, campaignsError.message);
  }

  if (qrError) {
    throw new ApiError(500, qrError.message);
  }

  const campaignRows = (campaigns ?? []) as CampaignRevenueRow[];
  const qrRows = (qrCodes ?? []) as QrCodeRow[];

  const rewardMap = new Map<string, number>();
  for (const campaign of campaignRows) {
    rewardMap.set(campaign.id, toNumber(campaign.reward_per_visit));
  }

  let totalScans = 0;
  let verified = 0;
  let revenue = 0;

  for (const qrCode of qrRows) {
    const scanCount = qrCode.scan_count ?? 0;
    const verifiedCount = qrCode.verified_customers ?? 0;
    totalScans += scanCount;
    verified += verifiedCount;
    revenue += verifiedCount * (rewardMap.get(qrCode.campaign_id) ?? 0);
  }

  return {
    campaigns_participated: campaignRows.length,
    total_scans: totalScans,
    verified,
    revenue,
  };
}
