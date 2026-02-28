"use client";

import { motion } from "framer-motion";
import { categories } from "@/lib/categories-data";

interface CategoryPillsProps {
  activeCategory: string;
  onCategoryChange: (slug: string) => void;
  counts?: Record<string, number>;
}

const pills = [
  { slug: "all", title: "All" },
  ...categories.map((cat) => ({ slug: cat.slug, title: cat.title })),
];

export default function CategoryPills({ activeCategory, onCategoryChange, counts = {} }: CategoryPillsProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2 }}
      className="border-b border-border/40 bg-white"
    >
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="flex items-center gap-2 overflow-x-auto py-4 scrollbar-hide">
          {pills.map((pill) => {
            const count = counts[pill.slug];
            return (
              <button
                key={pill.slug}
                onClick={() => onCategoryChange(pill.slug)}
                className={`flex-shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  activeCategory === pill.slug
                    ? "bg-[#F26522] text-white"
                    : "bg-[#F9FAFB] text-[#6B7280] hover:bg-[#E5E7EB]/50 hover:text-[#111827]"
                }`}
              >
                {pill.title}
                {count !== undefined && pill.slug !== "all" && (
                  <span className={`ml-1 ${
                    activeCategory === pill.slug ? "text-white/70" : "text-[#9CA3AF]"
                  }`}>
                    ({count})
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
