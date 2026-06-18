import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  const rows = await prisma.siteSetting.findMany({
    where: { key: { startsWith: "academics_" } },
  });
  const out: Record<string, string> = {};
  rows.forEach((r) => { out[r.key] = r.value; });
  return NextResponse.json(out);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const role    = (session?.user as any)?.role;
  if (!session || !["SUPER_ADMIN", "ADMIN"].includes(role)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body: Record<string, string> = await req.json();
  const entries = Object.entries(body).filter(([key]) => key.startsWith("academics_"));

  await Promise.all(
    entries.map(([key, value]) =>
      prisma.siteSetting.upsert({
        where:  { key },
        update: { value },
        create: { key, value },
      }),
    ),
  );

  return NextResponse.json({ success: true });
}
