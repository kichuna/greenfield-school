import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

const MIME_TO_EXT: Record<string, string> = {
  "application/pdf":                                                                          "pdf",
  "application/msword":                                                                       "doc",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document":                 "docx",
  "application/vnd.ms-excel":                                                                "xls",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":                      "xlsx",
  "image/jpeg":                                                                               "jpg",
  "image/png":                                                                                "png",
  "image/webp":                                                                              "webp",
};

function safeFilename(title: string, ext: string) {
  const base = title.replace(/[^a-z0-9\s_-]/gi, "").trim().replace(/\s+/g, "_") || "document";
  return ext ? `${base}.${ext}` : base;
}

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const doc = await prisma.academicResource.findUnique({ where: { id: params.id } });
  if (!doc || !doc.isPublished) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await prisma.academicResource.update({
    where: { id: params.id },
    data:  { downloads: { increment: 1 } },
  });

  const ext      = MIME_TO_EXT[doc.fileType] ?? "";
  const filename = safeFilename(doc.title, ext);

  const upstream = await fetch(doc.fileUrl);
  if (!upstream.ok) {
    return NextResponse.json({ error: "File unavailable" }, { status: 502 });
  }

  return new NextResponse(upstream.body, {
    headers: {
      "Content-Type":        doc.fileType || "application/octet-stream",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control":       "no-store",
    },
  });
}
