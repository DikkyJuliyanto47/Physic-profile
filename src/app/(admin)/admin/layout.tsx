import { Suspense } from "react";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth-utils";
import { AdminLayoutClient } from "./AdminLayoutClient";
import Link from "next/link";

async function AuthGuard({ children }: { children: React.ReactNode }) {
  const session = await requireAdmin();
  if (!session) {
    redirect("/login");
  }
  return (
    <AdminLayoutClient>
      {session.user.role === "ADMIN" && (
        <p className="mb-6 rounded-md border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
          Penambahan, perubahan, dan penghapusan konten menunggu persetujuan
          Admin PSI Surabaya.{" "}
          <Link href="/admin/submissions" className="font-semibold underline">
            Lihat Pengajuan Saya
          </Link>
        </p>
      )}
      {children}
    </AdminLayoutClient>
  );
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
