// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  // GitHub Pages serves this repo at /portfolio/, not the domain root, so
  // every internal link must be prefixed with `base` — see src/lib/base.ts.
  site: 'https://emmanuelajibade751-beep.github.io',
  base: '/portfolio',
});
