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

export async function createGallery(
  data: GalleryInput
): Promise<ActionResponse> {
  try {
    const session = await requireAdmin();
    if (!session) {
      return { success: false, error: "Unauthorized. Silakan login." };
    }

    if (!data.title || data.title.trim().length === 0) {
      return { success: false, error: "Judul wajib diisi." };
    }
    if (!data.mediaUrl || data.mediaUrl.trim().length === 0) {
      return { success: false, error: "URL media wajib diisi." };
    }

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

    if (!data.title || data.title.trim().length === 0) {
      return { success: false, error: "Judul wajib diisi." };
    }
    if (!data.mediaUrl || data.mediaUrl.trim().length === 0) {
      return { success: false, error: "URL media wajib diisi." };
    }

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
