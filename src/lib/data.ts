import "server-only";

import { cacheLife, cacheTag } from "next/cache";
import { prisma } from "@/lib/prisma";
import type { NewsItem } from "@/components/features/news";
import type { EventItem } from "@/components/features/events";
import type { Member } from "@/components/features/members";
import type { ManagementGroup } from "@/components/features/management/data";
import type { DocumentationItem } from "@/components/features/gallery/data";

function formatNewsDate(date: Date): string {
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

function formatEventDate(date: Date): string {
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

function formatEventTime(date: Date): string {
  return new Intl.DateTimeFormat("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(date);
}

function formatGalleryDate(date: Date): string {
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

// ──────────────────────────────────────────────
// NEWS
// ──────────────────────────────────────────────

export async function getPublishedNews(
  kategori?: string,
): Promise<NewsItem[]> {
  "use cache";
  cacheLife("hours");
  cacheTag("news");

  const items = await prisma.news.findMany({
    where: {
      status: "PUBLISHED",
      ...(kategori && { category: kategori as never }),
    },
    select: {
      id: true,
      title: true,
      slug: true,
      excerpt: true,
      imageUrl: true,
      category: true,
      publishedAt: true,
      createdAt: true,
    },
    orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
  });

  return items.map((item) => ({
    id: item.id,
    title: item.title,
    date: formatNewsDate(item.publishedAt ?? item.createdAt),
    excerpt: item.excerpt ?? "Berita PSI Cabang Surabaya.",
    image: item.imageUrl ?? "/assets/hero/pertemuan-07-27-02.jpeg",
    href: `/news/${item.slug}`,
    category: item.category,
  }));
}

export async function getNewsBySlug(slug: string) {
  "use cache";
  cacheLife("hours");
  cacheTag("news");

  return prisma.news.findUnique({
    where: { slug, status: "PUBLISHED" },
    select: {
      id: true,
      title: true,
      category: true,
      excerpt: true,
      content: true,
      imageUrl: true,
      publishedAt: true,
      createdAt: true,
      author: { select: { name: true } },
    },
  });
}

// ──────────────────────────────────────────────
// EVENTS
// ──────────────────────────────────────────────

export async function getPublishedEvents(): Promise<EventItem[]> {
  "use cache";
  cacheLife("hours");
  cacheTag("events");

  const events = await prisma.event.findMany({
    where: { status: "PUBLISHED" },
    select: {
      id: true,
      title: true,
      slug: true,
      description: true,
      location: true,
      imageUrl: true,
      startDate: true,
    },
    orderBy: { startDate: "desc" },
  });

  return events.map((event) => ({
    id: event.id,
    slug: event.slug,
    title: event.title,
    date: formatEventDate(event.startDate),
    time: `${formatEventTime(event.startDate)} WIB`,
    description: event.description,
    location: event.location,
    image: event.imageUrl ?? undefined,
    href: `/events/${event.slug}`,
  }));
}

export async function getEventBySlug(slug: string) {
  "use cache";
  cacheLife("hours");
  cacheTag("events");

  return prisma.event.findUnique({
    where: { slug, status: "PUBLISHED" },
    select: {
      id: true,
      title: true,
      category: true,
      description: true,
      startDate: true,
      endDate: true,
      location: true,
      imageUrl: true,
      linkUrl: true,
    },
  });
}

// ──────────────────────────────────────────────
// MEMBERS
// ──────────────────────────────────────────────

export async function getMembers(): Promise<Member[]> {
  "use cache";
  cacheLife("hours");
  cacheTag("members");

  const profiles = await prisma.memberProfile.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      fieldOfExpertise: true,
      photoUrl: true,
      detailUrl: true,
      emailPublic: true,
      institution: { select: { name: true, slug: true } },
    },
    orderBy: { name: "asc" },
  });

  return profiles.map((p) => ({
    id: p.id,
    name: p.name,
    email: p.email,
    field: p.fieldOfExpertise ?? "Dosen",
    institution: p.institution?.name ?? "Tidak diketahui",
    institutionSlug: p.institution?.slug,
    photo: p.photoUrl,
    detailUrl: p.detailUrl,
    emailPublic: p.emailPublic,
  }));
}

// ──────────────────────────────────────────────
// MANAGEMENTS
// ──────────────────────────────────────────────

export async function getActiveManagement(): Promise<ManagementGroup[]> {
  "use cache";
  cacheLife("hours");
  cacheTag("managements");

  const activePeriod = await prisma.managementPeriod.findFirst({
    where: { isActive: true },
    include: {
      positions: {
        include: {
          memberProfile: {
            select: { id: true, name: true, email: true, photoUrl: true },
          },
        },
        orderBy: { order: "asc" },
      },
    },
  });

  if (!activePeriod) return [];

  return [
    {
      id: activePeriod.id,
      title: `Kepengurusan Periode ${activePeriod.period}`,
      members: activePeriod.positions.map((pos) => ({
        id: pos.id,
        name: pos.memberProfile?.name ?? pos.title,
        role: pos.department
          ? `${pos.title} — ${pos.department}`
          : pos.title,
        email: pos.memberProfile?.email ?? "",
        image: pos.memberProfile?.photoUrl ?? "/assets/members/profile.jpg",
      })),
    },
  ];
}

// ──────────────────────────────────────────────
// GALLERY
// ──────────────────────────────────────────────

export async function getGallery(): Promise<DocumentationItem[]> {
  "use cache";
  cacheLife("hours");
  cacheTag("gallery");

  const items = await prisma.gallery.findMany({
    orderBy: [
      { isFeatured: "desc" },
      { sortOrder: "asc" },
      { createdAt: "desc" },
    ],
    select: {
      id: true,
      title: true,
      mediaType: true,
      mediaUrl: true,
      category: true,
      description: true,
      isFeatured: true,
      createdAt: true,
    },
  });

  return items.map((item) => ({
    id: item.id,
    type: item.mediaType === "PHOTO" ? "photo" : "video",
    image: item.mediaUrl,
    countLabel: item.mediaType === "PHOTO" ? "Foto" : "Video",
    date: formatGalleryDate(item.createdAt),
    title: item.title,
    location: item.category ?? "Surabaya",
    href: item.mediaUrl,
    description: item.description,
    isFeatured: item.isFeatured,
  }));
}

// ──────────────────────────────────────────────
// UNIVERSITIES
// ──────────────────────────────────────────────

export async function getUniversities() {
  "use cache";
  cacheLife("hours");
  cacheTag("universities");

  return prisma.university.findMany({
    orderBy: { name: "asc" },
    select: {
      id: true,
      name: true,
      slug: true,
      shortName: true,
      address: true,
      websiteUrl: true,
      logoUrl: true,
      description: true,
      _count: { select: { members: true } },
    },
  });
}

export async function getUniversityBySlug(slug: string) {
  "use cache";
  cacheLife("hours");
  cacheTag("universities");

  return prisma.university.findFirst({
    where: { OR: [{ slug }, { id: slug }] },
    select: {
      id: true,
      name: true,
      slug: true,
      shortName: true,
      address: true,
      websiteUrl: true,
      deptUrl: true,
      logoUrl: true,
      description: true,
    },
  });
}

export async function getMembersByUniversity(institutionId: string) {
  "use cache";
  cacheLife("hours");
  cacheTag("universities");

  return prisma.memberProfile.findMany({
    where: { institutionId },
    select: {
      id: true,
      name: true,
      photoUrl: true,
      position: true,
      fieldOfExpertise: true,
      nidn: true,
      googleScholarUrl: true,
      scopusUrl: true,
      orcidUrl: true,
    },
    orderBy: { name: "asc" },
  });
}

// ──────────────────────────────────────────────
// ACADEMIC
// ──────────────────────────────────────────────

export async function getAcademicStats() {
  "use cache";
  cacheLife("hours");
  cacheTag("members", "publications");

  const [totalAnggota, expertiseGroups, totalPublikasi] = await Promise.all([
    prisma.memberProfile.count(),
    prisma.memberProfile.groupBy({
      by: ["fieldOfExpertise"],
      where: { fieldOfExpertise: { not: null } },
      _count: true,
      orderBy: { _count: { fieldOfExpertise: "desc" } },
    }),
    prisma.publication.count(),
  ]);

  return { totalAnggota, expertiseGroups, totalPublikasi };
}

// ──────────────────────────────────────────────
// SITEMAP
// ──────────────────────────────────────────────

export async function getSitemapNews() {
  "use cache";
  cacheLife("hours");
  cacheTag("news");

  return prisma.news.findMany({
    where: { status: "PUBLISHED" },
    select: { slug: true, updatedAt: true },
    orderBy: { updatedAt: "desc" },
  });
}

export async function getSitemapEvents() {
  "use cache";
  cacheLife("hours");
  cacheTag("events");

  return prisma.event.findMany({
    where: { status: "PUBLISHED" },
    select: { slug: true, updatedAt: true },
    orderBy: { updatedAt: "desc" },
  });
}

export async function getSitemapUniversities() {
  "use cache";
  cacheLife("hours");
  cacheTag("universities");

  return prisma.university.findMany({
    select: { slug: true, id: true, updatedAt: true },
    orderBy: { name: "asc" },
  });
}
