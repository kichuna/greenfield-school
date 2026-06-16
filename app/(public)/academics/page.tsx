import type { Metadata } from "next";
import Link from "next/link";
import { Microscope, Globe, Palette, Download, BookOpen, Award, Briefcase } from "lucide-react";
import { prisma } from "@/lib/db";

export const metadata: Metadata = {
  title: "Academics | Greenfield High School",
  description: "Explore Greenfield High School's academic programs — STEM, Humanities, and Arts pathways.",
};

export const revalidate = 60;

const subjects = {
  stem:       ["Mathematics", "Physics", "Chemistry", "Biology", "Computer Studies", "Agriculture"],
  humanities: ["History & Government", "Geography", "Christian Religious Education", "Kiswahili", "English", "French"],
  arts:       ["Fine Art", "Music", "Drama", "Home Science", "Drawing & Design", "Crafts"],
};

const categoryLabel: Record<string, string> = {
  CURRICULUM:      "Curriculum",
  EXAM_INFO:       "Exams",
  CAREER_GUIDANCE: "Career",
  GENERAL:         "General",
};

const categoryColor: Record<string, string> = {
  CURRICULUM:      "bg-blue-50 text-school-blue",
  EXAM_INFO:       "bg-purple-50 text-purple-700",
  CAREER_GUIDANCE: "bg-amber-50 text-amber-700",
  GENERAL:         "bg-gray-100 text-gray-600",
};

