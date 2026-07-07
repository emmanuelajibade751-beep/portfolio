/**
 * Viewport-presence helper (night job 07 perf debt paydown).
 *
 * Two uses across the scenes:
 *  - lazy INIT: heavy setup (e.g. the Voronoi solver) waits until its
 *    section first approaches the viewport;
 *  - loop GATING: rAF loops only run while their canvas is actually on
 *    screen, so an unseen section costs zero CPU.
 *
 * Layout safety: every animated section has an explicit height with an
 * absolutely-positioned canvas, so deferring init cannot shift layout.
 */

export function onViewportPresence(
  target: Element,
  marginPx: number,
  callback: (visible: boolean) => void
): () => void {
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        callback(entry.isIntersecting);
      }
    },
    // Positive margin grows the trigger box beyond the viewport, so scenes
    // wake up slightly before they scroll into sight.
    { rootMargin: `${marginPx}px` }
  );
  observer.observe(target);
  return () => observer.disconnect();
}
