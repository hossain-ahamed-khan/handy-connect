"use client";
import { useState } from "react";
import {
    useGetAllJobsQuery,
    useGetJobStatsQuery,
    useGetSpecificJobDetailsQuery,
    useCancelJobMutation,
} from "@/redux/features/admin/jobs/jobsApi"; // adjust import path as needed
import Image from "next/image";

// ─── Types ────────────────────────────────────────────────────────────────────

type JobStatus =
    | "PENDING"
    | "IN_PROGRESS"
    | "ON_THE_WAY"
    | "COMPLETED"
    | "AWAITING_PAYMENT"
    | "CANCELLED";

interface Job {
    id: number;
    customer_name: string;
    provider_name: string;
    category: string;
    status: JobStatus;
    status_display: string;
    date: string;
    amount: string;
}

interface JobDetails {
    id: number;
    customer_name: string;
    category: string;
    zip_code: string | null;
    date: string;
    description: string;
    customer_note: string;
    media: string[];
    bill_url: string | null;
    status: JobStatus;
    total_price: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const STATUS_STYLES: Record<JobStatus, string> = {
    COMPLETED: "bg-green-100 text-green-700",
    IN_PROGRESS: "bg-blue-100 text-blue-700",
    ON_THE_WAY: "bg-sky-100 text-sky-600",
    PENDING: "bg-yellow-100 text-yellow-700",
    AWAITING_PAYMENT: "bg-orange-100 text-orange-600",
    CANCELLED: "bg-gray-100 text-gray-500",
};

const CATEGORY_ICONS: Record<string, string> = {
    plumbing: "🔧",
    electrical: "⚡",
    ac: "❄️",
    cleaning: "🧹",
    carpentry: "🔨",
    painting: "🎨",
    cutting: "✂️",
};

function getCategoryIcon(category: string): string {
    return CATEGORY_ICONS[category.toLowerCase()] ?? "🛠️";
}

function StatusBadge({ status, display }: { status: JobStatus; display: string }) {
    const base = "px-2.5 py-0.5 rounded-full text-xs font-medium whitespace-nowrap";
    return (
        <span className={`${base} ${STATUS_STYLES[status] ?? "bg-gray-100 text-gray-500"}`}>
            {display}
        </span>
    );
}

// ─── Icons ────────────────────────────────────────────────────────────────────

function IconUser() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
        </svg>
    );
}

function IconTag() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" />
        </svg>
    );
}

function IconMapPin() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
        </svg>
    );
}

function IconCalendar() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
        </svg>
    );
}

function IconVideo() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" />
        </svg>
    );
}

function IconPhoto() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
        </svg>
    );
}

function IconDocument() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
        </svg>
    );
}

function IconDescription() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
        </svg>
    );
}

// ─── Job Details Modal ─────────────────────────────────────────────────────────

