# Job 04 log — Motion dialed to "accent, not spectacle"

## Constants changed (old → new, rationale)
- `src/lib/device-tier.ts` particle tiers: 220/600/1200 → **140/380/700**
  (fewer moving elements at every tier; comment records the demo-era values).
- `FlowField.astro` `SPEED`: 42 → **26** px/s ("drift, not rush");
  `TIME_SCALE`: 0.05 → **0.032** (field re-organises more slowly);
  live stroke alpha: 0.5 → **0.38** (texture, not foreground).
- `DotGridHero.astro` `MAX_RADIUS`: 3.6 → **2.8**; `INFLUENCE`: 150 → **120**
  ("a wink, not a spotlight" — resting grid untouched, it was already quiet).
- `SvgMorphMotif.astro` `HOLD`: 1.1 → **3.2** s; `MORPH`: 1.4 → **1.6** s
  (a morph is now an occasional event — ~4.8s cycle per shape instead of
  ~2.5s of near-constant churn).

## Judgment call (job file offered remove-or-restyle)
**Removed the motion-primitives demo section** from `index.astro` — markup,
its inline script, and its styles. It was learning scaffolding with
self-referential copy ("F1–F4 skeleton"), meaningless to a portfolio
visitor. Interactivity kept elsewhere is unchanged (cursor grid, sliders).

Consequences, recorded deliberately:
- The removed script was the only caller of `syncReducedMotionAttribute()`;
  the `[data-motion="reduced"]` CSS hook in `global.css` is now dead code.
  global.css is NOT in this job's stated scope, so it was left untouched —
  flagged for job 07 / owner (harmless one-rule leftover).
- `structuralSag()` in `lib/easing.ts` now has no consumer. Library kept —
  it's the house easing curve, intended for future micro-interactions
  (nav hover in job 06 may use its cubic-bezier approximation).
- The 4-point star motif from the demo is earmarked as the favicon (job 06).

## Proof
- `astro check` 0 errors; `npm run build` complete (555ms, 1 page).
- DOM probe after reload: `.motion-demo` absent; sections now exactly
  [hero, motif, flow, playground]. No console errors.

## Scope check
git status: DotGridHero, FlowField, SvgMorphMotif, device-tier.ts,
index.astro — every file explicitly named by the job. No creep.
