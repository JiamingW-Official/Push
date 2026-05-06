export type Density = "compact" | "default" | "spacious";

export const DENSITY_KEY = "push_density";

/**
 * Map a Density value to a CSS variable scale that components consume
 * via `padding: calc(var(--density-pad-md) * var(--density-scale))` style
 * recipes. Keep the scale conservative — `compact` is 0.85, `spacious`
 * is 1.15. Anything more breaks v12.2 8px-grid alignment.
 */
export const DENSITY_SCALE: Record<Density, number> = {
  compact: 0.85,
  default: 1,
  spacious: 1.15,
};

/** Apply the chosen density to <body> by setting the --density-scale var.
 *  Components opt in by referencing var(--density-scale) in their CSS. */
export function applyDensity(d: Density) {
  if (typeof document === "undefined") return;
  document.body.style.setProperty("--density-scale", String(DENSITY_SCALE[d]));
  document.body.dataset.density = d;
}
