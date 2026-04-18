// Push Platform — API Client
//
// Usage:
//   NEXT_PUBLIC_USE_MOCK=1   → reads/writes localStorage mock store
//   (default)                → hits real API endpoints
//
// To switch to Supabase later, update the `real.*` implementations below.
// Callers never need to change.

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

const USE_MOCK =
  typeof process !== "undefined"
    ? process.env.NEXT_PUBLIC_USE_MOCK === "1"
    : false;

// ── Internal fetch wrapper ────────────────────────────────────────────────────

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

// ── Mock helpers ──────────────────────────────────────────────────────────────

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
};

const creatorReal = {
  getCampaigns: () => apiFetch<Campaign[]>("/creator/campaigns"),
  apply: (id: string) =>
    apiFetch<Application>(`/creator/campaigns/${id}/apply`, { method: "POST" }),
  earnings: () => apiFetch<Payment[]>("/creator/earnings"),
  submitContent: creatorMock.submitContent,
  getSubmissions: creatorMock.getSubmissions,
  resubmit: creatorMock.resubmit,
};

// ── Merchant endpoints ────────────────────────────────────────────────────────

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
};

const merchantReal = {
  getCampaigns: () => apiFetch<Campaign[]>("/merchant/campaigns"),
  createCampaign: (data: Partial<Campaign>) =>
    apiFetch<Campaign>("/merchant/campaigns", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  payments: () => apiFetch<Payment[]>("/merchant/payments"),
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

export { creatorMock };

export const api = {
  creator: USE_MOCK ? creatorMock : creatorReal,
  merchant: USE_MOCK ? merchantMock : merchantReal,
  attribution: USE_MOCK ? attributionMock : attributionReal,
};

// Re-export types for convenience
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
