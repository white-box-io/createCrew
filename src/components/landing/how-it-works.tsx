"use client";

import { motion } from "framer-motion";
import { FileText, Users, Rocket } from "lucide-react";

const steps = [
  {
    icon: FileText,
    step: "01",
    title: "Drop Your Project",
    description:
      "Post what you need — a montage edit, thumbnail, script, or full content package. Be as specific or open as you want.",
  },
  {
    icon: Users,
    step: "02",
    title: "Match With Creators",
    description:
      "Browse creator portfolios or get matched with verified freelancers who specialize in exactly what you need.",
  },
  {
    icon: Rocket,
    step: "03",
    title: "Build & Scale",
    description:
      "Collaborate, review, ship. Build long-term relationships and scale your content team as you grow.",
  },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
};

const stepVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
};

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-brand-surface py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        {/* Header */}
        <div className="mb-14 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-bold tracking-tight text-brand-dark sm:text-4xl"
          >
            How It Works
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mx-auto mt-3 max-w-md text-base text-brand-gray"
          >
            Three simple steps to assemble your dream content team.
          </motion.p>
        </div>

        {/* Steps */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="relative grid gap-8 md:grid-cols-3"
        >
          {/* Connecting line (desktop) */}
          <div className="pointer-events-none absolute top-16 right-[16.67%] left-[16.67%] hidden h-px bg-border md:block" />

          {steps.map((item) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.step}
                variants={stepVariants}
                className="relative flex flex-col items-center text-center"
              >
                {/* Step badge */}
                <div className="relative z-10 mb-6 flex h-14 w-14 items-center justify-center rounded-full border-2 border-brand-coral bg-white">
                  <Icon className="h-6 w-6 text-brand-coral" />
                </div>

                <span className="mb-2 text-xs font-bold tracking-widest text-brand-coral uppercase">
                  Step {item.step}
                </span>
                <h3 className="text-lg font-semibold text-brand-dark">{item.title}</h3>
                <p className="mt-2 max-w-xs text-sm leading-relaxed text-brand-gray">
                  {item.description}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
