// Push Platform — API Client
//
// Usage:
//   NEXT_PUBLIC_USE_MOCK=1   → reads/writes localStorage mock store
//   (default)                → hits real API endpoints

import { mockStore } from "./mock-store";
import {
  CampaignStatus,
  type ApiResult,
  type Application,
  type Campaign,
  type Creator,
  type Merchant,
  type Milestone,
  type Payment,
  type QRCode,
  type ScanEvent,
} from "./types";

import {
  DEMO_CAMPAIGNS,
  DEMO_CREATOR,
  DEMO_APPLICATIONS,
  DEMO_PAYOUTS,
} from "@/lib/demo-data";

import type {
  ContentType,
  Platform,
  Attachment,
  MockSubmission,
} from "./mock-submissions";
import { MOCK_SUBMISSIONS } from "./mock-submissions";

import {
  MOCK_APPLICATIONS,
  filterApplications,
  type MockApplication,
  type ApplicantFilters,
  type ApplicationStatus,
} from "./mock-applications";

import {
  MOCK_QR_CODES,
  type QRCodeRecord,
  type PosterType,
} from "@/lib/attribution/mock-qr-codes-extended";
import { MOCK_CAMPAIGNS } from "@/app/(merchant)/merchant/campaigns/mock";
import {
  MOCK_LOCATIONS,
  type Location as MerchantLocation,
} from "@/lib/merchant/mock-locations";

import {
  MOCK_PAYOUT_METHODS,
  MOCK_WITHDRAWALS,
  MOCK_TAX_SUMMARY,
  MOCK_WALLET_BALANCE,
  type PayoutMethod,
  type Withdrawal,
  type TaxSummary,
  type WalletBalance,
} from "@/lib/wallet/mock-wallet";

import {
  DEMO_CAMPAIGNS_WITH_GEO,
  type CampaignGeo,
} from "@/lib/data/demo-campaigns-geo";

export type ExploreFilters = {
  categories?: string[];
  tierMax?: string;
  budgetMin?: number;
  budgetMax?: number;
  distanceKm?: number;
  deadline?: "today" | "week" | "month" | "";
  sort?: "newest" | "highest-pay" | "ending-soon" | "most-spots";
  page?: number;
  limit?: number;
};

