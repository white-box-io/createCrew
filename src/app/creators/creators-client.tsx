"use client";

import { useState, useMemo } from "react";
import { ChevronDown } from "lucide-react";
import { motion } from "framer-motion";
import { mockCreators } from "@/lib/mock-creators";
import CreatorsHero from "@/components/creators/creators-hero";
import CreatorCard from "@/components/creators/creator-card";

const nichePills = [
  "All",
  ...Array.from(new Set(mockCreators.map((c) => c.niche))).sort(),
];

const sortOptions = ["Most Subscribers", "Most Jobs", "A–Z"];

export default function CreatorsClient() {
  const [activeNiche, setActiveNiche] = useState("All");
  const [sortBy, setSortBy] = useState("Most Subscribers");
  const [showSort, setShowSort] = useState(false);

  const creators = useMemo(() => {
    let list = activeNiche === "All"
      ? [...mockCreators]
      : mockCreators.filter((c) => c.niche === activeNiche);

    switch (sortBy) {
      case "Most Jobs":
        list.sort((a, b) => b.activeJobs - a.activeJobs);
        break;
      case "A–Z":
        list.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default: // Most Subscribers — parse subscriber string
        list.sort((a, b) => {
          const parse = (s: string) => {
            const num = parseFloat(s);
            if (s.includes("M")) return num * 1_000_000;
            if (s.includes("K")) return num * 1_000;
            return num;
          };
          return parse(b.subscribers) - parse(a.subscribers);
        });
    }
    return list;
  }, [activeNiche, sortBy]);

  return (
    <>
      <CreatorsHero />
      <section className="bg-white py-8 lg:py-12">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          {/* Niche Pills */}
          <div className="mb-6 flex items-center gap-2 overflow-x-auto scrollbar-hide">
            {nichePills.map((niche) => (
              <button
                key={niche}
                onClick={() => setActiveNiche(niche)}
                className={`flex-shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  activeNiche === niche
                    ? "bg-brand-coral text-white"
                    : "bg-brand-surface text-brand-gray hover:bg-brand-surface-alt hover:text-brand-dark"
                }`}
              >
                {niche}
              </button>
            ))}
          </div>

          {/* Toolbar */}
          <div className="mb-6 flex items-center justify-between">
            <p className="text-sm text-brand-gray">
              <span className="font-semibold text-brand-dark">{creators.length}</span> creators
            </p>
            <div className="relative">
              <button
                onClick={() => setShowSort(!showSort)}
                className="flex items-center gap-1.5 rounded-md border border-border/60 bg-white px-3 py-2 text-xs font-medium text-brand-dark transition-colors hover:border-brand-coral/30"
              >
                Sort: {sortBy}
                <ChevronDown className="h-3 w-3 text-brand-gray" />
              </button>
              {showSort && (
                <motion.div
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute right-0 top-full z-10 mt-1 w-48 rounded-md border border-border/60 bg-white py-1 shadow-lg"
                >
                  {sortOptions.map((opt) => (
                    <button
                      key={opt}
                      onClick={() => { setSortBy(opt); setShowSort(false); }}
                      className={`w-full px-3 py-2 text-left text-xs font-medium transition-colors ${
                        sortBy === opt ? "bg-brand-surface text-brand-coral" : "text-brand-gray hover:bg-brand-surface hover:text-brand-dark"
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </motion.div>
              )}
            </div>
          </div>

          {/* Grid */}
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {creators.map((creator) => (
              <CreatorCard key={creator.username} creator={creator} />
            ))}
          </div>

          {/* Empty State */}
          {creators.length === 0 && (
            <div className="py-16 text-center">
              <p className="text-lg font-semibold text-brand-dark">No creators found</p>
              <p className="mt-1 text-sm text-brand-gray">Try selecting a different niche.</p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
