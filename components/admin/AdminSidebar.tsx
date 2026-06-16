"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Newspaper, Calendar, FileText,
  Users, Image, Settings, GraduationCap, FolderOpen, LogOut, Activity
} from "lucide-react";
import { signOut } from "next-auth/react";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Dashboard",   href: "/admin/dashboard",   Icon: LayoutDashboard, roles: ["SUPER_ADMIN","ADMIN","STAFF"] },
  { label: "News",        href: "/admin/news",        Icon: Newspaper,        roles: ["SUPER_ADMIN","ADMIN","STAFF"] },
  { label: "Events",      href: "/admin/events",      Icon: Calendar,         roles: ["SUPER_ADMIN","ADMIN","STAFF"] },
  { label: "Admissions",  href: "/admin/admissions",  Icon: FileText,         roles: ["SUPER_ADMIN","ADMIN"] },
  { label: "Alumni",      href: "/admin/alumni",      Icon: GraduationCap,    roles: ["SUPER_ADMIN","ADMIN"] },
  { label: "Gallery",     href: "/admin/gallery",     Icon: Image,            roles: ["SUPER_ADMIN","ADMIN","STAFF"] },
  { label: "Documents",    href: "/admin/documents",    Icon: FolderOpen,  roles: ["SUPER_ADMIN","ADMIN","STAFF"] },
  { label: "Student Life", href: "/admin/student-life", Icon: Activity,    roles: ["SUPER_ADMIN","ADMIN"] },
  { label: "Users",        href: "/admin/users",        Icon: Users,       roles: ["SUPER_ADMIN"] },
  { label: "Settings",    href: "/admin/settings",    Icon: Settings,         roles: ["SUPER_ADMIN"] },
];

export function AdminSidebar({ role }: { role: string }) {
  const pathname = usePathname();

  const allowed = navItems.filter((i) => i.roles.includes(role));

  return (
    <aside className="hidden md:flex w-60 bg-school-blue flex-col">
      {/* Logo */}
      <div className="p-5 border-b border-blue-800">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-9 h-9 bg-school-gold rounded-lg flex items-center justify-center">
            <GraduationCap className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-white font-semibold text-sm leading-tight">Greenfield HS</p>
            <p className="text-blue-300 text-xs">Admin Panel</p>
          </div>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {allowed.map(({ label, href, Icon }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
              pathname === href || pathname.startsWith(href + "/")
                ? "bg-white/15 text-white"
                : "text-blue-200 hover:bg-white/10 hover:text-white"
            )}
          >
            <Icon className="w-4 h-4 shrink-0" />
            {label}
          </Link>
        ))}
      </nav>

      {/* Sign out */}
      <div className="p-4 border-t border-blue-800">
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="flex items-center gap-3 px-3 py-2.5 w-full text-blue-200 hover:text-white hover:bg-white/10 rounded-lg text-sm font-medium transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
