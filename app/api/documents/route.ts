import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

const ALLOWED_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "image/jpeg",
  "image/png",
];

const CATEGORY_VALUES = ["ADMISSIONS", "CURRICULUM", "EXAM_INFO", "CAREER_GUIDANCE", "GENERAL"] as const;

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category");

  const docs = await prisma.academicResource.findMany({
    where: {
      isPublished: true,
      ...(category ? { category: category as any } : {}),
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(docs);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !["SUPER_ADMIN", "ADMIN", "STAFF"].includes((session.user as any).role)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData   = await req.formData();
    const file       = formData.get("file") as File | null;
    const title      = (formData.get("title") as string)?.trim();
    const description = formData.get("description") as string | null;
    const category   = (formData.get("category") as string) || "GENERAL";

    if (!file)  return NextResponse.json({ error: "No file provided" }, { status: 400 });
    if (!title) return NextResponse.json({ error: "Title required" },   { status: 400 });

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json({ error: "File type not allowed. Upload PDF, Word, Excel, or image files." }, { status: 400 });
    }

    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return NextResponse.json({ error: "File too large (max 10MB)" }, { status: 400 });
    }

    if (!CATEGORY_VALUES.includes(category as any)) {
      return NextResponse.json({ error: "Invalid category" }, { status: 400 });
    }

    const uploadDir = path.join(process.cwd(), "public", "uploads", "documents");
    await mkdir(uploadDir, { recursive: true });

    const ext      = file.name.split(".").pop() ?? "pdf";
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const filepath = path.join(uploadDir, filename);

    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(filepath, buffer);

    const fileUrl = `/uploads/documents/${filename}`;

    const doc = await prisma.academicResource.create({
      data: {
        title,
        description: description || null,
        fileUrl,
        fileType: file.type,
        category: category as any,
        isPublished: true,
      },
    });

    return NextResponse.json(doc, { status: 201 });
  } catch (err) {
    console.error("Document upload error:", err);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
