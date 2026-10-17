import "server-only";
import {
  Prisma,
  type NewsCategory,
  type EventCategory,
  type ContentStatus,
  type PublicationType,
  type MediaType,
} from "@/generated/prisma/client";
import { ContentWorkflowError, type ContentKind } from "./content-workflow";
import type { ContentPayload } from "./content-fields";

export type ContentSnapshot = Record<string, Prisma.JsonValue>;
export function snapshot(value: unknown): ContentSnapshot {
  return JSON.parse(JSON.stringify(value)) as ContentSnapshot;
}

export async function readContent(
  tx: Prisma.TransactionClient,
  kind: ContentKind,
  id: string,
): Promise<ContentSnapshot | null> {
  let value: unknown;
  switch (kind) {
    case "news":
      value = await tx.news.findUnique({
        where: { id },
        select: {
          id: true,
          title: true,
          slug: true,
          category: true,
          excerpt: true,
          content: true,
          imageUrl: true,
          status: true,
          publishedAt: true,
          eventDate: true,
          authorId: true,
          createdAt: true,
          updatedAt: true,
          contentVersion: true,
        },
      });
      break;
    case "event":
      value = await tx.event.findUnique({ where: { id } });
      break;
    case "member":
      value = await tx.memberProfile.findUnique({ where: { id } });
      break;
    case "managementPeriod":
      value = await tx.managementPeriod.findUnique({
        where: { id },
        include: { positions: { orderBy: { id: "asc" } } },
      });
      break;
    case "managementPosition":
      value = await tx.managementPosition.findUnique({ where: { id } });
      break;
    case "university":
      value = await tx.university.findUnique({
        where: { id },
        include: { _count: { select: { members: true } } },
      });
      break;
    case "publication":
      value = await tx.publication.findUnique({ where: { id } });
      break;
    case "gallery":
      value = await tx.gallery.findUnique({ where: { id } });
      break;
  }
  return value ? snapshot(value) : null;
}

function slugify(text: string) {
  const slug = text
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
  if (!slug)
    throw new ContentWorkflowError(
      "Judul atau nama harus mengandung huruf atau angka.",
    );
  return slug;
}

