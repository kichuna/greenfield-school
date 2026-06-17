"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { FileText, Eye, Trash2, Loader2, Save, CheckCircle2, Lock, Unlock, Clock } from "lucide-react";

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

type WindowSettings = {
  manualOverride: "open" | "closed" | "auto";
  startDate:      string;
  endDate:        string;
  closedMessage:  string;
  academicYear:   string;
  isOpen:         boolean;
};

const DEFAULT_WINDOW: WindowSettings = {
  manualOverride: "auto",
  startDate:      "",
  endDate:        "",
  closedMessage:  "Admissions are currently closed. Please check back later.",
  academicYear:   "",
  isOpen:         true,
};

export default function AdminAdmissionsPage() {
  const [apps,       setApps]       = useState<Application[]>([]);
  const [loading,    setLoading]    = useState(true);
  const [deleting,   setDeleting]   = useState<string | null>(null);
  const [activeTab,  setActiveTab]  = useState<string | undefined>(undefined);
  const [page,       setPage]       = useState(1);
  const [total,      setTotal]      = useState(0);
  const perPage = 20;

  // Window settings
  const [winSettings,  setWinSettings] = useState<WindowSettings>(DEFAULT_WINDOW);
  const [winLoading,   setWinLoading]  = useState(true);
  const [winSaving,    setWinSaving]   = useState(false);
  const [winSaved,     setWinSaved]    = useState(false);
  const [winError,     setWinError]    = useState("");

  useEffect(() => {
    fetch("/api/admin/admissions-window")
      .then((r) => r.json())
      .then((d) => setWinSettings({
        manualOverride: d.manualOverride ?? "auto",
        startDate:      d.startDate ? d.startDate.slice(0, 10) : "",
        endDate:        d.endDate   ? d.endDate.slice(0, 10)   : "",
        closedMessage:  d.closedMessage ?? DEFAULT_WINDOW.closedMessage,
        academicYear:   d.academicYear  ?? "",
        isOpen:         d.isOpen ?? true,
      }))
      .catch(() => {})
      .finally(() => setWinLoading(false));
  }, []);

  async function saveWindow() {
    setWinSaving(true);
    setWinError("");
    setWinSaved(false);
    try {
      const res = await fetch("/api/admin/settings", {
        method:  "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          admissions_override: winSettings.manualOverride,
          admissions_start:    winSettings.startDate || "",
          admissions_end:      winSettings.endDate   || "",
          admissions_message:  winSettings.closedMessage,
          admissions_year:     winSettings.academicYear,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? `Error ${res.status}`);
      }
      // Recompute isOpen locally
      let isOpen = true;
      if (winSettings.manualOverride === "closed") isOpen = false;
      else if (winSettings.manualOverride === "open") isOpen = true;
      else {
        const now = Date.now();
        if (winSettings.startDate && now < new Date(winSettings.startDate).getTime()) isOpen = false;
        if (winSettings.endDate   && now > new Date(winSettings.endDate).getTime())   isOpen = false;
      }
      setWinSettings((w) => ({ ...w, isOpen }));
      setWinSaved(true);
      setTimeout(() => setWinSaved(false), 3000);
    } catch (err: any) {
      setWinError(err.message ?? "Failed to save. Try again.");
    } finally {
      setWinSaving(false);
    }
  }

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
      {/* ── Admissions Window Control ── */}
      <div className="mb-8 bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className={`w-2.5 h-2.5 rounded-full ${winSettings.isOpen ? "bg-green-500" : "bg-red-500"}`} />
            <span className="font-semibold text-gray-900 text-sm">
              Admissions Window
            </span>
            <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
              winSettings.isOpen
                ? "bg-green-50 text-green-700"
                : "bg-red-50 text-red-700"
            }`}>
              {winSettings.isOpen ? "Open" : "Closed"}
            </span>
          </div>
          <button
            onClick={saveWindow}
            disabled={winSaving || winLoading}
            className="btn-primary text-sm py-1.5"
          >
            {winSaving ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Saving…</>
            ) : winSaved ? (
              <><CheckCircle2 className="w-4 h-4" /> Saved!</>
            ) : (
              <><Save className="w-4 h-4" /> Save</>
            )}
          </button>
        </div>

        {winLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
          </div>
        ) : (
          <div className="p-6 space-y-5">
            {winError && (
              <p className="text-red-600 text-sm">{winError}</p>
            )}

            {/* Override toggle */}
            <div>
              <label className="label text-xs mb-2">Access Control</label>
              <div className="flex gap-2 flex-wrap">
                {(["auto", "open", "closed"] as const).map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setWinSettings((w) => ({ ...w, manualOverride: opt }))}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
                      winSettings.manualOverride === opt
                        ? opt === "closed"
                          ? "bg-red-600 text-white border-red-600"
                          : opt === "open"
                          ? "bg-green-600 text-white border-green-600"
                          : "bg-school-blue text-white border-school-blue"
                        : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    {opt === "closed" && <Lock className="w-3.5 h-3.5" />}
                    {opt === "open"   && <Unlock className="w-3.5 h-3.5" />}
                    {opt === "auto"   && <Clock className="w-3.5 h-3.5" />}
                    {opt === "auto" ? "Date-driven (auto)" : opt.charAt(0).toUpperCase() + opt.slice(1)}
                  </button>
                ))}
              </div>
              <p className="text-xs text-gray-400 mt-1.5">
                {winSettings.manualOverride === "auto"   && "Opens/closes based on the dates you set below."}
                {winSettings.manualOverride === "open"   && "Admissions are forced open regardless of dates."}
                {winSettings.manualOverride === "closed" && "Admissions are forced closed regardless of dates."}
              </p>
            </div>

            {/* Date window */}
            <div className="grid sm:grid-cols-3 gap-4">
              <div>
                <label className="label text-xs">Opens On</label>
                <input
                  type="date"
                  className="input text-sm"
                  value={winSettings.startDate}
                  onChange={(e) => setWinSettings((w) => ({ ...w, startDate: e.target.value }))}
                />
                <p className="text-xs text-gray-400 mt-1">Leave blank for no start restriction.</p>
              </div>
              <div>
                <label className="label text-xs">Closes On</label>
                <input
                  type="date"
                  className="input text-sm"
                  value={winSettings.endDate}
                  onChange={(e) => setWinSettings((w) => ({ ...w, endDate: e.target.value }))}
                />
                <p className="text-xs text-gray-400 mt-1">Leave blank for no end restriction.</p>
              </div>
              <div>
                <label className="label text-xs">Academic Year</label>
                <input
                  className="input text-sm"
                  value={winSettings.academicYear}
                  onChange={(e) => setWinSettings((w) => ({ ...w, academicYear: e.target.value }))}
                  placeholder="e.g. 2025/2026"
                />
                <p className="text-xs text-gray-400 mt-1">Shown in the hero section.</p>
              </div>
            </div>

            {/* Closed message */}
            <div>
              <label className="label text-xs">Message Shown When Closed</label>
              <input
                className="input text-sm"
                value={winSettings.closedMessage}
                onChange={(e) => setWinSettings((w) => ({ ...w, closedMessage: e.target.value }))}
                placeholder="Admissions are currently closed. Please check back later."
              />
            </div>
          </div>
        )}
      </div>

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
