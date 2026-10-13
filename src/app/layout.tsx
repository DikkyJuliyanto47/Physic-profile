import { seoConfig } from "@/config/seo";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: { default: seoConfig.siteName, template: "%s | PSI Cabang Surabaya" },
  description: seoConfig.siteDescription,
  authors: [{ name: "PSI Cabang Surabaya" }],
  creator: "PSI Cabang Surabaya",
  publisher: "PSI Cabang Surabaya",
  ...(seoConfig.siteUrl ? { metadataBase: new URL(seoConfig.siteUrl) } : {}),
  // Internal routes inherit noindex; public pages explicitly opt in.
  robots: { index: false, follow: false },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
