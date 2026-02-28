"use client";

import { motion } from "framer-motion";

const stats = [
  { value: "10,000+", label: "Creators on Platform" },
  { value: "5,200+", label: "Verified Freelancers" },
  { value: "25,000+", label: "Projects Completed" },
  { value: "₹2 Cr+", label: "Paid to Freelancers" },
];

export default function AboutStats() {
  return (
    <section className="border-y border-border/40 bg-brand-surface py-12">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-2 gap-8 lg:grid-cols-4"
        >
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-2xl font-bold text-brand-dark sm:text-3xl">{stat.value}</p>
              <p className="mt-1 text-xs font-medium text-brand-gray">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
