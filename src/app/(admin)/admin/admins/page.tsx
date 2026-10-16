import { notFound } from "next/navigation";
import { requireSuperAdmin } from "@/lib/auth-utils";
import { prisma } from "@/lib/prisma";
import { AdminAccounts } from "@/components/admin/AdminAccounts";

export const dynamic = "force-dynamic";

export default async function AdminAccountsPage() {
  if (!await requireSuperAdmin()) notFound();
  const accounts = await prisma.user.findMany({
    orderBy: [{ createdAt: "desc" }, { id: "asc" }],
    select: { id: true, name: true, email: true, role: true, isActive: true },
  });
  return (
    <div className="w-full min-w-0 space-y-6 sm:space-y-8">
      <header>
        <h1 className="text-xl font-bold tracking-tight text-neutral-900 sm:text-2xl">Manage Admin</h1>
        <p className="mt-1 text-sm leading-6 text-neutral-500">Kelola akun dan akses administrator PSI Cabang Surabaya.</p>
      </header>
      <AdminAccounts accounts={accounts} />
    </div>
  );
}
