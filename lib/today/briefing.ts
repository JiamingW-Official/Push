// lib/today/briefing.ts
import type {
  Thread,
  Invite,
  SystemNotif,
  AttributionEvent,
} from "@/lib/inbox/seed";

export type HeroTemplateId =
  | "T1_URGENT_INVITE"
  | "T2_LATE_REPLY"
  | "T3_CAMPAIGN_CAP"
  | "T4_WEEKLY_BONUS"
  | "T5_POSITIVE_MOMENTUM"
  | "T6_QUIET_DAY";

export type HeroLine = {
  templateId: HeroTemplateId;
  text: string;
  ctaHref?: string;
  ctaLabel?: string;
};

export type ActionItem = {
  id: string;
  type: "reply" | "decide" | "evidence" | "post";
  title: string;
  meta: string;
  href: string;
  urgency: number;
  deadlineISO?: string;
};

export type YesterdayStats = {
  posts: number;
  scansVerified: number;
  earningsCents: number;
  newInvites: number;
};

export type BriefingInput = {
  now: number;
  threads: Thread[];
  invites: Invite[];
  notifications: SystemNotif[];
  attributionEvents: AttributionEvent[];
  dismissedActionIds: string[];
  snoozedActionIds: Record<string, number>;
  weeklyBonusThreshold?: number;
  weeklyScansSoFar?: number;
  creatorFirstName?: string;
};

const HOUR = 3_600_000;

// ── Hero line ────────────────────────────────────────────────────

export function selectHeroLine(input: BriefingInput): HeroLine {
  // T1: urgent high-match invite expiring within 6h
  const urgentInvite = input.invites
    .filter((i) => i.status === "pending")
    .filter((i) => i.expiresAt - input.now < 6 * HOUR)
    .filter((i) => i.expiresAt - input.now > 0)
    .filter((i) => i.matchScore >= 90)
    .sort((a, b) => b.matchScore - a.matchScore)[0];
  if (urgentInvite) {
    const hours = Math.max(
      1,
      Math.round((urgentInvite.expiresAt - input.now) / HOUR),
    );
    return {
      templateId: "T1_URGENT_INVITE",
      text: `${urgentInvite.brand} expires in ${hours}h. Watch% ${urgentInvite.matchScore} — worth 5 minutes.`,
      ctaHref: `/creator/gigs/invites?focus=${urgentInvite.id}`,
      ctaLabel: "Open invite",
    };
  }

  // T2: late merchant reply (> 12h waiting)
  const lateThread = input.threads
    .filter((t) => t.unread)
    .map((t) => {
      const lastMerchantMsg = [...t.messages]
        .reverse()
        .find((m) => m.from === "other");
      if (!lastMerchantMsg) return null;
      const ageMs = input.now - new Date(lastMerchantMsg.at).getTime();
      return { thread: t, ageMs };
    })
    .filter(
      (x): x is { thread: Thread; ageMs: number } => !!x && x.ageMs > 12 * HOUR,
    )
    .sort((a, b) => b.ageMs - a.ageMs)[0];
  if (lateThread) {
    const hours = Math.round(lateThread.ageMs / HOUR);
    return {
      templateId: "T2_LATE_REPLY",
      text: `${lateThread.thread.sender} has been waiting ${hours}h. A two-line reply now keeps the thread alive.`,
      ctaHref: `/creator/inbox/messages?thread=${lateThread.thread.id}`,
      ctaLabel: "Reply",
    };
  }

  // T3: campaign at risk of capping (deadline ≤ 24h, progress < 70%)
  const cappingEntry = input.threads
    .filter((t) => t.attribution && t.campaign)
    .map((t) => ({
      attr: t.attribution!,
      campaignLabel: t.campaign ?? "your campaign",
    }))
    .filter(({ attr }) => {
      const dlMs = new Date(attr.deadlineISO).getTime() - input.now;
      const progress = attr.scansVerified / Math.max(1, attr.scansTarget);
      return dlMs > 0 && dlMs < 24 * HOUR && progress < 0.7;
    })
    .sort(
      (a, b) =>
        new Date(a.attr.deadlineISO).getTime() -
        new Date(b.attr.deadlineISO).getTime(),
    )[0];
  if (cappingEntry) {
    const { attr, campaignLabel } = cappingEntry;
    const hours = Math.max(
      1,
      Math.round((new Date(attr.deadlineISO).getTime() - input.now) / HOUR),
    );
    return {
      templateId: "T3_CAMPAIGN_CAP",
      text: `${attr.scansVerified}/${attr.scansTarget} scans on ${campaignLabel}. Repost in the next ${hours}h.`,
      ctaHref: `/creator/gigs/active`,
      ctaLabel: "Open campaign",
    };
  }

  // T4: close to weekly bonus
  const threshold = input.weeklyBonusThreshold ?? 50;
  const soFar = input.weeklyScansSoFar ?? 0;
  const gap = threshold - soFar;
  if (gap > 0 && gap <= 10 && soFar > 0) {
    return {
      templateId: "T4_WEEKLY_BONUS",
      text: `You're ${gap} verified scans from your weekly bonus. One more post tonight likely closes it.`,
      ctaHref: `/creator/gigs/active`,
      ctaLabel: "See active",
    };
  }

  // T5: positive momentum from yesterday
  const yesterday = aggregateYesterday(input);
  if (yesterday.scansVerified >= 10 && yesterday.earningsCents >= 5000) {
    return {
      templateId: "T5_POSITIVE_MOMENTUM",
      text: `Yesterday landed: ${yesterday.scansVerified} verified scans, $${(yesterday.earningsCents / 100).toFixed(0)}. Same energy today.`,
    };
  }

  // T6: quiet day fallback
  const activeCount = input.threads.filter(
    (t) => t.campaign && t.attribution,
  ).length;
  return {
    templateId: "T6_QUIET_DAY",
    text:
      activeCount > 0
        ? `Quiet morning. ${activeCount} campaign${activeCount === 1 ? "" : "s"} ticking along — you can take the day.`
        : `Quiet morning. No active campaigns, no urgent invites. Catch up on rest.`,
  };
}

