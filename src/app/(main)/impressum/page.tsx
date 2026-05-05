"use client";
import { useState } from "react";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-7">
      <h2 className="text-sm font-bold text-gray-900 mb-2.5">{title}</h2>
      <div className="text-sm text-gray-600 leading-relaxed space-y-0.5">{children}</div>
    </div>
  );
}

function GdprSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-6">
      <h2 className="text-sm font-bold text-gray-900 mb-2.5">{title}</h2>
      {children}
    </div>
  );
}

export default function ImpressumGDPR() {
  const [activeTab, setActiveTab] = useState<"impressum" | "gdpr">("impressum");

  return (
    <>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');`}</style>

      <div className="min-h-screen bg-white" style={{ fontFamily: "'Inter', sans-serif" }}>
        <div className="max-w-2xl mx-auto px-12 py-10">

          {/* Tab switcher */}
          <div className="flex gap-6 border-b border-gray-200 mb-8">
            {(["impressum", "gdpr"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-3 text-sm font-semibold border-b-2 -mb-px transition-colors ${
                  activeTab === tab
                    ? "border-gray-900 text-gray-900"
                    : "border-transparent text-gray-400 hover:text-gray-600"
                }`}
              >
                {tab === "impressum" ? "Impressum" : "GDPR"}
              </button>
            ))}
          </div>

          {/* IMPRESSUM */}
          {activeTab === "impressum" && (
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-8">Impressum &amp; GDPR</h1>

              <Section title="Information according to § 5 TMG">
                <p>Handy Connect GmbH</p>
                <p>Musterstraße 123</p>
                <p>10115 Berlin</p>
                <p>Germany</p>
              </Section>

              <Section title="Represented by">
                <p>CEO: Jane Doe</p>
                <p>Managing Director: John Smith</p>
              </Section>

              <Section title="Contact">
                <p>Phone: +49 (0) 30 12345678</p>
                <p>
                  Email:{" "}
                  <a
                    href="mailto:contact@handyconnect.example.com"
                    className="text-gray-600 hover:text-gray-900"
                  >
                    contact@handyconnect.example.com
                  </a>
                </p>
              </Section>

              <Section title="Register Entry">
                <p>Entry in the Handelsregister.</p>
                <p>Registering court: Amtsgericht Berlin (Charlottenburg)</p>
                <p>Registration number: HRB 123456 B</p>
              </Section>

              <Section title="VAT ID">
                <p>Sales tax identification number according to § 27 a of the Sales Tax Law:</p>
                <p>DE 123 456 789</p>
              </Section>

              <div className="border-t border-gray-200 mt-8" />
            </div>
          )}

          {/* GDPR */}
          {activeTab === "gdpr" && (
            <div>
              <h1 className="text-xl font-bold text-gray-900 mb-5">
                GDPR Compliance &amp; Data Protection
              </h1>

              <p className="text-sm text-gray-600 leading-relaxed mb-7">
                We take the protection of your personal data very seriously. We treat your personal data
                confidentially and in accordance with the statutory data protection regulations (GDPR) and
                this privacy policy.
              </p>

              <GdprSection title="1. Data Collection on our Website">
                <p className="text-sm text-gray-600 leading-relaxed">
                  Who is responsible for data collection on this website? The data processing on this
                  website is carried out by the website operator. You can find their contact details in
                  the Impressum of this website.
                </p>
              </GdprSection>

              <GdprSection title="2. Your Rights">
                <p className="text-sm text-gray-600 leading-relaxed mb-4">
                  You have the right to receive information about the origin, recipient, and purpose of
                  your stored personal data free of charge at any time. You also have the right to
                  request the correction, blocking, or deletion of this data.
                </p>
                <ul className="space-y-2">
                  {[
                    "Right to Information (Art. 15 GDPR)",
                    "Right to Rectification (Art. 16 GDPR)",
                    "Right to Erasure (Art. 17 GDPR)",
                    "Right to Restriction of Processing (Art. 18 GDPR)",
                    "Right to Data Portability (Art. 20 GDPR)",
                  ].map((right) => (
                    <li key={right} className="flex items-start gap-2.5 text-sm text-gray-600">
                      <span className="mt-2 w-1.5 h-1.5 rounded-full bg-gray-500 flex-shrink-0" />
                      {right}
                    </li>
                  ))}
                </ul>
              </GdprSection>
            </div>
          )}

        </div>
      </div>
    </>
  );
}