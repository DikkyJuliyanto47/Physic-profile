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

  const news = await prisma.news.findUnique({
    where: { id },
  });

  if (!news) {
    notFound();
  }

  return (
    <div className="w-full min-w-0">
      <div className="mx-auto w-full max-w-4xl space-y-6 sm:space-y-8">
        <header className="min-w-0">
          <p className="mb-1 text-xs font-medium uppercase tracking-wide text-primary-600">
            Berita
          </p>
          <h1 className="text-xl font-bold tracking-tight text-neutral-900 sm:text-2xl">
            Edit Berita
          </h1>
          <p className="mt-1 max-w-2xl truncate text-sm leading-6 text-neutral-500">
            Perbarui &ldquo;{news.title}&rdquo;.
          </p>
        </header>

        <div className="overflow-hidden rounded-lg border border-neutral-200 bg-white shadow-card">
          <div className="border-b border-neutral-100 px-5 py-4 sm:px-6">
            <p className="text-sm font-semibold text-neutral-900">
              Informasi Berita
            </p>
            <p className="mt-0.5 text-xs text-neutral-500">
              Perbarui konten dan pengaturan publikasi berita.
            </p>
          </div>

          <div className="p-5 sm:p-6 lg:p-7">
            <NewsForm mode="edit" initialData={news} />
          </div>
        </div>
      </div>
    </div>
  );
}