"use client";

import { useState } from "react";
import ChatList from "@/components/messages/chat-list";
import ChatWindow from "@/components/messages/chat-window";
import { mockConversations } from "@/lib/mock-messages";
import { useAuth } from "@/lib/auth-context";

export default function MessagesPage() {
  const { user } = useAuth();
  
  // For the sake of the mockup, we pretend the active user is the first participant of the first chat
  // But ideally, we default to the first conversation they are a part of
  const [activeChatId, setActiveChatId] = useState<string | null>(
    mockConversations.length > 0 ? mockConversations[0].id : null
  );

  const activeChat = mockConversations.find((c) => c.id === activeChatId) || null;

  return (
    <div className="flex h-[calc(100vh-4rem)] w-full overflow-hidden bg-white border-t border-[#E5E7EB]">
      {/* 
        Responsive behavior: 
        On mobile, if a chat is selected, hide the list entirely. 
        On desktop, always show the list panel on the left.
      */}
      <div 
        className={`w-full shrink-0 border-r border-[#E5E7EB] md:block md:w-80 lg:w-96 ${
          activeChatId ? "hidden" : "block"
        }`}
      >
        <ChatList 
          conversations={mockConversations} 
          activeId={activeChatId} 
          onSelect={(id) => setActiveChatId(id)} 
        />
      </div>

      <div 
        className={`flex-1 flex flex-col ${
          !activeChatId ? "hidden md:flex" : "flex"
        }`}
      >
        {activeChat ? (
          <ChatWindow 
            conversation={activeChat} 
            onBack={() => setActiveChatId(null)}
          />
        ) : (
          <div className="flex h-full flex-col items-center justify-center bg-[#F9FAFB] text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#E5E7EB]">
              <svg className="h-8 w-8 text-[#9CA3AF]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 0 1-.923 1.785A5.969 5.969 0 0 0 6 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337Z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-[#111827]">Your Messages</h3>
            <p className="mt-1 max-w-sm text-sm text-[#6B7280]">Select a conversation from the sidebar to start chatting.</p>
          </div>
        )}
      </div>
    </div>
  );
}
