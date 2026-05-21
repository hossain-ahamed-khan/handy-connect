"use client";
import { useState } from "react";
import {
    useGetPendingVerificationsQuery,
    useApproveVerificationMutation,
    useRejectVerificationMutation,
} from "@/redux/features/admin/pendingVerifications/pendingVerificationsApi"; // adjust import path
import Image from "next/image";
import { toast } from "sonner";

interface Verification {
    id: number;
    user: number;
    full_name: string | null;
    email: string;
    onboarding_status: "APPROVED" | "REJECTED" | "UNDER_REVIEW" | string;
    is_verified: boolean;
    is_approved: boolean;
    government_id: string | null;
    professional_certificate: string | null;
    profile_photo: string | null;
}

function getInitials(name: string | null, email: string): string {
    if (name) {
        return name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2);
    }
    return email.slice(0, 2).toUpperCase();
}

const AVATAR_COLORS = [
    "bg-red-500",
    "bg-orange-400",
    "bg-blue-500",
    "bg-purple-500",
    "bg-teal-500",
    "bg-pink-500",
];

function getAvatarColor(id: number): string {
    return AVATAR_COLORS[id % AVATAR_COLORS.length];
}

function StatusBadge({ status }: { status: string }) {
    const map: Record<string, string> = {
        APPROVED: "bg-green-100 text-green-700",
        REJECTED: "bg-red-100 text-red-700",
        UNDER_REVIEW: "bg-yellow-100 text-yellow-700",
    };
    const label: Record<string, string> = {
        APPROVED: "Approved",
        REJECTED: "Rejected",
        UNDER_REVIEW: "Under Review",
    };
    return (
        <span
            className={`inline-flex items-center text-xs px-2 py-0.5 rounded-full font-medium ${map[status] ?? "bg-gray-100 text-gray-600"
                }`}
        >
            {label[status] ?? status}
        </span>
    );
}

function IdDocumentSection({ url }: { url: string | null }) {
    if (url) {
        return (
            <div className="w-full h-56 rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
                <Image
                    src={url}
                    alt="Government ID"
                    className="w-full h-full object-cover"
                    width={128}
                    height={128}
                />
            </div>
        );
    }

    return (
        <div className="w-full h-56 rounded-lg overflow-hidden border border-gray-200 bg-linear-to-br from-blue-50 to-blue-100 flex items-center justify-center relative">
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
            <span className="absolute bottom-1 right-2 text-blue-300 text-xs font-mono opacity-50">
                Not provided
            </span>
        </div>
    );
}

function CertSection({ url }: { url: string | null }) {
    if (url) {
        return (
            <div className="w-full h-56 rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
                <Image
                    src={url}
                    alt="Certificate"
                    className="w-full h-full object-cover"
                    width={128}
                    height={128}
                />
            </div>
        );
    }

    return (
        <div className="w-full h-56 rounded-lg overflow-hidden border border-gray-200 bg-linear-to-br from-orange-50 to-orange-100 flex flex-col items-center justify-center gap-1 p-2">
            <div className="h-1.5 w-3/4 bg-orange-300 rounded opacity-60" />
            <div className="h-2 w-1/2 bg-orange-300 rounded opacity-80" />
            <div className="h-1 w-2/3 bg-orange-300 rounded opacity-40" />
            <svg className="w-4 h-4 text-orange-400 mt-1 opacity-60" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
            </svg>
            <span className="text-orange-300 text-xs opacity-50">Not provided</span>
        </div>
    );
}

