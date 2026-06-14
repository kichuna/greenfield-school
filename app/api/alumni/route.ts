import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import bcrypt from "bcryptjs";
import { z } from "zod";

const registerSchema = z.object({
  name:            z.string().min(2),
  email:           z.string().email(),
  graduationYear:  z.number().int().min(1985).max(new Date().getFullYear()),
  currentJobTitle: z.string().optional(),
  currentEmployer: z.string().optional(),
  location:        z.string().optional(),
  bio:             z.string().optional(),
  linkedIn:        z.string().url().optional().or(z.literal("")),
});

// Public: list verified public alumni profiles
export async function GET() {
  const alumni = await prisma.alumniProfile.findMany({
    where:   { isVerified: true, visibility: "PUBLIC" },
    orderBy: { graduationYear: "desc" },
    include: { user: { select: { name: true } } },
  });
  return NextResponse.json(alumni);
}

// Public: register as alumni
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = registerSchema.parse({
      ...body,
      graduationYear: Number(body.graduationYear),
    });

    // Check if email already registered
    const existing = await prisma.user.findUnique({ where: { email: data.email } });
    if (existing) {
      // If they already have an alumni profile, just return success
      const profile = await prisma.alumniProfile.findUnique({ where: { userId: existing.id } });
      if (profile) {
        return NextResponse.json({ success: true, message: "Already registered." });
      }
      // Create profile for existing user
      await prisma.alumniProfile.create({
        data: {
          userId:          existing.id,
          graduationYear:  data.graduationYear,
          currentJobTitle: data.currentJobTitle,
          currentEmployer: data.currentEmployer,
          location:        data.location,
          bio:             data.bio,
          linkedIn:        data.linkedIn || null,
          isVerified:      false,
          visibility:      "PUBLIC",
        },
      });
      return NextResponse.json({ success: true });
    }

    // Create new user + alumni profile
    const tempPassword = await bcrypt.hash(Math.random().toString(36), 10);

    const user = await prisma.user.create({
      data: {
        name:     data.name,
        email:    data.email,
        password: tempPassword,
        role:     "ALUMNI",
        isActive: true,
      },
    });

    await prisma.alumniProfile.create({
      data: {
        userId:          user.id,
        graduationYear:  data.graduationYear,
        currentJobTitle: data.currentJobTitle,
        currentEmployer: data.currentEmployer,
        location:        data.location,
        bio:             data.bio,
        linkedIn:        data.linkedIn || null,
        isVerified:      false,
        visibility:      "PUBLIC",
      },
    });

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: "Validation failed", details: err.errors }, { status: 400 });
    }
    console.error("Alumni POST error:", err);
    return NextResponse.json({ error: "Registration failed" }, { status: 500 });
  }
}
