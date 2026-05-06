/**
 * Barrel export for the v12.2 shared-primitive library. Audit § P0
 * found 6 patterns implemented 4-12× across the workspace; this
 * index is the single import surface for all of them.
 *
 *   import { TwoPane, BentoModule, TabBar, StatusPill,
 *            ProgressBar, KpiBlock } from "@/components/shared/primitives";
 *
 * Adding a new primitive: drop the .tsx + .css alongside, then
 * re-export here. Don't deep-import — keeps the boundary clean.
 */

export { TwoPane } from "./TwoPane";
export { BentoModule } from "./BentoModule";
export { TabBar } from "./TabBar";
export type { Tab } from "./TabBar";
export { StatusPill } from "./StatusPill";
export type { StatusVariant } from "./StatusPill";
export { ProgressBar } from "./ProgressBar";
export { KpiBlock } from "./KpiBlock";
