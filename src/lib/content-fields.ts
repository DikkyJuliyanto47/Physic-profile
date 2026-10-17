import {
  ContentWorkflowError,
  parseNewsRevision,
  type ContentKind,
} from "./content-workflow";

export type ContentPayload = Record<string, string | number | boolean | null>;
type Field = {
  label: string;
  type?:
    | "text"
    | "textarea"
    | "email"
    | "url"
    | "date"
    | "datetime"
    | "boolean"
    | "integer"
    | "reference";
  required?: boolean;
  options?: readonly string[];
  max?: number;
  default?: string | number | boolean;
};
export const CONTENT_LABELS: Record<ContentKind, string> = {
  news: "Berita",
  event: "Agenda",
  member: "Members",
  managementPeriod: "Periode Kepengurusan",
  managementPosition: "Jabatan Kepengurusan",
  university: "Perguruan Tinggi",
  publication: "Riset & Publikasi",
  gallery: "Galeri",
};
export const CONTENT_FIELDS: Record<ContentKind, Record<string, Field>> = {
  news: {
    title: { label: "Judul", required: true, max: 200 },
    category: {
      label: "Kategori",
      required: true,
      options: [
        "ORGANISASI",
        "SEMINAR",
        "WORKSHOP",
        "PERTEMUAN_RUTIN",
        "KERJASAMA",
        "PRESTASI_ANGGOTA",
      ],
    },
    excerpt: { label: "Ringkasan", type: "textarea", max: 1000 },
    content: { label: "Konten", type: "textarea", required: true },
    imageUrl: { label: "Gambar", type: "url" },
    eventDate: { label: "Tanggal kegiatan", type: "date" },
    status: {
      label: "Status publikasi",
      required: true,
      options: ["DRAFT", "PUBLISHED", "ARCHIVED"],
      default: "PUBLISHED",
    },
  },
  event: {
    title: { label: "Judul", required: true },
    category: {
      label: "Kategori",
      required: true,
      options: [
        "SEMINAR_NASIONAL",
        "KULIAH_TAMU",
        "WEBINAR",
        "WORKSHOP",
        "MUSYAWARAH_ANGGOTA",
      ],
    },
    description: { label: "Deskripsi", type: "textarea", required: true },
    startDate: { label: "Mulai", type: "datetime", required: true },
    endDate: { label: "Selesai", type: "datetime" },
    location: { label: "Lokasi" },
    linkUrl: { label: "Tautan", type: "url" },
    imageUrl: { label: "Gambar", type: "url" },
    status: {
      label: "Status publikasi",
      required: true,
      options: ["DRAFT", "PUBLISHED", "ARCHIVED"],
      default: "PUBLISHED",
    },
  },
  member: {
    name: { label: "Nama", required: true },
    email: { label: "Email", type: "email", required: true },
    institutionId: { label: "Perguruan Tinggi", type: "reference" },
    detailUrl: { label: "Tautan profil", type: "url" },
    fieldOfExpertise: { label: "Bidang keahlian" },
    photoUrl: { label: "Foto", type: "url" },
  },
  managementPeriod: {
    period: { label: "Periode", required: true },
    isActive: { label: "Periode aktif", type: "boolean", default: false },
  },
  managementPosition: {
    periodId: { label: "Periode", type: "reference", required: true },
    memberProfileId: { label: "Anggota", type: "reference" },
    title: { label: "Jabatan", required: true },
    department: { label: "Departemen" },
    order: { label: "Urutan", type: "integer", default: 0 },
  },
  university: {
    name: { label: "Nama", required: true },
    shortName: { label: "Singkatan" },
    address: { label: "Alamat" },
    deptUrl: { label: "Tautan departemen", type: "url" },
    websiteUrl: { label: "Website", type: "url" },
    logoUrl: { label: "Logo", type: "url" },
    description: { label: "Deskripsi", type: "textarea" },
  },
  publication: {
    title: { label: "Judul", required: true },
    type: {
      label: "Jenis",
      required: true,
      options: ["JURNAL", "BUKU", "HKI", "PROSIDING"],
    },
    description: { label: "Deskripsi", type: "textarea" },
    externalUrl: { label: "Tautan", type: "url" },
    publishedAt: { label: "Tanggal publikasi", type: "datetime" },
  },
  gallery: {
    title: { label: "Judul", required: true },
    mediaType: {
      label: "Jenis media",
      required: true,
      options: ["PHOTO", "VIDEO"],
    },
    mediaUrl: { label: "Media", type: "url", required: true },
    category: { label: "Kategori" },
    description: { label: "Deskripsi", type: "textarea" },
    isFeatured: { label: "Unggulan", type: "boolean", default: false },
    sortOrder: { label: "Urutan", type: "integer", default: 0 },
  },
};

