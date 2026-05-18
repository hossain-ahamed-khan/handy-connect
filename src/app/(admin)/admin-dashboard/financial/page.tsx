"use client";
import { useState } from "react";
import { useGetFinancialStatsQuery, useGetFinancialTransactionsQuery, useGetFinancialPendingPayoutsQuery } from "@/redux/features/admin/financial/financialApi";

// ─── Types ────────────────────────────────────────────────────────────────────

interface FinancialStats {
    total_revenue: number;
    total_leads: number;
    pending_payouts: number;
    completed_payouts: number;
    currency: string;
}

interface Transaction {
    job_id: string;
    amount: string;
    date: string;
    status: string;
    type: string;
    user_name: string | null;
    user_email: string;
}

interface TransactionsResponse {
    count: number;
    next: string | null;
    previous: string | null;
    results: Transaction[];
}

interface PendingPayout {
    full_name: string;
    email: string;
    amount: string;
}

interface PendingPayoutsResponse {
    count: number;
    next: string | null;
    previous: string | null;
    results: PendingPayout[];
}

// ─── Icons ────────────────────────────────────────────────────────────────────

const ArrowUpIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="w-4 h-4">
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" />
    </svg>
);

const ArrowDownIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="w-4 h-4">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
    </svg>
);

const TrendUpIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
    </svg>
);

const CardIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5">
        <rect x="2" y="5" width="20" height="14" rx="2" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M2 10h20" />
    </svg>
);

const ExportIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
    </svg>
);

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatAmount(amount: number | string, currency: string): string {
    const num = typeof amount === "string" ? parseFloat(amount) : amount;
    if (num >= 1000) return `${currency}${(num / 1000).toFixed(1)}K`;
    return `${currency}${num.toFixed(0)}`;
}

