import assert from "node:assert/strict";
import { stat } from "node:fs/promises";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("http://localhost/", {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

async function renderHtml() {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);
  return response.text();
}

test("server-renders the portfolio identity and metadata", async () => {
  const html = await renderHtml();

  assert.match(html, /^<!DOCTYPE html>/i);
  assert.match(html, /<html lang="en">/i);
  assert.match(
    html,
    /<title>Sunday Emmanuel Ajibade \| Civil Engineering &amp; Computational Design<\/title>/i,
  );
  assert.match(
    html,
    /<meta name="description" content="University of Ibadan Civil Engineering student working across structural systems, computational design, architecture and urban research\."\/>/i,
  );
  assert.match(
    html,
    /<meta property="og:image" content="https:\/\/emmanuelajibade751-beep\.github\.io\/portfolio\/og-studio-night\.png"\/>/i,
  );
  assert.match(html, /<meta name="twitter:card" content="summary_large_image"\/>/i);
  assert.match(html, /<h1(?=[^>]*id="hero-title")(?=[^>]*class="hero-title")[^>]*>Portfolio<\/h1>/);
  assert.match(html, /href="mailto:emmanuelajibade751@gmail\.com"/i);

  for (const starterMarker of [
    "codex-preview",
    "Building your site",
    "Your site is taking shape",
    "_sites-preview",
    "react-loading-skeleton",
  ]) {
    assert.doesNotMatch(html, new RegExp(starterMarker, "i"));
  }
});

test("renders the complete navigation and project catalogue", async () => {
  const html = await renderHtml();
  const nav = html.match(/<nav aria-label="Primary navigation">([\s\S]*?)<\/nav>/i);

  assert.ok(nav, "primary navigation should render");
  assert.deepEqual(
    [...nav[1].matchAll(/<a href="([^"]+)"/gi)].map((match) => match[1]),
    ["#work", "#research", "#lab", "#expertise", "#profile"],
  );

  for (const id of ["top", "work", "research", "lab", "expertise", "profile"]) {
    assert.match(html, new RegExp(`<section(?=[^>]*\\bid="${id}")[^>]*>`, "i"));
  }

  assert.deepEqual(
    [...html.matchAll(/aria-label="Open ([^"]+) case study"/gi)].map(
      (match) => match[1],
    ),
    [
      "Parametric Facade Study",
      "Canopy Structure Form-Finding",
      "Rhino Intelligence Toolkit",
      "Reading Lagos: The Subtractive City",
      "Connection Atlas",
      "Climate Intelligence / 08\u00b0N",
    ],
  );
  assert.match(html, /role="group" aria-label="Filter projects"/i);
  assert.equal((html.match(/<input type="range"/gi) ?? []).length, 3);
  assert.match(html, /aria-label="Live parametric structural form"/i);
});

test("renders the research feature with valid local assets", async () => {
  const html = await renderHtml();
  const expectedResearchImages = [
    "/research/subtractive-city/truckload-urbanism.jpg",
    "/research/subtractive-city/archipelago-before.jpg",
    "/research/subtractive-city/archipelago-after.jpg",
    "/research/subtractive-city/green-makoko.jpg",
    "/research/subtractive-city/school-over-makoko.jpg",
    "/research/subtractive-city/pattern-junction.jpg",
    "/research/subtractive-city/transmitter.jpg",
  ];
  const imageTags = [...html.matchAll(/<img\b[^>]*>/gi)].map((match) => match[0]);
  const researchTags = imageTags.filter((tag) =>
    tag.includes('src="/research/subtractive-city/'),
  );
  const renderedResearchImages = researchTags.map(
    (tag) => tag.match(/\bsrc="([^"]+)"/i)?.[1],
  );

  assert.deepEqual(renderedResearchImages, expectedResearchImages);
  for (const tag of researchTags) {
    const alt = tag.match(/\balt="([^"]+)"/i)?.[1];
    assert.ok(alt?.trim(), `research image needs alt text: ${tag}`);
  }

  for (const assetPath of [...expectedResearchImages, "/og-studio-night.png"]) {
    const info = await stat(new URL(`../public${assetPath}`, import.meta.url));
    assert.ok(info.isFile(), `${assetPath} should be a file`);
    assert.ok(info.size > 0, `${assetPath} should not be empty`);
  }

  assert.match(
    html,
    /href="https:\/\/lexteloo\.com\/think-tank\/research\/the-subtractive-city"/i,
  );
});

