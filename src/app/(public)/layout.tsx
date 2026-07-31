import type { ReactNode } from "react";

// TODO: import PublicNavbar from "@/components/layout"
// TODO: import PublicFooter from "@/components/layout"

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <>
      {/* TODO: <PublicNavbar /> */}
      <main>{children}</main>
      {/* TODO: <PublicFooter /> */}
    </>
  );
}
