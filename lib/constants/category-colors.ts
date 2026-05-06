/** Category-to-hex map for map markers only.
 *
 * ⚠ PR DISCUSSION REQUIRED before merge:
 *   Several tokens below reuse Design.md role-locked colors in a new context (map markers).
 *   Markers are chrome (like nav pills), not section content — but the role-locks in § 2/§ 4
 *   were written for section content. Two options to resolve:
 *     (a) Loosen the role-lock to "Forbidden in section bg / button fill / card fill;
 *         allowed in map marker chrome" — update Design.md in same PR.
 *     (b) Introduce 6 dedicated --cat-* CSS variables in globals.css and use those instead.
 *   Do NOT silently keep these values without one option being selected and documented.
 *
 *   Specific conflicts:
 *     RETAIL:   #1e5fad  (--editorial-blue  — role-locked to footer panel only)
 *     WELLNESS: #4ade80  (deprecated GA Green hex; Figma-exact is #32ce57 per Design.md § 2.4)
 *     FITNESS:  #0085ff  (--accent-blue — secondary CTA color, not for decorative surfaces)
 */
export const CATEGORY_COLORS = {
  "FOOD & DRINK": "#ff5700", // --ga-orange (map marker only)
  RETAIL: "#1e5fad", // --editorial-blue (⚠ role-locked to footer — see PR note)
  WELLNESS: "#4ade80", // GA Green (⚠ deprecated hex; Figma-exact #32ce57)
  BEAUTY: "#e8447d", // --editorial-pink
  FITNESS: "#0085ff", // --accent-blue (⚠ CTA color repurposed as marker)
  LIFESTYLE: "#bfa170", // --champagne
} as const;

export type CategoryKey = keyof typeof CATEGORY_COLORS;

export function categoryColor(cat: string): string {
  return (CATEGORY_COLORS as Record<string, string>)[cat] ?? "#9a9a9a";
}
