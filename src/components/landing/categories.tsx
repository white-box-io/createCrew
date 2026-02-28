"use client";

import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import { categories, iconMap } from "@/lib/categories-data";
import type { Category } from "@/lib/categories-data";
import { ArrowUpRight } from "lucide-react";

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.06 },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

function CategoryCard({ cat }: { cat: Category }) {
  const Icon = iconMap[cat.iconName];

  return (
    <motion.div
      variants={cardVariants}
    >
      <Link
        href={`/categories/${cat.slug}`}
        className="group relative flex h-full cursor-pointer flex-col overflow-hidden rounded-xl border border-border/50 bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/[0.08]"
      >
        {/* Gradient accent strip at top */}
        <div
          className="h-1 w-full"
          style={{
            background: `linear-gradient(90deg, ${cat.iconColor}, ${cat.iconColor}88)`,
          }}
        />

        <div className="flex flex-1 flex-col justify-between p-5">
          <div>
            {/* Icon + Teaser row */}
            <div className="mb-4 flex items-center justify-between">
              <div
                className="flex h-11 w-11 items-center justify-center rounded-lg transition-transform duration-300 group-hover:scale-110"
                style={{ backgroundColor: cat.iconBg, color: cat.iconColor }}
              >
                {Icon && <Icon className="h-5 w-5" strokeWidth={2} />}
              </div>
              <span
                className="rounded-full px-3 py-1 text-[11px] font-semibold tracking-wide"
                style={{
                  backgroundColor: `${cat.iconColor}10`,
                  color: cat.iconColor,
                }}
              >
                {cat.teaser}
              </span>
            </div>

            {/* Title */}
            <h3 className="text-[15px] font-bold text-brand-dark">
              {cat.title}
            </h3>

            {/* Description */}
            <p className="mt-2 text-[13px] leading-relaxed text-brand-gray">
              {cat.description}
            </p>
          </div>

          {/* Bottom: subcategory count + arrow */}
          <div className="mt-5 flex items-center justify-between border-t border-border/40 pt-4">
            <span className="text-xs text-brand-gray-light">
              {cat.subcategories.length} services
            </span>
            <span
              className="flex h-7 w-7 items-center justify-center rounded-full transition-all duration-300 group-hover:scale-110"
              style={{
                backgroundColor: `${cat.iconColor}12`,
                color: cat.iconColor,
              }}
            >
              <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export default function Categories() {
  return (
    <section id="categories" className="bg-white py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        {/* Header */}
        <div className="mb-14 flex flex-col items-start gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-3 h-1 w-10 rounded-full bg-brand-coral" />
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl font-bold tracking-tight text-brand-dark sm:text-4xl"
            >
              Explore Creator Services
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="mt-3 max-w-md text-[15px] leading-relaxed text-brand-gray"
            >
              Every service built for how creators actually work — real gigs, real results.
            </motion.p>
          </div>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <Link
              href="/find-crews"
              className="text-sm font-semibold text-brand-coral transition-colors hover:text-brand-coral-dark"
            >
              View all freelancers →
            </Link>
          </motion.div>
        </div>

        {/* Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {categories.map((cat) => (
            <CategoryCard key={cat.slug} cat={cat} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
