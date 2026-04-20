/**
 * Browser Supabase client (anon/publishable key).
 *
 * Use in Client Components ('use client') only. For Server Components,
 * Route Handlers, or Server Actions, import from "@/lib/db/server" instead.
 * For service-role (RLS-bypass) queries, import `supabase` from "@/lib/db".
 *
 * Falls back to placeholder values during static build when env vars aren't set.
 * Demo mode never actually calls Supabase, so this is safe.
 */
import { createBrowserClient } from "@supabase/ssr";

export const createClient = () =>
  createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? "https://placeholder.supabase.co",
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
      "placeholder-anon-key",
  );