export type ExploreResult = {
  campaigns: CampaignGeo[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
};

const TIER_ORDER = [
  "seed",
  "explorer",
  "operator",
  "proven",
  "closer",
  "partner",
] as const;

const NYC_LAT = 40.7218;
const NYC_LNG = -74.001;

function haversineKm(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number,
): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

async function exploreFn(filters: ExploreFilters = {}): Promise<ExploreResult> {
  const {
    categories = [],
    tierMax = "",
    budgetMin = 0,
    budgetMax = 5000,
    distanceKm = 0,
    deadline = "",
    sort = "newest",
    page = 1,
    limit = 12,
  } = filters;

  const now = new Date();

  let results = DEMO_CAMPAIGNS_WITH_GEO.filter((c) => {
    if (categories.length > 0 && !categories.includes(c.category)) return false;
    if (tierMax) {
      const maxIdx = TIER_ORDER.indexOf(tierMax as (typeof TIER_ORDER)[number]);
      if (maxIdx >= 0 && TIER_ORDER.indexOf(c.tier_required) > maxIdx)
        return false;
    }
    if (c.payout < budgetMin || c.payout > budgetMax) return false;
    if (distanceKm > 0) {
      const km = haversineKm(NYC_LAT, NYC_LNG, c.lat, c.lng);
      if (km > distanceKm) return false;
    }
    if (deadline === "today") {
      if (!c.deadline) return false;
      const d = new Date(c.deadline);
      return (
        d.getFullYear() === now.getFullYear() &&
        d.getMonth() === now.getMonth() &&
        d.getDate() === now.getDate()
      );
    }
    if (deadline === "week") {
      if (!c.deadline) return false;
      const w = new Date(now);
      w.setDate(w.getDate() + 7);
      return new Date(c.deadline) <= w;
    }
    if (deadline === "month") {
      if (!c.deadline) return false;
      const m = new Date(now);
      m.setMonth(m.getMonth() + 1);
      return new Date(c.deadline) <= m;
    }
    return true;
  });

  switch (sort) {
    case "highest-pay":
      results = [...results].sort((a, b) => b.payout - a.payout);
      break;
    case "ending-soon":
      results = [...results].sort((a, b) => {
        const da = a.deadline ? new Date(a.deadline).getTime() : Infinity;
        const db = b.deadline ? new Date(b.deadline).getTime() : Infinity;
        return da - db;
      });
      break;
    case "most-spots":
      results = [...results].sort(
        (a, b) => b.spots_remaining - a.spots_remaining,
      );
      break;
  }

  const total = results.length;
  const offset = (page - 1) * limit;
  const paged = results.slice(offset, offset + limit);
  await new Promise((r) => setTimeout(r, 0));
  return {
    campaigns: paged,
    total,
    page,
    limit,
    hasMore: offset + limit < total,
  };
}

// Mock vs real API selection:
// - NEXT_PUBLIC_USE_MOCK=1 → always use localStorage mock (offline dev)
// - Otherwise → hit real /api/* routes (server or browser). apiFetch() uses
//   apiBaseUrl() to build absolute URLs in SSR context, and cache:'no-store'
//   to avoid Next 16's default fetch cache swallowing fresh data.
const USE_MOCK =
  typeof process !== "undefined" &&
  process.env.NEXT_PUBLIC_USE_MOCK === "1";

function apiBaseUrl(): string {
  if (typeof window !== "undefined") return "";
  if (process.env.NEXT_PUBLIC_APP_URL) return process.env.NEXT_PUBLIC_APP_URL;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  const port = process.env.PORT ?? "3931";
  return `http://localhost:${port}`;
}

async function apiFetch<T>(
  path: string,
  options?: RequestInit,
): Promise<ApiResult<T>> {
  try {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...((options?.headers as Record<string, string>) ?? {}),
    };

    // Server components call this helper too. Because we use an ABSOLUTE URL
    // via apiBaseUrl(), Next won't auto-forward the incoming request's
    // cookies — so any API route that calls requireTenantId()/auth.getUser()
    // would see no session and 500 in prod. Pull cookies from next/headers
    // and forward them explicitly. Dynamic import keeps this helper usable
    // from client components (where next/headers must not be bundled).
    if (typeof window === "undefined") {
      try {
        const { cookies } = await import("next/headers");
        const store = await cookies();
        const cookieHeader = store
          .getAll()
          .map((c) => `${c.name}=${c.value}`)
          .join("; ");
        if (cookieHeader && !headers.Cookie && !headers.cookie) {
          headers.Cookie = cookieHeader;
        }
      } catch {
        // Not inside a request scope (build-time, background worker, etc.).
        // No cookies to forward — fall through to anonymous request.
      }
    }

    const res = await fetch(`${apiBaseUrl()}/api${path}`, {
      // Next 16 caches fetch() by default; opt out so server components
      // always see fresh data from our own API (which already hits DB).
      cache: "no-store",
      ...options,
      headers,
    });
    const json = await res.json();
    if (!res.ok)
      return {
        ok: false,
        error: json?.error ?? "Request failed",
        status: res.status,
      };
    return { ok: true, data: json as T };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Network error",
    };
  }
}

function mockOk<T>(data: T): ApiResult<T> {
  return { ok: true, data };
}

function qs(params: Record<string, string | number | boolean | null | undefined>): string {
  const search = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null || value === "") {
      continue;
    }

    search.set(key, String(value));
  }

  const value = search.toString();
  return value ? `?${value}` : "";
}

export type SubmitContentPayload = {
  contentType: ContentType;
  platform: Platform;
  attachments: Attachment[];
  caption: string;
  publicUrl: string;
};

export type QRListParams = {
  campaign_id?: string;
  poster_type?: PosterType;
  status?: "active" | "disabled" | "all";
};

export type QRCreateInput = {
  campaign_id: string;
  campaign_name: string;
  poster_type: PosterType;
  hero_message: string;
  sub_message: string;
};

export type QRUpdateInput = {
  disabled?: boolean;
  regenerate?: boolean;
};

export type CampaignCreatePayload = Partial<
  Pick<
  Campaign,
  | "title"
  | "description"
  | "location"
  | "lat"
  | "lng"
  | "budget_total"
  | "reward_per_visit"
  | "max_creators"
  | "start_date"
  | "end_date"
  | "tags"
  | "applicable_location_ids"
  | "hero_offer"
  >
> & {
  image_url?: string;
  tenant_id?: string;
};

export type AttributionSummary = {
  scans: number;
  verified_customers: number;
  revenue_attributed: number;
  roi: number;
  fraud_flags: number;
  by_creator: Array<{
    creator_id: string;
    scans: number;
    verified: number;
    revenue: number;
    roi: number;
  }>;
  by_location: Array<{
    location_id: string;
    scans: number;
    verified: number;
    revenue: number;
  }>;
  by_day: Array<{
    date: string;
    scans: number;
    verified: number;
  }>;
};

export type InvoiceLineItem = {
  id: string;
  invoice_id: string;
  description: string;
  quantity: number;
  unit_amount_cents: number;
  total_amount_cents: number;
  metadata: Record<string, unknown> | null;
  created_at: string;
};

