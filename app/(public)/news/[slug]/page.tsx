import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { Calendar, User, ArrowLeft, Tag } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const article = await prisma.newsItem.findUnique({
    where: { slug: params.slug, status: "PUBLISHED" },
    select: { title: true, excerpt: true },
  }).catch(() => null);

  if (!article) return { title: "Article Not Found | Greenfield High School" };

  return {
    title: `${article.title} | Greenfield High School`,
    description: article.excerpt ?? undefined,
  };
}

export default async function NewsArticlePage({ params }: Props) {
  const article = await prisma.newsItem.findUnique({
    where: { slug: params.slug, status: "PUBLISHED" },
    include: { author: { select: { name: true } } },
  }).catch(() => null);

  if (!article) notFound();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-school-blue text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/news"
            className="inline-flex items-center gap-2 text-blue-200 hover:text-white text-sm mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to News
          </Link>
          <h1 className="text-3xl md:text-4xl font-heading font-bold leading-snug">
            {article.title}
          </h1>
          <div className="flex flex-wrap gap-4 mt-5 text-sm text-blue-200">
            {article.publishedAt && (
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                {new Date(article.publishedAt).toLocaleDateString("en-KE", {
                  year: "numeric", month: "long", day: "numeric",
                })}
              </span>
            )}
            {article.author?.name && (
              <span className="flex items-center gap-1.5">
                <User className="w-4 h-4" />
                {article.author.name}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {article.coverImage && (
          <div className="mb-8 rounded-xl overflow-hidden shadow-md">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={article.coverImage}
              alt={article.title}
              className="w-full h-64 md:h-96 object-cover"
            />
          </div>
        )}

        {article.excerpt && (
          <p className="text-xl text-gray-600 font-medium mb-8 leading-relaxed border-l-4 border-school-gold pl-5">
            {article.excerpt}
          </p>
        )}

        <div
          className="prose prose-lg max-w-none text-gray-700 leading-relaxed whitespace-pre-wrap"
        >
          {article.content}
        </div>

        <div className="mt-12 pt-6 border-t border-gray-200 flex items-center justify-between flex-wrap gap-4">
          <Link
            href="/news"
            className="btn-outline text-sm py-2"
          >
            <ArrowLeft className="w-4 h-4" />
            All News
          </Link>
          <span className="text-xs text-gray-400">
            Published by Greenfield High School
          </span>
        </div>
      </div>
    </div>
  );
}
