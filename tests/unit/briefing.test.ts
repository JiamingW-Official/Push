/** @jest-environment node */

import {
  selectHeroLine,
  buildActionQueue,
  aggregateYesterday,
  greetingFor,
  type BriefingInput,
  type ActionItem,
} from "@/lib/today/briefing";
import type {
  Invite,
  Thread,
  SystemNotif,
  AttributionEvent,
} from "@/lib/inbox/seed";

// ── Helpers ──────────────────────────────────────────────────────

const HOUR = 3_600_000;
const DAY = 24 * HOUR;

const BASE_NOW = new Date("2026-05-05T10:00:00.000Z").getTime();

function makeInvite(overrides: Partial<Invite> & { id: string }): Invite {
  return {
    brand: "Test Brand",
    brandInitial: "T",
    campaign: "Test Campaign",
    matchScore: 80,
    matchReasons: [],
    payoutTiers: [
      { amount: 30, label: "Guaranteed", trigger: "On accept" },
      { amount: 50, label: "Target", trigger: "5 scans" },
      { amount: 70, label: "Stretch", trigger: "10 scans" },
    ],
    expiresAt: BASE_NOW + 48 * HOUR,
    status: "pending",
    category: "Food & Beverage",
    brief: "Test brief",
    briefHref: "/brief",
    qrPickupAddr: "Test address",
    shootWindow: "This week",
    ...overrides,
  };
}

function makeThread(overrides: Partial<Thread> & { id: string }): Thread {
  return {
    sender: "Test Brand",
    initial: "T",
    preview: "Latest message",
    campaign: null,
    createdAt: new Date(BASE_NOW - HOUR).toISOString(),
    unread: false,
    online: false,
    role: "merchant",
    group: "brand",
    messages: [],
    attribution: null,
    starred: false,
    ...overrides,
  } as unknown as Thread;
}

function makeAttribEvent(
  overrides: Partial<AttributionEvent> & { id: string },
): AttributionEvent {
  return {
    campaignId: "test-campaign",
    campaignLabel: "Test Campaign",
    status: "verified",
    payoutCents: 300,
    occurredAt: new Date(BASE_NOW - HOUR).toISOString(),
    ...overrides,
  };
}

function baseInput(overrides: Partial<BriefingInput> = {}): BriefingInput {
  return {
    now: BASE_NOW,
    threads: [],
    invites: [],
    notifications: [] as SystemNotif[],
    attributionEvents: [],
    dismissedActionIds: [],
    snoozedActionIds: {},
    ...overrides,
  };
}

// ── Tests: selectHeroLine ────────────────────────────────────────

