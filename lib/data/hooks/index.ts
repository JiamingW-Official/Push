/**
 * Barrel export for the SWR data hooks. Pages should import from
 * `@/lib/data/hooks` rather than reaching into individual files — keeps
 * the import surface small and lets us migrate hook implementations
 * (e.g. add realtime in prompt 3) without touching consumers.
 */
export { useToday } from "./useToday";
export type { TodayPayload } from "./useToday";
export { useInvites } from "./useInvites";
export { useEarnings } from "./useEarnings";
export type { EarningsPayload } from "./useEarnings";
