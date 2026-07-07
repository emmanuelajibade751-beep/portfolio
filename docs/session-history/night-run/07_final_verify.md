# Job 07 — Final verification pass + docs

## Project
`C:/Users/Emman/Downloads/computational-design-portfolio`. Read ALL prior
logs in `builds/` first — this job assumes jobs 02–06 landed.

## Task
1. Pay down the cheap perf/a11y debts flagged in the audit where low-risk:
   - Lazy-init the below-fold heavy scenes (FlowField, ParametricPlayground)
     via IntersectionObserver so their solvers/loops start only when near
     the viewport; reserve layout space so nothing shifts.
   - Stop rAF loops when their canvas scrolls far out of view (same
     observer), so an idle tab isn't burning CPU on unseen sections.
   - Skip anything that turns risky — log what was skipped and why.
2. Full verification sweep:
   - `npx astro check` → 0 errors.
   - `npm run build` → clean production build; `npm run preview` serves it.
   - Probe/screenshot every section at desktop AND mobile viewport widths
     on the light theme.
   - Reduced-motion check: with the preference emulated/forced, confirm
     every scene shows its static pose and no loop runs.
   - Console: zero errors on load and after interacting with the playground
     sliders and nav.
3. Update the project's `CLAUDE.md` (in the portfolio repo): current state,
   theme tokens, how the catalogue works, what's placeholder awaiting real
   content, remaining roadmap items (I2/I3, I6, A-tier skills).
4. Commit everything in the portfolio repo as one or more clean commits
   (repo was initialized at plan time; a pre-night checkpoint commit
   exists). Do NOT push anywhere.

## Done when
- Build + check + preview all pass; evidence quoted in the log.
- Screenshot/probe evidence per section, both viewports, both motion modes.
- Portfolio `CLAUDE.md` updated; work committed locally.
- `builds/07_final_verify.log.md` written — including a short "what the
  owner should review by eye in the morning" list.
