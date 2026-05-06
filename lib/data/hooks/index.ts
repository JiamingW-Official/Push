/**
 * Barrel export for the SWR data hooks. Pages should import from
 * `@/lib/data/hooks` rather than reaching into individual files — keeps
 * the import surface small and lets us migrate hook implementations
 * (e.g. add realtime in prompt 3) without touching consumers.
 */
export { useToday } from "./useToday";
export type { TodayPayload } from "./useToday";
export { useInvites } from "./useInvites";
export { useActiveGigs } from "./useActiveGigs";
export { useEarnings } from "./useEarnings";
export type { EarningsPayload } from "./useEarnings";
export { useScansLive } from "./useScansLive";
export { useInvitesLive } from "./useInvitesLive";
export { useNotifications } from "./useNotifications";
export { useHistory } from "./useHistory";
export type { HistoryRow } from "./useHistory";
export { useInbox } from "./useInbox";
