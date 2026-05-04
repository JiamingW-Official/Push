import type {
  Message,
  Thread,
  ThreadFilter,
  ThreadParticipant,
} from "@/lib/messaging/types";

type CreatorProfile = {
  id: string;
  handle?: string | null;
  user_id?: string | null;
  tier?: ThreadParticipant["tier"] | null;
};

type MerchantProfile = {
  id: string;
  business_name?: string | null;
  owner_user_id?: string | null;
};

function fallbackAvatar(seed: string): string {
  return `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(seed)}`;
}

export function dbRowToMessage(row: any): Message {
  return {
    id: row.id,
    threadId: row.thread_id,
    senderId: row.sender_id,
    senderRole: row.sender_role,
    content: row.content,
    contentType: row.content_type ?? "text",
    campaignRef: row.campaign_ref ?? undefined,
    attachments: Array.isArray(row.attachments) ? row.attachments : [],
    createdAt: row.created_at,
    readAt: row.read_at ?? undefined,
  };
}

export function dbRowToThread(row: any, messages?: any[]): Thread {
  const unreadCount =
    typeof row.unread_count === "number"
      ? row.unread_count
      : 0;

  const messageRows = Array.isArray(messages) ? messages.map(dbRowToMessage) : undefined;
  const thread = {
    id: row.id,
    participants: Array.isArray(row.participants) ? row.participants : [],
    campaignId: row.campaign_id ?? undefined,
    campaignTitle:
      row.campaign_title ?? row.campaigns?.title ?? row.campaign?.title ?? undefined,
    lastMessage: {
      content: row.last_message_content ?? "",
      senderId: row.last_message_sender_id ?? row.creator_id ?? row.merchant_id ?? "",
      createdAt: row.last_message_created_at ?? row.last_message_at ?? row.updated_at,
    },
    unreadCount,
    updatedAt: row.updated_at ?? row.last_message_at ?? row.created_at,
    ...(messageRows ? { messages: messageRows } : {}),
    merchant_id: row.merchant_id,
    creator_id: row.creator_id,
  };

  return thread as Thread;
}

export async function buildParticipants(
  supabase: any,
  threadId: string,
): Promise<ThreadParticipant[]> {
  const { data: thread, error: threadError } = await supabase
    .from("threads")
    .select("id, merchant_id, merchant_user_id, creator_id, creator_user_id")
    .eq("id", threadId)
    .single();

  if (threadError || !thread) {
    throw new Error(threadError?.message ?? "Thread not found");
  }

  const [creatorResult, merchantResult] = await Promise.all([
    supabase
      .from("creators")
      .select("id, handle, user_id, tier")
      .eq("id", thread.creator_id)
      .maybeSingle(),
    supabase
      .from("merchants")
      .select("id, business_name, owner_user_id")
      .eq("id", thread.merchant_id)
      .maybeSingle(),
  ]);

  const creator = creatorResult.data as CreatorProfile | null;
  const merchant = merchantResult.data as MerchantProfile | null;

  return [
    {
      userId: creator?.user_id ?? thread.creator_user_id ?? thread.creator_id,
      role: "creator",
      name: creator?.handle ?? thread.creator_id,
      avatar: fallbackAvatar(creator?.handle ?? thread.creator_id),
      tier: creator?.tier ?? undefined,
    },
    {
      userId: merchant?.owner_user_id ?? thread.merchant_user_id ?? thread.merchant_id,
      role: "merchant",
      name: merchant?.business_name ?? thread.merchant_id,
      avatar: fallbackAvatar(merchant?.business_name ?? thread.merchant_id),
    },
  ];
}

export async function getThreads(
  supabase: any,
  merchantId: string,
  filter: ThreadFilter = "all",
): Promise<Thread[]> {
  let query = supabase
    .from("threads")
    .select("id, merchant_id, merchant_user_id, creator_id, creator_user_id, campaign_id, last_message_content, last_message_sender_id, last_message_created_at, last_message_at, updated_at, campaigns(title)")
    .eq("merchant_id", merchantId)
    .order("last_message_at", { ascending: false, nullsFirst: false });

  if (filter === "campaigns") {
    query = query.not("campaign_id", "is", null);
  }

  if (filter === "direct") {
    query = query.is("campaign_id", null);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(error.message);
  }

  const rows = (data ?? []) as any[];
  const participants = await Promise.all(
    rows.map((row) => buildParticipants(supabase, row.id)),
  );

  return rows.map((row, index) =>
    dbRowToThread({ ...row, participants: participants[index] }),
  );
}

export async function getThreadWithMessages(
  supabase: any,
  threadId: string,
  merchantId: string,
): Promise<(Thread & { messages: Message[] }) | null> {
  const { data: threadRow, error: threadError } = await supabase
    .from("threads")
    .select("id, merchant_id, merchant_user_id, creator_id, creator_user_id, campaign_id, last_message_content, last_message_sender_id, last_message_created_at, last_message_at, updated_at, campaigns(title)")
    .eq("id", threadId)
    .eq("merchant_id", merchantId)
    .maybeSingle();

  if (threadError) {
    throw new Error(threadError.message);
  }

  if (!threadRow) {
    return null;
  }

  const [{ data: messageRows, error: messagesError }, participants] = await Promise.all([
    supabase
      .from("messages")
      .select("id, thread_id, sender_id, sender_role, content, content_type, campaign_ref, attachments, created_at, read_at")
      .eq("thread_id", threadId)
      .order("created_at", { ascending: true }),
    buildParticipants(supabase, threadId),
  ]);

  if (messagesError) {
    throw new Error(messagesError.message);
  }

  return dbRowToThread(
    { ...threadRow, participants },
    messageRows ?? [],
  ) as Thread & { messages: Message[] };
}
