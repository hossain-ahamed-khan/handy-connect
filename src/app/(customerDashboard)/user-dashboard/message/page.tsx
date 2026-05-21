"use client";

import { useState } from "react";
import { BsCheck2All } from "react-icons/bs";
import { FiMoreVertical, FiPaperclip, FiSend } from "react-icons/fi";
import { MdCallEnd } from "react-icons/md";

const conversations = [
  {
    id: 1,
    initials: "MJ",
    name: "Mike Johnson",
    preview: "I can be there in 30 mins.",
    time: "10:42 AM",
    unread: 3,
    online: true,
    role: "Plumbing Specialist",
  },
  {
    id: 2,
    initials: "SD",
    name: "Sarah Davis",
    preview: "Thanks for the payment!",
    time: "Yesterday",
    unread: 0,
    online: false,
    role: "Client",
  },
  {
    id: 3,
    initials: "GT",
    name: "Green Thumbs",
    preview: "See you next Tuesday.",
    time: "Oct 20",
    unread: 0,
    online: false,
    role: "Landscaping",
  },
];

const messages = [
  {
    id: 1,
    sender: "MJ",
    text: "Hi Sarah! I received your request about the leaking pipe under the sink. I'm currently finishing a job nearby.",
    time: "10:30 AM",
    isMe: false,
  },
  {
    id: 2,
    sender: "Me",
    text: "Hi Mike, thanks for the quick response! Yes, it's leaking quite a bit. Do you think you can come by today?",
    time: "10:35 AM",
    isMe: true,
  },
  {
    id: 3,
    sender: "MJ",
    text: "Absolutely. Based on the AI diagnosis you uploaded, it looks like a standard P-trap replacement. I have the parts in my van. I can be there in 30 mins.",
    time: "10:42 AM",
    isMe: false,
  },
];

export default function Message() {
  const [activeConv, setActiveConv] = useState(1);
  const [inputValue, setInputValue] = useState("");
  const [isTyping] = useState(true);

  const active = conversations.find((c) => c.id === activeConv);

  return (
    // REMOVED items-center justify-center to allow it to fill the parent container
    <div className="w-full h-[calc(100vh-80px)] bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex">
      {/* Sidebar - Increased width to match image proportions */}
      <div className="w-72 border-r border-gray-100 flex flex-col bg-white shrink-0">
        <div className="px-6 py-5 text-xl font-bold text-gray-900">
          Messages
        </div>
        <div className="flex-1 overflow-y-auto">
          {conversations.map((conv) => (
            <div
              key={conv.id}
              onClick={() => setActiveConv(conv.id)}
              className={`flex items-center gap-3 px-6 py-4 cursor-pointer transition-colors relative ${conv.id === activeConv ? "bg-orange-50" : "hover:bg-gray-50"
                }`}
            >
              {/* Active Indicator Line */}
              {conv.id === activeConv && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-orange-400" />
              )}

              <div className="relative shrink-0">
                <div className="w-12 h-12 rounded-full bg-orange-400 text-white flex items-center justify-center font-bold text-sm">
                  {conv.initials}
                </div>
                {conv.online && (
                  <span className="absolute bottom-0.5 right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline">
                  <span className="font-bold text-sm text-gray-900 truncate">
                    {conv.name}
                  </span>
                  <span className="text-[11px] text-gray-400 ml-2 uppercase font-medium">
                    {conv.time}
                  </span>
                </div>
                <div className="flex justify-between items-center mt-1">
                  <p className="text-[13px] text-gray-500 truncate pr-2">
                    {conv.preview}
                  </p>
                  {conv.unread > 0 && (
                    <span className="bg-orange-400 text-white rounded-full min-w-5 h-5 text-[10px] font-black flex items-center justify-center px-1">
                      {conv.unread}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area - flex-1 ensures it fills the remaining space */}
      <div className="flex-1 flex flex-col bg-white">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-50 bg-white">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-11 h-11 rounded-full bg-orange-400 text-white flex items-center justify-center font-bold text-sm">
                {active?.initials}
              </div>
              {active?.online && (
                <span className="absolute bottom-0.5 right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
              )}
            </div>
            <div>
              <div className="font-bold text-base text-gray-900 leading-tight">
                {active?.name}
              </div>
              <div className="flex items-center gap-2 text-[12px] text-gray-400">
                <span>{active?.role}</span>
                {active?.online && (
                  <>
                    <span className="w-1 h-1 bg-green-500 rounded-full" />
                    <span className="text-green-500 font-semibold">Online</span>
                  </>
                )}
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

          {messages.map((msg) => (
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
          ))}

          {isTyping && (
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-orange-400 text-white flex items-center justify-center font-bold text-xs shrink-0">
                MJ
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
