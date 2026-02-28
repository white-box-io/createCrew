"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronDown, Search as SearchIcon, X } from "lucide-react";
import Link from "next/link";
import CrewCard from "./crew-card";
import type { Freelancer, SortOption } from "@/lib/mock-freelancers";
import {
  getRecentlyViewed,
  removeRecentlyViewed,
  clearRecentlyViewed,
  type RecentlyViewedEntry,
} from "@/lib/recently-viewed";

interface CrewGridProps {
  freelancers: Freelancer[];
  total: number;
  totalInCategory: number;
  sort: SortOption;
  onSortChange: (sort: SortOption) => void;
  hasMore: boolean;
  onShowMore: () => void;
  onViewProfile?: (person: Freelancer) => void;
  onMessage?: (person: Freelancer) => void;
  activeSubcategoryLabel?: string;
  activeBudgetLabel?: string;
  onClearSubcategory?: () => void;
  onClearBudget?: () => void;
  onClearAllFilters?: () => void;
  searchTerm?: string;
}

const sortOptions: { label: string; value: SortOption }[] = [
  { label: "Recommended", value: "relevance" },
  { label: "Highest Rated", value: "rating-desc" },
  { label: "Most Jobs Done", value: "jobs-done-desc" },
  { label: "Lowest Price", value: "price-asc" },
  { label: "Highest Price", value: "price-desc" },
  { label: "Fastest Delivery", value: "fastest" },
];

