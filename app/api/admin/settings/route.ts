import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  const rows = await prisma.siteSetting.findMany();
  const settings: Record<string, string> = {};
  rows.forEach((r) => { settings[r.key] = r.value; });
  return NextResponse.json(settings);
}

export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "SUPER_ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body: Record<string, string> = await req.json();

  await Promise.all(
    Object.entries(body).map(([key, value]) =>
      prisma.siteSetting.upsert({
        where:  { key },
        update: { value },
        create: { key, value },
      }),
    ),
  );

  return NextResponse.json({ success: true });
}

// PATCH: allows ADMIN+ to save admissions_* keys only
export async function PATCH(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const role    = (session?.user as any)?.role;
    if (!session || !["SUPER_ADMIN", "ADMIN"].includes(role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body: Record<string, string> = await req.json();

    const safeEntries = Object.entries(body).filter(([key]) => key.startsWith("admissions_"));
    if (safeEntries.length === 0) {
      return NextResponse.json({ success: true });
    }

    await Promise.all(
      safeEntries.map(([key, value]) =>
        prisma.siteSetting.upsert({
          where:  { key },
          update: { value },
          create: { key, value },
        }),
      ),
    );

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Settings PATCH error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
