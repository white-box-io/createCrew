"use client";

import { motion } from "framer-motion";
import { categories, iconMap } from "@/lib/categories-data";

/* ── Creator niche options (platform/niche focused) ── */
const CREATOR_NICHES = [
  { key: "short-form", emoji: "📱", label: "Short-Form (Reels, Shorts, TikTok)" },
  { key: "youtube-long", emoji: "📺", label: "YouTube (Long Videos)" },
  { key: "podcast-audio", emoji: "🎙️", label: "Podcast / Audio" },
  { key: "instagram-photo", emoji: "📸", label: "Instagram / Photography" },
  { key: "gaming", emoji: "🎮", label: "Gaming" },
  { key: "family-kids", emoji: "👨‍👩‍👧", label: "Family / Kids Content" },
  { key: "business-edu", emoji: "💼", label: "Business / Education" },
  { key: "food-lifestyle", emoji: "🍕", label: "Food / Lifestyle / Vlog" },
];

interface Props {
  intent: string;
  selected: string[];
  onChange: (cats: string[]) => void;
  onNext: () => void;
}

export default function StepCategories({ intent, selected, onChange, onNext }: Props) {
  const isCreator = intent === "creator";
  const isFreelancer = intent === "freelancer";

  /* ── Freelancer: single-select from 9 service categories ── */
  if (isFreelancer) {
    return (
      <div>
        <div className="mb-5 text-center">
          <h1 className="text-xl font-bold text-brand-dark sm:text-2xl">What&apos;s your main skill?</h1>
          <p className="mt-1.5 text-sm text-brand-gray">Pick your primary category — you can add more later.</p>
        </div>
        <div className="grid gap-2.5 sm:grid-cols-3">
          {categories.map((cat, i) => {
            const Icon = iconMap[cat.iconName];
            const active = selected.includes(cat.slug);
            return (
              <motion.button
                key={cat.slug}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04, duration: 0.2 }}
                onClick={() => onChange(active ? [] : [cat.slug])}
                className={`relative flex flex-col items-center gap-2 rounded-lg border-2 p-4 text-center transition-all ${
                  active
                    ? "border-brand-indigo bg-brand-indigo/5 shadow-sm"
                    : "border-border/60 bg-white hover:border-brand-indigo/30"
                }`}
              >
                {Icon && (
                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-lg"
                    style={{ backgroundColor: active ? `${cat.iconColor}20` : "#F4F5F7" }}
                  >
                    <Icon className="h-5 w-5" style={{ color: active ? cat.iconColor : "#6B7280" }} />
                  </div>
                )}
                <p className={`text-xs font-semibold leading-tight ${active ? "text-brand-dark" : "text-brand-gray"}`}>
                  {cat.title}
                </p>
                {active && (
                  <div className="absolute right-2 top-2 flex h-4 w-4 items-center justify-center rounded-full bg-brand-indigo">
                    <span className="text-[8px] text-white font-bold">✓</span>
                  </div>
                )}
              </motion.button>
            );
          })}
        </div>
        <p className="mt-3 text-center text-[10px] text-brand-gray">You can add more categories later</p>
        <button
          onClick={onNext}
          disabled={selected.length === 0}
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-md bg-brand-dark py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-dark/90 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Continue
        </button>
      </div>
    );
  }

  /* ── Creator / Both: multi-select from platform niches ── */
  return (
    <div>
      <div className="mb-5 text-center">
        <h1 className="text-xl font-bold text-brand-dark sm:text-2xl">
          {isCreator ? "What kind of content do you make?" : "Pick your content niches"}
        </h1>
        <p className="mt-1.5 text-sm text-brand-gray">
          Select all that apply — we&apos;ll find you the right crew.
        </p>
      </div>
      <div className="grid gap-2.5 sm:grid-cols-2">
        {CREATOR_NICHES.map((niche, i) => {
          const active = selected.includes(niche.key);
          return (
            <motion.button
              key={niche.key}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04, duration: 0.2 }}
              onClick={() => {
                onChange(
                  active
                    ? selected.filter((s) => s !== niche.key)
                    : [...selected, niche.key]
                );
              }}
              className={`flex items-center gap-3 rounded-lg border-2 p-4 text-left transition-all ${
                active
                  ? "border-brand-coral bg-brand-coral/5 shadow-sm"
                  : "border-border/60 bg-white hover:border-brand-coral/30"
              }`}
            >
              <span className="text-xl">{niche.emoji}</span>
              <p className={`text-xs font-semibold ${active ? "text-brand-dark" : "text-brand-gray"}`}>
                {niche.label}
              </p>
              {active && (
                <div className="ml-auto flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-brand-coral">
                  <span className="text-[8px] text-white font-bold">✓</span>
                </div>
              )}
            </motion.button>
          );
        })}
      </div>
      <p className="mt-3 text-center text-[10px] text-brand-gray">
        Got it! We&apos;ll find you the right crew.
      </p>
      <button
        onClick={onNext}
        disabled={selected.length === 0}
        className="mt-5 flex w-full items-center justify-center gap-2 rounded-md bg-brand-dark py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-dark/90 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        Continue
      </button>
    </div>
  );
}
