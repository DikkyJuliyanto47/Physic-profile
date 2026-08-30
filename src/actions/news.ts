"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { ContentStatus } from "@/generated/prisma/client";

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
  category: string;
  excerpt?: string;
  content: string;
  imageUrl?: string;
  status: ContentStatus;
};

export type ActionResponse = {
  success: boolean;
  error?: string;
};

function validateCategory(category: string): string | null {
  const value = category.trim();

  if (!value) {
    return "Kategori wajib diisi.";
  }

  if (value.length > 50) {
    return "Kategori maksimal 50 karakter.";
  }

  return null;
}

export async function createNews(data: NewsInput): Promise<ActionResponse> {
  try {
    if (!data.title || data.title.trim().length === 0) {
      return { success: false, error: "Judul berita wajib diisi." };
    }

    if (!data.content || data.content.trim().length === 0) {
      return { success: false, error: "Konten berita wajib diisi." };
    }

    const categoryError = validateCategory(data.category);

    if (categoryError) {
      return { success: false, error: categoryError };
    }

    const session = await auth();

    if (!session?.user?.id) {
      return {
        success: false,
        error: "Anda harus login untuk membuat berita.",
      };
    }

    const slug = data.slug?.trim() || slugify(data.title);

    const existing = await prisma.news.findUnique({
      where: { slug },
    });

    if (existing) {
      return {
        success: false,
        error: "Slug berita sudah ada. Gunakan judul lain.",
      };
    }

    await prisma.news.create({
      data: {
        title: data.title.trim(),
        slug,
        category: data.category.trim(),
        excerpt: data.excerpt?.trim() || null,
        content: data.content.trim(),
        imageUrl: data.imageUrl?.trim() || null,
        status: data.status,
        publishedAt: data.status === "PUBLISHED" ? new Date() : null,
        authorId: session.user.id,
      },
    });

    revalidatePath("/admin/news");

    return { success: true };
  } catch {
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
    if (!data.title || data.title.trim().length === 0) {
      return { success: false, error: "Judul berita wajib diisi." };
    }

    if (!data.content || data.content.trim().length === 0) {
      return { success: false, error: "Konten berita wajib diisi." };
    }

    const categoryError = validateCategory(data.category);

    if (categoryError) {
      return { success: false, error: categoryError };
    }

    const slug = data.slug?.trim() || slugify(data.title);

    const existing = await prisma.news.findFirst({
      where: {
        slug,
        NOT: { id },
      },
    });

    if (existing) {
      return {
        success: false,
        error: "Slug berita sudah ada.",
      };
    }

    const current = await prisma.news.findUnique({
      where: { id },
    });

    if (!current) {
      return {
        success: false,
        error: "Berita tidak ditemukan.",
      };
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
        category: data.category.trim(),
        excerpt: data.excerpt?.trim() || null,
        content: data.content.trim(),
        imageUrl: data.imageUrl?.trim() || null,
        status: data.status,
        publishedAt,
      },
    });

    revalidatePath("/admin/news");
    revalidatePath(`/admin/news/${id}/edit`);

    return { success: true };
  } catch {
    return {
      success: false,
      error: "Gagal memperbarui berita.",
    };
  }
}

export async function deleteNews(id: string): Promise<ActionResponse> {
  try {
    const news = await prisma.news.findUnique({
      where: { id },
    });

    if (!news) {
      return {
        success: false,
        error: "Berita tidak ditemukan.",
      };
    }

    await prisma.news.delete({
      where: { id },
    });

    revalidatePath("/admin/news");

    return { success: true };
  } catch {
    return {
      success: false,
      error: "Gagal menghapus berita.",
    };
  }
}

export async function toggleNewsStatus(
  id: string,
): Promise<ActionResponse> {
  try {
    const news = await prisma.news.findUnique({
      where: { id },
    });

    if (!news) {
      return {
        success: false,
        error: "Berita tidak ditemukan.",
      };
    }

    const newStatus =
      news.status === "PUBLISHED"
        ? ContentStatus.DRAFT
        : ContentStatus.PUBLISHED;

    await prisma.news.update({
      where: { id },
      data: {
        status: newStatus,
        publishedAt:
          newStatus === "PUBLISHED" ? new Date() : null,
      },
    });

    revalidatePath("/admin/news");

    return { success: true };
  } catch {
    return {
      success: false,
      error: "Gagal mengubah status berita.",
    };
  }
}