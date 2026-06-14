"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, Pencil, Trash2, Loader2, Calendar, MapPin, Eye, EyeOff } from "lucide-react";

type Event = {
  id: string;
  title: string;
  location: string | null;
  startDate: string;
  endDate: string | null;
  category: string;
  isPublished: boolean;
  createdBy: { name: string };
};

const CATEGORIES = ["ACADEMIC", "SPORTS", "CULTURAL", "ALUMNI", "GENERAL"] as const;

const catColors: Record<string, string> = {
  ACADEMIC: "bg-blue-50 text-blue-700",
  SPORTS:   "bg-green-50 text-green-700",
  CULTURAL: "bg-purple-50 text-purple-700",
  ALUMNI:   "bg-amber-50 text-amber-700",
  GENERAL:  "bg-gray-100 text-gray-700",
};

export default function AdminEventsPage() {
  const [events,  setEvents]  = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving,   setSaving]   = useState(false);
  const [error,    setError]    = useState("");
  const [editId,   setEditId]   = useState<string | null>(null);

  const [form, setForm] = useState({
    title:       "",
    description: "",
    location:    "",
    startDate:   "",
    endDate:     "",
    category:    "GENERAL" as typeof CATEGORIES[number],
    isPublished: false,
  });

  async function load() {
    setLoading(true);
    try {
      const res = await fetch("/api/events?all=true");
      const data = await res.json();
      setEvents(data);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  function openNew() {
    setEditId(null);
    setForm({ title: "", description: "", location: "", startDate: "", endDate: "", category: "GENERAL", isPublished: false });
    setError("");
    setShowForm(true);
  }

  function openEdit(ev: Event) {
    setEditId(ev.id);
    setForm({
      title:       ev.title,
      description: "",
      location:    ev.location ?? "",
      startDate:   ev.startDate.slice(0, 16),
      endDate:     ev.endDate ? ev.endDate.slice(0, 16) : "",
      category:    ev.category as typeof CATEGORIES[number],
      isPublished: ev.isPublished,
    });
    setError("");
    setShowForm(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const payload = {
        ...form,
        endDate: form.endDate || undefined,
        location: form.location || undefined,
      };

      const url    = editId ? `/api/events/${editId}` : "/api/events";
      const method = editId ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(payload),
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

  async function handleDelete(id: string) {
    if (!confirm("Delete this event?")) return;
    await fetch(`/api/events/${id}`, { method: "DELETE" });
    load();
  }

  async function togglePublish(ev: Event) {
    await fetch(`/api/events/${ev.id}`, {
      method:  "PATCH",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ isPublished: !ev.isPublished }),
    });
    load();
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-heading font-bold text-gray-900">Events</h1>
        <button onClick={openNew} className="btn-primary text-sm py-2">
          <Plus className="w-4 h-4" /> New Event
        </button>
      </div>

      {/* Form modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-5">
              {editId ? "Edit Event" : "New Event"}
            </h2>

            {error && (
              <div className="mb-4 bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-2.5 text-sm">{error}</div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="label">Title *</label>
                <input className="input" required value={form.title}
                  onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} />
              </div>
              <div>
                <label className="label">Description *</label>
                <textarea className="input resize-none" rows={3} required value={form.description}
                  onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Start Date & Time *</label>
                  <input type="datetime-local" className="input" required value={form.startDate}
                    onChange={(e) => setForm((p) => ({ ...p, startDate: e.target.value }))} />
                </div>
                <div>
                  <label className="label">End Date & Time</label>
                  <input type="datetime-local" className="input" value={form.endDate}
                    onChange={(e) => setForm((p) => ({ ...p, endDate: e.target.value }))} />
                </div>
              </div>
              <div>
                <label className="label">Location</label>
                <input className="input" placeholder="e.g. Main Hall" value={form.location}
                  onChange={(e) => setForm((p) => ({ ...p, location: e.target.value }))} />
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
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.isPublished}
                  onChange={(e) => setForm((p) => ({ ...p, isPublished: e.target.checked }))}
                  className="w-4 h-4 text-school-blue rounded" />
                <span className="text-sm font-medium text-gray-700">Publish immediately</span>
              </label>

              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowForm(false)} className="btn-outline text-sm py-2">
                  Cancel
                </button>
                <button type="submit" disabled={saving} className="btn-primary text-sm py-2">
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                  {saving ? "Saving…" : editId ? "Save Changes" : "Create Event"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Events list */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-6 h-6 animate-spin text-school-blue" />
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <Calendar className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p className="font-medium">No events yet.</p>
            <p className="text-sm mt-1">Click "New Event" to add one.</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                {["Event", "Date", "Location", "Category", "Status", ""].map((h) => (
                  <th key={h} className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-5 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {events.map((ev) => (
                <tr key={ev.id} className="hover:bg-gray-50">
                  <td className="px-5 py-4 font-medium text-gray-900 max-w-xs truncate">{ev.title}</td>
                  <td className="px-5 py-4 text-gray-500 whitespace-nowrap">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" />
                      {new Date(ev.startDate).toLocaleDateString("en-KE", { day: "numeric", month: "short", year: "numeric" })}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-gray-500">
                    {ev.location ? (
                      <span className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 shrink-0" />
                        <span className="truncate max-w-[120px]">{ev.location}</span>
                      </span>
                    ) : (
                      <span className="text-gray-300">—</span>
                    )}
                  </td>
                  <td className="px-5 py-4">
                    <span className={`badge ${catColors[ev.category]} text-xs px-2.5 py-1`}>
                      {ev.category}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <button onClick={() => togglePublish(ev)}
                      className={`badge text-xs px-2.5 py-1 cursor-pointer flex items-center gap-1 ${ev.isPublished ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                      {ev.isPublished ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                      {ev.isPublished ? "Published" : "Draft"}
                    </button>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2 justify-end">
                      <button onClick={() => openEdit(ev)}
                        className="p-1.5 text-gray-400 hover:text-school-blue hover:bg-blue-50 rounded-md transition-colors">
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(ev.id)}
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
