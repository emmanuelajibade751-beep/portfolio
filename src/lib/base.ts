/**
 * Prefixes an in-site absolute path with Astro's configured `base`
 * (import.meta.env.BASE_URL, e.g. "/portfolio/" on GitHub Pages, "/" in
 * dev). Astro's own asset pipeline (images, bundled CSS/JS) already gets
 * this prefix automatically at build time — this helper is only needed for
 * hand-written hrefs like `/design/` or `/#about` that we build ourselves.
 */
export function withBase(path: string): string {
  // BASE_URL's trailing slash isn't guaranteed (e.g. base: "/portfolio"
  // yields BASE_URL "/portfolio", no slash) — strip it and re-add exactly
  // one separator so the join is correct either way.
  const base = import.meta.env.BASE_URL.replace(/\/$/, "");
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return base + cleanPath;
}

/**
 * Same as withBase, but leaves external/absolute URLs untouched. Used for
 * owner-authored fields like `pdfUrl` that may be a site-relative path
 * ("/papers/x.pdf") or a full external URL — only the former needs prefixing.
 */
export function withBaseIfLocal(url: string): string {
  if (/^[a-z][a-z0-9+.-]*:/i.test(url) || url.startsWith("//")) {
    return url; // has a scheme (https:, mailto:, ...) or is protocol-relative
  }
  return withBase(url);
}
