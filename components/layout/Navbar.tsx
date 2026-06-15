"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ChevronDown, GraduationCap } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSession } from "next-auth/react";

const navLinks = [
  { label: "Home",          href: "/" },
  {
    label: "About",
    href:  "/about",
    children: [
      { label: "Our History",   href: "/about#history" },
      { label: "Vision & Mission", href: "/about#mission" },
      { label: "Leadership",    href: "/about#leadership" },
    ],
  },
  {
    label: "Academics",
    href:  "/academics",
    children: [
      { label: "STEM Pathway",        href: "/academics#stem" },
      { label: "Humanities",          href: "/academics#humanities" },
      { label: "Arts Pathway",        href: "/academics#arts" },
      { label: "Resources & Downloads", href: "/academics#resources" },
    ],
  },
  { label: "Student Life", href: "/student-life" },
  { label: "Admissions",   href: "/admissions" },
  { label: "Alumni",       href: "/alumni" },
  { label: "News",         href: "/news" },
  { label: "Gallery",      href: "/gallery" },
  { label: "Contact",      href: "/contact" },
];

export function Navbar() {
  const [isOpen,       setIsOpen]       = useState(false);
  const [scrolled,     setScrolled]     = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const pathname = usePathname();
  const { data: session } = useSession();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { setIsOpen(false); }, [pathname]);

  return (
    <nav className={cn(
      "fixed top-0 inset-x-0 z-50 transition-all duration-300",
      scrolled ? "bg-white shadow-md" : "bg-white/95 backdrop-blur-sm",
    )}>
      {/* Top bar */}
      <div className="bg-school-blue text-white text-xs py-1.5 px-4 hidden md:flex justify-between items-center">
        <span>P.O. Box 1234, Nairobi, Kenya &nbsp;|&nbsp; info@greenfieldhs.ac</span>
        <span>+254 700 000 000</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-school-blue rounded-full flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-school-gold" />
            </div>
            <div className="hidden sm:block">
              <p className="font-heading font-bold text-school-blue leading-tight text-sm">Greenfield</p>
              <p className="text-xs text-gray-500">High School</p>
            </div>
          </Link>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) =>
              link.children ? (
                <div
                  key={link.href}
                  className="relative group"
                  onMouseEnter={() => setOpenDropdown(link.label)}
                  onMouseLeave={() => setOpenDropdown(null)}
                >
                  <button className={cn(
                    "flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-md transition-colors",
                    pathname.startsWith(link.href)
                      ? "text-school-blue bg-blue-50"
                      : "text-gray-700 hover:text-school-blue hover:bg-gray-50"
                  )}>
                    {link.label}
                    <ChevronDown className="w-3.5 h-3.5" />
                  </button>
                  {openDropdown === link.label && (
                    <div className="absolute top-full left-0 mt-1 w-52 bg-white rounded-lg shadow-lg border border-gray-100 py-1 animate-slide-down">
                      {link.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-school-blue transition-colors"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "px-3 py-2 text-sm font-medium rounded-md transition-colors",
                    pathname === link.href
                      ? "text-school-blue bg-blue-50"
                      : "text-gray-700 hover:text-school-blue hover:bg-gray-50"
                  )}
                >
                  {link.label}
                </Link>
              )
            )}
          </div>

          {/* CTA / Auth */}
          <div className="hidden lg:flex items-center gap-3">
            {session ? (
              <Link href="/admin/dashboard" className="btn-primary text-sm py-2">
                Dashboard
              </Link>
            ) : (
              <>
                <Link href="/auth/login" className="text-sm font-medium text-gray-700 hover:text-school-blue">
                  Staff Login
                </Link>
                <Link href="/admissions" className="btn-primary text-sm py-2">
                  Apply Now
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu toggle */}
          <button
            className="lg:hidden p-2 rounded-md text-gray-700 hover:bg-gray-100"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="lg:hidden bg-white border-t border-gray-100 px-4 py-4 space-y-1 animate-slide-down">
          {navLinks.map((link) => (
            <div key={link.href}>
              <Link
                href={link.href}
                className={cn(
                  "block px-3 py-2 rounded-md text-sm font-medium",
                  pathname === link.href
                    ? "text-school-blue bg-blue-50"
                    : "text-gray-700 hover:bg-gray-50"
                )}
              >
                {link.label}
              </Link>
              {link.children && (
                <div className="ml-4 mt-1 space-y-1">
                  {link.children.map((child) => (
                    <Link
                      key={child.href}
                      href={child.href}
                      className="block px-3 py-1.5 text-xs text-gray-600 hover:text-school-blue"
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
          <div className="pt-3 border-t border-gray-100 flex flex-col gap-2">
            <Link href="/admissions" className="btn-primary text-sm text-center">Apply Now</Link>
            <Link href="/auth/login" className="btn-outline text-sm text-center">Staff Login</Link>
          </div>
        </div>
      )}
    </nav>
  );
}
