/* ============================================================
   Merchant demo threads — used as a client-side fallback when
   the server returns an empty initialThreads array (no merchant
   session, no real DB rows). Mirrors the creator inbox seed
   pattern in lib/inbox/seed.ts but role-swapped: here the
   "other" party is a creator, and `senderRole === "merchant"`
   on outgoing bubbles.

   Authority: lib/messaging/types.ts (Thread / Message shapes).
   ============================================================ */

import type { Message, Thread } from "@/lib/messaging/types";

const MERCHANT_USER_ID = "demo-merchant-user";

const _now = Date.now();
const minutesAgo = (m: number) => new Date(_now - m * 60_000).toISOString();
const hoursAgo = (h: number) => new Date(_now - h * 60 * 60_000).toISOString();
const daysAgo = (d: number) =>
  new Date(_now - d * 24 * 60 * 60_000).toISOString();

type MockSeed = {
  thread: Omit<Thread, "lastMessage" | "updatedAt"> & {
    creatorUserId: string;
    creatorName: string;
    creatorAvatar?: string;
  };
  messages: Array<{
    id: string;
    role: "creator" | "merchant";
    content: string;
    createdAt: string;
  }>;
};

const SEEDS: MockSeed[] = [
  {
    thread: {
      id: "mt-maya",
      participants: [],
      campaignId: "camp-summer-menu",
      campaignTitle: "Summer Menu Launch",
      unreadCount: 2,
      creatorUserId: "u-maya",
      creatorName: "Maya Rodriguez",
    },
    messages: [
      {
        id: "mm-maya-1",
        role: "merchant",
        content:
          "Hey Maya — welcome to the Summer Menu Launch. Your last food reel is exactly the energy we want.",
        createdAt: hoursAgo(5),
      },
      {
        id: "mm-maya-2",
        role: "merchant",
        content:
          "QR poster is at the register. Marco knows you're coming — Saturday around 1pm still good?",
        createdAt: hoursAgo(5),
      },
      {
        id: "mm-maya-3",
        role: "creator",
        content:
          "Saturday 1pm works! Quick question — can I shoot the patio first or should I start at the bar?",
        createdAt: hoursAgo(2),
      },
      {
        id: "mm-maya-4",
        role: "creator",
        content:
          "Also — do you want me to feature a specific pie? The Bee Sting looks insane on the menu.",
        createdAt: minutesAgo(38),
      },
      {
        id: "mm-maya-5",
        role: "creator",
        content:
          "Bee Sting + a bar bite shot would be perfect. Tag @robertaspizza and we're set.",
        createdAt: minutesAgo(12),
      },
    ],
  },
  {
    thread: {
      id: "mt-jordan",
      participants: [],
      campaignId: "camp-wellness",
      campaignTitle: "Wellness Weekend",
      unreadCount: 0,
      creatorUserId: "u-jordan",
      creatorName: "Jordan Park",
    },
    messages: [
      {
        id: "mm-jordan-1",
        role: "creator",
        content:
          "Picked up the QR this morning. Planning to shoot tomorrow afternoon — golden hour.",
        createdAt: hoursAgo(8),
      },
      {
        id: "mm-jordan-2",
        role: "merchant",
        content:
          "Perfect. We'll have fresh bouquets staged by 4pm. Any props you need from us?",
        createdAt: hoursAgo(7),
      },
      {
        id: "mm-jordan-3",
        role: "creator",
        content:
          "Just the candle line if it's ready. I'll bring everything else.",
        createdAt: hoursAgo(7),
      },
      {
        id: "mm-jordan-4",
        role: "merchant",
        content: "Done. See you tomorrow!",
        createdAt: hoursAgo(6),
      },
    ],
  },
  {
    thread: {
      id: "mt-alex",
      participants: [],
      campaignId: "camp-morning-ritual",
      campaignTitle: "Morning Ritual Series",
      unreadCount: 1,
      creatorUserId: "u-alex",
      creatorName: "Alex Chen",
    },
    messages: [
      {
        id: "mm-alex-1",
        role: "merchant",
        content:
          "Your reel hit 9k views overnight — wild ROI for the campaign. Thank you.",
        createdAt: daysAgo(2),
      },
      {
        id: "mm-alex-2",
        role: "creator",
        content: "Yes! Saw the engagement spike too. Glad it's landing.",
        createdAt: daysAgo(2),
      },
      {
        id: "mm-alex-3",
        role: "merchant",
        content:
          "Would you do a follow-up next week? Same payout structure, maybe one more spot in the rotation.",
        createdAt: daysAgo(1),
      },
      {
        id: "mm-alex-4",
        role: "creator",
        content:
          "Down for it. Tuesday or Thursday — what works on your end? I want to catch the morning regulars.",
        createdAt: daysAgo(1),
      },
      {
        id: "mm-alex-5",
        role: "creator",
        content:
          "Also — any chance we can extend the QR window through Sunday?",
        createdAt: hoursAgo(20),
      },
    ],
  },
  {
    thread: {
      id: "mt-sam",
      participants: [],
      campaignId: "camp-local-favorites",
      campaignTitle: "Local Favorites Reel",
      unreadCount: 0,
      creatorUserId: "u-sam",
      creatorName: "Sam Patel",
    },
    messages: [
      {
        id: "mm-sam-1",
        role: "creator",
        content:
          "Quick scope question — the brief lists 3 spots, can I swap one out if a venue isn't a fit?",
        createdAt: daysAgo(3),
      },
      {
        id: "mm-sam-2",
        role: "merchant",
        content:
          "Yeah, swap is fine — just keep all three within Bed-Stuy. Send me the new pick before you shoot.",
        createdAt: daysAgo(3),
      },
      {
        id: "mm-sam-3",
        role: "creator",
        content:
          "Got it. Subbing in Saraghina for the third spot — pizza + atmosphere both fit the audience.",
        createdAt: daysAgo(2),
      },
      {
        id: "mm-sam-4",
        role: "merchant",
        content: "Approved. Looking forward to it.",
        createdAt: daysAgo(2),
      },
    ],
  },
  {
    thread: {
      id: "mt-noor",
      participants: [],
      campaignId: undefined,
      campaignTitle: undefined,
      unreadCount: 0,
      creatorUserId: "u-noor",
      creatorName: "Noor Hassan",
    },
    messages: [
      {
        id: "mm-noor-1",
        role: "creator",
        content:
          "Hi — saw the Spring Beauty brief in my invites. Before I accept, can you confirm the shoot can be split across two days?",
        createdAt: daysAgo(6),
      },
      {
        id: "mm-noor-2",
        role: "merchant",
        content:
          "Two-day split works. Service-day BTS Monday, follow-up post Tuesday is ideal for our launch window.",
        createdAt: daysAgo(6),
      },
      {
        id: "mm-noor-3",
        role: "creator",
        content: "Perfect — accepting now. Will post after the service.",
        createdAt: daysAgo(5),
      },
      {
        id: "mm-noor-4",
        role: "merchant",
        content: "Sounds good. We'll have the QR card waiting at reception.",
        createdAt: daysAgo(5),
      },
    ],
  },
];

