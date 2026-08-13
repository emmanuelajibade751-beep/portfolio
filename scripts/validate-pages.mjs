import assert from "node:assert/strict";
import { readFile, readdir, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = fileURLToPath(new URL("../", import.meta.url));
const outputRoot = path.join(projectRoot, "out");
const basePath = (process.env.NEXT_PUBLIC_BASE_PATH ?? "").replace(/\/$/, "");
const origin = "https://pages.local";

async function requireFile(relativePath) {
  const info = await stat(path.join(outputRoot, relativePath));
  assert.ok(info.isFile(), relativePath + " should be a file");
  assert.ok(info.size > 0, relativePath + " should not be empty");
}

async function collectFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const absolutePath = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...(await collectFiles(absolutePath)));
    else if (entry.isFile()) files.push(absolutePath);
  }

  return files;
}

function outputPathForUrl(value, documentPath) {
  if (
    !value ||
    value.startsWith("#") ||
    value.startsWith("mailto:") ||
    value.startsWith("tel:") ||
    value.startsWith("data:")
  ) {
    return null;
  }

  const url = new URL(value, origin + basePath + documentPath);
  if (url.origin !== origin) return null;

  if (
    basePath &&
    url.pathname !== basePath &&
    !url.pathname.startsWith(basePath + "/")
  ) {
    throw new Error("Local URL escapes the Pages base path: " + value);
  }

  let relativePath = basePath
    ? url.pathname.slice(basePath.length)
    : url.pathname;
  relativePath = decodeURIComponent(relativePath).replace(/^\/+/, "");
  if (!relativePath || relativePath.endsWith("/")) relativePath += "index.html";
  return relativePath;
}

await Promise.all([
  requireFile("index.html"),
  requireFile("404.html"),
  requireFile("og-v2.png"),
  requireFile("research/subtractive-city/truckload-urbanism.jpg"),
]);

const indexHtml = await readFile(path.join(outputRoot, "index.html"), "utf8");
assert.match(indexHtml, /Sunday Emmanuel Ajibade/i);
assert.ok(
  indexHtml.includes(
    'src="' +
      basePath +
      '/research/subtractive-city/truckload-urbanism.jpg"',
  ),
  "research hero should include the Pages base path",
);

const files = await collectFiles(outputRoot);
for (const absolutePath of files) {
  const extension = path.extname(absolutePath).toLowerCase();
  if (extension !== ".html" && extension !== ".css") continue;

  const content = await readFile(absolutePath, "utf8");
  const relativeDocumentPath =
    "/" + path.relative(outputRoot, absolutePath).split(path.sep).join("/");
  const values =
    extension === ".html"
      ? [...content.matchAll(/\b(?:src|href)=["']([^"']+)["']/gi)].map(
          (match) => match[1],
        )
      : [...content.matchAll(/url\(\s*["']?([^"')]+)["']?\s*\)/gi)].map(
          (match) => match[1],
        );

  for (const value of values) {
    const relativeAssetPath = outputPathForUrl(value, relativeDocumentPath);
    if (relativeAssetPath) await requireFile(relativeAssetPath);
  }
}

console.log(
  "Validated GitHub Pages artifact at " +
    (basePath || "/") +
    " (" +
    files.length +
    " files).",
);
