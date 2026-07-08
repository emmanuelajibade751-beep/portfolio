# Portfolio Restructure Plan

**Author:** Claude (with Emmanuel)
**Date:** 2026-07-08
**Status:** Draft — approved before any code is written

---

## 1. The decision

Pivot the site from a single-discipline "computational design portfolio" to a
multi-disciplinary practice site covering **four areas**:

| Area | What it showcases |
|---|---|
| **Design** | Computational + architectural design (one practice, two lenses) |
| **Structural Detailing** | Connection details, technical drawings, structural systems |
| **Research** | The Lagos research (and future papers/talks) |
| **AI & Tools** | Vibe coding, AI-assisted workflows, Grasshopper plugins |

The site gains separate routes per area, a landing page that reads as a
**practice overview** (not a project dump), and a flagship "X-ray" project
page where visitors toggle between design and structural views of the same
building.

---

## 2. Site map (before vs. after)

### Before

```
/                    Single scrolling page:
                       DotGridHero → WorkCatalogue → SvgMorphMotif →
                       FlowField → ParametricPlayground → AboutContact
/work/[slug]/        Project detail page (3 placeholder .md files)
```

### After

```
/                    Landing page:
                       DotGridHero (trimmed) → PracticeStrip → FeaturedWork →
                       AboutContact (rewritten)

/design/             Design section index (computational + architectural projects)
/design/[slug]/      Standard project detail page
/design/[slug]/      X-ray project detail page (toggle layout — applied per-project
                       via a frontmatter flag, not a separate route pattern)

/structural/         Structural detailing section index
/structural/[slug]/  Structural project detail page (gallery-friendly layout)

/research/           Research section — publication list (not a card grid)
/research/[slug]/    Individual publication page (abstract + PDF link + metadata)

/ai/                 AI & Tools section index
/ai/[slug]/          AI project detail page (reuses the standard project layout)

/cv/                 Static CV/resume page (or just a PDF download link from nav)
```

---

## 3. Content model

### 3a. Existing `projects` collection — extended

**File:** `src/content.config.ts`

The current schema stays, with three new fields:

```ts
const projects = defineCollection({
  loader: glob({ pattern: "*.md", base: "./src/content/projects" }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      date: z.coerce.date(),
      tags: z.array(z.string()).default([]),
      cover: image(),
      tools: z.array(z.string()).default([]),
      order: z.number().optional(),

      // NEW FIELDS:
      discipline: z.enum([
        "design",
        "structural",
        "ai",
      ]),

      // For the X-ray toggle: links a design project to its structural
      // counterpart (by slug). Only set on the "design" side.
      structuralPair: z.string().optional(),

      // Optional: role on the project, client, location — useful for
      // architectural/structural projects.
      role: z.string().optional(),       // e.g. "Lead designer", "Structural detailer"
      client: z.string().optional(),     // e.g. "Studio XYZ"
      location: z.string().optional(),   // e.g. "Lagos, Nigeria"
      status: z.string().optional(),     // e.g. "Built", "Competition", "Ongoing"
    }),
});
```

**Why not separate collections for each discipline?** Projects in "design",
"structural", and "ai" all share the same fundamental shape: title,
description, cover image, date, tags, tools, markdown body. A single
collection with a `discipline` discriminator avoids duplicating the schema,
the loader config, and the detail-page template. Research is the exception —
its shape is fundamentally different (see below).

**Content directory stays flat:** `src/content/projects/`. Each `.md` file
declares its `discipline` in frontmatter. No subfolders needed — the
discriminator does the routing.

### 3b. New `research` collection

**New file set:**
- `src/content/research/` — one `.md` per publication
- Schema added to `src/content.config.ts`

```ts
const research = defineCollection({
  loader: glob({ pattern: "*.md", base: "./src/content/research" }),
  schema: z.object({
    title: z.string(),
    abstract: z.string(),          // shown on the list page
    date: z.coerce.date(),         // publication date
    venue: z.string(),             // journal name or conference
    authors: z.array(z.string()),  // all authors, owner included
    pdfUrl: z.string().optional(), // link to the PDF (external or /public)
    tags: z.array(z.string()).default([]),
    order: z.number().optional(),
  }),
});

export const collections = { projects, research };
```

