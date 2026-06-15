import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { deleteFromCloudinary } from "@/lib/cloudinary";

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session || !["SUPER_ADMIN", "ADMIN", "STAFF"].includes((session.user as any).role)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const item = await prisma.galleryItem.findUnique({ where: { id: params.id } });
  if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 });

  // Delete from Cloudinary if it's a Cloudinary URL
  if (item.url.includes("cloudinary.com") && item.cloudinaryPublicId) {
    await deleteFromCloudinary(item.cloudinaryPublicId).catch(() => {});
  }

  await prisma.galleryItem.delete({ where: { id: params.id } });
  return NextResponse.json({ success: true });
}
