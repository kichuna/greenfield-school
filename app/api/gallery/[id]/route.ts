import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { unlink } from "fs/promises";
import path from "path";

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session || !["SUPER_ADMIN", "ADMIN", "STAFF"].includes((session.user as any).role)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const item = await prisma.galleryItem.findUnique({ where: { id: params.id } });
  if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 });

  // Delete file from disk if it's a local upload
  if (item.url.startsWith("/uploads/")) {
    const filepath = path.join(process.cwd(), "public", item.url);
    await unlink(filepath).catch(() => {}); // ignore if already gone
  }

  await prisma.galleryItem.delete({ where: { id: params.id } });
  return NextResponse.json({ success: true });
}
