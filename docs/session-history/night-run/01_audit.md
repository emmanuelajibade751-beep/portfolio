# Job 01 — Portfolio-readiness audit

## Project
`C:/Users/Emman/Downloads/computational-design-portfolio` — an Astro 7 site,
currently a dark-themed showcase of five animated sections (see
`src/pages/index.astro`): DotGridHero (cursor-reactive canvas), a motion-
primitives SVG demo, SvgMorphMotif (self-drawing/morphing wireframe),
FlowField (particle canvas), VoronoiScrub (GSAP pinned scroll-scrub), and
ParametricPlayground (Tweakpane sliders driving a Voronoi solver). Shared
libs in `src/lib/` (canvas, loop, easing, reduced-motion, lloyd, device-tier).

## Task
Read every file under `src/` and audit the site against this brief: "a
professional portfolio where the owner (a computational/parametric designer)
uploads real project content; interactive and interesting but not extreme or
distracting; dominant white background with the existing orange
(#d4623a-family) + black as accents."

Produce a findings list covering at least:
- What blocks real portfolio content today (no nav, no project pages, no
  catalogue, placeholder copy, default favicon/meta, anything else found).
- Which animations read as "extreme/distracting" vs "accent" (the pinned
  scroll-hijack section is a known suspect; judge the rest).
- Everything hardcoded to the dark theme that a white retheme must touch
  (CSS custom properties in `src/styles/global.css`, but also every
  hardcoded rgba()/hex in component `<style>` blocks and in canvas drawing
  code — FlowField's trail-fade veil color is bg-dependent; Tweakpane ships
  a dark default theme).
- Accessibility/perf debts worth fixing tonight (known: two ~44ms synchronous
  Lloyd precomputes at load; rAF loops never stopped on navigation).

## Done when
- `builds/01_audit.log.md` exists listing findings grouped as: blockers /
  retheme touchpoints / dial-back candidates / debts, each with file paths.
- No code changes in this job.
