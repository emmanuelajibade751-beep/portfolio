# Job 05 log — Drop-in project catalogue

## Built
- `src/content.config.ts` — `projects` collection (glob loader, `*.md` in
  `src/content/projects/`), schema: title, description, date, tags, cover
  (image(), resolved relative to the .md), tools, optional order.
- `src/content/projects/` — THREE placeholder projects, each one .md + one
  hand-drawn SVG cover in the light palette (attractor-rotated facade grid;
  radial canopy rib fan; massing-iteration sequence). Covers carry a visible
  "PLACEHOLDER — REPLACE WITH YOUR IMAGE" label; body copy is a template
  telling the owner what a strong write-up of that project type contains.
- `src/components/WorkCatalogue.astro` — card grid (cover, title, one-liner,
  mono tag chips), sorted by `order` then date desc. Hover lift uses a
  cubic-bezier approximation of the house easing; disabled under
  prefers-reduced-motion.
- `src/pages/work/[slug].astro` — detail page: back link, title, date/tools
  meta, tags, cover, prose body. Standalone head for now — job 06's shared
  layout will absorb it.
- `src/pages/index.astro` — `<WorkCatalogue />` placed directly after the
  hero (judgment call, logged: work first, animation garnish after).
- `HOW_TO_ADD_A_PROJECT.md` (repo root) — non-developer steps: copy a .md,
  drop an image, edit frontmatter, rebuild. Covers removal/reordering and
  flags the three placeholders as replace-or-delete.

## Drop-in proof (the job's required test)
1. Created `zz-test.md` + `zz-test-cover.svg` (copy) — **no code edits**.
2. `npm run build` → **5 pages** (was 4); `dist/work/zz-test/` generated;
   `grep "ZZ Drop-In Test" dist/index.html` → 1 hit (card in grid).
3. Deleted both test files; rebuild → back to 4 pages cleanly.

## Other proof
- `astro check` 0 errors (10 hints, non-blocking — noted for job 07 review).
- Live: 3 cards render with correct titles; `/work/facade-study/` → 200 with
  title, back-link, body.
- **Snag hit + resolved:** after adding `content.config.ts` the running dev
  server served the grid empty (0 cards) while the production build was
  correct — stale content-layer sync. Full dev-server restart fixed it;
  no code change needed. Worth remembering: content-collection config
  changes need a dev-server restart.

## Scope check
git status: index.astro (M) + new files {HOW_TO_ADD_A_PROJECT.md,
WorkCatalogue.astro, content.config.ts, src/content/, src/pages/work/} —
all named by the job. Test files created and removed within the job. No creep.
