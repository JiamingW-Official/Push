"use client";

import { useEffect, useState } from "react";
import { useSWRConfig } from "swr";
import { invitesKey, todayKey } from "@/lib/data/keys";
import { subscribeInvites } from "@/lib/realtime/channels";

/**
 * Subscribes to invite-arrival realtime events for the current creator.
 * On each new invite:
 *   - Revalidates the SWR caches that show invites (todayKey + invitesKey
 *     variants) so the new row paints without a manual refresh
 *   - Bumps `pendingPulse` for 2s so the topnav avatar dot can flash
 *
 * Returns:
 *   - lastInviteAt   — ISO of most recent invite arrival (or null)
 *   - pendingPulse   — boolean that auto-clears 2s after each event
 *
 * Used by the topnav avatar "new invite" indicator and (future) push
 * notification badge.
 */
export function useInvitesLive(creatorId?: string) {
  const { mutate } = useSWRConfig();
  const [lastInviteAt, setLastInviteAt] = useState<string | null>(null);
  const [pendingPulse, setPendingPulse] = useState(false);

  useEffect(() => {
    if (!creatorId) return;

    const unsub = subscribeInvites(creatorId, (row) => {
      setLastInviteAt(row.created_at);
      setPendingPulse(true);
      // Clear pulse after 2s to allow the CSS transition to settle.
      setTimeout(() => setPendingPulse(false), 2000);

      // Revalidate caches that include invites. Match all variant URLs.
      mutate(
        (key) =>
          typeof key === "string" &&
          (key === todayKey() ||
            key === invitesKey() ||
            key.startsWith("/api/creator/invites?")),
        undefined,
        { revalidate: true },
      );
    });

    return unsub;
  }, [creatorId, mutate]);

  return { lastInviteAt, pendingPulse };
}
