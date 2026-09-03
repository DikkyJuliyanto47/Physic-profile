import { Suspense } from "react";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth-utils";
import { AdminLayoutClient } from "./AdminLayoutClient";

async function AuthGuard({ children }: { children: React.ReactNode }) {
  const session = await requireAdmin();
  if (!session) {
    redirect("/login");
  }
  return <AdminLayoutClient>{children}</AdminLayoutClient>;
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense>
      <AuthGuard>{children}</AuthGuard>
    </Suspense>
  );
}
