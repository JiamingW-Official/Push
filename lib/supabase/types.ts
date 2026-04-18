// Placeholder types module — re-introduce generated Supabase types here.
// Kept minimal so `import type { Database } from './types'` callers compile.

export type Database = Record<string, unknown>;
export type Tables<_T extends string = string> = Record<string, unknown>;