test("renders descriptive interaction cues without scattered arrows", async () => {
  const html = await renderHtml();

  assert.doesNotMatch(
    html,
    /[\u2191\u2193\u2197\u2198]/u,
    "generic directional arrow glyphs should not render",
  );
  assert.match(
    html,
    /aria-label="Explore selected work"[^>]*>View work<\/a>/i,
  );
  assert.equal(
    (html.match(/aria-label="Show [^"]+ projects"/gi) ?? []).length,
    4,
  );
  assert.equal(
    (
      html.match(
        /class="project-open"[^>]*aria-hidden="true"[^>]*>View case<\/span>/gi,
      ) ?? []
    ).length,
    6,
  );
  assert.match(html, /aria-label="Email Sunday Emmanuel Ajibade"/i);
  assert.equal(
    (html.match(/aria-label="[^"]+\(opens in a new tab\)"/gi) ?? []).length,
    2,
  );
});

test("renders the focused portfolio-word hero", async () => {
  const html = await renderHtml();
  const hero = html.match(
    /<section(?=[^>]*class="hero hero--portfolio")(?=[^>]*id="top")(?=[^>]*aria-labelledby="hero-title")[^>]*>[\s\S]*?<\/section>/i,
  );

  assert.ok(hero, "focused portfolio hero should render");
  const heroHtml = hero[0];
  assert.match(heroHtml, /class="hero-eyebrow"[^>]*>DESIGN ACROSS SYSTEMS<\/p>/i);
  assert.match(
    heroHtml,
    /<h1(?=[^>]*id="hero-title")(?=[^>]*class="hero-title")[^>]*>Portfolio<\/h1>/,
  );
  for (const approvedCopy of [
    "Sunday Emmanuel Ajibade",
    "Civil Engineering / Computational Design",
    "Ibadan / Nigeria",
    "2026",
    "Featured research / Speculative proposal / Pattern Junction",
  ]) {
    assert.match(
      heroHtml,
      new RegExp(approvedCopy.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i"),
    );
  }
  assert.match(
    heroHtml,
    /I connect <strong>architectural intent, structural buildability and computational intelligence<\/strong>—from first sketch to working system\./i,
  );
  assert.match(
    heroHtml,
    /--hero-image[^"]*\/research\/subtractive-city\/pattern-junction\.jpg/i,
  );
  assert.doesNotMatch(
    heroHtml,
    /hero--operating-field|hero-operating-field|field-register|MODEL \/ 01|ARCHITECTURAL MASS|LOAD PATH \/ S-02|PARAMETRIC FIELD \/ CONTROL NODES|RESEARCH \/ CONTOUR|DATUM \/ 00|<canvas/i,
  );
});
test("organizes the portfolio as an evidence-led narrative", async () => {
  const html = await renderHtml();

  const headerPosition = html.indexOf('<header class="site-header">');
  const mainPosition = html.indexOf('<main id="main-content">');
  const mainEndPosition = html.indexOf("</main>", mainPosition);
  const footerPosition = html.indexOf('<footer class="contact-section"');

  assert.ok(headerPosition >= 0 && headerPosition < mainPosition);
  assert.ok(mainPosition >= 0 && mainEndPosition < footerPosition);
  assert.match(html, /class="skip-link" href="#main-content"[^>]*>Skip to content<\/a>/i);
  assert.equal((html.match(/<h1\b/gi) ?? []).length, 1);

  const nav = html.match(/<nav aria-label="Primary navigation">([\s\S]*?)<\/nav>/i);
  assert.ok(nav, "primary navigation should render");
  const navTargets = [...nav[1].matchAll(/<a href="#([^"]+)"/gi)].map(
    (match) => match[1],
  );
  assert.deepEqual(navTargets, ["work", "research", "lab", "expertise", "profile"]);
  const targetPositions = navTargets.map((id) => html.indexOf(`id="${id}"`));
  assert.ok(targetPositions.every((position) => position >= 0));
  assert.deepEqual([...targetPositions].sort((a, b) => a - b), targetPositions);

  for (const labelledBy of [
    "position-title",
    "work-title",
    "research-title",
    "lab-title",
    "practice-title",
    "method-title",
    "profile-title",
  ]) {
    assert.match(
      html,
      new RegExp(`<section(?=[^>]*aria-labelledby="${labelledBy}")[^>]*>`, "i"),
    );
  }
  assert.match(html, /<footer(?=[^>]*aria-labelledby="contact-title")[^>]*>/i);

  const chapterIds = [
    "research-thesis",
    "research-evidence",
    "research-propositions",
    "research-credits",
  ];
  const chapterPositions = chapterIds.map((id) => html.indexOf(`id="${id}"`));
  assert.ok(chapterPositions.every((position) => position >= 0));
  assert.deepEqual([...chapterPositions].sort((a, b) => a - b), chapterPositions);

  const narrativeHtml = html.replace(/<!--[\s\S]*?-->/g, "");
  for (const status of ["P01", "P02", "P03", "P04", "P05"]) {
    assert.match(narrativeHtml, new RegExp(`${status}(?: \/ SPECULATIVE PROPOSITION|<)`, "i"));
  }
  assert.match(narrativeHtml, /Five speculative amplifications\./i);
  assert.match(narrativeHtml, /not presented as built work\./i);
  assert.equal((narrativeHtml.match(/P05 \/ SPECULATIVE PROPOSITION/gi) ?? []).length, 0);
  assert.match(narrativeHtml, /P05 \/ DETAIL \/ CULTURE/i);



  assert.equal((html.match(/<div class="capability-row"/gi) ?? []).length, 4);
  assert.doesNotMatch(html, /<(?:a|button)[^>]*class="capability-row"/i);
});
test("renders the signature identity header", async () => {
  const html = await renderHtml();
  const header = html.match(/<header class="site-header">([\s\S]*?)<\/header>/i);

  assert.ok(header, "signature site header should render");
  assert.match(header[0], /class="brand-signature"[^>]*aria-hidden="true"/i);
  assert.match(header[0], /class="brand-signature-full"[^>]*>Sunday Emmanuel Ajibade<\/span>/i);
  assert.match(header[0], /class="brand-signature-compact"[^>]*>Sunday E\. Ajibade<\/span>/i);
  assert.match(header[0], /class="brand-caption"[^>]*>Portfolio \/ 2026<\/span>/i);
  assert.match(header[0], /Civil Engineering \/ Computational Design/i);
  assert.equal((header[0].match(/<nav\b/gi) ?? []).length, 1);
  assert.match(header[0], /aria-label="Email Sunday Emmanuel Ajibade"/i);
});