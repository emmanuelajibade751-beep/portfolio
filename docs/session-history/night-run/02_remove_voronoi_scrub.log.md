# Job 02 log — VoronoiScrub removed, playground kept

## Done
- Deleted `src/components/VoronoiScrub.astro` (pre-made decision per job
  file: the pinned 1600px scroll-hijack was the most aggressive behavior on
  the page; ParametricPlayground keeps the Voronoi story as opt-in
  interactivity).
- Removed its import + `<VoronoiScrub />` usage from `src/pages/index.astro`.
- Updated `src/lib/lloyd.ts` header — no longer names two consumers; notes
  the snapshot structure is driver-agnostic.
- `npm rm gsap` — VoronoiScrub was confirmed (grep) the only importer.
- **In-scope extra:** removed a stale cross-reference comment in
  `ParametricPlayground.astro` that pointed at VoronoiScrub's render() —
  required by this job's own done-when (`grep -r "VoronoiScrub|gsap" src/`
  must return nothing).

## Proof
- `grep -rn "VoronoiScrub\|gsap" src/` → no matches (exit 1).
- `npx astro check` → 0 errors / 0 warnings / 0 hints.
- `npm run build` → 1 page built, complete, no errors.
- Live DOM probe after reload: `pin-spacer` absent, `#voronoi-scrub` absent,
  `#playground-canvas` present; remaining sections: hero, motion-demo,
  motif, flow, playground.

## Scope check
`git status` before commit: exactly {package-lock.json, package.json,
ParametricPlayground.astro, VoronoiScrub.astro (D), lloyd.ts, index.astro}
— all named by or required by the job file. No scope creep.
