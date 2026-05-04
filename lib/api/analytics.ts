type AttributionSummary = {
  scans: number;
  verified_customers: number;
  revenue_attributed: number;
  roi: number;
  fraud_flags: number;
  by_creator: {
    creator_id: string;
    scans: number;
    verified: number;
    revenue: number;
    roi: number;
  }[];
  by_location: {
    location_id: string;
    scans: number;
    verified: number;
    revenue: number;
  }[];
  by_day: {
    date: string;
    scans: number;
    verified: number;
  }[];
};

type AnalyticsFilterInput = {
  campaignId?: string;
  creatorId?: string;
  locationId?: string;
  from?: Date;
  to?: Date;
};

type CampaignRow = {
  id: string;
  title?: string | null;
};

type ClickRow = {
  click_id: string;
  creator_id?: string | null;
  campaign_id?: string | null;
  clicked_at?: string | null;
};

type ClaimRow = {
  claim_id: string;
  click_id?: string | null;
  hero_offer_id?: string | null;
};

type RedemptionRow = {
  redemption_id: string;
  claim_id?: string | null;
  visit_id?: string | null;
};

type VisitRow = {
  visit_id: string;
  linked_claim_id?: string | null;
  location_id?: string | null;
};

type HeroOfferRow = {
  id: string;
  type?: string | null;
  value_numeric?: number | string | null;
};

type CreatorRow = {
  id: string;
  handle?: string | null;
};

type LocationRow = {
  id: string;
  name?: string | null;
};

type CampaignMetric = {
  campaign_id: string;
  name: string;
  scans: number;
  verified: number;
  revenue: number;
};

type AnalyticsReport = {
  summary: AttributionSummary;
  campaigns: CampaignMetric[];
};

function toIso(input: Date): string {
  return input.toISOString();
}

function toDateKey(value: string | null | undefined): string {
  const date = value ? new Date(value) : new Date();
  return Number.isNaN(date.getTime())
    ? new Date().toISOString().slice(0, 10)
    : date.toISOString().slice(0, 10);
}

function toNumber(value: number | string | null | undefined): number {
  if (typeof value === "number") return value;
  if (typeof value === "string") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
  }
  return 0;
}

function safeRoi(revenue: number, verified: number): number {
  const estimatedCost = Math.max(verified * 1200, 1);
  return Number((revenue / estimatedCost).toFixed(2));
}

function buildEmptySummary(): AttributionSummary {
  return {
    scans: 0,
    verified_customers: 0,
    revenue_attributed: 0,
    roi: 0,
    fraud_flags: 0,
    by_creator: [],
    by_location: [],
    by_day: [],
  };
}

async function fetchTenantCampaigns(
  supabase: any,
  tenantId: string,
  filters: AnalyticsFilterInput,
): Promise<Map<string, CampaignRow>> {
  let query = supabase
    .from("campaigns")
    .select("id, title")
    .eq("tenant_id", tenantId);

  if (filters.campaignId) {
    query = query.eq("id", filters.campaignId);
  }

  const { data, error } = await query;
  if (error) {
    throw new Error(error.message);
  }

  return new Map<string, CampaignRow>(
    ((data ?? []) as CampaignRow[]).map((campaign) => [campaign.id, campaign]),
  );
}

async function fetchClicks(
  supabase: any,
  campaignIds: string[],
  filters: AnalyticsFilterInput,
): Promise<ClickRow[]> {
  if (campaignIds.length === 0) {
    return [];
  }

  const from = filters.from ?? new Date(Date.now() - 30 * 86400000);
  const to = filters.to ?? new Date();

  let query = supabase
    .from("click_events")
    .select("click_id, creator_id, campaign_id, clicked_at")
    .in("campaign_id", campaignIds)
    .gte("clicked_at", toIso(from))
    .lte("clicked_at", toIso(to));

  if (filters.creatorId) {
    query = query.eq("creator_id", filters.creatorId);
  }

  const { data, error } = await query;
  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []) as ClickRow[];
}

async function fetchClaims(
  supabase: any,
  clickIds: string[],
): Promise<ClaimRow[]> {
  if (clickIds.length === 0) {
    return [];
  }

  const { data, error } = await supabase
    .from("offer_claims")
    .select("claim_id, click_id, hero_offer_id")
    .in("click_id", clickIds);

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []) as ClaimRow[];
}

