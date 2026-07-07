declare module "flubber" {
  interface InterpolateOptions {
    /** Smaller = more sample points = smoother morph on curvy paths. */
    maxSegmentLength?: number;
    /** Return a path string (default true) vs a point ring. */
    string?: boolean;
  }
  /** Returns an interpolator: t in [0, 1] -> SVG path `d` string. */
  export function interpolate(
    fromShape: string,
    toShape: string,
    options?: InterpolateOptions
  ): (t: number) => string;
}
