"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, Loader2 } from "lucide-react";

export default function EditNewsPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [saving,  setSaving]  = useState(false);
  const [error,   setError]   = useState("");
  const [form, setForm] = useState({
    title:      "",
    excerpt:    "",
    content:    "",
    status:     "DRAFT" as "DRAFT" | "PUBLISHED",
    coverImage: "",
  });

  useEffect(() => {
    fetch(`/api/news/${params.id}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.error) { setError(data.error); return; }
        setForm({
          title:      data.title      ?? "",
          excerpt:    data.excerpt    ?? "",
          content:    data.content    ?? "",
          status:     data.status     ?? "DRAFT",
          coverImage: data.coverImage ?? "",
        });
      })
      .catch(() => setError("Could not load article."))
      .finally(() => setLoading(false));
  }, [params.id]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const res = await fetch(`/api/news/${params.id}`, {
        method:  "PATCH",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Failed to save");
      }

      router.push("/admin/news");
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-6 h-6 animate-spin text-school-blue" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/news" className="btn-outline text-sm py-2">
          <ArrowLeft className="w-4 h-4" />
          Back
        </Link>
        <h1 className="text-2xl font-heading font-bold text-gray-900">Edit Article</h1>
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
              <option value="DRAFT">Draft</option>
              <option value="PUBLISHED">Published</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Link href="/admin/news" className="btn-outline text-sm py-2.5">Cancel</Link>
          <button type="submit" disabled={saving} className="btn-primary text-sm py-2.5">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {saving ? "Saving…" : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