**Example research entry** (`src/content/research/lagos-urban-study.md`):

```md
---
title: "Urban Morphology and Thermal Comfort in Lagos"
abstract: "A study of... [one paragraph]"
date: 2025-06-01
venue: "Journal of Architecture & Urbanism"
authors: ["Sunday Emmanuel Ajibade", "Co-Author Name"]
pdfUrl: "/papers/lagos-urban-study.pdf"
tags: ["urban", "thermal", "Lagos"]
order: 1
---

[Optional extended markdown body — methodology, key findings, figures.
 The list page shows only title + abstract + venue; the detail page shows
 the full body if present.]
```

---

## 4. Page-by-page build spec

### 4a. Landing page — `/` (`src/pages/index.astro`)

**Layout (top to bottom):**

1. **DotGridHero** — kept, but with updated copy:
   - Eyebrow: `"Architecture · Computation · Research"` (replaces
     `"Computational Design"`)
   - Title: `"Design across methods,` / `built to be felt."` (replaces
     `"Parametric systems, built to be felt."`)
   - Lede: one sentence about working across architecture, structural
     detailing, computation, research, and AI

2. **PracticeStrip** — NEW component. Four clickable tiles in a horizontal
   row, each linking to its section route:

   | Tile | Route | One-liner |
   |---|---|---|
   | Design | /design/ | Computational + architectural design |
   | Structure | /structural/ | Connections, details, buildability |
   | Research | /research/ | Urban studies, publications |
   | AI & Tools | /ai/ | Vibe coding, plugins, workflows |

   Visual: each tile is a bordered card (same `--color-grid-line` border as
   the existing work cards) with the discipline name in mono uppercase and
   the one-liner below. On hover: the house lift + orange border. No images
   — text-only tiles. This is the fastest way to signal breadth.

3. **FeaturedWork** — NEW component. A curated row of 3-4 project cards
   hand-picked across disciplines (not the full grid). Uses the existing
   `work__card` visual style. Projects are selected by an `order` field
   value (e.g., the 3-4 lowest-ordered projects across all disciplines),
   or by a new `featured: true` frontmatter flag.

   Decision: use `featured: z.boolean().default(false)` in the schema.
   Simpler than order-based logic, and explicitly communicates intent.

4. **AboutContact** — rewritten copy (see Section 6 below). Same layout.

**Removed from the landing page:**
- `SvgMorphMotif` — moves to `/design/` section page
- `FlowField` — moves to `/design/` section page
- `ParametricPlayground` — moves to `/design/` section page

These three scenes are beautiful, but they're 100% computational language.
On the landing page they made the site read as "computational playground
with other stuff." On the `/design/` page they're perfectly placed — they
demonstrate the computational thinking that underpins design work.

### 4b. Design section — `/design/` (`src/pages/design/index.astro`)

**Layout:**

1. Section header: "Design" eyebrow, "Computational + Architectural Design"
   title, one-paragraph description of the practice area.

2. Project grid: filtered to `discipline === "design"` projects. Same card
   style as the existing `WorkCatalogue`. Cards link to
   `/design/[slug]/`.

3. **SvgMorphMotif** — the morphing wireframe, now in its natural home.
   Caption contextualised: "One logic, many forms" still works.

4. **FlowField** — the particle drift.

5. **ParametricPlayground** — the Tweakpane Voronoi solver.

These three scenes act as a "methodology" interlude between the work
and the footer — they show *how* design problems are approached, not just
results. They're no longer the first thing anyone sees.

**Detail page:** `src/pages/design/[slug].astro`

Standard project detail layout (same as the current `work/[slug].astro`),
but with one addition: if the project's frontmatter has
`structuralPair: "some-slug"`, the page renders an **X-ray toggle bar**
at the top of the article:

```
[ Design ←→ Structure ]
```

Two buttons. Clicking "Structure" navigates to
`/structural/[structuralPair]/`. The structural detail page has the
reciprocal link back.

**Why navigation instead of client-side tab toggle?** Astro is a static
site generator — both pages are pre-rendered at build time. A client-side
toggle would require either:
- Inlining both discipline's content into one page (doubles page weight,
  confuses the content model), or
