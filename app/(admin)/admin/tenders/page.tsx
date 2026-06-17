"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, Pencil, Trash2, Loader2, Eye, EyeOff, FileText, X, Save } from "lucide-react";

type Tender = {
  id:              string;
  title:           string;
  description:     string;
  referenceNumber: string;
  category:        string;
  openDate:        string;
  closingDate:     string;
  documentUrl:     string | null;
  isPublished:     boolean;
  createdBy:       { name: string };
};

const CATEGORIES = ["GOODS", "SERVICES", "WORKS", "CONSULTANCY", "OTHER"] as const;

const catColors: Record<string, string> = {
  GOODS:       "bg-blue-50 text-blue-700",
  SERVICES:    "bg-purple-50 text-purple-700",
  WORKS:       "bg-amber-50 text-amber-700",
  CONSULTANCY: "bg-green-50 text-green-700",
  OTHER:       "bg-gray-100 text-gray-700",
};

function tenderStatus(openDate: string, closingDate: string) {
  const now  = Date.now();
  const open = new Date(openDate).getTime();
  const close = new Date(closingDate).getTime();
  if (now < open)   return { label: "Upcoming", cls: "bg-blue-50 text-blue-700"   };
  if (now > close)  return { label: "Closed",   cls: "bg-gray-100 text-gray-600"  };
  return               { label: "Open",     cls: "bg-green-50 text-green-700" };
}

function fmtDate(d: string) {
  return new Date(d).toLocaleDateString("en-KE", { day: "numeric", month: "short", year: "numeric" });
}

const BLANK = {
  title: "", description: "", category: "GOODS" as typeof CATEGORIES[number],
  openDate: "", closingDate: "", documentUrl: "", isPublished: false,
};