export default async function AcademicsPage() {
  const resources = await prisma.academicResource.findMany({
    where:   { isPublished: true, category: { not: "ADMISSIONS" } },
    orderBy: { createdAt: "desc" },
  }).catch(() => []);

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-r from-school-blue to-primary-700 text-white py-24">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-school-gold font-semibold text-sm uppercase tracking-wider mb-3">Academics</p>
          <h1 className="text-4xl md:text-5xl font-heading font-bold mb-6">Academic Programs</h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            Three distinct pathways to guide every student toward their strengths and aspirations.
          </p>
        </div>
      </section>

      {/* STEM */}
      <section id="stem" className="py-20 bg-white scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center mb-6">
                <Microscope className="w-7 h-7 text-blue-600" />
              </div>
              <h2 className="text-3xl font-heading font-bold text-school-blue mb-4">STEM Pathway</h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                Our Science, Technology, Engineering, and Mathematics pathway prepares students for careers in medicine, engineering, ICT, and research. Students benefit from fully equipped labs and coding workshops.
              </p>
              <ul className="grid grid-cols-2 gap-2">
                {subjects.stem.map((s) => (
                  <li key={s} className="flex items-center gap-2 text-sm text-gray-700">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0" /> {s}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-10 flex items-center justify-center">
              <Microscope className="w-32 h-32 text-blue-200" />
            </div>
          </div>
        </div>
      </section>

      {/* Humanities */}
      <section id="humanities" className="py-20 bg-gray-50 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-10 flex items-center justify-center order-last lg:order-first">
              <Globe className="w-32 h-32 text-green-200" />
            </div>
            <div>
              <div className="w-14 h-14 bg-green-100 rounded-2xl flex items-center justify-center mb-6">
                <Globe className="w-7 h-7 text-green-600" />
              </div>
              <h2 className="text-3xl font-heading font-bold text-school-blue mb-4">Humanities Pathway</h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                Developing critical thinkers, communicators, and global citizens. Students explore history, languages, social sciences, and geography, preparing for law, journalism, education, and public service.
              </p>
              <ul className="grid grid-cols-2 gap-2">
                {subjects.humanities.map((s) => (
                  <li key={s} className="flex items-center gap-2 text-sm text-gray-700">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 shrink-0" /> {s}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Arts */}
      <section id="arts" className="py-20 bg-white scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="w-14 h-14 bg-amber-100 rounded-2xl flex items-center justify-center mb-6">
                <Palette className="w-7 h-7 text-amber-600" />
              </div>
              <h2 className="text-3xl font-heading font-bold text-school-blue mb-4">Arts Pathway</h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                Cultivating creativity, expression, and artistic excellence. Students in this pathway pursue visual arts, music, drama, and design, with pathways into fine arts, fashion, film, and creative industries.
              </p>
              <ul className="grid grid-cols-2 gap-2">
                {subjects.arts.map((s) => (
                  <li key={s} className="flex items-center gap-2 text-sm text-gray-700">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" /> {s}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-2xl p-10 flex items-center justify-center">
              <Palette className="w-32 h-32 text-amber-200" />
            </div>
          </div>
        </div>
      </section>

      {/* Exams */}
      <section id="exams" className="py-20 bg-gray-50 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Award className="w-12 h-12 mx-auto text-school-gold mb-4" />
          <h2 className="text-3xl font-heading font-bold text-school-blue mb-4">Examination & Assessment</h2>
          <p className="text-gray-600 max-w-2xl mx-auto mb-8">
            Students sit KNEC examinations at the end of Form 4 (KCSE). Internal assessments, mid-term exams, and end-of-term exams track progress throughout the year.
          </p>
          <div className="grid sm:grid-cols-3 gap-6 max-w-3xl mx-auto text-left">
            {[
              { label: "KCSE Mean Grade", value: "B+ (68.4)", note: "2024 results" },
              { label: "University Placement", value: "98%", note: "of Form 4 leavers" },
              { label: "National Ranking", value: "Top 50", note: "Nationally recognised" },
            ].map(({ label, value, note }) => (
              <div key={label} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 text-center">
                <p className="text-2xl font-bold text-school-blue">{value}</p>
                <p className="text-sm font-medium text-gray-900 mt-1">{label}</p>
                <p className="text-xs text-gray-400 mt-0.5">{note}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Career Guidance */}
      <section id="careers" className="py-20 bg-white scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-6 items-start">
            <div className="w-14 h-14 bg-purple-100 rounded-2xl flex items-center justify-center shrink-0">
              <Briefcase className="w-7 h-7 text-purple-600" />
            </div>
            <div>
              <h2 className="text-3xl font-heading font-bold text-school-blue mb-4">Career Guidance</h2>
              <p className="text-gray-600 leading-relaxed max-w-2xl mb-4">
                Our dedicated career counsellors work with students from Form 2 onward to explore university options, career pathways, and professional skills. Annual career fairs bring industry professionals directly to campus.
              </p>
              <Link href="/contact" className="btn-primary text-sm py-2.5">
                Book a Counselling Session
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Resources & Downloads */}
      <section id="resources" className="py-20 bg-gray-50 scroll-mt-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-heading font-bold text-school-blue">Academic Resources</h2>
            <p className="text-sm text-gray-500 mt-2">Booklists, timetables, exam guides, and career resources.</p>
          </div>
          <div className="grid gap-3">
            {resources.length === 0 ? (
              <p className="text-center text-gray-400 py-8 text-sm">No resources uploaded yet. Check back soon.</p>
            ) : (
              resources.map((r) => (
                <div key={r.id} className="card flex items-center justify-between p-4">
                  <div className="flex items-center gap-4">
                    <BookOpen className="w-8 h-8 text-school-blue shrink-0" />
                    <div>
                      <p className="font-medium text-gray-900 text-sm">{r.title}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        {r.description && <span className="text-xs text-gray-400">{r.description}</span>}
                        <span className={`badge text-xs px-2 py-0.5 ${categoryColor[r.category] ?? "bg-gray-100 text-gray-600"}`}>
                          {categoryLabel[r.category] ?? r.category}
                        </span>
                      </div>
                    </div>
                  </div>
                  <a
                    href={`/api/documents/${r.id}/download`}
                    className="btn-outline text-xs py-1.5 px-4 gap-1 shrink-0"
                  >
                    <Download className="w-3.5 h-3.5" /> Download
                  </a>
                </div>
              ))
            )}
          </div>
        </div>
      </section>
    </>
  );
}
