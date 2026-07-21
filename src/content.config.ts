import { defineCollection } from "astro:content";
import { z } from "astro/zod";
import { glob } from "astro/loaders";

/**
 * The project catalogue. One .md file per project in src/content/projects/,
 * cover image alongside it — adding work is a file drop, never a code edit.
 * See HOW_TO_ADD_A_PROJECT.md in the repo root for the owner-facing steps.
 *
 * A single collection carries three disciplines (design / structural / ai)
 * discriminated by the `discipline` field rather than three near-identical
 * collections: the shape (title, cover, body, tags, tools) is shared, so a
 * discriminator avoids duplicating the schema, loader, and detail template.
 * Research is the exception — its shape differs enough to warrant its own
 * collection (see below).
 */
const projects = defineCollection({
  loader: glob({ pattern: "*.md", base: "./src/content/projects" }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(), // one-liner shown on the card
      date: z.coerce.date(),
      tags: z.array(z.string()).default([]),
      cover: image(), // resolved relative to the .md file
      tools: z.array(z.string()).default([]), // e.g. ["Rhino", "Grasshopper"]
      // Lower = earlier in the grid; omit to sort by date after ordered ones.
      order: z.number().optional(),

      // Which section route this project lives under. Drives routing and the
      // section grids — a required field so no project can be un-categorised.
      discipline: z.enum(["design", "structural", "ai"]),

      // Curated onto the landing page's FeaturedWork row. Explicit boolean
      // rather than order-based selection so intent is visible in the file.
      featured: z.boolean().default(false),

      // X-ray pairing: links the two lenses of one physical building by slug.
      // Set `structuralPair` on the design side, `designPair` on the
      // structural side. getStaticPaths resolves these at build time, so a
      // typo fails the build rather than shipping a dead link.
      structuralPair: z.string().optional(), // design project -> its structural counterpart
      designPair: z.string().optional(), // structural project -> its design counterpart

      // Optional practice metadata, most useful for architectural/structural
      // work. Absent on purely computational pieces without complaint.
      role: z.string().optional(), // e.g. "Lead designer", "Structural detailer"
      client: z.string().optional(), // e.g. "Studio XYZ"
      location: z.string().optional(), // e.g. "Lagos, Nigeria"
      status: z.string().optional(), // e.g. "Built", "Competition", "Ongoing"
    }),
});

/**
 * Publications and studies. Kept separate from `projects` because research
 * has no cover image and is presented as a citation-style list, not a card
 * grid — forcing it into the project shape would leave half the fields empty.
 */
const research = defineCollection({
  loader: glob({ pattern: "*.md", base: "./src/content/research" }),
  schema: z.object({
    title: z.string(),
    abstract: z.string(), // shown on the list page under the title
    date: z.coerce.date(), // publication date
    venue: z.string(), // journal name or conference
    authors: z.array(z.string()), // all authors, owner included
    pdfUrl: z.string().optional(), // link to the PDF (external URL or /public path)
    tags: z.array(z.string()).default([]),
    order: z.number().optional(),
  }),
});

export const collections = { projects, research };
