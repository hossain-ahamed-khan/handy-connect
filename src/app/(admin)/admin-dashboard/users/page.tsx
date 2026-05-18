"use client";
import { useState } from "react";
import { Eye, Ban, Trash2, Plus, Download } from "lucide-react";
import { useGetAllUsersQuery } from "@/redux/features/admin/users/usersApi";

type Status = "Active" | "Banned" | "Suspended";

interface ApiUser {
  id: number;
  email: string;
  full_name: string | null;
  phone_number: string | null;
  role: "CUSTOMER" | "PROVIDER";
  is_verified: boolean;
  is_active: boolean;
  date_joined: string;
}

interface ApiResponse {
  next: string | null;
  previous: string | null;
  results: ApiUser[];
}

const getStatus = (user: ApiUser): Status => {
  if (!user.is_active) return "Banned";
  if (!user.is_verified) return "Suspended";
  return "Active";
};

const getInitials = (name: string | null, email: string): string => {
  if (name) {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  }
  return email[0].toUpperCase();
};

const AVATAR_COLORS = [
  "bg-amber-500", "bg-red-500", "bg-purple-500",
  "bg-orange-500", "bg-green-500", "bg-blue-500",
  "bg-pink-500", "bg-teal-500",
];

const getColor = (id: number) => AVATAR_COLORS[id % AVATAR_COLORS.length];

const formatDate = (iso: string) => iso.split("T")[0];

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

const SkeletonRow = ({ cols }: { cols: number }) => (
  <tr className="border-b border-gray-50">
    {Array.from({ length: cols }).map((_, i) => (
      <td key={i} className="px-4 py-4">
        <div className="h-4 bg-gray-100 rounded animate-pulse w-24" />
      </td>
    ))}
  </tr>
);

