import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { slugify } from "@/lib/utils";
import { z } from "zod";

const patchSchema = z.object({
  title:      z.string().min(3).optional(),
  excerpt:    z.string().optional(),
  content:    z.string().min(10).optional(),
  coverImage: z.string().optional(),
  status:     z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).optional(),
});

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const item = await prisma.newsItem.findUnique({
    where: { id: params.id },
    include: { author: { select: { name: true } }, tags: true },
  });

  if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(item);
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session || !["SUPER_ADMIN", "ADMIN", "STAFF"].includes((session.user as any).role)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const data = patchSchema.parse(body);

    const existing = await prisma.newsItem.findUnique({ where: { id: params.id } });
    if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const wasPublished = existing.status !== "PUBLISHED" && data.status === "PUBLISHED";
    const publishedAt  = wasPublished ? new Date() : existing.publishedAt;

    const updated = await prisma.newsItem.update({
      where: { id: params.id },
      data: {
        ...(data.title      ? { title: data.title, slug: slugify(data.title) } : {}),
        ...(data.excerpt    !== undefined ? { excerpt: data.excerpt }      : {}),
        ...(data.content    !== undefined ? { content: data.content }      : {}),
        ...(data.coverImage !== undefined ? { coverImage: data.coverImage }: {}),
        ...(data.status     ? { status: data.status, publishedAt }         : {}),
      },
    });

    return NextResponse.json(updated);
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: "Validation failed", details: err.errors }, { status: 400 });
    }
    console.error("News PATCH error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session || !["SUPER_ADMIN", "ADMIN"].includes((session.user as any).role)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await prisma.newsItem.delete({ where: { id: params.id } });
  return NextResponse.json({ success: true });
}
