import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Plus, UserCheck, UserX } from "lucide-react";
import { formatDate } from "@/lib/utils";

const roleColor: Record<string, string> = {
  SUPER_ADMIN: "bg-red-50 text-red-700",
  ADMIN:       "bg-purple-50 text-purple-700",
  STAFF:       "bg-blue-50 text-blue-700",
  STUDENT:     "bg-green-50 text-green-700",
  PARENT:      "bg-amber-50 text-amber-700",
  ALUMNI:      "bg-gray-50 text-gray-700",
};

export default async function AdminUsersPage() {
  const session = await getServerSession(authOptions);
  if ((session?.user as any)?.role !== "SUPER_ADMIN") redirect("/admin/dashboard");

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: { id: true, name: true, email: true, role: true, isActive: true, createdAt: true },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-heading font-bold text-gray-900">User Management</h1>
          <p className="text-gray-500 text-sm">{users.length} users in the system</p>
        </div>
        <Link href="/admin/users/new" className="btn-primary gap-2">
          <Plus className="w-4 h-4" /> Add User
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                {["Name", "Email", "Role", "Status", "Joined", ""].map((h) => (
                  <th key={h} className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-5 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-school-blue rounded-full flex items-center justify-center shrink-0">
                        <span className="text-white text-xs font-semibold">{user.name.charAt(0)}</span>
                      </div>
                      <span className="font-medium">{user.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-gray-500 text-xs">{user.email}</td>
                  <td className="px-5 py-4">
                    <span className={`badge ${roleColor[user.role]} text-xs px-2.5 py-1`}>
                      {user.role.replace("_", " ")}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    {user.isActive ? (
                      <span className="flex items-center gap-1 text-green-600 text-xs">
                        <UserCheck className="w-3.5 h-3.5" /> Active
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-red-500 text-xs">
                        <UserX className="w-3.5 h-3.5" /> Inactive
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-4 text-gray-400 text-xs">
                    {formatDate(user.createdAt, { month: "short", day: "numeric", year: "numeric" })}
                  </td>
                  <td className="px-5 py-4">
                    <Link href={`/admin/users/${user.id}`} className="text-school-blue hover:underline text-xs">Edit</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
