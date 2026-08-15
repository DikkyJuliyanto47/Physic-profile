"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export type ActionResponse = {
  success: boolean;
  error?: string;
};

export type ManagementPeriodInput = {
  period: string;
  isActive?: boolean;
};

export type ManagementPositionInput = {
  periodId: string;
  memberProfileId?: string | null;
  title: string;
  department?: string | null;
  order?: number | string;
};

export async function createManagementPeriod(
  data: ManagementPeriodInput
): Promise<ActionResponse> {
  try {
    const period = data.period?.trim();
    if (!period) {
      return { success: false, error: "Periode wajib diisi." };
    }

    const existing = await prisma.managementPeriod.findUnique({
      where: { period },
    });

    if (existing) {
      return { success: false, error: "Periode sudah terdaftar." };
    }

    await prisma.$transaction(async (tx) => {
      if (data.isActive) {
        await tx.managementPeriod.updateMany({
          where: { isActive: true },
          data: { isActive: false },
        });
      }

      await tx.managementPeriod.create({
        data: {
          period,
          isActive: Boolean(data.isActive),
        },
      });
    });

    revalidatePath("/admin/kepengurusan");
    return { success: true };
  } catch {
    return { success: false, error: "Gagal membuat periode kepengurusan." };
  }
}

export async function updateManagementPeriod(
  id: string,
  data: ManagementPeriodInput
): Promise<ActionResponse> {
  try {
    const period = data.period?.trim();
    if (!period) {
      return { success: false, error: "Periode wajib diisi." };
    }

    const existing = await prisma.managementPeriod.findFirst({
      where: {
        period,
        NOT: { id },
      },
    });

    if (existing) {
      return { success: false, error: "Periode sudah terdaftar." };
    }

    await prisma.$transaction(async (tx) => {
      if (data.isActive) {
        await tx.managementPeriod.updateMany({
          where: { id: { not: id }, isActive: true },
          data: { isActive: false },
        });
      }

      await tx.managementPeriod.update({
        where: { id },
        data: {
          period,
          isActive: Boolean(data.isActive),
        },
      });
    });

    revalidatePath("/admin/kepengurusan");
    revalidatePath(`/admin/kepengurusan/${id}/edit`);
    return { success: true };
  } catch {
    return { success: false, error: "Gagal memperbarui periode kepengurusan." };
  }
}

export async function deleteManagementPeriod(id: string): Promise<ActionResponse> {
  try {
    const period = await prisma.managementPeriod.findUnique({ where: { id } });
    if (!period) {
      return { success: false, error: "Periode tidak ditemukan." };
    }

    await prisma.managementPeriod.delete({ where: { id } });
    revalidatePath("/admin/kepengurusan");
    return { success: true };
  } catch {
    return { success: false, error: "Gagal menghapus periode kepengurusan." };
  }
}

export async function setActiveManagementPeriod(
  id: string
): Promise<ActionResponse> {
  try {
    const period = await prisma.managementPeriod.findUnique({ where: { id } });
    if (!period) {
      return { success: false, error: "Periode tidak ditemukan." };
    }

    await prisma.$transaction(async (tx) => {
      await tx.managementPeriod.updateMany({
        where: { isActive: true },
        data: { isActive: false },
      });

      await tx.managementPeriod.update({
        where: { id },
        data: { isActive: true },
      });
    });

    revalidatePath("/admin/kepengurusan");
    return { success: true };
  } catch {
    return { success: false, error: "Gagal mengaktifkan periode." };
  }
}

export async function createManagementPosition(
  data: ManagementPositionInput
): Promise<ActionResponse> {
  try {
    const periodId = data.periodId?.trim();
    const title = data.title?.trim();

    if (!periodId) {
      return { success: false, error: "Periode harus dipilih." };
    }

    if (!title) {
      return { success: false, error: "Jabatan wajib diisi." };
    }

    const period = await prisma.managementPeriod.findUnique({
      where: { id: periodId },
    });

    if (!period) {
      return { success: false, error: "Periode tidak valid." };
    }

    if (data.memberProfileId) {
      const memberProfile = await prisma.memberProfile.findUnique({
        where: { id: data.memberProfileId },
      });

      if (!memberProfile) {
        return { success: false, error: "Anggota yang dipilih tidak valid." };
      }
    }

    const orderValue = Number(data.order ?? 0);
    if (!Number.isFinite(orderValue)) {
      return { success: false, error: "Urutan harus angka." };
    }

    await prisma.managementPosition.create({
      data: {
        periodId,
        memberProfileId: data.memberProfileId || null,
        title,
        department: data.department?.trim() || null,
        order: orderValue,
      },
    });

    revalidatePath("/admin/kepengurusan");
    revalidatePath(`/admin/kepengurusan/${periodId}/edit`);
    return { success: true };
  } catch {
    return { success: false, error: "Gagal membuat posisi kepengurusan." };
  }
}

export async function updateManagementPosition(
  id: string,
  data: ManagementPositionInput
): Promise<ActionResponse> {
  try {
    const periodId = data.periodId?.trim();
    const title = data.title?.trim();

    if (!periodId) {
      return { success: false, error: "Periode harus dipilih." };
    }

    if (!title) {
      return { success: false, error: "Jabatan wajib diisi." };
    }

    const period = await prisma.managementPeriod.findUnique({
      where: { id: periodId },
    });

    if (!period) {
      return { success: false, error: "Periode tidak valid." };
    }

    if (data.memberProfileId) {
      const memberProfile = await prisma.memberProfile.findUnique({
        where: { id: data.memberProfileId },
      });

      if (!memberProfile) {
        return { success: false, error: "Anggota yang dipilih tidak valid." };
      }
    }

    const orderValue = Number(data.order ?? 0);
    if (!Number.isFinite(orderValue)) {
      return { success: false, error: "Urutan harus angka." };
    }

    await prisma.managementPosition.update({
      where: { id },
      data: {
        periodId,
        memberProfileId: data.memberProfileId || null,
        title,
        department: data.department?.trim() || null,
        order: orderValue,
      },
    });

    revalidatePath("/admin/kepengurusan");
    revalidatePath(`/admin/kepengurusan/${periodId}/edit`);
    return { success: true };
  } catch {
    return { success: false, error: "Gagal memperbarui posisi kepengurusan." };
  }
}

export async function deleteManagementPosition(id: string): Promise<ActionResponse> {
  try {
    const position = await prisma.managementPosition.findUnique({ where: { id } });
    if (!position) {
      return { success: false, error: "Posisi tidak ditemukan." };
    }

    await prisma.managementPosition.delete({ where: { id } });
    revalidatePath("/admin/kepengurusan");
    revalidatePath(`/admin/kepengurusan/${position.periodId}/edit`);
    return { success: true };
  } catch {
    return { success: false, error: "Gagal menghapus posisi kepengurusan." };
  }
}
