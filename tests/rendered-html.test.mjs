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
    /<meta property="og:image" content="https:\/\/em-built-intelligence\.clever-bream-0221\.chatgpt\.site\/og-v2\.png"\/>/i,
  );
  assert.match(html, /<meta name="twitter:card" content="summary_large_image"\/>/i);
  assert.match(html, /aria-label="Design across systems"/i);
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
    ["#work", "#research", "#expertise", "#lab", "#profile"],
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

  for (const assetPath of [...expectedResearchImages, "/og-v2.png"]) {
    const info = await stat(new URL(`../public${assetPath}`, import.meta.url));
    assert.ok(info.isFile(), `${assetPath} should be a file`);
    assert.ok(info.size > 0, `${assetPath} should not be empty`);
  }

  assert.match(
    html,
    /href="https:\/\/lexteloo\.com\/think-tank\/research\/the-subtractive-city"/i,
  );
});
