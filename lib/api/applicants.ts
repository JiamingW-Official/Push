import type { SupabaseClient } from "@supabase/supabase-js";
import type { Application } from "@/lib/data/types";
import type { ApplicantFilters, MockApplication } from "@/lib/data/mock-applications";

export type ApplicantDecision = "accept" | "decline" | "shortlist";
export type StoredApplicationStatus = Application["status"] | "shortlisted";

type ApplicationRow = {
  id: string;
  campaign_id: string;
  creator_id: string;
  merchant_id: string;
  status: StoredApplicationStatus;
  applied_at: string;
  reviewed_at: string | null;
  decided_at: string | null;
  decided_by: string | null;
  note: string | null;
  match_score: number | null;
  cover_letter: string | null;
  sample_urls: string[] | null;
};

type CreatorRow = {
  id: string;
  name: string | null;
  handle: string | null;
  instagram_handle: string | null;
  avatar_url: string | null;
  bio: string | null;
  tier: MockApplication["creator"]["tier"] | null;
  push_score: number | string | null;
  instagram_followers: number | null;
  campaigns_completed: number | null;
  created_at: string;
};

type CampaignRow = {
  id: string;
  title: string | null;
  tenant_id: string;
};

type QrCodeRow = {
  id: string;
  creator_id: string;
  campaign_id: string;
  merchant_id: string;
  short_code: string;
  poster_type: string;
  scan_count: number | null;
  verified_customers: number | null;
  created_at: string;
};

export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

type ApplicantDetail = {
  application: ApplicationRow;
  campaign: CampaignRow;
  creator?: CreatorRow;
};

const BASE62 = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
const DB_TO_FILTER_STATUS: Record<StoredApplicationStatus, MockApplication["status"]> = {
  pending: "pending",
  accepted: "accepted",
  rejected: "declined",
  withdrawn: "declined",
  completed: "accepted",
  shortlisted: "shortlisted",
};

const DECISION_TO_STATUS: Record<ApplicantDecision, StoredApplicationStatus> = {
  accept: "accepted",
  decline: "rejected",
  shortlist: "shortlisted",
};

const ALLOWED_TRANSITIONS: Record<StoredApplicationStatus, ApplicantDecision[]> = {
  pending: ["accept", "decline", "shortlist"],
  shortlisted: ["accept", "decline", "shortlist"],
  accepted: ["accept"],
  rejected: ["decline"],
  withdrawn: [],
  completed: [],
};

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
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

export function shortCodeGenerator(): string {
  let output = "";

  for (let index = 0; index < 8; index += 1) {
    const offset = Math.floor(Math.random() * BASE62.length);
    output += BASE62[offset];
  }

  return output;
}

export function parseApplicantDecision(input: unknown): ApplicantDecision {
  if (!isObject(input) || typeof input.decision !== "string") {
    throw new ApiError(400, "decision is required");
  }

  if (
    input.decision !== "accept" &&
    input.decision !== "decline" &&
    input.decision !== "shortlist"
  ) {
    throw new ApiError(422, "decision must be accept, decline, or shortlist");
  }

  return input.decision;
}

export function buildApplicantFilters(
  searchParams: URLSearchParams,
): ApplicantFilters & { minScore?: number } {
  const minScoreParam = searchParams.get("minScore");
  const pageParam = searchParams.get("page");
  const limitParam = searchParams.get("limit");

  const minScore =
    minScoreParam === null ? undefined : Number.parseInt(minScoreParam, 10);

  if (minScoreParam !== null && Number.isNaN(minScore)) {
    throw new ApiError(400, "minScore must be a valid integer");
  }

  const page =
    pageParam === null ? 1 : Number.parseInt(pageParam, 10);
  const limit =
    limitParam === null ? 25 : Number.parseInt(limitParam, 10);

  if (Number.isNaN(page) || page < 1) {
    throw new ApiError(400, "page must be a positive integer");
  }

  if (Number.isNaN(limit) || limit < 1) {
    throw new ApiError(400, "limit must be a positive integer");
  }

  return {
    campaignId: searchParams.get("campaignId") ?? undefined,
    tiers:
      searchParams.getAll("tier").length > 0
        ? (searchParams.getAll("tier") as ApplicantFilters["tiers"])
        : undefined,
    status:
      searchParams.getAll("status").length > 0
        ? (searchParams.getAll("status") as ApplicantFilters["status"])
        : undefined,
    sort:
      (searchParams.get("sort") as ApplicantFilters["sort"] | null) ?? "recent",
    search: searchParams.get("search") ?? undefined,
    page,
    limit,
    minScore,
  };
}

