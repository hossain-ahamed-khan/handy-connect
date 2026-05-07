"use client";
import { useState } from "react";

type DisputeStatus = "Active Dispute" | "Resolved" | "Open";

interface Chat {
    id: number;
    name: string;
    vs: string;
    time: string;
    preview: string;
    status: DisputeStatus;
    unread?: number;
}

interface Message {
    id: number;
    sender: "client" | "provider";
    initials: string;
    text: string;
    time: string;
}

const chats: Chat[] = [
    {
        id: 1,
        name: "Sarah Connor",
        vs: "T-800 Plumbing",
        time: "10:42 AM",
        preview: "The leak is still happening after the fix.",
        status: "Active Dispute",
        unread: 2,
    },
    {
        id: 2,
        name: "John Wick",
        vs: "Continental Cleaning",
        time: "Yesterday",
        preview: "Service was excellent, thank you.",
        status: "Resolved",
    },
    {
        id: 3,
        name: "Ellen Ripley",
        vs: "Nostromo HVAC",
        time: "Oct 23",
        preview: "When can you come back to check the vent?",
        status: "Open",
    },
];

const messages: Message[] = [
    {
        id: 1,
        sender: "client",
        initials: "SC",
        text: "Hi, I'm not satisfied with the work. The pipe is still leaking.",
        time: "10:30 AM",
    },
    {
        id: 2,
        sender: "provider",
        initials: "TB",
        text: "I fixed the main leak. That might be a secondary issue we didn't discuss.",
        time: "10:35 AM",
    },
    {
        id: 3,
        sender: "client",
        initials: "SC",
        text: "The leak is still happening after the fix. I paid for a complete repair.",
        time: "10:42 AM",
    },
];

const statusStyles: Record<DisputeStatus, string> = {
    "Active Dispute": "bg-orange-100 text-orange-600",
    Resolved: "bg-green-100 text-green-700",
    Open: "bg-blue-100 text-blue-600",
};

export default function DisputeResolution() {
    const [selectedChat, setSelectedChat] = useState<Chat>(chats[0]);
    const [message, setMessage] = useState("");

    return (
        <div className="flex items-center justify-center p-6 font-sans">
            <div className="w-full h-[740px] bg-white rounded-2xl shadow-lg overflow-hidden flex">

                {/* Left Sidebar */}
                <div className="w-72 border-r border-gray-100 flex flex-col flex-shrink-0">
                    <div className="p-5 pb-3">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Dispute Resolution</h2>
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search chats..."
                                className="w-full bg-gray-100 rounded-lg px-4 py-2 text-sm text-gray-500 placeholder-gray-400 focus:outline-none"
                            />
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto">
                        {chats.map((chat) => (
                            <button
                                key={chat.id}
                                onClick={() => setSelectedChat(chat)}
                                className={`w-full text-left px-5 py-4 border-b border-gray-50 transition-colors ${selectedChat.id === chat.id ? "bg-amber-50" : "hover:bg-gray-50"
                                    }`}
                            >
                                <div className="flex justify-between items-start mb-0.5">
                                    <span className="text-sm font-semibold text-gray-900">{chat.name}</span>
                                    <span className="text-xs text-gray-400">{chat.time}</span>
                                </div>
                                <div className="text-xs text-gray-400 mb-2">vs {chat.vs}</div>
                                <div className="text-xs text-gray-500 mb-2 truncate">{chat.preview}</div>
                                <div className="flex items-center justify-between">
                                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusStyles[chat.status]}`}>
                                        {chat.status}
                                    </span>
                                    {chat.unread && (
                                        <span className="bg-orange-400 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-semibold">
                                            {chat.unread}
                                        </span>
                                    )}
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Main Chat Area */}
                <div className="flex-1 flex flex-col min-w-0">
                    {/* Header */}
                    <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="font-semibold text-gray-900 text-base">Dispute #10234</span>
                                <span className="flex items-center gap-1 bg-red-50 text-red-500 text-xs px-2 py-0.5 rounded-full font-medium border border-red-100">
                                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
                                    Intervention Needed
                                </span>
                            </div>
                            <div className="text-sm text-gray-400 mt-0.5">
                                Between <span className="font-medium text-gray-600">Sarah Connor</span>
                                <span className="mx-1">and</span>
                                <span className="font-medium text-gray-600">T-800 Plumbing</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <button className="border border-gray-200 rounded-lg px-4 py-2 text-sm text-gray-700 font-medium hover:bg-gray-50 transition-colors">
                                View Job Details
                            </button>
                            <button className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white rounded-lg px-4 py-2 text-sm font-medium transition-colors">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Resolve Dispute
                            </button>
                            <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-400 transition-colors">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 5a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm0 7a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm0 7a1.5 1.5 0 110-3 1.5 1.5 0 010 3z" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
                        <div className="flex justify-center">
                            <span className="text-xs text-gray-400 bg-gray-100 px-3 py-1 rounded-full">Today, 10:23 AM</span>
                        </div>

                        {messages.map((msg) => (
                            <div
                                key={msg.id}
                                className={`flex items-end gap-3 ${msg.sender === "provider" ? "flex-row-reverse" : ""}`}
                            >
                                <div
                                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0 ${msg.sender === "client"
                                        ? "bg-blue-100 text-blue-600"
                                        : "bg-yellow-100 text-yellow-700"
                                        }`}
                                >
                                    {msg.initials}
                                </div>
                                <div className={`max-w-sm ${msg.sender === "provider" ? "items-end" : "items-start"} flex flex-col`}>
                                    <div
                                        className={`px-4 py-3 rounded-2xl text-sm ${msg.sender === "client"
                                            ? "bg-white border border-gray-100 text-gray-800 rounded-bl-sm"
                                            : "bg-yellow-50 border border-yellow-100 text-gray-800 rounded-br-sm"
                                            }`}
                                    >
                                        {msg.text}
                                    </div>
                                    <span className="text-xs text-gray-400 mt-1 px-1">{msg.time}</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Admin Note + Input */}
                    <div className="px-6 pb-5 pt-2 space-y-3">
                        <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-lg px-4 py-2.5">
                            <svg className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            <p className="text-xs text-gray-600">
                                <span className="font-semibold text-gray-700">Admin Note: </span>
                                You are viewing this chat in &quot;Silent Mode&quot;. Messages you send will be visible to both parties as &quot;Support Team&quot;.
                            </p>
                        </div>

                        <div className="flex items-center gap-2 border border-gray-200 rounded-xl px-4 py-2.5 bg-white">
                            <input
                                type="text"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder="Type a message to mediate..."
                                className="flex-1 text-sm text-gray-700 placeholder-gray-400 focus:outline-none bg-transparent"
                            />
                            <button className="w-9 h-9 bg-gray-900 hover:bg-gray-700 rounded-lg flex items-center justify-center transition-colors flex-shrink-0">
                                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}