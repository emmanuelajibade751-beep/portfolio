# Job 07 log — Final verification + debt paydown

## Perf/a11y debts paid
- NEW `src/lib/visibility.ts` — IntersectionObserver helper (presence
  callback with margin; returns disconnect).
- **ParametricPlayground lazy-init**: the ~44ms Lloyd solve + Tweakpane
  construction now run once, when the section first comes within 400px of
  the viewport — verified live: pane empty at page top, 4 controls +
  painted canvas after scrolling to it. Fixed-height section → no CLS.
- **All three rAF scenes viewport-gated**: DotGridHero (pauses when hero
  scrolled away), SvgMorphMotif and FlowField (pause offscreen; FlowField
  also lazy-spawns particles on first approach). Reduced-motion remains the
  overriding hard gate in every scene's single `updateMotionState()`.
- Dead `[data-motion="reduced"]` CSS rule removed from global.css (orphaned
  by job 04); stale F2 comment rewritten to describe the real two-layer
  reduced-motion architecture.
- `content.config.ts`: `z` import moved from deprecated `astro:content`
  export to `astro/zod`.

## Snags hit + fixed during this job
- My init() wrapper broke TS null-narrowing in ParametricPlayground
  (2 errors) — fixed with the house non-null re-bind pattern.
- Dodged the recurring TDZ hazard in FlowField (resize callback reads
  `initialized`) by declaring gating state above surface creation —
  this hazard is now documented in the project CLAUDE.md.

## Verification sweep (evidence)
- `npx astro check` → **0 errors / 0 warnings / 0 hints** (down from 10
  pre-existing hints — all cleaned).
- `npm run build` → 4 pages, clean.
- Production `astro preview` on :4399 → `/` 200, `/work/facade-study/` 200,
  cards present in served HTML; server stopped after.
- Desktop + mobile (375px) passes: nav/hero/catalogue/about/contact/footer
  all render correctly at both widths (screenshots taken during run).
- Console: zero errors on load, after scrolling every section, and after
  playground interaction.
- **Reduced-motion caveat (honest limit):** this harness cannot emulate the
  OS-level `prefers-reduced-motion` setting, so tonight's checks verify the
  code paths (every scene's gate logic + static poses, which were exercised
  and screenshot-verified in earlier sessions on the dark theme) rather
  than a live OS toggle on the new theme. Morning eyeball suggested.

## Docs
- Portfolio `CLAUDE.md` rewritten: theme tokens, catalogue workflow, scene
  conventions (incl. the TDZ rule and FADE/bg coupling), owner to-dos,
  remaining skills roadmap.

## Commits (all local, none pushed)
`5da3337` pre-night checkpoint → `1f1fef3` (02) → `7077a4b` (03) →
`fb6dad4` (04) → `4f3fd50` (05) → `f2fca69` (06) → `90695c2` (07).

## What the owner should review by eye in the morning
1. The light theme overall — especially FlowField trail contrast and the
   dot-grid rest opacity (tuned by probe, not by human eye).
2. OS reduced-motion toggle on the new theme (harness couldn't emulate).
3. The three placeholder projects + about/contact copy — all marked
   `[Placeholder — replace]`.
4. og:image is intentionally absent (needs a raster asset you like).
5. Name/email are live in nav/footer/contact (assumption logged in job 06).
6. ParametricPlayground's init() body is one indent level shallower than
   ideal (wrapped late) — cosmetic only; a prettier pass would normalize.
