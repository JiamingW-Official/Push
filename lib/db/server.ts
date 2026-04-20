/**
 * Server Supabase client with cookie session handling (anon/publishable key).
 *
 * Use in Server Components, Route Handlers, and Server Actions. Because this
 * file imports `next/headers`, it CANNOT be imported from Client Components —
 * Next.js will throw "You're importing a component that needs `cookies`. It
 * only works in a Server Component..." at build time.
 *
 * For service-role (RLS-bypass) queries, import `supabase` from "@/lib/db".
 * For Client Components, import `createClient` from "@/lib/db/browser".
 */
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export const createServerSupabaseClient = async () => {
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? "https://placeholder.supabase.co",
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
      "placeholder-anon-key",
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options),
          );
        },
      },
    },
  );
};
