# Job 04 — Dial back motion: accent, not spectacle

## Project
`C:/Users/Emman/Downloads/computational-design-portfolio`. Read
`builds/01_audit.log.md` (dial-back candidates) and the retheme log first.

## Task
Tune the remaining animated sections so they read as professional accents
on a portfolio, per the owner: "not too extreme or distracting, fairly
interactive, still interesting."
- FlowField: reduce particle budget tiers in `src/lib/device-tier.ts` (or
  pass a scale factor), slow `SPEED`/`TIME_SCALE`, lower trail opacity —
  target "subtle drifting texture," not "screensaver."
- DotGridHero: the resting grid can stay quiet; consider slightly smaller
  `MAX_RADIUS`/influence so the cursor bloom is a wink, not a spotlight.
- SvgMorphMotif: lengthen `HOLD` (rest longer between morphs) so it changes
  occasionally rather than constantly.
- Motion-primitives demo section (`index.astro`): this was a learning
  artifact — either remove the section or restyle it as a small, quiet
  design-language note; judgment call, log the choice.
- Do NOT remove interactivity (cursor response, sliders stay).

## Done when
- `astro check` + `npm run build` pass.
- Constants changed are listed old→new in the log with one-line rationale.
- A screenshot/probe pass confirms nothing loops aggressively; the page
  reads calm at rest.
- `builds/04_dial_back_motion.log.md` written.
