import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

/**
 * The project catalogue. One .md file per project in src/content/projects/,
 * cover image alongside it — adding work is a file drop, never a code edit.
 * See HOW_TO_ADD_A_PROJECT.md in the repo root for the owner-facing steps.
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
    }),
});

export const collections = { projects };
