"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Save, Loader2, CheckCircle2, X } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

type Pathway = {
  desc:     string;
  subjects: string[];
};

type ExamStat = {
  label: string;
  value: string;
  note:  string;
};

type AcademicsData = {
  stem:       Pathway;
  humanities: Pathway;
  arts:       Pathway;
  examStats:  ExamStat[];
};

// ─── Defaults ─────────────────────────────────────────────────────────────────

const DEFAULT: AcademicsData = {
  stem: {
    desc: "Our Science, Technology, Engineering, and Mathematics pathway prepares students for careers in medicine, engineering, ICT, and research. Students benefit from fully equipped labs and coding workshops.",
    subjects: ["Mathematics", "Physics", "Chemistry", "Biology", "Computer Studies", "Agriculture"],
  },
  humanities: {
    desc: "Developing critical thinkers, communicators, and global citizens. Students explore history, languages, social sciences, and geography, preparing for law, journalism, education, and public service.",
    subjects: ["History & Government", "Geography", "Christian Religious Education", "Kiswahili", "English", "French"],
  },
  arts: {
    desc: "Cultivating creativity, expression, and artistic excellence. Students in this pathway pursue visual arts, music, drama, and design, with pathways into fine arts, fashion, film, and creative industries.",
    subjects: ["Fine Art", "Music", "Drama", "Home Science", "Drawing & Design", "Crafts"],
  },
  examStats: [
    { label: "KCSE Mean Grade",      value: "B+ (68.4)", note: "2024 results"           },
    { label: "University Placement", value: "98%",       note: "of Form 4 leavers"      },
    { label: "National Ranking",     value: "Top 50",    note: "Nationally recognised"  },
  ],
};

type Tab = "stem" | "humanities" | "arts" | "stats";