export default function AdminTendersPage() {
  const [tenders,   setTenders]   = useState<Tender[]>([]);
  const [loading,   setLoading]   = useState(true);
  const [showForm,  setShowForm]  = useState(false);
  const [saving,    setSaving]    = useState(false);
  const [deleting,  setDeleting]  = useState<string | null>(null);
  const [editId,    setEditId]    = useState<string | null>(null);
  const [error,     setError]     = useState("");
  const [form,      setForm]      = useState({ ...BLANK });

  const load = useCallback(async () => {
    setLoading(true);
    const res  = await fetch("/api/tenders?all=true");
    const data = await res.json();
    setTenders(Array.isArray(data) ? data : []);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  function openNew() {
    setEditId(null);
    setForm({ ...BLANK });
    setError("");
    setShowForm(true);
  }

  function openEdit(t: Tender) {
    setEditId(t.id);
    setForm({
      title:       t.title,
      description: t.description,
      category:    t.category as typeof CATEGORIES[number],
      openDate:    t.openDate.slice(0, 10),
      closingDate: t.closingDate.slice(0, 10),
      documentUrl: t.documentUrl ?? "",
      isPublished: t.isPublished,
    });
    setError("");
    setShowForm(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const url    = editId ? `/api/tenders/${editId}` : "/api/tenders";
      const method = editId ? "PATCH" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, documentUrl: form.documentUrl || undefined }),
      });
      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.error ?? "Failed to save");
      }
      setShowForm(false);
      load();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string, title: string) {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
    setDeleting(id);
    await fetch(`/api/tenders/${id}`, { method: "DELETE" });
    setTenders((prev) => prev.filter((t) => t.id !== id));
    setDeleting(null);
  }

  async function togglePublish(t: Tender) {
    await fetch(`/api/tenders/${t.id}`, {
      method:  "PATCH",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ isPublished: !t.isPublished }),
    });
    load();
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-heading font-bold text-gray-900">Tenders</h1>
          <p className="text-sm text-gray-500 mt-1">{tenders.length} tender{tenders.length !== 1 ? "s" : ""} total</p>
        </div>
        <button onClick={openNew} className="btn-primary text-sm py-2">
          <Plus className="w-4 h-4" /> New Tender
        </button>
      </div>

      {/* Form modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-gray-900">{editId ? "Edit Tender" : "New Tender"}</h2>
              <button type="button" onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {error && (
              <div className="mb-4 bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-2.5 text-sm">{error}</div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="label">Title *</label>
                <input className="input" required value={form.title}
                  onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                  placeholder="e.g. Supply of Laboratory Equipment" />
              </div>

              <div>
                <label className="label">Description *</label>
                <textarea className="input resize-none" rows={3} required value={form.description}
                  onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                  placeholder="Scope, requirements, and eligibility..." />
              </div>

              <div>
                <label className="label">Category</label>
                <select className="input" value={form.category}
                  onChange={(e) => setForm((p) => ({ ...p, category: e.target.value as any }))}>
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c.charAt(0) + c.slice(1).toLowerCase()}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Opening Date *</label>
                  <input type="date" className="input" required value={form.openDate}
                    onChange={(e) => setForm((p) => ({ ...p, openDate: e.target.value }))} />
                </div>
                <div>
                  <label className="label">Closing Date *</label>
                  <input type="date" className="input" required value={form.closingDate}
                    onChange={(e) => setForm((p) => ({ ...p, closingDate: e.target.value }))} />
                </div>
              </div>

              <div>
                <label className="label">Tender Document URL</label>
                <input type="url" className="input" value={form.documentUrl}
                  onChange={(e) => setForm((p) => ({ ...p, documentUrl: e.target.value }))}
                  placeholder="https://..." />
                <p className="text-xs text-gray-400 mt-1">Link to PDF or document on Cloudinary/Drive.</p>
              </div>

              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.isPublished}
                  onChange={(e) => setForm((p) => ({ ...p, isPublished: e.target.checked }))}
                  className="w-4 h-4 text-school-blue rounded" />
                <span className="text-sm font-medium text-gray-700">Publish immediately</span>
              </label>

              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowForm(false)} className="btn-outline text-sm py-2">Cancel</button>
                <button type="submit" disabled={saving} className="btn-primary text-sm py-2">
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  {saving ? "Saving…" : editId ? "Save Changes" : "Create Tender"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-6 h-6 animate-spin text-school-blue" />
          </div>
        ) : tenders.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <FileText className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p className="font-medium">No tenders yet.</p>
            <p className="text-sm mt-1">Click "New Tender" to add one.</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                {["Reference", "Title", "Category", "Opens", "Closes", "Status", "Visibility", ""].map((h) => (
                  <th key={h} className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-5 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {tenders.map((t) => {
                const status = tenderStatus(t.openDate, t.closingDate);
                return (
                  <tr key={t.id} className="hover:bg-gray-50">
                    <td className="px-5 py-4 font-mono text-xs text-gray-500">{t.referenceNumber}</td>
                    <td className="px-5 py-4 font-medium text-gray-900 max-w-[200px] truncate">{t.title}</td>
                    <td className="px-5 py-4">
                      <span className={`badge text-xs px-2.5 py-1 ${catColors[t.category] ?? "bg-gray-100 text-gray-600"}`}>
                        {t.category}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-gray-500 text-xs whitespace-nowrap">{fmtDate(t.openDate)}</td>
                    <td className="px-5 py-4 text-gray-500 text-xs whitespace-nowrap">{fmtDate(t.closingDate)}</td>
                    <td className="px-5 py-4">
                      <span className={`badge text-xs px-2.5 py-1 ${status.cls}`}>{status.label}</span>
                    </td>
                    <td className="px-5 py-4">
                      <button onClick={() => togglePublish(t)}
                        className={`badge text-xs px-2.5 py-1 flex items-center gap-1 cursor-pointer ${t.isPublished ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                        {t.isPublished ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                        {t.isPublished ? "Published" : "Draft"}
                      </button>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1 justify-end">
                        <button onClick={() => openEdit(t)}
                          className="p-1.5 text-gray-400 hover:text-school-blue hover:bg-blue-50 rounded-md transition-colors">
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(t.id, t.title)} disabled={deleting === t.id}
                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors disabled:opacity-50">
                          {deleting === t.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
