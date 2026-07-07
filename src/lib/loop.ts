/**
 * F3 — requestAnimationFrame loop with delta-time normalization.
 *
 * Every Canvas2D / SVG / WebGL animation in this project should be driven
 * by one of these loops rather than a bare rAF call, so motion speed is
 * independent of the visitor's refresh rate (60Hz vs 144Hz, or a
 * throttled background tab).
 */

export type FrameCallback = (deltaSeconds: number, elapsedSeconds: number) => void;

export interface Loop {
  start(): void;
  stop(): void;
  readonly isRunning: boolean;
}

/** Clamp applied to delta so a backgrounded/throttled tab doesn't cause
 * a huge single-frame jump ("spiral of death") when it regains focus. */
const MAX_DELTA_SECONDS = 0.1;

export function createLoop(callback: FrameCallback): Loop {
  let rafId: number | null = null;
  let lastTime: number | null = null;
  let elapsed = 0;

  function tick(now: number) {
    if (lastTime === null) {
      lastTime = now;
    }
    const rawDelta = (now - lastTime) / 1000;
    const delta = Math.min(rawDelta, MAX_DELTA_SECONDS);
    lastTime = now;
    elapsed += delta;

    callback(delta, elapsed);

    rafId = requestAnimationFrame(tick);
  }

  return {
    start() {
      if (rafId !== null) return;
      lastTime = null;
      rafId = requestAnimationFrame(tick);
    },
    stop() {
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
    },
    get isRunning() {
      return rafId !== null;
    },
  };
}