export type Invoice = {
  id: string;
  tenant_id: string;
  merchant_id: string;
  status: string;
  subtotal_cents: number;
  fees_cents: number;
  total_cents: number;
  issued_at: string;
  due_at: string | null;
  paid_at: string | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
  line_items?: InvoiceLineItem[];
};

export type PaymentMethod = {
  id: string;
  merchant_id: string;
  provider: string;
  provider_ref: string;
  brand: string;
  last4: string;
  exp_month: number | null;
  exp_year: number | null;
  is_default: boolean;
  created_at: string;
  updated_at: string;
};

export type WalletTransaction = {
  amount_cents: number;
  id?: string;
  wallet_id?: string;
  merchant_id?: string;
  tenant_id?: string;
  type?: string;
  balance_after_cents?: number | null;
  reference?: string | null;
  metadata?: Record<string, unknown> | null;
  created_at?: string;
  updated_at?: string;
  [key: string]: unknown;
};

export type Notification = {
  id: string;
  recipient_user_id: string;
  kind: string;
  title: string;
  body: string;
  link: string | null;
  read_at: string | null;
  created_at: string;
  updated_at: string;
};

function roundMetric(value: number): number {
  return Math.round(value);
}

function safeRoi(revenue: number, verified: number): number {
  const estimatedCost = Math.max(verified * 1200, 1);
  return Number((revenue / estimatedCost).toFixed(2));
}

function getCampaignLocationIds(campaignId: string): string[] {
  return (
    MOCK_CAMPAIGNS.find((campaign) => campaign.id === campaignId)
      ?.applicable_location_ids ?? []
  );
}

function buildAttributionSummary(
  params: {
    campaignId?: string;
    creatorId?: string;
    locationId?: string;
    from?: string;
    to?: string;
  } = {},
): AttributionSummary {
  const fromTime = params.from ? new Date(params.from).getTime() : null;
  const toTime = params.to ? new Date(params.to).getTime() : null;

  const records = MOCK_QR_CODES.filter((record) => {
    if (params.campaignId && record.campaign_id !== params.campaignId) {
      return false;
    }
    if (params.creatorId && record.creator_id !== params.creatorId) {
      return false;
    }

    const recordTime = new Date(record.last_active_at).getTime();
    if (fromTime !== null && recordTime < fromTime) return false;
    if (toTime !== null && recordTime > toTime) return false;

    const campaignLocationIds = getCampaignLocationIds(record.campaign_id);
    if (
      params.locationId &&
      !campaignLocationIds.includes(params.locationId)
    ) {
      return false;
    }

    return true;
  });

  const scans = records.reduce((sum, record) => sum + record.scan_count, 0);
  const verified_customers = records.reduce(
    (sum, record) => sum + record.verified_customers,
    0,
  );
  const revenue_attributed = records.reduce(
    (sum, record) => sum + record.attributed_revenue,
    0,
  );
  const fraud_flags = records.filter(
    (record) => record.disabled || record.scan_count - record.verified_customers > 10,
  ).length;

  const byCreatorMap = new Map<
    string,
    { scans: number; verified: number; revenue: number }
  >();

  for (const record of records) {
    const current = byCreatorMap.get(record.creator_id) ?? {
      scans: 0,
      verified: 0,
      revenue: 0,
    };
    current.scans += record.scan_count;
    current.verified += record.verified_customers;
    current.revenue += record.attributed_revenue;
    byCreatorMap.set(record.creator_id, current);
  }

  const byLocationMap = new Map<
    string,
    { scans: number; verified: number; revenue: number }
  >();

  for (const record of records) {
    const locationIds = getCampaignLocationIds(record.campaign_id);
    const scopedLocationIds = params.locationId
      ? locationIds.filter((locationId) => locationId === params.locationId)
      : locationIds;
    if (!scopedLocationIds.length) continue;

    const perLocationScans = record.scan_count / scopedLocationIds.length;
    const perLocationVerified =
      record.verified_customers / scopedLocationIds.length;
    const perLocationRevenue =
      record.attributed_revenue / scopedLocationIds.length;

    for (const locationId of scopedLocationIds) {
      const current = byLocationMap.get(locationId) ?? {
        scans: 0,
        verified: 0,
        revenue: 0,
      };
      current.scans += perLocationScans;
      current.verified += perLocationVerified;
      current.revenue += perLocationRevenue;
      byLocationMap.set(locationId, current);
    }
  }

  const baseDate = params.to
    ? new Date(params.to)
    : records.length
      ? new Date(
          Math.max(...records.map((record) => new Date(record.last_active_at).getTime())),
        )
      : new Date();

  const weights = [0.09, 0.11, 0.13, 0.15, 0.16, 0.17, 0.19];
  const by_day = weights.map((weight, index) => {
    const date = new Date(baseDate);
    date.setDate(baseDate.getDate() - (weights.length - index - 1));
    return {
      date: date.toISOString().slice(0, 10),
      scans: roundMetric(scans * weight),
      verified: roundMetric(verified_customers * weight),
    };
  });

  return {
    scans,
    verified_customers,
    revenue_attributed,
    roi: safeRoi(revenue_attributed, verified_customers),
    fraud_flags,
    by_creator: Array.from(byCreatorMap.entries()).map(([creator_id, value]) => ({
      creator_id,
      scans: value.scans,
      verified: value.verified,
      revenue: value.revenue,
      roi: safeRoi(value.revenue, value.verified),
    })),
    by_location: Array.from(byLocationMap.entries()).map(([location_id, value]) => ({
      location_id,
      scans: roundMetric(value.scans),
      verified: roundMetric(value.verified),
      revenue: roundMetric(value.revenue),
    })),
    by_day,
  };
}

