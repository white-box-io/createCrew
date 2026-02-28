"use client";

import { motion } from "framer-motion";
import { Youtube, ShieldCheck, Briefcase, Clock } from "lucide-react";

const benefits = [
  {
    icon: Youtube,
    title: "Work with Top Creators",
    description: "Collaborate with India's biggest YouTubers, Instagram creators, and podcasters. Build a portfolio that matters.",
    color: "#FF6B4A",
    bgColor: "#FF6B4A0D",
  },
  {
    icon: ShieldCheck,
    title: "Guaranteed Payments",
    description: "Every project is backed by escrow protection. You do the work, you get paid — no chasing invoices.",
    color: "#10B981",
    bgColor: "#10B9810D",
  },
  {
    icon: Briefcase,
    title: "Build Your Portfolio",
    description: "Showcase your best work on a creator-focused profile. Let your portfolio attract clients to you.",
    color: "#4F46E5",
    bgColor: "#4F46E50D",
  },
  {
    icon: Clock,
    title: "Work on Your Schedule",
    description: "Pick projects that fit your time. Set your rates, choose your niche, and grow at your own pace.",
    color: "#F59E0B",
    bgColor: "#F59E0B0D",
  },
];

export default function BecomeCrewBenefits() {
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
          <h2 className="text-2xl font-bold text-brand-dark sm:text-3xl">Why Freelancers Choose CreateCrew</h2>
          <p className="mx-auto mt-3 max-w-md text-sm text-brand-gray">
            We built this platform for creators and their teams. Here&apos;s what makes it different.
          </p>
        </motion.div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {benefits.map((b, i) => {
            const Icon = b.icon;
            return (
              <motion.div
                key={b.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="rounded-lg border border-border/60 bg-white p-6"
              >
                <div
                  className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg"
                  style={{ backgroundColor: b.bgColor }}
                >
                  <Icon className="h-5 w-5" style={{ color: b.color }} />
                </div>
                <h3 className="text-sm font-bold text-brand-dark">{b.title}</h3>
                <p className="mt-2 text-xs leading-relaxed text-brand-gray">{b.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
