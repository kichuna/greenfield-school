import Link from "next/link";
import { GraduationCap, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Youtube } from "lucide-react";

const links = {
  quickLinks: [
    { label: "About Us",    href: "/about" },
    { label: "Academics",   href: "/academics" },
    { label: "Student Life",href: "/student-life" },
    { label: "Admissions",  href: "/admissions" },
    { label: "News",        href: "/news" },
    { label: "Events",      href: "/events" },
    { label: "Contact",     href: "/contact" },
  ],
  admissions: [
    { label: "How to Apply",          href: "/admissions#how-to-apply" },
    { label: "Application Form",      href: "/admissions#form" },
    { label: "Track Application",     href: "/admissions#track" },
    { label: "Fee Structure",         href: "/admissions#fees" },
    { label: "Admission Documents",   href: "/admissions#documents" },
  ],
  academic: [
    { label: "STEM Pathway",          href: "/academics#stem" },
    { label: "Humanities",            href: "/academics#humanities" },
    { label: "Arts Pathway",          href: "/academics#arts" },
    { label: "Exam Information",      href: "/academics#exams" },
    { label: "Career Guidance",       href: "/academics#careers" },
    { label: "Resources",             href: "/academics#resources" },
  ],
};

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-school-blue text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-school-gold rounded-full flex items-center justify-center">
                <GraduationCap className="w-7 h-7 text-white" />
              </div>
              <div>
                <p className="font-heading font-bold text-lg leading-tight">Greenfield</p>
                <p className="text-sm text-blue-200">High School</p>
              </div>
            </div>
            <p className="text-blue-200 text-sm leading-relaxed mb-6">
              Excellence in Learning, Character in Life. Shaping tomorrow's leaders since 1985.
            </p>
            <div className="space-y-2 text-sm text-blue-200">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
                <span>P.O. Box 1234, Nairobi, Kenya</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 shrink-0" />
                <span>+254 700 000 000</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 shrink-0" />
                <span>info@greenfieldhs.ac</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">Quick Links</h3>
            <ul className="space-y-2">
              {links.quickLinks.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-blue-200 hover:text-school-gold text-sm transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Admissions */}
          <div>
            <h3 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">Admissions</h3>
            <ul className="space-y-2">
              {links.admissions.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-blue-200 hover:text-school-gold text-sm transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Academics */}
          <div>
            <h3 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">Academics</h3>
            <ul className="space-y-2">
              {links.academic.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-blue-200 hover:text-school-gold text-sm transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-blue-800 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-blue-300 text-sm">
            &copy; {year} Greenfield High School. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            {[
              { Icon: Facebook,  href: "#" },
              { Icon: Twitter,   href: "#" },
              { Icon: Instagram, href: "#" },
              { Icon: Youtube,   href: "#" },
            ].map(({ Icon, href }, i) => (
              <Link
                key={i}
                href={href}
                className="w-8 h-8 bg-blue-800 rounded-full flex items-center justify-center hover:bg-school-gold transition-colors"
                aria-label="Social link"
              >
                <Icon className="w-4 h-4" />
              </Link>
            ))}
          </div>
          <div className="flex gap-4 text-sm text-blue-300">
            <Link href="/privacy" className="hover:text-white">Privacy Policy</Link>
            <Link href="/terms"   className="hover:text-white">Terms of Use</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
