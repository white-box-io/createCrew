"use client";

import { motion } from "framer-motion";
import { ArrowRight, Play } from "lucide-react";
import { Button } from "@/components/ui/button";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.6, ease: "easeOut" as const },
  }),
};

const stats = [
  { value: "10K+", label: "Creators" },
  { value: "5K+", label: "Freelancers" },
  { value: "₹2Cr+", label: "Paid Out" },
];

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-white">
      {/* Subtle gradient orbs */}
      <div className="pointer-events-none absolute -top-40 right-0 h-[500px] w-[500px] rounded-full bg-brand-coral/5 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 left-0 h-[400px] w-[400px] rounded-full bg-brand-indigo/5 blur-3xl" />

      <div className="mx-auto max-w-7xl px-5 py-20 lg:px-8 lg:py-28">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left — Copy */}
          <div className="max-w-xl">
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={0}
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-brand-coral/20 bg-brand-coral/5 px-4 py-1.5"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-brand-coral" />
              <span className="text-xs font-semibold tracking-wide text-brand-coral uppercase">
                India&rsquo;s #1 Creator Marketplace
              </span>
            </motion.div>

            <motion.h1
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={1}
              className="text-4xl font-bold leading-tight tracking-tight text-brand-dark sm:text-5xl lg:text-6xl"
            >
              Build Your
              <br />
              <span className="bg-gradient-to-r from-brand-coral to-brand-indigo bg-clip-text text-transparent">
                Content Squad
              </span>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={2}
              className="mt-5 text-lg leading-relaxed text-brand-gray"
            >
              Find video editors, thumbnail designers, scriptwriters, and more — all built for
              creators, not corporations. Your team is one click away.
            </motion.p>

            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={3}
              className="mt-8 flex flex-wrap items-center gap-4"
            >
              <Button className="h-12 rounded-md bg-brand-coral px-7 text-sm font-semibold text-white hover:bg-brand-coral-dark">
                Hire a Creator
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                className="h-12 rounded-md border-border px-7 text-sm font-semibold text-brand-dark hover:bg-brand-surface"
              >
                <Play className="mr-2 h-4 w-4 text-brand-coral" />
                See How It Works
              </Button>
            </motion.div>

            {/* Stats */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={4}
              className="mt-12 flex items-center gap-8 border-t border-border/60 pt-8"
            >
              {stats.map((stat) => (
                <div key={stat.label}>
                  <p className="text-2xl font-bold text-brand-dark">{stat.value}</p>
                  <p className="text-xs font-medium text-brand-gray-light">{stat.label}</p>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right — Visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.8, ease: "easeOut" }}
            className="relative hidden lg:block"
          >
            <div className="relative mx-auto aspect-square max-w-md">
              {/* Background circles */}
              <div className="absolute inset-0 rounded-full border-2 border-dashed border-brand-surface-alt" />
              <div className="absolute inset-6 rounded-full border-2 border-dashed border-brand-surface-alt" />
              <div className="absolute inset-12 rounded-full border-2 border-dashed border-brand-surface-alt" />

              {/* Center orb */}
              <div className="absolute inset-20 rounded-full bg-gradient-to-br from-brand-coral to-brand-indigo opacity-90" />

              {/* Floating cards */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute left-4 top-16 rounded-lg border border-border/60 bg-white px-4 py-3 shadow-sm"
              >
                <p className="text-xs font-semibold text-brand-dark">🎬 Video Editor</p>
                <p className="text-[10px] text-brand-gray">from ₹500/video</p>
              </motion.div>

              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                className="absolute right-2 top-28 rounded-lg border border-border/60 bg-white px-4 py-3 shadow-sm"
              >
                <p className="text-xs font-semibold text-brand-dark">🎨 Thumbnail Pro</p>
                <p className="text-[10px] text-brand-gray">98% CTR boost</p>
              </motion.div>

              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute bottom-20 left-8 rounded-lg border border-border/60 bg-white px-4 py-3 shadow-sm"
              >
                <p className="text-xs font-semibold text-brand-dark">✍️ Scriptwriter</p>
                <p className="text-[10px] text-brand-gray">Viral hooks specialist</p>
              </motion.div>

              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
                className="absolute bottom-12 right-6 rounded-lg border border-border/60 bg-white px-4 py-3 shadow-sm"
              >
                <p className="text-xs font-semibold text-brand-dark">🎙️ Podcast Editor</p>
                <p className="text-[10px] text-brand-gray">Audio + clips</p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