// ── Creator endpoints ─────────────────────────────────────────────────────────

const creatorMock = {
  getCampaigns(): ApiResult<Campaign[]> {
    const campaigns = (DEMO_CAMPAIGNS as unknown as Campaign[]).slice(0, 10);
    return mockOk(campaigns);
  },

  apply(id: string): ApiResult<Application> {
    const existing = mockStore.read<Application[]>("creator-applications", []);
    const app: Application = {
      id: `app-${Date.now()}`,
      campaign_id: id,
      creator_id: DEMO_CREATOR.id,
      status: "pending",
      applied_at: new Date().toISOString(),
    };
    mockStore.write("creator-applications", [...existing, app]);
    return mockOk(app);
  },

  earnings(): ApiResult<Payment[]> {
    const payments = (DEMO_PAYOUTS as unknown as Payment[]) ?? [];
    return mockOk(payments);
  },

  async submitContent(
    campaignId: string,
    data: SubmitContentPayload,
  ): Promise<MockSubmission> {
    const res = await fetch(
      `/api/creator/campaigns/${campaignId}/submissions`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, creatorId: "demo-creator-001" }),
      },
    );
    if (!res.ok) throw new Error("Failed to submit content");
    const json = await res.json();
    return json.submission as MockSubmission;
  },

  async getSubmissions(campaignId: string): Promise<MockSubmission[]> {
    if (typeof window !== "undefined") {
      return MOCK_SUBMISSIONS.filter((s) => s.campaignId === campaignId);
    }
    const res = await fetch(`/api/creator/campaigns/${campaignId}/submissions`);
    if (!res.ok) return [];
    const json = await res.json();
    return json.submissions as MockSubmission[];
  },

  async resubmit(
    campaignId: string,
    submissionId: string,
    data: Partial<SubmitContentPayload>,
  ): Promise<MockSubmission> {
    const res = await fetch(
      `/api/creator/campaigns/${campaignId}/submissions/${submissionId}`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, status: "pending_review" }),
      },
    );
    if (!res.ok) throw new Error("Failed to resubmit");
    const json = await res.json();
    return json.updated as MockSubmission;
  },

  explore: exploreFn,

  wallet: {
    getBalance(): Promise<WalletBalance> {
      return Promise.resolve({ ...MOCK_WALLET_BALANCE });
    },
    getPayoutMethods(): Promise<PayoutMethod[]> {
      return Promise.resolve([...MOCK_PAYOUT_METHODS]);
    },
    addPayoutMethod(
      method: Omit<PayoutMethod, "id" | "addedAt">,
    ): Promise<PayoutMethod> {
      const created: PayoutMethod = {
        ...method,
        id: `pm-${Date.now()}`,
        addedAt: new Date().toISOString().split("T")[0],
      };
      return Promise.resolve(created);
    },
    updatePayoutMethod(
      id: string,
      patch: Partial<PayoutMethod>,
    ): Promise<PayoutMethod> {
      const method = MOCK_PAYOUT_METHODS.find((m) => m.id === id);
      if (!method) return Promise.reject(new Error("Method not found"));
      return Promise.resolve({ ...method, ...patch });
    },
    deletePayoutMethod(_id: string): Promise<{ deleted: boolean }> {
      return Promise.resolve({ deleted: true });
    },
    getWithdrawals(filters?: {
      status?: string;
      method?: string;
      year?: string;
    }): Promise<Withdrawal[]> {
      let results = [...MOCK_WITHDRAWALS];
      if (filters?.status)
        results = results.filter((w) => w.status === filters.status);
      if (filters?.method)
        results = results.filter((w) => w.methodType === filters.method);
      if (filters?.year)
        results = results.filter((w) => w.date.startsWith(filters.year!));
      return Promise.resolve(results);
    },
    initiateWithdrawal(amount: number, methodId: string): Promise<Withdrawal> {
      const method = MOCK_PAYOUT_METHODS.find((m) => m.id === methodId);
      const feeRate = method?.feeRate ?? 0;
      const flatFee =
        method?.type === "bank" ? 1.5 : method?.type === "paypal" ? 0.25 : 0;
      const fee = parseFloat((amount * feeRate + flatFee).toFixed(2));
      const withdrawal: Withdrawal = {
        id: `wd-${Date.now()}`,
        date: new Date().toISOString().split("T")[0],
        methodId,
        methodType: method?.type ?? "bank",
        methodDetail: method?.detail ?? "—",
        amount,
        fee,
        net: parseFloat((amount - fee).toFixed(2)),
        status: "processing",
      };
      return Promise.resolve(withdrawal);
    },
    getTaxSummary(): Promise<TaxSummary> {
      return Promise.resolve({ ...MOCK_TAX_SUMMARY });
    },
  },
};

