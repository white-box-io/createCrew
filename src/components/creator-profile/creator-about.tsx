"use client";

import { motion } from "framer-motion";
import { Calendar, Users, Target, Youtube, Instagram, Twitter } from "lucide-react";

interface CreatorAboutProps {
  about: {
    uploadSchedule: string;
    channelCulture: string;
    vision: string;
    niche: string;
    teamSize: string;
    socials: { youtube?: string; instagram?: string; twitter?: string };
  };
}

export default function CreatorAbout({ about }: CreatorAboutProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="grid gap-6 lg:grid-cols-2"
    >
      {/* Left — Main Info */}
      <div className="space-y-6">
        <div className="rounded-lg border border-border/60 bg-white p-5">
          <h3 className="mb-3 text-sm font-bold text-brand-dark">About the Channel</h3>
          <p className="text-xs leading-relaxed text-brand-gray">{about.channelCulture}</p>
        </div>

        <div className="rounded-lg border border-border/60 bg-white p-5">
          <h3 className="mb-3 text-sm font-bold text-brand-dark">Our Vision</h3>
          <p className="text-xs leading-relaxed text-brand-gray">{about.vision}</p>
        </div>
      </div>

      {/* Right — Quick Facts */}
      <div className="space-y-6">
        <div className="rounded-lg border border-border/60 bg-white p-5">
          <h3 className="mb-4 text-sm font-bold text-brand-dark">Quick Facts</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-2 text-brand-gray">
                <Calendar className="h-3.5 w-3.5" />
                Upload Schedule
              </span>
              <span className="font-semibold text-brand-dark">{about.uploadSchedule}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-2 text-brand-gray">
                <Target className="h-3.5 w-3.5" />
                Niche
              </span>
              <span className="font-semibold text-brand-dark">{about.niche}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-2 text-brand-gray">
                <Users className="h-3.5 w-3.5" />
                Team Size
              </span>
              <span className="font-semibold text-brand-dark">{about.teamSize}</span>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-border/60 bg-white p-5">
          <h3 className="mb-4 text-sm font-bold text-brand-dark">Connected Platforms</h3>
          <div className="space-y-2.5">
            {about.socials.youtube && (
              <a href={about.socials.youtube} target="_blank" rel="noreferrer" className="flex items-center gap-2.5 text-xs text-brand-gray hover:text-brand-dark transition-colors">
                <Youtube className="h-4 w-4 text-red-500" />
                YouTube Channel
              </a>
            )}
            {about.socials.instagram && (
              <a href={about.socials.instagram} target="_blank" rel="noreferrer" className="flex items-center gap-2.5 text-xs text-brand-gray hover:text-brand-dark transition-colors">
                <Instagram className="h-4 w-4 text-pink-500" />
                Instagram Profile
              </a>
            )}
            {about.socials.twitter && (
              <a href={about.socials.twitter} target="_blank" rel="noreferrer" className="flex items-center gap-2.5 text-xs text-brand-gray hover:text-brand-dark transition-colors">
                <Twitter className="h-4 w-4" />
                Twitter / X
              </a>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
