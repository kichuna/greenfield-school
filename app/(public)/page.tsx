import type { Metadata } from "next";
import Link from "next/link";
import {
  GraduationCap, Users, Trophy, BookOpen,
  ArrowRight, Calendar, Megaphone, ChevronRight,
  Microscope, Palette, Globe
} from "lucide-react";
import { prisma } from "@/lib/db";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Home",
  description: "Welcome to Greenfield High School — Excellence in Learning, Character in Life.",
};

const stats = [
  { label: "Years of Excellence",  value: "40+",  Icon: Trophy },
  { label: "Students Enrolled",    value: "1,200+", Icon: Users },
  { label: "Academic Programs",    value: "15+",  Icon: BookOpen },
  { label: "Alumni Worldwide",     value: "5,000+", Icon: GraduationCap },
];

const pathways = [
  {
    Icon: Microscope,
    title: "STEM Pathway",
    description: "Mathematics, Physics, Chemistry, Biology, Computer Science. Prepare for science and technology careers.",
    href: "/academics#stem",
    color: "bg-blue-50 text-blue-600 border-blue-100",
    iconBg: "bg-blue-100",
  },
  {
    Icon: Globe,
    title: "Humanities Pathway",
    description: "History, Geography, Literature, Languages, Social Studies. Develop critical thinking and communication skills.",
    href: "/academics#humanities",
    color: "bg-green-50 text-green-600 border-green-100",
    iconBg: "bg-green-100",
  },
  {
    Icon: Palette,
    title: "Arts Pathway",
    description: "Visual Arts, Music, Drama, Design. Cultivate creativity and artistic expression.",
    href: "/academics#arts",
    color: "bg-amber-50 text-amber-600 border-amber-100",
    iconBg: "bg-amber-100",
  },
];

