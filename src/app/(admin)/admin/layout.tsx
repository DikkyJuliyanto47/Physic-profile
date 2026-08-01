import type { ReactNode } from "react";

// TODO: import AdminSidebar from "@/components/layout"
// TODO: import AdminTopbar from "@/components/layout"
// NOTE: route protection/auth guard is OUT OF SCOPE for this phase.

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div>
      {/* TODO: <AdminSidebar /> */}
      <div>
        {/* TODO: <AdminTopbar /> */}
        <main>{children}</main>
      </div>
    </div>
  );
}
