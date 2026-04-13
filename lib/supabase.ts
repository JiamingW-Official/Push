import { createBrowserClient } from "@supabase/ssr";

// Browser client — use in Client Components ('use client')
export const createClient = () =>
  createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
  );
