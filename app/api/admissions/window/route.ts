import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export type AdmissionsWindow = {
  isOpen:        boolean;
  manualOverride: "open" | "closed" | "auto"; // auto = date-driven
  startDate:     string | null;
  endDate:       string | null;
  closedMessage: string;
  academicYear:  string;
};

const KEYS = [
  "admissions_override",   // "open" | "closed" | "auto"
  "admissions_start",      // ISO date string or ""
  "admissions_end",        // ISO date string or ""
  "admissions_message",    // message shown when closed
  "admissions_year",       // e.g. "2025/2026"
] as const;

function computeIsOpen(
  override: string,
  start: string,
  end: string,
): boolean {
  if (override === "closed") return false;
  if (override === "open")   return true;

  // auto: check date window
  const now = Date.now();
  if (start && now < new Date(start).getTime()) return false;
  if (end   && now > new Date(end).getTime())   return false;
  return true;
}

export async function GET() {
  const rows = await prisma.siteSetting.findMany({ where: { key: { in: [...KEYS] } } });
  const s: Record<string, string> = {};
  rows.forEach((r) => { s[r.key] = r.value; });

  const override = (s.admissions_override as AdmissionsWindow["manualOverride"]) || "auto";
  const start    = s.admissions_start    || null;
  const end      = s.admissions_end      || null;

  const window: AdmissionsWindow = {
    isOpen:         computeIsOpen(override, s.admissions_start ?? "", s.admissions_end ?? ""),
    manualOverride: override,
    startDate:      start,
    endDate:        end,
    closedMessage:  s.admissions_message || "Admissions are currently closed. Please check back later.",
    academicYear:   s.admissions_year    || "",
  };

  return NextResponse.json(window);
}

export async function PUT(req: NextRequest) {
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

  await Promise.all(
    Object.entries(updates).map(([key, value]) =>
      prisma.siteSetting.upsert({ where: { key }, update: { value }, create: { key, value } }),
    ),
  );

  return NextResponse.json({ success: true });
}
