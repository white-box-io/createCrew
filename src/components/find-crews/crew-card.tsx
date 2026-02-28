"use client";

import { motion } from "framer-motion";
import { Star, MapPin, Clock, CheckCircle2, MessageSquare } from "lucide-react";
import Link from "next/link";
import { generateProfile } from "@/lib/freelancer-profile-generator";
import type { Freelancer } from "@/lib/mock-freelancers";

interface CrewCardProps {
  person: Freelancer;
  onViewProfile?: (person: Freelancer) => void;
  onMessage?: (person: Freelancer) => void;
}

function formatPrice(price: number): string {
  return "₹" + price.toLocaleString("en-IN");
}

function getBioSnippet(bio: string, maxLen = 80): string {
  if (bio.length <= maxLen) return bio;
  return bio.slice(0, maxLen).trimEnd() + "...";
}

export default function CrewCard({ person, onViewProfile, onMessage }: CrewCardProps) {
  const hasPriceRange = person.maxPrice > person.price;

  // Generate availability deterministic to the person
  const generated = generateProfile(person.username);
  const isAvailable = generated?.availability === "available";

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="group rounded-xl border border-[#E5E7EB] bg-white p-5 transition-all duration-[180ms] ease-in-out hover:border-[#F26522] hover:shadow-[0_4px_16px_rgba(0,0,0,0.10)]"
      style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}
    >
      {/* Header */}
      <div className="mb-4 flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div
            className="flex h-12 w-12 items-center justify-center rounded-full text-sm font-bold text-white"
            style={{ background: `linear-gradient(135deg, ${person.gradientFrom}, ${person.gradientTo})` }}
          >
            {person.avatar}
          </div>
          <div>
            <p className="text-sm font-semibold text-[#111827]">{person.name}</p>
            <p className="text-xs text-[#6B7280]">{person.role}</p>
          </div>
        </div>
        {person.badges.length > 0 && (
          <span className="rounded-full bg-[#FFF3EE] px-2.5 py-0.5 text-[10px] font-semibold text-[#F26522]">
            {person.badges[0]}
          </span>
        )}
      </div>

      {/* Meta */}
      <div className="mb-4 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-[#6B7280]">
        <span className="flex items-center gap-1">
          <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
          <span className="font-semibold text-[#111827]">{person.rating}</span>
          <span>({person.reviews})</span>
        </span>
        <span className="flex items-center gap-1">
          <MapPin className="h-3 w-3" />
          {person.location}
        </span>
        <span className="flex items-center gap-1">
          <Clock className="h-3 w-3" />
          {person.deliveryLabel}
        </span>
        <span className="flex items-center gap-1 text-[#16A34A]">
          <CheckCircle2 className="h-3 w-3" />
          <span className="font-medium">{person.jobsDone} jobs done</span>
        </span>
      </div>

      {/* Tags */}
      <div className="mb-3 flex flex-wrap gap-1.5">
        {person.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-lg bg-[#F9FAFB] px-2.5 py-1 text-[10px] font-medium text-[#6B7280]"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Bio Snippet */}
      <p className="mb-4 text-xs italic text-[#9CA3AF] leading-relaxed">
        &ldquo;{getBioSnippet(person.bio)}&rdquo;
      </p>

      {/* Price Range */}
      <div className="mb-4 border-t border-[#E5E7EB] pt-4">
        <p className="text-lg font-bold text-[#111827]">
          {hasPriceRange
            ? `${formatPrice(person.price)} – ${formatPrice(person.maxPrice)}`
            : formatPrice(person.price)
          }
        </p>
        <p className="mt-0.5 text-[10px] font-medium text-[#9CA3AF]">
          per gig · starting price
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2">
        <Link
          href={`/freelancer/@${person.username}`}
          onClick={() => onViewProfile?.(person)}
          className="flex-1 rounded-lg bg-[#F26522] px-4 py-2.5 text-center text-xs font-semibold text-white transition-all duration-[180ms] ease-in-out hover:bg-[#D4551A]"
        >
          View Profile
        </Link>
        <button
          onClick={() => onMessage?.(person)}
          className="flex-1 flex items-center justify-center gap-1.5 rounded-lg border border-[#E5E7EB] bg-white px-4 py-2.5 text-xs font-semibold text-[#374151] transition-all duration-[180ms] ease-in-out hover:bg-[#F9FAFB]"
        >
          <MessageSquare className="h-3.5 w-3.5" />
          Message
        </button>
      </div>
    </motion.div>
  );
}
