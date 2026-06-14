"use client";

import { useState, useEffect } from "react";
import { GraduationCap, Users, Calendar, Globe, CheckCircle, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const schema = z.object({
  name:            z.string().min(2, "Required"),
  email:           z.string().email("Invalid email"),
  graduationYear:  z.string().min(4, "Required"),
  currentJobTitle: z.string().optional(),
  currentEmployer: z.string().optional(),
  location:        z.string().optional(),
  bio:             z.string().optional(),
  linkedIn:        z.string().url("Invalid URL").optional().or(z.literal("")),
});

type FormData = z.infer<typeof schema>;

type AlumniProfile = {
  id: string;
  graduationYear: number;
  currentJobTitle: string | null;
  currentEmployer: string | null;
  location: string | null;
  user: { name: string };
};

export default function AlumniPage() {
  const [submitted,  setSubmitted]  = useState(false);
  const [loading,    setLoading]    = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [alumni,     setAlumni]     = useState<AlumniProfile[]>([]);

  useEffect(() => {
    fetch("/api/alumni")
      .then((r) => r.json())
      .then((data) => setAlumni(Array.isArray(data) ? data : []))
      .catch(() => {});
  }, []);

  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  async function onSubmit(data: FormData) {
    setLoading(true);
    setSubmitError("");
    try {
      const res = await fetch("/api/alumni", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ ...data, graduationYear: Number(data.graduationYear) }),
      });
      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.error ?? "Registration failed");
      }
      setSubmitted(true);
      reset();
    } catch (err: any) {
      setSubmitError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-r from-school-blue to-primary-700 text-white py-24">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-school-gold font-semibold text-sm uppercase tracking-wider mb-3">Alumni</p>
          <h1 className="text-4xl md:text-5xl font-heading font-bold mb-6">Greenfield Alumni Network</h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            Graduates spanning four decades, leading in every sector across Kenya and beyond.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { Icon: GraduationCap, value: "5,000+", label: "Total Alumni" },
              { Icon: Globe,         value: "40+",    label: "Countries Worldwide" },
              { Icon: Calendar,      value: "1985",   label: "First Graduating Class" },
              { Icon: Users,         value: "Active", label: "Alumni Association" },
            ].map(({ Icon, value, label }) => (
              <div key={label} className="card p-6 text-center">
                <Icon className="w-10 h-10 text-school-blue mx-auto mb-3" />
                <p className="text-2xl font-bold text-school-gold">{value}</p>
                <p className="text-gray-500 text-sm">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Alumni profiles from DB */}
      {alumni.length > 0 && (
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-2xl font-heading font-bold text-school-blue">Our Alumni</h2>
              <p className="text-gray-500 text-sm mt-2">Verified Greenfield graduates making an impact.</p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {alumni.map((a) => (
                <div key={a.id} className="card p-6">
                  <div className="w-14 h-14 bg-gradient-to-br from-school-blue to-primary-600 rounded-full flex items-center justify-center mb-4">
                    <span className="text-white font-bold text-xl">
                      {a.user.name.split(" ")[0][0]}{a.user.name.split(" ")[1]?.[0] ?? ""}
                    </span>
                  </div>
                  <h3 className="font-semibold text-gray-900">{a.user.name}</h3>
                  <p className="text-school-blue text-xs font-medium mb-1">Class of {a.graduationYear}</p>
                  {a.currentJobTitle && (
                    <p className="text-gray-600 text-sm mb-1">{a.currentJobTitle}</p>
                  )}
                  {a.currentEmployer && (
                    <p className="text-gray-500 text-xs">{a.currentEmployer}</p>
                  )}
                  {a.location && (
                    <p className="text-gray-400 text-xs mt-1">{a.location}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Registration form */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-heading font-bold text-school-blue">Register as an Alumnus</h2>
            <p className="text-gray-500 text-sm mt-2">
              Join the alumni database to receive updates, connect with classmates, and give back to the school.
            </p>
          </div>

          {submitted ? (
            <div className="text-center py-12 bg-green-50 rounded-2xl border border-green-200">
              <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2">Registration Received!</h3>
              <p className="text-gray-500 text-sm">We'll verify your details and add you to the alumni directory soon.</p>
              <button onClick={() => setSubmitted(false)} className="mt-6 btn-outline text-sm">Register Another</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 bg-white border border-gray-200 rounded-2xl p-8">
              {submitError && (
                <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">
                  {submitError}
                </div>
              )}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="label">Full Name *</label>
                  <input {...register("name")} className="input" placeholder="e.g. Alice Kariuki" />
                  {errors.name && <p className="form-error">{errors.name.message}</p>}
                </div>
                <div>
                  <label className="label">Email Address *</label>
                  <input type="email" {...register("email")} className="input" placeholder="you@email.com" />
                  {errors.email && <p className="form-error">{errors.email.message}</p>}
                </div>
                <div>
                  <label className="label">Graduation Year *</label>
                  <input type="number" {...register("graduationYear")} className="input" placeholder="e.g. 2005" min="1985" max={new Date().getFullYear()} />
                  {errors.graduationYear && <p className="form-error">{errors.graduationYear.message}</p>}
                </div>
                <div>
                  <label className="label">Current Location</label>
                  <input {...register("location")} className="input" placeholder="e.g. Nairobi, Kenya" />
                </div>
                <div>
                  <label className="label">Current Job Title</label>
                  <input {...register("currentJobTitle")} className="input" placeholder="e.g. Software Engineer" />
                </div>
                <div>
                  <label className="label">Employer / Organisation</label>
                  <input {...register("currentEmployer")} className="input" placeholder="e.g. Google" />
                </div>
              </div>
              <div>
                <label className="label">LinkedIn Profile URL</label>
                <input {...register("linkedIn")} className="input" placeholder="https://linkedin.com/in/yourname" />
                {errors.linkedIn && <p className="form-error">{errors.linkedIn.message}</p>}
              </div>
              <div>
                <label className="label">Short Bio</label>
                <textarea {...register("bio")} rows={3} className="input resize-none" placeholder="Tell us about your journey since Greenfield…" />
              </div>
              <button type="submit" disabled={loading} className="btn-primary w-full justify-center">
                {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Submitting…</> : "Register as Alumni"}
              </button>
            </form>
          )}
        </div>
      </section>

      {/* Homecoming */}
      <section className="py-16 bg-school-blue text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <Calendar className="w-12 h-12 text-school-gold mx-auto mb-4" />
          <h2 className="text-2xl font-heading font-bold mb-3">Alumni Homecoming 2025</h2>
          <p className="text-blue-200 mb-6">
            Join fellow graduates on August 2, 2025 for a day of celebration, networking, and giving back to the school community.
          </p>
          <a href="mailto:alumni@greenfieldhs.ac" className="btn-secondary inline-flex">
            Express Interest
          </a>
        </div>
      </section>
    </>
  );
}
