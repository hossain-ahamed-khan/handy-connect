"use client";
import { useState } from "react";

type JobStatus =
    | "Completed"
    | "In Progress"
    | "On The Way"
    | "Pending"
    | "Awaiting Payment"
    | "Closed";

interface Job {
    id: string;
    customer: string;
    professional: string;
    category: string;
    categoryIcon: string;
    status: JobStatus;
    date: string;
    amount: number;
}

const jobs: Job[] = [
    {
        id: "JOB-1234",
        customer: "David Cohen",
        professional: "Yossi Cohen",
        category: "plumbing",
        categoryIcon: "🔧",
        status: "Completed",
        date: "2024-02-15",
        amount: 320,
    },
    {
        id: "JOB-1235",
        customer: "Sarah Levi",
        professional: "Rachel Green",
        category: "electrical",
        categoryIcon: "⚡",
        status: "In Progress",
        date: "2024-02-15",
        amount: 180,
    },
    {
        id: "JOB-1236",
        customer: "Michael Ben",
        professional: "Noa Shapira",
        category: "ac",
        categoryIcon: "❄️",
        status: "On The Way",
        date: "2024-02-15",
        amount: 450,
    },
    {
        id: "JOB-1237",
        customer: "Tamar Katz",
        professional: "Amit Levy",
        category: "cleaning",
        categoryIcon: "🧹",
        status: "Pending",
        date: "2024-02-14",
        amount: 130,
    },
    {
        id: "JOB-1238",
        customer: "Noa Shapira",
        professional: "Dan Levy",
        category: "plumbing",
        categoryIcon: "🔧",
        status: "Completed",
        date: "2024-02-14",
        amount: 280,
    },
    {
        id: "JOB-1239",
        customer: "Amit Levy",
        professional: "Yossi Cohen",
        category: "electrical",
        categoryIcon: "⚡",
        status: "Awaiting Payment",
        date: "2024-02-14",
        amount: 520,
    },
    {
        id: "JOB-1240",
        customer: "Dan Levy",
        professional: "Rachel Green",
        category: "carpentry",
        categoryIcon: "🔨",
        status: "Completed",
        date: "2024-02-13",
        amount: 380,
    },
    {
        id: "JOB-1241",
        customer: "Miri Shapira",
        professional: "Noa Shapira",
        category: "painting",
        categoryIcon: "🎨",
        status: "Closed",
        date: "2024-02-13",
        amount: 650,
    },
];

const statusStyles: Record<JobStatus, string> = {
    Completed: "bg-green-100 text-green-700",
    "In Progress": "bg-blue-100 text-blue-700",
    "On The Way": "bg-sky-100 text-sky-600",
    Pending: "bg-yellow-100 text-yellow-700",
    "Awaiting Payment": "bg-orange-100 text-orange-600",
    Closed: "text-gray-500",
};

function StatusBadge({ status }: { status: JobStatus }) {
    const base = "px-2.5 py-0.5 rounded-full text-xs font-medium whitespace-nowrap";
    const style = statusStyles[status];
    if (status === "Closed") {
        return <span className={`${base} ${style}`}>{status}</span>;
    }
    return <span className={`${base} ${style}`}>{status}</span>;
}

export default function JobManagement() {
    const [search, setSearch] = useState("");

    const totalJobs = jobs.length;
    const active = jobs.filter((j) =>
        ["In Progress", "On The Way", "Pending"].includes(j.status)
    ).length;
    const completed = jobs.filter((j) => j.status === "Completed").length;
    const revenue = jobs
        .filter((j) => j.status === "Completed")
        .reduce((sum, j) => sum + j.amount, 0);

    const filtered = jobs.filter(
        (j) =>
            j.id.toLowerCase().includes(search.toLowerCase()) ||
            j.customer.toLowerCase().includes(search.toLowerCase()) ||
            j.professional.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="w-full">
                {/* Title */}
                <h1 className="text-xl font-semibold text-gray-900 mb-5">Job Management</h1>

                {/* Stats Cards */}
                <div className="grid grid-cols-4 gap-4 mb-5">
                    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                        <p className="text-xs text-gray-400 mb-1">Total Jobs</p>
                        <p className="text-2xl font-semibold text-gray-800">{totalJobs}</p>
                    </div>
                    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                        <p className="text-xs text-gray-400 mb-1">Active</p>
                        <p className="text-2xl font-semibold text-yellow-500">{active}</p>
                    </div>
                    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                        <p className="text-xs text-gray-400 mb-1">Completed</p>
                        <p className="text-2xl font-semibold text-green-500">{completed}</p>
                    </div>
                    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                        <p className="text-xs text-gray-400 mb-1">Revenue</p>
                        <p className="text-2xl font-semibold text-blue-600">₪{revenue.toLocaleString()}</p>
                    </div>
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
                            {filtered.map((job, i) => (
                                <tr
                                    key={job.id}
                                    className={`border-b border-gray-50 hover:bg-gray-50 transition-colors ${i === filtered.length - 1 ? "border-b-0" : ""
                                        }`}
                                >
                                    <td className="px-5 py-4">
                                        <span className="text-blue-500 font-medium cursor-pointer hover:underline">
                                            {job.id}
                                        </span>
                                    </td>
                                    <td className="px-4 py-4 text-gray-700">{job.customer}</td>
                                    <td className="px-4 py-4 text-gray-700">{job.professional}</td>
                                    <td className="px-4 py-4">
                                        <span className="flex items-center gap-1.5 text-gray-600">
                                            <span className="text-base">{job.categoryIcon}</span>
                                            {job.category}
                                        </span>
                                    </td>
                                    <td className="px-4 py-4">
                                        <StatusBadge status={job.status} />
                                    </td>
                                    <td className="px-4 py-4 text-gray-500">{job.date}</td>
                                    <td className="px-4 py-4 text-gray-700 font-medium">₪{job.amount}</td>
                                    <td className="px-4 py-4">
                                        <div className="flex items-center gap-3">
                                            <button className="text-gray-400 hover:text-gray-600 transition-colors" title="View">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                </svg>
                                            </button>
                                            <button className="text-red-400 hover:text-red-600 transition-colors" title="Cancel">
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
                            Showing {filtered.length} of {totalJobs} jobs
                        </span>
                        <div className="flex gap-2">
                            <button className="px-4 py-1.5 text-sm border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors">
                                Previous
                            </button>
                            <button className="px-4 py-1.5 text-sm border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors">
                                Next
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}