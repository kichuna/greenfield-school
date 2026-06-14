import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | Greenfield High School",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-heading font-bold text-school-blue mb-2">Privacy Policy</h1>
        <p className="text-sm text-gray-400 mb-10">Last updated: January 2025</p>

        <div className="prose prose-gray max-w-none space-y-8 text-gray-700">
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">1. Information We Collect</h2>
            <p>We collect personal information you provide when submitting an admissions application, contacting us, or registering as an alumni. This includes names, email addresses, phone numbers, and academic records.</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">2. How We Use Your Information</h2>
            <p>Your information is used solely to process admissions, communicate school updates, manage alumni relations, and improve our services. We do not sell or share your data with third parties for commercial purposes.</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">3. Data Security</h2>
            <p>We implement appropriate technical and organisational measures to protect your personal data against unauthorised access, loss, or disclosure.</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">4. Your Rights</h2>
            <p>You have the right to access, correct, or request deletion of your personal data held by the school. To exercise these rights, contact us at <a href="mailto:info@greenfieldhs.ac" className="text-school-blue hover:underline">info@greenfieldhs.ac</a>.</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">5. Contact</h2>
            <p>For privacy-related queries, write to: <strong>Data Protection Officer, Greenfield High School, P.O. Box 1234, Nairobi, Kenya</strong>.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
