"use client";
import { useState } from "react";
import { useGetProviderListQuery } from "@/redux/features/customer/providerList/providerListApi";
import { useSendOfferMutation } from "@/redux/features/customer/sendOffer/sendOfferApi";
import Image from "next/image";

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

type Provider = {
    id: number;
    full_name: string;
    category_name: string;
    profile_photo: string | null;
    zip_code: string | null;
    is_verified: boolean;
    rating: string;
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
    requestId?: number | null;
    onBack?: () => void;
};

export default function AIDiagnosis({ result, isLoading, requestId, onBack }: AIDiagnosisProps) {
    const [isOfferModalOpen, setIsOfferModalOpen] = useState(false);
    const [showProviderList, setShowProviderList] = useState(false);
    const [activeProviderId, setActiveProviderId] = useState<number | null>(null);
    const [sentOfferProviderIds, setSentOfferProviderIds] = useState<number[]>([]);
    const [offerMessage, setOfferMessage] = useState<string | null>(null);
    const data = result?.data ?? null;
    const showLoading = isLoading || !data;
    const shouldLoadProviders = isOfferModalOpen && showProviderList;

    const {
        data: providerList,
        isFetching: isProviderLoading,
        isError: isProviderError,
        refetch: refetchProviders,
    } = useGetProviderListQuery(undefined, { skip: !shouldLoadProviders });

    const [sendOffer, { isLoading: isSendingOffer }] = useSendOfferMutation();

    const handleSendOffer = async (providerId: number) => {
        if (!requestId) {
            setOfferMessage("Request is not ready yet. Please try again in a moment.");
            return;
        }

        if (sentOfferProviderIds.includes(providerId)) {
            setOfferMessage("Offer already sent to this professional.");
            return;
        }

        setActiveProviderId(providerId);
        setOfferMessage(null);

        try {
            const response = await sendOffer({
                requestId,
                formData: { direct_hire_provider_id: providerId },
            }).unwrap();

            const message = typeof response?.message === "string" ? response.message : "Offer sent.";
            setOfferMessage(message);
            setSentOfferProviderIds((prev) => [...prev, providerId]);
        } catch {
            setOfferMessage("Failed to send offer. Please try again.");
        } finally {
            setActiveProviderId(null);
        }
    };

    return (
        <div className="bg-gray-50 flex justify-center p-6">
            <div className="w-full bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
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
                        className="flex-1 py-4 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors border-r border-gray-100 cursor-pointer"
                        onClick={onBack}
                    >
                        Back
                    </button>
                    <button
                        onClick={() => {
                            if (showLoading) return;
                            setIsOfferModalOpen(true);
                            setShowProviderList(false);
                            setOfferMessage(null);
                        }}
                        className="flex-1 py-4 text-sm font-semibold text-white transition-colors bg-[#F59E0B] cursor-pointer"
                        disabled={showLoading}
                    >
                        {showLoading ? "Analyzing..." : "Send an offer"}
                    </button>
                </div>
            </div>

            {isOfferModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
                    <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
                        {!showProviderList ? (
                            <>
                                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-amber-50">
                                    <span className="text-xl text-amber-600">⚡</span>
                                </div>
                                <h3 className="text-center text-lg font-semibold text-gray-900">Direct Hire a Professional</h3>
                                <p className="mt-2 text-center text-sm text-gray-500">
                                    Don&#39;t want to wait? Browse verified professionals in your area and hire instantly — fast, trusted,
                                    and fee-free.
                                </p>

                                <div className="mt-5 rounded-2xl border border-gray-200 bg-gray-50 p-4 text-sm text-gray-700">
                                    <div className="flex items-start gap-3">
                                        <span className="mt-0.5 text-amber-500">✓</span>
                                        <span>Instant access to nearby professionals</span>
                                    </div>
                                    <div className="mt-3 flex items-start gap-3">
                                        <span className="mt-0.5 text-amber-500">✓</span>
                                        <span>All providers are verified &amp; trusted</span>
                                    </div>
                                    <div className="mt-3 flex items-start gap-3">
                                        <span className="mt-0.5 text-amber-500">✓</span>
                                        <span>Skip the wait — hire on your schedule</span>
                                    </div>
                                </div>

                                <button
                                    className="mt-6 w-full rounded-xl bg-[#F59E0B] py-3 text-sm font-semibold text-white hover:bg-[#F59E0B]/90 transition-colors cursor-pointer"
                                    type="button"
                                    onClick={() => setShowProviderList(true)}
                                >
                                    Find Professional Now
                                </button>
                                <button
                                    className="mt-6 w-full text-sm font-medium text-gray-500 hover:text-gray-800 transition-colors cursor-pointer"
                                    type="button"
                                    onClick={() => setIsOfferModalOpen(false)}
                                >
                                    Maybe Later
                                </button>
                            </>
                        ) : (
                            <>
                                <h3 className="text-center text-lg font-semibold text-gray-900">Available Professionals</h3>
                                <p className="mt-2 text-center text-sm text-gray-500">
                                    Choose a professional and send a direct hire offer.
                                </p>

                                {offerMessage && (
                                    <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-700">
                                        {offerMessage}
                                    </div>
                                )}

                                <div className="mt-5 space-y-3">
                                    {isProviderLoading && (
                                        <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4 text-sm text-gray-500">
                                            Loading professionals...
                                        </div>
                                    )}
                                    {isProviderError && !isProviderLoading && (
                                        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
                                            Failed to load professionals.
                                            <button
                                                type="button"
                                                className="ml-2 font-semibold text-red-700 underline"
                                                onClick={() => refetchProviders()}
                                            >
                                                Retry
                                            </button>
                                        </div>
                                    )}

                                    {Array.isArray(providerList) && providerList.length === 0 && !isProviderLoading && !isProviderError && (
                                        <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4 text-sm text-gray-500">
                                            No professionals found at the moment.
                                        </div>
                                    )}

                                    {Array.isArray(providerList) &&
                                        providerList.map((provider: Provider) => (
                                            <div
                                                key={provider.id}
                                                className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className="h-11 w-11 overflow-hidden rounded-full border border-gray-100 bg-gray-100">
                                                        {provider.profile_photo ? (
                                                            <Image
                                                                src={provider.profile_photo}
                                                                alt={provider.full_name}
                                                                width={44}
                                                                height={44}
                                                                className="h-full w-full object-cover"
                                                            />
                                                        ) : (
                                                            <div className="flex h-full w-full items-center justify-center text-sm font-semibold text-gray-500">
                                                                {provider.full_name?.[0] ?? "P"}
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className="text-sm font-semibold text-gray-900">
                                                            {provider.full_name}
                                                        </p>
                                                        <p className="text-xs text-gray-500">
                                                            {provider.category_name} · Rating {provider.rating}
                                                        </p>
                                                    </div>
                                                    {provider.is_verified && (
                                                        <span className="rounded-full bg-emerald-50 px-2 py-1 text-[10px] font-semibold text-emerald-600">
                                                            Verified
                                                        </span>
                                                    )}
                                                </div>
                                                <button
                                                    type="button"
                                                    className="mt-4 w-full rounded-xl bg-[#F59E0B] py-2.5 text-xs font-semibold text-white hover:bg-[#F59E0B]/90 transition-colors cursor-pointer"
                                                    onClick={() => handleSendOffer(provider.id)}
                                                    disabled={
                                                        (isSendingOffer && activeProviderId === provider.id) ||
                                                        sentOfferProviderIds.includes(provider.id)
                                                    }
                                                >
                                                    {sentOfferProviderIds.includes(provider.id)
                                                        ? "Offer Sent"
                                                        : isSendingOffer && activeProviderId === provider.id
                                                            ? "Sending offer..."
                                                            : "Send Direct Offer"}
                                                </button>
                                            </div>
                                        ))}
                                </div>

                                <button
                                    className="mt-6 w-full text-sm font-medium text-gray-500 hover:text-gray-800 transition-colors cursor-pointer"
                                    type="button"
                                    onClick={() => setIsOfferModalOpen(false)}
                                >
                                    Close
                                </button>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}