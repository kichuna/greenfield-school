import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { Image as ImageIcon, ArrowLeft } from "lucide-react";

export const revalidate = 60;

type Props = { params: Promise<{ albumId: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { albumId } = await params;
  const album = await prisma.album.findUnique({
    where: { id: albumId, isPublished: true },
    select: { title: true, description: true },
  });
  if (!album) return {};
  return {
    title: `${album.title} | Gallery | Greenfield High School`,
    description: album.description ?? undefined,
  };
}

export default async function AlbumPage({ params }: Props) {
  const { albumId } = await params;

  const album = await prisma.album.findUnique({
    where: { id: albumId, isPublished: true },
    include: {
      items: {
        where: { isPublished: true },
        orderBy: { createdAt: "asc" },
        select: { id: true, title: true, url: true, thumbnailUrl: true, mediaType: true },
      },
    },
  });

  if (!album) notFound();

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-school-blue text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/gallery"
            className="inline-flex items-center gap-2 text-blue-200 hover:text-white text-sm mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Gallery
          </Link>
          <h1 className="text-4xl md:text-5xl font-heading font-bold mb-3">{album.title}</h1>
          {album.description && (
            <p className="text-lg text-blue-100 max-w-2xl">{album.description}</p>
          )}
          <p className="text-blue-200 text-sm mt-2">
            {album.items.length} photo{album.items.length !== 1 ? "s" : ""}
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {album.items.length === 0 ? (
          <div className="text-center py-24 text-gray-400">
            <ImageIcon className="w-16 h-16 mx-auto mb-4 opacity-25" />
            <p className="text-xl font-medium">No photos in this album yet.</p>
          </div>
        ) : (
          <div className="columns-2 sm:columns-3 lg:columns-4 gap-4 space-y-4">
            {album.items.map((item) => (
              <div
                key={item.id}
                className="break-inside-avoid rounded-xl overflow-hidden shadow-sm group"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.thumbnailUrl ?? item.url}
                  alt={item.title}
                  className="w-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {item.title && (
                  <div className="bg-white px-3 py-2">
                    <p className="text-xs font-medium text-gray-700 truncate">{item.title}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