export function isContentKind(value: unknown): value is ContentKind {
  return typeof value === "string" && Object.hasOwn(CONTENT_FIELDS, value);
}

function dateTime(value: string) {
  const input = /^\d{4}-\d{2}-\d{2}$/.test(value) ? `${value}T00:00` : value;
  const match =
    /^(\d{4}-\d{2}-\d{2}T\d{2}:\d{2})(?::(\d{2})(?:\.(\d{1,3}))?)?(Z|[+-]\d{2}:\d{2})?$/.exec(
      input,
    );
  if (!match || input.startsWith("0000-"))
    throw new ContentWorkflowError("Tanggal tidak valid.");
  const seconds = match[2] ?? "00";
  const fraction = (match[3] ?? "").padEnd(3, "0");
  const local = `${match[1]}:${seconds}.${fraction}`;
  const offset = match[4] ?? "+07:00";
  const date = new Date(`${local}${offset}`);
  const sign = offset.startsWith("-") ? -1 : 1;
  const minutes =
    offset === "Z"
      ? 0
      : sign * (Number(offset.slice(1, 3)) * 60 + Number(offset.slice(4, 6)));
  if (
    Number.isNaN(date.getTime()) ||
    new Date(date.getTime() + minutes * 60000).toISOString().slice(0, -1) !==
      local
  ) {
    throw new ContentWorkflowError("Tanggal tidak valid.");
  }
  return date.toISOString();
}

function compatibleMedia(value: string, video: boolean) {
  if (
    /[\s\\\u0000-\u001f\u007f]/u.test(value) ||
    /%(?![a-f0-9]{2})/i.test(value)
  )
    return false;
  const local = value.startsWith("/") && !value.startsWith("//");
  try {
    const url = new URL(value, "https://gallery.invalid");
    if (
      (!local && !["http:", "https:"].includes(url.protocol)) ||
      url.username ||
      url.password
    )
      return false;
    if (!video) return true;
    if (local || url.port) return false;
    const id = ["youtube.com", "www.youtube.com", "m.youtube.com"].includes(
      url.hostname,
    )
      ? url.pathname === "/watch"
        ? url.searchParams.get("v")
        : /^\/embed\/([\w-]{11})\/?$/.exec(url.pathname)?.[1]
      : url.hostname === "youtu.be"
        ? /^\/([\w-]{11})\/?$/.exec(url.pathname)?.[1]
        : null;
    const renderedId =
      /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([\w-]{11})/.exec(
        value,
      )?.[1];
    return Boolean(id && /^[\w-]{11}$/.test(id) && renderedId === id);
  } catch {
    return false;
  }
}

