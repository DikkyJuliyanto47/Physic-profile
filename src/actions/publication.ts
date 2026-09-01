"use server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-utils";
import { revalidatePath, updateTag } from "next/cache";
import { PublicationType } from "@/generated/prisma/client";

export type PublicationInput = {
  title: string;
  type: PublicationType;
  description?: string;
  externalUrl?: string;
  fileUrl?: string;
  publishedAt?: string;
};

export type ActionResponse = {
  success: boolean;
  error?: string;
};

export async function createPublication(
  data: PublicationInput
): Promise<ActionResponse> {
  try {
    const session = await requireAdmin();
    if (!session) {
      return { success: false, error: "Unauthorized. Silakan login." };
    }

    if (!data.title || data.title.trim().length === 0) {
      return { success: false, error: "Judul publikasi wajib diisi." };
    }

    const publishedAt = data.publishedAt
      ? new Date(data.publishedAt)
      : null;

    await prisma.publication.create({
      data: {
        title: data.title.trim(),
        type: data.type,
        description: data.description?.trim() || null,
        externalUrl: data.externalUrl?.trim() || null,
        fileUrl: data.fileUrl?.trim() || null,
        publishedAt,
      },
    });

    updateTag("publications");
    revalidatePath("/admin/publication");
    return { success: true };
  } catch {
    return {
      success: false,
      error: "Gagal membuat publikasi. Silakan coba lagi.",
    };
  }
}

export async function updatePublication(
  id: string,
  data: PublicationInput
): Promise<ActionResponse> {
  try {
    const session = await requireAdmin();
    if (!session) {
      return { success: false, error: "Unauthorized. Silakan login." };
    }

    if (!data.title || data.title.trim().length === 0) {
      return { success: false, error: "Judul publikasi wajib diisi." };
    }

    const publication = await prisma.publication.findUnique({
      where: { id },
    });
    if (!publication) {
      return { success: false, error: "Publikasi tidak ditemukan." };
    }

    const publishedAt = data.publishedAt
      ? new Date(data.publishedAt)
      : null;

    await prisma.publication.update({
      where: { id },
      data: {
        title: data.title.trim(),
        type: data.type,
        description: data.description?.trim() || null,
        externalUrl: data.externalUrl?.trim() || null,
        fileUrl: data.fileUrl?.trim() || null,
        publishedAt,
      },
    });

    updateTag("publications");
    revalidatePath("/admin/publication");
    revalidatePath(`/admin/publication/${id}/edit`);
    return { success: true };
  } catch {
    return { success: false, error: "Gagal memperbarui publikasi." };
  }
}

export async function deletePublication(id: string): Promise<ActionResponse> {
  try {
    const session = await requireAdmin();
    if (!session) {
      return { success: false, error: "Unauthorized. Silakan login." };
    }

    const publication = await prisma.publication.findUnique({
      where: { id },
    });
    if (!publication) {
      return { success: false, error: "Publikasi tidak ditemukan." };
    }

    await prisma.publication.delete({ where: { id } });
    updateTag("publications");
    revalidatePath("/admin/publication");
    return { success: true };
  } catch {
    return { success: false, error: "Gagal menghapus publikasi." };
  }
}
