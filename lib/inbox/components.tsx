/* ============================================================
   Back-compat shim — chrome moved up to workspace level.
   These components are now shared across all creator workspace
   pages, not just inbox. Import from `@/lib/workspace/chrome`
   directly going forward; this re-export exists so existing
   inbox imports keep compiling without churn.
   ============================================================ */

export {
  PaneHeader,
  PaneSubCount,
  EmptyState,
  FilterChips,
  IconButton,
  type PaneHeaderProps,
  type EmptyStateProps,
  type FilterChipsProps,
  type FilterOption,
  type IconButtonProps,
} from "@/lib/workspace/chrome";
