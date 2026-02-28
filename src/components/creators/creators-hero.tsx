"use client";

import { motion } from "framer-motion";
import { Search } from "lucide-react";

export default function CreatorsHero() {
  return (
    <section className="border-b border-border/40 bg-brand-surface py-14 lg:py-20">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h1 className="text-3xl font-bold tracking-tight text-brand-dark sm:text-4xl lg:text-5xl">
            Your{" "}
            <span className="bg-gradient-to-r from-brand-coral to-brand-indigo bg-clip-text text-transparent">
              Creators
            </span>
          </h1>
          <p className="mx-auto mt-4 max-w-lg text-base text-brand-gray">
            Browse India&apos;s top content creators. View their profiles, platforms, and open job listings.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="mx-auto mt-8 max-w-2xl"
        >
          <div className="flex items-center gap-2 rounded-lg border border-border bg-white p-1.5 shadow-sm">
            <div className="flex flex-1 items-center gap-2.5 px-3">
              <Search className="h-4 w-4 text-brand-gray-light" />
              <input
                type="text"
                placeholder="Search creators... e.g., TechBurner, gaming, podcast"
                className="w-full bg-transparent py-2.5 text-sm text-brand-dark placeholder:text-brand-gray-light outline-none"
              />
            </div>
            <button className="flex-shrink-0 rounded-md bg-brand-coral px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-coral-dark">
              Search
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
