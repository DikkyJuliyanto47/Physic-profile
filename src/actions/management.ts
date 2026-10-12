"use server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-utils";
import { revalidatePath, updateTag } from "next/cache";
import { Prisma } from "@/generated/prisma/client";

class ActivePeriodIntegrityError extends Error {}

async function assertSingleActivePeriod(tx: Prisma.TransactionClient): Promise<void> {
  if (await tx.managementPeriod.count({ where: { isActive: true } }) > 1) {
    throw new ActivePeriodIntegrityError("Terdapat lebih dari satu periode aktif. Data perlu ditinjau sebelum perubahan periode.");
  }
}

function periodTransactionError(error: unknown, fallback: string): ActionResponse {
  if (error instanceof ActivePeriodIntegrityError) return { success: false, error: error.message };
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P2034") {
      return { success: false, error: "Perubahan periode bertabrakan dengan operasi lain. Muat ulang data sebelum mencoba kembali." };
    }
    if (error.code === "P2002") return { success: false, error: "Periode sudah terdaftar." };
  }
  console.error("[management] Period transaction failed:", error);
  return { success: false, error: fallback };
}

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

function validatePositionInput(data: ManagementPositionInput): string | null {
  if (!data || typeof data !== "object" || Array.isArray(data)) return "Data posisi tidak valid.";
  if (typeof data.periodId !== "string" || !data.periodId.trim()) return "Periode harus dipilih.";
  if (typeof data.title !== "string" || !data.title.trim()) return "Jabatan wajib diisi.";
  if ([data.memberProfileId, data.department].some((value) => value != null && typeof value !== "string")) {
    return "Anggota dan departemen harus berupa teks.";
  }
  
  if (data.order !== undefined && (
    (typeof data.order !== "number" && typeof data.order !== "string") ||
    (typeof data.order === "string" && !data.order.trim())
  )) return "Urutan harus angka.";
  const order = Number(data.order ?? 0);
  if (!Number.isInteger(order) || order < -2147483648 || order > 2147483647) {
    return "Urutan harus bilangan bulat dalam rentang -2147483648 sampai 2147483647.";
  }
  if (typeof data.order === "string") {
    
    const decimal = /^[+-]?(\d*)(?:\.(\d*))?(?:e([+-]?\d+))?$/i.exec(data.order.trim());
    if (decimal) {
      const digits = decimal[1] + (decimal[2] ?? "");
      const fractionalDigits = Math.max(0, (decimal[2]?.length ?? 0) - Number(decimal[3] ?? 0));
      if (fractionalDigits > 0 && /[1-9]/.test(digits.slice(-fractionalDigits))) return "Urutan harus bilangan bulat.";
    }
  }
  return null;
}

function validatePeriodInput(data: ManagementPeriodInput): string | null {
  if (!data || typeof data !== "object" || Array.isArray(data)) return "Data periode tidak valid.";
  if (typeof data.period !== "string" || !data.period.trim()) return "Periode wajib diisi.";
  if (data.isActive !== undefined && typeof data.isActive !== "boolean") return "Status aktif harus berupa boolean.";
  return null;
}

export async function createManagementPeriod(
  data: ManagementPeriodInput
): Promise<ActionResponse> {
  try {
    const session = await requireAdmin();
    if (!session) {
      return { success: false, error: "Unauthorized. Silakan login." };
    }

    const validationError = validatePeriodInput(data);
    if (validationError) return { success: false, error: validationError };
    const period = data.period.trim();

    const existing = await prisma.managementPeriod.findUnique({
      where: { period },
    });

    if (existing) {
      return { success: false, error: "Periode sudah terdaftar." };
    }

    await prisma.$transaction(async (tx) => {
      await assertSingleActivePeriod(tx);
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
    }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable });

    updateTag("managements");
    revalidatePath("/managements");
    revalidatePath("/admin/managements");
    return { success: true };
  } catch (error) {
    return periodTransactionError(error, "Gagal membuat periode kepengurusan.");
  }
}

