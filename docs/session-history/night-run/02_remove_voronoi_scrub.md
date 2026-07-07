# Job 02 — Remove the scroll-scrubbed Voronoi section (keep the playground)

## Project
`C:/Users/Emman/Downloads/computational-design-portfolio`. Read
`builds/01_audit.log.md` first for context.

## Decision (already made — do not re-litigate)
Of the two Voronoi sections, REMOVE `src/components/VoronoiScrub.astro`
(GSAP pinned scroll-scrub) and KEEP `src/components/ParametricPlayground.astro`
(Tweakpane sliders). Rationale: the owner asked to remove one Voronoi logic
and to make the site less extreme/distracting — the pinned section hijacks
1600px of scroll, which is the single most aggressive behavior on the page,
while the playground is opt-in interactivity that fits "fairly interactive."

## Task
1. Delete `src/components/VoronoiScrub.astro` and remove its import/usage
   from `src/pages/index.astro`.
2. `src/lib/lloyd.ts` stays — ParametricPlayground still uses it. Update its
   header comment (it names both consumers).
3. GSAP is now unused (VoronoiScrub was its only importer — verify with a
   grep for `gsap` across `src/`). If truly unused: `npm rm gsap`.
4. Run `npx astro check` and `npm run build`.

## Done when
- `astro check` and `npm run build` both pass with 0 errors.
- `grep -r "VoronoiScrub\|gsap" src/` returns nothing.
- Loading the page shows no pinned section and no `.pin-spacer` in the DOM.
- `builds/02_remove_voronoi_scrub.log.md` records what was removed and the
  check/build output.
