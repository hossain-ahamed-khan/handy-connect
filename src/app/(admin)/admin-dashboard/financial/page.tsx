"use client";
import { useState } from "react";

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

const transactions = [
    { id: 1, type: "priority service", name: "Sarah Cohen", amount: "+€30", date: "2024-02-15", isCredit: true },
    { id: 2, type: "priority service", name: "David Levy", amount: "+€30", date: "2024-02-15", isCredit: true },
    { id: 3, type: "priority service", name: "Rachel Green", amount: "+€30", date: "2024-02-14", isCredit: true },
    { id: 4, type: "refund", name: "JOB-1198", amount: "€30", date: "2024-02-14", isCredit: false },
    { id: 5, type: "refund", name: "JOB-1198", amount: "€30", date: "2024-02-14", isCredit: false },
    { id: 6, type: "priority service", name: "Amit Shapira", amount: "+€30", date: "2024-02-13", isCredit: true },
    { id: 7, type: "priority service", name: "Noa Ben-David", amount: "+€30", date: "2024-02-13", isCredit: true },
    { id: 8, type: "priority service", name: "Yossi Klein", amount: "+€30", date: "2024-02-12", isCredit: true },
];

const pendingPayouts = [
    { id: 1, name: "Dan Levy", date: "2024-02-14", amount: "$2500" },
    { id: 2, name: "Miri Shapira", date: "2024-02-14", amount: "$1800" },
    { id: 3, name: "Amit Levy", date: "2024-02-13", amount: "$3200" },
];

export default function FinancialPanel() {
    const [hoveredRow, setHoveredRow] = useState<number | null>(null);

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
                            <p className="text-white text-2xl font-bold">$ 1245K</p>
                        </div>
                        <div className="text-white mt-1">
                            <TrendUpIcon />
                        </div>
                    </div>

                    {/* Total Leads */}
                    <div className="bg-white rounded-2xl p-5 flex items-start justify-between shadow-sm">
                        <div>
                            <p className="text-gray-400 text-xs font-medium mb-2">Total Leads</p>
                            <p className="text-green-500 text-2xl font-bold">12500</p>
                        </div>
                        <div className="text-green-500 mt-1">
                            <TrendUpIcon />
                        </div>
                    </div>

                    {/* Pending Payouts */}
                    <div className="bg-white rounded-2xl p-5 flex items-start justify-between shadow-sm">
                        <div>
                            <p className="text-gray-400 text-xs font-medium mb-2">Pending Payouts</p>
                            <p className="text-amber-500 text-2xl font-bold">$ 45.6K</p>
                        </div>
                        <div className="text-amber-500 mt-1">
                            <CardIcon />
                        </div>
                    </div>

                    {/* Completed Payouts */}
                    <div className="bg-white rounded-2xl p-5 flex items-start justify-between shadow-sm">
                        <div>
                            <p className="text-gray-400 text-xs font-medium mb-2">Completed Payouts</p>
                            <p className="text-gray-900 text-2xl font-bold">$ 890K</p>
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

                        <div className="space-y-1">
                            {transactions.map((tx) => (
                                <div
                                    key={tx.id}
                                    className={`flex items-center justify-between py-3 px-2 rounded-xl transition-colors cursor-pointer ${hoveredRow === tx.id ? "bg-gray-50" : ""
                                        }`}
                                    onMouseEnter={() => setHoveredRow(tx.id)}
                                    onMouseLeave={() => setHoveredRow(null)}
                                >
                                    <div className="flex items-center gap-3">
                                        <div
                                            className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${tx.isCredit
                                                ? "bg-blue-50 text-blue-400"
                                                : "bg-red-50 text-red-400"
                                                }`}
                                        >
                                            {tx.isCredit ? <ArrowUpIcon /> : <ArrowDownIcon />}
                                        </div>
                                        <div>
                                            <p className="text-xs font-medium text-gray-800">{tx.type}</p>
                                            <p className="text-xs text-gray-400">{tx.name}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p
                                            className={`text-xs font-semibold ${tx.isCredit ? "text-green-500" : "text-red-500"
                                                }`}
                                        >
                                            {tx.amount}
                                        </p>
                                        <p className="text-xs text-gray-400">{tx.date}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Pending Payouts */}
                    <div className="bg-white rounded-2xl p-5 shadow-sm">
                        <div className="flex items-center justify-between mb-5">
                            <h2 className="text-sm font-bold text-gray-900">Pending Payouts</h2>
                            <span className="bg-amber-400 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                                3
                            </span>
                        </div>

                        <div className="space-y-5">
                            {pendingPayouts.map((p, i) => (
                                <div key={p.id}>
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <p className="text-sm font-semibold text-gray-900">{p.name}</p>
                                            <p className="text-xs text-gray-400 mt-0.5">{p.date}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-bold text-amber-500">{p.amount}</p>
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
                    </div>
                </div>
            </div>
        </div>
    );
}