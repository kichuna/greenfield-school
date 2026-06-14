import type { Metadata } from "next";
import Link from "next/link";
import { Megaphone, Calendar, ArrowRight } from "lucide-react";
import { prisma } from "@/lib/db";

export const metadata: Metadata = {
  title: "News & Announcements | Greenfield High School",
  description: "Latest news, announcements, and updates from Greenfield High School.",
};

export const revalidate = 60;

export default async function NewsPage() {
  const articles = await prisma.newsItem.findMany({
    where:   { status: "PUBLISHED" },
    orderBy: { publishedAt: "desc" },
    include: { author: { select: { name: true } } },
  }).catch(() => []);

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-r from-school-blue to-primary-700 text-white py-24">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-school-gold font-semibold text-sm uppercase tracking-wider mb-3">Stay Informed</p>
          <h1 className="text-4xl md:text-5xl font-heading font-bold mb-6">News & Announcements</h1>
          <p className="text-xl text-blue-100 max-w-xl mx-auto">
            Latest updates, achievements, and announcements from Greenfield High School.
          </p>
        </div>
      </section>

      {/* News Grid */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {articles.length === 0 ? (
            <div className="text-center py-24 text-gray-400">
              <Megaphone className="w-12 h-12 mx-auto mb-4 opacity-30" />
              <p className="text-lg font-medium">No articles published yet.</p>
              <p className="text-sm mt-1">Check back soon for updates.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {articles.map((article) => (
                <article key={article.id} className="card flex flex-col">
                  {article.coverImage ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={article.coverImage}
                      alt={article.title}
                      className="h-48 w-full object-cover"
                    />
                  ) : (
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 h-48 flex items-center justify-center">
                      <Megaphone className="w-12 h-12 text-school-blue opacity-30" />
                    </div>
                  )}
                  <div className="p-6 flex flex-col flex-1">
                    <div className="flex items-center gap-2 mb-3 flex-wrap">
                      {article.publishedAt && (
                        <span className="text-xs text-gray-400 flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(article.publishedAt).toLocaleDateString("en-KE", {
                            year: "numeric", month: "short", day: "numeric",
                          })}
                        </span>
                      )}
                      {article.author?.name && (
                        <span className="text-xs text-gray-400">· {article.author.name}</span>
                      )}
                    </div>
                    <h2 className="font-heading font-bold text-gray-900 mb-3 leading-snug">
                      {article.title}
                    </h2>
                    {article.excerpt && (
                      <p className="text-gray-500 text-sm leading-relaxed flex-1 line-clamp-3">
                        {article.excerpt}
                      </p>
                    )}
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <Link
                        href={`/news/${article.slug}`}
                        className="text-school-blue text-sm font-semibold hover:underline flex items-center gap-1"
                      >
                        Read more <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
