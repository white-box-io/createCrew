"use client";

import { Suspense } from "react";
import { useState, useMemo, useCallback, useEffect } from "react";
import { categories } from "@/lib/categories-data";
import {
  mockFreelancers,
  type SortOption,
  type FreelancerFilters,
  type Freelancer,
} from "@/lib/mock-freelancers";
import CrewsHero from "@/components/find-crews/crews-hero";
import CategoryPills from "@/components/find-crews/category-pills";
import CrewFilters from "@/components/find-crews/crew-filters";
import CrewGrid from "@/components/find-crews/crew-grid";
import { addRecentlyViewed } from "@/lib/recently-viewed";
import MessageModal from "@/components/find-crews/message-modal";

const ITEMS_PER_PAGE = 12;

// Map category slug → all its subcategory slugs
const catSubMap: Record<string, string[]> = {};
categories.forEach((cat) => {
  catSubMap[cat.slug] = cat.subcategories.map((s) => s.slug);
});

// Budget filter ranges (matching crew-filters)
const budgetRanges = [
  { label: "Under ₹500", min: undefined as number | undefined, max: 500 as number | undefined },
  { label: "₹500 – ₹1,000", min: 500, max: 1000 },
  { label: "₹1,000 – ₹2,000", min: 1000, max: 2000 },
  { label: "₹2,000 – ₹5,000", min: 2000, max: 5000 },
  { label: "₹5,000+", min: 5000, max: undefined },
];

function applyFilters(list: Freelancer[], f: FreelancerFilters): Freelancer[] {
  let out = list;
  if (f.delivery === "24h") out = out.filter((x) => x.deliveryDays <= 1);
  else if (f.delivery === "2-3d") out = out.filter((x) => x.deliveryDays >= 2 && x.deliveryDays <= 3);
  else if (f.delivery === "4d+") out = out.filter((x) => x.deliveryDays >= 4);
  if (f.minPrice !== undefined) out = out.filter((x) => x.price >= f.minPrice!);
  if (f.maxPrice !== undefined) out = out.filter((x) => x.price <= f.maxPrice!);
  return out;
}

function applySort(list: Freelancer[], sort: SortOption): Freelancer[] {
  const copy = [...list];
  switch (sort) {
    case "rating-desc": return copy.sort((a, b) => b.rating - a.rating);
    case "price-asc": return copy.sort((a, b) => a.price - b.price);
    case "price-desc": return copy.sort((a, b) => b.price - a.price);
    case "fastest": return copy.sort((a, b) => a.deliveryDays - b.deliveryDays);
    case "jobs-done-desc": return copy.sort((a, b) => b.jobsDone - a.jobsDone);
    default: return copy;
  }
}

