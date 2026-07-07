# Job 03 log — Light theme landed

## Palette (src/styles/global.css)
- `--color-bg` #0a0a0c → **#fbfaf8** (warm white)
- `--color-fg` #e8e6e0 → **#1a1917** (warm near-black ink)
- `--color-accent` **#d4623a kept** (graphics/large type only)
- NEW `--color-accent-deep` #a84a28 — small accent text; #d4623a is ~3.3:1
  on the new bg (fails WCAG body-size), the deep variant clears 4.5:1
- NEW `--color-ink-soft` rgba(26,25,23,0.66) — captions (~5:1)
- `--color-grid-line` → rgba(26,25,23,0.1)

## Typography (owner addendum from /night-exec args — decision logged)
Instruction: "use some of the Minecraft effect on archi-tech network
fonts… decide what's best." **Decision: technical monospace accent, not a
pixel font.** NEW `--font-mono` (system mono stack: ui-monospace / Cascadia
/ JetBrains / Consolas), applied to the hero eyebrow and status text now,
and intended for nav/labels in job 06. Rationale: a literal pixel/Minecraft
font at UI sizes fights legibility and the explicit "white = professional"
brief; uppercase+letterspaced mono delivers the same terminal/blueprint
flavor archi-tech has, with zero webfont dependency. Tweakpane already
renders its panel in mono, which now reads as intentional.

## Per-file
- `DotGridHero.astro` — FG dots [232,230,224]→[26,25,23]; alpha ramp
  0.12–0.9 → 0.14–0.85 (ink needs less peak alpha on white); eyebrow →
  mono + accent-deep; lede → ink-soft.
- `FlowField.astro` — `FADE` veil → rgba(251,250,248,0.06) **bg-matched**
  (comment added: must track --color-bg or trails ghost a tint); caption →
  ink-soft. Orange strokes kept (contrast fine on white; intensity is
  job 04's business).
- `SvgMorphMotif.astro` — stroke already var(--color-accent), untouched;
  caption → ink-soft.
- `ParametricPlayground.astro` — Voronoi cell strokes white→ink
  rgba(26,25,23,0.35); seeds stay orange; caption → ink-soft; **Tweakpane
  reskinned light** via ~20 `--tp-*` custom properties on the pane host
  (inheritance carries them into Tweakpane's runtime DOM; no :global
  needed) — white panel, ink labels, orange buttons/knobs.
- `index.astro` — motion-demo status → mono + ink-soft.

## Proof
- `grep -rn "232, 230, 224|10, 10, 12|#0a0a0c|#e8e6e0" src/` → no matches.
- `astro check` → 0 errors.
- Screenshots after reload: hero (white bg, ink grid, mono eyebrow) and
  flow+playground (orange trails clean on white — veil match confirmed, no
  ghosting; Tweakpane renders light with orange accents; Voronoi = ink
  lines + orange seeds). No console errors.

## Contrast judgment calls
- Body/headline ink on warm white ≈ 15:1. Captions (ink-soft) ≈ 5:1.
  Eyebrow small-caps use accent-deep ≈ 4.6:1. Canvas art intentionally
  subtle (decorative, aria-hidden) — not held to text contrast.

## Scope check
git status before commit: exactly the six files named by the job
(global.css + 4 components + index.astro). No creep.
