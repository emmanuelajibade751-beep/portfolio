import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://em-built-intelligence.clever-bream-0221.chatgpt.site"),
  title: "Sunday Emmanuel Ajibade | Architect & Computational Designer",
  description: "Architecture, structural detailing, computational design and research—connected by a hands-on, systems-driven approach.",
  openGraph: {
    title: "Sunday Emmanuel Ajibade | Design Across Systems",
    description: "Architect · Computational Designer · Researcher",
    images: [{ url: "/og-v2.png", width: 1792, height: 935, alt: "Sunday Emmanuel Ajibade — Design Across Systems" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sunday Emmanuel Ajibade | Design Across Systems",
    description: "Architect · Computational Designer · Researcher",
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
