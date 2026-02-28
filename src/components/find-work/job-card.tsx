"use client";

import { motion } from "framer-motion";
import { Clock, Wallet, ArrowRight, Users, FileEdit } from "lucide-react";
import Link from "next/link";
import type { Job } from "@/lib/mock-jobs";
import { categories } from "@/lib/categories-data";

function getSubcategoryTitle(categorySlug: string, subcategorySlug?: string): string | null {
  if (!subcategorySlug) return null;
  const cat = categories.find((c) => c.slug === categorySlug);
  const sub = cat?.subcategories.find((s) => s.slug === subcategorySlug);
  return sub?.title ?? null;
}

function getTimeRemaining(createdAt: string, deadlineHours: number): string {
  const created = new Date(createdAt).getTime();
  const deadline = created + deadlineHours * 60 * 60 * 1000;
  const now = Date.now();
  const remaining = deadline - now;

  if (remaining <= 0) return "Closed";
  const hours = Math.floor(remaining / (60 * 60 * 1000));
  if (hours >= 24) return `${Math.floor(hours / 24)}d left`;
  return `${hours}h left`;
}

export default function JobCard({ job }: { job: Job }) {
  const appCount = job.currentApplications ?? 0;
  const maxApps = job.maxApplications ?? 15;
  const appPct = Math.min((appCount / maxApps) * 100, 100);
  const timeLeft = getTimeRemaining(job.createdAt, job.applicationDeadlineHours ?? 48);
  const isClosed = job.status !== "open" || timeLeft === "Closed" || appCount >= maxApps;
  const wantsTest = job.applicationRequirements?.testSample;
  const subcategoryTitle = getSubcategoryTitle(job.categorySlug, job.subcategorySlug);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={`group rounded-lg border border-border/60 bg-white p-5 transition-all hover:border-brand-indigo/30 hover:shadow-md ${isClosed ? "opacity-60" : ""}`}
    >
      {/* Top Row */}
      <div className="mb-3 flex items-start justify-between">
        <div className="flex flex-wrap items-center gap-1.5">
          <span
            className="rounded-full px-2.5 py-0.5 text-[10px] font-semibold"
            style={{ backgroundColor: job.categoryColor + "12", color: job.categoryColor }}
          >
            {job.categoryLabel}
          </span>
          {subcategoryTitle && (
            <span className="rounded-full border border-border/60 bg-brand-surface px-2.5 py-0.5 text-[10px] font-medium text-brand-gray">
              {subcategoryTitle}
            </span>
          )}
          {wantsTest && (
            <span className="flex items-center gap-0.5 rounded-full bg-amber-50 px-2 py-0.5 text-[9px] font-semibold text-amber-700">
              <FileEdit className="h-2.5 w-2.5" /> Test
            </span>
          )}
        </div>
        <span className="flex-shrink-0 pl-2 text-[10px] text-brand-gray-light">{job.postedAgo}</span>
      </div>

      {/* Title */}
      <Link href={`/find-work/${job.id}`} className="block">
        <h3 className="mb-2 text-sm font-bold text-brand-dark leading-snug hover:text-brand-indigo transition-colors">
          {job.title}
        </h3>
      </Link>
      <p className="mb-4 text-xs leading-relaxed text-brand-gray line-clamp-2">{job.description}</p>

      {/* Meta */}
      <div className="mb-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-brand-gray">
        <span className="flex items-center gap-1">
          <Wallet className="h-3 w-3" />
          {job.budget} <span className="text-brand-gray-light">({job.budgetType})</span>
        </span>
        <span className="flex items-center gap-1">
          <Clock className="h-3 w-3" />
          {job.timeline}
        </span>
      </div>

      {/* Applicant Progress */}
      <div className="mb-4 flex items-center gap-2.5">
        <div className="flex items-center gap-1 text-[10px] font-semibold">
          <Users className="h-3 w-3 text-brand-indigo" />
          <span className={appCount >= maxApps ? "text-brand-coral" : "text-brand-dark"}>
            {appCount}/{maxApps}
          </span>
          <span className="text-brand-gray font-normal">applied</span>
        </div>
        <div className="flex-1 h-1 rounded-full bg-brand-surface">
          <div
            className={`h-full rounded-full transition-all ${appCount >= maxApps ? "bg-brand-coral" : "bg-brand-indigo"}`}
            style={{ width: `${appPct}%` }}
          />
        </div>
        <span className={`text-[10px] font-medium ${isClosed ? "text-brand-coral" : "text-brand-gray"}`}>
          {isClosed ? "Closed" : timeLeft}
        </span>
      </div>

      {/* Creator + Apply */}
      <div className="flex items-center justify-between border-t border-border/40 pt-3.5">
        <Link
          href={`/profile/@${job.creator.username}`}
          className="flex items-center gap-2 transition-opacity hover:opacity-80"
        >
          <div
            className="flex h-7 w-7 items-center justify-center rounded-full text-[9px] font-bold text-white"
            style={{ background: `linear-gradient(135deg, ${job.creator.gradientFrom}, ${job.creator.gradientTo})` }}
          >
            {job.creator.avatar}
          </div>
          <div>
            <p className="text-[11px] font-semibold text-brand-dark">{job.creator.name}</p>
            <p className="text-[9px] text-brand-gray-light">{job.creator.subscribers} subs</p>
          </div>
        </Link>
        <Link
          href={`/find-work/${job.id}`}
          className={`flex items-center gap-1 rounded-md px-3 py-1.5 text-[11px] font-semibold transition-all ${
            isClosed
              ? "bg-brand-surface text-brand-gray cursor-default"
              : "bg-brand-indigo text-white hover:bg-brand-indigo/90 opacity-0 group-hover:opacity-100"
          }`}
        >
          {isClosed ? "View" : "Apply"}
          <ArrowRight className="h-3 w-3" />
        </Link>
      </div>
    </motion.div>
  );
}
