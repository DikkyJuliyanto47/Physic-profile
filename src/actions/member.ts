"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

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

export async function createMember(data: MemberInput): Promise<ActionResponse> {
  try {
    if (!data.name?.trim()) {
      return { success: false, error: "Nama wajib diisi." };
    }
    if (!data.email?.trim()) {
      return { success: false, error: "Email wajib diisi." };
    }

    const existing = await prisma.memberProfile.findUnique({
      where: { email: data.email.trim() },
    });
    if (existing) {
      return { success: false, error: "Email sudah terdaftar." };
    }

    await prisma.memberProfile.create({
      data: {
        name: data.name.trim(),
        email: data.email.trim(),
        institutionId: data.institutionId || null,
        detailUrl: data.detailUrl?.trim() || null,
        fieldOfExpertise: data.fieldOfExpertise?.trim() || null,
        photoUrl: data.photoUrl?.trim() || null,
      },
    });

    revalidatePath("/admin/members");
    revalidatePath("/members");
    return { success: true };
  } catch {
    return { success: false, error: "Gagal membuat anggota. Silakan coba lagi." };
  }
}

export async function updateMember(
  id: string,
  data: MemberInput
): Promise<ActionResponse> {
  try {
    if (!data.name?.trim()) {
      return { success: false, error: "Nama wajib diisi." };
    }
    if (!data.email?.trim()) {
      return { success: false, error: "Email wajib diisi." };
    }

    const existing = await prisma.memberProfile.findFirst({
      where: { email: data.email.trim(), NOT: { id } },
    });
    if (existing) {
      return { success: false, error: "Email sudah digunakan oleh anggota lain." };
    }

    await prisma.memberProfile.update({
      where: { id },
      data: {
        name: data.name.trim(),
        email: data.email.trim(),
        institutionId: data.institutionId || null,
        detailUrl: data.detailUrl?.trim() || null,
        fieldOfExpertise: data.fieldOfExpertise?.trim() || null,
        photoUrl: data.photoUrl?.trim() || null,
      },
    });

    revalidatePath("/admin/members");
    revalidatePath("/members");
    revalidatePath(`/admin/members/${id}/edit`);
    return { success: true };
  } catch {
    return { success: false, error: "Gagal memperbarui anggota." };
  }
}

export async function deleteMember(id: string): Promise<ActionResponse> {
  try {
    const member = await prisma.memberProfile.findUnique({ where: { id } });
    if (!member) {
      return { success: false, error: "Anggota tidak ditemukan." };
    }

    await prisma.memberProfile.delete({ where: { id } });

    revalidatePath("/admin/members");
    revalidatePath("/members");
    return { success: true };
  } catch {
    return { success: false, error: "Gagal menghapus anggota." };
  }
}
