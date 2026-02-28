"use client";

import { motion } from "framer-motion";
import { Star, MapPin } from "lucide-react";

const freelancers = [
  {
    name: "Arjun Menon",
    role: "Retention Video Editor",
    location: "Mumbai",
    rating: 4.9,
    reviews: 127,
    price: "₹1,200",
    tags: ["YouTube", "Shorts", "Montage"],
    avatar: "AM",
    gradientFrom: "#FF6B4A",
    gradientTo: "#FB923C",
  },
  {
    name: "Priya Sharma",
    role: "Thumbnail Designer",
    location: "Delhi",
    rating: 5.0,
    reviews: 89,
    price: "₹800",
    tags: ["CTR Expert", "YouTube", "Gaming"],
    avatar: "PS",
    gradientFrom: "#4F46E5",
    gradientTo: "#A78BFA",
  },
  {
    name: "Karthik R",
    role: "Podcast Editor",
    location: "Bengaluru",
    rating: 4.8,
    reviews: 64,
    price: "₹2,500",
    tags: ["Audio Cleanup", "Clipping", "Long-Form"],
    avatar: "KR",
    gradientFrom: "#10B981",
    gradientTo: "#2DD4BF",
  },
  {
    name: "Sneha Patel",
    role: "UGC Creator & Script Writer",
    location: "Ahmedabad",
    rating: 4.9,
    reviews: 102,
    price: "₹3,000",
    tags: ["UGC", "AI Video", "Hooks"],
    avatar: "SP",
    gradientFrom: "#EC4899",
    gradientTo: "#FB7185",
  },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
};

export default function FeaturedFreelancers() {
  return (
    <section id="freelancers" className="bg-white py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        {/* Header */}
        <div className="mb-14 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <div className="mb-3 h-1 w-10 bg-brand-coral" />
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl font-bold tracking-tight text-brand-dark sm:text-4xl"
            >
              Top Creators Available Now
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="mt-3 max-w-md text-base text-brand-gray"
            >
              Hand-picked creators ready to level up your content game.
            </motion.p>
          </div>
          <motion.a
            href="#"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-sm font-semibold text-brand-coral hover:text-brand-coral-dark"
          >
            View all creators →
          </motion.a>
        </div>

        {/* Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4"
        >
          {freelancers.map((person) => (
            <motion.div
              key={person.name}
              variants={cardVariants}
              className="group cursor-pointer rounded-lg border border-border/60 bg-white p-5 transition-all hover:border-brand-coral/30 hover:shadow-md"
            >
              {/* Avatar */}
              <div className="mb-4 flex items-center gap-3">
                <div
                  className="flex h-11 w-11 items-center justify-center rounded-full text-sm font-bold text-white"
                  style={{ background: `linear-gradient(135deg, ${person.gradientFrom}, ${person.gradientTo})` }}
                >
                  {person.avatar}
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-brand-dark">{person.name}</p>
                  <p className="truncate text-xs text-brand-gray">{person.role}</p>
                </div>
              </div>

              {/* Rating & Location */}
              <div className="mb-4 flex items-center gap-3 text-xs text-brand-gray">
                <span className="flex items-center gap-1">
                  <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                  <span className="font-semibold text-brand-dark">{person.rating}</span>
                  <span>({person.reviews})</span>
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {person.location}
                </span>
              </div>

              {/* Tags */}
              <div className="mb-4 flex flex-wrap gap-1.5">
                {person.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-md bg-brand-surface px-2 py-0.5 text-[10px] font-medium text-brand-gray"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Price */}
              <div className="border-t border-border/40 pt-3">
                <p className="text-xs text-brand-gray">
                  Starting from{" "}
                  <span className="font-bold text-brand-dark">{person.price}</span>
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
