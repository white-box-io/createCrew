"use client";

import { useState } from "react";
import { SlidersHorizontal, ChevronDown, ChevronUp } from "lucide-react";
import type { Subcategory } from "@/lib/categories-data";

export interface JobFiltersState {
  minPrice?: number;
  maxPrice?: number;
  delivery?: string;
}

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
  { label: "ASAP / 1 Day", value: "24h" },
  { label: "2–3 Days", value: "2-3d" },
  { label: "4+ Days", value: "4d+" },
  { label: "Any", value: "" },
];

interface JobFiltersProps {
  subcategories: Subcategory[];
  activeSubcategory: string;
  onSubcategoryChange: (slug: string) => void;
  filters: JobFiltersState;
  onFiltersChange: (filters: JobFiltersState) => void;
  accentColor: string;
}

export default function JobFilters({
  subcategories,
  activeSubcategory,
  onSubcategoryChange,
  filters,
  onFiltersChange,
  accentColor,
}: JobFiltersProps) {
  const selectedBudgetLabel = budgetRanges.find(
    (r) => r.min === filters.minPrice && r.max === filters.maxPrice
  )?.label || "";

  const selectedDelivery = filters.delivery || "";

  const handleBudget = (range: typeof budgetRanges[number]) => {
    if (range.min === filters.minPrice && range.max === filters.maxPrice) {
      onFiltersChange({ ...filters, minPrice: undefined, maxPrice: undefined });
    } else {
      onFiltersChange({ ...filters, minPrice: range.min, maxPrice: range.max });
    }
  };

  const handleDelivery = (value: string) => {
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
            className="text-xs font-medium text-brand-coral hover:underline border-none bg-transparent cursor-pointer p-0"
          >
            Clear all
          </button>
        )}
      </div>

      {subcategories.length > 0 && (
        <FilterSection title="Subcategory">
          <div className="flex flex-col gap-1.5">
            {subcategories.map((sub) => (
              <button
                key={sub.slug}
                onClick={() => onSubcategoryChange(sub.slug)}
                className={`rounded-md px-3 py-2 text-left text-xs font-medium transition-colors ${
                  activeSubcategory === sub.slug
                    ? "text-white"
                    : "text-brand-gray hover:bg-brand-surface hover:text-brand-dark"
                }`}
                style={activeSubcategory === sub.slug ? { backgroundColor: accentColor } : undefined}
              >
                {sub.title}
              </button>
            ))}
          </div>
        </FilterSection>
      )}

      <FilterSection title="Budget">
        <div className="flex flex-col gap-2">
          {budgetRanges.map((range) => (
            <label key={range.label} className="flex cursor-pointer items-center gap-2.5 text-sm text-brand-gray hover:text-brand-dark transition-colors">
              <input
                type="radio"
                name="budget"
                className="h-4 w-4 flex-shrink-0 cursor-pointer accent-brand-coral"
                checked={selectedBudgetLabel === range.label}
                onChange={() => handleBudget(range)}
              />
              {range.label}
            </label>
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Delivery Time" defaultOpen={false}>
        <div className="flex flex-col gap-2">
          {deliveryOptions.map((opt) => (
            <label key={opt.value} className="flex cursor-pointer items-center gap-2.5 text-sm text-brand-gray hover:text-brand-dark transition-colors">
              <input
                type="radio"
                name="delivery"
                className="h-4 w-4 flex-shrink-0 cursor-pointer accent-brand-coral"
                checked={opt.value === "" ? !selectedDelivery : selectedDelivery === opt.value}
                onChange={() => handleDelivery(opt.value)}
              />
              {opt.label}
            </label>
          ))}
        </div>
      </FilterSection>
    </aside>
  );
}
