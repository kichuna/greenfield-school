import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import Link from "next/link";
import {
  FileText, Newspaper, Users, GraduationCap,
  TrendingUp, Clock, CheckCircle, XCircle
} from "lucide-react";

async function getStats() {
  const [
    totalApplications,
    pendingApplications,
    acceptedApplications,
    totalNews,
    totalAlumni,
    totalUsers,
    recentApplications,
  ] = await Promise.all([
    prisma.admissionApplication.count(),
    prisma.admissionApplication.count({ where: { status: "PENDING" } }),
    prisma.admissionApplication.count({ where: { status: "ACCEPTED" } }),
    prisma.newsItem.count({ where: { status: "PUBLISHED" } }),
    prisma.alumniProfile.count().catch(() => 0),
    prisma.user.count(),
    prisma.admissionApplication.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      select: {
        referenceNumber: true,
        firstName: true,
        lastName: true,
        status: true,
        createdAt: true,
        gradeApplying: true,
      },
    }),
  ]);

  return { totalApplications, pendingApplications, acceptedApplications, totalNews, totalUsers, recentApplications };
}

const statusColor: Record<string, string> = {
  PENDING:      "bg-yellow-50 text-yellow-700",
  UNDER_REVIEW: "bg-blue-50 text-blue-700",
  ACCEPTED:     "bg-green-50 text-green-700",
  REJECTED:     "bg-red-50 text-red-700",
  SHORTLISTED:  "bg-purple-50 text-purple-700",
};

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  const stats   = await getStats();

  const cards = [
    { label: "Total Applications",   value: stats.totalApplications,   Icon: FileText,      color: "text-blue-600",  bg: "bg-blue-50",  href: "/admin/admissions" },
    { label: "Pending Review",        value: stats.pendingApplications,  Icon: Clock,         color: "text-amber-600", bg: "bg-amber-50", href: "/admin/admissions?status=PENDING" },
    { label: "Accepted Students",     value: stats.acceptedApplications, Icon: CheckCircle,   color: "text-green-600", bg: "bg-green-50", href: "/admin/admissions?status=ACCEPTED" },
    { label: "Published News",        value: stats.totalNews,            Icon: Newspaper,     color: "text-purple-600",bg: "bg-purple-50",href: "/admin/news" },
    { label: "System Users",          value: stats.totalUsers,           Icon: Users,         color: "text-gray-600",  bg: "bg-gray-100", href: "/admin/users" },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-heading font-bold text-gray-900">
          Welcome back, {session?.user?.name?.split(" ")[0]}
        </h1>
        <p className="text-gray-500 text-sm mt-1">Here's what's happening at Greenfield High School.</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        {cards.map(({ label, value, Icon, color, bg, href }) => (
          <Link key={label} href={href} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className={`w-10 h-10 ${bg} rounded-lg flex items-center justify-center mb-3`}>
              <Icon className={`w-5 h-5 ${color}`} />
            </div>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            <p className="text-gray-500 text-xs mt-1">{label}</p>
          </Link>
        ))}
      </div>

      {/* Recent Applications */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900">Recent Applications</h2>
          <Link href="/admin/admissions" className="text-school-blue text-sm hover:underline">
            View all
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50">
                {["Reference", "Name", "Grade", "Status", "Date"].map((h) => (
                  <th key={h} className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {stats.recentApplications.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center text-gray-400 py-8 text-sm">No applications yet.</td>
                </tr>
              ) : (
                stats.recentApplications.map((app) => (
                  <tr key={app.referenceNumber} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-mono text-xs text-gray-600">{app.referenceNumber}</td>
                    <td className="px-6 py-4 font-medium">{app.firstName} {app.lastName}</td>
                    <td className="px-6 py-4 text-gray-500">{app.gradeApplying}</td>
                    <td className="px-6 py-4">
                      <span className={`badge ${statusColor[app.status] ?? "bg-gray-50"} text-xs px-2.5 py-1`}>
                        {app.status.replace("_", " ")}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-400 text-xs">
                      {new Date(app.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-6 grid md:grid-cols-3 gap-4">
        {[
          { label: "Write News Article", href: "/admin/news/new",  Icon: Newspaper },
          { label: "Add Event",          href: "/admin/events/new", Icon: FileText },
          { label: "Manage Users",       href: "/admin/users",      Icon: Users },
        ].map(({ label, href, Icon }) => (
          <Link key={href} href={href} className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm hover:shadow-md flex items-center gap-3 transition-shadow">
            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
              <Icon className="w-5 h-5 text-school-blue" />
            </div>
            <span className="font-medium text-gray-800 text-sm">{label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
