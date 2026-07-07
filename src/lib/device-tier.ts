/**
 * I4 pitfall guard — a particle count that's smooth on a desktop can crater
 * a phone to single-digit fps. Pick the budget from *measured capability*
 * (cores + memory + input type), never from screen width, so a powerful
 * tablet isn't punished for being touch and a weak laptop isn't trusted for
 * being large. (This is the seed of the fuller A5 adaptive-degradation skill.)
 */

export type DeviceTier = "low" | "mid" | "high";

export function detectDeviceTier(): DeviceTier {
  const cores = navigator.hardwareConcurrency ?? 4;
  // deviceMemory is Chromium-only and reported in GB; treat unknown as mid (4).
  const memory = (navigator as { deviceMemory?: number }).deviceMemory ?? 4;
  const coarsePointer = window.matchMedia("(pointer: coarse)").matches;

  // Touch/mobile: never trust above "mid", and drop weak ones to "low".
  if (coarsePointer) {
    return cores >= 8 && memory >= 4 ? "mid" : "low";
  }

  if (cores >= 8 && memory >= 8) return "high";
  if (cores >= 4 && memory >= 4) return "mid";
  return "low";
}

/** Particle count per tier for the flow field. Tune here, not at call sites. */
export function particleBudget(tier: DeviceTier): number {
  switch (tier) {
    case "low":
      return 220;
    case "mid":
      return 600;
    case "high":
      return 1200;
  }
}
