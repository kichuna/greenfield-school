"use client";

import { useState, useEffect, useRef } from "react";
import { Upload, Trash2, Loader2, FileText, X, Eye, EyeOff, Download } from "lucide-react";

type Doc = {
  id: string;
  title: string;
  description: string | null;
  fileUrl: string;
  fileType: string;
  category: string;
  isPublished: boolean;
  downloads: number;
  createdAt: string;
};

const CATEGORIES = [
  { value: "ADMISSIONS",     label: "Admissions" },
  { value: "CURRICULUM",     label: "Curriculum" },
  { value: "EXAM_INFO",      label: "Exam Info" },
  { value: "CAREER_GUIDANCE",label: "Career Guidance" },
  { value: "GENERAL",        label: "General" },
];

const catColors: Record<string, string> = {
  ADMISSIONS:      "bg-blue-50 text-blue-700",
  CURRICULUM:      "bg-green-50 text-green-700",
  EXAM_INFO:       "bg-purple-50 text-purple-700",
  CAREER_GUIDANCE: "bg-amber-50 text-amber-700",
  GENERAL:         "bg-gray-100 text-gray-600",
};

function fileIcon(type: string) {
  if (type.includes("pdf"))   return "📄";
  if (type.includes("word"))  return "📝";
  if (type.includes("excel") || type.includes("sheet")) return "📊";
  if (type.includes("image")) return "🖼️";
  return "📁";
}


export default function AdminDocumentsPage() {
  const [docs,     setDocs]     = useState<Doc[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [uploading,setUploading]= useState(false);
  const [error,    setError]    = useState("");
  const [filter,   setFilter]   = useState("ALL");

  const [form, setForm] = useState({
    title:       "",
    description: "",
    category:    "ADMISSIONS",
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  async function load() {
    setLoading(true);
    try {
      const res  = await fetch("/api/documents?category=");
      const data = await res.json();
      setDocs(Array.isArray(data) ? data : []);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedFile(file);
    if (!form.title) {
      setForm((p) => ({ ...p, title: file.name.replace(/\.[^.]+$/, "").replace(/[-_]/g, " ") }));
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedFile) { setError("Please select a file."); return; }
    setUploading(true);
    setError("");

    try {
      const fd = new FormData();
      fd.append("file",        selectedFile);
      fd.append("title",       form.title);
      fd.append("description", form.description);
      fd.append("category",    form.category);

      const res = await fetch("/api/documents", { method: "POST", body: fd });
      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.error ?? "Upload failed");
      }

      setShowForm(false);
      setSelectedFile(null);
      setForm({ title: "", description: "", category: "ADMISSIONS" });
      if (fileRef.current) fileRef.current.value = "";
      load();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this document? This cannot be undone.")) return;
    await fetch(`/api/documents/${id}`, { method: "DELETE" });
    load();
  }

  async function togglePublish(doc: Doc) {
    await fetch(`/api/documents/${doc.id}`, {
      method:  "PATCH",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ isPublished: !doc.isPublished }),
    });
    load();
  }

  const filtered = filter === "ALL" ? docs : docs.filter((d) => d.category === filter);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-heading font-bold text-gray-900">Documents</h1>
          <p className="text-sm text-gray-500 mt-1">Fee structures, handbooks, forms, and other downloadable files.</p>
        </div>
        <button onClick={() => { setShowForm(true); setError(""); }} className="btn-primary text-sm py-2">
          <Upload className="w-4 h-4" /> Upload Document
        </button>
      </div>

      {/* Category filter */}
      <div className="flex flex-wrap gap-2 mb-6">
        {[{ value: "ALL", label: "All" }, ...CATEGORIES].map((c) => (
          <button
            key={c.value}
            onClick={() => setFilter(c.value)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
              filter === c.value
                ? "bg-school-blue text-white border-school-blue"
                : "bg-white text-gray-600 border-gray-200 hover:border-school-blue hover:text-school-blue"
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Upload modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-gray-900">Upload Document</h2>
              <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {error && (
              <div className="mb-4 bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-2.5 text-sm">{error}</div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* File picker */}
              <div
                className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center cursor-pointer hover:border-school-blue transition-colors"
                onClick={() => fileRef.current?.click()}
              >
                {selectedFile ? (
                  <div className="flex items-center justify-center gap-3">
                    <span className="text-2xl">{fileIcon(selectedFile.type)}</span>
                    <div className="text-left">
                      <p className="text-sm font-medium text-gray-800">{selectedFile.name}</p>
                      <p className="text-xs text-gray-400">{(selectedFile.size / 1024).toFixed(0)} KB</p>
                    </div>
                  </div>
                ) : (
                  <>
                    <FileText className="w-10 h-10 mx-auto text-gray-300 mb-2" />
                    <p className="text-sm text-gray-500">Click to select a file</p>
                    <p className="text-xs text-gray-400 mt-1">PDF, Word, Excel — max 10MB</p>
                  </>
                )}
                <input
                  ref={fileRef}
                  type="file"
                  className="hidden"
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
                  onChange={handleFileChange}
                />
              </div>

              <div>
                <label className="label">Document Title *</label>
                <input className="input" required value={form.title}
                  onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                  placeholder="e.g. Fee Structure 2025/2026" />
              </div>

              <div>
                <label className="label">Description</label>
                <textarea className="input resize-none" rows={2} value={form.description}
                  onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                  placeholder="Optional short description" />
              </div>

              <div>
                <label className="label">Category *</label>
                <select className="input" value={form.category}
                  onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))}>
                  {CATEGORIES.map((c) => (
                    <option key={c.value} value={c.value}>{c.label}</option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowForm(false)} className="btn-outline text-sm py-2">Cancel</button>
                <button type="submit" disabled={uploading} className="btn-primary text-sm py-2">
                  {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                  {uploading ? "Uploading…" : "Upload"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Document list */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-6 h-6 animate-spin text-school-blue" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <FileText className="w-10 h-10 mx-auto mb-3 opacity-25" />
            <p className="font-medium">No documents yet.</p>
            <p className="text-sm mt-1">Click "Upload Document" to add your first file.</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                {["Document", "Category", "Status", "Downloads", ""].map((h) => (
                  <th key={h} className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-5 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((doc) => (
                <tr key={doc.id} className="hover:bg-gray-50">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <span className="text-xl shrink-0">{fileIcon(doc.fileType)}</span>
                      <div>
                        <p className="font-medium text-gray-900">{doc.title}</p>
                        {doc.description && (
                          <p className="text-xs text-gray-400 truncate max-w-xs">{doc.description}</p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`badge ${catColors[doc.category]} text-xs px-2.5 py-1`}>
                      {CATEGORIES.find((c) => c.value === doc.category)?.label ?? doc.category}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <button onClick={() => togglePublish(doc)}
                      className={`badge text-xs px-2.5 py-1 flex items-center gap-1 cursor-pointer ${doc.isPublished ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                      {doc.isPublished ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                      {doc.isPublished ? "Published" : "Hidden"}
                    </button>
                  </td>
                  <td className="px-5 py-4 text-gray-500">
                    <span className="flex items-center gap-1.5">
                      <Download className="w-3.5 h-3.5" />
                      {doc.downloads}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2 justify-end">
                      <a href={`/api/documents/${doc.id}/download`}
                        className="p-1.5 text-gray-400 hover:text-school-blue hover:bg-blue-50 rounded-md transition-colors"
                        title="Download">
                        <Download className="w-4 h-4" />
                      </a>
                      <button onClick={() => handleDelete(doc.id)}
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