function ConfirmationModal({
    open,
    title,
    description,
    confirmLabel,
    onCancel,
    onConfirm,
    isLoading,
}: {
    open: boolean;
    title: string;
    description: string;
    confirmLabel: string;
    onCancel: () => void;
    onConfirm: () => void;
    isLoading: boolean;
}) {
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={onCancel}>
            <div
                className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
                onClick={(event) => event.stopPropagation()}
            >
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-amber-50">
                    <svg className="h-6 w-6 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 9v2m0 4h.01M10.29 3.86l-7.17 12.4A1.5 1.5 0 004.41 19h15.18a1.5 1.5 0 001.29-2.24l-7.17-12.4a1.5 1.5 0 00-2.42 0z"
                        />
                    </svg>
                </div>
                <h3 className="text-center text-lg font-semibold text-gray-900">{title}</h3>
                <p className="mt-2 text-center text-sm text-gray-500">{description}</p>

                <div className="mt-6 flex items-center justify-end gap-2">
                    <button
                        type="button"
                        onClick={onCancel}
                        disabled={isLoading}
                        className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={onConfirm}
                        disabled={isLoading}
                        className="px-4 py-2 text-sm font-semibold text-white bg-amber-500 rounded-lg hover:bg-amber-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                    >
                        {confirmLabel}
                    </button>
                </div>
            </div>
        </div>
    );
}

