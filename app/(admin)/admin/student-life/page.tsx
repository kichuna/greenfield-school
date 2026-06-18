"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Save, Loader2, CheckCircle2, GripVertical, X } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

type Club = {
  name: string;
  members: number;
  desc: string;
  icon: string;
};

type Sport = {
  name: string;
  achievement: string;
};

type House = {
  name: string;
  color: string;
  motto: string;
};

type StudentLifeData = {
  clubs:        Club[];
  sports:       Sport[];
  houses:       House[];
  achievements: string[];
  govRoles:     string[];
};

// ─── Defaults ─────────────────────────────────────────────────────────────────

const DEFAULT_DATA: StudentLifeData = {
  clubs: [
    { name: "Coding & Robotics Club",   members: 45, desc: "Build apps, robots, and compete in national hackathons.",    icon: "Cpu"      },
    { name: "Debate & MUN Club",         members: 60, desc: "National debate champions. Represent Kenya at international MUN.", icon: "Globe"    },
    { name: "Music & Choir",             members: 80, desc: "Two choirs, a jazz band, and a traditional ensemble.",        icon: "Music"    },
    { name: "Creative Writing Club",     members: 35, desc: "Publish the school magazine and short story collections.",    icon: "BookOpen" },
    { name: "Fitness & Wellness Club",   members: 50, desc: "Yoga, aerobics, and mental wellness programs.",               icon: "Dumbbell" },
    { name: "Environmental Club",        members: 70, desc: "Tree planting, sustainability, and community clean-ups.",     icon: "Globe"    },
    { name: "Young Entrepreneurs",       members: 40, desc: "Business plans, pitching competitions, and mentorship.",      icon: "Users"    },
    { name: "Drama Society",             members: 55, desc: "Produce and perform plays at the National Drama Festival.",   icon: "Star"     },
  ],
  sports: [
    { name: "Football (Boys)",  achievement: "National Quarter-finalists 2024" },
    { name: "Netball (Girls)",  achievement: "County Champions 2024"           },
    { name: "Athletics",        achievement: "15 national medals 2024"         },
    { name: "Basketball",       achievement: "Regional runners-up 2024"        },
    { name: "Volleyball",       achievement: "County Champions 2024"           },
    { name: "Swimming",         achievement: "National school record 2024"     },
    { name: "Badminton",        achievement: "National Championship finalists"  },
    { name: "Chess",            achievement: "East Africa Champions 2024"      },
  ],
  houses: [
    { name: "Phoenix House", color: "bg-red-500",   motto: "Rise and Excel"         },
    { name: "Falcon House",  color: "bg-blue-600",  motto: "Swift and Fearless"     },
    { name: "Titan House",   color: "bg-green-600", motto: "Strength Through Unity" },
    { name: "Eagle House",   color: "bg-amber-500", motto: "Soar Above All"         },
  ],
  achievements: [
    "KCSE Mean Score: B+ (2024)",
    "National Drama Festival — Gold Medal 2025",
    "Kenya Music Festival — Gold Medal 2024",
    "National Science Fair — 2nd Place 2024",
    "East Africa Chess Champions 2024",
    "Inter-School Debate — National Champions 2024",
    "Kenya Schools Netball — County Champions 2024",
    "Best Environmental School Award 2024",
  ],
  govRoles: [
    "School Head Prefect & Deputy",
    "House Captains",
    "Club Presidents",
    "Class Representatives",
  ],
};

const HOUSE_COLORS = [
  { label: "Red",    value: "bg-red-500"    },
  { label: "Blue",   value: "bg-blue-600"   },
  { label: "Green",  value: "bg-green-600"  },
  { label: "Amber",  value: "bg-amber-500"  },
  { label: "Purple", value: "bg-purple-600" },
  { label: "Gray",   value: "bg-gray-600"   },
];

const CLUB_ICONS = ["Cpu", "Globe", "Music", "BookOpen", "Dumbbell", "Users", "Star", "Trophy", "Heart", "Leaf", "Camera", "Code"];

type Tab = "clubs" | "sports" | "houses" | "achievements" | "leadership";

// ─── Component ────────────────────────────────────────────────────────────────

