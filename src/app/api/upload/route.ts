import { NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import { mkdir } from "fs/promises";
import path from "path";

export async function POST(req: Request) {
  try {
    const data = await req.formData();
    const file = data.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { error: "File tidak ditemukan." },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadDir = path.join(process.cwd(), "public/uploads/news");
    await mkdir(uploadDir, { recursive: true });

    const ext = file.name.split(".").pop();
    const fileName = `${Date.now()}.${ext}`;

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