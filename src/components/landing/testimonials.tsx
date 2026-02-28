"use client";

import { motion } from "framer-motion";
import { Quote } from "lucide-react";

const testimonials = [
  {
    quote:
      "I used to spend weeks finding a good editor. CreateCrew matched me with someone in 2 hours. My YouTube channel has never looked better.",
    name: "Rohan Verma",
    role: "YouTube Creator · 500K subs",
    avatar: "RV",
    gradientFrom: "#FF6B4A",
    gradientTo: "#FB923C",
  },
  {
    quote:
      "As a freelance editor, I was struggling on generic platforms. Here, creators actually understand what I do. My income tripled in 3 months.",
    name: "Ananya Iyer",
    role: "Retention Editor",
    avatar: "AI",
    gradientFrom: "#4F46E5",
    gradientTo: "#A78BFA",
  },
  {
    quote:
      "We needed UGC creators for our D2C brand. CreateCrew had exactly the niche talent we were looking for — no filtering through irrelevant profiles.",
    name: "Vikram Singh",
    role: "Founder, NeonBrew",
    avatar: "VS",
    gradientFrom: "#10B981",
    gradientTo: "#2DD4BF",
  },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
};

export default function Testimonials() {
  return (
    <section id="testimonials" className="bg-brand-surface py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        {/* Header */}
        <div className="mb-14 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-bold tracking-tight text-brand-dark sm:text-4xl"
          >
            What Creators Are Saying
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mx-auto mt-3 max-w-md text-base text-brand-gray"
          >
            Real stories from creators and freelancers on CreateCrew.
          </motion.p>
        </div>

        {/* Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="grid gap-6 md:grid-cols-3"
        >
          {testimonials.map((t) => (
            <motion.div
              key={t.name}
              variants={cardVariants}
              className="rounded-lg border border-border/60 bg-white p-6"
            >
              <Quote className="mb-4 h-5 w-5 text-brand-coral/40" />
              <p className="text-sm leading-relaxed text-brand-dark">{t.quote}</p>
              <div className="mt-6 flex items-center gap-3 border-t border-border/40 pt-5">
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-full text-xs font-bold text-white"
                  style={{ background: `linear-gradient(135deg, ${t.gradientFrom}, ${t.gradientTo})` }}
                >
                  {t.avatar}
                </div>
                <div>
                  <p className="text-sm font-semibold text-brand-dark">{t.name}</p>
                  <p className="text-xs text-brand-gray">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
