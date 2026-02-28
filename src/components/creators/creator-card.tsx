"use client";

import { motion } from "framer-motion";
import { MapPin, Briefcase, ArrowRight } from "lucide-react";
import Link from "next/link";
import type { Creator } from "@/lib/mock-creators";

/* Platform icon SVGs (inline for simplicity) */
function YoutubeIcon({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg className={className} style={style} viewBox="0 0 24 24" fill="currentColor">
      <path d="M23.5 6.19a3.02 3.02 0 0 0-2.12-2.14C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.38.55A3.02 3.02 0 0 0 .5 6.19 31.7 31.7 0 0 0 0 12a31.7 31.7 0 0 0 .5 5.81 3.02 3.02 0 0 0 2.12 2.14c1.88.55 9.38.55 9.38.55s7.5 0 9.38-.55a3.02 3.02 0 0 0 2.12-2.14A31.7 31.7 0 0 0 24 12a31.7 31.7 0 0 0-.5-5.81zM9.75 15.02V8.98L15.5 12l-5.75 3.02z" />
    </svg>
  );
}

function InstagramIcon({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg className={className} style={style} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.97.24 2.44.41.61.24 1.05.52 1.51.98.46.46.74.9.98 1.51.17.47.36 1.27.41 2.44.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.24 1.97-.41 2.44a4.07 4.07 0 0 1-.98 1.51c-.46.46-.9.74-1.51.98-.47.17-1.27.36-2.44.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.97-.24-2.44-.41a4.07 4.07 0 0 1-1.51-.98 4.07 4.07 0 0 1-.98-1.51c-.17-.47-.36-1.27-.41-2.44C2.17 15.58 2.16 15.2 2.16 12s.01-3.58.07-4.85c.05-1.17.24-1.97.41-2.44.24-.61.52-1.05.98-1.51.46-.46.9-.74 1.51-.98.47-.17 1.27-.36 2.44-.41C8.42 2.17 8.8 2.16 12 2.16zM12 0C8.74 0 8.33.01 7.05.07 5.78.13 4.9.33 4.14.63a5.77 5.77 0 0 0-2.09 1.36A5.77 5.77 0 0 0 .69 4.08C.39 4.84.19 5.72.13 6.99.07 8.27.06 8.68.06 11.94v.12c0 3.26.01 3.67.07 4.95.06 1.27.26 2.15.56 2.91.31.79.72 1.46 1.36 2.09a5.77 5.77 0 0 0 2.09 1.36c.76.3 1.64.5 2.91.56C8.33 23.99 8.74 24 12 24s3.67-.01 4.95-.07c1.27-.06 2.15-.26 2.91-.56a5.77 5.77 0 0 0 2.09-1.36 5.77 5.77 0 0 0 1.36-2.09c.3-.76.5-1.64.56-2.91.06-1.28.07-1.69.07-4.95v-.12c0-3.26-.01-3.67-.07-4.95-.06-1.27-.26-2.15-.56-2.91a5.77 5.77 0 0 0-1.36-2.09A5.77 5.77 0 0 0 19.86.63C19.1.33 18.22.13 16.95.07 15.67.01 15.26 0 12 0zm0 5.84a6.16 6.16 0 1 0 0 12.32 6.16 6.16 0 0 0 0-12.32zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm7.85-10.4a1.44 1.44 0 1 0-2.88 0 1.44 1.44 0 0 0 2.88 0z" />
    </svg>
  );
}

function TwitterIcon({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg className={className} style={style} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function LinkedInIcon({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg className={className} style={style} viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.34V9h3.41v1.56h.05a3.74 3.74 0 0 1 3.37-1.85c3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.07 2.07 0 1 1 0-4.14 2.07 2.07 0 0 1 0 4.14zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77A1.75 1.75 0 0 0 0 1.73v20.54C0 23.22.79 24 1.77 24h20.45c.98 0 1.78-.78 1.78-1.73V1.73C24 .78 23.2 0 22.22 0z" />
    </svg>
  );
}

const platformIcons = {
  youtube: YoutubeIcon,
  instagram: InstagramIcon,
  twitter: TwitterIcon,
  linkedin: LinkedInIcon,
};

const platformColors = {
  youtube: "#FF0000",
  instagram: "#E4405F",
  twitter: "#1DA1F2",
  linkedin: "#0077B5",
};

export default function CreatorCard({ creator }: { creator: Creator }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="group rounded-lg border border-border/60 bg-white p-5 transition-all hover:border-brand-coral/30 hover:shadow-md"
    >
      {/* Header: Avatar + Info */}
      <div className="flex items-start gap-3.5">
        <div
          className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl text-sm font-bold text-white"
          style={{ background: `linear-gradient(135deg, ${creator.gradientFrom}, ${creator.gradientTo})` }}
        >
          {creator.avatar}
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-bold text-brand-dark truncate">{creator.name}</h3>
          <p className="text-xs text-brand-gray">@{creator.username}</p>
          <p className="mt-0.5 text-[10px] font-medium text-brand-coral">{creator.niche}</p>
        </div>
        {/* Subscriber badge */}
        <span className="flex-shrink-0 rounded-full bg-brand-surface px-2.5 py-1 text-[10px] font-semibold text-brand-dark">
          {creator.subscribers}
        </span>
      </div>

      {/* Bio */}
      <p className="mt-3 text-xs leading-relaxed text-brand-gray line-clamp-2">{creator.bio}</p>

      {/* Platform icons */}
      <div className="mt-3 flex items-center gap-2">
        {creator.socials.map((social) => {
          const Icon = platformIcons[social.platform];
          return (
            <div
              key={social.platform}
              className="flex items-center gap-1 rounded-full bg-brand-surface px-2 py-1"
              title={`${social.handle} · ${social.followers}`}
            >
              <Icon className="h-3 w-3" style={{ color: platformColors[social.platform] }} />
              <span className="text-[10px] font-medium text-brand-gray">{social.followers}</span>
            </div>
          );
        })}
      </div>

      {/* Meta row */}
      <div className="mt-3.5 flex items-center gap-3 text-[11px] text-brand-gray">
        <span className="flex items-center gap-1">
          <MapPin className="h-3 w-3" />
          {creator.location}
        </span>
        {creator.activeJobs > 0 && (
          <span className="flex items-center gap-1 font-semibold text-brand-indigo">
            <Briefcase className="h-3 w-3" />
            {creator.activeJobs} open {creator.activeJobs === 1 ? "job" : "jobs"}
          </span>
        )}
      </div>

      {/* Category tags */}
      <div className="mt-3 flex flex-wrap gap-1.5">
        {creator.categoryTags.map((tag) => (
          <span key={tag} className="rounded-full bg-brand-surface px-2.5 py-0.5 text-[10px] font-medium text-brand-gray">
            {tag}
          </span>
        ))}
      </div>

      {/* Footer */}
      <div className="mt-4 border-t border-border/40 pt-3.5">
        <Link
          href={`/creator/${creator.username}`}
          className="flex items-center justify-center gap-1.5 rounded-md bg-brand-surface px-4 py-2 text-xs font-semibold text-brand-dark transition-colors hover:bg-brand-surface-alt group-hover:bg-brand-coral group-hover:text-white"
        >
          View Profile
          <ArrowRight className="h-3 w-3" />
        </Link>
      </div>
    </motion.div>
  );
}
