"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronRight, ArrowLeft } from "lucide-react";
import { iconMap } from "@/lib/categories-data";

interface CategoryHeroProps {
  title: string;
  description: string;
  teaser: string;
  iconName: string;
  iconBg: string;
  iconColor: string;
  subcategoryCount: number;
  selectedSubTitle?: string;
  categorySlug?: string;
}

export default function CategoryHero({
  title,
  description,
  teaser,
  iconName,
  iconBg,
  iconColor,
  subcategoryCount,
  selectedSubTitle,
  categorySlug,
}: CategoryHeroProps) {
  const Icon = iconMap[iconName];

  return (
    <section className="relative overflow-hidden border-b border-border/40 bg-white">
      {/* Subtle gradient background */}
      <div
        className="absolute inset-0 opacity-[0.035]"
        style={{
          background: `radial-gradient(ellipse 80% 60% at 70% 40%, ${iconColor}, transparent)`,
        }}
      />

      <div className="relative mx-auto max-w-7xl px-5 py-10 lg:px-8 lg:py-14">
        {/* Breadcrumb */}
        <motion.nav
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="mb-8 flex items-center gap-1.5 text-sm text-brand-gray"
        >
          <Link
            href="/"
            className="transition-colors hover:text-brand-dark"
          >
            Home
          </Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <Link
            href="/#categories"
            className="transition-colors hover:text-brand-dark"
          >
            Categories
          </Link>
          <ChevronRight className="h-3.5 w-3.5" />
          {selectedSubTitle ? (
            <>
              <Link
                href={`/categories/${categorySlug}`}
                className="transition-colors hover:text-brand-dark"
              >
                {title}
              </Link>
              <ChevronRight className="h-3.5 w-3.5" />
              <span className="font-medium text-brand-dark">{selectedSubTitle}</span>
            </>
          ) : (
            <span className="font-medium text-brand-dark">{title}</span>
          )}
        </motion.nav>

        {/* Hero content */}
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:gap-6">
          {/* Icon */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-xl shadow-sm"
            style={{
              backgroundColor: iconBg,
              color: iconColor,
              boxShadow: `0 4px 14px ${iconColor}20`,
            }}
          >
            {Icon && <Icon className="h-8 w-8" strokeWidth={1.8} />}
          </motion.div>

          <div className="flex-1">
            {/* Title + teaser */}
            <div className="flex flex-wrap items-center gap-3">
              <motion.h1
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="text-2xl font-bold tracking-tight text-brand-dark sm:text-3xl"
              >
                {selectedSubTitle
                  ? `Find ${selectedSubTitle} Pros`
                  : title}
              </motion.h1>
              <motion.span
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.2 }}
                className="rounded-full px-3 py-1 text-xs font-semibold"
                style={{
                  backgroundColor: `${iconColor}12`,
                  color: iconColor,
                }}
              >
                {teaser}
              </motion.span>
            </div>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.15 }}
              className="mt-2.5 max-w-xl text-sm leading-relaxed text-brand-gray sm:text-[15px]"
            >
              {selectedSubTitle || description}
            </motion.p>

            {/* Stats row */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mt-5 flex items-center gap-4"
            >
              <div
                className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium"
                style={{
                  backgroundColor: `${iconColor}08`,
                  color: iconColor,
                }}
              >
                <span className="text-sm font-bold">{subcategoryCount}</span>
                <span className="text-brand-gray">services available</span>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Back link */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35 }}
          className="mt-8"
        >
          <Link
            href="/#categories"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-gray transition-colors hover:text-brand-dark"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            All categories
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
