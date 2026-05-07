"use client";
import { useState } from "react";

const leads = [
    {
        id: "L-10234",
        time: "2023-10-24\n14:30",
        buyerId: "B-8821",
        details: "Plumbing repair - Tel Aviv",
        service: "Plumbing",
        branch: "Central",
        price: "₪45",
        status: ["Billed"],
        priority: "High Priority",
    },
    {
        id: "L-10235",
        time: "2023-10-24\n15:15",
        buyerId: "B-9932",
        details: "Electrician needed - Haifa",
        service: "Electrical",
        branch: "North",
        price: "₪55",
        status: ["Pending"],
        priority: null,
    },
    {
        id: "L-10236",
        time: "2023-10-24\n16:00",
        buyerId: "B-1120",
        details: "AC Maintenance - Eilat",
        service: "HVAC",
        branch: "South",
        price: "-",
        status: ["Ghost Lead"],
        priority: null,
    },
    {
        id: "L-10237",
        time: "2023-10-24\n16:45",
        buyerId: "B-8821",
        details: "Leak detection - Jerusalem",
        service: "Plumbing",
        branch: "Jerusalem",
        price: "₪60",
        status: ["Sold"],
        priority: "High Priority",
    },
];

const statusStyles: Record<string, string> = {
    Billed: "bg-green-100 text-green-700",
    Pending: "bg-gray-100 text-gray-600",
    "Ghost Lead": "bg-gray-100 text-gray-600",
    Sold: "bg-green-100 text-green-700",
};

export default function LeadHistoryBilling() {
    const [search, setSearch] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    return (
        <div className="min-h-screen bg-gray-50 p-8 font-sans">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Lead History &amp; Billing</h1>
                <div className="flex gap-3">
                    <button className="flex items-center gap-2 border border-gray-300 bg-white text-gray-700 text-sm font-medium px-4 py-2 rounded-lg hover:bg-gray-50 transition">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5 5-5M12 15V3" />
                        </svg>
                        Export CSV
                    </button>
                    <button className="flex items-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-white text-sm font-medium px-4 py-2 rounded-lg transition">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5 5-5M12 15V3" />
                        </svg>
                        Export PDF Bill
                    </button>
                </div>
            </div>

            {/* Config Cards */}
            <div className="grid grid-cols-3 gap-4 mb-6">
                {/* Billing Timeframe */}
                <div className="bg-white border border-gray-200 rounded-xl p-4">
                    <p className="text-xs text-gray-500 mb-3 font-medium">Billing Timeframe</p>
                    <div className="flex items-center gap-2">
                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            placeholder="mm/dd/yyyy"
                            className="border border-gray-300 rounded-lg text-sm text-gray-500 px-3 py-2 w-full focus:outline-none focus:ring-1 focus:ring-yellow-400"
                        />
                        <span className="text-gray-400 text-sm">-</span>
                        <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            placeholder="mm/dd/yyyy"
                            className="border border-gray-300 rounded-lg text-sm text-gray-500 px-3 py-2 w-full focus:outline-none focus:ring-1 focus:ring-yellow-400"
                        />
                    </div>
                </div>

                {/* Email Automation Rules */}
                <div className="bg-white border border-gray-200 rounded-xl p-4">
                    <p className="text-xs text-gray-500 mb-3 font-medium">Email Automation Rules</p>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1.5 text-sm text-gray-700">
                            <span className="text-yellow-500">⏱</span>
                            <span>0 min: 5 emails</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-sm text-gray-700">
                            <span className="text-yellow-500">⏱</span>
                            <span>20 min: +5 emails</span>
                        </div>
                        <button className="text-yellow-500 font-semibold text-sm hover:text-yellow-600 transition ml-auto">Edit</button>
                    </div>
                </div>

                {/* Pricing Configuration */}
                <div className="bg-white border border-gray-200 rounded-xl p-4">
                    <p className="text-xs text-gray-500 mb-3 font-medium">Pricing Configuration</p>
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                        <span className="text-gray-400 text-base">$</span>
                        <span>Configure Branch Pricing</span>
                    </div>
                </div>
            </div>

            {/* Table Card */}
            <div className="bg-white border border-gray-200 rounded-xl p-5">
                {/* Search */}
                <div className="mb-4">
                    <div className="relative w-80">
                        <svg
                            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={2}
                            viewBox="0 0 24 24"
                        >
                            <circle cx="11" cy="11" r="8" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35" />
                        </svg>
                        <input
                            type="text"
                            placeholder="Search by lead ID, buyer, or details..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-9 pr-4 py-2 w-full border border-gray-200 rounded-lg text-sm text-gray-600 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-yellow-400"
                        />
                    </div>
                </div>

                {/* Table */}
                <table className="w-full text-sm">
                    <thead>
                        <tr className="text-left text-gray-400 text-xs font-medium border-b border-gray-100">
                            <th className="pb-3 pr-6">
                                Job<br />ID
                            </th>
                            <th className="pb-3 pr-6">Time</th>
                            <th className="pb-3 pr-6">
                                Buyer<br />ID
                            </th>
                            <th className="pb-3 pr-6">Details</th>
                            <th className="pb-3 pr-6">Service/Branch</th>
                            <th className="pb-3 pr-6">Price</th>
                            <th className="pb-3 pr-6">Status</th>
                            <th className="pb-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {leads
                            .filter(
                                (l) =>
                                    !search ||
                                    l.id.toLowerCase().includes(search.toLowerCase()) ||
                                    l.buyerId.toLowerCase().includes(search.toLowerCase()) ||
                                    l.details.toLowerCase().includes(search.toLowerCase())
                            )
                            .map((lead, i) => (
                                <tr key={lead.id} className={`border-b border-gray-50 ${i % 2 === 0 ? "" : ""}`}>
                                    <td className="py-4 pr-6 font-medium text-gray-800">{lead.id}</td>
                                    <td className="py-4 pr-6 text-gray-500 whitespace-pre-line">{lead.time}</td>
                                    <td className="py-4 pr-6 text-gray-700">{lead.buyerId}</td>
                                    <td className="py-4 pr-6 text-gray-700">{lead.details}</td>
                                    <td className="py-4 pr-6">
                                        <span className="text-gray-800">{lead.service}</span>
                                        <br />
                                        <span className="text-gray-400 text-xs">{lead.branch}</span>
                                    </td>
                                    <td className="py-4 pr-6 text-gray-800 font-medium">{lead.price}</td>
                                    <td className="py-4 pr-6">
                                        <div className="flex flex-col gap-1">
                                            {lead.status.map((s) => (
                                                <span
                                                    key={s}
                                                    className={`inline-block px-3 py-0.5 rounded-full text-xs font-medium ${statusStyles[s] ?? "bg-gray-100 text-gray-600"}`}
                                                >
                                                    {s}
                                                </span>
                                            ))}
                                            {lead.priority && (
                                                <span className="inline-block px-3 py-0.5 rounded-full text-xs font-medium bg-red-50 text-red-500">
                                                    {lead.priority}
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="py-4">
                                        <div className="flex items-center gap-2">
                                            <button className="text-gray-300 hover:text-green-500 transition">
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21" />
                                                </svg>
                                            </button>
                                            <button className="text-gray-300 hover:text-red-400 transition">
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                    </tbody>
                </table>

                {/* Pagination */}
                <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
                    <span className="text-xs text-gray-400">Showing 1 to 4 of 128 results</span>
                    <div className="flex gap-2">
                        <button className="px-4 py-1.5 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition">
                            Previous
                        </button>
                        <button className="px-4 py-1.5 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition">
                            Next
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}