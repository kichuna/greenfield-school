import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { Image as ImageIcon, Layers } from "lucide-react";
import { GalleryLightbox } from "@/components/GalleryLightbox";

export const metadata: Metadata = {
  title: "Gallery | Greenfield High School",
  description: "Photos and videos from events, activities, and life at Greenfield High School.",
};

export const revalidate = 60;

export default async function GalleryPage() {
  const [albums, ungrouped] = await Promise.all([
    prisma.album.findMany({
      where:   { isPublished: true },
      orderBy: { createdAt: "desc" },
      include: {
        items: {
          where: { isPublished: true, mediaType: "IMAGE" },
          take:  1,
          select: { url: true, thumbnailUrl: true, title: true },
        },
        _count: { select: { items: true } },
      },
    }).catch(() => []),
    prisma.galleryItem.findMany({
      where:   { isPublished: true, albumId: null },
      orderBy: { createdAt: "desc" },
      select:  { id: true, title: true, description: true, url: true, thumbnailUrl: true, mediaType: true },
    }).catch(() => []),
  ]);

  const hasContent = albums.length > 0 || ungrouped.length > 0;

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-school-blue text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">Gallery</h1>
          <p className="text-lg text-blue-100 max-w-2xl mx-auto">
            Moments from academic life, sports, arts, and events at Greenfield High School.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {!hasContent ? (
          <div className="text-center py-24 text-gray-400">
            <ImageIcon className="w-16 h-16 mx-auto mb-4 opacity-25" />
            <p className="text-xl font-medium">No photos yet.</p>
            <p className="text-sm mt-2">Check back soon — photos will be added here.</p>
          </div>
        ) : (
          <>
            {/* Albums */}
            {albums.length > 0 && (
              <section className="mb-16">
                <h2 className="section-heading mb-8 flex items-center gap-3">
                  <Layers className="w-7 h-7" />
                  Albums
                </h2>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {albums.map((album) => {
                    const cover = album.items[0];
                    return (
                      <Link key={album.id} href={`/gallery/${album.id}`} className="card overflow-hidden group block">
                        <div className="relative h-52 bg-gradient-to-br from-blue-100 to-blue-200 overflow-hidden">
                          {cover ? (
                            /* eslint-disable-next-line @next/next/no-img-element */
                            <img
                              src={cover.thumbnailUrl ?? cover.url}
                              alt={cover.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          ) : (
                            <div className="flex items-center justify-center h-full">
                              <ImageIcon className="w-12 h-12 text-blue-300" />
                            </div>
                          )}
                          <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded-full">
                            {album._count.items} photo{album._count.items !== 1 ? "s" : ""}
                          </div>
                        </div>
                        <div className="p-4">
                          <h3 className="font-bold text-gray-900">{album.title}</h3>
                          {album.description && (
                            <p className="text-sm text-gray-500 mt-1 line-clamp-2">{album.description}</p>
                          )}
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </section>
            )}

            {/* Ungrouped photos */}
            {ungrouped.length > 0 && (
              <section>
                <h2 className="section-heading mb-8 flex items-center gap-3">
                  <ImageIcon className="w-7 h-7" />
                  Photos
                </h2>
                <GalleryLightbox items={ungrouped} />
              </section>
            )}
          </>
        )}
      </div>
    </div>
  );
}
