/**
 * Barrel for the type-first API contracts. Audit § 6.
 *
 * Import from this index, never from individual files — keeps the
 * boundary clear and lets us reorganize internal layout without
 * breaking consumers.
 *
 *   import type { TodayBriefing, Gig, EarningsSummary } from "@/lib/contracts";
 *
 * See ./README.md for the design.
 */

export type * from "./today";
export type * from "./work";
export type * from "./money";
export type * from "./discover";
export type * from "./comms";
export type * from "./identity";
