"use server";

import { ContentWorkflowError, assertEditable, assertVersion, publicationReview } from "@/lib/content-workflow";
import { requireAdmin } from "@/lib/auth-utils";
import { reviewContent } from "./content-review";
import { prisma } from "@/lib/prisma";
import { mutateWithMedia } from "@/lib/media-lifecycle";
import { ContentStatus, NewsCategory } from "@/generated/prisma/client";
import { revalidatePath, updateTag } from "next/cache";
import { parseNewsEventDate } from "@/lib/news-event-date";

export type NewsInput = {
  contentVersion?: number;
  title: string;
  category: NewsCategory;
  excerpt?: string;
  content: string;
  imageUrl?: string;
  status: ContentStatus;
  eventDate?: string;
};

export type ActionResponse = {
  success: boolean;
  id?: string;
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
  if (data.eventDate !== undefined &&
    (typeof data.eventDate !== "string" ||
      (data.eventDate !== "" && !parseNewsEventDate(data.eventDate)))) {
    return "Tanggal kegiatan tidak valid.";
  }

  if (data.excerpt && data.excerpt.trim().length > 1000) {
    return "Ringkasan maksimal 1000 karakter.";
  }

  return null;
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
  revalidatePath("/admin");
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

    const slug = slugify(data.title);

    if (!slug) {
      return { success: false, error: "Judul berita harus mengandung huruf atau angka." };
    }

    const existing = await prisma.news.findUnique({
      where: { slug },
      select: { id: true },
    });

    if (existing) {
      return {
        success: false,
        error: "Judul berita menghasilkan alamat yang sudah digunakan. Gunakan judul lain.",
      };
    }

    const reviewStatus = publicationReview(session.user, data.status);
    const created = await mutateWithMedia(data, (tx) => tx.news.create({
      data: {
        title: data.title.trim(),
        slug,
        category: data.category,
        excerpt: data.excerpt?.trim() || null,
        content: data.content.trim(),
        imageUrl: data.imageUrl?.trim() || null,
        status: data.status,
        reviewStatus,
        reviewerId: reviewStatus === "APPROVED" ? session.user.id : null,
        reviewedAt: reviewStatus === "APPROVED" ? new Date() : null,
        publishedAt:
          data.status === ContentStatus.PUBLISHED ? new Date() : null,
        authorId: session.user.id,
        eventDate: data.eventDate ? parseNewsEventDate(data.eventDate) : null,
      },
    }));

    revalidateNews();

    return { success: true, id: created.id };
  } catch (error) {
    if (error instanceof ContentWorkflowError) return { success: false, error: error.message };
    if (isUniqueConstraintError(error)) {
      return {
        success: false,
        error: "Judul berita menghasilkan alamat yang sudah digunakan. Gunakan judul lain.",
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
        slug: true,
        status: true,
        publishedAt: true,
        authorId: true,
        reviewStatus: true,
        contentVersion: true,
      },
    });

    if (!current) {
      return { success: false, error: "Berita tidak ditemukan." };
    }

    const publishedAt =
      data.status === ContentStatus.PUBLISHED
        ? current.status === ContentStatus.PUBLISHED
          ? current.publishedAt
          : new Date()
        : null;

    await mutateWithMedia(data, async (tx) => {
      const currentRecord = await tx.news.findUnique({ where: { id } });
      if (!currentRecord) throw new Error("Konten tidak ditemukan.");
      assertVersion(currentRecord, data.contentVersion);
      assertEditable(session.user, currentRecord);
      const reviewStatus = publicationReview(session.user, data.status);
      return tx.news.update({
        where: { id, contentVersion: currentRecord.contentVersion },
        data: {
          reviewStatus: session.user.role === "ADMIN" && currentRecord.reviewStatus === "REVISION_REQUIRED"
            ? "REVISION_REQUIRED" : reviewStatus,
          reviewerId: reviewStatus === "APPROVED" ? session.user.id : null,
          reviewedAt: reviewStatus === "APPROVED" ? new Date() : null,
          contentVersion: { increment: 1 },
          title: data.title.trim(),
          category: data.category,
          excerpt: data.excerpt?.trim() || null,
          content: data.content.trim(),
          imageUrl: data.imageUrl?.trim() || null,
          status: data.status,
          publishedAt,
          eventDate: data.eventDate === undefined
            ? undefined
            : data.eventDate ? parseNewsEventDate(data.eventDate) : null,
        },
      });
    }, (tx) => tx.news.findUnique({ where: { id } }));

    revalidateNews();
    revalidatePath(`/news/${current.slug}`);

    return { success: true };
  } catch (error) {
    if (error instanceof ContentWorkflowError) return { success: false, error: error.message };
    if (isUniqueConstraintError(error)) {
      return {
        success: false,
        error: "Judul berita menghasilkan alamat yang sudah digunakan. Gunakan judul lain.",
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
      select: { id: true, slug: true, authorId: true, status: true, reviewStatus: true, contentVersion: true },
    });

    if (!news) {
      return { success: false, error: "Berita tidak ditemukan." };
    }

    assertEditable(session.user, news);
    await mutateWithMedia(null, (tx) => tx.news.delete({
      where: { id, contentVersion: news.contentVersion },
    }), (tx) => tx.news.findUnique({ where: { id } }));

    revalidateNews();
    revalidatePath(`/news/${news.slug}`);

    return { success: true };
  } catch (error) {
    if (error instanceof ContentWorkflowError) return { success: false, error: error.message };
    return {
      success: false,
      error: "Gagal menghapus berita. Silakan coba lagi.",
    };
  }
}

export async function toggleNewsStatus(id: string, version?: number): Promise<ActionResponse> {
  const session = await requireAdmin();
  if (session?.user.role !== "SUPER_ADMIN") {
    return { success: false, error: "Akses Super Admin diperlukan." };
  }
  const current = await prisma.news.findUnique({ where: { id } });
  if (!current || version === undefined) return { success: false, error: "Muat ulang konten." };
  return reviewContent("news", id, version,
    current.status === "PUBLISHED" ? "unpublish" : "publish");
}
