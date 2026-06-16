import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { slugify } from "@/lib/utils";
import { z } from "zod";

const newsSchema = z.object({
  title:   z.string().min(3),
  excerpt: z.string().optional(),
  content: z.string().min(10),
  coverImage: z.string().optional(),
  status:  z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).default("DRAFT"),
  tags:    z.array(z.string()).optional(),
});

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const all     = searchParams.get("all") === "true";
  const page    = Number(searchParams.get("page") ?? 1);
  const perPage = Number(searchParams.get("perPage") ?? 9);
  const skip    = (page - 1) * perPage;

  if (all) {
    const session = await getServerSession(authOptions);
    if (!session || !["SUPER_ADMIN", "ADMIN", "STAFF"].includes((session.user as any).role)) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }
  }

  const where = all ? undefined : { status: "PUBLISHED" as const };

  const [items, total] = await Promise.all([
    prisma.newsItem.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip:    all ? undefined : skip,
      take:    all ? undefined : perPage,
      include: { author: { select: { name: true } }, tags: true },
    }),
    prisma.newsItem.count({ where }),
  ]);

  return NextResponse.json({
    success: true,
    data: items,
    total,
    page,
    perPage,
    pages: Math.ceil(total / perPage),
  });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !["SUPER_ADMIN", "ADMIN", "STAFF"].includes((session.user as any).role)) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const data = newsSchema.parse(body);

    const slug = slugify(data.title);
    const publishedAt = data.status === "PUBLISHED" ? new Date() : null;

    const news = await prisma.newsItem.create({
      data: {
        title:       data.title,
        slug,
        excerpt:     data.excerpt,
        content:     data.content,
        coverImage:  data.coverImage,
        status:      data.status,
        publishedAt,
        authorId:    (session.user as any).id,
        tags: data.tags?.length
          ? {
              connectOrCreate: data.tags.map((t) => ({
                where:  { name: t },
                create: { name: t },
              })),
            }
          : undefined,
      },
    });

    return NextResponse.json({ success: true, data: news }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, error: "Validation failed", details: error.errors }, { status: 400 });
    }
    console.error("News POST error:", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
