"use client";
import { useState } from "react";

type AiDiagnosisPrice = {
    max: number;
    min: number;
    currency: string;
};

export type AiDiagnosisData = {
    detected_issue: string;
    description: string;
    severity: string;
    est_price: AiDiagnosisPrice;
    formatted_price: string;
    professional: string;
};

export type AiDiagnosisResponse = {
    is_finished: boolean;
    status: string;
    message: string;
    retry_after_seconds: number | null;
    data: AiDiagnosisData | null;
    error: string | null;
};

const CheckCircleIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="11" stroke="#D4A017" strokeWidth="2" />
        <path d="M7 12l3.5 3.5L17 9" stroke="#D4A017" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const HeartIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
            d="M12 21C12 21 3 14.5 3 8.5C3 5.42 5.42 3 8.5 3C10.24 3 11.91 3.81 13 5.08C14.09 3.81 15.76 3 17.5 3C20.58 3 23 5.42 23 8.5C23 14.5 12 21 12 21Z"
            stroke="#4CAF8E"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);

const WarningIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
            d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
            stroke="#D4A017"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <line x1="12" y1="9" x2="12" y2="13" stroke="#D4A017" strokeWidth="2" strokeLinecap="round" />
        <line x1="12" y1="17" x2="12.01" y2="17" stroke="#D4A017" strokeWidth="2" strokeLinecap="round" />
    </svg>
);

type AIDiagnosisProps = {
    result?: AiDiagnosisResponse | null;
    isLoading?: boolean;
    onBack?: () => void;
};

export default function AIDiagnosis({ result, isLoading, onBack }: AIDiagnosisProps) {
    const [sent, setSent] = useState(false);
    const data = result?.data ?? null;
    const showLoading = isLoading || !data;

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
            <div className="w-full max-w-2xl bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                {/* Header */}
                <div className="p-6 pb-0">
                    <div className="flex items-center gap-2 mb-6">
                        <CheckCircleIcon />
                        <span className="text-base font-semibold text-gray-800">AI Diagnosis</span>
                    </div>

                    {/* Detected Issue Card */}
                    <div className="border border-gray-200 rounded-xl p-5 mb-5">
                        <div className="flex items-start justify-between mb-3">
                            <span className="text-xs text-gray-400 font-medium">Detected Issue</span>
                            <span className="bg-red-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
                                {data?.severity || "Analyzing"}
                            </span>
                        </div>
                        <h2 className="text-lg font-bold text-gray-900 mb-5">
                            {data?.detected_issue || "Analyzing issue"}
                        </h2>

                        <hr className="border-gray-100 mb-5" />

                        <div className="mb-5">
                            <p className="text-sm font-semibold text-gray-800 mb-1">Suggested Cause</p>
                            <p className="text-sm text-gray-500 leading-relaxed">
                                {data?.description || "Reviewing details from your request."}
                            </p>
                        </div>

                        <div className="flex gap-8 mt-6">
                            <div>
                                <p className="text-xs text-gray-400 mb-1">Est. Price</p>
                                <p className="text-base font-bold text-green-600">
                                    {data?.formatted_price || "Calculating"}
                                </p>
                            </div>
                            <div className="w-px bg-gray-100" />
                            <div>
                                <p className="text-xs text-gray-400 mb-1">Professional</p>
                                <p className="text-base font-bold text-gray-900">
                                    {data?.professional || "Matching"}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Info Cards */}
                <div className="px-6 space-y-3 mb-6">
                    {/* Fairness notice */}
                    <div className="border border-gray-200 rounded-xl p-4 flex items-start gap-3">
                        <div className="mt-0.5 shrink-0">
                            <HeartIcon />
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-gray-800">To be fair to everybody:</p>
                            <p className="text-sm text-gray-500">
                                Tradesman are very busy. Please only send an application if you are serious.
                            </p>
                        </div>
                    </div>

                    {/* Disclaimer */}
                    <div className="border border-gray-200 rounded-xl p-4 flex items-start gap-3">
                        <div className="mt-0.5 shrink-0">
                            <WarningIcon />
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-gray-800">AI Price Estimate Disclaimer</p>
                            <p className="text-sm text-gray-500">
                                This is an AI-generated estimate and may not be accurate. Final pricing will be determined by the
                                professional after inspection.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="border-t border-gray-100 flex">
                    <button
                        className="flex-1 py-4 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors border-r border-gray-100"
                        onClick={onBack}
                    >
                        Back
                    </button>
                    <button
                        onClick={() => setSent(true)}
                        className="flex-1 py-4 text-sm font-semibold text-white transition-colors"
                        style={{ backgroundColor: sent ? "#b07d10" : "#E8A020" }}
                        disabled={showLoading}
                    >
                        {showLoading ? "Analyzing..." : sent ? "Offer Sent!" : "Send an offer"}
                    </button>
                </div>
            </div>
        </div>
    );
}