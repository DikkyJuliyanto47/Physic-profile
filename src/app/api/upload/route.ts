import { NextResponse } from "next/server";
import path from "path";
import { requireAdmin } from "@/lib/auth-utils";
import { cleanupReleasedUploads, releaseManagedUploads, storeManagedUpload } from "@/lib/media-lifecycle";

import { MAX_FILE_SIZE, ALLOWED_UPLOAD_TYPES } from "@/lib/upload-constraints";

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

    let url: string;
    try {
      url = await storeManagedUpload(buffer, extension, session.user.id);
    } catch (error) {
      console.error("[upload] Failed to store media file:", error);
      return NextResponse.json(
        { error: "Upload gagal." },
        { status: 500 }
      );
    }

    // Opportunistic cleanup; its failure does not invalidate a completed upload.
    try { await cleanupReleasedUploads(); } catch (error) {
      console.error("[upload] Released upload cleanup deferred:", error);
    }
    return NextResponse.json({ url });
  } catch (error) {
    console.error("[upload] Upload failed:", error);
    return NextResponse.json(
      { error: "Upload gagal." },
      { status: 500 }
    );
  }
}

// Release is a delayed cleanup signal, never a direct file deletion request.
export async function DELETE(req: Request) {
  try {
    const session = await requireAdmin();
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    const body: unknown = await req.json();
    if (!body || typeof body !== "object" || !("urls" in body) ||
      !Array.isArray(body.urls) || body.urls.length > 50 ||
      !body.urls.every((url: unknown) => typeof url === "string" && url.length <= 200)) {
      return NextResponse.json({ error: "Permintaan cleanup tidak valid." }, { status: 400 });
    }
    await releaseManagedUploads(body.urls, session.user.id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[upload] Failed to release uploads:", error);
    return NextResponse.json({ error: "Cleanup gagal." }, { status: 500 });
  }
}
