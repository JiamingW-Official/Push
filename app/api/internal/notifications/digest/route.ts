/**
 * POST /api/internal/notifications/digest
 *
 * Daily 8am ET. Sends a one-shot email summary of last-24h unread
 * notifications per active creator. Gated by INTERNAL_API_SECRET in the
 * middleware, so the cron job (Vercel cron / external scheduler) must
 * pass `x-internal-api-secret`.
 *
 * Body: optional `{ dryRun: true }` — counts what would send without
 * actually emailing. Useful for staging.
 *
 * Returns: { creatorsConsidered, digestsSent, totalsByKind }
 */

import { NextRequest } from "next/server";
import { supabase } from "@/lib/db";
import { listRecentUnread } from "@/lib/services/notifications";
import { success, serverError } from "@/lib/api/responses";

type Counts = Record<string, number>;

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json().catch(() => ({}))) as { dryRun?: boolean };
    const dryRun = body.dryRun === true;

    /* List creators who logged in or had activity in the last 30 days.
       Skip dormant accounts so we don't email people who churned. */
    const cutoff = new Date(
      Date.now() - 30 * 24 * 60 * 60 * 1000,
    ).toISOString();
    const { data: creators, error } = await supabase
      .from("creators")
      .select("id, user_id")
      .gte("last_active_at", cutoff);

    if (error) throw error;

    let digestsSent = 0;
    const totalsByKind: Counts = {};

    for (const c of creators ?? []) {
      const unread = await listRecentUnread(c.id);
      if (unread.length === 0) continue;

      for (const row of unread) {
        totalsByKind[row.kind] = (totalsByKind[row.kind] ?? 0) + 1;
      }

      if (dryRun) {
        digestsSent++;
        continue;
      }

      /* Email send: integrate with the existing /api/internal/email-send
         pipe. This is intentionally a fire-and-forget call — the cron
         doesn't fail if one email bounces. */
      try {
        await fetch(`${getBaseUrl(req)}/api/internal/email-send`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-internal-api-secret":
              req.headers.get("x-internal-api-secret") ?? "",
          },
          body: JSON.stringify({
            to: c.user_id,
            template: "creator-digest",
            payload: {
              creatorId: c.id,
              count: unread.length,
              items: unread.map((u) => ({
                kind: u.kind,
                title: u.title,
                body: u.body,
                href: u.href,
              })),
            },
          }),
        });
        digestsSent++;
      } catch (sendErr) {
        console.warn(`[digest] email send failed for creator ${c.id}`, sendErr);
      }
    }

    return success({
      creatorsConsidered: creators?.length ?? 0,
      digestsSent,
      totalsByKind,
      dryRun,
    });
  } catch (err) {
    return serverError("creator-digest", err);
  }
}

function getBaseUrl(req: NextRequest): string {
  const explicit = process.env.NEXT_PUBLIC_APP_URL;
  if (explicit) return explicit.replace(/\/$/, "");
  const proto = req.headers.get("x-forwarded-proto") ?? "https";
  const host = req.headers.get("x-forwarded-host") ?? req.headers.get("host");
  return `${proto}://${host}`;
}
