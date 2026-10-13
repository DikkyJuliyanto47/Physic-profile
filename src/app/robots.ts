import type { MetadataRoute } from "next";
import { publicUrl } from "@/config/seo";
export default function robots(): MetadataRoute.Robots {
  const sitemap = publicUrl("/sitemap.xml");
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/admin", "/login", "/api"] }],
    ...(sitemap ? { sitemap } : {}),
  };
}
