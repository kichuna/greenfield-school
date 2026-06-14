import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import Link from "next/link";
import { Plus, Edit, Trash2, Eye } from "lucide-react";
import { formatDate } from "@/lib/utils";

export default async function AdminNewsPage() {
  const session = await getServerSession(authOptions);

  const news = await prisma.newsItem.findMany({
    orderBy: { createdAt: "desc" },
    include: { author: { select: { name: true } } },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-heading font-bold text-gray-900">News & Announcements</h1>
          <p className="text-gray-500 text-sm">{news.length} articles</p>
        </div>
        <Link href="/admin/news/new" className="btn-primary gap-2">
          <Plus className="w-4 h-4" /> New Article
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                {["Title", "Author", "Status", "Published", ""].map((h) => (
                  <th key={h} className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-5 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {news.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-gray-400 text-sm">No articles yet. Create your first news article.</td>
                </tr>
              ) : (
                news.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-5 py-4 font-medium max-w-xs truncate">{item.title}</td>
                    <td className="px-5 py-4 text-gray-500 text-xs">{item.author.name}</td>
                    <td className="px-5 py-4">
                      <span className={`badge text-xs px-2.5 py-1 ${
                        item.status === "PUBLISHED" ? "bg-green-50 text-green-700" :
                        item.status === "DRAFT"     ? "bg-gray-100 text-gray-600"  :
                                                      "bg-red-50 text-red-700"
                      }`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-gray-400 text-xs">
                      {item.publishedAt ? formatDate(item.publishedAt, { month: "short", day: "numeric", year: "numeric" }) : "—"}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <Link href={`/news/${item.slug}`} target="_blank" className="text-gray-400 hover:text-school-blue p-1">
                          <Eye className="w-4 h-4" />
                        </Link>
                        <Link href={`/admin/news/${item.id}/edit`} className="text-gray-400 hover:text-school-blue p-1">
                          <Edit className="w-4 h-4" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
