/**
 * Relative-time formatting helpers — used by the Admin Dashboard's
 * "last updated X ago" indicator.
 */

/**
 * Format a past `Date` as a short relative string in Chinese, mirroring the
 * conventions of the Push admin UI.
 *
 *   < 60s  → "X 秒前"
 *   < 60m  → "X 分钟前"
 *   else   → "X 小时前"
 *
 * Future dates (clock skew, misuse) collapse to "0 秒前" rather than showing
 * a negative number.
 */
export function formatTimeAgo(date: Date): string {
  const diffMs = Date.now() - date.getTime();
  const diffSecs = Math.max(0, Math.floor(diffMs / 1000));

  if (diffSecs < 60) return `${diffSecs} 秒前`;
  if (diffSecs < 3600) return `${Math.floor(diffSecs / 60)} 分钟前`;
  return `${Math.floor(diffSecs / 3600)} 小时前`;
}
