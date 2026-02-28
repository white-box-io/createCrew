"use client";

import { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronDown, Bookmark } from "lucide-react";
import { categories } from "@/lib/categories-data";
import { mockJobs, getPostedJobs, type Job } from "@/lib/mock-jobs";
import { getSavedJobIds } from "@/lib/saved-jobs";
import { useAuth } from "@/lib/auth-context";
import JobCard from "./job-card";
import JobFilters, { type JobFiltersState } from "./job-filters";

const categoryPills = [
  { slug: "all", label: "All" },
  ...categories.map((c) => ({ slug: c.slug, label: c.title })),
  { slug: "others", label: "Others" },
];

const sortOptions = ["Newest", "Budget: High to Low", "Budget: Low to High", "Most Applicants", "Closing Soon"];

function sortJobs(jobs: Job[], sortBy: string): Job[] {
  const copy = [...jobs];
  switch (sortBy) {
    case "Budget: High to Low":
      return copy.sort((a, b) => (b.budgetMax ?? 0) - (a.budgetMax ?? 0));
    case "Budget: Low to High":
      return copy.sort((a, b) => (a.budgetMin ?? 0) - (b.budgetMin ?? 0));
    case "Most Applicants":
      return copy.sort((a, b) => (b.currentApplications ?? 0) - (a.currentApplications ?? 0));
    case "Closing Soon":
      return copy.sort((a, b) => {
        const aRemaining = new Date(a.createdAt).getTime() + (a.applicationDeadlineHours ?? 48) * 3600000 - Date.now();
        const bRemaining = new Date(b.createdAt).getTime() + (b.applicationDeadlineHours ?? 48) * 3600000 - Date.now();
        return aRemaining - bRemaining;
      });
    default: // Newest
      return copy.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }
}

export default function JobGrid() {
  const { user } = useAuth();
  const [activeCategory, setActiveCategory] = useState("all");
  const [activeSubcategory, setActiveSubcategory] = useState("");
  const [sortBy, setSortBy] = useState("Newest");
  const [showSort, setShowSort] = useState(false);
  const [filters, setFilters] = useState<JobFiltersState>({});
  const [postedJobs, setPostedJobs] = useState<Job[]>([]);
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [showSaved, setShowSaved] = useState(false);

  useEffect(() => {
    setPostedJobs(getPostedJobs());
    if (user) setSavedIds(getSavedJobIds(user.username));
  }, [user]);

  const allJobs = useMemo(() => [...postedJobs, ...mockJobs], [postedJobs]);

  const selectedCat = categories.find((c) => c.slug === activeCategory);
  const subcategories = selectedCat?.subcategories || [];

  const handleCategoryChange = (slug: string) => {
    setActiveCategory(slug);
    setActiveSubcategory("");
  };

  const handleSubcategoryChange = (slug: string) => {
    setActiveSubcategory((prev) => (prev === slug ? "" : slug));
  };

  const filteredJobs = useMemo(() => {
    let pool = allJobs;

    // Saved filter
    if (showSaved) {
      pool = pool.filter((j) => savedIds.includes(j.id));
    }

    if (activeCategory !== "all" && !showSaved) {
      pool = pool.filter((j) => j.categorySlug === activeCategory);
    }

    if (activeSubcategory) {
      pool = pool.filter((j) => j.subcategorySlug === activeSubcategory);
    }

    if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
      pool = pool.filter((j) => {
        const jobMin = j.budgetMin ?? 0;
        const jobMax = j.budgetMax ?? 999999;
        const filterMin = filters.minPrice ?? 0;
        const filterMax = filters.maxPrice ?? 999999;
        return jobMin <= filterMax && jobMax >= filterMin;
      });
    }

    if (filters.delivery) {
      pool = pool.filter((j) => {
        const tl = j.timeline.toLowerCase();
        if (filters.delivery === "24h") return tl.includes("asap") || tl.includes("1 day") || tl.includes("24 hour");
        if (filters.delivery === "2-3d") return tl.includes("2 days") || tl.includes("3 days");
        if (filters.delivery === "4d+") return tl.includes("4 days") || tl.includes("5 days") || tl.includes("week") || tl.includes("month") || tl.includes("ongoing") || tl.includes("flexible");
        return true;
      });
    }

    return sortJobs(pool, sortBy);
  }, [allJobs, activeCategory, activeSubcategory, filters, sortBy, showSaved, savedIds]);

  const openCount = filteredJobs.filter((j) => j.status === "open").length;

  return (
    <>
      {/* Category Pills Header Row */}
      <div className="border-b border-border/40 bg-white pt-6 pb-2 sticky top-16 z-20">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-2">
            {categoryPills.map((cat) => (
              <button
                key={cat.slug}
                onClick={() => { handleCategoryChange(cat.slug); setShowSaved(false); }}
                className={`flex-shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  activeCategory === cat.slug && !showSaved
                    ? "bg-brand-indigo text-white"
                    : "bg-brand-surface text-brand-gray hover:bg-brand-surface-alt hover:text-brand-dark"
                }`}
              >
                {cat.label}
              </button>
            ))}
            {/* Saved pill */}
            <button
              onClick={() => setShowSaved(!showSaved)}
              className={`flex-shrink-0 flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                showSaved
                  ? "bg-brand-coral text-white"
                  : "bg-brand-surface text-brand-gray hover:bg-brand-surface-alt hover:text-brand-dark"
              }`}
            >
              <Bookmark className="h-3.5 w-3.5" /> Saved
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <section className="bg-brand-surface/30 min-h-screen py-8 lg:py-12">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-8">
            
            {/* Sidebar Filters */}
            <div className="hidden w-64 flex-shrink-0 lg:block">
              <JobFilters
                subcategories={subcategories}
                activeSubcategory={activeSubcategory}
                onSubcategoryChange={handleSubcategoryChange}
                filters={filters}
                onFiltersChange={setFilters}
                accentColor={selectedCat?.iconColor || "#E11D48"}
              />
            </div>

            {/* Main Grid */}
            <div className="flex-1">
              {/* Toolbar */}
              <div className="mb-6 flex items-center justify-between">
                <p className="text-sm text-brand-gray">
                  <span className="font-semibold text-brand-dark">{filteredJobs.length}</span> jobs
                  {openCount < filteredJobs.length && (
                    <span className="ml-1 text-[10px]">({openCount} open)</span>
                  )}
                </p>
                <div className="relative">
                  <button
                    onClick={() => setShowSort(!showSort)}
                    className="flex items-center gap-1.5 rounded-md border border-border/60 bg-white px-3 py-2 text-xs font-medium text-brand-dark transition-colors hover:border-border"
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
                            sortBy === opt ? "bg-brand-surface text-brand-indigo" : "text-brand-gray hover:bg-brand-surface hover:text-brand-dark"
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
              <div className="grid gap-5 sm:grid-cols-2">
                {filteredJobs.map((job) => (
                  <JobCard key={job.id} job={job} />
                ))}
              </div>

              {/* Empty State */}
              {filteredJobs.length === 0 && (
                <div className="rounded-lg border border-border/60 bg-white py-16 text-center shadow-sm mt-5">
                  <p className="text-lg font-semibold text-brand-dark">No jobs found</p>
                  <p className="mt-1 text-sm text-brand-gray">Try adjusting your filters or category.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
