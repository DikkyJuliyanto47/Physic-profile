"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export type DocumentInput = {
  title: string;
  category: string;
  description?: string;
  fileUrl: string;
  fileType?: string;
  fileSize?: string;
  isPublic: boolean;
};

export type ActionResponse = {
  success: boolean;
  error?: string;
};

export async function createDocument(
  data: DocumentInput
): Promise<ActionResponse> {
  try {
    if (!data.title || data.title.trim().length === 0) {
      return { success: false, error: "Judul dokumen wajib diisi." };
    }
    if (!data.fileUrl || data.fileUrl.trim().length === 0) {
      return { success: false, error: "URL file wajib diisi." };
    }
    if (!data.category || data.category.trim().length === 0) {
      return { success: false, error: "Kategori wajib dipilih." };
    }

    const session = await auth();

    await prisma.documentResource.create({
      data: {
        title: data.title.trim(),
        category: data.category.trim(),
        description: data.description?.trim() || null,
        fileUrl: data.fileUrl.trim(),
        fileType: data.fileType?.trim() || null,
        fileSize: data.fileSize?.trim() || null,
        isPublic: data.isPublic,
        uploaderId: session?.user?.id || null,
      },
    });

    revalidatePath("/admin/documents");
    return { success: true };
  } catch {
    return {
      success: false,
      error: "Gagal membuat dokumen. Silakan coba lagi.",
    };
  }
}

export async function updateDocument(
  id: string,
  data: DocumentInput
): Promise<ActionResponse> {
  try {
    if (!data.title || data.title.trim().length === 0) {
      return { success: false, error: "Judul dokumen wajib diisi." };
    }
    if (!data.fileUrl || data.fileUrl.trim().length === 0) {
      return { success: false, error: "URL file wajib diisi." };
    }

    const doc = await prisma.documentResource.findUnique({ where: { id } });
    if (!doc) {
      return { success: false, error: "Dokumen tidak ditemukan." };
    }

    await prisma.documentResource.update({
      where: { id },
      data: {
        title: data.title.trim(),
        category: data.category.trim(),
        description: data.description?.trim() || null,
        fileUrl: data.fileUrl.trim(),
        fileType: data.fileType?.trim() || null,
        fileSize: data.fileSize?.trim() || null,
        isPublic: data.isPublic,
      },
    });

    revalidatePath("/admin/documents");
    revalidatePath(`/admin/documents/${id}/edit`);
    return { success: true };
  } catch {
    return { success: false, error: "Gagal memperbarui dokumen." };
  }
}

export async function deleteDocument(id: string): Promise<ActionResponse> {
  try {
    const doc = await prisma.documentResource.findUnique({ where: { id } });
    if (!doc) {
      return { success: false, error: "Dokumen tidak ditemukan." };
    }

    await prisma.documentResource.delete({ where: { id } });
    revalidatePath("/admin/documents");
    return { success: true };
  } catch {
    return { success: false, error: "Gagal menghapus dokumen." };
  }
}

export async function toggleDocumentVisibility(
  id: string
): Promise<ActionResponse> {
  try {
    const doc = await prisma.documentResource.findUnique({ where: { id } });
    if (!doc) {
      return { success: false, error: "Dokumen tidak ditemukan." };
    }

    await prisma.documentResource.update({
      where: { id },
      data: { isPublic: !doc.isPublic },
    });

    revalidatePath("/admin/documents");
    return { success: true };
  } catch {
    return {
      success: false,
      error: "Gagal mengubah visibilitas dokumen.",
    };
  }
}
