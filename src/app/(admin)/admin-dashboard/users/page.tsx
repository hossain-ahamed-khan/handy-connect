"use client";
import { useState } from "react";
import { Eye, Ban, Trash2, Plus, Download } from "lucide-react";

type Status = "Active" | "Banned" | "Suspended";

interface Customer {
    id: number;
    name: string;
    email: string;
    phone: string;
    joinDate: string;
    orders: number;
    status: Status;
    initials: string;
    color: string;
}

interface Professional {
    id: number;
    name: string;
    email: string;
    phone: string;
    joinDate: string;
    category: string;
    categoryIcon: string;
    jobs: number;
    status: Status;
    avatar?: string;
}

const customers: Customer[] = [
    { id: 1, name: "David Cohen", email: "david@example.com", phone: "050-1234567", joinDate: "2024-01-15", orders: 12, status: "Active", initials: "DC", color: "bg-amber-500" },
    { id: 2, name: "Sarah Levi", email: "sarah@example.com", phone: "050-2345678", joinDate: "2024-01-20", orders: 8, status: "Active", initials: "SL", color: "bg-red-500" },
    { id: 3, name: "Michael Ben", email: "michael@example.com", phone: "050-5678901", joinDate: "2024-02-05", orders: 5, status: "Active", initials: "MB", color: "bg-purple-500" },
    { id: 4, name: "Amit Levy", email: "amit@example.com", phone: "050-7890123", joinDate: "2024-01-25", orders: 2, status: "Banned", initials: "AL", color: "bg-orange-500" },
    { id: 5, name: "Tamar Katz", email: "tamar@example.com", phone: "050-8901234", joinDate: "2024-02-15", orders: 15, status: "Active", initials: "TK", color: "bg-green-500" },
];

const professionals: Professional[] = [
    { id: 1, name: "Yossi Cohen", email: "yossi@example.com", phone: "050-3456789", joinDate: "2024-01-10", category: "plumbing", categoryIcon: "🔧", jobs: 45, status: "Active" },
    { id: 2, name: "Rachel Green", email: "rachel@example.com", phone: "050-4567890", joinDate: "2024-02-01", category: "plumbing", categoryIcon: "🔧", jobs: 23, status: "Suspended" },
    { id: 3, name: "Noa Shapira", email: "noa@example.com", phone: "050-6789012", joinDate: "2024-02-10", category: "plumbing", categoryIcon: "🔧", jobs: 67, status: "Active" },
    { id: 4, name: "David Levi", email: "david@example.com", phone: "050-1234567", joinDate: "2023-11-15", category: "electrical", categoryIcon: "⚡", jobs: 89, status: "Active" },
    { id: 5, name: "Sarah Miller", email: "sarah@example.com", phone: "050-9876543", joinDate: "2024-03-05", category: "cleaning", categoryIcon: "🧹", jobs: 12, status: "Active" },
];

