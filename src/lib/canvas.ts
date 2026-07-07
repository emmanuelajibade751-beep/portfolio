/**
 * F5 — Canvas2D fundamentals: DPI-correct sizing + resize handling.
 *
 * The #1 Canvas2D mistake is drawing at CSS-pixel dimensions while the
 * backing store stays at 1x — everything looks blurry on retina / high-DPI
 * screens, which is exactly where generative art needs to look crisp. This
 * helper sizes the backing store by devicePixelRatio and scales the context
 * so all drawing code can work in logical (CSS) pixel coordinates.
 */

// Cap the backing-store multiplier. A 3x phone at full DPR quadruples the
// pixel count vs 2x for no perceptible gain, and that cost lands on exactly
// the devices least able to afford it.
const MAX_DPR = 2;

export interface ResponsiveCanvas {
  readonly ctx: CanvasRenderingContext2D;
  /** Logical (CSS-pixel) width the drawing code should use. */
  width: number;
  /** Logical (CSS-pixel) height the drawing code should use. */
  height: number;
  dpr: number;
  /** Stop observing resize and release listeners. */
  destroy(): void;
}

export function createResponsiveCanvas(
  canvas: HTMLCanvasElement,
  onResize?: (size: { width: number; height: number }) => void
): ResponsiveCanvas {
  const maybeCtx = canvas.getContext("2d");
  if (!maybeCtx) {
    throw new Error("Canvas2D context unavailable in this browser.");
  }
  // Re-bind with a non-null type so it stays narrowed inside the hoisted
  // resize() closure below (control-flow narrowing on the nullable const
  // doesn't carry into a function that could, in principle, be called later).
  const ctx: CanvasRenderingContext2D = maybeCtx;

  function resize() {
    const rect = canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
    const width = Math.max(1, Math.round(rect.width));
    const height = Math.max(1, Math.round(rect.height));

    state.width = width;
    state.height = height;
    state.dpr = dpr;

    // Backing store lives in device pixels...
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    // ...but reset the transform so 1 drawing unit == 1 CSS pixel. setTransform
    // (not scale) is used so repeated resizes don't compound the scale factor.
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    onResize?.({ width, height });
  }

  const observer = new ResizeObserver(resize);
  observer.observe(canvas);

  const state: ResponsiveCanvas = {
    ctx,
    width: 0,
    height: 0,
    dpr: 1,
    destroy() {
      observer.disconnect();
    },
  };

  // Size synchronously for the first paint; ResizeObserver's own initial
  // callback fires a frame later, which would leave the first frame at 0×0.
  resize();

  return state;
}
