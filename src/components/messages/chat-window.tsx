"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Send, Paperclip, MoreVertical, Briefcase } from "lucide-react";
import { Conversation, Message } from "@/lib/mock-messages";
import { useAuth } from "@/lib/auth-context";

interface ChatWindowProps {
  conversation: Conversation;
  onBack: () => void;
}

export default function ChatWindow({ conversation, onBack }: ChatWindowProps) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>(conversation.messages);
  const [reply, setReply] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  const otherUser = conversation.participants.find((p) => p.id !== user?.username) || conversation.participants[0];

  // Scroll to bottom on load or new message
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, conversation.id]);

  // When props change (meaning selected a new chat)
  useEffect(() => {
    setMessages(conversation.messages);
  }, [conversation]);

  const handleSend = () => {
    if (!reply.trim() || !user) return;
    
    const newMsg: Message = {
      id: `m-new-${Date.now()}`,
      senderId: user.username,
      text: reply.trim(),
      timestamp: "Just now",
      status: "sent",
    };

    setMessages([...messages, newMsg]);
    setReply("");
  };

  return (
    <div className="flex h-full flex-col bg-[#F9FAFB]">
      {/* Header */}
      <div className="flex shrink-0 items-center justify-between bg-white px-4 py-3 border-b border-[#E5E7EB] shadow-sm">
        <div className="flex items-center gap-3">
          <button 
            onClick={onBack}
            className="md:hidden flex h-8 w-8 items-center justify-center text-[#6B7280] hover:text-[#111827]"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          
          <div className="relative">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#111827] text-xs font-bold text-white">
              {otherUser.avatar}
            </div>
            <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-white bg-[#10B981]" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-[#111827]">{otherUser.name}</h2>
            <p className="text-[10px] text-[#10B981] font-medium">Online</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {conversation.relatedJobId && (
            <Link 
              href={`/find-work/${conversation.relatedJobId}`}
              className="hidden lg:flex items-center gap-1.5 rounded-lg border border-[#E5E7EB] bg-white px-3 py-1.5 text-xs font-bold text-[#4B5563] transition-colors hover:bg-[#F9FAFB] hover:text-[#111827]"
            >
              <Briefcase className="h-3.5 w-3.5" />
              View Related Gig
            </Link>
          )}
          <button className="flex h-8 w-8 items-center justify-center rounded-full text-[#9CA3AF] hover:bg-[#F3F4F6] hover:text-[#111827]">
            <MoreVertical className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Simple Time separator mock */}
        <div className="flex justify-center">
          <span className="rounded-full bg-[#E5E7EB] px-3 py-1 text-[10px] font-bold text-[#6B7280]">
            Yesterday, or earlier
          </span>
        </div>

        {messages.map((msg, index) => {
          const isMe = msg.senderId === user?.username;
          // In a real app we'd group sequential messages by same user, but for now we render bubbles standalone
          return (
            <div key={msg.id} className={`flex w-full ${isMe ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[75%] sm:max-w-[60%] flex flex-col ${isMe ? "items-end" : "items-start"}`}>
                <div 
                  className={`rounded-2xl px-4 py-2.5 text-sm shadow-sm ${
                    isMe 
                      ? "bg-[#F26522] text-white rounded-br-sm" 
                      : "bg-white border border-[#E5E7EB] text-[#111827] rounded-bl-sm"
                  }`}
                >
                  {msg.text}
                </div>
                <div className="mt-1 flex items-center gap-1.5 px-1">
                  <span className="text-[9px] font-medium text-[#9CA3AF]">{msg.timestamp}</span>
                  {isMe && msg.status && (
                    <span className={`text-[9px] font-bold ${msg.status === "read" ? "text-[#10B981]" : "text-[#9CA3AF]"}`}>
                      {msg.status === "read" ? "Read" : "Sent"}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={endRef} />
      </div>

      {/* Composer Bottom */}
      <div className="bg-white p-4 border-t border-[#E5E7EB]">
        <div className="flex items-end gap-2 rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] p-1.5 focus-within:border-[#F26522] focus-within:ring-1 focus-within:ring-[#F26522]">
          <button className="shrink-0 flex h-9 w-9 items-center justify-center rounded-lg text-[#9CA3AF] hover:text-[#4B5563]">
            <Paperclip className="h-5 w-5" />
          </button>
          <textarea
            value={reply}
            onChange={(e) => setReply(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Type your message..."
            className="max-h-32 min-h-[36px] w-full resize-none border-none bg-transparent py-2 text-sm text-[#111827] placeholder-[#9CA3AF] outline-none"
            rows={1}
          />
          <button 
            onClick={handleSend}
            disabled={!reply.trim()}
            className="shrink-0 flex h-9 w-9 items-center justify-center rounded-lg bg-[#F26522] text-white transition-transform hover:scale-105 hover:bg-[#D4551A] disabled:opacity-50 disabled:hover:scale-100"
          >
            <Send className="h-4 w-4 ml-1" />
          </button>
        </div>
        <div className="mt-2 text-center">
          <p className="text-[10px] text-[#9CA3AF]">
            Press <strong className="font-bold">Enter</strong> to send. All messages are securely encrypted.
          </p>
        </div>
      </div>
    </div>
  );
}
