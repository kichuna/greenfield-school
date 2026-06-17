import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { generateReference } from "@/lib/utils";
import { z } from "zod";

const schema = z.object({
  title:       z.string().min(3),
  description: z.string().min(5),
  category:    z.enum(["GOODS", "SERVICES", "WORKS", "CONSULTANCY", "OTHER"]).default("GOODS"),
  openDate:    z.string(),
  closingDate: z.string(),
  documentUrl: z.string().optional(),
  isPublished: z.boolean().default(false),
});

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const all = searchParams.get("all") === "true";

  const now = new Date();
  const tenders = await prisma.tender.findMany({
    where: all ? undefined : { isPublished: true },
    orderBy: { closingDate: "asc" },
    include: { createdBy: { select: { name: true } } },
  });

  return NextResponse.json(tenders);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const role    = (session?.user as any)?.role;
  if (!session || !["SUPER_ADMIN", "ADMIN", "STAFF"].includes(role)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const data = schema.parse(body);

    const tender = await prisma.tender.create({
      data: {
        title:           data.title,
        description:     data.description,
        referenceNumber: generateReference("TDR"),
        category:        data.category,
        openDate:        new Date(data.openDate),
        closingDate:     new Date(data.closingDate),
        documentUrl:     data.documentUrl || null,
        isPublished:     data.isPublished,
        createdById:     (session.user as any).id,
      },
    });

    return NextResponse.json(tender, { status: 201 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: "Validation failed", details: err.errors }, { status: 400 });
    }
    console.error("Tender POST error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
