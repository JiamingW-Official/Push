import { postJson } from "./types";

export type DeclineInviteResult = {
  inviteId: string;
  status: "declined";
  declinedAt: string;
};

/**
 * Server-side decline. Hits /api/creator/campaigns/[id]/decline (route
 * exists on main as part of #27's bundled backend work). Includes a
 * 5-second undo window — the client should optimistically remove the
 * invite, surface a toast with Undo, and only fire this mutation when
 * the toast dismisses.
 */
export function declineInvite(inviteId: string, reason?: string) {
  return postJson<DeclineInviteResult>(
    `/api/creator/campaigns/${inviteId}/decline`,
    { reason },
  );
}
