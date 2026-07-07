# Job 06 — Site chrome: nav, footer, about/contact, meta, favicon

## Project
`C:/Users/Emman/Downloads/computational-design-portfolio`. Read prior logs
in `builds/` first.

## Task
Make it read as a real site, not a demo page:
1. Header nav (sticky or static, light theme): site name/mark left; links to
   Work (catalogue section/pages), About, Contact. Keep it typographic and
   quiet — black on white, orange only for hover/active (a restrained use of
   the house easing on hover is welcome; nothing bouncy).
2. Footer: name, role line ("Computational designer — Rhino / Grasshopper"),
   contact email placeholder, copyright year.
3. About section or page: 2–3 paragraph placeholder clearly marked for the
   owner to replace; structure it (portrait slot, skills list: Rhino,
   Grasshopper, C#, etc.).
4. Contact: simple mailto link/button — do NOT add a form backend or any
   third-party service.
5. Meta/SEO in a shared layout: proper `<title>`, description, Open Graph
   tags (og:title/description/image — generate a simple OG image or reuse a
   placeholder cover), `lang`, theme-color for the light theme.
6. Favicon: replace the default Astro favicon with the site's compass-star
   motif (the 4-point star path already used in SvgMorphMotif/the demo icon)
   as SVG favicon; keep a fallback .ico if trivial.
7. Restructure `index.astro` into a shared `src/layouts/Base.astro` if that
   is the cleanest way to share head/nav/footer (detail pages from job 05
   should use it too).

## Done when
- `astro check` + `npm run build` pass.
- Nav links scroll/route correctly; every page shares the layout.
- View-source shows the meta tags; favicon renders (probe the link tag).
- `builds/06_site_chrome.log.md` written listing files added/changed.
