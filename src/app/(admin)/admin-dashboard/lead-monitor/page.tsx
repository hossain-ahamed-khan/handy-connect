"use client";
import { useState } from "react";

type LeadStatus = "New" | "Sold" | "Critical (>10h)" | "High (>5h)";

interface SPPurchase {
    name: string;
    phone: string;
    rating: number;
}

interface Lead {
    id: string;
    status: LeadStatus;
    service: string;
    location: string;
    postedAgo: string;
    views: number;
    matchedSPs: number;
    boughtBy: number;
    customerName: string;
    customerPhone: string;
    customerAddress: string;
    leadDescription: string;
    tags: string[];
    spPurchases: SPPurchase[];
    billingNote?: string;
    manualMatch?: boolean;
}

const leads: Lead[] = [
    {
        id: "L-18442",
        status: "New",
        service: "Emergency Plumbing",
        location: "Tel Aviv",
        postedAgo: "10 mins ago",
        views: 12,
        matchedSPs: 5,
        boughtBy: 0,
        customerName: "Avi Goldstein",
        customerPhone: "+972-50-123-4567",
        customerAddress: "Tel Aviv (61000)",
        leadDescription: "Urgent pipe burst in kitchen, water flooding the floor.",
        tags: ["Emergency Plumbing", "Tel Aviv", "ZIP: 61000"],
        spPurchases: [],
    },
    {
        id: "L-18429",
        status: "Critical (>10h)",
        service: "Roof Repair",
        location: "Jerusalem",
        postedAgo: "11 hours ago",
        views: 156,
        matchedSPs: 20,
        boughtBy: 0,
        customerName: "",
        customerPhone: "",
        customerAddress: "",
        leadDescription: "",
        tags: [],
        spPurchases: [],
    },
    {
        id: "L-18418",
        status: "Sold",
        service: "AC Repair",
        location: "Eilat",
        postedAgo: "12 hours ago",
        views: 24,
        matchedSPs: 3,
        boughtBy: 2,
        customerName: "David Levi",
        customerPhone: "+972-54-555-4444",
        customerAddress: "Eilat (88000)",
        leadDescription: "Air conditioner not cooling, making weird noises.",
        tags: ["AC Repair", "Eilat", "ZIP: 88000"],
        spPurchases: [
            { name: "Avi Levi", phone: "+972-52-333-4444", rating: 4.7 },
            { name: "Eilat Cooling Pros", phone: "+972-50-888-7777", rating: 4.9 },
        ],
        billingNote: "This is a normal lead. Standard billing applies.",
        manualMatch: true,
    },
    {
        id: "L-18415",
        status: "High (>5h)",
        service: "Painting",
        location: "Netanya",
        postedAgo: "6 hours ago",
        views: 67,
        matchedSPs: 9,
        boughtBy: 0,
        customerName: "",
        customerPhone: "",
        customerAddress: "",
        leadDescription: "",
        tags: [],
        spPurchases: [],
    },
    {
        id: "L-10410",
        status: "Sold",
        service: "Plumbing",
        location: "Beer Sheva",
        postedAgo: "8 hours ago",
        views: 38,
        matchedSPs: 6,
        boughtBy: 1,
        customerName: "",
        customerPhone: "",
        customerAddress: "",
        leadDescription: "",
        tags: [],
        spPurchases: [],
    },
];

const statusConfig: Record<
    LeadStatus,
    { label: string; color: string; bg: string; bar: string; dot: string }
> = {
    New: {
        label: "New",
        color: "text-gray-500",
        bg: "bg-white",
        bar: "bg-green-400",
        dot: "",
    },
    Sold: {
        label: "Sold",
        color: "text-green-600",
        bg: "bg-green-50",
        bar: "",
        dot: "bg-green-500",
    },
    "Critical (>10h)": {
        label: "Critical (>10h)",
        color: "text-red-500",
        bg: "bg-red-50",
        bar: "bg-red-400",
        dot: "bg-red-500",
    },
    "High (>5h)": {
        label: "High (>5h)",
        color: "text-orange-500",
        bg: "bg-orange-50",
        bar: "bg-orange-400",
        dot: "bg-orange-400",
    },
};

