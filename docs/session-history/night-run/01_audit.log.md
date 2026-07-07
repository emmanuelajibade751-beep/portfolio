# Job 01 log — Portfolio-readiness audit

Read-only pass over `computational-design-portfolio` at checkpoint `5da3337`
(tree verified clean). No code changed.

## Blockers (site cannot host real portfolio content today)
- **No content model at all** — no catalogue, no project pages, no way to
  add work without editing source. `src/pages/index.astro` is the only page.
- **No navigation, header, or footer** — the page is an unbroken scroll of
  demos with no wayfinding, identity, or contact route.
- **No shared layout** — `<head>` lives inline in `index.astro`; any second
  page would duplicate it. Blocks job 05's detail pages cleanly reusing meta.
- **Placeholder identity** — hero copy is thematic but generic; no name, no
  about, no contact anywhere. Default Astro favicon (`public/favicon.svg`,
  `public/favicon.ico`). `<title>` is "Computational Design Portfolio", no
  meta description, no Open Graph tags.
- **Repo docs describe a learning scaffold** — `CLAUDE.md`/`README.md` are
  Astro scaffold text, not the site (fix queued in job 07).

## Retheme touchpoints (dark → white), exhaustive
- `src/styles/global.css:24-27` — `--color-bg: #0a0a0c`, `--color-fg:
  #e8e6e0`, `--color-accent: #d4623a` (KEEP), `--color-grid-line:
  rgba(232,230,224,0.08)` (invert).
- `DotGridHero.astro` — JS palette constants `FG = [232,230,224]`,
  `ACCENT = [212,98,58]` (line ~46); dot alpha ramp 0.12→0.9 tuned for dark
  (on white, light-grey dots at 0.12 will vanish — needs dark-ink dots);
  caption `rgba(232,230,224,0.7)` (line 200).
- `FlowField.astro:38` — `FADE = "rgba(10,10,12,0.06)"` is **bg-matched**:
  the trail effect breaks visibly unless this becomes the new bg color.
  Stroke colors lines 100/132; caption line 198; `border-top` uses
  `--color-grid-line`.
- `ParametricPlayground.astro:114` — cell strokes `rgba(232,230,224,0.3)`
  = white-on-white after retheme (invisible); seeds line 121; caption 215.
  **Tweakpane ships a dark default theme** — needs `--tp-*` CSS custom
  properties set for a light panel.
- `SvgMorphMotif.astro` — stroke already `var(--color-accent)` (survives);
  caption line 222.
- `VoronoiScrub.astro` lines 118/124/195 — moot if job 02 removes it first
  (queue order handles this).
- `index.astro:124` — motion-demo status text `rgba(232,230,224,0.45)`.

## Dial-back candidates (most → least aggressive)
1. **VoronoiScrub** — pins the viewport and hijacks 1600px of scroll; the
   single most "extreme" behavior. (Being removed in job 02.)
2. **FlowField** — hundreds of particles in constant motion with trails;
   loudest remaining element. Candidates: particle tiers (220/600/1200),
   `SPEED 42`, stroke alpha 0.5.
3. **SvgMorphMotif** — morphs every ~2.5s continuously (`MORPH 1.4 +
   HOLD 1.1`); frequent enough to pull the eye. Lengthen HOLD.
4. **Motion-primitives demo section** (`index.astro`) — a learning artifact
   with self-referential copy ("F1–F4 skeleton") that oscillates forever.
   Recommend REMOVAL in job 04, salvaging the 4-point star for the
   favicon (job 06). Note: its script is what calls
   `syncReducedMotionAttribute()` — if removed, either drop the
   `[data-motion]` CSS hook too (only the demo uses it) or move the call
   into the shared layout. Log whichever is done.
5. **DotGridHero** — quiet at rest, moderate bloom (`INFLUENCE 150`,
   `MAX_RADIUS 3.6`); smallest adjustment needed.

## Debts (perf / a11y)
- Two ~44ms synchronous Lloyd precomputes at module eval (VoronoiScrub +
  ParametricPlayground); job 02 removes one, job 07 lazy-inits the other.
- rAF loops (DotGridHero, SvgMorphMotif, FlowField) run forever, even
  offscreen; no IntersectionObserver gating anywhere (job 07).
- The blanket `prefers-reduced-motion` CSS rule in global.css only affects
  CSS animations — every canvas scene's real gate is the JS `matchMedia`
  path (which all scenes implement correctly). Fine, but worth stating in
  docs (job 07).
- ParametricPlayground pane already has `role="group"` + `aria-label`; all
  canvases correctly `aria-hidden` with real text alternatives adjacent.

## Note for job 03 (arrived at exec time, queue-level instruction)
Owner addendum via /night-exec args: "use some of the Minecraft effect on
archi-tech network fonts… decide what's best." Typography decision is
delegated — handle in job 03 and log the reasoning.
