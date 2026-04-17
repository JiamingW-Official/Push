// Push Platform — API client
// Mock implementations for demo mode; replace fetch stubs with real calls.

import type {
  ContentType,
  Platform,
  Attachment,
  MockSubmission,
} from "./mock-submissions";
import { MOCK_SUBMISSIONS } from "./mock-submissions";

export type SubmitContentPayload = {
  contentType: ContentType;
  platform: Platform;
  attachments: Attachment[];
  caption: string;
  publicUrl: string;
};

// ---------------------------------------------------------------------------
// creatorMock — client-side mock functions that mirror the API surface
// ---------------------------------------------------------------------------

export const creatorMock = {
  /** Submit new content for a campaign */
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

  /** Fetch all submissions for a campaign */
  async getSubmissions(campaignId: string): Promise<MockSubmission[]> {
    // In demo mode return immediately from mock data to avoid SSR latency
    if (typeof window !== "undefined") {
      return MOCK_SUBMISSIONS.filter((s) => s.campaignId === campaignId);
    }
    const res = await fetch(`/api/creator/campaigns/${campaignId}/submissions`);
    if (!res.ok) return [];
    const json = await res.json();
    return json.submissions as MockSubmission[];
  },

  /** Resubmit a rejected submission */
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
