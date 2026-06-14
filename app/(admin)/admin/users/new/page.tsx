"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, Loader2, Eye, EyeOff } from "lucide-react";

const ROLES = ["ADMIN", "STAFF", "STUDENT", "PARENT", "ALUMNI"] as const;

export default function NewUserPage() {
  const router = useRouter();
  const [saving,   setSaving]   = useState(false);
  const [error,    setError]    = useState("");
  const [showPass, setShowPass] = useState(false);
  const [form, setForm] = useState({
    name:     "",
    email:    "",
    password: "",
    role:     "STAFF" as typeof ROLES[number],
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const res = await fetch("/api/users", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Failed to create user");
      }

      router.push("/admin/users");
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-xl">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/users" className="btn-outline text-sm py-2">
          <ArrowLeft className="w-4 h-4" />
          Back
        </Link>
        <h1 className="text-2xl font-heading font-bold text-gray-900">New User</h1>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-5">
          <div>
            <label className="label" htmlFor="name">Full Name *</label>
            <input
              id="name"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              placeholder="e.g. Jane Doe"
              className="input"
            />
          </div>

          <div>
            <label className="label" htmlFor="email">Email Address *</label>
            <input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              required
              placeholder="jane@greenfieldhs.ac"
              className="input"
            />
          </div>

          <div>
            <label className="label" htmlFor="password">Password *</label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPass ? "text" : "password"}
                value={form.password}
                onChange={handleChange}
                required
                minLength={8}
                placeholder="Min. 8 characters"
                className="input pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPass((v) => !v)}
                className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-600"
              >
                {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div>
            <label className="label" htmlFor="role">Role *</label>
            <select
              id="role"
              name="role"
              value={form.role}
              onChange={handleChange}
              className="input"
            >
              {ROLES.map((r) => (
                <option key={r} value={r}>{r.charAt(0) + r.slice(1).toLowerCase()}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Link href="/admin/users" className="btn-outline text-sm py-2.5">Cancel</Link>
          <button type="submit" disabled={saving} className="btn-primary text-sm py-2.5">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {saving ? "Creating…" : "Create User"}
          </button>
        </div>
      </form>
    </div>
  );
}