- Client-side fetch of the other page's content (adds complexity, breaks
  without JS).

A simple `<a>` navigation between two pre-rendered pages is instant on
static hosting (both pages are in the CDN cache), preserves back-button
behavior, keeps each page's URL shareable, and costs zero client JS. The
toggle bar is just styled navigation links, not a JS widget.

**Alternative considered and available:** if you later want a true
client-side toggle (both views on one page, no navigation), you can
create a special Astro "island" component that fetches both `.md` files'
rendered content at build time and swaps them with a `display: none`
toggle. This is ~30 lines of client JS. We can add this later without
changing the content model — the `structuralPair` field supports both
approaches.

### 4c. Structural section — `/structural/` (`src/pages/structural/index.astro`)

**Layout:**

1. Section header: "Structure" eyebrow, "Structural Detailing" title,
   one-paragraph description.

2. Project grid: filtered to `discipline === "structural"`. Same card style.

**Detail page:** `src/pages/structural/[slug].astro`

Same as the design detail page, but:
- If the project is the structural half of an X-ray pair, show the toggle
  bar with a link back to the design counterpart. (The structural `.md`
  file gets a `designPair: "slug"` field — or we derive it by scanning
  design projects for a matching `structuralPair`.)
- The markdown body is expected to contain technical content: connection
  details, section drawings, load path diagrams. The existing
  `project__body :global(img)` styles already handle inline images well.

**Future enhancement (not in this build):** a multi-image gallery component
for projects with many technical drawings. For now, inline markdown images
are sufficient.

### 4d. Research section — `/research/` (`src/pages/research/index.astro`)

**Layout:**

1. Section header: "Research" eyebrow, "Publications & Studies" title,
   one-paragraph description.

2. **Publication list** — NOT a card grid. Each entry is a row:
   ```
   Title (linked to detail page)
   Authors · Venue · Date
   [Abstract excerpt — first ~200 chars, expandable]
   [PDF] button if pdfUrl exists
   ```

   This is a citation-style list, not a visual grid. Research doesn't have
   cover images, and forcing it into the card layout would look empty.

**Detail page:** `src/pages/research/[slug].astro`

- Title, full author list, venue, date
- Full abstract
- PDF download link (prominent)
- Markdown body (extended write-up, figures, methodology — optional)
- Tags

### 4e. AI & Tools section — `/ai/` (`src/pages/ai/index.astro`)

**Layout:**

1. Section header: "AI & Tools" eyebrow, "Applied Intelligence" title,
   one-paragraph description.

2. Project grid: filtered to `discipline === "ai"`. Same card style.

**Detail page:** `src/pages/ai/[slug].astro`

Standard project detail layout. No special features needed — AI projects
(vibe coding case studies, plugin builds, workflow automations) fit the
existing title → cover → markdown body structure perfectly.

**First entries to create:**
- "Vibe Coding: Building This Portfolio" — the portfolio itself as a case
  study (meta, but compelling)
- Any Grasshopper C# plugins/tools built

### 4f. CV page — `/cv/` (`src/pages/cv.astro`)

A simple static page or just a PDF download link in the nav. Keep it
minimal:
- If the owner has a PDF resume: host it in `/public/cv.pdf`, link directly
- If not: a structured page with education, experience, skills, publications
  (pulling from the research collection)

**Decision deferred:** the owner may prefer one or the other. For now, add
a "CV" link in the nav that points to `/cv/` — the page can start as a
placeholder and be filled in later.

---

## 5. Navigation changes

### Current nav (`SiteNav.astro`)

```
[star] SUNDAY EMMANUEL AJIBADE          Work  About  Contact
```

All three links are anchor-scrolls on the single page (`/#work`, `/#about`,
`/#contact`).

### New nav

```
[star] SUNDAY EMMANUEL AJIBADE    Design  Structure  Research  AI  CV  About  Contact
```

| Link | Href | Notes |
|---|---|---|
| Design | /design/ | Section page |
| Structure | /structural/ | Section page |
| Research | /research/ | Section page |
| AI | /ai/ | Section page |
| CV | /cv/ | Static page or PDF |
| About | /#about | Anchor on landing page |
| Contact | /#contact | Anchor on landing page |

