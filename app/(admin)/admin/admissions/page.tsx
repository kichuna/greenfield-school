"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { FileText, Eye, Trash2, Loader2 } from "lucide-react";

interface Application {
  id: string;
  referenceNumber: string;
  firstName: string;
  lastName: string;
  gradeApplying: string;
  academicYear: string;
  parentEmail: string;
  status: string;
  createdAt: string;
}

const STATUS_TABS = [undefined, "PENDING", "UNDER_REVIEW", "SHORTLISTED", "ACCEPTED", "REJECTED"] as const;

const statusColor: Record<string, string> = {
  PENDING:      "bg-yellow-50 text-yellow-700 border-yellow-200",
  UNDER_REVIEW: "bg-blue-50 text-blue-700 border-blue-200",
  SHORTLISTED:  "bg-purple-50 text-purple-700 border-purple-200",
  ACCEPTED:     "bg-green-50 text-green-700 border-green-200",
  REJECTED:     "bg-red-50 text-red-700 border-red-200",
  WAITLISTED:   "bg-gray-50 text-gray-700 border-gray-200",
};

function fmt(d: string) {
  return new Date(d).toLocaleDateString("en-KE", { month: "short", day: "numeric", year: "numeric" });
}

export default function AdminAdmissionsPage() {
  const [apps,       setApps]       = useState<Application[]>([]);
  const [loading,    setLoading]    = useState(true);
  const [deleting,   setDeleting]   = useState<string | null>(null);
  const [activeTab,  setActiveTab]  = useState<string | undefined>(undefined);
  const [page,       setPage]       = useState(1);
  const [total,      setTotal]      = useState(0);
  const perPage = 20;

  const load = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(page) });
    if (activeTab) params.set("status", activeTab);
    const res  = await fetch(`/api/admissions?${params}`);
    const data = await res.json();
    setApps(data.applications ?? data);
    setTotal(data.total ?? (data.applications ?? data).length);
    setLoading(false);
  }, [activeTab, page]);

  useEffect(() => { load(); }, [load]);

  function switchTab(tab: string | undefined) {
    setActiveTab(tab);
    setPage(1);
  }

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Delete application for ${name}? This cannot be undone.`)) return;
    setDeleting(id);
    await fetch(`/api/admissions/${id}`, { method: "DELETE" });
    setApps((prev) => prev.filter((a) => a.id !== id));
    setTotal((t) => t - 1);
    setDeleting(null);
  }

  const counts: Record<string, number> = {};
  apps.forEach((a) => { counts[a.status] = (counts[a.status] ?? 0) + 1; });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-heading font-bold text-gray-900">Admissions</h1>
          <p className="text-gray-500 text-sm">{total} applications total</p>
        </div>
      </div>

      {/* Status tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {STATUS_TABS.map((s) => (
          <button
            key={s ?? "all"}
            onClick={() => switchTab(s)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
              activeTab === s
                ? "bg-school-blue text-white border-school-blue"
                : "bg-white text-gray-600 border-gray-200 hover:border-school-blue"
            }`}
          >
            {s ? s.replace("_", " ") : "All"}
          </button>
        ))}
      </div>

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
              {loading ? (
                <tr><td colSpan={8} className="text-center py-12"><Loader2 className="w-5 h-5 animate-spin mx-auto text-gray-400" /></td></tr>
              ) : apps.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-12 text-gray-400">
                    <FileText className="w-10 h-10 mx-auto mb-2 opacity-20" />
                    No applications found.
                  </td>
                </tr>
              ) : (
                apps.map((app) => (
                  <tr key={app.id} className="hover:bg-gray-50">
                    <td className="px-5 py-4 font-mono text-xs text-gray-500">{app.referenceNumber}</td>
                    <td className="px-5 py-4 font-medium">{app.firstName} {app.lastName}</td>
                    <td className="px-5 py-4 text-gray-500">{app.gradeApplying}</td>
                    <td className="px-5 py-4 text-gray-500">{app.academicYear}</td>
                    <td className="px-5 py-4 text-gray-500 text-xs">{app.parentEmail}</td>
                    <td className="px-5 py-4">
                      <span className={`badge border ${statusColor[app.status] ?? "bg-gray-100 text-gray-600"} text-xs px-2.5 py-1`}>
                        {app.status.replace("_", " ")}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-gray-400 text-xs">{fmt(app.createdAt)}</td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1">
                        <Link href={`/admin/admissions/${app.id}`} className="text-gray-400 hover:text-school-blue p-1" title="View">
                          <Eye className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(app.id, `${app.firstName} ${app.lastName}`)}
                          disabled={deleting === app.id}
                          className="text-gray-400 hover:text-red-500 p-1 transition-colors disabled:opacity-50"
                          title="Delete"
                        >
                          {deleting === app.id
                            ? <Loader2 className="w-4 h-4 animate-spin" />
                            : <Trash2 className="w-4 h-4" />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {total > perPage && (
          <div className="flex items-center justify-between px-5 py-4 border-t border-gray-100">
            <p className="text-xs text-gray-500">
              Showing {(page - 1) * perPage + 1}–{Math.min(page * perPage, total)} of {total}
            </p>
            <div className="flex gap-2">
              {page > 1 && (
                <button onClick={() => setPage((p) => p - 1)} className="btn-outline text-xs py-1.5 px-3">Previous</button>
              )}
              {page * perPage < total && (
                <button onClick={() => setPage((p) => p + 1)} className="btn-primary text-xs py-1.5 px-3">Next</button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
