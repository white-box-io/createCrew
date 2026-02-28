"use client";

import { useState, useMemo, useCallback } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { ChevronDown, SlidersHorizontal, X, Search } from "lucide-react";
import Link from "next/link";
import FreelancerCard from "./freelancer-card";
import FreelancerSkeleton from "./freelancer-skeleton";
import {
  getFreelancersBySubcategory,
  getFreelancersByCategory,
  type SortOption,
  type FreelancerFilters,
} from "@/lib/mock-freelancers";
import type { Subcategory } from "@/lib/categories-data";

interface FreelancerSectionProps {
  categorySlug: string;
  subSlug: string;
  subcategory: Subcategory | undefined;
  accentColor: string;
}

const ITEMS_PER_PAGE = 10;

const sortOptions: { value: SortOption; label: string }[] = [
  { value: "relevance", label: "Relevance" },
  { value: "rating-desc", label: "Rating: High → Low" },
  { value: "price-asc", label: "Price: Low → High" },
  { value: "price-desc", label: "Price: High → Low" },
  { value: "fastest", label: "Fastest Delivery" },
];

const deliveryOptions = [
  { value: "24h", label: "Within 24 Hours" },
  { value: "2-3d", label: "2–3 Days" },
  { value: "4d+", label: "4+ Days" },
];