export async function updateManagementPeriod(
  id: string,
  data: ManagementPeriodInput
): Promise<ActionResponse> {
  try {
    const session = await requireAdmin();
    if (!session) {
      return { success: false, error: "Unauthorized. Silakan login." };
    }

    const validationError = validatePeriodInput(data);
    if (validationError) return { success: false, error: validationError };
    const period = data.period.trim();

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
      await assertSingleActivePeriod(tx);
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
    }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable });

    updateTag("managements");
    revalidatePath("/managements");
    revalidatePath("/admin/managements");
    revalidatePath(`/admin/managements/${id}/edit`);
    return { success: true };
  } catch (error) {
    return periodTransactionError(error, "Gagal memperbarui periode kepengurusan.");
  }
}

export async function deleteManagementPeriod(id: string): Promise<ActionResponse> {
  try {
    const session = await requireAdmin();
    if (!session) {
      return { success: false, error: "Unauthorized. Silakan login." };
    }

    const period = await prisma.managementPeriod.findUnique({ where: { id } });
    if (!period) {
      return { success: false, error: "Periode tidak ditemukan." };
    }

    await prisma.managementPeriod.delete({ where: { id } });
    updateTag("managements");
    revalidatePath("/managements");
    revalidatePath("/admin/managements");
    return { success: true };
  } catch {
    return { success: false, error: "Gagal menghapus periode kepengurusan." };
  }
}

export async function setActiveManagementPeriod(
  id: string
): Promise<ActionResponse> {
  try {
    const session = await requireAdmin();
    if (!session) {
      return { success: false, error: "Unauthorized. Silakan login." };
    }

    const period = await prisma.managementPeriod.findUnique({ where: { id } });
    if (!period) {
      return { success: false, error: "Periode tidak ditemukan." };
    }

    await prisma.$transaction(async (tx) => {
      await assertSingleActivePeriod(tx);
      await tx.managementPeriod.updateMany({
        where: { isActive: true },
        data: { isActive: false },
      });

      await tx.managementPeriod.update({
        where: { id },
        data: { isActive: true },
      });
    }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable });

    updateTag("managements");
    revalidatePath("/managements");
    revalidatePath("/admin/managements");
    return { success: true };
  } catch (error) {
    return periodTransactionError(error, "Gagal mengaktifkan periode.");
  }
}

export async function createManagementPosition(
  data: ManagementPositionInput
): Promise<ActionResponse> {
  try {
    const session = await requireAdmin();
    if (!session) {
      return { success: false, error: "Unauthorized. Silakan login." };
    }

    const validationError = validatePositionInput(data);
    if (validationError) return { success: false, error: validationError };

    const periodId = data.periodId.trim();
    const title = data.title.trim();

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

    await prisma.managementPosition.create({
      data: {
        periodId,
        memberProfileId: data.memberProfileId || null,
        title,
        department: data.department?.trim() || null,
        order: orderValue,
      },
    });

    updateTag("managements");
    revalidatePath("/managements");
    revalidatePath("/admin/managements");
    revalidatePath(`/admin/managements/${periodId}/edit`);
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
    const session = await requireAdmin();
    if (!session) {
      return { success: false, error: "Unauthorized. Silakan login." };
    }

    const validationError = validatePositionInput(data);
    if (validationError) return { success: false, error: validationError };

    const periodId = data.periodId.trim();
    const title = data.title.trim();

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

    const previous = await prisma.managementPosition.findUnique({
      where: { id },
      select: { periodId: true },
    });

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

    updateTag("managements");
    revalidatePath("/managements");
    revalidatePath("/admin/managements");
    revalidatePath(`/admin/managements/${periodId}/edit`);
    if (previous && previous.periodId !== periodId) {
      revalidatePath(`/admin/managements/${previous.periodId}/edit`);
    }
    return { success: true };
  } catch {
    return { success: false, error: "Gagal memperbarui posisi kepengurusan." };
  }
}

export async function deleteManagementPosition(id: string): Promise<ActionResponse> {
  try {
    const session = await requireAdmin();
    if (!session) {
      return { success: false, error: "Unauthorized. Silakan login." };
    }

    const position = await prisma.managementPosition.findUnique({ where: { id } });
    if (!position) {
      return { success: false, error: "Posisi tidak ditemukan." };
    }

    await prisma.managementPosition.delete({ where: { id } });
    updateTag("managements");
    revalidatePath("/managements");
    revalidatePath("/admin/managements");
    revalidatePath(`/admin/managements/${position.periodId}/edit`);
    return { success: true };
  } catch {
    return { success: false, error: "Gagal menghapus posisi kepengurusan." };
  }
}
