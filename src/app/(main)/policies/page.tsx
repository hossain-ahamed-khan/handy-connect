"use client";
import { useState } from "react";

function PolicySection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-8">
      <h2 className="text-lg font-bold text-gray-900 mb-3">{title}</h2>
      <div className="text-sm text-gray-600 leading-relaxed">{children}</div>
    </div>
  );
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="mt-3 space-y-1.5">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-2.5 text-sm text-gray-600">
          <span className="mt-2 w-1.5 h-1.5 rounded-full bg-gray-500 flex-shrink-0" />
          {item}
        </li>
      ))}
    </ul>
  );
}

export default function PlatformPolicies() {
  const [activeTab, setActiveTab] = useState<"customer" | "provider">("customer");

  return (
    <>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');`}</style>

      <div className="min-h-screen bg-white" style={{ fontFamily: "'Inter', sans-serif" }}>
        <div className="max-w-2xl mx-auto px-8 py-12">

          {/* Title */}
          <h1 className="text-2xl font-bold text-gray-900 text-center mb-6">
            Platform Policies
          </h1>

          {/* Tab switcher */}
          <div className="flex justify-center mb-10">
            <div className="flex bg-gray-100 rounded-xl p-1 gap-1">
              {(["customer", "provider"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-5 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    activeTab === tab
                      ? "bg-white text-gray-900 shadow-sm font-semibold"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {tab === "customer" ? "Customer Policy" : "Service Provider Policy"}
                </button>
              ))}
            </div>
          </div>

          {/* Customer Policy */}
          {activeTab === "customer" && (
            <div>
              <PolicySection title="1. User Account Responsibilities">
                <p>
                  As a customer on Handy Connect, you are responsible for maintaining the confidentiality
                  of your account credentials. You agree to provide accurate, current, and complete
                  information during the registration process and to update such information to keep it
                  accurate, current, and complete.
                </p>
              </PolicySection>

              <PolicySection title="2. Booking and Payments">
                <p>
                  When you book a service through our platform, you agree to pay the agreed-upon amount
                  for the completed service. All payments must be processed through the Handy Connect
                  platform to be eligible for our Satisfaction Guarantee.
                </p>
                <BulletList
                  items={[
                    "Payments made outside the platform violate our terms of service.",
                    "Funds are held securely until the job is marked as complete.",
                    "In case of disputes, funds remain in escrow until resolution.",
                  ]}
                />
              </PolicySection>

              <PolicySection title="3. Code of Conduct">
                <p>
                  Customers are expected to treat Service Providers with respect and provide a safe
                  working environment. Any form of harassment, discrimination, or abusive behavior will
                  result in immediate account termination.
                </p>
              </PolicySection>
            </div>
          )}

          {/* Service Provider Policy */}
          {activeTab === "provider" && (
            <div>
              <PolicySection title="1. Professional Standards">
                <p>
                  Service Providers must maintain all necessary licenses, insurance, and qualifications
                  required by local laws for their specific trade. You agree to perform all services with
                  a high degree of professionalism and in accordance with industry standards.
                </p>
              </PolicySection>

              <PolicySection title="2. Platform Fees and Payments">
                <p>
                  Handy Connect deducts a standard commission fee from the total job amount. By accepting
                  jobs on the platform, you agree to this fee structure.
                </p>
                <BulletList
                  items={[
                    "You may not solicit customers to pay outside the platform.",
                    "Payouts are processed within 2–3 business days after job completion.",
                    "You are responsible for your own taxes and reporting.",
                  ]}
                />
              </PolicySection>

              <PolicySection title="3. Communication & Reliability">
                <p>
                  Providers must maintain clear, professional communication with customers. Repeated
                  no-shows, late cancellations, or failure to respond to accepted jobs may result in
                  temporary suspension or permanent removal from the platform.
                </p>
              </PolicySection>
            </div>
          )}

        </div>
      </div>
    </>
  );
}