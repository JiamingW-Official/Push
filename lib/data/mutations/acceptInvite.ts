import { postJson } from "./types";

export type AcceptInviteResult = {
  inviteId: string;
  status: "accepted";
  acceptedAt: string;
};

/**
 * Server-side accept. Triggers the existing /api/creator/campaigns/[id]/apply
 * route which (1) creates a campaign_application row, (2) decrements
 * spots_remaining atomically, (3) hydrates accept-step state.
 *
 * The route returns the canonical record — withOptimistic will diff that
 * against its optimistic projection on the next revalidation.
 */
export function acceptInvite(inviteId: string) {
  return postJson<AcceptInviteResult>(
    `/api/creator/campaigns/${inviteId}/apply`,
    {},
  );
}