export default function CrewGrid({
  freelancers,
  total,
  totalInCategory,
  sort,
  onSortChange,
  hasMore,
  onShowMore,
  onViewProfile,
  onMessage,
  activeSubcategoryLabel,
  activeBudgetLabel,
  onClearSubcategory,
  onClearBudget,
  onClearAllFilters,
  searchTerm,
}: CrewGridProps) {
  const [showSort, setShowSort] = useState(false);
  const [recentlyViewed, setRecentlyViewed] = useState<RecentlyViewedEntry[]>([]);

  // Load recently viewed on mount and when freelancers change
  useEffect(() => {
    setRecentlyViewed(getRecentlyViewed());
  }, [freelancers]);

  const activeLabel = sortOptions.find((o) => o.value === sort)?.label || "Recommended";

  const hasSubFilter = !!activeSubcategoryLabel;
  const hasBudgetFilter = !!activeBudgetLabel;
  const hasAnyFilter = hasSubFilter || hasBudgetFilter;

  // Build context-aware filter labels
  const filterLabels: string[] = [];
  if (activeSubcategoryLabel) filterLabels.push(activeSubcategoryLabel);
  if (activeBudgetLabel) filterLabels.push(activeBudgetLabel);

  const handleRemoveRecent = (username: string) => {
    removeRecentlyViewed(username);
    setRecentlyViewed(getRecentlyViewed());
  };

  const handleClearAllRecent = () => {
    clearRecentlyViewed();
    setRecentlyViewed([]);
  };

  const showRecentStrip = recentlyViewed.length >= 2;

  return (
    <div className="flex-1">
      {/* Recently Viewed Strip */}
      {showRecentStrip && (
        <div className="mb-4 flex items-center gap-3 rounded-lg border border-[#E5E7EB] bg-[#F9FAFB] px-4 py-2.5">
          <span className="text-[11px] font-medium text-[#9CA3AF] whitespace-nowrap">Recently viewed:</span>
          <div className="flex items-center gap-2 overflow-x-auto flex-1">
            {recentlyViewed.map((entry) => (
              <div key={entry.username} className="flex items-center gap-1.5 flex-shrink-0">
                <Link
                  href={`/profile/@${entry.username}`}
                  className="flex items-center gap-1.5 rounded-full bg-white border border-[#E5E7EB] px-2 py-1 text-[11px] font-medium text-[#374151] transition-colors hover:border-[#F26522]/30 hover:text-[#F26522]"
                >
                  <div
                    className="flex h-5 w-5 items-center justify-center rounded-full text-[8px] font-bold text-white"
                    style={{ background: `linear-gradient(135deg, ${entry.gradientFrom}, ${entry.gradientTo})` }}
                  >
                    {entry.avatar}
                  </div>
                  {entry.name.split(" ")[0]}
                </Link>
                <button
                  onClick={() => handleRemoveRecent(entry.username)}
                  className="flex h-4 w-4 items-center justify-center rounded-full text-[#9CA3AF] transition-colors hover:text-[#EF4444]"
                >
                  <X className="h-2.5 w-2.5" />
                </button>
              </div>
            ))}
          </div>
          <button
            onClick={handleClearAllRecent}
            className="text-[10px] font-medium text-[#F26522] hover:underline whitespace-nowrap"
          >
            Clear all
          </button>
        </div>
      )}

      {/* Toolbar */}
      <div className="mb-6 flex items-center justify-between">
        {/* Context-aware results count */}
        <p className="text-sm text-[#6B7280]">
          {hasAnyFilter ? (
            <>
              Showing <span className="font-semibold text-[#111827]">{total}</span>
              {totalInCategory > 0 && ` of ${totalInCategory}`}
              {filterLabels.length > 0 && (
                <> · {filterLabels.join(" · ")}</>
              )}
              {" "}
              <button
                onClick={onClearAllFilters}
                className="text-xs font-semibold text-[#F26522] hover:underline ml-1"
              >
                Clear all filters
              </button>
            </>
          ) : (
            <>
              <span className="font-semibold text-[#111827]">{total}</span> freelancers available
            </>
          )}
        </p>

        {/* Sort dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowSort(!showSort)}
            className="flex items-center gap-1.5 rounded-lg border border-[#E5E7EB] bg-white px-3 py-2 text-xs font-medium text-[#111827] transition-colors hover:border-[#F26522]/30"
          >
            Sort: {activeLabel}
            <ChevronDown className="h-3 w-3 text-[#6B7280]" />
          </button>
          {showSort && (
            <motion.div
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute right-0 top-full z-10 mt-1 w-48 rounded-lg border border-[#E5E7EB] bg-white py-1 shadow-lg"
            >
              {sortOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => { onSortChange(opt.value); setShowSort(false); }}
                  className={`w-full px-3 py-2 text-left text-xs font-medium transition-colors ${
                    sort === opt.value ? "bg-[#FFF3EE] text-[#F26522]" : "text-[#6B7280] hover:bg-[#F9FAFB] hover:text-[#111827]"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </motion.div>
          )}
        </div>
      </div>

      {/* Grid */}
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {freelancers.map((person) => (
          <CrewCard key={person.id} person={person} onViewProfile={onViewProfile} onMessage={onMessage} />
        ))}
      </div>

      {/* Empty States */}
      {freelancers.length === 0 && (
        <div className="py-16 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#F9FAFB]">
            <SearchIcon className="h-5 w-5 text-[#9CA3AF]" />
          </div>
          {searchTerm ? (
            <>
              <p className="text-sm font-medium text-[#374151]">
                No results for &ldquo;{searchTerm}&rdquo;.
              </p>
              <p className="mt-1 text-xs text-[#9CA3AF]">
                Try different keywords or browse by category.
              </p>
            </>
          ) : hasBudgetFilter ? (
            <>
              <p className="text-sm font-medium text-[#374151]">
                No freelancers found {activeBudgetLabel?.toLowerCase()} in this category.
              </p>
              <p className="mt-1 text-xs text-[#9CA3AF]">
                Try a higher budget range or browse all prices.
              </p>
            </>
          ) : (
            <>
              <p className="text-sm font-medium text-[#374151]">
                No freelancers found for these filters.
              </p>
              <p className="mt-1 text-xs text-[#9CA3AF]">
                Try removing a filter or browsing a broader category.
              </p>
            </>
          )}
          {hasAnyFilter && (
            <button
              onClick={onClearAllFilters}
              className="mt-4 rounded-lg bg-[#F26522] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#D4551A]"
            >
              Clear All Filters
            </button>
          )}
        </div>
      )}

      {/* Show More */}
      {hasMore && (
        <div className="mt-8 flex justify-center">
          <button
            onClick={onShowMore}
            className="rounded-lg border border-[#E5E7EB] bg-white px-6 py-2.5 text-sm font-semibold text-[#111827] transition-colors hover:border-[#F26522]/30 hover:text-[#F26522]"
          >
            Show More ({total - freelancers.length} remaining)
          </button>
        </div>
      )}
    </div>
  );
}
