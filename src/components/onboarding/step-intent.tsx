"use client";

import { motion } from "framer-motion";
import { Film, Wrench, Handshake, Search } from "lucide-react";

type Intent = "creator" | "freelancer" | "both" | "exploring" | "";

interface Props {
  value: Intent;
  onChange: (v: Intent) => void;
  onNext: () => void;
}

const OPTIONS: { key: Exclude<Intent, "">; emoji: string; icon: typeof Film; title: string; desc: string; color: string; bg: string }[] = [
  {
    key: "creator", emoji: "🎬", icon: Film,
    title: "I create content and need help",
    desc: "Hire editors, writers, designers",
    color: "text-brand-coral", bg: "border-brand-coral bg-brand-coral/5",
  },
  {
    key: "freelancer", emoji: "🛠️", icon: Wrench,
    title: "I offer creative services",
    desc: "Get hired for editing, design, writing",
    color: "text-brand-indigo", bg: "border-brand-indigo bg-brand-indigo/5",
  },
  {
    key: "both", emoji: "🤝", icon: Handshake,
    title: "Both — I create AND offer services",
    desc: "Best of both worlds",
    color: "text-emerald-600", bg: "border-emerald-500 bg-emerald-50",
  },
  {
    key: "exploring", emoji: "🔍", icon: Search,
    title: "Just exploring for now",
    desc: "Take a look around, no pressure",
    color: "text-brand-gray", bg: "border-brand-gray/40 bg-brand-surface",
  },
];

export default function StepIntent({ value, onChange, onNext }: Props) {
  const handleSelect = (key: Exclude<Intent, "">) => {
    onChange(key);
  };

  return (
    <div>
      <div className="mb-6 text-center">
        <h1 className="text-xl font-bold text-brand-dark sm:text-2xl">
          What brings you to <span className="text-brand-coral">CreateCrew</span>?
        </h1>
        <p className="mt-1.5 text-sm text-brand-gray">
          This helps us personalise your experience. You can change this later.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {OPTIONS.map((opt, i) => {
          const selected = value === opt.key;
          return (
            <motion.button
              key={opt.key}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06, duration: 0.25 }}
              onClick={() => handleSelect(opt.key)}
              className={`group relative rounded-lg border-2 p-5 text-left transition-all ${
                selected ? opt.bg : "border-border/60 bg-white hover:border-border"
              }`}
            >
              <span className="mb-2 block text-2xl">{opt.emoji}</span>
              <h3 className={`text-sm font-bold ${selected ? opt.color : "text-brand-dark"}`}>
                {opt.title}
              </h3>
              <p className="mt-1 text-xs text-brand-gray leading-relaxed">{opt.desc}</p>
              {selected && (
                <motion.div
                  layoutId="intent-check"
                  className={`absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full ${
                    opt.key === "creator" ? "bg-brand-coral" :
                    opt.key === "freelancer" ? "bg-brand-indigo" :
                    opt.key === "both" ? "bg-emerald-500" : "bg-brand-gray"
                  }`}
                >
                  <span className="text-[10px] text-white font-bold">✓</span>
                </motion.div>
              )}
            </motion.button>
          );
        })}
      </div>

      <button
        onClick={onNext}
        disabled={!value}
        className="mt-6 flex w-full items-center justify-center gap-2 rounded-md bg-brand-dark py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-dark/90 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        Continue
      </button>
    </div>
  );
}