function sanitizeApplicant(
  application: ApplicationRow,
  campaign: CampaignRow | undefined,
  creator: CreatorRow | undefined,
): MockApplication {
  return {
    id: application.id,
    campaignId: application.campaign_id,
    campaignName: campaign?.title ?? "Untitled Campaign",
    status: DB_TO_FILTER_STATUS[application.status] ?? "pending",
    matchScore: application.match_score ?? 0,
    coverLetter: application.cover_letter ?? "",
    sampleUrls: application.sample_urls ?? [],
    appliedAt: application.applied_at,
    creator: {
      id: application.creator_id,
      name: creator?.name ?? "Unknown Creator",
      handle: creator?.instagram_handle ?? creator?.handle ?? "",
      avatar: creator?.avatar_url ?? "",
      bio: creator?.bio ?? "",
      tier: creator?.tier ?? "seed",
      pushScore: toNumber(creator?.push_score ?? 0),
      followers: creator?.instagram_followers ?? 0,
      campaignsCompleted: creator?.campaigns_completed ?? 0,
      conversionRate: 0,
      lastActive: creator?.created_at ?? application.applied_at,
    },
  };
}

export async function listApplicants(
  supabase: SupabaseClient,
  tenantId: string,
  filters: ApplicantFilters & { minScore?: number },
): Promise<{ items: MockApplication[]; total: number; page: number; limit: number }> {
  let campaignQuery = supabase
    .from("campaigns")
    .select("id, title, tenant_id")
    .eq("tenant_id", tenantId);

  if (filters.campaignId) {
    campaignQuery = campaignQuery.eq("id", filters.campaignId);
  }

  const { data: campaigns, error: campaignsError } = await campaignQuery;
  if (campaignsError) {
    throw new ApiError(500, campaignsError.message);
  }

  const campaignRows = (campaigns ?? []) as CampaignRow[];
  if (campaignRows.length === 0) {
    return {
      items: [],
      total: 0,
      page: filters.page ?? 1,
      limit: filters.limit ?? 25,
    };
  }

  const campaignIds = campaignRows.map((row) => row.id);

  let applicationsQuery = supabase
    .from("applications")
    .select(
      "id, campaign_id, creator_id, merchant_id, status, applied_at, reviewed_at, decided_at, decided_by, note, match_score, cover_letter, sample_urls",
    )
    .in("campaign_id", campaignIds);

  if (filters.minScore !== undefined) {
    applicationsQuery = applicationsQuery.gte("match_score", filters.minScore);
  }

  if (filters.status && filters.status.length > 0) {
    const dbStatuses = new Set<StoredApplicationStatus>();
    for (const status of filters.status) {
      if (status === "declined") {
        dbStatuses.add("rejected");
        continue;
      }

      if (
        status === "pending" ||
        status === "accepted" ||
        status === "shortlisted"
      ) {
        dbStatuses.add(status);
      }
    }

    if (dbStatuses.size > 0) {
      applicationsQuery = applicationsQuery.in("status", [...dbStatuses]);
    }
  }

  const { data: applications, error: applicationsError } =
    await applicationsQuery;

  if (applicationsError) {
    throw new ApiError(500, applicationsError.message);
  }

  const applicationRows = (applications ?? []) as ApplicationRow[];
  if (applicationRows.length === 0) {
    return {
      items: [],
      total: 0,
      page: filters.page ?? 1,
      limit: filters.limit ?? 25,
    };
  }

  const creatorIds = [...new Set(applicationRows.map((row) => row.creator_id))];
  const [{ data: creators, error: creatorsError }] = await Promise.all([
    supabase
      .from("creators")
      .select(
        "id, name, handle, instagram_handle, avatar_url, bio, tier, push_score, instagram_followers, campaigns_completed, created_at",
      )
      .in("id", creatorIds),
  ]);

  if (creatorsError) {
    throw new ApiError(500, creatorsError.message);
  }

  const creatorMap = new Map<string, CreatorRow>();
  for (const creator of (creators ?? []) as CreatorRow[]) {
    creatorMap.set(creator.id, creator);
  }

  const campaignMap = new Map<string, CampaignRow>();
  for (const campaign of campaignRows) {
    campaignMap.set(campaign.id, campaign);
  }

  let items = applicationRows.map((row) =>
    sanitizeApplicant(row, campaignMap.get(row.campaign_id), creatorMap.get(row.creator_id)),
  );

  if (filters.tiers && filters.tiers.length > 0) {
    items = items.filter((item) => filters.tiers?.includes(item.creator.tier));
  }

  if (filters.search) {
    const query = filters.search.toLowerCase();
    items = items.filter(
      (item) =>
        item.creator.name.toLowerCase().includes(query) ||
        item.creator.handle.toLowerCase().includes(query),
    );
  }

  const sort = filters.sort ?? "recent";
  if (sort === "score_desc") {
    items.sort((left, right) => right.creator.pushScore - left.creator.pushScore);
  } else if (sort === "match_desc") {
    items.sort((left, right) => right.matchScore - left.matchScore);
  } else {
    items.sort(
      (left, right) =>
        new Date(right.appliedAt).getTime() - new Date(left.appliedAt).getTime(),
    );
  }

  const total = items.length;
  const page = filters.page ?? 1;
  const limit = filters.limit ?? 25;

  return {
    items: items.slice((page - 1) * limit, page * limit),
    total,
    page,
    limit,
  };
}

