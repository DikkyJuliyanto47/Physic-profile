"use server";

import { requireAdmin } from "@/lib/auth-utils";
import { prisma } from "@/lib/prisma";
import { ContentStatus, NewsCategory } from "@/generated/prisma/client";
import { revalidatePath, updateTag } from "next/cache";

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

function slugify(text: string): string {
  return text
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function validateInput(data: NewsInput): string | null {
  if (!data.title?.trim()) return "Judul berita wajib diisi.";
  if (data.title.trim().length > 200) return "Judul berita maksimal 200 karakter.";
  if (!data.content?.trim()) return "Konten berita wajib diisi.";
  if (!data.category) return "Kategori berita wajib dipilih.";
  if (!data.status) return "Status berita wajib dipilih.";

  if (data.excerpt && data.excerpt.trim().length > 1000) {
    return "Ringkasan maksimal 1000 karakter.";
  }

  return null;
}

function getSlug(data: NewsInput): string {
  return data.slug?.trim() || slugify(data.title);
}

function isUniqueConstraintError(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code?: string }).code === "P2002"
  );
}

function revalidateNews(): void {
  updateTag("news");
  revalidatePath("/news");
  revalidatePath("/admin/news");
}

export async function createNews(data: NewsInput): Promise<ActionResponse> {
  try {
    const session = await requireAdmin();

    if (!session?.user?.id) {
      return { success: false, error: "Unauthorized. Silakan login." };
    }

    const validationError = validateInput(data);
    if (validationError) {
      return { success: false, error: validationError };
    }

    if (data.status === ContentStatus.ARCHIVED) {
      return {
        success: false,
        error: "Berita baru tidak dapat langsung diarsipkan.",
      };
    }

    const slug = getSlug(data);

    if (!slug) {
      return { success: false, error: "Slug berita tidak valid." };
    }

    const existing = await prisma.news.findUnique({
      where: { slug },
      select: { id: true },
    });

    if (existing) {
      return {
        success: false,
        error: "Slug berita sudah digunakan. Gunakan slug lain.",
      };
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
        publishedAt:
          data.status === ContentStatus.PUBLISHED ? new Date() : null,
        authorId: session.user.id,
      },
    });

    revalidateNews();

    return { success: true };
  } catch (error) {
    if (isUniqueConstraintError(error)) {
      return {
        success: false,
        error: "Slug berita sudah digunakan. Gunakan slug lain.",
      };
    }

    return {
      success: false,
      error: "Gagal membuat berita. Silakan coba lagi.",
    };
  }
}

export async function updateNews(
  id: string,
  data: NewsInput,
): Promise<ActionResponse> {
  try {
    const session = await requireAdmin();

    if (!session?.user?.id) {
      return { success: false, error: "Unauthorized. Silakan login." };
    }

    const validationError = validateInput(data);
    if (validationError) {
      return { success: false, error: validationError };
    }

    const current = await prisma.news.findUnique({
      where: { id },
      select: {
        id: true,
        status: true,
        publishedAt: true,
      },
    });

    if (!current) {
      return { success: false, error: "Berita tidak ditemukan." };
    }

    const slug = getSlug(data);

    if (!slug) {
      return { success: false, error: "Slug berita tidak valid." };
    }

    const existing = await prisma.news.findFirst({
      where: {
        slug,
        NOT: { id },
      },
      select: { id: true },
    });

    if (existing) {
      return {
        success: false,
        error: "Slug berita sudah digunakan. Gunakan slug lain.",
      };
    }

    const publishedAt =
      data.status === ContentStatus.PUBLISHED
        ? current.status === ContentStatus.PUBLISHED
          ? current.publishedAt
          : new Date()
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

    revalidateNews();
    revalidatePath(`/news/${slug}`);

    return { success: true };
  } catch (error) {
    if (isUniqueConstraintError(error)) {
      return {
        success: false,
        error: "Slug berita sudah digunakan. Gunakan slug lain.",
      };
    }

    return {
      success: false,
      error: "Gagal memperbarui berita. Silakan coba lagi.",
    };
  }
}

export async function deleteNews(id: string): Promise<ActionResponse> {
  try {
    const session = await requireAdmin();

    if (!session?.user?.id) {
      return { success: false, error: "Unauthorized. Silakan login." };
    }

    const news = await prisma.news.findUnique({
      where: { id },
      select: { id: true, slug: true },
    });

    if (!news) {
      return { success: false, error: "Berita tidak ditemukan." };
    }

    await prisma.news.delete({
      where: { id },
    });

    revalidateNews();
    revalidatePath(`/news/${news.slug}`);

    return { success: true };
  } catch {
    return {
      success: false,
      error: "Gagal menghapus berita. Silakan coba lagi.",
    };
  }
}

export async function toggleNewsStatus(
  id: string,
): Promise<ActionResponse> {
  try {
    const session = await requireAdmin();

    if (!session?.user?.id) {
      return { success: false, error: "Unauthorized. Silakan login." };
    }

    const news = await prisma.news.findUnique({
      where: { id },
      select: {
        id: true,
        status: true,
      },
    });

    if (!news) {
      return { success: false, error: "Berita tidak ditemukan." };
    }

    if (
      news.status !== ContentStatus.DRAFT &&
      news.status !== ContentStatus.PUBLISHED
    ) {
      return {
        success: false,
        error: "Berita terarsip hanya dapat diubah melalui form edit.",
      };
    }

    const newStatus =
      news.status === ContentStatus.PUBLISHED
        ? ContentStatus.DRAFT
        : ContentStatus.PUBLISHED;

    await prisma.news.update({
      where: { id },
      data: {
        status: newStatus,
        publishedAt:
          newStatus === ContentStatus.PUBLISHED ? new Date() : null,
      },
    });

    revalidateNews();

    return { success: true };
  } catch {
    return {
      success: false,
      error: "Gagal mengubah status berita. Silakan coba lagi.",
    };
  }
}