"use client";

import { useState, useEffect } from "react";
import { Save, Loader2, CheckCircle2, School, Phone, Globe, Share2 } from "lucide-react";

type Settings = Record<string, string>;

const DEFAULTS: Settings = {
  school_name:       "Greenfield High School",
  school_tagline:    "Excellence in Education, Character, and Service",
  contact_email:     "",
  contact_phone:     "",
  contact_address:   "",
  facebook_url:      "",
  twitter_url:       "",
  instagram_url:     "",
  youtube_url:       "",
  hero_headline:     "",
  hero_description:  "",
};

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Settings>(DEFAULTS);
  const [loading,  setLoading]  = useState(true);
  const [saving,   setSaving]   = useState(false);
  const [saved,    setSaved]    = useState(false);
  const [error,    setError]    = useState("");

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((r) => r.json())
      .then((data: Settings) => {
        setSettings((prev) => ({ ...prev, ...data }));
      })
      .catch(() => setError("Failed to load settings."))
      .finally(() => setLoading(false));
  }, []);

  function set(key: string, value: string) {
    setSettings((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSaved(false);
    try {
      const res = await fetch("/api/admin/settings", {
        method:  "PUT",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(settings),
      });
      if (!res.ok) throw new Error("Save failed");
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      setError("Failed to save settings. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="w-6 h-6 animate-spin text-school-blue" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-heading font-bold text-gray-900">Settings</h1>
          <p className="text-sm text-gray-500 mt-1">Configure site-wide information and appearance.</p>
        </div>
        <button
          form="settings-form"
          type="submit"
          disabled={saving}
          className="btn-primary text-sm py-2"
        >
          {saving ? (
            <><Loader2 className="w-4 h-4 animate-spin" /> Saving…</>
          ) : saved ? (
            <><CheckCircle2 className="w-4 h-4" /> Saved!</>
          ) : (
            <><Save className="w-4 h-4" /> Save Changes</>
          )}
        </button>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">
          {error}
        </div>
      )}

      <form id="settings-form" onSubmit={handleSubmit} className="space-y-8">

        {/* General */}
        <section className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-9 h-9 bg-blue-50 rounded-lg flex items-center justify-center">
              <School className="w-5 h-5 text-school-blue" />
            </div>
            <h2 className="text-base font-semibold text-gray-900">General</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="label">School Name</label>
              <input
                className="input"
                value={settings.school_name}
                onChange={(e) => set("school_name", e.target.value)}
                placeholder="e.g. Greenfield High School"
              />
            </div>
            <div>
              <label className="label">Tagline</label>
              <input
                className="input"
                value={settings.school_tagline}
                onChange={(e) => set("school_tagline", e.target.value)}
                placeholder="Short motto or slogan"
              />
            </div>
            <div>
              <label className="label">Homepage Hero Headline</label>
              <input
                className="input"
                value={settings.hero_headline}
                onChange={(e) => set("hero_headline", e.target.value)}
                placeholder="e.g. Shaping Tomorrow's Leaders"
              />
            </div>
            <div>
              <label className="label">Homepage Hero Description</label>
              <textarea
                className="input resize-none"
                rows={3}
                value={settings.hero_description}
                onChange={(e) => set("hero_description", e.target.value)}
                placeholder="Short description shown on the homepage hero section"
              />
            </div>
          </div>
        </section>

        {/* Contact */}
        <section className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-9 h-9 bg-green-50 rounded-lg flex items-center justify-center">
              <Phone className="w-5 h-5 text-green-600" />
            </div>
            <h2 className="text-base font-semibold text-gray-900">Contact Information</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="label">Contact Email</label>
              <input
                className="input"
                type="email"
                value={settings.contact_email}
                onChange={(e) => set("contact_email", e.target.value)}
                placeholder="info@school.ac.ke"
              />
            </div>
            <div>
              <label className="label">Phone Number</label>
              <input
                className="input"
                type="tel"
                value={settings.contact_phone}
                onChange={(e) => set("contact_phone", e.target.value)}
                placeholder="+254 700 000 000"
              />
            </div>
            <div>
              <label className="label">Physical Address</label>
              <textarea
                className="input resize-none"
                rows={2}
                value={settings.contact_address}
                onChange={(e) => set("contact_address", e.target.value)}
                placeholder="P.O. Box 1234, Nairobi, Kenya"
              />
            </div>
          </div>
        </section>

        {/* Website */}
        <section className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-9 h-9 bg-purple-50 rounded-lg flex items-center justify-center">
              <Globe className="w-5 h-5 text-purple-600" />
            </div>
            <h2 className="text-base font-semibold text-gray-900">Website</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="label">School Website URL</label>
              <input
                className="input"
                type="url"
                value={settings.website_url ?? ""}
                onChange={(e) => set("website_url", e.target.value)}
                placeholder="https://school.ac.ke"
              />
            </div>
          </div>
        </section>

        {/* Social Media */}
        <section className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-9 h-9 bg-amber-50 rounded-lg flex items-center justify-center">
              <Share2 className="w-5 h-5 text-amber-600" />
            </div>
            <h2 className="text-base font-semibold text-gray-900">Social Media</h2>
          </div>
          <div className="space-y-4">
            {[
              { key: "facebook_url",  label: "Facebook",  placeholder: "https://facebook.com/yourschool" },
              { key: "twitter_url",   label: "Twitter / X", placeholder: "https://twitter.com/yourschool" },
              { key: "instagram_url", label: "Instagram", placeholder: "https://instagram.com/yourschool" },
              { key: "youtube_url",   label: "YouTube",   placeholder: "https://youtube.com/@yourschool" },
            ].map(({ key, label, placeholder }) => (
              <div key={key}>
                <label className="label">{label}</label>
                <input
                  className="input"
                  type="url"
                  value={settings[key] ?? ""}
                  onChange={(e) => set(key, e.target.value)}
                  placeholder={placeholder}
                />
              </div>
            ))}
          </div>
        </section>

      </form>
    </div>
  );
}
