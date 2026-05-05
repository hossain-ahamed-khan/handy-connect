"use client";
export default function LeadCard() {
  return (
    <>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');`}</style>

      <div className="min-h-screen bg-white flex items-center justify-center px-8 py-16" style={{ fontFamily: "'Inter', sans-serif" }}>
        <div className="max-w-4xl w-full flex flex-col md:flex-row items-center gap-12">

          {/* Left side */}
          <div className="flex-1">
            {/* Badge */}
            <div className="inline-flex items-center gap-1.5 bg-green-500 text-white text-xs font-semibold px-3 py-1.5 rounded-full mb-5">
              <span className="w-1.5 h-1.5 bg-white rounded-full" />
              New Verified Lead
            </div>

            {/* Headline */}
            <h1 className="text-4xl font-black text-gray-900 leading-tight mb-4">
              A homeowner in Brooklyn needs a Plumber ASAP.
            </h1>

            {/* Description */}
            <p className="text-gray-500 text-sm leading-relaxed mb-6">
              This lead was verified 5 minutes ago. The customer is actively looking to hire someone today. Unlock the details to contact them directly.
            </p>

            {/* Trust points */}
            <ul className="space-y-3">
              {[
                "Phone number verified",
                "High intent to hire (AI Scored)",
                "Exclusive lead (Max 3 pros)",
              ].map((item) => (
                <li key={item} className="flex items-center gap-3 text-sm text-gray-700">
                  {/* Shield check icon */}
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M10 2L3 5v5c0 4.418 3.134 8.555 7 9.95C13.866 18.555 17 14.418 17 10V5L10 2z" fill="#22c55e" fillOpacity="0.15" stroke="#22c55e" strokeWidth="1.5" strokeLinejoin="round"/>
                    <path d="M7 10l2 2 4-4" stroke="#22c55e" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Right side — Card */}
          <div className="flex-1 w-full">
            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden" style={{ maxWidth: 400, margin: "0 auto" }}>
              <div className="p-5">

                {/* Card header */}
                <div className="flex items-start justify-between mb-3">
                  <h2 className="text-base font-bold text-gray-900">Emergency Pipe Leak</h2>
                  <span className="text-xs font-medium text-red-400 bg-red-50 px-2.5 py-1 rounded-full">Emergency</span>
                </div>

                {/* Meta */}
                <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
                  <span className="flex items-center gap-1">
                    <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
                      <path d="M8 1.5A4.5 4.5 0 0 1 12.5 6c0 3-4.5 8.5-4.5 8.5S3.5 9 3.5 6A4.5 4.5 0 0 1 8 1.5z" stroke="#6b7280" strokeWidth="1.3"/>
                      <circle cx="8" cy="6" r="1.5" stroke="#6b7280" strokeWidth="1.3"/>
                    </svg>
                    Brooklyn, NY 11201
                  </span>
                  <span className="flex items-center gap-1">
                    <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
                      <circle cx="8" cy="8" r="6" stroke="#6b7280" strokeWidth="1.3"/>
                      <path d="M8 5v3l2 2" stroke="#6b7280" strokeWidth="1.3" strokeLinecap="round"/>
                    </svg>
                    ASAP
                  </span>
                </div>

                {/* Customer Description */}
                <p className="text-xs font-semibold text-gray-700 mb-2">Customer Description:</p>
                <div className="border border-gray-200 rounded-xl p-3.5 mb-3">
                  <p className="text-xs text-gray-600 leading-relaxed">
                    &quot;The pipe under my kitchen sink burst and is leaking rapidly. I&apos;ve shut off the main valve but I need someone to fix it today. It looks like the P-trap is completely cracked.&quot;
                  </p>
                </div>

                {/* Locked details */}
                <div className="bg-gray-50 border border-gray-200 rounded-xl flex flex-col items-center justify-center py-6 mb-4">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" className="mb-2">
                    <rect x="5" y="11" width="14" height="10" rx="2" stroke="#9ca3af" strokeWidth="1.5"/>
                    <path d="M8 11V7a4 4 0 0 1 8 0v4" stroke="#9ca3af" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                  <p className="text-sm text-gray-500 font-medium">Customer Details Locked</p>
                </div>

                {/* Pricing */}
                <div className="flex items-end justify-between mb-4">
                  <div>
                    <p className="text-xs text-gray-400 mb-0.5">Lead Price</p>
                    <p className="text-2xl font-bold text-gray-900">€15.00</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-400 mb-0.5">Estimated Job Value</p>
                    <p className="text-lg font-bold text-green-500">€150 – €250</p>
                  </div>
                </div>

                {/* CTA */}
                <button className="w-full bg-yellow-400 hover:bg-yellow-500 text-white font-semibold text-sm py-3.5 rounded-xl transition-colors mb-2">
                  Unlock Lead Now
                </button>

                {/* Warning */}
                <p className="text-center text-xs text-gray-400 flex items-center justify-center gap-1">
                  <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
                    <path d="M8 2L1.5 13.5h13L8 2z" stroke="#d1d5db" strokeWidth="1.3" strokeLinejoin="round"/>
                    <path d="M8 7v3" stroke="#d1d5db" strokeWidth="1.3" strokeLinecap="round"/>
                    <circle cx="8" cy="11.5" r="0.5" fill="#d1d5db"/>
                  </svg>
                  Only 1 spot remaining for this lead
                </p>

              </div>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}