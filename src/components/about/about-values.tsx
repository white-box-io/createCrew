"use client";

import { motion } from "framer-motion";
import { Users, Heart, Eye, Sparkles } from "lucide-react";

const values = [
  {
    icon: Users,
    title: "Creator-First",
    description: "Every feature, every decision is designed with creators and their teams in mind.",
    color: "#FF6B4A",
    bgColor: "#FF6B4A0D",
  },
  {
    icon: Heart,
    title: "Community",
    description: "We're building more than a marketplace — we're building a community of passionate makers.",
    color: "#4F46E5",
    bgColor: "#4F46E50D",
  },
  {
    icon: Eye,
    title: "Transparency",
    description: "Clear pricing, honest reviews, and zero hidden fees. What you see is what you get.",
    color: "#10B981",
    bgColor: "#10B9810D",
  },
  {
    icon: Sparkles,
    title: "Quality",
    description: "We vet every freelancer. Only the best make it onto CreateCrew with verified portfolios.",
    color: "#F59E0B",
    bgColor: "#F59E0B0D",
  },
];

export default function AboutValues() {
  return (
    <section className="border-t border-border/40 bg-brand-surface py-14 lg:py-20">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-10 text-center"
        >
          <h2 className="text-2xl font-bold text-brand-dark sm:text-3xl">Our Core Values</h2>
          <p className="mx-auto mt-3 max-w-md text-sm text-brand-gray">
            The principles that drive everything we build and every decision we make.
          </p>
        </motion.div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {values.map((value, i) => {
            const Icon = value.icon;
            return (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="rounded-lg border border-border/60 bg-white p-6 text-center"
              >
                <div
                  className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg"
                  style={{ backgroundColor: value.bgColor }}
                >
                  <Icon className="h-5 w-5" style={{ color: value.color }} />
                </div>
                <h3 className="text-sm font-bold text-brand-dark">{value.title}</h3>
                <p className="mt-2 text-xs leading-relaxed text-brand-gray">{value.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
