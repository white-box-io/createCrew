"use client";

import { motion } from "framer-motion";
import { Youtube, Instagram, Twitch, Mic, Linkedin } from "lucide-react";

const platforms = [
  { icon: Youtube, label: "YouTube" },
  { icon: Instagram, label: "Instagram" },
  { icon: Twitch, label: "Twitch" },
  { icon: Mic, label: "Podcasters" },
  { icon: Linkedin, label: "LinkedIn" },
];

export default function TrustedBy() {
  return (
    <section className="border-y border-border/40 bg-brand-surface py-10">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mb-8 text-center text-xs font-semibold tracking-widest text-brand-gray-light uppercase"
        >
          Trusted by creators across India
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-wrap items-center justify-center gap-10 md:gap-16"
        >
          {platforms.map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center gap-2.5 text-brand-gray-light transition-colors hover:text-brand-dark">
              <Icon className="h-5 w-5" />
              <span className="text-sm font-medium">{label}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