export default async function HomePage() {
  const [latestNews, upcomingEvents] = await Promise.all([
    prisma.newsItem.findMany({
      where:   { status: "PUBLISHED" },
      orderBy: { publishedAt: "desc" },
      take:    3,
      select:  { id: true, title: true, slug: true, excerpt: true, publishedAt: true },
    }).catch(() => []),
    prisma.event.findMany({
      where:   { startDate: { gte: new Date() } },
      orderBy: { startDate: "asc" },
      take:    3,
      select:  { id: true, title: true, startDate: true, location: true },
    }).catch(() => []),
  ]);

  return (
    <>
      {/* ── Hero ───────────────────────────────────────────────── */}
      <section className="relative min-h-[90vh] flex items-center bg-gradient-to-br from-school-blue via-primary-800 to-primary-900 overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 right-20 w-72 h-72 rounded-full bg-school-gold blur-3xl" />
          <div className="absolute bottom-20 left-20 w-96 h-96 rounded-full bg-white blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="text-white animate-fade-in">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 text-sm mb-6">
                <span className="w-2 h-2 rounded-full bg-school-gold animate-pulse" />
                2025 Admissions Open
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold leading-tight mb-6">
                Shape Your Future at{" "}
                <span className="text-school-gold">Greenfield</span>
                <br />High School
              </h1>
              <p className="text-xl text-blue-100 mb-10 leading-relaxed max-w-lg">
                Excellence in Learning, Character in Life. Join a community where every student discovers their potential and becomes a leader.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/admissions" className="btn-secondary text-base px-8 py-3">
                  Apply Now <ArrowRight className="w-5 h-5" />
                </Link>
                <Link href="/about" className="border-2 border-white/40 text-white hover:bg-white/10 inline-flex items-center gap-2 px-8 py-3 rounded-lg font-semibold transition-colors text-base">
                  Learn More
                </Link>
              </div>
            </div>

            {/* Stats card */}
            <div className="grid grid-cols-2 gap-4 animate-slide-up">
              {stats.map(({ label, value, Icon }) => (
                <div key={label} className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 text-white hover:bg-white/15 transition-colors">
                  <Icon className="w-8 h-8 text-school-gold mb-3" />
                  <p className="text-3xl font-bold text-school-gold">{value}</p>
                  <p className="text-blue-200 text-sm mt-1">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Welcome / About ──────────────────────────────────────── */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-school-gold font-semibold text-sm uppercase tracking-wider mb-3">About Our School</p>
              <h2 className="section-heading">A Legacy of Academic Excellence</h2>
              <p className="section-subheading mb-6">
                Since 1985, Greenfield High School has stood as a beacon of academic achievement and character formation in Kenya.
              </p>
              <p className="text-gray-600 leading-relaxed mb-8">
                Our school combines a rigorous academic curriculum with rich co-curricular programs, producing well-rounded graduates who excel in universities and careers across the world. We are accredited by the Kenya National Examination Council (KNEC) and follow the 8-4-4 curriculum.
              </p>
              <div className="flex flex-wrap gap-3 mb-8">
                {["KNEC Accredited", "ISO Certified", "Best School Award 2024"].map((badge) => (
                  <span key={badge} className="badge bg-blue-50 text-school-blue border border-blue-100 px-4 py-1.5 text-sm">
                    {badge}
                  </span>
                ))}
              </div>
              <Link href="/about" className="btn-primary">
                Our Story <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="relative">
              <div className="aspect-[4/3] bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center overflow-hidden">
                <div className="text-center text-blue-400">
                  <GraduationCap className="w-24 h-24 mx-auto mb-4 opacity-40" />
                  <p className="text-sm opacity-60">School Photo Placeholder</p>
                </div>
              </div>
              <div className="absolute -bottom-6 -left-6 bg-school-gold rounded-xl p-5 shadow-xl">
                <p className="text-white font-bold text-2xl">98%</p>
                <p className="text-white/80 text-xs">University Placement Rate</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Academic Pathways ────────────────────────────────────── */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-school-gold font-semibold text-sm uppercase tracking-wider mb-3">Academics</p>
            <h2 className="section-heading mx-auto">Choose Your Pathway</h2>
            <p className="section-subheading mx-auto text-center mt-4">
              Three distinct academic pathways tailored to guide students toward their goals.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {pathways.map(({ Icon, title, description, href, color, iconBg }) => (
              <Link key={href} href={href} className={`card p-8 border-2 ${color} group`}>
                <div className={`w-14 h-14 ${iconBg} rounded-xl flex items-center justify-center mb-6`}>
                  <Icon className="w-7 h-7" />
                </div>
                <h3 className="font-heading text-xl font-bold text-gray-900 mb-3">{title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed mb-6">{description}</p>
                <span className="inline-flex items-center gap-1 text-sm font-semibold group-hover:gap-2 transition-all">
                  Explore Pathway <ChevronRight className="w-4 h-4" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── News & Events ────────────────────────────────────────── */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* News */}
            <div className="lg:col-span-2">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <p className="text-school-gold font-semibold text-sm uppercase tracking-wider mb-1">Latest</p>
                  <h2 className="text-2xl font-heading font-bold text-school-blue">News & Announcements</h2>
                </div>
                <Link href="/news" className="text-school-blue font-medium text-sm hover:underline flex items-center gap-1">
                  View all <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="space-y-6">
                {latestNews.length === 0 ? (
                  <p className="text-gray-400 text-sm py-8 text-center">No news published yet.</p>
                ) : (
                  latestNews.map((item) => (
                    <Link key={item.id} href={`/news/${item.slug}`} className="card flex gap-5 p-5 group">
                      <div className="w-16 h-16 bg-blue-50 rounded-xl flex items-center justify-center shrink-0">
                        <Megaphone className="w-7 h-7 text-school-blue" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 group-hover:text-school-blue transition-colors mb-1">
                          {item.title}
                        </h3>
                        {item.excerpt && (
                          <p className="text-gray-500 text-sm line-clamp-2">{item.excerpt}</p>
                        )}
                        {item.publishedAt && (
                          <p className="text-xs text-gray-400 mt-2">
                            {new Date(item.publishedAt).toLocaleDateString("en-KE", { year: "numeric", month: "short", day: "numeric" })}
                          </p>
                        )}
                      </div>
                    </Link>
                  ))
                )}
              </div>
            </div>

            {/* Events */}
            <div>
              <div className="flex items-center justify-between mb-8">
                <div>
                  <p className="text-school-gold font-semibold text-sm uppercase tracking-wider mb-1">Upcoming</p>
                  <h2 className="text-2xl font-heading font-bold text-school-blue">Events</h2>
                </div>
                <Link href="/events" className="text-school-blue font-medium text-sm hover:underline flex items-center gap-1">
                  All <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="space-y-4">
                {upcomingEvents.length === 0 ? (
                  <p className="text-gray-400 text-sm py-4 text-center">No upcoming events.</p>
                ) : (
                  upcomingEvents.map((event) => (
                    <div key={event.id} className="card p-4 flex gap-4">
                      <div className="w-12 h-12 bg-school-gold/10 rounded-lg flex items-center justify-center shrink-0">
                        <Calendar className="w-5 h-5 text-school-gold" />
                      </div>
                      <div>
                        <p className="font-semibold text-sm text-gray-900">{event.title}</p>
                        <p className="text-xs text-school-blue mt-0.5">
                          {new Date(event.startDate).toLocaleDateString("en-KE", { year: "numeric", month: "short", day: "numeric" })}
                        </p>
                        {event.location && (
                          <p className="text-xs text-gray-500 mt-0.5">{event.location}</p>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Admissions CTA */}
              <div className="mt-8 bg-school-blue rounded-2xl p-6 text-white">
                <GraduationCap className="w-10 h-10 text-school-gold mb-4" />
                <h3 className="font-heading font-bold text-lg mb-2">Join Greenfield Family</h3>
                <p className="text-blue-200 text-sm mb-4">Applications for 2025/2026 academic year are open.</p>
                <Link href="/admissions" className="btn-secondary text-sm w-full justify-center">
                  Apply Now
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Call to Action ───────────────────────────────────────── */}
      <section className="py-20 bg-gradient-to-r from-school-gold to-amber-500">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-white mb-4">
            Ready to Begin Your Journey?
          </h2>
          <p className="text-amber-100 text-lg mb-8">
            Join thousands of students who have discovered their potential at Greenfield High School.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/admissions" className="bg-white text-school-blue font-semibold px-8 py-3 rounded-lg hover:bg-blue-50 transition-colors inline-flex items-center gap-2">
              Start Application <ArrowRight className="w-5 h-5" />
            </Link>
            <Link href="/contact" className="border-2 border-white/60 text-white font-semibold px-8 py-3 rounded-lg hover:bg-white/10 transition-colors">
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
