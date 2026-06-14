"use client";

import { useState, useEffect } from "react";
import { Loader2, GraduationCap, CheckCircle, XCircle, Trash2, ExternalLink } from "lucide-react";

type Alumni = {
  id: string;
  graduationYear: number;
  currentJobTitle: string | null;
  currentEmployer: string | null;
  location: string | null;
  bio: string | null;
  linkedIn: string | null;
  isVerified: boolean;
  visibility: string;
  user: { name: string; email: string };
};

export default function AdminAlumniPage() {
  const [alumni,  setAlumni]  = useState<Alumni[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter,  setFilter]  = useState<"ALL" | "PENDING" | "VERIFIED">("ALL");

  async function load() {
    setLoading(true);
    try {
      const res  = await fetch("/api/admin/alumni");
      const data = await res.json();
      setAlumni(Array.isArray(data) ? data : []);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function verify(id: string, isVerified: boolean) {
    await fetch(`/api/alumni/${id}`, {
      method:  "PATCH",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ isVerified }),
    });
    load();
  }

  async function remove(id: string) {
    if (!confirm("Delete this alumni profile?")) return;
    await fetch(`/api/alumni/${id}`, { method: "DELETE" });
    load();
  }

  const filtered = alumni.filter((a) => {
    if (filter === "PENDING")  return !a.isVerified;
    if (filter === "VERIFIED") return a.isVerified;
    return true;
  });

  const pendingCount = alumni.filter((a) => !a.isVerified).length;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-heading font-bold text-gray-900">Alumni</h1>
          <p className="text-sm text-gray-500 mt-1">
            {pendingCount > 0 && (
              <span className="text-amber-600 font-medium">{pendingCount} pending verification · </span>
            )}
            {alumni.length} total registered
          </p>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-6">
        {(["ALL", "PENDING", "VERIFIED"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
              filter === f
                ? "bg-school-blue text-white border-school-blue"
                : "bg-white text-gray-600 border-gray-200 hover:border-school-blue hover:text-school-blue"
            }`}
          >
            {f === "ALL" ? "All" : f === "PENDING" ? `Pending (${pendingCount})` : "Verified"}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-6 h-6 animate-spin text-school-blue" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <GraduationCap className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p className="font-medium">No alumni {filter !== "ALL" ? filter.toLowerCase() : ""} yet.</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                {["Name", "Class", "Role / Employer", "Location", "Status", ""].map((h) => (
                  <th key={h} className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-5 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((a) => (
                <tr key={a.id} className="hover:bg-gray-50">
                  <td className="px-5 py-4">
                    <p className="font-medium text-gray-900">{a.user.name}</p>
                    <p className="text-xs text-gray-400">{a.user.email}</p>
                  </td>
                  <td className="px-5 py-4 text-gray-600 whitespace-nowrap">Class of {a.graduationYear}</td>
                  <td className="px-5 py-4">
                    {a.currentJobTitle && <p className="text-gray-800 font-medium">{a.currentJobTitle}</p>}
                    {a.currentEmployer && <p className="text-xs text-gray-400">{a.currentEmployer}</p>}
                    {!a.currentJobTitle && !a.currentEmployer && <span className="text-gray-300">—</span>}
                  </td>
                  <td className="px-5 py-4 text-gray-500">{a.location ?? "—"}</td>
                  <td className="px-5 py-4">
                    {a.isVerified ? (
                      <span className="badge bg-green-50 text-green-700 text-xs px-2.5 py-1 flex items-center gap-1 w-fit">
                        <CheckCircle className="w-3 h-3" /> Verified
                      </span>
                    ) : (
                      <span className="badge bg-amber-50 text-amber-700 text-xs px-2.5 py-1 flex items-center gap-1 w-fit">
                        <XCircle className="w-3 h-3" /> Pending
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2 justify-end">
                      {a.linkedIn && (
                        <a href={a.linkedIn} target="_blank" rel="noopener noreferrer"
                          className="p-1.5 text-gray-400 hover:text-school-blue hover:bg-blue-50 rounded-md transition-colors">
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                      {a.isVerified ? (
                        <button onClick={() => verify(a.id, false)}
                          title="Unverify"
                          className="p-1.5 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-md transition-colors">
                          <XCircle className="w-4 h-4" />
                        </button>
                      ) : (
                        <button onClick={() => verify(a.id, true)}
                          title="Verify"
                          className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-md transition-colors">
                          <CheckCircle className="w-4 h-4" />
                        </button>
                      )}
                      <button onClick={() => remove(a.id)}
                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
