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
  title: {
    default: "PSI Cabang Surabaya | Perhimpunan Fisikawan Indonesia",
    template: "%s | PSI Cabang Surabaya",
  },
  description:
    "Perhimpunan Fisikawan Indonesia (PSI) Cabang Surabaya — wadah silaturahmi, kolaborasi riset, dan pengembangan pendidikan fisika di wilayah Jawa Timur.",
  keywords: [
    "Fisika",
    "PSI Surabaya",
    "Perhimpunan Fisikawan Indonesia",
    "Riset Fisika",
    "LAMSAMA",
    "Fisika Indonesia",
    "Surabaya",
    "Jawa Timur",
    "Seminar Fisika",
    "Kuliah Tamu Fisika",
    "Dosen Fisika",
    "Penelitian Fisika",
  ],
  authors: [{ name: "PSI Cabang Surabaya" }],
  creator: "PSI Cabang Surabaya",
  publisher: "PSI Cabang Surabaya",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://psi-surabaya.or.id"
  ),
  openGraph: {
    type: "website",
    locale: "id_ID",
    siteName: "PSI Cabang Surabaya",
    title: "PSI Cabang Surabaya | Perhimpunan Fisikawan Indonesia",
    description:
      "Wadah silaturahmi, kolaborasi riset, dan pengembangan pendidikan fisika di wilayah Jawa Timur.",
  },
  twitter: {
    card: "summary_large_image",
    title: "PSI Cabang Surabaya",
    description:
      "Wadah silaturahmi, kolaborasi riset, dan pengembangan pendidikan fisika di wilayah Jawa Timur.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
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
