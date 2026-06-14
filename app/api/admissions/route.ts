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

export async function POST(req: NextRequest) {
  try {
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
  const ref = searchParams.get("ref");

  if (ref) {
    const app = await prisma.admissionApplication.findUnique({
      where: { referenceNumber: ref },
      select: {
        referenceNumber: true,
        firstName: true,
        lastName: true,
        status: true,
        createdAt: true,
        reviewedAt: true,
      },
    });

    if (!app) return NextResponse.json({ success: false, error: "Application not found" }, { status: 404 });
    return NextResponse.json({ success: true, data: app });
  }

  return NextResponse.json({ success: false, error: "Provide ref query param" }, { status: 400 });
}
