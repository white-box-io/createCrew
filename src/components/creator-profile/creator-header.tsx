"use client";

import { motion } from "framer-motion";
import { MapPin, Youtube, Instagram, Twitter } from "lucide-react";

interface CreatorHeaderProps {
  creator: {
    name: string;
    username: string;
    bio: string;
    location: string;
    subscribers: string;
    avatar: string;
    gradientFrom: string;
    gradientTo: string;
    bannerGradientFrom: string;
    bannerGradientTo: string;
    socials: { youtube?: string; instagram?: string; twitter?: string };
  };
}

export default function CreatorHeader({ creator }: CreatorHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      {/* Banner */}
      <div
        className="h-40 sm:h-52"
        style={{ background: `linear-gradient(135deg, ${creator.bannerGradientFrom}, ${creator.bannerGradientTo})` }}
      />

      {/* Profile Info */}
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="relative -mt-12 flex flex-col items-start gap-4 sm:flex-row sm:items-end sm:gap-6">
          {/* Avatar */}
          <div
            className="flex h-24 w-24 items-center justify-center rounded-xl border-4 border-white text-2xl font-bold text-white shadow-md"
            style={{ background: `linear-gradient(135deg, ${creator.gradientFrom}, ${creator.gradientTo})` }}
          >
            {creator.avatar}
          </div>

          <div className="flex-1 pb-1">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-xl font-bold text-brand-dark sm:text-2xl">{creator.name}</h1>
              <span className="rounded-full bg-brand-surface px-3 py-0.5 text-xs font-semibold text-brand-indigo">
                {creator.subscribers} subscribers
              </span>
            </div>
            <p className="mt-1 text-sm text-brand-gray">@{creator.username}</p>
            <p className="mt-2 max-w-lg text-sm leading-relaxed text-brand-gray">{creator.bio}</p>
          </div>

          {/* Meta */}
          <div className="flex items-center gap-4 pb-1">
            <span className="flex items-center gap-1 text-xs text-brand-gray">
              <MapPin className="h-3.5 w-3.5" />
              {creator.location}
            </span>
            <div className="flex items-center gap-2">
              {creator.socials.youtube && (
                <a href={creator.socials.youtube} target="_blank" rel="noreferrer" className="text-brand-gray hover:text-red-500 transition-colors">
                  <Youtube className="h-4 w-4" />
                </a>
              )}
              {creator.socials.instagram && (
                <a href={creator.socials.instagram} target="_blank" rel="noreferrer" className="text-brand-gray hover:text-pink-500 transition-colors">
                  <Instagram className="h-4 w-4" />
                </a>
              )}
              {creator.socials.twitter && (
                <a href={creator.socials.twitter} target="_blank" rel="noreferrer" className="text-brand-gray hover:text-brand-dark transition-colors">
                  <Twitter className="h-4 w-4" />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