const StatusBadge = ({ status }: { status: Status }) => {
    const styles: Record<Status, string> = {
        Active: "bg-green-100 text-green-700",
        Banned: "bg-red-100 text-red-500",
        Suspended: "bg-yellow-100 text-yellow-600",
    };
    return (
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${styles[status]}`}>
            {status}
        </span>
    );
};

export default function UserManagement() {
    const [activeTab, setActiveTab] = useState<"customers" | "professionals">("customers");
    const [search, setSearch] = useState("");
    const [selected, setSelected] = useState<number[]>([]);

    const filteredCustomers = customers.filter(
        (c) => c.name.toLowerCase().includes(search.toLowerCase()) || c.email.toLowerCase().includes(search.toLowerCase())
    );
    const filteredProfessionals = professionals.filter(
        (p) => p.name.toLowerCase().includes(search.toLowerCase()) || p.email.toLowerCase().includes(search.toLowerCase())
    );

    const toggleSelect = (id: number) =>
        setSelected((prev) => prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]);

    const toggleAll = () => {
        const ids = filteredProfessionals.map((p) => p.id);
        setSelected((prev) => prev.length === ids.length ? [] : ids);
    };

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="w-full">
                <h1 className="text-2xl font-bold text-gray-900 mb-6">User Management</h1>

                {/* Tabs */}
                <div className="flex gap-3 mb-5">
                    <button
                        onClick={() => { setActiveTab("customers"); setSearch(""); }}
                        className={`px-5 py-2 rounded-full text-sm font-medium transition-colors ${activeTab === "customers"
                            ? "bg-amber-400 text-white"
                            : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
                            }`}
                    >
                        Customers ( {customers.length} )
                    </button>
                    <button
                        onClick={() => { setActiveTab("professionals"); setSearch(""); setSelected([]); }}
                        className={`px-5 py-2 rounded-full text-sm font-medium transition-colors ${activeTab === "professionals"
                            ? "bg-amber-400 text-white"
                            : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
                            }`}
                    >
                        Professionals ( {professionals.length} )
                    </button>
                </div>

                {/* Search + Actions */}
                <div className="flex items-center gap-3 mb-5">
                    <input
                        type="text"
                        placeholder="Search users..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className={`border border-gray-200 rounded-lg px-4 py-2 text-sm text-gray-600 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-300 ${activeTab === "professionals" ? "w-64" : "w-full"
                            }`}
                    />
                    {activeTab === "professionals" && (
                        <div className="flex items-center gap-2 ml-auto">
                            <button className="flex items-center gap-2 border border-gray-200 rounded-lg px-4 py-2 text-sm text-gray-700 bg-white hover:bg-gray-50">
                                <Download size={15} />
                                Export
                            </button>
                            <button className="flex items-center gap-2 bg-amber-400 hover:bg-amber-500 text-white rounded-lg px-4 py-2 text-sm font-medium">
                                <Plus size={15} />
                                Add User
                            </button>
                        </div>
                    )}
                </div>

                {/* Table */}
                <div className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm">
                    {activeTab === "customers" ? (
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-gray-100 text-gray-500 text-xs uppercase tracking-wide">
                                    <th className="text-left px-6 py-4 font-medium">User</th>
                                    <th className="text-left px-4 py-4 font-medium">Contact</th>
                                    <th className="text-left px-4 py-4 font-medium">Join Date</th>
                                    <th className="text-left px-4 py-4 font-medium">Orders</th>
                                    <th className="text-left px-4 py-4 font-medium">Status</th>
                                    <th className="text-left px-4 py-4 font-medium">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredCustomers.map((c, i) => (
                                    <tr key={c.id} className={`border-b border-gray-50 hover:bg-gray-50 transition-colors ${i === filteredCustomers.length - 1 ? "border-0" : ""}`}>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-9 h-9 rounded-full ${c.color} flex items-center justify-center text-white text-xs font-semibold`}>
                                                    {c.initials}
                                                </div>
                                                <div>
                                                    <div className="font-medium text-gray-900">{c.name}</div>
                                                    <div className="text-gray-400 text-xs">{c.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-4 text-gray-600">{c.phone}</td>
                                        <td className="px-4 py-4 text-gray-600">{c.joinDate}</td>
                                        <td className="px-4 py-4 text-gray-900 font-medium">{c.orders}</td>
                                        <td className="px-4 py-4"><StatusBadge status={c.status} /></td>
                                        <td className="px-4 py-4">
                                            <div className="flex items-center gap-3">
                                                <button className="text-gray-400 hover:text-gray-600"><Eye size={16} /></button>
                                                <button className="text-red-400 hover:text-red-600"><Ban size={16} /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-gray-100 text-gray-500 text-xs uppercase tracking-wide">
                                    <th className="px-4 py-4 w-8">
                                        <input
                                            type="checkbox"
                                            checked={selected.length === filteredProfessionals.length && filteredProfessionals.length > 0}
                                            onChange={toggleAll}
                                            className="rounded border-gray-300 accent-amber-400"
                                        />
                                    </th>
                                    <th className="text-left px-2 py-4 font-medium">User</th>
                                    <th className="text-left px-4 py-4 font-medium">Contact</th>
                                    <th className="text-left px-4 py-4 font-medium">Join Date</th>
                                    <th className="text-left px-4 py-4 font-medium">Category</th>
                                    <th className="text-left px-4 py-4 font-medium">Jobs</th>
                                    <th className="text-left px-4 py-4 font-medium">Status</th>
                                    <th className="text-left px-4 py-4 font-medium">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredProfessionals.map((p, i) => (
                                    <tr key={p.id} className={`border-b border-gray-50 hover:bg-gray-50 transition-colors ${i === filteredProfessionals.length - 1 ? "border-0" : ""}`}>
                                        <td className="px-4 py-4">
                                            <input
                                                type="checkbox"
                                                checked={selected.includes(p.id)}
                                                onChange={() => toggleSelect(p.id)}
                                                className="rounded border-gray-300 accent-amber-400"
                                            />
                                        </td>
                                        <td className="px-2 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center text-gray-400 text-xs">
                                                    {p.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <div className="font-medium text-gray-900">{p.name}</div>
                                                    <div className="text-gray-400 text-xs">{p.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-4 text-gray-600">{p.phone}</td>
                                        <td className="px-4 py-4 text-gray-600">{p.joinDate}</td>
                                        <td className="px-4 py-4 text-gray-600">
                                            <span className="flex items-center gap-1">
                                                <span>{p.categoryIcon}</span> {p.category}
                                            </span>
                                        </td>
                                        <td className="px-4 py-4 text-gray-900 font-medium">{p.jobs}</td>
                                        <td className="px-4 py-4"><StatusBadge status={p.status} /></td>
                                        <td className="px-4 py-4">
                                            <div className="flex items-center gap-3">
                                                <button className="text-gray-400 hover:text-gray-600"><Eye size={16} /></button>
                                                <button className="text-gray-400 hover:text-gray-600"><Ban size={16} /></button>
                                                <button className="text-gray-400 hover:text-red-500"><Trash2 size={16} /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}

                    {/* Footer */}
                    <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
                        <span className="text-sm text-gray-500">
                            Showing &nbsp;
                            {activeTab === "customers" ? filteredCustomers.length : filteredProfessionals.length}
                            &nbsp;of&nbsp;
                            {activeTab === "customers" ? customers.length : professionals.length}
                            &nbsp;users
                        </span>
                        <div className="flex gap-2">
                            <button
                                className={`px-4 py-1.5 rounded-lg border text-sm font-medium transition-colors ${activeTab === "professionals"
                                    ? "bg-amber-400 text-white border-amber-400 hover:bg-amber-500"
                                    : "border-gray-200 text-gray-700 bg-white hover:bg-gray-50"
                                    }`}
                            >
                                Previous
                            </button>
                            <button
                                className={`px-4 py-1.5 rounded-lg border text-sm font-medium transition-colors ${activeTab === "professionals"
                                    ? "bg-amber-400 text-white border-amber-400 hover:bg-amber-500"
                                    : "border-gray-200 text-gray-700 bg-white hover:bg-gray-50"
                                    }`}
                            >
                                Next
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}