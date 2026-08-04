import { prisma } from "@/lib/prisma";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Galeri | PSI Surabaya",
  description: "Galeri foto dan video kegiatan Perhimpunan Fisikawan Indonesia Cabang Surabaya.",
};

export default async function GaleriPage() {
  const [featured, allMedia] = await Promise.all([
    prisma.gallery.findMany({
      where: { isFeatured: true },
      orderBy: { sortOrder: "asc" },
      take: 6,
      select: {
        id: true,
        title: true,
        mediaType: true,
        mediaUrl: true,
        category: true,
        description: true,
      },
    }),
    prisma.gallery.findMany({
      orderBy: { sortOrder: "asc" },
      select: {
        id: true,
        title: true,
        mediaType: true,
        mediaUrl: true,
        category: true,
        description: true,
      },
    }),
  ]);

  const categories = [...new Set(allMedia.map((m) => m.category).filter(Boolean))] as string[];

  function extractYouTubeId(url: string): string | null {
    const match = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
    return match?.[1] ?? null;
  }

  return (
    <div className="bg-neutral-50">
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-900 via-primary-800 to-primary-950 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl font-bold text-white sm:text-4xl">Galeri</h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-primary-200">
            Foto dan video kegiatan PSI Surabaya
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {allMedia.length === 0 ? (
          <div className="rounded-xl border border-neutral-200 bg-white py-16 text-center">
            <svg className="mx-auto h-12 w-12 text-neutral-300" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" />
            </svg>
            <p className="mt-4 text-neutral-500">Belum ada media di galeri.</p>
          </div>
        ) : (
          <>
            {/* Categories */}
            {categories.length > 0 && (
              <div className="mb-8 flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <span
                    key={cat}
                    className="inline-flex items-center rounded-full bg-white border border-neutral-200 px-4 py-2 text-sm font-medium text-neutral-600"
                  >
                    {cat}
                  </span>
                ))}
              </div>
            )}

            {/* Featured */}
            {featured.length > 0 && (
              <div className="mb-10">
                <h2 className="mb-5 text-xl font-bold text-neutral-900">Unggulan</h2>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {featured.map((item) => (
                    <div
                      key={item.id}
                      className="group overflow-hidden rounded-xl border border-primary-200 bg-white shadow-card"
                    >
                      {item.mediaType === "VIDEO" ? (
                        extractYouTubeId(item.mediaUrl) ? (
                          <div className="aspect-video">
                            <iframe
                              src={`https://www.youtube.com/embed/${extractYouTubeId(item.mediaUrl)}`}
                              className="h-full w-full"
                              allowFullScreen
                              title={item.title}
                            />
                          </div>
                        ) : (
                          <div className="aspect-video bg-neutral-900 flex items-center justify-center">
                            <svg className="h-12 w-12 text-neutral-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" />
                            </svg>
                          </div>
                        )
                      ) : (
                        <div className="aspect-video bg-neutral-100">
                          <img
                            src={item.mediaUrl}
                            alt={item.title}
                            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                        </div>
                      )}
                      <div className="p-4">
                        <div className="flex items-center gap-2">
                          <span className="inline-flex items-center rounded-full bg-primary-50 px-2 py-0.5 text-xs font-medium text-primary-700">
                            {item.mediaType === "VIDEO" ? "Video" : "Foto"}
                          </span>
                          {item.category && (
                            <span className="text-xs text-neutral-400">{item.category}</span>
                          )}
                        </div>
                        <h3 className="mt-2 font-semibold text-neutral-900">{item.title}</h3>
                        {item.description && (
                          <p className="mt-1 line-clamp-2 text-sm text-neutral-500">{item.description}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* All Media Grid */}
            <div>
              <h2 className="mb-5 text-xl font-bold text-neutral-900">Semua Media</h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {allMedia.map((item) => (
                  <div
                    key={item.id}
                    className="group overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-card transition-shadow hover:shadow-elevated"
                  >
                    {item.mediaType === "VIDEO" ? (
                      extractYouTubeId(item.mediaUrl) ? (
                        <div className="aspect-video">
                          <iframe
                            src={`https://www.youtube.com/embed/${extractYouTubeId(item.mediaUrl)}`}
                            className="h-full w-full"
                            allowFullScreen
                            title={item.title}
                          />
                        </div>
                      ) : (
                        <div className="aspect-video bg-neutral-900 flex items-center justify-center">
                          <svg className="h-10 w-10 text-neutral-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" />
                          </svg>
                        </div>
                      )
                    ) : (
                      <div className="aspect-video bg-neutral-100">
                        <img
                          src={item.mediaUrl}
                          alt={item.title}
                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      </div>
                    )}
                    <div className="p-3">
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center rounded-full bg-primary-50 px-2 py-0.5 text-xs font-medium text-primary-700">
                          {item.mediaType === "VIDEO" ? "Video" : "Foto"}
                        </span>
                        {item.category && (
                          <span className="text-xs text-neutral-400">{item.category}</span>
                        )}
                      </div>
                      <h3 className="mt-1.5 line-clamp-1 text-sm font-semibold text-neutral-900">{item.title}</h3>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