async function fetchRedemptions(
  supabase: any,
  claimIds: string[],
): Promise<RedemptionRow[]> {
  if (claimIds.length === 0) {
    return [];
  }

  const { data, error } = await supabase
    .from("offer_redemptions")
    .select("redemption_id, claim_id, visit_id")
    .in("claim_id", claimIds);

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []) as RedemptionRow[];
}

async function fetchVisitsByClaimIds(
  supabase: any,
  claimIds: string[],
): Promise<VisitRow[]> {
  if (claimIds.length === 0) {
    return [];
  }

  const { data, error } = await supabase
    .from("visit_events")
    .select("visit_id, linked_claim_id, location_id")
    .in("linked_claim_id", claimIds);

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []) as VisitRow[];
}

async function fetchVisitsByIds(
  supabase: any,
  visitIds: string[],
): Promise<VisitRow[]> {
  if (visitIds.length === 0) {
    return [];
  }

  const { data, error } = await supabase
    .from("visit_events")
    .select("visit_id, linked_claim_id, location_id")
    .in("visit_id", visitIds);

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []) as VisitRow[];
}

async function fetchHeroOffers(
  supabase: any,
  heroOfferIds: string[],
): Promise<Map<string, HeroOfferRow>> {
  const result = new Map<string, HeroOfferRow>();
  if (heroOfferIds.length === 0) {
    return result;
  }

  const { data, error } = await supabase
    .from("hero_offers")
    .select("id, type, value_numeric")
    .in("id", heroOfferIds);

  if (error) {
    throw new Error(error.message);
  }

  for (const row of (data ?? []) as HeroOfferRow[]) {
    result.set(row.id, row);
  }

  return result;
}

async function fetchCreatorNames(
  supabase: any,
  creatorIds: string[],
): Promise<Map<string, string>> {
  const result = new Map<string, string>();
  if (creatorIds.length === 0) return result;

  const { data } = await supabase
    .from("creators")
    .select("id, handle")
    .in("id", creatorIds);

  for (const row of (data ?? []) as CreatorRow[]) {
    result.set(row.id, row.handle ?? row.id);
  }

  return result;
}

async function fetchLocationNames(
  supabase: any,
  locationIds: string[],
): Promise<Map<string, string>> {
  const result = new Map<string, string>();
  if (locationIds.length === 0) return result;

  const { data } = await supabase
    .from("locations")
    .select("id, name")
    .in("id", locationIds);

  for (const row of (data ?? []) as LocationRow[]) {
    result.set(row.id, row.name ?? row.id);
  }

  return result;
}

function groupByKey<T extends Record<string, unknown>>(
  rows: T[],
  key: keyof T,
): Map<string, T[]> {
  const result = new Map<string, T[]>();

  for (const row of rows) {
    const value = row[key];
    if (typeof value !== "string" || value.length === 0) {
      continue;
    }

    const bucket = result.get(value) ?? [];
    bucket.push(row);
    result.set(value, bucket);
  }

  return result;
}

function getRedemptionRevenue(heroOffer: HeroOfferRow | undefined): number {
  if (heroOffer?.type === "fixed_amount") {
    return toNumber(heroOffer.value_numeric);
  }

  // TODO(v2): non-fixed hero offers need a clearer attributed revenue model.
  return 0;
}