export default function FreelancerSection({
  categorySlug,
  subSlug,
  subcategory,
  accentColor,
}: FreelancerSectionProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // ── Read state from URL ──────────────────────────────────────────
  const currentSort = (searchParams.get("sort") as SortOption) || "relevance";
  const currentDelivery = searchParams.get("delivery") || "";
  const [showFilters, setShowFilters] = useState(false);
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);

  // ── URL sync helper ──────────────────────────────────────────────
  const updateParam = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [router, pathname, searchParams]
  );

  // ── Build filters object ─────────────────────────────────────────
  const filters: FreelancerFilters = useMemo(
    () => ({
      delivery: currentDelivery || undefined,
    }),
    [currentDelivery]
  );

  // ── Fetch data ───────────────────────────────────────────────────
  const { freelancers, total } = useMemo(() => {
    if (subSlug) {
      return getFreelancersBySubcategory(
        subSlug,
        currentSort,
        filters,
        0,
        visibleCount
      );
    }
    return getFreelancersByCategory(
      categorySlug,
      currentSort,
      filters,
      0,
      visibleCount
    );
  }, [subSlug, categorySlug, currentSort, filters, visibleCount]);

  const hasMore = visibleCount < total;
  const subTitle = subcategory?.title || "All Services";

  return (
    <section className="bg-brand-surface/30 py-8 lg:py-12">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        {/* ── Section heading ───────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-6"
        >
          <div className="flex items-center gap-2">
            <Search className="h-4 w-4 text-brand-gray-light" />
            <h2 className="text-lg font-bold text-brand-dark">
              {subSlug
                ? `Freelancers skilled in ${subTitle}`
                : "Top Freelancers in this Category"}
            </h2>
          </div>
          <p className="mt-1 text-sm text-brand-gray">
            {total} freelancer{total !== 1 ? "s" : ""} available
          </p>
        </motion.div>

        {/* ── Sort & Filter bar ──────────────────────────────────── */}
        <div className="mb-6 flex flex-wrap items-center gap-3">
          {/* Sort dropdown */}
          <div className="relative">
            <select
              value={currentSort}
              onChange={(e) => updateParam("sort", e.target.value)}
              className="appearance-none rounded-md border border-border/60 bg-white py-2 pl-3 pr-8 text-xs font-medium text-brand-dark outline-none transition-colors focus:border-brand-dark"
            >
              {sortOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-brand-gray" />
          </div>

          {/* Filter toggle button */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-1.5 rounded-md border px-3 py-2 text-xs font-medium transition-colors ${
              showFilters
                ? "border-brand-dark bg-brand-dark text-white"
                : "border-border/60 bg-white text-brand-gray hover:border-brand-dark hover:text-brand-dark"
            }`}
          >
            <SlidersHorizontal className="h-3.5 w-3.5" />
            Filters
          </button>

          {/* Active filter chips */}
          {currentDelivery && (
            <span className="flex items-center gap-1 rounded-md bg-white px-2.5 py-1.5 text-[11px] font-medium text-brand-dark border border-border/60">
              {deliveryOptions.find((d) => d.value === currentDelivery)?.label}
              <button
                onClick={() => updateParam("delivery", "")}
                className="ml-0.5 text-brand-gray hover:text-brand-dark"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}
        </div>

        {/* ── Filter panel (collapsible) ────────────────────────── */}
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6 overflow-hidden rounded-lg border border-border/50 bg-white p-5"
          >
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {/* Delivery time */}
              <div>
                <h4 className="mb-3 text-xs font-semibold uppercase tracking-wide text-brand-gray">
                  Delivery Time
                </h4>
                <div className="flex flex-col gap-2">
                  {deliveryOptions.map((opt) => (
                    <label
                      key={opt.value}
                      className="flex cursor-pointer items-center gap-2.5 text-sm text-brand-gray hover:text-brand-dark"
                    >
                      <input
                        type="radio"
                        name="delivery"
                        checked={currentDelivery === opt.value}
                        onChange={() => updateParam("delivery", opt.value)}
                        className="h-3.5 w-3.5 accent-brand-coral"
                      />
                      {opt.label}
                    </label>
                  ))}
                  {currentDelivery && (
                    <button
                      onClick={() => updateParam("delivery", "")}
                      className="mt-1 text-left text-xs text-brand-coral hover:underline"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>

              {/* Badges */}
              <div>
                <h4 className="mb-3 text-xs font-semibold uppercase tracking-wide text-brand-gray">
                  Badges
                </h4>
                <div className="flex flex-col gap-2">
                  {["Beginner-Friendly", "Retainer Available"].map((badge) => (
                    <label
                      key={badge}
                      className="flex cursor-pointer items-center gap-2.5 text-sm text-brand-gray hover:text-brand-dark"
                    >
                      <input
                        type="checkbox"
                        className="h-3.5 w-3.5 accent-brand-coral"
                      />
                      {badge}
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* ── Freelancer Grid ───────────────────────────────────── */}
        {freelancers.length > 0 ? (
          <>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {freelancers.map((f) => (
                <FreelancerCard
                  key={f.id}
                  freelancer={f}
                  accentColor={accentColor}
                />
              ))}
            </div>

            {/* Show More */}
            {hasMore && (
              <div className="mt-8 flex justify-center">
                <button
                  onClick={() =>
                    setVisibleCount((prev) => prev + ITEMS_PER_PAGE)
                  }
                  className="rounded-md border border-border/60 bg-white px-6 py-2.5 text-sm font-semibold text-brand-dark transition-all hover:border-brand-dark hover:shadow-sm"
                >
                  Show More Freelancers
                </button>
              </div>
            )}
          </>
        ) : (
          /* ── Empty State ──────────────────────────────────────── */
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border/60 bg-white py-16 text-center"
          >
            <div
              className="mb-4 flex h-14 w-14 items-center justify-center rounded-full text-2xl"
              style={{
                backgroundColor: `${accentColor}10`,
              }}
            >
              🔍
            </div>
            <h3 className="text-lg font-bold text-brand-dark">
              No {subTitle.toLowerCase()} pros found yet
            </h3>
            <p className="mt-2 max-w-sm text-sm text-brand-gray">
              Be the first to hire in this category — drop a job and let
              freelancers come to you!
            </p>
            <Link
              href="/post-job"
              className="mt-5 rounded-md px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
              style={{ backgroundColor: accentColor }}
            >
              Post a Job Instead 🚀
            </Link>
          </motion.div>
        )}
      </div>
    </section>
  );
}
