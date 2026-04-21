import { createServerSupabaseClient } from "@/lib/db/server";
import { forbidden, unauthorized } from "./responses";
import type { NextResponse } from "next/server";

/**
 * Merchant route auth gate. Scopes by the `merchants` row that points at
 * the authenticated user. The route handler gets back the merchant_id so
 * queries can be filtered by ownership without re-deriving it.
 *
 * Usage:
 *   export async function GET() {
 *     const gate = await requireMerchantSession();
 *     if (!gate.ok) return gate.response;
 *     const rows = await db.select("campaigns", { merchant_id: gate.merchantId });
 *   }
 */
export type MerchantGate =
  | {
      ok: true;
      userId: string;
      merchantId: string;
      supabase: Awaited<ReturnType<typeof createServerSupabaseClient>>;
    }
  | { ok: false; response: NextResponse };

export async function requireMerchantSession(): Promise<MerchantGate> {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { ok: false, response: unauthorized() };
  }

  const { data, error } = await supabase
    .from("merchants")
    .select("id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (error || !data) {
    return { ok: false, response: forbidden("Merchant role required") };
  }

  return {
    ok: true,
    userId: user.id,
    merchantId: (data as { id: string }).id,
    supabase,
  };
}
