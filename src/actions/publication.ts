"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { PublicationType } from "@/generated/prisma/client";

export type PublicationInput = {
  title: string;
  type: PublicationType;
  description?: string;
  externalUrl?: string;
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
        publishedAt,
      },
    });

    revalidatePath("/admin/publication");
    revalidatePath("/research-publication");
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
        publishedAt,
      },
    });

    revalidatePath("/admin/publication");
    revalidatePath("/research-publication");
    revalidatePath(`/admin/publication/${id}/edit`);
    return { success: true };
  } catch {
    return { success: false, error: "Gagal memperbarui publikasi." };
  }
}

export async function deletePublication(id: string): Promise<ActionResponse> {
  try {
    const publication = await prisma.publication.findUnique({
      where: { id },
    });
    if (!publication) {
      return { success: false, error: "Publikasi tidak ditemukan." };
    }

    await prisma.publication.delete({ where: { id } });
    revalidatePath("/admin/publication");
    revalidatePath("/research-publication");
    return { success: true };
  } catch {
    return { success: false, error: "Gagal menghapus publikasi." };
  }
}
