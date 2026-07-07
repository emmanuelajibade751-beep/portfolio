# Computational Design Portfolio — project guide

Personal portfolio for a computational designer (Rhino / Grasshopper / C#).
Astro 7, static output, no client framework — interactive scenes are plain
TypeScript in Astro component `<script>` blocks.

**New session? Read `docs/session-history/00_HANDOFF.md` FIRST** — it
carries the full context of how this site was built (skills roadmap,
build history, conventions, night-conversion logs) so you can continue
exactly where the last session stopped.

## Development

Dev server (background mode per Astro CLI): `astro dev --background`
(manage with `astro dev stop` / `status` / `logs`). Checks: `npm run check`
(astro check), `npm run build` (must stay at 0 errors).

## Theme

Light professional theme, tokens in `src/styles/global.css`:
- `--color-bg` #fbfaf8 (warm white) / `--color-fg` #1a1917 (ink)
- `--color-accent` #d4623a — graphics and large type only
- `--color-accent-deep` #a84a28 — small accent text (WCAG-safe on bg)
- `--color-ink-soft` — captions/secondary
- `--font-mono` — system monospace stack for eyebrows/labels/nav ("technical
  blueprint" accent; deliberately NOT a pixel font)

Canvas scenes hardcode palette channels (canvas can't read CSS vars per
frame) — if tokens change, grep components for `26, 25, 23` / `212, 98, 58`
/ `251, 250, 248`. FlowField's `FADE` must always match `--color-bg`.

## Content: adding projects

See `HOW_TO_ADD_A_PROJECT.md`. One `.md` + cover image per project in
`src/content/projects/` (schema in `src/content.config.ts`); the grid
(`WorkCatalogue.astro`) and detail pages (`work/[slug].astro`) update on
build. The three placeholder projects are meant to be replaced. NOTE:
changing `content.config.ts` requires a dev-server restart.

## Interactive scenes (all in src/components/)

DotGridHero (cursor-reactive dot grid), SvgMorphMotif (self-drawing/morphing
wireframe), FlowField (noise-field particles), ParametricPlayground
(Tweakpane sliders driving the Lloyd solver in `lib/lloyd.ts`).

Conventions every scene follows:
- Reduced motion is a hard JS gate (`lib/reduced-motion.ts`): loop stopped,
  static pose drawn, live `matchMedia` listener. The CSS blanket rule in
  global.css only covers CSS animations.
- rAF loops via `lib/loop.ts` (delta-time normalized), gated by viewport
  presence (`lib/visibility.ts`) — offscreen scenes cost zero CPU.
  ParametricPlayground lazy-inits its ~44ms solve on approach.
- Canvas via `lib/canvas.ts` (DPI-correct). Its resize callback fires
  synchronously at construction — declare any state it reads BEFORE the
  `createResponsiveCanvas` call (TDZ hazard, bitten twice).
- Deterministic seeded artwork (`mulberry32` in `lib/lloyd.ts`).

## Owner to-do (placeholders awaiting real content)

- Replace the three placeholder projects + covers.
- Replace about paragraphs + portrait in `AboutContact.astro`.
- Supply a raster og:image (currently omitted in `layouts/Base.astro`).

## Roadmap (skills track, if resumed)

Remaining from the original 13-skill roadmap: I2/I3 (cursor magnetics +
custom cursor), I6 (page transitions), A1–A6 (shaders, three.js parametric
centerpiece, post-processing, perf tiering). History: `builds/` logs in the
workshop folder alongside this repo.
