/**
 * Creator-side MetricsCard — thin re-export of the admin component so KPI
 * tile styling stays in lockstep across surfaces. The component is a pure
 * presentational primitive (label + value + border color); keeping a
 * single source avoids the two copies drifting.
 *
 * If/when a shared `components/ui/` layer lands, move the implementation
 * there and keep these wrappers as re-exports for backward compatibility.
 */

export { default } from "@/components/admin/MetricsCard";
export type { MetricsCardProps } from "@/components/admin/MetricsCard";
