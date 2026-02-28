"use client";

import { motion } from "framer-motion";

const stats = [
  { value: "₹5Cr+", label: "Paid to Freelancers" },
  { value: "5,200+", label: "Active Freelancers" },
  { value: "10,000+", label: "Creators Hiring" },
  { value: "48 hrs", label: "Avg. First Gig" },
];

export default function BecomeCrewStats() {
  return (
    <section className="bg-white py-12">
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
              <p className="text-2xl font-bold text-brand-indigo sm:text-3xl">{stat.value}</p>
              <p className="mt-1 text-xs font-medium text-brand-gray">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
