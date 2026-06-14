import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminTopbar } from "@/components/admin/AdminTopbar";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);

  if (!session) redirect("/auth/login");

  const role = (session.user as any).role;
  if (!["SUPER_ADMIN", "ADMIN", "STAFF"].includes(role)) redirect("/");

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      <AdminSidebar role={role} />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <AdminTopbar user={session.user as any} />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
