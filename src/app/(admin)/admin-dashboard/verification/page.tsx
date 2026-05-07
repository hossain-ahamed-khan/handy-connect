"use client";
import { useState } from "react";

interface Applicant {
    id: number;
    initials: string;
    color: string;
    name: string;
    email: string;
    phone: string;
    category: string;
    categoryColor: string;
    serviceAreas: string[];
    submitted: string;
    certCount: number;
}

const applicants: Applicant[] = [
    {
        id: 1,
        initials: "AG",
        color: "bg-red-500",
        name: "Avi Goldstein",
        email: "avi@example.com",
        phone: "050-1112233",
        category: "Plumbing",
        categoryColor: "bg-blue-100 text-blue-700",
        serviceAreas: ["Tel Aviv", "Ramat Gan"],
        submitted: "12/21/2025",
        certCount: 2,
    },
    {
        id: 2,
        initials: "MS",
        color: "bg-orange-400",
        name: "Miri Shapira",
        email: "miri@example.com",
        phone: "050-2223344",
        category: "Cleaning",
        categoryColor: "bg-green-100 text-green-700",
        serviceAreas: ["Jerusalem", "Beit Shemesh"],
        submitted: "12/20/2025",
        certCount: 1,
    },
];

function IdDocumentPlaceholder() {
    return (
        <div className="w-full h-32 rounded-lg overflow-hidden border border-gray-200 bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center relative">
            <div className="absolute inset-0 flex flex-col justify-between p-3">
                <div className="flex justify-between items-start">
                    <div className="flex flex-col gap-1">
                        <div className="h-2 w-16 bg-blue-300 rounded opacity-60" />
                        <div className="h-1.5 w-10 bg-blue-200 rounded opacity-50" />
                    </div>
                    <div className="w-8 h-8 rounded bg-blue-200 opacity-40" />
                </div>
                <div className="flex gap-2 items-end">
                    <div className="w-10 h-12 bg-blue-200 rounded opacity-50 flex items-center justify-center">
                        <svg className="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <div className="flex flex-col gap-1 flex-1">
                        <div className="h-1.5 w-full bg-blue-300 rounded opacity-40" />
                        <div className="h-1.5 w-3/4 bg-blue-200 rounded opacity-40" />
                        <div className="h-1.5 w-1/2 bg-blue-200 rounded opacity-40" />
                    </div>
                </div>
            </div>
            <span className="absolute bottom-1 right-2 text-blue-300 text-xs font-mono opacity-50">Sample</span>
        </div>
    );
}

function CertPlaceholder({ index }: { index: number }) {
    const colors = [
        { bg: "from-orange-50 to-orange-100", accent: "bg-orange-300", text: "text-orange-400" },
        { bg: "from-blue-50 to-indigo-100", accent: "bg-indigo-300", text: "text-indigo-400" },
        { bg: "from-teal-50 to-teal-100", accent: "bg-teal-300", text: "text-teal-400" },
    ];
    const c = colors[index % colors.length];
    return (
        <div
            className={`w-full h-24 rounded-md overflow-hidden border border-gray-200 bg-gradient-to-br ${c.bg} flex flex-col items-center justify-center gap-1 p-2`}
        >
            <div className={`h-1.5 w-3/4 ${c.accent} rounded opacity-60`} />
            <div className={`h-2 w-1/2 ${c.accent} rounded opacity-80`} />
            <div className={`h-1 w-2/3 ${c.accent} rounded opacity-40`} />
            <div className={`h-1 w-1/2 ${c.accent} rounded opacity-40`} />
            <svg className={`w-4 h-4 ${c.text} mt-1 opacity-60`} fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
            </svg>
        </div>
    );
}

function ApplicantCard({ applicant, onApprove, onReject }: {
    applicant: Applicant;
    onApprove: (id: number) => void;
    onReject: (id: number) => void;
}) {
    return (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 flex flex-col gap-4">
            <div className="flex gap-6">
                {/* Left: Applicant Info */}
                <div className="w-52 shrink-0 flex flex-col gap-3">
                    <div className="flex items-center gap-3">
                        <div
                            className={`w-10 h-10 rounded-full ${applicant.color} flex items-center justify-center text-white font-semibold text-sm shrink-0`}
                        >
                            {applicant.initials}
                        </div>
                        <div>
                            <div className="font-semibold text-gray-900 text-sm">{applicant.name}</div>
                            <div className="text-gray-500 text-xs">{applicant.email}</div>
                            <div className="text-gray-500 text-xs">{applicant.phone}</div>
                        </div>
                    </div>

                    <div>
                        <div className="text-xs text-gray-400 font-medium mb-1">Categories</div>
                        <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium ${applicant.categoryColor}`}>
                            {applicant.category === "Plumbing" ? "🔧" : "✓"} {applicant.category}
                        </span>
                    </div>

                    <div>
                        <div className="text-xs text-gray-400 font-medium mb-1">Service Areas</div>
                        <div className="flex flex-wrap gap-1">
                            {applicant.serviceAreas.map((area) => (
                                <span key={area} className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full">
                                    {area}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="text-xs text-gray-400">
                        <span className="font-medium">Submitted: </span>{applicant.submitted}
                    </div>
                </div>

                {/* Middle: ID Document */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium mb-2">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                        </svg>
                        ID Document
                    </div>
                    <IdDocumentPlaceholder />
                </div>

                {/* Right: Certificates */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium mb-2">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Certificates ({applicant.certCount})
                    </div>
                    <div className={`grid gap-2 ${applicant.certCount > 1 ? "grid-cols-2" : "grid-cols-1"}`}>
                        {Array.from({ length: applicant.certCount }).map((_, i) => (
                            <CertPlaceholder key={i} index={i} />
                        ))}
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-2 pt-1 border-t border-gray-100">
                <button
                    onClick={() => onReject(applicant.id)}
                    className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Reject
                </button>
                <button
                    onClick={() => onApprove(applicant.id)}
                    className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-green-500 rounded-lg hover:bg-green-600 transition-colors"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Approve
                </button>
            </div>
        </div>
    );
}

export default function ProfessionalVerification() {
    const [items, setItems] = useState(applicants);

    const handleApprove = (id: number) => setItems((prev) => prev.filter((a) => a.id !== id));
    const handleReject = (id: number) => setItems((prev) => prev.filter((a) => a.id !== id));

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="w-full">
                <div className="flex items-center justify-between mb-4">
                    <h1 className="text-xl font-bold text-gray-900">Professional Verification</h1>
                    {items.length > 0 && (
                        <span className="text-xs font-semibold text-yellow-700 bg-yellow-100 border border-yellow-200 px-2.5 py-1 rounded-full">
                            {items.length} Pending
                        </span>
                    )}
                </div>

                {items.length > 0 ? (
                    <>
                        <p className="text-sm text-gray-500 mb-4">{items.length} pending verification{items.length !== 1 ? "s" : ""}</p>
                        <div className="flex flex-col gap-4">
                            {items.map((applicant) => (
                                <ApplicantCard
                                    key={applicant.id}
                                    applicant={applicant}
                                    onApprove={handleApprove}
                                    onReject={handleReject}
                                />
                            ))}
                        </div>
                    </>
                ) : (
                    <div className="text-center py-16 text-gray-400">
                        <svg className="w-10 h-10 mx-auto mb-3 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="text-sm font-medium">All verifications handled</p>
                    </div>
                )}
            </div>
        </div>
    );
}