const creatorReal = {
  getCampaigns: () => apiFetch<Campaign[]>("/creator/campaigns"),
  apply: (id: string) =>
    apiFetch<Application>(`/creator/campaigns/${id}/apply`, { method: "POST" }),
  earnings: () => apiFetch<Payment[]>("/creator/earnings"),
  submitContent: creatorMock.submitContent,
  getSubmissions: creatorMock.getSubmissions,
  resubmit: creatorMock.resubmit,
  wallet: creatorMock.wallet,
};

// ── Merchant endpoints ────────────────────────────────────────────────────────

let _applications = [...MOCK_APPLICATIONS];
let _qrStore: QRCodeRecord[] = [...MOCK_QR_CODES];

const merchantMock = {
  getCampaigns(): ApiResult<Campaign[]> {
    const stored = mockStore.read<Campaign[]>("merchant-campaigns", []);
    if (stored.length) return mockOk(stored);
    const campaigns = (DEMO_CAMPAIGNS as unknown as Campaign[]).slice(0, 5);
    return mockOk(campaigns);
  },

  createCampaign(data: CampaignCreatePayload): ApiResult<Campaign> {
    const existing = mockStore.read<Campaign[]>("merchant-campaigns", []);
    const campaign: Campaign = {
      id: `cmp-${Date.now()}`,
      merchant_id: "demo-merchant-001",
      tenant_id: data.tenant_id ?? "tenant-demo-001",
      title: data.title ?? "New Campaign",
      description: data.description ?? "",
      location: data.location ?? "New York, NY",
      lat: data.lat ?? 40.7128,
      lng: data.lng ?? -74.006,
      budget_total: data.budget_total ?? 500,
      budget_remaining: data.budget_total ?? 500,
      reward_per_visit: data.reward_per_visit ?? 25,
      max_creators: data.max_creators ?? 10,
      accepted_creators: 0,
      status: CampaignStatus.Draft,
      applicable_location_ids: data.applicable_location_ids ?? ["loc-bed-stuy"],
      hero_offer: data.hero_offer ?? {
        type: "percent_off",
        value: 20,
        max_redemptions_per_customer: 1,
        max_redemptions_total: null,
        description: "20% off first visit",
      },
      start_date: data.start_date ?? new Date().toISOString(),
      end_date:
        data.end_date ?? new Date(Date.now() + 30 * 86400_000).toISOString(),
      image_url: data.image_url,
      tags: data.tags ?? [],
      created_at: new Date().toISOString(),
    };
    mockStore.write("merchant-campaigns", [...existing, campaign]);
    return mockOk(campaign);
  },

  payments(): ApiResult<Payment[]> {
    return mockOk(mockStore.read<Payment[]>("merchant-payments", []));
  },

  async getLocations(): Promise<MerchantLocation[]> {
    return MOCK_LOCATIONS;
  },

  async getLocation(id: string): Promise<MerchantLocation | undefined> {
    return MOCK_LOCATIONS.find((location) => location.id === id);
  },

  getApplicants(filters: ApplicantFilters = {}): {
    data: MockApplication[];
    total: number;
  } {
    return filterApplications(_applications, filters);
  },

  decideApplication(
    id: string,
    decision: "accept" | "decline" | "shortlist",
  ): MockApplication | null {
    const statusMap: Record<typeof decision, ApplicationStatus> = {
      accept: "accepted",
      decline: "declined",
      shortlist: "shortlisted",
    };
    const idx = _applications.findIndex((a) => a.id === id);
    if (idx === -1) return null;
    _applications[idx] = { ..._applications[idx], status: statusMap[decision] };
    return _applications[idx];
  },

  batchDecide(
    ids: string[],
    decision: "accept" | "decline" | "shortlist",
  ): MockApplication[] {
    return ids
      .map((id) => this.decideApplication(id, decision))
      .filter((a): a is MockApplication => a !== null);
  },

  qrCodes: {
    list(params: QRListParams = {}): QRCodeRecord[] {
      let results = [..._qrStore];
      if (params.campaign_id)
        results = results.filter((q) => q.campaign_id === params.campaign_id);
      if (params.poster_type)
        results = results.filter((q) => q.poster_type === params.poster_type);
      if (params.status === "active")
        results = results.filter((q) => !q.disabled);
      else if (params.status === "disabled")
        results = results.filter((q) => q.disabled);
      return results;
    },
    create(input: QRCreateInput): QRCodeRecord {
      const newCode: QRCodeRecord = {
        id: `qr-${Date.now()}`,
        campaign_id: input.campaign_id,
        campaign_name: input.campaign_name,
        creator_id: "creator-unassigned",
        creator_name: "Unassigned Creator",
        creator_handle: "@unassigned",
        poster_type: input.poster_type,
        hero_message: input.hero_message,
        sub_message: input.sub_message,
        scan_url: `/scan/qr-${Date.now()}`,
        scan_count: 0,
        conversion_count: 0,
        verified_customers: 0,
        attributed_revenue: 0,
        created_at: new Date().toISOString(),
        last_active_at: new Date().toISOString(),
        disabled: false,
      };
      _qrStore = [newCode, ..._qrStore];
      return newCode;
    },
    get(id: string): QRCodeRecord | undefined {
      return _qrStore.find((q) => q.id === id);
    },
    update(id: string, input: QRUpdateInput): QRCodeRecord | null {
      const idx = _qrStore.findIndex((q) => q.id === id);
      if (idx === -1) return null;
      let updated = { ..._qrStore[idx] };
      if (input.disabled !== undefined) updated.disabled = input.disabled;
      if (input.regenerate) {
        updated = {
          ...updated,
          id: `qr-regen-${Date.now()}`,
          scan_count: 0,
          created_at: new Date().toISOString(),
          last_active_at: new Date().toISOString(),
        };
      }
      _qrStore = _qrStore.map((q) => (q.id === id ? updated : q));
      return updated;
    },
    delete(id: string): boolean {
      const before = _qrStore.length;
      _qrStore = _qrStore.filter((q) => q.id !== id);
      return _qrStore.length < before;
    },
  },
  billing: {
    async listInvoices(_params: { from?: string; to?: string } = {}): Promise<ApiResult<Invoice[]>> {
      return mockOk([]);
    },
    async getInvoice(id: string): Promise<ApiResult<Invoice>> {
      return mockOk({
        id,
        tenant_id: "",
        merchant_id: "",
        status: "pending",
        subtotal_cents: 0,
        fees_cents: 0,
        total_cents: 0,
        issued_at: new Date().toISOString(),
        due_at: null,
        paid_at: null,
        metadata: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        line_items: [],
      });
    },
    async addPaymentMethod(data: {
      brand: string;
      last_four: string;
      external_provider?: string;
      external_id?: string;
    }): Promise<ApiResult<PaymentMethod>> {
      return mockOk({
        id: `pm-${Date.now()}`,
        merchant_id: "demo-merchant-001",
        provider: data.external_provider ?? "manual",
        provider_ref: data.external_id ?? `manual:${Date.now()}`,
        brand: data.brand,
        last4: data.last_four,
        exp_month: null,
        exp_year: null,
        is_default: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });
    },
    async topup(amount_cents: number): Promise<ApiResult<WalletTransaction>> {
      return mockOk({
        id: `txn-${Date.now()}`,
        type: "topup",
        amount_cents,
        created_at: new Date().toISOString(),
      });
    },
  },
  notifications: {
    async list(): Promise<ApiResult<Notification[]>> {
      return mockOk([]);
    },
    async markRead(_id: string): Promise<ApiResult<{ read_at: string }>> {
      return mockOk({ read_at: new Date().toISOString() });
    },
  },
};

