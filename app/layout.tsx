import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://em-built-intelligence.clever-bream-0221.chatgpt.site"),
  title: "Sunday Emmanuel Ajibade | Civil Engineering & Computational Design",
  description: "University of Ibadan Civil Engineering student working across structural systems, computational design, architecture and urban research.",
  openGraph: {
    title: "Sunday Emmanuel Ajibade | Design Across Systems",
    description: "Civil Engineering Student · Computational Designer · Researcher · University of Ibadan",
    images: [{ url: "/og-v2.png", width: 1792, height: 935, alt: "Sunday Emmanuel Ajibade — Design Across Systems" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sunday Emmanuel Ajibade | Design Across Systems",
    description: "Civil Engineering Student · Computational Designer · Researcher · University of Ibadan",
    images: ["/og-v2.png"],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>{children}</body>
    </html>
  );
}