async function buildAnalyticsReport(
  supabase: any,
  tenantId: string,
  filters: AnalyticsFilterInput,
): Promise<AnalyticsReport> {
  const campaignMap = await fetchTenantCampaigns(supabase, tenantId, filters);
  const campaignIds = Array.from(campaignMap.keys());

  if (campaignIds.length === 0) {
    return { summary: buildEmptySummary(), campaigns: [] };
  }

  const clicks = await fetchClicks(supabase, campaignIds, filters);
  if (clicks.length === 0) {
    return { summary: buildEmptySummary(), campaigns: [] };
  }

  const clickIds = clicks.map((row) => row.click_id);
  const claims = await fetchClaims(supabase, clickIds);
  const claimIds = claims.map((row) => row.claim_id);
  const redemptions = await fetchRedemptions(supabase, claimIds);
  const visitsByClaim = await fetchVisitsByClaimIds(supabase, claimIds);
  const visitsByRedemptionId = await fetchVisitsByIds(
    supabase,
    redemptions.map((row) => row.visit_id ?? "").filter(Boolean),
  );
  const heroOffers = await fetchHeroOffers(
    supabase,
    claims.map((row) => row.hero_offer_id ?? "").filter(Boolean),
  );

  const claimsByClick = groupByKey(claims, "click_id");
  const redemptionsByClaim = groupByKey(redemptions, "claim_id");
  const visitsByClaimId = groupByKey(visitsByClaim, "linked_claim_id");
  const visitById = new Map<string, VisitRow>(
    visitsByRedemptionId.map((visit) => [visit.visit_id, visit]),
  );

  const byCreator = new Map<string, { creator_id: string; scans: number; verified: number; revenue: number; roi: number }>();
  const byLocation = new Map<string, { location_id: string; click_ids: Set<string>; verified: number; revenue: number }>();
  const byDay = new Map<string, { date: string; scans: number; verified: number }>();
  const byCampaign = new Map<string, CampaignMetric>();

  let scans = 0;
  let verifiedCustomers = 0;
  let revenueAttributed = 0;

  for (const click of clicks) {
    const clickClaims = claimsByClick.get(click.click_id) ?? [];
    const clickLocations = new Set<string>();
    const locationRedemptionMetrics = new Map<string, { verified: number; revenue: number }>();
    let clickVerified = 0;
    let clickRevenue = 0;
    let matchesLocationFilter = !filters.locationId;

    for (const claim of clickClaims) {
      const claimVisits = visitsByClaimId.get(claim.claim_id) ?? [];
      const claimRedemptions = redemptionsByClaim.get(claim.claim_id) ?? [];

      for (const visit of claimVisits) {
        const locationId = visit.location_id ?? "unknown";
        if (!filters.locationId || locationId === filters.locationId) {
          clickLocations.add(locationId);
          matchesLocationFilter = true;
        }
      }

      for (const redemption of claimRedemptions) {
        const visit = redemption.visit_id ? visitById.get(redemption.visit_id) : undefined;
        const fallbackVisit = claimVisits[0];
        const locationId = visit?.location_id ?? fallbackVisit?.location_id ?? "unknown";

        if (filters.locationId && locationId !== filters.locationId) {
          continue;
        }

        const revenue = getRedemptionRevenue(
          claim.hero_offer_id ? heroOffers.get(claim.hero_offer_id) : undefined,
        );

        clickLocations.add(locationId);
        matchesLocationFilter = true;
        clickVerified += 1;
        clickRevenue += revenue;

        const bucket =
          locationRedemptionMetrics.get(locationId) ?? { verified: 0, revenue: 0 };
        bucket.verified += 1;
        bucket.revenue += revenue;
        locationRedemptionMetrics.set(locationId, bucket);
      }
    }

    if (!matchesLocationFilter) {
      continue;
    }

    const creatorId = click.creator_id ?? "unknown";
    const campaignId = click.campaign_id ?? "unknown";
    const date = toDateKey(click.clicked_at);

    scans += 1;
    verifiedCustomers += clickVerified;
    revenueAttributed += clickRevenue;

    const creatorBucket =
      byCreator.get(creatorId) ??
      { creator_id: creatorId, scans: 0, verified: 0, revenue: 0, roi: 0 };
    creatorBucket.scans += 1;
    creatorBucket.verified += clickVerified;
    creatorBucket.revenue += clickRevenue;
    creatorBucket.roi = safeRoi(creatorBucket.revenue, creatorBucket.verified);
    byCreator.set(creatorId, creatorBucket);

    const campaignBucket =
      byCampaign.get(campaignId) ?? {
        campaign_id: campaignId,
        name: campaignMap.get(campaignId)?.title ?? campaignId,
        scans: 0,
        verified: 0,
        revenue: 0,
      };
    campaignBucket.scans += 1;
    campaignBucket.verified += clickVerified;
    campaignBucket.revenue += clickRevenue;
    byCampaign.set(campaignId, campaignBucket);

    const dayBucket = byDay.get(date) ?? { date, scans: 0, verified: 0 };
    dayBucket.scans += 1;
    dayBucket.verified += clickVerified;
    byDay.set(date, dayBucket);

    for (const locationId of clickLocations) {
      const bucket =
        byLocation.get(locationId) ??
        { location_id: locationId, click_ids: new Set<string>(), verified: 0, revenue: 0 };
      bucket.click_ids.add(click.click_id);
      byLocation.set(locationId, bucket);
    }

    for (const [locationId, metrics] of locationRedemptionMetrics.entries()) {
      const bucket =
        byLocation.get(locationId) ??
        { location_id: locationId, click_ids: new Set<string>(), verified: 0, revenue: 0 };
      bucket.click_ids.add(click.click_id);
      bucket.verified += metrics.verified;
      bucket.revenue += metrics.revenue;
      byLocation.set(locationId, bucket);
    }
  }

  return {
    summary: {
      scans,
      verified_customers: verifiedCustomers,
      revenue_attributed: revenueAttributed,
      roi: safeRoi(revenueAttributed, verifiedCustomers),
      // TODO(v2): fraud pipeline has not been rebuilt on click/claim/visit/redemption tables.
      fraud_flags: 0,
      by_creator: Array.from(byCreator.values()).sort((a, b) => b.revenue - a.revenue),
      by_location: Array.from(byLocation.values())
        .map((row) => ({
          location_id: row.location_id,
          scans: row.click_ids.size,
          verified: row.verified,
          revenue: row.revenue,
        }))
        .sort((a, b) => b.verified - a.verified || b.scans - a.scans),
      by_day: Array.from(byDay.values()).sort((a, b) => a.date.localeCompare(b.date)),
    },
    campaigns: Array.from(byCampaign.values()),
  };
}

