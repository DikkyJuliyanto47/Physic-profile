"use server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-utils";
import { revalidatePath, updateTag } from "next/cache";
import { NewsCategory, ContentStatus } from "@/generated/prisma/client";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

export type NewsInput = {
  title: string;
  slug?: string;
  category: NewsCategory;
  excerpt?: string;
  content: string;
  imageUrl?: string;
  status: ContentStatus;
};

export type ActionResponse = {
  success: boolean;
  error?: string;
};

export async function createNews(data: NewsInput): Promise<ActionResponse> {
  try {
    if (!data.title || data.title.trim().length === 0) {
      return { success: false, error: "Judul berita wajib diisi." };
    }
    if (!data.content || data.content.trim().length === 0) {
      return { success: false, error: "Konten berita wajib diisi." };
    }

    const session = await requireAdmin();
    if (!session) {
      return { success: false, error: "Unauthorized. Silakan login." };
    }

    const slug = data.slug?.trim() || slugify(data.title);

    const existing = await prisma.news.findUnique({ where: { slug } });
    if (existing) {
      return { success: false, error: "Slug berita sudah ada. Gunakan judul lain." };
    }

    await prisma.news.create({
      data: {
        title: data.title.trim(),
        slug,
        category: data.category,
        excerpt: data.excerpt?.trim() || null,
        content: data.content.trim(),
        imageUrl: data.imageUrl?.trim() || null,
        status: data.status,
        publishedAt: data.status === "PUBLISHED" ? new Date() : null,
        authorId: session.user.id,
      },
    });

    updateTag("news");
    revalidatePath("/admin/news");
    revalidatePath("/news");
    return { success: true };
  } catch {
    return { success: false, error: "Gagal membuat berita. Silakan coba lagi." };
  }
}

export async function updateNews(
  id: string,
  data: NewsInput
): Promise<ActionResponse> {
  try {
    const session = await requireAdmin();
    if (!session) {
      return { success: false, error: "Unauthorized. Silakan login." };
    }

    if (!data.title || data.title.trim().length === 0) {
      return { success: false, error: "Judul berita wajib diisi." };
    }
    if (!data.content || data.content.trim().length === 0) {
      return { success: false, error: "Konten berita wajib diisi." };
    }

    const slug = data.slug?.trim() || slugify(data.title);

    const existing = await prisma.news.findFirst({
      where: { slug, NOT: { id } },
    });
    if (existing) {
      return { success: false, error: "Slug berita sudah ada." };
    }

    const current = await prisma.news.findUnique({ where: { id } });
    if (!current) {
      return { success: false, error: "Berita tidak ditemukan." };
    }

    const publishedAt =
      data.status === "PUBLISHED" && current.status !== "PUBLISHED"
        ? new Date()
        : data.status === "PUBLISHED"
          ? current.publishedAt
          : null;

    await prisma.news.update({
      where: { id },
      data: {
        title: data.title.trim(),
        slug,
        category: data.category,
        excerpt: data.excerpt?.trim() || null,
        content: data.content.trim(),
        imageUrl: data.imageUrl?.trim() || null,
        status: data.status,
        publishedAt,
      },
    });

    updateTag("news");
    revalidatePath("/admin/news");
    revalidatePath(`/admin/news/${id}/edit`);
    revalidatePath("/news");
    return { success: true };
  } catch {
    return { success: false, error: "Gagal memperbarui berita." };
  }
}

export async function deleteNews(id: string): Promise<ActionResponse> {
  try {
    const session = await requireAdmin();
    if (!session) {
      return { success: false, error: "Unauthorized. Silakan login." };
    }

    const news = await prisma.news.findUnique({ where: { id } });
    if (!news) {
      return { success: false, error: "Berita tidak ditemukan." };
    }

    await prisma.news.delete({ where: { id } });
    updateTag("news");
    revalidatePath("/admin/news");
    revalidatePath("/news");
    return { success: true };
  } catch {
    return { success: false, error: "Gagal menghapus berita." };
  }
}

export async function toggleNewsStatus(id: string): Promise<ActionResponse> {
  try {
    const session = await requireAdmin();
    if (!session) {
      return { success: false, error: "Unauthorized. Silakan login." };
    }

    const news = await prisma.news.findUnique({ where: { id } });
    if (!news) {
      return { success: false, error: "Berita tidak ditemukan." };
    }

    const newStatus =
      news.status === "PUBLISHED" ? ContentStatus.DRAFT : ContentStatus.PUBLISHED;

    await prisma.news.update({
      where: { id },
      data: {
        status: newStatus,
        publishedAt:
          newStatus === "PUBLISHED" ? new Date() : null,
      },
    });

    updateTag("news");
    revalidatePath("/admin/news");
    revalidatePath("/news");
    return { success: true };
  } catch {
    return { success: false, error: "Gagal mengubah status berita." };
  }
}
