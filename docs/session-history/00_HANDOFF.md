# Session Handoff — read this first

**For a fresh Claude Code session:** this document + the repo's `CLAUDE.md`
contain everything needed to continue exactly where the previous session
stopped. Read this file top to bottom, then skim
`01_skills_roadmap.md` (the plan being followed) and
`02_build_history.md` (how each piece was built and what was decided).
The `night-run/` folder holds the plan/logs/summary of the overnight
conversion, verbatim ("night run" = an unattended queue of numbered jobs
that Claude executed overnight while the owner slept; each job has a spec
`NN_name.md` and an execution log `NN_name.log.md`).

## What this project is

A computational-design portfolio site for **Emmanuel Ajibade**
(architecture / Grasshopper / parametric design; email
emmanuelajibade751@gmail.com). Astro 7, static output, zero client
framework — every interactive scene is plain TypeScript in Astro component
`<script>` blocks. Local git repo; **never pushed anywhere; no remote
exists. Do not deploy/push without the owner asking.**

The site began as a skills-learning exercise (an interactive-animation
roadmap, see `01_skills_roadmap.md`) and was converted overnight into a
professional portfolio: white theme, calm motion, drop-in project
catalogue, real site chrome.

## Current state (verified at handoff)

- `npx astro check` → 0 errors / 0 warnings / 0 hints
- `npm run build` → 4 pages (index + 3 project detail pages), clean
- Git: 8 commits from `5da3337` (pre-conversion rollback point: the
  original dark animation demo) through the night jobs. Tree clean at
  handoff (plus the session-history docs commit that added this folder).
- First run in a fresh environment: Node **>=22.12.0** required
  (`engines` in package.json), then `npm install` before any of the
  commands below.
- Dev server: `npm run dev` → localhost:4321. NOTE: the owner's
  `.claude/launch.json` for previewing lives in the OLD session's cwd
  (the "Kaggle_files" folder) — for a session opened in THIS folder,
  just create/use a normal launch config here.

### Page structure (index.astro, top to bottom)
1. `DotGridHero` — cursor-reactive ink dot grid (orange bloom near pointer)
2. `WorkCatalogue` — project card grid from the content collection
3. `SvgMorphMotif` — self-drawing wireframe morphing star→hex→burst→cell
4. `FlowField` — slow orange particle drift over 3D simplex noise
5. `ParametricPlayground` — Tweakpane sliders driving a live Lloyd/Voronoi
   solver (lazy-inits ~44ms solve on approach)
6. `AboutContact` — about + contact sections
Plus `SiteNav`/`SiteFooter` via `layouts/Base.astro`; detail pages at
`/work/[slug]`.

### What is placeholder (owner must replace)
- All three projects in `src/content/projects/` (text + SVG covers marked
  "PLACEHOLDER — REPLACE WITH YOUR IMAGE")
- About paragraphs + portrait in `AboutContact.astro` (marked
  `[Placeholder — replace.]`)
- og:image intentionally absent in `Base.astro` (needs a raster asset)
- Owner's real name/email ARE live in nav/footer/contact (deliberate,
  logged assumption — confirm the owner is happy with it)

## House conventions (follow these exactly)

1. **Explicit types, no `var`-style shortcuts; comments explain *why*.**
   Owner's global CLAUDE.md also asks for explicit type names over `var`
   in C# — the spirit carries here.
2. **Reduced motion is a hard JS gate** in every scene: check
   `prefersReducedMotion()` (lib/reduced-motion.ts), stop the loop, draw a
   static pose, subscribe to live changes. The CSS blanket rule in
   global.css only covers CSS animations — it cannot reach rAF loops.
3. **TDZ hazard (bitten twice!):** `createResponsiveCanvas`'s resize
   callback fires SYNCHRONOUSLY during construction. Any state it reads
   must be declared BEFORE the `createResponsiveCanvas(...)` call.
   (TDZ = temporal dead zone: reading a `let`/`const` binding before its
   declaration has executed throws a ReferenceError at runtime — and the
   synchronous callback does exactly that if the state is declared below
   the call.)
