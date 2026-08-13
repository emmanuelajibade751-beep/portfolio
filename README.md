# Sunday Emmanuel Ajibade - Portfolio

An editorial portfolio spanning civil engineering, computational design,
architecture, AI-assisted tools, and urban research.

## Local development

Requires Node.js 22.13 or newer.

    npm install
    npm run dev

Open http://localhost:3000/.

## Validation

    npm run lint
    npm test

The test command creates a production Vinext build and verifies the rendered
portfolio identity, navigation, project catalogue, and research assets.

## GitHub Pages

The Pages workflow keeps the Vinext runtime validation and then creates a
separate native Next.js static export. GitHub supplies the repository base path
at build time, so the same source works at both a root domain and a project URL.

For a local project-path check in PowerShell:

    $env:NEXT_PUBLIC_BASE_PATH = "/portfolio"
    $env:NEXT_PUBLIC_SITE_URL = "https://emmanuelajibade751-beep.github.io/portfolio"
    npm.cmd run build:pages
    npm.cmd run validate:pages

The deploy workflow uploads only the generated out artifact. Dependencies,
Vinext server output, Wrangler state, and local work files remain ignored.

## Research feature

The portfolio includes Reading Lagos: The Subtractive City, with authored
research plates and a link to the published LLL Laboratory feature.
