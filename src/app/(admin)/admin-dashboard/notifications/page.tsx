"use client";
import { useState } from "react";
import { toast } from "sonner";
import { useGetAllAnnouncementsQuery, useSendAnnouncementMutation } from "@/redux/features/admin/notifications/notificationsApi";

interface AutoTrigger {
    id: number;
    label: string;
    target: string;
    enabled: boolean;
}

interface Announcement {
    id: number;
    title: string;
    message: string;
    target_audience: "ALL_USERS" | "ALL_PROFESSIONALS" | "ALL_CUSTOMERS";
    created_at: string;
    sent_at: string;
}

const audienceLabel: Record<string, string> = {
    ALL_USERS: "All Users",
    ALL_PROFESSIONALS: "All Professionals",
    ALL_CUSTOMERS: "All Customers",
};

const initialTriggers: AutoTrigger[] = [
    { id: 1, label: "New Lead Available", target: "Professionals", enabled: true },
    { id: 2, label: "Verification Approved", target: "Professionals", enabled: true },
    { id: 3, label: "Review Received", target: "Professionals", enabled: false },
    { id: 4, label: "Subscription Expiring", target: "Professionals", enabled: true },
];

function Toggle({ enabled, onChange }: { enabled: boolean; onChange: () => void }) {
    return (
        <button
            onClick={onChange}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none ${enabled ? "bg-green-500" : "bg-gray-300"}`}
        >
            <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform duration-200 ${enabled ? "translate-x-6" : "translate-x-1"}`}
            />
        </button>
    );
}

function timeAgo(dateStr: string): string {
    const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
    if (diff < 60) return "Just now";
    if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
    return `${Math.floor(diff / 86400)} days ago`;
}