async function unwrap<T>(result: Promise<ApiResult<T>>): Promise<T> {
  const r = await result;
  if (!r.ok) throw new Error(r.error);
  return r.data;
}

const merchantReal = {
  getCampaigns: () => apiFetch<Campaign[]>("/merchant/campaigns"),
  createCampaign: (data: CampaignCreatePayload) =>
    apiFetch<Campaign>("/merchant/campaigns", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  payments: () => apiFetch<Payment[]>("/merchant/payments"),
  async getLocations(): Promise<MerchantLocation[]> {
    return unwrap(apiFetch<MerchantLocation[]>("/merchant/locations"));
  },
  async getLocation(id: string): Promise<MerchantLocation | undefined> {
    try {
      return await unwrap(apiFetch<MerchantLocation>(`/merchant/locations/${id}`));
    } catch {
      return undefined;
    }
  },

  async getApplicants(
    filters: ApplicantFilters = {},
  ): Promise<{ data: MockApplication[]; total: number }> {
    const qs = new URLSearchParams();
    if (filters.campaignId) qs.set("campaignId", filters.campaignId);
    if (filters.status?.length) qs.set("status", filters.status.join(","));
    if (filters.tiers?.length) qs.set("tiers", filters.tiers.join(","));
    if (filters.sort) qs.set("sort", filters.sort);
    if (filters.search) qs.set("search", filters.search);
    if (typeof filters.page === "number") qs.set("page", String(filters.page));
    if (typeof filters.limit === "number")
      qs.set("limit", String(filters.limit));
    const path = `/merchant/applicants${qs.toString() ? `?${qs}` : ""}`;
    return unwrap(
      apiFetch<{ data: MockApplication[]; total: number }>(path),
    );
  },

  async decideApplication(
    id: string,
    decision: "accept" | "decline" | "shortlist",
  ): Promise<MockApplication | null> {
    try {
      return await unwrap(
        apiFetch<MockApplication>(`/merchant/applicants/${id}`, {
          method: "PATCH",
          body: JSON.stringify({ decision }),
        }),
      );
    } catch {
      return null;
    }
  },

  async batchDecide(
    ids: string[],
    decision: "accept" | "decline" | "shortlist",
  ): Promise<MockApplication[]> {
    return unwrap(
      apiFetch<MockApplication[]>(`/merchant/applicants/batch-decision`, {
        method: "POST",
        body: JSON.stringify({ ids, decision }),
      }),
    );
  },

  qrCodes: {
    async list(params: QRListParams = {}): Promise<QRCodeRecord[]> {
      const qs = new URLSearchParams();
      if (params.campaign_id) qs.set("campaignId", params.campaign_id);
      if (params.poster_type) qs.set("posterType", params.poster_type);
      if (params.status) qs.set("status", params.status);
      const path = `/merchant/qr-codes${qs.toString() ? `?${qs}` : ""}`;
      return unwrap(apiFetch<QRCodeRecord[]>(path));
    },
    async create(input: QRCreateInput): Promise<QRCodeRecord> {
      return unwrap(
        apiFetch<QRCodeRecord>(`/merchant/qr-codes`, {
          method: "POST",
          body: JSON.stringify(input),
        }),
      );
    },
    async get(id: string): Promise<QRCodeRecord | undefined> {
      try {
        return await unwrap(
          apiFetch<QRCodeRecord>(`/merchant/qr-codes/${id}`),
        );
      } catch {
        return undefined;
      }
    },
    async update(
      id: string,
      input: QRUpdateInput,
    ): Promise<QRCodeRecord | null> {
      try {
        return await unwrap(
          apiFetch<QRCodeRecord>(`/merchant/qr-codes/${id}`, {
            method: "PATCH",
            body: JSON.stringify(input),
          }),
        );
      } catch {
        return null;
      }
    },
    async delete(id: string): Promise<boolean> {
      try {
        await unwrap(
          apiFetch<{ deleted: boolean }>(`/merchant/qr-codes/${id}`, {
            method: "DELETE",
          }),
        );
        return true;
      } catch {
        return false;
      }
    },
  },
  billing: {
    listInvoices: (params: { from?: string; to?: string } = {}) =>
      apiFetch<Invoice[]>(`/merchant/billing/invoices${qs(params)}`),
    getInvoice: (id: string) => apiFetch<Invoice>(`/merchant/billing/invoices/${id}`),
    addPaymentMethod: (data: {
      brand: string;
      last_four: string;
      external_provider?: string;
      external_id?: string;
    }) =>
      apiFetch<PaymentMethod>(`/merchant/billing/payment-methods`, {
        method: "POST",
        body: JSON.stringify(data),
      }),
    topup: (amount_cents: number) =>
      apiFetch<WalletTransaction>(`/merchant/billing/topup`, {
        method: "POST",
        body: JSON.stringify({ amount_cents }),
      }),
  },
  notifications: {
    list: () => apiFetch<Notification[]>(`/merchant/notifications`),
    markRead: (id: string) =>
      apiFetch<{ read_at: string }>(`/merchant/notifications/${id}/read`, {
        method: "PATCH",
      }),
  },
  redeem: {
    search: (q: string) =>
      apiFetch<
        Array<{
          claim_id: string;
          claim_code: string;
          creator: { handle: string; name: string };
          hero_offer: { type: string; value_numeric: number | null; value_text: string | null };
          campaign: { title: string };
          claimed_at: string;
          status: string;
          phone_last_4: string | null;
        }>
      >(`/merchant/redeem/search?q=${encodeURIComponent(q)}`),
    execute: (claim_id: string, location_id?: string) =>
      apiFetch<{
        ok: boolean;
        visit_id?: string;
        redemption_id?: string;
        offer_remaining?: number;
        error?: string;
        // Mystery Drop (v3): set by merchant_redeem_claim RPC when the
        // new redemption count matches a hero_offers.bonus_positions entry.
        position_number?: number;
        is_bonus_position?: boolean;
        bonus_reward_text?: string | null;
        bonus_reward_description?: string | null;
      }>(`/merchant/redeem`, {
        method: "POST",
        body: JSON.stringify({ claim_id, location_id }),
      }),
  },
};

// ── Attribution endpoints ─────────────────────────────────────────────────────

// v2 attribution: click = landing hit (record attribution), claim = opt-in
// offer reservation. v1 scan/verify/OCR pipeline is removed. Pages call
// /api/attribution/click and /api/attribution/claim directly via fetch;
// these helpers exist for completeness and for code not on /scan/[shortCode].

const attributionMock = {
  click(shortCode: string): ApiResult<{ click_id: string }> {
    const event = {
      click_id: `click-${Date.now()}`,
      short_code: shortCode,
    };
    const existing = mockStore.read<typeof event[]>(`clicks-${shortCode}`, []);
    mockStore.write(`clicks-${shortCode}`, [...existing, event]);
    return mockOk({ click_id: event.click_id });
  },
  claim(
    _shortCode: string,
    _clickId: string,
    _phone?: string,
  ): ApiResult<{ claim_id: string; claim_code: string }> {
    return mockOk({
      claim_id: `claim-${Date.now()}`,
      claim_code: Math.random().toString(36).slice(2, 8).toUpperCase(),
    });
  },
  getSummary(
    params: Parameters<typeof buildAttributionSummary>[0] = {},
  ): AttributionSummary {
    return buildAttributionSummary(params);
  },
};

const attributionReal = {
  click: (shortCode: string) =>
    apiFetch<{ click_id: string }>(`/attribution/click`, {
      method: "POST",
      body: JSON.stringify({ short_code: shortCode }),
    }),
  claim: (shortCode: string, clickId: string, phone?: string) =>
    apiFetch<{ claim_id: string; claim_code: string }>(`/attribution/claim`, {
      method: "POST",
      body: JSON.stringify({ short_code: shortCode, click_id: clickId, phone }),
    }),
  async getSummary(
    params: {
      campaignId?: string;
      creatorId?: string;
      locationId?: string;
      from?: string;
      to?: string;
    } = {},
  ): Promise<AttributionSummary> {
    const qs = new URLSearchParams();
    if (params.campaignId) qs.set("campaignId", params.campaignId);
    if (params.creatorId) qs.set("creatorId", params.creatorId);
    if (params.locationId) qs.set("locationId", params.locationId);
    if (params.from) qs.set("from", params.from);
    if (params.to) qs.set("to", params.to);
    const path = `/merchant/attribution/summary${qs.toString() ? `?${qs}` : ""}`;
    return unwrap(apiFetch<AttributionSummary>(path));
  },
};

export async function getAttributionSummary(params: {
  campaignId?: string;
  creatorId?: string;
  locationId?: string;
  from?: string;
  to?: string;
}): Promise<AttributionSummary> {
  if (USE_MOCK) return attributionMock.getSummary(params);
  return attributionReal.getSummary(params);
}

export async function createCampaign(
  payload: CampaignCreatePayload,
): Promise<Campaign> {
  if (USE_MOCK) {
    const result = merchantMock.createCampaign(payload);
    if (!result.ok) throw new Error(result.error);
    return result.data;
  }
  return unwrap(merchantReal.createCampaign(payload));
}

export async function getLocations(): Promise<MerchantLocation[]> {
  return USE_MOCK ? merchantMock.getLocations() : merchantReal.getLocations();
}

export async function getLocation(
  id: string,
): Promise<MerchantLocation | undefined> {
  return USE_MOCK ? merchantMock.getLocation(id) : merchantReal.getLocation(id);
}

// ── Public API surface ────────────────────────────────────────────────────────

export { creatorMock, merchantMock };

export const api = {
  creator: USE_MOCK ? creatorMock : creatorReal,
  merchant: USE_MOCK ? merchantMock : merchantReal,
  attribution: USE_MOCK ? attributionMock : attributionReal,
};

export type {
  Campaign,
  Creator,
  Merchant,
  Application,
  Payment,
  QRCode,
  ScanEvent,
  Milestone,
  ApiResult,
} from "./types";
