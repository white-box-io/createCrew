"use client";

import { motion } from "framer-motion";
import { Check, ArrowRight } from "lucide-react";

interface Props {
  name: string;
  onNext: () => void;
}

const PERKS = [
  "3 categories (not just 1)",
  "15 subcategories",
  "Unlimited job applications",
  "Full profile visibility",
  "Collab Board access",
];

export default function StepCelebration({ name, onNext }: Props) {
  return (
    <div className="text-center">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        <span className="text-5xl">🎉</span>
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.3 }}
        className="mt-4 text-xl font-bold text-brand-dark sm:text-2xl"
      >
        Welcome to the Crew, {name.split(" ")[0]}!
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.25 }}
        className="mt-2 text-sm text-brand-gray"
      >
        Here&apos;s what you get <span className="font-bold text-brand-coral">FREE for your first 3 months</span>:
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35, duration: 0.3 }}
        className="mx-auto mt-6 max-w-sm rounded-xl border border-border/60 bg-white p-5 text-left"
      >
        <div className="space-y-3">
          {PERKS.map((perk, i) => (
            <motion.div
              key={perk}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.45 + i * 0.08 }}
              className="flex items-center gap-2.5"
            >
              <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-green-100">
                <Check className="h-3 w-3 text-green-600" />
              </div>
              <p className="text-sm text-brand-dark">{perk}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9 }}
        className="mt-4 text-xs text-brand-gray"
      >
        No credit card. No catch. Just show us what you&apos;ve got.
      </motion.p>

      <motion.button
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.0 }}
        onClick={onNext}
        className="mt-5 inline-flex items-center gap-2 rounded-md bg-brand-dark px-8 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-dark/90"
      >
        Let&apos;s Go
        <ArrowRight className="h-4 w-4" />
      </motion.button>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.1 }}
        className="mt-3 text-[10px] text-brand-gray-light"
      >
        After 3 months: stay free or upgrade from ₹149/month
      </motion.p>
    </div>
  );
}