function FindCrewsContent() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [activeSubcategory, setActiveSubcategory] = useState("");
  const [sort, setSort] = useState<SortOption>("relevance");
  const [filters, setFilters] = useState<FreelancerFilters>({});
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);

  // Modal states
  const [messageTarget, setMessageTarget] = useState<Freelancer | null>(null);

  // Restore state from sessionStorage on mount (back-navigation support)
  useEffect(() => {
    if (typeof window === "undefined") return;
    const raw = sessionStorage.getItem("findCrewPageState");
    if (!raw) return;
    try {
      const state = JSON.parse(raw);
      if (state.activeCategory) setActiveCategory(state.activeCategory);
      if (state.activeSubcategory) setActiveSubcategory(state.activeSubcategory);
      if (state.sort) setSort(state.sort);
      if (state.filters) setFilters(state.filters);
      if (state.visibleCount) setVisibleCount(state.visibleCount);
      sessionStorage.removeItem("findCrewPageState");
      // Restore scroll position after render
      if (state.scrollY) {
        requestAnimationFrame(() => {
          setTimeout(() => window.scrollTo(0, state.scrollY), 100);
        });
      }
    } catch {
      sessionStorage.removeItem("findCrewPageState");
    }
  }, []);

  // Get subcategories for the selected category
  const selectedCat = categories.find((c) => c.slug === activeCategory);
  const subcategories = selectedCat?.subcategories || [];

  // When category changes, reset sub + pagination
  const handleCategoryChange = useCallback((slug: string) => {
    setActiveCategory(slug);
    setActiveSubcategory("");
    setVisibleCount(ITEMS_PER_PAGE);
  }, []);

  const handleSubcategoryChange = useCallback((slug: string) => {
    setActiveSubcategory((prev) => (prev === slug ? "" : slug));
    setVisibleCount(ITEMS_PER_PAGE);
  }, []);

  // Compute per-category counts (unfiltered)
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: mockFreelancers.length };
    categories.forEach((cat) => {
      const slugs = catSubMap[cat.slug] || [];
      counts[cat.slug] = mockFreelancers.filter((f) =>
        f.subcategorySlugs.some((s) => slugs.includes(s))
      ).length;
    });
    return counts;
  }, []);

  // Compute per-subcategory counts for the active category
  const subcategoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    if (subcategories.length > 0) {
      // Get pool for the active category first
      let pool = [...mockFreelancers];
      if (activeCategory !== "all") {
        const slugs = catSubMap[activeCategory] || [];
        pool = pool.filter((f) => f.subcategorySlugs.some((s) => slugs.includes(s)));
      }
      subcategories.forEach((sub) => {
        counts[sub.slug] = pool.filter((f) =>
          f.subcategorySlugs.includes(sub.slug)
        ).length;
      });
    }
    return counts;
  }, [activeCategory, subcategories]);

  // Get budget label for active filter
  const activeBudgetLabel = useMemo(() => {
    const found = budgetRanges.find(
      (r) => r.min === filters.minPrice && r.max === filters.maxPrice
    );
    return found?.label || "";
  }, [filters.minPrice, filters.maxPrice]);

  // Get subcategory label
  const activeSubcategoryLabel = useMemo(() => {
    if (!activeSubcategory) return "";
    const sub = subcategories.find((s) => s.slug === activeSubcategory);
    return sub?.title || "";
  }, [activeSubcategory, subcategories]);

  // Filter → Sort → Paginate
  const { freelancers, total, totalInCategory } = useMemo(() => {
    let pool = [...mockFreelancers];

    // Category filter
    if (activeCategory !== "all") {
      const slugs = catSubMap[activeCategory] || [];
      pool = pool.filter((f) => f.subcategorySlugs.some((s) => slugs.includes(s)));
    }

    const catTotal = pool.length;

    // Subcategory filter
    if (activeSubcategory) {
      pool = pool.filter((f) => f.subcategorySlugs.includes(activeSubcategory));
    }

    pool = applyFilters(pool, filters);
    pool = applySort(pool, sort);

    return {
      freelancers: pool.slice(0, visibleCount),
      total: pool.length,
      totalInCategory: catTotal,
    };
  }, [activeCategory, activeSubcategory, sort, filters, visibleCount]);

  const hasMore = visibleCount < total;

  const handleClearSubcategory = useCallback(() => {
    setActiveSubcategory("");
    setVisibleCount(ITEMS_PER_PAGE);
  }, []);

  const handleClearBudget = useCallback(() => {
    setFilters((prev) => ({ ...prev, minPrice: undefined, maxPrice: undefined }));
    setVisibleCount(ITEMS_PER_PAGE);
  }, []);

  const handleClearAllFilters = useCallback(() => {
    setActiveSubcategory("");
    setFilters({});
    setVisibleCount(ITEMS_PER_PAGE);
  }, []);

  const handleViewProfile = useCallback((person: Freelancer) => {
    // Save state for back-navigation
    if (typeof window !== "undefined") {
      const state = {
        activeCategory,
        activeSubcategory,
        sort,
        filters,
        visibleCount,
        scrollY: window.scrollY,
      };
      sessionStorage.setItem("findCrewPageState", JSON.stringify(state));
    }
    // Add to recently viewed
    addRecentlyViewed({
      username: person.username,
      name: person.name,
      avatar: person.avatar,
      gradientFrom: person.gradientFrom,
      gradientTo: person.gradientTo,
    });
  }, [activeCategory, activeSubcategory, sort, filters, visibleCount]);

  const handleMessage = useCallback((person: Freelancer) => {
    setMessageTarget(person);
  }, []);

  return (
    <>
      <CrewsHero />
      <CategoryPills
        activeCategory={activeCategory}
        onCategoryChange={handleCategoryChange}
        counts={categoryCounts}
      />
      <section className="bg-white py-8 lg:py-12">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="flex gap-8">
            {/* Sidebar Filters */}
            <div className="hidden w-64 flex-shrink-0 lg:block">
              <CrewFilters
                subcategories={subcategories}
                activeSubcategory={activeSubcategory}
                onSubcategoryChange={handleSubcategoryChange}
                filters={filters}
                onFiltersChange={setFilters}
                accentColor={selectedCat?.iconColor || "#F26522"}
                subcategoryCounts={subcategoryCounts}
              />
            </div>
            {/* Grid */}
            <CrewGrid
              freelancers={freelancers}
              total={total}
              totalInCategory={totalInCategory}
              sort={sort}
              onSortChange={setSort}
              hasMore={hasMore}
              onShowMore={() => setVisibleCount((p) => p + ITEMS_PER_PAGE)}
              onViewProfile={handleViewProfile}
              onMessage={handleMessage}
              activeSubcategoryLabel={activeSubcategoryLabel}
              activeBudgetLabel={activeBudgetLabel}
              onClearSubcategory={handleClearSubcategory}
              onClearBudget={handleClearBudget}
              onClearAllFilters={handleClearAllFilters}
            />
          </div>
        </div>
      </section>

      {/* Message Modal */}
      {messageTarget && (
        <MessageModal
          person={messageTarget}
          onClose={() => setMessageTarget(null)}
        />
      )}
    </>
  );
}

export default function FindCrewsClient() {
  return (
    <Suspense fallback={null}>
      <FindCrewsContent />
    </Suspense>
  );
}
