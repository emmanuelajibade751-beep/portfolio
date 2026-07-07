/**
 * F2 — Reduced-motion architecture.
 *
 * Single place every scene checks. The listener fires on live OS-setting
 * changes, not just on load, since a user can toggle this mid-session.
 */

const query = window.matchMedia("(prefers-reduced-motion: reduce)");

export function prefersReducedMotion(): boolean {
  return query.matches;
}

export function onReducedMotionChange(
  callback: (reduced: boolean) => void
): () => void {
  const handler = (event: MediaQueryListEvent) => callback(event.matches);
  query.addEventListener("change", handler);
  return () => query.removeEventListener("change", handler);
}

/**
 * Mirrors the current preference onto documentElement as
 * data-motion="reduced" | "full" so CSS can key off it directly
 * (see [data-motion="reduced"] rules in global.css).
 */
export function syncReducedMotionAttribute(): () => void {
  const apply = (reduced: boolean) => {
    document.documentElement.dataset.motion = reduced ? "reduced" : "full";
  };
  apply(prefersReducedMotion());
  return onReducedMotionChange(apply);
}