function JobDetailsModal({ jobId, onClose }: { jobId: number; onClose: () => void }) {
    const { data: details, isLoading, isError } = useGetSpecificJobDetailsQuery(jobId);

    const media = (details?.media ?? []) as string[];
    const videos = media.filter((m: string) => /\.(mp4|mov|avi|webm)$/i.test(m));
    const photos = media.filter((m: string) => /\.(jpg|jpeg|png|gif|webp)$/i.test(m));
    const photoPlaceholders = photos.length === 0 ? [1, 2] : [];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">

                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 shrink-0">
                    <div className="flex items-center gap-2">
                        <h2 className="text-sm font-semibold text-gray-800">Job Details</h2>
                        <span className="text-sm text-gray-400">—</span>
                        <span className="text-sm font-semibold text-gray-500">
                            {isLoading ? "…" : details ? `JOB-${details.id}` : ""}
                        </span>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-lg hover:bg-gray-100 cursor-pointer"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Body */}
                <div className="overflow-y-auto flex-1">
                    {isLoading && (
                        <div className="flex items-center justify-center py-16">
                            <div className="w-6 h-6 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
                        </div>
                    )}
                    {isError && (
                        <p className="text-sm text-red-500 text-center py-12">Failed to load job details.</p>
                    )}

                    {details && (
                        <div className="px-6 py-5 space-y-5">

                            {/* Meta row */}
                            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-gray-700">
                                <span className="flex items-center gap-1.5 text-gray-500">
                                    <IconUser />
                                    <span className="font-semibold text-gray-800">{details.customer_name}</span>
                                </span>
                                <span className="flex items-center gap-1.5 text-gray-500">
                                    <IconTag />
                                    <span>{details.category}</span>
                                </span>
                                {details.zip_code && (
                                    <span className="flex items-center gap-1.5 text-gray-500">
                                        <IconMapPin />
                                        <span>ZIP {details.zip_code}</span>
                                    </span>
                                )}
                                <span className="flex items-center gap-1.5 text-gray-500">
                                    <IconCalendar />
                                    <span>{details.date}</span>
                                </span>
                            </div>

                            {/* Description */}
                            {details.description && (
                                <div>
                                    <div className="flex items-center gap-1.5 text-sm font-medium text-gray-700 mb-2">
                                        <span className="text-amber-500"><IconDescription /></span>
                                        Submitted Description
                                    </div>
                                    <div className="bg-amber-50 border border-amber-100 rounded-xl px-4 py-3 text-sm text-gray-700 leading-relaxed">
                                        {details.description}
                                    </div>
                                </div>
                            )}

                            {/* Media row */}
                            <div className="grid grid-cols-2 gap-5">
                                {/* Videos */}
                                <div>
                                    <div className="flex items-center gap-1.5 text-sm font-medium text-gray-700 mb-2">
                                        <span className="text-amber-500"><IconVideo /></span>
                                        Job Videos
                                    </div>
                                    {videos.length > 0 ? (
                                        <div className="space-y-2">
                                            {videos.map((src, idx) => (
                                                <video
                                                    key={idx}
                                                    src={src}
                                                    controls
                                                    className="w-full rounded-xl bg-gray-900 aspect-video object-cover"
                                                />
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="rounded-xl bg-gray-900 aspect-video flex flex-col items-center justify-center gap-2">
                                            <div className="w-9 h-9 rounded-full bg-gray-700 flex items-center justify-center">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 9.563C9 9.252 9.252 9 9.563 9h4.874c.311 0 .563.252.563.563v4.874c0 .311-.252.563-.563.563H9.564A.562.562 0 019 14.437V9.564z" />
                                                </svg>
                                            </div>
                                            <span className="text-xs text-gray-500">No video uploaded</span>
                                        </div>
                                    )}
                                </div>

                                {/* Photos */}
                                <div>
                                    <div className="flex items-center gap-1.5 text-sm font-medium text-gray-700 mb-2">
                                        <span className="text-amber-500"><IconPhoto /></span>
                                        Photos
                                    </div>
                                    <div className="grid grid-cols-2 gap-2">
                                        {photos.map((src, idx) => (
                                            <Image
                                                key={idx}
                                                src={src}
                                                alt={`Photo ${idx + 1}`}
                                                className="w-full aspect-square object-cover rounded-xl bg-gray-100"
                                                width={400}
                                                height={400}
                                            />
                                        ))}
                                        {photoPlaceholders.map((n) => (
                                            <div
                                                key={n}
                                                className="w-full aspect-square rounded-xl bg-gray-100 flex items-center justify-center"
                                            >
                                                <span className="text-xs text-gray-400">Photo {n}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Documents & Notes */}
                            <div>
                                <div className="flex items-center gap-1.5 text-sm font-medium text-gray-700 mb-3">
                                    <span className="text-amber-500"><IconDocument /></span>
                                    Documents &amp; Notes
                                </div>
                                <div className="space-y-3">
                                    {details.customer_note ? (
                                        <div className="flex items-start gap-2 text-sm">
                                            <span className="text-gray-500 shrink-0 font-medium">Customer Note:</span>
                                            <span className="text-gray-700 italic">&quot;{details.customer_note}&quot;</span>
                                        </div>
                                    ) : null}
                                    {details.bill_url ? (
                                        <a
                                            href={details.bill_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-2 px-3 py-2 text-sm text-gray-600 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                                            </svg>
                                            invoice_prev.pdf
                                        </a>
                                    ) : null}
                                    {!details.customer_note && !details.bill_url && (
                                        <p className="text-sm text-gray-400">No documents or notes.</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-gray-100 flex justify-end shrink-0">
                    <button
                        onClick={onClose}
                        className="px-5 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors cursor-pointer"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}

// ─── Cancel Confirmation Modal ─────────────────────────────────────────────────

function CancelConfirmModal({
    jobId,
    onClose,
    onSuccess,
}: {
    jobId: number;
    onClose: () => void;
    onSuccess: () => void;
}) {
    const [cancelJob, { isLoading }] = useCancelJobMutation();

    const handleConfirm = async () => {
        try {
            await cancelJob(jobId).unwrap();
            onSuccess();
            onClose();
        } catch {
            // Handle error via toast/notification if needed
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden">
                <div className="flex flex-col items-center px-6 pt-7 pb-5 text-center">
                    <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                        </svg>
                    </div>
                    <h3 className="text-base font-semibold text-gray-900 mb-1">Cancel Job #{jobId}?</h3>
                    <p className="text-sm text-gray-500 leading-relaxed">
                        This action cannot be undone. The job will be permanently cancelled and all parties will be notified.
                    </p>
                </div>

                <div className="flex gap-3 px-6 pb-6">
                    <button
                        onClick={onClose}
                        disabled={isLoading}
                        className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors disabled:opacity-50 cursor-pointer"
                    >
                        Keep Job
                    </button>
                    <button
                        onClick={handleConfirm}
                        disabled={isLoading}
                        className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-red-500 rounded-xl hover:bg-red-600 transition-colors disabled:opacity-60 flex items-center justify-center gap-2 cursor-pointer"
                    >
                        {isLoading ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                Cancelling…
                            </>
                        ) : (
                            "Yes, Cancel"
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}

// ─── StatCard ──────────────────────────────────────────────────────────────────

function StatCard({
    label,
    value,
    loading,
    className,
}: {
    label: string;
    value?: string | number;
    loading?: boolean;
    className?: string;
}) {
    return (
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <p className="text-xs text-gray-400 mb-1">{label}</p>
            {loading ? (
                <div className="h-8 w-16 bg-gray-100 rounded animate-pulse" />
            ) : (
                <p className={`text-2xl font-semibold ${className}`}>{value ?? "—"}</p>
            )}
        </div>
    );
}

// ─── Main Component ────────────────────────────────────────────────────────────

export default function JobManagement() {
    const [search, setSearch] = useState("");
    const [viewJobId, setViewJobId] = useState<number | null>(null);
    const [cancelJobId, setCancelJobId] = useState<number | null>(null);

    const {
        data: jobsData,
        isLoading: jobsLoading,
        isError: jobsError,
        refetch,
    } = useGetAllJobsQuery(undefined);
    const { data: stats, isLoading: statsLoading } = useGetJobStatsQuery(undefined);

    const jobs: Job[] = jobsData?.results ?? [];

    const filtered = jobs.filter(
        (j) =>
            String(j.id).includes(search.toLowerCase()) ||
            j.customer_name.toLowerCase().includes(search.toLowerCase()) ||
            j.provider_name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="w-full">
                {/* Title */}
                <h1 className="text-xl font-semibold text-gray-900 mb-5">Job Management</h1>

                {/* Stats Cards */}
                <div className="grid grid-cols-4 gap-4 mb-5">
                    <StatCard label="Total Jobs" value={stats?.total_jobs} loading={statsLoading} className="text-gray-800" />
                    <StatCard label="Active" value={stats?.active_jobs} loading={statsLoading} className="text-yellow-500" />
                    <StatCard label="Completed" value={stats?.completed_jobs} loading={statsLoading} className="text-green-500" />
                    <StatCard
                        label="Revenue"
                        value={stats ? `₪${stats.total_revenue.toLocaleString()}` : undefined}
                        loading={statsLoading}
                        className="text-blue-600"
                    />
                </div>

                {/* Search */}
                <div className="relative mb-4">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔍</span>
                    <input
                        type="text"
                        placeholder="Search by ID, customer, or professional..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
                    />
                </div>

                {/* Table */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-gray-100">
                                <th className="text-left px-5 py-3 text-xs font-medium text-gray-500">Job ID</th>
                                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">Customer</th>
                                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">Professional</th>
                                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">Category</th>
                                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">Status</th>
                                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">Date</th>
                                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">Amount</th>
                                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {jobsLoading && (
                                <tr>
                                    <td colSpan={8} className="px-5 py-10 text-center">
                                        <div className="flex items-center justify-center gap-2 text-gray-400 text-sm">
                                            <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
                                            Loading jobs...
                                        </div>
                                    </td>
                                </tr>
                            )}
                            {jobsError && (
                                <tr>
                                    <td colSpan={8} className="px-5 py-10 text-center text-sm text-red-500">
                                        Failed to load jobs. Please try again.
                                    </td>
                                </tr>
                            )}
                            {!jobsLoading && !jobsError && filtered.length === 0 && (
                                <tr>
                                    <td colSpan={8} className="px-5 py-10 text-center text-sm text-gray-400">
                                        No jobs found.
                                    </td>
                                </tr>
                            )}
                            {filtered.map((job, i) => (
                                <tr
                                    key={job.id}
                                    className={`border-b border-gray-50 hover:bg-gray-50 transition-colors ${i === filtered.length - 1 ? "border-b-0" : ""}`}
                                >
                                    <td className="px-5 py-4">
                                        <span
                                            className="text-blue-500 font-medium cursor-pointer hover:underline"
                                            onClick={() => setViewJobId(job.id)}
                                        >
                                            #{job.id}
                                        </span>
                                    </td>
                                    <td className="px-4 py-4 text-gray-700">{job.customer_name}</td>
                                    <td className="px-4 py-4">
                                        {job.provider_name === "Not Assigned" ? (
                                            <span className="text-gray-400">Not Assigned</span>
                                        ) : (
                                            <span className="text-gray-700">{job.provider_name}</span>
                                        )}
                                    </td>
                                    <td className="px-4 py-4">
                                        <span className="flex items-center gap-1.5 text-gray-600 capitalize">
                                            <span className="text-base">{getCategoryIcon(job.category)}</span>
                                            {job.category}
                                        </span>
                                    </td>
                                    <td className="px-4 py-4">
                                        <StatusBadge status={job.status} display={job.status_display} />
                                    </td>
                                    <td className="px-4 py-4 text-gray-500">{job.date}</td>
                                    <td className="px-4 py-4 text-gray-700 font-medium">
                                        ₪{parseFloat(job.amount).toLocaleString()}
                                    </td>
                                    <td className="px-4 py-4">
                                        <div className="flex items-center gap-3">
                                            {/* View Details */}
                                            <button
                                                title="View Details"
                                                onClick={() => setViewJobId(job.id)}
                                                className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                </svg>
                                            </button>
                                            {/* Cancel Job */}
                                            <button
                                                title="Cancel Job"
                                                onClick={() => setCancelJobId(job.id)}
                                                disabled={job.status === "CANCELLED"}
                                                className="text-red-400 hover:text-red-600 transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                    <circle cx="12" cy="12" r="10" />
                                                    <path strokeLinecap="round" d="M4.93 4.93l14.14 14.14" />
                                                </svg>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* Footer */}
                    <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100">
                        <span className="text-xs text-gray-400">
                            Showing {filtered.length} of {jobs.length} jobs
                        </span>
                        <div className="flex gap-2">
                            <button className="px-4 py-1.5 text-sm border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer">
                                Previous
                            </button>
                            <button className="px-4 py-1.5 text-sm border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer">
                                Next
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Job Details Modal */}
            {viewJobId !== null && (
                <JobDetailsModal
                    jobId={viewJobId}
                    onClose={() => setViewJobId(null)}
                />
            )}

            {/* Cancel Confirmation Modal */}
            {cancelJobId !== null && (
                <CancelConfirmModal
                    jobId={cancelJobId}
                    onClose={() => setCancelJobId(null)}
                    onSuccess={() => refetch()}
                />
            )}
        </div>
    );
}