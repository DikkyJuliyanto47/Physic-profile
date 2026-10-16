import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth-utils";
import { ContentReviewQueue } from "@/components/admin/ContentReviewQueue";

export default async function SubmissionsPage({ searchParams }: {
  searchParams: Promise<{ kind?: string; review?: string; page?: string; result?: string }>;
}) {
  const session = await requireAdmin();
  if (!session) notFound();
  return <div className="space-y-6 sm:space-y-8">
    <header><h1 className="text-xl font-bold text-neutral-900 sm:text-2xl">Pengajuan Saya</h1>
      <p className="mt-1 text-sm text-neutral-500">Pantau persetujuan, baca alasan penolakan, dan perbaiki pengajuan Anda.</p></header>
    <ContentReviewQueue actor={session.user} own params={await searchParams} />
  </div>;
}
