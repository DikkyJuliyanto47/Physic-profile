import { ContentFeedback } from "./ContentFeedback";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import {
  CONTENT_APPROVAL_UNAVAILABLE,
  isContentApprovalReady,
} from "@/lib/content-approval";
import {
  CONTENT_LABELS,
  isContentKind,
  type ContentPayload,
} from "@/lib/content-fields";
import {
  ContentReviewControls,
  type ContentReferences,
} from "./ContentReviewControls";
import { ReviewFilter } from "./ReviewStatusBadge";
import type { ContentActor } from "@/lib/content-workflow";
import type { Prisma } from "@/generated/prisma/client";

export async function ContentReviewQueue({
  actor,
  own,
  params,
}: {
  actor: ContentActor;
  own: boolean;
  params: { kind?: string; review?: string; page?: string; result?: string };
}) {
  if (!(await isContentApprovalReady()))
    return (
      <p
        role="status"
        className="rounded-md bg-amber-50 p-4 text-sm text-amber-800"
      >
        {CONTENT_APPROVAL_UNAVAILABLE}
      </p>
    );
  const page = Math.max(
    1,
    Math.min(100000, Number.parseInt(params.page ?? "1", 10) || 1),
  );
  const where: Prisma.ContentChangeWhereInput = own
    ? { authorId: actor.id }
    : {};
  if (isContentKind(params.kind)) where.kind = params.kind;
  if (
    params.review &&
    ["PENDING_REVIEW", "REVISION_REQUIRED", "APPROVED"].includes(params.review)
  )
    where.reviewStatus = params.review as
      | "PENDING_REVIEW"
      | "REVISION_REQUIRED"
      | "APPROVED";
  else
    where.reviewStatus = {
      in: own ? ["PENDING_REVIEW", "REVISION_REQUIRED"] : ["PENDING_REVIEW"],
    };
  const [requests, count, universities, periods, members] = await Promise.all([
    prisma.contentChange.findMany({
      where,
      orderBy: [{ updatedAt: "desc" }, { id: "asc" }],
      skip: (page - 1) * 20,
      take: 20,
      include: {
        author: { select: { name: true } },
        submittedBy: { select: { name: true } },
        reviewer: { select: { name: true } },
      },
    }),
    prisma.contentChange.count({ where }),
    prisma.university.findMany({
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    }),
    prisma.managementPeriod.findMany({
      select: { id: true, period: true },
      orderBy: { period: "desc" },
    }),
    prisma.memberProfile.findMany({
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    }),
  ]);
  const references: ContentReferences = {
    institutionId: universities.map((item) => ({
      id: item.id,
      label: item.name,
    })),
    periodId: periods.map((item) => ({ id: item.id, label: item.period })),
    memberProfileId: members.map((item) => ({ id: item.id, label: item.name })),
  };
  const path = own ? "/admin/submissions" : "/admin/review";
  const pageLink = (value: number) =>
    `${path}?${new URLSearchParams({ ...(params.kind ? { kind: params.kind } : {}), ...(params.review ? { review: params.review } : {}), page: String(value) })}`;
  const operationLabels = {
    CREATE: "Tambah",
    UPDATE: "Perubahan",
    DELETE: "Penghapusan",
  };
  return (
    <div className="space-y-6">
      <ContentFeedback result={params.result} />
      <form method="GET" className="flex flex-wrap gap-3">
        <select
          name="kind"
          defaultValue={params.kind ?? ""}
          aria-label="Modul konten"
          className="rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm"
        >
          <option value="">Semua modul</option>
          {Object.entries(CONTENT_LABELS).map(([key, label]) => (
            <option key={key} value={key}>
              {label}
            </option>
          ))}
        </select>
        <ReviewFilter value={params.review} />
        <button className="rounded-md border border-neutral-200 bg-white px-4 py-2 text-sm font-medium text-neutral-700">
          Filter
        </button>
      </form>
      <p className="text-sm text-neutral-500">
        {count} pengajuan · Halaman {page}
      </p>
      {requests.length === 0 && (
        <p className="rounded-lg border border-neutral-200 bg-white p-8 text-center text-sm text-neutral-500">
          Tidak ada pengajuan pada filter ini.
        </p>
      )}
      {requests.map((request) => {
        const payload =
          request.payload &&
          typeof request.payload === "object" &&
          !Array.isArray(request.payload)
            ? (request.payload as ContentPayload)
            : {};
        const before =
          request.before &&
          typeof request.before === "object" &&
          !Array.isArray(request.before)
            ? (request.before as Record<string, unknown>)
            : null;
        const title = String(
          payload.title ??
            payload.name ??
            payload.period ??
            before?.title ??
            before?.name ??
            before?.period ??
            CONTENT_LABELS[request.kind],
        );
        return (
          <section
            key={`${request.id}-${request.contentVersion}`}
            className="overflow-hidden rounded-lg border border-neutral-200 bg-white shadow-card"
          >
            <header className="border-b border-neutral-100 px-5 py-4">
              <p className="text-xs font-medium text-primary-600">
                {CONTENT_LABELS[request.kind]} ·{" "}
                {operationLabels[request.operation]}
              </p>
              <h2 className="mt-1 break-words text-base font-semibold text-neutral-900">
                {title}
              </h2>
              <p className="mt-1 text-xs text-neutral-500">
                Pemilik: {request.author.name?.trim() || "User"} · Pengaju:{" "}
                {request.submittedBy.name?.trim() || "User"} ·{" "}
                {request.updatedAt.toLocaleString("id-ID", {
                  timeZone: "Asia/Jakarta",
                })}{" "}
                WIB
              </p>
              {request.reviewer && (
                <p className="mt-1 text-xs text-neutral-500">
                  Reviewer: {request.reviewer.name?.trim() || "User"}
                </p>
              )}
            </header>
            <details className="p-5">
              <summary className="cursor-pointer text-sm font-medium text-primary-700">
                Lihat pengajuan
              </summary>
              <div className="mt-4">
                <ContentReviewControls
                  id={request.id}
                  kind={request.kind}
                  operation={request.operation}
                  actor={actor}
                  state={request}
                  payload={payload}
                  before={before}
                  references={references}
                  canReview={!own && actor.role === "SUPER_ADMIN"}
                />
              </div>
            </details>
          </section>
        );
      })}
      <nav
        aria-label="Halaman pengajuan"
        className="flex gap-3 text-sm font-medium text-primary-700"
      >
        {page > 1 && <Link href={pageLink(page - 1)}>Sebelumnya</Link>}
        {page * 20 < count && <Link href={pageLink(page + 1)}>Berikutnya</Link>}
      </nav>
    </div>
  );
}
