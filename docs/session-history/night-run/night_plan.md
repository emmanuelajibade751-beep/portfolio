# Night Plan — Portfolio-ready site (white theme, one Voronoi, catalogue)

Goal: convert the animation-demo page at
`C:/Users/Emman/Downloads/computational-design-portfolio` into a
professional, ready-to-review portfolio: dominant white background with
orange/black accents, calmer motion, the pinned Voronoi scroll section
removed (playground kept), a drop-in project catalogue, and real site
chrome — verified end to end.

1. builds/01_audit.md — read-only portfolio-readiness audit; findings log feeds all later jobs
2. builds/02_remove_voronoi_scrub.md — delete VoronoiScrub + unused gsap dep (decision pre-made: keep ParametricPlayground)
3. builds/03_retheme_white.md — light theme across CSS vars, component styles, canvas palettes, Tweakpane skin
4. builds/04_dial_back_motion.md — tune motion constants to "accent, not spectacle"; judge the motion-demo section
5. builds/05_catalogue.md — content-collection catalogue + 3 placeholders + HOW_TO_ADD_A_PROJECT.md
6. builds/06_site_chrome.md — nav/footer/about/contact, meta+OG, compass-star favicon, shared layout
7. builds/07_final_verify.md — lazy-init/perf debts where safe, full check/build/screenshot/reduced-motion sweep, update docs, local commits

## Safety notes (queue level)
- This queue intentionally leaves the site materially different (retheme +
  section removal) — per the owner's explicit brief. Rollback point: the
  pre-night git checkpoint commit made at plan time.
- Deleting VoronoiScrub.astro and `npm rm gsap` are the only destructive
  steps; both are cheap to reverse from the checkpoint.
- Nothing is deployed, pushed, sent, or purchased anywhere in this queue.
  All commits stay local.
