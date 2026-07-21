import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://em-built-intelligence.sites.openai.com"),
  title: "EM—01 | Built Intelligence",
  description: "Architecture, computational design, civil systems and AI research—one connected practice.",
  openGraph: {
    title: "EM—01 | Built Intelligence",
    description: "Ideas at the scale of cities. Precision at the scale of code.",
    images: [{ url: "/og.png", width: 1792, height: 935, alt: "Built Intelligence portfolio" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "EM—01 | Built Intelligence",
    description: "Architecture · Computation · Civil Systems · AI",
    images: ["/og.png"],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>{children}</body>
    </html>
  );
}
