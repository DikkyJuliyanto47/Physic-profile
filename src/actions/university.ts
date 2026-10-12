"use server";

import { prisma } from "@/lib/prisma";
import { mutateWithMedia } from "@/lib/media-lifecycle";
import { requireAdmin } from "@/lib/auth-utils";
import { revalidatePath, updateTag } from "next/cache";
import { Prisma } from "@/generated/prisma/client";

class UniversityDeletionError extends Error {}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export type UniversityInput = {
  name: string;
  shortName?: string;
  address?: string;
  deptUrl?: string;
  websiteUrl?: string;
  logoUrl?: string;
  description?: string;
};

export type ActionResponse = {
  success: boolean;
  error?: string;
};

export async function createUniversity(
  data: UniversityInput
): Promise<ActionResponse> {
  try {
    const session = await requireAdmin();
    if (!session) {
      return { success: false, error: "Unauthorized. Silakan login." };
    }

    if (!data.name || data.name.trim().length === 0) {
      return { success: false, error: "Nama kampus wajib diisi." };
    }

    const slug = slugify(data.name);
    if (!slug) {
      return { success: false, error: "Nama kampus harus mengandung huruf atau angka." };
    }

    const existing = await prisma.university.findFirst({
      where: { OR: [{ name: data.name }, { slug }] },
    });

    if (existing) {
      return {
        success: false,
        error: "Nama kampus atau alamat yang dihasilkan sudah digunakan. Gunakan nama lain.",
      };
    }

    await mutateWithMedia(data, (tx) => tx.university.create({
      data: {
        name: data.name.trim(),
        slug,
        shortName: data.shortName?.trim() || null,
        address: data.address?.trim() || null,
        deptUrl: data.deptUrl?.trim() || null,
        websiteUrl: data.websiteUrl?.trim() || null,
        logoUrl: data.logoUrl?.trim() || null,
        description: data.description?.trim() || null,
      },
    }));

    updateTag("universities");
    updateTag("members");
    revalidatePath("/");
    revalidatePath("/admin");
    revalidatePath("/admin/universities");
    return { success: true };
  } catch {
    return { success: false, error: "Gagal membuat kampus. Silakan coba lagi." };
  }
}

export async function updateUniversity(
  id: string,
  data: UniversityInput
): Promise<ActionResponse> {
  try {
    const session = await requireAdmin();
    if (!session) {
      return { success: false, error: "Unauthorized. Silakan login." };
    }

    if (!data.name || data.name.trim().length === 0) {
      return { success: false, error: "Nama kampus wajib diisi." };
    }

    const existing = await prisma.university.findFirst({
      where: {
        name: data.name,
        NOT: { id },
      },
    });

    if (existing) {
      return {
        success: false,
        error: "Nama kampus sudah ada. Gunakan nama lain.",
      };
    }

    await mutateWithMedia(data, (tx) => tx.university.update({
      where: { id },
      data: {
        name: data.name.trim(),
        shortName: data.shortName?.trim() || null,
        address: data.address?.trim() || null,
        deptUrl: data.deptUrl?.trim() || null,
        websiteUrl: data.websiteUrl?.trim() || null,
        logoUrl: data.logoUrl?.trim() || null,
        description: data.description?.trim() || null,
      },
    }), (tx) => tx.university.findUnique({ where: { id } }));

    updateTag("universities");
    updateTag("members");
    revalidatePath("/");
    revalidatePath("/admin");
    revalidatePath("/admin/universities");
    revalidatePath(`/admin/universities/${id}/edit`);
    return { success: true };
  } catch {
    return { success: false, error: "Gagal memperbarui kampus. Silakan coba lagi." };
  }
}

export async function deleteUniversity(id: string): Promise<ActionResponse> {
  try {
    const session = await requireAdmin();
    if (!session) {
      return { success: false, error: "Unauthorized. Silakan login." };
    }

    await mutateWithMedia(null, async (tx) => {
      
      const universities = await tx.$queryRaw<Array<{ id: string }>>`
        SELECT "id" FROM "University" WHERE "id" = ${id} FOR UPDATE
      `;
      if (!universities.length) throw new UniversityDeletionError("Kampus tidak ditemukan.");

      const memberCount = await tx.memberProfile.count({ where: { institutionId: id } });
      if (memberCount > 0) {
        throw new UniversityDeletionError(
          `Tidak dapat menghapus kampus yang memiliki ${memberCount} anggota terdaftar. Hapus atau pindahkan anggota terlebih dahulu.`,
        );
      }
      return tx.university.delete({ where: { id } });
    }, (tx) => tx.university.findUnique({ where: { id } }), {
      isolationLevel: Prisma.TransactionIsolationLevel.ReadCommitted,
    });

    updateTag("universities");
    updateTag("members");
    revalidatePath("/");
    revalidatePath("/admin");
    revalidatePath("/admin/universities");
    return { success: true };
  } catch (error) {
    if (error instanceof UniversityDeletionError) return { success: false, error: error.message };
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2034") {
      return { success: false, error: "Penghapusan kampus bertabrakan dengan operasi lain. Muat ulang data sebelum mencoba kembali." };
    }
    console.error("[deleteUniversity] Transaction failed:", error);
    return { success: false, error: "Gagal menghapus kampus. Silakan coba lagi." };
  }
}
