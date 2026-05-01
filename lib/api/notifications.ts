import type { SupabaseClient } from "@supabase/supabase-js";

type SupabaseLikeClient = SupabaseClient<any, "public", any>;

export async function listNotifications(
  supabase: SupabaseLikeClient,
  userId: string,
) {
  const { data, error } = await supabase
    .from("notifications")
    .select("id, recipient_user_id, kind, title, body, link, read_at, created_at, updated_at")
    .eq("recipient_user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return data ?? [];
}

export async function markNotificationRead(
  supabase: SupabaseLikeClient,
  userId: string,
  notificationId: string,
) {
  const { data, error } = await supabase
    .from("notifications")
    .update({
      read_at: new Date().toISOString(),
    })
    .eq("id", notificationId)
    .eq("recipient_user_id", userId)
    .select("id, recipient_user_id, kind, title, body, link, read_at, created_at, updated_at")
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data;
}
