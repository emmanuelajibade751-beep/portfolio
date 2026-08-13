import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ??
  "https://emmanuelajibade751-beep.github.io/portfolio"
).replace(/\/$/, "");
const socialImageUrl = siteUrl + "/og-v2.png";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl + "/"),
  title: "Sunday Emmanuel Ajibade | Civil Engineering & Computational Design",
  description: "University of Ibadan Civil Engineering student working across structural systems, computational design, architecture and urban research.",
  openGraph: {
    title: "Sunday Emmanuel Ajibade | Design Across Systems",
    description: "Civil Engineering Student · Computational Designer · Researcher · University of Ibadan",
    images: [{ url: socialImageUrl, width: 1792, height: 935, alt: "Sunday Emmanuel Ajibade — Design Across Systems" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sunday Emmanuel Ajibade | Design Across Systems",
    description: "Civil Engineering Student · Computational Designer · Researcher · University of Ibadan",
    images: [socialImageUrl],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>{children}</body>
    </html>
  );
}