export async function getKpis(
  supabase: any,
  tenantId: string,
  periodDays: number,
): Promise<{
  total_scans: number;
  verified_customers: number;
  revenue_attributed: number;
  roi: number;
}> {
  const from = new Date(Date.now() - periodDays * 86400000);
  const summary = await getAttributionSummary(supabase, tenantId, { from, to: new Date() });

  return {
    total_scans: summary.scans,
    verified_customers: summary.verified_customers,
    revenue_attributed: summary.revenue_attributed,
    roi: summary.roi,
  };
}

export async function getTimeSeries(
  supabase: any,
  tenantId: string,
  from: Date,
  to: Date,
): Promise<{ date: string; scans: number; verified: number }[]> {
  const summary = await getAttributionSummary(supabase, tenantId, { from, to });
  return summary.by_day;
}

export async function getTopCampaigns(
  supabase: any,
  tenantId: string,
  from: Date,
  to: Date,
  limit = 5,
): Promise<
  {
    campaign_id: string;
    name: string;
    scans: number;
    verified: number;
    revenue: number;
  }[]
> {
  const report = await buildAnalyticsReport(supabase, tenantId, { from, to });

  return report.campaigns
    .sort((a, b) => b.revenue - a.revenue || b.scans - a.scans)
    .slice(0, limit);
}

export async function getTopCreators(
  supabase: any,
  tenantId: string,
  from: Date,
  to: Date,
  limit = 5,
): Promise<
  {
    creator_id: string;
    name: string;
    scans: number;
    verified: number;
    revenue: number;
  }[]
> {
  const summary = await getAttributionSummary(supabase, tenantId, { from, to });
  const creatorIds = summary.by_creator.map((row) => row.creator_id).filter((id) => id !== "unknown");
  const names = await fetchCreatorNames(supabase, creatorIds);

  return summary.by_creator
    .map((row) => ({
      creator_id: row.creator_id,
      name: names.get(row.creator_id) ?? row.creator_id,
      scans: row.scans,
      verified: row.verified,
      revenue: row.revenue,
    }))
    .sort((a, b) => b.revenue - a.revenue || b.scans - a.scans)
    .slice(0, limit);
}

export async function getTopLocations(
  supabase: any,
  tenantId: string,
  from: Date,
  to: Date,
  limit = 5,
): Promise<
  {
    location_id: string;
    name: string;
    scans: number;
    verified: number;
  }[]
> {
  const summary = await getAttributionSummary(supabase, tenantId, { from, to });
  const locationIds = summary.by_location
    .map((row) => row.location_id)
    .filter((id) => id !== "unknown");
  const names = await fetchLocationNames(supabase, locationIds);

  return summary.by_location
    .map((row) => ({
      location_id: row.location_id,
      name: names.get(row.location_id) ?? row.location_id,
      scans: row.scans,
      verified: row.verified,
    }))
    .sort((a, b) => b.verified - a.verified || b.scans - a.scans)
    .slice(0, limit);
}

export async function getAttributionSummary(
  supabase: any,
  tenantId: string,
  filters: AnalyticsFilterInput,
): Promise<AttributionSummary> {
  const report = await buildAnalyticsReport(supabase, tenantId, filters);
  return report.summary;
}
