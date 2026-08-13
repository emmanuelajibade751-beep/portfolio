import type { NextConfig } from "next";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const isPagesBuild = process.env.PAGES_BUILD === "true";
const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  "https://emmanuelajibade751-beep.github.io/portfolio";

const nextConfig: NextConfig = {
  ...(isPagesBuild
    ? { output: "export" as const, trailingSlash: true }
    : {}),
  basePath,
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
    NEXT_PUBLIC_SITE_URL: siteUrl,
  },
  turbopack: {
    root: process.cwd(),
  },
  typescript: {
    tsconfigPath: isPagesBuild ? "tsconfig.pages.json" : "tsconfig.json",
  },
};

export default nextConfig;
