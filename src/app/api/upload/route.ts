import { NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import { mkdir } from "fs/promises";
import { randomUUID } from "node:crypto";
import path from "path";
import { requireAdmin } from "@/lib/auth-utils";

const MAX_FILE_SIZE = 1 * 1024 * 1024;
const ALLOWED_UPLOAD_TYPES: Record<string, readonly string[]> = {
  "image/png": ["png"],
  "image/jpeg": ["jpg", "jpeg"],
  "image/webp": ["webp"],
};

function hasValidImageSignature(buffer: Buffer, mimeType: string): boolean {
  if (mimeType === "image/png") {
    return buffer.subarray(0, 8).equals(Buffer.from("89504e470d0a1a0a", "hex"));
  }

  if (mimeType === "image/jpeg") {
    return buffer.length >= 3 && buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff;
  }

  return (
    mimeType === "image/webp" &&
    buffer.length >= 12 &&
    buffer.toString("ascii", 0, 4) === "RIFF" &&
    buffer.toString("ascii", 8, 12) === "WEBP"
  );
}

export async function POST(req: Request) {
  try {
    const session = await requireAdmin();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    let data: FormData;
    try {
      data = await req.formData();
    } catch {
      return NextResponse.json(
        { error: "Permintaan upload tidak valid." },
        { status: 400 }
      );
    }

    const file = data.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json(
        { error: "File tidak ditemukan." },
        { status: 400 }
      );
    }

    if (file.size === 0) {
      return NextResponse.json({ error: "File kosong." }, { status: 400 });
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "Ukuran file maksimal 1 MB." },
        { status: 413 }
      );
    }

    if (!file.name || /[\\/\u0000-\u001f\u007f]/.test(file.name)) {
      return NextResponse.json({ error: "Nama file tidak valid." }, { status: 400 });
    }

    const extension = path.extname(file.name).slice(1).toLowerCase();
    const allowedExtensions = ALLOWED_UPLOAD_TYPES[file.type];
    if (!allowedExtensions || !allowedExtensions.includes(extension)) {
      return NextResponse.json(
        { error: "Format file tidak didukung." },
        { status: 415 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    if (!hasValidImageSignature(buffer, file.type)) {
      return NextResponse.json(
        { error: "Isi file tidak sesuai dengan format gambar." },
        { status: 415 }
      );
    }

    const uploadDir = path.join(process.cwd(), "public/uploads/news");
    await mkdir(uploadDir, { recursive: true });

    const fileName = `${randomUUID()}.${extension}`;

    await writeFile(path.join(uploadDir, fileName), buffer);

    return NextResponse.json({
      url: `/uploads/news/${fileName}`,
    });
  } catch {
    return NextResponse.json(
      { error: "Upload gagal." },
      { status: 500 }
    );
  }
}