export default function PushNotifications() {
    const [title, setTitle] = useState("");
    const [message, setMessage] = useState("");
    const [allProfessionals, setAllProfessionals] = useState(true);
    const [allCustomers, setAllCustomers] = useState(true);
    const [triggers, setTriggers] = useState<AutoTrigger[]>(initialTriggers);

    const {
        data: announcements = [],
        isLoading: isLoadingAnnouncements,
        refetch: refetchAnnouncements,
    } = useGetAllAnnouncementsQuery(undefined);
    const [sendAnnouncement, { isLoading: isSending }] = useSendAnnouncementMutation();

    const toggleTrigger = (id: number) => {
        setTriggers((prev) => prev.map((t) => (t.id === id ? { ...t, enabled: !t.enabled } : t)));
    };

    const deleteTrigger = (id: number) => {
        setTriggers((prev) => prev.filter((t) => t.id !== id));
    };

    const getTargetAudience = (): "ALL_USERS" | "ALL_PROFESSIONALS" | "ALL_CUSTOMERS" => {
        if (allProfessionals && allCustomers) return "ALL_USERS";
        if (allProfessionals) return "ALL_PROFESSIONALS";
        return "ALL_CUSTOMERS";
    };

    const handleSend = async () => {
        if (!title.trim() || !message.trim()) return;
        if (!allProfessionals && !allCustomers) return;

        try {
            await sendAnnouncement({
                title,
                message,
                target_audience: getTargetAudience(),
            }).unwrap();

            setTitle("");
            setMessage("");
            refetchAnnouncements();
            toast.success("Notification sent successfully.");
        } catch (error) {
            toast.error("Failed to send notification.");
        }
    };

    return (
        <div className="min-h-screen p-6 font-sans">
            <h1 className="text-xl font-bold text-gray-900 mb-5">Push Notifications</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                {/* Left Column */}
                <div className="lg:col-span-2 flex flex-col gap-5">
                    {/* Send Announcement */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm">
                        <div className="flex items-center gap-2 mb-5">
                            <span className="text-yellow-400 text-lg">✈</span>
                            <h2 className="font-semibold text-gray-900 text-base">Send Announcement</h2>
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="e.g., Special Holiday Discount!"
                                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-300 focus:border-transparent"
                            />
                        </div>

                        <div className="mb-5">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                            <textarea
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder="Type your message here..."
                                rows={4}
                                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-300 focus:border-transparent resize-none"
                            />
                        </div>

                        <div className="mb-5">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Target Audience</label>
                            <div className="grid grid-cols-2 gap-3">
                                {/* All Professionals */}
                                <div
                                    className={`flex items-center justify-between border rounded-xl px-4 py-3 cursor-pointer transition-colors ${allProfessionals ? "border-blue-400 bg-blue-50" : "border-gray-200 bg-white"}`}
                                    onClick={() => setAllProfessionals(!allProfessionals)}
                                >
                                    <div className="flex items-center gap-2">
                                        <div className={`w-4 h-4 rounded flex items-center justify-center border ${allProfessionals ? "bg-blue-500 border-blue-500" : "border-gray-300"}`}>
                                            {allProfessionals && (
                                                <svg className="w-3 h-3 text-white" viewBox="0 0 12 12" fill="none">
                                                    <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                            )}
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-800">All Professionals</p>
                                            <p className="text-xs text-gray-500">Send to service providers</p>
                                        </div>
                                    </div>
                                    <svg className="w-5 h-5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                        <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </div>

                                {/* All Customers */}
                                <div
                                    className={`flex items-center justify-between border rounded-xl px-4 py-3 cursor-pointer transition-colors ${allCustomers ? "border-blue-400 bg-blue-50" : "border-gray-200 bg-white"}`}
                                    onClick={() => setAllCustomers(!allCustomers)}
                                >
                                    <div className="flex items-center gap-2">
                                        <div className={`w-4 h-4 rounded flex items-center justify-center border ${allCustomers ? "bg-blue-500 border-blue-500" : "border-gray-300"}`}>
                                            {allCustomers && (
                                                <svg className="w-3 h-3 text-white" viewBox="0 0 12 12" fill="none">
                                                    <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                            )}
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-800">All Customers</p>
                                            <p className="text-xs text-gray-500">Send to end users</p>
                                        </div>
                                    </div>
                                    <svg className="w-5 h-5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                        <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={handleSend}
                            disabled={isSending || !title.trim() || !message.trim() || (!allProfessionals && !allCustomers)}
                            className="w-full bg-yellow-400 hover:bg-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-white font-semibold py-3 rounded-xl text-sm cursor-pointer"
                        >
                            {isSending ? "Sending..." : "Send Notification"}
                        </button>
                    </div>

                    {/* Recent Announcements */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm">
                        <h2 className="font-semibold text-gray-900 text-base mb-4">Recent Announcements</h2>

                        {isLoadingAnnouncements ? (
                            <div className="flex flex-col gap-3">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="py-4 animate-pulse">
                                        <div className="h-3.5 bg-gray-100 rounded w-1/3 mb-2" />
                                        <div className="h-3 bg-gray-100 rounded w-2/3 mb-2" />
                                        <div className="h-3 bg-gray-100 rounded w-1/4" />
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col divide-y divide-gray-100">
                                {announcements.map((ann: Announcement) => (
                                    <div key={ann.id} className="py-4 flex items-start justify-between">
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-semibold text-gray-800">{ann.title}</p>
                                            <p className="text-xs text-gray-500 mt-0.5 truncate">{ann.message}</p>
                                            <div className="flex items-center gap-2 mt-1.5">
                                                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                                                    {audienceLabel[ann.target_audience] ?? ann.target_audience}
                                                </span>
                                                <span className="text-xs text-gray-400">{timeAgo(ann.sent_at)}</span>
                                            </div>
                                        </div>
                                        <span className="ml-4 mt-0.5 text-xs font-medium text-green-600 border border-green-200 bg-green-50 px-2.5 py-1 rounded-full whitespace-nowrap">
                                            Sent
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Column - Automatic Triggers */}
                <div className="bg-white rounded-2xl p-6 shadow-sm h-fit">
                    <div className="flex items-center gap-2 mb-1">
                        <span className="text-yellow-400 text-lg">🔔</span>
                        <h2 className="font-semibold text-gray-900 text-base">Automatic Triggers</h2>
                    </div>
                    <p className="text-xs text-gray-500 mb-5">Manage automated notifications sent based on system events.</p>

                    <div className="flex flex-col gap-4">
                        {triggers.map((trigger) => (
                            <div key={trigger.id} className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-800">{trigger.label}</p>
                                    <p className="text-xs text-gray-500">To: {trigger.target}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Toggle enabled={trigger.enabled} onChange={() => toggleTrigger(trigger.id)} />
                                    <button
                                        onClick={() => deleteTrigger(trigger.id)}
                                        className="text-gray-400 hover:text-red-400 transition-colors"
                                    >
                                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                            <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}