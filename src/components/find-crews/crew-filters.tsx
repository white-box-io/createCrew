"use client";

import { useState } from "react";
import { SlidersHorizontal, ChevronDown, ChevronUp } from "lucide-react";
import type { Subcategory } from "@/lib/categories-data";
import type { FreelancerFilters } from "@/lib/mock-freelancers";

interface FilterSectionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

function FilterSection({ title, children, defaultOpen = true }: FilterSectionProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-border/40 py-4">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between text-sm font-semibold text-brand-dark"
      >
        {title}
        {open ? (
          <ChevronUp className="h-4 w-4 text-brand-gray" />
        ) : (
          <ChevronDown className="h-4 w-4 text-brand-gray" />
        )}
      </button>
      {open && <div className="mt-3">{children}</div>}
    </div>
  );
}

const budgetRanges = [
  { label: "Under ₹500", min: undefined, max: 500 },
  { label: "₹500 – ₹1,000", min: 500, max: 1000 },
  { label: "₹1,000 – ₹2,000", min: 1000, max: 2000 },
  { label: "₹2,000 – ₹5,000", min: 2000, max: 5000 },
  { label: "₹5,000+", min: 5000, max: undefined },
];

const deliveryOptions = [
  { label: "24 Hours", value: "24h" },
  { label: "2–3 Days", value: "2-3d" },
  { label: "4+ Days", value: "4d+" },
  { label: "Any", value: "" },
];

interface CrewFiltersProps {
  subcategories: Subcategory[];
  activeSubcategory: string;
  onSubcategoryChange: (slug: string) => void;
  filters: FreelancerFilters;
  onFiltersChange: (filters: FreelancerFilters) => void;
  accentColor: string;
  subcategoryCounts?: Record<string, number>;
}

export default function CrewFilters({
  subcategories,
  activeSubcategory,
  onSubcategoryChange,
  filters,
  onFiltersChange,
  accentColor,
  subcategoryCounts = {},
}: CrewFiltersProps) {
  const selectedBudgetLabel = budgetRanges.find(
    (r) => r.min === filters.minPrice && r.max === filters.maxPrice
  )?.label || "";

  const selectedDelivery = filters.delivery || "";

  const handleBudget = (range: typeof budgetRanges[number]) => {
    // Toggle off if same range already selected
    if (range.min === filters.minPrice && range.max === filters.maxPrice) {
      onFiltersChange({ ...filters, minPrice: undefined, maxPrice: undefined });
    } else {
      onFiltersChange({ ...filters, minPrice: range.min, maxPrice: range.max });
    }
  };

  const handleDelivery = (value: string) => {
    // Toggle off if same delivery already selected
    if (value === selectedDelivery) {
      onFiltersChange({ ...filters, delivery: undefined });
    } else {
      onFiltersChange({ ...filters, delivery: value || undefined });
    }
  };

  const handleClearAll = () => {
    onFiltersChange({});
    if (activeSubcategory) onSubcategoryChange("");
  };

  const hasActiveFilters = selectedBudgetLabel || selectedDelivery || activeSubcategory;

  return (
    <aside className="rounded-lg border border-border/60 bg-white p-5">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2 text-brand-dark">
          <SlidersHorizontal className="h-4 w-4" />
          <h3 className="text-sm font-bold">Filters</h3>
        </div>
        {hasActiveFilters && (
          <button
            onClick={handleClearAll}
            className="text-xs font-medium text-[#F26522] hover:underline"
          >
            Clear all
          </button>
        )}
      </div>

      {/* Subcategories — only shown if a category is selected */}
      {subcategories.length > 0 && (
        <FilterSection title="Subcategory">
          <div className="flex flex-col gap-1.5">
            {subcategories.map((sub) => (
              <button
                key={sub.slug}
                onClick={() => onSubcategoryChange(sub.slug)}
                className={`flex items-center justify-between rounded-md px-3 py-2 text-left text-xs font-medium transition-colors ${
                  activeSubcategory === sub.slug
                    ? "text-white"
                    : "text-brand-gray hover:bg-brand-surface hover:text-brand-dark"
                }`}
                style={activeSubcategory === sub.slug ? { backgroundColor: accentColor } : undefined}
              >
                <span>{sub.title}</span>
                {subcategoryCounts[sub.slug] !== undefined && (
                  <span
                    className={`text-[10px] font-medium ${
                      activeSubcategory === sub.slug ? "text-white/70" : "text-[#9CA3AF]"
                    }`}
                  >
                    {subcategoryCounts[sub.slug]}
                  </span>
                )}
              </button>
            ))}
          </div>
        </FilterSection>
      )}

      <FilterSection title="Budget (Starting Price)">
        <div className="flex flex-col gap-2">
          {budgetRanges.map((range) => (
            <label key={range.label} className="flex cursor-pointer items-center gap-2.5 text-sm text-brand-gray hover:text-brand-dark">
              <input
                type="radio"
                name="budget"
                checked={selectedBudgetLabel === range.label}
                onChange={() => handleBudget(range)}
                className="h-3.5 w-3.5 accent-[#F26522]"
              />
              {range.label}
            </label>
          ))}
        </div>
        <p className="mt-2 text-[10px] italic text-[#9CA3AF]">
          Filters by each freelancer&apos;s lowest gig price
        </p>
      </FilterSection>

      <FilterSection title="Delivery Time">
        <div className="flex flex-col gap-2">
          {deliveryOptions.map((opt) => (
            <label key={opt.label} className="flex cursor-pointer items-center gap-2.5 text-sm text-brand-gray hover:text-brand-dark">
              <input
                type="radio"
                name="delivery"
                checked={selectedDelivery === opt.value}
                onChange={() => handleDelivery(opt.value)}
                className="h-3.5 w-3.5 accent-[#F26522]"
              />
              {opt.label}
            </label>
          ))}
        </div>
      </FilterSection>
    </aside>
  );
}