// ── Action queue ─────────────────────────────────────────────────

function deadlineScore(hoursUntil: number): number {
  if (hoursUntil <= 0) return 1;
  return Math.max(0, 1 - hoursUntil / 24);
}

function payoutWeight(payoutCents: number): number {
  const dollars = Math.max(1, payoutCents / 100);
  return 1 + Math.log10(dollars / 10 + 1);
}

export function buildActionQueue(input: BriefingInput): ActionItem[] {
  const items: ActionItem[] = [];

  // Reply actions: unread threads with merchant last msg > 12h
  for (const t of input.threads) {
    if (!t.unread) continue;
    const lastMerchantMsg = [...t.messages]
      .reverse()
      .find((m) => m.from === "other");
    if (!lastMerchantMsg) continue;
    const ageMs = input.now - new Date(lastMerchantMsg.at).getTime();
    if (ageMs < 12 * HOUR) continue;
    const payoutAtStake = t.attribution ? t.attribution.maxPayout * 100 : 5000;
    const urgency =
      deadlineScore(24 - ageMs / HOUR) * payoutWeight(payoutAtStake) * 1.5;
    items.push({
      id: `reply:${t.id}`,
      type: "reply",
      title: `Reply to ${t.sender}`,
      meta: `${Math.round(ageMs / HOUR)}h overdue${t.attribution ? ` · $${t.attribution.maxPayout} at stake` : ""}`,
      href: `/creator/inbox/messages?thread=${t.id}`,
      urgency,
    });
  }

  // Decide actions: pending invites expiring within 24h
  for (const i of input.invites) {
    if (i.status !== "pending") continue;
    const hoursUntil = (i.expiresAt - input.now) / HOUR;
    if (hoursUntil > 24 || hoursUntil <= 0) continue;
    const payoutAtStake = i.payoutTiers.length
      ? i.payoutTiers[i.payoutTiers.length - 1].amount * 100
      : 5000;
    const urgency =
      deadlineScore(hoursUntil) *
      payoutWeight(payoutAtStake) *
      1.5 *
      (i.matchScore >= 90 ? 1.2 : 1.0);
    items.push({
      id: `decide:${i.id}`,
      type: "decide",
      title: `Decide on ${i.brand}`,
      meta: `expires in ${Math.max(1, Math.round(hoursUntil))}h · Watch% ${i.matchScore}`,
      href: `/creator/gigs/invites?focus=${i.id}`,
      urgency,
      deadlineISO: new Date(i.expiresAt).toISOString(),
    });
  }

  // Filter dismissed and snoozed
  const filtered = items.filter((it) => {
    if (input.dismissedActionIds.includes(it.id)) return false;
    const snoozedUntil = input.snoozedActionIds[it.id];
    if (snoozedUntil && snoozedUntil > input.now) return false;
    return true;
  });

  return filtered.sort((a, b) => b.urgency - a.urgency).slice(0, 5);
}

// ── Yesterday recap ──────────────────────────────────────────────

export function aggregateYesterday(input: BriefingInput): YesterdayStats {
  const startOfYesterday = startOfDayMs(input.now - 24 * 60 * 60 * 1000);
  const endOfYesterday = startOfYesterday + 24 * 60 * 60 * 1000;

  const verifiedYesterday = input.attributionEvents.filter((e) => {
    const t = new Date(e.occurredAt).getTime();
    return (
      e.status === "verified" && t >= startOfYesterday && t < endOfYesterday
    );
  });

  const earningsCents = verifiedYesterday.reduce(
    (sum, e) => sum + e.payoutCents,
    0,
  );

  const newInvites = input.invites.filter((i) => {
    const receivedMs = i.receivedAt
      ? new Date(i.receivedAt).getTime()
      : i.expiresAt - 7 * 24 * 60 * 60 * 1000;
    return receivedMs >= startOfYesterday && receivedMs < endOfYesterday;
  }).length;

  const posts = new Set(verifiedYesterday.map((e) => e.campaignId)).size;

  return {
    posts,
    scansVerified: verifiedYesterday.length,
    earningsCents,
    newInvites,
  };
}

function startOfDayMs(ms: number): number {
  const d = new Date(ms);
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}

// ── Greeting ─────────────────────────────────────────────────────

export function greetingFor(now: number, firstName?: string): string {
  const hour = new Date(now).getHours();
  const name = firstName?.trim() || "there";
  if (hour < 5) return `Late night, ${name}.`;
  if (hour < 12) return `Good morning, ${name}.`;
  if (hour < 17) return `Afternoon, ${name}.`;
  if (hour < 21) return `Evening, ${name}.`;
  return `Late night, ${name}.`;
}

export function dateLineFor(now: number): string {
  return new Date(now).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}
