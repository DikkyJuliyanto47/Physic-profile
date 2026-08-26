import { prisma } from "@/lib/prisma";

export interface NewsItem {
  id: string;
  title: string;
  date: string;
  excerpt: string;
  image: string;
  href: string;
  category: string;
}

interface GetNewsOptions {
  query?: string;
  category?: string;
  page?: number;
  limit?: number;
}

function formatNewsDate(date: Date): string {
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

export async function getLatestNews(limit = 3): Promise<NewsItem[]> {
  return getNews({ limit });
}

export async function getNews({
  query,
  category,
  page = 1,
  limit = 10,
}: GetNewsOptions = {}): Promise<NewsItem[]> {
  const normalizedQuery = query?.trim();
  const normalizedCategory = category?.trim();

  const items = await prisma.news.findMany({
    where: {
      status: "PUBLISHED",
      ...(normalizedCategory && {
        category: normalizedCategory as never,
      }),
      ...(normalizedQuery && {
        OR: [
          {
            title: {
              contains: normalizedQuery,
              mode: "insensitive",
            },
          },
          {
            excerpt: {
              contains: normalizedQuery,
              mode: "insensitive",
            },
          },
        ],
      }),
    },
    select: {
      id: true,
      title: true,
      slug: true,
      excerpt: true,
      imageUrl: true,
      category: true,
      publishedAt: true,
      createdAt: true,
    },
    orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
    skip: Math.max(0, page - 1) * limit,
    take: limit,
  });

  return items.map((item) => ({
    id: item.id,
    title: item.title,
    date: formatNewsDate(item.publishedAt ?? item.createdAt),
    excerpt: item.excerpt ?? "Berita PSI Cabang Surabaya.",
    image: item.imageUrl ?? "/assets/hero/pertemuan-07-27-02.jpeg",
    href: `/news/${item.slug}`,
    category: item.category,
  }));
}