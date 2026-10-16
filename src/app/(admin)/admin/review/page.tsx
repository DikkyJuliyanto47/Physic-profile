import { notFound } from "next/navigation";
import { requireSuperAdmin } from "@/lib/auth-utils";
import { ContentReviewQueue } from "@/components/admin/ContentReviewQueue";

export default async function ReviewPage({ searchParams }: {
  searchParams: Promise<{ kind?: string; review?: string; page?: string; result?: string }>;
}) {
  const session = await requireSuperAdmin();
  if (!session) notFound();
  return <div className="space-y-6 sm:space-y-8">
    <header><h1 className="text-xl font-bold text-neutral-900 sm:text-2xl">Review Konten</h1>
      <p className="mt-1 text-sm text-neutral-500">Tinjau perubahan dan penghapusan seluruh modul sebelum disetujui.</p></header>
    <ContentReviewQueue actor={session.user} own={false} params={await searchParams} />
  </div>;
}