**Mobile consideration:** 7 links may crowd on small screens. Options:
- Collapse into a hamburger menu at `< 640px`
- Group "About" and "Contact" under a single "Info" link
- Drop "CV" into the footer only

**Decision:** add a simple hamburger toggle for mobile. The nav is already
mono-uppercase at 0.8rem — it fits ~5 links at 375px before wrapping.
A hamburger is the clean solution.

---

## 6. Copy changes

### 6a. DotGridHero (`src/components/DotGridHero.astro`)

**Before:**
```
Eyebrow:  Computational Design
Title:    Parametric systems, built to be felt.
Lede:     Facades, structures and generative geometry — explored as live,
          manipulable fields rather than static renders.
```

**After:**
```
Eyebrow:  Architecture · Computation · Research
Title:    Design across methods,
          built to be felt.
Lede:     Architecture, structural detailing, computation and research —
          connected by a hands-on, systems-driven approach.
```

### 6b. AboutContact (`src/components/AboutContact.astro`)

**Before:**
```
About title:    Design systems, not one-off models
About text:     [Placeholder] I'm a computational designer...
Skills:         Rhino, Grasshopper, C# / RhinoCommon, Form-finding,
                Panelization, Optioneering
Contact title:  Have a parametric problem?
Contact text:   [Placeholder] Open to collaborations, facade and structure
                consulting...
```

**After:**
```
About title:    Design across scales, think in systems
About text:     I'm an architect and computational designer connecting
                architectural intent with structural buildability. I work
                across parametric facade systems, structural detailing,
                urban research, and AI-assisted design workflows — moving
                between Grasshopper definitions, connection details, and
                research papers as one integrated practice.
                [Second paragraph — owner to personalise]
Skills:         Architecture, Computational Design, Structural Detailing,
                Rhino / Grasshopper, C# / RhinoCommon, Research, AI / Vibe Coding
Contact title:  Let's work together
Contact text:   Open to collaborations in architectural design, structural
                detailing, computational consultancy, and research
                partnerships.
```

### 6c. SiteFooter (`src/components/SiteFooter.astro`)

**Before:** `Computational designer — Rhino / Grasshopper / C#`

**After:** `Architect · Computational Designer · Researcher`

### 6d. Page title and meta (`Base.astro` via page props)

**Landing page:**
- Title: `"Sunday Emmanuel Ajibade — Architecture, Computation & Research"`
- Description: `"Portfolio of Sunday Emmanuel Ajibade: architectural design,
  computational systems, structural detailing, research, and AI-assisted
  workflows."`

**Section pages** get their own titles:
- `/design/`: `"Design — Sunday Emmanuel Ajibade"`
- `/structural/`: `"Structural Detailing — Sunday Emmanuel Ajibade"`
- `/research/`: `"Research — Sunday Emmanuel Ajibade"`
- `/ai/`: `"AI & Tools — Sunday Emmanuel Ajibade"`

---

## 7. New components to build

| Component | File | Purpose |
|---|---|---|
| **PracticeStrip** | `src/components/PracticeStrip.astro` | Four discipline tiles on the landing page |
| **FeaturedWork** | `src/components/FeaturedWork.astro` | Curated 3-4 project cards on the landing page |
| **SectionHeader** | `src/components/SectionHeader.astro` | Reusable eyebrow + title + description for section index pages |
| **SectionGrid** | `src/components/SectionGrid.astro` | Reusable project card grid (extracted from WorkCatalogue, parameterised by discipline + base path) |
| **PublicationList** | `src/components/PublicationList.astro` | Citation-style list for the research section |
| **XRayToggle** | `src/components/XRayToggle.astro` | The design ←→ structure toggle bar for paired projects |
| **MobileNav** | Inline in `SiteNav.astro` | Hamburger menu for mobile (small addition, not a separate component) |

### Components to modify

| Component | Change |
|---|---|
| **SiteNav** | Add new nav links + mobile hamburger |
| **SiteFooter** | Update role text |
| **DotGridHero** | Update copy only (no structural changes) |
| **AboutContact** | Rewrite copy + update skills list |