export default function AdminStudentLifePage() {
  const [tab,     setTab]     = useState<Tab>("clubs");
  const [data,    setData]    = useState<StudentLifeData>(DEFAULT_DATA);
  const [loading, setLoading] = useState(true);
  const [saving,  setSaving]  = useState(false);
  const [saved,   setSaved]   = useState(false);
  const [error,   setError]   = useState("");

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((r) => r.json())
      .then((s: Record<string, string>) => {
        setData({
          clubs:        s.student_life_clubs        ? JSON.parse(s.student_life_clubs)        : DEFAULT_DATA.clubs,
          sports:       s.student_life_sports       ? JSON.parse(s.student_life_sports)       : DEFAULT_DATA.sports,
          houses:       s.student_life_houses       ? JSON.parse(s.student_life_houses)       : DEFAULT_DATA.houses,
          achievements: s.student_life_achievements ? JSON.parse(s.student_life_achievements) : DEFAULT_DATA.achievements,
          govRoles:     s.student_life_gov_roles    ? JSON.parse(s.student_life_gov_roles)    : DEFAULT_DATA.govRoles,
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
      const res = await fetch("/api/admin/settings", {
        method:  "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          student_life_clubs:        JSON.stringify(data.clubs),
          student_life_sports:       JSON.stringify(data.sports),
          student_life_houses:       JSON.stringify(data.houses),
          student_life_achievements: JSON.stringify(data.achievements),
          student_life_gov_roles:    JSON.stringify(data.govRoles),
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

  // ── Clubs helpers ──
  function addClub() {
    setData((d) => ({ ...d, clubs: [...d.clubs, { name: "", members: 0, desc: "", icon: "Star" }] }));
  }
  function updateClub(i: number, field: keyof Club, value: string | number) {
    setData((d) => {
      const clubs = [...d.clubs];
      clubs[i] = { ...clubs[i], [field]: value };
      return { ...d, clubs };
    });
  }
  function removeClub(i: number) {
    setData((d) => ({ ...d, clubs: d.clubs.filter((_, idx) => idx !== i) }));
  }

  // ── Sports helpers ──
  function addSport() {
    setData((d) => ({ ...d, sports: [...d.sports, { name: "", achievement: "" }] }));
  }
  function updateSport(i: number, field: keyof Sport, value: string) {
    setData((d) => {
      const sports = [...d.sports];
      sports[i] = { ...sports[i], [field]: value };
      return { ...d, sports };
    });
  }
  function removeSport(i: number) {
    setData((d) => ({ ...d, sports: d.sports.filter((_, idx) => idx !== i) }));
  }

  // ── Houses helpers ──
  function addHouse() {
    setData((d) => ({ ...d, houses: [...d.houses, { name: "", color: "bg-blue-600", motto: "" }] }));
  }
  function updateHouse(i: number, field: keyof House, value: string) {
    setData((d) => {
      const houses = [...d.houses];
      houses[i] = { ...houses[i], [field]: value };
      return { ...d, houses };
    });
  }
  function removeHouse(i: number) {
    setData((d) => ({ ...d, houses: d.houses.filter((_, idx) => idx !== i) }));
  }

  // ── List item helpers (achievements + govRoles) ──
  function addListItem(key: "achievements" | "govRoles") {
    setData((d) => ({ ...d, [key]: [...d[key], ""] }));
  }
  function updateListItem(key: "achievements" | "govRoles", i: number, value: string) {
    setData((d) => {
      const list = [...d[key]];
      list[i] = value;
      return { ...d, [key]: list };
    });
  }
  function removeListItem(key: "achievements" | "govRoles", i: number) {
    setData((d) => ({ ...d, [key]: d[key].filter((_, idx) => idx !== i) }));
  }

  const TABS: { key: Tab; label: string }[] = [
    { key: "clubs",        label: "Clubs & Societies" },
    { key: "sports",       label: "Sports"            },
    { key: "houses",       label: "School Houses"     },
    { key: "achievements", label: "Achievements"      },
    { key: "leadership",   label: "Leadership"        },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="w-6 h-6 animate-spin text-school-blue" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-heading font-bold text-gray-900">Student Life</h1>
          <p className="text-sm text-gray-500 mt-1">Manage clubs, sports, houses, and achievements shown on the public site.</p>
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

      {/* ── Clubs ── */}
      {tab === "clubs" && (
        <div className="space-y-3">
          {data.clubs.map((club, i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
              <div className="grid sm:grid-cols-[1fr_1fr_auto] gap-3 mb-3">
                <div>
                  <label className="label text-xs">Club Name *</label>
                  <input className="input text-sm" value={club.name}
                    onChange={(e) => updateClub(i, "name", e.target.value)}
                    placeholder="e.g. Coding & Robotics Club" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="label text-xs">Members</label>
                    <input className="input text-sm" type="number" min="0" value={club.members || ""}
                      onChange={(e) => updateClub(i, "members", parseInt(e.target.value) || 0)}
                      placeholder="45" />
                  </div>
                  <div>
                    <label className="label text-xs">Icon</label>
                    <select className="input text-sm" value={club.icon}
                      onChange={(e) => updateClub(i, "icon", e.target.value)}>
                      {CLUB_ICONS.map((icon) => (
                        <option key={icon} value={icon}>{icon}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <button onClick={() => removeClub(i)}
                  className="self-end p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <div>
                <label className="label text-xs">Description</label>
                <textarea className="input text-sm resize-none" rows={2} value={club.desc}
                  onChange={(e) => updateClub(i, "desc", e.target.value)}
                  placeholder="Short description of the club" />
              </div>
            </div>
          ))}
          <button onClick={addClub} className="btn-outline text-sm py-2 w-full">
            <Plus className="w-4 h-4" /> Add Club
          </button>
        </div>
      )}

      {/* ── Sports ── */}
      {tab === "sports" && (
        <div className="space-y-3">
          {data.sports.map((sport, i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
              <div className="grid sm:grid-cols-[1fr_1fr_auto] gap-3">
                <div>
                  <label className="label text-xs">Sport Name *</label>
                  <input className="input text-sm" value={sport.name}
                    onChange={(e) => updateSport(i, "name", e.target.value)}
                    placeholder="e.g. Football (Boys)" />
                </div>
                <div>
                  <label className="label text-xs">Achievement / Note</label>
                  <input className="input text-sm" value={sport.achievement}
                    onChange={(e) => updateSport(i, "achievement", e.target.value)}
                    placeholder="e.g. County Champions 2024" />
                </div>
                <button onClick={() => removeSport(i)}
                  className="self-end p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
          <button onClick={addSport} className="btn-outline text-sm py-2 w-full">
            <Plus className="w-4 h-4" /> Add Sport
          </button>
        </div>
      )}

      {/* ── Houses ── */}
      {tab === "houses" && (
        <div className="space-y-3">
          {data.houses.map((house, i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
              <div className="grid sm:grid-cols-[1fr_1fr_auto_auto] gap-3">
                <div>
                  <label className="label text-xs">House Name *</label>
                  <input className="input text-sm" value={house.name}
                    onChange={(e) => updateHouse(i, "name", e.target.value)}
                    placeholder="e.g. Phoenix House" />
                </div>
                <div>
                  <label className="label text-xs">Motto</label>
                  <input className="input text-sm" value={house.motto}
                    onChange={(e) => updateHouse(i, "motto", e.target.value)}
                    placeholder="e.g. Rise and Excel" />
                </div>
                <div>
                  <label className="label text-xs">Color</label>
                  <div className="flex items-center gap-2">
                    <div className={`w-8 h-8 rounded-lg shrink-0 ${house.color}`} />
                    <select className="input text-sm" value={house.color}
                      onChange={(e) => updateHouse(i, "color", e.target.value)}>
                      {HOUSE_COLORS.map((c) => (
                        <option key={c.value} value={c.value}>{c.label}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <button onClick={() => removeHouse(i)}
                  className="self-end p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
          <button onClick={addHouse} className="btn-outline text-sm py-2 w-full">
            <Plus className="w-4 h-4" /> Add House
          </button>
        </div>
      )}

      {/* ── Achievements ── */}
      {tab === "achievements" && (
        <div className="space-y-3">
          <p className="text-sm text-gray-500 mb-4">These appear in the "Student Achievements" panel on the public page.</p>
          {data.achievements.map((a, i) => (
            <div key={i} className="flex items-center gap-3 bg-white rounded-xl border border-gray-100 shadow-sm p-3">
              <GripVertical className="w-4 h-4 text-gray-300 shrink-0" />
              <input className="input text-sm flex-1" value={a}
                onChange={(e) => updateListItem("achievements", i, e.target.value)}
                placeholder="e.g. National Drama Festival — Gold Medal 2025" />
              <button onClick={() => removeListItem("achievements", i)}
                className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors shrink-0">
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
          <button onClick={() => addListItem("achievements")} className="btn-outline text-sm py-2 w-full">
            <Plus className="w-4 h-4" /> Add Achievement
          </button>
        </div>
      )}

      {/* ── Leadership ── */}
      {tab === "leadership" && (
        <div className="space-y-3">
          <p className="text-sm text-gray-500 mb-4">Leadership roles listed in the Student Government section.</p>
          {data.govRoles.map((role, i) => (
            <div key={i} className="flex items-center gap-3 bg-white rounded-xl border border-gray-100 shadow-sm p-3">
              <GripVertical className="w-4 h-4 text-gray-300 shrink-0" />
              <input className="input text-sm flex-1" value={role}
                onChange={(e) => updateListItem("govRoles", i, e.target.value)}
                placeholder="e.g. School Head Prefect & Deputy" />
              <button onClick={() => removeListItem("govRoles", i)}
                className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors shrink-0">
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
          <button onClick={() => addListItem("govRoles")} className="btn-outline text-sm py-2 w-full">
            <Plus className="w-4 h-4" /> Add Role
          </button>
        </div>
      )}
    </div>
  );
}