function StarIcon({ className = "" }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 20 20" fill="currentColor" width="14" height="14">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
    );
}

function ChevronDownIcon({ className = "" }: { className?: string }) {
    return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" width="16" height="16">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
    );
}

function ChevronUpIcon({ className = "" }: { className?: string }) {
    return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" width="16" height="16">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
        </svg>
    );
}

function EyeIcon() {
    return (
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" width="16" height="16" className="text-gray-400">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
    );
}

function UsersIcon() {
    return (
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" width="16" height="16" className="text-gray-400">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
    );
}

function CheckCircleIcon({ className = "" }: { className?: string }) {
    return (
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" width="16" height="16" className={className}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
    );
}

function ClockIcon({ className = "" }: { className?: string }) {
    return (
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" width="14" height="14" className={className}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
    );
}

function UserIcon({ className = "" }: { className?: string }) {
    return (
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" width="14" height="14" className={className}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
    );
}

function PhoneIcon({ className = "" }: { className?: string }) {
    return (
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" width="14" height="14" className={className}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.948V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 7V5z" />
        </svg>
    );
}

function MapPinIcon({ className = "" }: { className?: string }) {
    return (
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" width="14" height="14" className={className}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
    );
}

function CalendarIcon({ className = "" }: { className?: string }) {
    return (
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" width="14" height="14" className={className}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
    );
}

function StatusBadge({ status }: { status: LeadStatus }) {
    const cfg = statusConfig[status];
    if (status === "New") {
        return (
            <span className="flex items-center gap-1 text-xs text-gray-500 font-medium">
                <ClockIcon className="text-gray-400" />
                New
            </span>
        );
    }
    if (status === "Sold") {
        return (
            <span className="flex items-center gap-1 text-xs text-green-600 font-medium">
                <CheckCircleIcon className="text-green-500" />
                Sold
            </span>
        );
    }
    if (status === "Critical (>10h)") {
        return (
            <span className="flex items-center gap-1 text-xs text-red-500 font-semibold">
                <span className="w-2 h-2 rounded-full bg-red-500 inline-block" />
                Critical (&gt;10h)
            </span>
        );
    }
    if (status === "High (>5h)") {
        return (
            <span className="flex items-center gap-1 text-xs text-orange-500 font-semibold">
                <span className="w-2 h-2 rounded-full bg-orange-400 inline-block" />
                High (&gt;5h)
            </span>
        );
    }
    return null;
}

function ProgressBar({ status }: { status: LeadStatus }) {
    const barMap: Partial<Record<LeadStatus, string>> = {
        New: "bg-green-400 w-6",
        "Critical (>10h)": "bg-red-400 w-4/5",
        "High (>5h)": "bg-orange-400 w-2/5",
    };
    const bar = barMap[status];
    if (!bar) return null;
    return (
        <div className="mt-3 h-1 bg-gray-100 rounded-full overflow-hidden">
            <div className={`h-full rounded-full ${bar}`} />
        </div>
    );
}