### Components unchanged

| Component | Why |
|---|---|
| **SvgMorphMotif** | Moves to `/design/` page — component code untouched |
| **FlowField** | Same — moves to `/design/` page |
| **ParametricPlayground** | Same — moves to `/design/` page |

### Component to delete

| Component | Why |
|---|---|
| **WorkCatalogue** | Replaced by `SectionGrid` (same visual, parameterised) + `FeaturedWork` (landing page subset). The grid CSS moves into `SectionGrid`. |

---

## 8. The X-ray toggle — detailed spec

This is the centrepiece interaction. Here's exactly how it works.

### Content setup

Two `.md` files in `src/content/projects/` — one per lens of the same
physical project:

**`cruciform-tower-design.md`:**
```md
---
title: "Cruciform Tower — Design"
description: "Parametric facade system with attractor-driven panel rotation"
date: 2025-09-01
tags: ["facade", "parametric", "tower"]
tools: ["Rhino", "Grasshopper"]
cover: "./cruciform-tower-design-cover.jpg"
discipline: "design"
structuralPair: "cruciform-tower-structure"
order: 1
---

[Design narrative: massing, facade logic, parametric definition,
 Grasshopper screenshots, render images]
```

**`cruciform-tower-structure.md`:**
```md
---
title: "Cruciform Tower — Structure"
description: "Steel connection details and structural system for the cruciform facade"
date: 2025-09-01
tags: ["connections", "steel", "detailing"]
tools: ["Tekla", "AutoCAD"]
cover: "./cruciform-tower-structure-cover.jpg"
discipline: "structural"
designPair: "cruciform-tower-design"
order: 1
---

[Structural narrative: connection details, load paths, member sizing,
 technical drawings, code references]
```

### Schema addition for the pair link

Add to the project schema:

```ts
designPair: z.string().optional(),  // structural project → its design counterpart
```

### XRayToggle component

**File:** `src/components/XRayToggle.astro`

```astro
---
interface Props {
  currentLens: "design" | "structural";
  designSlug: string;
  structuralSlug: string;
}

const { currentLens, designSlug, structuralSlug } = Astro.props;
---

<nav class="xray" aria-label="Project lens">
  <a
    class:list={["xray__btn", { "xray__btn--active": currentLens === "design" }]}
    href={`/design/${designSlug}/`}
    aria-current={currentLens === "design" ? "page" : undefined}
  >
    Design
  </a>
  <span class="xray__divider" aria-hidden="true">←→</span>
  <a
    class:list={["xray__btn", { "xray__btn--active": currentLens === "structural" }]}
    href={`/structural/${structuralSlug}/`}
    aria-current={currentLens === "structural" ? "page" : undefined}
  >
    Structure
  </a>
</nav>
```

Styling: a slim horizontal bar with two buttons, matching the site's mono
uppercase style. The active lens has the orange accent border-bottom; the
inactive one is muted. Sits between the back-link and the project header
on the detail page.

### How the detail page detects the pair

In `src/pages/design/[slug].astro`:

```ts
// After getting the current project:
const { project } = Astro.props;
const hasPair = !!project.data.structuralPair;
```

If `hasPair`, render `<XRayToggle>` with the slugs. If not, render nothing —
unpaired projects get a normal detail page.

Same logic in `src/pages/structural/[slug].astro`, reading `designPair`.

---

## 9. File tree (after restructure)

