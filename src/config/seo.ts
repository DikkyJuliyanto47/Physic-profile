/**
 * SEO Configuration — PSI Surabaya
 *
 * Planned production domain:
 * https://psi.surabaya.org.id
 *
 * Status: PLANNED — not yet confirmed or deployed.
 *
 * TODO:
 * - Confirm the official production domain.
 * - Configure NEXT_PUBLIC_SITE_URL for production.
 * - Verify canonical URLs and sitemap after deployment.
 * - Register the website with Google Search Console.
 *
 * Do not activate the planned domain until officially confirmed.
 */
import type { Metadata } from "next";

function publicOrigin(value: string | undefined): string | undefined {
  if (!value) return undefined;
  try {
    const url = new URL(value);
    const host = url.hostname.toLowerCase();
    if (url.protocol !== "https:" || url.username || url.password || url.port ||
      url.pathname !== "/" || url.search || url.hash || !host.includes(".") ||
      host === "localhost" || host.endsWith(".localhost") || host.endsWith(".local") ||
      host.endsWith(".test") || host.endsWith(".invalid") || host.endsWith(".example") ||
      host === "example.com" || host === "example.org" || host === "example.net" ||
      /^[\d.]+$/.test(host) || host.includes(":")) return undefined;
    return url.origin;
  } catch {
    return undefined;
  }
}

export const seoConfig = {
  siteName: "Physical Society of Indonesia (PSI) Cabang Surabaya",
  siteDescription: "Website resmi Physical Society of Indonesia Cabang Surabaya yang menyediakan informasi organisasi, kegiatan ilmiah, berita, riset, publikasi, dan jejaring komunitas fisika.",
  // Set only after the official production origin is confirmed.
  siteUrl: publicOrigin(process.env.NEXT_PUBLIC_SITE_URL),
  image: "/assets/hero/pertemuan-07-27-03.jpeg",
};

export function publicUrl(path: string): string | undefined {
  return seoConfig.siteUrl && path.startsWith("/") && !path.startsWith("//")
    ? new URL(path, seoConfig.siteUrl).href
    : undefined;
}

export function publicMetadata(
  title: string,
  description: string,
  path: string,
  image = seoConfig.image,
  type: "website" | "article" = "website",
): Metadata {
  const url = publicUrl(path);
  let imageUrl: string | undefined;
  if (url) {
    try {
      const parsed = new URL(image, seoConfig.siteUrl);
      if (parsed.protocol === "https:") imageUrl = parsed.href;
    } catch { /* Invalid media URLs use the existing site preview. */ }
    imageUrl ??= publicUrl(seoConfig.image);
  }
  return {
    title: path === "/" ? { absolute: title } : title,
    description,
    ...(seoConfig.siteUrl ? { metadataBase: new URL(seoConfig.siteUrl) } : {}),
    alternates: url ? { canonical: url } : undefined,
    robots: {
      index: Boolean(url), follow: true,
      googleBot: {
        index: Boolean(url), follow: true,
        "max-video-preview": -1, "max-image-preview": "large", "max-snippet": -1,
      },
    },
    openGraph: {
      title, description, type, locale: "id_ID", siteName: seoConfig.siteName,
      ...(url ? { url } : {}),
      ...(imageUrl ? { images: [{ url: imageUrl, alt: title }] } : {}),
    },
    twitter: {
      card: "summary_large_image", title, description,
      ...(imageUrl ? { images: [imageUrl] } : {}),
    },
  };
}
