/**
 * F4 — Parametric easing math.
 *
 * `structuralSag` is the site's one signature motion curve: slow load,
 * quick release, small overshoot before settling. The intent is to reuse
 * it for every micro-interaction (hover states, panel opens, rotation
 * snaps) instead of a different CSS easing on every element — same idea
 * as reusing one graph-mapper curve across a Grasshopper definition.
 * Currently it has no consumer (its demo section was removed in the
 * portfolio conversion); it is kept deliberately as the house curve for
 * future micro-interactions.
 */

export function lerp(start: number, end: number, t: number): number {
  return start + (end - start) * t;
}

export function clamp01(t: number): number {
  return Math.min(1, Math.max(0, t));
}

/**
 * Smooth Hermite falloff between two edges — the standard tool for a soft
 * radius of influence (e.g. a cursor "attractor" fading out over distance)
 * without the hard clip of a linear ramp. Returns 0 below edge0, 1 above
 * edge1, and an ease-in-out curve between.
 */
export function smoothstep(edge0: number, edge1: number, x: number): number {
  const t = clamp01((x - edge0) / (edge1 - edge0));
  return t * t * (3 - 2 * t);
}

/**
 * easeInOutBack: slow in, snap out, small overshoot before settle.
 * `overshoot` (c1) controls how far past 0/1 the curve dips before
 * settling; c2 is the standard easeInOutBack derivation from c1
 * (widens the overshoot window symmetrically around the midpoint).
 * t is expected in [0, 1].
 */
export function structuralSag(t: number, overshoot = 1.0): number {
  const c1 = overshoot;
  const c2 = c1 * 1.525;
  const x = clamp01(t);

  return x < 0.5
    ? (Math.pow(2 * x, 2) * ((c2 + 1) * 2 * x - c2)) / 2
    : (Math.pow(2 * x - 2, 2) * ((c2 + 1) * (x * 2 - 2) + c2) + 2) / 2;
}
