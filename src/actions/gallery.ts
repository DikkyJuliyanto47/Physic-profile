"use server";

import { prisma } from "@/lib/prisma";
import { mutateWithMedia } from "@/lib/media-lifecycle";
import { requireAdmin } from "@/lib/auth-utils";
import { revalidatePath, updateTag } from "next/cache";
import { MediaType } from "@/generated/prisma/client";

export type GalleryInput = {
  title: string;
  mediaType: MediaType;
  mediaUrl: string;
  category?: string;
  description?: string;
  isFeatured: boolean;
  sortOrder: number;
};

export type ActionResponse = {
  success: boolean;
  error?: string;
};

function isCompatibleMediaUrl(value: string, mediaType: MediaType): boolean {
  if (/[\s\\\u0000-\u001f\u007f]/u.test(value) || /%(?![a-f0-9]{2})/i.test(value)) return false;
  const local = value.startsWith("/") && !value.startsWith("//");
  if (!local && !/^https?:\/\//i.test(value)) return false;
  try {
    const url = new URL(value, "https://gallery.invalid");
    if (!local && (url.protocol !== "http:" && url.protocol !== "https:")) return false;
    if (url.username || url.password) return false;
    if (mediaType === MediaType.PHOTO) return true;
    if (local || url.port) return false;

    let videoId: string | null = null;
    if (["youtube.com", "www.youtube.com", "m.youtube.com"].includes(url.hostname)) {
      if (url.pathname === "/watch") videoId = url.searchParams.get("v");
      else videoId = /^\/embed\/([a-zA-Z0-9_-]{11})\/?$/.exec(url.pathname)?.[1] ?? null;
    } else if (url.hostname === "youtu.be") {
      videoId = /^\/([a-zA-Z0-9_-]{11})\/?$/.exec(url.pathname)?.[1] ?? null;
    }
    
    const renderedId = /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/.exec(value)?.[1];
    return videoId !== null && /^[a-zA-Z0-9_-]{11}$/.test(videoId) && renderedId === videoId;
  } catch {
    return false;
  }
}

function validateGalleryInput(data: GalleryInput): string | null {
  if (!data || typeof data !== "object" || Array.isArray(data)) return "Data galeri tidak valid.";
  if (typeof data.title !== "string" || !data.title.trim()) return "Judul wajib diisi.";
  if (typeof data.mediaUrl !== "string" || !data.mediaUrl.trim()) return "URL media wajib diisi.";
  if (!Object.values(MediaType).some((value) => value === data.mediaType)) return "Jenis media tidak valid.";
  if (!isCompatibleMediaUrl(data.mediaUrl.trim(), data.mediaType)) {
    return data.mediaType === MediaType.VIDEO
      ? "URL video harus berupa URL YouTube watch, embed, atau youtu.be yang didukung."
      : "URL foto harus berupa path lokal aplikasi atau URL HTTP/HTTPS yang valid.";
  }
  if (typeof data.isFeatured !== "boolean") return "Status unggulan harus berupa boolean.";
  if (!Number.isInteger(data.sortOrder) || data.sortOrder < -2147483648 || data.sortOrder > 2147483647) {
    return "Urutan harus bilangan bulat dalam rentang -2147483648 sampai 2147483647.";
  }
  if ([data.category, data.description].some((value) => value != null && typeof value !== "string")) {
    return "Kategori dan deskripsi harus berupa teks.";
  }
  return null;
}

export async function createGallery(
  data: GalleryInput
): Promise<ActionResponse> {
  try {
    const session = await requireAdmin();
    if (!session) {
      return { success: false, error: "Unauthorized. Silakan login." };
    }

    const validationError = validateGalleryInput(data);
    if (validationError) return { success: false, error: validationError };

    await mutateWithMedia(data, (tx) => tx.gallery.create({
      data: {
        title: data.title.trim(),
        mediaType: data.mediaType,
        mediaUrl: data.mediaUrl.trim(),
        category: data.category?.trim() || null,
        description: data.description?.trim() || null,
        isFeatured: data.isFeatured,
        sortOrder: data.sortOrder,
      },
    }));

    updateTag("gallery");
    revalidatePath("/admin/gallery");
    return { success: true };
  } catch {
    return {
      success: false,
      error: "Gagal membuat item galeri. Silakan coba lagi.",
    };
  }
}

export async function updateGallery(
  id: string,
  data: GalleryInput
): Promise<ActionResponse> {
  try {
    const session = await requireAdmin();
    if (!session) {
      return { success: false, error: "Unauthorized. Silakan login." };
    }

    const validationError = validateGalleryInput(data);
    if (validationError) return { success: false, error: validationError };

    const item = await prisma.gallery.findUnique({ where: { id } });
    if (!item) {
      return { success: false, error: "Item galeri tidak ditemukan." };
    }

    await mutateWithMedia(data, (tx) => tx.gallery.update({
      where: { id },
      data: {
        title: data.title.trim(),
        mediaType: data.mediaType,
        mediaUrl: data.mediaUrl.trim(),
        category: data.category?.trim() || null,
        description: data.description?.trim() || null,
        isFeatured: data.isFeatured,
        sortOrder: data.sortOrder,
      },
    }), (tx) => tx.gallery.findUnique({ where: { id } }));

    updateTag("gallery");
    revalidatePath("/admin/gallery");
    revalidatePath(`/admin/gallery/${id}/edit`);
    return { success: true };
  } catch {
    return { success: false, error: "Gagal memperbarui item galeri." };
  }
}

export async function deleteGallery(
  id: string
): Promise<ActionResponse> {
  try {
    const session = await requireAdmin();
    if (!session) {
      return { success: false, error: "Unauthorized. Silakan login." };
    }

    const item = await prisma.gallery.findUnique({ where: { id } });
    if (!item) {
      return { success: false, error: "Item galeri tidak ditemukan." };
    }

    await mutateWithMedia(null, (tx) => tx.gallery.delete({ where: { id } }), (tx) => tx.gallery.findUnique({ where: { id } }));
    updateTag("gallery");
    revalidatePath("/admin/gallery");
    return { success: true };
  } catch {
    return { success: false, error: "Gagal menghapus item galeri." };
  }
}

export const createGalleryItem = createGallery;
export const updateGalleryItem = updateGallery;
export const deleteGalleryItem = deleteGallery;
