import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { generateReference } from "@/lib/utils";
import { z } from "zod";

const applicationSchema = z.object({
  firstName:          z.string().min(2),
  lastName:           z.string().min(2),
  dateOfBirth:        z.string(),
  gender:             z.enum(["MALE", "FEMALE", "OTHER"]),
  nationality:        z.string().min(2),
  gradeApplying:      z.string(),
  academicYear:       z.string(),
  parentName:         z.string().min(2),
  parentEmail:        z.string().email(),
  parentPhone:        z.string().min(8),
  parentRelationship: z.string(),
  address:            z.string(),
  previousSchool:     z.string().optional(),
  additionalInfo:     z.string().optional(),
});

async function admissionsAreOpen(): Promise<boolean> {
  const rows = await prisma.siteSetting.findMany({
    where: { key: { in: ["admissions_override", "admissions_start", "admissions_end"] } },
  });
  const s: Record<string, string> = {};
  rows.forEach((r) => { s[r.key] = r.value; });

  const override = s.admissions_override ?? "auto";
  if (override === "closed") return false;
  if (override === "open")   return true;

  const now = Date.now();
  if (s.admissions_start && now < new Date(s.admissions_start).getTime()) return false;
  if (s.admissions_end   && now > new Date(s.admissions_end).getTime())   return false;
  return true;
}

export async function POST(req: NextRequest) {
  try {
    const open = await admissionsAreOpen();
    if (!open) {
      return NextResponse.json(
        { success: false, error: "Admissions are currently closed." },
        { status: 403 },
      );
    }

    const body = await req.json();
    const data = applicationSchema.parse(body);

    const application = await prisma.admissionApplication.create({
      data: {
        ...data,
        dateOfBirth:     new Date(data.dateOfBirth),
        referenceNumber: generateReference("APP"),
      },
    });

    return NextResponse.json({
      success: true,
      data: { referenceNumber: application.referenceNumber, id: application.id },
      message: "Application submitted successfully.",
    }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, error: "Validation failed", details: error.errors }, { status: 400 });
    }
    console.error("Admission POST error:", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const ref    = searchParams.get("ref");
  const status = searchParams.get("status") as any;
  const page   = Math.max(1, Number(searchParams.get("page") ?? 1));
  const perPage = 20;

  // Public reference lookup
  if (ref) {
    const app = await prisma.admissionApplication.findUnique({
      where: { referenceNumber: ref },
      select: { referenceNumber: true, firstName: true, lastName: true, status: true, createdAt: true, reviewedAt: true },
    });
    if (!app) return NextResponse.json({ success: false, error: "Application not found" }, { status: 404 });
    return NextResponse.json({ success: true, data: app });
  }

  // Admin list
  const where = status ? { status } : {};
  const [applications, total] = await Promise.all([
    prisma.admissionApplication.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * perPage,
      take: perPage,
    }),
    prisma.admissionApplication.count({ where }),
  ]);

  return NextResponse.json({ applications, total, page, perPage });
}
