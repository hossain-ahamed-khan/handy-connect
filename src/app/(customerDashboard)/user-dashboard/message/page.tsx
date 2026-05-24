"use client";

import { useEffect, useMemo, useState } from "react";
import { BsCheck2All } from "react-icons/bs";
import { FiMoreVertical, FiPaperclip, FiSend } from "react-icons/fi";
import { MdCallEnd } from "react-icons/md";

type MessageProps = {
  participantName?: string | null;
  participantRole?: string | null;
  participantInitials?: string | null;
  participantOnline?: boolean | null;
};

type ChatMessage = {
  id: number;
  sender: string;
  text: string;
  time: string;
  isMe: boolean;
};

export default function Message({
  participantName,
  participantRole,
  participantInitials,
  participantOnline,
}: MessageProps) {
  const [inputValue, setInputValue] = useState("");
  const [isTyping] = useState(true);
  const [connectionStatus, setConnectionStatus] = useState<"connecting" | "open" | "closed" | "error">("connecting");
  const [messages] = useState<ChatMessage[]>([]);

  const initials = useMemo(() => {
    if (participantInitials && participantInitials.trim()) {
      return participantInitials.toUpperCase();
    }
    if (!participantName) {
      return "--";
    }
    return participantName
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("") || "--";
  }, [participantInitials, participantName]);

  useEffect(() => {
    const socketUrl = "ws://handyapi.dsrt321.online/ws/chat/5/?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzgwMTk1Mzc4LCJpYXQiOjE3Nzk1OTA1NzgsImp0aSI6IjIyZTEyYWMzYTk1NjQ3MWNiMTRkODZlOTY2OGFlZWFiIiwidXNlcl9pZCI6IjIifQ.vXPoQ6IuVlWBzyCXwf_JNlSunuoEWfTF1qp-RioCFGI";
    const socket = new WebSocket(socketUrl);

    socket.addEventListener("open", () => setConnectionStatus("open"));
    socket.addEventListener("close", () => setConnectionStatus("closed"));
    socket.addEventListener("error", () => setConnectionStatus("error"));

    return () => {
      socket.close();
    };
  }, []);

  return (
    <div className="w-full h-[calc(100vh-80px)] bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex">
      <div className="flex-1 flex flex-col bg-white">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-50 bg-white">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-11 h-11 rounded-full bg-orange-400 text-white flex items-center justify-center font-bold text-sm">
                {initials}
              </div>
              {participantOnline && (
                <span className="absolute bottom-0.5 right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
              )}
            </div>
            <div>
              <div className="font-bold text-base text-gray-900 leading-tight">
                {participantName || "Chat"}
              </div>
              <div className="flex items-center gap-2 text-[12px] text-gray-400">
                <span>{participantRole || ""}</span>
                {participantOnline && (
                  <>
                    <span className="w-1 h-1 bg-green-500 rounded-full" />
                    <span className="text-green-500 font-semibold">Online</span>
                  </>
                )}
                <span
                  className={`ml-2 rounded-full px-2 py-0.5 text-[10px] font-semibold ${connectionStatus === "open"
                    ? "bg-emerald-100 text-emerald-700"
                    : connectionStatus === "error"
                      ? "bg-red-100 text-red-700"
                      : connectionStatus === "closed"
                        ? "bg-gray-100 text-gray-600"
                        : "bg-amber-100 text-amber-700"}`}
                >
                  {connectionStatus === "open" ? "Connected" : connectionStatus}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-gray-50 border border-gray-100 rounded-full px-4 py-1.5 text-[12px] text-gray-500 font-semibold">
              <MdCallEnd size={16} className="text-gray-400" />
              No Calls, Just Chat
            </div>
            <button className="text-gray-300 hover:text-gray-600 transition-colors">
              <FiMoreVertical size={20} />
            </button>
          </div>
        </div>

        {/* Messages List */}
        <div className="flex-1 overflow-y-auto px-8 py-6 flex flex-col gap-6 bg-[#FAFBFC]">
          <div className="flex items-center gap-4 my-2">
            <div className="flex-1 h-px bg-gray-200/60" />
            <span className="text-[11px] text-gray-400 font-bold uppercase tracking-widest">
              Today
            </span>
            <div className="flex-1 h-px bg-gray-200/60" />
          </div>

          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-white/70 px-6 py-10 text-center text-sm text-gray-400">
              No messages yet.
            </div>
          ) : (
            messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex items-start gap-3 ${msg.isMe ? "flex-row-reverse" : "flex-row"}`}
              >
                {!msg.isMe && (
                  <div className="w-9 h-9 rounded-full bg-orange-400 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-1">
                    {msg.sender}
                  </div>
                )}
                <div
                  className={`max-w-[70%] flex flex-col gap-1.5 ${msg.isMe ? "items-end" : "items-start"}`}
                >
                  <div
                    className={`px-5 py-3 text-[14px] leading-relaxed shadow-sm ${msg.isMe
                      ? "bg-orange-500 text-white rounded-2xl rounded-tr-none"
                      : "bg-white text-gray-700 border border-gray-100 rounded-2xl rounded-tl-none"
                      }`}
                  >
                    {msg.text}
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] text-gray-400 px-1">
                    {msg.time}
                    {msg.isMe && (
                      <BsCheck2All size={16} className="text-orange-500" />
                    )}
                  </div>
                </div>
              </div>
            ))
          )}

          {isTyping && messages.length > 0 && (
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-orange-400 text-white flex items-center justify-center font-bold text-xs shrink-0">
                {initials}
              </div>
              <div className="bg-white border border-gray-100 rounded-2xl rounded-tl-none px-4 py-3 flex gap-1.5 items-center shadow-sm">
                <span className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce" />
                <span className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce [animation-delay:0.2s]" />
                <span className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce [animation-delay:0.4s]" />
              </div>
            </div>
          )}
        </div>

        {/* Input Footer */}
        <div className="p-6 bg-white border-t border-gray-50">
          <div className="flex items-center gap-3 bg-gray-50 rounded-2xl px-5 py-3 border border-gray-100 focus-within:border-orange-200 transition-all">
            <button className="text-gray-400 hover:text-orange-500 transition-colors">
              <FiPaperclip size={20} />
            </button>
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 bg-transparent border-none outline-none text-sm text-gray-700 placeholder-gray-400"
            />
            <button
              className={`${inputValue ? "text-orange-500" : "text-gray-300"} transition-colors`}
            >
              <FiSend size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