async function getApplicantDetailOrThrow(
  supabase: SupabaseClient,
  tenantId: string,
  applicationId: string,
): Promise<ApplicantDetail> {
  const { data: application, error } = await supabase
    .from("applications")
    .select(
      "id, campaign_id, creator_id, merchant_id, status, applied_at, reviewed_at, decided_at, decided_by, note, match_score, cover_letter, sample_urls",
    )
    .eq("id", applicationId)
    .maybeSingle();

  if (error) {
    throw new ApiError(500, error.message);
  }

  if (!application) {
    throw new ApiError(404, "Application not found");
  }

  const row = application as ApplicationRow;

  const { data: campaign, error: campaignError } = await supabase
    .from("campaigns")
    .select("id, title, tenant_id")
    .eq("id", row.campaign_id)
    .maybeSingle();

  if (campaignError) {
    throw new ApiError(500, campaignError.message);
  }

  if (!campaign || campaign.tenant_id !== tenantId) {
    throw new ApiError(404, "Application not found");
  }

  const { data: creator, error: creatorError } = await supabase
    .from("creators")
    .select(
      "id, name, handle, instagram_handle, avatar_url, bio, tier, push_score, instagram_followers, campaigns_completed, created_at",
    )
    .eq("id", row.creator_id)
    .maybeSingle();

  if (creatorError) {
    throw new ApiError(500, creatorError.message);
  }

  return {
    application: row,
    campaign: campaign as CampaignRow,
    creator: (creator as CreatorRow | null) ?? undefined,
  };
}

export async function getApplicantById(
  supabase: SupabaseClient,
  tenantId: string,
  applicationId: string,
): Promise<ApplicationRow> {
  const { application } = await getApplicantDetailOrThrow(
    supabase,
    tenantId,
    applicationId,
  );
  return application;
}

async function createApplicantQrCode(
  supabase: SupabaseClient,
  application: ApplicationRow,
): Promise<QrCodeRow | null> {
  const { data: existing, error: existingError } = await supabase
    .from("qr_codes")
    .select(
      "id, creator_id, campaign_id, merchant_id, short_code, poster_type, scan_count, verified_customers, created_at",
    )
    .eq("campaign_id", application.campaign_id)
    .eq("creator_id", application.creator_id)
    .maybeSingle();

  if (existingError) {
    throw new ApiError(500, existingError.message);
  }

  if (existing) {
    return existing as QrCodeRow;
  }

  for (let attempt = 0; attempt < 5; attempt += 1) {
    const shortCode = shortCodeGenerator();
    const { data, error } = await supabase
      .from("qr_codes")
      .insert({
        creator_id: application.creator_id,
        campaign_id: application.campaign_id,
        merchant_id: application.merchant_id,
        short_code: shortCode,
        poster_type: "a4",
      })
      .select(
        "id, creator_id, campaign_id, merchant_id, short_code, poster_type, scan_count, verified_customers, created_at",
      )
      .single();

    if (!error) {
      return data as QrCodeRow;
    }

    if (!error.message.toLowerCase().includes("short_code")) {
      throw new ApiError(500, error.message);
    }
  }

  throw new ApiError(500, "Failed to generate unique QR code");
}

export function assertDecisionTransition(
  currentStatus: StoredApplicationStatus,
  decision: ApplicantDecision,
): void {
  if (!(ALLOWED_TRANSITIONS[currentStatus] ?? []).includes(decision)) {
    throw new ApiError(
      422,
      `Cannot ${decision} an application in ${currentStatus} status`,
    );
  }
}

export async function applyApplicantDecision(
  supabase: SupabaseClient,
  tenantId: string,
  applicationId: string,
  decision: ApplicantDecision,
): Promise<MockApplication> {
  const { application: current } = await getApplicantDetailOrThrow(
    supabase,
    tenantId,
    applicationId,
  );
  assertDecisionTransition(current.status, decision);

  const status = getStoredStatusForDecision(decision);
  const timestamp = new Date().toISOString();
  const updates: Partial<ApplicationRow> = {
    status,
    reviewed_at: timestamp,
    decided_at: timestamp,
  };

  const { error } = await supabase
    .from("applications")
    .update(updates)
    .eq("id", applicationId);

  if (error) {
    throw new ApiError(500, error.message);
  }

  if (decision === "accept") {
    await createApplicantQrCode(supabase, {
      ...current,
      status,
      reviewed_at: timestamp,
      decided_at: timestamp,
    });
  }

  const updated = await getApplicantDetailOrThrow(supabase, tenantId, applicationId);
  return sanitizeApplicant(
    updated.application,
    updated.campaign,
    updated.creator,
  );
}

export function getStoredStatusForDecision(
  decision: ApplicantDecision,
): StoredApplicationStatus {
  return DECISION_TO_STATUS[decision];
}
