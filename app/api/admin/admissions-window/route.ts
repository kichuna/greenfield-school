import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export type AdmissionsWindow = {
  isOpen:         boolean;
  manualOverride: "open" | "closed" | "auto";
  startDate:      string | null;
  endDate:        string | null;
  closedMessage:  string;
  academicYear:   string;
};

const KEYS = [
  "admissions_override",
  "admissions_start",
  "admissions_end",
  "admissions_message",
  "admissions_year",
] as const;

function computeIsOpen(override: string, start: string, end: string): boolean {
  if (override === "closed") return false;
  if (override === "open")   return true;
  const now = Date.now();
  if (start && now < new Date(start).getTime()) return false;
  if (end   && now > new Date(end).getTime())   return false;
  return true;
}

export async function GET() {
  try {
    const rows = await prisma.siteSetting.findMany({ where: { key: { in: [...KEYS] } } });
    const s: Record<string, string> = {};
    rows.forEach((r) => { s[r.key] = r.value; });

    const override = (s.admissions_override as AdmissionsWindow["manualOverride"]) || "auto";

    const result: AdmissionsWindow = {
      isOpen:         computeIsOpen(override, s.admissions_start ?? "", s.admissions_end ?? ""),
      manualOverride: override,
      startDate:      s.admissions_start || null,
      endDate:        s.admissions_end   || null,
      closedMessage:  s.admissions_message || "Admissions are currently closed. Please check back later.",
      academicYear:   s.admissions_year    || "",
    };

    return NextResponse.json(result);
  } catch (err) {
    console.error("Admissions window GET error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const role    = (session?.user as any)?.role;
    if (!session || !["SUPER_ADMIN", "ADMIN"].includes(role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body: Partial<{
      manualOverride: string;
      startDate:      string;
      endDate:        string;
      closedMessage:  string;
      academicYear:   string;
    }> = await req.json();

    const updates: Record<string, string> = {};
    if (body.manualOverride !== undefined) updates.admissions_override = body.manualOverride;
    if (body.startDate      !== undefined) updates.admissions_start    = body.startDate;
    if (body.endDate        !== undefined) updates.admissions_end      = body.endDate;
    if (body.closedMessage  !== undefined) updates.admissions_message  = body.closedMessage;
    if (body.academicYear   !== undefined) updates.admissions_year     = body.academicYear;

    if (Object.keys(updates).length > 0) {
      await Promise.all(
        Object.entries(updates).map(([key, value]) =>
          prisma.siteSetting.upsert({ where: { key }, update: { value }, create: { key, value } }),
        ),
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Admissions window PUT error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