/** Build the demo Thread[] in the same shape the page expects from the API. */
export function buildMerchantMockThreads(): Thread[] {
  return SEEDS.map(({ thread, messages }) => {
    const last = messages[messages.length - 1];
    return {
      id: thread.id,
      participants: [
        {
          userId: thread.creatorUserId,
          role: "creator",
          name: thread.creatorName,
          avatar: thread.creatorAvatar ?? "",
        },
        {
          userId: MERCHANT_USER_ID,
          role: "merchant",
          name: "You",
          avatar: "",
        },
      ],
      campaignId: thread.campaignId,
      campaignTitle: thread.campaignTitle,
      lastMessage: {
        content: last.content,
        senderId:
          last.role === "merchant" ? MERCHANT_USER_ID : thread.creatorUserId,
        createdAt: last.createdAt,
      },
      unreadCount: thread.unreadCount,
      updatedAt: last.createdAt,
    };
  });
}

/** Hydrate a single demo thread to the same shape `/api/merchant/messages/threads/[id]` returns. */
export function buildMerchantMockMessages(threadId: string): Message[] | null {
  const seed = SEEDS.find((s) => s.thread.id === threadId);
  if (!seed) return null;

  return seed.messages.map((m) => ({
    id: m.id,
    threadId,
    senderId:
      m.role === "merchant" ? MERCHANT_USER_ID : seed.thread.creatorUserId,
    senderRole: m.role,
    content: m.content,
    contentType: "text",
    attachments: [],
    createdAt: m.createdAt,
  }));
}

export const DEMO_MERCHANT_USER_ID = MERCHANT_USER_ID;
