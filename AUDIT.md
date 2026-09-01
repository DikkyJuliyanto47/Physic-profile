# Frontend Audit Report — PSI Cabang Surabaya

Generated: 2026-08-31

---

## Admin Authentication Flow

### Login
- **Route:** `/login` (inside `(admin)` route group, but NOT under `/admin`)
- **Mechanism:** Client component calls `signIn("credentials", { email, password, redirect: false })` from `next-auth/react`
- **On success:** `router.push("/admin")` + `router.refresh()`
- **On failure:** Displays "Email atau password salah."
- **Already logged in:** `authorized` callback in `auth.config.ts` redirects to `/admin`

### Session
- **Strategy:** JWT (`session: { strategy: "jwt" }`)
- **Token fields:** `id` (string) and `role` (string) stored in JWT via callbacks
- **Exposed in session:** `session.user.id` and `session.user.role`

### Logout
- **File:** `src/components/layout/AdminTopbar.tsx`
- **Normal:** `signOut({ callbackUrl: "/login" })`
- **Mock:** Clears `psi_mock_auth` cookie, redirects to `/login`

### Role Distinctions in UI
- **Database enum:** `SUPER_ADMIN | ADMIN | MEMBER`
- **UI behavior:** All three roles see the SAME sidebar items, forms, and features. No conditional rendering based on role.
- **Only differences:**
  - Role badge colors in Members list (Super Admin=red, Admin=purple, Member=blue)
  - `MEMBER` role is the default when creating new members via the admin form
  - Self-deletion prevention (can't delete/deactivate your own account)

---

## Public-Facing Pages That Consume Same Data

| Page | Route | Data Source |
|------|-------|-------------|
| Documents | `/documents` | `prisma.documentResource.findMany({ isPublic: true })` |
| Universities | `/universities` | `prisma.university.findMany()` |
| University Detail | `/universities/[slug]` | `prisma.university.findFirst()` with members |
| Academic | `/academic` | Direct Prisma queries for stats |
| News | `/news` | **Dummy data** (has TODO comment to activate real queries) |
| News Detail | `/news/[slug]` | **Dummy data** (has commented-out Prisma queries) |
| Events | `/events` | **Dummy data** |
| Event Detail | `/events/[slug]` | **Dummy data** |
| Members | `/members` | **Static data from `data.ts`** |
| Managements | `/managements` | **Static data from `data.ts`** |
| Gallery | `/gallery` | **Dummy data** (has commented-out Prisma queries) |
| Research | `/research` | **Dummy data** |

---

## Environment Variables & Config

### `.env` (live)
```
NEXTAUTH_SECRET="a3f1b2c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2"
NEXTAUTH_URL="http://localhost:3000"
DATABASE_URL="postgres://9e6c3921...@db.prisma.io:5432/postgres?sslmode=verify-full"
POSTGRES_URL="postgres://9e6c3921...@db.prisma.io:5432/postgres?sslmode=verify-full"
PRISMA_DATABASE_URL="postgres://9e6c3921...@db.prisma.io:5432/postgres?sslmode=verify-full"
```

### `.env.example`
```
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/mydb?schema=public"
```

### `prisma.config.ts`
```ts
import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: { path: "prisma/migrations", seed: "npx tsx prisma/seed.ts" },
  datasource: { url: process.env["DATABASE_URL"] },
});
```

### `next.config.ts`
```ts
import type { NextConfig } from "next";
const nextConfig: NextConfig = {};
export default nextConfig;
```

---

## Full Prisma Schema

```prisma
generator client {
  provider = "prisma-client"
  output   = "../src/generated/prisma"
}

datasource db {
  provider = "postgresql"
}

// ==========================================
// ENUMS & ROLES
// ==========================================

enum Role {
  SUPER_ADMIN
  ADMIN
  MEMBER
}

enum ContentStatus {
  DRAFT
  PUBLISHED
  ARCHIVED
}

enum NewsCategory {
  ORGANISASI
  SEMINAR
  WORKSHOP
  PERTEMUAN_RUTIN
  KERJASAMA
  PRESTASI_ANGGOTA
}

enum EventCategory {
  SEMINAR_NASIONAL
  KULIAH_TAMU
  WEBINAR
  WORKSHOP
  MUSYAWARAH_ANGGOTA
}

enum PublicationType {
  JURNAL
  BUKU
  HKI
  PROSIDING
}

enum MediaType {
  PHOTO
  VIDEO
}

// ==========================================
// AUTH & USER MANAGEMENT
// ==========================================

model User {
  id            String         @id @default(cuid())
  name          String
  email         String         @unique
  passwordHash  String
  role          Role           @default(MEMBER)
  isActive      Boolean        @default(true)
  createdAt     DateTime       @default(now())
  updatedAt     DateTime       @updatedAt

  // Relations
  memberProfile MemberProfile?
  newsCreated   News[]              @relation("NewsAuthor")
  eventsCreated Event[]             @relation("EventAuthor")
  documentsUploaded DocumentResource[] @relation("DocumentUploader")
}

// ==========================================
// DIREKTORI ANGGOTA & PERGURUAN TINGGI
// ==========================================

model University {
  id          String   @id @default(cuid())
  name        String   @unique
  slug        String?  @unique
  shortName   String?
  address     String?
  deptUrl     String?
  websiteUrl  String?
  logoUrl     String?
  description String?  @db.Text
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  members MemberProfile[]
}

model MemberProfile {
  id               String   @id @default(cuid())
  userId           String   @unique
  user             User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  institutionId    String?
  institution      University? @relation(fields: [institutionId], references: [id], onDelete: SetNull)
  
  photoUrl         String?
  nidn             String?
  position         String?
  fieldOfExpertise String?
  emailPublic      String?
  
  // Academic Profiles
  googleScholarUrl String?
  scopusUrl        String?
  orcidUrl         String?
  
  createdAt        DateTime @default(now())
  updatedAt        DateTime @updatedAt

  managementPositions ManagementPosition[]

  @@index([fieldOfExpertise])
}

// ==========================================
// KEPENGURUSAN
// ==========================================

model ManagementPeriod {
  id        String   @id @default(cuid())
  period    String   @unique
  isActive  Boolean  @default(false)
  createdAt DateTime @default(now())

  positions ManagementPosition[]
}

model ManagementPosition {
  id               String           @id @default(cuid())
  periodId         String
  period           ManagementPeriod @relation(fields: [periodId], references: [id], onDelete: Cascade)
  
  memberProfileId  String?
  memberProfile    MemberProfile?   @relation(fields: [memberProfileId], references: [id], onDelete: SetNull)
  
  title            String
  department       String?
  order            Int              @default(0)
  createdAt        DateTime         @default(now())
}

// ==========================================
// KONTEN: BERITA & AGENDA
// ==========================================

model News {
  id          String        @id @default(cuid())
  title       String
  slug        String        @unique
  category    NewsCategory
  excerpt     String?       @db.Text
  content     String        @db.Text
  imageUrl    String?
  status      ContentStatus @default(DRAFT)
  publishedAt DateTime?
  
  authorId    String
  author      User          @relation("NewsAuthor", fields: [authorId], references: [id])

  createdAt   DateTime      @default(now())
  updatedAt   DateTime      @updatedAt

  @@index([category, status])
}

model Event {
  id          String        @id @default(cuid())
  title       String
  slug        String        @unique
  category    EventCategory
  description String        @db.Text
  startDate   DateTime
  endDate     DateTime?
  location    String
  linkUrl     String?
  imageUrl    String?
  status      ContentStatus @default(DRAFT)

  authorId    String
  author      User          @relation("EventAuthor", fields: [authorId], references: [id])

  createdAt   DateTime      @default(now())
  updatedAt   DateTime      @updatedAt

  @@index([startDate, category])
}

// ==========================================
// PUBLIKASI & DOKUMEN DOWNLOAD
// ==========================================

model Publication {
  id          String          @id @default(cuid())
  title       String
  type        PublicationType
  description String?         @db.Text
  externalUrl String?
  fileUrl     String?
  publishedAt DateTime?
  createdAt   DateTime        @default(now())
  updatedAt   DateTime        @updatedAt
}

model DocumentResource {
  id          String   @id @default(cuid())
  title       String
  category    String
  description String?  @db.Text
  fileUrl     String
  fileType    String?
  fileSize    String?
  isPublic    Boolean  @default(true)
  
  uploaderId  String?
  uploader    User?    @relation("DocumentUploader", fields: [uploaderId], references: [id], onDelete: SetNull)
  
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

// ==========================================
// GALERI & PENGADUAN / KONTAK
// ==========================================

model Gallery {
  id          String    @id @default(cuid())
  title       String
  mediaType   MediaType @default(PHOTO)
  mediaUrl    String
  category    String?
  description String?   @db.Text
  isFeatured  Boolean   @default(false)
  sortOrder   Int       @default(0)
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
}

model ContactMessage {
  id        String              @id @default(cuid())
  name      String
  email     String
  subject   String
  message   String              @db.Text
  isRead    Boolean             @default(false)
  status    MessageStatus       @default(UNREAD)
  createdAt DateTime            @default(now())
}

enum MessageStatus {
  UNREAD
  READ
  REPLIED
}
```

---

## Input Types

### NewsInput

**File:** `src/actions/news.ts`

```ts
export type NewsInput = {
  title: string;
  slug?: string;
  category: NewsCategory;
  excerpt?: string;
  content: string;
  imageUrl?: string;
  status: ContentStatus;
};

export type ActionResponse = {
  success: boolean;
  error?: string;
};
```

**Server Actions:**

```ts
export async function createNews(data: NewsInput): Promise<ActionResponse> {
  try {
    if (!data.title || data.title.trim().length === 0) {
      return { success: false, error: "Judul berita wajib diisi." };
    }
    if (!data.content || data.content.trim().length === 0) {
      return { success: false, error: "Konten berita wajib diisi." };
    }

    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "Anda harus login untuk membuat berita." };
    }

    const slug = data.slug?.trim() || slugify(data.title);

    const existing = await prisma.news.findUnique({ where: { slug } });
    if (existing) {
      return { success: false, error: "Slug berita sudah ada. Gunakan judul lain." };
    }

    await prisma.news.create({
      data: {
        title: data.title.trim(),
        slug,
        category: data.category,
        excerpt: data.excerpt?.trim() || null,
        content: data.content.trim(),
        imageUrl: data.imageUrl?.trim() || null,
        status: data.status,
        publishedAt: data.status === "PUBLISHED" ? new Date() : null,
        authorId: session.user.id,
      },
    });

    revalidatePath("/admin/news");
    return { success: true };
  } catch {
    return { success: false, error: "Gagal membuat berita. Silakan coba lagi." };
  }
}

export async function updateNews(
  id: string,
  data: NewsInput
): Promise<ActionResponse> {
  try {
    if (!data.title || data.title.trim().length === 0) {
      return { success: false, error: "Judul berita wajib diisi." };
    }
    if (!data.content || data.content.trim().length === 0) {
      return { success: false, error: "Konten berita wajib diisi." };
    }

    const slug = data.slug?.trim() || slugify(data.title);

    const existing = await prisma.news.findFirst({
      where: { slug, NOT: { id } },
    });
    if (existing) {
      return { success: false, error: "Slug berita sudah ada." };
    }

    const current = await prisma.news.findUnique({ where: { id } });
    if (!current) {
      return { success: false, error: "Berita tidak ditemukan." };
    }

    const publishedAt =
      data.status === "PUBLISHED" && current.status !== "PUBLISHED"
        ? new Date()
        : data.status === "PUBLISHED"
          ? current.publishedAt
          : null;

    await prisma.news.update({
      where: { id },
      data: {
        title: data.title.trim(),
        slug,
        category: data.category,
        excerpt: data.excerpt?.trim() || null,
        content: data.content.trim(),
        imageUrl: data.imageUrl?.trim() || null,
        status: data.status,
        publishedAt,
      },
    });

    revalidatePath("/admin/news");
    revalidatePath(`/admin/news/${id}/edit`);
    return { success: true };
  } catch {
    return { success: false, error: "Gagal memperbarui berita." };
  }
}

export async function deleteNews(id: string): Promise<ActionResponse> {
  try {
    const news = await prisma.news.findUnique({ where: { id } });
    if (!news) {
      return { success: false, error: "Berita tidak ditemukan." };
    }

    await prisma.news.delete({ where: { id } });
    revalidatePath("/admin/news");
    return { success: true };
  } catch {
    return { success: false, error: "Gagal menghapus berita." };
  }
}

export async function toggleNewsStatus(id: string): Promise<ActionResponse> {
  try {
    const news = await prisma.news.findUnique({ where: { id } });
    if (!news) {
      return { success: false, error: "Berita tidak ditemukan." };
    }

    const newStatus =
      news.status === "PUBLISHED" ? ContentStatus.DRAFT : ContentStatus.PUBLISHED;

    await prisma.news.update({
      where: { id },
      data: {
        status: newStatus,
        publishedAt:
          newStatus === "PUBLISHED" ? new Date() : null,
      },
    });

    revalidatePath("/admin/news");
    return { success: true };
  } catch {
    return { success: false, error: "Gagal mengubah status berita." };
  }
}
```

---

### EventInput

**File:** `src/actions/event.ts`

```ts
export type EventInput = {
  title: string;
  slug?: string;
  category: EventCategory;
  description: string;
  startDate: string;
  endDate?: string;
  location: string;
  linkUrl?: string;
  imageUrl?: string;
  status: ContentStatus;
};

export type ActionResponse = {
  success: boolean;
  error?: string;
};
```

**Server Actions:**

```ts
export async function createEvent(data: EventInput): Promise<ActionResponse> {
  try {
    if (!data.title || data.title.trim().length === 0) {
      return { success: false, error: "Judul event wajib diisi." };
    }
    if (!data.description || data.description.trim().length === 0) {
      return { success: false, error: "Deskripsi event wajib diisi." };
    }
    if (!data.startDate) {
      return { success: false, error: "Tanggal mulai wajib diisi." };
    }
    if (!data.location || data.location.trim().length === 0) {
      return { success: false, error: "Lokasi event wajib diisi." };
    }

    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "Anda harus login untuk membuat event." };
    }

    const slug = data.slug?.trim() || slugify(data.title);

    const existing = await prisma.event.findUnique({ where: { slug } });
    if (existing) {
      return { success: false, error: "Slug event sudah ada." };
    }

    const startDate = new Date(data.startDate);
    const endDate = data.endDate ? new Date(data.endDate) : null;

    if (endDate && endDate < startDate) {
      return { success: false, error: "Tanggal selesai tidak boleh sebelum tanggal mulai." };
    }

    await prisma.event.create({
      data: {
        title: data.title.trim(),
        slug,
        category: data.category,
        description: data.description.trim(),
        startDate,
        endDate,
        location: data.location.trim(),
        linkUrl: data.linkUrl?.trim() || null,
        imageUrl: data.imageUrl?.trim() || null,
        status: data.status,
        authorId: session.user.id,
      },
    });

    revalidatePath("/admin/events");
    return { success: true };
  } catch {
    return { success: false, error: "Gagal membuat event. Silakan coba lagi." };
  }
}

export async function updateEvent(
  id: string,
  data: EventInput
): Promise<ActionResponse> {
  try {
    if (!data.title || data.title.trim().length === 0) {
      return { success: false, error: "Judul event wajib diisi." };
    }
    if (!data.description || data.description.trim().length === 0) {
      return { success: false, error: "Deskripsi event wajib diisi." };
    }
    if (!data.startDate) {
      return { success: false, error: "Tanggal mulai wajib diisi." };
    }
    if (!data.location || data.location.trim().length === 0) {
      return { success: false, error: "Lokasi event wajib diisi." };
    }

    const slug = data.slug?.trim() || slugify(data.title);

    const existing = await prisma.event.findFirst({
      where: { slug, NOT: { id } },
    });
    if (existing) {
      return { success: false, error: "Slug event sudah ada." };
    }

    const startDate = new Date(data.startDate);
    const endDate = data.endDate ? new Date(data.endDate) : null;

    if (endDate && endDate < startDate) {
      return { success: false, error: "Tanggal selesai tidak boleh sebelum tanggal mulai." };
    }

    await prisma.event.update({
      where: { id },
      data: {
        title: data.title.trim(),
        slug,
        category: data.category,
        description: data.description.trim(),
        startDate,
        endDate,
        location: data.location.trim(),
        linkUrl: data.linkUrl?.trim() || null,
        imageUrl: data.imageUrl?.trim() || null,
        status: data.status,
      },
    });

    revalidatePath("/admin/events");
    revalidatePath(`/admin/events/${id}/edit`);
    return { success: true };
  } catch {
    return { success: false, error: "Gagal memperbarui event." };
  }
}

export async function deleteEvent(id: string): Promise<ActionResponse> {
  try {
    const event = await prisma.event.findUnique({ where: { id } });
    if (!event) {
      return { success: false, error: "Event tidak ditemukan." };
    }

    await prisma.event.delete({ where: { id } });
    revalidatePath("/admin/events");
    return { success: true };
  } catch {
    return { success: false, error: "Gagal menghapus event." };
  }
}

export async function toggleEventStatus(id: string): Promise<ActionResponse> {
  try {
    const event = await prisma.event.findUnique({ where: { id } });
    if (!event) {
      return { success: false, error: "Event tidak ditemukan." };
    }

    const newStatus =
      event.status === "PUBLISHED" ? ContentStatus.DRAFT : ContentStatus.PUBLISHED;

    await prisma.event.update({
      where: { id },
      data: { status: newStatus },
    });

    revalidatePath("/admin/events");
    return { success: true };
  } catch {
    return { success: false, error: "Gagal mengubah status event." };
  }
}
```

---

### MemberInput

**File:** `src/actions/member.ts`

```ts
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
```

**Server Actions:**

```ts
export async function createMember(data: MemberInput): Promise<ActionResponse> {
  try {
    if (!data.name || data.name.trim().length === 0) {
      return { success: false, error: "Nama wajib diisi." };
    }
    if (!data.email || data.email.trim().length === 0) {
      return { success: false, error: "Email wajib diisi." };
    }

    const existing = await prisma.user.findUnique({
      where: { email: data.email.trim() },
    });
    if (existing) {
      return { success: false, error: "Email sudah terdaftar." };
    }

    const temporaryPassword = randomBytes(8).toString("hex");
    const passwordHash = await hash(temporaryPassword, 10);

    const user = await prisma.user.create({
      data: {
        name: data.name.trim(),
        email: data.email.trim(),
        passwordHash,
        role: "MEMBER",
        isActive: true,
      },
    });

    await prisma.memberProfile.create({
      data: {
        userId: user.id,
        institutionId: data.institutionId || null,
        fieldOfExpertise: data.fieldOfExpertise?.trim() || null,
        photoUrl: data.photoUrl?.trim() || null,
        profileUrl: data.profileUrl?.trim() || null,
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
    if (!data.name || data.name.trim().length === 0) {
      return { success: false, error: "Nama wajib diisi." };
    }
    if (!data.email || data.email.trim().length === 0) {
      return { success: false, error: "Email wajib diisi." };
    }

    const existing = await prisma.user.findFirst({
      where: { email: data.email.trim(), NOT: { id } },
    });
    if (existing) {
      return { success: false, error: "Email sudah digunakan oleh akun lain." };
    }

    const updateData: Record<string, unknown> = {
      name: data.name.trim(),
      email: data.email.trim(),
    };

    await prisma.user.update({ where: { id }, data: updateData });

    const profile = await prisma.memberProfile.findUnique({
      where: { userId: id },
    });

    const profileData = {
      institutionId: data.institutionId || null,
      fieldOfExpertise: data.fieldOfExpertise?.trim() || null,
      photoUrl: data.photoUrl?.trim() || null,
      profileUrl: data.profileUrl?.trim() || null,
    };

    if (profile) {
      await prisma.memberProfile.update({
        where: { userId: id },
        data: profileData,
      });
    } else {
      await prisma.memberProfile.create({
        data: { userId: id, ...profileData },
      });
    }

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
    const session = await auth();
    if (session?.user?.id === id) {
      return { success: false, error: "Anda tidak dapat menghapus akun sendiri." };
    }

    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
      return { success: false, error: "Anggota tidak ditemukan." };
    }

    await prisma.memberProfile.deleteMany({ where: { userId: id } });
    await prisma.user.delete({ where: { id } });

    revalidatePath("/admin/members");
    revalidatePath("/members");
    return { success: true };
  } catch {
    return { success: false, error: "Gagal menghapus anggota." };
  }
}

export async function toggleMemberActive(id: string): Promise<ActionResponse> {
  try {
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
      return { success: false, error: "Anggota tidak ditemukan." };
    }

    await prisma.user.update({
      where: { id },
      data: { isActive: !user.isActive },
    });

    revalidatePath("/admin/members");
    revalidatePath("/members");
    return { success: true };
  } catch {
    return { success: false, error: "Gagal mengubah status anggota." };
  }
}
```

---

### UniversityInput

**File:** `src/actions/university.ts`

```ts
export type UniversityInput = {
  name: string;
  shortName?: string;
  slug?: string;
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
```

**Server Actions:**

```ts
export async function createUniversity(
  data: UniversityInput
): Promise<ActionResponse> {
  try {
    if (!data.name || data.name.trim().length === 0) {
      return { success: false, error: "Nama kampus wajib diisi." };
    }

    const slug = data.slug?.trim() || slugify(data.name);

    const existing = await prisma.university.findFirst({
      where: { OR: [{ name: data.name }, { slug }] },
    });

    if (existing) {
      return {
        success: false,
        error: "Nama atau slug kampus sudah ada.",
      };
    }

    await prisma.university.create({
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
    });

    revalidatePath("/admin/universities");
    revalidatePath("/universities");
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
    if (!data.name || data.name.trim().length === 0) {
      return { success: false, error: "Nama kampus wajib diisi." };
    }

    const slug = data.slug?.trim() || slugify(data.name);

    const existing = await prisma.university.findFirst({
      where: {
        OR: [{ name: data.name }, { slug }],
        NOT: { id },
      },
    });

    if (existing) {
      return {
        success: false,
        error: "Nama atau slug kampus sudah ada.",
      };
    }

    await prisma.university.update({
      where: { id },
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
    });

    revalidatePath("/admin/universities");
    revalidatePath("/universities");
    revalidatePath(`/admin/universities/${id}/edit`);
    return { success: true };
  } catch {
    return { success: false, error: "Gagal memperbarui kampus. Silakan coba lagi." };
  }
}

export async function deleteUniversity(id: string): Promise<ActionResponse> {
  try {
    const university = await prisma.university.findUnique({
      where: { id },
      include: { _count: { select: { members: true } } },
    });

    if (!university) {
      return { success: false, error: "Kampus tidak ditemukan." };
    }

    if (university._count.members > 0) {
      return {
        success: false,
        error: `Tidak dapat menghapus kampus yang memiliki ${university._count.members} anggota terdaftar. Hapus atau pindahkan anggota terlebih dahulu.`,
      };
    }

    await prisma.university.delete({ where: { id } });

    revalidatePath("/admin/universities");
    revalidatePath("/universities");
    return { success: true };
  } catch {
    return { success: false, error: "Gagal menghapus kampus. Silakan coba lagi." };
  }
}
```

---

### PublicationInput

**File:** `src/actions/publication.ts`

```ts
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
```

**Server Actions:**

```ts
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
        fileUrl: data.fileUrl?.trim() || null,
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
        fileUrl: data.fileUrl?.trim() || null,
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
```

---

### GalleryInput

**File:** `src/actions/gallery.ts`

```ts
export type GalleryInput = {
  title: string;
  mediaType: MediaType;
  mediaUrl: string;
  category?: string;
  description?: string;
  isFeatured: boolean;
  sortOrder: number;
};

export type ActionResponse = {
  success: boolean;
  error?: string;
};
```

**Server Actions:**

```ts
export async function createGallery(
  data: GalleryInput
): Promise<ActionResponse> {
  try {
    if (!data.title || data.title.trim().length === 0) {
      return { success: false, error: "Judul wajib diisi." };
    }
    if (!data.mediaUrl || data.mediaUrl.trim().length === 0) {
      return { success: false, error: "URL media wajib diisi." };
    }

    await prisma.gallery.create({
      data: {
        title: data.title.trim(),
        mediaType: data.mediaType,
        mediaUrl: data.mediaUrl.trim(),
        category: data.category?.trim() || null,
        description: data.description?.trim() || null,
        isFeatured: data.isFeatured,
        sortOrder: data.sortOrder,
      },
    });

    revalidatePath("/admin/gallery");
    revalidatePath("/gallery");
    return { success: true };
  } catch {
    return {
      success: false,
      error: "Gagal membuat item galeri. Silakan coba lagi.",
    };
  }
}

export async function updateGallery(
  id: string,
  data: GalleryInput
): Promise<ActionResponse> {
  try {
    if (!data.title || data.title.trim().length === 0) {
      return { success: false, error: "Judul wajib diisi." };
    }
    if (!data.mediaUrl || data.mediaUrl.trim().length === 0) {
      return { success: false, error: "URL media wajib diisi." };
    }

    const item = await prisma.gallery.findUnique({ where: { id } });
    if (!item) {
      return { success: false, error: "Item galeri tidak ditemukan." };
    }

    await prisma.gallery.update({
      where: { id },
      data: {
        title: data.title.trim(),
        mediaType: data.mediaType,
        mediaUrl: data.mediaUrl.trim(),
        category: data.category?.trim() || null,
        description: data.description?.trim() || null,
        isFeatured: data.isFeatured,
        sortOrder: data.sortOrder,
      },
    });

    revalidatePath("/admin/gallery");
    revalidatePath("/gallery");
    revalidatePath(`/admin/gallery/${id}/edit`);
    return { success: true };
  } catch {
    return { success: false, error: "Gagal memperbarui item galeri." };
  }
}

export async function deleteGallery(
  id: string
): Promise<ActionResponse> {
  try {
    const item = await prisma.gallery.findUnique({ where: { id } });
    if (!item) {
      return { success: false, error: "Item galeri tidak ditemukan." };
    }

    await prisma.gallery.delete({ where: { id } });
    revalidatePath("/admin/gallery");
    revalidatePath("/gallery");
    return { success: true };
  } catch {
    return { success: false, error: "Gagal menghapus item galeri." };
  }
}

export const createGalleryItem = createGallery;
export const updateGalleryItem = updateGallery;
export const deleteGalleryItem = deleteGallery;
```

---

### DocumentInput

**File:** `src/actions/document.ts`

```ts
export type DocumentInput = {
  title: string;
  category: string;
  description?: string;
  fileUrl: string;
  fileType?: string;
  fileSize?: string;
  isPublic: boolean;
};

export type ActionResponse = {
  success: boolean;
  error?: string;
};
```

**Server Actions:**

```ts
export async function createDocument(
  data: DocumentInput
): Promise<ActionResponse> {
  try {
    if (!data.title || data.title.trim().length === 0) {
      return { success: false, error: "Judul dokumen wajib diisi." };
    }
    if (!data.fileUrl || data.fileUrl.trim().length === 0) {
      return { success: false, error: "URL file wajib diisi." };
    }
    if (!data.category || data.category.trim().length === 0) {
      return { success: false, error: "Kategori wajib dipilih." };
    }

    const session = await auth();

    await prisma.documentResource.create({
      data: {
        title: data.title.trim(),
        category: data.category.trim(),
        description: data.description?.trim() || null,
        fileUrl: data.fileUrl.trim(),
        fileType: data.fileType?.trim() || null,
        fileSize: data.fileSize?.trim() || null,
        isPublic: data.isPublic,
        uploaderId: session?.user?.id || null,
      },
    });

    revalidatePath("/admin/documents");
    return { success: true };
  } catch {
    return {
      success: false,
      error: "Gagal membuat dokumen. Silakan coba lagi.",
    };
  }
}

export async function updateDocument(
  id: string,
  data: DocumentInput
): Promise<ActionResponse> {
  try {
    if (!data.title || data.title.trim().length === 0) {
      return { success: false, error: "Judul dokumen wajib diisi." };
    }
    if (!data.fileUrl || data.fileUrl.trim().length === 0) {
      return { success: false, error: "URL file wajib diisi." };
    }

    const doc = await prisma.documentResource.findUnique({ where: { id } });
    if (!doc) {
      return { success: false, error: "Dokumen tidak ditemukan." };
    }

    await prisma.documentResource.update({
      where: { id },
      data: {
        title: data.title.trim(),
        category: data.category.trim(),
        description: data.description?.trim() || null,
        fileUrl: data.fileUrl.trim(),
        fileType: data.fileType?.trim() || null,
        fileSize: data.fileSize?.trim() || null,
        isPublic: data.isPublic,
      },
    });

    revalidatePath("/admin/documents");
    revalidatePath(`/admin/documents/${id}/edit`);
    return { success: true };
  } catch {
    return { success: false, error: "Gagal memperbarui dokumen." };
  }
}

export async function deleteDocument(id: string): Promise<ActionResponse> {
  try {
    const doc = await prisma.documentResource.findUnique({ where: { id } });
    if (!doc) {
      return { success: false, error: "Dokumen tidak ditemukan." };
    }

    await prisma.documentResource.delete({ where: { id } });
    revalidatePath("/admin/documents");
    return { success: true };
  } catch {
    return { success: false, error: "Gagal menghapus dokumen." };
  }
}

export async function toggleDocumentVisibility(
  id: string
): Promise<ActionResponse> {
  try {
    const doc = await prisma.documentResource.findUnique({ where: { id } });
    if (!doc) {
      return { success: false, error: "Dokumen tidak ditemukan." };
    }

    await prisma.documentResource.update({
      where: { id },
      data: { isPublic: !doc.isPublic },
    });

    revalidatePath("/admin/documents");
    return { success: true };
  } catch {
    return {
      success: false,
      error: "Gagal mengubah visibilitas dokumen.",
    };
  }
}
```

---

### ManagementPeriodInput

**File:** `src/actions/management.ts`

```ts
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

export type ActionResponse = {
  success: boolean;
  error?: string;
};
```

**Server Actions:**

```ts
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
    revalidatePath("/managements");
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
    revalidatePath("/managements");
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
    revalidatePath("/managements");
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
    revalidatePath("/managements");
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
    revalidatePath("/managements");
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
    revalidatePath("/managements");
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
    revalidatePath("/managements");
    revalidatePath(`/admin/kepengurusan/${position.periodId}/edit`);
    return { success: true };
  } catch {
    return { success: false, error: "Gagal menghapus posisi kepengurusan." };
  }
}
```

---

### MessageFilters

**File:** `src/actions/message.ts`

```ts
export type MessageFilters = {
  q?: string;
  status?: string;
};

export type ActionResponse = {
  success: boolean;
  error?: string;
};
```

**Server Actions:**

```ts
export async function getMessages(filters: MessageFilters = {}) {
  const where: Record<string, unknown> = {};

  if (filters.q) {
    where.OR = [
      { name: { contains: filters.q, mode: "insensitive" } },
      { email: { contains: filters.q, mode: "insensitive" } },
      { subject: { contains: filters.q, mode: "insensitive" } },
    ];
  }

  if (filters.status && ["UNREAD", "READ", "REPLIED"].includes(filters.status)) {
    where.status = filters.status as MessageStatus;
  }

  const [messages, unreadCount] = await Promise.all([
    prisma.contactMessage.findMany({
      where,
      orderBy: { createdAt: "desc" },
    }),
    prisma.contactMessage.count({
      where: { status: "UNREAD" },
    }),
  ]);

  return { messages, unreadCount };
}

export async function markAsRead(id: string): Promise<ActionResponse> {
  try {
    const msg = await prisma.contactMessage.findUnique({ where: { id } });
    if (!msg) {
      return { success: false, error: "Pesan tidak ditemukan." };
    }

    await prisma.contactMessage.update({
      where: { id },
      data: { isRead: true, status: "READ" },
    });

    revalidatePath("/admin/messages");
    return { success: true };
  } catch {
    return { success: false, error: "Gagal menandai pesan." };
  }
}

export async function markAsUnread(id: string): Promise<ActionResponse> {
  try {
    const msg = await prisma.contactMessage.findUnique({ where: { id } });
    if (!msg) {
      return { success: false, error: "Pesan tidak ditemukan." };
    }

    await prisma.contactMessage.update({
      where: { id },
      data: { isRead: false, status: "UNREAD" },
    });

    revalidatePath("/admin/messages");
    return { success: true };
  } catch {
    return { success: false, error: "Gagal menandai pesan." };
  }
}

export async function deleteMessage(id: string): Promise<ActionResponse> {
  try {
    const msg = await prisma.contactMessage.findUnique({ where: { id } });
    if (!msg) {
      return { success: false, error: "Pesan tidak ditemukan." };
    }

    await prisma.contactMessage.delete({ where: { id } });
    revalidatePath("/admin/messages");
    return { success: true };
  } catch {
    return { success: false, error: "Gagal menghapus pesan." };
  }
}
```

---

## Auth Configuration

### `middleware.ts`

**No `middleware.ts` file exists.** I searched for `middleware.ts` and `middleware.js` at the project root and under `src/`. Neither exists.

### `src/auth.config.ts` (full content)

```ts
import type { NextAuthConfig } from "next-auth";
import {
  MOCK_AUTH_COOKIE_NAME,
  MOCK_AUTH_USER,
  getMockAuthCookieValue,
  isMockAuthEnabled,
} from "@/lib/mock-auth";

export const authConfig = {
  pages: {
    signIn: "/login",
  },
  providers: [],
  callbacks: {
    authorized({ auth, request }) {
      const nextUrl = request.nextUrl;
      const cookieHeader = request.headers.get("cookie") ?? undefined;
      const mockCookieValue =
        request.cookies?.get?.(MOCK_AUTH_COOKIE_NAME)?.value ??
        getMockAuthCookieValue(cookieHeader) ??
        "";
      const isMockAuthenticated =
        isMockAuthEnabled() && mockCookieValue === "true";
      const isLoggedIn = !!auth?.user || isMockAuthenticated;
      const isOnAdmin = nextUrl.pathname.startsWith("/admin");
      const isOnLogin = nextUrl.pathname.startsWith("/login");

      if (isOnAdmin) {
        if (!isLoggedIn) return false;

        const userRole = (auth?.user?.role as string | undefined) ?? MOCK_AUTH_USER.role;
        if (userRole !== "SUPER_ADMIN" && userRole !== "ADMIN") {
          return Response.redirect(new URL("/login", nextUrl));
        }

        return true;
      }

      if (isLoggedIn && isOnLogin) {
        return Response.redirect(new URL("/admin", nextUrl));
      }

      return true;
    },
  },
} satisfies NextAuthConfig;
```

### `src/auth.ts` (full content)

```ts
import { cookies } from "next/headers";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { authConfig } from "@/auth.config";
import {
  MOCK_AUTH_USER,
  hasMockAuthCookieStore,
  isMockAuthEnabled,
} from "@/lib/mock-auth";

const nextAuth = NextAuth({
  ...authConfig,
  secret: process.env.AUTH_SECRET,
  session: { strategy: "jwt" },
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const email = credentials.email as string;
        const password = credentials.password as string;

        const user = await prisma.user.findUnique({
          where: { email },
        });

        if (!user || !user.isActive) {
          return null;
        }

        const isPasswordValid = await compare(password, user.passwordHash);

        if (!isPasswordValid) {
          return null;
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
});

export const { handlers, signIn, signOut } = nextAuth;

export async function auth() {
  const session = await nextAuth.auth();

  if (session || !isMockAuthEnabled()) {
    return session;
  }

  const cookieStore = await cookies();

  if (hasMockAuthCookieStore(cookieStore)) {
    return {
      user: { ...MOCK_AUTH_USER },
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    };
  }

  return null;
}
```

### `src/app/api/auth/[...nextauth]/route.ts`

```ts
import { handlers } from "@/auth";
export const { GET, POST } = handlers;
```

---

## Auth Verification: How Routes Are Actually Protected

### Mechanism Analysis

NextAuth v5 uses the `authorized` callback from `authConfig` in `auth.config.ts`. For this callback to run as **route-level middleware**, a `middleware.ts` file must exist at the project root or `src/`. **It does not.**

Without a `middleware.ts` file, the `authorized` callback in `auth.config.ts` is **NOT enforced as middleware**. However, it may still be invoked by NextAuth internally when `auth()` is called in server components and server actions — this depends on how NextAuth v5 wires things.

### What the Admin Layout Does

The admin layout at `src/app/(admin)/admin/layout.tsx` is a **client component** (`"use client"`). It renders `SessionProvider` but performs **NO server-side auth check**. There is no `await auth()` call, no redirect logic.

### What Individual Admin Pages Do

| Page | File | Auth Check |
|------|------|------------|
| Dashboard | `admin/page.tsx` | **None** — queries Prisma directly |
| News list | `admin/news/page.tsx` | **None** |
| News create | `admin/news/new/page.tsx` | **None** |
| News edit | `admin/news/[id]/edit/page.tsx` | **None** — only calls `notFound()` if record missing |
| Members list | `admin/members/page.tsx` | **Yes** — calls `await auth()` to get current user ID for `isCurrentUser` check, but does NOT redirect if unauthenticated |
| Members create | `admin/members/new/page.tsx` | **None** |
| All other admin pages | Various | **None** |

### What Server Actions Do

| Action | Auth Check |
|--------|------------|
| `createNews` | Yes — checks `session?.user?.id`, returns error if missing |
| `updateNews` | No |
| `deleteNews` | No |
| `toggleNewsStatus` | No |
| `createEvent` | Yes — checks `session?.user?.id`, returns error if missing |
| `updateEvent` | No |
| `deleteEvent` | No |
| `toggleEventStatus` | No |
| `createMember` | No |
| `updateMember` | No |
| `deleteMember` | Yes — checks `session?.user?.id` for self-deletion guard only |
| `toggleMemberActive` | No |
| `createDocument` | Yes — calls `auth()` to get `uploaderId` |
| `updateDocument` | No |
| `deleteDocument` | No |
| `toggleDocumentVisibility` | No |
| `createPublication` | No |
| `updatePublication` | No |
| `deletePublication` | No |
| `createGallery` | No |
| `updateGallery` | No |
| `deleteGallery` | No |
| `createUniversity` | No |
| `updateUniversity` | No |
| `deleteUniversity` | No |
| `createManagementPeriod` | No |
| `updateManagementPeriod` | No |
| `deleteManagementPeriod` | No |
| `setActiveManagementPeriod` | No |
| `createManagementPosition` | No |
| `updateManagementPosition` | No |
| `deleteManagementPosition` | No |
| `getMessages` | No |
| `markAsRead` | No |
| `markAsUnread` | No |
| `deleteMessage` | No |

### Verdict

**Admin routes are NOT currently protected — this is a gap.**

- No `middleware.ts` exists, so the `authorized` callback in `auth.config.ts` is not enforced as route-level middleware.
- The admin layout is a client component with no server-side auth check.
- Most admin pages have no `await auth()` call. The one exception (members page) calls `auth()` only to identify the current user, not to guard access.
- The `authorized` callback in `auth.config.ts` would protect routes IF it were wired into middleware, but currently it is not.
- Most server actions also lack auth checks — only `createNews`, `createEvent`, `createDocument`, and `deleteMember` check the session, and even those return errors rather than redirecting.

**Practical implication:** Any visitor who navigates to `/admin` can see the dashboard and all admin pages, and can call server actions to create/edit/delete data, without being logged in.
