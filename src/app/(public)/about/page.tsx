import { AboutSection } from "@/components/features/about/AboutSection";
import { JoinCtaSection } from "@/components/features/home";
import { PublicPageShell } from "@/components/ui/index";

export default function Page() {
  return (
    <>
      <PublicPageShell
        title="Tentang Physical Society Indonesia Cabang Surabaya"
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