export default function UserManagement() {
  const [activeTab, setActiveTab] = useState<"customers" | "professionals">("customers");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<number[]>([]);
  const [cursor, setCursor] = useState<string | null>(null);

  const { data, isLoading, isError } = useGetAllUsersQuery(
    cursor ? { cursor } : undefined
  );

  const apiData = data as ApiResponse | undefined;
  const allUsers: ApiUser[] = apiData?.results ?? [];

  const customers = allUsers.filter((u) => u.role === "CUSTOMER");
  const professionals = allUsers.filter((u) => u.role === "PROVIDER");

  const filtered = (list: ApiUser[]) =>
    list.filter(
      (u) =>
        (u.full_name?.toLowerCase().includes(search.toLowerCase()) ?? false) ||
        u.email.toLowerCase().includes(search.toLowerCase())
    );

  const filteredCustomers = filtered(customers);
  const filteredProfessionals = filtered(professionals);

  const toggleSelect = (id: number) =>
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );

  const toggleAll = () => {
    const ids = filteredProfessionals.map((p) => p.id);
    setSelected((prev) => (prev.length === ids.length ? [] : ids));
  };

  const extractCursor = (url: string | null) => {
    if (!url) return null;
    try {
      return new URL(url).searchParams.get("cursor");
    } catch {
      return null;
    }
  };

  const activeList =
    activeTab === "customers" ? filteredCustomers : filteredProfessionals;
  const totalCount =
    activeTab === "customers" ? customers.length : professionals.length;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="w-full">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">User Management</h1>

        {/* Tabs */}
        <div className="flex gap-3 mb-5">
          {(["customers", "professionals"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab);
                setSearch("");
                setSelected([]);
              }}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-colors capitalize cursor-pointer ${
                activeTab === tab
                  ? "bg-amber-400 text-white"
                  : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
              }`}
            >
              {tab} ({tab === "customers" ? customers.length : professionals.length})
            </button>
          ))}
        </div>

        {/* Search + Actions */}
        <div className="flex items-center gap-3 mb-5">
          <input
            type="text"
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={`border border-gray-200 rounded-lg px-4 py-2 text-sm text-gray-600 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-300 ${
              activeTab === "professionals" ? "w-64" : "w-full"
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

        {/* Error state */}
        {isError && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-3 mb-4">
            Failed to load users. Please try again.
          </div>
        )}

        {/* Table */}
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm">
          {activeTab === "customers" ? (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-gray-500 text-xs uppercase tracking-wide">
                  <th className="text-left px-6 py-4 font-medium">User</th>
                  <th className="text-left px-4 py-4 font-medium">Contact</th>
                  <th className="text-left px-4 py-4 font-medium">Join Date</th>
                  <th className="text-left px-4 py-4 font-medium">Status</th>
                  <th className="text-left px-4 py-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {isLoading
                  ? Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} cols={5} />)
                  : filteredCustomers.map((u, i) => (
                      <tr
                        key={u.id}
                        className={`border-b border-gray-50 hover:bg-gray-50 transition-colors ${
                          i === filteredCustomers.length - 1 ? "border-0" : ""
                        }`}
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-9 h-9 rounded-full ${getColor(u.id)} flex items-center justify-center text-white text-xs font-semibold`}
                            >
                              {getInitials(u.full_name, u.email)}
                            </div>
                            <div>
                              <div className="font-medium text-gray-900">
                                {u.full_name ?? <span className="text-gray-400 italic">No name</span>}
                              </div>
                              <div className="text-gray-400 text-xs">{u.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-gray-600">
                          {u.phone_number ?? <span className="text-gray-400">—</span>}
                        </td>
                        <td className="px-4 py-4 text-gray-600">{formatDate(u.date_joined)}</td>
                        <td className="px-4 py-4">
                          <StatusBadge status={getStatus(u)} />
                        </td>
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
                      checked={
                        selected.length === filteredProfessionals.length &&
                        filteredProfessionals.length > 0
                      }
                      onChange={toggleAll}
                      className="rounded border-gray-300 accent-amber-400"
                    />
                  </th>
                  <th className="text-left px-2 py-4 font-medium">User</th>
                  <th className="text-left px-4 py-4 font-medium">Contact</th>
                  <th className="text-left px-4 py-4 font-medium">Join Date</th>
                  <th className="text-left px-4 py-4 font-medium">Status</th>
                  <th className="text-left px-4 py-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {isLoading
                  ? Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} cols={6} />)
                  : filteredProfessionals.map((u, i) => (
                      <tr
                        key={u.id}
                        className={`border-b border-gray-50 hover:bg-gray-50 transition-colors ${
                          i === filteredProfessionals.length - 1 ? "border-0" : ""
                        }`}
                      >
                        <td className="px-4 py-4">
                          <input
                            type="checkbox"
                            checked={selected.includes(u.id)}
                            onChange={() => toggleSelect(u.id)}
                            className="rounded border-gray-300 accent-amber-400"
                          />
                        </td>
                        <td className="px-2 py-4">
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-9 h-9 rounded-full ${getColor(u.id)} flex items-center justify-center text-white text-xs font-semibold`}
                            >
                              {getInitials(u.full_name, u.email)}
                            </div>
                            <div>
                              <div className="font-medium text-gray-900">
                                {u.full_name ?? <span className="text-gray-400 italic">No name</span>}
                              </div>
                              <div className="text-gray-400 text-xs">{u.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-gray-600">
                          {u.phone_number ?? <span className="text-gray-400">—</span>}
                        </td>
                        <td className="px-4 py-4 text-gray-600">{formatDate(u.date_joined)}</td>
                        <td className="px-4 py-4">
                          <StatusBadge status={getStatus(u)} />
                        </td>
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
              Showing {activeList.length} of {totalCount} users
            </span>
            <div className="flex gap-2">
              <button
                disabled={!apiData?.previous}
                onClick={() => setCursor(extractCursor(apiData?.previous ?? null))}
                className="px-4 py-1.5 rounded-lg border text-sm font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed border-gray-200 text-gray-700 bg-white hover:bg-gray-50 disabled:hover:bg-white"
              >
                Previous
              </button>
              <button
                disabled={!apiData?.next}
                onClick={() => setCursor(extractCursor(apiData?.next ?? null))}
                className="px-4 py-1.5 rounded-lg border text-sm font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed bg-amber-400 text-white border-amber-400 hover:bg-amber-500 disabled:hover:bg-amber-400"
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