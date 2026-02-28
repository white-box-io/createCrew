"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle2, Send } from "lucide-react";
import type { Freelancer } from "@/lib/mock-freelancers";

interface MessageModalProps {
  person: Freelancer;
  onClose: () => void;
}

const quickTemplates = [
  "Interested in hiring you",
  "Question about your gig",
  "Looking for a retainer",
  "Collab opportunity",
];

export default function MessageModal({ person, onClose }: MessageModalProps) {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  const firstName = person.name.split(" ")[0];

  const handleSend = () => {
    if (!message.trim()) return;
    setSent(true);
  };

  const handleTemplateClick = (template: string) => {
    setMessage(template);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 16 }}
          transition={{ duration: 0.2 }}
          className="w-full max-w-md rounded-xl bg-white shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {sent ? (
            /* Success State */
            <div className="p-8 text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#F0FDF4]">
                <CheckCircle2 className="h-7 w-7 text-[#16A34A]" />
              </div>
              <h3 className="text-lg font-bold text-[#111827]">Message sent!</h3>
              <p className="mt-2 text-sm text-[#6B7280]">
                {firstName} will reply to your CreateCrew inbox.
              </p>
              <button
                onClick={onClose}
                className="mt-6 w-full rounded-lg bg-[#F26522] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#D4551A]"
              >
                Close
              </button>
            </div>
          ) : (
            /* Form State */
            <>
              {/* Header */}
              <div className="flex items-center justify-between border-b border-[#E5E7EB] p-5">
                <div className="flex items-center gap-3">
                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-full text-xs font-bold text-white"
                    style={{ background: `linear-gradient(135deg, ${person.gradientFrom}, ${person.gradientTo})` }}
                  >
                    {person.avatar}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#111827]">Message {person.name}</h3>
                    <p className="text-[10px] text-[#9CA3AF]">@{person.username}</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-[#9CA3AF] transition-colors hover:bg-[#F9FAFB] hover:text-[#374151]"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Body */}
              <div className="p-5 space-y-4">
                {/* Subject */}
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-[#374151]">
                    Subject <span className="text-[#9CA3AF] font-normal">(optional)</span>
                  </label>
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="What's this about?"
                    className="w-full rounded-lg border border-[#E5E7EB] bg-white px-3 py-2.5 text-sm text-[#111827] placeholder:text-[#9CA3AF] outline-none transition-colors focus:border-[#F26522]/50"
                  />
                </div>

                {/* Quick Templates */}
                <div>
                  <p className="mb-2 text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-wide">Quick templates</p>
                  <div className="flex flex-wrap gap-1.5">
                    {quickTemplates.map((t) => (
                      <button
                        key={t}
                        onClick={() => handleTemplateClick(t)}
                        className={`rounded-full border px-3 py-1.5 text-[11px] font-medium transition-all duration-[180ms] ${
                          message === t
                            ? "border-[#F26522] bg-[#FFF3EE] text-[#F26522]"
                            : "border-[#E5E7EB] text-[#6B7280] hover:border-[#F26522]/30 hover:text-[#374151]"
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-[#374151]">
                    Message
                  </label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value.slice(0, 500))}
                    placeholder={`Hi ${firstName}, I saw your profile on CreateCrew...`}
                    rows={4}
                    className="w-full resize-none rounded-lg border border-[#E5E7EB] bg-white px-3 py-2.5 text-sm text-[#111827] placeholder:text-[#9CA3AF] outline-none transition-colors focus:border-[#F26522]/50"
                  />
                  <p className="mt-1 text-right text-[10px] text-[#9CA3AF]">
                    {message.length}/500
                  </p>
                </div>
              </div>

              {/* Footer */}
              <div className="border-t border-[#E5E7EB] p-5">
                <button
                  onClick={handleSend}
                  disabled={!message.trim()}
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#F26522] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#D4551A] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="h-4 w-4" />
                  Send Message →
                </button>
              </div>
            </>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
