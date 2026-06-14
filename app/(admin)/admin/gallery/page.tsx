"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Trash2, Loader2, Image as ImageIcon, Upload, X, FolderPlus, CheckCircle2, AlertCircle } from "lucide-react";

type GalleryItem = {
  id: string;
  title: string;
  url: string;
  thumbnailUrl: string | null;
  albumId: string | null;
};

type Album = {
  id: string;
  title: string;
  _count: { items: number };
};

type FileEntry = {
  file: File;
  preview: string;
  title: string;
  status: "pending" | "uploading" | "done" | "error";
  error?: string;
};

export default function AdminGalleryPage() {
  const [items,   setItems]   = useState<GalleryItem[]>([]);
  const [albums,  setAlbums]  = useState<Album[]>([]);
  const [loading, setLoading] = useState(true);

  const [showUpload,   setShowUpload]   = useState(false);
  const [showNewAlbum, setShowNewAlbum] = useState(false);
  const [selectedAlbum, setSelectedAlbum] = useState("");
  const [files,        setFiles]        = useState<FileEntry[]>([]);
  const [uploading,    setUploading]    = useState(false);
  const [newAlbumName, setNewAlbumName] = useState("");
  const [dragOver,     setDragOver]     = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  async function load() {
    setLoading(true);
    try {
      const res  = await fetch("/api/gallery");
      const data = await res.json();
      setItems(data.items ?? []);
      setAlbums(data.albums ?? []);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  function addFiles(incoming: FileList | null) {
    if (!incoming) return;
    const allowed = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    const entries: FileEntry[] = [];

    Array.from(incoming).forEach((file) => {
      if (!allowed.includes(file.type)) return;
      const preview = URL.createObjectURL(file);
      const title   = file.name.replace(/\.[^.]+$/, "").replace(/[-_]/g, " ");
      entries.push({ file, preview, title, status: "pending" });
    });

    setFiles((prev) => [...prev, ...entries]);
  }

  function removeFile(idx: number) {
    setFiles((prev) => {
      URL.revokeObjectURL(prev[idx].preview);
      return prev.filter((_, i) => i !== idx);
    });
  }

  function updateTitle(idx: number, title: string) {
    setFiles((prev) => prev.map((f, i) => i === idx ? { ...f, title } : f));
  }

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    addFiles(e.dataTransfer.files);
  }, []);

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault();
    if (files.length === 0) return;
    setUploading(true);

    for (let i = 0; i < files.length; i++) {
      const entry = files[i];
      if (entry.status === "done") continue;

      setFiles((prev) => prev.map((f, idx) => idx === i ? { ...f, status: "uploading" } : f));

      try {
        const fd = new FormData();
        fd.append("file",  entry.file);
        fd.append("title", entry.title || entry.file.name);
        if (selectedAlbum) fd.append("albumId", selectedAlbum);

        const res = await fetch("/api/gallery", { method: "POST", body: fd });
        if (!res.ok) {
          const d = await res.json();
          throw new Error(d.error ?? "Upload failed");
        }
        setFiles((prev) => prev.map((f, idx) => idx === i ? { ...f, status: "done" } : f));
      } catch (err: any) {
        setFiles((prev) => prev.map((f, idx) => idx === i ? { ...f, status: "error", error: err.message } : f));
      }
    }

    setUploading(false);
    load();
  }

  function closeUpload() {
    files.forEach((f) => URL.revokeObjectURL(f.preview));
    setFiles([]);
    setSelectedAlbum("");
    setShowUpload(false);
  }

  async function createAlbum(e: React.FormEvent) {
    e.preventDefault();
    if (!newAlbumName.trim()) return;
    const res = await fetch("/api/gallery/albums", {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ title: newAlbumName }),
    });
    if (res.ok) { setNewAlbumName(""); setShowNewAlbum(false); load(); }
  }

  async function deleteItem(id: string) {
    if (!confirm("Delete this photo?")) return;
    await fetch(`/api/gallery/${id}`, { method: "DELETE" });
    load();
  }

  const allDone = files.length > 0 && files.every((f) => f.status === "done");

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-heading font-bold text-gray-900">Gallery</h1>
        <div className="flex gap-3">
          <button onClick={() => setShowNewAlbum(true)} className="btn-outline text-sm py-2">
            <FolderPlus className="w-4 h-4" /> New Album
          </button>
          <button onClick={() => setShowUpload(true)} className="btn-primary text-sm py-2">
            <Upload className="w-4 h-4" /> Upload Photos
          </button>
        </div>
      </div>

      {/* ── Upload modal ── */}
      {showUpload && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-900">Upload Photos</h2>
              <button onClick={closeUpload} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpload} className="flex flex-col flex-1 overflow-hidden">
              <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">

                {/* Drop zone */}
                <div
                  className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${dragOver ? "border-school-blue bg-blue-50" : "border-gray-200 hover:border-school-blue"}`}
                  onClick={() => fileRef.current?.click()}
                  onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={onDrop}
                >
                  <ImageIcon className="w-10 h-10 mx-auto text-gray-300 mb-2" />
                  <p className="text-sm font-medium text-gray-600">
                    Drag & drop photos here, or <span className="text-school-blue underline">browse</span>
                  </p>
                  <p className="text-xs text-gray-400 mt-1">Select multiple files — JPEG, PNG, WebP, GIF — max 5MB each</p>
                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={(e) => addFiles(e.target.files)}
                  />
                </div>

                {/* File list */}
                {files.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      {files.length} file{files.length !== 1 ? "s" : ""} selected
                    </p>
                    {files.map((entry, idx) => (
                      <div key={idx} className="flex items-center gap-3 bg-gray-50 rounded-xl p-3">
                        <img
                          src={entry.preview}
                          alt={entry.title}
                          className="w-12 h-12 object-cover rounded-lg shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <input
                            className="input text-sm py-1.5"
                            value={entry.title}
                            onChange={(e) => updateTitle(idx, e.target.value)}
                            placeholder="Photo title"
                            disabled={entry.status === "uploading" || entry.status === "done"}
                          />
                          {entry.error && (
                            <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                              <AlertCircle className="w-3 h-3" /> {entry.error}
                            </p>
                          )}
                        </div>
                        <div className="shrink-0">
                          {entry.status === "uploading" && <Loader2 className="w-5 h-5 animate-spin text-school-blue" />}
                          {entry.status === "done"      && <CheckCircle2 className="w-5 h-5 text-green-500" />}
                          {entry.status === "error"     && <AlertCircle  className="w-5 h-5 text-red-500" />}
                          {entry.status === "pending"   && (
                            <button type="button" onClick={() => removeFile(idx)}
                              className="w-7 h-7 flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors">
                              <X className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Album picker */}
                <div>
                  <label className="label">Add to Album (optional)</label>
                  <select className="input" value={selectedAlbum}
                    onChange={(e) => setSelectedAlbum(e.target.value)}>
                    <option value="">— No album —</option>
                    {albums.map((a) => (
                      <option key={a.id} value={a.id}>{a.title}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Footer */}
              <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
                <p className="text-xs text-gray-400">
                  {files.filter((f) => f.status === "done").length}/{files.length} uploaded
                </p>
                <div className="flex gap-3">
                  <button type="button" onClick={closeUpload} className="btn-outline text-sm py-2">
                    {allDone ? "Close" : "Cancel"}
                  </button>
                  {!allDone && (
                    <button type="submit" disabled={files.length === 0 || uploading} className="btn-primary text-sm py-2">
                      {uploading
                        ? <><Loader2 className="w-4 h-4 animate-spin" /> Uploading…</>
                        : <><Upload className="w-4 h-4" /> Upload {files.length > 0 ? `${files.length} Photo${files.length > 1 ? "s" : ""}` : ""}</>
                      }
                    </button>
                  )}
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── New album modal ── */}
      {showNewAlbum && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-5">New Album</h2>
            <form onSubmit={createAlbum} className="space-y-4">
              <div>
                <label className="label">Album Name *</label>
                <input className="input" required value={newAlbumName}
                  onChange={(e) => setNewAlbumName(e.target.value)}
                  placeholder="e.g. Sports Day 2025" />
              </div>
              <div className="flex justify-end gap-3">
                <button type="button" onClick={() => setShowNewAlbum(false)} className="btn-outline text-sm py-2">Cancel</button>
                <button type="submit" className="btn-primary text-sm py-2">
                  <FolderPlus className="w-4 h-4" /> Create Album
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Gallery grid ── */}
      {loading ? (
        <div className="flex items-center justify-center py-24">
          <Loader2 className="w-6 h-6 animate-spin text-school-blue" />
        </div>
      ) : (
        <>
          {albums.length > 0 && (
            <section className="mb-10">
              <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">Albums</h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {albums.map((album) => (
                  <div key={album.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center shrink-0">
                      <ImageIcon className="w-5 h-5 text-school-blue" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-gray-900 truncate">{album.title}</p>
                      <p className="text-xs text-gray-400">{album._count.items} photo{album._count.items !== 1 ? "s" : ""}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          <section>
            <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
              All Photos ({items.length})
            </h2>
            {items.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-xl border border-gray-100 text-gray-400">
                <ImageIcon className="w-12 h-12 mx-auto mb-3 opacity-25" />
                <p className="font-medium">No photos yet.</p>
                <p className="text-sm mt-1">Click "Upload Photos" to get started.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {items.map((item) => (
                  <div key={item.id} className="group relative aspect-square rounded-xl overflow-hidden bg-gray-100 shadow-sm">
                    <img src={item.thumbnailUrl ?? item.url} alt={item.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-end">
                      <div className="w-full p-2 translate-y-full group-hover:translate-y-0 transition-transform">
                        <p className="text-white text-xs font-medium truncate">{item.title}</p>
                      </div>
                    </div>
                    <button onClick={() => deleteItem(item.id)}
                      className="absolute top-2 right-2 w-7 h-7 bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-700">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
}
