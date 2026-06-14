import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import Link from "next/link";
import { FileText, Eye, Search } from "lucide-react";
import { formatDate } from "@/lib/utils";

const statusColor: Record<string, string> = {
  PENDING:      "bg-yellow-50 text-yellow-700 border-yellow-200",
  UNDER_REVIEW: "bg-blue-50 text-blue-700 border-blue-200",
  SHORTLISTED:  "bg-purple-50 text-purple-700 border-purple-200",
  ACCEPTED:     "bg-green-50 text-green-700 border-green-200",
  REJECTED:     "bg-red-50 text-red-700 border-red-200",
  WAITLISTED:   "bg-gray-50 text-gray-700 border-gray-200",
};

export default async function AdminAdmissionsPage({
  searchParams,
}: {
  searchParams: { status?: string; page?: string };
}) {
  const session = await getServerSession(authOptions);
  const role = (session?.user as any)?.role;
  if (!["SUPER_ADMIN", "ADMIN"].includes(role)) redirect("/admin/dashboard");

  const page    = Number(searchParams.page ?? 1);
  const perPage = 20;
  const status  = searchParams.status as any;

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

  const counts = await prisma.admissionApplication.groupBy({
    by: ["status"],
    _count: true,
  });

  const statusCounts: Record<string, number> = {};
  counts.forEach((c) => { statusCounts[c.status] = c._count; });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-heading font-bold text-gray-900">Admissions</h1>
          <p className="text-gray-500 text-sm">{total} applications total</p>
        </div>
      </div>

      {/* Status filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        {[undefined, "PENDING", "UNDER_REVIEW", "SHORTLISTED", "ACCEPTED", "REJECTED"].map((s) => (
          <Link
            key={s ?? "all"}
            href={s ? `/admin/admissions?status=${s}` : "/admin/admissions"}
            className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
              status === s || (!status && !s)
                ? "bg-school-blue text-white border-school-blue"
                : "bg-white text-gray-600 border-gray-200 hover:border-school-blue"
            }`}
          >
            {s ? `${s.replace("_", " ")} (${statusCounts[s] ?? 0})` : `All (${total})`}
          </Link>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                {["Reference", "Name", "Grade", "Year", "Parent Email", "Status", "Date", ""].map((h) => (
                  <th key={h} className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-5 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {applications.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-12 text-gray-400">
                    <FileText className="w-10 h-10 mx-auto mb-2 opacity-20" />
                    No applications found.
                  </td>
                </tr>
              ) : (
                applications.map((app) => (
                  <tr key={app.id} className="hover:bg-gray-50">
                    <td className="px-5 py-4 font-mono text-xs text-gray-500">{app.referenceNumber}</td>
                    <td className="px-5 py-4 font-medium">{app.firstName} {app.lastName}</td>
                    <td className="px-5 py-4 text-gray-500">{app.gradeApplying}</td>
                    <td className="px-5 py-4 text-gray-500">{app.academicYear}</td>
                    <td className="px-5 py-4 text-gray-500 text-xs">{app.parentEmail}</td>
                    <td className="px-5 py-4">
                      <span className={`badge border ${statusColor[app.status]} text-xs px-2.5 py-1`}>
                        {app.status.replace("_", " ")}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-gray-400 text-xs">{formatDate(app.createdAt, { month: "short", day: "numeric", year: "numeric" })}</td>
                    <td className="px-5 py-4">
                      <Link href={`/admin/admissions/${app.id}`} className="text-school-blue hover:underline flex items-center gap-1 text-xs">
                        <Eye className="w-3.5 h-3.5" /> View
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {total > perPage && (
          <div className="flex items-center justify-between px-5 py-4 border-t border-gray-100">
            <p className="text-xs text-gray-500">
              Showing {(page - 1) * perPage + 1}–{Math.min(page * perPage, total)} of {total}
            </p>
            <div className="flex gap-2">
              {page > 1 && (
                <Link href={`/admin/admissions?page=${page - 1}${status ? `&status=${status}` : ""}`} className="btn-outline text-xs py-1.5 px-3">
                  Previous
                </Link>
              )}
              {page * perPage < total && (
                <Link href={`/admin/admissions?page=${page + 1}${status ? `&status=${status}` : ""}`} className="btn-primary text-xs py-1.5 px-3">
                  Next
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