export function normalizeContent(
  kind: ContentKind,
  raw: unknown,
  base: Record<string, unknown> = {},
): ContentPayload {
  if (!raw || typeof raw !== "object" || Array.isArray(raw))
    throw new ContentWorkflowError("Data konten tidak valid.");
  const input = raw as Record<string, unknown>;
  const result: ContentPayload = {};
  for (const [key, field] of Object.entries(CONTENT_FIELDS[kind])) {
    let value =
      input[key] === undefined
        ? (base[key] ?? field.default ?? null)
        : input[key];
    if (value instanceof Date)
      value =
        field.type === "date"
          ? value.toISOString().slice(0, 10)
          : value.toISOString();
    if (
      field.type === "date" &&
      input[key] === undefined &&
      typeof value === "string"
    )
      value = value.slice(0, 10);
    if (field.type === "boolean") {
      if (typeof value !== "boolean")
        throw new ContentWorkflowError(
          `${field.label} harus berupa pilihan aktif/nonaktif.`,
        );
      result[key] = value;
      continue;
    }
    if (field.type === "integer") {
      if (
        (typeof value !== "number" && typeof value !== "string") ||
        (typeof value === "string" && !value.trim()) ||
        !Number.isInteger(Number(value)) ||
        Number(value) < -2147483648 ||
        Number(value) > 2147483647
      ) {
        throw new ContentWorkflowError(
          `${field.label} harus bilangan bulat yang valid.`,
        );
      }
      if (typeof value === "string") {
        const decimal = /^[+-]?(\d*)(?:\.(\d*))?(?:e([+-]?\d+))?$/i.exec(
          value.trim(),
        );
        if (decimal) {
          const digits = decimal[1] + (decimal[2] ?? "");
          const fractional = Math.max(
            0,
            (decimal[2]?.length ?? 0) - Number(decimal[3] ?? 0),
          );
          if (fractional > 0 && /[1-9]/.test(digits.slice(-fractional)))
            throw new ContentWorkflowError(
              `${field.label} harus bilangan bulat.`,
            );
        }
      }
      result[key] = Number(value);
      continue;
    }
    if (value === null || value === "") {
      if (field.required)
        throw new ContentWorkflowError(`${field.label} wajib diisi.`);
      result[key] = null;
      continue;
    }
    if (
      typeof value !== "string" ||
      value.length > (field.max ?? (field.type === "textarea" ? 200000 : 2048))
    ) {
      throw new ContentWorkflowError(
        `${field.label} tidak valid atau terlalu panjang.`,
      );
    }
    let text = value.trim();
    if (field.required && !text)
      throw new ContentWorkflowError(`${field.label} wajib diisi.`);
    if (field.options && !field.options.includes(text))
      throw new ContentWorkflowError(`${field.label} tidak valid.`);
    if (field.type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(text))
      throw new ContentWorkflowError("Email tidak valid.");
    if (
      field.type === "url" &&
      text &&
      !/^(?:https?:\/\/[^\s\\]+|\/(?!\/)[^\s\\]*)$/i.test(text)
    )
      throw new ContentWorkflowError(
        `${field.label} harus berupa URL HTTP/HTTPS atau path lokal.`,
      );
    if (field.type === "datetime") text = dateTime(text);
    if (field.type === "date" && text) {
      if (
        !/^\d{4}-\d{2}-\d{2}$/.test(text) ||
        text.startsWith("0000-") ||
        Number.isNaN(new Date(`${text}T00:00:00Z`).getTime()) ||
        new Date(`${text}T00:00:00Z`).toISOString().slice(0, 10) !== text
      )
        throw new ContentWorkflowError("Tanggal kegiatan tidak valid.");
    }
    result[key] = text || null;
  }
  if (kind === "news") Object.assign(result, parseNewsRevision(result));
  if (
    kind === "event" &&
    result.endDate &&
    String(result.endDate) < String(result.startDate)
  )
    throw new ContentWorkflowError(
      "Tanggal selesai tidak boleh sebelum tanggal mulai.",
    );
  if (
    kind === "gallery" &&
    !compatibleMedia(String(result.mediaUrl), result.mediaType === "VIDEO")
  ) {
    throw new ContentWorkflowError(
      result.mediaType === "VIDEO"
        ? "Video harus menggunakan URL YouTube yang didukung."
        : "URL foto tidak valid.",
    );
  }
  return result;
}
