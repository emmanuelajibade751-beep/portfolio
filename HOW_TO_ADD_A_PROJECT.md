# How to add a project (no coding needed)

Every project on the site is one text file plus one cover image in
`src/content/projects/`. Adding work is a file drop — the section grid, the
detail page, and the sorting all update automatically on the next build.

The site has four areas. A project's `discipline` decides which section it
appears in and what its web address is:

| `discipline` | Section page | Project URL |
|---|---|---|
| `design` | `/design/` | `/design/your-slug/` |
| `structural` | `/structural/` | `/structural/your-slug/` |
| `ai` | `/ai/` | `/ai/your-slug/` |

Research papers are separate — see "Adding research" below.

## Steps

1. **Copy an existing project file** in `src/content/projects/` (e.g.
   `facade-study.md`) and rename it — the file name becomes the slug in the
   web address. Use lowercase and hyphens, no spaces.

2. **Drop your cover image in the same folder** (JPG/PNG/SVG all fine —
   roughly 1200×800px or any 3:2-ish landscape works well).

3. **Edit the block at the top of your .md file** between the `---` lines:

   ```yaml
   ---
   title: "Your Project Name"
   description: "One sentence shown on the card in the grid."
   date: 2026-03-01
   tags: ["facade", "panelization"]     # short labels on the card
   tools: ["Rhino", "Grasshopper"]      # shown on the detail page
   cover: "./your-cover-image.jpg"      # the file from step 2
   discipline: "design"                 # REQUIRED: design | structural | ai
   featured: true                       # optional: show on the landing page
   order: 1                             # optional: lower = earlier in grid
   ---
   ```

   `discipline` is the only new required field. `featured: true` pulls the
   project into the "Featured" row on the home page (pick your best 3–4
   across all disciplines); leave it off otherwise.

4. **Write the project story below the second `---`** in plain text /
   Markdown. Add more images by dropping them in the same folder and
   writing `![caption](./image-name.jpg)` on its own line.

5. **Rebuild** (`npm run build`) or just refresh if the dev server
   (`npm run dev`) is running — the new card appears in its section grid.
   Note: if you changed `discipline` on an existing file, restart the dev
   server (schema-adjacent changes aren't always hot-reloaded).

## The X-ray toggle (design ↔ structure pairs)

If one building has both a design write-up and a structural write-up, you can
link them so visitors flip between the two lenses with a toggle:

- In the **design** file, add: `structuralPair: "structural-slug"`
- In the **structural** file, add: `designPair: "design-slug"`

Each slug is the other file's name without `.md`. The build fails on purpose
if a paired slug doesn't exist, so a typo can't ship a dead toggle.

## Adding research

Research lives in `src/content/research/` (one `.md` per publication) and
shows on `/research/` as a citation-style list — no cover image needed.

```yaml
---
title: "Your Paper Title"
abstract: "One paragraph shown on the list and detail pages."
date: 2025-06-01
venue: "Journal or Conference Name"
authors: ["Sunday Emmanuel Ajibade", "Co-Author"]
pdfUrl: "/papers/your-paper.pdf"   # optional: put the PDF in public/papers/
tags: ["urban", "thermal"]
order: 1                            # optional
---

Optional extended write-up (methodology, figures) for the detail page.
```

## Removing or reordering

- Delete a project's `.md` (and its images) to remove it.
- Set `order:` numbers to pin the sequence; entries without `order` sort by
  date, newest first, after the ordered ones.

## The starter placeholders

`facade-study.md` and `generative-massing.md` (design), `canopy-structure.md`
(structural), and `research/lagos-urban-study.md` are templates with
placeholder art and text — replace them with real work, or delete them once
your own is in.
