
import { ReactNode, Suspense } from "react";
import { PublicFooter, PublicNavbar } from "@/components/layout";
import { seoConfig } from "@/config/seo";
import { JsonLd } from "@/components/seo/JsonLd";

const FONT_AWESOME_CDN =
  "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css";

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <>
      {seoConfig.siteUrl && (
        <JsonLd data={{
          "@context": "https://schema.org",
          "@type": "Organization",
          "@id": `${seoConfig.siteUrl}/#organization`,
          name: seoConfig.siteName,
          url: seoConfig.siteUrl,
        }} />
      )}
      <link
        rel="stylesheet"
        href={FONT_AWESOME_CDN}
        crossOrigin="anonymous"
        referrerPolicy="no-referrer"
      />
      <Suspense>
        <PublicNavbar />
      </Suspense>
      <main className="flex flex-col flex-1">{children}</main>
      <Suspense>
        <PublicFooter />
      </Suspense>
    </>
  );
}
