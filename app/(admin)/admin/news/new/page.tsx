"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, Eye, Loader2 } from "lucide-react";

export default function NewNewsPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error,  setError]  = useState("");
  const [form, setForm] = useState({
    title:     "",
    excerpt:   "",
    content:   "",
    status:    "DRAFT" as "DRAFT" | "PUBLISHED",
    coverImage:"",
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const res = await fetch("/api/news", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Failed to save article");
      }

      router.push("/admin/news");
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-3xl">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/news" className="btn-outline text-sm py-2">
          <ArrowLeft className="w-4 h-4" />
          Back
        </Link>
        <h1 className="text-2xl font-heading font-bold text-gray-900">New Article</h1>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-5">
          <div>
            <label className="label" htmlFor="title">Title *</label>
            <input
              id="title"
              name="title"
              value={form.title}
              onChange={handleChange}
              required
              placeholder="Article headline"
              className="input"
            />
          </div>

          <div>
            <label className="label" htmlFor="excerpt">Excerpt</label>
            <textarea
              id="excerpt"
              name="excerpt"
              value={form.excerpt}
              onChange={handleChange}
              rows={2}
              placeholder="Short summary shown in news listings..."
              className="input resize-none"
            />
          </div>

          <div>
            <label className="label" htmlFor="content">Content *</label>
            <textarea
              id="content"
              name="content"
              value={form.content}
              onChange={handleChange}
              required
              rows={12}
              placeholder="Write the full article here..."
              className="input resize-y"
            />
          </div>

          <div>
            <label className="label" htmlFor="coverImage">Cover Image URL</label>
            <input
              id="coverImage"
              name="coverImage"
              type="url"
              value={form.coverImage}
              onChange={handleChange}
              placeholder="https://..."
              className="input"
            />
          </div>

          <div>
            <label className="label" htmlFor="status">Publish Status</label>
            <select
              id="status"
              name="status"
              value={form.status}
              onChange={handleChange}
              className="input"
            >
              <option value="DRAFT">Draft — not visible to public</option>
              <option value="PUBLISHED">Published — live on website</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Link href="/admin/news" className="btn-outline text-sm py-2.5">
            Cancel
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="btn-primary text-sm py-2.5"
          >
            {saving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            {saving ? "Saving…" : "Save Article"}
          </button>
        </div>
      </form>
    </div>
  );
}
