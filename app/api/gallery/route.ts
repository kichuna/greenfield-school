import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { uploadToCloudinary } from "@/lib/cloudinary";

export async function GET() {
  const [albums, items] = await Promise.all([
    prisma.album.findMany({
      where:   { isPublished: true },
      orderBy: { createdAt: "desc" },
      include: { _count: { select: { items: true } } },
    }),
    prisma.galleryItem.findMany({
      where:   { isPublished: true },
      orderBy: { createdAt: "desc" },
    }),
  ]);
  return NextResponse.json({ albums, items });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !["SUPER_ADMIN", "ADMIN", "STAFF"].includes((session.user as any).role)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData    = await req.formData();
    const file        = formData.get("file") as File | null;
    const title       = formData.get("title") as string || "Untitled";
    const albumId     = formData.get("albumId") as string | null;
    const description = formData.get("description") as string | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json({ error: "File too large (max 5MB)" }, { status: 400 });
    }

    const allowed = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!allowed.includes(file.type)) {
      return NextResponse.json({ error: "Only JPEG, PNG, WebP, and GIF images are allowed" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const { url, publicId } = await uploadToCloudinary(buffer, "gallery");

    const item = await prisma.galleryItem.create({
      data: {
        title,
        description,
        url,
        cloudinaryPublicId: publicId,
        mediaType:   "IMAGE",
        isPublished: true,
        albumId:     albumId || null,
      },
    });

    return NextResponse.json(item, { status: 201 });
  } catch (err) {
    console.error("Gallery upload error:", err);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