function isCredit(type: string): boolean {
    // "payout" going out is a debit; anything incoming (e.g. "priority service") is credit
    return type !== "payout";
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

const Skeleton = ({ className }: { className?: string }) => (
    <div className={`animate-pulse bg-gray-200 rounded ${className}`} />
);

// ─── Component ────────────────────────────────────────────────────────────────

export default function FinancialPanel() {
    const [hoveredRow, setHoveredRow] = useState<string | null>(null);

    const {
        data: stats,
        isLoading: statsLoading,
        isError: statsError,
    } = useGetFinancialStatsQuery<{ data: FinancialStats; isLoading: boolean; isError: boolean }>(undefined);

    const {
        data: transactionsData,
        isLoading: txLoading,
        isError: txError,
    } = useGetFinancialTransactionsQuery<{ data: TransactionsResponse; isLoading: boolean; isError: boolean }>(undefined);

    const {
        data: payoutsData,
        isLoading: payoutsLoading,
        isError: payoutsError,
    } = useGetFinancialPendingPayoutsQuery<{ data: PendingPayoutsResponse; isLoading: boolean; isError: boolean }>(undefined);

    const currency = stats?.currency ?? "₪";
    const transactions = transactionsData?.results ?? [];
    const pendingPayouts = payoutsData?.results ?? [];

    return (
        <div className="min-h-screen p-6 font-sans">
            <div className="w-full">
                {/* Title */}
                <h1 className="text-xl font-bold text-gray-900 mb-5">Financial Panel</h1>

                {/* Stats Cards */}
                <div className="grid grid-cols-4 gap-4 mb-5">
                    {/* Total Revenue */}
                    <div className="bg-amber-400 rounded-2xl p-5 flex items-start justify-between">
                        <div>
                            <p className="text-amber-700 text-xs font-medium mb-2">Total Revenue</p>
                            {statsLoading ? (
                                <Skeleton className="h-8 w-24 bg-amber-300" />
                            ) : statsError ? (
                                <p className="text-white text-2xl font-bold">—</p>
                            ) : (
                                <p className="text-white text-2xl font-bold">
                                    {formatAmount(stats!.total_revenue, currency)}
                                </p>
                            )}
                        </div>
                        <div className="text-white mt-1">
                            <TrendUpIcon />
                        </div>
                    </div>

                    {/* Total Leads */}
                    <div className="bg-white rounded-2xl p-5 flex items-start justify-between shadow-sm">
                        <div>
                            <p className="text-gray-400 text-xs font-medium mb-2">Total Leads</p>
                            {statsLoading ? (
                                <Skeleton className="h-8 w-16" />
                            ) : statsError ? (
                                <p className="text-green-500 text-2xl font-bold">—</p>
                            ) : (
                                <p className="text-green-500 text-2xl font-bold">
                                    {stats!.total_leads.toLocaleString()}
                                </p>
                            )}
                        </div>
                        <div className="text-green-500 mt-1">
                            <TrendUpIcon />
                        </div>
                    </div>

                    {/* Pending Payouts */}
                    <div className="bg-white rounded-2xl p-5 flex items-start justify-between shadow-sm">
                        <div>
                            <p className="text-gray-400 text-xs font-medium mb-2">Pending Payouts</p>
                            {statsLoading ? (
                                <Skeleton className="h-8 w-20" />
                            ) : statsError ? (
                                <p className="text-amber-500 text-2xl font-bold">—</p>
                            ) : (
                                <p className="text-amber-500 text-2xl font-bold">
                                    {formatAmount(stats!.pending_payouts, currency)}
                                </p>
                            )}
                        </div>
                        <div className="text-amber-500 mt-1">
                            <CardIcon />
                        </div>
                    </div>

                    {/* Completed Payouts */}
                    <div className="bg-white rounded-2xl p-5 flex items-start justify-between shadow-sm">
                        <div>
                            <p className="text-gray-400 text-xs font-medium mb-2">Completed Payouts</p>
                            {statsLoading ? (
                                <Skeleton className="h-8 w-20" />
                            ) : statsError ? (
                                <p className="text-gray-900 text-2xl font-bold">—</p>
                            ) : (
                                <p className="text-gray-900 text-2xl font-bold">
                                    {formatAmount(stats!.completed_payouts, currency)}
                                </p>
                            )}
                        </div>
                        <div className="text-gray-400 mt-1">
                            <ArrowUpIcon />
                        </div>
                    </div>
                </div>

                {/* Bottom Section */}
                <div className="grid grid-cols-3 gap-4">
                    {/* Transaction History */}
                    <div className="col-span-2 bg-white rounded-2xl p-5 shadow-sm">
                        <div className="flex items-center justify-between mb-5">
                            <h2 className="text-sm font-bold text-gray-900">Transaction History</h2>
                            <button className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-700 transition-colors">
                                <ExportIcon />
                                Export
                            </button>
                        </div>

                        {txLoading ? (
                            <div className="space-y-3">
                                {Array.from({ length: 5 }).map((_, i) => (
                                    <div key={i} className="flex items-center justify-between py-2 px-2">
                                        <div className="flex items-center gap-3">
                                            <Skeleton className="w-9 h-9 rounded-full" />
                                            <div className="space-y-1.5">
                                                <Skeleton className="h-3 w-24" />
                                                <Skeleton className="h-3 w-32" />
                                            </div>
                                        </div>
                                        <div className="space-y-1.5 text-right">
                                            <Skeleton className="h-3 w-12 ml-auto" />
                                            <Skeleton className="h-3 w-16 ml-auto" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : txError ? (
                            <p className="text-xs text-red-400 text-center py-6">Failed to load transactions.</p>
                        ) : transactions.length === 0 ? (
                            <p className="text-xs text-gray-400 text-center py-6">No transactions found.</p>
                        ) : (
                            <div className="space-y-1">
                                {transactions.map((tx) => {
                                    const credit = isCredit(tx.type);
                                    const displayName = tx.user_name ?? tx.user_email;
                                    return (
                                        <div
                                            key={`${tx.job_id}-${tx.date}-${tx.type}-${tx.user_email}`}
                                            className={`flex items-center justify-between py-3 px-2 rounded-xl transition-colors cursor-pointer ${hoveredRow === tx.job_id ? "bg-gray-50" : ""
                                                }`}
                                            onMouseEnter={() => setHoveredRow(tx.job_id)}
                                            onMouseLeave={() => setHoveredRow(null)}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div
                                                    className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${credit ? "bg-blue-50 text-blue-400" : "bg-red-50 text-red-400"
                                                        }`}
                                                >
                                                    {credit ? <ArrowUpIcon /> : <ArrowDownIcon />}
                                                </div>
                                                <div>
                                                    <p className="text-xs font-medium text-gray-800 capitalize">{tx.type}</p>
                                                    <p className="text-xs text-gray-400">{displayName}</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className={`text-xs font-semibold ${credit ? "text-green-500" : "text-red-500"}`}>
                                                    {credit ? "+" : "-"}{currency}{parseFloat(tx.amount).toFixed(2)}
                                                </p>
                                                <p className="text-xs text-gray-400">{tx.date}</p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {/* Pending Payouts */}
                    <div className="bg-white rounded-2xl p-5 shadow-sm">
                        <div className="flex items-center justify-between mb-5">
                            <h2 className="text-sm font-bold text-gray-900">Pending Payouts</h2>
                            <span className="bg-amber-400 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                                {payoutsLoading ? "·" : (payoutsData?.count ?? 0)}
                            </span>
                        </div>

                        {payoutsLoading ? (
                            <div className="space-y-5">
                                {Array.from({ length: 3 }).map((_, i) => (
                                    <div key={i}>
                                        <div className="flex items-start justify-between">
                                            <div className="space-y-1.5">
                                                <Skeleton className="h-4 w-28" />
                                                <Skeleton className="h-3 w-36" />
                                            </div>
                                            <div className="space-y-1.5 text-right">
                                                <Skeleton className="h-4 w-16 ml-auto" />
                                                <Skeleton className="h-3 w-12 ml-auto" />
                                            </div>
                                        </div>
                                        {i < 2 && <div className="border-b border-gray-100 mt-5" />}
                                    </div>
                                ))}
                            </div>
                        ) : payoutsError ? (
                            <p className="text-xs text-red-400 text-center py-6">Failed to load payouts.</p>
                        ) : pendingPayouts.length === 0 ? (
                            <p className="text-xs text-gray-400 text-center py-6">No pending payouts.</p>
                        ) : (
                            <div className="space-y-5">
                                {pendingPayouts.map((p, i) => (
                                    <div key={p.email}>
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <p className="text-sm font-semibold text-gray-900">{p.full_name}</p>
                                                <p className="text-xs text-gray-400 mt-0.5">{p.email}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-sm font-bold text-amber-500">
                                                    {currency}{parseFloat(p.amount).toFixed(2)}
                                                </p>
                                                <button className="text-xs text-blue-500 hover:text-blue-700 transition-colors mt-0.5">
                                                    Process
                                                </button>
                                            </div>
                                        </div>
                                        {i < pendingPayouts.length - 1 && (
                                            <div className="border-b border-gray-100 mt-5" />
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}