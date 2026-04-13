import { createBrowserClient } from "@supabase/ssr";

// Browser client — use in Client Components ('use client')
// Falls back to placeholder values during static build when env vars aren't set.
// Demo mode never actually calls Supabase, so this is safe.
export const createClient = () =>
  createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? "https://placeholder.supabase.co",
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
      "placeholder-anon-key",
  );
