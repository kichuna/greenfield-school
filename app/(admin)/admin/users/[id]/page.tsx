"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, Loader2, Eye, EyeOff, Trash2 } from "lucide-react";

const ROLES = ["SUPER_ADMIN", "ADMIN", "STAFF", "STUDENT", "PARENT", "ALUMNI"] as const;

export default function EditUserPage() {
  const router  = useRouter();
  const params  = useParams<{ id: string }>();
  const [loading,  setLoading]  = useState(true);
  const [saving,   setSaving]   = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error,    setError]    = useState("");
  const [showPass, setShowPass] = useState(false);
  const [form, setForm] = useState({
    name:     "",
    email:    "",
    role:     "STAFF" as typeof ROLES[number],
    isActive: true,
    password: "",
  });

  useEffect(() => {
    fetch(`/api/users/${params.id}`)
      .then((r) => r.json())
      .then((data) => {
        setForm((prev) => ({
          ...prev,
          name:     data.name ?? "",
          email:    data.email ?? "",
          role:     data.role ?? "STAFF",
          isActive: data.isActive ?? true,
        }));
        setLoading(false);
      })
      .catch(() => { setError("Failed to load user."); setLoading(false); });
  }, [params.id]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const body: any = { name: form.name, role: form.role, isActive: form.isActive };
      if (form.password) body.password = form.password;

      const res = await fetch(`/api/users/${params.id}`, {
        method:  "PATCH",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(body),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Failed to update user");
      }
      router.push("/admin/users");
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!confirm("Delete this user permanently?")) return;
    setDeleting(true);
    await fetch(`/api/users/${params.id}`, { method: "DELETE" });
    router.push("/admin/users");
    router.refresh();
  }

  if (loading) return <div className="text-gray-400 text-sm p-8">Loading…</div>;

  return (
    <div className="max-w-xl">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/users" className="btn-outline text-sm py-2">
          <ArrowLeft className="w-4 h-4" /> Back
        </Link>
        <h1 className="text-2xl font-heading font-bold text-gray-900">Edit User</h1>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-5">
          <div>
            <label className="label" htmlFor="name">Full Name</label>
            <input id="name" name="name" value={form.name} onChange={handleChange} required className="input" />
          </div>

          <div>
            <label className="label" htmlFor="email">Email Address</label>
            <input id="email" name="email" value={form.email} disabled className="input bg-gray-50 text-gray-400 cursor-not-allowed" />
            <p className="text-xs text-gray-400 mt-1">Email cannot be changed.</p>
          </div>

          <div>
            <label className="label" htmlFor="role">Role</label>
            <select id="role" name="role" value={form.role} onChange={handleChange} className="input">
              {ROLES.map((r) => (
                <option key={r} value={r}>{r.replace("_", " ")}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="label" htmlFor="password">New Password <span className="text-gray-400 font-normal">(leave blank to keep current)</span></label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPass ? "text" : "password"}
                value={form.password}
                onChange={handleChange}
                minLength={8}
                placeholder="Min. 8 characters"
                className="input pr-10"
              />
              <button type="button" onClick={() => setShowPass((v) => !v)} className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-600">
                {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <input
              id="isActive"
              name="isActive"
              type="checkbox"
              checked={form.isActive}
              onChange={handleChange}
              className="w-4 h-4 accent-school-blue"
            />
            <label htmlFor="isActive" className="text-sm text-gray-700 font-medium">Account Active</label>
          </div>
        </div>

        <div className="flex items-center justify-between gap-3">
          <button type="button" onClick={handleDelete} disabled={deleting} className="btn-outline text-red-600 border-red-200 hover:bg-red-50 text-sm py-2.5 gap-2">
            <Trash2 className="w-4 h-4" />
            {deleting ? "Deleting…" : "Delete User"}
          </button>
          <div className="flex gap-3">
            <Link href="/admin/users" className="btn-outline text-sm py-2.5">Cancel</Link>
            <button type="submit" disabled={saving} className="btn-primary text-sm py-2.5">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {saving ? "Saving…" : "Save Changes"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
