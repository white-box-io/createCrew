"use client";

import { motion } from "framer-motion";
import { Star, MapPin, Clock, ArrowRight } from "lucide-react";
import Link from "next/link";
import type { Freelancer } from "@/lib/mock-freelancers";

interface FreelancerCardProps {
  freelancer: Freelancer;
  accentColor: string;
}

export default function FreelancerCard({
  freelancer: f,
  accentColor,
}: FreelancerCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="group cursor-pointer rounded-lg border border-border/60 bg-white p-5 transition-all hover:shadow-md"
      style={{
        borderColor: undefined,
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor = `${accentColor}40`;
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor = "";
      }}
    >
      {/* Header: Avatar + Name + Badge */}
      <div className="mb-4 flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div
            className="flex h-12 w-12 items-center justify-center rounded-full text-sm font-bold text-white"
            style={{
              background: `linear-gradient(135deg, ${f.gradientFrom}, ${f.gradientTo})`,
            }}
          >
            {f.avatar}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-brand-dark">
              {f.name}
            </p>
            <p className="truncate text-xs text-brand-gray">@{f.username}</p>
          </div>
        </div>
        {f.badges.length > 0 && (
          <span
            className="flex-shrink-0 rounded-md px-2.5 py-0.5 text-[10px] font-semibold"
            style={{
              backgroundColor: `${accentColor}12`,
              color: accentColor,
            }}
          >
            {f.badges[0]}
          </span>
        )}
      </div>

      {/* Meta: Rating, Location, Delivery */}
      <div className="mb-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-brand-gray">
        <span className="flex items-center gap-1">
          <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
          <span className="font-semibold text-brand-dark">{f.rating}</span>
          <span>({f.reviews})</span>
        </span>
        <span className="flex items-center gap-1">
          <MapPin className="h-3 w-3" />
          {f.location}
        </span>
        <span className="flex items-center gap-1">
          <Clock className="h-3 w-3" />
          {f.deliveryLabel}
        </span>
      </div>

      {/* Tags */}
      <div className="mb-3 flex flex-wrap gap-1.5">
        {f.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-md bg-brand-surface px-2.5 py-1 text-[10px] font-medium text-brand-gray"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Bio */}
      <p className="mb-4 line-clamp-1 text-[13px] leading-relaxed text-brand-gray">
        {f.bio}
      </p>

      {/* Footer: Price + Hire button */}
      <div className="flex items-center justify-between border-t border-border/40 pt-4">
        <div>
          <p className="text-[10px] font-medium uppercase text-brand-gray-light">
            Starting from
          </p>
          <p className="text-base font-bold text-brand-dark">{f.priceLabel}</p>
        </div>
        <Link
          href="#"
          className="flex items-center gap-1 rounded-md px-3 py-1.5 text-xs font-semibold text-white transition-opacity"
          style={{ backgroundColor: accentColor }}
        >
          Hire Now
          <ArrowRight className="h-3 w-3" />
        </Link>
      </div>
    </motion.div>
  );
}
