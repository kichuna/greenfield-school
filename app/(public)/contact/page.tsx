"use client";

import { useState } from "react";
import { MapPin, Phone, Mail, Clock, CheckCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const schema = z.object({
  name:    z.string().min(2, "Name is required"),
  email:   z.string().email("Valid email required"),
  phone:   z.string().optional(),
  subject: z.string().min(3, "Subject is required"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type FormData = z.infer<typeof schema>;

const info = [
  { Icon: MapPin, label: "Address",     value: "P.O. Box 1234-00100, Nairobi, Kenya\nGreenfield Road, Westlands" },
  { Icon: Phone,  label: "Phone",       value: "+254 700 000 000\n+254 720 000 000" },
  { Icon: Mail,   label: "Email",       value: "info@greenfieldhs.ac\nadmissions@greenfieldhs.ac" },
  { Icon: Clock,  label: "Office Hours",value: "Mon – Fri: 7:30 AM – 5:00 PM\nSat: 8:00 AM – 1:00 PM" },
];

const departments = [
  { name: "Admissions Office",    email: "admissions@greenfieldhs.ac", phone: "+254 700 000 001" },
  { name: "Academic Office",      email: "academics@greenfieldhs.ac",  phone: "+254 700 000 002" },
  { name: "Finance Office",       email: "finance@greenfieldhs.ac",    phone: "+254 700 000 003" },
  { name: "Alumni Relations",     email: "alumni@greenfieldhs.ac",     phone: "+254 700 000 004" },
];

export default function ContactPage() {
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  async function onSubmit(data: FormData) {
    setLoading(true);
    try {
      const res  = await fetch("/api/contact", {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data),
      });
      if ((await res.json()).success) { setSent(true); reset(); }
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-r from-school-blue to-primary-700 text-white py-24">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-school-gold font-semibold text-sm uppercase tracking-wider mb-3">Get in Touch</p>
          <h1 className="text-4xl md:text-5xl font-heading font-bold mb-6">Contact Us</h1>
          <p className="text-xl text-blue-100 max-w-xl mx-auto">
            We'd love to hear from you. Reach out to any of our departments or send a general inquiry.
          </p>
        </div>
      </section>

      {/* Contact Cards */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {info.map(({ Icon, label, value }) => (
              <div key={label} className="card p-6 text-center">
                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Icon className="w-6 h-6 text-school-blue" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2 text-sm">{label}</h3>
                <p className="text-gray-500 text-sm whitespace-pre-line">{value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Form + Map */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16">
            {/* Form */}
            <div>
              <h2 className="text-2xl font-heading font-bold text-school-blue mb-8">Send Us a Message</h2>
              {sent ? (
                <div className="text-center py-12 bg-green-50 rounded-2xl border border-green-200">
                  <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                  <h3 className="font-semibold text-gray-900 mb-2">Message Sent!</h3>
                  <p className="text-gray-500 text-sm">We'll get back to you within 24 hours.</p>
                  <button onClick={() => setSent(false)} className="mt-6 btn-outline text-sm">Send Another</button>
                </div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="label">Full Name *</label>
                      <input {...register("name")} className="input" placeholder="John Doe" />
                      {errors.name && <p className="form-error">{errors.name.message}</p>}
                    </div>
                    <div>
                      <label className="label">Email Address *</label>
                      <input type="email" {...register("email")} className="input" placeholder="you@email.com" />
                      {errors.email && <p className="form-error">{errors.email.message}</p>}
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="label">Phone Number</label>
                      <input {...register("phone")} className="input" placeholder="+254 7XX XXX XXX" />
                    </div>
                    <div>
                      <label className="label">Subject *</label>
                      <input {...register("subject")} className="input" placeholder="e.g. Admission inquiry" />
                      {errors.subject && <p className="form-error">{errors.subject.message}</p>}
                    </div>
                  </div>
                  <div>
                    <label className="label">Message *</label>
                    <textarea {...register("message")} rows={5} className="input resize-none" placeholder="Your message…" />
                    {errors.message && <p className="form-error">{errors.message.message}</p>}
                  </div>
                  <button type="submit" disabled={loading} className="btn-primary w-full justify-center">
                    {loading ? "Sending…" : "Send Message"}
                  </button>
                </form>
              )}
            </div>

            {/* Map placeholder + departments */}
            <div className="space-y-8">
              <div className="bg-gray-100 rounded-2xl h-72 flex items-center justify-center">
                <div className="text-center text-gray-400">
                  <MapPin className="w-12 h-12 mx-auto mb-2 opacity-30" />
                  <p className="text-sm">Map — Embed Google Maps here</p>
                  <p className="text-xs mt-1">Greenfield Road, Westlands, Nairobi</p>
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-4">Department Contacts</h3>
                <div className="space-y-3">
                  {departments.map(({ name, email, phone }) => (
                    <div key={name} className="card p-4">
                      <p className="font-medium text-sm text-gray-900 mb-1">{name}</p>
                      <p className="text-xs text-gray-500">{email} &nbsp;·&nbsp; {phone}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
