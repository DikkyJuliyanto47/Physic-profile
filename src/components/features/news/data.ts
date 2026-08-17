
import { prisma } from "@/lib/prisma";

export interface NewsItem {
  id: string;
  title: string;
  date: string;
  excerpt: string;
  image: string;
  href: string;
}

function formatNewsDate(date: Date): string {
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

export async function getLatestNews(limit?: number): Promise<NewsItem[]> {
  const items = await prisma.news.findMany({
    where: { status: "PUBLISHED" },
    select: {
      id: true,
      title: true,
      slug: true,
      excerpt: true,
      imageUrl: true,
      publishedAt: true,
      createdAt: true,
    },
    orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
    ...(limit ? { take: limit } : {}),
  });

  return items.map((item) => ({
    id: item.id,
    title: item.title,
    date: formatNewsDate(item.publishedAt ?? item.createdAt),
    excerpt: item.excerpt ?? "Berita PSI Cabang Surabaya.",
    image: item.imageUrl ?? "/assets/hero/pertemuan-07-27-02.jpeg",
    href: item.slug ? `/news/${item.slug}` : "/news",
  }));
}
