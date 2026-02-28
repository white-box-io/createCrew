"use client";

import { motion } from "framer-motion";
import { Lightbulb, CheckCircle2, Shield, Users, Clock } from "lucide-react";
import { useAuth } from "@/lib/auth-context";

const tips = [
  "Use guided description fields — they help freelancers understand exactly what you need.",
  "Set a category-appropriate budget. We show suggested ranges to help.",
  "Requesting a test sample reduces spam applications by 90%.",
  "Jobs with clear timelines get 2x more quality proposals.",
  "'Auto-match' lets us surface the 3-5 best-fit freelancers for you.",
];

export default function PostJobSidebar() {
  const { user } = useAuth();

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.15 }}
    >
      {/* Tips */}
      <div className="rounded-lg border border-border/60 bg-white p-5">
        <div className="mb-4 flex items-center gap-2 text-brand-dark">
          <Lightbulb className="h-4 w-4 text-brand-coral" />
          <h3 className="text-sm font-bold">Tips for a Great Post</h3>
        </div>
        <ul className="flex flex-col gap-3">
          {tips.map((tip, i) => (
            <li key={i} className="flex gap-2.5 text-xs leading-relaxed text-brand-gray">
              <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-brand-coral/60" />
              {tip}
            </li>
          ))}
        </ul>
      </div>

      {/* How It Works */}
      <div className="mt-5 rounded-lg border border-border/60 bg-brand-surface p-5">
        <h4 className="mb-3 text-sm font-bold text-brand-dark">How It Works</h4>
        <div className="flex flex-col gap-3 text-xs text-brand-gray">
          <div className="flex items-start gap-2.5">
            <Users className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-brand-indigo" />
            <span>Max <span className="font-semibold text-brand-dark">15 applications</span> per job — no spam flood</span>
          </div>
          <div className="flex items-start gap-2.5">
            <Clock className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-brand-indigo" />
            <span>Apps close in <span className="font-semibold text-brand-dark">48 hours</span> or when 15 bids arrive</span>
          </div>
          <div className="flex items-start gap-2.5">
            <Shield className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-brand-indigo" />
            <span>Shortlist up to <span className="font-semibold text-brand-dark">3 freelancers</span> to chat before hiring</span>
          </div>
        </div>
      </div>

      {/* Creator Profile Preview */}
      {user && (
        <div className="mt-5 rounded-lg border border-border/60 bg-white p-5">
          <h4 className="mb-3 text-sm font-bold text-brand-dark">Your Creator Profile</h4>
          <p className="mb-3 text-[10px] text-brand-gray">This is what freelancers see when they view your job.</p>
          <div className="flex items-center gap-3 rounded-md border border-border/40 bg-brand-surface p-3">
            <div
              className="flex h-10 w-10 items-center justify-center rounded-full text-xs font-bold text-white"
              style={{ background: `linear-gradient(135deg, ${user.gradientFrom}, ${user.gradientTo})` }}
            >
              {user.avatar}
            </div>
            <div>
              <p className="text-xs font-semibold text-brand-dark">{user.name}</p>
              <p className="text-[10px] text-brand-gray">@{user.username}</p>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}
