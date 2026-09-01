
import { ReactNode, Suspense } from "react";
import { PublicFooter, PublicNavbar } from "@/components/layout";

const FONT_AWESOME_CDN =
  "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css";

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <>
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