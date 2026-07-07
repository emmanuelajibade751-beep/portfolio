# How to add a project (no coding needed)

Every project on the site is one text file plus one cover image in
`src/content/projects/`. Adding work is a file drop — the grid, the detail
page, and the sorting all update automatically on the next build.

## Steps

1. **Copy an existing project file** in `src/content/projects/` (e.g.
   `facade-study.md`) and rename it — the file name becomes the web address
   (`my-tower.md` → `yoursite.com/work/my-tower/`). Use lowercase and
   hyphens, no spaces.

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
   order: 1                             # optional: lower = earlier in grid
   ---
   ```

4. **Write the project story below the second `---`** in plain text /
   Markdown. Add more images by dropping them in the same folder and
   writing `![caption](./image-name.jpg)` on its own line.

5. **Rebuild** (`npm run build`) or just refresh if the dev server
   (`npm run dev`) is running — the new card appears in the grid.

## Removing or reordering

- Delete a project's `.md` (and its images) to remove it.
- Set `order:` numbers to pin the sequence; projects without `order` sort
  by date, newest first, after the ordered ones.

## The three placeholders

`facade-study.md`, `canopy-structure.md`, and `generative-massing.md` are
templates with placeholder art — replace their text and covers with real
projects, or delete them once your own work is in.
