"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, Loader2 } from "lucide-react";

const CATEGORIES = ["ACADEMIC", "SPORTS", "CULTURAL", "ALUMNI", "GENERAL"] as const;

export default function NewEventPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error,  setError]  = useState("");

  const [form, setForm] = useState({
    title:       "",
    description: "",
    location:    "",
    startDate:   "",
    endDate:     "",
    category:    "GENERAL" as typeof CATEGORIES[number],
    isPublished: false,
  });

  function set(field: string, value: string | boolean) {
    setForm((p) => ({ ...p, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const res = await fetch("/api/events", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          endDate:  form.endDate  || undefined,
          location: form.location || undefined,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Failed to create event");
      }

      router.push("/admin/events");
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-2xl">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/events" className="btn-outline text-sm py-2">
          <ArrowLeft className="w-4 h-4" /> Back
        </Link>
        <h1 className="text-2xl font-heading font-bold text-gray-900">New Event</h1>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-5">
          <div>
            <label className="label">Title *</label>
            <input
              className="input"
              required
              value={form.title}
              onChange={(e) => set("title", e.target.value)}
              placeholder="e.g. Annual Sports Day 2025"
            />
          </div>

          <div>
            <label className="label">Description *</label>
            <textarea
              className="input resize-none"
              rows={4}
              required
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              placeholder="Describe the event…"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Start Date & Time *</label>
              <input
                type="datetime-local"
                className="input"
                required
                value={form.startDate}
                onChange={(e) => set("startDate", e.target.value)}
              />
            </div>
            <div>
              <label className="label">End Date & Time</label>
              <input
                type="datetime-local"
                className="input"
                value={form.endDate}
                onChange={(e) => set("endDate", e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="label">Location</label>
            <input
              className="input"
              value={form.location}
              onChange={(e) => set("location", e.target.value)}
              placeholder="e.g. Main Hall"
            />
          </div>

          <div>
            <label className="label">Category</label>
            <select
              className="input"
              value={form.category}
              onChange={(e) => set("category", e.target.value)}
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c.charAt(0) + c.slice(1).toLowerCase()}
                </option>
              ))}
            </select>
          </div>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={form.isPublished}
              onChange={(e) => set("isPublished", e.target.checked)}
              className="w-4 h-4 text-school-blue rounded"
            />
            <span className="text-sm font-medium text-gray-700">Publish immediately</span>
          </label>
        </div>

        <div className="flex justify-end gap-3">
          <Link href="/admin/events" className="btn-outline text-sm py-2.5">
            Cancel
          </Link>
          <button type="submit" disabled={saving} className="btn-primary text-sm py-2.5">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {saving ? "Saving…" : "Create Event"}
          </button>
        </div>
      </form>
    </div>
  );
}
