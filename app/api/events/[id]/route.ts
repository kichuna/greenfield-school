import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { z } from "zod";

const patchSchema = z.object({
  title:       z.string().min(3).optional(),
  description: z.string().optional(),
  location:    z.string().optional(),
  startDate:   z.string().optional(),
  endDate:     z.string().optional(),
  coverImage:  z.string().optional(),
  category:    z.enum(["ACADEMIC", "SPORTS", "CULTURAL", "ALUMNI", "GENERAL"]).optional(),
  isPublished: z.boolean().optional(),
});

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const event = await prisma.event.findUnique({ where: { id: params.id } });
  if (!event) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(event);
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session || !["SUPER_ADMIN", "ADMIN", "STAFF"].includes((session.user as any).role)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const data = patchSchema.parse(body);

    const updated = await prisma.event.update({
      where: { id: params.id },
      data: {
        ...(data.title       ? { title: data.title }               : {}),
        ...(data.description ? { description: data.description }   : {}),
        ...(data.location    !== undefined ? { location: data.location } : {}),
        ...(data.startDate   ? { startDate: new Date(data.startDate) } : {}),
        ...(data.endDate     ? { endDate: new Date(data.endDate) }  : {}),
        ...(data.coverImage  !== undefined ? { coverImage: data.coverImage } : {}),
        ...(data.category    ? { category: data.category }         : {}),
        ...(data.isPublished !== undefined ? { isPublished: data.isPublished } : {}),
      },
    });

    return NextResponse.json(updated);
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: "Validation failed" }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session || !["SUPER_ADMIN", "ADMIN"].includes((session.user as any).role)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await prisma.event.delete({ where: { id: params.id } });
  return NextResponse.json({ success: true });
}
