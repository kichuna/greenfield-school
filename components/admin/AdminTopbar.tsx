"use client";

import { Bell, ExternalLink } from "lucide-react";
import Link from "next/link";

interface Props {
  user: { name?: string | null; email?: string | null; role: string };
}

export function AdminTopbar({ user }: Props) {
  return (
    <header className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-6">
      <div className="flex items-center gap-2">
        <Link
          href="/"
          target="_blank"
          className="text-xs text-gray-500 hover:text-school-blue flex items-center gap-1"
        >
          View Website <ExternalLink className="w-3 h-3" />
        </Link>
      </div>
      <div className="flex items-center gap-4">
        <button className="relative p-1.5 text-gray-400 hover:text-gray-600">
          <Bell className="w-5 h-5" />
          <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full" />
        </button>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-school-blue rounded-full flex items-center justify-center">
            <span className="text-white text-xs font-semibold">
              {user.name?.charAt(0).toUpperCase() ?? "A"}
            </span>
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-medium text-gray-900 leading-tight">{user.name}</p>
            <p className="text-xs text-gray-500">{user.role.replace("_", " ")}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
