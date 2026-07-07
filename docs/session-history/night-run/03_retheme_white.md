# Job 03 — Retheme: dominant white background, orange + black accents

## Project
`C:/Users/Emman/Downloads/computational-design-portfolio`. Read
`builds/01_audit.log.md` (retheme touchpoints) and
`builds/02_remove_voronoi_scrub.log.md` (what no longer exists) first.

## Task
Switch the site from dark to a professional light theme:
- Dominant white/near-white background (e.g. #fbfaf8 or similar warm white),
  near-black text, the existing orange (#d4623a family) kept as THE accent,
  black used for structure (headings, rules, nav) — not large fills.
- Update the CSS custom properties in `src/styles/global.css` first
  (`--color-bg`, `--color-fg`, `--color-grid-line`, add any needed), then
  hunt every hardcoded color the audit found in component `<style>` blocks
  AND in canvas/JS drawing code:
  - DotGridHero: FG/ACCENT dot channel constants + caption rgba colors.
  - FlowField: `FADE` veil must match the new bg or trails will ghost wrong;
    stroke color/opacity needs re-tuning for contrast on white.
  - SvgMorphMotif, ParametricPlayground, motion-demo section: caption/status
    rgba colors.
  - Tweakpane (ParametricPlayground) ships a dark default — retheme it via
    its CSS custom properties (`--tp-base-background-color` etc.) in the
    component's style block so the panel doesn't sit as a dark slab on a
    white page.
- Contrast: keep body text ≥ 4.5:1 against the background; canvas art may be
  subtle but must remain visible.

## Done when
- `astro check` + `npm run build` pass.
- Screenshots (or DOM/pixel probes) of every section on the light theme are
  taken and referenced/described in the log; no section still renders a dark
  background or invisible strokes.
- Reduced-motion static poses re-checked (they draw with the same palettes).
- `builds/03_retheme_white.log.md` lists every file touched and any contrast
  judgment calls made.
