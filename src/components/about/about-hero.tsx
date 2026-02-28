"use client";

import { motion } from "framer-motion";

export default function AboutHero() {
  return (
    <section className="relative overflow-hidden bg-white py-16 lg:py-24">
      {/* Decorative orbs */}
      <div className="pointer-events-none absolute -top-20 right-0 h-80 w-80 rounded-full bg-brand-coral/5 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 left-10 h-60 w-60 rounded-full bg-brand-indigo/5 blur-3xl" />

      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-3xl text-center"
        >
          <span className="mb-4 inline-block rounded-full border border-brand-coral/20 bg-brand-coral/5 px-4 py-1.5 text-xs font-semibold tracking-wide text-brand-coral uppercase">
            Our Mission
          </span>
          <h1 className="text-3xl font-bold tracking-tight text-brand-dark sm:text-4xl lg:text-5xl">
            We&apos;re Building the Future of{" "}
            <span className="bg-gradient-to-r from-brand-coral to-brand-indigo bg-clip-text text-transparent">
              Creator Work
            </span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-brand-gray">
            CreateCrew is India&apos;s first marketplace purpose-built for content creators and the talented
            freelancers who power them. We believe every creator deserves a world-class team — regardless
            of their subscriber count.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
