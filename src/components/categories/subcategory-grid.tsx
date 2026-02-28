"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion, type Variants } from "framer-motion";
import type { Subcategory } from "@/lib/categories-data";
import { ArrowRight, Zap } from "lucide-react";

interface SubcategoryGridProps {
  subcategories: Subcategory[];
  accentColor: string;
  categorySlug: string;
}

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.05 },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

// ── Pill Row (shown when a subcategory is selected) ──────────────────

function SubcategoryPills({
  subcategories,
  categorySlug,
  selectedSub,
  accentColor,
}: {
  subcategories: Subcategory[];
  categorySlug: string;
  selectedSub: string;
  accentColor: string;
}) {
  return (
    <section className="border-b border-border/40 bg-white py-4">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
          <Link
            href={`/categories/${categorySlug}`}
            className="flex-shrink-0 rounded-md border border-border/50 px-3 py-1.5 text-xs font-medium text-brand-gray transition-colors hover:border-brand-dark hover:text-brand-dark"
          >
            All Services
          </Link>
          {subcategories.map((sub) => {
            const isActive = sub.slug === selectedSub;
            return (
              <Link
                key={sub.slug}
                href={`/categories/${categorySlug}?sub=${sub.slug}`}
                className={`flex-shrink-0 rounded-md px-3 py-1.5 text-xs font-medium transition-all ${
                  isActive
                    ? "text-white"
                    : "border border-border/50 text-brand-gray hover:border-brand-dark hover:text-brand-dark"
                }`}
                style={
                  isActive
                    ? { backgroundColor: accentColor }
                    : undefined
                }
              >
                {sub.title}
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ── Full Grid (shown when no subcategory is selected) ────────────────

function SubcategoryFullGrid({
  subcategories,
  categorySlug,
  accentColor,
}: {
  subcategories: Subcategory[];
  categorySlug: string;
  accentColor: string;
}) {
  return (
    <section className="bg-brand-surface/50 py-10 lg:py-14">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        {/* Section label */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="mb-6 flex items-center gap-2"
        >
          <Zap className="h-4 w-4 text-brand-gray-light" />
          <span className="text-sm font-medium text-brand-gray">
            Choose a service to find freelancers
          </span>
        </motion.div>

        {/* Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3"
        >
          {subcategories.map((sub, i) => (
            <motion.div key={sub.slug} variants={cardVariants}>
              <Link
                href={`/categories/${categorySlug}?sub=${sub.slug}`}
                className="group relative flex h-full cursor-pointer flex-col overflow-hidden rounded-xl border border-border/50 bg-white p-5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/[0.06]"
              >
                {/* Hover accent line */}
                <div
                  className="absolute left-0 top-0 h-full w-0.5 origin-top scale-y-0 transition-transform duration-300 group-hover:scale-y-100"
                  style={{ backgroundColor: accentColor }}
                />

                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    {/* Number badge */}
                    <span
                      className="mb-2.5 inline-flex h-5 w-5 items-center justify-center rounded-md text-[10px] font-bold"
                      style={{
                        backgroundColor: `${accentColor}10`,
                        color: accentColor,
                      }}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>

                    <h3 className="text-sm font-semibold text-brand-dark group-hover:text-brand-dark">
                      {sub.title}
                    </h3>
                    <p className="mt-1.5 text-[13px] leading-relaxed text-brand-gray">
                      {sub.description}
                    </p>
                  </div>

                  {/* Arrow */}
                  <div
                    className="mt-6 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full opacity-0 transition-all duration-300 group-hover:opacity-100"
                    style={{
                      backgroundColor: `${accentColor}10`,
                      color: accentColor,
                    }}
                  >
                    <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// ── Main Export ───────────────────────────────────────────────────────

export default function SubcategoryGrid({
  subcategories,
  accentColor,
  categorySlug,
}: SubcategoryGridProps) {
  const searchParams = useSearchParams();
  const selectedSub = searchParams.get("sub") || "";

  if (selectedSub) {
    return (
      <SubcategoryPills
        subcategories={subcategories}
        categorySlug={categorySlug}
        selectedSub={selectedSub}
        accentColor={accentColor}
      />
    );
  }

  return (
    <SubcategoryFullGrid
      subcategories={subcategories}
      categorySlug={categorySlug}
      accentColor={accentColor}
    />
  );
}