describe("selectHeroLine", () => {
  it("T1 triggers when an urgent high-match invite exists (< 6h, score >= 90)", () => {
    const invite = makeInvite({
      id: "inv-1",
      matchScore: 95,
      expiresAt: BASE_NOW + 3 * HOUR,
    });
    const result = selectHeroLine(baseInput({ invites: [invite] }));
    expect(result.templateId).toBe("T1_URGENT_INVITE");
    expect(result.text).toContain("Test Brand");
    expect(result.ctaHref).toContain("inv-1");
  });

  it("T1 picks the invite with the highest matchScore when multiple qualify", () => {
    const low = makeInvite({
      id: "inv-low",
      matchScore: 90,
      expiresAt: BASE_NOW + 2 * HOUR,
    });
    const high = makeInvite({
      id: "inv-high",
      matchScore: 98,
      expiresAt: BASE_NOW + 4 * HOUR,
    });
    const result = selectHeroLine(baseInput({ invites: [low, high] }));
    expect(result.templateId).toBe("T1_URGENT_INVITE");
    expect(result.ctaHref).toContain("inv-high");
  });

  it("T1 does NOT trigger when no invite meets the threshold (score < 90 or > 6h)", () => {
    const tooFar = makeInvite({
      id: "inv-far",
      matchScore: 95,
      expiresAt: BASE_NOW + 10 * HOUR,
    });
    const lowScore = makeInvite({
      id: "inv-low",
      matchScore: 85,
      expiresAt: BASE_NOW + 2 * HOUR,
    });
    const result = selectHeroLine(baseInput({ invites: [tooFar, lowScore] }));
    expect(result.templateId).not.toBe("T1_URGENT_INVITE");
  });

  it("T2 triggers when a merchant message has been waiting > 12h", () => {
    const thread = makeThread({
      id: "thr-1",
      sender: "Bayou Coffee",
      unread: true,
      messages: [
        {
          id: "m1",
          from: "other",
          text: "Hey, can you confirm?",
          at: new Date(BASE_NOW - 14 * HOUR).toISOString(),
        } as never,
      ],
    });
    const result = selectHeroLine(baseInput({ threads: [thread] }));
    expect(result.templateId).toBe("T2_LATE_REPLY");
    expect(result.text).toContain("Bayou Coffee");
  });

  it("T2 picks the oldest waiting thread first", () => {
    const older = makeThread({
      id: "thr-old",
      sender: "Old Brand",
      unread: true,
      messages: [
        {
          id: "m1",
          from: "other",
          text: "Wait...",
          at: new Date(BASE_NOW - 20 * HOUR).toISOString(),
        } as never,
      ],
    });
    const newer = makeThread({
      id: "thr-new",
      sender: "New Brand",
      unread: true,
      messages: [
        {
          id: "m2",
          from: "other",
          text: "Also waiting",
          at: new Date(BASE_NOW - 13 * HOUR).toISOString(),
        } as never,
      ],
    });
    const result = selectHeroLine(baseInput({ threads: [newer, older] }));
    expect(result.templateId).toBe("T2_LATE_REPLY");
    expect(result.text).toContain("Old Brand");
  });

  it("T2 does NOT trigger when merchant replies are fresh (< 12h)", () => {
    const freshThread = makeThread({
      id: "thr-fresh",
      sender: "Fresh Brand",
      unread: true,
      messages: [
        {
          id: "m1",
          from: "other",
          text: "Hi!",
          at: new Date(BASE_NOW - 2 * HOUR).toISOString(),
        } as never,
      ],
    });
    const result = selectHeroLine(baseInput({ threads: [freshThread] }));
    expect(result.templateId).not.toBe("T2_LATE_REPLY");
  });

  it("T3 triggers when a campaign is near cap (< 70% progress, deadline < 24h)", () => {
    const thread = makeThread({
      id: "thr-cap",
      campaign: "Summer Push",
      attribution: {
        scansVerified: 4,
        scansTarget: 10,
        estPayout: 40,
        maxPayout: 65,
        deadlineISO: new Date(BASE_NOW + 6 * HOUR).toISOString(),
      } as never,
    });
    const result = selectHeroLine(baseInput({ threads: [thread] }));
    expect(result.templateId).toBe("T3_CAMPAIGN_CAP");
    expect(result.text).toContain("4/10");
  });

  it("T4 triggers when within 10 scans of the weekly bonus", () => {
    const result = selectHeroLine(
      baseInput({ weeklyBonusThreshold: 50, weeklyScansSoFar: 44 }),
    );
    expect(result.templateId).toBe("T4_WEEKLY_BONUS");
    expect(result.text).toContain("6 verified scans");
  });

  it("T5 triggers when yesterday had >= 10 scans and >= $50 earnings", () => {
    // Place events in yesterday's window
    const yesterday = BASE_NOW - 18 * HOUR; // 18h ago = yesterday
    const events: AttributionEvent[] = Array.from({ length: 12 }, (_, i) =>
      makeAttribEvent({
        id: `evt-${i}`,
        status: "verified",
        payoutCents: 500, // 12 * 500 = 6000 cents = $60
        occurredAt: new Date(yesterday).toISOString(),
      }),
    );
    const result = selectHeroLine(baseInput({ attributionEvents: events }));
    expect(result.templateId).toBe("T5_POSITIVE_MOMENTUM");
  });

  it("T6 fallback when nothing else matches", () => {
    const result = selectHeroLine(baseInput());
    expect(result.templateId).toBe("T6_QUIET_DAY");
  });
});

// ── Tests: buildActionQueue ──────────────────────────────────────

