import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { publicMetadata } from "@/config/seo";
import { AboutSection } from "@/components/features/about/AboutSection";
import { JoinCtaSection } from "@/components/features/home";
import { PublicPageShell } from "@/components/ui/index";

export const metadata = publicMetadata(
  "Tentang PSI Surabaya",
  "Profil, sejarah, visi, dan misi Physical Society of Indonesia Cabang Surabaya.",
  "/about",
);

export default function Page() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Beranda", path: "/" },
          { name: "Tentang Kami", path: "/about" },
        ]}
      />
      <PublicPageShell
        title="Tentang Physical Society of Indonesia Cabang Surabaya"
        breadcrumbs={[
          { label: "Beranda", href: "/" },
          { label: "Tentang PSI" },
        ]}
        navItems={[
          { label: "Tentang", href: "#tentang" },
          { label: "Sejarah", href: "#sejarah" },
          { label: "Visi & Misi", href: "#visi-misi" },
        ]}
        defaultActiveHref="#tentang"
      >
        <AboutSection />
      </PublicPageShell>

      <JoinCtaSection />
    </>
  );
}
