# The Skills Roadmap (original plan, with status)

The session began with this deliverable: a build roadmap of interactive-
animation skills for a computational-design portfolio (reference for
structure/tone: archi-tech.network — dark modular sections, icon
categories; animation layer meant to go far beyond it). Reproduced here
with per-skill STATUS so a fresh session knows exactly where the track
stands. The site has since been converted to a LIGHT professional theme —
the roadmap's skills still apply.

## Foundational

- **F1 CSS custom properties as animation bus** — shared animated values
  (`@property`-registered). STATUS: DONE (global.css; the demo that
  exercised --rotation was later removed as planned content pruning).
- **F2 Reduced-motion architecture** — built first, not last; live
  matchMedia listener + static poses. STATUS: DONE (lib/reduced-motion.ts,
  every scene).
- **F3 rAF + delta-time loop** — refresh-rate-independent motion.
  STATUS: DONE (lib/loop.ts, with backgrounded-tab clamp).
- **F4 Parametric easing math** — lerp/smoothstep + one signature curve
  ("structuralSag": slow load, quick release, small overshoot).
  STATUS: DONE (lib/easing.ts; sag currently unconsumed, kept as house curve).
- **F5 Canvas2D fundamentals** — DPI-correct sizing (devicePixelRatio,
  capped 2x), ResizeObserver. STATUS: DONE (lib/canvas.ts + DotGridHero).
- **F6 SVG path anatomy & line-drawing** — stroke-dash self-drawing with
  measured getTotalLength(). STATUS: DONE (SvgMorphMotif entrance).

## Intermediate

- **I1 Scroll-scrubbed timelines (GSAP + ScrollTrigger)** — scroll position
  scrubs a precomputed Lloyd-relaxation timeline, pinned section.
  STATUS: BUILT, then deliberately REMOVED in the night conversion (owner
  asked to drop one Voronoi section; the pinned scroll-hijack was the most
  "extreme" element). gsap uninstalled. The skill was learned; the code
  lives in git history (`git show 5da3337:src/components/VoronoiScrub.astro`).
- **I2 Cursor-reactive / magnetic elements** — STATUS: PARTIAL (the hero
  dot grid is cursor-reactive with eased attractor + smoothstep falloff;
  magnetic nav/typography not built).
- **I3 Custom cursor system** — STATUS: NOT BUILT.
- **I4 Canvas2D procedural fields** — simplex-noise flow field, particles,
  trails, device-tier particle budget. STATUS: DONE (FlowField +
  device-tier.ts; toned down for the portfolio).
- **I5 SVG path morphing** — Flubber between parametric generators
  (star/ngon/burst/irregular cell). STATUS: DONE (SvgMorphMotif).
- **I6 Page transition choreography** — View Transitions API.
  STATUS: NOT BUILT (natural next since /work/[slug] pages now exist).
- **I7 Live parameter controls** — Tweakpane bound to the same state
  driving the visual; expensive params rebuild on ev.last (release),
  cheap params live. STATUS: DONE (ParametricPlayground + lib/lloyd.ts).

## Advanced

- **A1 GLSL shader fundamentals** — STATUS: NOT BUILT.
- **A2 Three.js / r3f scene fundamentals** — STATUS: NOT BUILT.
- **A3 Interactive parametric geometry (slider-driven BufferGeometry
  regeneration)** — the intended flagship centerpiece. STATUS: NOT BUILT
  (I7 was its designed prerequisite and is done).
- **A4 Post-processing / displacement effects** — STATUS: NOT BUILT.
- **A5 Performance-tiered rendering** — STATUS: PARTIAL (device-tier.ts
  measured-capability budgets; no dynamic-resolution or image-sequence
  fallbacks yet).
- **A6 Lazy-loading heavy scenes** — STATUS: DONE in spirit
  (lib/visibility.ts: IntersectionObserver lazy-init + offscreen loop
  gating; formal code-splitting via dynamic import() not needed at current
  bundle size).

## Original build order (for the record)
F2 → F1 → F3 → F4 → F5/F6 → I1 → I2 → I3 → I4 → I5 → I7 → A1 → A2 → A3 →
A4 → I6 → A5 → A6.
Actual path taken: F1–F4 (skeleton) → F5 → I4 → F6+I5 → I1 → I7 → night
conversion (which removed I1's artifact and delivered A6-equivalent).

## Framework decision (made at the start, still holds)
Astro with islands; plain TS in component scripts so far (no React).
r3f/three.js recommended when A2/A3 begin. Rationale: mostly-static
content with a few heavy interactive centerpieces; hydrate only what
needs it.
