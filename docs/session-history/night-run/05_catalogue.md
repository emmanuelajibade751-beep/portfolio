# Job 05 — Project catalogue (drop-in content, no code edits to add work)

## Project
`C:/Users/Emman/Downloads/computational-design-portfolio`. Read prior logs
in `builds/` first.

## Task
Add the portfolio's core: a catalogue the owner updates by dropping files in
a folder — no code changes per project.
1. Use Astro content collections: define a `projects` collection
   (`src/content.config.ts`, glob loader) with frontmatter: `title`,
   `description`, `date`, `tags` (string array), `cover` (image), optional
   `tools` (e.g. Rhino/Grasshopper), optional `order`.
2. Each project = one folder or one `.md` under `src/content/projects/`
   with its cover image alongside; body text = the project write-up.
3. Render a "Work" catalogue section on the index page: responsive card
   grid (cover, title, one-line description, tags), sorted by
   `order`/`date`. Cards link to a detail page per project
   (`src/pages/work/[slug].astro`) rendering the full write-up — keep the
   detail template simple and clean.
4. Seed THREE placeholder projects with distinct placeholder covers
   (generate simple SVG/PNG placeholders — e.g. parametric-looking line art
   — do not fetch external images) and obviously-replaceable copy like
   "Replace with your facade study."
5. Write `HOW_TO_ADD_A_PROJECT.md` in the project root: the exact
   drop-a-folder steps, frontmatter template to copy-paste, image size
   guidance. Assume the owner is not a web developer.
6. Style consistently with the new light theme (job 03).

## Done when
- `astro check` + `npm run build` pass.
- Adding a test 4th project folder and rebuilding makes a 4th card appear
  with zero code edits — do this as the proof, then delete the test project
  and note it in the log.
- 3 placeholder cards render on the index; each opens its detail page.
- `HOW_TO_ADD_A_PROJECT.md` exists.
- `builds/05_catalogue.log.md` written.
