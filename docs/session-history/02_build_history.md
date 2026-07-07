# Build History — chronological, with decisions and bugs

How the codebase got to its current state, in order. Each phase ends with
the sweep findings that were applied. (The owner's workflow: build →
`/sweep` multi-angle review → synthesized punch list → approved fixes →
re-verify.)

## Phase 1 — F1–F4 skeleton (dark-theme era)
Astro scaffolded (`--no-git` initially; git added at night-plan time).
Built: CSS var bus with `@property` (global.css), reduced-motion module,
delta-time rAF loop, `structuralSag` easing; demo section wiring them
(later removed in the conversion).
Sweep applied: comments for the easing derivation, ping-pong math, and
`@property` rationale. Sweep deferred-then-resolved: SSR-unsafe
module-level `matchMedia` (safe in Astro client scripts), rAF cleanup on
navigation (resolved later by visibility gating).

## Phase 2 — F5 + I4 (dot grid, flow field)
Built: lib/canvas.ts (DPI-correct, MAX_DPR 2), DotGridHero (smoothstep
attractor falloff, eased influence point, `(pointer: fine)` gate),
device-tier.ts (cores+memory+pointer → particle budget), FlowField
(3D simplex noise, dt-scaled advection, translucent-veil trails, static
vector-field pose for reduced motion).
**Real bug caught by verification, not review:** both canvases rendered
NOTHING at first — the `createResponsiveCanvas` resize callback fires
synchronously and hit TDZ on bindings declared after the call. Fixed by
keeping size in locals declared first. This is house convention #3.
Also: `astro check` caught a null-narrowing issue in canvas.ts → the
non-null re-bind pattern (convention #4) was born. `check` script added.

## Phase 3 — F6 + I5 (morph motif)
Built: SvgMorphMotif — parametric shape generators (ngon/star/cell),
Flubber morphing with `maxSegmentLength: 3` (solves mismatched-point
morphing), stroke-dash self-drawing entrance with measured length, morph
cycle (MORPH/HOLD timing). Hand-written `flubber.d.ts` (only
`interpolate`). Sweep applied: boolean `entranceInit` flag instead of
fragile `getAttribute("d")` string compare (browser normalization),
cached `getTotalLength()`, non-null re-bind. Sweep false-positive worth
remembering: an agent talked itself into a phase-wrap index bug that the
math precludes.

## Phase 4 — I1 (VoronoiScrub — later removed)
Built: GSAP ScrollTrigger pinned scrub of a precomputed Lloyd-relaxation
timeline (mulberry32-seeded, shoelace centroids), `gsap.matchMedia` for
reduced motion, per-point scaling for uniform stroke width. Measured:
precompute 44ms, per-scrub-update 0.185ms (review agents had overestimated
20×; measurement settled it). Sweep applied: zero-size render guard,
centroid divisor comment, pin comments. REMOVED in night job 02 (owner's
"remove one Voronoi logic"; the pin was the most aggressive behavior).
Recoverable: `git show 5da3337:src/components/VoronoiScrub.astro`.

## Phase 5 — I7 (ParametricPlayground)
Solver extracted to lib/lloyd.ts (shared with VoronoiScrub while it
lived). Tweakpane v4 panel: cells/seed rebuild on `ev.last` (release);
relax/showSeeds live per input (~0.2ms). Gotcha: tweakpane's types
re-export from `@tweakpane/core` — must be installed as devDependency or
`addBinding` doesn't typecheck. Sweep: rejected a claimed mid-drag/resize
race (render() never reads params.cells; scratch+snapshots stay
consistent); applied epsilon-clamp comment, render() cross-refs,
`role="group"`/aria-label on the pane host.

## Phase 6 — Night conversion (7-job unattended queue)
Owner brief: professional portfolio, white bg with orange/black accents,
remove one Voronoi, calmer motion, drop-in catalogue, "consider everything
else"; exec-time addendum: "Minecraft effect on archi-tech network
fonts... decide what's best" → resolved as blueprint-MONOSPACE accent
(--font-mono, eyebrows/labels/nav), explicitly NOT a pixel font.
Jobs (full logs in `night-run/`):
1. Audit (read-only findings).
2. VoronoiScrub + gsap removed.
3. Retheme: #fbfaf8 bg / #1a1917 ink / #d4623a accent + #a84a28
   accent-deep (WCAG for small text) / --color-ink-soft; canvas palettes
   re-channeled; FlowField FADE re-matched to bg (critical coupling);
   Tweakpane reskinned via ~20 --tp-* vars inherited through the host div.
4. Motion dialed down (particles 140/380/700, SPEED 26, HOLD 3.2 etc.);
   learning-demo section removed (star salvaged as favicon).
5. Catalogue: content collection (glob loader, image() schema), 3
   placeholder projects with hand-drawn SVG covers, /work/[slug] pages,
   WorkCatalogue grid, HOW_TO_ADD_A_PROJECT.md. Drop-in proven with a
   temp 4th project (added → 5 pages → removed). Gotcha: content.config.ts
   changes need a dev-server RESTART.
6. Chrome: Base layout (meta/OG, no og:image yet), SiteNav/SiteFooter/
   AboutContact, compass-star favicon (default .ico deleted). Assumption:
   owner's real name/email placed live.
7. visibility.ts lazy-init + offscreen loop gating everywhere;
   ParametricPlayground defers its 44ms solve (verified: pane empty at
   top, initializes on approach); dead CSS removed; `z` import moved to
   astro/zod; CLAUDE.md rewritten; final state 0 errors/0 warnings/0 hints.

## Verification habits that paid off
- Pixel-count probes on deterministic (seeded) canvases as regression
  checks (identical counts across refactors = no behavioral drift).
- Preview harness throttles rAF (~1 tick/300ms): verify continuous
  animation via trail accretion, state probes, or forced-paint
  screenshots; say so honestly in reports.
- Measure before optimizing (the 44ms/0.185ms measurements killed two
  "MEDIUM" review risks).
- Review-agent findings are leads, not verdicts — three were rejected on
  independent verification across the session.