```
src/
├── components/
│   ├── AboutContact.astro       # MODIFIED — new copy
│   ├── DotGridHero.astro        # MODIFIED — new copy
│   ├── FeaturedWork.astro       # NEW
│   ├── FlowField.astro          # UNCHANGED
│   ├── MobileNav.astro          # NEW (or inline in SiteNav)
│   ├── ParametricPlayground.astro # UNCHANGED
│   ├── PracticeStrip.astro      # NEW
│   ├── PublicationList.astro    # NEW
│   ├── SectionGrid.astro        # NEW (extracted from WorkCatalogue)
│   ├── SectionHeader.astro      # NEW
│   ├── SiteFooter.astro         # MODIFIED — new role text
│   ├── SiteNav.astro            # MODIFIED — new links + hamburger
│   ├── SvgMorphMotif.astro      # UNCHANGED
│   ├── WorkCatalogue.astro      # DELETED (replaced by SectionGrid)
│   └── XRayToggle.astro         # NEW
├── content/
│   ├── projects/
│   │   ├── [existing placeholder .md files — updated with discipline field]
│   │   └── [new project .md files as owner adds them]
│   └── research/                # NEW directory
│       └── [research .md files]
├── content.config.ts            # MODIFIED — new fields + research collection
├── layouts/
│   └── Base.astro               # UNCHANGED (pages pass different titles)
├── lib/
│   └── [all unchanged]
├── pages/
│   ├── index.astro              # MODIFIED — new layout
│   ├── cv.astro                 # NEW
│   ├── design/
│   │   ├── index.astro          # NEW — section page
│   │   └── [slug].astro         # NEW (evolved from work/[slug].astro)
│   ├── structural/
│   │   ├── index.astro          # NEW — section page
│   │   └── [slug].astro         # NEW
│   ├── research/
│   │   ├── index.astro          # NEW — publication list
│   │   └── [slug].astro         # NEW
│   ├── ai/
│   │   ├── index.astro          # NEW — section page
│   │   └── [slug].astro         # NEW
│   └── work/
│       └── [slug].astro         # DELETED (replaced by discipline routes)
├── styles/
│   └── global.css               # UNCHANGED
└── types/
    └── flubber.d.ts             # UNCHANGED
```

---

## 10. Conventions to maintain

These are documented in `docs/session-history/00_HANDOFF.md` and must be
followed during the restructure:

1. **Explicit types, no `var`-style shortcuts; comments explain *why*.**
2. **Reduced motion is a hard JS gate** — check `prefersReducedMotion()`,
   stop the loop, draw a static pose, subscribe to live changes. The
   three canvas scenes being moved to `/design/` already do this.
3. **TDZ hazard** — `createResponsiveCanvas`'s resize callback fires
   synchronously. State it reads must be declared BEFORE the call. No new
   canvas scenes are being created, but be careful if modifying existing
   ones.
4. **Non-null re-bind pattern** — after null guards, re-bind to a typed
   const for use in closures.
5. **Deterministic artwork** — seeded PRNG, never bare `Math.random()` for
   signature visuals.
6. **Canvas palettes are hardcoded channel arrays** — canvas can't read
   CSS vars per frame. If theme tokens change, grep for
   `26, 25, 23` / `212, 98, 58` / `251, 250, 248`.
7. **rAF loops via `lib/loop.ts`**, gated by `lib/visibility.ts`.
8. **Verification is non-negotiable** — `npx astro check` + `npm run build`
   after changes, plus browser verification.
9. **Content collection changes need a dev-server restart** — HMR won't
   pick them up.

---

## 11. Build order

Sequenced to keep the site buildable at every step. Each step ends with
`npx astro check` + `npm run build` passing.

### Phase 1: Content model (foundation — everything depends on this)

1. **Update `content.config.ts`** — add `discipline`, `featured`,
   `structuralPair`, `designPair`, `role`, `client`, `location`, `status`
   to the project schema. Add the `research` collection.
2. **Update existing placeholder `.md` files** — add
   `discipline: "design"` to all three.
3. **Create `src/content/research/` directory** — add one placeholder
   research entry.
4. **Restart dev server** (schema change requires it).
5. Verify: `npx astro check` clean.

### Phase 2: Shared components (building blocks for the section pages)

6. **Create `SectionHeader.astro`** — eyebrow + title + description,
   parameterised via props.
7. **Create `SectionGrid.astro`** — extract the card grid from
   `WorkCatalogue.astro`, parameterise by discipline + base path.
8. **Create `PublicationList.astro`** — citation-style list component.
9. **Create `PracticeStrip.astro`** — four discipline tiles.
10. **Create `FeaturedWork.astro`** — curated project row, filtered by
    `featured: true`.