export async function applyContent(
  tx: Prisma.TransactionClient,
  kind: ContentKind,
  operation: "CREATE" | "UPDATE" | "DELETE",
  id: string,
  payload: ContentPayload,
  ownerId: string,
  reviewerId: string,
  current: ContentSnapshot | null,
) {
  if (operation === "DELETE") {
    switch (kind) {
      case "news":
        await tx.news.delete({ where: { id } });
        return;
      case "event":
        await tx.event.delete({ where: { id } });
        return;
      case "member":
        await tx.memberProfile.delete({ where: { id } });
        return;
      case "managementPeriod":
        await tx.managementPeriod.delete({ where: { id } });
        return;
      case "managementPosition":
        await tx.managementPosition.delete({ where: { id } });
        return;
      case "university":
        if (await tx.memberProfile.count({ where: { institutionId: id } }))
          throw new ContentWorkflowError(
            "Pindahkan atau hapus anggota kampus terlebih dahulu.",
          );
        await tx.university.delete({ where: { id } });
        return;
      case "publication":
        await tx.publication.delete({ where: { id } });
        return;
      case "gallery":
        await tx.gallery.delete({ where: { id } });
        return;
    }
  }
  const s = (key: string) => String(payload[key] ?? "");
  const optional = (key: string) =>
    payload[key] ? String(payload[key]) : null;
  const date = (key: string) =>
    payload[key] ? new Date(String(payload[key])) : null;
  const create = operation === "CREATE";
  switch (kind) {
    case "news": {
      const data = {
        title: s("title"),
        category: s("category") as NewsCategory,
        excerpt: optional("excerpt"),
        content: s("content"),
        imageUrl: optional("imageUrl"),
        eventDate: date("eventDate"),
        status: s("status") as ContentStatus,
        publishedAt:
          payload.status === "PUBLISHED"
            ? current?.publishedAt
              ? new Date(String(current.publishedAt))
              : new Date()
            : null,
        reviewStatus: "APPROVED" as const,
        reviewerId,
        reviewedAt: new Date(),
        reviewNote: null,
        pendingRevision: Prisma.DbNull,
      };
      if (create)
        await tx.news.create({
          data: { ...data, id, slug: slugify(s("title")), authorId: ownerId },
          select: { id: true },
        });
      else
        await tx.news.update({
          where: { id },
          data: { ...data, contentVersion: { increment: 1 } },
          select: { id: true },
        });
      return;
    }
    case "event": {
      const data = {
        title: s("title"),
        category: s("category") as EventCategory,
        description: s("description"),
        startDate: new Date(s("startDate")),
        endDate: date("endDate"),
        location: optional("location"),
        linkUrl: optional("linkUrl"),
        imageUrl: optional("imageUrl"),
        status: s("status") as ContentStatus,
      };
      if (create)
        await tx.event.create({
          data: { ...data, id, slug: slugify(s("title")), authorId: ownerId },
        });
      else await tx.event.update({ where: { id }, data });
      return;
    }
    case "member": {
      const data = {
        name: s("name"),
        email: s("email"),
        institutionId: optional("institutionId"),
        detailUrl: optional("detailUrl"),
        fieldOfExpertise: optional("fieldOfExpertise"),
        photoUrl: optional("photoUrl"),
      };
      if (create) await tx.memberProfile.create({ data: { ...data, id } });
      else await tx.memberProfile.update({ where: { id }, data });
      return;
    }
    case "managementPeriod": {
      if ((await tx.managementPeriod.count({ where: { isActive: true } })) > 1)
        throw new ContentWorkflowError(
          "Terdapat lebih dari satu periode aktif. Data perlu ditinjau.",
        );
      const data = { period: s("period"), isActive: Boolean(payload.isActive) };
      if (data.isActive)
        await tx.managementPeriod.updateMany({
          where: { id: { not: id }, isActive: true },
          data: { isActive: false },
        });
      if (create) await tx.managementPeriod.create({ data: { ...data, id } });
      else await tx.managementPeriod.update({ where: { id }, data });
      return;
    }
    case "managementPosition": {
      const data = {
        periodId: s("periodId"),
        memberProfileId: optional("memberProfileId"),
        title: s("title"),
        department: optional("department"),
        order: Number(payload.order),
      };
      if (create) await tx.managementPosition.create({ data: { ...data, id } });
      else await tx.managementPosition.update({ where: { id }, data });
      return;
    }
    case "university": {
      const data = {
        name: s("name"),
        shortName: optional("shortName"),
        address: optional("address"),
        deptUrl: optional("deptUrl"),
        websiteUrl: optional("websiteUrl"),
        logoUrl: optional("logoUrl"),
        description: optional("description"),
      };
      if (create)
        await tx.university.create({
          data: { ...data, id, slug: slugify(s("name")) },
        });
      else await tx.university.update({ where: { id }, data });
      return;
    }
    case "publication": {
      const data = {
        title: s("title"),
        type: s("type") as PublicationType,
        description: optional("description"),
        externalUrl: optional("externalUrl"),
        publishedAt: date("publishedAt"),
      };
      if (create) await tx.publication.create({ data: { ...data, id } });
      else await tx.publication.update({ where: { id }, data });
      return;
    }
    case "gallery": {
      const data = {
        title: s("title"),
        mediaType: s("mediaType") as MediaType,
        mediaUrl: s("mediaUrl"),
        category: optional("category"),
        description: optional("description"),
        isFeatured: Boolean(payload.isFeatured),
        sortOrder: Number(payload.sortOrder),
      };
      if (create) await tx.gallery.create({ data: { ...data, id } });
      else await tx.gallery.update({ where: { id }, data });
    }
  }
}
