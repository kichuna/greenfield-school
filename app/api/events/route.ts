import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { z } from "zod";

const eventSchema = z.object({
  title:       z.string().min(3),
  description: z.string().min(5),
  location:    z.string().optional(),
  startDate:   z.string(),
  endDate:     z.string().optional(),
  coverImage:  z.string().optional(),
  category:    z.enum(["ACADEMIC", "SPORTS", "CULTURAL", "ALUMNI", "GENERAL"]).default("GENERAL"),
  isPublished: z.boolean().default(false),
});

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const all = searchParams.get("all") === "true";

  const events = await prisma.event.findMany({
    where:   all ? undefined : { isPublished: true, startDate: { gte: new Date() } },
    orderBy: { startDate: "asc" },
    include: { createdBy: { select: { name: true } } },
  });

  return NextResponse.json(events);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !["SUPER_ADMIN", "ADMIN", "STAFF"].includes((session.user as any).role)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const data = eventSchema.parse(body);

    const event = await prisma.event.create({
      data: {
        title:       data.title,
        description: data.description,
        location:    data.location,
        startDate:   new Date(data.startDate),
        endDate:     data.endDate ? new Date(data.endDate) : null,
        coverImage:  data.coverImage,
        category:    data.category,
        isPublished: data.isPublished,
        createdById: (session.user as any).id,
      },
    });

    return NextResponse.json(event, { status: 201 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: "Validation failed", details: err.errors }, { status: 400 });
    }
    console.error("Event POST error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
