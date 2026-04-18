// Push Platform — API Client
//
// Usage:
//   NEXT_PUBLIC_USE_MOCK=1   → reads/writes localStorage mock store
//   (default)                → hits real API endpoints

import { mockStore } from "./mock-store";
import type {
  ApiResult,
  Application,
  Campaign,
  Creator,
  Merchant,
  Milestone,
  Payment,
  QRCode,
  ScanEvent,
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

const USE_MOCK =
  typeof process !== "undefined"
    ? process.env.NEXT_PUBLIC_USE_MOCK === "1"
    : false;

async function apiFetch<T>(
  path: string,
  options?: RequestInit,
): Promise<ApiResult<T>> {
  try {
    const res = await fetch(`/api${path}`, {
      headers: { "Content-Type": "application/json" },
      ...options,
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

  createCampaign(data: Partial<Campaign>): ApiResult<Campaign> {
    const existing = mockStore.read<Campaign[]>("merchant-campaigns", []);
    const campaign: Campaign = {
      id: `cmp-${Date.now()}`,
      merchant_id: "demo-merchant-001",
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
      status: "draft",
      start_date: data.start_date ?? new Date().toISOString(),
      end_date:
        data.end_date ?? new Date(Date.now() + 30 * 86400_000).toISOString(),
      tags: data.tags ?? [],
      created_at: new Date().toISOString(),
    };
    mockStore.write("merchant-campaigns", [...existing, campaign]);
    return mockOk(campaign);
  },

  payments(): ApiResult<Payment[]> {
    return mockOk(mockStore.read<Payment[]>("merchant-payments", []));
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
        poster_type: input.poster_type,
        hero_message: input.hero_message,
        sub_message: input.sub_message,
        scan_url: `/scan/qr-${Date.now()}`,
        scan_count: 0,
        conversion_count: 0,
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
};

const merchantReal = {
  getCampaigns: () => apiFetch<Campaign[]>("/merchant/campaigns"),
  createCampaign: (data: Partial<Campaign>) =>
    apiFetch<Campaign>("/merchant/campaigns", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  payments: () => apiFetch<Payment[]>("/merchant/payments"),
  getApplicants: merchantMock.getApplicants,
  decideApplication: merchantMock.decideApplication,
  batchDecide: merchantMock.batchDecide,
  qrCodes: merchantMock.qrCodes,
};

// ── Attribution endpoints ─────────────────────────────────────────────────────

const attributionMock = {
  scan(qrId: string): ApiResult<ScanEvent> {
    const event: ScanEvent = {
      id: `scan-${Date.now()}`,
      qr_id: qrId,
      scanned_at: new Date().toISOString(),
      verified: false,
    };
    const existing = mockStore.read<ScanEvent[]>(`scans-${qrId}`, []);
    mockStore.write(`scans-${qrId}`, [...existing, event]);
    return mockOk(event);
  },

  verify(qrId: string, evidence: string): ApiResult<ScanEvent> {
    const existing = mockStore.read<ScanEvent[]>(`scans-${qrId}`, []);
    const last = existing[existing.length - 1];
    if (!last) return { ok: false, error: "No scan found for this QR code" };
    const updated: ScanEvent = {
      ...last,
      verified: true,
      evidence_url: evidence,
    };
    mockStore.write(`scans-${qrId}`, [...existing.slice(0, -1), updated]);
    return mockOk(updated);
  },
};

const attributionReal = {
  scan: (qrId: string) =>
    apiFetch<ScanEvent>(`/attribution/scan/${qrId}`, { method: "POST" }),
  verify: (qrId: string, evidence: string) =>
    apiFetch<ScanEvent>(`/attribution/verify`, {
      method: "POST",
      body: JSON.stringify({ qrId, evidence }),
    }),
};

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
