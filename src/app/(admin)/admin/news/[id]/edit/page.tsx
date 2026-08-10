import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { NewsForm } from "@/components/admin/NewsForm";

export const metadata = {
  title: "Edit Berita - PSI Surabaya CMS",
};

export default async function EditNewsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const news = await prisma.news.findUnique({ where: { id } });

  if (!news) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">Edit Berita</h1>
        <p className="mt-1 text-sm text-neutral-500">
          Perbarui &ldquo;{news.title}&rdquo;.
        </p>
      </div>

      <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-card">
        <NewsForm mode="edit" initialData={news} />
      </div>
    </div>
  );
}
