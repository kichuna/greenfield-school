import type { Metadata } from "next";
import Link from "next/link";
import { Target, Eye, Heart, Users, ArrowRight, Award } from "lucide-react";

export const metadata: Metadata = {
  title: "About Us",
  description: "Learn about Greenfield High School — our history, vision, mission, values, and leadership.",
};

const leadership = [
  { name: "Dr. Margaret Odhiambo", title: "Principal",             bio: "Ed.D from University of Nairobi. 20+ years in educational leadership." },
  { name: "Mr. Samuel Kariuki",    title: "Deputy Principal",       bio: "M.Ed in Curriculum Studies. Leads academic affairs and timetabling." },
  { name: "Ms. Grace Wambua",      title: "Head of Academics",      bio: "B.Ed (Hons) Mathematics. Champion of STEM education." },
  { name: "Mr. Peter Mwangi",      title: "Dean of Students",       bio: "Counselling Psychology graduate. Student welfare advocate." },
  { name: "Mrs. Faith Njoroge",    title: "Head of Administration", bio: "MBA, CPA(K). Oversees finance and administration." },
  { name: "Mr. David Otieno",      title: "Director of Admissions", bio: "15 years managing student recruitment and enrollment." },
];

const values = [
  { icon: Target, title: "Excellence",    description: "We pursue the highest standards in everything we do — academics, sport, arts, and character." },
  { icon: Heart,  title: "Integrity",     description: "We act honestly, take responsibility, and treat everyone with respect and fairness." },
  { icon: Users,  title: "Community",     description: "We build a strong, inclusive community that supports every member to thrive." },
  { icon: Eye,    title: "Innovation",    description: "We embrace new ideas, technology, and approaches to prepare students for a changing world." },
];

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-r from-school-blue to-primary-700 text-white py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-school-gold font-semibold text-sm uppercase tracking-wider mb-3">Who We Are</p>
          <h1 className="text-4xl md:text-5xl font-heading font-bold mb-6">About Greenfield High School</h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            A legacy of academic excellence and character formation since 1985.
          </p>
        </div>
      </section>

      {/* History */}
      <section id="history" className="py-24 bg-white scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-school-gold font-semibold text-sm uppercase tracking-wider mb-3">Our Story</p>
              <h2 className="section-heading">40 Years of Shaping Futures</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Greenfield High School was founded in 1985 by the Greenfield Education Trust with a vision to provide quality secondary education accessible to all. From humble beginnings with just 120 students and 8 teachers, we have grown into one of Kenya's premier secondary schools.
              </p>
              <p className="text-gray-600 leading-relaxed mb-4">
                Over four decades, our graduates have gone on to lead in government, medicine, law, technology, business, and the arts — carrying the Greenfield spirit of excellence to every corner of the world.
              </p>
              <p className="text-gray-600 leading-relaxed mb-8">
                Today, we serve over 1,200 students across Forms 1–4, with a teaching staff of 80+ qualified educators and a full suite of modern facilities including science labs, computer labs, a library, sports grounds, and a performing arts centre.
              </p>
              <div className="grid grid-cols-3 gap-6">
                {[
                  { value: "1985", label: "Founded" },
                  { value: "1,200+", label: "Students" },
                  { value: "5,000+", label: "Alumni" },
                ].map(({ value, label }) => (
                  <div key={label} className="text-center">
                    <p className="text-2xl font-bold text-school-blue">{value}</p>
                    <p className="text-gray-500 text-sm">{label}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-gray-100 rounded-2xl aspect-[4/3] flex items-center justify-center">
              <p className="text-gray-400 text-sm">School History Photo</p>
            </div>
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section id="mission" className="py-24 bg-gray-50 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="section-heading mx-auto">Vision, Mission & Values</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <div className="bg-school-blue rounded-2xl p-8 text-white">
              <Eye className="w-10 h-10 text-school-gold mb-4" />
              <h3 className="font-heading text-xl font-bold mb-3">Our Vision</h3>
              <p className="text-blue-100 leading-relaxed">
                To be a centre of excellence that nurtures globally competitive, morally upright, and innovative citizens equipped to lead and serve in the 21st century.
              </p>
            </div>
            <div className="bg-school-gold rounded-2xl p-8 text-white">
              <Target className="w-10 h-10 text-white mb-4" />
              <h3 className="font-heading text-xl font-bold mb-3">Our Mission</h3>
              <p className="text-amber-100 leading-relaxed">
                To provide a holistic, student-centred education that fosters intellectual growth, character development, and lifelong learning through quality teaching, strong values, and a supportive environment.
              </p>
            </div>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map(({ icon: Icon, title, description }) => (
              <div key={title} className="card p-6 text-center">
                <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Icon className="w-7 h-7 text-school-blue" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">{title}</h4>
                <p className="text-gray-500 text-sm leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Leadership */}
      <section id="leadership" className="py-24 bg-white scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-school-gold font-semibold text-sm uppercase tracking-wider mb-3">Our Team</p>
            <h2 className="section-heading mx-auto">School Leadership</h2>
            <p className="section-subheading mx-auto mt-4 text-center">
              Experienced educators and administrators dedicated to your child's success.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {leadership.map(({ name, title, bio }) => (
              <div key={name} className="card p-6">
                <div className="w-16 h-16 bg-gradient-to-br from-school-blue to-primary-700 rounded-full flex items-center justify-center mb-4">
                  <span className="text-white font-bold text-xl">{name.split(" ")[1][0]}</span>
                </div>
                <h3 className="font-semibold text-gray-900">{name}</h3>
                <p className="text-school-blue text-sm font-medium mb-2">{title}</p>
                <p className="text-gray-500 text-sm leading-relaxed">{bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Accreditations */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-heading font-bold text-school-blue">Accreditations & Awards</h2>
          </div>
          <div className="flex flex-wrap justify-center gap-6">
            {["KNEC Accredited", "ISO 9001:2015 Certified", "Best National School 2024", "KCSE Top 100 School", "Green Schools Award"].map((a) => (
              <div key={a} className="bg-white border border-gray-200 rounded-xl px-6 py-4 flex items-center gap-3">
                <Award className="w-5 h-5 text-school-gold" />
                <span className="font-medium text-gray-700 text-sm">{a}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-school-blue text-white text-center">
        <div className="max-w-2xl mx-auto px-4">
          <h2 className="text-3xl font-heading font-bold mb-4">Become Part of Our Story</h2>
          <p className="text-blue-200 mb-8">Applications for the 2025/2026 academic year are open now.</p>
          <Link href="/admissions" className="btn-secondary">
            Apply Now <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </>
  );
}