const TABS: { key: Tab; label: string }[] = [
  { key: "stem",       label: "STEM Pathway"        },
  { key: "humanities", label: "Humanities Pathway"  },
  { key: "arts",       label: "Arts Pathway"        },
  { key: "stats",      label: "Exam Statistics"     },
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function AdminAcademicsPage() {
  const [tab,     setTab]     = useState<Tab>("stem");
  const [data,    setData]    = useState<AcademicsData>(DEFAULT);
  const [loading, setLoading] = useState(true);
  const [saving,  setSaving]  = useState(false);
  const [saved,   setSaved]   = useState(false);
  const [error,   setError]   = useState("");

  useEffect(() => {
    fetch("/api/admin/academics")
      .then((r) => r.json())
      .then((s: Record<string, string>) => {
        setData({
          stem:       s.academics_stem       ? JSON.parse(s.academics_stem)       : DEFAULT.stem,
          humanities: s.academics_humanities ? JSON.parse(s.academics_humanities) : DEFAULT.humanities,
          arts:       s.academics_arts       ? JSON.parse(s.academics_arts)       : DEFAULT.arts,
          examStats:  s.academics_exam_stats ? JSON.parse(s.academics_exam_stats) : DEFAULT.examStats,
        });
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  async function save() {
    setSaving(true);
    setError("");
    setSaved(false);
    try {
      const res = await fetch("/api/admin/academics", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          academics_stem:       JSON.stringify(data.stem),
          academics_humanities: JSON.stringify(data.humanities),
          academics_arts:       JSON.stringify(data.arts),
          academics_exam_stats: JSON.stringify(data.examStats),
        }),
      });
      if (!res.ok) throw new Error();
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      setError("Failed to save. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  // ── Pathway helpers ──

  function setPathwayDesc(key: "stem" | "humanities" | "arts", desc: string) {
    setData((d) => ({ ...d, [key]: { ...d[key], desc } }));
  }

  function addSubject(key: "stem" | "humanities" | "arts") {
    setData((d) => ({ ...d, [key]: { ...d[key], subjects: [...d[key].subjects, ""] } }));
  }

  function updateSubject(key: "stem" | "humanities" | "arts", i: number, value: string) {
    setData((d) => {
      const subjects = [...d[key].subjects];
      subjects[i] = value;
      return { ...d, [key]: { ...d[key], subjects } };
    });
  }

  function removeSubject(key: "stem" | "humanities" | "arts", i: number) {
    setData((d) => ({
      ...d,
      [key]: { ...d[key], subjects: d[key].subjects.filter((_, idx) => idx !== i) },
    }));
  }

  // ── Exam stat helpers ──

  function updateStat(i: number, field: keyof ExamStat, value: string) {
    setData((d) => {
      const examStats = [...d.examStats];
      examStats[i] = { ...examStats[i], [field]: value };
      return { ...d, examStats };
    });
  }

  function addStat() {
    setData((d) => ({ ...d, examStats: [...d.examStats, { label: "", value: "", note: "" }] }));
  }

  function removeStat(i: number) {
    setData((d) => ({ ...d, examStats: d.examStats.filter((_, idx) => idx !== i) }));
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="w-6 h-6 animate-spin text-school-blue" />
      </div>
    );
  }

  function PathwayEditor({ pathKey }: { pathKey: "stem" | "humanities" | "arts" }) {
    const pathway = data[pathKey];
    return (
      <div className="space-y-5">
        <div>
          <label className="label">Pathway Description</label>
          <textarea className="input resize-none" rows={4} value={pathway.desc}
            onChange={(e) => setPathwayDesc(pathKey, e.target.value)}
            placeholder="Describe this academic pathway…" />
        </div>
        <div>
          <label className="label mb-3 block">Subjects</label>
          <div className="space-y-2">
            {pathway.subjects.map((s, i) => (
              <div key={i} className="flex items-center gap-3 bg-white rounded-xl border border-gray-100 shadow-sm px-3 py-2">
                <input className="input text-sm flex-1 border-0 shadow-none p-0 focus:ring-0"
                  value={s}
                  onChange={(e) => updateSubject(pathKey, i, e.target.value)}
                  placeholder="e.g. Mathematics" />
                <button onClick={() => removeSubject(pathKey, i)}
                  className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors shrink-0">
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
          <button onClick={() => addSubject(pathKey)} className="btn-outline text-sm py-2 w-full mt-3">
            <Plus className="w-4 h-4" /> Add Subject
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-heading font-bold text-gray-900">Academics</h1>
          <p className="text-sm text-gray-500 mt-1">Manage pathway descriptions, subjects, and exam statistics shown on the public site.</p>
        </div>
        <button onClick={save} disabled={saving} className="btn-primary text-sm py-2">
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
        <div className="mb-5 bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">{error}</div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 mb-6 bg-gray-100 rounded-xl p-1 w-fit flex-wrap">
        {TABS.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              tab === key ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === "stem"       && <PathwayEditor pathKey="stem"       />}
      {tab === "humanities" && <PathwayEditor pathKey="humanities" />}
      {tab === "arts"       && <PathwayEditor pathKey="arts"       />}

      {/* ── Exam Stats ── */}
      {tab === "stats" && (
        <div className="space-y-4">
          <p className="text-sm text-gray-500 mb-2">These three cards appear in the Examination & Assessment section.</p>
          {data.examStats.map((stat, i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
              <div className="grid sm:grid-cols-[1fr_1fr_1fr_auto] gap-3">
                <div>
                  <label className="label text-xs">Label</label>
                  <input className="input text-sm" value={stat.label}
                    onChange={(e) => updateStat(i, "label", e.target.value)}
                    placeholder="e.g. KCSE Mean Grade" />
                </div>
                <div>
                  <label className="label text-xs">Value</label>
                  <input className="input text-sm" value={stat.value}
                    onChange={(e) => updateStat(i, "value", e.target.value)}
                    placeholder="e.g. B+ (68.4)" />
                </div>
                <div>
                  <label className="label text-xs">Note</label>
                  <input className="input text-sm" value={stat.note}
                    onChange={(e) => updateStat(i, "note", e.target.value)}
                    placeholder="e.g. 2024 results" />
                </div>
                <button onClick={() => removeStat(i)}
                  className="self-end p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
          <button onClick={addStat} className="btn-outline text-sm py-2 w-full">
            <Plus className="w-4 h-4" /> Add Stat
          </button>
        </div>
      )}
    </div>
  );
}