describe("buildActionQueue", () => {
  it("filters dismissed items from the queue", () => {
    const invite = makeInvite({
      id: "inv-urgent",
      matchScore: 95,
      expiresAt: BASE_NOW + 2 * HOUR,
    });
    const input = baseInput({
      invites: [invite],
      dismissedActionIds: ["decide:inv-urgent"],
    });
    const queue = buildActionQueue(input);
    expect(
      queue.find((a: ActionItem) => a.id === "decide:inv-urgent"),
    ).toBeUndefined();
  });

  it("filters snoozed items when snoozedUntil > now", () => {
    const invite = makeInvite({
      id: "inv-snoozed",
      matchScore: 95,
      expiresAt: BASE_NOW + 2 * HOUR,
    });
    const input = baseInput({
      invites: [invite],
      snoozedActionIds: { "decide:inv-snoozed": BASE_NOW + HOUR }, // snoozed for 1h
    });
    const queue = buildActionQueue(input);
    expect(
      queue.find((a: ActionItem) => a.id === "decide:inv-snoozed"),
    ).toBeUndefined();
  });

  it("keeps expired snoozed items (snoozedUntil <= now)", () => {
    const invite = makeInvite({
      id: "inv-expired-snooze",
      matchScore: 95,
      expiresAt: BASE_NOW + 2 * HOUR,
    });
    const input = baseInput({
      invites: [invite],
      snoozedActionIds: { "decide:inv-expired-snooze": BASE_NOW - HOUR }, // snooze expired 1h ago
    });
    const queue = buildActionQueue(input);
    expect(
      queue.find((a: ActionItem) => a.id === "decide:inv-expired-snooze"),
    ).toBeDefined();
  });

  it("caps the queue at 5 items", () => {
    // Create 8 invites all expiring within 24h
    const invites = Array.from({ length: 8 }, (_, i) =>
      makeInvite({
        id: `inv-${i}`,
        matchScore: 90 + i,
        expiresAt: BASE_NOW + (i + 1) * HOUR,
      }),
    );
    const queue = buildActionQueue(baseInput({ invites }));
    expect(queue.length).toBeLessThanOrEqual(5);
  });
});

// ── Tests: aggregateYesterday ────────────────────────────────────

describe("aggregateYesterday", () => {
  it("sums earnings correctly from verified events in yesterday's window", () => {
    const yesterday = BASE_NOW - 18 * HOUR;
    const events: AttributionEvent[] = [
      makeAttribEvent({
        id: "e1",
        status: "verified",
        payoutCents: 300,
        occurredAt: new Date(yesterday).toISOString(),
      }),
      makeAttribEvent({
        id: "e2",
        status: "verified",
        payoutCents: 250,
        occurredAt: new Date(yesterday).toISOString(),
      }),
      makeAttribEvent({
        id: "e3",
        status: "pending",
        payoutCents: 0,
        occurredAt: new Date(yesterday).toISOString(),
      }),
      // Today's event — should NOT count
      makeAttribEvent({
        id: "e4",
        status: "verified",
        payoutCents: 400,
        occurredAt: new Date(BASE_NOW - 30 * 60 * 1000).toISOString(),
      }),
    ];
    const stats = aggregateYesterday(baseInput({ attributionEvents: events }));
    expect(stats.earningsCents).toBe(550);
    expect(stats.scansVerified).toBe(2);
  });
});

// ── Tests: greetingFor ───────────────────────────────────────────

describe("greetingFor", () => {
  const makeTime = (hour: number) =>
    new Date(`2026-05-05T${String(hour).padStart(2, "0")}:00:00`).getTime();

  it("returns 'Late night' before 5am", () => {
    expect(greetingFor(makeTime(2), "Maya")).toContain("Late night");
  });

  it("returns 'Good morning' from 5am to 11am", () => {
    expect(greetingFor(makeTime(8), "Maya")).toContain("Good morning");
  });

  it("returns 'Afternoon' from 12pm to 4pm", () => {
    expect(greetingFor(makeTime(14), "Maya")).toContain("Afternoon");
  });

  it("returns 'Evening' from 5pm to 8pm", () => {
    expect(greetingFor(makeTime(18), "Maya")).toContain("Evening");
  });

  it("returns 'Late night' at 10pm or later", () => {
    expect(greetingFor(makeTime(22), "Maya")).toContain("Late night");
  });

  it("uses 'there' when no firstName is provided", () => {
    expect(greetingFor(makeTime(9))).toContain("there");
  });
});
