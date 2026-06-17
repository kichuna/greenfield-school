import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  const role    = (session?.user as any)?.role;
  if (!session || !["SUPER_ADMIN", "ADMIN", "STAFF"].includes(role)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const tender = await prisma.tender.update({
      where: { id: params.id },
      data: {
        ...(body.title       !== undefined && { title:       body.title }),
        ...(body.description !== undefined && { description: body.description }),
        ...(body.category    !== undefined && { category:    body.category }),
        ...(body.openDate    !== undefined && { openDate:    new Date(body.openDate) }),
        ...(body.closingDate !== undefined && { closingDate: new Date(body.closingDate) }),
        ...(body.documentUrl !== undefined && { documentUrl: body.documentUrl || null }),
        ...(body.isPublished !== undefined && { isPublished: body.isPublished }),
      },
    });
    return NextResponse.json(tender);
  } catch (err) {
    console.error("Tender PATCH error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  const role    = (session?.user as any)?.role;
  if (!session || !["SUPER_ADMIN", "ADMIN"].includes(role)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await prisma.tender.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Tender DELETE error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
