import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Use | Greenfield High School",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-heading font-bold text-school-blue mb-2">Terms of Use</h1>
        <p className="text-sm text-gray-400 mb-10">Last updated: January 2025</p>

        <div className="prose prose-gray max-w-none space-y-8 text-gray-700">
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">1. Acceptance of Terms</h2>
            <p>By accessing and using the Greenfield High School website, you accept and agree to be bound by these Terms of Use. If you do not agree, please discontinue use of this site.</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">2. Use of Content</h2>
            <p>All content on this website — including text, images, logos, and documents — is the property of Greenfield High School and is protected by applicable copyright laws. You may not reproduce or distribute any content without prior written consent.</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">3. Admissions Applications</h2>
            <p>Information submitted via the online admissions form must be accurate and truthful. Submission of false information may result in disqualification of an application or cancellation of enrolment.</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">4. Limitation of Liability</h2>
            <p>Greenfield High School is not liable for any loss or damage arising from use of this website or reliance on any information provided herein. The school reserves the right to modify content at any time without notice.</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">5. Changes to Terms</h2>
            <p>We may update these Terms from time to time. Continued use of the website after changes are posted constitutes acceptance of the revised Terms.</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">6. Contact</h2>
            <p>Questions about these Terms? Email us at <a href="mailto:info@greenfieldhs.ac" className="text-school-blue hover:underline">info@greenfieldhs.ac</a>.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