11. **Create `XRayToggle.astro`** — the toggle bar.
12. Verify: `npx astro check` clean (components exist but aren't used yet).

### Phase 3: Section pages (the new routes)

13. **Create `src/pages/design/index.astro`** — section page using
    `SectionHeader` + `SectionGrid` + the three canvas scenes.
14. **Create `src/pages/design/[slug].astro`** — project detail with
    optional `XRayToggle`.
15. **Create `src/pages/structural/index.astro`** and
    `src/pages/structural/[slug].astro`.
16. **Create `src/pages/research/index.astro`** and
    `src/pages/research/[slug].astro`.
17. **Create `src/pages/ai/index.astro`** and
    `src/pages/ai/[slug].astro`.
18. **Create `src/pages/cv.astro`** — placeholder.
19. Verify: `npx astro check` + `npm run build` — site now has all routes.

### Phase 4: Landing page restructure

20. **Rewrite `src/pages/index.astro`** — replace the old layout with
    `DotGridHero` + `PracticeStrip` + `FeaturedWork` + `AboutContact`.
    Remove `SvgMorphMotif`, `FlowField`, `ParametricPlayground` imports.
21. **Update `DotGridHero.astro`** — new copy.
22. **Update `AboutContact.astro`** — new copy + updated skills list.
23. Verify: build clean, landing page renders correctly.

### Phase 5: Navigation + footer

24. **Update `SiteNav.astro`** — add section links, mobile hamburger.
25. **Update `SiteFooter.astro`** — new role text.
26. Verify: nav links work on all pages, mobile hamburger works.

### Phase 6: Cleanup

27. **Delete `src/components/WorkCatalogue.astro`** (replaced by SectionGrid).
28. **Delete `src/pages/work/` directory** (replaced by discipline routes).
    Set up redirects if needed (not critical — no existing external links).
29. **Update `HOW_TO_ADD_A_PROJECT.md`** — new instructions reflecting the
    discipline field and new content directories.
30. Final verify: `npx astro check` + `npm run build` + full browser test.

### Phase 7: First real content (highest-value post-restructure)

31. Add the first real X-ray project pair (design + structural).
32. Add the Lagos research entry.
33. Add the first AI project (this portfolio as a case study).
34. Replace the about copy and portrait.

---

## 12. Risk register

| Risk | Mitigation |
|---|---|
| Schema change breaks existing content | Phase 1 updates all `.md` files before anything else; dev server restart noted |
| Canvas scenes break when moved to `/design/` | No code changes to the components — they're self-contained with their own `<script>` blocks. The `id`-based `getElementById` calls work identically on any page. Verify with browser test. |
| Mobile nav too crowded | Hamburger menu added in Phase 5 |
| X-ray pair slug typo creates broken link | At build time, `getStaticPaths` will fail if the paired slug doesn't exist in the collection — Astro's static build catches this. Add a build-time validation: scan all `structuralPair`/`designPair` values and assert they resolve. |
| Research collection empty at first | One placeholder entry created in Phase 1 |
| Git rollback needed | Commit a clean checkpoint before Phase 1 starts. The existing rollback point (`5da3337`) is too old — it predates the night-run conversion. |

---

## 13. What this plan does NOT cover (future enhancements)

- Multi-image gallery component for structural projects (inline markdown
  images are sufficient for now)
- Client-side filtering/sorting within section grids
- Dark mode
- Deployment / CI / hosting
- og:image generation
- Three.js centerpiece (skills roadmap A2/A3)
- Page transitions (skills roadmap I6)
- PDF viewer embed for research papers (link-to-PDF is sufficient)

---

## 14. Success criteria

The restructure is done when:

- [ ] `npx astro check` → 0 errors
- [ ] `npm run build` → all pages built cleanly
- [ ] Landing page shows hero + practice strip + featured work + about
- [ ] Each discipline route (`/design/`, `/structural/`, `/research/`, `/ai/`)
      renders with a section header and appropriate content list
- [ ] At least one X-ray pair exists with working toggle navigation
- [ ] Nav links work on all pages (desktop + mobile hamburger)
- [ ] All three existing canvas scenes render correctly on `/design/`
- [ ] Reduced motion works (all scenes show static poses)
- [ ] The site reads as "multi-disciplinary architect" not "computational
      designer who also does other things"