function VerificationCard({
    verification,
    onApprove,
    onReject,
    isLoading,
}: {
    verification: Verification;
    onApprove: (id: number, displayName: string) => void;
    onReject: (id: number, displayName: string) => void;
    isLoading: boolean;
}) {
    const initials = getInitials(verification.full_name, verification.email);
    const avatarColor = getAvatarColor(verification.id);
    const displayName = verification.full_name ?? verification.email.split("@")[0];

    const isApproved = verification.onboarding_status === "APPROVED";

    return (
        <div
            className={`bg-white rounded-2xl border shadow-sm p-6 flex flex-col gap-5 transition-shadow hover:shadow-md ${isApproved ? "border-green-300 ring-1 ring-green-100" : "border-gray-200"}`}
        >
            <div className="flex gap-6">
                {/* Left: Info */}
                <div className="w-52 shrink-0 flex flex-col gap-8">
                    <div className="flex items-center gap-3">
                        <div className="relative shrink-0">
                            {verification.profile_photo ? (
                                <Image
                                    src={verification.profile_photo}
                                    alt={displayName}
                                    className="w-10 h-10 rounded-full object-cover"
                                    width={40}
                                    height={40}
                                />
                            ) : (
                                <div
                                    className={`w-10 h-10 rounded-full ${avatarColor} flex items-center justify-center text-white font-semibold text-sm`}
                                >
                                    {initials}
                                </div>
                            )}
                        </div>
                        <div>
                            <div className="font-semibold text-gray-900 text-sm">{displayName}</div>
                            <div className="text-gray-500 text-xs">{verification.email}</div>
                        </div>
                    </div>

                    <div>
                        <div className="text-xs text-gray-400 font-medium mb-1">Status</div>
                        <StatusBadge status={verification.onboarding_status} />
                    </div>

                    <div className="flex flex-col gap-1">
                        <div className="text-xs text-gray-400 font-medium">Flags</div>
                        <div className="flex flex-wrap gap-1">
                            <span
                                className={`text-xs px-2 py-0.5 rounded-full font-medium ${verification.is_verified
                                    ? "bg-green-100 text-green-700"
                                    : "bg-gray-100 text-gray-500"
                                    }`}
                            >
                                {verification.is_verified ? "✓ Verified" : "✗ Unverified"}
                            </span>
                            <span
                                className={`text-xs px-2 py-0.5 rounded-full font-medium ${verification.is_approved
                                    ? "bg-blue-100 text-blue-700"
                                    : "bg-gray-100 text-gray-500"
                                    }`}
                            >
                                {verification.is_approved ? "✓ Approved" : "✗ Unapproved"}
                            </span>
                        </div>
                    </div>

                    <div className="text-xs text-gray-400">
                        <span className="font-medium">User ID: </span>
                        <span className="font-mono">{verification.user}</span>
                    </div>
                </div>

                {/* Middle: ID Document */}
                <div className="flex-1 min-w-0 max-w-[320px] self-center ml-24">
                    <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium mb-2">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                        </svg>
                        ID Document
                    </div>
                    <IdDocumentSection url={verification.government_id} />
                </div>

                {/* Right: Certificate */}
                <div className="flex-1 min-w-0 max-w-[320px] self-center ml-12">
                    <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium mb-2">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Certificate
                    </div>
                    <CertSection url={verification.professional_certificate} />
                </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-2 pt-1 border-t border-gray-100">
                <button
                    onClick={() => onReject(verification.id, displayName)}
                    disabled={isLoading}
                    className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Reject
                </button>
                <button
                    onClick={() => onApprove(verification.id, displayName)}
                    disabled={isLoading}
                    className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-green-500 rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
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
    const { data, isLoading, isError, refetch } = useGetPendingVerificationsQuery(undefined);
    const [approveVerification, { isLoading: isApproving }] = useApproveVerificationMutation();
    const [rejectVerification, { isLoading: isRejecting }] = useRejectVerificationMutation();
    const [confirmState, setConfirmState] = useState<{
        id: number;
        action: "approve" | "reject";
        name: string;
    } | null>(null);

    const isMutating = isApproving || isRejecting;

    const handleApprove = (id: number, name: string) => {
        setConfirmState({ id, action: "approve", name });
    };

    const handleReject = (id: number, name: string) => {
        setConfirmState({ id, action: "reject", name });
    };

    const handleConfirm = async () => {
        if (!confirmState) return;
        try {
            if (confirmState.action === "approve") {
                await approveVerification(confirmState.id).unwrap();
                toast.success("Verification approved.");
            } else {
                await rejectVerification(confirmState.id).unwrap();
                toast.success("Verification rejected.");
            }
            await refetch();
        } catch {
            if (confirmState.action === "approve") {
                toast.error("Failed to approve verification.");
            } else {
                toast.error("Failed to reject verification.");
            }
        } finally {
            setConfirmState(null);
        }
    };

    const verifications: Verification[] = (data?.results ?? []).filter(
        (verification: Verification) => verification.onboarding_status !== "APPROVED"
    );

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="w-full">
                <div className="flex items-center justify-between mb-4">
                    <h1 className="text-xl font-bold text-gray-900">Professional Verification</h1>
                    {!isLoading && !isError && verifications.length > 0 && (
                        <span className="text-xs font-semibold text-yellow-700 bg-yellow-100 border border-yellow-200 px-2.5 py-1 rounded-full">
                            {verifications.length} Pending
                        </span>
                    )}
                </div>

                {isLoading ? (
                    <div className="flex flex-col gap-4">
                        {[1, 2].map((i) => (
                            <div
                                key={i}
                                className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 h-64 animate-pulse"
                            >
                                <div className="flex gap-6 h-full">
                                    <div className="w-52 flex flex-col gap-3">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-gray-200" />
                                            <div className="flex flex-col gap-1.5 flex-1">
                                                <div className="h-3 bg-gray-200 rounded w-3/4" />
                                                <div className="h-2.5 bg-gray-100 rounded w-full" />
                                            </div>
                                        </div>
                                        <div className="h-2 bg-gray-100 rounded w-1/2" />
                                        <div className="h-5 bg-gray-200 rounded-full w-24" />
                                    </div>
                                    <div className="flex-1 bg-gray-100 rounded-lg" />
                                    <div className="flex-1 bg-gray-100 rounded-lg" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : isError ? (
                    <div className="text-center py-16 text-red-400">
                        <svg className="w-10 h-10 mx-auto mb-3 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="text-sm font-medium">Failed to load verifications</p>
                    </div>
                ) : verifications.length > 0 ? (
                    <>
                        <p className="text-sm text-gray-500 mb-4">
                            {verifications.length} pending verification{verifications.length !== 1 ? "s" : ""}
                        </p>
                        <div className="flex flex-col gap-4">
                            {verifications.map((v) => (
                                <VerificationCard
                                    key={v.id}
                                    verification={v}
                                    onApprove={handleApprove}
                                    onReject={handleReject}
                                    isLoading={isMutating}
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
            <ConfirmationModal
                open={!!confirmState}
                title={confirmState?.action === "reject" ? "Reject verification?" : "Approve verification?"}
                description={
                    confirmState
                        ? `You are about to ${confirmState.action} ${confirmState.name}'s verification. This action cannot be undone.`
                        : ""
                }
                confirmLabel={confirmState?.action === "reject" ? "Yes, reject" : "Yes, approve"}
                onCancel={() => setConfirmState(null)}
                onConfirm={handleConfirm}
                isLoading={isMutating}
            />
        </div>
    );
}