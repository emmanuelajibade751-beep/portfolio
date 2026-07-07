/**
 * Lloyd-relaxation solver.
 *
 * Consumed by ParametricPlayground, which binds the relaxation timeline to
 * visitor-facing sliders (I7). The snapshot structure is driver-agnostic —
 * scroll, sliders, or anything else can scrub it, which is the point: the
 * parametric model is independent of what drives it.
 */

import { Delaunay } from "d3-delaunay";

/**
 * mulberry32 — tiny seeded PRNG so a given seed always produces the same
 * field (Math.random would reshuffle the artwork on every load/rebuild).
 */
export function mulberry32(seed: number): () => number {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export interface RelaxationOptions {
  /** Number of Voronoi seed points. */
  count: number;
  /** Lloyd iterations to run — one snapshot is stored per iteration. */
  steps: number;
  /** Abstract solve-space dimensions (scaled to the canvas at draw time). */
  width: number;
  height: number;
  /** PRNG seed for the initial scatter. */
  seed: number;
}

/**
 * Runs Lloyd's algorithm and returns `steps + 1` snapshots of the point
 * positions (flat [x0, y0, x1, y1, ...] arrays), from the initial random
 * scatter through progressively more even spacing. Consumers interpolate
 * between neighbouring snapshots for a continuous timeline.
 */
export function relaxationSnapshots(options: RelaxationOptions): Float64Array[] {
  const { count, steps, width, height, seed } = options;
  const rand = mulberry32(seed);

  const pts = new Float64Array(count * 2);
  for (let i = 0; i < count; i++) {
    pts[i * 2] = rand() * width;
    pts[i * 2 + 1] = rand() * height;
  }

  // One snapshot per Lloyd step: move each seed to its cell's centroid.
  const snapshots: Float64Array[] = [pts.slice()];
  for (let k = 0; k < steps; k++) {
    const vor = new Delaunay(pts).voronoi([0, 0, width, height]);
    for (let i = 0; i < count; i++) {
      const poly = vor.cellPolygon(i);
      if (!poly) continue; // degenerate/empty cell — leave the seed put
      // Polygon centroid via the shoelace formula (poly is closed: last
      // vertex repeats the first, so j and j+1 pair up cleanly).
      let area = 0;
      let cx = 0;
      let cy = 0;
      for (let j = 0; j < poly.length - 1; j++) {
        const cross = poly[j][0] * poly[j + 1][1] - poly[j + 1][0] * poly[j][1];
        area += cross;
        cx += (poly[j][0] + poly[j + 1][0]) * cross;
        cy += (poly[j][1] + poly[j + 1][1]) * cross;
      }
      area *= 0.5;
      // 6*area is the standard polygon-centroid divisor (the cx/cy sums
      // accumulate 6× the signed-area-weighted centroid). Signs cancel,
      // so the winding direction of the cell polygon doesn't matter.
      if (Math.abs(area) > 1e-9) {
        pts[i * 2] = cx / (6 * area);
        pts[i * 2 + 1] = cy / (6 * area);
      }
    }
    snapshots.push(pts.slice());
  }
  return snapshots;
}
