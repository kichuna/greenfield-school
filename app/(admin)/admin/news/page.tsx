"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Plus, Edit, Trash2, Eye, Loader2, Image as ImageIcon, X, Upload, CheckCircle } from "lucide-react";

interface NewsItem {
  id: string;
  title: string;
  slug: string;
  status: string;
  publishedAt: string | null;
  coverImage: string | null;
  author: { name: string };
}

interface GalleryItem {
  id: string;
  title: string | null;
  fileUrl: string;
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("en-KE", { month: "short", day: "numeric", year: "numeric" });
}

export default function AdminNewsPage() {
  const [news,         setNews]         = useState<NewsItem[]>([]);
  const [loading,      setLoading]      = useState(true);
  const [deleting,     setDeleting]     = useState<string | null>(null);

  // Photo picker state
  const [pickerOpen,   setPickerOpen]   = useState(false);
  const [pickerTarget, setPickerTarget] = useState<string | null>(null); // news item id
  const [gallery,      setGallery]      = useState<GalleryItem[]>([]);
  const [galleryLoad,  setGalleryLoad]  = useState(false);
  const [uploading,    setUploading]    = useState(false);
  const [selected,     setSelected]     = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  async function loadNews() {
    setLoading(true);
    const res = await fetch("/api/news");
    const data = await res.json();
    setNews(Array.isArray(data) ? data : data.items ?? []);
    setLoading(false);
  }

  useEffect(() => { loadNews(); }, []);

  async function handleDelete(id: string, title: string) {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
    setDeleting(id);
    await fetch(`/api/news/${id}`, { method: "DELETE" });
    setNews((prev) => prev.filter((n) => n.id !== id));
    setDeleting(null);
  }

  async function openPicker(id: string) {
    setPickerTarget(id);
    setSelected(null);
    setPickerOpen(true);
    setGalleryLoad(true);
    const res = await fetch("/api/gallery");
    const data = await res.json();
    const items: GalleryItem[] = (data.items ?? data).map((i: any) => ({
      id: i.id, title: i.title, fileUrl: i.fileUrl,
    }));
    setGallery(items);
    setGalleryLoad(false);
  }

  async function uploadPhoto(file: File) {
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    fd.append("title", file.name.replace(/\.[^.]+$/, ""));
    const res = await fetch("/api/gallery", { method: "POST", body: fd });
    const item = await res.json();
    setGallery((prev) => [{ id: item.id, title: item.title, fileUrl: item.fileUrl }, ...prev]);
    setSelected(item.fileUrl);
    setUploading(false);
  }

  async function applyPhoto() {
    if (!pickerTarget || !selected) return;
    await fetch(`/api/news/${pickerTarget}`, {
      method:  "PATCH",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ coverImage: selected }),
    });
    setNews((prev) =>
      prev.map((n) => n.id === pickerTarget ? { ...n, coverImage: selected } : n)
    );
    setPickerOpen(false);
    setPickerTarget(null);
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-heading font-bold text-gray-900">News & Announcements</h1>
          <p className="text-gray-500 text-sm">{news.length} articles</p>
        </div>
        <Link href="/admin/news/new" className="btn-primary gap-2">
          <Plus className="w-4 h-4" /> New Article
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                {["Cover", "Title", "Author", "Status", "Published", ""].map((h) => (
                  <th key={h} className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-5 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr><td colSpan={6} className="text-center py-12 text-gray-400 text-sm"><Loader2 className="w-5 h-5 animate-spin mx-auto" /></td></tr>
              ) : news.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-12 text-gray-400 text-sm">No articles yet.</td></tr>
              ) : (
                news.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-5 py-3">
                      <button
                        onClick={() => openPicker(item.id)}
                        className="w-12 h-12 rounded-lg border-2 border-dashed border-gray-200 hover:border-school-blue overflow-hidden flex items-center justify-center shrink-0 group transition-colors"
                        title="Set cover image"
                      >
                        {item.coverImage ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={item.coverImage} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <ImageIcon className="w-5 h-5 text-gray-300 group-hover:text-school-blue" />
                        )}
                      </button>
                    </td>
                    <td className="px-5 py-4 font-medium max-w-xs truncate">{item.title}</td>
                    <td className="px-5 py-4 text-gray-500 text-xs">{item.author.name}</td>
                    <td className="px-5 py-4">
                      <span className={`badge text-xs px-2.5 py-1 ${
                        item.status === "PUBLISHED" ? "bg-green-50 text-green-700" :
                        item.status === "DRAFT"     ? "bg-gray-100 text-gray-600"  :
                                                      "bg-red-50 text-red-700"
                      }`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-gray-400 text-xs">
                      {item.publishedAt ? formatDate(item.publishedAt) : "—"}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1">
                        <Link href={`/news/${item.slug}`} target="_blank" className="text-gray-400 hover:text-school-blue p-1" title="Preview">
                          <Eye className="w-4 h-4" />
                        </Link>
                        <Link href={`/admin/news/${item.id}/edit`} className="text-gray-400 hover:text-school-blue p-1" title="Edit">
                          <Edit className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(item.id, item.title)}
                          disabled={deleting === item.id}
                          className="text-gray-400 hover:text-red-500 p-1 transition-colors disabled:opacity-50"
                          title="Delete"
                        >
                          {deleting === item.id
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
      </div>

      {/* Photo picker modal */}
      {pickerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="font-heading font-bold text-gray-900">Choose Cover Photo</h2>
              <button onClick={() => setPickerOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 border-b border-gray-100">
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(e) => {
                  const files = Array.from(e.target.files ?? []);
                  files.forEach((f) => uploadPhoto(f));
                  e.target.value = "";
                }}
              />
              <button
                onClick={() => fileRef.current?.click()}
                disabled={uploading}
                className="btn-outline text-sm gap-2 w-full justify-center"
              >
                {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                {uploading ? "Uploading…" : "Upload New Photos"}
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              {galleryLoad ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
                </div>
              ) : gallery.length === 0 ? (
                <p className="text-center text-gray-400 text-sm py-8">No photos uploaded yet. Upload one above.</p>
              ) : (
                <div className="grid grid-cols-4 gap-3">
                  {gallery.map((img) => (
                    <button
                      key={img.id}
                      onClick={() => setSelected(img.fileUrl)}
                      className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                        selected === img.fileUrl ? "border-school-blue ring-2 ring-school-blue/30" : "border-transparent hover:border-gray-300"
                      }`}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={img.fileUrl} alt={img.title ?? ""} className="w-full h-full object-cover" />
                      {selected === img.fileUrl && (
                        <div className="absolute inset-0 bg-school-blue/20 flex items-center justify-center">
                          <CheckCircle className="w-6 h-6 text-school-blue" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-3">
              <button onClick={() => setPickerOpen(false)} className="btn-outline text-sm py-2">Cancel</button>
              <button
                onClick={applyPhoto}
                disabled={!selected}
                className="btn-primary text-sm py-2 disabled:opacity-50"
              >
                Set as Cover
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