4. **Non-null re-bind pattern:** TS narrowing doesn't flow into hoisted
   functions — after a null guard, re-bind (`const el: T = maybeEl;`) and
   use the re-bound name inside closures (see canvas.ts,
   ParametricPlayground).
5. **Deterministic artwork:** seeded PRNG (`mulberry32` in lib/lloyd.ts —
   a tiny fast seeded random-number generator, so the same seed always
   yields the same artwork),
   never bare `Math.random()` for signature visuals. Side benefit: pixel
   counts are stable, so a canvas pixel-count probe doubles as a
   regression test.
6. **Canvas palettes are hardcoded channel arrays** (canvas can't read CSS
   vars per frame). Theme tokens live in `src/styles/global.css`; if they
   change, grep components for `26, 25, 23` / `212, 98, 58` /
   `251, 250, 248`. **FlowField's `FADE` must always equal `--color-bg`**
   or trails ghost a tint.
7. **rAF loops**: always via `lib/loop.ts` (delta-time, clamped), always
   gated by viewport presence (`lib/visibility.ts`) so offscreen scenes
   cost zero CPU.
8. **Verification is non-negotiable:** after changes run
   `npx astro check` + `npm run build`, and verify behavior in the browser
   preview (screenshots, DOM/pixel probes) — "it compiles" is not proof.
   Known harness quirk: the preview throttles rAF to ~1 tick/300ms, so
   continuous animation can't be frame-verified there; use pixel-accretion
   or state probes instead, and note the caveat honestly.
9. **Content collection changes** (`src/content.config.ts`) require a dev
   server restart — HMR won't pick them up (bitten once).

## Working style the owner expects

- **Sweep-then-fix rhythm:** after building a feature, the owner runs
  `/sweep` (a custom Claude Code skill from the owner's workshop setup,
  not a built-in: multi-angle review with cheap-model subagents: correctness /
  completeness / clarity / risk), expects a synthesized punch list
  (fix now / fix later / not a problem), approves, then fixes are applied
  with re-verification. Several "bugs" from review agents were FALSE
  POSITIVES — always independently verify a claimed bug against the code
  (twice this saved wasted work: a "resize race" that couldn't happen; an
  overstated matchMedia-support risk).
- **Proof over claims** (workshop rule 3): show test output, screenshots,
  pixel counts, grep results — never bare "done."
- **Numbered-build night loop** exists in the owner's workshop folder
  (HOW_TO_WORK.md/WHICH_LEVER.md in the old cwd); `night-run/` here is the
  complete record of the one executed overnight queue.

## What's next (in rough priority)

1. **Owner morning review items** (from night_summary.md): eyeball the
   light theme's canvas contrast; test OS reduced-motion toggle once;
   confirm real name/email in chrome; replace placeholders per
   `HOW_TO_ADD_A_PROJECT.md` (repo root).
2. **First real project content** — the highest-value next session.
3. **og:image + deploy prep** — deploy itself only with the owner present.
4. **Skills roadmap remainder** (if the learning track resumes — see
   `01_skills_roadmap.md`): I2/I3 (cursor magnetics + custom cursor),
   I6 (page transitions), A1 (GLSL), A2/A3 (three.js + slider-driven
   parametric geometry centerpiece — the flagship), A4 (post-processing),
   A5 (perf tiering; partially done via device-tier.ts + visibility.ts).

## Key files map

- `src/lib/` — loop.ts (rAF), easing.ts (lerp/smoothstep/structuralSag*),
  canvas.ts (DPI-correct), reduced-motion.ts, visibility.ts
  (IntersectionObserver), lloyd.ts (seeded Voronoi relaxation solver),
  device-tier.ts (particle budgets). *structuralSag currently has no
  consumer (its demo was removed) — kept as the house easing curve.
- `src/components/` — the five scenes + WorkCatalogue, SiteNav,
  SiteFooter, AboutContact
- `src/content/projects/` + `src/content.config.ts` — the catalogue
- `src/pages/` — index.astro, work/[slug].astro; `src/layouts/Base.astro`
- `src/types/flubber.d.ts` — hand-written types for the flubber morphing
  lib (only `interpolate` declared, deliberately)
- Root: `CLAUDE.md` (project guide), `HOW_TO_ADD_A_PROJECT.md` (owner
  docs), this folder.