function LeadCard({ lead }: { lead: Lead }) {
    const [expanded, setExpanded] = useState(lead.id === "L-18442" || lead.id === "L-18418");
    const cfg = statusConfig[lead.status];

    return (
        <div className={`rounded-xl border ${lead.status === "Critical (>10h)" ? "border-red-200 bg-red-50" : lead.status === "Sold" ? "border-green-100 bg-green-50" : lead.status === "High (>5h)" ? "border-orange-100 bg-orange-50" : "border-gray-200 bg-white"} overflow-hidden`}>
            <div className="px-5 pt-4 pb-3">
                <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs text-gray-400 font-mono">{lead.id}</span>
                            <StatusBadge status={lead.status} />
                        </div>
                        <div className="flex items-baseline gap-1 flex-wrap">
                            <span className="text-base font-semibold text-gray-800">{lead.service}</span>
                            <span className="text-sm text-gray-400">in</span>
                            <span className="text-base font-semibold text-gray-800">{lead.location}</span>
                        </div>
                        <p className="text-xs text-gray-400 mt-0.5">Posted {lead.postedAgo}</p>
                    </div>

                    <div className="flex items-center gap-6 flex-shrink-0">
                        <div className="text-center">
                            <div className="flex items-center gap-1 text-gray-400 justify-center mb-0.5">
                                <EyeIcon />
                                <span className="text-xs">Views</span>
                            </div>
                            <p className="text-lg font-bold text-gray-700">{lead.views}</p>
                        </div>
                        <div className="text-center">
                            <div className="flex items-center gap-1 text-gray-400 justify-center mb-0.5">
                                <UsersIcon />
                                <span className="text-xs">Matched SPs</span>
                            </div>
                            <p className="text-lg font-bold text-gray-700">{lead.matchedSPs}</p>
                        </div>
                        <div className="text-center">
                            <div className="flex items-center gap-1 text-gray-400 justify-center mb-0.5">
                                <CheckCircleIcon className="text-gray-400" />
                                <span className="text-xs">Bought By</span>
                            </div>
                            <p className={`text-lg font-bold ${lead.boughtBy > 0 ? "text-green-600" : "text-gray-700"}`}>{lead.boughtBy}</p>
                        </div>

                        <button
                            onClick={() => setExpanded((v) => !v)}
                            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${expanded ? "bg-yellow-400 hover:bg-yellow-500 text-white" : "border border-gray-200 bg-white hover:bg-gray-50 text-gray-700"}`}
                        >
                            {expanded ? "Hide Details" : "View Details"}
                            {expanded ? <ChevronUpIcon /> : <ChevronDownIcon />}
                        </button>
                    </div>
                </div>
                <ProgressBar status={lead.status} />
            </div>

            {expanded && lead.customerName && (
                <div className="border-t border-gray-100 px-5 py-4">
                    <div className="grid grid-cols-3 gap-4">
                        {/* Customer Info */}
                        <div className="bg-white rounded-lg border border-gray-100 p-4">
                            <div className="flex items-center gap-1.5 mb-3">
                                <UserIcon className="text-orange-400" />
                                <span className="text-sm font-semibold text-gray-700">Customer Info</span>
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <UserIcon className="text-gray-400 flex-shrink-0" />
                                    {lead.customerName}
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <PhoneIcon className="text-gray-400 flex-shrink-0" />
                                    {lead.customerPhone}
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <MapPinIcon className="text-gray-400 flex-shrink-0" />
                                    {lead.customerAddress}
                                </div>
                            </div>
                        </div>

                        {/* Lead Details */}
                        <div className="bg-white rounded-lg border border-gray-100 p-4">
                            <div className="flex items-center gap-1.5 mb-3">
                                <CalendarIcon className="text-yellow-500" />
                                <span className="text-sm font-semibold text-gray-700">Lead Details</span>
                            </div>
                            {lead.leadDescription && (
                                <p className="text-sm text-gray-600 mb-3">{lead.leadDescription}</p>
                            )}
                            <div className="flex flex-wrap gap-1.5">
                                {lead.tags.map((tag) => (
                                    <span key={tag} className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* SP Purchases */}
                        <div className="bg-white rounded-lg border border-gray-100 p-4">
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-1.5">
                                    <UserIcon className="text-orange-400" />
                                    <span className="text-sm font-semibold text-gray-700">
                                        SP Purchases ({lead.spPurchases.length})
                                    </span>
                                </div>
                                {lead.manualMatch && (
                                    <span className="text-xs text-orange-500 font-medium flex items-center gap-1">
                                        <StarIcon className="text-orange-400" /> Manual Match
                                    </span>
                                )}
                            </div>
                            {lead.spPurchases.length === 0 ? (
                                <p className="text-sm text-gray-400">No SPs have purchased this lead yet.</p>
                            ) : (
                                <div className="space-y-3">
                                    {lead.spPurchases.map((sp) => (
                                        <div key={sp.name} className="flex items-start justify-between">
                                            <div>
                                                <p className="text-sm font-medium text-gray-700">{sp.name}</p>
                                                <div className="flex items-center gap-1 text-xs text-gray-400 mt-0.5">
                                                    <PhoneIcon className="text-gray-300" />
                                                    {sp.phone}
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-1 text-sm font-semibold text-gray-700">
                                                <StarIcon className="text-yellow-400" />
                                                {sp.rating}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {lead.billingNote && (
                        <div className="mt-3">
                            <p className="text-sm font-semibold text-gray-700 mb-2">Billing Management</p>
                            <div className="bg-white border border-gray-100 rounded-lg px-4 py-3 flex items-center gap-2">
                                <CheckCircleIcon className="text-gray-400 flex-shrink-0" />
                                <span className="text-sm text-gray-500">{lead.billingNote}</span>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default function LeadStatusMonitor() {
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("All Status");
    const [urgencyFilter, setUrgencyFilter] = useState("All Urgency");

    const totalLeads = leads.length + 2;
    const sold = leads.filter((l) => l.status === "Sold").length;
    const unsold = leads.filter((l) => l.status !== "Sold").length + 2;
    const critical = leads.filter((l) => l.status === "Critical (>10h)").length;

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="w-full">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">Lead Status Monitor</h1>
                        <p className="text-sm text-gray-400 mt-0.5">Real-time monitoring of lead sales performance</p>
                    </div>
                    <div className="flex items-center gap-4 text-xs font-medium">
                        <span className="flex items-center gap-1.5 text-yellow-500">
                            <span className="w-2 h-2 rounded-full bg-yellow-400" /> &gt; 3 Hours
                        </span>
                        <span className="flex items-center gap-1.5 text-orange-500">
                            <span className="w-2 h-2 rounded-full bg-orange-400" /> &gt; 5 Hours
                        </span>
                        <span className="flex items-center gap-1.5 text-red-500">
                            <span className="w-2 h-2 rounded-full bg-red-500" /> &gt; 10 Hours
                        </span>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-4 gap-4 mb-6">
                    {[
                        { label: "Total Leads", value: totalLeads, color: "text-gray-800" },
                        { label: "Sold", value: sold, color: "text-gray-800" },
                        { label: "Unsold", value: unsold, color: "text-red-500" },
                        { label: "Critical", value: critical, color: "text-red-500" },
                    ].map((stat) => (
                        <div key={stat.label} className="bg-white rounded-xl border border-gray-200 px-5 py-4">
                            <p className="text-xs text-gray-400 mb-1">{stat.label}</p>
                            <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
                        </div>
                    ))}
                </div>

                {/* Search & Filters */}
                <div className="bg-white rounded-xl border border-gray-200 px-4 py-3 mb-4 flex items-center gap-3">
                    <svg className="text-gray-300 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="16" height="16">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input
                        type="text"
                        placeholder="Search by ID, service, location, customer..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="flex-1 text-sm text-gray-600 placeholder-gray-300 outline-none bg-transparent"
                    />
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="text-sm text-gray-600 border border-gray-200 rounded-lg px-3 py-1.5 outline-none bg-white cursor-pointer"
                    >
                        <option>All Status</option>
                        <option>New</option>
                        <option>Sold</option>
                        <option>Critical (&gt;10h)</option>
                        <option>High (&gt;5h)</option>
                    </select>
                    <select
                        value={urgencyFilter}
                        onChange={(e) => setUrgencyFilter(e.target.value)}
                        className="text-sm text-gray-600 border border-gray-200 rounded-lg px-3 py-1.5 outline-none bg-white cursor-pointer"
                    >
                        <option>All Urgency</option>
                        <option>Low</option>
                        <option>Medium</option>
                        <option>High</option>
                        <option>Critical</option>
                    </select>
                </div>

                {/* Lead Cards */}
                <div className="space-y-3">
                    {leads.map((lead) => (
                        <LeadCard key={lead.id} lead={lead} />
                    ))}
                </div>
            </div>
        </div>
    );
}