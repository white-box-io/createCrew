"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { Conversation } from "@/lib/mock-messages";
import { useAuth } from "@/lib/auth-context";

interface ChatListProps {
  conversations: Conversation[];
  activeId: string | null;
  onSelect: (id: string) => void;
}

export default function ChatList({ conversations, activeId, onSelect }: ChatListProps) {
  const { user } = useAuth();
  const [search, setSearch] = useState("");
  const showToggle = user?.creatorMode && user?.freelancerMode;
  const [contextMode, setContextMode] = useState<"creator" | "freelancer">(
    user?.creatorMode ? "creator" : "freelancer"
  );

  const filtered = conversations.filter((c) => {
    // Determine the user's role in this conversation
    const myParticipant = c.participants.find((p) => p.id === user?.username);
    
    // If the user is dual-role and is in this conversation, 
    // filter out conversations that don't match the current toggle.
    if (showToggle && myParticipant && myParticipant.role !== contextMode) {
       return false;
    }

    // Find the OTHER participant to search against their name
    const other = c.participants.find((p) => p.id !== user?.username) || c.participants[0];
    if (!other) return false;
    return other.name.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div className="flex h-full flex-col bg-white">
      {/* Search Header */}
      <div className="shrink-0 border-b border-[#E5E7EB] p-4">
        <h2 className="mb-4 text-xl font-extrabold text-[#111827]">Messages</h2>
        <div className={`relative ${showToggle ? "mb-4" : ""}`}>
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9CA3AF]" />
          <input
            type="text"
            placeholder="Search conversations..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg bg-[#F3F4F6] py-2.5 pl-9 pr-4 text-sm text-[#111827] placeholder-[#9CA3AF] outline-none transition-colors focus:bg-white focus:ring-2 focus:ring-[#F26522]/20"
          />
        </div>

        {/* Toggle Mode */}
        {showToggle && (
          <div className="flex w-full rounded-lg bg-[#F3F4F6] p-1">
            <button
              onClick={() => setContextMode("creator")}
              className={`flex-1 rounded-md py-1.5 text-xs font-bold transition-all ${
                contextMode === "creator"
                  ? "bg-white text-[#111827] shadow-sm"
                  : "text-[#6B7280] hover:text-[#374151]"
              }`}
            >
              Hiring
            </button>
            <button
              onClick={() => setContextMode("freelancer")}
              className={`flex-1 rounded-md py-1.5 text-xs font-bold transition-all ${
                contextMode === "freelancer"
                  ? "bg-white text-[#111827] shadow-sm"
                  : "text-[#6B7280] hover:text-[#374151]"
              }`}
            >
              Working
            </button>
          </div>
        )}
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto scrollbar-hide">
        {filtered.length === 0 ? (
          <div className="p-6 text-center text-sm text-[#6B7280]">
            No conversations found.
          </div>
        ) : (
          filtered.map((chat) => {
            const otherUser = chat.participants.find((p) => p.id !== user?.username) || chat.participants[0];
            const isActive = activeId === chat.id;

            return (
              <button
                key={chat.id}
                onClick={() => onSelect(chat.id)}
                className={`flex w-full cursor-pointer items-start gap-3 border-b border-[#F3F4F6] p-4 text-left transition-colors hover:bg-[#F9FAFB] ${
                  isActive ? "bg-[#FFF8F5]" : "bg-white"
                }`}
              >
                <div className="relative shrink-0">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-[#111827] to-[#4B5563] text-sm font-bold text-white shadow-sm">
                    {otherUser.avatar}
                  </div>
                  {/* Online Dot (Mock) */}
                  <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-[#10B981]" />
                </div>

                <div className="flex-1 overflow-hidden">
                  <div className="flex items-center justify-between">
                    <h3 className={`truncate text-sm font-bold ${isActive ? "text-[#F26522]" : "text-[#111827]"}`}>
                      {otherUser.name}
                    </h3>
                    <span className="shrink-0 text-[10px] font-medium text-[#9CA3AF]">
                      {chat.lastUpdated}
                    </span>
                  </div>
                  <p className={`mt-0.5 truncate text-xs ${chat.unreadCount > 0 ? "font-bold text-[#111827]" : "text-[#6B7280]"}`}>
                    {chat.lastMessage}
                  </p>
                  
                  {/* Role Badge & Unread Count */}
                  <div className="mt-1.5 flex items-center justify-between">
                    <span className="rounded bg-[#F3F4F6] px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-[#6B7280]">
                      {otherUser.role}
                    </span>
                    {chat.unreadCount > 0 && (
                      <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#F26522] text-[9px] font-bold text-white">
                        {chat.unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}
