"use client";

import { useState, useEffect } from "react";
import {
  FileText, CheckCircle, Clock, Search,
  Download, ChevronDown, ChevronUp, AlertCircle, CalendarOff
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const schema = z.object({
  firstName:          z.string().min(2, "Required"),
  lastName:           z.string().min(2, "Required"),
  dateOfBirth:        z.string().min(1, "Required"),
  gender:             z.enum(["MALE", "FEMALE", "OTHER"], { required_error: "Required" }),
  nationality:        z.string().min(2, "Required"),
  gradeApplying:      z.string().min(1, "Required"),
  academicYear:       z.string().min(1, "Required"),
  parentName:         z.string().min(2, "Required"),
  parentEmail:        z.string().email("Invalid email"),
  parentPhone:        z.string().min(8, "Invalid phone"),
  parentRelationship: z.string().min(1, "Required"),
  address:            z.string().min(5, "Required"),
  previousSchool:     z.string().optional(),
  additionalInfo:     z.string().optional(),
});

type FormData = z.infer<typeof schema>;

const steps = [
  { n: 1, label: "Fill Application Form" },
  { n: 2, label: "Upload Documents" },
  { n: 3, label: "Submit & Get Reference" },
  { n: 4, label: "Track Status" },
];

const faqs = [
  {
    q: "When does Form One application close?",
    a: "Applications for Form One typically close at the end of November each year. Check the current academic calendar for exact dates.",
  },
  {
    q: "What documents are required?",
    a: "KCPE result slip, birth certificate, passport photos (2), National ID or passport of parent/guardian, and school leaving certificate from primary school.",
  },
  {
    q: "What is the fee structure?",
    a: "Download the current fee structure from the documents section below. Fees cover tuition, boarding (optional), meals, and activities.",
  },
  {
    q: "Is there a bursary or scholarship?",
    a: "Yes. Greenfield offers merit-based scholarships and need-based bursaries. Indicate your interest in the Additional Information field when applying.",
  },
];

export default function AdmissionsPage() {
  const [submitted,  setSubmitted]  = useState(false);
  const [admDocs,    setAdmDocs]    = useState<{ id: string; title: string; fileUrl: string; description: string | null }[]>([]);
  const [windowOpen,        setWindowOpen]        = useState(true);
  const [closedMessage,     setClosedMessage]     = useState("Admissions are currently closed. Please check back later.");
  const [admissionsYear,    setAdmissionsYear]    = useState("2025");
  const [windowLoaded,      setWindowLoaded]      = useState(false);

  useEffect(() => {
    fetch("/api/documents?category=ADMISSIONS")
      .then((r) => r.json())
      .then((data) => setAdmDocs(Array.isArray(data) ? data : []))
      .catch(() => {});

    fetch("/api/admissions/window")
      .then((r) => r.json())
      .then((d) => {
        setWindowOpen(d.isOpen ?? true);
        setClosedMessage(d.closedMessage || "Admissions are currently closed. Please check back later.");
        setAdmissionsYear(d.academicYear || "2025");
      })
      .catch(() => {})
      .finally(() => setWindowLoaded(true));
  }, []);

  const [refNumber,  setRefNumber]  = useState("");
  const [trackRef,   setTrackRef]   = useState("");
  const [trackResult, setTrackResult] = useState<any>(null);
  const [trackError,  setTrackError]  = useState("");
  const [openFaq,    setOpenFaq]    = useState<number | null>(null);
  const [loading,    setLoading]    = useState(false);

  const {
    register, handleSubmit, formState: { errors }, reset,
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  async function onSubmit(data: FormData) {
    setLoading(true);
    try {
      const res  = await fetch("/api/admissions", {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data),
      });
      const json = await res.json();
      if (json.success) {
        setRefNumber(json.data.referenceNumber);
        setSubmitted(true);
        reset();
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleTrack(e: React.FormEvent) {
    e.preventDefault();
    setTrackError("");
    setTrackResult(null);
    const res  = await fetch(`/api/admissions?ref=${trackRef}`);
    const json = await res.json();
    if (json.success) setTrackResult(json.data);
    else setTrackError("Application not found. Check your reference number.");
  }

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-r from-school-blue to-primary-700 text-white py-24">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-school-gold font-semibold text-sm uppercase tracking-wider mb-3">
            Admissions {admissionsYear}
          </p>
          <h1 className="text-4xl md:text-5xl font-heading font-bold mb-6">Join Greenfield High School</h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            {windowOpen
              ? "Start your journey to excellence. Apply online in minutes."
              : closedMessage}
          </p>
        </div>
      </section>

      {/* How to Apply */}
      <section id="how-to-apply" className="py-20 bg-gray-50 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="section-heading mx-auto">How to Apply</h2>
          </div>
          <div className="grid md:grid-cols-4 gap-6">
            {steps.map(({ n, label }) => (
              <div key={n} className="text-center">
                <div className="w-14 h-14 bg-school-blue text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  {n}
                </div>
                <p className="font-medium text-gray-800 text-sm">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Application Form */}
      <section id="form" className="py-20 bg-white scroll-mt-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <h2 className="section-heading mx-auto">Online Application Form</h2>
            {windowOpen && <p className="text-gray-500">All fields marked * are required.</p>}
          </div>

          {windowLoaded && !windowOpen ? (
            <div className="text-center py-16 bg-gray-50 rounded-2xl border border-gray-200">
              <CalendarOff className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-heading font-bold text-gray-700 mb-2">Admissions Closed</h3>
              <p className="text-gray-500 max-w-md mx-auto text-sm leading-relaxed">{closedMessage}</p>
            </div>
          ) : submitted ? (
            <div className="text-center py-16 bg-green-50 rounded-2xl border border-green-200">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-2xl font-heading font-bold text-gray-900 mb-2">Application Submitted!</h3>
              <p className="text-gray-600 mb-4">Your reference number is:</p>
              <div className="inline-block bg-white border-2 border-green-300 rounded-xl px-8 py-4 mb-6">
                <p className="text-3xl font-bold text-school-blue tracking-wider">{refNumber}</p>
              </div>
              <p className="text-gray-500 text-sm mb-6">Save this number to track your application status below.</p>
              <button onClick={() => setSubmitted(false)} className="btn-outline text-sm">
                Submit Another Application
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 bg-white border border-gray-200 rounded-2xl p-8">
              {/* Student Details */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-4 pb-2 border-b">Student Details</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="label">First Name *</label>
                    <input {...register("firstName")} className="input" placeholder="e.g. Alice" />
                    {errors.firstName && <p className="form-error">{errors.firstName.message}</p>}
                  </div>
                  <div>
                    <label className="label">Last Name *</label>
                    <input {...register("lastName")} className="input" placeholder="e.g. Mwangi" />
                    {errors.lastName && <p className="form-error">{errors.lastName.message}</p>}
                  </div>
                  <div>
                    <label className="label">Date of Birth *</label>
                    <input type="date" {...register("dateOfBirth")} className="input" />
                    {errors.dateOfBirth && <p className="form-error">{errors.dateOfBirth.message}</p>}
                  </div>
                  <div>
                    <label className="label">Gender *</label>
                    <select {...register("gender")} className="input">
                      <option value="">Select...</option>
                      <option value="MALE">Male</option>
                      <option value="FEMALE">Female</option>
                      <option value="OTHER">Other</option>
                    </select>
                    {errors.gender && <p className="form-error">{errors.gender.message}</p>}
                  </div>
                  <div>
                    <label className="label">Nationality *</label>
                    <input {...register("nationality")} className="input" placeholder="e.g. Kenyan" />
                    {errors.nationality && <p className="form-error">{errors.nationality.message}</p>}
                  </div>
                  <div>
                    <label className="label">Grade Applying For *</label>
                    <select {...register("gradeApplying")} className="input">
                      <option value="">Select grade...</option>
                      <option value="Form 1">Form 1</option>
                      <option value="Form 2">Form 2</option>
                      <option value="Form 3">Form 3</option>
                      <option value="Form 4">Form 4</option>
                    </select>
                    {errors.gradeApplying && <p className="form-error">{errors.gradeApplying.message}</p>}
                  </div>
                  <div>
                    <label className="label">Academic Year *</label>
                    <select {...register("academicYear")} className="input">
                      <option value="">Select year...</option>
                      <option value="2025/2026">2025/2026</option>
                      <option value="2026/2027">2026/2027</option>
                    </select>
                    {errors.academicYear && <p className="form-error">{errors.academicYear.message}</p>}
                  </div>
                  <div>
                    <label className="label">Previous School</label>
                    <input {...register("previousSchool")} className="input" placeholder="Name of primary school" />
                  </div>
                </div>
              </div>

              {/* Parent/Guardian */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-4 pb-2 border-b">Parent / Guardian Details</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="label">Full Name *</label>
                    <input {...register("parentName")} className="input" placeholder="Parent/Guardian name" />
                    {errors.parentName && <p className="form-error">{errors.parentName.message}</p>}
                  </div>
                  <div>
                    <label className="label">Relationship *</label>
                    <select {...register("parentRelationship")} className="input">
                      <option value="">Select...</option>
                      <option value="Father">Father</option>
                      <option value="Mother">Mother</option>
                      <option value="Guardian">Guardian</option>
                    </select>
                    {errors.parentRelationship && <p className="form-error">{errors.parentRelationship.message}</p>}
                  </div>
                  <div>
                    <label className="label">Email Address *</label>
                    <input type="email" {...register("parentEmail")} className="input" placeholder="parent@email.com" />
                    {errors.parentEmail && <p className="form-error">{errors.parentEmail.message}</p>}
                  </div>
                  <div>
                    <label className="label">Phone Number *</label>
                    <input {...register("parentPhone")} className="input" placeholder="+254 7XX XXX XXX" />
                    {errors.parentPhone && <p className="form-error">{errors.parentPhone.message}</p>}
                  </div>
                  <div className="md:col-span-2">
                    <label className="label">Home Address *</label>
                    <input {...register("address")} className="input" placeholder="Street, Town, County" />
                    {errors.address && <p className="form-error">{errors.address.message}</p>}
                  </div>
                </div>
              </div>

              {/* Additional Info */}
              <div>
                <label className="label">Additional Information</label>
                <textarea
                  {...register("additionalInfo")}
                  rows={4}
                  className="input resize-none"
                  placeholder="Any special needs, scholarship interest, or notes for the admissions team..."
                />
              </div>

              <button type="submit" disabled={loading} className="btn-primary w-full justify-center text-base py-3">
                {loading ? "Submitting…" : "Submit Application"}
              </button>
            </form>
          )}
        </div>
      </section>

      {/* Track Application */}
      <section id="track" className="py-20 bg-gray-50 scroll-mt-20">
        <div className="max-w-xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-heading font-bold text-school-blue">Track Your Application</h2>
            <p className="text-gray-500 text-sm mt-2">Enter your reference number to check your application status.</p>
          </div>
          <form onSubmit={handleTrack} className="flex gap-3">
            <input
              value={trackRef}
              onChange={(e) => setTrackRef(e.target.value)}
              className="input flex-1"
              placeholder="e.g. APP-2025-XYZ123"
            />
            <button type="submit" className="btn-primary gap-2 px-5">
              <Search className="w-4 h-4" /> Track
            </button>
          </form>
          {trackError && (
            <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-4 flex gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
              <p className="text-red-700 text-sm">{trackError}</p>
            </div>
          )}
          {trackResult && (
            <div className="mt-4 bg-white border border-gray-200 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <Clock className="w-5 h-5 text-school-blue" />
                <span className="font-semibold text-gray-900">Application Found</span>
              </div>
              <dl className="space-y-2 text-sm">
                {[
                  ["Reference",  trackResult.referenceNumber],
                  ["Name",       `${trackResult.firstName} ${trackResult.lastName}`],
                  ["Status",     trackResult.status],
                  ["Submitted",  new Date(trackResult.createdAt).toLocaleDateString()],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between">
                    <dt className="text-gray-500">{k}</dt>
                    <dd className="font-medium text-gray-900">{v}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}
        </div>
      </section>

      {/* Downloads */}
      <section id="documents" className="py-20 bg-white scroll-mt-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-heading font-bold text-school-blue">Documents & Downloads</h2>
          </div>
          <div className="grid gap-4">
            {admDocs.length === 0 ? (
              <p className="text-center text-gray-400 py-8 text-sm">No documents available yet. Check back soon.</p>
            ) : (
              admDocs.map((doc) => (
                <div key={doc.id} className="card flex items-center justify-between p-4">
                  <div className="flex items-center gap-4">
                    <FileText className="w-8 h-8 text-school-blue shrink-0" />
                    <div>
                      <p className="font-medium text-gray-900 text-sm">{doc.title}</p>
                      {doc.description && (
                        <p className="text-gray-400 text-xs mt-0.5">{doc.description}</p>
                      )}
                    </div>
                  </div>
                  <a
                    href={`/api/documents/${doc.id}/download`}
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

      {/* FAQ */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-heading font-bold text-school-blue">Frequently Asked Questions</h2>
          </div>
          <div className="space-y-3">
            {faqs.map(({ q, a }, i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-100">
                <button
                  className="w-full flex items-center justify-between p-5 text-left"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  <span className="font-medium text-gray-900 text-sm pr-4">{q}</span>
                  {openFaq === i ? <ChevronUp className="w-5 h-5 text-gray-400 shrink-0" /> : <ChevronDown className="w-5 h-5 text-gray-400 shrink-0" />}
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-5">
                    <p className="text-gray-600 text-sm leading-relaxed">{a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
