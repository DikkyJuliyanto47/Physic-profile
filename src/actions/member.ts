"use server";

import { requireAdmin } from "@/lib/auth-utils";
import { prisma } from "@/lib/prisma";
import { mutateWithMedia } from "@/lib/media-lifecycle";
import { revalidatePath, updateTag } from "next/cache";

export type MemberInput = {
  detailUrl: string;
  name: string;
  email: string;
  institutionId?: string;
  fieldOfExpertise?: string;
  photoUrl?: string;
  profileUrl?: string;
};

export type ActionResponse = {
  success: boolean;
  error?: string;
};

function validateMemberInput(data: MemberInput): string | null {
  if (!data || typeof data !== "object" || Array.isArray(data)) return "Data anggota tidak valid.";
  if (typeof data.name !== "string" || !data.name.trim()) return "Nama wajib diisi.";
  if (typeof data.email !== "string" || !data.email.trim()) return "Email wajib diisi.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/u.test(data.email.trim())) return "Format email tidak valid.";
  if ([data.institutionId, data.detailUrl, data.fieldOfExpertise, data.photoUrl].some(
    (value) => value != null && typeof value !== "string",
  )) return "Field anggota harus berupa teks.";
  return null;
}

export async function createMember(
  data: MemberInput
): Promise<ActionResponse> {
  const session = await requireAdmin();

  if (!session) {
    return { success: false, error: "Unauthorized." };
  }

  try {
    const validationError = validateMemberInput(data);
    if (validationError) return { success: false, error: validationError };

    const existing = await prisma.memberProfile.findUnique({
      where: { email: data.email.trim() },
    });

    if (existing) {
      return { success: false, error: "Email sudah terdaftar." };
    }

    await mutateWithMedia(data, (tx) => tx.memberProfile.create({
      data: {
        name: data.name.trim(),
        email: data.email.trim(),
        institutionId: data.institutionId || null,
        detailUrl: data.detailUrl?.trim() || null,
        fieldOfExpertise: data.fieldOfExpertise?.trim() || null,
        photoUrl: data.photoUrl?.trim() || null,
      },
    }));

    updateTag("members");
    updateTag("managements");
    updateTag("universities");
    revalidatePath("/");
    revalidatePath("/admin");
    revalidatePath("/admin/members");
    revalidatePath("/members");

    return { success: true };
  } catch {
    return {
      success: false,
      error: "Gagal membuat anggota. Silakan coba lagi.",
    };
  }
}

export async function updateMember(
  id: string,
  data: MemberInput
): Promise<ActionResponse> {
  const session = await requireAdmin();

  if (!session) {
    return { success: false, error: "Unauthorized." };
  }

  try {
    const validationError = validateMemberInput(data);
    if (validationError) return { success: false, error: validationError };

    const existing = await prisma.memberProfile.findFirst({
      where: { email: data.email.trim(), NOT: { id } },
    });
    if (existing) {
      return {
        success: false,
        error: "Email sudah digunakan oleh anggota lain.",
      };
    }

    await mutateWithMedia(data, (tx) => tx.memberProfile.update({
      where: { id },
      data: {
        name: data.name.trim(),
        email: data.email.trim(),
        institutionId: data.institutionId || null,
        detailUrl: data.detailUrl?.trim() || null,
        fieldOfExpertise: data.fieldOfExpertise?.trim() || null,
        photoUrl: data.photoUrl?.trim() || null,
      },
    }), (tx) => tx.memberProfile.findUnique({ where: { id } }));

    updateTag("members");
    updateTag("managements");
    updateTag("universities");
    revalidatePath("/");
    revalidatePath("/admin");
    revalidatePath("/admin/members");
    revalidatePath("/members");
    revalidatePath(`/admin/members/${id}/edit`);
    return { success: true };
  } catch {
    return { success: false, error: "Gagal memperbarui anggota." };
  }
}

export async function deleteMember(id: string): Promise<ActionResponse> {
  const session = await requireAdmin();

  if (!session) {
    return { success: false, error: "Unauthorized." };
  }

  try {
    const member = await prisma.memberProfile.findUnique({ where: { id } });
    if (!member) {
      return { success: false, error: "Anggota tidak ditemukan." };
    }

    await mutateWithMedia(null, (tx) => tx.memberProfile.delete({ where: { id } }), (tx) => tx.memberProfile.findUnique({ where: { id } }));

    updateTag("members");
    updateTag("managements");
    updateTag("universities");
    revalidatePath("/");
    revalidatePath("/admin");
    revalidatePath("/admin/members");
    revalidatePath("/members");
    return { success: true };
  } catch {
    return { success: false, error: "Gagal menghapus anggota." };
  }
}
